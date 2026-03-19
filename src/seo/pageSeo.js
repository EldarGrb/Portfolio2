import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../data/siteConfig';
import { insightsArticles, loadArticleBySlug } from '../data/insights/articles';

function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Software systems for growing businesses: websites, web apps, AI-enhanced workflows, and practical automation.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Software and AI Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website Strategy and Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Application Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI-Enhanced Workflow Automation' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Voice and Chat Assistant Systems' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Performance and Platform Cleanup' } },
      ],
    },
  };
}

export function getHomeSeo() {
  return {
    title: `${SITE_NAME} - Websites, Web Apps, and AI Workflows`,
    description: SITE_DESCRIPTION,
    canonical: `${SITE_URL}/`,
    url: `${SITE_URL}/`,
    type: 'website',
    image: DEFAULT_OG_IMAGE,
    schemas: [buildOrganizationSchema()],
  };
}

export function getInsightsSeo() {
  return {
    title: `Insights | ${SITE_NAME}`,
    description: 'Actionable problem-solution playbooks for teams that want to reduce errors, save time, and ship faster.',
    canonical: `${SITE_URL}/insights`,
    url: `${SITE_URL}/insights`,
    type: 'website',
    image: DEFAULT_OG_IMAGE,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${SITE_NAME} Insights`,
        description: 'Playbooks for reducing operational errors, saving time, and improving execution quality.',
        url: `${SITE_URL}/insights`,
        hasPart: insightsArticles.map((article) => ({
          '@type': 'Article',
          headline: article.title,
          url: article.canonical,
        })),
      },
    ],
  };
}

export function getInsightArticleSeo(articleMeta, article) {
  const schemas = [];

  if (article) {
    schemas.push(
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        keywords: article.keywords.join(', '),
        mainEntityOfPage: article.canonical,
        author: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Insights',
            item: `${SITE_URL}/insights`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: article.canonical,
          },
        ],
      },
    );

    if (article.faqItems.length) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    }
  }

  return {
    title: `${articleMeta.title} | ${SITE_NAME} Insights`,
    description: articleMeta.excerpt,
    canonical: articleMeta.canonical,
    url: articleMeta.canonical,
    type: 'article',
    image: DEFAULT_OG_IMAGE,
    schemas,
  };
}

export async function buildPrerenderRoutes() {
  const articleRoutes = await Promise.all(
    insightsArticles.map(async (articleMeta) => {
      const article = await loadArticleBySlug(articleMeta.slug);
      return {
        path: articleMeta.url,
        initialArticle: article,
        seo: getInsightArticleSeo(articleMeta, article),
      };
    }),
  );

  return [
    {
      path: '/',
      initialArticle: null,
      seo: getHomeSeo(),
    },
    {
      path: '/insights',
      initialArticle: null,
      seo: getInsightsSeo(),
    },
    ...articleRoutes,
  ];
}

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function renderSeoTags(seo) {
  const schemaMarkup = seo.schemas
    .map((schema) => `  <script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n');

  return [
    `  <title>${escapeAttribute(seo.title)}</title>`,
    `  <meta name="description" content="${escapeAttribute(seo.description)}" />`,
    '  <meta name="robots" content="index, follow" />',
    `  <link rel="canonical" href="${escapeAttribute(seo.canonical)}" />`,
    '  <meta name="theme-color" content="#000000" />',
    '  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />',
    '',
    '  <!-- Open Graph -->',
    `  <meta property="og:type" content="${escapeAttribute(seo.type)}" />`,
    `  <meta property="og:title" content="${escapeAttribute(seo.title)}" />`,
    `  <meta property="og:description" content="${escapeAttribute(seo.description)}" />`,
    `  <meta property="og:url" content="${escapeAttribute(seo.url)}" />`,
    `  <meta property="og:site_name" content="${escapeAttribute(SITE_NAME)}" />`,
    `  <meta property="og:image" content="${escapeAttribute(seo.image)}" />`,
    '  <meta property="og:image:width" content="1200" />',
    '  <meta property="og:image:height" content="630" />',
    '',
    '  <!-- Twitter Card -->',
    '  <meta name="twitter:card" content="summary_large_image" />',
    `  <meta name="twitter:title" content="${escapeAttribute(seo.title)}" />`,
    `  <meta name="twitter:description" content="${escapeAttribute(seo.description)}" />`,
    `  <meta name="twitter:image" content="${escapeAttribute(seo.image)}" />`,
    '',
    '  <!-- Structured Data -->',
    schemaMarkup,
  ].join('\n');
}
