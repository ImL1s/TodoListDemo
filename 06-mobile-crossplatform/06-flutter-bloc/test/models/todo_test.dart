import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_bloc_todo/models/todo.dart';

void main() {
  group('Todo', () {
    final testDate = DateTime(2024, 1, 1);

    group('構造函數', () {
      test('應該正確創建 Todo 實例', () {
        final todo = Todo(
          id: '1',
          title: 'Test Todo',
          completed: false,
          createdAt: testDate,
        );

        expect(todo.id, '1');
        expect(todo.title, 'Test Todo');
        expect(todo.completed, false);
        expect(todo.createdAt, testDate);
      });

      test('completed 應該默認為 false', () {
        final todo = Todo(
          id: '1',
          title: 'Test Todo',
          createdAt: testDate,
        );

        expect(todo.completed, false);
      });

      test('應該支持 const 構造函數', () {
        const todo = Todo(
          id: '1',
          title: 'Test Todo',
          completed: false,
          createdAt: const Duration(days: 0), // 使用 Duration 來創建 const
        );

        expect(todo, isA<Todo>());
      });
    });

    group('fromJson', () {
      test('應該從 JSON 正確反序列化', () {
        final json = {
          'id': '1',
          'title': 'Test Todo',
          'completed': false,
          'createdAt': '2024-01-01T00:00:00.000Z',
        };

        final todo = Todo.fromJson(json);

        expect(todo.id, '1');
        expect(todo.title, 'Test Todo');
        expect(todo.completed, false);
        expect(todo.createdAt, DateTime.parse('2024-01-01T00:00:00.000Z'));
      });

      test('應該能夠反序列化已完成的 todo', () {
        final json = {
          'id': '2',
          'title: 'Completed Todo',
          'completed': true,
          'createdAt': '2024-01-02T00:00:00.000Z',
        };

        final todo = Todo.fromJson(json);

        expect(todo.completed, true);
      });

      test('應該處理不同的日期格式', () {
        final json = {
          'id': '1',
          'title': 'Test Todo',
          'completed': false,
          'createdAt': '2024-01-01T12:30:45.123456Z',
        };

        final todo = Todo.fromJson(json);

        expect(todo.createdAt.year, 2024);
        expect(todo.createdAt.month, 1);
        expect(todo.createdAt.day, 1);
      });
    });

    group('toJson', () {
      test('應該正確序列化為 JSON', () {
        final todo = Todo(
          id: '1',
          title: 'Test Todo',
          completed: false,
          createdAt: DateTime.parse('2024-01-01T00:00:00.000Z'),
        );

        final json = todo.toJson();

        expect(json['id'], '1');
        expect(json['title'], 'Test Todo');
        expect(json['completed'], false);
        expect(json['createdAt'], '2024-01-01T00:00:00.000Z');
      });

      test('應該包含所有必需的字段', () {
        final todo = Todo(
          id: '1',
          title: 'Test Todo',
          completed: true,
          createdAt: testDate,
        );

        final json = todo.toJson();

        expect(json.containsKey('id'), true);
        expect(json.containsKey('title'), true);
        expect(json.containsKey('completed'), true);
        expect(json.containsKey('createdAt'), true);
      });
    });

    group('copyWith', () {
      test('應該創建具有更新字段的副本', () {
        final original = Todo(
          id: '1',
          title: 'Original',
          completed: false,
          createdAt: testDate,
        );

        final copy = original.copyWith(title: 'Updated');

        expect(copy.title, 'Updated');
        expect(copy.id, original.id);
        expect(copy.completed, original.completed);
        expect(copy.createdAt, original.createdAt);
      });

      test('應該能夠切換 completed 狀態', () {
        final todo = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        final toggled = todo.copyWith(completed: true);

        expect(toggled.completed, true);
        expect(todo.completed, false); // 原始對象不變
      });

      test('應該能夠更新多個字段', () {
        final original = Todo(
          id: '1',
          title: 'Original',
          completed: false,
          createdAt: testDate,
        );

        final updated = original.copyWith(
          title: 'Updated',
          completed: true,
        );

        expect(updated.title, 'Updated');
        expect(updated.completed, true);
        expect(updated.id, original.id);
        expect(updated.createdAt, original.createdAt);
      });

      test('如果不提供參數，應該返回相同值的副本', () {
        final original = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        final copy = original.copyWith();

        expect(copy.id, original.id);
        expect(copy.title, original.title);
        expect(copy.completed, original.completed);
        expect(copy.createdAt, original.createdAt);
      });
    });

    group('Equatable', () {
      test('具有相同屬性的 todos 應該相等', () {
        final todo1 = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        final todo2 = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        expect(todo1, equals(todo2));
      });

      test('具有不同 ID 的 todos 應該不相等', () {
        final todo1 = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        final todo2 = Todo(
          id: '2',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        expect(todo1, isNot(equals(todo2)));
      });

      test('具有不同標題的 todos 應該不相等', () {
        final todo1 = Todo(
          id: '1',
          title: 'Test 1',
          completed: false,
          createdAt: testDate,
        );

        final todo2 = Todo(
          id: '1',
          title: 'Test 2',
          completed: false,
          createdAt: testDate,
        );

        expect(todo1, isNot(equals(todo2)));
      });

      test('具有不同完成狀態的 todos 應該不相等', () {
        final todo1 = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        final todo2 = Todo(
          id: '1',
          title: 'Test',
          completed: true,
          createdAt: testDate,
        );

        expect(todo1, isNot(equals(todo2)));
      });

      test('hashCode 對於相同的 todos 應該相同', () {
        final todo1 = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        final todo2 = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        expect(todo1.hashCode, equals(todo2.hashCode));
      });

      test('可以用作 Set 的元素', () {
        final todo1 = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        final todo2 = Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: testDate,
        );

        final set = {todo1, todo2};

        // 由於 todo1 和 todo2 相等，Set 應該只包含一個元素
        expect(set.length, 1);
      });
    });

    group('stringify', () {
      test('應該提供有用的字符串表示', () {
        final todo = Todo(
          id: '1',
          title: 'Test Todo',
          completed: false,
          createdAt: testDate,
        );

        final string = todo.toString();

        expect(string, contains('Todo'));
        expect(string, contains('1'));
        expect(string, contains('Test Todo'));
      });
    });

    group('JSON 往返測試', () {
      test('JSON 序列化和反序列化應該保持數據一致', () {
        final original = Todo(
          id: '1',
          title: 'Test Todo',
          completed: true,
          createdAt: DateTime.parse('2024-01-01T12:30:45.123Z'),
        );

        final json = original.toJson();
        final deserialized = Todo.fromJson(json);

        expect(deserialized, equals(original));
      });

      test('應該能夠處理多個 todos 的序列化', () {
        final todos = [
          Todo(id: '1', title: 'Todo 1', completed: false, createdAt: testDate),
          Todo(id: '2', title: 'Todo 2', completed: true, createdAt: testDate),
          Todo(id: '3', title: 'Todo 3', completed: false, createdAt: testDate),
        ];

        final jsonList = todos.map((t) => t.toJson()).toList();
        final deserialized = jsonList.map((j) => Todo.fromJson(j)).toList();

        expect(deserialized, equals(todos));
      });
    });
  });
}
