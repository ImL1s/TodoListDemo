# Ionic Angular Todo List

一個使用 Ionic 7 和 Angular 17 構建的現代化跨平台 Todo List 應用程式。這個專案展示了如何結合 Ionic Framework 的強大 UI 組件與 Angular 的企業級架構來構建高品質的移動應用。

## 最新改進 (2025-11-19)

本專案已進行重大改進，包含以下新特性：

- **Angular Signals**: 使用 Angular 17+ 的 Signals API 進行響應式狀態管理
- **TypeScript 嚴格模式**: 啟用完整的嚴格類型檢查
- **性能優化**: OnPush 變更檢測 + TrackBy 優化
- **Capacitor 增強**: 新增 Toast、Alert、Network 原生功能
- **移動端特性**: Pull-to-refresh、加載指示器
- **錯誤處理**: 統一的錯誤處理和用戶反饋
- **響應式設計**: 平板和桌面優化、深色模式、動畫效果

詳細改進說明請查看：
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - 完整改進文檔
- [SIGNALS_GUIDE.md](./SIGNALS_GUIDE.md) - Angular Signals 使用指南

## 目錄

- [專案概述](#專案概述)
- [技術棧](#技術棧)
- [核心特性](#核心特性)
- [Ionic Framework 介紹](#ionic-framework-介紹)
- [Angular 與 Ionic 整合](#angular-與-ionic-整合)
- [專案架構](#專案架構)
- [檔案結構](#檔案結構)
- [核心組件說明](#核心組件說明)
- [狀態管理](#狀態管理)
- [數據持久化](#數據持久化)
- [安裝與設置](#安裝與設置)
- [開發指南](#開發指南)
- [構建與部署](#構建與部署)
- [原生應用開發](#原生應用開發)
- [Capacitor 插件](#capacitor-插件)
- [性能優化](#性能優化)
- [測試策略](#測試策略)
- [與其他框架的對比](#與其他框架的對比)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)
- [進階主題](#進階主題)
- [參考資源](#參考資源)

## 專案概述

### 什麼是 Ionic?

Ionic 是一個開源的移動 UI 工具包，用於構建高品質的跨平台移動應用。它提供了一套完整的 UI 組件、手勢和動畫，能夠在 iOS、Android 和 Web 上提供原生般的體驗。

### 為什麼選擇 Ionic + Angular?

1. **企業級架構**: Angular 提供了完整的框架，包含依賴注入、路由、表單處理等
2. **TypeScript 支持**: 完整的類型安全和優秀的 IDE 支持
3. **成熟的生態系統**: 豐富的第三方庫和工具鏈
4. **可維護性**: 清晰的代碼組織和模塊化架構
5. **性能優化**: AOT 編譯和懶加載支持
6. **跨平台一致性**: 一套代碼，多平台運行

### 專案目標

本專案旨在展示：

- Ionic 7 的最新特性和最佳實踐
- Angular 17 的 Standalone Components 架構
- Capacitor 原生功能整合
- 響應式狀態管理（RxJS）
- 原生般的用戶體驗
- 跨平台應用開發流程

## 技術棧

### 核心框架

- **Ionic Framework 7.8+**: 移動 UI 組件庫
- **Angular 17.3+**: 前端框架
- **TypeScript 5.4+**: 類型安全的 JavaScript 超集
- **Capacitor 5.7+**: 原生應用運行時

### UI 組件

- **ion-header/ion-toolbar**: 頂部導航欄
- **ion-content**: 內容容器，支持滾動和刷新
- **ion-list/ion-item**: 列表組件
- **ion-input**: 輸入框
- **ion-checkbox**: 複選框
- **ion-button**: 按鈕
- **ion-segment**: 分段控制器（用於過濾）
- **ion-chip**: 標籤組件（用於統計顯示）
- **ion-item-sliding**: 滑動操作

### 狀態管理

- **RxJS 7.8+**: 響應式編程
- **BehaviorSubject**: 狀態流管理
- **Observable**: 數據流
- **Operators**: map, filter, debounce 等

### 原生功能

- **@capacitor/preferences**: 數據持久化
- **@capacitor/haptics**: 觸覺反饋
- **@capacitor/keyboard**: 鍵盤管理
- **@capacitor/status-bar**: 狀態欄控制
- **@capacitor/app**: 應用生命週期

### 開發工具

- **Angular CLI**: 項目腳手架和構建工具
- **Ionic CLI**: Ionic 專用命令行工具
- **ESLint**: 代碼檢查
- **Karma/Jasmine**: 單元測試

## 核心特性

### 功能特性

1. **Todo 管理**
   - ✅ 添加新的 todo
   - ✅ 標記完成/未完成
   - ✅ 編輯 todo 文本（雙擊或長按）
   - ✅ 刪除 todo（滑動或點擊刪除按鈕）
   - ✅ 批量完成所有 todo
   - ✅ 清除已完成的 todo

2. **過濾與篩選**
   - 📋 全部 todo
   - 🔄 未完成的 todo
   - ✅ 已完成的 todo

3. **統計與顯示**
   - 📊 總 todo 數量
   - ⏳ 未完成數量
   - ✅ 已完成數量

4. **用戶體驗**
   - 🎨 Material Design 風格 UI
   - 🌓 深色模式自動適配
   - 📱 響應式設計
   - 👆 手勢操作（滑動刪除）
   - 🔊 觸覺反饋（iOS/Android）
   - ⚡ 流暢的動畫效果

5. **數據持久化**
   - 💾 本地存儲（Capacitor Preferences）
   - 🔄 自動保存
   - 📦 跨會話數據保留

### 技術特性

1. **Angular 17+ 新特性**
   - Standalone Components（獨立組件）
   - Signal-based Reactivity（信號響應式）
   - OnPush 變更檢測優化
   - Computed Signals 自動計算
   - TypeScript 嚴格模式
   - 改進的模板語法
   - 更好的類型推斷

2. **Ionic 7 特性**
   - 現代化的 UI 組件
   - Pull-to-refresh 刷新
   - Ion-refresher 支持
   - 改進的性能
   - 更好的可訪問性
   - 增強的手勢支持
   - 響應式設計

3. **Capacitor 5 特性**
   - 統一的插件 API
   - Toast 消息提示
   - Alert 原生對話框
   - Network 狀態監控
   - Haptics 觸覺反饋
   - Status Bar 控制
   - 更好的 TypeScript 支持
   - 改進的原生集成
   - 實時重載

## Ionic Framework 介紹

### 什麼是 Ionic?

Ionic Framework 是一個開源的移動應用開發工具包，專注於構建高性能、高質量的跨平台應用。它提供了：

1. **UI 組件庫**: 100+ 精心設計的移動 UI 組件
2. **主題系統**: CSS 變量驅動的主題定制
3. **手勢系統**: 原生級的手勢和交互
4. **動畫系統**: 流暢的頁面轉場和組件動畫
5. **平台適配**: 自動適配 iOS、Android、Web 的設計規範

### Ionic 架構

```
┌─────────────────────────────────────┐
│         Your Application            │
│     (Angular Components)            │
├─────────────────────────────────────┤
│      Ionic UI Components            │
│   (ion-button, ion-list, etc.)      │
├─────────────────────────────────────┤
│         Ionic Core                  │
│    (Web Components, Gestures)       │
├─────────────────────────────────────┤
│          Capacitor                  │
│   (Native Runtime & Plugins)        │
├─────────────────────────────────────┤
│      Native Platform APIs           │
│    (iOS, Android, Web)              │
└─────────────────────────────────────┘
```

### Ionic vs 其他框架

#### Ionic vs React Native

| 特性 | Ionic | React Native |
|------|-------|--------------|
| 渲染引擎 | Web View (WebKit) | Native Components |
| 性能 | 接近原生 | 原生級 |
| 學習曲線 | 較平緩（Web 技術） | 中等（需要了解原生概念） |
| UI 一致性 | 高（跨平台統一） | 中（需要平台特定代碼） |
| Web 支持 | 優秀 | 需要 React Native Web |
| 生態系統 | Web 生態 | React 生態 |
| 應用體積 | 中等 | 較大 |
| 熱更新 | 容易 | 需要 CodePush |

#### Ionic vs Flutter

| 特性 | Ionic | Flutter |
|------|-------|---------|
| 語言 | TypeScript/JavaScript | Dart |
| 渲染 | WebView | 自繪引擎 |
| 性能 | 良好 | 優秀 |
| Web 支持 | 原生支持 | 實驗性 |
| 開發速度 | 快（Web 開發經驗可復用） | 快（熱重載） |
| UI 定制 | CSS | Widget 樹 |
| 包大小 | 中等 | 較大 |
| SEO | 優秀 | 有限 |

### Ionic 適用場景

✅ **適合使用 Ionic 的場景：**

1. 企業級內部應用
2. 內容驅動的應用（新聞、博客等）
3. 需要快速上線的 MVP 項目
4. Web 應用需要移動版本
5. 團隊有 Web 開發背景
6. 需要良好的 PWA 支持

❌ **不太適合 Ionic 的場景：**

1. 高性能遊戲
2. 複雜的圖形處理應用
3. 需要大量原生 API 調用
4. 對性能要求極致的應用

## Angular 與 Ionic 整合

### Angular 在 Ionic 中的角色

Angular 為 Ionic 應用提供了：

1. **組件架構**: 可重用、可測試的組件
2. **依賴注入**: 服務和狀態管理
3. **路由系統**: 頁面導航和懶加載
4. **表單處理**: 模板驅動和響應式表單
5. **HTTP 客戶端**: API 調用和數據獲取
6. **RxJS 集成**: 響應式編程支持

### Standalone Components

Angular 17 引入了 Standalone Components，簡化了模塊管理：

**傳統方式 (Module-based):**

```typescript
// app.module.ts
@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [IonicModule.forRoot(), CommonModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

**新方式 (Standalone):**

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent {}
```

**優點：**

- 🎯 更簡單的依賴管理
- 📦 更好的懶加載
- 🔧 更容易測試
- 📝 更少的樣板代碼

### 依賴注入

Angular 的依賴注入系統使得服務管理變得簡單：

```typescript
@Injectable({
  providedIn: 'root'  // 全局單例
})
export class TodoService {
  // Service implementation
}

@Component({
  selector: 'app-home',
  standalone: true
})
export class HomePage {
  constructor(private todoService: TodoService) {
    // Service automatically injected
  }
}
```

### Angular Signals 響應式編程

本專案使用 Angular 17+ 的 Signals API，提供更簡單直觀的響應式狀態管理：

```typescript
export class TodoService {
  // Signals for state management
  private todosSignal = signal<Todo[]>([]);
  public readonly todos = this.todosSignal.asReadonly();

  // Computed signals (自動計算)
  public readonly filteredTodos = computed(() => {
    const todos = this.todosSignal();
    const filter = this.filterSignal();
    return this.applyFilter(todos, filter);
  });

  public readonly stats = computed(() => {
    const todos = this.todosSignal();
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    };
  });

  // 更新狀態
  async addTodo(text: string): Promise<void> {
    this.todosSignal.update(todos => [...todos, newTodo]);
  }
}
```

**Signals 優點：**

- ⚡ 性能優秀（細粒度更新）
- 🎯 簡單直觀（比 RxJS 易學）
- 🔄 自動更新 UI
- 💾 自動內存管理（無需取消訂閱）
- 🎨 完美配合 OnPush 變更檢測

**同時支持 RxJS：**

本專案同時提供 Signals 和 RxJS Observable，實現向後兼容：

```typescript
// Signals API (推薦)
public readonly todos = this.todosSignal.asReadonly();

// RxJS API (兼容)
public todos$ = toObservable(this.todosSignal);
```

詳細使用指南：[SIGNALS_GUIDE.md](./SIGNALS_GUIDE.md)

## 專案架構

### 整體架構圖

```
┌─────────────────────────────────────────────────┐
│                  User Interface                 │
│              (Ionic Components)                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ TodoInput    │  │  TodoList    │           │
│  │ Component    │  │  Component   │           │
│  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                     │
│         │    ┌────────────▼───────────┐        │
│         └────►    TodoItem Component  │        │
│              └────────────┬───────────┘        │
│                           │                     │
├───────────────────────────┼─────────────────────┤
│                           │                     │
│              ┌────────────▼───────────┐        │
│              │    TodoService         │        │
│              │   (State Management)   │        │
│              └────────────┬───────────┘        │
│                           │                     │
├───────────────────────────┼─────────────────────┤
│                           │                     │
│              ┌────────────▼───────────┐        │
│              │  Capacitor Preferences │        │
│              │   (Data Persistence)   │        │
│              └────────────────────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 數據流向

```
User Action
    │
    ▼
Component
    │
    ▼
TodoService (Business Logic)
    │
    ├─► Update BehaviorSubject
    │
    └─► Save to Capacitor Preferences
         │
         ▼
    Observable Update
         │
         ▼
    Component Re-render
```

### 分層架構

1. **表現層 (Presentation Layer)**
   - 組件 (Components)
   - 頁面 (Pages)
   - UI 邏輯

2. **業務邏輯層 (Business Logic Layer)**
   - 服務 (Services)
   - 狀態管理
   - 數據轉換

3. **數據層 (Data Layer)**
   - Capacitor Preferences
   - 本地存儲
   - API 調用（未來擴展）

### 組件通信

```
HomePage
   │
   ├─► TodoInputComponent
   │      │
   │      └─► TodoService.addTodo()
   │
   └─► TodoListComponent
          │
          ├─► TodoItemComponent (1)
          │      │
          │      └─► @Output() events
          │
          ├─► TodoItemComponent (2)
          │
          └─► TodoService methods
```

## 檔案結構

```
ionic-angular-todo-list/
├── capacitor.config.json          # Capacitor 配置
├── ionic.config.json              # Ionic CLI 配置
├── angular.json                   # Angular 構建配置
├── package.json                   # 依賴管理
├── tsconfig.json                  # TypeScript 配置
├── tsconfig.app.json             # 應用 TS 配置
├── README.md                      # 專案文檔
│
├── src/
│   ├── index.html                # HTML 入口
│   ├── main.ts                   # 應用引導
│   ├── global.scss               # 全局樣式
│   │
│   ├── theme/
│   │   └── variables.scss        # Ionic 主題變量
│   │
│   ├── environments/
│   │   ├── environment.ts        # 開發環境
│   │   └── environment.prod.ts   # 生產環境
│   │
│   └── app/
│       ├── app.component.ts      # 根組件
│       ├── app.component.html    # 根組件模板
│       ├── app.component.scss    # 根組件樣式
│       ├── app.routes.ts         # 路由配置
│       │
│       ├── models/
│       │   └── todo.interface.ts # Todo 類型定義
│       │
│       ├── services/
│       │   └── todo.service.ts   # Todo 服務
│       │
│       ├── components/
│       │   ├── todo-input/       # 輸入組件
│       │   │   ├── todo-input.component.ts
│       │   │   ├── todo-input.component.html
│       │   │   └── todo-input.component.scss
│       │   │
│       │   ├── todo-list/        # 列表組件
│       │   │   ├── todo-list.component.ts
│       │   │   ├── todo-list.component.html
│       │   │   └── todo-list.component.scss
│       │   │
│       │   └── todo-item/        # 單項組件
│       │       ├── todo-item.component.ts
│       │       ├── todo-item.component.html
│       │       └── todo-item.component.scss
│       │
│       └── home/                 # 首頁
│           ├── home.page.ts
│           ├── home.page.html
│           └── home.page.scss
│
├── android/                      # Android 原生項目
├── ios/                          # iOS 原生項目
└── www/                          # 構建輸出
```

### 關鍵檔案說明

| 檔案 | 用途 |
|------|------|
| `capacitor.config.json` | Capacitor 配置，定義應用 ID、名稱、Web 目錄等 |
| `ionic.config.json` | Ionic CLI 配置，定義項目類型和集成 |
| `angular.json` | Angular CLI 配置，定義構建選項、資源路徑等 |
| `src/main.ts` | 應用入口，引導 Angular 應用 |
| `src/app/app.routes.ts` | 路由配置，定義頁面導航 |
| `src/theme/variables.scss` | Ionic 主題變量，定義顏色、字體等 |

## 核心組件說明

### 1. TodoService (服務層)

**位置**: `src/app/services/todo.service.ts`

**職責**:
- 管理 todo 狀態
- 提供 CRUD 操作
- 處理數據持久化
- 提供響應式數據流

**核心方法**:

```typescript
class TodoService {
  // 狀態管理
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$: Observable<Todo[]>;

  // CRUD 操作
  async addTodo(text: string): Promise<void>
  async toggleTodo(id: string): Promise<void>
  async deleteTodo(id: string): Promise<void>
  async updateTodo(id: string, text: string): Promise<void>

  // 批量操作
  async clearCompleted(): Promise<void>
  async toggleAll(completed: boolean): Promise<void>

  // 過濾與統計
  setFilter(filter: TodoFilter): void
  private calculateStats(todos: Todo[]): TodoStats
}
```

**設計模式**:

1. **單例模式**: `providedIn: 'root'` 確保全局唯一實例
2. **觀察者模式**: 使用 RxJS Observable 實現狀態訂閱
3. **異步模式**: 所有修改操作返回 Promise

### 2. TodoInputComponent

**位置**: `src/app/components/todo-input/`

**職責**:
- 接收用戶輸入
- 驗證輸入內容
- 觸發添加操作

**特性**:
- Enter 鍵快捷提交
- 自動清空輸入
- 輸入驗證（非空）
- 清除按鈕

**代碼示例**:

```typescript
@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class TodoInputComponent {
  newTodoText = '';

  constructor(private todoService: TodoService) {}

  async addTodo(): Promise<void> {
    if (this.newTodoText.trim()) {
      await this.todoService.addTodo(this.newTodoText);
      this.newTodoText = '';
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addTodo();
    }
  }
}
```

### 3. TodoListComponent

**位置**: `src/app/components/todo-list/`

**職責**:
- 顯示 todo 列表
- 管理過濾狀態
- 提供批量操作
- 顯示統計信息

**特性**:
- 過濾器（全部/未完成/已完成）
- 空狀態顯示
- 統計芯片
- 批量操作按鈕

**響應式數據流**:

```typescript
export class TodoListComponent implements OnInit {
  todos$!: Observable<Todo[]>;
  stats$!: Observable<TodoStats>;
  currentFilter$!: Observable<TodoFilter>;

  ngOnInit(): void {
    this.todos$ = this.todoService.filteredTodos$;
    this.stats$ = this.todoService.stats$;
    this.currentFilter$ = this.todoService.filter$;
  }
}
```

### 4. TodoItemComponent

**位置**: `src/app/components/todo-item/`

**職責**:
- 渲染單個 todo
- 處理交互操作
- 內聯編輯
- 滑動刪除

**特性**:
- 複選框切換
- 雙擊編輯
- 滑動刪除手勢
- 觸覺反饋
- 時間戳顯示

**事件通信**:

```typescript
@Component({
  selector: 'app-todo-item',
  standalone: true
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<{id: string, text: string}>();

  isEditing = false;
  editText = '';

  async onToggle(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.toggle.emit(this.todo.id);
  }
}
```

### 5. HomePage

**位置**: `src/app/home/`

**職責**:
- 作為主容器頁面
- 組合子組件
- 提供導航欄

**結構**:

```html
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>Ionic Angular Todo</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <app-todo-input></app-todo-input>
  <app-todo-list></app-todo-list>
</ion-content>
```

## 狀態管理

### RxJS 狀態管理

本專案使用 RxJS 的 BehaviorSubject 作為狀態容器：

**狀態定義**:

```typescript
export class TodoService {
  // 主狀態
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();

  // 過濾器狀態
  private filterSubject = new BehaviorSubject<TodoFilter>('all');
  public filter$ = this.filterSubject.asObservable();

  // 派生狀態
  public filteredTodos$ = combineLatest([
    this.todos$,
    this.filter$
  ]).pipe(
    map(([todos, filter]) => this.applyFilter(todos, filter))
  );

  public stats$ = this.todos$.pipe(
    map(todos => this.calculateStats(todos))
  );
}
```

### 狀態更新流程

```
1. Component 觸發操作
   │
   ▼
2. Service 更新 BehaviorSubject
   │
   ▼
3. Observable 發出新值
   │
   ▼
4. Component 訂閱者接收更新
   │
   ▼
5. Angular Change Detection
   │
   ▼
6. UI 自動更新
```

### 為什麼使用 RxJS 而不是 NgRx?

對於中小型應用，RxJS + Services 已經足夠：

**RxJS + Services 優點**:
- ✅ 學習曲線低
- ✅ 樣板代碼少
- ✅ 適合簡單狀態
- ✅ 靈活性高

**NgRx 適用場景**:
- 大型應用（10+ 頁面）
- 複雜的狀態交互
- 需要時間旅行調試
- 多個團隊協作

### 內存管理

Angular 的自動訂閱管理：

```typescript
export class TodoListComponent implements OnInit {
  // 使用 async pipe，自動取消訂閱
  todos$ = this.todoService.todos$;

  // 如果手動訂閱，需要在 ngOnDestroy 取消
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.todos$.subscribe(/* ... */);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
```

**最佳實踐**: 盡量使用 `async` pipe，避免手動訂閱管理。

## 數據持久化

### Capacitor Preferences API

Capacitor Preferences 是一個簡單的鍵值存儲 API，用於持久化應用數據。

**基本用法**:

```typescript
import { Preferences } from '@capacitor/preferences';

// 保存數據
await Preferences.set({
  key: 'todos',
  value: JSON.stringify(todos)
});

// 讀取數據
const { value } = await Preferences.get({ key: 'todos' });
const todos = JSON.parse(value || '[]');

// 刪除數據
await Preferences.remove({ key: 'todos' });

// 清空所有數據
await Preferences.clear();
```

### 在 TodoService 中的實現

```typescript
export class TodoService {
  private readonly STORAGE_KEY = 'ionic-angular-todos';

  private async loadTodos(): Promise<void> {
    try {
      const { value } = await Preferences.get({
        key: this.STORAGE_KEY
      });
      if (value) {
        const todos: Todo[] = JSON.parse(value);
        this.todosSubject.next(todos);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }

  private async saveTodos(todos: Todo[]): Promise<void> {
    try {
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(todos)
      });
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }
}
```

### 存儲策略

1. **即時保存**: 每次修改後立即保存
2. **異步操作**: 不阻塞 UI 更新
3. **錯誤處理**: 捕獲並記錄存儲錯誤
4. **數據驗證**: 讀取時驗證數據格式

### 平台差異

| 平台 | 底層實現 | 容量限制 |
|------|----------|----------|
| iOS | UserDefaults | ~1MB |
| Android | SharedPreferences | ~1MB |
| Web | LocalStorage | ~5-10MB |

### 進階存儲方案

對於更複雜的需求，可以考慮：

1. **SQLite**: 結構化數據存儲
   ```typescript
   import { CapacitorSQLite } from '@capacitor-community/sqlite';
   ```

2. **Capacitor Filesystem**: 文件存儲
   ```typescript
   import { Filesystem } from '@capacitor/filesystem';
   ```

3. **IndexedDB**: 大容量客戶端數據庫
   ```typescript
   // 使用 Dexie.js 等庫
   ```

## 安裝與設置

### 環境要求

- Node.js 18.0 或更高
- npm 9.0 或更高
- iOS 開發需要 macOS 和 Xcode
- Android 開發需要 Android Studio

### 步驟 1: 安裝依賴

```bash
npm install
```

### 步驟 2: 安裝 Ionic CLI（如果尚未安裝）

```bash
npm install -g @ionic/cli
```

### 步驟 3: 啟動開發服務器

```bash
# 使用 Ionic CLI
ionic serve

# 或使用 npm
npm start

# 指定端口
ionic serve --port 8100
```

應用將在 `http://localhost:8100` 啟動。

### 步驟 4: 在瀏覽器中預覽

Ionic CLI 會自動打開瀏覽器。你也可以手動訪問：

- Chrome: 推薦，支持 DevTools
- Safari: 測試 iOS 特定行為
- Firefox: 測試跨瀏覽器兼容性

### 開發工具

**推薦的 VSCode 擴展**:

1. **Angular Language Service**: Angular 語法支持
2. **Ionic**: Ionic 組件提示
3. **ESLint**: 代碼檢查
4. **Prettier**: 代碼格式化
5. **GitLens**: Git 增強

**.vscode/settings.json**:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## 開發指南

### 熱重載

Ionic CLI 提供了強大的熱重載功能：

```bash
ionic serve --lab  # 多平台預覽
```

Ionic Lab 可以同時查看 iOS、Android、Web 三個平台的效果。

### 調試技巧

#### 1. Chrome DevTools

```bash
# 打開 Chrome DevTools
F12 or Cmd+Option+I (Mac)
```

**常用功能**:
- Elements: 檢查 DOM 結構
- Console: 查看日誌
- Network: 監控 API 請求
- Application > Storage: 查看 LocalStorage

#### 2. Angular DevTools

安裝 Chrome 擴展 "Angular DevTools"：

- 組件檢查器
- 性能分析
- 依賴注入樹

#### 3. Ionic DevApp

在真實設備上測試：

```bash
# 啟動服務器並允許外部訪問
ionic serve --external

# 在移動設備上安裝 Ionic DevApp
# iOS: App Store
# Android: Google Play
```

### 添加新頁面

```bash
# 生成新頁面
ionic generate page pages/settings

# 生成組件
ionic generate component components/my-component
```

### 樣式開發

#### CSS 變量定制

編輯 `src/theme/variables.scss`:

```scss
:root {
  --ion-color-primary: #3880ff;
  --ion-color-secondary: #3dc2ff;
  // ... 更多顏色
}
```

#### 組件級樣式

```scss
// todo-item.component.scss
:host {
  display: block;
}

.todo-item {
  &.completed {
    opacity: 0.6;
  }
}
```

#### 全局樣式

編輯 `src/global.scss`:

```scss
// 自定義工具類
.text-muted {
  color: var(--ion-color-medium);
}

.mt-2 {
  margin-top: 16px;
}
```

### 性能優化技巧

#### 1. 使用 OnPush 變更檢測

```typescript
@Component({
  selector: 'app-todo-item',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {}
```

#### 2. TrackBy 函數

```typescript
trackByTodoId(index: number, todo: Todo): string {
  return todo.id;
}
```

```html
<app-todo-item
  *ngFor="let todo of todos; trackBy: trackByTodoId"
  [todo]="todo">
</app-todo-item>
```

#### 3. 懶加載路由

```typescript
export const routes: Routes = [
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page')
      .then(m => m.SettingsPage)
  }
];
```

## 構建與部署

### Web 構建

#### 開發構建

```bash
ionic build

# 或
ng build
```

輸出到 `www/` 目錄。

#### 生產構建

```bash
ionic build --prod

# 或
ng build --configuration production
```

**生產構建優化**:
- Tree-shaking（移除未使用代碼）
- AOT 編譯
- 代碼壓縮
- CSS 優化

### PWA 部署

#### 添加 PWA 支持

```bash
ng add @angular/pwa
```

這會：
- 添加 `manifest.webmanifest`
- 生成 Service Worker
- 配置圖標和主題

#### 配置 manifest.webmanifest

```json
{
  "name": "Ionic Angular Todo",
  "short_name": "Todo",
  "theme_color": "#3880ff",
  "background_color": "#ffffff",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    }
    // ... 更多尺寸
  ]
}
```

#### 部署到 Netlify

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 構建
ionic build --prod

# 部署
netlify deploy --prod --dir=www
```

#### 部署到 Vercel

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

**vercel.json**:

```json
{
  "buildCommand": "ionic build --prod",
  "outputDirectory": "www",
  "framework": "angular"
}
```

### 靜態托管選項

| 平台 | 優點 | 缺點 |
|------|------|------|
| Netlify | 簡單、CDN、免費 SSL | 構建時間限制（免費版） |
| Vercel | 快速、Git 集成 | 帶寬限制 |
| Firebase Hosting | Google 生態、函數集成 | 需要 Firebase 項目 |
| AWS S3 + CloudFront | 可擴展、控制力強 | 配置複雜 |
| GitHub Pages | 免費、GitHub 集成 | 不支持 SPA 路由（需配置） |

## 原生應用開發

### 添加平台

#### iOS

```bash
# 添加 iOS 平台
ionic capacitor add ios

# 同步代碼到 iOS 項目
ionic capacitor sync ios

# 打開 Xcode
ionic capacitor open ios
```

**要求**:
- macOS
- Xcode 14+
- CocoaPods

#### Android

```bash
# 添加 Android 平台
ionic capacitor add android

# 同步代碼
ionic capacitor sync android

# 打開 Android Studio
ionic capacitor open android
```

**要求**:
- Android Studio
- JDK 11+
- Android SDK

### 在模擬器/設備上運行

#### iOS

```bash
# 在模擬器運行
ionic capacitor run ios

# 選擇設備
ionic capacitor run ios --target="iPhone 14 Pro"

# 在真機運行（需要開發者證書）
ionic capacitor run ios --device
```

#### Android

```bash
# 在模擬器運行
ionic capacitor run android

# 選擇設備
ionic capacitor run android --target=emulator-5554

# 在真機運行（啟用 USB 調試）
ionic capacitor run android --device
```

### 實時重載

在真機上實現熱重載：

```bash
# iOS
ionic capacitor run ios --livereload --external --host=0.0.0.0

# Android
ionic capacitor run android --livereload --external --host=0.0.0.0
```

確保設備和電腦在同一網絡。

### 構建發布版本

#### iOS App Store

1. **在 Xcode 中配置**:
   - 設置 Bundle ID
   - 配置簽名證書
   - 設置版本號

2. **構建**:
   ```bash
   ionic capacitor build ios
   ```

3. **歸檔並上傳**:
   - Product > Archive
   - Distribute App > App Store Connect
   - 上傳到 TestFlight

#### Android Google Play

1. **配置簽名密鑰**:
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore \
     -alias my-key-alias -keyalg RSA -keysize 2048 \
     -validity 10000
   ```

2. **構建 AAB**:
   - 打開 Android Studio
   - Build > Generate Signed Bundle / APK
   - 選擇 AAB 格式
   - 配置簽名信息

3. **上傳到 Play Console**:
   - 創建應用
   - 上傳 AAB
   - 填寫商店信息
   - 提交審核

### 應用圖標和啟動屏幕

使用 Cordova Resources:

```bash
# 安裝
npm install -g cordova-res

# 準備資源
# 放置 icon.png (1024x1024) 到 resources/
# 放置 splash.png (2732x2732) 到 resources/

# 生成所有尺寸
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
```

### 版本管理

#### 更新版本號

編輯多個文件：

**package.json**:
```json
{
  "version": "1.0.1"
}
```

**iOS (Info.plist)**:
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.1</string>
<key>CFBundleVersion</key>
<string>2</string>
```

**Android (build.gradle)**:
```gradle
android {
    defaultConfig {
        versionCode 2
        versionName "1.0.1"
    }
}
```

## Capacitor 插件

### 已集成的插件

#### 1. Preferences

```typescript
import { Preferences } from '@capacitor/preferences';

// 使用示例已在 TodoService 中展示
```

#### 2. Haptics

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// 輕觸反饋
await Haptics.impact({ style: ImpactStyle.Light });

// 中等反饋
await Haptics.impact({ style: ImpactStyle.Medium });

// 重觸反饋
await Haptics.impact({ style: ImpactStyle.Heavy });

// 通知反饋
await Haptics.notification({ type: NotificationType.Success });
```

#### 3. Status Bar

```typescript
import { StatusBar, Style } from '@capacitor/status-bar';

// 設置樣式
await StatusBar.setStyle({ style: Style.Dark });

// 設置背景色
await StatusBar.setBackgroundColor({ color: '#3880ff' });

// 顯示/隱藏
await StatusBar.hide();
await StatusBar.show();
```

#### 4. Keyboard

```typescript
import { Keyboard } from '@capacitor/keyboard';

// 監聽鍵盤事件
Keyboard.addListener('keyboardWillShow', info => {
  console.log('Keyboard will show:', info);
});

Keyboard.addListener('keyboardDidShow', info => {
  console.log('Keyboard height:', info.keyboardHeight);
});

// 隱藏鍵盤
await Keyboard.hide();
```

### 添加更多插件

#### 相機插件

```bash
npm install @capacitor/camera
npx cap sync
```

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const photo = await Camera.getPhoto({
  resultType: CameraResultType.Uri,
  quality: 90
});
```

#### 地理位置

```bash
npm install @capacitor/geolocation
npx cap sync
```

```typescript
import { Geolocation } from '@capacitor/geolocation';

const coordinates = await Geolocation.getCurrentPosition();
console.log(coordinates.coords.latitude);
```

#### 推送通知

```bash
npm install @capacitor/push-notifications
npx cap sync
```

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

await PushNotifications.requestPermissions();
await PushNotifications.register();

PushNotifications.addListener('registration', token => {
  console.log('Token:', token.value);
});
```

### 插件生態系統

- **官方插件**: @capacitor/* 包
- **社區插件**: @capacitor-community/* 包
- **自定義插件**: 可以創建自己的原生插件

**查找插件**:
- https://capacitorjs.com/docs/plugins
- https://github.com/capacitor-community

## 性能優化

### 構建優化

#### 1. 啟用生產模式

```typescript
// main.ts
if (environment.production) {
  enableProdMode();
}
```

#### 2. AOT 編譯

默認在生產構建中啟用：

```json
// angular.json
{
  "configurations": {
    "production": {
      "aot": true,
      "buildOptimizer": true
    }
  }
}
```

#### 3. 樹搖優化

移除未使用的代碼：

```json
{
  "optimization": true
}
```

#### 4. 懶加載

```typescript
// 延遲加載模塊
{
  path: 'lazy',
  loadChildren: () => import('./lazy/lazy.module')
    .then(m => m.LazyModule)
}
```

### 運行時優化

#### 1. 變更檢測優化

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {}
```

#### 2. 虛擬滾動

對於長列表：

```html
<cdk-virtual-scroll-viewport itemSize="50">
  <app-todo-item
    *cdkVirtualFor="let todo of todos"
    [todo]="todo">
  </app-todo-item>
</cdk-virtual-scroll-viewport>
```

#### 3. Memoization

使用純管道：

```typescript
@Pipe({
  name: 'filterTodos',
  pure: true  // 只在輸入改變時重新計算
})
export class FilterTodosPipe {}
```

### 內存優化

#### 1. 取消訂閱

```typescript
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### 2. 避免內存洩漏

```typescript
// ❌ 錯誤：創建多個訂閱
ngOnInit() {
  setInterval(() => {
    this.service.getData().subscribe();
  }, 1000);
}

// ✅ 正確：管理訂閱
private subscription?: Subscription;

ngOnInit() {
  this.subscription = interval(1000).pipe(
    switchMap(() => this.service.getData())
  ).subscribe();
}

ngOnDestroy() {
  this.subscription?.unsubscribe();
}
```

### 網絡優化

#### 1. HTTP 緩存

```typescript
import { HttpClient } from '@angular/common/http';

getData() {
  return this.http.get('/api/data', {
    headers: {
      'Cache-Control': 'max-age=3600'
    }
  });
}
```

#### 2. 請求去重

```typescript
private cache$ = new Map();

getData(id: string) {
  if (!this.cache$.has(id)) {
    this.cache$.set(
      id,
      this.http.get(`/api/data/${id}`).pipe(shareReplay(1))
    );
  }
  return this.cache$.get(id);
}
```

### 包大小優化

#### 分析包大小

```bash
# 生成統計文件
ng build --stats-json

# 使用 webpack-bundle-analyzer
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/stats.json
```

#### 減小包大小

1. **移除未使用的依賴**
2. **使用 ES modules**
3. **啟用 gzip/brotli 壓縮**
4. **代碼分割**

## 測試策略

### 單元測試

#### 測試 Service

```typescript
// todo.service.spec.ts
describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should add a todo', async () => {
    await service.addTodo('Test Todo');
    const todos = await firstValueFrom(service.todos$);
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe('Test Todo');
  });

  it('should toggle todo', async () => {
    await service.addTodo('Test');
    const todos = await firstValueFrom(service.todos$);
    const id = todos[0].id;

    await service.toggleTodo(id);
    const updated = await firstValueFrom(service.todos$);
    expect(updated[0].completed).toBe(true);
  });
});
```

#### 測試 Component

```typescript
// todo-input.component.spec.ts
describe('TodoInputComponent', () => {
  let component: TodoInputComponent;
  let fixture: ComponentFixture<TodoInputComponent>;
  let service: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoInputComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(TodoService);
  });

  it('should add todo on submit', async () => {
    component.newTodoText = 'Test Todo';
    await component.addTodo();

    const todos = await firstValueFrom(service.todos$);
    expect(todos.length).toBe(1);
  });

  it('should clear input after submit', async () => {
    component.newTodoText = 'Test';
    await component.addTodo();
    expect(component.newTodoText).toBe('');
  });
});
```

### E2E 測試

使用 Cypress:

```bash
npm install --save-dev cypress
npx cypress open
```

```typescript
// cypress/e2e/todo.cy.ts
describe('Todo App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add a new todo', () => {
    cy.get('ion-input').type('New Todo');
    cy.get('ion-button').contains('Add').click();
    cy.get('ion-list').should('contain', 'New Todo');
  });

  it('should toggle todo', () => {
    cy.get('ion-checkbox').first().click();
    cy.get('ion-item').first().should('have.class', 'completed');
  });

  it('should delete todo', () => {
    cy.get('ion-item').first().swipe('left');
    cy.get('ion-item-option').click();
    cy.get('ion-list').should('not.contain', 'Deleted Todo');
  });
});
```

### 運行測試

```bash
# 單元測試
ng test

# E2E 測試
npm run e2e

# 代碼覆蓋率
ng test --code-coverage
```

## 與其他框架的對比

### Ionic Angular vs Ionic React

| 特性 | Ionic Angular | Ionic React |
|------|---------------|-------------|
| 學習曲線 | 陡峭（需要學習 Angular） | 平緩（React 簡單） |
| 類型安全 | 優秀（TypeScript + 裝飾器） | 良好（TypeScript） |
| 狀態管理 | RxJS / NgRx | Redux / Context |
| 依賴注入 | 內置 | 需要第三方庫 |
| 表單處理 | 強大（Reactive Forms） | 需要第三方庫 |
| 生態系統 | 企業級 | 社區豐富 |
| 性能 | 良好 | 優秀 |
| 包大小 | 較大 | 較小 |

### Ionic Angular vs Ionic Vue

| 特性 | Ionic Angular | Ionic Vue |
|------|---------------|-----------|
| 語法 | 類 + 裝飾器 | Composition API |
| 響應式 | RxJS | ref/reactive |
| 學習曲線 | 陡峭 | 平緩 |
| TypeScript 支持 | 優秀 | 良好 |
| 工具鏈 | Angular CLI | Vite |
| 構建速度 | 較慢 | 快 |
| 社區 | 成熟 | 成長中 |
| 企業採用 | 廣泛 | 漸增 |

### 何時選擇 Ionic Angular？

選擇 Ionic Angular 如果：

✅ 需要企業級架構
✅ 團隊有 Angular 經驗
✅ 需要完整的框架解決方案
✅ 重視類型安全和可維護性
✅ 需要強大的依賴注入
✅ 應用複雜度高

選擇其他框架如果：

❌ 追求最小包大小
❌ 團隊沒有 Angular 經驗
❌ 需要快速原型開發
❌ 更喜歡靈活的架構

## 最佳實踐

### 代碼組織

#### 1. 按功能模塊組織

```
src/app/
├── core/              # 核心服務、攔截器
├── shared/            # 共享組件、指令、管道
├── features/
│   ├── todos/        # Todo 功能模塊
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   └── pages/
│   └── settings/     # 設置功能模塊
└── app.component.ts
```

#### 2. 使用 Barrel Exports

```typescript
// models/index.ts
export * from './todo.interface';
export * from './user.interface';

// 使用時
import { Todo, User } from './models';
```

### Angular 最佳實踐

#### 1. 使用 Standalone Components

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MyComponent {}
```

#### 2. 使用 Smart/Dumb 組件模式

```typescript
// Smart Component (Container)
@Component({
  selector: 'app-todo-container',
  template: `
    <app-todo-list
      [todos]="todos$ | async"
      (add)="onAdd($event)"
      (delete)="onDelete($event)">
    </app-todo-list>
  `
})
export class TodoContainerComponent {
  todos$ = this.todoService.todos$;

  constructor(private todoService: TodoService) {}

  onAdd(text: string) {
    this.todoService.addTodo(text);
  }
}

// Dumb Component (Presentational)
@Component({
  selector: 'app-todo-list',
  template: `...`
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() add = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
}
```

#### 3. 使用 OnPush 變更檢測

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### Ionic 最佳實踐

#### 1. 使用 Ionic 組件

```html
<!-- ✅ 好 -->
<ion-button>Click me</ion-button>

<!-- ❌ 不好 -->
<button>Click me</button>
```

#### 2. 響應式設計

```scss
// 使用 Ionic 斷點
@media (min-width: 768px) {
  .desktop-only {
    display: block;
  }
}
```

#### 3. 平台特定代碼

```typescript
import { Platform } from '@ionic/angular';

constructor(private platform: Platform) {
  if (this.platform.is('ios')) {
    // iOS 特定邏輯
  }
}
```

### 性能最佳實踐

1. **使用 trackBy**: 優化 ngFor
2. **懶加載**: 路由級代碼分割
3. **虛擬滾動**: 長列表
4. **OnPush**: 減少變更檢測
5. **Web Workers**: CPU 密集型任務

### 安全最佳實踐

1. **避免 innerHTML**: 使用文本綁定
2. **驗證輸入**: 服務端和客戶端
3. **HTTPS**: 生產環境必須
4. **環境變量**: 不要提交密鑰到 Git

## 常見問題

### Q1: 如何解決 Capacitor 同步問題？

```bash
# 清理並重新同步
rm -rf android ios
ionic capacitor add android
ionic capacitor add ios
ionic capacitor sync
```

### Q2: iOS 構建失敗怎麼辦？

1. 更新 CocoaPods: `sudo gem install cocoapods`
2. 清理緩存: `cd ios/App && pod deintegrate && pod install`
3. 檢查 Xcode 版本

### Q3: Android 簽名錯誤？

```bash
# 檢查簽名配置
keytool -list -v -keystore my-release-key.keystore
```

### Q4: 如何調試原生代碼？

- **iOS**: 使用 Xcode Console
- **Android**: 使用 Android Studio Logcat

### Q5: 深色模式如何實現？

```typescript
// 自動檢測系統主題
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// 手動切換
document.body.classList.toggle('dark');
```

### Q6: 如何處理返回按鈕？

```typescript
import { App } from '@capacitor/app';

App.addListener('backButton', ({ canGoBack }) => {
  if (!canGoBack) {
    App.exitApp();
  } else {
    window.history.back();
  }
});
```

## 進階主題

### 1. 離線支持

使用 Service Worker:

```typescript
// 註冊 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### 2. 推送通知

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

// 請求權限
await PushNotifications.requestPermissions();

// 註冊
await PushNotifications.register();

// 接收通知
PushNotifications.addListener('pushNotificationReceived',
  notification => {
    console.log('Notification:', notification);
  }
);
```

### 3. 深度鏈接

```typescript
import { App } from '@capacitor/app';

App.addListener('appUrlOpen', data => {
  const slug = data.url.split('.app').pop();
  if (slug) {
    this.router.navigateByUrl(slug);
  }
});
```

### 4. 性能監控

使用 Firebase Performance:

```typescript
import { PerformanceMonitoring } from '@capacitor-firebase/performance';

const trace = await PerformanceMonitoring.startTrace({
  traceName: 'load_todos'
});
// ... 執行操作
await PerformanceMonitoring.stopTrace({ traceName: 'load_todos' });
```

### 5. 自定義原生插件

創建 Capacitor 插件：

```bash
npm init @capacitor/plugin my-plugin
```

## 參考資源

### 官方文檔

- [Ionic Framework](https://ionicframework.com/docs)
- [Angular](https://angular.io/docs)
- [Capacitor](https://capacitorjs.com/docs)
- [RxJS](https://rxjs.dev/)

### 學習資源

- [Ionic Academy](https://ionicacademy.com/)
- [Angular University](https://angular-university.io/)
- [RxJS Marbles](https://rxmarbles.com/)

### 社區

- [Ionic Forum](https://forum.ionicframework.com/)
- [Angular Discord](https://discord.gg/angular)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/ionic-framework)

### 工具

- [Ionic DevApp](https://ionicframework.com/docs/appflow/devapp)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Angular DevTools](https://angular.io/guide/devtools)

---

## 總結

Ionic Angular 提供了一個強大的企業級解決方案，結合了 Angular 的完整框架和 Ionic 的精美 UI 組件。這個 Todo List 專案展示了：

- ✅ Modern Angular 17 特性（Standalone Components）
- ✅ Ionic 7 UI 組件的使用
- ✅ RxJS 響應式狀態管理
- ✅ Capacitor 原生功能集成
- ✅ 跨平台應用開發流程
- ✅ 性能優化最佳實踐

通過這個專案，你可以學習到如何構建一個完整的跨平台移動應用，從開發、測試到部署的整個流程。

**下一步建議**:

1. 添加更多功能（標籤、優先級、截止日期）
2. 集成後端 API（Firebase、Supabase）
3. 實現多用戶支持
4. 添加數據同步
5. 發布到應用商店

祝你開發愉快！ 🚀
