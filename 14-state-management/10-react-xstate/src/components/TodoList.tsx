import React from 'react';
import { Todo, FilterType } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  editingId: string | null;
  editText: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string, text: string) => void;
  onUpdate: (id: string, text: string) => void;
  onCancelEdit: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  editingId,
  editText,
  onToggle,
  onDelete,
  onStartEdit,
  onUpdate,
  onCancelEdit,
}) => {
  // 根據篩選器過濾 todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state">
        <p>
          {filter === 'completed'
            ? 'No completed todos yet'
            : filter === 'active'
            ? 'No active todos'
            : 'No todos yet. Add one above!'}
        </p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id}
          editText={editingId === todo.id ? editText : todo.text}
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onUpdate={onUpdate}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </ul>
  );
};
