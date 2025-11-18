import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service todoStorage;

  /**
   * Model hook - loads data when the route is entered
   * This is a key part of Ember's convention over configuration
   */
  model() {
    // Load todos from the storage service
    // The model hook automatically makes this data available to the controller and template
    return {
      todos: this.todoStorage.todos,
    };
  }

  /**
   * Setup controller hook - runs after model is resolved
   * Used to configure the controller with additional data or actions
   */
  setupController(controller, model) {
    super.setupController(controller, model);
    // Controller is automatically set up with the model
    // Additional setup can be done here if needed
  }
}
