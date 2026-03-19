import { useMemo, useState } from 'react';
import InsightsLayout from '../components/InsightsLayout';
import NewsletterSignup from '../components/NewsletterSignup';
import {
  featuredArticle,
  insightCategories,
  insightsArticles,
} from '../data/insights/articles';
import { formatDateLabel } from '../data/insights/articleParser';
import { filterInsightsArticles } from '../data/insights/navigation';
import { useSeo } from '../hooks/useSeo';
import { getInsightsSeo } from '../seo/pageSeo';

function InsightsPage({ currentPath, onContact }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = useMemo(
    () => filterInsightsArticles(insightsArticles, '', selectedCategory),
    [selectedCategory],
  );

  const featuredResult = useMemo(() => {
    if (!filteredArticles.length) return null;

    if (featuredArticle && filteredArticles.some((article) => article.slug === featuredArticle.slug)) {
      return featuredArticle;
    }

    return filteredArticles[0];
  }, [filteredArticles]);

  const remainingArticles = useMemo(
    () => filteredArticles.filter((article) => article.slug !== featuredResult?.slug),
    [featuredResult, filteredArticles],
  );

  useSeo(getInsightsSeo());

  return (
    <InsightsLayout
      currentPath={currentPath}
      onContact={onContact}
      footerVariant="minimal"
      contentClassName="insights-docs-content--hub"
    >
      <div className="insights-hub">
        <header className="insights-hub-hero">
          <p className="insights-masthead-label">Uroboros Systems Insights</p>
          <h1>Operational playbooks for teams that want calmer execution.</h1>
          <p className="insights-hub-intro">
            Practical notes on reducing bottlenecks, improving delivery quality, and using
            automation without making the work feel heavier.
          </p>
        </header>

        <section className="insights-topic-row" aria-label="Insight topics">
          <button
            type="button"
            className={`insights-topic-chip ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
            aria-pressed={selectedCategory === 'All'}
          >
            All posts
          </button>
          {insightCategories.map((category) => (
            <button
              type="button"
              key={category}
              className={`insights-topic-chip ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </section>

        {featuredResult && (
          <section className="insights-lead-block" aria-label="Lead story">
            <div className="insights-section-heading">
              <span>Lead story</span>
            </div>
            <a className="insights-feature-card" href={featuredResult.url}>
              <div className="insights-feature-meta">
                <span className="insights-card-category">{featuredResult.category}</span>
                <span>{formatDateLabel(featuredResult.updatedAt)}</span>
                <span>{featuredResult.readTime} min read</span>
              </div>
              <h2>{featuredResult.title}</h2>
              <p>{featuredResult.excerpt}</p>
            </a>
          </section>
        )}

        <section className="insights-results-stream" aria-label="Insight articles">
          <div className="insights-section-heading">
            <span>Latest notes</span>
          </div>
          {remainingArticles.length === 0 && !featuredResult && (
            <article className="insights-empty-state">
              <h2>No matching insights yet</h2>
              <p>Try another topic or check back soon for new practical notes.</p>
            </article>
          )}

          {remainingArticles.map((article) => (
            <a className="insights-list-item" href={article.url} key={article.slug}>
              <div className="insights-list-meta">
                <span className="insights-card-category">{article.category}</span>
                <span>{formatDateLabel(article.updatedAt)}</span>
                <span>{article.readTime} min read</span>
              </div>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
            </a>
          ))}
        </section>

        <NewsletterSignup
          variant="compact"
          className="insights-newsletter"
          eyebrow="Subscribe"
          title="Occasional notes on practical systems, delivery, and AI workflows."
          description="Useful updates for teams that want clearer execution, fewer bottlenecks, and more grounded technical decisions."
          placeholder="Enter your work email"
          placement="insights_newsletter"
        />
      </div>
    </InsightsLayout>
  );
}

export default InsightsPage;
