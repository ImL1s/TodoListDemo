<template>
  <li
    :class="['todo-item', { checked: todo.completed }]"
    @click="$emit('toggle', todo.id)"
  >
    <span class="todo-text">{{ todo.text }}</span>
    <span
      class="close"
      @click.stop="$emit('delete', todo.id)"
    >
      ×
    </span>
  </li>
</template>

<script setup>
// 定義 props
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

// 定義 emits
defineEmits(['toggle', 'delete'])
</script>

<style scoped>
.todo-item {
  cursor: pointer;
  position: relative;
  padding: 16px 16px 16px 50px;
  background: #fff;
  font-size: 18px;
  transition: 0.2s;
  border-bottom: 1px solid #f0f0f0;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:nth-child(odd) {
  background: #f9f9f9;
}

.todo-item:hover {
  background: #ddd;
}

.todo-item.checked {
  background: #888;
  color: #fff;
}

.todo-item.checked:hover {
  background: #777;
}

.todo-item.checked .todo-text {
  text-decoration: line-through;
}

.todo-item.checked::before {
  content: '';
  position: absolute;
  border-color: #fff;
  border-style: solid;
  border-width: 0 2px 2px 0;
  top: 18px;
  left: 20px;
  transform: rotate(45deg);
  height: 18px;
  width: 9px;
}

.todo-text {
  flex: 1;
  text-align: left;
}

.close {
  color: #999;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  padding: 0 10px;
}

.close:hover {
  color: #f44336;
  transform: scale(1.2);
}

.todo-item.checked .close {
  color: #fff;
}

.todo-item.checked .close:hover {
  color: #ff6b6b;
}

@media (max-width: 600px) {
  .todo-item {
    padding: 14px 14px 14px 45px;
    font-size: 16px;
  }

  .todo-item.checked::before {
    top: 16px;
    left: 18px;
    height: 16px;
    width: 8px;
  }
}
</style>
