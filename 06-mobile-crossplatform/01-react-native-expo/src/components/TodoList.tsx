import React, { useCallback } from 'react';
import { View, FlatList, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { TodoListProps, Todo } from '../types';
import { todoListStyles } from '../styles';
import TodoItem from './TodoItem';

/**
 * TodoList Component
 *
 * Displays a virtualized list of todo items using FlatList for optimal performance.
 * Shows an empty state when no todos exist.
 * Uses KeyboardAvoidingView to handle keyboard appearance on iOS.
 *
 * Performance optimizations:
 * - FlatList virtualizes items for efficient rendering of large lists
 * - Memoized keyExtractor and renderItem callbacks
 * - removeClippedSubviews for better performance
 *
 * @component
 * @example
 * ```tsx
 * <TodoList
 *   todos={todos}
 *   onToggleTodo={handleToggle}
 *   onDeleteTodo={handleDelete}
 * />
 * ```
 */
const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
}) => {
  /**
   * Render empty state when no todos exist
   */
  const renderEmptyState = () => (
    <View style={todoListStyles.emptyContainer}>
      <Text style={todoListStyles.emptyText}>No todos yet!</Text>
      <Text style={todoListStyles.emptySubtext}>
        Add your first task to get started
      </Text>
    </View>
  );

  /**
   * Extract unique key for each todo item
   * Memoized to prevent recreation on every render
   */
  const keyExtractor = useCallback((item: Todo) => item.id, []);

  /**
   * Render individual todo item
   * Memoized to prevent recreation on every render
   */
  const renderItem = useCallback(
    ({ item }: { item: Todo }) => (
      <TodoItem
        todo={item}
        onToggle={() => onToggleTodo(item.id)}
        onDelete={() => onDeleteTodo(item.id)}
      />
    ),
    [onToggleTodo, onDeleteTodo]
  );

  return (
    <KeyboardAvoidingView
      style={todoListStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyState}
        style={todoListStyles.scrollView}
        contentContainerStyle={todoListStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={5}
      />
    </KeyboardAvoidingView>
  );
};

export default TodoList;
