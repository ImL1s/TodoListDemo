# 快速開始指南

5 分鐘內運行 Tauri + Svelte Todo 應用！

## 最小安裝步驟

### 1️⃣ 檢查前置條件

```bash
# 檢查 Node.js（需要 v18+）
node --version

# 檢查 Rust（需要最新穩定版）
rustc --version

# 如果沒有安裝：
# Node.js: https://nodejs.org/
# Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2️⃣ 安裝系統依賴

<details>
<summary><b>macOS</b></summary>

```bash
xcode-select --install
```

</details>

<details>
<summary><b>Linux (Ubuntu/Debian)</b></summary>

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

</details>

<details>
<summary><b>Windows</b></summary>

1. 安裝 [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. 安裝 [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)

</details>

### 3️⃣ 安裝專案依賴

```bash
cd 08-desktop/04-tauri-svelte
npm install
```

### 4️⃣ 運行應用

```bash
npm run tauri:dev
```

就這樣！應用應該會在幾秒鐘內啟動。🎉

## 首次運行

首次運行時，Rust 會編譯所有依賴，這可能需要 3-5 分鐘。之後的啟動會快得多（< 10 秒）。

```bash
# 首次運行（慢）
npm run tauri:dev  # 3-5 分鐘

# 後續運行（快）
npm run tauri:dev  # 5-10 秒
```

## 基本使用

### 添加 Todo
1. 在輸入框中輸入任務
2. 按 Enter 或點擊 "Add" 按鈕

### 編輯 Todo
- 雙擊 Todo 文本
- 或點擊 "Edit" 按鈕
- 修改後按 Enter 保存，Esc 取消

### 完成 Todo
- 點擊 Todo 前面的複選框

### 刪除 Todo
- 點擊 "Delete" 按鈕

### 篩選 Todo
- 點擊 "All" / "Active" / "Completed" 按鈕

### 搜尋 Todo
- 在搜尋框中輸入關鍵字

### 清除已完成
- 當有已完成的 Todo 時，點擊 "Clear Completed"

## 鍵盤快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Cmd/Ctrl + N` | 聚焦新 Todo 輸入框 |
| `Cmd/Ctrl + F` | 聚焦搜尋框 |
| `Cmd/Ctrl + R` | 重新載入 Todos |
| `Cmd/Ctrl + W` | 關閉視窗 |
| `Cmd/Ctrl + M` | 最小化到系統托盤 |
| `Enter` | 保存 Todo（編輯時） |
| `Esc` | 取消編輯 |

## 數據存儲

你的 Todos 會自動保存在：

- **macOS**: `~/Library/Application Support/com.tauri-svelte.todo/todos.json`
- **Linux**: `~/.config/tauri-svelte-todo/todos.json`
- **Windows**: `C:\Users\<你的用戶名>\AppData\Roaming\tauri-svelte-todo\todos.json`

即使關閉應用，數據也會保留！

## 系統托盤

應用支援系統托盤功能：

1. 點擊托盤圖標顯示選單
2. "Show Window" - 顯示主視窗
3. "New Todo" - 顯示視窗並聚焦輸入框
4. "Quit" - 退出應用

或者直接點擊托盤圖標（左鍵）快速顯示視窗。

## 開發模式 vs 生產模式

### 開發模式
```bash
npm run tauri:dev

特點：
- 熱重載 (HMR)
- 開發者工具可用
- 詳細的錯誤訊息
- 未壓縮的代碼
```

### 生產模式
```bash
npm run tauri:build

特點：
- 優化的代碼
- 最小化的包大小
- 生成獨立的安裝包
- 最佳性能
```

## 構建安裝包

```bash
# 構建生產版本
npm run tauri:build

# 構建產物位置：
# macOS:   src-tauri/target/release/bundle/dmg/
# Linux:   src-tauri/target/release/bundle/deb/ 或 appimage/
# Windows: src-tauri/target/release/bundle/msi/
```

首次構建可能需要 5-10 分鐘。

## 故障排除

### 問題：端口被佔用

```bash
Error: Port 1420 is already in use
```

**解決方案:**
```bash
# 查找佔用端口的進程
lsof -i :1420          # macOS/Linux
netstat -ano | findstr :1420  # Windows

# 或修改端口（vite.config.ts）
server: {
  port: 1421,  // 改為其他端口
}
```

### 問題：WebView 錯誤

```bash
Error: Failed to load WebView
```

**解決方案:**

**macOS:** 更新系統到最新版本

**Linux:**
```bash
sudo apt install libwebkit2gtk-4.1-dev
```

**Windows:** 安裝 [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)

### 問題：Rust 編譯錯誤

```bash
error: linking with `cc` failed
```

**解決方案:**

**macOS:**
```bash
xcode-select --install
```

**Linux:**
```bash
sudo apt install build-essential
```

**Windows:** 安裝 [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

### 問題：依賴安裝失敗

```bash
npm ERR! code ELIFECYCLE
```

**解決方案:**
```bash
# 清除緩存
npm cache clean --force

# 刪除並重新安裝
rm -rf node_modules package-lock.json
npm install
```

## 常用命令速查

```bash
# 開發
npm run dev           # 只啟動前端
npm run tauri:dev     # 啟動完整應用

# 構建
npm run build         # 構建前端
npm run tauri:build   # 構建完整應用

# 檢查
npm run check         # TypeScript 類型檢查
cd src-tauri && cargo check  # Rust 檢查
cd src-tauri && cargo clippy # Rust lint

# 格式化
cd src-tauri && cargo fmt    # Rust 格式化
```

## 下一步

現在你已經運行了應用，可以：

1. 📚 閱讀 [README.md](./README.md) 了解完整功能
2. 🏗️ 查看 [ARCHITECTURE.md](./ARCHITECTURE.md) 理解架構
3. 💻 參考 [DEVELOPMENT.md](./DEVELOPMENT.md) 開始開發
4. 📖 瀏覽 [EXAMPLES.md](./EXAMPLES.md) 學習範例

## 需要幫助？

- 📝 查看文檔
- 🐛 報告 Bug
- 💡 提出功能建議
- 💬 加入社群討論

## 核心特性速覽

### Svelte 的簡潔性
```svelte
<!-- React 需要 10+ 行 -->
<!-- Vue 需要 8+ 行 -->
<!-- Svelte 只需要 3 行！-->
<script>
  let count = 0;
</script>
<button on:click={() => count++}>{count}</button>
```

### Tauri 的性能
```bash
# 安裝包大小比較
Electron + React:  ~85 MB  ❌
Tauri + React:     ~4 MB   ✅
Tauri + Svelte:    ~3 MB   ✨ 最小！

# 記憶體使用
Electron:  ~180 MB  ❌
Tauri:     ~35 MB   ✅ 少 5 倍！
```

---

**享受構建桌面應用的樂趣！** 🚀

有問題嗎？查看其他文檔或開啟 issue。
