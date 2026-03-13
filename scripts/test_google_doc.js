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
        console.log('Doc title:', doc.data.title);
        
        // Let's also try to append a test line
        await docs.documents.batchUpdate({
            documentId,
            requestBody: {
                requests: [
                    {
                        insertText: {
                            location: { index: 1 },
                            text: "Hello from test!\n",
                        },
                    },
                ],
            },
        });
        console.log('Successfully wrote to doc!');
    } catch (e) {
        console.error(e);
    }
}
test();
