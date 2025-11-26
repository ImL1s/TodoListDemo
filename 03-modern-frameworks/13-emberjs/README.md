# Ember.js Todo List Application

> A complete, production-ready Todo List application built with Ember.js 5.x demonstrating the power of Convention over Configuration

![Ember.js Version](https://img.shields.io/badge/Ember.js-5.4-E04E39?logo=ember.js)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

## Table of Contents

- [Introduction](#introduction)
- [What is Ember.js?](#what-is-emberjs)
- [History and Evolution](#history-and-evolution)
- [Key Features](#key-features)
- [Convention over Configuration](#convention-over-configuration)
- [Comparison with Other Frameworks](#comparison-with-other-frameworks)
- [When to Choose Ember.js](#when-to-choose-emberjs)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Services](#services)
- [Routing](#routing)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Best Practices](#best-practices)
- [Performance Optimization](#performance-optimization)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

## Introduction

This project is a comprehensive Todo List application built with **Ember.js 5.x**, showcasing the framework's powerful features and elegant architecture. It demonstrates:

- **Convention over Configuration**: Minimal boilerplate, maximum productivity
- **Glimmer Components**: Modern, performant component system
- **Tracked Properties**: Automatic reactivity without complex state management
- **Ember CLI**: World-class developer experience
- **Services**: Singleton pattern for shared state and logic
- **Router**: First-class routing with nested routes support

## What is Ember.js?

**Ember.js** is a productive, battle-tested JavaScript framework for building modern web applications. Created by Yehuda Katz (co-creator of jQuery and Rails core team member) and Tom Dale in 2011, Ember.js provides everything you need to build rich web applications.

### Philosophy

Ember.js is built on several core principles:

1. **Convention over Configuration**: Reduce decision fatigue by providing sensible defaults
2. **Stability without Stagnation**: Maintain backwards compatibility while continuously improving
3. **Developer Ergonomics**: Focus on developer productivity and happiness
4. **Shared Solutions**: Solve common problems once for the entire community

### Key Characteristics

- **Opinionated**: Strong conventions lead to consistent codebases
- **Full-Featured**: Router, data layer, build system, and more out of the box
- **Ambitious**: Designed for large-scale, long-lived applications
- **Community-Driven**: RFC process ensures thoughtful feature development
- **Enterprise-Ready**: Powers applications at Apple, Netflix, LinkedIn, and more

## History and Evolution

### The Journey of Ember.js

#### Early Days (2011-2013)
- **2011**: SproutCore 2.0 renamed to Ember.js
- **2012**: Ember 1.0 Pre-release, establishing core concepts
- **2013**: Ember 1.0 released with stable API

#### Maturation (2014-2016)
- **2014**: Ember CLI introduced, revolutionizing the build pipeline
- **2015**: Ember 2.0 released with improved performance
- **2016**: FastBoot (server-side rendering) introduced

#### Modern Era (2017-2020)
- **2018**: Ember Octane announced - modern component model
- **2019**: Glimmer Components and Tracked Properties
- **2020**: Ember Octane becomes default edition

#### Current (2021-Present)
- **2021-2023**: Continuous improvements to TypeScript support
- **2023**: Ember 5.0 released with modern JavaScript features
- **2024**: Focus on performance, DX, and ecosystem growth

### Major Milestones

1. **Ember CLI (2014)**: Unified build tool and project structure
2. **Ember Data (2013)**: Powerful data persistence library
3. **Glimmer VM (2017)**: High-performance rendering engine
4. **Ember Octane (2019)**: Modern component model and reactivity
5. **Embroider (2020)**: Next-generation build system

## Key Features

### 1. Glimmer Components

Modern component API with:
- No implicit `this`
- Clear argument passing with `@args`
- Lifecycle simplification
- Better performance

```javascript
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TodoItemComponent extends Component {
  @tracked isEditing = false;

  @action
  startEditing() {
    this.isEditing = true;
  }
}
```

### 2. Tracked Properties

Automatic fine-grained reactivity:

```javascript
import { tracked } from '@glimmer/tracking';

class TodoList {
  @tracked todos = [];

  get activeTodos() {
    // Automatically recomputes when todos changes
    return this.todos.filter(t => !t.completed);
  }
}
```

### 3. Ember CLI

Comprehensive command-line interface:
- Project scaffolding
- Development server with live reload
- Testing framework integration
- Build optimization
- Addon ecosystem

### 4. Router

First-class routing system:
- Nested routes
- Dynamic segments
- Query parameters
- Loading and error substates
- Route-driven architecture

### 5. Services

Singleton objects for shared state:
- Dependency injection
- Lazy instantiation
- Testable and mockable
- Framework-managed lifecycle

### 6. Ember Data (Optional)

Powerful data layer:
- REST and JSON:API adapters
- Relationships and computed properties
- Caching and identity map
- Flexible adapter/serializer pattern

## Convention over Configuration

Ember's greatest strength is its **Convention over Configuration** philosophy. This means:

### 1. File Structure Conventions

```
app/
├── components/          # UI components
├── controllers/         # Route controllers
├── routes/             # Route handlers
├── services/           # Singleton services
├── templates/          # Handlebars templates
└── styles/             # CSS/SCSS files
```

**Benefit**: Everyone knows where to find things. No configuration needed.

### 2. Naming Conventions

```javascript
// File: app/routes/todos.js
export default class TodosRoute extends Route {}

// File: app/controllers/todos.js
export default class TodosController extends Controller {}

// File: app/templates/todos.hbs
// Automatically associated with route and controller
```

**Benefit**: Framework automatically wires things together.

### 3. URL Structure

```javascript
Router.map(function() {
  this.route('todos', function() {
    this.route('todo', { path: '/:todo_id' });
  });
});

// Automatically generates:
// /todos
// /todos/123
```

**Benefit**: Clean URLs without manual configuration.

### 4. Component Templates

```
app/
├── components/
│   ├── todo-item.js
│   └── todo-item.hbs  # Auto-associated template
```

**Benefit**: Templates automatically paired with components.

### 5. Resolver Pattern

Ember's resolver automatically finds:
- Routes based on URL
- Controllers for routes
- Templates for routes/components
- Services by name

**Benefit**: Zero configuration for standard use cases.

## Comparison with Other Frameworks

### Ember.js vs React

| Aspect | Ember.js | React |
|--------|----------|-------|
| **Philosophy** | Convention over Configuration | Flexibility & Composition |
| **Learning Curve** | Steeper initially, but consistent | Gradual, but ecosystem overwhelming |
| **Routing** | Built-in, powerful | Requires React Router |
| **State Management** | Services, Tracked Properties | Redux, Context, Zustand, etc. |
| **Data Layer** | Ember Data (optional) | Various libraries (Apollo, SWR, etc.) |
| **Build System** | Ember CLI | Create React App, Vite, Next.js, etc. |
| **Template Syntax** | Handlebars | JSX |
| **Component Model** | Glimmer Components | Function Components with Hooks |
| **Reactivity** | Tracked Properties (auto) | useState, useMemo (manual) |
| **Ecosystem** | Curated, official addons | Vast, fragmented |
| **Best For** | Large, long-lived apps | Flexible, rapidly changing apps |
| **Corporate Backing** | Community-driven, RFC process | Meta (Facebook) |

#### Code Comparison

**React:**
```jsx
import { useState } from 'react';

function TodoItem({ todo, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className={todo.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />
      <span>{todo.text}</span>
    </li>
  );
}
```

**Ember.js:**
```javascript
// todo-item.js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TodoItemComponent extends Component {
  @tracked isEditing = false;

  @action
  toggle() {
    this.args.onToggle(this.args.todo);
  }
}
```

```handlebars
{{! todo-item.hbs }}
<li class={{if @todo.completed "completed"}}>
  <input
    type="checkbox"
    checked={{@todo.completed}}
    {{on "change" this.toggle}}
  />
  <span>{{@todo.text}}</span>
</li>
```

### Ember.js vs Vue

| Aspect | Ember.js | Vue |
|--------|----------|-----|
| **Philosophy** | Convention over Configuration | Progressive Framework |
| **Learning Curve** | Steeper, more concepts | Gentle, approachable |
| **Routing** | Built-in, powerful | Vue Router (official) |
| **State Management** | Services, Tracked Properties | Pinia/Vuex |
| **Data Layer** | Ember Data | Various (Axios, etc.) |
| **Build System** | Ember CLI | Vue CLI, Vite |
| **Template Syntax** | Handlebars | Vue Templates |
| **Component Model** | Glimmer Components | Composition API |
| **Reactivity** | Tracked Properties | Reactive References |
| **Ecosystem** | Curated | Growing, official libraries |
| **Best For** | Enterprise applications | All scales, especially small-medium |

#### Code Comparison

**Vue 3:**
```vue
<script setup>
import { ref } from 'vue';

const props = defineProps(['todo']);
const emit = defineEmits(['toggle']);
const isEditing = ref(false);
</script>

<template>
  <li :class="{ completed: todo.completed }">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="emit('toggle', todo)"
    />
    <span>{{ todo.text }}</span>
  </li>
</template>
```

**Ember.js:**
```javascript
// Same as above
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TodoItemComponent extends Component {
  @tracked isEditing = false;

  @action
  toggle() {
    this.args.onToggle(this.args.todo);
  }
}
```

### Ember.js vs Angular

| Aspect | Ember.js | Angular |
|--------|----------|---------|
| **Philosophy** | Convention over Configuration | Comprehensive Platform |
| **Language** | JavaScript/TypeScript | TypeScript (required) |
| **Learning Curve** | Moderate | Steep |
| **Routing** | Ember Router | Angular Router |
| **State Management** | Services, Tracked Properties | RxJS, Services |
| **Data Layer** | Ember Data | HttpClient, RxJS |
| **Build System** | Ember CLI | Angular CLI |
| **Template Syntax** | Handlebars | Angular Templates |
| **Reactivity** | Tracked Properties | Zone.js, Observables |
| **Dependency Injection** | Simple, annotation-based | Complex, decorator-based |
| **Best For** | Web applications | Enterprise, full-stack |

### Key Differentiators

#### What Makes Ember Unique?

1. **Stability Without Stagnation**
   - Semantic versioning
   - Long-term support releases
   - Deprecation warnings before breaking changes
   - Clear upgrade paths

2. **Batteries Included**
   - Router, data layer, build system all included
   - No decision fatigue
   - Consistent patterns across projects

3. **Community Governance**
   - RFC (Request for Comments) process
   - Community-driven feature development
   - Transparent decision making

4. **Ember CLI**
   - Best-in-class developer experience
   - Powerful addon ecosystem
   - Zero-config defaults

5. **Octane Edition**
   - Modern JavaScript patterns
   - Decorator-based API
   - Glimmer rendering engine

## When to Choose Ember.js

### Ember.js is Excellent For:

#### 1. Large-Scale Applications
- **Why**: Strong conventions prevent architectural drift
- **Examples**: Admin dashboards, CRMs, complex SaaS products
- **Benefits**:
  - Consistent codebase even with large teams
  - Easy onboarding for new developers
  - Scalable architecture patterns

#### 2. Long-Lived Projects
- **Why**: Stability guarantees and clear upgrade paths
- **Examples**: Products with 5+ year lifespans
- **Benefits**:
  - Minimal breaking changes
  - Active LTS support
  - Future-proof with deprecation warnings

#### 3. Team-Based Development
- **Why**: Conventions reduce bikeshedding
- **Examples**: Enterprise teams, agencies
- **Benefits**:
  - Everyone follows same patterns
  - Easy code review
  - Predictable structure

#### 4. Rapid Prototyping (with Ember knowledge)
- **Why**: CLI generators and addons accelerate development
- **Examples**: MVPs, internal tools
- **Benefits**:
  - Generate boilerplate instantly
  - Rich addon ecosystem
  - Fast iteration cycles

#### 5. Applications with Complex Routing
- **Why**: First-class router with nested routes
- **Examples**: Multi-page applications, dashboards
- **Benefits**:
  - URL-driven state
  - Loading and error substates
  - Query parameter handling

### Consider Alternatives When:

#### 1. Small, Simple Projects
- **Why**: Ember's conventions might be overkill
- **Alternative**: Vue, Svelte
- **Reason**: Lighter weight, faster setup

#### 2. Static Sites or Blogs
- **Why**: Framework overhead not needed
- **Alternative**: Next.js, Gatsby, Astro
- **Reason**: Better SSG capabilities

#### 3. Highly Specialized Rendering
- **Why**: Need low-level control
- **Alternative**: React with custom renderers
- **Reason**: More flexibility

#### 4. Team Unfamiliar with Ember
- **Why**: Learning curve for new concepts
- **Alternative**: React, Vue (more common)
- **Reason**: Easier to hire, larger community

#### 5. Microservices/Microfrontends
- **Why**: Ember is monolithic
- **Alternative**: React, Web Components
- **Reason**: Better for independent deployment

### Real-World Ember.js Users

Companies successfully using Ember.js:

- **Apple**: iCloud web applications
- **Netflix**: Internal tools and dashboards
- **LinkedIn**: Career pages and tools
- **Square**: Dashboard applications
- **Discourse**: Open-source forum platform
- **Ghost**: Publishing platform admin
- **Intercom**: Customer messaging platform
- **Travis CI**: Continuous integration platform

## Prerequisites

Before starting, ensure you have:

### Required

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **Git**: For version control

### Recommended

- **Visual Studio Code** with extensions:
  - Ember Language Server
  - Handlebars
  - ESLint
  - Prettier

### Check Versions

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
git --version   # Any recent version
```

## Installation

### Step 1: Clone or Create Project

If cloning this repository:

```bash
git clone <repository-url>
cd 03-modern-frameworks/13-emberjs
```

If creating from scratch:

```bash
# Install Ember CLI globally (optional but recommended)
npm install -g ember-cli

# Create new project
ember new emberjs-todo-list --no-welcome

# Navigate to project
cd emberjs-todo-list
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Ember.js framework
- Ember CLI build tools
- Babel for JavaScript transpilation
- Webpack for bundling
- Testing frameworks (QUnit, Ember Testing)
- Development dependencies

### Step 3: Verify Installation

```bash
# Check Ember CLI version
npx ember --version

# Should output something like:
# ember-cli: 5.4.0
# node: 18.x.x
# os: linux x64
```

## Running the Application

### Development Server

Start the development server with live reload:

```bash
npm start
# or
npx ember serve
```

The application will be available at:
- **URL**: http://localhost:4200
- **Tests**: http://localhost:4200/tests

You'll see output like:

```
Build successful (5892ms) – Serving on http://localhost:4200/

Slowest Nodes (totalTime >= 5%)                    | Total (avg)
------------------------------------------------------------
Babel (15)                                         | 2841ms
Package /assets/vendor.js (1)                      | 1523ms
```

### Development Features

- **Live Reload**: Changes automatically refresh the browser
- **Source Maps**: Debug original source code
- **Error Overlay**: Clear error messages in browser
- **Fast Rebuilds**: Incremental compilation

### Environment Options

```bash
# Development (default)
npx ember serve

# Production preview
npx ember serve --environment=production

# Custom port
npx ember serve --port=3000

# Disable live reload
npx ember serve --live-reload=false
```

## Project Structure

### Overview

```
emberjs-todo-list/
├── app/                    # Application source code
│   ├── components/         # Reusable UI components
│   │   ├── todo-input.js
│   │   ├── todo-list.js
│   │   └── todo-item.js
│   ├── controllers/        # Route controllers
│   │   └── application.js
│   ├── routes/            # Route handlers
│   │   └── application.js
│   ├── services/          # Singleton services
│   │   └── todo-storage.js
│   ├── templates/         # Handlebars templates
│   │   ├── application.hbs
│   │   └── components/
│   │       ├── todo-input.hbs
│   │       ├── todo-list.hbs
│   │       └── todo-item.hbs
│   ├── styles/            # Application styles
│   │   └── app.css
│   ├── app.js             # Application instance
│   └── router.js          # Route definitions
├── config/                # Configuration files
│   ├── environment.js     # Environment config
│   └── targets.js         # Browser targets
├── public/                # Static assets
│   └── index.html         # HTML entry point
├── tests/                 # Test files
├── ember-cli-build.js     # Build configuration
├── package.json           # Dependencies
└── README.md              # Documentation
```

### Detailed Structure

#### `app/` Directory

The heart of your application:

**`app/components/`**
- Reusable UI components
- Glimmer component JavaScript files
- Paired with templates in `app/templates/components/`

**`app/controllers/`**
- Handle user interactions
- Manage component state
- Provide actions to templates

**`app/routes/`**
- Load data (model hook)
- Handle route transitions
- Setup controllers

**`app/services/`**
- Singleton objects
- Shared state and logic
- Dependency injection

**`app/templates/`**
- Handlebars templates
- Route templates at root
- Component templates in `components/` subdirectory

**`app/styles/`**
- CSS/SCSS files
- Automatically compiled and bundled

#### `config/` Directory

**`config/environment.js`**
- Environment-specific configuration
- Feature flags
- API endpoints

**`config/targets.js`**
- Browser support targets
- Transpilation configuration

#### `public/` Directory

Static assets served as-is:
- `index.html`: HTML entry point
- `robots.txt`: SEO configuration
- Images, fonts, etc.

#### `tests/` Directory

Test files mirroring `app/` structure:
- Unit tests
- Integration tests
- Acceptance tests

## Core Concepts

### 1. Glimmer Components

Modern component API introduced in Ember Octane:

#### Basic Structure

```javascript
// app/components/my-component.js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyComponent extends Component {
  // Tracked property - reactive state
  @tracked count = 0;

  // Getter - computed property
  get doubleCount() {
    return this.count * 2;
  }

  // Action - event handler
  @action
  increment() {
    this.count++;
  }
}
```

```handlebars
{{! app/templates/components/my-component.hbs }}
<div>
  <p>Count: {{this.count}}</p>
  <p>Double: {{this.doubleCount}}</p>
  <button {{on "click" this.increment}}>Increment</button>
</div>
```

#### Arguments

Components receive arguments from parent:

```handlebars
{{! Parent template }}
<MyComponent @title="Hello" @count={{this.initialCount}} />
```

```javascript
// my-component.js
export default class MyComponent extends Component {
  get message() {
    // Access arguments via this.args
    return `${this.args.title}: ${this.args.count}`;
  }
}
```

#### Lifecycle

Glimmer components have minimal lifecycle:

- **constructor**: Component instantiated
- **willDestroy**: Component about to be destroyed

```javascript
export default class MyComponent extends Component {
  constructor() {
    super(...arguments);
    console.log('Component created');
  }

  willDestroy() {
    super.willDestroy(...arguments);
    console.log('Component destroyed');
  }
}
```

### 2. Tracked Properties

Auto-tracking system for reactivity:

```javascript
import { tracked } from '@glimmer/tracking';

class TodoList {
  @tracked todos = [];
  @tracked filter = 'all';

  // Automatically recomputes when todos or filter changes
  get filteredTodos() {
    return this.todos.filter(todo => {
      if (this.filter === 'active') return !todo.completed;
      if (this.filter === 'completed') return todo.completed;
      return true;
    });
  }
}
```

**Key Points:**
- Mark mutable properties with `@tracked`
- Getters automatically recompute
- No manual dependency tracking needed

### 3. Actions

Event handlers in components:

```javascript
import { action } from '@ember/object';

export default class MyComponent extends Component {
  @action
  handleClick(event) {
    console.log('Clicked!', event);
  }

  @action
  handleSubmit(event) {
    event.preventDefault();
    // Handle form submission
  }
}
```

```handlebars
<button {{on "click" this.handleClick}}>Click Me</button>
<form {{on "submit" this.handleSubmit}}>...</form>
```

### 4. Template Syntax

Handlebars templates with Ember helpers:

#### Interpolation

```handlebars
<p>{{this.message}}</p>
<p>{{@argumentFromParent}}</p>
```

#### Conditionals

```handlebars
{{#if this.isVisible}}
  <p>Visible!</p>
{{else}}
  <p>Hidden!</p>
{{/if}}

{{#unless this.isDisabled}}
  <button>Click</button>
{{/unless}}
```

#### Loops

```handlebars
<ul>
  {{#each this.items as |item|}}
    <li>{{item.name}}</li>
  {{/each}}
</ul>
```

#### Event Handlers

```handlebars
<button {{on "click" this.handleClick}}>Click</button>
<input {{on "input" this.handleInput}} />
```

#### Helpers

```handlebars
{{! Built-in helpers }}
<div class={{if this.isActive "active" "inactive"}}>...</div>
<p>{{concat "Hello" " " "World"}}</p>
<p>{{eq this.value 10}}</p>
```

### 5. Services

Singleton objects for shared state:

```javascript
// app/services/current-user.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentUserService extends Service {
  @tracked user = null;

  async load() {
    const response = await fetch('/api/user');
    this.user = await response.json();
  }
}
```

Inject into components/routes:

```javascript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class MyComponent extends Component {
  @service currentUser;

  get userName() {
    return this.currentUser.user?.name;
  }
}
```

### 6. Routes

Handle URL changes and load data:

```javascript
// app/routes/todos.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class TodosRoute extends Route {
  @service todoStorage;

  // Model hook - loads data for route
  model() {
    return {
      todos: this.todoStorage.todos
    };
  }

  // Setup controller after model loads
  setupController(controller, model) {
    super.setupController(controller, model);
    // Additional setup
  }
}
```

### 7. Controllers

Handle user interactions:

```javascript
// app/controllers/todos.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TodosController extends Controller {
  @tracked filter = 'all';

  @action
  setFilter(newFilter) {
    this.filter = newFilter;
  }

  get filteredTodos() {
    // Access model from route
    return this.model.todos.filter(...);
  }
}
```

## Component Architecture

### Component Hierarchy

```
Application
└── TodoInput (input component)
└── TodoList (list container)
    └── TodoItem (individual item)
        └── Edit input (inline editing)
```

### Component Communication

#### 1. Data Down, Actions Up (DDAU)

**Parent passes data down:**

```handlebars
{{! application.hbs }}
<TodoList
  @todos={{this.filteredTodos}}
  @onToggle={{this.toggleTodo}}
  @onDelete={{this.deleteTodo}}
/>
```

**Child receives and uses:**

```javascript
// todo-list.js
export default class TodoListComponent extends Component {
  @action
  handleToggle(todo) {
    // Call parent action
    this.args.onToggle(todo);
  }
}
```

#### 2. Argument Types

```handlebars
{{! Passing different types }}
<MyComponent
  @string="Hello"
  @number={{42}}
  @boolean={{true}}
  @array={{this.items}}
  @object={{this.config}}
  @function={{this.handleClick}}
/>
```

#### 3. Component Composition

```handlebars
{{! Parent component }}
<div class="card">
  <div class="card-header">
    {{yield to="header"}}
  </div>
  <div class="card-body">
    {{yield}}
  </div>
</div>
```

```handlebars
{{! Usage }}
<Card>
  <:header>
    <h2>Title</h2>
  </:header>
  <p>Content goes here</p>
</Card>
```

### Component Best Practices

1. **Single Responsibility**: Each component does one thing well
2. **Reusability**: Design for reuse across routes
3. **Testability**: Keep logic in JavaScript, not templates
4. **Prop Validation**: Document expected arguments
5. **Naming**: Use descriptive, consistent names

## Data Flow

### Application Data Flow

```
1. Route.model() → Loads data from service
2. Route.setupController() → Passes data to controller
3. Controller → Makes data available to template
4. Template → Renders components with data
5. Component → Displays data, emits actions
6. Controller.action() → Updates service
7. Service → Persists to localStorage
8. Tracked properties → Auto-update UI
```

### Reactivity Flow

```javascript
// Service changes
this.todoStorage.addTodo('New task');

// Tracked property updates
this.todoStorage.todos = [...todos, newTodo];

// Getters automatically recompute
get activeTodos() {
  return this.todos.filter(t => !t.completed);
}

// Template auto-updates
{{this.activeTodosCount}}
```

### State Management Patterns

#### 1. Local Component State

```javascript
export default class TodoItemComponent extends Component {
  @tracked isEditing = false; // Component-only state
}
```

#### 2. Service State (Shared)

```javascript
// app/services/todo-storage.js
export default class TodoStorageService extends Service {
  @tracked todos = []; // Shared across components
}
```

#### 3. Route Model State

```javascript
// app/routes/application.js
export default class ApplicationRoute extends Route {
  model() {
    return { todos: [] }; // Available to controller/template
  }
}
```

## Services

### Creating a Service

```bash
npx ember generate service todo-storage
```

### Service Patterns

#### 1. Data Storage Service

```javascript
// app/services/todo-storage.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';

export default class TodoStorageService extends Service {
  @tracked todos = new TrackedArray([]);

  addTodo(text) {
    this.todos.push({ id: Date.now(), text, completed: false });
    this.save();
  }

  save() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  load() {
    const data = localStorage.getItem('todos');
    this.todos = new TrackedArray(JSON.parse(data) || []);
  }
}
```

#### 2. API Service

```javascript
// app/services/api.js
import Service from '@ember/service';

export default class ApiService extends Service {
  host = 'https://api.example.com';

  async fetch(endpoint, options = {}) {
    const url = `${this.host}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    return response.json();
  }

  get(endpoint) {
    return this.fetch(endpoint);
  }

  post(endpoint, data) {
    return this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
```

#### 3. Session Service

```javascript
// app/services/session.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SessionService extends Service {
  @tracked currentUser = null;
  @tracked isAuthenticated = false;

  async login(credentials) {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const user = await response.json();
    this.currentUser = user;
    this.isAuthenticated = true;
  }

  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }
}
```

## Routing

### Basic Routing

```javascript
// app/router.js
Router.map(function() {
  this.route('todos');
  this.route('todo', { path: '/todos/:todo_id' });
  this.route('about');
});
```

### Route Handlers

```javascript
// app/routes/todos.js
import Route from '@ember/routing/route';

export default class TodosRoute extends Route {
  // Load data
  model() {
    return this.store.findAll('todo');
  }

  // Redirect if needed
  redirect(model, transition) {
    if (!model.length) {
      this.transitionTo('welcome');
    }
  }
}
```

### Nested Routes

```javascript
Router.map(function() {
  this.route('todos', function() {
    this.route('active');
    this.route('completed');
  });
});
```

### Link-to Helper

```handlebars
<LinkTo @route="todos">View Todos</LinkTo>
<LinkTo @route="todo" @model={{this.selectedTodo}}>View Details</LinkTo>
```

## Testing

### Test Types

#### 1. Unit Tests

Test individual functions:

```javascript
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | todo-storage', function(hooks) {
  setupTest(hooks);

  test('adds todo correctly', function(assert) {
    const service = this.owner.lookup('service:todo-storage');
    service.addTodo('Test task');

    assert.strictEqual(service.todos.length, 1);
    assert.strictEqual(service.todos[0].text, 'Test task');
  });
});
```

#### 2. Integration Tests

Test component rendering:

```javascript
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | todo-item', function(hooks) {
  setupRenderingTest(hooks);

  test('renders todo text', async function(assert) {
    this.todo = { id: 1, text: 'Test', completed: false };

    await render(hbs`<TodoItem @todo={{this.todo}} />`);

    assert.dom('label').hasText('Test');
  });
});
```

#### 3. Acceptance Tests

Test user flows:

```javascript
import { module, test } from 'qunit';
import { visit, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | todos', function(hooks) {
  setupApplicationTest(hooks);

  test('can add a todo', async function(assert) {
    await visit('/');
    await fillIn('.new-todo', 'New task');
    await triggerKeyEvent('.new-todo', 'keydown', 'Enter');

    assert.dom('.todo-list li').exists({ count: 1 });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in browser
npx ember test --server

# Run specific test file
npx ember test --filter="todo-storage"
```

## Building for Production

### Build Command

```bash
npm run build
```

This creates optimized files in `dist/`:
- Minified JavaScript
- Optimized CSS
- Fingerprinted assets
- Source maps (optional)

### Build Output

```
dist/
├── assets/
│   ├── vendor-[fingerprint].js
│   ├── emberjs-todo-list-[fingerprint].js
│   ├── vendor-[fingerprint].css
│   └── emberjs-todo-list-[fingerprint].css
├── index.html
└── robots.txt
```

### Deployment

#### Static Hosting (Netlify, Vercel)

```bash
# Build
npm run build

# Deploy dist/ folder
# Configure for SPA (single-page app) routing
```

**Netlify `_redirects`:**
```
/*    /index.html   200
```

#### Server Deployment

```bash
# Build
npm run build

# Serve dist/ with any static server
npx serve dist/
```

### Environment Configuration

```javascript
// config/environment.js
if (environment === 'production') {
  ENV.APP.apiHost = 'https://api.production.com';
  ENV.locationType = 'history';
}
```

## Best Practices

### 1. Component Design

- Keep components small and focused
- Use `@tracked` for mutable state
- Prefer getters over manual computation
- Document expected arguments

### 2. Services

- Use for shared state only
- Keep services focused
- Initialize in constructor if needed
- Clean up in `willDestroy`

### 3. Templates

- Keep logic minimal
- Use helpers for complex operations
- Prefer semantic HTML
- Use `{{on}}` modifier for events

### 4. State Management

- Local state in components
- Shared state in services
- Route data in models
- Avoid duplication

### 5. Performance

- Use `@cached` for expensive getters
- Avoid creating objects in templates
- Use `{{#each}}` key parameter
- Lazy load routes/components

## Performance Optimization

### 1. Tracked Properties

```javascript
import { cached } from '@glimmer/tracking';

export default class MyComponent extends Component {
  @cached
  get expensiveComputation() {
    // Only recomputes when dependencies change
    return this.args.data.map(...).filter(...).reduce(...);
  }
}
```

### 2. Component Lifecycle

```javascript
export default class MyComponent extends Component {
  constructor() {
    super(...arguments);
    // Setup once
  }

  willDestroy() {
    super.willDestroy(...arguments);
    // Cleanup subscriptions, timers, etc.
  }
}
```

### 3. Lazy Loading

```javascript
// Use dynamic imports
const MyComponent = () => import('./components/my-component');
```

### 4. Asset Optimization

```javascript
// ember-cli-build.js
module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    fingerprint: {
      enabled: true,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map']
    },
    minifyCSS: { enabled: true },
    minifyJS: { enabled: true }
  });

  return app.toTree();
};
```

## Common Patterns

### 1. Loading States

```javascript
// app/routes/todos.js
export default class TodosRoute extends Route {
  model() {
    return this.store.findAll('todo'); // Returns promise
  }
}
```

```handlebars
{{! app/templates/todos-loading.hbs }}
<div class="loading">Loading todos...</div>
```

### 2. Error Handling

```javascript
// app/routes/todos.js
export default class TodosRoute extends Route {
  model() {
    return this.store.findAll('todo').catch(error => {
      console.error('Failed to load todos:', error);
      return [];
    });
  }
}
```

```handlebars
{{! app/templates/todos-error.hbs }}
<div class="error">Failed to load todos. Please try again.</div>
```

### 3. Form Handling

```javascript
export default class MyFormComponent extends Component {
  @tracked formData = {
    name: '',
    email: ''
  };

  @action
  updateField(field, event) {
    this.formData[field] = event.target.value;
  }

  @action
  async submit(event) {
    event.preventDefault();
    await this.args.onSubmit(this.formData);
    this.formData = { name: '', email: '' };
  }
}
```

## Troubleshooting

### Common Issues

#### 1. "this.args.something is undefined"

**Problem**: Trying to access argument that wasn't passed

**Solution**:
```javascript
// Check existence
get message() {
  return this.args.text ?? 'Default text';
}
```

#### 2. "Assertion Failed: You modified tracked property..."

**Problem**: Mutating tracked property directly

**Solution**:
```javascript
// Wrong
this.todos.push(newTodo);

// Right
this.todos = [...this.todos, newTodo];
```

#### 3. Component not updating

**Problem**: Property not tracked

**Solution**:
```javascript
// Add @tracked
@tracked myProperty = '';
```

#### 4. Template not found

**Problem**: Template file location or naming

**Solution**: Ensure template matches component name and location

### Debug Tools

```javascript
// Ember Inspector (browser extension)
// Chrome: https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi
// Firefox: https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/

// Debug in templates
{{debugger}}
{{log this.someProperty}}
```

## Resources

### Official Documentation

- **Ember.js Guides**: https://guides.emberjs.com/
- **API Documentation**: https://api.emberjs.com/
- **Ember CLI**: https://cli.emberjs.com/
- **Ember Blog**: https://blog.emberjs.com/

### Learning Resources

- **Ember.js Tutorial**: https://guides.emberjs.com/release/tutorial/
- **Ember Map**: https://embermap.com/ (Premium video courses)
- **Ember School**: https://www.emberschool.com/
- **Rock & Roll with Ember**: https://balinterdi.com/rock-and-roll-with-emberjs/

### Community

- **Ember.js Discord**: https://discord.gg/emberjs
- **Ember Forum**: https://discuss.emberjs.com/
- **Ember Times Newsletter**: https://blog.emberjs.com/tags/newsletter.html
- **Reddit**: https://www.reddit.com/r/emberjs/

### Tools

- **Ember Inspector**: Browser extension for debugging
- **Ember CLI**: Command-line interface
- **Ember Observer**: Addon directory https://emberobserver.com/
- **Ember Twiddle**: Online playground https://ember-twiddle.com/

### Podcasts

- **Ember Weekend**: https://emberweekend.com/
- **The EmberMap Podcast**: https://embermap.com/podcast

### Books

- **Rock and Roll with Ember.js**: By Balint Erdi
- **Ember.js in Action**: By Joachim Haagen Skeie

### Awesome Lists

- **Awesome Ember**: https://github.com/ember-community-russia/awesome-ember

## License

MIT License - feel free to use this code for learning and production applications.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Acknowledgments

- Ember.js core team and contributors
- TodoMVC project for the CSS styles
- Ember community for excellent documentation and support

---

**Happy Ember coding!** 🐹

*Built with ❤️ using Ember.js 5.x*
