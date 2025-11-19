# WPF Todo List 應用架構說明

詳細說明 WPF Todo List 應用的整體架構、設計模式和數據流。

## 目錄

1. [架構概覽](#架構概覽)
2. [分層架構](#分層架構)
3. [MVVM 實現](#mvvm-實現)
4. [數據流](#數據流)
5. [服務層設計](#服務層設計)
6. [依賴管理](#依賴管理)
7. [狀態管理](#狀態管理)
8. [錯誤處理](#錯誤處理)

## 架構概覽

### 整體架構圖

```
┌──────────────────────────────────────────────────────────────┐
│                        Presentation Layer                     │
│  ┌────────────┐           ┌─────────────┐                   │
│  │   View     │◄──────────│  ViewModel  │                   │
│  │  (XAML)    │  Binding  │   (Logic)   │                   │
│  └────────────┘           └──────┬──────┘                   │
│                                   │                           │
└───────────────────────────────────┼───────────────────────────┘
                                    │
┌───────────────────────────────────┼───────────────────────────┐
│                         Business Layer                        │
│                            ┌──────▼──────┐                    │
│                            │  Services   │                    │
│                            │ (Business)  │                    │
│                            └──────┬──────┘                    │
└───────────────────────────────────┼───────────────────────────┘
                                    │
┌───────────────────────────────────┼───────────────────────────┐
│                          Data Layer                           │
│                     ┌──────▼──────┐                           │
│                     │   Models    │                           │
│                     │   (Data)    │                           │
│                     └──────┬──────┘                           │
│                            │                                   │
│                     ┌──────▼──────┐                           │
│                     │   Storage   │                           │
│                     │(JSON/SQLite)│                           │
│                     └─────────────┘                           │
└──────────────────────────────────────────────────────────────┘
```

### 架構特點

1. **分層清晰**：Presentation、Business、Data 三層分離
2. **MVVM 模式**：View-ViewModel-Model 解耦
3. **依賴注入**：通過接口實現松耦合
4. **單向數據流**：清晰的數據流動方向
5. **關注點分離**：每層專注於特定職責

### 技術選型

| 層級 | 技術 | 職責 |
|------|------|------|
| Presentation | XAML + WPF | UI 定義和展示 |
| ViewModel | CommunityToolkit.Mvvm | UI 邏輯和狀態管理 |
| Business | Services | 業務邏輯處理 |
| Data | Models + JSON | 數據建模和持久化 |

## 分層架構

### Presentation Layer（表現層）

**職責**：
- 定義用戶界面
- 處理用戶交互
- 顯示數據
- 觸發命令

**組件**：
- **Views（視圖）**：XAML 文件定義 UI
- **Styles（樣式）**：統一視覺風格
- **Converters（轉換器）**：數據顯示轉換
- **Resources（資源）**：可重用的 UI 資源

**文件結構**：
```
Views/
├── MainWindow.xaml
├── MainWindow.xaml.cs
└── TodoItemView.xaml (可選)

Styles/
├── LightTheme.xaml
├── DarkTheme.xaml
└── CommonStyles.xaml

Converters/
├── BoolToVisibilityConverter.cs
├── PriorityToColorConverter.cs
└── DateTimeToStringConverter.cs
```

**設計原則**：
- 代碼後置文件應該最小化
- 所有 UI 邏輯通過數據綁定
- 不直接引用 ViewModel 以外的層

### Business Layer（業務層）

**職責**：
- 實現業務邏輯
- 管理應用狀態
- 協調數據操作
- 提供服務接口

**組件**：
- **ViewModels**：UI 邏輯和狀態
- **Services**：業務邏輯實現
- **Commands**：用戶操作處理

**文件結構**：
```
ViewModels/
├── MainViewModel.cs
└── TodoItemViewModel.cs (可選)

Services/
├── ITodoService.cs
├── TodoService.cs
├── IStorageService.cs
└── JsonStorageService.cs
```

**設計原則**：
- 使用接口定義服務契約
- ViewModel 不直接操作數據存儲
- 通過服務層訪問數據

### Data Layer（數據層）

**職責**：
- 定義數據模型
- 實現數據持久化
- 提供數據訪問

**組件**：
- **Models**：數據實體
- **Storage**：持久化實現

**文件結構**：
```
Models/
├── TodoItem.cs
├── TodoFilter.cs
└── AppSettings.cs

Services/
└── JsonStorageService.cs
```

**設計原則**：
- Model 是 POCO（Plain Old CLR Object）
- 支持 INotifyPropertyChanged
- 不包含業務邏輯

## MVVM 實現

### Model（模型）

**TodoItem.cs**：
```csharp
public partial class TodoItem : ObservableObject
{
    [ObservableProperty]
    private string title = string.Empty;

    [ObservableProperty]
    private bool isCompleted;

    [ObservableProperty]
    private DateTime createdAt;

    [ObservableProperty]
    private TodoPriority priority;

    public Guid Id { get; set; } = Guid.NewGuid();

    partial void OnIsCompletedChanged(bool value)
    {
        CompletedAt = value ? DateTime.Now : null;
    }

    public DateTime? CompletedAt { get; private set; }
}
```

**特點**：
- 使用 CommunityToolkit.Mvvm 的 `ObservableObject`
- 實現 `INotifyPropertyChanged`
- 包含基本驗證邏輯
- 不依賴其他層

### ViewModel（視圖模型）

**MainViewModel.cs**：
```csharp
public partial class MainViewModel : ObservableObject
{
    private readonly ITodoService _todoService;
    private readonly IStorageService _storageService;

    // 可觀察屬性
    [ObservableProperty]
    private ObservableCollection<TodoItem> _allTodos = new();

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(AddTodoCommand))]
    private string _newTodoTitle = string.Empty;

    // 計算屬性
    public int ActiveCount => AllTodos.Count(t => !t.IsCompleted);

    // 命令
    [RelayCommand(CanExecute = nameof(CanAddTodo))]
    private async Task AddTodoAsync()
    {
        var newTodo = new TodoItem { Title = NewTodoTitle };
        await _todoService.AddAsync(newTodo);
        AllTodos.Add(newTodo);
        NewTodoTitle = string.Empty;
    }

    private bool CanAddTodo() => !string.IsNullOrWhiteSpace(NewTodoTitle);
}
```

**特點**：
- 通過依賴注入獲取服務
- 暴露可綁定的屬性和命令
- 不引用 UI 元素
- 可獨立測試

### View（視圖）

**MainWindow.xaml**：
```xml
<Window x:Class="TodoListWPF.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Grid>
        <!-- 輸入區 -->
        <TextBox Text="{Binding NewTodoTitle, UpdateSourceTrigger=PropertyChanged}"/>
        <Button Content="Add" Command="{Binding AddTodoCommand}"/>

        <!-- 列表區 -->
        <ListBox ItemsSource="{Binding FilteredTodos}">
            <ListBox.ItemTemplate>
                <DataTemplate>
                    <StackPanel>
                        <TextBlock Text="{Binding Title}"/>
                        <Button Content="Delete"
                                Command="{Binding DataContext.DeleteTodoCommand,
                                                RelativeSource={RelativeSource AncestorType=Window}}"
                                CommandParameter="{Binding}"/>
                    </StackPanel>
                </DataTemplate>
            </ListBox.ItemTemplate>
        </ListBox>
    </Grid>
</Window>
```

**特點**：
- 純聲明式 XAML
- 通過數據綁定連接 ViewModel
- 代碼後置僅處理視圖生命週期

## 數據流

### 用戶操作流程

```
1. 用戶輸入
   │
   ├─► TextBox (View)
   │       │
   │       │ TwoWay Binding
   │       │
   │       ▼
   └─► NewTodoTitle (ViewModel)
           │
           │ PropertyChanged
           │
           ▼
       CanExecute 檢查
           │
           ▼
       AddTodoCommand 可用

2. 用戶點擊按鈕
   │
   ├─► Button (View)
   │       │
   │       │ Command Binding
   │       │
   │       ▼
   └─► AddTodoCommand (ViewModel)
           │
           ▼
       AddTodoAsync() 執行
           │
           ├─► TodoService.AddAsync()
           │       │
           │       ├─► 創建 TodoItem
           │       │
           │       └─► StorageService.SaveAsync()
           │               │
           │               └─► 寫入 JSON 文件
           │
           ├─► AllTodos.Add()
           │       │
           │       └─► CollectionChanged 事件
           │
           └─► NewTodoTitle = ""
                   │
                   └─► PropertyChanged 事件

3. UI 更新
   │
   ├─► ListBox 自動更新（新項目出現）
   │
   ├─► TextBox 清空
   │
   └─► 統計數字更新
```

### 數據加載流程

```
Application 啟動
    │
    ▼
MainViewModel.InitializeAsync()
    │
    ├─► StorageService.LoadSettingsAsync()
    │       │
    │       └─► 讀取 settings.json
    │               │
    │               └─► 返回 AppSettings
    │
    ├─► TodoService.LoadAsync()
    │       │
    │       └─► StorageService.LoadTodosAsync()
    │               │
    │               └─► 讀取 todos.json
    │                       │
    │                       └─► 返回 List<TodoItem>
    │
    ├─► AllTodos.Clear()
    │
    ├─► AllTodos.Add() for each item
    │       │
    │       └─► UI 自動更新
    │
    └─► 應用設置（主題、篩選器等）
            │
            └─► UI 反映設置
```

### 數據保存流程

```
ViewModel 操作
    │
    ├─► AddTodoAsync()
    ├─► DeleteTodoAsync()
    ├─► ToggleTodoAsync()
    └─► ClearCompletedAsync()
            │
            ▼
    TodoService 方法
            │
            ├─► 更新內存數據
            │
            └─► TodoService.SaveAsync()
                    │
                    ▼
            StorageService.SaveTodosAsync()
                    │
                    ├─► 序列化為 JSON
                    │
                    └─► 寫入文件系統
                            │
                            └─► todos.json 更新
```

## 服務層設計

### 服務接口

#### ITodoService

```csharp
public interface ITodoService
{
    Task<IEnumerable<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(Guid id);
    Task AddAsync(TodoItem item);
    Task UpdateAsync(TodoItem item);
    Task DeleteAsync(Guid id);
    Task DeleteCompletedAsync();
    Task SaveAsync();
    Task LoadAsync();
}
```

**職責**：
- CRUD 操作
- 業務規則實現
- 數據驗證

#### IStorageService

```csharp
public interface IStorageService
{
    Task SaveTodosAsync(IEnumerable<TodoItem> todos);
    Task<IEnumerable<TodoItem>> LoadTodosAsync();
    Task SaveSettingsAsync(AppSettings settings);
    Task<AppSettings> LoadSettingsAsync();
}
```

**職責**：
- 數據持久化
- 序列化/反序列化
- 文件 I/O 操作

### 服務實現

#### TodoService

```csharp
public class TodoService : ITodoService
{
    private readonly List<TodoItem> _todos = new();
    private readonly IStorageService _storageService;

    public TodoService(IStorageService storageService)
    {
        _storageService = storageService;
    }

    public async Task AddAsync(TodoItem item)
    {
        // 1. 驗證
        if (string.IsNullOrWhiteSpace(item.Title))
            throw new ArgumentException("Title is required");

        // 2. 生成 ID
        if (item.Id == Guid.Empty)
            item.Id = Guid.NewGuid();

        // 3. 添加到集合
        _todos.Add(item);

        // 4. 持久化
        await SaveAsync();
    }

    public async Task SaveAsync()
    {
        await _storageService.SaveTodosAsync(_todos);
    }
}
```

**特點**：
- 內存中維護數據集合
- 通過 StorageService 持久化
- 實現業務驗證

#### JsonStorageService

```csharp
public class JsonStorageService : IStorageService
{
    private readonly string _todosFilePath;
    private readonly JsonSerializerOptions _jsonOptions;

    public JsonStorageService()
    {
        var appDataPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "TodoListWPF"
        );
        Directory.CreateDirectory(appDataPath);
        _todosFilePath = Path.Combine(appDataPath, "todos.json");

        _jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task SaveTodosAsync(IEnumerable<TodoItem> todos)
    {
        var json = JsonSerializer.Serialize(todos, _jsonOptions);
        await File.WriteAllTextAsync(_todosFilePath, json);
    }

    public async Task<IEnumerable<TodoItem>> LoadTodosAsync()
    {
        if (!File.Exists(_todosFilePath))
            return Enumerable.Empty<TodoItem>();

        var json = await File.ReadAllTextAsync(_todosFilePath);
        return JsonSerializer.Deserialize<List<TodoItem>>(json, _jsonOptions)
               ?? Enumerable.Empty<TodoItem>();
    }
}
```

**特點**：
- 使用 System.Text.Json
- 存儲在用戶 AppData
- 錯誤處理

## 依賴管理

### 手動依賴注入

當前應用使用簡單的手動依賴注入：

```csharp
// App.xaml.cs
public partial class App : Application
{
    private IStorageService? _storageService;
    private ITodoService? _todoService;
    private MainViewModel? _mainViewModel;

    protected override async void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        // 1. 創建服務實例
        _storageService = new JsonStorageService();
        _todoService = new TodoService(_storageService);

        // 2. 創建 ViewModel
        _mainViewModel = new MainViewModel(_todoService, _storageService);

        // 3. 初始化
        await _mainViewModel.InitializeAsync();

        // 4. 創建視圖
        var mainWindow = new MainWindow
        {
            DataContext = _mainViewModel
        };

        mainWindow.Show();
    }
}
```

### 使用 DI 容器（可選）

對於大型應用，推薦使用 DI 容器（如 Microsoft.Extensions.DependencyInjection）：

```csharp
public partial class App : Application
{
    private IServiceProvider? _serviceProvider;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        var services = new ServiceCollection();
        ConfigureServices(services);
        _serviceProvider = services.BuildServiceProvider();

        var mainWindow = _serviceProvider.GetRequiredService<MainWindow>();
        mainWindow.Show();
    }

    private void ConfigureServices(IServiceCollection services)
    {
        // 註冊服務
        services.AddSingleton<IStorageService, JsonStorageService>();
        services.AddSingleton<ITodoService, TodoService>();

        // 註冊 ViewModels
        services.AddTransient<MainViewModel>();

        // 註冊 Views
        services.AddTransient<MainWindow>();
    }
}
```

### 依賴圖

```
MainWindow
    │
    └─► MainViewModel
            │
            ├─► ITodoService
            │       │
            │       └─► IStorageService
            │
            └─► IStorageService
```

## 狀態管理

### ViewModel 狀態

```csharp
public partial class MainViewModel : ObservableObject
{
    // UI 狀態
    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    // 數據狀態
    [ObservableProperty]
    private ObservableCollection<TodoItem> _allTodos = new();

    [ObservableProperty]
    private TodoItem? _selectedTodo;

    // 篩選狀態
    [ObservableProperty]
    private TodoFilter _currentFilter = TodoFilter.All;

    [ObservableProperty]
    private string _searchText = string.Empty;

    // 設置狀態
    [ObservableProperty]
    private AppSettings _settings = new();
}
```

### 應用狀態持久化

```csharp
// 保存窗口狀態
protected override async void OnClosing(CancelEventArgs e)
{
    if (DataContext is MainViewModel viewModel)
    {
        viewModel.Settings.WindowWidth = Width;
        viewModel.Settings.WindowHeight = Height;
        viewModel.Settings.WindowLeft = Left;
        viewModel.Settings.WindowTop = Top;
        viewModel.Settings.IsMaximized = WindowState == WindowState.Maximized;

        await viewModel.SaveStateAsync();
    }
    base.OnClosing(e);
}

// 恢復窗口狀態
protected override void OnSourceInitialized(EventArgs e)
{
    base.OnSourceInitialized(e);

    if (DataContext is MainViewModel viewModel)
    {
        Width = viewModel.Settings.WindowWidth;
        Height = viewModel.Settings.WindowHeight;
        Left = viewModel.Settings.WindowLeft;
        Top = viewModel.Settings.WindowTop;

        if (viewModel.Settings.IsMaximized)
            WindowState = WindowState.Maximized;
    }
}
```

## 錯誤處理

### 服務層錯誤處理

```csharp
public async Task SaveTodosAsync(IEnumerable<TodoItem> todos)
{
    try
    {
        var json = JsonSerializer.Serialize(todos, _jsonOptions);
        await File.WriteAllTextAsync(_todosFilePath, json);
    }
    catch (IOException ex)
    {
        System.Diagnostics.Debug.WriteLine($"IO Error: {ex.Message}");
        throw new StorageException("Failed to save todos", ex);
    }
    catch (JsonException ex)
    {
        System.Diagnostics.Debug.WriteLine($"Serialization Error: {ex.Message}");
        throw new StorageException("Failed to serialize todos", ex);
    }
}
```

### ViewModel 錯誤處理

```csharp
[RelayCommand]
private async Task LoadTodosAsync()
{
    IsLoading = true;
    ErrorMessage = null;

    try
    {
        await _todoService.LoadAsync();
        var todos = await _todoService.GetAllAsync();

        AllTodos.Clear();
        foreach (var todo in todos)
        {
            AllTodos.Add(todo);
        }
    }
    catch (StorageException ex)
    {
        ErrorMessage = $"Failed to load todos: {ex.Message}";
        // 可選：顯示對話框通知用戶
    }
    catch (Exception ex)
    {
        ErrorMessage = $"Unexpected error: {ex.Message}";
        System.Diagnostics.Debug.WriteLine($"Error: {ex}");
    }
    finally
    {
        IsLoading = false;
    }
}
```

### UI 錯誤顯示

```xml
<!-- 錯誤消息顯示 -->
<TextBlock Text="{Binding ErrorMessage}"
           Foreground="Red"
           Visibility="{Binding ErrorMessage, Converter={StaticResource NullToVisibilityConverter}}"/>

<!-- 加載指示器 -->
<ProgressBar IsIndeterminate="{Binding IsLoading}"
             Visibility="{Binding IsLoading, Converter={StaticResource BoolToVisibilityConverter}}"/>
```

## 架構優勢

1. **可測試性**：各層可獨立測試
2. **可維護性**：清晰的職責分離
3. **可擴展性**：易於添加新功能
4. **可重用性**：服務和組件可重用
5. **可讀性**：代碼結構清晰

## 擴展建議

### 1. 添加日誌系統

```csharp
public interface ILogger
{
    void LogInfo(string message);
    void LogError(string message, Exception ex);
}
```

### 2. 實現 Messenger 模式

用於 ViewModel 之間通信：

```csharp
// CommunityToolkit.Mvvm 提供
Messenger.Send(new TodoUpdatedMessage(todo));
```

### 3. 添加驗證層

```csharp
public interface IValidator<T>
{
    ValidationResult Validate(T item);
}
```

### 4. 切換到 SQLite

```csharp
public class SqliteStorageService : IStorageService
{
    private readonly TodoDbContext _dbContext;
    // 使用 Entity Framework Core
}
```

---

## 總結

WPF Todo List 應用採用了：

- **分層架構**：清晰的 Presentation、Business、Data 分層
- **MVVM 模式**：View-ViewModel-Model 完全解耦
- **依賴注入**：通過接口實現松耦合
- **服務導向**：業務邏輯封裝在服務中
- **狀態管理**：集中的狀態管理和持久化

這種架構設計確保了應用的可維護性、可測試性和可擴展性！
