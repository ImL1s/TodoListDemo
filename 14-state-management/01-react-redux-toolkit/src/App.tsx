import { TodoInput } from './features/todos/TodoInput';
import { TodoList } from './features/todos/TodoList';
import { TodoFilters } from './features/todos/TodoFilters';
import './styles/App.css';

/**
 * 主應用程式組件
 * 組合所有 Todo 相關組件
 */
function App() {
  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>📝 Redux Toolkit Todo List</h1>
          <p className="subtitle">使用 Redux Toolkit 打造的現代化狀態管理</p>
        </header>

        <main className="app-main">
          <TodoInput />
          <TodoFilters />
          <TodoList />
        </main>

        <footer className="app-footer">
          <p>💡 提示：雙擊待辦事項可進行編輯</p>
          <p className="tech-stack">
            <span className="badge">React</span>
            <span className="badge">TypeScript</span>
            <span className="badge">Redux Toolkit</span>
            <span className="badge">Vite</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
