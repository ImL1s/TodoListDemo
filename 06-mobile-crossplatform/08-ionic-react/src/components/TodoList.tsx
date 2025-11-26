import React, { useMemo } from 'react';
import {
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonText,
  IonReorderGroup,
  IonReorder,
  ItemReorderEventDetail,
} from '@ionic/react';
import { trashBin, reorderFour } from 'ionicons/icons';
import TodoItem from './TodoItem';
import { Todo } from '../hooks';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClearCompleted: () => void;
  onReorder?: (from: number, to: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onClearCompleted,
  onReorder,
}) => {
  // 使用 useMemo 优化列表过滤
  const { activeTodos, completedTodos } = useMemo(() => {
    const active = todos.filter((todo) => !todo.completed);
    const completed = todos.filter((todo) => todo.completed);
    return { activeTodos: active, completedTodos: completed };
  }, [todos]);

  // 处理拖拽排序
  const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    if (onReorder) {
      onReorder(event.detail.from, event.detail.to);
    }
    event.detail.complete();
  };

  if (todos.length === 0) {
    return (
      <IonCard className="empty-state">
        <IonCardHeader>
          <IonCardTitle>
            <IonText color="medium">
              <h3>No todos yet</h3>
            </IonText>
          </IonCardTitle>
        </IonCardHeader>
        <div className="empty-message">
          <IonText color="medium">
            <p>Add your first todo to get started!</p>
            <p className="empty-hint">
              Try adding something like "Buy groceries" or "Review pull request"
            </p>
          </IonText>
        </div>
      </IonCard>
    );
  }

  return (
    <div className="todo-list-container">
      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <IonCard>
          <IonCardHeader className="active-header">
            <IonCardTitle>
              <div className="card-title-with-icon">
                <span>Active Tasks ({activeTodos.length})</span>
                <IonIcon icon={reorderFour} color="medium" />
              </div>
            </IonCardTitle>
          </IonCardHeader>
          <IonList>
            <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
              {activeTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                >
                  <IonReorder slot="end" />
                </TodoItem>
              ))}
            </IonReorderGroup>
          </IonList>
        </IonCard>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <IonCard>
          <IonCardHeader className="completed-header">
            <IonCardTitle>Completed Tasks ({completedTodos.length})</IonCardTitle>
            <IonButton
              size="small"
              color="danger"
              fill="outline"
              onClick={onClearCompleted}
              className="clear-button"
            >
              <IonIcon slot="start" icon={trashBin} />
              Clear All
            </IonButton>
          </IonCardHeader>
          <IonList>
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </IonList>
        </IonCard>
      )}

      {/* 提示信息 */}
      {activeTodos.length === 0 && completedTodos.length > 0 && (
        <IonCard color="success" className="all-done-card">
          <IonCardHeader>
            <IonCardTitle>
              <div className="all-done-message">
                <span>🎉</span>
                <span>All tasks completed!</span>
              </div>
            </IonCardTitle>
          </IonCardHeader>
        </IonCard>
      )}
    </div>
  );
};

// 使用 React.memo 优化重渲染
export default React.memo(TodoList, (prevProps, nextProps) => {
  // 只有当 todos 数组引用改变时才重新渲染
  return (
    prevProps.todos === nextProps.todos &&
    prevProps.onToggle === nextProps.onToggle &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onClearCompleted === nextProps.onClearCompleted &&
    prevProps.onReorder === nextProps.onReorder
  );
});
