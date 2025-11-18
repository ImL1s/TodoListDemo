# Lit Todo App - Complete Web Components Implementation

A comprehensive Todo List application built with **Lit 3.0**, demonstrating the power of modern Web Components for building fast, lightweight, and framework-agnostic applications.

## Table of Contents

- [Overview](#overview)
- [What is Lit?](#what-is-lit)
- [Web Components Standards](#web-components-standards)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Lit Reactive Properties](#lit-reactive-properties)
- [Shadow DOM and Styling](#shadow-dom-and-styling)
- [Event System](#event-system)
- [Lifecycle Methods](#lifecycle-methods)
- [Directives and Templates](#directives-and-templates)
- [TypeScript Integration](#typescript-integration)
- [LocalStorage Persistence](#localstorage-persistence)
- [Comparison with React/Vue](#comparison-with-reactvue)
- [Framework Interoperability](#framework-interoperability)
- [Performance Characteristics](#performance-characteristics)
- [Best Practices](#best-practices)
- [Testing Strategies](#testing-strategies)
- [Production Deployment](#production-deployment)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

## Overview

This Todo application showcases a production-ready implementation using Lit, Google's library for building fast, lightweight web components. The application demonstrates all core Web Component APIs and Lit features while maintaining excellent performance and developer experience.

### Live Demo Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Filter by all/active/completed
- ✅ Edit todos inline with double-click
- ✅ LocalStorage persistence
- ✅ Real-time statistics
- ✅ Responsive design
- ✅ Accessible (ARIA labels, keyboard navigation)
- ✅ Animations and transitions
- ✅ TypeScript for type safety

## What is Lit?

**Lit** is a simple library for building fast, lightweight web components. Created and maintained by Google, Lit builds on standard Web Components APIs and provides:

### Core Philosophy

1. **Standards-Based**: Built on Web Components standards (Custom Elements, Shadow DOM, HTML Templates)
2. **Minimal Runtime**: Only ~5KB (minified + gzipped)
3. **No Build Required**: Works directly in browsers (though we use TypeScript + Vite for DX)
4. **Framework-Agnostic**: Can be used with React, Vue, Angular, or vanilla JavaScript
5. **Future-Proof**: Built on web standards that won't change

### Key Differences from Frameworks

Unlike React or Vue, Lit is not a framework but a **library** that:
- Has no virtual DOM
- Uses real DOM with efficient updates
- Encapsulates styles with Shadow DOM
- Creates true custom HTML elements
- Works without a build step (in production)
- Has no dependencies

### When to Use Lit

**Choose Lit when you need:**
- Reusable components across multiple projects/frameworks
- Design systems and component libraries
- Performance-critical applications
- Small bundle sizes
- Web standards compliance
- Framework migration paths

**Consider alternatives when:**
- Building large single-framework applications (React/Vue might be better)
- Team has no Web Components experience
- Heavy reliance on framework-specific ecosystems

## Web Components Standards

Lit builds on four core Web Components standards:

### 1. Custom Elements

Custom Elements allow you to define your own HTML tags with custom behavior.

```typescript
// Define a custom element
@customElement('my-element')
export class MyElement extends LitElement {
  render() {
    return html`<p>Hello from a custom element!</p>`;
  }
}

// Use it in HTML
// <my-element></my-element>
```

**Key Concepts:**
- Element names must contain a hyphen (e.g., `todo-app`, not `todoapp`)
- Elements must extend `HTMLElement` (or `LitElement` which extends it)
- Elements can be used like any HTML tag
- Support lifecycle callbacks (connectedCallback, disconnectedCallback, etc.)

### 2. Shadow DOM

Shadow DOM provides encapsulation for DOM and CSS, preventing styles and scripts from leaking in or out.

```typescript
@customElement('styled-element')
export class StyledElement extends LitElement {
  static styles = css`
    p {
      color: blue; /* Only affects this component */
    }
  `;

  render() {
    return html`<p>I'm styled in isolation!</p>`;
  }
}
```

**Benefits:**
- **Style Encapsulation**: CSS doesn't leak in or out
- **DOM Encapsulation**: Internal structure is hidden
- **Composition**: Clear component boundaries
- **Predictability**: No global CSS conflicts

**Challenges:**
- Cannot style internals from outside (by design)
- Need to learn CSS custom properties for theming
- Some global styles (fonts) need explicit inheritance

### 3. HTML Templates

Lit uses tagged template literals for declarative rendering:

```typescript
render() {
  const name = 'World';
  const items = ['one', 'two', 'three'];

  return html`
    <h1>Hello ${name}</h1>
    <ul>
      ${items.map(item => html`<li>${item}</li>`)}
    </ul>
  `;
}
```

**Features:**
- **Efficient Updates**: Only changed parts re-render
- **Type Safety**: TypeScript checks template expressions
- **Natural Syntax**: Looks like HTML, acts like JavaScript
- **Composable**: Templates can include other templates

### 4. ES Modules

Web Components are distributed as standard ES modules:

```javascript
// Import custom elements
import './components/todo-app.js';

// Elements are automatically registered
// <todo-app></todo-app>
```

## Key Features

### Component Architecture

This application demonstrates proper component decomposition:

```
todo-app (Container)
├── todo-input (Form)
├── todo-list (List Container)
│   └── todo-item (List Item) [repeated]
└── Statistics & Filters
```

### Reactive Properties

```typescript
@customElement('my-component')
export class MyComponent extends LitElement {
  // Public reactive property
  @property({ type: String })
  title = 'Default';

  // Internal reactive state
  @state()
  private count = 0;

  // Computed property (getter)
  get message() {
    return `${this.title}: ${this.count}`;
  }
}
```

### Event-Driven Communication

Components communicate through custom events:

```typescript
// Child dispatches event
this.dispatchEvent(
  new CustomEvent('todo-add', {
    detail: { text: 'New todo' },
    bubbles: true,    // Bubbles up through Shadow DOM
    composed: true,   // Crosses Shadow DOM boundaries
  })
);

// Parent listens for event
html`
  <div @todo-add=${this.handleAdd}>
    <todo-input></todo-input>
  </div>
`;
```

## Project Structure

```
18-lit/
├── src/
│   ├── components/
│   │   ├── todo-app.ts       # Main container component
│   │   ├── todo-input.ts     # Input form component
│   │   ├── todo-list.ts      # List container component
│   │   └── todo-item.ts      # Individual todo item
│   ├── types.ts              # TypeScript interfaces
│   └── styles.ts             # Shared styles
├── index.html                # Entry point
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Build config
└── README.md                 # This file
```

### Component Responsibilities

**todo-app.ts** (Container)
- State management for all todos
- LocalStorage persistence
- Event coordination
- Filter logic
- Statistics calculation

**todo-input.ts** (Presentation)
- Input field management
- Form validation
- Event emission for new todos

**todo-list.ts** (Presentation)
- Renders list of todos
- Empty state handling
- Efficient list updates with `repeat` directive

**todo-item.ts** (Presentation)
- Individual todo display
- Inline editing
- Toggle/delete actions
- Event delegation to parent

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern browser with Web Components support

### Setup Steps

```bash
# Navigate to project directory
cd 03-modern-frameworks/18-lit

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### Quick Start

After installation, the app will be available at `http://localhost:3000`

The development server includes:
- Hot Module Replacement (HMR)
- TypeScript compilation
- Source maps
- Error overlay

## Development

### Development Server

```bash
npm run dev
```

Features:
- Instant HMR updates
- TypeScript error reporting
- Source map support
- Auto-open browser

### Type Checking

```bash
npm run type-check
```

Runs TypeScript compiler in check mode without emitting files.

### Building

```bash
npm run build
```

Produces optimized production bundle in `dist/`:
- Minified JavaScript
- CSS extraction
- Tree shaking
- Code splitting
- Source maps (optional)

### Project Configuration

**TypeScript Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

Key settings:
- `experimentalDecorators`: Enables `@customElement`, `@property`, `@state`
- `useDefineForClassFields`: Must be `false` for decorators to work correctly

**Vite Configuration** (`vite.config.ts`):
```typescript
export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          lit: ['lit'],
        },
      },
    },
  },
});
```

## Architecture Deep Dive

### State Management

Lit uses **reactive properties** for state management:

```typescript
@customElement('todo-app')
export class TodoApp extends LitElement {
  // State: Array of todos
  @state()
  private todos: Todo[] = [];

  // State: Current filter
  @state()
  private filter: FilterType = 'all';

  // Computed: Filtered todos
  private get filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }

  // Action: Add todo
  private handleAddTodo(e: CustomEvent) {
    this.todos = [...this.todos, newTodo];
    // Re-render triggered automatically
  }
}
```

**Key Points:**
- State changes trigger automatic re-renders
- Use immutable updates (spread operator)
- Computed properties via getters
- No need for setState or ref.value

### Data Flow

```
User Action
    ↓
Event Handler
    ↓
State Update (immutable)
    ↓
Automatic Re-render
    ↓
DOM Update (efficient)
```

### Component Communication

**Parent to Child**: Properties

```typescript
// Parent
render() {
  return html`
    <todo-list .todos=${this.filteredTodos}></todo-list>
  `;
}

// Child
@customElement('todo-list')
export class TodoList extends LitElement {
  @property({ type: Array })
  todos: Todo[] = [];
}
```

**Child to Parent**: Events

```typescript
// Child
private handleAdd() {
  this.dispatchEvent(
    new CustomEvent('todo-add', {
      detail: { text: this.inputValue },
      bubbles: true,
      composed: true,
    })
  );
}

// Parent
render() {
  return html`
    <div @todo-add=${this.handleAdd}>
      <todo-input></todo-input>
    </div>
  `;
}
```

## Lit Reactive Properties

### @property Decorator

Public reactive properties that appear as HTML attributes:

```typescript
@customElement('user-card')
export class UserCard extends LitElement {
  // String property
  @property({ type: String })
  name = 'Anonymous';

  // Number property
  @property({ type: Number })
  age = 0;

  // Boolean property (attribute presence)
  @property({ type: Boolean })
  active = false;

  // Complex property (no attribute reflection)
  @property({ attribute: false })
  user?: User;

  render() {
    return html`
      <div>
        <h2>${this.name}</h2>
        <p>Age: ${this.age}</p>
        <p>Status: ${this.active ? 'Active' : 'Inactive'}</p>
      </div>
    `;
  }
}

// Usage:
// <user-card name="Alice" age="30" active></user-card>
```

**Property Options:**
- `type`: Type converter (String, Number, Boolean, Array, Object)
- `attribute`: Attribute name (or false to disable)
- `reflect`: Reflect property back to attribute
- `converter`: Custom converter function
- `hasChanged`: Custom change detection

### @state Decorator

Internal reactive state (no attribute reflection):

```typescript
@customElement('counter')
export class Counter extends LitElement {
  @state()
  private count = 0;

  @state()
  private history: number[] = [];

  increment() {
    this.count++;
    this.history = [...this.history, this.count];
  }

  render() {
    return html`
      <button @click=${this.increment}>
        Count: ${this.count}
      </button>
      <p>History: ${this.history.join(', ')}</p>
    `;
  }
}
```

**When to use @state vs @property:**
- `@property`: Public API, configurable via attributes
- `@state`: Internal implementation details

### Property Change Detection

Lit automatically detects property changes:

```typescript
updated(changedProperties: Map<PropertyKey, unknown>) {
  // Called after render when properties change
  if (changedProperties.has('todos')) {
    console.log('Todos changed');
    this.saveTodos(); // Save to localStorage
  }

  if (changedProperties.has('filter')) {
    console.log('Filter changed');
    this.logAnalytics();
  }
}
```

### Custom Property Converters

```typescript
const dateConverter = {
  fromAttribute: (value: string | null) => {
    return value ? new Date(value) : null;
  },
  toAttribute: (value: Date | null) => {
    return value ? value.toISOString() : null;
  },
};

@property({ converter: dateConverter, reflect: true })
date: Date | null = null;
```

## Shadow DOM and Styling

### Component Styles

Lit uses the `css` tagged template for styles:

```typescript
@customElement('styled-component')
export class StyledComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      background: white;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    h1 {
      color: blue;
      /* Only affects h1 in this component */
    }
  `;
}
```

### :host Selector

Style the host element itself:

```css
/* Default host styles */
:host {
  display: block;
}

/* Host with attribute */
:host([hidden]) {
  display: none;
}

/* Host in specific context */
:host-context(.dark-mode) {
  background: black;
  color: white;
}
```

### Style Composition

```typescript
// styles.ts
export const buttonStyles = css`
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
  }
`;

// component.ts
import { buttonStyles } from './styles';

static styles = [
  buttonStyles,
  css`
    button {
      background: blue;
      color: white;
    }
  `,
];
```

### CSS Custom Properties (Theming)

```typescript
static styles = css`
  :host {
    --primary-color: blue;
    --text-color: black;
  }

  button {
    background: var(--primary-color, blue);
    color: var(--text-color, black);
  }
`;

// Usage:
// <my-component style="--primary-color: red"></my-component>
```

### Shadow DOM Penetration

Shadow DOM styles are encapsulated, but you can expose styling hooks:

```typescript
static styles = css`
  .card {
    padding: var(--card-padding, 16px);
    background: var(--card-bg, white);
    border-radius: var(--card-radius, 8px);
  }
`;
```

Users can customize:
```html
<style>
  todo-app {
    --card-padding: 24px;
    --card-bg: #f5f5f5;
  }
</style>
```

### Styling Slotted Content

```typescript
render() {
  return html`
    <div class="container">
      <slot></slot>
    </div>
  `;
}

static styles = css`
  ::slotted(*) {
    margin: 8px 0;
  }

  ::slotted(h1) {
    color: blue;
  }
`;
```

## Event System

### Event Binding Syntax

Lit uses `@event` syntax for event listeners:

```typescript
render() {
  return html`
    <!-- Event binding -->
    <button @click=${this.handleClick}>Click</button>

    <!-- With event object -->
    <input @input=${(e: Event) => this.handleInput(e)} />

    <!-- Multiple events -->
    <div
      @mouseenter=${this.handleEnter}
      @mouseleave=${this.handleLeave}
    >
      Hover me
    </div>
  `;
}
```

### Custom Events

```typescript
// Dispatch custom event
private notifyChange() {
  this.dispatchEvent(
    new CustomEvent('value-changed', {
      detail: { value: this.value },
      bubbles: true,      // Bubble through DOM tree
      composed: true,     // Cross Shadow DOM boundary
      cancelable: true,   // Can be cancelled with preventDefault()
    })
  );
}

// Listen for custom event
html`
  <child-component @value-changed=${this.handleChange}>
  </child-component>
`;
```

### Event Options

```typescript
// Passive event listener (improves scroll performance)
@eventOptions({ passive: true })
private handleScroll(e: Event) {
  // Can't call preventDefault()
}

// Capture phase
@eventOptions({ capture: true })
private handleClickCapture(e: Event) {
  // Fires during capture phase
}
```

### Event Delegation

Handle events from child components:

```typescript
render() {
  return html`
    <div
      @todo-add=${this.handleAdd}
      @todo-toggle=${this.handleToggle}
      @todo-delete=${this.handleDelete}
    >
      <todo-input></todo-input>
      <todo-list .todos=${this.todos}></todo-list>
    </div>
  `;
}
```

## Lifecycle Methods

Lit components have a well-defined lifecycle:

### 1. constructor()

```typescript
constructor() {
  super();
  // Initialize properties
  this.todos = [];
  // Don't access DOM here - not yet created
}
```

### 2. connectedCallback()

```typescript
connectedCallback() {
  super.connectedCallback();
  // Component added to DOM
  // Good place for event listeners, fetch data
  window.addEventListener('resize', this.handleResize);
}
```

### 3. disconnectedCallback()

```typescript
disconnectedCallback() {
  super.disconnectedCallback();
  // Component removed from DOM
  // Clean up event listeners, timers
  window.removeEventListener('resize', this.handleResize);
}
```

### 4. firstUpdated()

```typescript
firstUpdated() {
  // Called after first render
  // DOM is available
  // Good for initializing from localStorage
  this.loadTodos();

  // Access rendered elements
  const input = this.shadowRoot?.querySelector('input');
  input?.focus();
}
```

### 5. updated()

```typescript
updated(changedProperties: Map<PropertyKey, unknown>) {
  // Called after every render
  if (changedProperties.has('todos')) {
    // Todos changed - save to storage
    this.saveTodos();
  }
}
```

### 6. shouldUpdate()

```typescript
shouldUpdate(changedProperties: Map<PropertyKey, unknown>) {
  // Return false to skip update
  // Useful for performance optimization
  return changedProperties.has('importantProp');
}
```

### Complete Lifecycle Flow

```
constructor()
    ↓
connectedCallback()
    ↓
[Property changes]
    ↓
shouldUpdate() → false? → [skip render]
    ↓
render()
    ↓
firstUpdated() [first time only]
    ↓
updated()
    ↓
[More property changes...]
    ↓
disconnectedCallback()
```

## Directives and Templates

### Built-in Directives

**1. classMap** - Conditional classes

```typescript
import { classMap } from 'lit/directives/class-map.js';

render() {
  const classes = {
    'todo-item': true,
    'completed': this.todo.completed,
    'editing': this.isEditing,
  };

  return html`
    <div class=${classMap(classes)}>...</div>
  `;
}
```

**2. styleMap** - Dynamic inline styles

```typescript
import { styleMap } from 'lit/directives/style-map.js';

render() {
  const styles = {
    color: this.color,
    backgroundColor: this.bgColor,
    padding: '16px',
  };

  return html`
    <div style=${styleMap(styles)}>...</div>
  `;
}
```

**3. repeat** - Efficient list rendering

```typescript
import { repeat } from 'lit/directives/repeat.js';

render() {
  return html`
    <ul>
      ${repeat(
        this.todos,
        (todo) => todo.id,  // Key function
        (todo) => html`     // Template function
          <todo-item .todo=${todo}></todo-item>
        `
      )}
    </ul>
  `;
}
```

**4. ifDefined** - Conditional attributes

```typescript
import { ifDefined } from 'lit/directives/if-defined.js';

render() {
  return html`
    <input
      type="text"
      placeholder=${ifDefined(this.placeholder)}
      aria-label=${ifDefined(this.ariaLabel)}
    />
  `;
}
```

**5. when** - Conditional rendering

```typescript
import { when } from 'lit/directives/when.js';

render() {
  return html`
    ${when(
      this.isLoading,
      () => html`<loading-spinner></loading-spinner>`,
      () => html`<div>${this.content}</div>`
    )}
  `;
}
```

**6. cache** - Cache templates

```typescript
import { cache } from 'lit/directives/cache.js';

render() {
  return html`
    ${cache(this.view === 'list'
      ? html`<list-view></list-view>`
      : html`<grid-view></grid-view>`
    )}
  `;
}
```

### Template Expressions

```typescript
render() {
  const name = 'World';
  const show = true;
  const items = [1, 2, 3];

  return html`
    <!-- Text content -->
    <h1>Hello ${name}</h1>

    <!-- Attributes -->
    <div class="container ${show ? 'visible' : ''}"></div>

    <!-- Boolean attributes -->
    <button ?disabled=${!show}>Click</button>

    <!-- Properties (note the dot) -->
    <input .value=${this.inputValue} />

    <!-- Event listeners -->
    <button @click=${this.handleClick}>Click</button>

    <!-- Conditional rendering -->
    ${show ? html`<p>Visible</p>` : null}

    <!-- List rendering -->
    ${items.map(item => html`<li>${item}</li>`)}
  `;
}
```

## TypeScript Integration

### Component Type Safety

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface User {
  id: string;
  name: string;
  email: string;
}

@customElement('user-profile')
export class UserProfile extends LitElement {
  @property({ attribute: false })
  user?: User;

  @state()
  private isLoading = false;

  async loadUser(id: string): Promise<void> {
    this.isLoading = true;
    try {
      const response = await fetch(`/api/users/${id}`);
      this.user = await response.json() as User;
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    return html`
      ${this.isLoading
        ? html`<p>Loading...</p>`
        : html`<p>${this.user?.name ?? 'Unknown'}</p>`
      }
    `;
  }
}
```

### Event Type Safety

```typescript
interface TodoEventDetail {
  id: string;
  text?: string;
}

// Type-safe event dispatch
private dispatchTodoEvent(detail: TodoEventDetail) {
  this.dispatchEvent(
    new CustomEvent<TodoEventDetail>('todo-action', {
      detail,
      bubbles: true,
      composed: true,
    })
  );
}

// Type-safe event handler
private handleTodoAction(e: CustomEvent<TodoEventDetail>) {
  const { id, text } = e.detail;
  // TypeScript knows detail shape
}
```

### Custom Element Type Definitions

```typescript
declare global {
  interface HTMLElementTagNameMap {
    'todo-app': TodoApp;
    'todo-input': TodoInput;
    'todo-item': TodoItem;
    'todo-list': TodoList;
  }
}

// Now TypeScript knows about custom elements
const app = document.querySelector('todo-app'); // Type: TodoApp | null
```

## LocalStorage Persistence

### Implementation

```typescript
@customElement('todo-app')
export class TodoApp extends LitElement {
  @state()
  private todos: Todo[] = [];

  // Load on first render
  firstUpdated() {
    this.loadTodos();
  }

  // Save on every update
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('todos')) {
      this.saveTodos();
    }
  }

  private loadTodos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.todos = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    }
  }

  private saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  }
}
```

### Storage Utilities

```typescript
// types.ts
export interface TodoStorage {
  loadTodos(): Todo[];
  saveTodos(todos: Todo[]): void;
  clear(): void;
}

// storage.ts
export const createLocalStorage = (key: string): TodoStorage => ({
  loadTodos() {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  },

  saveTodos(todos: Todo[]) {
    localStorage.setItem(key, JSON.stringify(todos));
  },

  clear() {
    localStorage.removeItem(key);
  },
});
```

## Comparison with React/Vue

### Component Definition

**React:**
```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);

  return (
    <div>
      <TodoInput onAdd={(text) => setTodos([...todos, newTodo])} />
      <TodoList todos={todos} />
    </div>
  );
}
```

**Vue:**
```vue
<template>
  <div>
    <TodoInput @add="addTodo" />
    <TodoList :todos="todos" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
const todos = ref([]);
</script>
```

**Lit:**
```typescript
@customElement('todo-app')
export class TodoApp extends LitElement {
  @state()
  private todos: Todo[] = [];

  render() {
    return html`
      <div @todo-add=${this.handleAdd}>
        <todo-input></todo-input>
        <todo-list .todos=${this.todos}></todo-list>
      </div>
    `;
  }
}
```

### Key Differences

| Feature | React | Vue | Lit |
|---------|-------|-----|-----|
| **Base Technology** | Virtual DOM | Virtual DOM | Real DOM |
| **Bundle Size** | ~40KB | ~35KB | ~5KB |
| **Runtime** | Required | Required | Minimal |
| **Browser Support** | Modern | Modern | Native |
| **Style Encapsulation** | CSS Modules/CSS-in-JS | Scoped CSS | Shadow DOM |
| **Reusability** | React only | Vue only | Any framework |
| **Learning Curve** | Medium | Medium | Low-Medium |
| **Ecosystem** | Huge | Large | Growing |

### Performance

**React:**
- Virtual DOM diffing overhead
- Re-renders entire component tree
- Memoization needed for optimization

**Vue:**
- Reactive dependency tracking
- Efficient granular updates
- Automatic optimization

**Lit:**
- No Virtual DOM
- Only changed expressions update
- Minimal overhead
- Fast by default

### When to Choose Each

**Choose React when:**
- Building large single-page applications
- Need extensive ecosystem (routing, state management)
- Team expertise in React
- Server-side rendering critical

**Choose Vue when:**
- Want progressive enhancement
- Need gentle learning curve
- Building full applications
- Prefer template syntax

**Choose Lit when:**
- Building component libraries
- Need framework interoperability
- Small bundle size critical
- Want web standards
- Creating design systems

## Framework Interoperability

One of Lit's superpowers is working seamlessly with any framework.

### Using Lit in React

```jsx
// React component
import { useEffect, useRef } from 'react';
import './components/todo-app'; // Import Lit component

function App() {
  const todoAppRef = useRef(null);

  useEffect(() => {
    const app = todoAppRef.current;

    // Listen to custom events
    const handleTodoAdd = (e) => {
      console.log('Todo added:', e.detail);
    };

    app.addEventListener('todo-add', handleTodoAdd);

    return () => {
      app.removeEventListener('todo-add', handleTodoAdd);
    };
  }, []);

  return (
    <div>
      <h1>React App with Lit Component</h1>
      <todo-app ref={todoAppRef}></todo-app>
    </div>
  );
}
```

### Using Lit in Vue

```vue
<template>
  <div>
    <h1>Vue App with Lit Component</h1>
    <todo-app @todo-add="handleTodoAdd"></todo-app>
  </div>
</template>

<script setup>
import './components/todo-app';

const handleTodoAdd = (e) => {
  console.log('Todo added:', e.detail);
};
</script>
```

### Using Lit in Angular

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Allow custom elements
})
export class AppModule {}

// app.component.ts
import './components/todo-app';

@Component({
  template: `
    <h1>Angular App with Lit Component</h1>
    <todo-app (todo-add)="handleTodoAdd($event)"></todo-app>
  `,
})
export class AppComponent {
  handleTodoAdd(event: CustomEvent) {
    console.log('Todo added:', event.detail);
  }
}
```

### Using Lit in Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
  <body>
    <todo-app id="app"></todo-app>

    <script type="module">
      import './components/todo-app.js';

      const app = document.getElementById('app');

      app.addEventListener('todo-add', (e) => {
        console.log('Todo added:', e.detail);
      });
    </script>
  </body>
</html>
```

### Benefits

1. **No Wrappers Needed**: Use as native HTML
2. **Event Interop**: Custom events work everywhere
3. **Property Binding**: Works with all frameworks
4. **SSR Compatible**: Can be server-rendered
5. **Migration Path**: Incrementally adopt/remove

## Performance Characteristics

### Bundle Size

```
Production Build Sizes:
- Lit library:     ~5KB (gzipped)
- Todo App code:   ~8KB (gzipped)
- Total:          ~13KB (gzipped)

Compare to:
- React + ReactDOM: ~40KB
- Vue 3:           ~35KB
- Angular:         ~70KB+
```

### Runtime Performance

**Initial Render:**
- No Virtual DOM compilation
- Direct DOM manipulation
- Fast time-to-interactive

**Updates:**
- Only changed template parts update
- No diffing algorithm
- Minimal overhead

### Optimization Techniques

**1. Use `repeat` for lists:**
```typescript
${repeat(items, item => item.id, item => html`...`)}
// vs
${items.map(item => html`...`)} // Slower
```

**2. Implement `shouldUpdate`:**
```typescript
shouldUpdate(changedProperties: Map<PropertyKey, unknown>) {
  return changedProperties.has('criticalProp');
}
```

**3. Lazy load components:**
```typescript
async loadComponent() {
  await import('./heavy-component.js');
  this.showComponent = true;
}
```

**4. Use property bindings:**
```typescript
// Efficient (property binding)
<child-component .data=${this.data}></child-component>

// Less efficient (attribute)
<child-component data=${JSON.stringify(this.data)}></child-component>
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component does one thing well
2. **Props Down, Events Up**: Data flows down, events bubble up
3. **Composition Over Inheritance**: Build complex UIs from simple components
4. **Encapsulation**: Keep internal state private

### State Management

1. **Immutable Updates**: Always create new objects
   ```typescript
   // Good
   this.todos = [...this.todos, newTodo];

   // Bad
   this.todos.push(newTodo); // Doesn't trigger update
   ```

2. **Single Source of Truth**: Keep state in one place
3. **Lift State Up**: Move shared state to common ancestor
4. **Computed Properties**: Use getters for derived state

### Styling

1. **Use CSS Custom Properties** for theming
2. **Avoid !important** in component styles
3. **Mobile First** responsive design
4. **Accessible Color Contrast** (WCAG AA minimum)

### Accessibility

1. **Semantic HTML**: Use proper elements
2. **ARIA Labels**: Add where needed
3. **Keyboard Navigation**: Support Tab, Enter, Escape
4. **Focus Management**: Handle focus properly

### Performance

1. **Code Splitting**: Lazy load heavy components
2. **Tree Shaking**: Export only what's needed
3. **Minimize Renders**: Implement `shouldUpdate` when appropriate
4. **Event Delegation**: Use bubbling for list items

## Testing Strategies

### Unit Testing with Web Test Runner

```typescript
// todo-app.test.ts
import { fixture, html, expect } from '@open-wc/testing';
import './todo-app';
import type { TodoApp } from './todo-app';

describe('TodoApp', () => {
  it('renders correctly', async () => {
    const el = await fixture<TodoApp>(html`<todo-app></todo-app>`);
    expect(el).to.exist;
    expect(el).shadowDom.to.equal(`
      <div class="app-container">
        <header class="app-header">
          <h1 class="app-title">todos</h1>
        </header>
        <!-- ... -->
      </div>
    `);
  });

  it('adds a todo', async () => {
    const el = await fixture<TodoApp>(html`<todo-app></todo-app>`);
    const input = el.shadowRoot!.querySelector('todo-input');

    // Simulate add event
    input!.dispatchEvent(
      new CustomEvent('todo-add', {
        detail: { text: 'Test todo' },
        bubbles: true,
        composed: true,
      })
    );

    await el.updateComplete;

    // Check todo was added
    expect(el.todos.length).to.equal(1);
    expect(el.todos[0].text).to.equal('Test todo');
  });
});
```

### E2E Testing with Playwright

```typescript
// e2e/todo-app.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('adds a new todo', async ({ page }) => {
    // Type in input
    await page.locator('todo-app').locator('input').fill('Buy milk');

    // Click add button
    await page.locator('todo-app').locator('button:has-text("Add")').click();

    // Verify todo appears
    await expect(
      page.locator('todo-item').filter({ hasText: 'Buy milk' })
    ).toBeVisible();
  });

  test('toggles todo completion', async ({ page }) => {
    // Add todo first
    await page.locator('todo-app').locator('input').fill('Test todo');
    await page.locator('todo-app').locator('button:has-text("Add")').click();

    // Toggle checkbox
    await page.locator('todo-item input[type="checkbox"]').click();

    // Verify completed state
    const item = page.locator('todo-item');
    await expect(item).toHaveAttribute('class', /completed/);
  });
});
```

## Production Deployment

### Build Optimization

```bash
# Build for production
npm run build

# Output in dist/
dist/
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── index.html
```

### Deployment Checklist

- [ ] Set production environment variables
- [ ] Enable compression (gzip/brotli)
- [ ] Configure CDN
- [ ] Set cache headers
- [ ] Enable HTTPS
- [ ] Add security headers
- [ ] Test in target browsers
- [ ] Validate accessibility
- [ ] Performance audit (Lighthouse)

### Static Hosting

Deploy to any static host:

**Netlify:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
```

**Vercel:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

**GitHub Pages:**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Browser Support

### Supported Browsers

- Chrome/Edge 67+
- Firefox 63+
- Safari 13.1+
- Opera 54+

### Polyfills

For older browsers, include polyfills:

```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@latest/webcomponents-loader.js"></script>
```

### Feature Detection

```javascript
if ('customElements' in window && 'shadowRoot' in Element.prototype) {
  // Web Components supported
  import('./app.js');
} else {
  // Show fallback or load polyfills
  console.error('Web Components not supported');
}
```

## Troubleshooting

### Common Issues

**1. Decorators not working**
```
Error: Decorators are not valid here
```
Fix: Enable `experimentalDecorators` in `tsconfig.json`

**2. Properties not reactive**
```typescript
// Wrong
this.todos.push(newTodo); // Mutation doesn't trigger update

// Correct
this.todos = [...this.todos, newTodo]; // New array triggers update
```

**3. Styles not applying**
```
Error: Styles not scoped to component
```
Fix: Use `static styles = css\`...\`` not regular CSS

**4. Events not bubbling from Shadow DOM**
```typescript
// Add composed: true
this.dispatchEvent(
  new CustomEvent('my-event', {
    bubbles: true,
    composed: true, // Crosses Shadow DOM boundary
  })
);
```

## Resources

### Official Documentation

- [Lit Documentation](https://lit.dev/)
- [Web Components MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements Spec](https://html.spec.whatwg.org/multipage/custom-elements.html)

### Learning Resources

- [Lit Tutorials](https://lit.dev/tutorials/)
- [Lit Playground](https://lit.dev/playground/)
- [Open Web Components](https://open-wc.org/)

### Tools & Libraries

- [Lit Analyzer](https://github.com/runem/lit-analyzer) - VS Code extension
- [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) - Testing
- [Storybook for Web Components](https://storybook.js.org/docs/web-components/get-started/introduction)

### Community

- [Lit Discord](https://discord.gg/lit)
- [Lit GitHub](https://github.com/lit/lit)
- [awesome-lit](https://github.com/web-padawan/awesome-lit-html)

---

## License

MIT License - feel free to use this code in your own projects!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
