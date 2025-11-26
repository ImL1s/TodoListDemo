import EmberRouter from '@ember/routing/router';
import config from 'emberjs-todo-list/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Define routes here
  // For this simple todo app, we'll use the application route
  // You could add routes like:
  // this.route('active');
  // this.route('completed');
});
