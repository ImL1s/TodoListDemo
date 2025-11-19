# 快速開始指南

## 5 分鐘快速上手

### 1️⃣ 檢查環境 (1 分鐘)

```bash
# 檢查 Node.js
node --version  # 應該 >= 18

# 檢查 Rust
rustc --version
cargo --version

# 如果沒有 Rust，快速安裝：
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2️⃣ 安裝依賴 (2 分鐘)

```bash
# 進入目錄
cd 08-desktop/03-tauri-vue

# 安裝 npm 依賴
npm install

# Rust 依賴會在第一次運行時自動安裝
```

### 3️⃣ 啟動開發 (2 分鐘)

```bash
# 啟動開發模式
npm run tauri:dev

# 首次啟動會編譯 Rust，需要等待 1-2 分鐘
# 之後的啟動會很快（< 10 秒）
```

🎉 **完成！** 應用視窗應該已經打開了！

## 🎮 試試這些功能

### 基本操作
1. 在輸入框輸入 "Learn Tauri"，按 Enter
2. 點擊 checkbox 標記為完成
3. 點擊刪除按鈕移除 todo

### 篩選器
1. 點擊 "Active" 查看進行中的任務
2. 點擊 "Completed" 查看已完成的任務
3. 點擊 "All" 返回全部

### 鍵盤快捷鍵
- `Ctrl + N` - 聚焦到輸入框
- `Ctrl + F` - 切換篩選器
- `Ctrl + R` - 重新載入數據

### 視窗控制
1. 點擊標題欄的按鈕：
   - 第一個：最小化
   - 第二個：最大化/還原
   - 第三個（紅色）：關閉

### 系統托盤
1. 關閉視窗後，應用仍在系統托盤運行
2. 點擊托盤圖標重新打開視窗

## 📦 打包應用

```bash
# 構建生產版本
npm run tauri:build

# 等待 2-3 分鐘...
# 完成後查看：
ls -lh src-tauri/target/release/bundle/
```

## 🐛 常見問題

### 問題 1: Rust 編譯錯誤

```bash
# 更新 Rust
rustup update

# 清除並重建
cd src-tauri
cargo clean
cd ..
npm run tauri:dev
```

### 問題 2: 端口已被占用

```bash
# 更改 vite.config.ts 中的端口
server: {
  port: 1421,  // 改成其他端口
}
```

### 問題 3: 系統依賴缺失 (Linux)

```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel openssl-devel
```

## 🎯 下一步

1. 閱讀 [README.md](./README.md) 了解完整功能
2. 查看 [ARCHITECTURE.md](./ARCHITECTURE.md) 理解架構
3. 修改代碼，看看熱重載的效果！

## 💡 開發技巧

### 快速開發循環

```bash
# Terminal 1: 運行開發伺服器
npm run tauri:dev

# Terminal 2: 監視 Rust 代碼
cd src-tauri
cargo watch -x check
```

### 查看 Rust 日誌

```rust
// 在 main.rs 中添加
println!("Debug: {:?}", some_variable);
```

日誌會出現在運行 `npm run tauri:dev` 的終端。

### 查看前端日誌

右鍵視窗 → Inspect → Console

### 熱重載說明

- **Vue 代碼**：自動熱重載，即時更新
- **Rust 代碼**：需要重啟應用（會自動重新編譯）
- **配置文件**：需要重啟開發伺服器

## 🚀 性能優化技巧

### 加速編譯

```toml
# 在 ~/.cargo/config.toml 添加
[build]
jobs = 8  # 使用 8 個並行編譯任務
```

### 使用 mold 連接器 (Linux)

```bash
# 安裝 mold
sudo apt install mold  # Ubuntu
brew install mold      # macOS

# 配置 Cargo
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
```

可以讓編譯速度提升 2-3 倍！

## 📞 需要幫助？

- 查看 [Tauri 文檔](https://v2.tauri.app/)
- 加入 [Tauri Discord](https://discord.com/invite/tauri)
- 查看 [GitHub Issues](https://github.com/tauri-apps/tauri/issues)

---

**享受開發！** 🎉
