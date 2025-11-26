import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/todo.dart';
import 'todo_event.dart';
import 'todo_state.dart';

/// TodoBloc - Todo 應用的業務邏輯組件
///
/// BLoC（Business Logic Component）是應用的核心
/// 它負責：
/// 1. 接收事件（Events）
/// 2. 處理業務邏輯
/// 3. 發出新的狀態（States）
/// 4. 與數據層交互（SharedPreferences）
///
/// 數據流：
/// UI → Event → BLoC → State → UI
class TodoBloc extends Bloc<TodoEvent, TodoState> {
  static const String _storageKey = 'flutter_bloc_todos';

  /// 構造函數
  ///
  /// 初始狀態為 TodoInitial
  /// 註冊所有事件處理器
  TodoBloc() : super(const TodoInitial()) {
    // 註冊事件處理器
    on<LoadTodosEvent>(_onLoadTodos);
    on<AddTodoEvent>(_onAddTodo);
    on<ToggleTodoEvent>(_onToggleTodo);
    on<DeleteTodoEvent>(_onDeleteTodo);
    on<ClearCompletedEvent>(_onClearCompleted);
  }

  /// 處理載入 Todos 事件
  ///
  /// 從 SharedPreferences 讀取並解析 todos
  Future<void> _onLoadTodos(
    LoadTodosEvent event,
    Emitter<TodoState> emit,
  ) async {
    try {
      emit(const TodoLoading());

      final prefs = await SharedPreferences.getInstance();
      final String? todosJson = prefs.getString(_storageKey);

      if (todosJson == null || todosJson.isEmpty) {
        // 沒有存儲的數據，返回空列表
        emit(const TodoLoaded([]));
        return;
      }

      final List<dynamic> todosList = jsonDecode(todosJson);
      final List<Todo> todos = todosList
          .map((json) => Todo.fromJson(json as Map<String, dynamic>))
          .toList();

      emit(TodoLoaded(todos));
    } catch (e) {
      emit(TodoLoadError('載入失敗: 無法從本地存儲讀取數據', e));
    }
  }

  /// 處理添加 Todo 事件
  ///
  /// 創建新的 todo 並添加到列表中
  Future<void> _onAddTodo(
    AddTodoEvent event,
    Emitter<TodoState> emit,
  ) async {
    if (state is! TodoLoaded) return;

    final currentState = state as TodoLoaded;

    try {
      final newTodo = Todo(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: event.title.trim(),
        createdAt: DateTime.now(),
      );

      final updatedTodos = List<Todo>.from(currentState.todos)..add(newTodo);
      emit(TodoLoaded(updatedTodos));

      // 異步保存到本地存儲
      await _saveTodos(updatedTodos);
    } catch (e) {
      emit(TodoOperationError('添加待辦事項失敗', currentState.todos, e));
      // 恢復到之前的狀態
      emit(TodoLoaded(currentState.todos));
    }
  }

  /// 處理切換 Todo 完成狀態事件
  ///
  /// 找到對應的 todo 並切換其 completed 狀態
  Future<void> _onToggleTodo(
    ToggleTodoEvent event,
    Emitter<TodoState> emit,
  ) async {
    if (state is! TodoLoaded) return;

    final currentState = state as TodoLoaded;

    try {
      final updatedTodos = currentState.todos.map((todo) {
        return todo.id == event.id
            ? todo.copyWith(completed: !todo.completed)
            : todo;
      }).toList();

      emit(TodoLoaded(updatedTodos));
      await _saveTodos(updatedTodos);
    } catch (e) {
      emit(TodoOperationError('切換待辦事項狀態失敗', currentState.todos, e));
      // 恢復到之前的狀態
      emit(TodoLoaded(currentState.todos));
    }
  }

  /// 處理刪除 Todo 事件
  ///
  /// 從列表中移除指定的 todo
  Future<void> _onDeleteTodo(
    DeleteTodoEvent event,
    Emitter<TodoState> emit,
  ) async {
    if (state is! TodoLoaded) return;

    final currentState = state as TodoLoaded;

    try {
      final updatedTodos = currentState.todos
          .where((todo) => todo.id != event.id)
          .toList();

      emit(TodoLoaded(updatedTodos));
      await _saveTodos(updatedTodos);
    } catch (e) {
      emit(TodoOperationError('刪除待辦事項失敗', currentState.todos, e));
      // 恢復到之前的狀態
      emit(TodoLoaded(currentState.todos));
    }
  }

  /// 處理清除已完成 Todos 事件
  ///
  /// 移除所有已完成的 todos
  Future<void> _onClearCompleted(
    ClearCompletedEvent event,
    Emitter<TodoState> emit,
  ) async {
    if (state is! TodoLoaded) return;

    final currentState = state as TodoLoaded;

    try {
      final updatedTodos = currentState.activeTodos;

      emit(TodoLoaded(updatedTodos));
      await _saveTodos(updatedTodos);
    } catch (e) {
      emit(TodoOperationError('清除已完成待辦事項失敗', currentState.todos, e));
      // 恢復到之前的狀態
      emit(TodoLoaded(currentState.todos));
    }
  }

  /// 保存 todos 到 SharedPreferences
  ///
  /// 將 todos 列表序列化為 JSON 並存儲
  /// 如果保存失敗，會拋出異常
  Future<void> _saveTodos(List<Todo> todos) async {
    final prefs = await SharedPreferences.getInstance();
    final todosJson = jsonEncode(
      todos.map((todo) => todo.toJson()).toList(),
    );
    await prefs.setString(_storageKey, todosJson);
  }
}
