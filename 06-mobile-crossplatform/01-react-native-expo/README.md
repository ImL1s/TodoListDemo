# React Native + Expo Todo List Application

一個使用 React Native 和 Expo 構建的現代化、跨平台的待辦事項應用。這個項目展示了如何使用 React Native 生態系統創建高性能的移動應用，同時保持代碼的簡潔性和可維護性。

![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-51.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey?style=for-the-badge)

## 目錄

- [React Native 介紹](#react-native-介紹)
- [Expo 介紹與優勢](#expo-介紹與優勢)
- [React Native vs Flutter](#react-native-vs-flutter)
- [功能特點](#功能特點)
- [技術架構](#技術架構)
- [專案結構](#專案結構)
- [環境需求](#環境需求)
- [安裝指南](#安裝指南)
- [運行應用](#運行應用)
- [開發指南](#開發指南)
- [組件詳解](#組件詳解)
- [狀態管理](#狀態管理)
- [樣式系統](#樣式系統)
- [數據持久化](#數據持久化)
- [性能優化](#性能優化)
- [測試策略](#測試策略)
- [打包與發布](#打包與發布)
- [常見問題](#常見問題)
- [最佳實踐](#最佳實踐)
- [進階功能](#進階功能)
- [資源鏈接](#資源鏈接)

---

## React Native 介紹

### 什麼是 React Native？

React Native 是由 Facebook（Meta）開發的開源框架，允許開發者使用 JavaScript 和 React 來構建真正的原生移動應用。它於 2015 年正式發布，現已成為最受歡迎的跨平台移動開發框架之一。

### React Native 的核心概念

#### 1. **Learn Once, Write Anywhere**

React Native 採用"學習一次，到處編寫"的理念，而不是"一次編寫，到處運行"。這意味著：

- 使用相同的 React 開發理念和模式
- 可以針對不同平台進行優化
- 共享大部分業務邏輯代碼
- 保持平台特定的 UI 體驗

```typescript
// 跨平台代碼
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 20 : 16,
  },
});
```

#### 2. **原生組件**

React Native 使用原生 UI 組件，而不是 WebView：

```typescript
// React Native 組件映射到原生組件
<View>          // iOS: UIView, Android: android.view.View
<Text>          // iOS: UILabel, Android: TextView
<Image>         // iOS: UIImageView, Android: ImageView
<ScrollView>    // iOS: UIScrollView, Android: ScrollView
<TextInput>     // iOS: UITextField, Android: EditText
```

#### 3. **JavaScript 橋接**

React Native 使用 JavaScript 橋接（Bridge）來連接 JavaScript 代碼和原生代碼：

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  JavaScript  │ ◄─────► │    Bridge    │ ◄─────► │    Native    │
│    Thread    │         │   (Async)    │         │    Thread    │
└──────────────┘         └──────────────┘         └──────────────┘
```

#### 4. **新架構（New Architecture）**

React Native 正在過渡到新架構，包括：

- **Fabric**：新的渲染系統，提供更好的性能
- **TurboModules**：新的原生模塊系統，按需加載
- **JSI (JavaScript Interface)**：直接調用原生方法，無需序列化

### React Native 的優勢

#### 1. **開發效率**

- **熱重載（Hot Reload）**：修改代碼後立即看到效果
- **Fast Refresh**：保持應用狀態的同時更新 UI
- **豐富的生態系統**：數千個開源庫可用
- **Chrome DevTools**：熟悉的調試工具

#### 2. **代碼復用**

```typescript
// 業務邏輯可以完全共享
const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    // 這段邏輯在 iOS 和 Android 上完全相同
    setTodos([...todos, { id: uuid(), text, completed: false }]);
  };

  return { todos, addTodo };
};
```

#### 3. **原生性能**

- 直接使用原生 UI 組件
- 60 FPS 流暢動畫
- 原生手勢處理
- 硬件加速

#### 4. **團隊效率**

- Web 開發者可以快速上手
- 單一團隊開發兩個平台
- 減少招聘和培訓成本
- 統一的開發流程

#### 5. **社區支持**

- GitHub 上超過 110K stars
- 大量的第三方庫
- 活躍的社區論壇
- Meta 持續維護和更新

### React Native 的應用案例

許多知名應用都使用 React Native：

- **Facebook**：部分功能使用 React Native
- **Instagram**：大部分功能使用 React Native
- **Discord**：iOS 和 Android 應用
- **Shopify**：移動電商應用
- **Microsoft Teams**：企業協作工具
- **Tesla**：車主應用
- **Walmart**：零售應用
- **Bloomberg**：金融新聞應用

### React Native 的技術棧

```
┌─────────────────────────────────────┐
│      React Components (JSX)         │
├─────────────────────────────────────┤
│      React Native Components        │
├─────────────────────────────────────┤
│      JavaScript Engine (Hermes)     │
├─────────────────────────────────────┤
│      Native Modules Bridge          │
├─────────────────────────────────────┤
│   iOS (Objective-C/Swift)  │  Android (Java/Kotlin)  │
└─────────────────────────────────────┘
```

---

## Expo 介紹與優勢

### 什麼是 Expo？

Expo 是一個圍繞 React Native 構建的開源平台，提供了一整套工具和服務，使移動應用開發變得更加簡單和高效。Expo 由 Expo 公司開發和維護，與 React Native 核心團隊緊密合作。

### Expo 的核心組件

#### 1. **Expo SDK**

Expo SDK 提供了一套經過良好測試的原生 API：

```typescript
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
```

每個 API 都：
- 跨平台一致性
- 完整的 TypeScript 支持
- 詳細的文檔
- 定期更新和維護

#### 2. **Expo Go**

Expo Go 是一個移動應用，讓你無需編譯就能運行 Expo 項目：

```bash
# 啟動開發服務器
expo start

# 在手機上掃描 QR 碼，立即看到應用
```

優點：
- 無需 Xcode 或 Android Studio
- 快速原型開發
- 團隊成員可以立即預覽
- 支持 OTA 更新

#### 3. **Expo CLI**

強大的命令行工具：

```bash
# 創建新項目
npx create-expo-app my-app

# 啟動開發服務器
expo start

# 在模擬器中運行
expo run:ios
expo run:android

# 構建應用
eas build --platform all

# 發布更新
eas update
```

#### 4. **EAS (Expo Application Services)**

雲端構建和發布服務：

```yaml
# eas.json
{
  "build": {
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

功能：
- 雲端構建（無需 Mac 構建 iOS）
- 自動化發布流程
- OTA 更新
- 提交到 App Store/Play Store

### Expo 的主要優勢

#### 1. **零配置開始**

```bash
# 創建並運行項目，只需兩個命令
npx create-expo-app my-todo-app
cd my-todo-app
npm start
```

不需要：
- ❌ 配置 Xcode
- ❌ 安裝 Android Studio
- ❌ 配置原生依賴
- ❌ 處理原生構建錯誤

#### 2. **統一的 API 層**

Expo 封裝了平台差異：

```typescript
// Expo 的 API 在 iOS 和 Android 上完全相同
import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();
const location = await Location.getCurrentPositionAsync({});
```

原生 React Native 需要：
```typescript
// iOS 和 Android 需要不同的配置和權限處理
import Geolocation from '@react-native-community/geolocation';
// 還需要手動配置 iOS Info.plist 和 Android AndroidManifest.xml
```

#### 3. **內置常用功能**

Expo SDK 包含 50+ 常用功能：

```typescript
// 相機
import { Camera } from 'expo-camera';

// 圖片選擇器
import * as ImagePicker from 'expo-image-picker';

// 推送通知
import * as Notifications from 'expo-notifications';

// 文件系統
import * as FileSystem from 'expo-file-system';

// 設備信息
import * as Device from 'expo-device';

// 網絡狀態
import * as Network from 'expo-network';

// 本地認證（指紋/面部識別）
import * as LocalAuthentication from 'expo-local-authentication';

// 應用內購買
import * as InAppPurchases from 'expo-in-app-purchases';
```

#### 4. **優秀的開發體驗**

```typescript
// 自動重載
// 修改代碼後自動刷新，保持應用狀態

// 錯誤疊加層
// 清晰的錯誤信息和堆棧追蹤

// 性能監控
// 內置的性能分析工具

// 調試工具
// 集成 Chrome DevTools 和 React DevTools
```

#### 5. **簡化的發布流程**

```bash
# 構建生產版本
eas build --platform all

# 提交到應用商店
eas submit --platform ios
eas submit --platform android

# OTA 更新（無需重新提交）
eas update --branch production
```

#### 6. **OTA 更新（Over-The-Air）**

```typescript
// 用戶無需下載新版本就能獲得更新
import * as Updates from 'expo-updates';

const update = await Updates.checkForUpdateAsync();
if (update.isAvailable) {
  await Updates.fetchUpdateAsync();
  await Updates.reloadAsync();
}
```

好處：
- 快速修復 bug
- 即時推送新功能
- 無需等待應用商店審核（對於 JavaScript 更改）
- 提高用戶體驗

### Expo 的兩種工作流程

#### 1. **Managed Workflow（託管工作流）**

完全由 Expo 管理原生代碼：

```
優點：
✓ 零原生配置
✓ 快速開發
✓ 簡單維護
✓ 自動更新

限制：
- 僅限 Expo SDK 的功能
- 無法添加自定義原生模塊
```

#### 2. **Bare Workflow（裸工作流）**

完全控制原生項目：

```bash
# 從託管工作流遷移到裸工作流
expo prebuild
```

```
優點：
✓ 完全控制原生代碼
✓ 可以添加任何原生模塊
✓ 仍然可以使用 Expo SDK
✓ 使用 EAS 服務

注意：
- 需要 Xcode 和 Android Studio
- 需要管理原生依賴
- 需要處理原生構建
```

### Expo 的版本策略

Expo 每年發布 4 個主要版本（每季度一次）：

```
Expo SDK 51 (2024 Q2)
├── React Native 0.74
├── 50+ Expo 模塊
└── 支持到 2025 Q2

Expo SDK 50 (2024 Q1)
├── React Native 0.73
├── 新架構支持
└── 支持到 2025 Q1
```

### Expo 的生態系統

#### 1. **Expo Router**

基於文件的路由系統：

```typescript
// app/index.tsx
export default function Home() {
  return <View><Text>Home</Text></View>;
}

// app/profile.tsx
export default function Profile() {
  return <View><Text>Profile</Text></View>;
}

// 自動生成路由
// / -> Home
// /profile -> Profile
```

#### 2. **Expo Image**

優化的圖片組件：

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  placeholder={blurhash}
  contentFit="cover"
  transition={1000}
/>
```

功能：
- 更好的性能
- 自動緩存
- Blurhash 佔位符
- 流暢的過渡動畫

#### 3. **Expo Vector Icons**

8000+ 圖標，開箱即用：

```typescript
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="checkmark-circle" size={24} color="green" />
```

包含圖標集：
- Ionicons
- FontAwesome
- MaterialIcons
- MaterialCommunityIcons
- Entypo
- 等等...

### 何時選擇 Expo？

#### ✅ 適合使用 Expo：

1. **新項目**：從零開始的項目
2. **快速原型**：需要快速驗證想法
3. **小型團隊**：沒有原生開發經驗
4. **常規應用**：使用標準功能的應用
5. **快速迭代**：需要頻繁更新的應用

#### ⚠️ 可能需要考慮：

1. **特殊硬件**：需要訪問特殊硬件 API
2. **自定義原生模塊**：需要編寫大量原生代碼
3. **特定原生庫**：依賴特定的原生庫
4. **極致性能**：需要極致優化的圖形性能

**注意**：即使遇到上述情況，也可以從 Expo 開始，需要時再 `expo prebuild` 遷移到裸工作流。

---

## React Native vs Flutter

兩個框架的全面對比分析，幫助你做出明智的技術選擇。

### 技術架構對比

#### React Native 架構

```
┌─────────────────────────────────┐
│   JavaScript (React)            │
│   ├── JSX/TSX                   │
│   └── JavaScript/TypeScript     │
├─────────────────────────────────┤
│   Bridge (JSON 序列化)          │
├─────────────────────────────────┤
│   Native Components             │
│   ├── iOS: UIKit                │
│   └── Android: Android Views    │
└─────────────────────────────────┘
```

特點：
- 使用原生 UI 組件
- JavaScript 橋接通信
- 異步消息傳遞
- 新架構改進中

#### Flutter 架構

```
┌─────────────────────────────────┐
│   Dart Language                 │
│   └── Widget Tree               │
├─────────────────────────────────┤
│   Flutter Engine (C++)          │
│   ├── Skia Graphics             │
│   └── Dart Runtime              │
├─────────────────────────────────┤
│   Platform Channels             │
│   └── Native APIs               │
└─────────────────────────────────┘
```

特點：
- 自繪 UI（使用 Skia）
- 編譯為原生代碼
- 不依賴原生 UI 組件
- 直接控制每個像素

### 編程語言對比

#### JavaScript/TypeScript (React Native)

```typescript
// TypeScript 示例
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View>
      <Text>{todo.text}</Text>
    </View>
  );
};
```

優點：
- ✅ 世界上最流行的編程語言
- ✅ 龐大的開發者社區
- ✅ 豐富的生態系統
- ✅ Web 開發者容易上手
- ✅ 可以共享 Web 代碼

缺點：
- ⚠️ 類型安全需要 TypeScript
- ⚠️ 運行時錯誤較多
- ⚠️ 性能不如編譯型語言

#### Dart (Flutter)

```dart
// Dart 示例
class Todo {
  final String id;
  final String text;
  final bool completed;

  Todo({required this.id, required this.text, required this.completed});
}

class TodoItem extends StatelessWidget {
  final Todo todo;

  TodoItem({required this.todo});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Text(todo.text),
    );
  }
}
```

優點：
- ✅ 為 UI 開發優化
- ✅ 強類型系統
- ✅ 優秀的性能
- ✅ Null Safety
- ✅ 編譯時錯誤檢查

缺點：
- ⚠️ 相對小眾的語言
- ⚠️ 學習曲線
- ⚠️ Web 開發生態較小
- ⚠️ 招聘可能困難

### UI 開發對比

#### React Native

```typescript
// 使用原生組件
<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
  <TouchableOpacity onPress={handlePress}>
    <Text>Click Me</Text>
  </TouchableOpacity>
  <FlatList
    data={items}
    renderItem={renderItem}
  />
</View>
```

特點：
- 原生 UI 組件
- 平台特定的外觀
- CSS-like 樣式
- Flexbox 布局

#### Flutter

```dart
// 使用 Widget
Container(
  child: Column(
    children: [
      Text('Hello', style: TextStyle(fontSize: 24)),
      TextButton(
        onPressed: handlePress,
        child: Text('Click Me'),
      ),
      ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) => buildItem(items[index]),
      ),
    ],
  ),
)
```

特點：
- Widget 組合
- 一致的跨平台外觀
- 豐富的內置 Widget
- 靈活的布局系統

### 性能對比

#### 啟動時間

```
React Native:
├── JavaScript 引擎初始化: ~200ms
├── 加載 JavaScript Bundle: ~300ms
├── 首次渲染: ~100ms
└── 總計: ~600ms

Flutter:
├── Dart VM 初始化: ~100ms
├── 首次渲染: ~50ms
└── 總計: ~150ms
```

**結論**：Flutter 啟動更快

#### 運行時性能

```
React Native:
├── 列表滾動: 50-60 FPS
├── 複雜動畫: 40-50 FPS
└── JavaScript 橋接開銷

Flutter:
├── 列表滾動: 60 FPS
├── 複雜動畫: 60 FPS
└── 直接編譯為原生代碼
```

**結論**：Flutter 在複雜場景下性能更穩定

#### 內存使用

```
React Native:
├── 基礎內存: ~50MB
├── JavaScript VM: ~20MB
└── 隨應用複雜度增加

Flutter:
├── 基礎內存: ~40MB
├── Dart VM: ~15MB
└── 渲染引擎: ~10MB
```

**結論**：兩者相當，取決於應用複雜度

### 開發體驗對比

#### 熱重載

React Native（Fast Refresh）：
```typescript
// 修改代碼
const App = () => {
  return <Text>Hello World</Text>;  // 改成 Hello React Native
};
// 保存後立即看到更新，保持應用狀態
```

Flutter（Hot Reload）：
```dart
// 修改代碼
Widget build(BuildContext context) {
  return Text('Hello World');  // 改成 Hello Flutter
}
// 保存後 < 1 秒看到更新
```

**結論**：兩者都很快，Flutter 稍快一些

#### 調試工具

React Native：
- Chrome DevTools
- React DevTools
- Flipper
- console.log()
- 斷點調試

Flutter：
- Dart DevTools
- Flutter Inspector
- Widget 樹檢查
- 性能分析器
- 網絡監控

**結論**：兩者都有優秀的調試工具

### 生態系統對比

#### 第三方庫

React Native：
```bash
npm install
# 數量：100,000+ npm 包
# React Native 特定：10,000+
# 質量：參差不齊
# 維護：社區維護
```

Flutter：
```bash
flutter pub add
# 數量：30,000+ pub.dev 包
# Flutter 特定：20,000+
# 質量：較高（有質量評分）
# 維護：Google + 社區
```

#### 常用功能對比

| 功能 | React Native | Flutter |
|------|-------------|---------|
| HTTP 請求 | axios, fetch | http, dio |
| 狀態管理 | Redux, MobX, Zustand | Provider, Riverpod, Bloc |
| 導航 | React Navigation | Navigator 2.0 |
| 動畫 | Animated API, Reanimated | Animation, AnimatedBuilder |
| 本地存儲 | AsyncStorage, MMKV | SharedPreferences, Hive |
| 國際化 | i18next, react-intl | intl, easy_localization |

### 平台支持對比

#### 移動平台

React Native：
- ✅ iOS (iPhone, iPad)
- ✅ Android (Phone, Tablet)
- ✅ 成熟穩定
- ✅ 原生外觀

Flutter：
- ✅ iOS (iPhone, iPad)
- ✅ Android (Phone, Tablet)
- ✅ 成熟穩定
- ✅ 一致外觀

**結論**：兩者在移動平台都很成熟

#### Web 平台

React Native：
```bash
# React Native Web
npm install react-native-web
# 需要額外配置
# 不是所有組件都支持
# 性能一般
```

Flutter：
```bash
flutter build web
# 開箱即用
# 所有 Widget 都支持
# 性能較好（使用 CanvasKit）
```

**結論**：Flutter 的 Web 支持更好

#### 桌面平台

React Native：
```bash
# React Native Windows + macOS
# Microsoft 維護
# 較新，還在發展中
```

Flutter：
```bash
flutter build windows
flutter build macos
flutter build linux
# 穩定版本已發布
# 良好的性能
```

**結論**：Flutter 的桌面支持更成熟

### 學習曲線對比

#### React Native

```
初學者：
├── 需要了解 JavaScript/TypeScript
├── 需要了解 React
├── 需要了解 React Native 組件
└── 學習時間：2-4 週（有 React 經驗）

進階：
├── 原生模塊開發
├── 性能優化
├── 複雜狀態管理
└── 學習時間：2-3 個月
```

#### Flutter

```
初學者：
├── 需要學習 Dart
├── 需要了解 Widget 概念
├── 需要了解 Flutter 框架
└── 學習時間：3-5 週（無 Dart 經驗）

進階：
├── Platform Channels
├── 自定義繪製
├── 狀態管理模式
└── 學習時間：2-3 個月
```

**結論**：如果有 React 經驗，React Native 更容易上手；否則差不多

### 企業採用情況

#### React Native 採用者

大型應用：
- Facebook / Instagram
- Discord
- Shopify
- Microsoft Teams
- Tesla
- Bloomberg
- Walmart

行業：
- 社交媒體
- 電商
- 企業應用
- 金融科技

#### Flutter 採用者

大型應用：
- Google Ads
- Alibaba (閑魚)
- BMW
- eBay
- Nubank
- Grab
- ByteDance (部分應用)

行業：
- 廣告
- 電商
- 汽車
- 金融科技

### 社區與支持

#### React Native

```
GitHub Stars: 110K+
Contributors: 2,500+
NPM Weekly Downloads: 500K+
Stack Overflow Questions: 100K+
Discord Members: 50K+
```

支持：
- Meta (Facebook) 核心維護
- Microsoft 貢獻（Windows/macOS）
- Expo 提供工具支持
- 活躍的社區

#### Flutter

```
GitHub Stars: 160K+
Contributors: 1,500+
Pub.dev Monthly Downloads: 10M+
Stack Overflow Questions: 80K+
Discord Members: 40K+
```

支持：
- Google 核心維護
- 定期發布新版本
- 完善的文檔
- 活躍的社區

### 選擇建議

#### 選擇 React Native 如果：

1. **團隊背景**
   - ✅ 團隊有 React 或 Web 開發經驗
   - ✅ 想要復用 Web 代碼
   - ✅ 需要使用 JavaScript 生態系統

2. **項目需求**
   - ✅ 需要原生的外觀和感覺
   - ✅ 需要大量第三方庫
   - ✅ 需要與現有原生應用集成

3. **商業考慮**
   - ✅ 更容易招聘到 JavaScript 開發者
   - ✅ 可以利用現有的 Web 開發團隊
   - ✅ 成熟的生態系統和案例

#### 選擇 Flutter 如果：

1. **團隊背景**
   - ✅ 團隊願意學習 Dart
   - ✅ 重視性能和一致性
   - ✅ 需要支持多平台（包括 Web 和桌面）

2. **項目需求**
   - ✅ 需要複雜的動畫和自定義 UI
   - ✅ 需要像素級的控制
   - ✅ 需要一致的跨平台外觀
   - ✅ 性能是關鍵要求

3. **商業考慮**
   - ✅ 長期項目，願意投資學習
   - ✅ 需要 Web 和桌面支持
   - ✅ Google 生態系統

### 混合方案

不必非此即彼，可以：

1. **React Native for Web**：一套代碼運行在移動和 Web
2. **Flutter for Embedded**：Flutter 用於嵌入式設備
3. **混合使用**：不同項目使用不同技術
4. **逐步遷移**：從一個框架逐步遷移到另一個

### 未來趨勢

#### React Native

- 新架構（Fabric + TurboModules）完全推出
- 更好的性能
- 更好的 TypeScript 支持
- 與 React 18+ 特性對齊

#### Flutter

- Impeller 渲染引擎
- Wasm 支持
- 更好的 Web 性能
- 擴展到更多平台

---

## 功能特點

### 性能優化亮點 ⚡

本應用已實現多項性能優化，確保流暢的用戶體驗：

#### ✅ **列表虛擬化**
- 使用 **FlatList** 替代 ScrollView
- 支持高效渲染 1000+ 待辦事項
- 配置優化參數提升滾動性能

#### ✅ **React 優化**
- **React.memo** 包裹 TodoItem 組件，減少不必要渲染
- **useCallback** 優化事件處理函數
- 穩定的引用防止子組件重渲染

#### ✅ **用戶體驗優化**
- 異步操作顯示 **加載狀態**
- **ErrorBoundary** 捕獲運行時錯誤
- **錯誤處理**機制，提供用戶友好的錯誤提示和重試選項

#### ✅ **代碼質量**
- 完整的 **TypeScript** 類型支持
- 詳細的文檔和註釋
- 遵循 React Native 最佳實踐

---

### 核心功能

本應用實現了完整的待辦事項管理功能：

#### 1. **任務管理**

- ✅ **添加任務**：輸入文字並添加新任務
- ✅ **完成任務**：點擊複選框標記任務完成/未完成
- ✅ **刪除任務**：滑動或點擊刪除按鈕移除任務
- ✅ **任務時間戳**：顯示任務創建時間

```typescript
const addTodo = (text: string) => {
  const newTodo: Todo = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: Date.now(),
  };
  setTodos([newTodo, ...todos]);
};
```

#### 2. **數據持久化**

使用 AsyncStorage 保存數據：

```typescript
// 保存數據
const saveTodos = async () => {
  await AsyncStorage.setItem('@TodoList:todos', JSON.stringify(todos));
};

// 加載數據
const loadTodos = async () => {
  const stored = await AsyncStorage.getItem('@TodoList:todos');
  if (stored) {
    setTodos(JSON.parse(stored));
  }
};
```

特點：
- 自動保存所有更改
- 應用重啟後數據保持
- 異步操作不阻塞 UI
- 錯誤處理

#### 3. **統計信息**

實時顯示任務統計：

```typescript
const totalTodos = todos.length;
const completedTodos = todos.filter(t => t.completed).length;
const activeTodos = totalTodos - completedTodos;
```

顯示：
- 總任務數
- 活動任務數
- 已完成任務數

#### 4. **鍵盤管理**

智能鍵盤處理：

```typescript
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  {/* 內容 */}
</KeyboardAvoidingView>
```

功能：
- iOS 和 Android 平台適配
- 點擊外部區域關閉鍵盤
- 輸入完成後自動關閉
- 鍵盤出現時調整布局

### UI/UX 特點

#### 1. **漸變背景**

使用 Expo Linear Gradient：

```typescript
<LinearGradient
  colors={['#667eea', '#764ba2']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
```

效果：
- 美麗的紫色漸變
- 從左上到右下
- 現代感設計

#### 2. **陰影效果**

平台特定的陰影：

```typescript
const shadows = {
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },
};
```

#### 3. **觸控反饋**

優化的觸控體驗：

```typescript
<TouchableOpacity activeOpacity={0.7}>
  {/* 按鈕內容 */}
</TouchableOpacity>

<Pressable android_ripple={{ color: 'rgba(102, 126, 234, 0.3)' }}>
  {/* 可按壓內容 */}
</Pressable>
```

#### 4. **流暢動畫**

使用原生動畫：

```typescript
<ScrollView
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
>
```

### 跨平台適配

#### iOS 特性

```typescript
Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
```

- UIKit 風格
- 原生陰影
- 標準間距
- Haptic 反饋（可選）

#### Android 特性

```typescript
Platform.select({
  android: {
    elevation: 4,
  },
});
```

- Material Design
- Elevation 陰影
- Ripple 效果
- Back 按鈕處理

---

## 技術架構

### 架構圖

```
┌─────────────────────────────────────────────┐
│              App.tsx (Root)                 │
│  ├── State Management (useState)            │
│  ├── Data Persistence (AsyncStorage)        │
│  └── Business Logic                         │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼──────────┐   ┌────────▼─────────┐
│   TodoInput      │   │    TodoList      │
│  - TextInput     │   │  - ScrollView    │
│  - Add Button    │   │  - Empty State   │
└──────────────────┘   └────────┬─────────┘
                                │
                        ┌───────▼──────────┐
                        │    TodoItem      │
                        │  - Checkbox      │
                        │  - Text          │
                        │  - Delete Button │
                        └──────────────────┘
```

### 組件層次

```typescript
<App>
  <LinearGradient>
    <SafeAreaView>
      {/* Header */}
      <View>
        <Text>Title</Text>
        <View>Stats</View>
      </View>

      {/* Content */}
      <View>
        <TodoInput onAddTodo={handleAddTodo} />
        <TodoList
          todos={todos}
          onToggleTodo={handleToggle}
          onDeleteTodo={handleDelete}
        />
      </View>
    </SafeAreaView>
  </LinearGradient>
</App>
```

### 數據流

```
User Action
    ↓
Event Handler
    ↓
State Update (setState)
    ↓
Re-render Components
    ↓
Save to AsyncStorage
    ↓
UI Update
```

### 類型系統

```typescript
// 核心類型定義
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// 組件 Props 類型
interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}
```

---

## 專案結構

```
01-react-native-expo/
├── App.tsx                    # 主應用組件
├── app.json                   # Expo 配置文件
├── package.json              # 依賴管理
├── tsconfig.json             # TypeScript 配置
├── .gitignore                # Git 忽略文件
├── README.md                 # 項目文檔
│
├── src/
│   ├── components/          # React 組件
│   │   ├── TodoInput.tsx    # 輸入組件
│   │   ├── TodoList.tsx     # 列表組件
│   │   └── TodoItem.tsx     # 項目組件
│   │
│   ├── types.ts             # TypeScript 類型定義
│   └── styles.ts            # 樣式定義
│
├── assets/                   # 資源文件
│   ├── icon.png             # 應用圖標
│   ├── splash.png           # 啟動畫面
│   └── adaptive-icon.png    # Android 自適應圖標
│
└── node_modules/            # 依賴包（自動生成）
```

### 文件說明

#### 配置文件

**app.json**
```json
{
  "expo": {
    "name": "Todo List",
    "slug": "todo-list-expo",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.yourcompany.todolist"
    },
    "android": {
      "package": "com.yourcompany.todolist"
    }
  }
}
```

**tsconfig.json**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native"
  }
}
```

#### 源代碼文件

**App.tsx**：應用入口，包含主要邏輯和狀態管理

**src/components/TodoInput.tsx**：處理用戶輸入和添加任務

**src/components/TodoList.tsx**：顯示任務列表

**src/components/TodoItem.tsx**：單個任務項的渲染

**src/types.ts**：所有 TypeScript 類型定義

**src/styles.ts**：集中管理樣式

---

## 環境需求

### 必需工具

#### 1. **Node.js**

```bash
# 檢查版本
node --version  # 需要 v16.0.0 或更高

# 推薦使用 LTS 版本
# 下載：https://nodejs.org/
```

#### 2. **npm 或 yarn**

```bash
# 檢查 npm 版本
npm --version  # 需要 v7.0.0 或更高

# 或者使用 yarn
yarn --version  # 需要 v1.22.0 或更高
```

#### 3. **Expo CLI**

```bash
# 全局安裝 Expo CLI
npm install -g expo-cli

# 或者使用 npx（推薦）
npx expo --version
```

### 開發環境

#### 選項 1：使用 Expo Go（推薦新手）

只需要：
- ✅ Node.js
- ✅ 智能手機（iOS 或 Android）
- ✅ Expo Go 應用

優點：
- 最簡單的設置
- 無需安裝 Xcode 或 Android Studio
- 快速開始開發

#### 選項 2：使用模擬器

**iOS 開發（僅 macOS）：**

```bash
# 安裝 Xcode（從 App Store）
# Xcode 14 或更高

# 安裝 Xcode 命令行工具
xcode-select --install

# 啟動模擬器
open -a Simulator
```

**Android 開發：**

```bash
# 安裝 Android Studio
# 下載：https://developer.android.com/studio

# 安裝 Android SDK
# 設置環境變量
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 創建 Android 模擬器
# 在 Android Studio 中使用 AVD Manager
```

### 系統需求

**macOS：**
- macOS 12.0 或更高（用於 iOS 開發）
- 至少 8GB RAM
- 至少 20GB 可用空間

**Windows：**
- Windows 10 或更高
- 至少 8GB RAM
- 至少 20GB 可用空間
- 僅支持 Android 開發

**Linux：**
- Ubuntu 18.04 或更高
- 至少 8GB RAM
- 至少 20GB 可用空間
- 僅支持 Android 開發

---

## 安裝指南

### 快速開始（5 分鐘）

```bash
# 1. 克隆項目（或複製文件）
cd 06-mobile-crossplatform/01-react-native-expo

# 2. 安裝依賴
npm install
# 或
yarn install

# 3. 啟動開發服務器
npm start
# 或
yarn start

# 4. 掃描 QR 碼（使用 Expo Go 應用）
# 或按 'i' 打開 iOS 模擬器
# 或按 'a' 打開 Android 模擬器
```

### 詳細安裝步驟

#### 步驟 1：安裝 Node.js

**macOS（使用 Homebrew）：**
```bash
# 安裝 Homebrew（如果還沒有）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安裝 Node.js
brew install node

# 驗證安裝
node --version
npm --version
```

**Windows：**
```bash
# 下載安裝程序
# https://nodejs.org/en/download/

# 運行安裝程序
# 勾選 "Add to PATH"

# 驗證安裝（在命令提示符中）
node --version
npm --version
```

**Linux（Ubuntu/Debian）：**
```bash
# 使用 NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 驗證安裝
node --version
npm --version
```

#### 步驟 2：安裝項目依賴

```bash
# 進入項目目錄
cd 01-react-native-expo

# 清理可能的舊依賴
rm -rf node_modules package-lock.json

# 安裝依賴
npm install

# 等待安裝完成（可能需要幾分鐘）
```

依賴包括：
- expo: Expo SDK
- react-native: React Native 核心
- @react-native-async-storage/async-storage: 數據持久化
- expo-linear-gradient: 漸變背景
- TypeScript 相關包

#### 步驟 3：設置 Expo 賬號（可選）

```bash
# 創建 Expo 賬號
npx expo register

# 或登錄現有賬號
npx expo login
```

好處：
- 使用 EAS Build 構建應用
- 使用 EAS Update 推送更新
- 協作開發

### 故障排除

#### 問題 1：端口被占用

```bash
Error: Port 19000 is already in use

# 解決方案 1：找到並終止進程
lsof -ti :19000 | xargs kill -9

# 解決方案 2：使用不同端口
expo start --port 19001
```

#### 問題 2：Metro bundler 緩存問題

```bash
# 清除 Metro bundler 緩存
npm start -- --reset-cache

# 或
expo start -c
```

#### 問題 3：watchman 問題（macOS）

```bash
# 安裝 watchman
brew install watchman

# 重置 watchman
watchman watch-del-all
```

#### 問題 4：模塊解析錯誤

```bash
# 清除所有緩存
rm -rf node_modules
rm -rf .expo
rm -rf $TMPDIR/react-*
npm install
```

---

## 運行應用

### 使用 Expo Go（最簡單）

#### iOS 設備：

1. 從 App Store 下載 Expo Go：
   ```
   App Store -> 搜索 "Expo Go" -> 安裝
   ```

2. 啟動開發服務器：
   ```bash
   npm start
   ```

3. 掃描 QR 碼：
   - 打開 iOS 相機應用
   - 掃描終端中的 QR 碼
   - 點擊通知在 Expo Go 中打開

#### Android 設備：

1. 從 Google Play 下載 Expo Go：
   ```
   Play Store -> 搜索 "Expo Go" -> 安裝
   ```

2. 啟動開發服務器：
   ```bash
   npm start
   ```

3. 掃描 QR 碼：
   - 打開 Expo Go 應用
   - 點擊 "Scan QR Code"
   - 掃描終端中的 QR 碼

### 使用 iOS 模擬器（僅 macOS）

#### 前提條件：

```bash
# 確保已安裝 Xcode
xcode-select -p

# 如果未安裝
xcode-select --install
```

#### 運行步驟：

```bash
# 方法 1：使用 Expo CLI
npm start
# 按 'i' 在 iOS 模擬器中打開

# 方法 2：直接構建
npx expo run:ios

# 指定特定設備
npx expo run:ios --device "iPhone 14 Pro"
```

#### 管理模擬器：

```bash
# 列出可用的模擬器
xcrun simctl list devices

# 啟動特定模擬器
open -a Simulator

# 在 Xcode 中管理模擬器
# Xcode -> Window -> Devices and Simulators
```

### 使用 Android 模擬器

#### 前提條件：

```bash
# 確保已安裝 Android Studio
# 確保已設置 ANDROID_HOME 環境變量

echo $ANDROID_HOME
# 應該輸出類似：/Users/username/Library/Android/sdk
```

#### 創建模擬器：

1. 打開 Android Studio
2. Tools -> Device Manager
3. Create Device
4. 選擇設備定義（例如：Pixel 5）
5. 選擇系統映像（推薦：API 33）
6. 完成創建

#### 運行步驟：

```bash
# 方法 1：使用 Expo CLI
npm start
# 按 'a' 在 Android 模擬器中打開

# 方法 2：直接構建
npx expo run:android

# 指定特定設備
npx expo run:android --device emulator-5554
```

#### 查看日誌：

```bash
# 查看 Android 日誌
npx react-native log-android

# 使用 adb
adb logcat
```

### 在真實設備上運行

#### iOS（需要 Apple Developer 賬號）：

```bash
# 連接 iPhone 到 Mac
# 信任此電腦

# 運行應用
npx expo run:ios --device

# 選擇你的設備
```

#### Android：

```bash
# 啟用 USB 調試
# 設置 -> 關於手機 -> 連續點擊 "版本號" 7 次
# 設置 -> 開發者選項 -> USB 調試

# 連接設備到電腦

# 驗證連接
adb devices

# 運行應用
npx expo run:android --device
```

### 開發服務器命令

啟動開發服務器後，可以使用以下快捷鍵：

```
› Press i │ open iOS simulator
› Press a │ open Android emulator or device
› Press w │ open web browser
› Press r │ reload app
› Press m │ toggle menu
› Press d │ show developer menu
› Press j │ open debugger
› Press ? │ show all commands
```

### Web 版本（實驗性）

```bash
# 在瀏覽器中運行
npm start
# 按 'w' 在瀏覽器中打開

# 或直接啟動 web 版本
npx expo start --web
```

---

## 開發指南

### 開發工作流程

#### 1. **開始新功能**

```bash
# 創建新分支
git checkout -b feature/new-feature

# 啟動開發服務器
npm start

# 開始編碼
```

#### 2. **實時開發**

```typescript
// 修改代碼
const App = () => {
  return (
    <View>
      <Text>Hello World</Text> // 修改這裡
    </View>
  );
};

// 保存文件（Cmd+S 或 Ctrl+S）
// 應用自動重新加載
// 檢查設備/模擬器
```

#### 3. **調試**

**使用 console.log：**
```typescript
console.log('Debug message:', variable);
console.warn('Warning message');
console.error('Error message');
```

**使用 React DevTools：**
```bash
# 安裝 React DevTools
npm install -g react-devtools

# 啟動 React DevTools
react-devtools

# 在應用中：
# 搖動設備 -> Debug Remote JS
```

**使用 Chrome DevTools：**
```bash
# 在開發服務器中按 'j'
# 或搖動設備 -> Debug Remote JS

# 瀏覽器打開：http://localhost:19000/debugger-ui/
```

#### 4. **類型檢查**

```bash
# 運行 TypeScript 類型檢查
npm run type-check

# 或在編輯器中實時檢查（VS Code）
# 安裝推薦的擴展
```

#### 5. **代碼格式化**

```bash
# 安裝 Prettier
npm install --save-dev prettier

# 創建 .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}

# 格式化代碼
npx prettier --write "**/*.{ts,tsx}"
```

### 推薦的 VS Code 擴展

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "dsznajder.es7-react-js-snippets",
    "christian-kohler.npm-intellisense",
    "expo.vscode-expo-tools"
  ]
}
```

### 常用代碼片段

#### React Native 組件

```typescript
// rnf - React Native Function Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ComponentName = () => {
  return (
    <View style={styles.container}>
      <Text>ComponentName</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ComponentName;
```

#### useState Hook

```typescript
// us - useState
const [state, setState] = useState(initialState);
```

#### useEffect Hook

```typescript
// ue - useEffect
useEffect(() => {
  // effect logic
  return () => {
    // cleanup
  };
}, [dependencies]);
```

### Git 工作流程

```bash
# 查看狀態
git status

# 暫存更改
git add .

# 提交更改
git commit -m "feat: add new feature"

# 推送到遠程
git push origin feature/new-feature

# 創建 Pull Request
```

### 環境變量

```typescript
// app.config.ts
export default {
  extra: {
    apiUrl: process.env.API_URL || 'https://api.example.com',
  },
};

// 使用
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

---

## 組件詳解

### App.tsx

主應用組件，包含所有業務邏輯和狀態管理。

#### 關鍵功能：

**1. 狀態管理**
```typescript
const [todos, setTodos] = useState<Todo[]>([]);
const [isLoading, setIsLoading] = useState(true);
```

**2. 數據持久化**
```typescript
useEffect(() => {
  loadTodos();
}, []);

useEffect(() => {
  if (!isLoading) {
    saveTodos();
  }
}, [todos, isLoading]);
```

**3. 業務邏輯**
```typescript
const handleAddTodo = useCallback((text: string) => {
  const newTodo: Todo = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text,
    completed: false,
    createdAt: Date.now(),
  };
  setTodos((prevTodos) => [newTodo, ...prevTodos]);
}, []);
```

### TodoInput.tsx

處理用戶輸入和添加新任務。

#### 關鍵特性：

**1. 受控組件**
```typescript
const [text, setText] = useState('');

<TextInput
  value={text}
  onChangeText={setText}
/>
```

**2. 輸入驗證**
```typescript
const handleAdd = () => {
  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return;
  }
  onAddTodo(trimmedText);
  setText('');
  Keyboard.dismiss();
};
```

**3. 鍵盤處理**
```typescript
<TextInput
  onSubmitEditing={handleSubmit}
  returnKeyType="done"
  blurOnSubmit={false}
/>
```

### TodoList.tsx

顯示任務列表，處理滾動和空狀態。

#### 關鍵特性：

**1. 條件渲染**
```typescript
{todos.length === 0 ? renderEmptyState() : renderTodoList()}
```

**2. 鍵盤避讓**
```typescript
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
```

**3. 優化滾動**
```typescript
<ScrollView
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
>
```

### TodoItem.tsx

單個任務項的渲染和交互。

#### 關鍵特性：

**1. 時間格式化**
```typescript
const formatDate = (timestamp: number): string => {
  const diffMins = Math.floor((Date.now() - timestamp) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  // ...
};
```

**2. 觸控反饋**
```typescript
<Pressable
  android_ripple={{ color: 'rgba(102, 126, 234, 0.3)' }}
  onPress={onToggle}
>
```

**3. 條件樣式**
```typescript
<Text
  style={[
    styles.text,
    todo.completed && styles.textCompleted,
  ]}
>
```

---

## 狀態管理

### 本地狀態（useState）

本應用使用 React 的 `useState` 管理狀態：

```typescript
const [todos, setTodos] = useState<Todo[]>([]);
```

優點：
- 簡單直接
- 無需額外依賴
- 適合小型應用

### 狀態更新模式

**1. 直接設置**
```typescript
setTodos([newTodo, ...todos]);
```

**2. 函數式更新（推薦）**
```typescript
setTodos((prevTodos) => [newTodo, ...prevTodos]);
```

好處：
- 保證使用最新狀態
- 避免競態條件
- 更好的性能

### 進階狀態管理方案

對於更複雜的應用，可以考慮：

#### 1. **Context API**

```typescript
// TodoContext.tsx
const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
};

// 使用
const { todos } = useContext(TodoContext);
```

#### 2. **Redux Toolkit**

```typescript
// todoSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
  },
});
```

#### 3. **Zustand**

```typescript
// store.ts
import create from 'zustand';

const useTodoStore = create((set) => ({
  todos: [],
  addTodo: (todo) => set((state) => ({
    todos: [...state.todos, todo]
  })),
}));
```

#### 4. **MobX**

```typescript
// todoStore.ts
import { makeAutoObservable } from 'mobx';

class TodoStore {
  todos = [];

  constructor() {
    makeAutoObservable(this);
  }

  addTodo(todo) {
    this.todos.push(todo);
  }
}
```

---

## 樣式系統

### StyleSheet API

React Native 使用 JavaScript 對象定義樣式：

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
```

優點：
- 類型檢查
- 性能優化
- 自動完成

### Flexbox 布局

React Native 默認使用 Flexbox：

```typescript
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',      // 'row' | 'column'
    justifyContent: 'center',  // 主軸對齊
    alignItems: 'center',      // 交叉軸對齊
    flex: 1,                   // 佔用可用空間
  },
});
```

### 響應式設計

**1. 使用 Dimensions**
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,  // 90% 寬度
  },
});
```

**2. 使用 PixelRatio**
```typescript
import { PixelRatio } from 'react-native';

const size = PixelRatio.getFontScale() * 16;  // 響應式字體
```

### 平台特定樣式

```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

### 樣式組合

```typescript
<View style={[styles.container, styles.elevated, customStyle]} />
```

### 主題系統

```typescript
// theme.ts
export const lightTheme = {
  colors: {
    primary: '#667eea',
    background: '#fff',
    text: '#000',
  },
};

export const darkTheme = {
  colors: {
    primary: '#667eea',
    background: '#000',
    text: '#fff',
  },
};

// 使用
const styles = StyleSheet.create({
  text: {
    color: theme.colors.text,
  },
});
```

---

## 數據持久化

### AsyncStorage

AsyncStorage 是 React Native 的鍵值對存儲系統。

#### 基本用法：

**保存數據**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveTodos = async (todos: Todo[]) => {
  try {
    await AsyncStorage.setItem('@TodoList:todos', JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos:', error);
  }
};
```

**讀取數據**
```typescript
const loadTodos = async (): Promise<Todo[]> => {
  try {
    const stored = await AsyncStorage.getItem('@TodoList:todos');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
};
```

**刪除數據**
```typescript
const clearTodos = async () => {
  try {
    await AsyncStorage.removeItem('@TodoList:todos');
  } catch (error) {
    console.error('Error clearing todos:', error);
  }
};
```

#### 最佳實踐：

**1. 使用常量作為鍵**
```typescript
enum StorageKeys {
  TODOS = '@TodoList:todos',
  SETTINGS = '@TodoList:settings',
}
```

**2. 錯誤處理**
```typescript
const saveTodos = async (todos: Todo[]) => {
  try {
    await AsyncStorage.setItem(StorageKeys.TODOS, JSON.stringify(todos));
  } catch (error) {
    if (error.code === 'QuotaExceededError') {
      // 存儲空間不足
      Alert.alert('Storage Full', 'Please free up some space');
    } else {
      console.error('Error saving todos:', error);
    }
  }
};
```

**3. 批量操作**
```typescript
const saveMultiple = async () => {
  try {
    await AsyncStorage.multiSet([
      ['@key1', 'value1'],
      ['@key2', 'value2'],
    ]);
  } catch (error) {
    console.error('Error saving multiple:', error);
  }
};
```

### 進階存儲方案

#### 1. **MMKV（推薦）**

更快的鍵值存儲：

```bash
npm install react-native-mmkv
```

```typescript
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// 存儲
storage.set('todos', JSON.stringify(todos));

// 讀取
const todos = JSON.parse(storage.getString('todos') || '[]');
```

性能：
- 比 AsyncStorage 快 30 倍
- 同步 API
- 支持加密

#### 2. **WatermelonDB**

用於複雜數據關係：

```bash
npm install @nozbe/watermelondb
```

```typescript
// schema.ts
const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'todos',
      columns: [
        { name: 'text', type: 'string' },
        { name: 'completed', type: 'boolean' },
      ],
    }),
  ],
});
```

#### 3. **Realm**

移動數據庫：

```bash
npm install realm
```

```typescript
const TodoSchema = {
  name: 'Todo',
  properties: {
    id: 'string',
    text: 'string',
    completed: 'bool',
  },
};
```

---

## 性能優化

### React 性能優化

#### 1. **使用 React.memo**

```typescript
const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  // 只在 props 改變時重新渲染
  return (
    <View>
      <Text>{todo.text}</Text>
    </View>
  );
});
```

#### 2. **使用 useCallback**

```typescript
const handleToggle = useCallback((id: string) => {
  setTodos((prev) =>
    prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
  );
}, []);
```

#### 3. **使用 useMemo**

```typescript
const sortedTodos = useMemo(() => {
  return todos.sort((a, b) => b.createdAt - a.createdAt);
}, [todos]);
```

### 列表性能優化

#### 1. **使用 FlatList 而不是 ScrollView**

```typescript
// ❌ 不好：渲染所有項目
<ScrollView>
  {todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
</ScrollView>

// ✅ 好：虛擬化列表
<FlatList
  data={todos}
  renderItem={({ item }) => <TodoItem todo={item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={5}
/>
```

#### 2. **優化 keyExtractor**

```typescript
// ❌ 不好：每次渲染創建新函數
<FlatList
  keyExtractor={(item) => item.id}
/>

// ✅ 好：使用穩定的引用
const keyExtractor = (item: Todo) => item.id;

<FlatList keyExtractor={keyExtractor} />
```

#### 3. **使用 getItemLayout**

```typescript
const ITEM_HEIGHT = 80;

const getItemLayout = (_: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

<FlatList
  getItemLayout={getItemLayout}
  // 跳過測量，直接計算位置
/>
```

### 圖片優化

```typescript
<Image
  source={{ uri: imageUrl }}
  resizeMode="cover"
  resizeMethod="resize"  // Android
  fadeDuration={0}       // iOS
/>
```

### 動畫性能

使用 React Native Reanimated：

```bash
npm install react-native-reanimated
```

```typescript
import Animated from 'react-native-reanimated';

const opacity = useSharedValue(0);

useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
}, []);

return (
  <Animated.View style={{ opacity }}>
    {/* 內容 */}
  </Animated.View>
);
```

### 錯誤處理和加載狀態

#### 1. **ErrorBoundary 實現**

本應用使用 ErrorBoundary 捕獲運行時錯誤：

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error);
    // 可以發送到錯誤追蹤服務（如 Sentry）
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallbackUI onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
```

**功能**：
- 捕獲所有子組件的運行時錯誤
- 顯示用戶友好的錯誤界面
- 提供重試功能
- 防止整個應用崩潰

#### 2. **AsyncStorage 錯誤處理**

```typescript
// App.tsx
const loadTodos = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const storedTodos = await AsyncStorage.getItem(StorageKeys.TODOS);
    // ... 處理數據
  } catch (error) {
    console.error('Error loading todos:', error);
    setError('Failed to load todos. Please try again.');
    Alert.alert('Error', errorMessage, [
      { text: 'Retry', onPress: loadTodos },
      { text: 'Cancel' }
    ]);
  } finally {
    setIsLoading(false);
  }
};
```

**特點**：
- Try-catch 包裹所有異步操作
- 用戶友好的錯誤消息
- 提供重試選項
- 錯誤狀態管理

#### 3. **加載狀態指示器**

```typescript
// App.tsx
if (isLoading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.loadingText}>Loading your todos...</Text>
    </View>
  );
}
```

**好處**：
- 明確的加載反饋
- 防止用戶在加載時操作
- 改善用戶體驗

### 性能分析工具

#### 1. **使用 Flipper**

```bash
# 安裝 Flipper
# https://fbflipper.com/

# 運行應用並連接到 Flipper
```

功能：
- 查看組件樹
- 分析性能
- 檢查網絡請求
- 查看 AsyncStorage

#### 2. **React DevTools Profiler**

```typescript
import { Profiler } from 'react';

<Profiler id="TodoList" onRender={onRenderCallback}>
  <TodoList todos={todos} />
</Profiler>
```

#### 3. **性能監控**

```typescript
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  // 在動畫完成後執行昂貴操作
  console.log('Animations are done');
});
```

### 性能優化檢查清單

使用本應用作為參考，以下是 React Native 性能優化的最佳實踐：

- ✅ **列表優化**
  - [x] 使用 FlatList 而不是 ScrollView
  - [x] 實現 keyExtractor 作為 useCallback
  - [x] 使用 removeClippedSubviews
  - [ ] 對固定高度項目使用 getItemLayout（可選）

- ✅ **組件優化**
  - [x] 對列表項使用 React.memo
  - [x] 對回調函數使用 useCallback
  - [ ] 對昂貴計算使用 useMemo（按需）

- ✅ **狀態管理**
  - [x] 使用函數式 setState 更新
  - [x] 避免不必要的狀態更新
  - [x] 合理拆分組件狀態

- ✅ **錯誤處理**
  - [x] 實現 ErrorBoundary
  - [x] 處理 AsyncStorage 錯誤
  - [x] 提供用戶友好的錯誤消息

- ✅ **用戶體驗**
  - [x] 顯示加載狀態
  - [x] 錯誤恢復機制
  - [x] 平滑的動畫和過渡

---

## 測試策略

### 單元測試

使用 Jest 進行單元測試：

```bash
npm install --save-dev @testing-library/react-native
```

**測試組件**
```typescript
// TodoItem.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import TodoItem from './TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    text: 'Test todo',
    completed: false,
    createdAt: Date.now(),
  };

  it('renders correctly', () => {
    const { getByText } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={() => {}}
        onDelete={() => {}}
      />
    );

    expect(getByText('Test todo')).toBeTruthy();
  });

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <TodoItem
        todo={mockTodo}
        onToggle={onToggle}
        onDelete={() => {}}
      />
    );

    fireEvent.press(getByText('Test todo'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
```

**測試 Hooks**
```typescript
// useTodos.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useTodos } from './useTodos';

describe('useTodos', () => {
  it('adds a todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('New todo');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('New todo');
  });
});
```

### 集成測試

```typescript
// App.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from './App';

describe('App Integration Tests', () => {
  it('adds and completes a todo', async () => {
    const { getByPlaceholderText, getByText } = render(<App />);

    // 添加 todo
    const input = getByPlaceholderText('What needs to be done?');
    fireEvent.changeText(input, 'Test todo');
    fireEvent.press(getByText('Add'));

    // 驗證 todo 已添加
    await waitFor(() => {
      expect(getByText('Test todo')).toBeTruthy();
    });

    // 完成 todo
    fireEvent.press(getByText('Test todo'));

    // 驗證 todo 已完成
    await waitFor(() => {
      expect(getByText('Done: 1')).toBeTruthy();
    });
  });
});
```

### E2E 測試

使用 Detox 進行端到端測試：

```bash
npm install --save-dev detox
```

**配置**
```json
// .detoxrc.json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/config.json",
  "apps": {
    "ios": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/TodoList.app"
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 14"
      }
    }
  }
}
```

**E2E 測試**
```typescript
// e2e/app.test.ts
describe('Todo App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should add a new todo', async () => {
    await element(by.id('todo-input')).typeText('New todo');
    await element(by.id('add-button')).tap();
    await expect(element(by.text('New todo'))).toBeVisible();
  });

  it('should complete a todo', async () => {
    await element(by.text('New todo')).tap();
    await expect(element(by.id('completed-badge'))).toBeVisible();
  });
});
```

---

## 打包與發布

### 使用 EAS Build（推薦）

EAS (Expo Application Services) 提供雲端構建服務。

#### 步驟 1：安裝 EAS CLI

```bash
npm install -g eas-cli

# 登錄
eas login
```

#### 步驟 2：配置項目

```bash
eas build:configure
```

這會創建 `eas.json`：

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

#### 步驟 3：構建應用

**iOS：**
```bash
# 開發構建
eas build --platform ios --profile development

# 預覽構建（TestFlight）
eas build --platform ios --profile preview

# 生產構建
eas build --platform ios --profile production
```

**Android：**
```bash
# APK（用於測試）
eas build --platform android --profile preview

# AAB（用於 Play Store）
eas build --platform android --profile production
```

**同時構建兩個平台：**
```bash
eas build --platform all
```

#### 步驟 4：提交到應用商店

**iOS App Store：**
```bash
eas submit --platform ios
```

需要：
- Apple Developer 賬號
- App Store Connect API Key
- Bundle Identifier

**Android Play Store：**
```bash
eas submit --platform android
```

需要：
- Google Play Developer 賬號
- Service Account Key
- Package Name

### 本地構建

如果你不想使用 EAS，可以本地構建：

#### iOS（需要 macOS）

```bash
# 預構建原生項目
npx expo prebuild

# 使用 Xcode 構建
cd ios
pod install
open TodoList.xcworkspace

# 或使用命令行
xcodebuild \
  -workspace ios/TodoList.xcworkspace \
  -scheme TodoList \
  -configuration Release \
  -archivePath build/TodoList.xcarchive \
  archive
```

#### Android

```bash
# 預構建原生項目
npx expo prebuild

# 生成發布版本
cd android
./gradlew assembleRelease

# AAB for Play Store
./gradlew bundleRelease
```

### 代碼簽名

#### iOS 證書

```bash
# 使用 Fastlane Match（推薦）
gem install fastlane

# 初始化 Match
fastlane match init

# 創建證書
fastlane match appstore
fastlane match development
```

#### Android 密鑰

```bash
# 生成密鑰庫
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 配置 gradle.properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

### OTA 更新

使用 EAS Update 推送更新：

```bash
# 配置 Updates
eas update:configure

# 發布更新
eas update --branch production --message "Bug fixes"

# 查看更新
eas update:list
```

在代碼中檢查更新：

```typescript
import * as Updates from 'expo-updates';

useEffect(() => {
  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  checkForUpdates();
}, []);
```

---

## 常見問題

### 安裝問題

**Q: npm install 失敗**

A: 嘗試以下解決方案：
```bash
# 清除緩存
npm cache clean --force

# 刪除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

**Q: Metro bundler 無法啟動**

A:
```bash
# 重置 Metro bundler
npx react-native start --reset-cache
```

### 運行問題

**Q: iOS 模擬器無法啟動**

A:
```bash
# 重置模擬器
xcrun simctl erase all

# 重啟 Xcode
killall Simulator
```

**Q: Android 模擬器很慢**

A:
- 啟用硬件加速（HAXM on Intel, Hypervisor.framework on M1）
- 增加 RAM 分配
- 使用 x86_64 系統映像

### 開發問題

**Q: Hot Reload 不工作**

A:
```bash
# 搖動設備
# 選擇 "Enable Fast Refresh"

# 或重啟開發服務器
npm start -- --reset-cache
```

**Q: TypeScript 錯誤**

A:
```bash
# 重啟 TypeScript 服務器（VS Code）
# Cmd+Shift+P -> TypeScript: Restart TS Server
```

### 性能問題

**Q: 應用很慢/卡頓**

A:
- 使用 FlatList 而不是 ScrollView
- 使用 React.memo 避免不必要的重渲染
- 使用 useCallback 和 useMemo
- 檢查是否有昂貴的計算在渲染期間

**Q: 內存洩漏**

A:
```typescript
// 清理 useEffect
useEffect(() => {
  const subscription = someObservable.subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

## 最佳實踐

### 代碼組織

#### 1. **組件結構**

```
src/
├── components/
│   ├── common/          # 通用組件
│   ├── features/        # 功能組件
│   └── screens/         # 屏幕組件
├── hooks/               # 自定義 Hooks
├── utils/               # 工具函數
├── services/            # API 服務
├── types/               # TypeScript 類型
└── constants/           # 常量
```

#### 2. **命名約定**

```typescript
// 組件：PascalCase
const TodoItem = () => { ... };

// 函數：camelCase
const handleAddTodo = () => { ... };

// 常量：UPPER_SNAKE_CASE
const MAX_TODO_LENGTH = 200;

// 類型：PascalCase
interface Todo { ... }
```

#### 3. **文件組織**

```typescript
// TodoItem/
// ├── index.tsx          # 導出
// ├── TodoItem.tsx       # 組件
// ├── TodoItem.styles.ts # 樣式
// └── TodoItem.test.tsx  # 測試
```

### 性能

#### 1. **避免內聯函數**

```typescript
// ❌ 不好
<Button onPress={() => handlePress(item.id)} />

// ✅ 好
const onPress = useCallback(() => handlePress(item.id), [item.id]);
<Button onPress={onPress} />
```

#### 2. **使用 memo 和 callback**

```typescript
const TodoItem = React.memo(({ todo, onToggle }) => {
  return (
    <Pressable onPress={onToggle}>
      <Text>{todo.text}</Text>
    </Pressable>
  );
});

const handleToggle = useCallback((id) => {
  setTodos(prev => prev.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  ));
}, []);
```

### 安全

#### 1. **環境變量**

```typescript
// 不要將敏感信息硬編碼
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
```

#### 2. **數據驗證**

```typescript
// 驗證用戶輸入
const addTodo = (text: string) => {
  if (!text || text.trim().length === 0) {
    throw new Error('Invalid input');
  }
  // ...
};
```

### 可訪問性

```typescript
<TouchableOpacity
  accessibilityLabel="Add todo"
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
>
  <Text>Add</Text>
</TouchableOpacity>
```

---

## 進階功能

### 添加導航

使用 React Navigation：

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 添加動畫

使用 React Native Reanimated：

```bash
npm install react-native-reanimated
```

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePress = () => {
  scale.value = withSpring(1.2);
};
```

### 添加國際化

```bash
npm install i18next react-i18next
```

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: 'Todo List',
      },
    },
    zh: {
      translation: {
        title: '待辦事項',
      },
    },
  },
});
```

---

## 資源鏈接

### 官方文檔

- [React Native 官方文檔](https://reactnative.dev/)
- [Expo 官方文檔](https://docs.expo.dev/)
- [React 官方文檔](https://react.dev/)
- [TypeScript 官方文檔](https://www.typescriptlang.org/)

### 學習資源

- [React Native Express](https://www.reactnative.express/)
- [Expo Examples](https://docs.expo.dev/guides/overview/)
- [React Native School](https://www.reactnativeschool.com/)
- [William Candillon YouTube](https://www.youtube.com/c/wcandillon)

### 社區

- [React Native Discord](https://discord.gg/react-native)
- [Expo Discord](https://chat.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
- [Reddit r/reactnative](https://www.reddit.com/r/reactnative/)

### 工具和庫

- [React Navigation](https://reactnavigation.org/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/latest)

---

## 貢獻

歡迎貢獻！請遵循以下步驟：

1. Fork 本倉庫
2. 創建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 開啟 Pull Request

---

## 授權

本項目採用 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解詳情。

---

## 致謝

- React Native 團隊
- Expo 團隊
- React 社區
- 所有貢獻者

---

**快樂編碼！** 🚀
