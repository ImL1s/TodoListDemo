# PWA 圖標生成指南

## 概述
PWA 應用需要多種尺寸的圖標以支援不同設備和場景。本指南說明如何從 SVG 模板生成所需的所有圖標。

## 所需圖標尺寸

根據 `manifest.json` 配置，需要以下尺寸的圖標：

- **icon-32x32.png** - Favicon（瀏覽器標籤）
- **icon-72x72.png** - iOS 主屏幕圖標、應用內顯示
- **icon-96x96.png** - Android 低解析度設備
- **icon-128x128.png** - Chrome Web Store
- **icon-144x144.png** - Windows 開始畫面
- **icon-152x152.png** - iPad 主屏幕
- **icon-180x180.png** - iPhone 主屏幕（包含 Plus 型號）
- **icon-192x192.png** - Android 主屏幕（標準）
- **icon-384x384.png** - Android 啟動畫面
- **icon-512x512.png** - Android 主屏幕（高解析度）、啟動畫面

## 方法 1: 使用線上工具（推薦）

### PWA Asset Generator
最簡單的方式是使用 PWA Asset Generator：

```bash
# 安裝
npm install -g pwa-asset-generator

# 生成所有尺寸
pwa-asset-generator icon-template.svg ./icons \
  --background "#4CAF50" \
  --splash-only false \
  --icon-only true \
  --padding "0"
```

### RealFaviconGenerator
訪問 https://realfavicongenerator.net/
1. 上傳 `icon-template.svg`
2. 自定義各平台圖標
3. 下載生成的圖標包
4. 解壓到 `icons/` 目錄

## 方法 2: 使用 ImageMagick（命令列）

如果已安裝 ImageMagick：

```bash
# 先將 SVG 轉為高解析度 PNG (2048x2048)
convert icon-template.svg -resize 2048x2048 icon-2048.png

# 然後生成各種尺寸
convert icon-2048.png -resize 32x32 icon-32x32.png
convert icon-2048.png -resize 72x72 icon-72x72.png
convert icon-2048.png -resize 96x96 icon-96x96.png
convert icon-2048.png -resize 128x128 icon-128x128.png
convert icon-2048.png -resize 144x144 icon-144x144.png
convert icon-2048.png -resize 152x152 icon-152x152.png
convert icon-2048.png -resize 180x180 icon-180x180.png
convert icon-2048.png -resize 192x192 icon-192x192.png
convert icon-2048.png -resize 384x384 icon-384x384.png
convert icon-2048.png -resize 512x512 icon-512x512.png
```

## 方法 3: 使用 Node.js 腳本

創建 `generate-icons.js`：

```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [32, 72, 96, 128, 144, 152, 180, 192, 384, 512];
const inputSvg = 'icon-template.svg';

async function generateIcons() {
  for (const size of sizes) {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(`icon-${size}x${size}.png`);

    console.log(`Generated icon-${size}x${size}.png`);
  }
}

generateIcons().then(() => {
  console.log('All icons generated successfully!');
});
```

安裝依賴並執行：
```bash
npm install sharp
node generate-icons.js
```

## 方法 4: 使用設計工具

### Figma
1. 在 Figma 中打開 SVG
2. 創建各種尺寸的 Frame
3. 使用 Export 功能匯出為 PNG @1x, @2x, @3x

### Adobe Illustrator
1. 打開 SVG 檔案
2. File > Export > Export for Screens
3. 設定各種尺寸並匯出

### Sketch
1. 導入 SVG
2. 使用 Make Exportable
3. 添加各種尺寸並匯出

## Maskable Icons（遮罩圖標）

對於 `icon-192x192.png` 和 `icon-512x512.png`，建議創建 maskable 版本：

1. 在圖標周圍添加 10% 的 safe zone
2. 確保重要內容在中央 80% 區域內
3. 使用 https://maskable.app/ 預覽效果

## 快速測試腳本

創建一個快速生成佔位圖標的腳本（用於開發測試）：

```bash
#!/bin/bash
# quick-icons.sh

# 顏色：綠色背景
BG_COLOR="#4CAF50"

for size in 32 72 96 128 144 152 180 192 384 512; do
  convert -size ${size}x${size} \
    xc:${BG_COLOR} \
    -gravity center \
    -pointsize $((size/3)) \
    -fill white \
    -annotate +0+0 "PWA" \
    icon-${size}x${size}.png
  echo "Created icon-${size}x${size}.png"
done
```

執行：
```bash
chmod +x quick-icons.sh
./quick-icons.sh
```

## 圖標設計建議

### 1. 保持簡潔
- 使用簡單、可識別的形狀
- 避免過多細節（小尺寸時會模糊）
- 使用高對比度顏色

### 2. 品牌一致性
- 使用品牌顏色
- 保持與應用主題一致
- 考慮深色/淺色主題

### 3. 尺寸考量
- 小圖標 (32-96px)：極簡設計
- 中圖標 (128-192px)：適度細節
- 大圖標 (384-512px)：可以更豐富

### 4. Safe Zone
- 為 maskable icons 預留 10% 邊距
- 確保核心內容在安全區域內
- 測試各種形狀遮罩（圓形、圓角矩形、水滴形）

## 圖標驗證

生成圖標後，使用以下工具驗證：

1. **Chrome DevTools**
   - 打開 DevTools > Application > Manifest
   - 檢查所有圖標是否正確載入

2. **Lighthouse**
   ```bash
   lighthouse https://your-app.com --view
   ```
   檢查 PWA 評分中的圖標項目

3. **Maskable.app**
   - https://maskable.app/
   - 上傳 maskable icons 測試各種遮罩效果

4. **PWA Builder**
   - https://www.pwabuilder.com/
   - 輸入網址檢查 PWA 完整性

## 常見問題

### Q: 圖標模糊？
A: 確保從高解析度源文件生成，使用 SVG 或至少 2048x2048 的 PNG

### Q: Android 圖標看起來被裁切？
A: 創建 maskable 版本，預留足夠的 safe zone

### Q: iOS 圖標背景透明？
A: iOS 不支援透明背景，確保使用純色背景

### Q: 需要為深色模式創建不同圖標嗎？
A: manifest.json 暫不支援，但可以使用中性設計適應兩種模式

## 推薦資源

- [PWA Icon Generator](https://tools.crawlink.com/tools/pwa-icon-generator/)
- [Maskable.app](https://maskable.app/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [Icon Kitchen](https://icon.kitchen/)

## 檢查清單

- [ ] 所有 9 種尺寸的 PNG 圖標已生成
- [ ] Maskable icons (192x192, 512x512) 已創建
- [ ] 所有圖標在 manifest.json 中正確引用
- [ ] 使用 Chrome DevTools 驗證圖標載入
- [ ] 使用 Lighthouse 測試 PWA 評分
- [ ] 在實際設備上測試安裝效果
- [ ] 測試 iOS、Android 主屏幕圖標顯示

---

**注意**: 本項目包含的 `icon-template.svg` 是一個示例模板。請根據實際需求自定義設計，或使用上述方法之一生成生產環境所需的圖標。
