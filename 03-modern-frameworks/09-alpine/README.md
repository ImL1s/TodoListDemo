# Todo List - Alpine.js 版本

這是一個使用 Alpine.js 實現的任務清單應用，展示了 Alpine.js 的極簡響應式開發方式。

## 什麼是 Alpine.js？

Alpine.js 是一個輕量級的 JavaScript 框架，被稱為「網頁版本的 Tailwind CSS」。它提供了類似 Vue.js 的響應式和聲明式特性，但體積僅有約 **15KB**（壓縮後）。

### Alpine.js 的核心理念

- **極簡主義**：不需要複雜的構建工具或打包器
- **漸進增強**：可以在現有項目中逐步引入
- **直接在 HTML 中操作**：所有邏輯都在 HTML 屬性中定義
- **低學習曲線**：如果你熟悉 Vue.js，幾乎可以立即上手

## 特色與優勢

### 1. 極小的體積 (15KB)

```html
<!-- 只需一行 CDN 即可使用 -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

- 比 React (40KB+) 和 Vue (33KB+) 小得多
- 適合注重性能的網站
- 快速載入，不影響頁面性能

### 2. 無需構建步驟

- 不需要 npm、webpack、vite 等工具
- 直接引入 CDN 即可使用
- 適合快速原型開發和小型專案
- 降低開發環境配置複雜度

### 3. 類 Vue 的語法

```html
<!-- 數據綁定 -->
<input x-model="newTodo">

<!-- 事件處理 -->
<button @click="addTodo">添加</button>

<!-- 條件渲染 -->
<div x-show="todos.length === 0">沒有任務</div>

<!-- 列表渲染 -->
<template x-for="todo in todos" :key="todo.id">
    <li x-text="todo.text"></li>
</template>
```

### 4. 完美的漸進增強

- 可以在現有的 HTML 頁面中逐步添加
- 不需要改寫整個應用
- 與其他 JavaScript 庫和框架兼容
- 適合為傳統網站添加互動功能

### 5. 聲明式編程

```html
<div x-data="{ count: 0 }">
    <button @click="count++">增加</button>
    <span x-text="count"></span>
</div>
```

- 邏輯清晰，易於理解
- 減少命令式 DOM 操作
- 提高代碼可維護性

## 核心指令說明

### x-data
定義組件的數據和方法：

```html
<div x-data="{ name: 'Alpine' }">
    <span x-text="name"></span>
</div>
```

### x-model
雙向數據綁定：

```html
<input x-model="newTodo">
```

### @click / @keydown
事件監聽：

```html
<button @click="addTodo">添加</button>
<input @keydown.enter="submit">
```

### x-show / x-if
條件渲染：

```html
<div x-show="isVisible">顯示/隱藏</div>
```

### x-for
列表渲染：

```html
<template x-for="item in items" :key="item.id">
    <li x-text="item.name"></li>
</template>
```

### x-text / x-html
文本綁定：

```html
<span x-text="message"></span>
```

### :class / :style
動態樣式：

```html
<div :class="{ 'active': isActive }"></div>
```

## 專案功能

本 Todo List 應用實現了以下功能：

1. **添加任務**
   - 輸入框輸入任務
   - 點擊「添加」按鈕或按 Enter 鍵添加
   - 空輸入驗證

2. **任務狀態切換**
   - 點擊任務可標記為完成/未完成
   - 完成的任務顯示刪除線和對勾圖標
   - 視覺反饋清晰

3. **刪除任務**
   - 每個任務都有刪除按鈕（×）
   - 點擊即可刪除

4. **過濾任務**
   - 全部任務
   - 進行中任務
   - 已完成任務
   - 實時顯示各類別數量

5. **數據持久化**
   - 使用 localStorage 自動保存
   - 頁面刷新後數據不丟失
   - Alpine.js 的 `$watch` 自動監聽變化

6. **空狀態提示**
   - 根據不同過濾器顯示友好提示
   - 改善用戶體驗

7. **批量操作**
   - 一鍵清除所有已完成任務
   - 顯示待完成任務數量

## 使用場景

Alpine.js 特別適合以下場景：

### ✅ 適合使用的場景

1. **小型互動功能**
   - 下拉菜單、模態框、標籤頁
   - 表單驗證、動態表單
   - 簡單的購物車功能

2. **漸進增強現有網站**
   - 在傳統的伺服器渲染網站中添加互動
   - WordPress、Laravel、Django 等後端框架的前端增強
   - 不想完全重寫現有代碼

3. **快速原型開發**
   - 快速驗證想法
   - 無需配置構建工具
   - 適合 Hackathon 或概念驗證

4. **靜態網站生成器**
   - 配合 Hugo、Jekyll、11ty 等
   - 為靜態頁面添加動態功能
   - 保持網站輕量快速

5. **學習響應式編程**
   - 低學習曲線
   - 適合初學者理解響應式概念
   - 為學習 Vue/React 打基礎

### ❌ 不適合的場景

1. **大型單頁應用 (SPA)**
   - 複雜的路由需求
   - 多個頁面/視圖
   - 應該考慮 React、Vue、Svelte

2. **需要豐富生態系統**
   - 缺少像 React/Vue 那樣豐富的生態
   - 第三方組件庫較少
   - 社區相對較小

3. **需要 SSR/SSG 的大型應用**
   - Alpine.js 主要是客戶端框架
   - 應該考慮 Next.js、Nuxt.js、SvelteKit

4. **複雜的狀態管理**
   - 跨組件的複雜狀態
   - 應該使用 Redux、Vuex 等狀態管理庫

## 與其他框架的比較

| 特性 | Alpine.js | Vue.js | React | Svelte |
|------|-----------|--------|-------|--------|
| 體積 | ~15KB | ~33KB | ~40KB | ~2KB* |
| 學習曲線 | 低 | 中 | 中高 | 中 |
| 構建工具 | 不需要 | 可選 | 需要 | 需要 |
| 語法風格 | 聲明式 | 聲明式 | 聲明式 | 聲明式 |
| 適用場景 | 小型互動 | 中大型應用 | 中大型應用 | 中大型應用 |
| 生態系統 | 小 | 大 | 最大 | 中等 |
| TypeScript | 有限支持 | 完整支持 | 完整支持 | 完整支持 |

*Svelte 的體積指的是編譯後的代碼，而不是框架本身

## 項目結構

```
09-alpine/
├── index.html      # 包含所有 Alpine.js 代碼的 HTML 文件
├── style.css       # 樣式表
└── README.md       # 本文件
```

### 為什麼所有代碼都在 HTML 中？

這是 Alpine.js 的核心理念之一：

1. **簡單直觀**：所有邏輯都在一個文件中，易於理解
2. **快速開發**：不需要在多個文件間切換
3. **適合小型項目**：對於簡單應用，這是最高效的方式
4. **降低複雜度**：不需要模塊打包器和複雜的文件結構

對於更大的項目，你可以將 JavaScript 代碼提取到單獨的文件中。

## 使用方法

### 本地運行

1. 克隆專案到本地
2. 使用任何 HTTP 服務器運行（推薦方法）：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (http-server)
npx http-server

# 使用 PHP
php -S localhost:8000
```

3. 在瀏覽器中打開 `http://localhost:8000`

### 直接打開

由於 Alpine.js 使用 CDN，你也可以直接用瀏覽器打開 `index.html` 文件。

## 代碼亮點

### 1. 使用計算屬性 (Getter)

```javascript
get filteredTodos() {
    if (this.filter === 'active') {
        return this.activeTodos;
    } else if (this.filter === 'completed') {
        return this.completedTodos;
    }
    return this.todos;
}
```

### 2. 自動保存到 localStorage

```javascript
this.$watch('todos', value => {
    localStorage.setItem('alpine-todos', JSON.stringify(value));
});
```

### 3. 事件修飾符

```html
<!-- 阻止事件冒泡 -->
<span @click.stop="deleteTodo(todo.id)">×</span>

<!-- Enter 鍵觸發 -->
<input @keydown.enter="addTodo">
```

### 4. 動態樣式

```html
<button :class="{ 'active': filter === 'all' }">全部</button>
```

### 5. 條件渲染

```html
<div x-show="todos.length > 0">...</div>
```

## 學習資源

- [Alpine.js 官方網站](https://alpinejs.dev/)
- [Alpine.js GitHub](https://github.com/alpinejs/alpine)
- [Alpine.js 指令參考](https://alpinejs.dev/directives)
- [Alpine.js 實例集合](https://alpinejs.dev/examples)

## 總結

Alpine.js 是一個非常優秀的輕量級框架，它填補了「原生 JavaScript」和「重量級框架」之間的空白。如果你需要：

- 為現有網站添加互動功能
- 快速開發小型應用
- 保持網站輕量快速
- 低學習成本

那麼 Alpine.js 就是完美的選擇！它讓你能夠用極簡的代碼實現響應式互動，而不需要複雜的構建配置。

## 授權

MIT License
