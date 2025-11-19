import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/todo.dart';
import '../providers/todo_provider.dart';
import '../widgets/todo_list.dart';
import '../widgets/add_todo_dialog.dart';
import '../widgets/filter_sidebar.dart';
import '../widgets/statistics_panel.dart';
import '../widgets/search_bar.dart' as custom;
import '../utils/app_shortcuts.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with ShortcutHandlerMixin {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  @override
  void handleNewTodo() {
    _showAddTodoDialog();
  }

  @override
  void handleSearch() {
    _searchFocusNode.requestFocus();
  }

  @override
  void handleFilter(TodoFilter filter) {
    context.read<TodoProvider>().setFilter(filter);
  }

  @override
  void handleClearCompleted() {
    _clearCompleted();
  }

  @override
  void handleRefresh() {
    context.read<TodoProvider>().loadTodos();
  }

  void _showAddTodoDialog() {
    showDialog(
      context: context,
      builder: (context) => const AddTodoDialog(),
    );
  }

  void _clearCompleted() {
    final provider = context.read<TodoProvider>();
    if (provider.completedCount == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No completed todos to clear')),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Completed'),
        content: Text(
          'Are you sure you want to delete ${provider.completedCount} completed todo(s)?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              provider.clearCompleted();
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Completed todos cleared')),
              );
            },
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }

  @override
  Widget buildContent(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final bool isWideScreen = constraints.maxWidth > 1200;
        final bool isMediumScreen = constraints.maxWidth > 800;

        return Scaffold(
          body: Row(
            children: [
              // Sidebar Navigation (only on wide screens)
              if (isMediumScreen)
                SizedBox(
                  width: 280,
                  child: FilterSidebar(
                    onNewTodo: _showAddTodoDialog,
                    onClearCompleted: _clearCompleted,
                  ),
                ),

              // Main Content
              Expanded(
                child: Column(
                  children: [
                    // App Bar
                    _buildAppBar(context, isMediumScreen),

                    // Search Bar
                    custom.SearchBar(
                      controller: _searchController,
                      focusNode: _searchFocusNode,
                      onChanged: (query) {
                        context.read<TodoProvider>().setSearchQuery(query);
                      },
                    ),

                    // Content
                    Expanded(
                      child: Row(
                        children: [
                          // Todo List
                          Expanded(
                            flex: isWideScreen ? 2 : 1,
                            child: const TodoList(),
                          ),

                          // Statistics Panel (only on wide screens)
                          if (isWideScreen)
                            const SizedBox(
                              width: 320,
                              child: StatisticsPanel(),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Floating Action Button for narrow screens
          floatingActionButton: isMediumScreen
              ? null
              : FloatingActionButton.extended(
                  onPressed: _showAddTodoDialog,
                  icon: const Icon(Icons.add),
                  label: const Text('New Todo'),
                ),
        );
      },
    );
  }

  Widget _buildAppBar(BuildContext context, bool showMenuButton) {
    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          bottom: BorderSide(
            color: Theme.of(context).dividerColor,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          if (!showMenuButton)
            IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () {
                // Show drawer or bottom sheet for filters
                _showFilterBottomSheet(context);
              },
            ),
          const SizedBox(width: 8),
          Icon(
            Icons.check_circle_outline,
            size: 28,
            color: Theme.of(context).colorScheme.primary,
          ),
          const SizedBox(width: 12),
          Text(
            'Flutter Desktop Todo',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const Spacer(),
          _buildQuickStats(context),
          const SizedBox(width: 16),
          _buildSortMenu(context),
        ],
      ),
    );
  }

  Widget _buildQuickStats(BuildContext context) {
    return Consumer<TodoProvider>(
      builder: (context, provider, child) {
        return Row(
          children: [
            _buildStatChip(
              context,
              '${provider.activeCount}',
              'Active',
              Colors.blue,
            ),
            const SizedBox(width: 8),
            _buildStatChip(
              context,
              '${provider.completedCount}',
              'Completed',
              Colors.green,
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatChip(
    BuildContext context,
    String count,
    String label,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Text(
            count,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: color.withOpacity(0.8),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSortMenu(BuildContext context) {
    return Consumer<TodoProvider>(
      builder: (context, provider, child) {
        return PopupMenuButton<TodoSort>(
          icon: const Icon(Icons.sort),
          tooltip: 'Sort by',
          onSelected: (sort) {
            provider.setSort(sort);
          },
          itemBuilder: (context) => TodoSort.values
              .map(
                (sort) => PopupMenuItem(
                  value: sort,
                  child: Row(
                    children: [
                      if (provider.currentSort == sort)
                        const Icon(Icons.check, size: 18)
                      else
                        const SizedBox(width: 18),
                      const SizedBox(width: 8),
                      Text(sort.label),
                    ],
                  ),
                ),
              )
              .toList(),
        );
      },
    );
  }

  void _showFilterBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.add),
              title: const Text('New Todo'),
              onTap: () {
                Navigator.pop(context);
                _showAddTodoDialog();
              },
            ),
            const Divider(),
            ...TodoFilter.values.map(
              (filter) => Consumer<TodoProvider>(
                builder: (context, provider, child) {
                  return RadioListTile<TodoFilter>(
                    title: Text(filter.label),
                    value: filter,
                    groupValue: provider.currentFilter,
                    onChanged: (value) {
                      if (value != null) {
                        provider.setFilter(value);
                        Navigator.pop(context);
                      }
                    },
                  );
                },
              ),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.delete_sweep),
              title: const Text('Clear Completed'),
              onTap: () {
                Navigator.pop(context);
                _clearCompleted();
              },
            ),
          ],
        ),
      ),
    );
  }
}
