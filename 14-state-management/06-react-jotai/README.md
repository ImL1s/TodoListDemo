# React + Jotai Todo List

A complete Todo List application demonstrating **Jotai**, a primitive and flexible state management library for React with an atomic approach.

## Table of Contents

- [Introduction](#introduction)
- [What is Jotai?](#what-is-jotai)
- [Jotai Philosophy](#jotai-philosophy)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
  - [Primitive Atoms](#primitive-atoms)
  - [Derived Atoms](#derived-atoms)
  - [Write-only Atoms](#write-only-atoms)
  - [Atom Families](#atom-families)
  - [atomWithStorage](#atomwithstorage)
- [Jotai Hooks](#jotai-hooks)
- [Architecture](#architecture)
- [No Provider Needed](#no-provider-needed)
- [Bottom-up vs Top-down](#bottom-up-vs-top-down)
- [Comparisons](#comparisons)
  - [Jotai vs Recoil](#jotai-vs-recoil)
  - [Jotai vs Zustand](#jotai-vs-zustand)
  - [Jotai vs Redux](#jotai-vs-redux)
  - [Jotai vs Context](#jotai-vs-context)
- [Performance](#performance)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)
- [Advanced Patterns](#advanced-patterns)
- [Testing](#testing)
- [Debugging](#debugging)
- [Migration Guide](#migration-guide)
- [Resources](#resources)

## Introduction

This project demonstrates a production-ready Todo List application built with **React** and **Jotai**. It showcases Jotai's primitive atomic approach to state management, emphasizing simplicity, flexibility, and performance.

### Why This Project?

- **Learn by Example**: See Jotai's features in a real application
- **Best Practices**: Production-ready code with proper TypeScript typing
- **Comprehensive**: Covers basic to advanced Jotai patterns
- **Comparisons**: Understand how Jotai differs from other solutions
- **Performance**: Demonstrates optimization techniques

## What is Jotai?

**Jotai** (pronounced "joe-tie", meaning "state" in Japanese) is a primitive and flexible state management library for React. It takes an **atomic approach** to global React state management, inspired by Recoil but with a simpler API and smaller bundle size.

### Core Philosophy

```
Build state by combining atoms and renders are automatically optimized based on atom dependency
```

Key principles:
1. **Primitive**: Atoms are the building blocks
2. **Flexible**: Bottom-up composition
3. **TypeScript-first**: Excellent type inference
4. **No string keys**: Unlike Recoil, no need for unique keys
5. **No Provider**: Works out of the box (Provider is optional)

### Bundle Size

- **Jotai**: ~3KB gzipped
- **Recoil**: ~14KB gzipped
- **Zustand**: ~1.2KB gzipped
- **Redux Toolkit**: ~17KB gzipped

## Jotai Philosophy

### Atomic State Management

Jotai follows the atomic state management pattern:

```typescript
// Instead of a single large store (Redux, Zustand)
const store = {
  todos: [],
  filter: 'all',
  user: {},
  settings: {}
}

// Break state into independent atoms (Jotai, Recoil)
const todosAtom = atom([])
const filterAtom = atom('all')
const userAtom = atom({})
const settingsAtom = atom({})
```

**Benefits:**
- **Fine-grained updates**: Only components using changed atoms re-render
- **Composability**: Combine atoms to create derived state
- **Modularity**: Each atom is independent and reusable
- **Scalability**: Add new atoms without affecting existing ones

### Primitive First

Jotai embraces primitives over abstractions:

```typescript
// Simple primitive atom
const countAtom = atom(0)

// That's it! No configuration, no setup, no keys
```

Compare with Recoil:
```typescript
// Recoil requires configuration
const countState = atom({
  key: 'countState', // Must be unique
  default: 0
})
```

### Bottom-up Approach

Jotai encourages building state from the bottom up:

1. **Start with primitive atoms** (smallest pieces of state)
2. **Compose derived atoms** (combine primitives)
3. **Build features** (use atoms in components)

```typescript
// 1. Primitives
const todosAtom = atom([])
const filterAtom = atom('all')

// 2. Derived (compose primitives)
const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom)
  const filter = get(filterAtom)
  return filterTodos(todos, filter)
})

// 3. Use in components
function TodoList() {
  const todos = useAtomValue(filteredTodosAtom)
  return <div>{todos.map(renderTodo)}</div>
}
```

## Key Features

### 1. Primitive Atoms

The foundation of Jotai - simple, atomic state:

```typescript
import { atom } from 'jotai'

const countAtom = atom(0)
const nameAtom = atom('John')
const todosAtom = atom([])
```

### 2. Derived Atoms (Computed Values)

Automatically computed values based on other atoms:

```typescript
const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom)
  const filter = get(filterAtom)
  return todos.filter(/* filter logic */)
})
```

### 3. No Provider Required

Unlike Recoil or Redux, no wrapper needed:

```tsx
// Just use it!
function App() {
  return <TodoList />
}

// Not needed:
// <RecoilRoot><App /></RecoilRoot>
// <Provider store={store}><App /></Provider>
```

### 4. Built-in Utilities

Jotai includes useful utilities out of the box:

```typescript
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai/utils'

// Automatic localStorage persistence
const todosAtom = atomWithStorage('todos', [])

// Dynamic atom creation
const todoAtomFamily = atomFamily((id) => atom(...))
```

### 5. TypeScript-First

Excellent TypeScript support with automatic type inference:

```typescript
const countAtom = atom(0) // Type: PrimitiveAtom<number>
const doubleAtom = atom((get) => get(countAtom) * 2) // Type: Atom<number>
```

## Installation

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- React 18+
- TypeScript 5+ (optional but recommended)

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Dependencies

This project uses:

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **jotai**: ^2.6.0

Dev dependencies:

- **typescript**: ^5.3.3
- **vite**: ^5.0.8
- **@vitejs/plugin-react**: ^4.2.1

## Quick Start

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

### Type Check

Run TypeScript type checking:

```bash
npm run type-check
```

## Project Structure

```
06-react-jotai/
├── src/
│   ├── atoms/
│   │   └── todoAtoms.ts          # All Jotai atoms (state)
│   ├── components/
│   │   ├── TodoInput.tsx          # Add new todos
│   │   ├── TodoItem.tsx           # Individual todo item
│   │   ├── TodoList.tsx           # List of todos
│   │   └── TodoFilters.tsx        # Filter controls
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # Styles
│   ├── main.tsx                   # Entry point
│   └── types.ts                   # TypeScript types
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
└── README.md                      # This file
```

### File Organization

**Atoms Directory (`src/atoms/`)**:
- Contains all Jotai atoms
- Primitive atoms (data)
- Derived atoms (computed values)
- Action atoms (write-only)
- Atom families (dynamic atoms)

**Components Directory (`src/components/`)**:
- Pure React components
- Use Jotai hooks to access atoms
- No business logic (logic is in atoms)

## Core Concepts

### Primitive Atoms

Primitive atoms are the foundation of Jotai. They hold a piece of state.

#### Creating Primitive Atoms

```typescript
import { atom } from 'jotai'

// Simple value atom
const countAtom = atom(0)

// Object atom
const userAtom = atom({ name: 'John', age: 30 })

// Array atom
const todosAtom = atom([])
```

#### Using Primitive Atoms

```typescript
import { useAtom } from 'jotai'

function Counter() {
  const [count, setCount] = useAtom(countAtom)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

**Key Points:**
- No unique key needed (unlike Recoil)
- Type is automatically inferred
- Can be used in any component
- Updates only affect components using that atom

### Derived Atoms

Derived atoms compute values based on other atoms.

#### Read-only Derived Atoms

```typescript
// Derived atom (read-only)
const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom)
  const filter = get(filterAtom)

  if (filter === 'active') {
    return todos.filter(t => !t.completed)
  }
  if (filter === 'completed') {
    return todos.filter(t => t.completed)
  }
  return todos
})
```

**How it works:**
1. Pass a getter function to `atom()`
2. Use `get()` to read other atoms
3. Return the computed value
4. Automatically updates when dependencies change
5. Result is memoized

#### Read-write Derived Atoms

```typescript
const upperCaseAtom = atom(
  (get) => get(textAtom).toUpperCase(), // read
  (get, set, newText: string) => {      // write
    set(textAtom, newText.toLowerCase())
  }
)
```

### Write-only Atoms

Write-only atoms are perfect for actions:

```typescript
const addTodoAtom = atom(
  null, // read returns null
  (get, set, text: string) => {
    const newTodo = { id: Date.now(), text, completed: false }
    set(todosAtom, [...get(todosAtom), newTodo])
  }
)

// Usage
function AddTodo() {
  const addTodo = useSetAtom(addTodoAtom)

  const handleSubmit = (text: string) => {
    addTodo(text)
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

**Benefits:**
- Clear intent (this is an action, not data)
- Component doesn't re-render (useSetAtom doesn't subscribe)
- Similar to Redux actions, but simpler
- No separate action creators needed

### Atom Families

Atom families create atoms dynamically:

```typescript
import { atomFamily } from 'jotai/utils'

const todoAtomFamily = atomFamily((id: string) =>
  atom(
    (get) => get(todosAtom).find(t => t.id === id),
    (get, set, update: Partial<Todo>) => {
      set(todosAtom, get(todosAtom).map(todo =>
        todo.id === id ? { ...todo, ...update } : todo
      ))
    }
  )
)

// Usage - each todo gets its own atom
function TodoItem({ id }: { id: string }) {
  const [todo, updateTodo] = useAtom(todoAtomFamily(id))

  return (
    <div>
      <span>{todo.text}</span>
      <button onClick={() => updateTodo({ completed: true })}>
        Complete
      </button>
    </div>
  )
}
```

**When to use:**
- Large lists where each item should have its own atom
- Maximum performance (only changed items re-render)
- Dynamic entities (users, posts, etc.)

### atomWithStorage

Built-in localStorage persistence:

```typescript
import { atomWithStorage } from 'jotai/utils'

// Automatically syncs with localStorage
const todosAtom = atomWithStorage<Todo[]>('todos', [])

// That's it! No effects needed
```

**How it works:**
1. Reads initial value from localStorage
2. Updates localStorage when atom changes
3. Handles JSON serialization automatically
4. Supports sessionStorage and custom storage

**Custom storage:**

```typescript
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const storage = createJSONStorage(() => sessionStorage)
const todosAtom = atomWithStorage('todos', [], storage)
```

**Compare with Recoil:**

```typescript
// Recoil - more verbose
const todosState = atom({
  key: 'todos',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      // Load from localStorage
      const saved = localStorage.getItem('todos')
      if (saved) setSelf(JSON.parse(saved))

      // Save to localStorage
      onSet((newValue) => {
        localStorage.setItem('todos', JSON.stringify(newValue))
      })
    }
  ]
})

// Jotai - one line
const todosAtom = atomWithStorage('todos', [])
```

## Jotai Hooks

Jotai provides three main hooks:

### useAtom

Read and write atom value (like useState):

```typescript
const [value, setValue] = useAtom(someAtom)
```

- Component re-renders when atom changes
- Use for read-write access
- Most common hook

### useAtomValue

Read-only access:

```typescript
const value = useAtomValue(someAtom)
```

- Component re-renders when atom changes
- Use when you only need to read
- Clearer intent than `const [value] = useAtom(atom)`

### useSetAtom

Write-only access:

```typescript
const setValue = useSetAtom(someAtom)
```

- Component does NOT re-render when atom changes
- Use for actions and updates
- Performance optimization

### Choosing the Right Hook

```typescript
// Need both read and write?
const [todos, setTodos] = useAtom(todosAtom)

// Only need to read?
const todos = useAtomValue(todosAtom)

// Only need to write?
const addTodo = useSetAtom(addTodoAtom)
```

## Architecture

### State Organization

This project follows a clear separation:

1. **Atoms** (`src/atoms/`): All state and logic
2. **Components** (`src/components/`): Pure UI with Jotai hooks
3. **Types** (`src/types.ts`): TypeScript definitions

### Atom Organization

```typescript
// src/atoms/todoAtoms.ts

// 1. Primitive atoms (data)
export const todosAtom = atomWithStorage('todos', [])
export const filterAtom = atom('all')

// 2. Derived atoms (computed)
export const filteredTodosAtom = atom((get) => /* ... */)
export const todoStatsAtom = atom((get) => /* ... */)

// 3. Action atoms (write-only)
export const addTodoAtom = atom(null, (get, set, text) => /* ... */)
export const toggleTodoAtom = atom(null, (get, set, id) => /* ... */)

// 4. Atom families (dynamic)
export const todoAtomFamily = atomFamily((id) => /* ... */)
```

### Data Flow

```
User Action
    ↓
Component calls useSetAtom(actionAtom)
    ↓
Action atom updates primitive atoms
    ↓
Derived atoms recalculate (if they depend on changed atoms)
    ↓
Components using changed atoms re-render
    ↓
UI updates
```

**Example flow:**

1. User clicks "Add Todo"
2. Component calls `addTodo(text)`
3. `addTodoAtom` updates `todosAtom`
4. `filteredTodosAtom` recalculates (depends on `todosAtom`)
5. `todoStatsAtom` recalculates (depends on `todosAtom`)
6. `TodoList` component re-renders (uses `filteredTodosAtom`)
7. Stats display re-renders (uses `todoStatsAtom`)

## No Provider Needed

One of Jotai's biggest advantages: **no Provider wrapper required**.

### How It Works

```typescript
// main.tsx - No Provider!
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

Compare with other libraries:

```typescript
// ❌ Recoil requires RecoilRoot
<RecoilRoot>
  <App />
</RecoilRoot>

// ❌ Redux requires Provider
<Provider store={store}>
  <App />
</Provider>

// ✅ Jotai needs nothing
<App />
```

### Internal Mechanism

Jotai atoms use a global registry:

1. First `useAtom(myAtom)` call creates the atom instance
2. Instance is stored in a global WeakMap
3. All subsequent calls use the same instance
4. When no components use the atom, it's garbage collected

### Optional Provider

Jotai does support an optional Provider for specific use cases:

```typescript
import { Provider } from 'jotai'

<Provider>
  <App />
</Provider>
```

**When to use Provider:**
- **Server-side rendering**: Isolate state per request
- **Testing**: Clean state between tests
- **Multiple independent trees**: Different state for different parts of the app

For most applications, you don't need it!

## Bottom-up vs Top-down

### Bottom-up (Jotai, Recoil)

Start with small atoms, compose into larger ones:

```typescript
// 1. Start with primitives
const firstNameAtom = atom('John')
const lastNameAtom = atom('Doe')

// 2. Compose derived atoms
const fullNameAtom = atom((get) => {
  return `${get(firstNameAtom)} ${get(lastNameAtom)}`
})

// 3. Further composition
const greetingAtom = atom((get) => {
  return `Hello, ${get(fullNameAtom)}!`
})
```

**Benefits:**
- Natural composition
- Easy to add new derived state
- Automatic dependency tracking
- Fine-grained updates

### Top-down (Redux, Zustand)

Start with a large store, split if needed:

```typescript
// 1. Start with everything in one place
const useStore = create((set, get) => ({
  firstName: 'John',
  lastName: 'Doe',

  // Computed values need manual implementation
  getFullName: () => {
    const { firstName, lastName } = get()
    return `${firstName} ${lastName}`
  },

  // All updates in one place
  setFirstName: (name) => set({ firstName: name })
}))
```

**Benefits:**
- All state in one place
- Easier to see the big picture
- Can use outside React
- Simpler for small apps

### Which Approach?

**Use Bottom-up (Jotai) when:**
- App has complex derived state
- Need fine-grained updates
- Building feature-by-feature
- Team prefers composition

**Use Top-down (Zustand/Redux) when:**
- App has simple state
- Need to use state outside React
- Team prefers centralization
- Migrating from Redux

## Comparisons

### Jotai vs Recoil

Jotai is heavily inspired by Recoil but improves on several aspects.

#### Similarities

- Both use atomic state approach
- Both support derived atoms/selectors
- Both have minimal re-renders
- Both work great with React Suspense

#### Differences

| Feature | Jotai | Recoil |
|---------|-------|--------|
| **Provider** | Optional | Required (RecoilRoot) |
| **Atom Keys** | Not needed | Required (must be unique) |
| **API** | `atom()` for everything | Separate `atom()` and `selector()` |
| **Bundle Size** | ~3KB | ~14KB |
| **TypeScript** | Excellent inference | More verbose |
| **Persistence** | Built-in `atomWithStorage` | Manual with effects |
| **Maturity** | Newer (2020) | Older (2020, Facebook) |
| **Production Ready** | Yes | "Experimental" (but widely used) |

#### Code Comparison

**Jotai:**
```typescript
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const todosAtom = atomWithStorage('todos', [])
const filterAtom = atom('all')

const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom)
  const filter = get(filterAtom)
  return filterTodos(todos, filter)
})
```

**Recoil:**
```typescript
import { atom, selector } from 'recoil'

const todosState = atom({
  key: 'todosState',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      const saved = localStorage.getItem('todos')
      if (saved) setSelf(JSON.parse(saved))
      onSet((newValue) => {
        localStorage.setItem('todos', JSON.stringify(newValue))
      })
    }
  ]
})

const filterState = atom({
  key: 'filterState',
  default: 'all'
})

const filteredTodosState = selector({
  key: 'filteredTodosState',
  get: ({ get }) => {
    const todos = get(todosState)
    const filter = get(filterState)
    return filterTodos(todos, filter)
  }
})
```

#### When to Choose Jotai over Recoil

- Prefer simpler API
- Want smaller bundle size
- Don't want to manage unique keys
- Need better TypeScript inference
- Want built-in localStorage support

#### When to Choose Recoil over Jotai

- Already using Recoil (migration cost)
- Need Facebook's backing (though experimental)
- Team familiar with Recoil
- Specific Recoil features (atom effects, snapshot hooks)

### Jotai vs Zustand

Both are minimal and modern, but different philosophies.

#### Approach

**Jotai**: Bottom-up, atomic, React-focused
**Zustand**: Top-down, single store, framework-agnostic

#### Code Comparison

**Jotai:**
```typescript
// Atoms
const todosAtom = atom([])
const filterAtom = atom('all')

// Component
function TodoList() {
  const todos = useAtomValue(todosAtom)
  const filter = useAtomValue(filterAtom)
  const filtered = useMemo(() => filterTodos(todos, filter), [todos, filter])
  return <div>{filtered.map(renderTodo)}</div>
}
```

**Zustand:**
```typescript
// Store
const useTodoStore = create((set, get) => ({
  todos: [],
  filter: 'all',
  filteredTodos: () => {
    const { todos, filter } = get()
    return filterTodos(todos, filter)
  }
}))

// Component
function TodoList() {
  const filtered = useTodoStore((state) => state.filteredTodos())
  return <div>{filtered.map(renderTodo)}</div>
}
```

#### Comparison Table

| Feature | Jotai | Zustand |
|---------|-------|---------|
| **Approach** | Bottom-up (atoms) | Top-down (store) |
| **State** | Distributed | Centralized |
| **Re-renders** | Automatic (atomic) | Manual (selectors) |
| **Outside React** | No | Yes |
| **Derived State** | Built-in (derived atoms) | Manual (functions) |
| **Bundle Size** | ~3KB | ~1.2KB |
| **Learning Curve** | Medium | Low |

#### When to Choose Jotai over Zustand

- Complex derived state
- Need automatic dependencies
- Prefer composition over centralization
- Building feature-by-feature
- Only need state in React

#### When to Choose Zustand over Jotai

- Simple global state
- Need to use outside React
- Prefer centralized store
- Migrating from Redux
- Want smallest bundle

### Jotai vs Redux

Jotai is a modern alternative to Redux with much less boilerplate.

#### Code Comparison

**Adding a todo in Redux:**

```typescript
// 1. Define action types
const ADD_TODO = 'ADD_TODO'

// 2. Create action creator
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
})

// 3. Write reducer
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload]
    default:
      return state
  }
}

// 4. Create store
const store = createStore(combineReducers({ todos: todosReducer }))

// 5. Provide store
<Provider store={store}><App /></Provider>

// 6. Use in component
const dispatch = useDispatch()
const todos = useSelector(state => state.todos)
const handleAdd = (text) => dispatch(addTodo(text))
```

**Same thing in Jotai:**

```typescript
// 1. Create atoms
const todosAtom = atom([])
const addTodoAtom = atom(null, (get, set, text: string) => {
  const newTodo = { id: Date.now(), text, completed: false }
  set(todosAtom, [...get(todosAtom), newTodo])
})

// 2. Use in component
const todos = useAtomValue(todosAtom)
const addTodo = useSetAtom(addTodoAtom)
const handleAdd = (text) => addTodo(text)
```

#### Comparison Table

| Feature | Jotai | Redux |
|---------|-------|-------|
| **Boilerplate** | Minimal | Significant |
| **Actions** | Atoms (write-only) | Action creators |
| **Reducers** | Not needed | Required |
| **Middleware** | Not needed | For async |
| **DevTools** | Simple | Excellent (time-travel) |
| **Learning Curve** | Low | High |
| **Async** | Built-in | Need middleware |

#### When to Choose Jotai over Redux

- Starting new project
- Want less boilerplate
- Don't need time-travel debugging
- Prefer React-first solution
- Want built-in async support

#### When to Choose Redux over Jotai

- Large existing Redux codebase
- Need Redux DevTools time-travel
- Team expertise in Redux
- Need middleware ecosystem
- Strict unidirectional data flow requirement

### Jotai vs Context

React Context is built-in but has limitations.

#### Problems with Context

```typescript
// ❌ All consumers re-render when ANY value changes
const TodoContext = createContext({ todos: [], filter: 'all' })

function TodoList() {
  // Re-renders even if only filter changed
  const { todos } = useContext(TodoContext)
  return <div>{todos.map(renderTodo)}</div>
}

function TodoFilters() {
  // Re-renders even if only todos changed
  const { filter, setFilter } = useContext(TodoContext)
  return <select value={filter} onChange={setFilter}>...</select>
}
```

#### Solution with Jotai

```typescript
// ✅ Fine-grained updates
const todosAtom = atom([])
const filterAtom = atom('all')

function TodoList() {
  // Only re-renders when todos change
  const todos = useAtomValue(todosAtom)
  return <div>{todos.map(renderTodo)}</div>
}

function TodoFilters() {
  // Only re-renders when filter changes
  const [filter, setFilter] = useAtom(filterAtom)
  return <select value={filter} onChange={setFilter}>...</select>
}
```

#### Comparison Table

| Feature | Jotai | Context |
|---------|-------|---------|
| **Re-renders** | Fine-grained | All consumers |
| **Derived State** | Built-in | Manual (useMemo) |
| **Composition** | Easy | Multiple Providers |
| **Performance** | Excellent | Poor (without optimization) |
| **API** | Simple | Simple |
| **Bundle Size** | +3KB | Built-in |

#### When to Choose Jotai over Context

- Need fine-grained updates
- Have complex derived state
- Performance is important
- Multiple pieces of global state

#### When to Use Context

- Simple theme/locale
- Dependency injection
- Truly global config (doesn't change)
- Want zero dependencies

## Performance

Jotai provides excellent performance out of the box.

### Fine-grained Reactivity

Only components using changed atoms re-render:

```typescript
const countAtom = atom(0)
const nameAtom = atom('John')

function Counter() {
  const count = useAtomValue(countAtom)
  console.log('Counter rendered')
  return <div>{count}</div>
}

function Name() {
  const name = useAtomValue(nameAtom)
  console.log('Name rendered')
  return <div>{name}</div>
}

// Updating countAtom only logs "Counter rendered"
// Name component doesn't re-render
```

### Derived Atoms are Memoized

Computed values only recalculate when dependencies change:

```typescript
const expensiveAtom = atom((get) => {
  const data = get(dataAtom)
  console.log('Computing expensive value...')
  return expensiveComputation(data)
})

// "Computing expensive value..." only logs when dataAtom changes
// Not on every render
```

### Write-only Atoms Don't Cause Re-renders

Use `useSetAtom` for actions:

```typescript
function AddTodo() {
  // This component NEVER re-renders due to todo changes
  const addTodo = useSetAtom(addTodoAtom)

  return <button onClick={() => addTodo('New todo')}>Add</button>
}
```

### Optimization Tips

1. **Use write-only atoms for actions:**
   ```typescript
   const addTodo = useSetAtom(addTodoAtom) // ✅ No re-renders
   const [todos, setTodos] = useAtom(todosAtom) // ❌ Re-renders
   ```

2. **Split large atoms:**
   ```typescript
   // ❌ Bad: One large atom
   const appStateAtom = atom({ todos, filter, user, settings })

   // ✅ Good: Separate atoms
   const todosAtom = atom([])
   const filterAtom = atom('all')
   const userAtom = atom({})
   const settingsAtom = atom({})
   ```

3. **Use atom families for lists:**
   ```typescript
   // ✅ Best: Each item has its own atom
   const todoAtomFamily = atomFamily((id) => ...)

   function TodoItem({ id }) {
     const todo = useAtomValue(todoAtomFamily(id))
     // Only THIS item re-renders when updated
   }
   ```

## TypeScript Support

Jotai has excellent TypeScript support with automatic type inference.

### Type Inference

```typescript
// Types are automatically inferred
const countAtom = atom(0) // PrimitiveAtom<number>
const nameAtom = atom('John') // PrimitiveAtom<string>

const doubleAtom = atom((get) => {
  return get(countAtom) * 2 // Atom<number>
})

// Usage
const count = useAtomValue(countAtom) // number
const setCount = useSetAtom(countAtom) // (value: number) => void
```

### Explicit Types

```typescript
interface User {
  id: string
  name: string
}

// Explicit type annotation
const userAtom = atom<User | null>(null)

// Generic type parameter
const usersAtom = atom<User[]>([])
```

### Write-only Atoms with Types

```typescript
// Parameter types for write function
const addTodoAtom = atom(
  null,
  (get, set, text: string) => { // text is typed
    // ...
  }
)

// Usage is type-safe
const addTodo = useSetAtom(addTodoAtom)
addTodo('Buy milk') // ✅ OK
addTodo(123) // ❌ Error: Argument of type 'number' is not assignable
```

### Complex Types

```typescript
type FilterType = 'all' | 'active' | 'completed'

const filterAtom = atom<FilterType>('all')

// Only these values allowed
setFilter('all') // ✅
setFilter('active') // ✅
setFilter('invalid') // ❌ Error
```

## Best Practices

### 1. Organize Atoms in Separate Files

```typescript
// src/atoms/todoAtoms.ts
export const todosAtom = atom([])
export const filterAtom = atom('all')

// src/atoms/userAtoms.ts
export const userAtom = atom(null)
export const settingsAtom = atom({})
```

### 2. Use Descriptive Names

```typescript
// ✅ Good
const todosAtom = atom([])
const activeTodosAtom = atom((get) => ...)
const addTodoAtom = atom(null, (get, set, text) => ...)

// ❌ Bad
const atom1 = atom([])
const atom2 = atom((get) => ...)
const atom3 = atom(null, (get, set, text) => ...)
```

### 3. Keep Atoms Focused

```typescript
// ✅ Good: Focused atoms
const todosAtom = atom([])
const filterAtom = atom('all')
const sortAtom = atom('date')

// ❌ Bad: One large atom
const appStateAtom = atom({
  todos: [],
  filter: 'all',
  sort: 'date',
  user: {},
  settings: {}
})
```

### 4. Use Write-only Atoms for Actions

```typescript
// ✅ Good: Clear action
const addTodoAtom = atom(null, (get, set, text: string) => {
  const newTodo = { id: Date.now(), text, completed: false }
  set(todosAtom, [...get(todosAtom), newTodo])
})

// ❌ Bad: Direct mutation in component
function AddTodo() {
  const [todos, setTodos] = useAtom(todosAtom)
  const handleAdd = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }])
  }
}
```

### 5. Leverage Derived Atoms

```typescript
// ✅ Good: Derived atom
const activeTodosAtom = atom((get) => {
  return get(todosAtom).filter(t => !t.completed)
})

// ❌ Bad: Duplicate state
const todosAtom = atom([])
const activeTodosAtom = atom([]) // Now you need to keep them in sync!
```

### 6. Use atomWithStorage for Persistence

```typescript
// ✅ Good: Automatic persistence
const todosAtom = atomWithStorage('todos', [])

// ❌ Bad: Manual localStorage
const todosAtom = atom([])
// Then write useEffect to sync with localStorage
```

## Advanced Patterns

### Async Atoms

Jotai supports async atoms natively:

```typescript
const userAtom = atom(async () => {
  const response = await fetch('/api/user')
  return response.json()
})

// Usage with Suspense
function User() {
  const user = useAtomValue(userAtom)
  return <div>{user.name}</div>
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <User />
    </Suspense>
  )
}
```

### Atom with Reducers

Redux-style reducer pattern:

```typescript
type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: string }
  | { type: 'delete'; id: string }

const todosAtom = atom(
  [] as Todo[],
  (get, set, action: Action) => {
    const todos = get(todosAtom)
    switch (action.type) {
      case 'add':
        set(todosAtom, [...todos, { id: Date.now(), text: action.text, completed: false }])
        break
      case 'toggle':
        set(todosAtom, todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ))
        break
      case 'delete':
        set(todosAtom, todos.filter(t => t.id !== action.id))
        break
    }
  }
)

// Usage
const dispatch = useSetAtom(todosAtom)
dispatch({ type: 'add', text: 'New todo' })
```

### Atom Effects

Run side effects when atom changes:

```typescript
import { atomWithEffect } from 'jotai/utils'

const todosAtom = atomWithEffect((get, set) => {
  // Subscribe to changes
  const unsub = subscribeToTodos((todos) => {
    set(todosAtom, todos)
  })

  // Cleanup
  return unsub
})
```

### Conditional Atoms

```typescript
const userAtom = atom<User | null>(null)

const userNameAtom = atom((get) => {
  const user = get(userAtom)
  return user?.name ?? 'Guest'
})
```

## Testing

### Testing Components with Atoms

```typescript
import { renderHook } from '@testing-library/react'
import { useAtom } from 'jotai'
import { countAtom } from './atoms'

test('increment count', () => {
  const { result } = renderHook(() => useAtom(countAtom))

  expect(result.current[0]).toBe(0)

  act(() => {
    result.current[1](1)
  })

  expect(result.current[0]).toBe(1)
})
```

### Testing with Provider

Isolate state between tests:

```typescript
import { Provider } from 'jotai'

function TestWrapper({ children }) {
  return <Provider>{children}</Provider>
}

test('isolated state', () => {
  const { result: result1 } = renderHook(() => useAtom(countAtom), {
    wrapper: TestWrapper
  })

  const { result: result2 } = renderHook(() => useAtom(countAtom), {
    wrapper: TestWrapper
  })

  // Each has independent state
  act(() => result1.current[1](5))
  expect(result1.current[0]).toBe(5)
  expect(result2.current[0]).toBe(0) // Still 0
})
```

## Debugging

### Atom DevTools

Install the official DevTools:

```bash
npm install jotai-devtools
```

```typescript
import { DevTools } from 'jotai-devtools'

function App() {
  return (
    <>
      <DevTools />
      <YourApp />
    </>
  )
}
```

### Debug Label

Add labels to atoms for easier debugging:

```typescript
const todosAtom = atom([])
todosAtom.debugLabel = 'todos'

const filterAtom = atom('all')
filterAtom.debugLabel = 'filter'
```

### React DevTools

Jotai works great with React DevTools. Use the Profiler to see which components re-render.

## Migration Guide

### From Recoil

Very similar APIs, easy migration:

```typescript
// Recoil
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

const countState = atom({ key: 'count', default: 0 })
const doubleState = selector({
  key: 'double',
  get: ({ get }) => get(countState) * 2
})

// Jotai
import { atom, useAtom, useAtomValue } from 'jotai'

const countAtom = atom(0) // No key needed
const doubleAtom = atom((get) => get(countAtom) * 2) // Just atom()
```

### From Zustand

Need to split store into atoms:

```typescript
// Zustand
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

// Jotai
const countAtom = atom(0)
const incrementAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) + 1)
})
```

### From Redux

Significantly simpler:

```typescript
// Redux (many files and boilerplate)
// actions.js
export const increment = () => ({ type: 'INCREMENT' })

// reducer.js
export const reducer = (state = 0, action) => {
  if (action.type === 'INCREMENT') return state + 1
  return state
}

// store.js
export const store = createStore(reducer)

// Jotai (one file)
const countAtom = atom(0)
const incrementAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) + 1)
})
```

## Resources

### Official

- [Jotai Documentation](https://jotai.org/)
- [Jotai GitHub](https://github.com/pmndrs/jotai)
- [Jotai Examples](https://github.com/pmndrs/jotai/tree/main/examples)

### Tutorials

- [Introduction to Jotai](https://jotai.org/docs/introduction)
- [Jotai Basics](https://jotai.org/docs/basics/primitives)
- [Comparison with other libraries](https://jotai.org/docs/introduction/comparison)

### Community

- [Discord](https://discord.gg/poimandres)
- [Twitter](https://twitter.com/jotaijs)

### Similar Projects

- [Recoil](https://recoiljs.org/) - Facebook's atomic state management
- [Zustand](https://github.com/pmndrs/zustand) - Simpler state management by same team
- [Valtio](https://github.com/pmndrs/valtio) - Proxy-based state management

## License

MIT

## Summary

This project demonstrates a complete Todo List application using **Jotai** for state management. Key takeaways:

1. **Primitive atoms** are the building blocks
2. **Derived atoms** for computed values
3. **No Provider** needed (simpler setup)
4. **atomWithStorage** for built-in persistence
5. **Bottom-up** composition approach
6. **Fine-grained reactivity** for performance
7. **TypeScript** first-class support

Jotai offers a compelling middle ground between simplicity (Zustand) and power (Redux), with an API inspired by Recoil but improved in several ways. It's an excellent choice for modern React applications that need global state management with minimal boilerplate.

For questions or issues, please refer to the [official documentation](https://jotai.org/) or open an issue on GitHub.
