import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.join(__dirname, '../src/data/article_queue.json');

// NOTE: Hardcode credentials check
const jsonVar = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON;
if (!jsonVar) {
    console.error("FATAL: GOOGLE_SERVICE_ACCOUNT_JSON not found in env.");
    process.exit(1);
}

const credentials = JSON.parse(jsonVar);
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
});

const docs = google.docs({ version: 'v1', auth });
const driveService = google.drive({ version: 'v3', auth });

async function run() {
    console.log("--- START DEBUGGING ARCHIVE ---");
    console.log(`Checking Queue File at: ${QUEUE_FILE}`);

    // 1. Simulate finding folder
    console.log("Step 1: Check Folder 'reading summaries'");
    const folderRes = await driveService.files.list({
        q: "mimeType = 'application/vnd.google-apps.folder' and name = 'reading summaries' and trashed = false",
        spaces: 'drive',
        fields: 'files(id, name)'
    });

    let folderId = null;
    if (folderRes.data.files && folderRes.data.files.length > 0) {
        folderId = folderRes.data.files[0].id;
        console.log(`  -> Found existing folder: ${folderId}`);
    } else {
        console.log("  -> Folder not found. Attempting create...");
        const createRes = await driveService.files.create({
            resource: {
                name: 'reading summaries',
                mimeType: 'application/vnd.google-apps.folder'
            },
            fields: 'id'
        });
        folderId = createRes.data.id;
        console.log(`  -> Created new folder: ${folderId}`);
    }

    // 2. Simulate User Sharing (Hardcode a dummy email to test permissions API)
    // Replace with a known email if you have one, or just skip sharing if empty.
    // For this test, we just log availability.
    console.log(`  -> Folder ID verify: ${folderId}`);

    // 3. Simulate Finding Doc
    const targetDocName = 'archived-old papers'; // Test with this
    console.log(`Step 2: Check Doc '${targetDocName}' inside folder`);
    const searchRes = await driveService.files.list({
        q: `name = '${targetDocName}' and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
        spaces: 'drive',
        fields: 'files(id, name)'
    });

    let docId = null;
    if (searchRes.data.files && searchRes.data.files.length > 0) {
        docId = searchRes.data.files[0].id;
        console.log(`  -> Found doc: ${docId}`);
    } else {
        console.log("  -> Doc not found. Attempting create...");
        const createRes = await driveService.files.create({
            resource: {
                name: targetDocName,
                mimeType: 'application/vnd.google-apps.document',
                parents: [folderId]
            },
            fields: 'id'
        });
        docId = createRes.data.id;
        console.log(`  -> Created doc: ${docId}`);
    }

    // 4. Test Append
    console.log(`Step 3: Append text to ${docId}`);
    try {
        await docs.documents.batchUpdate({
            documentId: docId,
            requestBody: {
                requests: [{
                    insertText: {
                        location: { index: 1 },
                        text: `DEBUG TEST [${new Date().toISOString()}]\n\n`
                    }
                }]
            }
        });
        console.log("  -> Append successful");
    } catch (e) {
        console.error("  -> Append failed:", e.message);
    }
}

run().catch(console.error);
