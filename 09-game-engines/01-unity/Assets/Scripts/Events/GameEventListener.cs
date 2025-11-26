using UnityEngine;
using UnityEngine.Events;

namespace TodoList.Events
{
    /// <summary>
    /// 遊戲事件監聽器組件
    /// 連接 ScriptableObject 事件和 UnityEvent 回調
    /// </summary>
    public class GameEventListener : MonoBehaviour
    {
        [Tooltip("要監聽的事件")]
        public GameEvent gameEvent;

        [Tooltip("事件觸發時的回調")]
        public UnityEvent response;

        private void OnEnable()
        {
            if (gameEvent != null)
            {
                gameEvent.RegisterListener(this);
            }
        }

        private void OnDisable()
        {
            if (gameEvent != null)
            {
                gameEvent.UnregisterListener(this);
            }
        }

        public void OnEventRaised()
        {
            if (response != null)
            {
                response.Invoke();
            }
        }
    }
}
