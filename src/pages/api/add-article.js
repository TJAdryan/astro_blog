export const prerender = false;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseStringPromise } from 'xml2js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.resolve(__dirname, '../../data/article_queue.json');

// --- Helper Functions from scripts/fetch_articles.js ---

async function fetchArxivPaper(topic) {
    let query = '';
    let topicLabel = '';

    if (topic === 'data-engineering') {
        query = 'cat:cs.DB+AND+ti:"data engineering"';
        topicLabel = 'Data Engineering';
    } else if (topic === 'python') { // Keeping python just in case, though not requested
        query = 'cat:cs.SE+AND+ti:"python"';
        topicLabel = 'Python';
    } else {
        return null;
    }

    const url = `http://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending`;

    try {
        const response = await fetch(url);
        const xml = await response.text();
        const result = await parseStringPromise(xml);

        const entries = result.feed.entry;
        if (!entries || entries.length === 0) return null;

        // Pick a random one
        const entry = entries[Math.floor(Math.random() * entries.length)];

        return {
            id: entry.id[0],
            title: entry.title[0].replace(/\n/g, ' ').trim(),
            summary: entry.summary[0].trim(),
            link: entry.id[0],
            source: 'arXiv',
            topic: topicLabel,
            dateAdded: new Date().toISOString()
        };
    } catch (e) {
        console.error("Error fetching arXiv:", e);
        return null;
    }
}

async function fetchPubmedPaper() {
    // Search for CRISPR
    const term = 'CRISPR[Title] AND "genetic engineering"[Title]';
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&retmode=json&retmax=20&sort=date`;

    try {
        const searchResp = await fetch(searchUrl);
        const searchData = await searchResp.json();
        const ids = searchData.esearchresult.idlist;

        if (!ids || ids.length === 0) return null;

        const id = ids[Math.floor(Math.random() * ids.length)];
        const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${id}&retmode=json`;

        const fetchResp = await fetch(fetchUrl);
        const fetchData = await fetchResp.json();
        const paper = fetchData.result[id];

        return {
            id: id,
            title: paper.title,
            summary: 'No abstract available via summary API. Please click link to read.',
            link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
            source: 'PubMed',
            topic: 'CRISPR',
            dateAdded: new Date().toISOString()
        };
    } catch (e) {
        console.error("Error fetching PubMed:", e);
        return null;
    }
}

// --- Main API Handler ---

export const POST = async ({ request, redirect }) => {
    const data = await request.formData();
    const topic = data.get('topic'); // 'data-engineering' or 'crispr'

    console.log(`Request to add article for topic: ${topic}`);

    let newArticle = null;

    if (topic === 'data-engineering') {
        newArticle = await fetchArxivPaper('data-engineering');
    } else if (topic === 'crispr') {
        newArticle = await fetchPubmedPaper();
    }

    if (!newArticle) {
        return new Response('Failed to fetch article', { status: 500 });
    }

    // --- Update Queue Logic (GitHub + Local Fallback) ---
    const githubToken = process.env.GITHUB_TOKEN;
    let queueUpdated = false;

    // 1. Try GitHub API
    if (githubToken) {
        try {
            const repoOwner = 'TJAdryan';
            const repoName = 'astro_blog';
            const filePath = 'src/data/article_queue.json';
            const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

            const getRes = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Astro-Blog-App'
                }
            });

            if (getRes.ok) {
                const fileData = await getRes.json();
                const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                const queue = JSON.parse(content);

                // Check duplicate
                if (!queue.some(p => p.id === newArticle.id)) {
                    queue.push(newArticle);

                    const updateRes = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${githubToken}`,
                            'Accept': 'application/vnd.github.v3+json',
                            'User-Agent': 'Astro-Blog-App',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: `Add ${newArticle.topic} article: ${newArticle.title}`,
                            content: Buffer.from(JSON.stringify(queue, null, 2)).toString('base64'),
                            sha: fileData.sha,
                            branch: 'main'
                        })
                    });

                    if (updateRes.ok) {
                        queueUpdated = true;
                        console.log('GitHub queue updated.');
                    } else {
                        console.error('GitHub update failed:', await updateRes.text());
                    }
                } else {
                    console.log('Duplicate article found (GitHub flow). Skipping.');
                    queueUpdated = true; // Technically handled
                }
            }
        } catch (e) {
            console.error('GitHub API Error:', e);
        }
    }

    // 2. Fallback to Local
    if (!queueUpdated) {
        try {
            if (fs.existsSync(QUEUE_FILE)) {
                const content = fs.readFileSync(QUEUE_FILE, 'utf-8');
                const queue = JSON.parse(content);

                if (!queue.some(p => p.id === newArticle.id)) {
                    queue.push(newArticle);
                    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
                    console.log('Local queue updated.');
                } else {
                    console.log('Duplicate article found (Local flow). Skipping.');
                }
                queueUpdated = true;
            }
        } catch (e) {
            console.error('Local file error:', e);
        }
    }

    return redirect('/private?success=added');
};
