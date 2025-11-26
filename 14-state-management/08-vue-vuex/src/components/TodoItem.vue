<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store'
import { Todo } from '../types'

// Props
const props = defineProps<{
  todo: Todo
}>()

const store = useStore()
const isEditing = ref(false)
const editText = ref('')

const toggleTodo = () => {
  // Dispatch action to toggle todo
  store.dispatch('toggleTodo', props.todo.id)
}

const startEdit = () => {
  isEditing.value = true
  editText.value = props.todo.text
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = ''
}

const saveEdit = () => {
  if (editText.value.trim()) {
    // Dispatch action to update todo
    store.dispatch('updateTodo', {
      id: props.todo.id,
      text: editText.value
    })
  }
  isEditing.value = false
}

const removeTodo = () => {
  // Dispatch action to remove todo
  store.dispatch('removeTodo', props.todo.id)
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div :class="['todo-item', { completed: todo.completed }]">
    <div v-if="!isEditing" class="todo-content">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="toggleTodo"
        class="todo-checkbox"
      />
      <span class="todo-text" @dblclick="startEdit">
        {{ todo.text }}
      </span>
      <div class="todo-actions">
        <button
          class="edit-button"
          @click="startEdit"
          title="Edit todo"
        >
          ✏️
        </button>
        <button
          class="delete-button"
          @click="removeTodo"
          title="Delete todo"
        >
          🗑️
        </button>
      </div>
    </div>

    <div v-else class="todo-edit">
      <input
        v-model="editText"
        type="text"
        class="edit-input"
        @keyup="handleKeyPress"
        @blur="saveEdit"
        autofocus
      />
      <div class="edit-actions">
        <button class="save-button" @click="saveEdit">Save</button>
        <button class="cancel-button" @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.todo-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.todo-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #667eea;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
  color: #2d3748;
  cursor: pointer;
  user-select: none;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #a0aec0;
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

.edit-button,
.delete-button {
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.edit-button:hover {
  background: #edf2f7;
}

.delete-button:hover {
  background: #fed7d7;
}

.todo-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid #667eea;
  border-radius: 4px;
  outline: none;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.save-button,
.cancel-button {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button {
  color: white;
  background: #667eea;
}

.save-button:hover {
  background: #5568d3;
}

.cancel-button {
  color: #4a5568;
  background: #e2e8f0;
}

.cancel-button:hover {
  background: #cbd5e0;
}
</style>
