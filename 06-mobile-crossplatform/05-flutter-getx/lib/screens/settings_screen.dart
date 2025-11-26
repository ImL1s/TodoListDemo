import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/settings_controller.dart';
import '../services/todo_service.dart';

/// 設置頁面
///
/// 演示 GetX 功能：
/// 1. 命名路由導航（Get.toNamed）
/// 2. 主題切換（Get.changeThemeMode）
/// 3. 國際化切換（Get.updateLocale）
/// 4. 依賴查找（Get.find）
/// 5. 對話框（Get.dialog）
class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // 使用 Get.find() 獲取已註冊的 Controller
    final settingsController = Get.find<SettingsController>();
    final todoService = Get.find<TodoService>();

    return Scaffold(
      appBar: AppBar(
        title: Text('settings'.tr),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: ListView(
        children: [
          // 外觀設置區塊
          _buildSectionHeader('theme'.tr),
          Obx(() => _buildThemeTile(settingsController)),

          const Divider(),

          // 語言設置區塊
          _buildSectionHeader('language'.tr),
          Obx(() => _buildLanguageTile(settingsController)),

          const Divider(),

          // 存儲資訊區塊
          _buildSectionHeader('storage_info'.tr),
          _buildStorageInfo(todoService),

          const Divider(),

          // 關於區塊
          _buildSectionHeader('about'.tr),
          _buildAboutTile(),

          const SizedBox(height: 20),

          // 危險操作區塊
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton.icon(
              onPressed: () => _showClearDataDialog(todoService),
              icon: const Icon(Icons.delete_forever),
              label: Text('clear_all_data'.tr),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 區塊標題
  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.grey.shade600,
        ),
      ),
    );
  }

  /// 主題設置項
  Widget _buildThemeTile(SettingsController controller) {
    return ListTile(
      leading: Icon(_getThemeIcon(controller.themeMode)),
      title: Text('theme'.tr),
      subtitle: Text(_getThemeName(controller.themeMode)),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => _showThemeDialog(controller),
    );
  }

  /// 語言設置項
  Widget _buildLanguageTile(SettingsController controller) {
    return ListTile(
      leading: const Icon(Icons.language),
      title: Text('language'.tr),
      subtitle: Text(_getLanguageName(controller.locale)),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => _showLanguageDialog(controller),
    );
  }

  /// 存儲資訊
  Widget _buildStorageInfo(TodoService service) {
    final stats = service.getStorageStats();
    final hasData = stats['hasData'] as bool;

    return ListTile(
      leading: Icon(
        hasData ? Icons.storage : Icons.storage_outlined,
        color: hasData ? Colors.green : Colors.grey,
      ),
      title: Text('storage_info'.tr),
      subtitle: Text(hasData ? 'has_cache'.tr : 'no_cache'.tr),
    );
  }

  /// 關於項目
  Widget _buildAboutTile() {
    return ListTile(
      leading: const Icon(Icons.info_outline),
      title: Text('about'.tr),
      subtitle: const Text('Flutter GetX Todo List v1.0.0'),
      onTap: () {
        Get.dialog(
          AlertDialog(
            title: Text('about'.tr),
            content: const Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Flutter GetX Todo List'),
                SizedBox(height: 8),
                Text('Version: 1.0.0'),
                SizedBox(height: 8),
                Text('使用 GetX 狀態管理框架實作的待辦事項應用'),
                SizedBox(height: 16),
                Text('特色功能：'),
                Text('• 響應式狀態管理'),
                Text('• 數據持久化'),
                Text('• 主題切換'),
                Text('• 國際化支持'),
                Text('• Workers 監聽器'),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Get.back(),
                child: Text('confirm'.tr),
              ),
            ],
          ),
        );
      },
    );
  }

  /// 顯示主題選擇對話框
  void _showThemeDialog(SettingsController controller) {
    Get.dialog(
      AlertDialog(
        title: Text('theme'.tr),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile<ThemeMode>(
              title: Text('light_theme'.tr),
              value: ThemeMode.light,
              groupValue: controller.themeMode,
              onChanged: (value) {
                if (value != null) {
                  controller.setThemeMode(value);
                  Get.back();
                }
              },
            ),
            RadioListTile<ThemeMode>(
              title: Text('dark_theme'.tr),
              value: ThemeMode.dark,
              groupValue: controller.themeMode,
              onChanged: (value) {
                if (value != null) {
                  controller.setThemeMode(value);
                  Get.back();
                }
              },
            ),
            RadioListTile<ThemeMode>(
              title: Text('system_theme'.tr),
              value: ThemeMode.system,
              groupValue: controller.themeMode,
              onChanged: (value) {
                if (value != null) {
                  controller.setThemeMode(value);
                  Get.back();
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  /// 顯示語言選擇對話框
  void _showLanguageDialog(SettingsController controller) {
    Get.dialog(
      AlertDialog(
        title: Text('language'.tr),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile<Locale>(
              title: const Text('繁體中文'),
              value: const Locale('zh', 'TW'),
              groupValue: controller.locale ?? Get.locale,
              onChanged: (value) {
                if (value != null) {
                  controller.setLocale(value);
                  Get.back();
                }
              },
            ),
            RadioListTile<Locale>(
              title: const Text('English'),
              value: const Locale('en', 'US'),
              groupValue: controller.locale ?? Get.locale,
              onChanged: (value) {
                if (value != null) {
                  controller.setLocale(value);
                  Get.back();
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  /// 顯示清除數據確認對話框
  void _showClearDataDialog(TodoService service) {
    Get.dialog(
      AlertDialog(
        title: Text('confirm'.tr),
        content: Text('clear_data_confirm'.tr),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text('cancel'.tr),
          ),
          ElevatedButton(
            onPressed: () async {
              await service.clearAll();
              Get.back();
              Get.back(); // 返回主頁
              Get.snackbar(
                'success'.tr,
                'data_cleared'.tr,
                snackPosition: SnackPosition.BOTTOM,
              );
              // 重新加載應用
              Get.offAllNamed('/');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: Text('delete'.tr),
          ),
        ],
      ),
    );
  }

  /// 獲取主題圖標
  IconData _getThemeIcon(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return Icons.light_mode;
      case ThemeMode.dark:
        return Icons.dark_mode;
      case ThemeMode.system:
        return Icons.brightness_auto;
    }
  }

  /// 獲取主題名稱
  String _getThemeName(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return 'light_theme'.tr;
      case ThemeMode.dark:
        return 'dark_theme'.tr;
      case ThemeMode.system:
        return 'system_theme'.tr;
    }
  }

  /// 獲取語言名稱
  String _getLanguageName(Locale? locale) {
    final currentLocale = locale ?? Get.locale ?? const Locale('zh', 'TW');
    if (currentLocale.languageCode == 'zh') {
      return 'chinese'.tr;
    } else if (currentLocale.languageCode == 'en') {
      return 'english'.tr;
    }
    return currentLocale.toString();
  }
}
