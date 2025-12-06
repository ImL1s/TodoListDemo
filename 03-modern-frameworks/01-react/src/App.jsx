import { useState, useEffect, useMemo } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import './App.css'

const FILTERS = {
  all: '全部',
  active: '進行中',
  completed: '已完成'
}

function App() {
  const [todos, setTodos] = useState(() => {
    // 從 localStorage 讀取初始數據
    const savedTodos = localStorage.getItem('react-todos')
    return savedTodos ? JSON.parse(savedTodos) : [
      { id: '1', text: '七點半起床', completed: false },
      { id: '2', text: '洗漱', completed: true },
      { id: '3', text: '去上班', completed: false },
      { id: '4', text: '完成報表', completed: false },
      { id: '5', text: '和小明吃午飯', completed: false },
      { id: '6', text: '去超市', completed: false },
    ]
  })

  const [filter, setFilter] = useState('all')

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('react-todos', JSON.stringify(todos))
  }, [todos])

  // 添加 todo
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false
    }
    setTodos([...todos, newTodo])
  }

  // 編輯 todo
  const updateTodo = (id, text) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ))
  }

  // 切換完成狀態
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 刪除 todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // 清除已完成
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  // 篩選列表
  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(todo => !todo.completed)
    if (filter === 'completed') return todos.filter(todo => todo.completed)
    return todos
  }, [todos, filter])

  const stats = useMemo(() => {
    const completed = todos.filter(todo => todo.completed).length
    const active = todos.length - completed
    return {
      total: todos.length,
      active,
      completed
    }
  }, [todos])

  return (
    <div className="app">
      <div className="container">
        <TodoInput onAdd={addTodo} />
        <div className="toolbar">
          <div className="filters">
            {Object.entries(FILTERS).map(([key, label]) => (
              <button
                key={key}
                className={`filter-btn ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="stats">
            <span>全部 {stats.total}</span>
            <span>進行中 {stats.active}</span>
            <span>已完成 {stats.completed}</span>
          </div>
          <button
            className="clear-btn"
            onClick={clearCompleted}
            disabled={stats.completed === 0}
          >
            清除已完成
          </button>
        </div>
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      </div>
    </div>
  )
}

export default App
