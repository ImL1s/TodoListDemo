import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/todo.dart';

/// TodoProvider - ChangeNotifier for Todo State Management
///
/// This class extends ChangeNotifier (Provider's base class) and manages
/// the global todo list state. It handles CRUD operations and persistence.
///
/// Key Provider Concepts:
/// - ChangeNotifier: Base class that provides change notification capability
/// - notifyListeners(): Triggers UI rebuild for all listening widgets
/// - Automatic disposal: Provider handles disposing when no longer needed
class TodoProvider with ChangeNotifier {
  // Private list of todos - encapsulated state
  List<Todo> _todos = [];

  // Loading state for async operations
  bool _isLoading = false;

  // Storage key for SharedPreferences
  static const String _storageKey = 'flutter_provider_todos';

  // Public getters - expose immutable views of the state
  List<Todo> get todos => List.unmodifiable(_todos);
  bool get isLoading => _isLoading;

  // Computed properties - derived state
  int get totalCount => _todos.length;
  int get completedCount => _todos.where((todo) => todo.completed).length;
  int get activeCount => _todos.where((todo) => !todo.completed).length;

  List<Todo> get activeTodos =>
      _todos.where((todo) => !todo.completed).toList();

  List<Todo> get completedTodos =>
      _todos.where((todo) => todo.completed).toList();

  /// Constructor - Initialize and load todos
  TodoProvider() {
    _loadTodos();
  }

  /// Load todos from SharedPreferences
  ///
  /// This method is called on initialization to restore saved todos.
  /// Uses async/await pattern with proper loading state management.
  Future<void> _loadTodos() async {
    try {
      _isLoading = true;
      notifyListeners(); // Notify UI about loading state change

      final prefs = await SharedPreferences.getInstance();
      final String? todosJson = prefs.getString(_storageKey);

      if (todosJson != null) {
        final List<dynamic> decoded = jsonDecode(todosJson);
        _todos = decoded.map((json) => Todo.fromJson(json)).toList();
      }
    } catch (e) {
      debugPrint('Error loading todos: $e');
      // In production, you might want to show an error to the user
    } finally {
      _isLoading = false;
      notifyListeners(); // Notify UI about loading completion
    }
  }

  /// Save todos to SharedPreferences
  ///
  /// Called after every state mutation to persist changes.
  /// This ensures data survives app restarts.
  Future<void> _saveTodos() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String todosJson = jsonEncode(
        _todos.map((todo) => todo.toJson()).toList(),
      );
      await prefs.setString(_storageKey, todosJson);
    } catch (e) {
      debugPrint('Error saving todos: $e');
    }
  }

  /// Add a new todo
  ///
  /// Creates a new todo with the given title and adds it to the list.
  /// Automatically triggers UI rebuild via notifyListeners().
  Future<void> addTodo(String title) async {
    if (title.trim().isEmpty) return;

    final newTodo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title.trim(),
      completed: false,
      createdAt: DateTime.now(),
    );

    _todos.insert(0, newTodo); // Add to beginning of list
    notifyListeners(); // Trigger UI rebuild
    await _saveTodos(); // Persist changes
  }

  /// Toggle todo completion status
  ///
  /// Uses the copyWith pattern to create an updated todo.
  /// This maintains immutability while allowing updates.
  Future<void> toggleTodo(String id) async {
    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index == -1) return;

    _todos[index] = _todos[index].copyWith(
      completed: !_todos[index].completed,
    );

    notifyListeners(); // Trigger UI rebuild
    await _saveTodos(); // Persist changes
  }

  /// Delete a todo
  ///
  /// Removes the todo with the given id from the list.
  Future<void> deleteTodo(String id) async {
    _todos.removeWhere((todo) => todo.id == id);
    notifyListeners(); // Trigger UI rebuild
    await _saveTodos(); // Persist changes
  }

  /// Update todo title
  ///
  /// Allows editing an existing todo's title.
  Future<void> updateTodo(String id, String newTitle) async {
    if (newTitle.trim().isEmpty) return;

    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index == -1) return;

    _todos[index] = _todos[index].copyWith(
      title: newTitle.trim(),
    );

    notifyListeners(); // Trigger UI rebuild
    await _saveTodos(); // Persist changes
  }

  /// Clear all completed todos
  ///
  /// Batch operation to remove all completed items.
  Future<void> clearCompleted() async {
    _todos.removeWhere((todo) => todo.completed);
    notifyListeners(); // Trigger UI rebuild
    await _saveTodos(); // Persist changes
  }

  /// Toggle all todos completion status
  ///
  /// If all are completed, uncomplete all. Otherwise, complete all.
  Future<void> toggleAll() async {
    final allCompleted = _todos.isNotEmpty &&
                         _todos.every((todo) => todo.completed);

    _todos = _todos.map((todo) {
      return todo.copyWith(completed: !allCompleted);
    }).toList();

    notifyListeners(); // Trigger UI rebuild
    await _saveTodos(); // Persist changes
  }

  /// Clear all todos
  ///
  /// Removes all items from the list.
  Future<void> clearAll() async {
    _todos.clear();
    notifyListeners(); // Trigger UI rebuild
    await _saveTodos(); // Persist changes
  }

  /// Reload todos from storage
  ///
  /// Public method to manually refresh the todo list.
  Future<void> reload() async {
    await _loadTodos();
  }
}
