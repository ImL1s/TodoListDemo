import { Routes } from '@angular/router';

/**
 * Application routes configuration
 *
 * Defines the routing structure for the application.
 * Uses lazy loading for optimal performance.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
