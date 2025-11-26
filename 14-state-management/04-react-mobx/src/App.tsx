/**
 * App Component - 主應用組件
 *
 * MobX 優勢：
 * - 無需 Provider！直接使用 store
 * - observer HOC 使組件響應式
 * - 自動依賴追蹤，無需手動訂閱
 */

import { observer } from 'mobx-react-lite';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFilters from './components/TodoFilters';
import TodoStats from './components/TodoStats';
import './App.css';

const App = observer(() => {
  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>📝 React + MobX Todo List</h1>
          <p className="subtitle">響應式狀態管理 - 簡單、直觀、高效</p>
        </header>

        <main className="app-main">
          <TodoInput />
          <TodoStats />
          <TodoFilters />
          <TodoList />
        </main>

        <footer className="app-footer">
          <p>
            使用 <strong>React 18</strong> + <strong>MobX 6</strong> +{' '}
            <strong>TypeScript</strong> 構建
          </p>
          <p className="tips">💡 雙擊待辦事項可編輯</p>
        </footer>
      </div>
    </div>
  );
});

App.displayName = 'App';

export default App;
