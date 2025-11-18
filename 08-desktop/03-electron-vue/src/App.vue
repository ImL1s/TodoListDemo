<template>
  <div class="app">
    <!-- 标题栏 -->
    <header class="header">
      <h1>Electron Vue Todo</h1>
      <div class="header-info">
        <span class="version" v-if="appInfo">v{{ appInfo.version }}</span>
        <button @click="showAboutDialog = true" class="about-btn">关于</button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <div class="container">
        <!-- 输入框组件 -->
        <TodoInput ref="todoInputRef" @add-todo="handleAddTodo" />

        <!-- 过滤器 -->
        <div class="filters">
          <button
            v-for="filter in filters"
            :key="filter.value"
            :class="['filter-btn', { active: currentFilter === filter.value }]"
            @click="currentFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>

        <!-- Todo 列表 -->
        <TodoList
          :todos="filteredTodos"
          @toggle-todo="handleToggleTodo"
          @delete-todo="handleDeleteTodo"
          @edit-todo="handleEditTodo"
        />

        <!-- 统计和操作 -->
        <div class="footer" v-if="todos.length > 0">
          <div class="stats">
            <span>总计: {{ todos.length }}</span>
            <span>活动: {{ activeCount }}</span>
            <span>已完成: {{ completedCount }}</span>
          </div>
          <div class="actions">
            <button @click="handleClearCompleted" v-if="completedCount > 0" class="clear-btn">
              清除已完成
            </button>
            <button @click="handleExport" class="export-btn">导出</button>
            <button @click="handleImport" class="import-btn">导入</button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="todos.length === 0" class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>没有待办事项</p>
          <p class="empty-hint">按 Ctrl+N (Cmd+N) 或点击上方输入框添加新的待办事项</p>
        </div>
      </div>
    </main>

    <!-- 关于对话框 -->
    <div v-if="showAboutDialog" class="modal-overlay" @click="showAboutDialog = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>关于 Electron Vue Todo</h2>
          <button @click="showAboutDialog = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body" v-if="appInfo">
          <p><strong>应用名称:</strong> {{ appInfo.name }}</p>
          <p><strong>版本:</strong> {{ appInfo.version }}</p>
          <p><strong>Electron:</strong> {{ appInfo.electron }}</p>
          <p><strong>Chrome:</strong> {{ appInfo.chrome }}</p>
          <p><strong>Node.js:</strong> {{ appInfo.node }}</p>
          <p><strong>V8:</strong> {{ appInfo.v8}}</p>
          <div class="tech-stack">
            <h3>技术栈</h3>
            <ul>
              <li>Electron 28+</li>
              <li>Vue 3 (Composition API)</li>
              <li>TypeScript</li>
              <li>Vite</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知 -->
    <div v-if="notification" class="notification">
      {{ notification }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import TodoInput from './components/TodoInput.vue';
import TodoList from './components/TodoList.vue';
import type { Todo, FilterType, AppInfo } from './types';

// 响应式状态
const todos = ref<Todo[]>([]);
const currentFilter = ref<FilterType>('all');
const showAboutDialog = ref(false);
const appInfo = ref<AppInfo | null>(null);
const notification = ref('');
const todoInputRef = ref<InstanceType<typeof TodoInput> | null>(null);

// 过滤器选项
const filters = [
  { value: 'all' as FilterType, label: '全部' },
  { value: 'active' as FilterType, label: '活动' },
  { value: 'completed' as FilterType, label: '已完成' },
];

// 计算属性
const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed);
    case 'completed':
      return todos.value.filter(todo => todo.completed);
    default:
      return todos.value;
  }
});

const activeCount = computed(() => todos.value.filter(todo => !todo.completed).length);
const completedCount = computed(() => todos.value.filter(todo => todo.completed).length);

// 加载待办事项
async function loadTodos() {
  try {
    const loadedTodos = await window.electronAPI.getTodos();
    todos.value = loadedTodos.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Failed to load todos:', error);
    showNotification('加载待办事项失败');
  }
}

// 添加待办事项
async function handleAddTodo(text: string) {
  try {
    const newTodo = await window.electronAPI.addTodo(text);
    todos.value.unshift(newTodo);
    showNotification('待办事项已添加');
  } catch (error) {
    console.error('Failed to add todo:', error);
    showNotification('添加待办事项失败');
  }
}

// 切换待办事项状态
async function handleToggleTodo(id: number) {
  try {
    const updatedTodo = await window.electronAPI.toggleTodo(id);
    if (updatedTodo) {
      const index = todos.value.findIndex(t => t.id === id);
      if (index !== -1) {
        todos.value[index] = updatedTodo;
      }
    }
  } catch (error) {
    console.error('Failed to toggle todo:', error);
    showNotification('更新待办事项失败');
  }
}

// 删除待办事项
async function handleDeleteTodo(id: number) {
  try {
    await window.electronAPI.deleteTodo(id);
    todos.value = todos.value.filter(t => t.id !== id);
    showNotification('待办事项已删除');
  } catch (error) {
    console.error('Failed to delete todo:', error);
    showNotification('删除待办事项失败');
  }
}

// 编辑待办事项
async function handleEditTodo(id: number, text: string) {
  try {
    const updatedTodo = await window.electronAPI.editTodo(id, text);
    if (updatedTodo) {
      const index = todos.value.findIndex(t => t.id === id);
      if (index !== -1) {
        todos.value[index] = updatedTodo;
      }
      showNotification('待办事项已更新');
    }
  } catch (error) {
    console.error('Failed to edit todo:', error);
    showNotification('编辑待办事项失败');
  }
}

// 清除已完成的待办事项
async function handleClearCompleted() {
  try {
    await window.electronAPI.clearCompleted();
    todos.value = todos.value.filter(t => !t.completed);
    showNotification('已清除完成的待办事项');
  } catch (error) {
    console.error('Failed to clear completed:', error);
    showNotification('清除失败');
  }
}

// 导出数据
async function handleExport() {
  try {
    const data = await window.electronAPI.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('数据已导出');
  } catch (error) {
    console.error('Failed to export:', error);
    showNotification('导出失败');
  }
}

// 导入数据
function handleImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await window.electronAPI.importData(data);
        await loadTodos();
        showNotification('数据已导入');
      } catch (error) {
        console.error('Failed to import:', error);
        showNotification('导入失败');
      }
    }
  };
  input.click();
}

// 显示通知
function showNotification(message: string) {
  notification.value = message;
  setTimeout(() => {
    notification.value = '';
  }, 3000);
}

// 加载应用信息
async function loadAppInfo() {
  try {
    appInfo.value = await window.electronAPI.getAppInfo();
  } catch (error) {
    console.error('Failed to load app info:', error);
  }
}

// 设置 IPC 监听器
function setupIpcListeners() {
  // 聚焦输入框
  window.electronAPI.onFocusInput(() => {
    todoInputRef.value?.focus();
  });

  // 显示关于对话框
  window.electronAPI.onShowAbout(() => {
    showAboutDialog.value = true;
  });

  // 导出待办事项
  window.electronAPI.onExportTodos(() => {
    handleExport();
  });

  // 导入待办事项
  window.electronAPI.onImportTodos(() => {
    handleImport();
  });

  // 接收通知
  window.electronAPI.onNotification((message: string) => {
    showNotification(message);
  });
}

// 组件挂载时
onMounted(() => {
  loadTodos();
  loadAppInfo();
  setupIpcListeners();
});

// 监听 todos 变化并保存
watch(
  todos,
  async (newTodos) => {
    if (newTodos.length > 0) {
      try {
        await window.electronAPI.saveTodos(newTodos);
      } catch (error) {
        console.error('Failed to save todos:', error);
      }
    }
  },
  { deep: true }
);
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
  font-weight: 600;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.version {
  color: #666;
  font-size: 0.9rem;
}

.about-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.about-btn:hover {
  background: #5568d3;
}

.main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 2rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.filter-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
}

.footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.clear-btn,
.export-btn,
.import-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.clear-btn {
  background: #ff6b6b;
  color: white;
}

.clear-btn:hover {
  background: #ee5a52;
}

.export-btn {
  background: #51cf66;
  color: white;
}

.export-btn:hover {
  background: #40c057;
}

.import-btn {
  background: #339af0;
  color: white;
}

.import-btn:hover {
  background: #228be6;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  color: #ddd;
}

.empty-state p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.empty-hint {
  font-size: 0.9rem;
  color: #bbb;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

.modal-body p {
  margin: 0.75rem 0;
  color: #555;
}

.tech-stack {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.tech-stack h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
}

.tech-stack ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tech-stack li {
  padding: 0.5rem 0;
  color: #666;
}

/* 通知样式 */
.notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #333;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .container {
    padding: 1.5rem;
  }

  .footer {
    flex-direction: column;
    align-items: stretch;
  }

  .stats {
    justify-content: space-around;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
