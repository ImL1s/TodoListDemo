import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'

// Server Component (default in App Router)
export default function Home() {
  return (
    <main className="container">
      <div className="todo-app">
        <header className="app-header">
          <h1>Next.js 14 Todo List</h1>
          <p className="subtitle">Full-stack App with Server & Client Components</p>
        </header>

        <div className="todo-content">
          {/* Client Component for user input */}
          <TodoInput />

          {/* Client Component for displaying todos */}
          <TodoList />
        </div>

        <footer className="app-footer">
          <p>
            Built with <strong>Next.js 14</strong> App Router |
            Server Components + API Routes
          </p>
        </footer>
      </div>
    </main>
  )
}
