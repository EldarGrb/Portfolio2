import Footer from '../components/Footer';
import Icons from '../components/Icons';
import ServicePreviewImage from '../components/ServicePreviewImage';
import ServiceVisual from '../components/ServiceVisual';
import SiteNav from '../components/SiteNav';
import { getArticleBySlug } from '../data/insights/articles';
import { getServiceBySlug, services } from '../data/servicesData';
import { useSeo } from '../hooks/useSeo';
import { getServiceSeo } from '../seo/pageSeo';

function ServicePage({ currentPath, onContact, serviceSlug }) {
  const service = getServiceBySlug(serviceSlug);
  const relatedInsights = service?.relatedInsights
    .map((slug) => getArticleBySlug(slug))
    .filter(Boolean) ?? [];
  const siblingServices = services
    .filter((entry) => entry.slug !== serviceSlug)
    .slice(0, 3);
  const serviceTags = service?.tags.slice(0, 3) ?? [];
  const scanProblems = service?.problems.slice(0, 2) ?? [];
  const scanOutcomes = service?.outcomes.slice(0, 2) ?? [];
  const visibleDeliverables = service?.deliverables.slice(0, 4) ?? [];
  const nextLinks = [
    {
      href: service.supportingHref,
      kicker: 'Start here',
      title: service.supportingLabel,
    },
    ...relatedInsights.slice(0, 1).map((article) => ({
      href: article.url,
      kicker: article.category,
      title: article.title,
    })),
    ...siblingServices.slice(0, 1).map((entry) => ({
      href: entry.href,
      kicker: entry.pageEyebrow,
      title: entry.title,
    })),
  ];
  const ServiceIcon = Icons[service?.icon] ?? Icons.Star;
  const isWebsitePoster = service?.slug === 'websites';
  const isWebAppsPoster = service?.slug === 'web-apps';
  const isAiWorkflowPoster = service?.slug === 'ai-workflows';
  useSeo(getServiceSeo(service));

  if (!service) {
    return null;
  }

  const posterFaqTitle = {
    websites: 'Questions that usually come up before a website rebuild or restructure starts.',
    'web-apps': 'Questions that usually come up before a web app scope gets defined.',
    'ai-workflows': 'Questions that usually come up before automation work begins.',
  };

  const renderPosterVisual = () => (
    <div className="workflow-poster-visual">
      <div className="workflow-poster-visual-frame workflow-poster-visual-frame--photo">
        <div className="workflow-poster-image-shell service-image-wrapper">
          <ServicePreviewImage visual={service.visual} label={service.imageAlt} />
        </div>
      </div>
      <div className="workflow-poster-note">
        <span className="service-page-visual-icon" aria-hidden="true">
          <ServiceIcon />
        </span>
        <p>{service.signal}</p>
      </div>
    </div>
  );

  const renderFaqSection = (title) => (
    service.faqs?.length ? (
      <section className="service-page-faq" aria-labelledby={`service-faq-title-${service.slug}`}>
        <div className="service-page-faq-head">
          <p className="section-label">Q&A</p>
          <h2 id={`service-faq-title-${service.slug}`}>{title}</h2>
        </div>

        <div className="insight-faq-list service-page-faq-list">
          {service.faqs.map((item) => (
            <details className="insight-faq-item service-page-faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    ) : null
  );

  if (isWebsitePoster) {
    return (
      <div className="page-shell service-page-shell service-page-shell--poster">
        <SiteNav currentPath={currentPath} onContact={onContact} />

        <main className="service-page service-page--poster">
          <section className="workflow-poster-hero" aria-labelledby="service-page-title">
            <div className="workflow-poster-copy">
              <p className="section-label">{service.pageEyebrow}</p>
              <h1 id="service-page-title">Websites that make the offer clear the moment someone lands.</h1>
              <p className="workflow-poster-intro">{service.description}</p>

              <div className="service-page-actions">
                <button
                  type="button"
                  className="btn-primary"
                  data-contact-trigger="true"
                  onClick={() => onContact({
                    cta_label: `Talk through ${service.pageLabel.toLowerCase()}`,
                    cta_placement: `service_page_${service.slug}_hero`,
                    service_name: service.title,
                    service_slug: service.slug,
                  })}
                >
                  Talk through this service
                </button>
                <a href="/contact" className="service-page-secondary-link">Use contact page</a>
              </div>
            </div>

            {renderPosterVisual()}
          </section>

          {renderFaqSection(posterFaqTitle[service.slug])}

          <section className="workflow-poster-cta" aria-labelledby="website-cta-title">
            <div className="workflow-poster-cta-panel">
              <div className="workflow-poster-cta-copy">
                <p className="section-label">Next step</p>
                <h2 id="website-cta-title">Start with the page that needs to explain the business fastest.</h2>
                <p className="workflow-poster-cta-note">
                  A rough note is enough. We can sharpen the message and structure from there.
                </p>
                <div className="service-page-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    data-contact-trigger="true"
                    onClick={() => onContact({
                      cta_label: `Start ${service.pageLabel.toLowerCase()} conversation`,
                      cta_placement: `service_page_${service.slug}_footer`,
                      service_name: service.title,
                      service_slug: service.slug,
                    })}
                  >
                    Start the conversation
                  </button>
                  <a href="/contact" className="service-page-secondary-link">Use contact page</a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer onContact={onContact} currentPath={currentPath} />
      </div>
    );
  }

  if (isWebAppsPoster) {
    return (
      <div className="page-shell service-page-shell service-page-shell--poster">
        <SiteNav currentPath={currentPath} onContact={onContact} />

        <main className="service-page service-page--poster">
          <section className="workflow-poster-hero" aria-labelledby="service-page-title">
            <div className="workflow-poster-copy">
              <p className="section-label">{service.pageEyebrow}</p>
              <h1 id="service-page-title">Web apps that bring scattered work into one clear workspace.</h1>
              <p className="workflow-poster-intro">{service.description}</p>

              <div className="service-page-actions">
                <button
                  type="button"
                  className="btn-primary"
                  data-contact-trigger="true"
                  onClick={() => onContact({
                    cta_label: `Talk through ${service.pageLabel.toLowerCase()}`,
                    cta_placement: `service_page_${service.slug}_hero`,
                    service_name: service.title,
                    service_slug: service.slug,
                  })}
                >
                  Talk through this service
                </button>
                <a href="/contact" className="service-page-secondary-link">Use contact page</a>
              </div>
            </div>

            {renderPosterVisual()}
          </section>

          {renderFaqSection(posterFaqTitle[service.slug])}

          <section className="workflow-poster-cta" aria-labelledby="webapp-cta-title">
            <div className="workflow-poster-cta-panel">
              <div className="workflow-poster-cta-copy">
                <p className="section-label">Next step</p>
                <h2 id="webapp-cta-title">Start with the workflow everyone keeps stitching together by hand.</h2>
                <p className="workflow-poster-cta-note">
                  A rough outline is enough. We can turn the scattered process into one dependable workspace.
                </p>
                <div className="service-page-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    data-contact-trigger="true"
                    onClick={() => onContact({
                      cta_label: `Start ${service.pageLabel.toLowerCase()} conversation`,
                      cta_placement: `service_page_${service.slug}_footer`,
                      service_name: service.title,
                      service_slug: service.slug,
                    })}
                  >
                    Start the conversation
                  </button>
                  <a href="/contact" className="service-page-secondary-link">Use contact page</a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer onContact={onContact} currentPath={currentPath} />
      </div>
    );
  }

  if (isAiWorkflowPoster) {
    return (
      <div className="page-shell service-page-shell service-page-shell--poster">
        <SiteNav currentPath={currentPath} onContact={onContact} />

        <main className="service-page service-page--poster">
          <section className="workflow-poster-hero" aria-labelledby="service-page-title">
            <div className="workflow-poster-copy">
              <p className="section-label">{service.pageEyebrow}</p>
              <h1 id="service-page-title">AI workflows that remove repetitive admin and keep work moving.</h1>
              <p className="workflow-poster-intro">{service.description}</p>

              <div className="service-page-actions">
                <button
                  type="button"
                  className="btn-primary"
                  data-contact-trigger="true"
                  onClick={() => onContact({
                    cta_label: `Talk through ${service.pageLabel.toLowerCase()}`,
                    cta_placement: `service_page_${service.slug}_hero`,
                    service_name: service.title,
                    service_slug: service.slug,
                  })}
                >
                  Talk through this service
                </button>
                <a href="/contact" className="service-page-secondary-link">Use contact page</a>
              </div>
            </div>

            {renderPosterVisual()}
          </section>

          {renderFaqSection(posterFaqTitle[service.slug])}

          <section className="workflow-poster-cta" aria-labelledby="workflow-poster-close-title">
            <div className="workflow-poster-cta-panel">
              <div className="workflow-poster-cta-copy">
                <p className="section-label">Next step</p>
                <h2 id="workflow-poster-close-title">Start with the support request that keeps bouncing around.</h2>
                <p className="workflow-poster-cta-note">
                  A rough note is enough. We can turn the support bottleneck into the right workflow from there.
                </p>
                <div className="service-page-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    data-contact-trigger="true"
                    onClick={() => onContact({
                      cta_label: `Start ${service.pageLabel.toLowerCase()} conversation`,
                      cta_placement: `service_page_${service.slug}_footer`,
                      service_name: service.title,
                      service_slug: service.slug,
                    })}
                  >
                    Start the conversation
                  </button>
                  <a href="/contact" className="service-page-secondary-link">Use contact page</a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer onContact={onContact} currentPath={currentPath} />
      </div>
    );
  }

  return (
    <div className="page-shell service-page-shell">
      <SiteNav currentPath={currentPath} onContact={onContact} />

      <main className="service-page">
        <section className="service-page-hero" aria-labelledby="service-page-title">
          <div className="service-page-copy">
            <p className="section-label">{service.pageEyebrow}</p>
            <h1 id="service-page-title">{service.title}</h1>
            <p className="service-page-intro">{service.description}</p>

            <div className="service-page-actions">
              <button
                type="button"
                className="btn-primary"
                data-contact-trigger="true"
                onClick={() => onContact({
                  cta_label: `Talk through ${service.pageLabel.toLowerCase()}`,
                  cta_placement: `service_page_${service.slug}_hero`,
                  service_name: service.title,
                  service_slug: service.slug,
                })}
              >
                Talk through this service
              </button>
              <a href="/contact" className="service-page-secondary-link">Prefer the contact page?</a>
            </div>

            <div className="service-page-tags" aria-label="Service tags">
              {serviceTags.map((tag) => (
                <span className="service-page-tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="service-page-visual-wrap" aria-label={service.imageAlt}>
            <div className="service-page-visual-frame">
              <ServiceVisual visual={service.visual} label={service.imageAlt} />
            </div>
            <div className="service-page-visual-caption">
              <span className="service-page-visual-icon" aria-hidden="true">
                <ServiceIcon />
              </span>
              <p>{service.signal}</p>
            </div>
          </div>
        </section>

        <section className="service-page-scan" aria-labelledby="service-fit-title">
          <article className="service-page-scan-card service-page-scan-card--lead">
            <p className="section-label">Best fit</p>
            <h2 id="service-fit-title">{service.fit}</h2>
          </article>

          <article className="service-page-scan-card">
            <p className="section-label">Usually right when</p>
            <div className="service-page-mini-list">
              {scanProblems.map((problem) => (
                <div className="service-page-mini-row" key={problem}>
                  <span className="service-page-mini-icon" aria-hidden="true"><Icons.Check /></span>
                  <p>{problem}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="service-page-scan-card">
            <p className="section-label">What improves</p>
            <div className="service-page-mini-list">
              {scanOutcomes.map((outcome) => (
                <div className="service-page-mini-row" key={outcome}>
                  <span className="service-page-mini-icon" aria-hidden="true"><Icons.ArrowRight /></span>
                  <p>{outcome}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="service-page-delivery" aria-labelledby="service-delivery-title">
          <div className="service-page-delivery-copy">
            <p className="section-label">What you get</p>
            <h2 id="service-delivery-title">A focused scope built around the bottleneck, not a vague bundle of work.</h2>
          </div>

          <div className="service-page-deliverables">
            {visibleDeliverables.map((deliverable, index) => (
              <article className="service-page-deliverable" key={deliverable}>
                <span className="service-page-deliverable-index">{String(index + 1).padStart(2, '0')}</span>
                <p>{deliverable}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="service-page-next" aria-labelledby="service-next-title">
          <div className="service-page-next-copy">
            <p className="section-label">Next step</p>
            <h2 id="service-next-title">If this feels close, start with the blocker instead of writing a full brief.</h2>
            <div className="service-page-actions">
              <button
                type="button"
                className="btn-primary"
                data-contact-trigger="true"
                onClick={() => onContact({
                  cta_label: `Start ${service.pageLabel.toLowerCase()} conversation`,
                  cta_placement: `service_page_${service.slug}_footer`,
                  service_name: service.title,
                  service_slug: service.slug,
                })}
              >
                Start the conversation
              </button>
              <a href="/contact" className="service-page-secondary-link">Use the contact page</a>
            </div>
          </div>

          <div className="service-page-link-list" aria-label="Helpful next links">
            {nextLinks.map((item) => (
              <a className="service-page-link-card" href={item.href} key={`${item.kicker}-${item.href}`}>
                <span className="service-page-link-kicker">{item.kicker}</span>
                <strong>{item.title}</strong>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer onContact={onContact} currentPath={currentPath} />
    </div>
  );
}

export default ServicePage;
