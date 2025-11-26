import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_basic_todo/models/todo.dart';
import 'package:flutter_basic_todo/services/todo_storage_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('TodoStorageService Tests', () {
    setUp(() async {
      // 在每個測試之前清空 SharedPreferences
      SharedPreferences.setMockInitialValues({});
    });

    test('Should save and load todos correctly', () async {
      final todos = [
        Todo(id: '1', title: 'Todo 1', isCompleted: false),
        Todo(id: '2', title: 'Todo 2', isCompleted: true),
      ];

      await TodoStorageService.saveTodos(todos);
      final loadedTodos = await TodoStorageService.loadTodos();

      expect(loadedTodos.length, 2);
      expect(loadedTodos[0].id, '1');
      expect(loadedTodos[0].title, 'Todo 1');
      expect(loadedTodos[0].isCompleted, false);
      expect(loadedTodos[1].id, '2');
      expect(loadedTodos[1].title, 'Todo 2');
      expect(loadedTodos[1].isCompleted, true);
    });

    test('Should return empty list when no todos exist', () async {
      final todos = await TodoStorageService.loadTodos();

      expect(todos, isEmpty);
    });

    test('Should overwrite existing todos when saving', () async {
      final todos1 = [
        Todo(id: '1', title: 'Todo 1'),
      ];

      await TodoStorageService.saveTodos(todos1);

      final todos2 = [
        Todo(id: '2', title: 'Todo 2'),
        Todo(id: '3', title: 'Todo 3'),
      ];

      await TodoStorageService.saveTodos(todos2);
      final loadedTodos = await TodoStorageService.loadTodos();

      expect(loadedTodos.length, 2);
      expect(loadedTodos[0].id, '2');
      expect(loadedTodos[1].id, '3');
    });

    test('Should save empty list correctly', () async {
      // 先保存一些數據
      await TodoStorageService.saveTodos([
        Todo(id: '1', title: 'Todo 1'),
      ]);

      // 然後保存空列表
      await TodoStorageService.saveTodos([]);

      final loadedTodos = await TodoStorageService.loadTodos();

      expect(loadedTodos, isEmpty);
    });

    test('Should clear todos correctly', () async {
      final todos = [
        Todo(id: '1', title: 'Todo 1'),
        Todo(id: '2', title: 'Todo 2'),
      ];

      await TodoStorageService.saveTodos(todos);
      await TodoStorageService.clearTodos();

      final loadedTodos = await TodoStorageService.loadTodos();

      expect(loadedTodos, isEmpty);
    });

    test('Should preserve all todo properties', () async {
      final now = DateTime.parse('2024-01-01T12:00:00.000');
      final todos = [
        Todo(
          id: '123',
          title: 'Complete Todo',
          isCompleted: true,
          createdAt: now,
        ),
      ];

      await TodoStorageService.saveTodos(todos);
      final loadedTodos = await TodoStorageService.loadTodos();

      expect(loadedTodos[0].id, '123');
      expect(loadedTodos[0].title, 'Complete Todo');
      expect(loadedTodos[0].isCompleted, true);
      expect(loadedTodos[0].createdAt, now);
    });
  });
}
