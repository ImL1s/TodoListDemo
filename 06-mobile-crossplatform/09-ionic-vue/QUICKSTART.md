# 快速啟動指南

## 🚀 5 分鐘快速啟動

### 1️⃣ 安裝依賴（2 分鐘）

```bash
cd 06-mobile-crossplatform/09-ionic-vue
npm install
```

### 2️⃣ 啟動開發服務器（1 分鐘）

```bash
npm run dev
```

訪問: http://localhost:8100

### 3️⃣ 測試應用（2 分鐘）

1. 在輸入框中輸入任務
2. 點擊 + 按鈕添加
3. 點擊複選框標記完成
4. 左滑任務項刪除
5. 測試過濾器
6. 查看統計數據

---

## 📱 移動端測試（iOS）

### 前置要求
- macOS 電腦
- 已安裝 Xcode

### 步驟

```bash
# 1. 構建 Web 資源
npm run build

# 2. 添加 iOS 平台
ionic capacitor add ios

# 3. 同步
ionic capacitor sync ios

# 4. 打開 Xcode
ionic capacitor open ios

# 5. 在 Xcode 中點擊運行按鈕
```

---

## 🤖 移動端測試（Android）

### 前置要求
- 已安裝 Android Studio
- 已安裝 JDK 11+

### 步驟

```bash
# 1. 構建 Web 資源
npm run build

# 2. 添加 Android 平台
ionic capacitor add android

# 3. 同步
ionic capacitor sync android

# 4. 打開 Android Studio
ionic capacitor open android

# 5. 在 Android Studio 中點擊運行按鈕
```

---

## 🔥 開發模式（帶實時重載）

### iOS 實時重載

```bash
npm run ios
```

### Android 實時重載

```bash
npm run android
```

---

## 🎨 自定義主題

編輯 `src/theme/variables.css` 修改顏色：

```css
:root {
  --ion-color-primary: #3880ff;  /* 修改為你的主色 */
  --ion-color-success: #2dd36f;  /* 修改為你的成功色 */
}
```

---

## 📦 常用命令

```bash
# 開發
npm run dev                    # 啟動開發服務器
npm run build                  # 構建生產版本
npm run preview                # 預覽構建結果

# 移動端
npm run ios                    # iOS 實時重載
npm run android                # Android 實時重載
npm run sync                   # 同步 Web 資源到原生項目

# 構建
npm run build:ios              # 構建 iOS
npm run build:android          # 構建 Android

# 代碼質量
npm run lint                   # 運行 ESLint
npm run test:unit              # 運行單元測試
npm run test:e2e               # 運行 E2E 測試
```

---

## 🐛 常見問題

### Q: `npm install` 失敗？
```bash
# 清理並重新安裝
rm -rf node_modules package-lock.json
npm install
```

### Q: 端口被占用？
```bash
# 修改 vite.config.ts 中的端口
server: {
  port: 8101  // 改為其他端口
}
```

### Q: iOS 構建失敗？
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Q: Android 構建失敗？
```bash
cd android
./gradlew clean
cd ..
```

---

## 📚 下一步

1. 閱讀 [完整文檔](./README.md)
2. 查看 [項目結構](./PROJECT_STRUCTURE.md)
3. 探索 Ionic 組件
4. 學習 Capacitor API
5. 自定義你的應用

---

## 💡 提示

- 使用 Chrome DevTools 調試 Web 版本
- 使用 Safari Web Inspector 調試 iOS
- 使用 Chrome inspect 調試 Android
- 查看 Ionic 文檔學習更多組件
- 使用 Vue DevTools 調試 Vue 組件

---

**開始構建你的跨平台應用吧！** 🎉
