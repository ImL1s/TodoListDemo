# Astro Todo List - Islands Architecture

一個使用 Astro 構建的高性能 Todo List 應用，展示了 Islands Architecture（孤島架構）、零 JS 默認、部分水合和多框架支持等現代前端技術。

## 技術棧

- **Astro 4** - 現代化靜態站點生成器
- **React 18** - 用於交互式組件
- **Vue 3** - 展示多框架支持
- **TypeScript** - 類型安全
- **LocalStorage** - 客戶端數據持久化

## 項目結構

```
05-astro/
├── src/
│   ├── pages/
│   │   └── index.astro           # 主頁面（SSG）
│   ├── components/
│   │   ├── TodoInput.tsx         # React 組件（部分水合）
│   │   ├── TodoList.tsx          # React 組件（部分水合）
│   │   ├── TodoItem.tsx          # React 組件
│   │   └── FrameworkBadge.vue    # Vue 組件（展示多框架）
│   └── styles/
│       └── global.css            # 全局樣式
├── astro.config.mjs              # Astro 配置
├── package.json
├── tsconfig.json
└── README.md
```

## Astro 核心特性

### 1. 零 JS 默認（Zero JS by Default）

Astro 的核心理念：**默認不發送 JavaScript 到客戶端**。

```astro
---
// index.astro - 這部分在構建時運行，不會發送到客戶端
const buildTime = new Date().toLocaleString('zh-TW');
---

<!-- 這是純 HTML，沒有 JavaScript -->
<header class="app-header">
  <h1>Astro Todo List</h1>
  <p class="subtitle">Zero JS Default</p>
</header>

<!-- 這個 footer 也是純 HTML，零 JS -->
<footer class="app-footer">
  <p>Built at: {buildTime}</p>
</footer>
```

**優勢：**
- 更快的頁面加載速度
- 更小的 bundle 大小
- 更好的性能分數
- 優秀的 SEO

### 2. Islands Architecture（孤島架構）

Astro 使用 **Islands Architecture** - 只有需要交互的組件才會加載 JavaScript。

```
┌─────────────────────────────────────┐
│  靜態 HTML（零 JS）                   │
│  ┌──────────┐    ┌──────────┐       │
│  │ Island 1 │    │ Island 2 │       │  ← 只有這些"島"有 JS
│  │ (React)  │    │ (Vue)    │       │
│  └──────────┘    └──────────┘       │
│                                     │
│  更多靜態 HTML...                    │
└─────────────────────────────────────┘
```

**概念：**
- 頁面大部分是靜態 HTML（海洋）
- 交互式組件是孤立的"島嶼"
- 每個島嶼獨立水合，互不影響
- 最小化 JavaScript 體積

### 3. 部分水合（Partial Hydration）

Astro 提供多種水合策略，精確控制何時加載 JavaScript：

#### client:load（立即加載）
```astro
<TodoInput client:load />
```
頁面加載時立即水合，適用於：
- 首屏可見的交互組件
- 需要立即響應的表單

#### client:idle（空閒時加載）
```astro
<Analytics client:idle />
```
瀏覽器空閒時水合，適用於：
- 非關鍵功能
- 分析工具
- 聊天小部件

#### client:visible（可見時加載）
```astro
<FrameworkBadge client:visible />
```
組件進入視口時才水合，適用於：
- 頁面下方的內容
- 評論區
- 推薦商品

#### client:media（媒體查詢）
```astro
<Sidebar client:media="(max-width: 768px)" />
```
滿足媒體查詢時水合，適用於：
- 響應式組件
- 移動端專屬功能

#### client:only（僅客戶端）
```astro
<Map client:only="react" />
```
跳過 SSR，只在客戶端渲染，適用於：
- 依賴瀏覽器 API 的組件
- 第三方組件（地圖、圖表）

### 4. 多框架支持（Multi-Framework）

Astro 的殺手級特性：**在同一個項目中混用不同框架**。

```astro
---
// 可以同時導入 React、Vue、Svelte、Solid 等組件！
import ReactComponent from './ReactComponent';
import VueComponent from './VueComponent.vue';
import SvelteComponent from './SvelteComponent.svelte';
---

<div>
  <ReactComponent client:load />
  <VueComponent client:visible />
  <SvelteComponent client:idle />
</div>
```

**為什麼這很重要：**
- 逐步遷移現有項目（從 React 遷移到 Vue）
- 使用最適合的框架實現特定功能
- 整合第三方組件（不受框架限制）
- 團隊成員可以使用熟悉的框架

**本項目示例：**
- **React**：TodoInput、TodoList（使用 React Hooks）
- **Vue**：FrameworkBadge（使用 Vue 3 Composition API）
- **Astro**：主頁面佈局（原生 Astro 組件）

### 5. SSG 優化（Static Site Generation）

Astro 默認生成靜態 HTML，在構建時完成所有渲染。

```astro
---
// 這段代碼在構建時執行（npm run build）
const buildTime = new Date().toLocaleString('zh-TW');
const pageTitle = 'Astro Todo List';

// 可以在這裡調用 API、讀取文件等
// const data = await fetch('...')
---

<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <title>{pageTitle}</title>
  </head>
  <body>
    <p>Built at: {buildTime}</p>
  </body>
</html>
```

**SSG 優勢：**
- **極快的加載速度**：預生成的 HTML
- **零服務器成本**：可部署到靜態托管（Netlify、Vercel）
- **完美的 SEO**：搜索引擎直接索引 HTML
- **高安全性**：沒有服務器端漏洞

## 核心架構對比

### Astro vs Next.js vs 傳統 SPA

| 特性 | Astro | Next.js 14 | 傳統 SPA |
|------|-------|-----------|---------|
| 默認 JS | 零 JS | 較多 | 較多 |
| 渲染模式 | SSG（默認） | SSR/SSG 混合 | CSR |
| 水合策略 | 部分水合 | 全頁面水合 | 全頁面 JS |
| 框架支持 | 多框架 | React 為主 | 單框架 |
| 構建產物 | 靜態 HTML | 動態 + 靜態 | SPA Bundle |
| 適用場景 | 內容網站 | 全棧應用 | Web 應用 |
| 後端 API | 需要額外配置 | 內建 | 需要獨立服務 |

### Islands Architecture vs 傳統架構

**傳統 SPA（如 React）：**
```
整個頁面都是 JavaScript
┌─────────────────────────┐
│ ████████████████████████ │  ← 所有內容都需要 JS
│ ████████████████████████ │
│ ████████████████████████ │
└─────────────────────────┘
Bundle: 500KB+
```

**Next.js SSR：**
```
服務器渲染 HTML + 全頁面水合
┌─────────────────────────┐
│ HTML████████████████████ │  ← 初始 HTML（快）
│ ████████████████████████ │  ← 然後全部水合（較慢）
│ ████████████████████████ │
└─────────────────────────┘
Bundle: 300KB+
```

**Astro Islands：**
```
靜態 HTML + 選擇性水合
┌─────────────────────────┐
│ 靜態 HTML                │  ← 大部分是純 HTML（零 JS）
│ ┌────┐  ┌────┐          │  ← 只有這些需要 JS
│ │🏝️ │  │🏝️ │  HTML    │
└─────────────────────────┘
Bundle: 50KB-
```

## 功能實現

### 1. 數據持久化

Astro 是靜態站點生成器，沒有內建後端，使用 localStorage 實現客戶端持久化：

```typescript
// 保存 todos
localStorage.setItem('astro-todos', JSON.stringify(todos));

// 讀取 todos
const todos = JSON.parse(localStorage.getItem('astro-todos') || '[]');
```

**其他持久化方案：**
- **Supabase**：後端即服務（BaaS）
- **Firebase**：Google 的 BaaS 方案
- **靜態 API**：結合 Netlify Functions、Vercel Edge Functions
- **靜態 JSON**：構建時生成靜態數據文件

### 2. 組件通信

使用原生瀏覽器 API 實現組件間通信：

```typescript
// TodoInput.tsx - 發送事件
window.dispatchEvent(new CustomEvent('todosUpdated'));

// TodoList.tsx - 監聽事件
useEffect(() => {
  const handleUpdate = () => loadTodos();
  window.addEventListener('todosUpdated', handleUpdate);

  return () => {
    window.removeEventListener('todosUpdated', handleUpdate);
  };
}, []);
```

**為什麼不用 React Context？**
- Astro 組件是獨立的"島嶼"
- 不同島嶼之間沒有共享的 React 上下文
- 使用瀏覽器 API 更通用（跨框架）

### 3. TypeScript 支持

Astro 原生支持 TypeScript：

```typescript
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### 4. 響應式設計

使用 CSS 媒體查詢實現響應式佈局：

```css
@media (max-width: 640px) {
  .todo-input-form {
    flex-direction: column;
  }
}
```

## 開發指南

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問：http://localhost:4321

**開發模式特性：**
- 熱模塊替換（HMR）
- 快速刷新
- 錯誤提示

### 生產構建

```bash
npm run build
```

構建產物在 `dist/` 目錄：

```
dist/
├── index.html          # 靜態 HTML（極小體積）
├── _astro/
│   ├── page.*.js      # 僅交互組件的 JS
│   └── page.*.css     # CSS
└── ...
```

### 預覽構建

```bash
npm run preview
```

## 性能優勢

### 1. 極小的 JavaScript Bundle

**對比（典型 Todo 應用）：**
- 傳統 React SPA：~150KB（gzipped）
- Next.js SSR：~80KB（gzipped）
- **Astro**：~15KB（gzipped）✨

**為什麼這麼小？**
- 靜態內容零 JS
- 只有交互組件有 JS
- 自動代碼分割
- 按需水合

### 2. 更快的首屏加載

**性能指標（Lighthouse）：**
- FCP（First Contentful Paint）：< 0.5s
- LCP（Largest Contentful Paint）：< 1.0s
- TTI（Time to Interactive）：< 1.5s
- TBT（Total Blocking Time）：< 100ms

**為什麼這麼快？**
- 預渲染的 HTML（SSG）
- 最小化 JavaScript
- 優化的資源加載
- 內建圖片優化

### 3. 完美的 SEO

```astro
---
// 構建時生成完整 HTML
---

<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta name="description" content="..." />
    <meta property="og:title" content="..." />
    <!-- 完整的 meta 標籤 -->
  </head>
  <body>
    <!-- 搜索引擎可以直接索引的內容 -->
    <h1>Astro Todo List</h1>
  </body>
</html>
```

## 部署

### Netlify（推薦）

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 構建
npm run build

# 部署
netlify deploy --prod --dir=dist
```

### Vercel

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 靜態托管

構建後將 `dist/` 目錄上傳到任何靜態托管服務：
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 擴展建議

### 1. 添加後端 API

使用 **Netlify Functions** 或 **Vercel Edge Functions**：

```typescript
// netlify/functions/todos.ts
export async function handler(event) {
  // API 邏輯
  return {
    statusCode: 200,
    body: JSON.stringify({ todos: [] }),
  };
}
```

### 2. 數據庫集成

推薦使用無服務器數據庫：

```typescript
// src/lib/db.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_KEY
);

export async function getTodos() {
  const { data } = await supabase.from('todos').select('*');
  return data;
}
```

### 3. 添加更多框架

```bash
# 添加 Svelte
npx astro add svelte

# 添加 Solid
npx astro add solid

# 添加 Preact
npx astro add preact
```

### 4. 圖片優化

使用 Astro 內建的 `<Image />` 組件：

```astro
---
import { Image } from 'astro:assets';
import myImage from './my-image.png';
---

<Image src={myImage} alt="描述" />
```

**自動優化：**
- 響應式圖片
- 現代格式（WebP、AVIF）
- 延遲加載
- 自動尺寸調整

### 5. 內容集合（Content Collections）

管理 Markdown/MDX 內容：

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

export const collections = { blog };
```

## Astro vs 其他框架

### 何時使用 Astro？

**✅ 適合 Astro：**
- 內容網站（博客、文檔、營銷頁面）
- 電子商務網站（產品目錄）
- 企業網站、作品集
- 靜態頁面為主的應用

**❌ 不適合 Astro：**
- 高度交互的 Web 應用（如 Figma、Notion）
- 需要實時更新的應用（如聊天、協作工具）
- 需要複雜後端邏輯的應用

### 何時使用 Next.js？

**Next.js 優勢：**
- 全棧能力（內建 API Routes）
- 服務器端渲染（SSR）
- 複雜的路由邏輯
- 實時數據需求

### 最佳實踐

**選擇建議：**
1. **內容為主** → 選擇 Astro
2. **應用為主** → 選擇 Next.js、Remix
3. **混合場景** → Astro（內容）+ Next.js（應用）

## 學習資源

- [Astro 官方文檔](https://astro.build/)
- [Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [部分水合](https://docs.astro.build/en/core-concepts/framework-components/#hydrating-interactive-components)
- [Astro + React](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro + Vue](https://docs.astro.build/en/guides/integrations-guide/vue/)

## 總結

Astro 是一個革命性的前端框架，核心理念是：

1. **零 JS 默認**：只在需要時發送 JavaScript
2. **Islands Architecture**：孤島式架構，最小化水合
3. **多框架支持**：在同一項目中混用 React、Vue、Svelte
4. **SSG 優化**：極致的靜態站點生成性能
5. **開發者體驗**：簡單、直觀、強大

這個 Todo List 應用展示了 Astro 的核心特性，是學習現代靜態站點生成的絕佳範例！

## 關鍵概念回顧

### Islands Architecture（孤島架構）
```
🌊🌊🌊🌊🌊🌊🌊🌊
🌊 HTML 🏝️React 🌊
🌊🌊🌊 🏝️Vue 🌊🌊
🌊🌊🌊🌊🌊🌊🌊🌊
```

只有"島嶼"（🏝️）需要 JavaScript，其他都是靜態 HTML（🌊）。

### 部分水合（Partial Hydration）
```typescript
<Component client:load />     // 立即水合
<Component client:idle />     // 空閒時水合
<Component client:visible />  // 可見時水合
<Component client:media="..." /> // 媒體查詢
<Component client:only />     // 僅客戶端
```

### 性能收益
```
傳統 SPA:  ████████████████ 500KB
Next.js:   ██████████ 300KB
Astro:     ██ 50KB ✨
```

這就是 Astro 的力量！
