import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/todo_controller.dart';
import '../widgets/todo_item.dart';

/// Todo List 主畫面（改進版）
///
/// 使用 GetX 的幾種方式：
/// 1. Get.find() - 獲取已註冊的 Controller（通過 Binding）
/// 2. Obx - 自動響應式 UI 更新
/// 3. Get.dialog - 顯示對話框
/// 4. .tr - 國際化翻譯
///
/// 改進重點：
/// - 使用 Get.find() 替代 Get.put()（配合 Bindings）
/// - 添加搜索功能（演示 debounce Worker）
/// - 完整的國際化支持
/// - 使用 Get.toNamed() 路由導航
class TodoListScreen extends StatelessWidget {
  const TodoListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // 使用 Get.find() 獲取已註冊的 Controller（由 Binding 注入）
    final todoController = Get.find<TodoController>();

    return Scaffold(
      appBar: AppBar(
        title: Text('app_title'.tr),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          // 設置按鈕
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Get.toNamed('/settings'),
            tooltip: 'settings'.tr,
          ),
          // 清除已完成項目按鈕
          Obx(() {
            return todoController.completedCount > 0
                ? IconButton(
                    icon: const Icon(Icons.delete_sweep),
                    onPressed: () => _showClearCompletedDialog(todoController),
                    tooltip: 'clear_completed'.tr,
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
                    tooltip: 'toggle_all'.tr,
                  )
                : const SizedBox.shrink();
          }),
        ],
      ),
      body: Column(
        children: [
          // 統計資訊
          _buildStatsBar(todoController),

          // 搜索欄（演示 debounce Worker）
          _buildSearchBar(todoController),

          // 過濾器選項
          _buildFilterBar(todoController),

          // Workers 狀態顯示（演示用）
          _buildWorkersInfo(todoController),

          // Todo 列表
          Expanded(
            child: Obx(() {
              final todos = todoController.filteredTodos;

              if (todos.isEmpty) {
                return _buildEmptyState(todoController);
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
        label: Text('add_todo'.tr),
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
            _buildStatItem('total'.tr, controller.totalCount, Colors.blue),
            _buildStatItem('active'.tr, controller.activeCount, Colors.orange),
            _buildStatItem('completed'.tr, controller.completedCount, Colors.green),
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

  /// 搜索欄（演示 debounce Worker）
  Widget _buildSearchBar(TodoController controller) {
    return Obx(() {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: TextField(
          decoration: InputDecoration(
            hintText: 'search_hint'.tr,
            prefixIcon: const Icon(Icons.search),
            suffixIcon: controller.searchKeyword.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: controller.clearSearch,
                  )
                : null,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            filled: true,
            fillColor: Colors.grey.shade50,
          ),
          onChanged: controller.setSearchKeyword,
        ),
      );
    });
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
              'all'.tr,
              TodoFilter.all,
              Icons.list,
            ),
            const SizedBox(width: 8),
            _buildFilterChip(
              controller,
              'active'.tr,
              TodoFilter.active,
              Icons.radio_button_unchecked,
            ),
            const SizedBox(width: 8),
            _buildFilterChip(
              controller,
              'completed'.tr,
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
            Flexible(child: Text(label, overflow: TextOverflow.ellipsis)),
          ],
        ),
        selected: isSelected,
        onSelected: (_) => controller.setFilter(filter),
        selectedColor: Colors.blue.shade100,
        checkmarkColor: Colors.blue,
      ),
    );
  }

  /// Workers 資訊顯示（演示用）
  Widget _buildWorkersInfo(TodoController controller) {
    return Obx(() {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        child: Row(
          children: [
            Icon(Icons.sensors, size: 16, color: Colors.grey.shade600),
            const SizedBox(width: 8),
            Text(
              'Workers: ${controller.changeCount} changes',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      );
    });
  }

  /// 空狀態視圖
  Widget _buildEmptyState(TodoController controller) {
    String message;
    IconData icon;

    // 如果有搜索關鍵字，顯示無搜索結果
    if (controller.searchKeyword.isNotEmpty) {
      message = 'No results for "${controller.searchKeyword}"';
      icon = Icons.search_off;
    } else {
      switch (controller.filter) {
        case TodoFilter.active:
          message = 'no_active_todos'.tr;
          icon = Icons.inbox_outlined;
          break;
        case TodoFilter.completed:
          message = 'no_completed_todos'.tr;
          icon = Icons.check_circle_outline;
          break;
        case TodoFilter.all:
        default:
          message = 'no_todos'.tr;
          icon = Icons.playlist_add;
      }
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
        title: Text('add_todo_title'.tr),
        content: TextField(
          controller: textController,
          autofocus: true,
          decoration: InputDecoration(
            hintText: 'input_hint'.tr,
            border: const OutlineInputBorder(),
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
            child: Text('cancel'.tr),
          ),
          ElevatedButton(
            onPressed: () {
              if (textController.text.trim().isNotEmpty) {
                controller.addTodo(textController.text);
                Get.back();
              }
            },
            child: Text('add'.tr),
          ),
        ],
      ),
    );
  }

  /// 顯示清除已完成項目確認對話框
  void _showClearCompletedDialog(TodoController controller) {
    Get.dialog(
      AlertDialog(
        title: Text('confirm_clear'.tr),
        content: Text(
          'confirm_clear_message'.trParams({
            'count': controller.completedCount.toString(),
          }),
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: Text('cancel'.tr),
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
            child: Text('delete'.tr),
          ),
        ],
      ),
    );
  }
}
