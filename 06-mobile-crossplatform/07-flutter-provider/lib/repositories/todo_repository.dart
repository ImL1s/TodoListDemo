import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/todo.dart';

/// TodoRepository - Data Persistence Layer
///
/// Handles all data storage and retrieval operations.
/// This separation follows the Repository pattern for:
/// - Better testability
/// - Separation of concerns
/// - Easy storage backend switching
class TodoRepository {
  static const String _storageKey = 'flutter_provider_todos';
  static const String _versionKey = 'data_version';
  static const int _currentVersion = 1;

  /// Load todos from SharedPreferences
  ///
  /// Returns an empty list if no data is found or an error occurs.
  /// Handles data migration if needed.
  Future<List<Todo>> loadTodos() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // Check and handle data migration
      await _handleMigration(prefs);

      // Load todos
      final String? todosJson = prefs.getString(_storageKey);

      if (todosJson == null || todosJson.isEmpty) {
        return [];
      }

      final List<dynamic> decoded = jsonDecode(todosJson);
      return decoded.map((json) => Todo.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      debugPrint('Error loading todos: $e');
      return [];
    }
  }

  /// Save todos to SharedPreferences
  ///
  /// Throws an exception if save fails, allowing callers to handle errors.
  Future<void> saveTodos(List<Todo> todos) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String todosJson = jsonEncode(
        todos.map((todo) => todo.toJson()).toList(),
      );
      final success = await prefs.setString(_storageKey, todosJson);

      if (!success) {
        throw Exception('Failed to save todos to storage');
      }
    } catch (e) {
      debugPrint('Error saving todos: $e');
      rethrow; // Re-throw to let provider handle it
    }
  }

  /// Clear all todos from storage
  Future<void> clearAll() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_storageKey);
    } catch (e) {
      debugPrint('Error clearing todos: $e');
      rethrow;
    }
  }

  /// Get storage statistics
  Future<Map<String, dynamic>> getStats() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final todosJson = prefs.getString(_storageKey);

      if (todosJson == null) {
        return {
          'count': 0,
          'size_bytes': 0,
          'version': 0,
        };
      }

      return {
        'count': (jsonDecode(todosJson) as List).length,
        'size_bytes': todosJson.length,
        'version': prefs.getInt(_versionKey) ?? 0,
      };
    } catch (e) {
      debugPrint('Error getting stats: $e');
      return {
        'count': 0,
        'size_bytes': 0,
        'version': 0,
      };
    }
  }

  /// Handle data migration between versions
  Future<void> _handleMigration(SharedPreferences prefs) async {
    final currentVersion = prefs.getInt(_versionKey) ?? 0;

    if (currentVersion < _currentVersion) {
      await _migrateData(prefs, currentVersion);
      await prefs.setInt(_versionKey, _currentVersion);
    }
  }

  /// Migrate data from old version to new version
  ///
  /// Add migration logic here when data structure changes.
  Future<void> _migrateData(SharedPreferences prefs, int fromVersion) async {
    debugPrint('Migrating data from version $fromVersion to $_currentVersion');

    // Example migration logic
    if (fromVersion == 0) {
      // Version 0 to 1: No migration needed yet
      // Future migrations would go here
    }
  }

  /// Export todos as JSON string
  ///
  /// Useful for backup or sharing functionality.
  Future<String?> exportTodos() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_storageKey);
    } catch (e) {
      debugPrint('Error exporting todos: $e');
      return null;
    }
  }

  /// Import todos from JSON string
  ///
  /// Validates and imports todos, replacing existing data.
  Future<bool> importTodos(String todosJson) async {
    try {
      // Validate JSON
      final decoded = jsonDecode(todosJson) as List;
      final todos = decoded.map((json) => Todo.fromJson(json as Map<String, dynamic>)).toList();

      // Save imported todos
      await saveTodos(todos);
      return true;
    } catch (e) {
      debugPrint('Error importing todos: $e');
      return false;
    }
  }
}
