import { useState, useEffect } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import './App.css'

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

  return (
    <div className="app">
      <div className="container">
        <TodoInput onAdd={addTodo} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  )
}

export default App
