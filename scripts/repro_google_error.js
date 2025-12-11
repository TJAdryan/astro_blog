
import { google } from 'googleapis';

async function run() {
    console.log('Testing Google Drive API initialization...');

    // Mock env var if not present just to see if the import works
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        console.log('No GOOGLE_SERVICE_ACCOUNT_JSON found. simulating bypass logic.');
        return;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
            scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
        });

        console.log('Auth initialized.');

        try {
            const drive = google.drive({ version: 'v3', auth });
            console.log('Drive API initialized:', !!drive);

            if (!drive) {
                console.error('Drive object is falsy!');
            } else if (!drive.files) {
                console.error('Drive.files is undefined!');
            } else {
                console.log('Drive.files exists.');
            }

        } catch (e) {
            console.error('Error initializing drive:', e);
        }

    } catch (e) {
        console.error('Auth init failed:', e);
    }
}

run();
