'use client'

import { useState } from 'react'

export default function TodoInput() {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (response.ok) {
        setText('')
        // Trigger a refresh of the todo list
        window.dispatchEvent(new Event('todosUpdated'))
      }
    } catch (error) {
      console.error('Failed to add todo:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="輸入新的待辦事項..."
        className="todo-input"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? '新增中...' : '新增'}
      </button>
    </form>
  )
}
