import 'package:equatable/equatable.dart';

/// Todo 模型類
///
/// 使用 Equatable 來簡化值比較，這對於 BLoC 狀態管理特別重要
/// 因為需要判斷狀態是否真的改變了
class Todo extends Equatable {
  final String id;
  final String title;
  final bool completed;
  final DateTime createdAt;

  const Todo({
    required this.id,
    required this.title,
    this.completed = false,
    required this.createdAt,
  });

  /// 從 JSON 創建 Todo
  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      id: json['id'] as String,
      title: json['title'] as String,
      completed: json['completed'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  /// 轉換為 JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'completed': completed,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  /// 創建副本並修改某些屬性
  Todo copyWith({
    String? id,
    String? title,
    bool? completed,
    DateTime? createdAt,
  }) {
    return Todo(
      id: id ?? this.id,
      title: title ?? this.title,
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  /// Equatable 要求實現 props
  /// 這些屬性將用於判斷兩個 Todo 是否相等
  @override
  List<Object?> get props => [id, title, completed, createdAt];

  @override
  bool get stringify => true;
}
