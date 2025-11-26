import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/todo.dart';
import '../bloc/todo_bloc.dart';
import '../bloc/todo_event.dart';

/// Todo 項目組件
///
/// 顯示單個 todo 項目，支持：
/// - 切換完成狀態
/// - 滑動刪除
/// - 動畫效果
class TodoItem extends StatelessWidget {
  final Todo todo;

  const TodoItem({
    super.key,
    required this.todo,
  });

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(todo.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) {
        // 發送刪除事件
        context.read<TodoBloc>().add(DeleteTodoEvent(todo.id));

        // 顯示提示
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('待辦事項已刪除'),
            action: SnackBarAction(
              label: '確定',
              onPressed: () {},
            ),
            duration: const Duration(seconds: 2),
          ),
        );
      },
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.red.shade300, Colors.red.shade500],
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(
          Icons.delete_outline,
          color: Colors.white,
          size: 28,
        ),
      ),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 8,
          ),
          leading: _buildCheckbox(context),
          title: _buildTitle(),
          subtitle: _buildSubtitle(),
          onTap: () {
            // 點擊切換完成狀態
            context.read<TodoBloc>().add(ToggleTodoEvent(todo.id));
          },
        ),
      ),
    );
  }

  /// 構建 Checkbox
  Widget _buildCheckbox(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: todo.completed
            ? LinearGradient(
                colors: [Colors.green.shade400, Colors.green.shade600],
              )
            : null,
        border: todo.completed
            ? null
            : Border.all(color: Colors.grey.shade400, width: 2),
      ),
      child: Checkbox(
        value: todo.completed,
        onChanged: (_) {
          context.read<TodoBloc>().add(ToggleTodoEvent(todo.id));
        },
        activeColor: Colors.transparent,
        checkColor: Colors.white,
        shape: const CircleBorder(),
      ),
    );
  }

  /// 構建標題
  Widget _buildTitle() {
    return Text(
      todo.title,
      style: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        decoration: todo.completed ? TextDecoration.lineThrough : null,
        color: todo.completed ? Colors.grey : Colors.black87,
      ),
    );
  }

  /// 構建副標題（時間戳）
  Widget _buildSubtitle() {
    return Padding(
      padding: const EdgeInsets.only(top: 4),
      child: Text(
        _formatDateTime(todo.createdAt),
        style: TextStyle(
          fontSize: 12,
          color: Colors.grey.shade600,
        ),
      ),
    );
  }

  /// 格式化時間
  String _formatDateTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return '剛剛';
    } else if (difference.inHours < 1) {
      return '${difference.inMinutes} 分鐘前';
    } else if (difference.inDays < 1) {
      return '${difference.inHours} 小時前';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} 天前';
    } else {
      return '${dateTime.year}/${dateTime.month}/${dateTime.day}';
    }
  }
}
