# Svelte Todo List - 編譯時框架示例

一個使用 **Svelte 4** 構建的現代化 Todo List 應用，展示 Svelte 的核心特性和編譯時框架的優勢。

## 📚 目錄

- [技術棧](#技術棧)
- [Svelte 核心特性](#svelte-核心特性)
- [項目結構](#項目結構)
- [快速開始](#快速開始)
- [代碼詳解](#代碼詳解)
- [Svelte vs React vs Vue](#svelte-vs-react-vs-vue)
- [學習重點](#學習重點)
- [性能優勢](#性能優勢)

## 🚀 技術棧

- **Svelte 4.2.8** - 編譯時前端框架
- **Vite 5.0** - 現代化構建工具
- **LocalStorage** - 數據持久化
- **CSS3** - 原生樣式（Scoped CSS）

## ✨ Svelte 核心特性

### 1. 編譯時框架（Compile-Time Framework）

**傳統框架（React/Vue）：**
```
源代碼 → 打包 → 包含框架運行時 + 應用代碼（大體積）
執行時：使用虛擬 DOM 進行 diff 和 patch（性能開銷）
```

**Svelte：**
```
源代碼 → 編譯器優化 → 純 JavaScript（小體積）
執行時：直接操作 DOM，無虛擬 DOM（極致性能）
```

### 2. 響應式語法（Reactivity）

#### React 方式：
```javascript
const [count, setCount] = useState(0);
// 需要使用 setter 函數
setCount(count + 1);
```

#### Vue 方式：
```javascript
const count = ref(0);
// 需要 .value
count.value++;
```

#### Svelte 方式：
```javascript
let count = 0;
// 直接賦值即可觸發更新
count++;
```

### 3. 反應式聲明（$: 語法）

Svelte 的 `$:` 語法是一個編譯器標記，用於創建響應式語句：

```javascript
let count = 0;

// 反應式聲明：當 count 改變時自動重新計算
$: doubled = count * 2;

// 反應式語句：當依賴改變時自動執行
$: {
  console.log(`count is ${count}`);
  console.log(`doubled is ${doubled}`);
}

// 反應式 if 語句
$: if (count > 10) {
  alert('count is too high!');
}
```

**類比其他框架：**
- Vue 的 `computed` 和 `watch`
- React 的 `useMemo` 和 `useEffect`

### 4. 雙向綁定（bind:）

```svelte
<!-- Svelte：簡潔直觀 -->
<input bind:value={name} />

<!-- React：需要手動處理 -->
<input value={name} onChange={e => setName(e.target.value)} />

<!-- Vue：類似但語法不同 -->
<input v-model="name" />
```

### 5. Scoped CSS（作用域樣式）

Svelte 的 `<style>` 標籤自動作用域化，無需 CSS-in-JS 或 CSS Modules：

```svelte
<style>
  /* 這些樣式只作用於當前組件 */
  .button {
    color: red;
  }
</style>
```

### 6. 條件渲染和列表渲染

```svelte
<!-- 條件渲染 -->
{#if condition}
  <p>True</p>
{:else if otherCondition}
  <p>Maybe</p>
{:else}
  <p>False</p>
{/if}

<!-- 列表渲染 -->
{#each items as item (item.id)}
  <div>{item.name}</div>
{/each}
```

## 📁 項目結構

```
06-svelte/
├── index.html                 # HTML 入口
├── package.json              # 項目依賴
├── vite.config.js            # Vite 配置
├── src/
│   ├── main.js              # JavaScript 入口
│   ├── App.svelte           # 主應用組件
│   ├── app.css              # 全局樣式
│   └── components/
│       ├── TodoInput.svelte  # 輸入組件
│       ├── TodoList.svelte   # 列表組件
│       └── TodoItem.svelte   # 單項組件
└── README.md                # 項目文檔
```

## 🎯 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用將在 http://localhost:3000 運行

### 生產構建

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 📖 代碼詳解

### 1. 響應式狀態管理（App.svelte）

```javascript
// 聲明響應式狀態（使用 let）
let todos = [];
let filter = 'all';

// 反應式聲明：自動保存到 LocalStorage
$: {
  if (todos.length >= 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
}

// 反應式計算：過濾待辦事項
$: filteredTodos = todos.filter(todo => {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true;
});

// 反應式計算：統計數據
$: activeCount = todos.filter(t => !t.completed).length;
$: completedCount = todos.filter(t => t.completed).length;
```

**關鍵點：**
- `let` 聲明的變量自動響應式
- `$:` 創建反應式聲明，依賴改變時自動重新計算
- 無需手動訂閱或取消訂閱

### 2. Props 聲明（組件通信）

**父組件傳遞 Props：**
```svelte
<TodoList
  todos={filteredTodos}
  on:toggle={toggleTodo}
  on:delete={deleteTodo}
  on:edit={editTodo}
/>
```

**子組件接收 Props：**
```javascript
// 使用 export 聲明 props
export let todos = [];
```

**類比：**
- React: `function TodoList({ todos })`
- Vue: `defineProps(['todos'])`

### 3. 事件處理（Event Dispatching）

**子組件觸發事件：**
```javascript
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

function handleSubmit() {
  dispatch('add', trimmedValue); // 觸發自定義事件
}
```

**父組件監聽事件：**
```svelte
<TodoInput on:add={addTodo} />
```

**類比：**
- React: 通過 props 傳遞回調函數
- Vue: `emit('add', value)` 和 `@add="addTodo"`

### 4. 雙向綁定（Two-Way Binding）

```svelte
<script>
  let inputValue = '';
</script>

<input bind:value={inputValue} />
```

**其他綁定：**
```svelte
<!-- 複選框 -->
<input type="checkbox" bind:checked={completed} />

<!-- 單選框 -->
<input type="radio" bind:group={selected} value="option1" />

<!-- 選擇框 -->
<select bind:value={selected}>
  <option>A</option>
  <option>B</option>
</select>
```

### 5. 條件類名（Class Directive）

```svelte
<!-- 動態類名 -->
<div class="item" class:completed={todo.completed}>
  <!-- completed 為 true 時添加 completed 類 -->
</div>

<!-- 等價於 -->
<div class={`item ${todo.completed ? 'completed' : ''}`}>
```

### 6. 列表渲染和 Key

```svelte
{#each todos as todo (todo.id)}
  <!-- (todo.id) 是 key，用於優化渲染 -->
  <TodoItem {todo} />
{/each}
```

**解構語法：**
```svelte
{#each todos as { id, text, completed } (id)}
  <div>{text}</div>
{/each}
```

### 7. 生命週期（Lifecycle）

```javascript
import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';

// 組件掛載後執行（類似 useEffect(() => {}, [])）
onMount(() => {
  console.log('組件已掛載');

  return () => {
    // 清理函數（組件卸載時執行）
    console.log('組件將卸載');
  };
});

// 組件銷毀前執行
onDestroy(() => {
  console.log('組件銷毀');
});

// 組件更新前執行
beforeUpdate(() => {
  console.log('DOM 將更新');
});

// 組件更新後執行
afterUpdate(() => {
  console.log('DOM 已更新');
});
```

### 8. Stores（跨組件狀態管理）

雖然本項目未使用，但 Svelte 提供內建的 Store 機制：

```javascript
import { writable, readable, derived } from 'svelte/store';

// 可寫 Store
const count = writable(0);
count.set(1);           // 設置值
count.update(n => n + 1); // 更新值

// 只讀 Store
const time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  return function stop() {
    clearInterval(interval);
  };
});

// 派生 Store
const doubled = derived(count, $count => $count * 2);

// 在組件中使用（$ 前綴自動訂閱）
<script>
  import { count } from './stores.js';
</script>

<p>Count: {$count}</p>
```

## ⚔️ Svelte vs React vs Vue

### 對比表格

| 特性 | Svelte | React | Vue |
|------|--------|-------|-----|
| **類型** | 編譯時框架 | 運行時框架 | 運行時框架 |
| **虛擬 DOM** | ❌ 無 | ✅ 有 | ✅ 有 |
| **包體積** | 🟢 極小（~2KB） | 🟡 中等（~40KB） | 🟡 中等（~30KB） |
| **性能** | 🟢 極快 | 🟡 快 | 🟡 快 |
| **學習曲線** | 🟢 平緩 | 🔴 陡峭 | 🟡 中等 |
| **語法複雜度** | 🟢 簡單 | 🔴 複雜 | 🟡 中等 |
| **響應式** | 自動（賦值） | 手動（setState） | 自動（Proxy） |
| **樣式作用域** | 內建 | 需第三方庫 | 內建 |
| **生態系統** | 🟡 發展中 | 🟢 成熟 | 🟢 成熟 |

### 代碼對比示例

#### 簡單計數器

**Svelte：**
```svelte
<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  Count: {count}
</button>
```

**React：**
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

**Vue：**
```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>

<template>
  <button @click="count++">
    Count: {{ count }}
  </button>
</template>
```

#### 雙向綁定

**Svelte：**
```svelte
<input bind:value={name} />
```

**React：**
```jsx
<input
  value={name}
  onChange={e => setName(e.target.value)}
/>
```

**Vue：**
```vue
<input v-model="name" />
```

#### 計算屬性

**Svelte：**
```javascript
let a = 1;
let b = 2;
$: sum = a + b; // 自動重新計算
```

**React：**
```javascript
const [a, setA] = useState(1);
const [b, setB] = useState(2);
const sum = useMemo(() => a + b, [a, b]);
```

**Vue：**
```javascript
const a = ref(1);
const b = ref(2);
const sum = computed(() => a.value + b.value);
```

### Svelte 的優勢

#### 1. 🚀 極致性能

- **無虛擬 DOM**：直接操作 DOM，減少運行時開銷
- **編譯時優化**：在構建階段完成優化
- **極小包體積**：打包後體積比 React/Vue 小 70%+

#### 2. ✍️ 簡潔語法

- **更少樣板代碼**：無需 `useState`、`ref`、`computed` 等
- **直觀的響應式**：賦值即更新
- **原生 HTML/CSS**：降低學習成本

#### 3. 📦 內建功能

- **Scoped CSS**：無需額外配置
- **動畫/過渡**：內建 `transition` 和 `animate`
- **Store**：內建狀態管理

#### 4. 🎯 開發體驗

- **TypeScript 支持**：一流的 TS 支持
- **更少 Bug**：編譯時捕獲錯誤
- **調試友好**：生成的代碼可讀性強

### Svelte 的劣勢

#### 1. 🌱 生態系統較小

- UI 組件庫較少
- 第三方庫集成可能需要適配

#### 2. 👥 社區規模

- 相比 React/Vue 社區更小
- 學習資源相對較少

#### 3. 💼 企業採用

- 大公司採用較少
- 招聘市場需求較小

#### 4. 🔄 遷移成本

- 從 React/Vue 遷移需要重寫
- 團隊學習新範式

## 🎓 學習重點

### 1. 響應式原理

**核心概念：**
- Svelte 在編譯時分析依賴關係
- 賦值操作 `=` 觸發更新
- `$:` 創建反應式聲明

**注意事項：**
```javascript
// ✅ 正確：會觸發更新
let arr = [1, 2, 3];
arr = [...arr, 4];

// ❌ 錯誤：不會觸發更新（需要賦值）
let arr = [1, 2, 3];
arr.push(4); // 沒有賦值操作

// ✅ 解決方案
arr.push(4);
arr = arr; // 觸發更新
```

### 2. 組件通信

**父→子：Props**
```svelte
<Child prop={value} />
```

**子→父：Events**
```javascript
dispatch('eventName', data);
```

**跨組件：Stores**
```javascript
import { myStore } from './stores.js';
// 使用 $myStore 自動訂閱
```

### 3. 生命週期管理

```javascript
onMount(() => {
  // 組件掛載
  return () => {
    // 清理
  };
});
```

### 4. 樣式處理

- 組件內 `<style>` 自動作用域
- 使用 `:global()` 定義全局樣式
- CSS 變量可以在樣式中使用

### 5. 性能優化

- 使用 `{#key}` 強制重新渲染
- 避免不必要的響應式聲明
- 使用 `immutable` 組件選項

## 🔍 性能優勢展示

### 包體積對比

構建相同功能的 Todo App：

| 框架 | Gzipped 大小 |
|------|-------------|
| Svelte | ~2KB |
| Vue 3 | ~16KB |
| React 18 | ~42KB |

### 運行時性能

| 操作 | Svelte | React | Vue |
|------|--------|-------|-----|
| 創建 1000 行 | 🟢 23ms | 🟡 45ms | 🟡 38ms |
| 更新每 10 行 | 🟢 18ms | 🟡 35ms | 🟡 28ms |
| 刪除 1000 行 | 🟢 15ms | 🟡 28ms | 🟡 22ms |

*數據來自 [JS Framework Benchmark](https://krausest.github.io/js-framework-benchmark/)*

## 🌟 最佳實踐

### 1. 保持組件簡單

```svelte
<!-- ✅ 好：單一職責 -->
<TodoItem {todo} on:toggle on:delete />

<!-- ❌ 差：過於複雜 -->
<ComplexComponent
  {data}
  {config}
  {handlers}
  {options}
  {settings}
/>
```

### 2. 合理使用響應式聲明

```javascript
// ✅ 好：簡潔的響應式邏輯
$: doubled = count * 2;

// ❌ 差：過於複雜的響應式邏輯
$: {
  const result = complexCalculation(data);
  const filtered = result.filter(item => item.active);
  const sorted = filtered.sort((a, b) => a.id - b.id);
  finalResult = sorted.map(item => transform(item));
}
// 應該拆分為多個響應式聲明
```

### 3. 適當使用 Stores

```javascript
// 對於全局狀態，使用 Stores
// 對於組件內狀態，使用本地變量
```

### 4. TypeScript 支持

```svelte
<script lang="ts">
  export let items: TodoItem[];

  interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
  }
</script>
```

## 📚 延伸學習

### 官方資源

- [Svelte 官方文檔](https://svelte.dev/)
- [Svelte 教程](https://svelte.dev/tutorial)
- [Svelte REPL](https://svelte.dev/repl)

### 進階主題

- **SvelteKit**：全棧應用框架（類似 Next.js）
- **Svelte Native**：移動端開發
- **Svelte Transitions**：內建動畫系統
- **Svelte Actions**：DOM 操作指令

### 社區資源

- [Svelte Society](https://sveltesociety.dev/)
- [Awesome Svelte](https://github.com/TheComputerM/awesome-svelte)
- [Svelte Discord](https://discord.com/invite/yy75DKs)

## 🎯 總結

### 何時選擇 Svelte？

✅ **適合的場景：**
- 新項目，追求極致性能
- 中小型應用
- 包體積敏感的項目
- 團隊願意學習新技術

❌ **不適合的場景：**
- 大型企業項目（生態考慮）
- 團隊已深度使用 React/Vue
- 需要豐富的第三方組件庫
- 短期項目（學習成本）

### 核心優勢

1. **性能極佳**：無虛擬 DOM，編譯時優化
2. **語法簡潔**：更少的樣板代碼
3. **包體積小**：適合性能敏感場景
4. **開發體驗好**：直觀的響應式和作用域樣式

### 未來展望

Svelte 的設計理念（編譯時框架）代表了前端框架的一個重要方向。隨著 Svelte 4 和 SvelteKit 的成熟，以及社區的發展，Svelte 在前端生態中的地位將越來越重要。

---

**Happy Coding with Svelte! 🎉**
