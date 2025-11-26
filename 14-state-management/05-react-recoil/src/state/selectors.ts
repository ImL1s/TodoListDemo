import { selector, selectorFamily } from 'recoil';
import { Todo, TodoStats } from '../types';
import {
  todosState,
  filterState,
  sortTypeState,
  sortDirectionState,
  searchQueryState,
} from './atoms';

/**
 * Selector for filtered todos based on the current filter
 */
export const filteredTodosState = selector<Todo[]>({
  key: 'filteredTodosState',
  get: ({ get }) => {
    const todos = get(todosState);
    const filter = get(filterState);

    switch (filter) {
      case 'completed':
        return todos.filter((todo) => todo.completed);
      case 'active':
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  },
});

/**
 * Selector for filtered and searched todos
 */
export const searchedTodosState = selector<Todo[]>({
  key: 'searchedTodosState',
  get: ({ get }) => {
    const filteredTodos = get(filteredTodosState);
    const searchQuery = get(searchQueryState);

    if (!searchQuery.trim()) {
      return filteredTodos;
    }

    const query = searchQuery.toLowerCase();
    return filteredTodos.filter((todo) =>
      todo.text.toLowerCase().includes(query) ||
      (todo.category && todo.category.toLowerCase().includes(query))
    );
  },
});

/**
 * Selector for sorted and filtered todos
 * This is the main selector that combines filtering, searching, and sorting
 */
export const sortedTodosState = selector<Todo[]>({
  key: 'sortedTodosState',
  get: ({ get }) => {
    const searchedTodos = get(searchedTodosState);
    const sortType = get(sortTypeState);
    const sortDirection = get(sortDirectionState);

    const sorted = [...searchedTodos].sort((a, b) => {
      let comparison = 0;

      switch (sortType) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority || 'low'];
          const bPriority = priorityOrder[b.priority || 'low'];
          comparison = aPriority - bPriority;
          break;
        case 'text':
          comparison = a.text.localeCompare(b.text);
          break;
        case 'createdAt':
        default:
          comparison = a.createdAt - b.createdAt;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  },
});

/**
 * Selector for todo statistics
 */
export const todoStatsState = selector<TodoStats>({
  key: 'todoStatsState',
  get: ({ get }) => {
    const todos = get(todosState);
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    const completionRate = total === 0 ? 0 : (completed / total) * 100;

    return {
      total,
      completed,
      active,
      completionRate,
    };
  },
});

/**
 * Selector for getting a specific todo by ID
 * This is a selector family that creates a selector for each todo ID
 */
export const todoByIdState = selectorFamily<Todo | undefined, string>({
  key: 'todoByIdState',
  get: (todoId: string) => ({ get }) => {
    const todos = get(todosState);
    return todos.find((todo) => todo.id === todoId);
  },
});

/**
 * Selector for todos by category
 */
export const todosByCategoryState = selector<Record<string, Todo[]>>({
  key: 'todosByCategoryState',
  get: ({ get }) => {
    const todos = get(todosState);
    const byCategory: Record<string, Todo[]> = {};

    todos.forEach((todo) => {
      const category = todo.category || 'Uncategorized';
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(todo);
    });

    return byCategory;
  },
});

/**
 * Selector for high priority incomplete todos
 */
export const urgentTodosState = selector<Todo[]>({
  key: 'urgentTodosState',
  get: ({ get }) => {
    const todos = get(todosState);
    return todos.filter(
      (todo) => !todo.completed && todo.priority === 'high'
    );
  },
});

/**
 * Async selector example - simulates fetching todos from an API
 * In a real application, this would fetch from a backend
 */
export const asyncTodosState = selector<Todo[]>({
  key: 'asyncTodosState',
  get: async ({ get }) => {
    // This demonstrates async selectors
    // In a real app, you would fetch from an API here
    const todos = get(todosState);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return todos;
  },
});

/**
 * Selector for checking if all todos are completed
 */
export const allTodosCompletedState = selector<boolean>({
  key: 'allTodosCompletedState',
  get: ({ get }) => {
    const todos = get(todosState);
    return todos.length > 0 && todos.every((todo) => todo.completed);
  },
});

/**
 * Selector for the number of todos in each priority level
 */
export const todoPriorityCountsState = selector<Record<string, number>>({
  key: 'todoPriorityCountsState',
  get: ({ get }) => {
    const todos = get(todosState);
    return todos.reduce((acc, todo) => {
      const priority = todo.priority || 'low';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },
});
