# Qwik Todo App - Architecture Documentation

## 🏗️ Overview

This document details the architecture and design decisions behind the Qwik Todo application.

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  HTML DOM  │  │   Qwik     │  │  Lazy-Load │        │
│  │   Ready    │◄─┤  Runtime   │◄─┤  Handlers  │        │
│  │ (Visible)  │  │  (1 KB)    │  │ (On-Demand)│        │
│  └────────────┘  └────────────┘  └────────────┘        │
│         ▲              ▲                ▲               │
│         │              │                │               │
└─────────┼──────────────┼────────────────┼───────────────┘
          │              │                │
          │         Serialized State      │
          │              │                │
┌─────────┼──────────────┼────────────────┼───────────────┐
│         │              │                │               │
│  ┌──────▼──────┐  ┌───▼──────┐   ┌────▼──────┐        │
│  │   HTML      │  │  State   │   │  Code     │        │
│  │  Generation │  │  Snapshot│   │  Chunks   │        │
│  └─────────────┘  └──────────┘   └───────────┘        │
│                                                          │
│                    Server (SSR)                          │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### Initial Page Load

```
1. User requests page
   └─> Server receives request

2. Server executes components
   └─> Renders HTML
   └─> Serializes application state
   └─> Embeds QRLs (Qwik Runtime Library references)

3. Server sends response
   └─> HTML (15 KB)
   └─> Minimal CSS (10 KB)
   └─> Tiny runtime (1 KB)

4. Browser displays page
   └─> Content visible immediately
   └─> No JavaScript execution needed
   └─> ✅ INTERACTIVE (Time to Interactive: ~50ms)
```

### User Interaction

```
1. User clicks button
   └─> Browser detects event

2. Qwik runtime checks QRL
   └─> Finds handler reference: "chunk-abc.js#handleClick"

3. Lazy-loads handler chunk
   └─> Downloads ONLY that handler (2 KB)
   └─> Executes handler

4. State updates
   └─> Reactive system detects change
   └─> Re-renders affected components
   └─> Updates DOM

5. Handler cached
   └─> Subsequent clicks are instant
```

## 📦 Component Architecture

### Component Hierarchy

```
index.tsx (Main Route)
├── TodoInput
│   ├── Toggle All Button
│   ├── Input Field
│   └── Add Button
├── TodoList
│   └── TodoItem (repeated)
│       ├── Checkbox
│       ├── Text / Edit Input
│       ├── Edit Button
│       └── Delete Button
└── Footer
    ├── Counter
    ├── Filters
    └── Clear Completed
```

### Component Communication

```typescript
// Parent → Child (Props)
<TodoItem
  todo={todo}           // Data down
  onToggle$={toggle$}   // Events up (QRL)
/>

// Child → Parent (Event Handlers)
const toggle$ = $((id: number) => {
  // Parent handles the logic
  updateTodoState(id);
});
```

## 🗄️ State Management

### State Architecture

```
Application State
├── todoStore (useStore)
│   ├── todos: Todo[]
│   │   ├── id: number
│   │   ├── text: string
│   │   └── completed: boolean
│   └── filter: 'all' | 'active' | 'completed'
│
└── inputValue (useSignal)
    └── value: string
```

### State Flow

```
┌─────────────────┐
│  User Action    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Event Handler  │◄─── Lazy-loaded on demand
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  State Update   │
│  (useStore)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Reactive       │
│  Re-render      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  DOM Update     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  localStorage   │
│  Persistence    │
└─────────────────┘
```

## 💾 Data Persistence

### LocalStorage Strategy

```typescript
// Load on mount (client-side only)
useVisibleTask$(() => {
  const stored = localStorage.getItem('qwik-todos');
  if (stored) {
    todoStore.todos = JSON.parse(stored);
  }
});

// Save on every change
useVisibleTask$(({ track }) => {
  track(() => todoStore.todos);
  localStorage.setItem('qwik-todos', JSON.stringify(todoStore.todos));
});
```

### Data Flow

```
Page Load → Check localStorage → Load todos → Display
    │                                            │
    └────────────────────────────────────────────┘
                      │
                User Edit
                      │
                      ▼
             Update State → Save to localStorage
                      │
                      └─────► Next Page Load
```

## ⚡ Performance Optimizations

### 1. Lazy Loading Strategy

Every function marked with `$` becomes a separate chunk:

```typescript
// Each handler is its own chunk
const addTodo$ = $(() => { ... });      // → chunk-001.js
const toggleTodo$ = $(() => { ... });   // → chunk-002.js
const deleteTodo$ = $(() => { ... });   // → chunk-003.js
```

### 2. Code Splitting Points

```
Initial Load:
├── HTML (15 KB)
├── Qwik Runtime (1 KB)
└── CSS (10 KB)
Total: 26 KB

User Adds Todo:
└── Add Handler (2 KB)

User Toggles Filter:
└── Filter Handler (1 KB)

User Edits Todo:
└── Edit Handler (2 KB)
```

### 3. Bundle Optimization

```javascript
// Vite configuration
export default defineConfig({
  build: {
    minify: 'terser',           // Aggressive minification
    cssCodeSplit: true,         // Split CSS
    rollupOptions: {
      output: {
        manualChunks: (id) => { // Smart chunking
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
```

## 🎨 UI/UX Architecture

### Design System

```
Colors:
├── Primary: Purple (#8b5cf6)
├── Secondary: Blue (#3b82f6)
├── Success: Green (#10b981)
├── Error: Red (#ef4444)
└── Neutral: Gray (#6b7280)

Typography:
├── Headings: Bold, Large
├── Body: Regular, Medium
└── Labels: Semi-bold, Small

Spacing:
├── Container: max-w-2xl
├── Padding: 1rem - 2rem
└── Gaps: 0.5rem - 1rem
```

### Responsive Breakpoints

```css
/* Mobile First */
Default: 320px+

/* Tablet */
sm: 640px+

/* Desktop */
lg: 1024px+
```

## 🔐 Type Safety

### TypeScript Interfaces

```typescript
// Domain Models
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

// Component Props
interface TodoItemProps {
  todo: Todo;
  onToggle$: QRL<(id: number) => void>;
  onDelete$: QRL<(id: number) => void>;
  onEdit$: QRL<(id: number, text: string) => void>;
}
```

## 🧪 Testing Strategy (Future)

### Recommended Testing Approach

```
Unit Tests:
├── State management logic
├── Event handlers
└── Utility functions

Integration Tests:
├── Component interactions
├── State updates
└── LocalStorage integration

E2E Tests:
├── User workflows
├── Performance metrics
└── Cross-browser compatibility
```

## 🚀 Deployment Architecture

### Build Output

```
dist/
├── q-*.js              # Qwik chunks (lazy-loaded)
├── index.html          # Entry point
├── assets/
│   ├── *.css          # Styles
│   └── *.svg          # Icons
└── manifest.json       # PWA manifest

server/
└── entry.*.js         # SSR entry points
```

### Hosting Options

```
Static Hosting (Simplified):
├── Netlify
├── Vercel
├── Cloudflare Pages
└── GitHub Pages

SSR Hosting (Full Features):
├── Vercel (Recommended)
├── Netlify Functions
├── Cloudflare Workers
└── Node.js servers
```

## 📊 Performance Metrics

### Target Metrics

```
Lighthouse Scores:
├── Performance: 100
├── Accessibility: 100
├── Best Practices: 100
└── SEO: 100

Core Web Vitals:
├── LCP: < 200ms
├── FID: < 10ms
├── CLS: < 0.01
└── TTI: < 50ms
```

## 🔄 State Synchronization

### Sync Flow

```
Component State ←→ LocalStorage
       ↕
   React to changes
       ↕
   Update UI
       ↕
   User Feedback
```

## 🎯 Design Principles

1. **Resumability First**: Never hydrate, always resume
2. **Lazy Everything**: Load only what's needed
3. **Progressive Enhancement**: Works without JS
4. **Type Safety**: TypeScript everywhere
5. **User Experience**: Instant feedback
6. **Accessibility**: WCAG 2.1 AA compliant
7. **Performance**: O(1) complexity
8. **Maintainability**: Clear separation of concerns

## 📝 Key Architectural Decisions

### Why useStore over useSignal for todos?

- Deep reactivity for nested objects
- Direct mutation support
- Better performance for complex state

### Why separate components?

- Better lazy loading
- Clearer separation of concerns
- Easier testing and maintenance

### Why useVisibleTask$ for localStorage?

- Only runs on client (localStorage is browser API)
- Automatic cleanup
- Tracks dependencies efficiently

### Why QRL types for event handlers?

- Enables lazy loading
- Type-safe cross-boundary calls
- Serializable for SSR

## 🔮 Future Enhancements

1. **Server-side persistence**: PostgreSQL/MongoDB
2. **Real-time sync**: WebSockets
3. **Offline support**: Service Workers
4. **Multi-user**: Authentication & authorization
5. **Advanced features**: Tags, priorities, due dates
6. **Analytics**: Track user interactions
7. **A/B testing**: Qwik's perfect for it!

---

**Architecture Version**: 1.0.0
**Last Updated**: 2024-01-15
**Qwik Version**: 1.5.0
