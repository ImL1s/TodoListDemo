import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_provider_todo/models/todo.dart';
import 'package:flutter_provider_todo/providers/todo_provider.dart';
import 'package:flutter_provider_todo/repositories/todo_repository.dart';

// Mock Repository for testing
class MockTodoRepository extends TodoRepository {
  final List<Todo> _mockTodos = [];

  @override
  Future<List<Todo>> loadTodos() async {
    return List.from(_mockTodos);
  }

  @override
  Future<void> saveTodos(List<Todo> todos) async {
    _mockTodos.clear();
    _mockTodos.addAll(todos);
  }

  @override
  Future<void> clearAll() async {
    _mockTodos.clear();
  }
}

void main() {
  group('TodoProvider', () {
    late TodoProvider provider;
    late MockTodoRepository repository;

    setUp(() {
      repository = MockTodoRepository();
      provider = TodoProvider(repository: repository);
    });

    test('initial state is empty', () {
      expect(provider.todos, isEmpty);
      expect(provider.totalCount, 0);
      expect(provider.activeCount, 0);
      expect(provider.completedCount, 0);
      expect(provider.isLoading, false);
      expect(provider.error, isNull);
    });

    group('CRUD Operations', () {
      test('adds todo successfully', () async {
        await provider.addTodo('Test Todo');

        expect(provider.todos.length, 1);
        expect(provider.todos.first.title, 'Test Todo');
        expect(provider.todos.first.completed, false);
        expect(provider.totalCount, 1);
        expect(provider.activeCount, 1);
        expect(provider.completedCount, 0);
      });

      test('validates todo title - empty', () {
        expect(provider.validateTodoTitle(''), isNotNull);
        expect(provider.validateTodoTitle('   '), isNotNull);
      });

      test('validates todo title - too long', () {
        final longTitle = 'a' * (TodoProvider.maxTitleLength + 1);
        expect(provider.validateTodoTitle(longTitle), isNotNull);
      });

      test('validates todo title - valid', () {
        expect(provider.validateTodoTitle('Valid todo'), isNull);
      });

      test('throws error on invalid title', () async {
        expect(
          () => provider.addTodo(''),
          throwsA(isA<ArgumentError>()),
        );
      });

      test('toggles todo completion', () async {
        await provider.addTodo('Test');
        final id = provider.todos.first.id;

        await provider.toggleTodo(id);
        expect(provider.todos.first.completed, true);
        expect(provider.completedCount, 1);
        expect(provider.activeCount, 0);

        await provider.toggleTodo(id);
        expect(provider.todos.first.completed, false);
        expect(provider.completedCount, 0);
        expect(provider.activeCount, 1);
      });

      test('deletes todo', () async {
        await provider.addTodo('Test 1');
        await provider.addTodo('Test 2');
        expect(provider.todos.length, 2);

        final id = provider.todos.first.id;
        await provider.deleteTodo(id);

        expect(provider.todos.length, 1);
        expect(provider.todos.first.title, 'Test 1');
      });

      test('updates todo title', () async {
        await provider.addTodo('Old Title');
        final id = provider.todos.first.id;

        await provider.updateTodo(id, 'New Title');
        expect(provider.todos.first.title, 'New Title');
      });

      test('throws error on invalid update', () async {
        await provider.addTodo('Test');
        final id = provider.todos.first.id;

        expect(
          () => provider.updateTodo(id, ''),
          throwsA(isA<ArgumentError>()),
        );
      });
    });

    group('Batch Operations', () {
      test('clears completed todos', () async {
        await provider.addTodo('Todo 1');
        await provider.addTodo('Todo 2');
        await provider.addTodo('Todo 3');

        await provider.toggleTodo(provider.todos[0].id);
        await provider.toggleTodo(provider.todos[2].id);

        await provider.clearCompleted();

        expect(provider.todos.length, 1);
        expect(provider.todos.first.title, 'Todo 2');
      });

      test('toggles all todos', () async {
        await provider.addTodo('Todo 1');
        await provider.addTodo('Todo 2');
        await provider.addTodo('Todo 3');

        // Toggle all to completed
        await provider.toggleAll();
        expect(provider.todos.every((t) => t.completed), true);
        expect(provider.completedCount, 3);
        expect(provider.activeCount, 0);

        // Toggle all to active
        await provider.toggleAll();
        expect(provider.todos.every((t) => !t.completed), true);
        expect(provider.completedCount, 0);
        expect(provider.activeCount, 3);
      });

      test('clears all todos', () async {
        await provider.addTodo('Todo 1');
        await provider.addTodo('Todo 2');
        await provider.addTodo('Todo 3');

        await provider.clearAll();

        expect(provider.todos, isEmpty);
        expect(provider.totalCount, 0);
      });
    });

    group('Statistics', () {
      test('computes statistics correctly', () async {
        await provider.addTodo('Todo 1');
        await provider.addTodo('Todo 2');
        await provider.addTodo('Todo 3');
        await provider.addTodo('Todo 4');

        await provider.toggleTodo(provider.todos[0].id);
        await provider.toggleTodo(provider.todos[2].id);

        expect(provider.totalCount, 4);
        expect(provider.completedCount, 2);
        expect(provider.activeCount, 2);
        expect(provider.progress, 0.5);
      });

      test('computes progress correctly', () async {
        expect(provider.progress, 0.0);

        await provider.addTodo('Todo 1');
        expect(provider.progress, 0.0);

        await provider.toggleTodo(provider.todos.first.id);
        expect(provider.progress, 1.0);

        await provider.addTodo('Todo 2');
        expect(provider.progress, 0.5);
      });

      test('provides active and completed lists', () async {
        await provider.addTodo('Active 1');
        await provider.addTodo('Active 2');
        await provider.addTodo('Completed 1');
        await provider.addTodo('Completed 2');

        await provider.toggleTodo(provider.todos[0].id);
        await provider.toggleTodo(provider.todos[1].id);

        expect(provider.activeTodos.length, 2);
        expect(provider.completedTodos.length, 2);

        expect(provider.activeTodos.every((t) => !t.completed), true);
        expect(provider.completedTodos.every((t) => t.completed), true);
      });
    });

    group('Search and Filter', () {
      setUp(() async {
        await provider.addTodo('Buy milk');
        await provider.addTodo('Buy bread');
        await provider.addTodo('Write code');
        await provider.addTodo('Review PR');
      });

      test('searches todos case-insensitively', () {
        provider.setSearchQuery('buy');
        expect(provider.filteredTodos.length, 2);

        provider.setSearchQuery('BUY');
        expect(provider.filteredTodos.length, 2);

        provider.setSearchQuery('milk');
        expect(provider.filteredTodos.length, 1);
        expect(provider.filteredTodos.first.title, 'Buy milk');
      });

      test('clears search', () {
        provider.setSearchQuery('buy');
        expect(provider.filteredTodos.length, 2);

        provider.clearSearch();
        expect(provider.searchQuery, '');
        expect(provider.filteredTodos.length, 4);
      });

      test('returns empty list when no matches', () {
        provider.setSearchQuery('nonexistent');
        expect(provider.filteredTodos, isEmpty);
      });
    });

    group('Sorting', () {
      setUp(() async {
        await provider.addTodo('Zebra');
        await Future.delayed(const Duration(milliseconds: 10));
        await provider.addTodo('Apple');
        await Future.delayed(const Duration(milliseconds: 10));
        await provider.addTodo('Mango');

        await provider.toggleTodo(provider.todos[1].id); // Complete 'Apple'
      });

      test('sorts by date newest first (default)', () {
        provider.setSortOption(TodoSortOption.dateNewest);
        final filtered = provider.filteredTodos;
        expect(filtered[0].title, 'Mango');
        expect(filtered[1].title, 'Apple');
        expect(filtered[2].title, 'Zebra');
      });

      test('sorts by date oldest first', () {
        provider.setSortOption(TodoSortOption.dateOldest);
        final filtered = provider.filteredTodos;
        expect(filtered[0].title, 'Zebra');
        expect(filtered[1].title, 'Apple');
        expect(filtered[2].title, 'Mango');
      });

      test('sorts by title A-Z', () {
        provider.setSortOption(TodoSortOption.titleAZ);
        final filtered = provider.filteredTodos;
        expect(filtered[0].title, 'Apple');
        expect(filtered[1].title, 'Mango');
        expect(filtered[2].title, 'Zebra');
      });

      test('sorts by title Z-A', () {
        provider.setSortOption(TodoSortOption.titleZA);
        final filtered = provider.filteredTodos;
        expect(filtered[0].title, 'Zebra');
        expect(filtered[1].title, 'Mango');
        expect(filtered[2].title, 'Apple');
      });

      test('sorts completed first', () {
        provider.setSortOption(TodoSortOption.completedFirst);
        final filtered = provider.filteredTodos;
        expect(filtered[0].title, 'Apple'); // Completed
        expect(filtered[0].completed, true);
        expect(filtered[1].completed, false);
        expect(filtered[2].completed, false);
      });

      test('sorts active first', () {
        provider.setSortOption(TodoSortOption.activeFirst);
        final filtered = provider.filteredTodos;
        expect(filtered[2].title, 'Apple'); // Completed at end
        expect(filtered[0].completed, false);
        expect(filtered[1].completed, false);
        expect(filtered[2].completed, true);
      });
    });

    group('Undo/Redo', () {
      test('can undo add operation', () async {
        expect(provider.canUndo, false);

        await provider.addTodo('Test 1');
        expect(provider.canUndo, true);
        expect(provider.todos.length, 1);

        await provider.undo();
        expect(provider.todos.length, 0);
      });

      test('can redo add operation', () async {
        await provider.addTodo('Test 1');
        await provider.undo();

        expect(provider.canRedo, true);

        await provider.redo();
        expect(provider.todos.length, 1);
        expect(provider.todos.first.title, 'Test 1');
      });

      test('can undo toggle operation', () async {
        await provider.addTodo('Test 1');
        final id = provider.todos.first.id;

        await provider.toggleTodo(id);
        expect(provider.todos.first.completed, true);

        await provider.undo();
        expect(provider.todos.first.completed, false);

        await provider.redo();
        expect(provider.todos.first.completed, true);
      });

      test('can undo delete operation', () async {
        await provider.addTodo('Test 1');
        final id = provider.todos.first.id;

        await provider.deleteTodo(id);
        expect(provider.todos, isEmpty);

        await provider.undo();
        expect(provider.todos.length, 1);
        expect(provider.todos.first.title, 'Test 1');
      });

      test('maintains history limit', () async {
        // Add more than max history size
        for (int i = 0; i < 60; i++) {
          await provider.addTodo('Todo $i');
        }

        // Should not be able to undo beyond limit
        int undoCount = 0;
        while (provider.canUndo) {
          await provider.undo();
          undoCount++;
        }

        expect(undoCount, lessThanOrEqualTo(50));
      });

      test('redo history cleared after new operation', () async {
        await provider.addTodo('Test 1');
        await provider.addTodo('Test 2');
        await provider.undo();

        expect(provider.canRedo, true);

        await provider.addTodo('Test 3');
        expect(provider.canRedo, false);
      });
    });

    group('Error Handling', () {
      test('clears error state', () async {
        // Simulate error by providing null to updateTodo
        try {
          await provider.updateTodo('nonexistent', 'New Title');
        } catch (_) {}

        provider.clearError();
        expect(provider.error, isNull);
      });
    });

    group('Integration with Repository', () {
      test('loads todos from repository', () async {
        // Pre-populate repository
        repository._mockTodos.add(Todo(
          id: '1',
          title: 'Existing Todo',
          completed: false,
          createdAt: DateTime.now(),
        ));

        // Create new provider to trigger load
        final newProvider = TodoProvider(repository: repository);

        // Wait for load to complete
        await Future.delayed(Duration.zero);

        expect(newProvider.totalCount, 1);
        expect(newProvider.todos.first.title, 'Existing Todo');
      });

      test('persists todos to repository', () async {
        await provider.addTodo('Test 1');
        await provider.addTodo('Test 2');

        expect(repository._mockTodos.length, 2);
        expect(repository._mockTodos.first.title, 'Test 2'); // Newest first
      });

      test('reload refreshes todos from repository', () async {
        await provider.addTodo('Test 1');

        // Modify repository directly
        repository._mockTodos.clear();

        await provider.reload();
        expect(provider.todos, isEmpty);
      });
    });
  });

  group('Todo Model', () {
    test('creates todo with required fields', () {
      final now = DateTime.now();
      final todo = Todo(
        id: '1',
        title: 'Test',
        completed: false,
        createdAt: now,
      );

      expect(todo.id, '1');
      expect(todo.title, 'Test');
      expect(todo.completed, false);
      expect(todo.createdAt, now);
    });

    test('copyWith creates modified copy', () {
      final todo = Todo(
        id: '1',
        title: 'Test',
        completed: false,
        createdAt: DateTime.now(),
      );

      final modified = todo.copyWith(
        title: 'Modified',
        completed: true,
      );

      expect(modified.id, todo.id);
      expect(modified.title, 'Modified');
      expect(modified.completed, true);
      expect(modified.createdAt, todo.createdAt);
    });

    test('toJson and fromJson are symmetric', () {
      final original = Todo(
        id: '1',
        title: 'Test',
        completed: true,
        createdAt: DateTime.parse('2024-01-01T12:00:00.000Z'),
      );

      final json = original.toJson();
      final restored = Todo.fromJson(json);

      expect(restored, original); // Uses Equatable
      expect(restored.id, original.id);
      expect(restored.title, original.title);
      expect(restored.completed, original.completed);
      expect(
        restored.createdAt.millisecondsSinceEpoch,
        original.createdAt.millisecondsSinceEpoch,
      );
    });

    test('equatable comparison works correctly', () {
      final now = DateTime.now();
      final todo1 = Todo(
        id: '1',
        title: 'Test',
        completed: false,
        createdAt: now,
      );
      final todo2 = Todo(
        id: '1',
        title: 'Test',
        completed: false,
        createdAt: now,
      );
      final todo3 = Todo(
        id: '2',
        title: 'Test',
        completed: false,
        createdAt: now,
      );

      expect(todo1, todo2);
      expect(todo1, isNot(todo3));
      expect(todo1.hashCode, todo2.hashCode);
      expect(todo1.hashCode, isNot(todo3.hashCode));
    });
  });
}
