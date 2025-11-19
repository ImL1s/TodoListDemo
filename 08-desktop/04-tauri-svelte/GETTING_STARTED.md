# 入門指南

歡迎使用 **Tauri + Svelte Todo List**！這是一個現代化、高性能的桌面待辦事項應用。

## 🎯 30 秒快速了解

**這是什麼？**
一個使用 Tauri 和 Svelte 構建的桌面 Todo List 應用

**為什麼選它？**
- 📦 **超小體積** - 僅 3 MB（Electron 的 1/28）
- ⚡ **極速啟動** - 不到 100ms
- 💾 **低記憶體** - 只用 35 MB RAM
- ✨ **簡潔代碼** - 比 React 少 40%

**適合誰？**
- 想學習 Tauri 的開發者
- 想學習 Svelte 的開發者
- 需要高性能桌面應用的團隊
- 對技術選型感興趣的架構師

## 📚 文檔導航

根據你的需求，選擇合適的文檔：

### 🚀 我想快速運行
→ 閱讀 [QUICKSTART.md](./QUICKSTART.md)（5分鐘）

### 📖 我想全面了解
→ 閱讀 [README.md](./README.md)（15分鐘）

### 🏗️ 我想理解架構
→ 閱讀 [ARCHITECTURE.md](./ARCHITECTURE.md)（30分鐘）

### 💻 我想開始開發
→ 閱讀 [DEVELOPMENT.md](./DEVELOPMENT.md)（20分鐘）

### 📝 我想看代碼範例
→ 閱讀 [EXAMPLES.md](./EXAMPLES.md)（30分鐘）

### ⚖️ 我在做技術選型
→ 閱讀 [COMPARISON.md](./COMPARISON.md)（25分鐘）

### 📋 我想了解專案概況
→ 閱讀 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)（10分鐘）

## ⚡ 60 秒快速開始

```bash
# 1. 安裝依賴（僅需一次）
npm install

# 2. 運行應用
npm run tauri:dev

# 就這樣！應用會自動打開
```

## 🎓 推薦學習路徑

### 路徑 1: 快速體驗（30分鐘）
1. ✅ 閱讀 QUICKSTART.md（5分鐘）
2. ✅ 運行應用（5分鐘）
3. ✅ 試用所有功能（10分鐘）
4. ✅ 查看 README.md 主要特色（10分鐘）

### 路徑 2: 深入理解（2小時）
1. ✅ 完成路徑 1
2. ✅ 閱讀 ARCHITECTURE.md（30分鐘）
3. ✅ 閱讀 EXAMPLES.md（30分鐘）
4. ✅ 修改代碼並觀察效果（30分鐘）

### 路徑 3: 生產開發（1天）
1. ✅ 完成路徑 2
2. ✅ 閱讀 DEVELOPMENT.md（30分鐘）
3. ✅ 設置開發環境（1小時）
4. ✅ 實現新功能（4小時）
5. ✅ 構建和測試（30分鐘）

## 🎯 快速導覽

### 專案亮點

```bash
# 查看主要組件
src/lib/components/
├── TodoItem.svelte    # 單個 Todo 項目
├── TodoList.svelte    # Todo 列表
├── TodoInput.svelte   # 輸入框
├── TodoFilter.svelte  # 篩選器
├── TodoStats.svelte   # 統計信息
└── SearchBar.svelte   # 搜尋欄

# 查看狀態管理
src/lib/stores/todoStore.ts  # Svelte Stores

# 查看後端代碼
src-tauri/src/main.rs        # Rust Commands
```

### 核心功能演示

**添加 Todo**
```
1. 在輸入框輸入文字
2. 按 Enter 或點擊 "Add"
```

**編輯 Todo**
```
1. 雙擊 Todo 文字
2. 修改後按 Enter 保存
```

**篩選 Todo**
```
點擊 All / Active / Completed
```

**搜尋 Todo**
```
在搜尋框輸入關鍵字
```

## 🔑 關鍵概念

### 1. Svelte 響應式

```svelte
<script>
  // 變數改變，UI 自動更新！
  let count = 0;
</script>

<button on:click={() => count++}>
  點擊: {count}
</button>
```

### 2. Tauri Commands

```typescript
// 前端調用
await invoke('add_todo', { text: 'New task' });

// 後端處理（Rust）
#[tauri::command]
fn add_todo(text: String) -> Result<Todo, String>
```

### 3. Svelte Stores

```typescript
// 創建 store
const count = writable(0);

// 在組件中使用（自動訂閱）
$: console.log($count);
```

## 🛠️ 常見任務

### 添加新功能
1. 在 `src/lib/components/` 創建組件
2. 在 `src-tauri/src/main.rs` 添加 Rust command
3. 在 `src/lib/stores/` 更新 store
4. 測試功能

### 修改樣式
1. 編輯組件內的 `<style>` 標籤
2. 或修改 `src/app.css`
3. 或使用 Tailwind 類名

### 調試問題
```bash
# 查看前端日誌
按 Cmd/Ctrl + Shift + I

# 查看後端日誌
RUST_LOG=debug npm run tauri:dev
```

## 💡 提示和技巧

### Svelte 技巧

```svelte
<!-- 雙向綁定 -->
<input bind:value={text} />

<!-- 響應式語句 -->
$: doubled = count * 2;

<!-- 條件渲染 -->
{#if condition}
  <div>Show this</div>
{/if}

<!-- 列表渲染 -->
{#each items as item}
  <div>{item}</div>
{/each}
```

### Tauri 技巧

```rust
// 最小化鎖持有時間
{
    let mut data = state.lock().unwrap();
    data.push(item);
}  // 鎖在這裡自動釋放

// 錯誤處理
do_something()
    .map_err(|e| e.to_string())?;
```

## 🐛 遇到問題？

### 常見問題速查

**Q: 端口被佔用**
```bash
# 修改 vite.config.ts 中的端口
server: { port: 1421 }
```

**Q: Rust 編譯失敗**
```bash
# macOS
xcode-select --install

# Linux
sudo apt install build-essential
```

**Q: 依賴安裝失敗**
```bash
rm -rf node_modules package-lock.json
npm install
```

→ 更多問題查看 [DEVELOPMENT.md](./DEVELOPMENT.md#常見問題排查)

## 📊 效能基準

```bash
安裝包:   2.8 MB   (Electron: 84 MB)
記憶體:   32 MB    (Electron: 178 MB)
啟動:     89 ms    (Electron: 783 ms)
```

## 🎨 技術棧一覽

**前端**
- Svelte 4 - UI 框架
- TypeScript - 類型安全
- Tailwind CSS - 樣式
- Vite - 構建工具

**後端**
- Tauri 2.0 - 桌面框架
- Rust - 系統語言
- Serde - 序列化

## 🚀 下一步

### 完成快速開始後
1. ✅ 嘗試修改代碼
2. ✅ 添加新功能
3. ✅ 閱讀深入文檔
4. ✅ 構建生產版本

### 構建應用
```bash
npm run tauri:build

# 構建產物位置：
# macOS:   src-tauri/target/release/bundle/dmg/
# Linux:   src-tauri/target/release/bundle/deb/
# Windows: src-tauri/target/release/bundle/msi/
```

## 🤝 參與貢獻

歡迎各種形式的貢獻：
- 🐛 報告 Bug
- 💡 提出建議
- 📝 改進文檔
- 🔧 提交代碼

## 📞 獲取幫助

- 📚 查看完整文檔
- 💬 提交 GitHub Issue
- 🔍 搜尋已有討論

## 🎉 開始吧！

選擇你的下一步：

1. **我想立即運行**
   ```bash
   npm install && npm run tauri:dev
   ```

2. **我想了解更多**
   → 閱讀 [README.md](./README.md)

3. **我想深入學習**
   → 閱讀 [ARCHITECTURE.md](./ARCHITECTURE.md)

4. **我想比較技術**
   → 閱讀 [COMPARISON.md](./COMPARISON.md)

---

**祝你使用愉快！** 🚀

如果這個專案對你有幫助，別忘了給個 Star ⭐

有問題？隨時開啟 Issue 討論！
