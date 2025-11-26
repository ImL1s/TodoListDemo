import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Todo, FilterType, TodoContextType } from '../types';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const STORAGE_KEY = 'radix-ui-todos';

/**
 * Load todos from localStorage
 */
const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
  }
  return [];
};

/**
 * Save todos to localStorage
 */
const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

interface TodoProviderProps {
  children: ReactNode;
}

/**
 * TodoProvider component that manages all todo state and operations
 * Demonstrates React Context API pattern with Radix UI
 */
export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<FilterType>('all');

  // Persist todos to localStorage whenever they change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  /**
   * Add a new todo item
   */
  const addTodo = (text: string): void => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  /**
   * Toggle todo completion status
   */
  const toggleTodo = (id: string): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /**
   * Delete a todo item
   */
  const deleteTodo = (id: string): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  /**
   * Edit todo text
   */
  const editTodo = (id: string, text: string): void => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: text.trim() } : todo
      )
    );
  };

  /**
   * Clear all completed todos
   */
  const clearCompleted = (): void => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const value: TodoContextType = {
    todos,
    filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

/**
 * Custom hook to access todo context
 * Throws error if used outside TodoProvider
 */
export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
};
