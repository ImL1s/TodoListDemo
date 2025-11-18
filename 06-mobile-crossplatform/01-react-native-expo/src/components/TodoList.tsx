import React from 'react';
import { View, ScrollView, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { TodoListProps } from '../types';
import { todoListStyles } from '../styles';
import TodoItem from './TodoItem';

/**
 * TodoList Component
 *
 * Displays a scrollable list of todo items. Shows an empty state when no todos exist.
 * Uses KeyboardAvoidingView to handle keyboard appearance on iOS.
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
   * Render the list of todos
   */
  const renderTodoList = () => (
    <ScrollView
      style={todoListStyles.scrollView}
      contentContainerStyle={todoListStyles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={todoListStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {todos.length === 0 ? renderEmptyState() : renderTodoList()}
    </KeyboardAvoidingView>
  );
};

export default TodoList;
