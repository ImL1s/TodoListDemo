import React from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoStats from './components/TodoStats';
import TodoFilters from './components/TodoFilters';
import { useTodoStore } from './store/useTodoStore';
import './App.css';

/**
 * App 主組件
 *
 * Zustand vs Redux 對比：
 *
 * 1. 無需 Provider：
 *    Redux: <Provider store={store}><App /></Provider>
 *    Zustand: 直接使用，無需包裝
 *
 * 2. 狀態訂閱：
 *    Redux: useSelector(state => state.todos)
 *    Zustand: useTodoStore(state => state.todos)
 *
 * 3. 狀態更新：
 *    Redux: dispatch({ type: 'ADD_TODO', payload: text })
 *    Zustand: addTodo(text)
 *
 * 4. Store 創建：
 *    Redux: createStore + reducer + actions + types
 *    Zustand: create(() => ({ state, actions }))
 *
 * 5. 代碼量：
 *    Redux: ~200 行（reducer + actions + types + store setup）
 *    Zustand: ~100 行（一個文件搞定）
 *
 * 6. TypeScript 支持：
 *    Redux: 需要大量類型定義（ActionTypes, Actions, State）
 *    Zustand: 一個接口定義即可
 *
 * 7. 學習曲線：
 *    Redux: 需要理解 action、reducer、middleware、thunk 等概念
 *    Zustand: 只需理解 set 和 get
 */
function App() {
  // Zustand：訂閱統計數據和清除方法
  const stats = useTodoStore((state) => state.getStats());
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">React + Zustand Todo List</h1>
          <p className="subtitle">體驗極簡狀態管理的魅力</p>
        </header>

        <div className="todo-container">
          {/* TodoInput：無需傳遞 props，直接從 store 獲取方法 */}
          <TodoInput />

          {/* TodoStats：展示統計數據 */}
          <TodoStats />

          {/* TodoFilters：篩選器 */}
          <TodoFilters />

          {/* TodoList：展示待辦事項列表 */}
          <TodoList />

          {/* 清除已完成按鈕 */}
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
            使用 <strong>React 18</strong> + <strong>Zustand 4</strong> +{' '}
            <strong>TypeScript 5.3+</strong> + <strong>Vite</strong> 構建
          </p>
          <p className="tech-features">
            特色: 極簡 API • 無需 Provider • TypeScript 友好 • 自動持久化 • 高性能
          </p>
          <p className="tech-comparison">
            相比 Redux 代碼量減少 80% • 學習曲線平緩 • 性能更優
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
