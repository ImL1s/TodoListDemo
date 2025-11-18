import 'package:equatable/equatable.dart';
import '../models/todo.dart';

/// Todo 狀態基類
///
/// BLoC 模式中，狀態（State）代表應用的某個時刻的狀態快照
/// UI 根據狀態來渲染，每當狀態改變，UI 就會重新構建
abstract class TodoState extends Equatable {
  const TodoState();

  @override
  List<Object?> get props => [];
}

/// 初始狀態
///
/// 應用剛啟動時的狀態，還沒有載入任何數據
class TodoInitial extends TodoState {
  const TodoInitial();
}

/// 載入中狀態
///
/// 正在從本地存儲載入數據時的狀態
class TodoLoading extends TodoState {
  const TodoLoading();
}

/// 載入完成狀態
///
/// 數據已成功載入，包含當前的 todos 列表
/// 這是應用的主要狀態
class TodoLoaded extends TodoState {
  final List<Todo> todos;

  const TodoLoaded(this.todos);

  @override
  List<Object?> get props => [todos];

  /// 便捷方法：獲取所有活動的（未完成的）todos
  List<Todo> get activeTodos =>
      todos.where((todo) => !todo.completed).toList();

  /// 便捷方法：獲取所有已完成的 todos
  List<Todo> get completedTodos =>
      todos.where((todo) => todo.completed).toList();

  /// 便捷方法：計算完成進度（0.0 - 1.0）
  double get progress {
    if (todos.isEmpty) return 0.0;
    return completedTodos.length / todos.length;
  }

  /// 創建新的 TodoLoaded 狀態（用於狀態更新）
  TodoLoaded copyWith({List<Todo>? todos}) {
    return TodoLoaded(todos ?? this.todos);
  }

  @override
  String toString() => 'TodoLoaded { todos: ${todos.length} }';
}

/// 錯誤狀態
///
/// 當操作失敗時（例如：存儲失敗）的狀態
class TodoError extends TodoState {
  final String message;

  const TodoError(this.message);

  @override
  List<Object?> get props => [message];

  @override
  String toString() => 'TodoError { message: $message }';
}
