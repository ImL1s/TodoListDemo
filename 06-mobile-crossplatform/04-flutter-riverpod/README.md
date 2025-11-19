# Flutter + Riverpod Todo List (進階版)

一個使用 Flutter 和 Riverpod 狀態管理的全功能 Todo List 應用程式，展示 Riverpod 的進階特性和最佳實踐。

## 專案特色

### 核心技術棧

- **Flutter 3.0+** - 跨平台 UI 框架
- **Riverpod 2.4+** - 現代化響應式狀態管理
- **Freezed** - 不可變數據類和代碼生成
- **SharedPreferences** - 本地數據持久化
- **AsyncNotifier** - 異步狀態管理

### Riverpod 進階特性展示

本專案是 **Riverpod 最佳實踐的完整示範**，包含：

#### 1. AsyncNotifierProvider - 異步狀態管理

```dart
class AsyncTodoListNotifier extends AsyncNotifier<List<Todo>> {
  @override
  Future<List<Todo>> build() async {
    return await _repository.loadTodos();
  }

  Future<void> addTodo(String title) async {
    state = await AsyncValue.guard(() async {
      final currentTodos = state.value ?? [];
      final updatedTodos = [...currentTodos, newTodo];
      await _saveToStorage(updatedTodos);
      return updatedTodos;
    });
  }
}
```

**優點：**
- 自動處理 Loading/Error 狀態
- 內建錯誤處理 (AsyncValue.guard)
- 型別安全的異步操作
- 與數據持久化完美整合

#### 2. Provider 組合與衍生狀態

```dart
final filteredTodosProvider = Provider.autoDispose<AsyncValue<List<Todo>>>((ref) {
  final asyncTodos = ref.watch(todoListProvider);
  final filter = ref.watch(todoFilterProvider);
  final sort = ref.watch(todoSortProvider);
  final query = ref.watch(searchQueryProvider);

  return asyncTodos.whenData((todos) {
    // 過濾、搜索、排序邏輯
  });
});
```

**優點：**
- 單一職責原則
- 自動依賴追蹤
- 精確重建優化
- 易於測試和維護

#### 3. autoDispose - 自動資源清理

```dart
final todoFilterProvider = StateProvider.autoDispose<TodoFilter>((ref) {
  return TodoFilter.all;
});
```

**優點：**
- 自動清理未使用的 Provider
- 防止內存泄漏
- 適用於臨時狀態（過濾器、搜索等）

#### 4. Family - 參數化 Provider

```dart
final todoByIdProvider = Provider.autoDispose.family<Todo?, String>((ref, id) {
  return ref.watch(todoListProvider).when(
    data: (todos) => todos.firstWhere((todo) => todo.id == id),
    // ...
  );
});
```

**優點：**
- 為每個參數創建獨立實例
- 適用於詳情頁面
- 自動緩存和清理

#### 5. AsyncValue 處理

```dart
asyncFilteredTodos.when(
  loading: () => CircularProgressIndicator(),
  error: (error, stack) => ErrorWidget(error),
  data: (todos) => ListView(todos),
);
```

**優點：**
- 清晰的狀態處理
- 用戶體驗優化
- 錯誤恢復機制

### Freezed - 不可變數據類

使用 Freezed 自動生成完美的數據類：

```dart
@freezed
class Todo with _$Todo {
  const factory Todo({
    required String id,
    required String title,
    @Default(false) bool completed,
    required DateTime createdAt,
    @Default(TodoPriority.medium) TodoPriority priority,
  }) = _Todo;

  factory Todo.fromJson(Map<String, dynamic> json) => _$TodoFromJson(json);
}
```

**自動生成：**
- ✅ `copyWith()` - 創建修改副本
- ✅ `==` 和 `hashCode` - 值相等比較
- ✅ `toString()` - 調試輸出
- ✅ `fromJson/toJson` - JSON 序列化
- ✅ 不可變性保證

### 數據持久化架構

#### Repository 模式

```dart
class TodoRepository {
  Future<List<Todo>> loadTodos() async { ... }
  Future<bool> saveTodos(List<Todo> todos) async { ... }
  Future<bool> clearTodos() async { ... }
}
```

**優點：**
- 關注點分離
- 易於測試（Mock Repository）
- 可替換存儲實現（SQLite, Hive, etc.）
- 統一的數據訪問層

## 功能完整性

### 核心功能

- ✅ **CRUD 操作**
  - 新增 Todo（支持優先級）
  - 編輯 Todo（標題和優先級）
  - 刪除 Todo（確認對話框）
  - 切換完成狀態

- ✅ **過濾與搜索**
  - 全部 / 進行中 / 已完成過濾
  - 實時搜索（標題模糊匹配）
  - 多重排序（日期 / 標題 / 優先級）

- ✅ **批量操作**
  - 全選 / 取消全選
  - 清除已完成項目
  - 清除所有項目

- ✅ **優先級管理**
  - 四個優先級等級（低 / 中 / 高 / 緊急）
  - 顏色編碼視覺化
  - 優先級排序

- ✅ **數據持久化**
  - 自動保存到 SharedPreferences
  - 應用重啟後數據保留
  - JSON 序列化/反序列化

- ✅ **狀態管理**
  - Loading 狀態顯示
  - Error 狀態處理和重試
  - 空狀態提示

### UI/UX 特性

- 🎨 Material Design 3
- 📱 響應式設計
- ⚡ 流暢動畫
- 🔍 實時搜索
- 📊 統計數據顯示
- ⏰ 相對時間顯示
- 🎯 優先級視覺化

## 專案結構

```
lib/
├── main.dart                          # 應用入口
├── models/
│   ├── todo.dart                      # Todo 模型 (Freezed)
│   ├── todo.freezed.dart              # Freezed 生成文件
│   └── todo.g.dart                    # JSON 序列化生成文件
├── providers/
│   └── todo_provider.dart             # Riverpod Providers
│       ├── AsyncTodoListNotifier      # 主要狀態管理
│       ├── todoListProvider           # 異步 Todo 列表
│       ├── todoFilterProvider         # 過濾器狀態
│       ├── todoSortProvider           # 排序狀態
│       ├── searchQueryProvider        # 搜索查詢
│       ├── filteredTodosProvider      # 衍生狀態
│       ├── uncompletedTodosCountProvider
│       ├── completedTodosCountProvider
│       ├── allTodosCompletedProvider
│       └── todoStatsProvider          # 統計數據
├── repositories/
│   └── todo_repository.dart           # 數據訪問層
├── screens/
│   └── todo_list_screen.dart          # 主畫面
└── widgets/
    └── todo_item.dart                 # Todo 項目組件

test/
└── todo_provider_test.dart            # Provider 單元測試
```

## 安裝與運行

### 前置需求

- Flutter SDK 3.0.0 或更高版本
- Dart 3.0.0 或更高版本

### 安裝步驟

1. **克隆專案**
   ```bash
   cd 06-mobile-crossplatform/04-flutter-riverpod
   ```

2. **安裝依賴**
   ```bash
   flutter pub get
   ```

3. **生成 Freezed 代碼**
   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

4. **運行應用**
   ```bash
   flutter run
   ```

5. **運行測試**
   ```bash
   flutter test
   ```

### 運行在特定平台

```bash
# iOS 模擬器
flutter run -d ios

# Android 模擬器
flutter run -d android

# Chrome 瀏覽器
flutter run -d chrome

# macOS 桌面
flutter run -d macos
```

### 建置生產版本

```bash
# Android APK
flutter build apk --release

# iOS
flutter build ios --release

# Web
flutter build web --release
```

## Riverpod 最佳實踐

### 1. 正確使用 ref.watch vs ref.read

```dart
// ✅ 正確：在 build 方法中使用 watch
@override
Widget build(BuildContext context, WidgetRef ref) {
  final todos = ref.watch(todoListProvider);
  return ListView(...);
}

// ✅ 正確：在事件處理中使用 read
void onPressed() {
  ref.read(todoListProvider.notifier).addTodo('New');
}

// ❌ 錯誤：在 build 方法中使用 read
@override
Widget build(BuildContext context, WidgetRef ref) {
  final todos = ref.read(todoListProvider); // 不會自動更新！
}
```

### 2. 使用 autoDispose 防止內存泄漏

```dart
// ✅ 對於臨時狀態使用 autoDispose
final searchQueryProvider = StateProvider.autoDispose<String>((ref) {
  return '';
});

// ✅ 對於全局狀態不使用 autoDispose
final todoListProvider = AsyncNotifierProvider<...>(() {
  return AsyncTodoListNotifier();
});
```

### 3. Provider 組合而非巨型 Provider

```dart
// ✅ 正確：小而專注的 Providers
final todoFilterProvider = StateProvider.autoDispose<TodoFilter>(...);
final todoSortProvider = StateProvider.autoDispose<TodoSort>(...);
final filteredTodosProvider = Provider.autoDispose<...>((ref) {
  final filter = ref.watch(todoFilterProvider);
  final sort = ref.watch(todoSortProvider);
  // 組合邏輯
});

// ❌ 錯誤：單一巨型 Provider 處理所有邏輯
```

### 4. AsyncValue 完整處理

```dart
// ✅ 正確：處理所有狀態
asyncValue.when(
  loading: () => LoadingWidget(),
  error: (error, stack) => ErrorWidget(error),
  data: (data) => DataWidget(data),
);

// ⚠️ 可選：只處理數據，其他使用預設
asyncValue.whenData((data) => DataWidget(data));
```

### 5. 測試友好的設計

```dart
// ✅ 提供 Repository Provider 以便測試時覆蓋
final todoRepositoryProvider = Provider<TodoRepository>((ref) {
  return TodoRepository();
});

// 測試時
final container = ProviderContainer(
  overrides: [
    todoRepositoryProvider.overrideWithValue(MockRepository()),
  ],
);
```

## Riverpod vs 其他狀態管理

| 特性 | Riverpod | Provider | Bloc | GetX |
|------|----------|----------|------|------|
| 編譯時安全 | ✅ | ❌ | ✅ | ❌ |
| 無需 BuildContext | ✅ | ❌ | ✅ | ✅ |
| 自動依賴追蹤 | ✅ | 部分 | ❌ | ❌ |
| 異步支持 | ✅✅ | ✅ | ✅✅ | ✅ |
| 測試友好性 | ✅✅ | ✅ | ✅✅ | ⚠️ |
| 學習曲線 | 中等 | 較低 | 較高 | 較低 |
| 性能 | 優秀 | 良好 | 優秀 | 優秀 |
| 樣板代碼 | 少 | 中等 | 多 | 少 |
| Provider 組合 | ✅✅ | 有限 | ❌ | ❌ |
| 內存管理 | 自動 | 手動 | 手動 | 自動 |

**推薦使用 Riverpod 的情況：**
- 需要強類型安全
- 複雜的狀態依賴關係
- 重視可測試性
- 團隊規模中到大型

## 代碼生成

### Freezed 使用

1. **定義模型**
   ```dart
   @freezed
   class Todo with _$Todo {
     const factory Todo({
       required String id,
       required String title,
     }) = _Todo;

     factory Todo.fromJson(Map<String, dynamic> json) => _$TodoFromJson(json);
   }
   ```

2. **生成代碼**
   ```bash
   # 一次性生成
   flutter pub run build_runner build --delete-conflicting-outputs

   # 監聽模式（開發時推薦）
   flutter pub run build_runner watch --delete-conflicting-outputs
   ```

3. **生成的文件**
   - `*.freezed.dart` - Freezed 生成的類
   - `*.g.dart` - JSON 序列化代碼

## 測試策略

### Provider 單元測試

```dart
test('Adding a todo should update the list', () async {
  final container = ProviderContainer(
    overrides: [
      todoRepositoryProvider.overrideWithValue(MockRepository()),
    ],
  );

  await container.read(todoListProvider.notifier).addTodo('Test');

  final todos = container.read(todoListProvider).value!;
  expect(todos.length, 1);
  expect(todos.first.title, 'Test');
});
```

### Widget 測試

```dart
testWidgets('TodoItem displays correctly', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      child: MaterialApp(
        home: TodoItem(todo: testTodo),
      ),
    ),
  );

  expect(find.text('Test Todo'), findsOneWidget);
});
```

## 性能優化技巧

### 1. 使用 select 精確重建

```dart
// ❌ 整個 Todo 列表改變時重建
final count = ref.watch(todoListProvider).value?.length ?? 0;

// ✅ 只在長度改變時重建
final count = ref.watch(
  todoListProvider.select((value) => value.value?.length ?? 0),
);
```

### 2. 拆分大型 Widgets

```dart
// ✅ 只重建必要部分
class TodoList extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListView.builder(
      itemBuilder: (context, index) {
        // 每個 item 是獨立的 Consumer
        return TodoItemWidget(index);
      },
    );
  }
}
```

### 3. 使用 const 構造函數

```dart
// ✅ 使用 const 避免不必要的重建
const Text('Static text');
const Icon(Icons.add);
```

## 常見問題

### Q: Provider 未找到錯誤

**A:** 確保 `ProviderScope` 在 widget 樹的最頂層：

```dart
void main() {
  runApp(
    const ProviderScope(child: MyApp()),
  );
}
```

### Q: 狀態未更新

**A:** 檢查是否使用了 `ref.watch()` 而非 `ref.read()`：

```dart
// ✅ 正確
final todos = ref.watch(todoListProvider);

// ❌ 錯誤（不會自動更新）
final todos = ref.read(todoListProvider);
```

### Q: Freezed 代碼生成失敗

**A:** 運行以下命令清理並重新生成：

```bash
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

### Q: AsyncValue 一直處於 Loading

**A:** 確保 AsyncNotifier 的 build 方法正確返回：

```dart
@override
Future<List<Todo>> build() async {
  return await _repository.loadTodos(); // 必須返回數據
}
```

## 進階主題

### 1. Provider 作用域

```dart
// 全局 Provider（整個應用）
final globalProvider = Provider((ref) => ...);

// 帶作用域的 Provider（特定路由）
ProviderScope(
  overrides: [
    globalProvider.overrideWithValue(customValue),
  ],
  child: MyScreen(),
);
```

### 2. Ref.listen 用於副作用

```dart
@override
Widget build(BuildContext context, WidgetRef ref) {
  // 監聽變化並執行副作用（不重建 UI）
  ref.listen(todoListProvider, (previous, next) {
    next.whenData((todos) {
      if (todos.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('All todos completed!')),
        );
      }
    });
  });

  return ...;
}
```

### 3. keepAlive 防止自動清理

```dart
final importantProvider = Provider.autoDispose((ref) {
  // 即使沒有監聽者也保持活動
  ref.keepAlive();
  return ...;
});
```

## 相關資源

### 官方文檔

- [Riverpod 官網](https://riverpod.dev/)
- [Riverpod 文檔](https://docs-v2.riverpod.dev/)
- [Flutter 官網](https://flutter.dev/)
- [Freezed 文檔](https://pub.dev/packages/freezed)

### 學習資源

- [Riverpod 官方教程](https://riverpod.dev/docs/getting_started)
- [AsyncNotifier 指南](https://riverpod.dev/docs/providers/notifier_provider)
- [測試指南](https://riverpod.dev/docs/cookbooks/testing)

### 視頻教程

- [Riverpod 2.0 完整指南](https://www.youtube.com/results?search_query=riverpod+2.0+tutorial)
- [Flutter 狀態管理比較](https://www.youtube.com/results?search_query=flutter+state+management+comparison)

## 授權

本專案為示範用途，可自由使用和修改。

## 貢獻

歡迎提交 Issues 和 Pull Requests！

## 總結

本專案展示了 Riverpod 的完整能力：

✅ **AsyncNotifierProvider** - 異步狀態管理
✅ **Provider 組合** - 複雜狀態依賴
✅ **autoDispose** - 自動資源管理
✅ **Family** - 參數化 Provider
✅ **AsyncValue** - 完整狀態處理
✅ **Freezed** - 不可變數據類
✅ **Repository** - 數據持久化
✅ **測試** - 完整測試覆蓋

這是學習 Riverpod 最佳實踐的完美起點！
