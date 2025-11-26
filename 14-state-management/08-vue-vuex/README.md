# Vue + Vuex Todo List

A comprehensive Todo List application demonstrating **Vuex 4** state management with **Vue 3** and **TypeScript**. This implementation showcases Vuex's Flux-inspired architecture and best practices.

## 📚 About Vuex

### What is Vuex?

**Vuex** is a state management pattern and library for Vue.js applications. It serves as a centralized store for all components in an application, with rules ensuring that state can only be mutated in a predictable fashion.

### Flux Architecture

Vuex follows the **Flux architecture** pattern, which features:

```
┌─────────────────────────────────────────────────┐
│                   Vue Component                  │
│  ┌──────────────────────────────────────────┐  │
│  │         1. Dispatch Action                │  │
│  │         store.dispatch('addTodo')         │  │
│  └────────────────┬─────────────────────────┘  │
└─────────────────────┼──────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────┐
        │        Actions          │
        │  (Async operations)     │
        │  - API calls            │
        │  - Complex logic        │
        └────────────┬────────────┘
                     │ 2. Commit
                     ▼
        ┌─────────────────────────┐
        │       Mutations         │
        │  (Synchronous only)     │
        │  - Direct state changes │
        └────────────┬────────────┘
                     │ 3. Mutate
                     ▼
        ┌─────────────────────────┐
        │         State           │
        │  (Single source of      │
        │   truth)                │
        └────────────┬────────────┘
                     │ 4. Render
                     ▼
        ┌─────────────────────────┐
        │        Getters          │
        │  (Computed state)       │
        └────────────┬────────────┘
                     │ 5. Consume
                     ▼
        ┌─────────────────────────┐
        │     Vue Component       │
        │  (Re-renders with new   │
        │   state)                │
        └─────────────────────────┘
```

### Core Concepts

#### 1. **State**
The single source of truth - a single state tree containing all application-level state.

```typescript
state: {
  todos: [],
  filter: 'all',
  nextId: 1
}
```

#### 2. **Getters**
Computed properties for stores - derive state based on store state.

```typescript
getters: {
  activeTodos: (state) => state.todos.filter(t => !t.completed),
  completedTodos: (state) => state.todos.filter(t => t.completed)
}
```

#### 3. **Mutations**
The **only** way to change state. Must be **synchronous**.

```typescript
mutations: {
  ADD_TODO(state, text) {
    state.todos.push({ id: state.nextId++, text, completed: false })
  }
}
```

#### 4. **Actions**
Can contain **asynchronous** operations. Commit mutations instead of directly mutating state.

```typescript
actions: {
  addTodo({ commit }, text) {
    commit('ADD_TODO', text)
  }
}
```

#### 5. **Modules**
Split store into modules - each with its own state, mutations, actions, and getters.

#### 6. **Plugins**
Hook into mutations for cross-cutting concerns like persistence, logging, etc.

```typescript
const plugin = (store) => {
  store.subscribe((mutation, state) => {
    // Called after every mutation
    localStorage.setItem('state', JSON.stringify(state))
  })
}
```

## ✨ Features

This Todo List application demonstrates:

- ✅ **State Management**: Centralized state with Vuex store
- ✅ **Mutations**: Synchronous state changes with mutation types
- ✅ **Actions**: Async-capable actions that commit mutations
- ✅ **Getters**: Computed state derivation
- ✅ **Plugins**: localStorage persistence plugin
- ✅ **Strict Mode**: Development-time strict mode for better debugging
- ✅ **TypeScript**: Full type safety throughout
- ✅ **CRUD Operations**: Create, Read, Update, Delete todos
- ✅ **Filtering**: View all, active, or completed todos
- ✅ **Statistics**: Real-time todo counts
- ✅ **Persistence**: State persisted to localStorage

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
08-vue-vuex/
├── src/
│   ├── components/          # Vue components
│   │   ├── TodoInput.vue   # Input component (dispatches actions)
│   │   ├── TodoFilter.vue  # Filter component (dispatches setFilter)
│   │   ├── TodoList.vue    # List container
│   │   ├── TodoItem.vue    # Individual todo (dispatches toggle/update/remove)
│   │   └── TodoStats.vue   # Statistics (uses getters)
│   ├── store/              # Vuex store
│   │   ├── index.ts        # Store configuration & creation
│   │   ├── mutation-types.ts # Mutation type constants
│   │   ├── mutations.ts    # Mutation handlers (sync)
│   │   ├── actions.ts      # Action handlers (can be async)
│   │   ├── getters.ts      # Computed state
│   │   └── plugins/
│   │       └── persistedState.ts # localStorage plugin
│   ├── types.ts            # TypeScript interfaces
│   ├── App.vue             # Root component
│   ├── main.ts             # App entry point
│   └── style.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── README.md              # This file
```

## 🏗️ Vuex Best Practices Demonstrated

### 1. **Mutation Type Constants**

```typescript
// mutation-types.ts
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'

// Usage in mutations.ts
[types.ADD_TODO](state, text) { /* ... */ }

// Usage in actions.ts
commit(types.ADD_TODO, text)
```

**Benefits**:
- Prevents typos
- Better IDE autocomplete
- Easier refactoring
- Self-documenting code

### 2. **Strict Mode in Development**

```typescript
const store = createStore({
  strict: import.meta.env.DEV, // Only in development
  // ...
})
```

**Benefits**:
- Catches mutations outside of mutation handlers
- Ensures predictable state changes
- No performance impact in production

### 3. **Proper TypeScript Integration**

```typescript
export interface RootState {
  todos: Todo[]
  filter: FilterType
  nextId: number
}

const mutations: MutationTree<RootState> = { /* ... */ }
const actions: ActionTree<RootState, RootState> = { /* ... */ }
const getters: GetterTree<RootState, RootState> = { /* ... */ }
```

**Benefits**:
- Full type safety
- Better IDE support
- Catch errors at compile time

### 4. **Plugin System for Cross-Cutting Concerns**

```typescript
const plugin = (store) => {
  // Initialize from localStorage
  const saved = localStorage.getItem('state')
  if (saved) store.commit('RESTORE_STATE', JSON.parse(saved))

  // Subscribe to mutations
  store.subscribe((mutation, state) => {
    localStorage.setItem('state', JSON.stringify(state))
  })
}
```

**Benefits**:
- Separation of concerns
- Reusable functionality
- No mutation/action pollution

### 5. **Separation of Concerns**

- **Mutations**: Only synchronous state changes
- **Actions**: Async operations, business logic, commit mutations
- **Getters**: Computed/derived state
- **Components**: Dispatch actions, consume getters

### 6. **Single Responsibility Principle**

Each mutation, action, and getter has one clear purpose:

```typescript
// Good: Single responsibility
mutations: {
  ADD_TODO(state, text) { /* ... */ },
  TOGGLE_TODO(state, id) { /* ... */ },
  REMOVE_TODO(state, id) { /* ... */ }
}

// Bad: Multiple responsibilities
mutations: {
  UPDATE_EVERYTHING(state, payload) { /* ... */ }
}
```

## 🆚 Vuex vs Pinia Comparison

### Why Vue 3 Recommends Pinia

While Vuex is battle-tested and powerful, **Pinia** is now the officially recommended state management solution for Vue 3. Here's why:

| Feature | Vuex 4 | Pinia |
|---------|--------|-------|
| **API Style** | Flux-inspired (mutations, actions, getters) | Intuitive (just actions and getters) |
| **TypeScript** | Good, but requires boilerplate | Excellent, inference out-of-the-box |
| **Boilerplate** | Higher (mutations + actions) | Lower (just actions) |
| **DevTools** | Good support | Excellent support |
| **Modularity** | Namespaced modules | Stores are modular by default |
| **Learning Curve** | Steeper (Flux concepts) | Gentler (simpler mental model) |
| **Bundle Size** | ~22KB | ~1KB |
| **Composition API** | Requires helpers | Native support |

### Key Differences

#### 1. **No Mutations in Pinia**

**Vuex** (Two-step process):
```typescript
// Action
actions: {
  addTodo({ commit }, text) {
    commit('ADD_TODO', text)  // Step 1: Commit mutation
  }
}

// Mutation
mutations: {
  ADD_TODO(state, text) {      // Step 2: Mutate state
    state.todos.push({ text })
  }
}
```

**Pinia** (Direct mutation):
```typescript
// Just action - directly mutate state
actions: {
  addTodo(text: string) {
    this.todos.push({ text })  // One step!
  }
}
```

#### 2. **TypeScript Support**

**Vuex**:
```typescript
// Requires manual typing and boilerplate
const store = useStore<RootState>()

// Type must be cast or inferred
const todos = computed(() => store.getters.todos as Todo[])
```

**Pinia**:
```typescript
// Full type inference automatically
const todoStore = useTodoStore()

// TypeScript knows the exact type!
const todos = computed(() => todoStore.todos)
```

#### 3. **Store Definition**

**Vuex** (Single large object):
```typescript
export default createStore({
  state: { /* ... */ },
  mutations: { /* ... */ },
  actions: { /* ... */ },
  getters: { /* ... */ },
  modules: { /* ... */ }
})
```

**Pinia** (Modular by design):
```typescript
export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])

  const activeTodos = computed(() =>
    todos.value.filter(t => !t.completed)
  )

  function addTodo(text: string) {
    todos.value.push({ text })
  }

  return { todos, activeTodos, addTodo }
})
```

#### 4. **Setup Syntax**

**Vuex** (Options API style):
```vue
<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const todos = computed(() => store.state.todos)
const addTodo = (text) => store.dispatch('addTodo', text)
</script>
```

**Pinia** (Composition API native):
```vue
<script setup>
import { useTodoStore } from '@/stores/todo'

const todoStore = useTodoStore()
// Direct access - no need for computed!
</script>

<template>
  {{ todoStore.todos }}
</template>
```

### When to Use Vuex vs Pinia

#### Use **Vuex** if:
- ✅ You have an existing large Vue 2 application
- ✅ Your team is already familiar with Flux architecture
- ✅ You need strict separation between sync (mutations) and async (actions)
- ✅ You're migrating from Vue 2 to Vue 3 gradually

#### Use **Pinia** if:
- ✅ Starting a new Vue 3 project (recommended)
- ✅ Want better TypeScript support
- ✅ Prefer simpler, more intuitive API
- ✅ Want smaller bundle size
- ✅ Using Composition API extensively

### Migration Path

Both tools can coexist! You can gradually migrate from Vuex to Pinia:

```typescript
// app.ts - Use both simultaneously
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuexStore from './store'  // Vuex

const app = createApp(App)
app.use(createPinia())  // Pinia
app.use(vuexStore)      // Vuex
app.mount('#app')
```

## 🎓 Learning Resources

### Official Documentation
- [Vuex Official Docs](https://vuex.vuejs.org/) - Comprehensive guide
- [Pinia Official Docs](https://pinia.vuejs.org/) - Modern alternative
- [Vue 3 Documentation](https://vuejs.org/) - Vue.js framework

### Tutorials & Guides
- [Vuex Crash Course](https://vuex.vuejs.org/guide/) - Official guide
- [TypeScript with Vuex](https://vuex.vuejs.org/guide/typescript-support.html) - TS integration
- [Migrating to Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html) - Migration guide

### Flux Architecture
- [Flux Concepts](https://facebook.github.io/flux/docs/in-depth-overview) - Original Flux pattern
- [Redux Documentation](https://redux.js.org/) - Similar architecture (React)

### Best Practices
- [Vuex Best Practices](https://vuex.vuejs.org/guide/structure.html) - Project structure
- [State Management Patterns](https://vuejs.org/guide/scaling-up/state-management.html) - Vue guide

## 🔍 Key Takeaways

### Advantages of Vuex
1. ✅ **Battle-tested**: Used in production by thousands of applications
2. ✅ **Predictable**: Strict unidirectional data flow
3. ✅ **Debuggable**: Excellent DevTools with time-travel debugging
4. ✅ **Structured**: Clear separation of concerns (state/mutations/actions/getters)
5. ✅ **Scalable**: Module system for large applications

### Disadvantages of Vuex
1. ❌ **Verbose**: Requires more boilerplate than alternatives
2. ❌ **Mutations**: Extra step that Pinia eliminates
3. ❌ **TypeScript**: Good but not great - requires manual typing
4. ❌ **Learning curve**: Flux concepts can be confusing initially
5. ❌ **Bundle size**: Larger than modern alternatives

### The Future
The Vue.js team recommends **Pinia** for new Vue 3 projects. Vuex 4 exists primarily for Vue 2 compatibility and migration scenarios. For greenfield Vue 3 projects, Pinia offers:
- Better TypeScript support
- Simpler API
- Smaller bundle size
- Native Composition API integration

However, Vuex remains a solid choice for:
- Existing projects
- Teams comfortable with Flux
- Cases requiring strict mutation/action separation

## 📝 License

MIT

---

**Note**: This project is for educational purposes, demonstrating Vuex patterns and best practices. For new Vue 3 projects, consider using [Pinia](../07-vue-pinia/) instead.
