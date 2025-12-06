import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.join(__dirname, '../src/data/article_queue.json');

// Ensure data directory exists
const dataDir = path.dirname(QUEUE_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

async function fetchArxivPaper() {
    // Search for Data Engineering
    const query = 'cat:cs.DB+AND+ti:"data engineering"';
    const url = `http://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending`;

    const response = await fetch(url);
    const xml = await response.text();
    const result = await parseStringPromise(xml);

    const entries = result.feed.entry;
    if (!entries || entries.length === 0) return null;

    // Pick a random one from the top 10 to keep it fresh but relevant
    const entry = entries[Math.floor(Math.random() * entries.length)];

    return {
        id: entry.id[0],
        title: entry.title[0].replace(/\n/g, ' ').trim(),
        summary: entry.summary[0].trim(),
        link: entry.id[0],
        source: 'arXiv',
        topic: 'Data Engineering',
        dateAdded: new Date().toISOString()
    };
}

async function fetchPubmedPaper() {
    // Search for CRISPR
    const term = 'CRISPR[Title] AND "genetic engineering"[Title]';
    // 1. Search to get IDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&retmode=json&retmax=10&sort=date`;

    const searchResp = await fetch(searchUrl);
    const searchData = await searchResp.json();
    const ids = searchData.esearchresult.idlist;

    if (!ids || ids.length === 0) return null;

    // Pick a random ID
    const id = ids[Math.floor(Math.random() * ids.length)];

    // 2. Fetch details
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
}

async function fetchPythonPaper() {
    // Search for Python in CS
    const query = 'cat:cs.SE+AND+ti:"python"';
    const url = `http://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending`;

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
        topic: 'Python',
        dateAdded: new Date().toISOString()
    };
}

async function run() {
    console.log('Fetching articles...');

    let queue = [];
    if (fs.existsSync(QUEUE_FILE)) {
        queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
    }

    try {
        const arxivPaper = await fetchArxivPaper();
        if (arxivPaper) {
            console.log(`Found arXiv paper: ${arxivPaper.title}`);
            queue.push(arxivPaper);
        }
    } catch (e) {
        console.error('Error fetching arXiv:', e);
    }

    try {
        const pubmedPaper = await fetchPubmedPaper();
        if (pubmedPaper) {
            console.log(`Found PubMed paper: ${pubmedPaper.title}`);
            queue.push(pubmedPaper);
        }
    } catch (e) {
        console.error('Error fetching PubMed:', e);
    }

    try {
        const pythonPaper = await fetchPythonPaper();
        if (pythonPaper) {
            console.log(`Found Python paper: ${pythonPaper.title}`);
            queue.push(pythonPaper);
        }
    } catch (e) {
        console.error('Error fetching Python arXiv:', e);
    }

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
    console.log('Queue updated.');
}

run();
