# React + Shadcn/ui Todo Application

A complete, feature-rich Todo List application built with React, Shadcn/ui, Radix UI primitives, Tailwind CSS, and Zustand for state management. This implementation demonstrates the unique copy-paste component architecture of Shadcn/ui and showcases modern React development patterns.

## Table of Contents

- [Overview](#overview)
- [What is Shadcn/ui?](#what-is-shadcnui)
- [Key Features](#key-features)
- [Shadcn/ui Philosophy](#shadcnui-philosophy)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Components Used](#components-used)
- [Radix UI Primitives](#radix-ui-primitives)
- [Tailwind CSS Integration](#tailwind-css-integration)
- [Dark Mode Implementation](#dark-mode-implementation)
- [State Management with Zustand](#state-management-with-zustand)
- [Component Architecture](#component-architecture)
- [Customization Guide](#customization-guide)
- [Comparison with Other UI Libraries](#comparison-with-other-ui-libraries)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)
- [Performance Considerations](#performance-considerations)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)
- [Further Resources](#further-resources)

## Overview

This Todo application showcases the power and flexibility of Shadcn/ui, a revolutionary approach to building user interfaces in React. Unlike traditional component libraries, Shadcn/ui provides a collection of re-usable components that you copy and paste into your apps, giving you complete control over the code.

### Application Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Priority levels (low, medium, high)
- ✅ Filter todos (all, active, completed)
- ✅ Clear completed todos
- ✅ Persistent storage using localStorage
- ✅ Dark mode support
- ✅ Fully responsive design
- ✅ Accessible with ARIA attributes
- ✅ Type-safe with TypeScript

## What is Shadcn/ui?

Shadcn/ui is NOT a component library in the traditional sense. Instead, it's a collection of **re-usable components** that you can copy and paste into your apps.

### The Unique Approach

**Traditional Component Libraries:**
```bash
npm install @mui/material
# Components are black boxes in node_modules
```

**Shadcn/ui Approach:**
```bash
npx shadcn-ui@latest add button
# Component code is copied to your src/components/ui
```

### Why This Matters

1. **Full Ownership**: The component code lives in your repository
2. **Complete Control**: Modify components to match your exact needs
3. **No Lock-in**: No dependency on external package updates
4. **Transparency**: See exactly what each component does
5. **Customization**: Change anything without fighting the library

### Philosophy

Shadcn/ui is built on these principles:

- **Accessible**: Built on Radix UI primitives with ARIA support
- **Customizable**: Components use CVA (Class Variance Authority) for variants
- **Composable**: Small, focused components that work together
- **Typed**: Full TypeScript support
- **Styled**: Uses Tailwind CSS for utility-first styling
- **Consistent**: Follows a unified design system

## Key Features

### 1. Copy-Paste Architecture

Components are not installed as npm packages. Instead, you copy them into your project:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
```

This gives you:
- Source code in your repository
- Full modification rights
- No version conflicts
- Complete transparency

### 2. Built on Radix UI

Shadcn/ui leverages Radix UI primitives for:
- Accessibility (ARIA attributes, keyboard navigation)
- Unstyled, functional components
- Composition patterns
- Browser compatibility

### 3. Styled with Tailwind CSS

All components use Tailwind CSS:
- Utility-first approach
- Responsive by default
- Easy to customize
- Small bundle sizes

### 4. TypeScript Support

Every component is fully typed:
- IntelliSense support
- Type safety
- Better developer experience
- Catch errors early

## Technology Stack

### Core Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.2.2",
  "vite": "^5.0.8"
}
```

### Shadcn/ui Foundation

```json
{
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-slot": "^1.0.2",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "lucide-react": "^0.309.0"
}
```

### State Management & Utilities

```json
{
  "zustand": "^4.4.7"
}
```

### Build Tools

```json
{
  "tailwindcss": "^3.4.0",
  "tailwindcss-animate": "^1.0.7",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```

## Project Structure

```
08-react-shadcn-ui/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn/ui components
│   │   │   ├── button.tsx         # Button component with variants
│   │   │   ├── input.tsx          # Input component
│   │   │   ├── card.tsx           # Card components (Card, CardHeader, etc.)
│   │   │   ├── checkbox.tsx       # Checkbox with Radix UI
│   │   │   ├── badge.tsx          # Badge component
│   │   │   └── dialog.tsx         # Dialog modal component
│   │   ├── todo/                  # Todo-specific components
│   │   │   ├── todo-input.tsx     # Input for creating todos
│   │   │   ├── todo-item.tsx      # Individual todo item
│   │   │   └── todo-list.tsx      # Todo list with filters
│   │   └── theme-provider.tsx     # Dark mode provider
│   ├── store/
│   │   └── useTodoStore.ts        # Zustand store
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn)
│   ├── types.ts                   # TypeScript types
│   ├── App.tsx                    # Main application
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles + Tailwind
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Basic knowledge of React and TypeScript
- Familiarity with Tailwind CSS

### Step 1: Clone or Create Project

```bash
# Navigate to the project directory
cd 05-ui-libraries/08-react-shadcn-ui
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 4: Build for Production

```bash
npm run build
```

### Step 5: Preview Production Build

```bash
npm run preview
```

## Components Used

This application uses 6 core Shadcn/ui components. Each is a standalone file in `src/components/ui/`.

### 1. Button Component

**File**: `src/components/ui/button.tsx`

The Button component uses Class Variance Authority (CVA) for type-safe variants.

**Features:**
- Multiple variants: default, destructive, outline, secondary, ghost, link
- Multiple sizes: default, sm, lg, icon
- Support for `asChild` prop (renders as different element)
- Full TypeScript support

**Variants:**

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

**Sizes:**

```tsx
<Button size="default">Normal</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**Implementation Details:**

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // ... more variants
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        // ... more sizes
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 2. Input Component

**File**: `src/components/ui/input.tsx`

A styled input component with consistent design.

**Features:**
- Accessible form input
- Focus states with ring
- Disabled states
- File input support
- Placeholder styling

**Usage:**

```tsx
<Input
  type="text"
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Implementation:**

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### 3. Card Component

**File**: `src/components/ui/card.tsx`

A container component with multiple sub-components for composition.

**Sub-components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Usage:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Main content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

**Composition Pattern:**

Shadcn/ui components follow a composition pattern where complex components are built from smaller, focused components. This gives you flexibility to use only what you need.

### 4. Checkbox Component

**File**: `src/components/ui/checkbox.tsx`

Built on Radix UI's Checkbox primitive for full accessibility.

**Features:**
- Keyboard navigation
- ARIA attributes
- Checked/unchecked/indeterminate states
- Custom check icon (using Lucide)
- Focus states

**Usage:**

```tsx
<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
/>
```

**Radix UI Integration:**

```tsx
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(/* styles */)}
    {...props}
  >
    <CheckboxPrimitive.Indicator>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
```

### 5. Badge Component

**File**: `src/components/ui/badge.tsx`

Small labels for status, priority, or categorization.

**Variants:**
- default
- secondary
- destructive
- outline

**Usage:**

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">High Priority</Badge>
<Badge variant="outline">Outline</Badge>
```

**In Todo App:**

```tsx
// Priority badge
<Badge variant={getPriorityColor(todo.priority)}>
  {todo.priority}
</Badge>

// Stats badge
<Badge variant="secondary">{activeCount} active</Badge>
```

### 6. Dialog Component

**File**: `src/components/ui/dialog.tsx`

Modal dialog built on Radix UI's Dialog primitive.

**Sub-components:**
- `Dialog` - Root component
- `DialogTrigger` - Button to open dialog
- `DialogContent` - Modal content
- `DialogHeader` - Header section
- `DialogTitle` - Title
- `DialogDescription` - Description
- `DialogFooter` - Footer section
- `DialogClose` - Close button

**Features:**
- Focus trap
- Escape key to close
- Click outside to close
- Animated entrance/exit
- Accessible (ARIA)
- Portal rendering

**Usage:**

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**In Todo App:**

The Dialog is used for the "Add with Priority" feature, allowing users to create todos with specific priority levels.

## Radix UI Primitives

Shadcn/ui is built on Radix UI, a low-level UI component library that provides:

### What are Radix UI Primitives?

Radix UI primitives are **unstyled, accessible component primitives** for building high-quality design systems and web applications.

**Key Characteristics:**

1. **Unstyled**: No built-in styling, you style them with CSS/Tailwind
2. **Accessible**: WCAG compliant with ARIA attributes
3. **Composable**: Small, focused components that work together
4. **Typed**: Full TypeScript support
5. **Controlled/Uncontrolled**: Support both patterns

### Radix UI Components Used

#### 1. Checkbox Primitive

```tsx
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

<CheckboxPrimitive.Root>
  <CheckboxPrimitive.Indicator />
</CheckboxPrimitive.Root>
```

**Features:**
- `data-state` attribute for styling
- Keyboard support (Space to toggle)
- Three-state support (checked, unchecked, indeterminate)
- Form integration

#### 2. Dialog Primitive

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog"

<DialogPrimitive.Root>
  <DialogPrimitive.Trigger />
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay />
    <DialogPrimitive.Content>
      <DialogPrimitive.Title />
      <DialogPrimitive.Description />
      <DialogPrimitive.Close />
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
</DialogPrimitive.Root>
```

**Features:**
- Focus management
- Escape key handling
- Click outside handling
- Portal rendering (renders outside DOM hierarchy)
- Scroll locking
- ARIA attributes

#### 3. Slot Primitive

```tsx
import { Slot } from "@radix-ui/react-slot"

// Used in Button component for asChild prop
const Comp = asChild ? Slot : "button"
```

**Purpose:**
Allows components to merge props and ref with child elements, enabling polymorphic components.

### Why Radix UI?

**Before Radix UI:**
```tsx
// You had to build accessibility yourself
<button
  onClick={toggle}
  aria-pressed={isPressed}
  aria-label="Toggle feature"
  onKeyDown={handleKeyDown}
>
  {children}
</button>
```

**With Radix UI:**
```tsx
// Accessibility is built-in
<CheckboxPrimitive.Root
  checked={checked}
  onCheckedChange={onChange}
>
  {children}
</CheckboxPrimitive.Root>
```

### Accessibility Features

Radix UI primitives provide:

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **Screen Reader Support**: Proper ARIA labels and roles
3. **Focus Management**: Focus trap in dialogs, focus restoration
4. **State Communication**: `data-state` attributes for styling based on state
5. **WCAG Compliance**: Meets Web Content Accessibility Guidelines

## Tailwind CSS Integration

Shadcn/ui uses Tailwind CSS for all styling, following a utility-first approach.

### Tailwind Configuration

**File**: `tailwind.config.js`

```js
export default {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```

### CSS Variables Approach

Shadcn/ui uses CSS variables for theming:

**File**: `src/index.css`

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    /* ... dark mode colors */
  }
}
```

**Why HSL Format?**

HSL (Hue, Saturation, Lightness) is used because:
- Easy to adjust lightness for hover states
- Better for creating color variations
- More intuitive than RGB for theming

**Usage:**

```tsx
// In components
className="bg-primary text-primary-foreground hover:bg-primary/90"
```

This compiles to:
```css
background-color: hsl(var(--primary));
color: hsl(var(--primary-foreground));
&:hover {
  background-color: hsl(var(--primary) / 0.9);
}
```

### Utility Function: cn()

**File**: `src/lib/utils.ts`

```tsx
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Purpose:**
- `clsx`: Conditionally join class names
- `twMerge`: Intelligently merge Tailwind classes (resolves conflicts)

**Usage:**

```tsx
cn(
  "base-classes",
  condition && "conditional-classes",
  className // From props
)
```

**Example:**

```tsx
cn(
  "bg-primary text-white",
  "bg-secondary" // This wins, bg-primary is removed
)
// Result: "bg-secondary text-white"
```

### Responsive Design

All components are responsive using Tailwind's breakpoints:

```tsx
className="flex flex-col sm:flex-row"
// Mobile: flex-col
// Small screens and up: flex-row
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Dark Mode Implementation

This application implements dark mode using a custom theme provider.

### Theme Provider

**File**: `src/components/theme-provider.tsx`

```tsx
type Theme = "dark" | "light" | "system"

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  // ...
}
```

### How It Works

1. **Storage**: Theme preference saved to localStorage
2. **Class-based**: Adds `dark` class to `<html>` element
3. **System Support**: Respects OS color scheme preference
4. **CSS Variables**: Dark mode uses different CSS variable values

### Using Dark Mode

**Setup in main.tsx:**

```tsx
import { ThemeProvider } from './components/theme-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="light">
    <App />
  </ThemeProvider>
)
```

**Toggle Theme:**

```tsx
import { useTheme } from '@/components/theme-provider'

function App() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button onClick={toggleTheme}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
```

### Styling for Dark Mode

**In CSS:**

```css
:root {
  --background: 0 0% 100%; /* white */
}

.dark {
  --background: 222.2 84% 4.9%; /* dark blue-gray */
}
```

**In Components:**

```tsx
className="bg-background text-foreground"
// Automatically uses correct colors for light/dark mode
```

## State Management with Zustand

This application uses Zustand for state management - a small, fast, and scalable state management solution.

### Why Zustand?

**Advantages:**
- Small bundle size (~1kb)
- Simple API (no boilerplate)
- No Context providers needed
- Middleware support (persist, devtools)
- TypeScript friendly
- Works with React hooks

**vs Redux:**
- No reducers or actions
- No provider setup
- Less boilerplate
- Simpler to learn

**vs Context API:**
- Better performance (no unnecessary re-renders)
- No provider hell
- Easier to use outside components

### Todo Store Implementation

**File**: `src/store/useTodoStore.ts`

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',

      addTodo: (text: string, priority?: Todo['priority']) => {
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          text,
          completed: false,
          createdAt: Date.now(),
          priority,
        }
        set((state) => ({
          todos: [...state.todos, newTodo],
        }))
      },

      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed }
              : todo
          ),
        }))
      },

      // ... more actions
    }),
    {
      name: 'todo-storage', // localStorage key
    }
  )
)
```

### Using the Store

**In Components:**

```tsx
import { useTodoStore } from '@/store/useTodoStore'

function TodoList() {
  // Select only needed state (prevents unnecessary re-renders)
  const todos = useTodoStore((state) => state.todos)
  const addTodo = useTodoStore((state) => state.addTodo)

  // Or select multiple
  const { filter, setFilter } = useTodoStore()

  return (
    // ...
  )
}
```

### Persist Middleware

The `persist` middleware:
- Saves state to localStorage
- Restores state on page reload
- Configurable storage key
- Works with session storage too

**Benefits:**
- No need to manually save/load
- Automatic persistence
- Type-safe

### Store Structure

```typescript
interface TodoStore {
  // State
  todos: Todo[]
  filter: FilterType

  // Actions (mutations)
  addTodo: (text: string, priority?: Todo['priority']) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, text: string) => void
  setFilter: (filter: FilterType) => void
  clearCompleted: () => void

  // Computed/Derived state
  filteredTodos: () => Todo[]
}
```

## Component Architecture

### Todo Input Component

**File**: `src/components/todo/todo-input.tsx`

Handles todo creation with two modes:

1. **Quick Add**: Simple input + button
2. **Advanced Add**: Dialog with priority selection

```tsx
export function TodoInput() {
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState<Todo['priority']>('medium')
  const addTodo = useTodoStore((state) => state.addTodo)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      addTodo(inputValue.trim(), priority)
      setInputValue('')
    }
  }

  return (
    <div>
      {/* Quick add form */}
      <form onSubmit={handleQuickAdd}>
        <Input value={inputValue} onChange={...} />
        <Button type="submit"><Plus /></Button>
      </form>

      {/* Advanced dialog */}
      <Dialog>
        <DialogTrigger>Add with Priority</DialogTrigger>
        <DialogContent>
          {/* Priority selection with badges */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

**Key Features:**
- Two input methods for flexibility
- Form validation
- Priority selection with visual badges
- Keyboard shortcuts (Enter to submit, Escape to cancel)

### Todo Item Component

**File**: `src/components/todo/todo-item.tsx`

Displays and manages individual todo items.

```tsx
export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const { toggleTodo, deleteTodo, editTodo } = useTodoStore()

  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-lg border',
      todo.completed && 'opacity-60'
    )}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => toggleTodo(todo.id)}
      />

      {isEditing ? (
        <Input value={editText} onChange={...} />
      ) : (
        <div>
          <p className={todo.completed && 'line-through'}>
            {todo.text}
          </p>
          {todo.priority && (
            <Badge variant={getPriorityColor(todo.priority)}>
              {todo.priority}
            </Badge>
          )}
        </div>
      )}

      <Button onClick={() => setIsEditing(true)}>
        <Edit2 />
      </Button>
      <Button onClick={() => deleteTodo(todo.id)}>
        <Trash2 />
      </Button>
    </div>
  )
}
```

**Key Features:**
- Inline editing
- Visual completion state (strikethrough, opacity)
- Priority badges with color coding
- Delete confirmation
- Keyboard support (Enter to save, Escape to cancel)

### Todo List Component

**File**: `src/components/todo/todo-list.tsx`

Manages the list view with filtering.

```tsx
export function TodoList() {
  const {
    todos,
    filter,
    setFilter,
    clearCompleted,
    filteredTodos
  } = useTodoStore()

  const displayTodos = filteredTodos()
  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <div>
      {/* Filter buttons */}
      <div>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        {/* Active, Completed buttons */}
      </div>

      {/* Todo items */}
      {displayTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}

      {/* Stats */}
      <div>
        Total: {todos.length} •
        {activeCount} active •
        {completedCount} completed
      </div>
    </div>
  )
}
```

**Key Features:**
- Three filter modes (all, active, completed)
- Empty state messages
- Statistics display
- Clear completed functionality

## Customization Guide

One of Shadcn/ui's biggest advantages is complete customization freedom.

### Customizing Colors

**1. Update CSS Variables:**

Edit `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Blue */
}

/* Change to green */
:root {
  --primary: 142 76% 36%; /* Green */
}
```

**2. Using HSL Color Picker:**

Tools like https://hslpicker.com help you find HSL values.

**3. Update Dark Mode Colors:**

```css
.dark {
  --primary: 142 76% 45%; /* Lighter green for dark mode */
}
```

### Customizing Component Styles

Since you own the code, you can modify any component:

**Example: Make buttons more rounded**

Edit `src/components/ui/button.tsx`:

```tsx
// Change
"rounded-md"

// To
"rounded-full"
```

### Adding New Variants

**Example: Add an "info" badge variant**

Edit `src/components/ui/badge.tsx`:

```tsx
const badgeVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "...",
        secondary: "...",
        destructive: "...",
        outline: "...",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600", // NEW
      },
    },
  }
)
```

Usage:

```tsx
<Badge variant="info">Info</Badge>
```

### Customizing Animations

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    keyframes: {
      "slide-in": {
        from: { transform: "translateX(-100%)" },
        to: { transform: "translateX(0)" },
      },
    },
    animation: {
      "slide-in": "slide-in 0.3s ease-out",
    },
  },
}
```

Usage:

```tsx
<div className="animate-slide-in">
  Content
</div>
```

### Customizing Border Radius

Globally change all border radius:

```css
:root {
  --radius: 0.5rem; /* Default */
}

/* Make everything more rounded */
:root {
  --radius: 1rem;
}

/* Make everything sharp */
:root {
  --radius: 0;
}
```

## Comparison with Other UI Libraries

### Shadcn/ui vs Material-UI (MUI)

| Feature | Shadcn/ui | Material-UI |
|---------|-----------|-------------|
| **Installation** | Copy components | npm install |
| **Bundle Size** | Small (only what you use) | Large (~350KB) |
| **Customization** | Full control (owns code) | Theme config + overrides |
| **Design System** | Your own | Material Design |
| **Learning Curve** | Moderate | Moderate-High |
| **TypeScript** | Full support | Full support |
| **Accessibility** | Radix UI primitives | Built-in |
| **Components** | Copy what you need | 60+ components |
| **Styling** | Tailwind CSS | Emotion/styled-components |
| **Updates** | Manual copy | npm update |
| **Vendor Lock-in** | None | High |

**When to use Shadcn/ui:**
- You want full control over component code
- You prefer Tailwind CSS
- You want smaller bundle sizes
- You need custom design (not Material Design)

**When to use Material-UI:**
- You want Material Design
- You need many pre-built components
- You prefer all-in-one solution
- Team familiar with MUI

### Shadcn/ui vs Ant Design

| Feature | Shadcn/ui | Ant Design |
|---------|-----------|------------|
| **Philosophy** | Copy-paste components | Component library |
| **Bundle Size** | Small | Medium-Large |
| **Design** | Customizable | Ant Design System |
| **Components** | ~40 components | 60+ components |
| **Backend Integration** | DIY | Form/Table helpers |
| **Internationalization** | DIY | Built-in |
| **Icons** | Lucide React | Ant Design Icons |
| **Styling** | Tailwind | Less/CSS-in-JS |

**When to use Shadcn/ui:**
- You want Tailwind CSS
- You need custom design
- You prefer minimal bundle size
- You want component ownership

**When to use Ant Design:**
- Building admin dashboards
- Need complex data tables
- Want form helpers
- Enterprise applications

### Shadcn/ui vs Chakra UI

| Feature | Shadcn/ui | Chakra UI |
|---------|-----------|-----------|
| **Architecture** | Copy-paste | npm package |
| **Styling** | Tailwind | Styled-system |
| **Accessibility** | Radix UI | Built-in |
| **Dark Mode** | CSS variables + class | Color mode script |
| **Customization** | Edit source | Theme config |
| **Composition** | Manual | Props-based |
| **Bundle Size** | Smaller | Larger |

**When to use Shadcn/ui:**
- Prefer Tailwind CSS
- Want component ownership
- Need smaller bundles
- Fine-grained customization

**When to use Chakra UI:**
- Like props-based styling
- Want quick prototyping
- Prefer complete package
- Need comprehensive docs

## Code Examples

### Example 1: Creating a Custom Alert Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the todo item.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Example 2: Form with Validation

```tsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function TodoForm() {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      setError('Todo text is required')
      return
    }

    if (text.length < 3) {
      setError('Todo must be at least 3 characters')
      return
    }

    // Add todo
    addTodo(text)
    setText('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setError('')
        }}
        placeholder="Enter todo..."
        className={error && 'border-destructive'}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit">Add Todo</Button>
    </form>
  )
}
```

### Example 3: Loading States

```tsx
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

function SaveButton({ isSaving }: { isSaving: boolean }) {
  return (
    <Button disabled={isSaving}>
      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSaving ? 'Saving...' : 'Save'}
    </Button>
  )
}
```

### Example 4: Dropdown Menu

First, add the dropdown component:

```bash
npx shadcn-ui@latest add dropdown-menu
```

Then use it:

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

function TodoItemMenu({ todo }: { todo: Todo }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => editTodo(todo.id)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => duplicateTodo(todo.id)}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => deleteTodo(todo.id)}
          className="text-destructive"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Best Practices

### 1. Component Organization

**DO:**
```tsx
// Keep UI components in ui/ folder
src/components/ui/button.tsx
src/components/ui/input.tsx

// Keep feature components in feature folders
src/components/todo/todo-item.tsx
src/components/todo/todo-list.tsx
```

**DON'T:**
```tsx
// Mix UI and feature components
src/components/button.tsx
src/components/todo-item.tsx
```

### 2. Import Paths

Use path aliases:

```tsx
// Good
import { Button } from '@/components/ui/button'
import { useTodoStore } from '@/store/useTodoStore'

// Bad
import { Button } from '../../components/ui/button'
import { useTodoStore } from '../../store/useTodoStore'
```

### 3. Component Composition

**DO:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

**DON'T:**
```tsx
<Card title="Title">
  Content
</Card>
```

Composition gives you more flexibility.

### 4. Styling

**DO:**
```tsx
<Button className="mt-4">Click</Button>
```

**DON'T:**
```tsx
<Button style={{ marginTop: '16px' }}>Click</Button>
```

Use Tailwind classes, not inline styles.

### 5. State Management

**DO:**
```tsx
// Select only what you need
const addTodo = useTodoStore((state) => state.addTodo)
```

**DON'T:**
```tsx
// Selecting entire store causes unnecessary re-renders
const store = useTodoStore()
```

### 6. TypeScript

**DO:**
```tsx
interface TodoItemProps {
  todo: Todo
}

function TodoItem({ todo }: TodoItemProps) {
  // ...
}
```

**DON'T:**
```tsx
function TodoItem({ todo }: any) {
  // ...
}
```

Always type your props.

### 7. Accessibility

**DO:**
```tsx
<Button>
  <Trash2 className="h-4 w-4" />
  <span className="sr-only">Delete</span>
</Button>
```

**DON'T:**
```tsx
<Button>
  <Trash2 />
</Button>
```

Provide accessible labels for icon-only buttons.

## Performance Considerations

### 1. Bundle Size

Shadcn/ui has excellent bundle size because:
- You only copy components you use
- Tree-shaking removes unused Radix UI primitives
- Tailwind purges unused styles

**Typical bundle sizes:**
- Button: ~2KB
- Input: ~1KB
- Dialog: ~8KB (includes Radix Dialog)
- Checkbox: ~5KB (includes Radix Checkbox)

### 2. Re-render Optimization

**Zustand selector pattern:**

```tsx
// Good - only re-renders when todos change
const todos = useTodoStore((state) => state.todos)

// Good - only re-renders when addTodo changes (never)
const addTodo = useTodoStore((state) => state.addTodo)

// Bad - re-renders on any state change
const store = useTodoStore()
```

### 3. Lazy Loading

For larger apps, lazy load routes:

```tsx
import { lazy, Suspense } from 'react'

const TodoPage = lazy(() => import('./pages/TodoPage'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodoPage />
    </Suspense>
  )
}
```

### 4. Memoization

Use React.memo for expensive components:

```tsx
import { memo } from 'react'

export const TodoItem = memo(function TodoItem({ todo }: TodoItemProps) {
  // Only re-renders when todo changes
  return (
    // ...
  )
})
```

## Accessibility

Shadcn/ui components are built with accessibility in mind.

### Keyboard Navigation

- **Tab**: Focus next element
- **Shift+Tab**: Focus previous element
- **Enter/Space**: Activate buttons, checkboxes
- **Escape**: Close dialogs
- **Arrow keys**: Navigate menus (when added)

### Screen Reader Support

All interactive elements have proper ARIA attributes:

```tsx
// Button with icon
<Button>
  <Trash2 className="h-4 w-4" />
  <span className="sr-only">Delete</span>
</Button>

// Checkbox
<Checkbox aria-label="Mark todo as complete" />

// Dialog
<Dialog>
  <DialogTitle>Title</DialogTitle> {/* aria-labelledby */}
  <DialogDescription>Description</DialogDescription> {/* aria-describedby */}
</Dialog>
```

### Color Contrast

Shadcn/ui default colors meet WCAG AA standards:
- Text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio

### Focus Management

- Visible focus rings
- Focus trap in dialogs
- Focus restoration after dialog close

## Troubleshooting

### Issue: Styles not applying

**Problem:** Tailwind classes not working

**Solutions:**
1. Check `tailwind.config.js` content paths
2. Verify `@tailwind` directives in `index.css`
3. Restart dev server

### Issue: Type errors with Radix UI

**Problem:** TypeScript errors with Radix components

**Solutions:**
1. Check `@radix-ui/*` versions match
2. Update `@types/react` and `@types/react-dom`
3. Clear TypeScript cache: `rm -rf node_modules/.cache`

### Issue: Dark mode not working

**Problem:** Dark mode toggle doesn't change colors

**Solutions:**
1. Verify `darkMode: ["class"]` in `tailwind.config.js`
2. Check CSS variables defined for `.dark`
3. Ensure ThemeProvider wraps app

### Issue: Components not found

**Problem:** Import errors for components

**Solutions:**
1. Check path alias in `tsconfig.json`
2. Verify file exists at `src/components/ui/[component].tsx`
3. Restart TypeScript server in editor

## Further Resources

### Official Documentation

- [Shadcn/ui](https://ui.shadcn.com) - Official documentation
- [Radix UI](https://www.radix-ui.com) - Primitive components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Zustand](https://docs.pmnd.rs/zustand) - State management

### Component Gallery

- [Shadcn/ui Components](https://ui.shadcn.com/docs/components) - All available components
- [Radix UI Primitives](https://www.radix-ui.com/primitives) - Primitive documentation

### Learning Resources

- [Tailwind CSS Tutorial](https://tailwindcss.com/docs) - Learn Tailwind
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [React Documentation](https://react.dev) - React fundamentals

### Tools

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code extension
- [Realtime Colors](https://realtimecolors.com) - Color scheme generator
- [HSL Color Picker](https://hslpicker.com) - HSL color tool

### Community

- [Shadcn/ui GitHub](https://github.com/shadcn-ui/ui) - Source code & issues
- [Shadcn/ui Discord](https://discord.gg/shadcn-ui) - Community support
- [Radix UI Discord](https://discord.gg/radix-ui) - Radix community

## Conclusion

This Todo application demonstrates the power of Shadcn/ui's copy-paste architecture. You have complete control over every component, from the Button to the Dialog, while still benefiting from:

- Accessible Radix UI primitives
- Beautiful Tailwind CSS styling
- Type-safe TypeScript
- Flexible customization
- Small bundle sizes

The key advantage is **ownership** - you own the code, you can modify anything, and you're not locked into a library. This makes Shadcn/ui perfect for projects that need custom design systems while maintaining high quality and accessibility.

Happy coding!
