import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Todo, FilterType, TodoStats, UseTodosReturn } from '../types';
import { STORAGE_KEY } from '../types';

/**
 * Custom hook for managing todos with localStorage persistence
 *
 * Features:
 * - CRUD operations for todos
 * - Filtering (all, active, completed)
 * - Statistics calculation
 * - LocalStorage persistence
 * - Optimized with useMemo and useCallback
 */
export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isClient, setIsClient] = useState(false);

  // Handle client-side mounting (Gatsby SSG compatibility)
  useEffect(() => {
    setIsClient(true);

    // Load todos from localStorage on client side only
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTodos(parsed);
        } catch (error) {
          console.error('Failed to parse stored todos:', error);
        }
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isClient]);

  // Add a new todo
  const addTodo = useCallback((text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTodo: Todo = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: trimmedText,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos(prev => [newTodo, ...prev]);
  }, []);

  // Toggle todo completion status
  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // Delete a todo
  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  // Edit todo text
  const editTodo = useCallback((id: string, newText: string) => {
    const trimmedText = newText.trim();
    if (!trimmedText) {
      deleteTodo(id);
      return;
    }

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: trimmedText } : todo
      )
    );
  }, [deleteTodo]);

  // Clear all completed todos
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  // Filter todos based on current filter
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  // Calculate statistics
  const stats = useMemo<TodoStats>(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;

    return { total, active, completed };
  }, [todos]);

  return {
    todos,
    filteredTodos,
    filter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
  };
};
