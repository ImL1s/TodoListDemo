<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Edit, Delete, Check, Close } from '@element-plus/icons-vue'
import type { Todo } from '../types'

// ============================================================================
// Props 定義
// ============================================================================

const props = defineProps<{
  todo: Todo
}>()

// ============================================================================
// 事件定義
// ============================================================================

const emit = defineEmits<{
  toggle: []
  delete: []
  edit: [text: string]
}>()

// ============================================================================
// 狀態管理
// ============================================================================

const isEditing = ref<boolean>(false)
const editText = ref<string>('')

// ============================================================================
// 計算屬性
// ============================================================================

/**
 * 格式化創建時間
 */
const formattedDate = computed<string>(() => {
  const date = new Date(props.todo.createdAt)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

/**
 * 獲取待辦事項狀態類型
 */
const statusType = computed<'success' | 'info'>(() => {
  return props.todo.completed ? 'success' : 'info'
})

// ============================================================================
// 方法
// ============================================================================

/**
 * 開始編輯
 */
const startEdit = (): void => {
  isEditing.value = true
  editText.value = props.todo.text
}

/**
 * 保存編輯
 */
const saveEdit = (): void => {
  const text = editText.value.trim()

  if (!text) {
    cancelEdit()
    return
  }

  if (text !== props.todo.text) {
    emit('edit', text)
  }

  isEditing.value = false
}

/**
 * 取消編輯
 */
const cancelEdit = (): void => {
  isEditing.value = false
  editText.value = ''
}

/**
 * 處理刪除確認
 */
const handleDelete = async (): Promise<void> => {
  try {
    await ElMessageBox.confirm(
      '確定要刪除這個待辦事項嗎？',
      '刪除確認',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    emit('delete')
  } catch {
    // 用戶取消刪除
  }
}

/**
 * 處理 Enter 鍵
 */
const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    saveEdit()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div
    class="todo-item"
    :class="{ completed: todo.completed, editing: isEditing }"
  >
    <div class="todo-content">
      <!-- 複選框 -->
      <el-checkbox
        :model-value="todo.completed"
        @change="emit('toggle')"
        size="large"
        class="todo-checkbox"
      />

      <!-- 待辦事項文字或編輯輸入框 -->
      <div class="todo-text-wrapper">
        <el-input
          v-if="isEditing"
          v-model="editText"
          size="large"
          autofocus
          @keyup="handleKeyPress"
          class="edit-input"
        />
        <div v-else class="todo-text" @dblclick="startEdit">
          {{ todo.text }}
        </div>

        <!-- 創建時間 -->
        <div class="todo-meta">
          <el-icon><Calendar /></el-icon>
          <span>{{ formattedDate }}</span>
        </div>
      </div>

      <!-- 狀態標籤 -->
      <el-tag
        :type="statusType"
        effect="dark"
        size="small"
        class="status-tag"
      >
        {{ todo.completed ? '已完成' : '進行中' }}
      </el-tag>
    </div>

    <!-- 操作按鈕 -->
    <div class="todo-actions">
      <!-- 編輯模式按鈕 -->
      <template v-if="isEditing">
        <el-button
          type="success"
          :icon="Check"
          circle
          @click="saveEdit"
          title="保存"
        />
        <el-button
          type="info"
          :icon="Close"
          circle
          @click="cancelEdit"
          title="取消"
        />
      </template>

      <!-- 正常模式按鈕 -->
      <template v-else>
        <el-button
          type="primary"
          :icon="Edit"
          circle
          @click="startEdit"
          title="編輯"
        />
        <el-button
          type="danger"
          :icon="Delete"
          circle
          @click="handleDelete"
          title="刪除"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================================
   待辦事項項目樣式
   ============================================================================ */
.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  gap: 16px;
}

.dark .todo-item {
  background: rgba(255, 255, 255, 0.05);
}

.todo-item:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: #409eff;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.dark .todo-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.todo-item.editing {
  background: rgba(64, 158, 255, 0.05);
  border-color: #409eff;
}

.todo-item.completed {
  opacity: 0.7;
}

/* ============================================================================
   內容樣式
   ============================================================================ */
.todo-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.todo-checkbox {
  flex-shrink: 0;
}

.todo-text-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-text {
  font-size: 16px;
  line-height: 1.5;
  color: #303133;
  word-break: break-word;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s ease;
}

.dark .todo-text {
  color: #e0e0e0;
}

.todo-text:hover {
  color: #409eff;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #909399;
}

.edit-input {
  width: 100%;
}

/* ============================================================================
   元數據樣式
   ============================================================================ */
.todo-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #909399;
}

.todo-meta .el-icon {
  font-size: 14px;
}

/* ============================================================================
   狀態標籤樣式
   ============================================================================ */
.status-tag {
  flex-shrink: 0;
  font-weight: 600;
}

/* ============================================================================
   操作按鈕樣式
   ============================================================================ */
.todo-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* ============================================================================
   響應式設計
   ============================================================================ */
@media (max-width: 768px) {
  .todo-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .todo-content {
    flex-wrap: wrap;
  }

  .todo-actions {
    justify-content: flex-end;
  }

  .status-tag {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .todo-item {
    padding: 12px;
  }

  .todo-text {
    font-size: 14px;
  }

  .todo-meta {
    font-size: 12px;
  }

  .todo-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>
