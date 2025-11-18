import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import type { Todo } from '../types.js';
import './todo-item.js';

/**
 * Todo List Component
 *
 * Displays a list of todo items.
 * Uses Shadow DOM and efficient rendering with the repeat directive.
 *
 * @example
 * ```html
 * <todo-list .todos=${todosArray}></todo-list>
 * ```
 */
@customElement('todo-list')
export class TodoList extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .todo-list {
      max-height: 500px;
      overflow-y: auto;
      padding: 4px;
    }

    /* Custom scrollbar */
    .todo-list::-webkit-scrollbar {
      width: 8px;
    }

    .todo-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .todo-list::-webkit-scrollbar-thumb {
      background: #667eea;
      border-radius: 4px;
    }

    .todo-list::-webkit-scrollbar-thumb:hover {
      background: #5568d3;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-text {
      font-size: 1.1rem;
      font-weight: 500;
    }

    .empty-subtext {
      font-size: 0.9rem;
      margin-top: 8px;
      opacity: 0.7;
    }
  `;

  // Public properties
  @property({ type: Array })
  todos: Todo[] = [];

  /**
   * Render the component
   */
  render() {
    if (this.todos.length === 0) {
      return html`
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-text">目前沒有待辦事項</div>
          <div class="empty-subtext">開始新增一些任務吧！</div>
        </div>
      `;
    }

    // Use repeat directive for efficient list rendering
    // repeat() uses keys to minimize DOM updates
    return html`
      <div class="todo-list" role="list">
        ${repeat(
          this.todos,
          (todo) => todo.id,
          (todo) => html`
            <todo-item
              .todo=${todo}
              role="listitem"
            ></todo-item>
          `
        )}
      </div>
    `;
  }
}

// Declare the custom element type for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'todo-list': TodoList;
  }
}
