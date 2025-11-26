# Flutter Provider Todo - 快速開始指南

## 🚀 5 分鐘快速上手

### 1. 安裝依賴

```bash
cd 06-mobile-crossplatform/07-flutter-provider
flutter pub get
```

### 2. 運行應用

```bash
# iOS
flutter run -d ios

# Android
flutter run -d android

# Web
flutter run -d chrome
```

### 3. 核心概念速覽

#### Provider 架構圖

```
┌─────────────────────────────────────┐
│         ChangeNotifierProvider       │
│      (在 main.dart 中設置)           │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│          TodoProvider               │
│   extends ChangeNotifier            │
│                                     │
│   - _todos: List<Todo>              │
│   - addTodo()                       │
│   - toggleTodo()                    │
│   - notifyListeners()               │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│           UI Widgets                │
│                                     │
│   - Consumer<TodoProvider>          │
│   - context.read<TodoProvider>()    │
│   - context.watch<TodoProvider>()   │
└─────────────────────────────────────┘
```

## 📝 主要文件說明

### 1. `main.dart` - 入口文件

```dart
// Provider 設置
ChangeNotifierProvider(
  create: (context) => TodoProvider(),
  child: MaterialApp(...)
)
```

**關鍵點：**
- 使用 `ChangeNotifierProvider` 提供 TodoProvider
- 自動管理 Provider 生命週期
- 所有子 Widget 都可以訪問 TodoProvider

### 2. `providers/todo_provider.dart` - 狀態管理

```dart
class TodoProvider extends ChangeNotifier {
  List<Todo> _todos = [];

  void addTodo(String title) {
    _todos.add(Todo(...));
    notifyListeners(); // 🔔 觸發 UI 更新
  }
}
```

**關鍵點：**
- 繼承 `ChangeNotifier`
- 修改狀態後調用 `notifyListeners()`
- 使用 SharedPreferences 持久化數據

### 3. `widgets/todo_list.dart` - 消費 Provider

```dart
// 方式1: Consumer（推薦用於局部重建）
Consumer<TodoProvider>(
  builder: (context, provider, child) {
    return ListView(children: [...]);
  },
)

// 方式2: context.watch()（簡單場景）
final provider = context.watch<TodoProvider>();

// 方式3: context.read()（一次性操作）
context.read<TodoProvider>().addTodo(title);
```

## 🎯 核心功能實現

### 添加 Todo

```dart
// 1. 在 Widget 中調用
ElevatedButton(
  onPressed: () {
    context.read<TodoProvider>().addTodo('New Todo');
  },
)

// 2. Provider 處理
class TodoProvider extends ChangeNotifier {
  Future<void> addTodo(String title) async {
    _todos.add(Todo(...));
    notifyListeners(); // 觸發重建
    await _saveTodos(); // 持久化
  }
}

// 3. Consumer 自動更新 UI
Consumer<TodoProvider>(
  builder: (context, provider, _) {
    return ListView(
      children: provider.todos.map(...).toList(),
    );
  },
)
```

### 切換完成狀態

```dart
// 1. 點擊事件
InkWell(
  onTap: () => context.read<TodoProvider>().toggleTodo(todo.id),
)

// 2. Provider 處理
Future<void> toggleTodo(String id) async {
  final index = _todos.indexWhere((t) => t.id == id);
  _todos[index] = _todos[index].copyWith(
    completed: !_todos[index].completed,
  );
  notifyListeners();
  await _saveTodos();
}
```

## 🔍 Provider 使用指南

### 何時使用 Consumer？

```dart
// ✅ 需要響應狀態變化並重建 UI
Consumer<TodoProvider>(
  builder: (context, provider, child) {
    return Text('Count: ${provider.totalCount}');
  },
)
```

### 何時使用 context.read()？

```dart
// ✅ 一次性操作，不需要監聽變化
ElevatedButton(
  onPressed: () {
    context.read<TodoProvider>().clearAll();
  },
)
```

### 何時使用 context.watch()？

```dart
// ✅ 在 build 方法中獲取狀態
Widget build(BuildContext context) {
  final count = context.watch<TodoProvider>().totalCount;
  return Text('$count');
}
```

### 何時使用 Selector？

```dart
// ✅ 只關心特定值的變化
Selector<TodoProvider, int>(
  selector: (_, provider) => provider.activeCount,
  builder: (context, activeCount, _) {
    return Text('Active: $activeCount');
  },
)
```

## 🎨 UI 組件結構

```
TodoListScreen
├── Header (漸變背景)
│   ├── 應用標題
│   ├── 技術標籤 (Flutter + Provider)
│   └── 統計摘要 (Consumer)
├── TodoList (Consumer)
│   ├── 篩選標籤 (全部/活動中/已完成)
│   ├── ListView.builder
│   │   └── TodoItem (可滑動刪除)
│   └── StatsBar (Selector)
└── TodoInput (底部浮動)
    ├── TextField
    └── 添加按鈕
```

## ⚡ 性能優化技巧

### 1. 使用 Selector 精確重建

```dart
// ❌ 過度重建
Consumer<TodoProvider>(...)

// ✅ 精確重建
Selector<TodoProvider, int>(
  selector: (_, p) => p.activeCount,
  ...
)
```

### 2. 使用 const 構造函數

```dart
const SizedBox(height: 16)
const Icon(Icons.check)
```

### 3. Consumer 的 child 參數

```dart
Consumer<TodoProvider>(
  builder: (context, provider, child) {
    return Column(
      children: [
        Text('${provider.count}'),
        child!, // 不會重建
      ],
    );
  },
  child: const ExpensiveWidget(),
)
```

### 4. 批量操作後通知一次

```dart
// ❌ 多次通知
for (item in items) {
  _todos.add(item);
  notifyListeners();
}

// ✅ 一次通知
for (item in items) {
  _todos.add(item);
}
notifyListeners();
```

## 🧪 測試

### 運行測試

```bash
# 單元測試
flutter test

# Widget 測試
flutter test test/widget_test.dart

# 測試覆蓋率
flutter test --coverage
```

### 測試示例

```dart
test('adds todo', () {
  final provider = TodoProvider();
  provider.addTodo('Test');

  expect(provider.todos.length, 1);
  expect(provider.todos.first.title, 'Test');
});
```

## 📦 構建發布版本

### Android APK

```bash
flutter build apk --release
# 輸出: build/app/outputs/flutter-apk/app-release.apk
```

### iOS IPA

```bash
flutter build ios --release
```

### Web

```bash
flutter build web --release
# 輸出: build/web/
```

## 🐛 常見問題

### Q: Provider not found?

```dart
// ❌ 錯誤：Provider 在 Widget 樹之外
void main() {
  runApp(MyApp());
  context.read<TodoProvider>(); // 錯誤！
}

// ✅ 正確：在 Provider 之下使用
ChangeNotifierProvider(
  create: (_) => TodoProvider(),
  child: MyApp(), // 在這裡面才能訪問
)
```

### Q: UI 沒有更新？

```dart
// ❌ 忘記調用 notifyListeners()
void addTodo(String title) {
  _todos.add(Todo(...));
  // 忘記 notifyListeners()
}

// ✅ 正確
void addTodo(String title) {
  _todos.add(Todo(...));
  notifyListeners(); // 必須調用
}
```

### Q: 過度重建？

```dart
// ❌ 使用 Consumer 監聽整個 Provider
Consumer<TodoProvider>(...)

// ✅ 使用 Selector 只監聽需要的值
Selector<TodoProvider, int>(
  selector: (_, p) => p.activeCount,
  ...
)
```

## 📚 學習資源

- [Provider 官方文檔](https://pub.dev/packages/provider)
- [Flutter 狀態管理指南](https://flutter.dev/docs/development/data-and-backend/state-mgmt)
- [ChangeNotifier API](https://api.flutter.dev/flutter/foundation/ChangeNotifier-class.html)

## 🎓 下一步

1. **學習進階功能**
   - ProxyProvider（依賴注入）
   - FutureProvider（異步數據）
   - StreamProvider（流式數據）

2. **優化性能**
   - 使用 Selector 替代 Consumer
   - 實現計算屬性緩存
   - 優化 notifyListeners 調用

3. **添加新功能**
   - 用戶認證
   - 數據同步
   - 主題切換
   - 國際化

4. **探索其他方案**
   - Riverpod（Provider 的進化版）
   - Bloc（業務邏輯組件）
   - GetX（一體化方案）

---

**Happy Coding with Flutter & Provider!** 🎉
