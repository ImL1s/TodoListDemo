# Flutter + Riverpod Todo List

一個使用 Flutter 和 Riverpod 狀態管理的 Todo List 應用程式。

## 專案特色

### Riverpod 狀態管理

Riverpod 是 Provider 的現代化改進版本，提供了更好的開發體驗：

1. **編譯時安全**
   - 完全編譯時檢查，消除運行時錯誤
   - 不會因為拼寫錯誤而在運行時崩潰
   - IDE 自動補全和型別檢查

2. **Provider 組合**
   - Providers 可以相互依賴
   - 自動追蹤依賴關係
   - 只在依賴變化時重建

3. **無需 BuildContext**
   - 可以在任何地方讀取 providers
   - 不需要 context 參數
   - 更容易測試

4. **更好的可測試性**
   - 容易 mock providers
   - 可以覆蓋特定 provider 的值
   - 獨立測試每個 provider

## Riverpod 核心概念

### Provider 類型

1. **Provider**
   ```dart
   final myProvider = Provider<String>((ref) => 'Hello');
   ```
   - 用於提供不變的值
   - 適合計算衍生狀態
   - 本專案用於 `filteredTodosProvider`

2. **StateProvider**
   ```dart
   final counterProvider = StateProvider<int>((ref) => 0);
   ```
   - 用於簡單的狀態管理
   - 可以直接修改值
   - 本專案用於 `todoFilterProvider`

3. **StateNotifierProvider**
   ```dart
   final todoListProvider = StateNotifierProvider<TodoListNotifier, List<Todo>>((ref) {
     return TodoListNotifier();
   });
   ```
   - 用於複雜的狀態管理
   - 通過方法修改狀態
   - 本專案的主要狀態管理方式

### 狀態管理架構

```
┌─────────────────────────────────────────────┐
│          ProviderScope (Root)               │
│  包含所有 provider 的狀態                    │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼──────┐       ┌───────▼──────────┐
│ todoList     │       │ todoFilter       │
│ Provider     │       │ Provider         │
│ (Source)     │       │ (Source)         │
└───────┬──────┘       └───────┬──────────┘
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────────────┐
        │   filteredTodosProvider       │
        │   (Derived/Computed)          │
        │   自動監聽依賴的變化            │
        └───────────────────────────────┘
```

### ref 對象的三種方法

1. **ref.watch()**
   ```dart
   final todos = ref.watch(todoListProvider);
   ```
   - 監聽 provider 的變化
   - provider 變化時重建 UI
   - 用於 Widget build 方法

2. **ref.read()**
   ```dart
   ref.read(todoListProvider.notifier).addTodo('New task');
   ```
   - 一次性讀取值
   - 不監聽變化
   - 用於事件處理器

3. **ref.listen()**
   ```dart
   ref.listen(todoListProvider, (previous, next) {
     // 執行副作用
   });
   ```
   - 監聽變化並執行副作用
   - 不重建 UI
   - 用於導航、顯示 SnackBar 等

## 專案結構

```
lib/
├── main.dart                      # 應用入口，包含 ProviderScope
├── models/
│   └── todo.dart                  # Todo 數據模型（不可變）
├── providers/
│   └── todo_provider.dart         # Riverpod providers 定義
│       ├── todoListProvider       # 主要狀態（StateNotifierProvider）
│       ├── todoFilterProvider     # 過濾器狀態（StateProvider）
│       ├── filteredTodosProvider  # 衍生狀態（Provider）
│       └── 統計相關 providers       # 計數等衍生狀態
├── screens/
│   └── todo_list_screen.dart      # 主畫面（ConsumerWidget）
└── widgets/
    └── todo_item.dart             # Todo 項目組件（ConsumerStatefulWidget）
```

## 狀態流動示例

### 添加 Todo

```
User Input
    │
    ▼
_textController.text
    │
    ▼
ref.read(todoListProvider.notifier).addTodo(title)
    │
    ▼
TodoListNotifier.addTodo()
    │
    ▼
state = [...state, newTodo]  // 創建新的不可變列表
    │
    ▼
Riverpod 通知所有監聽者
    │
    ├──▶ todoListProvider 更新
    │        │
    │        ▼
    │    filteredTodosProvider 自動重新計算
    │        │
    │        ▼
    │    UI 重建（只有使用 watch 的部分）
    │
    └──▶ uncompletedTodosCountProvider 自動重新計算
             │
             ▼
         Stats Bar 更新
```

### 切換過濾器

```
Filter Button Pressed
    │
    ▼
ref.read(todoFilterProvider.notifier).state = newFilter
    │
    ▼
todoFilterProvider 更新
    │
    ▼
filteredTodosProvider 自動重新計算
    │
    ▼
ListView 重建顯示過濾後的項目
```

## Provider 依賴關係圖

```
todoListProvider ────┐
                     ├──▶ filteredTodosProvider ──▶ UI (ListView)
todoFilterProvider ──┘

todoListProvider ──▶ uncompletedTodosCountProvider ──▶ UI (Stats)
                 └──▶ completedTodosCountProvider ────▶ UI (Stats)
                 └──▶ allTodosCompletedProvider ──────▶ UI (Toggle Button)
```

## Widget 類型

### ConsumerWidget
```dart
class TodoListScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 可以使用 ref.watch()
  }
}
```
- 替代 StatelessWidget
- 自動提供 WidgetRef
- 用於無狀態但需要訪問 providers 的 widgets

### ConsumerStatefulWidget
```dart
class TodoItem extends ConsumerStatefulWidget {
  @override
  ConsumerState<TodoItem> createState() => _TodoItemState();
}

class _TodoItemState extends ConsumerState<TodoItem> {
  // 可以使用 widget.ref 或 ref
}
```
- 替代 StatefulWidget
- 同時擁有內部狀態和 provider 訪問
- 用於需要 TextEditingController 等本地狀態的 widgets

## 功能特性

### 核心功能
- ✅ 新增 Todo
- ✅ 編輯 Todo（雙模式：顯示/編輯）
- ✅ 刪除 Todo（帶確認對話框）
- ✅ 切換完成狀態
- ✅ 過濾顯示（全部/進行中/已完成）
- ✅ 統計資訊（活動/完成數量）
- ✅ 全選/取消全選
- ✅ 清除已完成項目
- ✅ 時間戳記顯示（相對時間）

### UI 特點
- Material Design 3
- 響應式設計
- 空狀態提示
- 確認對話框
- 流暢的動畫過渡

## 安裝與運行

### 前置需求
- Flutter SDK 3.0.0 或更高版本
- Dart 3.0.0 或更高版本

### 安裝步驟

1. **安裝依賴**
   ```bash
   flutter pub get
   ```

2. **運行應用**
   ```bash
   flutter run
   ```

3. **運行在特定設備**
   ```bash
   # iOS 模擬器
   flutter run -d ios

   # Android 模擬器
   flutter run -d android

   # Chrome
   flutter run -d chrome
   ```

4. **建置生產版本**
   ```bash
   # Android APK
   flutter build apk --release

   # iOS
   flutter build ios --release
   ```

## Riverpod vs Provider 比較

| 特性 | Provider | Riverpod |
|------|----------|----------|
| 編譯時安全 | ❌ | ✅ |
| 需要 BuildContext | ✅ | ❌ |
| 可以在任何地方使用 | ❌ | ✅ |
| 自動依賴追蹤 | 部分 | ✅ |
| 測試友好性 | 中等 | 優秀 |
| Provider 組合 | 有限 | 強大 |
| 學習曲線 | 較低 | 中等 |

## Riverpod 最佳實踐

1. **使用 const 建構子**
   ```dart
   const Todo({required this.id, ...});
   ```

2. **不可變數據**
   - 使用 `copyWith()` 創建新實例
   - 避免直接修改物件屬性

3. **Provider 命名**
   - 使用描述性名稱
   - 加上 `Provider` 後綴

4. **狀態分離**
   - 將相關狀態組織在一起
   - 創建衍生 providers 而不是在 UI 中計算

5. **使用 watch/read 的時機**
   - `watch`: 需要 UI 更新時
   - `read`: 一次性讀取或觸發動作時

## 延伸學習

### 進階功能
- 使用 `AsyncNotifierProvider` 處理異步操作
- 使用 `FutureProvider` 和 `StreamProvider`
- Provider 的生命週期管理
- 使用 `family` 和 `autoDispose` 修飾符
- 狀態持久化（shared_preferences）

### 程式碼生成
- 使用 `freezed` 生成不可變類
- 使用 `json_serializable` 序列化 JSON

## 依賴套件

- **flutter_riverpod**: ^2.4.9 - Riverpod 核心套件
- **uuid**: ^4.2.2 - 生成唯一 ID
- **freezed_annotation**: ^2.4.1 - 註解支援（可選）

## 疑難排解

### Provider 未找到
確保 `ProviderScope` 在 widget 樹的最頂層：
```dart
void main() {
  runApp(
    const ProviderScope(child: MyApp()),
  );
}
```

### 狀態未更新
確保使用 `ref.watch()` 而不是 `ref.read()` 來監聽變化。

### 編譯錯誤
運行 `flutter clean` 和 `flutter pub get` 清理快取。

## 授權

本專案為示範用途，可自由使用和修改。

## 相關資源

- [Riverpod 官方文檔](https://riverpod.dev/)
- [Flutter 官方文檔](https://flutter.dev/)
- [Riverpod GitHub](https://github.com/rrousselGit/riverpod)
