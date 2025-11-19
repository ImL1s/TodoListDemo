# WPF Todo List Application

一個完整的 WPF (.NET 8) Todo List 桌面應用程序，展示現代化的 MVVM 架構和 WPF 最佳實踐。

## 項目概述

這是一個功能完整、架構清晰的待辦事項管理應用，使用最新的 .NET 8 和 C# 12 開發。應用程序展示了 WPF 的核心特性，包括數據綁定、命令模式、主題切換和豐富的 UI 交互。

## 核心特性

### 功能特性
- ✅ 完整的 CRUD 操作（新增、刪除、編輯、標記完成）
- 🔍 實時搜索和篩選（All/Active/Completed）
- 🎨 深色/淺色主題切換
- ⚡ 優先級系統（Low/Normal/High/Urgent）
- 💾 JSON 文件持久化
- 📊 實時統計（總數、活動數、完成數）
- 🎯 流暢的動畫效果
- ⌨️ 鍵盤快捷鍵支持
- 💻 窗口狀態保存

### 技術特性
- 🏗️ MVVM 架構模式
- 📦 CommunityToolkit.Mvvm（源代碼生成器）
- 🔗 完整的數據綁定演示
- 🎨 動態主題系統
- 🧩 自定義值轉換器
- 📐 響應式 UI 設計
- 🧪 單元測試覆蓋

## 技術棧

- **.NET 8.0** - 最新的 .NET 平台
- **C# 12** - 最新的 C# 語言特性
- **WPF** - Windows Presentation Foundation
- **CommunityToolkit.Mvvm 8.2.2** - MVVM 工具包
- **System.Text.Json 8.0.0** - JSON 序列化
- **xUnit 2.6.2** - 單元測試框架

## 快速開始

### 前置要求

- Windows 10/11
- .NET 8.0 SDK
- Visual Studio 2022 或 Rider 2023.3+

### 安裝步驟

1. **克隆倉庫**
   ```bash
   git clone <repository-url>
   cd TodoListDemo/08-desktop/07-wpf-dotnet
   ```

2. **還原依賴**
   ```bash
   dotnet restore TodoListWPF.sln
   ```

3. **構建項目**
   ```bash
   dotnet build TodoListWPF.sln --configuration Release
   ```

4. **運行應用**
   ```bash
   dotnet run --project TodoListWPF/TodoListWPF.csproj
   ```

   或在 Visual Studio 中按 F5。

### 運行測試

```bash
dotnet test TodoListWPF.sln
```

## 項目結構

```
08-desktop/07-wpf-dotnet/
├── TodoListWPF/                    # 主應用程序
│   ├── Models/                     # 數據模型
│   │   ├── TodoItem.cs            # Todo 項目模型
│   │   ├── TodoFilter.cs          # 篩選器枚舉
│   │   └── AppSettings.cs         # 應用設置
│   ├── ViewModels/                # MVVM 視圖模型
│   │   └── MainViewModel.cs       # 主視圖模型
│   ├── Services/                  # 業務邏輯服務
│   │   ├── ITodoService.cs
│   │   ├── TodoService.cs
│   │   ├── IStorageService.cs
│   │   └── JsonStorageService.cs
│   ├── Converters/                # 值轉換器
│   │   ├── BoolToVisibilityConverter.cs
│   │   ├── InverseBoolConverter.cs
│   │   ├── PriorityToColorConverter.cs
│   │   ├── DateTimeToStringConverter.cs
│   │   ├── BoolToTextDecorationConverter.cs
│   │   ├── CountToVisibilityConverter.cs
│   │   ├── StringToVisibilityConverter.cs
│   │   └── EnumToBoolConverter.cs
│   ├── Styles/                    # XAML 樣式和主題
│   │   ├── LightTheme.xaml
│   │   ├── DarkTheme.xaml
│   │   └── CommonStyles.xaml
│   ├── App.xaml                   # 應用程序定義
│   ├── App.xaml.cs
│   ├── MainWindow.xaml            # 主窗口
│   ├── MainWindow.xaml.cs
│   └── TodoListWPF.csproj
├── TodoListWPF.Tests/             # 單元測試
│   ├── ViewModelTests.cs
│   └── TodoListWPF.Tests.csproj
├── docs/                          # 詳細文檔
│   ├── README.md                  # 用戶文檔
│   ├── MVVM_GUIDE.md             # MVVM 模式指南
│   ├── XAML_GUIDE.md             # XAML 語法指南
│   ├── DATA_BINDING_GUIDE.md     # 數據綁定指南
│   └── ARCHITECTURE.md           # 架構說明
├── TodoListWPF.sln                # Visual Studio 解決方案
├── .gitignore
└── README.md                      # 本文件
```

## WPF 特性展示

### 1. 數據綁定（Data Binding）
- **OneWay Binding**：數據從 ViewModel 流向 View
- **TwoWay Binding**：雙向同步（TextBox、CheckBox）
- **UpdateSourceTrigger**：PropertyChanged 實時更新
- **INotifyPropertyChanged**：屬性變更通知

### 2. 命令（Commands）
- **RelayCommand**：CommunityToolkit.Mvvm 的命令實現
- **Command Parameter**：傳遞參數給命令
- **CanExecute**：控制命令可執行狀態
- **異步命令**：Task-based async commands

### 3. 模板（Templates）
- **DataTemplate**：自定義數據項顯示
- **ControlTemplate**：自定義控件外觀
- **ItemTemplate**：列表項模板

### 4. 樣式和資源（Styles & Resources）
- **ResourceDictionary**：組織資源
- **StaticResource**：靜態資源引用
- **DynamicResource**：動態資源引用（主題切換）
- **Style Inheritance**：BasedOn 樣式繼承

### 5. 動畫（Animations）
- **Storyboard**：動畫時間線
- **DoubleAnimation**：透明度動畫
- **ThicknessAnimation**：邊距動畫
- **EventTrigger**：事件觸發動畫

### 6. 值轉換器（Converters）
- **IValueConverter**：單值轉換
- **自定義 Converters**：8 種不同的轉換器
- **ConverterParameter**：參數化轉換

## 架構設計

### MVVM 模式

```
┌─────────────┐         ┌──────────────┐         ┌───────────┐
│    View     │◄────────│  ViewModel   │◄────────│   Model   │
│   (XAML)    │  Bind   │   (Logic)    │  Data   │  (Data)   │
└─────────────┘         └──────────────┘         └───────────┘
```

- **Model**：純數據對象（TodoItem, AppSettings）
- **ViewModel**：業務邏輯和狀態管理（MainViewModel）
- **View**：XAML 定義的 UI（MainWindow.xaml）

### 服務層

- **ITodoService**：Todo CRUD 操作接口
- **IStorageService**：數據持久化接口
- **依賴注入**：通過構造函數注入

## 詳細文檔

項目包含了超過 9,000 字的詳細文檔：

1. **[README.md](docs/README.md)** - 完整的用戶指南和功能說明
2. **[MVVM_GUIDE.md](docs/MVVM_GUIDE.md)** - MVVM 模式深入講解
3. **[XAML_GUIDE.md](docs/XAML_GUIDE.md)** - XAML 語法和特性指南
4. **[DATA_BINDING_GUIDE.md](docs/DATA_BINDING_GUIDE.md)** - 數據綁定完全指南
5. **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - 應用架構詳細說明

## 主要代碼示例

### Model 定義

```csharp
public partial class TodoItem : ObservableObject
{
    [ObservableProperty]
    private string title = string.Empty;

    [ObservableProperty]
    private bool isCompleted;

    [ObservableProperty]
    private TodoPriority priority;

    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

### ViewModel 實現

```csharp
public partial class MainViewModel : ObservableObject
{
    [ObservableProperty]
    private ObservableCollection<TodoItem> _todos = new();

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(AddTodoCommand))]
    private string _newTodoTitle = string.Empty;

    [RelayCommand(CanExecute = nameof(CanAddTodo))]
    private async Task AddTodoAsync()
    {
        var newTodo = new TodoItem { Title = NewTodoTitle };
        await _todoService.AddAsync(newTodo);
        Todos.Add(newTodo);
        NewTodoTitle = string.Empty;
    }

    private bool CanAddTodo() => !string.IsNullOrWhiteSpace(NewTodoTitle);
}
```

### XAML 綁定

```xml
<TextBox Text="{Binding NewTodoTitle, UpdateSourceTrigger=PropertyChanged}"/>
<Button Content="Add" Command="{Binding AddTodoCommand}"/>
<ListBox ItemsSource="{Binding FilteredTodos}"/>
```

## 數據持久化

應用數據存儲在：
- **位置**：`%LocalAppData%\TodoListWPF\`
- **文件**：
  - `todos.json` - Todo 項目數據
  - `settings.json` - 應用設置（窗口大小、主題等）

## NuGet 包依賴

### 主項目
- **CommunityToolkit.Mvvm** 8.2.2 - MVVM 工具包，提供源代碼生成器
- **System.Text.Json** 8.0.0 - JSON 序列化和反序列化

### 測試項目
- **Microsoft.NET.Test.Sdk** 17.8.0 - 測試 SDK
- **xUnit** 2.6.2 - 測試框架
- **xunit.runner.visualstudio** 2.5.4 - Visual Studio 測試運行器
- **Moq** 4.20.70 - Mock 框架

## 項目統計

- **文件總數**：31 個文件
- **C# 代碼**：1,475 行
- **XAML 代碼**：694 行
- **文檔**：3,968 行（約 10,000 字）
- **總代碼量**：2,169 行（C# + XAML）

## 主要特性列表

### WPF 特性
1. Data Binding（OneWay, TwoWay, UpdateSourceTrigger）
2. INotifyPropertyChanged 實現
3. RelayCommand 和 ICommand
4. DataTemplate 和 ControlTemplate
5. ResourceDictionary 和主題系統
6. Storyboard 動畫
7. IValueConverter 值轉換
8. Dependency Properties
9. Attached Properties
10. CollectionViewSource 篩選和排序

### C# 特性
1. C# 12 語法
2. Source Generators（CommunityToolkit.Mvvm）
3. Async/Await 異步編程
4. LINQ 查詢
5. Records 和 Pattern Matching
6. Nullable Reference Types
7. 依賴注入模式
8. 接口和抽象

## 開發建議

### 擴展功能
1. 添加任務分類功能
2. 實現到期日期和提醒
3. 支持任務標籤
4. 導出/導入功能（CSV、JSON）
5. 切換到 SQLite 數據庫
6. 多語言支持

### 技術改進
1. 使用 DI 容器（Microsoft.Extensions.DependencyInjection）
2. 實現導航服務
3. 添加日誌系統
4. 實現撤銷/重做功能
5. 添加數據驗證框架
6. 實現拖放排序

## 學習資源

- [Microsoft WPF 文檔](https://docs.microsoft.com/en-us/dotnet/desktop/wpf/)
- [CommunityToolkit.Mvvm 文檔](https://learn.microsoft.com/en-us/dotnet/communitytoolkit/mvvm/)
- [XAML 語法指南](https://docs.microsoft.com/en-us/dotnet/desktop/wpf/xaml/)

## 許可證

MIT License

## 致謝

- Microsoft WPF Team
- CommunityToolkit 貢獻者
- .NET 社區

---

**享受使用這個 WPF Todo List 應用！如有問題或建議，歡迎提 Issue。**
