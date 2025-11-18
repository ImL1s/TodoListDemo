# 🚀 Quick Start Guide - Android Jetpack Compose Todo List

快速上手指南，5 分鐘內運行應用！

## ⚡ 最快速度運行（已有 Android Studio）

```bash
# 1. 打開 Android Studio
# 2. File > Open > 選擇 02-android-compose 文件夾
# 3. 等待 Gradle 同步完成
# 4. 點擊綠色 ▶️ Run 按鈕
# 完成！
```

## 📋 詳細步驟

### Step 1: 安裝 Android Studio（如果還沒有）

1. 下載: https://developer.android.com/studio
2. 安裝並啟動
3. 完成首次設置（選擇 Standard）

### Step 2: 打開項目

```bash
# 方法 1: 命令行克隆
git clone <repository-url>
cd 07-mobile-native/02-android-compose

# 方法 2: 直接下載 ZIP 並解壓
```

### Step 3: 在 Android Studio 中打開

1. 啟動 Android Studio
2. 選擇 "Open" 或 "Open an Existing Project"
3. 導航到 `02-android-compose` 文件夾
4. 點擊 "OK"

### Step 4: 等待 Gradle 同步

- 首次打開需要下載依賴（約 3-5 分鐘）
- 看到 "Gradle sync completed successfully" 即可
- 如果失敗，點擊 "Try Again"

### Step 5: 運行應用

#### 方法 A: 使用模擬器

1. 點擊工具欄的手機圖標（Device Manager）
2. 點擊 "Create Device"
3. 選擇 "Pixel 5"
4. 下載系統映像（Android 14 推薦）
5. 點擊 "Finish"
6. 在設備下拉菜單選擇新建的模擬器
7. 點擊綠色 ▶️ Run 按鈕
8. 等待模擬器啟動（約 30 秒）

#### 方法 B: 使用真機

1. 在手機上啟用開發者選項：
   - 設置 > 關於手機
   - 連續點擊"版本號" 7 次

2. 啟用 USB 調試：
   - 設置 > 系統 > 開發者選項
   - 開啟 "USB 調試"

3. 用 USB 連接手機到電腦
4. 允許 USB 調試授權
5. 在 Android Studio 設備下拉菜單選擇你的手機
6. 點擊綠色 ▶️ Run 按鈕

### Step 6: 享受應用！

應用將自動安裝並啟動。你應該看到：
- 紫色到藍色的漸變標題
- "Todo List" 標題
- "Jetpack Compose" 技術標籤
- 輸入框："What needs to be done?"
- 過濾按鈕：All / Active / Completed

## 🎮 使用應用

### 添加 Todo
1. 在輸入框輸入任務
2. 點擊 ➕ 按鈕或按鍵盤的 "完成"
3. Todo 出現在列表頂部

### 完成 Todo
- 點擊 Todo 項目或其旁邊的複選框
- 文字會有刪除線效果

### 刪除 Todo
- 點擊 Todo 右側的 🗑️ 刪除按鈕

### 過濾 Todo
- **All**: 顯示所有
- **Active**: 只顯示未完成
- **Completed**: 只顯示已完成

### 清除已完成
- 點擊底部的 "Clear Completed" 按鈕

## 🔧 命令行構建（可選）

如果你喜歡命令行：

```bash
# 清理構建
./gradlew clean

# 構建 Debug APK
./gradlew assembleDebug

# 安裝到連接的設備
./gradlew installDebug

# 運行測試
./gradlew test
```

APK 位置：`app/build/outputs/apk/debug/app-debug.apk`

## 🐛 常見問題

### Q: "SDK location not found"

```bash
# 創建 local.properties
echo "sdk.dir=/path/to/Android/Sdk" > local.properties

# macOS 默認路徑
echo "sdk.dir=/Users/$USER/Library/Android/sdk" > local.properties

# Linux 默認路徑
echo "sdk.dir=/home/$USER/Android/Sdk" > local.properties

# Windows 默認路徑
echo "sdk.dir=C:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk" > local.properties
```

### Q: Gradle 同步失敗

1. File > Invalidate Caches > Invalidate and Restart
2. 刪除 `.gradle` 文件夾
3. 重新同步

### Q: "Unsupported Java version"

1. File > Settings > Build, Execution, Deployment > Build Tools > Gradle
2. 將 "Gradle JDK" 設置為 "Java 17"
3. 重新同步

### Q: 模擬器啟動失敗

1. 確保已啟用虛擬化（BIOS 設置）
2. Intel CPU: 安裝 HAXM
3. AMD CPU: 啟用 Hyper-V（Windows）或 KVM（Linux）

## 📱 系統要求

### 最低要求
- **OS**: Windows 10 / macOS 10.14 / Linux
- **RAM**: 8 GB
- **Disk**: 8 GB 可用空間
- **Android SDK**: API 24-34

### 推薦配置
- **RAM**: 16 GB+
- **Disk**: 20 GB+ (SSD)
- **CPU**: Intel i7 / AMD Ryzen 7
- **屏幕**: 1920x1080+

## 🎓 下一步

### 學習資源
1. 閱讀 [README.md](README.md) - 2,352 行完整文檔
2. 查看 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 項目概覽
3. 探索源代碼 - 所有文件都有詳細註釋

### 修改代碼
1. **更改主題顏色**: 編輯 `ui/theme/Color.kt`
2. **修改佈局**: 編輯 `ui/TodoListScreen.kt`
3. **添加功能**: 擴展 `viewmodel/TodoViewModel.kt`

### 實時預覽
```kotlin
@Preview
@Composable
fun PreviewTodoList() {
    TodoComposeTheme {
        // 你的 UI 代碼
    }
}
```

在 Android Studio 的 Design 面板查看預覽！

## 💡 提示

### Compose 實時編輯
1. 運行應用
2. 點擊編輯器工具欄的 ⚡ Live Edit 圖標
3. 修改任何 `@Composable` 函數
4. 立即在運行的應用中看到更改！

### 調試
1. 在代碼行號旁邊點擊設置斷點
2. 點擊 🐞 Debug 按鈕運行
3. 應用會在斷點處暫停
4. 檢查變量、單步執行

### Logcat
- View > Tool Windows > Logcat
- 查看應用日誌和錯誤
- 過濾器：選擇你的應用包名

## 🎉 成功！

如果你看到了 Todo List 應用運行，恭喜！你已經：

✅ 成功設置 Android 開發環境
✅ 構建並運行了 Jetpack Compose 應用
✅ 準備好學習現代 Android 開發

## 📚 更多資源

- **完整文檔**: 閱讀 [README.md](README.md)
- **官方文檔**: https://developer.android.com/jetpack/compose
- **學習路徑**: https://developer.android.com/courses/pathways/compose
- **示例項目**: https://github.com/android/compose-samples

---

**遇到問題？** 查看 [README.md](README.md) 的 Troubleshooting 部分或提交 issue。

**玩得開心！** 🚀
