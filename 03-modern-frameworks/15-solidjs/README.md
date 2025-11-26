# SolidJS Todo List

A comprehensive Todo List application built with **SolidJS**, demonstrating the power of fine-grained reactivity without a virtual DOM. This implementation showcases SolidJS's unique approach to reactive programming, including signals, stores, effects, and optimal rendering performance.

## Table of Contents

- [Overview](#overview)
- [What is SolidJS?](#what-is-solidjs)
- [Key Features](#key-features)
- [SolidJS Reactivity Model](#solidjs-reactivity-model)
  - [Signals: Primitive Reactivity](#signals-primitive-reactivity)
  - [Stores: Complex State Management](#stores-complex-state-management)
  - [Effects: Side Effects and Reactions](#effects-side-effects-and-reactions)
  - [Memos: Derived State](#memos-derived-state)
- [Fine-Grained Reactivity Explained](#fine-grained-reactivity-explained)
- [Signals vs Stores: A Deep Comparison](#signals-vs-stores-a-deep-comparison)
- [Performance Benefits vs React](#performance-benefits-vs-react)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Features Implemented](#features-implemented)
- [Code Examples and Explanations](#code-examples-and-explanations)
  - [TodoStore Implementation](#todostore-implementation)
  - [Signal Usage in TodoInput](#signal-usage-in-todoinput)
  - [Fine-Grained Updates in TodoItem](#fine-grained-updates-in-todoitem)
  - [Efficient List Rendering with For](#efficient-list-rendering-with-for)
- [SolidJS Best Practices](#solidjs-best-practices)
- [Common Patterns](#common-patterns)
- [Debugging Tips](#debugging-tips)
- [Further Learning](#further-learning)

## Overview

This Todo List application demonstrates SolidJS's reactive programming model with:

- **Signals** for local component state
- **Stores** for complex global state management
- **Effects** for localStorage persistence
- **Fine-grained reactivity** for optimal performance
- **TypeScript** for type safety
- **Vite** for fast development and building

The application implements all standard todo functionality including create, read, update, delete operations, filtering, and persistent storage.

## What is SolidJS?

**SolidJS** is a declarative JavaScript framework for building user interfaces. Unlike React, Vue, or other popular frameworks, SolidJS:

1. **Has no virtual DOM** - Updates directly manipulate the real DOM
2. **Uses fine-grained reactivity** - Only changed values trigger updates
3. **Compiles JSX at build time** - JSX becomes real DOM operations
4. **Is truly reactive** - Data changes automatically propagate
5. **Is extremely fast** - Often outperforms other frameworks in benchmarks

### Core Philosophy

SolidJS follows these principles:

- **Reactive by default**: Everything is reactive, no need to opt-in
- **Components run once**: Components are just functions that run once to set up the reactive graph
- **No re-renders**: Unlike React, components don't re-run - only reactive expressions update
- **Explicit control**: You have full control over when and how updates happen

## Key Features

### Application Features

- ✅ Add new todos
- ✅ Toggle todo completion status
- ✅ Edit todos (double-click)
- ✅ Delete todos
- ✅ Filter todos (All/Active/Completed)
- ✅ Clear completed todos
- ✅ Toggle all todos at once
- ✅ Persistent storage (localStorage)
- ✅ Active todo counter
- ✅ Responsive design

### Technical Features

- 🚀 Fine-grained reactivity with signals and stores
- 🎯 Type-safe with TypeScript
- ⚡ Vite for fast HMR and builds
- 📦 Component-based architecture
- 🎨 Modern CSS with smooth transitions
- 💾 Automatic localStorage synchronization
- 🔍 Efficient list rendering with `For` component

## SolidJS Reactivity Model

SolidJS's reactivity system is built on three core primitives: **Signals**, **Memos**, and **Effects**. Understanding these is key to mastering SolidJS.

### Signals: Primitive Reactivity

Signals are the most basic reactive primitive. They represent a single reactive value.

#### Creating Signals

```typescript
import { createSignal } from 'solid-js';

const [count, setCount] = createSignal(0);
```

#### Key Characteristics

1. **Getter/Setter Pattern**: Signals return a tuple of `[getter, setter]`
2. **Getters are functions**: Access the value by calling `count()`, not `count`
3. **Synchronous updates**: Changes are immediately visible
4. **Fine-grained tracking**: Only expressions that read the signal update

#### Signal Example

```typescript
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);

  // This runs once
  console.log('Component created');

  return (
    <div>
      {/* Only this text node updates when count changes */}
      <p>Count: {count()}</p>
      <button onClick={() => setCount(count() + 1)}>Increment</button>
    </div>
  );
}
```

**What happens:**
1. Component function runs once
2. JSX compiles to DOM creation and reactive bindings
3. `{count()}` creates a reactive dependency
4. When `setCount` is called, only the text node updates
5. The component function never runs again

### Stores: Complex State Management

Stores are for managing complex, nested state objects. They provide fine-grained reactivity for object properties and array elements.

#### Creating Stores

```typescript
import { createStore } from 'solid-js/store';

const [state, setState] = createStore({
  todos: [],
  filter: 'all',
  user: {
    name: 'John',
    preferences: {
      theme: 'dark'
    }
  }
});
```

#### Key Characteristics

1. **Nested reactivity**: Every property at every level is tracked
2. **Immutable updates**: Use setter for modifications
3. **Path-based updates**: Update specific properties without touching others
4. **Array efficiency**: Track individual array items, not the whole array

#### Store Update Patterns

```typescript
// Update a top-level property
setState('filter', 'active');

// Update nested property
setState('user', 'name', 'Jane');

// Update deeply nested property
setState('user', 'preferences', 'theme', 'light');

// Update with function
setState('todos', todos => [...todos, newTodo]);

// Update specific array item
setState('todos', todo => todo.id === id, 'completed', true);

// Batch updates
setState({
  filter: 'all',
  user: { name: 'Jane' }
});
```

### Effects: Side Effects and Reactions

Effects run side effects in response to reactive dependencies.

#### Creating Effects

```typescript
import { createEffect } from 'solid-js';

createEffect(() => {
  // Automatically tracks dependencies
  console.log('Count is:', count());

  // This effect re-runs whenever count() changes
});
```

#### Key Characteristics

1. **Automatic tracking**: Any signal/store read inside becomes a dependency
2. **Run on change**: Re-execute when dependencies change
3. **Cleanup support**: Return a cleanup function
4. **Synchronous by default**: Run immediately and on updates

#### Effect Example

```typescript
import { createSignal, createEffect } from 'solid-js';

function Logger() {
  const [count, setCount] = createSignal(0);
  const [name, setName] = createSignal('John');

  createEffect(() => {
    // This effect only depends on count
    console.log('Count changed:', count());
  });

  createEffect(() => {
    // This effect only depends on name
    console.log('Name changed:', name());
  });

  // Updating count won't trigger the name effect
  // Updating name won't trigger the count effect
}
```

#### Effect with Cleanup

```typescript
createEffect(() => {
  const id = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup runs before the next effect and on disposal
  return () => clearInterval(id);
});
```

### Memos: Derived State

Memos create cached computed values that only recalculate when dependencies change.

#### Creating Memos

```typescript
import { createMemo } from 'solid-js';

const doubled = createMemo(() => count() * 2);
```

#### Key Characteristics

1. **Cached**: Only recalculates when dependencies change
2. **Pure**: Should not have side effects
3. **Lazy**: Only runs when the value is read
4. **Memoized**: Multiple reads return the same value

#### Memo vs Effect

```typescript
// ❌ Don't use effects for derived values
createEffect(() => {
  const doubled = count() * 2;
  // doubled is lost after this runs
});

// ✅ Use memos for derived values
const doubled = createMemo(() => count() * 2);

// Now you can use doubled() anywhere
console.log(doubled());
```

## Fine-Grained Reactivity Explained

Fine-grained reactivity is SolidJS's secret sauce for incredible performance. Let's understand how it works.

### What is Fine-Grained Reactivity?

In most frameworks (React, Vue 2), reactivity works at the **component level**:

```
Data changes → Component re-runs → Virtual DOM diff → DOM update
```

In SolidJS, reactivity works at the **expression level**:

```
Data changes → Specific expression re-runs → Direct DOM update
```

### Visual Comparison

#### React (Coarse-Grained)

```jsx
function TodoItem({ todo }) {
  // Entire component re-runs when any prop changes
  console.log('TodoItem rendered');

  return (
    <div>
      <input type="checkbox" checked={todo.completed} />
      <span>{todo.text}</span>
      <button>Delete</button>
    </div>
  );
}

// Checking the checkbox:
// 1. State updates
// 2. Component re-runs
// 3. New virtual DOM created
// 4. Diff against old virtual DOM
// 5. Update only the checkbox
```

#### SolidJS (Fine-Grained)

```jsx
function TodoItem(props) {
  // Component runs ONCE
  console.log('TodoItem created');

  return (
    <div>
      <input type="checkbox" checked={props.todo.completed} />
      <span>{props.todo.text}</span>
      <button>Delete</button>
    </div>
  );
}

// Checking the checkbox:
// 1. State updates
// 2. Only the checkbox's 'checked' binding updates
// 3. Direct DOM manipulation
// No component re-run, no virtual DOM
```

### Real-World Example

Consider this component:

```typescript
function TodoList() {
  const [todos, setTodos] = createStore([
    { id: 1, text: 'Learn SolidJS', completed: false },
    { id: 2, text: 'Build app', completed: false },
  ]);

  return (
    <For each={todos}>
      {(todo) => (
        <div>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => {
              setTodos(t => t.id === todo.id, 'completed', !todo.completed);
            }}
          />
          <span>{todo.text}</span>
        </div>
      )}
    </For>
  );
}
```

**What happens when you toggle a checkbox:**

1. `setTodos` updates the specific todo's `completed` property
2. Only the `checked={todo.completed}` binding for that specific checkbox updates
3. The DOM checkbox is directly updated
4. No component re-runs
5. No virtual DOM diffing
6. No reconciliation

**Compare to React:**

1. `setState` called
2. Component re-renders
3. All todos re-create their JSX
4. Virtual DOM diff
5. Find the changed checkbox
6. Update the real DOM

### The Reactive Graph

SolidJS builds a **dependency graph** at initialization:

```
Signal/Store
    ↓
  Effect/Memo  ←  reads the signal
    ↓
  DOM Update   ←  updates specific DOM node
```

Example:

```typescript
const [count, setCount] = createSignal(0);

// Creates a dependency: count → effect
createEffect(() => {
  document.getElementById('count').textContent = count();
});

// Updates flow automatically
setCount(1); // Effect runs, DOM updates
setCount(2); // Effect runs, DOM updates
```

### Benefits

1. **No re-renders**: Components run once, period
2. **No virtual DOM**: Direct DOM manipulation
3. **Precise updates**: Only changed bindings update
4. **Predictable performance**: No cascading renders
5. **Smaller bundles**: No virtual DOM library needed

## Signals vs Stores: A Deep Comparison

Both signals and stores provide reactivity, but they're optimized for different use cases.

### When to Use Signals

Use signals for:

- ✅ Primitive values (strings, numbers, booleans)
- ✅ Simple state that changes as a whole
- ✅ Local component state
- ✅ Toggle switches, counters, form inputs

### When to Use Stores

Use stores for:

- ✅ Objects with multiple properties
- ✅ Nested data structures
- ✅ Arrays of items
- ✅ Global application state
- ✅ When you need to update specific properties independently

### Detailed Comparison

| Aspect | Signals | Stores |
|--------|---------|--------|
| **Type** | Any value | Objects/Arrays |
| **Granularity** | Whole value | Property-level |
| **Nesting** | Not reactive | Fully reactive |
| **Updates** | Replace entire value | Update specific properties |
| **Best for** | Primitives | Complex structures |
| **Performance** | Slightly faster for primitives | Better for large objects |

### Code Comparison

#### Managing a User with Signals (Less Optimal)

```typescript
// ❌ Not ideal - updating name requires spreading entire object
const [user, setUser] = createSignal({
  name: 'John',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true
  }
});

// Update name - must spread entire object
setUser(u => ({ ...u, name: 'Jane' }));

// Update nested property - verbose and creates new objects
setUser(u => ({
  ...u,
  preferences: {
    ...u.preferences,
    theme: 'light'
  }
}));
```

#### Managing a User with Stores (Optimal)

```typescript
// ✅ Ideal - fine-grained updates
const [user, setUser] = createStore({
  name: 'John',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true
  }
});

// Update name - only name property tracked
setUser('name', 'Jane');

// Update nested property - clean and efficient
setUser('preferences', 'theme', 'light');

// Components reading email won't update when name changes!
```

#### Managing a Todo List

```typescript
// ❌ With Signals - inefficient for lists
const [todos, setTodos] = createSignal([]);

// Adding a todo requires creating a new array
setTodos(t => [...t, newTodo]);

// Toggling a todo requires mapping entire array
setTodos(t => t.map(todo =>
  todo.id === id ? { ...todo, completed: !todo.completed } : todo
));

// Every todo component will track the entire todos signal
```

```typescript
// ✅ With Stores - efficient for lists
const [todos, setTodos] = createStore([]);

// Adding a todo
setTodos([...todos, newTodo]);

// Toggling a specific todo - ONLY that todo updates
setTodos(
  t => t.id === id,
  'completed',
  c => !c
);

// Only the specific todo item updates, others don't re-evaluate
```

### Array Operations with Stores

Stores shine when working with arrays:

```typescript
const [items, setItems] = createStore([
  { id: 1, name: 'Item 1', count: 0 },
  { id: 2, name: 'Item 2', count: 0 },
]);

// Update specific item's property
// Only components reading this specific item's count will update
setItems(item => item.id === 1, 'count', c => c + 1);

// Update all items
setItems({}, 'count', 0); // Reset all counts

// Filter items
setItems(items => items.filter(item => item.count > 0));

// Add item
setItems(items => [...items, newItem]);

// Update nested property in specific item
setItems(
  item => item.id === 2,
  'metadata',
  'lastUpdated',
  Date.now()
);
```

### Performance Implications

#### Signals: Whole Value Tracking

```typescript
const [user, setUser] = createSignal({
  name: 'John',
  email: 'john@example.com'
});

// Component A
<div>{user().name}</div>

// Component B
<div>{user().email}</div>

// Changing name updates BOTH components
// because they both track the entire user signal
setUser({ ...user(), name: 'Jane' });
```

#### Stores: Property-Level Tracking

```typescript
const [user, setUser] = createStore({
  name: 'John',
  email: 'john@example.com'
});

// Component A
<div>{user.name}</div>

// Component B
<div>{user.email}</div>

// Changing name updates ONLY Component A
// Component B doesn't re-evaluate
setUser('name', 'Jane');
```

## Performance Benefits vs React

SolidJS consistently outperforms React in benchmarks. Here's why:

### 1. No Virtual DOM

**React:**
- Creates virtual DOM tree
- Diffs against previous virtual DOM
- Calculates minimal updates
- Applies updates to real DOM

**SolidJS:**
- Directly updates real DOM
- No intermediate representation
- No diffing algorithm needed

### 2. No Component Re-renders

**React:**
```jsx
function TodoItem({ todo }) {
  // This runs every time parent renders
  // or todo changes
  console.log('Render');

  return <div>{todo.text}</div>;
}
```

**SolidJS:**
```jsx
function TodoItem(props) {
  // This runs ONCE when created
  console.log('Created');

  return <div>{props.todo.text}</div>;
  // Only the text node updates when text changes
}
```

### 3. Granular Updates

**React:**
- Props change → Component re-renders → Reconciliation

**SolidJS:**
- Property changes → Specific binding updates → Direct DOM mutation

### 4. Bundle Size

| Framework | Min+Gzip |
|-----------|----------|
| SolidJS | ~7 KB |
| Preact | ~4 KB (but simpler features) |
| React | ~40 KB |
| Vue 3 | ~34 KB |

### 5. Memory Usage

**React:**
- Maintains virtual DOM tree
- Keeps component instances
- Tracks reconciliation state

**SolidJS:**
- No virtual DOM
- Components run once and are garbage collected
- Only reactive primitives remain

### Benchmark Example

Todo List with 1000 items, toggling one checkbox:

**React:**
- ~50ms (component render + reconciliation)
- Updates entire list component
- Diffs 1000 virtual nodes

**SolidJS:**
- ~1ms (direct DOM update)
- Updates single checkbox
- No diffing needed

### Real-World Impact

For a typical todo app:

```typescript
// 1000 todos, toggle one

// React
- Component re-renders
- Creates 1000 virtual DOM nodes
- Diffs against previous 1000 nodes
- Finds 1 changed node
- Updates DOM
Time: ~50ms

// SolidJS
- Specific checkbox binding updates
- Direct DOM mutation
Time: <1ms
```

## Project Structure

```
03-modern-frameworks/15-solidjs/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx       # Input component with signals
│   │   ├── TodoItem.tsx        # Individual todo with editing
│   │   └── TodoList.tsx        # List rendering with For
│   ├── store/
│   │   └── todoStore.ts        # Global state with createStore
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── index.tsx               # Application entry point
│   └── types.ts                # TypeScript definitions
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript config for build tools
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

### File Responsibilities

- **types.ts**: TypeScript interfaces for Todo, FilterType, and store structure
- **todoStore.ts**: Global state management using createStore, including all CRUD operations and localStorage persistence
- **TodoInput.tsx**: Input field using createSignal for local state
- **TodoItem.tsx**: Individual todo item with editing, demonstrating fine-grained reactivity
- **TodoList.tsx**: List component using For for efficient rendering
- **App.tsx**: Main component combining all pieces with filters and counters
- **index.tsx**: Entry point that mounts the application

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Steps

1. **Navigate to the project directory:**

```bash
cd 03-modern-frameworks/15-solidjs
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

This installs:
- `solid-js`: The SolidJS framework
- `vite`: Fast build tool and dev server
- `vite-plugin-solid`: Vite plugin for SolidJS
- `typescript`: TypeScript compiler

## Development

Start the development server:

```bash
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:3000`
- Enable Hot Module Replacement (HMR)
- Open the browser automatically
- Watch for file changes

### Development Features

- **Fast Refresh**: Changes reflect instantly
- **TypeScript**: Full type checking in real-time
- **Error Overlay**: Errors show in the browser
- **Source Maps**: Debug with original TypeScript code

## Building for Production

Build the optimized production bundle:

```bash
npm run build
```

This will:
1. Run TypeScript type checking
2. Build optimized bundle with Vite
3. Output to `dist/` directory
4. Minify and optimize code

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Build Output

The build generates:
- Minified JavaScript bundles
- Optimized CSS
- Source maps (for debugging)
- Hashed filenames (for caching)

Typical bundle sizes:
- **JavaScript**: ~20-30 KB (including SolidJS)
- **CSS**: ~5 KB
- **Total**: ~25-35 KB gzipped

## Features Implemented

### Core Functionality

- ✅ **Add Todos**: Enter text and press Enter or click outside
- ✅ **Toggle Completion**: Click checkbox to mark complete/incomplete
- ✅ **Edit Todos**: Double-click todo text to edit inline
- ✅ **Delete Todos**: Click × button to remove
- ✅ **Filter Views**:
  - All: Show all todos
  - Active: Show only incomplete todos
  - Completed: Show only completed todos
- ✅ **Clear Completed**: Remove all completed todos at once
- ✅ **Toggle All**: Mark all todos as complete/incomplete
- ✅ **Active Counter**: Shows count of remaining items
- ✅ **Persistent Storage**: Automatically saves to localStorage

### Technical Implementation

- ✅ **Signals**: For local component state (input value, editing mode)
- ✅ **Stores**: For global todo state with nested reactivity
- ✅ **Effects**: For localStorage synchronization
- ✅ **For Component**: For efficient list rendering
- ✅ **Show Component**: For conditional rendering
- ✅ **classList**: For dynamic CSS classes
- ✅ **TypeScript**: Full type safety throughout
- ✅ **Fine-Grained Updates**: Only changed elements update

## Code Examples and Explanations

### TodoStore Implementation

The store is the heart of the application, managing all todo state:

```typescript
import { createStore } from 'solid-js/store';
import { createEffect } from 'solid-js';

// Create reactive store
const [store, setStore] = createStore({
  todos: loadTodos(), // Load from localStorage
  filter: 'all'
});

// Effect automatically saves when todos change
createEffect(() => {
  localStorage.setItem('todos', JSON.stringify(store.todos));
});
```

**Key Points:**

1. **createStore** returns `[state, setState]` like signals
2. The state is a **readonly proxy** that tracks access
3. **setState** allows granular updates
4. **createEffect** automatically tracks `store.todos` dependency

### Adding a Todo

```typescript
export function addTodo(text: string) {
  const newTodo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  };

  // Add to beginning of array
  setStore('todos', todos => [newTodo, ...todos]);
}
```

**What Happens:**

1. Create new todo object
2. Update store's todos array
3. Components using todos automatically update
4. localStorage effect automatically triggers
5. Only the list updates - no full re-render

### Toggling a Todo

```typescript
export function toggleTodo(id: string) {
  setStore(
    'todos',                     // Array to update
    todo => todo.id === id,      // Predicate to find item
    'completed',                 // Property to update
    completed => !completed      // Update function
  );
}
```

**Path-Based Updates:**

This is SolidJS store magic:
1. Find todo with matching id
2. Update ONLY its `completed` property
3. Components reading that specific todo's `completed` property update
4. Other todos don't trigger any updates
5. Incredibly efficient for large lists

### Signal Usage in TodoInput

```typescript
function TodoInput() {
  // Local state for input value
  const [inputValue, setInputValue] = createSignal('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (inputValue().trim()) {
      addTodo(inputValue());
      setInputValue(''); // Clear input
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputValue()}           // Read signal
        onInput={e =>
          setInputValue(e.target.value) // Update signal
        }
      />
    </form>
  );
}
```

**Why Signals Here:**

- Input value is a primitive string
- Changes as a whole value
- Local to this component
- Simple getter/setter pattern
- Perfect use case for signals

### Fine-Grained Updates in TodoItem

```typescript
function TodoItem(props) {
  const [isEditing, setIsEditing] = createSignal(false);

  return (
    <li classList={{
      'todo-item': true,
      'completed': props.todo.completed, // Tracks this property
      'editing': isEditing()              // Tracks this signal
    }}>
      <Show when={!isEditing()}>
        <input
          type="checkbox"
          checked={props.todo.completed}  // Fine-grained binding
          onChange={() => toggleTodo(props.todo.id)}
        />
        <span>{props.todo.text}</span>
      </Show>
    </li>
  );
}
```

**Fine-Grained Magic:**

1. **`props.todo.completed`** creates a dependency on just this property
2. When this todo's `completed` changes:
   - Only the `checked` attribute updates
   - Only the `completed` class updates
   - Nothing else in the component executes
3. **`isEditing()`** is independent:
   - Changing it only affects `Show` component
   - Doesn't trigger other bindings

### Efficient List Rendering with For

```typescript
function TodoList() {
  const todos = () => getFilteredTodos();

  return (
    <For each={todos()}>
      {(todo) => <TodoItem todo={todo} />}
    </For>
  );
}
```

**For Component Benefits:**

1. **Keyed by reference**: Each todo object is the key
2. **Minimal updates**: Only added/removed/moved items update
3. **No explicit keys**: No need for `key` prop like React
4. **Efficient diffing**: Reference equality is fast
5. **Stable references**: Same todo object = same DOM element

**Comparison to React:**

```jsx
// React - needs keys, re-renders on any change
{todos.map(todo => (
  <TodoItem key={todo.id} todo={todo} />
))}

// SolidJS - no keys needed, fine-grained updates
<For each={todos()}>
  {(todo) => <TodoItem todo={todo} />}
</For>
```

## SolidJS Best Practices

### 1. Use Signals for Primitives, Stores for Objects

```typescript
// ✅ Good
const [count, setCount] = createSignal(0);
const [user, setUser] = createStore({ name: 'John', email: 'john@email.com' });

// ❌ Avoid
const [user, setUser] = createSignal({ name: 'John', email: 'john@email.com' });
```

### 2. Keep Effects Simple

```typescript
// ✅ Good - one responsibility
createEffect(() => {
  localStorage.setItem('count', count().toString());
});

// ❌ Avoid - multiple responsibilities
createEffect(() => {
  localStorage.setItem('count', count().toString());
  updateServer(count());
  logAnalytics(count());
});
```

### 3. Use Memos for Derived Values

```typescript
// ✅ Good
const doubled = createMemo(() => count() * 2);
const tripled = createMemo(() => doubled() * 1.5);

// ❌ Avoid
const doubled = () => count() * 2; // Recalculates every time
```

### 4. Batch Store Updates

```typescript
// ✅ Good - single update
setStore({
  name: 'Jane',
  email: 'jane@email.com',
  age: 30
});

// ❌ Avoid - multiple updates
setStore('name', 'Jane');
setStore('email', 'jane@email.com');
setStore('age', 30);
```

### 5. Use Show for Conditionals

```typescript
// ✅ Good - only creates DOM when needed
<Show when={isLoggedIn()}>
  <Dashboard />
</Show>

// ❌ Avoid - always creates both branches
{isLoggedIn() ? <Dashboard /> : null}
```

### 6. Leverage classList

```typescript
// ✅ Good - fine-grained class updates
<div classList={{
  'card': true,
  'active': isActive(),
  'disabled': isDisabled()
}}>

// ❌ Avoid - recreates class string every time
<div class={`card ${isActive() ? 'active' : ''} ${isDisabled() ? 'disabled' : ''}`}>
```

## Common Patterns

### Computed Values Pattern

```typescript
function TodoApp() {
  const [todos, setTodos] = createStore([]);

  // Computed values
  const activeCount = createMemo(() =>
    todos.filter(t => !t.completed).length
  );

  const completedCount = createMemo(() =>
    todos.filter(t => t.completed).length
  );

  const allCompleted = createMemo(() =>
    todos.length > 0 && activeCount() === 0
  );

  return (
    <div>
      <p>{activeCount()} active</p>
      <p>{completedCount()} completed</p>
    </div>
  );
}
```

### Loading State Pattern

```typescript
function DataFetcher() {
  const [data, setData] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  createEffect(() => {
    setLoading(true);
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  });

  return (
    <Show
      when={!loading()}
      fallback={<div>Loading...</div>}
    >
      <Show
        when={!error()}
        fallback={<div>Error: {error().message}</div>}
      >
        <div>{JSON.stringify(data())}</div>
      </Show>
    </Show>
  );
}
```

### Form Handling Pattern

```typescript
function LoginForm() {
  const [form, setForm] = createStore({
    email: '',
    password: ''
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Login:', form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={form.email}
        onInput={e => setForm('email', e.target.value)}
      />
      <input
        type="password"
        value={form.password}
        onInput={e => setForm('password', e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

## Debugging Tips

### 1. Track Reactive Dependencies

```typescript
import { createEffect } from 'solid-js';

// Log when effect runs
createEffect(() => {
  console.log('Dependencies:', {
    count: count(),
    name: name()
  });
});
```

### 2. Use SolidJS DevTools

Install the browser extension for:
- Component tree inspection
- Reactive graph visualization
- State inspection
- Performance profiling

### 3. Log Component Creation

```typescript
function MyComponent() {
  console.log('MyComponent created');

  createEffect(() => {
    console.log('Effect runs, count:', count());
  });

  return <div>...</div>;
}
```

If you see "created" multiple times, you might have:
- Wrong component usage
- Missing memoization
- Unnecessary re-creation

### 4. Check for Infinite Loops

```typescript
// ❌ This creates an infinite loop
createEffect(() => {
  setCount(count() + 1); // Reads count and writes count
});

// ✅ Use untrack to break the loop
createEffect(() => {
  const current = count();
  untrack(() => {
    setCount(current + 1);
  });
});
```

## Further Learning

### Official Resources

- **Website**: [https://www.solidjs.com/](https://www.solidjs.com/)
- **Tutorial**: [https://www.solidjs.com/tutorial](https://www.solidjs.com/tutorial)
- **Docs**: [https://www.solidjs.com/docs](https://www.solidjs.com/docs)
- **Playground**: [https://playground.solidjs.com/](https://playground.solidjs.com/)

### Ecosystem

- **Solid Router**: Official routing solution
- **Solid Start**: Meta-framework (like Next.js for React)
- **Solid Primitives**: Collection of useful primitives
- **Solid UI**: Component libraries

### Community

- **Discord**: Active community for help and discussion
- **GitHub**: [https://github.com/solidjs/solid](https://github.com/solidjs/solid)
- **Twitter**: [@solid_js](https://twitter.com/solid_js)

### Advanced Topics

- **Resources**: Async data loading primitive
- **Context**: Share state across component tree
- **Portals**: Render components outside main tree
- **Suspense**: Handle async rendering
- **Error Boundaries**: Catch and handle errors
- **SSR**: Server-side rendering with Solid Start

---

## Summary

This SolidJS Todo List demonstrates:

1. **Fine-grained reactivity** - Updates only what changed, nothing more
2. **No virtual DOM** - Direct DOM manipulation for speed
3. **Signals and Stores** - Powerful reactive primitives
4. **Effects** - Declarative side effects and persistence
5. **TypeScript** - Full type safety
6. **Modern tooling** - Vite for fast development

SolidJS offers React-like syntax with Vue-like reactivity, resulting in exceptional performance and developer experience. It's perfect for applications where performance matters and bundle size is a concern.

The fine-grained reactivity model means you can build complex applications that stay fast as they grow, without worrying about optimization techniques like memoization, useCallback, or component splitting that are necessary in React.

**Happy coding with SolidJS!**
