export const prerender = false;

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRACKER_FILE = path.resolve(__dirname, '../../data/tracker_log.json');

export const POST = async ({ request, redirect }) => {
    const data = await request.formData();

    // Extract Form Data
    const entry = {
        date: new Date().toISOString(),
        tcga_progress_text: data.get('tcga_progress_text'),
        github_link: data.get('github_link'),
        tcga_progress: parseInt(data.get('tcga_progress') || '0', 10),
        compliance_notes: data.get('compliance_notes'),
        reflections: data.get('reflections')
    };

    let stage = 'Initiating';
    let documentLink = null;

    // Check if we have enough content to warrant a doc (any text field)
    const hasContent = (entry.tcga_progress_text?.length > 5) ||
        (entry.compliance_notes?.length > 5) ||
        (entry.reflections?.length > 5);

    // Handle Google Drive Logic
    if (hasContent) {
        try {
            stage = 'Google Auth';
            if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
                const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
                const auth = new google.auth.GoogleAuth({
                    credentials,
                    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
                });
                const docs = google.docs({ version: 'v1', auth });
                const driveService = google.drive({ version: 'v3', auth });

                // Create Doc
                stage = 'Google Drive Create';
                const createResponse = await driveService.files.create({
                    resource: {
                        name: `Tracker Log: ${new Date().toLocaleDateString()}`,
                        mimeType: 'application/vnd.google-apps.document'
                    },
                    fields: 'id'
                });
                const documentId = createResponse.data.id;

                // Prepare Content
                const docContent = `DAILY OUTPUT LOG - ${new Date().toLocaleDateString()}\n\n` +
                    `1. TCGA PIPELINE PROGRESS\n${entry.tcga_progress_text || 'No entry.'}\n` +
                    `${entry.github_link ? `Link: ${entry.github_link}\n` : ''}\n` +
                    `2. FHIR & GxP LEARNING\n${entry.compliance_notes || 'No entry.'}\n\n` +
                    `3. REFLECTIONS (Interesting/Not Interesting)\n${entry.reflections || 'No entry.'}\n`;

                // Write Content
                stage = 'Google Docs Write';
                await docs.documents.batchUpdate({
                    documentId,
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

                documentLink = `https://docs.google.com/document/d/${documentId}/edit`;
                entry.doc_link = documentLink;
            }
        } catch (googleError) {
            console.error(`Google Integration Error [Stage: ${stage}]:`, googleError);
            // Verify we don't crash, just log error
        }
    }

    // Save to Local Log
    try {
        let log = [];
        if (fs.existsSync(TRACKER_FILE)) {
            log = JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf-8'));
        }
        log.push(entry);
        fs.writeFileSync(TRACKER_FILE, JSON.stringify(log, null, 2));
    } catch (fsError) {
        console.error('File System Error:', fsError);
        return new Response('Failed to save log', { status: 500 });
    }

    return redirect('/tracker?success=true');
};
