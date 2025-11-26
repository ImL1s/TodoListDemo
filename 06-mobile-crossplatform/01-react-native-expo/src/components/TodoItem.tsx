import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { TodoItemProps } from '../types';
import { todoItemStyles } from '../styles';

/**
 * TodoItem Component
 *
 * Displays a single todo item with checkbox, text, timestamp, and delete button.
 * Provides visual feedback for touch interactions.
 *
 * Performance optimizations:
 * - Wrapped with React.memo to prevent unnecessary re-renders
 * - Only re-renders when todo, onToggle, or onDelete props change
 *
 * @component
 * @example
 * ```tsx
 * <TodoItem
 *   todo={todo}
 *   onToggle={() => handleToggle(todo.id)}
 *   onDelete={() => handleDelete(todo.id)}
 * />
 * ```
 */
const TodoItem: React.FC<TodoItemProps> = React.memo(({ todo, onToggle, onDelete }) => {
  /**
   * Format timestamp to readable date string
   */
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={todoItemStyles.container}>
      {/* Checkbox */}
      <Pressable
        style={todoItemStyles.checkboxContainer}
        onPress={onToggle}
        android_ripple={{ color: 'rgba(102, 126, 234, 0.3)', borderless: true }}
      >
        <View
          style={[
            todoItemStyles.checkbox,
            todo.completed && todoItemStyles.checkboxChecked,
          ]}
        >
          {todo.completed && (
            <Text style={todoItemStyles.checkboxText}>✓</Text>
          )}
        </View>
      </Pressable>

      {/* Text Content */}
      <Pressable
        style={todoItemStyles.textContainer}
        onPress={onToggle}
      >
        <Text
          style={[
            todoItemStyles.text,
            todo.completed && todoItemStyles.textCompleted,
          ]}
          numberOfLines={2}
        >
          {todo.text}
        </Text>
        <Text style={todoItemStyles.timestamp}>
          {formatDate(todo.createdAt)}
        </Text>
      </Pressable>

      {/* Delete Button */}
      <TouchableOpacity
        style={todoItemStyles.deleteButton}
        onPress={onDelete}
        activeOpacity={0.7}
        accessibilityLabel="Delete todo"
        accessibilityRole="button"
      >
        <Text style={todoItemStyles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
});

// Display name for debugging
TodoItem.displayName = 'TodoItem';

export default TodoItem;
