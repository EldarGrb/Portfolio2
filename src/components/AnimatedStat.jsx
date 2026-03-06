import { useState, useEffect, useRef } from 'react';

function AnimatedStat({ number, label }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(number);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const numMatch = number.match(/(\d+)/);
        if (numMatch) {
          const target = parseInt(numMatch[1]);
          const prefix = number.slice(0, number.indexOf(numMatch[1]));
          const suffix = number.slice(number.indexOf(numMatch[1]) + numMatch[1].length);
          let current = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            setDisplay(prefix + current + suffix);
          }, 30);
        }
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-number">{display}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default AnimatedStat;
