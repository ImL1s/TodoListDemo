# XAML 完全指南

深入理解 WPF 中的 XAML (Extensible Application Markup Language) 語法和概念。

## 目錄

1. [XAML 基礎](#xaml-基礎)
2. [XAML 語法](#xaml-語法)
3. [Markup Extensions](#markup-extensions)
4. [Dependency Properties](#dependency-properties)
5. [Attached Properties](#attached-properties)
6. [Templates](#templates)
7. [Styles](#styles)
8. [Resources](#resources)

## XAML 基礎

### 什麼是 XAML？

XAML (Extensible Application Markup Language) 是一種基於 XML 的聲明式標記語言，用於定義 WPF、UWP、Xamarin 等框架的用戶界面。

### 為什麼使用 XAML？

**優點**：
- **聲明式**：描述 UI "是什麼"而非"如何創建"
- **可視化設計**：支持設計器（Blend、Visual Studio）
- **分離關注點**：UI 定義與邏輯代碼分離
- **可讀性強**：層次結構清晰
- **工具支持**：豐富的開發工具生態

### XAML vs C# 代碼

**XAML 方式**：
```xml
<StackPanel>
    <TextBlock Text="Hello World" FontSize="24"/>
    <Button Content="Click Me" Click="Button_Click"/>
</StackPanel>
```

**等效的 C# 代碼**：
```csharp
var stackPanel = new StackPanel();

var textBlock = new TextBlock
{
    Text = "Hello World",
    FontSize = 24
};
stackPanel.Children.Add(textBlock);

var button = new Button
{
    Content = "Click Me"
};
button.Click += Button_Click;
stackPanel.Children.Add(button);

this.Content = stackPanel;
```

### 基本結構

```xml
<Window x:Class="TodoListWPF.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:local="clr-namespace:TodoListWPF"
        mc:Ignorable="d"
        Title="MainWindow" Height="450" Width="800">
    <Grid>
        <!-- UI 元素 -->
    </Grid>
</Window>
```

**命名空間說明**：
- `xmlns` - 默認 WPF 命名空間
- `xmlns:x` - XAML 語言命名空間
- `xmlns:d` - 設計時命名空間
- `xmlns:mc` - 標記兼容性命名空間
- `xmlns:local` - 本地類型命名空間

## XAML 語法

### 元素語法

#### 對象元素

```xml
<!-- 創建 Button 對象 -->
<Button/>
```

#### 屬性設置

**屬性語法（Attribute Syntax）**：
```xml
<Button Content="Click Me" Width="100" Height="30"/>
```

**元素語法（Element Syntax）**：
```xml
<Button>
    <Button.Content>Click Me</Button.Content>
    <Button.Width>100</Button.Width>
    <Button.Height>30</Button.Height>
</Button>
```

**何時使用元素語法**：
- 屬性值是複雜對象
- 需要設置集合屬性
- 提高可讀性

```xml
<Button>
    <Button.Background>
        <LinearGradientBrush>
            <GradientStop Color="Blue" Offset="0"/>
            <GradientStop Color="Red" Offset="1"/>
        </LinearGradientBrush>
    </Button.Background>
</Button>
```

### 內容屬性

某些控件有默認的內容屬性，可以省略屬性名。

```xml
<!-- Button 的 Content 是內容屬性 -->
<Button Content="Click Me"/>

<!-- 等效於 -->
<Button>Click Me</Button>

<!-- Grid 的 Children 是內容屬性 -->
<Grid>
    <TextBlock Text="Hello"/>
    <Button Content="OK"/>
</Grid>

<!-- 等效於 -->
<Grid>
    <Grid.Children>
        <TextBlock Text="Hello"/>
        <Button Content="OK"/>
    </Grid.Children>
</Grid>
```

### 集合語法

```xml
<!-- StackPanel.Children 是集合屬性 -->
<StackPanel>
    <TextBlock Text="Item 1"/>
    <TextBlock Text="Item 2"/>
    <TextBlock Text="Item 3"/>
</StackPanel>

<!-- 顯式集合語法 -->
<StackPanel>
    <StackPanel.Children>
        <TextBlock Text="Item 1"/>
        <TextBlock Text="Item 2"/>
    </StackPanel.Children>
</StackPanel>

<!-- GradientStops 集合 -->
<LinearGradientBrush>
    <LinearGradientBrush.GradientStops>
        <GradientStop Color="Blue" Offset="0"/>
        <GradientStop Color="Red" Offset="1"/>
    </LinearGradientBrush.GradientStops>
</LinearGradientBrush>
```

### 類型轉換

XAML 支持多種類型的自動轉換。

**字符串轉換**：
```xml
<TextBlock Text="Hello World"/>
```

**數值轉換**：
```xml
<Button Width="100" Height="30" FontSize="14"/>
```

**布爾轉換**：
```xml
<Button IsEnabled="True" Visibility="Visible"/>
```

**枚舉轉換**：
```xml
<TextBlock HorizontalAlignment="Center" VerticalAlignment="Top"/>
```

**顏色轉換**：
```xml
<!-- 命名顏色 -->
<Button Background="Red"/>

<!-- 十六進制 -->
<Button Background="#FF0000"/>
<Button Background="#80FF0000"/>  <!-- ARGB -->
```

**Thickness 轉換**：
```xml
<!-- 統一值 -->
<Button Padding="10"/>

<!-- 水平,垂直 -->
<Button Padding="10,5"/>

<!-- 左,上,右,下 -->
<Button Padding="10,5,10,5"/>
```

## Markup Extensions

Markup Extensions 提供了在 XAML 中使用動態值和引用的方式。

### Binding

```xml
<!-- 簡單綁定 -->
<TextBlock Text="{Binding Title}"/>

<!-- 完整語法 -->
<TextBlock Text="{Binding Path=Title, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"/>

<!-- 相對源綁定 -->
<Button Command="{Binding DataContext.DeleteCommand,
                         RelativeSource={RelativeSource AncestorType=Window}}"
        CommandParameter="{Binding}"/>

<!-- ElementName 綁定 -->
<TextBox x:Name="InputBox"/>
<TextBlock Text="{Binding Text, ElementName=InputBox}"/>
```

### StaticResource

引用靜態資源（在 XAML 加載時解析）。

```xml
<Window.Resources>
    <SolidColorBrush x:Key="PrimaryBrush" Color="#0078D4"/>
    <Style x:Key="PrimaryButtonStyle" TargetType="Button">
        <Setter Property="Background" Value="{StaticResource PrimaryBrush}"/>
    </Style>
</Window.Resources>

<Button Style="{StaticResource PrimaryButtonStyle}"/>
```

### DynamicResource

引用動態資源（運行時解析，支持主題切換）。

```xml
<Window.Resources>
    <SolidColorBrush x:Key="BackgroundBrush" Color="White"/>
</Window.Resources>

<!-- 使用 DynamicResource 以支持運行時更改 -->
<Grid Background="{DynamicResource BackgroundBrush}"/>
```

### x:Static

引用靜態字段或屬性。

```xml
<!-- 引用枚舉值 -->
<TextBlock HorizontalAlignment="{x:Static HorizontalAlignment.Center}"/>

<!-- 引用常量 -->
<TextBlock Text="{x:Static local:Constants.AppName}"/>

<!-- 引用靜態屬性 -->
<TextBlock Text="{x:Static SystemParameters.PrimaryScreenWidth}"/>
```

### x:Type

提供類型引用。

```xml
<Style TargetType="{x:Type Button}">
    <Setter Property="Background" Value="Blue"/>
</Style>

<!-- DataTemplate 指定類型 -->
<DataTemplate DataType="{x:Type local:TodoItem}">
    <TextBlock Text="{Binding Title}"/>
</DataTemplate>
```

### x:Null

表示 null 值。

```xml
<Button Content="Click Me" Background="{x:Null}"/>
```

### x:Array

創建數組。

```xml
<ComboBox>
    <ComboBox.ItemsSource>
        <x:Array Type="sys:String" xmlns:sys="clr-namespace:System;assembly=mscorlib">
            <sys:String>Option 1</sys:String>
            <sys:String>Option 2</sys:String>
            <sys:String>Option 3</sys:String>
        </x:Array>
    </ComboBox.ItemsSource>
</ComboBox>
```

### 自定義 Markup Extension

```csharp
public class LocalizeExtension : MarkupExtension
{
    public string Key { get; set; }

    public LocalizeExtension(string key)
    {
        Key = key;
    }

    public override object ProvideValue(IServiceProvider serviceProvider)
    {
        return ResourceManager.GetString(Key);
    }
}
```

```xml
<TextBlock Text="{local:Localize WelcomeMessage}"/>
```

## Dependency Properties

### 什麼是 Dependency Property？

Dependency Property (依賴屬性) 是 WPF 特有的屬性系統，支持數據綁定、動畫、樣式等功能。

### 定義 Dependency Property

```csharp
public class CustomControl : Control
{
    // 1. 定義依賴屬性字段
    public static readonly DependencyProperty TitleProperty =
        DependencyProperty.Register(
            nameof(Title),              // 屬性名
            typeof(string),             // 屬性類型
            typeof(CustomControl),      // 所有者類型
            new PropertyMetadata(       // 元數據
                string.Empty,           // 默認值
                OnTitleChanged));       // 變更回調

    // 2. CLR 屬性包裝器
    public string Title
    {
        get => (string)GetValue(TitleProperty);
        set => SetValue(TitleProperty, value);
    }

    // 3. 屬性變更回調
    private static void OnTitleChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        var control = (CustomControl)d;
        var newValue = (string)e.NewValue;
        // 處理變更
    }
}
```

### 使用 Dependency Property

```xml
<local:CustomControl Title="My Title"/>
<local:CustomControl Title="{Binding ViewModelTitle}"/>
```

### 為什麼使用 Dependency Property？

1. **支持數據綁定**
2. **支持樣式和模板**
3. **支持動畫**
4. **屬性值繼承**
5. **默認值和強制值**
6. **變更通知**
7. **節省內存**（僅在設置時分配內存）

## Attached Properties

### 什麼是 Attached Property？

Attached Property (附加屬性) 允許一個對象為另一個對象設置屬性值。

### 常見的 Attached Properties

```xml
<!-- Grid.Row 和 Grid.Column -->
<Grid>
    <TextBlock Grid.Row="0" Grid.Column="0" Text="Cell 1"/>
    <TextBlock Grid.Row="0" Grid.Column="1" Text="Cell 2"/>
</Grid>

<!-- Canvas 定位 -->
<Canvas>
    <Button Canvas.Left="10" Canvas.Top="20" Content="Button"/>
</Canvas>

<!-- DockPanel.Dock -->
<DockPanel>
    <Button DockPanel.Dock="Top" Content="Top"/>
    <Button DockPanel.Dock="Bottom" Content="Bottom"/>
</DockPanel>
```

### 定義 Attached Property

```csharp
public class MyPanel : Panel
{
    // 定義附加屬性
    public static readonly DependencyProperty PriorityProperty =
        DependencyProperty.RegisterAttached(
            "Priority",
            typeof(int),
            typeof(MyPanel),
            new PropertyMetadata(0));

    // Get 方法
    public static int GetPriority(DependencyObject obj)
    {
        return (int)obj.GetValue(PriorityProperty);
    }

    // Set 方法
    public static void SetPriority(DependencyObject obj, int value)
    {
        obj.SetValue(PriorityProperty, value);
    }
}
```

使用：
```xml
<local:MyPanel>
    <Button local:MyPanel.Priority="1" Content="High Priority"/>
    <Button local:MyPanel.Priority="0" Content="Normal Priority"/>
</local:MyPanel>
```

## Templates

### DataTemplate

定義數據對象的視覺表現。

```xml
<!-- 為 TodoItem 定義數據模板 -->
<DataTemplate x:Key="TodoItemTemplate" DataType="{x:Type local:TodoItem}">
    <Border Background="White" BorderBrush="Gray" BorderThickness="1" Padding="10">
        <StackPanel>
            <TextBlock Text="{Binding Title}" FontWeight="Bold"/>
            <TextBlock Text="{Binding Description}" Foreground="Gray"/>
            <TextBlock Text="{Binding CreatedAt, StringFormat='Created: {0:g}'}"/>
        </StackPanel>
    </Border>
</DataTemplate>

<!-- 使用數據模板 -->
<ListBox ItemsSource="{Binding Todos}"
         ItemTemplate="{StaticResource TodoItemTemplate}"/>
```

**隱式 DataTemplate**（自動應用）：
```xml
<Window.Resources>
    <!-- 不設置 x:Key，自動應用於 TodoItem 類型 -->
    <DataTemplate DataType="{x:Type local:TodoItem}">
        <TextBlock Text="{Binding Title}"/>
    </DataTemplate>
</Window.Resources>

<!-- 自動使用上面的模板 -->
<ContentControl Content="{Binding SelectedTodo}"/>
```

### ControlTemplate

定義控件的視覺結構。

```xml
<Style TargetType="Button">
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="Button">
                <Border x:Name="border"
                        Background="{TemplateBinding Background}"
                        BorderBrush="{TemplateBinding BorderBrush}"
                        BorderThickness="{TemplateBinding BorderThickness}"
                        CornerRadius="5">
                    <ContentPresenter HorizontalAlignment="Center"
                                    VerticalAlignment="Center"
                                    Margin="{TemplateBinding Padding}"/>
                </Border>
                <ControlTemplate.Triggers>
                    <Trigger Property="IsMouseOver" Value="True">
                        <Setter TargetName="border" Property="Background" Value="LightBlue"/>
                    </Trigger>
                </ControlTemplate.Triggers>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>
```

### ItemsPanelTemplate

定義項目容器的布局面板。

```xml
<ListBox ItemsSource="{Binding Todos}">
    <ListBox.ItemsPanel>
        <ItemsPanelTemplate>
            <!-- 使用 WrapPanel 替代默認的 StackPanel -->
            <WrapPanel Orientation="Horizontal"/>
        </ItemsPanelTemplate>
    </ListBox.ItemsPanel>
</ListBox>
```

## Styles

### 基本樣式

```xml
<Style x:Key="PrimaryButtonStyle" TargetType="Button">
    <Setter Property="Background" Value="#0078D4"/>
    <Setter Property="Foreground" Value="White"/>
    <Setter Property="Padding" Value="16,8"/>
    <Setter Property="FontSize" Value="14"/>
    <Setter Property="BorderThickness" Value="0"/>
</Style>

<!-- 使用樣式 -->
<Button Style="{StaticResource PrimaryButtonStyle}" Content="Click Me"/>
```

### 隱式樣式

不設置 x:Key 的樣式會自動應用於該類型的所有控件。

```xml
<!-- 自動應用於所有 Button -->
<Style TargetType="Button">
    <Setter Property="Margin" Value="5"/>
    <Setter Property="Padding" Value="10,5"/>
</Style>
```

### 樣式繼承

```xml
<!-- 基礎樣式 -->
<Style x:Key="BaseButtonStyle" TargetType="Button">
    <Setter Property="Padding" Value="10,5"/>
    <Setter Property="FontSize" Value="14"/>
</Style>

<!-- 繼承基礎樣式 -->
<Style x:Key="PrimaryButtonStyle" TargetType="Button" BasedOn="{StaticResource BaseButtonStyle}">
    <Setter Property="Background" Value="Blue"/>
    <Setter Property="Foreground" Value="White"/>
</Style>
```

### 樣式觸發器

**Property Trigger**：
```xml
<Style TargetType="Button">
    <Setter Property="Background" Value="Blue"/>
    <Style.Triggers>
        <Trigger Property="IsMouseOver" Value="True">
            <Setter Property="Background" Value="LightBlue"/>
        </Trigger>
        <Trigger Property="IsPressed" Value="True">
            <Setter Property="Background" Value="DarkBlue"/>
        </Trigger>
    </Style.Triggers>
</Style>
```

**Data Trigger**：
```xml
<Style TargetType="TextBlock">
    <Style.Triggers>
        <DataTrigger Binding="{Binding IsCompleted}" Value="True">
            <Setter Property="TextDecorations" Value="Strikethrough"/>
            <Setter Property="Foreground" Value="Gray"/>
        </DataTrigger>
    </Style.Triggers>
</Style>
```

**Multi Trigger**：
```xml
<Style TargetType="Button">
    <Style.Triggers>
        <MultiTrigger>
            <MultiTrigger.Conditions>
                <Condition Property="IsMouseOver" Value="True"/>
                <Condition Property="IsEnabled" Value="True"/>
            </MultiTrigger.Conditions>
            <Setter Property="Background" Value="LightBlue"/>
        </MultiTrigger>
    </Style.Triggers>
</Style>
```

**Event Trigger**：
```xml
<Style TargetType="Button">
    <Style.Triggers>
        <EventTrigger RoutedEvent="Button.Click">
            <BeginStoryboard>
                <Storyboard>
                    <DoubleAnimation Storyboard.TargetProperty="Opacity"
                                   From="1" To="0.5" Duration="0:0:0.2"
                                   AutoReverse="True"/>
                </Storyboard>
            </BeginStoryboard>
        </EventTrigger>
    </Style.Triggers>
</Style>
```

## Resources

### ResourceDictionary

組織和管理資源的容器。

**Window 級別資源**：
```xml
<Window.Resources>
    <SolidColorBrush x:Key="PrimaryBrush" Color="#0078D4"/>
    <Style x:Key="PrimaryButtonStyle" TargetType="Button">
        <Setter Property="Background" Value="{StaticResource PrimaryBrush}"/>
    </Style>
</Window.Resources>
```

**Application 級別資源**：
```xml
<Application.Resources>
    <ResourceDictionary>
        <SolidColorBrush x:Key="PrimaryBrush" Color="#0078D4"/>
    </ResourceDictionary>
</Application.Resources>
```

**合併資源字典**：
```xml
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Styles/LightTheme.xaml"/>
            <ResourceDictionary Source="Styles/CommonStyles.xaml"/>
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

### 資源查找順序

WPF 按以下順序查找資源：

1. 當前元素的 Resources
2. 父元素的 Resources
3. Window.Resources
4. Application.Resources
5. 系統資源

```xml
<Window>
    <Window.Resources>
        <SolidColorBrush x:Key="MyBrush" Color="Blue"/>
    </Window.Resources>
    <Grid>
        <Grid.Resources>
            <SolidColorBrush x:Key="MyBrush" Color="Red"/>
        </Grid.Resources>
        <!-- 使用 Grid.Resources 中的 Red -->
        <Button Background="{StaticResource MyBrush}"/>
    </Grid>
</Window>
```

### StaticResource vs DynamicResource

**StaticResource**：
- 在 XAML 加載時解析一次
- 性能更好
- 資源必須在使用前定義
- 不支持運行時更改

**DynamicResource**：
- 運行時解析
- 支持資源動態更改（主題切換）
- 可以前向引用
- 略低的性能

```xml
<!-- 主題切換示例 -->
<Application.Resources>
    <ResourceDictionary x:Name="ThemeDictionary" Source="Styles/LightTheme.xaml"/>
</Application.Resources>

<!-- 使用 DynamicResource 以支持主題切換 -->
<Grid Background="{DynamicResource BackgroundBrush}"/>
```

```csharp
// 運行時切換主題
var themeDictionary = Application.Current.Resources.MergedDictionaries[0];
themeDictionary.Source = new Uri("Styles/DarkTheme.xaml", UriKind.Relative);
```

## 高級 XAML 技巧

### 命名和引用元素

```xml
<!-- 命名元素 -->
<TextBox x:Name="InputTextBox" Text="Hello"/>

<!-- 引用命名元素 -->
<TextBlock Text="{Binding Text, ElementName=InputTextBox}"/>
```

### 使用代碼後置訪問

```csharp
// 在代碼後置中訪問命名元素
InputTextBox.Text = "New Value";
```

### x:FieldModifier

控制生成字段的訪問修飾符。

```xml
<!-- 默認是 internal -->
<TextBox x:Name="MyTextBox"/>

<!-- 設置為 public -->
<TextBox x:Name="PublicTextBox" x:FieldModifier="public"/>
```

### x:Shared

控制資源是否共享實例。

```xml
<Window.Resources>
    <!-- 每次使用都創建新實例 -->
    <SolidColorBrush x:Key="UniqueBrush" x:Shared="False" Color="Blue"/>
</Window.Resources>
```

---

## 總結

XAML 提供了強大而靈活的 UI 定義方式：

1. **聲明式語法**：清晰表達 UI 結構
2. **Markup Extensions**：動態值和資源引用
3. **Dependency Properties**：支持綁定、動畫、樣式
4. **Attached Properties**：靈活的屬性附加機制
5. **Templates**：完全自定義控件外觀
6. **Styles**：統一和重用視覺樣式
7. **Resources**：集中管理和組織資源

掌握 XAML 是成為 WPF 開發高手的關鍵！
