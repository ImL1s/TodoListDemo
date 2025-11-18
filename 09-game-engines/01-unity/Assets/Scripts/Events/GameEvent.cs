using System.Collections.Generic;
using UnityEngine;

namespace TodoList.Events
{
    /// <summary>
    /// 基於 ScriptableObject 的事件系統
    /// 用於解耦組件之間的通信
    /// </summary>
    [CreateAssetMenu(fileName = "GameEvent", menuName = "Todo List/Events/Game Event", order = 1)]
    public class GameEvent : ScriptableObject
    {
        /// <summary>
        /// 監聽器列表
        /// </summary>
        private readonly List<GameEventListener> eventListeners = new List<GameEventListener>();

        /// <summary>
        /// 觸發事件
        /// </summary>
        public void Raise()
        {
            for (int i = eventListeners.Count - 1; i >= 0; i--)
            {
                eventListeners[i].OnEventRaised();
            }

#if UNITY_EDITOR
            Debug.Log($"Event Raised: {name}");
#endif
        }

        /// <summary>
        /// 註冊監聽器
        /// </summary>
        public void RegisterListener(GameEventListener listener)
        {
            if (!eventListeners.Contains(listener))
            {
                eventListeners.Add(listener);
            }
        }

        /// <summary>
        /// 取消註冊監聽器
        /// </summary>
        public void UnregisterListener(GameEventListener listener)
        {
            if (eventListeners.Contains(listener))
            {
                eventListeners.Remove(listener);
            }
        }
    }

    /// <summary>
    /// 帶參數的遊戲事件（泛型版本）
    /// </summary>
    public abstract class GameEvent<T> : ScriptableObject
    {
        private readonly List<IGameEventListener<T>> eventListeners = new List<IGameEventListener<T>>();

        public void Raise(T value)
        {
            for (int i = eventListeners.Count - 1; i >= 0; i--)
            {
                eventListeners[i].OnEventRaised(value);
            }
        }

        public void RegisterListener(IGameEventListener<T> listener)
        {
            if (!eventListeners.Contains(listener))
            {
                eventListeners.Add(listener);
            }
        }

        public void UnregisterListener(IGameEventListener<T> listener)
        {
            if (eventListeners.Contains(listener))
            {
                eventListeners.Remove(listener);
            }
        }
    }

    /// <summary>
    /// 遊戲事件監聽器接口
    /// </summary>
    public interface IGameEventListener<T>
    {
        void OnEventRaised(T value);
    }
}
