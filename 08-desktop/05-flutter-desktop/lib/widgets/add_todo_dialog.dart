import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/todo_provider.dart';

class AddTodoDialog extends StatefulWidget {
  const AddTodoDialog({super.key});

  @override
  State<AddTodoDialog> createState() => _AddTodoDialogState();
}

class _AddTodoDialogState extends State<AddTodoDialog> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _categoryController = TextEditingController();
  int _priority = 1;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _categoryController.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      context.read<TodoProvider>().addTodo(
            title: _titleController.text.trim(),
            description: _descriptionController.text.trim().isEmpty
                ? null
                : _descriptionController.text.trim(),
            category: _categoryController.text.trim().isEmpty
                ? null
                : _categoryController.text.trim(),
            priority: _priority,
          );

      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Todo added successfully')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        width: 600,
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Title
              Text(
                'Add New Todo',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 24),

              // Title Field
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Title *',
                  hintText: 'What needs to be done?',
                  prefixIcon: Icon(Icons.title),
                ),
                autofocus: true,
                textInputAction: TextInputAction.next,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a title';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Description Field
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  hintText: 'Add more details (optional)',
                  prefixIcon: Icon(Icons.description),
                  alignLabelWithHint: true,
                ),
                maxLines: 3,
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 16),

              // Category Field
              Consumer<TodoProvider>(
                builder: (context, provider, child) {
                  final categories = provider.categories;

                  return Autocomplete<String>(
                    optionsBuilder: (textEditingValue) {
                      if (textEditingValue.text.isEmpty) {
                        return categories;
                      }
                      return categories.where((category) {
                        return category
                            .toLowerCase()
                            .contains(textEditingValue.text.toLowerCase());
                      });
                    },
                    onSelected: (value) {
                      _categoryController.text = value;
                    },
                    fieldViewBuilder: (context, controller, focusNode, onFieldSubmitted) {
                      _categoryController.text = controller.text;
                      return TextFormField(
                        controller: controller,
                        focusNode: focusNode,
                        decoration: const InputDecoration(
                          labelText: 'Category',
                          hintText: 'Work, Personal, etc. (optional)',
                          prefixIcon: Icon(Icons.label),
                        ),
                        textInputAction: TextInputAction.done,
                      );
                    },
                  );
                },
              ),
              const SizedBox(height: 16),

              // Priority Selector
              Text(
                'Priority',
                style: Theme.of(context).textTheme.titleSmall,
              ),
              const SizedBox(height: 8),
              SegmentedButton<int>(
                segments: const [
                  ButtonSegment(
                    value: 0,
                    label: Text('Low'),
                    icon: Icon(Icons.arrow_downward),
                  ),
                  ButtonSegment(
                    value: 1,
                    label: Text('Medium'),
                    icon: Icon(Icons.remove),
                  ),
                  ButtonSegment(
                    value: 2,
                    label: Text('High'),
                    icon: Icon(Icons.arrow_upward),
                  ),
                ],
                selected: {_priority},
                onSelectionChanged: (Set<int> selection) {
                  setState(() {
                    _priority = selection.first;
                  });
                },
              ),
              const SizedBox(height: 24),

              // Actions
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancel'),
                  ),
                  const SizedBox(width: 8),
                  FilledButton(
                    onPressed: _submit,
                    child: const Text('Add Todo'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
