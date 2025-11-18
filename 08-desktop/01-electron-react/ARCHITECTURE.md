# Electron + React Todo List - 架構文檔

## 系統架構總覽

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Application                      │
│                                                              │
│  ┌────────────────────┐         ┌─────────────────────┐    │
│  │   Main Process     │◄───IPC──►│ Renderer Process    │    │
│  │   (Node.js)        │         │   (Chromium)        │    │
│  │                    │         │                     │    │
│  │  ┌──────────────┐  │         │  ┌──────────────┐  │    │
│  │  │ Window Mgmt  │  │         │  │   React App  │  │    │
│  │  │ Menu & Tray  │  │         │  │              │  │    │
│  │  │ IPC Handlers │  │         │  │  ┌────────┐  │  │    │
│  │  │ File System  │  │         │  │  │ App.tsx│  │  │    │
│  │  └──────────────┘  │         │  │  └────────┘  │  │    │
│  │                    │         │  │              │  │    │
│  │  ┌──────────────┐  │         │  │  Components  │  │    │
│  │  │electron-store│  │         │  │  ┌────────┐  │  │    │
│  │  │  (Storage)   │  │         │  │  │TodoList│  │  │    │
│  │  └──────────────┘  │         │  │  │TodoItem│  │  │    │
│  │                    │         │  │  │TodoInput│  │  │    │
│  └────────────────────┘         │  │  └────────┘  │  │    │
│           │                     │  └──────────────┘  │    │
│           │                     │                     │    │
│           │                     │  ┌──────────────┐  │    │
│           └─────────────────────┼──│ Preload.ts   │  │    │
│                                 │  │(Context Bridge)│  │    │
│                                 │  └──────────────┘  │    │
│                                 └─────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Operating System (Win/Mac/Linux)         │  │
│  │  ┌────────┐  ┌─────────┐  ┌──────────┐  ┌────────┐  │  │
│  │  │  Tray  │  │  Menu   │  │ Shortcuts│  │  FS    │  │  │
│  │  └────────┘  └─────────┘  └──────────┘  └────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 進程模型詳解

### 1. 主進程 (Main Process)

**文件**: `electron/main.ts` (381 行)

**職責**:
- 應用生命周期管理
- 創建和管理 BrowserWindow
- 處理系統級操作（菜單、托盤、快捷鍵）
- 訪問 Node.js API 和文件系統
- 處理來自渲染進程的 IPC 請求

**核心功能**:

```typescript
// 1. 窗口創建
function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
}

// 2. 應用菜單
function createMenu() {
  const template = [
    { label: 'File', submenu: [...] },
    { label: 'Edit', submenu: [...] },
    // ...
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// 3. 系統托盤
function createTray() {
  tray = new Tray(icon);
  tray.setContextMenu(contextMenu);
  tray.on('click', () => { /* ... */ });
}

// 4. IPC 處理器
ipcMain.handle('get-todos', async () => {
  return store.get('todos', []);
});

// 5. 數據持久化
const store = new Store<TodoStore>({
  defaults: { todos: [] }
});
```

### 2. 渲染進程 (Renderer Process)

**文件**: `src/` 目錄

**職責**:
- 渲染用戶界面 (HTML/CSS/JavaScript)
- 處理用戶交互
- 運行 React 應用
- 通過 IPC 與主進程通信

**核心組件**:

```typescript
// App.tsx - 主應用組件
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // 通過 electronAPI 調用主進程
  const handleAddTodo = async (text: string) => {
    const newTodo = await window.electronAPI.addTodo(text);
    setTodos(prev => [...prev, newTodo]);
  };

  return (
    <div className="app">
      <TodoInput onAdd={handleAddTodo} />
      <TodoList todos={todos} />
    </div>
  );
}
```

### 3. 預加載腳本 (Preload Script)

**文件**: `electron/preload.ts` (157 行)

**職責**:
- 在渲染進程加載前執行
- 使用 contextBridge 暴露安全的 API
- 作為主進程和渲染進程之間的橋樑

**實現**:

```typescript
// 使用 Context Bridge 暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
  // Todo 操作
  getTodos: () => ipcRenderer.invoke('get-todos'),
  addTodo: (text: string) => ipcRenderer.invoke('add-todo', text),
  toggleTodo: (id: string) => ipcRenderer.invoke('toggle-todo', id),
  deleteTodo: (id: string) => ipcRenderer.invoke('delete-todo', id),
  updateTodo: (id, text) => ipcRenderer.invoke('update-todo', id, text),
  clearCompleted: () => ipcRenderer.invoke('clear-completed'),
  getStats: () => ipcRenderer.invoke('get-stats'),

  // 菜單事件
  onMenuNewTodo: (callback) => {
    ipcRenderer.on('menu-new-todo', callback);
  },
  onMenuClearCompleted: (callback) => {
    ipcRenderer.on('menu-clear-completed', callback);
  },

  // 清理監聽器
  removeMenuListeners: () => {
    ipcRenderer.removeAllListeners('menu-new-todo');
    ipcRenderer.removeAllListeners('menu-clear-completed');
  },
});
```

---

## IPC 通訊流程

### 完整的數據流

```
用戶操作
   │
   ▼
┌─────────────────────┐
│  React Component    │ 1. 用戶點擊 "Add Todo"
│  (TodoInput.tsx)    │
└─────────────────────┘
   │
   │ onAdd(text)
   ▼
┌─────────────────────┐
│  App.tsx            │ 2. 調用 handleAddTodo
│  handleAddTodo()    │
└─────────────────────┘
   │
   │ window.electronAPI.addTodo(text)
   ▼
┌─────────────────────┐
│  Preload.ts         │ 3. Context Bridge 轉發
│  contextBridge      │
└─────────────────────┘
   │
   │ ipcRenderer.invoke('add-todo', text)
   ▼
┌─────────────────────┐
│  Main.ts            │ 4. 主進程處理
│  ipcMain.handle()   │    - 創建新 Todo
└─────────────────────┘    - 保存到 electron-store
   │                       - 返回新 Todo
   │
   │ return newTodo
   ▼
┌─────────────────────┐
│  Preload.ts         │ 5. Promise 解析
│  (返回)             │
└─────────────────────┘
   │
   │ Promise<Todo>
   ▼
┌─────────────────────┐
│  App.tsx            │ 6. 更新 React 狀態
│  setTodos()         │
└─────────────────────┘
   │
   │ State Update
   ▼
┌─────────────────────┐
│  TodoList.tsx       │ 7. UI 重新渲染
│  (Re-render)        │
└─────────────────────┘
```

### IPC 通道列表

#### 主進程 → 渲染進程 (事件發送)

| 事件名 | 觸發時機 | 處理位置 |
|--------|---------|---------|
| `menu-new-todo` | 用戶按 Ctrl+N | App.tsx - 聚焦輸入框 |
| `menu-clear-completed` | 用戶按 Ctrl+Shift+C | App.tsx - 清除已完成 |
| `main-process-message` | 窗口加載完成 | (測試用) |

#### 渲染進程 → 主進程 (請求-響應)

| 通道名 | 參數 | 返回值 | 功能 |
|--------|------|--------|------|
| `get-todos` | - | `Todo[]` | 獲取所有待辦 |
| `add-todo` | `text: string` | `Todo` | 添加新待辦 |
| `toggle-todo` | `id: string` | `Todo` | 切換完成狀態 |
| `delete-todo` | `id: string` | `{success: boolean}` | 刪除待辦 |
| `update-todo` | `id: string, text: string` | `Todo` | 更新文本 |
| `clear-completed` | - | `{success: boolean}` | 清除已完成 |
| `get-stats` | - | `TodoStats` | 獲取統計 |

---

## 數據流架構

### 1. 數據持久化流程

```
┌──────────────┐
│  React State │ 用戶操作修改狀態
│  (todos)     │
└──────────────┘
       │
       │ window.electronAPI.xxx()
       ▼
┌──────────────┐
│  IPC Channel │ 發送到主進程
└──────────────┘
       │
       │ ipcRenderer.invoke()
       ▼
┌──────────────┐
│ Main Process │ 處理業務邏輯
│  Handler     │
└──────────────┘
       │
       │ store.set()
       ▼
┌──────────────┐
│electron-store│ 保存到磁盤
│  (JSON)      │
└──────────────┘
       │
       │ 寫入文件
       ▼
┌──────────────┐
│ config.json  │ 持久化存儲
│ (File System)│
└──────────────┘
```

**存儲位置**:
- Windows: `%APPDATA%\electron-react-todo\config.json`
- macOS: `~/Library/Application Support/electron-react-todo/config.json`
- Linux: `~/.config/electron-react-todo/config.json`

### 2. 數據讀取流程

```
應用啟動
   │
   ▼
Main Process 啟動
   │
   ▼
創建 BrowserWindow
   │
   ▼
加載 preload.js
   │
   ▼
加載 index.html
   │
   ▼
React App 初始化
   │
   ▼
useEffect(() => {
  loadTodos()  ──────► electronAPI.getTodos()
})                            │
   │                          │
   │                          ▼
   │                   ipcMain.handle('get-todos')
   │                          │
   │                          ▼
   │                   store.get('todos', [])
   │                          │
   │                          ▼
   │                   讀取 config.json
   │                          │
   │ ◄────────────────────────┘
   │        返回 todos
   ▼
setTodos(loadedTodos)
   │
   ▼
UI 渲染完成
```

---

## 安全架構

### Context Isolation 機制

```
┌───────────────────────────────────────────────────┐
│               Browser Window                       │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │        Isolated Context (渲染進程)          │  │
│  │                                             │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      JavaScript Context             │  │  │
│  │  │                                     │  │  │
│  │  │  window.electronAPI ✅ (可訪問)     │  │  │
│  │  │  window.require ❌ (不可訪問)       │  │  │
│  │  │  process ❌ (不可訪問)              │  │  │
│  │  │  electron ❌ (不可訪問)             │  │  │
│  │  │                                     │  │  │
│  │  │  React App 在此運行                  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
│                      ▲                            │
│                      │                            │
│                      │ contextBridge              │
│                      │                            │
│  ┌─────────────────────────────────────────────┐  │
│  │      Preload Context (特權上下文)           │  │
│  │                                             │  │
│  │  可訪問:                                     │  │
│  │  - 部分 Node.js API ✅                      │  │
│  │  - Electron API ✅                          │  │
│  │  - contextBridge ✅                         │  │
│  │  - ipcRenderer ✅                           │  │
│  │                                             │  │
│  │  preload.ts 在此運行                         │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
└───────────────────────────────────────────────────┘
```

### 安全配置

```typescript
// main.ts
const win = new BrowserWindow({
  webPreferences: {
    // ✅ 啟用上下文隔離 (安全)
    contextIsolation: true,

    // ✅ 禁用 Node.js 集成 (安全)
    nodeIntegration: false,

    // ✅ 使用 preload 腳本
    preload: join(__dirname, 'preload.js'),

    // ✅ 啟用沙盒 (可選，更安全)
    sandbox: true,
  },
});

// ✅ 處理外部鏈接
win.webContents.setWindowOpenHandler(({ url }) => {
  if (url.startsWith('http')) {
    require('electron').shell.openExternal(url);
  }
  return { action: 'deny' };
});
```

---

## 組件架構

### React 組件樹

```
App.tsx (根組件)
│
├── Header
│   ├── Logo Icon
│   ├── Title
│   └── Tech Badges
│
├── Stats Bar
│   ├── Total Count
│   ├── Active Count
│   └── Completed Count
│
├── TodoInput (ref)
│   ├── Input Icon
│   ├── Text Input
│   └── Add Button
│
├── Filters
│   ├── All Button
│   ├── Active Button
│   └── Completed Button
│
├── TodoList
│   └── TodoItem[] (map)
│       ├── Checkbox
│       ├── Todo Text / Edit Input
│       └── Actions (Edit, Delete)
│
├── Footer Actions
│   └── Clear Completed Button
│
└── App Footer
    ├── Keyboard Hints
    └── Tech Stack Info
```

### 狀態管理

```typescript
// App.tsx
const [todos, setTodos] = useState<Todo[]>([]);
const [filter, setFilter] = useState<FilterType>('all');
const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
const [loading, setLoading] = useState(true);

// 派生狀態
const filteredTodos = todos.filter(todo => {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true;
});
```

### Props 傳遞

```
App
│
├─► TodoInput
│   └── onAdd: (text: string) => void
│
├─► TodoList
│   ├── todos: Todo[]
│   ├── onToggle: (id: string) => void
│   ├── onDelete: (id: string) => void
│   └── onUpdate: (id: string, text: string) => void
│
└─► Filter Buttons
    └── onClick: () => setFilter(filterType)
```

---

## 窗口管理架構

### 窗口生命周期

```
應用啟動
   │
   ▼
app.whenReady()
   │
   ▼
createWindow()
   ├─► 創建 BrowserWindow
   ├─► 設置 webPreferences
   ├─► 加載 URL/文件
   └─► ready-to-show 事件
         │
         ▼
      win.show() ─────► 顯示窗口
         │
         ▼
   用戶交互...
         │
         │
   用戶點擊關閉
         │
         ▼
   win.on('close')
         │
         ├─► app.isQuitting? ─YES─► 真正關閉
         │                    │
         └─► NO ──► preventDefault()
                    │
                    ▼
                 win.hide() ─► 隱藏到托盤
                    │
                    │
            托盤圖標點擊
                    │
                    ▼
                win.show() ─► 重新顯示
```

### 托盤集成

```
┌─────────────────┐
│  System Tray    │
│                 │
│  ┌───┐          │
│  │ ● │ ◄────────┼─── 應用圖標
│  └───┘          │
│                 │
│  右鍵點擊        │
│     │           │
│     ▼           │
│  ┌──────────┐   │
│  │ Show App │   │
│  │ Hide App │   │
│  │ ──────── │   │
│  │  Quit    │   │
│  └──────────┘   │
│                 │
│  單擊圖標        │
│     │           │
│     ▼           │
│  切換顯示/隱藏   │
└─────────────────┘
```

---

## 菜單架構

### 應用菜單結構

```
Application Menu
│
├── File
│   ├── New Todo (Ctrl+N)
│   ├── ────────────────
│   ├── Clear Completed (Ctrl+Shift+C)
│   ├── ────────────────
│   └── Quit (Ctrl+Q)
│
├── Edit
│   ├── Undo (Ctrl+Z)
│   ├── Redo (Ctrl+Y)
│   ├── ────────────────
│   ├── Cut (Ctrl+X)
│   ├── Copy (Ctrl+C)
│   ├── Paste (Ctrl+V)
│   ├── Delete
│   ├── ────────────────
│   └── Select All (Ctrl+A)
│
├── View
│   ├── Reload (Ctrl+R)
│   ├── Force Reload
│   ├── Toggle DevTools (Ctrl+Shift+I)
│   ├── ────────────────
│   ├── Reset Zoom
│   ├── Zoom In (Ctrl++)
│   ├── Zoom Out (Ctrl+-)
│   ├── ────────────────
│   └── Toggle Fullscreen (F11)
│
├── Window
│   ├── Minimize
│   ├── Zoom
│   ├── ────────────────
│   └── Show App
│
└── Help
    ├── Learn More
    └── About
```

### 快捷鍵映射

```typescript
// 跨平台快捷鍵
const shortcuts = {
  newTodo: 'CmdOrCtrl+N',           // Ctrl+N (Win/Linux), ⌘N (Mac)
  clearCompleted: 'CmdOrCtrl+Shift+C',
  quit: 'CmdOrCtrl+Q',
  reload: 'CmdOrCtrl+R',
  devTools: 'CmdOrCtrl+Shift+I',
  zoomIn: 'CmdOrCtrl+Plus',
  zoomOut: 'CmdOrCtrl+-',
};
```

---

## 文件系統架構

### 項目文件組織

```
electron-react-todo/
│
├── 構建配置
│   ├── package.json           (依賴和腳本)
│   ├── vite.config.ts         (Vite 配置)
│   ├── tsconfig.json          (TypeScript 主配置)
│   ├── tsconfig.node.json     (Node.js TypeScript)
│   └── electron-builder.json  (打包配置)
│
├── 源代碼
│   ├── electron/              (主進程)
│   │   ├── main.ts
│   │   └── preload.ts
│   │
│   └── src/                   (渲染進程)
│       ├── components/
│       │   ├── TodoInput.tsx
│       │   ├── TodoInput.css
│       │   ├── TodoList.tsx
│       │   ├── TodoList.css
│       │   ├── TodoItem.tsx
│       │   └── TodoItem.css
│       │
│       ├── App.tsx
│       ├── App.css
│       ├── main.tsx
│       ├── index.css
│       ├── electron.d.ts
│       └── vite-env.d.ts
│
├── 構建產物
│   ├── dist/                  (Web 資源)
│   │   ├── index.html
│   │   └── assets/
│   │
│   ├── dist-electron/         (主進程編譯)
│   │   ├── main.js
│   │   └── preload.js
│   │
│   └── release/               (打包產物)
│       └── 1.0.0/
│           ├── *.exe
│           ├── *.dmg
│           └── *.AppImage
│
└── 文檔
    ├── README.md              (1846 行完整文檔)
    ├── QUICK_START_GUIDE.md   (快速開始)
    ├── FEATURES_DEMO.md       (功能演示)
    └── ARCHITECTURE.md        (本文件)
```

---

## 構建流程

### 開發模式

```
npm run electron:dev
│
├─► npm run dev (Vite)
│   ├─► 啟動開發服務器 (http://localhost:5173)
│   ├─► 監聽文件變化
│   ├─► 熱模塊替換 (HMR)
│   └─► 等待就緒...
│
└─► wait-on http://localhost:5173
    │
    └─► electron . (Electron)
        ├─► 啟動主進程
        ├─► 加載開發服務器
        ├─► 打開 DevTools
        └─► 監聽主進程變化 → 自動重啟
```

### 生產構建

```
npm run build:win/mac/linux
│
├─► Step 1: npm run build:web
│   ├─► tsc (TypeScript 編譯檢查)
│   └─► vite build
│       ├─► 編譯 React 應用
│       ├─► 壓縮和優化
│       ├─► 生成 dist/
│       └─► 同時編譯 electron/
│           └─► 生成 dist-electron/
│
└─► Step 2: electron-builder --win/mac/linux
    ├─► 讀取 electron-builder.json
    ├─► 打包 dist/ 和 dist-electron/
    ├─► 包含 node_modules (生產依賴)
    ├─► 創建安裝程序
    └─► 輸出到 release/1.0.0/
```

---

## 類型系統架構

### TypeScript 類型定義

```typescript
// src/electron.d.ts

// 1. Todo 數據模型
export interface Todo {
  id: string;              // 唯一標識
  text: string;            // 待辦內容
  completed: boolean;      // 完成狀態
  createdAt: number;       // 創建時間戳
}

// 2. 統計數據
export interface TodoStats {
  total: number;           // 總數
  completed: number;       // 已完成
  active: number;          // 未完成
}

// 3. Electron API 接口
export interface ElectronAPI {
  // Todo CRUD
  getTodos: () => Promise<Todo[]>;
  addTodo: (text: string) => Promise<Todo>;
  toggleTodo: (id: string) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<{ success: boolean }>;
  updateTodo: (id: string, text: string) => Promise<Todo>;
  clearCompleted: () => Promise<{ success: boolean }>;
  getStats: () => Promise<TodoStats>;

  // 事件監聽
  onMenuNewTodo: (callback: () => void) => void;
  onMenuClearCompleted: (callback: () => void) => void;
  removeMenuListeners: () => void;
}

// 4. 全局聲明
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
```

---

## 性能優化架構

### 1. 渲染優化

```typescript
// React.memo 避免不必要的重渲染
const TodoItem = React.memo(({ todo, onToggle, onDelete, onUpdate }) => {
  // 組件實現
}, (prevProps, nextProps) => {
  // 自定義比較邏輯
  return prevProps.todo.id === nextProps.todo.id &&
         prevProps.todo.text === nextProps.todo.text &&
         prevProps.todo.completed === nextProps.todo.completed;
});
```

### 2. IPC 優化

```typescript
// ❌ 錯誤: 多次 IPC 調用
for (const todo of todos) {
  await window.electronAPI.updateTodo(todo.id, todo.text);
}

// ✅ 正確: 批量處理
await window.electronAPI.updateTodos(todos);
```

### 3. 窗口緩存

```typescript
// 隱藏而非關閉窗口，保持狀態
win.on('close', (event) => {
  if (!app.isQuitting) {
    event.preventDefault();
    win.hide();  // 保持在內存中
  }
});
```

---

## 錯誤處理架構

### 分層錯誤處理

```
┌──────────────────┐
│   UI Layer       │ try-catch + 用戶提示
│   (React)        │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  IPC Layer       │ Promise rejection
│  (electronAPI)   │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Business Layer   │ try-catch + 日誌記錄
│ (ipcMain.handle) │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│  Storage Layer   │ 錯誤回退 + 默認值
│ (electron-store) │
└──────────────────┘
```

### 實現示例

```typescript
// React 層
const handleAddTodo = async (text: string) => {
  try {
    const newTodo = await window.electronAPI.addTodo(text);
    setTodos(prev => [...prev, newTodo]);
  } catch (error) {
    console.error('Failed to add todo:', error);
    // 顯示錯誤提示給用戶
  }
};

// 主進程層
ipcMain.handle('add-todo', async (_, text: string) => {
  try {
    // 輸入驗證
    if (typeof text !== 'string') {
      throw new Error('Invalid input type');
    }

    // 業務邏輯
    const todos = store.get('todos', []);
    const newTodo = { /* ... */ };
    todos.push(newTodo);
    store.set('todos', todos);

    return newTodo;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;  // 傳遞錯誤
  }
});
```

---

## 總結

這個 Electron + React Todo List 應用展示了:

1. **完整的多進程架構** - 主進程、渲染進程、預加載腳本
2. **安全的 IPC 通訊** - Context Bridge + 類型安全
3. **清晰的數據流** - 單向數據流 + 持久化
4. **原生桌面功能** - 菜單、托盤、快捷鍵
5. **最佳實踐** - 安全設置、錯誤處理、性能優化

是學習和理解 Electron 應用架構的絕佳範例！

---

**相關文檔**:
- [README.md](./README.md) - 完整項目文檔
- [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) - 快速開始
- [FEATURES_DEMO.md](./FEATURES_DEMO.md) - 功能演示
