import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

function injectRootMarkup(html, appMarkup) {
  return html.replace('<div id="root"></div>', `<div id="root">${appMarkup}</div>`);
}

function injectSeoMarkup(html, seoMarkup) {
  const startMarker = '<title>';
  const endMarker = '</script>';
  const startIndex = html.indexOf(startMarker);
  const schemaMarker = '<!-- Structured Data -->';
  const endIndex = html.indexOf(endMarker, html.indexOf(schemaMarker));

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Unable to locate SEO block in dist/index.html for prerendering.');
  }

  return `${html.slice(0, startIndex)}${seoMarkup}\n${html.slice(endIndex + endMarker.length)}`;
}

function routeToOutputPath(distDir, routePath) {
  if (routePath === '/') {
    return path.join(distDir, 'index.html');
  }

  return path.join(distDir, routePath.replace(/^\//, ''), 'index.html');
}

async function main() {
  const scriptPath = fileURLToPath(import.meta.url);
  const projectRoot = path.resolve(path.dirname(scriptPath), '..');
  const distDir = path.join(projectRoot, 'dist');
  const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
  const vite = await createServer({
    root: projectRoot,
    logLevel: 'error',
    server: {
      middlewareMode: true,
      hmr: false,
      watch: null,
    },
    appType: 'custom',
  });

  try {
    const [{ default: App }, { AnalyticsProvider }, seoModule] = await Promise.all([
      vite.ssrLoadModule('/src/App.jsx'),
      vite.ssrLoadModule('/src/analytics/AnalyticsProvider.jsx'),
      vite.ssrLoadModule('/src/seo/pageSeo.js'),
    ]);

    const routes = await seoModule.buildPrerenderRoutes();

    await Promise.all(routes.map(async (route) => {
      const appMarkup = renderToString(
        React.createElement(
          AnalyticsProvider,
          null,
          React.createElement(App, {
            currentPathOverride: route.path,
            prerender: true,
            initialArticle: route.initialArticle,
          }),
        ),
      );

      const html = injectSeoMarkup(
        injectRootMarkup(template, appMarkup),
        seoModule.renderSeoTags(route.seo),
      );

      const outputPath = routeToOutputPath(distDir, route.path);
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, html, 'utf8');
    }));
  } finally {
    await vite.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
