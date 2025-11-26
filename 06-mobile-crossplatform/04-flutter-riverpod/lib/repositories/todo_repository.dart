import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/todo.dart';

/// TodoRepository
///
/// Handles data persistence using SharedPreferences.
/// This demonstrates:
/// - Separation of concerns (data layer vs business logic)
/// - Async operations with error handling
/// - JSON serialization/deserialization with Freezed
/// - Repository pattern for testability
///
/// Benefits:
/// - Easy to mock for testing
/// - Can be replaced with other storage (SQLite, Hive, etc.)
/// - Centralizes data access logic
class TodoRepository {
  static const String _storageKey = 'todos';

  /// Load todos from storage
  ///
  /// Returns empty list if no data or on error
  /// Handles JSON parsing errors gracefully
  Future<List<Todo>> loadTodos() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_storageKey);

      if (jsonString == null || jsonString.isEmpty) {
        return [];
      }

      final List<dynamic> jsonList = jsonDecode(jsonString);
      return jsonList
          .map((json) => Todo.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      // Log error in production, you might want to use a logging package
      print('Error loading todos: $e');
      return [];
    }
  }

  /// Save todos to storage
  ///
  /// Serializes todos to JSON and saves to SharedPreferences
  /// Returns true on success, false on error
  Future<bool> saveTodos(List<Todo> todos) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonList = todos.map((todo) => todo.toJson()).toList();
      final jsonString = jsonEncode(jsonList);

      return await prefs.setString(_storageKey, jsonString);
    } catch (e) {
      print('Error saving todos: $e');
      return false;
    }
  }

  /// Clear all todos from storage
  ///
  /// Useful for logout or reset functionality
  Future<bool> clearTodos() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.remove(_storageKey);
    } catch (e) {
      print('Error clearing todos: $e');
      return false;
    }
  }

  /// Export todos as JSON string
  ///
  /// Useful for backup or sharing functionality
  Future<String?> exportTodos() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_storageKey);
    } catch (e) {
      print('Error exporting todos: $e');
      return null;
    }
  }

  /// Import todos from JSON string
  ///
  /// Validates and saves imported data
  Future<bool> importTodos(String jsonString) async {
    try {
      final List<dynamic> jsonList = jsonDecode(jsonString);
      final todos = jsonList
          .map((json) => Todo.fromJson(json as Map<String, dynamic>))
          .toList();

      return await saveTodos(todos);
    } catch (e) {
      print('Error importing todos: $e');
      return false;
    }
  }
}
