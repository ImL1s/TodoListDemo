# Next.js 14 Todo List - 全棧應用

一個使用 Next.js 14 App Router 構建的全棧 Todo List 應用，展示了現代化 Web 開發的最佳實踐。

## 技術棧

- **Next.js 14** - React 元框架，App Router 架構
- **TypeScript** - 類型安全
- **React 18** - Server Components & Client Components
- **API Routes** - 內建後端 API
- **文件系統** - 數據持久化

## 項目結構

```
01-nextjs/
├── app/
│   ├── api/
│   │   └── todos/
│   │       └── route.ts          # API 路由處理器
│   ├── components/
│   │   ├── TodoInput.tsx         # 客戶端組件（輸入）
│   │   ├── TodoItem.tsx          # 客戶端組件（項目）
│   │   └── TodoList.tsx          # 客戶端組件（列表）
│   ├── globals.css               # 全局樣式
│   ├── layout.tsx                # 根佈局（Server Component）
│   └── page.tsx                  # 首頁（Server Component）
├── data/
│   └── todos.json                # 數據存儲（自動生成）
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Next.js 14 核心特性

### 1. App Router 新架構

Next.js 14 引入了全新的 App Router，基於 React Server Components：

- **文件系統路由**：目錄結構即路由結構
- **佈局系統**：嵌套佈局，共享 UI
- **Server Components**：默認服務器端組件
- **流式渲染**：改善首屏加載性能

```typescript
// app/layout.tsx - 根佈局（Server Component）
export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
```

### 2. Server Components vs Client Components

#### Server Components（默認）
- 在服務器端渲染
- 可以直接訪問後端資源（數據庫、文件系統）
- 不包含在客戶端 JavaScript bundle 中
- 更好的性能和 SEO

```typescript
// app/page.tsx - Server Component
export default function Home() {
  return <TodoInput />
}
```

#### Client Components（'use client'）
- 在客戶端運行
- 可以使用 React Hooks（useState, useEffect）
- 處理用戶交互
- 訪問瀏覽器 API

```typescript
// app/components/TodoInput.tsx - Client Component
'use client'

export default function TodoInput() {
  const [text, setText] = useState('')
  // ...
}
```

### 3. API Routes（Route Handlers）

Next.js 14 的 API Routes 提供全棧能力：

```typescript
// app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server'

// GET /api/todos
export async function GET() {
  const todos = await readTodos()
  return NextResponse.json(todos)
}

// POST /api/todos
export async function POST(request: NextRequest) {
  const { text } = await request.json()
  // ...
  return NextResponse.json(newTodo, { status: 201 })
}

// PATCH /api/todos
export async function PATCH(request: NextRequest) {
  // ...
}

// DELETE /api/todos
export async function DELETE(request: NextRequest) {
  // ...
}
```

**API Routes 特點：**
- RESTful API 設計
- 支持所有 HTTP 方法
- 類型安全的請求/響應
- 內建錯誤處理
- 與前端共享類型定義

### 4. 數據持久化

使用 Node.js 文件系統 API：

```typescript
import { promises as fs } from 'fs'
import path from 'path'

async function readTodos(): Promise<Todo[]> {
  const data = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(data)
}

async function writeTodos(todos: Todo[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2))
}
```

## SSR（Server-Side Rendering）優勢

### 1. 性能優化

- **更快的首屏加載**：服務器預渲染 HTML
- **更小的 JavaScript Bundle**：Server Components 不發送到客戶端
- **流式渲染**：逐步發送內容

### 2. SEO 優化

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Next.js 14 Todo App',
  description: 'Full-stack Todo List application',
}
```

- 搜索引擎可以直接索引 HTML 內容
- 動態生成 meta 標籤
- Open Graph 支持

### 3. 用戶體驗

- 無需等待 JavaScript 加載即可看到內容
- 漸進式增強
- 更好的可訪問性

## 架構優勢

### 1. 全棧能力

```
Frontend (Client Components)
     ↓ fetch API
API Routes (Route Handlers)
     ↓ file system
Data Layer (JSON files)
```

**單一代碼庫：**
- 前端和後端在同一個項目中
- 共享 TypeScript 類型
- 統一的構建和部署

### 2. 混合渲染模式

- **SSR**：服務器端渲染（默認）
- **CSR**：客戶端渲染（Client Components）
- **SSG**：靜態站點生成（可選）
- **ISR**：增量靜態再生（可選）

### 3. 內建優化

- **自動代碼分割**：按路由分割
- **圖片優化**：next/image 組件
- **字體優化**：next/font 模塊
- **Script 優化**：next/script 組件

## 功能實現

### 1. Todo CRUD 操作

| 操作 | API 端點 | HTTP 方法 |
|------|---------|----------|
| 獲取所有 | `/api/todos` | GET |
| 新增 | `/api/todos` | POST |
| 更新狀態 | `/api/todos` | PATCH |
| 刪除 | `/api/todos` | DELETE |

### 2. 狀態管理

- **Client Components**：使用 React useState/useEffect
- **事件通信**：CustomEvent 觸發更新
- **數據同步**：API 調用後重新獲取

```typescript
// 觸發更新
window.dispatchEvent(new Event('todosUpdated'))

// 監聽更新
window.addEventListener('todosUpdated', handleUpdate)
```

### 3. 過濾功能

- 全部 todos
- 進行中（未完成）
- 已完成

### 4. 響應式設計

- 移動優先設計
- 斷點：640px, 400px
- 自適應佈局

## 開發指南

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問：http://localhost:3000

### 生產構建

```bash
npm run build
npm start
```

## Next.js 14 vs 傳統 SPA

| 特性 | Next.js 14 | 傳統 SPA (React) |
|------|-----------|-----------------|
| 渲染模式 | SSR + CSR 混合 | 僅 CSR |
| 首屏加載 | 快（預渲染 HTML） | 慢（等待 JS） |
| SEO | 優秀 | 需要額外配置 |
| 後端 API | 內建 | 需要單獨服務器 |
| 路由 | 文件系統路由 | 代碼配置路由 |
| 代碼分割 | 自動 | 需要手動配置 |
| 部署 | 單一應用 | 前後端分離 |

## Next.js 14 關鍵概念

### 1. App Router vs Pages Router

```
App Router (新)          Pages Router (舊)
app/                     pages/
├── layout.tsx          ├── _app.tsx
├── page.tsx            ├── index.tsx
└── api/                └── api/
    └── todos/              └── todos.ts
        └── route.ts
```

### 2. Server Actions（實驗性）

未來可以直接在組件中調用服務器函數：

```typescript
async function addTodo(formData: FormData) {
  'use server'
  // 直接在服務器端執行
}
```

### 3. 流式渲染

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <TodoList />
    </Suspense>
  )
}
```

## 性能最佳實踐

### 1. 組件優化

- 合理使用 Server Components
- Client Components 只在需要時使用
- 避免不必要的 'use client'

### 2. 數據獲取

```typescript
// Server Component - 直接獲取數據
export default async function Page() {
  const data = await fetch('...')
  return <div>{data}</div>
}
```

### 3. 緩存策略

```typescript
// 緩存控制
export const revalidate = 3600 // 1小時後重新驗證
export const dynamic = 'force-dynamic' // 強制動態渲染
```

## 部署

### Vercel（推薦）

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 其他平台

- **Docker**：支持容器化部署
- **Node.js**：任何支持 Node.js 的平台
- **靜態導出**：`next export`（有限制）

## 擴展建議

### 1. 數據庫集成

```typescript
// app/api/todos/route.ts
import { db } from '@/lib/db'

export async function GET() {
  const todos = await db.todo.findMany()
  return NextResponse.json(todos)
}
```

支持的數據庫：
- PostgreSQL (Prisma)
- MongoDB
- MySQL
- Supabase

### 2. 認證

```typescript
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ...
}
```

推薦方案：
- NextAuth.js
- Clerk
- Auth0

### 3. 實時更新

- **Server-Sent Events (SSE)**
- **WebSocket**
- **Supabase Realtime**

### 4. 狀態管理

- **Zustand**：輕量級
- **Redux Toolkit**：複雜應用
- **Jotai**：原子化狀態

## 學習資源

- [Next.js 官方文檔](https://nextjs.org/docs)
- [App Router 指南](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 總結

Next.js 14 提供了一個完整的全棧解決方案：

1. **開發體驗**：TypeScript、熱重載、文件系統路由
2. **性能優化**：Server Components、自動優化、流式渲染
3. **全棧能力**：API Routes、數據庫集成、認證
4. **生產就緒**：SEO、性能、安全性

這個 Todo List 應用展示了 Next.js 14 的核心特性，是學習現代全棧開發的絕佳起點！
