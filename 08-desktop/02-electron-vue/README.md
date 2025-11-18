# Electron + Vue 3 Todo List

一個功能完整的桌面 Todo List 應用程式，使用 **Electron** + **Vue 3** + **TypeScript** 構建，展示了現代桌面應用開發的最佳實踐。

## 特色

### Vue 3 特性
- **Composition API**: 使用 Vue 3 的 `setup` 語法和組合式函數
- **TypeScript**: 完整的類型安全支持
- **響應式系統**: 利用 Vue 的響應式特性管理狀態
- **組件化**: 可重用的 Vue 組件（TodoInput, TodoItem, TodoList, TodoFilter）
- **自定義 Composables**: `useTodos` 和 `useShortcuts` 組合式函數
- **Transition 動畫**: 流暢的列表項動畫效果

### Electron 特性
- **主進程與渲染進程分離**: 遵循 Electron 最佳實踐
- **IPC 通訊**: 安全的進程間通訊
- **contextBridge**: 使用 preload 腳本安全地暴露 API
- **檔案系統持久化**: 使用 Node.js `fs` 模組保存數據
- **系統托盤**: 常駐系統托盤，快速訪問
- **原生選單**: 自定義應用程式選單和上下文選單
- **全局快捷鍵**: 支持鍵盤快捷鍵操作
- **視窗管理**: 最小化、最大化、關閉和隱藏功能

### 功能特性
- **完整的 CRUD 操作**: 創建、讀取、更新、刪除待辦事項
- **篩選功能**: All / Active / Completed 三種視圖
- **批量操作**: 一鍵完成所有、清除已完成
- **雙擊編輯**: 雙擊待辦事項即可編輯
- **實時統計**: 顯示活動和已完成項目數量
- **自動保存**: 數據自動持久化到本地文件
- **快捷鍵支持**:
  - `Cmd/Ctrl + N`: 新增待辦事項
  - `Cmd/Ctrl + F`: 聚焦搜索框
  - `Cmd/Ctrl + Shift + T`: 切換視窗顯示/隱藏

## 專案結構

```
02-electron-vue/
├── electron/                 # Electron 主進程
│   ├── main.ts              # 主進程入口
│   ├── preload.ts           # Preload 腳本 (contextBridge)
│   ├── menu.ts              # 應用程式選單
│   └── tray.ts              # 系統托盤
├── src/                     # Vue 應用
│   ├── components/          # Vue 組件
│   │   ├── TitleBar.vue    # 自定義標題欄
│   │   ├── TodoInput.vue   # 輸入組件
│   │   ├── TodoItem.vue    # 單個待辦項
│   │   ├── TodoList.vue    # 列表組件
│   │   └── TodoFilter.vue  # 篩選器組件
│   ├── composables/         # 組合式函數
│   │   ├── useTodos.ts     # 待辦事項邏輯
│   │   └── useShortcuts.ts # 快捷鍵處理
│   ├── types/               # TypeScript 類型定義
│   │   └── index.ts
│   ├── App.vue              # 根組件
│   ├── main.ts              # Vue 入口
│   └── style.css            # 全局樣式
├── public/                  # 靜態資源
├── package.json             # 項目配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── README.md                # 本文件
```

## 安裝和運行

### 前置要求

- **Node.js**: 16.x 或更高版本
- **npm** 或 **yarn**

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

這將啟動 Vite 開發伺服器並運行 Electron 應用程式。支持熱模組替換（HMR）。

### 構建應用

#### 構建到 dist 目錄（查看輸出）
```bash
npm run build:dir
```

#### 構建 Windows 安裝包
```bash
npm run build:win
```

#### 構建 macOS 應用
```bash
npm run build:mac
```

#### 構建 Linux 應用
```bash
npm run build:linux
```

#### 構建所有平台
```bash
npm run build
```

構建產物將輸出到 `release/` 目錄。

### 類型檢查

```bash
npm run type-check
```

## 技術架構

### Electron 架構

```
┌─────────────────────────────────────────┐
│         Main Process (Node.js)          │
│  - 視窗管理                               │
│  - 檔案系統操作                           │
│  - 系統托盤                               │
│  - 原生選單                               │
│  - IPC 主端                               │
└─────────────────┬───────────────────────┘
                  │ IPC Communication
                  │ (contextBridge)
┌─────────────────┴───────────────────────┐
│      Renderer Process (Chromium)        │
│  - Vue 3 應用                            │
│  - 用戶界面                               │
│  - 業務邏輯                               │
│  - IPC 渲染端                             │
└─────────────────────────────────────────┘
```

### 數據流

```
User Input → Vue Component → Composable (useTodos)
                                   ↓
                             Update State
                                   ↓
                         Trigger Auto-save
                                   ↓
                    IPC → Main Process → fs.writeFile
                                   ↓
                            Save to Disk
```

### IPC 通訊流程

1. **渲染進程** 通過 `window.electronAPI` 調用方法
2. **Preload 腳本** 使用 `contextBridge` 安全暴露 API
3. **主進程** 通過 `ipcMain.handle` 處理請求
4. **返回結果** 回到渲染進程

```typescript
// Renderer Process (Vue)
const todos = await window.electronAPI.loadTodos()

// Preload Script
contextBridge.exposeInMainWorld('electronAPI', {
  loadTodos: () => ipcRenderer.invoke('todos:load')
})

// Main Process
ipcMain.handle('todos:load', async () => {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
})
```

## Electron + Vue vs Electron + React

### 相同點

- 都使用 Electron 作為桌面應用框架
- 都支持 TypeScript
- 都使用 Vite 作為構建工具
- IPC 通訊機制相同
- 原生功能整合方式相同

### Vue 的優勢

| 特性 | Vue 3 | React |
|------|-------|-------|
| **學習曲線** | 平緩，模板語法直觀 | 較陡，JSX 需要適應 |
| **模板語法** | HTML-like，設計師友好 | JSX，JavaScript-centric |
| **狀態管理** | 內建響應式系統 | 需要 useState/useReducer |
| **組件通訊** | Props + Emits，清晰 | Props + Callbacks |
| **性能** | 細粒度響應式更新 | Virtual DOM diff |
| **打包大小** | 較小（~40KB） | 較大（~130KB） |
| **開發體驗** | 單文件組件（SFC） | JSX + CSS-in-JS |
| **Composition API** | 官方內建 | 需要 Hooks |

### Vue 的特色

1. **單文件組件（SFC）**
   - 一個文件包含模板、腳本、樣式
   - 更好的代碼組織和可讀性

2. **模板語法**
   - 更接近 HTML，易於上手
   - `v-if`, `v-for`, `v-model` 等指令

3. **響應式系統**
   - `ref` 和 `reactive` 自動追蹤依賴
   - 無需手動優化渲染

4. **組合式 API**
   - 邏輯復用更簡單
   - 類型推導更友好

### React 的優勢

1. **生態系統**: 更大的社區和第三方庫
2. **React Native**: 可以共享代碼到移動端
3. **就業市場**: 更多工作機會
4. **靈活性**: 更少約束，更多自由

### 選擇建議

**選擇 Vue 如果你：**
- 偏好模板語法和直觀的 API
- 希望更快的學習曲線
- 需要更小的打包體積
- 喜歡官方提供的完整解決方案

**選擇 React 如果你：**
- 已經熟悉 React 生態系統
- 需要與 React Native 共享代碼
- 偏好 JSX 和 JavaScript-first 的方式
- 需要更多的第三方庫選擇

## 最佳實踐

### 1. 安全性

- ✅ 啟用 `contextIsolation`
- ✅ 禁用 `nodeIntegration`
- ✅ 使用 `preload` 腳本暴露 API
- ✅ 最小化暴露的 API 表面
- ✅ 設置 Content Security Policy

### 2. 性能

- ✅ 使用 Vite 進行快速開發
- ✅ 組件懶加載
- ✅ Vue 的響應式系統自動優化
- ✅ 避免不必要的重新渲染

### 3. 代碼組織

- ✅ 主進程和渲染進程分離
- ✅ 使用 Composables 復用邏輯
- ✅ TypeScript 類型安全
- ✅ 清晰的文件結構

### 4. 用戶體驗

- ✅ 系統托盤常駐
- ✅ 鍵盤快捷鍵支持
- ✅ 原生選單
- ✅ 視窗狀態管理
- ✅ 自動保存

## 常見問題

### Q: 如何調試 Electron 應用？

**主進程調試：**
```bash
# 在啟動命令中添加 --inspect
electron --inspect=5858 .
```

**渲染進程調試：**
- 使用 Chrome DevTools（開發模式自動打開）
- Vue DevTools 擴展

### Q: 如何添加更多功能？

1. 在 `src/composables/useTodos.ts` 添加業務邏輯
2. 在 `electron/main.ts` 添加新的 IPC handlers
3. 在 `electron/preload.ts` 暴露新的 API
4. 在 Vue 組件中使用新功能

### Q: 如何自定義應用圖標？

1. 準備圖標文件（PNG 或 ICNS/ICO）
2. 放置在 `public/` 目錄
3. 在 `package.json` 的 `build` 配置中指定路徑

### Q: 數據存儲在哪裡？

數據保存在用戶數據目錄：
- **Windows**: `%APPDATA%/electron-vue-todo/todos.json`
- **macOS**: `~/Library/Application Support/electron-vue-todo/todos.json`
- **Linux**: `~/.config/electron-vue-todo/todos.json`

## 學習資源

### Vue 3
- [Vue 3 官方文檔](https://vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue 3 TypeScript 支持](https://vuejs.org/guide/typescript/overview.html)
- [Vue School](https://vueschool.io/)

### Electron
- [Electron 官方文檔](https://www.electronjs.org/docs)
- [Electron 安全指南](https://www.electronjs.org/docs/latest/tutorial/security)
- [IPC 通訊](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [進程模型](https://www.electronjs.org/docs/latest/tutorial/process-model)

### Vite
- [Vite 官方文檔](https://vitejs.dev/)
- [vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron)

### TypeScript
- [TypeScript 官方文檔](https://www.typescriptlang.org/)
- [TypeScript 與 Vue](https://vuejs.org/guide/typescript/overview.html)

### 社區資源
- [Awesome Electron](https://github.com/sindresorhus/awesome-electron)
- [Awesome Vue](https://github.com/vuejs/awesome-vue)
- [Electron Forge](https://www.electronforge.io/)
- [electron-builder](https://www.electron.build/)

## 進階主題

### 1. 添加自動更新

使用 `electron-updater`:

```bash
npm install electron-updater
```

在主進程中配置自動更新邏輯。

### 2. 原生模組整合

使用 `electron-rebuild` 重新編譯原生模組：

```bash
npm install --save-dev electron-rebuild
```

### 3. 多視窗管理

創建和管理多個 BrowserWindow 實例。

### 4. 深度連結

註冊自定義 URL scheme（例如 `myapp://`）。

### 5. 系統通知

使用 Electron 的 Notification API。

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 授權

MIT License

## 總結

這個項目展示了如何使用 **Electron** 和 **Vue 3** 構建一個功能完整的桌面應用程式。它結合了：

- **Vue 3 Composition API** 的優雅和靈活性
- **Electron** 的強大桌面功能
- **TypeScript** 的類型安全
- **Vite** 的快速開發體驗

適合作為學習 Electron + Vue 桌面應用開發的起點，也可以作為實際項目的基礎模板。
