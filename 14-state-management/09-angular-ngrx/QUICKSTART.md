# NgRx Todo List - 快速開始指南

## 5 分鐘快速上手

### 步驟 1: 安裝依賴

```bash
cd 14-state-management/09-angular-ngrx
npm install
```

### 步驟 2: 啟動應用

```bash
npm start
```

### 步驟 3: 開啟瀏覽器

訪問 `http://localhost:4200`

## 專案特色

### 1. NgRx 核心功能完整實現

#### Actions (動作定義)
位置：`src/app/store/actions/todo.actions.ts`

```typescript
// 創建 Todo
export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ text: string }>()
);

// 更新 Todo
export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ id: string; text: string }>()
);

// 切換完成狀態
export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: string }>()
);

// 刪除 Todo
export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: string }>()
);

// 設定篩選
export const setFilter = createAction(
  '[Todo] Set Filter',
  props<{ filter: 'all' | 'active' | 'completed' }>()
);
```

#### Reducers (狀態管理)
位置：`src/app/store/reducers/todo.reducer.ts`

使用 **Entity Adapter** 自動處理 CRUD 操作：

```typescript
export const todoAdapter = createEntityAdapter<Todo>({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});

export const todoReducer = createReducer(
  initialState,
  on(addTodoSuccess, (state, { todo }) =>
    todoAdapter.addOne(todo, state)  // 自動新增
  ),
  on(updateTodoSuccess, (state, { id, text }) =>
    todoAdapter.updateOne({ id, changes: { text } }, state)  // 自動更新
  ),
  on(deleteTodoSuccess, (state, { id }) =>
    todoAdapter.removeOne(id, state)  // 自動刪除
  )
);
```

#### Selectors (狀態選擇器)
位置：`src/app/store/selectors/todo.selectors.ts`

使用 **Memoized Selectors** 優化性能：

```typescript
// 取得所有 Todos
export const selectAllTodos = createSelector(
  selectTodoState,
  selectAll
);

// 取得篩選後的 Todos
export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectFilter,
  (todos, filter) => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  }
);

// 取得統計資訊
export const selectActiveTodosCount = createSelector(
  selectAllTodos,
  (todos) => todos.filter(t => !t.completed).length
);
```

#### Effects (副作用處理)
位置：`src/app/store/effects/todo.effects.ts`

處理 **異步操作** 和 **LocalStorage 持久化**：

```typescript
// 新增 Todo Effect
addTodo$ = createEffect(() =>
  this.actions$.pipe(
    ofType(addTodo),
    map(({ text }) => {
      const todo: Todo = {
        id: generateId(),
        text,
        completed: false,
        createdAt: Date.now(),
      };
      return addTodoSuccess({ todo });
    })
  )
);

// LocalStorage 儲存 Effect
saveTodos$ = createEffect(
  () => this.actions$.pipe(
    ofType(
      addTodoSuccess,
      updateTodoSuccess,
      deleteTodoSuccess,
      toggleTodoSuccess
    ),
    withLatestFrom(this.store.select(selectAllTodos)),
    tap(([, todos]) => {
      localStorage.setItem('ngrx-todos', JSON.stringify(todos));
    })
  ),
  { dispatch: false }
);

// LocalStorage 載入 Effect
loadTodos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadTodos),
    map(() => {
      const stored = localStorage.getItem('ngrx-todos');
      const todos = stored ? JSON.parse(stored) : [];
      return loadTodosSuccess({ todos });
    })
  )
);
```

### 2. 組件架構

#### TodoListComponent (主容器)
- 使用 Store 的 `select()` 訂閱狀態
- 使用 Store 的 `dispatch()` 發送 Actions
- 整合所有子組件

```typescript
export class TodoListComponent {
  // 訂閱狀態
  filteredTodos$ = this.store.select(selectFilteredTodos);
  filter$ = this.store.select(selectFilter);
  activeCount$ = this.store.select(selectActiveTodosCount);

  // 發送 Actions
  addTodo(): void {
    this.store.dispatch(addTodo({ text: this.newTodoText }));
  }

  toggleTodo(id: string): void {
    this.store.dispatch(toggleTodo({ id }));
  }
}
```

#### TodoItemComponent (待辦項目)
- 雙擊編輯功能
- 切換完成狀態
- 刪除功能

#### TodoFilterComponent (篩選器)
- 篩選按鈕（全部、進行中、已完成）
- 統計資訊顯示
- 清除已完成功能

### 3. 資料流程圖

```
使用者操作
    ↓
Component dispatch Action
    ↓
Action → Effects (副作用)
    ↓
Effects dispatch Success Action
    ↓
Reducer 處理 Action
    ↓
更新 Store 狀態
    ↓
Selector 選擇狀態
    ↓
Component 訂閱更新
    ↓
UI 重新渲染
```

### 4. Entity Adapter 優勢

NgRx Entity Adapter 提供：

- **自動化的 CRUD 操作**
  - `addOne`, `addMany`
  - `updateOne`, `updateMany`
  - `removeOne`, `removeMany`
  - `setAll`, `setOne`

- **內建的選擇器**
  - `selectIds` - 所有 ID 陣列
  - `selectEntities` - ID 對應實體的字典
  - `selectAll` - 所有實體陣列
  - `selectTotal` - 實體總數

- **排序功能**
  ```typescript
  sortComparer: (a, b) => b.createdAt - a.createdAt
  ```

- **性能優化**
  - 正規化的狀態結構
  - 快速的查找和更新

### 5. 開發工具

#### Redux DevTools 整合

已在 `app.config.ts` 中配置：

```typescript
provideStoreDevtools({
  maxAge: 25,                    // 保留最近 25 個狀態
  logOnly: !isDevMode(),         // 生產環境只記錄
  autoPause: true,               // 自動暂停
  trace: false,                  // 不追蹤堆疊
  traceLimit: 75,                // 追蹤限制
})
```

功能：
- 時間旅行調試
- Action 歷史記錄
- 狀態快照
- 性能分析

## 核心概念速查

### Action 命名慣例

```
[來源] 動作名稱
[來源] 動作名稱 Success
[來源] 動作名稱 Failure
```

範例：
```typescript
'[Todo] Add Todo'
'[Todo] Add Todo Success'
'[Todo] Add Todo Failure'
```

### Reducer 純函數原則

- ✅ 總是返回新的狀態物件
- ✅ 不修改原始狀態
- ✅ 沒有副作用
- ❌ 不直接修改 state
- ❌ 不進行 API 呼叫
- ❌ 不訪問 localStorage

### Effect 副作用處理

Effects 應該：
- ✅ 處理異步操作
- ✅ 處理 API 呼叫
- ✅ 處理 localStorage
- ✅ 捕獲錯誤
- ❌ 不直接修改狀態
- ❌ 不同步執行

### Selector 記憶化

Selectors 會：
- ✅ 快取計算結果
- ✅ 只在輸入改變時重新計算
- ✅ 可以組合使用
- ✅ 提升性能

## 常見問題

### Q: 為什麼需要 Success/Failure Actions？

A: 這是處理異步操作的標準模式：
- 原始 Action：表示意圖（如 `loadTodos`）
- Success Action：操作成功（如 `loadTodosSuccess`）
- Failure Action：操作失敗（如 `loadTodosFailure`）

### Q: 什麼時候使用 Effects？

A: 當你需要：
- 執行 API 呼叫
- 訪問 localStorage
- 導航到其他頁面
- 執行任何副作用

### Q: 為什麼使用 Entity Adapter？

A: Entity Adapter 提供：
- 標準化的狀態結構
- 自動的 CRUD 操作
- 性能優化
- 減少樣板代碼

### Q: Selector 和直接訪問 Store 的區別？

A: Selector 提供：
- 記憶化（memoization）
- 類型安全
- 可測試性
- 可重用性
- 性能優化

## 下一步

1. **閱讀完整 README.md**
   - 了解更多 NgRx 概念
   - 學習最佳實踐
   - 查看進階功能

2. **實驗 DevTools**
   - 安裝 Redux DevTools
   - 探索時間旅行功能
   - 分析 Action 流程

3. **擴展功能**
   - 加入分類功能
   - 實作優先級
   - 加入到期日期
   - 串接後端 API

4. **學習資源**
   - 查看 README.md 中的學習資源
   - 閱讀 NgRx 官方文件
   - 觀看教學影片

## 專案檔案說明

```
src/app/
├── models/
│   └── todo.model.ts              # 資料模型定義
├── store/
│   ├── actions/
│   │   └── todo.actions.ts        # Action 定義
│   ├── reducers/
│   │   └── todo.reducer.ts        # Reducer + Entity Adapter
│   ├── selectors/
│   │   └── todo.selectors.ts      # Selector 定義
│   └── effects/
│       └── todo.effects.ts        # Effect 定義（副作用）
├── components/
│   ├── todo-list.component.ts     # 主容器組件
│   ├── todo-item.component.ts     # 待辦項目組件
│   └── todo-filter.component.ts   # 篩選器組件
├── app.component.ts               # 根組件
└── app.config.ts                  # 應用配置（Store、Effects、DevTools）
```

## 技術亮點

1. **Angular 17 新特性**
   - Standalone Components
   - 新的應用配置方式
   - 簡化的依賴注入

2. **NgRx 最佳實踐**
   - Entity Adapter
   - Typed Actions
   - Memoized Selectors
   - Effect 錯誤處理

3. **現代化開發**
   - TypeScript 嚴格模式
   - RxJS 操作符
   - Reactive Programming

---

開始使用 NgRx 構建可擴展的 Angular 應用吧！🚀
