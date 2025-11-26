import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-item" [class.completed]="todo.completed">
      <input
        type="checkbox"
        [checked]="todo.completed"
        (change)="onToggle()"
        class="checkbox"
      />

      <div class="todo-content" *ngIf="!isEditing" (dblclick)="startEdit()">
        <span class="todo-text">{{ todo.text }}</span>
      </div>

      <input
        *ngIf="isEditing"
        type="text"
        [(ngModel)]="editText"
        (blur)="saveEdit()"
        (keyup.enter)="saveEdit()"
        (keyup.escape)="cancelEdit()"
        class="edit-input"
        #editInput
      />

      <button (click)="onDelete()" class="delete-btn" title="Delete">
        ✕
      </button>
    </div>
  `,
  styles: [`
    .todo-item {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      background: white;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .todo-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .todo-item.completed {
      opacity: 0.6;
      background: #f8f9fa;
    }

    .checkbox {
      width: 20px;
      height: 20px;
      margin-right: 15px;
      cursor: pointer;
      accent-color: #667eea;
    }

    .todo-content {
      flex: 1;
      cursor: pointer;
    }

    .todo-text {
      font-size: 16px;
      color: #2c3e50;
    }

    .todo-item.completed .todo-text {
      text-decoration: line-through;
      color: #95a5a6;
    }

    .edit-input {
      flex: 1;
      padding: 8px 12px;
      border: 2px solid #667eea;
      border-radius: 4px;
      font-size: 16px;
      margin-right: 10px;
    }

    .delete-btn {
      background: #e74c3c;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .todo-item:hover .delete-btn {
      opacity: 1;
    }

    .delete-btn:hover {
      background: #c0392b;
    }
  `],
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string; text: string }>();
  @Output() delete = new EventEmitter<string>();

  isEditing = false;
  editText = '';

  onToggle(): void {
    this.toggle.emit(this.todo.id);
  }

  onDelete(): void {
    this.delete.emit(this.todo.id);
  }

  startEdit(): void {
    this.isEditing = true;
    this.editText = this.todo.text;
  }

  saveEdit(): void {
    if (this.editText.trim() && this.editText !== this.todo.text) {
      this.update.emit({ id: this.todo.id, text: this.editText.trim() });
    }
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editText = '';
  }
}
