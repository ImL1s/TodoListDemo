import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { Todo } from '../types.js';
import { TodoToggleEvent, TodoDeleteEvent, TodoEditEvent } from '../types.js';

/**
 * Todo Item Component
 *
 * Displays a single todo item with edit, toggle, and delete functionality.
 * Uses Shadow DOM for encapsulation.
 *
 * @fires todo-toggle - Fired when todo completion status is toggled
 * @fires todo-delete - Fired when todo is deleted
 * @fires todo-edit - Fired when todo text is edited
 *
 * @example
 * ```html
 * <todo-item .todo=${todoObject}></todo-item>
 * ```
 */
@customElement('todo-item')
export class TodoItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 10px;
    }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .todo-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-color: #667eea;
    }

    .todo-item.completed {
      opacity: 0.7;
      background: #f9fafb;
    }

    .checkbox-wrapper {
      flex-shrink: 0;
    }

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #667eea;
    }

    .todo-content {
      flex: 1;
      min-width: 0;
    }

    .todo-text {
      font-size: 1rem;
      color: #1f2937;
      word-wrap: break-word;
      line-height: 1.5;
    }

    .todo-text.completed {
      text-decoration: line-through;
      color: #9ca3af;
    }

    .edit-input {
      width: 100%;
      padding: 8px 12px;
      border: 2px solid #667eea;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
      outline: none;
    }

    .timestamp {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 4px;
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    button {
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .edit-btn {
      background: #f3f4f6;
      color: #667eea;
    }

    .edit-btn:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }

    .delete-btn {
      background: #fee2e2;
      color: #dc2626;
    }

    .delete-btn:hover {
      background: #fecaca;
      transform: translateY(-1px);
    }

    .save-btn {
      background: #667eea;
      color: white;
    }

    .save-btn:hover {
      background: #5568d3;
    }

    .cancel-btn {
      background: #e5e7eb;
      color: #6b7280;
    }

    .cancel-btn:hover {
      background: #d1d5db;
    }

    @media (max-width: 640px) {
      .todo-item {
        flex-wrap: wrap;
      }

      .actions {
        width: 100%;
        justify-content: flex-end;
      }

      button {
        padding: 6px 10px;
        font-size: 0.8rem;
      }
    }
  `;

  // Public properties (reactive)
  @property({ type: Object })
  todo!: Todo;

  // Internal state
  @state()
  private isEditing = false;

  @state()
  private editValue = '';

  /**
   * Toggle todo completion status
   */
  private handleToggle() {
    this.dispatchEvent(new TodoToggleEvent(this.todo.id));
  }

  /**
   * Delete todo
   */
  private handleDelete() {
    this.dispatchEvent(new TodoDeleteEvent(this.todo.id));
  }

  /**
   * Start editing mode
   */
  private startEdit() {
    this.isEditing = true;
    this.editValue = this.todo.text;
  }

  /**
   * Cancel editing
   */
  private cancelEdit() {
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Save edited todo
   */
  private saveEdit() {
    const trimmedValue = this.editValue.trim();
    if (trimmedValue && trimmedValue !== this.todo.text) {
      this.dispatchEvent(new TodoEditEvent(this.todo.id, trimmedValue));
    }
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Handle edit input change
   */
  private handleEditInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.editValue = input.value;
  }

  /**
   * Handle edit form submission
   */
  private handleEditSubmit(e: Event) {
    e.preventDefault();
    this.saveEdit();
  }

  /**
   * Format timestamp
   */
  private formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Render the component
   */
  render() {
    const itemClasses = {
      'todo-item': true,
      'completed': this.todo.completed
    };

    const textClasses = {
      'todo-text': true,
      'completed': this.todo.completed
    };

    return html`
      <div class=${classMap(itemClasses)}>
        <div class="checkbox-wrapper">
          <input
            type="checkbox"
            .checked=${this.todo.completed}
            @change=${this.handleToggle}
            aria-label="標記完成"
          />
        </div>

        <div class="todo-content">
          ${this.isEditing
            ? html`
                <form @submit=${this.handleEditSubmit}>
                  <input
                    type="text"
                    class="edit-input"
                    .value=${this.editValue}
                    @input=${this.handleEditInput}
                    @blur=${this.saveEdit}
                    aria-label="編輯待辦事項"
                    autofocus
                  />
                </form>
              `
            : html`
                <div class=${classMap(textClasses)}>${this.todo.text}</div>
                <div class="timestamp">${this.formatDate(this.todo.createdAt)}</div>
              `
          }
        </div>

        <div class="actions">
          ${this.isEditing
            ? html`
                <button class="save-btn" @click=${this.saveEdit} aria-label="儲存">
                  💾 儲存
                </button>
                <button class="cancel-btn" @click=${this.cancelEdit} aria-label="取消">
                  ❌ 取消
                </button>
              `
            : html`
                <button class="edit-btn" @click=${this.startEdit} aria-label="編輯">
                  ✏️ 編輯
                </button>
                <button class="delete-btn" @click=${this.handleDelete} aria-label="刪除">
                  🗑️ 刪除
                </button>
              `
          }
        </div>
      </div>
    `;
  }
}

// Declare the custom element type for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'todo-item': TodoItem;
  }
}
