import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_basic_todo/models/todo.dart';

void main() {
  group('Todo Model Tests', () {
    test('Should create a new Todo with default values', () {
      final todo = Todo(title: 'Test Todo');

      expect(todo.title, 'Test Todo');
      expect(todo.isCompleted, false);
      expect(todo.id, isNotEmpty);
      expect(todo.createdAt, isNotNull);
    });

    test('Should create a Todo with custom values', () {
      final now = DateTime.now();
      final todo = Todo(
        id: '123',
        title: 'Custom Todo',
        isCompleted: true,
        createdAt: now,
      );

      expect(todo.id, '123');
      expect(todo.title, 'Custom Todo');
      expect(todo.isCompleted, true);
      expect(todo.createdAt, now);
    });

    test('Should toggle completion status', () {
      final todo = Todo(title: 'Test Todo');

      expect(todo.isCompleted, false);

      todo.toggleCompleted();
      expect(todo.isCompleted, true);

      todo.toggleCompleted();
      expect(todo.isCompleted, false);
    });

    test('Should convert to JSON correctly', () {
      final now = DateTime.parse('2024-01-01T12:00:00.000');
      final todo = Todo(
        id: '123',
        title: 'Test Todo',
        isCompleted: true,
        createdAt: now,
      );

      final json = todo.toJson();

      expect(json['id'], '123');
      expect(json['title'], 'Test Todo');
      expect(json['isCompleted'], true);
      expect(json['createdAt'], '2024-01-01T12:00:00.000');
    });

    test('Should create from JSON correctly', () {
      final json = {
        'id': '123',
        'title': 'Test Todo',
        'isCompleted': true,
        'createdAt': '2024-01-01T12:00:00.000',
      };

      final todo = Todo.fromJson(json);

      expect(todo.id, '123');
      expect(todo.title, 'Test Todo');
      expect(todo.isCompleted, true);
      expect(todo.createdAt, DateTime.parse('2024-01-01T12:00:00.000'));
    });

    test('Should create a copy with modified properties', () {
      final original = Todo(
        id: '123',
        title: 'Original',
        isCompleted: false,
      );

      final copy = original.copyWith(
        title: 'Modified',
        isCompleted: true,
      );

      expect(copy.id, '123');
      expect(copy.title, 'Modified');
      expect(copy.isCompleted, true);
      expect(original.title, 'Original');
      expect(original.isCompleted, false);
    });

    test('Should have correct equality comparison', () {
      final todo1 = Todo(id: '123', title: 'Test');
      final todo2 = Todo(id: '123', title: 'Different Title');
      final todo3 = Todo(id: '456', title: 'Test');

      expect(todo1, todo2); // Same ID
      expect(todo1, isNot(todo3)); // Different ID
    });

    test('Should have correct hashCode', () {
      final todo1 = Todo(id: '123', title: 'Test');
      final todo2 = Todo(id: '123', title: 'Different Title');

      expect(todo1.hashCode, todo2.hashCode);
    });

    test('Should convert to String correctly', () {
      final todo = Todo(
        id: '123',
        title: 'Test Todo',
        isCompleted: true,
      );

      final str = todo.toString();

      expect(str, contains('123'));
      expect(str, contains('Test Todo'));
      expect(str, contains('true'));
    });
  });
}
