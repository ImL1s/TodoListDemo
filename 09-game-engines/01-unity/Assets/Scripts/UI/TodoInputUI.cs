using UnityEngine;
using UnityEngine.UI;
using TMPro;
using TodoList.Core;

namespace TodoList.UI
{
    /// <summary>
    /// Todo 輸入 UI 組件
    /// 負責處理用戶輸入和創建新的 Todo
    /// </summary>
    public class TodoInputUI : MonoBehaviour
    {
        #region Inspector 字段

        [Header("UI References")]
        [SerializeField] private TMP_InputField inputField;
        [SerializeField] private Button addButton;
        [SerializeField] private TMP_Dropdown priorityDropdown;
        [SerializeField] private TMP_InputField categoryInput;

        [Header("Settings")]
        [SerializeField] private string defaultCategory = "General";
        [SerializeField] private int maxInputLength = 500;
        [SerializeField] private bool clearOnAdd = true;
        [SerializeField] private bool focusOnAdd = true;

        [Header("Visual Feedback")]
        [SerializeField] private Color normalColor = Color.white;
        [SerializeField] private Color errorColor = Color.red;
        [SerializeField] private float errorShakeDuration = 0.3f;
        [SerializeField] private float errorShakeAmount = 10f;

        [Header("Placeholder")]
        [SerializeField] private string placeholderText = "What needs to be done?";

        #endregion

        #region 私有字段

        private Vector3 originalPosition;
        private Coroutine shakeCoroutine;

        #endregion

        #region Unity 生命週期

        private void Awake()
        {
            ValidateComponents();
            InitializeComponents();
        }

        private void Start()
        {
            originalPosition = inputField.transform.localPosition;
            SetupEventListeners();
            ResetInput();
        }

        private void OnDestroy()
        {
            RemoveEventListeners();
        }

        #endregion

        #region 初始化

        private void ValidateComponents()
        {
            if (inputField == null)
            {
                Debug.LogError("InputField is not assigned!", this);
            }

            if (addButton == null)
            {
                Debug.LogError("AddButton is not assigned!", this);
            }
        }

        private void InitializeComponents()
        {
            // 配置輸入框
            if (inputField != null)
            {
                inputField.characterLimit = maxInputLength;
                inputField.textComponent.fontSize = 18;

                // 設置佔位符
                if (inputField.placeholder is TMP_Text placeholder)
                {
                    placeholder.text = placeholderText;
                    placeholder.color = new Color(0.5f, 0.5f, 0.5f, 0.5f);
                }
            }

            // 配置優先級下拉列表
            if (priorityDropdown != null)
            {
                priorityDropdown.ClearOptions();
                priorityDropdown.AddOptions(new System.Collections.Generic.List<string>
                {
                    "Low Priority",
                    "Medium Priority",
                    "High Priority"
                });
                priorityDropdown.value = 1; // 默認中等優先級
            }

            // 配置分類輸入框
            if (categoryInput != null)
            {
                categoryInput.text = defaultCategory;
            }
        }

        private void SetupEventListeners()
        {
            if (addButton != null)
            {
                addButton.onClick.AddListener(OnAddButtonClicked);
            }

            if (inputField != null)
            {
                inputField.onSubmit.AddListener(OnInputSubmit);
                inputField.onValueChanged.AddListener(OnInputValueChanged);
            }

            if (priorityDropdown != null)
            {
                priorityDropdown.onValueChanged.AddListener(OnPriorityChanged);
            }
        }

        private void RemoveEventListeners()
        {
            if (addButton != null)
            {
                addButton.onClick.RemoveListener(OnAddButtonClicked);
            }

            if (inputField != null)
            {
                inputField.onSubmit.RemoveListener(OnInputSubmit);
                inputField.onValueChanged.RemoveListener(OnInputValueChanged);
            }

            if (priorityDropdown != null)
            {
                priorityDropdown.onValueChanged.RemoveListener(OnPriorityChanged);
            }
        }

        #endregion

        #region 事件處理

        private void OnAddButtonClicked()
        {
            TryAddTodo();
        }

        private void OnInputSubmit(string text)
        {
            TryAddTodo();
        }

        private void OnInputValueChanged(string text)
        {
            // 更新按鈕狀態
            UpdateAddButtonState();

            // 重置顏色
            if (inputField != null)
            {
                inputField.textComponent.color = normalColor;
            }
        }

        private void OnPriorityChanged(int index)
        {
            // 可以添加視覺反饋
            Debug.Log($"Priority changed to: {GetPriorityName(index)}");
        }

        #endregion

        #region 添加 Todo

        private void TryAddTodo()
        {
            if (inputField == null) return;

            string text = inputField.text.Trim();

            // 驗證輸入
            if (string.IsNullOrWhiteSpace(text))
            {
                ShowError("Please enter a todo item");
                return;
            }

            if (text.Length < 2)
            {
                ShowError("Todo must be at least 2 characters");
                return;
            }

            // 獲取優先級和分類
            int priority = priorityDropdown != null ? priorityDropdown.value : 1;
            string category = categoryInput != null && !string.IsNullOrWhiteSpace(categoryInput.text)
                ? categoryInput.text.Trim()
                : defaultCategory;

            // 添加 Todo
            TodoManager.Instance.AddTodo(text, priority, category);

            // 顯示成功反饋
            ShowSuccess();

            // 重置輸入
            if (clearOnAdd)
            {
                ResetInput();
            }

            if (focusOnAdd)
            {
                FocusInput();
            }
        }

        #endregion

        #region UI 狀態

        private void UpdateAddButtonState()
        {
            if (addButton == null || inputField == null) return;

            bool hasText = !string.IsNullOrWhiteSpace(inputField.text);
            addButton.interactable = hasText;

            // 可以添加視覺反饋
            var colors = addButton.colors;
            colors.normalColor = hasText ? new Color(0.3f, 0.7f, 0.3f) : Color.gray;
            addButton.colors = colors;
        }

        private void ResetInput()
        {
            if (inputField != null)
            {
                inputField.text = string.Empty;
            }

            if (priorityDropdown != null)
            {
                priorityDropdown.value = 1; // 中等優先級
            }

            if (categoryInput != null)
            {
                categoryInput.text = defaultCategory;
            }

            UpdateAddButtonState();
        }

        public void FocusInput()
        {
            if (inputField != null)
            {
                inputField.Select();
                inputField.ActivateInputField();
            }
        }

        #endregion

        #region 視覺反饋

        private void ShowError(string message)
        {
            Debug.LogWarning($"Input error: {message}");

            if (inputField != null)
            {
                // 改變顏色
                inputField.textComponent.color = errorColor;

                // 震動效果
                if (shakeCoroutine != null)
                {
                    StopCoroutine(shakeCoroutine);
                }
                shakeCoroutine = StartCoroutine(ShakeAnimation());
            }

            // 可以顯示錯誤提示框
            ShowToast(message, errorColor);
        }

        private void ShowSuccess()
        {
            Debug.Log("Todo added successfully");

            // 可以顯示成功提示
            ShowToast("Todo added!", new Color(0.3f, 0.7f, 0.3f));

            // 可以添加成功動畫
            if (addButton != null)
            {
                StartCoroutine(ButtonPulseAnimation());
            }
        }

        private System.Collections.IEnumerator ShakeAnimation()
        {
            float elapsed = 0f;

            while (elapsed < errorShakeDuration)
            {
                float x = originalPosition.x + Random.Range(-errorShakeAmount, errorShakeAmount);
                inputField.transform.localPosition = new Vector3(x, originalPosition.y, originalPosition.z);

                elapsed += Time.deltaTime;
                yield return null;
            }

            inputField.transform.localPosition = originalPosition;
        }

        private System.Collections.IEnumerator ButtonPulseAnimation()
        {
            Vector3 originalScale = addButton.transform.localScale;
            Vector3 targetScale = originalScale * 1.1f;

            float duration = 0.15f;
            float elapsed = 0f;

            // 放大
            while (elapsed < duration)
            {
                addButton.transform.localScale = Vector3.Lerp(originalScale, targetScale, elapsed / duration);
                elapsed += Time.deltaTime;
                yield return null;
            }

            elapsed = 0f;

            // 縮小
            while (elapsed < duration)
            {
                addButton.transform.localScale = Vector3.Lerp(targetScale, originalScale, elapsed / duration);
                elapsed += Time.deltaTime;
                yield return null;
            }

            addButton.transform.localScale = originalScale;
        }

        private void ShowToast(string message, Color color)
        {
            // 這裡可以實現一個簡單的提示系統
            // 或者使用 Unity UI 的 Toast/Notification 系統
            Debug.Log($"Toast: {message}");
        }

        #endregion

        #region 輔助方法

        private string GetPriorityName(int priority)
        {
            switch (priority)
            {
                case 0: return "Low";
                case 1: return "Medium";
                case 2: return "High";
                default: return "Unknown";
            }
        }

        /// <summary>
        /// 設置佔位符文本
        /// </summary>
        public void SetPlaceholder(string text)
        {
            placeholderText = text;
            if (inputField?.placeholder is TMP_Text placeholder)
            {
                placeholder.text = text;
            }
        }

        /// <summary>
        /// 設置默認分類
        /// </summary>
        public void SetDefaultCategory(string category)
        {
            defaultCategory = category;
            if (categoryInput != null && string.IsNullOrWhiteSpace(categoryInput.text))
            {
                categoryInput.text = category;
            }
        }

        #endregion
    }
}
