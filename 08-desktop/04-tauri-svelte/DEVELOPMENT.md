# 開發指南

## 開發環境設置

### 1. 系統需求

**必需:**
- Node.js 18+
- Rust 1.70+
- 系統原生依賴（見下方）

**推薦:**
- VS Code 或其他現代編輯器
- Rust Analyzer 擴展
- Svelte for VS Code 擴展

### 2. 系統依賴安裝

#### macOS
```bash
# 安裝 Xcode Command Line Tools
xcode-select --install

# 驗證安裝
gcc --version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# 驗證安裝
pkg-config --modversion webkit2gtk-4.1
```

#### Windows
```bash
# 使用 PowerShell (管理員權限)

# 1. 安裝 Visual Studio Build Tools
# 下載並安裝: https://visualstudio.microsoft.com/downloads/
# 選擇 "Desktop development with C++"

# 2. 安裝 WebView2
# 下載並安裝: https://developer.microsoft.com/microsoft-edge/webview2/
```

### 3. Rust 安裝

```bash
# 安裝 rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 重新載入環境變數
source $HOME/.cargo/env

# 驗證安裝
rustc --version
cargo --version

# 更新到最新版本
rustup update
```

### 4. Node.js 安裝

```bash
# 使用 nvm (推薦)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 或直接從官網下載
# https://nodejs.org/

# 驗證安裝
node --version  # v18.0.0+
npm --version   # 9.0.0+
```

## 開發流程

### 首次設置

```bash
# 1. Clone 專案（如果從 git）
git clone <repository-url>
cd 08-desktop/04-tauri-svelte

# 2. 安裝 Node.js 依賴
npm install

# 3. Rust 依賴會在首次運行時自動安裝
npm run tauri:dev
```

### 日常開發

```bash
# 啟動開發服務器（推薦）
npm run tauri:dev

# 這會同時啟動：
# - Vite 開發服務器 (http://localhost:1420)
# - Tauri 應用視窗
# - 熱重載 (HMR)
```

### 分離前後端開發

```bash
# 終端 1: 只運行前端
npm run dev

# 終端 2: 只運行 Tauri
cd src-tauri
cargo run

# 或
npm run tauri dev
```

## 代碼結構規範

### Svelte 組件結構

```svelte
<!-- Component.svelte -->

<!-- 1. Script 區塊 -->
<script lang="ts">
  // 導入
  import { onMount } from 'svelte';
  import type { Todo } from '../types/Todo';

  // 導出的 props
  export let todo: Todo;
  export let onDelete: (id: string) => void;

  // 本地狀態
  let isEditing = false;
  let text = todo.text;

  // 響應式語句
  $: isCompleted = todo.completed;

  // 函數
  function handleEdit() {
    isEditing = true;
  }

  // 生命週期
  onMount(() => {
    // 組件掛載時執行
  });
</script>

<!-- 2. 標記區塊 -->
<div class="component">
  {#if isEditing}
    <input bind:value={text} />
  {:else}
    <span on:click={handleEdit}>{text}</span>
  {/if}
</div>

<!-- 3. 樣式區塊 -->
<style>
  .component {
    /* 組件專屬樣式（scoped） */
    @apply p-4 rounded;
  }
</style>
```

### TypeScript 類型定義

```typescript
// types/Todo.ts

// 導出所有類型
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';

// 使用類型守衛
export function isTodo(obj: any): obj is Todo {
  return (
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.completed === 'boolean'
  );
}
```

### Rust 代碼規範

```rust
// main.rs

// 1. 使用標準格式化
// 運行: cargo fmt

// 2. 遵循 Clippy 建議
// 運行: cargo clippy

// 3. Command 函數結構
#[tauri::command]
fn command_name(
    arg1: Type1,
    arg2: Type2,
    state: State<AppState>,
) -> Result<ReturnType, String> {
    // 1. 參數驗證
    if arg1.is_empty() {
        return Err("Invalid argument".to_string());
    }

    // 2. 業務邏輯
    let result = do_something(arg1, arg2);

    // 3. 狀態更新
    {
        let mut state = state.lock().unwrap();
        state.update(result);
    }  // 立即釋放鎖

    // 4. 持久化
    state.save_to_file()
        .map_err(|e| e.to_string())?;

    // 5. 返回結果
    Ok(result)
}
```

## 常用開發命令

### 前端

```bash
# 類型檢查
npm run check

# 構建前端
npm run build

# 預覽生產構建
npm run preview

# Lint
npm run lint  # 如果配置了

# 格式化
npm run format  # 如果配置了
```

### 後端

```bash
cd src-tauri

# 檢查代碼
cargo check

# 運行測試
cargo test

# 格式化代碼
cargo fmt

# Lint 檢查
cargo clippy

# 構建 release
cargo build --release
```

### Tauri

```bash
# 開發模式
npm run tauri:dev

# 構建應用
npm run tauri:build

# 查看 Tauri 信息
npm run tauri info

# 生成圖標
npm run tauri icon path/to/icon.png
```

## 調試技巧

### 前端調試

#### 1. 瀏覽器開發者工具

```bash
# 在 Tauri 應用中打開
按 Cmd/Ctrl + Shift + I

# 或在開發時在瀏覽器中打開
http://localhost:1420
```

#### 2. Console 日誌

```typescript
// 在 Svelte 組件中
console.log('Debug:', $todos);

// 響應式調試
$: console.log('Filter changed:', $currentFilter);
```

#### 3. Svelte DevTools

```bash
# 安裝瀏覽器擴展
# Chrome: Svelte DevTools
# Firefox: Svelte DevTools
```

### 後端調試

#### 1. Rust 日誌

```rust
// 使用 println!
println!("Debug: {:?}", todos);

// 使用 dbg! macro
let result = dbg!(some_value);

// 使用 log crate
log::debug!("Debug message");
```

#### 2. 啟用 Rust 日誌

```bash
# 設置環境變數
RUST_LOG=debug npm run tauri:dev

# 更詳細的日誌
RUST_LOG=trace npm run tauri:dev

# 針對特定模組
RUST_LOG=tauri_svelte_todo=debug npm run tauri:dev
```

#### 3. VS Code 調試

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug Tauri",
      "cargo": {
        "args": [
          "build",
          "--manifest-path=./src-tauri/Cargo.toml"
        ]
      }
    }
  ]
}
```

### IPC 調試

```typescript
// 捕獲所有 invoke 錯誤
import { invoke } from '@tauri-apps/api/core';

async function debugInvoke<T>(cmd: string, args?: any): Promise<T> {
  console.log('Invoking:', cmd, args);
  try {
    const result = await invoke<T>(cmd, args);
    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Error:', cmd, error);
    throw error;
  }
}
```

## 常見問題排查

### 1. 編譯錯誤

**問題:** Rust 編譯失敗
```bash
error: linking with `cc` failed
```

**解決:**
```bash
# macOS
xcode-select --install

# Linux
sudo apt install build-essential

# Windows
# 重新安裝 Visual Studio Build Tools
```

**問題:** Node.js 依賴安裝失敗
```bash
npm ERR! code ELIFECYCLE
```

**解決:**
```bash
# 清除緩存
npm cache clean --force

# 刪除 node_modules
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

### 2. 運行時錯誤

**問題:** WebView 無法加載
```
Failed to load URL: http://localhost:1420
```

**解決:**
```bash
# 1. 確認 Vite 運行正常
npm run dev

# 2. 檢查端口是否被佔用
lsof -i :1420  # macOS/Linux
netstat -ano | findstr :1420  # Windows

# 3. 修改端口（vite.config.ts）
server: {
  port: 1421,  // 使用其他端口
}
```

**問題:** Tauri Command 未找到
```
Error: Unknown command: get_todos
```

**解決:**
```rust
// 確認已在 main.rs 中註冊
.invoke_handler(tauri::generate_handler![
    get_todos,  // 必須包含此命令
])
```

### 3. 開發工具問題

**問題:** TypeScript 類型錯誤

```bash
# 重新生成類型
npm run check

# 重啟 VS Code TypeScript 服務器
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

**問題:** Svelte 語法高亮失效

```bash
# 安裝 Svelte 擴展
# VS Code: svelte.svelte-vscode

# 重新載入窗口
# Cmd/Ctrl + Shift + P -> "Reload Window"
```

## 性能分析

### 前端性能

```typescript
// 使用 Performance API
console.time('render');
// ... 代碼
console.timeEnd('render');

// 測量組件渲染
import { tick } from 'svelte';

async function measureRender() {
  const start = performance.now();
  await tick();  // 等待 DOM 更新
  const end = performance.now();
  console.log(`Render time: ${end - start}ms`);
}
```

### 後端性能

```rust
use std::time::Instant;

#[tauri::command]
fn slow_command() -> Result<(), String> {
    let start = Instant::now();

    // ... 執行操作

    let duration = start.elapsed();
    println!("Command took: {:?}", duration);

    Ok(())
}
```

## Git 工作流

### 分支策略

```bash
# 主分支
main          # 生產環境
develop       # 開發環境

# 功能分支
feature/todo-tags
feature/dark-theme

# 修復分支
fix/edit-bug
hotfix/crash-on-startup
```

### Commit 訊息規範

```bash
# 格式: <type>(<scope>): <subject>

# 類型
feat:     新功能
fix:      Bug 修復
docs:     文檔更新
style:    代碼格式（不影響功能）
refactor: 重構
perf:     性能優化
test:     測試
chore:    構建/工具鏈

# 範例
feat(ui): add dark mode toggle
fix(store): prevent duplicate todos
docs(readme): update installation steps
refactor(rust): simplify state management
```

## 測試

### 單元測試（Rust）

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_todo() {
        let todo = Todo {
            id: "1".to_string(),
            text: "Test".to_string(),
            completed: false,
            created_at: 0,
            updated_at: 0,
        };

        assert_eq!(todo.text, "Test");
        assert!(!todo.completed);
    }
}

// 運行測試
// cargo test
```

### 組件測試（Svelte）

```typescript
// 安裝測試庫
npm install -D @testing-library/svelte vitest

// TodoItem.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TodoItem from './TodoItem.svelte';

describe('TodoItem', () => {
  it('renders todo text', () => {
    const todo = {
      id: '1',
      text: 'Test Todo',
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const { getByText } = render(TodoItem, { todo });
    expect(getByText('Test Todo')).toBeInTheDocument();
  });

  it('toggles completion', async () => {
    const { getByRole } = render(TodoItem, { todo });
    const checkbox = getByRole('checkbox');

    await fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
```

## 代碼審查清單

### 提交前檢查

- [ ] 代碼已格式化（`cargo fmt`, `npm run format`）
- [ ] 通過 Lint 檢查（`cargo clippy`）
- [ ] 通過類型檢查（`npm run check`）
- [ ] 所有測試通過（`cargo test`, `npm test`）
- [ ] 沒有 console.log（除非必要）
- [ ] 錯誤處理完善
- [ ] 添加了必要的註釋
- [ ] 更新了相關文檔

### PR 檢查

- [ ] 有清晰的 PR 描述
- [ ] 包含必要的截圖/GIF
- [ ] 更新了 CHANGELOG
- [ ] 沒有合併衝突
- [ ] CI 通過
- [ ] 至少一個審查通過

## 發布流程

### 版本號規範

使用語意化版本：`MAJOR.MINOR.PATCH`

```bash
# 主版本（不兼容的 API 更改）
1.0.0 -> 2.0.0

# 次版本（新增功能，向後兼容）
1.0.0 -> 1.1.0

# 修訂版本（Bug 修復）
1.0.0 -> 1.0.1
```

### 發布步驟

```bash
# 1. 更新版本號
# package.json
# src-tauri/Cargo.toml
# src-tauri/tauri.conf.json

# 2. 更新 CHANGELOG
# 記錄所有變更

# 3. 提交變更
git add .
git commit -m "chore: bump version to v1.0.0"
git tag v1.0.0

# 4. 構建應用
npm run tauri:build

# 5. 測試構建產物
# 安裝並測試應用

# 6. 推送
git push origin main
git push origin v1.0.0

# 7. 創建 GitHub Release
# 上傳構建產物
```

## 資源鏈接

### 文檔
- [Svelte 官方文檔](https://svelte.dev/docs)
- [Tauri 官方文檔](https://tauri.app/v1/guides/)
- [Rust Book](https://doc.rust-lang.org/book/)

### 工具
- [Svelte REPL](https://svelte.dev/repl)
- [Rust Playground](https://play.rust-lang.org/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### 社群
- [Svelte Discord](https://discord.com/invite/svelte)
- [Tauri Discord](https://discord.com/invite/tauri)
- [Rust Users Forum](https://users.rust-lang.org/)

---

祝開發愉快！🚀
