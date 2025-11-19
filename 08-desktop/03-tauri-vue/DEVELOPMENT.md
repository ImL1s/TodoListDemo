# 開發指南

本指南幫助開發者理解代碼結構，並提供修改和擴展應用的指導。

## 🛠️ 開發環境設置

### 推薦的 IDE 設置

#### Visual Studio Code

推薦的擴展：

```json
{
  "recommendations": [
    "vue.volar",                    // Vue 語言支持
    "rust-lang.rust-analyzer",      // Rust 語言支持
    "tauri-apps.tauri-vscode",      // Tauri 支持
    "dbaeumer.vscode-eslint",       // ESLint
    "esbenp.prettier-vscode",       // Prettier
    "bradlc.vscode-tailwindcss"     // CSS 智能提示
  ]
}
```

設置（.vscode/settings.json）：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "rust-analyzer.checkOnSave.command": "clippy",
  "files.associations": {
    "*.rs": "rust"
  }
}
```

### 啟動開發伺服器

```bash
# Terminal 1: 前端開發伺服器
npm run dev

# Terminal 2: Tauri 應用
npm run tauri:dev

# 或者直接（會自動啟動前端）
npm run tauri:dev
```

### 除錯技巧

#### 前端除錯

```typescript
// 在代碼中添加斷點
debugger

// 或使用 console
console.log('todos:', todos.value)
console.table(todos.value)
```

右鍵視窗 → Inspect → 打開 Chrome DevTools

#### 後端除錯

```rust
// 在 Rust 代碼中
println!("Debug: {:?}", todos);
eprintln!("Error: {:?}", error);

// 使用 dbg! 宏
dbg!(&todos);
```

輸出會顯示在運行 `npm run tauri:dev` 的終端。

#### 使用 Rust Debugger

```bash
# 安裝 rust-lldb (macOS/Linux)
rustup component add lldb-preview

# 或 rust-gdb (Linux)
rustup component add rust-gdb

# 構建 debug 版本
cd src-tauri
cargo build

# 啟動調試
rust-lldb target/debug/tauri-vue-todo
```

## 📝 代碼修改指南

### 1. 添加新的 Todo 屬性

#### 步驟 1: 更新 Rust 數據模型

```rust
// src-tauri/src/main.rs
#[derive(Debug, Serialize, Deserialize, Clone)]
struct Todo {
    id: i64,
    text: String,
    completed: bool,
    #[serde(rename = "createdAt")]
    created_at: i64,
    // 新增屬性
    priority: Option<String>,  // "high", "medium", "low"
    tags: Vec<String>,
}
```

#### 步驟 2: 更新 TypeScript 類型

```typescript
// src/App.vue
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
  // 新增屬性
  priority?: 'high' | 'medium' | 'low'
  tags: string[]
}
```

#### 步驟 3: 更新 UI

```vue
<template>
  <div class="todo-item">
    <!-- 現有內容 -->
    <span class="todo-priority" :class="todo.priority">
      {{ todo.priority }}
    </span>
    <div class="todo-tags">
      <span v-for="tag in todo.tags" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>
  </div>
</template>
```

### 2. 添加新的 Tauri Command

#### 步驟 1: 定義 Rust 函數

```rust
// src-tauri/src/main.rs
#[tauri::command]
fn search_todos(query: String, state: State<AppState>) -> Result<Vec<Todo>, String> {
    let todos = get_todos(state)?;
    let results = todos
        .into_iter()
        .filter(|t| t.text.to_lowercase().contains(&query.to_lowercase()))
        .collect();
    Ok(results)
}
```

#### 步驟 2: 註冊命令

```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_todos,
            save_todos,
            show_about,
            search_todos  // 新增
        ])
        // ...
}
```

#### 步驟 3: 前端調用

```typescript
// src/App.vue
const searchTodos = async (query: string) => {
  try {
    const results = await invoke<Todo[]>('search_todos', { query })
    console.log('Search results:', results)
  } catch (error) {
    console.error('Search failed:', error)
  }
}
```

### 3. 添加新的選單項

```rust
// src-tauri/src/main.rs
fn create_menu<R: Runtime>(app: &AppHandle<R>) -> Result<Menu<R>, tauri::Error> {
    let menu = Menu::new(app)?;

    let file_menu = Submenu::with_items(
        app,
        "File",
        true,
        &[
            &MenuItem::with_id(app, "new", "New Todo", true, Some("CmdOrCtrl+N"))?,
            &MenuItem::with_id(app, "import", "Import...", true, Some("CmdOrCtrl+I"))?,  // 新增
            &MenuItem::with_id(app, "export", "Export...", true, Some("CmdOrCtrl+E"))?,  // 新增
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::quit(app, Some("Quit"))?,
        ],
    )?;

    menu.append(&file_menu)?;
    Ok(menu)
}

// 處理選單事件
app.on_menu_event(|app, event| {
    match event.id().as_ref() {
        "import" => {
            // 處理導入
        }
        "export" => {
            // 處理導出
        }
        _ => {}
    }
});
```

### 4. 使用對話框

```rust
// src-tauri/src/main.rs
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

#[tauri::command]
async fn show_confirm(app: AppHandle, message: String) -> Result<bool, String> {
    let answer = app
        .dialog()
        .message(message)
        .kind(MessageDialogKind::Info)
        .title("Confirm")
        .blocking_show();

    Ok(answer)
}
```

```typescript
// src/App.vue
const confirmDelete = async () => {
  const confirmed = await invoke<boolean>('show_confirm', {
    message: 'Are you sure you want to delete this todo?'
  })

  if (confirmed) {
    // 執行刪除
  }
}
```

### 5. 文件操作

```rust
// src-tauri/src/main.rs
use tauri_plugin_dialog::DialogExt;

#[tauri::command]
async fn export_todos(app: AppHandle, todos: Vec<Todo>) -> Result<(), String> {
    // 顯示保存對話框
    let file_path = app
        .dialog()
        .file()
        .add_filter("JSON", &["json"])
        .blocking_save_file();

    if let Some(path) = file_path {
        let json = serde_json::to_string_pretty(&todos)
            .map_err(|e| e.to_string())?;

        std::fs::write(path, json)
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
```

## 🎨 樣式修改

### 修改配色方案

```css
/* src/style.css */
:root {
  /* 主色調 */
  --primary-color: #0ea5e9;      /* 改成你喜歡的顏色 */
  --primary-hover: #0284c7;

  /* 危險操作色 */
  --danger-color: #ef4444;
  --danger-hover: #dc2626;

  /* 成功色 */
  --success-color: #10b981;

  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-hover: #f1f5f9;

  /* 文字顏色 */
  --text-primary: #0f172a;
  --text-secondary: #64748b;

  /* 邊框 */
  --border-color: #e2e8f0;

  /* 陰影 */
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### 添加深色模式

```css
/* src/style.css */
:root[data-theme="dark"] {
  --primary-color: #38bdf8;
  --bg-primary: #1e293b;
  --bg-secondary: #0f172a;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;
}
```

```typescript
// src/App.vue
const theme = ref<'light' | 'dark'>('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
}
```

## 🧪 測試

### 添加單元測試

```bash
# 安裝 Vitest
npm install -D vitest @vue/test-utils
```

```typescript
// src/App.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App', () => {
  it('renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Todo List')
  })

  it('adds a new todo', async () => {
    const wrapper = mount(App)
    const input = wrapper.find('input')
    await input.setValue('Test Todo')
    await input.trigger('keyup.enter')
    expect(wrapper.text()).toContain('Test Todo')
  })
})
```

### Rust 測試

```rust
// src-tauri/src/main.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_todo_creation() {
        let todo = Todo {
            id: 1,
            text: "Test".to_string(),
            completed: false,
            created_at: 0,
        };

        assert_eq!(todo.text, "Test");
        assert_eq!(todo.completed, false);
    }
}
```

運行測試：

```bash
cd src-tauri
cargo test
```

## 🔍 性能優化

### 1. 虛擬滾動（大量數據）

```vue
<template>
  <RecycleScroller
    class="scroller"
    :items="filteredTodos"
    :item-size="60"
    key-field="id"
  >
    <template #default="{ item }">
      <TodoItem :todo="item" />
    </template>
  </RecycleScroller>
</template>

<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
</script>
```

### 2. 防抖保存

```typescript
import { debounce } from 'lodash-es'

const debouncedSave = debounce(async () => {
  await saveTodos()
}, 500)

// 使用
const addTodo = () => {
  todos.value.push(newTodo)
  debouncedSave()  // 防抖保存
}
```

### 3. 批量更新

```rust
// 批量操作
#[tauri::command]
fn batch_update_todos(updates: Vec<(i64, bool)>, state: State<AppState>) -> Result<(), String> {
    let mut todos = get_todos(state.clone())?;

    for (id, completed) in updates {
        if let Some(todo) = todos.iter_mut().find(|t| t.id == id) {
            todo.completed = completed;
        }
    }

    save_todos(todos, state)?;
    Ok(())
}
```

## 🐛 常見問題解決

### 1. IPC 調用失敗

**問題**: `invoke` 返回錯誤

**解決**:

```typescript
// 添加詳細錯誤處理
try {
  await invoke('command_name', { params })
} catch (error) {
  console.error('IPC Error:', error)
  // 檢查 Rust 端是否正確註冊命令
  // 檢查參數類型是否匹配
}
```

### 2. 文件讀寫權限

**問題**: 無法讀寫文件

**解決**:

```json
// tauri.conf.json
{
  "plugins": {
    "fs": {
      "scope": [
        "$APPDATA/*",
        "$APPDATA/**",
        "$DESKTOP/*"  // 如果需要訪問桌面
      ]
    }
  }
}
```

### 3. 熱重載不工作

**問題**: 修改代碼後不更新

**解決**:

```bash
# 停止並重啟開發伺服器
# Ctrl+C

# 清除緩存
rm -rf node_modules/.vite

# 重新啟動
npm run tauri:dev
```

### 4. Rust 編譯錯誤

**問題**: 編譯失敗

**解決**:

```bash
# 更新 Rust
rustup update

# 清除並重建
cd src-tauri
cargo clean
cargo build

# 檢查語法
cargo check
cargo clippy
```

## 📦 構建優化

### Release 配置

```toml
# src-tauri/Cargo.toml
[profile.release]
opt-level = "z"        # 優化大小
lto = true             # Link Time Optimization
codegen-units = 1      # 更好的優化
strip = true           # 移除符號
panic = "abort"        # 減小二進制大小
```

### 前端優化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 移除 console
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue']  // 分離第三方庫
        }
      }
    }
  }
})
```

## 🎓 學習資源

### 推薦閱讀順序

1. **Tauri 基礎**
   - [Tauri 官方指南](https://v2.tauri.app/start/)
   - [Tauri API 文檔](https://v2.tauri.app/reference/js/)

2. **Vue 3**
   - [Vue 3 官方教程](https://vuejs.org/tutorial/)
   - [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

3. **Rust**
   - [Rust Book](https://doc.rust-lang.org/book/)
   - [Rust by Example](https://doc.rust-lang.org/rust-by-example/)

4. **進階主題**
   - [Tauri 插件系統](https://v2.tauri.app/plugin/)
   - [自定義協議](https://v2.tauri.app/develop/custom-protocols/)

## 🤝 貢獻指南

### 代碼風格

#### TypeScript

```typescript
// 使用 const/let，避免 var
const name = 'value'

// 使用箭頭函數
const fn = () => {}

// 使用類型註解
const todos: Todo[] = []

// 使用 async/await
const load = async () => {
  const data = await invoke('get_data')
}
```

#### Rust

```rust
// 使用 snake_case
fn get_todos() {}

// 使用 Result 處理錯誤
fn operation() -> Result<(), String> {
    Ok(())
}

// 避免 unwrap，使用 ?
let data = fs::read_to_string(path)?;

// 使用有意義的變數名
let todo_list = vec![];
```

### 提交信息格式

```
feat: 添加搜索功能
fix: 修復保存時的競態條件
docs: 更新 README
style: 格式化代碼
refactor: 重構 IPC 通訊
perf: 優化大量數據渲染
test: 添加單元測試
chore: 更新依賴
```

---

**準備好開始開發了！** 💻

如有任何問題，請查閱文檔或提出 issue。
