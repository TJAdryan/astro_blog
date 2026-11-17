// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { remarkMermaid } from './src/remark-mermaid.js';

import clerk from '@clerk/astro';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

const EXCLUDED_SITEMAP_PATHS = new Set([
    '/login',
    '/private',
    '/unauthorized',
    '/dashboard',
    '/tracker',
    '/abyss',
    '/wedding',
    '/vaultrunner',
    '/housing_simulation',
    '/us-housing-model',
]);

// https://astro.build/config
export default defineConfig({
    site: 'https://nextvaldata.com', // Update this to your real domain
    output: 'server',
    adapter: netlify(),
    redirects: {
        '/blog/2025-10-20-getting--70x-data-processing-speed-with-gpu-vs-cpu':
            '/blog/2025-10-20-getting-70x-data-processing-speed-with-gpu-vs-cpu/',
        '/housing_simulation': '/interactive/housing-simulation',
        '/us-housing-model': '/interactive/housing-simulation',
    },
    integrations: [
        mdx(),
        sitemap({
            filter: (page) => {
                const pathname = new URL(page).pathname
                    .replace(/\/+$/, '')
                    .toLowerCase();
                return !EXCLUDED_SITEMAP_PATHS.has(pathname);
            },
        }),
        react(),
        tailwind(),
        clerk(),
    ],
    markdown: {
        remarkPlugins: [remarkMermaid],
    },
    vite: {
        resolve: {
            dedupe: ['react', 'react-dom'],
        },
    },
});