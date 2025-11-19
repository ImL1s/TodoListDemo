import 'package:equatable/equatable.dart';

/// Todo Model
///
/// Represents a single todo item with immutable properties.
/// Uses copyWith pattern for creating modified copies.
/// Extends Equatable for value-based equality comparisons.
class Todo extends Equatable {
  final String id;
  final String title;
  final bool completed;
  final DateTime createdAt;

  const Todo({
    required this.id,
    required this.title,
    required this.completed,
    required this.createdAt,
  });

  /// Creates a copy of this Todo with the given fields replaced with new values
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

  /// Converts this Todo to a JSON map for serialization
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'completed': completed,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  /// Creates a Todo from a JSON map
  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      id: json['id'] as String,
      title: json['title'] as String,
      completed: json['completed'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  /// Equatable properties for value-based equality
  /// This allows Selector to correctly detect changes
  @override
  List<Object?> get props => [id, title, completed, createdAt];

  /// Enable toString override for debugging
  @override
  bool get stringify => true;
}
