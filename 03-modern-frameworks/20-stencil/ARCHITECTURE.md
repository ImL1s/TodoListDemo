# Stencil Todo List - Architecture Diagram

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                       todo-app                          │
│  (Main Container - State Management & Coordination)     │
│                                                          │
│  @State: todos[], filter                                │
│  @Listen: todoAdd, todoToggle, todoDelete, todoEdit     │
│  Responsibilities:                                       │
│  • Global state management                              │
│  • Event coordination                                   │
│  • Filtering logic                                      │
│  • LocalStorage integration                             │
│  • Statistics calculation                               │
└───┬────────────────────────────────────────────────────┘
    │
    ├──┬──────────────────────────────────────────┐
    │  │                                           │
    ▼  ▼                                           ▼
┌────────────┐                           ┌──────────────┐
│ todo-input │                           │  todo-list   │
│  (Create)  │                           │ (Container)  │
│            │                           │              │
│ @State:    │                           │ @Prop:       │
│ inputValue │                           │ todos[]      │
│            │                           │              │
│ @Event:    │                           └──────┬───────┘
│ todoAdd    │                                  │
└────────────┘                                  │
                                                ▼
                                         ┌──────────────┐
                                         │  todo-item   │
                                         │  (Display)   │ (×N)
                                         │              │
                                         │ @Prop: todo  │
                                         │ @State:      │
                                         │ isEditing    │
                                         │              │
                                         │ @Event:      │
                                         │ todoToggle   │
                                         │ todoDelete   │
                                         │ todoEdit     │
                                         └──────────────┘
```

## Data Flow

```
User Input → Component State → Event Emission → Parent Handler → State Update → Re-render

Example Flow (Add Todo):

1. User types in <todo-input>
   └─> inputValue @State updates

2. User clicks "Add Todo"
   └─> handleSubmit() called
       └─> todoAdd @Event emits text

3. <todo-app> receives event
   └─> @Listen('todoAdd') triggers
       └─> handleAddTodo() called
           └─> todos @State updated
               └─> saveTodos() persists to localStorage

4. Virtual DOM diff
   └─> Only new todo-item rendered
       └─> Existing items unchanged
```

## Event Flow Diagram

```
┌─────────────┐                    ┌──────────────┐
│  todo-input │                    │   todo-item  │
│             │                    │              │
│  [Input]    │                    │  [Checkbox]  │
│  [Button]   │                    │  [Edit Btn]  │
└──────┬──────┘                    │  [Delete]    │
       │                           └───────┬──────┘
       │ @Event: todoAdd                  │
       │ detail: string                   │ @Event: todoToggle
       │                                  │ detail: string
       │                                  │
       │                                  │ @Event: todoEdit
       │                                  │ detail: {id, text}
       │                                  │
       │                                  │ @Event: todoDelete
       │                                  │ detail: string
       │                                  │
       ▼                                  ▼
┌──────────────────────────────────────────────────┐
│              todo-app (@Listen)                  │
│                                                   │
│  @Listen('todoAdd')    → handleAddTodo()         │
│  @Listen('todoToggle') → handleToggleTodo()      │
│  @Listen('todoEdit')   → handleEditTodo()        │
│  @Listen('todoDelete') → handleDeleteTodo()      │
│                                                   │
└───────────────────┬───────────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  localStorage │
            │   persistence │
            └───────────────┘
```

## State Management Pattern

```
┌──────────────────────────────────────────────────┐
│               Component State                     │
│                                                   │
│  @State() todos: Todo[] = []                     │
│  @State() filter: FilterType = 'all'             │
└───────────────────┬───────────────────────────────┘
                    │
                    │ User Action
                    ▼
            ┌───────────────┐
            │  Event Handler│
            │  (Immutable)  │
            └───────┬───────┘
                    │
                    │ Create new reference
                    ▼
            ┌───────────────┐
            │  State Update │
            │  this.todos = │
            │  [...spread]  │
            └───────┬───────┘
                    │
                    │ Auto-trigger
                    ▼
            ┌───────────────┐
            │  Re-render    │
            │  (Virtual DOM)│
            └───────┬───────┘
                    │
                    │ Diff & Patch
                    ▼
            ┌───────────────┐
            │  Real DOM     │
            │  Update       │
            └───────────────┘
```

## Lifecycle Flow

```
Component Creation:
  constructor()
      ↓
  componentWillLoad()  ← Load from localStorage
      ↓
  render()
      ↓
  componentDidLoad()

State Change:
  State Updated
      ↓
  componentWillUpdate()
      ↓
  render()
      ↓
  componentDidUpdate()

Component Removal:
  disconnectedCallback()  ← Cleanup
```

## Build Process Flow

```
Source Code (TypeScript + JSX + Decorators)
              ↓
┌─────────────────────────────┐
│     Stencil Compiler        │
│                             │
│  • Parse TypeScript         │
│  • Process Decorators       │
│  • Compile JSX to h()       │
│  • Generate Virtual DOM     │
│  • Optimize bundles         │
│  • Tree shake dead code     │
│  • Split into chunks        │
└──────────────┬──────────────┘
               │
               ├──────────────┬──────────────┐
               ▼              ▼              ▼
         ┌─────────┐    ┌─────────┐    ┌─────────┐
         │ ES2017  │    │  ES5    │    │  Types  │
         │ Modules │    │ Legacy  │    │  .d.ts  │
         └─────────┘    └─────────┘    └─────────┘

Final Output:
  www/build/
  ├── app.esm.js          (2 KB loader)
  ├── todo-app.entry.js   (lazy loaded)
  ├── todo-input.entry.js (lazy loaded)
  ├── todo-item.entry.js  (lazy loaded)
  └── todo-list.entry.js  (lazy loaded)
```

## Lazy Loading Flow

```
1. Browser loads HTML
   └─> <script src="app.esm.js"></script>
       (Only 2 KB loader)

2. Loader initializes
   └─> Scans DOM for custom elements
       └─> Found: <todo-app>

3. Dynamic import
   └─> import('./todo-app.entry.js')
       └─> Component loads (3 KB)

4. TodoApp renders
   └─> Uses <todo-list>
       └─> import('./todo-list.entry.js')
           └─> Component loads (0.8 KB)

5. TodoList renders
   └─> Uses <todo-item>
       └─> import('./todo-item.entry.js')
           └─> Component loads (1.1 KB)

6. All components cached
   └─> Subsequent uses = instant
```

## Virtual DOM Update Flow

```
State Change:
  this.todos = [...this.todos, newTodo]
              ↓
┌─────────────────────────┐
│   render() called       │
│   Returns JSX/VNodes    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Virtual DOM Created   │
│   (New tree)            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Diff Algorithm        │
│   Compare old vs new    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Minimal Patch List    │
│   • Add node at index 5 │
│   • Update text node 3  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Apply to Real DOM     │
│   (Only changed nodes)  │
└─────────────────────────┘
```

## Decorator System Overview

```
@Component
├─> Defines custom element
├─> Configures Shadow DOM
└─> Sets styles

@Prop
├─> Receives data from parent
├─> Immutable by default
├─> Can reflect to attribute
└─> Triggers re-render on change

@State
├─> Internal component state
├─> Triggers re-render on change
├─> Requires new reference
└─> Not accessible from outside

@Event
├─> Declares custom events
├─> Type-safe with EventEmitter<T>
├─> Bubbles through DOM
└─> Can be composed

@Listen
├─> Handles DOM events
├─> Handles custom events
├─> Target: component/document/window
└─> Capture/bubble phase

@Watch
├─> Observes Prop/State changes
├─> Called with new/old values
└─> Before render

@Method
├─> Public API methods
├─> Must be async
├─> Returns Promise
└─> Callable from JavaScript
```

## File Organization

```
src/
├── components/          (Feature components)
│   ├── todo-app/       (Container component)
│   │   ├── tsx         (Component logic)
│   │   └── css         (Scoped styles)
│   ├── todo-input/     (Input component)
│   ├── todo-item/      (Item component)
│   └── todo-list/      (List component)
├── utils/              (Shared utilities)
│   ├── types.ts        (TypeScript types)
│   └── storage.ts      (Persistence layer)
└── index.html          (Entry point)

Config Files:
├── stencil.config.ts   (Build configuration)
├── tsconfig.json       (TypeScript config)
└── package.json        (Dependencies)

Output:
├── dist/               (npm package)
├── www/                (Standalone app)
└── loader/             (Component loader)
```

## Shadow DOM Encapsulation

```
<todo-app>
  #shadow-root
    ├── <style> (Scoped CSS)
    └── <div class="todo-app">
        ├── <header>
        ├── <main>
        │   ├── <todo-input>
        │   │   #shadow-root
        │   │     ├── <style>
        │   │     └── <form>...</form>
        │   └── <todo-list>
        │       #shadow-root
        │         ├── <style>
        │         └── <div>
        │             ├── <todo-item>
        │             │   #shadow-root
        │             │     ├── <style>
        │             │     └── <div>...</div>
        │             └── <todo-item>
        │                 #shadow-root
        └── <footer>

Each component has isolated:
• Styles (no leaks)
• DOM tree (encapsulated)
• Event scope (can bubble if configured)
```

## Performance Optimization Strategies

```
1. Lazy Loading
   └─> Components load only when used
       └─> Reduces initial bundle

2. Code Splitting
   └─> Each component = separate chunk
       └─> Parallel loading

3. Virtual DOM
   └─> Minimal real DOM updates
       └─> Faster rendering

4. Tree Shaking
   └─> Remove unused code
       └─> Smaller bundles

5. Compilation
   └─> No runtime overhead
       └─> Zero framework cost

6. Caching
   └─> Components cached after load
       └─> Instant subsequent use
```

## Type System Integration

```
TypeScript Types
       ↓
┌─────────────────┐
│  Interface Todo │
│  type Filter    │
└────────┬────────┘
         │
         ├──────────────┬─────────────┐
         ▼              ▼             ▼
    ┌────────┐    ┌─────────┐   ┌─────────┐
    │ @Prop  │    │ @State  │   │ @Event  │
    │ todo!: │    │ todos:  │   │ <Todo>  │
    │ Todo   │    │ Todo[]  │   │         │
    └────────┘    └─────────┘   └─────────┘
         │              │             │
         └──────────────┴─────────────┘
                    │
                    ▼
          ┌──────────────────┐
          │  Compile-time    │
          │  Type Checking   │
          └──────────────────┘
```

## Comparison: Runtime vs Compiler

```
Runtime Approach (React/Vue/Lit):
┌──────────────┐
│  Your Code   │
├──────────────┤
│  Framework   │  ← Shipped to browser
│  Runtime     │     (~5-42 KB)
└──────┬───────┘
       │ Browser executes
       ▼
┌──────────────┐
│  Real DOM    │
└──────────────┘

Compiler Approach (Stencil):
┌──────────────┐
│  Your Code   │
├──────────────┤
│   Stencil    │  ← Build time only
│  Compiler    │     (Not shipped)
└──────┬───────┘
       │ Compiles to
       ▼
┌──────────────┐
│ Optimized    │  ← Only this ships
│ Web Component│     (~2-3 KB/component)
└──────┬───────┘
       │ Browser runs
       ▼
┌──────────────┐
│  Real DOM    │
└──────────────┘
```

## Framework Integration Pattern

```
Framework (React/Vue/Angular)
          ↓
    Load Stencil Loader
          ↓
    defineCustomElements()
          ↓
    Components registered
          ↓
    Use as native elements
          ↓
    <todo-app></todo-app>

Works with:
• React (JSX)
• Vue (Templates)
• Angular (Templates)
• Svelte (HTML)
• Vanilla JS (HTML)
```

## Summary

This architecture demonstrates:

✅ **Compiler-based optimization** - Zero runtime overhead
✅ **Component encapsulation** - Shadow DOM isolation
✅ **Efficient updates** - Virtual DOM diffing
✅ **Lazy loading** - Automatic code splitting
✅ **Type safety** - Full TypeScript integration
✅ **Event-driven** - Clean component communication
✅ **Framework agnostic** - Standards-based output
✅ **Developer experience** - React-like DX with better performance

**Stencil = React DX + Web Components + Zero Runtime Cost**
