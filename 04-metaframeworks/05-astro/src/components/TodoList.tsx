import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

type FilterType = 'all' | 'active' | 'completed';

// React component for Astro
export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isClient, setIsClient] = useState(false);

  // Load todos from localStorage
  const loadTodos = () => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('astro-todos');
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadTodos();

    // Listen for custom events
    const handleUpdate = () => loadTodos();
    window.addEventListener('todosUpdated', handleUpdate);

    return () => {
      window.removeEventListener('todosUpdated', handleUpdate);
    };
  }, []);

  const handleToggle = (id: string) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
    localStorage.setItem('astro-todos', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = todos.filter((todo) => todo.id !== id);
    setTodos(updated);
    localStorage.setItem('astro-todos', JSON.stringify(updated));
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Calculate stats
  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  if (!isClient) {
    return (
      <div className="loading">
        載入中...
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          全部 ({stats.total})
        </button>
        <button
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          進行中 ({stats.active})
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          已完成 ({stats.completed})
        </button>
      </div>

      {/* Todo List */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            {filter === 'all' && '還沒有待辦事項，開始新增吧！'}
            {filter === 'active' && '沒有進行中的事項'}
            {filter === 'completed' && '還沒有完成的事項'}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
