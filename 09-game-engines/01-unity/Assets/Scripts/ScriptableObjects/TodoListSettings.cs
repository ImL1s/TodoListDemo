using UnityEngine;

namespace TodoList.ScriptableObjects
{
    /// <summary>
    /// Todo List 應用程式設置
    /// 使用 ScriptableObject 實現可配置的設置
    /// </summary>
    [CreateAssetMenu(fileName = "TodoListSettings", menuName = "Todo List/Settings", order = 1)]
    public class TodoListSettings : ScriptableObject
    {
        #region 通用設置

        [Header("General Settings")]
        [Tooltip("應用程式名稱")]
        public string appName = "Unity Todo List";

        [Tooltip("應用程式版本")]
        public string version = "1.0.0";

        [Tooltip("是否啟用調試模式")]
        public bool debugMode = false;

        #endregion

        #region 持久化設置

        [Header("Persistence Settings")]
        [Tooltip("自動保存")]
        public bool autoSave = true;

        [Tooltip("自動保存間隔（秒）")]
        [Range(10f, 300f)]
        public float autoSaveInterval = 30f;

        [Tooltip("存儲類型")]
        public StorageType storageType = StorageType.PlayerPrefs;

        public enum StorageType
        {
            PlayerPrefs,
            JsonFile
        }

        #endregion

        #region UI 設置

        [Header("UI Settings")]
        [Tooltip("默認過濾模式")]
        public FilterMode defaultFilter = FilterMode.All;

        [Tooltip("默認排序方式")]
        public SortMode defaultSort = SortMode.Priority;

        [Tooltip("每頁顯示數量（虛擬滾動）")]
        [Range(10, 100)]
        public int itemsPerPage = 50;

        [Tooltip("啟用動畫效果")]
        public bool enableAnimations = true;

        [Tooltip("動畫持續時間")]
        [Range(0.1f, 2f)]
        public float animationDuration = 0.3f;

        public enum FilterMode
        {
            All,
            Active,
            Completed
        }

        public enum SortMode
        {
            CreatedDate,
            Priority,
            Alphabetical
        }

        #endregion

        #region 輸入設置

        [Header("Input Settings")]
        [Tooltip("最大輸入長度")]
        [Range(50, 1000)]
        public int maxInputLength = 500;

        [Tooltip("最小輸入長度")]
        [Range(1, 10)]
        public int minInputLength = 2;

        [Tooltip("默認分類")]
        public string defaultCategory = "General";

        [Tooltip("預設分類列表")]
        public string[] predefinedCategories = new string[]
        {
            "General",
            "Work",
            "Personal",
            "Shopping",
            "Learning",
            "Health"
        };

        #endregion

        #region 視覺設置

        [Header("Visual Settings")]
        [Tooltip("優先級顏色")]
        public PriorityColors priorityColors = new PriorityColors();

        [Tooltip("主題顏色")]
        public ThemeColors themeColors = new ThemeColors();

        [System.Serializable]
        public class PriorityColors
        {
            public Color lowPriority = new Color(0.5f, 0.8f, 0.5f);      // 綠色
            public Color mediumPriority = new Color(1f, 0.85f, 0.4f);   // 黃色
            public Color highPriority = new Color(1f, 0.5f, 0.5f);      // 紅色
        }

        [System.Serializable]
        public class ThemeColors
        {
            public Color primaryColor = new Color(0.2f, 0.6f, 1f);
            public Color secondaryColor = new Color(0.4f, 0.8f, 0.4f);
            public Color backgroundColor = Color.white;
            public Color textColor = Color.black;
            public Color completedTextColor = new Color(0.5f, 0.5f, 0.5f);
        }

        #endregion

        #region 音效設置

        [Header("Audio Settings")]
        [Tooltip("啟用音效")]
        public bool enableSounds = true;

        [Tooltip("音效音量")]
        [Range(0f, 1f)]
        public float soundVolume = 0.5f;

        [Tooltip("添加音效")]
        public AudioClip addSound;

        [Tooltip("完成音效")]
        public AudioClip completeSound;

        [Tooltip("刪除音效")]
        public AudioClip deleteSound;

        #endregion

        #region 通知設置

        [Header("Notification Settings")]
        [Tooltip("啟用通知")]
        public bool enableNotifications = true;

        [Tooltip("顯示提示")]
        public bool showToasts = true;

        [Tooltip("提示顯示時間")]
        [Range(1f, 10f)]
        public float toastDuration = 3f;

        #endregion

        #region 公共方法

        /// <summary>
        /// 獲取優先級顏色
        /// </summary>
        public Color GetPriorityColor(int priority)
        {
            switch (priority)
            {
                case 0: return priorityColors.lowPriority;
                case 1: return priorityColors.mediumPriority;
                case 2: return priorityColors.highPriority;
                default: return Color.white;
            }
        }

        /// <summary>
        /// 驗證設置
        /// </summary>
        public bool ValidateSettings()
        {
            if (autoSaveInterval < 10f)
            {
                Debug.LogWarning("Auto save interval is too short, minimum is 10 seconds");
                return false;
            }

            if (maxInputLength < minInputLength)
            {
                Debug.LogWarning("Max input length must be greater than min input length");
                return false;
            }

            return true;
        }

        /// <summary>
        /// 重置為默認值
        /// </summary>
        public void ResetToDefaults()
        {
            autoSave = true;
            autoSaveInterval = 30f;
            enableAnimations = true;
            animationDuration = 0.3f;
            maxInputLength = 500;
            minInputLength = 2;
            defaultCategory = "General";
            enableSounds = true;
            soundVolume = 0.5f;
            enableNotifications = true;
            showToasts = true;
            toastDuration = 3f;
        }

        #endregion

        #region Editor 支持

#if UNITY_EDITOR
        private void OnValidate()
        {
            ValidateSettings();
        }
#endif

        #endregion
    }
}
