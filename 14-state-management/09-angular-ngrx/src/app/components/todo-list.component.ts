import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo, FilterType } from '../models/todo.model';
import * as TodoActions from '../store/actions/todo.actions';
import * as TodoSelectors from '../store/selectors/todo.selectors';
import { TodoItemComponent } from './todo-item.component';
import { TodoFilterComponent } from './todo-filter.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent, TodoFilterComponent],
  template: `
    <div class="todo-container">
      <header class="header">
        <h1>NgRx Todo List</h1>
        <p class="subtitle">使用 Angular 17 + NgRx + Entity Adapter</p>
      </header>

      <div class="add-todo">
        <input
          type="text"
          [(ngModel)]="newTodoText"
          (keyup.enter)="addTodo()"
          placeholder="輸入新任務..."
          class="todo-input"
        />
        <button (click)="addTodo()" class="add-btn">
          新增
        </button>
      </div>

      <app-todo-filter
        [currentFilter]="(filter$ | async) || 'all'"
        [totalCount]="(totalCount$ | async) || 0"
        [activeCount]="(activeCount$ | async) || 0"
        [completedCount]="(completedCount$ | async) || 0"
        [hasCompleted]="(hasCompleted$ | async) || false"
        (filterChange)="setFilter($event)"
        (clearCompleted)="clearCompleted()"
      ></app-todo-filter>

      <div class="todos-list">
        <app-todo-item
          *ngFor="let todo of filteredTodos$ | async; trackBy: trackById"
          [todo]="todo"
          (toggle)="toggleTodo($event)"
          (update)="updateTodo($event.id, $event.text)"
          (delete)="deleteTodo($event)"
        ></app-todo-item>

        <div *ngIf="(filteredTodos$ | async)?.length === 0" class="empty-state">
          <p>{{ getEmptyMessage() }}</p>
        </div>
      </div>

      <footer class="footer">
        <p>雙擊任務可以編輯</p>
        <p>資料已自動儲存至 LocalStorage</p>
      </footer>
    </div>
  `,
  styles: [`
    .todo-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      color: white;
    }

    .header h1 {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .subtitle {
      font-size: 16px;
      opacity: 0.9;
    }

    .add-todo {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .todo-input {
      flex: 1;
      padding: 15px 20px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .add-btn {
      padding: 15px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .add-btn:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .todos-list {
      margin-top: 20px;
      min-height: 200px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: white;
      font-size: 18px;
      opacity: 0.8;
    }

    .footer {
      text-align: center;
      margin-top: 30px;
      color: white;
      opacity: 0.8;
      font-size: 14px;
    }

    .footer p {
      margin: 5px 0;
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: 36px;
      }

      .add-todo {
        flex-direction: column;
      }

      .add-btn {
        width: 100%;
      }
    }
  `],
})
export class TodoListComponent implements OnInit {
  newTodoText = '';

  // Observables from store
  filteredTodos$: Observable<Todo[]>;
  filter$: Observable<FilterType>;
  totalCount$: Observable<number>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;
  hasCompleted$: Observable<boolean>;

  constructor(private store: Store) {
    this.filteredTodos$ = this.store.select(TodoSelectors.selectFilteredTodos);
    this.filter$ = this.store.select(TodoSelectors.selectFilter);
    this.totalCount$ = this.store.select(TodoSelectors.selectTotalTodos);
    this.activeCount$ = this.store.select(TodoSelectors.selectActiveTodosCount);
    this.completedCount$ = this.store.select(TodoSelectors.selectCompletedTodosCount);
    this.hasCompleted$ = this.store.select(TodoSelectors.selectHasCompletedTodos);
  }

  ngOnInit(): void {
    // Load todos from localStorage on init
    this.store.dispatch(TodoActions.loadTodos());
  }

  addTodo(): void {
    if (this.newTodoText.trim()) {
      this.store.dispatch(TodoActions.addTodo({ text: this.newTodoText.trim() }));
      this.newTodoText = '';
    }
  }

  toggleTodo(id: string): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  updateTodo(id: string, text: string): void {
    this.store.dispatch(TodoActions.updateTodo({ id, text }));
  }

  deleteTodo(id: string): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  setFilter(filter: FilterType): void {
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }

  clearCompleted(): void {
    this.store.dispatch(TodoActions.clearCompleted());
  }

  trackById(index: number, todo: Todo): string {
    return todo.id;
  }

  getEmptyMessage(): string {
    let filter: FilterType = 'all';
    this.filter$.subscribe(f => filter = f).unsubscribe();

    switch (filter) {
      case 'active':
        return '沒有進行中的任務';
      case 'completed':
        return '沒有已完成的任務';
      default:
        return '還沒有任務，快來新增一個吧！';
    }
  }
}
