import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonToast,
} from '@ionic/react';
import { logoIonic, logoReact } from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import './Home.css';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'ionic-react-todos';

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [present] = useIonToast();

  // 從 Capacitor Preferences 加載數據
  useEffect(() => {
    loadTodos();
  }, []);

  // 保存數據到 Capacitor Preferences
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const loadTodos = async () => {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) {
        const loadedTodos = JSON.parse(value);
        setTodos(loadedTodos);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      showToast('Failed to load todos', 'danger');
    }
  };

  const saveTodos = async (todosToSave: Todo[]) => {
    try {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(todosToSave),
      });
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const showToast = (message: string, color: string = 'success') => {
    present({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
    showToast('Todo added successfully!');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    showToast('Todo updated!', 'medium');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    showToast('Todo deleted!', 'warning');
  };

  const clearCompleted = () => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    if (completedCount === 0) {
      showToast('No completed todos to clear', 'medium');
      return;
    }
    setTodos(todos.filter((todo) => !todo.completed));
    showToast(`Cleared ${completedCount} completed todo(s)`, 'success');
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadTodos();
    event.detail.complete();
    showToast('Todos refreshed!', 'medium');
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Ionic React Todo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Todo List</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Technology Stack</span>
                <IonChip color="primary">
                  <IonIcon icon={logoIonic} />
                  <IonLabel>Ionic 7</IonLabel>
                </IonChip>
                <IonChip color="tertiary">
                  <IonIcon icon={logoReact} />
                  <IonLabel>React 18</IonLabel>
                </IonChip>
              </div>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              Cross-platform mobile app with native iOS/Android capabilities using
              Ionic Framework and React.
            </p>
          </IonCardContent>
        </IonCard>

        <TodoInput onAddTodo={addTodo} />

        <div className="stats-container">
          <IonChip color="success">
            <IonLabel>Active: {activeTodos.length}</IonLabel>
          </IonChip>
          <IonChip color="medium">
            <IonLabel>Completed: {completedTodos.length}</IonLabel>
          </IonChip>
          <IonChip color="tertiary">
            <IonLabel>Total: {todos.length}</IonLabel>
          </IonChip>
        </div>

        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onClearCompleted={clearCompleted}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
