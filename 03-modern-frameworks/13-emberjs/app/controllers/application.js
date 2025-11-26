import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service todoStorage;

  /**
   * Tracked property for the current filter
   * Tracked properties are reactive - when they change, the UI updates automatically
   */
  @tracked currentFilter = 'all';

  /**
   * Getter for filtered todos based on current filter
   * Getters are automatically recomputed when their dependencies change
   */
  get filteredTodos() {
    const todos = this.todoStorage.todos;

    switch (this.currentFilter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }

  /**
   * Getter for active todos count
   */
  get activeTodosCount() {
    return this.todoStorage.todos.filter((todo) => !todo.completed).length;
  }

  /**
   * Getter for completed todos count
   */
  get completedTodosCount() {
    return this.todoStorage.todos.filter((todo) => todo.completed).length;
  }

  /**
   * Getter to check if there are any todos
   */
  get hasTodos() {
    return this.todoStorage.todos.length > 0;
  }

  /**
   * Getter to check if all todos are completed
   */
  get allCompleted() {
    return this.hasTodos && this.activeTodosCount === 0;
  }

  /**
   * Action to add a new todo
   * Actions are methods that can be called from templates
   */
  @action
  addTodo(text) {
    if (text.trim()) {
      this.todoStorage.addTodo(text.trim());
    }
  }

  /**
   * Action to toggle a todo's completed status
   */
  @action
  toggleTodo(todo) {
    this.todoStorage.toggleTodo(todo.id);
  }

  /**
   * Action to delete a todo
   */
  @action
  deleteTodo(todo) {
    this.todoStorage.deleteTodo(todo.id);
  }

  /**
   * Action to update a todo's text
   */
  @action
  updateTodo(todo, newText) {
    if (newText.trim()) {
      this.todoStorage.updateTodo(todo.id, newText.trim());
    } else {
      this.todoStorage.deleteTodo(todo.id);
    }
  }

  /**
   * Action to toggle all todos
   */
  @action
  toggleAll() {
    this.todoStorage.toggleAll();
  }

  /**
   * Action to clear completed todos
   */
  @action
  clearCompleted() {
    this.todoStorage.clearCompleted();
  }

  /**
   * Action to set the current filter
   */
  @action
  setFilter(filter) {
    this.currentFilter = filter;
  }
}
