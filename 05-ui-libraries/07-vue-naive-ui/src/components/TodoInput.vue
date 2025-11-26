<script setup lang="ts">
import { ref } from 'vue'
import { NInput, NButton, NSpace, NIcon } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'

// Emits
const emit = defineEmits<{
  addTodo: [text: string]
}>()

// State
const inputValue = ref('')

// Handle adding todo
const handleAdd = () => {
  const trimmedValue = inputValue.value.trim()

  if (trimmedValue) {
    emit('addTodo', trimmedValue)
    inputValue.value = ''
  }
}

// Handle Enter key
const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleAdd()
  }
}
</script>

<template>
  <n-space>
    <n-input
      v-model:value="inputValue"
      placeholder="What needs to be done?"
      size="large"
      clearable
      @keyup="handleKeyup"
      style="flex: 1"
    >
      <template #prefix>
        <n-icon :component="AddOutline" />
      </template>
    </n-input>
    <n-button
      type="primary"
      size="large"
      :disabled="!inputValue.trim()"
      @click="handleAdd"
      style="min-width: 100px"
    >
      Add Task
    </n-button>
  </n-space>
</template>

<style scoped>
.n-space {
  width: 100%;
}
</style>
