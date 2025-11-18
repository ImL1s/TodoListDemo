using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;
using System.Linq;
using TodoList.Data;
using TodoList.Core;

namespace TodoList.UI
{
    /// <summary>
    /// Todo 列表 UI 組件
    /// 負責管理和顯示所有 Todo 項目
    /// </summary>
    public class TodoListUI : MonoBehaviour
    {
        #region Inspector 字段

        [Header("UI References")]
        [SerializeField] private Transform todoListContainer;
        [SerializeField] private GameObject todoItemPrefab;
        [SerializeField] private ScrollRect scrollRect;

        [Header("Filter UI")]
        [SerializeField] private TMP_Dropdown filterDropdown;
        [SerializeField] private TMP_Dropdown categoryDropdown;
        [SerializeField] private TMP_InputField searchInput;
        [SerializeField] private Button clearCompletedButton;
        [SerializeField] private Button clearAllButton;

        [Header("Statistics UI")]
        [SerializeField] private TMP_Text totalCountText;
        [SerializeField] private TMP_Text activeCountText;
        [SerializeField] private TMP_Text completedCountText;
        [SerializeField] private Image progressBar;

        [Header("Empty State")]
        [SerializeField] private GameObject emptyStatePanel;
        [SerializeField] private TMP_Text emptyStateText;

        [Header("Settings")]
        [SerializeField] private bool autoScroll = true;
        [SerializeField] private float itemSpacing = 10f;
        [SerializeField] private bool animateItems = true;

        #endregion

        #region 私有字段

        private List<TodoItemUI> todoItemUIList = new List<TodoItemUI>();
        private FilterMode currentFilter = FilterMode.All;
        private string currentCategory = "All";
        private string currentSearchQuery = "";

        #endregion

        #region 枚舉

        public enum FilterMode
        {
            All,
            Active,
            Completed
        }

        #endregion

        #region Unity 生命週期

        private void Start()
        {
            InitializeUI();
            SetupEventListeners();
            SubscribeToEvents();
            RefreshList();
        }

        private void OnDestroy()
        {
            UnsubscribeFromEvents();
            RemoveEventListeners();
        }

        #endregion

        #region 初始化

        private void InitializeUI()
        {
            // 配置 ScrollRect
            if (scrollRect != null)
            {
                var verticalLayoutGroup = todoListContainer.GetComponent<VerticalLayoutGroup>();
                if (verticalLayoutGroup != null)
                {
                    verticalLayoutGroup.spacing = itemSpacing;
                    verticalLayoutGroup.childControlHeight = false;
                    verticalLayoutGroup.childForceExpandHeight = false;
                }

                var contentSizeFitter = todoListContainer.GetComponent<ContentSizeFitter>();
                if (contentSizeFitter == null)
                {
                    contentSizeFitter = todoListContainer.gameObject.AddComponent<ContentSizeFitter>();
                }
                contentSizeFitter.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            }

            // 配置過濾器下拉列表
            if (filterDropdown != null)
            {
                filterDropdown.ClearOptions();
                filterDropdown.AddOptions(new List<string> { "All", "Active", "Completed" });
                filterDropdown.value = 0;
            }

            // 初始化分類下拉列表
            UpdateCategoryDropdown();

            // 檢查必要組件
            if (todoItemPrefab == null)
            {
                Debug.LogError("TodoItemPrefab is not assigned!", this);
            }

            if (todoListContainer == null)
            {
                Debug.LogError("TodoListContainer is not assigned!", this);
            }
        }

        private void SetupEventListeners()
        {
            if (filterDropdown != null)
            {
                filterDropdown.onValueChanged.AddListener(OnFilterChanged);
            }

            if (categoryDropdown != null)
            {
                categoryDropdown.onValueChanged.AddListener(OnCategoryChanged);
            }

            if (searchInput != null)
            {
                searchInput.onValueChanged.AddListener(OnSearchChanged);
            }

            if (clearCompletedButton != null)
            {
                clearCompletedButton.onClick.AddListener(OnClearCompletedClicked);
            }

            if (clearAllButton != null)
            {
                clearAllButton.onClick.AddListener(OnClearAllClicked);
            }
        }

        private void RemoveEventListeners()
        {
            if (filterDropdown != null)
            {
                filterDropdown.onValueChanged.RemoveListener(OnFilterChanged);
            }

            if (categoryDropdown != null)
            {
                categoryDropdown.onValueChanged.RemoveListener(OnCategoryChanged);
            }

            if (searchInput != null)
            {
                searchInput.onValueChanged.RemoveListener(OnSearchChanged);
            }

            if (clearCompletedButton != null)
            {
                clearCompletedButton.onClick.RemoveListener(OnClearCompletedClicked);
            }

            if (clearAllButton != null)
            {
                clearAllButton.onClick.RemoveListener(OnClearAllClicked);
            }
        }

        private void SubscribeToEvents()
        {
            if (TodoManager.Instance != null)
            {
                TodoManager.Instance.OnTodoListChanged.AddListener(OnTodoListChanged);
                TodoManager.Instance.OnTodoAdded.AddListener(OnTodoAdded);
                TodoManager.Instance.OnTodoUpdated.AddListener(OnTodoUpdated);
                TodoManager.Instance.OnTodoRemoved.AddListener(OnTodoRemoved);
            }
        }

        private void UnsubscribeFromEvents()
        {
            if (TodoManager.Instance != null)
            {
                TodoManager.Instance.OnTodoListChanged.RemoveListener(OnTodoListChanged);
                TodoManager.Instance.OnTodoAdded.RemoveListener(OnTodoAdded);
                TodoManager.Instance.OnTodoUpdated.RemoveListener(OnTodoUpdated);
                TodoManager.Instance.OnTodoRemoved.RemoveListener(OnTodoRemoved);
            }
        }

        #endregion

        #region 事件處理

        private void OnTodoListChanged(List<Todo> todos)
        {
            RefreshList();
            UpdateStatistics();
            UpdateCategoryDropdown();
        }

        private void OnTodoAdded(Todo todo)
        {
            Debug.Log($"Todo added: {todo.Text}");
            if (autoScroll && scrollRect != null)
            {
                Canvas.ForceUpdateCanvases();
                scrollRect.verticalNormalizedPosition = 0f;
            }
        }

        private void OnTodoUpdated(Todo todo)
        {
            Debug.Log($"Todo updated: {todo.Text}");
            RefreshTodoItem(todo.Id);
        }

        private void OnTodoRemoved(string id)
        {
            Debug.Log($"Todo removed: {id}");
        }

        private void OnFilterChanged(int index)
        {
            currentFilter = (FilterMode)index;
            RefreshList();
        }

        private void OnCategoryChanged(int index)
        {
            if (categoryDropdown == null) return;

            currentCategory = categoryDropdown.options[index].text;
            RefreshList();
        }

        private void OnSearchChanged(string query)
        {
            currentSearchQuery = query;
            RefreshList();
        }

        private void OnClearCompletedClicked()
        {
            if (TodoManager.Instance != null)
            {
                int count = TodoManager.Instance.ClearCompleted();
                Debug.Log($"Cleared {count} completed todos");
            }
        }

        private void OnClearAllClicked()
        {
            // 顯示確認對話框（這裡簡化處理）
            if (TodoManager.Instance != null)
            {
                Debug.Log("Clearing all todos...");
                TodoManager.Instance.ClearAll();
            }
        }

        #endregion

        #region 列表管理

        /// <summary>
        /// 刷新整個列表
        /// </summary>
        public void RefreshList()
        {
            ClearList();

            List<Todo> filteredTodos = GetFilteredTodos();

            if (filteredTodos.Count == 0)
            {
                ShowEmptyState();
            }
            else
            {
                HideEmptyState();

                foreach (Todo todo in filteredTodos)
                {
                    CreateTodoItem(todo);
                }
            }

            UpdateStatistics();
        }

        /// <summary>
        /// 獲取過濾後的 Todo 列表
        /// </summary>
        private List<Todo> GetFilteredTodos()
        {
            if (TodoManager.Instance == null)
            {
                return new List<Todo>();
            }

            List<Todo> todos = new List<Todo>(TodoManager.Instance.Todos);

            // 應用過濾器
            switch (currentFilter)
            {
                case FilterMode.Active:
                    todos = todos.Where(t => !t.Completed).ToList();
                    break;
                case FilterMode.Completed:
                    todos = todos.Where(t => t.Completed).ToList();
                    break;
            }

            // 應用分類過濾
            if (currentCategory != "All")
            {
                todos = todos.Where(t => t.Category == currentCategory).ToList();
            }

            // 應用搜索過濾
            if (!string.IsNullOrWhiteSpace(currentSearchQuery))
            {
                string query = currentSearchQuery.ToLower();
                todos = todos.Where(t => t.Text.ToLower().Contains(query)).ToList();
            }

            // 排序：優先級高的在前，未完成的在前
            todos = todos.OrderByDescending(t => t.Priority)
                         .ThenBy(t => t.Completed)
                         .ThenByDescending(t => t.CreatedAt)
                         .ToList();

            return todos;
        }

        /// <summary>
        /// 創建 Todo 項目 UI
        /// </summary>
        private void CreateTodoItem(Todo todo)
        {
            if (todoItemPrefab == null || todoListContainer == null)
            {
                return;
            }

            GameObject itemObj = Instantiate(todoItemPrefab, todoListContainer);
            TodoItemUI itemUI = itemObj.GetComponent<TodoItemUI>();

            if (itemUI != null)
            {
                itemUI.SetTodo(todo, animateItems);
                todoItemUIList.Add(itemUI);
            }
        }

        /// <summary>
        /// 刷新單個 Todo 項目
        /// </summary>
        private void RefreshTodoItem(string id)
        {
            TodoItemUI itemUI = todoItemUIList.FirstOrDefault(ui => ui.TodoId == id);
            if (itemUI != null)
            {
                itemUI.Refresh();
            }
        }

        /// <summary>
        /// 清空列表
        /// </summary>
        private void ClearList()
        {
            foreach (TodoItemUI itemUI in todoItemUIList)
            {
                if (itemUI != null && itemUI.gameObject != null)
                {
                    Destroy(itemUI.gameObject);
                }
            }

            todoItemUIList.Clear();
        }

        #endregion

        #region 統計信息

        /// <summary>
        /// 更新統計信息
        /// </summary>
        private void UpdateStatistics()
        {
            if (TodoManager.Instance == null) return;

            // 更新計數
            if (totalCountText != null)
            {
                totalCountText.text = $"Total: {TodoManager.Instance.TotalCount}";
            }

            if (activeCountText != null)
            {
                activeCountText.text = $"Active: {TodoManager.Instance.ActiveCount}";
            }

            if (completedCountText != null)
            {
                completedCountText.text = $"Completed: {TodoManager.Instance.CompletedCount}";
            }

            // 更新進度條
            if (progressBar != null)
            {
                float progress = TodoManager.Instance.TotalCount > 0
                    ? (float)TodoManager.Instance.CompletedCount / TodoManager.Instance.TotalCount
                    : 0f;

                progressBar.fillAmount = progress;
            }

            // 更新按鈕狀態
            if (clearCompletedButton != null)
            {
                clearCompletedButton.interactable = TodoManager.Instance.CompletedCount > 0;
            }

            if (clearAllButton != null)
            {
                clearAllButton.interactable = TodoManager.Instance.TotalCount > 0;
            }
        }

        #endregion

        #region 分類管理

        /// <summary>
        /// 更新分類下拉列表
        /// </summary>
        private void UpdateCategoryDropdown()
        {
            if (categoryDropdown == null || TodoManager.Instance == null)
            {
                return;
            }

            List<string> categories = new List<string> { "All" };
            categories.AddRange(TodoManager.Instance.GetAllCategories());

            int currentIndex = categoryDropdown.value;
            string currentValue = currentIndex < categoryDropdown.options.Count
                ? categoryDropdown.options[currentIndex].text
                : "All";

            categoryDropdown.ClearOptions();
            categoryDropdown.AddOptions(categories);

            // 恢復選擇
            int newIndex = categories.IndexOf(currentValue);
            if (newIndex >= 0)
            {
                categoryDropdown.SetValueWithoutNotify(newIndex);
            }
            else
            {
                categoryDropdown.SetValueWithoutNotify(0);
                currentCategory = "All";
            }
        }

        #endregion

        #region 空狀態

        /// <summary>
        /// 顯示空狀態
        /// </summary>
        private void ShowEmptyState()
        {
            if (emptyStatePanel != null)
            {
                emptyStatePanel.SetActive(true);
            }

            if (emptyStateText != null)
            {
                string message = GetEmptyStateMessage();
                emptyStateText.text = message;
            }
        }

        /// <summary>
        /// 隱藏空狀態
        /// </summary>
        private void HideEmptyState()
        {
            if (emptyStatePanel != null)
            {
                emptyStatePanel.SetActive(false);
            }
        }

        /// <summary>
        /// 獲取空狀態提示信息
        /// </summary>
        private string GetEmptyStateMessage()
        {
            if (!string.IsNullOrWhiteSpace(currentSearchQuery))
            {
                return $"No todos found for \"{currentSearchQuery}\"";
            }

            switch (currentFilter)
            {
                case FilterMode.Active:
                    return "No active todos!";
                case FilterMode.Completed:
                    return "No completed todos yet!";
                default:
                    return "No todos yet. Add one to get started!";
            }
        }

        #endregion

        #region 公共方法

        /// <summary>
        /// 設置過濾模式
        /// </summary>
        public void SetFilter(FilterMode mode)
        {
            currentFilter = mode;
            if (filterDropdown != null)
            {
                filterDropdown.SetValueWithoutNotify((int)mode);
            }
            RefreshList();
        }

        /// <summary>
        /// 清除搜索
        /// </summary>
        public void ClearSearch()
        {
            if (searchInput != null)
            {
                searchInput.text = string.Empty;
            }
            currentSearchQuery = string.Empty;
            RefreshList();
        }

        /// <summary>
        /// 滾動到頂部
        /// </summary>
        public void ScrollToTop()
        {
            if (scrollRect != null)
            {
                scrollRect.verticalNormalizedPosition = 1f;
            }
        }

        /// <summary>
        /// 滾動到底部
        /// </summary>
        public void ScrollToBottom()
        {
            if (scrollRect != null)
            {
                scrollRect.verticalNormalizedPosition = 0f;
            }
        }

        #endregion
    }
}
