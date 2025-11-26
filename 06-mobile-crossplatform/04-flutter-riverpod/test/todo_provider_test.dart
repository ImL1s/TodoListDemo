import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod_todo/models/todo.dart';
import 'package:flutter_riverpod_todo/providers/todo_provider.dart';
import 'package:flutter_riverpod_todo/repositories/todo_repository.dart';

/// Mock TodoRepository for testing
///
/// Allows us to test provider logic without actual persistence
class MockTodoRepository implements TodoRepository {
  List<Todo> _mockTodos = [];

  @override
  Future<List<Todo>> loadTodos() async {
    return _mockTodos;
  }

  @override
  Future<bool> saveTodos(List<Todo> todos) async {
    _mockTodos = todos;
    return true;
  }

  @override
  Future<bool> clearTodos() async {
    _mockTodos = [];
    return true;
  }

  @override
  Future<String?> exportTodos() async {
    // Not implemented for mock
    return null;
  }

  @override
  Future<bool> importTodos(String jsonString) async {
    // Not implemented for mock
    return false;
  }
}

void main() {
  group('TodoProvider Tests', () {
    late ProviderContainer container;
    late MockTodoRepository mockRepository;

    setUp(() {
      mockRepository = MockTodoRepository();
      // Create a ProviderContainer with overridden repository
      container = ProviderContainer(
        overrides: [
          todoRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
    });

    tearDown(() {
      container.dispose();
    });

    test('Initial state should be empty', () async {
      // Read the provider
      final asyncValue = container.read(todoListProvider);

      // Wait for initial load to complete
      await container.read(todoListProvider.future);

      // Verify initial state
      expect(asyncValue.value, isEmpty);
    });

    test('Adding a todo should update the list', () async {
      // Wait for initial load
      await container.read(todoListProvider.future);

      // Add a todo
      await container
          .read(todoListProvider.notifier)
          .addTodo('Test Todo', priority: TodoPriority.high);

      // Get the updated state
      final todos = container.read(todoListProvider).value!;

      expect(todos.length, 1);
      expect(todos.first.title, 'Test Todo');
      expect(todos.first.priority, TodoPriority.high);
      expect(todos.first.completed, false);
    });

    test('Toggling a todo should update completion status', () async {
      // Add a todo first
      await container.read(todoListProvider.future);
      await container
          .read(todoListProvider.notifier)
          .addTodo('Test Todo');

      final initialTodos = container.read(todoListProvider).value!;
      final todoId = initialTodos.first.id;

      // Toggle the todo
      await container.read(todoListProvider.notifier).toggleTodo(todoId);

      final updatedTodos = container.read(todoListProvider).value!;
      expect(updatedTodos.first.completed, true);

      // Toggle again
      await container.read(todoListProvider.notifier).toggleTodo(todoId);

      final finalTodos = container.read(todoListProvider).value!;
      expect(finalTodos.first.completed, false);
    });

    test('Removing a todo should delete it from the list', () async {
      // Add a todo
      await container.read(todoListProvider.future);
      await container
          .read(todoListProvider.notifier)
          .addTodo('Test Todo');

      final todos = container.read(todoListProvider).value!;
      final todoId = todos.first.id;

      // Remove the todo
      await container.read(todoListProvider.notifier).removeTodo(todoId);

      final updatedTodos = container.read(todoListProvider).value!;
      expect(updatedTodos, isEmpty);
    });

    test('Clear completed should only remove completed todos', () async {
      await container.read(todoListProvider.future);

      // Add multiple todos
      await container.read(todoListProvider.notifier).addTodo('Todo 1');
      await container.read(todoListProvider.notifier).addTodo('Todo 2');
      await container.read(todoListProvider.notifier).addTodo('Todo 3');

      var todos = container.read(todoListProvider).value!;

      // Complete first and third todos
      await container.read(todoListProvider.notifier).toggleTodo(todos[0].id);
      await container.read(todoListProvider.notifier).toggleTodo(todos[2].id);

      // Clear completed
      await container.read(todoListProvider.notifier).clearCompleted();

      final remainingTodos = container.read(todoListProvider).value!;
      expect(remainingTodos.length, 1);
      expect(remainingTodos.first.title, 'Todo 2');
    });

    test('Toggle all should complete all uncompleted todos', () async {
      await container.read(todoListProvider.future);

      // Add multiple todos
      await container.read(todoListProvider.notifier).addTodo('Todo 1');
      await container.read(todoListProvider.notifier).addTodo('Todo 2');

      // Toggle all
      await container.read(todoListProvider.notifier).toggleAll();

      final todos = container.read(todoListProvider).value!;
      expect(todos.every((todo) => todo.completed), true);

      // Toggle all again
      await container.read(todoListProvider.notifier).toggleAll();

      final updatedTodos = container.read(todoListProvider).value!;
      expect(updatedTodos.every((todo) => !todo.completed), true);
    });
  });

  group('Derived Provider Tests', () {
    late ProviderContainer container;
    late MockTodoRepository mockRepository;

    setUp(() {
      mockRepository = MockTodoRepository();
      container = ProviderContainer(
        overrides: [
          todoRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
    });

    tearDown(() {
      container.dispose();
    });

    test('Filtered todos provider should filter by status', () async {
      await container.read(todoListProvider.future);

      // Add todos
      await container.read(todoListProvider.notifier).addTodo('Active 1');
      await container.read(todoListProvider.notifier).addTodo('Active 2');
      await container.read(todoListProvider.notifier).addTodo('Completed');

      final todos = container.read(todoListProvider).value!;

      // Complete one todo
      await container
          .read(todoListProvider.notifier)
          .toggleTodo(todos.last.id);

      // Test all filter
      container.read(todoFilterProvider.notifier).state = TodoFilter.all;
      var filtered = container.read(filteredTodosProvider).value!;
      expect(filtered.length, 3);

      // Test active filter
      container.read(todoFilterProvider.notifier).state = TodoFilter.active;
      filtered = container.read(filteredTodosProvider).value!;
      expect(filtered.length, 2);

      // Test completed filter
      container.read(todoFilterProvider.notifier).state = TodoFilter.completed;
      filtered = container.read(filteredTodosProvider).value!;
      expect(filtered.length, 1);
    });

    test('Search query should filter todos by title', () async {
      await container.read(todoListProvider.future);

      // Add todos
      await container.read(todoListProvider.notifier).addTodo('Buy milk');
      await container.read(todoListProvider.notifier).addTodo('Buy bread');
      await container.read(todoListProvider.notifier).addTodo('Write code');

      // Search for "buy"
      container.read(searchQueryProvider.notifier).state = 'buy';
      final filtered = container.read(filteredTodosProvider).value!;
      expect(filtered.length, 2);
      expect(filtered.every((t) => t.title.toLowerCase().contains('buy')), true);
    });

    test('Uncompleted count provider should count active todos', () async {
      await container.read(todoListProvider.future);

      await container.read(todoListProvider.notifier).addTodo('Todo 1');
      await container.read(todoListProvider.notifier).addTodo('Todo 2');
      await container.read(todoListProvider.notifier).addTodo('Todo 3');

      expect(container.read(uncompletedTodosCountProvider), 3);

      final todos = container.read(todoListProvider).value!;
      await container
          .read(todoListProvider.notifier)
          .toggleTodo(todos.first.id);

      expect(container.read(uncompletedTodosCountProvider), 2);
      expect(container.read(completedTodosCountProvider), 1);
    });
  });

  group('Todo Model Tests', () {
    test('Todo should be immutable', () {
      final todo = Todo(
        id: '1',
        title: 'Test',
        createdAt: DateTime.now(),
      );

      final modified = todo.copyWith(title: 'Modified');

      expect(todo.title, 'Test');
      expect(modified.title, 'Modified');
      expect(todo.id, modified.id);
    });

    test('Toggle should flip completed status', () {
      final todo = Todo(
        id: '1',
        title: 'Test',
        createdAt: DateTime.now(),
      );

      expect(todo.completed, false);

      final toggled = todo.toggle();
      expect(toggled.completed, true);

      final toggledAgain = toggled.toggle();
      expect(toggledAgain.completed, false);
    });

    test('Todo equality should be based on ID', () {
      final now = DateTime.now();
      final todo1 = Todo(id: '1', title: 'Test', createdAt: now);
      final todo2 = Todo(id: '1', title: 'Different', createdAt: now);
      final todo3 = Todo(id: '2', title: 'Test', createdAt: now);

      expect(todo1, todo2); // Same ID
      expect(todo1, isNot(todo3)); // Different ID
    });
  });
}
