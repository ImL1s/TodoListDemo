/**
 * Application Entry Point
 *
 * SolidJS uses `render` from solid-js/web to mount the application.
 * Unlike React, there's no virtual DOM - SolidJS compiles JSX to
 * real DOM operations at build time.
 */

import { render } from 'solid-js/web';
import App from './App';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

/**
 * Mount the application
 *
 * The render function:
 * - Takes a component function (not JSX!)
 * - Mounts it to the DOM element
 * - Returns a dispose function for cleanup
 *
 * The component function is called once to create the reactive graph.
 * After that, only the specific parts that depend on changed signals
 * will update - no virtual DOM diffing needed!
 */
render(() => <App />, root);
