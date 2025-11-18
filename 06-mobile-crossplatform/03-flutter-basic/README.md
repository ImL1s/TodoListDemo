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

## 項目結構

```
03-flutter-basic/
├── pubspec.yaml                    # Flutter 項目配置文件
├── lib/
│   ├── main.dart                   # 應用入口
│   ├── models/
│   │   └── todo.dart              # Todo 數據模型
│   ├── screens/
│   │   └── todo_list_screen.dart  # 主列表頁面（StatefulWidget）
│   └── widgets/
│       └── todo_item.dart         # Todo 列表項組件
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

### 2. 單一數據源

使用 `List<Todo>` 作為唯一的數據源：

```dart
final List<Todo> _todos = [];

// 所有操作都基於這個列表
void _addTodo(String title) {
  setState(() => _todos.add(Todo(title: title)));
}

void _deleteTodo(String id) {
  setState(() => _todos.removeWhere((t) => t.id == id));
}
```

### 3. 計算屬性

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

### 4. 回調函數模式

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

3. **運行應用**
```bash
# 運行在連接的設備上
flutter run

# 運行在特定設備上
flutter run -d <device-id>

# 運行在 Chrome 瀏覽器（Web）
flutter run -d chrome
```

4. **熱重載**
- 在應用運行時，修改代碼後按 `r` 進行熱重載
- 按 `R` 進行熱重啟
- 按 `q` 退出應用

### 構建發布版本

```bash
# Android APK
flutter build apk --release

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

## 下一步學習

1. **Provider**: 學習更高級的狀態管理
2. **導航**: 多頁面應用和路由
3. **數據持久化**: SharedPreferences、SQLite
4. **網絡請求**: HTTP、Dio
5. **動畫**: 添加過渡動畫效果
6. **主題切換**: 實現深色模式
7. **國際化**: 多語言支持

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

1. **StatefulWidget** 的基本用法
2. **setState()** 的狀態管理機制
3. **Material Design** 組件的使用
4. **組件化** 的設計思想
5. **回調函數** 的通信模式

通過這個項目，你應該能夠：
- 理解 Flutter 的響應式 UI 範式
- 掌握基礎的狀態管理
- 熟悉常用的 Material 組件
- 能夠構建簡單的 Flutter 應用

這是學習 Flutter 的堅實基礎，為後續學習更高級的概念打下良好的根基。
