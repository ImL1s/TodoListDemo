/**
 * Main App Component
 * Demonstrates clean component composition with Nanostores
 * Notice: No props drilling, no context providers!
 */

import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import { TodoStats } from './components/TodoStats';
import { NanostoresInfo } from './components/NanostoresInfo';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>
            <span className="logo">📝</span>
            Nanostores Todo List
          </h1>
          <p className="subtitle">
            Ultra-lightweight state management (&lt;1KB) • Framework-agnostic
          </p>
        </header>

        <NanostoresInfo />

        <main className="app-main">
          <TodoInput />
          <TodoFilters />
          <TodoList />
          <TodoStats />
        </main>

        <footer className="app-footer">
          <p>
            <strong>Try it:</strong> Double-click to edit • All data persists in
            localStorage
          </p>
          <p className="tech-stack">
            Built with React + TypeScript + Nanostores
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
