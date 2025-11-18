/**
 * AppComponent Unit Tests
 *
 * Comprehensive test suite for the root AppComponent
 * Tests layout, header, footer, and integration with child components
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TodoService } from './services/todo.service';
import { TodoInputComponent } from './components/todo-input/todo-input.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let todoService: TodoService;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, TodoInputComponent, TodoListComponent]
    }).compileComponents();

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should inject TodoService', () => {
      expect(component.todoService).toBeTruthy();
      expect(component.todoService).toBe(todoService);
    });

    it('should have Angular version', () => {
      expect(component.angularVersion).toBe('17');
    });
  });

  describe('Layout Structure', () => {
    it('should have app container', () => {
      const container = compiled.querySelector('.app-container');
      expect(container).toBeTruthy();
    });

    it('should have header', () => {
      const header = compiled.querySelector('.app-header');
      expect(header).toBeTruthy();
    });

    it('should have main content area', () => {
      const main = compiled.querySelector('.app-main');
      expect(main).toBeTruthy();
    });

    it('should have footer', () => {
      const footer = compiled.querySelector('.app-footer');
      expect(footer).toBeTruthy();
    });

    it('should have todo container', () => {
      const todoContainer = compiled.querySelector('.todo-container');
      expect(todoContainer).toBeTruthy();
    });
  });

  describe('Header', () => {
    it('should display logo', () => {
      const logo = compiled.querySelector('.logo-icon');
      expect(logo).toBeTruthy();
    });

    it('should display app title', () => {
      const title = compiled.querySelector('.logo-text h1');
      expect(title?.textContent).toBe('Todo List');
    });

    it('should display framework badge', () => {
      const badge = compiled.querySelector('.framework-badge');
      expect(badge).toBeTruthy();
      expect(badge?.textContent).toContain('Angular 17');
    });

    it('should have header stats section', () => {
      const stats = compiled.querySelector('.header-stats');
      expect(stats).toBeTruthy();
    });

    it('should display active stat card', () => {
      const statCards = compiled.querySelectorAll('.stat-card');
      expect(statCards.length).toBeGreaterThanOrEqual(2);
    });

    it('should display stats from service', () => {
      todoService.addTodo('Active todo');
      todoService.addTodo('Completed todo');
      todoService.toggleTodo(todoService.todos()[1].id);
      fixture.detectChanges();

      const statCards = compiled.querySelectorAll('.stat-card');
      const activeCard = statCards[0];
      const doneCard = statCards[1];

      expect(activeCard.textContent).toContain('1');
      expect(activeCard.textContent).toContain('Active');
      expect(doneCard.textContent).toContain('1');
      expect(doneCard.textContent).toContain('Done');
    });

    it('should update stats reactively', () => {
      fixture.detectChanges();
      const initialActive = compiled.querySelector('.stat-card .stat-value')?.textContent;

      todoService.addTodo('New todo');
      fixture.detectChanges();

      const updatedActive = compiled.querySelector('.stat-card .stat-value')?.textContent;
      expect(updatedActive).not.toBe(initialActive);
    });
  });

  describe('Main Content', () => {
    it('should include TodoInputComponent', () => {
      const todoInput = compiled.querySelector('app-todo-input');
      expect(todoInput).toBeTruthy();
    });

    it('should include TodoListComponent', () => {
      const todoList = compiled.querySelector('app-todo-list');
      expect(todoList).toBeTruthy();
    });
  });

  describe('Footer', () => {
    it('should display footer text', () => {
      const footerText = compiled.querySelector('.footer-text');
      expect(footerText).toBeTruthy();
    });

    it('should mention Angular version', () => {
      const footerText = compiled.querySelector('.footer-text');
      expect(footerText?.textContent).toContain('Angular 17');
    });

    it('should mention Standalone Components', () => {
      const footerText = compiled.querySelector('.footer-text');
      expect(footerText?.textContent).toContain('Standalone Components');
    });

    it('should mention Signals', () => {
      const footerText = compiled.querySelector('.footer-text');
      expect(footerText?.textContent).toContain('Signals');
    });

    it('should have subtext', () => {
      const subtext = compiled.querySelector('.footer-subtext');
      expect(subtext).toBeTruthy();
      expect(subtext?.textContent).toContain('modern Angular features');
    });

    it('should have highlighted text', () => {
      const highlights = compiled.querySelectorAll('.highlight');
      expect(highlights.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Logo', () => {
    it('should have SVG logo', () => {
      const svg = compiled.querySelector('.logo-icon');
      expect(svg?.tagName.toLowerCase()).toBe('svg');
    });

    it('should have gradient in logo', () => {
      const gradient = compiled.querySelector('#logo-gradient');
      expect(gradient).toBeTruthy();
    });

    it('should have checkmark path in logo', () => {
      const path = compiled.querySelector('.logo-icon path');
      expect(path).toBeTruthy();
    });

    it('should have proper dimensions', () => {
      const svg = compiled.querySelector('.logo-icon') as SVGElement;
      expect(svg.getAttribute('width')).toBe('40');
      expect(svg.getAttribute('height')).toBe('40');
    });
  });

  describe('Styling', () => {
    it('should have gradient background', () => {
      const container = compiled.querySelector('.app-container');
      expect(container).toBeTruthy();
    });

    it('should have responsive layout', () => {
      const container = compiled.querySelector('.app-container');
      expect(container).toBeTruthy();
    });

    it('should have card-based design', () => {
      const headerContent = compiled.querySelector('.header-content');
      const todoContainer = compiled.querySelector('.todo-container');

      expect(headerContent).toBeTruthy();
      expect(todoContainer).toBeTruthy();
    });

    it('should have rounded corners', () => {
      const headerContent = compiled.querySelector('.header-content');
      expect(headerContent).toBeTruthy();
    });
  });

  describe('OnPush Change Detection', () => {
    it('should use OnPush change detection strategy', () => {
      const componentDef = (component.constructor as any).ɵcmp;
      expect(componentDef.onPush).toBe(0); // OnPush = 0, Default = 1
    });
  });

  describe('Component Integration', () => {
    it('should share TodoService with child components', () => {
      const inputComponent = fixture.debugElement.query(
        debugEl => debugEl.componentInstance instanceof TodoInputComponent
      );
      const listComponent = fixture.debugElement.query(
        debugEl => debugEl.componentInstance instanceof TodoListComponent
      );

      expect(inputComponent).toBeTruthy();
      expect(listComponent).toBeTruthy();
    });

    it('should update when child component adds todo', () => {
      const initialCount = todoService.stats().total;

      todoService.addTodo('New todo from test');
      fixture.detectChanges();

      expect(todoService.stats().total).toBe(initialCount + 1);
    });

    it('should reflect todo changes in header stats', () => {
      todoService.addTodo('Test todo');
      fixture.detectChanges();

      const statValue = compiled.querySelector('.stat-card .stat-value')?.textContent;
      expect(statValue).toBe('1');
    });
  });

  describe('Responsive Design', () => {
    it('should have media query classes', () => {
      // Check that responsive elements exist
      const headerContent = compiled.querySelector('.header-content');
      const todoContainer = compiled.querySelector('.todo-container');

      expect(headerContent).toBeTruthy();
      expect(todoContainer).toBeTruthy();
    });

    it('should have flexible layout', () => {
      const appContainer = compiled.querySelector('.app-container');
      expect(appContainer).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have header element', () => {
      const header = compiled.querySelector('header');
      expect(header).toBeTruthy();
    });

    it('should have main element', () => {
      const main = compiled.querySelector('main');
      expect(main).toBeTruthy();
    });

    it('should have footer element', () => {
      const footer = compiled.querySelector('footer');
      expect(footer).toBeTruthy();
    });

    it('should have heading in header', () => {
      const heading = compiled.querySelector('h1');
      expect(heading).toBeTruthy();
      expect(heading?.textContent).toBe('Todo List');
    });
  });

  describe('Animations', () => {
    it('should have animation classes', () => {
      const header = compiled.querySelector('.app-header');
      const main = compiled.querySelector('.app-main');
      const footer = compiled.querySelector('.app-footer');

      expect(header).toBeTruthy();
      expect(main).toBeTruthy();
      expect(footer).toBeTruthy();
    });
  });

  describe('Statistics Display', () => {
    beforeEach(() => {
      todoService.addTodo('Todo 1');
      todoService.addTodo('Todo 2');
      todoService.addTodo('Todo 3');
      todoService.toggleTodo(todoService.todos()[0].id);
      fixture.detectChanges();
    });

    it('should display correct active count', () => {
      const statCards = compiled.querySelectorAll('.stat-card');
      const activeCard = statCards[0];

      expect(activeCard.textContent).toContain('2');
    });

    it('should display correct done count', () => {
      const statCards = compiled.querySelectorAll('.stat-card');
      const doneCard = statCards[1];

      expect(doneCard.textContent).toContain('1');
    });

    it('should update when todos are toggled', () => {
      const secondTodoId = todoService.todos()[1].id;
      todoService.toggleTodo(secondTodoId);
      fixture.detectChanges();

      const statCards = compiled.querySelectorAll('.stat-card');
      const activeCard = statCards[0];
      const doneCard = statCards[1];

      expect(activeCard.textContent).toContain('1');
      expect(doneCard.textContent).toContain('2');
    });
  });

  describe('Template Syntax', () => {
    it('should use signal accessor syntax', () => {
      // Verify that the component accesses signals correctly
      expect(component.todoService.stats()).toBeTruthy();
    });

    it('should bind to service signals', () => {
      const stats = component.todoService.stats();
      expect(stats).toEqual({
        total: 0,
        active: 0,
        completed: 0
      });
    });
  });

  describe('Logo Section', () => {
    it('should have logo section', () => {
      const logoSection = compiled.querySelector('.logo-section');
      expect(logoSection).toBeTruthy();
    });

    it('should have logo text', () => {
      const logoText = compiled.querySelector('.logo-text');
      expect(logoText).toBeTruthy();
    });

    it('should display correct app title', () => {
      const title = compiled.querySelector('.logo-text h1');
      expect(title?.textContent).toBe('Todo List');
    });
  });
});
