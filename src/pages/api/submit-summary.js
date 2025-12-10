export const prerender = false;

import { google } from 'googleapis';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.join(__dirname, '../../../src/data/article_queue.json');

export const POST = async ({ request, redirect }) => {
    const data = await request.formData();
    const summary = data.get('summary');
    const articleId = data.get('articleId');
    const articleTitle = data.get('articleTitle');
    const articleLink = data.get('articleLink');

    if (!summary || summary.length < 500) {
        return new Response('Summary too short', { status: 400 });
    }

    try {
        // 1. Authenticate with Google
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
            scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
        });

        const docs = google.docs({ version: 'v1', auth });
        const drive = google.drive({ version: 'v3', auth });

        // 2. Create Doc
        const createResponse = await docs.documents.create({
            requestBody: {
                title: `Summary: ${articleTitle}`,
            },
        });
        const documentId = createResponse.data.documentId;

        // 3. Write Content
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

        // 4. Remove from Queue
        // Note: In a real production environment with a read-only file system (like Netlify),
        // we can't write to the file directly. We would need a database.
        // However, for this "challenge", we can simulate it or use the GitHub API to commit the change.
        // For now, we'll just log it. To make it persistent, we need the GitHub API approach.

        // 5. Remove from Queue via GitHub API
        const repoOwner = 'TJAdryan';
        const repoName = 'astro_blog';
        const filePath = 'src/data/article_queue.json';
        const githubToken = process.env.GITHUB_TOKEN;

        if (githubToken) {
            try {
                // Get current file to get SHA
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

                    // Filter out the COMPLETED article
                    const updatedQueue = queue.filter(item => item.id !== articleId);

                    // Commit back
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

                    if (!updateResponse.ok) {
                        console.error('GitHub Commit Failed:', await updateResponse.text());
                        // Don't fail the whole request if queue update fails, but log it
                    }
                }
            } catch (ghError) {
                console.error('GitHub API Error:', ghError);
            }
        } else {
            console.warn('GITHUB_TOKEN not found, skipping queue update.');
        }

        return redirect('/private?success=true');
    } catch (error) {
        console.error('Error saving summary:', error);
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
};
