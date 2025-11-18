using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace TodoList.Utils
{
    /// <summary>
    /// Todo 動畫控制器
    /// 提供可重用的動畫效果
    /// </summary>
    public class TodoAnimationController : MonoBehaviour
    {
        #region 動畫類型

        public enum AnimationType
        {
            FadeIn,
            FadeOut,
            SlideIn,
            SlideOut,
            ScaleIn,
            ScaleOut,
            Bounce,
            Shake,
            Pulse
        }

        public enum Direction
        {
            Left,
            Right,
            Up,
            Down
        }

        #endregion

        #region 設置

        [Header("Animation Settings")]
        [SerializeField] private float defaultDuration = 0.3f;
        [SerializeField] private AnimationCurve defaultCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);

        #endregion

        #region Fade 動畫

        /// <summary>
        /// 淡入動畫
        /// </summary>
        public IEnumerator FadeIn(CanvasGroup canvasGroup, float duration = -1f, AnimationCurve curve = null)
        {
            if (canvasGroup == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;
            curve = curve ?? defaultCurve;

            float elapsed = 0f;
            canvasGroup.alpha = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = curve.Evaluate(elapsed / duration);
                canvasGroup.alpha = t;
                yield return null;
            }

            canvasGroup.alpha = 1f;
        }

        /// <summary>
        /// 淡出動畫
        /// </summary>
        public IEnumerator FadeOut(CanvasGroup canvasGroup, float duration = -1f, AnimationCurve curve = null)
        {
            if (canvasGroup == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;
            curve = curve ?? defaultCurve;

            float elapsed = 0f;
            float startAlpha = canvasGroup.alpha;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = curve.Evaluate(elapsed / duration);
                canvasGroup.alpha = Mathf.Lerp(startAlpha, 0f, t);
                yield return null;
            }

            canvasGroup.alpha = 0f;
        }

        #endregion

        #region Slide 動畫

        /// <summary>
        /// 滑入動畫
        /// </summary>
        public IEnumerator SlideIn(RectTransform rectTransform, Direction direction, float distance = 500f, float duration = -1f, AnimationCurve curve = null)
        {
            if (rectTransform == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;
            curve = curve ?? defaultCurve;

            Vector3 targetPos = rectTransform.localPosition;
            Vector3 startPos = GetOffsetPosition(targetPos, direction, distance);

            rectTransform.localPosition = startPos;

            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = curve.Evaluate(elapsed / duration);
                rectTransform.localPosition = Vector3.Lerp(startPos, targetPos, t);
                yield return null;
            }

            rectTransform.localPosition = targetPos;
        }

        /// <summary>
        /// 滑出動畫
        /// </summary>
        public IEnumerator SlideOut(RectTransform rectTransform, Direction direction, float distance = 500f, float duration = -1f, AnimationCurve curve = null)
        {
            if (rectTransform == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;
            curve = curve ?? defaultCurve;

            Vector3 startPos = rectTransform.localPosition;
            Vector3 targetPos = GetOffsetPosition(startPos, direction, distance);

            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = curve.Evaluate(elapsed / duration);
                rectTransform.localPosition = Vector3.Lerp(startPos, targetPos, t);
                yield return null;
            }

            rectTransform.localPosition = targetPos;
        }

        #endregion

        #region Scale 動畫

        /// <summary>
        /// 縮放進入動畫
        /// </summary>
        public IEnumerator ScaleIn(Transform transform, float duration = -1f, AnimationCurve curve = null)
        {
            if (transform == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;
            curve = curve ?? defaultCurve;

            Vector3 targetScale = transform.localScale;
            transform.localScale = Vector3.zero;

            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = curve.Evaluate(elapsed / duration);
                transform.localScale = Vector3.Lerp(Vector3.zero, targetScale, t);
                yield return null;
            }

            transform.localScale = targetScale;
        }

        /// <summary>
        /// 縮放退出動畫
        /// </summary>
        public IEnumerator ScaleOut(Transform transform, float duration = -1f, AnimationCurve curve = null)
        {
            if (transform == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;
            curve = curve ?? defaultCurve;

            Vector3 startScale = transform.localScale;

            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = curve.Evaluate(elapsed / duration);
                transform.localScale = Vector3.Lerp(startScale, Vector3.zero, t);
                yield return null;
            }

            transform.localScale = Vector3.zero;
        }

        #endregion

        #region 彈跳動畫

        /// <summary>
        /// 彈跳動畫
        /// </summary>
        public IEnumerator Bounce(Transform transform, float bounceHeight = 20f, int bounceCount = 2, float duration = -1f)
        {
            if (transform == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;

            Vector3 startPos = transform.localPosition;
            float bounceDuration = duration / bounceCount;

            for (int i = 0; i < bounceCount; i++)
            {
                float currentHeight = bounceHeight * (1f - (float)i / bounceCount);

                // 向上
                float elapsed = 0f;
                while (elapsed < bounceDuration / 2)
                {
                    elapsed += Time.deltaTime;
                    float t = elapsed / (bounceDuration / 2);
                    float y = Mathf.Lerp(0, currentHeight, t);
                    transform.localPosition = startPos + new Vector3(0, y, 0);
                    yield return null;
                }

                // 向下
                elapsed = 0f;
                while (elapsed < bounceDuration / 2)
                {
                    elapsed += Time.deltaTime;
                    float t = elapsed / (bounceDuration / 2);
                    float y = Mathf.Lerp(currentHeight, 0, t);
                    transform.localPosition = startPos + new Vector3(0, y, 0);
                    yield return null;
                }
            }

            transform.localPosition = startPos;
        }

        #endregion

        #region 震動動畫

        /// <summary>
        /// 震動動畫
        /// </summary>
        public IEnumerator Shake(Transform transform, float shakeAmount = 10f, float duration = -1f)
        {
            if (transform == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;

            Vector3 startPos = transform.localPosition;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                float x = Random.Range(-shakeAmount, shakeAmount);
                float y = Random.Range(-shakeAmount, shakeAmount);

                transform.localPosition = startPos + new Vector3(x, y, 0);

                elapsed += Time.deltaTime;
                yield return null;
            }

            transform.localPosition = startPos;
        }

        #endregion

        #region 脈衝動畫

        /// <summary>
        /// 脈衝動畫（放大縮小）
        /// </summary>
        public IEnumerator Pulse(Transform transform, float pulseScale = 1.2f, int pulseCount = 1, float duration = -1f)
        {
            if (transform == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;

            Vector3 originalScale = transform.localScale;
            Vector3 targetScale = originalScale * pulseScale;
            float pulseDuration = duration / (pulseCount * 2);

            for (int i = 0; i < pulseCount; i++)
            {
                // 放大
                float elapsed = 0f;
                while (elapsed < pulseDuration)
                {
                    elapsed += Time.deltaTime;
                    float t = elapsed / pulseDuration;
                    transform.localScale = Vector3.Lerp(originalScale, targetScale, t);
                    yield return null;
                }

                // 縮小
                elapsed = 0f;
                while (elapsed < pulseDuration)
                {
                    elapsed += Time.deltaTime;
                    float t = elapsed / pulseDuration;
                    transform.localScale = Vector3.Lerp(targetScale, originalScale, t);
                    yield return null;
                }
            }

            transform.localScale = originalScale;
        }

        #endregion

        #region 顏色動畫

        /// <summary>
        /// 顏色過渡動畫
        /// </summary>
        public IEnumerator ColorTransition(Graphic graphic, Color targetColor, float duration = -1f, AnimationCurve curve = null)
        {
            if (graphic == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;
            curve = curve ?? defaultCurve;

            Color startColor = graphic.color;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = curve.Evaluate(elapsed / duration);
                graphic.color = Color.Lerp(startColor, targetColor, t);
                yield return null;
            }

            graphic.color = targetColor;
        }

        /// <summary>
        /// 閃爍動畫
        /// </summary>
        public IEnumerator Blink(Graphic graphic, Color blinkColor, int blinkCount = 3, float duration = -1f)
        {
            if (graphic == null) yield break;

            duration = duration < 0 ? defaultDuration : duration;

            Color originalColor = graphic.color;
            float blinkDuration = duration / (blinkCount * 2);

            for (int i = 0; i < blinkCount; i++)
            {
                graphic.color = blinkColor;
                yield return new WaitForSeconds(blinkDuration);

                graphic.color = originalColor;
                yield return new WaitForSeconds(blinkDuration);
            }

            graphic.color = originalColor;
        }

        #endregion

        #region 組合動畫

        /// <summary>
        /// 執行動畫序列
        /// </summary>
        public IEnumerator AnimationSequence(params IEnumerator[] animations)
        {
            foreach (var animation in animations)
            {
                yield return StartCoroutine(animation);
            }
        }

        /// <summary>
        /// 執行並行動畫
        /// </summary>
        public IEnumerator AnimationParallel(params IEnumerator[] animations)
        {
            Coroutine[] coroutines = new Coroutine[animations.Length];

            for (int i = 0; i < animations.Length; i++)
            {
                coroutines[i] = StartCoroutine(animations[i]);
            }

            foreach (var coroutine in coroutines)
            {
                yield return coroutine;
            }
        }

        #endregion

        #region 輔助方法

        private Vector3 GetOffsetPosition(Vector3 basePos, Direction direction, float distance)
        {
            switch (direction)
            {
                case Direction.Left:
                    return basePos + new Vector3(-distance, 0, 0);
                case Direction.Right:
                    return basePos + new Vector3(distance, 0, 0);
                case Direction.Up:
                    return basePos + new Vector3(0, distance, 0);
                case Direction.Down:
                    return basePos + new Vector3(0, -distance, 0);
                default:
                    return basePos;
            }
        }

        #endregion

        #region 靜態輔助方法

        /// <summary>
        /// 創建動畫曲線
        /// </summary>
        public static AnimationCurve CreateCurve(params Keyframe[] keys)
        {
            return new AnimationCurve(keys);
        }

        /// <summary>
        /// 獲取預設動畫曲線
        /// </summary>
        public static AnimationCurve GetPresetCurve(CurvePreset preset)
        {
            switch (preset)
            {
                case CurvePreset.EaseIn:
                    return AnimationCurve.EaseInOut(0, 0, 1, 1);
                case CurvePreset.EaseOut:
                    return AnimationCurve.EaseInOut(0, 0, 1, 1);
                case CurvePreset.Linear:
                    return AnimationCurve.Linear(0, 0, 1, 1);
                case CurvePreset.Bounce:
                    return new AnimationCurve(
                        new Keyframe(0, 0),
                        new Keyframe(0.5f, 1.2f),
                        new Keyframe(1, 1)
                    );
                default:
                    return AnimationCurve.EaseInOut(0, 0, 1, 1);
            }
        }

        public enum CurvePreset
        {
            EaseIn,
            EaseOut,
            Linear,
            Bounce
        }

        #endregion
    }
}
