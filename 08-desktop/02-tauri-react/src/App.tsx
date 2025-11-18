import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { Todo } from './types';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0 });

  // Load todos from Rust backend on mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Update stats whenever todos change
  useEffect(() => {
    setStats({
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
    });
  }, [todos]);

  /**
   * Load todos from Rust backend using Tauri invoke
   */
  const loadTodos = async () => {
    try {
      const loadedTodos = await invoke<Todo[]>('get_todos');
      setTodos(loadedTodos);
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  };

  /**
   * Add a new todo via Rust backend
   */
  const handleAddTodo = async (text: string) => {
    try {
      const newTodo = await invoke<Todo>('add_todo', { text });
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  /**
   * Toggle todo completion status via Rust backend
   */
  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await invoke<Todo>('toggle_todo', { id });
      setTodos(todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  /**
   * Delete a todo via Rust backend
   */
  const handleDeleteTodo = async (id: string) => {
    try {
      await invoke('delete_todo', { id });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <div className="app">
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

        <TodoInput onAdd={handleAddTodo} />
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />

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
