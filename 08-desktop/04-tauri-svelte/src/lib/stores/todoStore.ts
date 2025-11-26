import { writable, derived } from 'svelte/store';
import type { Todo, FilterType, TodoStats } from '../types/Todo';
import { invoke } from '@tauri-apps/api/core';

// Store for todos
export const todos = writable<Todo[]>([]);

// Store for current filter
export const currentFilter = writable<FilterType>('all');

// Store for search query
export const searchQuery = writable<string>('');

// Derived store for filtered todos
export const filteredTodos = derived(
  [todos, currentFilter, searchQuery],
  ([$todos, $currentFilter, $searchQuery]) => {
    let filtered = $todos;

    // Apply filter
    if ($currentFilter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if ($currentFilter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Apply search
    if ($searchQuery.trim()) {
      const query = $searchQuery.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

// Derived store for todo statistics
export const todoStats = derived(todos, ($todos): TodoStats => ({
  total: $todos.length,
  active: $todos.filter(t => !t.completed).length,
  completed: $todos.filter(t => t.completed).length,
}));

// Actions
export const todoActions = {
  async loadTodos() {
    try {
      const loadedTodos = await invoke<Todo[]>('get_todos');
      todos.set(loadedTodos);
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  },

  async addTodo(text: string) {
    try {
      const newTodo = await invoke<Todo>('add_todo', { text });
      todos.update(t => [...t, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  },

  async updateTodo(id: string, text: string) {
    try {
      const updatedTodo = await invoke<Todo>('update_todo', { id, text });
      todos.update(t => t.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  },

  async toggleTodo(id: string) {
    try {
      const updatedTodo = await invoke<Todo>('toggle_todo', { id });
      todos.update(t => t.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  },

  async deleteTodo(id: string) {
    try {
      await invoke('delete_todo', { id });
      todos.update(t => t.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  },

  async clearCompleted() {
    try {
      await invoke('clear_completed');
      todos.update(t => t.filter(todo => !todo.completed));
    } catch (error) {
      console.error('Failed to clear completed:', error);
    }
  },

  setFilter(filter: FilterType) {
    currentFilter.set(filter);
  },

  setSearch(query: string) {
    searchQuery.set(query);
  },
};
