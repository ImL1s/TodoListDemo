import 'package:flutter/foundation.dart';
import '../models/todo.dart';
import '../repositories/todo_repository.dart';

/// Sort options for todo list
enum TodoSortOption {
  dateNewest('Newest First'),
  dateOldest('Oldest First'),
  titleAZ('Title A-Z'),
  titleZA('Title Z-A'),
  completedFirst('Completed First'),
  activeFirst('Active First');

  final String label;
  const TodoSortOption(this.label);
}

/// TodoProvider - Enhanced ChangeNotifier for Todo State Management
///
/// This class extends ChangeNotifier and manages the global todo list state.
/// It handles CRUD operations, persistence, search, sort, and error handling.
///
/// Key Features:
/// - ✅ CRUD operations with validation
/// - ✅ Search and filter functionality
/// - ✅ Sort options
/// - ✅ Error state management
/// - ✅ Loading states
/// - ✅ Repository pattern for data persistence
/// - ✅ Undo/Redo capability (via history)
class TodoProvider with ChangeNotifier {
  // Dependencies
  final TodoRepository _repository;

  // Private state
  List<Todo> _todos = [];
  bool _isLoading = false;
  String? _error;
  String _searchQuery = '';
  TodoSortOption _sortOption = TodoSortOption.dateNewest;

  // History for undo/redo (limited to last 50 states)
  final List<List<Todo>> _history = [];
  int _currentHistoryIndex = -1;
  static const int _maxHistorySize = 50;

  // Validation constants
  static const int maxTitleLength = 100;
  static const int minTitleLength = 1;

  // Constructor with dependency injection
  TodoProvider({TodoRepository? repository})
      : _repository = repository ?? TodoRepository() {
    _loadTodos();
  }

  // ============================================================================
  // Public Getters - Expose immutable views of state
  // ============================================================================

  /// Immutable view of all todos
  List<Todo> get todos => List.unmodifiable(_todos);

  /// Loading state
  bool get isLoading => _isLoading;

  /// Error message (null if no error)
  String? get error => _error;

  /// Current search query
  String get searchQuery => _searchQuery;

  /// Current sort option
  TodoSortOption get sortOption => _sortOption;

  /// Undo/Redo state
  bool get canUndo => _currentHistoryIndex > 0;
  bool get canRedo => _currentHistoryIndex < _history.length - 1;

  // ============================================================================
  // Computed Properties - Derived state with caching
  // ============================================================================

  List<Todo>? _cachedFilteredTodos;
  String? _lastSearchQuery;
  TodoSortOption? _lastSortOption;

  /// Get filtered and sorted todos based on current search and sort options
  List<Todo> get filteredTodos {
    // Return cached result if search/sort hasn't changed
    if (_cachedFilteredTodos != null &&
        _lastSearchQuery == _searchQuery &&
        _lastSortOption == _sortOption) {
      return _cachedFilteredTodos!;
    }

    // Apply search filter
    var result = _todos;
    if (_searchQuery.isNotEmpty) {
      result = result
          .where((todo) =>
              todo.title.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList();
    }

    // Apply sort
    result = _applySorting(result);

    // Cache result
    _cachedFilteredTodos = result;
    _lastSearchQuery = _searchQuery;
    _lastSortOption = _sortOption;

    return List.unmodifiable(result);
  }

  /// Total count of all todos
  int get totalCount => _todos.length;

  /// Count of completed todos
  int get completedCount => _todos.where((todo) => todo.completed).length;

  /// Count of active (not completed) todos
  int get activeCount => _todos.where((todo) => !todo.completed).length;

  /// List of active todos
  List<Todo> get activeTodos =>
      List.unmodifiable(_todos.where((todo) => !todo.completed).toList());

  /// List of completed todos
  List<Todo> get completedTodos =>
      List.unmodifiable(_todos.where((todo) => todo.completed).toList());

  /// Completion progress (0.0 to 1.0)
  double get progress =>
      totalCount == 0 ? 0.0 : completedCount / totalCount;

  // ============================================================================
  // Data Loading and Persistence
  // ============================================================================

  /// Load todos from repository
  Future<void> _loadTodos() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      _todos = await _repository.loadTodos();

      // Initialize history with loaded state
      _pushToHistory();
    } catch (e) {
      _error = 'Failed to load todos: $e';
      debugPrint(_error);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Save todos to repository
  Future<void> _saveTodos() async {
    try {
      await _repository.saveTodos(_todos);
    } catch (e) {
      _error = 'Failed to save todos: $e';
      debugPrint(_error);
      notifyListeners();
      rethrow; // Let caller handle the error
    }
  }

  /// Reload todos from storage
  Future<void> reload() async {
    await _loadTodos();
  }

  // ============================================================================
  // CRUD Operations with Validation
  // ============================================================================

  /// Validate todo title
  String? validateTodoTitle(String title) {
    final trimmed = title.trim();

    if (trimmed.length < minTitleLength) {
      return 'Title cannot be empty';
    }

    if (trimmed.length > maxTitleLength) {
      return 'Title must be less than $maxTitleLength characters';
    }

    return null; // Validation passed
  }

  /// Add a new todo
  ///
  /// Throws ArgumentError if validation fails.
  Future<void> addTodo(String title) async {
    // Validate input
    final validationError = validateTodoTitle(title);
    if (validationError != null) {
      throw ArgumentError(validationError);
    }

    final newTodo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title.trim(),
      completed: false,
      createdAt: DateTime.now(),
    );

    try {
      _todos.insert(0, newTodo);
      _clearCache();
      _pushToHistory();
      notifyListeners();
      await _saveTodos();
    } catch (e) {
      // Rollback on error
      _todos.removeAt(0);
      _clearCache();
      notifyListeners();
      rethrow;
    }
  }

  /// Toggle todo completion status
  Future<void> toggleTodo(String id) async {
    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index == -1) return;

    final oldTodo = _todos[index];

    try {
      _todos[index] = _todos[index].copyWith(
        completed: !_todos[index].completed,
      );
      _clearCache();
      _pushToHistory();
      notifyListeners();
      await _saveTodos();
    } catch (e) {
      // Rollback on error
      _todos[index] = oldTodo;
      _clearCache();
      notifyListeners();
      rethrow;
    }
  }

  /// Delete a todo
  Future<void> deleteTodo(String id) async {
    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index == -1) return;

    final removedTodo = _todos[index];

    try {
      _todos.removeAt(index);
      _clearCache();
      _pushToHistory();
      notifyListeners();
      await _saveTodos();
    } catch (e) {
      // Rollback on error
      _todos.insert(index, removedTodo);
      _clearCache();
      notifyListeners();
      rethrow;
    }
  }

  /// Update todo title
  ///
  /// Throws ArgumentError if validation fails.
  Future<void> updateTodo(String id, String newTitle) async {
    // Validate input
    final validationError = validateTodoTitle(newTitle);
    if (validationError != null) {
      throw ArgumentError(validationError);
    }

    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index == -1) return;

    final oldTodo = _todos[index];

    try {
      _todos[index] = _todos[index].copyWith(
        title: newTitle.trim(),
      );
      _clearCache();
      _pushToHistory();
      notifyListeners();
      await _saveTodos();
    } catch (e) {
      // Rollback on error
      _todos[index] = oldTodo;
      _clearCache();
      notifyListeners();
      rethrow;
    }
  }

  // ============================================================================
  // Batch Operations
  // ============================================================================

  /// Clear all completed todos
  Future<void> clearCompleted() async {
    final oldTodos = List<Todo>.from(_todos);

    try {
      _todos.removeWhere((todo) => todo.completed);
      _clearCache();
      _pushToHistory();
      notifyListeners();
      await _saveTodos();
    } catch (e) {
      // Rollback on error
      _todos = oldTodos;
      _clearCache();
      notifyListeners();
      rethrow;
    }
  }

  /// Toggle all todos completion status
  Future<void> toggleAll() async {
    final oldTodos = List<Todo>.from(_todos);
    final allCompleted =
        _todos.isNotEmpty && _todos.every((todo) => todo.completed);

    try {
      _todos = _todos
          .map((todo) => todo.copyWith(completed: !allCompleted))
          .toList();
      _clearCache();
      _pushToHistory();
      notifyListeners();
      await _saveTodos();
    } catch (e) {
      // Rollback on error
      _todos = oldTodos;
      _clearCache();
      notifyListeners();
      rethrow;
    }
  }

  /// Clear all todos
  Future<void> clearAll() async {
    final oldTodos = List<Todo>.from(_todos);

    try {
      _todos.clear();
      _clearCache();
      _pushToHistory();
      notifyListeners();
      await _saveTodos();
    } catch (e) {
      // Rollback on error
      _todos = oldTodos;
      _clearCache();
      notifyListeners();
      rethrow;
    }
  }

  // ============================================================================
  // Search and Filter
  // ============================================================================

  /// Set search query
  void setSearchQuery(String query) {
    if (_searchQuery == query) return;

    _searchQuery = query;
    _clearCache();
    notifyListeners();
  }

  /// Clear search query
  void clearSearch() {
    if (_searchQuery.isEmpty) return;

    _searchQuery = '';
    _clearCache();
    notifyListeners();
  }

  // ============================================================================
  // Sorting
  // ============================================================================

  /// Set sort option
  void setSortOption(TodoSortOption option) {
    if (_sortOption == option) return;

    _sortOption = option;
    _clearCache();
    notifyListeners();
  }

  /// Apply sorting to todo list
  List<Todo> _applySorting(List<Todo> todos) {
    final list = todos.toList();

    switch (_sortOption) {
      case TodoSortOption.dateNewest:
        list.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      case TodoSortOption.dateOldest:
        list.sort((a, b) => a.createdAt.compareTo(b.createdAt));
      case TodoSortOption.titleAZ:
        list.sort((a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
      case TodoSortOption.titleZA:
        list.sort((a, b) => b.title.toLowerCase().compareTo(a.title.toLowerCase()));
      case TodoSortOption.completedFirst:
        list.sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0));
      case TodoSortOption.activeFirst:
        list.sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));
    }

    return list;
  }

  // ============================================================================
  // Undo/Redo
  // ============================================================================

  /// Push current state to history
  void _pushToHistory() {
    // Remove all states after current index
    if (_currentHistoryIndex < _history.length - 1) {
      _history.removeRange(_currentHistoryIndex + 1, _history.length);
    }

    // Add current state
    _history.add(_todos.map((t) => t).toList());
    _currentHistoryIndex++;

    // Limit history size
    if (_history.length > _maxHistorySize) {
      _history.removeAt(0);
      _currentHistoryIndex--;
    }
  }

  /// Undo last operation
  Future<void> undo() async {
    if (!canUndo) return;

    _currentHistoryIndex--;
    _todos = _history[_currentHistoryIndex].map((t) => t).toList();
    _clearCache();
    notifyListeners();

    try {
      await _saveTodos();
    } catch (e) {
      debugPrint('Error saving during undo: $e');
    }
  }

  /// Redo last undone operation
  Future<void> redo() async {
    if (!canRedo) return;

    _currentHistoryIndex++;
    _todos = _history[_currentHistoryIndex].map((t) => t).toList();
    _clearCache();
    notifyListeners();

    try {
      await _saveTodos();
    } catch (e) {
      debugPrint('Error saving during redo: $e');
    }
  }

  // ============================================================================
  // Error Handling
  // ============================================================================

  /// Clear error state
  void clearError() {
    if (_error == null) return;

    _error = null;
    notifyListeners();
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /// Clear cached filtered todos
  void _clearCache() {
    _cachedFilteredTodos = null;
    _lastSearchQuery = null;
    _lastSortOption = null;
  }

  /// Export todos as JSON
  Future<String?> exportTodos() async {
    try {
      return await _repository.exportTodos();
    } catch (e) {
      _error = 'Failed to export todos: $e';
      debugPrint(_error);
      notifyListeners();
      return null;
    }
  }

  /// Import todos from JSON
  Future<bool> importTodos(String todosJson) async {
    try {
      final success = await _repository.importTodos(todosJson);
      if (success) {
        await _loadTodos();
      }
      return success;
    } catch (e) {
      _error = 'Failed to import todos: $e';
      debugPrint(_error);
      notifyListeners();
      return false;
    }
  }

  /// Get storage statistics
  Future<Map<String, dynamic>> getStorageStats() async {
    try {
      return await _repository.getStats();
    } catch (e) {
      debugPrint('Error getting stats: $e');
      return {};
    }
  }
}
