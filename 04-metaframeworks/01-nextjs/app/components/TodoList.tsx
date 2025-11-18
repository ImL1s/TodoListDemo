'use client'

import { useState, useEffect } from 'react'
import TodoItem, { Todo } from './TodoItem'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [isLoading, setIsLoading] = useState(true)

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()

    // Listen for custom event when a new todo is added
    const handleUpdate = () => fetchTodos()
    window.addEventListener('todosUpdated', handleUpdate)

    return () => {
      window.removeEventListener('todosUpdated', handleUpdate)
    }
  }, [])

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  }

  if (isLoading) {
    return <div className="loading">載入中...</div>
  }

  return (
    <div className="todo-list-container">
      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          全部 ({stats.total})
        </button>
        <button
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          進行中 ({stats.active})
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          已完成 ({stats.completed})
        </button>
      </div>

      {/* Todo List */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            {filter === 'all' && '還沒有待辦事項，開始新增吧！'}
            {filter === 'active' && '沒有進行中的事項'}
            {filter === 'completed' && '還沒有完成的事項'}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={fetchTodos}
            />
          ))
        )}
      </div>
    </div>
  )
}
