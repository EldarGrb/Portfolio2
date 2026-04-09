import { SITE_URL } from '../siteConfig';
import { parseArticleFile } from './articleParser';

export { SITE_URL };

const articleIndex = [
  {
    title: 'What to Fix Before You Put a Chatbot on Your Website',
    slug: 'what-to-fix-before-you-put-a-chatbot-on-your-website',
    excerpt: 'A lot of businesses add a chatbot when what they really have is a clarity problem. If visitors still cannot understand the page or the next step, the bot just inherits the mess.',
    category: 'Website Conversion',
    keywords: ['before adding chatbot to website', 'website chatbot', 'website chat widget', 'chatbot routing', 'chatbot handoff'],
    publishedAt: '2026-04-10',
    updatedAt: '2026-04-10',
    readTime: 5,
    canonical: `${SITE_URL}/insights/what-to-fix-before-you-put-a-chatbot-on-your-website`,
    url: '/insights/what-to-fix-before-you-put-a-chatbot-on-your-website',
    sourcePath: '../../content/insights/what-to-fix-before-you-put-a-chatbot-on-your-website.md',
  },
  {
    title: 'How to Automate Lead Follow-Up Without a CRM',
    slug: 'how-to-automate-lead-follow-up-without-a-crm',
    excerpt: 'Small businesses often think they need a CRM when the real problem is inconsistent follow-up. A simple routing and reply system is usually enough before a full sales tool.',
    category: 'Lead Operations',
    keywords: ['automate lead follow up without a crm', 'lead follow-up automation', 'lead routing', 'lead acknowledgement', 'crm alternative'],
    publishedAt: '2026-04-10',
    updatedAt: '2026-04-10',
    readTime: 5,
    canonical: `${SITE_URL}/insights/how-to-automate-lead-follow-up-without-a-crm`,
    url: '/insights/how-to-automate-lead-follow-up-without-a-crm',
    sourcePath: '../../content/insights/how-to-automate-lead-follow-up-without-a-crm.md',
  },
  {
    title: 'AI Automation vs Hiring: What to Automate Before You Add Headcount',
    slug: 'ai-automation-vs-hiring-what-to-automate-before-you-add-headcount',
    excerpt: 'Hiring feels like the obvious fix when work piles up, but many small businesses are really carrying repetitive admin and broken handoffs that should be automated first.',
    category: 'AI Automation',
    keywords: ['automation vs hiring small business', 'what to automate before hiring', 'small business automation', 'repetitive admin automation', 'automation before headcount'],
    publishedAt: '2026-04-10',
    updatedAt: '2026-04-10',
    readTime: 5,
    canonical: `${SITE_URL}/insights/ai-automation-vs-hiring-what-to-automate-before-you-add-headcount`,
    url: '/insights/ai-automation-vs-hiring-what-to-automate-before-you-add-headcount',
    sourcePath: '../../content/insights/ai-automation-vs-hiring-what-to-automate-before-you-add-headcount.md',
  },
  {
    title: 'Your Website Gets Traffic but No Leads. Start Here.',
    slug: 'your-website-gets-traffic-but-no-leads-start-here',
    excerpt: 'If your website gets visitors but almost nobody reaches out, the problem is usually not traffic. It is friction in the message, the path, or what happens after the click.',
    category: 'Website Conversion',
    keywords: ['website traffic no leads', 'website conversion', 'lead generation website', 'enquiry form friction', 'website conversion audit'],
    publishedAt: '2026-04-09',
    updatedAt: '2026-04-09',
    readTime: 6,
    canonical: `${SITE_URL}/insights/your-website-gets-traffic-but-no-leads-start-here`,
    url: '/insights/your-website-gets-traffic-but-no-leads-start-here',
    sourcePath: '../../content/insights/your-website-gets-traffic-but-no-leads-start-here.md',
  },
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
