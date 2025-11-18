/**
 * App Component
 *
 * Root component of the Angular application.
 * This is a standalone component that demonstrates Angular 17+ features:
 * - Standalone components (no NgModule required)
 * - Modern component composition
 * - Signal-based reactive programming
 * - Dependency injection
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoInputComponent } from './components/todo-input/todo-input.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TodoInputComponent,
    TodoListComponent
  ],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <svg class="logo-icon" width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#logo-gradient)"/>
              <path d="M12 20l6 6 10-12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stop-color="#8b5cf6"/>
                  <stop offset="100%" stop-color="#6d28d9"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="logo-text">
              <h1>Todo List</h1>
              <p class="framework-badge">Angular {{ angularVersion }}</p>
            </div>
          </div>
          <div class="header-stats">
            <div class="stat-card">
              <span class="stat-value">{{ todoService.stats().active }}</span>
              <span class="stat-label">Active</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ todoService.stats().completed }}</span>
              <span class="stat-label">Done</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="app-main">
        <div class="todo-container">
          <app-todo-input />
          <app-todo-list />
        </div>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-content">
          <p class="footer-text">
            Built with
            <span class="highlight">Angular {{ angularVersion }}</span>
            •
            <span class="highlight">Standalone Components</span>
            •
            <span class="highlight">Signals</span>
          </p>
          <p class="footer-subtext">
            Demonstrating modern Angular features and best practices
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      background-attachment: fixed;
    }

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 20px;
    }

    .app-header {
      margin-bottom: 30px;
      animation: slideDown 0.6s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-content {
      max-width: 700px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 24px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-icon {
      flex-shrink: 0;
      filter: drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3));
    }

    .logo-text h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .framework-badge {
      display: inline-block;
      margin: 4px 0 0 0;
      padding: 4px 12px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    }

    .header-stats {
      display: flex;
      gap: 12px;
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 20px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      min-width: 70px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 800;
      color: #8b5cf6;
      line-height: 1;
    }

    .stat-label {
      font-size: 11px;
      color: #6b7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }

    .app-main {
      flex: 1;
      display: flex;
      justify-content: center;
      animation: fadeIn 0.8s ease 0.2s both;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .todo-container {
      width: 100%;
      max-width: 700px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 32px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }

    .app-footer {
      margin-top: 30px;
      animation: fadeIn 1s ease 0.4s both;
    }

    .footer-content {
      max-width: 700px;
      margin: 0 auto;
      text-align: center;
      color: rgba(255, 255, 255, 0.9);
    }

    .footer-text {
      font-size: 14px;
      font-weight: 500;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .highlight {
      font-weight: 700;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .footer-subtext {
      font-size: 12px;
      margin: 0;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .app-container {
        padding: 16px;
      }

      .header-content {
        flex-direction: column;
        gap: 20px;
        padding: 20px;
      }

      .logo-section {
        width: 100%;
        justify-content: center;
      }

      .header-stats {
        width: 100%;
        justify-content: center;
      }

      .todo-container {
        padding: 24px;
      }

      .logo-text h1 {
        font-size: 24px;
      }
    }

    @media (max-width: 480px) {
      .app-container {
        padding: 12px;
      }

      .header-content {
        padding: 16px;
      }

      .todo-container {
        padding: 20px;
        border-radius: 16px;
      }

      .stat-card {
        padding: 10px 16px;
        min-width: 60px;
      }

      .stat-value {
        font-size: 20px;
      }

      .footer-text {
        font-size: 13px;
      }

      .footer-subtext {
        font-size: 11px;
      }
    }
  `]
})
export class AppComponent {
  angularVersion = '17';

  constructor(public todoService: TodoService) {}
}
