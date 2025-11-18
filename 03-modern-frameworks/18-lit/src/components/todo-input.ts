import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { inputStyles, buttonStyles, sharedStyles } from '../styles';
import { TodoEvents } from '../types';

/**
 * TodoInput Component
 *
 * A custom element for adding new todos.
 * Demonstrates:
 * - @state decorator for internal reactive state
 * - Event handling with @event syntax
 * - Custom event dispatching
 * - Form submission handling
 * - CSS composition with imported styles
 */
@customElement('todo-input')
export class TodoInput extends LitElement {
  static styles = [
    sharedStyles,
    inputStyles,
    buttonStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }

      .input-container {
        display: flex;
        gap: 12px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      input {
        flex: 1;
        min-width: 0;
      }

      button {
        background: #4a90e2;
        color: white;
        border-radius: 4px;
        font-weight: 600;
        padding: 12px 24px;
        white-space: nowrap;
      }

      button:hover:not(:disabled) {
        background: #357abd;
      }

      button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      @media (max-width: 480px) {
        .input-container {
          flex-direction: column;
        }

        button {
          width: 100%;
        }
      }
    `,
  ];

  @state()
  private inputValue = '';

  /**
   * Handle input changes
   */
  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.inputValue = input.value;
  }

  /**
   * Handle form submission
   */
  private handleSubmit(e: Event) {
    e.preventDefault();

    const trimmedValue = this.inputValue.trim();
    if (!trimmedValue) return;

    // Dispatch custom event to parent component
    this.dispatchEvent(
      new CustomEvent(TodoEvents.ADD, {
        detail: { text: trimmedValue },
        bubbles: true,
        composed: true,
      })
    );

    // Clear input
    this.inputValue = '';
  }

  /**
   * Handle Enter key press
   */
  private handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.handleSubmit(e);
    }
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit} class="input-container">
        <input
          type="text"
          .value=${this.inputValue}
          @input=${this.handleInput}
          @keypress=${this.handleKeyPress}
          placeholder="What needs to be done?"
          aria-label="New todo input"
        />
        <button
          type="submit"
          ?disabled=${!this.inputValue.trim()}
          aria-label="Add todo"
        >
          Add Todo
        </button>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-input': TodoInput;
  }
}
