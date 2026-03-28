import Footer from '../components/Footer';
import Icons from '../components/Icons';
import SiteNav from '../components/SiteNav';
import { useSeo } from '../hooks/useSeo';
import { getContactSeo } from '../seo/pageSeo';

const contactOptions = [
  {
    id: 'website-or-web-app',
    title: 'Website or web app',
    summary: 'Best when the offer is not landing clearly, the current site feels thin, or an internal tool is slowing delivery.',
    ctaLabel: 'Talk through the build',
    ctaPlacement: 'contact_path_website',
    supportingHref: '/#services',
    supportingLabel: 'See service fit',
  },
  {
    id: 'workflow-automation',
    title: 'Workflow automation',
    summary: 'Best when lead follow-up, internal handoffs, or reporting still depend on repetitive manual work.',
    ctaLabel: 'Scope the workflow',
    ctaPlacement: 'contact_path_workflow',
    supportingHref: '/insights/fix-slow-lead-follow-up-with-ai-chatbot-and-enrichment',
    supportingLabel: 'Read a workflow example',
  },
  {
    id: 'assistant-layer',
    title: 'Voice or chat assistant',
    summary: 'Best when the business needs better first-response coverage, support triage, or cleaner intake before a human handoff.',
    ctaLabel: 'Plan the assistant',
    ctaPlacement: 'contact_path_assistant',
    supportingHref: '/insights/reduce-customer-support-costs-with-ai',
    supportingLabel: 'Read an assistant strategy note',
  },
];

const trustSignals = [
  {
    icon: 'Shield',
    title: 'Clear first step',
    copy: 'You do not need a full spec. A short note on what feels broken is enough to start.',
  },
  {
    icon: 'Rocket',
    title: 'Fast reply window',
    copy: 'You will get a response within 24 hours with a sensible next step, not a generic sales reply.',
  },
  {
    icon: 'Globe',
    title: 'Remote-first delivery',
    copy: 'Projects are scoped for async collaboration, clear handoffs, and practical rollout across time zones.',
  },
];

function ContactPage({ currentPath, onContact }) {
  useSeo(getContactSeo());

  return (
    <div className="page-shell contact-page-shell">
      <SiteNav currentPath={currentPath} onContact={onContact} />

      <main className="contact-page">
        <section className="contact-hero" aria-labelledby="contact-title">
          <div className="contact-hero-copy">
            <p className="section-label">Contact</p>
            <h1 id="contact-title">Start with the bottleneck that is costing the business the most.</h1>
            <p className="contact-intro">
              If the website is not converting, operations feel messy, or follow-up is still too
              manual, this page is the cleanest place to start.
            </p>
            <p className="contact-body">
              Send a short note about what is blocking progress, what you are trying to launch, or
              where the current setup is falling apart. From there, we can decide whether the right
              first move is a website, a workflow rebuild, or an AI-assisted layer.
            </p>

            <div className="contact-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => onContact({
                  cta_label: "Tell me what's slowing the business down",
                  cta_placement: 'contact_page_hero',
                })}
              >
                Tell me what&apos;s slowing the business down
              </button>
              <a href="/#services" className="btn-secondary">
                Review services first
              </a>
            </div>

            <div className="contact-quick-links" aria-label="Helpful internal links">
              <a href="/about">About how I work</a>
              <a href="/insights">Read recent insights</a>
              <a href="/#process">See the project process</a>
            </div>
          </div>

          <aside className="contact-hero-aside" aria-labelledby="contact-trust-title">
            <p className="section-label">What to expect</p>
            <h2 id="contact-trust-title">A calmer path into the project.</h2>
            <div className="contact-trust-list">
              {trustSignals.map((signal) => {
                const Icon = Icons[signal.icon];

                return (
                  <article className="contact-trust-card" key={signal.title}>
                    <div className="contact-trust-icon" aria-hidden="true">
                      <Icon />
                    </div>
                    <div>
                      <h3>{signal.title}</h3>
                      <p>{signal.copy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>
        </section>

        <section className="contact-paths" aria-labelledby="contact-paths-title">
          <div className="contact-section-heading">
            <p className="section-label">Choose the closest fit</p>
            <h2 id="contact-paths-title">Three common starting points.</h2>
            <p>
              Pick the path that sounds closest. It only shapes the conversation so the first reply
              is more useful.
            </p>
          </div>

          <div className="contact-path-grid">
            {contactOptions.map((option) => (
              <article className="contact-path-card" key={option.id}>
                <p className="contact-path-kicker">{option.title}</p>
                <p className="contact-path-summary">{option.summary}</p>
                <div className="contact-path-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onContact({
                      cta_label: option.ctaLabel,
                      cta_placement: option.ctaPlacement,
                      project_type: option.id,
                    })}
                  >
                    {option.ctaLabel}
                  </button>
                  <a href={option.supportingHref} className="contact-inline-link">
                    {option.supportingLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-proof" aria-labelledby="contact-proof-title">
          <div className="contact-proof-main">
            <p className="section-label">Before you reach out</p>
            <h2 id="contact-proof-title">The most helpful note is a practical one.</h2>
            <p>
              A strong message usually includes one operational problem, one desired outcome, and any
              timeline pressure that matters. That is enough to decide whether the first move should be
              strategy, a focused build, or a cleanup pass.
            </p>
          </div>

          <div className="contact-proof-links" aria-label="Helpful next steps">
            <a href="/about" className="contact-proof-link">
              Read how projects are scoped
            </a>
            <a href="/insights/fix-slow-lead-follow-up-with-ai-chatbot-and-enrichment" className="contact-proof-link">
              See a lead-ops example
            </a>
            <a href="/insights/reduce-customer-support-costs-with-ai" className="contact-proof-link">
              See an AI support example
            </a>
          </div>
        </section>
      </main>

      <Footer onContact={onContact} currentPath={currentPath} />
    </div>
  );
}

export default ContactPage;
