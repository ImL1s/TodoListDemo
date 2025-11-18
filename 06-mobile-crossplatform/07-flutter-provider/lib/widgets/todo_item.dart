import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/todo.dart';
import '../providers/todo_provider.dart';

/// TodoItem Widget
///
/// Displays a single todo item with interactive features.
/// Uses Provider to access TodoProvider for updates and deletions.
///
/// Provider Consumption:
/// - Uses context.read<T>() for callbacks (no rebuild needed)
/// - Widget rebuilds when parent passes new todo prop
class TodoItem extends StatelessWidget {
  final Todo todo;
  final Animation<double>? animation;

  const TodoItem({
    super.key,
    required this.todo,
    this.animation,
  });

  /// Handle todo toggle
  ///
  /// Uses context.read() instead of context.watch() because
  /// we only need to call the method, not listen to changes.
  void _handleToggle(BuildContext context) {
    context.read<TodoProvider>().toggleTodo(todo.id);
  }

  /// Handle todo deletion with confirmation
  void _handleDelete(BuildContext context) async {
    final provider = context.read<TodoProvider>();

    // Show confirmation dialog
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: const Text('Delete Todo'),
        content: Text('Are you sure you want to delete "${todo.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            style: FilledButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await provider.deleteTodo(todo.id);

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Todo deleted'),
            duration: const Duration(seconds: 2),
            behavior: SnackBarBehavior.floating,
            margin: const EdgeInsets.all(16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        );
      }
    }
  }

  /// Handle todo editing
  void _handleEdit(BuildContext context) {
    final controller = TextEditingController(text: todo.title);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: const Text('Edit Todo'),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Enter todo title',
            border: OutlineInputBorder(),
          ),
          textInputAction: TextInputAction.done,
          onSubmitted: (value) {
            if (value.trim().isNotEmpty) {
              context.read<TodoProvider>().updateTodo(todo.id, value);
              Navigator.pop(context);
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              final newTitle = controller.text.trim();
              if (newTitle.isNotEmpty) {
                context.read<TodoProvider>().updateTodo(todo.id, newTitle);
                Navigator.pop(context);
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    Widget card = Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Dismissible(
          key: Key(todo.id),
          direction: DismissDirection.endToStart,
          background: Container(
            alignment: Alignment.centerRight,
            padding: const EdgeInsets.only(right: 20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.red[300]!, Colors.red[600]!],
              ),
            ),
            child: const Icon(
              Icons.delete_outline,
              color: Colors.white,
              size: 28,
            ),
          ),
          confirmDismiss: (direction) async {
            return await showDialog<bool>(
              context: context,
              builder: (context) => AlertDialog(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                title: const Text('Delete Todo'),
                content: Text('Delete "${todo.title}"?'),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context, false),
                    child: const Text('Cancel'),
                  ),
                  FilledButton(
                    onPressed: () => Navigator.pop(context, true),
                    style: FilledButton.styleFrom(
                      backgroundColor: Colors.red,
                    ),
                    child: const Text('Delete'),
                  ),
                ],
              ),
            );
          },
          onDismissed: (_) {
            context.read<TodoProvider>().deleteTodo(todo.id);
          },
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () => _handleToggle(context),
              onLongPress: () => _handleEdit(context),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    // Checkbox
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: todo.completed
                              ? theme.primaryColor
                              : Colors.grey[300]!,
                          width: 2,
                        ),
                        color: todo.completed
                            ? theme.primaryColor
                            : Colors.transparent,
                      ),
                      child: todo.completed
                          ? const Icon(
                              Icons.check,
                              size: 18,
                              color: Colors.white,
                            )
                          : null,
                    ),

                    const SizedBox(width: 16),

                    // Todo Title
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            todo.title,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                              color: todo.completed
                                  ? Colors.grey[400]
                                  : Colors.grey[800],
                              decoration: todo.completed
                                  ? TextDecoration.lineThrough
                                  : null,
                              decorationColor: Colors.grey[400],
                              decorationThickness: 2,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _formatDate(todo.createdAt),
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[400],
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Action Buttons
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: Icon(
                            Icons.edit_outlined,
                            size: 20,
                            color: Colors.grey[400],
                          ),
                          onPressed: () => _handleEdit(context),
                          tooltip: 'Edit',
                        ),
                        IconButton(
                          icon: Icon(
                            Icons.delete_outline,
                            size: 20,
                            color: Colors.red[300],
                          ),
                          onPressed: () => _handleDelete(context),
                          tooltip: 'Delete',
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );

    // Add animation if provided
    if (animation != null) {
      return SizeTransition(
        sizeFactor: animation!,
        child: FadeTransition(
          opacity: animation!,
          child: card,
        ),
      );
    }

    return card;
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inDays == 0) {
      if (diff.inHours == 0) {
        if (diff.inMinutes == 0) {
          return 'Just now';
        }
        return '${diff.inMinutes}m ago';
      }
      return '${diff.inHours}h ago';
    } else if (diff.inDays == 1) {
      return 'Yesterday';
    } else if (diff.inDays < 7) {
      return '${diff.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}
