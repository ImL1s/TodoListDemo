# 架構文檔

## 技術架構

### 整體架構

```
┌─────────────────────────────────────────────────────┐
│                   用戶界面層                         │
│  ┌─────────────────────────────────────────────┐   │
│  │         Svelte Components                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │ TodoItem │  │TodoInput │  │TodoFilter│  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │ TodoList │  │TodoStats │  │SearchBar │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│                   狀態管理層                         │
│  ┌─────────────────────────────────────────────┐   │
│  │           Svelte Stores                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │  todos   │  │  filter  │  │  search  │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  │   │
│  │  ┌─────────────────────────────────────┐   │   │
│  │  │     filteredTodos (derived)         │   │   │
│  │  └─────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│                  IPC 通訊層                          │
│  ┌─────────────────────────────────────────────┐   │
│  │         Tauri Commands (invoke)             │   │
│  │    TypeScript (Frontend) ↔ Rust (Backend)  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│                  後端邏輯層                          │
│  ┌─────────────────────────────────────────────┐   │
│  │          Rust Backend (Tauri)               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │Commands  │  │AppState  │  │  Menu    │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  │   │
│  │  ┌──────────┐  ┌──────────┐               │   │
│  │  │  Tray    │  │ Events   │               │   │
│  │  └──────────┘  └──────────┘               │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│                  持久化層                            │
│  ┌─────────────────────────────────────────────┐   │
│  │        File System (todos.json)             │   │
│  │     $APPDATA/tauri-svelte-todo/             │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 數據流

### 1. 讀取數據流（應用啟動）

```
App.svelte (onMount)
    ↓
todoActions.loadTodos()
    ↓
invoke('get_todos')
    ↓ IPC
Rust: get_todos command
    ↓
AppState.todos (Mutex)
    ↓
Load from todos.json
    ↓
Return Vec<Todo>
    ↓ IPC
TypeScript: Update todos store
    ↓
filteredTodos (derived) auto-updates
    ↓
TodoList component re-renders
```

### 2. 寫入數據流（新增 Todo）

```
User types + Enter
    ↓
TodoInput.svelte: handleSubmit()
    ↓
todoActions.addTodo(text)
    ↓
invoke('add_todo', { text })
    ↓ IPC
Rust: add_todo command
    ↓
Create new Todo (UUID, timestamp)
    ↓
AppState.todos.lock().push(todo)
    ↓
Save to todos.json
    ↓
Return Todo
    ↓ IPC
TypeScript: todos.update(t => [...t, newTodo])
    ↓
filteredTodos (derived) auto-updates
    ↓
TodoList + TodoStats re-render
    ↓ Svelte transition
Animate new item (fly in)
```

### 3. 更新數據流（切換完成狀態）

```
User clicks checkbox
    ↓
TodoItem.svelte: handleToggle()
    ↓
todoActions.toggleTodo(id)
    ↓
invoke('toggle_todo', { id })
    ↓ IPC
Rust: toggle_todo command
    ↓
Find todo by id
    ↓
Toggle completed flag
    ↓
Update timestamp
    ↓
Save to todos.json
    ↓
Return updated Todo
    ↓ IPC
TypeScript: todos.update()
    ↓
Reactive update (Svelte)
    ↓
TodoItem re-renders with new state
```

## Svelte 響應式系統

### 響應式變數

```svelte
<script>
  let count = 0;  // 響應式變數

  // count 改變時，UI 自動更新
  function increment() {
    count += 1;  // 觸發更新
  }
</script>

<button on:click={increment}>
  Clicks: {count}  <!-- 自動顯示最新值 -->
</button>
```

### 響應式語句（$:）

```svelte
<script>
  let count = 0;

  // 響應式語句：count 改變時自動執行
  $: doubled = count * 2;

  // 響應式塊：可以包含多行代碼
  $: {
    console.log(`count is ${count}`);
    if (count > 10) {
      console.log('Count is getting big!');
    }
  }
</script>
```

### Svelte Stores

```typescript
// Writable Store - 可讀寫
const count = writable(0);

// Derived Store - 自動計算
const doubled = derived(count, $count => $count * 2);

// 在組件中使用（$ 自動訂閱）
$: console.log($count);  // 自動追蹤變化

// 手動訂閱
const unsubscribe = count.subscribe(value => {
  console.log(value);
});
```

## Tauri IPC 機制

### 安全通訊模型

```
Frontend (Untrusted)           Backend (Trusted)
┌──────────────────┐          ┌──────────────────┐
│  JavaScript      │          │  Rust            │
│  TypeScript      │          │                  │
│                  │          │                  │
│  invoke('cmd',   │  ───▶   │  #[tauri::command]│
│    { args })     │          │  fn cmd(args)    │
│                  │          │                  │
│  return Promise  │  ◀───   │  Result<T, E>    │
└──────────────────┘          └──────────────────┘

- 所有通訊都經過序列化/反序列化
- Rust 端進行參數驗證
- 錯誤安全處理
- 類型安全（TypeScript + Rust）
```

### Command 註冊

```rust
// main.rs
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        get_todos,      // 允許的命令
        add_todo,
        update_todo,
        // ...
    ])
    .run(tauri::generate_context!())
```

### 調用方式

```typescript
// 前端調用
import { invoke } from '@tauri-apps/api/core';

// 類型安全的調用
const todos = await invoke<Todo[]>('get_todos');

// 帶參數
const newTodo = await invoke<Todo>('add_todo', {
  text: 'New task'
});

// 錯誤處理
try {
  await invoke('delete_todo', { id });
} catch (error) {
  console.error('Failed:', error);
}
```

## 狀態管理策略

### Store 結構

```typescript
// 基礎 stores
export const todos = writable<Todo[]>([]);
export const currentFilter = writable<FilterType>('all');
export const searchQuery = writable<string>('');

// 派生 stores（自動計算）
export const filteredTodos = derived(
  [todos, currentFilter, searchQuery],
  ([$todos, $currentFilter, $searchQuery]) => {
    // 組合多個 store 的值
    // 任一依賴改變時自動重新計算
  }
);

export const todoStats = derived(todos, ($todos) => ({
  total: $todos.length,
  active: $todos.filter(t => !t.completed).length,
  completed: $todos.filter(t => t.completed).length,
}));
```

### 為什麼不用 Redux/Vuex？

在 Svelte 中，內建的 stores 系統已經足夠強大：

**優點:**
- 更簡單：無需 actions、reducers、mutations
- 更少代碼：直接 `todos.update()`
- 自動優化：derived stores 有內建記憶化
- TypeScript 友好：完整的類型推導
- 更好的性能：編譯時優化

**對比:**

```typescript
// Redux (React) - 需要很多樣板代碼
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
  },
});

// Svelte Stores - 簡單直接
const todos = writable([]);
todos.update(t => [...t, newTodo]);
```

## 文件系統持久化

### 數據存儲位置

```
macOS:     ~/Library/Application Support/com.tauri-svelte.todo/
Linux:     ~/.config/tauri-svelte-todo/
Windows:   C:\Users\<User>\AppData\Roaming\tauri-svelte-todo\

文件: todos.json
```

### 保存策略

```rust
impl AppState {
    fn save_to_file(&self) -> Result<(), Box<dyn std::error::Error>> {
        // 1. 獲取鎖（盡快釋放）
        let todos = self.todos.lock().unwrap();

        // 2. 序列化（在鎖外進行）
        let json = serde_json::to_string_pretty(&*todos)?;
        drop(todos);  // 立即釋放鎖

        // 3. 確保目錄存在
        if let Some(parent) = self.data_path.parent() {
            fs::create_dir_all(parent)?;
        }

        // 4. 寫入文件
        fs::write(&self.data_path, json)?;

        Ok(())
    }
}
```

### 讀取策略

```rust
fn load_from_file(path: &PathBuf) -> Result<Vec<Todo>, Box<dyn std::error::Error>> {
    // 1. 檢查文件是否存在
    if !path.exists() {
        return Ok(Vec::new());  // 首次運行
    }

    // 2. 讀取文件
    let content = fs::read_to_string(path)?;

    // 3. 反序列化
    let todos: Vec<Todo> = serde_json::from_str(&content)?;

    Ok(todos)
}
```

## 系統整合

### 系統托盤

```rust
TrayIconBuilder::new()
    .menu(&tray_menu)              // 托盤選單
    .tooltip("Todo App")           // 懸停提示
    .on_tray_icon_event(|tray, event| {
        // 處理托盤點擊
        if let TrayIconEvent::Click { button: Left, .. } = event {
            // 顯示主視窗
        }
    })
    .build(app)?
```

### 原生選單

```rust
// 創建選單
let file_menu = Menu::with_items(app, &[
    &MenuItem::with_id(app, "new", "New", true, Some("Cmd+N"))?,
    &PredefinedMenuItem::close_window(app, Some("Close"))?,
])?;

// 處理選單事件
app.on_menu_event(|app, event| {
    match event.id.as_ref() {
        "new" => { /* 處理新建 */ }
        _ => {}
    }
});
```

### 鍵盤快捷鍵

```typescript
// 全局快捷鍵處理
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
    e.preventDefault();
    // 聚焦輸入框
    document.querySelector('input')?.focus();
  }
});
```

## 性能優化

### 1. Svelte 編譯優化

Svelte 在構建時會：
- 移除未使用的代碼
- 內聯小組件
- 優化 DOM 操作
- 生成最小的運行時代碼

### 2. Rust 性能

```rust
// 使用 Mutex 而非 RwLock（寫多讀少）
struct AppState {
    todos: Mutex<Vec<Todo>>,  // 更簡單，足夠快
}

// 最小化鎖持有時間
{
    let mut todos = state.todos.lock().unwrap();
    todos.push(new_todo);
}  // 鎖在這裡自動釋放

// 避免不必要的克隆
let todo = todos.iter().find(|t| t.id == id)?;
let result = todo.clone();  // 只在需要時克隆
```

### 3. 派生 Store 優化

```typescript
// 自動記憶化
export const filteredTodos = derived(
  [todos, filter],
  ([$todos, $filter]) => {
    // 只在 todos 或 filter 改變時重新計算
    return $todos.filter(/* ... */);
  }
);

// 避免不必要的重新計算
const expensiveComputation = derived(todos, ($todos) => {
  // 這個函數只在 todos 改變時執行
  return $todos.map(/* expensive operation */);
});
```

### 4. 動畫性能

```svelte
<!-- 使用 CSS transforms（GPU 加速） -->
<div
  in:fly={{ y: 20, duration: 300 }}
  out:fade={{ duration: 200 }}
>
  <!-- 內容 -->
</div>

<!-- flip 動畫使用 FLIP 技術 -->
{#each todos as todo (todo.id)}
  <div animate:flip={{ duration: 300 }}>
    <!-- 使用唯一 key 優化 -->
  </div>
{/each}
```

## 錯誤處理

### 前端錯誤處理

```typescript
export const todoActions = {
  async addTodo(text: string) {
    try {
      const newTodo = await invoke<Todo>('add_todo', { text });
      todos.update(t => [...t, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
      // 可以在這裡添加用戶通知
    }
  }
};
```

### 後端錯誤處理

```rust
#[tauri::command]
fn add_todo(text: String, state: State<AppState>) -> Result<Todo, String> {
    if text.trim().is_empty() {
        return Err("Text cannot be empty".to_string());
    }

    let todo = Todo { /* ... */ };

    state.save_to_file()
        .map_err(|e| e.to_string())?;  // 轉換錯誤類型

    Ok(todo)
}
```

## 測試策略

### 單元測試（Rust）

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_todo() {
        let state = AppState::new(PathBuf::from("test.json"));
        let result = add_todo("Test".to_string(), State::from(&state));
        assert!(result.is_ok());
    }
}
```

### 組件測試（Svelte）

```typescript
// 使用 @testing-library/svelte
import { render, fireEvent } from '@testing-library/svelte';
import TodoItem from './TodoItem.svelte';

test('toggles todo', async () => {
  const { getByRole } = render(TodoItem, { todo });
  const checkbox = getByRole('checkbox');

  await fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();
});
```

## 安全性考慮

### 1. IPC 安全

```rust
// 所有 command 都需要明確註冊
.invoke_handler(tauri::generate_handler![
    get_todos,  // 只有這些命令可以從前端調用
    add_todo,
])

// 參數驗證
#[tauri::command]
fn add_todo(text: String, state: State<AppState>) -> Result<Todo, String> {
    if text.len() > 1000 {
        return Err("Text too long".to_string());
    }
    // ...
}
```

### 2. 文件系統安全

```json
// tauri.conf.json
{
  "plugins": {
    "fs": {
      "scope": ["$APPDATA/*"]  // 限制文件訪問範圍
    }
  }
}
```

### 3. CSP 策略

```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'"
    }
  }
}
```

## 部署和分發

### 構建流程

```bash
# 1. 安裝依賴
npm install

# 2. 構建前端
npm run build
# 輸出到 dist/

# 3. 構建 Tauri 應用
npm run tauri:build
# 輸出到 src-tauri/target/release/bundle/
```

### 平台特定配置

```json
{
  "bundle": {
    "macOS": {
      "minimumSystemVersion": "10.15"
    },
    "windows": {
      "wix": {
        "language": "zh-CN"
      }
    },
    "linux": {
      "deb": {
        "depends": ["libwebkit2gtk-4.1-0"]
      }
    }
  }
}
```

## 未來改進

### 可能的增強功能

1. **離線支援** - Service Worker
2. **數據同步** - 雲端備份
3. **多視窗支援** - 分離的 todo 列表
4. **插件系統** - 自定義擴展
5. **快捷鍵自定義** - 用戶定義快捷鍵
6. **主題系統** - 自定義顏色方案
7. **導入/導出** - 支援多種格式
8. **標籤系統** - 組織 todos
9. **提醒功能** - 原生通知
10. **統計圖表** - 可視化完成情況

### 技術債務

1. 添加完整的錯誤處理和用戶反饋
2. 實現撤銷/重做功能
3. 添加單元測試和集成測試
4. 改進無障礙支援（ARIA）
5. 添加多語言支援（i18n）

---

這個架構文檔提供了應用程式的完整技術視圖，幫助開發者理解各個部分如何協同工作。
