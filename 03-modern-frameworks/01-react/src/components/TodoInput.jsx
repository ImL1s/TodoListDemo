import { useState } from 'react'
import './TodoInput.css'

function TodoInput({ onAdd }) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedValue = inputValue.trim()

    if (!trimmedValue) {
      alert('請先輸入一個具體任務。')
      return
    }

    onAdd(trimmedValue)
    setInputValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="header">
      <h2>
        任務清單 <span className="tech-badge">React</span>
      </h2>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="請輸入任務"
          className="todo-input"
        />
        <button onClick={handleSubmit} className="add-btn">
          添加
        </button>
      </div>
    </div>
  )
}

export default TodoInput
