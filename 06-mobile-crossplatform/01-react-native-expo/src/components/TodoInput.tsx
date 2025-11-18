import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  Platform,
} from 'react-native';
import { TodoInputProps } from '../types';
import { todoInputStyles, colors } from '../styles';

/**
 * TodoInput Component
 *
 * Provides a text input and add button for creating new todos.
 * Handles keyboard interactions and input validation.
 *
 * Features:
 * - Auto-dismisses keyboard after adding todo
 * - Disables add button when input is empty
 * - Clears input after successful add
 * - Platform-specific keyboard handling
 *
 * @component
 * @example
 * ```tsx
 * <TodoInput onAddTodo={handleAddTodo} />
 * ```
 */
const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');

  /**
   * Handle add button press
   * Validates input, adds todo, clears input, and dismisses keyboard
   */
  const handleAdd = () => {
    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      return;
    }

    onAddTodo(trimmedText);
    setText('');
    Keyboard.dismiss();
  };

  /**
   * Handle text input submission (when user presses return/enter)
   */
  const handleSubmit = () => {
    handleAdd();
  };

  const isButtonDisabled = text.trim().length === 0;

  return (
    <View style={todoInputStyles.container}>
      <View style={todoInputStyles.inputContainer}>
        <TextInput
          style={todoInputStyles.input}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textLight}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          blurOnSubmit={false}
          autoCorrect={false}
          autoCapitalize="sentences"
          maxLength={200}
        />
        <TouchableOpacity
          style={[
            todoInputStyles.addButton,
            isButtonDisabled && todoInputStyles.addButtonDisabled,
          ]}
          onPress={handleAdd}
          disabled={isButtonDisabled}
          activeOpacity={0.7}
          accessibilityLabel="Add todo"
          accessibilityRole="button"
          accessibilityState={{ disabled: isButtonDisabled }}
        >
          <Text style={todoInputStyles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoInput;
