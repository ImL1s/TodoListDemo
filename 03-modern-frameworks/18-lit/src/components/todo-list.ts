import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { sharedStyles, animationStyles } from '../styles';
import { Todo } from '../types';
import './todo-item';

/**
 * TodoList Component
 *
 * A custom element that renders a list of todos.
 * Demonstrates:
 * - @property decorator for reactive properties
 * - repeat directive for efficient list rendering
 * - Slot-based composition
 * - Empty state handling
 * - Event bubbling from child components
 */
@customElement('todo-list')
export class TodoList extends LitElement {
  static styles = [
    sharedStyles,
    animationStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }

      .list-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        animation: fadeIn 0.3s ease;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #95a5a6;
        animation: fadeIn 0.5s ease;
      }

      .empty-state-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .empty-state-title {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 8px;
        color: #7f8c8d;
      }

      .empty-state-message {
        font-size: 14px;
        color: #95a5a6;
      }

      .list-header {
        padding: 16px 20px;
        background: #f8f9fa;
        border-bottom: 2px solid #e9ecef;
      }

      .list-header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #6c757d;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .list-items {
        max-height: 500px;
        overflow-y: auto;
      }

      .list-items::-webkit-scrollbar {
        width: 8px;
      }

      .list-items::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .list-items::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
      }

      .list-items::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }

      @media (max-width: 480px) {
        .list-items {
          max-height: 400px;
        }
      }
    `,
  ];

  @property({ type: Array })
  todos: Todo[] = [];

  @property({ type: String })
  emptyMessage = 'No todos yet';

  @property({ type: String })
  emptyIcon = '📝';

  @property({ type: Boolean })
  showHeader = false;

  @property({ type: String })
  headerTitle = 'Todo Items';

  /**
   * Render empty state when no todos
   */
  private renderEmptyState() {
    return html`
      <div class="empty-state">
        <div class="empty-state-icon">${this.emptyIcon}</div>
        <div class="empty-state-title">${this.emptyMessage}</div>
        <div class="empty-state-message">
          Add a new todo to get started
        </div>
      </div>
    `;
  }

  /**
   * Render the list of todos
   */
  private renderTodos() {
    return html`
      ${this.showHeader
        ? html`
            <div class="list-header">
              <h3>${this.headerTitle}</h3>
            </div>
          `
        : null
      }
      <div class="list-items">
        ${repeat(
          this.todos,
          (todo) => todo.id,
          (todo) => html`
            <todo-item .todo=${todo}></todo-item>
          `
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class="list-container">
        ${this.todos.length === 0
          ? this.renderEmptyState()
          : this.renderTodos()
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-list': TodoList;
  }
}
