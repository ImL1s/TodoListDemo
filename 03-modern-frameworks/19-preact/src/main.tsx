import { render } from 'preact';
import { App } from './App';

/**
 * Application entry point
 *
 * Renders the root App component to the DOM.
 * Preact's render function is similar to React's but much smaller.
 */
render(<App />, document.getElementById('app')!);
