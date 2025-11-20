# .NET MAUI Todo List

A cross-platform Todo List application built with .NET MAUI, demonstrating modern MVVM architecture and local data persistence.

## 技术栈

- **.NET 8** - Latest .NET framework
- **.NET MAUI** - Multi-platform App UI framework
- **CommunityToolkit.Mvvm** - Modern MVVM implementation
- **SQLite** - Local database (sqlite-net-pcl)
- **XAML** - Declarative UI markup

## 架构特性

- **MVVM 模式**: 清晰的关注点分离
- **依赖注入**: 使用 Microsoft.Extensions.DependencyInjection
- **数据绑定**: 双向数据绑定和命令
- **异步编程**: 完全的 async/await 支持
- **值转换器**: 用于 UI 状态转换

## 功能

- ✅ 添加新任务
- ✅ 标记任务为完成/未完成
- ✅ 删除任务（通过滑动手势）
- ✅ SQLite 本地持久化
- ✅ 响应式 UI 更新
- ✅ 跨平台支持

## 支持的平台

- **Windows 10/11** (版本 19041 或更高)
- **macOS** (通过 Mac Catalyst, macOS 10.15+)
- **iOS** (iOS 11.0+)
- **Android** (API 21+, Android 5.0+)

## 前置要求

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Visual Studio 2022 (17.8+) 或 Visual Studio Code
- MAUI workload:
  ```bash
  dotnet workload install maui
  ```

### 平台特定要求

#### Windows
- Visual Studio 2022 with the .NET Multi-platform App UI development workload

#### macOS
- Xcode (latest stable version)
- Visual Studio 2022 for Mac or Visual Studio Code

#### Android
- Android SDK (自动通过 Visual Studio 安装)
- Android Emulator 或物理设备

#### iOS
- macOS with Xcode
- iOS Simulator 或物理设备

## 构建和运行

### 构建所有平台
```bash
dotnet build
```

### 运行特定平台

#### Windows
```bash
dotnet build -t:Run -f net8.0-windows10.0.19041.0
```

#### Android (需要 Android SDK)
```bash
dotnet build -t:Run -f net8.0-android
```

#### iOS (需要 macOS + Xcode)
```bash
dotnet build -t:Run -f net8.0-ios
```

#### macOS (需要 macOS)
```bash
dotnet build -t:Run -f net8.0-maccatalyst
```

### 使用 Visual Studio
1. 打开 `TodoMaui.csproj`
2. 选择目标平台 (Windows Machine, Android Emulator, iOS Simulator 等)
3. 按 F5 运行

## 项目结构

```
15-maui/
├── Models/
│   └── Todo.cs                      # 数据模型 (SQLite 实体)
├── Services/
│   └── TodoService.cs               # SQLite 数据访问层
├── ViewModels/
│   └── TodoListViewModel.cs         # MVVM ViewModel (使用 CommunityToolkit)
├── Views/
│   ├── TodoListPage.xaml            # 主页面 UI
│   └── TodoListPage.xaml.cs         # Code-behind + 转换器
├── Resources/
│   ├── Styles/
│   │   ├── Colors.xaml              # 颜色资源
│   │   └── Styles.xaml              # UI 样式
│   ├── Fonts/                       # 字体文件
│   ├── Images/                      # 图片资源
│   └── AppIcon/                     # 应用图标
├── App.xaml                         # 应用程序资源
├── App.xaml.cs                      # 应用程序入口
├── AppShell.xaml                    # Shell 导航
├── MauiProgram.cs                   # DI 配置和启动
└── TodoMaui.csproj                  # 项目文件
```

## 核心代码示例

### 数据模型 (Models/Todo.cs)
```csharp
[Table("todos")]
public class Todo
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

### ViewModel (ViewModels/TodoListViewModel.cs)
```csharp
public partial class TodoListViewModel : ObservableObject
{
    [ObservableProperty]
    private string newTodoText = string.Empty;

    public ObservableCollection<Todo> Todos { get; } = new();

    [RelayCommand]
    private async Task AddTodoAsync() { /* ... */ }

    [RelayCommand]
    private async Task ToggleTodoAsync(Todo todo) { /* ... */ }

    [RelayCommand]
    private async Task DeleteTodoAsync(Todo todo) { /* ... */ }
}
```

### 依赖注入 (MauiProgram.cs)
```csharp
// Register Services
string dbPath = Path.Combine(FileSystem.AppDataDirectory, "todos.db");
builder.Services.AddSingleton(new TodoService(dbPath));

// Register ViewModels
builder.Services.AddTransient<TodoListViewModel>();

// Register Views
builder.Services.AddTransient<TodoListPage>();
```

## UI 特性

### CollectionView
- 显示任务列表
- 空状态视图
- 自定义项模板

### Swipe Gestures
- 向左滑动删除任务
- 原生平台手势支持

### CheckBox
- 切换任务完成状态
- 自动持久化更改

### 值转换器
- `CompletedToTextDecorationConverter`: 完成的任务显示删除线
- `CompletedToColorConverter`: 完成的任务变灰色

## NuGet 依赖

```xml
<PackageReference Include="Microsoft.Maui.Controls" Version="8.0.90" />
<PackageReference Include="CommunityToolkit.Mvvm" Version="8.2.2" />
<PackageReference Include="sqlite-net-pcl" Version="1.9.172" />
<PackageReference Include="SQLitePCLRaw.bundle_green" Version="2.1.8" />
```

## 数据存储

SQLite 数据库存储在平台特定的应用数据目录：

- **Windows**: `%LOCALAPPDATA%\Packages\[AppId]\LocalState\todos.db`
- **macOS**: `~/Library/Application Support/[AppId]/todos.db`
- **iOS**: `[App Container]/Library/Application Support/todos.db`
- **Android**: `/data/data/[AppId]/files/todos.db`

## 截图说明

### 主界面
- 顶部: "📝 Todo List" 标题
- 输入区: 文本输入框 + "Add" 按钮
- 列表区:
  - 每个任务显示 CheckBox + 任务文本 + 创建时间
  - 已完成任务: 灰色文字 + 删除线
  - 滑动左侧显示红色 "Delete" 按钮
- 空状态: "No tasks yet!" + "Add a task to get started"

### 交互
- 点击 CheckBox: 切换完成状态
- 向左滑动任务: 显示删除按钮
- 点击 Delete: 删除任务
- 输入框 + Add 按钮: 添加新任务
- 输入框支持 Return 键快速添加

## 开发说明

### 热重载
MAUI 支持 XAML 热重载，修改 XAML 文件后可立即看到效果。

### 调试
- Windows: 直接在 Visual Studio 中调试
- Android: 使用 Android Emulator 或 USB 连接的设备
- iOS: 使用 iOS Simulator (需要 macOS) 或配对的设备

### 已知限制
- 需要安装对应平台的 SDK 才能构建该平台
- iOS/macOS 构建仅支持在 macOS 上进行
- 首次构建可能需要下载额外的 NuGet 包和 SDK 组件

## 许可证

MIT License

## 相关资源

- [.NET MAUI Documentation](https://docs.microsoft.com/dotnet/maui/)
- [CommunityToolkit.Mvvm](https://learn.microsoft.com/dotnet/communitytoolkit/mvvm/)
- [SQLite-net](https://github.com/praeclarum/sqlite-net)
