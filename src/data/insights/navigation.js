import { insightsArticles } from './articles';
import { sectionKeyToAnchorId } from './articleParser';

/**
 * @typedef {Object} SidebarSectionItem
 * @property {string} id
 * @property {string} label
 * @property {string} href
 * @property {number} order
 */

/**
 * @typedef {Object} SidebarRelatedLink
 * @property {string} slug
 * @property {string} title
 * @property {string} url
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} HubCategoryGroup
 * @property {string} category
 * @property {number} count
 * @property {Array<{slug: string, title: string, url: string, excerpt: string, readTime: number, updatedAt: string}>} items
 */

function byUpdatedAtDesc(a, b) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

/**
 * @param {import('./articleParser').Article} article
 * @returns {SidebarSectionItem[]}
 */
export function buildSidebarSectionItems(article) {
  return article.orderedSections
    .map((section, index) => {
      const id = section.id ?? sectionKeyToAnchorId(section.key);
      return {
        id,
        label: section.title,
        href: `#${id}`,
        order: index + 1,
      };
    });
}

/**
 * @param {string} currentSlug
 * @param {number} [limit]
 * @returns {SidebarRelatedLink[]}
 */
export function buildSidebarRelatedLinks(currentSlug, limit = 4) {
  return insightsArticles
    .filter((article) => article.slug !== currentSlug)
    .sort(byUpdatedAtDesc)
    .slice(0, limit)
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      url: article.url,
      updatedAt: article.updatedAt,
    }));
}

/**
 * @returns {HubCategoryGroup[]}
 */
export function buildHubCategoryGroups() {
  const groups = new Map();

  [...insightsArticles]
    .sort(byUpdatedAtDesc)
    .forEach((article) => {
      if (!groups.has(article.category)) {
        groups.set(article.category, []);
      }

      groups.get(article.category).push({
        slug: article.slug,
        title: article.title,
        url: article.url,
        excerpt: article.excerpt,
        readTime: article.readTime,
        updatedAt: article.updatedAt,
      });
    });

  return [...groups.entries()]
    .map(([category, items]) => ({
      category,
      count: items.length,
      items,
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

export function filterInsightsArticles(articles, searchTerm, category) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return articles
    .filter((article) => {
      if (category !== 'All' && article.category !== category) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const keywordText = article.keywords.join(' ').toLowerCase();
      const haystack = `${article.title} ${article.excerpt} ${article.category} ${keywordText}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    })
    .sort(byUpdatedAtDesc);
}
