import { SITE_URL } from '../siteConfig';
import { parseArticleFile } from './articleParser';

export { SITE_URL };

const articleIndex = [
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
  {
    title: 'Cut reporting errors with ops automation checkpoints',
    slug: 'cut-reporting-errors-with-ops-automation-checkpoints',
    excerpt: 'A practical framework for reducing spreadsheet and handoff errors in recurring operations reporting.',
    category: 'Process Quality',
    keywords: ['reporting automation', 'operations quality', 'workflow checkpoints', 'error reduction'],
    publishedAt: '2026-03-01',
    updatedAt: '2026-03-07',
    readTime: 8,
    canonical: `${SITE_URL}/insights/cut-reporting-errors-with-ops-automation-checkpoints`,
    url: '/insights/cut-reporting-errors-with-ops-automation-checkpoints',
    sourcePath: '../../content/insights/cut-reporting-errors-with-ops-automation.md',
  },
  {
    title: 'Speed up sales handoffs with intake automation',
    slug: 'speed-up-sales-handoffs-with-intake-automation',
    excerpt: 'How to reduce project kickoff delays by standardizing lead intake and technical qualification.',
    category: 'Revenue Operations',
    keywords: ['sales handoff', 'intake automation', 'lead qualification', 'delivery kickoff'],
    publishedAt: '2026-02-24',
    updatedAt: '2026-03-06',
    readTime: 6,
    canonical: `${SITE_URL}/insights/speed-up-sales-handoffs-with-intake-automation`,
    url: '/insights/speed-up-sales-handoffs-with-intake-automation',
    sourcePath: '../../content/insights/speed-up-sales-handoffs-with-intake-automation.md',
  },
  {
    title: 'Reduce support tickets with self-serve workflows',
    slug: 'reduce-support-tickets-with-self-serve-workflows',
    excerpt: 'How service teams can cut repetitive tickets by turning known issues into guided self-serve flows.',
    category: 'Operations',
    keywords: ['support workflow', 'self-serve help', 'ticket reduction', 'process automation'],
    publishedAt: '2026-03-05',
    updatedAt: '2026-03-05',
    readTime: 7,
    canonical: `${SITE_URL}/insights/reduce-support-tickets-with-self-serve-workflows`,
    url: '/insights/reduce-support-tickets-with-self-serve-workflows',
    sourcePath: '../../content/insights/reduce-support-tickets-with-self-serve-workflows.md',
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
