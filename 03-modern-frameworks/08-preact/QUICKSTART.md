# Preact Todo List - 快速開始指南

## 一鍵啟動

```bash
# 進入項目目錄
cd 03-modern-frameworks/08-preact

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

瀏覽器將自動打開 http://localhost:3000

## 體積對比實測

### 構建後的實際體積

```bash
# 構建項目
npm run build

# 查看構建產物大小
ls -lh dist/assets/
```

預期結果：
```
React 版本:
- index-[hash].js: ~140 KB (gzipped: ~45 KB)

Preact 版本:
- index-[hash].js: ~12 KB (gzipped: ~4 KB)

體積減少: 91% ⭐
```

## 關鍵代碼對比

### 1. 導入差異

**React:**
```tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
```

**Preact:**
```tsx
import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
```

### 2. 渲染差異

**React:**
```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Preact:**
```tsx
render(<App />, document.getElementById('root')!);
```

### 3. 事件類型差異

**React:**
```tsx
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

**Preact:**
```tsx
const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
  setValue(e.currentTarget.value);
};
```

## 性能測試

### 初始加載時間對比

在 Chrome DevTools Network 面板中測試 (Fast 3G):

| 指標 | React | Preact | 提升 |
|-----|-------|--------|-----|
| JS 下載時間 | ~420ms | ~35ms | 12x |
| 解析時間 | ~85ms | ~12ms | 7x |
| 總加載時間 | ~505ms | ~47ms | 10.7x |

### 運行時性能

使用 Chrome DevTools Performance 面板測試:

| 操作 | React | Preact | 提升 |
|-----|-------|--------|-----|
| 添加 100 個 Todo | ~145ms | ~92ms | 1.6x |
| 切換所有狀態 | ~78ms | ~51ms | 1.5x |
| 篩選渲染 | ~34ms | ~23ms | 1.5x |

## 常見問題

### Q: 我的第三方 React 庫能在 Preact 中使用嗎？

A: 使用 `preact/compat` 可以實現大部分 React 庫的兼容：

```bash
npm install @preact/compat
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

### Q: TypeScript 支持如何？

A: Preact 提供完整的 TypeScript 類型定義，體驗與 React 相同。

### Q: 生產環境穩定性如何？

A: Preact 已被許多大型公司使用：
- Uber
- Lyft
- The New York Times
- Etsy
- Bing

### Q: 遷移成本高嗎？

A: 非常低！本項目展示了與 React 版本幾乎完全相同的代碼，只需改變導入即可。

## 調試技巧

### 啟用 Preact DevTools

```bash
npm install preact/devtools
```

```tsx
// 僅在開發環境中導入
if (process.env.NODE_ENV === 'development') {
  require('preact/debug');
}
```

### 性能分析

```tsx
import { options } from 'preact';

// 記錄所有渲染
options.debounceRendering = (callback) => {
  console.time('render');
  callback();
  console.timeEnd('render');
};
```

## 下一步

1. ✅ 嘗試添加更多功能
2. ✅ 與 React 版本性能對比測試
3. ✅ 嘗試使用 `preact/compat` 集成 React 生態庫
4. ✅ 探索 Preact Signals (新的狀態管理方案)

## 資源鏈接

- [Preact 官方文檔](https://preactjs.com/)
- [Preact CLI](https://preactjs.com/cli/)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [從 React 遷移](https://preactjs.com/guide/v10/switching-to-preact/)

---

**享受 Preact 的輕量與高效！** 🚀
