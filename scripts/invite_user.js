import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Get Secret Key
let secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey) {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            const match = envContent.match(/CLERK_SECRET_KEY=(.+)/);
            if (match) {
                secretKey = match[1].trim();
                // Remove quotes if present
                if ((secretKey.startsWith('"') && secretKey.endsWith('"')) || (secretKey.startsWith("'") && secretKey.endsWith("'"))) {
                    secretKey = secretKey.slice(1, -1);
                }
            }
        }
    } catch (e) {
        console.error("Failed to read .env", e);
    }
}

if (!secretKey) {
    console.error("Error: CLERK_SECRET_KEY not found.");
    process.exit(1);
}

// 2. Send Invitation
const email = "sophiogabatashvili@gmail.com";

console.log(`Sending invitation to ${email}...`);

async function invite() {
    try {
        const response = await fetch('https://api.clerk.com/v1/invitations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_address: email,
                ignore_existing: true
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Success! Invitation created.");
            console.log("Invitation Status:", data.status);
            console.log("Revoke ID:", data.id);
            console.log("\nShe should receive an email shortly with a link to sign up.");
        } else {
            console.error("Failed to create invitation.");
            console.error("Error:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}

invite();
