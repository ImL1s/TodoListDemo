# Angular 17+ Todo List Application

> 🚀 A modern, feature-rich Todo List application built with **Angular 17+**, showcasing the latest framework features including **Standalone Components** and **Signals**.

![Angular Version](https://img.shields.io/badge/Angular-17+-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Angular 17+ New Features](#-angular-17-new-features)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Component Documentation](#-component-documentation)
- [Service Documentation](#-service-documentation)
- [TypeScript Types](#-typescript-types)
- [Dependency Injection](#-dependency-injection)
- [State Management with Signals](#-state-management-with-signals)
- [Comparison with Other Frameworks](#-comparison-with-other-frameworks)
- [Best Practices](#-best-practices)
- [Performance Optimization](#-performance-optimization)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Learning Resources](#-learning-resources)
- [Next Steps](#-next-steps)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

This Todo List application demonstrates the **modern Angular development experience** using the latest features introduced in Angular 17+. It's designed to be a comprehensive learning resource for developers transitioning to or learning Angular's newest paradigms.

### What Makes This App Special?

- ✅ **Standalone Components** - No NgModule required!
- ✅ **Signals API** - Fine-grained reactive state management
- ✅ **New Control Flow Syntax** - `@if`, `@for`, `@else` instead of `*ngIf`, `*ngFor`
- ✅ **Modern TypeScript** - Strict typing with TypeScript 5.4+
- ✅ **Dependency Injection** - Angular's powerful DI system
- ✅ **LocalStorage Persistence** - Automatic data persistence
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Beautiful UI** - Modern gradient design with smooth animations

---

## 🎯 Angular 17+ New Features

Angular 17 represents a **major milestone** in Angular's evolution, introducing several groundbreaking features that fundamentally change how we build Angular applications.

### 1. Standalone Components

**Before Angular 17:**
```typescript
// app.module.ts - Required!
@NgModule({
  declarations: [AppComponent, TodoComponent, TodoListComponent],
  imports: [BrowserModule, FormsModule, CommonModule],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

**With Angular 17:**
```typescript
// app.component.ts - No module needed!
@Component({
  selector: 'app-root',
  standalone: true,  // ✨ This is the magic
  imports: [TodoComponent, TodoListComponent, CommonModule, FormsModule],
  template: `...`
})
export class AppComponent { }
```

**Benefits:**
- 🎯 Simpler mental model
- 📦 Better tree-shaking and smaller bundles
- 🚀 Faster development experience
- 🔧 Easier testing and maintenance

### 2. Signals for State Management

Signals provide a **reactive primitive** for managing state in Angular applications, offering better performance and simpler mental model than RxJS for many use cases.

**Traditional Approach (RxJS):**
```typescript
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  addTodo(todo: Todo) {
    this.todosSubject.next([...this.todosSubject.value, todo]);
  }
}
```

**With Signals:**
```typescript
export class TodoService {
  private todosSignal = signal<Todo[]>([]);
  readonly todos = this.todosSignal.asReadonly();

  addTodo(todo: Todo) {
    this.todosSignal.update(todos => [...todos, todo]);
  }

  // Computed values automatically update!
  readonly activeTodos = computed(() =>
    this.todosSignal().filter(t => !t.completed)
  );
}
```

**Benefits:**
- ⚡ Better performance with fine-grained reactivity
- 🎯 Simpler API compared to RxJS
- 🔄 Automatic dependency tracking
- 💡 Easier to understand and debug

### 3. New Control Flow Syntax

Angular 17 introduces a **built-in control flow syntax** that's more intuitive and performant.

**Old Syntax:**
```html
<div *ngIf="todos.length > 0; else empty">
  <div *ngFor="let todo of todos; trackBy: trackById">
    {{ todo.text }}
  </div>
</div>
<ng-template #empty>
  <p>No todos</p>
</ng-template>
```

**New Syntax:**
```html
@if (todos().length > 0) {
  @for (todo of todos(); track todo.id) {
    {{ todo.text }}
  }
} @else {
  <p>No todos</p>
}
```

**Benefits:**
- 📖 More readable and intuitive
- ⚡ Better runtime performance
- 🎯 Type-safe by default
- 🔧 Better IDE support

### 4. Improved Dependency Injection

Angular 17 enhances the dependency injection system with the `inject()` function.

**Constructor Injection (Traditional):**
```typescript
export class TodoComponent {
  constructor(private todoService: TodoService) {}
}
```

**inject() Function (Modern):**
```typescript
export class TodoComponent {
  private todoService = inject(TodoService);
  // Can be used outside constructor!
}
```

**Benefits:**
- 🎯 More flexible - can be used in field initializers
- 📝 Less boilerplate
- 🔧 Better for composition patterns

---

## ✨ Key Features

### Core Functionality

1. **Add Todos**
   - Input validation (minimum 3 characters)
   - Real-time error feedback
   - Keyboard shortcuts (Enter to submit)
   - Character limit (200 characters)

2. **View Todos**
   - Filter by status (All, Active, Completed)
   - Visual completion status
   - Responsive grid layout
   - Smooth animations

3. **Edit Todos**
   - Double-click to edit
   - Inline editing
   - ESC to cancel, Enter to save
   - Validation on edit

4. **Toggle Completion**
   - One-click toggle
   - Visual feedback
   - Statistics update
   - Persistent state

5. **Delete Todos**
   - Individual deletion
   - Bulk delete completed
   - Confirmation feedback
   - Undo support (planned)

6. **Data Persistence**
   - Automatic LocalStorage sync
   - Error handling
   - State recovery
   - No data loss

### Advanced Features

- **Real-time Statistics**
  - Total, active, and completed counts
  - Live updates with computed signals
  - Visual progress indicators

- **Smart Filtering**
  - Badge counts on filter buttons
  - Smooth transitions
  - Keyboard navigation

- **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimized
  - Touch-friendly controls

- **Accessibility**
  - ARIA labels
  - Keyboard navigation
  - Screen reader support
  - Focus management

---

## 🏗️ Architecture

### Application Architecture

```
┌─────────────────────────────────────────────┐
│           App Component (Root)               │
│  - Application shell                        │
│  - Global layout                            │
│  - Header and footer                        │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼──────┐      ┌────▼──────┐
│  Input   │      │   List    │
│Component │      │ Component │
└────┬─────┘      └─────┬─────┘
     │                  │
     │    ┌─────────────┘
     │    │
┌────▼────▼─────┐
│  Todo Service  │
│   (Signals)    │
└────────────────┘
```

### Component Hierarchy

```
AppComponent
├── TodoInputComponent
│   ├── Input validation
│   ├── Error handling
│   └── Add functionality
└── TodoListComponent
    ├── Filter controls
    ├── Statistics display
    └── TodoItemComponent (multiple)
        ├── Toggle completion
        ├── Edit functionality
        └── Delete action
```

### Data Flow

```
User Input
    ↓
Component Event
    ↓
Service Method
    ↓
Signal Update
    ↓
Computed Values Recalculated
    ↓
Components Re-render
    ↓
LocalStorage Sync
```

### State Management Strategy

This application uses **Angular Signals** for state management, which provides:

1. **Single Source of Truth**: `TodoService` holds all todo state
2. **Reactive Updates**: Components automatically update when signals change
3. **Computed Values**: Derived state (filters, stats) automatically recalculated
4. **Side Effects**: `effect()` for localStorage persistence

---

## 📦 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.13.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Angular CLI**: Version 17.0.0 or higher

```bash
# Check Node.js version
node --version  # Should be v18.13.0 or higher

# Check npm version
npm --version   # Should be 9.0.0 or higher

# Install Angular CLI globally
npm install -g @angular/cli@17

# Verify Angular CLI installation
ng version
```

### Installation Steps

#### 1. Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd TodoListDemo/03-modern-frameworks/04-angular

# Or download and extract the ZIP file
```

#### 2. Install Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - Angular 17+ framework
# - TypeScript compiler
# - Development tools
# - Build dependencies
```

#### 3. Start the Development Server

```bash
# Start the dev server
npm start

# Or use Angular CLI directly
ng serve

# Or with automatic browser opening
ng serve --open
```

The application will be available at: **http://localhost:4200**

#### 4. Build for Production

```bash
# Create production build
npm run build

# Or with Angular CLI
ng build --configuration production

# Output will be in dist/angular-todo-list/
```

### Development Commands

```bash
# Start development server
npm start
ng serve

# Start with live reload and open browser
ng serve --open

# Build for production
npm run build
ng build

# Run tests
npm test
ng test

# Watch mode for building
npm run watch
ng build --watch

# Serve production build locally
npm install -g http-server
http-server dist/angular-todo-list
```

---

## 🚀 Usage Guide

### Adding a Todo

1. Type your todo text in the input field
2. Click the "Add" button or press Enter
3. The todo will appear in the list below
4. Input must be at least 3 characters

**Keyboard Shortcuts:**
- `Enter`: Submit the todo
- `Escape`: Clear the input

### Viewing Todos

- **All**: Shows all todos (default)
- **Active**: Shows only incomplete todos
- **Completed**: Shows only completed todos

Filter buttons display the count of todos in each category.

### Editing a Todo

1. **Double-click** on a todo's text
2. The text becomes editable
3. Make your changes
4. Press `Enter` to save or `Escape` to cancel
5. Clicking outside the input also saves

### Toggling Completion

1. Click the checkbox next to a todo
2. The todo will be marked as complete/incomplete
3. Completed todos have a strikethrough style
4. Statistics update automatically

### Deleting Todos

**Individual Delete:**
1. Hover over a todo
2. Click the delete (trash) icon
3. The todo is removed immediately

**Bulk Delete:**
1. Complete multiple todos
2. Click "Clear Completed" button in footer
3. All completed todos are removed

### Statistics

The header displays real-time statistics:
- **Active**: Number of incomplete todos
- **Done**: Number of completed todos

The footer shows:
- **Total**: All todos
- **Active**: Incomplete todos
- **Completed**: Completed todos

---

## 📂 Project Structure

```
04-angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── todo-input/
│   │   │   │   └── todo-input.component.ts       # Input component
│   │   │   ├── todo-item/
│   │   │   │   └── todo-item.component.ts        # Item component
│   │   │   └── todo-list/
│   │   │       └── todo-list.component.ts        # List component
│   │   ├── models/
│   │   │   └── todo.model.ts                      # TypeScript interfaces
│   │   ├── services/
│   │   │   └── todo.service.ts                    # State management
│   │   └── app.component.ts                       # Root component
│   ├── index.html                                 # HTML entry point
│   ├── main.ts                                    # Application bootstrap
│   └── styles.css                                 # Global styles
├── angular.json                                   # Angular configuration
├── tsconfig.json                                  # TypeScript configuration
├── tsconfig.app.json                             # App-specific TS config
├── package.json                                   # Dependencies
└── README.md                                      # This file
```

### File Descriptions

#### Configuration Files

**package.json**
- Lists all project dependencies
- Defines npm scripts for common tasks
- Specifies Angular version and other libraries

**tsconfig.json**
- TypeScript compiler options
- Strict mode enabled for better type safety
- Modern ES2022 target for better performance

**angular.json**
- Angular CLI configuration
- Build and serve options
- Asset management
- Style inclusion

#### Source Files

**main.ts**
- Application entry point
- Bootstraps the root component
- Sets up application providers

**app.component.ts**
- Root component of the application
- Provides global layout
- Composes child components

**todo.model.ts**
- TypeScript interfaces and types
- Ensures type safety throughout the app
- Documents data structures

**todo.service.ts**
- Central state management
- Signals-based reactivity
- Business logic and data persistence

**Components:**
- Self-contained, reusable UI pieces
- Standalone (no NgModule needed)
- Include template, styles, and logic

---

## 🧩 Component Documentation

### AppComponent

**Purpose**: Root component that serves as the application shell.

**Key Features:**
- Global layout and styling
- Header with logo and statistics
- Footer with framework information
- Composes child components

**Template Structure:**
```
Header
  ├── Logo
  ├── Title
  └── Statistics Cards
Main
  ├── TodoInputComponent
  └── TodoListComponent
Footer
  └── Framework Information
```

**Signals Used:**
- `todoService.stats()` - Real-time statistics

**Styling:**
- Gradient background
- Card-based layout
- Responsive design
- Smooth animations

---

### TodoInputComponent

**Purpose**: Handles adding new todos with validation.

**Properties:**
```typescript
inputValue: string              // Current input value
showError: Signal<boolean>       // Error state
errorMessage: Signal<string>     // Error message text
placeholder: Signal<string>      // Dynamic placeholder
```

**Methods:**
```typescript
handleSubmit(): void
  // Validates input and adds todo

updatePlaceholder(): void
  // Updates placeholder with dynamic messages
```

**Validation Rules:**
- Minimum 3 characters
- Maximum 200 characters
- No empty todos
- Trims whitespace

**Features:**
- Real-time validation
- Error messages with animations
- Dynamic placeholders
- Keyboard shortcuts (Enter to submit)
- Visual feedback for errors

**Events:**
- Calls `todoService.addTodo()` on submit
- Updates placeholder after successful add

---

### TodoListComponent

**Purpose**: Displays filtered list of todos with controls.

**Properties:**
```typescript
todoService: TodoService         // Injected service
filters: FilterType[]            // Available filters
```

**Signals:**
```typescript
filteredTodos: Signal<Todo[]>    // Filtered todos based on current filter
stats: Signal<TodoStats>         // Todo statistics
hasCompletedTodos: Signal<boolean> // Whether completed todos exist
filter: Signal<FilterType>       // Current active filter
```

**Methods:**
```typescript
setFilter(filter: FilterType): void
  // Changes the active filter

getFilterCount(filter: FilterType): number
  // Gets count for specific filter

handleToggle(id: string): void
  // Toggles todo completion

handleDelete(id: string): void
  // Deletes a todo

handleEdit(id: string, text: string): void
  // Edits todo text

handleClearCompleted(): void
  // Removes all completed todos
```

**Features:**
- Three filter modes (All, Active, Completed)
- Badge counts on filters
- Empty state messages
- Statistics footer
- Bulk operations
- Scrollable list with custom scrollbar

**Template Control Flow:**
```typescript
@if (filteredTodos().length > 0) {
  @for (todo of filteredTodos(); track todo.id) {
    // Render todo items
  }
} @else {
  // Show empty state
}
```

---

### TodoItemComponent

**Purpose**: Renders and manages individual todo items.

**Inputs:**
```typescript
@Input() todo: Todo              // Todo data to display
```

**Outputs:**
```typescript
@Output() toggle = EventEmitter<void>()
@Output() delete = EventEmitter<void>()
@Output() edit = EventEmitter<string>()
```

**Properties:**
```typescript
isEditing: Signal<boolean>       // Edit mode state
editText: string                 // Text being edited
```

**Methods:**
```typescript
onToggle(): void
  // Emits toggle event

onDelete(): void
  // Emits delete event

handleEdit(): void
  // Enters edit mode

handleSave(): void
  // Saves edited text and exits edit mode

handleCancel(): void
  // Cancels edit and reverts changes
```

**Features:**
- Inline editing (double-click to edit)
- Custom checkbox with animation
- Hover actions (edit, delete)
- Keyboard shortcuts in edit mode
  - Enter: Save
  - Escape: Cancel
- Visual completion state
- Smooth animations

**Styling:**
- Slide-in animation on mount
- Hover effects
- Completed state styling
- Responsive action buttons

---

## 🔧 Service Documentation

### TodoService

**Purpose**: Central state management service using Angular Signals.

**Provider:**
```typescript
@Injectable({ providedIn: 'root' })
```
This means the service is a singleton provided at the root level.

#### Private State

```typescript
private todosSignal = signal<Todo[]>([])
private filterSignal = signal<FilterType>('all')
```

#### Public Readonly Signals

```typescript
readonly todos: Signal<Todo[]>
  // All todos (readonly)

readonly filter: Signal<FilterType>
  // Current filter (readonly)

readonly filteredTodos: Signal<Todo[]>
  // Computed: Todos filtered by current filter

readonly stats: Signal<TodoStats>
  // Computed: Statistics (total, active, completed)

readonly hasCompletedTodos: Signal<boolean>
  // Computed: Whether any completed todos exist
```

#### Methods

**addTodo(text: string): void**
```typescript
// Creates and adds a new todo
// - Validates input (trims, checks length)
// - Generates unique ID
// - Updates todosSignal
// - Triggers automatic localStorage save
```

**toggleTodo(id: string): void**
```typescript
// Toggles completion status of a todo
// - Finds todo by ID
// - Flips completed boolean
// - Maintains immutability
```

**deleteTodo(id: string): void**
```typescript
// Removes a todo
// - Filters out todo with matching ID
// - Updates signal immutably
```

**editTodo(id: string, newText: string): void**
```typescript
// Updates todo text
// - Validates new text
// - Finds todo by ID
// - Updates text property
```

**clearCompleted(): void**
```typescript
// Removes all completed todos
// - Filters out completed items
// - Updates signal
```

**setFilter(filter: FilterType): void**
```typescript
// Changes the active filter
// - Updates filterSignal
// - Triggers filteredTodos recalculation
```

**toggleAll(): void**
```typescript
// Toggles all todos to same state
// - If all completed: uncomplete all
// - Otherwise: complete all
```

#### Effects

```typescript
constructor() {
  effect(() => {
    const todos = this.todosSignal();
    this.saveToStorage(todos);
  });
}
```

**Purpose**: Automatically persists todos to localStorage whenever they change.

**How it works:**
1. Effect tracks `todosSignal()`
2. When signal changes, effect runs
3. Todos are saved to localStorage
4. No manual save calls needed!

#### Computed Signals

**filteredTodos**
```typescript
computed(() => {
  const todos = this.todosSignal();
  const filter = this.filterSignal();

  switch (filter) {
    case 'active': return todos.filter(t => !t.completed);
    case 'completed': return todos.filter(t => t.completed);
    default: return todos;
  }
})
```
- **Dependencies**: `todosSignal`, `filterSignal`
- **Updates**: Automatically when either dependency changes
- **Performance**: Only recalculates when needed

**stats**
```typescript
computed<TodoStats>(() => {
  const todos = this.todosSignal();
  return {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };
})
```
- **Dependencies**: `todosSignal`
- **Updates**: When todos array changes
- **Used by**: Header statistics, footer display

#### Private Helper Methods

**generateId(): string**
```typescript
// Creates unique ID using timestamp + random string
// Format: "1234567890-abc123def"
```

**loadFromStorage(): Todo[]**
```typescript
// Loads todos from localStorage on initialization
// Handles errors gracefully
// Returns empty array if no data or error
```

**saveToStorage(todos: Todo[]): void**
```typescript
// Saves todos to localStorage
// Handles errors gracefully
// Called automatically by effect
```

---

## 📊 TypeScript Types

### Todo Interface

```typescript
interface Todo {
  id: string;          // Unique identifier
  text: string;        // Todo content
  completed: boolean;  // Completion status
  createdAt: number;   // Timestamp
}
```

**Usage:**
```typescript
const todo: Todo = {
  id: '1234567890-abc123',
  text: 'Learn Angular Signals',
  completed: false,
  createdAt: Date.now()
};
```

### FilterType

```typescript
type FilterType = 'all' | 'active' | 'completed';
```

**Usage:**
```typescript
const currentFilter: FilterType = 'active';

// Type safety prevents typos
const invalid: FilterType = 'done';  // ❌ Error!
```

### TodoStats Interface

```typescript
interface TodoStats {
  total: number;      // Total todos
  active: number;     // Incomplete todos
  completed: number;  // Completed todos
}
```

**Usage:**
```typescript
const stats: TodoStats = {
  total: 10,
  active: 7,
  completed: 3
};
```

### Type Guards

While not implemented in this app, here's how you could add type guards:

```typescript
function isTodo(obj: any): obj is Todo {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.completed === 'boolean' &&
    typeof obj.createdAt === 'number'
  );
}

// Usage
const data = JSON.parse(localStorage.getItem('todos') || '[]');
const todos = data.filter(isTodo);  // Type-safe filtering
```

---

## 💉 Dependency Injection

Angular's Dependency Injection (DI) system is one of its most powerful features, providing a robust way to manage dependencies and promote loose coupling.

### How DI Works in This App

#### Service Registration

```typescript
@Injectable({
  providedIn: 'root'  // ✨ Registers service at root level
})
export class TodoService {
  // Service implementation
}
```

**Benefits:**
- **Singleton**: One instance shared across app
- **Tree-shakable**: Removed if unused
- **No manual registration**: Angular handles everything

#### Service Injection - Traditional

```typescript
export class TodoListComponent {
  constructor(private todoService: TodoService) {
    // todoService is now available
  }
}
```

#### Service Injection - Modern (inject function)

```typescript
export class TodoListComponent {
  todoService = inject(TodoService);

  // Can use in field initializers!
  stats = computed(() => this.todoService.stats());
}
```

### DI Advantages

1. **Testability**
```typescript
// Easy to mock in tests
TestBed.configureTestingModule({
  providers: [
    { provide: TodoService, useClass: MockTodoService }
  ]
});
```

2. **Flexibility**
```typescript
// Easy to swap implementations
@Injectable({ providedIn: 'root' })
export class LocalStorageTodoService implements TodoService { }

@Injectable({ providedIn: 'root' })
export class ApiTodoService implements TodoService { }
```

3. **Loose Coupling**
- Components don't create their dependencies
- Services can be replaced without changing components
- Promotes separation of concerns

### DI Hierarchy

```
Root Injector
  └── TodoService (singleton)
      ├── Used by AppComponent
      ├── Used by TodoListComponent
      └── Used by TodoInputComponent
```

All components share the same instance!

---

## 📡 State Management with Signals

Signals are Angular's new reactive primitive for managing state. They provide fine-grained reactivity and are a simpler alternative to RxJS for many use cases.

### Core Concepts

#### 1. Writable Signals

```typescript
const count = signal(0);

// Read value
console.log(count());  // 0

// Set new value
count.set(5);

// Update based on current value
count.update(n => n + 1);
```

#### 2. Readonly Signals

```typescript
private _count = signal(0);
readonly count = this._count.asReadonly();

// Outside code can read but not write
console.log(this.count());     // ✅ Works
this.count.set(5);             // ❌ Error!
```

#### 3. Computed Signals

```typescript
const count = signal(0);
const doubled = computed(() => count() * 2);

console.log(doubled());  // 0
count.set(5);
console.log(doubled());  // 10 - automatically updated!
```

#### 4. Effects

```typescript
const count = signal(0);

effect(() => {
  console.log('Count changed to:', count());
});

count.set(5);  // Logs: "Count changed to: 5"
```

### Signals in TodoService

#### State Declaration

```typescript
export class TodoService {
  // Private writable signal
  private todosSignal = signal<Todo[]>([]);

  // Public readonly signal
  readonly todos = this.todosSignal.asReadonly();

  // Computed signals
  readonly stats = computed(() => {
    const todos = this.todosSignal();
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    };
  });

  // Effects for side effects
  constructor() {
    effect(() => {
      const todos = this.todosSignal();
      localStorage.setItem('todos', JSON.stringify(todos));
    });
  }
}
```

#### Updating Signals

```typescript
// Set: Replace entire value
this.todosSignal.set([]);

// Update: Transform current value
this.todosSignal.update(todos => [...todos, newTodo]);

// For objects/arrays, maintain immutability
this.todosSignal.update(todos =>
  todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
);
```

### Signal Benefits

1. **Performance**
   - Fine-grained updates
   - Only affected components re-render
   - No zone.js overhead for signal updates

2. **Simplicity**
   - Easy to understand
   - Less boilerplate than RxJS
   - No subscription management

3. **Type Safety**
   - Full TypeScript support
   - Better IDE autocomplete
   - Compile-time error checking

4. **Debugging**
   - Clear dependency tracking
   - Easy to trace value changes
   - Better DevTools integration

### Signals vs RxJS

**When to use Signals:**
- Simple state management
- Computed values
- Component state
- Form state

**When to use RxJS:**
- Async operations (HTTP requests)
- Complex event handling
- Time-based operations
- Advanced operators needed

**You can use both!** They interoperate well:

```typescript
// Convert Observable to Signal
readonly todos = toSignal(this.http.get<Todo[]>('/api/todos'));

// Convert Signal to Observable
readonly todos$ = toObservable(this.todosSignal);
```

---

## 🔄 Comparison with Other Frameworks

### Angular vs React

| Feature | Angular 17+ | React 18+ |
|---------|------------|-----------|
| **Paradigm** | Framework (opinionated) | Library (flexible) |
| **Language** | TypeScript (required) | JavaScript/TypeScript |
| **State** | Signals + RxJS | Hooks (useState, useReducer) |
| **Components** | Class or Function + Decorator | Function components |
| **Templates** | HTML templates | JSX |
| **Styling** | Component styles, CSS | CSS-in-JS, CSS Modules |
| **Routing** | Built-in Angular Router | External (React Router) |
| **Forms** | Template-driven + Reactive | Controlled components |
| **DI** | Built-in, powerful | Context API, manual |
| **CLI** | Angular CLI (comprehensive) | Create React App, Vite |
| **Bundle Size** | Larger (~140KB) | Smaller (~40KB) |
| **Learning Curve** | Steeper | Gentler |

**Code Comparison:**

**React (Hooks):**
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
}
```

**Angular (Signals):**
```typescript
@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: `
    <div>
      @for (todo of todos(); track todo.id) {
        <app-todo-item [todo]="todo" />
      }
    </div>
  `
})
export class TodoListComponent {
  private todosSignal = signal<Todo[]>([]);
  readonly todos = this.todosSignal.asReadonly();

  addTodo(text: string) {
    this.todosSignal.update(todos =>
      [...todos, { id: Date.now(), text, completed: false }]
    );
  }
}
```

### Angular vs Vue

| Feature | Angular 17+ | Vue 3 |
|---------|------------|-------|
| **Paradigm** | Framework | Progressive framework |
| **Language** | TypeScript | JavaScript/TypeScript |
| **State** | Signals | Composition API (ref, reactive) |
| **Templates** | HTML with directives | HTML with directives |
| **Reactivity** | Signals + Change Detection | Proxy-based reactivity |
| **Routing** | Angular Router | Vue Router |
| **State Management** | Services + Signals | Pinia, Vuex |
| **Build Tool** | Angular CLI | Vite |
| **Learning Curve** | Steep | Moderate |

**Code Comparison:**

**Vue 3 (Composition API):**
```vue
<script setup>
import { ref, computed } from 'vue';

const todos = ref([]);

const addTodo = (text) => {
  todos.value.push({ id: Date.now(), text, completed: false });
};
</script>

<template>
  <div>
    <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
  </div>
</template>
```

**Angular (Signals):**
```typescript
@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: `
    <div>
      @for (todo of todos(); track todo.id) {
        <app-todo-item [todo]="todo" />
      }
    </div>
  `
})
export class TodoListComponent {
  private todosSignal = signal<Todo[]>([]);
  readonly todos = this.todosSignal.asReadonly();

  addTodo(text: string) {
    this.todosSignal.update(todos =>
      [...todos, { id: Date.now(), text, completed: false }]
    );
  }
}
```

### Angular's Unique Strengths

1. **Complete Solution**
   - Everything you need out of the box
   - Consistent architecture
   - Clear best practices

2. **Enterprise-Ready**
   - Strong TypeScript integration
   - Powerful DI system
   - Excellent testing tools
   - Comprehensive documentation

3. **Scalability**
   - Module system for large apps
   - Lazy loading
   - Code splitting
   - Clear separation of concerns

4. **Tooling**
   - Angular CLI for scaffolding
   - Built-in linting
   - Migration tools
   - Update schematics

5. **Backed by Google**
   - Long-term support
   - Regular updates
   - Large community
   - Enterprise adoption

---

## 🏆 Best Practices

### 1. Component Design

**✅ Do:**
```typescript
// Single responsibility
@Component({
  selector: 'app-todo-item',
  // Component handles ONLY todo item display and interaction
})
export class TodoItemComponent { }
```

**❌ Don't:**
```typescript
// Component doing too much
@Component({
  selector: 'app-todo-item',
  // Handling item display, filtering, API calls, etc.
})
export class TodoItemComponent { }
```

### 2. Signal Usage

**✅ Do:**
```typescript
// Use signals for reactive state
private todosSignal = signal<Todo[]>([]);
readonly todos = this.todosSignal.asReadonly();

// Use computed for derived state
readonly activeTodos = computed(() =>
  this.todos().filter(t => !t.completed)
);
```

**❌ Don't:**
```typescript
// Manual recalculation
activeTodos: Todo[] = [];

updateActiveTodos() {
  this.activeTodos = this.todos.filter(t => !t.completed);
}
```

### 3. Immutability

**✅ Do:**
```typescript
// Create new array when updating
this.todosSignal.update(todos => [...todos, newTodo]);

// Create new object when updating
this.todosSignal.update(todos =>
  todos.map(todo =>
    todo.id === id ? { ...todo, completed: true } : todo
  )
);
```

**❌ Don't:**
```typescript
// Mutate existing array
this.todosSignal().push(newTodo);  // BAD!

// Mutate existing object
this.todosSignal().find(t => t.id === id).completed = true;  // BAD!
```

### 4. Type Safety

**✅ Do:**
```typescript
// Explicit types
addTodo(text: string): void {
  const newTodo: Todo = {
    id: this.generateId(),
    text,
    completed: false,
    createdAt: Date.now()
  };
  this.todosSignal.update(todos => [...todos, newTodo]);
}
```

**❌ Don't:**
```typescript
// Any types
addTodo(text: any): any {
  const newTodo = {
    id: this.generateId(),
    text,
    completed: false
  };
  this.todosSignal.update((todos: any) => [...todos, newTodo]);
}
```

### 5. Dependency Injection

**✅ Do:**
```typescript
// Inject services, don't instantiate
export class TodoListComponent {
  todoService = inject(TodoService);
}
```

**❌ Don't:**
```typescript
// Don't create instances manually
export class TodoListComponent {
  todoService = new TodoService();  // BAD!
}
```

### 6. Error Handling

**✅ Do:**
```typescript
private loadFromStorage(): Todo[] {
  try {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
}
```

**❌ Don't:**
```typescript
private loadFromStorage(): Todo[] {
  const stored = localStorage.getItem(this.STORAGE_KEY);
  return JSON.parse(stored);  // Can throw error!
}
```

### 7. Component Communication

**✅ Do:**
```typescript
// Use @Input and @Output
@Component({
  selector: 'app-todo-item'
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() toggle = new EventEmitter<void>();
}
```

**❌ Don't:**
```typescript
// Don't share state via shared mutable objects
@Component({
  selector: 'app-todo-item'
})
export class TodoItemComponent {
  // Accessing parent's data directly
}
```

### 8. Standalone Components

**✅ Do:**
```typescript
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  // ...
})
export class TodoListComponent { }
```

**❌ Don't:**
```typescript
// Don't use NgModule for new Angular 17+ apps
@NgModule({
  declarations: [TodoListComponent],
  imports: [CommonModule]
})
export class TodoModule { }
```

---

## ⚡ Performance Optimization

### 1. OnPush Change Detection

While this app uses signals (which are already optimized), here's how you'd use OnPush:

```typescript
@Component({
  selector: 'app-todo-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class TodoItemComponent { }
```

**Benefits:**
- Only checks when inputs change
- Reduces unnecessary checks
- Better performance

### 2. TrackBy Functions

```typescript
@for (todo of todos(); track todo.id) {
  <app-todo-item [todo]="todo" />
}
```

**Benefits:**
- Angular can identify which items changed
- Reduces DOM manipulation
- Better list performance

### 3. Lazy Loading

For larger apps, lazy load feature modules:

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then(m => m.AdminComponent)
  }
];
```

### 4. Signal Optimization

```typescript
// Computed signals only recalculate when dependencies change
readonly filteredTodos = computed(() => {
  const todos = this.todosSignal();
  const filter = this.filterSignal();
  return todos.filter(/* ... */);
});
```

### 5. Virtual Scrolling

For very long lists, use Angular CDK's virtual scrolling:

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50">
      <div *cdkVirtualFor="let todo of todos()">
        {{ todo.text }}
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
```

### 6. Bundle Size Optimization

```bash
# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/angular-todo-list/stats.json

# Production build with optimization
ng build --configuration production
```

### Performance Checklist

- ✅ Use signals for reactive state
- ✅ Use trackBy in @for loops
- ✅ Minimize component re-renders
- ✅ Lazy load routes when possible
- ✅ Use OnPush change detection
- ✅ Optimize images and assets
- ✅ Enable production mode
- ✅ Use AOT compilation

---

## 🧪 Testing

### Unit Testing Setup

Angular comes with Jasmine and Karma for testing:

```typescript
// todo.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a todo', () => {
    service.addTodo('Test todo');
    expect(service.todos().length).toBe(1);
    expect(service.todos()[0].text).toBe('Test todo');
  });

  it('should toggle todo completion', () => {
    service.addTodo('Test todo');
    const id = service.todos()[0].id;

    service.toggleTodo(id);
    expect(service.todos()[0].completed).toBe(true);

    service.toggleTodo(id);
    expect(service.todos()[0].completed).toBe(false);
  });

  it('should compute statistics correctly', () => {
    service.addTodo('Todo 1');
    service.addTodo('Todo 2');
    service.addTodo('Todo 3');

    service.toggleTodo(service.todos()[0].id);

    const stats = service.stats();
    expect(stats.total).toBe(3);
    expect(stats.active).toBe(2);
    expect(stats.completed).toBe(1);
  });
});
```

### Component Testing

```typescript
// todo-input.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoInputComponent } from './todo-input.component';
import { TodoService } from '../../services/todo.service';

describe('TodoInputComponent', () => {
  let component: TodoInputComponent;
  let fixture: ComponentFixture<TodoInputComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoInputComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit empty todo', () => {
    component.inputValue = '';
    component.handleSubmit();
    expect(todoService.todos().length).toBe(0);
    expect(component.showError()).toBe(true);
  });

  it('should submit valid todo', () => {
    component.inputValue = 'New todo';
    component.handleSubmit();
    expect(todoService.todos().length).toBe(1);
    expect(component.inputValue).toBe('');
  });
});
```

### Running Tests

```bash
# Run tests once
ng test --no-watch

# Run tests in watch mode
ng test

# Run with code coverage
ng test --code-coverage

# View coverage report
open coverage/angular-todo-list/index.html
```

### E2E Testing

For end-to-end testing, consider using Cypress or Playwright:

```typescript
// cypress/e2e/todo.cy.ts
describe('Todo App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add a todo', () => {
    cy.get('.todo-input').type('New todo{enter}');
    cy.contains('New todo').should('exist');
  });

  it('should toggle todo completion', () => {
    cy.get('.todo-input').type('New todo{enter}');
    cy.get('.todo-checkbox').click();
    cy.get('.todo-item').should('have.class', 'completed');
  });

  it('should filter todos', () => {
    cy.get('.todo-input').type('Todo 1{enter}');
    cy.get('.todo-input').type('Todo 2{enter}');
    cy.get('.todo-checkbox').first().click();

    cy.contains('Active').click();
    cy.contains('Todo 1').should('not.exist');
    cy.contains('Todo 2').should('exist');
  });
});
```

---

## 🚀 Deployment

### Building for Production

```bash
# Create production build
ng build --configuration production

# Output directory
dist/angular-todo-list/
```

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel)

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/angular-todo-list
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### 2. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize
firebase init hosting

# Build and deploy
ng build --configuration production
firebase deploy
```

#### 3. GitHub Pages

```bash
# Install angular-cli-ghpages
npm install -g angular-cli-ghpages

# Build and deploy
ng build --configuration production --base-href "/your-repo/"
npx angular-cli-ghpages --dir=dist/angular-todo-list
```

#### 4. Docker

```dockerfile
# Dockerfile
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/angular-todo-list /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t angular-todo .
docker run -p 80:80 angular-todo
```

### Production Checklist

- ✅ Enable production mode
- ✅ Optimize bundle size
- ✅ Enable compression
- ✅ Set proper caching headers
- ✅ Use CDN for static assets
- ✅ Enable HTTPS
- ✅ Set up error tracking
- ✅ Configure analytics
- ✅ Test on multiple devices
- ✅ Monitor performance

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Cannot find module '@angular/core'"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port 4200 already in use

**Solution:**
```bash
# Use different port
ng serve --port 4300

# Or kill process using port 4200
lsof -ti:4200 | xargs kill -9
```

#### 3. Changes not reflecting

**Solution:**
```bash
# Clear cache and restart
rm -rf .angular
ng serve
```

#### 4. Build errors

**Solution:**
```bash
# Clear build cache
rm -rf dist .angular
ng build
```

#### 5. LocalStorage not working

**Solution:**
- Check browser privacy settings
- Ensure not in incognito mode
- Check browser console for errors

### Debugging Tips

1. **Use Angular DevTools**
   - Install Chrome extension
   - Inspect component tree
   - View signal values
   - Profile performance

2. **Console Logging**
```typescript
effect(() => {
  console.log('Todos changed:', this.todosSignal());
});
```

3. **Network Tab**
   - Check for 404s
   - Verify asset loading
   - Monitor request timing

4. **Source Maps**
   - Enable in angular.json
   - Debug TypeScript directly
   - Set breakpoints

---

## 📚 Learning Resources

### Official Documentation

- [Angular Documentation](https://angular.io/docs)
- [Angular Signals](https://angular.io/guide/signals)
- [Standalone Components](https://angular.io/guide/standalone-components)
- [Angular CLI](https://angular.io/cli)

### Tutorials

- [Angular Tutorial](https://angular.io/tutorial)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community

- [Angular Blog](https://blog.angular.io/)
- [Angular Reddit](https://www.reddit.com/r/Angular2/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/angular)
- [Angular Discord](https://discord.gg/angular)

### Video Courses

- [Angular University](https://angular-university.io/)
- [Pluralsight Angular Path](https://www.pluralsight.com/paths/angular)
- [Udemy Angular Courses](https://www.udemy.com/topic/angular/)

---

## 🎯 Next Steps

### Beginner Level

1. **Understand the Basics**
   - Review each component's code
   - Understand signal flow
   - Experiment with styling
   - Add console.logs to track data flow

2. **Make Simple Changes**
   - Change colors and styles
   - Add new todo properties (priority, due date)
   - Modify filter options
   - Update placeholder messages

3. **Learn TypeScript**
   - Study the type definitions
   - Try adding new types
   - Use strict mode
   - Understand interfaces

### Intermediate Level

1. **Add Features**
   - Todo categories/tags
   - Search functionality
   - Sort options (by date, alphabetically)
   - Bulk operations
   - Undo/redo functionality

2. **Improve UX**
   - Drag and drop to reorder
   - Keyboard shortcuts
   - Toast notifications
   - Loading states
   - Animations

3. **Backend Integration**
   - Connect to REST API
   - Use HttpClient
   - Handle loading states
   - Error handling
   - Optimistic updates

### Advanced Level

1. **State Management**
   - Implement NgRx
   - Use RxJS operators
   - Complex async workflows
   - Caching strategies

2. **Advanced Features**
   - Real-time sync (WebSockets)
   - Offline support (Service Workers)
   - Multi-user collaboration
   - Advanced animations
   - Virtualized lists

3. **Architecture**
   - Feature modules
   - Lazy loading
   - Micro-frontends
   - Monorepo setup
   - Advanced testing

### Production-Ready

1. **Security**
   - Input sanitization
   - XSS prevention
   - CSRF protection
   - Content Security Policy

2. **Performance**
   - Code splitting
   - Bundle optimization
   - Image optimization
   - Caching strategies

3. **DevOps**
   - CI/CD pipeline
   - Automated testing
   - Environment management
   - Monitoring and logging

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Issues

1. Check existing issues
2. Create detailed bug report
3. Include reproduction steps
4. Provide Angular/browser version

### Submitting Changes

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests
5. Submit pull request

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Add JSDoc comments
- Update documentation

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support

Need help? Here are some resources:

- **Documentation**: See sections above
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@example.com

---

## 🎉 Acknowledgments

- **Angular Team** - For creating an amazing framework
- **Community** - For countless tutorials and resources
- **TypeScript Team** - For excellent type system
- **Open Source Contributors** - For inspiration and code

---

**Happy Coding! 🚀**

Built with ❤️ using Angular 17+
