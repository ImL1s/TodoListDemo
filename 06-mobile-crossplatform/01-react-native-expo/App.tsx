import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, StorageKeys } from './src/types';
import { appStyles, colors } from './src/styles';
import TodoInput from './src/components/TodoInput';
import TodoList from './src/components/TodoList';

/**
 * Main Application Component
 *
 * A beautiful, cross-platform Todo List application built with React Native and Expo.
 *
 * Features:
 * - Create, toggle, and delete todos
 * - Persistent storage using AsyncStorage
 * - Beautiful gradient UI
 * - Smooth animations and transitions
 * - iOS and Android optimized
 * - TypeScript for type safety
 * - Keyboard handling
 *
 * @component
 */
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load todos from AsyncStorage on mount
   */
  useEffect(() => {
    loadTodos();
  }, []);

  /**
   * Save todos to AsyncStorage whenever they change
   */
  useEffect(() => {
    if (!isLoading) {
      saveTodos();
    }
  }, [todos, isLoading]);

  /**
   * Load todos from AsyncStorage
   */
  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(StorageKeys.TODOS);
      if (storedTodos !== null) {
        const parsedTodos = JSON.parse(storedTodos);
        setTodos(parsedTodos);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save todos to AsyncStorage
   */
  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem(StorageKeys.TODOS, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  /**
   * Add a new todo
   */
  const handleAddTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  }, []);

  /**
   * Toggle todo completion status
   */
  const handleToggleTodo = useCallback((id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  /**
   * Delete a todo
   */
  const handleDeleteTodo = useCallback((id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  /**
   * Calculate statistics
   */
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  /**
   * Dismiss keyboard when tapping outside
   */
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={appStyles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
          translucent={Platform.OS === 'android'}
        />

        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={appStyles.gradient}
        >
          <SafeAreaView style={appStyles.safeArea}>
            {/* Header */}
            <View style={appStyles.header}>
              <Text style={appStyles.title}>Todo List</Text>
              <Text style={appStyles.subtitle}>
                Organize your tasks efficiently
              </Text>
              <View style={appStyles.badge}>
                <Text style={appStyles.badgeText}>React Native + Expo</Text>
              </View>
            </View>

            {/* Statistics */}
            {totalTodos > 0 && (
              <View style={appStyles.statsContainer}>
                <View style={appStyles.statItem}>
                  <Text style={appStyles.statValue}>{totalTodos}</Text>
                  <Text style={appStyles.statLabel}>Total</Text>
                </View>
                <View style={appStyles.statItem}>
                  <Text style={appStyles.statValue}>{activeTodos}</Text>
                  <Text style={appStyles.statLabel}>Active</Text>
                </View>
                <View style={appStyles.statItem}>
                  <Text style={appStyles.statValue}>{completedTodos}</Text>
                  <Text style={appStyles.statLabel}>Done</Text>
                </View>
              </View>
            )}

            {/* Content Area */}
            <View style={appStyles.content}>
              {/* Todo Input */}
              <TodoInput onAddTodo={handleAddTodo} />

              {/* Todo List */}
              <TodoList
                todos={todos}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
              />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
}
