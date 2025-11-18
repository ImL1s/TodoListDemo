import React, { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { toggleTodo, deleteTodo, editTodo } from '../features/todos/todosSlice'
import type { Todo } from '../features/todos/todosSlice'
import './TodoItem.css'

interface TodoItemProps {
  todo: Todo
}

/**
 * TodoItem 組件
 *
 * 顯示單個 Todo 項目
 * 支援：
 * 1. 切換完成狀態
 * 2. 編輯文字
 * 3. 刪除項目
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const dispatch = useAppDispatch()

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id))
  }

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }

  const handleSave = () => {
    const trimmedText = editText.trim()
    if (trimmedText) {
      dispatch(editTodo({ id: todo.id, text: trimmedText }))
      setIsEditing(false)
    } else {
      // 如果編輯後的文字為空，則刪除該項目
      dispatch(deleteTodo(todo.id))
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditText(todo.text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />

        {isEditing ? (
          <input
            type="text"
            className="todo-edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <span
            className="todo-text"
            onDoubleClick={handleEdit}
            title="Double click to edit"
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <>
            <button
              className="edit-button"
              onClick={handleEdit}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="delete-button"
              onClick={handleDelete}
              title="Delete"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default TodoItem
