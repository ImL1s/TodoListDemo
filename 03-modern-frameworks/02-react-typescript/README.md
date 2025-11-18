# React + TypeScript Todo List

使用 **React 18**、**TypeScript 5.3+** 和 **Vite** 構建的現代化待辦事項應用。

## 為什麼在 React 中使用 TypeScript？

### 1. 類型安全 (Type Safety)

TypeScript 為 React 應用提供了編譯時類型檢查，能夠在開發階段就發現潛在錯誤，而不是在運行時才暴露問題。

**示例：**
```typescript
// ❌ 錯誤會在開發時被捕獲
interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
}

// TypeScript 會阻止以下錯誤調用
<TodoItem id={123} text="買牛奶" /> // ❌ id 應該是 string 而不是 number
```

### 2. 更好的開發體驗

#### 智能提示 (IntelliSense)
- IDE 能夠提供精確的代碼補全
- 實時查看函數參數和返回值類型
- 快速訪問組件 Props 定義

#### 重構信心
- 重命名變量、函數時自動更新所有引用
- 修改接口定義時，所有使用處會立即提示錯誤
- 安全地進行大規模代碼重構

### 3. 自文檔化代碼

TypeScript 類型定義本身就是最好的文檔：

```typescript
// 一眼就能看出函數的用途和參數類型
function addTodo(text: string): void;
function toggleTodo(id: string): void;
function editTodo(id: string, newText: string): void;
```

### 4. 防止常見錯誤

```typescript
// 防止 null/undefined 錯誤
const todo: Todo | undefined = todos.find(t => t.id === id);
if (todo) {
  // TypeScript 確保 todo 存在後才能訪問屬性
  console.log(todo.text);
}

// 防止錯誤的屬性訪問
const todo: Todo = {...};
console.log(todo.titel); // ❌ TypeScript 會提示 'titel' 不存在，應該是 'title'
```

### 5. 團隊協作優勢

- **接口契約**: 團隊成員清楚地知道組件期望的 Props 類型
- **減少溝通成本**: 類型定義比文檔更不容易過時
- **代碼審查**: 類型錯誤在 PR 階段就能被發現

## 本項目的 TypeScript 特色

### 1. 完整的類型定義 (`src/types.ts`)

```typescript
// 清晰的數據結構定義
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number; // 可選屬性
}

// 聯合類型
export type FilterType = 'all' | 'active' | 'completed';
```

### 2. 組件 Props 類型

```typescript
// TodoInput.tsx
interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  // ...
};
```

### 3. 事件處理類型

```typescript
// 明確的事件類型
const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
  // ...
};

const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
  setInputValue(e.target.value);
};

const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
  if (e.key === 'Enter') {
    // ...
  }
};
```

### 4. 自定義 Hook 與泛型

```typescript
// 泛型 Hook - 適用於任何類型的數據
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // ...
}

// 使用時自動推斷類型
const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
```

### 5. 回調函數類型

```typescript
// useCallback 與 TypeScript 結合
const addTodo = useCallback((text: string): void => {
  // TypeScript 確保參數和返回值類型正確
}, []);
```

## 類型安全的實際優勢

### 場景 1: 避免拼寫錯誤

```typescript
// ❌ JavaScript: 運行時才發現錯誤
todo.complted = true; // 拼寫錯誤，但不會報錯

// ✅ TypeScript: 編譯時就會報錯
todo.complted = true; // ❌ 屬性 'complted' 不存在於類型 'Todo' 上
todo.completed = true; // ✅ 正確
```

### 場景 2: 防止類型混淆

```typescript
// ❌ JavaScript: 可能傳入錯誤類型
deleteTodo(123); // 應該傳 string，但傳入了 number

// ✅ TypeScript: 立即報錯
deleteTodo(123); // ❌ 類型 'number' 的參數不能賦給類型 'string' 的參數
deleteTodo("123"); // ✅ 正確
```

### 場景 3: 安全的重構

當修改 `Todo` 接口時：

```typescript
// 添加新的必需屬性
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high'; // 新增
}

// TypeScript 會提示所有創建 Todo 的地方需要添加 priority 屬性
const newTodo: Todo = {
  id: '1',
  text: '買牛奶',
  completed: false,
  // ❌ 缺少 priority 屬性
};
```

## 項目結構

```
02-react-typescript/
├── src/
│   ├── components/
│   │   ├── TodoInput.tsx      # 輸入組件（事件類型演示）
│   │   ├── TodoItem.tsx       # 單個項目組件（條件渲染類型）
│   │   └── TodoList.tsx       # 列表組件（數組類型）
│   ├── types.ts               # 類型定義（接口、類型別名）
│   ├── App.tsx                # 主組件（泛型 Hook、狀態管理）
│   ├── App.css                # 樣式
│   └── main.tsx               # 入口文件
├── index.html
├── package.json
├── tsconfig.json              # TypeScript 配置
├── tsconfig.node.json         # Node 環境配置
├── vite.config.ts             # Vite 配置
└── README.md
```

## 功能特性

✅ **完整的 CRUD 操作**
- 添加待辦事項
- 標記完成/未完成
- 編輯待辦事項
- 刪除待辦事項
- 清除所有已完成項目

✅ **數據持久化**
- LocalStorage 自動保存
- 頁面刷新數據不丟失
- 類型安全的數據存儲

✅ **智能篩選**
- 全部、進行中、已完成三種視圖
- 實時統計數據

✅ **現代化 UI**
- 響應式設計
- 流暢的動畫效果
- 移動端適配

✅ **TypeScript 特性展示**
- 完整的類型定義
- 泛型 Hook
- 事件類型處理
- Props 類型驗證

## 安裝與運行

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

### 類型檢查

```bash
npm run type-check
```

### 構建生產版本

```bash
npm run build
```

### 預覽生產構建

```bash
npm run preview
```

## 技術棧

- **React 18**: 最新的 React 版本，支持並發特性
- **TypeScript 5.3+**: 提供靜態類型檢查
- **Vite**: 快速的現代化構建工具
- **CSS Variables**: 主題系統和響應式設計

## TypeScript 配置亮點

### 嚴格模式

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noImplicitAny": true
}
```

這些配置確保：
- 所有變量都必須有明確的類型
- 函數必須有返回值或明確聲明返回 void
- 未使用的變量和參數會被標記
- 所有代碼路徑都有返回值

## 學習重點

### 1. 類型定義的最佳實踐

- 使用 `interface` 定義對象結構
- 使用 `type` 定義聯合類型和複雜類型
- 為 Props 和 State 定義明確的類型

### 2. React Hooks 與 TypeScript

```typescript
// useState 自動推斷類型
const [count, setCount] = useState(0); // number

// 或明確指定泛型
const [todos, setTodos] = useState<Todo[]>([]);

// useCallback 類型推斷
const handleClick = useCallback((id: string): void => {
  // ...
}, []);
```

### 3. 事件處理

React 中常用的事件類型：
- `FormEvent<HTMLFormElement>` - 表單事件
- `ChangeEvent<HTMLInputElement>` - 輸入變化事件
- `KeyboardEvent<HTMLInputElement>` - 鍵盤事件
- `MouseEvent<HTMLButtonElement>` - 鼠標事件

### 4. 組件類型

```typescript
// 函數組件類型
const Component: React.FC<Props> = (props) => {
  // ...
};

// 或使用普通函數
function Component(props: Props): JSX.Element {
  // ...
}
```

## 與 JavaScript 版本的對比

| 特性 | JavaScript | TypeScript |
|------|-----------|-----------|
| 類型檢查 | 運行時 | 編譯時 |
| IDE 支持 | 基礎 | 完整的智能提示 |
| 重構 | 容易出錯 | 安全可靠 |
| 文檔化 | 需要額外維護 | 類型即文檔 |
| 學習曲線 | 低 | 中等 |
| 錯誤發現 | 運行時 | 開發時 |
| 團隊協作 | 依賴文檔 | 類型契約 |

## 總結

TypeScript 在 React 開發中的優勢：

1. **提前發現錯誤**: 在編譯階段就能發現大部分錯誤
2. **提升開發效率**: 智能提示和自動補全顯著提升編碼速度
3. **降低維護成本**: 類型定義使代碼更容易理解和維護
4. **增強代碼質量**: 強制類型檢查避免了很多低級錯誤
5. **改善團隊協作**: 類型系統提供了清晰的接口契約

對於中大型項目和團隊協作，TypeScript 的優勢會更加明顯。初期的學習成本完全值得！

## 延伸學習

- [TypeScript 官方文檔](https://www.typescriptlang.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

## 許可

MIT License
