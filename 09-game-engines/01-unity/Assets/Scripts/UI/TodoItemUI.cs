using UnityEngine;
using UnityEngine.UI;
using TMPro;
using TodoList.Data;
using TodoList.Core;
using System.Collections;

namespace TodoList.UI
{
    /// <summary>
    /// Todo 項目 UI 組件
    /// 代表單個 Todo 項目的視覺表現
    /// </summary>
    public class TodoItemUI : MonoBehaviour
    {
        #region Inspector 字段

        [Header("UI References")]
        [SerializeField] private Toggle completeToggle;
        [SerializeField] private TMP_Text todoText;
        [SerializeField] private Button deleteButton;
        [SerializeField] private Button editButton;
        [SerializeField] private Image backgroundImage;
        [SerializeField] private Image priorityIndicator;
        [SerializeField] private TMP_Text categoryText;
        [SerializeField] private TMP_Text dateText;

        [Header("Edit Mode")]
        [SerializeField] private GameObject viewMode;
        [SerializeField] private GameObject editMode;
        [SerializeField] private TMP_InputField editInputField;
        [SerializeField] private Button saveButton;
        [SerializeField] private Button cancelButton;

        [Header("Visual Settings")]
        [SerializeField] private Color completedColor = new Color(0.7f, 0.7f, 0.7f, 0.5f);
        [SerializeField] private Color activeColor = Color.white;
        [SerializeField] private Color hoverColor = new Color(0.95f, 0.95f, 0.95f);

        [Header("Animation Settings")]
        [SerializeField] private float fadeInDuration = 0.3f;
        [SerializeField] private float fadeOutDuration = 0.2f;
        [SerializeField] private float strikethroughDuration = 0.3f;
        [SerializeField] private AnimationCurve fadeCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);

        #endregion

        #region 私有字段

        private Todo todo;
        private CanvasGroup canvasGroup;
        private RectTransform rectTransform;
        private bool isEditMode = false;

        #endregion

        #region 屬性

        public Todo Todo => todo;
        public string TodoId => todo?.Id;

        #endregion

        #region Unity 生命週期

        private void Awake()
        {
            InitializeComponents();
            SetupEventListeners();
        }

        private void OnDestroy()
        {
            RemoveEventListeners();
        }

        #endregion

        #region 初始化

        private void InitializeComponents()
        {
            canvasGroup = GetComponent<CanvasGroup>();
            if (canvasGroup == null)
            {
                canvasGroup = gameObject.AddComponent<CanvasGroup>();
            }

            rectTransform = GetComponent<RectTransform>();

            // 確保編輯模式初始化為隱藏
            if (editMode != null)
            {
                editMode.SetActive(false);
            }

            if (viewMode != null)
            {
                viewMode.SetActive(true);
            }
        }

        private void SetupEventListeners()
        {
            if (completeToggle != null)
            {
                completeToggle.onValueChanged.AddListener(OnToggleChanged);
            }

            if (deleteButton != null)
            {
                deleteButton.onClick.AddListener(OnDeleteClicked);
            }

            if (editButton != null)
            {
                editButton.onClick.AddListener(OnEditClicked);
            }

            if (saveButton != null)
            {
                saveButton.onClick.AddListener(OnSaveClicked);
            }

            if (cancelButton != null)
            {
                cancelButton.onClick.AddListener(OnCancelClicked);
            }
        }

        private void RemoveEventListeners()
        {
            if (completeToggle != null)
            {
                completeToggle.onValueChanged.RemoveListener(OnToggleChanged);
            }

            if (deleteButton != null)
            {
                deleteButton.onClick.RemoveListener(OnDeleteClicked);
            }

            if (editButton != null)
            {
                editButton.onClick.RemoveListener(OnEditClicked);
            }

            if (saveButton != null)
            {
                saveButton.onClick.RemoveListener(OnSaveClicked);
            }

            if (cancelButton != null)
            {
                cancelButton.onClick.RemoveListener(OnCancelClicked);
            }
        }

        #endregion

        #region 設置數據

        /// <summary>
        /// 設置 Todo 數據並更新 UI
        /// </summary>
        public void SetTodo(Todo todoData, bool animate = true)
        {
            todo = todoData;
            UpdateUI();

            if (animate)
            {
                StartCoroutine(FadeIn());
            }
            else
            {
                canvasGroup.alpha = 1f;
            }
        }

        /// <summary>
        /// 更新 UI 顯示
        /// </summary>
        private void UpdateUI()
        {
            if (todo == null) return;

            // 更新文本
            if (todoText != null)
            {
                todoText.text = todo.Text;
                todoText.fontStyle = todo.Completed ? FontStyles.Strikethrough : FontStyles.Normal;
                todoText.color = todo.Completed ? new Color(0.5f, 0.5f, 0.5f) : Color.black;
            }

            // 更新勾選框
            if (completeToggle != null)
            {
                completeToggle.SetIsOnWithoutNotify(todo.Completed);
            }

            // 更新背景顏色
            if (backgroundImage != null)
            {
                backgroundImage.color = todo.Completed ? completedColor : activeColor;
            }

            // 更新優先級指示器
            if (priorityIndicator != null)
            {
                priorityIndicator.color = todo.GetPriorityColor();
            }

            // 更新分類
            if (categoryText != null)
            {
                categoryText.text = todo.Category;
            }

            // 更新日期
            if (dateText != null)
            {
                dateText.text = todo.GetFormattedCreatedDate();
            }
        }

        #endregion

        #region 事件處理

        private void OnToggleChanged(bool isOn)
        {
            if (todo == null) return;

            TodoManager.Instance.ToggleTodo(todo.Id);
            StartCoroutine(AnimateToggle(isOn));
        }

        private void OnDeleteClicked()
        {
            if (todo == null) return;

            StartCoroutine(AnimateDelete());
        }

        private void OnEditClicked()
        {
            EnterEditMode();
        }

        private void OnSaveClicked()
        {
            SaveEdit();
        }

        private void OnCancelClicked()
        {
            ExitEditMode();
        }

        #endregion

        #region 編輯模式

        private void EnterEditMode()
        {
            if (todo == null || isEditMode) return;

            isEditMode = true;

            if (viewMode != null)
            {
                viewMode.SetActive(false);
            }

            if (editMode != null)
            {
                editMode.SetActive(true);
            }

            if (editInputField != null)
            {
                editInputField.text = todo.Text;
                editInputField.Select();
                editInputField.ActivateInputField();
            }
        }

        private void ExitEditMode()
        {
            isEditMode = false;

            if (viewMode != null)
            {
                viewMode.SetActive(true);
            }

            if (editMode != null)
            {
                editMode.SetActive(false);
            }
        }

        private void SaveEdit()
        {
            if (todo == null || editInputField == null) return;

            string newText = editInputField.text.Trim();

            if (!string.IsNullOrWhiteSpace(newText))
            {
                TodoManager.Instance.UpdateTodo(todo.Id, newText: newText);
                UpdateUI();
            }

            ExitEditMode();
        }

        #endregion

        #region 動畫

        private IEnumerator FadeIn()
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

        private IEnumerator FadeOut()
        {
            float elapsed = 0f;
            float startAlpha = canvasGroup.alpha;

            while (elapsed < fadeOutDuration)
            {
                elapsed += Time.deltaTime;
                float t = fadeCurve.Evaluate(elapsed / fadeOutDuration);
                canvasGroup.alpha = Mathf.Lerp(startAlpha, 0f, t);
                yield return null;
            }

            canvasGroup.alpha = 0f;
        }

        private IEnumerator AnimateToggle(bool completed)
        {
            if (todoText != null)
            {
                float elapsed = 0f;

                while (elapsed < strikethroughDuration)
                {
                    elapsed += Time.deltaTime;
                    float t = elapsed / strikethroughDuration;

                    if (completed)
                    {
                        todoText.color = Color.Lerp(Color.black, new Color(0.5f, 0.5f, 0.5f), t);
                    }
                    else
                    {
                        todoText.color = Color.Lerp(new Color(0.5f, 0.5f, 0.5f), Color.black, t);
                    }

                    yield return null;
                }

                todoText.fontStyle = completed ? FontStyles.Strikethrough : FontStyles.Normal;
            }

            if (backgroundImage != null)
            {
                backgroundImage.color = completed ? completedColor : activeColor;
            }
        }

        private IEnumerator AnimateDelete()
        {
            // 滑出動畫
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

            // 執行刪除
            if (todo != null)
            {
                TodoManager.Instance.RemoveTodo(todo.Id);
            }

            Destroy(gameObject);
        }

        /// <summary>
        /// 高亮動畫（例如搜索結果）
        /// </summary>
        public IEnumerator HighlightAnimation()
        {
            Color originalColor = backgroundImage != null ? backgroundImage.color : Color.white;
            Color highlightColor = Color.yellow;

            float duration = 0.5f;
            float elapsed = 0f;

            // 高亮
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                if (backgroundImage != null)
                {
                    backgroundImage.color = Color.Lerp(originalColor, highlightColor, elapsed / duration);
                }
                yield return null;
            }

            elapsed = 0f;

            // 恢復
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                if (backgroundImage != null)
                {
                    backgroundImage.color = Color.Lerp(highlightColor, originalColor, elapsed / duration);
                }
                yield return null;
            }
        }

        #endregion

        #region 公共方法

        /// <summary>
        /// 刷新 UI（當 Todo 數據被外部修改時調用）
        /// </summary>
        public void Refresh()
        {
            if (todo != null)
            {
                todo = TodoManager.Instance.GetTodo(todo.Id);
                UpdateUI();
            }
        }

        /// <summary>
        /// 執行刪除（帶動畫）
        /// </summary>
        public void Delete()
        {
            StartCoroutine(AnimateDelete());
        }

        #endregion
    }
}
