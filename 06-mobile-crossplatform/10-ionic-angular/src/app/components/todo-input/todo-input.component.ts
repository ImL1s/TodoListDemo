import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TodoService } from '../../services/todo.service';

/**
 * TodoInputComponent
 *
 * Standalone Angular component for adding new todo items.
 * Uses Ionic components and Angular's reactive forms.
 *
 * Features:
 * - Input field with Ionic styling
 * - Enter key support for quick addition
 * - Clear input after submission
 * - Haptic feedback on mobile devices
 */
@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class TodoInputComponent {
  newTodoText = '';

  constructor(private todoService: TodoService) {}

  /**
   * Add a new todo item
   */
  async addTodo(): Promise<void> {
    if (this.newTodoText.trim()) {
      await this.todoService.addTodo(this.newTodoText);
      this.newTodoText = '';
    }
  }

  /**
   * Handle Enter key press
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addTodo();
    }
  }
}
