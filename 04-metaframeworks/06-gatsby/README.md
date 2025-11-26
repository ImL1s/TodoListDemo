# Gatsby Todo App

A modern, blazing-fast Todo List application built with **Gatsby 5**, **React 18**, and **TypeScript**. This project demonstrates the power of Static Site Generation (SSG) for building performant web applications with excellent SEO and instant page loads.

[![Gatsby](https://img.shields.io/badge/Gatsby-5.13-663399?logo=gatsby)](https://www.gatsbyjs.com/)
[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📑 Table of Contents

- [Introduction](#-introduction)
- [What is Gatsby?](#-what-is-gatsby)
- [SSG vs SSR vs CSR](#-ssg-vs-ssr-vs-csr)
- [Gatsby vs Next.js](#-gatsby-vs-nextjs)
- [When to Choose Gatsby](#-when-to-choose-gatsby)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Development Guide](#-development-guide)
- [Gatsby Core Concepts](#-gatsby-core-concepts)
- [Plugin Ecosystem](#-plugin-ecosystem)
- [Performance Optimization](#-performance-optimization)
- [Deployment](#-deployment)
- [Build Process](#-build-process)
- [Configuration](#-configuration)
- [GraphQL Data Layer](#-graphql-data-layer)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Learning Resources](#-learning-resources)

---

## 🎯 Introduction

This Todo application showcases Gatsby's capabilities as a modern Static Site Generator (SSG). While Gatsby excels at building content-heavy websites, this project demonstrates how it can also power interactive applications with client-side state management.

### Key Highlights

- ⚡ **Blazing Fast**: Pre-rendered HTML for instant page loads
- 🔍 **SEO Optimized**: Built-in SEO features and meta tag management
- 📱 **Responsive Design**: Works perfectly on all devices
- 🎨 **Modern UI**: Clean, gradient-based design with smooth animations
- 💾 **Persistent Storage**: Todos saved in localStorage
- ♿ **Accessible**: ARIA labels and keyboard navigation
- 🔒 **Type-Safe**: Full TypeScript support

---

## 🚀 What is Gatsby?

**Gatsby** is a React-based open-source framework for creating websites and applications. It's often described as a "Progressive Static Site Generator" that combines the power of React, GraphQL, and modern build tools.

### Core Philosophy

Gatsby follows these key principles:

1. **Performance First**: Every aspect of Gatsby is optimized for speed
2. **Developer Experience**: Hot reloading, GraphQL data layer, rich plugin ecosystem
3. **Modern Tech Stack**: React, GraphQL, Webpack, and modern JavaScript
4. **Progressive Enhancement**: Start with static HTML, enhance with JavaScript

### How Gatsby Works

```
┌─────────────┐
│  Data       │  (Markdown, CMS, APIs, etc.)
│  Sources    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  GraphQL    │  (Unified data layer)
│  Data Layer │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  React      │  (Component-based UI)
│  Components │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Build      │  (Static HTML + JavaScript)
│  Process    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Static     │  (Deployed to CDN)
│  Files      │
└─────────────┘
```

### Key Features

#### 1. **Static Site Generation**
- Pre-renders all pages at build time
- Generates optimized HTML, CSS, and JavaScript
- Perfect for CDN deployment

#### 2. **GraphQL Data Layer**
- Unified interface for all data sources
- Type-safe data queries
- Automatic code splitting based on queries

#### 3. **Plugin Architecture**
- 2,500+ plugins available
- Extend functionality without complex configuration
- Transform data, add features, integrate services

#### 4. **Image Optimization**
- Automatic image optimization
- Lazy loading and blur-up placeholders
- Responsive images with art direction

#### 5. **Code Splitting**
- Automatic code splitting per page
- Prefetch resources for linked pages
- Minimal JavaScript bundle sizes

#### 6. **Progressive Web App (PWA)**
- Offline functionality
- Add to home screen
- Service worker support

---

## 🔄 SSG vs SSR vs CSR

Understanding different rendering strategies is crucial for choosing the right tool.

### Static Site Generation (SSG)

**How it works**: Pages are pre-rendered at build time.

```
Build Time:
┌──────────┐      ┌──────────┐      ┌──────────┐
│  Source  │  →   │  Build   │  →   │  Static  │
│  Files   │      │  Process │      │  HTML    │
└──────────┘      └──────────┘      └──────────┘

Request Time:
┌──────────┐      ┌──────────┐
│  User    │  →   │  CDN     │
│  Request │  ←   │  (HTML)  │
└──────────┘      └──────────┘
```

**Pros**:
- ✅ Fastest possible page loads
- ✅ Excellent SEO (fully rendered HTML)
- ✅ Low server costs (static hosting)
- ✅ High security (no server-side code)
- ✅ Perfect for CDN distribution

**Cons**:
- ❌ Build time increases with page count
- ❌ Content updates require rebuilding
- ❌ Not ideal for user-specific content
- ❌ Large sites can have slow builds

**Best for**: Blogs, marketing sites, documentation, portfolios

### Server-Side Rendering (SSR)

**How it works**: Pages are rendered on the server for each request.

```
Request Time:
┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │  →   │  Server  │  →   │  Database│
│  Request │      │  Renders │      │  / API   │
└──────────┘      └──────────┘      └──────────┘
                        ↓
                  ┌──────────┐
                  │  HTML    │
                  │  Response│
                  └──────────┘
```

**Pros**:
- ✅ Always up-to-date content
- ✅ Good SEO (rendered HTML)
- ✅ Personalized content
- ✅ Works with dynamic data

**Cons**:
- ❌ Slower than SSG (render per request)
- ❌ Requires server infrastructure
- ❌ Higher hosting costs
- ❌ More complex caching strategies

**Best for**: E-commerce, dashboards, social media, user-specific content

### Client-Side Rendering (CSR)

**How it works**: JavaScript renders content in the browser.

```
Request Time:
┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │  →   │  CDN     │      │  API     │
│  Request │      │  (JS)    │  →   │  Calls   │
└──────────┘      └──────────┘      └──────────┘
                        ↓
                  ┌──────────┐
                  │  Browser │
                  │  Renders │
                  └──────────┘
```

**Pros**:
- ✅ Rich interactivity
- ✅ Reduced server load
- ✅ Simple deployment (static hosting)
- ✅ Great for SPAs

**Cons**:
- ❌ Poor initial page load
- ❌ SEO challenges
- ❌ Blank page until JS loads
- ❌ Requires JavaScript enabled

**Best for**: Internal tools, dashboards, web applications

### Comparison Table

| Feature | SSG (Gatsby) | SSR (Next.js) | CSR (React) |
|---------|-------------|---------------|-------------|
| **Initial Load** | ⚡ Fastest | 🚀 Fast | 🐢 Slow |
| **SEO** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Dynamic Content** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Build Time** | Slow (large sites) | Fast | Fast |
| **Hosting Cost** | 💰 Cheap | 💰💰💰 Expensive | 💰 Cheap |
| **Time to Interactive** | ⚡ Fast | 🚀 Medium | 🐢 Slow |
| **Content Updates** | Requires rebuild | Instant | Instant |
| **Server Required** | ❌ No | ✅ Yes | ❌ No |

---

## ⚖️ Gatsby vs Next.js

Both Gatsby and Next.js are React-based frameworks, but they have different philosophies and use cases.

### Architecture Comparison

#### Gatsby: SSG-First

```
Gatsby Philosophy:
┌────────────────────────────────────┐
│  Static First                      │
│  - Pre-render everything at build  │
│  - Optimize for performance        │
│  - GraphQL data layer              │
│  - Plugin ecosystem                │
└────────────────────────────────────┘
```

#### Next.js: Hybrid Approach

```
Next.js Philosophy:
┌────────────────────────────────────┐
│  Flexibility First                 │
│  - SSG + SSR + CSR in one app     │
│  - API routes included             │
│  - File-based routing              │
│  - Edge runtime support            │
└────────────────────────────────────┘
```

### Feature Comparison

| Feature | Gatsby | Next.js |
|---------|--------|---------|
| **Primary Use Case** | Content sites, blogs | Full-stack apps |
| **Rendering** | SSG only (+ client-side) | SSG + SSR + ISR |
| **Data Layer** | GraphQL (built-in) | REST/GraphQL (manual) |
| **API Routes** | ❌ No | ✅ Yes |
| **Image Optimization** | gatsby-plugin-image | next/image |
| **Build Speed** | Slower (large sites) | Faster |
| **Hot Reload** | Good | Excellent |
| **Plugin Ecosystem** | 2,500+ plugins | Smaller ecosystem |
| **Learning Curve** | Steeper (GraphQL) | Gentler |
| **Deployment** | Static hosting | Vercel, or Node server |
| **Incremental Builds** | ✅ Yes (Cloud) | ✅ Yes (ISR) |
| **TypeScript** | ✅ Supported | ✅ First-class |
| **Community** | Large | Very Large |

### Code Comparison

#### Gatsby Page Component

```tsx
// src/pages/index.tsx
import { graphql, PageProps } from 'gatsby';

const IndexPage: React.FC<PageProps<Queries.IndexQuery>> = ({ data }) => {
  return (
    <div>
      <h1>{data.site.siteMetadata.title}</h1>
    </div>
  );
};

export const query = graphql`
  query Index {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default IndexPage;
```

#### Next.js Page Component

```tsx
// pages/index.tsx
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetch('...');
  return {
    props: { data },
    revalidate: 60, // ISR: revalidate every 60 seconds
  };
};

const IndexPage = ({ data }) => {
  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
};

export default IndexPage;
```

### When Gatsby Wins

✅ **Content-heavy sites**
- Blogs, documentation, marketing sites
- GraphQL makes it easy to query content from multiple sources

✅ **Performance is critical**
- Every page pre-rendered for maximum speed
- Automatic optimizations out of the box

✅ **Plugin-rich requirements**
- Need lots of integrations (CMS, analytics, images, etc.)
- Gatsby's plugin ecosystem is unmatched

✅ **Static deployment preferred**
- Want to use Netlify, Vercel, or GitHub Pages
- No server infrastructure needed

### When Next.js Wins

✅ **Full-stack applications**
- Need API routes and server-side logic
- Complex authentication flows

✅ **Hybrid rendering needs**
- Some pages static, some server-rendered
- Incremental Static Regeneration (ISR)

✅ **E-commerce**
- Product catalogs with frequent updates
- User-specific content and recommendations

✅ **Real-time data**
- Live dashboards, social feeds
- Content that changes frequently

---

## 🎯 When to Choose Gatsby

### Perfect Use Cases

#### 1. **Content-Driven Websites**

Gatsby excels at sites where content is king:

- **Blogs**: Personal blogs, company blogs, magazine sites
- **Documentation**: API docs, product guides, knowledge bases
- **Marketing Sites**: Landing pages, product pages, company websites
- **Portfolios**: Artist portfolios, photography sites, design showcases

**Why Gatsby?**
- GraphQL makes it easy to query content
- Markdown/MDX support built-in
- CMS integrations (Contentful, WordPress, Sanity)
- Automatic image optimization

#### 2. **Performance-Critical Applications**

When every millisecond counts:

- **E-commerce Product Catalogs**: Fast product browsing
- **Event Sites**: Conference websites, festival guides
- **News Sites**: Article listings, category pages
- **Educational Platforms**: Course catalogs, learning resources

**Why Gatsby?**
- Pre-rendered HTML for instant loads
- Automatic code splitting
- Prefetching for linked pages
- Optimized asset delivery

#### 3. **SEO-Dependent Sites**

When search engine visibility is crucial:

- **Business Websites**: Local businesses, service providers
- **SaaS Marketing**: Product landing pages
- **Content Marketing**: Resources, guides, tutorials
- **Directory Sites**: Business listings, resource directories

**Why Gatsby?**
- Fully rendered HTML (perfect for crawlers)
- Built-in SEO component
- Sitemap and robots.txt generation
- Schema.org structured data

#### 4. **Multi-Source Data Projects**

When you need to combine data from multiple sources:

- **Real Estate Listings**: MLS data + CMS content
- **Job Boards**: API data + company info
- **Product Catalogs**: Database + marketing content
- **Resource Libraries**: Multiple APIs + local files

**Why Gatsby?**
- GraphQL unifies all data sources
- Source plugins for everything (APIs, databases, CMSs)
- Transform data at build time
- Type-safe data queries

### Not Ideal For

#### ❌ User-Generated Content Platforms

Sites where users constantly create content:
- Social networks
- Forums and discussion boards
- Real-time chat applications
- Collaborative editing tools

**Problem**: Requires rebuild for every new post/comment

#### ❌ Highly Personalized Applications

Apps with user-specific data:
- User dashboards
- Account management
- Personalized recommendations
- Shopping carts

**Problem**: Can't pre-render user-specific pages

#### ❌ Real-Time Data Applications

Apps that need live data:
- Stock trading platforms
- Live sports scores
- Real-time analytics
- Live chat applications

**Problem**: Data stale until next build

#### ❌ Very Large Sites (10,000+ pages)

Massive sites with huge page counts:
- Large e-commerce sites (10k+ products)
- News archives (years of articles)
- Enterprise databases

**Problem**: Build times can become prohibitively long

### Decision Tree

```
Do you need server-side logic (auth, payments, etc.)?
├─ YES → Use Next.js or traditional backend
└─ NO → Continue

Is your content updated very frequently (hourly)?
├─ YES → Use Next.js with ISR or SSR
└─ NO → Continue

Do you have more than 10,000 pages?
├─ YES → Consider Next.js or split into multiple sites
└─ NO → Continue

Do you need real-time user interactions?
├─ YES → Use Next.js with API routes
└─ NO → Continue

Is SEO and performance critical?
├─ YES → Gatsby is perfect! ✅
└─ NO → Gatsby is still great, but CSR might work too
```

---

## ✨ Features

This Todo application includes:

### Core Functionality

- ✅ **Add Todos**: Create new todo items
- ✅ **Toggle Complete**: Mark todos as done/undone
- ✅ **Edit Todos**: Double-click to edit
- ✅ **Delete Todos**: Remove unwanted items
- ✅ **Filter Todos**: View all/active/completed
- ✅ **Clear Completed**: Bulk delete completed items
- ✅ **Persistent Storage**: Saves to localStorage
- ✅ **Statistics**: Track total/active/completed counts

### Technical Features

- 🎨 **Modern UI**: Gradient design with smooth animations
- 📱 **Responsive**: Mobile-first design
- ♿ **Accessible**: ARIA labels and keyboard navigation
- 🔒 **Type-Safe**: Full TypeScript coverage
- ⚡ **Optimized**: Code splitting and lazy loading
- 🔍 **SEO Ready**: Meta tags and structured data
- 🎯 **Clean Code**: Well-organized component structure
- 📝 **Documented**: Extensive comments and documentation

---

## 🛠 Tech Stack

### Core Technologies

- **[Gatsby 5.13](https://www.gatsbyjs.com/)**: Static Site Generator
- **[React 18.2](https://reactjs.org/)**: UI library
- **[TypeScript 5.3](https://www.typescriptlang.org/)**: Type safety
- **[Node.js 18+](https://nodejs.org/)**: Runtime environment

### Gatsby Plugins

- **gatsby-plugin-typescript**: TypeScript support
- **gatsby-plugin-manifest**: PWA manifest

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Build Tools

- **Webpack**: Module bundler (via Gatsby)
- **Babel**: JavaScript transpiler (via Gatsby)
- **PostCSS**: CSS processing (via Gatsby)

---

## 📁 Project Structure

```
04-metaframeworks/06-gatsby/
├── src/
│   ├── components/          # React components
│   │   ├── TodoInput.tsx    # Input for new todos
│   │   ├── TodoItem.tsx     # Individual todo item
│   │   └── TodoList.tsx     # List of todos
│   ├── hooks/               # Custom React hooks
│   │   └── useTodos.ts      # Todo management logic
│   ├── pages/               # Page components (routes)
│   │   └── index.tsx        # Main todo page
│   └── types.ts             # TypeScript definitions
├── gatsby-config.ts         # Gatsby configuration
├── gatsby-node.ts           # Build-time customization
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # Documentation

Generated at build:
├── .cache/                  # Build cache
└── public/                  # Build output
```

### Component Architecture

```
┌─────────────────────────────────────┐
│         pages/index.tsx             │
│  (Main page with layout & state)    │
└────────────┬────────────────────────┘
             │
             ├─► hooks/useTodos.ts
             │   (State management)
             │
             ├─► components/TodoInput.tsx
             │   (Add new todos)
             │
             └─► components/TodoList.tsx
                 (Display todos)
                 │
                 └─► components/TodoItem.tsx
                     (Individual todo)
```

---

## 📦 Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Git**: For cloning the repository

### Option 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd TodoListDemo/04-metaframeworks/06-gatsby

# Install dependencies
npm install

# Start development server
npm run develop
```

### Option 2: Create from Scratch

```bash
# Create new Gatsby site
npm init gatsby

# Navigate to directory
cd my-gatsby-site

# Install additional dependencies
npm install

# Copy source files from this project
# Then start development
npm run develop
```

### Option 3: Use Gatsby CLI

```bash
# Install Gatsby CLI globally
npm install -g gatsby-cli

# Create new site
gatsby new my-todo-app

# Navigate and start
cd my-todo-app
gatsby develop
```

### Verify Installation

```bash
# Check Gatsby version
npx gatsby --version

# Check Node version
node --version

# Check npm version
npm --version
```

Expected output:
```
Gatsby CLI version: 5.13.0
Node: v18.x.x
npm: 9.x.x
```

---

## 🚀 Usage

### Development Commands

```bash
# Start development server
npm run develop
# or
npm start

# Opens at: http://localhost:8000
# GraphiQL IDE: http://localhost:8000/___graphql
```

### Build Commands

```bash
# Create production build
npm run build

# Serve production build locally
npm run serve
# Opens at: http://localhost:9000

# Clean cache and public directories
npm run clean
```

### Code Quality Commands

```bash
# Type checking
npm run type-check

# Format code
npm run format

# Lint code
npm run lint
```

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run develop
   ```

2. **Make Changes**
   - Edit files in `src/`
   - Hot reload applies changes instantly

3. **Test in Browser**
   - Open http://localhost:8000
   - Test functionality
   - Check responsive design

4. **Type Check**
   ```bash
   npm run type-check
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm run serve
   ```

---

## 💻 Development Guide

### Creating a New Page

Gatsby uses file-based routing. Create a file in `src/pages/`:

```tsx
// src/pages/about.tsx
import React from 'react';
import type { HeadFC } from 'gatsby';

const AboutPage: React.FC = () => {
  return (
    <div>
      <h1>About This App</h1>
      <p>Built with Gatsby!</p>
    </div>
  );
};

export default AboutPage;

export const Head: HeadFC = () => (
  <title>About - Todo App</title>
);
```

This creates a route at `/about`.

### Adding a Component

```tsx
// src/components/Header.tsx
import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};
```

### Creating a Custom Hook

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    }
  }, [key]);

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue];
}
```

### Adding Styles

#### Option 1: Component-scoped styles (used in this project)

```tsx
const MyComponent = () => {
  return (
    <>
      <div className="my-component">Content</div>
      <style>{`
        .my-component {
          color: blue;
        }
      `}</style>
    </>
  );
};
```

#### Option 2: CSS Modules

```tsx
import * as styles from './MyComponent.module.css';

const MyComponent = () => {
  return <div className={styles.container}>Content</div>;
};
```

#### Option 3: Global CSS

```tsx
// gatsby-browser.js
import './src/styles/global.css';
```

---

## 🧩 Gatsby Core Concepts

### 1. Pages and Routing

Gatsby uses file-based routing:

```
src/pages/
├── index.tsx           → /
├── about.tsx           → /about
├── blog/
│   ├── index.tsx       → /blog
│   └── post-1.tsx      → /blog/post-1
└── 404.tsx             → 404 page
```

### 2. GraphQL Data Layer

Gatsby's GraphQL layer unifies all data sources:

```graphql
query {
  site {
    siteMetadata {
      title
      description
    }
  }
  allMarkdownRemark {
    edges {
      node {
        frontmatter {
          title
          date
        }
        html
      }
    }
  }
}
```

### 3. Build Lifecycle

```
1. Source Data
   ├─ Source plugins fetch data
   └─ Transform plugins process data

2. Create GraphQL Schema
   ├─ Infer types from data
   └─ Create queryable schema

3. Create Pages
   ├─ File-based routing
   └─ Programmatic page creation

4. Extract Queries
   ├─ Parse GraphQL queries in components
   └─ Run queries and inject data

5. Optimize Assets
   ├─ Process images
   ├─ Bundle JavaScript
   └─ Extract CSS

6. Generate HTML
   ├─ Server-side render React
   ├─ Generate static HTML files
   └─ Create JSON data files

7. Output Static Files
   └─ Write to public/ directory
```

### 4. Plugin System

Gatsby plugins extend functionality:

```javascript
// gatsby-config.ts
export default {
  plugins: [
    // No config needed
    'gatsby-plugin-typescript',

    // With options
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'My App',
        icon: 'src/images/icon.png',
      },
    },

    // Local plugin
    {
      resolve: require.resolve('./plugins/my-plugin'),
    },
  ],
};
```

### 5. Node APIs

Customize the build process:

```typescript
// gatsby-node.ts
export const createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // Query data
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  // Create pages
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: require.resolve('./src/templates/blog-post.tsx'),
      context: {
        slug: node.fields.slug,
      },
    });
  });
};
```

---

## 🔌 Plugin Ecosystem

Gatsby has over 2,500 plugins. Here are the most essential ones:

### Data Source Plugins

Pull data from anywhere:

```javascript
plugins: [
  // Markdown files
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'posts',
      path: `${__dirname}/content/posts`,
    },
  },

  // WordPress
  {
    resolve: 'gatsby-source-wordpress',
    options: {
      url: 'https://your-site.com/graphql',
    },
  },

  // Contentful CMS
  {
    resolve: 'gatsby-source-contentful',
    options: {
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    },
  },

  // Shopify
  {
    resolve: 'gatsby-source-shopify',
    options: {
      shopName: 'your-shop',
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    },
  },
]
```

### Transform Plugins

Process data:

```javascript
plugins: [
  // Markdown → HTML
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        'gatsby-remark-images',
        'gatsby-remark-prismjs',
      ],
    },
  },

  // JSON files
  'gatsby-transformer-json',

  // Images
  'gatsby-plugin-sharp',
  'gatsby-transformer-sharp',
]
```

### Functionality Plugins

Add features:

```javascript
plugins: [
  // Image optimization
  'gatsby-plugin-image',

  // SEO
  'gatsby-plugin-react-helmet',

  // Analytics
  {
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      trackingId: 'UA-XXXXXXXXX-X',
    },
  },

  // PWA
  'gatsby-plugin-offline',

  // Sitemap
  'gatsby-plugin-sitemap',
]
```

### Popular Plugin Categories

| Category | Popular Plugins |
|----------|----------------|
| **CMS** | WordPress, Contentful, Sanity, Strapi |
| **E-commerce** | Shopify, WooCommerce, BigCommerce |
| **Images** | gatsby-plugin-image, gatsby-plugin-sharp |
| **CSS** | styled-components, emotion, sass, tailwind |
| **SEO** | react-helmet, sitemap, robots.txt |
| **Analytics** | Google Analytics, Segment, Fathom |
| **Performance** | offline, preact, webpack-bundle-analyzer |

---

## ⚡ Performance Optimization

Gatsby is fast by default, but you can optimize further:

### 1. Image Optimization

Use gatsby-plugin-image:

```tsx
import { StaticImage, GatsbyImage } from 'gatsby-plugin-image';

// Static images
<StaticImage
  src="../images/hero.png"
  alt="Hero"
  placeholder="blurred"
  width={800}
/>

// Dynamic images from GraphQL
<GatsbyImage
  image={data.file.childImageSharp.gatsbyImageData}
  alt="Dynamic"
/>
```

Benefits:
- Automatic format conversion (WebP, AVIF)
- Lazy loading
- Blur-up placeholders
- Responsive images

### 2. Code Splitting

Gatsby automatically splits code per page. For additional splitting:

```tsx
// Lazy load components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

const MyPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
};
```

### 3. Prefetching

Gatsby prefetches linked pages:

```tsx
import { Link } from 'gatsby';

// Automatically prefetches /about when link is in viewport
<Link to="/about">About</Link>
```

### 4. Bundle Analysis

Analyze your bundle size:

```bash
npm install -D gatsby-plugin-webpack-bundle-analyser-v2
```

```javascript
// gatsby-config.ts
plugins: [
  {
    resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
    options: {
      analyzerMode: 'static',
    },
  },
]
```

### 5. Caching

Enable proper caching headers:

```javascript
// gatsby-config.ts
plugins: [
  {
    resolve: 'gatsby-plugin-netlify',
    options: {
      headers: {
        '/*': [
          'Cache-Control: public, max-age=31536000, immutable',
        ],
      },
    },
  },
]
```

### Performance Checklist

- ✅ Use gatsby-plugin-image for all images
- ✅ Enable code splitting for heavy components
- ✅ Minimize third-party scripts
- ✅ Use Link component for internal links
- ✅ Implement lazy loading for below-fold content
- ✅ Optimize fonts (use font-display: swap)
- ✅ Enable service worker (gatsby-plugin-offline)
- ✅ Analyze bundle size regularly
- ✅ Use Lighthouse for audits

---

## 🚀 Deployment

Gatsby sites can be deployed anywhere static files are served.

### Netlify (Recommended)

Netlify offers the best Gatsby experience:

#### Quick Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=public
```

#### Continuous Deployment

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository

2. **Configure Build**
   ```
   Build command: gatsby build
   Publish directory: public
   ```

3. **Environment Variables**
   - Add any API keys or secrets
   - Set `NODE_VERSION` to 18

4. **Deploy**
   - Push to main branch
   - Netlify builds and deploys automatically

#### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = "public"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "gatsby-plugin-netlify-cache"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### Vercel

Excellent alternative with zero config:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production
vercel --prod
```

Or use GitHub integration:
1. Import project at [vercel.com](https://vercel.com)
2. Select repository
3. Deploy (auto-detects Gatsby)

### GitHub Pages

Free hosting for public repositories:

```bash
# Install gh-pages
npm install -D gh-pages

# Add deploy script to package.json
"scripts": {
  "deploy": "gatsby build --prefix-paths && gh-pages -d public"
}

# Deploy
npm run deploy
```

Update gatsby-config.ts:

```javascript
export default {
  pathPrefix: '/your-repo-name',
  // ... other config
};
```

### AWS S3 + CloudFront

For enterprise deployments:

```bash
# Install AWS CLI
pip install awscli

# Build
npm run build

# Sync to S3
aws s3 sync public/ s3://your-bucket-name \
  --delete \
  --cache-control max-age=31536000

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Gatsby Cloud

Official hosting with incremental builds:

1. Go to [gatsbyjs.com/cloud](https://gatsbyjs.com/cloud)
2. Connect repository
3. Configure CMS integration (if applicable)
4. Deploy

Benefits:
- Incremental builds (10-100x faster)
- CMS preview
- Functions support
- Built-in CDN

### Deployment Comparison

| Platform | Speed | Price | Features | Best For |
|----------|-------|-------|----------|----------|
| **Netlify** | ⚡⚡⚡ | Free tier generous | Forms, Functions, Split testing | Most sites |
| **Vercel** | ⚡⚡⚡ | Free tier generous | Edge functions, Analytics | Modern sites |
| **GitHub Pages** | ⚡⚡ | Free | Simple, integrated | Open source |
| **Gatsby Cloud** | ⚡⚡⚡⚡ | $$ | Incremental builds, CMS preview | Large Gatsby sites |
| **AWS** | ⚡⚡⚡ | Pay as you go | Full control, scalable | Enterprise |

---

## 🔨 Build Process

Understanding the Gatsby build process:

### Development Build

```bash
npm run develop
```

1. **Source plugins** fetch data
2. **GraphQL schema** is created
3. **Webpack dev server** starts
4. **Hot reload** watches for changes
5. **Pages render** in browser

### Production Build

```bash
npm run build
```

```
┌─────────────────────────────────────┐
│  1. Source Data                     │
│     - Run source plugins            │
│     - Fetch from APIs/CMS/files     │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  2. Transform Data                  │
│     - Run transformer plugins       │
│     - Process markdown, images, etc │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  3. Create GraphQL Schema           │
│     - Infer types                   │
│     - Build queryable API           │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  4. Create Pages                    │
│     - File-based routing            │
│     - Programmatic creation         │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  5. Extract Queries                 │
│     - Find GraphQL queries          │
│     - Run queries                   │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  6. Run Queries                     │
│     - Fetch data for each page      │
│     - Store in JSON files           │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  7. Process Assets                  │
│     - Optimize images               │
│     - Bundle JavaScript             │
│     - Process CSS                   │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  8. Render HTML                     │
│     - Server-side render React      │
│     - Generate static HTML          │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│  9. Write Files                     │
│     - Output to public/             │
│     - Create page-data.json files   │
└─────────────────────────────────────┘
```

### Build Output

```
public/
├── static/              # Static assets
│   ├── images/
│   └── fonts/
├── page-data/           # JSON data for each page
│   ├── index/
│   │   └── page-data.json
│   └── about/
│       └── page-data.json
├── index.html           # Home page HTML
├── about.html           # About page HTML
├── app-*.js             # JavaScript bundles
├── framework-*.js       # React framework
├── webpack-runtime-*.js # Webpack runtime
└── chunk-map.json       # Code splitting map
```

### Incremental Builds

Gatsby Cloud supports incremental builds:

```
Initial Build: 10 minutes
└─ Build entire site

Content Update: 30 seconds
└─ Only rebuild affected pages

Code Change: 2 minutes
└─ Rebuild pages using changed components
```

---

## ⚙️ Configuration

### gatsby-config.ts

Main configuration file:

```typescript
import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  // Site metadata (queryable via GraphQL)
  siteMetadata: {
    title: "My Gatsby Site",
    description: "A blazing fast site",
    author: "@yourhandle",
    siteUrl: "https://example.com",
  },

  // Path prefix for non-root deployments
  pathPrefix: "/blog",

  // Enable type generation
  graphqlTypegen: true,

  // Plugins
  plugins: [
    "gatsby-plugin-typescript",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
    },
  ],

  // Build flags
  flags: {
    DEV_SSR: false,
    FAST_DEV: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
  },

  // Proxy API requests in development
  proxy: {
    prefix: "/api",
    url: "http://localhost:3000",
  },
};

export default config;
```

### Environment Variables

```bash
# .env.development
GATSBY_API_URL=http://localhost:3000
API_KEY=secret_key_dev

# .env.production
GATSBY_API_URL=https://api.example.com
API_KEY=secret_key_prod
```

Access in code:

```typescript
// Only available in browser (GATSBY_ prefix)
const apiUrl = process.env.GATSBY_API_URL;

// Available everywhere
const apiKey = process.env.API_KEY;
```

---

## 🗄️ GraphQL Data Layer

GraphQL is Gatsby's superpower for data management.

### Querying Site Metadata

```tsx
import { graphql, useStaticQuery } from 'gatsby';

const Header = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  return <h1>{data.site.siteMetadata.title}</h1>;
};
```

### Page Queries

```tsx
import { graphql, PageProps } from 'gatsby';

export const query = graphql`
  query BlogPost($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        date
      }
    }
  }
`;

const BlogPost: React.FC<PageProps<Queries.BlogPostQuery>> = ({ data }) => {
  return (
    <article>
      <h1>{data.markdownRemark.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
    </article>
  );
};
```

### GraphiQL IDE

Access at http://localhost:8000/___graphql during development:

```graphql
{
  allFile {
    edges {
      node {
        name
        extension
        size
      }
    }
  }
}
```

---

## 🎓 Best Practices

### 1. Component Organization

```
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Layout.tsx
├── common/
│   ├── Button.tsx
│   └── Card.tsx
└── features/
    ├── TodoInput.tsx
    └── TodoList.tsx
```

### 2. Type Safety

Always define types:

```typescript
// types.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Component
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  // ...
};
```

### 3. Performance

```tsx
// Memoize expensive computations
const filteredTodos = useMemo(
  () => todos.filter(t => !t.completed),
  [todos]
);

// Memoize callbacks
const handleToggle = useCallback(
  (id: string) => toggleTodo(id),
  [toggleTodo]
);
```

### 4. SEO

```tsx
import { HeadFC } from 'gatsby';

export const Head: HeadFC = () => (
  <>
    <title>Todo App - Get Things Done</title>
    <meta name="description" content="A simple todo list app" />
    <meta property="og:title" content="Todo App" />
    <meta property="og:description" content="Get things done" />
    <link rel="canonical" href="https://example.com" />
  </>
);
```

### 5. Error Handling

```tsx
const [error, setError] = useState<Error | null>(null);

try {
  // Operation
} catch (err) {
  setError(err as Error);
}

if (error) {
  return <div>Error: {error.message}</div>;
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Build Fails with "window is not defined"

**Cause**: Using browser APIs during SSR

**Solution**: Check if window exists:

```typescript
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

#### Hot Reload Not Working

**Solution**:

```bash
# Clear cache
gatsby clean

# Restart
gatsby develop
```

#### Out of Memory During Build

**Solution**:

```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
gatsby build
```

#### GraphQL Schema Errors

**Solution**:

```bash
# Regenerate schema
gatsby clean
gatsby develop
```

---

## 📚 Learning Resources

### Official Documentation

- [Gatsby Docs](https://www.gatsbyjs.com/docs)
- [Gatsby Tutorial](https://www.gatsbyjs.com/docs/tutorial)
- [Gatsby Plugin Library](https://www.gatsbyjs.com/plugins)

### Courses

- [Gatsby JS: Build PWA Blog](https://www.leveluptutorials.com/)
- [Build a Blog with Gatsby](https://egghead.io/)
- [Gatsby for Beginners](https://www.youtube.com/gatsbyjs)

### Community

- [Gatsby Discord](https://gatsby.dev/discord)
- [GitHub Discussions](https://github.com/gatsbyjs/gatsby/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/gatsby)

---

## 📄 License

MIT License - feel free to use this project for learning and production.

---

## 🤝 Contributing

Contributions welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 🙏 Acknowledgments

- **Gatsby Team**: For building an amazing framework
- **React Team**: For the foundation
- **TypeScript Team**: For type safety
- **Open Source Community**: For endless inspiration

---

**Built with ❤️ using Gatsby**

For questions or feedback, please open an issue on GitHub.
