
import fs from 'node:fs';
import path from 'node:path';

const blogDir = './src/content/blog';

function getPosts() {
    const files = fs.readdirSync(blogDir);
    const posts = [];

    files.forEach(file => {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) return;

        const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
        // Simple frontmatter parser
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
            const fm = match[1];
            const titleMatch = fm.match(/title:\s*"(.*)"/);
            const dateMatch = fm.match(/pubDate:\s*"?([^"\n]*)"?/);
            const draftMatch = fm.match(/draft:\s*(true|false)/);

            if (titleMatch && dateMatch) {
                posts.push({
                    file,
                    title: titleMatch[1],
                    pubDate: new Date(dateMatch[1]),
                    draft: draftMatch ? draftMatch[1] === 'true' : false
                });
            } else {
                console.log('Failed to parse:', file);
                console.log('FM:', fm);
            }
        }
    });

    return posts;
}

const posts = getPosts();
posts.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

console.log('--- Top 5 Posts ---');
posts.slice(0, 5).forEach((p, i) => {
    console.log(`${i + 1}. [${p.pubDate.toISOString()}] ${p.title} (Draft: ${p.draft}) File: ${p.file}`);
});

console.log('\n--- Checking Target Post ---');
const target = posts.find(p => p.file.includes('Google-Scholar'));
if (target) {
    console.log('Found target:', target);
} else {
    console.log('Target post NOT FOUND');
}
