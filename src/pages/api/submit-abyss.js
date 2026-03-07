export const prerender = false;

import fs from 'fs';
import path from 'path';

// Store in data dir for consistency with other trackers like tracker_log.json
export const POST = async ({ request, redirect }) => {
    try {
        const data = await request.formData();
        const dream = data.get('dream_details');

        if (dream) {
            const entry = {
                date: new Date().toISOString(),
                dream: dream
            };

            // Calculate path dynamically for Astro build
            const currentDir = new URL('.', import.meta.url).pathname;
            // Pointing to src/data/abyss_log.json relative to the api dir
            const abyssFile = path.resolve(currentDir, '../../data/abyss_log.json');

            // Ensure data directory exists
            const dataDir = path.dirname(abyssFile);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            let log = [];
            if (fs.existsSync(abyssFile)) {
                try {
                    log = JSON.parse(fs.readFileSync(abyssFile, 'utf-8'));
                } catch (e) {
                    console.error('Error reading abyss log, starting fresh:', e);
                }
            }
            log.push(entry);
            fs.writeFileSync(abyssFile, JSON.stringify(log, null, 2));
        }

        return redirect('/abyss');
    } catch (e) {
        console.error('Failed to save to abyss:', e);
        // Even on error, send them to the abyss
        return redirect('/abyss');
    }
};
