import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterType } from '../models/todo.model';

@Component({
  selector: 'app-todo-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-container">
      <div class="stats">
        <span class="stat-item">
          <strong>{{ totalCount }}</strong> 個任務
        </span>
        <span class="stat-item">
          <strong>{{ activeCount }}</strong> 進行中
        </span>
        <span class="stat-item">
          <strong>{{ completedCount }}</strong> 已完成
        </span>
      </div>

      <div class="filters">
        <button
          *ngFor="let f of filters"
          [class.active]="currentFilter === f.value"
          (click)="onFilterChange(f.value)"
          class="filter-btn"
        >
          {{ f.label }}
        </button>
      </div>

      <button
        *ngIf="hasCompleted"
        (click)="onClearCompleted()"
        class="clear-btn"
      >
        清除已完成
      </button>
    </div>
  `,
  styles: [`
    .filter-container {
      background: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }

    .stats {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .stat-item {
      font-size: 14px;
      color: #7f8c8d;
    }

    .stat-item strong {
      color: #2c3e50;
      margin-right: 4px;
    }

    .filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 8px 16px;
      background: #ecf0f1;
      border-radius: 20px;
      font-size: 14px;
      color: #7f8c8d;
      transition: all 0.3s ease;
    }

    .filter-btn:hover {
      background: #bdc3c7;
      color: #2c3e50;
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: bold;
    }

    .clear-btn {
      padding: 8px 16px;
      background: #e74c3c;
      color: white;
      border-radius: 20px;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .clear-btn:hover {
      background: #c0392b;
    }

    @media (max-width: 768px) {
      .filter-container {
        flex-direction: column;
        align-items: stretch;
      }

      .stats,
      .filters {
        justify-content: center;
      }
    }
  `],
})
export class TodoFilterComponent {
  @Input() currentFilter: FilterType = 'all';
  @Input() totalCount = 0;
  @Input() activeCount = 0;
  @Input() completedCount = 0;
  @Input() hasCompleted = false;

  @Output() filterChange = new EventEmitter<FilterType>();
  @Output() clearCompleted = new EventEmitter<void>();

  filters = [
    { value: 'all' as FilterType, label: '全部' },
    { value: 'active' as FilterType, label: '進行中' },
    { value: 'completed' as FilterType, label: '已完成' },
  ];

  onFilterChange(filter: FilterType): void {
    this.filterChange.emit(filter);
  }

  onClearCompleted(): void {
    this.clearCompleted.emit();
  }
}
