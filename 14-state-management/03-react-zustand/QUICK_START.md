# 🚀 快速開始指南

## 一分鐘上手

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動開發服務器
```bash
npm run dev
```

### 3. 訪問應用
打開瀏覽器訪問 http://localhost:3000

## 核心概念速覽

### 創建 Store
```typescript
import { create } from 'zustand';

const useStore = create((set) => ({
  // 狀態
  count: 0,

  // 方法
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

### 在組件中使用
```typescript
function Counter() {
  // 訂閱狀態
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}
```

## Zustand vs Redux - 一圖看懂

### Redux 需要：
```
1. 定義 Action Types
2. 創建 Actions
3. 編寫 Reducer
4. 配置 Store
5. 使用 Provider 包裝
6. dispatch(action)
```

### Zustand 只需：
```
1. create() 創建 store
2. 直接調用方法
```

**代碼量減少 80%！**

## 常用 Patterns

### 1. 持久化
```typescript
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({ /* ... */ }),
    { name: 'my-storage' }
  )
);
```

### 2. 選擇器
```typescript
const useStore = create((set, get) => ({
  todos: [],

  getActiveTodos: () => {
    return get().todos.filter(t => !t.completed);
  }
}));
```

### 3. 異步操作
```typescript
const useStore = create((set) => ({
  data: null,

  fetchData: async () => {
    const data = await api.fetch();
    set({ data });
  }
}));
```

## 下一步

閱讀 [README.md](./README.md) 了解完整功能和詳細對比。
