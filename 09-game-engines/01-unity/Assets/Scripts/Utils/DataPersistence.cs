using System;
using System.Collections.Generic;
using UnityEngine;
using TodoList.Data;

namespace TodoList.Utils
{
    /// <summary>
    /// 數據持久化工具類
    /// 負責保存和加載 Todo 數據
    /// 支持 PlayerPrefs 和 JSON 文件兩種方式
    /// </summary>
    public class DataPersistence
    {
        #region 常量

        private const string SAVE_KEY = "TodoList_Data";
        private const string FILE_NAME = "todos.json";

        #endregion

        #region 配置

        public enum StorageType
        {
            PlayerPrefs,  // 使用 Unity PlayerPrefs（跨平台，但有大小限制）
            JsonFile      // 使用 JSON 文件（更靈活，但需要文件系統訪問）
        }

        private StorageType storageType = StorageType.PlayerPrefs;

        #endregion

        #region 構造函數

        public DataPersistence(StorageType type = StorageType.PlayerPrefs)
        {
            storageType = type;
        }

        #endregion

        #region 保存和加載

        /// <summary>
        /// 保存 Todo 列表
        /// </summary>
        public void SaveTodos(List<Todo> todos)
        {
            try
            {
                TodoListData data = new TodoListData
                {
                    todos = todos,
                    lastSaved = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
                };

                string json = JsonUtility.ToJson(data, true);

                switch (storageType)
                {
                    case StorageType.PlayerPrefs:
                        SaveToPlayerPrefs(json);
                        break;
                    case StorageType.JsonFile:
                        SaveToFile(json);
                        break;
                }

                Debug.Log($"Saved {todos.Count} todos successfully");
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to save todos: {e.Message}");
            }
        }

        /// <summary>
        /// 加載 Todo 列表
        /// </summary>
        public List<Todo> LoadTodos()
        {
            try
            {
                string json = string.Empty;

                switch (storageType)
                {
                    case StorageType.PlayerPrefs:
                        json = LoadFromPlayerPrefs();
                        break;
                    case StorageType.JsonFile:
                        json = LoadFromFile();
                        break;
                }

                if (string.IsNullOrEmpty(json))
                {
                    Debug.Log("No saved data found, returning empty list");
                    return new List<Todo>();
                }

                TodoListData data = JsonUtility.FromJson<TodoListData>(json);

                if (data == null || data.todos == null)
                {
                    Debug.LogWarning("Failed to parse saved data, returning empty list");
                    return new List<Todo>();
                }

                Debug.Log($"Loaded {data.todos.Count} todos successfully");
                return data.todos;
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to load todos: {e.Message}");
                return new List<Todo>();
            }
        }

        /// <summary>
        /// 清除所有保存的數據
        /// </summary>
        public void ClearData()
        {
            try
            {
                switch (storageType)
                {
                    case StorageType.PlayerPrefs:
                        PlayerPrefs.DeleteKey(SAVE_KEY);
                        PlayerPrefs.Save();
                        break;
                    case StorageType.JsonFile:
                        string filePath = GetFilePath();
                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }
                        break;
                }

                Debug.Log("Cleared all saved data");
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to clear data: {e.Message}");
            }
        }

        /// <summary>
        /// 檢查是否存在保存的數據
        /// </summary>
        public bool HasSavedData()
        {
            switch (storageType)
            {
                case StorageType.PlayerPrefs:
                    return PlayerPrefs.HasKey(SAVE_KEY);
                case StorageType.JsonFile:
                    return System.IO.File.Exists(GetFilePath());
                default:
                    return false;
            }
        }

        #endregion

        #region PlayerPrefs 實現

        private void SaveToPlayerPrefs(string json)
        {
            PlayerPrefs.SetString(SAVE_KEY, json);
            PlayerPrefs.Save();
        }

        private string LoadFromPlayerPrefs()
        {
            return PlayerPrefs.GetString(SAVE_KEY, string.Empty);
        }

        #endregion

        #region JSON 文件實現

        private void SaveToFile(string json)
        {
            string filePath = GetFilePath();
            System.IO.File.WriteAllText(filePath, json);
        }

        private string LoadFromFile()
        {
            string filePath = GetFilePath();

            if (System.IO.File.Exists(filePath))
            {
                return System.IO.File.ReadAllText(filePath);
            }

            return string.Empty;
        }

        private string GetFilePath()
        {
            return System.IO.Path.Combine(Application.persistentDataPath, FILE_NAME);
        }

        #endregion

        #region 導出和導入

        /// <summary>
        /// 導出數據到 JSON 字符串
        /// </summary>
        public string ExportToJson(List<Todo> todos)
        {
            TodoListData data = new TodoListData
            {
                todos = todos,
                lastSaved = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            return JsonUtility.ToJson(data, true);
        }

        /// <summary>
        /// 從 JSON 字符串導入數據
        /// </summary>
        public List<Todo> ImportFromJson(string json)
        {
            try
            {
                TodoListData data = JsonUtility.FromJson<TodoListData>(json);
                return data?.todos ?? new List<Todo>();
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to import from JSON: {e.Message}");
                return new List<Todo>();
            }
        }

        /// <summary>
        /// 導出到文件（用於分享）
        /// </summary>
        public bool ExportToFile(List<Todo> todos, string customPath = null)
        {
            try
            {
                string json = ExportToJson(todos);
                string path = customPath ?? System.IO.Path.Combine(
                    Application.persistentDataPath,
                    $"todos_export_{DateTime.Now:yyyyMMdd_HHmmss}.json"
                );

                System.IO.File.WriteAllText(path, json);
                Debug.Log($"Exported to: {path}");
                return true;
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to export: {e.Message}");
                return false;
            }
        }

        /// <summary>
        /// 從文件導入（用於分享）
        /// </summary>
        public List<Todo> ImportFromFile(string filePath)
        {
            try
            {
                if (!System.IO.File.Exists(filePath))
                {
                    Debug.LogError($"File not found: {filePath}");
                    return new List<Todo>();
                }

                string json = System.IO.File.ReadAllText(filePath);
                return ImportFromJson(json);
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to import from file: {e.Message}");
                return new List<Todo>();
            }
        }

        #endregion

        #region 備份和恢復

        /// <summary>
        /// 創建備份
        /// </summary>
        public bool CreateBackup(List<Todo> todos)
        {
            try
            {
                string json = ExportToJson(todos);
                string backupPath = System.IO.Path.Combine(
                    Application.persistentDataPath,
                    $"todos_backup_{DateTime.Now:yyyyMMdd_HHmmss}.json"
                );

                System.IO.File.WriteAllText(backupPath, json);
                Debug.Log($"Backup created: {backupPath}");
                return true;
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to create backup: {e.Message}");
                return false;
            }
        }

        /// <summary>
        /// 獲取所有備份文件
        /// </summary>
        public List<string> GetBackupFiles()
        {
            try
            {
                string directory = Application.persistentDataPath;
                string[] files = System.IO.Directory.GetFiles(directory, "todos_backup_*.json");
                return new List<string>(files);
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to get backup files: {e.Message}");
                return new List<string>();
            }
        }

        #endregion

        #region 數據結構

        /// <summary>
        /// Todo 列表數據容器（用於序列化）
        /// </summary>
        [Serializable]
        private class TodoListData
        {
            public List<Todo> todos = new List<Todo>();
            public long lastSaved;
        }

        #endregion

        #region 工具方法

        /// <summary>
        /// 獲取保存路徑信息
        /// </summary>
        public string GetStorageInfo()
        {
            switch (storageType)
            {
                case StorageType.PlayerPrefs:
                    return $"Storage: PlayerPrefs\nKey: {SAVE_KEY}";
                case StorageType.JsonFile:
                    return $"Storage: JSON File\nPath: {GetFilePath()}";
                default:
                    return "Unknown storage type";
            }
        }

        /// <summary>
        /// 獲取數據大小（估算）
        /// </summary>
        public long GetDataSize()
        {
            try
            {
                switch (storageType)
                {
                    case StorageType.PlayerPrefs:
                        string data = PlayerPrefs.GetString(SAVE_KEY, string.Empty);
                        return data.Length;
                    case StorageType.JsonFile:
                        string filePath = GetFilePath();
                        if (System.IO.File.Exists(filePath))
                        {
                            return new System.IO.FileInfo(filePath).Length;
                        }
                        return 0;
                    default:
                        return 0;
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"Failed to get data size: {e.Message}");
                return 0;
            }
        }

        #endregion
    }
}
