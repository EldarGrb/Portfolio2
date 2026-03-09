import { useState } from 'react';
import Icons from './Icons';
import { processSteps } from '../data/processData';
import { useFadeIn } from '../hooks/useFadeIn';

function Process() {
  const [step, setStep] = useState(0);
  const ref = useFadeIn();
  const stepLabels = ['Discover', 'Build', 'Launch'];
  return (
    <section className="section process" id="process" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="process-layout">
        <div className="process-left">
          <span className="section-signature" aria-hidden="true"><Icons.Logo /></span>
          <h2 className="section-title">Our method for delivering exceptional results</h2>
          <p>
            A streamlined 3-phase approach ensures your project gets
            a focused strategy, practical solutions, and measurable outcomes.
          </p>
          <div className="process-chart">
            <svg width="100%" height="100%" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eefcb3" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#eefcb3" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
                <line x1="0" y1="40" x2="600" y2="40" />
                <line x1="0" y1="80" x2="600" y2="80" />
                <line x1="0" y1="120" x2="600" y2="120" />
                <line x1="150" y1="0" x2="150" y2="160" strokeDasharray="4,4" />
                <line x1="300" y1="0" x2="300" y2="160" strokeDasharray="4,4" />
                <line x1="450" y1="0" x2="450" y2="160" strokeDasharray="4,4" />
              </g>
              {/* Area fill */}
              <path d="M0 140 Q100 120 150 100 Q250 60 300 50 Q400 30 500 20 Q550 15 600 10 L600 160 L0 160 Z" fill="url(#chartGrad)" />
              {/* Line */}
              <path d="M0 140 Q100 120 150 100 Q250 60 300 50 Q400 30 500 20 Q550 15 600 10" stroke="#eefcb3" strokeWidth="2" fill="none" />
              {/* Data point */}
              <circle cx="300" cy="50" r="4" fill="#eefcb3" />
            </svg>
          </div>
        </div>
        <div className="process-steps">
          <div className="step-tabs">
            {stepLabels.map((label, i) => (
              <button className={`step-tab ${i === step ? 'active' : ''}`} key={i} onClick={() => setStep(i)}>
                {label}
              </button>
            ))}
          </div>
          <div className="step-content">
            {processSteps[step].map((s, i) => {
              const Icon = Icons[s.icon];
              return (
                <article className="step-row" key={i}>
                  <div className="step-row-meta" aria-hidden="true">
                    <span className="step-row-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="step-row-icon"><Icon /></span>
                  </div>
                  <div className="step-row-body">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Process;
