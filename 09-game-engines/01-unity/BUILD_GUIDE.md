# Unity Todo List - 打包發布指南

本指南詳細說明如何將 Unity Todo List 應用打包並發布到各個平台。

## 目錄

- [通用設置](#通用設置)
- [Windows 平台](#windows-平台)
- [macOS 平台](#macos-平台)
- [Linux 平台](#linux-平台)
- [Android 平台](#android-平台)
- [iOS 平台](#ios-平台)
- [WebGL 平台](#webgl-平台)
- [優化建議](#優化建議)
- [發布檢查清單](#發布檢查清單)

---

## 通用設置

### 1. 項目設置優化

在打包前，確保完成以下設置：

#### Player Settings (Edit > Project Settings > Player)

```
Company Name: 你的公司名稱
Product Name: Unity Todo List
Version: 1.0.0
Default Icon: 設置應用圖標 (建議 1024x1024)
Default Cursor: (可選)
```

#### Quality Settings (Edit > Project Settings > Quality)

```
為不同平台設置合適的質量等級：
- Mobile: Low/Medium
- Desktop: High
- WebGL: Medium
```

#### Build Settings

```
File > Build Settings

1. 添加場景：
   - Scenes/MainScene.unity

2. 移除未使用的場景

3. 檢查 Platform 設置
```

---

## Windows 平台

### 基本設置

```
1. File > Build Settings
2. Platform: Windows, Mac, Linux
3. Target Platform: Windows
4. Architecture: x86_64 (推薦) 或 x86
```

### Player Settings 配置

```csharp
// Icon and Cursor
Icon:
  - Default Icon: 設置 .ico 文件 (256x256)
  - Override for Windows: ✓

// Resolution and Presentation
Fullscreen Mode: Windowed
Default Screen Width: 1280
Default Screen Height: 720
Resizable Window: ✓
Run In Background: ✓

// Splash Image
Show Splash Screen: ✗ (需要 Unity Plus/Pro)
或自定義 Logo

// Other Settings
Scripting Backend: IL2CPP (推薦) 或 Mono
API Compatibility Level: .NET Standard 2.1
```

### 打包步驟

```bash
1. File > Build Settings
2. 點擊 "Build" 或 "Build And Run"
3. 選擇輸出文件夾
4. 等待編譯完成 (5-15 分鐘)

輸出文件：
TodoList_Windows/
├── UnityTodoList.exe
├── UnityPlayer.dll
├── UnityCrashHandler64.exe
├── MonoBleedingEdge/ (如果使用 Mono)
└── UnityTodoList_Data/
    ├── Managed/
    ├── Resources/
    └── ...
```

### 打包優化

```
Player Settings > Other Settings:

Optimization:
  - Stripping Level: Medium
  - Strip Engine Code: ✓
  - Managed Stripping Level: Medium

Preloaded Assets:
  - 移除未使用的資源
```

### 發布

```bash
# 創建安裝程序（使用 Inno Setup 或 NSIS）
# 或創建 ZIP 壓縮包

# 壓縮文件夾
zip -r UnityTodoList_Windows_v1.0.0.zip TodoList_Windows/

# 或使用 7-Zip
7z a UnityTodoList_Windows_v1.0.0.7z TodoList_Windows/
```

### 預期大小

```
Debug Build: ~150 MB
Release Build (IL2CPP): ~120 MB
Release Build (Mono): ~100 MB
壓縮後: ~50 MB
```

---

## macOS 平台

### 基本設置

```
1. File > Build Settings
2. Platform: Mac
3. Architecture:
   - Intel 64-bit
   - Apple Silicon (推薦同時支持兩者)
```

### Player Settings 配置

```
// Icon
Icon: 設置 .icns 文件

// Resolution and Presentation
Fullscreen Mode: Fullscreen Window
Default Screen Width: 1280
Default Screen Height: 720
Mac Retina Support: ✓

// Identification
Bundle Identifier: com.yourcompany.unitytodolist
Build Number: 1
Version: 1.0.0

// Other Settings
Scripting Backend: IL2CPP
API Compatibility Level: .NET Standard 2.1
```

### 打包步驟

```bash
1. File > Build Settings
2. Target Platform: Mac
3. Create Xcode Project: ✗ (直接構建 .app)
4. Build

輸出文件：
UnityTodoList.app (應用程序包)
```

### 簽名和公證（macOS 10.15+）

```bash
# 1. 簽名應用
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Your Name (TEAM_ID)" \
  UnityTodoList.app

# 2. 創建 DMG
hdiutil create -volname "Unity Todo List" -srcfolder UnityTodoList.app \
  -ov -format UDZO UnityTodoList.dmg

# 3. 簽名 DMG
codesign --sign "Developer ID Application: Your Name (TEAM_ID)" \
  UnityTodoList.dmg

# 4. 公證（需要 Apple Developer 賬號）
xcrun notarytool submit UnityTodoList.dmg \
  --apple-id "your@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password"

# 5. 驗證
xcrun stapler staple UnityTodoList.dmg
```

### 預期大小

```
Universal Build: ~150 MB
Intel 64-bit: ~100 MB
Apple Silicon: ~90 MB
DMG 壓縮: ~60 MB
```

---

## Linux 平台

### 基本設置

```
1. File > Build Settings
2. Platform: Linux
3. Architecture: x86_64 (通用)
```

### Player Settings 配置

```
// Resolution and Presentation
Fullscreen Mode: Windowed
Default Screen Width: 1280
Default Screen Height: 720

// Other Settings
Scripting Backend: IL2CPP 或 Mono
API Compatibility Level: .NET Standard 2.1
```

### 打包步驟

```bash
1. File > Build Settings
2. Target Platform: Linux
3. Build

輸出文件：
TodoList_Linux/
├── UnityTodoList.x86_64 (可執行文件)
└── UnityTodoList_Data/
```

### 創建可安裝包

#### AppImage

```bash
# 創建 AppImage 結構
mkdir -p AppDir/usr/bin
mkdir -p AppDir/usr/share/applications
mkdir -p AppDir/usr/share/icons/hicolor/256x256/apps

# 複製文件
cp -r TodoList_Linux/* AppDir/usr/bin/
cp icon.png AppDir/usr/share/icons/hicolor/256x256/apps/unitytodolist.png

# 創建 .desktop 文件
cat > AppDir/usr/share/applications/unitytodolist.desktop << EOF
[Desktop Entry]
Name=Unity Todo List
Exec=UnityTodoList.x86_64
Icon=unitytodolist
Type=Application
Categories=Utility;
EOF

# 使用 appimagetool 創建 AppImage
appimagetool AppDir UnityTodoList-v1.0.0-x86_64.AppImage
chmod +x UnityTodoList-v1.0.0-x86_64.AppImage
```

#### DEB 包（Debian/Ubuntu）

```bash
# 創建目錄結構
mkdir -p unitytodolist_1.0.0/DEBIAN
mkdir -p unitytodolist_1.0.0/usr/bin
mkdir -p unitytodolist_1.0.0/usr/share/applications
mkdir -p unitytodolist_1.0.0/usr/share/icons

# 創建 control 文件
cat > unitytodolist_1.0.0/DEBIAN/control << EOF
Package: unitytodolist
Version: 1.0.0
Section: utils
Priority: optional
Architecture: amd64
Maintainer: Your Name <your@email.com>
Description: Unity Todo List Application
 A cross-platform todo list app built with Unity
EOF

# 複製文件
cp -r TodoList_Linux/* unitytodolist_1.0.0/usr/bin/

# 構建 DEB 包
dpkg-deb --build unitytodolist_1.0.0
```

### 預期大小

```
Build: ~120 MB
AppImage: ~130 MB
DEB Package: ~120 MB
壓縮包: ~50 MB
```

---

## Android 平台

### 環境準備

1. **安裝 Android SDK 和 NDK**
   ```
   Unity Hub > Installs > Add Modules
   選擇：
   - Android Build Support
   - Android SDK & NDK Tools
   - OpenJDK
   ```

2. **驗證環境**
   ```
   Edit > Preferences > External Tools
   確認 SDK、NDK、JDK 路徑正確
   ```

### Player Settings 配置

```
// Identification
Package Name: com.yourcompany.unitytodolist
Version: 1.0.0
Bundle Version Code: 1

// Icon
Override for Android: ✓
設置各種尺寸的圖標：
- 36x36 (LDPI)
- 48x48 (MDPI)
- 72x72 (HDPI)
- 96x96 (XHDPI)
- 144x144 (XXHDPI)
- 192x192 (XXXHDPI)

// Minimum API Level: Android 5.1 'Lollipop' (API level 22)
// Target API Level: Automatic (Highest Installed)

// Scripting Backend: IL2CPP
// Target Architectures:
  - ARMv7: ✓
  - ARM64: ✓ (必需，Google Play 要求)
  - x86: ✗ (可選)

// Other Settings
Internet Access: Auto
Write Permission: External (SD Card)
```

### 打包 APK

```bash
1. File > Build Settings
2. Platform: Android
3. Build System: Gradle
4. Export Project: ✗
5. Build

# 或使用 Build App Bundle (推薦給 Google Play)
點擊 "Build App Bundle" 生成 .aab 文件
```

### 簽名 APK

#### 創建 Keystore

```bash
# 使用 Unity 或 keytool
keytool -genkey -v -keystore unitytodolist.keystore \
  -alias unitytodolist -keyalg RSA -keysize 2048 -validity 10000

# 記住：
# - Keystore 密碼
# - Key 別名
# - Key 密碼
```

#### 在 Unity 中設置簽名

```
Publishing Settings:
- Keystore: 選擇 .keystore 文件
- Keystore Password: 輸入密碼
- Key Alias: unitytodolist
- Key Password: 輸入密碼
```

### 優化設置

```
// Player Settings > Other Settings

Configuration:
  - Scripting Backend: IL2CPP
  - Target Architectures: ARM64 (必需)
  - Strip Engine Code: ✓
  - IL2CPP Code Generation: Faster runtime

Optimization:
  - Optimize Mesh Data: ✓
  - Prebake Collision Meshes: ✓
  - Keep Loaded Shaders Alive: ✗
```

### Google Play 發布

```bash
# 1. 創建應用截圖
# 需要：
# - 至少 2 張截圖 (手機)
# - 至少 1 張截圖 (平板，如果支持)
# - 7 寸和 10 寸平板截圖
# - 512x512 應用圖標
# - 1024x500 功能圖形

# 2. 準備資源
# - App Bundle (.aab)
# - 隱私政策網址
# - 應用描述

# 3. 上傳到 Google Play Console
# https://play.google.com/console
```

### 預期大小

```
APK (ARMv7): ~60 MB
APK (ARM64): ~70 MB
AAB (Universal): ~130 MB
下載大小（Google Play）: ~50 MB
```

---

## iOS 平台

**注意：需要 macOS 和 Xcode**

### 環境準備

1. **安裝 Xcode**
   ```
   從 App Store 安裝最新版 Xcode
   ```

2. **Apple Developer 賬號**
   ```
   註冊 Apple Developer Program ($99/年)
   https://developer.apple.com
   ```

### Player Settings 配置

```
// Identification
Bundle Identifier: com.yourcompany.unitytodolist
Version: 1.0.0
Build Number: 1

// Icon
App Icons: 設置所有必需尺寸
Launch Screen: 配置啟動畫面

// Target minimum iOS Version: 12.0

// Scripting Backend: IL2CPP (必需)
// Architecture: ARM64

// Camera Usage Description: (如需相機)
// Microphone Usage Description: (如需麥克風)
```

### 打包步驟

```bash
1. File > Build Settings
2. Platform: iOS
3. Build

# Unity 會生成 Xcode 專案
```

### Xcode 配置和打包

```bash
1. 打開生成的 .xcodeproj 文件

2. 在 Xcode 中配置：
   - Team: 選擇你的開發團隊
   - Signing: Automatically manage signing ✓
   - Deployment Target: iOS 12.0

3. 連接 iOS 設備

4. 選擇設備：Any iOS Device

5. Product > Archive

6. 在 Organizer 中：
   - Validate App
   - Distribute App
   - 選擇 App Store Connect
   - 上傳
```

### App Store 發布

```
1. App Store Connect (https://appstoreconnect.apple.com)

2. 創建新應用：
   - Name: Unity Todo List
   - Primary Language: Chinese (Traditional)
   - Bundle ID: com.yourcompany.unitytodolist
   - SKU: 唯一標識符

3. 準備資源：
   - 6.5" 截圖（iPhone 14 Pro Max）
   - 5.5" 截圖（iPhone 8 Plus）
   - 12.9" 截圖（iPad Pro）
   - 應用預覽視頻（可選）
   - 應用圖標 1024x1024

4. 填寫應用信息：
   - 描述
   - 關鍵詞
   - 支援網址
   - 隱私政策網址

5. 選擇構建版本

6. 提交審核
```

### 預期大小

```
IPA (ARM64): ~80 MB
下載大小（App Store）: ~60 MB
安裝大小: ~150 MB
```

---

## WebGL 平台

### Player Settings 配置

```
// Resolution and Presentation
Default Canvas Width: 1280
Default Canvas Height: 720
Run In Background: ✓

// Publishing Settings
Compression Format: Gzip (兼容性好) 或 Brotli (壓縮率高)
Data caching: ✓
Decompression Fallback: ✓

// Other Settings
Exception Support: Explicitly Thrown Exceptions Only
Optimization Level: Disk Size (最小化)
Enable Exceptions: None
```

### 打包步驟

```bash
1. File > Build Settings
2. Platform: WebGL
3. Build

輸出文件：
WebGL_Build/
├── index.html
├── Build/
│   ├── WebGL_Build.data.gz
│   ├── WebGL_Build.framework.js.gz
│   ├── WebGL_Build.loader.js
│   └── WebGL_Build.wasm.gz
└── TemplateData/
```

### 部署到 Web 伺服器

#### 配置 MIME 類型

```apache
# .htaccess (Apache)
<IfModule mod_mime.c>
  AddType application/octet-stream .data
  AddType application/wasm .wasm
  AddEncoding gzip .gz
</IfModule>

# 啟用壓縮
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml application/javascript
</IfModule>
```

```nginx
# nginx.conf
location /Build/ {
    # Gzip 設置
    gzip on;
    gzip_types application/octet-stream application/wasm;

    # MIME 類型
    types {
        application/octet-stream data;
        application/wasm wasm;
    }
}
```

### 部署到常見平台

#### GitHub Pages

```bash
# 1. 創建 gh-pages 分支
git checkout -b gh-pages

# 2. 複製構建文件
cp -r WebGL_Build/* .

# 3. 提交和推送
git add .
git commit -m "Deploy WebGL build"
git push origin gh-pages

# 4. 在 GitHub 設置中啟用 GitHub Pages
# 訪問: https://yourusername.github.io/unitytodolist
```

#### Netlify

```bash
# 1. 在 Netlify 中創建新網站

# 2. 拖放 WebGL_Build 文件夾

# 3. 配置
# 創建 _headers 文件：
/*
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
```

#### Vercel

```bash
# 1. 安裝 Vercel CLI
npm i -g vercel

# 2. 部署
cd WebGL_Build
vercel

# 3. 配置 vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    }
  ]
}
```

### WebGL 優化

```
1. 減少內存使用：
   - Memory Size: 256 MB
   - 移除大型資源
   - 使用壓縮紋理

2. 減少文件大小：
   - Code Stripping: High
   - Managed Stripping Level: High
   - 移除未使用的 Unity 模組

3. 提升加載速度：
   - 使用 Brotli 壓縮
   - 啟用 CDN
   - 使用 AssetBundles
```

### 預期大小

```
未壓縮: ~100 MB
Gzip 壓縮: ~20-30 MB
Brotli 壓縮: ~15-20 MB
```

---

## 優化建議

### 通用優化

1. **代碼優化**
   ```csharp
   // 使用 IL2CPP 而非 Mono
   Scripting Backend: IL2CPP

   // 啟用代碼剝離
   Strip Engine Code: ✓
   Managed Stripping Level: Medium/High

   // 優化網格數據
   Optimize Mesh Data: ✓
   ```

2. **資源優化**
   ```
   - 壓縮紋理（針對平台）
   - 使用 Sprite Atlas
   - 移除未使用的資源
   - 音頻壓縮
   ```

3. **打包優化**
   ```
   - 使用 AssetBundles 按需加載
   - 分離常用和不常用資源
   - 使用 Addressables 系統
   ```

### 平台特定優化

#### Mobile

```
- 減少 Draw Calls
- 使用低複雜度 Shader
- 禁用不必要的物理
- 使用對象池
```

#### WebGL

```
- 最小化 WASM 大小
- 減少內存分配
- 使用 Lazy Loading
- 優化啟動時間
```

---

## 發布檢查清單

### 發布前檢查

```
□ 測試所有功能正常
□ 檢查沒有控制台錯誤
□ 驗證數據持久化
□ 測試不同解析度
□ 檢查內存洩漏
□ 性能測試 (FPS, 內存)
□ 設置正確的版本號
□ 準備所有資源（圖標、截圖等）
□ 編寫發行說明
□ 更新文檔
```

### 各平台特定檢查

#### Windows/Mac/Linux
```
□ 測試安裝程序
□ 檢查文件權限
□ 驗證快捷方式
□ 測試卸載過程
```

#### Mobile
```
□ 測試不同設備
□ 檢查權限請求
□ 驗證應用圖標
□ 測試橫豎屏
□ 檢查電池消耗
```

#### WebGL
```
□ 測試不同瀏覽器
□ 檢查加載時間
□ 驗證 CORS 設置
□ 測試移動瀏覽器
```

---

## 版本管理

### 語義化版本

```
格式: MAJOR.MINOR.PATCH

1.0.0 - 首次發布
1.0.1 - Bug 修復
1.1.0 - 新功能
2.0.0 - 重大更新
```

### 發布流程

```bash
1. 更新版本號
   PlayerSettings.bundleVersion = "1.1.0"

2. 創建 Git Tag
   git tag -a v1.1.0 -m "Release version 1.1.0"
   git push origin v1.1.0

3. 編寫 CHANGELOG

4. 構建所有平台

5. 測試驗證

6. 發布到各平台

7. 公告發布
```

---

## 故障排除

### 常見問題

**Q: 構建失敗 - 找不到 SDK**
```
A: Edit > Preferences > External Tools
   設置正確的 SDK/NDK 路徑
```

**Q: iOS 簽名失敗**
```
A: 在 Xcode 中檢查：
   - Team 選擇正確
   - Bundle ID 唯一
   - 證書有效
```

**Q: WebGL 載入卡住**
```
A: 檢查：
   - MIME 類型配置
   - CORS 設置
   - 壓縮格式支持
```

**Q: Android 安裝失敗**
```
A: 檢查：
   - Minimum API Level
   - 權限設置
   - 簽名正確
```

---

## 資源和參考

### 官方文檔

- [Unity Manual - Publishing Builds](https://docs.unity3d.com/Manual/PublishingBuilds.html)
- [Unity Manual - Android](https://docs.unity3d.com/Manual/android.html)
- [Unity Manual - iOS](https://docs.unity3d.com/Manual/iphone.html)
- [Unity Manual - WebGL](https://docs.unity3d.com/Manual/webgl.html)

### 工具推薦

```
打包工具:
- Inno Setup (Windows 安裝程序)
- DMG Canvas (macOS DMG 創建)
- AppImageKit (Linux AppImage)

自動化:
- Unity Cloud Build
- GitHub Actions
- Jenkins
```

---

**最後更新：2025-11-18**
