
const fs = require('fs');
const path = require('path');

const QUEUE_FILE = path.join(__dirname, '../src/data/article_queue.json');

try {
    const data = fs.readFileSync(QUEUE_FILE, 'utf8');
    const queue = JSON.parse(data);
    const initialLength = queue.length;

    const newQueue = queue.filter(item => !item.title.includes("NALA_MAINZ"));

    if (newQueue.length < initialLength) {
        fs.writeFileSync(QUEUE_FILE, JSON.stringify(newQueue, null, 2));
        console.log(`Successfully removed NALA_MAINZ article. Queue size: ${newQueue.length}`);
    } else {
        console.log('Article not found or already removed.');
    }
} catch (e) {
    console.error('Error:', e);
}
