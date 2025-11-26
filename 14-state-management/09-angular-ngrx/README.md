# NgRx Todo List

一個使用 Angular 17+ 和 NgRx 狀態管理的完整 Todo List 應用程式。

## 特色功能

- ✅ 完整的 CRUD 操作（新增、編輯、刪除、切換完成狀態）
- 🔍 篩選功能（全部、進行中、已完成）
- 💾 LocalStorage 持久化儲存
- 🎨 現代化的 UI 設計
- 📊 即時統計資訊
- 🔄 使用 NgRx 最佳實踐

## NgRx 簡介

### 什麼是 NgRx？

NgRx 是 Angular 的響應式狀態管理框架，基於 Redux 模式和 RxJS 實作。它提供了一個集中式的狀態管理解決方案，使得應用程式的狀態變化可預測且易於追蹤。

### Redux 模式核心概念

NgRx 遵循 Redux 的三大原則：

1. **單一數據源（Single Source of Truth）**
   - 整個應用的狀態儲存在單一的 Store 中
   - 使狀態管理更加集中和可預測

2. **狀態唯讀（State is Read-Only）**
   - 只能透過 dispatch Actions 來改變狀態
   - 不能直接修改狀態物件

3. **使用純函數進行修改（Changes are Made with Pure Functions）**
   - Reducers 是純函數，接收舊狀態和 Action，返回新狀態
   - 相同的輸入總是產生相同的輸出

### NgRx 核心組件

#### 1. Actions（動作）
- 描述應用程式中發生的事件
- 是純物件，包含 `type` 和可選的 `payload`
- 使用 `createAction` 函數創建

```typescript
export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ text: string }>()
);
```

#### 2. Reducers（歸納器）
- 純函數，處理狀態轉換
- 接收當前狀態和 Action，返回新狀態
- 使用 `createReducer` 和 `on` 函數創建

```typescript
export const todoReducer = createReducer(
  initialState,
  on(addTodoSuccess, (state, { todo }) =>
    todoAdapter.addOne(todo, state)
  )
);
```

#### 3. Selectors（選擇器）
- 從 Store 中查詢和派生狀態
- 使用 memorization 優化性能
- 使用 `createSelector` 創建

```typescript
export const selectAllTodos = createSelector(
  selectTodoState,
  selectAll
);
```

#### 4. Effects（副作用）
- 處理異步操作和副作用
- 監聽 Actions，執行副作用，dispatch 新的 Actions
- 使用 `createEffect` 創建

```typescript
loadTodos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadTodos),
    map(() => {
      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      return loadTodosSuccess({ todos });
    })
  )
);
```

#### 5. Entity Adapter（實體適配器）
- 提供 CRUD 操作的預定義方法
- 自動管理實體集合的狀態
- 包含排序和選擇功能

```typescript
export const todoAdapter = createEntityAdapter<Todo>({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});
```

## 專案結構

```
09-angular-ngrx/
├── src/
│   ├── app/
│   │   ├── components/           # 組件
│   │   │   ├── todo-item.component.ts
│   │   │   ├── todo-filter.component.ts
│   │   │   └── todo-list.component.ts
│   │   ├── models/               # 資料模型
│   │   │   └── todo.model.ts
│   │   ├── store/                # NgRx Store
│   │   │   ├── actions/          # Actions 定義
│   │   │   │   └── todo.actions.ts
│   │   │   ├── reducers/         # Reducers 定義
│   │   │   │   └── todo.reducer.ts
│   │   │   ├── selectors/        # Selectors 定義
│   │   │   │   └── todo.selectors.ts
│   │   │   └── effects/          # Effects 定義
│   │   │       └── todo.effects.ts
│   │   ├── app.component.ts      # 根組件
│   │   └── app.config.ts         # 應用配置
│   ├── index.html                # HTML 入口
│   ├── main.ts                   # 應用入口
│   └── styles.css                # 全局樣式
├── angular.json                  # Angular 配置
├── tsconfig.json                 # TypeScript 配置
├── package.json                  # 依賴管理
└── README.md                     # 專案說明
```

## 安裝和運行

### 前置需求

- Node.js 18+
- npm 或 yarn

### 安裝步驟

1. **安裝依賴**
```bash
cd 14-state-management/09-angular-ngrx
npm install
```

2. **啟動開發伺服器**
```bash
npm start
```

3. **開啟瀏覽器**
```
http://localhost:4200
```

### 建置生產版本

```bash
npm run build
```

建置的檔案會在 `dist/` 目錄下。

## NgRx 資料流程

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ dispatch(action)
       ▼
┌─────────────┐
│   Actions   │
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  Reducers   │    │   Effects   │
└──────┬──────┘    └──────┬──────┘
       │                  │ side effects
       │                  │ (API, localStorage)
       ▼                  │
┌─────────────┐           │
│    Store    │◄──────────┘ dispatch(action)
└──────┬──────┘
       │ select(selector)
       ▼
┌─────────────┐
│  Component  │
└─────────────┘
```

## 與其他 Angular 狀態管理方案比較

### 1. NgRx vs Services with RxJS

**NgRx 優勢：**
- 集中式狀態管理
- 時間旅行調試（Time-travel debugging）
- 嚴格的單向資料流
- 更好的可測試性
- 內建 DevTools 支援

**Services with RxJS 優勢：**
- 更簡單的學習曲線
- 更少的樣板代碼
- 更適合小型應用

**適用場景：**
- NgRx：大型應用、複雜狀態、團隊協作
- Services：小型應用、簡單狀態

### 2. NgRx vs Akita

**NgRx 優勢：**
- 官方 Angular 推薦
- 更大的社群支援
- 更完整的生態系統
- 遵循 Redux 標準模式

**Akita 優勢：**
- 更簡潔的 API
- 更少的樣板代碼
- 內建 Entity Store
- 更容易上手

**適用場景：**
- NgRx：需要標準 Redux 模式、大型企業應用
- Akita：快速開發、中型應用

### 3. NgRx vs NGXS

**NgRx 優勢：**
- 更成熟和穩定
- 更大的社群和資源
- 更好的 TypeScript 支援
- Redux DevTools 整合

**NGXS 優勢：**
- CQRS（命令查詢責任分離）模式
- 更少的樣板代碼
- 類別語法（不是函數式）
- 更直觀的 API

**適用場景：**
- NgRx：函數式編程風格、需要 Redux 標準
- NGXS：物件導向風格、快速開發

### 4. NgRx vs Component Store

**NgRx Store（Global）：**
- 適合應用級狀態
- 跨組件共享
- 持久化狀態
- 複雜的狀態管理

**Component Store（Local）：**
- 適合組件級狀態
- 生命週期綁定組件
- 更簡單的 API
- 更好的封裝性

**最佳實踐：**
- 全局共享狀態 → NgRx Store
- 組件私有狀態 → Component Store
- 兩者可以結合使用

## NgRx 最佳實踐

### 1. Action 命名規範

```typescript
// ✅ 好的命名
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success');
export const loadTodosFailure = createAction('[Todo] Load Todos Failure');

// ❌ 避免的命名
export const getTodos = createAction('GET_TODOS');
```

### 2. 使用 Entity Adapter

```typescript
// ✅ 使用 Entity Adapter 管理集合
export const todoAdapter = createEntityAdapter<Todo>();

// 自動獲得 CRUD 方法：
// - addOne, addMany
// - updateOne, updateMany
// - removeOne, removeMany
// - setAll, setOne
```

### 3. Selector Composition

```typescript
// ✅ 組合 Selectors
export const selectActiveTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => !todo.completed)
);

export const selectActiveTodosCount = createSelector(
  selectActiveTodos,
  (todos) => todos.length
);
```

### 4. Effects 錯誤處理

```typescript
// ✅ 處理錯誤，避免 Effect 中斷
loadTodos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadTodos),
    exhaustMap(() =>
      this.todoService.loadTodos().pipe(
        map(todos => loadTodosSuccess({ todos })),
        catchError(error => of(loadTodosFailure({ error })))
      )
    )
  )
);
```

### 5. 避免在 Reducer 中進行副作用

```typescript
// ❌ 不要在 Reducer 中進行副作用
on(addTodo, (state, { text }) => {
  localStorage.setItem('todos', JSON.stringify(state)); // 副作用
  return { ...state };
});

// ✅ 在 Effect 中處理副作用
saveTodos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(addTodoSuccess),
    tap(({ todo }) => {
      localStorage.setItem('todos', JSON.stringify(todos));
    })
  ),
  { dispatch: false }
);
```

## NgRx DevTools

本專案已整合 NgRx DevTools，可以：

1. **時間旅行調試**
   - 查看每個 Action 的狀態變化
   - 回到任意時間點的狀態

2. **Action 歷史**
   - 查看所有 dispatch 的 Actions
   - 檢視 Action 的 payload

3. **狀態快照**
   - 導出/導入狀態
   - 分享應用狀態

4. **性能監控**
   - 檢視 Action 執行時間
   - 優化性能瓶頸

### 使用方式

1. 安裝 Redux DevTools Extension
   - [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/)
   - [Firefox](https://addons.mozilla.org/firefox/addon/reduxdevtools/)

2. 開啟應用程式

3. 打開 Chrome DevTools → Redux 標籤

## 功能實作說明

### 1. 新增 Todo

```typescript
// Component dispatch action
addTodo(): void {
  this.store.dispatch(addTodo({ text: this.newTodoText }));
}

// Effect 處理
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

// Reducer 更新狀態
on(addTodoSuccess, (state, { todo }) =>
  todoAdapter.addOne(todo, state)
);
```

### 2. LocalStorage 持久化

```typescript
// 載入 Todos
loadTodos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadTodos),
    map(() => {
      const stored = localStorage.getItem('ngrx-todos');
      const todos: Todo[] = stored ? JSON.parse(stored) : [];
      return loadTodosSuccess({ todos });
    })
  )
);

// 儲存 Todos
saveTodos$ = createEffect(
  () =>
    this.actions$.pipe(
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
```

### 3. 篩選功能

```typescript
// Selector 組合
export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectFilter,
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }
);
```

## 學習資源

### 官方文件

- [NgRx 官方文件](https://ngrx.io/)
- [NgRx Store](https://ngrx.io/guide/store)
- [NgRx Effects](https://ngrx.io/guide/effects)
- [NgRx Entity](https://ngrx.io/guide/entity)
- [NgRx DevTools](https://ngrx.io/guide/store-devtools)

### 推薦教學

- [NgRx Tutorial for Angular](https://www.youtube.com/watch?v=f97ICOaekNU)
- [Angular University - NgRx Course](https://angular-university.io/)
- [Ultimate Angular - NgRx Course](https://ultimatecourses.com/courses/angular/ngrx)

### 最佳實踐

- [NgRx Best Practices](https://ngrx.io/guide/eslint-plugin)
- [NgRx Style Guide](https://ngrx.io/guide/eslint-plugin/rules)
- [Redux Style Guide](https://redux.js.org/style-guide/style-guide)

### 範例專案

- [NgRx Example App](https://github.com/ngrx/platform/tree/master/projects/example-app)
- [Real World Angular + NgRx](https://github.com/gothinkster/angular-realworld-example-app)

### 相關文章

- [NgRx: Do's and Don'ts](https://medium.com/@m3po22/ngrx-dos-and-donts-45b9f6af0614)
- [When to use NgRx Store](https://blog.angular-university.io/angular-2-redux-ngrx-rxjs/)
- [NgRx Façade Pattern](https://medium.com/@thomasburlesonIA/ngrx-facades-better-state-management-82a04b9a1e39)

## 技術棧

- **Angular 17+** - 現代化的 Web 框架
- **TypeScript** - 型別安全的 JavaScript 超集
- **NgRx Store** - 狀態管理
- **NgRx Effects** - 副作用管理
- **NgRx Entity** - 實體集合管理
- **NgRx DevTools** - 開發工具
- **RxJS** - 響應式編程庫

## 進階功能建議

想要擴展這個專案？可以考慮加入：

1. **後端整合**
   - 使用 Angular HttpClient
   - 串接 REST API
   - 錯誤處理和重試機制

2. **Router State**
   - @ngrx/router-store
   - 路由狀態管理
   - 深層連結支援

3. **Component Store**
   - 組件級狀態管理
   - 與 Global Store 結合

4. **測試**
   - Action 測試
   - Reducer 測試
   - Effect 測試
   - Selector 測試

5. **優化**
   - OnPush Change Detection
   - TrackBy 函數
   - Lazy Loading

6. **UI 增強**
   - 拖放排序
   - 動畫效果
   - 無障礙支援（a11y）

## 授權

MIT License

## 貢獻

歡迎提交 Issue 或 Pull Request！

---

**Happy Coding with NgRx!** 🎉
