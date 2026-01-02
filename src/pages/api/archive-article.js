export const prerender = false;

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.resolve(__dirname, '../../data/article_queue.json');

export const POST = async ({ request, redirect }) => {
    const data = await request.formData();
    const articleId = data.get('articleId');
    const articleTitle = data.get('articleTitle');
    const articleLink = data.get('articleLink');
    const articleDescription = data.get('articleDescription') || 'No description provided';
    const archiveType = data.get('archiveType') || 'archive'; // 'archive' or 'read'

    let targetDocName = 'archived-old papers';
    let logPrefix = 'ARCHIVED';

    if (archiveType === 'read') {
        targetDocName = 'already-read papers';
        logPrefix = 'ALREADY READ';
    }

    console.log(`[API] archive-article hit. Type: ${archiveType}. Checking Token...`);

    let stage = `Initiating ${archiveType}`;
    let auth = null;
    let driveService = null;
    let docs = null;

    try {
        // 1. Google Auth (Robust Fallback)
        stage = 'Google Auth';

        // Define pEnv properly in scope
        const pEnv = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON;
        const mEnv = import.meta.env?.GOOGLE_SERVICE_ACCOUNT_JSON || import.meta.env?.GOOGLE_SERVICES_ACCOUNT_JSON;
        let jsonVar = pEnv || mEnv;

        // FALLBACK: Manual .env read (Fix for Astro dev mode usually skipping complex env vars)
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
                            console.log('[API] Found credentials via manual read.');
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error('[API] Manual .env read failed:', e);
            }
        }

        console.log(`[API] Credentials Check: ProcessEnv=${!!pEnv}, MetaEnv=${!!mEnv}, Final=${!!jsonVar}`);

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
                // Smart Search: Check for various folder names
                const folderQuery = "(name = 'reading summaries' or name = 'Reading_Summaries') and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
                const folderRes = await driveService.files.list({
                    q: folderQuery,
                    spaces: 'drive',
                    fields: 'files(id, name)'
                });

                if (folderRes.data.files && folderRes.data.files.length > 0) {
                    folderId = folderRes.data.files[0].id;
                    console.log(`[API] Found folder: ${folderRes.data.files[0].name} (${folderId})`);

                    stage = `Finding Document: ${targetDocName}`;
                    // Smart Search: Check for exact name OR hyphenated version
                    const hyphenatedName = targetDocName.replace(/ /g, '-');
                    const docQuery = `(name = '${targetDocName}' or name = '${hyphenatedName}') and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`;

                    const searchRes = await driveService.files.list({
                        q: docQuery,
                        spaces: 'drive',
                        fields: 'files(id, name)'
                    });

                    if (searchRes.data.files && searchRes.data.files.length > 0) {
                        const archiveDocId = searchRes.data.files[0].id;
                        console.log(`[API] Found document: ${searchRes.data.files[0].name} (${archiveDocId})`);

                        stage = 'Appending to Archive Document';
                        await docs.documents.batchUpdate({
                            documentId: archiveDocId,
                            requestBody: {
                                requests: [
                                    {
                                        insertText: {
                                            location: { index: 1 },
                                            text: `[${new Date().toLocaleDateString()}] ${logPrefix}: ${articleTitle}\nLink: ${articleLink}\nDescription: ${articleDescription}\n\n----------------------------------------\n\n`,
                                        },
                                    },
                                ],
                            },
                        });
                        console.log('[API] Append successful.');
                    } else {
                        console.error(`[API] Google Doc '${targetDocName}' not found in folder. Bot cannot create files (0MB limit). User must create it.`);
                    }
                } else {
                    console.error('[API] Folder "reading summaries" not found. User must create it and share it.');
                }
            } catch (googleError) {
                console.error(`Google Integration Error [Stage: ${stage}]:`, googleError);
            }
        }

        // 2. Remove from Queue
        stage = 'Queue Update';
        const githubToken = process.env.GITHUB_TOKEN;

        let queueUpdated = false;

        // GitHub Update
        if (githubToken) {
            stage = 'GitHub Queue Update';
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
                        // ROBUST ID MATCHING
                        const i = String(item.id).trim().toLowerCase();
                        const t = String(articleId).trim().toLowerCase();
                        const tDecoded = decodeURIComponent(t).trim().toLowerCase();
                        return i !== t && i !== tDecoded;
                    });

                    // DEBUG: Log queue sizes
                    console.log(`[API] Queue size: Before=${queue.length}, After=${updatedQueue.length}`);
                    if (queue.length === updatedQueue.length) {
                        // This is important: If filter didn't remove anything, TELL THE USER.
                        return new Response(`Error: Article ID matching failed. ID not found or mismatch.\nTarget: ${articleId}\nQueue IDs: ${queue.map(q => q.id).join(', ')}`, { status: 400 });
                    }

                    const updateResponse = await fetch(getUrl, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${githubToken}`,
                            'Accept': 'application/vnd.github.v3+json',
                            'User-Agent': 'Astro-Blog-App',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: `Archive article: ${articleTitle}`,
                            content: Buffer.from(JSON.stringify(updatedQueue, null, 2)).toString('base64'),
                            sha: fileData.sha,
                            branch: 'main'
                        })
                    });

                    if (!updateResponse.ok) {
                        const errText = await updateResponse.text();
                        return new Response(`GitHub API Update Failed: ${updateResponse.status} ${updateResponse.statusText}\n${errText}`, { status: 500 });
                    }
                    console.log('[API] GitHub update successful');
                } else {
                    return new Response(`GitHub API Fetch Failed: ${getResponse.status}`, { status: 500 });
                }
            } catch (ghError) {
                console.error('GitHub API Error:', ghError);
                return new Response(`GitHub API Exception: ${ghError.message}`, { status: 500 });
            }
        } else {
            return new Response('Configuration Error: GITHUB_TOKEN is missing on server.', { status: 500 });
        }

        // Local File System Update (Dev only really)
        // ... (keep existing local update logic but don't rely on it for response)

        return redirect('/private?success=archived');

    } catch (error) {
        console.error(`Error in stage ${stage}:`, error);
        return new Response(`Error in stage [${stage}]: ${error.message}`, { status: 500 });
    }
};
