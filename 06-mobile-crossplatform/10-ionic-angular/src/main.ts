import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

/**
 * Application Bootstrap
 *
 * Bootstraps the Ionic Angular application using standalone components.
 * This is the entry point for the application.
 *
 * Features:
 * - Standalone component bootstrapping
 * - Ionic framework integration
 * - Router configuration
 * - Production mode handling
 */

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({
      mode: 'md' // Use Material Design mode for consistent UI across platforms
    })),
    provideRouter(routes)
  ]
});
