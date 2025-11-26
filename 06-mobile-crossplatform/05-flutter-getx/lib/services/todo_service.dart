import 'dart:convert';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../models/todo.dart';

/// TodoService - 數據持久化服務
///
/// GetX 最佳實踐：
/// - 將數據持久化邏輯抽離到 Service 層
/// - Controller 專注於業務邏輯
/// - Service 可以被多個 Controller 共享
/// - 便於單元測試和模擬數據
class TodoService extends GetxService {
  static const String _storageKey = 'todos';
  late final GetStorage _storage;

  /// GetxService 的生命週期方法
  /// onInit 會在依賴注入時自動調用
  @override
  Future<void> onInit() async {
    super.onInit();
    await _initStorage();
  }

  /// 初始化 GetStorage
  Future<void> _initStorage() async {
    // 確保 GetStorage 已初始化
    await GetStorage.init();
    _storage = GetStorage();
  }

  /// 從本地存儲加載所有 todos
  List<Todo> loadTodos() {
    try {
      final String? todosJson = _storage.read(_storageKey);
      if (todosJson == null) {
        return _getDefaultTodos();
      }

      final List<dynamic> todosList = json.decode(todosJson);
      return todosList.map((json) => Todo.fromJson(json)).toList();
    } catch (e) {
      Get.printError(info: 'Error loading todos: $e');
      return _getDefaultTodos();
    }
  }

  /// 保存 todos 到本地存儲
  Future<void> saveTodos(List<Todo> todos) async {
    try {
      final String todosJson = json.encode(
        todos.map((todo) => todo.toJson()).toList(),
      );
      await _storage.write(_storageKey, todosJson);
    } catch (e) {
      Get.printError(info: 'Error saving todos: $e');
      rethrow;
    }
  }

  /// 清空所有數據
  Future<void> clearAll() async {
    await _storage.erase();
  }

  /// 獲取默認 todos（首次使用時）
  List<Todo> _getDefaultTodos() {
    return [
      Todo(
        id: '1',
        title: 'welcome_todo_1'.tr,
        isCompleted: false,
      ),
      Todo(
        id: '2',
        title: 'welcome_todo_2'.tr,
        isCompleted: false,
      ),
      Todo(
        id: '3',
        title: 'welcome_todo_3'.tr,
        isCompleted: false,
      ),
    ];
  }

  /// 檢查是否有緩存數據
  bool hasCache() {
    return _storage.hasData(_storageKey);
  }

  /// 獲取存儲統計信息
  Map<String, dynamic> getStorageStats() {
    return {
      'hasData': hasCache(),
      'keys': _storage.getKeys(),
    };
  }
}
