import { useEffect, useRef } from 'react';

function TripBackground() {
  const bgRef = useRef(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const shouldAnimate = !motionQuery.matches && pointerQuery.matches && window.innerWidth > 900;
    if (!shouldAnimate) return undefined;

    let frameId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const maxX = 28;
    const maxY = 20;

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      el.style.setProperty('--hero-pan-x', `${currentX}px`);
      el.style.setProperty('--hero-pan-y', `${currentY}px`);

      if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        frameId = 0;
      }
    };

    const requestTick = () => {
      if (!frameId) frameId = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event) => {
      const normalizedX = event.clientX / window.innerWidth - 0.5;
      const normalizedY = event.clientY / window.innerHeight - 0.5;
      targetX = normalizedX * maxX;
      targetY = normalizedY * maxY;
      requestTick();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      requestTick();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="hero-bg" ref={bgRef}>
      <div className="hero-bg-motion">
        <img
          className="hero-bg-image"
          src="/images/hero-graphic.webp"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="hero-bg-gradient" />
    </div>
  );
}

export default TripBackground;
