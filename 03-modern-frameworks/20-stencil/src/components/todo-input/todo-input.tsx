/**
 * TodoInput Component - Add New Todos
 *
 * Stencil Features Demonstrated:
 * - @Component decorator with inline styles
 * - @State for internal component state
 * - @Event decorator for custom events
 * - EventEmitter for type-safe event emission
 * - Form handling with JSX
 * - Class method binding
 */

import { Component, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'todo-input',
  // Inline styles using template literal
  styles: `
    :host {
      display: block;
    }

    .todo-input-container {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    form {
      display: flex;
      gap: 0.75rem;
    }

    input {
      flex: 1;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      color: #1f2937;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    input:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    input::placeholder {
      color: #9ca3af;
    }

    button {
      padding: 0.875rem 2rem;
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.3);
      white-space: nowrap;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.4);
    }

    button:active {
      transform: translateY(0);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 640px) {
      form {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `,
  shadow: true,
})
export class TodoInput {
  /**
   * @State - Internal Component State
   *
   * Unlike @Prop (which receives data from parent),
   * @State is for internal component state management
   */
  @State() inputValue: string = '';

  /**
   * @Event - Custom Event Declaration
   *
   * EventEmitter<T> creates type-safe custom events
   * Parent components can listen with @Listen decorator
   *
   * Benefits:
   * - Type safety for event data
   * - Auto-complete in IDEs
   * - Clear component API
   */
  @Event() todoAdd: EventEmitter<string>;

  /**
   * Handle form submission
   */
  private handleSubmit = (e: Event) => {
    e.preventDefault();

    const text = this.inputValue.trim();
    if (!text) return;

    // Emit custom event with the new todo text
    this.todoAdd.emit(text);

    // Clear input
    this.inputValue = '';
  };

  /**
   * Handle input change
   */
  private handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.inputValue = target.value;
  };

  /**
   * JSX Render Method
   *
   * Stencil's JSX is similar to React but optimized for web components
   * Supports all standard HTML elements and custom components
   */
  render() {
    return (
      <div class="todo-input-container">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.inputValue}
            onInput={this.handleInput}
            placeholder="What needs to be done?"
            aria-label="New todo"
          />
          <button type="submit" disabled={!this.inputValue.trim()}>
            Add Todo
          </button>
        </form>
      </div>
    );
  }
}
