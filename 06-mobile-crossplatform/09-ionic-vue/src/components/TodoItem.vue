<template>
  <ion-item-sliding>
    <ion-item :class="{ 'completed': todo.completed }" lines="full">
      <ion-checkbox
        slot="start"
        :checked="todo.completed"
        @ionChange="handleToggle"
        :color="todo.completed ? 'success' : 'primary'"
      ></ion-checkbox>

      <ion-label>
        <h2 :class="{ 'completed-text': todo.completed }">{{ todo.text }}</h2>
        <p class="timestamp">
          <ion-icon :icon="timeOutline" size="small"></ion-icon>
          {{ formattedDate }}
        </p>
      </ion-label>

      <ion-icon
        v-if="todo.completed"
        slot="end"
        :icon="checkmarkCircle"
        color="success"
        size="small"
      ></ion-icon>
    </ion-item>

    <ion-item-options side="end">
      <ion-item-option color="danger" @click="handleDelete">
        <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonCheckbox,
  IonIcon
} from '@ionic/vue'
import {
  checkmarkCircle,
  trashOutline,
  timeOutline
} from 'ionicons/icons'
import type { Todo } from '@/types'
import { useHaptics } from '@/composables'

// Props
const props = defineProps<{
  todo: Todo
}>()

// Emits
const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'delete'): void
}>()

// Composables
const haptics = useHaptics()

// Handlers
const handleToggle = async () => {
  await haptics.selectionChanged()
  emit('toggle')
}

const handleDelete = async () => {
  await haptics.mediumImpact()
  emit('delete')
}

// Computed
const formattedDate = computed(() => {
  const date = new Date(props.todo.createdAt)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
})
</script>

<style scoped>
ion-item {
  --padding-start: 8px;
  --padding-end: 8px;
  --min-height: 60px;
  margin-bottom: 8px;
  border-radius: 8px;
}

ion-item.completed {
  opacity: 0.7;
}

ion-label h2 {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: var(--ion-color-dark);
}

.completed-text {
  text-decoration: line-through;
  color: var(--ion-color-medium);
}

.timestamp {
  font-size: 12px;
  color: var(--ion-color-medium);
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
}

.timestamp ion-icon {
  font-size: 14px;
}

ion-item-option {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Smooth transitions */
ion-item {
  transition: all 0.3s ease;
}

ion-checkbox {
  margin-right: 12px;
}
</style>
