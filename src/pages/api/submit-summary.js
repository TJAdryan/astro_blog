export const prerender = false;

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Adjusted path to point correctly to src/data from src/pages/api
// Adjusted path to point correctly to src/data from src/pages/api
const QUEUE_FILE = path.resolve(__dirname, '../../data/article_queue.json');
const LOG_FILE = path.resolve(__dirname, '../../data/completed_log.json');

export const POST = async ({ request, redirect }) => {
    const data = await request.formData();
    const summary = data.get('summary');
    const articleId = data.get('articleId');
    const articleTitle = data.get('articleTitle');
    const articleLink = data.get('articleLink');

    if (!summary || summary.length < 500) {
        return new Response('Summary too short', { status: 400 });
    }

    let stage = 'Initiating';
    let documentId = 'SKIPPED_LOCAL_DEV';

    // Declare variables in broader scope
    let auth = null;
    let driveService = null;
    let docs = null;

    try {
        // 1. Authenticate with Google
        stage = 'Google Auth';
        if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON) {
            try {
                // Parse credentials - support both correct and common typo variables
                const jsonVar = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON;
                const credentials = JSON.parse(jsonVar);

                auth = new google.auth.GoogleAuth({
                    credentials,
                    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
                });

                // Initialize APIs
                docs = google.docs({ version: 'v1', auth });
                driveService = google.drive({ version: 'v3', auth });

                stage = 'Google Drive Create Setup';
                if (!driveService) {
                    throw new Error('Failed to initialize Google Drive service');
                }

                stage = 'Google Drive Create';
                // Use Drive API directly to create the file
                const createResponse = await driveService.files.create({
                    resource: {
                        name: `Summary: ${articleTitle}`,
                        mimeType: 'application/vnd.google-apps.document'
                    },
                    fields: 'id'
                });

                if (!createResponse.data || !createResponse.data.id) {
                    throw new Error('Drive create response missing ID');
                }

                documentId = createResponse.data.id;

                stage = 'Google Docs Write';
                if (!docs) {
                    throw new Error('Failed to initialize Google Docs service');
                }

                await docs.documents.batchUpdate({
                    documentId,
                    requestBody: {
                        requests: [
                            {
                                insertText: {
                                    location: { index: 1 },
                                    text: `${articleTitle}\n\nLink: ${articleLink}\n\nSummary:\n${summary}\n`,
                                },
                            },
                        ],
                    },
                });
            } catch (googleError) {
                console.error(`Google Integration Error [Stage: ${stage}]:`, googleError);
                if (googleError.stack) console.error(googleError.stack);
                // Proceed so we can at least update the queue
            }
        } else {
            console.warn('GOOGLE_SERVICE_ACCOUNT_JSON not found. Skipping Google Docs creation.');
        }

        // 2. Remove from Queue
        stage = 'Queue Update';

        // Try GitHub API first if token exists
        let queueUpdated = false;
        const githubToken = process.env.GITHUB_TOKEN;

        if (githubToken) {
            stage = 'GitHub Queue Update';
            try {
                const repoOwner = 'TJAdryan';
                const repoName = 'astro_blog';
                const filePath = 'src/data/article_queue.json';

                const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
                const getResponse = await fetch(getUrl, {
                    headers: {
                        'Authorization': `Bearer ${githubToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'Astro-Blog-App'
                    }
                });

                if (getResponse.ok) {
                    const fileData = await getResponse.json();
                    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                    const queue = JSON.parse(content);
                    const updatedQueue = queue.filter(item => item.id !== articleId);

                    const updateResponse = await fetch(getUrl, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${githubToken}`,
                            'Accept': 'application/vnd.github.v3+json',
                            'User-Agent': 'Astro-Blog-App',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: `Remove processed article: ${articleTitle}`,
                            content: Buffer.from(JSON.stringify(updatedQueue, null, 2)).toString('base64'),
                            sha: fileData.sha,
                            branch: 'main'
                        })
                    });

                    if (updateResponse.ok) {
                        queueUpdated = true;
                    } else {
                        console.error('GitHub Commit Failed:', await updateResponse.text());
                    }
                }
            } catch (ghError) {
                console.error('GitHub API Error:', ghError);
            }
        }

        // Fallback to local file system if GitHub failed or token missing
        if (!queueUpdated) {
            stage = 'Local File System Update';
            console.log('Attempting local file system update...');

            // Re-verify path exists
            if (fs.existsSync(QUEUE_FILE)) {
                const fileContent = fs.readFileSync(QUEUE_FILE, 'utf-8');
                const queue = JSON.parse(fileContent);
                const updatedQueue = queue.filter(item => item.id !== articleId);

                fs.writeFileSync(QUEUE_FILE, JSON.stringify(updatedQueue, null, 2));
                queueUpdated = true;
                console.log('Successfully updated local queue file.');
            } else {
                console.error(`Queue file not found at: ${QUEUE_FILE}`);
            }
        }

        // Log completion locally if successful
        if (queueUpdated) {
            try {
                let log = [];
                if (fs.existsSync(LOG_FILE)) {
                    log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
                }
                log.push({
                    id: articleId,
                    title: articleTitle,
                    completedAt: new Date().toISOString(),
                    googleDocId: documentId !== 'SKIPPED_LOCAL_DEV' ? documentId : null,
                    googleDocLink: documentId !== 'SKIPPED_LOCAL_DEV' ? `https://docs.google.com/document/d/${documentId}` : null
                });
                fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
                console.log('Logged completion to local file.');
            } catch (logError) {
                console.error('Failed to update completed log:', logError);
            }
        }

        return redirect('/private?success=true');
    } catch (error) {
        console.error(`Error in stage ${stage}:`, error);
        return new Response(`Error in stage [${stage}]: ${error.message}`, { status: 500 });
    }
};
