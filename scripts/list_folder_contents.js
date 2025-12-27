import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonVar = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON;
if (!jsonVar) { process.exit(1); }

const credentials = JSON.parse(jsonVar);
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

async function listContents() {
    console.log("--- DEBUGGER: Listing Folder Contents ---");

    // 1. Find Folder
    const q = "(name = 'reading summaries' or name = 'Reading_Summaries') and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
    const folderRes = await drive.files.list({ q, fields: 'files(id, name)' });

    if (!folderRes.data.files || folderRes.data.files.length === 0) {
        console.error("❌ Folder NOT FOUND.");
        return;
    }

    const folder = folderRes.data.files[0];
    console.log(`Folder: '${folder.name}' (${folder.id})`);

    // 2. List Children
    console.log(`Listing contents of ${folder.id}...`);
    const childrenRes = await drive.files.list({
        q: `'${folder.id}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)'
    });

    if (childrenRes.data.files.length === 0) {
        console.log("-> [EMPTY] The bot sees 0 files in this folder.");
    } else {
        childrenRes.data.files.forEach(f => {
            console.log(`-> Found: '${f.name}' [${f.mimeType}] (${f.id})`);
        });
    }
}
listContents();
