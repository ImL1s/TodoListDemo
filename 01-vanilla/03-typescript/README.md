# 📋 Todo List - TypeScript 版本

## 📖 簡介

這是使用 **TypeScript** 實現的 Todo List，在原生 JavaScript 版本的基礎上加入了類型系統和現代化的編程模式。

## ✨ 相比原生 JS 的改進

### 🎯 TypeScript 特性
- ✅ **類型安全**: 完整的類型定義和檢查
- ✅ **接口定義**: Todo 和 AppState 接口
- ✅ **類 (Class)**: 面向對象的代碼組織
- ✅ **私有方法**: 封裝內部實現
- ✅ **嚴格模式**: 啟用所有 TypeScript 嚴格檢查

### 🚀 功能增強
- ✅ **LocalStorage 持久化**: 數據自動保存和恢復
- ✅ **唯一 ID**: 每個 Todo 有唯一標識符
- ✅ **時間戳**: 記錄創建時間
- ✅ **錯誤處理**: try-catch 保護關鍵操作
- ✅ **默認數據**: 首次訪問提供示例數據

### 💅 UI 改進
- ✅ **現代化設計**: 漸變背景和陰影效果
- ✅ **技術標籤**: 顯示使用的技術
- ✅ **響應式布局**: 移動端適配
- ✅ **空狀態提示**: 無數據時的友好提示
- ✅ **動畫效果**: 按鈕點擊反饋

## 🛠️ 技術棧

- **TypeScript 5.3+**: 類型安全的 JavaScript
- **HTML5**: 語義化標籤
- **CSS3**: 現代化樣式和動畫
- **LocalStorage API**: 數據持久化
- **ES2020+**: 現代 JavaScript 特性

## 📁 文件結構

```
03-typescript/
├── src/
│   └── app.ts              # TypeScript 源文件
├── dist/                   # 編譯輸出（自動生成）
│   ├── app.js
│   ├── app.js.map
│   └── app.d.ts
├── index.html              # HTML 文件
├── style.css               # 樣式文件
├── package.json            # 項目配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 本文檔
```

## 🚀 快速開始

### 環境要求

- Node.js 16+
- npm 或 yarn

### 安裝依賴

```bash
cd 01-vanilla/03-typescript
npm install
```

### 編譯 TypeScript

```bash
# 單次編譯
npm run build

# 監聽模式（開發時推薦）
npm run watch
```

### 運行應用

```bash
# 啟動本地服務器
npm run serve

# 然後訪問 http://localhost:8080
```

或者直接用瀏覽器打開 `index.html`（需要先編譯）。

## 📝 代碼解析

### 類型定義

```typescript
// Todo 項目接口
interface Todo {
  id: string;           // 唯一標識符
  text: string;         // 任務文本
  completed: boolean;   // 完成狀態
  createdAt: Date;      // 創建時間
}

// 應用狀態接口
interface AppState {
  todos: Todo[];        // Todo 數組
}
```

**優勢**:
- 編譯時類型檢查
- IDE 自動補全
- 代碼文檔化
- 重構更安全

### 類架構

```typescript
class TodoList {
  private state: AppState;                    // 應用狀態
  private inputElement: HTMLInputElement;     // 輸入框
  private addButton: HTMLElement;             // 添加按鈕
  private todoListElement: HTMLUListElement;  // 列表容器

  constructor() {
    // 初始化狀態和 DOM 引用
    this.state = { todos: this.loadTodos() };
    this.inputElement = document.getElementById('myInput') as HTMLInputElement;
    // ...
    this.init();
  }

  private init(): void {
    this.render();
    this.bindEvents();
  }

  // ... 其他方法
}
```

**設計模式**:
- **封裝**: 使用 private 方法隱藏實現細節
- **單一職責**: 每個方法只做一件事
- **類型安全**: 所有變量都有明確類型

### 核心方法

#### 1. 添加 Todo

```typescript
private addTodo(text: string): void {
  const newTodo: Todo = {
    id: this.generateId(),
    text,
    completed: false,
    createdAt: new Date(),
  };

  this.state.todos.push(newTodo);
  this.saveTodos();      // 保存到 LocalStorage
  this.render();         // 重新渲染
}
```

#### 2. 切換完成狀態

```typescript
private toggleTodo(id: string): void {
  const todo = this.state.todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    this.saveTodos();
    this.render();
  }
}
```

#### 3. 數據持久化

```typescript
private saveTodos(): void {
  try {
    localStorage.setItem('todos', JSON.stringify(this.state.todos));
  } catch (error) {
    console.error('Failed to save todos:', error);
  }
}

private loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem('todos');
    if (stored) {
      const parsed = JSON.parse(stored);
      // 恢復 Date 對象
      return parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load todos:', error);
  }
  return this.getDefaultTodos();
}
```

**關鍵點**:
- try-catch 錯誤處理
- Date 對象的序列化和反序列化
- 降級策略（失敗時返回默認數據）

#### 4. 事件委託

```typescript
this.todoListElement.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;

  if (target.classList.contains('close')) {
    // 刪除按鈕
    const li = target.parentElement as HTMLLIElement;
    const id = li.dataset.id;
    if (id) this.deleteTodo(id);
  } else if (target.tagName === 'LI') {
    // 切換完成狀態
    const id = target.dataset.id;
    if (id) this.toggleTodo(id);
  }
});
```

**優勢**:
- 只綁定一個事件監聽器
- 動態添加的元素無需重新綁定
- 性能更好

## 🎓 學習重點

### TypeScript 核心概念

1. **類型註解**
   ```typescript
   const name: string = "John";
   const age: number = 25;
   const isActive: boolean = true;
   ```

2. **接口 (Interface)**
   ```typescript
   interface User {
     id: number;
     name: string;
     email?: string;  // 可選屬性
   }
   ```

3. **類型斷言 (Type Assertion)**
   ```typescript
   const input = document.getElementById('myInput') as HTMLInputElement;
   ```

4. **類 (Class)**
   ```typescript
   class Animal {
     private name: string;

     constructor(name: string) {
       this.name = name;
     }

     public speak(): void {
       console.log(`${this.name} makes a sound`);
     }
   }
   ```

5. **泛型 (Generics)**
   ```typescript
   function identity<T>(arg: T): T {
     return arg;
   }
   ```

### TypeScript 配置

#### tsconfig.json 重點選項

```json
{
  "compilerOptions": {
    "target": "ES2020",              // 編譯目標
    "module": "ES2020",              // 模塊系統
    "lib": ["ES2020", "DOM"],        // 包含的庫
    "strict": true,                  // 嚴格模式
    "outDir": "./dist",              // 輸出目錄
    "sourceMap": true,               // 生成 source map
    "noUnusedLocals": true,          // 檢查未使用的變量
    "noImplicitReturns": true        // 檢查函數返回值
  }
}
```

### 與原生 JS 對比

| 特性 | 原生 JS | TypeScript |
|------|---------|------------|
| **類型安全** | ❌ 運行時錯誤 | ✅ 編譯時檢查 |
| **IDE 支持** | ⭐⭐ 基礎 | ⭐⭐⭐⭐⭐ 優秀 |
| **重構** | ⚠️ 容易出錯 | ✅ 安全可靠 |
| **文檔** | 需要註釋 | 類型即文檔 |
| **學習曲線** | ⭐ 容易 | ⭐⭐⭐ 中等 |
| **構建步驟** | 不需要 | 需要編譯 |

## 🔄 可改進之處

### 功能增強
- [ ] 編輯功能
- [ ] 篩選功能 (全部/進行中/已完成)
- [ ] 拖拽排序
- [ ] 優先級標記
- [ ] 到期日期
- [ ] 分類標籤

### 代碼優化
- [ ] 使用 Decorator 裝飾器
- [ ] 實現狀態管理模式
- [ ] 添加單元測試
- [ ] 分離成多個模塊
- [ ] 使用觀察者模式

### 進階特性
- [ ] 使用 Web Components
- [ ] 集成打包工具 (Vite/Webpack)
- [ ] 添加 ESLint 和 Prettier
- [ ] CI/CD 配置

## 📚 TypeScript 學習資源

### 官方資源
- [TypeScript 官方文檔](https://www.typescriptlang.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### 推薦書籍和課程
- "Programming TypeScript" by Boris Cherny
- "Effective TypeScript" by Dan Vanderkam
- TypeScript Deep Dive (免費電子書)
- Frontend Masters TypeScript 課程

### 實戰練習
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [TypeScript Exercises](https://typescript-exercises.github.io/)

## 💡 常見問題

**Q: TypeScript 比 JavaScript 好在哪裡？**

A: 主要優勢：
- 編譯時類型檢查，提前發現錯誤
- 更好的 IDE 支持（自動補全、重構）
- 代碼更容易維護和理解
- 適合大型項目和團隊協作

**Q: 什麼時候應該使用 TypeScript？**

A: 推薦使用場景：
- 中大型項目
- 團隊協作項目
- 長期維護的項目
- 需要重構的項目
- 對類型安全有要求的項目

**Q: TypeScript 的學習曲線陡峭嗎？**

A: 漸進式學習：
- 基礎類型註解：1-2 天
- 接口和類型：1 週
- 高級類型：2-3 週
- 泛型和工具類型：持續學習

**Q: 為什麼使用 class 而不是函數？**

A: Class 的優勢：
- 更好的代碼組織
- 私有屬性和方法
- 面向對象的思維
- 為後續學習框架打基礎（React/Vue 都支持 class）

## 🎯 下一步

完成 TypeScript 版本後，推薦：

1. **添加測試** → 學習 Jest + TypeScript
2. **模塊化重構** → 拆分成多個文件
3. **React + TypeScript** → `03-modern-frameworks/02-react-typescript/`
4. **Vue 3 + TypeScript** → `03-modern-frameworks/04-vue3-typescript/`

## 🔗 相關版本

- **上一個**: [原生 JavaScript](../01-html-css-js/)
- **下一個**: [jQuery 版本](../02-jquery/) | [React 版本](../../03-modern-frameworks/01-react/)
- **返回**: [專案首頁](../../README.md)

---

**作者**: ImL1s
**最後更新**: 2025-11-17
**版本**: 1.0.0
