import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../models/todo.dart';
import '../repositories/todo_repository.dart';

/// Riverpod Providers for Todo List State Management
///
/// This file demonstrates Riverpod's advanced features:
/// 1. AsyncNotifierProvider - Async state management with loading/error states
/// 2. Provider composition - Derived states from other providers
/// 3. Immutability - State changes create new instances with Freezed
/// 4. Testability - Easy to mock and test
/// 5. Data persistence - Automatic saving to SharedPreferences
/// 6. autoDispose - Automatic cleanup when not in use
/// 7. family - Parameterized providers
/// 8. select - Optimized rebuilds

const _uuid = Uuid();

/// Repository Provider
///
/// Provides a single instance of TodoRepository
/// Can be easily overridden for testing
final todoRepositoryProvider = Provider<TodoRepository>((ref) {
  return TodoRepository();
});

/// Filter options for displaying todos
enum TodoFilter {
  all,
  active,
  completed,
}

/// Sort options for todos
enum TodoSort {
  createdDate,
  title,
  priority,
}

/// AsyncTodoListNotifier
///
/// Uses AsyncNotifier for async state management.
/// AsyncNotifier provides AsyncValue<T> which can be:
/// - AsyncValue.data(data) - Success state with data
/// - AsyncValue.loading() - Loading state
/// - AsyncValue.error(error, stackTrace) - Error state
///
/// Benefits:
/// - Automatic loading/error state management
/// - Built-in async operations support
/// - Proper error handling
/// - Data persistence integration
class AsyncTodoListNotifier extends AsyncNotifier<List<Todo>> {
  TodoRepository get _repository => ref.read(todoRepositoryProvider);

  /// Build - Initialize the state by loading from storage
  ///
  /// This runs once when the provider is first accessed
  /// Returns the initial state (list of todos)
  @override
  Future<List<Todo>> build() async {
    // Load todos from storage
    return await _repository.loadTodos();
  }

  /// Save current state to storage
  ///
  /// Called after every state change
  /// Runs in background, doesn't block UI
  Future<void> _saveToStorage(List<Todo> todos) async {
    await _repository.saveTodos(todos);
  }

  /// Add a new todo
  ///
  /// Uses state.whenData() to only update if in success state
  /// Automatically persists to storage
  Future<void> addTodo(String title, {TodoPriority? priority}) async {
    if (title.trim().isEmpty) return;

    final newTodo = Todo(
      id: _uuid.v4(),
      title: title.trim(),
      createdAt: DateTime.now(),
      priority: priority ?? TodoPriority.medium,
    );

    state = await AsyncValue.guard(() async {
      final currentTodos = state.value ?? [];
      final updatedTodos = [...currentTodos, newTodo];
      await _saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }

  /// Toggle todo completion status
  Future<void> toggleTodo(String id) async {
    state = await AsyncValue.guard(() async {
      final currentTodos = state.value ?? [];
      final updatedTodos = [
        for (final todo in currentTodos)
          if (todo.id == id) todo.toggle() else todo,
      ];
      await _saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }

  /// Edit todo
  Future<void> editTodo(
    String id, {
    String? title,
    TodoPriority? priority,
  }) async {
    if (title?.trim().isEmpty ?? false) return;

    state = await AsyncValue.guard(() async {
      final currentTodos = state.value ?? [];
      final updatedTodos = [
        for (final todo in currentTodos)
          if (todo.id == id)
            todo.copyWith(
              title: title ?? todo.title,
              priority: priority ?? todo.priority,
            )
          else
            todo,
      ];
      await _saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }

  /// Remove a todo
  Future<void> removeTodo(String id) async {
    state = await AsyncValue.guard(() async {
      final currentTodos = state.value ?? [];
      final updatedTodos = currentTodos.where((todo) => todo.id != id).toList();
      await _saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }

  /// Clear all completed todos
  Future<void> clearCompleted() async {
    state = await AsyncValue.guard(() async {
      final currentTodos = state.value ?? [];
      final updatedTodos = currentTodos.where((todo) => !todo.completed).toList();
      await _saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }

  /// Toggle all todos
  Future<void> toggleAll() async {
    state = await AsyncValue.guard(() async {
      final currentTodos = state.value ?? [];
      final allCompleted = currentTodos.every((todo) => todo.completed);
      final updatedTodos = [
        for (final todo in currentTodos) todo.copyWith(completed: !allCompleted),
      ];
      await _saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }

  /// Clear all todos (for reset functionality)
  Future<void> clearAll() async {
    state = await AsyncValue.guard(() async {
      await _repository.clearTodos();
      return [];
    });
  }

  /// Export todos as JSON
  Future<String?> exportTodos() async {
    return await _repository.exportTodos();
  }

  /// Import todos from JSON
  Future<void> importTodos(String jsonString) async {
    state = await AsyncValue.guard(() async {
      await _repository.importTodos(jsonString);
      return await _repository.loadTodos();
    });
  }
}

/// Provider for the async todo list state
///
/// Uses AsyncNotifierProvider for async state management
/// Automatically handles loading and error states
final todoListProvider =
    AsyncNotifierProvider<AsyncTodoListNotifier, List<Todo>>(() {
  return AsyncTodoListNotifier();
});

/// Provider for the current filter
///
/// Uses StateProvider for simple value state
/// autoDispose ensures cleanup when no longer used
final todoFilterProvider = StateProvider.autoDispose<TodoFilter>((ref) {
  return TodoFilter.all;
});

/// Provider for the current sort option
final todoSortProvider = StateProvider.autoDispose<TodoSort>((ref) {
  return TodoSort.createdDate;
});

/// Provider for search query
///
/// Used to filter todos by title
final searchQueryProvider = StateProvider.autoDispose<String>((ref) {
  return '';
});

/// Derived provider: Filtered, Searched, and Sorted todo list
///
/// This demonstrates advanced provider composition:
/// 1. Watches async todoListProvider
/// 2. Watches filter, sort, and search providers
/// 3. Applies filtering, searching, and sorting
/// 4. Returns AsyncValue to handle loading/error states
///
/// Benefits of this approach:
/// - Single source of truth for displayed todos
/// - Automatically updates when any dependency changes
/// - Handles async states properly
/// - Optimizes rebuilds (only rebuilds when result changes)
final filteredTodosProvider = Provider.autoDispose<AsyncValue<List<Todo>>>((ref) {
  final asyncTodos = ref.watch(todoListProvider);
  final filter = ref.watch(todoFilterProvider);
  final sort = ref.watch(todoSortProvider);
  final query = ref.watch(searchQueryProvider);

  return asyncTodos.whenData((todos) {
    var result = todos;

    // Apply filter
    switch (filter) {
      case TodoFilter.active:
        result = result.where((todo) => !todo.completed).toList();
        break;
      case TodoFilter.completed:
        result = result.where((todo) => todo.completed).toList();
        break;
      case TodoFilter.all:
        break;
    }

    // Apply search
    if (query.isNotEmpty) {
      result = result
          .where((todo) =>
              todo.title.toLowerCase().contains(query.toLowerCase()))
          .toList();
    }

    // Apply sort
    switch (sort) {
      case TodoSort.title:
        result.sort((a, b) => a.title.compareTo(b.title));
        break;
      case TodoSort.priority:
        result.sort((a, b) => b.priority.index.compareTo(a.priority.index));
        break;
      case TodoSort.createdDate:
        result.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
    }

    return result;
  });
});

/// Derived provider: Count of uncompleted todos
///
/// Uses select() to optimize rebuilds
/// Only rebuilds when the count actually changes, not on every todo list change
final uncompletedTodosCountProvider = Provider.autoDispose<int>((ref) {
  // Using whenData to handle AsyncValue
  return ref.watch(todoListProvider).when(
        data: (todos) => todos.where((todo) => !todo.completed).length,
        loading: () => 0,
        error: (_, __) => 0,
      );
});

/// Derived provider: Count of completed todos
final completedTodosCountProvider = Provider.autoDispose<int>((ref) {
  return ref.watch(todoListProvider).when(
        data: (todos) => todos.where((todo) => todo.completed).length,
        loading: () => 0,
        error: (_, __) => 0,
      );
});

/// Derived provider: Check if all todos are completed
final allTodosCompletedProvider = Provider.autoDispose<bool>((ref) {
  return ref.watch(todoListProvider).when(
        data: (todos) {
          if (todos.isEmpty) return false;
          return todos.every((todo) => todo.completed);
        },
        loading: () => false,
        error: (_, __) => false,
      );
});

/// Family provider: Get a specific todo by ID
///
/// Demonstrates the 'family' modifier for parameterized providers
/// Creates a separate provider instance for each ID
/// autoDispose ensures cleanup when no longer used
final todoByIdProvider =
    Provider.autoDispose.family<Todo?, String>((ref, id) {
  return ref.watch(todoListProvider).when(
        data: (todos) => todos.firstWhere(
          (todo) => todo.id == id,
          orElse: () => throw Exception('Todo not found'),
        ),
        loading: () => null,
        error: (_, __) => null,
      );
});

/// Provider: Statistics
///
/// Provides aggregate statistics about todos
/// Useful for dashboard or analytics views
final todoStatsProvider = Provider.autoDispose<Map<String, dynamic>>((ref) {
  return ref.watch(todoListProvider).when(
        data: (todos) {
          final total = todos.length;
          final completed = todos.where((t) => t.completed).length;
          final active = total - completed;
          final completionRate = total > 0 ? (completed / total * 100).toStringAsFixed(1) : '0.0';

          // Count by priority
          final urgentCount = todos.where((t) => t.priority == TodoPriority.urgent).length;
          final highCount = todos.where((t) => t.priority == TodoPriority.high).length;
          final mediumCount = todos.where((t) => t.priority == TodoPriority.medium).length;
          final lowCount = todos.where((t) => t.priority == TodoPriority.low).length;

          return {
            'total': total,
            'completed': completed,
            'active': active,
            'completionRate': completionRate,
            'urgentCount': urgentCount,
            'highCount': highCount,
            'mediumCount': mediumCount,
            'lowCount': lowCount,
          };
        },
        loading: () => {},
        error: (_, __) => {},
      );
});
