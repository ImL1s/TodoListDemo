# Qwik Todo - Quick Start Guide

Get up and running with the Qwik Todo application in under 2 minutes.

## Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
```

## Installation

```bash
# Navigate to the project
cd 03-modern-frameworks/16-qwik

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

## Basic Usage

### Adding Todos
1. Type in the input field
2. Press Enter or click "Add"
3. Todo appears in the list

### Managing Todos
- **Toggle**: Click checkbox to mark complete/incomplete
- **Edit**: Double-click todo text, edit, press Enter to save
- **Delete**: Click the × button
- **Cancel edit**: Press Escape while editing

### Filtering
- **All**: Show all todos
- **Active**: Show incomplete todos only
- **Completed**: Show completed todos only

### Bulk Actions
- **Toggle All**: Click the ↓ icon to toggle all todos
- **Clear Completed**: Click "Clear completed" button

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── todo-input/      # New todo input
│   ├── todo-item/       # Individual todo
│   └── todo-list/       # Todo list container
├── routes/
│   └── index.tsx        # Main app page
└── types.ts             # TypeScript definitions
```

## Key Concepts

### The $ Optimizer
```typescript
// $ makes this function lazy-loadable
const handleClick$ = $(() => {
  console.log('Clicked!');
});
```

### Reactive State
```typescript
// useSignal for primitives
const count = useSignal(0);
count.value++;

// useStore for objects
const store = useStore({ todos: [] });
store.todos.push(newTodo); // Direct mutation works!
```

### Effects
```typescript
// useVisibleTask$ for browser APIs
useVisibleTask$(() => {
  localStorage.setItem('key', 'value');
});
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev.debug        # Start with debugger

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Lint code
npm run fmt              # Format code
npm run fmt.check        # Check formatting
```

## Customization

### Change Port
Edit `vite.config.ts`:
```typescript
server: {
  port: 3000,  // Change this
}
```

### Modify Styles
Styles are in `src/routes/index.tsx` within the `<style>` tag.

### Add New Features
1. Create component in `src/components/`
2. Import in `src/routes/index.tsx`
3. Add to JSX

## Troubleshooting

### "Cannot find module" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### LocalStorage not working
Make sure you're using `useVisibleTask$` not `useTask$`:
```typescript
// ✅ Correct
useVisibleTask$(() => {
  localStorage.setItem('key', 'value');
});
```

### State not updating
Use `useStore` for objects/arrays:
```typescript
// ✅ Correct
const store = useStore({ items: [] });
store.items.push(newItem);
```

## Next Steps

1. Read the comprehensive [README.md](./README.md) for deep-dive
2. Explore [IMPLEMENTATION.md](./IMPLEMENTATION.md) for technical details
3. Check out [Qwik docs](https://qwik.builder.io/docs/) for more

## Performance Tips

1. **Use $** - All event handlers should use $
2. **useStore** - For complex state (objects/arrays)
3. **useSignal** - For simple state (primitives)
4. **Lazy load** - Heavy components with lazy$()

## Learn More

- **Official Docs**: https://qwik.builder.io
- **Tutorial**: https://qwik.builder.io/tutorial/
- **Discord**: https://qwik.builder.io/chat
- **GitHub**: https://github.com/BuilderIO/qwik

## Questions?

Check the [README.md](./README.md) for:
- Detailed explanation of Resumability vs Hydration
- $ optimizer deep-dive
- Performance comparisons
- Code examples
- Best practices

---

**Happy coding with Qwik!** 🚀
