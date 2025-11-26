# Development Notes - Electron + React Todo

## 🎓 關鍵概念解釋

### 1. Electron 多進程架構

Electron 使用 Chromium 的多進程架構，主要包括：

#### 主進程 (Main Process)
- **數量**: 每個應用只有 1 個
- **運行環境**: Node.js
- **職責**:
  - 創建和管理 BrowserWindow
  - 處理應用生命周期事件
  - 管理系統級功能（菜單、托盤、通知）
  - 處理 IPC 請求

```typescript
// electron/main.ts
import { app, BrowserWindow } from 'electron';

// 這裡的代碼運行在主進程中
app.whenReady().then(() => {
  const win = new BrowserWindow({...});
  win.loadURL('http://localhost:5173');
});
```

#### 渲染進程 (Renderer Process)
- **數量**: 每個 BrowserWindow 一個
- **運行環境**: Chromium (類似瀏覽器)
- **職責**:
  - 渲染 UI (HTML/CSS/JavaScript)
  - 處理用戶交互
  - 通過 IPC 與主進程通信

```typescript
// src/App.tsx
// 這裡的代碼運行在渲染進程中
function App() {
  // React 組件邏輯
  const [todos, setTodos] = useState([]);
}
```

#### 預加載腳本 (Preload Script)
- **運行時機**: 渲染進程啟動前
- **運行環境**: 特殊上下文（有限的 Node.js + DOM 訪問）
- **職責**:
  - 使用 contextBridge 暴露安全的 API
  - 作為主進程和渲染進程的橋樑

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

// 在渲染進程加載前執行
contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
});
```

### 2. IPC 通信機制

IPC (Inter-Process Communication) 允許主進程和渲染進程之間安全通信。

#### 模式 1: invoke/handle (推薦，支持 Promise)

```typescript
// 渲染進程：發送請求
const todos = await window.electronAPI.getTodos();

// 預加載腳本：暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
});

// 主進程：處理請求
ipcMain.handle('get-todos', async () => {
  return store.get('todos', []);
});
```

#### 模式 2: send/on (單向通信)

```typescript
// 主進程：發送消息給渲染進程
win.webContents.send('menu-new-todo');

// 預加載腳本：暴露監聽器
contextBridge.exposeInMainWorld('electronAPI', {
  onMenuNewTodo: (callback) => {
    ipcRenderer.on('menu-new-todo', callback);
  },
});

// 渲染進程：監聽消息
window.electronAPI.onMenuNewTodo(() => {
  console.log('收到新建 todo 事件');
});
```

### 3. Context Isolation（安全隔離）

Context Isolation 是 Electron 的安全特性，防止渲染進程直接訪問 Node.js。

```typescript
// ✅ 正確：啟用 contextIsolation
new BrowserWindow({
  webPreferences: {
    contextIsolation: true,     // 隔離上下文
    nodeIntegration: false,     // 禁用 Node.js
    preload: 'preload.js',      // 使用預加載腳本
  },
});

// ❌ 錯誤：直接暴露 Node.js（不安全）
new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,      // 危險！
    contextIsolation: false,    // 危險！
  },
});
```

### 4. Context Bridge

contextBridge 提供安全的方式向渲染進程暴露 API。

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

// ✅ 正確：只暴露需要的函數
contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
  addTodo: (text) => ipcRenderer.invoke('add-todo', text),
});

// ❌ 錯誤：暴露整個 ipcRenderer
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,  // 危險！渲染進程可以調用任何 IPC
});
```

### 5. 數據持久化

使用 electron-store 實現簡單的數據持久化。

```typescript
import Store from 'electron-store';

// 創建 store
const store = new Store({
  defaults: {
    todos: [],
  },
});

// 讀取
const todos = store.get('todos');

// 寫入
store.set('todos', newTodos);

// 刪除
store.delete('todos');

// 清空
store.clear();
```

**存儲位置**：
- Windows: `%APPDATA%\electron-react-todo\config.json`
- macOS: `~/Library/Application Support/electron-react-todo/config.json`
- Linux: `~/.config/electron-react-todo/config.json`

---

## 🔧 開發工作流程

### 啟動流程

```
1. npm run electron:dev
   ↓
2. concurrently 同時啟動：
   - Vite 開發服務器 (http://localhost:5173)
   - Electron 應用
   ↓
3. Vite 編譯 React 代碼
   - 支持 HMR（熱模塊替換）
   - 瀏覽器自動刷新
   ↓
4. vite-plugin-electron 編譯主進程代碼
   - 監聽文件變化
   - 自動重啟 Electron
   ↓
5. Electron 加載開發服務器
   - 主進程啟動
   - 創建 BrowserWindow
   - 加載 http://localhost:5173
   ↓
6. 應用啟動完成
   - 自動打開 DevTools
   - 準備接受代碼修改
```

### 代碼修改工作流

**修改渲染進程代碼 (src/)**：
```
1. 修改 src/App.tsx
   ↓
2. Vite 檢測到文件變化
   ↓
3. HMR 更新模塊
   ↓
4. 頁面局部刷新（不丟失狀態）
   ↓
5. 立即看到變化
```

**修改主進程代碼 (electron/)**：
```
1. 修改 electron/main.ts
   ↓
2. vite-plugin-electron 檢測到變化
   ↓
3. 重新編譯主進程
   ↓
4. 自動重啟 Electron
   ↓
5. 窗口重新加載
```

---

## 🏗️ 構建流程

### 開發構建

```bash
npm run dev
```

- Vite 啟動開發服務器
- 支持 HMR
- Source Maps 完整
- 不壓縮代碼

### 生產構建

```bash
npm run build
```

#### 步驟 1: 編譯 TypeScript
```
tsc
  ↓
檢查類型錯誤
  ↓
輸出類型聲明文件
```

#### 步驟 2: 構建 Web 資源
```
vite build
  ↓
編譯 React 代碼
  ↓
打包 JavaScript/CSS
  ↓
優化和壓縮
  ↓
輸出到 dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js
  │   └── index-[hash].css
```

#### 步驟 3: 構建 Electron
```
vite-plugin-electron
  ↓
編譯主進程 (main.ts)
編譯預載腳本 (preload.ts)
  ↓
輸出到 dist-electron/
  ├── main.js
  └── preload.js
```

#### 步驟 4: 打包應用
```
electron-builder
  ↓
讀取 electron-builder.json
  ↓
複製 dist/ 和 dist-electron/
  ↓
打包為可執行文件
  ↓
輸出到 release/
  ├── electron-react-todo-1.0.0.exe     (Windows)
  ├── electron-react-todo-1.0.0.dmg     (macOS)
  └── electron-react-todo-1.0.0.AppImage (Linux)
```

---

## 🔍 調試技巧

### 調試渲染進程

1. **使用 Chrome DevTools**
   - 在應用中按 `F12` 打開 DevTools
   - 或在菜單中選擇 View → Toggle Developer Tools

2. **Console 輸出**
   ```typescript
   console.log('調試信息', data);
   console.error('錯誤信息', error);
   ```

3. **React DevTools**
   ```bash
   npm install --save-dev electron-devtools-installer
   ```

### 調試主進程

1. **Console 輸出**
   ```typescript
   // electron/main.ts
   console.log('主進程日誌');
   ```
   輸出會顯示在終端中（不是 DevTools）

2. **VS Code 調試**
   ```json
   // .vscode/launch.json
   {
     "type": "node",
     "request": "launch",
     "name": "Electron Main",
     "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
     "args": ["."],
     "outputCapture": "std"
   }
   ```

3. **Chrome DevTools (主進程)**
   ```bash
   electron --inspect=5858 .
   ```
   然後在 Chrome 中訪問 `chrome://inspect`

### 查看 IPC 通信

在預加載腳本中添加日誌：

```typescript
// electron/preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => {
    console.log('[IPC] 調用 get-todos');
    return ipcRenderer.invoke('get-todos');
  },
});
```

---

## 📦 打包配置詳解

### electron-builder.json

```json
{
  "appId": "com.electron.react.todo",  // 應用 ID（唯一標識）
  "productName": "Electron React Todo", // 顯示名稱

  "directories": {
    "output": "release/${version}"      // 輸出目錄
  },

  "files": [
    "dist/**/*",          // Web 資源
    "dist-electron/**/*"  // Electron 代碼
  ],

  "mac": {
    "target": ["dmg", "zip"],           // macOS 打包格式
    "category": "public.app-category.productivity",
    "icon": "build/icon.icns"           // macOS 圖標
  },

  "win": {
    "target": ["nsis", "portable"],     // Windows 打包格式
    "icon": "build/icon.ico"            // Windows 圖標
  },

  "linux": {
    "target": ["AppImage", "deb", "rpm"], // Linux 打包格式
    "category": "Utility",
    "icon": "build/icon.png"            // Linux 圖標
  }
}
```

### 圖標要求

**Windows (.ico)**:
- 格式: ICO
- 尺寸: 256x256 (推薦包含多個尺寸)
- 位置: `build/icon.ico`

**macOS (.icns)**:
- 格式: ICNS
- 尺寸: 512x512, 1024x1024
- 位置: `build/icon.icns`

**Linux (.png)**:
- 格式: PNG
- 尺寸: 512x512
- 位置: `build/icon.png`

---

## 🎯 常見開發模式

### 1. 添加新的 IPC 通道

```typescript
// 1. 在 electron/main.ts 添加處理器
ipcMain.handle('new-operation', async (_, arg1, arg2) => {
  // 處理邏輯
  return result;
});

// 2. 在 electron/preload.ts 暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
  newOperation: (arg1, arg2) => ipcRenderer.invoke('new-operation', arg1, arg2),
});

// 3. 在 src/electron.d.ts 添加類型
export interface ElectronAPI {
  newOperation: (arg1: string, arg2: number) => Promise<Result>;
}

// 4. 在 src/App.tsx 使用
const result = await window.electronAPI.newOperation(arg1, arg2);
```

### 2. 添加新的 React 組件

```typescript
// 1. 創建組件文件
// src/components/NewComponent.tsx
export default function NewComponent({ prop1, prop2 }) {
  return <div>...</div>;
}

// 2. 創建樣式文件
// src/components/NewComponent.css
.new-component {
  /* 樣式 */
}

// 3. 在 App.tsx 中使用
import NewComponent from './components/NewComponent';

function App() {
  return (
    <div>
      <NewComponent prop1="value" prop2={123} />
    </div>
  );
}
```

### 3. 添加原生菜單項

```typescript
// electron/main.ts
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Item',           // 菜單項標籤
          accelerator: 'CmdOrCtrl+I',  // 快捷鍵
          click: () => {
            // 發送事件到渲染進程
            win?.webContents.send('menu-new-item');
          },
        },
      ],
    },
  ];
}

// electron/preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  onMenuNewItem: (callback) => {
    ipcRenderer.on('menu-new-item', callback);
  },
});

// src/App.tsx
useEffect(() => {
  window.electronAPI?.onMenuNewItem(() => {
    // 處理菜單事件
  });
}, []);
```

---

## 🚨 常見錯誤和解決方案

### 錯誤 1: 無法訪問 window.electronAPI

**原因**: contextBridge 未正確配置

**解決**:
```typescript
// 檢查 electron/main.ts
webPreferences: {
  preload: join(__dirname, 'preload.js'),  // 確保路徑正確
  contextIsolation: true,
  nodeIntegration: false,
}
```

### 錯誤 2: IPC 調用沒有響應

**原因**: 主進程沒有對應的處理器

**解決**:
```typescript
// 檢查 electron/main.ts
ipcMain.handle('operation-name', async () => {
  // 必須有對應的處理器
});
```

### 錯誤 3: 打包後無法讀取文件

**原因**: 使用了相對路徑

**解決**:
```typescript
// ❌ 錯誤
const path = './data.json';

// ✅ 正確
import { app } from 'electron';
const path = join(app.getPath('userData'), 'data.json');
```

### 錯誤 4: 渲染進程白屏

**原因**:
1. Vite 開發服務器未啟動
2. CSP 配置過於嚴格
3. React 組件錯誤

**解決**:
```typescript
// 檢查開發服務器
if (VITE_DEV_SERVER_URL) {
  win.loadURL(VITE_DEV_SERVER_URL);
  win.webContents.openDevTools(); // 打開 DevTools 查看錯誤
}
```

---

## 📚 推薦閱讀順序

1. ✅ **QUICK_START.md** - 快速上手
2. ✅ **DEVELOPMENT_NOTES.md** (本文件) - 理解核心概念
3. ✅ **PROJECT_OVERVIEW.md** - 項目整體架構
4. ✅ **README.md** - 完整文檔
5. ✅ **源代碼** - 實際實現

---

## 💡 最佳實踐

### 1. 安全性
- ✅ 始終啟用 contextIsolation
- ✅ 禁用 nodeIntegration
- ✅ 使用 contextBridge 暴露 API
- ✅ 驗證所有來自渲染進程的輸入
- ✅ 使用 CSP 限制資源加載

### 2. 性能
- ✅ 使用 React.memo 避免不必要的重渲染
- ✅ 減少 IPC 調用頻率
- ✅ 使用虛擬列表處理大量數據
- ✅ 延遲加載重型模塊
- ✅ 隱藏窗口而不是關閉

### 3. 可維護性
- ✅ 使用 TypeScript 確保類型安全
- ✅ 保持組件小而專注
- ✅ 為複雜邏輯添加註釋
- ✅ 使用有意義的變量和函數名
- ✅ 編寫清晰的錯誤處理代碼

### 4. 用戶體驗
- ✅ 提供加載指示器
- ✅ 處理錯誤並顯示友好消息
- ✅ 支持鍵盤快捷鍵
- ✅ 保存用戶偏好設置
- ✅ 提供清晰的反饋

---

**持續學習，不斷進步！** 🚀
