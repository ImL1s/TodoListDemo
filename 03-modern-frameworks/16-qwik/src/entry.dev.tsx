/**
 * Development Entry Point
 *
 * This file is used during development to provide a better
 * development experience with hot module replacement (HMR).
 */

import { render, type RenderOptions } from '@builder.io/qwik';
import Root from './root';

/**
 * Development-only render function
 *
 * In development mode, Qwik uses standard client-side rendering
 * with HMR support for a better developer experience.
 */
export default function (opts: RenderOptions) {
  return render(document, <Root />, opts);
}
