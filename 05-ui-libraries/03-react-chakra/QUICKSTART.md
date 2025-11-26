# Quick Start Guide

Get up and running with the Chakra UI Todo List in under 5 minutes!

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Installation & Run

```bash
# Navigate to project directory
cd 05-ui-libraries/03-react-chakra

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open automatically at `http://localhost:3000`

## Project Features

- ✅ Add, complete, and delete todos
- 🌗 Dark/Light mode toggle (top right)
- 📱 Fully responsive design
- 💾 Automatic data persistence
- 🎨 Beautiful Chakra UI components
- ⚡ Lightning-fast with Vite

## Quick Tips

1. **Add a Todo**: Type at least 3 characters and click "Add" or press Enter
2. **Complete a Todo**: Click the checkbox
3. **Delete a Todo**: Click the red trash icon
4. **Filter Todos**: Use the All/Active/Completed buttons
5. **Toggle Theme**: Click the sun/moon icon in the header

## File Structure

```
src/
├── components/
│   ├── TodoInput.tsx   # Input component
│   ├── TodoItem.tsx    # Individual todo item
│   └── TodoList.tsx    # List with filtering
├── App.tsx             # Main app component
├── main.tsx            # Entry point
├── theme.ts            # Custom Chakra theme
└── types.ts            # TypeScript types
```

## Key Chakra UI Features Demonstrated

- **Style Props**: `<Box bg="blue.500" p={4} />`
- **Dark Mode**: `useColorMode()` and `useColorModeValue()`
- **Toast Notifications**: `useToast()`
- **Responsive Design**: `width={['100%', '50%', '33%']}`
- **Custom Theme**: Extended with brand colors
- **Animations**: Framer Motion integration

## Build for Production

```bash
npm run build
npm run preview
```

## Learn More

See the full [README.md](./README.md) for:
- Detailed Chakra UI guide
- Comparison with MUI and Ant Design
- Advanced features and patterns
- TypeScript integration
- Performance optimizations

---

**Enjoy building with Chakra UI!** 🎨
