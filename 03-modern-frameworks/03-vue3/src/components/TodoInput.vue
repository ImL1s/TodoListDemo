<template>
  <div class="header">
    <h2>
      任務清單 <span class="tech-badge">Vue 3</span>
    </h2>
    <div class="input-container">
      <input
        v-model="inputValue"
        @keydown.enter="handleAdd"
        type="text"
        placeholder="請輸入任務"
        class="todo-input"
      />
      <button @click="handleAdd" class="add-btn">
        添加
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 定義 emits
const emit = defineEmits(['add'])

// 響應式數據
const inputValue = ref('')

// 處理添加
const handleAdd = () => {
  const trimmed = inputValue.value.trim()

  if (!trimmed) {
    alert('請先輸入一個具體任務。')
    return
  }

  emit('add', trimmed)
  inputValue.value = ''
}
</script>

<style scoped>
.header {
  background-color: #f44336;
  padding: 30px 40px;
  color: white;
  text-align: center;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h2 {
  margin-bottom: 20px;
  font-size: 28px;
}

.tech-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: normal;
  margin-left: 10px;
}

.input-container {
  display: flex;
  gap: 0;
}

.todo-input {
  flex: 1;
  border: none;
  padding: 12px;
  font-size: 16px;
  outline: none;
  border-radius: 4px 0 0 4px;
  font-family: inherit;
}

.todo-input:focus {
  background: #f0f0f0;
}

.add-btn {
  padding: 12px 20px;
  background: #d9d9d9;
  color: #555;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 0 4px 4px 0;
  font-family: inherit;
  user-select: none;
}

.add-btn:hover {
  background-color: #bbb;
}

.add-btn:active {
  transform: scale(0.98);
}

@media (max-width: 600px) {
  .header {
    padding: 20px 20px;
  }

  .header h2 {
    font-size: 22px;
  }

  .todo-input {
    font-size: 14px;
  }

  .add-btn {
    font-size: 14px;
    padding: 12px 15px;
  }
}
</style>
