# Unity Todo List Application

![Unity Version](https://img.shields.io/badge/Unity-2022.3%20LTS-blue)
![C# Version](https://img.shields.io/badge/C%23-9.0-green)
![Platform](https://img.shields.io/badge/Platform-PC%20%7C%20Mobile%20%7C%20WebGL-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

一個使用 Unity 遊戲引擎構建的跨平台 Todo List 應用，展示遊戲引擎在應用程序開發中的潛力。

## 目錄

- [專案概述](#專案概述)
- [為什麼使用 Unity 開發應用](#為什麼使用-unity-開發應用)
- [技術架構](#技術架構)
- [功能特性](#功能特性)
- [項目結構](#項目結構)
- [環境需求](#環境需求)
- [安裝指南](#安裝指南)
- [Unity 項目設置](#unity-項目設置)
- [UI 系統深入解析](#ui-系統深入解析)
- [腳本詳解](#腳本詳解)
- [構建和發布](#構建和發布)
- [性能優化](#性能優化)
- [與傳統框架對比](#與傳統框架對比)
- [常見問題](#常見問題)
- [學習資源](#學習資源)

---

## 專案概述

### 什麼是這個專案？

這是一個功能完整的 Todo List 應用，使用 **Unity 遊戲引擎**和 **C#** 開發。雖然 Unity 主要用於遊戲開發，但它也是一個強大的跨平台應用開發工具，能夠輕鬆部署到多個平台。

### 核心特性

- ✅ **完整的 CRUD 操作**：創建、讀取、更新、刪除 Todo 項目
- 💾 **數據持久化**：支持 PlayerPrefs 和 JSON 文件存儲
- 🎨 **現代化 UI**：使用 UGUI 系統構建美觀界面
- ✨ **動畫效果**：流暢的添加、刪除、完成動畫
- 🔍 **高級功能**：搜索、過濾、分類、優先級
- 📊 **統計儀表板**：實時顯示任務完成進度
- 🌐 **跨平台支持**：Windows、macOS、Linux、Android、iOS、WebGL

### 技術亮點

1. **單例模式管理器**：使用 Unity 的 DontDestroyOnLoad 實現全局狀態管理
2. **事件驅動架構**：利用 UnityEvent 實現組件間解耦
3. **協程動畫系統**：使用 Coroutine 實現流暢的 UI 動畫
4. **序列化系統**：利用 Unity 的 JsonUtility 實現數據持久化
5. **組件化設計**：遵循 Unity 的 Component-Based Architecture

---

## 為什麼使用 Unity 開發應用？

### Unity 作為應用開發工具的優勢

#### 1. 真正的跨平台開發

Unity 支持超過 25 個平台，使用同一套代碼庫可以部署到：

```
桌面平台：
- Windows (x86, x64, ARM64)
- macOS (Intel, Apple Silicon)
- Linux (x86_64)

移動平台：
- iOS (iPhone, iPad)
- Android (ARM, ARM64, x86)

Web 平台：
- WebGL (所有現代瀏覽器)

遊戲主機：
- PlayStation 4/5
- Xbox One/Series X|S
- Nintendo Switch

其他平台：
- tvOS
- Embedded Linux
- Magic Leap
- HoloLens
```

這種跨平台能力是其他傳統框架難以企及的。例如：
- **React Native**：主要支持 iOS 和 Android
- **Electron**：主要支持桌面平台
- **Flutter**：支持移動和桌面，但 WebGL 支持有限

#### 2. 強大的可視化編輯器

Unity Editor 提供：

```csharp
// 可視化場景編輯
- Hierarchy 視圖：管理對象層級
- Scene 視圖：拖放式 UI 設計
- Inspector 視圖：實時調整組件屬性
- Project 視圖：資源管理

// 實時預覽
- Play Mode：即時運行和測試
- Hot Reload：運行時修改參數
- Visual Debugging：場景內調試工具
```

傳統應用開發通常需要：
1. 編寫代碼
2. 編譯
3. 運行
4. 查看結果
5. 重複

Unity 的可視化工作流大大縮短了這個循環。

#### 3. 豐富的 UI 系統

Unity 提供兩個強大的 UI 系統：

**UGUI (Unity GUI)**：
```csharp
- Canvas 系統：自動縮放和適配
- Layout Groups：自動佈局
- Event System：完整的事件處理
- Animation：內建動畫系統
- TextMeshPro：高質量文本渲染
```

**UI Toolkit**（新一代）：
```csharp
- USS (類似 CSS)：樣式表系統
- UXML (類似 HTML)：聲明式 UI
- Data Binding：MVVM 模式支持
- Runtime 和 Editor 通用
- 更好的性能
```

#### 4. 內建的動畫和特效系統

Unity 遊戲引擎的本質賦予它強大的視覺能力：

```csharp
// 動畫系統
Animator animator;
Animation animation;
Coroutine coroutines;  // 自定義動畫

// 特效系統
Particle System;        // 粒子特效
Shader Graph;          // 視覺效果
Post Processing;       // 後期處理

// 物理系統
2D Physics;
3D Physics;
```

這些在傳統應用框架中需要大量第三方庫或自己實現。

#### 5. 資源管理系統

Unity 的 Asset Pipeline 提供：

```csharp
// 自動資源處理
- 圖片壓縮和優化
- 音頻格式轉換
- 字體打包
- Addressables 系統（動態加載）

// 資源打包
- AssetBundle 系統
- Resources 文件夾
- StreamingAssets
```

#### 6. 強大的 C# 支持

Unity 使用 C# 作為主要語言，提供：

```csharp
// 現代 C# 特性
- LINQ 查詢
- async/await 異步
- 泛型和反射
- 屬性和特性
- 擴展方法

// Unity 特定 API
- MonoBehaviour 生命週期
- Coroutine 協程
- ScriptableObject 數據容器
- Unity Events
```

#### 7. 性能優化工具

Unity 提供專業級性能分析工具：

```csharp
// Profiler
- CPU 使用分析
- 內存分析
- 渲染統計
- 網絡分析
- Audio 分析

// Frame Debugger
- 逐幀分析
- Draw Call 檢查
- 批處理分析

// Memory Profiler
- 內存洩漏檢測
- 對象引用追蹤
```

### 為什麼用遊戲引擎做 Todo List？

#### 教學目的

這個專案主要是為了展示：

1. **Unity 不僅僅是遊戲引擎**
   - 可以開發實用應用
   - UI 系統同樣強大
   - 業務邏輯實現簡潔

2. **學習 Unity 的應用開發能力**
   - 了解 Unity UI 系統
   - 掌握數據持久化
   - 學習組件化架構
   - 理解事件驅動模式

3. **跨平台開發體驗**
   - 一次開發，多平台部署
   - 統一的開發體驗
   - 快速原型和迭代

#### 實際應用場景

雖然簡單的 Todo List 用 Unity 可能是「殺雞用牛刀」，但在以下場景中，Unity 是理想選擇：

**1. 需要豐富視覺效果的應用**
```csharp
- 教育軟件（互動式學習）
- 數據可視化工具
- 創意設計工具
- 演示和展示應用
```

**2. 遊戲化應用**
```csharp
- Gamified Todo List（帶有 RPG 元素）
- 健身應用（3D 角色和動畫）
- 學習應用（關卡和獎勵系統）
```

**3. AR/VR 應用**
```csharp
- 增強現實購物
- 虛擬展廳
- 3D 模型查看器
- 空間計算應用
```

**4. 需要強大 3D 能力的應用**
```csharp
- 建築可視化
- 產品展示
- 室內設計工具
- 醫療可視化
```

#### 劣勢和權衡

誠實地說，對於簡單的 Todo List，Unity 有以下缺點：

```
劣勢：
❌ 應用體積大（100MB+ vs 5MB）
❌ 啟動時間長（需要初始化引擎）
❌ 內存佔用高（引擎開銷）
❌ 電池消耗（持續渲染循環）
❌ 學習曲線（需要了解 Unity 概念）

適用場景：
✅ 需要豐富視覺效果
✅ 跨多個平台發布
✅ 已有 Unity 開發經驗
✅ 需要 3D/AR/VR 功能
✅ 遊戲化應用
```

---

## 技術架構

### 整體架構

```
┌─────────────────────────────────────────────────────────┐
│                     Unity Engine Layer                    │
│  (渲染、物理、動畫、輸入、音頻、網絡)                      │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  UI Layer    │  │ Logic Layer  │  │  Data Layer  │  │
│  │              │  │              │  │              │  │
│  │ - TodoInputUI│  │ - TodoManager│  │ - Todo Model │  │
│  │ - TodoItemUI │  │ - Events     │  │ - Persistence│  │
│  │ - TodoListUI │  │ - CRUD Ops   │  │ - JSON       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────┐
│                    Platform Layer                         │
│  (Windows, macOS, Linux, iOS, Android, WebGL)            │
└─────────────────────────────────────────────────────────┘
```

### 設計模式

#### 1. Singleton Pattern（單例模式）

```csharp
public class TodoManager : MonoBehaviour
{
    private static TodoManager instance;

    public static TodoManager Instance
    {
        get
        {
            if (instance == null)
            {
                instance = FindObjectOfType<TodoManager>();
                if (instance == null)
                {
                    GameObject go = new GameObject("TodoManager");
                    instance = go.AddComponent<TodoManager>();
                    DontDestroyOnLoad(go);
                }
            }
            return instance;
        }
    }
}
```

**優點**：
- 全局訪問點
- 跨場景持久化
- 狀態管理集中

**使用場景**：
- 遊戲管理器
- 數據管理器
- 服務管理器

#### 2. Observer Pattern（觀察者模式）

```csharp
// 使用 UnityEvent 實現
public class TodoListChangedEvent : UnityEvent<List<Todo>> { }
public TodoListChangedEvent OnTodoListChanged = new TodoListChangedEvent();

// 發布
OnTodoListChanged?.Invoke(todos);

// 訂閱
TodoManager.Instance.OnTodoListChanged.AddListener(OnTodoListChanged);
```

**優點**：
- 組件解耦
- 靈活的事件處理
- 易於擴展

#### 3. Component Pattern（組件模式）

```csharp
// Unity 的核心設計模式
GameObject todoItem = new GameObject("TodoItem");
todoItem.AddComponent<TodoItemUI>();
todoItem.AddComponent<CanvasGroup>();
todoItem.AddComponent<RectTransform>();
```

**優點**：
- 高度模塊化
- 易於組合
- 可重用性強

### 數據流

```
用戶交互
    ↓
TodoInputUI (輸入組件)
    ↓
TodoManager (管理器)
    ↓
Todo Model (數據模型)
    ↓
DataPersistence (持久化)
    ↓
Storage (PlayerPrefs/JSON File)
    ↓
UnityEvent (事件通知)
    ↓
TodoListUI (列表組件)
    ↓
TodoItemUI (項目組件)
    ↓
UI 更新
```

---

## 功能特性

### 核心功能

#### 1. CRUD 操作

```csharp
// Create（創建）
Todo AddTodo(string text, int priority, string category)

// Read（讀取）
Todo GetTodo(string id)
List<Todo> GetActiveTodos()
List<Todo> GetCompletedTodos()

// Update（更新）
bool UpdateTodo(string id, string newText, bool? completed, int? priority, string category)
bool ToggleTodo(string id)

// Delete（刪除）
bool RemoveTodo(string id)
int ClearCompleted()
void ClearAll()
```

#### 2. 數據持久化

**PlayerPrefs 方式**：
```csharp
// 優點：
- 跨平台一致性
- 自動處理路徑
- 簡單易用

// 缺點：
- 有大小限制
- 性能較低
- 不適合大數據

// 適用場景：
- 設置和偏好
- 小量數據
- 快速原型
```

**JSON 文件方式**：
```csharp
// 優點：
- 沒有大小限制
- 人類可讀
- 易於導出/導入

// 缺點：
- 需要文件系統訪問
- 平台差異處理
- 安全性考慮

// 適用場景：
- 大量數據
- 可導出數據
- 離線優先應用
```

#### 3. 高級功能

**搜索和過濾**：
```csharp
// 文本搜索
List<Todo> SearchTodos(string query)

// 狀態過濾
List<Todo> GetActiveTodos()
List<Todo> GetCompletedTodos()

// 優先級過濾
List<Todo> GetTodosByPriority(int priority)

// 分類過濾
List<Todo> GetTodosByCategory(string category)
```

**排序**：
```csharp
// 按創建時間
List<Todo> GetTodosSortedByCreatedDate(bool ascending)

// 按優先級
List<Todo> GetTodosSortedByPriority(bool descending)

// 自定義排序
todos.OrderBy(t => t.Priority)
     .ThenBy(t => t.Completed)
     .ThenByDescending(t => t.CreatedAt);
```

**統計**：
```csharp
// 計數
int TotalCount
int ActiveCount
int CompletedCount

// 分析
float GetCompletionPercentage()
List<string> GetAllCategories()
string GetStatistics()
```

### UI 功能

#### 1. 動畫效果

**淡入動畫**：
```csharp
IEnumerator FadeIn()
{
    canvasGroup.alpha = 0f;
    float elapsed = 0f;

    while (elapsed < fadeInDuration)
    {
        elapsed += Time.deltaTime;
        float t = fadeCurve.Evaluate(elapsed / fadeInDuration);
        canvasGroup.alpha = t;
        yield return null;
    }

    canvasGroup.alpha = 1f;
}
```

**滑出刪除動畫**：
```csharp
IEnumerator AnimateDelete()
{
    Vector3 startPos = rectTransform.localPosition;
    Vector3 targetPos = startPos + new Vector3(1000f, 0f, 0f);

    float elapsed = 0f;
    while (elapsed < fadeOutDuration)
    {
        elapsed += Time.deltaTime;
        float t = fadeCurve.Evaluate(elapsed / fadeOutDuration);
        rectTransform.localPosition = Vector3.Lerp(startPos, targetPos, t);
        canvasGroup.alpha = 1f - t;
        yield return null;
    }

    Destroy(gameObject);
}
```

**完成狀態動畫**：
```csharp
IEnumerator AnimateToggle(bool completed)
{
    float elapsed = 0f;
    while (elapsed < strikethroughDuration)
    {
        elapsed += Time.deltaTime;
        float t = elapsed / strikethroughDuration;

        if (completed)
        {
            todoText.color = Color.Lerp(Color.black, Color.gray, t);
        }
        else
        {
            todoText.color = Color.Lerp(Color.gray, Color.black, t);
        }

        yield return null;
    }

    todoText.fontStyle = completed ? FontStyles.Strikethrough : FontStyles.Normal;
}
```

#### 2. 響應式佈局

```csharp
// Canvas Scaler 設置
- UI Scale Mode: Scale With Screen Size
- Reference Resolution: 1920x1080
- Match: 0.5 (Width/Height)

// Layout Groups
VerticalLayoutGroup:
  - Spacing: 10
  - Child Control Size: Height
  - Child Force Expand: False

ContentSizeFitter:
  - Vertical Fit: Preferred Size
```

#### 3. 輸入驗證

```csharp
private void TryAddTodo()
{
    string text = inputField.text.Trim();

    // 空白檢查
    if (string.IsNullOrWhiteSpace(text))
    {
        ShowError("Please enter a todo item");
        return;
    }

    // 長度檢查
    if (text.Length < 2)
    {
        ShowError("Todo must be at least 2 characters");
        return;
    }

    // 執行添加
    TodoManager.Instance.AddTodo(text, priority, category);
}
```

---

## 項目結構

### 完整目錄結構

```
01-unity/
├── Assets/
│   ├── Scenes/
│   │   └── MainScene.unity          # 主場景
│   ├── Scripts/
│   │   ├── Todo.cs                  # 數據模型
│   │   ├── TodoManager.cs           # 核心管理器
│   │   ├── UI/
│   │   │   ├── TodoInputUI.cs       # 輸入組件
│   │   │   ├── TodoItemUI.cs        # 項目組件
│   │   │   └── TodoListUI.cs        # 列表組件
│   │   └── Utils/
│   │       └── DataPersistence.cs   # 持久化工具
│   ├── Prefabs/
│   │   ├── TodoItem.prefab          # Todo 項目預製體
│   │   └── Canvas.prefab            # UI Canvas 預製體
│   ├── Materials/                   # 材質資源
│   ├── Fonts/
│   │   └── TextMeshPro/             # TMP 字體
│   ├── UI/
│   │   ├── Icons/                   # UI 圖標
│   │   └── Sprites/                 # UI 精靈圖
│   └── Resources/                   # 動態加載資源
├── ProjectSettings/                 # Unity 項目設置
│   ├── ProjectVersion.txt
│   ├── TagManager.asset
│   └── ...
├── Packages/
│   └── manifest.json                # 包依賴配置
├── UserSettings/                    # 用戶設置（不提交）
└── README.md                        # 專案文檔
```

### 腳本文件說明

#### Todo.cs（數據模型）

```csharp
功能：
- 定義 Todo 數據結構
- 包含 GUID 生成
- 時間戳管理
- 優先級和分類
- 序列化支持

關鍵屬性：
- Id: string (GUID)
- Text: string
- Completed: bool
- CreatedAt: long (Unix timestamp)
- UpdatedAt: long
- Priority: int (0-2)
- Category: string

關鍵方法：
- ToggleCompleted()
- GetPriorityColor()
- GetFormattedCreatedDate()
- Clone()
- IsValid()
```

#### TodoManager.cs（管理器）

```csharp
功能：
- 單例模式實現
- CRUD 操作管理
- 事件發布
- 數據持久化協調
- 自動保存

關鍵屬性：
- Todos: IReadOnlyList<Todo>
- ActiveCount: int
- CompletedCount: int
- TotalCount: int

關鍵方法：
- AddTodo()
- GetTodo()
- UpdateTodo()
- RemoveTodo()
- ClearCompleted()
- SaveData()
- LoadData()

事件：
- OnTodoListChanged
- OnTodoAdded
- OnTodoUpdated
- OnTodoRemoved
```

#### TodoInputUI.cs（輸入組件）

```csharp
功能：
- 用戶輸入處理
- 驗證邏輯
- 視覺反饋
- 錯誤提示
- 動畫效果

組件依賴：
- TMP_InputField (輸入框)
- Button (添加按鈕)
- TMP_Dropdown (優先級)
- TMP_InputField (分類)

關鍵方法：
- TryAddTodo()
- ShowError()
- ShowSuccess()
- ResetInput()
- FocusInput()
```

#### TodoItemUI.cs（項目組件）

```csharp
功能：
- 單個 Todo 顯示
- 編輯模式切換
- 完成狀態切換
- 刪除動畫
- 視覺更新

組件依賴：
- Toggle (完成勾選)
- TMP_Text (文本)
- Button (編輯/刪除)
- Image (背景/指示器)
- CanvasGroup (動畫)

關鍵方法：
- SetTodo()
- UpdateUI()
- EnterEditMode()
- AnimateToggle()
- AnimateDelete()
```

#### TodoListUI.cs（列表組件）

```csharp
功能：
- 列表渲染
- 過濾和搜索
- 統計顯示
- 空狀態處理
- 滾動管理

組件依賴：
- ScrollRect (滾動)
- Transform (容器)
- TMP_Dropdown (過濾器)
- TMP_InputField (搜索)
- TMP_Text (統計)

關鍵方法：
- RefreshList()
- GetFilteredTodos()
- CreateTodoItem()
- UpdateStatistics()
- ShowEmptyState()
```

#### DataPersistence.cs（持久化）

```csharp
功能：
- 數據保存/加載
- JSON 序列化
- 導出/導入
- 備份管理
- 多存儲方式支持

存儲方式：
- PlayerPrefs
- JSON File

關鍵方法：
- SaveTodos()
- LoadTodos()
- ExportToJson()
- ImportFromJson()
- CreateBackup()
```

---

## 環境需求

### 開發環境

#### Unity Editor

```
推薦版本：
- Unity 2022.3 LTS (Long Term Support)
- Unity 2021.3 LTS (兼容)
- Unity 2023.x (最新功能)

下載地址：
https://unity.com/download

許可證：
- Personal (免費) - 適用於個人和小型團隊
- Plus ($40/月) - 移除啟動畫面
- Pro ($150/月) - 專業功能
- Enterprise (聯繫銷售) - 企業解決方案
```

#### IDE 選擇

**Visual Studio (推薦 - Windows)**：
```
版本：Visual Studio 2022
組件：
- Unity game development workload
- .NET desktop development
- Universal Windows Platform development

優點：
✅ Unity 官方支持
✅ 智能提示最好
✅ 調試功能強大
✅ 與 Unity 深度集成

下載：https://visualstudio.microsoft.com/
```

**Visual Studio Code (跨平台)**：
```
擴展：
- C# (Microsoft)
- Unity Code Snippets
- Unity Tools
- Debugger for Unity

優點：
✅ 輕量快速
✅ 跨平台一致
✅ 自定義性強
✅ 免費開源

下載：https://code.visualstudio.com/
```

**JetBrains Rider (專業)**：
```
優點：
✅ 最好的 C# IDE
✅ Unity 支持出色
✅ 重構工具強大
✅ 性能分析集成

缺點：
❌ 需要付費訂閱

下載：https://www.jetbrains.com/rider/
```

### 系統要求

#### Windows

```
最低要求：
- OS: Windows 7 SP1+, 8, 10, 64-bit
- CPU: SSE2 instruction set support
- GPU: DX10 (shader model 4.0) capable
- RAM: 4 GB

推薦配置：
- OS: Windows 10/11, 64-bit
- CPU: Intel Core i5 or better
- GPU: DirectX 11/12 capable
- RAM: 8 GB+
- SSD: 250 GB+
```

#### macOS

```
最低要求：
- OS: macOS 10.13+
- CPU: Intel or Apple Silicon
- RAM: 4 GB

推薦配置：
- OS: macOS 12.0+ (Monterey)
- CPU: Apple M1/M2 or Intel i5+
- RAM: 8 GB+
- SSD: 250 GB+
```

#### Linux

```
最低要求：
- OS: Ubuntu 16.04, 18.04, CentOS 7
- CPU: SSE2 instruction set support
- GPU: OpenGL 3.2+ or Vulkan capable
- RAM: 4 GB

推薦配置：
- OS: Ubuntu 20.04/22.04
- CPU: Intel i5 or AMD equivalent
- RAM: 8 GB+
- SSD: 250 GB+
```

### 目標平台要求

#### Windows 構建

```
最低系統：
- Windows 7 SP1+
- DirectX 10 capable GPU
- 2 GB RAM

支持架構：
- x86
- x64
- ARM64 (Windows 11)
```

#### macOS 構建

```
最低系統：
- macOS 10.12+
- Metal capable GPU

支持架構：
- x64 (Intel)
- ARM64 (Apple Silicon)
```

#### Linux 構建

```
最低系統：
- Ubuntu 16.04+
- OpenGL 3.2+

支持架構：
- x64
```

#### Android 構建

```
最低 API：
- Android 5.1 (API Level 22)

推薦 API：
- Android 10+ (API Level 29+)

架構：
- ARMv7
- ARM64
- x86 (模擬器)
```

#### iOS 構建

```
最低系統：
- iOS 12.0

推薦系統：
- iOS 14.0+

要求：
- Apple Developer Account
- macOS 開發機
- Xcode 12.0+
```

#### WebGL 構建

```
支持瀏覽器：
- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 79+

要求：
- WebGL 2.0 支持
- 2 GB+ RAM
```

---

## 安裝指南

### 步驟 1：安裝 Unity Hub

Unity Hub 是 Unity 的安裝和項目管理工具。

```bash
# 下載 Unity Hub
# Windows/macOS/Linux
https://unity.com/download

# 或使用包管理器

# macOS (Homebrew)
brew install --cask unity-hub

# Linux (Snap)
sudo snap install unity-hub --classic

# Windows (Chocolatey)
choco install unity-hub
```

### 步驟 2：安裝 Unity Editor

1. **打開 Unity Hub**

2. **安裝 Unity 版本**：
   ```
   1. 點擊 "Installs" 標籤
   2. 點擊 "Install Editor"
   3. 選擇 "2022.3 LTS" (推薦)
   4. 點擊 "Continue"
   ```

3. **選擇模塊**：
   ```
   必需模塊：
   ✅ Microsoft Visual Studio Community 2022
   ✅ Documentation

   目標平台模塊（根據需要選擇）：
   ✅ Android Build Support
      ├─ Android SDK & NDK Tools
      └─ OpenJDK
   ✅ iOS Build Support
   ✅ WebGL Build Support
   ✅ Windows Build Support (IL2CPP)
   ✅ Mac Build Support (Mono)
   ✅ Linux Build Support (Mono)
   ```

4. **等待安裝完成**（可能需要 30-60 分鐘）

### 步驟 3：創建 Unity 項目

#### 方法 A：從頭創建

1. **打開 Unity Hub**

2. **創建新項目**：
   ```
   1. 點擊 "Projects" 標籤
   2. 點擊 "New Project"
   3. 選擇 "2D" 或 "3D" 模板（推薦 2D）
   4. 設置項目名稱：TodoListUnity
   5. 選擇保存位置
   6. 點擊 "Create Project"
   ```

3. **等待項目初始化**

#### 方法 B：導入現有項目

```bash
# 克隆或下載項目
git clone <repository-url>
cd TodoListDemo/09-game-engines/01-unity

# 在 Unity Hub 中
1. 點擊 "Add"
2. 選擇項目文件夾
3. 點擊 "Open"
```

### 步驟 4：配置 IDE

#### Visual Studio

Unity 安裝時會自動安裝 Visual Studio Community。

**手動配置**：
```
1. Unity Editor → Edit → Preferences
2. External Tools → External Script Editor
3. 選擇 "Visual Studio 2022"
4. 勾選：
   ✅ Regenerate project files
   ✅ Editor Attaching
```

#### Visual Studio Code

1. **安裝 VS Code**：
   ```bash
   # macOS
   brew install --cask visual-studio-code

   # Linux
   sudo snap install code --classic

   # Windows
   https://code.visualstudio.com/download
   ```

2. **安裝擴展**：
   ```
   打開 VS Code
   Ctrl+P (Cmd+P on macOS)

   ext install ms-dotnettools.csharp
   ext install Unity.unity-debug
   ext install kleber-swf.unity-code-snippets
   ```

3. **配置 Unity**：
   ```
   Unity Editor → Edit → Preferences
   External Tools → External Script Editor
   選擇 "Visual Studio Code"
   ```

4. **生成項目文件**：
   ```
   Unity Editor → Edit → Preferences
   External Tools
   點擊 "Regenerate project files"
   ```

### 步驟 5：導入必要的包

Unity 項目可能需要一些額外的包。

#### 通過 Package Manager

```
1. Unity Editor → Window → Package Manager

2. 安裝以下包：

   TextMeshPro (必需):
   - Unity Registry → TextMeshPro
   - Install

   Input System (可選):
   - Unity Registry → Input System
   - Install

   Cinemachine (可選):
   - Unity Registry → Cinemachine
   - Install
```

#### 通過 manifest.json

編輯 `Packages/manifest.json`：

```json
{
  "dependencies": {
    "com.unity.textmeshpro": "3.0.6",
    "com.unity.ugui": "1.0.0",
    "com.unity.modules.ui": "1.0.0",
    "com.unity.modules.imgui": "1.0.0"
  }
}
```

### 步驟 6：導入 TextMeshPro 資源

首次使用 TextMeshPro 時：

```
1. Unity Editor
2. Window → TextMeshPro → Import TMP Essential Resources
3. 點擊 "Import"
4. (可選) Import TMP Examples & Extras
```

### 步驟 7：測試項目

1. **打開主場景**：
   ```
   Assets/Scenes/MainScene.unity
   雙擊打開
   ```

2. **運行測試**：
   ```
   點擊 Play 按鈕 (或按 Ctrl+P / Cmd+P)
   ```

3. **測試功能**：
   ```
   ✓ 添加 Todo
   ✓ 完成 Todo
   ✓ 刪除 Todo
   ✓ 搜索和過濾
   ```

---

## Unity 項目設置

### 場景設置

#### 創建主場景

```
1. 創建新場景：
   File → New Scene
   選擇 "Basic (2D)" 或 "Basic (3D)"

2. 保存場景：
   File → Save As
   命名：MainScene.unity
   位置：Assets/Scenes/
```

#### 場景層級結構

```
MainScene
├── Canvas (UI Root)
│   ├── TodoInput (頂部輸入區)
│   │   ├── InputField
│   │   ├── PriorityDropdown
│   │   ├── CategoryInput
│   │   └── AddButton
│   ├── TodoList (主列表區)
│   │   ├── FilterBar
│   │   │   ├── FilterDropdown
│   │   │   ├── CategoryDropdown
│   │   │   └── SearchInput
│   │   ├── ScrollView
│   │   │   └── Content (容器)
│   │   └── EmptyState
│   └── Statistics (底部統計)
│       ├── TotalCount
│       ├── ActiveCount
│       ├── CompletedCount
│       └── ProgressBar
├── EventSystem
└── TodoManager (單例管理器)
```

### Canvas 設置

#### Canvas 組件配置

```csharp
Canvas:
  Render Mode: Screen Space - Overlay
  Pixel Perfect: true (可選)
  Sort Order: 0

Canvas Scaler:
  UI Scale Mode: Scale With Screen Size
  Reference Resolution: 1920 x 1080
  Screen Match Mode: Match Width Or Height
  Match: 0.5
  Reference Pixels Per Unit: 100

Graphic Raycaster:
  Ignore Reversed Graphics: true
  Blocking Objects: None
  Blocking Mask: Everything
```

### 創建 TodoItem Prefab

#### 步驟：

1. **創建空 GameObject**：
   ```
   Hierarchy → Right Click → Create Empty
   命名：TodoItem
   ```

2. **添加 RectTransform**：
   ```
   自動添加（UI 對象）

   設置：
   Width: 800
   Height: 80
   Anchors: Top-Stretch
   ```

3. **添加組件**：
   ```
   - Image (背景)
   - TodoItemUI (腳本)
   - CanvasGroup (動畫用)
   - Layout Element
   ```

4. **添加子對象**：
   ```
   TodoItem/
   ├── CompleteToggle
   ├── PriorityIndicator
   ├── TodoText
   ├── CategoryText
   ├── DateText
   ├── EditButton
   └── DeleteButton
   ```

5. **創建 Prefab**：
   ```
   將 TodoItem 拖到 Assets/Prefabs/
   Unity 會自動創建 Prefab
   ```

### Input Field 設置

使用 TextMeshPro InputField：

```
1. 創建：
   Right Click → UI → InputField - TextMeshPro

2. 設置：
   Character Limit: 500
   Line Type: Multi Line Newline

3. Placeholder 設置：
   Text: "What needs to be done?"
   Font Style: Italic
   Color: rgba(128, 128, 128, 128)

4. Text Component 設置：
   Font: LiberationSans SDF
   Font Size: 18
   Color: Black
   Alignment: Middle Left
```

### Button 設置

```
Button Component:
  Interactable: true
  Transition: Color Tint

  Normal Color: White
  Highlighted Color: Light Gray (240, 240, 240)
  Pressed Color: Dark Gray (200, 200, 200)
  Selected Color: Light Gray
  Disabled Color: (128, 128, 128, 128)

  Color Multiplier: 1
  Fade Duration: 0.1

Navigation:
  Navigation: Automatic
```

### Dropdown 設置

```
TMP_Dropdown:
  Interactable: true
  Template: (自動生成)
  Caption Text: (顯示選中項)
  Item Text: (下拉項模板)

Options:
  - Option A
  - Option B
  - Option C

Value: 0 (默認選中第一項)
```

### ScrollView 設置

```
Scroll Rect:
  Content: (Content RectTransform)
  Horizontal: false
  Vertical: true
  Movement Type: Elastic
  Elasticity: 0.1
  Inertia: true
  Deceleration Rate: 0.135
  Scroll Sensitivity: 1
  Viewport: (Viewport RectTransform)
  Horizontal Scrollbar: None
  Vertical Scrollbar: (可選)

Content:
  Vertical Layout Group:
    Padding: 10
    Spacing: 10
    Child Alignment: Upper Center
    Child Control Size: Height ✓
    Child Force Expand: Height ✗

  Content Size Fitter:
    Horizontal Fit: Unconstrained
    Vertical Fit: Preferred Size
```

### 項目設置

#### Player Settings

```
Edit → Project Settings → Player

Company Name: Your Company
Product Name: Todo List
Version: 1.0.0

Icon:
  Default Icon: (設置應用圖標)

Resolution and Presentation:
  Fullscreen Mode: Windowed
  Default Screen Width: 1280
  Default Screen Height: 720
  Run In Background: true

Splash Image:
  Show Unity Logo: false (需要 Plus 許可證)

Other Settings:
  Color Space: Linear (推薦)
  Auto Graphics API: true
  Scripting Backend: IL2CPP (發布時)
  API Compatibility Level: .NET Standard 2.1
```

#### Quality Settings

```
Edit → Project Settings → Quality

Levels:
  - Low
  - Medium
  - High
  - Ultra

當前平台使用: High

Settings:
  VSync Count: Every V Blank
  Texture Quality: Full Res
  Anisotropic Textures: Per Texture
  Anti Aliasing: 2x Multi Sampling (可選)
  Shadow Resolution: High Resolution
```

#### Build Settings

```
File → Build Settings

Platform: (選擇目標平台)
  ✓ PC, Mac & Linux Standalone
  ✓ iOS
  ✓ Android
  ✓ WebGL

Scenes In Build:
  ✓ Scenes/MainScene

Development Build: ✓ (開發時)
  Script Debugging: ✓
  Profiler Support: ✓
```

---

## UI 系統深入解析

### UGUI vs UI Toolkit 對比

Unity 提供兩個主要的 UI 系統：

#### UGUI (Unity GUI)

**簡介**：
```
發布時間：Unity 4.6 (2014)
當前狀態：穩定、成熟
主要用途：運行時 UI（遊戲內界面）
```

**優點**：
```
✅ 成熟穩定，文檔豐富
✅ 可視化編輯器強大
✅ 社區資源多
✅ 學習曲線平緩
✅ 動畫系統集成好
✅ Event System 完善
✅ TextMeshPro 支持
✅ 性能經過優化
```

**缺點**：
```
❌ 樣式複用困難
❌ 動態 UI 性能一般
❌ 沒有數據綁定
❌ 大量 UI 時性能下降
❌ 沒有現代 Web 工作流
```

**架構**：
```csharp
Canvas (畫布)
  ↓
RectTransform (布局)
  ↓
Graphic Components (視覺)
  - Image
  - Text / TextMeshPro
  - RawImage
  ↓
Interaction Components (交互)
  - Button
  - Toggle
  - Slider
  - InputField
  - Dropdown
  ↓
Layout Components (佈局)
  - Horizontal/Vertical Layout Group
  - Grid Layout Group
  - Content Size Fitter
  - Aspect Ratio Fitter
  ↓
Event System (事件)
  - EventSystem
  - Standalone Input Module
  - Graphic Raycaster
```

**代碼示例**：
```csharp
// 創建 UI
GameObject canvas = new GameObject("Canvas");
Canvas c = canvas.AddComponent<Canvas>();
c.renderMode = RenderMode.ScreenSpaceOverlay;

GameObject button = new GameObject("Button");
button.transform.SetParent(canvas.transform);
button.AddComponent<RectTransform>();
button.AddComponent<Image>();
button.AddComponent<Button>();

// 事件處理
Button btn = button.GetComponent<Button>();
btn.onClick.AddListener(() => {
    Debug.Log("Button clicked!");
});
```

#### UI Toolkit（新一代）

**簡介**：
```
發布時間：Unity 2019.1 (實驗性)
正式版本：Unity 2021.2
當前狀態：穩定，持續發展
主要用途：運行時 UI + Editor UI
```

**優點**：
```
✅ 類似 Web 開發（HTML/CSS）
✅ 數據綁定支持（MVVM）
✅ 樣式表系統（USS）
✅ 更好的性能（Retained Mode）
✅ Editor 和 Runtime 統一
✅ 動態 UI 性能好
✅ 現代化工作流
✅ 可擴展性強
```

**缺點**：
```
❌ 學習曲線陡峭
❌ 文檔相對較少
❌ 社區資源有限
❌ 一些功能還在開發中
❌ 可視化編輯器不如 UGUI 直觀
❌ 第三方集成少
```

**架構**：
```csharp
UI Document (根)
  ↓
UXML (結構 - 類似 HTML)
  <ui:UXML>
    <ui:VisualElement>
      <ui:Button />
    </ui:VisualElement>
  </ui:UXML>
  ↓
USS (樣式 - 類似 CSS)
  .button {
    background-color: blue;
    width: 200px;
    height: 50px;
  }
  ↓
C# (邏輯)
  var button = root.Q<Button>();
  button.clicked += OnButtonClicked;
```

**代碼示例**：
```csharp
// UXML (結構)
<ui:UXML>
  <ui:VisualElement class="container">
    <ui:Label text="Todo List" class="title"/>
    <ui:TextField name="todoInput" />
    <ui:Button name="addButton" text="Add Todo" />
  </ui:VisualElement>
</ui:UXML>

// USS (樣式)
.container {
    flex-direction: column;
    padding: 20px;
    background-color: rgb(240, 240, 240);
}

.title {
    font-size: 24px;
    -unity-font-style: bold;
    margin-bottom: 10px;
}

// C# (邏輯)
public class TodoUI : MonoBehaviour
{
    [SerializeField] private UIDocument document;

    void Start()
    {
        var root = document.rootVisualElement;
        var input = root.Q<TextField>("todoInput");
        var button = root.Q<Button>("addButton");

        button.clicked += () => {
            string text = input.value;
            AddTodo(text);
            input.value = "";
        };
    }
}
```

#### 詳細對比表

| 特性 | UGUI | UI Toolkit |
|------|------|------------|
| **學習曲線** | 簡單 | 中等 |
| **可視化編輯** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **性能（靜態 UI）** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **性能（動態 UI）** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **樣式複用** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **數據綁定** | ❌ | ✅ |
| **文檔資源** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **社區支持** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **動畫系統** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Web 工作流** | ❌ | ✅ |
| **Editor UI** | ❌ | ✅ |
| **Mobile 性能** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

#### 選擇建議

**選擇 UGUI 如果**：
```
✓ 你是 Unity 初學者
✓ 需要快速原型
✓ 項目簡單到中等複雜度
✓ 需要豐富的社區資源
✓ 團隊熟悉傳統 Unity UI
✓ 大量使用動畫
```

**選擇 UI Toolkit 如果**：
```
✓ 你有 Web 開發經驗
✓ 需要複雜的動態 UI
✓ 重視樣式複用和維護性
✓ 需要數據綁定（MVVM）
✓ 開發 Editor 工具
✓ 追求極致性能
✓ 長期項目
```

**本專案選擇**：
```
本專案使用 UGUI，原因：
1. 教學目的 - 更多人熟悉
2. 文檔豐富 - 易於學習
3. 可視化編輯 - 直觀清晰
4. 社區資源 - 問題易解決
5. 動畫集成 - 更簡單
```

### UGUI 核心概念

#### 1. Canvas

Canvas 是所有 UI 元素的根容器。

**渲染模式**：

```csharp
// Screen Space - Overlay
// UI 渲染在所有內容之上，不受 Camera 影響
Canvas canvas = GetComponent<Canvas>();
canvas.renderMode = RenderMode.ScreenSpaceOverlay;
canvas.sortingOrder = 0;

// Screen Space - Camera
// UI 渲染在指定 Camera 前，可以被 3D 物體遮擋
canvas.renderMode = RenderMode.ScreenSpaceCamera;
canvas.worldCamera = Camera.main;
canvas.planeDistance = 10f;

// World Space
// UI 作為 3D 物體存在於世界空間中
canvas.renderMode = RenderMode.WorldSpace;
RectTransform rt = canvas.GetComponent<RectTransform>();
rt.sizeDelta = new Vector2(800, 600);
```

**Canvas Scaler**：

```csharp
CanvasScaler scaler = GetComponent<CanvasScaler>();

// Scale With Screen Size（推薦）
scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
scaler.referenceResolution = new Vector2(1920, 1080);
scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
scaler.matchWidthOrHeight = 0.5f; // 0 = width, 1 = height

// Constant Pixel Size
scaler.uiScaleMode = CanvasScaler.ScaleMode.ConstantPixelSize;
scaler.scaleFactor = 1;

// Constant Physical Size
scaler.uiScaleMode = CanvasScaler.ScaleMode.ConstantPhysicalSize;
scaler.physicalUnit = CanvasScaler.Unit.Points;
scaler.fallbackScreenDPI = 96;
```

#### 2. RectTransform

RectTransform 是 UI 元素的變換組件，擴展自 Transform。

**Anchors（錨點）**：

```csharp
RectTransform rt = GetComponent<RectTransform>();

// 錨點預設
// Top Left
rt.anchorMin = new Vector2(0, 1);
rt.anchorMax = new Vector2(0, 1);
rt.pivot = new Vector2(0, 1);

// Center
rt.anchorMin = new Vector2(0.5f, 0.5f);
rt.anchorMax = new Vector2(0.5f, 0.5f);
rt.pivot = new Vector2(0.5f, 0.5f);

// Stretch (all)
rt.anchorMin = new Vector2(0, 0);
rt.anchorMax = new Vector2(1, 1);
rt.offsetMin = Vector2.zero;
rt.offsetMax = Vector2.zero;

// Top Stretch
rt.anchorMin = new Vector2(0, 1);
rt.anchorMax = new Vector2(1, 1);
rt.anchoredPosition = new Vector2(0, -50);
rt.sizeDelta = new Vector2(0, 100);
```

**位置和大小**：

```csharp
// 設置大小
rt.sizeDelta = new Vector2(200, 100);

// 設置位置（相對於錨點）
rt.anchoredPosition = new Vector2(0, 0);

// 設置 3D 位置
rt.anchoredPosition3D = new Vector3(0, 0, 0);

// 設置偏移
rt.offsetMin = new Vector2(10, 10); // 左下角偏移
rt.offsetMax = new Vector2(-10, -10); // 右上角偏移
```

#### 3. Layout Groups

自動佈局組件。

**Horizontal Layout Group**：

```csharp
HorizontalLayoutGroup hlg = gameObject.AddComponent<HorizontalLayoutGroup>();
hlg.spacing = 10f;
hlg.padding = new RectOffset(10, 10, 10, 10);
hlg.childAlignment = TextAnchor.MiddleCenter;
hlg.childControlWidth = true;
hlg.childControlHeight = true;
hlg.childForceExpandWidth = false;
hlg.childForceExpandHeight = false;
```

**Vertical Layout Group**：

```csharp
VerticalLayoutGroup vlg = gameObject.AddComponent<VerticalLayoutGroup>();
vlg.spacing = 10f;
vlg.padding = new RectOffset(10, 10, 10, 10);
vlg.childAlignment = TextAnchor.UpperCenter;
vlg.childControlWidth = true;
vlg.childControlHeight = false;
vlg.childForceExpandWidth = true;
vlg.childForceExpandHeight = false;
```

**Grid Layout Group**：

```csharp
GridLayoutGroup glg = gameObject.AddComponent<GridLayoutGroup>();
glg.cellSize = new Vector2(100, 100);
glg.spacing = new Vector2(10, 10);
glg.startCorner = GridLayoutGroup.Corner.UpperLeft;
glg.startAxis = GridLayoutGroup.Axis.Horizontal;
glg.childAlignment = TextAnchor.UpperLeft;
glg.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
glg.constraintCount = 3;
```

**Content Size Fitter**：

```csharp
ContentSizeFitter csf = gameObject.AddComponent<ContentSizeFitter>();
csf.horizontalFit = ContentSizeFitter.FitMode.PreferredSize;
csf.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
```

#### 4. Event System

處理用戶輸入和 UI 交互。

```csharp
// EventSystem (場景中只能有一個)
EventSystem eventSystem = FindObjectOfType<EventSystem>();
if (eventSystem == null)
{
    GameObject go = new GameObject("EventSystem");
    eventSystem = go.AddComponent<EventSystem>();
    go.AddComponent<StandaloneInputModule>();
}

// Raycast
GraphicRaycaster raycaster = canvas.GetComponent<GraphicRaycaster>();
PointerEventData pointerData = new PointerEventData(eventSystem);
pointerData.position = Input.mousePosition;

List<RaycastResult> results = new List<RaycastResult>();
raycaster.Raycast(pointerData, results);

foreach (RaycastResult result in results)
{
    Debug.Log("Hit: " + result.gameObject.name);
}
```

### TextMeshPro

TextMeshPro 是 Unity 的高級文本渲染系統。

#### 優勢

```
相比 Unity Text：
✅ 更清晰的文本渲染
✅ 更好的性能
✅ 豐富的樣式選項
✅ 動態字體資源
✅ 輪廓和陰影
✅ 漸變和紋理
✅ 字符間距控制
✅ 超鏈接支持
```

#### 使用示例

```csharp
using TMPro;

// 創建 TextMeshPro
GameObject textObj = new GameObject("Text");
TextMeshProUGUI tmp = textObj.AddComponent<TextMeshProUGUI>();

// 基本設置
tmp.text = "Hello World!";
tmp.fontSize = 24;
tmp.fontStyle = FontStyles.Bold | FontStyles.Italic;
tmp.color = Color.black;
tmp.alignment = TextAlignmentOptions.Center;

// 高級設置
tmp.enableAutoSizing = true;
tmp.fontSizeMin = 12;
tmp.fontSizeMax = 36;

// 輪廓
tmp.outlineWidth = 0.2f;
tmp.outlineColor = Color.black;

// 陰影
tmp.fontMaterial.EnableKeyword("UNDERLAY_ON");

// 漸變
tmp.enableVertexGradient = true;
tmp.colorGradient = new VertexGradient(
    Color.red,    // top left
    Color.blue,   // top right
    Color.green,  // bottom left
    Color.yellow  // bottom right
);
```

---

## 腳本詳解

### 數據模型層

#### Todo.cs 深入解析

**設計理念**：
```csharp
1. 不可變 ID：使用 GUID 確保唯一性
2. 時間戳：Unix timestamp 便於跨平台
3. 驗證邏輯：確保數據完整性
4. 輔助方法：便於 UI 顯示
5. 序列化支持：Unity JsonUtility 兼容
```

**關鍵代碼解析**：

```csharp
// 1. 序列化標記
[Serializable]  // 必須，否則無法序列化
public class Todo
{
    // 2. 字段必須是 SerializeField 或 public
    [SerializeField] private string id;

    // 3. 屬性提供訪問控制
    public string Id
    {
        get => id;
        set => id = value;  // 通常 ID 不應該可設置
    }

    // 4. 時間戳使用 long 類型
    public long CreatedAt
    {
        get => createdAt;
        set => createdAt = value;
    }

    // 5. 自動更新時間戳
    public string Text
    {
        get => text;
        set
        {
            text = value;
            UpdateTimestamp();  // 修改時自動更新
        }
    }

    // 6. 輔助方法
    public Color GetPriorityColor()
    {
        switch (priority)
        {
            case 0: return new Color(0.5f, 0.8f, 0.5f); // 綠
            case 1: return new Color(1f, 0.85f, 0.4f);  // 黃
            case 2: return new Color(1f, 0.5f, 0.5f);   // 紅
            default: return Color.white;
        }
    }
}
```

### 管理器層

#### TodoManager.cs 深入解析

**單例模式實現**：

```csharp
// Unity 單例的最佳實踐
public class TodoManager : MonoBehaviour
{
    private static TodoManager instance;

    public static TodoManager Instance
    {
        get
        {
            // 1. 檢查實例是否存在
            if (instance == null)
            {
                // 2. 在場景中查找
                instance = FindObjectOfType<TodoManager>();

                // 3. 沒找到則創建
                if (instance == null)
                {
                    GameObject go = new GameObject("TodoManager");
                    instance = go.AddComponent<TodoManager>();
                    DontDestroyOnLoad(go);  // 跨場景持久化
                }
            }
            return instance;
        }
    }

    // 4. 防止重複實例
    private void Awake()
    {
        if (instance != null && instance != this)
        {
            Destroy(gameObject);
            return;
        }

        instance = this;
        DontDestroyOnLoad(gameObject);
    }
}
```

**事件系統**：

```csharp
// 1. 定義事件類型
[Serializable]
public class TodoListChangedEvent : UnityEvent<List<Todo>> { }

// 2. 聲明事件
public TodoListChangedEvent OnTodoListChanged = new TodoListChangedEvent();

// 3. 觸發事件
OnTodoListChanged?.Invoke(todos);

// 4. 監聽事件（其他腳本中）
void Start()
{
    TodoManager.Instance.OnTodoListChanged.AddListener(OnTodoListChanged);
}

void OnDestroy()
{
    // 重要：移除監聽，避免內存洩漏
    TodoManager.Instance.OnTodoListChanged.RemoveListener(OnTodoListChanged);
}

void OnTodoListChanged(List<Todo> todos)
{
    Debug.Log($"Todo list changed: {todos.Count} items");
}
```

**自動保存機制**：

```csharp
[SerializeField] private bool autoSave = true;
[SerializeField] private float autoSaveInterval = 30f;
private float autoSaveTimer = 0f;

void Update()
{
    if (autoSave)
    {
        autoSaveTimer += Time.deltaTime;
        if (autoSaveTimer >= autoSaveInterval)
        {
            SaveData();
            autoSaveTimer = 0f;
        }
    }
}

// 應用退出時保存
void OnApplicationQuit()
{
    SaveData();
}

// 應用暫停時保存（移動平台）
void OnApplicationPause(bool pause)
{
    if (pause)
    {
        SaveData();
    }
}
```

### UI 層

#### TodoInputUI.cs 深入解析

**輸入驗證流程**：

```csharp
private void TryAddTodo()
{
    string text = inputField.text.Trim();

    // 1. 空白檢查
    if (string.IsNullOrWhiteSpace(text))
    {
        ShowError("Please enter a todo item");
        return;
    }

    // 2. 長度檢查
    if (text.Length < 2)
    {
        ShowError("Todo must be at least 2 characters");
        return;
    }

    // 3. 長度上限（由 InputField 的 characterLimit 控制）
    // characterLimit = 500

    // 4. 特殊字符檢查（可選）
    if (ContainsInvalidCharacters(text))
    {
        ShowError("Invalid characters detected");
        return;
    }

    // 5. 執行添加
    int priority = priorityDropdown.value;
    string category = categoryInput.text.Trim();
    TodoManager.Instance.AddTodo(text, priority, category);

    // 6. UI 反饋
    ShowSuccess();
    ResetInput();
    FocusInput();
}
```

**視覺反饋實現**：

```csharp
// 錯誤震動動畫
private IEnumerator ShakeAnimation()
{
    float elapsed = 0f;
    Vector3 originalPos = inputField.transform.localPosition;

    while (elapsed < errorShakeDuration)
    {
        float x = originalPos.x + Random.Range(-errorShakeAmount, errorShakeAmount);
        inputField.transform.localPosition = new Vector3(x, originalPos.y, originalPos.z);

        elapsed += Time.deltaTime;
        yield return null;
    }

    inputField.transform.localPosition = originalPos;
}

// 成功脈衝動畫
private IEnumerator ButtonPulseAnimation()
{
    Vector3 originalScale = addButton.transform.localScale;
    Vector3 targetScale = originalScale * 1.1f;

    float duration = 0.15f;

    // 放大
    yield return ScaleTo(originalScale, targetScale, duration);

    // 縮小
    yield return ScaleTo(targetScale, originalScale, duration);
}

private IEnumerator ScaleTo(Vector3 from, Vector3 to, float duration)
{
    float elapsed = 0f;
    while (elapsed < duration)
    {
        addButton.transform.localScale = Vector3.Lerp(from, to, elapsed / duration);
        elapsed += Time.deltaTime;
        yield return null;
    }
    addButton.transform.localScale = to;
}
```

#### TodoItemUI.cs 深入解析

**動畫狀態機**：

```csharp
// 狀態枚舉
private enum AnimationState
{
    Idle,
    FadingIn,
    FadingOut,
    Toggling,
    Deleting
}

private AnimationState currentState = AnimationState.Idle;

// 狀態檢查
private bool CanAnimate()
{
    return currentState == AnimationState.Idle;
}

// 動畫執行
public void Delete()
{
    if (!CanAnimate()) return;

    currentState = AnimationState.Deleting;
    StartCoroutine(AnimateDelete());
}

private IEnumerator AnimateDelete()
{
    // 動畫邏輯...
    yield return new WaitForSeconds(fadeOutDuration);

    currentState = AnimationState.Idle;
    Destroy(gameObject);
}
```

**編輯模式切換**：

```csharp
// 視圖模式和編輯模式切換
[SerializeField] private GameObject viewMode;
[SerializeField] private GameObject editMode;

private void EnterEditMode()
{
    if (isEditMode) return;

    isEditMode = true;
    viewMode.SetActive(false);
    editMode.SetActive(true);

    // 設置輸入框
    editInputField.text = todo.Text;
    editInputField.Select();
    editInputField.ActivateInputField();
}

private void ExitEditMode()
{
    isEditMode = false;
    viewMode.SetActive(true);
    editMode.SetActive(false);
}

private void SaveEdit()
{
    string newText = editInputField.text.Trim();

    if (!string.IsNullOrWhiteSpace(newText))
    {
        TodoManager.Instance.UpdateTodo(todo.Id, newText: newText);
        UpdateUI();
    }

    ExitEditMode();
}
```

#### TodoListUI.cs 深入解析

**過濾和排序邏輯**：

```csharp
private List<Todo> GetFilteredTodos()
{
    List<Todo> todos = new List<Todo>(TodoManager.Instance.Todos);

    // 1. 狀態過濾
    switch (currentFilter)
    {
        case FilterMode.Active:
            todos = todos.Where(t => !t.Completed).ToList();
            break;
        case FilterMode.Completed:
            todos = todos.Where(t => t.Completed).ToList();
            break;
    }

    // 2. 分類過濾
    if (currentCategory != "All")
    {
        todos = todos.Where(t => t.Category == currentCategory).ToList();
    }

    // 3. 搜索過濾
    if (!string.IsNullOrWhiteSpace(currentSearchQuery))
    {
        string query = currentSearchQuery.ToLower();
        todos = todos.Where(t => t.Text.ToLower().Contains(query)).ToList();
    }

    // 4. 排序
    todos = todos
        .OrderByDescending(t => t.Priority)      // 優先級高的在前
        .ThenBy(t => t.Completed)                // 未完成的在前
        .ThenByDescending(t => t.CreatedAt)      // 新創建的在前
        .ToList();

    return todos;
}
```

**虛擬滾動優化**（可選，用於大量數據）：

```csharp
// 基本概念：只渲染可見的項目

public class VirtualScrollView : MonoBehaviour
{
    [SerializeField] private ScrollRect scrollRect;
    [SerializeField] private RectTransform content;
    [SerializeField] private GameObject itemPrefab;

    private List<Todo> allTodos;
    private List<GameObject> pooledItems = new List<GameObject>();
    private float itemHeight = 80f;
    private int visibleCount = 10;

    public void SetData(List<Todo> todos)
    {
        allTodos = todos;

        // 設置 content 高度
        float totalHeight = allTodos.Count * itemHeight;
        content.sizeDelta = new Vector2(content.sizeDelta.x, totalHeight);

        // 初始渲染
        UpdateVisibleItems();
    }

    private void UpdateVisibleItems()
    {
        // 計算可見範圍
        float scrollPosition = scrollRect.verticalNormalizedPosition;
        int firstVisibleIndex = Mathf.FloorToInt(scrollPosition * allTodos.Count);

        // 渲染可見項目
        for (int i = 0; i < visibleCount; i++)
        {
            int index = firstVisibleIndex + i;
            if (index >= 0 && index < allTodos.Count)
            {
                UpdateItem(i, allTodos[index]);
            }
        }
    }

    private void UpdateItem(int poolIndex, Todo todo)
    {
        // 從對象池獲取或創建項目
        GameObject item = GetPooledItem(poolIndex);
        TodoItemUI itemUI = item.GetComponent<TodoItemUI>();
        itemUI.SetTodo(todo, false);

        // 設置位置
        RectTransform rt = item.GetComponent<RectTransform>();
        float yPos = -allTodos.IndexOf(todo) * itemHeight;
        rt.anchoredPosition = new Vector2(0, yPos);
    }
}
```

### 工具層

#### DataPersistence.cs 深入解析

**序列化最佳實踐**：

```csharp
// 1. 包裝類（JsonUtility 不能直接序列化 List）
[Serializable]
private class TodoListData
{
    public List<Todo> todos;
    public long lastSaved;

    public TodoListData()
    {
        todos = new List<Todo>();
        lastSaved = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    }
}

// 2. 序列化
public void SaveTodos(List<Todo> todos)
{
    TodoListData data = new TodoListData
    {
        todos = todos,
        lastSaved = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
    };

    // 第二個參數 true = 美化輸出
    string json = JsonUtility.ToJson(data, true);

    // 保存
    PlayerPrefs.SetString(SAVE_KEY, json);
    PlayerPrefs.Save();  // 立即寫入磁盤
}

// 3. 反序列化
public List<Todo> LoadTodos()
{
    string json = PlayerPrefs.GetString(SAVE_KEY, string.Empty);

    if (string.IsNullOrEmpty(json))
    {
        return new List<Todo>();
    }

    TodoListData data = JsonUtility.FromJson<TodoListData>(json);
    return data?.todos ?? new List<Todo>();
}
```

**平台特定路徑**：

```csharp
// Unity 的 Application.persistentDataPath 會根據平台自動選擇
private string GetFilePath()
{
    return Path.Combine(Application.persistentDataPath, FILE_NAME);
}

// 各平台路徑示例：
/*
Windows:
C:/Users/<user>/AppData/LocalLow/<company>/<product>/todos.json

macOS:
~/Library/Application Support/<company>/<product>/todos.json

Linux:
~/.config/unity3d/<company>/<product>/todos.json

iOS:
/var/mobile/Containers/Data/Application/<guid>/Documents/todos.json

Android:
/storage/emulated/0/Android/data/<package>/files/todos.json

WebGL:
IndexedDB (瀏覽器數據庫)
*/
```

**錯誤處理**：

```csharp
public void SaveTodos(List<Todo> todos)
{
    try
    {
        // 1. 驗證數據
        if (todos == null)
        {
            Debug.LogWarning("Cannot save null todo list");
            return;
        }

        // 2. 創建備份（可選）
        if (HasSavedData())
        {
            CreateBackup(todos);
        }

        // 3. 序列化
        TodoListData data = new TodoListData { todos = todos };
        string json = JsonUtility.ToJson(data, true);

        // 4. 保存
        SaveToFile(json);

        Debug.Log($"Saved {todos.Count} todos successfully");
    }
    catch (System.Exception e)
    {
        Debug.LogError($"Failed to save todos: {e.Message}");
        Debug.LogException(e);

        // 5. 通知用戶（可選）
        ShowErrorDialog("Failed to save data");
    }
}

public List<Todo> LoadTodos()
{
    try
    {
        string json = LoadFromFile();

        if (string.IsNullOrEmpty(json))
        {
            return new List<Todo>();
        }

        TodoListData data = JsonUtility.FromJson<TodoListData>(json);

        // 驗證加載的數據
        if (data == null || data.todos == null)
        {
            Debug.LogWarning("Loaded data is invalid");
            return new List<Todo>();
        }

        // 過濾無效項目
        data.todos = data.todos.Where(t => t != null && t.IsValid()).ToList();

        return data.todos;
    }
    catch (System.Exception e)
    {
        Debug.LogError($"Failed to load todos: {e.Message}");

        // 嘗試從備份恢復
        return LoadFromBackup();
    }
}
```

---

## 構建和發布

### Windows 平台

#### 構建設置

```
1. File → Build Settings
2. Platform: PC, Mac & Linux Standalone
3. Target Platform: Windows
4. Architecture: x86_64 (推薦)
5. Development Build: ✗ (發布版)
```

#### Player Settings

```csharp
// Edit → Project Settings → Player → Windows

Icon:
  Default Icon: (設置 .ico 文件)
  Override for Windows: (可選)

Resolution and Presentation:
  Fullscreen Mode: Windowed
  Default Screen Width: 1280
  Default Screen Height: 720
  Resizable Window: ✓
  Run In Background: ✓

Splash Image:
  Show Splash Screen: ✓ (Free 版必須)
  Unity Logo: (無法移除，除非 Plus/Pro)

Other Settings:
  Scripting Backend: IL2CPP (推薦，更好的性能)
  API Compatibility Level: .NET Standard 2.1
  Configuration:
    Scripting Define Symbols: WINDOWS_BUILD
```

#### 構建步驟

```
1. 檢查場景：
   Build Settings → Scenes In Build
   確保 MainScene 已勾選

2. 設置輸出目錄：
   點擊 "Build"
   選擇目錄：Builds/Windows/

3. 等待構建完成（5-15 分鐘）

4. 輸出文件：
   TodoList.exe
   TodoList_Data/
   UnityPlayer.dll
   UnityCrashHandler64.exe
```

#### 優化建議

```csharp
// 啟用壓縮
Player Settings → Publishing Settings
  Compression Method: LZ4 (快) 或 Gzip (小)

// 移除不需要的模塊
Player Settings → Other Settings
  Strip Engine Code: ✓
  Managed Stripping Level: High

// 優化圖形
Player Settings → Quality
  Anti Aliasing: Disabled
  Shadows: Disable Shadows
  VSync Count: Don't Sync
```

### macOS 平台

#### 構建設置

```
平台選擇：
  File → Build Settings
  Platform: PC, Mac & Linux Standalone
  Target Platform: macOS

架構：
  Intel 64-bit (x64) - 兼容性好
  Apple Silicon (ARM64) - 性能好
  Universal (推薦) - 支持所有 Mac
```

#### Player Settings

```csharp
// macOS Specific

Bundle Identifier:
  com.yourcompany.todolist

Minimum macOS Version:
  10.13 (High Sierra) - 廣泛兼容
  11.0 (Big Sur) - 現代特性
  12.0 (Monterey) - 最新

Icon:
  Default Icon: (設置 .icns 文件)

Camera Usage Description:
  "Not used"  // 即使不用也要填

Microphone Usage Description:
  "Not used"
```

#### 代碼簽名

```bash
# 開發者 ID 簽名
# 需要 Apple Developer Account ($99/年)

# 1. 創建證書
# 訪問：developer.apple.com
# Certificates → Create Certificate
# Type: Developer ID Application

# 2. 下載並安裝證書

# 3. 在 Unity 中設置
# Player Settings → macOS → Identification
# Signing Team ID: (你的 Team ID)

# 4. 構建後簽名
codesign --force --deep --sign "Developer ID Application: Your Name" TodoList.app

# 5. 驗證簽名
codesign --verify --deep --strict --verbose=2 TodoList.app

# 6. 公證（Notarization）
xcrun altool --notarize-app \
  --primary-bundle-id "com.yourcompany.todolist" \
  --username "your@email.com" \
  --password "@keychain:AC_PASSWORD" \
  --file TodoList.app

# 7. 驗證公證
xcrun stapler staple TodoList.app
```

#### 創建 DMG

```bash
# 使用 create-dmg 工具
brew install create-dmg

create-dmg \
  --volname "Todo List" \
  --volicon "icon.icns" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "TodoList.app" 200 190 \
  --hide-extension "TodoList.app" \
  --app-drop-link 600 185 \
  "TodoList.dmg" \
  "TodoList.app"
```

### Linux 平台

#### 構建設置

```
Platform: PC, Mac & Linux Standalone
Target Platform: Linux
Architecture: x86_64

Headless Mode: ✗ (需要 GUI)
```

#### Player Settings

```csharp
Product Name: TodoList
Company Name: Your Company

Other Settings:
  Scripting Backend: Mono (更好的兼容性)
  或 IL2CPP (更好的性能)

  Strip Engine Code: ✓

  Configuration:
    Scripting Define Symbols: LINUX_BUILD
```

#### 創建 AppImage

```bash
# 1. 下載 AppImage 工具
wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
chmod +x appimagetool-x86_64.AppImage

# 2. 創建目錄結構
mkdir -p TodoList.AppDir/usr/bin
mkdir -p TodoList.AppDir/usr/share/applications
mkdir -p TodoList.AppDir/usr/share/icons/hicolor/256x256/apps

# 3. 複製構建文件
cp -r TodoList_Data/ TodoList.AppDir/usr/bin/
cp TodoList.x86_64 TodoList.AppDir/usr/bin/

# 4. 創建 desktop 文件
cat > TodoList.AppDir/usr/share/applications/todolist.desktop << EOF
[Desktop Entry]
Name=Todo List
Exec=TodoList.x86_64
Icon=todolist
Type=Application
Categories=Utility;
EOF

# 5. 複製圖標
cp icon.png TodoList.AppDir/usr/share/icons/hicolor/256x256/apps/todolist.png

# 6. 創建 AppImage
./appimagetool-x86_64.AppImage TodoList.AppDir TodoList-x86_64.AppImage
```

### Android 平台

#### 環境準備

```
1. 安裝 Android Build Support：
   Unity Hub → Installs → 你的 Unity 版本 → Add Modules
   ✓ Android Build Support
     ├─ Android SDK & NDK Tools
     └─ OpenJDK

2. 或手動設置：
   Edit → Preferences → External Tools

   Android SDK: /path/to/Android/SDK
   Android NDK: /path/to/Android/NDK
   JDK: /path/to/OpenJDK
```

#### Player Settings

```csharp
// Edit → Project Settings → Player → Android

Identification:
  Package Name: com.yourcompany.todolist
  Version: 1.0.0
  Bundle Version Code: 1
  Minimum API Level: Android 5.1 (API 22)
  Target API Level: Automatic (Highest Installed)

Icon:
  Override for Android: ✓
  Adaptive Icon: (提供前景和背景圖層)

Configuration:
  Scripting Backend: IL2CPP (推薦)
  ARM64: ✓ (Google Play 要求)
  ARMv7: ✓ (兼容舊設備)

  Internet Access: Auto (如需網絡功能)
  Write Permission: Internal Only

Other Settings:
  Install Location: Automatic
  Multithreaded Rendering: ✓

Publishing Settings:
  Keystore:
    Use Custom Keystore: ✓
    Keystore Password: ****
    Key Alias: todolist
    Key Password: ****
```

#### 創建 Keystore

```bash
# 使用 keytool 創建
keytool -genkey -v -keystore todolist.keystore \
  -alias todolist \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 輸入信息：
# 密碼、名字、組織等

# 保存好 keystore 文件和密碼！
# 更新應用必須使用相同的 keystore
```

#### 構建 APK

```
1. File → Build Settings
2. Platform: Android
3. Switch Platform (如果未切換)
4. Build System: Gradle
5. Export Project: ✗ (直接構建 APK)
6. Build: 選擇輸出位置
7. 等待構建完成（10-30 分鐘，首次更久）

輸出文件：
  TodoList.apk (Debug)
  TodoList_release.apk (Release)
```

#### 構建 AAB (Google Play)

```
Publishing Settings:
  Build App Bundle (Google Play): ✓

File → Build Settings → Build

輸出：
  TodoList.aab

上傳到 Google Play Console
```

#### 測試

```bash
# 安裝 ADB
# macOS
brew install android-platform-tools

# 連接設備
adb devices

# 安裝 APK
adb install TodoList.apk

# 查看日誌
adb logcat -s Unity
```

### iOS 平台

#### 環境準備

```
要求：
  ✓ macOS 電腦
  ✓ Xcode 12.0+
  ✓ Apple Developer Account ($99/年)
  ✓ iOS Build Support Module

安裝 Xcode：
  App Store → 搜索 "Xcode" → 安裝

  或通過命令行：
  xcode-select --install
```

#### Player Settings

```csharp
// Edit → Project Settings → Player → iOS

Identification:
  Bundle Identifier: com.yourcompany.todolist
  Version: 1.0.0
  Build: 1

  Signing Team ID: (從 Apple Developer 獲取)
  Automatically Sign: ✓

Target Minimum iOS Version:
  12.0 (廣泛兼容)
  14.0 (現代特性)
  15.0 (最新)

Architecture:
  ARM64

Configuration:
  Scripting Backend: IL2CPP (必須)

Other Settings:
  Camera Usage Description: "Not used"
  Location Usage Description: "Not used"
  Microphone Usage Description: "Not used"
```

#### 構建 Xcode 項目

```
1. File → Build Settings
2. Platform: iOS
3. Switch Platform
4. Export Project: ✓ (導出 Xcode 項目)
5. Build: 選擇輸出目錄
6. 等待導出完成
```

#### 在 Xcode 中構建

```
1. 打開導出的 .xcworkspace 文件（不是 .xcodeproj！）

2. 選擇開發團隊：
   Project Settings → Signing & Capabilities
   Team: (選擇你的 Apple Developer Team)

3. 連接 iOS 設備：
   用 USB 連接 iPhone/iPad

4. 選擇目標設備：
   頂部工具欄 → 選擇你的設備

5. 構建並運行：
   Product → Run (Cmd+R)

   或僅構建：
   Product → Build (Cmd+B)
```

#### 發布到 App Store

```
1. Archive 項目：
   Product → Archive
   等待構建完成

2. 在 Organizer 中：
   Window → Organizer
   選擇 Archive
   點擊 "Distribute App"

3. 選擇發布方式：
   App Store Connect
   Next

4. 上傳選項：
   ✓ Upload
   ✓ Strip Swift symbols
   ✓ Upload your app's symbols
   Next

5. 簽名：
   Automatically manage signing
   Next

6. 上傳：
   Upload
   等待上傳完成

7. 在 App Store Connect 中：
   appstoreconnect.apple.com
   My Apps → TodoList
   TestFlight → 選擇構建
   提交審核
```

### WebGL 平台

#### Player Settings

```csharp
// Edit → Project Settings → Player → WebGL

Resolution and Presentation:
  Default Canvas Width: 1280
  Default Canvas Height: 720
  Run In Background: ✓

Publishing Settings:
  Compression Format: Gzip (推薦)
  或 Brotli (更小，但部分服務器不支持)
  或 Disabled (最大兼容性)

  Memory Size: 256 MB (可根據需要調整)

  Enable Exceptions: None (性能最好)
  或 Explicitly Thrown Exceptions Only

  Data caching: ✓

Template:
  Default (可自定義 HTML 模板)

Other Settings:
  Strip Engine Code: ✓
  Managed Stripping Level: High
```

#### 構建

```
1. File → Build Settings
2. Platform: WebGL
3. Switch Platform
4. Build: 選擇輸出目錄
5. 等待構建（可能很長，10-60 分鐘）

輸出目錄結構：
Build/
├── index.html
├── Build/
│   ├── TodoList.data.gz
│   ├── TodoList.framework.js.gz
│   ├── TodoList.loader.js
│   └── TodoList.wasm.gz
└── TemplateData/
    ├── style.css
    ├── favicon.ico
    └── ...
```

#### 本地測試

```bash
# 不能直接用 file:// 協議
# 必須通過 HTTP 服務器

# Python 3
cd Build
python -m http.server 8000

# Python 2
cd Build
python -m SimpleHTTPServer 8000

# Node.js (http-server)
npm install -g http-server
cd Build
http-server

# 訪問：http://localhost:8000
```

#### 部署到 Web

##### GitHub Pages

```bash
# 1. 創建 GitHub 倉庫
# 2. 克隆倉庫
git clone https://github.com/username/todolist-webgl.git
cd todolist-webgl

# 3. 複製構建文件
cp -r ../Build/* .

# 4. 提交
git add .
git commit -m "Deploy WebGL build"
git push

# 5. 啟用 GitHub Pages
# Settings → Pages
# Source: main branch
# 訪問：https://username.github.io/todolist-webgl/
```

##### Netlify

```bash
# 1. 安裝 Netlify CLI
npm install -g netlify-cli

# 2. 登錄
netlify login

# 3. 部署
cd Build
netlify deploy

# 首次部署：
# 選擇 "Create & configure a new site"
# 輸入 site name

# 4. 生產部署
netlify deploy --prod

# 獲得 URL：https://your-site.netlify.app
```

##### Vercel

```bash
# 1. 安裝 Vercel CLI
npm install -g vercel

# 2. 登錄
vercel login

# 3. 部署
cd Build
vercel

# 首次部署會詢問項目設置
# 後續部署直接運行 vercel 即可
```

#### 服務器配置

**Nginx**：
```nginx
server {
    listen 80;
    server_name todolist.example.com;

    root /var/www/todolist;
    index index.html;

    # 啟用 Gzip
    gzip on;
    gzip_types application/javascript application/wasm;

    # MIME 類型
    location ~ \.wasm$ {
        types { application/wasm wasm; }
    }

    # 緩存
    location ~* \.(data|wasm|js)$ {
        add_header Cache-Control "public, max-age=31536000";
    }

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache (.htaccess)**：
```apache
# 啟用 Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/wasm
</IfModule>

# MIME 類型
AddType application/wasm .wasm

# 緩存
<FilesMatch "\.(data|wasm|js)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# SPA 路由
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

## 性能優化

### UI 性能優化

#### 1. Canvas 優化

```csharp
// 問題：過多 Canvas 重繪

// 解決方案 A：分離靜態和動態 Canvas
// 靜態 Canvas（背景、標題等）
Canvas staticCanvas = CreateCanvas("StaticCanvas", 0);

// 動態 Canvas（Todo 列表）
Canvas dynamicCanvas = CreateCanvas("DynamicCanvas", 1);

// 解決方案 B：使用 Canvas Group 控制重繪
CanvasGroup group = GetComponent<CanvasGroup>();
group.interactable = false; // 停止接收事件
group.blocksRaycasts = false; // 停止射線檢測
```

#### 2. Layout 優化

```csharp
// 問題：Layout Group 每幀重新計算

// 解決方案：禁用不需要的 Layout 組件
LayoutGroup layout = GetComponent<LayoutGroup>();
layout.enabled = false;  // 佈局完成後禁用

// 或使用 Layout Element 固定大小
LayoutElement element = gameObject.AddComponent<LayoutElement>();
element.preferredWidth = 200;
element.preferredHeight = 80;
element.flexibleWidth = -1;  // 禁用彈性
element.flexibleHeight = -1;
```

#### 3. TextMeshPro 優化

```csharp
// 問題：動態文本導致網格重建

// 解決方案 A：使用對象池
public class TextPool : MonoBehaviour
{
    private Queue<TextMeshProUGUI> pool = new Queue<TextMeshProUGUI>();

    public TextMeshProUGUI Get()
    {
        if (pool.Count > 0)
        {
            var text = pool.Dequeue();
            text.gameObject.SetActive(true);
            return text;
        }
        return CreateNew();
    }

    public void Return(TextMeshProUGUI text)
    {
        text.gameObject.SetActive(false);
        pool.Enqueue(text);
    }
}

// 解決方案 B：啟用 Extra Padding
tmp.extraPadding = true;  // 減少網格重建
```

#### 4. 滾動列表優化

```csharp
// 問題：大量項目導致性能下降

// 解決方案：虛擬滾動（只渲染可見項目）
public class RecyclingListView : MonoBehaviour
{
    [SerializeField] private ScrollRect scrollRect;
    [SerializeField] private RectTransform content;
    [SerializeField] private GameObject itemPrefab;

    private List<GameObject> itemPool = new List<GameObject>();
    private List<Todo> data;
    private int visibleCount = 10;
    private float itemHeight = 80f;

    public void SetData(List<Todo> newData)
    {
        data = newData;
        content.sizeDelta = new Vector2(
            content.sizeDelta.x,
            data.Count * itemHeight
        );
        RefreshVisible();
    }

    private void RefreshVisible()
    {
        float scrollPos = scrollRect.content.anchoredPosition.y;
        int firstVisible = Mathf.Max(0, Mathf.FloorToInt(scrollPos / itemHeight));
        int lastVisible = Mathf.Min(data.Count, firstVisible + visibleCount);

        // 回收不可見項目
        foreach (var item in itemPool)
        {
            item.SetActive(false);
        }

        // 渲染可見項目
        for (int i = firstVisible; i < lastVisible; i++)
        {
            GameObject item = GetPooledItem();
            SetupItem(item, data[i], i);
        }
    }
}
```

### 內存優化

#### 1. 對象池

```csharp
// Todo Item 對象池
public class TodoItemPool : MonoBehaviour
{
    [SerializeField] private GameObject prefab;
    [SerializeField] private int initialSize = 10;
    [SerializeField] private Transform container;

    private Queue<GameObject> pool = new Queue<GameObject>();

    private void Awake()
    {
        // 預創建對象
        for (int i = 0; i < initialSize; i++)
        {
            CreateNew();
        }
    }

    private GameObject CreateNew()
    {
        GameObject obj = Instantiate(prefab, container);
        obj.SetActive(false);
        pool.Enqueue(obj);
        return obj;
    }

    public GameObject Get()
    {
        if (pool.Count == 0)
        {
            CreateNew();
        }

        GameObject obj = pool.Dequeue();
        obj.SetActive(true);
        return obj;
    }

    public void Return(GameObject obj)
    {
        obj.SetActive(false);
        pool.Enqueue(obj);
    }

    public void Clear()
    {
        foreach (var obj in pool)
        {
            Destroy(obj);
        }
        pool.Clear();
    }
}
```

#### 2. 資源卸載

```csharp
public class ResourceManager : MonoBehaviour
{
    // 定期卸載未使用的資源
    private void Start()
    {
        InvokeRepeating("UnloadUnusedAssets", 60f, 60f);
    }

    private void UnloadUnusedAssets()
    {
        Resources.UnloadUnusedAssets();
        System.GC.Collect();
    }

    // 場景切換時清理
    private void OnDestroy()
    {
        Resources.UnloadUnusedAssets();
    }
}
```

### 渲染優化

#### 1. 減少 Draw Calls

```csharp
// 使用 Sprite Atlas 合併紋理
// Window → 2D → Sprite Atlas

// 創建 Sprite Atlas
// Assets → Create → 2D → Sprite Atlas
// 添加所有 UI 精靈到 Atlas

// Unity 會自動合併到一張紋理
// 減少 Draw Calls
```

#### 2. 批處理

```csharp
// 使用相同材質
// 所有 UI 元素使用相同的材質可以被批處理

// 啟用 Static Batching
// Player Settings → Other Settings → Static Batching: ✓

// 標記靜態對象
gameObject.isStatic = true;
```

### 代碼優化

#### 1. 避免頻繁的 Find 調用

```csharp
// 錯誤：每幀查找
void Update()
{
    GameObject.Find("TodoManager");  // 慢！
}

// 正確：緩存引用
private TodoManager manager;

void Awake()
{
    manager = TodoManager.Instance;  // 一次查找
}

void Update()
{
    manager.DoSomething();  // 使用緩存
}
```

#### 2. 使用 StringBuilder

```csharp
// 錯誤：頻繁字符串拼接
string text = "";
foreach (var todo in todos)
{
    text += todo.Text + "\n";  // 每次創建新字符串
}

// 正確：使用 StringBuilder
System.Text.StringBuilder sb = new System.Text.StringBuilder();
foreach (var todo in todos)
{
    sb.AppendLine(todo.Text);
}
string text = sb.ToString();
```

#### 3. 對象池化 LINQ

```csharp
// 避免每次查詢創建新集合
// 使用 List.FindAll 代替 LINQ Where().ToList()

// LINQ (創建中間集合)
var active = todos.Where(t => !t.Completed).ToList();

// List.FindAll (性能更好)
var active = todos.FindAll(t => !t.Completed);
```

### Profiler 使用

```csharp
// 打開 Profiler
// Window → Analysis → Profiler

// 關鍵指標：
// - CPU Usage：CPU 時間
// - Rendering：渲染開銷
// - Memory：內存使用
// - UI：UI 更新開銷

// 自定義 Profiler 標記
using Unity.Profiling;

ProfilerMarker marker = new ProfilerMarker("MyCustomOperation");

void MyMethod()
{
    marker.Begin();
    // 代碼...
    marker.End();
}

// 或使用 using
void MyMethod()
{
    using (marker.Auto())
    {
        // 代碼...
    }
}
```

---

## 與傳統框架對比

### Unity vs React

| 特性 | Unity (UGUI) | React |
|------|--------------|-------|
| **語言** | C# | JavaScript/TypeScript |
| **UI 範式** | 組件化（GameObject + Components） | 組件化（JSX Components） |
| **狀態管理** | MonoBehaviour fields + Events | State + Props + Context |
| **數據流** | Event-driven | Unidirectional data flow |
| **性能** | 原生渲染引擎 | Virtual DOM |
| **平台** | 25+ 平台 | Web + React Native |
| **應用大小** | 100MB+ | 5MB+ |
| **學習曲線** | 陡峭（需學 Unity 和 C#） | 中等（主要是 React） |
| **開發體驗** | 可視化編輯器 + 代碼 | 代碼為主 + DevTools |
| **熱更新** | 需要重新構建 | HMR 支持 |
| **生態系統** | 遊戲開發為主 | Web 開發豐富 |

**代碼對比**：

```csharp
// Unity: TodoItemUI.cs
public class TodoItemUI : MonoBehaviour
{
    [SerializeField] private TMP_Text todoText;
    [SerializeField] private Toggle completeToggle;

    private Todo todo;

    public void SetTodo(Todo data)
    {
        todo = data;
        UpdateUI();
    }

    private void UpdateUI()
    {
        todoText.text = todo.Text;
        completeToggle.isOn = todo.Completed;
    }
}
```

```jsx
// React: TodoItem.tsx
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.text}
      </span>
    </div>
  );
};
```

### Unity vs Flutter

| 特性 | Unity | Flutter |
|------|-------|---------|
| **語言** | C# | Dart |
| **UI 系統** | UGUI / UI Toolkit | Widgets |
| **渲染** | Unity Renderer | Skia |
| **平台** | 25+ 包含主機 | Mobile, Web, Desktop |
| **應用大小** | 100MB+ | 10-20MB |
| **性能** | 優秀（遊戲級） | 優秀（60fps） |
| **3D 支持** | 原生 | 有限（通過插件） |
| **開發體驗** | Unity Editor | Hot Reload |
| **適用場景** | 遊戲、複雜視覺 | 一般應用 |

### Unity vs Electron

| 特性 | Unity | Electron |
|------|-------|----------|
| **技術棧** | C# + Unity | HTML + CSS + JS |
| **應用大小** | 100-200MB | 100-200MB |
| **內存佔用** | 中等 | 高（Chrome + Node.js） |
| **啟動時間** | 較慢（引擎初始化） | 較慢（Chrome 啟動） |
| **平台** | 多平台（包含移動） | 主要桌面 |
| **Web 技術** | ✗ | ✓ |
| **3D/動畫** | ✓ | 有限 |
| **開發門檻** | 需學 Unity | Web 開發即可 |

### 總結對比

**選擇 Unity 如果**：
```
✓ 需要豐富的視覺效果和動畫
✓ 需要 3D 功能
✓ 需要部署到遊戲主機
✓ 需要 AR/VR 支持
✓ 團隊有遊戲開發經驗
✓ 遊戲化應用
```

**選擇傳統框架如果**：
```
✓ 簡單的業務應用
✓ Web 優先
✓ 應用大小敏感
✓ 啟動速度要求高
✓ 團隊是 Web 開發背景
✓ 需要豐富的 Web 生態
```

---

## 常見問題

### Unity 相關

**Q: Unity 免費嗎？**

A: Unity Personal 版本完全免費，適用於：
- 年收入 < $100,000 的個人或公司
- 功能完整（除了啟動畫面）
- 可商業使用

**Q: Unity 應用為什麼這麼大？**

A: Unity 應用包含：
- Unity 引擎運行時（30-50MB）
- 圖形系統
- 物理系統
- 音頻系統
- 其他模塊

優化建議：
```
- 使用 IL2CPP 後端
- 啟用代碼剝離
- 壓縮資源
- 移除未使用的模塊
```

**Q: 如何減小應用大小？**

A:
```csharp
// 1. 剝離引擎代碼
Player Settings → Other Settings
Strip Engine Code: ✓
Managed Stripping Level: High

// 2. 壓縮
Publishing Settings
Compression Method: LZ4HC

// 3. 移除未使用資源
// 使用 Unity Cloud Build 或打包工具分析

// 4. 使用 Addressables
// 動態加載資源，減少初始包大小
```

**Q: Unity 適合做應用嗎？**

A: 取決於應用類型：

適合：
- 需要豐富視覺效果
- 遊戲化應用
- AR/VR 應用
- 3D 展示應用
- 教育互動軟件

不適合：
- 簡單的 CRUD 應用
- 表單密集型應用
- 企業管理系統
- 文本編輯器

### 開發相關

**Q: 如何調試 Unity 代碼？**

A:
```
Visual Studio:
1. 確保安裝 Unity 工作負載
2. Unity Editor → Edit → Preferences → External Tools
3. External Script Editor: Visual Studio
4. 在代碼中設置斷點
5. Unity Editor 頂部 → Attach to Unity
6. Play Mode 運行
7. 斷點會被觸發

VS Code:
1. 安裝 Debugger for Unity 擴展
2. F5 開始調試
3. 選擇 Unity Editor
```

**Q: 如何管理多個場景？**

A:
```csharp
// 加載場景
SceneManager.LoadScene("MainScene");

// 異步加載
StartCoroutine(LoadSceneAsync("MainScene"));

IEnumerator LoadSceneAsync(string sceneName)
{
    AsyncOperation operation = SceneManager.LoadSceneAsync(sceneName);

    while (!operation.isDone)
    {
        float progress = operation.progress;
        // 顯示進度
        yield return null;
    }
}

// 疊加場景
SceneManager.LoadScene("UIScene", LoadSceneMode.Additive);
```

**Q: 如何處理不同屏幕尺寸？**

A:
```csharp
// 1. Canvas Scaler
Canvas Scaler:
  UI Scale Mode: Scale With Screen Size
  Reference Resolution: 1920x1080
  Match: 0.5  // 調整以適應長寬比

// 2. Anchors
// 使用錨點讓 UI 自適應

// 3. Safe Area (移動設備)
public class SafeAreaFitter : MonoBehaviour
{
    void Awake()
    {
        RectTransform rectTransform = GetComponent<RectTransform>();
        Rect safeArea = Screen.safeArea;

        Vector2 anchorMin = safeArea.position;
        Vector2 anchorMax = anchorMin + safeArea.size;

        anchorMin.x /= Screen.width;
        anchorMin.y /= Screen.height;
        anchorMax.x /= Screen.width;
        anchorMax.y /= Screen.height;

        rectTransform.anchorMin = anchorMin;
        rectTransform.anchorMax = anchorMax;
    }
}
```

### 發布相關

**Q: 如何發布到 Google Play？**

A:
```
1. 創建 Google Play 開發者帳號（$25 一次性費用）
2. 在 Unity 中構建 AAB
3. 登錄 Google Play Console
4. 創建應用
5. 上傳 AAB
6. 填寫商店資訊
7. 提交審核
```

**Q: 如何發布到 App Store？**

A:
```
1. 註冊 Apple Developer Program（$99/年）
2. 在 Unity 中導出 Xcode 項目
3. 在 Xcode 中 Archive
4. 上傳到 App Store Connect
5. 填寫應用資訊
6. 提交審核
```

**Q: WebGL 部署到哪裡？**

A:
```
免費選項：
- GitHub Pages
- Netlify
- Vercel
- itch.io (遊戲平台)
- Simmer.io (Unity WebGL 專門)

付費選項：
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage
```

---

## 學習資源

### 官方文檔

```
Unity 官方文檔：
https://docs.unity3d.com/

Unity Learn：
https://learn.unity.com/

Unity Manual：
https://docs.unity3d.com/Manual/

Unity Scripting API：
https://docs.unity3d.com/ScriptReference/

Unity UI Documentation：
https://docs.unity3d.com/Packages/com.unity.ugui@1.0/

TextMeshPro Documentation：
https://docs.unity3d.com/Manual/com.unity.textmeshpro.html
```

### 推薦教程

```
Unity Learn Platform：
- Unity Essentials Pathway
- Junior Programmer Pathway
- UI Design Fundamentals

YouTube 頻道：
- Brackeys
- Sebastian Lague
- Code Monkey
- Infallible Code
- Jason Weimann

Udemy 課程：
- Complete C# Unity Game Developer 2D
- Complete C# Unity Game Developer 3D
```

### 社區資源

```
論壇：
- Unity Forums: https://forum.unity.com/
- Unity Answers: https://answers.unity.com/
- Stack Overflow: [unity3d] 標籤

Discord：
- Unity Discord (官方)
- Unity Game Development Discord

Reddit：
- r/Unity3D
- r/Unity2D
- r/gamedev
```

### 資源商店

```
Unity Asset Store：
https://assetstore.unity.com/

免費資源：
- Standard Assets
- UI Samples
- 2D Game Kit
- TextMesh Pro

推薦付費：
- DOTween Pro (動畫)
- Odin Inspector (編輯器增強)
- Amplify Shader Editor (著色器)
```

---

## 總結

這個 Unity Todo List 專案展示了：

1. **Unity 作為應用開發工具的潛力**
   - 強大的跨平台能力
   - 豐富的視覺效果
   - 專業的開發工具

2. **Unity UI 系統的使用**
   - UGUI 組件化設計
   - Canvas 和 RectTransform
   - 事件系統

3. **C# 和 Unity 最佳實踐**
   - 單例模式
   - 事件驅動架構
   - 協程動畫
   - 數據持久化

4. **完整的應用開發流程**
   - 項目設置
   - 功能開發
   - 測試調試
   - 構建發布

雖然對於簡單的 Todo List 來說，Unity 可能是「大材小用」，但這個專案是一個很好的學習資源，展示了如何使用遊戲引擎開發實用應用。

對於需要豐富視覺效果、跨多平台發布、或者遊戲化體驗的應用，Unity 是一個值得考慮的選擇。

---

## 許可證

MIT License

---

## 聯繫方式

- 項目地址：https://github.com/yourusername/TodoListDemo
- 問題反饋：https://github.com/yourusername/TodoListDemo/issues
- 電子郵件：your@email.com

---

**Happy Coding with Unity! 🎮**
