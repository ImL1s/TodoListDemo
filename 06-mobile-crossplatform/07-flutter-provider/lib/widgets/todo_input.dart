import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/todo_provider.dart';

/// TodoInput Widget
///
/// Provides an input field for adding new todos.
/// Uses Provider to access TodoProvider and add todos.
///
/// Provider Consumption Pattern:
/// - Uses context.read<T>() for one-time operations (like adding a todo)
/// - No need to rebuild this widget when todo list changes
class TodoInput extends StatefulWidget {
  const TodoInput({super.key});

  @override
  State<TodoInput> createState() => _TodoInputState();
}

class _TodoInputState extends State<TodoInput> {
  final TextEditingController _controller = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// Handle form submission
  ///
  /// Uses context.read<TodoProvider>() to access provider without rebuilding.
  /// This is more efficient than context.watch() for one-time operations.
  Future<void> _handleSubmit() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _isSubmitting) return;

    setState(() => _isSubmitting = true);

    try {
      // context.read<T>() - Get provider without listening to changes
      // Use for one-time operations, callbacks, and event handlers
      await context.read<TodoProvider>().addTodo(text);
      _controller.clear();

      // Optional: Show feedback
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Todo added successfully'),
            duration: const Duration(seconds: 1),
            behavior: SnackBarBehavior.floating,
            margin: const EdgeInsets.all(16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(
          top: Radius.circular(30),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            // Input Field
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Colors.grey[300]!,
                    width: 1,
                  ),
                ),
                child: TextField(
                  controller: _controller,
                  enabled: !_isSubmitting,
                  decoration: InputDecoration(
                    hintText: 'Add a new todo...',
                    hintStyle: TextStyle(
                      color: Colors.grey[400],
                      fontSize: 16,
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 16,
                    ),
                    prefixIcon: Icon(
                      Icons.edit_outlined,
                      color: Colors.grey[400],
                      size: 22,
                    ),
                  ),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                  textInputAction: TextInputAction.done,
                  onSubmitted: (_) => _handleSubmit(),
                ),
              ),
            ),

            const SizedBox(width: 12),

            // Add Button
            Material(
              color: theme.primaryColor,
              borderRadius: BorderRadius.circular(16),
              elevation: 2,
              child: InkWell(
                onTap: _isSubmitting ? null : _handleSubmit,
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  width: 56,
                  height: 56,
                  alignment: Alignment.center,
                  child: _isSubmitting
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Colors.white,
                            ),
                          ),
                        )
                      : const Icon(
                          Icons.add_rounded,
                          color: Colors.white,
                          size: 28,
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
