<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Todo List</ion-title>
        <ion-buttons slot="end">
          <ion-badge color="light" style="margin-right: 16px; padding: 4px 8px; font-size: 14px;">
            {{ incompleteTodoCount }} / {{ totalTodoCount }}
          </ion-badge>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Large Title Header -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Todo List</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Pull to Refresh -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content
          :pulling-icon="chevronDownCircleOutline"
          pulling-text="Pull to refresh"
          refreshing-spinner="circles"
          refreshing-text="Refreshing..."
        ></ion-refresher-content>
      </ion-refresher>

      <!-- Technology Tag -->
      <ion-card class="tech-tag-card">
        <ion-card-content>
          <div class="tech-tag">
            <ion-icon :icon="logoIonic" color="primary"></ion-icon>
            <span class="tech-text">Ionic + Vue</span>
          </div>
          <p class="tech-description">
            Cross-platform mobile app with native experience
          </p>
          <div v-if="platformInfo.isNative" class="platform-badge">
            <ion-chip :color="platformInfo.isIOS ? 'primary' : 'success'">
              <ion-icon :icon="platformInfo.isIOS ? logoApple : logoAndroid"></ion-icon>
              <ion-label>{{ platformInfo.platform.toUpperCase() }}</ion-label>
            </ion-chip>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Todo Input -->
      <TodoInput @add-todo="handleAddTodo" />

      <!-- Filter Buttons -->
      <div class="filter-container">
        <ion-segment :value="filter" @ionChange="handleFilterChange">
          <ion-segment-button value="all">
            <ion-label>All ({{ totalTodoCount }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="active">
            <ion-label>Active ({{ incompleteTodoCount }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <ion-label>Done ({{ completedTodoCount }})</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <ion-spinner name="circles"></ion-spinner>
        <p>Loading tasks...</p>
      </div>

      <!-- Todo List -->
      <TodoList
        v-else
        :todos="filteredTodos"
        @toggle-todo="handleToggleTodo"
        @delete-todo="handleDeleteTodo"
      />

      <!-- Empty State -->
      <div v-if="!loading && filteredTodos.length === 0" class="empty-state">
        <ion-icon :icon="checkmarkDoneCircleOutline" size="large" color="medium"></ion-icon>
        <p>{{ emptyStateMessage }}</p>
      </div>

      <!-- Clear Completed Button -->
      <div v-if="hasCompletedTodos" class="clear-completed-container">
        <ion-button expand="block" color="danger" @click="handleClearCompleted">
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          Clear Completed ({{ completedTodoCount }})
        </ion-button>
      </div>

      <!-- Stats Card -->
      <ion-card v-if="hasTodos" class="stats-card">
        <ion-card-header>
          <ion-card-title>Statistics</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <ion-icon :icon="listOutline" color="primary"></ion-icon>
              <div class="stat-info">
                <span class="stat-label">Total Tasks</span>
                <span class="stat-value">{{ totalTodoCount }}</span>
              </div>
            </div>
            <div class="stat-item">
              <ion-icon :icon="checkmarkCircleOutline" color="success"></ion-icon>
              <div class="stat-info">
                <span class="stat-label">Completed</span>
                <span class="stat-value">{{ completedTodoCount }}</span>
              </div>
            </div>
            <div class="stat-item">
              <ion-icon :icon="timeOutline" color="warning"></ion-icon>
              <div class="stat-info">
                <span class="stat-label">Pending</span>
                <span class="stat-value">{{ incompleteTodoCount }}</span>
              </div>
            </div>
            <div class="stat-item">
              <ion-icon :icon="statsChartOutline" color="tertiary"></ion-icon>
              <div class="stat-info">
                <span class="stat-label">Progress</span>
                <span class="stat-value">{{ completionPercentage }}%</span>
              </div>
            </div>
          </div>
          <ion-progress-bar
            :value="completionPercentage / 100"
            color="success"
            style="margin-top: 12px;"
          ></ion-progress-bar>
        </ion-card-content>
      </ion-card>

      <!-- Footer Info -->
      <div class="footer-info">
        <p>
          <ion-icon :icon="informationCircleOutline"></ion-icon>
          Built with Ionic 7 + Vue 3 + Capacitor
        </p>
        <p>Data stored locally using Capacitor Preferences</p>
        <p v-if="platformInfo.isNative" class="platform-info">
          <ion-icon :icon="phonePortraitOutline"></ion-icon>
          Running on {{ platformInfo.platform.toUpperCase() }}
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonButton,
  IonButtons,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonChip,
  alertController
} from '@ionic/vue'
import {
  logoIonic,
  logoApple,
  logoAndroid,
  checkmarkDoneCircleOutline,
  trashOutline,
  listOutline,
  checkmarkCircleOutline,
  timeOutline,
  statsChartOutline,
  informationCircleOutline,
  phonePortraitOutline,
  chevronDownCircleOutline
} from 'ionicons/icons'
import { useTodos, useAutoSetupPlatform } from '@/composables'
import TodoInput from '@/components/TodoInput.vue'
import TodoList from '@/components/TodoList.vue'

// Use composables
const {
  // State
  filter,
  loading,
  // Computed
  filteredTodos,
  incompleteTodoCount,
  completedTodoCount,
  totalTodoCount,
  completionPercentage,
  emptyStateMessage,
  hasCompletedTodos,
  hasTodos,
  // Methods
  loadTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
  setFilter,
  refresh
} = useTodos()

// Platform setup with auto-configuration
const platformInfo = useAutoSetupPlatform({
  statusBarBackgroundColor: '#3880ff',
  onBackButton: (canGoBack) => {
    if (!canGoBack) {
      showExitConfirmation()
    } else {
      window.history.back()
    }
  }
})

// Handlers
const handleAddTodo = async (text: string) => {
  await addTodo(text)
}

const handleToggleTodo = async (id: number) => {
  await toggleTodo(id)
}

const handleDeleteTodo = async (id: number) => {
  const alert = await alertController.create({
    header: 'Delete Task',
    message: 'Are you sure you want to delete this task?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          deleteTodo(id)
        }
      }
    ]
  })

  await alert.present()
}

const handleClearCompleted = async () => {
  const alert = await alertController.create({
    header: 'Clear Completed',
    message: `Delete ${completedTodoCount.value} completed task${completedTodoCount.value > 1 ? 's' : ''}?`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Clear',
        role: 'destructive',
        handler: () => {
          clearCompleted()
        }
      }
    ]
  })

  await alert.present()
}

const handleFilterChange = (event: CustomEvent) => {
  setFilter(event.detail.value)
}

const handleRefresh = async (event: CustomEvent) => {
  await refresh()
  event.target.complete()
}

const showExitConfirmation = async () => {
  const alert = await alertController.create({
    header: 'Exit App',
    message: 'Are you sure you want to exit?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Exit',
        role: 'destructive',
        handler: () => {
          platformInfo.exitApp()
        }
      }
    ]
  })

  await alert.present()
}

// Lifecycle
onMounted(() => {
  loadTodos()
})
</script>

<style scoped>
/* Tech Tag Card */
.tech-tag-card {
  margin: 16px;
  margin-bottom: 8px;
}

.tech-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.tech-tag ion-icon {
  font-size: 24px;
}

.tech-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.tech-description {
  margin: 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.platform-badge {
  margin-top: 8px;
}

.platform-badge ion-chip {
  margin: 0;
}

/* Filter Container */
.filter-container {
  padding: 0 16px 16px;
}

/* Loading Container */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-container ion-spinner {
  margin-bottom: 16px;
}

.loading-container p {
  font-size: 16px;
  color: var(--ion-color-medium);
  margin: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-state ion-icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  color: var(--ion-color-medium);
  margin: 0;
}

/* Clear Completed Button */
.clear-completed-container {
  padding: 16px;
}

/* Stats Card */
.stats-card {
  margin: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-item ion-icon {
  font-size: 32px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: var(--ion-color-dark);
}

/* Footer Info */
.footer-info {
  text-align: center;
  padding: 24px 16px;
  color: var(--ion-color-medium);
  font-size: 14px;
}

.footer-info p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer-info ion-icon {
  font-size: 18px;
}

.platform-info {
  font-weight: 600;
  color: var(--ion-color-primary);
}

/* Responsive Design */
@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
