# Angular Signals 完整指南

## 什麼是 Angular Signals?

Angular Signals 是 Angular 16/17 引入的新響應式原語，提供了一種更簡單、更直觀的狀態管理方式。

## 為什麼使用 Signals?

### 與 RxJS 對比

| 特性 | Signals | RxJS Observables |
|------|---------|------------------|
| 同步狀態 | ✅ 優秀 | ⚠️ 需要 BehaviorSubject |
| 異步操作 | ⚠️ 有限 | ✅ 強大 |
| 學習曲線 | ✅ 簡單 | ⚠️ 陡峭 |
| 性能 | ✅ 優秀 | ✅ 良好 |
| 變更檢測 | ✅ 自動優化 | ⚠️ 需要手動 |
| 組合能力 | `computed()` | `pipe()` operators |
| 內存管理 | ✅ 自動 | ⚠️ 需要取消訂閱 |
| 調試 | ✅ 簡單 | ⚠️ 複雜 |

## 基礎概念

### 1. 創建 Signal

```typescript
import { signal } from '@angular/core';

// 基本類型
const count = signal(0);
const name = signal('John');
const isActive = signal(true);

// 對象
const user = signal({ id: 1, name: 'John' });

// 數組
const todos = signal<Todo[]>([]);
```

### 2. 讀取 Signal

```typescript
// 使用 () 讀取值
const currentCount = count();
const currentName = name();
const allTodos = todos();

console.log(count()); // 0
console.log(name());  // 'John'
```

### 3. 更新 Signal

```typescript
// set() - 設置新值
count.set(10);
name.set('Jane');

// update() - 基於當前值更新
count.update(value => value + 1);
todos.update(list => [...list, newTodo]);

// 不要直接修改對象（這不會觸發更新）
todos().push(newTodo); // ❌ 錯誤
todos.update(list => [...list, newTodo]); // ✅ 正確
```

### 4. Computed Signals

```typescript
import { computed } from '@angular/core';

const firstName = signal('John');
const lastName = signal('Doe');

// 自動計算的 signal
const fullName = computed(() => {
  return `${firstName()} ${lastName()}`;
});

console.log(fullName()); // 'John Doe'

firstName.set('Jane');
console.log(fullName()); // 'Jane Doe' (自動更新)
```

### 5. Effect

```typescript
import { effect } from '@angular/core';

// 當依賴的 signal 改變時自動執行
effect(() => {
  console.log('Count changed:', count());
});

count.set(5); // 自動觸發 effect
```

## 在 TodoService 中的實際應用

### 完整示例

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // 1. 私有可寫 signals
  private todosSignal = signal<Todo[]>([]);
  private filterSignal = signal<TodoFilter>('all');
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // 2. 公開只讀 signals
  public readonly todos = this.todosSignal.asReadonly();
  public readonly filter = this.filterSignal.asReadonly();
  public readonly isLoading = this.isLoadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();

  // 3. Computed signals
  public readonly filteredTodos = computed(() => {
    const todos = this.todosSignal();
    const filter = this.filterSignal();

    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  });

  public readonly stats = computed(() => {
    const todos = this.todosSignal();
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    };
  });

  // 4. 方法更新 signals
  async addTodo(text: string): Promise<void> {
    const newTodo: Todo = {
      id: this.generateId(),
      text,
      completed: false,
      createdAt: Date.now()
    };

    // 使用 update() 添加新項
    this.todosSignal.update(todos => [...todos, newTodo]);
    await this.saveTodos(this.todosSignal());
  }

  async toggleTodo(id: string): Promise<void> {
    // 使用 update() 更新特定項
    this.todosSignal.update(todos =>
      todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
    await this.saveTodos(this.todosSignal());
  }

  setFilter(filter: TodoFilter): void {
    // 使用 set() 設置新值
    this.filterSignal.set(filter);
  }
}
```

## 在組件中使用 Signals

### 基本用法

```typescript
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  // 直接使用 service 的 signals
  protected todos = this.todoService.filteredTodos;
  protected stats = this.todoService.stats;
  protected filter = this.todoService.filter;

  constructor(protected todoService: TodoService) {}

  // 在方法中讀取 signal
  logStats(): void {
    const currentStats = this.stats();
    console.log('Total:', currentStats.total);
  }
}
```

### 模板中使用

```html
<!-- 使用 () 調用 signal -->
<div *ngIf="todos().length === 0">
  No todos
</div>

<div *ngFor="let todo of todos()">
  {{ todo.text }}
</div>

<!-- Computed signal -->
<p>Total: {{ stats().total }}</p>
<p>Active: {{ stats().active }}</p>
<p>Completed: {{ stats().completed }}</p>

<!-- 條件渲染 -->
<ion-button *ngIf="stats().total > 0">
  Clear All
</ion-button>
```

## 高級模式

### 1. Signal + NgModel

```typescript
export class TodoInputComponent {
  // Signal for input text
  protected inputText = signal('');

  addTodo(): void {
    if (this.inputText().trim()) {
      this.todoService.addTodo(this.inputText());
      this.inputText.set(''); // 清空輸入
    }
  }
}
```

```html
<ion-input
  [ngModel]="inputText()"
  (ngModelChange)="inputText.set($event)"
  placeholder="Enter todo">
</ion-input>
```

### 2. 轉換 Signal 和 Observable

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable to Signal
const todos$ = this.http.get<Todo[]>('/api/todos');
const todosSignal = toSignal(todos$, { initialValue: [] });

// Signal to Observable
const todosSignal = signal<Todo[]>([]);
const todos$ = toObservable(todosSignal);
```

### 3. Effect 用於副作用

```typescript
export class TodoService {
  constructor() {
    // 自動保存 (每次 todos 改變)
    effect(() => {
      const todos = this.todosSignal();
      this.saveTodos(todos);
    });

    // 日誌記錄
    effect(() => {
      const filter = this.filterSignal();
      console.log('Filter changed to:', filter);
    });
  }
}
```

### 4. 嵌套 Computed Signals

```typescript
export class TodoService {
  private todos = signal<Todo[]>([]);
  private filter = signal<TodoFilter>('all');

  // 第一層計算
  private filteredTodos = computed(() => {
    const todos = this.todos();
    const filter = this.filter();
    return this.applyFilter(todos, filter);
  });

  // 第二層計算（依賴於第一層）
  public readonly isEmpty = computed(() => {
    return this.filteredTodos().length === 0;
  });

  public readonly hasCompleted = computed(() => {
    return this.filteredTodos().some(t => t.completed);
  });
}
```

## 性能優化

### 1. 使用 asReadonly()

```typescript
// ❌ 不好：直接暴露可寫 signal
public todos = signal<Todo[]>([]);

// ✅ 好：只暴露只讀版本
private todosSignal = signal<Todo[]>([]);
public readonly todos = this.todosSignal.asReadonly();
```

### 2. Computed 自動緩存

```typescript
// computed 會緩存結果，只在依賴改變時重新計算
const expensiveComputed = computed(() => {
  const data = this.data();
  return data.map(item => /* 複雜計算 */);
});

// 多次讀取不會重複計算
const result1 = expensiveComputed();
const result2 = expensiveComputed(); // 使用緩存
```

### 3. 批量更新

```typescript
// ❌ 觸發多次更新
todos.update(list => list.filter(t => !t.completed));
todos.update(list => [...list, newTodo]);
todos.update(list => list.sort());

// ✅ 一次更新
todos.update(list => {
  const filtered = list.filter(t => !t.completed);
  const added = [...filtered, newTodo];
  return added.sort();
});
```

### 4. 配合 OnPush

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  // Signals 自動觸發 OnPush 變更檢測
  protected data = this.service.data;
}
```

## 最佳實踐

### ✅ 推薦做法

```typescript
// 1. 私有可寫，公開只讀
private todosSignal = signal<Todo[]>([]);
public readonly todos = this.todosSignal.asReadonly();

// 2. 使用 computed 派生狀態
public readonly activeCount = computed(() =>
  this.todos().filter(t => !t.completed).length
);

// 3. 使用 update() 而非 set()（處理數組/對象時）
this.todos.update(list => [...list, newItem]);

// 4. 明確的類型定義
private filter = signal<TodoFilter>('all');

// 5. 組件中使用 protected
protected todos = this.todoService.todos;
```

### ❌ 避免做法

```typescript
// 1. 直接修改（不會觸發更新）
this.todos().push(newItem); // ❌

// 2. 在模板中創建 signal
<!-- ❌ 每次渲染都創建新 signal -->
{{ signal(value)() }}

// 3. 不必要的 signal
// 如果值不需要響應式，使用普通變數
private readonly API_URL = 'http://...'; // ✅
private readonly API_URL = signal('http://...'); // ❌

// 4. 忘記調用 signal
const value = mySignal; // ❌ 這是 signal 本身
const value = mySignal(); // ✅ 這是值

// 5. 在 effect 中進行 async 操作
effect(() => {
  // ❌ effect 應該是同步的
  fetch('/api/data').then(...);
});
```

## 常見問題

### Q1: Signals vs BehaviorSubject?

**使用 Signals 當：**
- 簡單的同步狀態管理
- 需要高性能
- 新項目或新代碼

**使用 BehaviorSubject 當：**
- 複雜的異步操作
- 需要豐富的 RxJS operators
- 維護舊代碼

### Q2: 如何調試 Signals?

```typescript
// 在 Chrome DevTools Console
const todoService = ng.getComponent($0).todoService;
console.log(todoService.todos()); // 讀取當前值

// 使用 effect 監聽變化
effect(() => {
  console.log('Todos:', this.todos());
});
```

### Q3: Signals 會替代 RxJS 嗎?

不會。兩者互補：
- **Signals**: 同步狀態管理
- **RxJS**: 異步數據流（HTTP, WebSocket, 複雜操作）

### Q4: 如何處理異步操作?

```typescript
// 方法 1: 在方法中處理
async loadTodos(): Promise<void> {
  this.isLoading.set(true);
  try {
    const todos = await this.http.get<Todo[]>('/api/todos').toPromise();
    this.todos.set(todos);
  } finally {
    this.isLoading.set(false);
  }
}

// 方法 2: 轉換 Observable
const todos$ = this.http.get<Todo[]>('/api/todos');
const todos = toSignal(todos$, { initialValue: [] });
```

### Q5: 何時使用 effect()?

```typescript
// ✅ 適用場景
effect(() => {
  // 日誌記錄
  console.log('Value:', this.value());

  // 本地存儲
  localStorage.setItem('key', JSON.stringify(this.data()));

  // DOM 操作
  document.title = `Todos: ${this.count()}`;
});

// ❌ 避免場景
effect(() => {
  // 不要在 effect 中更新其他 signal（可能造成循環）
  this.otherSignal.set(value);

  // 不要執行異步操作
  fetch('/api/data').then(...);
});
```

## 遷移策略

### 從 BehaviorSubject 遷移到 Signals

```typescript
// Before (RxJS)
private todosSubject = new BehaviorSubject<Todo[]>([]);
public todos$ = this.todosSubject.asObservable();

getTodos(): Todo[] {
  return this.todosSubject.value;
}

setTodos(todos: Todo[]): void {
  this.todosSubject.next(todos);
}

// After (Signals)
private todosSignal = signal<Todo[]>([]);
public readonly todos = this.todosSignal.asReadonly();

getTodos(): Todo[] {
  return this.todosSignal();
}

setTodos(todos: Todo[]): void {
  this.todosSignal.set(todos);
}

// 保持向後兼容
public todos$ = toObservable(this.todosSignal);
```

### 混合使用策略

```typescript
export class HybridService {
  // 新代碼使用 Signals
  private todosSignal = signal<Todo[]>([]);
  public readonly todos = this.todosSignal.asReadonly();

  // 為舊代碼提供 Observable
  public todos$ = toObservable(this.todosSignal);

  // 兩種 API 都可用
  getTodosSignal() {
    return this.todosSignal();
  }

  getTodosObservable() {
    return this.todos$;
  }
}
```

## 總結

### Signals 的優勢

1. **簡單直觀**: 比 RxJS 更容易學習和使用
2. **性能優秀**: 細粒度更新，自動優化變更檢測
3. **類型安全**: 完整的 TypeScript 支持
4. **自動清理**: 無需手動取消訂閱
5. **現代化**: Angular 未來的方向

### 何時使用

- ✅ 組件本地狀態
- ✅ 簡單的全局狀態
- ✅ 計算屬性
- ✅ 同步數據流
- ⚠️ 複雜異步操作（結合 RxJS）
- ⚠️ 需要豐富操作符（使用 RxJS）

### 學習資源

- [官方文檔](https://angular.io/guide/signals)
- [Angular Signals RFC](https://github.com/angular/angular/discussions/49090)
- [YouTube: Angular Signals Explained](https://www.youtube.com/results?search_query=angular+signals)
- [Blog: Angular Signals Deep Dive](https://blog.angular.io/signals)

---

通過本指南，你應該能夠：
- 理解 Signals 的基本概念
- 在實際項目中使用 Signals
- 結合 Signals 和 RxJS
- 遵循最佳實踐
- 從 RxJS 遷移到 Signals
