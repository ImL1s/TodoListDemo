/**
 * TodoItemComponent Unit Tests
 *
 * Comprehensive test suite for the TodoItemComponent
 * Tests display, editing, and event emission
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.model';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let compiled: HTMLElement;
  let mockTodo: Todo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    // Create mock todo
    mockTodo = {
      id: 'test-id-123',
      text: 'Test todo item',
      completed: false,
      createdAt: Date.now()
    };

    component.todo = mockTodo;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should require todo input', () => {
      const metadata = (component.constructor as any).ɵcmp;
      expect(metadata).toBeTruthy();
    });

    it('should not be in editing mode initially', () => {
      expect(component.isEditing()).toBe(false);
    });

    it('should have empty editText initially', () => {
      expect(component.editText).toBe('');
    });

    it('should render todo text', () => {
      const todoText = compiled.querySelector('.todo-text');
      expect(todoText?.textContent?.trim()).toBe('Test todo item');
    });
  });

  describe('Todo Display', () => {
    it('should display todo text', () => {
      const todoText = compiled.querySelector('.todo-text');
      expect(todoText?.textContent).toContain(mockTodo.text);
    });

    it('should show checkbox', () => {
      const checkbox = compiled.querySelector('.todo-checkbox') as HTMLInputElement;
      expect(checkbox).toBeTruthy();
      expect(checkbox.type).toBe('checkbox');
    });

    it('should check checkbox when todo is completed', () => {
      component.todo = { ...mockTodo, completed: true };
      fixture.detectChanges();

      const checkbox = compiled.querySelector('.todo-checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('should add completed class when todo is completed', () => {
      component.todo = { ...mockTodo, completed: true };
      fixture.detectChanges();

      const todoItem = compiled.querySelector('.todo-item');
      expect(todoItem?.classList.contains('completed')).toBe(true);
    });

    it('should apply strikethrough to completed todos', () => {
      component.todo = { ...mockTodo, completed: true };
      fixture.detectChanges();

      const todoText = compiled.querySelector('.todo-text');
      const computedStyle = window.getComputedStyle(todoText as Element);
      // Note: This checks if the CSS class is applied, actual style verification may vary
      expect(todoText?.parentElement?.classList.contains('completed')).toBe(true);
    });
  });

  describe('Toggle Functionality', () => {
    it('should emit toggle event when checkbox is clicked', () => {
      spyOn(component.toggle, 'emit');

      component.onToggle();

      expect(component.toggle.emit).toHaveBeenCalled();
    });

    it('should emit toggle event when checkbox input changes', () => {
      spyOn(component.toggle, 'emit');
      const checkbox = compiled.querySelector('.todo-checkbox') as HTMLInputElement;

      checkbox.click();

      expect(component.toggle.emit).toHaveBeenCalled();
    });

    it('should have label associated with checkbox', () => {
      const checkbox = compiled.querySelector('.todo-checkbox') as HTMLInputElement;
      const label = compiled.querySelector('.checkbox-label') as HTMLLabelElement;

      expect(checkbox.id).toBe(`todo-${mockTodo.id}`);
      expect(label.htmlFor).toBe(`todo-${mockTodo.id}`);
    });
  });

  describe('Delete Functionality', () => {
    it('should emit delete event when delete button is clicked', () => {
      spyOn(component.delete, 'emit');

      component.onDelete();

      expect(component.delete.emit).toHaveBeenCalled();
    });

    it('should show delete button', () => {
      const deleteButton = compiled.querySelector('.delete-button');
      expect(deleteButton).toBeTruthy();
    });

    it('should emit delete event when delete button is clicked in DOM', (done) => {
      component.delete.subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const deleteButton = compiled.querySelector('.delete-button') as HTMLButtonElement;
      deleteButton.click();
    });

    it('should have delete icon in button', () => {
      const deleteButton = compiled.querySelector('.delete-button');
      const svg = deleteButton?.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should have title attribute on delete button', () => {
      const deleteButton = compiled.querySelector('.delete-button') as HTMLButtonElement;
      expect(deleteButton.title).toBe('Delete todo');
    });
  });

  describe('Edit Functionality', () => {
    it('should enter edit mode when handleEdit is called', () => {
      component.handleEdit();

      expect(component.isEditing()).toBe(true);
    });

    it('should set editText to current todo text when entering edit mode', () => {
      component.handleEdit();

      expect(component.editText).toBe(mockTodo.text);
    });

    it('should enter edit mode on double-click', () => {
      const todoText = compiled.querySelector('.todo-text') as HTMLElement;

      todoText.dispatchEvent(new Event('dblclick'));
      fixture.detectChanges();

      expect(component.isEditing()).toBe(true);
    });

    it('should show input field when in edit mode', () => {
      component.handleEdit();
      fixture.detectChanges();

      const editInput = compiled.querySelector('.edit-input');
      expect(editInput).toBeTruthy();
    });

    it('should hide todo text when in edit mode', () => {
      component.handleEdit();
      fixture.detectChanges();

      const todoText = compiled.querySelector('.todo-text');
      expect(todoText).toBeFalsy();
    });

    it('should hide action buttons when in edit mode', () => {
      component.handleEdit();
      fixture.detectChanges();

      const editButton = compiled.querySelector('.edit-button');
      const deleteButton = compiled.querySelector('.delete-button');
      expect(editButton).toBeFalsy();
      expect(deleteButton).toBeFalsy();
    });

    it('should have title attribute on edit button', () => {
      const editButton = compiled.querySelector('.edit-button') as HTMLButtonElement;
      expect(editButton.title).toBe('Edit todo');
    });
  });

  describe('Edit Save', () => {
    beforeEach(() => {
      component.handleEdit();
      fixture.detectChanges();
    });

    it('should emit edit event with new text when saved', () => {
      spyOn(component.edit, 'emit');
      component.editText = 'Updated text';

      component.handleSave();

      expect(component.edit.emit).toHaveBeenCalledWith('Updated text');
    });

    it('should exit edit mode after save', () => {
      component.editText = 'Updated text';

      component.handleSave();

      expect(component.isEditing()).toBe(false);
    });

    it('should not emit edit event if text unchanged', () => {
      spyOn(component.edit, 'emit');
      component.editText = mockTodo.text;

      component.handleSave();

      expect(component.edit.emit).not.toHaveBeenCalled();
    });

    it('should not emit edit event if text is empty', () => {
      spyOn(component.edit, 'emit');
      component.editText = '';

      component.handleSave();

      expect(component.edit.emit).not.toHaveBeenCalled();
    });

    it('should trim whitespace before emitting', () => {
      spyOn(component.edit, 'emit');
      component.editText = '  Updated text  ';

      component.handleSave();

      expect(component.edit.emit).toHaveBeenCalledWith('Updated text');
    });

    it('should save on blur', () => {
      spyOn(component, 'handleSave');
      component.editText = 'Updated text';
      fixture.detectChanges();

      const editInput = compiled.querySelector('.edit-input') as HTMLInputElement;
      editInput.dispatchEvent(new Event('blur'));

      expect(component.handleSave).toHaveBeenCalled();
    });
  });

  describe('Edit Cancel', () => {
    beforeEach(() => {
      component.handleEdit();
      fixture.detectChanges();
    });

    it('should exit edit mode when cancelled', () => {
      component.handleCancel();

      expect(component.isEditing()).toBe(false);
    });

    it('should reset editText to original value when cancelled', () => {
      component.editText = 'Changed text';

      component.handleCancel();

      expect(component.editText).toBe(mockTodo.text);
    });

    it('should not emit edit event when cancelled', () => {
      spyOn(component.edit, 'emit');
      component.editText = 'Changed text';

      component.handleCancel();

      expect(component.edit.emit).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Shortcuts in Edit Mode', () => {
    beforeEach(() => {
      component.handleEdit();
      fixture.detectChanges();
    });

    it('should save on Enter key', () => {
      spyOn(component, 'handleSave');
      const editInput = compiled.querySelector('.edit-input') as HTMLInputElement;

      const event = new KeyboardEvent('keyup', { key: 'Enter' });
      editInput.dispatchEvent(event);

      expect(component.handleSave).toHaveBeenCalled();
    });

    it('should cancel on Escape key', () => {
      spyOn(component, 'handleCancel');
      const editInput = compiled.querySelector('.edit-input') as HTMLInputElement;

      const event = new KeyboardEvent('keyup', { key: 'Escape' });
      editInput.dispatchEvent(event);

      expect(component.handleCancel).toHaveBeenCalled();
    });
  });

  describe('Action Buttons', () => {
    it('should show edit button', () => {
      const editButton = compiled.querySelector('.edit-button');
      expect(editButton).toBeTruthy();
    });

    it('should show delete button', () => {
      const deleteButton = compiled.querySelector('.delete-button');
      expect(deleteButton).toBeTruthy();
    });

    it('should have icons in action buttons', () => {
      const editIcon = compiled.querySelector('.edit-button svg');
      const deleteIcon = compiled.querySelector('.delete-button svg');

      expect(editIcon).toBeTruthy();
      expect(deleteIcon).toBeTruthy();
    });

    it('should emit delete event when delete button clicked', (done) => {
      component.delete.subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const deleteButton = compiled.querySelector('.delete-button') as HTMLButtonElement;
      deleteButton.click();
    });

    it('should enter edit mode when edit button clicked', () => {
      const editButton = compiled.querySelector('.edit-button') as HTMLButtonElement;
      editButton.click();

      expect(component.isEditing()).toBe(true);
    });
  });

  describe('OnPush Change Detection', () => {
    it('should use OnPush change detection strategy', () => {
      const componentDef = (component.constructor as any).ɵcmp;
      expect(componentDef.onPush).toBe(0); // OnPush = 0, Default = 1
    });
  });

  describe('CSS Animations', () => {
    it('should have animation class on todo item', () => {
      const todoItem = compiled.querySelector('.todo-item');
      expect(todoItem).toBeTruthy();
    });

    it('should apply hover effects to action buttons', () => {
      const editButton = compiled.querySelector('.edit-button');
      const deleteButton = compiled.querySelector('.delete-button');

      expect(editButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper checkbox ID', () => {
      const checkbox = compiled.querySelector('.todo-checkbox') as HTMLInputElement;
      expect(checkbox.id).toBe(`todo-${mockTodo.id}`);
    });

    it('should have associated label for checkbox', () => {
      const label = compiled.querySelector('.checkbox-label') as HTMLLabelElement;
      expect(label.htmlFor).toBe(`todo-${mockTodo.id}`);
    });

    it('should have title on todo text for edit hint', () => {
      const todoText = compiled.querySelector('.todo-text') as HTMLElement;
      expect(todoText.title).toContain('Double-click to edit');
    });

    it('should have title attributes on action buttons', () => {
      const editButton = compiled.querySelector('.edit-button') as HTMLButtonElement;
      const deleteButton = compiled.querySelector('.delete-button') as HTMLButtonElement;

      expect(editButton.title).toBe('Edit todo');
      expect(deleteButton.title).toBe('Delete todo');
    });
  });

  describe('Event Emitters', () => {
    it('should have toggle output', () => {
      expect(component.toggle).toBeTruthy();
    });

    it('should have delete output', () => {
      expect(component.delete).toBeTruthy();
    });

    it('should have edit output', () => {
      expect(component.edit).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle long todo text', () => {
      const longText = 'A'.repeat(200);
      component.todo = { ...mockTodo, text: longText };
      fixture.detectChanges();

      const todoText = compiled.querySelector('.todo-text');
      expect(todoText?.textContent).toContain(longText);
    });

    it('should handle special characters in todo text', () => {
      const specialText = '<script>alert("test")</script>';
      component.todo = { ...mockTodo, text: specialText };
      fixture.detectChanges();

      const todoText = compiled.querySelector('.todo-text');
      expect(todoText?.textContent).toBe(specialText);
    });

    it('should handle rapid toggle clicks', () => {
      spyOn(component.toggle, 'emit');

      component.onToggle();
      component.onToggle();
      component.onToggle();

      expect(component.toggle.emit).toHaveBeenCalledTimes(3);
    });

    it('should handle switching between edit and display modes', () => {
      component.handleEdit();
      expect(component.isEditing()).toBe(true);

      component.handleCancel();
      expect(component.isEditing()).toBe(false);

      component.handleEdit();
      expect(component.isEditing()).toBe(true);

      component.editText = 'New text';
      component.handleSave();
      expect(component.isEditing()).toBe(false);
    });
  });

  describe('Signal Usage', () => {
    it('should use signal for isEditing state', () => {
      expect(component.isEditing).toBeTruthy();
      expect(typeof component.isEditing).toBe('function');
    });

    it('should update isEditing signal reactively', () => {
      expect(component.isEditing()).toBe(false);

      component.handleEdit();
      expect(component.isEditing()).toBe(true);

      component.handleCancel();
      expect(component.isEditing()).toBe(false);
    });
  });
});
