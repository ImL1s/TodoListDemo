import React, { useCallback } from 'react';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
  IonText,
  IonBadge,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  useIonAlert,
} from '@ionic/react';
import {
  trashOutline,
  checkmarkCircle,
  alertCircle,
  removeCircle,
} from 'ionicons/icons';
import { useHaptics } from '../hooks';
import type { Todo } from '../hooks';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  children?: React.ReactNode;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, children }) => {
  const [presentAlert] = useIonAlert();
  const { impact, notification } = useHaptics();

  // 处理切换完成状态
  const handleToggle = useCallback(async () => {
    onToggle(todo.id);
    await impact();
  }, [todo.id, onToggle, impact]);

  // 处理删除 - 显示确认对话框
  const handleDelete = useCallback(() => {
    presentAlert({
      header: 'Delete Todo',
      message: `Are you sure you want to delete "${todo.text}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            onDelete(todo.id);
            await notification();
          },
        },
      ],
    });
  }, [todo.id, todo.text, onDelete, presentAlert, notification]);

  // 格式化日期
  const formatDate = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  }, []);

  // 获取优先级图标和颜色
  const getPriorityIcon = () => {
    switch (todo.priority) {
      case 'high':
        return { icon: alertCircle, color: 'danger' };
      case 'low':
        return { icon: removeCircle, color: 'success' };
      default:
        return null;
    }
  };

  const priorityInfo = getPriorityIcon();

  return (
    <IonItemSliding>
      <IonItem className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        <IonCheckbox
          slot="start"
          checked={todo.completed}
          onIonChange={handleToggle}
          className="todo-checkbox"
        />

        <IonLabel className="todo-label">
          <div className="todo-text">
            {todo.completed && (
              <IonIcon icon={checkmarkCircle} className="check-icon" color="success" />
            )}
            <IonText color={todo.completed ? 'medium' : 'dark'}>
              <p className={todo.completed ? 'strikethrough' : ''}>{todo.text}</p>
            </IonText>
          </div>
          <div className="todo-meta">
            <IonText color="medium">
              <span className="todo-date">{formatDate(todo.createdAt)}</span>
            </IonText>
            {priorityInfo && !todo.completed && (
              <IonBadge color={priorityInfo.color} className="priority-badge">
                <IonIcon icon={priorityInfo.icon} />
                {todo.priority}
              </IonBadge>
            )}
            {todo.category && (
              <IonBadge color="tertiary" className="category-badge">
                {todo.category}
              </IonBadge>
            )}
          </div>
        </IonLabel>

        {children}

        <IonButton
          slot="end"
          fill="clear"
          color="danger"
          onClick={handleDelete}
          className="delete-button"
        >
          <IonIcon icon={trashOutline} slot="icon-only" />
        </IonButton>
      </IonItem>

      {/* 滑动选项 */}
      <IonItemOptions side="end" onIonSwipe={handleDelete}>
        <IonItemOption color="danger" expandable onClick={handleDelete}>
          <IonIcon icon={trashOutline} slot="icon-only" />
        </IonItemOption>
      </IonItemOptions>

      <IonItemOptions side="start" onIonSwipe={handleToggle}>
        <IonItemOption color="success" expandable onClick={handleToggle}>
          <IonIcon icon={checkmarkCircle} slot="icon-only" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

// 使用 React.memo 优化重渲染
export default React.memo(TodoItem, (prevProps, nextProps) => {
  // 只有当 todo 对象的关键属性改变时才重新渲染
  return (
    prevProps.todo.id === nextProps.todo.id &&
    prevProps.todo.text === nextProps.todo.text &&
    prevProps.todo.completed === nextProps.todo.completed &&
    prevProps.todo.priority === nextProps.todo.priority &&
    prevProps.todo.category === nextProps.todo.category
  );
});
