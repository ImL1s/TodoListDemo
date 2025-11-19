import 'dart:io';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

import '../models/todo.dart';

class StorageService {
  static Database? _database;
  static const String _tableName = 'todos';

  Future<void> init() async {
    if (_database != null) return;

    try {
      final Directory appDocDir = await getApplicationDocumentsDirectory();
      final String dbPath = join(appDocDir.path, 'flutter_desktop_todo.db');

      _database = await databaseFactory.openDatabase(
        dbPath,
        options: OpenDatabaseOptions(
          version: 1,
          onCreate: _onCreate,
          onUpgrade: _onUpgrade,
        ),
      );
    } catch (e) {
      print('Error initializing database: $e');
      rethrow;
    }
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $_tableName (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        completedAt TEXT,
        category TEXT,
        priority INTEGER NOT NULL DEFAULT 1
      )
    ''');

    // Create indexes for better query performance
    await db.execute(
      'CREATE INDEX idx_completed ON $_tableName(completed)',
    );
    await db.execute(
      'CREATE INDEX idx_priority ON $_tableName(priority)',
    );
    await db.execute(
      'CREATE INDEX idx_category ON $_tableName(category)',
    );
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle database upgrades here
  }

  Database get database {
    if (_database == null) {
      throw Exception('Database not initialized. Call init() first.');
    }
    return _database!;
  }

  // CRUD Operations

  Future<void> insertTodo(Todo todo) async {
    try {
      await database.insert(
        _tableName,
        todo.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    } catch (e) {
      print('Error inserting todo: $e');
      rethrow;
    }
  }

  Future<List<Todo>> getAllTodos() async {
    try {
      final List<Map<String, dynamic>> maps = await database.query(
        _tableName,
        orderBy: 'createdAt DESC',
      );

      return maps.map((map) => Todo.fromMap(map)).toList();
    } catch (e) {
      print('Error getting todos: $e');
      return [];
    }
  }

  Future<Todo?> getTodoById(String id) async {
    try {
      final List<Map<String, dynamic>> maps = await database.query(
        _tableName,
        where: 'id = ?',
        whereArgs: [id],
        limit: 1,
      );

      if (maps.isEmpty) return null;
      return Todo.fromMap(maps.first);
    } catch (e) {
      print('Error getting todo by id: $e');
      return null;
    }
  }

  Future<void> updateTodo(Todo todo) async {
    try {
      await database.update(
        _tableName,
        todo.toMap(),
        where: 'id = ?',
        whereArgs: [todo.id],
      );
    } catch (e) {
      print('Error updating todo: $e');
      rethrow;
    }
  }

  Future<void> deleteTodo(String id) async {
    try {
      await database.delete(
        _tableName,
        where: 'id = ?',
        whereArgs: [id],
      );
    } catch (e) {
      print('Error deleting todo: $e');
      rethrow;
    }
  }

  Future<void> deleteAllCompleted() async {
    try {
      await database.delete(
        _tableName,
        where: 'completed = ?',
        whereArgs: [1],
      );
    } catch (e) {
      print('Error deleting completed todos: $e');
      rethrow;
    }
  }

  Future<List<Todo>> getTodosByFilter(TodoFilter filter) async {
    try {
      String? where;
      List<dynamic>? whereArgs;

      switch (filter) {
        case TodoFilter.active:
          where = 'completed = ?';
          whereArgs = [0];
          break;
        case TodoFilter.completed:
          where = 'completed = ?';
          whereArgs = [1];
          break;
        case TodoFilter.all:
          break;
      }

      final List<Map<String, dynamic>> maps = await database.query(
        _tableName,
        where: where,
        whereArgs: whereArgs,
        orderBy: 'createdAt DESC',
      );

      return maps.map((map) => Todo.fromMap(map)).toList();
    } catch (e) {
      print('Error getting todos by filter: $e');
      return [];
    }
  }

  Future<List<String>> getCategories() async {
    try {
      final List<Map<String, dynamic>> maps = await database.query(
        _tableName,
        distinct: true,
        columns: ['category'],
        where: 'category IS NOT NULL',
      );

      return maps
          .map((map) => map['category'] as String)
          .where((category) => category.isNotEmpty)
          .toList();
    } catch (e) {
      print('Error getting categories: $e');
      return [];
    }
  }

  Future<Map<String, int>> getStatistics() async {
    try {
      final List<Map<String, dynamic>> allMaps = await database.query(_tableName);
      final List<Map<String, dynamic>> completedMaps = await database.query(
        _tableName,
        where: 'completed = ?',
        whereArgs: [1],
      );

      return {
        'total': allMaps.length,
        'completed': completedMaps.length,
        'active': allMaps.length - completedMaps.length,
      };
    } catch (e) {
      print('Error getting statistics: $e');
      return {'total': 0, 'completed': 0, 'active': 0};
    }
  }

  Future<void> close() async {
    await _database?.close();
    _database = null;
  }
}
