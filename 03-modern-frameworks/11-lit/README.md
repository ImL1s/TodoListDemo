# Lit Todo List Application

[![Lit](https://img.shields.io/badge/Lit-3.1.0-324FFF?style=flat&logo=lit&logoColor=white)](https://lit.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Web Components](https://img.shields.io/badge/Web_Components-Standard-29ABE2?style=flat)](https://www.webcomponents.org/)

一個使用 **Lit** (Google 開發的 Web Components 庫) 建構的現代化 Todo List 應用程式。Lit 提供了簡單、快速且符合標準的方式來建構可重用的 Web Components。

## 目錄

- [什麼是 Lit？](#什麼是-lit)
- [什麼是 Web Components？](#什麼是-web-components)
- [為什麼選擇 Lit？](#為什麼選擇-lit)
- [Lit vs React/Vue/Angular](#lit-vs-reactvueangular)
- [專案特色](#專案特色)
- [技術架構](#技術架構)
- [專案結構](#專案結構)
- [安裝與運行](#安裝與運行)
- [核心概念](#核心概念)
- [組件詳解](#組件詳解)
- [Lit 核心 API](#lit-核心-api)
- [Shadow DOM 說明](#shadow-dom-說明)
- [狀態管理](#狀態管理)
- [事件系統](#事件系統)
- [樣式系統](#樣式系統)
- [TypeScript 裝飾器](#typescript-裝飾器)
- [在其他框架中使用](#在其他框架中使用)
- [性能優化](#性能優化)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)
- [學習資源](#學習資源)

---

## 什麼是 Lit？

**Lit** 是由 Google 開發的一個輕量級 Web Components 庫，旨在讓開發者更容易地建構快速、輕量且符合標準的 Web Components。

### Lit 的核心特性

#### 1. **極致輕量** 📦

```
lit-core: ~5KB (gzipped)
lit-html: ~3KB (gzipped)
總計: ~8KB
```

相比其他框架：
- React: ~40KB (僅核心)
- Vue: ~34KB
- Angular: ~70KB+

#### 2. **基於標準** 🎯

Lit 完全基於 Web Components 標準：
- **Custom Elements**: 定義新的 HTML 元素
- **Shadow DOM**: 樣式和標記封裝
- **HTML Templates**: 可重用的 HTML 模板
- **ES Modules**: 原生模組系統

```typescript
// Lit 組件就是標準的 Web Component
class MyElement extends HTMLElement {
  // 完全符合 Web 標準
}
```

#### 3. **高性能渲染** ⚡

Lit 使用增量 DOM 更新策略：
- 只更新變化的部分
- 使用模板字面量進行高效解析
- 最小化 DOM 操作

```typescript
// Lit 的高效模板系統
render() {
  return html`
    <div>${this.dynamicValue}</div>
    <!-- 只有 dynamicValue 變化時才重新渲染 -->
  `;
}
```

#### 4. **優秀的開發體驗** 🛠️

- TypeScript 裝飾器支援
- 響應式屬性系統
- 豐富的指令庫
- 優秀的 IDE 支援

---

## 什麼是 Web Components？

**Web Components** 是一組 Web 平台 API，允許你建立可重用的自定義元素，並在 Web 應用中使用它們。

### Web Components 的三大支柱

#### 1. Custom Elements (自定義元素)

允許你定義新的 HTML 標籤：

```javascript
// 定義自定義元素
class MyButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<button>Click me!</button>';
  }
}

// 註冊自定義元素
customElements.define('my-button', MyButton);
```

```html
<!-- 在 HTML 中使用 -->
<my-button></my-button>
```

#### 2. Shadow DOM (影子 DOM)

提供封裝機制，隔離樣式和標記：

```javascript
class MyElement extends HTMLElement {
  constructor() {
    super();
    // 建立 Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        /* 這些樣式不會影響外部 */
        p { color: red; }
      </style>
      <p>我是紅色的</p>
    `;
  }
}
```

#### 3. HTML Templates (HTML 模板)

使用 `<template>` 和 `<slot>` 建立可重用模板：

```html
<template id="my-template">
  <style>
    .container { padding: 20px; }
  </style>
  <div class="container">
    <slot name="title"></slot>
    <slot></slot>
  </div>
</template>
```

### 瀏覽器支援

Web Components 已被所有現代瀏覽器原生支援：

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Custom Elements | ✅ 67+ | ✅ 63+ | ✅ 13.1+ | ✅ 79+ |
| Shadow DOM | ✅ 53+ | ✅ 63+ | ✅ 10.1+ | ✅ 79+ |
| HTML Templates | ✅ 26+ | ✅ 22+ | ✅ 8+ | ✅ 13+ |

---

## 為什麼選擇 Lit？

### 1. **與框架無關** 🔄

Lit 組件可以在任何環境中使用：

```html
<!-- Vanilla JavaScript -->
<script type="module">
  import './todo-app.js';
</script>
<todo-app></todo-app>

<!-- React -->
<TodoApp />

<!-- Vue -->
<todo-app></todo-app>

<!-- Angular -->
<todo-app></todo-app>
```

### 2. **真正的封裝** 🔒

使用 Shadow DOM 實現真正的樣式隔離：

```typescript
@customElement('my-button')
class MyButton extends LitElement {
  static styles = css`
    /* 這些樣式只影響此組件 */
    button {
      background: blue;
      color: white;
    }
  `;

  render() {
    return html`<button><slot></slot></button>`;
  }
}
```

頁面上的其他 `<button>` 樣式不受影響！

### 3. **未來導向** 🚀

基於 Web 標準，不受特定框架限制：
- 不會過時
- 不需要遷移
- 長期穩定

### 4. **輕量高效** ⚡

```
應用大小比較 (生產環境):
- Lit Todo App: ~15KB
- React Todo App: ~45KB
- Vue Todo App: ~38KB
- Angular Todo App: ~85KB
```

### 5. **漸進式採用** 📈

可以逐步將 Lit 組件整合到現有專案：

```html
<!-- 在現有 React 應用中使用 Lit 組件 -->
<div className="app">
  <ReactHeader />
  <todo-app></todo-app>  <!-- Lit 組件 -->
  <ReactFooter />
</div>
```

---

## Lit vs React/Vue/Angular

### 詳細對比表

| 特性 | Lit | React | Vue | Angular |
|------|-----|-------|-----|---------|
| **大小** | ~8KB | ~40KB | ~34KB | ~70KB+ |
| **基礎** | Web Components | Virtual DOM | Virtual DOM | TypeScript + RxJS |
| **標準** | ✅ 完全基於標準 | ❌ 專有 API | ⚠️ 部分標準 | ❌ 專有框架 |
| **學習曲線** | ⭐⭐ 簡單 | ⭐⭐⭐ 中等 | ⭐⭐ 簡單 | ⭐⭐⭐⭐ 複雜 |
| **TypeScript** | ✅ 一流支援 | ✅ 一流支援 | ✅ 一流支援 | ✅ 內建 |
| **SSR** | ⚠️ 需額外工具 | ✅ 完整支援 | ✅ 完整支援 | ✅ 完整支援 |
| **生態系統** | ⭐⭐⭐ 成長中 | ⭐⭐⭐⭐⭐ 龐大 | ⭐⭐⭐⭐ 豐富 | ⭐⭐⭐⭐ 完整 |
| **可重用性** | ✅ 跨框架 | ❌ 僅 React | ❌ 僅 Vue | ❌ 僅 Angular |
| **性能** | ⚡⚡⚡ 優秀 | ⚡⚡ 良好 | ⚡⚡⚡ 優秀 | ⚡⚡ 良好 |

### 程式碼對比

#### React 版本

```jsx
import { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput('');
  };

  return (
    <div className="todo-app">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
      {todos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
```

#### Vue 版本

```vue
<template>
  <div class="todo-app">
    <input v-model="input" />
    <button @click="addTodo">Add</button>
    <div v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const todos = ref([]);
const input = ref('');

const addTodo = () => {
  todos.value.push({ id: Date.now(), text: input.value });
  input.value = '';
};
</script>
```

#### Lit 版本

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('todo-app')
class TodoApp extends LitElement {
  static styles = css`
    .todo-app { padding: 20px; }
  `;

  @state() todos = [];
  @state() input = '';

  addTodo() {
    this.todos = [...this.todos, { id: Date.now(), text: this.input }];
    this.input = '';
  }

  render() {
    return html`
      <div class="todo-app">
        <input
          .value=${this.input}
          @input=${(e) => this.input = e.target.value}
        />
        <button @click=${this.addTodo}>Add</button>
        ${this.todos.map(todo => html`
          <div key=${todo.id}>${todo.text}</div>
        `)}
      </div>
    `;
  }
}
```

### 何時選擇 Lit？

✅ **適合使用 Lit 的場景：**

1. **設計系統和組件庫**
   - 需要跨多個專案使用
   - 需要與不同框架整合
   - 長期維護和穩定性

2. **漸進式增強**
   - 現有網站需要添加互動組件
   - 不想重寫整個應用
   - 輕量級解決方案

3. **微前端架構**
   - 不同團隊使用不同技術棧
   - 需要組件互通
   - 獨立部署和版本控制

4. **公共 Web 組件**
   - CDN 分發
   - 嵌入第三方網站
   - 最小化依賴

❌ **不太適合 Lit 的場景：**

1. **複雜的 SPA**
   - 需要完整的路由解決方案
   - 複雜的狀態管理
   - SSR 是必需的

2. **團隊已深度使用某框架**
   - 已有大量 React/Vue 代碼
   - 團隊熟悉特定框架
   - 不需要跨框架共享

---

## 專案特色

### 功能特性

- ✅ **新增待辦事項**：快速添加新任務
- ✅ **編輯待辦事項**：內聯編輯任務內容
- ✅ **標記完成/未完成**：追蹤任務狀態
- ✅ **刪除待辦事項**：移除不需要的任務
- ✅ **篩選功能**：全部/進行中/已完成
- ✅ **統計資訊**：即時顯示任務統計
- ✅ **LocalStorage 持久化**：自動保存數據
- ✅ **響應式設計**：支援各種螢幕尺寸
- ✅ **無障礙支援**：完整的 ARIA 標籤

### 技術特性

- 🎯 **Web Components 標準**：完全符合 W3C 標準
- 🎨 **Shadow DOM 封裝**：樣式和邏輯隔離
- 📦 **TypeScript 支援**：完整的類型安全
- ⚡ **Vite 構建**：快速的開發和構建體驗
- 🎭 **裝飾器語法**：現代化的類屬性定義
- 🔄 **響應式更新**：自動追蹤變化並更新 UI
- 🎪 **自定義事件**：組件間通訊
- 💅 **CSS-in-JS**：組件級樣式定義

---

## 技術架構

### 技術棧

```
┌─────────────────────────────────────┐
│         應用層 (Application)         │
│     todo-app.ts (主組件)            │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│        組件層 (Components)           │
│  - todo-input.ts (輸入組件)         │
│  - todo-list.ts (列表組件)          │
│  - todo-item.ts (項目組件)          │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         框架層 (Framework)           │
│            Lit 3.1.0                │
│  - LitElement (基類)                │
│  - html (模板函數)                   │
│  - css (樣式函數)                    │
│  - 裝飾器 (@customElement, etc)     │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│       平台層 (Web Platform)          │
│  - Custom Elements API              │
│  - Shadow DOM API                   │
│  - HTML Templates                   │
│  - ES Modules                       │
└─────────────────────────────────────┘
```

### 數據流

```
                用戶操作
                  ↓
            組件事件處理
                  ↓
          更新內部狀態 (@state)
                  ↓
         Lit 自動追蹤變化
                  ↓
           重新渲染組件
                  ↓
        僅更新變化的 DOM
                  ↓
        保存到 LocalStorage
```

### 組件關係圖

```
                    todo-app
                    (主容器)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   todo-input      todo-list      Statistics
   (輸入框)        (列表容器)      (統計信息)
                        │
                    ┌───┴───┐
                    │       │
                todo-item todo-item
                (單個項目) (單個項目)
```

---

## 專案結構

```
03-modern-frameworks/11-lit/
├── index.html                    # HTML 入口文件
├── package.json                  # 專案配置和依賴
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts                # Vite 構建配置
├── README.md                     # 專案文檔
│
└── src/
    ├── todo-app.ts              # 主應用組件
    ├── types.ts                 # TypeScript 類型定義
    ├── styles.css               # 全局樣式
    │
    └── components/
        ├── todo-input.ts        # 輸入組件
        ├── todo-list.ts         # 列表組件
        └── todo-item.ts         # 單項組件
```

### 文件說明

#### `index.html`
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Lit Todo List</title>
</head>
<body>
  <!-- 使用自定義元素 -->
  <todo-app></todo-app>

  <!-- 導入主組件 -->
  <script type="module" src="/src/todo-app.ts"></script>
</body>
</html>
```

#### `package.json`
```json
{
  "dependencies": {
    "lit": "^3.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

---

## 安裝與運行

### 前置需求

確保你的系統已安裝：

- **Node.js**: 18.0+ 或 20.0+
- **npm**: 9.0+ 或 **pnpm**: 8.0+ 或 **yarn**: 1.22+

檢查版本：

```bash
node --version  # 應該 >= 18.0.0
npm --version   # 應該 >= 9.0.0
```

### 安裝步驟

#### 1. 進入專案目錄

```bash
cd 03-modern-frameworks/11-lit
```

#### 2. 安裝依賴

使用 npm：
```bash
npm install
```

使用 pnpm：
```bash
pnpm install
```

使用 yarn：
```bash
yarn install
```

### 開發模式

啟動開發伺服器（支援熱模組替換）：

```bash
npm run dev
```

預設會在 `http://localhost:3000` 開啟瀏覽器。

開發模式特性：
- ⚡ 即時熱更新
- 🔍 Source Maps 支援
- 🐛 詳細錯誤訊息
- 📦 快速的模組載入

### 生產構建

建構生產版本：

```bash
npm run build
```

構建產物位於 `dist/` 目錄：
- 壓縮和優化的 JavaScript
- 樹搖優化（Tree Shaking）
- 程式碼分割
- 資源雜湊命名

### 預覽生產版本

預覽生產構建：

```bash
npm run preview
```

### 類型檢查

僅執行 TypeScript 類型檢查：

```bash
npm run type-check
```

---

## 核心概念

### 1. LitElement 基類

所有 Lit 組件都繼承自 `LitElement`：

```typescript
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-element')
class MyElement extends LitElement {
  // 組件定義
}
```

`LitElement` 提供：
- 生命週期鉤子
- 響應式屬性系統
- Shadow DOM 管理
- 高效的渲染引擎

### 2. 響應式屬性

使用 `@property()` 和 `@state()` 裝飾器：

```typescript
import { property, state } from 'lit/decorators.js';

class TodoApp extends LitElement {
  // 公共屬性（可從外部設置）
  @property({ type: String })
  title = 'My Todos';

  // 私有狀態（內部使用）
  @state()
  private todos: Todo[] = [];

  // 當這些屬性變化時，組件自動重新渲染
}
```

#### 屬性選項

```typescript
@property({
  type: String,           // 類型轉換
  attribute: 'todo-id',   // HTML 屬性名（kebab-case）
  reflect: true,          // 反映到 DOM 屬性
  converter: {            // 自定義轉換器
    fromAttribute: (value) => JSON.parse(value),
    toAttribute: (value) => JSON.stringify(value)
  },
  hasChanged: (newVal, oldVal) => newVal !== oldVal
})
customProp = '';
```

### 3. 模板系統

使用 `html` 標籤模板：

```typescript
render() {
  return html`
    <div class="container">
      <h1>${this.title}</h1>

      <!-- 條件渲染 -->
      ${this.showContent ? html`<p>Content</p>` : ''}

      <!-- 列表渲染 -->
      <ul>
        ${this.items.map(item => html`
          <li>${item.name}</li>
        `)}
      </ul>

      <!-- 事件綁定 -->
      <button @click=${this.handleClick}>Click</button>

      <!-- 屬性綁定 -->
      <input .value=${this.inputValue} />

      <!-- 布林屬性 -->
      <button ?disabled=${!this.canSubmit}>Submit</button>

      <!-- Class 綁定 -->
      <div class=${classMap({ active: this.isActive })}>
      </div>
    </div>
  `;
}
```

### 4. 樣式定義

使用 `css` 標籤定義樣式：

```typescript
static styles = css`
  :host {
    display: block;
    padding: 20px;
  }

  :host([hidden]) {
    display: none;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
  }

  /* CSS 變量 */
  button {
    background: var(--button-bg, blue);
  }
`;
```

### 5. 生命週期

```typescript
class MyElement extends LitElement {
  // 1. 組件被添加到 DOM
  connectedCallback() {
    super.connectedCallback();
    console.log('Component connected');
    // 設置事件監聽器
  }

  // 2. 首次更新前
  firstUpdated(changedProperties) {
    console.log('First render complete');
    // 訪問渲染後的 DOM
  }

  // 3. 每次更新後
  updated(changedProperties) {
    if (changedProperties.has('todos')) {
      console.log('Todos changed');
    }
  }

  // 4. 組件從 DOM 移除
  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('Component disconnected');
    // 清理事件監聽器
  }
}
```

生命週期順序：

```
constructor()
    ↓
connectedCallback()
    ↓
render()
    ↓
firstUpdated()
    ↓
updated()
    ↓
disconnectedCallback()
```

---

## 組件詳解

### TodoApp (主組件)

主應用組件，管理全局狀態和協調子組件。

#### 核心功能

```typescript
@customElement('todo-app')
export class TodoApp extends LitElement {
  // 狀態管理
  @state() private todos: Todo[] = [];
  @state() private filter: FilterType = 'all';

  // LocalStorage 鍵
  private readonly STORAGE_KEY = 'lit-todos';

  // 生命週期
  connectedCallback() {
    super.connectedCallback();
    this.loadTodos();  // 從 LocalStorage 載入

    // 監聽子組件事件
    this.addEventListener('todo-add', this.handleAddTodo);
    this.addEventListener('todo-toggle', this.handleToggleTodo);
  }

  // 數據持久化
  private saveTodos() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
  }

  private loadTodos() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.todos = JSON.parse(stored);
    }
  }
}
```

#### 事件處理

```typescript
// 新增 Todo
private handleAddTodo = (e: CustomEvent<{ text: string }>) => {
  const newTodo: Todo = {
    id: this.generateId(),
    text: e.detail.text,
    completed: false,
    createdAt: Date.now()
  };

  this.todos = [...this.todos, newTodo];
  this.saveTodos();
};

// 切換狀態
private handleToggleTodo = (e: CustomEvent<{ id: string }>) => {
  this.todos = this.todos.map(todo =>
    todo.id === e.detail.id
      ? { ...todo, completed: !todo.completed }
      : todo
  );
  this.saveTodos();
};

// 刪除 Todo
private handleDeleteTodo = (e: CustomEvent<{ id: string }>) => {
  this.todos = this.todos.filter(todo => todo.id !== e.detail.id);
  this.saveTodos();
};
```

#### 過濾邏輯

```typescript
private getFilteredTodos(): Todo[] {
  switch (this.filter) {
    case 'active':
      return this.todos.filter(todo => !todo.completed);
    case 'completed':
      return this.todos.filter(todo => todo.completed);
    default:
      return this.todos;
  }
}
```

### TodoInput (輸入組件)

處理用戶輸入並發送事件。

```typescript
@customElement('todo-input')
export class TodoInput extends LitElement {
  @state() private inputValue = '';

  private handleSubmit(e: Event) {
    e.preventDefault();

    const trimmedValue = this.inputValue.trim();
    if (!trimmedValue) return;

    // 發送自定義事件
    this.dispatchEvent(new CustomEvent('todo-add', {
      detail: { text: trimmedValue },
      bubbles: true,      // 向上冒泡
      composed: true      // 穿透 Shadow DOM
    }));

    this.inputValue = '';  // 清空輸入
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <input
          .value=${this.inputValue}
          @input=${(e) => this.inputValue = e.target.value}
          placeholder="新增待辦事項..."
        />
        <button type="submit">新增</button>
      </form>
    `;
  }
}
```

### TodoList (列表組件)

展示 Todo 列表。

```typescript
@customElement('todo-list')
export class TodoList extends LitElement {
  @property({ type: Array })
  todos: Todo[] = [];

  render() {
    if (this.todos.length === 0) {
      return html`
        <div class="empty-state">
          目前沒有待辦事項
        </div>
      `;
    }

    // 使用 repeat 指令進行高效列表渲染
    return html`
      <div class="todo-list">
        ${repeat(
          this.todos,
          (todo) => todo.id,  // 鍵函數
          (todo) => html`
            <todo-item .todo=${todo}></todo-item>
          `
        )}
      </div>
    `;
  }
}
```

#### repeat 指令的優勢

```typescript
// 不使用 repeat (效率較低)
${this.todos.map(todo => html`<todo-item .todo=${todo}></todo-item>`)}

// 使用 repeat (效率更高)
${repeat(
  this.todos,
  (todo) => todo.id,  // 唯一鍵，Lit 用它追蹤元素
  (todo) => html`<todo-item .todo=${todo}></todo-item>`
)}
```

當列表順序改變時：
- **map**: 重新渲染所有項目
- **repeat**: 只移動 DOM 節點

### TodoItem (項目組件)

單個 Todo 項目的展示和操作。

```typescript
@customElement('todo-item')
export class TodoItem extends LitElement {
  @property({ type: Object })
  todo!: Todo;

  @state()
  private isEditing = false;

  @state()
  private editValue = '';

  private handleToggle() {
    this.dispatchEvent(new CustomEvent('todo-toggle', {
      detail: { id: this.todo.id },
      bubbles: true,
      composed: true
    }));
  }

  private handleDelete() {
    this.dispatchEvent(new CustomEvent('todo-delete', {
      detail: { id: this.todo.id },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="todo-item ${this.todo.completed ? 'completed' : ''}">
        <input
          type="checkbox"
          .checked=${this.todo.completed}
          @change=${this.handleToggle}
        />

        ${this.isEditing ? html`
          <input
            class="edit-input"
            .value=${this.editValue}
            @blur=${this.saveEdit}
          />
        ` : html`
          <span class="todo-text">${this.todo.text}</span>
        `}

        <button @click=${() => this.isEditing = true}>編輯</button>
        <button @click=${this.handleDelete}>刪除</button>
      </div>
    `;
  }
}
```

---

## Lit 核心 API

### 1. 模板指令

#### `classMap` - 動態 class

```typescript
import { classMap } from 'lit/directives/class-map.js';

render() {
  const classes = {
    'active': this.isActive,
    'disabled': this.isDisabled,
    'error': this.hasError
  };

  return html`
    <div class=${classMap(classes)}>
      內容
    </div>
  `;
}
```

#### `styleMap` - 動態樣式

```typescript
import { styleMap } from 'lit/directives/style-map.js';

render() {
  const styles = {
    color: this.textColor,
    'font-size': this.fontSize + 'px',
    display: this.isVisible ? 'block' : 'none'
  };

  return html`
    <div style=${styleMap(styles)}>內容</div>
  `;
}
```

#### `ifDefined` - 條件屬性

```typescript
import { ifDefined } from 'lit/directives/if-defined.js';

render() {
  return html`
    <input
      name="email"
      value=${ifDefined(this.email)}
      aria-label=${ifDefined(this.label)}
    />
  `;
}
```

#### `when` - 條件渲染

```typescript
import { when } from 'lit/directives/when.js';

render() {
  return html`
    ${when(
      this.user,
      () => html`<p>Welcome ${this.user.name}</p>`,
      () => html`<p>Please login</p>`
    )}
  `;
}
```

#### `cache` - 緩存模板

```typescript
import { cache } from 'lit/directives/cache.js';

render() {
  return html`
    ${cache(
      this.currentView === 'home'
        ? html`<home-view></home-view>`
        : html`<settings-view></settings-view>`
    )}
  `;
}
```

### 2. 事件綁定

```typescript
render() {
  return html`
    <!-- 標準事件 -->
    <button @click=${this.handleClick}>Click</button>

    <!-- 自定義事件 -->
    <custom-input @value-changed=${this.handleChange}></custom-input>

    <!-- 傳遞參數 -->
    <button @click=${() => this.delete(item.id)}>Delete</button>

    <!-- 事件修飾符（需自行實現） -->
    <button @click=${this.handleClickOnce}>Once</button>
  `;
}

handleClick(e: Event) {
  console.log('Clicked');
}

handleClickOnce = once((e: Event) => {
  console.log('This runs only once');
});
```

### 3. 屬性綁定

```typescript
render() {
  return html`
    <!-- 屬性綁定（Property） -->
    <input .value=${this.inputValue} />

    <!-- HTML 屬性（Attribute） -->
    <img src=${this.imageUrl} />

    <!-- 布林屬性 -->
    <button ?disabled=${!this.canSubmit}>Submit</button>

    <!-- 對象屬性 -->
    <todo-item .todo=${this.todoObject}></todo-item>
  `;
}
```

### 4. Slots (插槽)

```typescript
// 定義組件
@customElement('my-card')
class MyCard extends LitElement {
  render() {
    return html`
      <div class="card">
        <header>
          <slot name="title">Default Title</slot>
        </header>
        <main>
          <slot>Default content</slot>
        </main>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
    `;
  }
}

// 使用組件
html`
  <my-card>
    <h1 slot="title">My Title</h1>
    <p>This is the main content</p>
    <div slot="footer">Footer content</div>
  </my-card>
`
```

---

## Shadow DOM 說明

### 什麼是 Shadow DOM？

Shadow DOM 是 Web Components 的核心技術之一，提供了封裝機制。

#### Shadow DOM 結構

```
┌─────────────────────────────────┐
│      Light DOM (正常 DOM)        │
│                                  │
│  <my-element>                   │
│    ┌─────────────────────────┐  │
│    │   Shadow DOM (隔離)     │  │
│    │                         │  │
│    │  <style>                │  │
│    │    /* 內部樣式 */       │  │
│    │  </style>               │  │
│    │                         │  │
│    │  <div class="content">  │  │
│    │    <slot></slot>        │  │
│    │  </div>                 │  │
│    └─────────────────────────┘  │
│  </my-element>                  │
└─────────────────────────────────┘
```

### Shadow DOM 的優勢

#### 1. 樣式封裝

```typescript
@customElement('my-button')
class MyButton extends LitElement {
  static styles = css`
    button {
      background: blue;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
    }
  `;

  render() {
    return html`<button><slot></slot></button>`;
  }
}
```

```html
<!-- 外部樣式不影響組件內部 -->
<style>
  button {
    background: red;  /* 這不會影響 my-button 內的 button */
  }
</style>

<button>普通按鈕（紅色）</button>
<my-button>Shadow 按鈕（藍色）</my-button>
```

#### 2. DOM 封裝

```typescript
// 內部 DOM 結構對外部隱藏
const myButton = document.querySelector('my-button');

// 這會返回 null（內部元素被封裝）
const internalButton = myButton.querySelector('button');

// 需要通過 shadowRoot 訪問
const internalButton = myButton.shadowRoot.querySelector('button');
```

#### 3. 事件重定向

```typescript
// Shadow DOM 內的事件會重定向到宿主元素
class MyElement extends LitElement {
  render() {
    return html`
      <button @click=${this.handleClick}>Click</button>
    `;
  }

  handleClick(e: Event) {
    console.log(e.target);  // <my-element>（宿主）
    console.log(e.composedPath()[0]);  // <button>（實際目標）
  }
}
```

### Shadow DOM 選擇器

#### `:host` - 宿主元素

```typescript
static styles = css`
  :host {
    display: block;
    padding: 20px;
  }

  /* 基於宿主屬性 */
  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  /* 基於宿主類 */
  :host(.large) {
    font-size: 1.5rem;
  }
`;
```

#### `::slotted()` - 插槽內容

```typescript
static styles = css`
  /* 樣式化插槽內容 */
  ::slotted(h1) {
    color: blue;
  }

  ::slotted(*) {
    margin: 0;
  }
`;
```

#### CSS 自定義屬性（CSS Variables）

CSS 變量可以穿透 Shadow DOM：

```typescript
// 組件內部
static styles = css`
  button {
    background: var(--button-bg, blue);
    color: var(--button-color, white);
  }
`;

// 外部使用
html`
  <style>
    my-button {
      --button-bg: green;
      --button-color: yellow;
    }
  </style>

  <my-button>自定義顏色</my-button>
`
```

### Shadow DOM vs Light DOM

| 特性 | Shadow DOM | Light DOM |
|------|-----------|-----------|
| **樣式封裝** | ✅ 完全隔離 | ❌ 全局污染 |
| **選擇器範圍** | ✅ 限於內部 | ❌ 全局範圍 |
| **性能** | ⚡ 稍慢（封裝開銷） | ⚡ 稍快 |
| **調試** | ⚠️ 需要 shadowRoot | ✅ 直接訪問 |
| **SEO** | ⚠️ 可能影響 | ✅ 無影響 |

---

## 狀態管理

### 本地狀態

#### @state() 裝飾器

```typescript
@customElement('counter-app')
class CounterApp extends LitElement {
  @state()
  private count = 0;

  increment() {
    this.count++;  // 自動觸發重新渲染
  }

  render() {
    return html`
      <p>Count: ${this.count}</p>
      <button @click=${this.increment}>+1</button>
    `;
  }
}
```

#### 複雜狀態

```typescript
interface AppState {
  user: User | null;
  todos: Todo[];
  filter: FilterType;
}

@customElement('app-root')
class AppRoot extends LitElement {
  @state()
  private state: AppState = {
    user: null,
    todos: [],
    filter: 'all'
  };

  // 使用不可變更新
  addTodo(text: string) {
    this.state = {
      ...this.state,
      todos: [...this.state.todos, { id: Date.now(), text }]
    };
  }
}
```

### 全局狀態

#### 使用 Context API

```typescript
// context.ts
import { createContext } from '@lit/context';

export interface TodosContext {
  todos: Todo[];
  addTodo: (text: string) => void;
  deleteTodo: (id: string) => void;
}

export const todosContext = createContext<TodosContext>('todos');
```

```typescript
// provider.ts
import { provide } from '@lit/context';
import { todosContext } from './context';

@customElement('todo-provider')
class TodoProvider extends LitElement {
  @provide({ context: todosContext })
  @state()
  todosContext: TodosContext = {
    todos: [],
    addTodo: (text) => this.addTodo(text),
    deleteTodo: (id) => this.deleteTodo(id)
  };

  render() {
    return html`<slot></slot>`;
  }
}
```

```typescript
// consumer.ts
import { consume } from '@lit/context';
import { todosContext } from './context';

@customElement('todo-consumer')
class TodoConsumer extends LitElement {
  @consume({ context: todosContext })
  @state()
  todosContext!: TodosContext;

  render() {
    return html`
      <p>Total: ${this.todosContext.todos.length}</p>
    `;
  }
}
```

#### 使用外部狀態管理庫

##### Redux

```typescript
import { store } from './store';

@customElement('redux-component')
class ReduxComponent extends LitElement {
  @state()
  private storeState = store.getState();

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => {
      this.storeState = store.getState();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe();
  }
}
```

##### MobX

```typescript
import { makeObservable, observable, action } from 'mobx';

class TodoStore {
  @observable todos = [];

  @action
  addTodo(text: string) {
    this.todos.push({ id: Date.now(), text });
  }
}

const todoStore = new TodoStore();

@customElement('mobx-component')
class MobXComponent extends LitElement {
  render() {
    return html`
      <p>${todoStore.todos.length}</p>
    `;
  }
}
```

---

## 事件系統

### 自定義事件

#### 定義事件類型

```typescript
// types.ts
export class TodoAddEvent extends CustomEvent<{ text: string }> {
  constructor(text: string) {
    super('todo-add', {
      detail: { text },
      bubbles: true,      // 向上冒泡
      composed: true,     // 穿透 Shadow DOM
      cancelable: true    // 可取消
    });
  }
}

// 擴展全局類型
declare global {
  interface HTMLElementEventMap {
    'todo-add': TodoAddEvent;
  }
}
```

#### 發送事件

```typescript
@customElement('todo-input')
class TodoInput extends LitElement {
  private handleSubmit(text: string) {
    // 方式 1: 使用自定義事件類
    this.dispatchEvent(new TodoAddEvent(text));

    // 方式 2: 使用 CustomEvent
    this.dispatchEvent(new CustomEvent('todo-add', {
      detail: { text },
      bubbles: true,
      composed: true
    }));
  }
}
```

#### 監聽事件

```typescript
// 方式 1: 在模板中
render() {
  return html`
    <todo-input @todo-add=${this.handleAdd}></todo-input>
  `;
}

// 方式 2: 在生命週期中
connectedCallback() {
  super.connectedCallback();
  this.addEventListener('todo-add', this.handleAdd);
}

disconnectedCallback() {
  super.disconnectedCallback();
  this.removeEventListener('todo-add', this.handleAdd);
}
```

### 事件委託

```typescript
@customElement('todo-list')
class TodoList extends LitElement {
  render() {
    return html`
      <div class="list" @click=${this.handleClick}>
        ${this.todos.map(todo => html`
          <div class="item" data-id=${todo.id}>
            <button class="delete" data-action="delete">刪除</button>
          </div>
        `)}
      </div>
    `;
  }

  handleClick(e: Event) {
    const target = e.target as HTMLElement;

    if (target.matches('.delete')) {
      const id = target.closest('.item')?.dataset.id;
      if (id) this.deleteTodo(id);
    }
  }
}
```

### 事件修飾符

Lit 不直接支援 Vue 風格的事件修飾符，但可以自行實現：

```typescript
// utils/event-modifiers.ts
export function once(fn: Function) {
  let called = false;
  return function(this: any, ...args: any[]) {
    if (!called) {
      called = true;
      return fn.apply(this, args);
    }
  };
}

export function prevent(fn: Function) {
  return function(this: any, e: Event, ...args: any[]) {
    e.preventDefault();
    return fn.apply(this, [e, ...args]);
  };
}

export function stop(fn: Function) {
  return function(this: any, e: Event, ...args: any[]) {
    e.stopPropagation();
    return fn.apply(this, [e, ...args]);
  };
}

// 使用
render() {
  return html`
    <form @submit=${prevent(this.handleSubmit)}>
      <button @click=${once(this.handleClickOnce)}>Once</button>
      <button @click=${stop(this.handleClickStop)}>Stop</button>
    </form>
  `;
}
```

---

## 樣式系統

### 組件樣式

#### 基本樣式

```typescript
static styles = css`
  :host {
    display: block;
    padding: 20px;
  }

  .container {
    max-width: 600px;
  }
`;
```

#### 多個樣式表

```typescript
import { baseStyles } from './base-styles';
import { buttonStyles } from './button-styles';

static styles = [
  baseStyles,
  buttonStyles,
  css`
    /* 額外樣式 */
    .custom {
      color: red;
    }
  `
];
```

#### 條件樣式

```typescript
// 方式 1: classMap
import { classMap } from 'lit/directives/class-map.js';

render() {
  const classes = {
    'active': this.isActive,
    'disabled': this.isDisabled
  };
  return html`
    <div class="item ${classMap(classes)}">內容</div>
  `;
}

// 方式 2: styleMap
import { styleMap } from 'lit/directives/style-map.js';

render() {
  const styles = {
    color: this.error ? 'red' : 'black',
    'font-weight': this.important ? 'bold' : 'normal'
  };
  return html`
    <div style=${styleMap(styles)}>內容</div>
  `;
}
```

### CSS 自定義屬性

#### 定義主題變量

```typescript
static styles = css`
  :host {
    /* 定義變量 */
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --spacing: 16px;
  }

  button {
    /* 使用變量 */
    background: var(--primary-color);
    padding: var(--spacing);
  }
`;
```

#### 允許外部自定義

```typescript
static styles = css`
  button {
    /* 使用外部變量，提供默認值 */
    background: var(--button-bg, blue);
    color: var(--button-color, white);
    padding: var(--button-padding, 10px 20px);
  }
`;
```

```html
<!-- 外部自定義 -->
<style>
  my-button {
    --button-bg: green;
    --button-color: yellow;
    --button-padding: 15px 30px;
  }
</style>
```

### 響應式樣式

```typescript
static styles = css`
  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    .container {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  }

  @media (max-width: 480px) {
    .container {
      grid-template-columns: 1fr;
    }
  }
`;
```

### 動畫

```typescript
static styles = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .item {
    animation: fadeIn 0.3s ease-out;
  }

  .item:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;
```

---

## TypeScript 裝飾器

### @customElement()

註冊自定義元素：

```typescript
@customElement('my-element')
class MyElement extends LitElement {}

// 等同於
class MyElement extends LitElement {}
customElements.define('my-element', MyElement);
```

### @property()

定義響應式公共屬性：

```typescript
@customElement('user-card')
class UserCard extends LitElement {
  @property({ type: String })
  name = '';

  @property({ type: Number })
  age = 0;

  @property({ type: Boolean, reflect: true })
  active = false;

  @property({ type: Object })
  user: User | null = null;

  @property({ type: Array })
  tags: string[] = [];
}
```

使用：

```html
<user-card
  name="John"
  age="30"
  active
  .user=${userObject}
  .tags=${['dev', 'tech']}
></user-card>
```

### @state()

定義響應式私有狀態：

```typescript
@customElement('counter-app')
class CounterApp extends LitElement {
  @state()
  private count = 0;  // 私有狀態，不暴露為屬性

  @state()
  private isLoading = false;
}
```

### @query()

查詢 Shadow DOM 元素：

```typescript
@customElement('my-form')
class MyForm extends LitElement {
  @query('#email')
  emailInput!: HTMLInputElement;

  @query('.submit-btn')
  submitButton!: HTMLButtonElement;

  firstUpdated() {
    this.emailInput.focus();
  }

  handleSubmit() {
    const email = this.emailInput.value;
  }
}
```

### @queryAll()

查詢多個元素：

```typescript
@query('input')
inputs!: NodeListOf<HTMLInputElement>;

validateAll() {
  this.inputs.forEach(input => {
    if (!input.value) {
      input.classList.add('error');
    }
  });
}
```

### @queryAsync()

異步查詢元素：

```typescript
@queryAsync('#dynamic-element')
dynamicElement!: Promise<HTMLElement>;

async focusDynamic() {
  const el = await this.dynamicElement;
  el.focus();
}
```

### @eventOptions()

配置事件監聽選項：

```typescript
@eventOptions({ passive: true })
handleScroll(e: Event) {
  // 被動事件監聽器
}

@eventOptions({ capture: true })
handleClickCapture(e: Event) {
  // 捕獲階段監聽
}
```

---

## 在其他框架中使用

Lit 組件是標準的 Web Components，可以在任何框架中使用。

### 在 Vanilla JavaScript 中使用

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="./todo-app.js"></script>
</head>
<body>
  <todo-app></todo-app>

  <script>
    const app = document.querySelector('todo-app');

    // 設置屬性
    app.setAttribute('title', 'My Todos');

    // 監聽事件
    app.addEventListener('todo-add', (e) => {
      console.log('New todo:', e.detail.text);
    });
  </script>
</body>
</html>
```

### 在 React 中使用

#### 方式 1: 直接使用

```jsx
import React, { useRef, useEffect } from 'react';
import './todo-app.js';  // 導入 Lit 組件

function App() {
  const todoAppRef = useRef(null);

  useEffect(() => {
    const app = todoAppRef.current;

    // 設置屬性
    app.todos = [];

    // 監聽事件
    const handleAdd = (e) => {
      console.log('Added:', e.detail.text);
    };

    app.addEventListener('todo-add', handleAdd);

    return () => {
      app.removeEventListener('todo-add', handleAdd);
    };
  }, []);

  return (
    <div className="app">
      <h1>React + Lit</h1>
      <todo-app ref={todoAppRef}></todo-app>
    </div>
  );
}
```

#### 方式 2: 使用 Wrapper 組件

```jsx
// LitWrapper.jsx
import React, { useRef, useEffect } from 'react';

export function LitWrapper({ tag, props = {}, events = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    // 設置屬性
    Object.keys(props).forEach(key => {
      element[key] = props[key];
    });

    // 綁定事件
    Object.keys(events).forEach(eventName => {
      element.addEventListener(eventName, events[eventName]);
    });

    return () => {
      Object.keys(events).forEach(eventName => {
        element.removeEventListener(eventName, events[eventName]);
      });
    };
  }, [props, events]);

  return React.createElement(tag, { ref });
}

// 使用
function App() {
  return (
    <LitWrapper
      tag="todo-app"
      props={{ todos: [] }}
      events={{
        'todo-add': (e) => console.log(e.detail)
      }}
    />
  );
}
```

### 在 Vue 中使用

#### Vue 3

```vue
<template>
  <div class="app">
    <h1>Vue + Lit</h1>
    <todo-app
      ref="todoApp"
      @todo-add="handleAdd"
      @todo-delete="handleDelete"
    ></todo-app>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import './todo-app.js';

const todoApp = ref(null);

onMounted(() => {
  // 設置屬性
  todoApp.value.todos = [];
});

function handleAdd(e) {
  console.log('Added:', e.detail.text);
}

function handleDelete(e) {
  console.log('Deleted:', e.detail.id);
}
</script>
```

配置 Vue（允許自定義元素）：

```javascript
// vite.config.js
export default {
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.startsWith('todo-')
      }
    }
  }
};
```

### 在 Angular 中使用

#### 1. 配置 Angular

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // ...
})
export class AppModule {}
```

#### 2. 導入組件

```typescript
// main.ts
import './todo-app.js';
```

#### 3. 使用組件

```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Angular + Lit</h1>
    <todo-app
      (todo-add)="handleAdd($event)"
      (todo-delete)="handleDelete($event)"
    ></todo-app>
  `
})
export class AppComponent {
  handleAdd(event: CustomEvent) {
    console.log('Added:', event.detail.text);
  }

  handleDelete(event: CustomEvent) {
    console.log('Deleted:', event.detail.id);
  }
}
```

### 在 Svelte 中使用

```svelte
<script>
  import { onMount } from 'svelte';
  import './todo-app.js';

  let todoApp;

  onMount(() => {
    todoApp.addEventListener('todo-add', handleAdd);

    return () => {
      todoApp.removeEventListener('todo-add', handleAdd);
    };
  });

  function handleAdd(e) {
    console.log('Added:', e.detail.text);
  }
</script>

<h1>Svelte + Lit</h1>
<todo-app bind:this={todoApp}></todo-app>
```

---

## 性能優化

### 1. 使用 repeat 指令

```typescript
// ❌ 低效
render() {
  return html`
    ${this.items.map(item => html`
      <div>${item.name}</div>
    `)}
  `;
}

// ✅ 高效
import { repeat } from 'lit/directives/repeat.js';

render() {
  return html`
    ${repeat(
      this.items,
      (item) => item.id,  // 唯一鍵
      (item) => html`<div>${item.name}</div>`
    )}
  `;
}
```

### 2. 使用 cache 指令

```typescript
import { cache } from 'lit/directives/cache.js';

render() {
  return html`
    ${cache(
      this.view === 'list'
        ? html`<list-view></list-view>`
        : html`<grid-view></grid-view>`
    )}
  `;
}
```

### 3. 懶加載組件

```typescript
async loadComponent() {
  const { HeavyComponent } = await import('./heavy-component.js');
  customElements.define('heavy-component', HeavyComponent);
}

render() {
  return html`
    ${this.componentLoaded ? html`
      <heavy-component></heavy-component>
    ` : html`
      <button @click=${this.loadComponent}>Load Component</button>
    `}
  `;
}
```

### 4. 減少重新渲染

```typescript
// 使用 hasChanged 選項
@property({
  hasChanged: (newVal, oldVal) => {
    return JSON.stringify(newVal) !== JSON.stringify(oldVal);
  }
})
complexData: any;

// 或使用 shouldUpdate
shouldUpdate(changedProps: Map<string, any>) {
  // 只在特定屬性變化時更新
  return changedProps.has('importantProp');
}
```

### 5. 虛擬滾動

```typescript
// 使用 @lit-labs/virtualizer
import { LitVirtualizer } from '@lit-labs/virtualizer';

render() {
  return html`
    <lit-virtualizer
      .items=${this.largeList}
      .renderItem=${(item) => html`
        <div class="item">${item.name}</div>
      `}
    ></lit-virtualizer>
  `;
}
```

### 6. Web Workers

```typescript
connectedCallback() {
  super.connectedCallback();

  this.worker = new Worker('./compute-worker.js');

  this.worker.onmessage = (e) => {
    this.result = e.data;
  };
}

compute() {
  this.worker.postMessage({ data: this.largeData });
}
```

---

## 最佳實踐

### 1. 組件命名

```typescript
// ✅ 好的命名（使用連字符）
@customElement('todo-app')
@customElement('user-profile')
@customElement('data-table')

// ❌ 不好的命名
@customElement('todoapp')  // 缺少連字符
@customElement('app')      // 太簡單
@customElement('TODO-APP') // 大寫
```

### 2. 屬性設計

```typescript
// ✅ 好的屬性設計
@property({ type: String })
userName = '';  // 簡單類型用屬性

@property({ type: Object })
user: User | null = null;  // 複雜類型用對象

@property({ type: Boolean, reflect: true })
disabled = false;  // 布林值反映到 DOM

// ❌ 不好的設計
@property()
data;  // 沒有類型

@property({ type: Function })
callback;  // 函數應該用事件
```

### 3. 事件處理

```typescript
// ✅ 使用自定義事件類
export class TodoAddEvent extends CustomEvent<{ text: string }> {
  constructor(text: string) {
    super('todo-add', {
      detail: { text },
      bubbles: true,
      composed: true
    });
  }
}

// ✅ 使用箭頭函數綁定 this
private handleClick = (e: Event) => {
  // this 正確指向組件實例
};

// ❌ 不使用普通函數（this 綁定問題）
private handleClick(e: Event) {
  // this 可能不正確
}
```

### 4. 樣式組織

```typescript
// ✅ 使用 CSS 變量
static styles = css`
  :host {
    --primary-color: #667eea;
    --spacing: 16px;
  }

  button {
    background: var(--primary-color);
    padding: var(--spacing);
  }
`;

// ✅ 模組化樣式
import { baseStyles } from './styles/base';
import { buttonStyles } from './styles/buttons';

static styles = [baseStyles, buttonStyles, css`
  /* 組件特定樣式 */
`];
```

### 5. TypeScript 類型

```typescript
// ✅ 定義清晰的接口
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

@customElement('todo-item')
class TodoItem extends LitElement {
  @property({ type: Object })
  todo!: Todo;  // 使用明確類型
}

// ✅ 使用泛型
class DataTable<T> extends LitElement {
  @property({ type: Array })
  data: T[] = [];
}
```

### 6. 測試

```typescript
// 使用 @open-wc/testing
import { fixture, html, expect } from '@open-wc/testing';
import './todo-app';

describe('TodoApp', () => {
  it('renders correctly', async () => {
    const el = await fixture(html`<todo-app></todo-app>`);
    expect(el).shadowDom.to.equal(`
      <div class="app-container">...</div>
    `);
  });

  it('adds todo', async () => {
    const el = await fixture(html`<todo-app></todo-app>`);
    const input = el.shadowRoot.querySelector('input');

    input.value = 'New todo';
    input.dispatchEvent(new Event('submit'));

    await el.updateComplete;

    expect(el.todos).to.have.length(1);
  });
});
```

---

## 常見問題

### Q1: Lit 和 LitElement 的區別？

**A:**
- **lit**: 完整的包，包含 `lit-html` 和 `lit-element`
- **LitElement**: 基類，用於建立組件
- **lit-html**: 模板引擎，可單獨使用

```typescript
// 導入完整包
import { LitElement, html, css } from 'lit';

// 或單獨導入
import { LitElement } from 'lit-element';
import { html, css } from 'lit-html';
```

### Q2: 為什麼使用 `useDefineForClassFields: false`？

**A:** 這是為了與裝飾器正確協作。TypeScript 5.0+ 默認啟用 `useDefineForClassFields`，但這會干擾 Lit 的響應式系統。

### Q3: Shadow DOM 如何影響 SEO？

**A:** Shadow DOM 內容對搜索引擎是可見的，但需要注意：
- 使用 Server-Side Rendering (SSR) 提供初始內容
- 重要內容應在 Light DOM 中
- 使用語義化 HTML 標籤

### Q4: 如何調試 Shadow DOM？

**A:**
```javascript
// Chrome DevTools
const element = document.querySelector('my-element');
console.log(element.shadowRoot);

// 或在 Elements 面板中展開 Shadow DOM
```

### Q5: Lit 支援 SSR 嗎？

**A:** 支援，但需要使用 `@lit-labs/ssr`：

```javascript
import { render } from '@lit-labs/ssr';

const result = render(html`<my-app></my-app>`);
```

### Q6: 如何在 Lit 中使用第三方庫？

**A:**
```typescript
import Axios from 'axios';

@customElement('data-loader')
class DataLoader extends LitElement {
  async loadData() {
    const { data } = await Axios.get('/api/data');
    this.data = data;
  }
}
```

### Q7: 性能與 React/Vue 相比如何？

**A:**
- 初始載入：Lit 更快（體積小）
- 運行時：相似或稍快（原生 API）
- 記憶體：Lit 更優（無虛擬 DOM）

---

## 學習資源

### 官方資源

- **官方網站**: https://lit.dev
- **文檔**: https://lit.dev/docs/
- **Playground**: https://lit.dev/playground/
- **GitHub**: https://github.com/lit/lit

### 教學和指南

- **Lit 官方教學**: https://lit.dev/tutorials/
- **Web Components**: https://www.webcomponents.org/
- **MDN Web Components**: https://developer.mozilla.org/en-US/docs/Web/Web_Components

### 工具和庫

- **@lit-labs/virtualizer**: 虛擬滾動
- **@lit/context**: Context API
- **@lit/task**: 異步任務管理
- **@lit/localize**: 國際化

### 社群

- **Discord**: https://lit.dev/discord
- **Stack Overflow**: [lit-element](https://stackoverflow.com/questions/tagged/lit-element)
- **Twitter**: [@buildWithLit](https://twitter.com/buildWithLit)

### 範例專案

- **Lit Starter Kit**: https://github.com/lit/lit-starter-kit
- **Lit Templates**: https://github.com/lit/lit-templates
- **Open WC**: https://open-wc.org/

---

## 總結

Lit 是建構現代 Web Components 的優秀選擇：

### 優點

✅ **標準化**: 基於 Web Components 標準
✅ **輕量**: ~8KB 的體積
✅ **高效**: 增量 DOM 更新
✅ **互通**: 可在任何框架中使用
✅ **簡單**: 易學易用的 API
✅ **未來**: 不會過時的技術

### 適用場景

- 設計系統和組件庫
- 微前端架構
- 跨框架共享組件
- 漸進式增強
- 長期維護的專案

### 開始使用

```bash
# 安裝依賴
npm install

# 啟動開發
npm run dev

# 構建生產
npm run build
```

Happy coding with Lit! 🔥

---

## 許可證

MIT License

## 作者

TodoListDemo - Lit Implementation

---

最後更新：2024 年 11 月
