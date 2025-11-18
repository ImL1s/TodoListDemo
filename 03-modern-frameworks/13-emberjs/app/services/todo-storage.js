import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';

/**
 * TodoStorage Service
 *
 * Services in Ember are singleton objects that can be injected into routes, controllers, and components.
 * This service manages the todo list data and persistence to localStorage.
 *
 * Key Ember concepts demonstrated:
 * - Services for shared state and logic
 * - Tracked properties for reactivity
 * - TrackedArray for reactive arrays
 * - localStorage integration
 */
export default class TodoStorageService extends Service {
  /**
   * Storage key for localStorage
   */
  storageKey = 'ember-todos';

  /**
   * Tracked array of todos
   * TrackedArray is used instead of regular array to ensure reactivity
   */
  @tracked todos = new TrackedArray([]);

  /**
   * Constructor - loads todos from localStorage
   */
  constructor() {
    super(...arguments);
    this.loadTodos();
  }

  /**
   * Load todos from localStorage
   */
  loadTodos() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.todos = new TrackedArray(parsed);
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      this.todos = new TrackedArray([]);
    }
  }

  /**
   * Save todos to localStorage
   */
  saveTodos() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }

  /**
   * Add a new todo
   */
  addTodo(text) {
    const newTodo = {
      id: this.generateId(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.todos.push(newTodo);
    this.saveTodos();
  }

  /**
   * Toggle a todo's completed status
   */
  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      // Create a new array reference to trigger reactivity
      this.todos = new TrackedArray([...this.todos]);
      this.saveTodos();
    }
  }

  /**
   * Delete a todo
   */
  deleteTodo(id) {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.saveTodos();
    }
  }

  /**
   * Update a todo's text
   */
  updateTodo(id, newText) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.text = newText;
      // Create a new array reference to trigger reactivity
      this.todos = new TrackedArray([...this.todos]);
      this.saveTodos();
    }
  }

  /**
   * Toggle all todos (complete or uncomplete all)
   */
  toggleAll() {
    const hasIncomplete = this.todos.some((todo) => !todo.completed);

    this.todos.forEach((todo) => {
      todo.completed = hasIncomplete;
    });

    // Create a new array reference to trigger reactivity
    this.todos = new TrackedArray([...this.todos]);
    this.saveTodos();
  }

  /**
   * Clear all completed todos
   */
  clearCompleted() {
    this.todos = new TrackedArray(this.todos.filter((todo) => !todo.completed));
    this.saveTodos();
  }

  /**
   * Generate a unique ID for a todo
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
