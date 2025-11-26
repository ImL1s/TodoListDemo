import 'package:flutter/material.dart';
import '../models/todo.dart';

/// Todo 列表項組件
///
/// 這是一個 StatelessWidget，用於顯示單個待辦事項
/// 它接收 Todo 對象和回調函數作為參數
class TodoItem extends StatelessWidget {
  /// 待辦事項數據
  final Todo todo;

  /// 切換完成狀態的回調
  final VoidCallback onToggle;

  /// 刪除待辦事項的回調
  final VoidCallback onDelete;

  /// 編輯待辦事項的回調
  final VoidCallback onEdit;

  const TodoItem({
    Key? key,
    required this.todo,
    required this.onToggle,
    required this.onDelete,
    required this.onEdit,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Card(
        elevation: 2,
        child: ListTile(
        /// 左側的複選框
        leading: Checkbox(
          value: todo.isCompleted,
          onChanged: (_) => onToggle(),
          activeColor: Colors.green,
        ),

        /// 中間的標題文本
        title: Text(
          todo.title,
          style: TextStyle(
            // 已完成的項目添加刪除線
            decoration: todo.isCompleted
              ? TextDecoration.lineThrough
              : TextDecoration.none,
            // 已完成的項目文字顏色變淡
            color: todo.isCompleted
              ? Colors.grey
              : Colors.black87,
            fontSize: 16,
          ),
        ),

        /// 副標題顯示創建時間
        subtitle: Text(
          _formatDate(todo.createdAt),
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),

        /// 右側的操作按鈕
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // 編輯按鈕
            IconButton(
              icon: const Icon(Icons.edit, color: Colors.blue),
              onPressed: onEdit,
              tooltip: '編輯',
            ),
            // 刪除按鈕
            IconButton(
              icon: const Icon(Icons.delete, color: Colors.red),
              onPressed: () => _showDeleteConfirmation(context),
              tooltip: '刪除',
            ),
          ],
        ),

        /// 點擊整個項目也可以切換完成狀態
        onTap: onToggle,
      ),
      ),
    );
  }

  /// 格式化日期時間
  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final itemDate = DateTime(date.year, date.month, date.day);

    if (itemDate == today) {
      return '今天 ${_twoDigits(date.hour)}:${_twoDigits(date.minute)}';
    } else if (itemDate == today.subtract(const Duration(days: 1))) {
      return '昨天 ${_twoDigits(date.hour)}:${_twoDigits(date.minute)}';
    } else {
      return '${date.year}-${_twoDigits(date.month)}-${_twoDigits(date.day)} ${_twoDigits(date.hour)}:${_twoDigits(date.minute)}';
    }
  }

  /// 輔助函數：確保兩位數格式
  String _twoDigits(int n) => n.toString().padLeft(2, '0');

  /// 顯示刪除確認對話框
  void _showDeleteConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('確認刪除'),
          content: Text('確定要刪除「${todo.title}」嗎？'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('取消'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                onDelete();
              },
              style: TextButton.styleFrom(
                foregroundColor: Colors.red,
              ),
              child: const Text('刪除'),
            ),
          ],
        );
      },
    );
  }
}
