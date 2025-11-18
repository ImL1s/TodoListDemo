import 'package:get/get.dart';
import '../models/todo.dart';

/// TodoController - GetX 狀態管理控制器
///
/// GetX 提供多種響應式狀態管理方式：
/// 1. Rx 類型（.obs）- 響應式變數，自動追蹤依賴
/// 2. GetBuilder - 手動控制更新，性能更好
/// 3. Obx - 自動響應 .obs 變數的變化
class TodoController extends GetxController {
  // 使用 RxList 來存儲 todos，.obs 使其成為響應式
  final _todos = <Todo>[].obs;

  // 過濾器狀態
  final _filter = TodoFilter.all.obs;

  // Getter - 獲取所有 todos
  List<Todo> get todos => _todos;

  // Getter - 當前過濾器
  TodoFilter get filter => _filter.value;

  // Getter - 根據過濾器返回對應的 todos
  List<Todo> get filteredTodos {
    switch (_filter.value) {
      case TodoFilter.active:
        return _todos.where((todo) => !todo.isCompleted).toList();
      case TodoFilter.completed:
        return _todos.where((todo) => todo.isCompleted).toList();
      case TodoFilter.all:
      default:
        return _todos;
    }
  }

  // 統計數據
  int get totalCount => _todos.length;
  int get activeCount => _todos.where((todo) => !todo.isCompleted).length;
  int get completedCount => _todos.where((todo) => todo.isCompleted).length;

  @override
  void onInit() {
    super.onInit();
    // 初始化時可以從本地存儲加載數據
    _loadInitialData();
  }

  /// 加載初始數據（示範用）
  void _loadInitialData() {
    _todos.addAll([
      Todo(
        id: '1',
        title: '學習 Flutter GetX',
        isCompleted: false,
      ),
      Todo(
        id: '2',
        title: '了解響應式狀態管理',
        isCompleted: false,
      ),
      Todo(
        id: '3',
        title: '比較 GetX vs Riverpod',
        isCompleted: false,
      ),
    ]);
  }

  /// 新增 todo
  void addTodo(String title) {
    if (title.trim().isEmpty) return;

    final newTodo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title.trim(),
      isCompleted: false,
    );

    _todos.add(newTodo);

    // 顯示成功訊息
    Get.snackbar(
      '成功',
      '已新增待辦事項',
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
    );
  }

  /// 切換 todo 完成狀態
  void toggleTodo(String id) {
    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index != -1) {
      final todo = _todos[index];
      _todos[index] = todo.copyWith(isCompleted: !todo.isCompleted);
    }
  }

  /// 刪除 todo
  void deleteTodo(String id) {
    _todos.removeWhere((todo) => todo.id == id);

    Get.snackbar(
      '成功',
      '已刪除待辦事項',
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
    );
  }

  /// 編輯 todo
  void editTodo(String id, String newTitle) {
    if (newTitle.trim().isEmpty) return;

    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index != -1) {
      final todo = _todos[index];
      _todos[index] = todo.copyWith(title: newTitle.trim());
    }
  }

  /// 清除所有已完成的 todos
  void clearCompleted() {
    _todos.removeWhere((todo) => todo.isCompleted);

    Get.snackbar(
      '成功',
      '已清除所有已完成事項',
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
    );
  }

  /// 設置過濾器
  void setFilter(TodoFilter newFilter) {
    _filter.value = newFilter;
  }

  /// 全選/取消全選
  void toggleAll() {
    final allCompleted = _todos.every((todo) => todo.isCompleted);

    for (int i = 0; i < _todos.length; i++) {
      _todos[i] = _todos[i].copyWith(isCompleted: !allCompleted);
    }
  }
}

/// 過濾器枚舉
enum TodoFilter {
  all,
  active,
  completed,
}
