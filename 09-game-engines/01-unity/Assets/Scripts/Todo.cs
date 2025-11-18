using System;
using UnityEngine;

namespace TodoList.Data
{
    /// <summary>
    /// Todo 項目數據模型
    /// 使用 [Serializable] 使其可以被 Unity 的 JSON 系統序列化
    /// </summary>
    [Serializable]
    public class Todo
    {
        #region 字段

        [SerializeField] private string id;
        [SerializeField] private string text;
        [SerializeField] private bool completed;
        [SerializeField] private long createdAt;
        [SerializeField] private long updatedAt;
        [SerializeField] private int priority; // 0: Low, 1: Medium, 2: High
        [SerializeField] private string category;

        #endregion

        #region 屬性

        /// <summary>
        /// 唯一識別符
        /// </summary>
        public string Id
        {
            get => id;
            set => id = value;
        }

        /// <summary>
        /// Todo 文本內容
        /// </summary>
        public string Text
        {
            get => text;
            set
            {
                text = value;
                UpdateTimestamp();
            }
        }

        /// <summary>
        /// 完成狀態
        /// </summary>
        public bool Completed
        {
            get => completed;
            set
            {
                completed = value;
                UpdateTimestamp();
            }
        }

        /// <summary>
        /// 創建時間戳（Unix 時間）
        /// </summary>
        public long CreatedAt
        {
            get => createdAt;
            set => createdAt = value;
        }

        /// <summary>
        /// 更新時間戳（Unix 時間）
        /// </summary>
        public long UpdatedAt
        {
            get => updatedAt;
            set => updatedAt = value;
        }

        /// <summary>
        /// 優先級（0: 低, 1: 中, 2: 高）
        /// </summary>
        public int Priority
        {
            get => priority;
            set
            {
                priority = Mathf.Clamp(value, 0, 2);
                UpdateTimestamp();
            }
        }

        /// <summary>
        /// 分類標籤
        /// </summary>
        public string Category
        {
            get => category;
            set
            {
                category = value;
                UpdateTimestamp();
            }
        }

        #endregion

        #region 構造函數

        /// <summary>
        /// 默認構造函數（用於反序列化）
        /// </summary>
        public Todo()
        {
            id = Guid.NewGuid().ToString();
            text = string.Empty;
            completed = false;
            createdAt = GetCurrentTimestamp();
            updatedAt = createdAt;
            priority = 1; // 默認中等優先級
            category = "General";
        }

        /// <summary>
        /// 參數構造函數
        /// </summary>
        /// <param name="text">Todo 文本</param>
        /// <param name="priority">優先級</param>
        /// <param name="category">分類</param>
        public Todo(string text, int priority = 1, string category = "General")
        {
            id = Guid.NewGuid().ToString();
            this.text = text;
            completed = false;
            createdAt = GetCurrentTimestamp();
            updatedAt = createdAt;
            this.priority = Mathf.Clamp(priority, 0, 2);
            this.category = category ?? "General";
        }

        #endregion

        #region 公共方法

        /// <summary>
        /// 切換完成狀態
        /// </summary>
        public void ToggleCompleted()
        {
            completed = !completed;
            UpdateTimestamp();
        }

        /// <summary>
        /// 獲取優先級名稱
        /// </summary>
        public string GetPriorityName()
        {
            switch (priority)
            {
                case 0:
                    return "Low";
                case 1:
                    return "Medium";
                case 2:
                    return "High";
                default:
                    return "Unknown";
            }
        }

        /// <summary>
        /// 獲取優先級顏色
        /// </summary>
        public Color GetPriorityColor()
        {
            switch (priority)
            {
                case 0:
                    return new Color(0.5f, 0.8f, 0.5f); // 綠色
                case 1:
                    return new Color(1f, 0.85f, 0.4f); // 黃色
                case 2:
                    return new Color(1f, 0.5f, 0.5f); // 紅色
                default:
                    return Color.white;
            }
        }

        /// <summary>
        /// 獲取創建日期的可讀格式
        /// </summary>
        public string GetFormattedCreatedDate()
        {
            return TimestampToDateTime(createdAt).ToString("yyyy-MM-dd HH:mm");
        }

        /// <summary>
        /// 獲取更新日期的可讀格式
        /// </summary>
        public string GetFormattedUpdatedDate()
        {
            return TimestampToDateTime(updatedAt).ToString("yyyy-MM-dd HH:mm");
        }

        /// <summary>
        /// 複製 Todo 對象
        /// </summary>
        public Todo Clone()
        {
            return new Todo
            {
                id = this.id,
                text = this.text,
                completed = this.completed,
                createdAt = this.createdAt,
                updatedAt = this.updatedAt,
                priority = this.priority,
                category = this.category
            };
        }

        /// <summary>
        /// 驗證 Todo 是否有效
        /// </summary>
        public bool IsValid()
        {
            return !string.IsNullOrWhiteSpace(text) &&
                   !string.IsNullOrWhiteSpace(id) &&
                   priority >= 0 && priority <= 2;
        }

        #endregion

        #region 私有方法

        /// <summary>
        /// 更新時間戳
        /// </summary>
        private void UpdateTimestamp()
        {
            updatedAt = GetCurrentTimestamp();
        }

        /// <summary>
        /// 獲取當前 Unix 時間戳
        /// </summary>
        private long GetCurrentTimestamp()
        {
            return DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        }

        /// <summary>
        /// 將時間戳轉換為 DateTime
        /// </summary>
        private DateTime TimestampToDateTime(long timestamp)
        {
            return DateTimeOffset.FromUnixTimeSeconds(timestamp).LocalDateTime;
        }

        #endregion

        #region 重寫方法

        public override string ToString()
        {
            return $"[{GetPriorityName()}] {text} - {(completed ? "✓" : "○")} ({category})";
        }

        public override bool Equals(object obj)
        {
            if (obj is Todo other)
            {
                return id == other.id;
            }
            return false;
        }

        public override int GetHashCode()
        {
            return id?.GetHashCode() ?? 0;
        }

        #endregion
    }
}
