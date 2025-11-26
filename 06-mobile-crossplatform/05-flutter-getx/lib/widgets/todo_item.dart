import 'package:flutter/material.dart';
import '../models/todo.dart';

/// Todo 項目 Widget
///
/// 這是一個 StatelessWidget，不需要管理內部狀態
/// 所有狀態變更都通過回調函數傳遞給 Controller
class TodoItem extends StatelessWidget {
  final Todo todo;
  final VoidCallback onToggle;
  final VoidCallback onDelete;
  final Function(String) onEdit;

  const TodoItem({
    super.key,
    required this.todo,
    required this.onToggle,
    required this.onDelete,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: ValueKey(todo.id),
      background: _buildDismissBackground(Colors.green, Alignment.centerLeft, Icons.check),
      secondaryBackground: _buildDismissBackground(Colors.red, Alignment.centerRight, Icons.delete),
      confirmDismiss: (direction) async {
        if (direction == DismissDirection.endToStart) {
          // 向左滑動 - 刪除
          return await _showDeleteConfirmDialog(context);
        } else {
          // 向右滑動 - 切換完成狀態
          onToggle();
          return false;
        }
      },
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        elevation: todo.isCompleted ? 1 : 2,
        child: ListTile(
          leading: Checkbox(
            value: todo.isCompleted,
            onChanged: (_) => onToggle(),
            activeColor: Colors.green,
          ),
          title: Text(
            todo.title,
            style: TextStyle(
              decoration: todo.isCompleted
                  ? TextDecoration.lineThrough
                  : TextDecoration.none,
              color: todo.isCompleted
                  ? Colors.grey.shade500
                  : Colors.black87,
              fontSize: 16,
            ),
          ),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              // 編輯按鈕
              IconButton(
                icon: const Icon(Icons.edit, size: 20),
                color: Colors.blue,
                onPressed: () => _showEditDialog(context),
                tooltip: '編輯',
              ),
              // 刪除按鈕
              IconButton(
                icon: const Icon(Icons.delete, size: 20),
                color: Colors.red,
                onPressed: () async {
                  final confirmed = await _showDeleteConfirmDialog(context);
                  if (confirmed == true) {
                    onDelete();
                  }
                },
                tooltip: '刪除',
              ),
            ],
          ),
          onTap: onToggle,
        ),
      ),
    );
  }

  /// 滑動刪除背景
  Widget _buildDismissBackground(Color color, Alignment alignment, IconData icon) {
    return Container(
      color: color,
      alignment: alignment,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Icon(
        icon,
        color: Colors.white,
        size: 32,
      ),
    );
  }

  /// 顯示編輯對話框
  /// 改用 Get.dialog 代替 showDialog（GetX 最佳實踐）
  void _showEditDialog(BuildContext context) {
    final textController = TextEditingController(text: todo.title);

    Get.dialog(
      AlertDialog(
        title: Text('edit_todo_title'.tr),
        content: TextField(
          controller: textController,
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'input_new_content'.tr,
            border: const OutlineInputBorder(),
          ),
          onSubmitted: (value) {
            if (value.trim().isNotEmpty) {
              onEdit(value);
              Get.back();
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text('cancel'.tr),
          ),
          ElevatedButton(
            onPressed: () {
              if (textController.text.trim().isNotEmpty) {
                onEdit(textController.text);
                Get.back();
              }
            },
            child: Text('save'.tr),
          ),
        ],
      ),
    );
  }

  /// 顯示刪除確認對話框
  /// 改用 Get.dialog 代替 showDialog（GetX 最佳實踐）
  Future<bool?> _showDeleteConfirmDialog(BuildContext context) async {
    return await Get.dialog<bool>(
      AlertDialog(
        title: Text('confirm_delete'.tr),
        content: Text('confirm_delete_message'.trParams({'title': todo.title})),
        actions: [
          TextButton(
            onPressed: () => Get.back(result: false),
            child: Text('cancel'.tr),
          ),
          ElevatedButton(
            onPressed: () => Get.back(result: true),
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
}
