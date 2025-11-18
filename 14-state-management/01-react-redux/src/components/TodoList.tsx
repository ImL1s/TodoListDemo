import React from 'react'
import { useAppSelector } from '../store/hooks'
import { selectFilteredTodos } from '../features/todos/todosSlice'
import TodoItem from './TodoItem'
import './TodoList.css'

/**
 * TodoList 組件
 *
 * 顯示過濾後的 Todo 列表
 * 使用 useAppSelector hook 來選取 state
 */
const TodoList: React.FC = () => {
  // 使用 selector 選取已過濾的 todos
  const filteredTodos = useAppSelector(selectFilteredTodos)

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one above!</p>
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

export default TodoList
