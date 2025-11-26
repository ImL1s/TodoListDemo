# Unity Todo List - API 文檔

本文檔詳細說明 Unity Todo List 專案的 API 和擴展方法。

## 目錄

- [核心 API](#核心-api)
- [數據模型](#數據模型)
- [管理器](#管理器)
- [UI 組件](#ui-組件)
- [事件系統](#事件系統)
- [工具類](#工具類)
- [擴展示例](#擴展示例)

---

## 核心 API

### 命名空間結構

```csharp
TodoList.Data           // 數據模型
TodoList.Core           // 核心業務邏輯
TodoList.UI             // UI 組件
TodoList.Utils          // 工具類
TodoList.Events         // 事件系統
TodoList.ScriptableObjects  // SO 配置
TodoList.Editor         // Editor 工具
```

---

## 數據模型

### Todo 類

**命名空間:** `TodoList.Data`

#### 屬性

```csharp
public class Todo
{
    // 唯一標識符
    public string Id { get; set; }

    // Todo 文本內容
    public string Text { get; set; }

    // 完成狀態
    public bool Completed { get; set; }

    // 創建時間戳（Unix 時間）
    public long CreatedAt { get; set; }

    // 更新時間戳（Unix 時間）
    public long UpdatedAt { get; set; }

    // 優先級（0: 低, 1: 中, 2: 高）
    public int Priority { get; set; }

    // 分類標籤
    public string Category { get; set; }
}
```

#### 構造函數

```csharp
// 默認構造函數
public Todo()

// 參數構造函數
public Todo(string text, int priority = 1, string category = "General")
```

#### 公共方法

```csharp
// 切換完成狀態
public void ToggleCompleted()

// 獲取優先級名稱
public string GetPriorityName()
// 返回: "Low", "Medium", "High"

// 獲取優先級顏色
public Color GetPriorityColor()
// 返回: 根據優先級返回對應顏色

// 獲取格式化的創建日期
public string GetFormattedCreatedDate()
// 返回: "yyyy-MM-dd HH:mm" 格式

// 獲取格式化的更新日期
public string GetFormattedUpdatedDate()

// 複製 Todo 對象
public Todo Clone()

// 驗證 Todo 是否有效
public bool IsValid()
```

#### 使用示例

```csharp
using TodoList.Data;

// 創建新 Todo
Todo todo = new Todo("學習 Unity", 2, "Learning");

// 修改屬性
todo.Text = "深入學習 Unity";
todo.Priority = 1;

// 切換狀態
todo.ToggleCompleted();

// 獲取信息
string priorityName = todo.GetPriorityName();
Color color = todo.GetPriorityColor();
string date = todo.GetFormattedCreatedDate();

// 驗證
if (todo.IsValid())
{
    // Todo 有效
}
```

---

## 管理器

### TodoManager 類

**命名空間:** `TodoList.Core`

**模式:** 單例 (Singleton)

#### 訪問實例

```csharp
TodoManager.Instance
```

#### 屬性

```csharp
// 所有 Todo 項目（只讀）
public IReadOnlyList<Todo> Todos { get; }

// 未完成的 Todo 數量
public int ActiveCount { get; }

// 已完成的 Todo 數量
public int CompletedCount { get; }

// 總 Todo 數量
public int TotalCount { get; }
```

#### CRUD 操作

```csharp
// 添加新的 Todo
public Todo AddTodo(string text, int priority = 1, string category = "General")

// 根據 ID 獲取 Todo
public Todo GetTodo(string id)

// 更新 Todo
public bool UpdateTodo(
    string id,
    string newText = null,
    bool? completed = null,
    int? priority = null,
    string category = null
)

// 切換 Todo 完成狀態
public bool ToggleTodo(string id)

// 刪除 Todo
public bool RemoveTodo(string id)

// 清除所有已完成的 Todo
public int ClearCompleted()

// 清除所有 Todo
public void ClearAll()
```

#### 查詢和過濾

```csharp
// 獲取所有活躍的 Todo
public List<Todo> GetActiveTodos()

// 獲取所有已完成的 Todo
public List<Todo> GetCompletedTodos()

// 根據優先級獲取 Todo
public List<Todo> GetTodosByPriority(int priority)

// 根據分類獲取 Todo
public List<Todo> GetTodosByCategory(string category)

// 搜索 Todo
public List<Todo> SearchTodos(string query)

// 獲取所有分類
public List<string> GetAllCategories()

// 根據創建時間排序
public List<Todo> GetTodosSortedByCreatedDate(bool ascending = true)

// 根據優先級排序
public List<Todo> GetTodosSortedByPriority(bool descending = true)
```

#### 數據持久化

```csharp
// 保存數據
public void SaveData()

// 加載數據
public void LoadData()

// 重置數據
public void ResetData()
```

#### 統計信息

```csharp
// 獲取統計信息
public string GetStatistics()

// 獲取完成百分比
public float GetCompletionPercentage()
```

#### 事件

```csharp
// Todo 列表變更事件
public TodoListChangedEvent OnTodoListChanged

// Todo 項目添加事件
public TodoAddedEvent OnTodoAdded

// Todo 項目更新事件
public TodoUpdatedEvent OnTodoUpdated

// Todo 項目刪除事件
public TodoRemovedEvent OnTodoRemoved
```

#### 使用示例

```csharp
using TodoList.Core;
using TodoList.Data;

// 獲取管理器實例
var manager = TodoManager.Instance;

// 添加 Todo
Todo newTodo = manager.AddTodo("完成專案", 2, "Work");

// 更新 Todo
manager.UpdateTodo(
    newTodo.Id,
    newText: "完成 Unity 專案",
    priority: 1
);

// 切換狀態
manager.ToggleTodo(newTodo.Id);

// 查詢
List<Todo> workTodos = manager.GetTodosByCategory("Work");
List<Todo> highPriority = manager.GetTodosByPriority(2);

// 搜索
List<Todo> searchResults = manager.SearchTodos("Unity");

// 刪除
manager.RemoveTodo(newTodo.Id);

// 統計
int total = manager.TotalCount;
int active = manager.ActiveCount;
float completion = manager.GetCompletionPercentage();

// 訂閱事件
manager.OnTodoAdded.AddListener(OnTodoAdded);
manager.OnTodoUpdated.AddListener(OnTodoUpdated);

void OnTodoAdded(Todo todo)
{
    Debug.Log($"Added: {todo.Text}");
}

void OnTodoUpdated(Todo todo)
{
    Debug.Log($"Updated: {todo.Text}");
}
```

---

## UI 組件

### TodoListUI 類

**命名空間:** `TodoList.UI`

**用途:** 管理 Todo 列表的顯示和過濾

#### 公共方法

```csharp
// 刷新整個列表
public void RefreshList()

// 設置過濾模式
public void SetFilter(FilterMode mode)

// 清除搜索
public void ClearSearch()

// 滾動到頂部
public void ScrollToTop()

// 滾動到底部
public void ScrollToBottom()
```

#### FilterMode 枚舉

```csharp
public enum FilterMode
{
    All,        // 顯示所有
    Active,     // 僅顯示未完成
    Completed   // 僅顯示已完成
}
```

#### 使用示例

```csharp
using TodoList.UI;

// 獲取 UI 組件
TodoListUI listUI = GetComponent<TodoListUI>();

// 設置過濾器
listUI.SetFilter(TodoListUI.FilterMode.Active);

// 刷新列表
listUI.RefreshList();

// 清除搜索
listUI.ClearSearch();

// 滾動控制
listUI.ScrollToTop();
listUI.ScrollToBottom();
```

### TodoItemUI 類

**命名空間:** `TodoList.UI`

**用途:** 單個 Todo 項目的 UI 表示

#### 公共方法

```csharp
// 設置 Todo 數據
public void SetTodo(Todo todoData, bool animate = true)

// 刷新 UI
public void Refresh()

// 刪除（帶動畫）
public void Delete()

// 高亮動畫
public IEnumerator HighlightAnimation()
```

#### 使用示例

```csharp
using TodoList.UI;
using TodoList.Data;

// 創建 Todo Item
GameObject itemObj = Instantiate(todoItemPrefab, container);
TodoItemUI itemUI = itemObj.GetComponent<TodoItemUI>();

// 設置數據
Todo todo = new Todo("示例任務");
itemUI.SetTodo(todo, animate: true);

// 刷新
itemUI.Refresh();

// 高亮
StartCoroutine(itemUI.HighlightAnimation());

// 刪除
itemUI.Delete();
```

### TodoInputUI 類

**命名空間:** `TodoList.UI`

**用途:** 處理用戶輸入

#### 公共方法

```csharp
// 聚焦輸入框
public void FocusInput()

// 設置佔位符
public void SetPlaceholder(string text)

// 設置默認分類
public void SetDefaultCategory(string category)
```

### ToastNotification 類

**命名空間:** `TodoList.UI`

**模式:** 單例

#### 公共方法

```csharp
// 顯示通知
public void Show(string message, ToastType type = ToastType.Info, float duration = -1f)

// 顯示信息通知
public void ShowInfo(string message, float duration = -1f)

// 顯示成功通知
public void ShowSuccess(string message, float duration = -1f)

// 顯示警告通知
public void ShowWarning(string message, float duration = -1f)

// 顯示錯誤通知
public void ShowError(string message, float duration = -1f)

// 清除所有通知
public void ClearAllToasts()
```

#### ToastType 枚舉

```csharp
public enum ToastType
{
    Info,
    Success,
    Warning,
    Error
}
```

#### 使用示例

```csharp
using TodoList.UI;

// 顯示通知
ToastNotification.Instance.ShowSuccess("Todo 已添加！");
ToastNotification.Instance.ShowError("添加失敗！");
ToastNotification.Instance.ShowInfo("這是一個提示", 5f);

// 清除所有
ToastNotification.Instance.ClearAllToasts();
```

---

## 事件系統

### GameEvent (ScriptableObject)

**命名空間:** `TodoList.Events`

#### 使用方法

```csharp
// 1. 創建 ScriptableObject
// Assets/Create/Todo List/Events/Game Event

// 2. 觸發事件
[SerializeField] private GameEvent onSomeEvent;

public void TriggerEvent()
{
    onSomeEvent.Raise();
}

// 3. 監聽事件（通過 GameEventListener 組件）
```

### 泛型事件

```csharp
// TodoStringEvent - 傳遞字符串
TodoStringEvent stringEvent;
stringEvent.Raise("some string");

// TodoIntEvent - 傳遞整數
TodoIntEvent intEvent;
intEvent.Raise(42);

// TodoObjectEvent - 傳遞 Todo 對象
TodoObjectEvent objectEvent;
objectEvent.Raise(todo);

// TodoBoolEvent - 傳遞布爾值
TodoBoolEvent boolEvent;
boolEvent.Raise(true);
```

### 使用示例

```csharp
using TodoList.Events;
using TodoList.Data;

public class ExampleComponent : MonoBehaviour
{
    [SerializeField] private TodoObjectEvent onTodoSelected;
    [SerializeField] private TodoStringEvent onCategoryChanged;

    public void SelectTodo(Todo todo)
    {
        onTodoSelected.Raise(todo);
    }

    public void ChangeCategory(string category)
    {
        onCategoryChanged.Raise(category);
    }
}
```

---

## 工具類

### DataPersistence 類

**命名空間:** `TodoList.Utils`

#### 構造函數

```csharp
public DataPersistence(StorageType type = StorageType.PlayerPrefs)
```

#### 枚舉

```csharp
public enum StorageType
{
    PlayerPrefs,  // Unity PlayerPrefs
    JsonFile      // JSON 文件
}
```

#### 公共方法

```csharp
// 保存 Todo 列表
public void SaveTodos(List<Todo> todos)

// 加載 Todo 列表
public List<Todo> LoadTodos()

// 清除數據
public void ClearData()

// 檢查是否有保存的數據
public bool HasSavedData()

// 導出到 JSON
public string ExportToJson(List<Todo> todos)

// 從 JSON 導入
public List<Todo> ImportFromJson(string json)

// 導出到文件
public bool ExportToFile(List<Todo> todos, string customPath = null)

// 從文件導入
public List<Todo> ImportFromFile(string filePath)

// 創建備份
public bool CreateBackup(List<Todo> todos)

// 獲取備份文件列表
public List<string> GetBackupFiles()

// 獲取存儲信息
public string GetStorageInfo()

// 獲取數據大小
public long GetDataSize()
```

#### 使用示例

```csharp
using TodoList.Utils;
using TodoList.Data;
using System.Collections.Generic;

// 創建持久化管理器
var persistence = new DataPersistence(StorageType.JsonFile);

// 保存數據
List<Todo> todos = TodoManager.Instance.Todos.ToList();
persistence.SaveTodos(todos);

// 加載數據
List<Todo> loadedTodos = persistence.LoadTodos();

// 導出
string json = persistence.ExportToJson(todos);
persistence.ExportToFile(todos, "/path/to/export.json");

// 導入
List<Todo> imported = persistence.ImportFromFile("/path/to/import.json");

// 備份
persistence.CreateBackup(todos);
List<string> backups = persistence.GetBackupFiles();

// 信息
string info = persistence.GetStorageInfo();
long size = persistence.GetDataSize();
```

### TodoAnimationController 類

**命名空間:** `TodoList.Utils`

#### 動畫方法

```csharp
// Fade 動畫
public IEnumerator FadeIn(CanvasGroup canvasGroup, float duration = -1f, AnimationCurve curve = null)
public IEnumerator FadeOut(CanvasGroup canvasGroup, float duration = -1f, AnimationCurve curve = null)

// Slide 動畫
public IEnumerator SlideIn(RectTransform rectTransform, Direction direction, float distance = 500f, float duration = -1f, AnimationCurve curve = null)
public IEnumerator SlideOut(RectTransform rectTransform, Direction direction, float distance = 500f, float duration = -1f, AnimationCurve curve = null)

// Scale 動畫
public IEnumerator ScaleIn(Transform transform, float duration = -1f, AnimationCurve curve = null)
public IEnumerator ScaleOut(Transform transform, float duration = -1f, AnimationCurve curve = null)

// 彈跳動畫
public IEnumerator Bounce(Transform transform, float bounceHeight = 20f, int bounceCount = 2, float duration = -1f)

// 震動動畫
public IEnumerator Shake(Transform transform, float shakeAmount = 10f, float duration = -1f)

// 脈衝動畫
public IEnumerator Pulse(Transform transform, float pulseScale = 1.2f, int pulseCount = 1, float duration = -1f)

// 顏色動畫
public IEnumerator ColorTransition(Graphic graphic, Color targetColor, float duration = -1f, AnimationCurve curve = null)
public IEnumerator Blink(Graphic graphic, Color blinkColor, int blinkCount = 3, float duration = -1f)

// 組合動畫
public IEnumerator AnimationSequence(params IEnumerator[] animations)
public IEnumerator AnimationParallel(params IEnumerator[] animations)
```

#### 使用示例

```csharp
using TodoList.Utils;
using UnityEngine;

public class AnimationExample : MonoBehaviour
{
    private TodoAnimationController animator;
    private CanvasGroup canvasGroup;
    private RectTransform rectTransform;

    void Start()
    {
        animator = GetComponent<TodoAnimationController>();
        canvasGroup = GetComponent<CanvasGroup>();
        rectTransform = GetComponent<RectTransform>();
    }

    public void PlayFadeIn()
    {
        StartCoroutine(animator.FadeIn(canvasGroup, 0.5f));
    }

    public void PlaySlideIn()
    {
        StartCoroutine(animator.SlideIn(
            rectTransform,
            TodoAnimationController.Direction.Left,
            500f,
            0.3f
        ));
    }

    public void PlayBounce()
    {
        StartCoroutine(animator.Bounce(transform, 30f, 3));
    }

    public void PlaySequence()
    {
        StartCoroutine(animator.AnimationSequence(
            animator.FadeIn(canvasGroup),
            animator.ScaleIn(transform),
            animator.Bounce(transform)
        ));
    }
}
```

### AudioManager 類

**命名空間:** `TodoList.Utils`

**模式:** 單例

#### 公共方法

```csharp
// 播放音效
public void PlayAddSound()
public void PlayDeleteSound()
public void PlayCompleteSound()
public void PlayUncompleteSound()
public void PlayClickSound()
public void PlayErrorSound()
public void PlaySuccessSound()
public void PlayCustomSound(AudioClip clip, float volumeScale = 1f)

// 音量控制
public void SetMasterVolume(float volume)
public void SetSFXVolume(float volume)
public void ToggleSounds()
public void SetSoundsEnabled(bool enabled)
```

#### 屬性

```csharp
public bool SoundsEnabled { get; set; }
public float MasterVolume { get; set; }
public float SFXVolume { get; set; }
```

#### 使用示例

```csharp
using TodoList.Utils;

// 播放音效
AudioManager.Instance.PlayAddSound();
AudioManager.Instance.PlayCompleteSound();
AudioManager.Instance.PlayErrorSound();

// 音量控制
AudioManager.Instance.SetMasterVolume(0.8f);
AudioManager.Instance.SetSFXVolume(0.5f);

// 切換音效
AudioManager.Instance.ToggleSounds();

// 播放自定義音效
AudioClip customClip = Resources.Load<AudioClip>("CustomSound");
AudioManager.Instance.PlayCustomSound(customClip, 0.7f);
```

---

## ScriptableObjects

### TodoListSettings

**命名空間:** `TodoList.ScriptableObjects`

**創建:** Assets/Create/Todo List/Settings

#### 配置項

```csharp
// 通用設置
public string appName
public string version
public bool debugMode

// 持久化設置
public bool autoSave
public float autoSaveInterval
public StorageType storageType

// UI 設置
public FilterMode defaultFilter
public SortMode defaultSort
public int itemsPerPage
public bool enableAnimations
public float animationDuration

// 輸入設置
public int maxInputLength
public int minInputLength
public string defaultCategory
public string[] predefinedCategories

// 視覺設置
public PriorityColors priorityColors
public ThemeColors themeColors

// 音效設置
public bool enableSounds
public float soundVolume
public AudioClip addSound
public AudioClip completeSound
public AudioClip deleteSound

// 通知設置
public bool enableNotifications
public bool showToasts
public float toastDuration
```

#### 使用示例

```csharp
using TodoList.ScriptableObjects;
using UnityEngine;

public class SettingsExample : MonoBehaviour
{
    [SerializeField] private TodoListSettings settings;

    void Start()
    {
        // 讀取設置
        bool autoSave = settings.autoSave;
        float interval = settings.autoSaveInterval;
        string[] categories = settings.predefinedCategories;

        // 獲取顏色
        Color lowPriorityColor = settings.GetPriorityColor(0);
        Color highPriorityColor = settings.GetPriorityColor(2);

        // 驗證設置
        if (settings.ValidateSettings())
        {
            // 設置有效
        }

        // 重置為默認值
        settings.ResetToDefaults();
    }
}
```

---

## 擴展示例

### 1. 添加新功能：子任務支持

```csharp
using TodoList.Data;
using System.Collections.Generic;

[System.Serializable]
public class TodoWithSubtasks : Todo
{
    [SerializeField] private List<Todo> subtasks = new List<Todo>();

    public List<Todo> Subtasks => subtasks;

    public void AddSubtask(string text)
    {
        var subtask = new Todo(text);
        subtasks.Add(subtask);
    }

    public void RemoveSubtask(string id)
    {
        subtasks.RemoveAll(t => t.Id == id);
    }

    public int GetCompletedSubtaskCount()
    {
        return subtasks.Count(t => t.Completed);
    }

    public float GetSubtaskProgress()
    {
        if (subtasks.Count == 0) return 0f;
        return (float)GetCompletedSubtaskCount() / subtasks.Count;
    }
}
```

### 2. 添加標籤系統

```csharp
using TodoList.Data;
using System.Collections.Generic;

public class TodoWithTags : Todo
{
    [SerializeField] private List<string> tags = new List<string>();

    public List<string> Tags => tags;

    public void AddTag(string tag)
    {
        if (!tags.Contains(tag))
        {
            tags.Add(tag);
        }
    }

    public void RemoveTag(string tag)
    {
        tags.Remove(tag);
    }

    public bool HasTag(string tag)
    {
        return tags.Contains(tag);
    }
}

// 在 TodoManager 中添加查詢方法
public List<Todo> GetTodosByTag(string tag)
{
    return todos
        .Where(t => t is TodoWithTags twt && twt.HasTag(tag))
        .ToList();
}
```

### 3. 添加截止日期功能

```csharp
using System;
using TodoList.Data;

public class TodoWithDeadline : Todo
{
    [SerializeField] private long deadline; // Unix 時間戳

    public long Deadline
    {
        get => deadline;
        set => deadline = value;
    }

    public DateTime GetDeadlineDate()
    {
        return DateTimeOffset.FromUnixTimeSeconds(deadline).LocalDateTime;
    }

    public bool IsOverdue()
    {
        return deadline > 0 && DateTimeOffset.UtcNow.ToUnixTimeSeconds() > deadline;
    }

    public TimeSpan GetTimeRemaining()
    {
        if (deadline == 0) return TimeSpan.Zero;

        var deadlineDate = DateTimeOffset.FromUnixTimeSeconds(deadline);
        return deadlineDate - DateTimeOffset.UtcNow;
    }
}
```

### 4. 創建自定義事件監聽器

```csharp
using UnityEngine;
using TodoList.Events;
using TodoList.Data;

public class TodoStatsUpdater : MonoBehaviour
{
    [SerializeField] private TodoObjectEvent onTodoAdded;
    [SerializeField] private TodoObjectEvent onTodoCompleted;

    private int totalAdded = 0;
    private int totalCompleted = 0;

    void OnEnable()
    {
        if (onTodoAdded != null)
            onTodoAdded.RegisterListener(this);

        if (onTodoCompleted != null)
            onTodoCompleted.RegisterListener(this);
    }

    void OnDisable()
    {
        if (onTodoAdded != null)
            onTodoAdded.UnregisterListener(this);

        if (onTodoCompleted != null)
            onTodoCompleted.UnregisterListener(this);
    }

    public void OnTodoAdded(Todo todo)
    {
        totalAdded++;
        Debug.Log($"Total todos added: {totalAdded}");
    }

    public void OnTodoCompleted(Todo todo)
    {
        totalCompleted++;
        Debug.Log($"Total todos completed: {totalCompleted}");
    }
}
```

### 5. 添加數據同步功能

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using TodoList.Data;
using TodoList.Core;

public class CloudSync : MonoBehaviour
{
    [SerializeField] private string apiUrl = "https://api.example.com/todos";

    public IEnumerator SyncToCloud()
    {
        var todos = TodoManager.Instance.Todos.ToList();
        string json = JsonUtility.ToJson(new TodoListWrapper { todos = todos });

        using (UnityWebRequest request = UnityWebRequest.Put(apiUrl, json))
        {
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log("Synced to cloud successfully");
            }
            else
            {
                Debug.LogError($"Sync failed: {request.error}");
            }
        }
    }

    public IEnumerator SyncFromCloud()
    {
        using (UnityWebRequest request = UnityWebRequest.Get(apiUrl))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                var wrapper = JsonUtility.FromJson<TodoListWrapper>(request.downloadHandler.text);
                // 合併或替換本地數據
                Debug.Log($"Synced {wrapper.todos.Count} todos from cloud");
            }
        }
    }

    [System.Serializable]
    private class TodoListWrapper
    {
        public List<Todo> todos;
    }
}
```

---

## 最佳實踐

### 1. 使用事件而非直接調用

❌ **不好的做法:**
```csharp
TodoListUI.Instance.RefreshList();
TodoInputUI.Instance.ClearInput();
```

✅ **好的做法:**
```csharp
// 使用事件通知
TodoManager.Instance.OnTodoListChanged.Invoke(todos);
```

### 2. 緩存組件引用

❌ **不好的做法:**
```csharp
void Update()
{
    GetComponent<CanvasGroup>().alpha = 0.5f;
}
```

✅ **好的做法:**
```csharp
private CanvasGroup canvasGroup;

void Awake()
{
    canvasGroup = GetComponent<CanvasGroup>();
}

void Update()
{
    canvasGroup.alpha = 0.5f;
}
```

### 3. 使用協程處理動畫

✅ **推薦做法:**
```csharp
IEnumerator AnimateFade()
{
    float elapsed = 0f;
    while (elapsed < duration)
    {
        elapsed += Time.deltaTime;
        // 動畫邏輯
        yield return null;
    }
}
```

### 4. 正確訂閱和取消訂閱事件

✅ **推薦做法:**
```csharp
void OnEnable()
{
    TodoManager.Instance.OnTodoAdded.AddListener(HandleTodoAdded);
}

void OnDisable()
{
    TodoManager.Instance.OnTodoAdded.RemoveListener(HandleTodoAdded);
}
```

---

## 參考資源

- [Unity Scripting Reference](https://docs.unity3d.com/ScriptReference/)
- [C# Programming Guide](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/)
- [Unity Best Practices](https://unity.com/how-to/programming-unity)

---

**最後更新：2025-11-18**
