# Deployment Guide for Remix Todo App

This guide covers deploying the Remix Todo application to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build the Application](#build-the-application)
- [Deploy to Vercel](#deploy-to-vercel)
- [Deploy to Netlify](#deploy-to-netlify)
- [Deploy to Fly.io](#deploy-to-flyio)
- [Deploy to Railway](#deploy-to-railway)
- [Deploy to Cloudflare Workers](#deploy-to-cloudflare-workers)
- [Environment Variables](#environment-variables)

---

## Prerequisites

Before deploying, ensure you have:

1. A Remix application that builds successfully
2. All dependencies installed
3. Git repository initialized
4. Account on your chosen platform

---

## Build the Application

Test the production build locally:

```bash
# Build the application
npm run build

# Test the production build
npm start
```

The application should be available at http://localhost:3000

---

## Deploy to Vercel

### Option 1: Vercel CLI

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Login to Vercel:**

```bash
vercel login
```

3. **Deploy:**

```bash
vercel
```

4. **For production:**

```bash
vercel --prod
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Remix and configures everything
6. Click "Deploy"

### Configuration

Create `vercel.json` (optional):

```json
{
  "buildCommand": "remix vite:build",
  "devCommand": "remix vite:dev",
  "installCommand": "npm install"
}
```

---

## Deploy to Netlify

### Option 1: Netlify CLI

1. **Install Netlify CLI:**

```bash
npm i -g netlify-cli
```

2. **Login:**

```bash
netlify login
```

3. **Initialize:**

```bash
netlify init
```

4. **Deploy:**

```bash
netlify deploy --prod
```

### Option 2: GitHub Integration

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - Build command: `remix vite:build`
   - Publish directory: `build/client`
6. Click "Deploy"

### Configuration

Create `netlify.toml`:

```toml
[build]
  command = "remix vite:build"
  publish = "build/client"

[dev]
  command = "remix vite:dev"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/server"
  status = 200
```

---

## Deploy to Fly.io

Fly.io is great for deploying full-stack Node.js applications.

### Steps

1. **Install Fly CLI:**

```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login:**

```bash
fly auth login
```

3. **Initialize Fly app:**

```bash
fly launch
```

This creates `fly.toml` configuration.

4. **Deploy:**

```bash
fly deploy
```

### Configuration

`fly.toml`:

```toml
app = "your-app-name"

[build]
  [build.args]
    NODE_VERSION = "20"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

`Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
```

---

## Deploy to Railway

Railway provides simple deployment with automatic HTTPS.

### Steps

1. **Install Railway CLI:**

```bash
npm i -g @railway/cli
```

2. **Login:**

```bash
railway login
```

3. **Initialize:**

```bash
railway init
```

4. **Deploy:**

```bash
railway up
```

### Or use GitHub integration:

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects and deploys

---

## Deploy to Cloudflare Workers

Cloudflare Workers run on the edge for ultra-low latency.

### Steps

1. **Install Wrangler:**

```bash
npm install -g wrangler
```

2. **Login:**

```bash
wrangler login
```

3. **Create wrangler.toml:**

```toml
name = "remix-todo-app"
compatibility_date = "2024-01-01"
main = "./build/index.js"

[site]
bucket = "./build/client"
```

4. **Update vite.config.ts:**

```typescript
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
  ],
  ssr: {
    target: "webworker",
  },
});
```

5. **Deploy:**

```bash
wrangler deploy
```

---

## Environment Variables

### Setting Environment Variables

**Vercel:**
```bash
vercel env add SESSION_SECRET
```

**Netlify:**
```bash
netlify env:set SESSION_SECRET "your-secret"
```

**Fly.io:**
```bash
fly secrets set SESSION_SECRET=your-secret
```

**Railway:**
```bash
railway variables set SESSION_SECRET=your-secret
```

### Required Variables

```env
NODE_ENV=production
SESSION_SECRET=your-random-secret-key
```

### Generate Secret Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Post-Deployment Checklist

- [ ] Environment variables set
- [ ] Application builds successfully
- [ ] All pages load correctly
- [ ] Forms work (create, update, delete todos)
- [ ] Data persists correctly
- [ ] HTTPS is enabled
- [ ] Custom domain configured (if applicable)
- [ ] Error tracking setup (optional)
- [ ] Analytics setup (optional)

---

## Troubleshooting

### Build Fails

Check:
- Node.js version (should be 20+)
- All dependencies installed
- TypeScript compilation errors
- Environment variables

### App Doesn't Start

Check:
- Port configuration
- Environment variables
- Build output in `build/` directory
- Server logs

### Data Doesn't Persist

The default implementation uses file system storage, which won't persist in serverless environments. Consider:
- Using a database (PostgreSQL, MySQL)
- Using cloud storage (S3, R2)
- Using KV storage (Cloudflare KV, Vercel KV)

---

## Need Help?

- Remix Discord: https://rmx.as/discord
- Remix Docs: https://remix.run/docs
- Platform-specific support:
  - Vercel: https://vercel.com/support
  - Netlify: https://answers.netlify.com
  - Fly.io: https://community.fly.io
  - Railway: https://railway.app/help
