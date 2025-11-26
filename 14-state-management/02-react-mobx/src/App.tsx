import { observer } from 'mobx-react-lite';
import { todoStore } from './stores/TodoStore';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilters from './components/TodoFilters';
import TodoStats from './components/TodoStats';
import './styles/App.css';

/**
 * App - 主應用組件
 *
 * MobX 應用架構：
 * 1. Store 層 - 管理應用狀態（TodoStore）
 * 2. Component 層 - 使用 observer 包裝的響應式組件
 * 3. 自動依賴追蹤 - 組件自動訂閱使用的 observable
 *
 * 與 Redux 的對比：
 * - Redux: 需要 actions、reducers、connect/useSelector
 * - MobX: 直接修改狀態，自動追蹤依賴，更簡潔直觀
 */
const App = observer(() => {
  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">MobX Todo List</h1>
          <p className="app-subtitle">
            響應式狀態管理 • 自動依賴追蹤 • 簡單直觀
          </p>
        </header>

        <main className="app-main">
          {/* 新增表單 */}
          <TodoForm />

          {/* 統計信息 */}
          {todoStore.totalCount > 0 && <TodoStats />}

          {/* 過濾器 */}
          {todoStore.totalCount > 0 && <TodoFilters />}

          {/* Todo 列表 */}
          <TodoList />

          {/* 批量操作 */}
          {todoStore.totalCount > 0 && (
            <div className="bulk-actions">
              <button
                className="toggle-all-button"
                onClick={() => todoStore.toggleAll()}
              >
                {todoStore.allCompleted ? '取消全部完成' : '全部完成'}
              </button>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p className="footer-text">
            使用 <strong>MobX 6</strong> 進行狀態管理
          </p>
          <p className="footer-hint">
            提示：雙擊任務可編輯 • 數據自動保存到 localStorage
          </p>
        </footer>
      </div>
    </div>
  );
});

export default App;
