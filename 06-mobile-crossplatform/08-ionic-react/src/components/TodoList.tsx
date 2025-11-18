import React from 'react';
import {
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import TodoItem from './TodoItem';
import { Todo } from '../pages/Home';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClearCompleted: () => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onClearCompleted,
}) => {
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);
  const hasCompleted = completedTodos.length > 0;

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
          <IonCardHeader>
            <IonCardTitle>
              Active Tasks ({activeTodos.length})
            </IonCardTitle>
          </IonCardHeader>
          <IonList>
            {activeTodos.map((todo) => (
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

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <IonCard>
          <IonCardHeader className="completed-header">
            <IonCardTitle>
              Completed Tasks ({completedTodos.length})
            </IonCardTitle>
            <IonButton
              size="small"
              color="danger"
              fill="outline"
              onClick={onClearCompleted}
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
    </div>
  );
};

export default TodoList;
