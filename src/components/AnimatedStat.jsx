import { useState, useEffect, useRef } from 'react';

function AnimatedStat({ number, label, detail, isActive, onActivate }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(number);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frameId = 0;
    let hasAnimated = false;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasAnimated) return;

      hasAnimated = true;
      const numMatch = number.match(/(\d+)/);

      if (!numMatch || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        setDisplay(number);
        obs.unobserve(el);
        return;
      }

      const target = parseInt(numMatch[1], 10);
      const prefix = number.slice(0, number.indexOf(numMatch[1]));
      const suffix = number.slice(number.indexOf(numMatch[1]) + numMatch[1].length);
      const duration = 700;
      const startTime = performance.now();

      const tick = (timestamp) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const nextValue = Math.round(target * (1 - ((1 - progress) ** 3)));

        setDisplay(`${prefix}${nextValue}${suffix}`);

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
        }
      };

      frameId = window.requestAnimationFrame(tick);
      obs.unobserve(el);
    }, { threshold: 0.3 });

    obs.observe(el);

    return () => {
      obs.disconnect();
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [number]);

  return (
    <button
      type="button"
      className={`stat-card ${isActive ? 'active' : ''}`}
      ref={ref}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      aria-pressed={isActive}
      aria-label={`${label}. ${detail}`}
    >
      <div className="stat-number">{display}</div>
      <div className="stat-label">{label}</div>
    </button>
  );
}

export default AnimatedStat;
