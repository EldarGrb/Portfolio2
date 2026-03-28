import { useEffect, useLayoutEffect, useRef } from 'react';
import { DEFAULT_OG_IMAGE } from '../data/siteConfig';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function upsertMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!content) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertCanonical(href) {
  if (!href) return;
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function clearSeoSchemas() {
  document.querySelectorAll('script[data-seo-schema="true"]').forEach((script) => script.remove());
}

function injectSchemas(schemas) {
  schemas.forEach((schema, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoSchema = 'true';
    script.id = `seo-schema-${index}`;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

export function useSeo({
  title,
  description,
  canonical,
  url,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  robots = 'index, follow',
  author,
  keywords = [],
  schemas = [],
}) {
  const previousSchemaSignatureRef = useRef('');

  useIsomorphicLayoutEffect(() => {
    if (title) {
      document.title = title;
    }

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'author', author);
    upsertMeta('name', 'keywords', keywords.length ? keywords.join(', ') : '');
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url ?? canonical);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:image:alt', imageAlt ?? title);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
    upsertMeta('name', 'twitter:image:alt', imageAlt ?? title);

    upsertCanonical(canonical);

    const schemaSignature = JSON.stringify(schemas);

    if (schemaSignature !== previousSchemaSignatureRef.current) {
      clearSeoSchemas();
      injectSchemas(schemas);
      previousSchemaSignatureRef.current = schemaSignature;
    }

    return () => {
      clearSeoSchemas();
      previousSchemaSignatureRef.current = '';
    };
  }, [title, description, canonical, url, type, image, imageAlt, robots, author, keywords, schemas]);
}
