import 'package:get/get.dart';
import '../controllers/todo_controller.dart';
import '../services/todo_service.dart';

/// HomeBinding - 主頁面依賴注入綁定
///
/// GetX Bindings 最佳實踐：
/// 1. 每個頁面有自己的 Binding 類
/// 2. 在 Binding 中初始化該頁面需要的所有依賴
/// 3. 使用 Get.lazyPut() 延遲創建（首次使用時才創建）
/// 4. GetX 會在頁面銷毀時自動清理依賴
///
/// 優點：
/// - 依賴管理集中化
/// - 自動內存管理
/// - 易於測試和模擬
/// - 避免在 Widget 中直接創建依賴
class HomeBinding extends Bindings {
  @override
  void dependencies() {
    // 註冊 TodoService（全局單例，永久存在）
    // 使用 Get.putAsync 因為 Service 需要異步初始化
    Get.putAsync<TodoService>(
      () async {
        final service = TodoService();
        await service.onInit();
        return service;
      },
      permanent: true,
    );

    // 註冊 TodoController（延遲創建，頁面銷毀時自動清理）
    // fenix: true 表示如果之前已刪除，可以重新創建
    Get.lazyPut<TodoController>(
      () => TodoController(),
      fenix: true,
    );
  }
}
