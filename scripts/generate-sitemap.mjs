import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArticleFile } from '../src/data/insights/articleParser.js';
import { SITE_URL } from '../src/data/siteConfig.js';

function toIsoDate(input) {
  return new Date(input).toISOString().slice(0, 10);
}

function renderUrlNode({ loc, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

async function loadArticles(contentDir) {
  const files = await readdir(contentDir);
  const markdownFiles = files.filter((file) => file.endsWith('.md'));

  const articles = await Promise.all(markdownFiles.map(async (fileName) => {
    const absolutePath = path.join(contentDir, fileName);
    const raw = await readFile(absolutePath, 'utf8');
    return parseArticleFile(raw, absolutePath);
  }));

  return articles
    .filter((article) => !article.draft)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

async function main() {
  const scriptPath = fileURLToPath(import.meta.url);
  const projectRoot = path.resolve(path.dirname(scriptPath), '..');
  const contentDir = path.join(projectRoot, 'src', 'content', 'insights');
  const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');

  const articles = await loadArticles(contentDir);
  const latestArticleDate = articles.length
    ? articles.reduce((latest, article) => (
      new Date(article.updatedAt).getTime() > new Date(latest).getTime() ? article.updatedAt : latest
    ), articles[0].updatedAt)
    : new Date().toISOString();

  const routes = [
    {
      loc: `${SITE_URL}/`,
      lastmod: toIsoDate(latestArticleDate),
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      loc: `${SITE_URL}/about`,
      lastmod: toIsoDate(latestArticleDate),
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      loc: `${SITE_URL}/insights`,
      lastmod: toIsoDate(latestArticleDate),
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: `${SITE_URL}/contact`,
      lastmod: toIsoDate(latestArticleDate),
      changefreq: 'monthly',
      priority: '0.8',
    },
    ...articles.map((article) => ({
      loc: `${SITE_URL}${article.url}`,
      lastmod: toIsoDate(article.updatedAt),
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map(renderUrlNode),
    '</urlset>',
    '',
  ].join('\n');

  await writeFile(sitemapPath, xml, 'utf8');
  console.log(`Sitemap generated with ${routes.length} URLs at ${sitemapPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
