import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

import '../providers/todo_provider.dart';
import '../models/todo.dart';

class StatisticsPanel extends StatelessWidget {
  const StatisticsPanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.3),
        border: Border(
          left: BorderSide(
            color: Theme.of(context).dividerColor,
            width: 1,
          ),
        ),
      ),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Statistics',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 24),

          // Overview Cards
          _buildOverviewCard(context),
          const SizedBox(height: 16),

          // Progress
          _buildProgressSection(context),
          const SizedBox(height: 24),

          // Priority Breakdown
          _buildPriorityBreakdown(context),
          const SizedBox(height: 24),

          // Recent Activity
          _buildRecentActivity(context),
        ],
      ),
    );
  }

  Widget _buildOverviewCard(BuildContext context) {
    return Consumer<TodoProvider>(
      builder: (context, provider, child) {
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildStatRow(
                  context,
                  'Total',
                  provider.totalCount.toString(),
                  Icons.inbox,
                  Colors.blue,
                ),
                const Divider(height: 16),
                _buildStatRow(
                  context,
                  'Active',
                  provider.activeCount.toString(),
                  Icons.radio_button_unchecked,
                  Colors.orange,
                ),
                const Divider(height: 16),
                _buildStatRow(
                  context,
                  'Completed',
                  provider.completedCount.toString(),
                  Icons.check_circle,
                  Colors.green,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatRow(
    BuildContext context,
    String label,
    String value,
    IconData icon,
    Color color,
  ) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ),
        Text(
          value,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: color,
              ),
        ),
      ],
    );
  }

  Widget _buildProgressSection(BuildContext context) {
    return Consumer<TodoProvider>(
      builder: (context, provider, child) {
        final total = provider.totalCount;
        final completed = provider.completedCount;
        final progress = total > 0 ? completed / total : 0.0;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Progress',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              borderRadius: BorderRadius.circular(4),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${(progress * 100).toStringAsFixed(0)}% Complete',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                Text(
                  '$completed / $total',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  Widget _buildPriorityBreakdown(BuildContext context) {
    return Consumer<TodoProvider>(
      builder: (context, provider, child) {
        final priorities = {
          2: {'label': 'High', 'color': Colors.red},
          1: {'label': 'Medium', 'color': Colors.orange},
          0: {'label': 'Low', 'color': Colors.green},
        };

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'By Priority',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            ...priorities.entries.map((entry) {
              final count = provider.allTodos
                  .where((todo) => todo.priority == entry.key && !todo.completed)
                  .length;
              final config = entry.value;

              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: config['color'] as Color,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        config['label'] as String,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ),
                    Text(
                      count.toString(),
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ],
                ),
              );
            }),
          ],
        );
      },
    );
  }

  Widget _buildRecentActivity(BuildContext context) {
    return Consumer<TodoProvider>(
      builder: (context, provider, child) {
        final recentCompleted = provider.allTodos
            .where((todo) => todo.completed && todo.completedAt != null)
            .toList()
          ..sort((a, b) => b.completedAt!.compareTo(a.completedAt!));

        final recent = recentCompleted.take(5).toList();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recently Completed',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 12),
            if (recent.isEmpty)
              Text(
                'No completed todos yet',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context)
                          .colorScheme
                          .onSurface
                          .withOpacity(0.5),
                    ),
              )
            else
              ...recent.map((todo) => _buildActivityItem(context, todo)),
          ],
        );
      },
    );
  }

  Widget _buildActivityItem(BuildContext context, Todo todo) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.check_circle,
            size: 16,
            color: Theme.of(context).colorScheme.primary,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  todo.title,
                  style: Theme.of(context).textTheme.bodySmall,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  _formatDate(todo.completedAt!),
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: Theme.of(context)
                            .colorScheme
                            .onSurface
                            .withOpacity(0.6),
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inHours < 1) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inDays < 1) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return DateFormat('MMM d').format(date);
    }
  }
}
