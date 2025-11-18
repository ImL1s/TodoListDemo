import React, { useMemo } from 'react';
import { useTodos } from '../context/TodoContext';
import { TodoItem } from './TodoItem';
import { Todo } from '../types';
import styles from '../styles/App.module.css';

/**
 * TodoList component that renders filtered todos
 *
 * Features:
 * - Memoized filtering for performance
 * - Conditional rendering for empty states
 * - Accessible list semantics
 * - Filtered view based on current filter
 */
export const TodoList: React.FC = () => {
  const { todos, filter } = useTodos();

  // Memoize filtered todos to avoid unnecessary recalculations
  const filteredTodos = useMemo<Todo[]>(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      case 'all':
      default:
        return todos;
    }
  }, [todos, filter]);

  if (todos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📝</div>
        <h2 className={styles.emptyStateTitle}>No todos yet</h2>
        <p className={styles.emptyStateDescription}>
          Add your first todo to get started!
        </p>
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>🔍</div>
        <h2 className={styles.emptyStateTitle}>No {filter} todos</h2>
        <p className={styles.emptyStateDescription}>
          {filter === 'active'
            ? 'All tasks are completed!'
            : 'Complete some tasks to see them here.'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.todoList} role="list">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
