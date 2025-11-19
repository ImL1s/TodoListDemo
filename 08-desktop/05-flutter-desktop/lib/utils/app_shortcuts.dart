import 'dart:io' show Platform;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../providers/todo_provider.dart';
import '../models/todo.dart';

/// Widget that provides keyboard shortcuts for the entire app
class AppShortcuts extends StatelessWidget {
  final Widget child;

  const AppShortcuts({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Shortcuts(
      shortcuts: <LogicalKeySet, Intent>{
        // New Todo: Ctrl/Cmd + N
        LogicalKeySet(
          Platform.isMacOS ? LogicalKeyboardKey.meta : LogicalKeyboardKey.control,
          LogicalKeyboardKey.keyN,
        ): const NewTodoIntent(),

        // Search: Ctrl/Cmd + F
        LogicalKeySet(
          Platform.isMacOS ? LogicalKeyboardKey.meta : LogicalKeyboardKey.control,
          LogicalKeyboardKey.keyF,
        ): const SearchIntent(),

        // Toggle Filter to All: Ctrl/Cmd + 1
        LogicalKeySet(
          Platform.isMacOS ? LogicalKeyboardKey.meta : LogicalKeyboardKey.control,
          LogicalKeyboardKey.digit1,
        ): const FilterIntent(TodoFilter.all),

        // Toggle Filter to Active: Ctrl/Cmd + 2
        LogicalKeySet(
          Platform.isMacOS ? LogicalKeyboardKey.meta : LogicalKeyboardKey.control,
          LogicalKeyboardKey.digit2,
        ): const FilterIntent(TodoFilter.active),

        // Toggle Filter to Completed: Ctrl/Cmd + 3
        LogicalKeySet(
          Platform.isMacOS ? LogicalKeyboardKey.meta : LogicalKeyboardKey.control,
          LogicalKeyboardKey.digit3,
        ): const FilterIntent(TodoFilter.completed),

        // Clear Completed: Ctrl/Cmd + Shift + C
        LogicalKeySet(
          Platform.isMacOS ? LogicalKeyboardKey.meta : LogicalKeyboardKey.control,
          LogicalKeyboardKey.shift,
          LogicalKeyboardKey.keyC,
        ): const ClearCompletedIntent(),

        // Refresh: F5 or Ctrl/Cmd + R
        LogicalKeySet(LogicalKeyboardKey.f5): const RefreshIntent(),
        LogicalKeySet(
          Platform.isMacOS ? LogicalKeyboardKey.meta : LogicalKeyboardKey.control,
          LogicalKeyboardKey.keyR,
        ): const RefreshIntent(),
      },
      child: Actions(
        actions: <Type, Action<Intent>>{
          NewTodoIntent: NewTodoAction(),
          SearchIntent: SearchAction(),
          FilterIntent: FilterAction(),
          ClearCompletedIntent: ClearCompletedAction(),
          RefreshIntent: RefreshAction(),
        },
        child: child,
      ),
    );
  }
}

// Intents
class NewTodoIntent extends Intent {
  const NewTodoIntent();
}

class SearchIntent extends Intent {
  const SearchIntent();
}

class FilterIntent extends Intent {
  final TodoFilter filter;
  const FilterIntent(this.filter);
}

class ClearCompletedIntent extends Intent {
  const ClearCompletedIntent();
}

class RefreshIntent extends Intent {
  const RefreshIntent();
}

// Actions
class NewTodoAction extends Action<NewTodoIntent> {
  @override
  Object? invoke(NewTodoIntent intent) {
    // This will be handled by the HomeScreen context
    return null;
  }
}

class SearchAction extends Action<SearchIntent> {
  @override
  Object? invoke(SearchIntent intent) {
    // This will be handled by the HomeScreen context
    return null;
  }
}

class FilterAction extends Action<FilterIntent> {
  @override
  Object? invoke(FilterIntent intent) {
    // This will be handled by the HomeScreen context
    return null;
  }
}

class ClearCompletedAction extends Action<ClearCompletedIntent> {
  @override
  Object? invoke(ClearCompletedIntent intent) {
    // This will be handled by the HomeScreen context
    return null;
  }
}

class RefreshAction extends Action<RefreshIntent> {
  @override
  Object? invoke(RefreshIntent intent) {
    // This will be handled by the HomeScreen context
    return null;
  }
}

/// Mixin to help screens handle shortcuts
mixin ShortcutHandlerMixin<T extends StatefulWidget> on State<T> {
  void handleNewTodo();
  void handleSearch();
  void handleFilter(TodoFilter filter);
  void handleClearCompleted();
  void handleRefresh();

  @override
  Widget build(BuildContext context) {
    return Actions(
      actions: <Type, Action<Intent>>{
        NewTodoIntent: CallbackAction<NewTodoIntent>(
          onInvoke: (_) => handleNewTodo(),
        ),
        SearchIntent: CallbackAction<SearchIntent>(
          onInvoke: (_) => handleSearch(),
        ),
        FilterIntent: CallbackAction<FilterIntent>(
          onInvoke: (intent) => handleFilter(intent.filter),
        ),
        ClearCompletedIntent: CallbackAction<ClearCompletedIntent>(
          onInvoke: (_) => handleClearCompleted(),
        ),
        RefreshIntent: CallbackAction<RefreshIntent>(
          onInvoke: (_) => handleRefresh(),
        ),
      },
      child: buildContent(context),
    );
  }

  Widget buildContent(BuildContext context);
}
