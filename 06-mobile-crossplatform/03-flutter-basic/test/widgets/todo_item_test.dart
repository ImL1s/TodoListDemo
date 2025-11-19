import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_basic_todo/models/todo.dart';
import 'package:flutter_basic_todo/widgets/todo_item.dart';

void main() {
  group('TodoItem Widget Tests', () {
    testWidgets('Should display todo title', (WidgetTester tester) async {
      final todo = Todo(title: 'Test Todo');

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: todo,
              onToggle: () {},
              onDelete: () {},
              onEdit: () {},
            ),
          ),
        ),
      );

      expect(find.text('Test Todo'), findsOneWidget);
    });

    testWidgets('Should show checkbox with correct state',
        (WidgetTester tester) async {
      final incompleteTodo = Todo(title: 'Incomplete', isCompleted: false);

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: incompleteTodo,
              onToggle: () {},
              onDelete: () {},
              onEdit: () {},
            ),
          ),
        ),
      );

      final checkbox = tester.widget<Checkbox>(find.byType(Checkbox));
      expect(checkbox.value, false);
    });

    testWidgets('Should show checked checkbox for completed todo',
        (WidgetTester tester) async {
      final completedTodo = Todo(title: 'Completed', isCompleted: true);

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: completedTodo,
              onToggle: () {},
              onDelete: () {},
              onEdit: () {},
            ),
          ),
        ),
      );

      final checkbox = tester.widget<Checkbox>(find.byType(Checkbox));
      expect(checkbox.value, true);
    });

    testWidgets('Should call onToggle when checkbox is tapped',
        (WidgetTester tester) async {
      final todo = Todo(title: 'Test');
      var toggleCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: todo,
              onToggle: () {
                toggleCalled = true;
              },
              onDelete: () {},
              onEdit: () {},
            ),
          ),
        ),
      );

      await tester.tap(find.byType(Checkbox));
      await tester.pump();

      expect(toggleCalled, true);
    });

    testWidgets('Should call onToggle when ListTile is tapped',
        (WidgetTester tester) async {
      final todo = Todo(title: 'Test');
      var toggleCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: todo,
              onToggle: () {
                toggleCalled = true;
              },
              onDelete: () {},
              onEdit: () {},
            ),
          ),
        ),
      );

      await tester.tap(find.byType(ListTile));
      await tester.pump();

      expect(toggleCalled, true);
    });

    testWidgets('Should show edit and delete buttons',
        (WidgetTester tester) async {
      final todo = Todo(title: 'Test');

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: todo,
              onToggle: () {},
              onDelete: () {},
              onEdit: () {},
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.edit), findsOneWidget);
      expect(find.byIcon(Icons.delete), findsOneWidget);
    });

    testWidgets('Should call onEdit when edit button is tapped',
        (WidgetTester tester) async {
      final todo = Todo(title: 'Test');
      var editCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: todo,
              onToggle: () {},
              onDelete: () {},
              onEdit: () {
                editCalled = true;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.edit));
      await tester.pump();

      expect(editCalled, true);
    });

    testWidgets('Should show delete confirmation dialog',
        (WidgetTester tester) async {
      final todo = Todo(title: 'Test Todo');

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: todo,
              onToggle: () {},
              onDelete: () {},
              onEdit: () {},
            ),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.delete));
      await tester.pumpAndSettle();

      expect(find.text('確認刪除'), findsOneWidget);
      expect(find.text('確定要刪除「Test Todo」嗎？'), findsOneWidget);
    });

    testWidgets('Should call onDelete when confirmed',
        (WidgetTester tester) async {
      final todo = Todo(title: 'Test');
      var deleteCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: todo,
              onToggle: () {},
              onDelete: () {
                deleteCalled = true;
              },
              onEdit: () {},
            ),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.delete));
      await tester.pumpAndSettle();

      await tester.tap(find.text('刪除'));
      await tester.pumpAndSettle();

      expect(deleteCalled, true);
    });

    testWidgets('Should not call onDelete when cancelled',
        (WidgetTester tester) async {
      final todo = Todo(title: 'Test');
      var deleteCalled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: todo,
              onToggle: () {},
              onDelete: () {
                deleteCalled = true;
              },
              onEdit: () {},
            ),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.delete));
      await tester.pumpAndSettle();

      await tester.tap(find.text('取消'));
      await tester.pumpAndSettle();

      expect(deleteCalled, false);
    });

    testWidgets('Should apply strikethrough to completed todo',
        (WidgetTester tester) async {
      final completedTodo = Todo(title: 'Completed', isCompleted: true);

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: completedTodo,
              onToggle: () {},
              onDelete: () {},
              onEdit: () {},
            ),
          ),
        ),
      );

      final textWidget = tester.widget<Text>(find.text('Completed'));
      expect(textWidget.style?.decoration, TextDecoration.lineThrough);
    });

    testWidgets('Should display creation date', (WidgetTester tester) async {
      final todo = Todo(
        title: 'Test',
        createdAt: DateTime.now(),
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TodoItem(
              todo: todo,
              onToggle: () {},
              onDelete: () {},
              onEdit: () {},
            ),
          ),
        ),
      );

      expect(find.textContaining('今天'), findsOneWidget);
    });
  });
}
