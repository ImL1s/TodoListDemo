import 'package:get/get.dart';
import '../models/todo.dart';
import '../services/todo_service.dart';

/// TodoController - GetX 狀態管理控制器（改進版）
///
/// GetX 提供多種響應式狀態管理方式：
/// 1. Rx 類型（.obs）- 響應式變數，自動追蹤依賴
/// 2. GetBuilder - 手動控制更新，性能更好
/// 3. Obx - 自動響應 .obs 變數的變化
///
/// 改進重點：
/// - 使用 TodoService 處理數據持久化
/// - 添加 Workers 監聽器演示
/// - 完整的生命週期管理（onInit, onReady, onClose）
/// - 搜索功能演示 debounce Worker
/// - 使用 RxList.refresh() 確保響應式更新
class TodoController extends GetxController {
  // 依賴注入 TodoService
  final TodoService _todoService = Get.find<TodoService>();

  // 使用 RxList 來存儲 todos，.obs 使其成為響應式
  final _todos = <Todo>[].obs;

  // 過濾器狀態
  final _filter = TodoFilter.all.obs;

  // 搜索關鍵字（用於演示 debounce Worker）
  final _searchKeyword = ''.obs;

  // 變更計數器（用於演示 ever Worker）
  final _changeCount = 0.obs;

  // Workers（監聽器）列表，用於清理
  final List<Worker> _workers = [];

  // Getter - 獲取所有 todos
  List<Todo> get todos => _todos;

  // Getter - 當前過濾器
  TodoFilter get filter => _filter.value;

  // Getter - 搜索關鍵字
  String get searchKeyword => _searchKeyword.value;

  // Getter - 變更計數
  int get changeCount => _changeCount.value;

  // Getter - 根據過濾器和搜索返回對應的 todos
  List<Todo> get filteredTodos {
    var result = _todos.toList();

    // 應用過濾器
    switch (_filter.value) {
      case TodoFilter.active:
        result = result.where((todo) => !todo.isCompleted).toList();
        break;
      case TodoFilter.completed:
        result = result.where((todo) => todo.isCompleted).toList();
        break;
      case TodoFilter.all:
      default:
        break;
    }

    // 應用搜索過濾
    if (_searchKeyword.value.isNotEmpty) {
      result = result
          .where((todo) =>
              todo.title.toLowerCase().contains(_searchKeyword.value.toLowerCase()))
          .toList();
    }

    return result;
  }

  // 統計數據
  int get totalCount => _todos.length;
  int get activeCount => _todos.where((todo) => !todo.isCompleted).length;
  int get completedCount => _todos.where((todo) => todo.isCompleted).length;

  @override
  void onInit() {
    super.onInit();
    // 初始化時從本地存儲加載數據
    _loadInitialData();
    // 設置 Workers（響應式監聽器）
    _setupWorkers();
  }

  @override
  void onReady() {
    super.onReady();
    // onReady 在 widget 完全渲染後調用
    // 可以在這裡執行一些需要 context 的操作
    Get.printInfo(info: 'TodoController is ready!');
  }

  @override
  void onClose() {
    // 清理 Workers，防止內存洩漏
    for (var worker in _workers) {
      worker.dispose();
    }
    _workers.clear();

    // 保存數據
    _saveTodos();

    Get.printInfo(info: 'TodoController disposed');
    super.onClose();
  }

  /// 設置 Workers（GetX 響應式監聽器）
  ///
  /// GetX 提供 4 種 Workers：
  /// 1. ever - 每次變化都觸發
  /// 2. once - 只觸發一次
  /// 3. debounce - 防抖，延遲觸發（適合搜索）
  /// 4. interval - 節流，限制觸發頻率
  void _setupWorkers() {
    // ever - 監聽 todos 列表的所有變化
    // 每次 todos 變化都會觸發
    _workers.add(
      ever(
        _todos,
        (List<Todo> todos) {
          _changeCount.value++;
          Get.printInfo(info: 'Todos changed! Count: ${todos.length}');
          _saveTodos(); // 自動保存
        },
      ),
    );

    // debounce - 搜索關鍵字防抖
    // 用戶停止輸入 500ms 後才執行搜索
    _workers.add(
      debounce(
        _searchKeyword,
        (String keyword) {
          Get.printInfo(info: 'Search for: $keyword');
          // 這裡可以執行搜索 API 調用等操作
        },
        time: const Duration(milliseconds: 500),
      ),
    );

    // once - 只在第一次完成任務時觸發
    _workers.add(
      once(
        _todos,
        (List<Todo> todos) {
          final completed = todos.where((t) => t.isCompleted).toList();
          if (completed.isNotEmpty) {
            Get.printInfo(info: 'First todo completed!');
          }
        },
      ),
    );

    // interval - 節流示例
    // 最多每 1 秒觸發一次
    _workers.add(
      interval(
        _filter,
        (TodoFilter filter) {
          Get.printInfo(info: 'Filter changed to: $filter');
        },
        time: const Duration(seconds: 1),
      ),
    );
  }

  /// 加載初始數據
  void _loadInitialData() {
    try {
      final loadedTodos = _todoService.loadTodos();
      _todos.assignAll(loadedTodos);
    } catch (e) {
      Get.printError(info: 'Failed to load todos: $e');
      Get.snackbar(
        'error'.tr,
        'Failed to load todos',
        snackPosition: SnackPosition.BOTTOM,
      );
    }
  }

  /// 保存數據到本地存儲
  Future<void> _saveTodos() async {
    try {
      await _todoService.saveTodos(_todos);
    } catch (e) {
      Get.printError(info: 'Failed to save todos: $e');
    }
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
      'success'.tr,
      'todo_added'.tr,
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
    );
  }

  /// 切換 todo 完成狀態
  void toggleTodo(String id) {
    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index != -1) {
      final todo = _todos[index];
      // 使用 _todos[index] = ... 時需要調用 refresh() 確保響應式更新
      _todos[index] = todo.copyWith(isCompleted: !todo.isCompleted);
      _todos.refresh(); // 確保 UI 更新
    }
  }

  /// 刪除 todo
  void deleteTodo(String id) {
    _todos.removeWhere((todo) => todo.id == id);

    Get.snackbar(
      'success'.tr,
      'todo_deleted'.tr,
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
      _todos.refresh(); // 確保 UI 更新
    }
  }

  /// 清除所有已完成的 todos
  void clearCompleted() {
    final count = _todos.where((todo) => todo.isCompleted).length;
    _todos.removeWhere((todo) => todo.isCompleted);

    Get.snackbar(
      'success'.tr,
      'completed_cleared'.tr,
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
    );
  }

  /// 設置過濾器
  void setFilter(TodoFilter newFilter) {
    _filter.value = newFilter;
  }

  /// 設置搜索關鍵字
  void setSearchKeyword(String keyword) {
    _searchKeyword.value = keyword;
  }

  /// 清空搜索
  void clearSearch() {
    _searchKeyword.value = '';
  }

  /// 全選/取消全選
  void toggleAll() {
    final allCompleted = _todos.every((todo) => todo.isCompleted);

    // 使用 assignAll 或在循環後調用 refresh()
    final updatedTodos = _todos
        .map((todo) => todo.copyWith(isCompleted: !allCompleted))
        .toList();
    _todos.assignAll(updatedTodos);
  }
}

/// 過濾器枚舉
enum TodoFilter {
  all,
  active,
  completed,
}
