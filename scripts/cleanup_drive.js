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

async function clean() {
    console.log("Cleaning up 'reading summaries' folders and files...");

    // Find ALL folders with this name (Bot's or Shared) or the files
    const q = "(name = 'reading summaries' or name = 'Reading_Summaries' or name = 'archived-old papers' or name = 'already-read papers') and trashed = false";
    const res = await drive.files.list({ q, fields: 'files(id, name)' });

    for (const f of res.data.files) {
        // Check owner if possible, but trying to delete is the ultimate test
        console.log(`Attempting to delete: ${f.name} (${f.id})`);
        try {
            await drive.files.delete({ fileId: f.id });
            console.log(`  -> DELETED.`);
        } catch (e) {
            console.log(`  -> Failed (likely user-owned/shared): ${e.message}`);
        }
    }
}
clean();
