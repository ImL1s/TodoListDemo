# Avalonia Todo List

A cross-platform desktop Todo List application built with Avalonia UI, demonstrating modern MVVM architecture with ReactiveUI and local data persistence.

## 技术栈

- **.NET 8** - Latest .NET framework
- **Avalonia UI 11.x** - Cross-platform XAML-based UI framework
- **ReactiveUI** - Reactive MVVM framework
- **SQLite** - Local database (sqlite-net-pcl)
- **AXAML** - Avalonia's XAML dialect
- **Microsoft.Extensions.DependencyInjection** - Dependency injection

## 架构特性

- **MVVM 模式**: ReactiveUI + ViewModelBase
- **依赖注入**: Microsoft.Extensions.DependencyInjection
- **响应式编程**: ReactiveCommand for async operations
- **数据绑定**: Compiled bindings for better performance
- **Fluent Theme**: Modern, platform-native look and feel

## 功能

- ✅ 添加新任务
- ✅ 标记任务为完成/未完成
- ✅ 删除任务
- ✅ SQLite 本地持久化
- ✅ 响应式 UI 更新
- ✅ 键盘快捷键 (Enter 添加任务)
- ✅ 跨平台支持

## 支持的平台

- **Windows 10/11** (x64, ARM64)
- **Linux** (x64, ARM64) - with X11 or Wayland
- **macOS** (x64, ARM64/Apple Silicon)

## 前置要求

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- IDE (推荐):
  - Visual Studio 2022 (17.8+)
  - Visual Studio Code with C# extension
  - JetBrains Rider

### 平台特定要求

#### Windows
- 无额外要求，开箱即用

#### Linux
- 需要 X11 或 Wayland 显示服务器
- 常见依赖 (Ubuntu/Debian):
  ```bash
  sudo apt install libx11-6 libice6 libsm6 libfontconfig1
  ```

#### macOS
- macOS 10.15 (Catalina) 或更高版本
- 无需 Xcode (不同于 .NET MAUI)

## 构建和运行

### 快速开始
```bash
# 恢复依赖
dotnet restore

# 构建项目
dotnet build

# 运行应用
dotnet run
```

### 发布独立应用

#### Windows (单文件可执行)
```bash
dotnet publish -c Release -r win-x64 --self-contained -p:PublishSingleFile=true
```

#### Linux
```bash
dotnet publish -c Release -r linux-x64 --self-contained
```

#### macOS
```bash
dotnet publish -c Release -r osx-x64 --self-contained
# 对于 Apple Silicon:
dotnet publish -c Release -r osx-arm64 --self-contained
```

### 使用 Visual Studio / Rider
1. 打开 `TodoAvalonia.csproj`
2. 按 F5 运行
3. 或右键项目 → Run/Debug

## 项目结构

```
16-avalonia/
├── Models/
│   └── Todo.cs                      # 数据模型 (SQLite 实体)
├── Services/
│   └── TodoService.cs               # SQLite 数据访问层
├── ViewModels/
│   ├── ViewModelBase.cs             # ReactiveObject 基类
│   └── MainWindowViewModel.cs       # 主 ViewModel (ReactiveUI)
├── Views/
│   ├── MainWindow.axaml             # 主窗口 UI
│   └── MainWindow.axaml.cs          # Code-behind
├── Assets/
│   └── avalonia-logo.ico            # 应用图标
├── App.axaml                        # 应用程序资源和主题
├── App.axaml.cs                     # 应用程序启动和 DI 配置
├── Program.cs                       # 程序入口点
├── app.manifest                     # Windows manifest (DPI 感知等)
└── TodoAvalonia.csproj              # 项目文件
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

### ViewModel (ViewModels/MainWindowViewModel.cs)
```csharp
public class MainWindowViewModel : ViewModelBase
{
    public ReactiveCommand<Unit, Unit> AddTodoCommand { get; }
    public ReactiveCommand<Todo, Unit> ToggleTodoCommand { get; }
    public ReactiveCommand<Todo, Unit> DeleteTodoCommand { get; }

    public ObservableCollection<Todo> Todos { get; } = new();

    public MainWindowViewModel(TodoService todoService)
    {
        _todoService = todoService;
        AddTodoCommand = ReactiveCommand.CreateFromTask(AddTodoAsync);
        // ...
    }
}
```

### 依赖注入 (App.axaml.cs)
```csharp
private void ConfigureServices(IServiceCollection services)
{
    string dbPath = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "TodoAvalonia", "todos.db");

    services.AddSingleton(new TodoService(dbPath));
    services.AddTransient<MainWindowViewModel>();
}
```

## UI 特性

### AXAML 样式系统
- **Fluent Theme**: Windows 11 风格的现代 UI
- **样式选择器**: CSS-like 样式系统
- **伪类**: `:pointerover`, `:pressed` 等
- **响应式布局**: DockPanel, Grid, StackPanel

### 数据绑定
```xaml
<!-- Compiled bindings with x:DataType -->
<TextBox Text="{Binding NewTodoText}" x:DataType="vm:MainWindowViewModel"/>

<!-- Command binding -->
<Button Command="{Binding AddTodoCommand}" Content="Add"/>

<!-- Conditional styling -->
<TextBlock Classes.completed="{Binding IsCompleted}"/>
```

### 键盘支持
- **Enter**: 在输入框中按 Enter 快速添加任务
- 完全的键盘导航支持

## NuGet 依赖

```xml
<PackageReference Include="Avalonia" Version="11.1.3" />
<PackageReference Include="Avalonia.Desktop" Version="11.1.3" />
<PackageReference Include="Avalonia.Themes.Fluent" Version="11.1.3" />
<PackageReference Include="Avalonia.ReactiveUI" Version="11.1.3" />
<PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="8.0.0" />
<PackageReference Include="sqlite-net-pcl" Version="1.9.172" />
<PackageReference Include="SQLitePCLRaw.bundle_green" Version="2.1.8" />
```

## 数据存储

SQLite 数据库存储在平台特定的应用数据目录：

- **Windows**: `%LOCALAPPDATA%\TodoAvalonia\todos.db`
- **Linux**: `~/.local/share/TodoAvalonia/todos.db`
- **macOS**: `~/Library/Application Support/TodoAvalonia/todos.db`

## 截图说明

### 主窗口
- **尺寸**: 600x700 像素 (可调整，最小 400x500)
- **标题栏**: "Todo List" + 应用图标

### 布局
1. **顶部标题**: "📝 Todo List" (32pt, 粗体, 居中)
2. **输入区域**:
   - 左侧: 文本输入框 (占满宽度)
   - 右侧: 蓝色 "Add" 按钮
3. **任务列表** (可滚动):
   - 每个任务: CheckBox + 任务文本 + 时间戳 + 红色 Delete 按钮
   - 已完成任务: 灰色文字 + 删除线
   - 白色卡片背景 + 圆角边框

### 主题
- **亮色主题**: 白色背景，现代 Fluent 设计
- **蓝色强调色**: #007AFF (iOS/macOS 风格)
- **红色删除按钮**: #FF3B30
- **圆角设计**: 8px 圆角 (卡片和按钮)

## Avalonia vs MAUI 对比

| 特性 | Avalonia | .NET MAUI |
|------|----------|-----------|
| **平台** | Windows, Linux, macOS | Windows, macOS, iOS, Android |
| **移动支持** | ❌ 无 | ✅ iOS + Android |
| **Linux 支持** | ✅ 原生 | ❌ 无 |
| **构建依赖** | 最小 | 大 (需要 Xcode 等) |
| **UI 框架** | 自绘制 | 原生控件包装 |
| **成熟度** | 稳定 (社区) | 较新 (官方) |
| **包大小** | 小 (~20MB) | 大 (~50-100MB) |
| **性能** | 优秀 | 良好 |
| **学习曲线** | 中等 (类 WPF) | 中等 (Xamarin 演进) |

## 开发说明

### 热重载
Avalonia 支持 XAML 热重载 (在 VS 2022 和 Rider 中)：
```bash
# 启用热重载运行
dotnet watch run
```

### 调试
- 按 F12 打开 Avalonia DevTools (Debug 模式)
- 实时查看和编辑 XAML 树
- 检查数据绑定和样式

### AXAML 预览
- Visual Studio: 内置预览器
- VS Code: 安装 "Avalonia for VSCode" 扩展
- Rider: 内置预览器 (推荐)

## 常见问题

### Q: 为什么选择 Avalonia 而不是 WPF?
A: Avalonia 是跨平台的，支持 Windows、Linux 和 macOS，而 WPF 只支持 Windows。

### Q: Avalonia 能用在生产环境吗?
A: 是的！许多商业应用使用 Avalonia，包括 JetBrains 的一些工具。

### Q: 性能如何?
A: Avalonia 使用 Skia 渲染引擎，性能优秀，支持硬件加速。

### Q: 与 Electron 相比如何?
A: Avalonia 应用更小、更快、内存占用更少，但不支持 Web 技术栈。

## 扩展建议

1. **添加任务编辑**: 双击任务进行编辑
2. **任务过滤**: 显示全部/活动/已完成
3. **任务分类**: 添加标签或分类
4. **数据导出**: 导出为 JSON/CSV
5. **多窗口**: 支持打开多个窗口
6. **主题切换**: 亮色/暗色主题
7. **云同步**: 集成云存储服务

## 许可证

MIT License

## 相关资源

- [Avalonia Documentation](https://docs.avaloniaui.net/)
- [Avalonia GitHub](https://github.com/AvaloniaUI/Avalonia)
- [ReactiveUI Documentation](https://www.reactiveui.net/)
- [Avalonia Samples](https://github.com/AvaloniaUI/Avalonia.Samples)
- [Avalonia Community](https://github.com/AvaloniaCommunity)

## 致谢

- Avalonia UI 团队
- ReactiveUI 贡献者
- .NET 社区
