/**
 * Main Entry Point
 *
 * This is the entry point for the Angular application.
 * In Angular 17+, we can bootstrap standalone components directly
 * without requiring an NgModule.
 *
 * Key changes in Angular 17+:
 * - bootstrapApplication() instead of platformBrowserDynamic().bootstrapModule()
 * - Standalone components can be bootstrapped directly
 * - Simplified application setup
 * - Better tree-shaking and smaller bundle sizes
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

/**
 * Bootstrap the application
 *
 * This function initializes the Angular application with the root component.
 * No NgModule is needed thanks to standalone components.
 */
bootstrapApplication(AppComponent, {
  providers: [
    // Application-wide providers can be added here
    // For this simple app, we don't need any additional providers
    // The TodoService is provided at the root level via @Injectable({ providedIn: 'root' })
  ]
}).catch((err) => console.error(err));
