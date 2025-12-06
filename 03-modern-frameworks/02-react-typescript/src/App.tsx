import { useState, useMemo, useCallback } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import type { Todo, FilterType, TodoStats, UseLocalStorageReturn } from './types';

/**
 * 自定義 Hook: useLocalStorage
 * 展示 TypeScript 的泛型使用和自定義 Hook 類型定義
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // 從 localStorage 讀取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 更新 localStorage 的函數
  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)): void => {
      try {
        // 允許 value 是函數或直接值
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * App 主組件
 * 展示 TypeScript 在 React 中的完整應用
 */
function App() {
  // 使用泛型 Hook，TypeScript 自動推斷類型為 Todo[]
  const [todos, setTodos] = useLocalStorage<Todo[]>('react-ts-todos', []);
  const [filter, setFilter] = useState<FilterType>('all');

  // 添加待辦事項 - 使用 useCallback 確保函數引用穩定
  const addTodo = useCallback(
    (text: string): void => {
      const newTodo: Todo = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        completed: false,
        createdAt: Date.now()
      };

      setTodos((prevTodos) => [newTodo, ...prevTodos]);
    },
    [setTodos]
  );

  // 切換待辦事項完成狀態
  const toggleTodo = useCallback(
    (id: string): void => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                completed: !todo.completed,
                completedAt: !todo.completed ? Date.now() : undefined
              }
            : todo
        )
      );
    },
    [setTodos]
  );

  // 刪除待辦事項
  const deleteTodo = useCallback(
    (id: string): void => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    },
    [setTodos]
  );

  // 編輯待辦事項
  const editTodo = useCallback(
    (id: string, newText: string): void => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, text: newText } : todo
        )
      );
    },
    [setTodos]
  );

  // 清除所有已完成的待辦事項
  const clearCompleted = useCallback((): void => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
  }, [setTodos]);

  // 使用 useMemo 優化過濾後的待辦事項列表
  const filteredTodos = useMemo((): Todo[] => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  // 使用 useMemo 優化統計數據計算
  const stats = useMemo((): TodoStats => {
    return {
      total: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length
    };
  }, [todos]);

  // 處理篩選器變化
  const handleFilterChange = (newFilter: FilterType): void => {
    setFilter(newFilter);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">React + TypeScript Todo List</h1>
          <p className="subtitle">體驗類型安全的待辦事項管理</p>
        </header>

        <div className="todo-container">
          <TodoInput onAddTodo={addTodo} />

          <div className="stats">
            <span className="stat-item">
              總計: <strong>{stats.total}</strong>
            </span>
            <span className="stat-item">
              進行中: <strong>{stats.active}</strong>
            </span>
            <span className="stat-item">
              已完成: <strong>{stats.completed}</strong>
            </span>
          </div>

          <div className="filters">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              全部 ({stats.total})
            </button>
            <button
              className={`filter-button ${filter === 'active' ? 'active' : ''}`}
              onClick={() => handleFilterChange('active')}
            >
              進行中 ({stats.active})
            </button>
            <button
              className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => handleFilterChange('completed')}
            >
              已完成 ({stats.completed})
            </button>
          </div>

          <TodoList
            todos={filteredTodos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
          />

          {stats.completed > 0 && (
            <div className="footer">
              <button onClick={clearCompleted} className="clear-button">
                清除已完成 ({stats.completed})
              </button>
            </div>
          )}
        </div>

        <footer className="app-footer">
          <p>
            使用 <strong>React 18</strong> + <strong>TypeScript 5.3+</strong> +{' '}
            <strong>Vite</strong> 構建
          </p>
          <p className="tech-features">
            特色: 完整類型定義 • 泛型 Hook • 事件類型 • LocalStorage 持久化
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
