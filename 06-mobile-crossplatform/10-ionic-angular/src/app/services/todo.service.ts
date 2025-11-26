import { Injectable, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, map, combineLatest } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
import { Todo, TodoFilter, TodoStats } from '../models/todo.interface';

/**
 * TodoService
 *
 * Central service for managing todo items using Angular Signals (Angular 17+)
 * and Capacitor Preferences API for persistent storage.
 *
 * Features:
 * - CRUD operations for todos
 * - Angular Signals for reactive state management
 * - RxJS observables for backward compatibility
 * - Persistent storage using Capacitor Preferences
 * - Filter support (all, active, completed)
 * - Statistics computation
 * - Error handling with user feedback
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'ionic-angular-todos';

  // Angular Signals (Modern approach - Angular 17+)
  private todosSignal = signal<Todo[]>([]);
  private filterSignal = signal<TodoFilter>('all');
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public signals for components
  public readonly todos = this.todosSignal.asReadonly();
  public readonly filter = this.filterSignal.asReadonly();
  public readonly isLoading = this.isLoadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();

  // Computed signals (automatically update when dependencies change)
  public readonly filteredTodos = computed(() => {
    const todos = this.todosSignal();
    const filter = this.filterSignal();
    return this.applyFilter(todos, filter);
  });

  public readonly stats = computed(() => {
    const todos = this.todosSignal();
    return this.calculateStats(todos);
  });

  // BehaviorSubject for RxJS compatibility (if needed)
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  private filterSubject = new BehaviorSubject<TodoFilter>('all');

  // Observable streams for components that prefer RxJS
  public todos$: Observable<Todo[]> = this.todosSubject.asObservable();
  public filter$: Observable<TodoFilter> = this.filterSubject.asObservable();

  public filteredTodos$: Observable<Todo[]> = combineLatest([
    this.todos$,
    this.filter$
  ]).pipe(
    map(([todos, filter]) => this.applyFilter(todos, filter))
  );

  public stats$: Observable<TodoStats> = this.todos$.pipe(
    map(todos => this.calculateStats(todos))
  );

  constructor(private toastController: ToastController) {
    this.loadTodos();
  }

  /**
   * Show toast message
   */
  private async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Update both Signals and BehaviorSubjects
   */
  private updateTodos(todos: Todo[]): void {
    this.todosSignal.set(todos);
    this.todosSubject.next(todos);
  }

  /**
   * Load todos from persistent storage
   */
  private async loadTodos(): Promise<void> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      if (value) {
        const todos: Todo[] = JSON.parse(value);
        this.updateTodos(todos);
      }
    } catch (error) {
      const errorMessage = 'Failed to load todos from storage';
      console.error(errorMessage, error);
      this.errorSignal.set(errorMessage);
      await this.showToast(errorMessage, 'danger');
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  /**
   * Save todos to persistent storage
   */
  private async saveTodos(todos: Todo[]): Promise<boolean> {
    try {
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(todos)
      });
      return true;
    } catch (error) {
      const errorMessage = 'Failed to save todos';
      console.error(errorMessage, error);
      this.errorSignal.set(errorMessage);
      await this.showToast(errorMessage, 'danger');
      return false;
    }
  }

  /**
   * Get current todos value (synchronous)
   */
  private getCurrentTodos(): Todo[] {
    return this.todosSignal();
  }

  /**
   * Add a new todo item
   */
  async addTodo(text: string): Promise<void> {
    const trimmedText = text.trim();
    if (!trimmedText) {
      await this.showToast('Please enter a todo text', 'warning');
      return;
    }

    const newTodo: Todo = {
      id: this.generateId(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now()
    };

    const updatedTodos = [...this.getCurrentTodos(), newTodo];
    this.updateTodos(updatedTodos);

    const saved = await this.saveTodos(updatedTodos);
    if (saved) {
      await this.showToast('Todo added successfully');
    }
  }

  /**
   * Toggle the completed status of a todo
   */
  async toggleTodo(id: string): Promise<void> {
    const updatedTodos = this.getCurrentTodos().map(todo =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            updatedAt: Date.now()
          }
        : todo
    );

    this.updateTodos(updatedTodos);
    await this.saveTodos(updatedTodos);
  }

  /**
   * Delete a todo item
   */
  async deleteTodo(id: string): Promise<void> {
    const updatedTodos = this.getCurrentTodos().filter(todo => todo.id !== id);
    this.updateTodos(updatedTodos);

    const saved = await this.saveTodos(updatedTodos);
    if (saved) {
      await this.showToast('Todo deleted');
    }
  }

  /**
   * Update the text of a todo item
   */
  async updateTodo(id: string, text: string): Promise<void> {
    const trimmedText = text.trim();
    if (!trimmedText) {
      await this.showToast('Todo text cannot be empty', 'warning');
      return;
    }

    const updatedTodos = this.getCurrentTodos().map(todo =>
      todo.id === id
        ? {
            ...todo,
            text: trimmedText,
            updatedAt: Date.now()
          }
        : todo
    );

    this.updateTodos(updatedTodos);

    const saved = await this.saveTodos(updatedTodos);
    if (saved) {
      await this.showToast('Todo updated');
    }
  }

  /**
   * Clear all completed todos
   */
  async clearCompleted(): Promise<void> {
    const completedCount = this.getCurrentTodos().filter(todo => todo.completed).length;
    if (completedCount === 0) {
      await this.showToast('No completed todos to clear', 'warning');
      return;
    }

    const updatedTodos = this.getCurrentTodos().filter(todo => !todo.completed);
    this.updateTodos(updatedTodos);

    const saved = await this.saveTodos(updatedTodos);
    if (saved) {
      await this.showToast(`Cleared ${completedCount} completed todo${completedCount > 1 ? 's' : ''}`);
    }
  }

  /**
   * Toggle all todos to completed or active
   */
  async toggleAll(completed: boolean): Promise<void> {
    const updatedTodos = this.getCurrentTodos().map(todo => ({
      ...todo,
      completed,
      updatedAt: Date.now()
    }));

    this.updateTodos(updatedTodos);

    const saved = await this.saveTodos(updatedTodos);
    if (saved) {
      const action = completed ? 'completed' : 'activated';
      await this.showToast(`All todos ${action}`);
    }
  }

  /**
   * Set the current filter
   */
  setFilter(filter: TodoFilter): void {
    this.filterSignal.set(filter);
    this.filterSubject.next(filter);
  }

  /**
   * Apply filter to todos
   */
  private applyFilter(todos: Todo[], filter: TodoFilter): Todo[] {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }

  /**
   * Calculate statistics for todos
   */
  private calculateStats(todos: Todo[]): TodoStats {
    return {
      total: todos.length,
      active: todos.filter(todo => !todo.completed).length,
      completed: todos.filter(todo => todo.completed).length
    };
  }

  /**
   * Generate a unique ID for a todo item
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all todos
   */
  async clearAll(): Promise<void> {
    this.updateTodos([]);

    const saved = await this.saveTodos([]);
    if (saved) {
      await this.showToast('All todos cleared');
    }
  }

  /**
   * Refresh todos from storage (useful for pull-to-refresh)
   */
  async refresh(): Promise<void> {
    await this.loadTodos();
  }

  /**
   * Get loading state (for signals)
   */
  public getLoadingState(): boolean {
    return this.isLoadingSignal();
  }

  /**
   * Get error state (for signals)
   */
  public getError(): string | null {
    return this.errorSignal();
  }

  /**
   * Clear error state
   */
  public clearError(): void {
    this.errorSignal.set(null);
  }
}
