# WPF 數據綁定完全指南

深入理解 WPF 數據綁定的原理、模式和最佳實踐。

## 目錄

1. [數據綁定基礎](#數據綁定基礎)
2. [綁定模式](#綁定模式)
3. [UpdateSourceTrigger](#updatesourcetrigger)
4. [值轉換器](#值轉換器)
5. [MultiBinding](#multibinding)
6. [相對源綁定](#相對源綁定)
7. [集合綁定](#集合綁定)
8. [綁定調試](#綁定調試)

## 數據綁定基礎

### 什麼是數據綁定？

數據綁定是 WPF 中連接 UI 和數據的機制，它允許數據在 View 和 ViewModel 之間自動同步，無需手動更新 UI。

### 綁定架構

```
┌─────────────────┐         ┌──────────────────┐
│     Target      │         │      Source      │
│  (UI Element)   │◄───────►│   (Data Object)  │
│                 │         │                  │
│  DependencyProp │  Binding│    Property      │
└─────────────────┘         └──────────────────┘
        │                            │
        │                            │
   Target Value              PropertyChanged
    (自動更新)                  (通知機制)
```

### 基本綁定語法

```xml
<!-- 最簡單的綁定 -->
<TextBlock Text="{Binding Title}"/>

<!-- 完整語法 -->
<TextBlock Text="{Binding Path=Title, Mode=OneWay}"/>

<!-- Path 可以省略 -->
<TextBlock Text="{Binding Title}"/>
```

### 綁定組件

1. **Target（目標）**：UI 元素的依賴屬性
2. **Source（源）**：數據對象的屬性
3. **Path（路徑）**：源對象的屬性路徑
4. **Mode（模式）**：數據流向
5. **Converter（轉換器）**：值轉換邏輯

### 設置 DataContext

**方法 1：代碼後置設置**
```csharp
public MainWindow()
{
    InitializeComponent();
    DataContext = new MainViewModel();
}
```

**方法 2：XAML 設置**
```xml
<Window.DataContext>
    <vm:MainViewModel/>
</Window.DataContext>
```

**方法 3：依賴注入（推薦）**
```csharp
public MainWindow(MainViewModel viewModel)
{
    InitializeComponent();
    DataContext = viewModel;
}
```

### DataContext 繼承

子元素自動繼承父元素的 DataContext。

```xml
<Window DataContext="{Binding MainViewModel}">
    <!-- 繼承 Window 的 DataContext -->
    <TextBlock Text="{Binding Title}"/>

    <StackPanel DataContext="{Binding SelectedTodo}">
        <!-- 繼承 StackPanel 的 DataContext（SelectedTodo） -->
        <TextBlock Text="{Binding Title}"/>
        <TextBlock Text="{Binding Description}"/>
    </StackPanel>
</Window>
```

## 綁定模式

### Mode 選項

| Mode | 描述 | 使用場景 |
|------|------|---------|
| OneWay | 源 → 目標 | 顯示只讀數據 |
| TwoWay | 源 ↔ 目標 | 可編輯輸入 |
| OneTime | 源 → 目標（僅一次） | 靜態數據 |
| OneWayToSource | 源 ← 目標 | 少用 |
| Default | 依控件而定 | 推薦 |

### OneWay（單向綁定）

數據從源流向目標，源更新時目標自動更新。

```xml
<!-- 顯示任務數量 -->
<TextBlock Text="{Binding TodoCount, Mode=OneWay}"/>

<!-- 顯示狀態文本 -->
<TextBlock Text="{Binding StatusMessage, Mode=OneWay}"/>
```

**數據流向**：
```
ViewModel.TodoCount (源)
    │
    │ PropertyChanged 事件
    ↓
TextBlock.Text (目標)
    │
    └── UI 自動更新
```

**示例**：
```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private int _todoCount;

    public void UpdateCount()
    {
        TodoCount = Todos.Count; // UI 自動更新
    }
}
```

### TwoWay（雙向綁定）

數據在源和目標之間雙向同步。

```xml
<!-- 輸入框 -->
<TextBox Text="{Binding NewTodoTitle, Mode=TwoWay}"/>

<!-- CheckBox -->
<CheckBox IsChecked="{Binding IsCompleted, Mode=TwoWay}"/>

<!-- Slider -->
<Slider Value="{Binding Priority, Mode=TwoWay}"/>
```

**數據流向**：
```
ViewModel.NewTodoTitle ◄──► TextBox.Text
        │                        │
PropertyChanged          TextChanged
      事件                  事件
```

**示例**：
```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private string _newTodoTitle = string.Empty;

    // 當用戶在 TextBox 中輸入時，NewTodoTitle 自動更新
    // 當代碼修改 NewTodoTitle 時，TextBox 自動更新
}
```

**默認 TwoWay 的控件**：
- TextBox.Text
- CheckBox.IsChecked
- ComboBox.SelectedItem
- Slider.Value
- DatePicker.SelectedDate

### OneTime（一次性綁定）

僅在初始化時綁定一次，之後不再更新。

```xml
<!-- 應用標題（永不改變） -->
<TextBlock Text="{Binding AppTitle, Mode=OneTime}"/>

<!-- 初始配置值 -->
<TextBlock Text="{Binding InitialValue, Mode=OneTime}"/>
```

**優點**：性能最佳，無需訂閱事件

**使用場景**：顯示靜態或初始化後不變的數據

### OneWayToSource

數據從目標流向源（較少使用）。

```xml
<Slider x:Name="VolumeSlider" Value="{Binding Volume, Mode=OneWayToSource}"/>
```

### Default

使用控件的默認綁定模式。

```xml
<!-- TextBox 默認是 TwoWay -->
<TextBox Text="{Binding Title}"/>

<!-- 等同於 -->
<TextBox Text="{Binding Title, Mode=TwoWay}"/>

<!-- TextBlock 默認是 OneWay -->
<TextBlock Text="{Binding Title}"/>
```

## UpdateSourceTrigger

控制何時將目標值更新回源。

### 觸發選項

| Trigger | 描述 | 適用場景 |
|---------|------|---------|
| PropertyChanged | 屬性變更時立即更新 | 實時搜索、即時驗證 |
| LostFocus | 失去焦點時更新（默認） | 表單輸入 |
| Explicit | 手動調用 UpdateSource | 需要控制更新時機 |
| Default | 使用控件默認設置 | 一般情況 |

### PropertyChanged

每次屬性變更時立即更新源。

```xml
<!-- 實時搜索 -->
<TextBox Text="{Binding SearchText, UpdateSourceTrigger=PropertyChanged}"/>
```

**示例：實時搜索**
```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private string _searchText = string.Empty;

    partial void OnSearchTextChanged(string value)
    {
        // 每次輸入時立即觸發搜索
        FilterTodos();
    }
}
```

```xml
<TextBox Text="{Binding SearchText, UpdateSourceTrigger=PropertyChanged}"/>
```

### LostFocus（默認）

失去焦點時更新源。

```xml
<!-- 表單輸入 -->
<TextBox Text="{Binding Title, UpdateSourceTrigger=LostFocus}"/>

<!-- 等同於（LostFocus 是 TextBox 默認值） -->
<TextBox Text="{Binding Title}"/>
```

**優點**：減少不必要的更新，提升性能

### Explicit

手動控制更新時機。

```xml
<TextBox x:Name="TitleBox" Text="{Binding Title, UpdateSourceTrigger=Explicit}"/>
<Button Content="Save" Click="SaveButton_Click"/>
```

```csharp
private void SaveButton_Click(object sender, RoutedEventArgs e)
{
    // 手動觸發綁定更新
    BindingExpression binding = TitleBox.GetBindingExpression(TextBox.TextProperty);
    binding?.UpdateSource();
}
```

### 性能考慮

```xml
<!-- ❌ 不好：頻繁更新可能導致性能問題 -->
<TextBox Text="{Binding LongText, UpdateSourceTrigger=PropertyChanged}"/>

<!-- ✅ 好：使用 LostFocus 或 Explicit -->
<TextBox Text="{Binding LongText, UpdateSourceTrigger=LostFocus}"/>
```

## 值轉換器

### IValueConverter

用於在源和目標之間轉換值類型。

```csharp
public class BoolToVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        // 源 → 目標
        if (value is bool boolValue)
        {
            return boolValue ? Visibility.Visible : Visibility.Collapsed;
        }
        return Visibility.Collapsed;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        // 目標 → 源（TwoWay 綁定需要）
        if (value is Visibility visibility)
        {
            return visibility == Visibility.Visible;
        }
        return false;
    }
}
```

### 註冊和使用 Converter

```xml
<Window.Resources>
    <converters:BoolToVisibilityConverter x:Key="BoolToVisibilityConverter"/>
</Window.Resources>

<Button Visibility="{Binding IsVisible, Converter={StaticResource BoolToVisibilityConverter}}"/>
```

### 常見 Converter 示例

#### BoolToVisibilityConverter

```csharp
public class BoolToVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not bool boolValue)
            return Visibility.Collapsed;

        var useHidden = parameter is string param && param.Equals("Hidden", StringComparison.OrdinalIgnoreCase);
        var invisibleState = useHidden ? Visibility.Hidden : Visibility.Collapsed;

        return boolValue ? Visibility.Visible : invisibleState;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return value is Visibility visibility && visibility == Visibility.Visible;
    }
}
```

```xml
<!-- 使用 Collapsed -->
<TextBlock Visibility="{Binding HasError, Converter={StaticResource BoolToVisibilityConverter}}"/>

<!-- 使用 Hidden（保留空間） -->
<TextBlock Visibility="{Binding HasError, Converter={StaticResource BoolToVisibilityConverter}, ConverterParameter=Hidden}"/>
```

#### InverseBoolConverter

```csharp
public class InverseBoolConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return value is bool boolValue && !boolValue;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return value is bool boolValue && !boolValue;
    }
}
```

```xml
<Button IsEnabled="{Binding IsLoading, Converter={StaticResource InverseBoolConverter}}"/>
```

#### DateTimeToStringConverter

```csharp
public class DateTimeToStringConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not DateTime dateTime)
            return string.Empty;

        var format = parameter as string ?? "g";
        return dateTime.ToString(format, culture);
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is string dateString && DateTime.TryParse(dateString, culture, DateTimeStyles.None, out var result))
        {
            return result;
        }
        return DateTime.Now;
    }
}
```

```xml
<!-- 短日期格式 -->
<TextBlock Text="{Binding CreatedAt, Converter={StaticResource DateTimeToStringConverter}, ConverterParameter='d'}"/>

<!-- 完整日期時間 -->
<TextBlock Text="{Binding CreatedAt, Converter={StaticResource DateTimeToStringConverter}, ConverterParameter='F'}"/>
```

#### EnumToStringConverter

```csharp
public class EnumToStringConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value == null) return string.Empty;
        return value.ToString();
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is string stringValue && targetType.IsEnum)
        {
            return Enum.Parse(targetType, stringValue);
        }
        return Binding.DoNothing;
    }
}
```

## MultiBinding

組合多個綁定源到一個目標。

### IMultiValueConverter

```csharp
public class FullNameConverter : IMultiValueConverter
{
    public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
    {
        if (values.Length < 2) return string.Empty;

        var firstName = values[0] as string ?? string.Empty;
        var lastName = values[1] as string ?? string.Empty;

        return $"{firstName} {lastName}";
    }

    public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

### 使用 MultiBinding

```xml
<Window.Resources>
    <converters:FullNameConverter x:Key="FullNameConverter"/>
</Window.Resources>

<TextBlock>
    <TextBlock.Text>
        <MultiBinding Converter="{StaticResource FullNameConverter}">
            <Binding Path="FirstName"/>
            <Binding Path="LastName"/>
        </MultiBinding>
    </TextBlock.Text>
</TextBlock>
```

### 實用示例：組合驗證

```csharp
public class ValidationConverter : IMultiValueConverter
{
    public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
    {
        // 檢查用戶名和密碼是否有效
        var username = values[0] as string;
        var password = values[1] as string;

        return !string.IsNullOrWhiteSpace(username) &&
               !string.IsNullOrWhiteSpace(password) &&
               password.Length >= 6;
    }

    public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

```xml
<Button Content="Login">
    <Button.IsEnabled>
        <MultiBinding Converter="{StaticResource ValidationConverter}">
            <Binding Path="Username"/>
            <Binding Path="Password"/>
        </MultiBinding>
    </Button.IsEnabled>
</Button>
```

## 相對源綁定

### RelativeSource 模式

#### Self - 綁定到自身

```xml
<!-- 綁定到自己的寬度 -->
<Rectangle Width="100" Height="{Binding Width, RelativeSource={RelativeSource Self}}"/>
```

#### FindAncestor - 查找祖先元素

```xml
<!-- 綁定到父 Window 的 DataContext -->
<Button Command="{Binding DataContext.DeleteCommand,
                         RelativeSource={RelativeSource AncestorType=Window}}"
        CommandParameter="{Binding}"/>

<!-- 查找第二個 Grid 祖先 -->
<TextBlock Text="{Binding DataContext.Title,
                         RelativeSource={RelativeSource AncestorType=Grid, AncestorLevel=2}}"/>
```

#### TemplatedParent - 模板化父元素

在 ControlTemplate 中引用模板化的控件。

```xml
<ControlTemplate TargetType="Button">
    <Border Background="{TemplateBinding Background}">
        <ContentPresenter Content="{TemplateBinding Content}"/>
    </Border>
</ControlTemplate>

<!-- 等效於 -->
<ControlTemplate TargetType="Button">
    <Border Background="{Binding Background, RelativeSource={RelativeSource TemplatedParent}}">
        <ContentPresenter Content="{Binding Content, RelativeSource={RelativeSource TemplatedParent}}"/>
    </Border>
</ControlTemplate>
```

#### PreviousData - 前一項（少用）

```xml
<TextBlock Text="{Binding RelativeSource={RelativeSource PreviousData}}"/>
```

### 實際應用示例

**ListBox 項中訪問 Window 的 ViewModel**：

```xml
<ListBox ItemsSource="{Binding Todos}">
    <ListBox.ItemTemplate>
        <DataTemplate>
            <StackPanel>
                <TextBlock Text="{Binding Title}"/>
                <!-- 訪問 Window 的 DataContext -->
                <Button Content="Delete"
                        Command="{Binding DataContext.DeleteTodoCommand,
                                        RelativeSource={RelativeSource AncestorType=Window}}"
                        CommandParameter="{Binding}"/>
            </StackPanel>
        </DataTemplate>
    </ListBox.ItemTemplate>
</ListBox>
```

## 集合綁定

### ObservableCollection

自動通知 UI 集合變更的集合類型。

```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private ObservableCollection<TodoItem> _todos = new();

    public void AddTodo(TodoItem item)
    {
        Todos.Add(item); // UI 自動更新
    }

    public void RemoveTodo(TodoItem item)
    {
        Todos.Remove(item); // UI 自動更新
    }
}
```

### ItemsSource 綁定

```xml
<!-- ListBox -->
<ListBox ItemsSource="{Binding Todos}">
    <ListBox.ItemTemplate>
        <DataTemplate>
            <TextBlock Text="{Binding Title}"/>
        </DataTemplate>
    </ListBox.ItemTemplate>
</ListBox>

<!-- ComboBox -->
<ComboBox ItemsSource="{Binding Categories}"
          SelectedItem="{Binding SelectedCategory}"
          DisplayMemberPath="Name"/>

<!-- DataGrid -->
<DataGrid ItemsSource="{Binding Todos}" AutoGenerateColumns="False">
    <DataGrid.Columns>
        <DataGridTextColumn Header="Title" Binding="{Binding Title}"/>
        <DataGridCheckBoxColumn Header="Completed" Binding="{Binding IsCompleted}"/>
    </DataGrid.Columns>
</DataGrid>
```

### SelectedItem 綁定

```xml
<ListBox ItemsSource="{Binding Todos}"
         SelectedItem="{Binding SelectedTodo, Mode=TwoWay}"/>

<TextBlock Text="{Binding SelectedTodo.Title}"/>
```

```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private ObservableCollection<TodoItem> _todos = new();

    [ObservableProperty]
    private TodoItem? _selectedTodo;

    partial void OnSelectedTodoChanged(TodoItem? value)
    {
        // 選中項改變時的處理
    }
}
```

### CollectionViewSource

提供排序、篩選、分組功能。

```csharp
public partial class MainViewModel : ObservableObject
{
    public ICollectionView FilteredTodos { get; }

    public MainViewModel()
    {
        FilteredTodos = CollectionViewSource.GetDefaultView(AllTodos);
        FilteredTodos.Filter = FilterPredicate;
        FilteredTodos.SortDescriptions.Add(
            new SortDescription(nameof(TodoItem.CreatedAt), ListSortDirection.Descending)
        );
    }

    private bool FilterPredicate(object obj)
    {
        return obj is TodoItem todo && !todo.IsCompleted;
    }
}
```

```xml
<ListBox ItemsSource="{Binding FilteredTodos}"/>
```

## 綁定調試

### 啟用綁定追蹤

在 App.xaml.cs 中：

```csharp
public App()
{
    PresentationTraceSources.Refresh();
    PresentationTraceSources.DataBindingSource.Listeners.Add(new ConsoleTraceListener());
    PresentationTraceSources.DataBindingSource.Switch.Level = SourceLevels.Error | SourceLevels.Warning;
}
```

### 輸出窗口診斷

綁定錯誤會顯示在 Visual Studio 的輸出窗口：

```
System.Windows.Data Error: 40 : BindingExpression path error: 'Titl' property not found on 'object' ''TodoItem' (HashCode=12345)'.
```

### 使用 Snoop

Snoop 是強大的 WPF 調試工具，可以：
- 查看可視樹
- 檢查數據綁定
- 實時修改屬性

### FallbackValue 和 TargetNullValue

```xml
<!-- 綁定失敗時的後備值 -->
<TextBlock Text="{Binding Title, FallbackValue='No Title'}"/>

<!-- 源為 null 時的值 -->
<TextBlock Text="{Binding Description, TargetNullValue='No Description'}"/>
```

### ValidatesOnDataErrors

啟用數據驗證錯誤顯示。

```xml
<TextBox Text="{Binding Title, ValidatesOnDataErrors=True, UpdateSourceTrigger=PropertyChanged}"/>
```

```csharp
public class TodoItem : ObservableObject, IDataErrorInfo
{
    private string _title = string.Empty;

    public string Title
    {
        get => _title;
        set => SetProperty(ref _title, value);
    }

    public string Error => string.Empty;

    public string this[string columnName]
    {
        get
        {
            if (columnName == nameof(Title))
            {
                if (string.IsNullOrWhiteSpace(Title))
                    return "Title is required";
                if (Title.Length > 200)
                    return "Title is too long";
            }
            return string.Empty;
        }
    }
}
```

---

## 總結

WPF 數據綁定系統提供了：

1. **多種綁定模式**：OneWay、TwoWay、OneTime 等
2. **靈活的更新觸發**：PropertyChanged、LostFocus、Explicit
3. **強大的值轉換**：IValueConverter、IMultiValueConverter
4. **相對源綁定**：Self、FindAncestor、TemplatedParent
5. **集合綁定**：ObservableCollection、CollectionView
6. **調試支持**：追蹤、後備值、驗證

掌握數據綁定是 WPF 開發的核心技能！
