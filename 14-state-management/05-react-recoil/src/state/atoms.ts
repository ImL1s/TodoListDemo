import { atom, atomFamily } from 'recoil';
import { Todo, FilterType, SortType, SortDirection } from '../types';

/**
 * LocalStorage key for persisting todos
 */
const STORAGE_KEY = 'recoil-todos';

/**
 * Load todos from localStorage
 */
const loadTodosFromStorage = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};

/**
 * Save todos to localStorage
 */
const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

/**
 * Main todos atom - holds the array of all todos
 * Uses effects for localStorage persistence
 */
export const todosState = atom<Todo[]>({
  key: 'todosState',
  default: loadTodosFromStorage(),
  effects: [
    ({ onSet }) => {
      onSet((newTodos) => {
        saveTodosToStorage(newTodos);
      });
    },
  ],
});

/**
 * Filter atom - controls which todos are visible
 */
export const filterState = atom<FilterType>({
  key: 'filterState',
  default: 'all',
});

/**
 * Sort type atom - controls how todos are sorted
 */
export const sortTypeState = atom<SortType>({
  key: 'sortTypeState',
  default: 'createdAt',
});

/**
 * Sort direction atom - controls ascending or descending sort
 */
export const sortDirectionState = atom<SortDirection>({
  key: 'sortDirectionState',
  default: 'desc',
});

/**
 * Search query atom - for filtering todos by text
 */
export const searchQueryState = atom<string>({
  key: 'searchQueryState',
  default: '',
});

/**
 * Atom family for individual todo items
 * Allows for optimized updates of individual todos without re-rendering the entire list
 *
 * Usage: const todo = useRecoilValue(todoItemState(todoId))
 */
export const todoItemState = atomFamily<Todo | undefined, string>({
  key: 'todoItemState',
  default: undefined,
});

/**
 * Edit mode atom - tracks which todo is currently being edited
 */
export const editingTodoIdState = atom<string | null>({
  key: 'editingTodoIdState',
  default: null,
});

/**
 * Loading state atom - for async operations
 */
export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: false,
});

/**
 * Error state atom - for error handling
 */
export const errorState = atom<string | null>({
  key: 'errorState',
  default: null,
});
