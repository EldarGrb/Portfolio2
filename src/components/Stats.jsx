import { useState } from 'react';
import AnimatedStat from './AnimatedStat';
import Icons from './Icons';
import { stats } from '../data/statsData';
import { useFadeIn } from '../hooks/useFadeIn';

function Stats() {
  const [activeStat, setActiveStat] = useState(0);
  const ref = useFadeIn();
  return (
    <section className="section stats" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="stats-content">
        <div className="stats-visual">
          <img src="/images/earth.jpg" alt="Operational visibility visual" className="stats-image" />
        </div>
        <div className="stats-text">
          <span className="section-signature" aria-hidden="true"><Icons.Logo /></span>
          <h2 className="section-title">The engagement model is designed to stay clear and dependable.</h2>
          <p>
            Strong delivery is not just about code quality. It is about ownership,
            communication rhythm, and choosing the right system for the business problem.
          </p>
          <div className="stats-evidence">
            <div className="stats-grid">
              {stats.map((s, i) => (
                <AnimatedStat
                  key={i}
                  number={s.number}
                  label={s.label}
                  detail={s.detail}
                  isActive={i === activeStat}
                  onActivate={() => setActiveStat(i)}
                />
              ))}
            </div>
            <p className="stats-detail">{stats[activeStat].detail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
