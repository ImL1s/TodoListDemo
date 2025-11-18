/**
 * Jotai Atoms for Todo State Management
 *
 * This file demonstrates Jotai's primitive and flexible approach to state management:
 * 1. Primitive atoms - bottom-up state definition
 * 2. Derived atoms - computed values with automatic dependency tracking
 * 3. atomWithStorage - built-in localStorage persistence
 * 4. atomFamily - dynamic atom creation for individual items
 * 5. No Provider needed - atoms are globally accessible
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomFamily } from 'jotai/utils';
import { Todo, FilterType, TodoStats } from '../types';

// ============================================================================
// PRIMITIVE ATOMS (Bottom-up approach)
// ============================================================================

/**
 * Main todos atom with localStorage persistence
 * Uses atomWithStorage for automatic sync with localStorage
 *
 * Key difference from Recoil:
 * - No RecoilRoot Provider needed
 * - Simpler API: atomWithStorage vs atom({ key, default, effects })
 * - Atoms are defined as constants, not functions
 */
export const todosAtom = atomWithStorage<Todo[]>('jotai-todos', []);

/**
 * Filter atom - controls which todos are visible
 * Simple primitive atom with default value
 */
export const filterAtom = atom<FilterType>('all');

/**
 * Input text atom - for the new todo input field
 * Demonstrates ephemeral state that doesn't need persistence
 */
export const inputTextAtom = atom<string>('');

// ============================================================================
// DERIVED ATOMS (Computed values)
// ============================================================================

/**
 * Filtered todos - derived from todos and filter atoms
 *
 * Read-only derived atom that automatically updates when dependencies change
 * This is Jotai's equivalent to Recoil selectors, but simpler:
 * - Just pass a getter function to atom()
 * - No need for a separate selector() function
 * - Automatic dependency tracking
 */
export const filteredTodosAtom = atom<Todo[]>((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);

  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
});

/**
 * Todo statistics - derived atom for stats calculation
 *
 * Demonstrates computed values based on the todos array
 * Updates automatically whenever todos change
 */
export const todoStatsAtom = atom<TodoStats>((get) => {
  const todos = get(todosAtom);

  return {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };
});

// ============================================================================
// READ-WRITE DERIVED ATOMS (Actions)
// ============================================================================

/**
 * Add todo atom - read-write derived atom for adding todos
 *
 * This pattern demonstrates how to create "action" atoms in Jotai:
 * - Read function returns nothing (or a useful value)
 * - Write function performs the action
 *
 * Usage: const addTodo = useSetAtom(addTodoAtom)
 *        addTodo('New todo text')
 */
export const addTodoAtom = atom(
  null, // read function - returns nothing
  (get, set, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now(),
    };

    set(todosAtom, [...get(todosAtom), newTodo]);
    set(inputTextAtom, ''); // Clear input after adding
  }
);

/**
 * Toggle todo atom - action for toggling completion status
 */
export const toggleTodoAtom = atom(
  null,
  (get, set, id: string) => {
    set(
      todosAtom,
      get(todosAtom).map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
);

/**
 * Delete todo atom - action for removing todos
 */
export const deleteTodoAtom = atom(
  null,
  (get, set, id: string) => {
    set(
      todosAtom,
      get(todosAtom).filter((todo) => todo.id !== id)
    );
  }
);

/**
 * Edit todo atom - action for updating todo text
 */
export const editTodoAtom = atom(
  null,
  (get, set, payload: { id: string; text: string }) => {
    const trimmedText = payload.text.trim();
    if (!trimmedText) return;

    set(
      todosAtom,
      get(todosAtom).map((todo) =>
        todo.id === payload.id ? { ...todo, text: trimmedText } : todo
      )
    );
  }
);

/**
 * Clear completed atom - action for removing all completed todos
 */
export const clearCompletedAtom = atom(
  null,
  (get, set) => {
    set(
      todosAtom,
      get(todosAtom).filter((todo) => !todo.completed)
    );
  }
);

/**
 * Toggle all atom - action for toggling all todos at once
 */
export const toggleAllAtom = atom(
  null,
  (get, set) => {
    const todos = get(todosAtom);
    const allCompleted = todos.every((todo) => todo.completed);

    set(
      todosAtom,
      todos.map((todo) => ({ ...todo, completed: !allCompleted }))
    );
  }
);

// ============================================================================
// ATOM FAMILY (Dynamic atoms for individual items)
// ============================================================================

/**
 * Todo atom family - creates individual atoms for each todo
 *
 * This is an advanced pattern that creates a separate atom for each todo item.
 * Benefits:
 * - Fine-grained reactivity - only the changed item re-renders
 * - Better performance for large lists
 * - Each todo has its own atom instance
 *
 * Note: This is optional and demonstrates Jotai's flexibility
 * For most apps, the simple approach above is sufficient
 */
export const todoAtomFamily = atomFamily((id: string) =>
  atom(
    (get) => get(todosAtom).find((todo) => todo.id === id),
    (get, set, update: Partial<Todo>) => {
      set(
        todosAtom,
        get(todosAtom).map((todo) =>
          todo.id === id ? { ...todo, ...update } : todo
        )
      );
    }
  )
);

// ============================================================================
// COMPARISON WITH OTHER STATE MANAGEMENT SOLUTIONS
// ============================================================================

/*
 * JOTAI vs RECOIL:
 *
 * Similarities:
 * - Both use atomic state approach
 * - Both support derived/computed values
 * - Both have minimal re-renders
 *
 * Key Differences:
 * 1. Provider:
 *    - Jotai: No Provider needed (simpler)
 *    - Recoil: Requires RecoilRoot wrapper
 *
 * 2. API Simplicity:
 *    - Jotai: atom() for everything
 *    - Recoil: atom() and selector() are separate
 *
 * 3. TypeScript:
 *    - Jotai: Better type inference
 *    - Recoil: More verbose type definitions
 *
 * 4. Bundle Size:
 *    - Jotai: ~3KB (smaller)
 *    - Recoil: ~14KB
 *
 * 5. Persistence:
 *    - Jotai: Built-in atomWithStorage
 *    - Recoil: Need atom effects
 *
 * JOTAI vs ZUSTAND:
 *
 * - Jotai: Bottom-up (atoms first, compose later)
 * - Zustand: Top-down (single store, split if needed)
 *
 * - Jotai: More React-like with hooks
 * - Zustand: More flexible, can be used outside React
 *
 * - Jotai: Better for complex derived state
 * - Zustand: Better for simple global state
 *
 * JOTAI vs REDUX:
 *
 * - Jotai: Minimal boilerplate, atoms are simple
 * - Redux: More boilerplate (actions, reducers, etc.)
 *
 * - Jotai: Built-in async support
 * - Redux: Need middleware (Redux Thunk/Saga)
 *
 * - Jotai: Component-level optimization by default
 * - Redux: Need manual optimization with selectors
 */
