export const prerender = false;

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

    let stage = `Initiating ${archiveType}`;
    let auth = null;
    let driveService = null;
    let docs = null;
    let archiveDocId = null;

    try {
        // 1. Google Auth
        stage = 'Google Auth';
        if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON) {
            try {
                const jsonVar = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICES_ACCOUNT_JSON;
                const credentials = JSON.parse(jsonVar);

                auth = new google.auth.GoogleAuth({
                    credentials,
                    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
                });

                docs = google.docs({ version: 'v1', auth });
                driveService = google.drive({ version: 'v3', auth });

                stage = 'Finding/Creating Folder: reading summaries';
                let folderId = null;
                const folderQuery = "mimeType = 'application/vnd.google-apps.folder' and name = 'reading summaries' and trashed = false";
                const folderRes = await driveService.files.list({
                    q: folderQuery,
                    spaces: 'drive',
                    fields: 'files(id, name)'
                });

                if (folderRes.data.files && folderRes.data.files.length > 0) {
                    folderId = folderRes.data.files[0].id;
                    console.log(`Found existing folder: reading summaries (${folderId})`);
                } else {
                    const folderCreateRes = await driveService.files.create({
                        resource: {
                            name: 'reading summaries',
                            mimeType: 'application/vnd.google-apps.folder'
                        },
                        fields: 'id'
                    });
                    folderId = folderCreateRes.data.id;
                    console.log(`Created new folder: reading summaries (${folderId})`);
                }

                // Share the folder if possible
                const userEmail = data.get('userEmail');
                if (userEmail && folderId) {
                    try {
                        await driveService.permissions.create({
                            fileId: folderId,
                            requestBody: { role: 'writer', type: 'user', emailAddress: userEmail }
                        });
                        console.log(`Shared folder with ${userEmail}`);
                    } catch (e) {
                        // Ignore if already shared
                        console.log(`Folder sharing note: ${e.message}`);
                    }
                }

                stage = `Finding Document: ${targetDocName}`;
                // Search for the target document INSIDE the folder
                const searchRes = await driveService.files.list({
                    q: `name = '${targetDocName}' and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
                    spaces: 'drive',
                    fields: 'files(id, name)'
                });

                if (searchRes.data.files && searchRes.data.files.length > 0) {
                    archiveDocId = searchRes.data.files[0].id;
                    console.log(`Found existing document: ${targetDocName} (${archiveDocId})`);
                } else {
                    stage = `Creating Document: ${targetDocName} in folder`;
                    const createRes = await driveService.files.create({
                        resource: {
                            name: targetDocName,
                            mimeType: 'application/vnd.google-apps.document',
                            parents: [folderId]
                        },
                        fields: 'id'
                    });
                    archiveDocId = createRes.data.id;
                    console.log(`Created new document: ${targetDocName} (${archiveDocId})`);
                }

                // Share document (redundant if folder shared, but harmless)
                if (userEmail && archiveDocId) {
                    try {
                        await driveService.permissions.create({
                            fileId: archiveDocId,
                            requestBody: { role: 'writer', type: 'user', emailAddress: userEmail }
                        });
                    } catch (e) { }
                }

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

            } catch (googleError) {
                console.error(`Google Integration Error [Stage: ${stage}]:`, googleError);
            }
        }

        // 2. Remove from Queue
        stage = 'Queue Update';
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
                            message: `Archive article: ${articleTitle}`,
                            content: Buffer.from(JSON.stringify(updatedQueue, null, 2)).toString('base64'),
                            sha: fileData.sha,
                            branch: 'main'
                        })
                    });

                    if (updateResponse.ok) {
                        queueUpdated = true;
                    }
                }
            } catch (ghError) {
                console.error('GitHub API Error:', ghError);
            }
        }

        // Local File System Update - ALWAYS update locals in dev mode
        stage = 'Local File System Update';
        try {
            if (fs.existsSync(QUEUE_FILE)) {
                const fileContent = fs.readFileSync(QUEUE_FILE, 'utf-8');
                const queue = JSON.parse(fileContent);

                // Debug logging
                console.log(`Attempting to remove articleId: [${articleId}]`);

                const updatedQueue = queue.filter(item => {
                    const itemId = String(item.id).trim();
                    const targetId = String(articleId).trim();
                    const match = itemId === targetId;
                    if (match) {
                        console.log(`Match found and removed: [${itemId}]`);
                    }
                    return !match;
                });

                fs.writeFileSync(QUEUE_FILE, JSON.stringify(updatedQueue, null, 2));
                console.log('Successfully updated local queue file.');
            }
        } catch (localError) {
            console.error('Local File Update Error:', localError);
        }

        return redirect('/private?success=archived');

    } catch (error) {
        console.error(`Error in stage ${stage}:`, error);
        return new Response(`Error in stage [${stage}]: ${error.message}`, { status: 500 });
    }
};
