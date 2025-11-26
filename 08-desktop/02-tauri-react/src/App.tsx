import { useEffect, useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { Todo } from './types';
import './App.css';

/**
 * Toast notification types
 */
type ToastType = 'error' | 'success' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from Rust backend on mount
  useEffect(() => {
    loadTodos();

    // Force save on unmount to ensure data is persisted
    return () => {
      invoke('force_save').catch(error => {
        console.error('Failed to force save on unmount:', error);
      });
    };
  }, []);

  // Update stats whenever todos change
  useEffect(() => {
    setStats({
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
    });
  }, [todos]);

  /**
   * Show a toast notification
   */
  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  /**
   * Load todos from Rust backend using Tauri invoke
   */
  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const loadedTodos = await invoke<Todo[]>('get_todos');
      setTodos(loadedTodos);
    } catch (error) {
      console.error('Failed to load todos:', error);
      showToast('Failed to load todos. Please restart the application.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a new todo via Rust backend
   * Includes input validation and error handling
   */
  const handleAddTodo = async (text: string) => {
    try {
      const newTodo = await invoke<Todo>('add_todo', { text });
      setTodos([...todos, newTodo]);
      showToast('Todo added successfully!', 'success');
    } catch (error) {
      console.error('Failed to add todo:', error);
      const errorMessage = typeof error === 'string' ? error : 'Failed to add todo';
      showToast(errorMessage, 'error');
    }
  };

  /**
   * Toggle todo completion status via Rust backend
   * Updates optimistically for better UX
   */
  const handleToggleTodo = async (id: string) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));

    try {
      await invoke<Todo>('toggle_todo', { id });
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      const errorMessage = typeof error === 'string' ? error : 'Failed to update todo';
      showToast(errorMessage, 'error');
      // Revert on error
      setTodos(previousTodos);
    }
  };

  /**
   * Delete a todo via Rust backend
   * Updates optimistically for better UX
   */
  const handleDeleteTodo = async (id: string) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos(todos.filter(todo => todo.id !== id));

    try {
      await invoke('delete_todo', { id });
      showToast('Todo deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      const errorMessage = typeof error === 'string' ? error : 'Failed to delete todo';
      showToast(errorMessage, 'error');
      // Revert on error
      setTodos(previousTodos);
    }
  };

  return (
    <div className="app">
      {/* Toast notifications */}
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`error-toast ${toast.type}`}
          onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        >
          {toast.message}
        </div>
      ))}

      <div className="container">
        <header className="header">
          <h1>📝 Todo List</h1>
          <div className="tech-badge">Tauri + React</div>
        </header>

        <div className="stats">
          <div className="stat">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.total - stats.completed}</span>
            <span className="stat-label">Remaining</span>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            Loading todos...
          </div>
        ) : (
          <>
            <TodoInput onAdd={handleAddTodo} />
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          </>
        )}

        <footer className="footer">
          <p>Built with Tauri - Secure, Fast & Lightweight</p>
          <p className="footer-info">
            <span>🦀 Rust Backend</span>
            <span>⚛️ React Frontend</span>
            <span>⚡ Vite Build Tool</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
