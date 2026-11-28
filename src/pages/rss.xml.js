import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export const prerender = true;

const CANONICAL_CATEGORIES = {
	ai: 'AI',
	python: 'Python',
	pandas: 'Pandas',
	polars: 'Polars',
	security: 'Security',
	travel: 'Travel',
	georgia: 'Georgia',
	excel: 'Excel',
	devops: 'DevOps',
	database: 'Databases',
	databases: 'Databases',
	'sql server': 'SQL Server',
	postgresql: 'PostgreSQL',
	duckdb: 'DuckDB',
	cuda: 'CUDA',
	'gpu computing': 'GPU Computing',
	gtfs: 'GTFS',
	https: 'HTTPS',
	ssl: 'SSL',
	laps: 'LAPS',
	jit: 'JIT',
	pim: 'PIM',
	mta: 'MTA',
	xml: 'XML',
	xlsxwriter: 'XlsxWriter',
	'entra id': 'Entra ID',
	microsoft: 'Microsoft',
	sharepoint: 'SharePoint',
	onedrive: 'OneDrive',
	teams: 'Teams',
	'microsoft-graph': 'Microsoft Graph',
	'local-ai': 'Local AI',
	'vector search': 'Vector Search',
	'quantum computing': 'Quantum Computing',
	'data engineering': 'Data Engineering',
	'data science': 'Data Science',
	bioinformatics: 'Bioinformatics',
	cloud: 'Cloud',
	automation: 'Automation',
	'housing-simulation': 'Housing Simulation',
};

function normalizeCategories(category, tags = []) {
	const seen = new Set();
	const result = [];
	const raw = [category, ...(tags || [])].filter(Boolean);

	for (const entry of raw) {
		const trimmed = String(entry).trim();
		if (!trimmed) continue;
		const lower = trimmed.toLowerCase();
		const canonical = CANONICAL_CATEGORIES[lower] || trimmed;
		const key = canonical.toLowerCase();
		if (!seen.has(key)) {
			seen.add(key);
			result.push(canonical);
		}
	}

	return result;
}

export async function GET(context) {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			categories: normalizeCategories(post.data.category, post.data.tags),
			link: `/blog/${post.slug}/`,
		})),
	});
}
