import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * TodoItem Component
 *
 * Individual todo item with inline editing capability.
 *
 * Features:
 * - Double-click to edit
 * - Escape to cancel editing
 * - Enter to save
 * - Auto-focus on edit mode
 */
export default class TodoItemComponent extends Component {
  /**
   * Tracked property for edit mode
   */
  @tracked isEditing = false;

  /**
   * Tracked property for edit text
   */
  @tracked editText = '';

  /**
   * Toggle the todo's completed status
   */
  @action
  toggleTodo() {
    this.args.onToggle(this.args.todo);
  }

  /**
   * Delete the todo
   */
  @action
  deleteTodo() {
    this.args.onDelete(this.args.todo);
  }

  /**
   * Enter edit mode
   */
  @action
  startEditing() {
    this.isEditing = true;
    this.editText = this.args.todo.text;
  }

  /**
   * Cancel editing
   */
  @action
  cancelEditing() {
    this.isEditing = false;
    this.editText = '';
  }

  /**
   * Save the edited text
   */
  @action
  saveEdit() {
    if (this.editText.trim()) {
      this.args.onUpdate(this.args.todo, this.editText);
      this.isEditing = false;
    } else {
      this.deleteTodo();
    }
  }

  /**
   * Handle input changes during editing
   */
  @action
  handleEditInput(event) {
    this.editText = event.target.value;
  }

  /**
   * Handle key presses during editing
   */
  @action
  handleEditKeyDown(event) {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEditing();
    }
  }

  /**
   * Handle blur event (lost focus)
   */
  @action
  handleEditBlur() {
    if (this.isEditing) {
      this.saveEdit();
    }
  }

  /**
   * Modifier to auto-focus the edit input
   * This is called when the edit input is inserted into the DOM
   */
  @action
  focusEditInput(element) {
    element.focus();
    element.select();
  }
}
