# Flutter 基礎 Todo List

這是一個使用 Flutter 基礎概念實作的待辦事項應用，展示了 StatefulWidget、setState 和 Material Design 的核心用法。

## 功能特色

- ✅ 添加待辦事項
- ✅ 標記完成/未完成
- ✅ 編輯待辦事項
- ✅ 刪除待辦事項（含確認對話框）
- ✅ 過濾顯示（全部/未完成/已完成）
- ✅ 統計信息顯示
- ✅ 清除所有已完成項目
- ✅ Material Design 風格 UI
- ✅ 數據持久化（SharedPreferences）
- ✅ 流暢的動畫效果
- ✅ 錯誤處理和加載狀態
- ✅ 完整的單元測試和 Widget 測試

## 項目結構

```
03-flutter-basic/
├── .gitignore                      # Git 忽略文件配置
├── analysis_options.yaml           # Dart 代碼分析配置
├── pubspec.yaml                    # Flutter 項目配置文件
├── lib/
│   ├── main.dart                   # 應用入口
│   ├── models/
│   │   └── todo.dart              # Todo 數據模型
│   ├── screens/
│   │   └── todo_list_screen.dart  # 主列表頁面（StatefulWidget）
│   ├── services/
│   │   └── todo_storage_service.dart # 數據持久化服務
│   └── widgets/
│       └── todo_item.dart         # Todo 列表項組件
├── test/
│   ├── models/
│   │   └── todo_test.dart         # Todo 模型測試
│   ├── services/
│   │   └── todo_storage_service_test.dart # 存儲服務測試
│   └── widgets/
│       └── todo_item_test.dart    # Widget 測試
└── README.md                       # 項目說明文檔
```

## Flutter 基礎概念

### 1. StatefulWidget vs StatelessWidget

#### StatelessWidget（無狀態組件）
- 不可變的組件，一旦創建就不會改變
- 適用於靜態內容展示
- 性能更好，因為不需要重建

```dart
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const TodoListScreen(),
    );
  }
}
```

#### StatefulWidget（有狀態組件）
- 可變的組件，可以響應用戶交互和數據變化
- 由兩部分組成：StatefulWidget 和 State
- 適用於需要動態更新的 UI

```dart
class TodoListScreen extends StatefulWidget {
  const TodoListScreen({Key? key}) : super(key: key);

  @override
  State<TodoListScreen> createState() => _TodoListScreenState();
}

class _TodoListScreenState extends State<TodoListScreen> {
  // 狀態數據
  final List<Todo> _todos = [];

  @override
  Widget build(BuildContext context) {
    // UI 構建邏輯
  }
}
```

### 2. setState() - 狀態更新機制

`setState()` 是 Flutter 中最基礎的狀態管理方式：

```dart
void _addTodo(String title) {
  setState(() {
    // 在 setState 中修改狀態
    _todos.add(Todo(title: title.trim()));
    _textController.clear();
  });
}

void _toggleTodo(String id) {
  setState(() {
    final todo = _todos.firstWhere((t) => t.id == id);
    todo.toggleCompleted();
  });
}

void _deleteTodo(String id) {
  setState(() {
    _todos.removeWhere((t) => t.id == id);
  });
}
```

**工作原理：**
1. 調用 `setState()` 會標記該組件為 "dirty"
2. Flutter 框架會在下一幀重新調用 `build()` 方法
3. `build()` 返回新的 Widget 樹
4. Flutter 執行高效的差異對比（diff）
5. 只更新變化的部分到屏幕上

**最佳實踐：**
- ✅ 只在 `setState()` 中修改狀態變量
- ✅ `setState()` 的回調要盡量簡潔
- ✅ 避免在 `setState()` 中執行耗時操作
- ❌ 不要在 `build()` 方法中調用 `setState()`

### 3. Widget 生命周期

StatefulWidget 的生命周期方法：

```dart
class _TodoListScreenState extends State<TodoListScreen> {
  @override
  void initState() {
    super.initState();
    // 組件初始化時調用（只調用一次）
    // 適合初始化數據、訂閱事件等
    _todos.addAll([
      Todo(title: '學習 Flutter 基礎'),
    ]);
  }

  @override
  void dispose() {
    // 組件銷毀時調用
    // 適合清理資源、取消訂閱等
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // 每次 setState() 後都會調用
    // 構建 UI 樹
    return Scaffold(...);
  }
}
```

### 4. Material Design 組件

Flutter 內置豐富的 Material Design 組件：

#### Scaffold（腳手架）
應用的基本結構框架：

```dart
Scaffold(
  appBar: AppBar(title: Text('標題')),
  body: Center(child: Text('內容')),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
  ),
)
```

#### Card（卡片）
Material 卡片容器：

```dart
Card(
  margin: EdgeInsets.all(8),
  elevation: 2,
  child: ListTile(
    leading: Icon(Icons.check),
    title: Text('項目標題'),
    trailing: IconButton(
      icon: Icon(Icons.delete),
      onPressed: () {},
    ),
  ),
)
```

#### Dialog（對話框）
模態對話框：

```dart
showDialog(
  context: context,
  builder: (BuildContext context) {
    return AlertDialog(
      title: Text('確認'),
      content: Text('確定要刪除嗎？'),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text('取消'),
        ),
        TextButton(
          onPressed: () {
            // 執行操作
            Navigator.of(context).pop();
          },
          child: Text('確定'),
        ),
      ],
    );
  },
);
```

#### SnackBar（提示條）
底部提示消息：

```dart
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    content: Text('操作成功'),
    duration: Duration(seconds: 2),
  ),
);
```

### 5. 常用 Widget

#### ListView.builder
高效的列表構建：

```dart
ListView.builder(
  itemCount: _filteredTodos.length,
  itemBuilder: (context, index) {
    final todo = _filteredTodos[index];
    return TodoItem(
      todo: todo,
      onToggle: () => _toggleTodo(todo.id),
      onDelete: () => _deleteTodo(todo.id),
    );
  },
)
```

#### Column & Row
垂直和水平佈局：

```dart
Column(
  children: [
    Text('標題'),
    Row(
      children: [
        Icon(Icons.star),
        Text('評分'),
      ],
    ),
  ],
)
```

#### Expanded & Flexible
彈性佈局：

```dart
Row(
  children: [
    Expanded(
      flex: 2,
      child: Container(color: Colors.red),
    ),
    Expanded(
      flex: 1,
      child: Container(color: Colors.blue),
    ),
  ],
)
```

## 技術特點

### 1. 組件化設計

將 UI 拆分為獨立的、可復用的組件：

- **MyApp**: 根組件，配置主題
- **TodoListScreen**: 主頁面，管理狀態
- **TodoItem**: 列表項組件，展示單個 Todo
- **TodoStorageService**: 數據持久化服務

### 2. 數據持久化

使用 SharedPreferences 實現本地數據存儲：

```dart
// 保存數據
await TodoStorageService.saveTodos(_todos);

// 加載數據
final todos = await TodoStorageService.loadTodos();

// 清除數據
await TodoStorageService.clearTodos();
```

**特點：**
- 自動序列化/反序列化
- 異步操作，不阻塞 UI
- 錯誤處理和異常捕獲
- 應用重啟後數據持久保存

### 3. 單一數據源

使用 `List<Todo>` 作為唯一的數據源：

```dart
final List<Todo> _todos = [];

// 所有操作都基於這個列表
void _addTodo(String title) {
  setState(() => _todos.add(Todo(title: title)));
  _saveTodos(); // 持久化保存
}

void _deleteTodo(String id) {
  setState(() => _todos.removeWhere((t) => t.id == id));
  _saveTodos(); // 持久化保存
}
```

### 4. 計算屬性

使用 getter 派生狀態：

```dart
List<Todo> get _filteredTodos {
  switch (_filter) {
    case 'active':
      return _todos.where((t) => !t.isCompleted).toList();
    case 'completed':
      return _todos.where((t) => t.isCompleted).toList();
    default:
      return _todos;
  }
}
```

### 5. 回調函數模式

父組件通過回調函數接收子組件的事件：

```dart
// 父組件傳遞回調
TodoItem(
  todo: todo,
  onToggle: () => _toggleTodo(todo.id),
  onDelete: () => _deleteTodo(todo.id),
)

// 子組件定義回調類型
class TodoItem extends StatelessWidget {
  final VoidCallback onToggle;
  final VoidCallback onDelete;

  // 觸發回調
  onTap: onToggle,
}
```

### 6. 流暢的動畫效果

使用 Flutter 內置動畫組件提升用戶體驗：

```dart
// 列表項淡入和滑動動畫
AnimatedSwitcher(
  duration: const Duration(milliseconds: 300),
  transitionBuilder: (child, animation) {
    return FadeTransition(
      opacity: animation,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0.2, 0),
          end: Offset.zero,
        ).animate(animation),
        child: child,
      ),
    );
  },
  child: TodoItem(...),
)

// 容器動畫
AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeInOut,
  child: Card(...),
)
```

### 7. 完整的錯誤處理

```dart
// 加載狀態
if (_isLoading) {
  return const CircularProgressIndicator();
}

// 錯誤狀態
if (_errorMessage != null) {
  return ErrorWidget(
    message: _errorMessage!,
    onRetry: _loadTodos,
  );
}

// 異常捕獲
try {
  await TodoStorageService.saveTodos(_todos);
} catch (e) {
  _showSnackBar('保存失敗: $e');
}
```

## 運行項目

### 前提條件

1. 安裝 Flutter SDK：https://flutter.dev/docs/get-started/install
2. 配置編輯器（VS Code 或 Android Studio）
3. 設置 Android/iOS 開發環境

### 運行步驟

1. **安裝依賴**
```bash
cd 06-mobile-crossplatform/03-flutter-basic
flutter pub get
```

2. **檢查設備**
```bash
flutter devices
```

3. **運行測試**
```bash
# 運行所有測試
flutter test

# 運行特定測試文件
flutter test test/models/todo_test.dart

# 運行測試並生成覆蓋率報告
flutter test --coverage
```

4. **代碼分析**
```bash
# 運行 Dart 分析器
flutter analyze

# 格式化代碼
flutter format lib/ test/
```

5. **運行應用**
```bash
# 運行在連接的設備上
flutter run

# 運行在特定設備上
flutter run -d <device-id>

# 運行在 Chrome 瀏覽器（Web）
flutter run -d chrome

# 運行 debug 模式（帶性能分析）
flutter run --profile
```

6. **熱重載**
- 在應用運行時，修改代碼後按 `r` 進行熱重載
- 按 `R` 進行熱重啟
- 按 `q` 退出應用

### 構建發布版本

```bash
# Android APK
flutter build apk --release

# Android App Bundle（推薦用於 Google Play）
flutter build appbundle --release

# iOS IPA
flutter build ios --release

# Web
flutter build web --release
```

## 學習要點

### 1. StatefulWidget 的使用時機

**使用 StatefulWidget：**
- 需要響應用戶交互（點擊、輸入等）
- 數據會隨時間變化
- 需要動畫效果
- 需要訂閱數據流

**使用 StatelessWidget：**
- 靜態內容展示
- 配置型組件
- 純展示組件

### 2. setState() 的注意事項

```dart
// ✅ 正確：在 setState 中修改狀態
void _addTodo() {
  setState(() {
    _todos.add(newTodo);
  });
}

// ❌ 錯誤：直接修改狀態不會觸發重建
void _addTodo() {
  _todos.add(newTodo); // UI 不會更新！
}

// ✅ 正確：耗時操作在外面，只在 setState 中更新狀態
Future<void> _loadTodos() async {
  final todos = await api.fetchTodos(); // 異步操作
  setState(() {
    _todos = todos; // 只更新狀態
  });
}
```

### 3. 組件通信

**父子組件通信：**
- 父 → 子：通過構造函數傳遞數據
- 子 → 父：通過回調函數

```dart
// 父組件
class Parent extends StatefulWidget {
  @override
  _ParentState createState() => _ParentState();
}

class _ParentState extends State<Parent> {
  String _data = '';

  void _handleChildEvent(String newData) {
    setState(() {
      _data = newData;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Child(
      data: _data,              // 父 → 子
      onEvent: _handleChildEvent, // 子 → 父
    );
  }
}

// 子組件
class Child extends StatelessWidget {
  final String data;
  final Function(String) onEvent;

  const Child({required this.data, required this.onEvent});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => onEvent('new data'),
      child: Text(data),
    );
  }
}
```

## 與其他狀態管理方案對比

| 特性 | setState | Provider | Bloc | Riverpod |
|------|----------|----------|------|----------|
| 學習曲線 | 簡單 | 中等 | 較難 | 中等 |
| 代碼量 | 少 | 中 | 多 | 中 |
| 適用場景 | 簡單應用 | 中小型應用 | 大型應用 | 中大型應用 |
| 性能 | 一般 | 好 | 很好 | 很好 |
| 可測試性 | 一般 | 好 | 很好 | 很好 |

**setState 的優勢：**
- 最簡單直觀
- 無需額外依賴
- 適合學習 Flutter 基礎
- 適合小型應用或局部狀態管理

**setState 的局限：**
- 難以跨組件共享狀態
- 組件樹深時性能較差
- 缺乏狀態邏輯復用機制
- 難以管理複雜狀態

## 測試

本項目包含完整的單元測試和 Widget 測試：

### 測試覆蓋

1. **模型測試** (`test/models/todo_test.dart`)
   - Todo 創建和屬性
   - JSON 序列化/反序列化
   - 相等性比較
   - copyWith 方法

2. **服務測試** (`test/services/todo_storage_service_test.dart`)
   - 保存和加載數據
   - 數據覆蓋
   - 清除數據
   - 空列表處理

3. **Widget 測試** (`test/widgets/todo_item_test.dart`)
   - UI 渲染
   - 用戶交互
   - 回調觸發
   - 對話框顯示

### 運行測試

```bash
# 運行所有測試
flutter test

# 查看測試覆蓋率
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

## 代碼品質

### Lint 規則

本項目使用嚴格的 lint 規則（`analysis_options.yaml`）：

- 錯誤檢測規則
- 代碼風格規則
- 性能優化建議
- 最佳實踐檢查

### 代碼分析

```bash
# 運行分析器
flutter analyze

# 修復可自動修復的問題
dart fix --apply
```

## 性能優化

### 已實現的優化

1. **const 構造函數**
   - 靜態 Widget 使用 const
   - 減少不必要的重建

2. **ListView.builder**
   - 懶加載列表項
   - 只渲染可見項目

3. **Key 的使用**
   - ValueKey 確保 Widget 正確復用
   - 提升列表更新性能

4. **BouncingScrollPhysics**
   - iOS 風格的滾動效果
   - 更好的用戶體驗

## 下一步學習

1. **Provider**: 學習更高級的狀態管理 → 查看 `04-flutter-riverpod`
2. **導航**: 多頁面應用和路由
3. **SQLite**: 更強大的本地數據庫
4. **網絡請求**: HTTP、Dio
5. **主題切換**: 實現深色模式
6. **國際化**: 多語言支持

## 參考資源

- [Flutter 官方文檔](https://flutter.dev/docs)
- [Flutter 中文網](https://flutter.cn/)
- [Dart 語言教程](https://dart.dev/guides)
- [Material Design 指南](https://material.io/design)
- [Flutter Widget 目錄](https://flutter.dev/docs/development/ui/widgets)

## 常見問題

### 1. 為什麼 setState 後 UI 沒更新？

確保：
- 修改的是狀態變量（用 `setState` 包裹）
- 變量是在 State 類中聲明的
- `build()` 方法中使用了該變量

### 2. 如何避免不必要的重建？

- 使用 `const` 構造函數
- 將靜態部分提取為 StatelessWidget
- 使用 `ListView.builder` 而不是 `ListView`

### 3. 如何在 initState 中使用 BuildContext？

```dart
@override
void initState() {
  super.initState();
  // ❌ 這裡不能直接使用 context
  // showDialog(context: context, ...);

  // ✅ 使用 WidgetsBinding.addPostFrameCallback
  WidgetsBinding.instance.addPostFrameCallback((_) {
    showDialog(context: context, ...);
  });
}
```

## 總結

這個 Flutter 基礎 Todo List 展示了：

1. **StatefulWidget** 的基本用法和生命周期
2. **setState()** 的狀態管理機制
3. **Material Design** 組件的使用
4. **組件化** 的設計思想
5. **回調函數** 的通信模式
6. **數據持久化** 使用 SharedPreferences
7. **動畫效果** 提升用戶體驗
8. **錯誤處理** 和加載狀態管理
9. **測試驅動開發** 完整的測試覆蓋
10. **代碼品質** 嚴格的 lint 規則

通過這個項目，你應該能夠：
- 理解 Flutter 的響應式 UI 範式
- 掌握基礎的狀態管理
- 熟悉常用的 Material 組件
- 實現數據持久化
- 添加流暢的動畫效果
- 編寫單元測試和 Widget 測試
- 遵循 Flutter 最佳實踐
- 能夠構建生產級別的 Flutter 應用

這是學習 Flutter 的堅實基礎，為後續學習更高級的概念打下良好的根基。

## 改進歷史

### v1.1.0 (最新)
- ✅ 添加數據持久化（SharedPreferences）
- ✅ 添加流暢的動畫效果
- ✅ 完整的錯誤處理和加載狀態
- ✅ 完整的單元測試和 Widget 測試覆蓋
- ✅ 嚴格的代碼分析規則（analysis_options.yaml）
- ✅ 添加 .gitignore 配置
- ✅ 性能優化（const constructors, ValueKey）

### v1.0.0 (初始版本)
- ✅ 基本的 CRUD 操作
- ✅ StatefulWidget 和 setState
- ✅ Material Design UI
- ✅ 過濾和統計功能
