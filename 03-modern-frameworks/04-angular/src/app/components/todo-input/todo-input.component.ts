/**
 * Todo Input Component
 *
 * Standalone component for adding new todos.
 * Demonstrates Angular 17+ features:
 * - Standalone component (no NgModule needed)
 * - Two-way data binding with [(ngModel)]
 * - Dependency injection
 * - Template-driven forms
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-container">
      <input
        type="text"
        [(ngModel)]="inputValue"
        (keyup.enter)="handleSubmit()"
        [placeholder]="placeholder()"
        class="todo-input"
        [class.error]="showError()"
        maxlength="200"
        #todoInput
      />
      <button
        (click)="handleSubmit()"
        class="add-button"
        [disabled]="!inputValue.trim()"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 4V16M4 10H16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        Add
      </button>
    </div>
    @if (showError()) {
      <div class="error-message">
        {{ errorMessage() }}
      </div>
    }
  `,
  styles: [`
    .input-container {
      display: flex;
      gap: 12px;
      margin-bottom: 8px;
    }

    .todo-input {
      flex: 1;
      padding: 14px 20px;
      border: 2px solid rgba(139, 92, 246, 0.2);
      border-radius: 12px;
      font-size: 15px;
      transition: all 0.3s ease;
      background: white;
      color: #333;
    }

    .todo-input:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }

    .todo-input.error {
      border-color: #ef4444;
    }

    .todo-input::placeholder {
      color: #9ca3af;
    }

    .add-button {
      padding: 14px 28px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .add-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
    }

    .add-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .add-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }

    .error-message {
      color: #ef4444;
      font-size: 13px;
      margin-top: -4px;
      margin-left: 4px;
      animation: shake 0.3s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    @media (max-width: 480px) {
      .input-container {
        flex-direction: column;
      }

      .add-button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class TodoInputComponent {
  // Component state using signals
  inputValue = '';
  private showErrorSignal = signal(false);
  private errorMessageSignal = signal('');

  // Expose signals as readonly
  readonly showError = this.showErrorSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();

  // Computed placeholder that updates based on stats
  readonly placeholder = signal('What needs to be done?');

  constructor(private todoService: TodoService) {}

  /**
   * Handle form submission
   * Validates input and adds todo if valid
   */
  handleSubmit(): void {
    const trimmedValue = this.inputValue.trim();

    // Reset error state
    this.showErrorSignal.set(false);

    // Validate input
    if (!trimmedValue) {
      this.showErrorSignal.set(true);
      this.errorMessageSignal.set('Please enter a todo item');
      return;
    }

    if (trimmedValue.length < 3) {
      this.showErrorSignal.set(true);
      this.errorMessageSignal.set('Todo must be at least 3 characters');
      return;
    }

    // Add todo via service
    this.todoService.addTodo(trimmedValue);

    // Clear input
    this.inputValue = '';

    // Update placeholder with encouragement
    this.updatePlaceholder();
  }

  /**
   * Update placeholder with dynamic messages
   */
  private updatePlaceholder(): void {
    const count = this.todoService.stats().total;
    const messages = [
      'What else needs to be done?',
      'Add another task...',
      'Keep going! Add more...',
      'What\'s next on your list?',
      'One more task to add?'
    ];
    this.placeholder.set(messages[count % messages.length]);
  }
}
