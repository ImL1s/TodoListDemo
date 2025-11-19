import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/todo_provider.dart';
import '../models/todo.dart';
import 'todo_item.dart';

/// TodoList Widget
///
/// Displays the list of todos with search, filter, and sort functionality.
/// Uses Selector for optimal performance.
///
/// Provider Consumption Pattern:
/// - Selector<T, R>: Rebuilds only when selected value changes (more granular)
/// - Consumer<T>: Rebuilds only this widget when provider changes
/// - context.read<T>(): One-time operations without rebuilding
class TodoList extends StatefulWidget {
  const TodoList({super.key});

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  // Filter states: 'all', 'active', 'completed'
  String _filter = 'all';
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Search Bar
        _buildSearchBar(),

        // Filter and Sort Row
        _buildFilterAndSort(),

        // Todo List with Selector for better performance
        Expanded(
          child: Selector<TodoProvider, ({bool isLoading, List<Todo> todos, String? error})>(
            selector: (_, provider) => (
              isLoading: provider.isLoading,
              todos: _getFilteredTodos(provider),
              error: provider.error,
            ),
            builder: (context, data, child) {
              // Error State
              if (data.error != null) {
                return _buildErrorState(data.error!);
              }

              // Loading State
              if (data.isLoading) {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              }

              // Empty State
              if (data.todos.isEmpty) {
                return _buildEmptyState();
              }

              // Todo List
              return ListView.builder(
                padding: const EdgeInsets.only(
                  top: 12,
                  bottom: 100, // Space for input
                ),
                itemCount: data.todos.length,
                itemBuilder: (context, index) {
                  final todo = data.todos[index];
                  return TodoItem(
                    key: ValueKey(todo.id),
                    todo: todo,
                  );
                },
              );
            },
          ),
        ),

        // Stats Bar - Using Selector for granular rebuilds
        _buildStatsBar(),
      ],
    );
  }

  /// Search Bar
  Widget _buildSearchBar() {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 12, 20, 8),
      padding: const EdgeInsets.symmetric(horizontal: 16),
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
      child: Row(
        children: [
          const Icon(Icons.search, color: Colors.grey, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: TextField(
              controller: _searchController,
              decoration: const InputDecoration(
                hintText: 'Search todos...',
                border: InputBorder.none,
                hintStyle: TextStyle(color: Colors.grey, fontSize: 14),
              ),
              onChanged: (query) {
                context.read<TodoProvider>().setSearchQuery(query);
              },
            ),
          ),
          if (_searchController.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear, size: 20),
              onPressed: () {
                _searchController.clear();
                context.read<TodoProvider>().clearSearch();
              },
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
            ),
        ],
      ),
    );
  }

  /// Filter and Sort Row
  Widget _buildFilterAndSort() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Row(
        children: [
          // Filter Tabs
          Expanded(child: _buildFilterTabs()),
          const SizedBox(width: 12),
          // Sort Button
          _buildSortButton(),
        ],
      ),
    );
  }

  /// Filter Tabs
  Widget _buildFilterTabs() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          _buildFilterTab('All', 'all'),
          _buildFilterTab('Active', 'active'),
          _buildFilterTab('Done', 'completed'),
        ],
      ),
    );
  }

  /// Sort Button
  Widget _buildSortButton() {
    return Selector<TodoProvider, TodoSortOption>(
      selector: (_, provider) => provider.sortOption,
      builder: (context, sortOption, _) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: PopupMenuButton<TodoSortOption>(
            icon: const Icon(Icons.sort, size: 20),
            tooltip: 'Sort',
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            onSelected: (option) {
              context.read<TodoProvider>().setSortOption(option);
            },
            itemBuilder: (context) => TodoSortOption.values.map((option) {
              return PopupMenuItem(
                value: option,
                child: Row(
                  children: [
                    if (option == sortOption)
                      const Icon(Icons.check, size: 18, color: Colors.blue)
                    else
                      const SizedBox(width: 18),
                    const SizedBox(width: 12),
                    Text(
                      option.label,
                      style: TextStyle(
                        color: option == sortOption ? Colors.blue : null,
                        fontWeight:
                            option == sortOption ? FontWeight.w600 : null,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        );
      },
    );
  }

  Widget _buildFilterTab(String label, String value) {
    final isSelected = _filter == value;
    final theme = Theme.of(context);

    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _filter = value),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? theme.primaryColor : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isSelected ? Colors.white : Colors.grey[600],
            ),
          ),
        ),
      ),
    );
  }

  /// Get filtered todos based on current filter
  List<Todo> _getFilteredTodos(TodoProvider provider) {
    switch (_filter) {
      case 'active':
        return provider.activeTodos;
      case 'completed':
        return provider.completedTodos;
      default:
        return provider.todos;
    }
  }

  /// Error State
  Widget _buildErrorState(String error) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red[300],
            ),
            const SizedBox(height: 16),
            Text(
              'Oops! Something went wrong',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.grey[800],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              error,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                context.read<TodoProvider>().clearError();
                context.read<TodoProvider>().reload();
              },
              icon: const Icon(Icons.refresh),
              label: const Text('Try Again'),
            ),
          ],
        ),
      ),
    );
  }

  /// Empty State
  Widget _buildEmptyState() {
    final provider = context.read<TodoProvider>();
    final hasSearch = provider.searchQuery.isNotEmpty;

    if (hasSearch) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off,
              size: 80,
              color: Colors.grey[300],
            ),
            const SizedBox(height: 16),
            Text(
              'No results found',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[400],
                height: 1.5,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try a different search term',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[400],
              ),
            ),
          ],
        ),
      );
    }

    String message;
    IconData icon;

    switch (_filter) {
      case 'active':
        message = 'No active todos!\nAll tasks completed';
        icon = Icons.check_circle_outline;
        break;
      case 'completed':
        message = 'No completed todos yet.\nStart completing tasks!';
        icon = Icons.assignment_turned_in_outlined;
        break;
      default:
        message = 'No todos yet.\nAdd one to get started!';
        icon = Icons.inbox_outlined;
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
              color: Colors.grey[400],
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  /// Stats Bar with Selector
  ///
  /// Selector is more efficient than Consumer when you only need
  /// specific values from the provider. It only rebuilds when
  /// the selected value changes.
  Widget _buildStatsBar() {
    return Selector<TodoProvider, ({int total, int active, int completed})>(
      // Selector extracts only needed values
      selector: (_, provider) => (
        total: provider.totalCount,
        active: provider.activeCount,
        completed: provider.completedCount,
      ),
      // Only rebuilds when these values change
      builder: (context, stats, child) {
        if (stats.total == 0) return const SizedBox.shrink();

        return Container(
          margin: const EdgeInsets.fromLTRB(20, 0, 20, 12),
          padding: const EdgeInsets.all(16),
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
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStatItem(
                'Total',
                stats.total,
                Icons.format_list_bulleted,
                Colors.blue,
              ),
              _buildStatItem(
                'Active',
                stats.active,
                Icons.radio_button_unchecked,
                Colors.orange,
              ),
              _buildStatItem(
                'Done',
                stats.completed,
                Icons.check_circle,
                Colors.green,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatItem(String label, int value, IconData icon, Color color) {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 18, color: color),
            const SizedBox(width: 6),
            Text(
              '$value',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800],
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }
}
