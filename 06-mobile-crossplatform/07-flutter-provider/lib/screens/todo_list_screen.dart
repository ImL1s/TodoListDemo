import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/todo_provider.dart';
import '../widgets/todo_list.dart';
import '../widgets/todo_input.dart';

/// TodoListScreen - Main Screen
///
/// The main screen that displays the todo list and input.
/// Uses Provider to access TodoProvider for actions like clear all.
///
/// This screen demonstrates:
/// - AppBar actions using context.read()
/// - Gradient background
/// - Stack layout with input overlay
class TodoListScreen extends StatelessWidget {
  const TodoListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      // Gradient Background
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              theme.primaryColor.withOpacity(0.8),
              theme.primaryColor,
              theme.colorScheme.secondary,
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              _buildHeader(context),

              // Content
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(30),
                    ),
                  ),
                  child: const TodoList(),
                ),
              ),
            ],
          ),
        ),
      ),

      // Floating Input
      bottomNavigationBar: const TodoInput(),
    );
  }

  /// Header with title and actions
  Widget _buildHeader(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title Row
          Row(
            children: [
              // Icon
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.check_circle_outline,
                  color: Colors.white,
                  size: 32,
                ),
              ),

              const SizedBox(width: 16),

              // Title
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'My Todos',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Flutter + Provider',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white70,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),

              // Actions Menu
              _buildActionsMenu(context),
            ],
          ),

          const SizedBox(height: 20),

          // Stats Summary and Undo/Redo using Selector for better performance
          Selector<TodoProvider, ({int active, int total, bool canUndo, bool canRedo})>(
            selector: (_, p) => (
              active: p.activeCount,
              total: p.totalCount,
              canUndo: p.canUndo,
              canRedo: p.canRedo,
            ),
            builder: (context, stats, _) {
              return Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.info_outline,
                          color: Colors.white,
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            '${stats.active} active of ${stats.total} todos',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        // Undo/Redo buttons
                        IconButton(
                          icon: const Icon(Icons.undo, color: Colors.white, size: 20),
                          onPressed: stats.canUndo
                              ? () => context.read<TodoProvider>().undo()
                              : null,
                          tooltip: 'Undo',
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          icon: const Icon(Icons.redo, color: Colors.white, size: 20),
                          onPressed: stats.canRedo
                              ? () => context.read<TodoProvider>().redo()
                              : null,
                          tooltip: 'Redo',
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }

  /// Actions Menu
  Widget _buildActionsMenu(BuildContext context) {
    return PopupMenuButton<String>(
      icon: const Icon(
        Icons.more_vert,
        color: Colors.white,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      onSelected: (value) => _handleMenuAction(context, value),
      itemBuilder: (context) => [
        const PopupMenuItem(
          value: 'toggle_all',
          child: Row(
            children: [
              Icon(Icons.done_all, size: 20),
              SizedBox(width: 12),
              Text('Toggle All'),
            ],
          ),
        ),
        const PopupMenuItem(
          value: 'clear_completed',
          child: Row(
            children: [
              Icon(Icons.clear_all, size: 20),
              SizedBox(width: 12),
              Text('Clear Completed'),
            ],
          ),
        ),
        const PopupMenuItem(
          value: 'clear_all',
          child: Row(
            children: [
              Icon(Icons.delete_sweep, size: 20, color: Colors.red),
              SizedBox(width: 12),
              Text('Clear All', style: TextStyle(color: Colors.red)),
            ],
          ),
        ),
        const PopupMenuDivider(),
        const PopupMenuItem(
          value: 'reload',
          child: Row(
            children: [
              Icon(Icons.refresh, size: 20),
              SizedBox(width: 12),
              Text('Reload'),
            ],
          ),
        ),
        const PopupMenuItem(
          value: 'about',
          child: Row(
            children: [
              Icon(Icons.info_outline, size: 20),
              SizedBox(width: 12),
              Text('About'),
            ],
          ),
        ),
      ],
    );
  }

  /// Handle menu actions using context.read()
  ///
  /// context.read<T>() - Use for one-time operations
  /// Does not listen to changes, just gets the provider instance
  void _handleMenuAction(BuildContext context, String action) async {
    final provider = context.read<TodoProvider>();

    switch (action) {
      case 'toggle_all':
        await provider.toggleAll();
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            _buildSnackBar('All todos toggled'),
          );
        }
        break;

      case 'clear_completed':
        final count = provider.completedCount;
        if (count == 0) {
          ScaffoldMessenger.of(context).showSnackBar(
            _buildSnackBar('No completed todos to clear'),
          );
          return;
        }

        final confirmed = await _showConfirmDialog(
          context,
          'Clear Completed',
          'Remove all $count completed todos?',
        );

        if (confirmed == true) {
          await provider.clearCompleted();
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              _buildSnackBar('$count completed todos cleared'),
            );
          }
        }
        break;

      case 'clear_all':
        final count = provider.totalCount;
        if (count == 0) {
          ScaffoldMessenger.of(context).showSnackBar(
            _buildSnackBar('No todos to clear'),
          );
          return;
        }

        final confirmed = await _showConfirmDialog(
          context,
          'Clear All',
          'Delete all $count todos? This cannot be undone.',
          isDestructive: true,
        );

        if (confirmed == true) {
          await provider.clearAll();
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              _buildSnackBar('All todos cleared'),
            );
          }
        }
        break;

      case 'reload':
        await provider.reload();
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            _buildSnackBar('Todos reloaded'),
          );
        }
        break;

      case 'about':
        _showAboutDialog(context);
        break;
    }
  }

  /// Show confirmation dialog
  Future<bool?> _showConfirmDialog(
    BuildContext context,
    String title,
    String message, {
    bool isDestructive = false,
  }) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            style: isDestructive
                ? FilledButton.styleFrom(backgroundColor: Colors.red)
                : null,
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }

  /// Show about dialog
  void _showAboutDialog(BuildContext context) {
    showAboutDialog(
      context: context,
      applicationName: 'Flutter Provider Todo',
      applicationVersion: '1.0.0',
      applicationIcon: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Theme.of(context).primaryColor,
              Theme.of(context).colorScheme.secondary,
            ],
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(
          Icons.check_circle,
          color: Colors.white,
          size: 32,
        ),
      ),
      children: [
        const SizedBox(height: 16),
        const Text(
          'A modern todo list application built with Flutter and Provider state management.',
        ),
        const SizedBox(height: 16),
        const Text(
          'Features:\n'
          '• Provider for state management\n'
          '• ChangeNotifier pattern\n'
          '• SharedPreferences for persistence\n'
          '• Material Design 3\n'
          '• Responsive UI',
          style: TextStyle(fontSize: 12),
        ),
      ],
    );
  }

  /// Build custom snackbar
  SnackBar _buildSnackBar(String message) {
    return SnackBar(
      content: Text(message),
      duration: const Duration(seconds: 2),
      behavior: SnackBarBehavior.floating,
      margin: const EdgeInsets.all(16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    );
  }
}
