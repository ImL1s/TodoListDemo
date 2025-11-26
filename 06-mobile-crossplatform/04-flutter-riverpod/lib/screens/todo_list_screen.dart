import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/todo_provider.dart';
import '../widgets/todo_item.dart';
import '../models/todo.dart';

/// TodoListScreen
///
/// Main screen for the Todo List app.
/// Uses ConsumerStatefulWidget to handle local state (TextField)
/// Demonstrates:
/// - AsyncValue handling (loading, error, data states)
/// - Provider composition with multiple providers
/// - Optimized rebuilds with select
/// - Search and sort functionality

class TodoListScreen extends ConsumerStatefulWidget {
  const TodoListScreen({super.key});

  @override
  ConsumerState<TodoListScreen> createState() => _TodoListScreenState();
}

class _TodoListScreenState extends ConsumerState<TodoListScreen> {
  final TextEditingController _textController = TextEditingController();
  final TextEditingController _searchController = TextEditingController();
  TodoPriority _selectedPriority = TodoPriority.medium;

  @override
  void dispose() {
    _textController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Watch providers - UI rebuilds when these change
    final uncompletedCount = ref.watch(uncompletedTodosCountProvider);
    final completedCount = ref.watch(completedTodosCountProvider);
    final currentFilter = ref.watch(todoFilterProvider);
    final currentSort = ref.watch(todoSortProvider);
    final allCompleted = ref.watch(allTodosCompletedProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Todo List - Riverpod'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        elevation: 2,
        actions: [
          // Sort menu
          PopupMenuButton<TodoSort>(
            icon: const Icon(Icons.sort),
            tooltip: 'Sort',
            onSelected: (sort) {
              ref.read(todoSortProvider.notifier).state = sort;
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: TodoSort.createdDate,
                child: Row(
                  children: [
                    Icon(
                      Icons.access_time,
                      color: currentSort == TodoSort.createdDate
                          ? Colors.blue
                          : Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    const Text('Created Date'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: TodoSort.title,
                child: Row(
                  children: [
                    Icon(
                      Icons.sort_by_alpha,
                      color: currentSort == TodoSort.title
                          ? Colors.blue
                          : Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    const Text('Title'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: TodoSort.priority,
                child: Row(
                  children: [
                    Icon(
                      Icons.priority_high,
                      color: currentSort == TodoSort.priority
                          ? Colors.blue
                          : Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    const Text('Priority'),
                  ],
                ),
              ),
            ],
          ),
          if (completedCount > 0)
            IconButton(
              icon: const Icon(Icons.clear_all),
              onPressed: () => _showClearCompletedDialog(context),
              tooltip: 'Clear completed',
            ),
          IconButton(
            icon: Icon(
              allCompleted ? Icons.check_box : Icons.check_box_outline_blank,
            ),
            onPressed: () {
              ref.read(todoListProvider.notifier).toggleAll();
            },
            tooltip: 'Toggle all',
          ),
          // More menu
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'clear_all') {
                _showClearAllDialog(context);
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'clear_all',
                child: Row(
                  children: [
                    Icon(Icons.delete_forever, color: Colors.red),
                    SizedBox(width: 8),
                    Text('Clear All Todos'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Add Todo Input
          _buildAddTodoSection(),

          // Search Bar
          _buildSearchBar(),

          // Stats Bar
          _buildStatsBar(uncompletedCount, completedCount),

          // Filter Buttons
          _buildFilterButtons(currentFilter),

          // Todo List
          Expanded(
            child: _buildTodoList(),
          ),
        ],
      ),
    );
  }

  Widget _buildAddTodoSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _textController,
                  decoration: const InputDecoration(
                    hintText: 'What needs to be done?',
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    prefixIcon: Icon(Icons.add_task),
                  ),
                  onSubmitted: (value) {
                    _addTodo();
                  },
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: _addTodo,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 16,
                  ),
                ),
                child: const Text('Add'),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // Priority selector
          Row(
            children: [
              const Text('Priority: '),
              const SizedBox(width: 8),
              Expanded(
                child: SegmentedButton<TodoPriority>(
                  segments: const [
                    ButtonSegment(
                      value: TodoPriority.low,
                      label: Text('Low'),
                      icon: Icon(Icons.arrow_downward, size: 16),
                    ),
                    ButtonSegment(
                      value: TodoPriority.medium,
                      label: Text('Med'),
                      icon: Icon(Icons.remove, size: 16),
                    ),
                    ButtonSegment(
                      value: TodoPriority.high,
                      label: Text('High'),
                      icon: Icon(Icons.arrow_upward, size: 16),
                    ),
                    ButtonSegment(
                      value: TodoPriority.urgent,
                      label: Text('Urgent'),
                      icon: Icon(Icons.priority_high, size: 16),
                    ),
                  ],
                  selected: {_selectedPriority},
                  onSelectionChanged: (Set<TodoPriority> selection) {
                    setState(() {
                      _selectedPriority = selection.first;
                    });
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Search todos...',
          prefixIcon: const Icon(Icons.search),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    ref.read(searchQueryProvider.notifier).state = '';
                  },
                )
              : null,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 8,
          ),
        ),
        onChanged: (value) {
          ref.read(searchQueryProvider.notifier).state = value;
        },
      ),
    );
  }

  void _addTodo() {
    if (_textController.text.trim().isNotEmpty) {
      ref.read(todoListProvider.notifier).addTodo(
            _textController.text,
            priority: _selectedPriority,
          );
      _textController.clear();
      _selectedPriority = TodoPriority.medium;
      setState(() {}); // Reset priority UI
    }
  }

  Widget _buildStatsBar(int uncompletedCount, int completedCount) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      color: Colors.grey[100],
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.pending_actions, size: 18, color: Colors.orange[700]),
              const SizedBox(width: 8),
              Text(
                '$uncompletedCount active',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[700],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          Row(
            children: [
              Icon(Icons.check_circle, size: 18, color: Colors.green[700]),
              const SizedBox(width: 8),
              Text(
                '$completedCount completed',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[700],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterButtons(TodoFilter currentFilter) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _buildFilterChip('All', TodoFilter.all, currentFilter, Icons.list),
          const SizedBox(width: 8),
          _buildFilterChip(
            'Active',
            TodoFilter.active,
            currentFilter,
            Icons.pending_actions,
          ),
          const SizedBox(width: 8),
          _buildFilterChip(
            'Completed',
            TodoFilter.completed,
            currentFilter,
            Icons.check_circle,
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(
    String label,
    TodoFilter filter,
    TodoFilter currentFilter,
    IconData icon,
  ) {
    final isSelected = filter == currentFilter;
    return FilterChip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16),
          const SizedBox(width: 4),
          Text(label),
        ],
      ),
      selected: isSelected,
      onSelected: (_) {
        ref.read(todoFilterProvider.notifier).state = filter;
      },
      selectedColor: Colors.blue[100],
      checkmarkColor: Colors.blue[700],
    );
  }

  /// Build todo list with AsyncValue handling
  ///
  /// This demonstrates proper AsyncValue handling:
  /// - Shows loading spinner while loading
  /// - Shows error message on error
  /// - Shows data when available
  /// - Shows empty state when no todos
  Widget _buildTodoList() {
    final asyncFilteredTodos = ref.watch(filteredTodosProvider);

    return asyncFilteredTodos.when(
      // Loading state
      loading: () => const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Loading todos...'),
          ],
        ),
      ),
      // Error state
      error: (error, stack) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 60, color: Colors.red[300]),
            const SizedBox(height: 16),
            Text(
              'Error loading todos',
              style: TextStyle(fontSize: 18, color: Colors.red[700]),
            ),
            const SizedBox(height: 8),
            Text(
              error.toString(),
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey[600]),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                // Invalidate the provider to retry
                ref.invalidate(todoListProvider);
              },
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
      // Data state
      data: (todos) {
        if (todos.isEmpty) {
          return _buildEmptyState();
        }

        return ListView.builder(
          itemCount: todos.length,
          padding: const EdgeInsets.symmetric(vertical: 8),
          itemBuilder: (context, index) {
            return TodoItem(todo: todos[index]);
          },
        );
      },
    );
  }

  Widget _buildEmptyState() {
    final currentFilter = ref.watch(todoFilterProvider);
    final searchQuery = ref.watch(searchQueryProvider);

    String message;
    IconData icon;

    if (searchQuery.isNotEmpty) {
      message = 'No todos found matching "$searchQuery"';
      icon = Icons.search_off;
    } else {
      switch (currentFilter) {
        case TodoFilter.active:
          message = 'No active todos!\nTime to add some tasks.';
          icon = Icons.inbox;
          break;
        case TodoFilter.completed:
          message = 'No completed todos yet.\nStart checking off tasks!';
          icon = Icons.check_circle_outline;
          break;
        case TodoFilter.all:
        default:
          message = 'No todos yet!\nAdd your first task above.';
          icon = Icons.add_task;
          break;
      }
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 80, color: Colors.grey[300]),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  void _showClearCompletedDialog(BuildContext context) {
    final completedCount = ref.read(completedTodosCountProvider);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Completed'),
        content: Text(
          'Are you sure you want to clear $completedCount completed todo${completedCount > 1 ? 's' : ''}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(todoListProvider.notifier).clearCompleted();
              Navigator.pop(context);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }

  void _showClearAllDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear All Todos'),
        content: const Text(
          'Are you sure you want to delete ALL todos? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(todoListProvider.notifier).clearAll();
              Navigator.pop(context);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete All'),
          ),
        ],
      ),
    );
  }
}
