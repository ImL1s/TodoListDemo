import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'bindings/initial_binding.dart';
import 'bindings/home_binding.dart';
import 'bindings/settings_binding.dart';
import 'screens/todo_list_screen.dart';
import 'screens/settings_screen.dart';
import 'translations/app_translations.dart';

/// 主函數
///
/// GetX 最佳實踐：
/// 1. 在 main 中初始化 GetStorage
/// 2. 使用 initialBinding 注入全局依賴
/// 3. 配置國際化（translations, locale, fallbackLocale）
/// 4. 配置主題（theme, darkTheme, themeMode）
/// 5. 使用命名路由和 Bindings
void main() async {
  // 確保 Flutter 綁定已初始化
  WidgetsFlutterBinding.ensureInitialized();

  // 初始化 GetStorage
  await GetStorage.init();

  runApp(const MyApp());
}

/// 主應用程式（改進版）
///
/// 改進重點：
/// - 使用 GetMaterialApp 啟用 GetX 功能
/// - 配置國際化（AppTranslations）
/// - 配置深色主題
/// - 使用 InitialBinding 注入全局依賴
/// - 使用命名路由和路由 Bindings
/// - 響應式主題切換
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      // 應用標題
      title: 'GetX Todo List',
      debugShowCheckedModeBanner: false,

      // === 國際化配置 ===
      translations: AppTranslations(),
      locale: const Locale('zh', 'TW'), // 默認語言
      fallbackLocale: const Locale('en', 'US'), // 備用語言

      // === 主題配置 ===
      theme: _buildLightTheme(),
      darkTheme: _buildDarkTheme(),
      themeMode: ThemeMode.system, // 跟隨系統

      // === 全局依賴注入 ===
      initialBinding: InitialBinding(),

      // === 路由配置 ===
      initialRoute: '/',
      getPages: [
        GetPage(
          name: '/',
          page: () => const TodoListScreen(),
          binding: HomeBinding(),
          transition: Transition.fadeIn,
        ),
        GetPage(
          name: '/settings',
          page: () => const SettingsScreen(),
          binding: SettingsBinding(),
          transition: Transition.rightToLeft,
        ),
      ],

      // === GetX 配置 ===
      defaultTransition: Transition.cupertino,
      enableLog: true, // 開發時啟用日誌
      logWriterCallback: (String text, {bool isError = false}) {
        // 自定義日誌輸出
        if (isError) {
          debugPrint('❌ GetX Error: $text');
        } else {
          debugPrint('✅ GetX Log: $text');
        }
      },
    );
  }

  /// 構建淺色主題
  ThemeData _buildLightTheme() {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.blue,
        brightness: Brightness.light,
      ),

      // Card 主題
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),

      // 輸入框主題
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        filled: true,
        fillColor: Colors.grey.shade50,
      ),

      // 按鈕主題
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),

      // FAB 主題
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),

      // AppBar 主題
      appBarTheme: AppBarTheme(
        centerTitle: false,
        elevation: 0,
        backgroundColor: Colors.blue.shade100,
        foregroundColor: Colors.black87,
      ),
    );
  }

  /// 構建深色主題
  ThemeData _buildDarkTheme() {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.blue,
        brightness: Brightness.dark,
      ),

      // Card 主題
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),

      // 輸入框主題
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        filled: true,
      ),

      // 按鈕主題
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),

      // FAB 主題
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),

      // AppBar 主題
      appBarTheme: const AppBarTheme(
        centerTitle: false,
        elevation: 0,
      ),
    );
  }
}
