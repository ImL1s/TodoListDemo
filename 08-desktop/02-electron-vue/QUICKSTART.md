# 快速入門指南

## 5 分鐘快速上手

### 第 1 步：安裝依賴（1 分鐘）

```bash
cd 08-desktop/02-electron-vue
npm install
```

### 第 2 步：啟動開發伺服器（1 分鐘）

```bash
npm run dev
```

應用程式會自動啟動並打開 DevTools。

### 第 3 步：探索功能（3 分鐘）

#### 基本操作
1. **添加待辦事項**: 在輸入框輸入文字，按 Enter
2. **完成待辦事項**: 點擊複選框
3. **編輯待辦事項**: 雙擊待辦事項文字
4. **刪除待辦事項**: 點擊紅色垃圾桶圖標

#### 快捷鍵
- `Cmd/Ctrl + N`: 聚焦輸入框
- `Cmd/Ctrl + F`: 聚焦搜索
- `Cmd/Ctrl + Shift + T`: 隱藏/顯示視窗

#### 篩選功能
點擊底部的 All / Active / Completed 按鈕

#### 系統托盤
- 關閉視窗後，應用在托盤中繼續運行
- 雙擊托盤圖標恢復視窗
- 右鍵托盤圖標查看快捷菜單

#### 原生選單
- **File**: 新增待辦、清除已完成
- **View**: 切換篩選、開發者工具、縮放

## 專案結構一覽

```
02-electron-vue/
├── electron/           # Electron 主進程代碼
│   ├── main.ts        # 入口點，視窗管理
│   ├── preload.ts     # 安全橋接
│   ├── menu.ts        # 應用選單
│   └── tray.ts        # 系統托盤
├── src/               # Vue 應用代碼
│   ├── components/    # Vue 組件
│   ├── composables/   # 可復用邏輯
│   ├── types/         # TypeScript 類型
│   └── App.vue        # 根組件
└── package.json       # 項目配置
```

## 常用命令

```bash
# 開發
npm run dev              # 啟動開發伺服器

# 構建
npm run build           # 構建所有平台
npm run build:win       # 只構建 Windows
npm run build:mac       # 只構建 macOS
npm run build:linux     # 只構建 Linux
npm run build:dir       # 構建但不打包（查看輸出）

# 檢查
npm run type-check      # TypeScript 類型檢查
```

## 數據存儲位置

你的待辦事項保存在：

**Windows**: `C:\Users\<用戶名>\AppData\Roaming\electron-vue-todo\todos.json`

**macOS**: `/Users/<用戶名>/Library/Application Support/electron-vue-todo/todos.json`

**Linux**: `/home/<用戶名>/.config/electron-vue-todo/todos.json`

## 修改和擴展

### 添加新功能

1. **業務邏輯**: 編輯 `src/composables/useTodos.ts`
2. **UI 組件**: 添加到 `src/components/`
3. **Electron 功能**: 修改 `electron/main.ts`

### 自定義樣式

- **全局樣式**: `src/App.vue` 的 `<style>` 部分
- **組件樣式**: 各組件的 `<style scoped>` 部分

### 添加快捷鍵

在 `electron/main.ts` 的 `registerShortcuts()` 函數中添加：

```typescript
globalShortcut.register('CommandOrControl+X', () => {
  // 你的代碼
})
```

## 疑難排解

### 應用無法啟動

1. 確保 Node.js 版本 >= 16
2. 刪除 `node_modules` 和 `package-lock.json`，重新安裝
3. 檢查是否有埠衝突（5173）

### 修改未生效

1. 確保使用 `npm run dev`（有 HMR）
2. 主進程修改需要重啟應用
3. 清除緩存：關閉應用，刪除用戶數據目錄

### 打包失敗

1. 確保有足夠的磁盤空間
2. 檢查 `electron-builder` 配置
3. 查看錯誤日誌

## 下一步

- 閱讀 [README.md](./README.md) 了解詳細架構
- 查看 [FEATURES.md](./FEATURES.md) 探索所有功能
- 訪問 [Vue 3 文檔](https://vuejs.org/) 學習更多
- 訪問 [Electron 文檔](https://www.electronjs.org/) 深入了解

## 獲得幫助

- 查看 [常見問題](./README.md#常見問題)
- 閱讀源代碼註釋
- 搜索相關文檔
- 加入社區討論

祝你開發愉快！🚀
