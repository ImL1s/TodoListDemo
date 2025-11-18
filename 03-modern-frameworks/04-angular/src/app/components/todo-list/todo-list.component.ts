/**
 * Todo List Component
 *
 * Standalone component that displays the list of todos with filtering.
 * Demonstrates Angular 17+ features:
 * - Standalone component
 * - Signal-based state management
 * - Computed values
 * - Control flow syntax (@if, @for, @empty)
 */

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { FilterType } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TodoItemComponent],
  template: `
    <div class="todo-list-container">
      <!-- Filter buttons -->
      <div class="filters">
        @for (filter of filters; track filter.value) {
          <button
            (click)="setFilter(filter.value)"
            [class.active]="todoService.filter() === filter.value"
            class="filter-button"
          >
            {{ filter.label }}
            @if (getFilterCount(filter.value) > 0) {
              <span class="filter-badge">{{ getFilterCount(filter.value) }}</span>
            }
          </button>
        }
      </div>

      <!-- Todo list -->
      <div class="todo-list">
        @if (todoService.filteredTodos().length > 0) {
          @for (todo of todoService.filteredTodos(); track todo.id) {
            <app-todo-item
              [todo]="todo"
              (toggle)="handleToggle(todo.id)"
              (delete)="handleDelete(todo.id)"
              (edit)="handleEdit(todo.id, $event)"
            />
          }
        } @else {
          <div class="empty-state">
            @if (todoService.todos().length === 0) {
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" class="empty-icon">
                <circle cx="32" cy="32" r="30" stroke="#e5e7eb" stroke-width="4"/>
                <path d="M32 20v24M20 32h24" stroke="#e5e7eb" stroke-width="4" stroke-linecap="round"/>
              </svg>
              <h3>No todos yet</h3>
              <p>Add your first todo to get started!</p>
            } @else {
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" class="empty-icon">
                <circle cx="32" cy="32" r="30" stroke="#8b5cf6" stroke-width="4"/>
                <path d="M20 32l8 8 16-16" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h3>No {{ todoService.filter() }} todos</h3>
              <p>Try a different filter to see more todos.</p>
            }
          </div>
        }
      </div>

      <!-- Footer with statistics and actions -->
      @if (todoService.todos().length > 0) {
        <div class="todo-footer">
          <div class="stats">
            <span class="stat-item">
              <strong>{{ todoService.stats().active }}</strong> active
            </span>
            <span class="stat-divider">•</span>
            <span class="stat-item">
              <strong>{{ todoService.stats().completed }}</strong> completed
            </span>
            <span class="stat-divider">•</span>
            <span class="stat-item">
              <strong>{{ todoService.stats().total }}</strong> total
            </span>
          </div>

          @if (todoService.hasCompletedTodos()) {
            <button
              (click)="handleClearCompleted()"
              class="clear-button"
            >
              Clear Completed
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .todo-list-container {
      width: 100%;
    }

    .filters {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      background: white;
      padding: 8px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .filter-button {
      flex: 1;
      padding: 10px 16px;
      border: 2px solid transparent;
      border-radius: 8px;
      background: transparent;
      color: #6b7280;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .filter-button:hover {
      background: rgba(139, 92, 246, 0.05);
      color: #8b5cf6;
    }

    .filter-button.active {
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .filter-badge {
      background: rgba(255, 255, 255, 0.3);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
    }

    .filter-button.active .filter-badge {
      background: rgba(255, 255, 255, 0.25);
    }

    .todo-list {
      min-height: 200px;
      max-height: 500px;
      overflow-y: auto;
      padding: 4px;
    }

    .todo-list::-webkit-scrollbar {
      width: 8px;
    }

    .todo-list::-webkit-scrollbar-track {
      background: rgba(139, 92, 246, 0.05);
      border-radius: 4px;
    }

    .todo-list::-webkit-scrollbar-thumb {
      background: rgba(139, 92, 246, 0.3);
      border-radius: 4px;
    }

    .todo-list::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.5);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      margin-bottom: 20px;
      opacity: 0.5;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .empty-state h3 {
      color: #374151;
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: #9ca3af;
      font-size: 14px;
      margin: 0;
    }

    .todo-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      margin-top: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .stats {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: #6b7280;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stat-item strong {
      color: #8b5cf6;
      font-weight: 700;
    }

    .stat-divider {
      color: #d1d5db;
    }

    .clear-button {
      padding: 8px 16px;
      background: transparent;
      color: #ef4444;
      border: 2px solid #ef4444;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .clear-button:hover {
      background: #ef4444;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .clear-button:active {
      transform: translateY(0);
    }

    @media (max-width: 480px) {
      .filters {
        flex-direction: column;
        gap: 6px;
      }

      .todo-footer {
        flex-direction: column;
        gap: 12px;
      }

      .stats {
        font-size: 13px;
      }

      .clear-button {
        width: 100%;
      }
    }
  `]
})
export class TodoListComponent {
  // Inject the TodoService using the new inject() function (Angular 14+)
  // This is an alternative to constructor injection
  todoService = inject(TodoService);

  filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' }
  ];

  setFilter(filter: FilterType): void {
    this.todoService.setFilter(filter);
  }

  getFilterCount(filter: FilterType): number {
    const stats = this.todoService.stats();
    switch (filter) {
      case 'all':
        return stats.total;
      case 'active':
        return stats.active;
      case 'completed':
        return stats.completed;
      default:
        return 0;
    }
  }

  handleToggle(id: string): void {
    this.todoService.toggleTodo(id);
  }

  handleDelete(id: string): void {
    this.todoService.deleteTodo(id);
  }

  handleEdit(id: string, newText: string): void {
    this.todoService.editTodo(id, newText);
  }

  handleClearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
