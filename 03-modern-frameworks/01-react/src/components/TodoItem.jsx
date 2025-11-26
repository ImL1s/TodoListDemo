import './TodoItem.css'

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li
      className={`todo-item ${todo.completed ? 'checked' : ''}`}
      onClick={() => onToggle(todo.id)}
    >
      <span className="todo-text">{todo.text}</span>
      <span
        className="close"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(todo.id)
        }}
      >
        ×
      </span>
    </li>
  )
}

export default TodoItem
