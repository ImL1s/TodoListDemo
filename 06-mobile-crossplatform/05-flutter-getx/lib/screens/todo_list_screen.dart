import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/todo_controller.dart';
import '../widgets/todo_item.dart';

/// Todo List 主畫面
///
/// 使用 GetX 的幾種方式：
/// 1. Get.put() - 依賴注入，創建並註冊 Controller
/// 2. Get.find() - 獲取已註冊的 Controller
/// 3. Obx - 自動響應式 UI 更新
/// 4. GetBuilder - 手動控制 UI 更新（性能更好）
class TodoListScreen extends StatelessWidget {
  const TodoListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // 使用 Get.put() 註冊 Controller，如果已存在則返回現有實例
    final todoController = Get.put(TodoController());

    return Scaffold(
      appBar: AppBar(
        title: const Text('GetX Todo List'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          // 清除已完成項目按鈕
          Obx(() {
            return todoController.completedCount > 0
                ? IconButton(
                    icon: const Icon(Icons.delete_sweep),
                    onPressed: () => _showClearCompletedDialog(todoController),
                    tooltip: '清除已完成',
                  )
                : const SizedBox.shrink();
          }),
          // 全選/取消全選按鈕
          Obx(() {
            return todoController.totalCount > 0
                ? IconButton(
                    icon: Icon(
                      todoController.activeCount == 0
                          ? Icons.check_box
                          : Icons.check_box_outline_blank,
                    ),
                    onPressed: todoController.toggleAll,
                    tooltip: '全選/取消全選',
                  )
                : const SizedBox.shrink();
          }),
        ],
      ),
      body: Column(
        children: [
          // 統計資訊
          _buildStatsBar(todoController),

          // 過濾器選項
          _buildFilterBar(todoController),

          // Todo 列表
          Expanded(
            child: Obx(() {
              final todos = todoController.filteredTodos;

              if (todos.isEmpty) {
                return _buildEmptyState(todoController.filter);
              }

              return ListView.builder(
                itemCount: todos.length,
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemBuilder: (context, index) {
                  final todo = todos[index];
                  return TodoItem(
                    key: ValueKey(todo.id),
                    todo: todo,
                    onToggle: () => todoController.toggleTodo(todo.id),
                    onDelete: () => todoController.deleteTodo(todo.id),
                    onEdit: (newTitle) => todoController.editTodo(todo.id, newTitle),
                  );
                },
              );
            }),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddTodoDialog(todoController),
        icon: const Icon(Icons.add),
        label: const Text('新增待辦'),
      ),
    );
  }

  /// 統計資訊欄
  Widget _buildStatsBar(TodoController controller) {
    return Obx(() {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.blue.shade50,
          border: Border(
            bottom: BorderSide(color: Colors.grey.shade300),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildStatItem('全部', controller.totalCount, Colors.blue),
            _buildStatItem('進行中', controller.activeCount, Colors.orange),
            _buildStatItem('已完成', controller.completedCount, Colors.green),
          ],
        ),
      );
    });
  }

  /// 統計項目
  Widget _buildStatItem(String label, int count, Color color) {
    return Column(
      children: [
        Text(
          count.toString(),
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  /// 過濾器選項欄
  Widget _buildFilterBar(TodoController controller) {
    return Obx(() {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Row(
          children: [
            _buildFilterChip(
              controller,
              '全部',
              TodoFilter.all,
              Icons.list,
            ),
            const SizedBox(width: 8),
            _buildFilterChip(
              controller,
              '進行中',
              TodoFilter.active,
              Icons.radio_button_unchecked,
            ),
            const SizedBox(width: 8),
            _buildFilterChip(
              controller,
              '已完成',
              TodoFilter.completed,
              Icons.check_circle,
            ),
          ],
        ),
      );
    });
  }

  /// 過濾器選項按鈕
  Widget _buildFilterChip(
    TodoController controller,
    String label,
    TodoFilter filter,
    IconData icon,
  ) {
    final isSelected = controller.filter == filter;

    return Expanded(
      child: FilterChip(
        label: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 16),
            const SizedBox(width: 4),
            Text(label),
          ],
        ),
        selected: isSelected,
        onSelected: (_) => controller.setFilter(filter),
        selectedColor: Colors.blue.shade100,
        checkmarkColor: Colors.blue,
      ),
    );
  }

  /// 空狀態視圖
  Widget _buildEmptyState(TodoFilter filter) {
    String message;
    IconData icon;

    switch (filter) {
      case TodoFilter.active:
        message = '沒有進行中的待辦事項';
        icon = Icons.inbox_outlined;
        break;
      case TodoFilter.completed:
        message = '還沒有完成任何事項';
        icon = Icons.check_circle_outline;
        break;
      case TodoFilter.all:
      default:
        message = '還沒有任何待辦事項\n點擊下方按鈕新增';
        icon = Icons.playlist_add;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 80,
            color: Colors.grey.shade300,
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }

  /// 顯示新增 Todo 對話框
  void _showAddTodoDialog(TodoController controller) {
    final textController = TextEditingController();

    Get.dialog(
      AlertDialog(
        title: const Text('新增待辦事項'),
        content: TextField(
          controller: textController,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: '輸入待辦事項...',
            border: OutlineInputBorder(),
          ),
          onSubmitted: (value) {
            if (value.trim().isNotEmpty) {
              controller.addTodo(value);
              Get.back();
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () {
              if (textController.text.trim().isNotEmpty) {
                controller.addTodo(textController.text);
                Get.back();
              }
            },
            child: const Text('新增'),
          ),
        ],
      ),
    );
  }

  /// 顯示清除已完成項目確認對話框
  void _showClearCompletedDialog(TodoController controller) {
    Get.dialog(
      AlertDialog(
        title: const Text('確認清除'),
        content: Text('確定要清除所有 ${controller.completedCount} 個已完成的事項嗎？'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () {
              controller.clearCompleted();
              Get.back();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('清除'),
          ),
        ],
      ),
    );
  }
}
