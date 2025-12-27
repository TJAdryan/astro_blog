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

async function verifyQuery() {
    console.log("--- TESTING LIVE QUERY LOGIC ---");

    // 1. REPLICATE THE EXACT LOGIC FROM archive-article.js
    // Folder Logic
    const folderQuery = "(name = 'reading summaries' or name = 'Reading_Summaries') and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
    const folderRes = await drive.files.list({ q: folderQuery });

    if (!folderRes.data.files.length) {
        console.error("❌ FOLDER NOT FOUND.");
        return;
    }
    const folderId = folderRes.data.files[0].id;
    console.log(`✅ Folder ID: ${folderId}`);

    // Doc Logic - TEST BOTH "archive" and "read"
    const targets = ["archived-old papers", "already-read papers"];

    for (const targetDocName of targets) {
        console.log(`Checking Query for '${targetDocName}'...`);

        // --- THIS IS THE EXACT LINE COPIED FROM CODE ---
        const hyphenatedName = targetDocName.replace(/ /g, '-');
        const docQuery = `(name = '${targetDocName}' or name = '${hyphenatedName}') and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`;
        // -----------------------------------------------

        console.log(`   Query: ${docQuery}`);
        const searchRes = await drive.files.list({ q: docQuery });

        if (searchRes.data.files.length > 0) {
            console.log(`   ✅ FOUND: ${searchRes.data.files[0].name} (${searchRes.data.files[0].id})`);
        } else {
            console.error(`   ❌ NOT FOUND.`);
            // Diagnostic: Why?
            const listAll = await drive.files.list({ q: `'${folderId}' in parents and trashed = false` });
            console.log("   diagnostic: folder contents are:");
            listAll.data.files.forEach(f => console.log(`     - ${f.name} (${f.mimeType})`));
        }
    }
}
verifyQuery();
