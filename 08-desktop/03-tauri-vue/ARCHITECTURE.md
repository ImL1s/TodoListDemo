# Tauri Vue Todo - 架構說明

## 🏛️ 整體架構

本應用採用 **前後端分離** 的架構，通過 Tauri 的 IPC (Inter-Process Communication) 機制連接：

```
┌─────────────────────────────────────────────────────────┐
│                    用戶界面層                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Vue 3 Frontend (TypeScript)               │  │
│  │  • App.vue (主組件)                               │  │
│  │  • Reactive State (ref, computed)                │  │
│  │  • Event Handling                                │  │
│  │  • UI Rendering                                  │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↕                              │
│                    Tauri IPC Bridge                     │
│                 (Type-safe Commands)                    │
│                          ↕                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Rust Backend (Tauri Core)                │  │
│  │  • Command Handlers                              │  │
│  │  • File System Operations                        │  │
│  │  • State Management                              │  │
│  │  • System Integration                            │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↕                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Operating System                     │  │
│  │  • File System ($APPDATA/todos.json)             │  │
│  │  • System Tray                                   │  │
│  │  • Native Menus                                  │  │
│  │  • Window Manager                                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📊 數據流

### 1. 載入 Todos (啟動時)

```
[應用啟動]
    ↓
[Vue onMounted]
    ↓
[調用 loadTodos()]
    ↓
[invoke('get_todos')] ──IPC──→ [Rust: get_todos()]
                                      ↓
                                [讀取 todos.json]
                                      ↓
                                [解析 JSON]
                                      ↓
                                [返回 Vec<Todo>]
                                      ↓
[接收 todos] ←─────IPC─────────────────┘
    ↓
[更新 Vue state]
    ↓
[UI 重新渲染]
```

### 2. 新增 Todo

```
[用戶輸入 + Enter]
    ↓
[addTodo()]
    ↓
[創建新 Todo 對象]
    ↓
[更新本地 state]
    ↓
[invoke('save_todos')] ──IPC──→ [Rust: save_todos()]
                                      ↓
                                [序列化為 JSON]
                                      ↓
                                [寫入 todos.json]
                                      ↓
[保存成功] ←─────IPC─────────────────────┘
    ↓
[UI 已更新（即時反饋）]
```

### 3. 切換完成狀態

```
[點擊 checkbox]
    ↓
[toggleTodo(id)]
    ↓
[找到對應 todo]
    ↓
[切換 completed 狀態]
    ↓
[invoke('save_todos')] ──IPC──→ [Rust: save_todos()]
                                      ↓
                                [保存到文件]
                                      ↓
[確認] ←─────IPC───────────────────────┘
    ↓
[UI 更新（動畫過渡）]
```

## 🔧 核心組件

### Frontend (Vue 3)

#### 1. 狀態管理

```typescript
// 響應式狀態
const todos = ref<Todo[]>([])           // 所有 todos
const newTodo = ref('')                 // 輸入框內容
const filter = ref<FilterType>('all')  // 當前篩選

// 計算屬性（自動更新）
const activeTodos = computed(() => todos.value.filter(t => !t.completed))
const completedTodos = computed(() => todos.value.filter(t => t.completed))
const filteredTodos = computed(() => {
  // 根據 filter 返回對應的 todos
})
```

#### 2. IPC 通訊

```typescript
import { invoke } from '@tauri-apps/api/core'

// 類型安全的調用
const loadTodos = async () => {
  const loaded = await invoke<Todo[]>('get_todos')
  todos.value = loaded
}

const saveTodos = async () => {
  await invoke('save_todos', { todos: todos.value })
}
```

#### 3. 事件處理

```typescript
// 鍵盤快捷鍵
const handleKeyboard = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'n': inputRef.value?.focus(); break
      case 'f': /* 切換篩選 */; break
      case 'r': loadTodos(); break
    }
  }
}

// 監聽 Tauri 事件
await listen('refresh-todos', () => {
  loadTodos()
})
```

### Backend (Rust)

#### 1. 命令處理器

```rust
#[tauri::command]
fn get_todos(state: State<AppState>) -> Result<Vec<Todo>, String> {
    // 1. 獲取數據路徑
    let path = &state.data_path;

    // 2. 讀取文件
    let content = fs::read_to_string(path)?;

    // 3. 解析 JSON
    let todos: Vec<Todo> = serde_json::from_str(&content)?;

    // 4. 返回結果
    Ok(todos)
}
```

#### 2. 狀態管理

```rust
struct AppState {
    data_path: PathBuf,  // 數據文件路徑
}

impl AppState {
    fn new(app_handle: &AppHandle) -> Self {
        // 獲取跨平台的數據目錄
        let data_dir = app_handle.path().app_data_dir()
            .expect("Failed to get app data directory");

        // 確保目錄存在
        fs::create_dir_all(&data_dir)
            .expect("Failed to create data directory");

        Self {
            data_path: data_dir.join("todos.json")
        }
    }
}
```

#### 3. 系統整合

```rust
// 系統托盤
fn create_tray<R: Runtime>(app: &AppHandle<R>) -> Result<(), tauri::Error> {
    TrayIconBuilder::with_id("main")
        .tooltip("Tauri Vue Todo")
        .icon(app.default_window_icon().unwrap().clone())
        .on_tray_icon_event(|tray, event| {
            // 處理托盤點擊事件
            if let TrayIconEvent::Click { .. } = event {
                // 顯示主視窗
            }
        })
        .build(app)?;
    Ok(())
}

// 原生選單
fn create_menu<R: Runtime>(app: &AppHandle<R>) -> Result<Menu<R>, tauri::Error> {
    let menu = Menu::new(app)?;

    // File 選單
    let file_menu = Submenu::with_items(
        app,
        "File",
        true,
        &[
            &MenuItem::with_id(app, "new", "New Todo", true, Some("CmdOrCtrl+N"))?,
            &PredefinedMenuItem::quit(app, Some("Quit"))?,
        ],
    )?;

    menu.append(&file_menu)?;
    Ok(menu)
}
```

## 🔐 安全模型

### 1. 權限控制

```json
// tauri.conf.json
{
  "plugins": {
    "fs": {
      "scope": ["$APPDATA/*", "$APPDATA/**"]  // 只允許訪問應用數據目錄
    }
  }
}
```

### 2. CSP (Content Security Policy)

```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; style-src 'self' 'unsafe-inline'"
    }
  }
}
```

### 3. IPC 安全

```rust
// Rust 端：類型檢查
#[tauri::command]
fn save_todos(todos: Vec<Todo>, state: State<AppState>) -> Result<(), String> {
    // todos 必須是 Vec<Todo> 類型
    // 自動驗證和反序列化
}

// TypeScript 端：類型安全
await invoke<void>('save_todos', {
    todos: todos.value  // 編譯時類型檢查
})
```

## 📁 文件系統

### 數據存儲位置

```
Windows:
C:\Users\{username}\AppData\Roaming\com.tauri.vue.todo\todos.json

macOS:
/Users/{username}/Library/Application Support/com.tauri.vue.todo/todos.json

Linux:
/home/{username}/.config/com.tauri.vue.todo/todos.json
```

### 數據格式

```json
[
  {
    "id": 1700000000000,
    "text": "Learn Tauri",
    "completed": false,
    "createdAt": 1700000000000
  },
  {
    "id": 1700000001000,
    "text": "Build awesome apps",
    "completed": true,
    "createdAt": 1700000001000
  }
]
```

## 🎨 UI 層次

```
App.vue
├── Custom Title Bar (自定義標題欄)
│   ├── App Icon & Title
│   └── Window Controls (Minimize, Maximize, Close)
├── Header (標題)
├── Add Form (新增表單)
│   ├── Input Field
│   └── Add Button
├── Filters (篩選器)
│   ├── All
│   ├── Active
│   └── Completed
├── Stats (統計)
│   ├── Total Count
│   ├── Active Count
│   └── Completed Count
├── Todo List (待辦清單)
│   └── Todo Items (動態渲染)
│       ├── Checkbox
│       ├── Text
│       ├── Date
│       └── Delete Button
├── Footer Actions (底部操作)
│   ├── Clear Completed
│   └── About
└── Shortcuts Info (快捷鍵資訊)
```

## ⚡ 性能優化

### 1. 響應式系統

```typescript
// 使用 computed 避免重複計算
const filteredTodos = computed(() => {
  // 只在 todos 或 filter 改變時重新計算
  switch (filter.value) {
    case 'active': return activeTodos.value
    case 'completed': return completedTodos.value
    default: return todos.value
  }
})
```

### 2. 批量操作

```typescript
// 好：批量保存
const clearCompleted = async () => {
  todos.value = activeTodos.value
  await saveTodos()  // 一次 IPC 調用
}

// 壞：逐個刪除
const clearCompleted = async () => {
  for (const todo of completedTodos.value) {
    await deleteTodo(todo.id)  // N 次 IPC 調用
  }
}
```

### 3. 過渡動畫

```vue
<!-- 使用 TransitionGroup 實現流暢動畫 -->
<TransitionGroup name="list">
  <div v-for="todo in filteredTodos" :key="todo.id">
    <!-- ... -->
  </div>
</TransitionGroup>
```

## 🔄 生命週期

### 應用啟動流程

```
1. [Rust] main() 函數執行
   ├── 初始化 Tauri
   ├── 註冊命令
   ├── 創建應用狀態
   ├── 設置選單
   ├── 創建托盤圖標
   └── 創建視窗

2. [Frontend] Vue 應用啟動
   ├── 載入 main.ts
   ├── 創建 Vue 實例
   ├── 掛載 App.vue
   └── 觸發 onMounted

3. [Frontend] onMounted 鉤子
   ├── 調用 loadTodos()
   ├── 註冊鍵盤監聽
   └── 監聽 Tauri 事件

4. [Rust] 處理 get_todos 命令
   ├── 讀取 todos.json
   ├── 解析數據
   └── 返回給前端

5. [Frontend] 接收數據
   ├── 更新 state
   └── 渲染 UI
```

### 應用關閉流程

```
1. [User] 點擊關閉按鈕
   ↓
2. [Frontend] closeWindow()
   ↓
3. [Frontend] onUnmounted 鉤子
   ├── 移除事件監聽
   └── 清理資源
   ↓
4. [Rust] 視窗關閉
   ↓
5. [Rust] 應用退出
```

## 🎯 擴展點

如果要擴展此應用，可以考慮以下架構改進：

### 1. 添加資料庫支援

```rust
use rusqlite::Connection;

struct AppState {
    db: Mutex<Connection>,
}

#[tauri::command]
fn get_todos(state: State<AppState>) -> Result<Vec<Todo>, String> {
    let conn = state.db.lock().unwrap();
    let mut stmt = conn.prepare("SELECT * FROM todos")?;
    // ...
}
```

### 2. 實現分類系統

```rust
#[derive(Serialize, Deserialize)]
struct Category {
    id: String,
    name: String,
    color: String,
}

#[derive(Serialize, Deserialize)]
struct Todo {
    id: i64,
    text: String,
    completed: bool,
    category_id: Option<String>,  // 關聯到分類
    created_at: i64,
}
```

### 3. 添加雲端同步

```rust
use reqwest::Client;

#[tauri::command]
async fn sync_todos(state: State<AppState>) -> Result<(), String> {
    let client = Client::new();
    // 上傳到雲端
    // 下載更新
    // 合併衝突
}
```

### 4. 實現撤銷/重做

```typescript
// 使用 Command Pattern
interface Command {
  execute(): void
  undo(): void
}

class AddTodoCommand implements Command {
  execute() { /* 添加 todo */ }
  undo() { /* 刪除剛添加的 todo */ }
}

const commandHistory: Command[] = []
```

## 📚 參考資料

- [Tauri Architecture](https://v2.tauri.app/concept/architecture/)
- [Tauri Security](https://v2.tauri.app/concept/security/)
- [Vue 3 Reactivity](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Rust Book](https://doc.rust-lang.org/book/)
