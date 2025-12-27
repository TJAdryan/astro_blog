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

async function testWrite() {
    console.log("--- DEBUGGER: Testing Write Access ---");

    // 1. Find Folder
    console.log("Searching for folder 'Reading_Summaries' OR 'reading summaries'...");
    const q = "(name = 'reading summaries' or name = 'Reading_Summaries') and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
    const folderRes = await drive.files.list({ q, fields: 'files(id, name)' });

    if (!folderRes.data.files || folderRes.data.files.length === 0) {
        console.error("❌ ERROR: Folder NOT FOUND. The bot cannot see your folder.");
        console.error("   Solution: Share 'Reading_Summaries' with: " + credentials.client_email);
        return;
    }

    const folder = folderRes.data.files[0];
    console.log(`✅ Folder FOUND: '${folder.name}' (${folder.id})`);

    // 2. Find File
    const targetDoc = "archived-old papers";
    console.log(`Searching for file '${targetDoc}' inside folder...`);
    const fileQ = `name = '${targetDoc}' and '${folder.id}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`;
    const fileRes = await drive.files.list({ q: fileQ, fields: 'files(id, name)' });

    if (!fileRes.data.files || fileRes.data.files.length === 0) {
        console.error(`❌ ERROR: File '${targetDoc}' NOT FOUND inside the folder.`);
        console.error(`   Solution: Create a Google Doc named '${targetDoc}' inside '${folder.name}'.`);

        // Attempt Create to prove failure
        try {
            console.log("   Attempting to CREATE it (this will likely fail due to 0MB quota)...");
            const create = await drive.files.create({
                resource: { name: targetDoc, parents: [folder.id], mimeType: 'application/vnd.google-apps.document' }
            });
            console.log("   ⚠️  SURPRISE: Creation SUCCEEDED. ID: " + create.data.id);
        } catch (e) {
            console.error("   ❌ Creation FAILED as expected: " + e.message);
        }
        return;
    }

    const file = fileRes.data.files[0];
    console.log(`✅ File FOUND: '${file.name}' (${file.id})`);

    // 3. Write
    console.log("Attempting to WRITE to file...");
    try {
        await docs.documents.batchUpdate({
            documentId: file.id,
            requestBody: {
                requests: [{
                    insertText: {
                        location: { index: 1 },
                        text: `\n[DEBUG TEST] Write successful at ${new Date().toLocaleTimeString()}\n`
                    }
                }]
            }
        });
        console.log("✅ SUCCESS: Text written to document!");
    } catch (e) {
        console.error("❌ ERROR: Write Failed: " + e.message);
    }
}

testWrite();
