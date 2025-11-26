import React, { useState, KeyboardEvent } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useTodos } from '../context/TodoContext';
import { DeleteDialog } from './DeleteDialog';
import { Todo } from '../types';
import styles from '../styles/App.module.css';

interface TodoItemProps {
  todo: Todo;
}

/**
 * TodoItem component using multiple Radix UI primitives
 *
 * Demonstrates:
 * - Radix Checkbox primitive (accessible, keyboard navigable)
 * - Radix Tooltip primitive (hover/focus tooltips)
 * - Inline editing with state management
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 * - Conditional rendering
 * - Integration of multiple Radix primitives in one component
 */
export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, editTodo, deleteTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(todo.text);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== todo.text) {
      editTodo(todo.id, trimmedValue);
    } else if (!trimmedValue) {
      setEditValue(todo.text);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteTodo(todo.id);
  };

  return (
    <>
      <div className={`${styles.todoItem} ${todo.completed ? styles.todoItemCompleted : ''}`}>
        {/* Radix Checkbox Primitive */}
        <Checkbox.Root
          className={styles.checkboxRoot}
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => toggleTodo(todo.id)}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        >
          <Checkbox.Indicator className={styles.checkboxIndicator}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </Checkbox.Indicator>
        </Checkbox.Root>

        {/* Todo Content */}
        <div className={styles.todoContent}>
          {isEditing ? (
            <input
              type="text"
              className={styles.todoEditInput}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              autoFocus
            />
          ) : (
            <label
              htmlFor={`todo-${todo.id}`}
              className={styles.todoLabel}
              onDoubleClick={handleEdit}
            >
              {todo.text}
            </label>
          )}

          <div className={styles.todoMeta}>
            {new Date(todo.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Action Buttons with Tooltips */}
        <div className={styles.todoActions}>
          {!isEditing && (
            <>
              {/* Edit Button with Tooltip */}
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className={styles.iconButton}
                      onClick={handleEdit}
                      aria-label="Edit todo"
                      type="button"
                    >
                      ✎
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className={styles.tooltipContent}
                      sideOffset={5}
                    >
                      Edit (double-click)
                      <Tooltip.Arrow className={styles.tooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>

              {/* Delete Button with Tooltip */}
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                      onClick={handleDelete}
                      aria-label="Delete todo"
                      type="button"
                    >
                      ✕
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className={styles.tooltipContent}
                      sideOffset={5}
                    >
                      Delete todo
                      <Tooltip.Arrow className={styles.tooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </>
          )}

          {isEditing && (
            <div className={styles.editActions}>
              <button
                className={styles.buttonSmallPrimary}
                onClick={handleSave}
                type="button"
              >
                Save
              </button>
              <button
                className={styles.buttonSmallSecondary}
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        todoText={todo.text}
      />
    </>
  );
};
