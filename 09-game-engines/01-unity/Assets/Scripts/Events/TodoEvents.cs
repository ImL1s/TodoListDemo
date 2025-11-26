using UnityEngine;
using TodoList.Data;

namespace TodoList.Events
{
    /// <summary>
    /// Todo 相關事件定義
    /// </summary>

    /// <summary>
    /// Todo 字符串事件（用於傳遞 ID）
    /// </summary>
    [CreateAssetMenu(fileName = "TodoStringEvent", menuName = "Todo List/Events/Todo String Event", order = 2)]
    public class TodoStringEvent : GameEvent<string> { }

    /// <summary>
    /// Todo 整數事件（用於傳遞數量等）
    /// </summary>
    [CreateAssetMenu(fileName = "TodoIntEvent", menuName = "Todo List/Events/Todo Int Event", order = 3)]
    public class TodoIntEvent : GameEvent<int> { }

    /// <summary>
    /// Todo 對象事件
    /// </summary>
    [CreateAssetMenu(fileName = "TodoObjectEvent", menuName = "Todo List/Events/Todo Object Event", order = 4)]
    public class TodoObjectEvent : GameEvent<Todo> { }

    /// <summary>
    /// Todo 布爾事件
    /// </summary>
    [CreateAssetMenu(fileName = "TodoBoolEvent", menuName = "Todo List/Events/Todo Bool Event", order = 5)]
    public class TodoBoolEvent : GameEvent<bool> { }
}
