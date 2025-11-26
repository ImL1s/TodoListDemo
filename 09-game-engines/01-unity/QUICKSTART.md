# Unity Todo List - 快速開始

5 分鐘快速了解並運行 Unity Todo List 專案！

## 📋 目錄

- [專案簡介](#專案簡介)
- [快速開始](#快速開始)
- [基本使用](#基本使用)
- [進階功能](#進階功能)
- [文檔導航](#文檔導航)

---

## 🎯 專案簡介

這是一個使用 **Unity 遊戲引擎** 構建的跨平台 Todo List 應用，展示了：

- ✅ 完整的 CRUD 操作
- 💾 數據持久化（JSON/PlayerPrefs）
- 🎨 流暢的動畫效果
- 🔍 搜索和過濾功能
- 🎮 Unity 最佳實踐
- 🌐 跨平台支持（Windows/Mac/Linux/Android/iOS/WebGL）

---

## 🚀 快速開始

### 方式 1: 使用 Unity Hub（推薦）

```bash
# 1. 克隆專案
git clone <repository-url>
cd TodoListDemo/09-game-engines/01-unity

# 2. 在 Unity Hub 中打開
# - 打開 Unity Hub
# - 點擊 "Add" 或 "Open"
# - 選擇此文件夾
# - 等待專案導入（首次需要 3-5 分鐘）

# 3. 運行
# - 打開場景: Scenes/MainScene.unity
# - 點擊 Play 按鈕▶️
```

### 方式 2: 從零創建（學習用）

詳細步驟請參考 [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 💡 基本使用

### 添加 Todo

1. 在頂部輸入框輸入任務內容
2. 選擇優先級（低/中/高）
3. 輸入分類（可選，默認為 "General"）
4. 點擊 "Add" 或按 Enter

### 完成 Todo

- 點擊左側的勾選框 ✓

### 編輯 Todo

- 點擊 Todo 項目上的編輯按鈕 ✏️
- 修改內容
- 點擊保存 ✓ 或取消 ✗

### 刪除 Todo

- 點擊 Todo 項目上的刪除按鈕 🗑️
- 觀察滑動刪除動畫

### 過濾和搜索

- **過濾:** 使用頂部的過濾器下拉選單
  - All: 顯示所有
  - Active: 僅顯示未完成
  - Completed: 僅顯示已完成

- **分類過濾:** 選擇特定分類

- **搜索:** 在搜索框輸入關鍵字

### 批量操作

- **清除已完成:** 點擊 "Clear Completed" 按鈕
- **清除全部:** 點擊 "Clear All" 按鈕

---

## 🎓 進階功能

### Editor 工具（僅在 Unity Editor 中）

```
Tools > Todo List > ...

- Add Sample Data: 添加示例數據
- Clear All Data: 清除所有數據
- Print Statistics: 打印統計信息
- Export Data: 導出數據到 JSON
- Import Data: 從 JSON 導入數據
- Open Persistent Data Path: 打開數據保存位置
```

### 快捷鍵

- `Ctrl+Alt+P` (Windows) / `Cmd+Opt+P` (Mac): 播放/停止場景

### 數據保存位置

```
Windows: C:\Users\<用戶名>\AppData\LocalLow\<公司名>\UnityTodoList\
Mac: ~/Library/Application Support/<公司名>/UnityTodoList/
Linux: ~/.config/unity3d/<公司名>/UnityTodoList/
```

### 自定義設置

1. 創建 Settings ScriptableObject:
   ```
   Assets > Create > Todo List > Settings
   ```

2. 配置各項參數：
   - 自動保存間隔
   - 動畫速度
   - 默認分類
   - 顏色主題
   - 音效開關
   - 等等...

---

## 📚 文檔導航

### 核心文檔

| 文檔 | 內容 | 適合對象 |
|------|------|----------|
| [README.md](README.md) | 完整專案文檔，Unity 特色介紹 | 所有人 |
| **QUICKSTART.md** | **快速開始指南（本文件）** | **新手** |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | 詳細設置步驟，場景配置 | 開發者 |
| [BUILD_GUIDE.md](BUILD_GUIDE.md) | 打包發布指南（所有平台） | 發布者 |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | 專案結構，代碼統計 | 開發者 |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | API 參考，擴展示例 | 進階開發者 |

### 使用場景

#### 我想快速運行看看效果
→ **本文件 (QUICKSTART.md)**

#### 我想了解為什麼用 Unity 做 Todo List
→ [README.md](README.md) 的 "為什麼使用 Unity 開發應用" 章節

#### 我想從零創建這個專案
→ [SETUP_GUIDE.md](SETUP_GUIDE.md)

#### 我想打包發布到手機
→ [BUILD_GUIDE.md](BUILD_GUIDE.md) 的 Android/iOS 章節

#### 我想添加新功能
→ [API_DOCUMENTATION.md](API_DOCUMENTATION.md) 的擴展示例

#### 我想了解專案架構
→ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## 🏗️ 專案結構速覽

```
Assets/Scripts/
├── Data/
│   └── Todo.cs                    # Todo 數據模型
├── Core/
│   └── TodoManager.cs              # 核心管理器（單例）
├── UI/
│   ├── TodoListUI.cs               # 列表 UI
│   ├── TodoItemUI.cs               # 項目 UI
│   ├── TodoInputUI.cs              # 輸入 UI
│   └── ToastNotification.cs        # 通知系統
├── Utils/
│   ├── DataPersistence.cs          # 數據持久化
│   ├── AudioManager.cs             # 音頻管理
│   └── TodoAnimationController.cs  # 動畫控制
├── Events/
│   ├── GameEvent.cs                # 事件系統（SO）
│   ├── GameEventListener.cs        # 事件監聽器
│   └── TodoEvents.cs               # Todo 事件定義
├── ScriptableObjects/
│   └── TodoListSettings.cs         # 應用設置（SO）
└── Editor/
    └── TodoListMenuItems.cs        # Editor 工具
```

---

## 🔧 常見問題

### Q: 為什麼選擇 Unity 而不是傳統前端框架？

**A:** Unity 提供：
- 真正的跨平台支持（包括遊戲主機）
- 強大的可視化編輯器
- 內建動畫系統
- 性能優化工具
- 豐富的資源生態

詳見: [README.md](README.md) 的 "為什麼使用 Unity 開發應用" 章節

### Q: 專案大小會不會太大？

**A:** 是的，Unity 應用相對較大：
- Windows: ~120 MB
- Android: ~60 MB
- WebGL: ~20 MB (壓縮後)

這是使用遊戲引擎的權衡，適合需要跨平台和豐富 UI 的場景。

### Q: 如何減小應用大小？

**A:** 參考 [BUILD_GUIDE.md](BUILD_GUIDE.md) 的優化章節：
- 使用 IL2CPP + Code Stripping
- 移除未使用的資源
- 使用 AssetBundles
- 啟用壓縮

### Q: 可以發布到 App Store / Google Play 嗎？

**A:** 完全可以！詳細步驟請參考：
- iOS: [BUILD_GUIDE.md](BUILD_GUIDE.md) 的 iOS 章節
- Android: [BUILD_GUIDE.md](BUILD_GUIDE.md) 的 Android 章節

### Q: 數據保存在哪裡？

**A:** 取決於設置：
- PlayerPrefs: Unity 管理的位置（跨平台）
- JSON File: `Application.persistentDataPath/todos.json`

使用 `Tools > Todo List > Open Persistent Data Path` 查看。

### Q: 如何添加新功能？

**A:** 參考 [API_DOCUMENTATION.md](API_DOCUMENTATION.md)，例如：
- 添加子任務
- 添加標籤系統
- 添加截止日期
- 添加雲同步
- 等等...

---

## 🎮 Unity 特色功能演示

### 1. 協程動畫系統

```csharp
// Unity 的協程讓動畫變得簡單
IEnumerator FadeIn()
{
    float elapsed = 0f;
    while (elapsed < duration)
    {
        elapsed += Time.deltaTime;
        canvasGroup.alpha = elapsed / duration;
        yield return null;  // 等待下一幀
    }
}
```

### 2. ScriptableObject 配置

```csharp
// 可視化配置，無需修改代碼
[CreateAssetMenu]
public class TodoListSettings : ScriptableObject
{
    public bool autoSave = true;
    public float autoSaveInterval = 30f;
    public Color[] priorityColors;
}
```

### 3. UnityEvent 事件系統

```csharp
// 在 Inspector 中連接事件
public UnityEvent<Todo> OnTodoAdded;

// 觸發事件
OnTodoAdded?.Invoke(newTodo);
```

### 4. 可視化編輯器

- 拖放式 UI 設計
- 實時預覽
- Inspector 面板調整參數
- Profiler 性能分析

---

## 🎯 下一步

### 初學者

1. ✅ 運行專案，體驗功能
2. 📖 閱讀 [README.md](README.md) 了解 Unity 特色
3. 🛠️ 跟隨 [SETUP_GUIDE.md](SETUP_GUIDE.md) 從零創建
4. 🎨 修改 UI 顏色和佈局
5. ➕ 添加簡單功能（如更多優先級）

### 中級開發者

1. 📊 研究專案架構 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
2. 🔧 閱讀 API 文檔 [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. ✨ 實現擴展功能（子任務、標籤等）
4. 📱 打包到移動平台 [BUILD_GUIDE.md](BUILD_GUIDE.md)
5. 🚀 優化性能和體積

### 高級開發者

1. 🏗️ 重構為 UI Toolkit 版本
2. ☁️ 添加雲同步功能
3. 🤖 集成 AI 功能
4. 🎮 添加遊戲化元素
5. 📦 發布到各大應用商店

---

## 📞 獲取幫助

### 問題反饋

- GitHub Issues: [提交 Issue](https://github.com/yourusername/TodoListDemo/issues)
- Discussions: [討論區](https://github.com/yourusername/TodoListDemo/discussions)

### 學習資源

- [Unity Learn](https://learn.unity.com/)
- [Unity 官方文檔](https://docs.unity3d.com/)
- [C# 編程指南](https://docs.microsoft.com/zh-tw/dotnet/csharp/)

### 社群

- [Unity 中文社區](https://unity.cn/)
- [Unity Forums](https://forum.unity.com/)
- [Stack Overflow - Unity](https://stackoverflow.com/questions/tagged/unity3d)

---

## ⭐ 致謝

感謝使用 Unity Todo List！如果這個專案對你有幫助，請考慮：

- ⭐ 給專案一個 Star
- 🐛 報告 Bug 和問題
- 💡 提供改進建議
- 📖 改進文檔
- 🔧 貢獻代碼

---

**享受使用 Unity 構建應用的樂趣！** 🎮✨

---

**最後更新：2025-11-18**
