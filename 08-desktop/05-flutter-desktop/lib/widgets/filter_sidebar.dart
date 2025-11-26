import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/todo.dart';
import '../providers/todo_provider.dart';

class FilterSidebar extends StatelessWidget {
  final VoidCallback onNewTodo;
  final VoidCallback onClearCompleted;

  const FilterSidebar({
    super.key,
    required this.onNewTodo,
    required this.onClearCompleted,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.3),
        border: Border(
          right: BorderSide(
            color: Theme.of(context).dividerColor,
            width: 1,
          ),
        ),
      ),
      child: Column(
        children: [
          // Header
          Container(
            height: 64,
            padding: const EdgeInsets.all(16),
            child: FilledButton.icon(
              onPressed: onNewTodo,
              icon: const Icon(Icons.add),
              label: const Text('New Todo'),
              style: FilledButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
              ),
            ),
          ),

          // Filters
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(8),
              children: [
                _buildFilterSection(context),
                const Divider(height: 32),
                _buildCategorySection(context),
                const Divider(height: 32),
                _buildActionsSection(context),
              ],
            ),
          ),

          // Keyboard Shortcuts Help
          _buildShortcutsHelp(context),
        ],
      ),
    );
  }

  Widget _buildFilterSection(BuildContext context) {
    return Consumer<TodoProvider>(
      builder: (context, provider, child) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: Text(
                'FILTER',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Theme.of(context)
                          .colorScheme
                          .onSurface
                          .withOpacity(0.6),
                    ),
              ),
            ),
            const SizedBox(height: 4),
            ...TodoFilter.values.map((filter) {
              final isSelected = provider.currentFilter == filter;
              int count;

              switch (filter) {
                case TodoFilter.all:
                  count = provider.totalCount;
                  break;
                case TodoFilter.active:
                  count = provider.activeCount;
                  break;
                case TodoFilter.completed:
                  count = provider.completedCount;
                  break;
              }

              return _buildFilterTile(
                context,
                filter.label,
                _getFilterIcon(filter),
                count,
                isSelected,
                () => provider.setFilter(filter),
              );
            }),
          ],
        );
      },
    );
  }

  Widget _buildCategorySection(BuildContext context) {
    return Consumer<TodoProvider>(
      builder: (context, provider, child) {
        final categories = provider.categories;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      'CATEGORIES',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: Theme.of(context)
                                .colorScheme
                                .onSurface
                                .withOpacity(0.6),
                          ),
                    ),
                  ),
                  if (provider.selectedCategory != null)
                    TextButton(
                      onPressed: () => provider.setCategory(null),
                      style: TextButton.styleFrom(
                        minimumSize: const Size(0, 24),
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                      ),
                      child: const Text('Clear', style: TextStyle(fontSize: 11)),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 4),
            if (categories.isEmpty)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(
                  'No categories yet',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context)
                            .colorScheme
                            .onSurface
                            .withOpacity(0.5),
                      ),
                ),
              )
            else
              ...categories.map((category) {
                final isSelected = provider.selectedCategory == category;
                final count = provider.allTodos
                    .where((todo) => todo.category == category)
                    .length;

                return _buildFilterTile(
                  context,
                  category,
                  Icons.label,
                  count,
                  isSelected,
                  () => provider.setCategory(category),
                );
              }),
          ],
        );
      },
    );
  }

  Widget _buildActionsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: Text(
            'ACTIONS',
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: Theme.of(context)
                      .colorScheme
                      .onSurface
                      .withOpacity(0.6),
                ),
          ),
        ),
        const SizedBox(height: 4),
        ListTile(
          leading: const Icon(Icons.delete_sweep),
          title: const Text('Clear Completed'),
          onTap: onClearCompleted,
          dense: true,
        ),
        Consumer<TodoProvider>(
          builder: (context, provider, child) {
            return ListTile(
              leading: const Icon(Icons.refresh),
              title: const Text('Refresh'),
              onTap: () => provider.loadTodos(),
              dense: true,
            );
          },
        ),
      ],
    );
  }

  Widget _buildFilterTile(
    BuildContext context,
    String label,
    IconData icon,
    int count,
    bool isSelected,
    VoidCallback onTap,
  ) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(
          color: isSelected
              ? Theme.of(context).colorScheme.primary
              : Theme.of(context).colorScheme.surfaceVariant,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          count.toString(),
          style: TextStyle(
            color: isSelected
                ? Theme.of(context).colorScheme.onPrimary
                : Theme.of(context).colorScheme.onSurfaceVariant,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      selected: isSelected,
      onTap: onTap,
      dense: true,
    );
  }

  IconData _getFilterIcon(TodoFilter filter) {
    switch (filter) {
      case TodoFilter.all:
        return Icons.inbox;
      case TodoFilter.active:
        return Icons.radio_button_unchecked;
      case TodoFilter.completed:
        return Icons.check_circle;
    }
  }

  Widget _buildShortcutsHelp(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.5),
        border: Border(
          top: BorderSide(
            color: Theme.of(context).dividerColor,
            width: 1,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Keyboard Shortcuts',
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          _buildShortcutRow(context, 'Ctrl+N', 'New Todo'),
          _buildShortcutRow(context, 'Ctrl+F', 'Search'),
          _buildShortcutRow(context, 'Ctrl+1/2/3', 'Filter'),
          _buildShortcutRow(context, 'F5', 'Refresh'),
        ],
      ),
    );
  }

  Widget _buildShortcutRow(BuildContext context, String keys, String action) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              border: Border.all(
                color: Theme.of(context).dividerColor,
              ),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              keys,
              style: const TextStyle(
                fontSize: 10,
                fontFamily: 'monospace',
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              action,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
        ],
      ),
    );
  }
}
