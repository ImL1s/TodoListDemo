# Electron + React Todo - 快速開始指南

## 🚀 5 分鐘快速上手

### 1️⃣ 安裝依賴

```bash
cd 08-desktop/01-electron-react
npm install
```

等待依賴安裝完成（可能需要 2-3 分鐘）。

### 2️⃣ 啟動開發模式

```bash
npm run electron:dev
```

幾秒鐘後，應用窗口會自動打開！

### 3️⃣ 開始使用

- 在輸入框中輸入任務，按 Enter 添加
- 點擊 checkbox 標記完成/未完成
- 雙擊任務文本進行編輯
- 點擊刪除按鈕移除任務
- 使用過濾按鈕查看不同狀態的任務

### 4️⃣ 鍵盤快捷鍵

- `Ctrl+N` (Windows/Linux) 或 `Cmd+N` (Mac) - 聚焦輸入框
- `Ctrl+Shift+C` - 清除已完成任務
- `Ctrl+Q` - 退出應用
- `F5` - 重新加載
- `F12` - 打開開發者工具

---

## 📦 構建安裝包

### Windows 用戶

```bash
npm run build:win
```

生成的文件在 `release/1.0.0/` 目錄：
- `electron-react-todo-1.0.0.exe` - 安裝程序（推薦）
- `electron-react-todo-1.0.0-portable.exe` - 便攜版

### macOS 用戶

```bash
npm run build:mac
```

生成的文件：
- `electron-react-todo-1.0.0.dmg` - DMG 安裝包（推薦）
- `electron-react-todo-1.0.0-mac.zip` - ZIP 壓縮包

### Linux 用戶

```bash
npm run build:linux
```

生成的文件：
- `electron-react-todo-1.0.0.AppImage` - AppImage（推薦）
- `electron-react-todo-1.0.0.deb` - Debian/Ubuntu
- `electron-react-todo-1.0.0.rpm` - RedHat/Fedora

---

## 🔧 常用命令

```bash
# 開發模式（推薦）
npm run electron:dev

# 僅啟動 Vite 開發服務器
npm run dev

# 類型檢查
npm run type-check

# 構建 Web 資源
npm run build:web

# 構建完整應用
npm run build

# 預覽構建結果
npm run preview
```

---

## 📁 項目結構（精簡版）

```
01-electron-react/
├── electron/           # Electron 主進程
│   ├── main.ts        # 主進程入口
│   └── preload.ts     # 預載腳本
│
├── src/               # React 應用
│   ├── components/    # React 組件
│   ├── App.tsx        # 主組件
│   └── main.tsx       # React 入口
│
├── package.json       # 項目配置
├── vite.config.ts     # Vite 配置
└── README.md          # 詳細文檔
```

---

## 🐛 常見問題

### Q: 運行 `npm install` 失敗？

**A:** 嘗試以下方法：

```bash
# 清除緩存
npm cache clean --force

# 刪除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

### Q: 開發模式無法啟動？

**A:** 檢查端口 5173 是否被占用：

```bash
# Windows
netstat -ano | findstr :5173

# macOS/Linux
lsof -i :5173
```

如果被占用，終止相關進程或修改 `vite.config.ts` 中的端口。

### Q: 打包失敗？

**A:** 確保先構建 Web 資源：

```bash
npm run build:web
npm run build:electron
```

### Q: Windows Defender 報告威脅？

**A:** 這是誤報。Electron 應用經常被標記為可疑。你可以：
1. 添加例外
2. 使用代碼簽名（需要證書）

---

## 🎯 下一步

1. ✅ 閱讀 [README.md](./README.md) 了解詳細架構
2. ✅ 查看 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) 了解項目概覽
3. ✅ 修改源代碼，實時查看變化
4. ✅ 添加新功能（如：標籤、優先級、搜索等）
5. ✅ 自定義 UI 樣式
6. ✅ 實現自動更新功能

---

## 📚 學習資源

- [Electron 官方文檔](https://www.electronjs.org/docs)
- [React 官方文檔](https://react.dev/)
- [Vite 官方文檔](https://vitejs.dev/)
- [TypeScript 官方文檔](https://www.typescriptlang.org/)

---

## 💡 提示

1. **開發模式** 會自動打開 DevTools，方便調試
2. **修改渲染進程代碼**（src/）會自動熱重載
3. **修改主進程代碼**（electron/）會自動重啟應用
4. **數據保存在本地**，關閉應用後不會丟失
5. **系統托盤** 允許最小化到托盤，而不是完全退出

---

**享受開發！** 🎉

如有問題，請查閱詳細的 [README.md](./README.md) 文檔。
