<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NCard,
  NSpace,
  NCheckbox,
  NButton,
  NInput,
  NIcon,
  NModal,
  NText,
  useMessage
} from 'naive-ui'
import {
  CreateOutline,
  TrashOutline,
  CheckmarkOutline,
  CloseOutline,
  TimeOutline
} from '@vicons/ionicons5'
import type { Todo } from '../types'

// Props
interface Props {
  todo: Todo
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  edit: [id: string, newText: string]
}>()

// Message API
const message = useMessage()

// State
const isEditing = ref(false)
const editValue = ref('')
const showDeleteModal = ref(false)

// Computed formatted date
const formattedDate = computed(() => {
  const date = new Date(props.todo.createdAt)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Handle toggle
const handleToggle = () => {
  emit('toggle', props.todo.id)
}

// Start editing
const startEdit = () => {
  editValue.value = props.todo.text
  isEditing.value = true
}

// Cancel editing
const cancelEdit = () => {
  isEditing.value = false
  editValue.value = ''
}

// Save edit
const saveEdit = () => {
  const trimmedValue = editValue.value.trim()

  if (!trimmedValue) {
    message.warning('Task text cannot be empty')
    return
  }

  if (trimmedValue === props.todo.text) {
    cancelEdit()
    return
  }

  emit('edit', props.todo.id, trimmedValue)
  isEditing.value = false
  editValue.value = ''
}

// Handle delete confirmation
const handleDeleteClick = () => {
  showDeleteModal.value = true
}

// Confirm delete
const confirmDelete = () => {
  emit('delete', props.todo.id)
  showDeleteModal.value = false
}

// Handle Enter key in edit mode
const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <n-card
    size="small"
    :bordered="true"
    :class="{ 'completed-todo': todo.completed }"
    class="todo-item-card"
  >
    <n-space justify="space-between" align="center" :wrap="false">
      <!-- Checkbox and Text -->
      <n-space align="center" :wrap="false" style="flex: 1; min-width: 0">
        <n-checkbox
          :checked="todo.completed"
          @update:checked="handleToggle"
          size="large"
        />

        <div style="flex: 1; min-width: 0">
          <div v-if="!isEditing" style="display: flex; flex-direction: column; gap: 4px">
            <n-text
              :type="todo.completed ? 'default' : undefined"
              :depth="todo.completed ? 3 : undefined"
              :class="{ 'completed-text': todo.completed }"
              style="word-break: break-word; font-size: 15px"
            >
              {{ todo.text }}
            </n-text>
            <n-text depth="3" style="font-size: 12px; display: flex; align-items: center; gap: 4px">
              <n-icon :component="TimeOutline" size="14" />
              {{ formattedDate }}
            </n-text>
          </div>

          <n-input
            v-else
            v-model:value="editValue"
            placeholder="Edit task..."
            size="small"
            @keyup="handleKeyup"
            autofocus
          />
        </div>
      </n-space>

      <!-- Action Buttons -->
      <n-space :size="8" :wrap="false">
        <template v-if="!isEditing">
          <n-button
            size="small"
            secondary
            type="info"
            @click="startEdit"
            :disabled="todo.completed"
          >
            <template #icon>
              <n-icon :component="CreateOutline" />
            </template>
          </n-button>

          <n-button
            size="small"
            secondary
            type="error"
            @click="handleDeleteClick"
          >
            <template #icon>
              <n-icon :component="TrashOutline" />
            </template>
          </n-button>
        </template>

        <template v-else>
          <n-button
            size="small"
            type="success"
            @click="saveEdit"
          >
            <template #icon>
              <n-icon :component="CheckmarkOutline" />
            </template>
          </n-button>

          <n-button
            size="small"
            @click="cancelEdit"
          >
            <template #icon>
              <n-icon :component="CloseOutline" />
            </template>
          </n-button>
        </template>
      </n-space>
    </n-space>

    <!-- Delete Confirmation Modal -->
    <n-modal
      v-model:show="showDeleteModal"
      preset="dialog"
      title="Delete Task"
      content="Are you sure you want to delete this task? This action cannot be undone."
      positive-text="Delete"
      negative-text="Cancel"
      @positive-click="confirmDelete"
    />
  </n-card>
</template>

<style scoped>
.todo-item-card {
  transition: all 0.3s ease;
}

.todo-item-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.completed-todo {
  opacity: 0.7;
}

.completed-text {
  text-decoration: line-through;
}
</style>
