const REQUIRED_META_FIELDS = [
  'title',
  'slug',
  'excerpt',
  'category',
  'keywords',
  'publishedAt',
  'updatedAt',
  'readTime',
  'canonical',
];

const SECTION_ALIASES = {
  'problem statement': 'problemStatement',
  'symptoms checklist': 'symptomsChecklist',
  'root causes': 'rootCauses',
  'step-by-step solution': 'stepByStepSolution',
  'time and error savings estimate': 'timeAndErrorSavingsEstimate',
  faq: 'faqBlock',
  'faq block': 'faqBlock',
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * @typedef {Object} ArticleMeta
 * @property {string} title
 * @property {string} slug
 * @property {string} excerpt
 * @property {string} category
 * @property {string[]} keywords
 * @property {string} publishedAt
 * @property {string} updatedAt
 * @property {number} readTime
 * @property {string} canonical
 * @property {boolean} [draft]
 * @property {string} [finalCtaTitle]
 * @property {string} [finalCtaBody]
 * @property {string} [finalCtaButtonLabel]
 * @property {string} [sidebarCtaTitle]
 * @property {string} [sidebarCtaBody]
 * @property {string} [authorBio]
 * @property {string[]} [introQuotes]
 * @property {{title: string, cost: string, summary: string, audience: string, note?: string}[]} [supportLevels]
 * @property {{title: string, body: string}[]} [rootCauseCards]
 * @property {{label: string, outcome: string}[]} [outcomeCards]
 */

/**
 * @typedef {Object} FaqItem
 * @property {string} question
 * @property {string} answer
 */

/**
 * @typedef {Object} ArticleSection
 * @property {string} key
 * @property {string} id
 * @property {string} title
 * @property {string} markdown
 * @property {string} html
 */

/**
 * @typedef {ArticleMeta & {
 *   body: string,
 *   url: string,
 *   orderedSections: ArticleSection[],
 *   sections: Record<string, ArticleSection>,
 *   faqItems: FaqItem[],
 * }} Article
 */

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderInlineMarkdown(text) {
  let output = escapeHtml(text);
  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return output;
}

function stripMarkdown(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugifySectionTitle(sectionTitle) {
  return sectionTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

function parsePrimitiveValue(value, key) {
  const trimmed = value.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // Fall back to the simple list parser for non-JSON frontmatter arrays.
    }
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => part.replace(/^['"]|['"]$/g, ''));
  }

  if (key === 'keywords') {
    return trimmed
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  return trimmed;
}

function parseFrontmatter(frontmatterText, sourceLabel) {
  const meta = {};
  const lines = frontmatterText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));

  for (const line of lines) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      throw new Error(`Invalid frontmatter line in ${sourceLabel}: "${line}"`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    meta[key] = parsePrimitiveValue(rawValue, key);
  }

  return meta;
}

function assertArticleMeta(meta, sourceLabel) {
  for (const field of REQUIRED_META_FIELDS) {
    if (meta[field] === undefined || meta[field] === null || meta[field] === '') {
      throw new Error(`Missing required frontmatter field "${field}" in ${sourceLabel}`);
    }
  }

  if (!SLUG_PATTERN.test(meta.slug)) {
    throw new Error(`Invalid slug "${meta.slug}" in ${sourceLabel}. Use lowercase kebab-case.`);
  }

  if (!Array.isArray(meta.keywords) || meta.keywords.length === 0) {
    throw new Error(`"keywords" must be a non-empty list in ${sourceLabel}`);
  }

  if (!Number.isFinite(meta.readTime) || meta.readTime <= 0) {
    throw new Error(`"readTime" must be a positive number in ${sourceLabel}`);
  }

  if (Number.isNaN(Date.parse(meta.publishedAt)) || Number.isNaN(Date.parse(meta.updatedAt))) {
    throw new Error(`"publishedAt" and "updatedAt" must be valid ISO dates in ${sourceLabel}`);
  }

  if (typeof meta.canonical !== 'string' || !meta.canonical.startsWith('https://')) {
    throw new Error(`"canonical" must be an absolute https URL in ${sourceLabel}`);
  }

  return {
    ...meta,
    draft: Boolean(meta.draft),
  };
}

function markdownToHtml(markdown) {
  const lines = markdown.split('\n');
  const html = [];
  const paragraphBuffer = [];
  let listMode = null;

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    html.push(`<p>${renderInlineMarkdown(paragraphBuffer.join(' '))}</p>`);
    paragraphBuffer.length = 0;
  };

  const closeList = () => {
    if (!listMode) return;
    html.push(listMode === 'ul' ? '</ul>' : '</ol>');
    listMode = null;
  };

  const openList = (nextMode) => {
    if (listMode === nextMode) return;
    closeList();
    html.push(nextMode === 'ul' ? '<ul>' : '<ol>');
    listMode = nextMode;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      closeList();
      html.push(`<h3>${renderInlineMarkdown(line.slice(4).trim())}</h3>`);
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      openList('ul');
      html.push(`<li>${renderInlineMarkdown(line.slice(2).trim())}</li>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      openList('ol');
      html.push(`<li>${renderInlineMarkdown(line.replace(/^\d+\.\s+/, ''))}</li>`);
      continue;
    }

    paragraphBuffer.push(line);
  }

  flushParagraph();
  closeList();

  return html.join('\n');
}

export function renderMarkdownContent(markdown) {
  return markdownToHtml(markdown);
}

function splitArticleSource(raw, sourceLabel) {
  const frontmatterMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!frontmatterMatch) {
    throw new Error(`Missing frontmatter block in ${sourceLabel}`);
  }

  const frontmatterText = frontmatterMatch[1];
  const body = frontmatterMatch[2].trim();
  const parsedMeta = parseFrontmatter(frontmatterText, sourceLabel);
  const meta = assertArticleMeta(parsedMeta, sourceLabel);

  return { meta, body };
}

function extractFaqItems(faqMarkdown) {
  const matches = [...faqMarkdown.matchAll(/^###\s+(.+)$/gm)];
  if (!matches.length) return [];

  return matches
    .map((match, index) => {
      const question = match[1].trim();
      const start = (match.index ?? 0) + match[0].length;
      const end = index + 1 < matches.length ? (matches[index + 1].index ?? faqMarkdown.length) : faqMarkdown.length;
      const answerMarkdown = faqMarkdown.slice(start, end).trim();
      const answer = stripMarkdown(answerMarkdown);
      return { question, answer };
    })
    .filter((item) => item.question && item.answer);
}

function mapSectionKey(sectionTitle) {
  const normalized = sectionTitle.trim().toLowerCase();
  return SECTION_ALIASES[normalized] ?? slugifySectionTitle(sectionTitle);
}

function extractSections(body, sourceLabel) {
  const headingMatches = [...body.matchAll(/^##\s+(.+)$/gm)];
  if (!headingMatches.length) {
    throw new Error(`No section headings found in ${sourceLabel}. Expected at least one "##" heading.`);
  }

  const sections = {};
  const orderedSections = [];
  const usedKeys = new Set();

  headingMatches.forEach((match, index) => {
    const title = match[1].trim();
    const baseKey = mapSectionKey(title);
    let sectionKey = baseKey;
    let duplicateIndex = 2;

    while (usedKeys.has(sectionKey)) {
      sectionKey = `${baseKey}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    usedKeys.add(sectionKey);

    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < headingMatches.length ? (headingMatches[index + 1].index ?? body.length) : body.length;
    const markdown = body.slice(start, end).trim();

    const section = {
      key: sectionKey,
      id: sectionKeyToAnchorId(sectionKey),
      title,
      markdown,
      html: markdownToHtml(markdown),
    };

    sections[sectionKey] = section;
    orderedSections.push(section);
  });

  return {
    sections,
    orderedSections,
  };
}

/**
 * Parse and validate a markdown insight file.
 * @param {string} raw
 * @param {string} sourceLabel
 * @returns {Article}
 */
export function parseArticleFile(raw, sourceLabel) {
  const { meta, body } = splitArticleSource(raw, sourceLabel);
  const { sections, orderedSections } = extractSections(body, sourceLabel);
  const faqSection = sections.faqBlock ?? null;
  const faqItems = faqSection ? extractFaqItems(faqSection.markdown) : [];

  return {
    ...meta,
    body,
    url: `/insights/${meta.slug}`,
    orderedSections,
    sections,
    faqItems,
  };
}

export function parseArticleMeta(raw, sourceLabel) {
  const { meta } = splitArticleSource(raw, sourceLabel);

  return {
    ...meta,
    url: `/insights/${meta.slug}`,
  };
}

export function formatDateLabel(isoDate) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(isoDate));
}

export function sectionKeyToAnchorId(sectionKey) {
  const kebabCase = sectionKey
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `section-${kebabCase}`;
}

export { REQUIRED_META_FIELDS };
