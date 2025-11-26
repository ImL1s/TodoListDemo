# Vuex Quick Start

## 🚀 Installation

```bash
npm install
npm run dev
```

## 📖 Core Vuex Concepts (5 Minutes)

### 1. State - Single Source of Truth
```typescript
state: {
  todos: [],
  filter: 'all'
}
```

### 2. Getters - Computed Properties
```typescript
getters: {
  activeTodos: (state) => state.todos.filter(t => !t.completed)
}
```

### 3. Mutations - Synchronous State Changes ONLY
```typescript
mutations: {
  ADD_TODO(state, text) {
    state.todos.push({ id: Date.now(), text, completed: false })
  }
}
```

### 4. Actions - Can Be Async, Commit Mutations
```typescript
actions: {
  async fetchTodos({ commit }) {
    const todos = await api.getTodos()
    commit('SET_TODOS', todos)
  }
}
```

### 5. Using in Components
```vue
<script setup lang="ts">
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()

// Read state via getters
const todos = computed(() => store.getters.activeTodos)

// Dispatch actions to change state
const addTodo = (text: string) => {
  store.dispatch('addTodo', text)
}
</script>
```

## 🎯 Vuex Flow

```
Component
   ↓ dispatch
Action (async allowed)
   ↓ commit
Mutation (sync only!)
   ↓ mutate
State
   ↓ render
Component
```

## ⚡ Key Rules

1. **Never mutate state outside mutations**
2. **Mutations must be synchronous**
3. **Actions can be async**
4. **Use getters for derived state**
5. **Enable strict mode in development**

## 🔄 Comparison with Pinia

| Vuex | Pinia |
|------|-------|
| mutations + actions | actions only |
| `commit` + `dispatch` | just call actions |
| More boilerplate | Less code |
| Flux architecture | Intuitive API |

**Vue 3 Recommendation**: Use Pinia for new projects!

See [README.md](./README.md) for detailed comparison.
