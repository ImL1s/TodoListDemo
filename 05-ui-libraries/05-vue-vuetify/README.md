# Vuetify Todo List

一個使用 Vue 3 和 Vuetify 構建的現代化待辦事項應用，展示了 Material Design 在 Vue 生態系統中的實現。

## 特色功能

### Vuetify 核心特色

1. **Material Design 設計語言**
   - 遵循 Google Material Design 3 規範
   - 統一的視覺風格和交互體驗
   - 流暢的動畫和過渡效果

2. **豐富的組件庫**
   - 80+ 即用型組件
   - 高度可定制化
   - 響應式設計
   - 移動端優先

3. **強大的主題系統**
   - 深色/淺色模式切換
   - 自定義顏色調色板
   - 全局樣式配置
   - Material Design 顏色系統

4. **完整的 TypeScript 支持**
   - 類型安全
   - IntelliSense 支持
   - 更好的開發體驗

## 使用的 Vuetify 組件

### 布局組件

- **v-app**: 應用根容器
  ```vue
  <v-app>
    <v-app-bar>...</v-app-bar>
    <v-main>...</v-main>
  </v-app>
  ```

- **v-app-bar**: 應用頂欄
  ```vue
  <v-app-bar color="primary" elevation="4">
    <v-app-bar-title>Vuetify Todo List</v-app-bar-title>
  </v-app-bar>
  ```

- **v-container**: 響應式容器
  ```vue
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" md="8">...</v-col>
    </v-row>
  </v-container>
  ```

- **v-row / v-col**: 網格系統
  ```vue
  <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-card>...</v-card>
    </v-col>
  </v-row>
  ```

- **v-card**: 卡片容器
  ```vue
  <v-card elevation="2">
    <v-card-text>...</v-card-text>
    <v-card-actions>...</v-card-actions>
  </v-card>
  ```

### 輸入組件

- **v-text-field**: 文本輸入框
  ```vue
  <v-text-field
    v-model="text"
    label="What needs to be done?"
    variant="outlined"
    clearable
  ></v-text-field>
  ```

- **v-checkbox**: 複選框
  ```vue
  <v-checkbox
    v-model="completed"
    color="primary"
    hide-details
  ></v-checkbox>
  ```

- **v-btn**: 按鈕組件
  ```vue
  <v-btn
    color="primary"
    prepend-icon="mdi-plus"
    @click="addTodo"
  >
    Add
  </v-btn>
  ```

- **v-btn-toggle**: 按鈕組
  ```vue
  <v-btn-toggle
    v-model="filter"
    mandatory
    divided
    color="primary"
  >
    <v-btn value="all">All</v-btn>
    <v-btn value="active">Active</v-btn>
  </v-btn-toggle>
  ```

### 數據展示組件

- **v-list / v-list-item**: 列表組件
  ```vue
  <v-list lines="two">
    <v-list-item>
      <template v-slot:prepend>
        <v-checkbox></v-checkbox>
      </template>
      <v-list-item-title>Task</v-list-item-title>
      <v-list-item-subtitle>Date</v-list-item-subtitle>
      <template v-slot:append>
        <v-btn icon="mdi-delete"></v-btn>
      </template>
    </v-list-item>
  </v-list>
  ```

- **v-progress-linear**: 進度條
  ```vue
  <v-progress-linear
    :model-value="percentage"
    color="success"
    height="8"
    rounded
  ></v-progress-linear>
  ```

- **v-icon**: 圖標組件
  ```vue
  <v-icon size="32">mdi-check-circle</v-icon>
  ```

### 其他組件

- **v-divider**: 分隔線
  ```vue
  <v-divider></v-divider>
  ```

- **v-spacer**: 彈性空間
  ```vue
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn>Action</v-btn>
  </v-card-actions>
  ```

## 主題系統

### 自定義主題配置 (`src/plugins/vuetify.ts`)

```typescript
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
      dark: {
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
        },
      },
    },
  },
})
```

### 主題特色
- **調色板 (Colors)**: 定義主色、次色、成功色等
- **深色/淺色模式**: 內置主題切換
- **組件變體**: tonal, outlined, text 等
- **海拔系統**: elevation 屬性控制陰影

## 響應式設計

使用 Vuetify 的網格系統實現響應式布局：

```vue
<v-row>
  <v-col cols="12" sm="6" md="4" lg="3">
    <v-card>...</v-card>
  </v-col>
</v-row>
```

### 斷點
- xs: 0px - 599px (extra small)
- sm: 600px - 959px (small)
- md: 960px - 1279px (medium)
- lg: 1280px - 1919px (large)
- xl: 1920px+ (extra large)

## Material Design Icons

使用 MDI (Material Design Icons) 圖標庫：

```vue
<v-icon>mdi-check-circle</v-icon>
<v-icon>mdi-delete</v-icon>
<v-icon>mdi-plus</v-icon>
```

- 7000+ 圖標
- 一致的視覺風格
- 易於使用和定制

## 項目結構

```
05-vue-vuetify/
├── src/
│   ├── components/
│   │   ├── TodoInput.vue      # 輸入組件 (v-text-field, v-btn)
│   │   ├── TodoItem.vue       # 單項組件 (v-checkbox, v-list-item)
│   │   ├── TodoList.vue       # 列表組件 (v-list, v-card)
│   │   ├── TodoStats.vue      # 統計組件 (v-row, v-col, v-progress-linear)
│   │   └── FilterButtons.vue  # 過濾組件 (v-btn-toggle)
│   ├── plugins/
│   │   └── vuetify.ts         # Vuetify 配置
│   ├── App.vue                # 主組件 (v-app, v-app-bar, v-main)
│   ├── types.ts               # TypeScript 類型
│   └── main.ts                # 入口文件
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 安裝與運行

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

訪問 http://localhost:5173

### 構建生產版本
```bash
npm run build
```

### 預覽生產版本
```bash
npm run preview
```

## 核心依賴

- **vue**: Vue 3 框架
- **vuetify**: Vuetify 3 組件庫
- **@mdi/font**: Material Design Icons 圖標字體
- **vite-plugin-vuetify**: Vuetify Vite 插件（自動導入）
- **TypeScript**: 類型系統
- **Vite**: 構建工具

## Vue 3 特性

### Composition API

使用 `<script setup>` 語法：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')

const filteredTodos = computed(() => {
  return todos.value.filter(/* ... */)
})

const addTodo = (text: string) => {
  todos.value.push({ /* ... */ })
}
</script>
```

### 優勢
- **更好的類型推導**: TypeScript 支持更完善
- **更簡潔的代碼**: 減少樣板代碼
- **更好的邏輯復用**: 組合式函數
- **更好的性能**: 更小的打包體積

### 響應式系統

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 響應式狀態
const count = ref(0)

// 計算屬性
const doubled = computed(() => count.value * 2)

// 監聽器
watch(count, (newValue) => {
  console.log(`Count changed to ${newValue}`)
})
</script>
```

## Vuetify vs 其他 UI 庫

### Vuetify 優勢

1. **為 Vue 而生**: 專為 Vue 設計，集成完美
2. **Material Design**: Google 設計規範實現
3. **組件豐富**: 80+ 組件
4. **主題系統**: 強大的定制能力
5. **企業級**: 適合大型項目
6. **活躍社區**: Vue 生態中最受歡迎的 UI 庫之一

### 適用場景
- 企業應用
- 管理後台
- 數據密集型應用
- 需要 Material Design 的項目
- Vue 生態系統項目

## 特色展示

### 1. 統計卡片
使用 `v-row` + `v-col` + `v-card` 的 tonal 變體展示統計數據。

```vue
<v-card color="primary" variant="tonal">
  <v-card-text class="text-center">
    <v-icon size="32">mdi-format-list-checks</v-icon>
    <div class="text-h4">{{ total }}</div>
    <div class="text-body-2">Total Tasks</div>
  </v-card-text>
</v-card>
```

### 2. 進度條
使用 `v-progress-linear` 顯示完成度。

```vue
<v-progress-linear
  :model-value="percentage"
  :color="progressColor"
  height="8"
  rounded
></v-progress-linear>
```

### 3. 過濾按鈕組
使用 `v-btn-toggle` 實現互斥選擇。

```vue
<v-btn-toggle v-model="filter" mandatory divided>
  <v-btn value="all">All</v-btn>
  <v-btn value="active">Active</v-btn>
  <v-btn value="completed">Completed</v-btn>
</v-btn-toggle>
```

### 4. 深色模式
使用 Vuetify 的 `useTheme` 組合式函數實現主題切換。

```vue
<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
```

### 5. 響應式佈局
使用網格系統實現自適應佈局。

```vue
<v-row>
  <v-col cols="12" sm="4">
    <v-card>Total</v-card>
  </v-col>
  <v-col cols="12" sm="4">
    <v-card>Active</v-card>
  </v-col>
  <v-col cols="12" sm="4">
    <v-card>Completed</v-card>
  </v-col>
</v-row>
```

## 組件設計模式

### 1. Props 和 Emits 類型定義

```vue
<script setup lang="ts">
// Props
defineProps<{
  todos: Todo[]
}>()

// Emits
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()
</script>
```

### 2. 插槽 (Slots)

```vue
<v-list-item>
  <template v-slot:prepend>
    <v-checkbox></v-checkbox>
  </template>
  <v-list-item-title>{{ todo.text }}</v-list-item-title>
  <template v-slot:append>
    <v-btn icon="mdi-delete"></v-btn>
  </template>
</v-list-item>
```

### 3. v-model 雙向綁定

```vue
<v-text-field
  v-model="text"
  label="Input"
></v-text-field>
```

### 4. 條件渲染

```vue
<v-card-text v-if="todos.length === 0">
  No todos yet
</v-card-text>

<v-list v-else>
  <!-- todo items -->
</v-list>
```

### 5. 列表渲染

```vue
<template v-for="(todo, index) in todos" :key="todo.id">
  <TodoItem :todo="todo" />
  <v-divider v-if="index < todos.length - 1"></v-divider>
</template>
```

## 學習資源

- [Vuetify 官方文檔](https://vuetifyjs.com/)
- [Vue 3 官方文檔](https://vuejs.org/)
- [Material Design 規範](https://material.io/design)
- [Vuetify 組件示例](https://vuetifyjs.com/en/components/all/)
- [MDI 圖標搜索](https://pictogrammers.com/library/mdi/)
- [Vite 官方文檔](https://vitejs.dev/)

## 最佳實踐

1. **使用 Composition API**: 更好的類型推導和代碼組織
2. **使用主題系統**: 集中管理顏色和樣式
3. **使用內置組件**: 充分利用 Vuetify 組件庫
4. **響應式設計**: 使用網格系統和斷點
5. **類型安全**: 充分利用 TypeScript
6. **圖標使用**: 使用 MDI 圖標庫
7. **性能優化**: 使用 vite-plugin-vuetify 自動導入
8. **組件化**: 拆分可複用組件
9. **語義化**: 使用有意義的組件和類名
10. **無障礙**: 使用 Vuetify 內置的無障礙支持

## 性能優化

### 自動導入
使用 `vite-plugin-vuetify` 自動導入組件：

```typescript
// vite.config.ts
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ]
})
```

### 優勢
- 只打包使用的組件
- 減少打包體積
- 提升加載速度
- 開發時無需手動導入

## 總結

這個 Vuetify Todo List 展示了：
- Vuetify 3 核心組件的使用
- Material Design 3 設計實現
- Vue 3 Composition API
- TypeScript 集成
- 響應式設計
- 主題系統和深色模式
- 組件化架構
- 現代化開發工具鏈

Vuetify 是構建現代 Vue 應用的優秀選擇，特別適合需要專業外觀和豐富功能的企業級應用。結合 Vue 3 的 Composition API，可以構建出高性能、可維護的大型應用。
