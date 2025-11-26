import 'package:freezed_annotation/freezed_annotation.dart';

part 'todo.freezed.dart';
part 'todo.g.dart';

/// Todo Model with Freezed
///
/// Uses Freezed for:
/// - Immutable data classes
/// - Generated copyWith, ==, hashCode, toString
/// - JSON serialization/deserialization
/// - Union types and sealed classes
///
/// Freezed automatically generates:
/// - copyWith() method for creating modified copies
/// - == operator and hashCode for value equality
/// - toString() for debugging
/// - fromJson() and toJson() for persistence

@freezed
class Todo with _$Todo {
  const factory Todo({
    required String id,
    required String title,
    @Default(false) bool completed,
    required DateTime createdAt,
    @Default(TodoPriority.medium) TodoPriority priority,
  }) = _Todo;

  // Custom methods must be in a separate extension
  // because Freezed classes are redirecting factories
  factory Todo.fromJson(Map<String, dynamic> json) => _$TodoFromJson(json);
}

/// Extension for custom methods
extension TodoX on Todo {
  /// Toggle the completed status
  Todo toggle() => copyWith(completed: !completed);

  /// Check if todo is overdue (for future priority feature)
  bool get isActive => !completed;
}

/// Todo Priority Enum
enum TodoPriority {
  low,
  medium,
  high,
  urgent;

  String get displayName {
    switch (this) {
      case TodoPriority.low:
        return 'Low';
      case TodoPriority.medium:
        return 'Medium';
      case TodoPriority.high:
        return 'High';
      case TodoPriority.urgent:
        return 'Urgent';
    }
  }
}
