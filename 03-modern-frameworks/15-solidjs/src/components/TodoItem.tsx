/**
 * TodoItem Component
 *
 * Demonstrates fine-grained reactivity in SolidJS.
 * This component only re-renders the specific parts that change,
 * not the entire component like React would.
 *
 * Key concepts:
 * - Props are readonly and reactive
 * - Show component for conditional rendering
 * - createSignal for local editing state
 * - Fine-grained updates: Only changed DOM nodes update
 */

import { createSignal, Show } from 'solid-js';
import { toggleTodo, deleteTodo, editTodo } from '../store/todoStore';
import type { Component } from 'solid-js';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: Component<TodoItemProps> = (props) => {
  /**
   * Local state for editing mode
   * Using signals for component-local state
   */
  const [isEditing, setIsEditing] = createSignal(false);
  const [editValue, setEditValue] = createSignal('');

  /**
   * Start editing mode
   * Initialize edit value with current todo text
   */
  const startEdit = () => {
    setEditValue(props.todo.text);
    setIsEditing(true);
  };

  /**
   * Cancel editing
   * Return to view mode without saving
   */
  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  /**
   * Save edited todo
   * Update the todo and exit edit mode
   */
  const saveEdit = () => {
    const value = editValue().trim();
    if (value) {
      editTodo(props.todo.id, value);
    } else {
      deleteTodo(props.todo.id);
    }
    setIsEditing(false);
  };

  /**
   * Handle edit input
   */
  const handleEditInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    setEditValue(target.value);
  };

  /**
   * Handle edit keydown
   * Enter saves, Escape cancels
   */
  const handleEditKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  /**
   * Handle checkbox toggle
   */
  const handleToggle = () => {
    toggleTodo(props.todo.id);
  };

  /**
   * Handle delete button
   */
  const handleDelete = () => {
    deleteTodo(props.todo.id);
  };

  /**
   * Show component for conditional rendering
   *
   * Show only creates/destroys DOM elements when condition changes.
   * This is more efficient than using ternary in many cases.
   *
   * The component uses classList for dynamic classes,
   * which is more efficient than className strings.
   */
  return (
    <li
      classList={{
        'todo-item': true,
        completed: props.todo.completed,
        editing: isEditing(),
      }}
    >
      <Show
        when={!isEditing()}
        fallback={
          <div class="edit-mode">
            <input
              type="text"
              class="edit-input"
              value={editValue()}
              onInput={handleEditInput}
              onKeyDown={handleEditKeyDown}
              onBlur={saveEdit}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autofocus
            />
          </div>
        }
      >
        <div class="view-mode">
          <input
            type="checkbox"
            class="toggle"
            checked={props.todo.completed}
            onChange={handleToggle}
          />
          <label class="todo-text" onDblClick={startEdit}>
            {props.todo.text}
          </label>
          <button class="delete-btn" onClick={handleDelete} aria-label="Delete todo">
            ×
          </button>
        </div>
      </Show>
    </li>
  );
};

export default TodoItem;
