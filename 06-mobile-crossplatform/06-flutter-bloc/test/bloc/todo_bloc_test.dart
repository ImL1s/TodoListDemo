import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_bloc_todo/bloc/todo_bloc.dart';
import 'package:flutter_bloc_todo/bloc/todo_event.dart';
import 'package:flutter_bloc_todo/bloc/todo_state.dart';
import 'package:flutter_bloc_todo/models/todo.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('TodoBloc', () {
    late TodoBloc todoBloc;

    setUp(() {
      // 在每個測試前初始化 SharedPreferences
      SharedPreferences.setMockInitialValues({});
      todoBloc = TodoBloc();
    });

    tearDown(() {
      todoBloc.close();
    });

    test('初始狀態應該是 TodoInitial', () {
      expect(todoBloc.state, const TodoInitial());
    });

    group('LoadTodosEvent', () {
      blocTest<TodoBloc, TodoState>(
        '當沒有存儲數據時，應該發出 TodoLoading 然後 TodoLoaded 空列表',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        act: (bloc) => bloc.add(const LoadTodosEvent()),
        expect: () => [
          const TodoLoading(),
          const TodoLoaded([]),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '當有存儲數據時，應該發出 TodoLoading 然後 TodoLoaded 包含數據',
        build: () {
          SharedPreferences.setMockInitialValues({
            'flutter_bloc_todos': '[{"id":"1","title":"Test Todo","completed":false,"createdAt":"2024-01-01T00:00:00.000Z"}]'
          });
          return TodoBloc();
        },
        act: (bloc) => bloc.add(const LoadTodosEvent()),
        expect: () => [
          const TodoLoading(),
          isA<TodoLoaded>().having(
            (state) => state.todos.length,
            'todos length',
            1,
          ).having(
            (state) => state.todos.first.title,
            'first todo title',
            'Test Todo',
          ),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '當載入數據失敗時，應該發出 TodoLoading 然後 TodoLoadError',
        build: () {
          SharedPreferences.setMockInitialValues({
            'flutter_bloc_todos': 'invalid json'
          });
          return TodoBloc();
        },
        act: (bloc) => bloc.add(const LoadTodosEvent()),
        expect: () => [
          const TodoLoading(),
          isA<TodoLoadError>(),
        ],
      );
    });

    group('AddTodoEvent', () {
      blocTest<TodoBloc, TodoState>(
        '應該添加新的 todo 到列表中',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => const TodoLoaded([]),
        act: (bloc) => bloc.add(const AddTodoEvent('New Todo')),
        expect: () => [
          isA<TodoLoaded>()
              .having((state) => state.todos.length, 'todos length', 1)
              .having(
                (state) => state.todos.first.title,
                'first todo title',
                'New Todo',
              )
              .having(
                (state) => state.todos.first.completed,
                'first todo completed',
                false,
              ),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '應該修剪標題中的空白字符',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => const TodoLoaded([]),
        act: (bloc) => bloc.add(const AddTodoEvent('  Trimmed Todo  ')),
        expect: () => [
          isA<TodoLoaded>().having(
            (state) => state.todos.first.title,
            'first todo title',
            'Trimmed Todo',
          ),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '應該將新 todo 添加到現有列表的末尾',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([
          Todo(
            id: '1',
            title: 'Existing Todo',
            createdAt: DateTime.now(),
          ),
        ]),
        act: (bloc) => bloc.add(const AddTodoEvent('New Todo')),
        expect: () => [
          isA<TodoLoaded>()
              .having((state) => state.todos.length, 'todos length', 2)
              .having(
                (state) => state.todos.last.title,
                'last todo title',
                'New Todo',
              ),
        ],
      );
    });

    group('ToggleTodoEvent', () {
      final testTodo = Todo(
        id: '1',
        title: 'Test Todo',
        completed: false,
        createdAt: DateTime.now(),
      );

      blocTest<TodoBloc, TodoState>(
        '應該切換 todo 的完成狀態',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([testTodo]),
        act: (bloc) => bloc.add(const ToggleTodoEvent('1')),
        expect: () => [
          isA<TodoLoaded>().having(
            (state) => state.todos.first.completed,
            'first todo completed',
            true,
          ),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '應該能夠將已完成的 todo 切換回未完成',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([
          testTodo.copyWith(completed: true),
        ]),
        act: (bloc) => bloc.add(const ToggleTodoEvent('1')),
        expect: () => [
          isA<TodoLoaded>().having(
            (state) => state.todos.first.completed,
            'first todo completed',
            false,
          ),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '只應該切換指定 ID 的 todo',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([
          Todo(id: '1', title: 'Todo 1', completed: false, createdAt: DateTime.now()),
          Todo(id: '2', title: 'Todo 2', completed: false, createdAt: DateTime.now()),
          Todo(id: '3', title: 'Todo 3', completed: false, createdAt: DateTime.now()),
        ]),
        act: (bloc) => bloc.add(const ToggleTodoEvent('2')),
        expect: () => [
          isA<TodoLoaded>()
              .having(
                (state) => state.todos[0].completed,
                'first todo completed',
                false,
              )
              .having(
                (state) => state.todos[1].completed,
                'second todo completed',
                true,
              )
              .having(
                (state) => state.todos[2].completed,
                'third todo completed',
                false,
              ),
        ],
      );
    });

    group('DeleteTodoEvent', () {
      blocTest<TodoBloc, TodoState>(
        '應該從列表中刪除指定的 todo',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([
          Todo(id: '1', title: 'Todo 1', createdAt: DateTime.now()),
        ]),
        act: (bloc) => bloc.add(const DeleteTodoEvent('1')),
        expect: () => [
          const TodoLoaded([]),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '只應該刪除指定 ID 的 todo',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([
          Todo(id: '1', title: 'Todo 1', createdAt: DateTime.now()),
          Todo(id: '2', title: 'Todo 2', createdAt: DateTime.now()),
          Todo(id: '3', title: 'Todo 3', createdAt: DateTime.now()),
        ]),
        act: (bloc) => bloc.add(const DeleteTodoEvent('2')),
        expect: () => [
          isA<TodoLoaded>()
              .having((state) => state.todos.length, 'todos length', 2)
              .having((state) => state.todos[0].id, 'first todo id', '1')
              .having((state) => state.todos[1].id, 'second todo id', '3'),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '刪除不存在的 todo 不應該改變列表',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([
          Todo(id: '1', title: 'Todo 1', createdAt: DateTime.now()),
        ]),
        act: (bloc) => bloc.add(const DeleteTodoEvent('999')),
        expect: () => [
          isA<TodoLoaded>().having(
            (state) => state.todos.length,
            'todos length',
            1,
          ),
        ],
      );
    });

    group('ClearCompletedEvent', () {
      blocTest<TodoBloc, TodoState>(
        '應該移除所有已完成的 todos',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([
          Todo(id: '1', title: 'Active', completed: false, createdAt: DateTime.now()),
          Todo(id: '2', title: 'Completed 1', completed: true, createdAt: DateTime.now()),
          Todo(id: '3', title: 'Completed 2', completed: true, createdAt: DateTime.now()),
        ]),
        act: (bloc) => bloc.add(const ClearCompletedEvent()),
        expect: () => [
          isA<TodoLoaded>()
              .having((state) => state.todos.length, 'todos length', 1)
              .having((state) => state.todos.first.title, 'remaining todo', 'Active'),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '如果沒有已完成的 todos，應該保持列表不變',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([
          Todo(id: '1', title: 'Active 1', completed: false, createdAt: DateTime.now()),
          Todo(id: '2', title: 'Active 2', completed: false, createdAt: DateTime.now()),
        ]),
        act: (bloc) => bloc.add(const ClearCompletedEvent()),
        expect: () => [
          isA<TodoLoaded>().having(
            (state) => state.todos.length,
            'todos length',
            2,
          ),
        ],
      );

      blocTest<TodoBloc, TodoState>(
        '如果所有 todos 都已完成，應該清空列表',
        build: () {
          SharedPreferences.setMockInitialValues({});
          return TodoBloc();
        },
        seed: () => TodoLoaded([
          Todo(id: '1', title: 'Completed 1', completed: true, createdAt: DateTime.now()),
          Todo(id: '2', title: 'Completed 2', completed: true, createdAt: DateTime.now()),
        ]),
        act: (bloc) => bloc.add(const ClearCompletedEvent()),
        expect: () => [
          const TodoLoaded([]),
        ],
      );
    });

    group('狀態持久化', () {
      test('添加 todo 後應該保存到 SharedPreferences', () async {
        SharedPreferences.setMockInitialValues({});
        final bloc = TodoBloc();

        bloc.add(const LoadTodosEvent());
        await Future.delayed(const Duration(milliseconds: 100));

        bloc.add(const AddTodoEvent('Persistent Todo'));
        await Future.delayed(const Duration(milliseconds: 100));

        final prefs = await SharedPreferences.getInstance();
        final saved = prefs.getString('flutter_bloc_todos');

        expect(saved, isNotNull);
        expect(saved, contains('Persistent Todo'));

        bloc.close();
      });

      test('刪除 todo 後應該更新 SharedPreferences', () async {
        SharedPreferences.setMockInitialValues({});
        final bloc = TodoBloc();

        bloc.add(const LoadTodosEvent());
        await Future.delayed(const Duration(milliseconds: 100));

        bloc.add(const AddTodoEvent('Todo to Delete'));
        await Future.delayed(const Duration(milliseconds: 100));

        // 獲取添加的 todo 的 id
        final state = bloc.state as TodoLoaded;
        final todoId = state.todos.first.id;

        bloc.add(DeleteTodoEvent(todoId));
        await Future.delayed(const Duration(milliseconds: 100));

        final prefs = await SharedPreferences.getInstance();
        final saved = prefs.getString('flutter_bloc_todos');

        expect(saved, isNotNull);
        expect(saved, equals('[]'));

        bloc.close();
      });
    });
  });
}
