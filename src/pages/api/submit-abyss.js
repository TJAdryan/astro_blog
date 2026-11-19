import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const prerender = false;

import { google } from 'googleapis';

const DOCUMENT_ID = '1T7ytVl8r9sWkcEp5HxfVuN8p3YRIvGcFTaZMYefG0mw';

export const POST = async ({ request, redirect }) => {
    try {
        const data = await request.formData();
        const rawDream = data.get('dream_details');
        const dream =
            typeof rawDream === 'string'
                ? rawDream
                      .replace(/---+/g, '—')
                      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
                      .trim()
                      .slice(0, 500)
                : '';

        let credentialsStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

        // Fallback for local development if process.env isn't populated yet
        if (!credentialsStr) {
            try {
                const envPath = path.resolve(process.cwd(), '.env');
                const env = fs.readFileSync(envPath, 'utf8');
                env.split('\n').forEach(line => {
                    if (line.startsWith('GOOGLE_SERVICE_ACCOUNT_JSON=')) {
                        credentialsStr = line.substring('GOOGLE_SERVICE_ACCOUNT_JSON='.length);
                        if (credentialsStr.startsWith("'") && credentialsStr.endsWith("'")) {
                            credentialsStr = credentialsStr.substring(1, credentialsStr.length - 1);
                        }
                    }
                });
            } catch (e) {
                console.error("Could not read local env", e);
            }
        }

        if (dream.length > 0 && credentialsStr) {
            const entry = {
                date: new Date().toISOString(),
                dream: dream
            };

            const credentials = JSON.parse(credentialsStr);
            const auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/documents'],
            });
            const docs = google.docs({ version: 'v1', auth });

            const docContent = `[${entry.date}]\n${entry.dream}\n---\n`;

            await docs.documents.batchUpdate({
                documentId: DOCUMENT_ID,
                requestBody: {
                    requests: [
                        {
                            insertText: {
                                location: { index: 1 },
                                text: docContent,
                            },
                        },
                    ],
                },
            });
        }

        return redirect('/abyss');
    } catch (e) {
        console.error('Failed to save to abyss docs:', e);
        // Even on error, send them to the abyss
        return redirect('/abyss');
    }
};
