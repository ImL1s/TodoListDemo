<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '../stores/useTodoStore'
import type { Todo } from '../types'

const props = defineProps<{
  todo: Todo
}>()

const todoStore = useTodoStore()
const isEditing = ref(false)
const editText = ref(props.todo.text)

const startEdit = () => {
  isEditing.value = true
  editText.value = props.todo.text
}

const saveEdit = () => {
  if (editText.value.trim()) {
    todoStore.updateTodo(props.todo.id, editText.value)
    isEditing.value = false
  } else {
    cancelEdit()
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = props.todo.text
}

const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <li class="todo-item" :class="{ completed: todo.completed, editing: isEditing }">
    <div v-if="!isEditing" class="todo-content">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="todoStore.toggleTodo(todo.id)"
        class="todo-checkbox"
      />
      <span class="todo-text" @dblclick="startEdit">
        {{ todo.text }}
      </span>
      <div class="todo-actions">
        <button @click="startEdit" class="edit-btn" title="編輯">
          ✏️
        </button>
        <button @click="todoStore.removeTodo(todo.id)" class="delete-btn" title="刪除">
          🗑️
        </button>
      </div>
    </div>

    <div v-else class="edit-content">
      <input
        v-model="editText"
        type="text"
        class="edit-input"
        @blur="saveEdit"
        @keyup="handleKeyup"
        ref="editInput"
      />
      <div class="edit-actions">
        <button @click="saveEdit" class="save-btn">✓</button>
        <button @click="cancelEdit" class="cancel-btn">✕</button>
      </div>
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.todo-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.todo-item.completed {
  opacity: 0.6;
  background: #f7fafc;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.todo-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #42b883;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
}

.completed .todo-text {
  text-decoration: line-through;
  color: #a0aec0;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.25rem 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s;
}

.edit-btn:hover,
.delete-btn:hover {
  transform: scale(1.2);
}

.edit-content {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.edit-input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid #42b883;
  border-radius: 0.25rem;
  outline: none;
}

.edit-actions {
  display: flex;
  gap: 0.25rem;
}

.save-btn,
.cancel-btn {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: bold;
}

.save-btn {
  background: #42b883;
  color: white;
}

.save-btn:hover {
  background: #35a372;
}

.cancel-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.cancel-btn:hover {
  background: #cbd5e0;
}
</style>
