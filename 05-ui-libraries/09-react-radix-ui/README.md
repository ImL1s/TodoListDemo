# React + Radix UI Todo List

A comprehensive Todo List application built with React and Radix UI primitives, demonstrating the power of unstyled, accessible component libraries.

## Table of Contents

1. [Overview](#overview)
2. [Radix UI Philosophy](#radix-ui-philosophy)
3. [Project Features](#project-features)
4. [Radix UI Primitives Used](#radix-ui-primitives-used)
5. [Accessibility Features](#accessibility-features)
6. [Installation & Setup](#installation--setup)
7. [Project Structure](#project-structure)
8. [Component Architecture](#component-architecture)
9. [Styling Approaches](#styling-approaches)
10. [Radix vs Other Libraries](#radix-vs-other-libraries)
11. [Code Examples](#code-examples)
12. [Best Practices](#best-practices)
13. [Advanced Patterns](#advanced-patterns)
14. [Performance Considerations](#performance-considerations)
15. [Testing Strategies](#testing-strategies)
16. [Further Resources](#further-resources)

## Overview

This project demonstrates how to build a fully-functional, accessible Todo List application using **Radix UI primitives** - a collection of unstyled, accessible components that give you complete control over styling while ensuring best-in-class accessibility.

### Why Radix UI?

Radix UI provides:
- **Unstyled primitives** - Full control over styling
- **WAI-ARIA compliant** - Built-in accessibility
- **Keyboard navigation** - Complete keyboard support
- **Focus management** - Intelligent focus handling
- **Portal support** - Overlay rendering
- **Composable APIs** - Build complex components
- **TypeScript support** - Full type safety

## Radix UI Philosophy

### The Unstyled Approach

Unlike traditional component libraries (Material-UI, Ant Design, Chakra UI) that come with pre-built styles, Radix UI takes a fundamentally different approach:

```typescript
// Traditional styled library
<Button variant="primary" size="large">
  Click me
</Button>

// Radix UI approach
<Button.Root className={styles.myCustomButton}>
  Click me
</Button.Root>
```

**Key Principles:**

1. **Separation of Concerns**
   - Behavior and accessibility are handled by Radix
   - Styling is entirely your responsibility
   - No style conflicts or override battles

2. **Primitive Components**
   - Low-level building blocks
   - Compose into higher-level components
   - Maximum flexibility

3. **Accessibility First**
   - ARIA attributes automatically applied
   - Keyboard navigation built-in
   - Focus management included
   - Screen reader support

4. **Headless UI Pattern**
   - Logic without presentation
   - Bring your own styles
   - Framework agnostic (React-focused)

### Comparison: Styled vs Unstyled Libraries

| Feature | Styled Libraries | Radix UI (Unstyled) |
|---------|------------------|---------------------|
| **Setup Time** | Fast (pre-built) | Moderate (style yourself) |
| **Customization** | Limited by theme API | Complete control |
| **Bundle Size** | Larger (includes CSS) | Smaller (no CSS) |
| **Learning Curve** | Learn component API | Learn primitives + styling |
| **Consistency** | Built-in design system | You define it |
| **Flexibility** | Constrained by library | Unlimited |
| **Accessibility** | Varies by library | Excellent (built-in) |

### When to Use Radix UI

**Best For:**
- Custom design systems
- Unique brand requirements
- Performance-critical applications
- Accessibility requirements
- Full styling control needed

**Consider Alternatives When:**
- Rapid prototyping needed
- Standard UI patterns sufficient
- Team prefers opinionated styling
- Limited design resources

## Project Features

### Core Functionality

- **Create** todos with text input
- **Read** todos with filtering options
- **Update** todo completion status and text
- **Delete** todos with confirmation dialog
- **Filter** by all/active/completed
- **Persist** data in localStorage
- **Statistics** showing active/completed counts

### Radix UI Primitives

This project demonstrates four key Radix primitives:

1. **Checkbox** - Todo completion toggle
2. **Dialog** - Delete confirmation modal
3. **DropdownMenu** - Filter selection
4. **Tooltip** - Action hints

## Radix UI Primitives Used

### 1. Checkbox Primitive

The `@radix-ui/react-checkbox` provides an accessible checkbox component.

**Features:**
- Automatic ARIA attributes
- Keyboard support (Space to toggle)
- Indeterminate state support
- Customizable indicator

**Basic Usage:**

```tsx
import * as Checkbox from '@radix-ui/react-checkbox';

<Checkbox.Root
  checked={isChecked}
  onCheckedChange={setIsChecked}
  className={styles.checkboxRoot}
>
  <Checkbox.Indicator className={styles.checkboxIndicator}>
    ✓
  </Checkbox.Indicator>
</Checkbox.Root>
```

**In This Project:**

The checkbox is used in `TodoItem.tsx` for toggling completion:

```tsx
<Checkbox.Root
  className={styles.checkboxRoot}
  id={`todo-${todo.id}`}
  checked={todo.completed}
  onCheckedChange={() => toggleTodo(todo.id)}
  aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
>
  <Checkbox.Indicator className={styles.checkboxIndicator}>
    <svg>...</svg>
  </Checkbox.Indicator>
</Checkbox.Root>
```

**Accessibility Features:**
- `role="checkbox"`
- `aria-checked` state
- Keyboard navigation (Tab, Space)
- Custom accessible label

**Styling:**

```css
.checkboxRoot {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  background: var(--color-white);
}

.checkboxRoot[data-state='checked'] {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
```

### 2. Dialog Primitive

The `@radix-ui/react-dialog` provides accessible modal dialogs.

**Features:**
- Portal rendering (overlays page)
- Focus trap (keeps focus inside)
- ESC key to close
- Click outside to dismiss
- Scroll lock on body
- ARIA attributes

**Basic Usage:**

```tsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Trigger asChild>
    <button>Open Dialog</button>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay className={styles.overlay} />
    <Dialog.Content className={styles.content}>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close asChild>
        <button>Close</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**In This Project:**

Used in `DeleteDialog.tsx` for delete confirmation:

```tsx
<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay className={styles.dialogOverlay} />
    <Dialog.Content className={styles.dialogContent}>
      <Dialog.Title className={styles.dialogTitle}>
        Delete Todo
      </Dialog.Title>
      <Dialog.Description className={styles.dialogDescription}>
        Are you sure you want to delete this todo?
      </Dialog.Description>

      <div className={styles.dialogTodoPreview}>
        "{todoText}"
      </div>

      <div className={styles.dialogActions}>
        <Dialog.Close asChild>
          <button>Cancel</button>
        </Dialog.Close>
        <button onClick={handleConfirm}>Delete</button>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**Accessibility Features:**
- `role="dialog"`
- `aria-labelledby` (title)
- `aria-describedby` (description)
- Focus trap
- ESC to close
- Return focus on close

**Key Props:**
- `open` - Control visibility
- `onOpenChange` - Handle open state
- `modal` - Enable modal behavior (default: true)

### 3. DropdownMenu Primitive

The `@radix-ui/react-dropdown-menu` provides accessible dropdown menus.

**Features:**
- Keyboard navigation (Arrow keys)
- Type-ahead search
- Sub-menus support
- Radio/checkbox groups
- Custom positioning
- Portal rendering

**Basic Usage:**

```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <button>Options ▼</button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item onSelect={() => console.log('Edit')}>
        Edit
      </DropdownMenu.Item>
      <DropdownMenu.Item onSelect={() => console.log('Delete')}>
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

**In This Project:**

Used in `TodoFilters.tsx` for filter selection:

```tsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <button className={styles.filterButton}>
      Show: {filterLabels[filter]}
    </button>
  </DropdownMenu.Trigger>

  <DropdownMenu.Portal>
    <DropdownMenu.Content
      className={styles.dropdownContent}
      sideOffset={5}
      align="end"
    >
      <DropdownMenu.Label>Filter Todos</DropdownMenu.Label>
      <DropdownMenu.Separator />

      <DropdownMenu.RadioGroup value={filter} onValueChange={setFilter}>
        <DropdownMenu.RadioItem value="all">
          <DropdownMenu.ItemIndicator>✓</DropdownMenu.ItemIndicator>
          All Todos
        </DropdownMenu.RadioItem>

        <DropdownMenu.RadioItem value="active">
          <DropdownMenu.ItemIndicator>✓</DropdownMenu.ItemIndicator>
          Active
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>

      <DropdownMenu.Separator />
      <DropdownMenu.Item onSelect={clearCompleted}>
        Clear Completed
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

**Accessibility Features:**
- `role="menu"`
- `role="menuitem"`
- `role="menuitemradio"` (for radio items)
- Arrow key navigation
- ESC to close
- Enter/Space to select

**Advanced Features:**

```tsx
// Positioning
<DropdownMenu.Content
  side="bottom"          // top|right|bottom|left
  align="start"          // start|center|end
  sideOffset={5}         // Distance from trigger
  alignOffset={0}        // Offset from alignment
>

// Sub-menus
<DropdownMenu.Sub>
  <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
  <DropdownMenu.SubContent>
    <DropdownMenu.Item>Sub item</DropdownMenu.Item>
  </DropdownMenu.SubContent>
</DropdownMenu.Sub>

// Disabled items
<DropdownMenu.Item disabled>
  Disabled Item
</DropdownMenu.Item>
```

### 4. Tooltip Primitive

The `@radix-ui/react-tooltip` provides accessible tooltips.

**Features:**
- Hover and focus triggers
- Customizable delay
- Portal rendering
- Arrow support
- Positioning options
- Keyboard accessible

**Basic Usage:**

```tsx
import * as Tooltip from '@radix-ui/react-tooltip';

<Tooltip.Provider delayDuration={300}>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <button>Hover me</button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content className={styles.tooltipContent}>
        Tooltip text
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

**In This Project:**

Used in `TodoItem.tsx` for action buttons:

```tsx
<Tooltip.Provider delayDuration={300}>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <button
        className={styles.iconButton}
        onClick={handleEdit}
        aria-label="Edit todo"
      >
        ✎
      </button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        className={styles.tooltipContent}
        sideOffset={5}
      >
        Edit (double-click)
        <Tooltip.Arrow className={styles.tooltipArrow} />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

**Accessibility Features:**
- `aria-describedby` on trigger
- Keyboard navigation (focus shows tooltip)
- ESC to dismiss
- Respects user motion preferences

**Configuration:**

```tsx
// Provider-level settings
<Tooltip.Provider
  delayDuration={300}      // Delay before showing
  skipDelayDuration={100}  // Delay when moving between tooltips
  disableHoverableContent={false}  // Allow hovering tooltip
>

// Per-tooltip settings
<Tooltip.Root
  open={isOpen}            // Control visibility
  onOpenChange={setIsOpen} // Handle state changes
  delayDuration={500}      // Override provider delay
>
```

## Accessibility Features

Radix UI primitives are built with accessibility as a first-class concern. This project demonstrates comprehensive accessibility features.

### WAI-ARIA Compliance

All components follow WAI-ARIA authoring practices:

**Checkbox:**
```tsx
// Automatic ARIA attributes
<Checkbox.Root>
  {/* Renders with: */}
  {/* role="checkbox" */}
  {/* aria-checked="true|false|mixed" */}
  {/* tabindex="0" */}
</Checkbox.Root>
```

**Dialog:**
```tsx
// Automatic dialog ARIA
<Dialog.Content>
  {/* Renders with: */}
  {/* role="dialog" */}
  {/* aria-labelledby="[Dialog.Title id]" */}
  {/* aria-describedby="[Dialog.Description id]" */}
  {/* aria-modal="true" */}
</Dialog.Content>
```

**DropdownMenu:**
```tsx
// Menu ARIA attributes
<DropdownMenu.Content>
  {/* role="menu" */}
  <DropdownMenu.Item>
    {/* role="menuitem" */}
  </DropdownMenu.Item>
  <DropdownMenu.RadioItem>
    {/* role="menuitemradio" */}
    {/* aria-checked="true|false" */}
  </DropdownMenu.RadioItem>
</DropdownMenu.Content>
```

### Keyboard Navigation

Complete keyboard support throughout:

| Component | Key Bindings |
|-----------|-------------|
| **Checkbox** | `Tab` - Focus<br>`Space` - Toggle |
| **Dialog** | `Esc` - Close<br>`Tab` - Navigate within |
| **DropdownMenu** | `Enter/Space` - Open<br>`↑/↓` - Navigate items<br>`Esc` - Close<br>`Enter` - Select |
| **Tooltip** | Focus trigger - Show<br>`Esc` - Hide |
| **Todo Input** | `Enter` - Submit |
| **Todo Item** | `Enter` - Save edit<br>`Esc` - Cancel edit |

### Focus Management

Radix handles complex focus scenarios:

1. **Focus Trap (Dialog)**
   ```tsx
   // Focus trapped inside dialog
   // Tab cycles through focusable elements
   // Return focus to trigger on close
   <Dialog.Content>
     {/* Focus automatically moves to first focusable element */}
   </Dialog.Content>
   ```

2. **Focus Return**
   ```tsx
   // After closing dropdown, focus returns to trigger
   <DropdownMenu.Trigger>
     {/* Focus comes back here */}
   </DropdownMenu.Trigger>
   ```

3. **Initial Focus**
   ```tsx
   // Auto-focus first input on mount
   <input autoFocus />
   ```

### Screen Reader Support

Enhanced screen reader experience:

```tsx
// Descriptive labels
<Checkbox.Root
  aria-label={`Mark "${todo.text}" as ${
    todo.completed ? 'incomplete' : 'complete'
  }`}
>

// Hidden labels for visual-only elements
<label htmlFor="todo-input" className={styles.visuallyHidden}>
  New todo
</label>

// Semantic HTML
<div role="list">
  {todos.map(todo => (
    <div role="listitem" key={todo.id}>
      {/* Todo content */}
    </div>
  ))}
</div>
```

### Visual Indicators

Accessible visual feedback:

```css
/* Focus indicators */
.checkboxRoot:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

/* Hover states */
.iconButton:hover {
  background: var(--color-primary-light);
}

/* Disabled states */
.addButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Color Contrast

WCAG AA compliant colors:

```css
:root {
  /* High contrast text */
  --color-text: #1f2937;        /* 4.5:1 on white */
  --color-text-muted: #6b7280;  /* 4.5:1 on white */

  /* Accessible buttons */
  --color-primary: #6366f1;
  --color-danger: #ef4444;
}
```

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- Basic React knowledge
- Understanding of TypeScript (optional but recommended)

### Quick Start

```bash
# Clone or navigate to the project directory
cd 05-ui-libraries/09-react-radix-ui

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3009
```

### Development Scripts

```bash
# Start dev server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Project Dependencies

**Core Dependencies:**

```json
{
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-tooltip": "^1.0.7",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

**Dev Dependencies:**

```json
{
  "@vitejs/plugin-react": "^4.2.1",
  "typescript": "^5.2.2",
  "vite": "^5.0.8"
}
```

## Project Structure

```
09-react-radix-ui/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx         # Input for new todos
│   │   ├── TodoItem.tsx          # Individual todo (Checkbox, Tooltip)
│   │   ├── TodoList.tsx          # List container
│   │   ├── TodoFilters.tsx       # Filter dropdown (DropdownMenu)
│   │   └── DeleteDialog.tsx      # Delete confirmation (Dialog)
│   ├── context/
│   │   └── TodoContext.tsx       # Global state management
│   ├── styles/
│   │   └── App.module.css        # All component styles
│   ├── types.ts                  # TypeScript interfaces
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
└── README.md                     # This file
```

### File Breakdown

**Component Files:**

- `TodoInput.tsx` (47 lines) - Form input with validation
- `TodoItem.tsx` (171 lines) - Complex item with multiple primitives
- `TodoList.tsx` (60 lines) - Filtered list rendering
- `TodoFilters.tsx` (87 lines) - Dropdown menu with stats
- `DeleteDialog.tsx` (64 lines) - Confirmation modal

**Core Files:**

- `TodoContext.tsx` (101 lines) - Context API state management
- `types.ts` (32 lines) - TypeScript definitions
- `App.tsx` (51 lines) - Root component layout
- `App.module.css` (596 lines) - Comprehensive styling

## Component Architecture

### State Management: Context API

This project uses React Context API for state management:

```tsx
// Context definition
interface TodoContextType {
  todos: Todo[];
  filter: FilterType;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
}

// Provider implementation
export const TodoProvider: React.FC = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<FilterType>('all');

  // Operations...

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook for consuming context
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
};
```

**Why Context API?**

- Simple and built-in (no extra dependencies)
- Perfect for small to medium apps
- Easy to understand
- Good for this demo size

**Alternative: Zustand** (optional pattern)

For larger apps, consider Zustand:

```tsx
import create from 'zustand';

interface TodoStore {
  todos: Todo[];
  filter: FilterType;
  addTodo: (text: string) => void;
  // ...
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  filter: 'all',
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, createTodo(text)]
  })),
  // ...
}));

// Usage
const addTodo = useTodoStore((state) => state.addTodo);
```

### Data Persistence

LocalStorage integration:

```tsx
const STORAGE_KEY = 'radix-ui-todos';

// Load on mount
const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load todos:', error);
    return [];
  }
};

// Save on change
useEffect(() => {
  saveTodos(todos);
}, [todos]);

const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos:', error);
  }
};
```

### Component Composition

Radix primitives enable powerful composition:

```tsx
// TodoItem composes multiple primitives
<TodoItem>
  <Checkbox>           {/* Completion toggle */}
  <Tooltip>            {/* Edit button hint */}
  <Tooltip>            {/* Delete button hint */}
  <DeleteDialog>       {/* Confirmation modal */}
</TodoItem>

// Each primitive is independently styled
<Checkbox.Root className={styles.checkboxRoot}>
  <Checkbox.Indicator className={styles.checkboxIndicator}>
    {/* Custom SVG icon */}
  </Checkbox.Indicator>
</Checkbox.Root>
```

## Styling Approaches

Radix UI is completely unstyled, giving you multiple styling options.

### 1. CSS Modules (This Project)

**Pros:**
- Scoped styles (no conflicts)
- Standard CSS syntax
- Good TypeScript support
- Small bundle size

**Implementation:**

```tsx
// Component
import styles from './App.module.css';

<div className={styles.container}>
  <Checkbox.Root className={styles.checkboxRoot}>
    <Checkbox.Indicator className={styles.checkboxIndicator}>
      ✓
    </Checkbox.Indicator>
  </Checkbox.Root>
</div>
```

```css
/* App.module.css */
.checkboxRoot {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--color-border);
}

.checkboxRoot[data-state='checked'] {
  background: var(--color-primary);
}
```

### 2. Styled Components

**Pros:**
- CSS-in-JS
- Dynamic styling
- Theme support
- Component-scoped

**Implementation:**

```tsx
import styled from 'styled-components';
import * as Checkbox from '@radix-ui/react-checkbox';

const StyledCheckboxRoot = styled(Checkbox.Root)`
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid ${props => props.theme.colors.border};

  &[data-state='checked'] {
    background: ${props => props.theme.colors.primary};
  }
`;

const StyledCheckboxIndicator = styled(Checkbox.Indicator)`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Usage
<StyledCheckboxRoot>
  <StyledCheckboxIndicator>✓</StyledCheckboxIndicator>
</StyledCheckboxRoot>
```

### 3. Tailwind CSS

**Pros:**
- Utility-first
- Rapid development
- Consistent spacing
- Excellent with Radix

**Implementation:**

```tsx
import * as Checkbox from '@radix-ui/react-checkbox';

<Checkbox.Root className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600">
  <Checkbox.Indicator className="text-white">
    <CheckIcon />
  </Checkbox.Indicator>
</Checkbox.Root>
```

**Tailwind Config for Radix:**

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-4px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        slideDownAndFade: 'slideDownAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
```

### 4. Emotion

**Pros:**
- CSS-in-JS
- Excellent performance
- Framework agnostic
- Source maps

**Implementation:**

```tsx
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import * as Checkbox from '@radix-ui/react-checkbox';

const checkboxStyles = css`
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--color-border);

  &[data-state='checked'] {
    background: var(--color-primary);
  }
`;

<Checkbox.Root css={checkboxStyles}>
  <Checkbox.Indicator>✓</Checkbox.Indicator>
</Checkbox.Root>
```

### 5. Vanilla Extract

**Pros:**
- Zero-runtime CSS-in-TS
- Type-safe styles
- Build-time extraction
- Great performance

**Implementation:**

```tsx
// styles.css.ts
import { style } from '@vanilla-extract/css';

export const checkboxRoot = style({
  width: '1.5rem',
  height: '1.5rem',
  border: '2px solid var(--color-border)',

  selectors: {
    '&[data-state="checked"]': {
      background: 'var(--color-primary)',
    },
  },
});

// Component
import * as styles from './styles.css';

<Checkbox.Root className={styles.checkboxRoot}>
  <Checkbox.Indicator>✓</Checkbox.Indicator>
</Checkbox.Root>
```

### Styling Comparison Table

| Approach | Runtime | Type Safety | Learning Curve | Bundle Size |
|----------|---------|-------------|----------------|-------------|
| CSS Modules | None | Good | Low | Small |
| Styled Components | Yes | Excellent | Medium | Medium |
| Tailwind | None | None | Low-Medium | Small (with purge) |
| Emotion | Yes | Excellent | Medium | Medium |
| Vanilla Extract | None | Excellent | Medium-High | Small |

## Radix vs Other Libraries

### Radix UI vs Headless UI

| Feature | Radix UI | Headless UI |
|---------|----------|-------------|
| **Framework** | React | React, Vue |
| **Primitives** | 30+ components | 10+ components |
| **Portals** | Built-in | Manual |
| **API Style** | Dot notation | Single component |
| **TypeScript** | Excellent | Excellent |
| **Bundle Size** | Smaller (tree-shakeable) | Small |
| **Positioning** | Built-in | External (Popper) |
| **Animation** | CSS (your choice) | CSS (your choice) |

**Radix Example:**
```tsx
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title />
      <Dialog.Description />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**Headless UI Example:**
```tsx
<Dialog open={isOpen} onClose={setIsOpen}>
  <Dialog.Overlay />
  <Dialog.Panel>
    <Dialog.Title />
    <Dialog.Description />
  </Dialog.Panel>
</Dialog>
```

### Radix UI vs React Aria

| Feature | Radix UI | React Aria |
|---------|----------|------------|
| **Approach** | Components | Hooks |
| **Level** | Higher-level | Lower-level |
| **Flexibility** | High | Very High |
| **Complexity** | Lower | Higher |
| **Adobe Spectrum** | Independent | Paired with |
| **Documentation** | Excellent | Excellent |

**Radix Example:**
```tsx
<Checkbox.Root checked={checked} onCheckedChange={setChecked}>
  <Checkbox.Indicator>✓</Checkbox.Indicator>
</Checkbox.Root>
```

**React Aria Example:**
```tsx
function Checkbox(props) {
  const ref = useRef();
  const { inputProps } = useCheckbox(props, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <label>
      <input {...mergeProps(inputProps, focusProps)} ref={ref} />
      <span>✓</span>
    </label>
  );
}
```

### Radix UI vs Material-UI

| Feature | Radix UI | Material-UI |
|---------|----------|-------------|
| **Philosophy** | Unstyled | Styled |
| **Design** | Your choice | Material Design |
| **Customization** | Complete | Theme-based |
| **Bundle Size** | Smaller | Larger |
| **Setup Time** | Longer | Faster |
| **Accessibility** | Excellent | Good |

**When to Choose:**

- **Radix UI**: Custom design, full control, accessibility priority
- **Material-UI**: Rapid prototyping, Material Design, standard UI

### Radix UI vs Chakra UI

| Feature | Radix UI | Chakra UI |
|---------|----------|-----------|
| **Styling** | BYO | Built-in (Emotion) |
| **Theme** | Your choice | Extensive theme API |
| **Components** | Primitives | Full components |
| **Learning Curve** | Moderate | Low |
| **Flexibility** | Maximum | High (within theme) |

## Code Examples

### Complete Checkbox Example

```tsx
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import styles from './Checkbox.module.css';

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CustomCheckbox({
  label,
  checked,
  onCheckedChange,
  disabled = false
}: CustomCheckboxProps) {
  const id = `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.container}>
      <Checkbox.Root
        id={id}
        className={styles.root}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      >
        <Checkbox.Indicator className={styles.indicator}>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>

      <label
        htmlFor={id}
        className={styles.label}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        {label}
      </label>
    </div>
  );
}

// Styles
.container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.root {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;
}

.root:hover {
  border-color: #6366f1;
}

.root[data-state='checked'] {
  background: #6366f1;
  border-color: #6366f1;
}

.root:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.indicator {
  color: white;
}

.label {
  cursor: pointer;
  user-select: none;
}
```

### Complete Dialog Example

```tsx
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './Dialog.module.css';

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>
            {title}
          </Dialog.Title>

          <Dialog.Description className={styles.description}>
            {description}
          </Dialog.Description>

          <div className={styles.actions}>
            <Dialog.Close asChild>
              <button className={styles.buttonSecondary}>
                {cancelText}
              </button>
            </Dialog.Close>

            <button
              className={styles.buttonPrimary}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>

          <Dialog.Close asChild>
            <button className={styles.closeButton} aria-label="Close">
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Usage
<ConfirmDialog
  trigger={<button>Delete</button>}
  title="Delete Item"
  description="Are you sure? This action cannot be undone."
  onConfirm={() => console.log('Deleted')}
/>
```

### Complete DropdownMenu Example

```tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styles from './Dropdown.module.css';

interface Action {
  label: string;
  onSelect: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionMenuProps {
  trigger: React.ReactNode;
  actions: Action[];
}

export function ActionMenu({ trigger, actions }: ActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={styles.content}
          sideOffset={5}
          align="end"
        >
          {actions.map((action, index) => (
            <DropdownMenu.Item
              key={index}
              className={`${styles.item} ${
                action.variant === 'danger' ? styles.itemDanger : ''
              }`}
              onSelect={action.onSelect}
              disabled={action.disabled}
            >
              {action.icon && (
                <span className={styles.icon}>{action.icon}</span>
              )}
              {action.label}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Arrow className={styles.arrow} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// Usage
<ActionMenu
  trigger={<button>Actions</button>}
  actions={[
    {
      label: 'Edit',
      icon: '✎',
      onSelect: () => console.log('Edit')
    },
    {
      label: 'Duplicate',
      icon: '⎘',
      onSelect: () => console.log('Duplicate')
    },
    {
      label: 'Delete',
      icon: '✕',
      variant: 'danger',
      onSelect: () => console.log('Delete')
    }
  ]}
/>
```

## Best Practices

### 1. Use Composition Pattern

```tsx
// Good: Compose primitives into reusable components
export function TodoCheckbox({ todo }: { todo: Todo }) {
  const { toggleTodo } = useTodos();

  return (
    <Checkbox.Root
      checked={todo.completed}
      onCheckedChange={() => toggleTodo(todo.id)}
      aria-label={`Mark "${todo.text}" as complete`}
    >
      <Checkbox.Indicator>✓</Checkbox.Indicator>
    </Checkbox.Root>
  );
}

// Bad: Inline everything
<Checkbox.Root
  checked={todo.completed}
  onCheckedChange={() => {
    setTodos(todos.map(t =>
      t.id === todo.id ? { ...t, completed: !t.completed } : t
    ));
    localStorage.setItem('todos', JSON.stringify(todos));
  }}
>
```

### 2. Leverage Data Attributes

Radix adds data attributes for styling:

```css
/* Use data-state for conditional styling */
.checkboxRoot[data-state='checked'] {
  background: var(--color-primary);
}

.checkboxRoot[data-state='unchecked'] {
  background: white;
}

/* Use data-disabled */
.button[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Use data-highlighted (for menu items) */
.menuItem[data-highlighted] {
  background: var(--color-primary-light);
}
```

### 3. Always Use asChild

When wrapping custom components:

```tsx
// Good: Use asChild to merge props
<Dialog.Trigger asChild>
  <button className={styles.customButton}>Open</button>
</Dialog.Trigger>

// Bad: Creates extra wrapper
<Dialog.Trigger>
  <button className={styles.customButton}>Open</button>
</Dialog.Trigger>
```

### 4. Provide Accessible Labels

```tsx
// Good: Descriptive aria-label
<Checkbox.Root
  aria-label={`Mark "${todo.text}" as ${
    todo.completed ? 'incomplete' : 'complete'
  }`}
>

// Bad: No label or generic label
<Checkbox.Root aria-label="Checkbox">
```

### 5. Handle Edge Cases

```tsx
// Handle empty states
if (todos.length === 0) {
  return <EmptyState />;
}

// Handle loading states
if (isLoading) {
  return <LoadingSkeleton />;
}

// Handle errors
if (error) {
  return <ErrorMessage error={error} />;
}
```

## Advanced Patterns

### Custom Hooks for Radix Primitives

```tsx
// useDialog hook
function useDialog(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const toggleDialog = () => setOpen(prev => !prev);

  return {
    open,
    setOpen,
    openDialog,
    closeDialog,
    toggleDialog
  };
}

// Usage
function MyComponent() {
  const dialog = useDialog();

  return (
    <Dialog.Root open={dialog.open} onOpenChange={dialog.setOpen}>
      {/* Dialog content */}
    </Dialog.Root>
  );
}
```

### Controlled vs Uncontrolled

```tsx
// Controlled (you manage state)
const [checked, setChecked] = useState(false);

<Checkbox.Root
  checked={checked}
  onCheckedChange={setChecked}
>

// Uncontrolled (Radix manages state)
<Checkbox.Root defaultChecked={false}>
```

### Compound Components

```tsx
// Create a compound component
export function TodoDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Root>
      {children}
    </Dialog.Root>
  );
}

TodoDialog.Trigger = Dialog.Trigger;
TodoDialog.Content = Dialog.Content;
TodoDialog.Title = Dialog.Title;
TodoDialog.Description = Dialog.Description;

// Usage
<TodoDialog>
  <TodoDialog.Trigger>Open</TodoDialog.Trigger>
  <TodoDialog.Content>
    <TodoDialog.Title>Title</TodoDialog.Title>
    <TodoDialog.Description>Description</TodoDialog.Description>
  </TodoDialog.Content>
</TodoDialog>
```

## Performance Considerations

### 1. Memoization

```tsx
// Memoize filtered todos
const filteredTodos = useMemo(() => {
  return todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
}, [todos, filter]);

// Memoize callbacks
const handleToggle = useCallback((id: string) => {
  toggleTodo(id);
}, [toggleTodo]);
```

### 2. Code Splitting

```tsx
// Lazy load dialog
const DeleteDialog = lazy(() => import('./DeleteDialog'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <DeleteDialog />
</Suspense>
```

### 3. Virtual Lists

For large lists, use virtualization:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualTodoList({ todos }: { todos: Todo[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: todos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            <TodoItem todo={todos[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Testing Strategies

### Unit Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from './TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    text: 'Test todo',
    completed: false,
    createdAt: Date.now()
  };

  it('toggles completion on checkbox click', () => {
    const toggleTodo = jest.fn();

    render(
      <TodoItem todo={mockTodo} toggleTodo={toggleTodo} />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(toggleTodo).toHaveBeenCalledWith('1');
  });

  it('opens delete dialog on delete button click', async () => {
    render(<TodoItem todo={mockTodo} />);

    const deleteButton = screen.getByLabelText('Delete todo');
    fireEvent.click(deleteButton);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<TodoApp />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Further Resources

### Official Documentation

- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Radix Primitives GitHub](https://github.com/radix-ui/primitives)
- [Radix Icons](https://www.radix-ui.com/icons)

### Tutorials & Guides

- [Building a Design System with Radix](https://www.radix-ui.com/docs/primitives/overview/getting-started)
- [Styling Radix with Tailwind](https://www.radix-ui.com/docs/primitives/overview/styling)
- [Accessible Components Guide](https://www.w3.org/WAI/ARIA/apg/)

### Complementary Libraries

- **Radix Colors** - Color system designed for Radix
- **Radix Icons** - Icon set matching Radix philosophy
- **Stitches** - CSS-in-JS designed for Radix
- **CVA (Class Variance Authority)** - Variant management

### Community Examples

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components built on Radix
- [Radix Themes](https://www.radix-ui.com/themes) - Official theme system
- [Radix UI Recipes](https://github.com/radix-ui/primitives/discussions)

### Design Systems Using Radix

- **Modulz** (creators of Radix)
- **Vercel Design System**
- **WorkOS RadixUI**
- Many custom enterprise systems

---

## Summary

This React + Radix UI Todo application demonstrates:

1. **Unstyled Primitives** - Complete styling control
2. **Accessibility First** - ARIA, keyboard nav, focus management
3. **Composition** - Building complex UIs from simple primitives
4. **Type Safety** - Full TypeScript integration
5. **Performance** - Small bundle, tree-shakeable
6. **Flexibility** - Works with any styling solution

Radix UI represents a powerful approach to building React UIs where you need:
- Custom design requirements
- Maximum accessibility
- Full styling control
- Production-grade quality

The unstyled primitive approach requires more upfront styling work but delivers unmatched flexibility and accessibility for modern React applications.

---

**Built with:**
- React 18.2
- Radix UI Primitives
- TypeScript 5.2
- Vite 5.0
- CSS Modules

**License:** MIT
