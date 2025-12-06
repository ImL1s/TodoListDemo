import { useEffect, useState } from 'react'
import './TodoItem.css'

function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)

  useEffect(() => {
    setDraft(todo.text)
  }, [todo.text])

  const handleSave = () => {
    const trimmed = draft.trim()
    if (!trimmed) {
      alert('內容不能為空')
      return
    }
    onUpdate(todo.id, trimmed)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setDraft(todo.text)
      setIsEditing(false)
    }
  }

  return (
    <li
      className={`todo-item ${todo.completed ? 'checked' : ''} ${isEditing ? 'editing' : ''}`}
      onClick={() => {
        if (!isEditing) onToggle(todo.id)
      }}
    >
      <div className="todo-main">
        {isEditing ? (
          <input
            className="edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            {todo.text}
          </span>
        )}
      </div>
      <div className="todo-actions">
        {!isEditing && (
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            編輯
          </button>
        )}
        <span
          className="close"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(todo.id)
          }}
        >
          ×
        </span>
      </div>
    </li>
  )
}

export default TodoItem
