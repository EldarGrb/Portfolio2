import { useEffect, useRef, useState } from 'react';
import { useAnalytics } from '../analytics/useAnalytics';
import { loadCalendlyScript } from '../lib/calendly';

function isCalendlyMessage(event) {
  return event.origin === 'https://calendly.com' && typeof event.data?.event === 'string' && event.data.event.startsWith('calendly.');
}

function CalendlyEmbed({ url, context = {} }) {
  const containerRef = useRef(null);
  const trackedEventRef = useRef('');
  const [status, setStatus] = useState('loading');
  const { track } = useAnalytics();

  useEffect(() => {
    if (!url || !containerRef.current || typeof window === 'undefined') {
      return undefined;
    }

    let cancelled = false;
    const container = containerRef.current;
    trackedEventRef.current = '';
    setStatus('loading');
    container.innerHTML = '';

    loadCalendlyScript()
      .then((Calendly) => {
        if (cancelled || !containerRef.current || !Calendly?.initInlineWidget) return;

        Calendly.initInlineWidget({
          url,
          parentElement: containerRef.current,
          resize: true,
        });

        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      });

    const handleMessage = (event) => {
      if (!isCalendlyMessage(event)) return;

      const nextEvent = event.data.event;
      if (trackedEventRef.current === nextEvent) return;
      trackedEventRef.current = nextEvent;

      track('calendly_embed_event', {
        ...context,
        calendly_event: nextEvent,
      });
    };

    window.addEventListener('message', handleMessage);

    return () => {
      cancelled = true;
      window.removeEventListener('message', handleMessage);
      container.innerHTML = '';
    };
  }, [context, track, url]);

  return (
    <div className="calendly-embed-shell">
      {status !== 'ready' ? (
        <div className="calendly-embed-status" aria-live="polite">
          {status === 'error' ? 'Calendly could not load here.' : 'Loading the booking calendar...'}
        </div>
      ) : null}
      <div ref={containerRef} className="calendly-embed-root" />
    </div>
  );
}

export default CalendlyEmbed;
