import React from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import TodoFilters from './components/TodoFilters'
import './App.css'

/**
 * App 組件
 *
 * 主應用程式組件
 * 整合所有子組件來建立完整的 Todo List 應用
 *
 * Redux 架構說明：
 * - Provider 在 main.tsx 中包裹整個應用
 * - Store 在 store/index.ts 中配置
 * - State 在 features/todos/todosSlice.ts 中管理
 * - 組件使用 useAppDispatch 和 useAppSelector hooks 與 Redux 互動
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">Redux Toolkit Todo List</h1>
          <p className="app-subtitle">Modern state management with React & Redux Toolkit</p>
        </header>

        <main className="app-main">
          <TodoForm />
          <TodoList />
          <TodoFilters />
        </main>

        <footer className="app-footer">
          <p>
            Built with <strong>React</strong> + <strong>Redux Toolkit</strong>
          </p>
          <p className="tip">
            💡 Tip: Double-click on a todo to edit it
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
