class Todo {
  final String id;
  final String title;
  final String? description;
  final bool completed;
  final DateTime createdAt;
  final DateTime? completedAt;
  final String? category;
  final int priority; // 0: Low, 1: Medium, 2: High

  Todo({
    required this.id,
    required this.title,
    this.description,
    this.completed = false,
    DateTime? createdAt,
    this.completedAt,
    this.category,
    this.priority = 1,
  }) : createdAt = createdAt ?? DateTime.now();

  // Convert to Map for database
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'completed': completed ? 1 : 0,
      'createdAt': createdAt.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
      'category': category,
      'priority': priority,
    };
  }

  // Create from Map from database
  factory Todo.fromMap(Map<String, dynamic> map) {
    return Todo(
      id: map['id'] as String,
      title: map['title'] as String,
      description: map['description'] as String?,
      completed: (map['completed'] as int) == 1,
      createdAt: DateTime.parse(map['createdAt'] as String),
      completedAt: map['completedAt'] != null
          ? DateTime.parse(map['completedAt'] as String)
          : null,
      category: map['category'] as String?,
      priority: map['priority'] as int,
    );
  }

  // Copy with
  Todo copyWith({
    String? id,
    String? title,
    String? description,
    bool? completed,
    DateTime? createdAt,
    DateTime? completedAt,
    String? category,
    int? priority,
  }) {
    return Todo(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
      completedAt: completedAt ?? this.completedAt,
      category: category ?? this.category,
      priority: priority ?? this.priority,
    );
  }

  @override
  String toString() {
    return 'Todo(id: $id, title: $title, completed: $completed, priority: $priority)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;

    return other is Todo && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}

// Filter options
enum TodoFilter {
  all,
  active,
  completed,
}

// Sort options
enum TodoSort {
  createdDate,
  priority,
  title,
}

extension TodoFilterExtension on TodoFilter {
  String get label {
    switch (this) {
      case TodoFilter.all:
        return 'All';
      case TodoFilter.active:
        return 'Active';
      case TodoFilter.completed:
        return 'Completed';
    }
  }
}

extension TodoSortExtension on TodoSort {
  String get label {
    switch (this) {
      case TodoSort.createdDate:
        return 'Created Date';
      case TodoSort.priority:
        return 'Priority';
      case TodoSort.title:
        return 'Title';
    }
  }
}
