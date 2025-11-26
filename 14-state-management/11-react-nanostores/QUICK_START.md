# 快速開始指南

## 🚀 5 分鐘上手 Nanostores

### 1. 安裝依賴 (30 秒)

```bash
npm install
```

### 2. 啟動開發服務器 (10 秒)

```bash
npm run dev
```

### 3. 開始使用 (5 分鐘)

打開瀏覽器訪問 `http://localhost:5173`，你將看到一個完整功能的 Todo List！

#### 試試這些功能：

1. **新增待辦事項** - 在輸入框中輸入文字，按 Enter
2. **標記完成** - 點擊複選框
3. **編輯** - 雙擊任何待辦事項
4. **刪除** - 點擊右側的 × 按鈕
5. **篩選** - 使用頂部的篩選按鈕
6. **批量操作** - 使用底部的統計區域按鈕

所有數據會自動保存到 localStorage！

## 📖 核心概念（3 分鐘理解）

### Nanostores 只有 3 個核心 API：

#### 1. atom - 簡單值
```typescript
import { atom } from 'nanostores';

const $count = atom(0);

// 讀取
const value = $count.get();

// 寫入
$count.set(10);

// 訂閱
$count.listen(value => console.log(value));
```

#### 2. computed - 派生狀態
```typescript
import { computed } from 'nanostores';

const $doubled = computed($count, count => count * 2);
```

#### 3. persistentAtom - 持久化
```typescript
import { persistentAtom } from '@nanostores/persistent';

const $theme = persistentAtom('theme', 'light');
```

### React 中使用：

```typescript
import { useStore } from '@nanostores/react';

function Counter() {
  const count = useStore($count);
  return <div onClick={() => $count.set(count + 1)}>{count}</div>;
}
```

就這麼簡單！

## 🎯 關鍵特點

1. **極小體積** - 整個庫 < 1KB
2. **零配置** - 無需 Provider 或 Context
3. **框架無關** - 可用於 React、Vue、Svelte 等
4. **TypeScript** - 完美的類型推導

## 📁 查看代碼

最佳學習方式是閱讀代碼：

1. **Stores** - `src/stores/todoStore.ts` - 所有狀態管理邏輯
2. **Components** - `src/components/` - 如何在 React 中使用
3. **Vanilla Example** - `src/stores/vanillaExample.ts` - 框架無關示例

## 🔥 快速實驗

打開瀏覽器控制台，嘗試以下代碼：

```javascript
// Nanostores 會自動暴露到 window 對象（開發模式）
import { $todos, addTodo, $stats } from './stores/todoStore';

// 添加 todo
addTodo('Test from console');

// 查看統計
console.log($stats.get());

// 訂閱變化
$stats.listen(stats => console.log('Stats:', stats));
```

## 📚 下一步

- 閱讀完整 [README.md](./README.md)
- 查看 [官方文檔](https://github.com/nanostores/nanostores)
- 嘗試修改代碼並觀察效果

開始你的 Nanostores 之旅吧！ 🚀
