import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/todo.dart';

/// Todo 數據持久化服務
///
/// 使用 SharedPreferences 來存儲和讀取待辦事項數據
/// 這是一個簡單的本地存儲解決方案，適合小量數據
class TodoStorageService {
  /// SharedPreferences 存儲鍵
  static const String _todosKey = 'todos';

  /// 保存待辦事項列表
  ///
  /// 將 Todo 對象列表序列化為 JSON 並存儲
  static Future<void> saveTodos(List<Todo> todos) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String encodedData = jsonEncode(
        todos.map((todo) => todo.toJson()).toList(),
      );
      await prefs.setString(_todosKey, encodedData);
    } catch (e) {
      throw Exception('保存待辦事項失敗: $e');
    }
  }

  /// 讀取待辦事項列表
  ///
  /// 從 SharedPreferences 讀取 JSON 並反序列化為 Todo 對象列表
  static Future<List<Todo>> loadTodos() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? encodedData = prefs.getString(_todosKey);

      if (encodedData == null) {
        return [];
      }

      final List<dynamic> decodedData = jsonDecode(encodedData);
      return decodedData.map((item) => Todo.fromJson(item)).toList();
    } catch (e) {
      throw Exception('讀取待辦事項失敗: $e');
    }
  }

  /// 清除所有待辦事項數據
  static Future<void> clearTodos() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_todosKey);
    } catch (e) {
      throw Exception('清除待辦事項失敗: $e');
    }
  }
}
