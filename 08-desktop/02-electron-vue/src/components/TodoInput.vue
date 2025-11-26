<template>
  <div class="todo-input">
    <input
      ref="inputRef"
      v-model="inputValue"
      type="text"
      class="new-todo"
      placeholder="What needs to be done?"
      @keyup.enter="handleSubmit"
      autofocus
    />
    <button
      v-if="inputValue"
      class="add-btn"
      @click="handleSubmit"
      title="Add todo (Enter)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  add: [text: string]
}>()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const handleSubmit = () => {
  if (inputValue.value.trim()) {
    emit('add', inputValue.value)
    inputValue.value = ''
  }
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<style scoped>
.todo-input {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.new-todo {
  flex: 1;
  padding: 16px 50px 16px 16px;
  font-size: 18px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
  background: white;
}

.new-todo:focus {
  border-color: #42b983;
}

.new-todo::placeholder {
  color: #aaa;
  font-style: italic;
}

.add-btn {
  position: absolute;
  right: 8px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: #42b983;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #359268;
}

.add-btn svg {
  width: 20px;
  height: 20px;
}
</style>
