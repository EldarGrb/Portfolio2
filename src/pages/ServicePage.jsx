import Footer from '../components/Footer';
import Icons from '../components/Icons';
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
  const websiteProofChips = [
    'Clearer offer',
    'Stronger trust',
    'Better conversion path',
  ];
  const webAppsProofChips = [
    'Less context switching',
    'Clearer ownership',
    'Steadier delivery',
  ];
  const supportBeforeItems = [
    {
      system: 'Support inbox',
      target: 'Unread',
      title: 'Where is my order?',
      detail: 'Customer has already followed up and nobody owns the reply yet.',
      status: 'Needs routing',
      tone: 'warning',
      variant: 'a',
    },
    {
      system: 'Customer support',
      target: 'Waiting',
      title: 'Need help with setup',
      detail: 'The request is sitting in the pile without a clear next step.',
      status: 'Still waiting',
      tone: 'muted',
      variant: 'b',
    },
    {
      system: 'Reply queue',
      target: 'No owner',
      title: 'Can someone reply?',
      detail: 'Another message lands, but nobody knows who should pick it up.',
      status: 'No owner',
      tone: 'warning',
      variant: 'c',
    },
  ];
  const supportAfterItems = [
    {
      system: 'Urgent issue',
      target: 'Owner set',
      title: 'Urgent issue assigned',
      detail: 'High-priority requests land with the right person immediately.',
      status: 'Rule matched',
      tone: 'success',
    },
    {
      system: 'Setup question',
      target: 'Reply ready',
      title: 'Setup question summarized',
      detail: 'The team gets the context without rereading the whole thread.',
      status: 'Summary ready',
      tone: 'success',
    },
    {
      system: 'Billing request',
      target: 'Next step clear',
      title: 'Billing request routed',
      detail: 'The handoff is visible, owned, and easy to follow.',
      status: 'Routed cleanly',
      tone: 'live',
    },
  ];
  const supportProofChips = [
    'Less back-and-forth',
    'Faster first response',
    'Clearer ownership',
  ];

  useSeo(getServiceSeo(service));

  if (!service) {
    return null;
  }

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

            <div className="workflow-poster-visual">
              <div className="workflow-poster-visual-frame">
                <ServiceVisual visual={service.visual} label={service.imageAlt} />
              </div>
              <div className="workflow-poster-note">
                <span className="service-page-visual-icon" aria-hidden="true">
                  <ServiceIcon />
                </span>
                <p>{service.signal}</p>
              </div>
            </div>
          </section>

          <section className="website-proof" aria-labelledby="website-proof-title">
            <div className="workflow-proof-head">
              <p className="section-label">Before / After</p>
              <h2 id="website-proof-title">From vague first impression to clear offer.</h2>
            </div>

            <div className="website-proof-board">
              <div className="website-proof-window website-proof-window--before" aria-label="Before website clarity">
                <div className="website-proof-browser">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="website-proof-nav website-proof-nav--before">
                  <span>About</span>
                  <span>Services</span>
                  <span>Why us</span>
                  <span>Process</span>
                </div>
                <div className="website-proof-copy website-proof-copy--before">
                  <em>Too many messages</em>
                  <strong>Digital solutions for modern businesses</strong>
                  <p>Everything is present, but nothing lands first.</p>
                </div>
                <div className="website-proof-actions website-proof-actions--before">
                  <span>Learn more</span>
                  <span>See work</span>
                  <span>Get started</span>
                </div>
                <div className="website-proof-grid website-proof-grid--before">
                  <div>About us</div>
                  <div>Services</div>
                  <div>Why choose us</div>
                  <div>Our process</div>
                </div>
              </div>

              <div className="workflow-proof-divider" aria-hidden="true">
                <span>Clarifies fast</span>
                <Icons.ArrowRight />
              </div>

              <div className="website-proof-window website-proof-window--after" aria-label="After website clarity">
                <div className="website-proof-browser">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="website-proof-copy website-proof-copy--after">
                  <em>One clear offer</em>
                  <strong>Websites that explain what you do and make the next step obvious.</strong>
                  <p>Who it is for, what it solves, and what to do next all land quickly.</p>
                </div>
                <div className="website-proof-action website-proof-action--after">Talk through the build</div>
                <div className="website-proof-trust">
                  <span>What you do</span>
                  <span>Who it helps</span>
                  <span>Next step</span>
                </div>
              </div>
            </div>

            <div className="workflow-proof-chips" aria-label="Website outcomes">
              {websiteProofChips.map((chip) => (
                <span className="workflow-proof-chip" key={chip}>{chip}</span>
              ))}
            </div>
          </section>

          <section className="workflow-poster-cta" aria-labelledby="website-cta-title">
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

            <div className="workflow-poster-visual">
              <div className="workflow-poster-visual-frame">
                <ServiceVisual visual={service.visual} label={service.imageAlt} />
              </div>
              <div className="workflow-poster-note">
                <span className="service-page-visual-icon" aria-hidden="true">
                  <ServiceIcon />
                </span>
                <p>{service.signal}</p>
              </div>
            </div>
          </section>

          <section className="webapp-proof" aria-labelledby="webapp-proof-title">
            <div className="workflow-proof-head">
              <p className="section-label">Before / After</p>
              <h2 id="webapp-proof-title">From scattered tabs to one dependable workspace.</h2>
            </div>

            <div className="webapp-proof-board">
              <div className="webapp-proof-side webapp-proof-side--before" aria-label="Before unified workspace">
                <div className="webapp-proof-cluster">
                  <article className="webapp-proof-fragment webapp-proof-fragment--sheet">
                    <span>Spreadsheet</span>
                    <strong>Latest status?</strong>
                  </article>
                  <article className="webapp-proof-fragment webapp-proof-fragment--chat">
                    <span>Team chat</span>
                    <strong>Which version is current?</strong>
                  </article>
                  <article className="webapp-proof-fragment webapp-proof-fragment--inbox">
                    <span>Inbox</span>
                    <strong>Waiting on update</strong>
                  </article>
                  <article className="webapp-proof-fragment webapp-proof-fragment--notes">
                    <span>Notes</span>
                    <strong>Owner unclear</strong>
                  </article>
                </div>
              </div>

              <div className="workflow-proof-divider" aria-hidden="true">
                <span>Brings work together</span>
                <Icons.ArrowRight />
              </div>

              <div className="webapp-proof-side webapp-proof-side--after" aria-label="After unified workspace">
                <div className="webapp-proof-workspace">
                  <div className="webapp-proof-sidebar">
                    <span>Overview</span>
                    <span>Projects</span>
                    <span>Owners</span>
                  </div>
                  <div className="webapp-proof-main">
                    <div className="webapp-proof-toolbar">
                      <strong>Delivery workspace</strong>
                      <em>One source of truth</em>
                    </div>
                    <div className="webapp-proof-rows">
                      <div><span>Build status</span><strong>Owner set</strong></div>
                      <div><span>Next action</span><strong>Ready now</strong></div>
                      <div><span>Client update</span><strong>Shared cleanly</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="workflow-proof-chips" aria-label="Web app outcomes">
              {webAppsProofChips.map((chip) => (
                <span className="workflow-proof-chip" key={chip}>{chip}</span>
              ))}
            </div>
          </section>

          <section className="workflow-poster-cta" aria-labelledby="webapp-cta-title">
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

            <div className="workflow-poster-visual">
              <div className="workflow-poster-visual-frame">
                <ServiceVisual visual={service.visual} label={service.imageAlt} />
              </div>
              <div className="workflow-poster-note">
                <span className="service-page-visual-icon" aria-hidden="true">
                  <ServiceIcon />
                </span>
                <p>{service.signal}</p>
              </div>
            </div>
          </section>

          <section className="workflow-proof" aria-labelledby="workflow-proof-title">
            <div className="workflow-proof-head">
              <p className="section-label">Before / After</p>
              <h2 id="workflow-proof-title">From unread pile to calm queue.</h2>
            </div>

            <div className="workflow-proof-board">
              <div className="workflow-proof-lane workflow-proof-lane--before" aria-label="Before automation">
                <div className="workflow-proof-lane-head">
                  <span className="section-label">Before</span>
                  <span className="workflow-proof-lane-tag">Support overload</span>
                </div>

                <div className="workflow-proof-stack">
                  {supportBeforeItems.map((item) => (
                    <article
                      className={`workflow-proof-card workflow-proof-card--before workflow-proof-card--${item.variant}`}
                      key={`${item.system}-${item.title}`}
                    >
                      <div className="workflow-proof-card-top">
                        <span>{item.system}</span>
                        <em>{item.target}</em>
                      </div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                      <span className={`workflow-proof-state workflow-proof-state--${item.tone}`}>{item.status}</span>
                    </article>
                  ))}
                </div>
              </div>

              <div className="workflow-proof-divider" aria-hidden="true">
                <span>Triage kicks in</span>
                <Icons.ArrowRight />
              </div>

              <div className="workflow-proof-lane workflow-proof-lane--after" aria-label="After automation">
                <div className="workflow-proof-lane-head">
                  <span className="section-label">After</span>
                  <span className="workflow-proof-lane-tag">Calm triage</span>
                </div>

                <div className="workflow-proof-stack workflow-proof-stack--aligned">
                  {supportAfterItems.map((item) => (
                    <article className="workflow-proof-card workflow-proof-card--after" key={`${item.system}-${item.title}`}>
                      <div className="workflow-proof-card-top">
                        <span>{item.system}</span>
                        <em>{item.target}</em>
                      </div>
                      <strong>{item.title}</strong>
                      <p>{item.detail}</p>
                      <span className={`workflow-proof-state workflow-proof-state--${item.tone}`}>{item.status}</span>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="workflow-proof-chips" aria-label="Workflow outcomes">
              {supportProofChips.map((chip) => (
                <span className="workflow-proof-chip" key={chip}>{chip}</span>
              ))}
            </div>
          </section>

          <section className="workflow-poster-cta" aria-labelledby="workflow-poster-close-title">
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
