import React, { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { addTodo } from '../features/todos/todosSlice'
import './TodoForm.css'

/**
 * TodoForm 組件
 *
 * 負責新增 Todo 項目
 * 使用 useAppDispatch hook 來 dispatch actions
 */
const TodoForm: React.FC = () => {
  const [input, setInput] = useState('')
  const dispatch = useAppDispatch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedInput = input.trim()
    if (trimmedInput) {
      // Dispatch addTodo action
      dispatch(addTodo(trimmedInput))
      setInput('')
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <button type="submit" className="add-button">
        Add
      </button>
    </form>
  )
}

export default TodoForm
