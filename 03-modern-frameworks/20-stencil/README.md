# Stencil Todo List - Web Components Compiler

A comprehensive Todo List application built with **Stencil**, demonstrating the power of a compiler-based approach to building standards-compliant Web Components with TypeScript, JSX, and Virtual DOM.

## Table of Contents

- [What is Stencil?](#what-is-stencil)
- [Why Stencil?](#why-stencil)
- [Stencil vs Lit Comparison](#stencil-vs-lit-comparison)
- [Compiler vs Runtime Approach](#compiler-vs-runtime-approach)
- [Core Concepts](#core-concepts)
- [Decorators Deep Dive](#decorators-deep-dive)
- [Virtual DOM in Web Components](#virtual-dom-in-web-components)
- [Lazy Loading & Code Splitting](#lazy-loading--code-splitting)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Framework Integration](#framework-integration)
- [Component API](#component-api)
- [Code Examples](#code-examples)
- [Performance Optimization](#performance-optimization)
- [Testing](#testing)
- [Best Practices](#best-practices)
- [Resources](#resources)

## What is Stencil?

**Stencil** is a **compiler** for building fast, reusable web components and Progressive Web Apps (PWAs). Created by the **Ionic team**, Stencil combines the best concepts from the most popular frontend frameworks into a compile-time tool.

### Key Features

- ⚡ **Compiler-based**: Generates optimized code at build time, zero runtime overhead
- 🎯 **TypeScript First**: Built on TypeScript with full type safety
- 🎨 **JSX Support**: Familiar React-like syntax for component templates
- 🚀 **Virtual DOM**: Efficient rendering with virtual DOM diffing
- 📦 **Lazy Loading**: Automatic code splitting and lazy loading out of the box
- 🔧 **Framework Agnostic**: Works with any framework or vanilla JavaScript
- 🌐 **Standards-Based**: Outputs 100% standards-compliant Web Components
- 🎭 **Shadow DOM**: Proper style and DOM encapsulation
- 📱 **PWA Ready**: Service worker and pre-rendering support
- 🛠️ **Developer Experience**: Hot module reloading, TypeScript intellisense

### How It Works

```
TypeScript + JSX + Decorators
           ↓
    Stencil Compiler
           ↓
Optimized Web Components
(Lazy Loadable, Tree Shakeable)
```

Unlike runtime libraries, Stencil **disappears at build time**:
- No Stencil code ships to the browser
- Only optimized, vanilla Web Components
- Minimal JavaScript footprint
- Maximum performance

## Why Stencil?

### 1. Best of Both Worlds

Stencil gives you the **developer experience** of modern frameworks with the **performance** and **interoperability** of Web Components:

```typescript
// Write like React
@Component({ tag: 'my-component' })
export class MyComponent {
  @State() count = 0;

  render() {
    return <button onClick={() => this.count++}>{this.count}</button>;
  }
}

// Compiles to vanilla Web Components
// Use anywhere: <my-component></my-component>
```

### 2. Zero Runtime Overhead

Traditional frameworks ship runtime code to parse and execute your components. Stencil **eliminates the runtime**:

| Framework | Runtime Size | Approach |
|-----------|--------------|----------|
| React | ~42KB | Runtime library |
| Vue | ~33KB | Runtime library |
| Angular | ~90KB | Runtime framework |
| Lit | ~5KB | Lightweight runtime |
| **Stencil** | **~0KB** | **Compiler only** |

### 3. Framework Agnostic

Components work **everywhere**:
- ✅ React, Angular, Vue applications
- ✅ Vanilla JavaScript
- ✅ Server-side rendering
- ✅ Static HTML
- ✅ Any future framework

### 4. Production-Ready

Built by Ionic, battle-tested in:
- 🏢 Apple, Microsoft, Amazon apps
- 📱 Millions of mobile applications
- 🌍 Production enterprise applications

## Stencil vs Lit Comparison

Both Stencil and Lit are excellent choices for building Web Components, but they take fundamentally different approaches:

### Architecture Comparison

| Aspect | Stencil | Lit |
|--------|---------|-----|
| **Approach** | Compiler (build-time) | Library (runtime) |
| **Runtime Size** | 0 KB | ~5 KB |
| **Template Syntax** | JSX | Tagged Template Literals |
| **Virtual DOM** | Yes | No (direct DOM) |
| **TypeScript** | First-class support | Good support |
| **Decorators** | Extensive (@Component, @State, @Prop, @Event) | Minimal (just @customElement) |
| **Lazy Loading** | Automatic | Manual |
| **Code Splitting** | Automatic | Manual |
| **Learning Curve** | React-like (familiar) | Unique syntax |
| **Framework Integration** | Multiple output targets | Standard custom elements |
| **Build Tool** | Built-in compiler | Any bundler |
| **Development Server** | Built-in | Requires setup |

### Template Syntax

**Stencil (JSX)**:
```typescript
@Component({ tag: 'my-todo' })
export class MyTodo {
  @State() todos: Todo[] = [];

  render() {
    return (
      <div class="container">
        {this.todos.map(todo => (
          <todo-item key={todo.id} todo={todo} />
        ))}
      </div>
    );
  }
}
```

**Lit (Tagged Templates)**:
```typescript
@customElement('my-todo')
export class MyTodo extends LitElement {
  @state() todos: Todo[] = [];

  render() {
    return html`
      <div class="container">
        ${this.todos.map(todo => html`
          <todo-item .todo=${todo}></todo-item>
        `)}
      </div>
    `;
  }
}
```

### When to Choose Stencil

Choose **Stencil** when you:
- ✅ Want zero runtime overhead
- ✅ Prefer JSX and React-like syntax
- ✅ Need automatic lazy loading and code splitting
- ✅ Want a complete, opinionated toolchain
- ✅ Are building a component library for multiple frameworks
- ✅ Need Virtual DOM for complex UIs
- ✅ Want built-in development server and hot reloading
- ✅ Prefer TypeScript decorators for clean component APIs

### When to Choose Lit

Choose **Lit** when you:
- ✅ Want a minimal runtime library
- ✅ Prefer standard JavaScript without build steps (can use via CDN)
- ✅ Like template literal syntax
- ✅ Need fine-grained reactive updates
- ✅ Want simpler build configuration
- ✅ Prefer more control over bundling
- ✅ Are building simpler components

### Performance Comparison

**Stencil**:
- ✅ No runtime = smaller initial bundle
- ✅ Virtual DOM = efficient for complex UIs
- ✅ Automatic lazy loading = better code splitting
- ❌ Larger component code (JSX overhead)
- ❌ Build step required

**Lit**:
- ✅ Tiny runtime (~5KB) shared across components
- ✅ Direct DOM updates = less overhead for simple updates
- ✅ Can run without build step
- ❌ Runtime shipped to browser
- ❌ Manual lazy loading setup

**Verdict**: For large applications with many components, Stencil's zero runtime and automatic code splitting often result in **better overall performance**. For simple components or small projects, Lit's tiny runtime might be sufficient.

## Compiler vs Runtime Approach

Understanding the difference between compiler-based (Stencil) and runtime-based (React, Vue, Lit) approaches is crucial:

### Runtime Library Approach

**How it works**:
1. Library code ships to browser
2. Browser parses component definitions
3. Runtime creates and manages components
4. Runtime handles updates and lifecycle

**Example (React)**:
```javascript
// Your code
function TodoItem({ todo }) {
  return <div>{todo.text}</div>;
}

// Browser receives:
// 1. Your component code
// 2. React runtime (~42KB)
// 3. ReactDOM runtime (~130KB)

// Browser executes:
React.createElement('div', null, todo.text); // Runtime creates elements
```

**Characteristics**:
- ❌ Runtime code shipped to browser
- ❌ Larger bundle size
- ❌ Parsing overhead
- ✅ Flexible at runtime
- ✅ Hot module replacement easier

### Compiler Approach (Stencil)

**How it works**:
1. Compiler analyzes components at build time
2. Generates optimized JavaScript
3. No compiler code ships to browser
4. Browser runs pure, optimized code

**Example (Stencil)**:
```typescript
// Your code
@Component({ tag: 'todo-item' })
export class TodoItem {
  @Prop() todo!: Todo;

  render() {
    return <div>{this.todo.text}</div>;
  }
}

// Compiler generates (simplified):
class TodoItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Optimized render function (no compiler code!)
  __render() {
    this.shadowRoot.innerHTML = `<div>${this.todo.text}</div>`;
  }
}

customElements.define('todo-item', TodoItem);
```

**Characteristics**:
- ✅ No runtime shipped
- ✅ Smaller bundle size
- ✅ Faster execution
- ✅ Better tree-shaking
- ❌ Less runtime flexibility
- ❌ Requires build step

### Build-Time Optimizations

Stencil's compiler performs numerous optimizations:

#### 1. Dead Code Elimination
```typescript
// Your code
@Component({ tag: 'my-component' })
export class MyComponent {
  @State() used = true;
  @State() unused = false; // Never used

  render() {
    return <div>{this.used}</div>;
  }
}

// Compiler removes unused state, methods, imports
```

#### 2. Automatic Code Splitting
```typescript
// Compiler automatically splits:
// - Each component into separate chunk
// - Lazy loads components when used
// - Shares common dependencies

// Result:
// main.js        - 2KB  (loader)
// todo-app.js    - 3KB  (loaded on demand)
// todo-item.js   - 1KB  (loaded on demand)
```

#### 3. CSS Optimization
```typescript
@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})

// Compiler:
// - Minifies CSS
// - Inlines into component
// - Scopes to Shadow DOM
// - Removes unused styles
```

#### 4. Polyfill Loading
```javascript
// Compiler generates smart loader:
if (supportsCustomElements && supportsShadowDOM) {
  // Load modern ESM bundle
  import('./modern.js');
} else {
  // Load polyfills + ES5 bundle
  import('./polyfills.js').then(() => import('./legacy.js'));
}
```

### Output Size Comparison

**Simple Todo App** (10 components):

| Approach | Initial Load | Total Size |
|----------|--------------|------------|
| React + ReactDOM | 175 KB | 195 KB |
| Vue 3 | 50 KB | 70 KB |
| Lit | 10 KB | 30 KB |
| **Stencil** | **2 KB** | **25 KB** |

**Large App** (100 components):

| Approach | Initial Load | Total Size |
|----------|--------------|------------|
| React + ReactDOM | 175 KB | 500 KB |
| Vue 3 | 50 KB | 350 KB |
| Lit | 10 KB | 280 KB |
| **Stencil** | **2 KB** | **200 KB** |

**Why Stencil wins**:
- No runtime overhead
- Automatic code splitting
- Each component is independent
- Only load what you use

## Core Concepts

### 1. Components

Everything in Stencil is a component. Components are defined using the `@Component` decorator:

```typescript
import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-component',           // Custom element name
  styleUrl: 'my-component.css',  // Component styles
  shadow: true,                  // Enable Shadow DOM
})
export class MyComponent {
  render() {
    return <div>Hello, Stencil!</div>;
  }
}
```

### 2. Decorators

Stencil uses TypeScript decorators for component metadata:

```typescript
@Component({ tag: 'my-todo' })
export class MyTodo {
  @Prop() todoId!: string;        // Input from parent
  @State() isEditing = false;     // Internal state
  @Event() todoChanged: EventEmitter<Todo>;  // Output event
  @Listen('click') onClick() {}   // Event listener
  @Watch('todoId') onIdChange() {} // Prop watcher
}
```

### 3. Reactivity

State changes trigger re-renders automatically:

```typescript
@State() count = 0;

increment() {
  this.count++; // Component re-renders automatically
}
```

### 4. Virtual DOM

Stencil uses Virtual DOM for efficient updates:

```typescript
render() {
  return (
    <div>
      {this.items.map(item => (
        <item-card key={item.id} item={item} />
      ))}
    </div>
  );
}
// Only changed items update in real DOM
```

### 5. Lifecycle Methods

Components have lifecycle hooks:

```typescript
componentWillLoad() {
  // Before first render - fetch data
}

componentDidLoad() {
  // After first render - setup
}

componentWillUpdate() {
  // Before re-render
}

componentDidUpdate() {
  // After re-render
}

disconnectedCallback() {
  // Component removed - cleanup
}
```

## Decorators Deep Dive

Stencil's decorator system provides a clean, declarative API for component development:

### @Component Decorator

Defines a Stencil component:

```typescript
@Component({
  // Required: Custom element tag name (must contain hyphen)
  tag: 'todo-item',

  // Styles: External file
  styleUrl: 'todo-item.css',

  // Styles: Inline
  styles: `
    :host {
      display: block;
    }
  `,

  // Shadow DOM: true (encapsulated) | false (light DOM)
  shadow: true,

  // Scoped CSS (alternative to Shadow DOM)
  scoped: false,

  // Asset paths
  assetsDirs: ['assets'],

  // Form-associated custom element
  formAssociated: false,
})
export class TodoItem {
  // Component implementation
}
```

**Shadow DOM vs Scoped CSS**:

```typescript
// Shadow DOM (true encapsulation)
@Component({
  tag: 'my-component',
  shadow: true  // Styles truly encapsulated, ::part for external styling
})

// Scoped CSS (simulated encapsulation)
@Component({
  tag: 'my-component',
  scoped: true  // Stencil adds unique attributes for scoping
})

// Light DOM (no encapsulation)
@Component({
  tag: 'my-component',
  shadow: false  // Styles can leak, global CSS applies
})
```

### @Prop Decorator

Define component properties (inputs from parent):

```typescript
export class TodoItem {
  // Basic prop
  @Prop() todoId: string;

  // Required prop (TypeScript non-null assertion)
  @Prop() todo!: Todo;

  // Prop with default value
  @Prop() priority: 'low' | 'medium' | 'high' = 'medium';

  // Mutable prop (can be changed internally)
  @Prop({ mutable: true }) count = 0;

  // Reflected attribute (syncs with HTML attribute)
  @Prop({ reflect: true }) theme: 'light' | 'dark' = 'light';

  // Complex object prop
  @Prop() config: TodoConfig;

  // Watched prop (trigger function on change)
  @Prop() userId: string;
  @Watch('userId')
  onUserIdChange(newValue: string, oldValue: string) {
    console.log(`User changed from ${oldValue} to ${newValue}`);
    this.loadUserTodos();
  }
}
```

**Prop Usage**:
```html
<!-- HTML -->
<todo-item
  todo-id="123"
  priority="high"
  theme="dark"
></todo-item>

<!-- JSX -->
<todo-item
  todoId="123"
  priority="high"
  theme="dark"
  config={configObject}
/>
```

**Prop Best Practices**:
```typescript
// ✅ Good: Immutable by default
@Prop() data: Data;

// ❌ Bad: Don't modify props directly
modifyProp() {
  this.data.value = 'new'; // Error if not mutable
}

// ✅ Good: Use mutable if needed
@Prop({ mutable: true }) data: Data;
modifyProp() {
  this.data = { ...this.data, value: 'new' };
}

// ✅ Better: Use @State instead
@Prop() initialData: Data;
@State() data: Data;

componentWillLoad() {
  this.data = { ...this.initialData };
}
```

### @State Decorator

Internal component state that triggers re-renders:

```typescript
export class TodoApp {
  // Simple state
  @State() count = 0;

  // Complex state
  @State() todos: Todo[] = [];

  // Object state
  @State() filters: FilterConfig = {
    status: 'all',
    priority: 'all',
  };

  // Update state (must create new reference)
  addTodo(text: string) {
    // ✅ Good: Create new array
    this.todos = [...this.todos, newTodo];

    // ❌ Bad: Mutate existing array (won't trigger re-render)
    this.todos.push(newTodo);
  }

  updateFilters() {
    // ✅ Good: Create new object
    this.filters = { ...this.filters, status: 'active' };

    // ❌ Bad: Mutate existing object (won't trigger re-render)
    this.filters.status = 'active';
  }
}
```

**State Immutability**:
```typescript
// Arrays
@State() items: Item[] = [];

// ✅ Add item
this.items = [...this.items, newItem];

// ✅ Remove item
this.items = this.items.filter(item => item.id !== id);

// ✅ Update item
this.items = this.items.map(item =>
  item.id === id ? { ...item, completed: true } : item
);

// Objects
@State() user: User = { name: '', email: '' };

// ✅ Update object
this.user = { ...this.user, name: 'John' };

// ❌ Don't mutate
this.user.name = 'John'; // Won't trigger re-render
```

### @Event Decorator

Emit custom events to parent components:

```typescript
import { Event, EventEmitter } from '@stencil/core';

export class TodoInput {
  // Basic event
  @Event() todoAdd: EventEmitter<string>;

  // Event with options
  @Event({
    // Event name (default: camelCase to kebab-case)
    eventName: 'todo-added',

    // Composed: Event crosses shadow DOM boundary
    composed: true,

    // Cancelable: Can be preventDefault()
    cancelable: true,

    // Bubbles: Event bubbles up DOM tree
    bubbles: true,
  })
  todoAdded: EventEmitter<TodoAddedEvent>;

  // Emit event
  handleSubmit() {
    const text = this.inputValue.trim();

    // Simple emit
    this.todoAdd.emit(text);

    // Emit with complex data
    this.todoAdded.emit({
      text,
      timestamp: Date.now(),
      priority: this.priority,
    });
  }
}
```

**Listening to Events**:

```typescript
// In Parent Component (Stencil)
@Listen('todoAdd')
handleTodoAdd(event: CustomEvent<string>) {
  console.log('Todo text:', event.detail);
}

// In HTML/JavaScript
document.querySelector('todo-input')
  .addEventListener('todoAdd', (e) => {
    console.log('Todo text:', e.detail);
  });

// In React
<TodoInput onTodoAdd={(e) => console.log(e.detail)} />

// In Vue
<todo-input @todo-add="handleTodoAdd" />

// In Angular
<todo-input (todoAdd)="handleTodoAdd($event)" />
```

### @Listen Decorator

Listen to DOM events on the component or document:

```typescript
export class TodoItem {
  // Listen to events on component
  @Listen('click')
  handleClick(event: MouseEvent) {
    console.log('Component clicked');
  }

  // Listen to specific element events
  @Listen('input', { capture: true })
  handleInput(event: InputEvent) {
    console.log('Input changed');
  }

  // Listen to keyboard events
  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  // Listen to custom events from children
  @Listen('todoToggle')
  handleTodoToggle(event: CustomEvent<string>) {
    console.log('Todo toggled:', event.detail);
  }

  // Listen on document
  @Listen('click', { target: 'document' })
  handleDocumentClick(event: MouseEvent) {
    console.log('Document clicked');
  }

  // Listen on window
  @Listen('resize', { target: 'window' })
  handleResize(event: UIEvent) {
    console.log('Window resized');
  }

  // Listen with options
  @Listen('scroll', {
    target: 'window',
    capture: false,
    passive: true,
  })
  handleScroll(event: Event) {
    console.log('Scrolled');
  }
}
```

### @Watch Decorator

Watch for prop or state changes:

```typescript
export class TodoList {
  @Prop() filter: FilterType;
  @State() todos: Todo[] = [];

  // Watch prop changes
  @Watch('filter')
  onFilterChange(newValue: FilterType, oldValue: FilterType) {
    console.log(`Filter changed from ${oldValue} to ${newValue}`);
    this.filterTodos();
  }

  // Watch state changes
  @Watch('todos')
  onTodosChange(newTodos: Todo[], oldTodos: Todo[]) {
    console.log('Todos updated:', newTodos.length);
    this.saveTodos();
  }

  // Watch multiple properties
  @Watch('filter')
  @Watch('todos')
  updateDisplay() {
    this.recalculate();
  }
}
```

### @Method Decorator

Expose public methods on the component:

```typescript
export class TodoList {
  @State() todos: Todo[] = [];

  // Public method (callable from outside)
  @Method()
  async addTodo(text: string): Promise<void> {
    const newTodo = {
      id: generateId(),
      text,
      completed: false,
    };
    this.todos = [...this.todos, newTodo];
  }

  @Method()
  async getTodos(): Promise<Todo[]> {
    return this.todos;
  }

  @Method()
  async clearCompleted(): Promise<number> {
    const before = this.todos.length;
    this.todos = this.todos.filter(t => !t.completed);
    return before - this.todos.length;
  }
}

// Usage from JavaScript
const todoList = document.querySelector('todo-list');
await todoList.addTodo('New todo');
const todos = await todoList.getTodos();
const removed = await todoList.clearCompleted();
```

**Important**: Methods decorated with `@Method` must be `async` and return a `Promise`.

### @Element Decorator

Get reference to the host element:

```typescript
import { Element } from '@stencil/core';

export class TodoItem {
  // Reference to host element
  @Element() el: HTMLElement;

  componentDidLoad() {
    // Access host element
    console.log('Component width:', this.el.offsetWidth);

    // Query elements in Shadow DOM
    const input = this.el.shadowRoot!.querySelector('input');

    // Add classes
    this.el.classList.add('loaded');

    // Get attributes
    const id = this.el.getAttribute('data-id');
  }

  focusInput() {
    const input = this.el.shadowRoot!.querySelector<HTMLInputElement>('input');
    input?.focus();
  }
}
```

## Virtual DOM in Web Components

Stencil brings React's Virtual DOM efficiency to Web Components:

### What is Virtual DOM?

Virtual DOM is an in-memory representation of the real DOM that enables efficient updates:

```
Component State Changes
         ↓
Virtual DOM Diffing
         ↓
Minimal Real DOM Updates
```

### How Stencil Uses Virtual DOM

```typescript
@Component({ tag: 'todo-list' })
export class TodoList {
  @State() todos: Todo[] = [];

  render() {
    // Returns virtual DOM (JSX)
    return (
      <div class="list">
        {this.todos.map(todo => (
          <todo-item key={todo.id} todo={todo} />
        ))}
      </div>
    );
  }
}

// On state change:
// 1. Stencil creates new virtual DOM
// 2. Compares with previous virtual DOM
// 3. Calculates minimal changes
// 4. Updates only changed real DOM nodes
```

### Virtual DOM Benefits

#### 1. Efficient Updates

```typescript
// Adding one todo
this.todos = [...this.todos, newTodo];

// Without Virtual DOM:
// - Re-render entire list
// - Destroy all existing items
// - Create all items from scratch

// With Virtual DOM:
// - Diff virtual trees
// - Only add new DOM node
// - Keep existing nodes untouched
```

#### 2. Batch Updates

```typescript
// Multiple state changes
this.count++;
this.name = 'John';
this.todos = [...this.todos, newTodo];

// Virtual DOM batches updates:
// - Single re-render
// - One DOM update pass
// - Better performance
```

#### 3. Smart List Rendering

```typescript
render() {
  return (
    <div>
      {this.items.map(item => (
        // Key helps Virtual DOM identify items
        <item-card key={item.id} item={item} />
      ))}
    </div>
  );
}

// Reordering items:
// - Virtual DOM uses keys to track items
// - Moves DOM nodes instead of recreating
// - Preserves component state
```

### Virtual DOM vs Direct DOM

**Lit (Direct DOM)**:
```typescript
render() {
  return html`
    <div>${this.items.map(item => html`
      <item-card .item=${item}></item-card>
    `)}</div>
  `;
}
// Updates: Direct DOM manipulation with change detection
```

**Stencil (Virtual DOM)**:
```typescript
render() {
  return (
    <div>{this.items.map(item => (
      <item-card item={item} />
    ))}</div>
  );
}
// Updates: Virtual DOM diffing, minimal real DOM changes
```

**When Virtual DOM Wins**:
- ✅ Complex UIs with many components
- ✅ Frequent state changes
- ✅ Large lists with reordering
- ✅ Deeply nested components

**When Direct DOM Wins**:
- ✅ Simple components
- ✅ Infrequent updates
- ✅ Small lists

### JSX in Stencil

Stencil's JSX compiles to optimized Virtual DOM calls:

```typescript
// You write:
render() {
  return (
    <div class="container">
      <h1>Hello {this.name}</h1>
      <button onClick={() => this.handleClick()}>Click</button>
    </div>
  );
}

// Compiles to (simplified):
render() {
  return h('div', { class: 'container' }, [
    h('h1', null, 'Hello ', this.name),
    h('button', { onClick: () => this.handleClick() }, 'Click')
  ]);
}

// h() creates virtual DOM nodes
// Compiler optimizes for performance
```

### JSX Features

```typescript
render() {
  return (
    <div>
      {/* Conditional rendering */}
      {this.isLoggedIn && <user-profile />}
      {this.isLoading ? <spinner /> : <content />}

      {/* Lists */}
      {this.items.map(item => (
        <item-card key={item.id} item={item} />
      ))}

      {/* Attributes */}
      <input
        type="text"
        value={this.value}
        disabled={this.isDisabled}
        class={{ 'active': this.isActive, 'error': this.hasError }}
        aria-label="Input field"
      />

      {/* Event handlers */}
      <button onClick={(e) => this.handleClick(e)}>
        Click
      </button>

      {/* Props vs Attributes */}
      <todo-item
        todoId="123"              // Attribute (string)
        todo={this.todoObject}    // Prop (object)
        onTodoChange={(e) => {}}  // Event listener
      />

      {/* Fragments */}
      <>
        <div>First</div>
        <div>Second</div>
      </>

      {/* Slots */}
      <custom-card>
        <div slot="header">Header Content</div>
        <div>Default Content</div>
        <div slot="footer">Footer Content</div>
      </custom-card>
    </div>
  );
}
```

## Lazy Loading & Code Splitting

One of Stencil's most powerful features is **automatic lazy loading** and **code splitting**:

### How It Works

```
Initial Load
     ↓
Loader Script (2KB)
     ↓
Components Loaded On Demand
     ↓
Shared Dependencies Cached
```

### Automatic Code Splitting

Stencil automatically splits your app:

```typescript
// You write components normally
@Component({ tag: 'todo-app' })
export class TodoApp {}

@Component({ tag: 'todo-item' })
export class TodoItem {}

@Component({ tag: 'todo-list' })
export class TodoList {}

// Stencil generates:
// - todo-app.entry.js      (TodoApp component)
// - todo-item.entry.js     (TodoItem component)
// - todo-list.entry.js     (TodoList component)
// - shared.js              (Common dependencies)
// - loader.js              (Smart loader)
```

### Lazy Loading in Action

```html
<!-- Initial HTML -->
<!DOCTYPE html>
<html>
<head>
  <!-- Only loader script loads (2KB) -->
  <script type="module" src="/build/app.esm.js"></script>
</head>
<body>
  <!-- Component not loaded yet -->
  <todo-app></todo-app>
</body>
</html>

<!-- What happens: -->
1. Browser loads 2KB loader script
2. Loader detects <todo-app> in DOM
3. Dynamically loads todo-app.entry.js
4. todo-app renders, uses <todo-list>
5. Dynamically loads todo-list.entry.js
6. todo-list renders, uses <todo-item>
7. Dynamically loads todo-item.entry.js
8. Shared dependencies loaded once, cached
```

### Performance Benefits

**Traditional SPA** (React/Vue):
```
Initial Load: 200KB
Time to Interactive: 3s
```

**Stencil App**:
```
Initial Load: 2KB (loader)
First Component: +10KB
Time to Interactive: 0.5s
Subsequent Components: Load as needed
```

### Build Output Example

```
dist/
├── todo-app/
│   ├── todo-app.esm.js           # Modern browsers (ES modules)
│   ├── todo-app.js                # Legacy browsers (ES5)
│   └── todo-app.css               # Styles
├── components/
│   ├── todo-app.entry.js          # TodoApp component
│   ├── todo-item.entry.js         # TodoItem component
│   ├── todo-list.entry.js         # TodoList component
│   ├── todo-input.entry.js        # TodoInput component
├── shared/
│   └── common.js                  # Shared utilities
└── polyfills/
    └── core-js.js                 # Polyfills for old browsers
```

### Lazy Loading Strategies

#### 1. Component-Based Splitting (Default)

```typescript
// Each component is a separate chunk
@Component({ tag: 'todo-app' })
export class TodoApp {}

@Component({ tag: 'settings-panel' })
export class SettingsPanel {}

// Result:
// - todo-app.entry.js (loads immediately if in HTML)
// - settings-panel.entry.js (loads when first used)
```

#### 2. Route-Based Splitting

```typescript
@Component({ tag: 'app-root' })
export class AppRoot {
  @State() page = 'home';

  render() {
    return (
      <div>
        {this.page === 'home' && <home-page />}
        {this.page === 'todos' && <todos-page />}
        {this.page === 'settings' && <settings-page />}
      </div>
    );
  }
}

// Components lazy load when route changes:
// - Visit /home → home-page.entry.js loads
// - Visit /todos → todos-page.entry.js loads
// - Visit /settings → settings-page.entry.js loads
```

#### 3. Conditional Splitting

```typescript
render() {
  return (
    <div>
      {/* Heavy component only loads when needed */}
      {this.showChart && <complex-chart data={this.data} />}

      {/* Modal only loads when opened */}
      {this.isModalOpen && <modal-dialog />}
    </div>
  );
}
```

### Preloading and Prefetching

```typescript
// Preload critical components
@Component({
  tag: 'app-root',
  // Assets to preload
  assetsDirs: ['assets'],
})
export class AppRoot {
  componentWillLoad() {
    // Preload component before use
    this.preloadComponent('heavy-component');
  }

  async preloadComponent(tag: string) {
    // Custom preloading logic
    const module = await import(`./components/${tag}`);
    return module;
  }
}
```

### Bundle Size Optimization

```bash
# Analyze bundle sizes
npm run build -- --stats

# Example output:
# todo-app.entry.js      - 3.2 KB
# todo-item.entry.js     - 1.1 KB
# todo-list.entry.js     - 0.8 KB
# todo-input.entry.js    - 1.5 KB
# shared.js              - 2.0 KB
# ────────────────────────────────
# Total Initial          - 2.0 KB (loader)
# Total On-Demand        - 8.6 KB
```

## Project Structure

```
stencil-todo-list/
├── src/
│   ├── components/
│   │   ├── todo-app/
│   │   │   ├── todo-app.tsx        # Main app component
│   │   │   ├── todo-app.css        # Component styles
│   │   │   └── readme.md           # Auto-generated docs
│   │   ├── todo-input/
│   │   │   ├── todo-input.tsx      # Input component
│   │   │   └── readme.md
│   │   ├── todo-item/
│   │   │   ├── todo-item.tsx       # Item component
│   │   │   └── readme.md
│   │   └── todo-list/
│   │       ├── todo-list.tsx       # List component
│   │       └── readme.md
│   ├── utils/
│   │   ├── types.ts                # TypeScript types
│   │   └── storage.ts              # LocalStorage utils
│   └── index.html                  # HTML entry point
├── www/                            # Development build output
├── dist/                           # Production build output
├── loader/                         # Component loader
├── stencil.config.ts               # Stencil configuration
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
└── README.md                       # This file
```

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Basic TypeScript knowledge
- Understanding of Web Components (helpful but not required)

### Quick Start

```bash
# Clone or create new Stencil project
npm init stencil

# Or use this project
cd 03-modern-frameworks/20-stencil

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3333
```

### Manual Setup

```bash
# Create new directory
mkdir stencil-todo && cd stencil-todo

# Initialize npm project
npm init -y

# Install Stencil
npm install --save-dev @stencil/core

# Create basic structure
mkdir -p src/components/my-component

# Create stencil.config.ts
cat > stencil.config.ts << EOF
import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'app',
  outputTargets: [
    { type: 'www', dir: 'www' }
  ]
};
EOF

# Create component
cat > src/components/my-component/my-component.tsx << EOF
import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  shadow: true,
})
export class MyComponent {
  render() {
    return <div>Hello, Stencil!</div>;
  }
}
EOF

# Start dev server
npx stencil build --dev --watch --serve
```

## Development

### Development Server

```bash
# Start dev server with hot reload
npm start

# Or
npm run dev

# Custom port
npm run serve -- --port 3000
```

Features:
- Hot Module Replacement (HMR)
- Live reloading
- TypeScript compilation
- CSS preprocessing
- Source maps

### Component Generator

```bash
# Generate new component
npm run generate

# Follow prompts:
# ? Component tag name (dash-case): todo-filter
# ? Which additional files do you want to generate?
#   [x] Stylesheet (.css)
#   [x] Spec Test  (.spec.ts)
#   [x] E2E Test (.e2e.ts)

# Generates:
# src/components/todo-filter/
#   ├── todo-filter.tsx
#   ├── todo-filter.css
#   ├── todo-filter.spec.ts
#   └── todo-filter.e2e.ts
```

### TypeScript Features

Stencil has excellent TypeScript support:

```typescript
// Type-safe props
@Prop() todo!: Todo;  // Non-null assertion
@Prop() priority?: 'low' | 'high';  // Optional with union types

// Type-safe events
@Event() todoChange: EventEmitter<TodoChangeEvent>;

// Type-safe methods
@Method()
async getTodo(): Promise<Todo | null> {
  return this.todo;
}

// Generics
renderItems<T extends Item>(items: T[]): JSX.Element[] {
  return items.map(item => <div>{item.name}</div>);
}
```

### Debugging

```typescript
// Component debugging
componentWillLoad() {
  console.log('Props:', this.props);
  console.log('State:', this.state);
}

render() {
  console.log('Rendering with:', this.todos);
  return <div>...</div>;
}

// Browser DevTools
// - Stencil components appear as custom elements
// - Shadow DOM visible in Elements panel
// - Source maps for debugging original code
```

### Hot Module Replacement

```typescript
// HMR automatically enabled in dev mode
// Changes to these files trigger HMR:
// - .tsx files (components)
// - .css files (styles)
// - .ts files (utilities)

// HMR preserves:
// - Component state
// - Form inputs
// - Scroll position

// Requires full reload:
// - stencil.config.ts changes
// - package.json changes
// - New dependencies
```

## Building for Production

### Build Command

```bash
# Production build
npm run build

# Or with docs generation
npm run build:prod
```

### Build Output

```
dist/
├── todo-app/
│   ├── todo-app.esm.js        # ES module bundle (modern browsers)
│   ├── todo-app.js             # CommonJS bundle (legacy)
│   └── todo-app.css            # Extracted styles
├── collection/
│   ├── components/             # Component metadata
│   └── collection-manifest.json
├── types/
│   └── components.d.ts         # TypeScript declarations
└── loader/
    └── index.js                # Component loader script

www/
├── build/
│   ├── app.esm.js              # ES module entry
│   ├── app.js                  # Legacy entry
│   └── *.entry.js              # Component chunks
└── index.html                  # HTML file
```

### Deployment

#### Static Hosting (Netlify, Vercel, GitHub Pages)

```bash
# Build
npm run build

# Deploy www/ directory
# Netlify: netlify deploy --dir=www
# Vercel: vercel --prod
# GitHub Pages: Copy www/ to gh-pages branch
```

#### CDN Deployment

```html
<!-- Load from CDN -->
<script type="module"
  src="https://cdn.example.com/todo-app/todo-app.esm.js">
</script>
<script nomodule
  src="https://cdn.example.com/todo-app/todo-app.js">
</script>

<!-- Use component -->
<todo-app></todo-app>
```

#### npm Package

```bash
# Publish to npm
npm publish

# Users install
npm install your-stencil-components

# Users import
import { defineCustomElements } from 'your-stencil-components/loader';
defineCustomElements();
```

### Build Optimization

```typescript
// stencil.config.ts optimizations
export const config: Config = {
  // Minification
  minifyJs: true,
  minifyCss: true,

  // Source maps (disable for smaller builds)
  sourceMap: false,

  // ES5 build (disable if only supporting modern browsers)
  buildEs5: false,

  // Hashed filenames for caching
  hashedFileNameLength: 8,

  // Extras
  extras: {
    enableImportInjection: true,
  },
};
```

## Framework Integration

Stencil components work with **any** framework or vanilla JavaScript:

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="/build/todo-app.esm.js"></script>
</head>
<body>
  <!-- Use as HTML tag -->
  <todo-app></todo-app>

  <script>
    // Access via JavaScript
    const todoApp = document.querySelector('todo-app');

    // Listen to events
    todoApp.addEventListener('todoAdd', (e) => {
      console.log('New todo:', e.detail);
    });

    // Call methods
    todoApp.addTodo('New task');
  </script>
</body>
</html>
```

### React Integration

```bash
npm install your-stencil-components
```

```typescript
// App.tsx
import { defineCustomElements } from 'your-stencil-components/loader';

// Define custom elements
defineCustomElements();

function App() {
  const handleTodoAdd = (e: any) => {
    console.log('Todo added:', e.detail);
  };

  return (
    <div>
      {/* Use as JSX */}
      <todo-app onTodoAdd={handleTodoAdd} />
    </div>
  );
}

// TypeScript support
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'todo-app': any;
    }
  }
}
```

### Vue Integration

```bash
npm install your-stencil-components
```

```typescript
// main.ts
import { defineCustomElements } from 'your-stencil-components/loader';

defineCustomElements();

// Component.vue
<template>
  <div>
    <todo-app @todo-add="handleTodoAdd" />
  </div>
</template>

<script setup lang="ts">
const handleTodoAdd = (e: CustomEvent) => {
  console.log('Todo added:', e.detail);
};
</script>
```

### Angular Integration

```bash
npm install your-stencil-components
```

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { defineCustomElements } from 'your-stencil-components/loader';

defineCustomElements();

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})
export class AppModule {}

// component.html
<todo-app (todoAdd)="handleTodoAdd($event)"></todo-app>

// component.ts
handleTodoAdd(event: CustomEvent) {
  console.log('Todo added:', event.detail);
}
```

### Svelte Integration

```bash
npm install your-stencil-components
```

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { defineCustomElements } from 'your-stencil-components/loader';

  onMount(() => {
    defineCustomElements();
  });

  function handleTodoAdd(e) {
    console.log('Todo added:', e.detail);
  }
</script>

<todo-app on:todoAdd={handleTodoAdd} />
```

## Component API

### TodoApp Component

Main application container.

**Tag**: `<todo-app></todo-app>`

**Props**: None

**Events**:
- `todoAdd`: Emitted when a new todo is added
- `todoToggle`: Emitted when a todo is toggled
- `todoDelete`: Emitted when a todo is deleted
- `todoEdit`: Emitted when a todo is edited

**Methods**: None (internal state management)

### TodoInput Component

Input field for adding new todos.

**Tag**: `<todo-input></todo-input>`

**Props**: None

**Events**:
- `todoAdd(detail: string)`: Emitted when user submits new todo

**Example**:
```html
<todo-input></todo-input>

<script>
  document.querySelector('todo-input')
    .addEventListener('todoAdd', (e) => {
      console.log('New todo:', e.detail);
    });
</script>
```

### TodoItem Component

Individual todo item with edit/delete actions.

**Tag**: `<todo-item></todo-item>`

**Props**:
- `todo` (required): Todo object

**Events**:
- `todoToggle(detail: string)`: Todo ID when toggled
- `todoDelete(detail: string)`: Todo ID when deleted
- `todoEdit(detail: { id: string, text: string })`: Todo update data

**Example**:
```html
<todo-item></todo-item>

<script>
  const item = document.querySelector('todo-item');
  item.todo = {
    id: '1',
    text: 'Learn Stencil',
    completed: false,
    createdAt: Date.now()
  };
</script>
```

### TodoList Component

Container for rendering multiple todo items.

**Tag**: `<todo-list></todo-list>`

**Props**:
- `todos`: Array of Todo objects

**Events**: None (events bubble from TodoItem)

**Example**:
```html
<todo-list></todo-list>

<script>
  const list = document.querySelector('todo-list');
  list.todos = [
    { id: '1', text: 'Task 1', completed: false, createdAt: Date.now() },
    { id: '2', text: 'Task 2', completed: true, createdAt: Date.now() },
  ];
</script>
```

## Code Examples

### Creating a Simple Component

```typescript
import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'user-card',
  styleUrl: 'user-card.css',
  shadow: true,
})
export class UserCard {
  // Props (inputs)
  @Prop() userId!: string;
  @Prop() showDetails = false;

  // State (internal)
  @State() user: User | null = null;
  @State() isLoading = false;

  // Events (outputs)
  @Event() userLoaded: EventEmitter<User>;

  // Lifecycle
  async componentWillLoad() {
    this.isLoading = true;
    this.user = await fetchUser(this.userId);
    this.isLoading = false;
    this.userLoaded.emit(this.user);
  }

  // Render
  render() {
    if (this.isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div class="card">
        <h2>{this.user?.name}</h2>
        {this.showDetails && (
          <div class="details">
            <p>{this.user?.email}</p>
            <p>{this.user?.phone}</p>
          </div>
        )}
      </div>
    );
  }
}
```

### Form Handling

```typescript
@Component({ tag: 'todo-form' })
export class TodoForm {
  @State() formData = {
    title: '',
    description: '',
    priority: 'medium'
  };

  @Event() formSubmit: EventEmitter<TodoFormData>;

  handleInput = (field: string) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.formData = {
      ...this.formData,
      [field]: target.value
    };
  };

  handleSubmit = (e: Event) => {
    e.preventDefault();
    this.formSubmit.emit(this.formData);
    this.resetForm();
  };

  resetForm = () => {
    this.formData = {
      title: '',
      description: '',
      priority: 'medium'
    };
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.formData.title}
          onInput={this.handleInput('title')}
          placeholder="Title"
        />

        <textarea
          value={this.formData.description}
          onInput={this.handleInput('description')}
          placeholder="Description"
        />

        <select
          value={this.formData.priority}
          onChange={this.handleInput('priority')}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit">Add Todo</button>
      </form>
    );
  }
}
```

### Async Data Loading

```typescript
@Component({ tag: 'data-list' })
export class DataList {
  @Prop() apiUrl!: string;
  @State() items: Item[] = [];
  @State() isLoading = false;
  @State() error: string | null = null;

  async componentWillLoad() {
    await this.fetchData();
  }

  @Watch('apiUrl')
  async onUrlChange() {
    await this.fetchData();
  }

  async fetchData() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch');
      this.items = await response.json();
    } catch (err) {
      this.error = err.message;
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    if (this.isLoading) {
      return <loading-spinner />;
    }

    if (this.error) {
      return <error-message message={this.error} />;
    }

    return (
      <div>
        {this.items.map(item => (
          <item-card key={item.id} item={item} />
        ))}
      </div>
    );
  }
}
```

## Performance Optimization

### 1. Use Functional Components for Simple Cases

```typescript
// Heavy component (not needed for simple cases)
@Component({ tag: 'simple-card' })
export class SimpleCard {
  @Prop() title!: string;
  render() {
    return <div>{this.title}</div>;
  }
}

// Better: Functional component (lighter)
export const SimpleCard: FunctionalComponent<{ title: string }> = ({ title }) => (
  <div>{title}</div>
);
```

### 2. Optimize List Rendering

```typescript
render() {
  return (
    <div>
      {/* ✅ Good: Use key for efficient diffing */}
      {this.items.map(item => (
        <item-card key={item.id} item={item} />
      ))}

      {/* ❌ Bad: No key, re-renders everything */}
      {this.items.map(item => (
        <item-card item={item} />
      ))}
    </div>
  );
}
```

### 3. Lazy Load Heavy Components

```typescript
@Component({ tag: 'app-root' })
export class AppRoot {
  @State() showHeavyComponent = false;

  render() {
    return (
      <div>
        <button onClick={() => this.showHeavyComponent = true}>
          Load Heavy Component
        </button>

        {/* Only loads when showHeavyComponent is true */}
        {this.showHeavyComponent && <heavy-chart />}
      </div>
    );
  }
}
```

### 4. Minimize Re-renders

```typescript
// ✅ Good: Immutable updates
addItem(item: Item) {
  this.items = [...this.items, item];
}

// ❌ Bad: Mutation (won't trigger re-render)
addItem(item: Item) {
  this.items.push(item);
}

// ✅ Good: Batch state updates
updateData() {
  this.count = this.count + 1;
  this.name = 'New Name';
  this.items = [...this.items, newItem];
  // Single re-render
}
```

## Testing

Stencil includes powerful testing utilities:

### Unit Testing

```typescript
// todo-item.spec.ts
import { newSpecPage } from '@stencil/core/testing';
import { TodoItem } from './todo-item';

describe('todo-item', () => {
  it('renders todo text', async () => {
    const page = await newSpecPage({
      components: [TodoItem],
      html: `<todo-item></todo-item>`,
    });

    page.root.todo = {
      id: '1',
      text: 'Test todo',
      completed: false,
      createdAt: Date.now()
    };

    await page.waitForChanges();

    expect(page.root.shadowRoot.textContent).toContain('Test todo');
  });

  it('emits todoToggle event on checkbox click', async () => {
    const page = await newSpecPage({
      components: [TodoItem],
      html: `<todo-item></todo-item>`,
    });

    const spy = jest.fn();
    page.root.addEventListener('todoToggle', spy);

    const checkbox = page.root.shadowRoot.querySelector('input[type="checkbox"]');
    checkbox.click();

    await page.waitForChanges();

    expect(spy).toHaveBeenCalled();
  });
});
```

### E2E Testing

```typescript
// todo-app.e2e.ts
import { newE2EPage } from '@stencil/core/testing';

describe('todo-app', () => {
  it('adds new todo', async () => {
    const page = await newE2EPage();
    await page.setContent('<todo-app></todo-app>');

    const input = await page.find('todo-app >>> input[type="text"]');
    const button = await page.find('todo-app >>> button[type="submit"]');

    await input.type('New todo');
    await button.click();

    await page.waitForChanges();

    const items = await page.findAll('todo-app >>> todo-item');
    expect(items.length).toBe(1);
  });
});
```

## Best Practices

### 1. Component Design

```typescript
// ✅ Good: Single responsibility
@Component({ tag: 'todo-item' })
export class TodoItem {
  @Prop() todo!: Todo;
  @Event() todoToggle: EventEmitter<string>;
  // Focused on displaying single todo
}

// ❌ Bad: Too many responsibilities
@Component({ tag: 'todo-everything' })
export class TodoEverything {
  // Handles input, display, filtering, storage, etc.
}
```

### 2. Props and State

```typescript
// ✅ Good: Props are immutable
@Prop() data: Data;

updateData() {
  this.dataChange.emit({ ...this.data, updated: true });
}

// ❌ Bad: Mutating props
@Prop() data: Data;

updateData() {
  this.data.value = 'new'; // Don't modify props!
}
```

### 3. Event Naming

```typescript
// ✅ Good: Descriptive event names
@Event() todoAdded: EventEmitter<Todo>;
@Event() todoDeleted: EventEmitter<string>;
@Event() filterChanged: EventEmitter<FilterType>;

// ❌ Bad: Generic event names
@Event() change: EventEmitter<any>;
@Event() click: EventEmitter<any>;
```

### 4. TypeScript Usage

```typescript
// ✅ Good: Strong typing
@Prop() priority!: 'low' | 'medium' | 'high';
@Event() statusChanged: EventEmitter<StatusChange>;

interface StatusChange {
  from: Status;
  to: Status;
  timestamp: number;
}

// ❌ Bad: Any types
@Prop() data: any;
@Event() change: EventEmitter<any>;
```

## Resources

### Official Documentation

- [Stencil Documentation](https://stenciljs.com/docs/introduction)
- [Stencil API Reference](https://stenciljs.com/docs/api)
- [Stencil GitHub](https://github.com/ionic-team/stencil)

### Learning Resources

- [Stencil Tutorial](https://stenciljs.com/docs/getting-started)
- [Component API Guide](https://stenciljs.com/docs/decorators)
- [Stencil Style Guide](https://stenciljs.com/docs/style-guide)

### Community

- [Stencil Slack](https://stencil-worldwide.slack.com)
- [Ionic Forum](https://forum.ionicframework.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/stencil)

### Comparison Resources

- [Stencil vs React](https://stenciljs.com/docs/framework-comparison)
- [Stencil vs Lit](https://stenciljs.com/docs/web-components)
- [Web Components Guide](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

## License

MIT License - feel free to use this code for learning and projects!

---

**Built with Stencil** - The compiler for building fast, reusable web components and Progressive Web Apps.
