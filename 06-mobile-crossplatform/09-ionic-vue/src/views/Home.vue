<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Todo List</ion-title>
        <ion-buttons slot="end">
          <ion-badge color="light" style="margin-right: 16px; padding: 4px 8px; font-size: 14px;">
            {{ incompleteTodoCount }} / {{ todos.length }}
          </ion-badge>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Todo List</ion-title>
        </ion-toolbar>
      </ion-header>

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
        </ion-card-content>
      </ion-card>

      <!-- Todo Input -->
      <TodoInput @add-todo="addTodo" />

      <!-- Filter Buttons -->
      <div class="filter-container">
        <ion-segment :value="filter" @ionChange="handleFilterChange">
          <ion-segment-button value="all">
            <ion-label>All ({{ todos.length }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="active">
            <ion-label>Active ({{ incompleteTodoCount }})</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <ion-label>Done ({{ completedTodoCount }})</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- Todo List -->
      <TodoList
        :todos="filteredTodos"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"
      />

      <!-- Empty State -->
      <div v-if="filteredTodos.length === 0" class="empty-state">
        <ion-icon :icon="checkmarkDoneCircleOutline" size="large" color="medium"></ion-icon>
        <p>{{ emptyStateMessage }}</p>
      </div>

      <!-- Clear Completed Button -->
      <div v-if="completedTodoCount > 0" class="clear-completed-container">
        <ion-button expand="block" color="danger" @click="clearCompleted">
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          Clear Completed ({{ completedTodoCount }})
        </ion-button>
      </div>

      <!-- Stats Card -->
      <ion-card v-if="todos.length > 0" class="stats-card">
        <ion-card-header>
          <ion-card-title>Statistics</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <ion-icon :icon="listOutline" color="primary"></ion-icon>
              <div class="stat-info">
                <span class="stat-label">Total Tasks</span>
                <span class="stat-value">{{ todos.length }}</span>
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
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  alertController,
  toastController
} from '@ionic/vue'
import {
  logoIonic,
  checkmarkDoneCircleOutline,
  trashOutline,
  listOutline,
  checkmarkCircleOutline,
  timeOutline,
  statsChartOutline,
  informationCircleOutline
} from 'ionicons/icons'
import { Preferences } from '@capacitor/preferences'
import TodoInput from '../components/TodoInput.vue'
import TodoList from '../components/TodoList.vue'

// Types
export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

type FilterType = 'all' | 'active' | 'completed'

// State
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')

// Computed
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const incompleteTodoCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length
})

const completedTodoCount = computed(() => {
  return todos.value.filter(todo => todo.completed).length
})

const completionPercentage = computed(() => {
  if (todos.value.length === 0) return 0
  return Math.round((completedTodoCount.value / todos.value.length) * 100)
})

const emptyStateMessage = computed(() => {
  switch (filter.value) {
    case 'active':
      return 'No active tasks. Great job!'
    case 'completed':
      return 'No completed tasks yet'
    default:
      return 'No tasks yet. Add one above!'
  }
})

// Methods
const saveTodos = async () => {
  try {
    await Preferences.set({
      key: 'todos',
      value: JSON.stringify(todos.value)
    })
  } catch (error) {
    console.error('Error saving todos:', error)
    showToast('Failed to save todos', 'danger')
  }
}

const loadTodos = async () => {
  try {
    const { value } = await Preferences.get({ key: 'todos' })
    if (value) {
      todos.value = JSON.parse(value)
    }
  } catch (error) {
    console.error('Error loading todos:', error)
    showToast('Failed to load todos', 'danger')
  }
}

const addTodo = (text: string) => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  }
  todos.value.unshift(newTodo)
  saveTodos()
  showToast('Task added successfully', 'success')
}

const toggleTodo = (id: number) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
    showToast(
      todo.completed ? 'Task completed!' : 'Task marked as active',
      todo.completed ? 'success' : 'warning'
    )
  }
}

const deleteTodo = async (id: number) => {
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
          todos.value = todos.value.filter(t => t.id !== id)
          saveTodos()
          showToast('Task deleted', 'danger')
        }
      }
    ]
  })

  await alert.present()
}

const clearCompleted = async () => {
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
          const count = completedTodoCount.value
          todos.value = todos.value.filter(t => !t.completed)
          saveTodos()
          showToast(`${count} task${count > 1 ? 's' : ''} cleared`, 'success')
        }
      }
    ]
  })

  await alert.present()
}

const handleFilterChange = (event: CustomEvent) => {
  filter.value = event.detail.value as FilterType
}

const showToast = async (message: string, color: string = 'primary') => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'bottom'
  })
  await toast.present()
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

/* Filter Container */
.filter-container {
  padding: 0 16px 16px;
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

/* Responsive Design */
@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
