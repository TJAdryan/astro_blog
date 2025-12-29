import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';

export const prerender = false;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.resolve(__dirname, '../../data/article_queue.json');
const LOG_FILE = path.resolve(__dirname, '../../data/completed_log.json');

export const POST = async ({ request, redirect }) => {
    const data = await request.formData();
    const summary = data.get('summary');
    const articleId = data.get('articleId');
    const articleTitle = data.get('articleTitle');
    const articleLink = data.get('articleLink');

    if (!summary || summary.length < 300) {
        return new Response('Summary too short', { status: 400 });
    }

    console.log(`[API] submit-summary hit for: ${articleTitle}`);

    let stage = 'Initiating';
    let documentId = 'SKIPPED_GOOGLE_FAILURE';
    let auth = null;
    let docs = null;
    let driveService = null;

    try {
        // 1. Google Auth (Robust Fallback)
        stage = 'Google Auth';

        const pEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON;
        const mEnv = import.meta.env?.GOOGLE_SERVICE_ACCOUNT_JSON || import.meta.env?.GOOGLE_SERVICES_ACCOUNT_JSON;
        let jsonVar = pEnv || mEnv;

        // FALLBACK
        if (!jsonVar) {
            try {
                const envPath = path.resolve(process.cwd(), '.env');
                if (fs.existsSync(envPath)) {
                    console.log(`[API] Manually reading .env from ${envPath}`);
                    const envFile = fs.readFileSync(envPath, 'utf-8');
                    const lines = envFile.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('GOOGLE_SERVICE_ACCOUNT_JSON=')) {
                            let value = line.substring(line.indexOf('=') + 1);
                            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.slice(1, -1);
                            }
                            jsonVar = value.replace(/\\n/g, '\n');
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error('[API] Manual .env read failed:', e);
            }
        }

        if (jsonVar) {
            try {
                const credentials = JSON.parse(jsonVar);
                auth = new google.auth.GoogleAuth({
                    credentials,
                    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
                });
                docs = google.docs({ version: 'v1', auth });
                driveService = google.drive({ version: 'v3', auth });

                stage = 'Finding Folder';
                let folderId = null;
                const folderQuery = "(name = 'reading summaries' or name = 'Reading_Summaries') and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
                const folderRes = await driveService.files.list({
                    q: folderQuery,
                    spaces: 'drive',
                    fields: 'files(id, name)'
                });

                if (folderRes.data.files && folderRes.data.files.length > 0) {
                    folderId = folderRes.data.files[0].id;
                    const targetDocName = 'already-read papers';

                    stage = `Finding Document: ${targetDocName}`;
                    const hyphenatedName = targetDocName.replace(/ /g, '-');
                    const docQuery = `(name = '${targetDocName}' or name = '${hyphenatedName}') and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`;
                    const searchRes = await driveService.files.list({
                        q: docQuery,
                        spaces: 'drive',
                        fields: 'files(id, name)'
                    });

                    if (searchRes.data.files && searchRes.data.files.length > 0) {
                        const docId = searchRes.data.files[0].id;
                        documentId = docId; // Save for log
                        stage = 'Appending Summary';
                        await docs.documents.batchUpdate({
                            documentId: docId,
                            requestBody: {
                                requests: [
                                    {
                                        insertText: {
                                            location: { index: 1 },
                                            // Format: Date, Title, Link, Summary
                                            text: `[${new Date().toLocaleDateString()}] SUMMARY: ${articleTitle}\nLink: ${articleLink}\n\n${summary}\n\n----------------------------------------\n\n`,
                                        },
                                    },
                                ],
                            },
                        });
                        console.log('[API] Summary appended.');
                    } else {
                        console.error(`[API] Doc '${targetDocName}' not found.`);
                    }
                } else {
                    console.error('[API] Folder not found.');
                }
            } catch (googleError) {
                console.error(`Google Integration Error [Stage: ${stage}]:`, googleError);
            }
        }

        // 2. Remove from Queue (GitHub + Local)
        stage = 'Queue Update';
        const githubToken = process.env.GITHUB_TOKEN;

        // GitHub
        if (githubToken) {
            try {
                const repoOwner = 'TJAdryan';
                const repoName = 'astro_blog';
                const filePath = 'src/data/article_queue.json';
                const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
                const getResponse = await fetch(getUrl, {
                    headers: { 'Authorization': `Bearer ${githubToken}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'Astro-Blog-App' }
                });

                if (getResponse.ok) {
                    const fileData = await getResponse.json();
                    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                    const queue = JSON.parse(content);
                    const updatedQueue = queue.filter(item => {
                        const itemId = String(item.id).trim();
                        const targetId = String(articleId).trim();
                        // Check exact match or decoded match (for URL IDs)
                        return itemId !== targetId && itemId !== decodeURIComponent(targetId);
                    });

                    await fetch(getUrl, {
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
                }
            } catch (ghError) {
                console.error('GitHub API Error:', ghError);
            }
        }

        // Local Queue Update - ALWAYS
        stage = 'Local File System Update';
        try {
            if (fs.existsSync(QUEUE_FILE)) {
                const fileContent = fs.readFileSync(QUEUE_FILE, 'utf-8');
                const queue = JSON.parse(fileContent);
                const updatedQueue = queue.filter(item => {
                    const itemId = String(item.id).trim();
                    const targetId = String(articleId).trim();
                    return itemId !== targetId && itemId !== decodeURIComponent(targetId);
                });
                fs.writeFileSync(QUEUE_FILE, JSON.stringify(updatedQueue, null, 2));
                console.log('[API] Local queue updated.');
            }
        } catch (localError) {
            console.error('Local File Update Error:', localError);
        }

        // 3. Update Completed Log
        stage = 'Log Update';
        try {
            let log = [];
            if (fs.existsSync(LOG_FILE)) {
                log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
            }
            log.push({
                id: articleId,
                title: articleTitle,
                completedAt: new Date().toISOString(),
                googleDocId: documentId !== 'SKIPPED_GOOGLE_FAILURE' ? documentId : null,
                googleDocLink: documentId !== 'SKIPPED_GOOGLE_FAILURE' ? `https://docs.google.com/document/d/${documentId}` : null
            });
            fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
            console.log('[API] Log updated.');
        } catch (logError) {
            console.error('Failed to update completed log:', logError);
        }

        return redirect('/private?success=true');

    } catch (error) {
        console.error(`Error in stage ${stage}:`, error);
        return new Response(`Error in stage [${stage}]: ${error.message}`, { status: 500 });
    }
};
