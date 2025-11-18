import React from 'react';
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
  IonText,
  useIonAlert,
} from '@ionic/react';
import { trashOutline, checkmarkCircle } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Todo } from '../pages/Home';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const [presentAlert] = useIonAlert();

  const handleToggle = async () => {
    onToggle(todo.id);

    // 觸發觸覺反饋（僅在原生設備上）
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Haptics not available in web
    }
  };

  const handleDelete = () => {
    presentAlert({
      header: 'Delete Todo',
      message: 'Are you sure you want to delete this todo?',
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
            try {
              await Haptics.impact({ style: ImpactStyle.Medium });
            } catch (error) {
              // Haptics not available
            }
          },
        },
      ],
    });
  };

  const formatDate = (timestamp: number) => {
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
  };

  return (
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
            <p className={todo.completed ? 'strikethrough' : ''}>
              {todo.text}
            </p>
          </IonText>
        </div>
        <IonText color="medium">
          <p className="todo-date">{formatDate(todo.createdAt)}</p>
        </IonText>
      </IonLabel>

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
  );
};

export default TodoItem;
