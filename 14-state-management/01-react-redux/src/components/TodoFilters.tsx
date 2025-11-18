import React from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  setFilter,
  clearCompleted,
  toggleAllTodos,
  selectFilter,
  selectTodoStats,
  selectAllTodos,
} from '../features/todos/todosSlice'
import type { FilterType } from '../features/todos/todosSlice'
import './TodoFilters.css'

/**
 * TodoFilters 組件
 *
 * 提供：
 * 1. 過濾器切換（全部/進行中/已完成）
 * 2. 統計資訊
 * 3. 清除已完成項目
 * 4. 全選/取消全選
 */
const TodoFilters: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentFilter = useAppSelector(selectFilter)
  const stats = useAppSelector(selectTodoStats)
  const allTodos = useAppSelector(selectAllTodos)

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter))
  }

  const handleClearCompleted = () => {
    dispatch(clearCompleted())
  }

  const handleToggleAll = () => {
    const allCompleted = allTodos.every(todo => todo.completed)
    dispatch(toggleAllTodos(!allCompleted))
  }

  const allCompleted = allTodos.length > 0 && allTodos.every(todo => todo.completed)

  return (
    <div className="todo-filters">
      <div className="filter-stats">
        <span className="stat-item">
          Total: <strong>{stats.total}</strong>
        </span>
        <span className="stat-item">
          Active: <strong>{stats.active}</strong>
        </span>
        <span className="stat-item">
          Completed: <strong>{stats.completed}</strong>
        </span>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
          onClick={() => handleFilterChange('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </button>
      </div>

      <div className="filter-actions">
        {allTodos.length > 0 && (
          <button
            className="action-btn toggle-all-btn"
            onClick={handleToggleAll}
          >
            {allCompleted ? 'Uncheck All' : 'Check All'}
          </button>
        )}

        {stats.completed > 0 && (
          <button
            className="action-btn clear-btn"
            onClick={handleClearCompleted}
          >
            Clear Completed ({stats.completed})
          </button>
        )}
      </div>
    </div>
  )
}

export default TodoFilters
