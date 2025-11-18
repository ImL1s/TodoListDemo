/**
 * TodoApp Component - Main Application Container
 *
 * Stencil Component Features:
 * - @Component decorator defines the web component
 * - @State creates reactive state (like React's useState)
 * - @Listen handles events from child components
 * - componentWillLoad lifecycle for initialization
 * - Virtual DOM with JSX syntax
 * - Shadow DOM encapsulation
 */

import { Component, State, h, Listen } from '@stencil/core';
import { Todo, FilterType, TodoStats } from '../../utils/types';
import { loadTodos, saveTodos, generateId } from '../../utils/storage';

@Component({
  tag: 'todo-app',
  styleUrl: 'todo-app.css',
  shadow: true, // Enable Shadow DOM for style encapsulation
})
export class TodoApp {
  /**
   * @State decorator makes this property reactive
   * When todos changes, the component automatically re-renders
   * Similar to React's useState but as a class property
   */
  @State() todos: Todo[] = [];

  @State() filter: FilterType = 'all';

  /**
   * componentWillLoad - Stencil Lifecycle Method
   *
   * Runs once before the component is rendered
   * Perfect for loading initial data from localStorage
   *
   * Other lifecycle methods:
   * - componentWillLoad: before first render
   * - componentDidLoad: after first render
   * - componentWillUpdate: before re-render
   * - componentDidUpdate: after re-render
   * - disconnectedCallback: when removed from DOM
   */
  componentWillLoad() {
    this.todos = loadTodos();
  }

  /**
   * @Listen decorator - Event Handling
   *
   * Listens for custom events from child components
   * Stencil's type-safe way to handle component communication
   */
  @Listen('todoAdd')
  handleAddTodo(event: CustomEvent<string>) {
    const text = event.detail.trim();
    if (!text) return;

    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
    };

    this.todos = [...this.todos, newTodo];
    saveTodos(this.todos);
  }

  @Listen('todoToggle')
  handleToggleTodo(event: CustomEvent<string>) {
    const id = event.detail;
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(this.todos);
  }

  @Listen('todoDelete')
  handleDeleteTodo(event: CustomEvent<string>) {
    const id = event.detail;
    this.todos = this.todos.filter(todo => todo.id !== id);
    saveTodos(this.todos);
  }

  @Listen('todoEdit')
  handleEditTodo(event: CustomEvent<{ id: string; text: string }>) {
    const { id, text } = event.detail;
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    );
    saveTodos(this.todos);
  }

  /**
   * Filter todos based on current filter state
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
   * Calculate statistics
   */
  private getStats(): TodoStats {
    return {
      total: this.todos.length,
      active: this.todos.filter(t => !t.completed).length,
      completed: this.todos.filter(t => t.completed).length,
    };
  }

  /**
   * Clear all completed todos
   */
  private clearCompleted = () => {
    this.todos = this.todos.filter(todo => !todo.completed);
    saveTodos(this.todos);
  };

  /**
   * render() - Stencil Render Method
   *
   * Returns JSX (like React) but compiles to optimized web components
   * Virtual DOM diffing for efficient updates
   * Supports all standard JSX features
   */
  render() {
    const filteredTodos = this.getFilteredTodos();
    const stats = this.getStats();

    return (
      <div class="todo-app">
        <header class="app-header">
          <h1>
            <span class="icon">✓</span>
            Stencil Todos
          </h1>
          <p class="subtitle">
            Web Components Compiler with Virtual DOM
          </p>
        </header>

        <main class="app-main">
          {/* Child components receive props and emit events */}
          <todo-input />

          {this.todos.length > 0 && (
            <div class="controls">
              <div class="filter-buttons">
                <button
                  class={this.filter === 'all' ? 'active' : ''}
                  onClick={() => (this.filter = 'all')}
                >
                  All ({stats.total})
                </button>
                <button
                  class={this.filter === 'active' ? 'active' : ''}
                  onClick={() => (this.filter = 'active')}
                >
                  Active ({stats.active})
                </button>
                <button
                  class={this.filter === 'completed' ? 'active' : ''}
                  onClick={() => (this.filter = 'completed')}
                >
                  Completed ({stats.completed})
                </button>
              </div>

              {stats.completed > 0 && (
                <button class="clear-completed" onClick={this.clearCompleted}>
                  Clear Completed
                </button>
              )}
            </div>
          )}

          <todo-list todos={filteredTodos} />

          {this.todos.length === 0 && (
            <div class="empty-state">
              <p>No todos yet. Add one above to get started!</p>
            </div>
          )}
        </main>

        <footer class="app-footer">
          <div class="stats">
            <span class="stat">
              <strong>{stats.total}</strong> total
            </span>
            <span class="stat">
              <strong>{stats.active}</strong> active
            </span>
            <span class="stat">
              <strong>{stats.completed}</strong> completed
            </span>
          </div>
          <p class="tech-info">
            Built with <strong>Stencil</strong> - TypeScript + JSX + Virtual DOM → Web Components
          </p>
        </footer>
      </div>
    );
  }
}
