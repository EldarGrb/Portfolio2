import { SITE_URL } from '../siteConfig';
import { parseArticleFile } from './articleParser';

export { SITE_URL };

const articleIndex = [
  {
    title: 'What FreeFlow Gets Right About AI Voice Input on a Computer',
    slug: 'what-freeflow-gets-right-about-ai-voice-input-on-a-computer',
    excerpt: 'FreeFlow looks more interesting than a typical AI voice app because it treats voice as workflow input, not just speech-to-text.',
    category: 'AI Tooling',
    keywords: ['AI voice input', 'FreeFlow', 'speech to text', 'workflow tools', 'dictation'],
    publishedAt: '2026-04-06',
    updatedAt: '2026-04-06',
    readTime: 4,
    canonical: `${SITE_URL}/insights/what-freeflow-gets-right-about-ai-voice-input-on-a-computer`,
    url: '/insights/what-freeflow-gets-right-about-ai-voice-input-on-a-computer',
    sourcePath: '../../content/insights/what-freeflow-gets-right-about-ai-voice-input-on-a-computer.md',
  },
  {
    title: 'Fix slow lead follow-up with an AI chatbot and enrichment pipeline',
    slug: 'fix-slow-lead-follow-up-with-ai-chatbot-and-enrichment',
    excerpt: 'A marketing agency was losing 3-4 leads per month to slow follow-up and spreadsheet chaos. We replaced the mess with a chatbot, lead enrichment, and auto-assignment.',
    category: 'Lead Operations',
    keywords: ['AI chatbot', 'lead enrichment', 'CRM automation', 'lead follow-up', 'marketing agency'],
    publishedAt: '2026-03-26',
    updatedAt: '2026-03-26',
    readTime: 5,
    canonical: `${SITE_URL}/insights/fix-slow-lead-follow-up-with-ai-chatbot-and-enrichment`,
    url: '/insights/fix-slow-lead-follow-up-with-ai-chatbot-and-enrichment',
    sourcePath: '../../content/insights/fix-slow-lead-follow-up-with-ai-chatbot-and-enrichment.md',
  },
  {
    title: 'How to Reduce Customer Support Costs With AI Without Making Support Worse',
    slug: 'reduce-customer-support-costs-with-ai',
    excerpt: 'Most advice about AI in customer support skips the hard part: what to automate, what should stay human, and how to cut costs without making support worse.',
    category: 'AI Automation',
    keywords: ['ai customer support', 'reduce support costs', 'ai support automation', 'customer service automation'],
    publishedAt: '2026-03-16',
    updatedAt: '2026-03-16',
    readTime: 8,
    canonical: `${SITE_URL}/insights/reduce-customer-support-costs-with-ai`,
    url: '/insights/reduce-customer-support-costs-with-ai',
    sourcePath: '../../content/insights/reduce-customer-support-costs-with-ai.md',
  },
].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

const articleLoaders = import.meta.glob('../../content/insights/*.md', {
  query: '?raw',
  import: 'default',
});

const articleCache = new Map();

export const insightsArticles = articleIndex;
export const featuredArticle = articleIndex[0] ?? null;
export const insightCategories = [...new Set(articleIndex.map((article) => article.category))].sort((a, b) => a.localeCompare(b));

export function getArticleBySlug(slug) {
  return articleIndex.find((article) => article.slug === slug) ?? null;
}

export async function loadArticleBySlug(slug) {
  if (!slug) return null;
  if (articleCache.has(slug)) {
    return articleCache.get(slug);
  }

  const articleMeta = getArticleBySlug(slug);
  if (!articleMeta) return null;

  const loader = articleLoaders[articleMeta.sourcePath];
  if (!loader) {
    throw new Error(`No article loader found for ${slug}`);
  }

  const raw = await loader();
  const article = parseArticleFile(raw, articleMeta.sourcePath);

  articleCache.set(slug, article);
  return article;
}
