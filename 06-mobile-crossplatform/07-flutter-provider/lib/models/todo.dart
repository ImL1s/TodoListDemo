/// Todo Model
///
/// Represents a single todo item with immutable properties.
/// Uses copyWith pattern for creating modified copies.
class Todo {
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

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Todo &&
        other.id == id &&
        other.title == title &&
        other.completed == completed &&
        other.createdAt == createdAt;
  }

  @override
  int get hashCode {
    return Object.hash(id, title, completed, createdAt);
  }

  @override
  String toString() {
    return 'Todo(id: $id, title: $title, completed: $completed, createdAt: $createdAt)';
  }
}
