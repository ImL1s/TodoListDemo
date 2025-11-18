/**
 * Main App Component
 *
 * Demonstrates Jotai's key advantage: NO PROVIDER NEEDED
 *
 * Unlike Recoil (requires RecoilRoot) or Redux (requires Provider),
 * Jotai atoms are globally accessible without any wrapper.
 *
 * This makes the code cleaner and reduces boilerplate.
 */

import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Jotai Todo List</h1>
        <p className="subtitle">
          Primitive and flexible state management with atomic approach
        </p>
      </header>

      <main className="app-main">
        <div className="todo-container">
          <TodoInput />
          <TodoFilters />
          <TodoList />
        </div>
      </main>

      <footer className="app-footer">
        <div className="features">
          <h3>Jotai Features Demonstrated:</h3>
          <ul>
            <li>✓ Primitive atoms (bottom-up approach)</li>
            <li>✓ Derived atoms (computed values)</li>
            <li>✓ atomWithStorage (localStorage persistence)</li>
            <li>✓ Write-only atoms (actions)</li>
            <li>✓ useAtom, useAtomValue, useSetAtom hooks</li>
            <li>✓ No Provider needed</li>
            <li>✓ TypeScript support</li>
            <li>✓ Minimal re-renders</li>
          </ul>
        </div>

        <div className="info">
          <h3>Quick Tips:</h3>
          <ul>
            <li>Double-click a todo to edit it</li>
            <li>Press Enter to save, Escape to cancel</li>
            <li>Data persists in localStorage</li>
            <li>Open DevTools to see minimal re-renders</li>
          </ul>
        </div>

        <div className="comparison">
          <h3>Why Jotai?</h3>
          <ul>
            <li><strong>vs Recoil:</strong> No Provider, simpler API, smaller bundle</li>
            <li><strong>vs Zustand:</strong> Better for complex derived state</li>
            <li><strong>vs Redux:</strong> Less boilerplate, built-in async</li>
            <li><strong>vs Context:</strong> Fine-grained updates, better performance</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;

/*
 * JOTAI'S NO-PROVIDER ARCHITECTURE
 *
 * Compare with other libraries:
 *
 * ❌ Recoil (needs Provider):
 *    <RecoilRoot>
 *      <App />
 *    </RecoilRoot>
 *
 * ❌ Redux (needs Provider):
 *    <Provider store={store}>
 *      <App />
 *    </Provider>
 *
 * ✅ Jotai (no Provider):
 *    <App />
 *
 * How does this work?
 *
 * 1. Atoms are stored in a global registry
 * 2. First access creates the atom instance
 * 3. All hooks share the same instance
 * 4. Garbage collected when no longer used
 *
 * Benefits:
 * - Less boilerplate
 * - Easier to set up
 * - Can use atoms anywhere (not just in components)
 * - Natural code splitting
 *
 * Optional Provider:
 *
 * Jotai does support an optional Provider for:
 * - Server-side rendering
 * - Testing (isolated state)
 * - Multiple independent state trees
 *
 * But for most apps, you don't need it!
 */
