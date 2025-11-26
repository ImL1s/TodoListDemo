import 'package:equatable/equatable.dart';
import '../models/todo.dart';

/// Todo 事件基類
///
/// BLoC 模式中，所有的用戶操作都會被轉換為事件（Event）
/// 事件描述"發生了什麼"，而不關心"如何處理"
abstract class TodoEvent extends Equatable {
  const TodoEvent();

  @override
  List<Object?> get props => [];
}

/// 載入 Todos 事件
///
/// 應用啟動時觸發，從本地存儲載入所有 todos
class LoadTodosEvent extends TodoEvent {
  const LoadTodosEvent();
}

/// 添加 Todo 事件
///
/// 當用戶輸入新的 todo 標題並提交時觸發
class AddTodoEvent extends TodoEvent {
  final String title;

  const AddTodoEvent(this.title);

  @override
  List<Object?> get props => [title];

  @override
  String toString() => 'AddTodoEvent { title: $title }';
}

/// 切換 Todo 完成狀態事件
///
/// 當用戶點擊 checkbox 時觸發
class ToggleTodoEvent extends TodoEvent {
  final String id;

  const ToggleTodoEvent(this.id);

  @override
  List<Object?> get props => [id];

  @override
  String toString() => 'ToggleTodoEvent { id: $id }';
}

/// 刪除 Todo 事件
///
/// 當用戶滑動刪除 todo 項目時觸發
class DeleteTodoEvent extends TodoEvent {
  final String id;

  const DeleteTodoEvent(this.id);

  @override
  List<Object?> get props => [id];

  @override
  String toString() => 'DeleteTodoEvent { id: $id }';
}

/// 清除所有已完成的 Todos 事件
class ClearCompletedEvent extends TodoEvent {
  const ClearCompletedEvent();
}
