import { useState } from 'react';
import Footer from '../components/Footer';
import SiteNav from '../components/SiteNav';
import { useSeo } from '../hooks/useSeo';
import { getAboutSeo } from '../seo/pageSeo';

function AboutPage({ currentPath, onContact }) {
  const [portraitReady, setPortraitReady] = useState(true);

  useSeo(getAboutSeo());

  return (
    <div className="page-shell about-page-shell">
      <SiteNav currentPath={currentPath} onContact={onContact} />

      <main className="about-page">
        <section className="about-hero" aria-labelledby="about-title">
          <div className="about-hero-copy">
            <p className="section-label">About</p>
            <h1 id="about-title">
              I build software that helps businesses move with less friction.
            </h1>
            <p className="about-intro">
              I&apos;m Eldar Jahic, the person behind Uroboros Systems. I work with small businesses
              and solo founders who need a website, web app, or workflow that actually removes
              pressure instead of adding another layer of process.
            </p>
            <p className="about-body">
              The pattern I kept seeing was simple: teams usually did not need more ideas.
              They needed clearer systems, cleaner handoffs, and software that stayed dependable
              after launch. That is the kind of work I now structure this practice around.
            </p>
            <div className="about-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => onContact({ cta_label: "Tell me what's slowing the business down", cta_placement: 'about_page_hero' })}
              >
                Tell me what&apos;s slowing the business down
              </button>
              <a href="/#services" className="btn-secondary">
                See services
              </a>
            </div>
          </div>

          <figure className="about-portrait">
            <div className="about-portrait-frame">
              {portraitReady ? (
                <img
                  className="about-portrait-photo"
                  src="/images/about-portrait.png"
                  alt="Portrait of Eldar Jahic"
                  loading="eager"
                  onError={() => setPortraitReady(false)}
                />
              ) : (
                <div className="about-portrait-image about-portrait-image--placeholder" aria-label="Portrait fallback">
                  <div className="about-portrait-labels">
                    <span className="about-portrait-kicker">Portrait coming soon</span>
                    <span className="about-portrait-note">
                      A real photo will live here once the final portrait is added.
                    </span>
                  </div>
                </div>
              )}
            </div>
            <figcaption className="about-portrait-caption">
              Based in Bosnia and Herzegovina, working remotely with small businesses and founders who need dependable software support.
            </figcaption>
          </figure>
        </section>

        <section className="about-story" aria-labelledby="about-story-title">
          <div className="about-story-main">
            <p className="section-label">Story</p>
            <h2 id="about-story-title">Built around clarity, not noise.</h2>
            <p>
              Uroboros Systems grew out of a practical habit: listening for the part of a business
              that was slowing everything else down. Sometimes that is the website. Sometimes it is
              an intake flow, a manual follow-up process, or a tool stack that does not talk to
              itself.
            </p>
            <p>
              I like work that starts with the real bottleneck, stays honest about scope, and ends
              with something a team can actually use without a long explanation.
            </p>
            <p>
              The goal is not flash. The goal is software that feels steady, useful, and easy to
              trust once it is in the world.
            </p>
          </div>

          <aside className="about-story-aside" aria-labelledby="about-principles-title">
            <p className="section-label">How I work</p>
            <h3 id="about-principles-title">Three things I keep close on every project.</h3>
            <ul className="about-principles">
              <li>
                <strong>Start with the bottleneck.</strong>
                <span>Find the workflow or message that is costing the most time, confidence, or momentum.</span>
              </li>
              <li>
                <strong>Keep the handoff clean.</strong>
                <span>Build something the business can keep using without a fragile process behind it.</span>
              </li>
              <li>
                <strong>Make the next step obvious.</strong>
                <span>Every page, flow, and decision should point toward a clear action.</span>
              </li>
            </ul>
          </aside>
        </section>
      </main>

      <Footer onContact={onContact} currentPath={currentPath} />
    </div>
  );
}

export default AboutPage;
