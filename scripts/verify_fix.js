import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonVar = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON;
if (!jsonVar) { process.exit(1); }

const credentials = JSON.parse(jsonVar);
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents'],
});
const drive = google.drive({ version: 'v3', auth });
const docs = google.docs({ version: 'v1', auth });

async function verifyAndWrite() {
    console.log("--- FINAL VERIFICATION SCRIPT ---");

    // 1. Find Folder
    const q = "(name = 'reading summaries' or name = 'Reading_Summaries') and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
    const folderRes = await drive.files.list({ q, fields: 'files(id, name)' });

    if (!folderRes.data.files.length) {
        console.error("❌ Folder NOT Found.");
        return;
    }
    const folder = folderRes.data.files[0];
    console.log(`✅ Folder: ${folder.name} (${folder.id})`);

    // 2. Find Docs (Lenient Search)
    const targetNames = [
        "archived-old papers",
        "already-read papers",
        "already-read-papers" // Added lenient match
    ];

    // Construct query to match ANY of these names inside the folder
    const namingQuery = targetNames.map(n => `name = '${n}'`).join(' or ');
    const docQ = `(${namingQuery}) and '${folder.id}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`;

    const docRes = await drive.files.list({ q: docQ, fields: 'files(id, name)' });

    if (docRes.data.files.length === 0) {
        console.error("❌ No matching documents found.");
        return;
    }

    console.log(`✅ Found ${docRes.data.files.length} documents:`);

    for (const doc of docRes.data.files) {
        console.log(`   - ${doc.name} (${doc.id}) -> Attempting Write...`);
        try {
            await docs.documents.batchUpdate({
                documentId: doc.id,
                requestBody: {
                    requests: [{
                        insertText: {
                            location: { index: 1 },
                            text: `\n[VERIFIED] Connection Successful at ${new Date().toLocaleTimeString()}\n`
                        }
                    }]
                }
            });
            console.log("     ✅ Write SUCCESSFUL.");
        } catch (e) {
            console.error("     ❌ Write FAILED: " + e.message);
        }
    }
}

verifyAndWrite();
