<template>
  <ion-card class="todo-input-card">
    <ion-card-content>
      <form @submit.prevent="handleSubmit">
        <ion-item lines="none" class="input-item">
          <ion-input
            v-model="inputText"
            placeholder="What needs to be done?"
            :clear-input="true"
            @ionFocus="handleFocus"
            @ionBlur="handleBlur"
          ></ion-input>
          <ion-button
            slot="end"
            :disabled="!inputText.trim()"
            @click="handleSubmit"
            color="primary"
          >
            <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </form>
      <p v-if="isFocused" class="input-hint">
        <ion-icon :icon="informationCircleOutline"></ion-icon>
        Press Enter or tap + to add
      </p>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/vue'
import { addCircleOutline, informationCircleOutline } from 'ionicons/icons'
import { useHaptics } from '@/composables'

// Emits
const emit = defineEmits<{
  (e: 'add-todo', text: string): void
}>()

// Composables
const haptics = useHaptics()

// State
const inputText = ref('')
const isFocused = ref(false)

// Methods
const handleSubmit = async () => {
  const text = inputText.value.trim()
  if (text) {
    await haptics.lightImpact()
    emit('add-todo', text)
    inputText.value = ''
  }
}

const handleFocus = async () => {
  isFocused.value = true
  await haptics.selectionStart()
}

const handleBlur = async () => {
  isFocused.value = false
  await haptics.selectionEnd()
}
</script>

<style scoped>
.todo-input-card {
  margin: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.input-item {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-end: 0;
}

.input-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--ion-color-medium);
  display: flex;
  align-items: center;
  gap: 4px;
}

.input-hint ion-icon {
  font-size: 16px;
}
</style>
