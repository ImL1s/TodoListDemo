/**
 * Qwik City SSR Entry Point
 *
 * This file is the server-side rendering entry point for Qwik City.
 * It's responsible for rendering the application on the server and
 * serializing the state for resumability on the client.
 */

import {
  renderToStream,
  type RenderToStreamOptions,
} from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import Root from './root';

/**
 * Server-side render function
 *
 * This function is called on the server to render the application.
 * It returns a readable stream of HTML that includes:
 * - Fully rendered UI
 * - Serialized application state
 * - References to lazy-loadable chunks
 * - The tiny Qwik loader (~1KB)
 */
export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Qwik City configuration
    containerAttributes: {
      lang: 'en',
    },
  });
}
