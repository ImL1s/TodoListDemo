import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { Todo, FilterType } from './types.js';
import './components/todo-input.js';
import './components/todo-list.js';

/**
 * Todo App - Main Application Component
 *
 * This is the root component that manages the entire todo application state.
 * It uses Lit's reactive properties and Shadow DOM for encapsulation.
 *
 * Features:
 * - LocalStorage persistence
 * - Filter by all/active/completed
 * - CRUD operations for todos
 * - Reactive state management
 *
 * @example
 * ```html
 * <todo-app></todo-app>
 * ```
 */
@customElement('todo-app')
export class TodoApp extends LitElement {
  // Static styles applied to shadow root
  static styles = css`
    :host {
      display: block;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .app-container {
      padding: 30px;
    }

    .filters {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 12px;
      flex-wrap: wrap;
    }

    .filter-btn {
      flex: 1;
      min-width: 100px;
      padding: 10px 20px;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-btn:hover {
      border-color: #667eea;
      color: #667eea;
      transform: translateY(-1px);
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: transparent;
    }

    .stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #f9fafb;
      border-radius: 12px;
      margin-top: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .stat-value {
      font-weight: 700;
      color: #667eea;
      font-size: 1.1rem;
    }

    .clear-btn {
      padding: 8px 16px;
      background: #fee2e2;
      color: #dc2626;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .clear-btn:hover:not(:disabled) {
      background: #fecaca;
      transform: translateY(-1px);
    }

    .clear-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 640px) {
      .app-container {
        padding: 20px;
      }

      .filters {
        gap: 8px;
      }

      .filter-btn {
        min-width: auto;
        padding: 8px 12px;
        font-size: 0.85rem;
      }

      .stats {
        flex-direction: column;
        align-items: flex-start;
      }

      .clear-btn {
        width: 100%;
      }
    }
  `;

  // LocalStorage key
  private readonly STORAGE_KEY = 'lit-todos';

  // Internal state (private, reactive)
  @state()
  private todos: Todo[] = [];

  @state()
  private filter: FilterType = 'all';

  /**
   * Lifecycle: Called when element is added to DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.loadTodos();

    // Listen to custom events from child components
    this.addEventListener('todo-add', this.handleAddTodo as EventListener);
    this.addEventListener('todo-toggle', this.handleToggleTodo as EventListener);
    this.addEventListener('todo-delete', this.handleDeleteTodo as EventListener);
    this.addEventListener('todo-edit', this.handleEditTodo as EventListener);
  }

  /**
   * Lifecycle: Called when element is removed from DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('todo-add', this.handleAddTodo as EventListener);
    this.removeEventListener('todo-toggle', this.handleToggleTodo as EventListener);
    this.removeEventListener('todo-delete', this.handleDeleteTodo as EventListener);
    this.removeEventListener('todo-edit', this.handleEditTodo as EventListener);
  }

  /**
   * Load todos from localStorage
   */
  private loadTodos() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.todos = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      this.todos = [];
    }
  }

  /**
   * Save todos to localStorage
   */
  private saveTodos() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle add todo event
   */
  private handleAddTodo = (e: CustomEvent<{ text: string }>) => {
    const newTodo: Todo = {
      id: this.generateId(),
      text: e.detail.text,
      completed: false,
      createdAt: Date.now()
    };

    this.todos = [...this.todos, newTodo];
    this.saveTodos();
  };

  /**
   * Handle toggle todo event
   */
  private handleToggleTodo = (e: CustomEvent<{ id: string }>) => {
    this.todos = this.todos.map(todo =>
      todo.id === e.detail.id
        ? { ...todo, completed: !todo.completed }
        : todo
    );
    this.saveTodos();
  };

  /**
   * Handle delete todo event
   */
  private handleDeleteTodo = (e: CustomEvent<{ id: string }>) => {
    this.todos = this.todos.filter(todo => todo.id !== e.detail.id);
    this.saveTodos();
  };

  /**
   * Handle edit todo event
   */
  private handleEditTodo = (e: CustomEvent<{ id: string; text: string }>) => {
    this.todos = this.todos.map(todo =>
      todo.id === e.detail.id
        ? { ...todo, text: e.detail.text }
        : todo
    );
    this.saveTodos();
  };

  /**
   * Set filter
   */
  private setFilter(filter: FilterType) {
    this.filter = filter;
  }

  /**
   * Clear completed todos
   */
  private clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.saveTodos();
  }

  /**
   * Get filtered todos
   */
  private getFilteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  /**
   * Get statistics
   */
  private get stats() {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }

  /**
   * Render the component
   */
  render() {
    const filteredTodos = this.getFilteredTodos();
    const { total, completed, active } = this.stats;

    return html`
      <div class="app-container">
        <!-- Input Component -->
        <todo-input></todo-input>

        <!-- Filters -->
        <div class="filters" role="tablist">
          <button
            class=${classMap({ 'filter-btn': true, 'active': this.filter === 'all' })}
            @click=${() => this.setFilter('all')}
            role="tab"
            aria-selected=${this.filter === 'all'}
          >
            📋 全部 (${total})
          </button>
          <button
            class=${classMap({ 'filter-btn': true, 'active': this.filter === 'active' })}
            @click=${() => this.setFilter('active')}
            role="tab"
            aria-selected=${this.filter === 'active'}
          >
            ⏳ 進行中 (${active})
          </button>
          <button
            class=${classMap({ 'filter-btn': true, 'active': this.filter === 'completed' })}
            @click=${() => this.setFilter('completed')}
            role="tab"
            aria-selected=${this.filter === 'completed'}
          >
            ✅ 已完成 (${completed})
          </button>
        </div>

        <!-- Todo List Component -->
        <todo-list .todos=${filteredTodos}></todo-list>

        <!-- Statistics -->
        ${total > 0 ? html`
          <div class="stats">
            <div class="stat-item">
              <span>總計：</span>
              <span class="stat-value">${total}</span>
            </div>
            <div class="stat-item">
              <span>已完成：</span>
              <span class="stat-value">${completed}</span>
            </div>
            <div class="stat-item">
              <span>進行中：</span>
              <span class="stat-value">${active}</span>
            </div>
            <button
              class="clear-btn"
              @click=${this.clearCompleted}
              ?disabled=${completed === 0}
            >
              🗑️ 清除已完成
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }
}

// Declare the custom element type for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'todo-app': TodoApp;
  }
}
