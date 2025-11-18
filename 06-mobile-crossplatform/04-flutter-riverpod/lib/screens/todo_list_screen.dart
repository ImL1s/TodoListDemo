import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/todo_provider.dart';
import '../widgets/todo_item.dart';

/// TodoListScreen
///
/// Main screen for the Todo List app.
/// Uses ConsumerWidget to access Riverpod providers.
/// Demonstrates reactive UI updates when state changes.

class TodoListScreen extends ConsumerWidget {
  TodoListScreen({super.key});

  final TextEditingController _textController = TextEditingController();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch providers - UI rebuilds when these change
    final filteredTodos = ref.watch(filteredTodosProvider);
    final uncompletedCount = ref.watch(uncompletedTodosCountProvider);
    final completedCount = ref.watch(completedTodosCountProvider);
    final currentFilter = ref.watch(todoFilterProvider);
    final allCompleted = ref.watch(allTodosCompletedProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Todo List - Riverpod'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 2,
        actions: [
          if (completedCount > 0)
            IconButton(
              icon: const Icon(Icons.clear_all),
              onPressed: () => _showClearCompletedDialog(context, ref),
              tooltip: 'Clear completed',
            ),
          IconButton(
            icon: Icon(
              allCompleted ? Icons.check_box : Icons.check_box_outline_blank,
            ),
            onPressed: () {
              ref.read(todoListProvider.notifier).toggleAll();
            },
            tooltip: 'Toggle all',
          ),
        ],
      ),
      body: Column(
        children: [
          // Add Todo Input
          _buildAddTodoSection(ref),

          // Stats Bar
          _buildStatsBar(uncompletedCount, completedCount),

          // Filter Buttons
          _buildFilterButtons(ref, currentFilter),

          // Todo List
          Expanded(
            child: filteredTodos.isEmpty
                ? _buildEmptyState(currentFilter)
                : _buildTodoList(filteredTodos),
          ),
        ],
      ),
    );
  }

  Widget _buildAddTodoSection(WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _textController,
              decoration: const InputDecoration(
                hintText: 'What needs to be done?',
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                prefixIcon: Icon(Icons.add_task),
              ),
              onSubmitted: (value) {
                _addTodo(ref, value);
              },
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: () {
              _addTodo(ref, _textController.text);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(
                horizontal: 24,
                vertical: 16,
              ),
            ),
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _addTodo(WidgetRef ref, String title) {
    if (title.trim().isNotEmpty) {
      ref.read(todoListProvider.notifier).addTodo(title);
      _textController.clear();
    }
  }

  Widget _buildStatsBar(int uncompletedCount, int completedCount) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      color: Colors.grey[100],
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.pending_actions, size: 18, color: Colors.orange[700]),
              const SizedBox(width: 8),
              Text(
                '$uncompletedCount active',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[700],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          Row(
            children: [
              Icon(Icons.check_circle, size: 18, color: Colors.green[700]),
              const SizedBox(width: 8),
              Text(
                '$completedCount completed',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[700],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterButtons(WidgetRef ref, TodoFilter currentFilter) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _buildFilterChip(
            ref,
            'All',
            TodoFilter.all,
            currentFilter,
            Icons.list,
          ),
          const SizedBox(width: 8),
          _buildFilterChip(
            ref,
            'Active',
            TodoFilter.active,
            currentFilter,
            Icons.pending_actions,
          ),
          const SizedBox(width: 8),
          _buildFilterChip(
            ref,
            'Completed',
            TodoFilter.completed,
            currentFilter,
            Icons.check_circle,
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(
    WidgetRef ref,
    String label,
    TodoFilter filter,
    TodoFilter currentFilter,
    IconData icon,
  ) {
    final isSelected = filter == currentFilter;
    return FilterChip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16),
          const SizedBox(width: 4),
          Text(label),
        ],
      ),
      selected: isSelected,
      onSelected: (_) {
        ref.read(todoFilterProvider.notifier).state = filter;
      },
      selectedColor: Colors.blue[100],
      checkmarkColor: Colors.blue[700],
    );
  }

  Widget _buildTodoList(List todos) {
    return ListView.builder(
      itemCount: todos.length,
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemBuilder: (context, index) {
        return TodoItem(todo: todos[index]);
      },
    );
  }

  Widget _buildEmptyState(TodoFilter currentFilter) {
    String message;
    IconData icon;

    switch (currentFilter) {
      case TodoFilter.active:
        message = 'No active todos!\nTime to add some tasks.';
        icon = Icons.inbox;
        break;
      case TodoFilter.completed:
        message = 'No completed todos yet.\nStart checking off tasks!';
        icon = Icons.check_circle_outline;
        break;
      case TodoFilter.all:
      default:
        message = 'No todos yet!\nAdd your first task above.';
        icon = Icons.add_task;
        break;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 80,
            color: Colors.grey[300],
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  void _showClearCompletedDialog(BuildContext context, WidgetRef ref) {
    final completedCount = ref.read(completedTodosCountProvider);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Completed'),
        content: Text(
          'Are you sure you want to clear $completedCount completed todo${completedCount > 1 ? 's' : ''}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(todoListProvider.notifier).clearCompleted();
              Navigator.pop(context);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }
}
