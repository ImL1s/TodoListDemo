import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';
import '../models/todo.dart';

/// Riverpod Providers for Todo List State Management
///
/// This file demonstrates Riverpod's key features:
/// 1. Compile-time safety - No runtime errors from typos
/// 2. Provider composition - Derived states from other providers
/// 3. Immutability - State changes create new instances
/// 4. Testability - Easy to mock and test

const _uuid = Uuid();

/// Filter options for displaying todos
enum TodoFilter {
  all,
  active,
  completed,
}

/// Main state provider for the todo list
/// Uses StateNotifier for complex state management with methods
class TodoListNotifier extends StateNotifier<List<Todo>> {
  TodoListNotifier() : super([]);

  /// Add a new todo
  void addTodo(String title) {
    if (title.trim().isEmpty) return;

    final newTodo = Todo(
      id: _uuid.v4(),
      title: title.trim(),
      createdAt: DateTime.now(),
    );

    state = [...state, newTodo];
  }

  /// Toggle todo completion status
  void toggleTodo(String id) {
    state = [
      for (final todo in state)
        if (todo.id == id) todo.toggle() else todo,
    ];
  }

  /// Edit todo title
  void editTodo(String id, String newTitle) {
    if (newTitle.trim().isEmpty) return;

    state = [
      for (final todo in state)
        if (todo.id == id) todo.copyWith(title: newTitle.trim()) else todo,
    ];
  }

  /// Remove a todo
  void removeTodo(String id) {
    state = state.where((todo) => todo.id != id).toList();
  }

  /// Clear all completed todos
  void clearCompleted() {
    state = state.where((todo) => !todo.completed).toList();
  }

  /// Toggle all todos
  void toggleAll() {
    final allCompleted = state.every((todo) => todo.completed);
    state = [
      for (final todo in state) todo.copyWith(completed: !allCompleted),
    ];
  }
}

/// Provider for the todo list state
/// This is the main provider that holds all todos
final todoListProvider =
    StateNotifierProvider<TodoListNotifier, List<Todo>>((ref) {
  return TodoListNotifier();
});

/// Provider for the current filter
/// Simple state provider for a single value
final todoFilterProvider = StateProvider<TodoFilter>((ref) {
  return TodoFilter.all;
});

/// Derived provider: Filtered todo list
/// Automatically rebuilds when todoListProvider or todoFilterProvider changes
/// This demonstrates provider composition - one of Riverpod's key features
final filteredTodosProvider = Provider<List<Todo>>((ref) {
  final filter = ref.watch(todoFilterProvider);
  final todos = ref.watch(todoListProvider);

  switch (filter) {
    case TodoFilter.active:
      return todos.where((todo) => !todo.completed).toList();
    case TodoFilter.completed:
      return todos.where((todo) => todo.completed).toList();
    case TodoFilter.all:
    default:
      return todos;
  }
});

/// Derived provider: Count of uncompleted todos
final uncompletedTodosCountProvider = Provider<int>((ref) {
  final todos = ref.watch(todoListProvider);
  return todos.where((todo) => !todo.completed).length;
});

/// Derived provider: Count of completed todos
final completedTodosCountProvider = Provider<int>((ref) {
  final todos = ref.watch(todoListProvider);
  return todos.where((todo) => todo.completed).length;
});

/// Derived provider: Check if all todos are completed
final allTodosCompletedProvider = Provider<bool>((ref) {
  final todos = ref.watch(todoListProvider);
  if (todos.isEmpty) return false;
  return todos.every((todo) => todo.completed);
});
