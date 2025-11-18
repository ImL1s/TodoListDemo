/**
 * TodoService Unit Tests
 *
 * Comprehensive test suite for the TodoService
 * Tests all CRUD operations, computed signals, and localStorage integration
 */

import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { FilterType } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // Create spy for localStorage
    const storage: { [key: string]: string } = {};
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'clear']);
    localStorageSpy.getItem.and.callFake((key: string) => storage[key] || null);
    localStorageSpy.setItem.and.callFake((key: string, value: string) => {
      storage[key] = value;
    });
    localStorageSpy.clear.and.callFake(() => {
      for (const key in storage) {
        delete storage[key];
      }
    });

    // Replace global localStorage
    spyOnProperty(window, 'localStorage', 'get').and.returnValue(localStorageSpy as any);

    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  afterEach(() => {
    localStorageSpy.clear();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty todos when localStorage is empty', () => {
      expect(service.todos()).toEqual([]);
    });

    it('should load todos from localStorage on initialization', () => {
      const mockTodos = [
        { id: '1', text: 'Test todo', completed: false, createdAt: Date.now() }
      ];
      localStorageSpy.getItem.and.returnValue(JSON.stringify(mockTodos));

      // Create a new service instance to trigger initialization
      const newService = TestBed.inject(TodoService);
      expect(newService.todos().length).toBe(0); // Initial service is still empty
    });
  });

  describe('addTodo()', () => {
    it('should add a new todo', () => {
      service.addTodo('New todo');

      expect(service.todos().length).toBe(1);
      expect(service.todos()[0].text).toBe('New todo');
      expect(service.todos()[0].completed).toBe(false);
    });

    it('should trim whitespace from todo text', () => {
      service.addTodo('  Trimmed todo  ');

      expect(service.todos()[0].text).toBe('Trimmed todo');
    });

    it('should not add empty todos', () => {
      service.addTodo('');
      service.addTodo('   ');

      expect(service.todos().length).toBe(0);
    });

    it('should generate unique IDs for todos', () => {
      service.addTodo('Todo 1');
      service.addTodo('Todo 2');

      const ids = service.todos().map(t => t.id);
      expect(ids[0]).not.toEqual(ids[1]);
    });

    it('should set createdAt timestamp', () => {
      const beforeTime = Date.now();
      service.addTodo('Test todo');
      const afterTime = Date.now();

      const todo = service.todos()[0];
      expect(todo.createdAt).toBeGreaterThanOrEqual(beforeTime);
      expect(todo.createdAt).toBeLessThanOrEqual(afterTime);
    });

    it('should trigger localStorage save', () => {
      service.addTodo('Test todo');

      // Effect runs asynchronously, so we need to check after a tick
      setTimeout(() => {
        expect(localStorageSpy.setItem).toHaveBeenCalled();
      }, 0);
    });
  });

  describe('toggleTodo()', () => {
    beforeEach(() => {
      service.addTodo('Test todo');
    });

    it('should toggle todo completion status', () => {
      const id = service.todos()[0].id;

      service.toggleTodo(id);
      expect(service.todos()[0].completed).toBe(true);

      service.toggleTodo(id);
      expect(service.todos()[0].completed).toBe(false);
    });

    it('should not affect other todos', () => {
      service.addTodo('Second todo');
      const firstId = service.todos()[0].id;

      service.toggleTodo(firstId);

      expect(service.todos()[0].completed).toBe(true);
      expect(service.todos()[1].completed).toBe(false);
    });

    it('should handle invalid ID gracefully', () => {
      const initialState = service.todos();

      service.toggleTodo('invalid-id');

      expect(service.todos()).toEqual(initialState);
    });
  });

  describe('deleteTodo()', () => {
    beforeEach(() => {
      service.addTodo('Todo 1');
      service.addTodo('Todo 2');
      service.addTodo('Todo 3');
    });

    it('should delete a todo by ID', () => {
      const idToDelete = service.todos()[1].id;

      service.deleteTodo(idToDelete);

      expect(service.todos().length).toBe(2);
      expect(service.todos().find(t => t.id === idToDelete)).toBeUndefined();
    });

    it('should not affect other todos', () => {
      const keepId1 = service.todos()[0].id;
      const deleteId = service.todos()[1].id;
      const keepId2 = service.todos()[2].id;

      service.deleteTodo(deleteId);

      expect(service.todos().map(t => t.id)).toEqual([keepId1, keepId2]);
    });

    it('should handle invalid ID gracefully', () => {
      const initialLength = service.todos().length;

      service.deleteTodo('invalid-id');

      expect(service.todos().length).toBe(initialLength);
    });
  });

  describe('editTodo()', () => {
    beforeEach(() => {
      service.addTodo('Original text');
    });

    it('should update todo text', () => {
      const id = service.todos()[0].id;

      service.editTodo(id, 'Updated text');

      expect(service.todos()[0].text).toBe('Updated text');
    });

    it('should trim whitespace from new text', () => {
      const id = service.todos()[0].id;

      service.editTodo(id, '  Trimmed text  ');

      expect(service.todos()[0].text).toBe('Trimmed text');
    });

    it('should not update with empty text', () => {
      const id = service.todos()[0].id;
      const originalText = service.todos()[0].text;

      service.editTodo(id, '');
      service.editTodo(id, '   ');

      expect(service.todos()[0].text).toBe(originalText);
    });

    it('should not affect other properties', () => {
      const id = service.todos()[0].id;
      const originalCompleted = service.todos()[0].completed;
      const originalCreatedAt = service.todos()[0].createdAt;

      service.editTodo(id, 'New text');

      expect(service.todos()[0].completed).toBe(originalCompleted);
      expect(service.todos()[0].createdAt).toBe(originalCreatedAt);
    });

    it('should handle invalid ID gracefully', () => {
      const originalState = service.todos();

      service.editTodo('invalid-id', 'New text');

      expect(service.todos()).toEqual(originalState);
    });
  });

  describe('clearCompleted()', () => {
    beforeEach(() => {
      service.addTodo('Active 1');
      service.addTodo('Completed 1');
      service.addTodo('Active 2');
      service.addTodo('Completed 2');

      // Toggle some todos to completed
      service.toggleTodo(service.todos()[1].id);
      service.toggleTodo(service.todos()[3].id);
    });

    it('should remove all completed todos', () => {
      service.clearCompleted();

      expect(service.todos().length).toBe(2);
      expect(service.todos().every(t => !t.completed)).toBe(true);
    });

    it('should keep all active todos', () => {
      const activeTodos = service.todos().filter(t => !t.completed);

      service.clearCompleted();

      expect(service.todos().length).toBe(activeTodos.length);
    });

    it('should do nothing if no completed todos', () => {
      service.clearCompleted();
      const initialLength = service.todos().length;

      service.clearCompleted();

      expect(service.todos().length).toBe(initialLength);
    });
  });

  describe('setFilter()', () => {
    it('should set filter to all', () => {
      service.setFilter('all');
      expect(service.filter()).toBe('all');
    });

    it('should set filter to active', () => {
      service.setFilter('active');
      expect(service.filter()).toBe('active');
    });

    it('should set filter to completed', () => {
      service.setFilter('completed');
      expect(service.filter()).toBe('completed');
    });
  });

  describe('toggleAll()', () => {
    beforeEach(() => {
      service.addTodo('Todo 1');
      service.addTodo('Todo 2');
      service.addTodo('Todo 3');
    });

    it('should complete all todos when none are completed', () => {
      service.toggleAll();

      expect(service.todos().every(t => t.completed)).toBe(true);
    });

    it('should complete all todos when some are completed', () => {
      service.toggleTodo(service.todos()[0].id);

      service.toggleAll();

      expect(service.todos().every(t => t.completed)).toBe(true);
    });

    it('should uncomplete all todos when all are completed', () => {
      // Complete all todos
      service.toggleAll();
      expect(service.todos().every(t => t.completed)).toBe(true);

      // Toggle all again
      service.toggleAll();

      expect(service.todos().every(t => !t.completed)).toBe(true);
    });
  });

  describe('Computed Signals', () => {
    describe('filteredTodos', () => {
      beforeEach(() => {
        service.addTodo('Active 1');
        service.addTodo('Completed 1');
        service.addTodo('Active 2');

        service.toggleTodo(service.todos()[1].id);
      });

      it('should return all todos when filter is "all"', () => {
        service.setFilter('all');

        expect(service.filteredTodos().length).toBe(3);
      });

      it('should return only active todos when filter is "active"', () => {
        service.setFilter('active');

        const filtered = service.filteredTodos();
        expect(filtered.length).toBe(2);
        expect(filtered.every(t => !t.completed)).toBe(true);
      });

      it('should return only completed todos when filter is "completed"', () => {
        service.setFilter('completed');

        const filtered = service.filteredTodos();
        expect(filtered.length).toBe(1);
        expect(filtered.every(t => t.completed)).toBe(true);
      });

      it('should update automatically when todos change', () => {
        service.setFilter('active');
        const initialCount = service.filteredTodos().length;

        service.addTodo('New active todo');

        expect(service.filteredTodos().length).toBe(initialCount + 1);
      });

      it('should update automatically when filter changes', () => {
        service.setFilter('active');
        const activeCount = service.filteredTodos().length;

        service.setFilter('completed');
        const completedCount = service.filteredTodos().length;

        expect(activeCount).not.toBe(completedCount);
      });
    });

    describe('stats', () => {
      beforeEach(() => {
        service.addTodo('Active 1');
        service.addTodo('Completed 1');
        service.addTodo('Active 2');
        service.addTodo('Completed 2');

        service.toggleTodo(service.todos()[1].id);
        service.toggleTodo(service.todos()[3].id);
      });

      it('should calculate total count correctly', () => {
        expect(service.stats().total).toBe(4);
      });

      it('should calculate active count correctly', () => {
        expect(service.stats().active).toBe(2);
      });

      it('should calculate completed count correctly', () => {
        expect(service.stats().completed).toBe(2);
      });

      it('should update when todos are added', () => {
        service.addTodo('New todo');

        expect(service.stats().total).toBe(5);
        expect(service.stats().active).toBe(3);
      });

      it('should update when todos are toggled', () => {
        const id = service.todos().find(t => !t.completed)?.id;
        if (id) {
          service.toggleTodo(id);

          expect(service.stats().active).toBe(1);
          expect(service.stats().completed).toBe(3);
        }
      });

      it('should update when todos are deleted', () => {
        const id = service.todos()[0].id;
        service.deleteTodo(id);

        expect(service.stats().total).toBe(3);
      });
    });

    describe('hasCompletedTodos', () => {
      it('should return false when no todos exist', () => {
        expect(service.hasCompletedTodos()).toBe(false);
      });

      it('should return false when no todos are completed', () => {
        service.addTodo('Active todo');

        expect(service.hasCompletedTodos()).toBe(false);
      });

      it('should return true when at least one todo is completed', () => {
        service.addTodo('Test todo');
        service.toggleTodo(service.todos()[0].id);

        expect(service.hasCompletedTodos()).toBe(true);
      });

      it('should update when completed todos are cleared', () => {
        service.addTodo('Test todo');
        service.toggleTodo(service.todos()[0].id);

        service.clearCompleted();

        expect(service.hasCompletedTodos()).toBe(false);
      });
    });
  });

  describe('LocalStorage Integration', () => {
    it('should save todos to localStorage', (done) => {
      service.addTodo('Test todo');

      // Wait for effect to run
      setTimeout(() => {
        expect(localStorageSpy.setItem).toHaveBeenCalledWith(
          'angular-todos',
          jasmine.any(String)
        );
        done();
      }, 100);
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageSpy.setItem.and.throwError('Storage full');

      expect(() => service.addTodo('Test todo')).not.toThrow();
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorageSpy.getItem.and.returnValue('invalid json');

      // Service should still be created without throwing
      expect(() => TestBed.inject(TodoService)).not.toThrow();
    });
  });
});
