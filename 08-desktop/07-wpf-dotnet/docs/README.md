# WPF Todo List Application

一個使用 .NET 8 和 WPF (Windows Presentation Foundation) 構建的現代化 Todo List 桌面應用程序，展示了 MVVM 架構模式、數據綁定、主題切換和豐富的用戶界面特性。

## 項目概述

這是一個功能完整的待辦事項管理應用，使用最新的 .NET 8 和 C# 12 語言特性，結合 WPF 框架提供流暢的桌面體驗。應用程序實現了標準的 MVVM 架構模式，並使用 CommunityToolkit.Mvvm 簡化開發。

### 應用截圖描述

**主界面（淺色主題）**
- 頂部顯示應用標題 "Todo List" 和活動任務計數
- 右上角有主題切換按鈕（太陽/月亮圖標）
- 輸入區域包含標題輸入框、優先級選擇器和添加按鈕
- 可選的描述輸入框支持多行文本
- 過濾按鈕組（All/Active/Completed）用於快速篩選
- 搜索框支持實時搜索功能
- Todo 列表以卡片形式展示，每個項目包含複選框、內容、優先級標籤和刪除按鈕
- 底部統計欄顯示總數、活動數和完成數

**主界面（深色主題）**
- 深色背景配色方案，保護眼睛
- 所有控件自動適應深色主題色彩
- 保持相同的布局和功能

**Todo 項目卡片**
- 圓角矩形卡片設計
- 左側複選框用於標記完成狀態
- 中間顯示標題和描述
- 優先級標籤使用不同顏色區分（紅色=緊急、橙色=高、藍色=普通、灰色=低）
- 創建時間戳顯示在底部
- 右側刪除按鈕（X）
- 完成的任務標題帶有刪除線

## 核心功能

### 1. 任務管理
- **新增任務**：輸入標題、描述和優先級快速創建任務
- **刪除任務**：點擊刪除按鈕移除任務
- **編輯任務**：點擊任務可編輯詳情（通過檢查框切換完成狀態）
- **標記完成**：使用複選框標記任務完成/未完成
- **批量刪除**：一鍵清除所有已完成任務

### 2. 篩選和搜索
- **狀態篩選**：
  - All - 顯示所有任務
  - Active - 僅顯示未完成任務
  - Completed - 僅顯示已完成任務
- **實時搜索**：在標題、描述和分類中搜索關鍵詞
- **動態排序**：支持多種排序方式（時間、標題、優先級等）

### 3. 優先級系統
- **四個優先級等級**：
  - Urgent（緊急）- 紅色標籤
  - High（高）- 橙色標籤
  - Normal（普通）- 藍色標籤
  - Low（低）- 灰色標籤

### 4. 數據持久化
- **自動保存**：任務變更自動保存到本地 JSON 文件
- **應用設置**：窗口大小、位置、主題選擇等設置持久化
- **數據位置**：`%LocalAppData%\TodoListWPF\`
  - `todos.json` - 任務數據
  - `settings.json` - 應用設置

### 5. 主題系統
- **淺色主題**：現代簡潔的白色主題
- **深色主題**：護眼的暗色主題
- **動態切換**：實時切換主題無需重啟
- **設置保存**：主題選擇自動保存

### 6. 用戶體驗
- **流暢動畫**：淡入動畫效果
- **鍵盤支持**：Enter 鍵快速添加任務
- **實時統計**：顯示總數、活動數和完成數
- **窗口狀態保存**：記住窗口大小和位置
- **高 DPI 支持**：自動適應高分辨率顯示器

## 技術棧

### 框架和平台
- **.NET 8.0** - 最新的 .NET 平台
- **C# 12** - 最新的 C# 語言特性
- **WPF** - Windows Presentation Foundation
- **XAML** - 聲明式 UI 標記語言

### NuGet 包
- **CommunityToolkit.Mvvm 8.2.2** - MVVM 工具包，提供源代碼生成器
- **Microsoft.EntityFrameworkCore.Sqlite 8.0.0** - SQLite 數據庫支持（可選）
- **System.Text.Json 8.0.0** - JSON 序列化/反序列化

### 測試框架
- **xUnit 2.6.2** - 單元測試框架
- **Moq 4.20.70** - Mock 框架
- **Microsoft.NET.Test.Sdk 17.8.0** - 測試 SDK

## 系統要求

### 最低要求
- **操作系統**：Windows 10 版本 1809 或更高版本
- **框架**：.NET 8.0 Runtime（桌面運行時）
- **內存**：512 MB RAM
- **存儲**：50 MB 可用空間
- **屏幕分辨率**：1024x768 或更高

### 推薦配置
- **操作系統**：Windows 11
- **框架**：.NET 8.0 SDK（開發環境）
- **內存**：2 GB RAM
- **存儲**：100 MB 可用空間
- **屏幕分辨率**：1920x1080 或更高

### 開發環境
- **Visual Studio 2022** 17.8 或更高版本
- **Visual Studio Code** + C# Dev Kit（可選）
- **Rider 2023.3** 或更高版本（可選）

## 安裝和運行

### 方法 1：使用預編譯版本（最終用戶）

1. **安裝 .NET 8 Runtime**
   ```bash
   # 下載並安裝 .NET 8 Desktop Runtime
   # https://dotnet.microsoft.com/download/dotnet/8.0
   ```

2. **下載應用程序**
   - 從 Releases 頁面下載最新版本
   - 解壓到任意目錄

3. **運行應用程序**
   - 雙擊 `TodoListWPF.exe`

### 方法 2：從源代碼構建（開發者）

1. **克隆倉庫**
   ```bash
   git clone https://github.com/yourusername/TodoListDemo.git
   cd TodoListDemo/08-desktop/07-wpf-dotnet
   ```

2. **確認 .NET 8 SDK 已安裝**
   ```bash
   dotnet --version
   # 應顯示 8.0.x
   ```

3. **還原 NuGet 包**
   ```bash
   dotnet restore TodoListWPF.sln
   ```

4. **構建項目**
   ```bash
   dotnet build TodoListWPF.sln --configuration Release
   ```

5. **運行應用程序**
   ```bash
   dotnet run --project TodoListWPF/TodoListWPF.csproj
   ```

   或使用 Visual Studio：
   - 打開 `TodoListWPF.sln`
   - 按 F5 啟動調試
   - 或按 Ctrl+F5 不調試運行

### 方法 3：發布獨立應用

創建自包含的可執行文件（不需要安裝 .NET Runtime）：

```bash
# Windows x64
dotnet publish TodoListWPF/TodoListWPF.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true

# Windows x86
dotnet publish TodoListWPF/TodoListWPF.csproj -c Release -r win-x86 --self-contained true -p:PublishSingleFile=true

# Windows ARM64
dotnet publish TodoListWPF/TodoListWPF.csproj -c Release -r win-arm64 --self-contained true -p:PublishSingleFile=true
```

發布的文件位於：`TodoListWPF/bin/Release/net8.0-windows/win-x64/publish/`

## 運行測試

```bash
# 運行所有測試
dotnet test TodoListWPF.sln

# 運行測試並生成覆蓋率報告
dotnet test TodoListWPF.sln --collect:"XPlat Code Coverage"

# 運行特定測試
dotnet test --filter "FullyQualifiedName~MainViewModelTests"
```

## 項目結構

```
08-desktop/07-wpf-dotnet/
├── TodoListWPF/                    # 主應用程序項目
│   ├── Models/                     # 數據模型
│   │   ├── TodoItem.cs            # Todo 項目模型
│   │   ├── TodoFilter.cs          # 篩選器枚舉
│   │   └── AppSettings.cs         # 應用設置模型
│   ├── ViewModels/                # 視圖模型（MVVM）
│   │   └── MainViewModel.cs       # 主視圖模型
│   ├── Views/                     # XAML 視圖
│   │   └── (使用 MainWindow)
│   ├── Services/                  # 業務邏輯服務
│   │   ├── ITodoService.cs       # Todo 服務接口
│   │   ├── TodoService.cs        # Todo 服務實現
│   │   ├── IStorageService.cs    # 存儲服務接口
│   │   └── JsonStorageService.cs # JSON 存儲實現
│   ├── Converters/               # 值轉換器
│   │   ├── BoolToVisibilityConverter.cs
│   │   ├── InverseBoolConverter.cs
│   │   ├── PriorityToColorConverter.cs
│   │   ├── DateTimeToStringConverter.cs
│   │   ├── BoolToTextDecorationConverter.cs
│   │   ├── CountToVisibilityConverter.cs
│   │   └── EnumToBoolConverter.cs
│   ├── Styles/                   # XAML 樣式資源
│   │   ├── LightTheme.xaml      # 淺色主題
│   │   ├── DarkTheme.xaml       # 深色主題
│   │   └── CommonStyles.xaml    # 通用樣式
│   ├── App.xaml                 # 應用程序定義
│   ├── App.xaml.cs              # 應用程序邏輯
│   ├── MainWindow.xaml          # 主窗口 XAML
│   └── MainWindow.xaml.cs       # 主窗口代碼後置
├── TodoListWPF.Tests/            # 單元測試項目
│   ├── ViewModelTests.cs        # ViewModel 測試
│   └── TodoListWPF.Tests.csproj
├── docs/                         # 文檔
│   ├── README.md                # 本文件
│   ├── MVVM_GUIDE.md           # MVVM 模式指南
│   ├── XAML_GUIDE.md           # XAML 語法指南
│   ├── DATA_BINDING_GUIDE.md   # 數據綁定指南
│   └── ARCHITECTURE.md         # 架構說明
├── TodoListWPF.sln              # Visual Studio 解決方案
└── .gitignore                   # Git 忽略文件
```

## 使用說明

### 添加新任務

1. 在頂部輸入框中輸入任務標題
2. （可選）點擊下方輸入框添加詳細描述
3. 選擇優先級（Low/Normal/High/Urgent）
4. 點擊「Add」按鈕或按 Enter 鍵

### 管理任務

- **標記完成**：點擊任務左側的複選框
- **刪除任務**：點擊任務右側的 ✕ 按鈕
- **查看詳情**：任務卡片顯示標題、描述、優先級和創建時間

### 篩選和搜索

- **狀態篩選**：點擊 All/Active/Completed 按鈕
- **搜索**：在搜索框輸入關鍵詞，實時過濾結果
- **清除已完成**：點擊「Clear Completed」按鈕刪除所有已完成任務

### 主題切換

- 點擊右上角的太陽/月亮圖標切換主題
- 主題選擇會自動保存

### 鍵盤快捷鍵

- **Enter**：在標題輸入框按 Enter 快速添加任務
- **Tab**：在控件間切換焦點
- **Space**：切換複選框狀態

## WPF 特性展示

本應用展示了以下 WPF 核心特性：

### 1. Data Binding（數據綁定）
- **OneWay Binding**：數據從 ViewModel 流向 View
- **TwoWay Binding**：雙向同步（如 TextBox.Text）
- **UpdateSourceTrigger**：控制更新時機（PropertyChanged）
- **INotifyPropertyChanged**：屬性變更通知機制

### 2. Commands（命令）
- **RelayCommand**：使用 CommunityToolkit.Mvvm 的命令實現
- **Command Parameter**：傳遞參數給命令
- **CanExecute**：控制命令是否可執行

### 3. Templates（模板）
- **DataTemplate**：定義數據的視覺表現
- **ControlTemplate**：自定義控件外觀
- **ItemTemplate**：列表項模板

### 4. Styles & Resources（樣式和資源）
- **ResourceDictionary**：組織和重用資源
- **StaticResource**：靜態資源引用
- **DynamicResource**：動態資源引用（支持運行時更改）
- **Style Inheritance**：樣式繼承（BasedOn）

### 5. Animations（動畫）
- **Storyboard**：動畫時間線
- **DoubleAnimation**：數值動畫（透明度）
- **ThicknessAnimation**：厚度動畫（邊距）

### 6. Converters（轉換器）
- **IValueConverter**：單值轉換
- **Custom Converters**：自定義轉換邏輯

## 架構模式

### MVVM (Model-View-ViewModel)

```
┌─────────────┐         ┌──────────────┐         ┌───────────┐
│    View     │◄────────│  ViewModel   │◄────────│   Model   │
│   (XAML)    │  Bind   │   (Logic)    │  Data   │  (Data)   │
└─────────────┘         └──────────────┘         └───────────┘
      │                        │                        │
      │                        │                        │
  UI Events            Property Changed            Business
  Commands             Commands                     Logic
```

- **Model**：純數據對象（TodoItem, AppSettings）
- **ViewModel**：業務邏輯和狀態管理（MainViewModel）
- **View**：XAML 定義的 UI（MainWindow.xaml）

### 依賴注入

雖然這個簡單應用使用手動依賴注入，但結構支持使用 DI 容器：

```csharp
// 在 App.xaml.cs 中
services.AddSingleton<IStorageService, JsonStorageService>();
services.AddSingleton<ITodoService, TodoService>();
services.AddTransient<MainViewModel>();
```

## 數據流

1. **用戶交互** → View 觸發 Command
2. **Command 執行** → ViewModel 處理邏輯
3. **數據變更** → Service 層更新數據
4. **持久化** → StorageService 保存到文件
5. **通知更新** → INotifyPropertyChanged 通知 View
6. **UI 更新** → Data Binding 自動更新界面

## 最佳實踐

### 1. MVVM 分離
- View 不包含業務邏輯
- ViewModel 不引用 UI 控件
- Model 是純數據對象

### 2. 數據綁定
- 使用 ObservableCollection 自動通知集合變更
- 使用 INotifyPropertyChanged 通知屬性變更
- 避免在代碼後置中操作 UI

### 3. 資源管理
- 使用 ResourceDictionary 組織樣式
- 使用 DynamicResource 支持主題切換
- 合理使用 StaticResource 提高性能

### 4. 性能優化
- 使用虛擬化（VirtualizingStackPanel）處理大列表
- 避免在 Converter 中執行耗時操作
- 使用 Freeze 凍結不可變資源

## 擴展和自定義

### 添加新功能

1. **添加任務分類**
   - 在 TodoItem 模型添加 Category 屬性
   - 在 UI 添加分類選擇器
   - 實現按分類篩選

2. **添加到期日期**
   - 添加 DueDate 屬性
   - 實現日期選擇器
   - 添加過期任務提醒

3. **導出/導入功能**
   - 實現 CSV 導出
   - 支持從文件導入
   - 數據備份功能

### 切換到 SQLite

將 JsonStorageService 替換為 EF Core + SQLite：

```csharp
public class TodoDbContext : DbContext
{
    public DbSet<TodoItem> Todos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=todos.db");
    }
}
```

## 故障排除

### 應用無法啟動

**問題**：提示缺少 .NET Runtime
**解決**：安裝 .NET 8.0 Desktop Runtime

**問題**：窗口無法顯示
**解決**：刪除設置文件 `%LocalAppData%\TodoListWPF\settings.json`

### 數據丟失

**問題**：任務數據消失
**解決**：檢查 `%LocalAppData%\TodoListWPF\todos.json` 是否存在

**問題**：保存失敗
**解決**：確保應用有寫入 LocalAppData 的權限

### 性能問題

**問題**：大量任務時界面卡頓
**解決**：
1. 啟用 UI 虛擬化
2. 使用分頁加載
3. 優化 Converter 性能

## 貢獻指南

歡迎貢獻代碼！請遵循以下步驟：

1. Fork 本倉庫
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 代碼規範

- 遵循 C# 編碼規範
- 使用有意義的變量和方法名
- 添加 XML 文檔註釋
- 編寫單元測試

## 許可證

本項目採用 MIT 許可證 - 詳見 LICENSE 文件。

## 聯繫方式

- 項目主頁：https://github.com/yourusername/TodoListDemo
- 問題反饋：https://github.com/yourusername/TodoListDemo/issues
- 電子郵件：your.email@example.com

## 致謝

- [CommunityToolkit.Mvvm](https://github.com/CommunityToolkit/dotnet) - 優秀的 MVVM 工具包
- [.NET Platform](https://dotnet.microsoft.com/) - 強大的開發平台
- WPF 社區的所有貢獻者

## 更新日誌

### v1.0.0 (2025-11-19)
- 初始版本發布
- 實現基本 CRUD 功能
- 支持主題切換
- JSON 數據持久化
- 任務篩選和搜索
- 優先級系統
- 完整的單元測試

---

**享受使用 WPF Todo List！如有任何問題或建議，請隨時聯繫我們。**
