# Tauri + Svelte Todo List

一個使用 **Tauri 2.0** 和 **Svelte 4** 構建的現代化桌面 Todo List 應用程式，展示了兩個框架的最佳特性和性能優勢。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)
![Svelte](https://img.shields.io/badge/Svelte-4.0-orange.svg)

## 特色功能

### 核心功能
- ✅ **完整的 CRUD 操作** - 創建、讀取、更新、刪除 todos
- 🔍 **即時搜尋** - 快速過濾 todos
- 🏷️ **智能篩選** - All / Active / Completed
- 📊 **即時統計** - 追蹤總數、活躍和已完成項目
- 💾 **檔案系統持久化** - 使用 Tauri FS Plugin
- 🎨 **流暢動畫** - Svelte transitions 和 animations
- ⌨️ **鍵盤快捷鍵** - 提升生產力
- 🖥️ **視窗管理** - 最小化、最大化、關閉
- 📍 **系統托盤** - 最小化到系統托盤
- 📋 **原生選單** - macOS/Windows/Linux 原生選單

### 技術亮點
- 🚀 **超輕量級** - 比 Electron 小 10 倍以上
- ⚡ **極致性能** - Rust 後端 + Svelte 編譯時優化
- 🔒 **安全 IPC** - Tauri Commands 安全通訊
- 🎯 **類型安全** - TypeScript + Rust
- 🌗 **深色模式** - 自動適應系統主題
- 📱 **響應式設計** - Tailwind CSS

## 為何選擇 Svelte？

### 1. **編譯時框架，零運行時開銷**
與 React 和 Vue 不同，Svelte 在構建時將組件編譯為高效的命令式代碼，無需虛擬 DOM。

```javascript
// React - 需要虛擬 DOM diff
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// Svelte - 直接編譯為 DOM 操作
<script>
  let count = 0;
</script>
<button on:click={() => count += 1}>{count}</button>
```

### 2. **真正的響應式**
Svelte 的響應式是語言級別的，不需要 hooks 或生命週期。

```svelte
<script>
  let count = 0;
  // $ 符號聲明響應式語句，自動追蹤依賴
  $: doubled = count * 2;
  $: console.log(`count is ${count}`);
</script>

<button on:click={() => count += 1}>
  {count} × 2 = {doubled}
</button>
```

### 3. **更少的代碼**
Svelte 組件比 React/Vue 平均少 40% 的代碼。

### 4. **內建動畫和過渡**
無需額外庫，開箱即用的動畫系統。

```svelte
<script>
  import { fade, fly } from 'svelte/transition';
</script>

<div in:fly={{ y: 20 }} out:fade>
  Hello!
</div>
```

### 5. **優秀的開發體驗**
- 單文件組件 (.svelte)
- 優秀的 TypeScript 支援
- 快速的熱模組替換 (HMR)
- 清晰的錯誤訊息

## Tauri + Svelte 優勢

| 特性 | Tauri + Svelte | Electron + React | Electron + Vue |
|------|----------------|------------------|----------------|
| 安裝包大小 | ~3-5 MB | ~80-120 MB | ~60-90 MB |
| 記憶體使用 | ~30-50 MB | ~150-300 MB | ~120-200 MB |
| 啟動時間 | 超快 ⚡ | 慢 🐌 | 中等 🐢 |
| 性能 | 極致 🚀 | 一般 ✈️ | 良好 🚁 |
| 學習曲線 | 平緩 📚 | 陡峭 📖 | 中等 📕 |
| 代碼量 | 最少 ✨ | 較多 📝 | 中等 📄 |

### 性能比較

```bash
# 構建大小比較（生產環境）
Tauri + Svelte:    ~3.5 MB   (100%)
Tauri + React:     ~4.2 MB   (120%)
Tauri + Vue:       ~3.8 MB   (109%)
Electron + React:  ~85 MB    (2429%)

# 記憶體使用（空閒狀態）
Tauri + Svelte:    ~35 MB
Tauri + React:     ~45 MB
Electron + React:  ~180 MB

# 啟動時間
Tauri + Svelte:    <100ms
Tauri + React:     ~150ms
Electron + React:  ~800ms
```

## 專案架構

```
04-tauri-svelte/
├── src/                          # Svelte 前端代碼
│   ├── App.svelte               # 主應用組件
│   ├── main.ts                  # 應用入口
│   ├── app.css                  # 全局樣式
│   └── lib/
│       ├── components/          # Svelte 組件
│       │   ├── TodoItem.svelte  # Todo 項目組件
│       │   ├── TodoList.svelte  # Todo 列表組件
│       │   ├── TodoInput.svelte # 輸入組件
│       │   ├── TodoFilter.svelte # 篩選組件
│       │   ├── TodoStats.svelte  # 統計組件
│       │   └── SearchBar.svelte  # 搜尋欄組件
│       ├── stores/              # Svelte Stores
│       │   └── todoStore.ts     # Todo 狀態管理
│       └── types/               # TypeScript 類型
│           └── Todo.ts          # Todo 類型定義
│
├── src-tauri/                    # Rust 後端代碼
│   ├── src/
│   │   └── main.rs              # Rust 主程式
│   ├── Cargo.toml               # Rust 依賴
│   ├── tauri.conf.json          # Tauri 配置
│   ├── build.rs                 # 構建腳本
│   └── icons/                   # 應用圖標
│
├── package.json                  # Node.js 依賴
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts                # Vite 配置
├── svelte.config.js              # Svelte 配置
├── tailwind.config.js            # Tailwind 配置
└── README.md                     # 專案說明
```

## 技術棧

### 前端
- **Svelte 4** - 編譯時框架，無虛擬 DOM
- **TypeScript** - 類型安全
- **Vite** - 超快速構建工具
- **Tailwind CSS** - 實用優先的 CSS 框架
- **Svelte Transitions** - 內建動畫系統

### 後端
- **Rust** - 系統級性能和記憶體安全
- **Tauri 2.0** - 現代化桌面應用框架
- **Serde** - Rust 序列化/反序列化
- **UUID** - 唯一識別符生成
- **Chrono** - 日期時間處理

### Tauri Plugins
- **tauri-plugin-fs** - 檔案系統訪問
- **tauri-plugin-dialog** - 原生對話框
- **tauri-plugin-shell** - Shell 命令執行

## 安裝和運行

### 前置需求

1. **Node.js** (v18 或更高)
   ```bash
   node --version  # v18.0.0+
   ```

2. **Rust** (最新穩定版)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustc --version  # 1.70.0+
   ```

3. **系統依賴**

   **macOS:**
   ```bash
   xcode-select --install
   ```

   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt update
   sudo apt install libwebkit2gtk-4.1-dev \
     build-essential \
     curl \
     wget \
     file \
     libssl-dev \
     libayatana-appindicator3-dev \
     librsvg2-dev
   ```

   **Windows:**
   - 安裝 [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - 安裝 [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)

### 安裝依賴

```bash
# 進入專案目錄
cd 08-desktop/04-tauri-svelte

# 安裝 Node.js 依賴
npm install

# Rust 依賴會在首次運行時自動安裝
```

### 開發模式

```bash
# 啟動開發服務器（包含熱重載）
npm run tauri:dev

# 或分別運行
npm run dev          # Vite 開發服務器
npm run tauri dev    # Tauri 開發模式
```

### 構建生產版本

```bash
# 構建應用程式
npm run tauri:build

# 構建產物位置：
# macOS:   src-tauri/target/release/bundle/dmg/
# Linux:   src-tauri/target/release/bundle/deb/ 或 appimage/
# Windows: src-tauri/target/release/bundle/msi/
```

## 鍵盤快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Cmd/Ctrl + N` | 聚焦新 Todo 輸入框 |
| `Cmd/Ctrl + F` | 聚焦搜尋框 |
| `Cmd/Ctrl + R` | 重新載入 Todos |
| `Cmd/Ctrl + W` | 關閉視窗 |
| `Cmd/Ctrl + M` | 最小化到系統托盤 |
| `Enter` | 新增 Todo（在輸入框中） |
| `Escape` | 取消編輯 |
| `Double Click` | 編輯 Todo |

## 核心實現

### 1. Svelte Stores 狀態管理

```typescript
// src/lib/stores/todoStore.ts
import { writable, derived } from 'svelte/store';

// 基礎 store
export const todos = writable<Todo[]>([]);
export const currentFilter = writable<FilterType>('all');

// 派生 store - 自動計算
export const filteredTodos = derived(
  [todos, currentFilter],
  ([$todos, $currentFilter]) => {
    if ($currentFilter === 'active') {
      return $todos.filter(t => !t.completed);
    }
    // ...
  }
);
```

### 2. Svelte Transitions 動畫

```svelte
<!-- TodoItem.svelte -->
<script>
  import { fade, fly } from 'svelte/transition';
</script>

<div
  in:fly={{ y: 20, duration: 300 }}
  out:fade={{ duration: 200 }}
>
  <!-- Todo 內容 -->
</div>
```

### 3. Tauri Commands (Rust)

```rust
// src-tauri/src/main.rs
#[tauri::command]
fn add_todo(text: String, state: State<AppState>) -> Result<Todo, String> {
    let todo = Todo {
        id: Uuid::new_v4().to_string(),
        text,
        completed: false,
        created_at: now,
        updated_at: now,
    };

    let mut todos = state.todos.lock().unwrap();
    todos.push(todo.clone());

    state.save_to_file()?;
    Ok(todo)
}
```

### 4. Tauri IPC 調用 (TypeScript)

```typescript
// src/lib/stores/todoStore.ts
import { invoke } from '@tauri-apps/api/core';

export const todoActions = {
  async addTodo(text: string) {
    const newTodo = await invoke<Todo>('add_todo', { text });
    todos.update(t => [...t, newTodo]);
  }
};
```

### 5. 檔案系統持久化

```rust
impl AppState {
    fn save_to_file(&self) -> Result<(), Box<dyn std::error::Error>> {
        let todos = self.todos.lock().unwrap();
        let json = serde_json::to_string_pretty(&*todos)?;

        if let Some(parent) = self.data_path.parent() {
            fs::create_dir_all(parent)?;
        }

        fs::write(&self.data_path, json)?;
        Ok(())
    }
}
```

### 6. 系統托盤和選單

```rust
// 創建系統托盤
let tray = TrayIconBuilder::new()
    .menu(&tray_menu)
    .tooltip("Tauri Svelte Todo")
    .on_menu_event(|app, event| {
        match event.id.as_ref() {
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    window.show()?;
                    window.set_focus()?;
                }
            }
            // ...
        }
    })
    .build(app)?;
```

## Tauri 與 Electron 比較

### 架構差異

**Tauri:**
```
┌─────────────────┐
│  Svelte (UI)    │
│  WebView API    │ ← 使用系統 WebView
├─────────────────┤
│  Rust Backend   │ ← 原生性能
└─────────────────┘
   ~3-5 MB
```

**Electron:**
```
┌─────────────────┐
│  React (UI)     │
│  Chromium       │ ← 打包完整瀏覽器
├─────────────────┤
│  Node.js        │ ← JavaScript 運行時
└─────────────────┘
   ~80-120 MB
```

### 優缺點對比

**Tauri + Svelte 優點:**
- ✅ 超小的安裝包（3-5 MB vs 80-120 MB）
- ✅ 更低的記憶體佔用
- ✅ 原生性能（Rust）
- ✅ 更好的安全性
- ✅ 更快的啟動時間
- ✅ 使用系統原生 WebView

**Electron + React 優點:**
- ✅ 更成熟的生態系統
- ✅ 更多的第三方套件
- ✅ 一致的渲染引擎（跨平台）
- ✅ 更豐富的文檔和範例

## 與其他 Tauri 組合比較

### Tauri + React
```typescript
// React - 需要更多樣板代碼
function TodoItem({ todo, onToggle, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  return (
    <div>
      {isEditing ? (
        <input value={text} onChange={e => setText(e.target.value)} />
      ) : (
        <span>{todo.text}</span>
      )}
    </div>
  );
}
```

### Tauri + Vue
```vue
<!-- Vue - 選項式 API 較冗長 -->
<template>
  <div>
    <input v-if="isEditing" v-model="text" />
    <span v-else>{{ todo.text }}</span>
  </div>
</template>

<script>
export default {
  props: ['todo'],
  data() {
    return {
      isEditing: false,
      text: this.todo.text
    }
  }
}
</script>
```

### Tauri + Svelte
```svelte
<!-- Svelte - 最簡潔 -->
<script>
  export let todo;
  let isEditing = false;
  let text = todo.text;
</script>

<div>
  {#if isEditing}
    <input bind:value={text} />
  {:else}
    <span>{todo.text}</span>
  {/if}
</div>
```

## 性能優化技巧

### 1. Svelte 編譯優化
Svelte 會在構建時：
- 移除未使用的代碼
- 優化 DOM 操作
- 生成高效的更新代碼

### 2. Rust 後端優化
```rust
// 使用 Mutex 保護共享狀態
struct AppState {
    todos: Mutex<Vec<Todo>>,
}

// 最小化鎖持有時間
let mut todos = state.todos.lock().unwrap();
todos.push(todo);
drop(todos);  // 立即釋放鎖
```

### 3. 批量更新
```typescript
// 批量操作 store
todos.update(t => {
  // 多個修改在一次更新中完成
  t.push(newTodo1);
  t.push(newTodo2);
  return t;
});
```

### 4. 派生 Store 記憶化
```typescript
// 派生 store 會自動記憶化結果
export const filteredTodos = derived(
  [todos, currentFilter],
  ([$todos, $currentFilter]) => {
    // 只在依賴變化時重新計算
    return $todos.filter(/* ... */);
  }
);
```

## 打包和分發

### macOS
```bash
npm run tauri:build

# 輸出：src-tauri/target/release/bundle/dmg/
# 可以直接分發 .dmg 文件
# 或上傳到 Mac App Store（需要證書）
```

### Windows
```bash
npm run tauri:build

# 輸出：src-tauri/target/release/bundle/msi/
# 生成 .msi 安裝程序
# 可選：生成 .exe（需要配置）
```

### Linux
```bash
npm run tauri:build

# 輸出：
# - .deb (Debian/Ubuntu)
# - .rpm (Fedora/RHEL)
# - .AppImage (通用)
```

### 簽名和公證

**macOS:**
```bash
# 在 tauri.conf.json 配置簽名
{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Your Name"
    }
  }
}
```

## 學習資源

### Svelte
- [官方文檔](https://svelte.dev/docs) - 優秀的互動式教學
- [Svelte Tutorial](https://svelte.dev/tutorial) - 循序漸進的教學
- [Svelte REPL](https://svelte.dev/repl) - 線上試驗場
- [SvelteKit](https://kit.svelte.dev/) - Svelte 全端框架

### Tauri
- [Tauri 官方文檔](https://tauri.app/v1/guides/)
- [Tauri API 參考](https://tauri.app/v1/api/js/)
- [Tauri GitHub](https://github.com/tauri-apps/tauri)
- [Awesome Tauri](https://github.com/tauri-apps/awesome-tauri)

### Rust
- [Rust 程式設計語言](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings](https://github.com/rust-lang/rustlings)

### 社群
- [Svelte Discord](https://discord.com/invite/svelte)
- [Tauri Discord](https://discord.com/invite/tauri)
- [Reddit r/sveltejs](https://reddit.com/r/sveltejs)

## 常見問題

### Q: Svelte vs React，我該選哪個？
**A:** 如果你重視：
- **性能和包大小** → Svelte
- **生態系統和工作機會** → React
- **學習曲線** → Svelte（更簡單）
- **團隊熟悉度** → 取決於你的團隊

### Q: Tauri 支援哪些平台？
**A:**
- ✅ Windows 7+
- ✅ macOS 10.15+
- ✅ Linux (多種發行版)
- 🚧 iOS/Android (實驗性支援)

### Q: 如何調試 Tauri 應用？
**A:**
```bash
# 前端調試
npm run dev  # 在瀏覽器中調試

# 開啟開發者工具
npm run tauri:dev
# 然後按 Cmd/Ctrl + Shift + I

# Rust 後端調試
RUST_LOG=debug npm run tauri:dev
```

### Q: 可以訪問原生 API 嗎？
**A:** 可以！Tauri 提供了豐富的插件：
- 檔案系統
- 對話框
- 通知
- 剪貼簿
- 全局快捷鍵
- HTTP 請求
- WebSocket
- 等等...

### Q: 如何更新應用？
**A:** 使用 Tauri Updater 插件：
```rust
tauri-plugin-updater = "2.0"
```

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 授權

MIT License

## 相關專案

- [Electron + React Todo](../01-electron-react/) - 使用 Electron 和 React
- [Electron + Vue Todo](../02-electron-vue/) - 使用 Electron 和 Vue
- [Tauri + React Todo](../02-tauri-react/) - 使用 Tauri 和 React

---

**為什麼選擇 Tauri + Svelte？**

因為它結合了兩個世界的最佳特性：
- **Tauri** 的輕量、安全和性能
- **Svelte** 的簡潔、高效和優雅

這個組合讓你能夠構建真正快速、小巧且易於維護的桌面應用程式。

**Happy Coding!** 🚀
