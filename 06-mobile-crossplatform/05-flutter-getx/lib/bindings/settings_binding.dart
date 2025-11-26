import 'package:get/get.dart';
import '../controllers/settings_controller.dart';

/// SettingsBinding - 設置頁面依賴注入綁定
class SettingsBinding extends Bindings {
  @override
  void dependencies() {
    // 註冊 SettingsController
    // 使用 lazyPut 延遲創建
    Get.lazyPut<SettingsController>(
      () => SettingsController(),
    );
  }
}
