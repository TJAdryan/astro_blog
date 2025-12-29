import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUEUE_FILE = path.resolve(__dirname, '../src/data/article_queue.json');

const ID_TO_REMOVE = "http://arxiv.org/abs/2510.18013v3";

if (fs.existsSync(QUEUE_FILE)) {
    const content = fs.readFileSync(QUEUE_FILE, 'utf-8');
    let queue = JSON.parse(content);

    const initialLength = queue.length;
    queue = queue.filter(item => item.id !== ID_TO_REMOVE);
    const finalLength = queue.length;

    if (initialLength > finalLength) {
        fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
        console.log(`Successfully removed article: ${ID_TO_REMOVE}`);
    } else {
        console.log(`Article ID not found: ${ID_TO_REMOVE}`);
        // Debug: Log all IDs to see why it didn't match
        console.log("Existing IDs:", queue.map(q => q.id));
    }
} else {
    console.error("Queue file not found!");
}
