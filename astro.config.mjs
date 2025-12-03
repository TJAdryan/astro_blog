// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { remarkMermaid } from './src/remark-mermaid.js';

import clerk from '@clerk/astro';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    site: 'https://nextvaldata.com', // Update this to your real domain
    integrations: [mdx(), sitemap(), react(), tailwind(), clerk()],
    markdown: {
        remarkPlugins: [remarkMermaid],
    },
});