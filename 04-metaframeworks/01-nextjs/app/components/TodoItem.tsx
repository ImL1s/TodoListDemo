'use client'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

interface TodoItemProps {
  todo: Todo
  onUpdate: () => void
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const handleToggle = async () => {
    try {
      await fetch('/api/todos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: todo.id,
          completed: !todo.completed,
        }),
      })
      onUpdate()
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await fetch('/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: todo.id }),
      })
      onUpdate()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.text}</span>
      <button
        onClick={handleDelete}
        className="btn btn-delete"
        aria-label="刪除"
      >
        刪除
      </button>
    </div>
  )
}
