# Flutter BLoC Todo List

一個使用 **Flutter** 和 **BLoC (Business Logic Component)** 模式構建的待辦事項應用。這個項目展示了如何使用業界廣泛採用的 BLoC 架構模式來管理 Flutter 應用的狀態和業務邏輯。

## 目錄

- [技術架構](#技術架構)
- [BLoC 模式深入解析](#bloc-模式深入解析)
- [狀態管理對比](#狀態管理對比)
- [項目結構](#項目結構)
- [核心概念](#核心概念)
- [數據流分析](#數據流分析)
- [安裝和運行](#安裝和運行)
- [功能特性](#功能特性)
- [代碼詳解](#代碼詳解)
- [測試策略](#測試策略)
- [最佳實踐](#最佳實踐)
- [性能優化](#性能優化)
- [常見問題](#常見問題)
- [進階主題](#進階主題)

---

## 技術架構

### 核心技術棧

```yaml
技術棧:
  框架: Flutter 3.x
  狀態管理: flutter_bloc (^8.1.3)
  值比較: equatable (^2.0.5)
  持久化: shared_preferences (^2.2.2)
  測試: bloc_test (^9.1.5)
  設計: Material Design 3
```

### 架構層次

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Screens, Widgets, UI)           │
├─────────────────────────────────────┤
│         BLoC Layer                  │
│    (Events, States, BLoC)           │
├─────────────────────────────────────┤
│         Data Layer                  │
│    (Models, Repository)             │
├─────────────────────────────────────┤
│         Storage Layer               │
│    (SharedPreferences)              │
└─────────────────────────────────────┘
```

---

## BLoC 模式深入解析

### 什麼是 BLoC？

**BLoC (Business Logic Component)** 是由 Google 開發並推薦的狀態管理模式，旨在將業務邏輯與 UI 完全分離。

#### 核心原則

1. **單一數據流**: 數據只能單向流動
2. **事件驅動**: 所有操作都通過事件觸發
3. **不可變狀態**: 狀態永遠不會被直接修改
4. **可預測性**: 相同的事件總是產生相同的狀態變化
5. **可測試性**: 業務邏輯與 UI 完全分離

### BLoC 三要素

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│  Event   │ ───> │   BLoC   │ ───> │  State   │
└──────────┘      └──────────┘      └──────────┘
     ▲                                     │
     │                                     │
     └─────────────── UI ──────────────────┘
```

#### 1. Event (事件)

事件代表用戶操作或系統事件，描述"發生了什麼"。

```dart
// 定義事件
abstract class TodoEvent extends Equatable {
  const TodoEvent();
}

class AddTodoEvent extends TodoEvent {
  final String title;
  const AddTodoEvent(this.title);

  @override
  List<Object?> get props => [title];
}
```

**特點**:
- 不可變 (immutable)
- 使用 Equatable 進行值比較
- 包含執行操作所需的最少數據
- 命名清晰，描述性強

#### 2. State (狀態)

狀態代表應用在某個時間點的快照，描述"當前是什麼樣子"。

```dart
// 定義狀態
abstract class TodoState extends Equatable {
  const TodoState();
}

class TodoLoaded extends TodoState {
  final List<Todo> todos;
  const TodoLoaded(this.todos);

  @override
  List<Object?> get props => [todos];
}
```

**特點**:
- 不可變 (immutable)
- 使用 Equatable 進行值比較
- 包含 UI 渲染所需的所有數據
- 通過 copyWith 創建新狀態

#### 3. BLoC (業務邏輯組件)

BLoC 接收事件，處理業務邏輯，並發出新的狀態。

```dart
class TodoBloc extends Bloc<TodoEvent, TodoState> {
  TodoBloc() : super(const TodoInitial()) {
    on<AddTodoEvent>(_onAddTodo);
  }

  Future<void> _onAddTodo(
    AddTodoEvent event,
    Emitter<TodoState> emit,
  ) async {
    // 處理業務邏輯
    final newTodo = Todo(title: event.title);
    emit(TodoLoaded([...todos, newTodo]));
  }
}
```

**特點**:
- 繼承自 `Bloc<Event, State>`
- 使用 `on<Event>` 註冊事件處理器
- 通過 `emit` 發出新狀態
- 支持異步操作

### BLoC 生命週期

```
1. UI 觸發操作
   │
   ▼
2. 創建 Event
   │
   ▼
3. 添加到 BLoC (context.read<Bloc>().add(event))
   │
   ▼
4. BLoC 接收 Event
   │
   ▼
5. 執行對應的事件處理器
   │
   ▼
6. 處理業務邏輯
   │
   ▼
7. 發出新的 State (emit(newState))
   │
   ▼
8. BlocBuilder 監聽到狀態變化
   │
   ▼
9. 重建 UI
```

### 為什麼選擇 BLoC？

#### 優勢

1. **官方支持**: Google 官方推薦
2. **完整的生態系統**: flutter_bloc, bloc_test, hydrated_bloc 等
3. **可測試性極強**: 業務邏輯與 UI 完全分離
4. **可預測性**: 單向數據流，易於追蹤
5. **可擴展性**: 適合大型項目
6. **跨平台**: 可用於 Flutter, AngularDart, Web

#### 適用場景

- ✅ 大型、複雜的應用
- ✅ 需要強測試覆蓋的項目
- ✅ 多人協作的團隊項目
- ✅ 需要時間旅行調試的場景
- ✅ 企業級應用

#### 不適用場景

- ❌ 簡單的原型或小型應用（樣板代碼較多）
- ❌ 快速開發需求（學習曲線較陡）
- ❌ 狀態管理需求簡單的場景

---

## 狀態管理對比

### BLoC vs Provider vs Riverpod vs GetX

#### 1. 架構複雜度

```
簡單 ────────────────────────> 複雜
GetX < Provider < Riverpod < BLoC
```

#### 2. 詳細對比表

| 特性 | BLoC | Riverpod | GetX | Provider |
|------|------|----------|------|----------|
| **學習曲線** | 陡峭 | 中等 | 平緩 | 平緩 |
| **樣板代碼** | 多 | 少 | 最少 | 少 |
| **可測試性** | 極強 | 強 | 中等 | 強 |
| **類型安全** | ✅ | ✅ | ⚠️ | ✅ |
| **編譯時檢查** | ✅ | ✅ | ❌ | ⚠️ |
| **官方支持** | ✅ | ❌ | ❌ | ✅ |
| **社區支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **文檔質量** | 優秀 | 優秀 | 良好 | 優秀 |
| **性能** | 優秀 | 優秀 | 優秀 | 良好 |
| **DevTools** | ✅ | ✅ | ✅ | ✅ |
| **適合規模** | 大型 | 中大型 | 中小型 | 中型 |

#### 3. 代碼對比

##### BLoC 實現

```dart
// Event
class AddTodoEvent extends TodoEvent {
  final String title;
  const AddTodoEvent(this.title);
}

// State
class TodoLoaded extends TodoState {
  final List<Todo> todos;
  const TodoLoaded(this.todos);
}

// BLoC
class TodoBloc extends Bloc<TodoEvent, TodoState> {
  TodoBloc() : super(TodoInitial()) {
    on<AddTodoEvent>((event, emit) {
      emit(TodoLoaded([...todos, Todo(title: event.title)]));
    });
  }
}

// UI
BlocBuilder<TodoBloc, TodoState>(
  builder: (context, state) {
    if (state is TodoLoaded) {
      return ListView(children: state.todos);
    }
  },
)

// 觸發事件
context.read<TodoBloc>().add(AddTodoEvent(title));
```

##### Riverpod 實現

```dart
// Provider
final todosProvider = StateNotifierProvider<TodosNotifier, List<Todo>>((ref) {
  return TodosNotifier();
});

// Notifier
class TodosNotifier extends StateNotifier<List<Todo>> {
  TodosNotifier() : super([]);

  void addTodo(String title) {
    state = [...state, Todo(title: title)];
  }
}

// UI
Consumer(
  builder: (context, ref, child) {
    final todos = ref.watch(todosProvider);
    return ListView(children: todos);
  },
)

// 觸發
ref.read(todosProvider.notifier).addTodo(title);
```

##### GetX 實現

```dart
// Controller
class TodoController extends GetxController {
  final todos = <Todo>[].obs;

  void addTodo(String title) {
    todos.add(Todo(title: title));
  }
}

// UI
Obx(() {
  final todos = controller.todos;
  return ListView(children: todos);
})

// 觸發
Get.find<TodoController>().addTodo(title);
```

##### Provider 實現

```dart
// ChangeNotifier
class TodoProvider extends ChangeNotifier {
  List<Todo> _todos = [];
  List<Todo> get todos => _todos;

  void addTodo(String title) {
    _todos.add(Todo(title: title));
    notifyListeners();
  }
}

// UI
Consumer<TodoProvider>(
  builder: (context, provider, child) {
    return ListView(children: provider.todos);
  },
)

// 觸發
context.read<TodoProvider>().addTodo(title);
```

#### 4. 選擇建議

```
項目類型          推薦方案
────────────────────────────
企業級大型項目    → BLoC
中大型團隊項目    → Riverpod 或 BLoC
快速原型開發      → GetX
教學和學習        → Provider
個人小項目        → GetX 或 Riverpod
```

---

## 項目結構

### 目錄樹

```
lib/
├── main.dart                  # 應用入口
├── bloc/                      # BLoC 層
│   ├── todo_bloc.dart        # BLoC 核心邏輯
│   ├── todo_event.dart       # 事件定義
│   └── todo_state.dart       # 狀態定義
├── models/                    # 數據模型
│   └── todo.dart             # Todo 模型
├── screens/                   # 頁面
│   └── todo_list_screen.dart # 主頁面
└── widgets/                   # UI 組件
    ├── todo_input.dart       # 輸入對話框
    ├── todo_item.dart        # 單個 Todo 項
    └── todo_list.dart        # Todo 列表
```

### 架構分層

```
┌─────────────────────────────────────────┐
│  UI Layer (Screens & Widgets)           │
│  - todo_list_screen.dart                │
│  - todo_input.dart                      │
│  - todo_item.dart                       │
│  - todo_list.dart                       │
├─────────────────────────────────────────┤
│  BLoC Layer                             │
│  - todo_bloc.dart    (Business Logic)   │
│  - todo_event.dart   (User Actions)     │
│  - todo_state.dart   (App State)        │
├─────────────────────────────────────────┤
│  Domain Layer                           │
│  - todo.dart         (Data Model)       │
├─────────────────────────────────────────┤
│  Data Layer                             │
│  - SharedPreferences (Persistence)      │
└─────────────────────────────────────────┘
```

---

## 核心概念

### 1. Equatable 的重要性

BLoC 模式高度依賴 Equatable 來進行狀態比較。

#### 為什麼需要 Equatable？

```dart
// 沒有 Equatable
class Todo {
  final String id;
  final String title;

  Todo(this.id, this.title);
}

var todo1 = Todo('1', 'Learn Flutter');
var todo2 = Todo('1', 'Learn Flutter');

print(todo1 == todo2); // false (比較引用)

// 使用 Equatable
class Todo extends Equatable {
  final String id;
  final String title;

  Todo(this.id, this.title);

  @override
  List<Object?> get props => [id, title];
}

var todo1 = Todo('1', 'Learn Flutter');
var todo2 = Todo('1', 'Learn Flutter');

print(todo1 == todo2); // true (比較值)
```

#### Equatable 的好處

1. **自動值比較**: 不需要手動實現 `==` 和 `hashCode`
2. **狀態去重**: BLoC 會自動過濾相同的狀態
3. **性能優化**: 避免不必要的 UI 重建
4. **調試友好**: 提供更好的 toString() 輸出

### 2. 不可變性 (Immutability)

BLoC 模式要求所有的 Event 和 State 都是不可變的。

#### 為什麼需要不可變性？

```dart
// ❌ 錯誤：直接修改狀態
void _onAddTodo(AddTodoEvent event, Emitter<TodoState> emit) {
  final currentState = state as TodoLoaded;
  currentState.todos.add(newTodo); // 錯誤！
  emit(currentState); // 不會觸發更新
}

// ✅ 正確：創建新狀態
void _onAddTodo(AddTodoEvent event, Emitter<TodoState> emit) {
  final currentState = state as TodoLoaded;
  final updatedTodos = [...currentState.todos, newTodo];
  emit(TodoLoaded(updatedTodos)); // 觸發更新
}
```

#### 不可變性的好處

1. **可預測性**: 狀態不會被意外修改
2. **時間旅行**: 可以保存歷史狀態
3. **調試**: 易於追蹤狀態變化
4. **並發安全**: 避免競態條件

### 3. BlocProvider

BlocProvider 負責創建和提供 BLoC 實例。

```dart
// 單個 BLoC
BlocProvider(
  create: (context) => TodoBloc()..add(LoadTodosEvent()),
  child: TodoListScreen(),
)

// 多個 BLoC
MultiBlocProvider(
  providers: [
    BlocProvider<TodoBloc>(
      create: (context) => TodoBloc(),
    ),
    BlocProvider<AuthBloc>(
      create: (context) => AuthBloc(),
    ),
  ],
  child: MyApp(),
)
```

#### Provider 的作用域

```dart
// 全局作用域（整個應用）
void main() {
  runApp(
    BlocProvider(
      create: (_) => TodoBloc(),
      child: MyApp(),
    ),
  );
}

// 局部作用域（特定頁面）
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (_) => BlocProvider.value(
      value: context.read<TodoBloc>(),
      child: DetailsScreen(),
    ),
  ),
);
```

### 4. BlocBuilder

BlocBuilder 監聽狀態變化並重建 UI。

```dart
BlocBuilder<TodoBloc, TodoState>(
  builder: (context, state) {
    if (state is TodoLoading) {
      return CircularProgressIndicator();
    }

    if (state is TodoLoaded) {
      return ListView(children: state.todos);
    }

    if (state is TodoError) {
      return Text(state.message);
    }

    return SizedBox.shrink();
  },
)
```

#### 性能優化：buildWhen

```dart
BlocBuilder<TodoBloc, TodoState>(
  buildWhen: (previous, current) {
    // 只在特定條件下重建
    return current is TodoLoaded &&
           previous is TodoLoaded &&
           current.todos.length != previous.todos.length;
  },
  builder: (context, state) {
    // ...
  },
)
```

### 5. BlocListener

BlocListener 監聽狀態變化並執行副作用（如導航、顯示 SnackBar）。

```dart
BlocListener<TodoBloc, TodoState>(
  listener: (context, state) {
    if (state is TodoError) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.message)),
      );
    }
  },
  child: Container(),
)
```

### 6. BlocConsumer

BlocConsumer 結合了 BlocBuilder 和 BlocListener。

```dart
BlocConsumer<TodoBloc, TodoState>(
  listener: (context, state) {
    // 副作用
    if (state is TodoError) {
      showDialog(...);
    }
  },
  builder: (context, state) {
    // 構建 UI
    return ListView(...);
  },
)
```

---

## 數據流分析

### 完整數據流程圖

```
用戶操作：點擊添加按鈕
    │
    ▼
┌─────────────────────────┐
│  UI: TodoInput Widget   │
│  - 獲取用戶輸入         │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  創建 Event             │
│  AddTodoEvent(title)    │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  發送到 BLoC            │
│  bloc.add(event)        │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  TodoBloc 接收 Event    │
│  on<AddTodoEvent>       │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  執行業務邏輯           │
│  - 創建新 Todo          │
│  - 添加到列表           │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  保存到 Storage         │
│  SharedPreferences      │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  發出新 State           │
│  emit(TodoLoaded(...))  │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  BlocBuilder 監聽       │
│  builder(context, state)│
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  重建 UI                │
│  - 顯示新的 Todo        │
└─────────────────────────┘
```

### 添加 Todo 的詳細流程

```dart
// 1. UI 觸發
onPressed: () {
  context.read<TodoBloc>().add(AddTodoEvent('Learn BLoC'));
}

// 2. BLoC 接收
on<AddTodoEvent>((event, emit) async {
  // 3. 獲取當前狀態
  final currentState = state as TodoLoaded;

  // 4. 創建新 Todo
  final newTodo = Todo(
    id: DateTime.now().toString(),
    title: event.title,
  );

  // 5. 創建新狀態
  final updatedTodos = [...currentState.todos, newTodo];

  // 6. 發出新狀態
  emit(TodoLoaded(updatedTodos));

  // 7. 保存到持久化存儲
  await _saveTodos(updatedTodos);
});

// 8. UI 重建
BlocBuilder<TodoBloc, TodoState>(
  builder: (context, state) {
    if (state is TodoLoaded) {
      return ListView(
        children: state.todos.map((todo) => TodoItem(todo)).toList(),
      );
    }
  },
)
```

---

## 安裝和運行

### 前置要求

- Flutter SDK 3.0.0 或更高版本
- Dart SDK 3.0.0 或更高版本
- Android Studio / VS Code
- iOS 模擬器 (Mac) 或 Android 模擬器

### 步驟 1: 克隆項目

```bash
cd 06-mobile-crossplatform/06-flutter-bloc
```

### 步驟 2: 安裝依賴

```bash
flutter pub get
```

### 步驟 3: 運行應用

```bash
# 檢查可用設備
flutter devices

# 運行在特定設備
flutter run -d <device_id>

# 運行在 Chrome (Web)
flutter run -d chrome

# 運行在 Android
flutter run -d android

# 運行在 iOS
flutter run -d ios
```

### 步驟 4: 構建應用

```bash
# Android APK
flutter build apk

# Android App Bundle
flutter build appbundle

# iOS
flutter build ios

# Web
flutter build web
```

### 常用命令

```bash
# 清理構建緩存
flutter clean

# 檢查項目問題
flutter doctor

# 分析代碼
flutter analyze

# 格式化代碼
flutter format lib/

# 運行測試
flutter test

# 查看依賴樹
flutter pub deps
```

---

## 功能特性

### 已實現功能

#### 1. 待辦事項管理
- ✅ 添加新的待辦事項
- ✅ 標記為已完成/未完成
- ✅ 刪除待辦事項（滑動刪除）
- ✅ 顯示創建時間

#### 2. 數據持久化
- ✅ SharedPreferences 本地存儲
- ✅ 自動保存
- ✅ 啟動時自動載入

#### 3. UI/UX
- ✅ Material Design 3
- ✅ 漸變背景
- ✅ 流暢動畫
- ✅ 響應式設計
- ✅ 空狀態提示
- ✅ 進度條顯示

#### 4. 狀態管理
- ✅ BLoC 模式
- ✅ 單向數據流
- ✅ 不可變狀態
- ✅ 事件驅動

### 可擴展功能

#### 優先級管理
```dart
class Todo extends Equatable {
  final String id;
  final String title;
  final bool completed;
  final Priority priority; // 新增

  // ...
}

enum Priority { low, medium, high }
```

#### 分類標籤
```dart
class Todo extends Equatable {
  final String id;
  final String title;
  final List<String> tags; // 新增

  // ...
}
```

#### 截止日期
```dart
class Todo extends Equatable {
  final String id;
  final String title;
  final DateTime? dueDate; // 新增

  // ...
}
```

#### 搜索和過濾
```dart
class SearchTodosEvent extends TodoEvent {
  final String query;
  const SearchTodosEvent(this.query);
}

class FilterTodosEvent extends TodoEvent {
  final TodoFilter filter;
  const FilterTodosEvent(this.filter);
}

enum TodoFilter { all, active, completed }
```

---

## 代碼詳解

### 1. Todo 模型

```dart
class Todo extends Equatable {
  final String id;
  final String title;
  final bool completed;
  final DateTime createdAt;

  const Todo({
    required this.id,
    required this.title,
    this.completed = false,
    required this.createdAt,
  });

  // JSON 序列化
  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      id: json['id'] as String,
      title: json['title'] as String,
      completed: json['completed'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'completed': completed,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  // 創建副本
  Todo copyWith({
    String? id,
    String? title,
    bool? completed,
    DateTime? createdAt,
  }) {
    return Todo(
      id: id ?? this.id,
      title: title ?? this.title,
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  // Equatable 實現
  @override
  List<Object?> get props => [id, title, completed, createdAt];
}
```

**關鍵點**:
- `Equatable`: 用於值比較
- `copyWith`: 創建修改後的副本（不可變性）
- `toJson/fromJson`: 序列化支持
- `const` 構造函數: 編譯時常量優化

### 2. TodoBloc 實現

```dart
class TodoBloc extends Bloc<TodoEvent, TodoState> {
  static const String _storageKey = 'flutter_bloc_todos';

  TodoBloc() : super(const TodoInitial()) {
    on<LoadTodosEvent>(_onLoadTodos);
    on<AddTodoEvent>(_onAddTodo);
    on<ToggleTodoEvent>(_onToggleTodo);
    on<DeleteTodoEvent>(_onDeleteTodo);
  }

  Future<void> _onAddTodo(
    AddTodoEvent event,
    Emitter<TodoState> emit,
  ) async {
    if (state is! TodoLoaded) return;

    final currentState = state as TodoLoaded;
    final newTodo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: event.title.trim(),
      createdAt: DateTime.now(),
    );

    final updatedTodos = List<Todo>.from(currentState.todos)..add(newTodo);
    emit(TodoLoaded(updatedTodos));

    await _saveTodos(updatedTodos);
  }

  Future<void> _saveTodos(List<Todo> todos) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final todosJson = jsonEncode(
        todos.map((todo) => todo.toJson()).toList(),
      );
      await prefs.setString(_storageKey, todosJson);
    } catch (e) {
      print('保存失敗: $e');
    }
  }
}
```

**關鍵點**:
- 事件處理器註冊: `on<Event>(_handler)`
- 狀態類型檢查: `if (state is! TodoLoaded) return`
- 不可變更新: `List<Todo>.from(...).add(...)`
- 異步操作: `async/await`
- 錯誤處理: `try-catch`

### 3. UI 與 BLoC 交互

```dart
class TodoListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<TodoBloc, TodoState>(
        builder: (context, state) {
          // 載入中
          if (state is TodoLoading) {
            return Center(child: CircularProgressIndicator());
          }

          // 錯誤
          if (state is TodoError) {
            return Center(child: Text(state.message));
          }

          // 已載入
          if (state is TodoLoaded) {
            return TodoList(todos: state.todos);
          }

          return SizedBox.shrink();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (dialogContext) {
              // 重要：傳遞 BLoC 到對話框
              return BlocProvider.value(
                value: context.read<TodoBloc>(),
                child: TodoInput(),
              );
            },
          );
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
```

**關鍵點**:
- `BlocBuilder`: 監聽狀態變化
- 狀態類型判斷: `if (state is TodoLoaded)`
- `context.read<TodoBloc>()`: 獲取 BLoC 實例
- `BlocProvider.value`: 傳遞現有 BLoC 實例

---

## 測試策略

### 測試金字塔

```
        ┌────────┐
        │   E2E  │  10%
        ├────────┤
        │ Widget │  20%
        ├────────┤
        │  Unit  │  70%
        └────────┘
```

### 1. 單元測試 (BLoC)

BLoC 的單元測試非常簡單，因為它與 UI 完全分離。

```dart
import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('TodoBloc', () {
    late TodoBloc todoBloc;

    setUp(() {
      todoBloc = TodoBloc();
    });

    tearDown(() {
      todoBloc.close();
    });

    test('初始狀態應該是 TodoInitial', () {
      expect(todoBloc.state, const TodoInitial());
    });

    blocTest<TodoBloc, TodoState>(
      '載入事件應該發出 TodoLoading 然後 TodoLoaded',
      build: () => todoBloc,
      act: (bloc) => bloc.add(const LoadTodosEvent()),
      expect: () => [
        const TodoLoading(),
        const TodoLoaded([]),
      ],
    );

    blocTest<TodoBloc, TodoState>(
      '添加 Todo 應該發出包含新 Todo 的 TodoLoaded',
      build: () => todoBloc,
      seed: () => const TodoLoaded([]),
      act: (bloc) => bloc.add(const AddTodoEvent('Test Todo')),
      expect: () => [
        isA<TodoLoaded>()
            .having((s) => s.todos.length, 'todos length', 1)
            .having((s) => s.todos.first.title, 'first todo title', 'Test Todo'),
      ],
    );

    blocTest<TodoBloc, TodoState>(
      '切換 Todo 應該更新 completed 狀態',
      build: () => todoBloc,
      seed: () => TodoLoaded([
        Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: DateTime.now(),
        ),
      ]),
      act: (bloc) => bloc.add(const ToggleTodoEvent('1')),
      expect: () => [
        isA<TodoLoaded>()
            .having((s) => s.todos.first.completed, 'completed', true),
      ],
    );

    blocTest<TodoBloc, TodoState>(
      '刪除 Todo 應該從列表中移除',
      build: () => todoBloc,
      seed: () => TodoLoaded([
        Todo(
          id: '1',
          title: 'Test',
          completed: false,
          createdAt: DateTime.now(),
        ),
      ]),
      act: (bloc) => bloc.add(const DeleteTodoEvent('1')),
      expect: () => [
        isA<TodoLoaded>().having((s) => s.todos.length, 'length', 0),
      ],
    );
  });
}
```

### 2. Widget 測試

```dart
void main() {
  group('TodoListScreen', () {
    late TodoBloc todoBloc;

    setUp(() {
      todoBloc = TodoBloc();
    });

    tearDown(() {
      todoBloc.close();
    });

    testWidgets('顯示空狀態', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc..add(const LoadTodosEvent()),
            child: const TodoListScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('沒有待辦事項'), findsOneWidget);
    });

    testWidgets('添加 Todo 並顯示', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: BlocProvider.value(
            value: todoBloc..add(const LoadTodosEvent()),
            child: const TodoListScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // 點擊 FAB
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();

      // 輸入文本
      await tester.enterText(find.byType(TextField), 'Test Todo');
      await tester.tap(find.text('添加'));
      await tester.pumpAndSettle();

      // 驗證 Todo 出現
      expect(find.text('Test Todo'), findsOneWidget);
    });
  });
}
```

### 3. 集成測試

```dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('完整的 Todo 流程', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    // 1. 添加 Todo
    await tester.tap(find.byType(FloatingActionButton));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField), 'Integration Test');
    await tester.tap(find.text('添加'));
    await tester.pumpAndSettle();

    // 2. 驗證添加成功
    expect(find.text('Integration Test'), findsOneWidget);

    // 3. 切換完成狀態
    await tester.tap(find.byType(Checkbox).first);
    await tester.pumpAndSettle();

    // 4. 驗證狀態改變
    final checkbox = tester.widget<Checkbox>(find.byType(Checkbox).first);
    expect(checkbox.value, true);

    // 5. 滑動刪除
    await tester.drag(find.text('Integration Test'), const Offset(-500, 0));
    await tester.pumpAndSettle();

    // 6. 驗證刪除成功
    expect(find.text('Integration Test'), findsNothing);
  });
}
```

### 運行測試

#### 基本測試命令

```bash
# 運行所有測試
flutter test

# 運行特定測試文件
flutter test test/bloc/todo_bloc_test.dart

# 運行特定測試套件
flutter test test/models/
flutter test test/widgets/

# 以詳細模式運行測試
flutter test --reporter expanded
```

#### 測試覆蓋率

```bash
# 方法 1: 使用自動化腳本（推薦）
./test_coverage.sh

# 方法 2: 手動運行
# 1. 運行測試並生成覆蓋率
flutter test --coverage

# 2. 生成 HTML 報告（需要安裝 lcov）
genhtml coverage/lcov.info -o coverage/html --no-function-coverage

# 3. 查看報告
open coverage/html/index.html  # macOS
xdg-open coverage/html/index.html  # Linux
start coverage/html/index.html  # Windows
```

#### 安裝 lcov

```bash
# macOS
brew install lcov

# Ubuntu/Debian
sudo apt-get install lcov

# Fedora
sudo dnf install lcov
```

#### 測試結構

```
test/
├── bloc/
│   └── todo_bloc_test.dart      # BLoC 單元測試
├── models/
│   └── todo_test.dart            # 數據模型測試
└── widgets/
    └── widget_test.dart          # UI 組件測試
```

#### 測試覆蓋範圍

我們的測試套件涵蓋：

1. **BLoC 測試** (test/bloc/todo_bloc_test.dart)
   - 初始狀態測試
   - LoadTodosEvent: 載入、空數據、錯誤處理
   - AddTodoEvent: 添加、修剪空白、多個 todo
   - ToggleTodoEvent: 切換狀態、多個 todo
   - DeleteTodoEvent: 刪除、不存在的 todo
   - ClearCompletedEvent: 清除已完成
   - 持久化測試

2. **模型測試** (test/models/todo_test.dart)
   - 構造函數測試
   - JSON 序列化/反序列化
   - copyWith 功能
   - Equatable 相等性測試
   - JSON 往返測試

3. **Widget 測試** (test/widgets/widget_test.dart)
   - TodoListScreen: UI 渲染、狀態顯示、統計
   - TodoItem: 顯示、交互、刪除
   - TodoList: 空狀態、列表渲染
   - 時間格式化測試

#### 測試最佳實踐

```dart
// 1. 使用 setUp 和 tearDown
setUp(() {
  SharedPreferences.setMockInitialValues({});
  todoBloc = TodoBloc();
});

tearDown(() {
  todoBloc.close();
});

// 2. 使用 blocTest 測試 BLoC
blocTest<TodoBloc, TodoState>(
  '描述測試的行為',
  build: () => TodoBloc(),
  act: (bloc) => bloc.add(SomeEvent()),
  expect: () => [ExpectedState()],
);

// 3. 使用 testWidgets 測試 UI
testWidgets('描述 UI 行為', (WidgetTester tester) async {
  await tester.pumpWidget(MyWidget());
  expect(find.text('Expected Text'), findsOneWidget);
});
```

#### 持續集成配置

在 CI/CD 流程中運行測試：

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter test --coverage
      - uses: codecov/codecov-action@v2
```

---

## 最佳實踐

### 1. BLoC 設計原則

#### 單一職責
```dart
// ✅ 好：每個 BLoC 只負責一個領域
class TodoBloc extends Bloc<TodoEvent, TodoState> {}
class AuthBloc extends Bloc<AuthEvent, AuthState> {}

// ❌ 壞：一個 BLoC 負責多個領域
class AppBloc extends Bloc<AppEvent, AppState> {} // 包含 Todo 和 Auth
```

#### 命名規範
```dart
// Event: 使用動詞 + 名詞 + Event
class AddTodoEvent extends TodoEvent {}
class DeleteTodoEvent extends TodoEvent {}

// State: 使用形容詞/過去分詞 + 名詞 + State
class TodoLoading extends TodoState {}
class TodoLoaded extends TodoState {}
class TodoError extends TodoState {}

// BLoC: 使用名詞 + Bloc
class TodoBloc extends Bloc<TodoEvent, TodoState> {}
```

### 2. 狀態管理

#### 使用密封類
```dart
@immutable
abstract class TodoState extends Equatable {
  const TodoState();
}

class TodoInitial extends TodoState {
  const TodoInitial();
  @override
  List<Object?> get props => [];
}

class TodoLoaded extends TodoState {
  final List<Todo> todos;
  const TodoLoaded(this.todos);
  @override
  List<Object?> get props => [todos];
}
```

#### 避免可選狀態
```dart
// ❌ 壞
class TodoState {
  final List<Todo>? todos;
  final bool isLoading;
  final String? error;
}

// ✅ 好
abstract class TodoState {}
class TodoLoading extends TodoState {}
class TodoLoaded extends TodoState {
  final List<Todo> todos;
}
class TodoError extends TodoState {
  final String message;
}
```

### 3. 性能優化

#### 使用 buildWhen 減少重建
```dart
BlocBuilder<TodoBloc, TodoState>(
  buildWhen: (previous, current) {
    // 只在 todos 數量變化時重建
    return previous is TodoLoaded &&
           current is TodoLoaded &&
           previous.todos.length != current.todos.length;
  },
  builder: (context, state) {
    // ...
  },
)
```

#### 使用 listenWhen 減少監聽
```dart
BlocListener<TodoBloc, TodoState>(
  listenWhen: (previous, current) {
    // 只在出現錯誤時監聽
    return current is TodoError;
  },
  listener: (context, state) {
    // ...
  },
  child: Container(),
)
```

#### 使用 const 構造函數
```dart
// ✅ 好
const TodoLoaded([]);

// ❌ 壞
TodoLoaded([]);
```

### 4. 錯誤處理

```dart
Future<void> _onLoadTodos(
  LoadTodosEvent event,
  Emitter<TodoState> emit,
) async {
  try {
    emit(const TodoLoading());
    final todos = await _repository.loadTodos();
    emit(TodoLoaded(todos));
  } on NetworkException catch (e) {
    emit(TodoError('網絡錯誤: ${e.message}'));
  } on StorageException catch (e) {
    emit(TodoError('存儲錯誤: ${e.message}'));
  } catch (e) {
    emit(TodoError('未知錯誤: $e'));
  }
}
```

### 5. 依賴注入

使用 Repository 模式分離數據層：

```dart
class TodoRepository {
  Future<List<Todo>> loadTodos() async {
    final prefs = await SharedPreferences.getInstance();
    // ...
  }

  Future<void> saveTodos(List<Todo> todos) async {
    final prefs = await SharedPreferences.getInstance();
    // ...
  }
}

class TodoBloc extends Bloc<TodoEvent, TodoState> {
  final TodoRepository _repository;

  TodoBloc(this._repository) : super(const TodoInitial()) {
    on<LoadTodosEvent>(_onLoadTodos);
  }

  Future<void> _onLoadTodos(
    LoadTodosEvent event,
    Emitter<TodoState> emit,
  ) async {
    final todos = await _repository.loadTodos();
    emit(TodoLoaded(todos));
  }
}
```

---

## 性能優化

### 1. Equatable 優化

```dart
// ✅ 只包含必要的屬性
@override
List<Object?> get props => [id, title, completed];

// ❌ 包含所有屬性（可能影響性能）
@override
List<Object?> get props => [id, title, completed, createdAt, updatedAt, metadata];
```

### 2. ListView 優化

```dart
// ✅ 使用 ListView.builder（懶加載）
ListView.builder(
  itemCount: todos.length,
  itemBuilder: (context, index) => TodoItem(todo: todos[index]),
)

// ❌ 使用 ListView（一次性渲染所有項）
ListView(
  children: todos.map((todo) => TodoItem(todo: todo)).toList(),
)
```

### 3. 分離 BLoC 邏輯

```dart
// ✅ 將複雜邏輯分離到單獨的方法
Future<void> _onAddTodo(AddTodoEvent event, Emitter emit) async {
  final newTodo = _createTodo(event.title);
  final updatedTodos = _addTodoToList(newTodo);
  emit(TodoLoaded(updatedTodos));
  await _saveTodos(updatedTodos);
}

// ❌ 所有邏輯都在事件處理器中
Future<void> _onAddTodo(AddTodoEvent event, Emitter emit) async {
  // 100 行代碼...
}
```

---

## 常見問題

### Q1: 如何在多個頁面共享 BLoC？

**A**: 使用 `BlocProvider.value`

```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (_) => BlocProvider.value(
      value: context.read<TodoBloc>(),
      child: DetailsScreen(),
    ),
  ),
);
```

### Q2: 如何處理 BLoC 之間的通信？

**A**: 使用 BLoC-to-BLoC 通信

```dart
class TodoBloc extends Bloc<TodoEvent, TodoState> {
  final AuthBloc _authBloc;
  late final StreamSubscription _authSubscription;

  TodoBloc(this._authBloc) : super(const TodoInitial()) {
    _authSubscription = _authBloc.stream.listen((authState) {
      if (authState is AuthLoggedOut) {
        add(const ClearTodosEvent());
      }
    });
  }

  @override
  Future<void> close() {
    _authSubscription.cancel();
    return super.close();
  }
}
```

### Q3: 如何調試 BLoC？

**A**: 使用 BlocObserver

```dart
class SimpleBlocObserver extends BlocObserver {
  @override
  void onEvent(Bloc bloc, Object? event) {
    super.onEvent(bloc, event);
    print('Event: $event');
  }

  @override
  void onTransition(Bloc bloc, Transition transition) {
    super.onTransition(bloc, transition);
    print('Transition: $transition');
  }

  @override
  void onError(BlocBase bloc, Object error, StackTrace stackTrace) {
    print('Error: $error');
    super.onError(bloc, error, stackTrace);
  }
}

void main() {
  Bloc.observer = SimpleBlocObserver();
  runApp(MyApp());
}
```

### Q4: 如何持久化 BLoC 狀態？

**A**: 使用 HydratedBloc

```yaml
dependencies:
  hydrated_bloc: ^9.1.2
```

```dart
class TodoBloc extends HydratedBloc<TodoEvent, TodoState> {
  TodoBloc() : super(const TodoInitial());

  @override
  TodoState? fromJson(Map<String, dynamic> json) {
    try {
      final todos = (json['todos'] as List)
          .map((e) => Todo.fromJson(e))
          .toList();
      return TodoLoaded(todos);
    } catch (_) {
      return null;
    }
  }

  @override
  Map<String, dynamic>? toJson(TodoState state) {
    if (state is TodoLoaded) {
      return {
        'todos': state.todos.map((e) => e.toJson()).toList(),
      };
    }
    return null;
  }
}
```

---

## 進階主題

### 1. 時間旅行調試

使用 `replay_bloc` 實現時間旅行：

```yaml
dependencies:
  replay_bloc: ^0.2.4
```

```dart
class TodoBloc extends ReplayBloc<TodoEvent, TodoState> {
  TodoBloc() : super(const TodoInitial());

  // 撤銷
  void undo() => this.undo();

  // 重做
  void redo() => this.redo();
}
```

### 2. 中間件模式

```dart
class LoggingMiddleware<E, S> {
  void call(E event, Emitter<S> emit) {
    print('Event: $event');
    // 處理事件
  }
}

class TodoBloc extends Bloc<TodoEvent, TodoState> {
  TodoBloc() : super(const TodoInitial()) {
    on<AddTodoEvent>(
      _onAddTodo,
      transformer: (events, mapper) => events.debounceTime(
        const Duration(milliseconds: 300),
      ).flatMap(mapper),
    );
  }
}
```

### 3. 並發處理

```dart
on<SearchTodosEvent>(
  _onSearchTodos,
  transformer: restartable(), // 取消之前的搜索
);

on<LoadTodosEvent>(
  _onLoadTodos,
  transformer: sequential(), // 順序執行
);

on<AddTodoEvent>(
  _onAddTodo,
  transformer: concurrent(), // 並發執行
);
```

---

## 總結

Flutter BLoC 是一個功能強大、架構清晰的狀態管理解決方案。它的主要優勢包括：

1. **可測試性**: 業務邏輯與 UI 完全分離
2. **可預測性**: 單向數據流，易於追蹤
3. **可擴展性**: 適合大型、複雜的應用
4. **官方支持**: Google 推薦，社區活躍

雖然學習曲線較陡，但一旦掌握，BLoC 將成為構建大型 Flutter 應用的強大工具。

## 參考資源

- [BLoC 官方文檔](https://bloclibrary.dev/)
- [Flutter 官方文檔](https://flutter.dev/docs)
- [Equatable 文檔](https://pub.dev/packages/equatable)
- [BLoC 測試](https://pub.dev/packages/bloc_test)
- [BLoC 示例](https://github.com/felangel/bloc/tree/master/examples)

---

**License**: MIT
**作者**: Flutter BLoC Todo Team
**版本**: 1.0.0
