# MVVM 模式完全指南

深入理解 WPF 中的 Model-View-ViewModel (MVVM) 架構模式。

## 目錄

1. [MVVM 簡介](#mvvm-簡介)
2. [核心概念](#核心概念)
3. [組件詳解](#組件詳解)
4. [數據綁定原理](#數據綁定原理)
5. [INotifyPropertyChanged](#inotifypropertychanged)
6. [CommunityToolkit.Mvvm 使用](#communitytoolkitmvvm-使用)
7. [最佳實踐](#最佳實踐)
8. [常見問題](#常見問題)

## MVVM 簡介

### 什麼是 MVVM？

MVVM (Model-View-ViewModel) 是一種軟件架構模式，專為構建用戶界面應用而設計。它由 Microsoft 在 2005 年提出，特別適合 WPF、UWP 和 Xamarin 等支持數據綁定的平台。

### 為什麼使用 MVVM？

**優點**：
1. **關注點分離**：UI 和業務邏輯完全分離
2. **可測試性**：ViewModel 可以獨立測試，無需 UI
3. **可維護性**：代碼結構清晰，易於維護
4. **團隊協作**：設計師和開發者可以並行工作
5. **代碼重用**：ViewModel 可以在不同 View 中重用

**對比傳統模式**：

| 特性 | Code-Behind | MVVM |
|------|-------------|------|
| UI 邏輯位置 | View 代碼後置 | ViewModel |
| 可測試性 | 困難（需要 UI） | 容易（純 C#） |
| 數據綁定 | 手動更新 | 自動同步 |
| 代碼重用 | 低 | 高 |
| 設計器友好 | 否 | 是 |

### MVVM 架構圖

```
┌──────────────────────────────────────────────────────────┐
│                         Application                       │
└──────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼─────┐      ┌────────▼──────┐      ┌──────▼──────┐
│    View     │      │  ViewModel    │      │    Model    │
│   (XAML)    │◄─────│   (Logic)     │◄─────│   (Data)    │
└─────────────┘      └───────────────┘      └─────────────┘
        │                     │                     │
   UI Controls          Properties             Business
   Data Binding         Commands               Objects
   Events               Notifications          Validation
```

## 核心概念

### 三層架構

#### 1. Model（模型）

**定義**：表示應用的數據和業務規則。

**職責**：
- 定義數據結構
- 包含業務邏輯
- 數據驗證
- 與數據源交互

**特點**：
- 不依賴於 View 或 ViewModel
- 可以是 POCO (Plain Old CLR Object)
- 通常實現 INotifyPropertyChanged

**示例**：

```csharp
public class TodoItem : ObservableObject
{
    private string _title = string.Empty;
    private bool _isCompleted;

    public Guid Id { get; set; }

    public string Title
    {
        get => _title;
        set => SetProperty(ref _title, value);
    }

    public bool IsCompleted
    {
        get => _isCompleted;
        set => SetProperty(ref _isCompleted, value);
    }

    public DateTime CreatedAt { get; set; }
}
```

#### 2. View（視圖）

**定義**：用戶界面的可視化表示。

**職責**：
- 定義 UI 結構（XAML）
- 響應用戶輸入
- 顯示數據
- 觸發命令

**特點**：
- 主要使用 XAML 聲明式定義
- 代碼後置文件應該最小化
- 通過 DataContext 綁定到 ViewModel

**示例**：

```xml
<Window x:Class="TodoListWPF.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Grid>
        <TextBox Text="{Binding NewTodoTitle, UpdateSourceTrigger=PropertyChanged}"/>
        <Button Content="Add" Command="{Binding AddTodoCommand}"/>
        <ListBox ItemsSource="{Binding Todos}"/>
    </Grid>
</Window>
```

#### 3. ViewModel（視圖模型）

**定義**：View 和 Model 之間的中介。

**職責**：
- 暴露 View 需要的數據
- 實現命令（Commands）
- 處理 UI 邏輯
- 數據轉換和格式化
- 狀態管理

**特點**：
- 不引用 View（UI 元素）
- 實現 INotifyPropertyChanged
- 包含可綁定的屬性和命令
- 可以獨立測試

**示例**：

```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private ObservableCollection<TodoItem> _todos = new();

    [ObservableProperty]
    private string _newTodoTitle = string.Empty;

    [RelayCommand]
    private void AddTodo()
    {
        if (!string.IsNullOrWhiteSpace(NewTodoTitle))
        {
            Todos.Add(new TodoItem { Title = NewTodoTitle });
            NewTodoTitle = string.Empty;
        }
    }
}
```

## 組件詳解

### Model 層深入

#### 數據模型

```csharp
// 簡單的數據模型
public class TodoItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

#### 可觀察模型

```csharp
// 支持屬性變更通知的模型
public class TodoItem : ObservableObject
{
    private string _title = string.Empty;
    private bool _isCompleted;

    public string Title
    {
        get => _title;
        set => SetProperty(ref _title, value);
    }

    public bool IsCompleted
    {
        get => _isCompleted;
        set
        {
            if (SetProperty(ref _isCompleted, value))
            {
                // 屬性變更時的副作用
                CompletedAt = value ? DateTime.Now : null;
            }
        }
    }

    public DateTime? CompletedAt { get; private set; }
}
```

#### 業務邏輯

```csharp
public class TodoItem : ObservableObject
{
    // ... 屬性定義 ...

    // 業務規則
    public bool CanDelete => !IsCompleted || CreatedAt < DateTime.Now.AddDays(-30);

    // 業務方法
    public void MarkAsCompleted()
    {
        if (!IsCompleted)
        {
            IsCompleted = true;
            CompletedAt = DateTime.Now;
        }
    }

    // 驗證
    public bool IsValid()
    {
        return !string.IsNullOrWhiteSpace(Title) && Title.Length <= 200;
    }
}
```

### ViewModel 層深入

#### 屬性暴露

```csharp
public partial class MainViewModel : ObservableObject
{
    // 1. 簡單屬性
    [ObservableProperty]
    private string _title = string.Empty;

    // 2. 集合屬性
    [ObservableProperty]
    private ObservableCollection<TodoItem> _todos = new();

    // 3. 計算屬性
    public int TodoCount => Todos.Count;
    public int ActiveCount => Todos.Count(t => !t.IsCompleted);

    // 4. 依賴屬性通知
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(TodoCount))]
    [NotifyPropertyChangedFor(nameof(ActiveCount))]
    private ObservableCollection<TodoItem> _items = new();
}
```

#### 命令實現

```csharp
public partial class MainViewModel : ObservableObject
{
    // 1. 簡單命令
    [RelayCommand]
    private void AddTodo()
    {
        Todos.Add(new TodoItem { Title = NewTodoTitle });
    }

    // 2. 帶參數的命令
    [RelayCommand]
    private void DeleteTodo(TodoItem item)
    {
        Todos.Remove(item);
    }

    // 3. 帶 CanExecute 的命令
    [RelayCommand(CanExecute = nameof(CanAddTodo))]
    private void AddTodoWithValidation()
    {
        Todos.Add(new TodoItem { Title = NewTodoTitle });
        NewTodoTitle = string.Empty;
    }

    private bool CanAddTodo() => !string.IsNullOrWhiteSpace(NewTodoTitle);

    // 4. 異步命令
    [RelayCommand]
    private async Task LoadTodosAsync()
    {
        IsLoading = true;
        try
        {
            var todos = await _todoService.GetAllAsync();
            Todos.Clear();
            foreach (var todo in todos)
            {
                Todos.Add(todo);
            }
        }
        finally
        {
            IsLoading = false;
        }
    }
}
```

#### 狀態管理

```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    [ObservableProperty]
    private TodoFilter _currentFilter = TodoFilter.All;

    partial void OnCurrentFilterChanged(TodoFilter value)
    {
        // 當篩選器改變時刷新視圖
        FilteredTodos.Refresh();
    }
}
```

### View 層深入

#### DataContext 設置

**方法 1：代碼後置設置**

```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        DataContext = new MainViewModel();
    }
}
```

**方法 2：XAML 中設置**

```xml
<Window.DataContext>
    <vm:MainViewModel/>
</Window.DataContext>
```

**方法 3：依賴注入（推薦）**

```csharp
public partial class MainWindow : Window
{
    public MainWindow(MainViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;
    }
}
```

#### 綁定語法

```xml
<!-- 單向綁定 -->
<TextBlock Text="{Binding Title}"/>

<!-- 雙向綁定 -->
<TextBox Text="{Binding Title, Mode=TwoWay}"/>

<!-- 即時更新 -->
<TextBox Text="{Binding Title, UpdateSourceTrigger=PropertyChanged}"/>

<!-- 命令綁定 -->
<Button Content="Add" Command="{Binding AddTodoCommand}"/>

<!-- 帶參數的命令 -->
<Button Content="Delete"
        Command="{Binding DeleteTodoCommand}"
        CommandParameter="{Binding}"/>

<!-- 相對綁定 -->
<Button Command="{Binding DataContext.DeleteCommand,
                         RelativeSource={RelativeSource AncestorType=Window}}"
        CommandParameter="{Binding}"/>
```

## 數據綁定原理

### 綁定機制

WPF 數據綁定是通過以下機制實現的：

```
┌─────────────┐                    ┌──────────────┐
│    View     │                    │  ViewModel   │
│             │                    │              │
│  Property   │◄──── Binding ─────►│  Property    │
│   (Target)  │                    │  (Source)    │
└─────────────┘                    └──────────────┘
       │                                   │
       │                                   │
   Get Value                        PropertyChanged
   Set Value                           Event
```

### 綁定模式

#### OneWay（單向綁定）

數據從源流向目標，源更新時目標自動更新。

```xml
<TextBlock Text="{Binding TodoCount, Mode=OneWay}"/>
```

```
Source (ViewModel) ────► Target (View)
    更新通知             自動更新
```

#### TwoWay（雙向綁定）

數據在源和目標之間雙向同步。

```xml
<TextBox Text="{Binding Title, Mode=TwoWay}"/>
```

```
Source (ViewModel) ◄───► Target (View)
    更新通知             用戶輸入
```

#### OneWayToSource

數據從目標流向源（較少使用）。

```xml
<Slider Value="{Binding SliderValue, Mode=OneWayToSource}"/>
```

#### OneTime

僅在初始化時綁定一次。

```xml
<TextBlock Text="{Binding InitialTitle, Mode=OneTime}"/>
```

### UpdateSourceTrigger

控制何時更新源屬性：

```xml
<!-- PropertyChanged：每次屬性變更時 -->
<TextBox Text="{Binding Title, UpdateSourceTrigger=PropertyChanged}"/>

<!-- LostFocus：失去焦點時（默認） -->
<TextBox Text="{Binding Title, UpdateSourceTrigger=LostFocus}"/>

<!-- Explicit：手動調用 UpdateSource() -->
<TextBox Text="{Binding Title, UpdateSourceTrigger=Explicit}"/>
```

### 綁定路徑

```xml
<!-- 簡單屬性 -->
<TextBlock Text="{Binding Title}"/>

<!-- 嵌套屬性 -->
<TextBlock Text="{Binding SelectedTodo.Title}"/>

<!-- 索引器 -->
<TextBlock Text="{Binding Todos[0].Title}"/>

<!-- 當前項 -->
<TextBlock Text="{Binding /}"/>
```

## INotifyPropertyChanged

### 原理

INotifyPropertyChanged 是 WPF 數據綁定的核心接口，用於通知 UI 屬性值已更改。

```csharp
public interface INotifyPropertyChanged
{
    event PropertyChangedEventHandler? PropertyChanged;
}
```

### 手動實現

```csharp
public class TodoItem : INotifyPropertyChanged
{
    private string _title = string.Empty;

    public string Title
    {
        get => _title;
        set
        {
            if (_title != value)
            {
                _title = value;
                OnPropertyChanged(nameof(Title));
            }
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    protected virtual void OnPropertyChanged(string propertyName)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

### 使用 CallerMemberName

```csharp
public class TodoItem : INotifyPropertyChanged
{
    private string _title = string.Empty;

    public string Title
    {
        get => _title;
        set
        {
            if (_title != value)
            {
                _title = value;
                OnPropertyChanged(); // 自動獲取屬性名
            }
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    protected virtual void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

### 使用基類

```csharp
public class ObservableObject : INotifyPropertyChanged
{
    public event PropertyChangedEventHandler? PropertyChanged;

    protected virtual void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string? propertyName = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value))
            return false;

        field = value;
        OnPropertyChanged(propertyName);
        return true;
    }
}

// 使用
public class TodoItem : ObservableObject
{
    private string _title = string.Empty;

    public string Title
    {
        get => _title;
        set => SetProperty(ref _title, value);
    }
}
```

## CommunityToolkit.Mvvm 使用

### 簡介

CommunityToolkit.Mvvm（前身是 Microsoft.Toolkit.Mvvm）是 Microsoft 官方提供的 MVVM 工具包，使用源代碼生成器簡化 MVVM 實現。

### 安裝

```bash
dotnet add package CommunityToolkit.Mvvm
```

### ObservableObject

**基礎用法**：

```csharp
public partial class TodoItem : ObservableObject
{
    [ObservableProperty]
    private string _title = string.Empty;

    [ObservableProperty]
    private bool _isCompleted;
}

// 生成的代碼等效於：
public string Title
{
    get => _title;
    set => SetProperty(ref _title, value);
}
```

**屬性通知**：

```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(FullName))]
    private string _firstName = string.Empty;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(FullName))]
    private string _lastName = string.Empty;

    public string FullName => $"{FirstName} {LastName}";
}
```

**屬性變更回調**：

```csharp
public partial class TodoItem : ObservableObject
{
    [ObservableProperty]
    private bool _isCompleted;

    partial void OnIsCompletedChanged(bool value)
    {
        CompletedAt = value ? DateTime.Now : null;
    }

    public DateTime? CompletedAt { get; private set; }
}
```

### RelayCommand

**同步命令**：

```csharp
public partial class MainViewModel : ObservableObject
{
    [RelayCommand]
    private void AddTodo()
    {
        Todos.Add(new TodoItem { Title = NewTodoTitle });
    }

    // 生成：
    // public ICommand AddTodoCommand { get; }
}
```

**異步命令**：

```csharp
public partial class MainViewModel : ObservableObject
{
    [RelayCommand]
    private async Task LoadDataAsync()
    {
        IsLoading = true;
        try
        {
            await Task.Delay(1000);
            // 加載數據...
        }
        finally
        {
            IsLoading = false;
        }
    }

    // 生成：
    // public IAsyncRelayCommand LoadDataCommand { get; }
}
```

**CanExecute**：

```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(AddTodoCommand))]
    private string _newTodoTitle = string.Empty;

    [RelayCommand(CanExecute = nameof(CanAddTodo))]
    private void AddTodo()
    {
        Todos.Add(new TodoItem { Title = NewTodoTitle });
        NewTodoTitle = string.Empty;
    }

    private bool CanAddTodo() => !string.IsNullOrWhiteSpace(NewTodoTitle);
}
```

**帶參數的命令**：

```csharp
public partial class MainViewModel : ObservableObject
{
    [RelayCommand]
    private void DeleteTodo(TodoItem item)
    {
        Todos.Remove(item);
    }

    [RelayCommand]
    private async Task UpdateTodoAsync(TodoItem item)
    {
        await _service.UpdateAsync(item);
    }
}
```

### 實際應用示例

```csharp
public partial class MainViewModel : ObservableObject
{
    private readonly ITodoService _todoService;

    [ObservableProperty]
    private ObservableCollection<TodoItem> _todos = new();

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(AddTodoCommand))]
    private string _newTodoTitle = string.Empty;

    [ObservableProperty]
    private TodoFilter _currentFilter = TodoFilter.All;

    [ObservableProperty]
    private bool _isLoading;

    public int ActiveCount => Todos.Count(t => !t.IsCompleted);

    public MainViewModel(ITodoService todoService)
    {
        _todoService = todoService;
        Todos.CollectionChanged += (s, e) => OnPropertyChanged(nameof(ActiveCount));
    }

    [RelayCommand(CanExecute = nameof(CanAddTodo))]
    private async Task AddTodoAsync()
    {
        var newTodo = new TodoItem { Title = NewTodoTitle };
        await _todoService.AddAsync(newTodo);
        Todos.Add(newTodo);
        NewTodoTitle = string.Empty;
    }

    private bool CanAddTodo() => !string.IsNullOrWhiteSpace(NewTodoTitle);

    [RelayCommand]
    private async Task DeleteTodoAsync(TodoItem item)
    {
        await _todoService.DeleteAsync(item.Id);
        Todos.Remove(item);
    }

    [RelayCommand]
    private async Task LoadTodosAsync()
    {
        IsLoading = true;
        try
        {
            var todos = await _todoService.GetAllAsync();
            Todos.Clear();
            foreach (var todo in todos)
            {
                Todos.Add(todo);
            }
        }
        finally
        {
            IsLoading = false;
        }
    }

    partial void OnCurrentFilterChanged(TodoFilter value)
    {
        // 篩選器變更時的處理邏輯
    }
}
```

## 最佳實踐

### 1. ViewModel 設計原則

**單一職責**：
```csharp
// ❌ 不好：一個 ViewModel 處理多個視圖
public class ApplicationViewModel { ... }

// ✅ 好：每個視圖一個 ViewModel
public class MainViewModel { ... }
public class SettingsViewModel { ... }
```

**不引用 View**：
```csharp
// ❌ 不好：在 ViewModel 中引用 UI 元素
public class MainViewModel
{
    public void UpdateUI(TextBox textBox)
    {
        textBox.Text = "Updated";
    }
}

// ✅ 好：通過屬性和綁定
public class MainViewModel
{
    [ObservableProperty]
    private string _displayText = "Updated";
}
```

### 2. 命令最佳實踐

**使用 CanExecute**：
```csharp
[RelayCommand(CanExecute = nameof(CanSave))]
private async Task SaveAsync()
{
    await _service.SaveAsync(Data);
}

private bool CanSave() => HasChanges && !IsSaving;
```

**異步命令處理**：
```csharp
[RelayCommand]
private async Task LoadDataAsync()
{
    IsLoading = true;
    try
    {
        Data = await _service.LoadAsync();
    }
    catch (Exception ex)
    {
        ErrorMessage = ex.Message;
    }
    finally
    {
        IsLoading = false;
    }
}
```

### 3. 集合更新

**使用 ObservableCollection**：
```csharp
// ✅ 自動通知 UI
public ObservableCollection<TodoItem> Todos { get; } = new();

// ❌ 不會通知 UI
public List<TodoItem> Todos { get; set; } = new();
```

**大量更新優化**：
```csharp
// ❌ 不好：多次觸發通知
foreach (var item in newItems)
{
    Todos.Add(item);
}

// ✅ 好：一次性替換
var newCollection = new ObservableCollection<TodoItem>(newItems);
Todos = newCollection;
```

### 4. 依賴注入

```csharp
// ViewModel
public class MainViewModel
{
    private readonly ITodoService _todoService;
    private readonly IDialogService _dialogService;

    public MainViewModel(
        ITodoService todoService,
        IDialogService dialogService)
    {
        _todoService = todoService;
        _dialogService = dialogService;
    }
}

// 註冊服務
services.AddSingleton<ITodoService, TodoService>();
services.AddTransient<MainViewModel>();
```

## 常見問題

### Q1：ViewModel 如何顯示對話框？

**A**：使用服務抽象：

```csharp
public interface IDialogService
{
    Task<bool> ShowConfirmationAsync(string message);
    Task ShowErrorAsync(string message);
}

public class MainViewModel
{
    private readonly IDialogService _dialogService;

    [RelayCommand]
    private async Task DeleteAsync(TodoItem item)
    {
        var confirmed = await _dialogService.ShowConfirmationAsync("確定刪除？");
        if (confirmed)
        {
            Todos.Remove(item);
        }
    }
}
```

### Q2：如何在 ViewModel 之間導航？

**A**：使用導航服務：

```csharp
public interface INavigationService
{
    void NavigateTo<TViewModel>() where TViewModel : class;
    void NavigateTo<TViewModel>(object parameter) where TViewModel : class;
}

[RelayCommand]
private void OpenSettings()
{
    _navigationService.NavigateTo<SettingsViewModel>();
}
```

### Q3：ViewModel 之間如何通信？

**A**：使用消息傳遞：

```csharp
// 發送消息
Messenger.Send(new TodoUpdatedMessage(todo));

// 接收消息
Messenger.Register<TodoUpdatedMessage>(this, (r, m) =>
{
    // 處理消息
    UpdateTodo(m.Todo);
});
```

### Q4：如何測試 ViewModel？

**A**：使用依賴注入和 Mock：

```csharp
[Fact]
public async Task AddTodo_WithValidTitle_AddsTodoToCollection()
{
    // Arrange
    var mockService = new Mock<ITodoService>();
    var viewModel = new MainViewModel(mockService.Object);
    viewModel.NewTodoTitle = "Test Todo";

    // Act
    await viewModel.AddTodoCommand.ExecuteAsync(null);

    // Assert
    Assert.Single(viewModel.Todos);
    mockService.Verify(s => s.AddAsync(It.IsAny<TodoItem>()), Times.Once);
}
```

---

## 總結

MVVM 是構建可維護、可測試的 WPF 應用的最佳模式。通過：

1. **清晰的分層**：Model、View、ViewModel 各司其職
2. **數據綁定**：自動同步 UI 和數據
3. **命令模式**：解耦 UI 事件和業務邏輯
4. **工具支持**：CommunityToolkit.Mvvm 簡化實現

掌握 MVVM 將大大提升 WPF 開發效率和代碼質量！
