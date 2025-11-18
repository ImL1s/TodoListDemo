import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'screens/todo_list_screen.dart';

void main() {
  runApp(const MyApp());
}

/// 主應用程式
///
/// 使用 GetMaterialApp 代替 MaterialApp
/// GetMaterialApp 提供：
/// - 路由管理（Get.to, Get.back, Get.off 等）
/// - 依賴注入（Get.put, Get.find 等）
/// - 國際化支持
/// - 主題管理
/// - SnackBar、Dialog、BottomSheet 等工具
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'GetX Todo List',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,

        // 自定義主題
        cardTheme: CardTheme(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),

        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          filled: true,
          fillColor: Colors.grey.shade50,
        ),

        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),

        floatingActionButtonTheme: FloatingActionButtonThemeData(
          backgroundColor: Colors.blue,
          foregroundColor: Colors.white,
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),

      // 使用 GetX 路由管理
      home: const TodoListScreen(),

      // GetX 配置
      defaultTransition: Transition.cupertino,

      // 也可以定義命名路由
      getPages: [
        GetPage(
          name: '/',
          page: () => const TodoListScreen(),
          transition: Transition.fadeIn,
        ),
      ],
    );
  }
}
