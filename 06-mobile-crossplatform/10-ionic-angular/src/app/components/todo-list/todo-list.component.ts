import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { PlatformService } from '../../services/platform.service';
import { Todo, TodoFilter, TodoStats } from '../../models/todo.interface';
import { TodoItemComponent } from '../todo-item/todo-item.component';

/**
 * TodoListComponent
 *
 * Container component that displays the list of todos and provides
 * filtering and bulk operations.
 *
 * Features:
 * - Displays filtered todo list using Angular Signals
 * - Filter buttons (All, Active, Completed)
 * - Bulk operations (Clear completed, Toggle all)
 * - Statistics display
 * - Empty state messaging
 * - Pull-to-refresh functionality
 * - Loading indicators
 * - OnPush change detection for performance
 */
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TodoItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit, OnDestroy {
  // Using Signals (Angular 17+)
  protected todos = this.todoService.filteredTodos;
  protected stats = this.todoService.stats;
  protected currentFilter = this.todoService.filter;
  protected isLoading = this.todoService.isLoading;

  // RxJS observables for backward compatibility
  todos$!: Observable<Todo[]>;
  stats$!: Observable<TodoStats>;
  currentFilter$!: Observable<TodoFilter>;

  // Local state
  private destroy$ = new Subject<void>();

  constructor(
    protected todoService: TodoService,
    protected platformService: PlatformService
  ) {}

  ngOnInit(): void {
    // Initialize RxJS observables
    this.todos$ = this.todoService.filteredTodos$;
    this.stats$ = this.todoService.stats$;
    this.currentFilter$ = this.todoService.filter$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle a todo's completed status
   */
  async onToggleTodo(id: string): Promise<void> {
    await this.platformService.hapticImpact();
    await this.todoService.toggleTodo(id);
  }

  /**
   * Delete a todo
   */
  async onDeleteTodo(id: string): Promise<void> {
    const confirmed = await this.platformService.showConfirmAlert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      'Delete',
      'Cancel'
    );

    if (confirmed) {
      await this.platformService.hapticImpact();
      await this.todoService.deleteTodo(id);
    }
  }

  /**
   * Update a todo's text
   */
  async onUpdateTodo(event: { id: string; text: string }): Promise<void> {
    await this.todoService.updateTodo(event.id, event.text);
  }

  /**
   * Set the current filter
   */
  setFilter(filter: TodoFilter): void {
    this.todoService.setFilter(filter);
  }

  /**
   * Clear all completed todos
   */
  async clearCompleted(): Promise<void> {
    const confirmed = await this.platformService.showConfirmAlert(
      'Clear Completed',
      'Are you sure you want to clear all completed todos?',
      'Clear',
      'Cancel'
    );

    if (confirmed) {
      await this.todoService.clearCompleted();
    }
  }

  /**
   * Toggle all todos
   */
  async toggleAll(stats: TodoStats): Promise<void> {
    const shouldComplete = stats.active > 0;
    await this.todoService.toggleAll(shouldComplete);
  }

  /**
   * Handle pull-to-refresh
   */
  async handleRefresh(event: any): Promise<void> {
    await this.todoService.refresh();
    event.target.complete();
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByTodoId(index: number, todo: Todo): string {
    return todo.id;
  }

  /**
   * Get empty state message based on current filter
   */
  getEmptyMessage(): string {
    const filter = this.currentFilter();
    switch (filter) {
      case 'active':
        return 'No active todos';
      case 'completed':
        return 'No completed todos';
      default:
        return 'No todos yet';
    }
  }

  /**
   * Get empty state sub-message based on current filter
   */
  getEmptySubMessage(): string {
    const filter = this.currentFilter();
    switch (filter) {
      case 'active':
        return 'All your todos are completed!';
      case 'completed':
        return 'Complete some todos to see them here';
      default:
        return 'Add a new todo to get started';
    }
  }
}
