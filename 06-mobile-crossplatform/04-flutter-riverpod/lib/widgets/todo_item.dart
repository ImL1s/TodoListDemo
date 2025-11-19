import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/todo.dart';
import '../providers/todo_provider.dart';

/// TodoItem Widget
///
/// A Consumer widget that displays a single todo item.
/// Uses ConsumerStatefulWidget for local editing state.
/// Demonstrates:
/// - ref.read() for triggering actions
/// - Priority display with color coding
/// - Edit mode with priority selector

class TodoItem extends ConsumerStatefulWidget {
  final Todo todo;

  const TodoItem({
    super.key,
    required this.todo,
  });

  @override
  ConsumerState<TodoItem> createState() => _TodoItemState();
}

class _TodoItemState extends ConsumerState<TodoItem> {
  bool _isEditing = false;
  late TextEditingController _textController;
  late FocusNode _focusNode;
  late TodoPriority _editingPriority;

  @override
  void initState() {
    super.initState();
    _textController = TextEditingController(text: widget.todo.title);
    _focusNode = FocusNode();
    _editingPriority = widget.todo.priority;
  }

  @override
  void dispose() {
    _textController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      elevation: 1,
      child: _isEditing ? _buildEditingView() : _buildNormalView(),
    );
  }

  Widget _buildNormalView() {
    return ListTile(
      leading: Checkbox(
        value: widget.todo.completed,
        onChanged: (_) {
          ref.read(todoListProvider.notifier).toggleTodo(widget.todo.id);
        },
        activeColor: Colors.green,
      ),
      title: Row(
        children: [
          _buildPriorityBadge(widget.todo.priority),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              widget.todo.title,
              style: TextStyle(
                decoration:
                    widget.todo.completed ? TextDecoration.lineThrough : null,
                color: widget.todo.completed ? Colors.grey : Colors.black87,
                fontSize: 16,
              ),
            ),
          ),
        ],
      ),
      subtitle: Text(
        _formatDate(widget.todo.createdAt),
        style: TextStyle(
          fontSize: 12,
          color: Colors.grey[600],
        ),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: const Icon(Icons.edit, size: 20),
            onPressed: _startEditing,
            color: Colors.blue,
            tooltip: 'Edit',
          ),
          IconButton(
            icon: const Icon(Icons.delete, size: 20),
            onPressed: () {
              _showDeleteConfirmation(context);
            },
            color: Colors.red,
            tooltip: 'Delete',
          ),
        ],
      ),
    );
  }

  Widget _buildPriorityBadge(TodoPriority priority) {
    Color color;
    IconData icon;

    switch (priority) {
      case TodoPriority.urgent:
        color = Colors.red;
        icon = Icons.priority_high;
        break;
      case TodoPriority.high:
        color = Colors.orange;
        icon = Icons.arrow_upward;
        break;
      case TodoPriority.medium:
        color = Colors.blue;
        icon = Icons.remove;
        break;
      case TodoPriority.low:
        color = Colors.green;
        icon = Icons.arrow_downward;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            priority.displayName,
            style: TextStyle(
              fontSize: 12,
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEditingView() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _textController,
                  focusNode: _focusNode,
                  decoration: const InputDecoration(
                    hintText: 'Edit todo...',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  onSubmitted: (_) => _finishEditing(),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.check, color: Colors.green),
                onPressed: _finishEditing,
                tooltip: 'Save',
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.red),
                onPressed: _cancelEditing,
                tooltip: 'Cancel',
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Priority:',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: TodoPriority.values.map((priority) {
              final isSelected = _editingPriority == priority;
              return ChoiceChip(
                label: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _getPriorityIcon(priority),
                      size: 16,
                      color: isSelected ? Colors.white : _getPriorityColor(priority),
                    ),
                    const SizedBox(width: 4),
                    Text(priority.displayName),
                  ],
                ),
                selected: isSelected,
                onSelected: (_) {
                  setState(() {
                    _editingPriority = priority;
                  });
                },
                selectedColor: _getPriorityColor(priority),
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : Colors.black87,
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  void _startEditing() {
    setState(() {
      _isEditing = true;
      _editingPriority = widget.todo.priority;
    });
    _focusNode.requestFocus();
  }

  void _finishEditing() {
    if (_textController.text.trim().isNotEmpty) {
      ref.read(todoListProvider.notifier).editTodo(
            widget.todo.id,
            title: _textController.text,
            priority: _editingPriority,
          );
    }
    setState(() {
      _isEditing = false;
    });
  }

  void _cancelEditing() {
    _textController.text = widget.todo.title;
    setState(() {
      _isEditing = false;
      _editingPriority = widget.todo.priority;
    });
  }

  void _showDeleteConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Todo'),
        content: Text('Are you sure you want to delete "${widget.todo.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(todoListProvider.notifier).removeTodo(widget.todo.id);
              Navigator.pop(context);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        if (difference.inMinutes == 0) {
          return 'Just now';
        }
        return '${difference.inMinutes} min ago';
      }
      return '${difference.inHours} hour${difference.inHours > 1 ? 's' : ''} ago';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }

  Color _getPriorityColor(TodoPriority priority) {
    switch (priority) {
      case TodoPriority.urgent:
        return Colors.red;
      case TodoPriority.high:
        return Colors.orange;
      case TodoPriority.medium:
        return Colors.blue;
      case TodoPriority.low:
        return Colors.green;
    }
  }

  IconData _getPriorityIcon(TodoPriority priority) {
    switch (priority) {
      case TodoPriority.urgent:
        return Icons.priority_high;
      case TodoPriority.high:
        return Icons.arrow_upward;
      case TodoPriority.medium:
        return Icons.remove;
      case TodoPriority.low:
        return Icons.arrow_downward;
    }
  }
}
