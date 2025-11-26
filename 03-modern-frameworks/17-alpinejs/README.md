# Alpine.js Todo List

A complete, feature-rich Todo List application built with **Alpine.js 3.x** demonstrating the power of declarative, behavior-driven JavaScript directly in HTML markup.

## Table of Contents

- [Overview](#overview)
- [Alpine.js Philosophy](#alpinejs-philosophy)
- [Alpine.js vs Other Frameworks](#alpinejs-vs-other-frameworks)
  - [Alpine.js vs Vue.js](#alpinejs-vs-vuejs)
  - [Alpine.js vs React](#alpinejs-vs-react)
  - [Alpine.js vs jQuery](#alpinejs-vs-jquery)
- [Core Concepts](#core-concepts)
- [Directives Reference](#directives-reference)
- [Magic Properties](#magic-properties)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Feature Implementation](#feature-implementation)
- [Code Examples](#code-examples)
- [When to Use Alpine.js](#when-to-use-alpinejs)
- [Performance Considerations](#performance-considerations)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Debugging Tips](#debugging-tips)
- [Resources](#resources)

## Overview

Alpine.js is a rugged, minimal framework for composing JavaScript behavior in your markup. Think of it as **jQuery for the modern web** or **Tailwind for JavaScript**. It provides the reactive and declarative nature of big frameworks like Vue or React at a much lower cost.

### Key Features

- **Lightweight**: Only ~15kb minified
- **No Build Step Required**: Works directly in the browser via CDN
- **Declarative**: Behavior defined in HTML attributes
- **Reactive**: Automatic DOM updates when state changes
- **Intuitive**: Familiar syntax similar to Vue.js
- **Progressive**: Can be added to existing projects incrementally

### Live Demo Features

This implementation includes:

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ Global state management with `Alpine.store`
- ✅ Filter todos (All, Active, Completed)
- ✅ LocalStorage persistence
- ✅ Double-click to edit
- ✅ Toggle all todos
- ✅ Clear completed
- ✅ Real-time statistics
- ✅ Keyboard shortcuts (Enter, Escape)
- ✅ Smooth animations
- ✅ Responsive design

## Alpine.js Philosophy

### Behavior in Your Markup

Alpine.js embraces the philosophy that **JavaScript behavior should be declared in the markup**, not in separate JavaScript files. This makes it easier to understand what's happening on the page by reading the HTML.

```html
<!-- Traditional JavaScript -->
<button id="myButton">Click me</button>
<script>
  document.getElementById('myButton').addEventListener('click', () => {
    alert('Clicked!');
  });
</script>

<!-- Alpine.js -->
<button @click="alert('Clicked!')">Click me</button>
```

### Minimal Footprint, Maximum Impact

Alpine.js provides just enough framework to handle:

1. **Reactive Data** - State that automatically updates the UI
2. **Declarative Rendering** - Express UI as a function of state
3. **Event Handling** - Respond to user interactions
4. **DOM Manipulation** - Show/hide, add/remove elements

It doesn't include:

- ❌ Router (use Turbo, htmx, or traditional navigation)
- ❌ Complex state management (though `Alpine.store` is available)
- ❌ Server-side rendering
- ❌ Virtual DOM diffing
- ❌ Build tools or compilation

### Progressive Enhancement

Alpine.js works perfectly as a progressive enhancement layer:

```html
<!-- Server-rendered HTML -->
<div class="user-profile">
  <h1>John Doe</h1>
  <p>Software Developer</p>
</div>

<!-- Add Alpine.js behavior incrementally -->
<div class="user-profile" x-data="{ editing: false }">
  <div x-show="!editing">
    <h1>John Doe</h1>
    <button @click="editing = true">Edit</button>
  </div>
  <div x-show="editing">
    <input type="text" value="John Doe">
    <button @click="editing = false">Save</button>
  </div>
</div>
```

## Alpine.js vs Other Frameworks

### Alpine.js vs Vue.js

Alpine.js and Vue.js share similar syntax because Alpine was inspired by Vue. However, they serve different purposes:

#### Similarities

```html
<!-- Vue.js -->
<div id="app">
  <p v-show="visible">{{ message }}</p>
  <button @click="toggle">Toggle</button>
</div>

<!-- Alpine.js -->
<div x-data="{ visible: true, message: 'Hello' }">
  <p x-show="visible" x-text="message"></p>
  <button @click="visible = !visible">Toggle</button>
</div>
```

#### Key Differences

| Feature | Alpine.js | Vue.js |
|---------|-----------|--------|
| **Size** | ~15kb | ~40kb (runtime) |
| **Setup** | CDN + HTML attributes | Build system or CDN + mount |
| **Components** | Inline with `x-data` | Single File Components (.vue) |
| **Templating** | HTML with directives | Template syntax or JSX |
| **State Management** | `Alpine.store` (simple) | Vuex/Pinia (complex) |
| **Routing** | None (use external) | Vue Router |
| **SSR** | No | Yes (Nuxt) |
| **Use Case** | Simple interactivity | Full applications |

#### When to Choose Alpine.js Over Vue

```javascript
// Alpine.js - Perfect for simple interactions
<div x-data="{ count: 0 }">
  <button @click="count++">Count: <span x-text="count"></span></button>
</div>

// Vue.js - Better for complex applications
// app.vue
<template>
  <router-view />
  <Suspense>
    <AsyncComponent :data="complexState" />
  </Suspense>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
</script>
```

**Choose Alpine.js when:**
- Adding interactivity to server-rendered pages
- Building simple components (dropdowns, modals, tabs)
- You want zero build step
- The page is mostly static with sprinkles of behavior

**Choose Vue.js when:**
- Building a Single Page Application (SPA)
- Need complex routing
- Require component composition
- Need server-side rendering
- Working with a large team on a complex application

### Alpine.js vs React

React and Alpine.js have fundamentally different approaches:

#### Component Definition

```javascript
// React - JavaScript-centric
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

ReactDOM.render(<Counter />, document.getElementById('root'));
```

```html
<!-- Alpine.js - HTML-centric -->
<div x-data="{ count: 0 }">
  <p>Count: <span x-text="count"></span></p>
  <button @click="count++">Increment</button>
</div>
```

#### State Management

```javascript
// React - Hooks and Context
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <UserProfile />
    </UserContext.Provider>
  );
}

function UserProfile() {
  const { user } = useContext(UserContext);
  return <div>{user?.name}</div>;
}
```

```javascript
// Alpine.js - Global Store
Alpine.store('user', {
  data: null,
  setUser(user) {
    this.data = user;
  }
});
```

```html
<div x-data>
  <p x-text="$store.user.data?.name"></p>
</div>
```

#### Comparison Table

| Feature | Alpine.js | React |
|---------|-----------|-------|
| **Philosophy** | Behavior in markup | Components everywhere |
| **Learning Curve** | Gentle | Moderate to steep |
| **Build Required** | No | Yes (for JSX) |
| **Virtual DOM** | No | Yes |
| **Size** | ~15kb | ~45kb (React + ReactDOM) |
| **Ecosystem** | Small | Massive |
| **TypeScript** | Basic support | Excellent support |
| **Mobile** | No | Yes (React Native) |

**Choose Alpine.js when:**
- Enhancing traditional server-rendered pages
- Need minimal JavaScript footprint
- Want to avoid build tools
- Team is more comfortable with HTML than JavaScript

**Choose React when:**
- Building complex, interactive UIs
- Need strong TypeScript support
- Want access to massive ecosystem
- Planning to reuse code for mobile (React Native)

### Alpine.js vs jQuery

Alpine.js is often called "the new jQuery" because it fills a similar niche:

#### Event Handling

```javascript
// jQuery - Imperative
$('#myButton').on('click', function() {
  $('#message').text('Button clicked!');
  $('#message').show();
});

// Alpine.js - Declarative
<div x-data="{ clicked: false }">
  <button @click="clicked = true">Click me</button>
  <p x-show="clicked">Button clicked!</p>
</div>
```

#### DOM Manipulation

```javascript
// jQuery - Manual DOM updates
const todos = [];

function addTodo(text) {
  todos.push({ id: Date.now(), text });
  renderTodos();
}

function renderTodos() {
  const html = todos.map(todo =>
    `<li>${todo.text}</li>`
  ).join('');
  $('#todoList').html(html);
}

// Alpine.js - Reactive
<div x-data="{ todos: [] }">
  <input @keyup.enter="todos.push({ id: Date.now(), text: $el.value })">
  <ul>
    <template x-for="todo in todos" :key="todo.id">
      <li x-text="todo.text"></li>
    </template>
  </ul>
</div>
```

#### Key Differences

| Feature | Alpine.js | jQuery |
|---------|-----------|--------|
| **Reactivity** | Built-in | Manual |
| **Data Binding** | Two-way (`x-model`) | One-way (events) |
| **DOM Updates** | Automatic | Manual |
| **State** | Centralized | Scattered in DOM |
| **Modern** | ES6+ | ES5 |
| **Size** | ~15kb | ~30kb |

**Migrate from jQuery to Alpine.js:**

```javascript
// jQuery
let count = 0;
$('#increment').on('click', function() {
  count++;
  $('#count').text(count);
});

// Alpine.js
<div x-data="{ count: 0 }">
  <button @click="count++" id="increment">Increment</button>
  <span x-text="count"></span>
</div>
```

## Core Concepts

### 1. Reactive Data with `x-data`

`x-data` declares a component's reactive state. It's the foundation of every Alpine.js component.

```html
<!-- Basic state -->
<div x-data="{ count: 0 }">
  <span x-text="count"></span>
</div>

<!-- Complex state -->
<div x-data="{
  user: {
    name: 'John',
    email: 'john@example.com'
  },
  settings: {
    theme: 'dark',
    notifications: true
  }
}">
  <p x-text="user.name"></p>
  <p x-text="settings.theme"></p>
</div>

<!-- With methods -->
<div x-data="{
  count: 0,
  increment() {
    this.count++;
  },
  decrement() {
    this.count--;
  }
}">
  <button @click="decrement">-</button>
  <span x-text="count"></span>
  <button @click="increment">+</button>
</div>
```

### 2. Component Functions

For reusable logic, extract `x-data` into a function:

```javascript
// Define component
function counter(initialValue = 0) {
  return {
    count: initialValue,

    increment() {
      this.count++;
    },

    decrement() {
      this.count--;
    },

    reset() {
      this.count = initialValue;
    },

    get doubled() {
      return this.count * 2;
    }
  };
}

// Register globally
Alpine.data('counter', counter);
```

```html
<!-- Use component -->
<div x-data="counter(5)">
  <button @click="decrement">-</button>
  <span x-text="count"></span>
  <button @click="increment">+</button>
  <p>Doubled: <span x-text="doubled"></span></p>
</div>
```

### 3. Global State with `Alpine.store`

For state shared across multiple components:

```javascript
// Define store
Alpine.store('app', {
  user: null,
  theme: 'light',

  setUser(user) {
    this.user = user;
  },

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  },

  get isLoggedIn() {
    return this.user !== null;
  }
});
```

```html
<!-- Access store from any component -->
<div x-data>
  <div x-show="$store.app.isLoggedIn">
    Welcome, <span x-text="$store.app.user?.name"></span>
  </div>

  <button @click="$store.app.toggleTheme()">
    Current theme: <span x-text="$store.app.theme"></span>
  </button>
</div>
```

### 4. Lifecycle Hooks

Alpine provides `init()` and `destroy()` lifecycle hooks:

```html
<div x-data="{
  message: '',

  init() {
    // Called when component initializes
    console.log('Component mounted');
    this.message = 'Initialized!';

    // Set up listeners, timers, etc.
    this.interval = setInterval(() => {
      console.log('tick');
    }, 1000);
  },

  destroy() {
    // Called when component is removed
    console.log('Component destroyed');
    clearInterval(this.interval);
  }
}">
  <p x-text="message"></p>
</div>
```

## Directives Reference

### `x-data` - Define Component State

**Purpose**: Declares a new component scope with reactive data.

```html
<!-- Inline object -->
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open">Content</div>
</div>

<!-- Component function -->
<div x-data="dropdown()">
  <!-- ... -->
</div>

<!-- Empty (to access stores/global state) -->
<div x-data>
  <p x-text="$store.user.name"></p>
</div>
```

### `x-show` - Toggle Visibility

**Purpose**: Show/hide elements using CSS `display` property.

```html
<div x-data="{ show: true }">
  <button @click="show = !show">Toggle</button>

  <!-- Element remains in DOM, just hidden -->
  <div x-show="show">
    I can be toggled!
  </div>

  <!-- With transition -->
  <div x-show="show" x-transition>
    I fade in and out!
  </div>
</div>
```

**When to use:**
- Frequently toggled elements (kept in DOM)
- Need transitions
- Performance is not critical

### `x-if` - Conditional Rendering

**Purpose**: Add/remove elements from the DOM entirely.

```html
<div x-data="{ loggedIn: false }">
  <template x-if="loggedIn">
    <div>Welcome back!</div>
  </template>

  <template x-if="!loggedIn">
    <div>Please log in</div>
  </template>
</div>
```

**Important**: Must be used on `<template>` tag.

**When to use:**
- Rarely toggled elements
- Large/complex DOM trees
- Performance is critical

### `x-for` - List Rendering

**Purpose**: Loop through arrays and render elements.

```html
<div x-data="{
  items: ['Apple', 'Banana', 'Cherry']
}">
  <ul>
    <template x-for="item in items" :key="item">
      <li x-text="item"></li>
    </template>
  </ul>
</div>

<!-- With index -->
<template x-for="(item, index) in items" :key="index">
  <li>
    <span x-text="index + 1"></span>:
    <span x-text="item"></span>
  </li>
</template>

<!-- Loop through objects -->
<div x-data="{
  user: { name: 'John', age: 30, email: 'john@example.com' }
}">
  <template x-for="(value, key) in user" :key="key">
    <p>
      <strong x-text="key"></strong>:
      <span x-text="value"></span>
    </p>
  </template>
</div>
```

**Important**:
- Must be used on `<template>` tag
- Always provide `:key` for optimal performance

### `x-model` - Two-Way Data Binding

**Purpose**: Sync input values with component state.

```html
<div x-data="{
  text: '',
  number: 0,
  checked: false,
  selected: '',
  options: []
}">
  <!-- Text input -->
  <input type="text" x-model="text">
  <p x-text="text"></p>

  <!-- Number input -->
  <input type="number" x-model.number="number">

  <!-- Checkbox -->
  <input type="checkbox" x-model="checked">

  <!-- Radio buttons -->
  <input type="radio" value="option1" x-model="selected">
  <input type="radio" value="option2" x-model="selected">

  <!-- Select -->
  <select x-model="selected">
    <option value="a">Option A</option>
    <option value="b">Option B</option>
  </select>

  <!-- Multiple checkbox -->
  <input type="checkbox" value="red" x-model="options">
  <input type="checkbox" value="blue" x-model="options">
  <input type="checkbox" value="green" x-model="options">
  <p x-text="options"></p>
</div>
```

**Modifiers**:
- `.lazy` - Sync on `change` instead of `input`
- `.number` - Auto-convert to number
- `.debounce` - Debounce input (e.g., `.debounce.500ms`)
- `.throttle` - Throttle input

```html
<!-- Lazy update -->
<input x-model.lazy="value">

<!-- Debounced search -->
<input x-model.debounce.500ms="searchQuery">
```

### `x-text` - Set Text Content

**Purpose**: Set element's `textContent`.

```html
<div x-data="{ message: 'Hello, Alpine!' }">
  <p x-text="message"></p>

  <!-- With expression -->
  <p x-text="'Count: ' + count"></p>

  <!-- Default value if undefined -->
  <p x-text="user?.name || 'Guest'"></p>
</div>
```

**vs innerText**: `x-text` is reactive and safer (auto-escapes HTML).

### `x-html` - Set HTML Content

**Purpose**: Set element's `innerHTML`.

```html
<div x-data="{
  html: '<strong>Bold text</strong>'
}">
  <div x-html="html"></div>
</div>
```

**⚠️ Warning**: Only use with trusted content to prevent XSS attacks.

### `x-bind` (`:`) - Bind Attributes

**Purpose**: Dynamically bind HTML attributes.

```html
<div x-data="{
  imageUrl: 'photo.jpg',
  isActive: true,
  placeholder: 'Enter text'
}">
  <!-- Bind src -->
  <img :src="imageUrl" alt="Photo">

  <!-- Bind class -->
  <div :class="isActive ? 'active' : 'inactive'">
    Status
  </div>

  <!-- Bind class object -->
  <div :class="{
    'active': isActive,
    'highlight': score > 100
  }">
    Item
  </div>

  <!-- Bind style -->
  <div :style="{
    color: textColor,
    fontSize: fontSize + 'px'
  }">
    Styled text
  </div>

  <!-- Bind placeholder -->
  <input :placeholder="placeholder">

  <!-- Bind disabled -->
  <button :disabled="!isValid">Submit</button>
</div>
```

**Shorthand**: `:attribute` instead of `x-bind:attribute`

### `x-on` (`@`) - Event Listeners

**Purpose**: Listen to DOM events.

```html
<div x-data="{ count: 0 }">
  <!-- Click event -->
  <button @click="count++">Increment</button>

  <!-- With method -->
  <button @click="increment()">Increment</button>

  <!-- Event object -->
  <button @click="handleClick($event)">
    Click me
  </button>

  <!-- Keyboard events -->
  <input @keyup.enter="submit()">
  <input @keyup.escape="cancel()">
  <input @keydown.ctrl.s="save()">

  <!-- Mouse events -->
  <div @mouseenter="hovering = true"
       @mouseleave="hovering = false">
    Hover me
  </div>

  <!-- Form events -->
  <form @submit.prevent="handleSubmit()">
    <input type="text" @input="handleInput($event)">
  </form>
</div>
```

**Event Modifiers**:
- `.prevent` - `event.preventDefault()`
- `.stop` - `event.stopPropagation()`
- `.self` - Only trigger on element itself
- `.window` - Listen on window
- `.document` - Listen on document
- `.once` - Trigger only once
- `.debounce` - Debounce handler
- `.throttle` - Throttle handler

```html
<!-- Prevent default -->
<form @submit.prevent="handleSubmit">

<!-- Stop propagation -->
<div @click.stop="handleClick">

<!-- Listen on window -->
<div @resize.window="handleResize">

<!-- Debounced -->
<input @input.debounce.500ms="search">

<!-- Key combinations -->
<input @keydown.ctrl.shift.s="saveAs">
```

### `x-ref` - DOM References

**Purpose**: Get direct reference to DOM elements.

```html
<div x-data="{
  focusInput() {
    this.$refs.myInput.focus();
  }
}">
  <input x-ref="myInput" type="text">
  <button @click="focusInput()">Focus Input</button>

  <!-- Access in template -->
  <button @click="$refs.myInput.select()">
    Select All
  </button>
</div>
```

### `x-cloak` - Hide Until Ready

**Purpose**: Hide elements until Alpine.js initializes.

```css
[x-cloak] {
  display: none !important;
}
```

```html
<div x-data="{ message: 'Hello' }" x-cloak>
  <p x-text="message"></p>
</div>
```

**Prevents**: Flash of unstyled content (FOUC).

### `x-init` - Run Code on Initialize

**Purpose**: Execute code when component initializes.

```html
<div x-data="{ message: '' }"
     x-init="message = 'Initialized!'">
  <p x-text="message"></p>
</div>

<!-- With async -->
<div x-data="{ data: null }"
     x-init="data = await fetch('/api/data').then(r => r.json())">
  <pre x-text="JSON.stringify(data, null, 2)"></pre>
</div>
```

### `x-effect` - Run Code on Dependencies Change

**Purpose**: Re-run code when dependencies change (like `useEffect`).

```html
<div x-data="{
  count: 0,
  doubled: 0
}"
x-effect="doubled = count * 2">
  <button @click="count++">Count: <span x-text="count"></span></button>
  <p>Doubled: <span x-text="doubled"></span></p>
</div>
```

### `x-ignore` - Ignore Element

**Purpose**: Prevent Alpine.js from processing an element.

```html
<div x-data="{ message: 'Hello' }">
  <p x-text="message"></p>

  <!-- This won't be processed by Alpine -->
  <div x-ignore>
    <p x-text="message"></p> <!-- Literal text, not interpolated -->
  </div>
</div>
```

## Magic Properties

Magic properties are special variables prefixed with `$` that provide helpful utilities.

### `$el` - Current Element

**Purpose**: Reference to the current DOM element.

```html
<div x-data>
  <button @click="$el.remove()">
    Remove me
  </button>

  <div @click="$el.classList.toggle('highlight')">
    Click to highlight
  </div>

  <input @focus="$el.select()" type="text" value="Select on focus">
</div>
```

### `$refs` - Element References

**Purpose**: Access elements marked with `x-ref`.

```html
<div x-data="{
  focusFirst() {
    this.$refs.first.focus();
  }
}">
  <input x-ref="first" type="text">
  <input x-ref="second" type="text">
  <button @click="$refs.first.focus()">Focus First</button>
  <button @click="focusFirst()">Focus First (method)</button>
</div>
```

### `$store` - Global Stores

**Purpose**: Access global stores.

```javascript
Alpine.store('cart', {
  items: [],
  add(item) {
    this.items.push(item);
  },
  get total() {
    return this.items.length;
  }
});
```

```html
<div x-data>
  <p>Cart items: <span x-text="$store.cart.total"></span></p>
  <button @click="$store.cart.add({ name: 'Apple' })">
    Add Item
  </button>
</div>
```

### `$watch` - Watch Data Changes

**Purpose**: React to data changes.

```html
<div x-data="{ count: 0 }" x-init="
  $watch('count', value => {
    console.log('Count changed to:', value);
  })
">
  <button @click="count++">Count: <span x-text="count"></span></button>
</div>

<!-- Deep watching objects -->
<div x-data="{ user: { name: 'John' } }" x-init="
  $watch('user', value => {
    console.log('User changed:', value);
  })
">
  <input x-model="user.name">
</div>
```

### `$dispatch` - Dispatch Custom Events

**Purpose**: Emit custom events.

```html
<!-- Child component -->
<div x-data @click="$dispatch('custom-event', { detail: 'data' })">
  Click me
</div>

<!-- Parent listens -->
<div @custom-event="handleEvent($event.detail)">
  <!-- child here -->
</div>

<!-- Listen on window -->
<div x-data @custom-event.window="console.log('Received!')">
```

### `$nextTick` - Wait for DOM Update

**Purpose**: Execute code after next DOM update.

```html
<div x-data="{ show: false }">
  <button @click="
    show = true;
    $nextTick(() => {
      $refs.input.focus();
    })
  ">
    Show Input
  </button>

  <div x-show="show">
    <input x-ref="input" type="text">
  </div>
</div>
```

### `$root` - Root Element

**Purpose**: Reference to root element of component.

```html
<div x-data="{ message: 'Hello' }">
  <p x-text="message"></p>
  <button @click="$root.remove()">
    Remove entire component
  </button>
</div>
```

### `$id` - Generate Unique IDs

**Purpose**: Generate unique IDs for accessibility.

```html
<div x-data="{ id: $id('text-input') }">
  <label :for="id">Name:</label>
  <input :id="id" type="text">
</div>
```

Each instance gets a unique ID like `text-input-1`, `text-input-2`, etc.

## Installation & Setup

### Option 1: CDN (Recommended for Beginners)

Add Alpine.js from a CDN:

```html
<!DOCTYPE html>
<html>
<head>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>
  <div x-data="{ message: 'Hello Alpine!' }">
    <p x-text="message"></p>
  </div>
</body>
</html>
```

**Note**: Use `defer` to ensure Alpine loads after the DOM is ready.

### Option 2: NPM (For Build Systems)

Install via npm:

```bash
npm install alpinejs
```

Import and initialize:

```javascript
// main.js
import Alpine from 'alpinejs';

// Make Alpine available globally (optional)
window.Alpine = Alpine;

// Start Alpine
Alpine.start();
```

### Option 3: ES Module (Modern Browsers)

```html
<script type="module">
  import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js';

  Alpine.start();
</script>
```

### Setting Up This Project

#### Using CDN (No Build)

Simply open `index.html` in your browser:

```bash
# Serve with any static server
npx serve .

# Or use Python
python -m http.server 8000

# Or use PHP
php -S localhost:8000
```

#### Using NPM

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Project Structure

```
17-alpinejs/
├── index.html          # Main HTML file (CDN version)
├── src/
│   ├── app.js         # Alpine.js components and stores (modular version)
│   └── style.css      # Styles
├── package.json       # NPM configuration
└── README.md          # This file
```

### File Descriptions

**index.html**
- Complete, self-contained implementation
- Uses Alpine.js from CDN
- Includes inline component logic
- No build step required
- Perfect for learning and simple deployments

**src/app.js**
- Modular, reusable component definitions
- Demonstrates advanced patterns
- Exported functions for use with bundlers
- Better for larger applications

**src/style.css**
- Modern, responsive styles
- CSS custom properties (variables)
- Smooth animations and transitions
- Mobile-first design

**package.json**
- NPM dependencies (Alpine.js, Vite)
- Build scripts
- Optional for CDN usage

## Feature Implementation

### 1. Todo Store (Global State)

The todo store manages all todo-related state and operations:

```javascript
Alpine.store('todos', {
  items: [],           // Array of todo items
  filter: 'all',       // Current filter: 'all', 'active', 'completed'

  // Initialization
  init() {
    // Load from localStorage
    const saved = localStorage.getItem('alpine-todos');
    if (saved) {
      this.items = JSON.parse(saved);
    }
  },

  // CRUD operations
  add(text) { /* ... */ },
  remove(id) { /* ... */ },
  toggle(id) { /* ... */ },
  update(id, text) { /* ... */ },

  // Bulk operations
  clearCompleted() { /* ... */ },
  toggleAll(completed) { /* ... */ },

  // Computed properties
  get filteredItems() {
    // Returns filtered todos based on current filter
  },

  get activeCount() {
    // Number of uncompleted todos
  },

  get completedCount() {
    // Number of completed todos
  },

  // Persistence
  save() {
    localStorage.setItem('alpine-todos', JSON.stringify(this.items));
  }
});
```

### 2. Todo Component

The main component handles UI logic:

```javascript
Alpine.data('todoApp', () => ({
  newTodo: '',        // Text for new todo
  editingId: null,    // ID of todo being edited
  editingText: '',    // Text of todo being edited

  // Add a new todo
  addTodo() {
    if (this.newTodo.trim()) {
      this.$store.todos.add(this.newTodo);
      this.newTodo = '';
      this.$refs.input.focus();
    }
  },

  // Delete a todo
  deleteTodo(id) {
    this.$store.todos.remove(id);
  },

  // Edit mode
  startEdit(id, text) {
    this.editingId = id;
    this.editingText = text;

    // Focus input on next tick
    this.$nextTick(() => {
      this.$refs['edit-' + id].focus();
    });
  },

  // Computed properties
  get completionPercentage() {
    if (this.$store.todos.totalCount === 0) return '0%';
    return Math.round(
      (this.$store.todos.completedCount / this.$store.todos.totalCount) * 100
    ) + '%';
  }
}));
```

### 3. LocalStorage Persistence

Data is automatically saved to localStorage:

```javascript
// In the store's save method
save() {
  localStorage.setItem('alpine-todos', JSON.stringify(this.items));
}

// Called after every mutation
add(text) {
  this.items.push({ /* ... */ });
  this.save();  // Persist to localStorage
}
```

### 4. Filtering System

Toggle between all, active, and completed todos:

```javascript
// Store
get filteredItems() {
  switch (this.filter) {
    case 'active':
      return this.items.filter(item => !item.completed);
    case 'completed':
      return this.items.filter(item => item.completed);
    default:
      return this.items;
  }
}

setFilter(filter) {
  this.filter = filter;
}
```

```html
<!-- UI -->
<button @click="$store.todos.setFilter('all')">All</button>
<button @click="$store.todos.setFilter('active')">Active</button>
<button @click="$store.todos.setFilter('completed')">Completed</button>

<!-- Render filtered todos -->
<template x-for="todo in $store.todos.filteredItems" :key="todo.id">
  <li x-text="todo.text"></li>
</template>
```

### 5. Double-Click to Edit

Inline editing with double-click:

```html
<li :class="{ 'editing': editingId === todo.id }">
  <!-- View mode -->
  <div x-show="editingId !== todo.id">
    <label @dblclick="startEdit(todo.id, todo.text)">
      <span x-text="todo.text"></span>
    </label>
  </div>

  <!-- Edit mode -->
  <div x-show="editingId === todo.id">
    <input
      type="text"
      :value="editingText"
      @keyup.enter="saveEdit(todo.id)"
      @keyup.escape="cancelEdit"
      @blur="saveEdit(todo.id)"
      x-ref="'edit-' + todo.id"
    >
  </div>
</li>
```

### 6. Keyboard Shortcuts

Handle Enter and Escape keys:

```html
<!-- Add on Enter -->
<input @keyup.enter="addTodo()">

<!-- Save edit on Enter, cancel on Escape -->
<input
  @keyup.enter="saveEdit(todo.id)"
  @keyup.escape="cancelEdit"
>

<!-- Save on blur -->
<input @blur="saveEdit(todo.id)">
```

## Code Examples

### Example 1: Dropdown Component

```html
<div x-data="{ open: false }" @click.away="open = false">
  <button @click="open = !open">
    Open Menu
  </button>

  <div x-show="open" x-transition>
    <a href="#" @click="open = false">Option 1</a>
    <a href="#" @click="open = false">Option 2</a>
    <a href="#" @click="open = false">Option 3</a>
  </div>
</div>
```

### Example 2: Tabs Component

```html
<div x-data="{ activeTab: 'tab1' }">
  <div class="tabs">
    <button
      @click="activeTab = 'tab1'"
      :class="{ 'active': activeTab === 'tab1' }"
    >
      Tab 1
    </button>
    <button
      @click="activeTab = 'tab2'"
      :class="{ 'active': activeTab === 'tab2' }"
    >
      Tab 2
    </button>
  </div>

  <div class="tab-content">
    <div x-show="activeTab === 'tab1'">
      Content for tab 1
    </div>
    <div x-show="activeTab === 'tab2'">
      Content for tab 2
    </div>
  </div>
</div>
```

### Example 3: Form Validation

```html
<div x-data="{
  email: '',
  password: '',

  get isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  },

  get isValidPassword() {
    return this.password.length >= 8;
  },

  get canSubmit() {
    return this.isValidEmail && this.isValidPassword;
  },

  submit() {
    if (this.canSubmit) {
      alert('Form submitted!');
    }
  }
}">
  <form @submit.prevent="submit">
    <div>
      <input
        type="email"
        x-model="email"
        placeholder="Email"
        :class="{ 'error': email && !isValidEmail }"
      >
      <p x-show="email && !isValidEmail" class="error-message">
        Invalid email
      </p>
    </div>

    <div>
      <input
        type="password"
        x-model="password"
        placeholder="Password"
        :class="{ 'error': password && !isValidPassword }"
      >
      <p x-show="password && !isValidPassword" class="error-message">
        Password must be at least 8 characters
      </p>
    </div>

    <button type="submit" :disabled="!canSubmit">
      Submit
    </button>
  </form>
</div>
```

### Example 4: Infinite Scroll

```html
<div x-data="{
  items: Array.from({ length: 20 }, (_, i) => i + 1),

  loadMore() {
    const start = this.items.length;
    const newItems = Array.from({ length: 20 }, (_, i) => start + i + 1);
    this.items = [...this.items, ...newItems];
  }
}"
@scroll.window="
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    loadMore()
  }
">
  <div class="grid">
    <template x-for="item in items" :key="item">
      <div class="item" x-text="'Item ' + item"></div>
    </template>
  </div>
</div>
```

### Example 5: Search with Debounce

```html
<div x-data="{
  query: '',
  results: [],

  async search() {
    if (!this.query) {
      this.results = [];
      return;
    }

    const response = await fetch(`/api/search?q=${this.query}`);
    this.results = await response.json();
  }
}" x-init="$watch('query', () => search())">
  <input
    type="text"
    x-model.debounce.500ms="query"
    placeholder="Search..."
  >

  <ul x-show="results.length > 0">
    <template x-for="result in results" :key="result.id">
      <li x-text="result.title"></li>
    </template>
  </ul>
</div>
```

## When to Use Alpine.js

### Perfect Use Cases

1. **Server-Rendered Pages**
   - Adding interactivity to traditional PHP/Rails/Django apps
   - Progressive enhancement of static HTML
   - No need for a full SPA

2. **Simple Components**
   - Dropdowns, modals, accordions
   - Form validation
   - Tabs and toggles
   - Image galleries

3. **Rapid Prototyping**
   - Quick mockups
   - Landing pages
   - Marketing sites

4. **Small to Medium Projects**
   - Personal websites
   - Blogs with interactive elements
   - Documentation sites

5. **No Build Step Desired**
   - Quick projects
   - Learning JavaScript reactivity
   - Avoiding complexity

### Not Recommended For

1. **Large Single Page Applications**
   - Use React, Vue, or Angular instead
   - Need routing, complex state, lazy loading

2. **Mobile Applications**
   - Use React Native, Flutter, or Ionic

3. **Heavily Interactive UIs**
   - Real-time collaboration tools
   - Complex data visualization
   - Games

4. **Need for Strong TypeScript**
   - Better support in React, Vue, Angular

5. **Large Teams**
   - Need strict patterns and architecture
   - Require strong tooling

## Performance Considerations

### Alpine.js Performance Characteristics

**Pros:**
- ✅ Small bundle size (~15kb)
- ✅ No virtual DOM overhead
- ✅ Direct DOM manipulation
- ✅ Fast initial load
- ✅ Good for simple interactions

**Cons:**
- ❌ No optimization for large lists (use pagination)
- ❌ No built-in memoization
- ❌ Can be slower than virtual DOM for frequent updates

### Optimization Tips

1. **Use `x-if` for Large Trees**

```html
<!-- Bad: Large tree kept in DOM -->
<div x-show="visible">
  <!-- 100+ elements -->
</div>

<!-- Good: Removed from DOM when hidden -->
<template x-if="visible">
  <div>
    <!-- 100+ elements -->
  </div>
</template>
```

2. **Paginate Large Lists**

```html
<div x-data="{
  items: [...], // 1000 items
  page: 0,
  perPage: 20,

  get visibleItems() {
    const start = this.page * this.perPage;
    return this.items.slice(start, start + this.perPage);
  }
}">
  <template x-for="item in visibleItems">
    <div x-text="item.name"></div>
  </template>
</div>
```

3. **Debounce Expensive Operations**

```html
<input
  @input.debounce.500ms="expensiveSearch($event.target.value)"
>
```

4. **Avoid Deep Nesting**

```html
<!-- Bad: Deep reactivity -->
<div x-data="{
  level1: {
    level2: {
      level3: {
        value: 0
      }
    }
  }
}">

<!-- Good: Flat structure -->
<div x-data="{ value: 0 }">
```

## Best Practices

### 1. Component Organization

```javascript
// ❌ Bad: Everything inline
<div x-data="{
  foo: 1,
  bar: 2,
  baz: function() { /* ... */ },
  // 50 more lines...
}">

// ✅ Good: Extract to function
function myComponent() {
  return {
    foo: 1,
    bar: 2,
    baz() { /* ... */ }
  };
}

Alpine.data('myComponent', myComponent);

<div x-data="myComponent">
```

### 2. Store Organization

```javascript
// ✅ Good: Separate concerns
Alpine.store('auth', {
  user: null,
  login(credentials) { /* ... */ },
  logout() { /* ... */ }
});

Alpine.store('cart', {
  items: [],
  add(item) { /* ... */ },
  remove(id) { /* ... */ }
});

Alpine.store('ui', {
  sidebarOpen: false,
  modalOpen: false
});
```

### 3. Naming Conventions

```javascript
// ✅ Good naming
<div x-data="{
  isLoading: false,      // Boolean: is/has prefix
  hasError: false,
  userName: '',          // camelCase
  MAX_ITEMS: 100,        // Constants: UPPER_CASE

  // Methods: verbs
  loadData() {},
  saveUser() {},

  // Getters: nouns
  get totalPrice() {}
}">
```

### 4. Avoid Anti-Patterns

```html
<!-- ❌ Bad: Manipulating Alpine data from outside -->
<script>
  document.getElementById('myComponent').x-data.count = 5;
</script>

<!-- ✅ Good: Use $dispatch or store -->
<div x-data @increment.window="count++">
  <button @click="$dispatch('increment')">+</button>
</div>

<!-- ❌ Bad: Mixing jQuery and Alpine -->
<div x-data="{ count: 0 }">
  <button onclick="$('#count').text(5)">Bad</button>
  <span id="count" x-text="count"></span>
</div>

<!-- ✅ Good: Pure Alpine -->
<div x-data="{ count: 0 }">
  <button @click="count = 5">Good</button>
  <span x-text="count"></span>
</div>
```

## Common Patterns

### 1. Modal Dialog

```html
<div x-data="{ open: false }" @keydown.escape.window="open = false">
  <button @click="open = true">Open Modal</button>

  <div x-show="open" @click.self="open = false" class="modal-overlay">
    <div class="modal-content">
      <h2>Modal Title</h2>
      <p>Modal content here</p>
      <button @click="open = false">Close</button>
    </div>
  </div>
</div>
```

### 2. Accordion

```html
<div x-data="{ activeIndex: null }">
  <template x-for="(item, index) in items" :key="index">
    <div>
      <button
        @click="activeIndex = activeIndex === index ? null : index"
        :class="{ 'active': activeIndex === index }"
      >
        <span x-text="item.title"></span>
      </button>

      <div x-show="activeIndex === index" x-collapse>
        <p x-text="item.content"></p>
      </div>
    </div>
  </template>
</div>
```

### 3. Loading States

```html
<div x-data="{
  loading: false,
  data: null,
  error: null,

  async fetchData() {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetch('/api/data');
      this.data = await response.json();
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }
}" x-init="fetchData()">
  <div x-show="loading">Loading...</div>
  <div x-show="error" x-text="error"></div>
  <div x-show="data && !loading">
    <pre x-text="JSON.stringify(data, null, 2)"></pre>
  </div>
</div>
```

## Debugging Tips

### 1. Enable Alpine DevTools

```javascript
// Add to your code
window.Alpine = Alpine;
Alpine.start();
```

Then install the [Alpine.js DevTools](https://github.com/alpine-collective/alpinejs-devtools) browser extension.

### 2. Debug with $watch

```html
<div x-data="{ count: 0 }" x-init="
  $watch('count', value => {
    console.log('Count changed:', value);
  })
">
```

### 3. Inspect Component State

```javascript
// In browser console
document.querySelector('[x-data]')._x_dataStack
```

### 4. Common Errors

**Error: Cannot read property of undefined**

```html
<!-- ❌ Bad: user might be null -->
<div x-text="user.name"></div>

<!-- ✅ Good: Optional chaining -->
<div x-text="user?.name || 'Guest'"></div>
```

**Error: $refs.element is undefined**

```javascript
// ❌ Bad: Accessing before render
addTodo() {
  this.todos.push(newTodo);
  this.$refs.input.focus(); // Input might not exist yet
}

// ✅ Good: Use $nextTick
addTodo() {
  this.todos.push(newTodo);
  this.$nextTick(() => {
    this.$refs.input.focus();
  });
}
```

## Resources

### Official Documentation

- [Alpine.js Official Docs](https://alpinejs.dev/)
- [Alpine.js GitHub](https://github.com/alpinejs/alpine)
- [Alpine.js Examples](https://alpinejs.dev/examples)

### Plugins

- [Alpine.js Plugins](https://alpinejs.dev/plugins)
  - Intersect (Intersection Observer)
  - Persist (localStorage)
  - Focus (Focus management)
  - Collapse (Smooth height transitions)
  - Morph (DOM morphing)

### Community

- [Alpine.js Discussions](https://github.com/alpinejs/alpine/discussions)
- [Alpine.js on Discord](https://discord.gg/alpinejs)
- [Alpine Toolbox](https://www.alpinetoolbox.com/) - Community components

### Learning Resources

- [Alpine.js Crash Course (YouTube)](https://www.youtube.com/results?search_query=alpinejs+crash+course)
- [Alpine.js vs Vue Comparison](https://alpinejs.dev/comparison)
- [Alpine.js Examples Collection](https://codepen.io/collection/DgwjLy)

### Related Tools

- [Tailwind CSS](https://tailwindcss.com/) - Perfect companion for styling
- [htmx](https://htmx.org/) - For AJAX requests and server interaction
- [Livewire](https://laravel-livewire.com/) - Laravel + Alpine integration

---

## Conclusion

Alpine.js is the perfect tool for adding reactivity and interactivity to your web pages without the complexity of a full framework. It's:

- **Simple** - Easy to learn, familiar syntax
- **Powerful** - Reactive, declarative, feature-rich
- **Flexible** - Works with any backend, no build required
- **Modern** - ES6+, best practices, active community

This Todo List implementation demonstrates Alpine.js's core features:

- ✅ Reactive state with `x-data`
- ✅ Global state with `Alpine.store`
- ✅ Two-way binding with `x-model`
- ✅ List rendering with `x-for`
- ✅ Conditional rendering with `x-show` / `x-if`
- ✅ Event handling with `@click` / `@keyup`
- ✅ Magic properties like `$refs`, `$store`, `$nextTick`
- ✅ LocalStorage persistence
- ✅ Clean, maintainable code structure

Whether you're building a simple dropdown or a complex todo application, Alpine.js provides the right level of abstraction to get the job done efficiently.

**Happy coding with Alpine.js!** 🏔️
