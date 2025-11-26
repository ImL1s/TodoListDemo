import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/todo.dart';
import '../providers/todo_provider.dart';
import 'todo_item.dart';
import 'edit_todo_dialog.dart';

class TodoList extends StatelessWidget {
  const TodoList({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<TodoProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        final todos = provider.todos;

        if (todos.isEmpty) {
          return _buildEmptyState(context, provider);
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: todos.length,
          itemBuilder: (context, index) {
            final todo = todos[index];
            return TodoItem(
              key: ValueKey(todo.id),
              todo: todo,
              onToggle: () => provider.toggleTodo(todo.id),
              onEdit: () => _showEditDialog(context, todo),
              onDelete: () => _confirmDelete(context, todo),
            );
          },
        );
      },
    );
  }

  Widget _buildEmptyState(BuildContext context, TodoProvider provider) {
    String message;
    IconData icon;

    switch (provider.currentFilter) {
      case TodoFilter.active:
        message = 'No active todos.\nAll done! 🎉';
        icon = Icons.check_circle_outline;
        break;
      case TodoFilter.completed:
        message = 'No completed todos yet.\nStart checking off your tasks!';
        icon = Icons.playlist_add_check;
        break;
      case TodoFilter.all:
      default:
        if (provider.searchQuery.isNotEmpty) {
          message = 'No todos match your search.\nTry different keywords.';
          icon = Icons.search_off;
        } else {
          message = 'No todos yet.\nCreate your first todo!';
          icon = Icons.add_task;
        }
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 80,
            color: Theme.of(context).colorScheme.primary.withOpacity(0.3),
          ),
          const SizedBox(height: 24),
          Text(
            message,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: Theme.of(context)
                      .colorScheme
                      .onSurface
                      .withOpacity(0.5),
                ),
          ),
        ],
      ),
    );
  }

  void _showEditDialog(BuildContext context, Todo todo) {
    showDialog(
      context: context,
      builder: (context) => EditTodoDialog(todo: todo),
    );
  }

  void _confirmDelete(BuildContext context, Todo todo) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Todo'),
        content: Text('Are you sure you want to delete "${todo.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              context.read<TodoProvider>().deleteTodo(todo.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Todo deleted')),
              );
            },
            style: FilledButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
