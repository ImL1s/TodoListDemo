# ✨ 功能詳解

本文檔詳細說明每個功能的實現細節和使用方法。

## 核心功能

### 1. 新增待辦事項

**使用方式**:
- 在頂部輸入框輸入待辦事項
- 點擊「新增」按鈕或按 Enter 鍵

**實現細節**:

```typescript
// 同步版本（推薦）
export const addTodo = (state, action: PayloadAction<string>) => {
  const newTodo: Todo = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text: action.payload,
    completed: false,
    createdAt: Date.now(),
  };
  state.items.push(newTodo);
  saveTodosToStorage(state.items);
};

// 非同步版本（示範用）
export const addTodoAsync = createAsyncThunk(
  'todos/addTodoAsync',
  async (text: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return newTodo;
  }
);
```

**特點**:
- ✅ 自動生成唯一 ID
- ✅ 記錄創建時間
- ✅ 自動儲存到 localStorage
- ✅ 輸入驗證（不允許空白）

---

### 2. 編輯待辦事項

**使用方式**:
- 雙擊待辦事項進入編輯模式
- 或點擊右側的編輯按鈕（✏️）
- 按 Enter 儲存，Esc 取消

**實現細節**:

```typescript
// 狀態管理
interface TodosState {
  editingId: string | null;  // 追蹤正在編輯的項目
}

// Actions
startEditing: (state, action: PayloadAction<string>) => {
  state.editingId = action.payload;
},
updateTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
  const todo = state.items.find(item => item.id === action.payload.id);
  if (todo) {
    todo.text = action.payload.text;
    saveTodosToStorage(state.items);
  }
  state.editingId = null;
},
```

**組件實現**:

```typescript
const isEditing = editingId === todo.id;

useEffect(() => {
  if (isEditing && inputRef.current) {
    inputRef.current.focus();
    inputRef.current.select();  // 自動選中文字
  }
}, [isEditing]);
```

**特點**:
- ✅ 雙擊快速編輯
- ✅ 自動聚焦並選中
- ✅ 鍵盤快捷鍵支援
- ✅ 失去焦點自動儲存

---

### 3. 刪除待辦事項

**使用方式**:
- 點擊刪除按鈕（🗑️）
- 或使用「清除已完成」批量刪除

**實現細節**:

```typescript
// 單個刪除
deleteTodo: (state, action: PayloadAction<string>) => {
  state.items = state.items.filter(item => item.id !== action.payload);
  saveTodosToStorage(state.items);
},

// 批量清除已完成
clearCompleted: (state) => {
  state.items = state.items.filter(item => !item.completed);
  saveTodosToStorage(state.items);
},
```

**特點**:
- ✅ 即時刪除
- ✅ 批量操作
- ✅ 自動更新統計

---

### 4. 切換完成狀態

**使用方式**:
- 點擊項目前的核取方塊
- 或使用「全部標記」切換所有項目

**實現細節**:

```typescript
// 單個切換
toggleTodo: (state, action: PayloadAction<string>) => {
  const todo = state.items.find(item => item.id === action.payload);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodosToStorage(state.items);
  }
},

// 全部切換
toggleAll: (state, action: PayloadAction<boolean>) => {
  state.items.forEach(item => {
    item.completed = action.payload;
  });
  saveTodosToStorage(state.items);
},
```

**特點**:
- ✅ 視覺回饋（刪除線、透明度）
- ✅ 全部切換功能
- ✅ 自動更新統計

---

### 5. 篩選功能

**使用方式**:
- 點擊「全部」、「進行中」、「已完成」按鈕

**實現細節**:

```typescript
// 狀態管理
setFilter: (state, action: PayloadAction<FilterType>) => {
  state.filter = action.payload;
},

// Selector 實現
export const selectFilteredTodos = (state: RootState) => {
  const { items, filter } = state.todos;
  switch (filter) {
    case 'active':
      return items.filter(todo => !todo.completed);
    case 'completed':
      return items.filter(todo => todo.completed);
    default:
      return items;
  }
};
```

**特點**:
- ✅ 即時篩選
- ✅ 視覺指示當前篩選
- ✅ 使用 Selector 優化性能

---

### 6. 統計資訊

**顯示內容**:
- 總計：所有待辦事項數量
- 進行中：未完成的數量
- 已完成：已完成的數量

**實現細節**:

```typescript
export const selectTodoStats = (state: RootState) => {
  const items = state.todos.items;
  return {
    total: items.length,
    active: items.filter(todo => !todo.completed).length,
    completed: items.filter(todo => todo.completed).length,
  };
};
```

**組件使用**:

```typescript
const stats = useAppSelector(selectTodoStats);

<span>總計: <strong>{stats.total}</strong></span>
<span>進行中: <strong>{stats.active}</strong></span>
<span>已完成: <strong>{stats.completed}</strong></span>
```

**特點**:
- ✅ 即時更新
- ✅ Memoized 計算
- ✅ 清晰的視覺呈現

---

### 7. localStorage 持久化

**功能**:
- 自動儲存所有變更
- 頁面重新載入後恢復數據

**實現細節**:

```typescript
// 儲存函數
const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

// 載入函數
const loadTodosFromStorage = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};

// 初始載入（使用非同步 thunk 示範）
export const loadTodos = createAsyncThunk(
  'todos/loadTodos',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return loadTodosFromStorage();
  }
);

// 在組件中載入
useEffect(() => {
  dispatch(loadTodos());
}, [dispatch]);
```

**特點**:
- ✅ 自動儲存
- ✅ 錯誤處理
- ✅ 非同步載入示範

---

## 進階功能

### 8. 鍵盤快捷鍵

| 按鍵 | 功能 | 適用場景 |
|------|------|---------|
| Enter | 儲存編輯 | 編輯模式 |
| Esc | 取消編輯 | 編輯模式 |
| Enter | 新增待辦 | 輸入框 |

**實現**:

```typescript
const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    handleSaveEdit();
  } else if (e.key === 'Escape') {
    handleCancelEdit();
  }
};
```

---

### 9. 非同步操作示範

**目的**: 示範 Redux Toolkit 的非同步處理能力

**使用 createAsyncThunk**:

```typescript
export const addTodoAsync = createAsyncThunk(
  'todos/addTodoAsync',
  async (text: string) => {
    // 模擬 API 請求
    await new Promise(resolve => setTimeout(resolve, 300));

    const newTodo: Todo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    return newTodo;
  }
);
```

**處理非同步狀態**:

```typescript
extraReducers: (builder) => {
  builder
    .addCase(addTodoAsync.pending, (state) => {
      // 可以添加 loading 狀態
    })
    .addCase(addTodoAsync.fulfilled, (state, action) => {
      state.items.push(action.payload);
      saveTodosToStorage(state.items);
    })
    .addCase(addTodoAsync.rejected, (state, error) => {
      // 錯誤處理
      console.error(error);
    });
},
```

---

## UI/UX 特性

### 視覺回饋

1. **懸停效果**
   - 按鈕懸停變色
   - 項目懸停邊框高亮
   - 刪除按鈕懸停紅色背景

2. **狀態指示**
   - 已完成項目：刪除線 + 降低透明度
   - 當前篩選：高亮按鈕
   - 編輯模式：藍色邊框

3. **平滑過渡**
   - 所有交互使用 CSS transition
   - 按鈕點擊動畫
   - 項目淡入淡出

### 響應式設計

**斷點**: 640px

**移動端優化**:
- 輸入框和按鈕垂直排列
- 篩選按鈕垂直排列
- 統計資訊垂直對齊
- 觸控友好的按鈕大小

```css
@media (max-width: 640px) {
  .todo-input {
    flex-direction: column;
  }
  .filter-buttons {
    flex-direction: column;
  }
}
```

---

## 性能優化

### 已實現

1. **Selector Memoization**
   - Redux Toolkit 自動優化
   - 只在依賴變化時重新計算

2. **事件處理優化**
   - 適當使用 useCallback
   - 避免不必要的重渲染

3. **localStorage 錯誤處理**
   - Try-catch 包裹
   - 降級處理

### 可選優化（大數據量場景）

1. **虛擬化列表**
   ```bash
   npm install react-window
   ```

2. **Reselect**
   ```bash
   npm install reselect
   ```

3. **React.memo**
   ```typescript
   export const TodoItem = React.memo(({ todo }) => { ... });
   ```

---

## 錯誤處理

### localStorage 錯誤

```typescript
try {
  localStorage.setItem(key, value);
} catch (error) {
  // 可能原因：
  // 1. 儲存空間已滿
  // 2. 隱私模式禁用
  // 3. 瀏覽器不支援
  console.error('Failed to save:', error);
  // 可以顯示使用者提示
}
```

### 輸入驗證

```typescript
if (text.trim()) {
  // 只有非空白內容才允許新增
  dispatch(addTodo(text.trim()));
  setText('');
}
```

---

## 未來功能規劃

### 短期計劃

- [ ] 拖拽排序
- [ ] 撤銷/重做
- [ ] 匯入/匯出 JSON

### 中期計劃

- [ ] 標籤系統
- [ ] 優先級
- [ ] 截止日期
- [ ] 提醒功能

### 長期計劃

- [ ] 多使用者協作
- [ ] 雲端同步
- [ ] 移動應用
- [ ] AI 智能建議

---

**持續改進中！** 🚀

如有功能建議，歡迎提交 Issue！
