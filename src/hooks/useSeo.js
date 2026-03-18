import { useEffect, useRef } from 'react';

const DEFAULT_OG_IMAGE = 'https://uroboros-systems.com/images/og-image.webp';

function upsertMeta(attribute, key, content) {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

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
  schemas = [],
}) {
  const previousSchemaSignatureRef = useRef('');

  useEffect(() => {
    if (title) {
      document.title = title;
    }

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url ?? canonical);
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);

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
  }, [title, description, canonical, url, type, image, schemas]);
}
