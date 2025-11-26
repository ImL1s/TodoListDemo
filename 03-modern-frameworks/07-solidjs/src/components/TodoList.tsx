import { For, Show } from 'solid-js';
import TodoItem from './TodoItem';
import type { TodoListProps } from '../types';

/**
 * TodoList 組件 - 待辦事項列表容器
 * 展示 SolidJS 的條件渲染和列表渲染
 *
 * 與 React 的關鍵差異：
 * 1. 使用 <For> 組件而不是 .map() 來渲染列表
 * 2. <For> 提供了優化的列表更新（只更新變化的項目）
 * 3. 使用 <Show> 組件進行條件渲染（優化性能）
 * 4. 不需要 key prop，<For> 自動處理
 */
const TodoList = (props: TodoListProps) => {
  return (
    <Show
      when={props.todos.length > 0}
      fallback={
        <div class="empty-state">
          <p>暫無待辦事項</p>
          <p class="empty-hint">添加一個新的待辦事項開始吧！</p>
        </div>
      }
    >
      <ul class="todo-list">
        {/*
          SolidJS 的 <For> 組件：
          - 自動追蹤列表項的變化
          - 只更新變化的 DOM 節點
          - 比 React 的 .map() 更高效
          - 不需要 key prop
        */}
        <For each={props.todos}>
          {(todo) => (
            <TodoItem
              todo={todo}
              onToggle={props.onToggleTodo}
              onDelete={props.onDeleteTodo}
              onEdit={props.onEditTodo}
            />
          )}
        </For>
      </ul>
    </Show>
  );
};

export default TodoList;
