# 部署指南

本指南涵蓋將 Tauri Vue Todo 應用打包、簽名和分發到各個平台的完整流程。

## 📋 前置準備

### 所有平台

1. **代碼簽名證書**（可選，但推薦用於生產）
2. **應用圖標** - 準備 1024x1024 PNG 圖標
3. **版本號** - 遵循語義化版本 (Semantic Versioning)

### 生成應用圖標

```bash
# 使用 Tauri CLI 生成所有需要的圖標
npm install -g @tauri-apps/cli
tauri icon path/to/your/icon-1024x1024.png

# 這會在 src-tauri/icons/ 生成：
# - 32x32.png
# - 128x128.png
# - 128x128@2x.png
# - icon.png
# - icon.icns (macOS)
# - icon.ico (Windows)
```

## 🪟 Windows 部署

### 1. 準備環境

```bash
# 安裝 Windows SDK
# 下載: https://developer.microsoft.com/windows/downloads/windows-sdk/

# 安裝 Visual Studio Build Tools
# 下載: https://visualstudio.microsoft.com/downloads/
# 選擇 "Desktop development with C++"
```

### 2. 代碼簽名（可選）

```bash
# 獲取代碼簽名證書
# 1. 從 CA 購買（如 DigiCert, Sectigo）
# 2. 使用 EV 證書避免 SmartScreen 警告

# 配置 tauri.conf.json
{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERT_THUMBPRINT",
      "digestAlgorithm": "sha256",
      "timestampUrl": "http://timestamp.digicert.com"
    }
  }
}
```

### 3. 構建安裝程式

```bash
# 構建 MSI 和 NSIS 安裝程式
npm run tauri:build

# 輸出位置：
# src-tauri/target/release/bundle/msi/tauri-vue-todo_0.1.0_x64_en-US.msi
# src-tauri/target/release/bundle/nsis/tauri-vue-todo_0.1.0_x64-setup.exe
```

### 4. 測試安裝程式

```powershell
# 靜默安裝測試
.\tauri-vue-todo_0.1.0_x64-setup.exe /S

# 檢查安裝位置
dir "C:\Program Files\Tauri Vue Todo"

# 卸載測試
"C:\Program Files\Tauri Vue Todo\uninstall.exe" /S
```

### 5. 分發選項

#### 選項 A: 直接下載

```bash
# 上傳到你的網站
# 提供 .msi 和 .exe 兩種格式
https://yoursite.com/downloads/tauri-vue-todo-setup.exe
```

#### 選項 B: Microsoft Store

```bash
# 1. 註冊 Microsoft Partner Center
# 2. 創建應用提交
# 3. 上傳 .msix 包（需要額外配置）

# 配置 MSIX
{
  "bundle": {
    "windows": {
      "wix": null,
      "nsis": null
    }
  }
}
```

#### 選項 C: Chocolatey

```powershell
# 創建 Chocolatey 包
# 1. 安裝 Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# 2. 創建包定義
# 3. 發布到 Chocolatey.org
```

### 6. 自動更新

```rust
// src-tauri/Cargo.toml
[dependencies]
tauri-plugin-updater = "2.0"

// src-tauri/src/main.rs
use tauri_plugin_updater::UpdaterExt;

tauri::Builder::default()
    .plugin(tauri_plugin_updater::Builder::new().build())
    .setup(|app| {
        let handle = app.handle().clone();
        tauri::async_runtime::spawn(async move {
            let response = handle.updater().check().await;
        });
        Ok(())
    })
```

## 🍎 macOS 部署

### 1. 準備環境

```bash
# 安裝 Xcode Command Line Tools
xcode-select --install

# 安裝 Xcode（從 App Store）
# 用於代碼簽名和公證
```

### 2. 代碼簽名

```bash
# 1. 加入 Apple Developer Program ($99/年)
# https://developer.apple.com/programs/

# 2. 創建證書
# Xcode → Preferences → Accounts → Manage Certificates
# 創建 "Developer ID Application" 證書

# 3. 獲取證書標識
security find-identity -v -p codesigning
# 找到: "Developer ID Application: Your Name (TEAM_ID)"

# 4. 配置 tauri.conf.json
{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)",
      "entitlements": "entitlements.plist"
    }
  }
}
```

### 3. 創建 Entitlements

```xml
<!-- src-tauri/entitlements.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
</dict>
</plist>
```

### 4. 公證（Notarization）

```bash
# 構建應用
npm run tauri:build

# 壓縮 .app
cd src-tauri/target/release/bundle/macos
ditto -c -k --keepParent "Tauri Vue Todo.app" tauri-vue-todo.zip

# 上傳公證
xcrun notarytool submit tauri-vue-todo.zip \
    --apple-id "your@email.com" \
    --password "app-specific-password" \
    --team-id "YOUR_TEAM_ID" \
    --wait

# 驗證公證
xcrun stapler staple "Tauri Vue Todo.app"

# 創建 DMG
npm install -g create-dmg
create-dmg "Tauri Vue Todo.app" --overwrite

# 公證 DMG
xcrun notarytool submit "Tauri Vue Todo 0.1.0.dmg" \
    --apple-id "your@email.com" \
    --password "app-specific-password" \
    --team-id "YOUR_TEAM_ID" \
    --wait

xcrun stapler staple "Tauri Vue Todo 0.1.0.dmg"
```

### 5. 分發選項

#### 選項 A: 直接下載

```bash
# 提供公證過的 DMG
https://yoursite.com/downloads/tauri-vue-todo.dmg
```

#### 選項 B: Homebrew Cask

```ruby
# 創建 Cask 定義
# homebrew-cask/Casks/tauri-vue-todo.rb
cask "tauri-vue-todo" do
  version "0.1.0"
  sha256 "abc123..."

  url "https://yoursite.com/downloads/tauri-vue-todo-#{version}.dmg"
  name "Tauri Vue Todo"
  desc "Lightweight Todo List app"
  homepage "https://yoursite.com"

  app "Tauri Vue Todo.app"
end

# 安裝
brew install --cask tauri-vue-todo
```

#### 選項 C: Mac App Store

```bash
# 1. 創建 App Store Connect 記錄
# 2. 使用 Mac App Store 證書簽名
# 3. 上傳 .pkg
# 4. 提交審核
```

## 🐧 Linux 部署

### 1. 準備環境

```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# Fedora
sudo dnf install webkit2gtk4.1-devel \
    openssl-devel \
    curl \
    wget \
    file \
    libappindicator-gtk3-devel \
    librsvg2-devel
```

### 2. 構建包

```bash
# 構建 .deb 和 .AppImage
npm run tauri:build

# 輸出：
# src-tauri/target/release/bundle/deb/tauri-vue-todo_0.1.0_amd64.deb
# src-tauri/target/release/bundle/appimage/tauri-vue-todo_0.1.0_amd64.AppImage
```

### 3. 分發選項

#### 選項 A: .deb (Debian/Ubuntu)

```bash
# 上傳到 PPA
# 1. 註冊 Launchpad 帳號
# 2. 創建 PPA
# 3. 上傳 .deb

# 用戶安裝
sudo add-apt-repository ppa:yourname/tauri-vue-todo
sudo apt update
sudo apt install tauri-vue-todo
```

#### 選項 B: AppImage

```bash
# AppImage 是通用格式，直接運行
chmod +x tauri-vue-todo_0.1.0_amd64.AppImage
./tauri-vue-todo_0.1.0_amd64.AppImage

# 提供下載
https://yoursite.com/downloads/tauri-vue-todo.AppImage
```

#### 選項 C: Flatpak

```bash
# 安裝 flatpak-builder
sudo apt install flatpak-builder

# 創建 manifest
# com.tauri.vue.todo.json

# 構建
flatpak-builder build-dir com.tauri.vue.todo.json

# 發布到 Flathub
# https://flathub.org/
```

#### 選項 D: Snap

```bash
# 安裝 snapcraft
sudo snap install snapcraft --classic

# 創建 snapcraft.yaml
name: tauri-vue-todo
version: '0.1.0'
summary: Lightweight Todo List
description: |
  A lightweight Todo List desktop application built with Tauri 2.0

base: core22
confinement: strict
grade: stable

apps:
  tauri-vue-todo:
    command: tauri-vue-todo
    plugs:
      - home
      - desktop
      - x11

parts:
  tauri-vue-todo:
    plugin: dump
    source: src-tauri/target/release/bundle/deb/
    organize:
      'usr/bin/tauri-vue-todo': bin/tauri-vue-todo

# 構建
snapcraft

# 發布
snapcraft upload tauri-vue-todo_0.1.0_amd64.snap --release stable
```

## 🔄 持續集成/部署 (CI/CD)

### GitHub Actions 配置

```yaml
# .github/workflows/build.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        platform: [macos-latest, ubuntu-22.04, windows-latest]

    runs-on: ${{ matrix.platform }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Install dependencies (Ubuntu)
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt update
          sudo apt install -y libwebkit2gtk-4.1-dev \
            build-essential \
            curl \
            wget \
            file \
            libssl-dev \
            libgtk-3-dev \
            libayatana-appindicator3-dev \
            librsvg2-dev

      - name: Install frontend dependencies
        run: npm install

      - name: Build Tauri app
        run: npm run tauri:build

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.platform }}-build
          path: |
            src-tauri/target/release/bundle/**/*.dmg
            src-tauri/target/release/bundle/**/*.msi
            src-tauri/target/release/bundle/**/*.exe
            src-tauri/target/release/bundle/**/*.deb
            src-tauri/target/release/bundle/**/*.AppImage

  release:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v4

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            *-build/**/*
          draft: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 📊 版本管理

### 更新版本號

```bash
# 更新 package.json
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0

# 同步更新 src-tauri/Cargo.toml
# 同步更新 src-tauri/tauri.conf.json
```

### 自動化腳本

```json
// package.json
{
  "scripts": {
    "version": "node scripts/sync-version.js && git add -A"
  }
}
```

```javascript
// scripts/sync-version.js
const fs = require('fs')
const packageJson = require('../package.json')

// 更新 Cargo.toml
const cargoToml = fs.readFileSync('src-tauri/Cargo.toml', 'utf8')
const updatedCargo = cargoToml.replace(
  /version = ".*"/,
  `version = "${packageJson.version}"`
)
fs.writeFileSync('src-tauri/Cargo.toml', updatedCargo)

// 更新 tauri.conf.json
const tauriConf = JSON.parse(fs.readFileSync('src-tauri/tauri.conf.json', 'utf8'))
tauriConf.version = packageJson.version
fs.writeFileSync('src-tauri/tauri.conf.json', JSON.stringify(tauriConf, null, 2))

console.log(`✅ Version synced to ${packageJson.version}`)
```

## 🔐 安全最佳實踐

### 1. 保護簽名證書

```bash
# 不要提交證書到 Git
echo "*.pfx" >> .gitignore
echo "*.p12" >> .gitignore
echo "*.pem" >> .gitignore

# 使用環境變數
export WINDOWS_CERTIFICATE_PASSWORD="..."
export APPLE_ID="..."
export APPLE_PASSWORD="..."
```

### 2. 驗證構建產物

```bash
# Windows: 驗證簽名
signtool verify /pa tauri-vue-todo_0.1.0_x64-setup.exe

# macOS: 驗證簽名和公證
codesign --verify --deep --strict "Tauri Vue Todo.app"
spctl -a -vv "Tauri Vue Todo.app"

# Linux: 驗證 .deb
dpkg-sig --verify tauri-vue-todo_0.1.0_amd64.deb
```

## 📝 發布清單

- [ ] 更新版本號（package.json, Cargo.toml, tauri.conf.json）
- [ ] 更新 CHANGELOG.md
- [ ] 運行完整測試套件
- [ ] 在所有目標平台上測試構建
- [ ] 代碼簽名和公證（macOS）
- [ ] 創建 Git 標籤
- [ ] 構建發布版本
- [ ] 上傳到分發平台
- [ ] 更新文檔和網站
- [ ] 發布公告

## 🚀 快速發布腳本

```bash
#!/bin/bash
# scripts/release.sh

set -e

echo "🚀 Starting release process..."

# 確保在主分支
git checkout main
git pull

# 運行測試
echo "🧪 Running tests..."
npm test

# 更新版本
echo "📝 Updating version..."
npm version $1  # patch/minor/major

# 構建
echo "🔨 Building..."
npm run tauri:build

# 創建標籤
VERSION=$(node -p "require('./package.json').version")
git tag -a "v$VERSION" -m "Release v$VERSION"

# 推送
git push origin main --tags

echo "✅ Release v$VERSION complete!"
echo "📦 Next steps:"
echo "   1. Upload builds to distribution platforms"
echo "   2. Create GitHub release"
echo "   3. Update documentation"
```

使用：

```bash
chmod +x scripts/release.sh
./scripts/release.sh patch  # 或 minor/major
```

---

**現在你已經準備好將你的 Tauri 應用部署到生產環境了！** 🎉
