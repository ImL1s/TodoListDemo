# React + Recoil Todo List Application

A comprehensive Todo List application demonstrating Recoil state management library for React with atoms, selectors, and advanced patterns.

## Table of Contents

- [Overview](#overview)
- [What is Recoil?](#what-is-recoil)
- [Core Concepts](#core-concepts)
  - [Atoms](#atoms)
  - [Selectors](#selectors)
  - [Hooks](#hooks)
  - [Atom Families](#atom-families)
  - [Selector Families](#selector-families)
  - [Atom Effects](#atom-effects)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Development](#development)
- [Recoil Architecture Deep Dive](#recoil-architecture-deep-dive)
- [Comparison with Other State Management Solutions](#comparison-with-other-state-management-solutions)
- [When to Use Recoil](#when-to-use-recoil)
- [Advanced Patterns](#advanced-patterns)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Code Examples](#code-examples)
- [Resources](#resources)

## Overview

This project implements a feature-rich Todo List application using React and Recoil. It demonstrates key Recoil concepts including atoms for state management, selectors for derived state, atom families for dynamic state, and effects for side effects like localStorage persistence.

**Key Technologies:**
- React 18.2+
- Recoil 0.7.7+
- TypeScript 5.3+
- Vite 5.0+

## What is Recoil?

Recoil is a state management library for React developed by Facebook (Meta). It was created to address limitations in existing state management solutions and to work seamlessly with React's concurrent mode and other modern features.

### Philosophy

Recoil's philosophy centers around several key principles:

1. **Minimal and React-like**: Uses hooks and feels natural to React developers
2. **Data-flow graph**: State is organized as a directed graph
3. **Incremental adoption**: Can be added gradually to existing apps
4. **Shared state**: Easy to share state between components without prop drilling
5. **Derived state**: Powerful selector system for computed values
6. **App-wide state observation**: Subscribe to state changes anywhere

### Why Recoil?

**Problems Recoil Solves:**

1. **Component State Limitations**: React's useState is local to components
2. **Context API Performance**: Context causes re-renders of all consumers
3. **Redux Boilerplate**: Recoil requires less code than Redux
4. **State Derivation**: Built-in support for derived/computed values
5. **Async State**: First-class support for async data fetching
6. **Code Splitting**: State can be split along with components

## Core Concepts

### Atoms

Atoms are units of state in Recoil. They're the smallest pieces of state that components can subscribe to.

**Key Characteristics:**
- Writable and readable
- Can be subscribed to from any component
- Components that read an atom automatically re-render when it changes
- Multiple components can use the same atom

**Basic Atom Example:**

```typescript
import { atom } from 'recoil';

export const todoListState = atom<Todo[]>({
  key: 'todoListState', // Unique identifier
  default: [], // Initial value
});
```

**Atom with Effects:**

```typescript
export const todosState = atom<Todo[]>({
  key: 'todosState',
  default: [],
  effects: [
    ({ onSet, setSelf }) => {
      // Load from localStorage on initialization
      const stored = localStorage.getItem('todos');
      if (stored) {
        setSelf(JSON.parse(stored));
      }

      // Save to localStorage on every change
      onSet((newValue) => {
        localStorage.setItem('todos', JSON.stringify(newValue));
      });
    },
  ],
});
```

### Selectors

Selectors represent derived state - computed values based on atoms or other selectors.

**Key Characteristics:**
- Pure functions that compute derived state
- Can depend on atoms or other selectors
- Automatically recompute when dependencies change
- Can be synchronous or asynchronous
- Results are cached

**Basic Selector Example:**

```typescript
import { selector } from 'recoil';

export const completedTodosState = selector<Todo[]>({
  key: 'completedTodosState',
  get: ({ get }) => {
    const todos = get(todosState);
    return todos.filter(todo => todo.completed);
  },
});
```

**Complex Selector with Multiple Dependencies:**

```typescript
export const sortedFilteredTodosState = selector<Todo[]>({
  key: 'sortedFilteredTodosState',
  get: ({ get }) => {
    const todos = get(todosState);
    const filter = get(filterState);
    const sortType = get(sortTypeState);
    const searchQuery = get(searchQueryState);

    // Filter by completion status
    let filtered = todos;
    if (filter === 'completed') {
      filtered = todos.filter(t => t.completed);
    } else if (filter === 'active') {
      filtered = todos.filter(t => !t.completed);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortType === 'priority') {
        return getPriorityValue(b.priority) - getPriorityValue(a.priority);
      }
      return b.createdAt - a.createdAt;
    });
  },
});
```

**Async Selector Example:**

```typescript
export const userDataState = selector({
  key: 'userDataState',
  get: async ({ get }) => {
    const userId = get(currentUserIdState);
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
});
```

### Hooks

Recoil provides several hooks for interacting with atoms and selectors:

#### useRecoilState

Similar to useState but for Recoil atoms:

```typescript
const [todos, setTodos] = useRecoilState(todosState);
```

#### useRecoilValue

Read-only access to state:

```typescript
const todos = useRecoilValue(todosState);
```

#### useSetRecoilState

Write-only access (doesn't subscribe to updates):

```typescript
const setTodos = useSetRecoilState(todosState);
```

#### useResetRecoilState

Reset atom to its default value:

```typescript
const resetTodos = useResetRecoilState(todosState);
```

#### useRecoilCallback

Access Recoil state without subscribing:

```typescript
const logTodos = useRecoilCallback(({ snapshot }) => async () => {
  const todos = await snapshot.getPromise(todosState);
  console.log('Current todos:', todos);
});
```

### Atom Families

Atom families allow you to create atoms dynamically based on parameters. This is useful for managing collections of similar state.

**Basic Example:**

```typescript
import { atomFamily } from 'recoil';

export const todoItemState = atomFamily<Todo | undefined, string>({
  key: 'todoItemState',
  default: undefined,
});

// Usage in component
const todo = useRecoilValue(todoItemState(todoId));
```

**Use Cases for Atom Families:**

1. **Individual Item State**: Each item in a list has its own atom
2. **Form Fields**: Separate atoms for each form field
3. **UI State per Item**: Expanded/collapsed state for list items
4. **Cache by ID**: Cached data keyed by identifier

**Advanced Atom Family Example:**

```typescript
export const todoEditStateFamily = atomFamily<boolean, string>({
  key: 'todoEditStateFamily',
  default: false,
});

// In a component managing edit state for each todo
function TodoItem({ todoId }: { todoId: string }) {
  const [isEditing, setIsEditing] = useRecoilState(
    todoEditStateFamily(todoId)
  );

  // Each todo has its own independent edit state
}
```

### Selector Families

Selector families are to selectors what atom families are to atoms - they create selectors dynamically.

**Example:**

```typescript
import { selectorFamily } from 'recoil';

export const todoByIdState = selectorFamily<Todo | undefined, string>({
  key: 'todoByIdState',
  get: (todoId: string) => ({ get }) => {
    const todos = get(todosState);
    return todos.find(todo => todo.id === todoId);
  },
});

// Usage
const todo = useRecoilValue(todoByIdState('todo-123'));
```

**Async Selector Family:**

```typescript
export const userByIdState = selectorFamily({
  key: 'userByIdState',
  get: (userId: string) => async () => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
});
```

### Atom Effects

Atom effects are side effects attached to atoms. They're useful for:

- Syncing with external storage (localStorage, IndexedDB)
- Logging state changes
- Syncing with server
- Initializing state from external sources

**LocalStorage Effect:**

```typescript
const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
  // Load from localStorage on initialization
  const savedValue = localStorage.getItem(key);
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue));
  }

  // Save to localStorage whenever state changes
  onSet((newValue: any, _: any, isReset: boolean) => {
    if (isReset) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};

// Usage
export const todosState = atom<Todo[]>({
  key: 'todosState',
  default: [],
  effects: [localStorageEffect('todos')],
});
```

**Logging Effect:**

```typescript
const loggingEffect = ({ onSet }: any) => {
  onSet((newValue: any, oldValue: any) => {
    console.log('State changed from', oldValue, 'to', newValue);
  });
};
```

## Project Structure

```
05-react-recoil/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx       # Input component for creating todos
│   │   ├── TodoItem.tsx        # Individual todo item component
│   │   ├── TodoList.tsx        # List container component
│   │   └── TodoFilters.tsx     # Filters and statistics component
│   ├── state/
│   │   ├── atoms.ts            # Recoil atoms definitions
│   │   └── selectors.ts        # Recoil selectors definitions
│   ├── types.ts                # TypeScript type definitions
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # Styles
│   └── main.tsx                # Entry point
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
└── README.md                   # This file
```

## Features

### Core Functionality

- ✅ **Create Todos**: Add new todos with text, priority, and category
- ✅ **Edit Todos**: Double-click to edit, Enter to save, Escape to cancel
- ✅ **Delete Todos**: Remove individual todos
- ✅ **Toggle Complete**: Mark todos as complete/incomplete
- ✅ **Bulk Actions**: Complete all, clear completed, clear all

### Filtering & Sorting

- ✅ **Filter by Status**: All, Active, Completed
- ✅ **Search**: Filter todos by text or category
- ✅ **Sort**: By creation date, priority, or text
- ✅ **Sort Direction**: Ascending or descending

### State Management Features

- ✅ **Atoms**: Core state management with Recoil atoms
- ✅ **Selectors**: Derived state for filtered and sorted todos
- ✅ **Atom Families**: Dynamic state management (demonstrated)
- ✅ **Atom Effects**: localStorage persistence
- ✅ **Statistics**: Real-time stats using selectors

### UI/UX

- ✅ **Priority Indicators**: Visual priority levels (high, medium, low)
- ✅ **Category Tags**: Organize todos by category
- ✅ **Timestamps**: Creation date for each todo
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Statistics Dashboard**: Completion rate and counts

## Installation

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Steps

1. **Navigate to the project directory:**

```bash
cd 14-state-management/05-react-recoil
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser:**

Navigate to `http://localhost:3000`

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

### Project Configuration

**Vite Configuration (vite.config.ts):**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
```

**TypeScript Configuration:**

The project uses strict TypeScript settings for type safety:
- Strict mode enabled
- No unused locals/parameters
- ES2020 target
- ESNext modules

## Recoil Architecture Deep Dive

### State Organization

In this application, state is organized into three main categories:

1. **Source of Truth (Atoms)**:
   - `todosState`: The main array of todos
   - `filterState`: Current filter selection
   - `sortTypeState`: Current sort type
   - `sortDirectionState`: Sort direction
   - `searchQueryState`: Search text

2. **Derived State (Selectors)**:
   - `filteredTodosState`: Todos filtered by status
   - `searchedTodosState`: Filtered + searched todos
   - `sortedTodosState`: Fully processed todos for display
   - `todoStatsState`: Computed statistics

3. **Dynamic State (Atom Families)**:
   - `todoItemState`: Individual todo states
   - `editingTodoIdState`: Track editing state

### Data Flow

```
User Action
    ↓
Component (using hooks)
    ↓
Atom Update (setTodos)
    ↓
Atom Effects (localStorage)
    ↓
Selectors Recompute (automatic)
    ↓
Components Re-render (automatic)
```

### Selector Composition

Selectors can depend on other selectors, creating a computation graph:

```
todosState (atom)
    ↓
filteredTodosState (selector)
    ↓
searchedTodosState (selector)
    ↓
sortedTodosState (selector)
    ↓
Component reads final value
```

This composition is efficient because:
- Each selector only recomputes if its dependencies change
- Results are memoized
- Components only re-render if their subscribed values change

### Atom Effects Pipeline

When todos change:

1. Component calls `setTodos(newValue)`
2. Atom state updates
3. Atom effects run in order:
   - localStorage effect saves to storage
   - Any logging effects run
4. Dependent selectors recompute
5. Subscribed components re-render

## Comparison with Other State Management Solutions

### Recoil vs Redux

**Redux Strengths:**
- Mature ecosystem with extensive middleware
- Time-travel debugging
- Predictable state updates
- Large community and resources
- Redux Toolkit reduces boilerplate

**Redux Weaknesses:**
- Significant boilerplate (actions, reducers, types)
- Learning curve for beginners
- Can be overkill for simple applications
- Requires additional libraries for async (thunks/sagas)
- Global store can lead to performance issues

**Recoil Strengths:**
- Minimal boilerplate
- React-like API (hooks)
- Granular subscriptions (better performance)
- Built-in async support
- Easy to learn for React developers
- Works with Concurrent Mode

**Recoil Weaknesses:**
- Smaller ecosystem than Redux
- Less mature (newer library)
- Fewer debugging tools
- Less documentation and examples
- Facebook/Meta-maintained (dependency risk)

**When to Choose Redux:**
- Large, complex applications
- Need time-travel debugging
- Team familiar with Redux
- Extensive middleware needed
- Require strict patterns

**When to Choose Recoil:**
- React-focused applications
- Want minimal boilerplate
- Need granular performance
- Async-heavy applications
- Want React-like patterns

### Recoil vs Zustand

**Zustand Strengths:**
- Extremely minimal API
- No providers needed
- Very small bundle size (~1KB)
- Simple and intuitive
- Can use outside React components
- Fast and performant

**Zustand Weaknesses:**
- Less structure (can be good or bad)
- No built-in dev tools
- Simpler API means fewer features
- Less guidance on patterns

**Recoil Strengths:**
- More powerful selector system
- Atom families for dynamic state
- Built-in async handling
- Better for complex state derivation
- More React-integrated

**Recoil Weaknesses:**
- Larger bundle size
- Requires RecoilRoot provider
- More concepts to learn
- Can be overkill for simple apps

**When to Choose Zustand:**
- Want minimal bundle size
- Prefer simplicity
- Small to medium applications
- Don't need complex derived state
- Want flexibility in patterns

**When to Choose Recoil:**
- Need powerful selectors
- Complex state derivation
- Async data fetching patterns
- Want more structure
- Building larger applications

### Recoil vs Jotai

**Similarities:**
- Both use atomic state management
- Both are minimal and React-focused
- Both support derived state
- Both work with TypeScript

**Jotai Strengths:**
- Even more minimal than Recoil
- Smaller bundle size
- No string keys (atoms are objects)
- Better TypeScript inference
- More flexible architecture

**Recoil Strengths:**
- More features out of the box
- Atom families built-in
- More documentation
- Meta-backed (could be pro or con)
- More examples available

**Key Differences:**

```typescript
// Recoil - requires string keys
const countState = atom({
  key: 'countState',
  default: 0,
});

// Jotai - atoms are objects
const countAtom = atom(0);
```

**When to Choose Jotai:**
- Want maximum simplicity
- Prefer object-based atoms
- Need better TypeScript inference
- Want more flexibility

**When to Choose Recoil:**
- Need more features
- Want more examples
- Prefer string-based keys
- Building complex applications

### Recoil vs Context API

**Context API Strengths:**
- Built into React
- No additional dependencies
- Simple for basic cases
- Well understood

**Context API Weaknesses:**
- Performance issues with frequent updates
- All consumers re-render on any change
- No built-in derivation
- Can lead to provider hell
- Not designed for global state

**Recoil Strengths:**
- Granular subscriptions
- Better performance
- Built-in selectors
- Single provider
- Designed for state management

**When to Choose Context:**
- Passing down config/theme
- Rare updates
- Minimal state
- Want no dependencies

**When to Choose Recoil:**
- Frequent state updates
- Need derived state
- Want better performance
- Global application state

### Recoil vs MobX

**MobX Strengths:**
- Automatic tracking
- Less boilerplate
- Object-oriented approach
- Mature library

**MobX Weaknesses:**
- Different mental model (OOP)
- Can be "too magical"
- Harder to debug
- Not as React-idiomatic

**Recoil Strengths:**
- More React-like
- Functional approach
- Explicit dependencies
- Better for React developers

**When to Choose MobX:**
- Prefer OOP patterns
- Want automatic tracking
- Team familiar with MobX

**When to Choose Recoil:**
- Prefer functional patterns
- Want React-like API
- New to state management

## When to Use Recoil

### Ideal Use Cases

1. **Complex Derived State**:
   - Multiple filters, sorts, searches
   - Computed values from multiple sources
   - Chained derivations

2. **Granular Updates**:
   - Large lists where items update independently
   - Forms with many fields
   - Real-time collaborative apps

3. **Async Data Fetching**:
   - Loading data from APIs
   - Suspense integration
   - Dependent queries

4. **React-Heavy Applications**:
   - Apps built primarily with React
   - Component-driven architecture
   - Leveraging React Concurrent Mode

5. **Performance-Critical Applications**:
   - Need to minimize re-renders
   - Large state trees
   - Frequent updates

### Not Ideal For

1. **Very Simple Apps**: If you only need a few pieces of shared state, Context API might suffice

2. **Non-React Apps**: Recoil is React-specific

3. **Server-Side Rendering**: Limited SSR support (improving)

4. **Need for Maturity**: If you need battle-tested solutions, Redux is more mature

5. **Time-Travel Debugging**: Redux DevTools are more powerful

## Advanced Patterns

### Pattern 1: Optimistic Updates

```typescript
const addTodoOptimistic = useRecoilCallback(
  ({ set }) => async (text: string) => {
    const tempId = `temp-${Date.now()}`;
    const tempTodo: Todo = {
      id: tempId,
      text,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Optimistically add todo
    set(todosState, (prev) => [...prev, tempTodo]);

    try {
      // Send to server
      const response = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      const serverTodo = await response.json();

      // Replace temp todo with server todo
      set(todosState, (prev) =>
        prev.map((t) => (t.id === tempId ? serverTodo : t))
      );
    } catch (error) {
      // Remove temp todo on error
      set(todosState, (prev) =>
        prev.filter((t) => t.id !== tempId)
      );
    }
  }
);
```

### Pattern 2: Undo/Redo

```typescript
const historyState = atom<Todo[][]>({
  key: 'historyState',
  default: [],
});

const currentIndexState = atom<number>({
  key: 'currentIndexState',
  default: -1,
});

const useUndo = () => {
  const setTodos = useSetRecoilState(todosState);
  const [history, setHistory] = useRecoilState(historyState);
  const [currentIndex, setCurrentIndex] = useRecoilState(currentIndexState);

  const undo = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setTodos(history[newIndex]);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setTodos(history[newIndex]);
    }
  };

  return { undo, redo };
};
```

### Pattern 3: Suspense for Data Fetching

```typescript
const currentUserIDState = atom<number>({
  key: 'currentUserIDState',
  default: 1,
});

const currentUserDataState = selector({
  key: 'currentUserDataState',
  get: async ({ get }) => {
    const userId = get(currentUserIDState);
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },
});

// In component
function UserProfile() {
  const userData = useRecoilValue(currentUserDataState);
  // This will suspend until data is loaded
  return <div>{userData.name}</div>;
}

// Wrap with Suspense
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile />
    </Suspense>
  );
}
```

### Pattern 4: Request Deduplication

```typescript
const userByIdQuery = selectorFamily({
  key: 'userByIdQuery',
  get: (userId: string) => async () => {
    // Recoil automatically deduplicates requests
    // Multiple components requesting the same userId
    // will only trigger one fetch
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
});
```

### Pattern 5: Atom Synchronization

```typescript
// Sync atom with URL query params
const filterFromUrlState = atom({
  key: 'filterFromUrlState',
  default: 'all' as FilterType,
  effects: [
    ({ setSelf, onSet }) => {
      // Read from URL on load
      const params = new URLSearchParams(window.location.search);
      const filter = params.get('filter');
      if (filter) {
        setSelf(filter as FilterType);
      }

      // Update URL on change
      onSet((newValue) => {
        const params = new URLSearchParams(window.location.search);
        params.set('filter', newValue);
        window.history.pushState(
          {},
          '',
          `${window.location.pathname}?${params}`
        );
      });
    },
  ],
});
```

## Performance Optimization

### 1. Selective Subscriptions

Only subscribe to the state you need:

```typescript
// ❌ Bad - subscribes to entire state
const [todos, setTodos] = useRecoilState(todosState);
const count = todos.length;

// ✅ Good - subscribe to derived value only
const todoCount = useRecoilValue(todoCountSelector);
```

### 2. Use useSetRecoilState for Write-Only

```typescript
// ❌ Bad - subscribes even if you only write
const [todos, setTodos] = useRecoilState(todosState);

// ✅ Good - doesn't subscribe to updates
const setTodos = useSetRecoilState(todosState);
```

### 3. Memoize Selectors

Selectors are already memoized, but ensure dependencies are minimal:

```typescript
// ✅ Good - only recomputes when todos or filter changes
const filteredTodos = selector({
  key: 'filteredTodos',
  get: ({ get }) => {
    const todos = get(todosState);
    const filter = get(filterState);
    return todos.filter(/* ... */);
  },
});
```

### 4. Use Atom Families for Lists

```typescript
// ❌ Bad - entire component re-renders on any todo change
function TodoList() {
  const todos = useRecoilValue(todosState);
  return todos.map(todo => <TodoItem todo={todo} />);
}

// ✅ Better - only changed items re-render
function TodoList() {
  const todoIds = useRecoilValue(todoIdsState);
  return todoIds.map(id => <TodoItemWithFamily todoId={id} />);
}

function TodoItemWithFamily({ todoId }) {
  const todo = useRecoilValue(todoItemFamily(todoId));
  return <div>{todo.text}</div>;
}
```

### 5. useRecoilCallback for Batch Operations

```typescript
const batchUpdate = useRecoilCallback(
  ({ set }) => (updates: Todo[]) => {
    // All updates happen in one batch
    updates.forEach(todo => {
      set(todoItemFamily(todo.id), todo);
    });
  }
);
```

## Testing

### Testing Atoms and Selectors

```typescript
import { snapshot_UNSTABLE } from 'recoil';
import { todosState, todoStatsState } from './atoms';

test('todoStatsState calculates correctly', () => {
  const snapshot = snapshot_UNSTABLE(({ set }) => {
    set(todosState, [
      { id: '1', text: 'Todo 1', completed: true, /* ... */ },
      { id: '2', text: 'Todo 2', completed: false, /* ... */ },
    ]);
  });

  const stats = snapshot.getLoadable(todoStatsState).getValue();
  expect(stats.total).toBe(2);
  expect(stats.completed).toBe(1);
  expect(stats.active).toBe(1);
});
```

### Testing Components

```typescript
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { todosState } from './state/atoms';

test('renders todos', () => {
  const initializeState = ({ set }) => {
    set(todosState, [
      { id: '1', text: 'Test Todo', completed: false, /* ... */ },
    ]);
  };

  render(
    <RecoilRoot initializeState={initializeState}>
      <TodoList />
    </RecoilRoot>
  );

  expect(screen.getByText('Test Todo')).toBeInTheDocument();
});
```

## Best Practices

### 1. Atom Organization

**Group related atoms:**

```typescript
// ✅ Good - organized by feature
// state/todos/atoms.ts
export const todosState = atom({ /* ... */ });
export const todoFilterState = atom({ /* ... */ });

// state/users/atoms.ts
export const usersState = atom({ /* ... */ });
export const currentUserState = atom({ /* ... */ });
```

### 2. Unique Keys

Always use descriptive, unique keys:

```typescript
// ❌ Bad
const state1 = atom({ key: 's1', default: 0 });

// ✅ Good
const userCountState = atom({ key: 'userCountState', default: 0 });
```

### 3. Type Safety

Always use TypeScript generics:

```typescript
// ✅ Good
const todosState = atom<Todo[]>({
  key: 'todosState',
  default: [],
});

const stats = useRecoilValue<TodoStats>(todoStatsState);
```

### 4. Selector Naming

Use descriptive names that indicate derivation:

```typescript
// ✅ Good naming
const filteredTodosState = selector({ /* ... */ });
const todoCountState = selector({ /* ... */ });
const activeTodosState = selector({ /* ... */ });
```

### 5. Effects for Side Effects

Use atom effects for external synchronization:

```typescript
// ✅ Good - clear separation of concerns
const todosState = atom({
  key: 'todosState',
  default: [],
  effects: [
    localStorageEffect('todos'),
    loggingEffect,
    analyticsEffect,
  ],
});
```

### 6. Avoid Circular Dependencies

```typescript
// ❌ Bad - circular dependency
const stateA = selector({
  get: ({ get }) => {
    const b = get(stateB);
    return b + 1;
  },
});

const stateB = selector({
  get: ({ get }) => {
    const a = get(stateA);
    return a + 1;
  },
});
```

## Common Pitfalls

### 1. Duplicate Keys

```typescript
// ❌ Bad - duplicate keys cause errors
const state1 = atom({ key: 'myState', default: 0 });
const state2 = atom({ key: 'myState', default: '' }); // Error!
```

### 2. Not Using RecoilRoot

```typescript
// ❌ Bad - components won't work
function App() {
  return <TodoList />;
}

// ✅ Good
function App() {
  return (
    <RecoilRoot>
      <TodoList />
    </RecoilRoot>
  );
}
```

### 3. Mutating State Directly

```typescript
// ❌ Bad - direct mutation
const [todos, setTodos] = useRecoilState(todosState);
todos.push(newTodo); // Don't do this!

// ✅ Good - immutable update
setTodos([...todos, newTodo]);
```

### 4. Overusing Atom Families

```typescript
// ❌ Overkill - atom family not needed
const simpleValueFamily = atomFamily({
  key: 'simpleValue',
  default: 0,
});

// ✅ Better - use regular atom
const simpleValue = atom({
  key: 'simpleValue',
  default: 0,
});
```

### 5. Forgetting Async Handling

```typescript
// ❌ Bad - no error handling
const dataState = selector({
  key: 'dataState',
  get: async () => {
    const response = await fetch('/api/data');
    return response.json();
  },
});

// ✅ Good - with error handling
const dataState = selector({
  key: 'dataState',
  get: async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },
});
```

## Code Examples

### Example 1: Todo CRUD Operations

```typescript
import { useRecoilState } from 'recoil';
import { todosState } from './state/atoms';
import { Todo } from './types';

function useTodoActions() {
  const [todos, setTodos] = useRecoilState(todosState);

  const addTodo = (text: string, priority: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      priority,
    };
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: Date.now() }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
          : todo
      )
    );
  };

  return { addTodo, updateTodo, deleteTodo, toggleTodo };
}
```

### Example 2: Custom Hook with Selectors

```typescript
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  sortedTodosState,
  todoStatsState,
  filterState,
  searchQueryState,
} from './state/selectors';

function useTodoManagement() {
  const todos = useRecoilValue(sortedTodosState);
  const stats = useRecoilValue(todoStatsState);
  const setFilter = useSetRecoilState(filterState);
  const setSearch = useSetRecoilState(searchQueryState);

  return {
    todos,
    stats,
    setFilter,
    setSearch,
  };
}

// Usage in component
function TodoDashboard() {
  const { todos, stats, setFilter } = useTodoManagement();

  return (
    <div>
      <div>Total: {stats.total}</div>
      <div>Completed: {stats.completed}</div>
      <button onClick={() => setFilter('active')}>
        Show Active
      </button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 3: Async Selector with Suspense

```typescript
import { selector } from 'recoil';
import { Suspense } from 'react';
import { useRecoilValue } from 'recoil';

const todosFromApiState = selector({
  key: 'todosFromApiState',
  get: async () => {
    const response = await fetch('/api/todos');
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },
});

function TodoListFromApi() {
  const todos = useRecoilValue(todosFromApiState);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <RecoilRoot>
      <Suspense fallback={<div>Loading todos...</div>}>
        <TodoListFromApi />
      </Suspense>
    </RecoilRoot>
  );
}
```

### Example 4: Atom Family for Individual Items

```typescript
import { atomFamily, useRecoilState } from 'recoil';

const todoExpandedStateFamily = atomFamily<boolean, string>({
  key: 'todoExpandedStateFamily',
  default: false,
});

function TodoItem({ todoId, text, details }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useRecoilState(
    todoExpandedStateFamily(todoId)
  );

  return (
    <div>
      <div onClick={() => setIsExpanded(!isExpanded)}>
        {text}
      </div>
      {isExpanded && <div>{details}</div>}
    </div>
  );
}

// Each todo has independent expanded state
// Clicking one doesn't affect others
```

### Example 5: Complex Selector Chain

```typescript
// Base atom
const todosState = atom<Todo[]>({
  key: 'todosState',
  default: [],
});

// First level - filter by completion
const completedTodosState = selector({
  key: 'completedTodosState',
  get: ({ get }) => {
    const todos = get(todosState);
    return todos.filter(t => t.completed);
  },
});

// Second level - filter by priority
const highPriorityCompletedTodosState = selector({
  key: 'highPriorityCompletedTodosState',
  get: ({ get }) => {
    const completed = get(completedTodosState);
    return completed.filter(t => t.priority === 'high');
  },
});

// Third level - count
const highPriorityCompletedCountState = selector({
  key: 'highPriorityCompletedCountState',
  get: ({ get }) => {
    const todos = get(highPriorityCompletedTodosState);
    return todos.length;
  },
});

// Usage
function Stats() {
  const count = useRecoilValue(highPriorityCompletedCountState);
  return <div>High priority completed: {count}</div>;
}
```

## Resources

### Official Documentation

- [Recoil Official Docs](https://recoiljs.org/)
- [Recoil API Reference](https://recoiljs.org/docs/api-reference/core/RecoilRoot)
- [Recoil GitHub Repository](https://github.com/facebookexperimental/Recoil)

### Tutorials and Guides

- [Getting Started with Recoil](https://recoiljs.org/docs/introduction/getting-started)
- [Recoil vs Redux](https://recoiljs.org/docs/introduction/motivation)
- [React Concurrent Mode and Recoil](https://recoiljs.org/docs/guides/asynchronous-data-queries)

### Community Resources

- [Recoil Discord](https://discord.gg/recoil)
- [Stack Overflow - Recoil Tag](https://stackoverflow.com/questions/tagged/recoil)
- [Recoil Examples](https://recoiljs.org/docs/introduction/getting-started#examples)

### Related Libraries

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Jotai](https://jotai.org/) - Alternative atomic state management
- [Zustand](https://github.com/pmndrs/zustand) - Simpler state management

### Articles and Blog Posts

- "Why Recoil?" - Official motivation document
- "Recoil: State Management for React" - Deep dive into concepts
- "Building Scalable React Apps with Recoil" - Architecture patterns
- "Performance Optimization with Recoil" - Best practices

## License

MIT

## Author

Created as a demonstration of Recoil state management patterns in React.

---

**Note**: This project is part of a comprehensive Todo List implementation series showcasing different state management approaches and frameworks.
