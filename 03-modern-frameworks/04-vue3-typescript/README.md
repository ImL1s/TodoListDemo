# Vue 3 + TypeScript Todo List

一個使用 Vue 3、TypeScript 和 Vite 構建的現代化待辦事項應用。

## 技術棧

- **Vue 3** - 漸進式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供靜態類型檢查
- **Vite** - 下一代前端構建工具
- **Composition API** - Vue 3 的組合式 API
- **Script Setup** - Vue 3.2+ 的語法糖

## TypeScript 特色

### 1. 完整的類型定義

項目在 `src/types.ts` 中定義了所有核心類型：

```typescript
export interface Todo {
  id: string
  text: string
  completed: boolean
}

export interface TodoInputEmits {
  (event: 'add', text: string): void
}
```

### 2. Props 類型定義

使用泛型 `defineProps` 定義組件 props：

```typescript
// TodoItem.vue
const props = defineProps<TodoItemProps>()

// 類型定義
export interface TodoItemProps {
  todo: Todo
}
```

### 3. Emits 類型定義

使用泛型 `defineEmits` 定義組件事件：

```typescript
// TodoInput.vue
const emit = defineEmits<TodoInputEmits>()

// 類型定義
export interface TodoInputEmits {
  (event: 'add', text: string): void
}
```

### 4. Ref 的類型

明確指定 ref 的類型：

```typescript
import type { Ref } from 'vue'

const todos: Ref<Todo[]> = ref<Todo[]>([])
const inputText: Ref<string> = ref<string>('')
const inputRef: Ref<HTMLInputElement | null> = ref<HTMLInputElement | null>(null)
```

### 5. Computed 的類型

為計算屬性指定返回類型：

```typescript
import type { ComputedRef } from 'vue'

interface TodoStats {
  total: number
  completed: number
  pending: number
}

const stats: ComputedRef<TodoStats> = computed<TodoStats>(() => ({
  total: todos.value.length,
  completed: todos.value.filter((todo: Todo) => todo.completed).length,
  pending: todos.value.filter((todo: Todo) => !todo.completed).length,
}))
```

### 6. 函數類型標註

明確函數參數和返回值類型：

```typescript
const addTodo = (text: string): void => {
  const newTodo: Todo = {
    id: Date.now().toString(),
    text,
    completed: false,
  }
  todos.value.push(newTodo)
}
```

### 7. 類型守衛

使用類型守衛確保運行時類型安全：

```typescript
function isTodo(item: unknown): item is Todo {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'text' in item &&
    'completed' in item &&
    typeof (item as Todo).id === 'string' &&
    typeof (item as Todo).text === 'string' &&
    typeof (item as Todo).completed === 'boolean'
  )
}
```

## Vue 3 對 TypeScript 的支持

### 1. SFC 中使用 TypeScript

在單文件組件（SFC）中使用 TypeScript：

```vue
<script setup lang="ts">
// 使用 lang="ts" 啟用 TypeScript
import { ref } from 'vue'
import type { Ref } from 'vue'

const count: Ref<number> = ref<number>(0)
</script>
```

### 2. defineProps 與 TypeScript

兩種定義 props 的方式：

**方式一：類型定義（推薦）**
```typescript
interface Props {
  todo: Todo
}

const props = defineProps<Props>()
```

**方式二：運行時聲明**
```typescript
const props = defineProps({
  todo: {
    type: Object as PropType<Todo>,
    required: true
  }
})
```

### 3. defineEmits 與 TypeScript

```typescript
// 類型定義方式
interface Emits {
  (event: 'toggle', id: string): void
  (event: 'delete', id: string): void
}

const emit = defineEmits<Emits>()
```

### 4. Template Refs

```typescript
import type { Ref } from 'vue'

const inputRef: Ref<HTMLInputElement | null> = ref<HTMLInputElement | null>(null)

// 在模板中使用
// <input ref="inputRef" />
```

### 5. 組件導入類型

```typescript
// 導入組件
import TodoItem from './TodoItem.vue'

// 導入類型（使用 type 關鍵字）
import type { Todo } from './types'
```

## 功能特點

- ✅ 添加待辦事項
- ✅ 標記完成/未完成
- ✅ 刪除待辦事項
- ✅ LocalStorage 持久化
- ✅ 統計信息顯示
- ✅ 響應式設計
- ✅ 流暢動畫效果
- ✅ 完整的 TypeScript 類型支持
- ✅ 類型安全的組件通信

## 項目結構

```
04-vue3-typescript/
├── src/
│   ├── components/
│   │   ├── TodoInput.vue      # 輸入組件
│   │   ├── TodoList.vue       # 列表組件
│   │   └── TodoItem.vue       # 列表項組件
│   ├── types.ts               # TypeScript 類型定義
│   ├── App.vue                # 主應用組件
│   ├── main.ts                # 應用入口
│   └── style.css              # 全局樣式
├── index.html                 # HTML 模板
├── vite.config.ts             # Vite 配置
├── tsconfig.json              # TypeScript 配置
├── tsconfig.node.json         # Node TypeScript 配置
├── package.json               # 依賴配置
└── README.md                  # 項目文檔
```

## 開始使用

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用將在 http://localhost:3004 啟動

### 構建生產版本

```bash
npm run build
```

構建產物將生成在 `dist` 目錄

### 預覽生產版本

```bash
npm run preview
```

## TypeScript 配置說明

### tsconfig.json

主要配置項：

- `strict: true` - 啟用所有嚴格類型檢查選項
- `noUnusedLocals: true` - 檢測未使用的局部變量
- `noUnusedParameters: true` - 檢測未使用的參數
- `jsx: "preserve"` - 保留 JSX 語法（用於 Vue）
- `types: ["vite/client"]` - 包含 Vite 客戶端類型

### 類型檢查

運行類型檢查（不生成文件）：

```bash
npx vue-tsc --noEmit
```

## 學習重點

### TypeScript 在 Vue 3 中的優勢

1. **類型安全**：編譯時捕獲錯誤
2. **智能提示**：更好的 IDE 支持
3. **重構友好**：安全地重命名和移動代碼
4. **文檔化**：類型即文檔
5. **團隊協作**：減少溝通成本

### Vue 3 + TypeScript 最佳實踐

1. **使用 `<script setup lang="ts">`**：更簡潔的語法
2. **定義明確的類型**：在 types.ts 中集中管理
3. **使用類型而非接口導入**：`import type { ... }`
4. **為 ref 明確類型**：`ref<T>()`
5. **使用類型守衛**：確保運行時類型安全
6. **啟用嚴格模式**：`strict: true` in tsconfig.json

## 與 JavaScript 版本的對比

| 特性 | JavaScript | TypeScript |
|------|-----------|-----------|
| 類型檢查 | ❌ 運行時 | ✅ 編譯時 |
| IDE 支持 | 基礎 | 優秀 |
| 重構 | 困難 | 容易 |
| 學習曲線 | 低 | 中等 |
| 代碼量 | 少 | 略多 |
| 維護性 | 中等 | 優秀 |

## 瀏覽器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## License

MIT
