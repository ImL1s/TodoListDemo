import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

/// SettingsController - 設置管理控制器
///
/// 管理應用設置，包括：
/// - 主題切換（淺色/深色/系統）
/// - 語言切換（中文/英文）
/// - 設置持久化
class SettingsController extends GetxController {
  static const String _themeKey = 'theme_mode';
  static const String _localeKey = 'locale';

  late final GetStorage _storage;

  // 響應式主題模式
  final _themeMode = ThemeMode.system.obs;

  // 響應式語言設置
  final Rx<Locale?> _locale = Rx<Locale?>(null);

  // Getters
  ThemeMode get themeMode => _themeMode.value;
  Locale? get locale => _locale.value;

  @override
  void onInit() {
    super.onInit();
    _storage = GetStorage();
    _loadSettings();
  }

  /// 加載保存的設置
  void _loadSettings() {
    // 加載主題設置
    final String? themeString = _storage.read(_themeKey);
    if (themeString != null) {
      _themeMode.value = _parseThemeMode(themeString);
    }

    // 加載語言設置
    final String? localeString = _storage.read(_localeKey);
    if (localeString != null) {
      _locale.value = _parseLocale(localeString);
      if (_locale.value != null) {
        Get.updateLocale(_locale.value!);
      }
    }
  }

  /// 設置主題模式
  void setThemeMode(ThemeMode mode) {
    _themeMode.value = mode;
    _storage.write(_themeKey, mode.toString());
    Get.changeThemeMode(mode);

    Get.snackbar(
      'success'.tr,
      'theme'.tr + ': ' + _getThemeName(mode),
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
    );
  }

  /// 設置語言
  void setLocale(Locale locale) {
    _locale.value = locale;
    _storage.write(_localeKey, locale.toString());
    Get.updateLocale(locale);

    Get.snackbar(
      'success'.tr,
      'language'.tr + ': ' + _getLocaleName(locale),
      snackPosition: SnackPosition.BOTTOM,
      duration: const Duration(seconds: 2),
    );
  }

  /// 切換主題
  void toggleTheme() {
    switch (_themeMode.value) {
      case ThemeMode.light:
        setThemeMode(ThemeMode.dark);
        break;
      case ThemeMode.dark:
        setThemeMode(ThemeMode.system);
        break;
      case ThemeMode.system:
        setThemeMode(ThemeMode.light);
        break;
    }
  }

  /// 清除所有設置
  void resetSettings() {
    _storage.remove(_themeKey);
    _storage.remove(_localeKey);
    _themeMode.value = ThemeMode.system;
    _locale.value = null;

    Get.updateLocale(const Locale('zh', 'TW'));
    Get.changeThemeMode(ThemeMode.system);
  }

  /// 解析主題模式字符串
  ThemeMode _parseThemeMode(String themeString) {
    switch (themeString) {
      case 'ThemeMode.light':
        return ThemeMode.light;
      case 'ThemeMode.dark':
        return ThemeMode.dark;
      default:
        return ThemeMode.system;
    }
  }

  /// 解析語言字符串
  Locale? _parseLocale(String localeString) {
    if (localeString.contains('_')) {
      final parts = localeString.split('_');
      if (parts.length == 2) {
        return Locale(parts[0], parts[1]);
      }
    }
    return null;
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
  String _getLocaleName(Locale locale) {
    if (locale.languageCode == 'zh') {
      return 'chinese'.tr;
    } else if (locale.languageCode == 'en') {
      return 'english'.tr;
    }
    return locale.toString();
  }
}
