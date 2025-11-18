<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/stores/useTodoStore'
import type { Todo } from '@/types'

interface Props {
  todo: Todo
}

const props = defineProps<Props>()
const todoStore = useTodoStore()

const isEditing = ref(false)
const editText = ref(props.todo.text)

const handleToggle = () => {
  todoStore.toggleTodo(props.todo.id)
}

const handleRemove = () => {
  todoStore.removeTodo(props.todo.id)
}

const startEdit = () => {
  isEditing.value = true
  editText.value = props.todo.text
}

const saveEdit = () => {
  if (editText.value.trim()) {
    todoStore.updateTodo(props.todo.id, editText.value)
    isEditing.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = props.todo.text
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <div class="todo-content">
      <label class="checkbox-container">
        <input type="checkbox" :checked="todo.completed" @change="handleToggle" />
        <span class="checkmark"></span>
      </label>

      <div v-if="!isEditing" class="todo-text" @dblclick="startEdit">
        {{ todo.text }}
      </div>

      <input
        v-else
        v-model="editText"
        type="text"
        class="edit-input"
        @blur="saveEdit"
        @keydown="handleKeydown"
        autofocus
      />
    </div>

    <div class="todo-actions">
      <button v-if="!isEditing" @click="startEdit" class="edit-btn" title="編輯">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button @click="handleRemove" class="delete-btn" title="刪除">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="3 6 5 6 21 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.todo-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.checkbox-container {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  display: block;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.checkbox-container:hover .checkmark {
  border-color: #667eea;
}

.checkbox-container input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkbox-container input:checked ~ .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.todo-text {
  flex: 1;
  font-size: 1rem;
  color: #374151;
  word-break: break-word;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #9ca3af;
}

.edit-input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid #667eea;
  border-radius: 0.25rem;
  outline: none;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  color: #3b82f6;
}

.edit-btn:hover {
  background: #eff6ff;
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: #fef2f2;
}
</style>
