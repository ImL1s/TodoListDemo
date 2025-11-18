# Electron + React Todo List Desktop Application

> 一個功能完整、設計精美的桌面待辦事項應用程序，使用 Electron 和 React 18 構建，支持 Windows、macOS 和 Linux 平台。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F?logo=electron)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite)

## 📋 目錄

- [項目介紹](#項目介紹)
- [核心特性](#核心特性)
- [技術架構](#技術架構)
  - [Electron 架構深度解析](#electron-架構深度解析)
  - [IPC 通信機制](#ipc-通信機制)
  - [進程模型](#進程模型)
- [Electron vs Tauri 對比](#electron-vs-tauri-對比)
- [快速開始](#快速開始)
  - [環境要求](#環境要求)
  - [安裝依賴](#安裝依賴)
  - [開發模式](#開發模式)
- [項目結構](#項目結構)
- [開發指南](#開發指南)
  - [IPC 通信實現](#ipc-通信實現)
  - [數據持久化](#數據持久化)
  - [窗口管理](#窗口管理)
  - [系統托盤](#系統托盤)
  - [原生菜單](#原生菜單)
- [構建和打包](#構建和打包)
  - [構建 Web 資源](#構建-web-資源)
  - [打包 Windows 應用](#打包-windows-應用)
  - [打包 macOS 應用](#打包-macos-應用)
  - [打包 Linux 應用](#打包-linux-應用)
  - [跨平台構建](#跨平台構建)
- [安全性考慮](#安全性考慮)
- [性能優化](#性能優化)
- [常見問題](#常見問題)
- [進階主題](#進階主題)
  - [自動更新](#自動更新)
  - [原生模塊](#原生模塊)
  - [調試技巧](#調試技巧)
- [貢獻指南](#貢獻指南)
- [許可證](#許可證)

---

## 項目介紹

這是一個使用 **Electron** 和 **React 18** 構建的現代化桌面待辦事項應用程序。它展示了如何將 Web 技術（HTML、CSS、JavaScript）與原生桌面功能完美結合，創建出跨平台的桌面應用程序。

### 為什麼選擇 Electron？

Electron 是目前最成熟、最廣泛使用的桌面應用開發框架之一，許多知名應用都使用它構建：

- **VS Code** - Microsoft 的代碼編輯器
- **Slack** - 團隊協作工具
- **Discord** - 遊戲社交平台
- **Figma** - 設計協作工具
- **Notion** - 筆記和協作平台
- **Obsidian** - 知識管理工具

### 適用場景

- 需要跨平台支持（Windows、macOS、Linux）
- 團隊已熟悉 Web 技術棧
- 需要豐富的 UI 交互和現代化界面
- 需要快速開發和迭代
- 需要訪問底層系統 API

---

## 核心特性

### ✨ 功能特性

- ✅ **完整的 CRUD 操作** - 添加、編輯、刪除、標記完成
- 💾 **本地數據持久化** - 使用 electron-store 保存數據
- 🔍 **智能過濾** - 全部/活動/已完成三種視圖
- ⌨️ **鍵盤快捷鍵** - 支持 Ctrl+N 新建、雙擊編輯等
- 📊 **實時統計** - 顯示總數、活動和已完成任務數量
- 🎨 **精美 UI 設計** - 現代化的漸變色和動畫效果
- 🌐 **跨平台支持** - Windows、macOS、Linux

### 🔧 技術特性

- ⚡ **Vite 構建** - 極速的開發體驗
- 🔒 **TypeScript** - 類型安全和更好的開發體驗
- 🔐 **Context Bridge** - 安全的主進程和渲染進程通信
- 🔔 **系統托盤** - 最小化到托盤，不佔用任務欄
- 📋 **原生菜單** - 完整的應用菜單和快捷鍵
- 🪟 **窗口管理** - 最小寬高限制、記住窗口位置
- 🔄 **熱重載** - 開發模式下自動重載

---

## 技術架構

### 技術棧

```
┌─────────────────────────────────────┐
│         Desktop Platform            │
│   (Windows / macOS / Linux)         │
├─────────────────────────────────────┤
│           Electron 28               │
│  ┌───────────┐      ┌────────────┐ │
│  │   Main    │◄────►│  Renderer  │ │
│  │  Process  │ IPC  │  Process   │ │
│  │ (Node.js) │      │ (Chromium) │ │
│  └───────────┘      └────────────┘ │
├─────────────────────────────────────┤
│           React 18                  │
│        TypeScript 5.2               │
│           Vite 5.0                  │
└─────────────────────────────────────┘
```

### 依賴關系

```json
{
  "運行時依賴": {
    "electron": "跨平台桌面應用框架",
    "react": "UI 組件庫",
    "react-dom": "React DOM 渲染器",
    "electron-store": "持久化數據存儲"
  },
  "開發依賴": {
    "vite": "前端構建工具",
    "vite-plugin-electron": "Electron 和 Vite 集成",
    "typescript": "類型檢查",
    "electron-builder": "應用打包工具"
  }
}
```

---

## Electron 架構深度解析

### 1. 多進程架構

Electron 採用與 Chromium 相同的多進程架構，主要包括：

#### 主進程 (Main Process)

- **職責**：
  - 創建和管理應用窗口（BrowserWindow）
  - 處理系統級操作（菜單、托盤、快捷鍵）
  - 管理應用生命周期
  - 訪問 Node.js API 和原生模塊
  - 處理渲染進程的 IPC 請求

- **特點**：
  - 每個應用只有一個主進程
  - 運行在 Node.js 環境中
  - 可以使用所有 Node.js 模塊
  - 負責應用的啟動和退出

```typescript
// electron/main.ts
import { app, BrowserWindow } from 'electron';

// 主進程入口
app.whenReady().then(() => {
  createWindow();
});
```

#### 渲染進程 (Renderer Process)

- **職責**：
  - 渲染 UI 界面（HTML、CSS、JavaScript）
  - 處理用戶交互
  - 通過 IPC 與主進程通信
  - 運行前端框架代碼（React）

- **特點**：
  - 每個 BrowserWindow 都有自己的渲染進程
  - 運行在 Chromium 環境中
  - 默認沒有 Node.js 訪問權限（安全考慮）
  - 通過 preload 腳本訪問有限的 Electron API

```typescript
// src/App.tsx
import { useState, useEffect } from 'react';

function App() {
  // 渲染進程中的 React 代碼
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // 通過 electronAPI 與主進程通信
    window.electronAPI.getTodos().then(setTodos);
  }, []);
}
```

#### 預加載腳本 (Preload Script)

- **職責**：
  - 在渲染進程加載前執行
  - 使用 contextBridge 暴露安全的 API
  - 作為主進程和渲染進程之間的橋樑

- **特點**：
  - 可以訪問部分 Node.js API
  - 可以訪問 Electron API
  - 在獨立的 JavaScript 上下文中運行
  - 通過 contextBridge 向渲染進程暴露 API

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
  addTodo: (text: string) => ipcRenderer.invoke('add-todo', text),
});
```

### 2. IPC 通信機制

IPC (Inter-Process Communication) 是 Electron 中主進程和渲染進程之間通信的核心機制。

#### 通信模式

```
┌──────────────┐                    ┌──────────────┐
│   Renderer   │                    │     Main     │
│   Process    │                    │   Process    │
├──────────────┤                    ├──────────────┤
│              │                    │              │
│ electronAPI  │──invoke('xxx')───►│ ipcMain      │
│              │                    │ .handle()    │
│              │◄────Promise────────│              │
│              │                    │              │
│              │◄──send('xxx')──────│ webContents  │
│ ipcRenderer  │                    │ .send()      │
│ .on()        │                    │              │
└──────────────┘                    └──────────────┘
```

#### 雙向通信實例

**1. 渲染進程 → 主進程（請求-響應）**

```typescript
// Renderer Process
const todos = await window.electronAPI.getTodos();

// Preload Script
contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
});

// Main Process
ipcMain.handle('get-todos', async () => {
  return store.get('todos', []);
});
```

**2. 主進程 → 渲染進程（事件通知）**

```typescript
// Main Process
win.webContents.send('menu-new-todo');

// Preload Script
contextBridge.exposeInMainWorld('electronAPI', {
  onMenuNewTodo: (callback) => {
    ipcRenderer.on('menu-new-todo', callback);
  },
});

// Renderer Process
window.electronAPI.onMenuNewTodo(() => {
  // 處理新建 todo 事件
});
```

### 3. 進程模型詳解

```
應用啟動流程：

1. app.whenReady()
   └─> 主進程啟動
       └─> 初始化應用資源
           └─> 創建 BrowserWindow
               └─> 加載 preload.js
                   └─> 加載 index.html
                       └─> 渲染進程啟動
                           └─> React 應用初始化
                               └─> 通過 IPC 獲取初始數據

窗口關閉流程：

1. 用戶點擊關閉按鈕
   └─> win.on('close', callback)
       └─> 防止關閉（最小化到托盤）
           └─> win.hide()

應用退出流程：

1. app.quit()
   └─> window-all-closed 事件
       └─> 清理資源
           └─> app.on('will-quit')
               └─> 應用完全退出
```

---

## Electron vs Tauri 對比

### 技術對比表

| 特性 | Electron | Tauri |
|------|----------|-------|
| **核心引擎** | Chromium + Node.js | WebView (系統原生) |
| **後端語言** | JavaScript/TypeScript | Rust |
| **安裝包大小** | 120-200 MB | 3-10 MB |
| **內存占用** | 較高 (100-300 MB) | 較低 (30-100 MB) |
| **啟動速度** | 較慢 (1-3秒) | 較快 (< 1秒) |
| **跨平台** | ✅ 完全一致 | ⚠️ 可能有差異 |
| **生態系統** | 🌟 非常成熟 | 🌱 快速發展 |
| **學習曲線** | 平緩 | 陡峭 (需要學 Rust) |
| **安全性** | 良好 | 優秀 |
| **更新機制** | 成熟 | 基本 |

### 詳細對比

#### 1. 安裝包大小

**Electron：**
- Windows: ~120 MB (包含 Chromium 和 Node.js)
- macOS: ~150 MB
- Linux: ~140 MB

```bash
# Electron 打包產物
electron-react-todo-1.0.0.exe        # ~125 MB
electron-react-todo-1.0.0.dmg        # ~155 MB
electron-react-todo-1.0.0.AppImage   # ~142 MB
```

**Tauri：**
- Windows: ~4 MB (使用 WebView2)
- macOS: ~6 MB (使用 WKWebView)
- Linux: ~8 MB (使用 WebKitGTK)

```bash
# Tauri 打包產物
tauri-todo_1.0.0_x64.msi            # ~4.2 MB
tauri-todo_1.0.0_x64.dmg            # ~5.8 MB
tauri-todo_1.0.0_amd64.AppImage     # ~8.5 MB
```

#### 2. 性能對比

**內存使用：**

```
應用啟動後的內存占用（空閒狀態）：

Electron Todo App:
  主進程:    ~50 MB
  渲染進程:  ~80 MB
  GPU 進程:  ~30 MB
  總計:     ~160 MB

Tauri Todo App:
  主進程:    ~15 MB
  WebView:   ~40 MB
  總計:      ~55 MB

節省約: 65% 內存
```

**啟動時間：**

```
冷啟動（首次運行）：
  Electron: 2.3 秒
  Tauri:    0.8 秒

熱啟動（已緩存）：
  Electron: 1.5 秒
  Tauri:    0.4 秒
```

#### 3. 開發體驗

**Electron 優勢：**

```typescript
// ✅ 完全一致的 Web 環境
// 在所有平台上都使用相同的 Chromium 版本
const date = new Intl.DateTimeFormat('zh-CN').format(new Date());
// Windows、macOS、Linux 結果完全一致

// ✅ 豐富的 npm 生態
import store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import windowStateKeeper from 'electron-window-state';

// ✅ 熟悉的 JavaScript/TypeScript
ipcMain.handle('get-data', async () => {
  const data = await fetchData();
  return processData(data);
});
```

**Tauri 優勢：**

```rust
// ✅ 更好的性能（Rust）
#[tauri::command]
async fn process_large_file(path: String) -> Result<String, String> {
    // Rust 的零成本抽象和內存安全
    tokio::fs::read_to_string(path)
        .await
        .map_err(|e| e.to_string())
}

// ✅ 更小的二進制文件
// ✅ 更好的安全性（類型系統 + 內存安全）
```

#### 4. 適用場景

**選擇 Electron 如果：**
- ✅ 團隊熟悉 JavaScript/TypeScript
- ✅ 需要快速開發和迭代
- ✅ 需要完全一致的跨平台體驗
- ✅ 需要豐富的第三方庫支持
- ✅ 項目對安裝包大小不敏感（如企業內部工具）
- ✅ 需要訪問大量 npm 包

**選擇 Tauri 如果：**
- ✅ 對安裝包大小敏感（面向 C 端用戶）
- ✅ 對性能有極高要求
- ✅ 團隊願意學習 Rust
- ✅ 需要更好的安全性
- ✅ 面向資源受限的設備
- ✅ 項目相對簡單，不需要複雜的 Node.js 依賴

### 成本分析

**開發成本：**
- Electron: ⭐⭐⭐⭐⭐ (學習曲線平緩)
- Tauri: ⭐⭐⭐☆☆ (需要學習 Rust)

**維護成本：**
- Electron: ⭐⭐⭐⭐☆ (生態成熟，問題易解決)
- Tauri: ⭐⭐⭐☆☆ (社區較小，資料較少)

**分發成本：**
- Electron: ⭐⭐⭐☆☆ (大文件，下載慢)
- Tauri: ⭐⭐⭐⭐⭐ (小文件，下載快)

**運行成本：**
- Electron: ⭐⭐⭐☆☆ (較高資源占用)
- Tauri: ⭐⭐⭐⭐⭐ (低資源占用)

### 遷移建議

如果你正在考慮從 Electron 遷移到 Tauri：

```typescript
// Electron IPC
ipcMain.handle('get-todos', async () => {
  return await database.getTodos();
});

// 對應的 Tauri Command
#[tauri::command]
async fn get_todos() -> Result<Vec<Todo>, String> {
    database::get_todos()
        .await
        .map_err(|e| e.to_string())
}
```

**遷移清單：**
1. ✅ 評估團隊 Rust 學習意願和能力
2. ✅ 審查 npm 依賴，確認 Tauri 替代方案
3. ✅ 測試在不同平台上的 WebView 兼容性
4. ✅ 重寫主進程邏輯（JavaScript → Rust）
5. ✅ 更新 IPC 調用方式
6. ✅ 重新配置構建和打包流程
7. ✅ 進行全面的跨平台測試

---

## 快速開始

### 環境要求

在開始之前，確保你的系統已安裝：

- **Node.js**: 18.0.0 或更高版本
- **npm**: 9.0.0 或更高版本（或 yarn、pnpm）
- **Git**: 用於克隆倉庫

```bash
# 檢查版本
node --version  # v18.0.0+
npm --version   # 9.0.0+
```

### 平台特定要求

**Windows：**
- Windows 10 或更高版本
- Visual Studio 2015 或更高版本（用於原生模塊編譯）
- 或安裝 Windows Build Tools:
  ```bash
  npm install --global windows-build-tools
  ```

**macOS：**
- macOS 10.13 或更高版本
- Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

**Linux：**
- Ubuntu 18.04+ / Debian 10+ / Fedora 32+
- 必需的系統庫:
  ```bash
  sudo apt-get install libgtk-3-0 libnotify-dev libgconf-2-4 \
    libnss3 libxss1 libasound2 libxtst6 xauth xvfb
  ```

### 安裝依賴

```bash
# 克隆倉庫（如果需要）
git clone <repository-url>
cd 08-desktop/01-electron-react

# 安裝所有依賴
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 開發模式

```bash
# 啟動開發服務器 + Electron 應用
npm run electron:dev

# 或分別啟動
npm run dev          # 啟動 Vite 開發服務器
npm run electron .   # 啟動 Electron（在另一個終端）
```

**開發模式特性：**
- ⚡ Vite 熱模塊替換（HMR）
- 🔄 自動重啟 Electron
- 🛠️ 自動打開 DevTools
- 📝 Source Maps 支持

**開發工作流：**

```
1. npm run electron:dev
   ↓
2. Vite 啟動開發服務器 (http://localhost:5173)
   ↓
3. 等待 Vite 就緒
   ↓
4. Electron 啟動並加載開發服務器
   ↓
5. 修改源代碼
   ↓
6. Vite HMR 自動更新渲染進程
   ↓
7. 修改主進程代碼會自動重啟 Electron
```

---

## 項目結構

```
08-desktop/01-electron-react/
├── electron/                    # Electron 主進程代碼
│   ├── main.ts                 # 主進程入口文件
│   │   ├── 窗口創建和管理
│   │   ├── 應用菜單
│   │   ├── 系統托盤
│   │   ├── IPC 處理器
│   │   └── 生命周期管理
│   └── preload.ts              # 預加載腳本
│       ├── Context Bridge API
│       ├── IPC 封裝
│       └── 類型定義
│
├── src/                         # React 應用代碼
│   ├── components/             # React 組件
│   │   ├── TodoInput.tsx      # 輸入組件
│   │   ├── TodoInput.css      # 輸入樣式
│   │   ├── TodoList.tsx       # 列表組件
│   │   ├── TodoList.css       # 列表樣式
│   │   ├── TodoItem.tsx       # 項目組件
│   │   └── TodoItem.css       # 項目樣式
│   │
│   ├── App.tsx                 # 主應用組件
│   ├── App.css                 # 主應用樣式
│   ├── main.tsx                # React 入口文件
│   ├── index.css               # 全局樣式
│   ├── electron.d.ts           # Electron API 類型定義
│   └── vite-env.d.ts          # Vite 環境類型
│
├── public/                      # 公共資源
│   └── electron-vite.svg      # 應用圖標
│
├── build/                       # 構建資源（需要創建）
│   ├── icon.icns              # macOS 圖標
│   ├── icon.ico               # Windows 圖標
│   └── icon.png               # Linux 圖標
│
├── dist/                        # Vite 構建輸出（自動生成）
│   ├── index.html
│   ├── assets/
│   └── ...
│
├── dist-electron/              # Electron 構建輸出（自動生成）
│   ├── main.js
│   └── preload.js
│
├── release/                     # 打包產物（自動生成）
│   └── 1.0.0/
│       ├── electron-react-todo-1.0.0.exe
│       ├── electron-react-todo-1.0.0.dmg
│       └── ...
│
├── index.html                   # HTML 入口文件
├── package.json                 # 項目配置
├── tsconfig.json               # TypeScript 配置
├── tsconfig.node.json          # Node TypeScript 配置
├── vite.config.ts              # Vite 配置
├── electron-builder.json       # Electron Builder 配置
├── .gitignore                  # Git 忽略文件
└── README.md                    # 項目文檔
```

### 關鍵文件說明

#### `electron/main.ts`

主進程的核心文件，負責：

```typescript
// 1. 創建應用窗口
function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,  // 安全隔離
      nodeIntegration: false,  // 禁用 Node.js
    },
  });
}

// 2. 處理 IPC 請求
ipcMain.handle('get-todos', async () => {
  return store.get('todos', []);
});

// 3. 創建應用菜單
function createMenu() {
  const template = [ /* ... */ ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// 4. 創建系統托盤
function createTray() {
  tray = new Tray(icon);
  tray.setContextMenu(contextMenu);
}
```

#### `electron/preload.ts`

預加載腳本，提供安全的 API 橋樑：

```typescript
// 使用 contextBridge 暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 安全的函數調用
  getTodos: () => ipcRenderer.invoke('get-todos'),
  addTodo: (text: string) => ipcRenderer.invoke('add-todo', text),

  // 事件監聽
  onMenuNewTodo: (callback: () => void) => {
    ipcRenderer.on('menu-new-todo', callback);
  },
});
```

#### `vite.config.ts`

Vite 和 Electron 集成配置：

```typescript
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // 主進程配置
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
      {
        // 預加載腳本配置
        entry: 'electron/preload.ts',
      },
    ]),
  ],
});
```

#### `electron-builder.json`

打包配置文件：

```json
{
  "appId": "com.electron.react.todo",
  "productName": "Electron React Todo",
  "directories": {
    "output": "release/${version}"
  },
  "files": ["dist", "dist-electron"],
  "mac": {
    "target": ["dmg", "zip"]
  },
  "win": {
    "target": ["nsis", "portable"]
  },
  "linux": {
    "target": ["AppImage", "deb", "rpm"]
  }
}
```

---

## 開發指南

### IPC 通信實現

IPC (Inter-Process Communication) 是 Electron 應用的核心。以下是完整的實現流程：

#### 1. 定義類型（TypeScript）

```typescript
// src/electron.d.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface ElectronAPI {
  getTodos: () => Promise<Todo[]>;
  addTodo: (text: string) => Promise<Todo>;
  toggleTodo: (id: string) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<{ success: boolean }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
```

#### 2. 主進程處理器

```typescript
// electron/main.ts
import { ipcMain } from 'electron';
import Store from 'electron-store';

const store = new Store();

// 獲取所有 todos
ipcMain.handle('get-todos', async () => {
  try {
    return store.get('todos', []);
  } catch (error) {
    console.error('Error getting todos:', error);
    return [];
  }
});

// 添加新 todo
ipcMain.handle('add-todo', async (_, text: string) => {
  try {
    const todos = store.get('todos', []);
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    todos.push(newTodo);
    store.set('todos', todos);
    return newTodo;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
});

// 更多處理器...
```

#### 3. 預加載腳本暴露 API

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Promise 風格的 API
  getTodos: () => ipcRenderer.invoke('get-todos'),
  addTodo: (text: string) => ipcRenderer.invoke('add-todo', text),
  toggleTodo: (id: string) => ipcRenderer.invoke('toggle-todo', id),
  deleteTodo: (id: string) => ipcRenderer.invoke('delete-todo', id),

  // 事件監聽 API
  onMenuNewTodo: (callback: () => void) => {
    ipcRenderer.on('menu-new-todo', callback);
  },

  // 清理監聽器
  removeMenuListeners: () => {
    ipcRenderer.removeAllListeners('menu-new-todo');
  },
});
```

#### 4. 渲染進程調用

```typescript
// src/App.tsx
import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);

  // 加載數據
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const loadedTodos = await window.electronAPI.getTodos();
    setTodos(loadedTodos);
  };

  const handleAddTodo = async (text: string) => {
    try {
      const newTodo = await window.electronAPI.addTodo(text);
      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  // 監聽菜單事件
  useEffect(() => {
    window.electronAPI?.onMenuNewTodo(() => {
      // 處理新建 todo
    });

    return () => {
      window.electronAPI?.removeMenuListeners();
    };
  }, []);
}
```

### 數據持久化

使用 `electron-store` 實現本地數據持久化：

```typescript
import Store from 'electron-store';

// 定義數據結構
interface TodoStore {
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
  }>;
}

// 創建 store 實例
const store = new Store<TodoStore>({
  defaults: {
    todos: [],
  },
  // 可選：自定義存儲位置
  // cwd: app.getPath('userData'),
  // 可選：加密
  // encryptionKey: 'your-encryption-key',
});

// 使用
store.get('todos');              // 讀取
store.set('todos', newTodos);    // 寫入
store.delete('todos');           // 刪除
store.clear();                   // 清空
```

**存儲位置：**
- Windows: `%APPDATA%\electron-react-todo\config.json`
- macOS: `~/Library/Application Support/electron-react-todo/config.json`
- Linux: `~/.config/electron-react-todo/config.json`

### 窗口管理

#### 基本窗口配置

```typescript
function createWindow() {
  const win = new BrowserWindow({
    // 尺寸
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 400,

    // 外觀
    title: 'Electron React Todo',
    backgroundColor: '#f5f5f5',
    titleBarStyle: 'default',  // 或 'hidden'

    // 顯示
    show: false,  // 先不顯示
    center: true,

    // 安全設置
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,  // 啟用沙盒
    },
  });

  // 準備好後再顯示（避免閃爍）
  win.once('ready-to-show', () => {
    win.show();
  });

  return win;
}
```

#### 記住窗口狀態

使用 `electron-window-state` 記住窗口位置和大小：

```typescript
import windowStateKeeper from 'electron-window-state';

function createWindow() {
  // 加載上次的窗口狀態
  const mainWindowState = windowStateKeeper({
    defaultWidth: 900,
    defaultHeight: 700,
  });

  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    // ...
  });

  // 追踪窗口狀態變化
  mainWindowState.manage(win);
}
```

### 系統托盤

```typescript
import { Tray, Menu, nativeImage } from 'electron';

let tray: Tray | null = null;

function createTray() {
  // 創建托盤圖標
  const icon = nativeImage.createFromPath('path/to/icon.png');
  tray = new Tray(icon.resize({ width: 16, height: 16 }));

  // 設置提示文本
  tray.setToolTip('Electron React Todo');

  // 創建上下文菜單
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => win?.show(),
    },
    {
      label: 'Hide App',
      click: () => win?.hide(),
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // 點擊托盤圖標顯示/隱藏窗口
  tray.on('click', () => {
    if (win?.isVisible()) {
      win.hide();
    } else {
      win?.show();
    }
  });
}

// 防止窗口關閉時退出應用
win.on('close', (event) => {
  if (!app.isQuitting) {
    event.preventDefault();
    win.hide();
  }
});
```

### 原生菜單

```typescript
import { Menu } from 'electron';

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Todo',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            win?.webContents.send('menu-new-todo');
          },
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
```

---

## 構建和打包

### 構建 Web 資源

```bash
# 構建 React 應用
npm run build:web

# 輸出到 dist/ 目錄
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js
# │   └── index-[hash].css
```

### 打包 Windows 應用

```bash
# 打包 Windows 安裝程序
npm run build:win

# 產物（在 release/1.0.0/ 目錄）：
# ├── electron-react-todo-1.0.0.exe        # NSIS 安裝程序
# ├── electron-react-todo-1.0.0-ia32.exe   # 32位安裝程序
# └── electron-react-todo-1.0.0.exe.blockmap
```

**NSIS 安裝程序特性：**
- ✅ 完整的安裝向導
- ✅ 可選擇安裝目錄
- ✅ 創建桌面快捷方式
- ✅ 創建開始菜單項
- ✅ 完整的卸載程序

**便攜版：**

```bash
# 打包便攜版（無需安裝）
npm run build:win

# 產物：
# electron-react-todo-1.0.0-portable.exe
```

### 打包 macOS 應用

```bash
# 打包 macOS 應用
npm run build:mac

# 產物：
# ├── electron-react-todo-1.0.0.dmg         # DMG 安裝包
# ├── electron-react-todo-1.0.0-mac.zip     # ZIP 壓縮包
# ├── electron-react-todo-1.0.0-arm64.dmg   # Apple Silicon
# └── electron-react-todo-1.0.0-x64.dmg     # Intel
```

**DMG 特性：**
- ✅ 拖放安裝界面
- ✅ 自定義背景圖
- ✅ 自動打開安裝窗口
- ✅ 支持 Universal Binary（同時支持 Intel 和 Apple Silicon）

**代碼簽名（需要 Apple Developer 賬號）：**

```json
// package.json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (XXXXXXXXXX)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist"
    }
  }
}
```

### 打包 Linux 應用

```bash
# 打包 Linux 應用
npm run build:linux

# 產物：
# ├── electron-react-todo-1.0.0.AppImage     # AppImage（推薦）
# ├── electron-react-todo-1.0.0.deb          # Debian/Ubuntu
# ├── electron-react-todo-1.0.0.rpm          # RedHat/Fedora
# ├── electron-react-todo-1.0.0-arm64.AppImage
# └── electron-react-todo-1.0.0-x64.AppImage
```

**AppImage 特性：**
- ✅ 單文件，無需安裝
- ✅ 直接運行
- ✅ 兼容大多數發行版
- ✅ 自帶所有依賴

**運行 AppImage：**

```bash
# 添加執行權限
chmod +x electron-react-todo-1.0.0.AppImage

# 運行
./electron-react-todo-1.0.0.AppImage
```

### 跨平台構建

**在 macOS 上構建所有平台：**

```bash
# 需要安裝 wine（用於構建 Windows）
brew install wine

# 構建所有平台
npm run build:mac
npm run build:win   # 通過 wine
npm run build:linux
```

**在 Windows 上構建所有平台：**

```bash
# Windows 無法構建 macOS 應用（需要 macOS 或 CI）
npm run build:win
npm run build:linux  # 通過 WSL 或 Docker
```

**使用 CI/CD（推薦）：**

```yaml
# .github/workflows/build.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-mac:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build:mac

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build:win

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build:linux
```

---

## 安全性考慮

Electron 應用的安全性至關重要。以下是關鍵的安全實踐：

### 1. 渲染進程隔離

```typescript
// ✅ 正確：啟用 contextIsolation
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,    // 必須啟用
    nodeIntegration: false,    // 必須禁用
    sandbox: true,             // 推薦啟用
  },
});

// ❌ 錯誤：直接暴露 Node.js
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,     // 危險！
    contextIsolation: false,   // 危險！
  },
});
```

### 2. 使用 Context Bridge

```typescript
// ✅ 正確：通過 contextBridge 暴露有限的 API
contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
  // 只暴露需要的函數
});

// ❌ 錯誤：暴露整個 ipcRenderer
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,  // 危險！
});
```

### 3. 驗證和清理輸入

```typescript
// ✅ 正確：驗證輸入
ipcMain.handle('add-todo', async (_, text: string) => {
  // 驗證類型
  if (typeof text !== 'string') {
    throw new Error('Invalid input type');
  }

  // 驗證長度
  if (text.length > 1000) {
    throw new Error('Text too long');
  }

  // 清理 HTML
  const cleanText = text.replace(/<[^>]*>/g, '');

  // 處理數據
  return addTodo(cleanText);
});
```

### 4. CSP（內容安全策略）

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
  "
/>
```

### 5. 防止原型污染

```typescript
// ✅ 正確：使用 Object.create(null)
const data = Object.create(null);
data.key = value;

// ❌ 錯誤：直接使用對象
const data = {};
data.__proto__.polluted = true;  // 原型污染！
```

### 6. 安全的外部鏈接處理

```typescript
// ✅ 正確：在外部瀏覽器中打開鏈接
win.webContents.setWindowOpenHandler(({ url }) => {
  if (url.startsWith('http')) {
    require('electron').shell.openExternal(url);
  }
  return { action: 'deny' };
});
```

### 7. 禁用遠程模塊

```typescript
// ✅ 正確：不使用 remote 模塊
// remote 模塊已在 Electron 14+ 中移除

// 使用 IPC 代替
// Renderer:
const result = await window.electronAPI.doSomething();

// Main:
ipcMain.handle('do-something', async () => {
  return performAction();
});
```

---

## 性能優化

### 1. 延遲加載

```typescript
// ✅ 動態導入大型模塊
ipcMain.handle('process-large-data', async () => {
  const processor = await import('./heavy-processor');
  return processor.process(data);
});
```

### 2. 窗口緩存

```typescript
// ✅ 隱藏而不是關閉窗口
win.on('close', (event) => {
  if (!app.isQuitting) {
    event.preventDefault();
    win.hide();  // 保持窗口在內存中
  }
});
```

### 3. 優化渲染進程

```typescript
// ✅ 使用 React.memo 避免不必要的重渲染
const TodoItem = React.memo(({ todo, onToggle }) => {
  return (
    <div onClick={() => onToggle(todo.id)}>
      {todo.text}
    </div>
  );
});

// ✅ 使用虛擬列表處理大量數據
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={500}
  itemCount={todos.length}
  itemSize={50}
>
  {TodoRow}
</FixedSizeList>
```

### 4. 減少 IPC 調用

```typescript
// ❌ 錯誤：頻繁的 IPC 調用
for (const todo of todos) {
  await window.electronAPI.updateTodo(todo);
}

// ✅ 正確：批量處理
await window.electronAPI.updateTodos(todos);
```

### 5. 使用 Web Workers

```typescript
// worker.ts
self.addEventListener('message', (event) => {
  const result = heavyComputation(event.data);
  self.postMessage(result);
});

// main.ts
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.addEventListener('message', (event) => {
  console.log(event.data);
});
```

---

## 常見問題

### Q1: 如何調試主進程？

**方法 1：使用 VS Code**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "args": ["."],
      "outputCapture": "std"
    }
  ]
}
```

**方法 2：使用 Chrome DevTools**

```bash
# 啟動時添加調試參數
electron --inspect=5858 .

# 在 Chrome 中打開
chrome://inspect
```

### Q2: 打包後的應用很大，如何減小體積？

**優化策略：**

1. **移除未使用的依賴**
```json
{
  "devDependencies": {
    // 將打包工具移到 devDependencies
  },
  "dependencies": {
    // 只保留運行時需要的依賴
  }
}
```

2. **使用 asar 壓縮**
```json
{
  "build": {
    "asar": true,
    "asarUnpack": [
      "node_modules/sharp/**/*"  // 原生模塊需要解壓
    ]
  }
}
```

3. **排除不需要的文件**
```json
{
  "build": {
    "files": [
      "dist/**/*",
      "dist-electron/**/*",
      "!**/*.map",
      "!**/*.ts"
    ]
  }
}
```

### Q3: 如何實現自動更新？

使用 `electron-updater`：

```typescript
import { autoUpdater } from 'electron-updater';

// 檢查更新
autoUpdater.checkForUpdatesAndNotify();

// 監聽更新事件
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: '發現新版本',
    message: '發現新版本，是否現在更新？',
    buttons: ['是', '否'],
  });
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});
```

### Q4: 如何處理應用崩潰？

```typescript
import { app, crashReporter } from 'electron';

// 啟用崩潰報告
crashReporter.start({
  productName: 'Electron React Todo',
  companyName: 'Your Company',
  submitURL: 'https://your-server.com/crash-reports',
  uploadToServer: true,
});

// 處理渲染進程崩潰
win.webContents.on('render-process-gone', (event, details) => {
  console.error('Render process gone:', details);
  // 重新加載或顯示錯誤頁面
});

// 處理主進程錯誤
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // 記錄日誌、顯示錯誤對話框
});
```

### Q5: 如何在不同環境使用不同配置？

```typescript
// config.ts
const isDev = process.env.NODE_ENV === 'development';

export const config = {
  apiUrl: isDev
    ? 'http://localhost:3000'
    : 'https://api.production.com',

  logLevel: isDev ? 'debug' : 'error',

  window: {
    devTools: isDev,
    width: isDev ? 1200 : 900,
  },
};
```

---

## 進階主題

### 自動更新

完整的自動更新實現：

```typescript
// updater.ts
import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';

export class Updater {
  constructor(private win: BrowserWindow) {
    this.setupListeners();
  }

  private setupListeners() {
    autoUpdater.on('checking-for-update', () => {
      this.sendStatus('正在檢查更新...');
    });

    autoUpdater.on('update-available', (info) => {
      this.sendStatus('發現新版本');
      dialog.showMessageBox(this.win, {
        type: 'info',
        title: '發現新版本',
        message: `發現新版本 ${info.version}，是否現在下載？`,
        buttons: ['是', '否'],
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
    });

    autoUpdater.on('update-not-available', () => {
      this.sendStatus('已是最新版本');
    });

    autoUpdater.on('download-progress', (progress) => {
      this.sendStatus(
        `下載進度: ${progress.percent.toFixed(2)}%`
      );
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox(this.win, {
        type: 'info',
        title: '更新就緒',
        message: '更新已下載完成，是否現在重啟應用？',
        buttons: ['是', '否'],
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    autoUpdater.on('error', (error) => {
      this.sendStatus('更新失敗: ' + error.message);
    });
  }

  public checkForUpdates() {
    autoUpdater.checkForUpdates();
  }

  private sendStatus(message: string) {
    this.win.webContents.send('update-status', message);
  }
}

// 使用
const updater = new Updater(mainWindow);
updater.checkForUpdates();
```

### 原生模塊

使用原生 Node.js 模塊：

```typescript
// 安裝原生模塊
npm install better-sqlite3

// 需要重新編譯為 Electron 版本
npm install --save-dev electron-rebuild

// package.json
{
  "scripts": {
    "rebuild": "electron-rebuild -f -w better-sqlite3"
  }
}

// 使用
import Database from 'better-sqlite3';

const db = new Database('todos.db');
```

### 調試技巧

**1. 主進程日誌：**

```typescript
import log from 'electron-log';

// 配置日誌
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

// 使用
log.info('應用啟動');
log.error('發生錯誤', error);
log.debug('調試信息', data);

// 日誌位置
// macOS: ~/Library/Logs/electron-react-todo/main.log
// Windows: %USERPROFILE%\AppData\Roaming\electron-react-todo\logs\main.log
```

**2. 渲染進程調試：**

```typescript
// 在開發模式下自動打開 DevTools
if (isDev) {
  win.webContents.openDevTools();
}

// 或使用快捷鍵
// macOS: Cmd+Option+I
// Windows/Linux: Ctrl+Shift+I
```

**3. 性能分析：**

```typescript
// 啟動性能標記
performance.mark('app-start');

// 應用邏輯
createWindow();

// 結束標記
performance.mark('app-ready');

// 測量
performance.measure('startup', 'app-start', 'app-ready');

// 獲取結果
const measure = performance.getEntriesByName('startup')[0];
console.log(`啟動耗時: ${measure.duration}ms`);
```

---

## 貢獻指南

歡迎貢獻！請遵循以下步驟：

1. Fork 本倉庫
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 代碼規範

- 使用 TypeScript
- 遵循 ESLint 規則
- 編寫清晰的提交信息
- 添加必要的註釋

---

## 許可證

MIT License - 詳見 [LICENSE](LICENSE) 文件

---

## 相關資源

### 官方文檔

- [Electron 官方文檔](https://www.electronjs.org/docs)
- [React 官方文檔](https://react.dev/)
- [Vite 官方文檔](https://vitejs.dev/)
- [TypeScript 官方文檔](https://www.typescriptlang.org/)

### 推薦閱讀

- [Electron Security Guide](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron Performance Tips](https://www.electronjs.org/docs/latest/tutorial/performance)
- [Electron Best Practices](https://www.electronjs.org/docs/latest/tutorial/best-practices)

### 社區

- [Electron Discord](https://discord.gg/electron)
- [Electron中文網](https://www.electronjs.org/zh/)
- [Awesome Electron](https://github.com/sindresorhus/awesome-electron)

---

**享受使用 Electron 構建桌面應用的樂趣！** 🚀
