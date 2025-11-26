import { useState, useEffect, useRef } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import type { Todo } from './electron';
import './App.css';

type FilterType = 'all' | 'active' | 'completed';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<{ focus: () => void }>(null);

  // Load todos on mount
  useEffect(() => {
    loadTodos();
    setupMenuListeners();

    return () => {
      window.electronAPI?.removeMenuListeners();
    };
  }, []);

  // Update stats whenever todos change
  useEffect(() => {
    updateStats();
  }, [todos]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const loadedTodos = await window.electronAPI.getTodos();
      setTodos(loadedTodos);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async () => {
    try {
      const newStats = await window.electronAPI.getStats();
      setStats(newStats);
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };

  const setupMenuListeners = () => {
    // Listen for menu events
    window.electronAPI?.onMenuNewTodo(() => {
      inputRef.current?.focus();
    });

    window.electronAPI?.onMenuClearCompleted(() => {
      handleClearCompleted();
    });
  };

  const handleAddTodo = async (text: string) => {
    try {
      const newTodo = await window.electronAPI.addTodo(text);
      setTodos((prev) => [...prev, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      await window.electronAPI.toggleTodo(id);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await window.electronAPI.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleUpdateTodo = async (id: string, text: string) => {
    try {
      await window.electronAPI.updateTodo(id, text);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
      );
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await window.electronAPI.clearCompleted();
      setTodos((prev) => prev.filter((todo) => !todo.completed));
    } catch (error) {
      console.error('Failed to clear completed todos:', error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner"></div>
        <p>Loading todos...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="logo-section">
            <svg
              className="logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <h1>Electron Todo</h1>
          </div>
          <div className="tech-badge">
            <span className="badge-electron">Electron</span>
            <span className="badge-react">React</span>
          </div>
        </header>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active</span>
            <span className="stat-value stat-active">{stats.active}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value stat-completed">{stats.completed}</span>
          </div>
        </div>

        <TodoInput onAdd={handleAddTodo} ref={inputRef} />

        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
        />

        {stats.completed > 0 && (
          <div className="footer-actions">
            <button className="clear-btn" onClick={handleClearCompleted}>
              Clear Completed ({stats.completed})
            </button>
          </div>
        )}

        <footer className="app-footer">
          <p className="footer-text">
            Press <kbd>Ctrl+N</kbd> (or <kbd>⌘N</kbd> on Mac) to create a new
            todo
          </p>
          <p className="footer-subtitle">
            Built with Electron • React • TypeScript
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
