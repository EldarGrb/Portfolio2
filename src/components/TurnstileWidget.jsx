import { useEffect, useRef } from 'react';

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstileScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve(window.turnstile), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function TurnstileWidget({
  siteKey,
  theme = 'auto',
  resetKey = 0,
  onTokenChange,
  onError,
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let disposed = false;

    if (!siteKey || !containerRef.current) {
      onTokenChangeRef.current?.('');
      return undefined;
    }

    loadTurnstileScript()
      .then((turnstile) => {
        if (disposed || !turnstile || !containerRef.current) return;

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token) => onTokenChangeRef.current?.(token || ''),
          'expired-callback': () => onTokenChangeRef.current?.(''),
          'error-callback': () => {
            onTokenChangeRef.current?.('');
            onErrorRef.current?.();
          },
        });
      })
      .catch(() => {
        onTokenChangeRef.current?.('');
        onErrorRef.current?.();
      });

    return () => {
      disposed = true;
      if (widgetIdRef.current !== null && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, theme]);

  useEffect(() => {
    if (widgetIdRef.current === null || !window.turnstile?.reset) return;
    window.turnstile.reset(widgetIdRef.current);
    onTokenChangeRef.current?.('');
  }, [resetKey]);

  if (!siteKey) return null;

  return (
    <div className="turnstile-shell">
      <div ref={containerRef} />
    </div>
  );
}

export default TurnstileWidget;
