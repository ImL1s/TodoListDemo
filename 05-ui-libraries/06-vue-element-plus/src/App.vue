<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Sunny, Moon } from '@element-plus/icons-vue'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import type { Todo, FilterType, TodoStats } from './types'

// ============================================================================
// 狀態管理
// ============================================================================

const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')
const isDark = ref<boolean>(false)

// ============================================================================
// 計算屬性
// ============================================================================

/**
 * 根據過濾器條件過濾待辦事項
 */
const filteredTodos = computed<Todo[]>(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

/**
 * 統計資訊
 */
const stats = computed<TodoStats>(() => {
  const total = todos.value.length
  const completed = todos.value.filter(t => t.completed).length
  const active = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, active, completed, completionRate }
})

/**
 * 檢查是否有待辦事項
 */
const hasTodos = computed<boolean>(() => todos.value.length > 0)

/**
 * 檢查是否所有待辦事項都已完成
 */
const allCompleted = computed<boolean>(() => {
  return hasTodos.value && todos.value.every(todo => todo.completed)
})

// ============================================================================
// 方法
// ============================================================================

/**
 * 添加新的待辦事項
 */
const addTodo = (text: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  }

  todos.value.unshift(newTodo)

  ElMessage({
    message: '已成功添加待辦事項',
    type: 'success',
    duration: 2000
  })
}

/**
 * 切換待辦事項的完成狀態
 */
const toggleTodo = (id: number): void => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed

    ElMessage({
      message: todo.completed ? '已標記為完成' : '已標記為未完成',
      type: 'info',
      duration: 1500
    })
  }
}

/**
 * 刪除待辦事項
 */
const deleteTodo = (id: number): void => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)

    ElMessage({
      message: '已刪除待辦事項',
      type: 'warning',
      duration: 2000
    })
  }
}

/**
 * 編輯待辦事項
 */
const editTodo = (id: number, newText: string): void => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.text = newText.trim()

    ElMessage({
      message: '已更新待辦事項',
      type: 'success',
      duration: 2000
    })
  }
}

/**
 * 清除所有已完成的待辦事項
 */
const clearCompleted = (): void => {
  const completedCount = todos.value.filter(t => t.completed).length
  todos.value = todos.value.filter(t => !t.completed)

  if (completedCount > 0) {
    ElMessage({
      message: `已清除 ${completedCount} 個已完成的待辦事項`,
      type: 'success',
      duration: 2000
    })
  }
}

/**
 * 切換所有待辦事項的完成狀態
 */
const toggleAll = (): void => {
  const shouldComplete = !allCompleted.value
  todos.value.forEach(todo => {
    todo.completed = shouldComplete
  })

  ElMessage({
    message: shouldComplete ? '已全部標記為完成' : '已全部標記為未完成',
    type: 'info',
    duration: 2000
  })
}

/**
 * 切換主題
 */
const toggleTheme = (): void => {
  isDark.value = !isDark.value
  updateTheme()

  ElMessage({
    message: isDark.value ? '已切換至深色模式' : '已切換至淺色模式',
    type: 'info',
    duration: 1500
  })
}

/**
 * 更新主題
 */
const updateTheme = (): void => {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// ============================================================================
// LocalStorage 持久化
// ============================================================================

/**
 * 保存待辦事項到 LocalStorage
 */
const saveTodos = (): void => {
  localStorage.setItem('vue-element-plus-todos', JSON.stringify(todos.value))
}

/**
 * 保存主題設定到 LocalStorage
 */
const saveTheme = (): void => {
  localStorage.setItem('vue-element-plus-theme', isDark.value ? 'dark' : 'light')
}

/**
 * 從 LocalStorage 載入待辦事項
 */
const loadTodos = (): void => {
  const saved = localStorage.getItem('vue-element-plus-todos')
  if (saved) {
    try {
      todos.value = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load todos:', error)
      todos.value = []
    }
  }
}

/**
 * 從 LocalStorage 載入主題設定
 */
const loadTheme = (): void => {
  const saved = localStorage.getItem('vue-element-plus-theme')
  isDark.value = saved === 'dark'
  updateTheme()
}

// ============================================================================
// 生命週期鉤子
// ============================================================================

onMounted(() => {
  loadTodos()
  loadTheme()
})

// 監聽待辦事項變化並自動保存
watch(todos, saveTodos, { deep: true })

// 監聽主題變化並自動保存
watch(isDark, saveTheme)
</script>

<template>
  <el-container class="app-container">
    <!-- 頭部 -->
    <el-header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="app-title">
            <el-icon class="title-icon"><Document /></el-icon>
            待辦事項清單
          </h1>
          <div class="tech-tags">
            <el-tag type="primary" effect="dark">Vue 3</el-tag>
            <el-tag type="success" effect="dark">Element Plus</el-tag>
            <el-tag type="info" effect="dark">TypeScript</el-tag>
          </div>
        </div>

        <div class="header-right">
          <!-- 主題切換 -->
          <div class="theme-switch">
            <el-icon :size="18"><Sunny /></el-icon>
            <el-switch
              v-model="isDark"
              @change="toggleTheme"
              inline-prompt
              :active-icon="Moon"
              :inactive-icon="Sunny"
            />
            <el-icon :size="18"><Moon /></el-icon>
          </div>
        </div>
      </div>
    </el-header>

    <!-- 主要內容 -->
    <el-main class="app-main">
      <div class="main-content">
        <!-- 統計卡片 -->
        <el-card v-if="hasTodos" class="stats-card" shadow="hover">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">總計</div>
              <div class="stat-value primary">{{ stats.total }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">進行中</div>
              <div class="stat-value warning">{{ stats.active }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">已完成</div>
              <div class="stat-value success">{{ stats.completed }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">完成率</div>
              <div class="stat-value info">{{ stats.completionRate }}%</div>
            </div>
          </div>

          <!-- 進度條 -->
          <el-progress
            :percentage="stats.completionRate"
            :color="stats.completionRate === 100 ? '#67c23a' : '#409eff'"
            :stroke-width="8"
            class="stats-progress"
          />
        </el-card>

        <!-- 輸入區域 -->
        <el-card class="input-card" shadow="hover">
          <TodoInput @add-todo="addTodo" />
        </el-card>

        <!-- 過濾器和操作按鈕 -->
        <el-card v-if="hasTodos" class="filter-card" shadow="hover">
          <div class="filter-actions">
            <div class="filter-buttons">
              <el-radio-group v-model="filter" size="default">
                <el-radio-button label="all">
                  全部 ({{ stats.total }})
                </el-radio-button>
                <el-radio-button label="active">
                  進行中 ({{ stats.active }})
                </el-radio-button>
                <el-radio-button label="completed">
                  已完成 ({{ stats.completed }})
                </el-radio-button>
              </el-radio-group>
            </div>

            <div class="action-buttons">
              <el-button
                v-if="hasTodos"
                :type="allCompleted ? 'warning' : 'success'"
                @click="toggleAll"
                :icon="allCompleted ? 'Refresh' : 'Check'"
              >
                {{ allCompleted ? '全部取消' : '全部完成' }}
              </el-button>

              <el-button
                v-if="stats.completed > 0"
                type="danger"
                @click="clearCompleted"
                icon="Delete"
              >
                清除已完成 ({{ stats.completed }})
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 待辦事項列表 -->
        <TodoList
          :todos="filteredTodos"
          :filter="filter"
          @toggle-todo="toggleTodo"
          @delete-todo="deleteTodo"
          @edit-todo="editTodo"
        />
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>
/* ============================================================================
   全局樣式
   ============================================================================ */
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dark .app-container {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

/* ============================================================================
   頭部樣式
   ============================================================================ */
.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: auto !important;
  padding: 20px 24px;
}

.dark .app-header {
  background: rgba(30, 30, 30, 0.95);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.app-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dark .app-title {
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  font-size: 32px;
  color: #667eea;
}

.dark .title-icon {
  color: #409eff;
}

.tech-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
}

.dark .theme-switch {
  background: rgba(255, 255, 255, 0.1);
}

/* ============================================================================
   主要內容樣式
   ============================================================================ */
.app-main {
  padding: 32px 24px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ============================================================================
   卡片樣式
   ============================================================================ */
.stats-card,
.input-card,
.filter-card {
  border-radius: 12px;
  border: none;
}

.dark .stats-card,
.dark .input-card,
.dark .filter-card {
  background-color: #1e1e1e;
}

/* ============================================================================
   統計卡片樣式
   ============================================================================ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dark .stat-item {
  background: rgba(255, 255, 255, 0.05);
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.stat-value.primary {
  color: #409eff;
}

.stat-value.warning {
  color: #e6a23c;
}

.stat-value.success {
  color: #67c23a;
}

.stat-value.info {
  color: #909399;
}

.stats-progress {
  margin-top: 8px;
}

/* ============================================================================
   過濾器和操作按鈕樣式
   ============================================================================ */
.filter-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-buttons {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* ============================================================================
   響應式設計
   ============================================================================ */
@media (max-width: 768px) {
  .app-header {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .app-title {
    font-size: 24px;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons,
  .action-buttons {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }

  :deep(.el-radio-group) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  :deep(.el-radio-button) {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .app-main {
    padding: 16px;
  }

  .app-title {
    font-size: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>
