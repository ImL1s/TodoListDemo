# Todo List - React + Valtio

A modern, feature-complete Todo List application built with React and Valtio state management library. This implementation demonstrates Valtio's unique proxy-based approach to state management, featuring mutable-style syntax with automatic immutability.

## Table of Contents

- [Overview](#overview)
- [What is Valtio?](#what-is-valtio)
- [Key Features](#key-features)
- [Why Valtio?](#why-valtio)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
  - [Proxy-Based State](#proxy-based-state)
  - [useSnapshot Hook](#usesnapshot-hook)
  - [Mutable Syntax with Immutable Behavior](#mutable-syntax-with-immutable-behavior)
  - [Derived State with derive()](#derived-state-with-derive)
  - [State Persistence](#state-persistence)
- [Implementation Details](#implementation-details)
  - [Store Architecture](#store-architecture)
  - [Component Design](#component-design)
  - [Type Safety](#type-safety)
- [Valtio vs Other State Management](#valtio-vs-other-state-management)
  - [Valtio vs Redux](#valtio-vs-redux)
  - [Valtio vs Zustand](#valtio-vs-zustand)
  - [Valtio vs MobX](#valtio-vs-mobx)
  - [Valtio vs Jotai](#valtio-vs-jotai)
  - [Valtio vs Immer](#valtio-vs-immer)
- [Advanced Patterns](#advanced-patterns)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [When to Use Valtio](#when-to-use-valtio)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

## Overview

This project showcases a complete Todo List application leveraging Valtio's revolutionary proxy-based state management approach. Unlike traditional state management solutions that require explicit immutability patterns, Valtio allows you to write code that looks mutable but behaves immutably.

### Application Features

- Create, read, update, and delete todos
- Toggle todo completion status
- Edit todos inline (double-click)
- Filter todos by status (all, active, completed)
- Clear completed todos
- Toggle all todos at once
- Real-time statistics (total, active, completed counts)
- LocalStorage persistence
- Responsive design
- TypeScript throughout

## What is Valtio?

Valtio is a minimal and unopinionated state management library for React. The name "Valtio" comes from the Finnish word for "state" or "country," reflecting its focus on state management.

### Core Philosophy

1. **Proxy-Based Reactivity**: Uses JavaScript Proxies to track state changes automatically
2. **Mutable Syntax**: Write code that looks like regular JavaScript mutations
3. **Immutable Behavior**: Despite mutable syntax, state updates are immutable
4. **Minimal API**: Only a few functions to learn (proxy, useSnapshot, subscribe, derive)
5. **No Boilerplate**: No reducers, action creators, or complex setup
6. **Framework Agnostic**: Core library works with any framework; React bindings provided

### The Proxy Magic

```typescript
// Create a proxy
const state = proxy({ count: 0 });

// Mutate it directly
state.count++; // This looks mutable...

// But it's actually immutable!
// Every mutation creates a new immutable snapshot
```

## Key Features

### 1. Proxy-Based State Management

Valtio uses JavaScript's Proxy API to wrap your state objects. This allows automatic tracking of:
- Property reads (for subscription)
- Property writes (for updates)
- Nested object changes
- Array mutations

### 2. Mutable-Style API

Write intuitive, imperative code:

```typescript
// Traditional immutable update (Redux, Zustand)
setState(state => ({
  ...state,
  todos: state.todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
}));

// Valtio - just mutate it!
const todo = state.todos.find(t => t.id === id);
if (todo) todo.completed = !todo.completed;
```

### 3. Automatic Immutability

Despite the mutable syntax, Valtio ensures:
- State updates are immutable
- Time-travel debugging works
- React's rendering optimization works
- No accidental mutations affect other parts

### 4. Computed Values with derive()

Create derived state that automatically updates:

```typescript
const stats = derive({
  total: (get) => get(state).todos.length,
  active: (get) => get(state).todos.filter(t => !t.completed).length,
});
```

### 5. No Provider/Context Setup

Unlike Redux or Context API:

```typescript
// Just import and use!
import { todoState } from './store/todoStore';

function Component() {
  const snap = useSnapshot(todoState);
  return <div>{snap.todos.length}</div>;
}
```

## Why Valtio?

### Advantages

1. **Simplicity**: Minimal API surface, easy to learn
2. **Intuitive**: Write code the way you naturally think about it
3. **Performance**: Fine-grained reactivity, only re-renders what changed
4. **Type Safety**: Excellent TypeScript support
5. **Bundle Size**: Very small (~3KB gzipped)
6. **No Boilerplate**: No actions, reducers, or complex patterns
7. **DevTools**: Works with Redux DevTools
8. **Flexible**: Use anywhere, not just React components

### Trade-offs

1. **Proxy Requirement**: Needs modern JavaScript (IE11 not supported)
2. **Learning Curve**: Proxy behavior can be surprising initially
3. **Ecosystem**: Smaller than Redux, fewer third-party tools
4. **Debugging**: Mutable-style code can be harder to trace
5. **SSR Considerations**: Requires careful setup for Next.js

## Installation

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- Modern browser with Proxy support

### Setup

```bash
# Clone or navigate to this directory
cd 14-state-management/07-react-valtio

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "valtio": "^1.13.2"
  }
}
```

## Development

### Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

### Type Checking

```bash
npm run type-check
# or
yarn type-check
# or
pnpm type-check
```

### Linting

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Project Structure

```
07-react-valtio/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx        # Input form component
│   │   ├── TodoItem.tsx         # Individual todo item
│   │   ├── TodoList.tsx         # Todo list container
│   │   └── TodoFilters.tsx      # Filter and stats component
│   ├── store/
│   │   └── todoStore.ts         # Valtio store with proxy()
│   ├── types.ts                 # TypeScript definitions
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Application styles
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json           # TypeScript config for Node
├── vite.config.ts               # Vite configuration
└── README.md                    # This file
```

## Core Concepts

### Proxy-Based State

Valtio's foundation is JavaScript's Proxy API. When you create a proxy, Valtio wraps your state object:

```typescript
import { proxy } from 'valtio';

// Create a proxied state object
const state = proxy({
  todos: [],
  filter: 'all',
});

// The proxy tracks all changes
state.todos.push({ id: '1', text: 'Learn Valtio' }); // Tracked!
state.filter = 'active'; // Tracked!
```

#### How Proxies Work

```typescript
// Behind the scenes, Valtio does something like:
const handler = {
  get(target, property) {
    // Track that this property was accessed
    trackAccess(target, property);
    return target[property];
  },
  set(target, property, value) {
    // Track that this property was modified
    trackMutation(target, property, value);
    target[property] = value;
    notifySubscribers();
    return true;
  }
};

const proxyState = new Proxy(baseState, handler);
```

#### Nested Objects

Valtio automatically proxies nested objects:

```typescript
const state = proxy({
  user: {
    name: 'John',
    settings: {
      theme: 'dark',
    },
  },
});

// All levels are reactive
state.user.settings.theme = 'light'; // Works!
```

#### Array Operations

Valtio handles array mutations:

```typescript
const state = proxy({ items: [] });

// All these work and are tracked
state.items.push(newItem);
state.items.splice(index, 1);
state.items[0] = updatedItem;
state.items = state.items.filter(predicate);
```

### useSnapshot Hook

The `useSnapshot` hook is your primary way to read state in React components:

```typescript
import { useSnapshot } from 'valtio';
import { todoState } from './store/todoStore';

function TodoList() {
  // Get an immutable snapshot of the current state
  const snap = useSnapshot(todoState);

  // Access properties from the snapshot
  return <div>{snap.todos.length} todos</div>;
}
```

#### Snapshot Characteristics

1. **Immutable**: The snapshot is read-only
2. **Optimized**: Only tracked properties trigger re-renders
3. **Structural Sharing**: Unchanged parts are shared for performance

#### Fine-Grained Reactivity

Valtio only re-renders when accessed properties change:

```typescript
function Component() {
  const snap = useSnapshot(state);

  // Only re-renders when state.count changes
  // Changes to state.other won't trigger re-render
  return <div>{snap.count}</div>;
}
```

#### useSnapshot vs Direct Access

```typescript
// ❌ WRONG - Won't trigger re-renders
function Component() {
  return <div>{todoState.todos.length}</div>;
}

// ✅ CORRECT - Re-renders on changes
function Component() {
  const snap = useSnapshot(todoState);
  return <div>{snap.todos.length}</div>;
}
```

### Mutable Syntax with Immutable Behavior

This is Valtio's killer feature. You write mutable code, but it behaves immutably.

#### Before: Immutable Updates (Redux/Zustand Style)

```typescript
// Complex nested update
setState(state => ({
  ...state,
  user: {
    ...state.user,
    settings: {
      ...state.user.settings,
      theme: 'dark',
    },
  },
}));

// Array updates
setState(state => ({
  ...state,
  todos: [
    ...state.todos.slice(0, index),
    { ...state.todos[index], completed: true },
    ...state.todos.slice(index + 1),
  ],
}));
```

#### After: Valtio Style

```typescript
// Just mutate it!
state.user.settings.theme = 'dark';

// Array updates
state.todos[index].completed = true;
```

#### How It Works

1. **Write Trap**: Proxy intercepts assignments
2. **Copy on Write**: Creates a new version internally
3. **Structural Sharing**: Reuses unchanged parts
4. **Notify**: Updates all snapshots

```typescript
// Conceptual implementation
function proxy(target) {
  const versions = [target];

  return new Proxy(target, {
    set(target, prop, value) {
      // Create a new version
      const newVersion = { ...target, [prop]: value };
      versions.push(newVersion);

      // Notify subscribers
      notifyAll();

      return true;
    },
  });
}
```

### Derived State with derive()

The `derive()` function creates computed values that automatically update:

```typescript
import { proxy, derive } from 'valtio';

const state = proxy({
  todos: [],
});

// Derived values
const stats = derive({
  total: (get) => get(state).todos.length,
  active: (get) => get(state).todos.filter(t => !t.completed).length,
  completed: (get) => get(state).todos.filter(t => t.completed).length,
}, {
  proxy: state,
});
```

#### Using Derived State

```typescript
function Stats() {
  const snap = useSnapshot(stats);

  return (
    <div>
      <div>Total: {snap.total}</div>
      <div>Active: {snap.active}</div>
      <div>Completed: {snap.completed}</div>
    </div>
  );
}
```

#### Benefits of derive()

1. **Automatic Updates**: Recomputes when dependencies change
2. **Memoization**: Only recalculates when needed
3. **Type Safety**: Full TypeScript support
4. **Composable**: Can derive from other derived states

#### Alternative: Computed Functions

You can also use regular functions:

```typescript
function getStats(state) {
  return {
    total: state.todos.length,
    active: state.todos.filter(t => !t.completed).length,
  };
}

function Component() {
  const snap = useSnapshot(state);
  const stats = getStats(snap);

  return <div>{stats.total}</div>;
}
```

**When to use derive() vs functions:**
- Use `derive()` for expensive computations
- Use functions for simple transformations
- Use `derive()` when you want to share computed state

### State Persistence

Valtio's `subscribe()` function enables state persistence:

```typescript
import { proxy, subscribe } from 'valtio';

const state = proxy({
  todos: loadFromStorage(),
});

// Subscribe to all state changes
subscribe(state, () => {
  localStorage.setItem('todos', JSON.stringify(state.todos));
});
```

#### Subscription Features

```typescript
// Subscribe with options
const unsubscribe = subscribe(
  state,
  () => {
    console.log('State changed!');
  },
  {
    // Only trigger on these properties
    only: ['todos'],
  }
);

// Later: unsubscribe
unsubscribe();
```

#### Debouncing Saves

```typescript
import { debounce } from 'lodash';

const debouncedSave = debounce(() => {
  localStorage.setItem('todos', JSON.stringify(state.todos));
}, 500);

subscribe(state, debouncedSave);
```

## Implementation Details

### Store Architecture

Our store follows a modular pattern:

```typescript
// 1. Create the proxy state
export const todoState = proxy<TodoState>({
  todos: loadTodos(),
  filter: 'all',
});

// 2. Create derived state
export const todoStats = derive<TodoStats>({
  total: (get) => get(todoState).todos.length,
  active: (get) => get(todoState).todos.filter(t => !t.completed).length,
  completed: (get) => get(todoState).todos.filter(t => t.completed).length,
}, {
  proxy: todoState,
});

// 3. Define actions
export const todoActions = {
  addTodo: (text: string) => {
    todoState.todos.push({
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    });
  },

  toggleTodo: (id: string) => {
    const todo = todoState.todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
  },

  // ... more actions
};

// 4. Set up persistence
subscribe(todoState, () => {
  localStorage.setItem('todos', JSON.stringify(todoState.todos));
});
```

#### Design Decisions

1. **Separate Actions**: While not required, separating actions improves organization
2. **Derived Stats**: Using `derive()` for computed values avoids recalculation
3. **Type Safety**: Full TypeScript definitions for all entities
4. **Persistence**: Subscribe at module level for automatic saving

### Component Design

#### Reading State with useSnapshot

```typescript
// TodoList.tsx
import { useSnapshot } from 'valtio';
import { todoState, todoStats } from '../store/todoStore';

export const TodoList: React.FC = () => {
  const snap = useSnapshot(todoState);
  const stats = useSnapshot(todoStats);

  const filteredTodos = getFilteredTodos();

  return (
    <div>
      <div>Total: {stats.total}</div>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
```

#### Updating State Directly

```typescript
// TodoInput.tsx
import { todoActions } from '../store/todoStore';

export const TodoInput: React.FC = () => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      todoActions.addTodo(input); // Direct mutation!
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={e => setInput(e.target.value)} />
    </form>
  );
};
```

#### Component Optimization

Valtio's fine-grained reactivity means you rarely need React.memo:

```typescript
// This component only re-renders when its todo changes
function TodoItem({ todo }) {
  return <div>{todo.text}</div>;
}

// No need for:
// export default React.memo(TodoItem);
```

### Type Safety

Full TypeScript integration:

```typescript
// types.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

// Store is fully typed
export const todoState = proxy<TodoState>({
  todos: [],
  filter: 'all',
});

// Actions are typed
export const todoActions = {
  addTodo: (text: string): void => {
    // TypeScript knows the structure
    todoState.todos.push({
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    });
  },
};

// Snapshots are typed
function Component() {
  const snap = useSnapshot(todoState);
  // snap is typed as TodoState
  snap.todos; // Todo[]
  snap.filter; // FilterType
}
```

## Valtio vs Other State Management

### Valtio vs Redux

| Feature | Valtio | Redux |
|---------|--------|-------|
| **Boilerplate** | Minimal (no actions/reducers) | High (actions, reducers, constants) |
| **Mutability** | Mutable syntax, immutable behavior | Strictly immutable |
| **Learning Curve** | Low | High |
| **DevTools** | Supported | Excellent native support |
| **Middleware** | Limited | Extensive ecosystem |
| **Bundle Size** | ~3KB | ~12KB (with toolkit) |
| **TypeScript** | Excellent | Excellent |
| **Time Travel** | Supported | Excellent |

**Redux Example:**
```typescript
// Actions
const addTodo = (text: string) => ({
  type: 'ADD_TODO' as const,
  payload: { text },
});

// Reducer
function todosReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: uuid(), text: action.payload.text }];
    default:
      return state;
  }
}

// Usage
dispatch(addTodo('Learn Redux'));
```

**Valtio Example:**
```typescript
// Just mutate
todoState.todos.push({
  id: uuid(),
  text: 'Learn Valtio',
});
```

### Valtio vs Zustand

Both are minimal state libraries from the same creator (Poimandres), but with different approaches:

| Feature | Valtio | Zustand |
|---------|--------|---------|
| **Philosophy** | Proxy-based, mutable syntax | Function-based, immutable |
| **API Style** | Imperative mutations | Functional updates |
| **Learning** | Proxy behavior | Function patterns |
| **Size** | ~3KB | ~1KB |
| **Reactivity** | Automatic with proxies | Manual with selectors |

**Zustand Example:**
```typescript
const useStore = create((set) => ({
  todos: [],
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: uuid(), text }]
  })),
}));

function Component() {
  const todos = useStore((state) => state.todos);
  const addTodo = useStore((state) => state.addTodo);
}
```

**Valtio Example:**
```typescript
const state = proxy({ todos: [] });

function Component() {
  const snap = useSnapshot(state);
  // Just access and mutate
  state.todos.push({ id: uuid(), text: 'foo' });
}
```

**When to choose:**
- **Valtio**: If you prefer mutable-style syntax and automatic reactivity
- **Zustand**: If you prefer functional patterns and smaller bundle size

### Valtio vs MobX

Both use proxies/observables for reactivity:

| Feature | Valtio | MobX |
|---------|--------|------|
| **Core API** | Proxy-based | Observable-based |
| **Decorators** | No | Yes (optional) |
| **Classes** | Not idiomatic | First-class support |
| **Computed** | derive() function | @computed decorator |
| **Actions** | Optional pattern | @action decorator |
| **Bundle Size** | ~3KB | ~16KB |
| **Complexity** | Simple | Feature-rich but complex |

**MobX Example:**
```typescript
class TodoStore {
  @observable todos = [];

  @computed get stats() {
    return {
      total: this.todos.length,
      active: this.todos.filter(t => !t.completed).length,
    };
  }

  @action addTodo(text) {
    this.todos.push({ id: uuid(), text });
  }
}

const store = new TodoStore();
```

**Valtio Example:**
```typescript
const state = proxy({ todos: [] });

const stats = derive({
  total: (get) => get(state).todos.length,
  active: (get) => get(state).todos.filter(t => !t.completed).length,
});

// Just mutate
state.todos.push({ id: uuid(), text: 'foo' });
```

**When to choose:**
- **Valtio**: Simpler API, smaller size, modern approach
- **MobX**: Need class-based stores, complex computed dependencies

### Valtio vs Jotai

Jotai is an atomic state library (like Recoil):

| Feature | Valtio | Jotai |
|---------|--------|-------|
| **Model** | Proxy-based store | Atomic values |
| **Granularity** | Object properties | Individual atoms |
| **API** | Global state | Hooks-based |
| **Derived** | derive() | Derived atoms |
| **Suspense** | Not built-in | First-class |

**Jotai Example:**
```typescript
const todosAtom = atom([]);
const statsAtom = atom((get) => {
  const todos = get(todosAtom);
  return {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
  };
});

function Component() {
  const [todos, setTodos] = useAtom(todosAtom);
  const stats = useAtomValue(statsAtom);
}
```

**Valtio Example:**
```typescript
const state = proxy({ todos: [] });
const stats = derive({
  total: (get) => get(state).todos.length,
});

function Component() {
  const snap = useSnapshot(state);
  const statsSnap = useSnapshot(stats);
}
```

**When to choose:**
- **Valtio**: Object-oriented state, simpler mental model
- **Jotai**: Need atomic updates, Suspense integration, React Concurrent features

### Valtio vs Immer

Immer provides immutable updates with mutable syntax:

| Feature | Valtio | Immer |
|---------|--------|-------|
| **Purpose** | Complete state management | Immutability helper |
| **React Integration** | Built-in hooks | Requires wrapper |
| **Automatic Tracking** | Yes | No (manual produce calls) |
| **Usage** | Standalone | Usually with Redux/Zustand |

**Immer Example:**
```typescript
import produce from 'immer';

const nextState = produce(state, draft => {
  draft.todos.push({ id: uuid(), text: 'foo' });
});

setState(nextState);
```

**Valtio Example:**
```typescript
// No wrapper needed
state.todos.push({ id: uuid(), text: 'foo' });
// That's it!
```

**When to choose:**
- **Valtio**: Want complete state management with reactivity
- **Immer**: Just need immutability helper for existing solution

## Advanced Patterns

### Modular Stores

Split your state across multiple stores:

```typescript
// userStore.ts
export const userState = proxy({
  name: '',
  email: '',
});

// todoStore.ts
export const todoState = proxy({
  todos: [],
});

// Use together
function App() {
  const user = useSnapshot(userState);
  const todos = useSnapshot(todoState);

  return <div>{user.name} has {todos.todos.length} todos</div>;
}
```

### Async Actions

Handle async operations naturally:

```typescript
export const todoActions = {
  async fetchTodos() {
    try {
      const response = await fetch('/api/todos');
      const todos = await response.json();

      // Direct mutation after async
      todoState.todos = todos;
    } catch (error) {
      todoState.error = error.message;
    }
  },

  async saveTodo(todo: Todo) {
    // Optimistic update
    todoState.todos.push(todo);

    try {
      await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
      });
    } catch (error) {
      // Rollback on error
      todoState.todos = todoState.todos.filter(t => t.id !== todo.id);
      alert('Failed to save todo');
    }
  },
};
```

### Middleware Pattern

Create reusable state behaviors:

```typescript
function withLocalStorage(state, key) {
  // Load initial state
  const stored = localStorage.getItem(key);
  if (stored) {
    Object.assign(state, JSON.parse(stored));
  }

  // Save on changes
  subscribe(state, () => {
    localStorage.setItem(key, JSON.stringify(state));
  });

  return state;
}

// Usage
const todoState = withLocalStorage(
  proxy({ todos: [] }),
  'todos'
);
```

### Computed Dependencies

Chain derived values:

```typescript
const state = proxy({
  items: [],
  filter: 'all',
});

// First level derivation
const filteredItems = derive({
  items: (get) => {
    const { items, filter } = get(state);
    return filter === 'all'
      ? items
      : items.filter(item => item.status === filter);
  },
});

// Second level derivation
const stats = derive({
  count: (get) => get(filteredItems).items.length,
  firstItem: (get) => get(filteredItems).items[0],
});
```

### Undo/Redo

Implement time travel:

```typescript
const history = proxy({
  past: [],
  present: { todos: [] },
  future: [],
});

const todoActions = {
  addTodo(text) {
    history.past.push(history.present);
    history.present = {
      todos: [...history.present.todos, { id: uuid(), text }],
    };
    history.future = [];
  },

  undo() {
    if (history.past.length === 0) return;

    history.future.unshift(history.present);
    history.present = history.past.pop();
  },

  redo() {
    if (history.future.length === 0) return;

    history.past.push(history.present);
    history.present = history.future.shift();
  },
};
```

## Performance Optimization

### Fine-Grained Subscriptions

Valtio only re-renders when accessed properties change:

```typescript
function Component() {
  const snap = useSnapshot(state);

  // Only re-renders when state.count changes
  // Changes to state.todos won't trigger re-render
  return <div>{snap.count}</div>;
}
```

### Avoid Unnecessary Snapshots

```typescript
// ❌ BAD - Creates unnecessary snapshot
function Component() {
  const snap = useSnapshot(state);

  return (
    <button onClick={() => state.count++}>
      Increment
    </button>
  );
}

// ✅ GOOD - No snapshot needed for write-only
function Component() {
  return (
    <button onClick={() => state.count++}>
      Increment
    </button>
  );
}
```

### Batch Updates

Valtio automatically batches updates in event handlers:

```typescript
function handleUpdate() {
  // These are batched into a single re-render
  state.name = 'John';
  state.age = 30;
  state.email = 'john@example.com';
}
```

### Use devtools for Debugging

```typescript
import { devtools } from 'valtio/utils';

devtools(todoState, { name: 'Todo Store', enabled: true });
```

## Testing

### Unit Testing Stores

```typescript
import { todoState, todoActions } from './todoStore';

describe('Todo Store', () => {
  beforeEach(() => {
    // Reset state
    todoState.todos = [];
  });

  test('adds todo', () => {
    todoActions.addTodo('Test todo');

    expect(todoState.todos).toHaveLength(1);
    expect(todoState.todos[0].text).toBe('Test todo');
  });

  test('toggles todo', () => {
    todoActions.addTodo('Test todo');
    const id = todoState.todos[0].id;

    todoActions.toggleTodo(id);

    expect(todoState.todos[0].completed).toBe(true);
  });
});
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { todoState } from '../store/todoStore';

describe('TodoList', () => {
  beforeEach(() => {
    todoState.todos = [];
  });

  test('renders empty state', () => {
    render(<TodoList />);
    expect(screen.getByText(/no todos/i)).toBeInTheDocument();
  });

  test('renders todos', () => {
    todoState.todos = [
      { id: '1', text: 'Test', completed: false, createdAt: Date.now() },
    ];

    render(<TodoList />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Mocking for Tests

```typescript
// testUtils.ts
export function createTestState() {
  return proxy({
    todos: [],
    filter: 'all',
  });
}

// test file
const testState = createTestState();
```

## When to Use Valtio

### Ideal Use Cases

1. **Rapid Prototyping**: Minimal setup, quick iterations
2. **Small to Medium Apps**: Simple state without excessive boilerplate
3. **Migrating from MobX**: Similar mental model
4. **Forms and UI State**: Natural mutable-style updates
5. **Real-time Applications**: Easy to update from WebSocket events

### Consider Alternatives When

1. **Time-Travel Debugging Critical**: Redux has better tooling
2. **Large Team with Redux Experience**: Switching cost may not justify
3. **Complex Middleware Needs**: Redux ecosystem is more mature
4. **IE11 Support Required**: Valtio requires Proxy support
5. **Atomic State Management**: Jotai/Recoil might be better

## Best Practices

### 1. Organize State Logically

```typescript
// ✅ GOOD - Separate concerns
const uiState = proxy({ sidebarOpen: false, theme: 'light' });
const dataState = proxy({ todos: [], users: [] });

// ❌ BAD - Everything in one
const state = proxy({ sidebarOpen: false, todos: [], theme: 'light' });
```

### 2. Use derive() for Expensive Computations

```typescript
// ✅ GOOD - Memoized with derive()
const stats = derive({
  total: (get) => expensiveCalculation(get(state).items),
});

// ❌ BAD - Recalculates every render
function Component() {
  const snap = useSnapshot(state);
  const total = expensiveCalculation(snap.items); // Expensive!
}
```

### 3. Keep Actions Separate

```typescript
// ✅ GOOD - Organized actions
export const todoActions = {
  addTodo: (text) => { /* ... */ },
  toggleTodo: (id) => { /* ... */ },
};

// ❌ BAD - Scattered mutations
function Component() {
  const handleClick = () => {
    state.todos.push({ /* ... */ }); // Direct mutation in component
  };
}
```

### 4. Type Everything

```typescript
// ✅ GOOD - Full typing
interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

const state = proxy<TodoState>({ /* ... */ });

// ❌ BAD - No types
const state = proxy({ todos: [], filter: 'all' });
```

### 5. Use subscribe() for Side Effects

```typescript
// ✅ GOOD - Centralized side effects
subscribe(state, () => {
  localStorage.setItem('state', JSON.stringify(state));
});

// ❌ BAD - Side effects scattered
function Component() {
  const snap = useSnapshot(state);
  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(snap));
  }, [snap]);
}
```

## Troubleshooting

### Snapshots Not Updating

**Problem**: Component doesn't re-render on state changes

```typescript
// ❌ WRONG - Direct state access
function Component() {
  return <div>{state.count}</div>;
}

// ✅ CORRECT - Use snapshot
function Component() {
  const snap = useSnapshot(state);
  return <div>{snap.count}</div>;
}
```

### Can't Mutate Snapshot

**Problem**: Trying to mutate the snapshot

```typescript
// ❌ WRONG - Snapshots are immutable
const snap = useSnapshot(state);
snap.todos.push({ /* ... */ }); // Error!

// ✅ CORRECT - Mutate the original state
state.todos.push({ /* ... */ });
```

### Lost Reactivity

**Problem**: Destructuring breaks reactivity

```typescript
// ❌ WRONG - Loses proxy tracking
const snap = useSnapshot(state);
const { todos } = snap; // Loses reactivity

// ✅ CORRECT - Access properties directly
const snap = useSnapshot(state);
return <div>{snap.todos.length}</div>;
```

### Proxy Errors in SSR

**Problem**: Proxy not available in Node.js

```typescript
// ✅ Solution - Use conditional initialization
const state = typeof window !== 'undefined'
  ? proxy({ todos: [] })
  : { todos: [] };
```

## Resources

### Official Documentation

- [Valtio GitHub](https://github.com/pmndrs/valtio)
- [Valtio Documentation](https://valtio.pmnd.rs/)
- [Poimandres](https://pmnd.rs/) - Creator organization

### Tutorials and Guides

- [Valtio Guide by Daishi Kato](https://blog.axlight.com/posts/valtio-guide/)
- [React State Management in 2024](https://kentcdodds.com/blog/application-state-management)

### Video Resources

- [Valtio Tutorial by Jack Herrington](https://www.youtube.com/watch?v=OLEQuZz-fxs)
- [State Management Comparison](https://www.youtube.com/watch?v=x5O3b9c-3No)

### Community

- [Discord Server](https://discord.gg/poimandres)
- [Twitter: @dai_shi](https://twitter.com/dai_shi) - Creator

### Related Libraries

- [Zustand](https://github.com/pmndrs/zustand) - Sister library
- [Jotai](https://github.com/pmndrs/jotai) - Atomic state management
- [Immer](https://immerjs.github.io/immer/) - Immutability helper

## License

MIT

## Author

Created as part of the TodoListDemo project showcasing various state management approaches in modern web applications.

---

**Note**: This implementation is optimized for learning and demonstration purposes. For production use, consider adding error boundaries, loading states, error handling, and comprehensive testing.
