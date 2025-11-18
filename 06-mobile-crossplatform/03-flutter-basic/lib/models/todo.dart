/// Todo 數據模型
///
/// 這是一個簡單的數據類，用於表示單個待辦事項
/// 使用 Dart 的類來定義數據結構
class Todo {
  /// 唯一標識符
  final String id;

  /// 待辦事項標題
  String title;

  /// 是否已完成
  bool isCompleted;

  /// 創建時間
  final DateTime createdAt;

  /// 構造函數
  ///
  /// [id] 如果未提供，將自動生成基於時間戳的唯一ID
  /// [title] 待辦事項標題（必填）
  /// [isCompleted] 完成狀態，默認為 false
  /// [createdAt] 創建時間，默認為當前時間
  Todo({
    String? id,
    required this.title,
    this.isCompleted = false,
    DateTime? createdAt,
  })  : id = id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        createdAt = createdAt ?? DateTime.now();

  /// 切換完成狀態
  void toggleCompleted() {
    isCompleted = !isCompleted;
  }

  /// 從 Map 創建 Todo 對象（用於數據持久化）
  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      id: json['id'] as String,
      title: json['title'] as String,
      isCompleted: json['isCompleted'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  /// 轉換為 Map（用於數據持久化）
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'isCompleted': isCompleted,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  /// 創建副本，允許修改某些屬性
  Todo copyWith({
    String? id,
    String? title,
    bool? isCompleted,
    DateTime? createdAt,
  }) {
    return Todo(
      id: id ?? this.id,
      title: title ?? this.title,
      isCompleted: isCompleted ?? this.isCompleted,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  String toString() {
    return 'Todo(id: $id, title: $title, isCompleted: $isCompleted, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Todo && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
