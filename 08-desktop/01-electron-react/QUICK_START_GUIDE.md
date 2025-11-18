# Electron + React Todo List - 快速開始指南

## 專案概覽

這是一個功能完整的 Electron 桌面應用程式，展示了所有要求的 Electron 特性和最佳實踐。

## 已實現的所有功能 ✅

### 1. 核心技術棧
- ✅ **Electron 28** - 最新穩定版
- ✅ **React 18** - 使用 Hooks
- ✅ **TypeScript 5.2** - 完整的類型安全
- ✅ **Vite 5** - 極速開發體驗

### 2. Todo 功能
- ✅ **新增** - 添加新的待辦事項
- ✅ **編輯** - 雙擊編輯，Enter 保存，Esc 取消
- ✅ **刪除** - 刪除待辦事項
- ✅ **完成/取消完成** - 切換完成狀態
- ✅ **篩選** - All / Active / Completed 三種視圖
- ✅ **清除已完成** - 批量清除已完成項目
- ✅ **統計資訊** - 實時顯示總數、活動、已完成數量

### 3. Electron 桌面特性
- ✅ **檔案系統持久化** - 使用 `electron-store` 本地存儲
- ✅ **系統托盤** - 最小化到托盤，右鍵菜單
- ✅ **原生選單** - 完整的應用菜單（File, Edit, View, Window, Help）
- ✅ **鍵盤快捷鍵**:
  - `Ctrl+N` (⌘N) - 新建 Todo
  - `Ctrl+Shift+C` - 清除已完成
  - `Ctrl+Q` (⌘Q) - 退出應用
  - 更多快捷鍵在菜單中

### 4. Electron 最佳實踐
- ✅ **進程分離** - 主進程 (`electron/main.ts`) 和渲染進程 (`src/`) 完全分離
- ✅ **安全 IPC** - 使用 `ipcMain.handle` 和 `ipcRenderer.invoke`
- ✅ **Context Bridge** - 通過 `contextBridge` 安全暴露 API
- ✅ **Preload Script** - 預加載腳本作為安全橋樑
- ✅ **安全設置**:
  - `contextIsolation: true`
  - `nodeIntegration: false`
  - CSP 配置
- ✅ **打包配置** - electron-builder 支持 Windows/macOS/Linux

## 快速開始

### 環境要求
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 安裝依賴
```bash
cd /home/user/TodoListDemo/08-desktop/01-electron-react
npm install
```

### 開發模式
```bash
# 方式 1: 自動啟動 Vite + Electron
npm run electron:dev

# 方式 2: 分別啟動
npm run dev          # 終端 1: 啟動 Vite 開發服務器
npm run electron .   # 終端 2: 啟動 Electron
```

開發模式特性：
- ⚡ Vite 熱模塊替換 (HMR)
- 🔄 修改主進程代碼自動重啟
- 🛠️ 自動打開 DevTools
- 📝 Source Maps 支持

### 構建和打包

#### 構建 Web 資源
```bash
npm run build:web
# 輸出到 dist/ 目錄
```

#### 打包桌面應用

**Windows:**
```bash
npm run build:win
# 產物: release/1.0.0/electron-react-todo-1.0.0.exe
# 包含: NSIS 安裝程序 + 便攜版
```

**macOS:**
```bash
npm run build:mac
# 產物: release/1.0.0/electron-react-todo-1.0.0.dmg
# 支持: Intel + Apple Silicon (Universal Binary)
```

**Linux:**
```bash
npm run build:linux
# 產物:
# - electron-react-todo-1.0.0.AppImage
# - electron-react-todo-1.0.0.deb
# - electron-react-todo-1.0.0.rpm
```

## 專案結構詳解

```
08-desktop/01-electron-react/
├── electron/                    # Electron 主進程
│   ├── main.ts                 # 主進程入口
│   │   ├── 窗口創建 (createWindow)
│   │   ├── 應用菜單 (createMenu)
│   │   ├── 系統托盤 (createTray)
│   │   ├── IPC 處理器 (ipcMain.handle)
│   │   └── 生命周期管理
│   └── preload.ts              # 預加載腳本
│       ├── contextBridge API 暴露
│       ├── IPC 封裝
│       └── 加載動畫
│
├── src/                         # React 渲染進程
│   ├── components/
│   │   ├── TodoInput.tsx       # 輸入組件 (forwardRef)
│   │   ├── TodoList.tsx        # 列表組件
│   │   └── TodoItem.tsx        # 項目組件 (編輯、刪除)
│   ├── App.tsx                 # 主應用組件
│   ├── main.tsx                # React 入口
│   └── electron.d.ts           # TypeScript 類型定義
│
├── vite.config.ts              # Vite + Electron 配置
├── package.json                # 依賴和打包配置
├── tsconfig.json               # TypeScript 配置
└── README.md                   # 完整文檔 (1800+ 行)
```

## IPC 通訊架構

### 流程圖
```
┌──────────────┐                    ┌──────────────┐
│   Renderer   │                    │     Main     │
│   Process    │                    │   Process    │
├──────────────┤                    ├──────────────┤
│              │                    │              │
│ React App    │──invoke('xxx')───►│ ipcMain      │
│ (App.tsx)    │                    │ .handle()    │
│              │◄────Promise────────│ (main.ts)    │
│              │                    │              │
│              │                    │  electron-   │
│              │                    │  store       │
└──────────────┘                    └──────────────┘
       ▲                                    │
       │                                    │
       └────────contextBridge───────────────┘
                (preload.ts)
```

### 實現示例

**1. 渲染進程調用 (App.tsx)**
```typescript
const handleAddTodo = async (text: string) => {
  const newTodo = await window.electronAPI.addTodo(text);
  setTodos(prev => [...prev, newTodo]);
};
```

**2. Preload 暴露 API (preload.ts)**
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  addTodo: (text: string) => ipcRenderer.invoke('add-todo', text),
});
```

**3. 主進程處理 (main.ts)**
```typescript
ipcMain.handle('add-todo', async (_, text: string) => {
  const newTodo = { id: Date.now().toString(), text, ... };
  store.set('todos', [...todos, newTodo]);
  return newTodo;
});
```

## 核心功能代碼位置

### 1. 數據持久化
**文件**: `electron/main.ts` (第 15-19 行)
```typescript
const store = new Store<TodoStore>({
  defaults: { todos: [] }
});
```

### 2. 系統托盤
**文件**: `electron/main.ts` (第 204-246 行)
```typescript
function createTray() {
  tray = new Tray(icon);
  // 右鍵菜單
  // 點擊顯示/隱藏
}
```

### 3. 原生選單
**文件**: `electron/main.ts` (第 101-202 行)
```typescript
function createMenu() {
  const template = [
    { label: 'File', submenu: [...] },
    { label: 'Edit', submenu: [...] },
    // ...
  ];
}
```

### 4. 鍵盤快捷鍵
**文件**: `electron/main.ts` (第 108-111 行)
```typescript
{
  label: 'New Todo',
  accelerator: 'CmdOrCtrl+N',
  click: () => win?.webContents.send('menu-new-todo')
}
```

### 5. CRUD 操作
**文件**: `electron/main.ts` (第 272-373 行)
- `get-todos` - 獲取所有待辦
- `add-todo` - 添加新待辦
- `toggle-todo` - 切換完成狀態
- `delete-todo` - 刪除待辦
- `update-todo` - 更新文本
- `clear-completed` - 清除已完成
- `get-stats` - 獲取統計

## 使用技巧

### 開發調試

**1. 打開 DevTools**
- 開發模式自動打開
- 或按 `Ctrl+Shift+I` (⌘+Option+I)

**2. 查看數據文件**
```bash
# Windows
%APPDATA%\electron-react-todo\config.json

# macOS
~/Library/Application Support/electron-react-todo/config.json

# Linux
~/.config/electron-react-todo/config.json
```

**3. 重新加載應用**
- 菜單: View → Reload
- 快捷鍵: `Ctrl+R` (⌘R)

### 常見操作

**添加 Todo:**
1. 在輸入框輸入文本
2. 按 Enter 或點擊箭頭按鈕
3. 或使用快捷鍵 `Ctrl+N`

**編輯 Todo:**
1. 雙擊待辦項目
2. 修改文本
3. 按 Enter 保存，Esc 取消

**篩選 Todo:**
- 點擊 All / Active / Completed 按鈕

**清除已完成:**
1. 點擊底部 "Clear Completed" 按鈕
2. 或使用快捷鍵 `Ctrl+Shift+C`

## 安全性特性

### 已實現的安全措施

1. **Context Isolation** ✅
   ```typescript
   contextIsolation: true  // 隔離渲染進程
   ```

2. **禁用 Node Integration** ✅
   ```typescript
   nodeIntegration: false  // 渲染進程無法直接使用 Node.js
   ```

3. **Context Bridge** ✅
   ```typescript
   contextBridge.exposeInMainWorld(...)  // 安全 API 暴露
   ```

4. **輸入驗證** ✅
   ```typescript
   if (typeof text !== 'string') throw new Error(...)
   ```

5. **外部鏈接處理** ✅
   ```typescript
   win.webContents.setWindowOpenHandler(...)
   ```

## 性能優化

### 已實現的優化

1. **窗口緩存** - 關閉時隱藏而非銷毀
2. **React.memo** - 避免不必要的重渲染
3. **批量 IPC** - 減少進程間通訊次數
4. **加載動畫** - 優雅的啟動體驗

## 擴展功能 (可選實現)

專案已經包含了所有必需功能。如果需要，可以添加：

### 自動更新
```bash
npm install electron-updater
```

### 原生通知
```typescript
new Notification('Todo Completed', {
  body: 'You completed a task!'
});
```

### 全局快捷鍵
```typescript
globalShortcut.register('CommandOrControl+Shift+T', () => {
  win.show();
});
```

## 學習資源

### 官方文檔
- [Electron 官方文檔](https://www.electronjs.org/docs)
- [Electron 安全指南](https://www.electronjs.org/docs/latest/tutorial/security)
- [IPC 通訊教程](https://www.electronjs.org/docs/latest/tutorial/ipc)

### 本專案特色
- 完整的 TypeScript 類型支持
- 符合 Electron 安全最佳實踐
- 清晰的代碼結構和註釋
- 詳細的 README 文檔

## 常見問題

**Q: 如何修改窗口大小？**
A: 編輯 `electron/main.ts` 第 42-43 行:
```typescript
width: 900,   // 修改寬度
height: 700,  // 修改高度
```

**Q: 如何修改應用圖標？**
A: 將圖標文件放在 `build/` 目錄:
- Windows: `build/icon.ico`
- macOS: `build/icon.icns`
- Linux: `build/icon.png`

**Q: 數據存儲在哪裡？**
A: electron-store 自動管理，位置因平台而異（見上文）

**Q: 如何禁用托盤功能？**
A: 註釋掉 `electron/main.ts` 第 266 行:
```typescript
// createTray();  // 禁用托盤
```

## 下一步

1. ✅ 專案已完全實現所有要求的功能
2. 📚 閱讀完整的 README.md 了解更多細節
3. 🚀 運行 `npm run electron:dev` 開始開發
4. 📦 使用 `npm run build:win/mac/linux` 打包應用

## 技術亮點總結

### Electron 特性展示
- ✅ 多進程架構 (主進程 + 渲染進程)
- ✅ 安全的 IPC 通訊
- ✅ Context Bridge 隔離
- ✅ 原生桌面功能 (菜單、托盤、快捷鍵)
- ✅ 本地文件系統訪問
- ✅ 跨平台打包

### 代碼質量
- ✅ 100% TypeScript
- ✅ 清晰的代碼結構
- ✅ 完整的類型定義
- ✅ 詳細的註釋
- ✅ 錯誤處理

### 用戶體驗
- ✅ 精美的 UI 設計
- ✅ 流暢的動畫效果
- ✅ 響應式佈局
- ✅ 鍵盤快捷鍵支持
- ✅ 實時數據同步

---

**專案已完全就緒，可以立即使用！** 🎉

如有任何問題，請參考完整的 README.md 或查看源代碼註釋。
