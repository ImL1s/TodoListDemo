/**
 * Todo Service
 *
 * This service manages the todo list state using Angular Signals (Angular 17+).
 * Signals provide a reactive and efficient way to manage state in Angular applications.
 *
 * Key features:
 * - Uses Angular Signals for reactive state management
 * - Provides computed values that automatically update
 * - Handles localStorage persistence
 * - Fully typed with TypeScript
 */

import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo, FilterType, TodoStats } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'angular-todos';

  /**
   * Private signal containing all todos
   * This is the single source of truth for todo data
   */
  private todosSignal = signal<Todo[]>(this.loadFromStorage());

  /**
   * Public readonly signal for todos
   * Components can read this but cannot modify it directly
   */
  readonly todos = this.todosSignal.asReadonly();

  /**
   * Signal for the current filter
   */
  private filterSignal = signal<FilterType>('all');
  readonly filter = this.filterSignal.asReadonly();

  /**
   * Computed signal for filtered todos
   * Automatically recalculates when todos or filter changes
   */
  readonly filteredTodos = computed(() => {
    const todos = this.todosSignal();
    const filter = this.filterSignal();

    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  });

  /**
   * Computed signal for todo statistics
   * Provides counts for total, active, and completed todos
   */
  readonly stats = computed<TodoStats>(() => {
    const todos = this.todosSignal();
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    };
  });

  /**
   * Computed signal for whether there are any completed todos
   */
  readonly hasCompletedTodos = computed(() => this.stats().completed > 0);

  constructor() {
    /**
     * Effect to persist todos to localStorage whenever they change
     * This runs automatically when todosSignal changes
     */
    effect(() => {
      const todos = this.todosSignal();
      this.saveToStorage(todos);
    });
  }

  /**
   * Add a new todo
   * @param text - The text content of the todo
   */
  addTodo(text: string): void {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    const newTodo: Todo = {
      id: this.generateId(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now()
    };

    this.todosSignal.update(todos => [...todos, newTodo]);
  }

  /**
   * Toggle the completion status of a todo
   * @param id - The id of the todo to toggle
   */
  toggleTodo(id: string): void {
    this.todosSignal.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  /**
   * Delete a todo
   * @param id - The id of the todo to delete
   */
  deleteTodo(id: string): void {
    this.todosSignal.update(todos => todos.filter(todo => todo.id !== id));
  }

  /**
   * Edit a todo's text
   * @param id - The id of the todo to edit
   * @param newText - The new text content
   */
  editTodo(id: string, newText: string): void {
    const trimmedText = newText.trim();
    if (!trimmedText) {
      return;
    }

    this.todosSignal.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, text: trimmedText } : todo
      )
    );
  }

  /**
   * Clear all completed todos
   */
  clearCompleted(): void {
    this.todosSignal.update(todos => todos.filter(todo => !todo.completed));
  }

  /**
   * Set the current filter
   * @param filter - The filter type to apply
   */
  setFilter(filter: FilterType): void {
    this.filterSignal.set(filter);
  }

  /**
   * Toggle all todos to the same completion status
   * If all are completed, uncomplete them all
   * Otherwise, complete them all
   */
  toggleAll(): void {
    const allCompleted = this.todosSignal().every(todo => todo.completed);
    this.todosSignal.update(todos =>
      todos.map(todo => ({ ...todo, completed: !allCompleted }))
    );
  }

  /**
   * Generate a unique ID for a todo
   * @returns A unique string ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load todos from localStorage
   * @returns Array of todos from storage or empty array
   */
  private loadFromStorage(): Todo[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading todos from storage:', error);
      return [];
    }
  }

  /**
   * Save todos to localStorage
   * @param todos - Array of todos to save
   */
  private saveToStorage(todos: Todo[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to storage:', error);
    }
  }
}
