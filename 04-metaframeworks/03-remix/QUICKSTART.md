# Quick Start Guide

Get the Remix Todo app running in 2 minutes!

## Prerequisites

- Node.js 20+ installed
- npm or yarn or pnpm

## Steps

1. **Install dependencies:**

```bash
npm install
```

2. **Start development server:**

```bash
npm run dev
```

3. **Open your browser:**

Navigate to http://localhost:5173

That's it! The app is now running.

## What's Next?

- ✅ Try adding some todos
- ✅ Toggle todos as complete/incomplete
- ✅ Filter by all/active/completed
- ✅ Clear completed todos
- ✅ Disable JavaScript in DevTools to see progressive enhancement in action!

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run typecheck  # Run TypeScript type checking
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## Testing Progressive Enhancement

1. Open Chrome DevTools (F12)
2. Press Cmd/Ctrl + Shift + P
3. Type "Disable JavaScript"
4. Try using the app - it still works!

## Project Structure

```
03-remix/
├── app/
│   ├── components/       # React components
│   ├── routes/           # File-based routes
│   ├── styles/           # Global CSS
│   ├── utils/            # Server utilities
│   ├── root.tsx          # Root layout
│   ├── entry.server.tsx  # Server entry
│   └── entry.client.tsx  # Client entry
├── public/               # Static assets
├── package.json          # Dependencies
├── vite.config.ts        # Vite config
└── tsconfig.json         # TypeScript config
```

## Key Features

- **Progressive Enhancement**: Works without JavaScript
- **Optimistic UI**: Instant feedback on actions
- **File-based Routing**: Simple route organization
- **Type Safety**: Full TypeScript support
- **Server-side Rendering**: Fast initial loads
- **Web Standards**: Built on fetch, FormData, Request, Response

## Learn More

- Read the full [README.md](./README.md) for detailed documentation
- Read the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides
- Visit [Remix Docs](https://remix.run/docs) for Remix documentation

## Troubleshooting

**Port already in use?**
```bash
PORT=3001 npm run dev
```

**TypeScript errors?**
```bash
npm run typecheck
```

**Want to start fresh?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

- Check the [README.md](./README.md) troubleshooting section
- Visit [Remix Discord](https://rmx.as/discord)
- Open an issue on GitHub

Happy coding! 🎉
