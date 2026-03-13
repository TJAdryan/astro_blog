import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const env = fs.readFileSync(envPath, 'utf8');

let credentialsStr;
env.split('\n').forEach(line => {
    if (line.startsWith('GOOGLE_SERVICE_ACCOUNT_JSON=')) {
        credentialsStr = line.substring('GOOGLE_SERVICE_ACCOUNT_JSON='.length);
        if (credentialsStr.startsWith("'") && credentialsStr.endsWith("'")) {
            credentialsStr = credentialsStr.substring(1, credentialsStr.length - 1);
        }
    }
});

const credentials = JSON.parse(credentialsStr);
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
});
const docs = google.docs({ version: 'v1', auth });

const documentId = '1T7ytVl8r9sWkcEp5HxfVuN8p3YRIvGcFTaZMYefG0mw';

async function test() {
    try {
        const doc = await docs.documents.get({ documentId });
        const text = doc.data.body.content
            .map(c => c.paragraph?.elements?.map(e => e.textRun?.content || '').join('') || '')
            .join('');
        console.log('Document text:\n', JSON.stringify(text));
    } catch (e) {
        console.error(e);
    }
}
test();
