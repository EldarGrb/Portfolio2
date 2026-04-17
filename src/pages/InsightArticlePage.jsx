import { useEffect, useMemo, useState } from 'react';
import { useAnalytics } from '../analytics/useAnalytics';
import InsightsLayout from '../components/InsightsLayout';
import { loadArticleBySlug } from '../data/insights/articles';
import { buildSidebarRelatedLinks } from '../data/insights/navigation';
import { formatDateLabel, renderMarkdownContent } from '../data/insights/articleParser';
import { useSeo } from '../hooks/useSeo';
import { getInsightArticleSeo } from '../seo/pageSeo';

const SECTION_BLOCK_TOKENS = {
  problemStatement: '[INTRO_QUOTES]',
  rootCauses: '[ROOT_CAUSE_CARDS]',
  stepByStepSolution: '[SUPPORT_LEVELS]',
  timeAndErrorSavingsEstimate: '[OUTCOME_CARDS]',
};

function ArticleCopyBlock({ html, isLead = false }) {
  if (!html) return null;

  return (
    <div
      className={`insight-copy-block ${isLead ? 'insight-copy-block--lead' : ''}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function IntroQuotes({ quotes }) {
  if (!quotes?.length) return null;

  return (
    <p className="insight-inline-note">
      You have probably heard the pitch already: {quotes.map((quote) => `"${quote}"`).join(' ')}
    </p>
  );
}

function SupportLevels({ levels }) {
  if (!levels?.length) return null;

  return (
    <div className="insight-level-grid" aria-label="AI support levels comparison">
      {levels.map((level) => (
        <article key={level.title} className="insight-level-card">
          <p className="insight-block-kicker">{level.title}</p>
          <dl className="insight-level-details">
            <div className="insight-level-row">
              <dt className="insight-level-label">Cost</dt>
              <dd className="insight-level-value">{level.cost}</dd>
            </div>
            <div className="insight-level-row">
              <dt className="insight-level-label">What it is</dt>
              <dd className="insight-level-value">{level.summary}</dd>
            </div>
            <div className="insight-level-row">
              <dt className="insight-level-label">Who it is for</dt>
              <dd className="insight-level-value">{level.audience}</dd>
            </div>
          </dl>
          {level.note && <p className="insight-level-note">{level.note}</p>}
        </article>
      ))}
    </div>
  );
}

function RootCauseList({ items }) {
  if (!items?.length) return null;

  return (
    <ol className="insight-simple-list" aria-label="Common setup failures">
      {items.map((item) => (
        <li key={item.title}>
          <strong>{item.title}.</strong> {item.body}
        </li>
      ))}
    </ol>
  );
}

function OutcomeList({ items }) {
  if (!items?.length) return null;

  return (
    <ul className="insight-example-list" aria-label="Example support outcomes">
      {items.map((item) => (
        <li key={item.label}>
          <strong>{item.label}.</strong> {item.outcome}
        </li>
      ))}
    </ul>
  );
}

function FaqList({ items }) {
  if (!items?.length) return null;

  return (
    <div className="insight-faq-list">
      {items.map((item) => (
        <details key={item.question} className="insight-faq-item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

function renderStructuredBlock(sectionKey, article) {
  if (sectionKey === 'problemStatement') {
    return <IntroQuotes quotes={article.introQuotes} />;
  }

  if (sectionKey === 'rootCauses') {
    return <RootCauseList items={article.rootCauseCards} />;
  }

  if (sectionKey === 'stepByStepSolution') {
    return <SupportLevels levels={article.supportLevels} />;
  }

  if (sectionKey === 'timeAndErrorSavingsEstimate') {
    return <OutcomeList items={article.outcomeCards} />;
  }

  return null;
}

function StructuredSectionContent({ section, article }) {
  if (section.key === 'faqBlock' && article.faqItems.length) {
    return <FaqList items={article.faqItems} />;
  }

  const token = SECTION_BLOCK_TOKENS[section.key];

  if (!token || !section.markdown.includes(token)) {
    return <ArticleCopyBlock html={section.html} isLead />;
  }

  const [beforeToken, afterToken] = section.markdown.split(token);
  const beforeHtml = renderMarkdownContent(beforeToken.trim());
  const afterHtml = renderMarkdownContent(afterToken.trim());
  const structuredBlock = renderStructuredBlock(section.key, article);

  return (
    <>
      <ArticleCopyBlock html={beforeHtml} isLead />
      {structuredBlock}
      <ArticleCopyBlock html={afterHtml} />
    </>
  );
}

function InsightArticlePage({ articleSlug, articleMeta, currentPath, onContact, initialArticle = null }) {
  const [article, setArticle] = useState(initialArticle);
  const [status, setStatus] = useState(initialArticle ? 'ready' : 'loading');
  const { track } = useAnalytics();

  useEffect(() => {
    if (initialArticle) return undefined;

    let ignore = false;

    loadArticleBySlug(articleSlug)
      .then((result) => {
        if (ignore) return;

        setArticle(result);
        setStatus(result ? 'ready' : 'missing');
      })
      .catch(() => {
        if (ignore) return;
        setArticle(null);
        setStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [articleSlug, initialArticle]);

  const relatedLinks = useMemo(
    () => buildSidebarRelatedLinks(articleMeta.slug, 3),
    [articleMeta.slug],
  );

  const mainSections = useMemo(
    () => article?.orderedSections.filter((section) => section.key !== 'faqBlock') ?? [],
    [article],
  );

  const faqSection = article?.sections.faqBlock ?? null;

  const seo = useMemo(() => getInsightArticleSeo(articleMeta, article), [article, articleMeta]);

  useSeo(seo);

  return (
    <InsightsLayout
      currentPath={currentPath}
      onContact={onContact}
      footerVariant="minimal"
      shellClassName="insights-shell--article"
      contentClassName="insights-docs-content--article"
    >
      <div className="insight-article-page">
        <header className="insight-article-header">
          <p className="insights-masthead-label">Uroboros Digital Insights</p>
          <div className="insight-article-meta-row">
            <span className="insights-card-category">{articleMeta.category}</span>
            <div className="insights-card-meta insight-article-meta-list">
              <span>{formatDateLabel(articleMeta.publishedAt)}</span>
              <span>Updated {formatDateLabel(articleMeta.updatedAt)}</span>
              <span>{articleMeta.readTime} min read</span>
            </div>
          </div>
          <h1>{articleMeta.title}</h1>
          <p className="insight-article-dek">{articleMeta.excerpt}</p>
        </header>

        <article className="insight-docs-article insight-docs-article--reading">
          {status === 'loading' && (
            <section className="insight-docs-section insight-docs-section--loading">
              <div className="insight-loading-block" aria-live="polite">
                <p>Loading article...</p>
              </div>
            </section>
          )}

          {status === 'ready' && article && (
            <>
              {mainSections.map((section) => (
                <section key={section.id} id={section.id} className="insight-docs-section">
                  <h2>{section.title}</h2>
                  <StructuredSectionContent section={section} article={article} />
                </section>
              ))}

              <section className="insight-docs-section insight-docs-section--cta">
                <div className="insight-inline-cta">
                  <p className="insight-inline-cta-label">Need a practical read on your workflow?</p>
                  <h3>{article.finalCtaTitle ?? 'Translate this into execution'}</h3>
                  <p>
                    {article.finalCtaBody ?? 'Get a tailored implementation roadmap with clear milestones and ownership.'}
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    data-contact-trigger="true"
                    onClick={() => {
                      track('insight_article_cta_click', {
                        article_slug: articleMeta.slug,
                        article_title: articleMeta.title,
                      });
                      onContact({
                        article_slug: articleMeta.slug,
                        article_title: articleMeta.title,
                        cta_label: article.finalCtaButtonLabel ?? 'Book a strategy call',
                        cta_placement: 'insight_article_inline',
                      });
                    }}
                  >
                    {article.finalCtaButtonLabel ?? 'Book a strategy call'}
                  </button>
                  <div className="insight-inline-links">
                    <a href="/contact" className="btn-secondary">Go to contact</a>
                    <a href="/#services" className="insight-inline-link">Browse services</a>
                    <a href="/about" className="insight-inline-link">About how I work</a>
                  </div>
                </div>
              </section>

              {faqSection && article.faqItems.length > 0 && (
                <section key={faqSection.id} id={faqSection.id} className="insight-docs-section">
                  <h2>{faqSection.title}</h2>
                  <StructuredSectionContent section={faqSection} article={article} />
                </section>
              )}

              <section className="insight-docs-section insight-docs-section--tail">
                {article.authorBio && (
                  <div className="insight-author-bio">
                    <p>{article.authorBio}</p>
                  </div>
                )}

                {relatedLinks.length > 0 && (
                  <div className="insight-related-links">
                    <p className="insight-related-label">Keep reading</p>
                    <div className="insight-related-list">
                      {relatedLinks.map((item) => (
                        <a key={item.slug} href={item.url}>
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </>
          )}

          {(status === 'missing' || status === 'error') && (
            <section className="insight-docs-section insight-docs-section--loading">
              <div className="insight-loading-block">
                <p>Could not load this article right now. Please try again.</p>
              </div>
            </section>
          )}
        </article>
      </div>
    </InsightsLayout>
  );
}

export default InsightArticlePage;
