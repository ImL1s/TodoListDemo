/**
 * TodoItem Component - Individual Todo Item
 *
 * Stencil Features:
 * - @Prop decorator for component props
 * - @State for edit mode
 * - Multiple @Event emitters
 * - Conditional rendering with JSX
 * - Two-way binding patterns
 * - Watch decorator for prop changes
 */

import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';
import { Todo } from '../../utils/types';

@Component({
  tag: 'todo-item',
  styles: `
    :host {
      display: block;
    }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      transition: background-color 0.2s ease;
    }

    .todo-item:hover {
      background-color: #f9fafb;
    }

    .todo-item:last-child {
      border-bottom: none;
    }

    .checkbox-wrapper {
      position: relative;
      flex-shrink: 0;
    }

    input[type="checkbox"] {
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
      accent-color: #7c3aed;
    }

    .todo-content {
      flex: 1;
      min-width: 0;
    }

    .todo-text {
      font-size: 1rem;
      color: #1f2937;
      word-break: break-word;
      transition: all 0.2s ease;
    }

    .todo-text.completed {
      text-decoration: line-through;
      color: #9ca3af;
    }

    .edit-input {
      width: 100%;
      padding: 0.5rem;
      border: 2px solid #7c3aed;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-family: inherit;
      color: #1f2937;
    }

    .edit-input:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    .todo-date {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 0.25rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    button {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .edit-btn {
      background-color: #3b82f6;
      color: white;
    }

    .edit-btn:hover {
      background-color: #2563eb;
      transform: translateY(-1px);
    }

    .save-btn {
      background-color: #10b981;
      color: white;
    }

    .save-btn:hover {
      background-color: #059669;
      transform: translateY(-1px);
    }

    .cancel-btn {
      background-color: #6b7280;
      color: white;
    }

    .cancel-btn:hover {
      background-color: #4b5563;
      transform: translateY(-1px);
    }

    .delete-btn {
      background-color: #ef4444;
      color: white;
    }

    .delete-btn:hover {
      background-color: #dc2626;
      transform: translateY(-1px);
    }

    @media (max-width: 640px) {
      .todo-item {
        padding: 0.875rem 1rem;
        gap: 0.75rem;
      }

      .actions {
        flex-direction: column;
      }

      button {
        padding: 0.375rem 0.625rem;
        font-size: 0.75rem;
      }
    }
  `,
  shadow: true,
})
export class TodoItem {
  /**
   * @Prop - Component Properties
   *
   * Props are immutable data passed from parent
   * Similar to React props but with TypeScript decorators
   *
   * Features:
   * - Type checking
   * - Required/optional validation
   * - Automatic re-rendering on change
   */
  @Prop() todo!: Todo;

  /**
   * @State - Edit Mode State
   *
   * Internal state for controlling edit mode
   */
  @State() isEditing: boolean = false;
  @State() editText: string = '';

  /**
   * @Event - Multiple Event Emitters
   *
   * Each action emits a specific event
   * Type-safe event data
   */
  @Event() todoToggle: EventEmitter<string>;
  @Event() todoDelete: EventEmitter<string>;
  @Event() todoEdit: EventEmitter<{ id: string; text: string }>;

  /**
   * Toggle todo completion
   */
  private handleToggle = () => {
    this.todoToggle.emit(this.todo.id);
  };

  /**
   * Delete todo
   */
  private handleDelete = () => {
    this.todoDelete.emit(this.todo.id);
  };

  /**
   * Start editing
   */
  private startEdit = () => {
    this.isEditing = true;
    this.editText = this.todo.text;
  };

  /**
   * Cancel editing
   */
  private cancelEdit = () => {
    this.isEditing = false;
    this.editText = '';
  };

  /**
   * Save edited todo
   */
  private saveEdit = () => {
    const text = this.editText.trim();
    if (text && text !== this.todo.text) {
      this.todoEdit.emit({ id: this.todo.id, text });
    }
    this.isEditing = false;
  };

  /**
   * Handle input change
   */
  private handleEditInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.editText = target.value;
  };

  /**
   * Handle Enter key in edit input
   */
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.saveEdit();
    } else if (e.key === 'Escape') {
      this.cancelEdit();
    }
  };

  /**
   * Format date for display
   */
  private formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Render method with conditional UI
   */
  render() {
    return (
      <div class="todo-item">
        <div class="checkbox-wrapper">
          <input
            type="checkbox"
            checked={this.todo.completed}
            onChange={this.handleToggle}
            aria-label={`Mark "${this.todo.text}" as ${this.todo.completed ? 'incomplete' : 'complete'}`}
          />
        </div>

        <div class="todo-content">
          {this.isEditing ? (
            <input
              type="text"
              class="edit-input"
              value={this.editText}
              onInput={this.handleEditInput}
              onKeyDown={this.handleKeyDown}
              autoFocus
            />
          ) : (
            <div>
              <div class={`todo-text ${this.todo.completed ? 'completed' : ''}`}>
                {this.todo.text}
              </div>
              <div class="todo-date">
                {this.formatDate(this.todo.createdAt)}
              </div>
            </div>
          )}
        </div>

        <div class="actions">
          {this.isEditing ? (
            <>
              <button class="save-btn" onClick={this.saveEdit}>
                Save
              </button>
              <button class="cancel-btn" onClick={this.cancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button class="edit-btn" onClick={this.startEdit}>
                Edit
              </button>
              <button class="delete-btn" onClick={this.handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}
