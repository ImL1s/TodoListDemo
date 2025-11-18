# htmx Todo List - Hypermedia-Driven Application

![htmx Version](https://img.shields.io/badge/htmx-1.9%2B-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D%2016.0.0-green)
![Express](https://img.shields.io/badge/express-4.18%2B-lightgrey)
![License](https://img.shields.io/badge/license-MIT-blue)

A modern, hypermedia-driven Todo List application built with **htmx** and **Express.js**. This project demonstrates the power of returning HTML over-the-wire instead of JSON, embracing HATEOAS principles, and building dynamic web applications with **zero frontend JavaScript frameworks**.

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [What is htmx?](#what-is-htmx)
3. [Why htmx? The Philosophy](#why-htmx-the-philosophy)
4. [Hypermedia vs JSON APIs](#hypermedia-vs-json-apis)
5. [HATEOAS Principles](#hateoas-principles)
6. [Features](#features)
7. [Project Structure](#project-structure)
8. [Installation](#installation)
9. [Running the Application](#running-the-application)
10. [How It Works](#how-it-works)
11. [Backend API Design](#backend-api-design)
12. [htmx Attributes Deep Dive](#htmx-attributes-deep-dive)
13. [Code Examples](#code-examples)
14. [htmx vs Traditional SPAs](#htmx-vs-traditional-spas)
15. [Why htmx is Gaining Popularity](#why-htmx-is-gaining-popularity)
16. [Progressive Enhancement](#progressive-enhancement)
17. [Performance Considerations](#performance-considerations)
18. [Best Practices](#best-practices)
19. [Common Patterns](#common-patterns)
20. [Troubleshooting](#troubleshooting)
21. [Advanced Features](#advanced-features)
22. [Security Considerations](#security-considerations)
23. [Testing](#testing)
24. [Deployment](#deployment)
25. [Resources](#resources)

---

## 🎯 Introduction

This project is a fully functional Todo List application that demonstrates the **hypermedia-driven architecture** using htmx. Unlike traditional Single Page Applications (SPAs) that rely on JavaScript frameworks like React, Vue, or Angular to manage state and render UI, this application uses **server-rendered HTML fragments** that are swapped into the page via AJAX.

### Key Highlights

- ✅ **Zero Frontend Framework**: No React, Vue, or Angular needed
- ✅ **Zero Build Step**: No webpack, Vite, or bundlers required
- ✅ **Zero Client-Side State Management**: Server owns the state
- ✅ **Zero Inline Scripts**: Pure HATEOAS - no `<script>` tags in responses
- ✅ **Minimal JavaScript**: Only htmx library (~14KB gzipped)
- ✅ **Progressive Enhancement**: Works without JavaScript
- ✅ **HATEOAS Compliant**: Hypermedia As The Engine Of Application State
- ✅ **Simple Architecture**: HTML from the server, straight to the browser
- ✅ **Server-Driven Events**: Uses HX-Trigger headers instead of client-side listeners
- ✅ **Pure Hypermedia**: All state transitions driven by server responses

---

## 🤔 What is htmx?

**htmx** is a library that allows you to access modern browser features directly from HTML, rather than using JavaScript. It extends HTML with attributes that enable:

- AJAX requests from any element (not just `<a>` and `<form>`)
- CSS transitions and animations
- WebSockets and Server-Sent Events
- And much more

### Core Concept

Instead of this traditional SPA approach:

```javascript
// Frontend: Fetch JSON
const response = await fetch('/api/todos');
const todos = await response.json();

// Frontend: Render with JavaScript
todos.forEach(todo => {
  const element = document.createElement('li');
  element.textContent = todo.text;
  todoList.appendChild(element);
});
```

htmx enables this:

```html
<!-- Backend returns HTML, htmx swaps it in -->
<div hx-get="/todos" hx-trigger="load">
  Loading...
</div>
```

The server returns:

```html
<ul>
  <li>Learn htmx</li>
  <li>Build amazing apps</li>
</ul>
```

---

## 💡 Why htmx? The Philosophy

### The Problem with Modern Web Development

Modern web development has become increasingly complex:

1. **Heavy JavaScript Frameworks**: React, Angular, Vue require significant learning curves
2. **Build Toolchains**: Webpack, Babel, TypeScript, bundlers, transpilers
3. **State Management**: Redux, MobX, Vuex, Pinia, Zustand
4. **Client-Server Duplication**: Business logic duplicated on both sides
5. **Large Bundle Sizes**: Megabytes of JavaScript sent to browsers
6. **Complexity Overhead**: Simple CRUD apps require extensive setup

### The htmx Solution

htmx returns to web fundamentals:

1. **HTML is the Interface**: Server sends HTML, not JSON
2. **Declarative Syntax**: Use HTML attributes instead of JavaScript
3. **Server-Side Rendering**: Leverage existing server frameworks
4. **Progressive Enhancement**: Starts with HTML, adds AJAX seamlessly
5. **Simplicity**: Less code, less complexity, faster development

### The Hypermedia Philosophy

> "Hypermedia is the engine of application state" - Roy Fielding (REST creator)

htmx embraces this by:

- **Server controls UI**: Server decides what HTML to render
- **Stateless clients**: Client just displays what server sends
- **Hyperlinks drive actions**: Every action is a hyperlink or form
- **Natural REST**: Uses HTTP methods as intended (GET, POST, PUT, DELETE)

---

## 🆚 Hypermedia vs JSON APIs

### Traditional JSON API Approach

```
┌─────────┐                    ┌─────────┐
│         │   GET /api/todos   │         │
│ Client  │ ──────────────────>│ Server  │
│  (SPA)  │                    │  (API)  │
│         │<──────────────────│         │
└─────────┘  JSON Response     └─────────┘
    │
    │ [Client-Side Rendering]
    ├─> Parse JSON
    ├─> Update Virtual DOM
    ├─> Reconcile Differences
    └─> Update Real DOM
```

**Characteristics:**
- Server returns data (JSON)
- Client has templating logic
- Client manages state
- Requires JavaScript framework
- Complex client-side code

### htmx Hypermedia Approach

```
┌─────────┐                    ┌─────────┐
│         │   GET /todos       │         │
│ Client  │ ──────────────────>│ Server  │
│ (htmx)  │                    │         │
│         │<──────────────────│         │
└─────────┘  HTML Response     └─────────┘
    │
    │ [htmx Swaps HTML]
    └─> Replace target element
```

**Characteristics:**
- Server returns UI (HTML)
- Server has templating logic
- Server manages state
- Minimal client-side code
- Simple, declarative approach

### Comparison Table

| Aspect | JSON API + SPA | htmx Hypermedia |
|--------|----------------|-----------------|
| **Response Format** | JSON data | HTML fragments |
| **Templating** | Client-side (JSX, templates) | Server-side (EJS, Handlebars, etc.) |
| **State Management** | Client (Redux, Context, etc.) | Server (database, session) |
| **Bundle Size** | Large (100KB - 1MB+) | Tiny (14KB for htmx) |
| **Build Step** | Required (webpack, Vite) | Not required |
| **Learning Curve** | Steep | Gentle |
| **SEO** | Complex (SSR needed) | Natural (HTML from server) |
| **First Paint** | Slow (download + parse + render) | Fast (HTML arrives ready) |
| **JavaScript Required** | Yes, app won't work without it | No, progressive enhancement |
| **Code Duplication** | Often (validation, models) | Minimal |
| **Developer Experience** | Complex setup, hot reload | Simple, refresh to test |

---

## 🏛️ HATEOAS Principles

**HATEOAS** (Hypermedia As The Engine Of Application State) is a constraint of REST architecture. It means:

> The client interacts with the application entirely through hypermedia provided dynamically by the server.

### What Does This Mean?

Instead of the client knowing all possible API endpoints, the server tells the client what actions are available through hyperlinks and forms.

### Traditional API (Violates HATEOAS)

```json
{
  "id": 123,
  "text": "Learn htmx",
  "completed": false
}
```

Client must know:
- POST /api/todos/123/toggle to toggle
- DELETE /api/todos/123 to delete
- These URLs are hardcoded in frontend

### HATEOAS-Compliant (htmx Approach)

```html
<li id="todo-123">
  <input type="checkbox"
    hx-post="/todos/123/toggle"
    hx-target="#todo-123">
  <span>Learn htmx</span>
  <button hx-delete="/todos/123" hx-target="#todo-123">
    Delete
  </button>
</li>
```

Server provides:
- The data (text)
- The state (checkbox)
- The actions (hx-post, hx-delete)
- The URLs (/todos/123/toggle)

**Benefits:**
- ✅ Client doesn't need to know API structure
- ✅ Server can change URLs without breaking clients
- ✅ Available actions are clear from the HTML
- ✅ Forms and links are self-describing

---

## ✨ Features

This Todo List application includes:

### Core Functionality
- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete individual todos
- ✅ Filter todos (All, Active, Completed)
- ✅ Clear all completed todos
- ✅ Real-time statistics (total, active, completed)

### htmx Features Demonstrated
- ✅ `hx-get`: Load todos on page load
- ✅ `hx-post`: Create new todos, toggle completion
- ✅ `hx-delete`: Remove todos
- ✅ `hx-target`: Specify where to insert responses
- ✅ `hx-swap`: Control how content is swapped
- ✅ `hx-trigger`: Customize when requests fire (including custom events)
- ✅ `hx-confirm`: Add confirmation dialogs
- ✅ `hx-swap-oob`: Out-of-band swaps for multiple UI updates
- ✅ `HX-Trigger` response header: Server-driven client events
- ✅ Pure HATEOAS: No inline scripts or client-side logic

### Technical Features
- ✅ Express.js backend
- ✅ RESTful API design
- ✅ In-memory data storage
- ✅ HTML fragment responses
- ✅ Progressive enhancement
- ✅ Responsive design
- ✅ Modern CSS styling
- ✅ No build step required
- ✅ **Pure htmx implementation** (see below)

### 🎖️ Pure htmx Implementation

This implementation follows **strict HATEOAS principles** with **zero inline scripts**:

#### HX-Trigger Response Headers
Instead of using client-side JavaScript event listeners, this app uses **server-driven events** via the `HX-Trigger` response header:

```javascript
// Server triggers client-side events via HTTP headers
res.setHeader('HX-Trigger', 'todoUpdate');
res.send(generateTodoHTML(newTodo));
```

This triggers the stats component to refresh automatically:
```html
<div hx-get="/todos/stats" hx-trigger="load, todoUpdate from:body">
```

**Benefits:**
- ✅ Server controls when events fire
- ✅ No client-side event listeners needed
- ✅ Consistent with hypermedia philosophy
- ✅ Easier to reason about and debug

#### Out-of-Band Swaps
Filter tab highlighting is handled **entirely server-side** using `hx-swap-oob`:

```javascript
// Server returns BOTH filtered todos AND updated tabs
function generateFilterTabsHTML(activeFilter) {
  return `
    <div id="filter-tabs" class="filter-tabs" hx-swap-oob="true">
      <button class="filter-tab ${activeFilter === 'all' ? 'active' : ''}">
        All
      </button>
      <!-- ... -->
    </div>
  `;
}
```

**Benefits:**
- ✅ Server owns UI state completely
- ✅ No client-side DOM manipulation
- ✅ Single source of truth on server
- ✅ Testable server-side logic

#### No Inline Scripts
Unlike many htmx examples that include `<script>` tags in responses, this implementation is **100% script-free**:

- ❌ No inline `<script>` tags in HTML responses
- ❌ No `onclick` handlers
- ❌ No client-side event listeners (except htmx itself)
- ✅ Pure declarative HTML with htmx attributes
- ✅ All logic on the server
- ✅ True HATEOAS compliance

---

## 📁 Project Structure

```
03-modern-frameworks/12-htmx/
├── package.json              # Dependencies (Express, body-parser, uuid)
├── server.js                 # Express server with API endpoints
├── public/
│   ├── index.html           # Main HTML file with htmx
│   └── css/
│       └── style.css        # Styling
└── views/
    └── partials/
        └── todo-item.html   # Reusable todo item template
```

### File Purposes

#### `package.json`
- Defines project dependencies
- Contains npm scripts for running the server
- Minimal dependencies: just Express and htmx (via CDN)

#### `server.js`
- Express.js server
- RESTful API endpoints
- Returns HTML fragments (not JSON)
- In-memory todo storage
- HTML generation functions

#### `public/index.html`
- Main application interface
- htmx attributes on elements
- Educational sections explaining htmx
- Progressive enhancement with form fallbacks

#### `public/css/style.css`
- Modern, responsive styling
- CSS variables for theming
- htmx request indicators
- Animations and transitions

#### `views/partials/todo-item.html`
- Template for todo items
- Shows server-side rendering pattern
- Documents htmx attribute usage

---

## 🚀 Installation

### Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** 7.0.0 or higher

### Steps

1. **Navigate to the project directory:**

```bash
cd 03-modern-frameworks/12-htmx
```

2. **Install dependencies:**

```bash
npm install
```

This installs:
- `express`: Web server framework
- `body-parser`: Parse request bodies
- `uuid`: Generate unique IDs

3. **Verify installation:**

```bash
npm list
```

You should see:
```
htmx-todo-list@1.0.0
├── express@4.18.2
├── body-parser@1.20.2
└── uuid@9.0.0
```

---

## 🎮 Running the Application

### Development Mode

Start the server:

```bash
npm start
```

You should see:

```
🚀 htmx Todo List server is running!
📍 URL: http://localhost:3000

✨ Features:
   - Hypermedia-driven architecture
   - Zero frontend JavaScript
   - HATEOAS principles
   - Progressive enhancement
```

### With Auto-Restart (Optional)

If you want the server to restart on file changes:

```bash
npm run dev
```

This uses `nodemon` for automatic restarts during development.

### Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the Todo List application with:
- A beautiful gradient header
- An input field to add todos
- Filter tabs (All, Active, Completed)
- A list of sample todos
- Statistics showing counts
- Educational sections explaining htmx

---

## ⚙️ How It Works

### The Request-Response Flow

Let's trace what happens when you add a new todo:

#### 1. User Types and Clicks "Add Todo"

```html
<form hx-post="/todos" hx-target="#todo-list" hx-swap="afterbegin">
  <input type="text" name="text" value="Learn htmx">
  <button type="submit">Add Todo</button>
</form>
```

#### 2. htmx Intercepts Form Submission

- Prevents default form behavior
- Reads htmx attributes:
  - `hx-post="/todos"` → POST to this URL
  - `hx-target="#todo-list"` → Update this element
  - `hx-swap="afterbegin"` → Insert at beginning
- Serializes form data: `text=Learn+htmx`
- Sends AJAX POST request

#### 3. Server Receives Request

```javascript
app.post('/todos', (req, res) => {
  const text = req.body.text;
  const newTodo = {
    id: uuidv4(),
    text: text,
    completed: false
  };
  todos.unshift(newTodo);

  // Generate HTML
  res.send(generateTodoHTML(newTodo));
});
```

#### 4. Server Generates HTML

```javascript
function generateTodoHTML(todo) {
  return `
    <li class="todo-item" id="todo-${todo.id}">
      <input type="checkbox"
        hx-post="/todos/${todo.id}/toggle"
        hx-target="#todo-${todo.id}">
      <span>${todo.text}</span>
      <button hx-delete="/todos/${todo.id}">Delete</button>
    </li>
  `;
}
```

Returns:

```html
<li class="todo-item" id="todo-abc123">
  <input type="checkbox"
    hx-post="/todos/abc123/toggle"
    hx-target="#todo-abc123">
  <span>Learn htmx</span>
  <button hx-delete="/todos/abc123">Delete</button>
</li>
```

#### 5. htmx Swaps HTML into DOM

- Receives HTML response
- Finds target element: `#todo-list`
- Inserts HTML at beginning (afterbegin)
- Initializes htmx on new elements
- Triggers animations

#### 6. Result

- New todo appears at top of list
- Has working checkbox and delete button
- All htmx attributes are active
- Form input is cleared
- No page reload required

### Complete Flow Diagram

```
User Action
    │
    ▼
┌─────────────────────┐
│ Click "Add Todo"    │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ htmx Intercepts     │
│ - Reads attributes  │
│ - Prevents default  │
│ - Sends AJAX        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Server Endpoint     │
│ POST /todos         │
│ - Create todo       │
│ - Generate HTML     │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Return HTML         │
│ <li>...</li>        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ htmx Swaps          │
│ - Find target       │
│ - Insert HTML       │
│ - Animate           │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Updated UI          │
│ New todo visible    │
└─────────────────────┘
```

---

## 🔌 Backend API Design

Our Express.js backend provides RESTful endpoints that return **HTML fragments** instead of JSON.

### API Endpoints

#### 1. Get All Todos

**Request:**
```http
GET /todos?filter=all
```

**Response:**
```html
<li class="todo-item" id="todo-1">...</li>
<li class="todo-item" id="todo-2">...</li>
<li class="todo-item" id="todo-3">...</li>
```

**Query Parameters:**
- `filter`: `all`, `active`, or `completed`

**Used by:**
```html
<ul hx-get="/todos" hx-trigger="load">
```

---

#### 2. Create Todo

**Request:**
```http
POST /todos
Content-Type: application/x-www-form-urlencoded

text=Learn+htmx
```

**Response:**
```html
<li class="todo-item" id="todo-abc123">
  <input type="checkbox" hx-post="/todos/abc123/toggle">
  <span>Learn htmx</span>
  <button hx-delete="/todos/abc123">Delete</button>
</li>
```

**Used by:**
```html
<form hx-post="/todos" hx-target="#todo-list" hx-swap="afterbegin">
```

---

#### 3. Toggle Todo

**Request:**
```http
POST /todos/abc123/toggle
```

**Response:**
```html
<li class="todo-item completed" id="todo-abc123">
  <input type="checkbox" checked hx-post="/todos/abc123/toggle">
  <span>Learn htmx</span>
  <button hx-delete="/todos/abc123">Delete</button>
</li>
```

**Used by:**
```html
<input type="checkbox" hx-post="/todos/abc123/toggle" hx-target="#todo-abc123">
```

---

#### 4. Delete Todo

**Request:**
```http
DELETE /todos/abc123
```

**Response:**
```html
<!-- Empty response - htmx removes element -->
```

**Used by:**
```html
<button hx-delete="/todos/abc123" hx-target="#todo-abc123">
```

---

#### 5. Clear Completed

**Request:**
```http
POST /todos/clear-completed
```

**Response:**
```html
<li class="todo-item" id="todo-1">...</li>
<li class="todo-item" id="todo-2">...</li>
<!-- Only active todos returned -->
```

**Used by:**
```html
<button hx-post="/todos/clear-completed" hx-target="#todo-list">
```

---

#### 6. Get Statistics

**Request:**
```http
GET /todos/stats
```

**Response:**
```html
<div class="stats">
  <span>Total: <strong>5</strong></span>
  <span>Active: <strong>3</strong></span>
  <span>Completed: <strong>2</strong></span>
</div>
```

**Used by:**
```html
<div hx-get="/todos/stats" hx-trigger="load, todoUpdate from:body">
```

### Design Principles

#### 1. HTML Responses

Every endpoint returns HTML, not JSON:

```javascript
// ❌ Traditional JSON API
res.json({ id: 1, text: 'Learn htmx', completed: false });

// ✅ htmx Approach
res.send('<li class="todo-item">Learn htmx</li>');
```

#### 2. RESTful URLs

Use proper HTTP methods:

- `GET /todos` - Retrieve todos
- `POST /todos` - Create todo
- `POST /todos/:id/toggle` - Update todo
- `DELETE /todos/:id` - Delete todo

#### 3. Self-Contained Responses

Each HTML fragment includes all necessary attributes:

```html
<li id="todo-123">
  <!-- Knows how to toggle itself -->
  <input hx-post="/todos/123/toggle" hx-target="#todo-123">

  <!-- Knows how to delete itself -->
  <button hx-delete="/todos/123" hx-target="#todo-123">
</li>
```

#### 4. Server-Side State

State lives on the server:

```javascript
// In-memory storage (could be database)
let todos = [
  { id: 1, text: 'Learn htmx', completed: false }
];
```

Client never manages state, just displays what server sends.

---

## 📚 htmx Attributes Deep Dive

### Core Attributes

#### `hx-get`, `hx-post`, `hx-put`, `hx-delete`

Makes AJAX requests with specified HTTP method.

```html
<!-- GET request -->
<button hx-get="/todos">Load Todos</button>

<!-- POST request -->
<form hx-post="/todos">
  <input name="text">
  <button>Add</button>
</form>

<!-- DELETE request -->
<button hx-delete="/todos/123">Delete</button>

<!-- PUT request -->
<button hx-put="/todos/123">Update</button>
```

**Behavior:**
- Triggers on natural event (click for buttons, submit for forms)
- Sends request to specified URL
- Can be customized with other attributes

---

#### `hx-target`

Specifies which element to update with the response.

```html
<!-- Update specific element -->
<button hx-get="/todos" hx-target="#todo-list">
  Load
</button>

<!-- Update parent -->
<button hx-delete="/todos/123" hx-target="closest .todo-item">
  Delete
</button>

<!-- Update self (default) -->
<div hx-get="/todos">
  <!-- Will replace this div -->
</div>
```

**Target Selectors:**
- `#id` - Element with ID
- `.class` - Element with class
- `this` - The element itself (default)
- `closest .class` - Nearest ancestor
- `next .class` - Next sibling
- `previous .class` - Previous sibling

---

#### `hx-swap`

Controls how response content is swapped into the target.

```html
<!-- Replace inner HTML (default) -->
<div hx-get="/todos" hx-swap="innerHTML">

<!-- Replace entire element -->
<li hx-get="/todos/123" hx-swap="outerHTML">

<!-- Insert at beginning -->
<ul hx-post="/todos" hx-swap="afterbegin">

<!-- Insert at end -->
<ul hx-get="/todos" hx-swap="beforeend">

<!-- Insert before element -->
<div hx-get="/ad" hx-swap="beforebegin">

<!-- Insert after element -->
<div hx-get="/ad" hx-swap="afterend">

<!-- Don't swap, just trigger -->
<button hx-post="/log" hx-swap="none">
```

**Swap Strategies:**
- `innerHTML` - Replace contents (default)
- `outerHTML` - Replace entire element
- `beforebegin` - Before target
- `afterbegin` - First child
- `beforeend` - Last child
- `afterend` - After target
- `none` - Don't swap
- `delete` - Remove target

**With Modifiers:**
```html
<!-- Swap with 1 second transition -->
<div hx-swap="innerHTML swap:1s">

<!-- Settle over 500ms -->
<div hx-swap="innerHTML settle:500ms">

<!-- Scroll to bottom -->
<div hx-swap="beforeend scroll:bottom">
```

---

#### `hx-trigger`

Specifies what event triggers the request.

```html
<!-- On click (default for buttons) -->
<button hx-get="/todos" hx-trigger="click">

<!-- On form submit (default for forms) -->
<form hx-post="/todos" hx-trigger="submit">

<!-- On page load -->
<div hx-get="/todos" hx-trigger="load">

<!-- On mouseover -->
<div hx-get="/preview" hx-trigger="mouseenter">

<!-- Every 5 seconds -->
<div hx-get="/updates" hx-trigger="every 5s">

<!-- On custom event -->
<div hx-get="/stats" hx-trigger="todoUpdate from:body">

<!-- Multiple triggers -->
<div hx-get="/data" hx-trigger="load, click">

<!-- Debounce input -->
<input hx-get="/search" hx-trigger="keyup changed delay:500ms">

<!-- Throttle -->
<div hx-get="/track" hx-trigger="scroll throttle:1s">
```

**Common Events:**
- `click` - Mouse click
- `submit` - Form submission
- `change` - Input value change
- `keyup` - Key released
- `load` - Element loaded
- `mouseenter` - Mouse enters
- `mouseleave` - Mouse leaves
- `every Xs` - Polling interval

**Modifiers:**
- `changed` - Only if value changed
- `delay:Xms` - Debounce
- `throttle:Xms` - Throttle
- `from:selector` - Listen on different element
- `once` - Only trigger once

---

#### `hx-confirm`

Shows confirmation dialog before request.

```html
<button
  hx-delete="/todos/123"
  hx-confirm="Are you sure you want to delete this todo?">
  Delete
</button>
```

Browser shows native confirm dialog. Request only fires if user clicks "OK".

---

#### `hx-include`

Includes additional input values in request.

```html
<button
  hx-post="/filter"
  hx-include="[name='category']">
  Filter
</button>

<input type="text" name="category" value="work">
```

Request will include `category=work` parameter.

---

#### `hx-vals`

Adds extra values to request (JSON format).

```html
<button
  hx-post="/todos"
  hx-vals='{"priority": "high", "category": "work"}'>
  Add High Priority
</button>
```

---

#### `hx-headers`

Adds custom HTTP headers.

```html
<div
  hx-get="/api/data"
  hx-headers='{"X-API-Key": "secret123"}'>
</div>
```

---

#### `hx-push-url`

Updates browser URL without page reload.

```html
<button hx-get="/todos/active" hx-push-url="true">
  Active Todos
</button>
```

URL changes to `/todos/active`, browser history updated.

---

#### `hx-select`

Selects part of response to use.

```html
<button hx-get="/page" hx-select="#content">
  Load Content
</button>
```

Only the `#content` element from response is used.

---

## 💻 Code Examples

### Example 1: Basic Todo List Loading

**HTML:**
```html
<ul
  id="todo-list"
  hx-get="/todos"
  hx-trigger="load"
  hx-swap="innerHTML">
  <li class="loading">Loading todos...</li>
</ul>
```

**Server (Express.js):**
```javascript
app.get('/todos', (req, res) => {
  const html = todos.map(todo => `
    <li class="todo-item">
      ${todo.text}
    </li>
  `).join('');

  res.send(html);
});
```

**What happens:**
1. Page loads
2. htmx sees `hx-trigger="load"`
3. Makes GET request to `/todos`
4. Server returns HTML list items
5. htmx replaces innerHTML of `#todo-list`
6. Loading message disappears, todos appear

---

### Example 2: Adding a Todo

**HTML:**
```html
<form
  hx-post="/todos"
  hx-target="#todo-list"
  hx-swap="afterbegin"
  hx-on::after-request="if(event.detail.successful) this.reset()">

  <input type="text" name="text" required>
  <button type="submit">Add Todo</button>
</form>

<ul id="todo-list"></ul>
```

**Server:**
```javascript
app.post('/todos', (req, res) => {
  const newTodo = {
    id: uuidv4(),
    text: req.body.text,
    completed: false
  };

  todos.unshift(newTodo);

  res.send(`
    <li class="todo-item" id="todo-${newTodo.id}">
      <span>${newTodo.text}</span>
    </li>
  `);
});
```

**What happens:**
1. User types and submits form
2. htmx intercepts submit
3. POST request to `/todos` with form data
4. Server creates todo, generates HTML
5. htmx inserts HTML at beginning of list
6. Form resets automatically

---

### Example 3: Toggling Todo Completion

**HTML:**
```html
<li class="todo-item" id="todo-123">
  <input
    type="checkbox"
    hx-post="/todos/123/toggle"
    hx-target="#todo-123"
    hx-swap="outerHTML">
  <span>Learn htmx</span>
</li>
```

**Server:**
```javascript
app.post('/todos/:id/toggle', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  todo.completed = !todo.completed;

  res.send(`
    <li class="todo-item ${todo.completed ? 'completed' : ''}" id="todo-${todo.id}">
      <input
        type="checkbox"
        ${todo.completed ? 'checked' : ''}
        hx-post="/todos/${todo.id}/toggle"
        hx-target="#todo-${todo.id}"
        hx-swap="outerHTML">
      <span>${todo.text}</span>
    </li>
  `);
});
```

**What happens:**
1. User clicks checkbox
2. POST to `/todos/123/toggle`
3. Server toggles completion status
4. Server returns updated HTML (with `completed` class and `checked` attribute)
5. htmx replaces entire `<li>` element
6. CSS styles completed state
7. Checkbox stays interactive

---

### Example 4: Deleting a Todo

**HTML:**
```html
<li class="todo-item" id="todo-123">
  <span>Learn htmx</span>
  <button
    hx-delete="/todos/123"
    hx-target="#todo-123"
    hx-swap="outerHTML swap:1s"
    hx-confirm="Are you sure?">
    Delete
  </button>
</li>
```

**Server:**
```javascript
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id);

  if (index !== -1) {
    todos.splice(index, 1);
  }

  // Return empty response - htmx will remove element
  res.send('');
});
```

**What happens:**
1. User clicks delete button
2. Browser shows "Are you sure?" dialog
3. If confirmed, DELETE to `/todos/123`
4. Server removes todo
5. Server returns empty response
6. htmx swaps outerHTML with empty string
7. Element disappears (with 1s animation)

---

### Example 5: Filtering Todos

**HTML:**
```html
<div class="filter-tabs">
  <button
    hx-get="/todos?filter=all"
    hx-target="#todo-list"
    class="active">
    All
  </button>

  <button
    hx-get="/todos?filter=active"
    hx-target="#todo-list">
    Active
  </button>

  <button
    hx-get="/todos?filter=completed"
    hx-target="#todo-list">
    Completed
  </button>
</div>

<ul id="todo-list"></ul>
```

**Server:**
```javascript
app.get('/todos', (req, res) => {
  const filter = req.query.filter || 'all';

  let filtered = todos;
  if (filter === 'active') {
    filtered = todos.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filtered = todos.filter(t => t.completed);
  }

  const html = filtered.map(todo => generateTodoHTML(todo)).join('');
  res.send(html);
});
```

**What happens:**
1. User clicks "Active" button
2. GET to `/todos?filter=active`
3. Server filters todos
4. Server returns HTML for active todos only
5. htmx replaces list contents
6. Only active todos visible

---

### Example 6: Real-Time Stats (Pure htmx)

**HTML:**
```html
<div
  id="stats"
  hx-get="/todos/stats"
  hx-trigger="load, todoUpdate from:body">
  Loading stats...
</div>
```

**Server (with HX-Trigger header):**
```javascript
// Any endpoint that modifies todos triggers stats update
app.post('/todos', (req, res) => {
  const newTodo = createTodo(req.body.text);
  todos.unshift(newTodo);

  // Server tells client to fire 'todoUpdate' event
  res.setHeader('HX-Trigger', 'todoUpdate');
  res.send(generateTodoHTML(newTodo));
});

app.get('/todos/stats', (req, res) => {
  const total = todos.length;
  const active = todos.filter(t => !t.completed).length;
  const completed = todos.filter(t => t.completed).length;

  res.send(`
    <div class="stats">
      <span>Total: <strong>${total}</strong></span>
      <span>Active: <strong>${active}</strong></span>
      <span>Completed: <strong>${completed}</strong></span>
    </div>
  `);
});
```

**What happens:**
1. Stats load on page load
2. When a todo is created/toggled/deleted, server includes `HX-Trigger: todoUpdate` header
3. htmx fires the `todoUpdate` event on the body
4. Stats div listens for this event (via `hx-trigger="todoUpdate from:body"`)
5. Automatically fetches and displays updated stats
6. **No client-side JavaScript needed!**

**Why this is better:**
- ✅ Server controls when stats update (not client)
- ✅ No inline `<script>` tags
- ✅ No manual event dispatching
- ✅ Pure HATEOAS architecture
- ✅ Server is single source of truth

---

### Example 7: Server-Driven Tab Highlighting (Out-of-Band Swaps)

**HTML:**
```html
<div id="filter-tabs" class="filter-tabs">
  <button
    class="filter-tab active"
    hx-get="/todos?filter=all"
    hx-target="#todo-list">
    All
  </button>
  <button
    class="filter-tab"
    hx-get="/todos?filter=active"
    hx-target="#todo-list">
    Active
  </button>
  <button
    class="filter-tab"
    hx-get="/todos?filter=completed"
    hx-target="#todo-list">
    Completed
  </button>
</div>

<ul id="todo-list"></ul>
```

**Server (with out-of-band swap):**
```javascript
app.get('/todos', (req, res) => {
  const filter = req.query.filter || 'all';
  const filteredTodos = filterTodos(filter);

  // Generate filtered todos HTML
  const todosHtml = filteredTodos.map(generateTodoHTML).join('');

  // Generate updated filter tabs with correct active state
  const filterTabsHtml = `
    <div id="filter-tabs" class="filter-tabs" hx-swap-oob="true">
      <button class="filter-tab ${filter === 'all' ? 'active' : ''}"
              hx-get="/todos?filter=all" hx-target="#todo-list">
        All
      </button>
      <button class="filter-tab ${filter === 'active' ? 'active' : ''}"
              hx-get="/todos?filter=active" hx-target="#todo-list">
        Active
      </button>
      <button class="filter-tab ${filter === 'completed' ? 'active' : ''}"
              hx-get="/todos?filter=completed" hx-target="#todo-list">
        Completed
      </button>
    </div>
  `;

  // Return both: filtered todos go to #todo-list, tabs swap themselves
  res.send(todosHtml + filterTabsHtml);
});
```

**What happens:**
1. User clicks "Active" tab
2. GET request to `/todos?filter=active`
3. Server generates:
   - Filtered todos HTML → targets `#todo-list` (normal swap)
   - Updated tabs HTML with `hx-swap-oob="true"` → swaps itself at `#filter-tabs`
4. htmx performs **two swaps** from one response:
   - Todos list updates with filtered items
   - Filter tabs update with new active state
5. **No onclick handlers or client-side state management!**

**Why this is powerful:**
- ✅ One request updates multiple parts of the page
- ✅ Server controls which tab is active
- ✅ No client-side DOM manipulation
- ✅ No JavaScript functions for UI state
- ✅ Testable server-side rendering
- ✅ True hypermedia-driven UI

---

## 🥊 htmx vs Traditional SPAs

### Complexity Comparison

#### React Todo List (Simplified)

**Package.json:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "vite": "^4.3.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

**Component:**
```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [inputValue, setInputValue] = useState('');

  // Load todos
  useEffect(() => {
    axios.get('/api/todos').then(res => {
      setTodos(res.data);
    });
  }, []);

  // Filter logic
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Add todo
  const handleAdd = async () => {
    const res = await axios.post('/api/todos', {
      text: inputValue
    });
    setTodos([res.data, ...todos]);
    setInputValue('');
  };

  // Toggle todo
  const handleToggle = async (id) => {
    await axios.post(`/api/todos/${id}/toggle`);
    setTodos(todos.map(t =>
      t.id === id ? {...t, completed: !t.completed} : t
    ));
  };

  // Delete todo
  const handleDelete = async (id) => {
    await axios.delete(`/api/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div>
        Total: {todos.length} |
        Active: {todos.filter(t => !t.completed).length} |
        Completed: {todos.filter(t => t.completed).length}
      </div>
    </div>
  );
}
```

**Lines of code:** ~80 lines (just component)
**Build time:** ~2-5 seconds
**Bundle size:** ~150KB (minified)

---

#### htmx Todo List

**Package.json:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "body-parser": "^1.20.2",
    "uuid": "^9.0.0"
  }
}
```

**HTML:**
```html
<!-- Add todo -->
<form hx-post="/todos" hx-target="#todo-list" hx-swap="afterbegin">
  <input type="text" name="text">
  <button>Add</button>
</form>

<!-- Filters -->
<button hx-get="/todos?filter=all" hx-target="#todo-list">All</button>
<button hx-get="/todos?filter=active" hx-target="#todo-list">Active</button>
<button hx-get="/todos?filter=completed" hx-target="#todo-list">Completed</button>

<!-- Todo list -->
<ul id="todo-list" hx-get="/todos" hx-trigger="load"></ul>

<!-- Stats -->
<div hx-get="/todos/stats" hx-trigger="load, todoUpdate from:body"></div>
```

**Server (already shown above)**

**Lines of code:** ~30 lines HTML + ~100 lines server
**Build time:** 0 seconds
**Bundle size:** ~14KB (htmx only)

---

### Feature Comparison

| Feature | React SPA | htmx |
|---------|-----------|------|
| **State Management** | useState, useEffect hooks | Server-side (database/memory) |
| **Data Fetching** | axios/fetch with useEffect | hx-get attribute |
| **UI Updates** | Virtual DOM reconciliation | HTML swap |
| **Event Handling** | onClick, onChange callbacks | hx-trigger attribute |
| **Filtering** | Client-side array filtering | Server query parameters |
| **Form Handling** | Controlled components | Standard HTML forms |
| **Build Process** | Vite/webpack required | None |
| **Bundle Size** | 150KB+ | 14KB |
| **Learning Curve** | High (hooks, state, lifecycle) | Low (HTML attributes) |
| **Code Location** | Frontend | Backend |
| **SEO** | Requires SSR setup | Built-in (HTML from server) |

---

### When to Choose Each

#### Choose React/Vue/Angular When:
- ✅ Building complex, interactive UIs (dashboards, editors)
- ✅ Need rich client-side interactivity
- ✅ Offline-first applications
- ✅ Complex client-side state management
- ✅ Real-time collaboration features
- ✅ Heavy data visualization
- ✅ Team already experienced with framework

#### Choose htmx When:
- ✅ Building CRUD applications
- ✅ Server-rendered apps with dynamic updates
- ✅ Progressive enhancement is priority
- ✅ Want minimal client-side complexity
- ✅ Prefer server-side rendering
- ✅ Small team or solo developer
- ✅ Want fast development speed
- ✅ SEO is critical
- ✅ Users may have slow connections

---

## 🔥 Why htmx is Gaining Popularity

### 1. Simplicity Renaissance

The web development community is experiencing "JavaScript fatigue":

- Complex build toolchains
- Constant framework churn
- Over-engineering simple problems

htmx offers a return to simplicity:

```html
<!-- This just works -->
<button hx-get="/data">Load Data</button>
```

No build step, no npm install, no configuration.

### 2. Server-Side Renaissance

Modern hosting solutions make server-side rendering attractive:

- **Edge Computing**: Cloudflare Workers, Vercel Edge Functions
- **Serverless**: AWS Lambda, Google Cloud Functions
- **Fast Servers**: Deno, Bun, modern Node.js

Server-side templating is fast and simple:

```javascript
// Express.js + EJS
app.get('/todos', (req, res) => {
  res.render('todos', { todos });
});
```

### 3. Performance Benefits

htmx applications are often faster:

**Initial Load:**
- ✅ Smaller bundle (14KB vs 150KB+)
- ✅ No JS parsing/compilation time
- ✅ HTML arrives ready to display

**Subsequent Updates:**
- ✅ No Virtual DOM overhead
- ✅ Direct DOM manipulation
- ✅ Server does the work (cacheable)

**Real-World Results:**
- 90% smaller JavaScript bundle
- 50% faster Time to Interactive
- Better performance on low-end devices

### 4. Developer Experience

**Before htmx:**
```bash
npm create vite@latest
npm install
npm install react-router-dom
npm install @reduxjs/toolkit
npm install axios
# ... 15 more dependencies

# Start development
npm run dev

# Make changes, wait for hot reload
# Write components, manage state, handle effects
# Build for production
npm run build
```

**With htmx:**
```bash
npm install express htmx

# Write HTML with attributes
# Refresh browser to see changes
# Deploy - no build step
```

### 5. Locality of Behavior

htmx embraces "locality of behavior" - related code lives together:

```html
<!-- Everything about this todo is right here -->
<li id="todo-123">
  <input
    type="checkbox"
    hx-post="/todos/123/toggle"    <!-- What happens -->
    hx-target="#todo-123"           <!-- Where it updates -->
    hx-swap="outerHTML">            <!-- How it updates -->

  <button
    hx-delete="/todos/123"
    hx-confirm="Are you sure?">
    Delete
  </button>
</li>
```

Compare to React where logic is scattered:
- State in useState
- Effects in useEffect
- Handlers in separate functions
- Rendering in JSX

### 6. Progressive Enhancement

htmx works without JavaScript:

```html
<!-- Without htmx: standard form submission -->
<form action="/todos" method="POST">
  <input name="text">
  <button>Add</button>
</form>

<!-- With htmx: AJAX submission -->
<form hx-post="/todos" action="/todos" method="POST">
  <input name="text">
  <button>Add</button>
</form>
```

If JavaScript fails to load:
- htmx: Degrades to standard form
- React: Blank page or error

### 7. Real-World Adoption

Companies using htmx:

- **GitHub**: Parts of their UI
- **Basecamp**: Hey email service
- **JetBrains**: Some internal tools
- Growing list of startups and agencies

### 8. Perfect for Small Teams

htmx reduces complexity:

- **No frontend specialists needed**: Backend devs can handle everything
- **Faster onboarding**: HTML attributes vs framework concepts
- **Less context switching**: Stay in one language/paradigm
- **Fewer dependencies**: Less maintenance burden

### 9. The "Rails" of JavaScript

htmx + server framework feels like Ruby on Rails:

- Convention over configuration
- Server-side rendering
- Rapid development
- Minimal boilerplate

**Example Stack:**
- Django + htmx
- Laravel + htmx
- Rails + htmx
- Express + htmx

All leverage existing templating systems.

### 10. Future-Proof

htmx builds on web standards:

- HTML (30 years old, still going)
- HTTP (proven protocol)
- REST architecture
- Server-side rendering (decades of experience)

Compare to JavaScript frameworks:
- Angular.js → Angular 2+ (complete rewrite)
- React class components → hooks (paradigm shift)
- Vue 2 → Vue 3 (breaking changes)

htmx: Built on fundamentals that won't change.

---

## 🎨 Progressive Enhancement

Progressive enhancement means building a baseline experience that works for everyone, then enhancing it for modern browsers.

### The Layers

```
┌─────────────────────────────────┐
│   JavaScript Enhancement        │  ← htmx (AJAX, no reload)
├─────────────────────────────────┤
│   CSS Styling                   │  ← Visual design
├─────────────────────────────────┤
│   HTML Content                  │  ← Works without JS/CSS
└─────────────────────────────────┘
```

### Example: Add Todo Form

#### Layer 1: HTML Only

```html
<form action="/todos" method="POST">
  <input type="text" name="text" required>
  <button type="submit">Add Todo</button>
</form>
```

**Works when:**
- JavaScript is disabled
- JavaScript fails to load
- User is on slow connection
- Browser doesn't support htmx

**Behavior:**
- Submit triggers full page reload
- Server processes POST
- Returns full page
- Browser navigates to result

#### Layer 2: Add htmx

```html
<form action="/todos" method="POST"
      hx-post="/todos"
      hx-target="#todo-list"
      hx-swap="afterbegin">
  <input type="text" name="text" required>
  <button type="submit">Add Todo</button>
</form>
```

**Enhanced behavior:**
- htmx intercepts submit
- AJAX request (no reload)
- HTML fragment returned
- Swapped into page

**Fallback:**
- If htmx fails, `action` and `method` still work
- Graceful degradation to Layer 1

### Testing Progressive Enhancement

#### 1. Test Without JavaScript

Chrome DevTools → Network → Disable JavaScript

All forms should still work (with page reloads).

#### 2. Test Without CSS

Remove stylesheet link.

Content should still be readable and functional.

#### 3. Test on Slow Connection

Chrome DevTools → Network → Slow 3G

Page should load incrementally, remain usable.

---

## ⚡ Performance Considerations

### Bundle Size

**Traditional SPA:**
```
React:              130KB
React DOM:           40KB
React Router:        20KB
State Management:    30KB
Utilities:           50KB
Your Code:          100KB
─────────────────────────
Total:              370KB
```

**htmx:**
```
htmx:                14KB
Your Code:            0KB (HTML)
─────────────────────────
Total:               14KB
```

**Result:** 96% smaller bundle

### Time to Interactive (TTI)

**SPA Flow:**
```
Download HTML
  ↓
Download JS Bundle (370KB)
  ↓
Parse JavaScript (200ms)
  ↓
Execute JavaScript (300ms)
  ↓
Fetch Data from API
  ↓
Render UI
  ↓
INTERACTIVE (2-4 seconds)
```

**htmx Flow:**
```
Download HTML with content
  ↓
Download htmx (14KB)
  ↓
Parse htmx (20ms)
  ↓
INTERACTIVE (0.5-1 second)
```

### Server Load

**JSON API:**
```javascript
// Server generates data
app.get('/api/todos', (req, res) => {
  res.json(todos); // ~1KB
});

// Client renders (CPU intensive)
// Client makes multiple API calls for related data
```

**htmx:**
```javascript
// Server generates HTML
app.get('/todos', (req, res) => {
  res.send(html); // ~3KB (includes markup)
});

// Client just displays (minimal CPU)
// One request gets everything
```

**Tradeoff:**
- ❌ Slightly larger response (HTML vs JSON)
- ✅ Server can cache HTML fragments
- ✅ CDN can cache HTML responses
- ✅ Client does less work
- ✅ Fewer round trips

### Caching Strategies

HTML fragments are highly cacheable:

```javascript
app.get('/todos', (req, res) => {
  // Cache for 60 seconds
  res.set('Cache-Control', 'public, max-age=60');
  res.send(generateTodosHTML());
});
```

For authenticated content:

```javascript
app.get('/todos', requireAuth, (req, res) => {
  // Private cache
  res.set('Cache-Control', 'private, max-age=60');
  res.send(generateUserTodosHTML(req.user));
});
```

### Network Efficiency

htmx uses HTTP efficiently:

**Only fetch what's needed:**
```html
<!-- Only updates todo-list, not entire page -->
<button hx-get="/todos" hx-target="#todo-list">
```

**Automatic request deduplication:**
- htmx prevents duplicate simultaneous requests
- Built-in debouncing and throttling

**Efficient polling:**
```html
<!-- Poll every 5 seconds -->
<div hx-get="/todos" hx-trigger="every 5s">
```

---

## 🏆 Best Practices

### 1. Avoid Inline Scripts - Use HX-Trigger Headers

**❌ Bad: Inline script in response**
```javascript
app.post('/todos', (req, res) => {
  const todo = createTodo(req.body.text);
  res.send(`
    ${generateTodoHTML(todo)}
    <script>document.getElementById('input').value = '';</script>
  `);
});
```

**✅ Good: Use htmx events and HX-Trigger header**
```javascript
app.post('/todos', (req, res) => {
  const todo = createTodo(req.body.text);
  res.setHeader('HX-Trigger', 'todoUpdate');  // Server-driven event
  res.send(generateTodoHTML(todo));
});
```

```html
<!-- Form auto-resets on successful request -->
<form hx-post="/todos" hx-on::after-request="if(event.detail.successful) this.reset()">
```

**Why:**
- ✅ Maintains pure HATEOAS architecture
- ✅ Server controls event triggers
- ✅ No script execution in responses
- ✅ Easier to test and debug

### 2. Use Out-of-Band Swaps for Multiple Updates

**❌ Bad: Client-side DOM manipulation**
```javascript
// Client-side JavaScript to update multiple elements
res.send(todoHtml + `
  <script>
    document.querySelector('.active-tab').classList.remove('active');
    document.querySelector('[data-filter="${filter}"]').classList.add('active');
  </script>
`);
```

**✅ Good: Server-side out-of-band swap**
```javascript
app.get('/todos', (req, res) => {
  const filter = req.query.filter || 'all';
  const todosHtml = generateFilteredTodos(filter);
  const tabsHtml = generateFilterTabs(filter); // With hx-swap-oob="true"

  res.send(todosHtml + tabsHtml);  // htmx handles both swaps
});
```

**Why:**
- ✅ One response updates multiple page sections
- ✅ Server owns all UI state
- ✅ No client-side manipulation
- ✅ Clean separation of concerns

### 3. Return Minimal HTML

Don't return entire pages, return fragments:

```javascript
// ❌ Bad: Returns full page
app.get('/todos', (req, res) => {
  res.render('full-page', { todos });
});

// ✅ Good: Returns fragment
app.get('/todos', (req, res) => {
  const html = todos.map(t => `<li>${t.text}</li>`).join('');
  res.send(html);
});
```

### 4. Use Semantic HTML

htmx works best with proper HTML:

```html
<!-- ✅ Good: Semantic -->
<form hx-post="/todos">
  <input type="text" name="text" required>
  <button type="submit">Add</button>
</form>

<!-- ❌ Bad: Divs for everything -->
<div hx-post="/todos">
  <div class="input-wrapper">
    <div contenteditable="true" data-name="text"></div>
  </div>
  <div class="button" onclick="submit()">Add</div>
</div>
```

### 5. Keep htmx Attributes in HTML

Don't add htmx attributes via JavaScript:

```javascript
// ❌ Bad
document.querySelector('.btn').setAttribute('hx-get', '/data');
htmx.process(document.querySelector('.btn'));

// ✅ Good: In HTML from the start
<button hx-get="/data">Load</button>
```

### 6. Use Target IDs Wisely

Give targets unique IDs:

```html
<!-- ✅ Good: Unique ID -->
<li id="todo-123">
  <button hx-delete="/todos/123" hx-target="#todo-123">
    Delete
  </button>
</li>

<!-- ❌ Bad: Class selector (ambiguous) -->
<li class="todo-item">
  <button hx-delete="/todos/123" hx-target=".todo-item">
    Delete
  </button>
</li>
```

### 7. Leverage HTTP Methods

Use proper REST verbs:

```html
<!-- Create -->
<form hx-post="/todos">

<!-- Read -->
<div hx-get="/todos">

<!-- Update -->
<form hx-put="/todos/123">

<!-- Delete -->
<button hx-delete="/todos/123">
```

### 8. Handle Errors

Return appropriate status codes:

```javascript
app.post('/todos', (req, res) => {
  if (!req.body.text) {
    res.status(400).send(`
      <div class="error">
        Todo text is required
      </div>
    `);
    return;
  }

  // ... create todo
});
```

```html
<!-- Display errors in-place -->
<form hx-post="/todos">
  <input name="text">
  <button>Add</button>
  <div id="error-message"></div>
</form>
```

### 9. Use Loading States

Show feedback during requests:

```css
/* htmx adds this class during requests */
.htmx-request {
  opacity: 0.5;
  pointer-events: none;
}

.htmx-request::after {
  content: "Loading...";
}
```

### 10. Validate on Server

Always validate server-side:

```javascript
app.post('/todos', (req, res) => {
  const text = req.body.text?.trim();

  // Validation
  if (!text) {
    return res.status(400).send('<div class="error">Text required</div>');
  }

  if (text.length > 500) {
    return res.status(400).send('<div class="error">Too long</div>');
  }

  // ... create todo
});
```

### 11. Escape User Input

Prevent XSS attacks:

```javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

app.post('/todos', (req, res) => {
  const safeTodo = escapeHtml(req.body.text);
  res.send(`<li>${safeTodo}</li>`);
});
```

### 12. Use Template Engines

For complex HTML, use template engines:

```javascript
// Install EJS: npm install ejs
app.set('view engine', 'ejs');

app.get('/todos', (req, res) => {
  res.render('partials/todo-list', { todos });
});
```

```ejs
<!-- views/partials/todo-list.ejs -->
<% todos.forEach(todo => { %>
  <li class="todo-item <%= todo.completed ? 'completed' : '' %>">
    <%= todo.text %>
  </li>
<% }); %>
```

---

## 🔧 Common Patterns

### Pattern 1: Click to Edit

```html
<div id="todo-123">
  <span hx-get="/todos/123/edit" hx-target="#todo-123">
    Click to edit
  </span>
</div>
```

Server returns:

```html
<div id="todo-123">
  <form hx-put="/todos/123" hx-target="#todo-123">
    <input name="text" value="Current text">
    <button>Save</button>
  </form>
</div>
```

After save, returns back to view mode.

### Pattern 2: Infinite Scroll

```html
<div id="todos">
  <!-- Initial todos -->
  <li>Todo 1</li>
  <li>Todo 2</li>

  <!-- Load more trigger -->
  <div
    hx-get="/todos?page=2"
    hx-trigger="revealed"
    hx-swap="afterend">
    Loading more...
  </div>
</div>
```

`revealed` trigger fires when element scrolls into view.

### Pattern 3: Active Search

```html
<input
  type="text"
  name="q"
  hx-get="/search"
  hx-trigger="keyup changed delay:500ms"
  hx-target="#results">

<div id="results"></div>
```

Searches as you type (with 500ms debounce).

### Pattern 4: Optimistic Updates

```html
<button
  hx-post="/like"
  hx-swap="outerHTML"
  onclick="this.innerHTML='❤️ Liked'">
  ♡ Like
</button>
```

UI updates immediately (onclick), server confirms.

### Pattern 5: Polling

```html
<div
  hx-get="/notifications"
  hx-trigger="every 10s"
  hx-swap="innerHTML">
  <span>No new notifications</span>
</div>
```

Checks for new notifications every 10 seconds.

### Pattern 6: Dependent Selects

```html
<select
  name="country"
  hx-get="/states"
  hx-target="#state-select">
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<select id="state-select" name="state">
  <option>Select country first</option>
</select>
```

Changing country loads appropriate states.

---

## 🔒 Security Considerations

### 1. CSRF Protection

Use CSRF tokens:

```javascript
// Express with csurf
const csrf = require('csurf');
app.use(csrf());

app.get('/', (req, res) => {
  res.render('index', { csrfToken: req.csrfToken() });
});
```

```html
<form hx-post="/todos">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
  <input name="text">
  <button>Add</button>
</form>
```

### 2. Authentication

Verify auth on server:

```javascript
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send('<div>Please log in</div>');
  }
  next();
}

app.get('/todos', requireAuth, (req, res) => {
  // Only authenticated users
});
```

### 3. Input Validation

Never trust client input:

```javascript
const { body, validationResult } = require('express-validator');

app.post('/todos',
  body('text').trim().isLength({ min: 1, max: 500 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send('<div>Invalid input</div>');
    }
    // ... create todo
  }
);
```

### 4. Rate Limiting

Prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});

app.use('/todos', limiter);
```

### 5. Content Security Policy

```javascript
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://unpkg.com"
  );
  next();
});
```

---

## 🧪 Testing

### Unit Testing Server Endpoints

```javascript
// test/todos.test.js
const request = require('supertest');
const app = require('../server');

describe('POST /todos', () => {
  it('creates a new todo', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ text: 'Test todo' })
      .expect(200);

    expect(response.text).toContain('Test todo');
    expect(response.text).toContain('todo-item');
  });

  it('rejects empty todo', async () => {
    await request(app)
      .post('/todos')
      .send({ text: '' })
      .expect(400);
  });
});
```

### Integration Testing with Playwright

```javascript
// tests/e2e/todos.spec.js
const { test, expect } = require('@playwright/test');

test('add todo', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.fill('input[name="text"]', 'Buy milk');
  await page.click('button[type="submit"]');

  await expect(page.locator('.todo-item')).toContainText('Buy milk');
});

test('toggle todo', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const checkbox = page.locator('.todo-checkbox').first();
  await checkbox.check();

  await expect(page.locator('.todo-item').first()).toHaveClass(/completed/);
});
```

---

## 🚀 Deployment

### Heroku

```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
git push heroku main
```

### Vercel

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📚 Resources

### Official Documentation
- [htmx.org](https://htmx.org) - Official website
- [htmx Documentation](https://htmx.org/docs/) - Complete reference
- [htmx Examples](https://htmx.org/examples/) - Code examples

### Books
- "Hypermedia Systems" by Carson Gross (htmx creator)

### Videos
- [htmx in 100 Seconds](https://www.youtube.com/watch?v=r-GSGH2RxJs) - Fireship
- [htmx Crash Course](https://www.youtube.com/watch?v=0UvA7zvwsmg) - Traversy Media

### Community
- [htmx Discord](https://htmx.org/discord) - Community chat
- [GitHub Discussions](https://github.com/bigskysoftware/htmx/discussions)

### Related Technologies
- [Hotwire](https://hotwired.dev/) - Similar approach by Basecamp
- [Unpoly](https://unpoly.com/) - Another hypermedia library
- [Alpine.js](https://alpinejs.dev/) - Minimal JS framework (pairs well with htmx)

---

## 🎓 Conclusion

htmx represents a return to web fundamentals while embracing modern interactivity needs. By leveraging **HTML over-the-wire** instead of JSON APIs, embracing **HATEOAS principles**, and prioritizing **progressive enhancement**, htmx enables developers to build dynamic, modern web applications with dramatically less complexity.

### Key Takeaways

1. **Simplicity**: HTML attributes instead of JavaScript frameworks
2. **Performance**: Smaller bundles, faster load times
3. **Maintainability**: Server-side logic, less client-side complexity
4. **Accessibility**: Progressive enhancement ensures universal access
5. **Productivity**: Faster development, easier onboarding

### When to Use htmx

htmx excels at:
- CRUD applications
- Content-heavy sites
- Dashboard and admin panels
- Forms and data entry
- Traditional web applications

Consider alternatives for:
- Heavy client-side interactions (collaborative editors, games)
- Offline-first applications
- Real-time collaboration tools

### Next Steps

1. **Build Something**: Start with a simple CRUD app
2. **Read the Docs**: Explore [htmx.org/docs](https://htmx.org/docs/)
3. **Join the Community**: [Discord](https://htmx.org/discord)
4. **Watch Talks**: Carson Gross on YouTube
5. **Share Your Experience**: Blog about your learnings

---

**Happy Building with htmx! 🚀**

---

*Last Updated: 2025*
*htmx Version: 1.9+*
*Node.js Version: 16+*
