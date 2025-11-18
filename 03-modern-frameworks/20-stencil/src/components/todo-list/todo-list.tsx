/**
 * TodoList Component - List Container
 *
 * Stencil Features:
 * - @Prop with array/object types
 * - Event bubbling (child events bubble up)
 * - List rendering with map()
 * - Key prop for efficient rendering
 * - Slot-based composition (optional)
 */

import { Component, Prop, h } from '@stencil/core';
import { Todo } from '../../utils/types';

@Component({
  tag: 'todo-list',
  styles: `
    :host {
      display: block;
    }

    .todo-list {
      background: white;
    }

    .empty-list {
      padding: 3rem 2rem;
      text-align: center;
      color: #9ca3af;
    }

    .empty-list p {
      font-size: 1.125rem;
      margin: 0;
    }

    .list-header {
      padding: 1rem 1.5rem;
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
      font-weight: 600;
      color: #6b7280;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `,
  shadow: true,
})
export class TodoList {
  /**
   * @Prop - Array of Todos
   *
   * Complex prop types are fully supported
   * Stencil handles change detection automatically
   */
  @Prop() todos: Todo[] = [];

  /**
   * Render list with virtual DOM optimization
   *
   * Stencil uses Virtual DOM (like React) for efficient updates:
   * - Only changed elements are updated in the real DOM
   * - Key prop helps identify which items changed
   * - Minimal DOM operations for better performance
   */
  render() {
    if (this.todos.length === 0) {
      return (
        <div class="todo-list">
          <div class="empty-list">
            <p>No todos to display</p>
          </div>
        </div>
      );
    }

    return (
      <div class="todo-list">
        <div class="list-header">
          {this.todos.length} {this.todos.length === 1 ? 'Item' : 'Items'}
        </div>
        {this.todos.map(todo => (
          /**
           * Key prop for list rendering optimization
           * Helps Stencil identify which items changed
           */
          <todo-item key={todo.id} todo={todo} />
        ))}
      </div>
    );
  }
}
