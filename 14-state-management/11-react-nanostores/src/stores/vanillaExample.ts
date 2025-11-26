/**
 * Vanilla JavaScript Example with Nanostores
 *
 * This file demonstrates that Nanostores is completely framework-agnostic.
 * You can use these stores with vanilla JS, Vue, Svelte, Preact, or any framework!
 */

import { $todos, $filter, $sortedFilteredTodos, $stats, addTodo } from './todoStore';

/**
 * Subscribe to store changes in vanilla JavaScript
 * This demonstrates framework-agnostic usage
 */
export function setupVanillaListeners() {
  // Listen to todos changes
  const unsubscribeTodos = $todos.listen((todos) => {
    console.log('Todos changed (vanilla JS):', todos);
  });

  // Listen to filter changes
  const unsubscribeFilter = $filter.listen((filter) => {
    console.log('Filter changed (vanilla JS):', filter);
  });

  // Listen to computed stats
  const unsubscribeStats = $stats.listen((stats) => {
    console.log('Stats changed (vanilla JS):', stats);
  });

  // Return cleanup function
  return () => {
    unsubscribeTodos();
    unsubscribeFilter();
    unsubscribeStats();
  };
}

/**
 * Example: Manual DOM manipulation with Nanostores
 * You could use Nanostores without any framework at all!
 */
export function renderTodosToDOM(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Subscribe to filtered todos
  const unsubscribe = $sortedFilteredTodos.listen((todos) => {
    container.innerHTML = todos
      .map(
        (todo) => `
      <div class="todo-item">
        <input
          type="checkbox"
          ${todo.completed ? 'checked' : ''}
          onchange="toggleTodo('${todo.id}')"
        />
        <span style="${todo.completed ? 'text-decoration: line-through' : ''}">
          ${todo.text}
        </span>
      </div>
    `
      )
      .join('');
  });

  return unsubscribe;
}

/**
 * Example: Using Nanostores in Node.js or other environments
 * Nanostores works anywhere JavaScript runs!
 */
export function logTodoStats() {
  const stats = $stats.get(); // Get current value synchronously
  console.log(`
    📊 Todo Statistics:
    ==================
    Total: ${stats.total}
    Active: ${stats.active}
    Completed: ${stats.completed}
  `);
}

/**
 * Example: Batch operations
 */
export function addMultipleTodos(texts: string[]) {
  texts.forEach((text) => addTodo(text));
  console.log(`Added ${texts.length} todos`);
}
