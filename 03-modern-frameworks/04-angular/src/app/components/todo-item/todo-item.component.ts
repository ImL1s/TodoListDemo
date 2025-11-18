/**
 * Todo Item Component
 *
 * Standalone component for displaying and editing individual todo items.
 * Demonstrates Angular 17+ features:
 * - Standalone component with inputs/outputs
 * - Event handling
 * - Conditional rendering with @if/@else
 * - CSS animations
 */

import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-item" [class.completed]="todo.completed">
      <div class="todo-content">
        <input
          type="checkbox"
          [checked]="todo.completed"
          (change)="onToggle()"
          class="todo-checkbox"
          [id]="'todo-' + todo.id"
        />
        <label [for]="'todo-' + todo.id" class="checkbox-label"></label>

        @if (isEditing()) {
          <input
            type="text"
            [(ngModel)]="editText"
            (keyup.enter)="handleSave()"
            (keyup.escape)="handleCancel()"
            (blur)="handleSave()"
            class="edit-input"
            #editInput
          />
        } @else {
          <span
            class="todo-text"
            (dblclick)="handleEdit()"
            [title]="'Double-click to edit'"
          >
            {{ todo.text }}
          </span>
        }
      </div>

      <div class="todo-actions">
        @if (!isEditing()) {
          <button
            (click)="handleEdit()"
            class="action-button edit-button"
            title="Edit todo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M11.334 2A2.667 2.667 0 0 1 14 4.667L13.333 5.333l-4-4L10 .667A2.667 2.667 0 0 1 12.667 0a2.667 2.667 0 0 1 1.886.781l.114.114A2.667 2.667 0 0 1 14.667 3.333v.114zM0 12.667V16h3.333l9.334-9.333-3.334-3.334z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            (click)="onDelete()"
            class="action-button delete-button"
            title="Delete todo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                fill="currentColor"
              />
              <path
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                fill="currentColor"
              />
            </svg>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .todo-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: white;
      border-radius: 12px;
      margin-bottom: 10px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .todo-item:hover {
      border-color: rgba(139, 92, 246, 0.2);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .todo-item.completed {
      opacity: 0.7;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    }

    .todo-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
    }

    .todo-checkbox {
      appearance: none;
      width: 0;
      height: 0;
      position: absolute;
    }

    .checkbox-label {
      width: 24px;
      height: 24px;
      border: 2px solid #8b5cf6;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .checkbox-label::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      width: 12px;
      height: 12px;
      background: #8b5cf6;
      border-radius: 3px;
      transition: transform 0.2s ease;
    }

    .todo-checkbox:checked + .checkbox-label::after {
      transform: translate(-50%, -50%) scale(1);
    }

    .checkbox-label:hover {
      border-color: #6d28d9;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }

    .todo-text {
      flex: 1;
      color: #333;
      font-size: 15px;
      line-height: 1.5;
      word-break: break-word;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s ease;
    }

    .todo-item.completed .todo-text {
      text-decoration: line-through;
      color: #9ca3af;
    }

    .edit-input {
      flex: 1;
      padding: 8px 12px;
      border: 2px solid #8b5cf6;
      border-radius: 8px;
      font-size: 15px;
      outline: none;
      background: white;
    }

    .todo-actions {
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .todo-item:hover .todo-actions {
      opacity: 1;
    }

    .action-button {
      padding: 8px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
    }

    .edit-button {
      color: #3b82f6;
    }

    .edit-button:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    .delete-button {
      color: #ef4444;
    }

    .delete-button:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    @media (max-width: 480px) {
      .todo-actions {
        opacity: 1;
      }

      .action-button {
        padding: 6px;
      }

      .action-button svg {
        width: 14px;
        height: 14px;
      }
    }
  `]
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() toggle = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<string>();

  private isEditingSignal = signal(false);
  readonly isEditing = this.isEditingSignal.asReadonly();

  editText = '';

  onToggle(): void {
    this.toggle.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }

  handleEdit(): void {
    this.editText = this.todo.text;
    this.isEditingSignal.set(true);
  }

  handleSave(): void {
    const trimmedText = this.editText.trim();
    if (trimmedText && trimmedText !== this.todo.text) {
      this.edit.emit(trimmedText);
    }
    this.isEditingSignal.set(false);
  }

  handleCancel(): void {
    this.isEditingSignal.set(false);
    this.editText = this.todo.text;
  }
}
