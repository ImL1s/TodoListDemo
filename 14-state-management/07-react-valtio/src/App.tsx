/**
 * Main App Component
 *
 * Demonstrates:
 * - Clean component structure with Valtio
 * - No Provider/Context setup needed (unlike Redux/Context API)
 * - Global state is directly accessible via imports
 */

import React from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <div className="todo-container">
        <header className="app-header">
          <h1>Todo List</h1>
          <p className="subtitle">Powered by React + Valtio</p>
        </header>

        <main className="app-main">
          <TodoInput />
          <TodoList />
          <TodoFilters />
        </main>

        <footer className="app-footer">
          <p>
            <strong>Valtio Features:</strong> Proxy-based state, mutable syntax,
            automatic immutability
          </p>
          <p className="hint">Double-click a todo to edit</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
