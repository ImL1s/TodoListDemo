# 📋 Todo List - React 版本

## 📖 簡介

使用 **React 18** 和 **Hooks** 實現的現代化 Todo List 應用。

## ✨ React 特性展示

- ✅ **函數組件**: 使用現代的函數式組件
- ✅ **React Hooks**: useState, useEffect
- ✅ **組件化**: 拆分成可復用的小組件
- ✅ **單向數據流**: Props 向下傳遞，事件向上冒泡
- ✅ **狀態管理**: useState 管理應用狀態
- ✅ **副作用處理**: useEffect 實現持久化
- ✅ **事件處理**: 合成事件系統
- ✅ **條件渲染**: 空狀態處理

## 🛠️ 技術棧

- **React 18**: 現代化的 UI 庫
- **Vite**: 極速的構建工具
- **CSS Modules**: 組件化樣式

## 📁 項目結構

```
01-react/
├── src/
│   ├── components/
│   │   ├── TodoInput.jsx      # 輸入組件
│   │   ├── TodoInput.css
│   │   ├── TodoList.jsx       # 列表組件
│   │   ├── TodoList.css
│   │   ├── TodoItem.jsx       # 單項組件
│   │   └── TodoItem.css
│   ├── App.jsx                # 主應用組件
│   ├── App.css
│   ├── main.jsx               # 入口文件
│   └── index.css              # 全局樣式
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 快速開始

### 安裝依賴

```bash
cd 03-modern-frameworks/01-react
npm install
```

### 運行開發服務器

```bash
npm run dev
```

訪問 http://localhost:5173

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 📝 核心代碼解析

### 1. 主應用組件 (App.jsx)

```jsx
function App() {
  // 狀態管理
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('react-todos')
    return saved ? JSON.parse(saved) : defaultTodos
  })

  // 副作用：保存到 localStorage
  useEffect(() => {
    localStorage.setItem('react-todos', JSON.stringify(todos))
  }, [todos])

  // 事件處理函數
  const addTodo = (text) => { /* ... */ }
  const toggleTodo = (id) => { /* ... */ }
  const deleteTodo = (id) => { /* ... */ }

  return (
    <div className="app">
      <TodoInput onAdd={addTodo} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  )
}
```

### 2. Hooks 詳解

#### useState - 狀態管理

```jsx
const [todos, setTodos] = useState(initialValue)
```

**特點**:
- 函數組件的狀態管理
- 惰性初始化（傳入函數）
- 不可變更新（創建新對象）

#### useEffect - 副作用處理

```jsx
useEffect(() => {
  // 副作用代碼
  localStorage.setItem('todos', JSON.stringify(todos))
}, [todos]) // 依賴數組
```

**特點**:
- 處理副作用（API 調用、訂閱、DOM 操作）
- 依賴數組控制執行時機
- 可返回清理函數

### 3. 組件通訊

#### Props 向下傳遞數據

```jsx
<TodoList
  todos={todos}           // 數據
  onToggle={toggleTodo}   // 回調函數
  onDelete={deleteTodo}
/>
```

#### 事件向上冒泡

```jsx
function TodoInput({ onAdd }) {
  const handleSubmit = () => {
    onAdd(inputValue) // 調用父組件傳入的函數
  }
}
```

### 4. 列表渲染

```jsx
{todos.map(todo => (
  <TodoItem
    key={todo.id}  // 必須的 key
    todo={todo}
    onToggle={onToggle}
    onDelete={onDelete}
  />
))}
```

**key 的重要性**:
- 幫助 React 識別變化
- 優化渲染性能
- 必須唯一且穩定

### 5. 事件處理

```jsx
<li onClick={() => onToggle(todo.id)}>
  <span
    className="close"
    onClick={(e) => {
      e.stopPropagation() // 阻止事件冒泡
      onDelete(todo.id)
    }}
  >
    ×
  </span>
</li>
```

## 🎓 React 核心概念

### 1. 組件 (Component)

- **功能**: UI 的獨立、可復用單元
- **類型**: 函數組件、類組件（已過時）
- **特點**: 接收 props，返回 JSX

### 2. JSX

```jsx
const element = <h1>Hello, {name}</h1>
```

- JavaScript 的語法擴展
- 描述 UI 結構
- 編譯為 React.createElement

### 3. Props

- 組件的輸入參數
- 只讀，不可修改
- 單向數據流

### 4. State

- 組件的內部狀態
- 可變，通過 setState 更新
- 觸發重新渲染

### 5. 生命週期（Hooks 時代）

- **掛載**: useState 初始化
- **更新**: useEffect 依賴變化時執行
- **卸載**: useEffect 返回的清理函數

## 💡 React 最佳實踐

### 1. 組件拆分原則

- **單一職責**: 一個組件只做一件事
- **復用性**: 可在多處使用
- **可組合**: 大組件由小組件組成

### 2. 狀態管理

- **提升狀態**: 在最近的共同父組件
- **不可變更新**: 使用展開運算符創建新對象
- **避免冗餘**: 能計算的就不要存儲

### 3. 性能優化

- **使用 key**: 列表渲染必須有唯一 key
- **避免內聯函數**: 會導致子組件重新渲染
- **React.memo**: 防止不必要的重渲染
- **useMemo / useCallback**: 緩存計算和函數

### 4. 代碼風格

- **命名**: 組件大寫開頭，事件處理函數 handle 前綴
- **解構**: 解構 props 提高可讀性
- **早期返回**: 處理邊界情況

## 🔄 可改進之處

### 功能增強
- [ ] 編輯功能
- [ ] 篩選功能（全部/進行中/已完成）
- [ ] 批量操作
- [ ] 拖拽排序（react-beautiful-dnd）
- [ ] 撤銷/重做

### 進階特性
- [ ] 添加 TypeScript
- [ ] 使用 Redux/Zustand 狀態管理
- [ ] 添加動畫（Framer Motion）
- [ ] 單元測試（Jest + Testing Library）
- [ ] E2E 測試（Cypress）

### 性能優化
- [ ] React.memo 優化組件
- [ ] useCallback 優化函數
- [ ] 虛擬滾動（大量數據）
- [ ] Code Splitting

## 📚 學習資源

### 官方文檔
- [React 官方文檔](https://react.dev/)
- [React Hooks 指南](https://react.dev/reference/react)
- [Thinking in React](https://react.dev/learn/thinking-in-react)

### 推薦課程
- [React 官方教程](https://react.dev/learn)
- Frontend Masters - React 課程
- Scrimba - Learn React for Free

### 工具
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Vite 文檔](https://vitejs.dev/)

## 🎯 下一步

- **React + TypeScript** → `03-modern-frameworks/02-react-typescript/`
- **React + Redux** → `14-state-management/01-react-redux/`
- **React + Material-UI** → `05-ui-libraries/01-react-mui/`
- **Next.js** → `04-metaframeworks/01-nextjs/`

---

**技術**: React 18 + Vite
**作者**: ImL1s
**最後更新**: 2025-11-17
