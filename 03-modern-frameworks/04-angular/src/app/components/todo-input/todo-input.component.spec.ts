/**
 * TodoInputComponent Unit Tests
 *
 * Comprehensive test suite for the TodoInputComponent
 * Tests input validation, form submission, and error handling
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TodoInputComponent } from './todo-input.component';
import { TodoService } from '../../services/todo.service';

describe('TodoInputComponent', () => {
  let component: TodoInputComponent;
  let fixture: ComponentFixture<TodoInputComponent>;
  let todoService: TodoService;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoInputComponent, FormsModule]
    }).compileComponents();

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    fixture = TestBed.createComponent(TodoInputComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have empty input value initially', () => {
      expect(component.inputValue).toBe('');
    });

    it('should not show error initially', () => {
      expect(component.showError()).toBe(false);
    });

    it('should have default placeholder', () => {
      expect(component.placeholder()).toBe('What needs to be done?');
    });

    it('should render input element', () => {
      const input = compiled.querySelector('.todo-input');
      expect(input).toBeTruthy();
    });

    it('should render add button', () => {
      const button = compiled.querySelector('.add-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Input Validation', () => {
    it('should disable button when input is empty', () => {
      component.inputValue = '';
      fixture.detectChanges();

      const button = compiled.querySelector('.add-button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('should enable button when input has text', () => {
      component.inputValue = 'Valid todo';
      fixture.detectChanges();

      const button = compiled.querySelector('.add-button') as HTMLButtonElement;
      expect(button.disabled).toBe(false);
    });

    it('should disable button for whitespace-only input', () => {
      component.inputValue = '   ';
      fixture.detectChanges();

      const button = compiled.querySelector('.add-button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('should show error for empty input on submit', () => {
      component.inputValue = '';
      component.handleSubmit();

      expect(component.showError()).toBe(true);
      expect(component.errorMessage()).toBe('Please enter a todo item');
    });

    it('should show error for short input (less than 3 characters)', () => {
      component.inputValue = 'ab';
      component.handleSubmit();

      expect(component.showError()).toBe(true);
      expect(component.errorMessage()).toBe('Todo must be at least 3 characters');
    });

    it('should not show error for valid input', () => {
      component.inputValue = 'Valid todo';
      component.handleSubmit();

      expect(component.showError()).toBe(false);
    });

    it('should display error message in template', () => {
      component.inputValue = '';
      component.handleSubmit();
      fixture.detectChanges();

      const errorMessage = compiled.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage?.textContent?.trim()).toContain('Please enter a todo item');
    });

    it('should add error class to input when error shown', () => {
      component.inputValue = '';
      component.handleSubmit();
      fixture.detectChanges();

      const input = compiled.querySelector('.todo-input');
      expect(input?.classList.contains('error')).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should add todo via service on valid submit', () => {
      spyOn(todoService, 'addTodo');
      component.inputValue = 'New todo';

      component.handleSubmit();

      expect(todoService.addTodo).toHaveBeenCalledWith('New todo');
    });

    it('should clear input after successful submit', () => {
      component.inputValue = 'New todo';

      component.handleSubmit();

      expect(component.inputValue).toBe('');
    });

    it('should update placeholder after successful submit', () => {
      const initialPlaceholder = component.placeholder();
      component.inputValue = 'New todo';

      component.handleSubmit();

      expect(component.placeholder()).not.toBe(initialPlaceholder);
    });

    it('should not add todo for empty input', () => {
      spyOn(todoService, 'addTodo');
      component.inputValue = '';

      component.handleSubmit();

      expect(todoService.addTodo).not.toHaveBeenCalled();
    });

    it('should not add todo for short input', () => {
      spyOn(todoService, 'addTodo');
      component.inputValue = 'ab';

      component.handleSubmit();

      expect(todoService.addTodo).not.toHaveBeenCalled();
    });

    it('should reset error state on new submit', () => {
      // First submit with error
      component.inputValue = '';
      component.handleSubmit();
      expect(component.showError()).toBe(true);

      // Second submit with valid input
      component.inputValue = 'Valid todo';
      component.handleSubmit();

      expect(component.showError()).toBe(false);
    });

    it('should trim whitespace before adding todo', () => {
      spyOn(todoService, 'addTodo');
      component.inputValue = '  Todo with spaces  ';

      component.handleSubmit();

      expect(todoService.addTodo).toHaveBeenCalledWith('Todo with spaces');
    });
  });

  describe('Keyboard Interactions', () => {
    it('should submit on Enter key', () => {
      spyOn(component, 'handleSubmit');
      const input = compiled.querySelector('.todo-input') as HTMLInputElement;

      component.inputValue = 'New todo';
      fixture.detectChanges();

      const event = new KeyboardEvent('keyup', { key: 'Enter' });
      input.dispatchEvent(event);

      expect(component.handleSubmit).toHaveBeenCalled();
    });

    it('should enforce maxlength attribute', () => {
      const input = compiled.querySelector('.todo-input') as HTMLInputElement;
      expect(input.maxLength).toBe(200);
    });
  });

  describe('Dynamic Placeholder', () => {
    it('should cycle through placeholder messages', () => {
      const placeholders: string[] = [];

      for (let i = 0; i < 5; i++) {
        component.inputValue = `Todo ${i}`;
        component.handleSubmit();
        placeholders.push(component.placeholder());
      }

      // Check that placeholders are different
      const uniquePlaceholders = new Set(placeholders);
      expect(uniquePlaceholders.size).toBeGreaterThan(1);
    });

    it('should update placeholder based on todo count', () => {
      spyOn(todoService.stats, 'call').and.returnValue({ total: 3, active: 2, completed: 1 });

      component.inputValue = 'Test todo';
      component.handleSubmit();

      expect(component.placeholder()).toBeTruthy();
    });
  });

  describe('Button Behavior', () => {
    it('should call handleSubmit when button clicked', () => {
      spyOn(component, 'handleSubmit');
      component.inputValue = 'Valid todo';
      fixture.detectChanges();

      const button = compiled.querySelector('.add-button') as HTMLButtonElement;
      button.click();

      expect(component.handleSubmit).toHaveBeenCalled();
    });

    it('should not submit when button is disabled', () => {
      spyOn(todoService, 'addTodo');
      component.inputValue = '';
      fixture.detectChanges();

      const button = compiled.querySelector('.add-button') as HTMLButtonElement;
      button.click();

      expect(todoService.addTodo).not.toHaveBeenCalled();
    });

    it('should display SVG icon in button', () => {
      const svg = compiled.querySelector('.add-button svg');
      expect(svg).toBeTruthy();
    });

    it('should display "Add" text in button', () => {
      const button = compiled.querySelector('.add-button');
      expect(button?.textContent).toContain('Add');
    });
  });

  describe('OnPush Change Detection', () => {
    it('should use OnPush change detection strategy', () => {
      const componentDef = (component.constructor as any).ɵcmp;
      expect(componentDef.onPush).toBe(0); // OnPush = 0, Default = 1
    });
  });

  describe('Accessibility', () => {
    it('should have proper input type', () => {
      const input = compiled.querySelector('.todo-input') as HTMLInputElement;
      expect(input.type).toBe('text');
    });

    it('should have placeholder attribute', () => {
      const input = compiled.querySelector('.todo-input') as HTMLInputElement;
      expect(input.placeholder).toBeTruthy();
    });

    it('should have button with proper type', () => {
      const button = compiled.querySelector('.add-button') as HTMLButtonElement;
      expect(button.type).toBe('button');
    });
  });

  describe('Error Animation', () => {
    it('should have error message element when error shown', () => {
      component.inputValue = '';
      component.handleSubmit();
      fixture.detectChanges();

      const errorMessage = compiled.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
    });

    it('should not display error message when no error', () => {
      component.inputValue = 'Valid todo';
      component.handleSubmit();
      fixture.detectChanges();

      const errorMessage = compiled.querySelector('.error-message');
      expect(errorMessage).toBeFalsy();
    });
  });
});
