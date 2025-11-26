# Gatsby Todo App - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
cd 04-metaframeworks/06-gatsby
npm install
```

### Step 2: Start Development Server

```bash
npm run develop
```

The app will be available at:
- **Application**: http://localhost:8000
- **GraphiQL IDE**: http://localhost:8000/___graphql

### Step 3: Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run serve
```

The production site will be available at: http://localhost:9000

---

## 📦 Available Commands

```bash
# Development
npm run develop      # Start dev server with hot reload
npm start            # Alias for 'develop'

# Production
npm run build        # Create production build
npm run serve        # Serve production build locally
npm run clean        # Clean cache and build artifacts

# Code Quality
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
npm run lint         # Lint code with ESLint
```

---

## 🎯 What Makes This Different?

### Gatsby Advantages

1. **⚡ Pre-rendered HTML**: Instant page loads, perfect Lighthouse scores
2. **🔍 SEO Optimized**: Fully rendered HTML for search engines
3. **📦 Code Splitting**: Automatic optimization, only load what you need
4. **🚀 Prefetching**: Linked pages load instantly
5. **🎨 GraphQL**: Unified data layer for all sources

### vs Traditional React (CSR)

| Feature | Gatsby (SSG) | React (CSR) |
|---------|-------------|-------------|
| Initial Load | ⚡ Instant | 🐢 Slow |
| SEO | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Interactivity | ✅ Full | ✅ Full |
| Hosting | 💰 Cheap | 💰 Cheap |
| Build Time | Slow | Fast |

### vs Next.js (Hybrid)

| Feature | Gatsby | Next.js |
|---------|--------|---------|
| Rendering | SSG only | SSG + SSR + ISR |
| Data Layer | GraphQL | Manual |
| Plugins | 2,500+ | Fewer |
| API Routes | ❌ No | ✅ Yes |
| Best For | Content sites | Full-stack apps |

---

## 🏗️ Project Structure

```
06-gatsby/
├── src/
│   ├── components/          # React components
│   │   ├── TodoInput.tsx    # Add new todos
│   │   ├── TodoItem.tsx     # Individual todo
│   │   └── TodoList.tsx     # Todo list container
│   ├── hooks/               # Custom hooks
│   │   └── useTodos.ts      # Todo state management
│   ├── pages/               # Page components (routes)
│   │   └── index.tsx        # Main page (/)
│   └── types.ts             # TypeScript types
├── gatsby-config.ts         # Gatsby configuration
├── gatsby-node.ts           # Build-time customization
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # Full documentation
```

---

## 🎨 Features

- ✅ Add, edit, delete todos
- ✅ Mark as complete/incomplete
- ✅ Filter by status (all/active/completed)
- ✅ Persistent storage (localStorage)
- ✅ Real-time statistics
- ✅ Fully responsive design
- ✅ Keyboard accessible
- ✅ TypeScript type safety

---

## 🚀 Deploy to Production

### Deploy to Netlify (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=public
```

Or use continuous deployment:
1. Push to GitHub
2. Connect at [netlify.com](https://netlify.com)
3. Auto-deploys on every push

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Update gatsby-config.ts
pathPrefix: '/your-repo-name'

# Deploy
npm run build && npx gh-pages -d public
```

---

## 🔧 Common Issues

### "window is not defined"

Gatsby pre-renders pages, so `window` isn't available at build time.

**Solution**: Check before using:
```typescript
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

### Hot Reload Not Working

**Solution**:
```bash
gatsby clean
npm run develop
```

### Build Too Slow

**Solution**: Use Gatsby Cloud for incremental builds (10-100x faster)

---

## 📚 Learn More

- **Full README**: [README.md](./README.md) - Comprehensive guide (1800+ lines)
- **Gatsby Docs**: https://www.gatsbyjs.com/docs
- **Gatsby Tutorial**: https://www.gatsbyjs.com/docs/tutorial
- **GraphQL**: https://graphql.org/learn

---

## 🎓 Key Concepts

### 1. Static Site Generation (SSG)

Pages are built at compile time, not request time:

```
Build Time (Once):
Source → React Components → Static HTML

Request Time (Fast):
User Request → CDN → Pre-built HTML
```

### 2. GraphQL Data Layer

Unified interface for all data:

```graphql
query {
  site {
    siteMetadata {
      title
    }
  }
}
```

### 3. Plugin System

Extend functionality easily:

```javascript
plugins: [
  'gatsby-plugin-typescript',
  'gatsby-plugin-image',
  {
    resolve: 'gatsby-source-contentful',
    options: { ... }
  }
]
```

---

## 💡 Pro Tips

1. **Use GraphiQL**: Explore data at http://localhost:8000/___graphql
2. **Clean Cache**: Run `gatsby clean` if things act weird
3. **Type Safety**: Enable `graphqlTypegen: true` for typed queries
4. **Images**: Use `gatsby-plugin-image` for optimization
5. **Links**: Use `<Link>` component for instant navigation

---

## 🤝 Need Help?

- **Documentation**: Read the full [README.md](./README.md)
- **Issues**: Check [GitHub Issues](https://github.com/gatsbyjs/gatsby/issues)
- **Community**: Join [Gatsby Discord](https://gatsby.dev/discord)
- **Stack Overflow**: Tag questions with `gatsby`

---

**Happy coding with Gatsby! ⚡**
