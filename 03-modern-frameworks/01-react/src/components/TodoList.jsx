import TodoItem from './TodoItem'
import './TodoList.css'

function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  if (todos.length === 0) {
    return (
      <ul className="todo-list">
        <li className="empty-state">還沒有任務，添加一個吧！</li>
      </ul>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  )
}

export default TodoList
