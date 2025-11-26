using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace TodoList.UI
{
    /// <summary>
    /// Toast 通知系統
    /// 顯示臨時提示消息
    /// </summary>
    public class ToastNotification : MonoBehaviour
    {
        #region 單例

        private static ToastNotification instance;

        public static ToastNotification Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = FindObjectOfType<ToastNotification>();
                }
                return instance;
            }
        }

        #endregion

        #region Toast 類型

        public enum ToastType
        {
            Info,
            Success,
            Warning,
            Error
        }

        #endregion

        #region Inspector 字段

        [Header("References")]
        [SerializeField] private GameObject toastPrefab;
        [SerializeField] private Transform toastContainer;

        [Header("Settings")]
        [SerializeField] private float defaultDuration = 3f;
        [SerializeField] private float fadeInDuration = 0.3f;
        [SerializeField] private float fadeOutDuration = 0.3f;
        [SerializeField] private int maxToasts = 5;
        [SerializeField] private float toastSpacing = 10f;

        [Header("Colors")]
        [SerializeField] private Color infoColor = new Color(0.2f, 0.6f, 1f);
        [SerializeField] private Color successColor = new Color(0.3f, 0.7f, 0.3f);
        [SerializeField] private Color warningColor = new Color(1f, 0.7f, 0.2f);
        [SerializeField] private Color errorColor = new Color(1f, 0.3f, 0.3f);

        #endregion

        #region 私有字段

        private Queue<GameObject> activeToasts = new Queue<GameObject>();

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
        }

        #endregion

        #region 顯示 Toast

        /// <summary>
        /// 顯示 Toast 消息
        /// </summary>
        public void Show(string message, ToastType type = ToastType.Info, float duration = -1f)
        {
            if (toastPrefab == null || toastContainer == null)
            {
                Debug.LogWarning("Toast prefab or container not assigned!");
                Debug.Log($"Toast: [{type}] {message}");
                return;
            }

            // 使用默認時長
            if (duration < 0)
            {
                duration = defaultDuration;
            }

            // 創建 Toast
            GameObject toastObj = Instantiate(toastPrefab, toastContainer);
            activeToasts.Enqueue(toastObj);

            // 設置 Toast
            SetupToast(toastObj, message, type);

            // 移除過多的 Toast
            while (activeToasts.Count > maxToasts)
            {
                GameObject oldToast = activeToasts.Dequeue();
                if (oldToast != null)
                {
                    Destroy(oldToast);
                }
            }

            // 啟動顯示協程
            StartCoroutine(ShowToastCoroutine(toastObj, duration));
        }

        /// <summary>
        /// 顯示信息 Toast
        /// </summary>
        public void ShowInfo(string message, float duration = -1f)
        {
            Show(message, ToastType.Info, duration);
        }

        /// <summary>
        /// 顯示成功 Toast
        /// </summary>
        public void ShowSuccess(string message, float duration = -1f)
        {
            Show(message, ToastType.Success, duration);
        }

        /// <summary>
        /// 顯示警告 Toast
        /// </summary>
        public void ShowWarning(string message, float duration = -1f)
        {
            Show(message, ToastType.Warning, duration);
        }

        /// <summary>
        /// 顯示錯誤 Toast
        /// </summary>
        public void ShowError(string message, float duration = -1f)
        {
            Show(message, ToastType.Error, duration);
        }

        #endregion

        #region Toast 設置

        private void SetupToast(GameObject toastObj, string message, ToastType type)
        {
            // 設置文本
            TMP_Text textComponent = toastObj.GetComponentInChildren<TMP_Text>();
            if (textComponent != null)
            {
                textComponent.text = message;
            }

            // 設置顏色
            Image backgroundImage = toastObj.GetComponent<Image>();
            if (backgroundImage != null)
            {
                backgroundImage.color = GetColorForType(type);
            }

            // 設置圖標（如果有）
            Image iconImage = toastObj.transform.Find("Icon")?.GetComponent<Image>();
            if (iconImage != null)
            {
                iconImage.color = Color.white;
            }
        }

        private Color GetColorForType(ToastType type)
        {
            switch (type)
            {
                case ToastType.Info:
                    return infoColor;
                case ToastType.Success:
                    return successColor;
                case ToastType.Warning:
                    return warningColor;
                case ToastType.Error:
                    return errorColor;
                default:
                    return infoColor;
            }
        }

        #endregion

        #region Toast 動畫

        private IEnumerator ShowToastCoroutine(GameObject toastObj, float duration)
        {
            CanvasGroup canvasGroup = toastObj.GetComponent<CanvasGroup>();
            if (canvasGroup == null)
            {
                canvasGroup = toastObj.AddComponent<CanvasGroup>();
            }

            RectTransform rectTransform = toastObj.GetComponent<RectTransform>();

            // 淡入
            yield return StartCoroutine(FadeIn(canvasGroup, rectTransform));

            // 顯示
            yield return new WaitForSeconds(duration);

            // 淡出
            yield return StartCoroutine(FadeOut(canvasGroup, rectTransform));

            // 銷毀
            Destroy(toastObj);
        }

        private IEnumerator FadeIn(CanvasGroup canvasGroup, RectTransform rectTransform)
        {
            canvasGroup.alpha = 0f;
            Vector3 startPos = rectTransform.localPosition;
            Vector3 targetPos = startPos;
            startPos.y += 20f;

            rectTransform.localPosition = startPos;

            float elapsed = 0f;

            while (elapsed < fadeInDuration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / fadeInDuration;

                canvasGroup.alpha = t;
                rectTransform.localPosition = Vector3.Lerp(startPos, targetPos, t);

                yield return null;
            }

            canvasGroup.alpha = 1f;
            rectTransform.localPosition = targetPos;
        }

        private IEnumerator FadeOut(CanvasGroup canvasGroup, RectTransform rectTransform)
        {
            float startAlpha = canvasGroup.alpha;
            Vector3 startPos = rectTransform.localPosition;
            Vector3 targetPos = startPos;
            targetPos.y += 20f;

            float elapsed = 0f;

            while (elapsed < fadeOutDuration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / fadeOutDuration;

                canvasGroup.alpha = Mathf.Lerp(startAlpha, 0f, t);
                rectTransform.localPosition = Vector3.Lerp(startPos, targetPos, t);

                yield return null;
            }

            canvasGroup.alpha = 0f;
        }

        #endregion

        #region 清除 Toast

        /// <summary>
        /// 清除所有 Toast
        /// </summary>
        public void ClearAllToasts()
        {
            while (activeToasts.Count > 0)
            {
                GameObject toast = activeToasts.Dequeue();
                if (toast != null)
                {
                    Destroy(toast);
                }
            }
        }

        #endregion
    }
}
