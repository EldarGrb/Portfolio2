import {
  DEFAULT_OG_IMAGE,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '../data/siteConfig';
import { services } from '../data/servicesData';
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

function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
  };
}

function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildServiceSchemas() {
  return services.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    serviceType: service.tags.join(', '),
    areaServed: 'Worldwide',
    url: `${SITE_URL}${service.href}`,
  }));
}

function buildSingleServiceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    serviceType: service.tags.join(', '),
    areaServed: 'Worldwide',
    url: `${SITE_URL}${service.href}`,
  };
}

const contactFaqItems = [
  {
    question: 'What should I include in the first message?',
    answer: 'The most helpful message includes the main bottleneck, the desired outcome, and any timing pressure that matters.',
  },
  {
    question: 'What kinds of projects fit best?',
    answer: 'Website rebuilds, web apps, workflow automation, AI-assisted intake, and cleanup work where the current setup is getting in the way.',
  },
  {
    question: 'How quickly do you reply?',
    answer: 'New project messages get a reply within 24 hours with a practical next step.',
  },
];

export function getHomeSeo() {
  return {
    title: `${SITE_NAME} - Websites, Web Apps, and AI Workflows`,
    description: SITE_DESCRIPTION,
    canonical: `${SITE_URL}/`,
    url: `${SITE_URL}/`,
    type: 'website',
    image: DEFAULT_OG_IMAGE,
    author: SITE_AUTHOR,
    keywords: [
      'web development for small businesses',
      'website strategy',
      'web app development',
      'AI workflow automation',
      'automation systems for founders',
    ],
    imageAlt: 'Uroboros Systems abstract brand graphic',
    schemas: [
      buildOrganizationSchema(),
      buildWebsiteSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${SITE_NAME} home`,
        description: SITE_DESCRIPTION,
        url: `${SITE_URL}/`,
      },
      buildBreadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
      ]),
      ...buildServiceSchemas(),
    ],
  };
}

export function getAboutSeo() {
  return {
    title: `About | ${SITE_NAME}`,
    description: 'Meet Eldar Jahic and learn how Uroboros Systems grew into a calm, capable software partner for businesses that need clearer operations.',
    canonical: `${SITE_URL}/about`,
    url: `${SITE_URL}/about`,
    type: 'website',
    image: DEFAULT_OG_IMAGE,
    author: SITE_AUTHOR,
    keywords: [
      'about Eldar Jahic',
      'Uroboros Systems founder',
      'software developer Bosnia and Herzegovina',
      'software partner for small business',
    ],
    imageAlt: 'Uroboros Systems abstract brand graphic',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `About ${SITE_NAME}`,
        description: 'A short story about the person behind Uroboros Systems and the kind of work the studio does.',
        url: `${SITE_URL}/about`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: SITE_AUTHOR,
        jobTitle: 'Founder and Developer',
        worksFor: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      buildBreadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'About', url: `${SITE_URL}/about` },
      ]),
    ],
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
    author: SITE_AUTHOR,
    keywords: [
      'AI workflow insights',
      'operations automation articles',
      'small business systems blog',
      'lead follow-up automation',
      'customer support automation',
    ],
    imageAlt: 'Uroboros Systems insights cover image',
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
      buildBreadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Insights', url: `${SITE_URL}/insights` },
      ]),
    ],
  };
}

export function getContactSeo() {
  return {
    title: `Contact | ${SITE_NAME}`,
    description: 'Start the conversation with the bottleneck that is costing the business the most: weak conversion, messy operations, or too much manual follow-up.',
    canonical: `${SITE_URL}/contact`,
    url: `${SITE_URL}/contact`,
    type: 'website',
    image: DEFAULT_OG_IMAGE,
    author: SITE_AUTHOR,
    keywords: [
      'contact Uroboros Systems',
      'website project inquiry',
      'workflow automation consultation',
      'AI assistant project contact',
      'software partner contact',
    ],
    imageAlt: 'Uroboros Systems contact page cover image',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: `Contact ${SITE_NAME}`,
        description: 'Contact page for website, app, automation, and AI assistant inquiries.',
        url: `${SITE_URL}/contact`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: contactFaqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      buildBreadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Contact', url: `${SITE_URL}/contact` },
      ]),
      ...buildServiceSchemas(),
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
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': article.canonical,
        },
        author: {
          '@type': 'Person',
          name: SITE_AUTHOR,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      buildBreadcrumbSchema([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Insights', url: `${SITE_URL}/insights` },
        { name: article.title, url: article.canonical },
      ]),
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
    author: SITE_AUTHOR,
    keywords: articleMeta.keywords,
    imageAlt: `${articleMeta.title} article cover`,
    schemas,
  };
}

export function getNotFoundSeo(currentPath) {
  const resolvedPath = currentPath?.startsWith('/') ? currentPath : '/';
  const url = `${SITE_URL}${resolvedPath}`;

  return {
    title: `Page Not Found | ${SITE_NAME}`,
    description: 'The page you requested could not be found.',
    canonical: url,
    url,
    type: 'website',
    image: DEFAULT_OG_IMAGE,
    author: SITE_AUTHOR,
    robots: 'noindex, nofollow',
    imageAlt: 'Uroboros Systems abstract brand graphic',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Page not found',
        description: 'A missing page on the Uroboros Systems website.',
        url,
      },
    ],
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
      path: '/about',
      initialArticle: null,
      seo: getAboutSeo(),
    },
    {
      path: '/insights',
      initialArticle: null,
      seo: getInsightsSeo(),
    },
    {
      path: '/contact',
      initialArticle: null,
      seo: getContactSeo(),
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
    `  <meta name="robots" content="${escapeAttribute(seo.robots ?? 'index, follow')}" />`,
    `  <meta name="author" content="${escapeAttribute(seo.author ?? SITE_AUTHOR)}" />`,
    seo.keywords?.length
      ? `  <meta name="keywords" content="${escapeAttribute(seo.keywords.join(', '))}" />`
      : '',
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
    `  <meta property="og:image:alt" content="${escapeAttribute(seo.imageAlt ?? seo.title)}" />`,
    '  <meta property="og:image:width" content="1200" />',
    '  <meta property="og:image:height" content="630" />',
    '',
    '  <!-- Twitter Card -->',
    '  <meta name="twitter:card" content="summary_large_image" />',
    `  <meta name="twitter:title" content="${escapeAttribute(seo.title)}" />`,
    `  <meta name="twitter:description" content="${escapeAttribute(seo.description)}" />`,
    `  <meta name="twitter:image" content="${escapeAttribute(seo.image)}" />`,
    `  <meta name="twitter:image:alt" content="${escapeAttribute(seo.imageAlt ?? seo.title)}" />`,
    '',
    '  <!-- Structured Data -->',
    schemaMarkup,
  ].filter(Boolean).join('\n');
}
