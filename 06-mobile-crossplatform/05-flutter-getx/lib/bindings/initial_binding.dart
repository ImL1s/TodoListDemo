import 'package:get/get.dart';
import '../controllers/settings_controller.dart';
import '../services/todo_service.dart';

/// InitialBinding - 應用啟動時的初始化綁定
///
/// 用於註冊全局性的服務和控制器
/// 這些依賴在整個應用生命週期中都會存在
class InitialBinding extends Bindings {
  @override
  void dependencies() {
    // 註冊全局 Service（permanent: true 表示永久存在）
    Get.putAsync<TodoService>(
      () async {
        final service = TodoService();
        await service.onInit();
        return service;
      },
      permanent: true,
    );

    // 註冊全局 SettingsController（permanent: true）
    Get.put<SettingsController>(
      SettingsController(),
      permanent: true,
    );
  }
}
