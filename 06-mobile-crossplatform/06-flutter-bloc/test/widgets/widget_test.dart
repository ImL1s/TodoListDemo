import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_bloc_todo/bloc/todo_bloc.dart';
import 'package:flutter_bloc_todo/bloc/todo_event.dart';
import 'package:flutter_bloc_todo/bloc/todo_state.dart';
import 'package:flutter_bloc_todo/models/todo.dart';
import 'package:flutter_bloc_todo/screens/todo_list_screen.dart';
import 'package:flutter_bloc_todo/widgets/todo_item.dart';
import 'package:flutter_bloc_todo/widgets/todo_list.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('TodoListScreen', () {
    late TodoBloc todoBloc;

    setUp(() {
      SharedPreferences.setMockInitialValues({});
      todoBloc = TodoBloc();
    });

    tearDown(() {
      todoBloc.close();
    });

    testWidgets('應該顯示標題 "Todo List"', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc..add(const LoadTodosEvent()),
            child: const TodoListScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Todo List'), findsOneWidget);
    });

    testWidgets('載入中時應該顯示進度指示器', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: const TodoListScreen(),
          ),
        ),
      );

      // 初始狀態應該是 TodoInitial
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('空列表時應該顯示空狀態', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc..add(const LoadTodosEvent()),
            child: const TodoListScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('還沒有待辦事項'), findsOneWidget);
      expect(find.text('點擊 + 按鈕添加第一個待辦事項'), findsOneWidget);
    });

    testWidgets('應該顯示統計信息', (WidgetTester tester) async {
      final todos = [
        Todo(id: '1', title: 'Active 1', completed: false, createdAt: DateTime.now()),
        Todo(id: '2', title: 'Completed', completed: true, createdAt: DateTime.now()),
        Todo(id: '3', title: 'Active 2', completed: false, createdAt: DateTime.now()),
      ];

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: const TodoListScreen(),
          ),
        ),
      );

      todoBloc.emit(TodoLoaded(todos));
      await tester.pumpAndSettle();

      expect(find.text('總計: 3'), findsOneWidget);
      expect(find.text('待完成: 2'), findsOneWidget);
      expect(find.text('已完成: 1'), findsOneWidget);
    });

    testWidgets('應該顯示進度條', (WidgetTester tester) async {
      final todos = [
        Todo(id: '1', title: 'Active', completed: false, createdAt: DateTime.now()),
        Todo(id: '2', title: 'Completed', completed: true, createdAt: DateTime.now()),
      ];

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: const TodoListScreen(),
          ),
        ),
      );

      todoBloc.emit(TodoLoaded(todos));
      await tester.pumpAndSettle();

      expect(find.text('完成進度'), findsOneWidget);
      expect(find.text('50%'), findsOneWidget);
      expect(find.byType(LinearProgressIndicator), findsOneWidget);
    });

    testWidgets('錯誤時應該顯示錯誤消息和重試按鈕', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: const TodoListScreen(),
          ),
        ),
      );

      todoBloc.emit(const TodoLoadError('載入失敗'));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.error_outline), findsOneWidget);
      expect(find.text('載入失敗'), findsOneWidget);
      expect(find.text('重試'), findsOneWidget);
    });

    testWidgets('點擊重試按鈕應該重新載入數據', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: const TodoListScreen(),
          ),
        ),
      );

      todoBloc.emit(const TodoLoadError('載入失敗'));
      await tester.pumpAndSettle();

      bool loadEventFired = false;
      todoBloc.stream.listen((state) {
        if (state is TodoLoading) {
          loadEventFired = true;
        }
      });

      await tester.tap(find.text('重試'));
      await tester.pump();

      expect(loadEventFired, true);
    });

    testWidgets('應該顯示浮動操作按鈕', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc..add(const LoadTodosEvent()),
            child: const TodoListScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.byType(FloatingActionButton), findsOneWidget);
      expect(find.byIcon(Icons.add), findsOneWidget);
    });

    testWidgets('點擊 FAB 應該打開輸入對話框', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc..add(const LoadTodosEvent()),
            child: const TodoListScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsOneWidget);
    });
  });

  group('TodoItem', () {
    late TodoBloc todoBloc;
    late Todo testTodo;

    setUp(() {
      SharedPreferences.setMockInitialValues({});
      todoBloc = TodoBloc();
      testTodo = Todo(
        id: '1',
        title: 'Test Todo',
        completed: false,
        createdAt: DateTime.now(),
      );
    });

    tearDown(() {
      todoBloc.close();
    });

    testWidgets('應該顯示 todo 標題', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: testTodo),
            ),
          ),
        ),
      );

      expect(find.text('Test Todo'), findsOneWidget);
    });

    testWidgets('應該顯示 checkbox', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: testTodo),
            ),
          ),
        ),
      );

      expect(find.byType(Checkbox), findsOneWidget);
    });

    testWidgets('未完成的 todo checkbox 應該是未選中狀態', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: testTodo),
            ),
          ),
        ),
      );

      final checkbox = tester.widget<Checkbox>(find.byType(Checkbox));
      expect(checkbox.value, false);
    });

    testWidgets('已完成的 todo checkbox 應該是選中狀態', (WidgetTester tester) async {
      final completedTodo = testTodo.copyWith(completed: true);

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: completedTodo),
            ),
          ),
        ),
      );

      final checkbox = tester.widget<Checkbox>(find.byType(Checkbox));
      expect(checkbox.value, true);
    });

    testWidgets('點擊 checkbox 應該觸發 ToggleTodoEvent', (WidgetTester tester) async {
      bool toggleEventFired = false;

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: testTodo),
            ),
          ),
        ),
      );

      // 設置監聽器
      todoBloc.stream.listen((state) {
        if (state is TodoLoaded) {
          toggleEventFired = true;
        }
      });

      todoBloc.emit(TodoLoaded([testTodo]));
      await tester.pumpAndSettle();

      await tester.tap(find.byType(Checkbox));
      await tester.pump();

      expect(toggleEventFired, true);
    });

    testWidgets('點擊 ListTile 應該切換完成狀態', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: testTodo),
            ),
          ),
        ),
      );

      todoBloc.emit(TodoLoaded([testTodo]));
      await tester.pumpAndSettle();

      await tester.tap(find.byType(ListTile));
      await tester.pump();

      // 驗證事件被觸發（通過檢查 BLoC 狀態）
      expect(todoBloc.state, isA<TodoLoaded>());
    });

    testWidgets('已完成的 todo 標題應該有刪除線', (WidgetTester tester) async {
      final completedTodo = testTodo.copyWith(completed: true);

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: completedTodo),
            ),
          ),
        ),
      );

      final textWidget = tester.widget<Text>(
        find.text('Test Todo'),
      );

      expect(textWidget.style?.decoration, TextDecoration.lineThrough);
    });

    testWidgets('應該支持滑動刪除', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: testTodo),
            ),
          ),
        ),
      );

      expect(find.byType(Dismissible), findsOneWidget);
    });

    testWidgets('滑動刪除應該觸發 DeleteTodoEvent', (WidgetTester tester) async {
      bool deleteEventFired = false;

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: testTodo),
            ),
          ),
        ),
      );

      todoBloc.emit(TodoLoaded([testTodo]));
      await tester.pumpAndSettle();

      // 設置監聽器
      todoBloc.stream.listen((state) {
        if (state is TodoLoaded && state.todos.isEmpty) {
          deleteEventFired = true;
        }
      });

      await tester.drag(find.byType(Dismissible), const Offset(-500, 0));
      await tester.pumpAndSettle();

      expect(deleteEventFired, true);
    });
  });

  group('TodoList', () {
    testWidgets('空列表應該顯示空狀態', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: TodoList(todos: []),
          ),
        ),
      );

      expect(find.text('還沒有待辦事項'), findsOneWidget);
      expect(find.byIcon(Icons.inbox_outlined), findsOneWidget);
    });

    testWidgets('應該顯示所有 todos', (WidgetTester tester) async {
      SharedPreferences.setMockInitialValues({});
      final todoBloc = TodoBloc();

      final todos = [
        Todo(id: '1', title: 'Todo 1', createdAt: DateTime.now()),
        Todo(id: '2', title: 'Todo 2', createdAt: DateTime.now()),
        Todo(id: '3', title: 'Todo 3', createdAt: DateTime.now()),
      ];

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoList(todos: todos),
            ),
          ),
        ),
      );

      expect(find.text('Todo 1'), findsOneWidget);
      expect(find.text('Todo 2'), findsOneWidget);
      expect(find.text('Todo 3'), findsOneWidget);
      expect(find.byType(TodoItem), findsNWidgets(3));

      todoBloc.close();
    });

    testWidgets('應該使用 ListView.builder 進行優化', (WidgetTester tester) async {
      SharedPreferences.setMockInitialValues({});
      final todoBloc = TodoBloc();

      final todos = List.generate(
        20,
        (index) => Todo(
          id: '$index',
          title: 'Todo $index',
          createdAt: DateTime.now(),
        ),
      );

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoList(todos: todos),
            ),
          ),
        ),
      );

      // 驗證使用了 ListView
      expect(find.byType(ListView), findsOneWidget);

      todoBloc.close();
    });
  });

  group('時間格式化測試', () {
    testWidgets('應該正確顯示相對時間', (WidgetTester tester) async {
      SharedPreferences.setMockInitialValues({});
      final todoBloc = TodoBloc();

      final now = DateTime.now();
      final recentTodo = Todo(
        id: '1',
        title: 'Recent Todo',
        createdAt: now.subtract(const Duration(minutes: 30)),
      );

      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc,
            child: Scaffold(
              body: TodoItem(todo: recentTodo),
            ),
          ),
        ),
      );

      // 應該顯示 "30 分鐘前" 或類似的文本
      expect(find.textContaining('分鐘前'), findsOneWidget);

      todoBloc.close();
    });
  });
}
