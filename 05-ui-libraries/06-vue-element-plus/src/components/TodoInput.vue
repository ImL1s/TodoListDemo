<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// ============================================================================
// 事件定義
// ============================================================================

const emit = defineEmits<{
  addTodo: [text: string]
}>()

// ============================================================================
// 狀態管理
// ============================================================================

const inputValue = ref<string>('')

// ============================================================================
// 方法
// ============================================================================

/**
 * 處理添加待辦事項
 */
const handleAdd = (): void => {
  const text = inputValue.value.trim()

  if (!text) {
    ElMessage({
      message: '請輸入待辦事項內容',
      type: 'warning',
      duration: 2000
    })
    return
  }

  if (text.length < 2) {
    ElMessage({
      message: '待辦事項內容至少需要 2 個字符',
      type: 'warning',
      duration: 2000
    })
    return
  }

  if (text.length > 200) {
    ElMessage({
      message: '待辦事項內容不能超過 200 個字符',
      type: 'warning',
      duration: 2000
    })
    return
  }

  emit('addTodo', text)
  inputValue.value = ''
}

/**
 * 處理 Enter 鍵
 */
const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    handleAdd()
  }
}
</script>

<template>
  <div class="todo-input">
    <el-input
      v-model="inputValue"
      placeholder="請輸入新的待辦事項..."
      size="large"
      clearable
      maxlength="200"
      show-word-limit
      @keypress="handleKeyPress"
      class="input-field"
    >
      <template #prefix>
        <el-icon><Edit /></el-icon>
      </template>
    </el-input>

    <el-button
      type="primary"
      size="large"
      @click="handleAdd"
      :icon="Plus"
      class="add-button"
    >
      添加
    </el-button>
  </div>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.input-field {
  flex: 1;
}

.add-button {
  flex-shrink: 0;
  min-width: 100px;
  font-weight: 600;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .todo-input {
    flex-direction: column;
  }

  .add-button {
    width: 100%;
  }
}
</style>
