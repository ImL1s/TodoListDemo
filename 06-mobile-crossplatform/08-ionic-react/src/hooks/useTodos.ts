import { useState, useEffect, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

const STORAGE_KEY = 'ionic-react-todos';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  addTodo: (text: string, priority?: Todo['priority'], category?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  clearCompleted: () => void;
  reorderTodos: (from: number, to: number) => void;
  loadTodos: () => Promise<void>;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载数据
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) {
        const loadedTodos = JSON.parse(value);
        setTodos(loadedTodos);
      }
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  // 保存数据
  const saveTodos = useCallback(async (todosToSave: Todo[]) => {
    try {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(todosToSave),
      });
    } catch (err) {
      console.error('Error saving todos:', err);
      setError('Failed to save todos');
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // 自动保存
  useEffect(() => {
    if (!loading) {
      saveTodos(todos);
    }
  }, [todos, loading, saveTodos]);

  // 添加 Todo
  const addTodo = useCallback((
    text: string,
    priority: Todo['priority'] = 'medium',
    category?: string
  ) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
      category,
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, []);

  // 切换完成状态
  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // 删除 Todo
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  // 更新 Todo
  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  }, []);

  // 清除已完成
  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  // 重新排序
  const reorderTodos = useCallback((from: number, to: number) => {
    setTodos((prev) => {
      const newTodos = [...prev];
      const [movedItem] = newTodos.splice(from, 1);
      newTodos.splice(to, 0, movedItem);
      return newTodos;
    });
  }, []);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    reorderTodos,
    loadTodos,
  };
};
