import AnimatedStat from './AnimatedStat';
import { stats } from '../data/statsData';
import { useFadeIn } from '../hooks/useFadeIn';

function Stats() {
  const ref = useFadeIn();
  return (
    <section className="section stats" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="stats-content">
        <div className="stats-visual">
          <img src="/images/earth.jpg" alt="Global reach" className="stats-image" />
        </div>
        <div className="stats-text">
          <h2 className="section-title">Proven performance, measurable results</h2>
          <p>
            Every project is backed by measurable outcomes. These numbers reflect
            the quality, reliability, and impact I bring to every engagement.
          </p>
          <div className="stats-grid">
            {stats.map((s, i) => <AnimatedStat key={i} number={s.number} label={s.label} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
