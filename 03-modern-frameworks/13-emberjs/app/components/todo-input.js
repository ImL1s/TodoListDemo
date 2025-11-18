import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * TodoInput Component
 *
 * Glimmer Component for the todo input field.
 *
 * Glimmer Components are the modern component API in Ember, featuring:
 * - No implicit this
 * - Arguments are accessed via @args
 * - Tracked properties for state
 * - Actions for event handling
 */
export default class TodoInputComponent extends Component {
  /**
   * Tracked property for the input value
   * This makes the input controlled and reactive
   */
  @tracked newTodoText = '';

  /**
   * Handle input changes
   * Updates the tracked property as the user types
   */
  @action
  handleInput(event) {
    this.newTodoText = event.target.value;
  }

  /**
   * Handle form submission
   * Calls the parent-provided onSubmit action and clears the input
   */
  @action
  handleSubmit(event) {
    event.preventDefault();

    if (this.newTodoText.trim()) {
      // Call the action passed from parent
      this.args.onSubmit(this.newTodoText);

      // Clear the input
      this.newTodoText = '';
    }
  }

  /**
   * Handle Enter key press
   * Alternative way to submit the todo
   */
  @action
  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.handleSubmit(event);
    }
  }
}
