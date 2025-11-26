import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
 * TodoList Component
 *
 * Container component that renders a list of TodoItem components.
 *
 * This component demonstrates:
 * - Passing arguments to child components
 * - Action delegation pattern
 * - Conditional rendering
 */
export default class TodoListComponent extends Component {
  /**
   * Delegate toggle action to parent
   */
  @action
  handleToggle(todo) {
    this.args.onToggle(todo);
  }

  /**
   * Delegate delete action to parent
   */
  @action
  handleDelete(todo) {
    this.args.onDelete(todo);
  }

  /**
   * Delegate update action to parent
   */
  @action
  handleUpdate(todo, newText) {
    this.args.onUpdate(todo, newText);
  }
}
