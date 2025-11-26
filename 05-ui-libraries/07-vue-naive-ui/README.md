# Vue 3 + Naive UI Todo List Application

A modern, feature-rich Todo List application built with **Vue 3**, **TypeScript**, and **Naive UI** - showcasing the power of Vue's Composition API combined with one of the most elegant and TypeScript-friendly UI component libraries in the Vue ecosystem.

## Table of Contents

- [Introduction](#introduction)
- [What is Naive UI?](#what-is-naive-ui)
- [Why Choose Naive UI?](#why-choose-naive-ui)
- [Naive UI vs Other Vue UI Libraries](#naive-ui-vs-other-vue-ui-libraries)
- [TypeScript-First Design](#typescript-first-design)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Naive UI Components Used](#naive-ui-components-used)
- [Theme System](#theme-system)
- [Type Safety](#type-safety)
- [Best Practices](#best-practices)
- [Performance Optimization](#performance-optimization)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Further Resources](#further-resources)

---

## Introduction

This Todo List application demonstrates how to build a production-ready Vue 3 application using Naive UI, a component library that stands out for its exceptional TypeScript support, elegant design, and comprehensive feature set. Unlike other UI libraries that feel like ports from React or Angular, Naive UI is built specifically for Vue 3, taking full advantage of the Composition API and modern Vue features.

## What is Naive UI?

**Naive UI** (pronounced "nah-eev") is a Vue 3 UI library with a complete set of components, featuring:

- **TypeScript-first design**: Written in TypeScript from the ground up
- **Composition API native**: Designed specifically for Vue 3's Composition API
- **Tree-shakeable**: Only bundle what you use
- **Theme customization**: Powerful theming system with CSS-in-JS
- **Comprehensive components**: 80+ high-quality components
- **No third-party CSS**: Everything is controlled by JavaScript
- **Active development**: Created and maintained by TuSimple team members

### The Story Behind Naive UI

Naive UI was created by **07akioni** (a developer who has worked closely with Vue.js creator Evan You at TuSimple). The library emerged from the need for a truly modern, Vue 3-first UI component library that:

1. Fully embraces TypeScript
2. Leverages Vue 3's Composition API
3. Provides excellent developer experience
4. Offers beautiful, consistent design out of the box

The name "Naive" reflects the library's philosophy: components should be simple, intuitive, and work exactly as developers expect them to, without surprises or unnecessary complexity.

### Key Philosophy

```
"Naive UI is designed to be simple, yet powerful.
Every component is crafted with TypeScript,
ensuring type safety without sacrificing developer experience."
```

## Why Choose Naive UI?

### 1. **Superior TypeScript Support**

Naive UI provides industry-leading TypeScript support:

```typescript
import { NButton, type ButtonProps } from 'naive-ui'

// All props are fully typed
const buttonProps: ButtonProps = {
  type: 'primary',    // Autocomplete: 'default' | 'tertiary' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  size: 'large',      // Autocomplete: 'tiny' | 'small' | 'medium' | 'large'
  disabled: false,
  // TypeScript will catch any invalid props
}
```

### 2. **Vue 3 Native**

Built specifically for Vue 3, not a migration from Vue 2:

```vue
<script setup lang="ts">
// Composition API with full type inference
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()
const count = ref(0)

// Fully typed composables
const handleClick = () => {
  message.success(`Clicked ${count.value} times`)
}
</script>
```

### 3. **Zero CSS Files**

All styling is handled via JavaScript, providing:

- **Dynamic theming**: Change themes at runtime
- **CSS-in-JS**: No CSS conflicts or specificity issues
- **Type-safe styles**: Theme customization with TypeScript
- **Smaller bundles**: No separate CSS files to load

### 4. **Comprehensive Component Set**

80+ production-ready components including:

- **Basic**: Button, Icon, Text, Tag
- **Data Entry**: Input, Select, DatePicker, TimePicker, Upload
- **Data Display**: Table, Tree, List, Card, Descriptions
- **Feedback**: Message, Notification, Modal, Drawer, Progress
- **Navigation**: Menu, Tabs, Breadcrumb, Pagination
- **Layout**: Layout, Grid, Space, Divider

### 5. **Excellent Documentation**

- Live playground for every component
- TypeScript examples
- Dark mode support in docs
- Detailed API references
- Migration guides

## Naive UI vs Other Vue UI Libraries

### Comparison Table

| Feature | Naive UI | Element Plus | Vuetify | Ant Design Vue |
|---------|----------|--------------|---------|----------------|
| **TypeScript Support** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Fair | ⭐⭐⭐⭐ Good |
| **Vue 3 Native** | ✅ Yes | ✅ Yes | ❌ No (Migrated) | ⚠️ Partial |
| **Bundle Size** | 🟢 Small | 🟡 Medium | 🔴 Large | 🟡 Medium |
| **CSS-in-JS** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Tree Shaking** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Fair | ⭐⭐⭐⭐ Good |
| **Theme System** | ⭐⭐⭐⭐⭐ Dynamic | ⭐⭐⭐ CSS Vars | ⭐⭐⭐⭐ SASS | ⭐⭐⭐ Less |
| **Components** | 80+ | 90+ | 100+ | 80+ |
| **Design Language** | Modern/Minimal | Element | Material | Ant Design |
| **Learning Curve** | 🟢 Easy | 🟢 Easy | 🟡 Medium | 🟡 Medium |
| **Community** | 🟡 Growing | 🟢 Large | 🟢 Large | 🟢 Large |

### Detailed Comparison

#### **Naive UI vs Element Plus**

**Naive UI Advantages:**
- Better TypeScript support with full type inference
- CSS-in-JS for dynamic theming
- Smaller bundle size (tree-shakeable by design)
- More modern API design using Composition API

**Element Plus Advantages:**
- Larger community and ecosystem
- More components and plugins
- Established design language (familiar to Element UI users)
- More third-party integrations

**Use Naive UI if:**
- You're building a TypeScript-first application
- You need dynamic theming capabilities
- You want a smaller bundle size
- You prefer Composition API

**Use Element Plus if:**
- You need maximum component variety
- Your team is familiar with Element UI
- You're migrating from Vue 2 + Element UI
- You need extensive third-party plugins

#### **Naive UI vs Vuetify**

**Naive UI Advantages:**
- Vue 3 native (Vuetify is migrating from Vue 2)
- Superior TypeScript support
- Much smaller bundle size
- Better tree-shaking
- CSS-in-JS vs SASS compilation

**Vuetify Advantages:**
- Material Design implementation
- Comprehensive component set (100+ components)
- Mature ecosystem
- Extensive customization options
- Large community

**Use Naive UI if:**
- You want a Vue 3-first experience
- Bundle size is critical
- You prefer minimal/modern design over Material Design
- TypeScript is a priority

**Use Vuetify if:**
- You need Material Design compliance
- You want the most comprehensive component library
- You're building a complex enterprise application
- You need drag-and-drop, advanced data tables, etc.

#### **Naive UI vs Ant Design Vue**

**Naive UI Advantages:**
- Better TypeScript integration
- Smaller bundle size
- CSS-in-JS for easier theming
- More intuitive API for Vue developers
- Better Vue 3 support

**Ant Design Vue Advantages:**
- Ant Design ecosystem
- More mature and battle-tested
- Enterprise-grade components
- Better i18n support
- More design resources

**Use Naive UI if:**
- You want Vue-first API design
- TypeScript is critical
- You need flexible theming
- Bundle size matters

**Use Ant Design Vue if:**
- You're building enterprise applications
- You need Ant Design consistency across projects
- You require extensive i18n support
- You want proven, battle-tested components

## TypeScript-First Design

Naive UI's TypeScript support is unmatched. Here's what makes it special:

### 1. **Full Type Inference**

```typescript
import { ref } from 'vue'
import { NSelect, type SelectOption } from 'naive-ui'

// Options are fully typed
const options = ref<SelectOption[]>([
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 }
])

// TypeScript knows the value type
const selected = ref<number | null>(null)
```

### 2. **Typed Composables**

```typescript
import { useMessage, useDialog, useNotification } from 'naive-ui'

// All composables return fully typed APIs
const message = useMessage()
const dialog = useDialog()
const notification = useNotification()

// IDE autocomplete for all methods
message.success('Success!')  // ✅ Typed
message.error('Error!')      // ✅ Typed
message.warning('Warning!')  // ✅ Typed
message.info('Info!')        // ✅ Typed
```

### 3. **Theme Type Safety**

```typescript
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',        // ✅ Valid
    primaryColorHover: '#36ad6a',   // ✅ Valid
    // invalidProp: '#000'          // ❌ TypeScript error
  },
  Button: {
    textColorPrimary: '#fff',       // ✅ Valid
    // unknownColor: '#fff'         // ❌ TypeScript error
  }
}
```

### 4. **Component Props Typing**

```typescript
import type { ButtonProps, InputProps, SelectProps } from 'naive-ui'

// Extract and use component prop types
type MyButtonProps = Pick<ButtonProps, 'type' | 'size' | 'disabled'>

const props: MyButtonProps = {
  type: 'primary',
  size: 'large',
  disabled: false
}
```

### 5. **Event Typing**

```typescript
<template>
  <n-select
    v-model:value="value"
    :options="options"
    @update:value="handleUpdate"
  />
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui'

// Event handlers are fully typed
const handleUpdate = (
  value: string | number | null,
  option: SelectOption
) => {
  // TypeScript knows the exact types
  console.log(value, option.label)
}
</script>
```

## Features

This Todo List application includes:

### Core Features

- ✅ **Add Tasks**: Create new todo items with a clean input interface
- ✅ **Edit Tasks**: Inline editing with save/cancel actions
- ✅ **Delete Tasks**: Remove tasks with confirmation dialog
- ✅ **Toggle Completion**: Mark tasks as complete/incomplete
- ✅ **Filter Tasks**: View all, active, or completed tasks
- ✅ **Clear Completed**: Batch delete all completed tasks

### Advanced Features

- 🎨 **Dark Mode**: Toggle between light and dark themes
- 💾 **Persistent Storage**: Tasks saved to localStorage
- 📊 **Statistics**: Real-time task statistics and completion rate
- 🎯 **Type Safety**: Full TypeScript type checking
- 📱 **Responsive Design**: Works on all screen sizes
- 🚀 **Optimized Performance**: Tree-shaking and code splitting
- ⌨️ **Keyboard Shortcuts**: Enter to add, Escape to cancel
- 🎪 **Animations**: Smooth transitions and interactions
- 💬 **Toast Notifications**: Feedback for all actions
- 🎭 **Modal Dialogs**: Confirmation for destructive actions

### UI/UX Features

- **Empty State**: Beautiful empty state with helpful message
- **Loading States**: Proper feedback during operations
- **Error Handling**: Graceful error messages
- **Accessibility**: ARIA labels and keyboard navigation
- **Timestamps**: Track when tasks were created
- **Visual Feedback**: Hover effects and click animations

## Technology Stack

### Core Dependencies

```json
{
  "vue": "^3.4.21",           // Progressive JavaScript framework
  "naive-ui": "^2.38.1",      // Vue 3 component library
  "@vicons/ionicons5": "^0.12.0"  // Icon set for Naive UI
}
```

### Development Dependencies

```json
{
  "@vitejs/plugin-vue": "^5.0.4",  // Vite plugin for Vue SFC
  "typescript": "^5.4.2",           // TypeScript compiler
  "vite": "^5.1.6",                 // Next generation build tool
  "vue-tsc": "^2.0.6"               // TypeScript checker for Vue
}
```

### Build Tools

- **Vite**: Lightning-fast HMR and optimized builds
- **TypeScript**: Type safety and better DX
- **Vue TSC**: Type-checking for Vue SFCs

## Project Structure

```
vue-naive-ui-todo/
├── src/
│   ├── components/
│   │   ├── TodoInput.vue      # Input component for adding tasks
│   │   ├── TodoList.vue       # List container component
│   │   └── TodoItem.vue       # Individual task item component
│   ├── App.vue                # Root application component
│   ├── main.ts                # Application entry point
│   └── types.ts               # TypeScript type definitions
├── index.html                 # HTML entry point
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.node.json         # TypeScript config for Node
├── package.json               # Project dependencies
└── README.md                  # This file
```

### Component Hierarchy

```
App.vue (Root Component)
├── NConfigProvider (Theme Provider)
│   └── NLayout (Main Layout)
│       ├── NLayoutHeader (Header with theme toggle)
│       └── NLayoutContent (Main Content)
│           ├── Statistics Card (Task stats)
│           ├── TodoInput.vue (Add new tasks)
│           └── TodoList.vue (Task list)
│               └── TodoItem.vue (Individual tasks)
```

## Getting Started

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or **yarn** / **pnpm**)
- **Modern browser**: Chrome, Firefox, Safari, or Edge

### Installation

1. **Clone or navigate to the project directory:**

```bash
cd 05-ui-libraries/07-vue-naive-ui
```

2. **Install dependencies:**

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

3. **Start the development server:**

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

4. **Open your browser:**

Navigate to `http://localhost:3000` (or the port shown in your terminal)

### Building for Production

```bash
# Type-check and build
npm run build

# Preview production build
npm run preview
```

The production build will be created in the `dist/` directory.

### Type Checking

```bash
# Run TypeScript type checker
npm run type-check
```

## Component Architecture

### App.vue - Root Component

The main application component that:

- Provides theme configuration via `NConfigProvider`
- Manages global state (todos, theme, filters)
- Handles localStorage persistence
- Provides message API context
- Orchestrates all child components

**Key Features:**
```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMessage, darkTheme } from 'naive-ui'

// State management
const todos = ref<Todo[]>([])
const isDark = ref(false)
const filter = ref<FilterType>('all')

// Computed values
const filteredTodos = computed(() => {
  // Filter logic
})

const stats = computed(() => {
  // Statistics calculation
})

// Persistence
watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos))
}, { deep: true })
</script>
```

### TodoInput.vue - Task Input Component

Handles new task creation with:

- Controlled input with v-model
- Enter key submission
- Empty value validation
- Clear button
- Icon prefix
- Disabled state for empty input

**Props:** None

**Events:**
- `addTodo(text: string)`: Emitted when a new task is added

### TodoList.vue - List Container Component

Displays the list of tasks with:

- Empty state handling
- Vertical spacing
- Iteration over todos
- Event delegation to parent

**Props:**
- `todos: Todo[]`: Array of todo items to display

**Events:**
- `toggleTodo(id: string)`: Toggle task completion
- `deleteTodo(id: string)`: Delete a task
- `editTodo(id: string, newText: string)`: Edit task text

### TodoItem.vue - Individual Task Component

Represents a single task with:

- Checkbox for completion toggle
- Inline editing mode
- Delete confirmation modal
- Timestamp display
- Completed state styling
- Keyboard shortcuts (Enter to save, Escape to cancel)

**Props:**
- `todo: Todo`: The todo item object

**Events:**
- `toggle(id: string)`: Toggle completion
- `delete(id: string)`: Delete task
- `edit(id: string, newText: string)`: Update task text

## State Management

### Local State (Composition API)

This application uses Vue 3's Composition API with `ref` and `computed` for state management:

```typescript
// Reactive state
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')
const isDark = ref(false)

// Computed derived state
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(t => !t.completed)
    case 'completed':
      return todos.value.filter(t => t.completed)
    default:
      return todos.value
  }
})

const stats = computed<TodoStats>(() => {
  const total = todos.value.length
  const completed = todos.value.filter(t => t.completed).length
  const active = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, active, completed, completionRate }
})
```

### Data Flow

```
User Action
    ↓
Component Event
    ↓
Parent Handler
    ↓
State Update (todos.value)
    ↓
Computed Re-evaluation (filteredTodos, stats)
    ↓
Template Re-render
    ↓
DOM Update
```

### Persistence Strategy

```typescript
// Save to localStorage on every change
watch(
  todos,
  (newTodos) => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(newTodos))
  },
  { deep: true }  // Watch nested properties
)

// Load from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEYS.TODOS)
  if (saved) {
    todos.value = JSON.parse(saved)
  }
})
```

## Naive UI Components Used

### 1. NConfigProvider

Provides theme and configuration context to all child components:

```vue
<n-config-provider :theme="theme" :theme-overrides="themeOverrides">
  <!-- All components here inherit theme -->
</n-config-provider>
```

**Features:**
- Global theme switching
- Custom theme overrides
- Locale configuration
- Namespace customization

### 2. NLayout Components

Creates the application layout structure:

```vue
<n-layout>
  <n-layout-header bordered>
    <!-- Header content -->
  </n-layout-header>
  <n-layout-content>
    <!-- Main content -->
  </n-layout-content>
</n-layout>
```

### 3. NCard

Container component for grouping related content:

```vue
<n-card title="Add New Task" size="small">
  <!-- Card content -->
</n-card>
```

**Props used:**
- `title`: Card header text
- `size`: Card size variant
- `bordered`: Whether to show border

### 4. NSpace

Layout component for spacing elements:

```vue
<n-space vertical :size="24">
  <!-- Vertically spaced items with 24px gap -->
</n-space>
```

**Props used:**
- `vertical`: Vertical layout
- `size`: Spacing between items
- `justify`: Horizontal alignment
- `align`: Vertical alignment

### 5. NInput

Text input component:

```vue
<n-input
  v-model:value="inputValue"
  placeholder="What needs to be done?"
  size="large"
  clearable
/>
```

**Features:**
- Two-way binding with v-model
- Clearable button
- Size variants
- Prefix/suffix slots
- Keyboard events

### 6. NButton

Button component with multiple variants:

```vue
<n-button
  type="primary"
  size="large"
  :disabled="!inputValue.trim()"
  @click="handleAdd"
>
  Add Task
</n-button>
```

**Props:**
- `type`: Visual variant
- `size`: Size variant
- `disabled`: Disabled state
- `circle`: Circular button
- `secondary`: Secondary style

### 7. NCheckbox

Checkbox for task completion:

```vue
<n-checkbox
  :checked="todo.completed"
  @update:checked="handleToggle"
  size="large"
/>
```

### 8. NSelect

Dropdown select for filtering:

```vue
<n-select
  v-model:value="filter"
  :options="filterOptions"
  size="small"
/>
```

**Features:**
- Typed options
- Two-way binding
- Custom rendering
- Search functionality

### 9. NTag

Tag component for displaying statistics:

```vue
<n-tag type="info" size="large" round>
  Total: {{ stats.total }}
</n-tag>
```

**Props:**
- `type`: Color variant
- `size`: Size variant
- `round`: Rounded corners
- `closable`: Show close button

### 10. NIcon

Icon wrapper component:

```vue
<n-icon :component="AddOutline" size="20" />
```

**Usage with Vicons:**
```typescript
import { AddOutline, MoonOutline, SunnyOutline } from '@vicons/ionicons5'
```

### 11. NEmpty

Empty state component:

```vue
<n-empty
  description="No tasks found"
  size="large"
>
  <template #icon>
    <n-icon :component="DocumentTextOutline" size="48" />
  </template>
  <template #extra>
    <p>Add your first task to get started!</p>
  </template>
</n-empty>
```

### 12. NModal

Modal dialog component:

```vue
<n-modal
  v-model:show="showDeleteModal"
  preset="dialog"
  title="Delete Task"
  content="Are you sure?"
  positive-text="Delete"
  negative-text="Cancel"
  @positive-click="confirmDelete"
/>
```

**Presets:**
- `dialog`: Confirmation dialog
- `card`: Card-style modal

### 13. NMessage (Composable)

Imperative message API:

```typescript
import { useMessage } from 'naive-ui'

const message = useMessage()

// Show messages
message.success('Task added!')
message.error('Something went wrong')
message.warning('Please fill in the field')
message.info('FYI: Information here')
```

### 14. NText

Text component with variants:

```vue
<n-text
  :type="todo.completed ? 'default' : undefined"
  :depth="todo.completed ? 3 : undefined"
>
  {{ todo.text }}
</n-text>
```

**Props:**
- `type`: Color variant
- `depth`: Opacity level (1-3)
- `strong`: Bold text
- `italic`: Italic text

## Theme System

### Dark Mode Implementation

Naive UI provides a comprehensive theming system:

```typescript
import { darkTheme, type GlobalThemeOverrides } from 'naive-ui'

// Toggle theme
const isDark = ref(false)
const theme = computed(() => isDark.value ? darkTheme : null)

// Custom theme overrides
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43'
  }
}
```

### Theme Customization Levels

**1. Common Variables (affects all components):**
```typescript
{
  common: {
    primaryColor: '#18a058',
    errorColor: '#d03050',
    warningColor: '#f0a020',
    successColor: '#18a058',
    infoColor: '#2080f0',
    borderRadius: '3px',
    fontFamily: 'Inter, sans-serif'
  }
}
```

**2. Component-Specific Overrides:**
```typescript
{
  Button: {
    textColorPrimary: '#fff',
    colorPrimary: '#18a058',
    heightLarge: '48px'
  },
  Input: {
    heightLarge: '48px',
    fontSizeLarge: '16px'
  }
}
```

### Theme Persistence

```typescript
// Save theme preference
watch(isDark, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
})

// Load theme on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
})
```

## Type Safety

### Type Definitions

```typescript
// src/types.ts

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt?: number
}

export type FilterType = 'all' | 'active' | 'completed'

export type ThemeType = 'light' | 'dark'

export interface TodoStats {
  total: number
  active: number
  completed: number
  completionRate: number
}

export const STORAGE_KEYS = {
  TODOS: 'naive-ui-todos',
  THEME: 'naive-ui-theme'
} as const
```

### Type-Safe Event Handlers

```typescript
// Fully typed event emitters
const emit = defineEmits<{
  addTodo: [text: string]
  toggleTodo: [id: string]
  deleteTodo: [id: string]
  editTodo: [id: string, newText: string]
}>()

// TypeScript ensures correct usage
emit('addTodo', 'New task')        // ✅ Valid
emit('addTodo', 123)                // ❌ Error: number not assignable to string
emit('invalidEvent', 'text')        // ❌ Error: event doesn't exist
```

### Type-Safe Props

```typescript
// Define props with types
interface Props {
  todos: Todo[]
}

const props = defineProps<Props>()

// props.todos is correctly typed as Todo[]
// TypeScript will catch any misuse
```

## Best Practices

### 1. Component Composition

Break down UI into small, reusable components:

```
✅ Good: TodoInput, TodoList, TodoItem (separated)
❌ Bad: Everything in App.vue
```

### 2. TypeScript Usage

Always provide explicit types:

```typescript
✅ Good:
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')

❌ Bad:
const todos = ref([])
const filter = ref('all')
```

### 3. Computed Values

Use computed for derived state:

```typescript
✅ Good:
const filteredTodos = computed(() => {
  return todos.value.filter(/* ... */)
})

❌ Bad:
const filteredTodos = () => {
  return todos.value.filter(/* ... */)
}
```

### 4. Event Naming

Use consistent event naming:

```typescript
✅ Good:
emit('addTodo', text)
emit('deleteTodo', id)
emit('editTodo', id, text)

❌ Bad:
emit('add', text)
emit('remove', id)
emit('update', id, text)
```

### 5. Naive UI Message API

Use the message API for feedback:

```typescript
✅ Good:
const message = useMessage()
message.success('Task added!')

❌ Bad:
alert('Task added!')
console.log('Task added!')
```

### 6. localStorage Error Handling

Always handle localStorage errors:

```typescript
✅ Good:
try {
  localStorage.setItem(key, value)
} catch (error) {
  console.error('Storage error:', error)
}

❌ Bad:
localStorage.setItem(key, value)  // May throw in private mode
```

### 7. Component Props Validation

Use TypeScript interfaces for props:

```typescript
✅ Good:
interface Props {
  todos: Todo[]
  filter?: FilterType
}
defineProps<Props>()

❌ Bad:
defineProps(['todos', 'filter'])
```

## Performance Optimization

### 1. Tree Shaking

Naive UI is fully tree-shakeable. Only imported components are bundled:

```typescript
// Only these components will be in the bundle
import { NButton, NInput, NCard } from 'naive-ui'
```

### 2. Code Splitting

Vite automatically code-splits your application:

```typescript
// vite.config.ts
{
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'naive-ui': ['naive-ui'],
          'vue': ['vue']
        }
      }
    }
  }
}
```

### 3. Lazy Loading

Load components only when needed:

```typescript
// Lazy load heavy components
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)
```

### 4. Watch Optimization

Use deep watching only when necessary:

```typescript
// Deep watch (expensive)
watch(todos, () => { /* ... */ }, { deep: true })

// Shallow watch (cheaper)
watch(() => todos.value.length, () => { /* ... */ })
```

### 5. Computed Caching

Computed values are cached and only re-evaluate when dependencies change:

```typescript
// Automatically optimized
const stats = computed(() => {
  // Only runs when todos.value changes
  return calculateStats(todos.value)
})
```

## Browser Support

### Supported Browsers

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Polyfills

Not required for modern browsers. If you need to support older browsers:

```bash
npm install @vitejs/plugin-legacy
```

```typescript
// vite.config.ts
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
}
```

## Troubleshooting

### Common Issues

#### 1. Module not found: 'naive-ui'

**Solution:**
```bash
npm install naive-ui
```

#### 2. TypeScript errors in .vue files

**Solution:**
Make sure Vue TypeScript plugin is installed:
```bash
npm install -D vue-tsc
```

#### 3. Icons not displaying

**Solution:**
Install vicons package:
```bash
npm install @vicons/ionicons5
```

Import icons correctly:
```typescript
import { AddOutline } from '@vicons/ionicons5'
```

#### 4. Theme not applying

**Solution:**
Ensure `NConfigProvider` wraps your entire app:
```vue
<n-config-provider :theme="theme">
  <n-app>
    <!-- Your app -->
  </n-app>
</n-config-provider>
```

#### 5. Message API not working

**Solution:**
Call `useMessage` inside a component under `NConfigProvider`:
```typescript
// ✅ Inside component
const message = useMessage()

// ❌ Outside component context
const message = useMessage()  // Won't work
```

#### 6. localStorage errors in private mode

**Solution:**
Wrap localStorage calls in try-catch:
```typescript
try {
  localStorage.setItem(key, value)
} catch (error) {
  console.error('Storage not available')
}
```

### Development Tips

#### Enable Vue Devtools

Install Vue Devtools browser extension for debugging:
- [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

#### Type Checking in VSCode

Install Volar extension (not Vetur):
```
Vue Language Features (Volar)
TypeScript Vue Plugin (Volar)
```

#### Hot Module Replacement Issues

If HMR stops working:
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

## Further Resources

### Official Documentation

- **Naive UI Docs**: https://www.naiveui.com/
- **Vue 3 Docs**: https://vuejs.org/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **Vite Docs**: https://vitejs.dev/

### Naive UI Resources

- **GitHub Repository**: https://github.com/tusen-ai/naive-ui
- **Component Playground**: https://www.naiveui.com/en-US/os-theme/components/button
- **Theme Editor**: https://www.naiveui.com/en-US/os-theme/docs/customize-theme
- **Icon Sets**: https://www.xicons.org/

### Vue 3 Ecosystem

- **Vue Router**: https://router.vuejs.org/
- **Pinia (State Management)**: https://pinia.vuejs.org/
- **VueUse (Composables)**: https://vueuse.org/
- **Vue Test Utils**: https://test-utils.vuejs.org/

### Learning Resources

- **Naive UI Examples**: https://github.com/naive-ui/naive-ui-examples
- **Vue Mastery**: https://www.vuemastery.com/
- **Vue School**: https://vueschool.io/

### Community

- **Naive UI Discord**: https://discord.gg/Pqv7Mev5Dd
- **Vue Discord**: https://discord.com/invite/vue
- **Stack Overflow**: Tag with `naive-ui` and `vue.js`

### Comparison Articles

- [Naive UI vs Element Plus](https://dev.to/naive-ui-comparison)
- [Best Vue 3 UI Libraries 2024](https://vuejsdevelopers.com/2024/best-ui-libraries/)
- [TypeScript-First UI Libraries](https://typescript.dev/ui-libraries/)

---

## Conclusion

This Todo List application demonstrates the power and elegance of combining Vue 3 with Naive UI. The result is a type-safe, performant, and beautiful application that's easy to maintain and extend.

**Key Takeaways:**

1. **Naive UI excels in TypeScript support** - Best-in-class type safety
2. **Vue 3 Composition API** - Clean, maintainable code
3. **CSS-in-JS theming** - Dynamic, flexible styling
4. **Tree-shakeable architecture** - Optimal bundle sizes
5. **Developer experience** - Intuitive APIs and excellent documentation

Whether you're building a small project or a large enterprise application, Naive UI provides the tools and components you need to succeed.

Happy coding! 🚀

---

**Project Version:** 1.0.0
**Last Updated:** 2024
**License:** MIT
