/**
 * TodoList Component
 *
 * Demonstrates SolidJS's For component for efficient list rendering.
 * For is keyed by reference by default, making it highly efficient.
 *
 * Key concepts:
 * - For component: Optimized list rendering
 * - Reference-based keying: More efficient than React's key prop
 * - Fine-grained updates: Only changed items re-render
 * - Show component: Conditional rendering for empty state
 */

import { For, Show } from 'solid-js';
import TodoItem from './TodoItem';
import { getFilteredTodos } from '../store/todoStore';
import type { Component } from 'solid-js';

const TodoList: Component = () => {
  /**
   * Get filtered todos from the store
   *
   * This is a function call that accesses reactive state.
   * When used in JSX, it automatically becomes reactive.
   * The component will only re-run this when dependencies change.
   */
  const todos = () => getFilteredTodos();

  /**
   * For component for list rendering
   *
   * Unlike React's map(), For is keyed by reference by default.
   * This means SolidJS tracks the actual todo object, not a separate key.
   *
   * Benefits:
   * - No need for explicit keys (though you can provide them)
   * - More efficient diffing
   * - Referential equality checking
   * - Only changed items update
   *
   * The For component takes:
   * - each: The array to iterate over
   * - fallback: Content to show when array is empty (optional)
   * - children: Function that receives (item, index) and returns JSX
   */
  return (
    <div class="todo-list-container">
      <Show
        when={todos().length > 0}
        fallback={
          <div class="empty-state">
            <p>No todos yet. Add one above!</p>
          </div>
        }
      >
        <ul class="todo-list">
          <For each={todos()}>
            {(todo) => <TodoItem todo={todo} />}
          </For>
        </ul>
      </Show>
    </div>
  );
};

export default TodoList;
