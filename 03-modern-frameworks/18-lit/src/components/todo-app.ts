import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import {
  Todo,
  FilterType,
  TodoEvents,
  TodoEventDetail,
  STORAGE_KEY,
  TodoStats,
} from '../types';
import {
  sharedStyles,
  buttonStyles,
  typographyStyles,
  animationStyles,
} from '../styles';
import './todo-input';
import './todo-list';

/**
 * TodoApp Component
 *
 * The main application component that manages the todo state.
 * Demonstrates:
 * - State management with @state decorator
 * - Lifecycle methods (firstUpdated, updated)
 * - LocalStorage persistence
 * - Event handling and delegation
 * - Computed properties via getters
 * - Complex UI logic and filtering
 * - Shadow DOM scoped styles
 */
@customElement('todo-app')
export class TodoApp extends LitElement {
  static styles = [
    sharedStyles,
    buttonStyles,
    typographyStyles,
    animationStyles,
    css`
      :host {
        display: block;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, sans-serif;
      }

      .app-container {
        animation: fadeIn 0.5s ease;
      }

      .app-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .app-title {
        font-size: 64px;
        font-weight: 100;
        color: rgba(175, 47, 47, 0.15);
        margin: 0 0 10px 0;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .app-subtitle {
        font-size: 16px;
        color: #95a5a6;
        margin: 0;
      }

      .input-section {
        margin-bottom: 20px;
      }

      .filters-section {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin: 20px 0;
        padding: 16px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        flex-wrap: wrap;
      }

      .filter-btn {
        padding: 8px 20px;
        border: 2px solid transparent;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        color: #7f8c8d;
        transition: all 0.2s ease;
      }

      .filter-btn:hover {
        color: #4a90e2;
        background: #f0f8ff;
      }

      .filter-btn.active {
        border-color: #4a90e2;
        color: #4a90e2;
        background: #f0f8ff;
      }

      .list-section {
        margin-bottom: 20px;
      }

      .stats-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        flex-wrap: wrap;
        gap: 12px;
      }

      .stats-info {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }

      .stat-item {
        font-size: 14px;
        color: #7f8c8d;
      }

      .stat-value {
        font-weight: 600;
        color: #4a90e2;
      }

      .clear-btn {
        background: #e74c3c;
        color: white;
        border-radius: 6px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
      }

      .clear-btn:hover:not(:disabled) {
        background: #c0392b;
      }

      .clear-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .footer {
        text-align: center;
        margin-top: 40px;
        padding: 20px;
        color: #95a5a6;
        font-size: 14px;
      }

      .footer a {
        color: #4a90e2;
        text-decoration: none;
      }

      .footer a:hover {
        text-decoration: underline;
      }

      .storage-info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #95a5a6;
        padding: 8px 12px;
        background: #f8f9fa;
        border-radius: 4px;
      }

      .storage-icon {
        color: #27ae60;
      }

      @media (max-width: 768px) {
        :host {
          padding: 10px;
        }

        .app-title {
          font-size: 48px;
        }

        .stats-section {
          flex-direction: column;
          align-items: stretch;
        }

        .stats-info {
          justify-content: space-around;
        }

        .clear-btn {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .app-title {
          font-size: 36px;
        }

        .filters-section {
          gap: 8px;
        }

        .filter-btn {
          flex: 1;
          min-width: 80px;
        }
      }
    `,
  ];

  @state()
  private todos: Todo[] = [];

  @state()
  private filter: FilterType = 'all';

  /**
   * Lifecycle: Called after first render
   * Load todos from localStorage
   */
  firstUpdated() {
    this.loadTodos();
  }

  /**
   * Lifecycle: Called after every update
   * Save todos to localStorage whenever they change
   */
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('todos')) {
      this.saveTodos();
    }
  }

  /**
   * Load todos from localStorage
   */
  private loadTodos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.todos = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  }

  /**
   * Save todos to localStorage
   */
  private saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  }

  /**
   * Generate unique ID for todos
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get filtered todos based on current filter
   */
  private get filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter((todo) => !todo.completed);
      case 'completed':
        return this.todos.filter((todo) => todo.completed);
      default:
        return this.todos;
    }
  }

  /**
   * Get todo statistics
   */
  private get stats(): TodoStats {
    const total = this.todos.length;
    const completed = this.todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }

  /**
   * Handle add todo event
   */
  private handleAddTodo(e: CustomEvent<TodoEventDetail>) {
    const { text } = e.detail;
    if (!text) return;

    const newTodo: Todo = {
      id: this.generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
    };

    this.todos = [...this.todos, newTodo];
  }

  /**
   * Handle toggle todo event
   */
  private handleToggleTodo(e: CustomEvent<TodoEventDetail>) {
    const { id } = e.detail;
    if (!id) return;

    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  /**
   * Handle delete todo event
   */
  private handleDeleteTodo(e: CustomEvent<TodoEventDetail>) {
    const { id } = e.detail;
    if (!id) return;

    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  /**
   * Handle edit todo event
   */
  private handleEditTodo(e: CustomEvent<TodoEventDetail>) {
    const { id, text } = e.detail;
    if (!id || !text) return;

    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    );
  }

  /**
   * Change filter
   */
  private setFilter(filter: FilterType) {
    this.filter = filter;
  }

  /**
   * Clear completed todos
   */
  private clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.completed);
  }

  /**
   * Render filter buttons
   */
  private renderFilters() {
    const filters: { label: string; value: FilterType }[] = [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Completed', value: 'completed' },
    ];

    return html`
      <div class="filters-section">
        ${filters.map(({ label, value }) => {
          const classes = {
            'filter-btn': true,
            'active': this.filter === value,
          };

          return html`
            <button
              class=${classMap(classes)}
              @click=${() => this.setFilter(value)}
              aria-label="Filter ${label}"
              aria-pressed=${this.filter === value}
            >
              ${label}
              ${value !== 'all' ? html`<span class="stat-value">(${
                value === 'active' ? this.stats.active : this.stats.completed
              })</span>` : ''}
            </button>
          `;
        })}
      </div>
    `;
  }

  /**
   * Render statistics section
   */
  private renderStats() {
    const { total, active, completed } = this.stats;

    return html`
      <div class="stats-section">
        <div class="stats-info">
          <div class="stat-item">
            Total: <span class="stat-value">${total}</span>
          </div>
          <div class="stat-item">
            Active: <span class="stat-value">${active}</span>
          </div>
          <div class="stat-item">
            Completed: <span class="stat-value">${completed}</span>
          </div>
        </div>

        <div class="storage-info">
          <span class="storage-icon">💾</span>
          <span>Auto-saved to LocalStorage</span>
        </div>

        ${completed > 0
          ? html`
              <button
                class="clear-btn"
                @click=${this.clearCompleted}
                aria-label="Clear completed todos"
              >
                Clear Completed (${completed})
              </button>
            `
          : null
        }
      </div>
    `;
  }

  /**
   * Get empty message based on filter
   */
  private getEmptyMessage(): string {
    switch (this.filter) {
      case 'active':
        return 'No active todos';
      case 'completed':
        return 'No completed todos';
      default:
        return 'No todos yet';
    }
  }

  /**
   * Get empty icon based on filter
   */
  private getEmptyIcon(): string {
    switch (this.filter) {
      case 'active':
        return '✓';
      case 'completed':
        return '🎉';
      default:
        return '📝';
    }
  }

  render() {
    return html`
      <div
        class="app-container"
        @todo-add=${this.handleAddTodo}
        @todo-toggle=${this.handleToggleTodo}
        @todo-delete=${this.handleDeleteTodo}
        @todo-edit=${this.handleEditTodo}
      >
        <header class="app-header">
          <h1 class="app-title">todos</h1>
          <p class="app-subtitle">Built with Lit Web Components</p>
        </header>

        <div class="input-section">
          <todo-input></todo-input>
        </div>

        ${this.renderFilters()}

        <div class="list-section">
          <todo-list
            .todos=${this.filteredTodos}
            .emptyMessage=${this.getEmptyMessage()}
            .emptyIcon=${this.getEmptyIcon()}
          ></todo-list>
        </div>

        ${this.todos.length > 0 ? this.renderStats() : null}

        <footer class="footer">
          <p>
            Built with
            <a href="https://lit.dev" target="_blank" rel="noopener">Lit</a>
            - A simple library for building fast, lightweight web components
          </p>
          <p>
            <small>Double-click a todo to edit • Changes auto-save</small>
          </p>
        </footer>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-app': TodoApp;
  }
}
