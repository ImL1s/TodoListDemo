import 'package:flutter/material.dart';
import 'screens/todo_list_screen.dart';

/// 應用程序的入口點
///
/// main() 函數是 Dart 應用的起點
/// runApp() 是 Flutter 框架的函數，用於啟動應用
void main() {
  runApp(const MyApp());
}

/// 應用程序的根組件
///
/// 這是一個 StatelessWidget，因為應用的根配置不需要狀態管理
/// 它配置了應用的主題、標題等全局設置
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      /// 應用標題（在任務切換器中顯示）
      title: 'Flutter 基礎 Todo List',

      /// 關閉右上角的 Debug 橫幅
      debugShowCheckedModeBanner: false,

      /// Material Design 主題配置
      theme: ThemeData(
        /// 主色調
        primarySwatch: Colors.blue,

        /// 使用 Material 3 設計規範
        useMaterial3: true,

        /// 卡片主題
        cardTheme: CardTheme(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),

        /// 輸入框主題
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          filled: true,
          fillColor: Colors.grey[50],
        ),

        /// 浮動操作按鈕主題
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          elevation: 4,
        ),

        /// 應用欄主題
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 2,
        ),
      ),

      /// 首頁設置為 TodoListScreen
      home: const TodoListScreen(),
    );
  }
}
