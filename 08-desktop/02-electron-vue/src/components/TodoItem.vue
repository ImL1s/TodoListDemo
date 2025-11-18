<template>
  <div class="todo-item" :class="{ completed: todo.completed, editing: isEditing }">
    <div class="view">
      <input
        class="toggle"
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('toggle', todo.id)"
      />
      <label @dblclick="startEdit">{{ todo.text }}</label>
      <button class="destroy" @click="$emit('delete', todo.id)" title="Delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <input
      v-if="isEditing"
      ref="editInput"
      v-model="editText"
      class="edit"
      type="text"
      @blur="finishEdit"
      @keyup.enter="finishEdit"
      @keyup.esc="cancelEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Todo } from '../types'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  update: [id: string, text: string]
}>()

const isEditing = ref(false)
const editText = ref('')
const editInput = ref<HTMLInputElement | null>(null)

const startEdit = () => {
  isEditing.value = true
  editText.value = props.todo.text
  nextTick(() => {
    editInput.value?.focus()
    editInput.value?.select()
  })
}

const finishEdit = () => {
  if (isEditing.value) {
    const trimmed = editText.value.trim()
    if (trimmed) {
      emit('update', props.todo.id, trimmed)
    } else {
      emit('delete', props.todo.id)
    }
    isEditing.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = props.todo.text
}
</script>

<style scoped>
.todo-item {
  position: relative;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 12px 16px;
  border: 2px solid transparent;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.todo-item:hover {
  border-color: #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.view {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.toggle {
  width: 22px;
  height: 22px;
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
}

.todo-item label {
  flex: 1;
  font-size: 16px;
  line-height: 1.5;
  cursor: pointer;
  word-break: break-word;
  user-select: none;
}

.completed label {
  color: #999;
  text-decoration: line-through;
}

.destroy {
  opacity: 0;
  width: 32px;
  height: 32px;
  border: none;
  background: #ff6b6b;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
}

.todo-item:hover .destroy {
  opacity: 1;
}

.destroy:hover {
  background: #ff5252;
  transform: scale(1.1);
}

.edit {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #42b983;
  border-radius: 6px;
  outline: none;
}

.editing .view {
  display: none;
}
</style>
