import { RecoilRoot } from 'recoil';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import './App.css';

/**
 * Main App Component
 * Wraps the entire application in RecoilRoot to provide Recoil state management
 */
function AppContent() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Recoil Todo List</h1>
        <p className="subtitle">
          Demonstrating atoms, selectors, and state management patterns
        </p>
      </header>

      <main className="app-main">
        <div className="container">
          <section className="todo-section">
            <TodoInput />
            <TodoList />
          </section>

          <aside className="filters-section">
            <TodoFilters />
          </aside>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with <strong>React</strong> and <strong>Recoil</strong>
        </p>
        <p className="hint">
          Double-click a todo to edit • Press Enter to save • Press Escape to cancel
        </p>
      </footer>
    </div>
  );
}

/**
 * Root App Component with RecoilRoot provider
 */
function App() {
  return (
    <RecoilRoot>
      <AppContent />
    </RecoilRoot>
  );
}

export default App;
