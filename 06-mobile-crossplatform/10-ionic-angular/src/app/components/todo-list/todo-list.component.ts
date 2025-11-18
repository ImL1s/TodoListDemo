import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoFilter, TodoStats } from '../../models/todo.interface';
import { TodoItemComponent } from '../todo-item/todo-item.component';

/**
 * TodoListComponent
 *
 * Container component that displays the list of todos and provides
 * filtering and bulk operations.
 *
 * Features:
 * - Displays filtered todo list
 * - Filter buttons (All, Active, Completed)
 * - Bulk operations (Clear completed, Toggle all)
 * - Statistics display
 * - Empty state messaging
 * - Virtual scrolling for performance with large lists
 */
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TodoItemComponent]
})
export class TodoListComponent implements OnInit {
  todos$!: Observable<Todo[]>;
  stats$!: Observable<TodoStats>;
  currentFilter$!: Observable<TodoFilter>;
  currentFilter: TodoFilter = 'all';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todos$ = this.todoService.filteredTodos$;
    this.stats$ = this.todoService.stats$;
    this.currentFilter$ = this.todoService.filter$;

    // Subscribe to filter changes
    this.currentFilter$.subscribe(filter => {
      this.currentFilter = filter;
    });
  }

  /**
   * Toggle a todo's completed status
   */
  async onToggleTodo(id: string): Promise<void> {
    await this.todoService.toggleTodo(id);
  }

  /**
   * Delete a todo
   */
  async onDeleteTodo(id: string): Promise<void> {
    await this.todoService.deleteTodo(id);
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
    await this.todoService.clearCompleted();
  }

  /**
   * Toggle all todos
   */
  async toggleAll(stats: TodoStats): Promise<void> {
    const shouldComplete = stats.active > 0;
    await this.todoService.toggleAll(shouldComplete);
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
    switch (this.currentFilter) {
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
    switch (this.currentFilter) {
      case 'active':
        return 'All your todos are completed!';
      case 'completed':
        return 'Complete some todos to see them here';
      default:
        return 'Add a new todo to get started';
    }
  }
}
