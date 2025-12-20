
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Manual .env parser since dotenv might not be installed/available in this context
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) return {};

        const content = fs.readFileSync(envPath, 'utf-8');
        const env = {};

        content.split('\n').forEach(line => {
            line = line.trim();
            if (!line || line.startsWith('#')) return;

            const idx = line.indexOf('=');
            if (idx === -1) return;

            const key = line.substring(0, idx);
            let val = line.substring(idx + 1);

            // Handle quotes
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.substring(1, val.length - 1);
            }

            env[key] = val;
        });
        return env;
    } catch (e) {
        console.error("Error parsing .env:", e);
        return {};
    }
}

async function run() {
    console.log('--- Testing Google Credentials from .env ---');
    const env = loadEnv();

    // Check key presence
    const jsonKey = env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!jsonKey) {
        console.error('❌ GOOGLE_SERVICE_ACCOUNT_JSON not found in .env');
        return;
    }
    console.log('✅ Found GOOGLE_SERVICE_ACCOUNT_JSON in .env');

    try {
        // Parse the JSON string
        const credentials = JSON.parse(jsonKey);
        console.log('✅ Successfully parsed JSON key');
        console.log(`   Client Email: ${credentials.client_email}`);

        // Try to authenticate
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // Make a simple API call (list files)
        console.log('⌛ Attempting to contact Google Drive API...');
        const res = await drive.files.list({ pageSize: 1 });

        if (res.status === 200) {
            console.log('✅ Google Drive API connection successful!');
            console.log('   (Did not crash, auth is valid)');
        } else {
            console.error('❌ Google Drive API returned status:', res.status);
        }

    } catch (e) {
        console.error('❌ Error during testing:', e.message);
        if (e.message.includes('PEM routines')) {
            console.error('   (This usually means the private key format in .env is incorrect)');
        }
    }
}

run();
