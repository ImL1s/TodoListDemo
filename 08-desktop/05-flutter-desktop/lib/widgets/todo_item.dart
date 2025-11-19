import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/todo.dart';

class TodoItem extends StatefulWidget {
  final Todo todo;
  final VoidCallback onToggle;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const TodoItem({
    super.key,
    required this.todo,
    required this.onToggle,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  State<TodoItem> createState() => _TodoItemState();
}

class _TodoItemState extends State<TodoItem> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: Card(
        elevation: _isHovered ? 4 : 1,
        margin: const EdgeInsets.only(bottom: 8),
        child: InkWell(
          onTap: widget.onEdit,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                // Checkbox
                Checkbox(
                  value: widget.todo.completed,
                  onChanged: (_) => widget.onToggle(),
                ),
                const SizedBox(width: 12),

                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title
                      Text(
                        widget.todo.title,
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              decoration: widget.todo.completed
                                  ? TextDecoration.lineThrough
                                  : null,
                              color: widget.todo.completed
                                  ? Theme.of(context)
                                      .colorScheme
                                      .onSurface
                                      .withOpacity(0.5)
                                  : null,
                            ),
                      ),

                      // Description (if exists)
                      if (widget.todo.description != null &&
                          widget.todo.description!.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          widget.todo.description!,
                          style:
                              Theme.of(context).textTheme.bodySmall?.copyWith(
                                    color: Theme.of(context)
                                        .colorScheme
                                        .onSurface
                                        .withOpacity(0.6),
                                  ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],

                      // Metadata
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 4,
                        children: [
                          // Priority
                          _buildPriorityChip(context),

                          // Category
                          if (widget.todo.category != null &&
                              widget.todo.category!.isNotEmpty)
                            _buildCategoryChip(context),

                          // Date
                          _buildDateChip(context),
                        ],
                      ),
                    ],
                  ),
                ),

                // Actions (shown on hover)
                if (_isHovered) ...[
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.edit, size: 20),
                    onPressed: widget.onEdit,
                    tooltip: 'Edit',
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete, size: 20),
                    onPressed: widget.onDelete,
                    tooltip: 'Delete',
                    color: Theme.of(context).colorScheme.error,
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPriorityChip(BuildContext context) {
    final Map<int, Map<String, dynamic>> priorityConfig = {
      0: {'label': 'Low', 'color': Colors.green},
      1: {'label': 'Medium', 'color': Colors.orange},
      2: {'label': 'High', 'color': Colors.red},
    };

    final config = priorityConfig[widget.todo.priority] ??
        priorityConfig[1]!;

    return Chip(
      label: Text(
        config['label'],
        style: const TextStyle(fontSize: 11),
      ),
      backgroundColor: (config['color'] as Color).withOpacity(0.1),
      side: BorderSide(
        color: (config['color'] as Color).withOpacity(0.3),
      ),
      padding: EdgeInsets.zero,
      visualDensity: VisualDensity.compact,
    );
  }

  Widget _buildCategoryChip(BuildContext context) {
    return Chip(
      avatar: const Icon(Icons.label_outline, size: 14),
      label: Text(
        widget.todo.category!,
        style: const TextStyle(fontSize: 11),
      ),
      backgroundColor:
          Theme.of(context).colorScheme.secondaryContainer,
      padding: EdgeInsets.zero,
      visualDensity: VisualDensity.compact,
    );
  }

  Widget _buildDateChip(BuildContext context) {
    final dateText = widget.todo.completed && widget.todo.completedAt != null
        ? 'Completed ${_formatDate(widget.todo.completedAt!)}'
        : 'Created ${_formatDate(widget.todo.createdAt)}';

    return Chip(
      avatar: Icon(
        widget.todo.completed ? Icons.check_circle : Icons.access_time,
        size: 14,
      ),
      label: Text(
        dateText,
        style: const TextStyle(fontSize: 11),
      ),
      backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
      padding: EdgeInsets.zero,
      visualDensity: VisualDensity.compact,
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return DateFormat('HH:mm').format(date);
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return DateFormat('MMM d').format(date);
    }
  }
}
