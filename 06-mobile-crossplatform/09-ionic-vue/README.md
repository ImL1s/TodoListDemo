# Ionic Vue Todo List

一個功能完整的跨平台 Todo List 應用，使用 **Ionic 7**、**Vue 3** 和 **Capacitor** 構建。這個應用展示了如何使用 Ionic Framework 的 Vue 集成來創建具有原生外觀和體驗的移動應用。

## 📱 技術棧

- **Ionic Framework 7** - 跨平台移動 UI 框架
- **Vue 3** - 漸進式 JavaScript 框架
- **Composition API** - Vue 3 的組合式 API
- **TypeScript** - 類型安全的 JavaScript
- **Capacitor 5** - 原生運行時
- **Vite** - 下一代前端構建工具
- **Capacitor Preferences** - 本地數據持久化
- **Ionicons** - 官方圖標庫

## ✨ 功能特性

### 核心功能
- ✅ 添加新任務
- ✅ 標記任務完成/未完成
- ✅ 刪除任務（帶確認對話框）
- ✅ 清除所有已完成任務
- ✅ 任務過濾（全部/活動/已完成）
- ✅ 本地數據持久化
- ✅ 實時統計數據

### UI/UX 特性
- 🎨 原生 iOS 和 Android 設計適配
- 🌓 自動深色模式支持
- 📱 響應式設計
- 💫 流暢動畫和過渡效果
- 🔔 Toast 通知提示
- 📊 進度條和統計儀表板
- 👆 滑動刪除手勢
- ⚡ 原生般的性能

### 技術特性
- 🔒 TypeScript 類型安全
- 📦 組件化架構
- 🔄 響應式數據綁定
- 🛣️ Vue Router 路由集成
- 💾 Capacitor Storage API
- 🎯 Composition API 最佳實踐

## 🏗️ 項目結構

```
09-ionic-vue/
├── capacitor.config.json      # Capacitor 配置
├── ionic.config.json           # Ionic 配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
├── package.json                # 項目依賴
├── index.html                  # HTML 入口
│
├── src/
│   ├── main.ts                 # 應用入口
│   ├── App.vue                 # 根組件
│   │
│   ├── router/
│   │   └── index.ts            # 路由配置
│   │
│   ├── views/
│   │   └── Home.vue            # 主頁面
│   │
│   ├── components/
│   │   ├── TodoInput.vue       # 輸入組件
│   │   ├── TodoList.vue        # 列表組件
│   │   └── TodoItem.vue        # 單項組件
│   │
│   └── theme/
│       └── variables.css       # 主題變量
│
├── ios/                        # iOS 原生項目（運行 sync 後生成）
├── android/                    # Android 原生項目（運行 sync 後生成）
└── dist/                       # 構建輸出
```

## 🚀 快速開始

### 環境要求

#### 基礎要求
- **Node.js**: >= 16.x
- **npm**: >= 8.x 或 **yarn**: >= 1.22.x
- **Git**: 最新版本

#### iOS 開發要求（僅 macOS）
- **macOS**: Catalina (10.15) 或更高版本
- **Xcode**: 14.0 或更高版本
- **CocoaPods**: >= 1.11
- **iOS Simulator** 或物理設備

#### Android 開發要求
- **JDK**: 11 或更高版本
- **Android Studio**: Arctic Fox (2020.3.1) 或更高版本
- **Android SDK**: API Level 22 或更高版本
- **Android Emulator** 或物理設備

### 安裝步驟

#### 1. 克隆項目

```bash
cd 06-mobile-crossplatform/09-ionic-vue
```

#### 2. 安裝依賴

使用 npm:
```bash
npm install
```

或使用 yarn:
```bash
yarn install
```

#### 3. 安裝 Ionic CLI（可選但推薦）

```bash
npm install -g @ionic/cli
```

#### 4. 啟動開發服務器

使用 npm:
```bash
npm run dev
```

使用 yarn:
```bash
yarn dev
```

使用 Ionic CLI:
```bash
ionic serve
```

應用將在 `http://localhost:8100` 上運行。

### 開發模式

在開發模式下，你可以：
- 🔥 熱模塊替換（HMR）
- 🔍 在瀏覽器中測試
- 📱 使用瀏覽器開發者工具
- 🎨 實時預覽 UI 變更

## 📱 原生平台開發

### iOS 開發

#### 初始化 iOS 項目

```bash
# 添加 iOS 平台
ionic capacitor add ios

# 或使用 npx
npx cap add ios
```

#### 構建並同步

```bash
# 構建 Web 資源
npm run build

# 同步到 iOS
ionic capacitor sync ios

# 或使用 npx
npx cap sync ios
```

#### 在 Xcode 中打開

```bash
ionic capacitor open ios

# 或使用 npx
npx cap open ios
```

#### 在模擬器上運行

```bash
# 使用 Ionic CLI（帶實時重載）
ionic capacitor run ios -l --external

# 或使用 npm script
npm run ios
```

#### 在物理設備上運行

1. 在 Xcode 中連接你的 iPhone
2. 選擇你的設備作為目標
3. 配置簽名和團隊
4. 點擊運行按鈕

#### iOS 調試

```bash
# 打開 Safari Web Inspector
Safari > Develop > [你的設備名稱] > localhost

# 查看原生日誌
ionic capacitor run ios -l --external --consolelogs
```

### Android 開發

#### 初始化 Android 項目

```bash
# 添加 Android 平台
ionic capacitor add android

# 或使用 npx
npx cap add android
```

#### 構建並同步

```bash
# 構建 Web 資源
npm run build

# 同步到 Android
ionic capacitor sync android

# 或使用 npx
npx cap sync android
```

#### 在 Android Studio 中打開

```bash
ionic capacitor open android

# 或使用 npx
npx cap open android
```

#### 在模擬器上運行

```bash
# 使用 Ionic CLI（帶實時重載）
ionic capacitor run android -l --external

# 或使用 npm script
npm run android
```

#### 在物理設備上運行

1. 啟用開發者選項和 USB 調試
2. 連接設備到電腦
3. 在 Android Studio 中選擇設備
4. 點擊運行按鈕

#### Android 調試

```bash
# 使用 Chrome DevTools
chrome://inspect

# 查看原生日誌
adb logcat
```

## 📦 生產構建

### Web 構建

```bash
# 構建生產版本
npm run build

# 預覽構建結果
npm run preview
```

構建輸出將在 `dist/` 目錄中。

### iOS 生產構建

#### 1. 準備構建配置

在 Xcode 中：
1. 選擇 "Any iOS Device (arm64)" 作為目標
2. 選擇 Product > Archive
3. 等待歸檔完成

#### 2. 配置簽名

1. 在 Xcode 中選擇項目
2. 選擇 "Signing & Capabilities"
3. 配置你的開發團隊
4. 選擇合適的 Provisioning Profile

#### 3. 創建 Archive

```bash
# 使用命令行
xcodebuild -workspace ios/App/App.xcworkspace \
           -scheme App \
           -sdk iphoneos \
           -configuration AppStoreDistribution \
           archive -archivePath $PWD/build/App.xcarchive
```

#### 4. 導出 IPA

1. 在 Xcode Organizer 中選擇 Archive
2. 點擊 "Distribute App"
3. 選擇分發方法（App Store、Ad Hoc、Enterprise 等）
4. 按照嚮導完成

#### 5. 上傳到 App Store

使用 Xcode Organizer 或 Application Loader 上傳 IPA。

### Android 生產構建

#### 1. 生成簽名密鑰

```bash
keytool -genkey -v -keystore my-release-key.keystore \
        -alias my-key-alias -keyalg RSA -keysize 2048 \
        -validity 10000
```

#### 2. 配置簽名

創建或編輯 `android/key.properties`:

```properties
storePassword=你的密鑰庫密碼
keyPassword=你的密鑰密碼
keyAlias=my-key-alias
storeFile=my-release-key.keystore
```

#### 3. 更新 build.gradle

編輯 `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

#### 4. 構建 APK/AAB

```bash
# 構建 APK
cd android
./gradlew assembleRelease

# 構建 AAB（Google Play 推薦）
./gradlew bundleRelease
```

輸出文件：
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

#### 5. 上傳到 Google Play

1. 登錄 Google Play Console
2. 創建應用
3. 上傳 AAB 文件
4. 完成商店列表信息
5. 提交審核

## 🎨 Ionic 組件詳解

### 頁面結構組件

#### IonPage
整個頁面的容器組件：
```vue
<ion-page>
  <!-- 頁面內容 -->
</ion-page>
```

#### IonHeader
頁面頭部區域：
```vue
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>Todo List</ion-title>
  </ion-toolbar>
</ion-header>
```

#### IonContent
可滾動的主內容區域：
```vue
<ion-content :fullscreen="true">
  <!-- 內容 -->
</ion-content>
```

### 列表組件

#### IonList
列表容器：
```vue
<ion-list>
  <ion-item v-for="item in items" :key="item.id">
    {{ item.text }}
  </ion-item>
</ion-list>
```

#### IonItem
列表項：
```vue
<ion-item lines="full">
  <ion-label>
    <h2>標題</h2>
    <p>描述</p>
  </ion-label>
</ion-item>
```

#### IonItemSliding
支持滑動操作的列表項：
```vue
<ion-item-sliding>
  <ion-item>內容</ion-item>
  <ion-item-options side="end">
    <ion-item-option color="danger">
      刪除
    </ion-item-option>
  </ion-item-options>
</ion-item-sliding>
```

### 表單組件

#### IonInput
輸入框：
```vue
<ion-input
  v-model="text"
  placeholder="請輸入..."
  :clear-input="true"
></ion-input>
```

#### IonCheckbox
複選框：
```vue
<ion-checkbox
  :checked="completed"
  @ionChange="handleChange"
></ion-checkbox>
```

### UI 組件

#### IonCard
卡片容器：
```vue
<ion-card>
  <ion-card-header>
    <ion-card-title>標題</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    內容
  </ion-card-content>
</ion-card>
```

#### IonButton
按鈕：
```vue
<ion-button
  color="primary"
  expand="block"
  @click="handleClick"
>
  <ion-icon slot="start" :icon="addOutline"></ion-icon>
  添加
</ion-button>
```

#### IonSegment
分段控制器：
```vue
<ion-segment :value="filter" @ionChange="handleChange">
  <ion-segment-button value="all">
    <ion-label>全部</ion-label>
  </ion-segment-button>
  <ion-segment-button value="active">
    <ion-label>活動</ion-label>
  </ion-segment-button>
</ion-segment>
```

#### IonIcon
圖標：
```vue
<script setup>
import { addOutline } from 'ionicons/icons'
</script>

<ion-icon :icon="addOutline" color="primary"></ion-icon>
```

### 反饋組件

#### Toast 通知

```typescript
import { toastController } from '@ionic/vue'

const showToast = async (message: string) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color: 'success',
    position: 'bottom'
  })
  await toast.present()
}
```

#### Alert 對話框

```typescript
import { alertController } from '@ionic/vue'

const showAlert = async () => {
  const alert = await alertController.create({
    header: '確認',
    message: '確定要刪除嗎？',
    buttons: [
      {
        text: '取消',
        role: 'cancel'
      },
      {
        text: '確定',
        handler: () => {
          // 處理確認
        }
      }
    ]
  })
  await alert.present()
}
```

## 🔧 Capacitor API 使用

### Preferences API（數據持久化）

```typescript
import { Preferences } from '@capacitor/preferences'

// 保存數據
const saveTodos = async (todos: Todo[]) => {
  await Preferences.set({
    key: 'todos',
    value: JSON.stringify(todos)
  })
}

// 讀取數據
const loadTodos = async (): Promise<Todo[]> => {
  const { value } = await Preferences.get({ key: 'todos' })
  return value ? JSON.parse(value) : []
}

// 刪除數據
const clearTodos = async () => {
  await Preferences.remove({ key: 'todos' })
}

// 清空所有數據
const clearAll = async () => {
  await Preferences.clear()
}
```

### Haptics API（觸覺反饋）

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics'

// 輕微震動
const lightHaptic = async () => {
  await Haptics.impact({ style: ImpactStyle.Light })
}

// 中等震動
const mediumHaptic = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium })
}

// 強烈震動
const heavyHaptic = async () => {
  await Haptics.impact({ style: ImpactStyle.Heavy })
}

// 通知震動
const notificationHaptic = async () => {
  await Haptics.notification({ type: 'SUCCESS' })
}
```

### Status Bar API（狀態欄）

```typescript
import { StatusBar, Style } from '@capacitor/status-bar'

// 設置狀態欄樣式
const setStatusBarStyle = async (dark: boolean) => {
  await StatusBar.setStyle({
    style: dark ? Style.Dark : Style.Light
  })
}

// 設置背景色
const setStatusBarColor = async () => {
  await StatusBar.setBackgroundColor({ color: '#3880ff' })
}

// 顯示/隱藏狀態欄
const toggleStatusBar = async (show: boolean) => {
  if (show) {
    await StatusBar.show()
  } else {
    await StatusBar.hide()
  }
}
```

### Keyboard API（鍵盤）

```typescript
import { Keyboard } from '@capacitor/keyboard'

// 隱藏鍵盤
const hideKeyboard = async () => {
  await Keyboard.hide()
}

// 監聽鍵盤事件
Keyboard.addListener('keyboardWillShow', info => {
  console.log('鍵盤高度:', info.keyboardHeight)
})

Keyboard.addListener('keyboardWillHide', () => {
  console.log('鍵盤隱藏')
})
```

## 🎯 Vue 3 Composition API 最佳實踐

### 響應式狀態管理

```typescript
import { ref, computed } from 'vue'

// ref - 基本類型
const count = ref(0)
const text = ref('')

// ref - 複雜類型
const todos = ref<Todo[]>([])

// computed - 計算屬性
const completedTodos = computed(() =>
  todos.value.filter(t => t.completed)
)

const incompleteTodos = computed(() =>
  todos.value.filter(t => !t.completed)
)
```

### 生命週期鉤子

```typescript
import { onMounted, onUnmounted, watch } from 'vue'

// 組件掛載時
onMounted(() => {
  loadTodos()
  console.log('組件已掛載')
})

// 組件卸載時
onUnmounted(() => {
  console.log('組件已卸載')
})

// 監聽變化
watch(todos, (newTodos, oldTodos) => {
  console.log('Todos 變化:', newTodos)
  saveTodos(newTodos)
}, { deep: true })
```

### 組件通信

#### Props
```typescript
// 子組件
interface Props {
  todo: Todo
  index: number
}

const props = defineProps<Props>()
```

#### Emits
```typescript
// 子組件
interface Emits {
  (e: 'update', id: number): void
  (e: 'delete', id: number): void
}

const emit = defineEmits<Emits>()

// 觸發事件
const handleClick = () => {
  emit('update', props.todo.id)
}
```

#### Provide/Inject
```typescript
// 父組件
import { provide } from 'vue'

const todos = ref<Todo[]>([])
provide('todos', todos)

// 子組件
import { inject } from 'vue'

const todos = inject<Ref<Todo[]>>('todos')
```

### 自定義 Composables

```typescript
// composables/useTodos.ts
import { ref, computed } from 'vue'
import { Preferences } from '@capacitor/preferences'

export function useTodos() {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const completedTodos = computed(() =>
    todos.value.filter(t => t.completed)
  )

  const loadTodos = async () => {
    loading.value = true
    try {
      const { value } = await Preferences.get({ key: 'todos' })
      if (value) {
        todos.value = JSON.parse(value)
      }
    } catch (e) {
      error.value = '載入失敗'
    } finally {
      loading.value = false
    }
  }

  const addTodo = async (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    }
    todos.value.unshift(newTodo)
    await saveTodos()
  }

  const saveTodos = async () => {
    await Preferences.set({
      key: 'todos',
      value: JSON.stringify(todos.value)
    })
  }

  return {
    todos,
    loading,
    error,
    completedTodos,
    loadTodos,
    addTodo,
    saveTodos
  }
}

// 在組件中使用
const {
  todos,
  loading,
  completedTodos,
  loadTodos,
  addTodo
} = useTodos()
```

## 📊 與 Ionic React 的對比

### 語法對比

#### 組件定義

**Ionic Vue:**
```vue
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p>{{ message }}</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'

const title = ref('Todo List')
const message = ref('Hello Vue!')
</script>
```

**Ionic React:**
```tsx
import React, { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/react'

const HomePage: React.FC = () => {
  const [title] = useState('Todo List')
  const [message] = useState('Hello React!')

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>{message}</p>
      </IonContent>
    </IonPage>
  )
}

export default HomePage
```

#### 狀態管理

**Ionic Vue:**
```typescript
// Composition API
const todos = ref<Todo[]>([])
const filter = ref('all')

const filteredTodos = computed(() => {
  return todos.value.filter(t => {
    if (filter.value === 'active') return !t.completed
    if (filter.value === 'completed') return t.completed
    return true
  })
})

const addTodo = (text: string) => {
  todos.value.push({
    id: Date.now(),
    text,
    completed: false
  })
}
```

**Ionic React:**
```typescript
// Hooks
const [todos, setTodos] = useState<Todo[]>([])
const [filter, setFilter] = useState('all')

const filteredTodos = useMemo(() => {
  return todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })
}, [todos, filter])

const addTodo = (text: string) => {
  setTodos([...todos, {
    id: Date.now(),
    text,
    completed: false
  }])
}
```

#### 列表渲染

**Ionic Vue:**
```vue
<ion-list>
  <ion-item v-for="todo in todos" :key="todo.id">
    <ion-label>{{ todo.text }}</ion-label>
    <ion-checkbox
      :checked="todo.completed"
      @ionChange="toggleTodo(todo.id)"
    ></ion-checkbox>
  </ion-item>
</ion-list>
```

**Ionic React:**
```tsx
<IonList>
  {todos.map(todo => (
    <IonItem key={todo.id}>
      <IonLabel>{todo.text}</IonLabel>
      <IonCheckbox
        checked={todo.completed}
        onIonChange={() => toggleTodo(todo.id)}
      />
    </IonItem>
  ))}
</IonList>
```

#### 事件處理

**Ionic Vue:**
```vue
<ion-button @click="handleClick">
  點擊我
</ion-button>

<ion-input
  v-model="text"
  @ionFocus="handleFocus"
  @ionBlur="handleBlur"
></ion-input>
```

**Ionic React:**
```tsx
<IonButton onClick={handleClick}>
  點擊我
</IonButton>

<IonInput
  value={text}
  onIonChange={e => setText(e.detail.value!)}
  onIonFocus={handleFocus}
  onIonBlur={handleBlur}
/>
```

### 特性對比表

| 特性 | Ionic Vue | Ionic React |
|------|-----------|-------------|
| **學習曲線** | 相對平緩 | 需要理解 JSX 和 Hooks |
| **模板語法** | 清晰的 HTML 模板 | JSX (JavaScript in HTML) |
| **響應式系統** | 自動追蹤依賴 | 手動管理依賴 |
| **組件通信** | Props + Emits + Provide/Inject | Props + Callbacks + Context |
| **狀態管理** | ref/reactive + Pinia | useState/useReducer + Redux |
| **性能** | 編譯時優化 | 虛擬 DOM diffing |
| **TypeScript** | 完整支持 | 原生支持 |
| **生態系統** | Vue 生態 | React 生態（更大） |
| **包大小** | 較小 (~40KB) | 較大 (~130KB) |
| **社區** | 活躍但較小 | 非常活躍和龐大 |

### 優勢對比

#### Ionic Vue 優勢
1. **更簡潔的模板語法** - HTML-based 模板更接近傳統 Web 開發
2. **自動響應式追蹤** - 不需要手動管理依賴
3. **更小的包體積** - 應用體積更小
4. **學習曲線平緩** - 對 Web 開發者更友好
5. **編譯時優化** - 更好的運行時性能

#### Ionic React 優勢
1. **更大的生態系統** - 更多的第三方庫和工具
2. **更強的社區支持** - 更多的開發者和資源
3. **類型安全** - TypeScript 支持更成熟
4. **企業採用度高** - 更多大型企業使用
5. **靈活性** - JSX 提供更大的靈活性

### 選擇建議

**選擇 Ionic Vue 如果你：**
- 熟悉 Vue 或想要學習 Vue
- 偏好模板語法而非 JSX
- 需要更小的包體積
- 團隊已有 Vue 經驗
- 追求開發效率

**選擇 Ionic React 如果你：**
- 熟悉 React 或想要學習 React
- 喜歡 JSX 的靈活性
- 需要龐大的生態系統支持
- 團隊已有 React 經驗
- 需要企業級支持

## 🎨 主題定制

### 修改顏色主題

編輯 `src/theme/variables.css`:

```css
:root {
  /* 主色 */
  --ion-color-primary: #3880ff;
  --ion-color-primary-rgb: 56, 128, 255;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #3171e0;
  --ion-color-primary-tint: #4c8dff;

  /* 成功色 */
  --ion-color-success: #2dd36f;

  /* 警告色 */
  --ion-color-warning: #ffc409;

  /* 危險色 */
  --ion-color-danger: #eb445a;
}
```

### 深色模式

深色模式自動根據系統偏好啟用。你可以手動控制：

```typescript
// 強制深色模式
document.body.classList.add('ion-palette-dark')

// 強制淺色模式
document.body.classList.remove('ion-palette-dark')

// 跟隨系統
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
if (prefersDark.matches) {
  document.body.classList.add('ion-palette-dark')
}
```

### 自定義組件樣式

```vue
<style scoped>
/* 使用 CSS 變量 */
ion-button {
  --background: var(--ion-color-primary);
  --color: white;
  --border-radius: 12px;
  --padding-start: 20px;
  --padding-end: 20px;
}

/* 覆蓋組件樣式 */
.custom-card {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 響應式設計 */
@media (min-width: 768px) {
  .container {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
```

## 🧪 測試

### 單元測試

安裝測試依賴：
```bash
npm install --save-dev vitest @vue/test-utils
```

創建測試文件 `src/components/__tests__/TodoItem.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from '../TodoItem.vue'

describe('TodoItem', () => {
  it('渲染 todo 文本', () => {
    const todo = {
      id: 1,
      text: 'Test Todo',
      completed: false,
      createdAt: new Date().toISOString()
    }

    const wrapper = mount(TodoItem, {
      props: { todo }
    })

    expect(wrapper.text()).toContain('Test Todo')
  })

  it('觸發 toggle 事件', async () => {
    const todo = {
      id: 1,
      text: 'Test Todo',
      completed: false,
      createdAt: new Date().toISOString()
    }

    const wrapper = mount(TodoItem, {
      props: { todo }
    })

    await wrapper.find('ion-checkbox').trigger('ionChange')
    expect(wrapper.emitted()).toHaveProperty('toggle')
  })
})
```

運行測試：
```bash
npm run test:unit
```

### E2E 測試

安裝 Cypress：
```bash
npm install --save-dev cypress
```

創建測試文件 `cypress/e2e/todo.cy.ts`:

```typescript
describe('Todo List', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('應該顯示頁面標題', () => {
    cy.contains('Todo List')
  })

  it('應該添加新 todo', () => {
    const todoText = 'New Test Todo'

    cy.get('ion-input').type(todoText)
    cy.get('ion-button').click()

    cy.contains(todoText)
  })

  it('應該切換 todo 狀態', () => {
    cy.get('ion-input').type('Test Todo')
    cy.get('ion-button').click()

    cy.get('ion-checkbox').first().click()
    cy.get('ion-item').first().should('have.class', 'completed')
  })

  it('應該刪除 todo', () => {
    const todoText = 'Todo to Delete'

    cy.get('ion-input').type(todoText)
    cy.get('ion-button').click()

    cy.get('ion-item-sliding').first().swipe('left')
    cy.get('ion-item-option').click()

    cy.contains(todoText).should('not.exist')
  })
})
```

運行 E2E 測試：
```bash
npm run test:e2e
```

## 🚀 性能優化

### 1. 代碼分割

使用動態導入：

```typescript
// router/index.ts
const routes = [
  {
    path: '/home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/settings',
    component: () => import('../views/Settings.vue')
  }
]
```

### 2. 虛擬滾動

對於長列表使用虛擬滾動：

```vue
<ion-content>
  <ion-virtual-scroll
    :items="todos"
    :approxItemHeight="60"
  >
    <template v-slot="{ item }">
      <TodoItem :todo="item" />
    </template>
  </ion-virtual-scroll>
</ion-content>
```

### 3. 圖片優化

```vue
<ion-img
  :src="imageUrl"
  alt="Description"
  loading="lazy"
></ion-img>
```

### 4. 減少重渲染

使用 `v-memo`（Vue 3.2+）：

```vue
<TodoItem
  v-for="todo in todos"
  :key="todo.id"
  :todo="todo"
  v-memo="[todo.completed, todo.text]"
/>
```

### 5. Web Workers

對於計算密集型任務：

```typescript
// worker.ts
self.addEventListener('message', (e) => {
  const result = heavyComputation(e.data)
  self.postMessage(result)
})

// 使用
const worker = new Worker(new URL('./worker.ts', import.meta.url))
worker.postMessage(data)
worker.onmessage = (e) => {
  console.log(e.data)
}
```

## 📱 平台特定功能

### iOS 特性

#### Safe Area 處理

```css
.container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

#### iOS 樣式模式

```typescript
// main.ts
import { IonicVue, IonicConfig } from '@ionic/vue'

const config: IonicConfig = {
  mode: 'ios' // 強制使用 iOS 樣式
}

app.use(IonicVue, config)
```

### Android 特性

#### Back Button 處理

```typescript
import { App } from '@capacitor/app'

App.addListener('backButton', ({ canGoBack }) => {
  if (!canGoBack) {
    App.exitApp()
  } else {
    window.history.back()
  }
})
```

#### Android 樣式模式

```typescript
// main.ts
const config: IonicConfig = {
  mode: 'md' // 強制使用 Material Design
}

app.use(IonicVue, config)
```

## 🔍 調試技巧

### Chrome DevTools

1. 打開 DevTools (F12)
2. 使用 Vue DevTools 擴展
3. 查看網絡請求
4. 監控性能

### Safari Web Inspector

1. Safari > 偏好設置 > 高級 > 顯示開發菜單
2. 開發 > 連接到設備
3. 選擇你的 iOS 應用

### Android Logcat

```bash
# 查看所有日誌
adb logcat

# 過濾特定標籤
adb logcat -s "Capacitor"

# 清空日誌
adb logcat -c
```

### Ionic DevApp

使用 Ionic DevApp 在真實設備上測試：

1. 在設備上安裝 Ionic DevApp
2. 確保設備和電腦在同一網絡
3. 運行 `ionic serve --devapp`
4. 在 DevApp 中掃描 QR 碼

## 📚 學習資源

### 官方文檔
- [Ionic Framework 文檔](https://ionicframework.com/docs)
- [Ionic Vue 文檔](https://ionicframework.com/docs/vue/overview)
- [Vue 3 文檔](https://vuejs.org/)
- [Capacitor 文檔](https://capacitorjs.com/)
- [TypeScript 文檔](https://www.typescriptlang.org/)

### 視頻教程
- [Ionic Vue 快速入門](https://www.youtube.com/ionic)
- [Vue 3 Composition API](https://www.youtube.com/vuejs)
- [Capacitor 教程](https://www.youtube.com/capacitorjs)

### 社區資源
- [Ionic Forum](https://forum.ionicframework.com/)
- [Discord](https://ionic.link/discord)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/ionic-framework)
- [GitHub](https://github.com/ionic-team/ionic-framework)

### 示例項目
- [Ionic Conference App](https://github.com/ionic-team/ionic-conference-app)
- [Ionic Vue Samples](https://github.com/ionic-team/ionic-vue-samples)

## 🤝 貢獻

歡迎貢獻！請遵循以下步驟：

1. Fork 項目
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📝 常見問題

### Q: 如何修復 "Module not found" 錯誤？

A: 確保所有依賴都已安裝：
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: iOS 構建失敗怎麼辦？

A: 嘗試清理並重新構建：
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Q: Android 簽名錯誤？

A: 檢查 `key.properties` 文件路徑和密碼是否正確。

### Q: 如何調試白屏問題？

A: 打開瀏覽器控制台查看錯誤，確保：
1. 所有組件正確導入
2. 路由配置正確
3. Ionic CSS 已加載

### Q: 數據沒有持久化？

A: 確保：
1. Capacitor Preferences 插件已安裝
2. 在原生平台上運行（不是瀏覽器）
3. 權限配置正確

## 📄 許可證

MIT License

## 👥 作者

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

項目鏈接: [https://github.com/yourusername/ionic-vue-todo](https://github.com/yourusername/ionic-vue-todo)

## 🙏 致謝

- [Ionic Team](https://ionic.io/) - 優秀的跨平台框架
- [Vue Team](https://vuejs.org/) - 漸進式框架
- [Capacitor Team](https://capacitorjs.com/) - 原生運行時
- [Ionicons](https://ionic.io/ionicons) - 美觀的圖標庫

---

**享受使用 Ionic Vue 構建跨平台應用！** 🚀📱

如果這個項目對你有幫助，請給個 ⭐️ Star！
