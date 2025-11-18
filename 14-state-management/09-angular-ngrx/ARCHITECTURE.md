# NgRx 架構說明

## 架構概覽

本專案採用 NgRx 官方推薦的架構模式，遵循單向資料流和 Redux 設計原則。

```
┌─────────────────────────────────────────────────────────┐
│                     Angular Application                  │
│                                                          │
│  ┌────────────┐                                         │
│  │ Components │  ◄──── select(selector)                 │
│  └──────┬─────┘                                         │
│         │                                                │
│         │ dispatch(action)                               │
│         ▼                                                │
│  ┌────────────┐                                         │
│  │  Actions   │                                         │
│  └──────┬─────┘                                         │
│         │                                                │
│         ├────────────────┬──────────────────┐           │
│         ▼                ▼                  ▼           │
│  ┌────────────┐   ┌────────────┐    ┌────────────┐    │
│  │  Reducers  │   │  Effects   │    │  Selectors │    │
│  └──────┬─────┘   └──────┬─────┘    └────────────┘    │
│         │                 │                             │
│         │                 │ (side effects)              │
│         ▼                 ▼                             │
│  ┌──────────────────────────────────────┐              │
│  │            NgRx Store                 │              │
│  │  (Single Source of Truth)             │              │
│  └───────────────────────────────────────┘              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 核心層次

### 1. Presentation Layer（展示層）

**職責：**
- 渲染 UI
- 處理用戶交互
- dispatch Actions
- 訂閱 Store 狀態

**組件：**

#### TodoListComponent（智能組件 / Container Component）
```typescript
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItemComponent, TodoFilterComponent]
})
export class TodoListComponent implements OnInit {
  // 從 Store 選擇狀態
  filteredTodos$ = this.store.select(selectFilteredTodos);
  filter$ = this.store.select(selectFilter);

  constructor(private store: Store) {}

  // 發送 Actions
  addTodo(): void {
    this.store.dispatch(addTodo({ text: this.newTodoText }));
  }
}
```

**特點：**
- 連接到 Store
- 不包含業務邏輯
- 使用 Observables 訂閱狀態
- 通過 dispatch 改變狀態

#### TodoItemComponent（展示組件 / Presentational Component）
```typescript
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string; text: string }>();
  @Output() delete = new EventEmitter<string>();
}
```

**特點：**
- 不連接 Store
- 通過 @Input 接收數據
- 通過 @Output 發送事件
- 可重用性高

### 2. State Management Layer（狀態管理層）

#### Actions（動作）

**檔案：** `store/actions/todo.actions.ts`

**定義：** Actions 是描述應用程式中發生的事件的純物件

```typescript
// Action Creator
export const addTodo = createAction(
  '[Todo] Add Todo',           // Action Type
  props<{ text: string }>()    // Action Payload
);
```

**命名慣例：**
- `[來源] 動作描述`
- 來源：觸發 Action 的地方（Component、API、Effect 等）
- 描述：發生了什麼事件

**Action 類型：**

1. **命令型 Actions**（Commands）
   ```typescript
   export const loadTodos = createAction('[Todo] Load Todos');
   export const addTodo = createAction('[Todo] Add Todo', props<{ text: string }>());
   ```

2. **事件型 Actions**（Events）
   ```typescript
   export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
   export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<{ error: string }>());
   ```

#### Reducers（歸納器）

**檔案：** `store/reducers/todo.reducer.ts`

**定義：** Reducers 是純函數，負責根據 Action 計算新的狀態

```typescript
export const todoReducer = createReducer(
  initialState,

  // 處理 Action
  on(addTodoSuccess, (state, { todo }) =>
    todoAdapter.addOne(todo, state)
  ),

  on(updateTodoSuccess, (state, { id, text }) =>
    todoAdapter.updateOne({ id, changes: { text } }, state)
  )
);
```

**純函數原則：**
- ✅ 相同輸入 → 相同輸出
- ✅ 不修改參數
- ✅ 不產生副作用
- ❌ 不呼叫 API
- ❌ 不修改全局變量
- ❌ 不使用 Date.now() 或 Math.random()

**Entity Adapter 整合：**

```typescript
// 創建 Entity Adapter
export const todoAdapter = createEntityAdapter<Todo>({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});

// 定義狀態結構
export interface TodoEntityState extends EntityState<Todo> {
  filter: FilterType;
  loading: boolean;
  error: string | null;
}

// 初始狀態
export const initialState: TodoEntityState = todoAdapter.getInitialState({
  filter: 'all',
  loading: false,
  error: null,
});
```

**Entity State 結構：**
```typescript
{
  ids: ['1', '2', '3'],           // ID 陣列（排序後）
  entities: {                      // ID → Entity 映射
    '1': { id: '1', text: '...', completed: false },
    '2': { id: '2', text: '...', completed: true },
    '3': { id: '3', text: '...', completed: false }
  },
  filter: 'all',                   // 自定義屬性
  loading: false,                  // 自定義屬性
  error: null                      // 自定義屬性
}
```

#### Selectors（選擇器）

**檔案：** `store/selectors/todo.selectors.ts`

**定義：** Selectors 是純函數，用於從 Store 中查詢和派生狀態

```typescript
// Feature Selector
export const selectTodoState = createFeatureSelector<TodoEntityState>('todos');

// Entity Selectors
export const selectAllTodos = createSelector(
  selectTodoState,
  selectAll  // 從 Entity Adapter
);

// 組合 Selectors
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
```

**Memoization（記憶化）：**

Selectors 使用記憶化技術優化性能：

```
第一次呼叫: selectFilteredTodos
  ↓
計算結果並快取
  ↓
返回結果

第二次呼叫（輸入未改變）:
  ↓
直接返回快取結果（不重新計算）

第三次呼叫（輸入改變）:
  ↓
重新計算並更新快取
  ↓
返回新結果
```

**Selector 優勢：**
- 🚀 性能優化（記憶化）
- 🔄 可重用性
- 🧪 可測試性
- 📦 封裝性
- 🎯 型別安全

#### Effects（副作用）

**檔案：** `store/effects/todo.effects.ts`

**定義：** Effects 處理副作用（異步操作、API 呼叫、LocalStorage 等）

```typescript
@Injectable()
export class TodoEffects {

  // 新增 Todo Effect
  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTodo),                    // 監聽特定 Action
      map(({ text }) => {                 // 轉換
        const todo = createTodo(text);
        return addTodoSuccess({ todo });  // dispatch 新 Action
      })
    )
  );

  // LocalStorage 副作用（不 dispatch Action）
  saveTodos$ = createEffect(
    () => this.actions$.pipe(
      ofType(addTodoSuccess, updateTodoSuccess, deleteTodoSuccess),
      withLatestFrom(this.store.select(selectAllTodos)),
      tap(([, todos]) => {
        localStorage.setItem('ngrx-todos', JSON.stringify(todos));
      })
    ),
    { dispatch: false }  // 不 dispatch Action
  );

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}
}
```

**Effect 類型：**

1. **Dispatching Effects**（發送 Actions）
   ```typescript
   loadTodos$ = createEffect(() =>
     this.actions$.pipe(
       ofType(loadTodos),
       map(() => loadTodosSuccess({ todos }))
     )
   );
   ```

2. **Non-Dispatching Effects**（不發送 Actions）
   ```typescript
   logAction$ = createEffect(
     () => this.actions$.pipe(
       tap(action => console.log(action))
     ),
     { dispatch: false }
   );
   ```

**RxJS 操作符使用：**

- `ofType()` - 過濾特定類型的 Action
- `map()` - 轉換資料
- `switchMap()` - 切換到新的 Observable（取消前一個）
- `exhaustMap()` - 忽略新的請求直到前一個完成
- `concatMap()` - 按順序處理
- `mergeMap()` - 並發處理
- `tap()` - 執行副作用
- `catchError()` - 錯誤處理
- `withLatestFrom()` - 結合最新的狀態

### 3. Configuration Layer（配置層）

**檔案：** `app.config.ts`

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // 註冊 Store
    provideStore({
      todos: todoReducer
    }),

    // 註冊 Effects
    provideEffects([TodoEffects]),

    // 註冊 DevTools
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
};
```

## 資料流程詳解

### 完整的 Action Flow

```
1. 使用者點擊「新增」按鈕
   ↓
2. Component: addTodo() 方法被呼叫
   ↓
3. Component: dispatch addTodo Action
   this.store.dispatch(addTodo({ text: '...' }))
   ↓
4. Effect: addTodo$ 監聽到 addTodo Action
   ↓
5. Effect: 創建 Todo 物件，生成 ID 和時間戳
   ↓
6. Effect: dispatch addTodoSuccess Action
   ↓
7. Reducer: 處理 addTodoSuccess Action
   ↓
8. Reducer: 使用 Entity Adapter 新增 Todo
   ↓
9. Store: 狀態更新（immutable）
   ↓
10. Selector: 重新計算（如果輸入改變）
    ↓
11. Component: 訂閱的 Observable 發出新值
    ↓
12. Angular: 觸發變更檢測
    ↓
13. View: UI 更新
    ↓
14. Effect: saveTodos$ 監聽到 addTodoSuccess
    ↓
15. Effect: 儲存到 LocalStorage（副作用）
```

### LocalStorage 持久化流程

#### 載入資料（App 啟動時）

```
1. Component: ngOnInit()
   ↓
2. Component: dispatch loadTodos()
   ↓
3. Effect: loadTodos$ 監聽
   ↓
4. Effect: 從 LocalStorage 讀取資料
   ↓
5. Effect: dispatch loadTodosSuccess({ todos })
   ↓
6. Reducer: 使用 todoAdapter.setAll() 設置所有 Todos
   ↓
7. Store: 狀態初始化完成
```

#### 儲存資料（任何變更時）

```
1. 任何修改 Action (addTodoSuccess, updateTodoSuccess, etc.)
   ↓
2. Effect: saveTodos$ 監聽
   ↓
3. Effect: 使用 withLatestFrom 取得最新的所有 Todos
   ↓
4. Effect: 寫入 LocalStorage
   ↓
5. 完成（不 dispatch Action）
```

## 狀態結構設計

### Normalized State（正規化狀態）

使用 Entity Adapter 自動正規化狀態：

**優點：**
- ✅ 避免資料重複
- ✅ 快速查找（O(1)）
- ✅ 容易更新
- ✅ 減少記憶體使用

**範例：**

```typescript
// ❌ 非正規化（陣列）
{
  todos: [
    { id: '1', text: '...', completed: false },
    { id: '2', text: '...', completed: true },
    { id: '3', text: '...', completed: false }
  ]
}

// 查找: O(n)
// 更新: 需要遍歷整個陣列

// ✅ 正規化（Entity State）
{
  ids: ['1', '2', '3'],
  entities: {
    '1': { id: '1', text: '...', completed: false },
    '2': { id: '2', text: '...', completed: true },
    '3': { id: '3', text: '...', completed: false }
  }
}

// 查找: O(1)
// 更新: 直接訪問
```

### Feature State 組合

```typescript
// App State 結構
interface AppState {
  todos: TodoEntityState;      // Todo 功能狀態
  // users: UserState;         // 可以加入更多功能
  // auth: AuthState;
  // router: RouterState;
}

// Todo Feature State
interface TodoEntityState extends EntityState<Todo> {
  filter: FilterType;          // UI 狀態
  loading: boolean;            // 載入狀態
  error: string | null;        // 錯誤狀態
}
```

## 最佳實踐

### 1. Action 設計

✅ **好的設計：**
```typescript
// 命令型 - 描述意圖
export const loadTodos = createAction('[Todo] Load Todos');

// 事件型 - 描述結果
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const loadTodosFailure = createAction(
  '[Todo] Load Todos Failure',
  props<{ error: string }>()
);
```

❌ **避免的設計：**
```typescript
// 不清楚的命名
export const getTodos = createAction('GET_TODOS');

// 缺少錯誤處理
export const loadTodos = createAction('[Todo] Load Todos', props<{ todos: Todo[] }>());
```

### 2. Reducer 設計

✅ **好的設計：**
```typescript
on(addTodoSuccess, (state, { todo }) =>
  todoAdapter.addOne(todo, {
    ...state,
    loading: false,
    error: null
  })
);
```

❌ **避免的設計：**
```typescript
on(addTodoSuccess, (state, { todo }) => {
  state.todos.push(todo);  // 直接修改狀態
  return state;
});
```

### 3. Selector 設計

✅ **好的設計：**
```typescript
// 組合小的 Selectors
export const selectFilter = createSelector(
  selectTodoState,
  (state) => state.filter
);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectFilter,
  (todos, filter) => filterTodos(todos, filter)
);
```

❌ **避免的設計：**
```typescript
// 巨大的 Selector
export const selectEverything = createSelector(
  selectTodoState,
  (state) => {
    // 大量計算...
    return hugeObject;
  }
);
```

### 4. Effect 設計

✅ **好的設計：**
```typescript
loadTodos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadTodos),
    exhaustMap(() =>
      this.todoService.loadTodos().pipe(
        map(todos => loadTodosSuccess({ todos })),
        catchError(error => of(loadTodosFailure({ error: error.message })))
      )
    )
  )
);
```

❌ **避免的設計：**
```typescript
loadTodos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadTodos),
    switchMap(() =>
      this.todoService.loadTodos().pipe(
        map(todos => loadTodosSuccess({ todos }))
        // 缺少錯誤處理
      )
    )
  )
);
```

## 測試策略

### Action 測試

```typescript
describe('Todo Actions', () => {
  it('should create addTodo action', () => {
    const text = 'Test Todo';
    const action = addTodo({ text });

    expect(action.type).toBe('[Todo] Add Todo');
    expect(action.text).toBe(text);
  });
});
```

### Reducer 測試

```typescript
describe('Todo Reducer', () => {
  it('should add todo on addTodoSuccess', () => {
    const todo = { id: '1', text: 'Test', completed: false, createdAt: Date.now() };
    const action = addTodoSuccess({ todo });
    const state = todoReducer(initialState, action);

    expect(state.entities['1']).toEqual(todo);
    expect(state.ids).toContain('1');
  });
});
```

### Selector 測試

```typescript
describe('Todo Selectors', () => {
  it('should select active todos', () => {
    const state = {
      todos: {
        ids: ['1', '2'],
        entities: {
          '1': { id: '1', completed: false },
          '2': { id: '2', completed: true }
        }
      }
    };

    const result = selectActiveTodos(state);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });
});
```

### Effect 測試

```typescript
describe('Todo Effects', () => {
  it('should dispatch addTodoSuccess on addTodo', () => {
    const action = addTodo({ text: 'Test' });
    const completion = addTodoSuccess({ todo: mockTodo });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.addTodo$).toBeObservable(expected);
  });
});
```

## 性能優化

### 1. OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  todos$ = this.store.select(selectFilteredTodos);
}
```

### 2. TrackBy 函數

```typescript
trackById(index: number, todo: Todo): string {
  return todo.id;
}
```

### 3. Selector Memoization

Selectors 自動使用記憶化，只在輸入改變時重新計算。

### 4. Lazy Loading

```typescript
// 延遲載入 Feature Module
{
  path: 'todos',
  loadChildren: () => import('./todos/todos.module').then(m => m.TodosModule)
}
```

## 擴展指南

### 加入新功能

1. **定義 Model**
   ```typescript
   // models/category.model.ts
   export interface Category {
     id: string;
     name: string;
   }
   ```

2. **創建 Actions**
   ```typescript
   // store/actions/category.actions.ts
   export const loadCategories = createAction('[Category] Load');
   ```

3. **實作 Reducer**
   ```typescript
   // store/reducers/category.reducer.ts
   export const categoryReducer = createReducer(initialState, ...);
   ```

4. **創建 Selectors**
   ```typescript
   // store/selectors/category.selectors.ts
   export const selectAllCategories = createSelector(...);
   ```

5. **實作 Effects**（如需要）
   ```typescript
   // store/effects/category.effects.ts
   export class CategoryEffects { ... }
   ```

6. **註冊到 Store**
   ```typescript
   // app.config.ts
   provideStore({
     todos: todoReducer,
     categories: categoryReducer
   })
   ```

---

這個架構提供了可擴展、可維護、可測試的基礎，適合從小型專案到大型企業應用。
