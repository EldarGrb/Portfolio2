import { useEffect, useRef } from 'react';

const servicePreviewAssets = {
  websites: {
    jpeg: '/images/services/websites.jpeg',
    webp: '/images/services/websites.webp',
    width: 1376,
    height: 768,
    origin: '50% 40%',
  },
  webApps: {
    jpeg: '/images/services/web-apps.jpeg',
    webp: '/images/services/web-apps.webp',
    width: 1376,
    height: 768,
    origin: '50% 44%',
  },
  aiWorkflows: {
    jpeg: '/images/services/ai-workflows.jpeg',
    webp: '/images/services/ai-workflows.webp',
    width: 1376,
    height: 768,
    origin: '50% 42%',
  },
  assistants: {
    jpeg: '/images/services/voice-chat-assistants.jpeg',
    webp: '/images/services/voice-chat-assistants.webp',
    width: 1376,
    height: 768,
    origin: '50% 38%',
  },
  performance: {
    jpeg: '/images/services/performance-rebuilds.jpeg',
    webp: '/images/services/performance-rebuilds.webp',
    width: 1376,
    height: 768,
    origin: '50% 44%',
  },
};

function ServicePreviewImage({ visual, label }) {
  const asset = servicePreviewAssets[visual];
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const motionHost = frame.closest('.service-image-wrapper') ?? frame;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const shouldAnimate = !motionQuery.matches && pointerQuery.matches && window.innerWidth > 900;

    motionHost.style.setProperty('--service-preview-pan-x', '0px');
    motionHost.style.setProperty('--service-preview-pan-y', '0px');
    motionHost.style.setProperty('--service-preview-tilt-x', '0deg');
    motionHost.style.setProperty('--service-preview-tilt-y', '0deg');

    if (!shouldAnimate) return undefined;

    let frameId = 0;
    let targetPanX = 0;
    let targetPanY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentPanX = 0;
    let currentPanY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const tick = () => {
      currentPanX += (targetPanX - currentPanX) * 0.14;
      currentPanY += (targetPanY - currentPanY) * 0.14;
      currentTiltX += (targetTiltX - currentTiltX) * 0.14;
      currentTiltY += (targetTiltY - currentTiltY) * 0.14;

      motionHost.style.setProperty('--service-preview-pan-x', `${currentPanX.toFixed(2)}px`);
      motionHost.style.setProperty('--service-preview-pan-y', `${currentPanY.toFixed(2)}px`);
      motionHost.style.setProperty('--service-preview-tilt-x', `${currentTiltX.toFixed(2)}deg`);
      motionHost.style.setProperty('--service-preview-tilt-y', `${currentTiltY.toFixed(2)}deg`);

      const keepAnimating = [
        Math.abs(targetPanX - currentPanX),
        Math.abs(targetPanY - currentPanY),
        Math.abs(targetTiltX - currentTiltX),
        Math.abs(targetTiltY - currentTiltY),
      ].some((delta) => delta > 0.06);

      frameId = keepAnimating ? window.requestAnimationFrame(tick) : 0;
    };

    const requestTick = () => {
      if (!frameId) frameId = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event) => {
      const bounds = frame.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

      targetPanX = relativeX * 16;
      targetPanY = relativeY * 14;
      targetTiltX = relativeY * -2.2;
      targetTiltY = relativeX * 2.6;

      requestTick();
    };

    const onPointerLeave = () => {
      targetPanX = 0;
      targetPanY = 0;
      targetTiltX = 0;
      targetTiltY = 0;
      requestTick();
    };

    frame.addEventListener('pointermove', onPointerMove, { passive: true });
    frame.addEventListener('pointerleave', onPointerLeave);

    return () => {
      frame.removeEventListener('pointermove', onPointerMove);
      frame.removeEventListener('pointerleave', onPointerLeave);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [visual]);

  if (!asset) return null;

  return (
    <div
      className="service-preview-frame"
      ref={frameRef}
      style={{ '--service-preview-origin': asset.origin }}
    >
      <picture className="service-preview-media">
        <source srcSet={asset.webp} type="image/webp" />
        <img
          className="service-preview-image"
          src={asset.jpeg}
          alt={label}
          width={asset.width}
          height={asset.height}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
    </div>
  );
}

export default ServicePreviewImage;
