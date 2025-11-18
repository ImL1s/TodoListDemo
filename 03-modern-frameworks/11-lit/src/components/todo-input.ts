import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { TodoAddEvent } from '../types.js';

/**
 * Todo Input Component
 *
 * A custom element for adding new todo items.
 * Uses Shadow DOM for style encapsulation.
 *
 * @fires todo-add - Fired when a new todo is added
 *
 * @example
 * ```html
 * <todo-input></todo-input>
 * ```
 */
@customElement('todo-input')
export class TodoInput extends LitElement {
  // Static styles are applied to the shadow root
  static styles = css`
    :host {
      display: block;
      margin-bottom: 20px;
    }

    .input-container {
      display: flex;
      gap: 10px;
      background: white;
      padding: 15px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s ease;
      outline: none;
    }

    input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input::placeholder {
      color: #9ca3af;
    }

    button {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 640px) {
      .input-container {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `;

  // Internal state (not exposed as property)
  @state()
  private inputValue = '';

  /**
   * Handle input change
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

    // Dispatch custom event that bubbles through shadow DOM
    this.dispatchEvent(new TodoAddEvent(trimmedValue));

    // Clear input
    this.inputValue = '';
  }

  /**
   * Render the component
   */
  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <div class="input-container">
          <input
            type="text"
            .value=${this.inputValue}
            @input=${this.handleInput}
            placeholder="新增待辦事項..."
            autocomplete="off"
            aria-label="新增待辦事項"
          />
          <button
            type="submit"
            ?disabled=${!this.inputValue.trim()}
            aria-label="新增"
          >
            ➕ 新增
          </button>
        </div>
      </form>
    `;
  }
}

// Declare the custom element type for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'todo-input': TodoInput;
  }
}
