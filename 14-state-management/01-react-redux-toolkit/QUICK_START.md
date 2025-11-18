# 🚀 快速入門指南

這是一個 5 分鐘快速上手指南，幫助你立即開始使用這個 Redux Toolkit Todo List 專案。

## 步驟 1: 安裝依賴

```bash
npm install
```

## 步驟 2: 啟動開發伺服器

```bash
npm run dev
```

## 步驟 3: 開啟瀏覽器

訪問 http://localhost:5173

## 步驟 4: 開始使用

1. 在輸入框中輸入待辦事項，點擊「新增」
2. 點擊核取方塊切換完成狀態
3. 雙擊待辦事項進入編輯模式
4. 使用篩選按鈕切換不同視圖
5. 點擊「清除已完成」批量刪除已完成項目

## 📖 核心代碼解析

### 1. Redux Slice 定義

```typescript
// src/features/todos/todosSlice.ts
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    }
  }
});
```

### 2. Store 配置

```typescript
// src/app/store.ts
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});
```

### 3. 組件中使用

```typescript
// src/features/todos/TodoList.tsx
const dispatch = useAppDispatch();
const todos = useAppSelector(selectFilteredTodos);

// 觸發 action
dispatch(addTodo('新的待辦'));
```

## 🎯 下一步

- 閱讀完整的 [README.md](./README.md) 了解更多細節
- 查看 [官方文檔](https://redux-toolkit.js.org/) 深入學習
- 嘗試修改代碼，添加自己的功能

## 💡 常用操作

### 新增功能

1. 在 `todosSlice.ts` 添加新的 reducer
2. 導出 action creator
3. 在組件中使用

### 修改樣式

編輯 `src/styles/App.css`，修改 CSS 變數：

```css
:root {
  --primary-color: #your-color;
}
```

### 添加持久化

已內建 localStorage 持久化，無需額外配置！

## 🐛 疑難排解

### 依賴安裝失敗

```bash
# 清除快取重新安裝
rm -rf node_modules package-lock.json
npm install
```

### 無法啟動開發伺服器

確保 5173 端口未被佔用，或修改 `vite.config.ts`：

```typescript
export default defineConfig({
  server: {
    port: 3000  // 自訂端口
  }
})
```

---

**祝你使用愉快！** 🎉
