# React + Nanostores Todo List

一個使用 **Nanostores** 實現的完整功能 Todo List 應用程式，展示了這個超輕量級（< 1KB）、框架無關的狀態管理庫的所有核心特性。

![Nanostores Size](https://img.shields.io/badge/size-<1KB-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Framework](https://img.shields.io/badge/Framework-Agnostic-orange)

## 🎯 Nanostores 特色

### 為什麼選擇 Nanostores？

1. **極小體積** 📦
   - 核心庫僅 **286 bytes** (gzipped)
   - 完整功能也少於 **1KB**
   - 比 Redux (3KB)、Zustand (1.2KB) 更小
   - 零依賴，樹搖優化友好

2. **框架無關** 🔄
   - 可在任何 JavaScript 環境運行
   - 官方支援：React、Vue、Svelte、Preact、Angular
   - 可在 Node.js、Web Workers 中使用
   - 非常適合**微前端架構**

3. **簡單 API** ✨
   - 僅 3 個核心概念：`atom`、`map`、`computed`
   - 無需 Provider、Context 或複雜配置
   - TypeScript 優先，完美的類型推導
   - 學習曲線平緩

4. **高效能** ⚡
   - 精確的訂閱追蹤
   - 最小化重新渲染
   - Computed stores 自動緩存
   - 支援異步操作

5. **開發體驗** 🛠
   - 優秀的 DevTools 支援
   - 清晰的錯誤訊息
   - 完整的 TypeScript 定義
   - 豐富的生態系統插件

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

在瀏覽器中訪問 `http://localhost:5173`

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

### 類型檢查

```bash
npm run type-check
```

## 📦 核心功能

### ✅ Todo 管理
- ✨ 新增待辦事項
- ✏️ 編輯待辦事項（雙擊）
- ✅ 切換完成狀態
- 🗑️ 刪除待辦事項
- 📊 統計信息

### 🎛️ 篩選功能
- 📋 顯示全部
- ⏳ 僅顯示進行中
- ✅ 僅顯示已完成

### 💾 數據持久化
- 自動保存到 localStorage
- 頁面刷新後數據保留
- 篩選狀態也會保存

### 🎨 其他特性
- 一鍵完成/激活全部
- 清除已完成項目
- 即時統計更新
- 響應式設計

## 🏗️ 專案結構

```
src/
├── components/           # React 組件
│   ├── TodoInput.tsx    # 新增 todo 輸入框
│   ├── TodoItem.tsx     # 單個 todo 項目
│   ├── TodoList.tsx     # todo 列表
│   ├── TodoFilters.tsx  # 篩選按鈕
│   ├── TodoStats.tsx    # 統計信息
│   └── NanostoresInfo.tsx # Nanostores 特性說明
│
├── stores/              # Nanostores 狀態管理
│   ├── todoStore.ts     # 主要 store（展示所有特性）
│   └── vanillaExample.ts # 框架無關使用示例
│
├── types.ts             # TypeScript 類型定義
├── App.tsx              # 主應用組件
├── App.css              # 全局樣式
└── main.tsx             # 應用入口

```

## 📚 Nanostores 核心概念

### 1️⃣ Atom Store - 簡單值

Atom 用於存儲簡單的原始值：

```typescript
import { atom } from 'nanostores';

// 創建 atom
export const $count = atom(0);

// 讀取值
const value = $count.get();

// 設置值
$count.set(10);

// 訂閱變化
const unsubscribe = $count.listen((value) => {
  console.log('Count changed:', value);
});
```

**本專案應用：**
```typescript
// 當前編輯的 todo ID
export const $editingId = atom<string | null>(null);
```

### 2️⃣ Map Store - 複雜對象

Map 用於存儲對象或集合：

```typescript
import { map } from 'nanostores';

// 創建 map
export const $user = map({
  name: 'John',
  age: 30
});

// 讀取值
const user = $user.get();

// 更新部分屬性
$user.setKey('age', 31);

// 完全替換
$user.set({ name: 'Jane', age: 25 });
```

**本專案應用：**
```typescript
// Todos 集合（使用 persistentAtom 實現類似 map 的功能）
export const $todos = persistentAtom<Record<string, Todo>>('todos', {});
```

### 3️⃣ Computed Store - 派生狀態

Computed 用於從其他 store 派生數據：

```typescript
import { computed } from 'nanostores';

export const $fullName = computed(
  [$firstName, $lastName],
  (first, last) => `${first} ${last}`
);
```

**本專案應用：**
```typescript
// 根據篩選條件計算的 todos
export const $filteredTodos = computed(
  [$todos, $filter],
  (todos, filter) => {
    const todoArray = Object.values(todos);
    switch (filter) {
      case 'active':
        return todoArray.filter(todo => !todo.completed);
      case 'completed':
        return todoArray.filter(todo => todo.completed);
      default:
        return todoArray;
    }
  }
);

// 統計信息
export const $stats = computed($todos, (todos): TodoStats => {
  const todoArray = Object.values(todos);
  return {
    total: todoArray.length,
    active: todoArray.filter(todo => !todo.completed).length,
    completed: todoArray.filter(todo => todo.completed).length,
  };
});
```

### 4️⃣ Persistent Store - 持久化

使用 `@nanostores/persistent` 實現 localStorage 持久化：

```typescript
import { persistentAtom } from '@nanostores/persistent';

export const $theme = persistentAtom<'light' | 'dark'>(
  'theme',        // localStorage key
  'light',        // default value
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
```

**本專案應用：**
```typescript
// 持久化篩選狀態
export const $filter = persistentAtom<FilterType>('todoFilter', 'all');

// 持久化 todos
export const $todos = persistentAtom<Record<string, Todo>>('todos', {});
```

### 5️⃣ Action Creators - 動作創建器

封裝狀態更新邏輯：

```typescript
// Action creators 提供清晰的 API
export function addTodo(text: string): void {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  const newTodo: Todo = {
    id: Date.now().toString(),
    text: trimmedText,
    completed: false,
    createdAt: Date.now(),
  };

  $todos.set({
    ...$todos.get(),
    [newTodo.id]: newTodo,
  });
}

export function toggleTodo(id: string): void {
  const todos = $todos.get();
  const todo = todos[id];
  if (!todo) return;

  $todos.set({
    ...todos,
    [id]: { ...todo, completed: !todo.completed },
  });
}
```

## 🔌 React 整合

### 使用 @nanostores/react

Nanostores 通過 `@nanostores/react` 提供 React 整合：

```typescript
import { useStore } from '@nanostores/react';
import { $todos, $filter, addTodo } from './stores/todoStore';

function TodoApp() {
  // 訂閱 store - 組件只在相關數據變化時重新渲染
  const todos = useStore($todos);
  const filter = useStore($filter);

  // 直接調用 action creators
  const handleAdd = () => addTodo('New todo');

  return (
    <div>
      <p>Total todos: {Object.keys(todos).length}</p>
      <p>Current filter: {filter}</p>
      <button onClick={handleAdd}>Add Todo</button>
    </div>
  );
}
```

### 優勢

1. **無需 Context Provider**
   ```tsx
   // ❌ Redux 需要
   <Provider store={store}>
     <App />
   </Provider>

   // ✅ Nanostores 不需要
   <App />
   ```

2. **精確訂閱**
   ```tsx
   // 只訂閱需要的數據
   const todos = useStore($todos);     // 僅 todos 變化時重新渲染
   const filter = useStore($filter);   // 僅 filter 變化時重新渲染
   ```

3. **清晰的數據流**
   ```tsx
   // 讀取：useStore
   const todos = useStore($todos);

   // 寫入：直接調用 action
   addTodo('New task');
   ```

## 🌐 框架無關性展示

Nanostores 的最大優勢是完全框架無關！

### Vanilla JavaScript

```javascript
import { $todos, addTodo } from './stores/todoStore';

// 訂閱變化
const unsubscribe = $todos.listen((todos) => {
  console.log('Todos changed:', todos);
  updateDOM(todos);
});

// 更新狀態
addTodo('New todo from vanilla JS');

// 取消訂閱
unsubscribe();
```

### Vue 3 Composition API

```vue
<script setup>
import { useStore } from '@nanostores/vue';
import { $todos, addTodo } from './stores/todoStore';

// 在 Vue 中使用相同的 store！
const todos = useStore($todos);
</script>

<template>
  <div>
    <div v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
    </div>
    <button @click="addTodo('Vue todo')">Add</button>
  </div>
</template>
```

### Svelte

```svelte
<script>
  import { $todos, addTodo } from './stores/todoStore';
  // Svelte 原生支援 $ 前綴的 stores！
</script>

<div>
  {#each Object.values($todos) as todo}
    <div>{todo.text}</div>
  {/each}
  <button on:click={() => addTodo('Svelte todo')}>Add</button>
</div>
```

### 微前端應用

```typescript
// 在微前端架構中，不同框架可以共享同一個 store！

// App A (React)
import { useStore } from '@nanostores/react';
import { $sharedState } from '@company/shared-stores';

// App B (Vue)
import { useStore } from '@nanostores/vue';
import { $sharedState } from '@company/shared-stores';

// App C (Vanilla)
import { $sharedState } from '@company/shared-stores';
$sharedState.listen(value => updateUI(value));
```

## 📊 與其他狀態管理方案比較

| 特性 | Nanostores | Redux | Zustand | Recoil | Jotai | MobX |
|------|-----------|-------|---------|--------|-------|------|
| **Bundle 大小** | <1KB | ~3KB | ~1.2KB | ~14KB | ~3KB | ~16KB |
| **框架無關** | ✅ | ✅ | ✅ | ❌ React only | ❌ React only | ✅ |
| **學習曲線** | 簡單 | 困難 | 簡單 | 中等 | 簡單 | 中等 |
| **TypeScript** | 優秀 | 良好 | 優秀 | 良好 | 優秀 | 良好 |
| **DevTools** | 良好 | 優秀 | 良好 | 優秀 | 良好 | 優秀 |
| **樣板代碼** | 極少 | 很多 | 少 | 少 | 極少 | 少 |
| **性能** | 優秀 | 良好 | 優秀 | 優秀 | 優秀 | 優秀 |
| **持久化** | 內建 | 需插件 | 需中間件 | 需額外配置 | 需插件 | 需插件 |

### 何時使用 Nanostores？

**✅ 適合：**
- 小型到中型應用
- 需要極小的 bundle size
- 微前端架構（多框架共享狀態）
- SSR/SSG 應用
- 需要簡單、直觀的 API
- 快速原型開發

**⚠️ 考慮其他方案：**
- 大型企業級應用（可能需要 Redux 的成熟生態）
- 需要時間旅行調試（Redux DevTools 更強大）
- 團隊已經深度投入其他方案

## 🔧 進階用法

### 異步操作

```typescript
import { atom, task } from 'nanostores';

export const $users = atom<User[]>([]);
export const $loading = atom(false);

export async function fetchUsers() {
  $loading.set(true);
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    $users.set(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    $loading.set(false);
  }
}
```

### 中間件模式

```typescript
export function withLogger<T>(store: WritableAtom<T>) {
  const originalSet = store.set.bind(store);

  store.set = (value: T) => {
    console.log('Before:', store.get());
    originalSet(value);
    console.log('After:', store.get());
  };

  return store;
}

export const $count = withLogger(atom(0));
```

### 選擇器模式

```typescript
export function selectTodoById(id: string) {
  return computed($todos, (todos) => todos[id]);
}

// 在組件中使用
const todo = useStore(selectTodoById('123'));
```

## 🧪 測試

### 測試 Stores

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { $todos, addTodo, toggleTodo } from './todoStore';

describe('Todo Store', () => {
  beforeEach(() => {
    $todos.set({});
  });

  it('should add todo', () => {
    addTodo('Test todo');
    const todos = $todos.get();
    expect(Object.values(todos)).toHaveLength(1);
    expect(Object.values(todos)[0].text).toBe('Test todo');
  });

  it('should toggle todo', () => {
    addTodo('Test todo');
    const id = Object.keys($todos.get())[0];

    toggleTodo(id);
    expect($todos.get()[id].completed).toBe(true);

    toggleTodo(id);
    expect($todos.get()[id].completed).toBe(false);
  });
});
```

### 測試組件

```typescript
import { render, screen } from '@testing-library/react';
import { $todos } from './stores/todoStore';
import { TodoList } from './components/TodoList';

it('renders todos', () => {
  $todos.set({
    '1': { id: '1', text: 'Test', completed: false, createdAt: Date.now() }
  });

  render(<TodoList />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

## 📚 學習資源

### 官方資源
- [官方網站](https://github.com/nanostores/nanostores)
- [官方文檔](https://github.com/nanostores/nanostores#guide)
- [React 整合](https://github.com/nanostores/react)
- [Vue 整合](https://github.com/nanostores/vue)
- [Svelte 整合](https://github.com/nanostores/svelte)

### 生態系統
- [@nanostores/persistent](https://github.com/nanostores/persistent) - LocalStorage 持久化
- [@nanostores/router](https://github.com/nanostores/router) - 路由狀態管理
- [@nanostores/query](https://github.com/nanostores/query) - 數據獲取
- [@nanostores/i18n](https://github.com/nanostores/i18n) - 國際化

### 社區文章
- [Why Nanostores?](https://evilmartians.com/chronicles/nano-stores-rethinking-global-state-management)
- [Nanostores for React Developers](https://dev.to/nanostores/nanostores-for-react-developers-2h0p)
- [Building Micro-frontends with Nanostores](https://martinfowler.com/articles/micro-frontends.html)

### 視頻教程
- [Nanostores Crash Course](https://www.youtube.com/results?search_query=nanostores+tutorial)
- [State Management in 2024](https://www.youtube.com/results?search_query=nanostores+vs+zustand)

## 🎯 核心概念總結

### 1. Store 類型
- **atom** - 簡單值（number, string, boolean, null）
- **map** - 對象和集合
- **computed** - 派生狀態
- **persistentAtom** - 持久化的 atom

### 2. 操作方法
- `store.get()` - 獲取當前值
- `store.set(value)` - 設置新值
- `store.listen(callback)` - 訂閱變化
- `mapStore.setKey(key, value)` - 更新對象的鍵

### 3. React 整合
- `useStore(store)` - 訂閱 store 並獲取值
- 自動清理訂閱
- 最小化重新渲染

### 4. 最佳實踐
- 使用 `$` 前綴命名 store（約定俗成）
- 使用 action creators 封裝邏輯
- 合理使用 computed 避免重複計算
- TypeScript 定義明確的類型

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 🌟 總結

Nanostores 是一個現代化、輕量級的狀態管理解決方案，特別適合：

1. **追求極致性能** - 小於 1KB 的體積
2. **框架無關** - 可在任何環境使用
3. **簡單直觀** - 最小化的學習成本
4. **TypeScript 優先** - 完美的類型安全
5. **微前端友好** - 跨框架共享狀態

如果你正在尋找一個簡單、高效、現代的狀態管理方案，Nanostores 絕對值得一試！

---

**Happy Coding with Nanostores! 🎉**
