import { createSignal, createMemo, createEffect } from 'solid-js';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import type { Todo, FilterType, TodoStats } from './types';

/**
 * 自定義 Hook: createLocalStorage
 * 展示 SolidJS 的 Signal 系統和響應式數據管理
 *
 * 與 React 的關鍵差異：
 * - 使用 createSignal 而不是 useState
 * - 使用 createEffect 自動追蹤依賴，而不是 useEffect
 * - 不需要依賴數組，SolidJS 自動追蹤
 */
function createLocalStorage<T>(key: string, initialValue: T) {
  // 從 localStorage 讀取初始值
  const storedValue = (() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  })();

  // 創建 Signal - SolidJS 的響應式原語
  const [value, setValue] = createSignal<T>(storedValue);

  // 自動同步到 localStorage
  // createEffect 會自動追蹤 value() 的變化
  createEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value()));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  });

  return [value, setValue] as const;
}

/**
 * App 主組件
 * 展示 SolidJS 的細粒度響應式和 Signal 系統
 *
 * 與 React 的關鍵差異：
 * 1. 組件函數只運行一次，不會重新渲染
 * 2. 使用 createSignal 管理響應式狀態
 * 3. 使用 createMemo 創建計算值（自動追蹤依賴）
 * 4. 不需要 useCallback/useMemo，因為函數不會重複創建
 * 5. JSX 中的表達式會自動成為響應式節點
 */
function App() {
  // 使用自定義的 localStorage Signal
  const [todos, setTodos] = createLocalStorage<Todo[]>('solidjs-todos', []);
  const [filter, setFilter] = createSignal<FilterType>('all');

  // 添加待辦事項
  // 在 SolidJS 中，函數只創建一次，不需要 useCallback
  const addTodo = (text: string): void => {
    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false,
      createdAt: Date.now()
    };

    // SolidJS 的 Signal 更新方式
    setTodos((prev) => [newTodo, ...prev]);
  };

  // 切換待辦事項完成狀態
  const toggleTodo = (id: string): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? Date.now() : undefined
            }
          : todo
      )
    );
  };

  // 刪除待辦事項
  const deleteTodo = (id: string): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // 編輯待辦事項
  const editTodo = (id: string, newText: string): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // 清除所有已完成的待辦事項
  const clearCompleted = (): void => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // 使用 createMemo 創建計算值
  // 與 React 的 useMemo 類似，但自動追蹤依賴
  const filteredTodos = createMemo((): Todo[] => {
    const currentFilter = filter();
    const currentTodos = todos();

    switch (currentFilter) {
      case 'active':
        return currentTodos.filter((todo) => !todo.completed);
      case 'completed':
        return currentTodos.filter((todo) => todo.completed);
      default:
        return currentTodos;
    }
  });

  // 統計數據 - 自動追蹤 todos() 的變化
  const stats = createMemo((): TodoStats => {
    const currentTodos = todos();
    return {
      total: currentTodos.length,
      active: currentTodos.filter((todo) => !todo.completed).length,
      completed: currentTodos.filter((todo) => todo.completed).length
    };
  });

  // 處理篩選器變化
  const handleFilterChange = (newFilter: FilterType): void => {
    setFilter(newFilter);
  };

  return (
    <div class="app">
      <div class="container">
        <header class="header">
          <h1 class="title">SolidJS Todo List</h1>
          <p class="subtitle">體驗細粒度響應式和 Signal 系統</p>
        </header>

        <div class="todo-container">
          <TodoInput onAddTodo={addTodo} />

          <div class="stats">
            <span class="stat-item">
              總計: <strong>{stats().total}</strong>
            </span>
            <span class="stat-item">
              進行中: <strong>{stats().active}</strong>
            </span>
            <span class="stat-item">
              已完成: <strong>{stats().completed}</strong>
            </span>
          </div>

          <div class="filters">
            <button
              class={`filter-button ${filter() === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              全部 ({stats().total})
            </button>
            <button
              class={`filter-button ${filter() === 'active' ? 'active' : ''}`}
              onClick={() => handleFilterChange('active')}
            >
              進行中 ({stats().active})
            </button>
            <button
              class={`filter-button ${filter() === 'completed' ? 'active' : ''}`}
              onClick={() => handleFilterChange('completed')}
            >
              已完成 ({stats().completed})
            </button>
          </div>

          <TodoList
            todos={filteredTodos()}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
          />

          {stats().completed > 0 && (
            <div class="footer">
              <button onClick={clearCompleted} class="clear-button">
                清除已完成 ({stats().completed})
              </button>
            </div>
          )}
        </div>

        <footer class="app-footer">
          <p>
            使用 <strong>SolidJS 1.8+</strong> + <strong>TypeScript 5.3+</strong> +{' '}
            <strong>Vite</strong> 構建
          </p>
          <p class="tech-features">
            特色: 細粒度響應式 • Signal 系統 • 無虛擬 DOM • 極致性能
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
