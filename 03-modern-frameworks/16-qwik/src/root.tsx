/**
 * Root Component
 *
 * This is the root component that wraps the entire Qwik City application.
 * It sets up:
 * - HTML structure
 * - Document head
 * - Routing
 * - Global styles
 */

import { component$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to improve font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#667eea" />

        {/* Open Graph metadata for social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Qwik Todo - Resumable Todo List" />
        <meta
          property="og:description"
          content="A comprehensive Todo List application built with Qwik demonstrating resumability and zero JavaScript by default."
        />

        {/* Twitter Card metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Qwik Todo - Resumable Todo List" />
        <meta
          name="twitter:description"
          content="A comprehensive Todo List application built with Qwik demonstrating resumability and zero JavaScript by default."
        />

        <RouterOutlet />
        <ServiceWorkerRegister />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
