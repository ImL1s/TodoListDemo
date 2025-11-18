# SolidJS Todo List - 快速入門

## 項目特色

本項目展示了 **SolidJS** 的核心特性：

### 1. 細粒度響應式系統
- 使用 `createSignal` 而不是 React 的 `useState`
- 組件只運行一次，之後由響應式系統接管
- 只更新變化的 DOM 節點，不重新渲染整個組件

### 2. Signal 系統
```typescript
// 創建 Signal
const [count, setCount] = createSignal(0);

// 在 JSX 中使用（必須調用函數）
<div>{count()}</div>

// 更新 Signal
setCount(count() + 1);
setCount(prev => prev + 1);
```

### 3. 自動依賴追蹤
```typescript
// createMemo - 自動追蹤依賴，無需依賴數組
const doubled = createMemo(() => count() * 2);

// createEffect - 自動追蹤依賴，無需依賴數組
createEffect(() => {
  console.log('Count is:', count());
});
```

### 4. 無虛擬 DOM
- 直接操作真實 DOM
- 性能比 React 快 2-6 倍
- Bundle 大小只有 React 的 1/6

### 5. 優化的內置組件
- `<For>` - 優化的列表渲染
- `<Show>` - 優化的條件渲染
- `<Switch>/<Match>` - 多條件渲染

## 快速開始

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

瀏覽器會自動打開 http://localhost:3000

### 類型檢查
```bash
npm run type-check
```

### 構建生產版本
```bash
npm run build
```

## 核心代碼說明

### App.tsx - Signal 和 Memo
```typescript
// Signal: 響應式狀態
const [todos, setTodos] = createSignal<Todo[]>([]);
const [filter, setFilter] = createSignal<FilterType>('all');

// Memo: 計算值（自動追蹤依賴）
const filteredTodos = createMemo(() => {
  switch (filter()) {
    case 'active': return todos().filter(t => !t.completed);
    case 'completed': return todos().filter(t => t.completed);
    default: return todos();
  }
});

// Effect: 副作用（自動追蹤依賴）
createEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos()));
});
```

### TodoList.tsx - For 組件
```typescript
// <For> 提供優化的列表渲染
<For each={props.todos}>
  {(todo) => <TodoItem todo={todo} />}
</For>
```

### TodoItem.tsx - Show 組件
```typescript
// <Show> 提供優化的條件渲染
<Show
  when={isEditing()}
  fallback={<div>{props.todo.text}</div>}
>
  <input value={editText()} />
</Show>
```

## SolidJS vs React 快速對比

| 特性 | React | SolidJS |
|------|-------|---------|
| 狀態管理 | `useState` | `createSignal` |
| 計算值 | `useMemo` + 依賴數組 | `createMemo` (自動追蹤) |
| 副作用 | `useEffect` + 依賴數組 | `createEffect` (自動追蹤) |
| 性能優化 | `useCallback`, `memo` | 不需要（默認優化） |
| 虛擬 DOM | 是 | 否 |
| 組件執行 | 每次狀態變化重新執行 | 只執行一次 |
| 列表渲染 | `.map()` + key | `<For>` (無需 key) |
| 條件渲染 | `&&` 或 `? :` | `<Show>` (更優化) |

## 項目結構

```
07-solidjs/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx   # Signal 基礎使用
│   │   ├── TodoItem.tsx    # Show 條件渲染
│   │   └── TodoList.tsx    # For 列表渲染
│   ├── types.ts            # TypeScript 類型
│   ├── App.tsx             # Signal + Memo + Effect
│   ├── App.css             # 樣式
│   └── index.tsx           # 入口文件
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md               # 詳細文檔
```

## 學習重點

1. **Signal 調用**: 在 JSX 中必須調用 Signal 函數 `{count()}` 而不是 `{count}`
2. **自動追蹤**: 不需要手動管理依賴數組，SolidJS 自動追蹤
3. **組件只運行一次**: 組件函數是設置函數，不會重複執行
4. **細粒度更新**: 只更新變化的 DOM 節點，性能極佳
5. **使用內置組件**: `<For>` 和 `<Show>` 比普通 JS 條件/循環更高效

## 性能優勢

- **初始渲染**: 比 React 快 2.2 倍
- **更新速度**: 比 React 快 5-6 倍
- **Bundle 大小**: 只有 React 的 1/6
- **內存使用**: 比 React 少 60%+

## 延伸閱讀

- 查看 `README.md` 了解 SolidJS vs React 的詳細對比
- [SolidJS 官方文檔](https://www.solidjs.com/)
- [SolidJS 教程](https://www.solidjs.com/tutorial)

## 總結

SolidJS 證明了：
- 不需要虛擬 DOM 也能有出色的開發體驗
- 細粒度響應式比組件級渲染更高效
- 自動依賴追蹤比手動管理更可靠
- 更簡單的代碼可以帶來更好的性能
