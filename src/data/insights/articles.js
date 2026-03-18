import { parseArticleFile } from './articleParser';

export const SITE_URL = 'https://uroboros-systems.com';

const articleModules = import.meta.glob('../../content/insights/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const parsedArticles = Object.entries(articleModules)
  .map(([filePath, raw]) => parseArticleFile(raw, filePath))
  .filter((article) => !article.draft)
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const insightsArticles = parsedArticles;
export const featuredArticle = parsedArticles[0] ?? null;
export const insightCategories = [...new Set(parsedArticles.map((article) => article.category))].sort((a, b) => a.localeCompare(b));

export function getArticleBySlug(slug) {
  return parsedArticles.find((article) => article.slug === slug) ?? null;
}
