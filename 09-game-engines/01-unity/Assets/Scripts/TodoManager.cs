using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.Events;
using TodoList.Data;
using TodoList.Utils;

namespace TodoList.Core
{
    /// <summary>
    /// Todo 管理器 - 使用單例模式
    /// 負責管理所有 Todo 項目的 CRUD 操作和狀態
    /// </summary>
    public class TodoManager : MonoBehaviour
    {
        #region 單例

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

        #endregion

        #region 事件

        /// <summary>
        /// Todo 列表變更事件
        /// </summary>
        [Serializable]
        public class TodoListChangedEvent : UnityEvent<List<Todo>> { }

        /// <summary>
        /// Todo 項目添加事件
        /// </summary>
        [Serializable]
        public class TodoAddedEvent : UnityEvent<Todo> { }

        /// <summary>
        /// Todo 項目更新事件
        /// </summary>
        [Serializable]
        public class TodoUpdatedEvent : UnityEvent<Todo> { }

        /// <summary>
        /// Todo 項目刪除事件
        /// </summary>
        [Serializable]
        public class TodoRemovedEvent : UnityEvent<string> { }

        public TodoListChangedEvent OnTodoListChanged = new TodoListChangedEvent();
        public TodoAddedEvent OnTodoAdded = new TodoAddedEvent();
        public TodoUpdatedEvent OnTodoUpdated = new TodoUpdatedEvent();
        public TodoRemovedEvent OnTodoRemoved = new TodoRemovedEvent();

        #endregion

        #region 字段

        [Header("Settings")]
        [SerializeField] private bool autoSave = true;
        [SerializeField] private float autoSaveInterval = 30f; // 秒

        [Header("Data")]
        [SerializeField] private List<Todo> todos = new List<Todo>();

        private DataPersistence dataPersistence;
        private float autoSaveTimer = 0f;

        #endregion

        #region 屬性

        /// <summary>
        /// 獲取所有 Todo 項目（只讀）
        /// </summary>
        public IReadOnlyList<Todo> Todos => todos.AsReadOnly();

        /// <summary>
        /// 獲取未完成的 Todo 數量
        /// </summary>
        public int ActiveCount => todos.Count(t => !t.Completed);

        /// <summary>
        /// 獲取已完成的 Todo 數量
        /// </summary>
        public int CompletedCount => todos.Count(t => t.Completed);

        /// <summary>
        /// 獲取總 Todo 數量
        /// </summary>
        public int TotalCount => todos.Count;

        #endregion

        #region Unity 生命週期

        private void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(gameObject);
                return;
            }

            instance = this;
            DontDestroyOnLoad(gameObject);

            InitializeManager();
        }

        private void Update()
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

        private void OnApplicationQuit()
        {
            SaveData();
        }

        private void OnApplicationPause(bool pause)
        {
            if (pause)
            {
                SaveData();
            }
        }

        #endregion

        #region 初始化

        private void InitializeManager()
        {
            dataPersistence = new DataPersistence();
            LoadData();

            Debug.Log($"TodoManager initialized with {todos.Count} todos");
        }

        #endregion

        #region CRUD 操作

        /// <summary>
        /// 添加新的 Todo
        /// </summary>
        public Todo AddTodo(string text, int priority = 1, string category = "General")
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                Debug.LogWarning("Cannot add empty todo");
                return null;
            }

            Todo newTodo = new Todo(text, priority, category);
            todos.Add(newTodo);

            OnTodoAdded?.Invoke(newTodo);
            OnTodoListChanged?.Invoke(todos);

            if (autoSave)
            {
                SaveData();
            }

            Debug.Log($"Added todo: {newTodo}");
            return newTodo;
        }

        /// <summary>
        /// 根據 ID 獲取 Todo
        /// </summary>
        public Todo GetTodo(string id)
        {
            return todos.FirstOrDefault(t => t.Id == id);
        }

        /// <summary>
        /// 更新 Todo
        /// </summary>
        public bool UpdateTodo(string id, string newText = null, bool? completed = null,
            int? priority = null, string category = null)
        {
            Todo todo = GetTodo(id);
            if (todo == null)
            {
                Debug.LogWarning($"Todo with id {id} not found");
                return false;
            }

            if (newText != null)
            {
                todo.Text = newText;
            }

            if (completed.HasValue)
            {
                todo.Completed = completed.Value;
            }

            if (priority.HasValue)
            {
                todo.Priority = priority.Value;
            }

            if (category != null)
            {
                todo.Category = category;
            }

            OnTodoUpdated?.Invoke(todo);
            OnTodoListChanged?.Invoke(todos);

            if (autoSave)
            {
                SaveData();
            }

            Debug.Log($"Updated todo: {todo}");
            return true;
        }

        /// <summary>
        /// 切換 Todo 完成狀態
        /// </summary>
        public bool ToggleTodo(string id)
        {
            Todo todo = GetTodo(id);
            if (todo == null)
            {
                return false;
            }

            todo.ToggleCompleted();

            OnTodoUpdated?.Invoke(todo);
            OnTodoListChanged?.Invoke(todos);

            if (autoSave)
            {
                SaveData();
            }

            return true;
        }

        /// <summary>
        /// 刪除 Todo
        /// </summary>
        public bool RemoveTodo(string id)
        {
            Todo todo = GetTodo(id);
            if (todo == null)
            {
                Debug.LogWarning($"Todo with id {id} not found");
                return false;
            }

            todos.Remove(todo);

            OnTodoRemoved?.Invoke(id);
            OnTodoListChanged?.Invoke(todos);

            if (autoSave)
            {
                SaveData();
            }

            Debug.Log($"Removed todo: {todo}");
            return true;
        }

        /// <summary>
        /// 清除所有已完成的 Todo
        /// </summary>
        public int ClearCompleted()
        {
            int count = todos.RemoveAll(t => t.Completed);

            if (count > 0)
            {
                OnTodoListChanged?.Invoke(todos);

                if (autoSave)
                {
                    SaveData();
                }

                Debug.Log($"Cleared {count} completed todos");
            }

            return count;
        }

        /// <summary>
        /// 清除所有 Todo
        /// </summary>
        public void ClearAll()
        {
            int count = todos.Count;
            todos.Clear();

            OnTodoListChanged?.Invoke(todos);

            if (autoSave)
            {
                SaveData();
            }

            Debug.Log($"Cleared all {count} todos");
        }

        #endregion

        #region 查詢和過濾

        /// <summary>
        /// 獲取所有活躍的 Todo
        /// </summary>
        public List<Todo> GetActiveTodos()
        {
            return todos.Where(t => !t.Completed).ToList();
        }

        /// <summary>
        /// 獲取所有已完成的 Todo
        /// </summary>
        public List<Todo> GetCompletedTodos()
        {
            return todos.Where(t => t.Completed).ToList();
        }

        /// <summary>
        /// 根據優先級獲取 Todo
        /// </summary>
        public List<Todo> GetTodosByPriority(int priority)
        {
            return todos.Where(t => t.Priority == priority).ToList();
        }

        /// <summary>
        /// 根據分類獲取 Todo
        /// </summary>
        public List<Todo> GetTodosByCategory(string category)
        {
            return todos.Where(t => t.Category == category).ToList();
        }

        /// <summary>
        /// 搜索 Todo
        /// </summary>
        public List<Todo> SearchTodos(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<Todo>(todos);
            }

            query = query.ToLower();
            return todos.Where(t => t.Text.ToLower().Contains(query)).ToList();
        }

        /// <summary>
        /// 獲取所有分類
        /// </summary>
        public List<string> GetAllCategories()
        {
            return todos.Select(t => t.Category).Distinct().OrderBy(c => c).ToList();
        }

        /// <summary>
        /// 根據創建時間排序
        /// </summary>
        public List<Todo> GetTodosSortedByCreatedDate(bool ascending = true)
        {
            return ascending
                ? todos.OrderBy(t => t.CreatedAt).ToList()
                : todos.OrderByDescending(t => t.CreatedAt).ToList();
        }

        /// <summary>
        /// 根據優先級排序
        /// </summary>
        public List<Todo> GetTodosSortedByPriority(bool descending = true)
        {
            return descending
                ? todos.OrderByDescending(t => t.Priority).ToList()
                : todos.OrderBy(t => t.Priority).ToList();
        }

        #endregion

        #region 數據持久化

        /// <summary>
        /// 保存數據
        /// </summary>
        public void SaveData()
        {
            if (dataPersistence != null)
            {
                dataPersistence.SaveTodos(todos);
                Debug.Log($"Saved {todos.Count} todos to storage");
            }
        }

        /// <summary>
        /// 加載數據
        /// </summary>
        public void LoadData()
        {
            if (dataPersistence != null)
            {
                todos = dataPersistence.LoadTodos();
                OnTodoListChanged?.Invoke(todos);
                Debug.Log($"Loaded {todos.Count} todos from storage");
            }
        }

        /// <summary>
        /// 重置數據（清除並重新加載）
        /// </summary>
        public void ResetData()
        {
            dataPersistence?.ClearData();
            todos.Clear();
            OnTodoListChanged?.Invoke(todos);
            Debug.Log("Data reset complete");
        }

        #endregion

        #region 統計信息

        /// <summary>
        /// 獲取統計信息
        /// </summary>
        public string GetStatistics()
        {
            return $"Total: {TotalCount}, Active: {ActiveCount}, Completed: {CompletedCount}, " +
                   $"Categories: {GetAllCategories().Count}";
        }

        /// <summary>
        /// 獲取完成百分比
        /// </summary>
        public float GetCompletionPercentage()
        {
            if (TotalCount == 0) return 0f;
            return (float)CompletedCount / TotalCount * 100f;
        }

        #endregion
    }
}
