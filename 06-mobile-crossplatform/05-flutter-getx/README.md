# Flutter GetX Todo List

使用 Flutter 和 GetX 狀態管理框架實作的待辦事項應用程式。

## 專案結構

```
05-flutter-getx/
├── lib/
│   ├── main.dart                    # 應用程式入口
│   ├── models/
│   │   └── todo.dart               # Todo 資料模型
│   ├── controllers/
│   │   └── todo_controller.dart    # GetX 控制器（狀態管理）
│   ├── screens/
│   │   └── todo_list_screen.dart   # 主畫面
│   └── widgets/
│       └── todo_item.dart          # Todo 項目元件
├── pubspec.yaml                     # 依賴配置
└── README.md
```

## GetX 核心特色

### 1. 輕量級狀態管理

GetX 提供了三種主要的狀態管理方式：

#### (1) 響應式狀態 (.obs)
```dart
// 使用 .obs 讓變數變成響應式
final count = 0.obs;

// 自動更新 UI
Obx(() => Text('${count.value}'));

// 修改值會自動觸發 UI 更新
count.value++;
```

#### (2) GetBuilder
```dart
// 手動控制更新，性能更好
GetBuilder<TodoController>(
  builder: (controller) => Text('${controller.count}'),
);

// 需要手動調用 update()
update();
```

#### (3) GetX Widget
```dart
// 結合響應式和生命週期管理
GetX<TodoController>(
  builder: (controller) => Text('${controller.count}'),
);
```

### 2. 依賴注入

```dart
// 註冊依賴
Get.put(TodoController());

// 延遲註冊（首次使用時才創建）
Get.lazyPut(() => TodoController());

// 獲取依賴
final controller = Get.find<TodoController>();

// 刪除依賴
Get.delete<TodoController>();
```

### 3. 路由管理

```dart
// 導航到新頁面
Get.to(NextScreen());

// 帶參數導航
Get.to(NextScreen(), arguments: 'data');

// 命名路由
Get.toNamed('/details');

// 返回上一頁
Get.back();

// 返回並傳遞結果
Get.back(result: 'data');

// 替換當前頁面
Get.off(NextScreen());

// 清除所有頁面並導航
Get.offAll(HomeScreen());
```

### 4. 對話框與 SnackBar

```dart
// 顯示 SnackBar
Get.snackbar(
  '標題',
  '訊息',
  snackPosition: SnackPosition.BOTTOM,
);

// 顯示對話框
Get.dialog(
  AlertDialog(
    title: Text('標題'),
    content: Text('內容'),
  ),
);

// 顯示底部表單
Get.bottomSheet(
  Container(child: Text('內容')),
);
```

## 本專案實作特色

### 1. TodoController（lib/controllers/todo_controller.dart）

```dart
class TodoController extends GetxController {
  // 響應式列表
  final _todos = <Todo>[].obs;

  // 響應式過濾器
  final _filter = TodoFilter.all.obs;

  // Getter
  List<Todo> get filteredTodos {
    // 根據過濾器返回對應的 todos
  }

  // 生命週期方法
  @override
  void onInit() {
    super.onInit();
    _loadInitialData();
  }

  // 業務邏輯方法
  void addTodo(String title) { ... }
  void toggleTodo(String id) { ... }
  void deleteTodo(String id) { ... }
}
```

### 2. 響應式 UI 更新

使用 `Obx` 包裹需要自動更新的 Widget：

```dart
Obx(() {
  return Text('共 ${controller.totalCount} 項');
});

Obx(() {
  final todos = controller.filteredTodos;
  return ListView.builder(
    itemCount: todos.length,
    itemBuilder: (context, index) {
      return TodoItem(todo: todos[index]);
    },
  );
});
```

### 3. 依賴注入

在畫面中註冊 Controller：

```dart
class TodoListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 註冊 Controller（如果已存在則返回現有實例）
    final todoController = Get.put(TodoController());

    return Scaffold(
      // ...
    );
  }
}
```

## GetX vs Riverpod 對比

| 特性 | GetX | Riverpod |
|-----|------|----------|
| **學習曲線** | 簡單，API 直觀 | 中等，概念較多 |
| **性能** | 優秀，輕量級 | 優秀，編譯時安全 |
| **依賴注入** | 內建，簡單易用 | 內建，類型安全 |
| **路由管理** | 內建完整路由系統 | 需要額外套件 |
| **編譯時安全** | 較弱，運行時錯誤 | 強，編譯時檢查 |
| **測試友好** | 中等 | 優秀，易於測試 |
| **狀態管理方式** | .obs、GetBuilder、GetX | Provider、StateNotifier、AsyncValue |
| **代碼量** | 少，簡潔 | 中等，較冗長 |
| **社群生態** | 大，資源豐富 | 成長中，Flutter 官方推薦 |
| **全域狀態** | 簡單，Get.find() | 需要明確傳遞 Provider |
| **工具支持** | 內建對話框、SnackBar 等 | 需要 BuildContext |

### GetX 優勢

1. **極簡的 API**：一行代碼即可實現狀態管理
2. **All-in-One**：狀態管理、路由、依賴注入一體化
3. **無需 BuildContext**：可在任何地方使用 Get.to、Get.snackbar 等
4. **學習成本低**：適合快速開發和初學者
5. **輕量級**：包體積小，性能優秀

### Riverpod 優勢

1. **編譯時安全**：減少運行時錯誤
2. **更好的測試性**：易於進行單元測試
3. **明確的依賴關係**：代碼更易維護
4. **官方推薦**：Flutter 團隊推薦的狀態管理方案
5. **更好的解耦**：避免全域狀態污染

### 選擇建議

**選擇 GetX 如果：**
- 需要快速開發原型或 MVP
- 團隊成員是 Flutter 初學者
- 需要一體化解決方案（狀態、路由、依賴注入）
- 偏好簡潔的代碼風格
- 中小型專案

**選擇 Riverpod 如果：**
- 大型企業級應用
- 需要嚴格的類型安全
- 重視代碼可維護性和測試性
- 團隊有豐富的 Flutter 經驗
- 需要細粒度的狀態控制

## 功能特色

- ✅ 新增、編輯、刪除待辦事項
- ✅ 切換完成狀態
- ✅ 過濾顯示（全部、進行中、已完成）
- ✅ 統計資訊（總數、進行中、已完成）
- ✅ 滑動操作（向右滑動切換狀態、向左滑動刪除）
- ✅ 批量操作（全選/取消全選、清除已完成）
- ✅ 響應式 UI 更新
- ✅ Material Design 3 設計

## 如何執行

### 1. 安裝依賴

```bash
flutter pub get
```

### 2. 執行應用程式

```bash
# 在模擬器或真機上執行
flutter run

# 指定設備
flutter run -d chrome    # Web
flutter run -d macos     # macOS
flutter run -d <device-id>
```

### 3. 建置應用程式

```bash
# Android APK
flutter build apk

# iOS
flutter build ios

# Web
flutter build web

# macOS
flutter build macos
```

## 學習重點

### 1. GetX 基礎

- 了解 `.obs` 響應式變數的使用
- 學習 `Obx` 自動更新 UI
- 掌握 `Get.put()` 和 `Get.find()` 依賴注入
- 理解 Controller 的生命週期

### 2. GetX 進階

- 使用 `GetBuilder` 優化性能
- 實作自定義 Bindings
- 使用 GetX 路由管理
- Workers（監聽器）的使用

### 3. 最佳實踐

- 分離業務邏輯和 UI
- 使用 GetX 內建工具（對話框、SnackBar）
- 適當使用響應式和非響應式狀態
- Controller 的合理劃分

## 相關資源

- [GetX 官方文檔](https://github.com/jonataslaw/getx)
- [Flutter 官方網站](https://flutter.dev)
- [GetX 中文文檔](https://github.com/jonataslaw/getx/blob/master/README.zh-cn.md)
- [GetX Pattern](https://github.com/kauemurakami/getx_pattern)

## 技術棧

- Flutter SDK: >=3.0.0
- GetX: ^4.6.6
- Dart: >=3.0.0

## 授權

MIT License
