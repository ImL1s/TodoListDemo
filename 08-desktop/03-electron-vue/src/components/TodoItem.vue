<template>
  <div :class="['todo-item', { completed: todo.completed, editing: isEditing }]">
    <div class="todo-content">
      <!-- 复选框 -->
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('toggle', todo.id)"
        class="todo-checkbox"
      />

      <!-- 文本显示/编辑 -->
      <div v-if="!isEditing" class="todo-text" @dblclick="startEdit">
        {{ todo.text }}
      </div>
      <input
        v-else
        ref="editInputRef"
        v-model="editText"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
        class="todo-edit-input"
      />

      <!-- 操作按钮 -->
      <div class="todo-actions">
        <button v-if="!isEditing" @click="startEdit" class="edit-btn" title="编辑">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button @click="handleDelete" class="delete-btn" title="删除">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 元数据 -->
    <div class="todo-meta">
      <span class="created-date">创建于: {{ formattedDate }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import type { Todo } from '../types';

// Props
const props = defineProps<{
  todo: Todo;
}>();

// Emits
const emit = defineEmits<{
  (e: 'toggle', id: number): void;
  (e: 'delete', id: number): void;
  (e: 'edit', payload: { id: number; text: string }): void;
}>();

// 响应式状态
const isEditing = ref(false);
const editText = ref('');
const editInputRef = ref<HTMLInputElement | null>(null);

// 计算属性
const formattedDate = computed(() => {
  return new Date(props.todo.createdAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
});

// 开始编辑
async function startEdit() {
  isEditing.value = true;
  editText.value = props.todo.text;
  await nextTick();
  editInputRef.value?.focus();
  editInputRef.value?.select();
}

// 保存编辑
function saveEdit() {
  const text = editText.value.trim();
  if (text && text !== props.todo.text) {
    emit('edit', { id: props.todo.id, text });
  }
  isEditing.value = false;
}

// 取消编辑
function cancelEdit() {
  isEditing.value = false;
  editText.value = '';
}

// 删除
function handleDelete() {
  if (confirm('确定要删除这个待办事项吗？')) {
    emit('delete', props.todo.id);
  }
}
</script>

<style scoped>
.todo-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  transition: all 0.3s;
}

.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.todo-item.completed {
  opacity: 0.7;
  background: #f9f9f9;
}

.todo-item.editing {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
  color: #333;
  word-break: break-word;
  cursor: pointer;
  padding: 0.25rem 0;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.todo-edit-input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #667eea;
  border-radius: 4px;
  outline: none;
  font-family: inherit;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.edit-btn,
.delete-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.edit-btn {
  background: #e3f2fd;
  color: #1976d2;
}

.edit-btn:hover {
  background: #bbdefb;
}

.delete-btn {
  background: #ffebee;
  color: #d32f2f;
}

.delete-btn:hover {
  background: #ffcdd2;
}

.edit-btn svg,
.delete-btn svg {
  width: 18px;
  height: 18px;
}

.todo-meta {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.created-date {
  font-size: 0.8rem;
  color: #999;
}

@media (max-width: 768px) {
  .todo-item {
    padding: 0.875rem;
  }

  .todo-content {
    gap: 0.75rem;
  }

  .todo-text {
    font-size: 0.95rem;
  }

  .todo-actions {
    opacity: 1;
  }
}
</style>
