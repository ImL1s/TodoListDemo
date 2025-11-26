# 架構設計文檔

## 系統架構

### 多進程架構

Electron 採用 Chromium 的多進程架構：

```
┌─────────────────────────────────────────────────────┐
│                   主進程 (Main Process)              │
│                    Node.js Runtime                   │
│                                                       │
│  ┌─────────────┐  ┌──────────┐  ┌─────────────┐    │
│  │ 視窗管理     │  │ 文件系統  │  │ 系統托盤     │    │
│  │ BrowserWindow│  │ fs module │  │ Tray         │    │
│  └─────────────┘  └──────────┘  └─────────────┘    │
│                                                       │
│  ┌─────────────┐  ┌──────────┐  ┌─────────────┐    │
│  │ IPC Main    │  │ 原生選單  │  │ 全局快捷鍵   │    │
│  │ ipcMain     │  │ Menu      │  │ globalShortcut│   │
│  └─────────────┘  └──────────┘  └─────────────┘    │
└───────────────────────┬─────────────────────────────┘
                        │
                   IPC 通訊層
              (contextBridge + IPC)
                        │
┌───────────────────────┴─────────────────────────────┐
│              渲染進程 (Renderer Process)             │
│                 Chromium Browser                     │
│                                                       │
│  ┌──────────────────────────────────────────────┐  │
│  │              Vue 3 Application                │  │
│  │                                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │ App.vue  │  │Components│  │Composables│   │  │
│  │  └──────────┘  └──────────┘  └──────────┘   │  │
│  │                                                │  │
│  │  ┌──────────────────────────────────┐        │  │
│  │  │      Reactivity System          │        │  │
│  │  │   (ref, reactive, computed)     │        │  │
│  │  └──────────────────────────────────┘        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 模組設計

### 主進程模組

#### 1. main.ts - 主控制器

**職責**:
- 應用生命週期管理
- 視窗創建和管理
- IPC 處理器註冊
- 系統托盤和選單初始化

**關鍵函數**:
```typescript
createWindow()      // 創建主視窗
setupTray()         // 初始化系統托盤
registerShortcuts() // 註冊全局快捷鍵
```

#### 2. preload.ts - 安全橋接

**職責**:
- 使用 contextBridge 暴露 API
- 主進程和渲染進程的安全通訊
- 類型定義導出

**暴露的 API**:
```typescript
interface ElectronAPI {
  // 數據操作
  loadTodos()
  saveTodos()

  // 視窗控制
  minimizeWindow()
  maximizeWindow()
  closeWindow()

  // 事件監聽
  onNewTodo()
  onFocusSearch()
}
```

#### 3. menu.ts - 選單管理

**職責**:
- 創建應用程式選單
- 處理選單點擊事件
- 跨平台選單適配

#### 4. tray.ts - 托盤管理

**職責**:
- 創建系統托盤圖標
- 托盤選單構建
- 托盤事件處理

### 渲染進程模組

#### 1. App.vue - 根組件

**職責**:
- 應用佈局
- 組件組合
- 快捷鍵監聽

**組成**:
```vue
<template>
  <TitleBar />      <!-- 自定義標題欄 -->
  <TodoInput />     <!-- 輸入組件 -->
  <TodoList />      <!-- 列表組件 -->
  <TodoFilter />    <!-- 篩選組件 -->
</template>

<script setup>
  import { useTodos } from './composables/useTodos'
  import { useShortcuts } from './composables/useShortcuts'
</script>
```

#### 2. Composables - 組合式函數

##### useTodos.ts

**職責**: 待辦事項業務邏輯

**狀態**:
```typescript
todos: Ref<Todo[]>           // 待辦列表
filter: Ref<FilterType>      // 當前篩選
loading: Ref<boolean>        // 加載狀態
```

**方法**:
```typescript
addTodo()         // 添加
updateTodo()      // 更新
toggleTodo()      // 切換狀態
deleteTodo()      // 刪除
toggleAll()       // 全部切換
clearCompleted()  // 清除已完成
loadTodos()       // 從文件加載
saveTodos()       // 保存到文件
```

**生命週期**:
```typescript
onMounted()  → loadTodos()
watch(todos) → saveTodos()  // 自動保存
```

##### useShortcuts.ts

**職責**: 快捷鍵處理

**功能**:
```typescript
onMounted()  → 註冊監聽器
onUnmounted() → 清理監聽器
```

#### 3. Components - 視圖組件

##### TodoInput.vue
- 輸入框
- 添加按鈕
- 暴露 focus() 方法

##### TodoItem.vue
- 顯示單個待辦
- 複選框、文字、刪除按鈕
- 雙擊編輯功能

##### TodoList.vue
- 列表容器
- 空狀態顯示
- Transition 動畫

##### TodoFilter.vue
- 篩選按鈕
- 統計顯示
- v-model 雙向綁定

##### TitleBar.vue
- 自定義標題欄（Windows/Linux）
- 最小化、最大化、關閉按鈕

## 數據流

### 創建 Todo 流程

```
1. 用戶輸入 + Enter
   ↓
2. TodoInput emits 'add' 事件
   ↓
3. App.vue 調用 handleAddTodo()
   ↓
4. useTodos.addTodo() 更新 state
   ↓
5. Vue 響應式系統觸發重新渲染
   ↓
6. watch 檢測到 todos 變化
   ↓
7. 調用 saveTodos()
   ↓
8. window.electronAPI.saveTodos()
   ↓
9. IPC 發送到主進程
   ↓
10. ipcMain.handle('todos:save')
   ↓
11. fs.writeFileSync() 寫入文件
   ↓
12. 返回 { success: true }
```

### 加載 Todo 流程

```
1. App mounted
   ↓
2. useTodos.loadTodos()
   ↓
3. window.electronAPI.loadTodos()
   ↓
4. IPC 請求主進程
   ↓
5. ipcMain.handle('todos:load')
   ↓
6. fs.readFileSync() 讀取文件
   ↓
7. JSON.parse() 解析
   ↓
8. 返回數據到渲染進程
   ↓
9. todos.value = loaded
   ↓
10. Vue 更新視圖
```

## 狀態管理

### Vue 響應式系統

```typescript
// 單一數據源
const todos = ref<Todo[]>([])

// 派生狀態（自動計算）
const filteredTodos = computed(() => {
  // 根據 filter 篩選 todos
})

const stats = computed(() => ({
  total: todos.value.length,
  active: todos.value.filter(t => !t.completed).length,
  completed: todos.value.filter(t => t.completed).length
}))

// 副作用（自動保存）
watch(todos, () => {
  saveTodos()
}, { deep: true })
```

### 為什麼不用 Pinia?

這個項目使用 Vue 的內建響應式系統，因為：

1. **簡單性**: 單一組件樹，不需要複雜的狀態管理
2. **學習曲線**: 展示 Vue 原生能力
3. **性能**: ref + computed 已經很高效
4. **可擴展**: 需要時可輕鬆遷移到 Pinia

如果需要：
- 多視窗共享狀態
- 複雜的狀態邏輯
- 時間旅行調試
- 插件系統

則建議使用 Pinia。

## 安全設計

### 1. 進程隔離

```typescript
// main.ts
webPreferences: {
  contextIsolation: true,    // ✅ 隔離上下文
  nodeIntegration: false,    // ✅ 禁用 Node.js
  sandbox: true              // ✅ 啟用沙箱
}
```

### 2. 安全橋接

```typescript
// preload.ts
contextBridge.exposeInMainWorld('electronAPI', {
  // 只暴露必要的 API
  loadTodos: () => ipcRenderer.invoke('todos:load'),
  saveTodos: (todos) => ipcRenderer.invoke('todos:save', todos)
})
```

### 3. CSP (Content Security Policy)

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'"
/>
```

### 4. 輸入驗證

```typescript
// 主進程驗證
ipcMain.handle('todos:save', async (_event, todos) => {
  if (!Array.isArray(todos)) {
    throw new Error('Invalid data')
  }
  // 保存邏輯
})
```

## 性能優化

### 1. Vue 優化

- **組件懶加載**: 按需加載大組件
- **v-memo**: 緩存大列表項（可選）
- **computed**: 避免重複計算
- **watch deep**: 謹慎使用深度監聽

### 2. Electron 優化

- **預加載**: 使用 preload 腳本
- **緩存**: IPC 調用結果緩存
- **節流**: 頻繁操作添加節流
- **延遲加載**: 非關鍵資源延遲加載

### 3. 打包優化

- **Tree Shaking**: Vite 自動移除未使用代碼
- **代碼分割**: 按路由分割（多頁面應用）
- **壓縮**: 生產環境自動壓縮

## 錯誤處理

### 1. IPC 錯誤

```typescript
try {
  const result = await window.electronAPI.saveTodos(todos)
  if (!result.success) {
    console.error('Save failed:', result.error)
  }
} catch (error) {
  console.error('IPC error:', error)
}
```

### 2. 文件操作錯誤

```typescript
ipcMain.handle('todos:load', async () => {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Load error:', error)
    return []  // 返回空數組作為降級
  }
})
```

### 3. Vue 錯誤邊界

可以添加全局錯誤處理：

```typescript
app.config.errorHandler = (err) => {
  console.error('Vue error:', err)
}
```

## 測試策略

### 單元測試

- **Composables**: 使用 Vitest 測試業務邏輯
- **Components**: 使用 @vue/test-utils

### 集成測試

- **IPC**: 測試主進程和渲染進程通訊
- **文件操作**: 測試數據持久化

### E2E 測試

- **Spectron** 或 **Playwright**: 測試整個應用流程

## 部署流程

### 1. 開發環境

```bash
npm run dev
```

- Vite 開發伺服器（localhost:5173）
- Electron 加載開發 URL
- 熱模組替換（HMR）

### 2. 生產構建

```bash
npm run build
```

1. Vue-tsc 類型檢查
2. Vite 構建渲染進程
3. 編譯主進程 TypeScript
4. electron-builder 打包

### 3. 發布流程

1. 更新版本號
2. 生成 changelog
3. 構建所有平台
4. 上傳到發布平台
5. 更新自動更新伺服器

## 擴展指南

### 添加新頁面

1. 安裝 Vue Router
2. 創建路由配置
3. 更新主進程加載邏輯

### 添加數據庫

1. 安裝 better-sqlite3
2. 創建數據庫模組
3. 在主進程中使用
4. 通過 IPC 暴露查詢 API

### 添加自動更新

1. 安裝 electron-updater
2. 配置更新伺服器
3. 在主進程中實現檢查邏輯
4. 添加 UI 提示

## 總結

這個架構設計體現了：

- ✅ **關注點分離**: 主進程、渲染進程各司其職
- ✅ **安全第一**: 遵循 Electron 安全最佳實踐
- ✅ **模組化**: 清晰的模組邊界
- ✅ **可測試**: 邏輯與視圖分離
- ✅ **可擴展**: 易於添加新功能
- ✅ **高性能**: Vue 3 + Vite 快速開發

適合作為生產級 Electron + Vue 應用的基礎架構。
