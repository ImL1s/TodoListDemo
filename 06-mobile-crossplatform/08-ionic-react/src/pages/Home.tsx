import React, { useMemo } from 'react';
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
  IonSpinner,
  IonText,
  IonBadge,
  IonFab,
  IonFabButton,
  IonButtons,
  IonButton,
  useIonActionSheet,
  useIonModal,
} from '@ionic/react';
import {
  logoIonic,
  logoReact,
  wifiOutline,
  wifiOffOutline,
  settings,
  filter,
  add,
} from 'ionicons/icons';
import { useTodos, useToast, useNetwork, usePlatform } from '../hooks';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import SettingsModal from '../components/SettingsModal';
import './Home.css';

const Home: React.FC = () => {
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    reorderTodos,
    loadTodos,
  } = useTodos();

  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const { isOnline } = useNetwork();
  const { platformName } = usePlatform();

  const [presentActionSheet] = useIonActionSheet();
  const [presentSettings, dismissSettings] = useIonModal(SettingsModal, {
    onDismiss: () => dismissSettings(),
  });

  // 计算统计数据（使用 useMemo 优化）
  const stats = useMemo(() => {
    const active = todos.filter((todo) => !todo.completed);
    const completed = todos.filter((todo) => todo.completed);
    const highPriority = todos.filter((todo) => todo.priority === 'high' && !todo.completed);

    return {
      total: todos.length,
      active: active.length,
      completed: completed.length,
      highPriority: highPriority.length,
    };
  }, [todos]);

  // 处理下拉刷新
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadTodos();
    event.detail.complete();
    showInfo('Todos refreshed!');
  };

  // 处理添加 Todo
  const handleAddTodo = (text: string) => {
    addTodo(text);
    showSuccess('Todo added successfully!');
  };

  // 处理切换完成状态
  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
    showInfo('Todo updated!');
  };

  // 处理删除
  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    showWarning('Todo deleted!');
  };

  // 处理清除已完成
  const handleClearCompleted = () => {
    if (stats.completed === 0) {
      showInfo('No completed todos to clear');
      return;
    }
    clearCompleted();
    showSuccess(`Cleared ${stats.completed} completed todo(s)`);
  };

  // 显示筛选器
  const handleShowFilter = () => {
    presentActionSheet({
      header: 'Filter Todos',
      buttons: [
        {
          text: 'All Tasks',
          handler: () => {
            showInfo('Showing all tasks');
          },
        },
        {
          text: 'Active Only',
          handler: () => {
            showInfo('Showing active tasks');
          },
        },
        {
          text: 'Completed Only',
          handler: () => {
            showInfo('Showing completed tasks');
          },
        },
        {
          text: 'High Priority',
          handler: () => {
            showInfo('Showing high priority tasks');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
  };

  // 显示错误
  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="danger">
            <IonTitle>Error</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard color="danger">
            <IonCardHeader>
              <IonCardTitle>Failed to Load Todos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{error}</p>
              <IonButton onClick={loadTodos} color="light">
                Retry
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Ionic React Todo</IonTitle>
          <IonButtons slot="end">
            {/* 网络状态指示器 */}
            <IonButton>
              <IonIcon
                slot="icon-only"
                icon={isOnline ? wifiOutline : wifiOffOutline}
                color={isOnline ? 'success' : 'danger'}
              />
            </IonButton>
            {/* 筛选按钮 */}
            <IonButton onClick={handleShowFilter}>
              <IonIcon slot="icon-only" icon={filter} />
            </IonButton>
            {/* 设置按钮 */}
            <IonButton onClick={() => presentSettings()}>
              <IonIcon slot="icon-only" icon={settings} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon="chevron-down-circle-outline"
            refreshingSpinner="circles"
          />
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Todo List</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* 技术栈卡片 */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <div className="tech-stack-header">
                <span>Technology Stack</span>
                <IonBadge color="tertiary">{platformName}</IonBadge>
              </div>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="tech-chips">
              <IonChip color="primary">
                <IonIcon icon={logoIonic} />
                <IonLabel>Ionic 7</IonLabel>
              </IonChip>
              <IonChip color="tertiary">
                <IonIcon icon={logoReact} />
                <IonLabel>React 18</IonLabel>
              </IonChip>
              <IonChip color="success">
                <IonLabel>Capacitor 5</IonLabel>
              </IonChip>
            </div>
            <p className="tech-description">
              Cross-platform mobile app with native iOS/Android capabilities using
              Ionic Framework and React.
            </p>
            {!isOnline && (
              <IonText color="warning">
                <p className="offline-notice">
                  <IonIcon icon={wifiOffOutline} /> You are currently offline
                </p>
              </IonText>
            )}
          </IonCardContent>
        </IonCard>

        {/* 输入框 */}
        <TodoInput onAddTodo={handleAddTodo} />

        {/* 统计信息 */}
        <div className="stats-container">
          <IonChip color="success">
            <IonLabel>Active: {stats.active}</IonLabel>
          </IonChip>
          <IonChip color="medium">
            <IonLabel>Completed: {stats.completed}</IonLabel>
          </IonChip>
          <IonChip color="tertiary">
            <IonLabel>Total: {stats.total}</IonLabel>
          </IonChip>
          {stats.highPriority > 0 && (
            <IonChip color="danger">
              <IonLabel>High Priority: {stats.highPriority}</IonLabel>
            </IonChip>
          )}
        </div>

        {/* 加载指示器 */}
        {loading && (
          <div className="loading-container">
            <IonSpinner name="circular" />
            <IonText color="medium">
              <p>Loading todos...</p>
            </IonText>
          </div>
        )}

        {/* Todo 列表 */}
        {!loading && (
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onClearCompleted={handleClearCompleted}
            onReorder={reorderTodos}
          />
        )}

        {/* 浮动操作按钮 */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
