# PWA Todo List - Progressive Web App

> 一個功能完整的 Progressive Web App (PWA) 待辦事項應用，展示現代 Web 技術的最佳實踐

![PWA](https://img.shields.io/badge/PWA-Ready-success?style=for-the-badge)
![Service Worker](https://img.shields.io/badge/Service_Worker-Active-blue?style=for-the-badge)
![IndexedDB](https://img.shields.io/badge/IndexedDB-Enabled-orange?style=for-the-badge)
![Offline](https://img.shields.io/badge/Offline-Capable-green?style=for-the-badge)

## 目錄

- [專案概述](#專案概述)
- [什麼是 PWA](#什麼是-pwa)
- [核心特性](#核心特性)
- [技術架構](#技術架構)
- [快速開始](#快速開始)
- [專案結構](#專案結構)
- [詳細說明](#詳細說明)
  - [Service Worker](#service-worker)
  - [Web App Manifest](#web-app-manifest)
  - [IndexedDB](#indexeddb)
  - [緩存策略](#緩存策略)
- [PWA 核心技術](#pwa-核心技術)
- [離線功能](#離線功能)
- [安裝體驗](#安裝體驗)
- [推送通知](#推送通知)
- [性能優化](#性能優化)
- [部署指南](#部署指南)
- [測試與驗證](#測試與驗證)
- [瀏覽器支援](#瀏覽器支援)
- [與原生應用對比](#與原生應用對比)
- [最佳實踐](#最佳實踐)
- [故障排除](#故障排除)
- [進階主題](#進階主題)
- [參考資源](#參考資源)

---

## 專案概述

這是一個使用原生 JavaScript 開發的 Progressive Web App (PWA) 待辦事項應用，完整實現了 PWA 的所有核心特性。本專案旨在展示如何將傳統 Web 應用轉換為具有原生應用體驗的 PWA。

### 主要亮點

- ✅ **完全離線可用** - 使用 Service Worker 和 IndexedDB
- ✅ **安裝到設備** - 支援安裝到桌面和主屏幕
- ✅ **原生體驗** - 全屏模式、快速啟動、原生動畫
- ✅ **響應式設計** - 適配所有設備和屏幕尺寸
- ✅ **推送通知** - 支援瀏覽器推送通知（可選）
- ✅ **後台同步** - 網絡恢復時自動同步數據
- ✅ **快速加載** - 智能緩存策略，秒速啟動
- ✅ **離線優先** - Network First + Cache Fallback

### 為什麼選擇 PWA？

| 特性 | 傳統 Web App | PWA | 原生 App |
|------|-------------|-----|----------|
| 離線訪問 | ❌ | ✅ | ✅ |
| 安裝到設備 | ❌ | ✅ | ✅ |
| 推送通知 | 部分支援 | ✅ | ✅ |
| 應用商店分發 | ❌ | ✅ (部分) | ✅ |
| 開發成本 | 低 | 低-中 | 高 |
| 跨平台 | ✅ | ✅ | ❌ |
| 自動更新 | ✅ | ✅ | 部分 |
| SEO 友好 | ✅ | ✅ | ❌ |
| 無需下載 | ✅ | ✅ | ❌ |

---

## 什麼是 PWA

### 定義

Progressive Web App (漸進式網絡應用) 是一種使用現代 Web 技術構建的應用程序，結合了 Web 和原生應用的最佳特性。

### 核心原則

1. **漸進式 (Progressive)** - 適用於所有用戶，無論使用何種瀏覽器
2. **響應式 (Responsive)** - 適配任何設備：桌面、平板、手機
3. **連接獨立 (Connectivity Independent)** - 在離線或低質量網絡下可用
4. **類應用 (App-like)** - 具有原生應用的交互和導航體驗
5. **持續更新 (Fresh)** - 始終保持最新（通過 Service Worker）
6. **安全 (Safe)** - 必須通過 HTTPS 提供
7. **可發現 (Discoverable)** - 可被搜索引擎識別為「應用程序」
8. **可重新互動 (Re-engageable)** - 通過推送通知等功能重新吸引用戶
9. **可安裝 (Installable)** - 用戶可以將其「保留」在主屏幕
10. **可鏈接 (Linkable)** - 易於通過 URL 分享

### PWA 的三大支柱

```
┌─────────────────────────────────────┐
│         Progressive Web App          │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │    Service Worker            │  │
│  │  (離線功能、緩存、後台同步)    │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │    Web App Manifest          │  │
│  │  (安裝體驗、主題、圖標)        │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │    HTTPS                     │  │
│  │  (安全連接、必要條件)          │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

## 核心特性

### 1. 離線功能

```javascript
// Service Worker 攔截網絡請求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

**功能說明**：
- 完全離線可用
- 自動緩存靜態資源
- 智能數據同步
- 離線狀態提示

### 2. 安裝體驗

```javascript
// 監聽安裝提示事件
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  // 顯示自定義安裝按鈕
  showInstallBanner();
});
```

**安裝後的優勢**：
- 從主屏幕啟動
- 全屏顯示（無瀏覽器 UI）
- 應用切換器中顯示
- 啟動畫面

### 3. 推送通知

```javascript
// 請求通知權限
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    // 訂閱推送服務
    subscribeUserToPush();
  }
});
```

**通知場景**：
- 任務提醒
- 同步完成通知
- 重要更新提醒

### 4. 後台同步

```javascript
// 註冊後台同步
navigator.serviceWorker.ready.then(registration => {
  return registration.sync.register('sync-todos');
});
```

**同步策略**：
- 網絡恢復時自動同步
- 失敗重試機制
- 同步狀態反饋

### 5. 快速加載

**性能指標**：
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

### 6. 數據持久化

```javascript
// IndexedDB 存儲
const db = await idb.openDB('TodoDB', 1, {
  upgrade(db) {
    db.createObjectStore('todos', { keyPath: 'id' });
  }
});
```

**存儲策略**：
- IndexedDB 本地存儲
- 支援大量數據
- 結構化數據查詢
- 離線完全可用

---

## 技術架構

### 技術棧

| 技術 | 用途 | 版本 |
|------|------|------|
| **HTML5** | 結構和語義化標記 | - |
| **CSS3** | 樣式和響應式設計 | - |
| **JavaScript (ES6+)** | 應用邏輯 | ES2015+ |
| **Service Worker API** | 離線功能、緩存 | - |
| **IndexedDB** | 本地數據存儲 | v2 |
| **Web App Manifest** | 安裝體驗 | - |
| **Cache API** | 資源緩存 | - |
| **Fetch API** | 網絡請求 | - |
| **Notification API** | 推送通知 | - |
| **Background Sync API** | 後台同步 | - |

### 架構圖

```
┌─────────────────────────────────────────────────────────┐
│                      User Interface                      │
│                     (index.html + CSS)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Logic                      │
│                       (app.js)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ UI Manager   │  │ Event Handler│  │ State Manager│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────┬────────────────────────────┬───────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────┐    ┌─────────────────────────┐
│   IndexedDB (db.js)    │    │  Service Worker         │
│  ┌──────────────────┐  │    │  (service-worker.js)    │
│  │ CRUD Operations  │  │    │  ┌──────────────────┐   │
│  │ Data Persistence │  │    │  │ Caching Strategy │   │
│  │ Search & Filter  │  │    │  │ Offline Support  │   │
│  └──────────────────┘  │    │  │ Background Sync  │   │
└────────────────────────┘    │  │ Push Notifications│   │
                               │  └──────────────────┘   │
                               └─────────────────────────┘
                                          │
                                          ▼
                               ┌─────────────────────────┐
                               │     Cache Storage       │
                               │  ┌──────────────────┐   │
                               │  │ Static Assets    │   │
                               │  │ API Responses    │   │
                               │  │ Images          │   │
                               │  └──────────────────┘   │
                               └─────────────────────────┘
```

### 數據流

```
用戶操作
   │
   ▼
UI 事件 ──────────────────────────────────┐
   │                                      │
   ▼                                      │
App Logic                                 │
   │                                      │
   ├──► IndexedDB ──► 本地存儲             │
   │                                      │
   ├──► Service Worker ──► Cache Storage  │
   │                     └──► Network     │
   │                                      │
   └──────────────────────────────────────┘
```

---

## 快速開始

### 前置要求

1. **現代瀏覽器**（支援 Service Worker）
   - Chrome 45+
   - Firefox 44+
   - Safari 11.1+
   - Edge 17+

2. **本地開發服務器**（Service Worker 需要 HTTPS 或 localhost）
   - Node.js http-server
   - Python SimpleHTTPServer
   - VS Code Live Server
   - 或任何靜態文件服務器

3. **HTTPS 環境**（生產部署必需）
   - Let's Encrypt（免費）
   - Cloudflare（免費 CDN + SSL）
   - Netlify / Vercel（免費託管）

### 本地運行

#### 方法 1: 使用 Node.js http-server

```bash
# 安裝 http-server
npm install -g http-server

# 進入專案目錄
cd 10-pwa/01-vanilla-pwa

# 啟動服務器
http-server -p 8080

# 瀏覽器訪問
open http://localhost:8080
```

#### 方法 2: 使用 Python

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# 瀏覽器訪問
open http://localhost:8080
```

#### 方法 3: 使用 VS Code Live Server

1. 安裝 "Live Server" 擴展
2. 右鍵點擊 `index.html`
3. 選擇 "Open with Live Server"

#### 方法 4: 使用 npx (無需全局安裝)

```bash
npx http-server -p 8080
```

### 驗證 PWA 功能

1. **開啟 Chrome DevTools**
   - 按 F12 或 Ctrl+Shift+I (Windows) / Cmd+Option+I (Mac)

2. **檢查 Service Worker**
   - 進入 Application 標籤
   - 左側選擇 Service Workers
   - 確認 Service Worker 已註冊並 activated

3. **檢查 Manifest**
   - Application 標籤 > Manifest
   - 確認所有欄位正確顯示

4. **測試離線功能**
   - Network 標籤 > 勾選 "Offline"
   - 重新整理頁面
   - 應用應該仍然可用

5. **運行 Lighthouse**
   - 進入 Lighthouse 標籤
   - 選擇 "Progressive Web App"
   - 點擊 "Generate report"
   - 目標：PWA 評分 > 90

---

## 專案結構

```
10-pwa/01-vanilla-pwa/
│
├── index.html                 # 主頁面（應用入口）
├── manifest.json             # Web App Manifest（PWA 配置）
├── service-worker.js         # Service Worker（離線、緩存）
│
├── css/
│   └── style.css            # 樣式表（響應式設計）
│
├── js/
│   ├── app.js               # 主應用邏輯
│   └── db.js                # IndexedDB 操作
│
├── icons/                    # PWA 圖標
│   ├── icon-32x32.png       # Favicon
│   ├── icon-72x72.png       # iOS 主屏幕
│   ├── icon-96x96.png       # Android 低解析度
│   ├── icon-128x128.png     # Chrome Web Store
│   ├── icon-144x144.png     # Windows 開始畫面
│   ├── icon-152x152.png     # iPad 主屏幕
│   ├── icon-180x180.png     # iPhone 主屏幕
│   ├── icon-192x192.png     # Android 主屏幕（標準）
│   ├── icon-384x384.png     # Android 啟動畫面
│   ├── icon-512x512.png     # Android 高解析度
│   ├── icon-template.svg    # SVG 圖標模板
│   └── ICON_GENERATION_GUIDE.md  # 圖標生成指南
│
└── README.md                 # 專案文檔（本檔案）
```

### 檔案說明

#### index.html
- 應用的 HTML 結構
- 引用 manifest.json
- 包含 meta 標籤（viewport, theme-color 等）
- 載入 CSS 和 JavaScript

#### manifest.json
- 應用名稱、短名稱
- 圖標（各種尺寸）
- 主題色、背景色
- 顯示模式（standalone）
- 啟動 URL
- 應用描述

#### service-worker.js
- 緩存策略實現
- Fetch 事件攔截
- 後台同步邏輯
- 推送通知處理

#### js/app.js
- UI 交互邏輯
- 事件處理
- Service Worker 註冊
- PWA 安裝提示
- 狀態管理

#### js/db.js
- IndexedDB 初始化
- CRUD 操作
- 數據查詢和過濾
- 匯入/匯出功能

#### css/style.css
- 響應式佈局
- CSS 變量（主題）
- 動畫和過渡效果
- 深色模式支援

---

## 詳細說明

### Service Worker

#### 什麼是 Service Worker？

Service Worker 是一個在瀏覽器背景運行的腳本，獨立於網頁，為 PWA 提供核心功能：

- **攔截網絡請求** - 可以控制所有網絡流量
- **緩存管理** - 智能緩存靜態和動態資源
- **離線支援** - 在無網絡時提供緩存內容
- **後台同步** - 網絡恢復時同步數據
- **推送通知** - 接收和顯示推送消息

#### Service Worker 生命週期

```
註冊 (Register)
    ↓
安裝 (Install)
    ↓
等待 (Waiting) ←──────┐
    ↓                  │
激活 (Activate)        │
    ↓                  │
空閒 (Idle)           │
    ↓                  │
監聽事件              │
(Fetch, Sync, Push)   │
    ↓                  │
終止 (Terminated) ─────┘
```

#### 註冊 Service Worker

```javascript
// app.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('SW registered:', registration.scope);
    })
    .catch(error => {
      console.error('SW registration failed:', error);
    });
}
```

#### 安裝事件

```javascript
// service-worker.js
const CACHE_NAME = 'pwa-todo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/db.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});
```

**說明**：
- `event.waitUntil()` - 延長事件生命週期直到 Promise 完成
- `caches.open()` - 打開或創建緩存
- `cache.addAll()` - 批量緩存資源
- `self.skipWaiting()` - 立即激活新 Service Worker

#### 激活事件

```javascript
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});
```

**說明**：
- 清理舊版本緩存
- `self.clients.claim()` - 立即控制所有頁面

#### Fetch 事件

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 緩存命中，返回緩存
        if (response) {
          return response;
        }

        // 緩存未命中，發起網絡請求
        return fetch(event.request).then(response => {
          // 檢查響應是否有效
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆響應（因為 response 只能使用一次）
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
  );
});
```

#### Service Worker 調試

**Chrome DevTools**：
1. Application > Service Workers
2. 查看狀態、更新、註銷
3. 模擬離線、更新事件

**常用命令**：
```javascript
// 註銷所有 Service Workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});

// 清除所有緩存
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
```

---

### Web App Manifest

#### 什麼是 Web App Manifest？

Web App Manifest 是一個 JSON 檔案，提供應用的元數據，讓瀏覽器知道如何安裝和顯示 PWA。

#### 完整的 Manifest 範例

```json
{
  "name": "PWA Todo List - Progressive Web App",
  "short_name": "PWA Todo",
  "description": "一個功能完整的 PWA 待辦事項應用",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#4CAF50",
  "background_color": "#ffffff",
  "lang": "zh-TW",
  "dir": "ltr",
  "categories": ["productivity", "utilities"],
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "screenshots/mobile-1.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "新增待辦事項",
      "url": "/?action=add",
      "icons": [
        {
          "src": "icons/shortcut-add.png",
          "sizes": "192x192"
        }
      ]
    }
  ]
}
```

#### 欄位詳解

**name** (必需)
- 應用的完整名稱
- 顯示在安裝提示、應用列表
- 建議長度：< 45 字符

**short_name** (必需)
- 應用的簡短名稱
- 當空間有限時使用（如主屏幕）
- 建議長度：< 12 字符

**description**
- 應用描述
- 用於應用商店、搜索結果
- 建議長度：< 300 字符

**start_url** (必需)
- 應用啟動時的 URL
- 可以包含查詢參數（追蹤來源）
- 例如：`/?utm_source=homescreen`

**scope**
- 定義應用的導航範圍
- 超出範圍會在瀏覽器中打開
- 預設為 start_url 的路徑

**display** (必需)
- `standalone` - 獨立應用（推薦）
- `fullscreen` - 全屏
- `minimal-ui` - 最小 UI
- `browser` - 瀏覽器模式

**orientation**
- 應用的默認方向
- `portrait-primary` - 豎屏
- `landscape-primary` - 橫屏
- `any` - 任意方向

**theme_color** (必需)
- 應用的主題顏色
- 影響狀態欄、地址欄
- 使用十六進制顏色碼

**background_color**
- 啟動畫面背景色
- 建議與 CSS background 一致

**icons** (必需)
- 應用圖標陣列
- 至少需要 192x192 和 512x512
- `purpose: "maskable"` - 適配不同形狀

**screenshots**
- 應用截圖（應用商店）
- 支援手機和桌面尺寸

**shortcuts**
- 應用快捷方式（長按圖標）
- 最多 4 個

#### 在 HTML 中引用

```html
<link rel="manifest" href="/manifest.json">

<!-- 為舊版 iOS 提供 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="PWA Todo">
<link rel="apple-touch-icon" href="icons/icon-180x180.png">

<!-- 為 Windows 提供 -->
<meta name="msapplication-TileImage" content="icons/icon-144x144.png">
<meta name="msapplication-TileColor" content="#4CAF50">
```

---

### IndexedDB

#### 什麼是 IndexedDB？

IndexedDB 是瀏覽器內建的 NoSQL 數據庫，用於客戶端存儲大量結構化數據。

**特點**：
- 異步 API（不阻塞 UI）
- 支援事務（Transaction）
- 索引查詢
- 存儲容量大（通常 > 50MB）
- 支援複雜數據類型

#### 數據庫設計

```javascript
// 數據庫結構
Database: PWATodoDB
  ObjectStore: todos
    keyPath: id (自動遞增)
    Indexes:
      - completed (boolean)
      - createdAt (timestamp)
      - text (string)

// Todo 對象結構
{
  id: 1,                    // 主鍵（自動生成）
  text: "學習 PWA",          // 任務內容
  completed: false,         // 完成狀態
  createdAt: 1234567890,    // 創建時間戳
  updatedAt: 1234567890     // 更新時間戳
}
```

#### 初始化數據庫

```javascript
class TodoDB {
  constructor() {
    this.dbName = 'PWATodoDB';
    this.dbVersion = 1;
    this.storeName = 'todos';
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 創建 object store
        const objectStore = db.createObjectStore(this.storeName, {
          keyPath: 'id',
          autoIncrement: true
        });

        // 創建索引
        objectStore.createIndex('completed', 'completed', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        objectStore.createIndex('text', 'text', { unique: false });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }
}
```

#### CRUD 操作

**Create（新增）**：
```javascript
async add(todo) {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const objectStore = transaction.objectStore(this.storeName);

    const todoData = {
      text: todo.text,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const request = objectStore.add(todoData);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

**Read（讀取）**：
```javascript
async getAll() {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const objectStore = transaction.objectStore(this.storeName);
    const request = objectStore.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async get(id) {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const objectStore = transaction.objectStore(this.storeName);
    const request = objectStore.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

**Update（更新）**：
```javascript
async update(todo) {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const objectStore = transaction.objectStore(this.storeName);

    const todoData = {
      ...todo,
      updatedAt: Date.now()
    };

    const request = objectStore.put(todoData);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
```

**Delete（刪除）**：
```javascript
async delete(id) {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const objectStore = transaction.objectStore(this.storeName);
    const request = objectStore.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
```

#### 使用索引查詢

```javascript
// 查詢已完成的任務
async getCompleted() {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const objectStore = transaction.objectStore(this.storeName);
    const index = objectStore.index('completed');
    const request = index.getAll(true);  // true = 已完成

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 使用游標（Cursor）遍歷
async filterByDate(startDate, endDate) {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction([this.storeName], 'readonly');
    const objectStore = transaction.objectStore(this.storeName);
    const index = objectStore.index('createdAt');

    const range = IDBKeyRange.bound(startDate, endDate);
    const request = index.openCursor(range);

    const results = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };

    request.onerror = () => reject(request.error);
  });
}
```

#### 數據匯入/匯出

```javascript
// 匯出為 JSON
async exportToJSON() {
  const todos = await this.getAll();
  return JSON.stringify({
    version: this.dbVersion,
    exportDate: new Date().toISOString(),
    todos: todos
  }, null, 2);
}

// 從 JSON 匯入
async importFromJSON(jsonString) {
  const data = JSON.parse(jsonString);

  // 批量新增
  const transaction = this.db.transaction([this.storeName], 'readwrite');
  const objectStore = transaction.objectStore(this.storeName);

  data.todos.forEach(todo => {
    objectStore.add(todo);
  });

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(data.todos.length);
    transaction.onerror = () => reject(transaction.error);
  });
}
```

---

### 緩存策略

PWA 的性能很大程度取決於緩存策略的選擇。本應用實現了多種策略：

#### 1. Cache First（緩存優先）

```javascript
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;  // 緩存命中，直接返回
  }

  // 緩存未命中，從網絡獲取
  const networkResponse = await fetch(request);

  // 緩存新資源
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, networkResponse.clone());

  return networkResponse;
}
```

**適用場景**：
- 靜態資源（HTML, CSS, JS, 圖片）
- 不常變化的內容
- 性能優先

**優點**：
- 極快的響應速度
- 完全離線可用
- 減少網絡流量

**缺點**：
- 可能顯示過時內容
- 需要手動更新策略

#### 2. Network First（網絡優先）

```javascript
async function networkFirstStrategy(request) {
  try {
    // 優先從網絡獲取
    const networkResponse = await fetch(request);

    // 更新緩存
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    // 網絡失敗，嘗試緩存
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}
```

**適用場景**：
- API 請求
- 動態內容
- 需要最新數據

**優點**：
- 始終獲取最新內容
- 離線時有降級方案

**缺點**：
- 響應較慢
- 依賴網絡連接

#### 3. Stale While Revalidate（後台更新）

```javascript
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // 在後台更新緩存
  const fetchPromise = fetch(request).then(networkResponse => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  });

  // 立即返回緩存（如果存在）或等待網絡
  return cachedResponse || fetchPromise;
}
```

**適用場景**：
- 頻繁更新但不需要實時的內容
- 平衡性能和新鮮度

**優點**：
- 快速響應
- 後台自動更新
- 最佳用戶體驗

**缺點**：
- 可能短暫顯示舊內容
- 額外的網絡請求

#### 4. Network Only（僅網絡）

```javascript
async function networkOnlyStrategy(request) {
  return fetch(request);  // 永遠從網絡獲取
}
```

**適用場景**：
- 必須實時的數據
- 安全敏感內容
- 個性化內容

#### 5. Cache Only（僅緩存）

```javascript
async function cacheOnlyStrategy(request) {
  return caches.match(request);  // 僅從緩存讀取
}
```

**適用場景**：
- 完全離線的應用
- 預緩存的資源

#### 策略選擇建議

| 資源類型 | 推薦策略 | 原因 |
|---------|---------|------|
| HTML 頁面 | Network First | 需要最新內容，離線降級 |
| CSS/JS | Cache First | 版本控制，性能優先 |
| 圖片 | Cache First | 不常變化，節省流量 |
| API 數據 | Network First | 需要最新數據 |
| 字體 | Cache First | 不會變化 |
| 用戶頭像 | Stale While Revalidate | 平衡性能和新鮮度 |

#### 本應用的策略實現

```javascript
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 請求：Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // 靜態資源：Cache First
  event.respondWith(cacheFirstStrategy(request));
});
```

---

## PWA 核心技術

### 1. 應用外殼架構（App Shell）

App Shell 是 PWA 的核心架構模式，將應用的 UI 外殼與內容分離。

```
┌─────────────────────────────┐
│       App Shell (緩存)       │
│  ┌─────────────────────────┐│
│  │      Header (固定)      ││
│  ├─────────────────────────┤│
│  │                         ││
│  │   Dynamic Content       ││
│  │   (動態載入)            ││
│  │                         ││
│  ├─────────────────────────┤│
│  │      Footer (固定)      ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

**優勢**：
- 即時載入 UI 框架
- 內容按需載入
- 類原生應用體驗

### 2. 預緩存 (Precaching)

在 Service Worker 安裝時緩存關鍵資源：

```javascript
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/db.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
  );
});
```

### 3. 運行時緩存 (Runtime Caching)

在應用運行時動態緩存資源：

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).then(fetchResponse => {
        return caches.open(RUNTIME_CACHE).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
```

### 4. 緩存版本管理

```javascript
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `pwa-todo-${CACHE_VERSION}`;

// 激活時清理舊緩存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});
```

### 5. 更新策略

```javascript
// 檢查更新
navigator.serviceWorker.register('/service-worker.js').then(reg => {
  reg.addEventListener('updatefound', () => {
    const newWorker = reg.installing;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // 有新版本可用
        showUpdateNotification();
      }
    });
  });
});

// 強制更新
function forceUpdate() {
  navigator.serviceWorker.getRegistration().then(reg => {
    if (reg && reg.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}
```

---

## 離線功能

### 離線檢測

```javascript
// 檢查當前網絡狀態
const isOnline = navigator.onLine;

// 監聽網絡狀態變化
window.addEventListener('online', () => {
  console.log('網絡已恢復');
  showOnlineIndicator();
  syncData();
});

window.addEventListener('offline', () => {
  console.log('網絡已斷開');
  showOfflineIndicator();
});
```

### 離線提示 UI

```html
<div id="offlineIndicator" class="offline-indicator hidden">
  <svg><!-- 圖標 --></svg>
  <span>離線模式</span>
</div>
```

```javascript
function showOfflineIndicator() {
  const indicator = document.getElementById('offlineIndicator');
  indicator.classList.remove('hidden');

  setTimeout(() => {
    indicator.classList.add('hidden');
  }, 3000);
}
```

### 離線數據同步

```javascript
// 後台同步 API
if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker.registration) {
  // 註冊同步事件
  navigator.serviceWorker.ready.then(registration => {
    return registration.sync.register('sync-todos');
  });
}

// Service Worker 中處理同步
self.addEventListener('sync', event => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(syncTodosWithServer());
  }
});

async function syncTodosWithServer() {
  // 獲取本地待同步的數據
  const pendingTodos = await getPendingTodos();

  // 發送到服務器
  for (const todo of pendingTodos) {
    try {
      await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(todo)
      });
      // 標記為已同步
      await markAsSynced(todo.id);
    } catch (error) {
      console.error('同步失敗:', error);
      // 保留以便下次重試
    }
  }
}
```

### 離線回退頁面

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // 網絡失敗，返回離線頁面
      if (event.request.destination === 'document') {
        return caches.match('/offline.html');
      }
    })
  );
});
```

---

## 安裝體驗

### beforeinstallprompt 事件

```javascript
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // 阻止瀏覽器默認安裝提示
  e.preventDefault();

  // 保存事件以便後續使用
  deferredPrompt = e;

  // 顯示自定義安裝按鈕
  showInstallButton();
});
```

### 自定義安裝提示

```javascript
async function installPWA() {
  if (!deferredPrompt) {
    console.log('安裝提示不可用');
    return;
  }

  // 顯示安裝提示
  deferredPrompt.prompt();

  // 等待用戶響應
  const { outcome } = await deferredPrompt.userChoice;

  console.log(`用戶選擇: ${outcome}`);

  // 清除事件
  deferredPrompt = null;
}
```

### 安裝成功檢測

```javascript
window.addEventListener('appinstalled', () => {
  console.log('PWA 已成功安裝');

  // 隱藏安裝按鈕
  hideInstallButton();

  // 顯示感謝消息
  showToast('感謝您安裝我們的應用！');

  // 發送分析事件
  gtag('event', 'pwa_installed');
});
```

### 檢測獨立模式

```javascript
function isStandalone() {
  // 方法 1: matchMedia
  const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;

  // 方法 2: iOS Safari
  const isStandaloneIOS = window.navigator.standalone === true;

  // 方法 3: Android
  const isStandaloneAndroid = document.referrer.includes('android-app://');

  return isStandaloneMedia || isStandaloneIOS || isStandaloneAndroid;
}

if (isStandalone()) {
  console.log('以 PWA 模式運行');
  // 隱藏瀏覽器特定的 UI
  hideBrowserUI();
}
```

### iOS 安裝指南

iOS Safari 不支援自動安裝提示，需要手動引導：

```javascript
function showIOSInstallInstructions() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = window.navigator.standalone === true;

  if (isIOS && !isInStandaloneMode) {
    showModal(`
      <h3>安裝到主屏幕</h3>
      <ol>
        <li>點擊分享按鈕 <img src="share-icon.png"></li>
        <li>選擇「加入主屏幕」</li>
        <li>點擊「加入」</li>
      </ol>
    `);
  }
}
```

---

## 推送通知

### 請求權限

```javascript
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('此瀏覽器不支援通知');
    return false;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    console.log('通知權限已授予');
    return true;
  } else {
    console.log('通知權限被拒絕');
    return false;
  }
}
```

### 顯示通知

```javascript
// 簡單通知
function showSimpleNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/icons/icon-192x192.png'
    });
  }
}

// Service Worker 通知（支援離線）
navigator.serviceWorker.ready.then(registration => {
  registration.showNotification('PWA Todo', {
    body: '您有新的待辦事項',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'todo-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: '查看',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: '關閉',
        icon: '/icons/action-dismiss.png'
      }
    ],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  });
});
```

### 處理通知點擊

```javascript
// Service Worker 中
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    // 打開應用
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // 如果已有窗口打開，聚焦
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // 否則打開新窗口
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
```

### 推送訂閱（完整實現）

```javascript
// 訂閱推送
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  // 發送訂閱信息到服務器
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  });

  console.log('推送訂閱成功');
}

// 工具函數：轉換 VAPID 密鑰
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
```

### 接收推送消息

```javascript
// Service Worker 中
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || '您有新消息',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'PWA Todo', options)
  );
});
```

---

## 性能優化

### 1. 關鍵渲染路徑優化

```html
<!-- 內聯關鍵 CSS -->
<style>
  /* 首屏必需樣式 */
  body { margin: 0; font-family: sans-serif; }
  .app-header { background: #4CAF50; }
</style>

<!-- 異步載入非關鍵 CSS -->
<link rel="preload" href="css/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/style.css"></noscript>
```

### 2. JavaScript 優化

```html
<!-- 延遲載入非關鍵 JS -->
<script src="js/app.js" defer></script>

<!-- 模塊化載入 -->
<script type="module" src="js/app.js"></script>
```

### 3. 圖片優化

```html
<!-- 響應式圖片 -->
<img
  srcset="
    icons/icon-192x192.png 192w,
    icons/icon-384x384.png 384w,
    icons/icon-512x512.png 512w
  "
  sizes="(max-width: 600px) 192px, 384px"
  src="icons/icon-384x384.png"
  alt="App Icon"
  loading="lazy"
>

<!-- WebP 格式支援 -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Image">
</picture>
```

### 4. 字體優化

```css
/* 字體顯示策略 */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* 立即使用備用字體 */
}

/* 預載入關鍵字體 */
```

```html
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

### 5. 預連接

```html
<!-- 預連接到關鍵域名 -->
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://api.example.com">

<!-- 預載入關鍵資源 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="critical.js" as="script">
```

### 6. 代碼分割

```javascript
// 動態導入
async function loadAnalytics() {
  const analytics = await import('./analytics.js');
  analytics.init();
}

// 路由級代碼分割
const routes = {
  '/': () => import('./pages/Home.js'),
  '/settings': () => import('./pages/Settings.js')
};
```

### 7. 性能監控

```javascript
// Performance API
const perfData = performance.getEntriesByType('navigation')[0];
console.log('頁面載入時間:', perfData.loadEventEnd - perfData.fetchStart);

// User Timing API
performance.mark('start-render');
// ... 渲染代碼 ...
performance.mark('end-render');
performance.measure('render-time', 'start-render', 'end-render');

const renderMeasure = performance.getEntriesByName('render-time')[0];
console.log('渲染時間:', renderMeasure.duration);
```

### 8. 壓縮與最小化

```bash
# HTML 壓縮
html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html

# CSS 壓縮
cssnano style.css style.min.css

# JavaScript 壓縮
terser app.js -o app.min.js --compress --mangle

# Gzip 壓縮
gzip -9 -k index.html
gzip -9 -k style.css
gzip -9 -k app.js
```

---

## 部署指南

### HTTPS 要求

PWA **必須**通過 HTTPS 提供（除了 localhost）。

### 部署選項

#### 1. Netlify（推薦）

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 登入
netlify login

# 部署
netlify deploy --prod
```

**netlify.toml** 配置：
```toml
[build]
  publish = "."

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

#### 2. Vercel

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

**vercel.json** 配置：
```json
{
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

#### 3. GitHub Pages

```bash
# 推送到 gh-pages 分支
git subtree push --prefix 10-pwa/01-vanilla-pwa origin gh-pages
```

**注意**：GitHub Pages 自動提供 HTTPS。

#### 4. Firebase Hosting

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入
firebase login

# 初始化
firebase init hosting

# 部署
firebase deploy
```

**firebase.json** 配置：
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

### Service Worker 緩存控制

**重要**：Service Worker 檔案不應該被長期緩存。

```nginx
# Nginx 配置
location /service-worker.js {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
  add_header Pragma "no-cache";
  add_header Expires "0";
}
```

```apache
# Apache .htaccess
<Files "service-worker.js">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires "0"
</Files>
```

---

## 測試與驗證

### Lighthouse 測試

#### Chrome DevTools

1. 開啟 DevTools (F12)
2. 進入 Lighthouse 標籤
3. 勾選 "Progressive Web App"
4. 點擊 "Generate report"

#### CLI 使用

```bash
# 安裝
npm install -g lighthouse

# 運行測試
lighthouse https://your-pwa.com --view

# 只測試 PWA
lighthouse https://your-pwa.com --only-categories=pwa --view

# 輸出 JSON
lighthouse https://your-pwa.com --output=json --output-path=./report.json
```

### PWA 檢查清單

- [ ] **HTTPS** - 必須使用安全連接
- [ ] **Service Worker** - 已註冊並激活
- [ ] **Manifest** - 包含所有必需欄位
- [ ] **圖標** - 192x192 和 512x512 PNG
- [ ] **離線** - 離線時可訪問
- [ ] **可安裝** - 顯示安裝提示
- [ ] **全屏** - display: standalone
- [ ] **主題色** - theme-color 設定
- [ ] **視口** - viewport meta 標籤
- [ ] **性能** - Lighthouse 評分 > 90

### 手動測試

#### 離線測試

1. 開啟應用
2. DevTools > Network > Offline
3. 重新整理頁面
4. 驗證應用仍可使用

#### 安裝測試

**桌面 (Chrome)**:
1. 地址欄右側應顯示安裝圖標
2. 點擊安裝
3. 驗證應用出現在應用列表

**Android**:
1. Chrome 菜單 > "加到主屏幕"
2. 從主屏幕啟動
3. 驗證全屏顯示

**iOS**:
1. Safari 分享按鈕
2. "加入主屏幕"
3. 從主屏幕啟動

#### 更新測試

1. 修改 Service Worker 版本號
2. 部署新版本
3. 訪問應用
4. 驗證顯示更新通知

### 自動化測試

```javascript
// test/pwa.test.js
describe('PWA Tests', () => {
  it('應該註冊 Service Worker', async () => {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    expect(registration).toBeDefined();
  });

  it('應該緩存關鍵資源', async () => {
    const cache = await caches.open('pwa-todo-v1');
    const cachedRequests = await cache.keys();
    expect(cachedRequests.length).toBeGreaterThan(0);
  });

  it('應該在離線時可用', async () => {
    // 模擬離線
    await page.setOfflineMode(true);
    await page.reload();

    const title = await page.title();
    expect(title).toBe('PWA Todo List');
  });
});
```

---

## 瀏覽器支援

### 功能支援表

| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Service Worker | 40+ | 44+ | 11.1+ | 17+ |
| Web App Manifest | 39+ | ❌* | 11.3+ | 79+ |
| IndexedDB | 24+ | 16+ | 10+ | 12+ |
| Cache API | 40+ | 41+ | 11.1+ | 17+ |
| Push Notifications | 42+ | 44+ | 16+ | 17+ |
| Background Sync | 49+ | ❌ | ❌ | 79+ |
| App Install | 68+ | ❌ | ✅** | 79+ |

*Firefox Android 支援部分功能
**iOS 使用 "Add to Home Screen"

### 功能檢測

```javascript
// Service Worker
if ('serviceWorker' in navigator) {
  // 支援 Service Worker
}

// Push Notifications
if ('Notification' in window) {
  // 支援通知
}

// Background Sync
if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker.registration) {
  // 支援後台同步
}

// IndexedDB
if ('indexedDB' in window) {
  // 支援 IndexedDB
}

// 安裝提示
window.addEventListener('beforeinstallprompt', (e) => {
  // 支援 PWA 安裝
});
```

### Polyfills

對於不支援的瀏覽器，可以使用 polyfills：

```html
<!-- IndexedDB Polyfill -->
<script src="https://cdn.jsdelivr.net/npm/idb@7/build/umd.js"></script>

<!-- Service Worker 降級方案 -->
<script>
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker 不支援，使用 localStorage 備份');
    // 實現 localStorage 備份邏輯
  }
</script>
```

---

## 與原生應用對比

### 優勢對比

| 特性 | PWA | 原生應用 |
|------|-----|---------|
| **開發成本** | ✅ 低（一次開發） | ❌ 高（多平台） |
| **分發** | ✅ URL 即可 | ❌ 應用商店審核 |
| **更新** | ✅ 即時自動 | ❌ 需用戶手動 |
| **跨平台** | ✅ 完全跨平台 | ❌ 需分別開發 |
| **SEO** | ✅ 可索引 | ❌ 不可索引 |
| **離線功能** | ✅ 支援 | ✅ 支援 |
| **推送通知** | ✅ 支援 | ✅ 支援 |
| **設備訪問** | ⚠️ 部分支援 | ✅ 完全支援 |
| **性能** | ⚠️ 略遜 | ✅ 最佳 |
| **應用商店** | ⚠️ 部分支援 | ✅ 完全支援 |

### 何時選擇 PWA

**適合 PWA 的場景**：
- 內容驅動型應用
- 需要快速迭代
- 跨平台要求高
- 預算有限
- SEO 重要
- 輕量級應用

**適合原生應用的場景**：
- 需要深度系統集成
- 高性能遊戲
- 複雜的設備功能（藍牙、NFC 等）
- 企業級應用
- 需要應用商店曝光

### 混合策略

可以同時提供 PWA 和原生應用：

1. **PWA 優先** - 大部分用戶使用 PWA
2. **原生補充** - 需要高級功能的用戶下載原生應用
3. **共享代碼** - 使用 Ionic、Capacitor 等框架

---

## 最佳實踐

### 1. 性能最佳實踐

- ✅ 實現 PRPL 模式（Push, Render, Pre-cache, Lazy-load）
- ✅ 使用 App Shell 架構
- ✅ 優先載入關鍵資源
- ✅ 代碼分割和懶加載
- ✅ 壓縮和最小化資源
- ✅ 使用 CDN
- ✅ 啟用 HTTP/2

### 2. 離線最佳實踐

- ✅ 提供離線頁面
- ✅ 實現後台同步
- ✅ 顯示網絡狀態
- ✅ 緩存關鍵資源
- ✅ 提供離線降級體驗

### 3. 安裝最佳實踐

- ✅ 在合適時機顯示安裝提示
- ✅ 提供安裝價值說明
- ✅ 允許用戶稍後安裝
- ✅ 不過度打擾用戶
- ✅ 提供 iOS 安裝指南

### 4. 更新最佳實踐

- ✅ 通知用戶有新版本
- ✅ 提供手動更新選項
- ✅ 後台自動更新
- ✅ 版本號管理
- ✅ 更新日誌

### 5. 安全最佳實踐

- ✅ 使用 HTTPS
- ✅ 實現 CSP (Content Security Policy)
- ✅ 驗證用戶輸入
- ✅ 避免 XSS 攻擊
- ✅ 安全存儲敏感數據

### 6. 可訪問性最佳實踐

- ✅ 語義化 HTML
- ✅ ARIA 標籤
- ✅ 鍵盤導航
- ✅ 屏幕閱讀器支援
- ✅ 高對比度模式

### 7. SEO 最佳實踐

- ✅ 服務器端渲染（SSR）或預渲染
- ✅ 結構化數據
- ✅ 語義化標記
- ✅ Meta 標籤優化
- ✅ Sitemap

---

## 故障排除

### 常見問題

#### Q1: Service Worker 沒有註冊

**原因**：
- 不是 HTTPS 或 localhost
- 路徑錯誤
- 瀏覽器不支援

**解決方案**：
```javascript
// 檢查支援
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('註冊成功:', reg))
    .catch(err => console.error('註冊失敗:', err));
} else {
  console.error('Service Worker 不支援');
}
```

#### Q2: 安裝提示不顯示

**原因**：
- 不符合安裝條件
- manifest.json 配置錯誤
- Service Worker 未激活
- 已經安裝過

**檢查清單**：
```javascript
// Lighthouse > PWA 檢查
// DevTools > Application > Manifest
// 確認所有欄位正確

// 手動觸發（測試用）
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('安裝提示已觸發');
});
```

#### Q3: 離線不工作

**原因**：
- 資源未緩存
- 緩存策略錯誤
- Service Worker 未激活

**調試**：
```javascript
// 檢查緩存
caches.keys().then(keys => {
  console.log('緩存列表:', keys);
});

caches.open('cache-name').then(cache => {
  cache.keys().then(requests => {
    console.log('已緩存的資源:', requests.map(r => r.url));
  });
});
```

#### Q4: 更新不生效

**原因**：
- Service Worker 緩存
- 瀏覽器緩存
- 舊版本仍在運行

**解決方案**：
```javascript
// Service Worker 強制更新
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update();
});

// 跳過等待，立即激活
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});
```

#### Q5: IndexedDB 錯誤

**原因**：
- 數據庫版本衝突
- 存儲空間不足
- 私密模式限制

**解決方案**：
```javascript
// 刪除舊數據庫
indexedDB.deleteDatabase('PWATodoDB');

// 錯誤處理
const request = indexedDB.open('PWATodoDB', 1);

request.onerror = (event) => {
  console.error('數據庫錯誤:', event.target.error);

  if (event.target.error.name === 'QuotaExceededError') {
    alert('存儲空間不足');
  }
};
```

### 調試工具

```javascript
// 1. Service Worker 狀態
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('註冊狀態:', reg);
  console.log('Installing:', reg.installing);
  console.log('Waiting:', reg.waiting);
  console.log('Active:', reg.active);
});

// 2. 緩存檢查
async function checkCache() {
  const cacheNames = await caches.keys();
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const requests = await cache.keys();
    console.log(`緩存 ${name}:`, requests.map(r => r.url));
  }
}

// 3. 存儲使用情況
if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(estimate => {
    console.log('已使用:', estimate.usage);
    console.log('配額:', estimate.quota);
    console.log('使用率:', (estimate.usage / estimate.quota * 100).toFixed(2) + '%');
  });
}

// 4. 網絡狀態
console.log('在線狀態:', navigator.onLine);
console.log('連接類型:', navigator.connection?.effectiveType);
```

---

## 進階主題

### 1. Workbox

Workbox 是 Google 提供的 Service Worker 庫，簡化 PWA 開發。

```javascript
// 安裝
npm install workbox-cli --global

// 生成 Service Worker
workbox wizard

// workbox-config.js
module.exports = {
  globDirectory: '.',
  globPatterns: [
    '**/*.{html,css,js,png,jpg,json}'
  ],
  swDest: 'service-worker.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.example\.com/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 300
        }
      }
    }
  ]
};
```

### 2. TWA (Trusted Web Activities)

將 PWA 打包為 Android 應用：

```bash
# 安裝 Bubblewrap
npm install -g @bubblewrap/cli

# 初始化
bubblewrap init --manifest https://your-pwa.com/manifest.json

# 構建
bubblewrap build

# 生成的 APK 可上傳到 Google Play
```

### 3. Desktop PWA

```json
{
  "display_override": ["window-controls-overlay"],
  "edge_side_panel": {
    "preferred_width": 400
  }
}
```

### 4. Periodic Background Sync

```javascript
// 註冊定期後台同步（需要權限）
const status = await navigator.permissions.query({
  name: 'periodic-background-sync'
});

if (status.state === 'granted') {
  await registration.periodicSync.register('update-todos', {
    minInterval: 24 * 60 * 60 * 1000 // 每天
  });
}

// Service Worker
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-todos') {
    event.waitUntil(updateTodos());
  }
});
```

### 5. Web Share API

```javascript
if (navigator.share) {
  await navigator.share({
    title: 'PWA Todo List',
    text: '查看我的待辦事項',
    url: 'https://your-pwa.com'
  });
}
```

---

## 參考資源

### 官方文檔

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google - PWA 指南](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

### 工具

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [PWA Builder](https://www.pwabuilder.com/)
- [Maskable.app](https://maskable.app/)

### 學習資源

- [PWA Training](https://web.dev/learn/pwa/)
- [Offline Cookbook](https://web.dev/offline-cookbook/)
- [Service Worker Cookbook](https://serviceworke.rs/)

### 社群

- [PWA Slack](https://bit.ly/join-pwa-slack)
- [Reddit r/PWA](https://www.reddit.com/r/PWA/)

---

## 授權

MIT License

---

## 總結

這個 PWA Todo List 專案展示了如何構建一個完整的 Progressive Web App，包含：

✅ **離線功能** - Service Worker + Cache API
✅ **本地存儲** - IndexedDB
✅ **安裝體驗** - Web App Manifest
✅ **推送通知** - Notification API
✅ **後台同步** - Background Sync API
✅ **原生體驗** - 全屏、快速啟動
✅ **響應式設計** - 適配所有設備

PWA 代表了 Web 應用的未來，結合了 Web 和原生應用的最佳特性。透過本專案，您可以學習到 PWA 的核心技術和最佳實踐。

**下一步**：
1. 部署到 HTTPS 服務器
2. 使用 Lighthouse 測試
3. 在真實設備上測試安裝
4. 添加更多功能（同步、分享等）
5. 優化性能和用戶體驗

祝您開發愉快！ 🚀
