import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { checkboxStyles, buttonStyles, sharedStyles, animationStyles } from '../styles';
import { Todo, TodoEvents } from '../types';

/**
 * TodoItem Component
 *
 * A custom element representing a single todo item.
 * Demonstrates:
 * - @property decorator for reactive public properties
 * - @state decorator for internal state
 * - classMap directive for conditional classes
 * - Double-click editing functionality
 * - Shadow DOM styling
 * - Event delegation to parent
 */
@customElement('todo-item')
export class TodoItem extends LitElement {
  static styles = [
    sharedStyles,
    checkboxStyles,
    buttonStyles,
    animationStyles,
    css`
      :host {
        display: block;
        animation: slideIn 0.3s ease;
      }

      .todo-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
        background: white;
        transition: background-color 0.2s ease;
      }

      .todo-item:hover {
        background: #fafafa;
      }

      .todo-item.completed {
        opacity: 0.6;
      }

      .checkbox-wrapper {
        display: flex;
        align-items: center;
      }

      .todo-content {
        flex: 1;
        min-width: 0;
      }

      .todo-text {
        font-size: 16px;
        color: #2c3e50;
        word-wrap: break-word;
        cursor: pointer;
        user-select: none;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
      }

      .todo-text:hover {
        background: #f5f5f5;
      }

      .todo-text.completed {
        text-decoration: line-through;
        color: #95a5a6;
      }

      .edit-input {
        width: 100%;
        padding: 8px 12px;
        font-size: 16px;
        border: 2px solid #4a90e2;
        border-radius: 4px;
        outline: none;
      }

      .actions {
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .todo-item:hover .actions {
        opacity: 1;
      }

      .edit-btn {
        color: #4a90e2;
        font-size: 18px;
      }

      .edit-btn:hover {
        color: #357abd;
      }

      .delete-btn {
        color: #e74c3c;
        font-size: 20px;
      }

      .delete-btn:hover {
        color: #c0392b;
      }

      .created-time {
        font-size: 12px;
        color: #95a5a6;
        margin-top: 4px;
      }

      @media (max-width: 480px) {
        .actions {
          opacity: 1;
        }

        .todo-text {
          font-size: 14px;
        }
      }
    `,
  ];

  @property({ type: Object })
  todo!: Todo;

  @state()
  private isEditing = false;

  @state()
  private editValue = '';

  /**
   * Handle checkbox toggle
   */
  private handleToggle() {
    this.dispatchEvent(
      new CustomEvent(TodoEvents.TOGGLE, {
        detail: { id: this.todo.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Handle delete button click
   */
  private handleDelete() {
    this.dispatchEvent(
      new CustomEvent(TodoEvents.DELETE, {
        detail: { id: this.todo.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Enter edit mode
   */
  private startEdit() {
    this.isEditing = true;
    this.editValue = this.todo.text;
    // Focus input after render
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector('.edit-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  /**
   * Save edited todo
   */
  private saveEdit() {
    const trimmedValue = this.editValue.trim();

    if (!trimmedValue) {
      // If empty, delete the todo
      this.handleDelete();
      return;
    }

    if (trimmedValue !== this.todo.text) {
      this.dispatchEvent(
        new CustomEvent(TodoEvents.EDIT, {
          detail: { id: this.todo.id, text: trimmedValue },
          bubbles: true,
          composed: true,
        })
      );
    }

    this.isEditing = false;
  }

  /**
   * Cancel edit mode
   */
  private cancelEdit() {
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Handle edit input changes
   */
  private handleEditInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.editValue = input.value;
  }

  /**
   * Handle edit input key events
   */
  private handleEditKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.saveEdit();
    } else if (e.key === 'Escape') {
      this.cancelEdit();
    }
  }

  /**
   * Format timestamp for display
   */
  private formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  }

  render() {
    const todoClasses = {
      'todo-item': true,
      'completed': this.todo.completed,
    };

    const textClasses = {
      'todo-text': true,
      'completed': this.todo.completed,
    };

    return html`
      <div class=${classMap(todoClasses)}>
        <div class="checkbox-wrapper">
          <input
            type="checkbox"
            .checked=${this.todo.completed}
            @change=${this.handleToggle}
            aria-label="Toggle todo completion"
          />
        </div>

        <div class="todo-content">
          ${this.isEditing
            ? html`
                <input
                  type="text"
                  class="edit-input"
                  .value=${this.editValue}
                  @input=${this.handleEditInput}
                  @keydown=${this.handleEditKeydown}
                  @blur=${this.saveEdit}
                />
              `
            : html`
                <div
                  class=${classMap(textClasses)}
                  @dblclick=${this.startEdit}
                  title="Double-click to edit"
                >
                  ${this.todo.text}
                </div>
                <div class="created-time">
                  ${this.formatTime(this.todo.createdAt)}
                </div>
              `
          }
        </div>

        ${!this.isEditing
          ? html`
              <div class="actions">
                <button
                  class="edit-btn"
                  @click=${this.startEdit}
                  aria-label="Edit todo"
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  class="delete-btn"
                  @click=${this.handleDelete}
                  aria-label="Delete todo"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            `
          : null
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-item': TodoItem;
  }
}
