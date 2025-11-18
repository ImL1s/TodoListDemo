<script setup lang="ts">
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'
import type { Todo, FilterType } from '../types'

// ============================================================================
// Props 定義
// ============================================================================

const props = defineProps<{
  todos: Todo[]
  filter: FilterType
}>()

// ============================================================================
// 事件定義
// ============================================================================

const emit = defineEmits<{
  toggleTodo: [id: number]
  deleteTodo: [id: number]
  editTodo: [id: number, text: string]
}>()

// ============================================================================
// 計算屬性
// ============================================================================

/**
 * 獲取空狀態描述文字
 */
const emptyDescription = computed<string>(() => {
  switch (props.filter) {
    case 'active':
      return '目前沒有進行中的待辦事項'
    case 'completed':
      return '目前沒有已完成的待辦事項'
    default:
      return '還沒有任何待辦事項，開始添加一個吧！'
  }
})

/**
 * 獲取空狀態圖標
 */
const emptyIcon = computed<string>(() => {
  switch (props.filter) {
    case 'active':
      return 'Cpu'
    case 'completed':
      return 'Trophy'
    default:
      return 'Document'
  }
})
</script>

<template>
  <div class="todo-list">
    <!-- 待辦事項列表 -->
    <el-card
      v-if="todos.length > 0"
      class="list-card"
      shadow="hover"
    >
      <div class="list-header">
        <h3 class="list-title">
          <el-icon><List /></el-icon>
          待辦事項列表
        </h3>
        <el-tag type="info" size="large">
          共 {{ todos.length }} 項
        </el-tag>
      </div>

      <div class="todo-items">
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          @toggle="emit('toggleTodo', todo.id)"
          @delete="emit('deleteTodo', todo.id)"
          @edit="(text) => emit('editTodo', todo.id, text)"
        />
      </div>
    </el-card>

    <!-- 空狀態 -->
    <el-card
      v-else
      class="empty-card"
      shadow="hover"
    >
      <el-empty :description="emptyDescription">
        <template #image>
          <el-icon :size="80" class="empty-icon">
            <component :is="emptyIcon" />
          </el-icon>
        </template>
      </el-empty>
    </el-card>
  </div>
</template>

<style scoped>
.todo-list {
  width: 100%;
}

.list-card,
.empty-card {
  border-radius: 12px;
  border: none;
}

.dark .list-card,
.dark .empty-card {
  background-color: #1e1e1e;
}

/* ============================================================================
   列表頭部樣式
   ============================================================================ */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.dark .list-header {
  border-bottom-color: #333;
}

.list-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dark .list-title {
  color: #e0e0e0;
}

/* ============================================================================
   待辦事項項目樣式
   ============================================================================ */
.todo-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ============================================================================
   空狀態樣式
   ============================================================================ */
.empty-card {
  padding: 60px 20px;
}

.empty-icon {
  color: #909399;
  opacity: 0.5;
}

:deep(.el-empty__description) {
  font-size: 16px;
  color: #909399;
  margin-top: 20px;
}

/* ============================================================================
   響應式設計
   ============================================================================ */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .list-title {
    font-size: 18px;
  }
}
</style>
