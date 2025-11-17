# 🎓 Todo List 學習路線圖

## 📖 目錄
- [學習路線總覽](#學習路線總覽)
- [階段性學習計劃](#階段性學習計劃)
- [不同背景的學習建議](#不同背景的學習建議)
- [每週學習計劃](#每週學習計劃)
- [實戰專案順序](#實戰專案順序)

---

## 🗺️ 學習路線總覽

```
                                    ┌─────────────────┐
                                    │  原生 Web 基礎  │
                                    │ HTML/CSS/JS     │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
            ┌───────▼───────┐        ┌──────▼──────┐        ┌───────▼───────┐
            │  前端框架路線  │        │  移動端路線  │        │  桌面端路線    │
            │  React/Vue    │        │ RN/Flutter  │        │ Electron/Tauri│
            └───────┬───────┘        └──────┬──────┘        └───────┬───────┘
                    │                       │                        │
            ┌───────▼───────┐        ┌──────▼──────┐        ┌───────▼───────┐
            │   元框架      │        │   原生開發   │        │   原生桌面    │
            │ Next.js/Nuxt │        │ iOS/Android │        │  WPF/SwiftUI  │
            └───────┬───────┘        └──────┬──────┘        └───────┬───────┘
                    │                       │                        │
                    └───────────────────────┼────────────────────────┘
                                            │
                                    ┌───────▼───────┐
                                    │   全棧開發    │
                                    │  後端整合     │
                                    └───────────────┘
```

---

## 📅 階段性學習計劃

### 🎯 第一階段：Web 基礎 (2-3 週)

#### Week 1: 原生 Web 開發
**目標**: 理解 Web 開發基礎

**學習內容**:
- [ ] HTML5 語義化標籤
- [ ] CSS3 佈局 (Flexbox, Grid)
- [ ] JavaScript ES6+ 特性
- [ ] DOM 操作
- [ ] 事件處理
- [ ] LocalStorage

**實作項目**:
- ✅ 原生 JS Todo List (已完成)
- [ ] 加入拖拽排序功能
- [ ] 實現篩選和搜尋
- [ ] 添加動畫效果

**學習資源**:
- MDN Web Docs
- JavaScript.info
- CSS-Tricks

**評估標準**:
- 能獨立完成功能完整的 Todo List
- 理解 DOM 操作和事件循環
- 掌握 CSS 佈局

---

#### Week 2: TypeScript 基礎
**目標**: 掌握 TypeScript 基礎

**學習內容**:
- [ ] TypeScript 基本語法
- [ ] 類型系統
- [ ] 接口和泛型
- [ ] 模組化

**實作項目**:
- [ ] 將原生 JS Todo List 改寫為 TypeScript 版本
- [ ] 定義完整的類型接口
- [ ] 使用泛型優化代碼

**學習資源**:
- TypeScript 官方文檔
- TypeScript Deep Dive

---

#### Week 3: 經典框架體驗
**目標**: 了解前端框架演進歷史

**學習內容**:
- [ ] jQuery 基礎
- [ ] Backbone.js 架構
- [ ] 理解 MVC 模式

**實作項目**:
- [ ] jQuery 版本 Todo List
- [ ] Backbone.js 版本 Todo List

**目的**:
- 理解為什麼需要框架
- 了解框架演進歷史
- 為現代框架打基礎

---

### 🚀 第二階段：現代前端框架 (6-8 週)

#### Week 4-5: React 核心
**目標**: 深入掌握 React

**學習內容**:
- [ ] 組件化思想
- [ ] JSX 語法
- [ ] Props 和 State
- [ ] 生命週期 / Hooks
- [ ] 事件處理
- [ ] 條件渲染和列表

**實作項目**:
- [ ] React 基礎版 Todo List
- [ ] 使用 Hooks (useState, useEffect)
- [ ] 組件拆分和復用
- [ ] Props drilling 練習

**學習資源**:
- React 官方文檔
- React 進階指南
- Scrimba React 課程

**進階內容**:
- [ ] 自定義 Hooks
- [ ] Context API
- [ ] useReducer
- [ ] useMemo / useCallback 優化

---

#### Week 6: React 生態系統
**目標**: 掌握 React 工具鏈

**學習內容**:
- [ ] React Router
- [ ] Redux Toolkit 狀態管理
- [ ] React Query 數據獲取
- [ ] React Hook Form

**實作項目**:
- [ ] React + TypeScript Todo List
- [ ] Redux Toolkit 版本
- [ ] 加入路由 (多頁面)
- [ ] 整合後端 API

**UI 組件庫**:
- [ ] Material-UI 版本
- [ ] Ant Design 版本
- [ ] Chakra UI 版本

---

#### Week 7-8: Vue 3 完整學習
**目標**: 掌握 Vue 3 及生態

**學習內容**:
- [ ] Vue 3 基礎語法
- [ ] Composition API
- [ ] Reactive / Ref
- [ ] Computed / Watch
- [ ] 組件通訊
- [ ] 生命週期

**實作項目**:
- [ ] Vue 3 Options API 版本
- [ ] Vue 3 Composition API 版本
- [ ] Vue 3 + TypeScript 版本
- [ ] Pinia 狀態管理版本

**UI 組件庫**:
- [ ] Vuetify 版本
- [ ] Element Plus 版本
- [ ] Naive UI 版本

**學習資源**:
- Vue 3 官方文檔
- Vue Mastery
- Vue School

---

#### Week 9: Angular 入門
**目標**: 了解 Angular 架構

**學習內容**:
- [ ] Angular 架構
- [ ] TypeScript 裝飾器
- [ ] 組件和模組
- [ ] 服務和依賴注入
- [ ] RxJS 基礎

**實作項目**:
- [ ] Angular Todo List
- [ ] Angular Material 版本
- [ ] 使用 NgRx 狀態管理

**評估**:
- 理解 Angular 和 React/Vue 的差異
- 決定是否深入學習

---

#### Week 10: 輕量級框架探索
**目標**: 體驗不同的前端方案

**實作項目**:
- [ ] Svelte Todo List
- [ ] SolidJS Todo List
- [ ] Preact Todo List
- [ ] Alpine.js Todo List
- [ ] Lit (Web Components) 版本

**學習重點**:
- 無虛擬 DOM 的實現
- 編譯時框架
- 細粒度響應式
- Web Components 標準

---

### 🌐 第三階段：元框架與 SSR (3-4 週)

#### Week 11-12: Next.js 全棧開發
**目標**: 掌握 React 全棧方案

**學習內容**:
- [ ] Next.js 路由系統
- [ ] SSR / SSG / ISR
- [ ] API Routes
- [ ] 數據獲取策略
- [ ] 部署 (Vercel)

**實作項目**:
- [ ] Next.js Todo List (含後端)
- [ ] 使用 Prisma + PostgreSQL
- [ ] 用戶認證 (NextAuth.js)
- [ ] SEO 優化

**進階**:
- [ ] Next.js 14 App Router
- [ ] Server Components
- [ ] Server Actions

---

#### Week 13: Nuxt.js
**目標**: Vue 全棧方案

**實作項目**:
- [ ] Nuxt 3 Todo List
- [ ] SSR 實現
- [ ] Nuxt Modules
- [ ] 部署

---

#### Week 14: 其他元框架體驗
**實作項目**:
- [ ] Remix Todo List
- [ ] SvelteKit Todo List
- [ ] Astro Todo List (SSG)

---

### 📱 第四階段：移動端開發 (6-8 週)

#### Week 15-17: React Native
**目標**: 跨平台移動開發

**學習內容**:
- [ ] React Native 基礎
- [ ] 核心組件 (View, Text, etc.)
- [ ] 導航 (React Navigation)
- [ ] 樣式系統
- [ ] 原生模組
- [ ] Expo 工具鏈

**實作項目**:
- [ ] React Native Todo List
- [ ] 使用 Expo
- [ ] 本地存儲 (AsyncStorage)
- [ ] 打包和發布

**進階**:
- [ ] 動畫 (Reanimated)
- [ ] 手勢處理
- [ ] 推送通知
- [ ] 相機/相冊集成

---

#### Week 18-20: Flutter
**目標**: 高性能跨平台開發

**學習內容**:
- [ ] Dart 語言基礎
- [ ] Flutter Widget 系統
- [ ] 狀態管理 (Provider/Riverpod)
- [ ] 導航
- [ ] 本地存儲

**實作項目**:
- [ ] Flutter Todo List
- [ ] Material Design / Cupertino
- [ ] 多平台適配 (iOS/Android/Web)

**評估**:
- 對比 React Native 和 Flutter
- 選擇主要發展方向

---

#### Week 21: 其他跨平台方案
**實作項目**:
- [ ] Ionic React 版本
- [ ] Ionic Vue 版本
- [ ] .NET MAUI 版本 (可選)

---

#### Week 22-23: 原生移動開發
**目標**: 深入理解移動平台

**iOS**:
- [ ] Swift 基礎
- [ ] SwiftUI Todo List
- [ ] UIKit 版本 (可選)

**Android**:
- [ ] Kotlin 基礎
- [ ] Jetpack Compose Todo List
- [ ] XML Views 版本 (可選)

---

### 🖥️ 第五階段：桌面應用開發 (4-5 週)

#### Week 24-25: Electron
**學習內容**:
- [ ] Electron 架構
- [ ] 主進程 vs 渲染進程
- [ ] IPC 通訊
- [ ] 原生功能整合
- [ ] 打包和分發

**實作項目**:
- [ ] Electron + React Todo List
- [ ] Electron + Vue Todo List
- [ ] 系統托盤整合
- [ ] 自動更新

---

#### Week 26: Tauri
**實作項目**:
- [ ] Tauri + React Todo List
- [ ] Rust 後端 API (可選)
- [ ] 對比 Electron

---

#### Week 27: Flutter Desktop
**實作項目**:
- [ ] Flutter Desktop Todo List
- [ ] 跨平台適配 (Windows/macOS/Linux)

---

#### Week 28: 原生桌面 (選修)
**Windows**:
- [ ] WPF Todo List
- [ ] WinUI 3 Todo List

**macOS**:
- [ ] SwiftUI macOS Todo List

**跨平台**:
- [ ] Qt C++ Todo List

---

### 🎮 第六階段：遊戲引擎 (3-4 週)

#### Week 29-30: Unity
**學習內容**:
- [ ] Unity 界面和工作流
- [ ] C# 腳本
- [ ] UI 系統 (Unity UI)
- [ ] UI Toolkit (現代方案)

**實作項目**:
- [ ] Unity 2D Todo List
- [ ] UI Toolkit 版本
- [ ] 數據持久化

---

#### Week 31: Cocos 引擎
**實作項目**:
- [ ] Cocos Creator Todo List
- [ ] Cocos2d-x C++ 版本 (進階)

---

#### Week 32: 其他引擎體驗
**實作項目**:
- [ ] Godot Todo List
- [ ] Phaser 3 Web Game
- [ ] PixiJS 版本

---

### 🔧 第七階段：全棧開發 (4-6 週)

#### Week 33-34: MERN Stack
**實作項目**:
- [ ] 完整 MERN Todo List
- [ ] RESTful API
- [ ] JWT 認證
- [ ] MongoDB 數據庫
- [ ] 部署 (Heroku/Railway)

---

#### Week 35: Python 全棧
**實作項目**:
- [ ] Django + React Todo List
- [ ] FastAPI + Vue Todo List
- [ ] PostgreSQL 數據庫

---

#### Week 36: 其他後端體驗
**實作項目**:
- [ ] Go + Gin + React
- [ ] Spring Boot + React (Java)
- [ ] Laravel + Vue (PHP)

---

### 🚀 第八階段：進階與專業化 (持續)

#### 性能優化
- [ ] Lighthouse 優化
- [ ] 代碼分割
- [ ] 懶加載
- [ ] 虛擬滾動
- [ ] Web Workers

#### 測試
- [ ] Jest 單元測試
- [ ] React Testing Library
- [ ] Cypress E2E 測試
- [ ] Playwright

#### DevOps
- [ ] Docker 容器化
- [ ] CI/CD (GitHub Actions)
- [ ] 監控和日誌
- [ ] 性能分析

#### PWA
- [ ] Service Worker
- [ ] 離線支持
- [ ] 推送通知
- [ ] 安裝到主屏幕

#### WebAssembly
- [ ] Rust + Wasm Todo List
- [ ] Go + Wasm 版本

---

## 👥 不同背景的學習建議

### 🎓 完全新手 (0 基礎)

**推薦路線**:
1. HTML/CSS 基礎 (2 週)
2. JavaScript 基礎 (3 週)
3. 原生 JS Todo List (1 週)
4. Vue 3 (3 週) - 最易學
5. Nuxt.js 全棧 (2 週)
6. React Native (4 週)

**時間**: 約 3-4 個月基礎 + 持續學習

**重點**:
- 扎實基礎
- 選擇一個框架深入
- 不要貪多

---

### 💼 Web 開發者 (有基礎)

**推薦路線**:
1. TypeScript (1 週)
2. React + 生態 (3 週)
3. Next.js 全棧 (2 週)
4. React Native (3 週)
5. Electron (1 週)
6. 其他框架體驗 (彈性)

**時間**: 約 2-3 個月

**重點**:
- 快速掌握主流技術
- 建立完整作品集
- 專精求職方向

---

### 📱 移動開發者

**推薦路線**:
1. Web 基礎 (2 週)
2. React 基礎 (2 週)
3. React Native 深入 (4 週)
4. Flutter 對比學習 (3 週)
5. Next.js 全棧 (2 週)

**重點**:
- 利用移動開發經驗
- 理解跨平台差異
- 拓展 Web 技能

---

### 🖥️ 後端開發者

**推薦路線**:
1. HTML/CSS/JS 基礎 (2 週)
2. TypeScript (1 週)
3. React 或 Vue (3 週)
4. Next.js 或 Nuxt.js (2 週)
5. 全棧項目整合 (彈性)

**重點**:
- 快速上手前端
- 整合後端技能
- 全棧能力提升

---

### 🎮 遊戲開發者

**推薦路線**:
1. Web 基礎 (快速過)
2. Phaser 3 (2 週)
3. PixiJS (1 週)
4. React/Vue 基礎 (2 週)
5. Unity UI (利用現有知識)
6. Electron 遊戲工具開發

**重點**:
- 拓展 Web 遊戲能力
- 工具開發
- 跨領域技能

---

## 📊 每週學習時間分配

### 標準學習計劃 (每週 20-25 小時)

**工作日 (週一至週五)**:
- 每天 2-3 小時
- 理論學習: 1 小時
- 實作練習: 1.5-2 小時

**週末 (週六週日)**:
- 每天 4-5 小時
- 項目實作為主
- 總結和複習

### 密集學習計劃 (每週 40+ 小時)

**全職學習**:
- 上午: 理論學習和教程 (4 小時)
- 下午: 項目實作 (4 小時)
- 晚上: 複習和探索 (2 小時)

**週末**:
- 複習本週內容
- 完成挑戰項目
- 寫技術文章

---

## 🎯 里程碑檢查點

### ✅ 檢查點 1: Web 基礎 (3 週後)
- [ ] 能獨立完成響應式 Todo List
- [ ] 理解 DOM 操作和事件
- [ ] 掌握 ES6+ 語法
- [ ] TypeScript 基礎

### ✅ 檢查點 2: 現代框架 (10 週後)
- [ ] 精通 React 或 Vue
- [ ] 完成至少 5 個不同版本的 Todo List
- [ ] 理解狀態管理
- [ ] 能使用 UI 組件庫

### ✅ 檢查點 3: 全棧能力 (15 週後)
- [ ] 完成 Next.js 或 Nuxt.js 全棧項目
- [ ] 理解 SSR/SSG
- [ ] 後端 API 開發
- [ ] 數據庫操作

### ✅ 檢查點 4: 移動端 (23 週後)
- [ ] React Native 或 Flutter 應用
- [ ] 原生功能整合
- [ ] 打包發布流程
- [ ] 理解移動端特性

### ✅ 檢查點 5: 全平台開發者 (30+ 週後)
- [ ] Web / Mobile / Desktop 全平台能力
- [ ] 至少 20+ 個不同技術棧的實現
- [ ] 完整的作品集
- [ ] 技術文章和分享

---

## 🏆 最終目標

完成這個學習路線後，你將:

1. **技術廣度**: 熟悉 50+ 種技術棧
2. **深度專精**: 至少 2-3 個領域的專家級能力
3. **實戰經驗**: 100+ 個 Todo List 實現
4. **作品集**: 展示全面技術能力的項目集
5. **就業競爭力**: 大幅提升求職機會

---

## 📚 學習資源推薦

### 在線課程
- Frontend Masters
- Udemy
- Coursera
- YouTube 頻道

### 文檔和書籍
- MDN Web Docs
- 各框架官方文檔
- "You Don't Know JS" 系列
- "Eloquent JavaScript"

### 實踐平台
- LeetCode (算法)
- Frontend Mentor (UI 挑戰)
- CodeSandbox (在線編碼)
- GitHub (代碼托管)

### 社群
- Stack Overflow
- Reddit (r/webdev, r/reactjs, etc.)
- Discord 服務器
- 本地技術社群

---

## 💡 學習技巧

1. **項目驅動學習**: 每學一個新技術就實現 Todo List
2. **對比學習**: 比較不同框架的實現差異
3. **寫技術文章**: 記錄學習過程和心得
4. **代碼復審**: 定期回顧舊代碼,重構優化
5. **參與開源**: 為開源項目貢獻代碼
6. **建立網絡**: 參加技術會議和社群活動
7. **保持好奇**: 持續關注新技術和趨勢

---

## ⏰ 時間線總覽

- **3 個月**: Web 前端基礎 + 現代框架
- **6 個月**: + 移動端開發
- **9 個月**: + 桌面應用
- **12 個月**: 完整全棧全平台能力

**記住**: 這是一個持續的學習過程,不要急於求成!

---

**最後更新**: 2025-11-17
**版本**: 1.0
**建議複習週期**: 每月更新一次學習進度
