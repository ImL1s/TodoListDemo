import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';

import '../models/todo.dart';
import '../services/storage_service.dart';

class TodoProvider extends ChangeNotifier {
  final StorageService _storageService;
  List<Todo> _todos = [];
  TodoFilter _currentFilter = TodoFilter.all;
  TodoSort _currentSort = TodoSort.createdDate;
  String? _selectedCategory;
  bool _isLoading = false;
  String _searchQuery = '';

  TodoProvider(this._storageService);

  // Getters
  List<Todo> get todos => _getFilteredAndSortedTodos();
  List<Todo> get allTodos => _todos;
  TodoFilter get currentFilter => _currentFilter;
  TodoSort get currentSort => _currentSort;
  String? get selectedCategory => _selectedCategory;
  bool get isLoading => _isLoading;
  String get searchQuery => _searchQuery;

  int get totalCount => _todos.length;
  int get activeCount => _todos.where((t) => !t.completed).length;
  int get completedCount => _todos.where((t) => t.completed).length;

  List<String> get categories {
    final Set<String> categorySet = {};
    for (var todo in _todos) {
      if (todo.category != null && todo.category!.isNotEmpty) {
        categorySet.add(todo.category!);
      }
    }
    return categorySet.toList()..sort();
  }

  // Load todos from storage
  Future<void> loadTodos() async {
    _isLoading = true;
    notifyListeners();

    try {
      _todos = await _storageService.getAllTodos();
    } catch (e) {
      print('Error loading todos: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add todo
  Future<void> addTodo({
    required String title,
    String? description,
    String? category,
    int priority = 1,
  }) async {
    final todo = Todo(
      id: const Uuid().v4(),
      title: title,
      description: description,
      category: category,
      priority: priority,
    );

    try {
      await _storageService.insertTodo(todo);
      _todos.insert(0, todo);
      notifyListeners();
    } catch (e) {
      print('Error adding todo: $e');
      rethrow;
    }
  }

  // Update todo
  Future<void> updateTodo(Todo todo) async {
    try {
      await _storageService.updateTodo(todo);
      final index = _todos.indexWhere((t) => t.id == todo.id);
      if (index != -1) {
        _todos[index] = todo;
        notifyListeners();
      }
    } catch (e) {
      print('Error updating todo: $e');
      rethrow;
    }
  }

  // Toggle todo completion
  Future<void> toggleTodo(String id) async {
    final index = _todos.indexWhere((t) => t.id == id);
    if (index == -1) return;

    final todo = _todos[index];
    final updatedTodo = todo.copyWith(
      completed: !todo.completed,
      completedAt: !todo.completed ? DateTime.now() : null,
    );

    await updateTodo(updatedTodo);
  }

  // Delete todo
  Future<void> deleteTodo(String id) async {
    try {
      await _storageService.deleteTodo(id);
      _todos.removeWhere((t) => t.id == id);
      notifyListeners();
    } catch (e) {
      print('Error deleting todo: $e');
      rethrow;
    }
  }

  // Delete all completed todos
  Future<void> clearCompleted() async {
    try {
      await _storageService.deleteAllCompleted();
      _todos.removeWhere((t) => t.completed);
      notifyListeners();
    } catch (e) {
      print('Error clearing completed todos: $e');
      rethrow;
    }
  }

  // Set filter
  void setFilter(TodoFilter filter) {
    if (_currentFilter != filter) {
      _currentFilter = filter;
      notifyListeners();
    }
  }

  // Set sort
  void setSort(TodoSort sort) {
    if (_currentSort != sort) {
      _currentSort = sort;
      notifyListeners();
    }
  }

  // Set category filter
  void setCategory(String? category) {
    if (_selectedCategory != category) {
      _selectedCategory = category;
      notifyListeners();
    }
  }

  // Set search query
  void setSearchQuery(String query) {
    if (_searchQuery != query) {
      _searchQuery = query;
      notifyListeners();
    }
  }

  // Get filtered and sorted todos
  List<Todo> _getFilteredAndSortedTodos() {
    var filtered = _todos.where((todo) {
      // Apply completion filter
      bool matchesFilter = switch (_currentFilter) {
        TodoFilter.all => true,
        TodoFilter.active => !todo.completed,
        TodoFilter.completed => todo.completed,
      };

      // Apply category filter
      bool matchesCategory = _selectedCategory == null ||
          todo.category == _selectedCategory;

      // Apply search filter
      bool matchesSearch = _searchQuery.isEmpty ||
          todo.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (todo.description?.toLowerCase().contains(_searchQuery.toLowerCase()) ??
              false);

      return matchesFilter && matchesCategory && matchesSearch;
    }).toList();

    // Sort
    filtered.sort((a, b) {
      switch (_currentSort) {
        case TodoSort.createdDate:
          return b.createdAt.compareTo(a.createdAt);
        case TodoSort.priority:
          final priorityCompare = b.priority.compareTo(a.priority);
          if (priorityCompare != 0) return priorityCompare;
          return b.createdAt.compareTo(a.createdAt);
        case TodoSort.title:
          return a.title.toLowerCase().compareTo(b.title.toLowerCase());
      }
    });

    return filtered;
  }

  // Toggle all todos
  Future<void> toggleAll(bool completed) async {
    try {
      final futures = _todos.map((todo) {
        if (todo.completed != completed) {
          final updatedTodo = todo.copyWith(
            completed: completed,
            completedAt: completed ? DateTime.now() : null,
          );
          return updateTodo(updatedTodo);
        }
        return Future.value();
      });

      await Future.wait(futures);
    } catch (e) {
      print('Error toggling all todos: $e');
      rethrow;
    }
  }
}
