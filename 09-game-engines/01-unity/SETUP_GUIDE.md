# Unity Todo List - 完整設置指南

本指南將詳細說明如何從零開始在 Unity 中設置這個 Todo List 專案。

## 目錄

- [環境準備](#環境準備)
- [專案創建](#專案創建)
- [場景設置](#場景設置)
- [UI 組件配置](#ui-組件配置)
- [腳本配置](#腳本配置)
- [測試運行](#測試運行)
- [打包發布](#打包發布)

---

## 環境準備

### 1. 安裝 Unity

**推薦版本：Unity 2022.3 LTS**

1. 下載並安裝 Unity Hub
   - Windows/Mac: https://unity.com/download
   - Linux: https://docs.unity3d.com/hub/manual/InstallHub.html

2. 在 Unity Hub 中安裝 Unity 2022.3 LTS
   - 選擇模組：
     - ✅ Windows Build Support (IL2CPP)
     - ✅ Android Build Support
     - ✅ iOS Build Support (僅 Mac)
     - ✅ WebGL Build Support
     - ✅ Documentation

### 2. 驗證安裝

打開 Unity Hub，確認 Unity 2022.3.x 已成功安裝。

---

## 專案創建

### 方法 A：使用現有專案

```bash
# 克隆專案
git clone <repository-url>
cd TodoListDemo/09-game-engines/01-unity

# 在 Unity Hub 中打開專案
# 1. 打開 Unity Hub
# 2. 點擊 "Open" 或 "Add"
# 3. 選擇項目文件夾
# 4. 等待專案導入完成
```

### 方法 B：從零創建

#### 1. 創建新專案

1. 打開 Unity Hub
2. 點擊 "New Project"
3. 選擇模板：**2D (Core)** 或 **3D (Core)**
4. 設置：
   - Project Name: `UnityTodoList`
   - Location: 選擇合適的位置
5. 點擊 "Create Project"

#### 2. 設置專案結構

在 Project 視圖中創建以下文件夾結構：

```
Assets/
├── Scenes/
│   └── MainScene.unity
├── Scripts/
│   ├── Data/
│   ├── Core/
│   ├── UI/
│   ├── Utils/
│   ├── Events/
│   ├── ScriptableObjects/
│   └── Editor/
├── Prefabs/
│   └── UI/
├── Resources/
│   ├── Settings/
│   └── Events/
└── UI/
    └── Sprites/
```

#### 3. 導入必要的包

1. 打開 Window > Package Manager
2. 確認以下包已安裝：
   - TextMeshPro (com.unity.textmeshpro)
   - UI Toolkit (com.unity.ui)
   - Input System (可選)

#### 4. 複製腳本文件

將以下腳本複製到對應的文件夾：

**Data:**
- `Todo.cs` → `Assets/Scripts/Data/`

**Core:**
- `TodoManager.cs` → `Assets/Scripts/Core/`

**UI:**
- `TodoListUI.cs` → `Assets/Scripts/UI/`
- `TodoItemUI.cs` → `Assets/Scripts/UI/`
- `TodoInputUI.cs` → `Assets/Scripts/UI/`
- `ToastNotification.cs` → `Assets/Scripts/UI/`

**Utils:**
- `DataPersistence.cs` → `Assets/Scripts/Utils/`
- `AudioManager.cs` → `Assets/Scripts/Utils/`
- `TodoAnimationController.cs` → `Assets/Scripts/Utils/`

**Events:**
- `GameEvent.cs` → `Assets/Scripts/Events/`
- `GameEventListener.cs` → `Assets/Scripts/Events/`
- `TodoEvents.cs` → `Assets/Scripts/Events/`

**ScriptableObjects:**
- `TodoListSettings.cs` → `Assets/Scripts/ScriptableObjects/`

**Editor:**
- `TodoListMenuItems.cs` → `Assets/Scripts/Editor/`

---

## 場景設置

### 1. 創建主場景

1. File > New Scene
2. 選擇 "2D" 或 "Basic (Built-in)" 模板
3. Save As: `Assets/Scenes/MainScene.unity`

### 2. 創建 Canvas 結構

#### 主 Canvas 層級結構

```
Canvas (Screen Space - Overlay)
├── TodoManager (Empty GameObject)
├── Header
│   ├── TitleText (TextMeshPro)
│   └── StatisticsPanel
│       ├── TotalText
│       ├── ActiveText
│       ├── CompletedText
│       └── ProgressBar
├── InputPanel
│   ├── InputField (TMP_InputField)
│   ├── PriorityDropdown (TMP_Dropdown)
│   ├── CategoryInputField (TMP_InputField)
│   └── AddButton (Button)
├── FilterPanel
│   ├── FilterDropdown (TMP_Dropdown)
│   ├── CategoryDropdown (TMP_Dropdown)
│   └── SearchInputField (TMP_InputField)
├── TodoListPanel
│   ├── ScrollView (Scroll Rect)
│   │   └── Viewport
│   │       └── Content (Vertical Layout Group)
│   └── EmptyStatePanel
│       ├── EmptyIcon (Image)
│       └── EmptyText (TextMeshPro)
├── ButtonPanel
│   ├── ClearCompletedButton
│   └── ClearAllButton
└── ToastContainer
    └── (Toast 通知會動態生成在這裡)
```

### 3. 詳細設置步驟

#### A. 創建 Canvas

1. Hierarchy > 右鍵 > UI > Canvas
2. Canvas 組件設置：
   - Render Mode: Screen Space - Overlay
   - Pixel Perfect: ✓ (可選)
   - Sort Order: 0

3. 添加 Canvas Scaler：
   - UI Scale Mode: Scale With Screen Size
   - Reference Resolution: 1920 x 1080
   - Screen Match Mode: Match Width Or Height
   - Match: 0.5

4. 添加 Graphic Raycaster（自動添加）

#### B. 創建 TodoManager GameObject

1. Hierarchy > 右鍵 > Create Empty
2. 重命名為 "TodoManager"
3. 添加 `TodoManager` 腳本組件
4. 配置：
   - Auto Save: ✓
   - Auto Save Interval: 30

#### C. 創建 Header

```
1. 創建 Panel (UI > Panel)
2. 重命名為 "Header"
3. RectTransform:
   - Anchors: Top Stretch
   - Position Y: -50
   - Height: 100

4. 添加子對象 TitleText (UI > Text - TextMeshPro)
   - Text: "Unity Todo List"
   - Font Size: 36
   - Alignment: Center
   - Color: #2C3E50
```

#### D. 創建 StatisticsPanel

```
1. 在 Header 下創建 Panel
2. 添加 Horizontal Layout Group
3. 添加三個 Text 子對象：
   - TotalText: "Total: 0"
   - ActiveText: "Active: 0"
   - CompletedText: "Completed: 0"

4. 添加 ProgressBar (UI > Slider)
   - Fill Rect: 設置顏色為綠色
   - Interactable: 關閉
```

#### E. 創建 InputPanel

```
1. 創建 Panel
2. 添加 Horizontal Layout Group
3. 添加組件：

   a. InputField (TMP_InputField)
      - Placeholder: "What needs to be done?"
      - Character Limit: 500
      - Flexible Width: 3

   b. PriorityDropdown (TMP_Dropdown)
      - Options: Low Priority, Medium Priority, High Priority
      - Flexible Width: 1

   c. CategoryInputField (TMP_InputField)
      - Placeholder: "Category"
      - Flexible Width: 1

   d. AddButton (Button)
      - Text: "Add"
      - Color: #27AE60
      - Width: 100
```

#### F. 創建 TodoListPanel

```
1. 創建 Panel
2. RectTransform:
   - Anchors: Stretch
   - Top: -200
   - Bottom: 100

3. 添加 ScrollView:
   a. Scroll Rect 設置：
      - Vertical: ✓
      - Horizontal: ✗
      - Movement Type: Elastic
      - Scrollbar Visibility: Auto Hide

   b. Viewport:
      - 添加 Mask 組件
      - 添加 Image 組件（可選背景）

   c. Content:
      - 添加 Vertical Layout Group:
        - Child Force Expand Height: ✗
        - Child Control Height: ✗
        - Spacing: 10
      - 添加 Content Size Fitter:
        - Vertical Fit: Preferred Size
```

#### G. 創建 EmptyStatePanel

```
1. 在 TodoListPanel 下創建 Panel
2. 默認隱藏
3. 添加文本和圖標提示無數據狀態
```

### 4. 創建 TodoItem Prefab

#### 創建 TodoItem 預製體

```
1. Hierarchy > 右鍵 > UI > Panel
2. 重命名為 "TodoItemPrefab"
3. 設置結構：

TodoItemPrefab (Panel)
├── ViewMode
│   ├── CompleteToggle (Toggle)
│   ├── PriorityIndicator (Image)
│   ├── TodoText (TextMeshPro)
│   ├── CategoryText (TextMeshPro)
│   ├── DateText (TextMeshPro)
│   ├── EditButton (Button)
│   └── DeleteButton (Button)
└── EditMode (默認隱藏)
    ├── EditInputField (TMP_InputField)
    ├── SaveButton (Button)
    └── CancelButton (Button)
```

#### TodoItem 組件設置

1. **主 Panel**
   - Height: 80
   - 添加 `TodoItemUI` 腳本
   - 添加 Canvas Group 組件
   - 添加 Horizontal Layout Group

2. **CompleteToggle**
   - Width: 40
   - Background: 自定義樣式
   - Checkmark: ✓ 圖標

3. **PriorityIndicator**
   - Width: 10
   - 用於顯示優先級顏色條

4. **TodoText**
   - Flexible Width: 1
   - Font Size: 18
   - Alignment: Middle Left

5. **按鈕設置**
   - EditButton: 鉛筆圖標
   - DeleteButton: 垃圾桶圖標
   - 添加 Hover 效果

6. **拖動到 Prefabs 文件夾**
   - 將配置好的 TodoItem 拖到 `Assets/Prefabs/UI/`
   - 刪除 Hierarchy 中的實例

### 5. 連接組件引用

#### TodoInputUI 配置

1. 選擇 InputPanel
2. 添加 `TodoInputUI` 腳本
3. 在 Inspector 中連接引用：
   - Input Field: 拖入 InputField
   - Add Button: 拖入 AddButton
   - Priority Dropdown: 拖入 PriorityDropdown
   - Category Input: 拖入 CategoryInputField

#### TodoListUI 配置

1. 選擇 TodoListPanel
2. 添加 `TodoListUI` 腳本
3. 連接引用：
   - Todo List Container: Content (ScrollView 的 Content)
   - Todo Item Prefab: 從 Prefabs 文件夾拖入
   - Scroll Rect: ScrollView
   - Filter Dropdown: FilterDropdown
   - Category Dropdown: CategoryDropdown
   - Search Input: SearchInputField
   - Clear Completed Button: ClearCompletedButton
   - Clear All Button: ClearAllButton
   - Total Count Text: TotalText
   - Active Count Text: ActiveText
   - Completed Count Text: CompletedText
   - Progress Bar: ProgressBar 的 Fill
   - Empty State Panel: EmptyStatePanel
   - Empty State Text: EmptyText

---

## ScriptableObject 創建

### 1. 創建 TodoListSettings

```
1. Assets/Resources/Settings 文件夾上右鍵
2. Create > Todo List > Settings
3. 命名為 "TodoListSettings"
4. 配置各項設置
```

### 2. 創建事件資源

```
在 Assets/Resources/Events 文件夾中創建：

1. Create > Todo List > Events > Game Event
   - 命名: OnTodoAdded

2. Create > Todo List > Events > Todo Object Event
   - 命名: OnTodoUpdated

3. Create > Todo List > Events > Todo String Event
   - 命名: OnTodoRemoved
```

---

## 腳本配置

### 1. TodoManager 設置

```csharp
在 Inspector 中設置：
- Auto Save: ✓
- Auto Save Interval: 30
- 可以添加初始測試數據
```

### 2. AudioManager 設置（可選）

```
1. 創建空 GameObject "AudioManager"
2. 添加 AudioManager 腳本
3. 拖入音效文件到對應字段
```

### 3. ToastNotification 設置（可選）

```
1. 創建 Toast Prefab
2. 在 Canvas 下創建 ToastContainer
3. 配置 ToastNotification 組件
```

---

## 測試運行

### 1. 場景驗證

檢查清單：
- ✅ TodoManager GameObject 存在
- ✅ 所有 UI 組件正確連接
- ✅ TodoItemPrefab 已創建
- ✅ 腳本沒有編譯錯誤

### 2. 運行測試

1. 點擊 Play 按鈕
2. 測試基本功能：
   - 添加 Todo
   - 完成 Todo
   - 編輯 Todo
   - 刪除 Todo
   - 過濾和搜索

3. 檢查 Console：
   - 無錯誤信息
   - 正常的日誌輸出

### 3. 使用 Editor 工具

```
Tools > Todo List > Add Sample Data
- 添加示例數據進行測試

Tools > Todo List > Print Statistics
- 查看統計信息

Tools > Todo List > Open Persistent Data Path
- 查看數據保存位置
```

---

## 打包發布

### Windows 平台

```
1. File > Build Settings
2. 選擇 Platform: Windows
3. Architecture: x86_64
4. 點擊 "Switch Platform"
5. Player Settings:
   - Company Name: 你的公司名
   - Product Name: Unity Todo List
   - Icon: 設置應用圖標
6. 點擊 "Build"
7. 選擇輸出文件夾
```

### macOS 平台

```
1. File > Build Settings
2. 選擇 Platform: Mac
3. Architecture: Apple Silicon, Intel 64-bit
4. Player Settings 配置同上
5. Build
```

### Android 平台

```
1. File > Build Settings
2. 選擇 Platform: Android
3. Player Settings:
   - Package Name: com.yourcompany.unitytodolist
   - Minimum API Level: Android 5.1 (API 22)
   - Target API Level: 最新
   - Scripting Backend: IL2CPP
   - Target Architectures: ARM64, ARMv7
4. Build APK 或 Build App Bundle
```

### iOS 平台

```
1. File > Build Settings
2. 選擇 Platform: iOS
3. Player Settings:
   - Bundle Identifier: com.yourcompany.unitytodolist
   - Camera Usage Description: (如需相機)
   - Target minimum iOS Version: 12.0
4. Build
5. 在 Xcode 中打開生成的項目
6. 配置簽名和打包
```

### WebGL 平台

```
1. File > Build Settings
2. 選擇 Platform: WebGL
3. Player Settings:
   - Compression Format: Gzip 或 Brotli
   - Memory Size: 256 MB (可調整)
4. Build
5. 部署到 Web 伺服器:
   - 需要支持正確的 MIME 類型
   - 建議使用 HTTPS
```

---

## 優化建議

### 性能優化

1. **使用對象池**
   ```csharp
   // 為 TodoItem 實現對象池
   // 避免頻繁創建和銷毀
   ```

2. **虛擬滾動**
   ```csharp
   // 大量項目時只渲染可見項
   // 使用 Recycling List View
   ```

3. **批量操作**
   ```csharp
   // 減少事件觸發次數
   // 批量更新 UI
   ```

### UI 優化

1. **分離 Canvas**
   - 靜態元素和動態元素使用不同 Canvas
   - 減少重繪範圍

2. **禁用不必要的組件**
   - 不可見時禁用 Canvas
   - 禁用不需要的 Raycaster

3. **使用 Sprite Atlas**
   - 減少 Draw Calls
   - 提升渲染性能

---

## 常見問題

### Q: TextMeshPro 導入錯誤？
**A:** Window > TextMeshPro > Import TMP Essential Resources

### Q: UI 不響應點擊？
**A:** 檢查 EventSystem 是否存在，Canvas 是否有 Graphic Raycaster

### Q: 數據保存失敗？
**A:** 檢查 Application.persistentDataPath 的寫入權限

### Q: 構建大小太大？
**A:**
- 移除未使用的資源
- 啟用代碼壓縮
- 使用 Addressables 按需加載

### Q: WebGL 構建運行緩慢？
**A:**
- 減少內存分配
- 啟用壓縮
- 優化資源大小

---

## 下一步

- 📚 閱讀 [README.md](README.md) 了解專案詳情
- 📋 查看 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) 了解架構
- 🎮 嘗試添加自定義功能
- 🚀 部署到目標平台

---

**祝你使用愉快！**

如有問題，請查閱 Unity 官方文檔或提交 Issue。
