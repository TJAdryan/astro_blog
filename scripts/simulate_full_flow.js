import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- 1. AUTH LOGIC (COPIED EXACTLY FROM APP) ---
let jsonVar = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON;

// FALLBACK: Manual .env read (EXACT LOGIC FROM APP)
if (!jsonVar) {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            console.log(`[SIMULATION] Manually reading .env from ${envPath}`);
            const envFile = fs.readFileSync(envPath, 'utf-8');
            const lines = envFile.split('\n');
            for (const line of lines) {
                if (line.startsWith('GOOGLE_SERVICE_ACCOUNT_JSON=')) {
                    let value = line.substring(line.indexOf('=') + 1);
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    jsonVar = value.replace(/\\n/g, '\n');
                    console.log('[SIMULATION] Found credentials via manual read.');
                    break;
                }
            }
        }
    } catch (e) {
        console.error('[SIMULATION] Manual .env read failed:', e);
    }
}

if (!jsonVar) {
    console.error("❌ CRITICAL: Could not load credentials locally.");
    process.exit(1);
}

const credentials = JSON.parse(jsonVar);
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
});
const docs = google.docs({ version: 'v1', auth });
const driveService = google.drive({ version: 'v3', auth });

// --- 2. EXECUTION LOGIC (COPIED EXACTLY FROM APP) ---
async function simulateArchive(type) {
    console.log(`\n--- SIMULATING ACTION: ${type.toUpperCase()} ---`);
    let targetDocName = 'archived-old papers';
    if (type === 'read') targetDocName = 'already-read papers';

    // A. FIND FOLDER
    const folderQuery = "(name = 'reading summaries' or name = 'Reading_Summaries') and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
    const folderRes = await driveService.files.list({ q: folderQuery, spaces: 'drive', fields: 'files(id, name)' });

    if (!folderRes.data.files.length) { console.error("❌ Folder not found"); return; }
    const folderId = folderRes.data.files[0].id;
    console.log(`✅ Folder found: ${folderRes.data.files[0].name}`);

    // B. FIND DOC (SMART SEARCH)
    const hyphenatedName = targetDocName.replace(/ /g, '-');
    const docQuery = `(name = '${targetDocName}' or name = '${hyphenatedName}') and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`;
    const searchRes = await driveService.files.list({ q: docQuery, spaces: 'drive', fields: 'files(id, name)' });

    if (!searchRes.data.files.length) { console.error(`❌ Document '${targetDocName}' not found.`); return; }
    const docId = searchRes.data.files[0].id;
    console.log(`✅ Document found: ${searchRes.data.files[0].name}`);

    // C. WRITE (APPEND)
    const articleTitle = "TEST ARTICLE " + new Date().toLocaleTimeString();
    try {
        await docs.documents.batchUpdate({
            documentId: docId,
            requestBody: {
                requests: [{
                    insertText: {
                        location: { index: 1 },
                        text: `[SIMULATION] ${type.toUpperCase()}: ${articleTitle}\n\n`,
                    },
                }],
            },
        });
        console.log(`✅ SUCCESS: Wrote to '${targetDocName}'!`);
    } catch (e) {
        console.error(`❌ WRITE FAILED: ${e.message}`);
    }
}

async function run() {
    await simulateArchive('archive'); // "Skip"
    await simulateArchive('read');    // "Read"
}
run();
