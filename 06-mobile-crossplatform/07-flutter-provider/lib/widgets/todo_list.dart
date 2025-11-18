import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/todo_provider.dart';
import '../models/todo.dart';
import 'todo_item.dart';

/// TodoList Widget
///
/// Displays the list of todos with different filter views.
/// Uses Consumer<TodoProvider> to rebuild only when todos change.
///
/// Provider Consumption Pattern:
/// - Consumer<T>: Rebuilds only this widget when provider changes
/// - Selector<T, R>: Rebuilds only when selected value changes (more granular)
/// - context.watch<T>(): Alternative to Consumer for simpler cases
class TodoList extends StatefulWidget {
  const TodoList({super.key});

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  // Filter states: 'all', 'active', 'completed'
  String _filter = 'all';

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Filter Tabs
        _buildFilterTabs(),

        // Todo List with Consumer
        Expanded(
          child: Consumer<TodoProvider>(
            // Consumer rebuilds only this widget when TodoProvider changes
            // builder: (context, provider, child)
            // - context: BuildContext
            // - provider: The TodoProvider instance
            // - child: Optional static child (not rebuilt)
            builder: (context, todoProvider, child) {
              // Get filtered todos based on current filter
              final todos = _getFilteredTodos(todoProvider);

              // Loading State
              if (todoProvider.isLoading) {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              }

              // Empty State
              if (todos.isEmpty) {
                return _buildEmptyState();
              }

              // Todo List
              return ListView.builder(
                padding: const EdgeInsets.only(
                  top: 12,
                  bottom: 100, // Space for input
                ),
                itemCount: todos.length,
                itemBuilder: (context, index) {
                  final todo = todos[index];
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

  /// Filter Tabs
  Widget _buildFilterTabs() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      padding: const EdgeInsets.all(4),
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
          _buildFilterTab('All', 'all'),
          _buildFilterTab('Active', 'active'),
          _buildFilterTab('Completed', 'completed'),
        ],
      ),
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

  /// Empty State
  Widget _buildEmptyState() {
    String message;
    IconData icon;

    switch (_filter) {
      case 'active':
        message = 'No active todos!\nAll tasks completed 🎉';
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
