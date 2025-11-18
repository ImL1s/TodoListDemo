# Preact Todo List

基於 **Preact** + **TypeScript** 構建的輕量級待辦事項應用。

## 專案特色

- **極致輕量**: Preact 核心庫僅 3KB (gzipped)
- **React 兼容**: 與 React API 完全兼容，可以無縫遷移
- **完整 Hooks 支持**: 支持所有 React Hooks (useState, useEffect, useMemo, useCallback 等)
- **TypeScript**: 完整的類型定義和類型安全
- **高性能**: 比 React 更快的渲染性能
- **現代工具鏈**: 使用 Vite 構建，開發體驗極佳

## Preact vs React 差異對比

### 📦 體積對比

| 框架 | 大小 (minified + gzipped) | 相對比例 |
|------|--------------------------|---------|
| **Preact 10** | ~3KB | 1x |
| React 18 + ReactDOM | ~42KB | 14x |

**結論**: Preact 比 React 小約 **14 倍**，對於關注包體積和加載速度的項目非常有價值。

### 🔄 API 兼容性

#### 相同點

```tsx
// ✅ Hooks API 完全相同
import { useState, useEffect, useMemo, useCallback } from 'preact/hooks';

function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  const memoValue = useMemo(() => count * 2, [count]);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <div onClick={handleClick}>{memoValue}</div>;
}
```

```tsx
// ✅ JSX 語法完全相同
<div className="container">
  <h1>Hello</h1>
  <button onClick={handleClick}>Click</button>
</div>
```

```tsx
// ✅ 組件定義完全相同
interface Props {
  name: string;
}

const MyComponent = ({ name }: Props) => {
  return <div>Hello {name}</div>;
};
```

#### 主要差異

| 特性 | React | Preact |
|-----|-------|--------|
| **入口文件導入** | `import React from 'react'` | 不需要導入 `h` 或 `Fragment` |
| **渲染方法** | `ReactDOM.createRoot(el).render(<App />)` | `render(<App />, el)` |
| **事件類型** | `React.ChangeEvent<HTMLInputElement>` | `JSX.TargetedEvent<HTMLInputElement>` |
| **類名屬性** | `className` 和 `class` 都支持 | 主要使用 `className` (class 也支持) |
| **Ref 類型** | `React.RefObject<T>` | `Ref<T>` |
| **合成事件** | 完整的合成事件系統 | 使用原生 DOM 事件 |

### 代碼遷移示例

#### React 版本
```tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

#### Preact 版本
```tsx
import { useState } from 'preact/hooks';
import { render } from 'preact';

const App = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};

render(<App />, document.getElementById('root')!);
```

**差異**: 只需要改變導入路徑和渲染方法，業務邏輯代碼完全相同！

### 🎯 何時選擇 Preact？

#### ✅ 適合使用 Preact 的場景

1. **關注包體積**: 需要最小化 JavaScript 包大小
2. **移動端優先**: 移動設備上需要快速加載
3. **嵌入式應用**: 作為第三方腳本嵌入其他網站
4. **漸進式增強**: 為現有網站添加交互功能
5. **原型開發**: 快速開發和測試想法
6. **性能關鍵**: 需要最快的渲染性能

#### ❌ 不適合使用 Preact 的場景

1. **依賴 React 生態**: 需要使用大量 React 專屬的第三方庫
2. **團隊熟悉度**: 團隊只熟悉 React，學習成本高
3. **複雜狀態管理**: 使用 Redux 等 React 專屬的狀態管理方案
4. **SSR 需求**: 需要復雜的服務端渲染方案 (Next.js)

### 🚀 性能對比

在相同的 Todo List 應用中：

| 指標 | React 18 | Preact 10 | 提升 |
|-----|----------|-----------|-----|
| **初始加載時間** | ~120ms | ~45ms | **2.7x** |
| **包體積** | ~140KB | ~12KB | **11.7x** |
| **首次渲染** | ~8ms | ~5ms | **1.6x** |
| **更新渲染** | ~3ms | ~2ms | **1.5x** |

> 註：以上數據為示例測試結果，實際性能取決於具體應用和環境

### 📚 TypeScript 支持

Preact 完全支持 TypeScript，並提供了完整的類型定義：

```tsx
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import type { JSX } from 'preact';

interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
}

const TodoItem: FunctionComponent<TodoProps> = ({ id, text, completed }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    console.log('Clicked:', e.currentTarget);
  };

  return <div>{text}</div>;
};
```

### 🔧 配置差異

#### tsconfig.json

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"  // 關鍵配置
  }
}
```

#### Vite 配置

```typescript
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'  // 使用 Preact 預設

export default defineConfig({
  plugins: [preact()]
})
```

## 項目結構

```
08-preact/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx    # 輸入組件
│   │   ├── TodoList.tsx     # 列表容器
│   │   └── TodoItem.tsx     # 列表項組件
│   ├── App.tsx              # 主應用組件
│   ├── App.css              # 樣式文件
│   ├── main.tsx             # 應用入口
│   └── types.ts             # TypeScript 類型定義
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 安裝依賴

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

## 開發命令

```bash
# 啟動開發服務器 (http://localhost:3000)
npm run dev

# TypeScript 類型檢查
npm run type-check

# 構建生產版本
npm run build

# 預覽生產構建
npm run preview
```

## 功能特性

### 基礎功能

- ✅ 添加待辦事項
- ✅ 標記完成/未完成
- ✅ 編輯待辦事項
- ✅ 刪除待辦事項
- ✅ 篩選顯示（全部/進行中/已完成）
- ✅ 統計信息展示
- ✅ 清除所有已完成項目

### 技術特性

- ✅ **LocalStorage 持久化**: 數據自動保存到本地
- ✅ **TypeScript 類型安全**: 完整的類型定義和檢查
- ✅ **自定義 Hooks**: useLocalStorage 泛型 Hook
- ✅ **性能優化**: useMemo 和 useCallback 優化
- ✅ **響應式設計**: 完美適配移動端和桌面端
- ✅ **鍵盤快捷鍵**: Enter 保存，Escape 取消
- ✅ **時間戳記錄**: 記錄創建和完成時間

## 關鍵代碼示例

### 自定義 Hook (與 React 完全相同)

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  }, [key, storedValue]);

  return [storedValue, setValue];
}
```

### 事件處理 (Preact 特定類型)

```tsx
import type { JSX } from 'preact';

const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
  e.preventDefault();
  // 處理邏輯
};

const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
  setValue(e.currentTarget.value);
};
```

## 遷移建議

### 從 React 遷移到 Preact

1. **安裝依賴**
   ```bash
   npm uninstall react react-dom
   npm install preact
   ```

2. **更新導入**
   ```tsx
   // 之前
   import React, { useState } from 'react';
   import ReactDOM from 'react-dom/client';

   // 之後
   import { useState } from 'preact/hooks';
   import { render } from 'preact';
   ```

3. **更新 tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "jsxImportSource": "preact"
     }
   }
   ```

4. **更新事件類型** (可選，提高類型安全性)
   ```tsx
   // React
   (e: React.ChangeEvent<HTMLInputElement>) => {}

   // Preact
   (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {}
   ```

### 使用 preact/compat 實現零成本遷移

如果遷移成本太高，可以使用 `preact/compat` 實現完全的 React 兼容：

```bash
npm install preact @preact/compat
```

```javascript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    }
  }
})
```

這樣可以保持所有 React 代碼不變，直接使用 Preact 運行！

## 學習資源

- [Preact 官方文檔](https://preactjs.com/)
- [Preact vs React 差異](https://preactjs.com/guide/v10/differences-to-react/)
- [從 React 切換到 Preact](https://preactjs.com/guide/v10/switching-to-preact/)
- [Preact TypeScript 支持](https://preactjs.com/guide/v10/typescript/)

## 瀏覽器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)
- 移動端瀏覽器

## 總結

Preact 是一個優秀的 React 替代方案，特別適合：

- 🎯 對包體積有嚴格要求的項目
- ⚡ 需要極致加載速度的應用
- 📱 移動端優先的產品
- 🔧 漸進式增強現有網站

通過這個 Todo List 項目，您可以看到 Preact 如何以極小的體積提供與 React 幾乎完全相同的開發體驗！

## 授權

MIT License
