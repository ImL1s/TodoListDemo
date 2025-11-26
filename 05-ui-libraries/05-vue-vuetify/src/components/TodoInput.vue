<template>
  <v-card elevation="2">
    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-row no-gutters align="center">
          <v-col cols="12" sm="9">
            <v-text-field
              v-model="text"
              label="What needs to be done?"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              autofocus
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" class="pl-sm-2 mt-2 mt-sm-0">
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :disabled="!text.trim()"
              prepend-icon="mdi-plus"
            >
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  add: [text: string]
}>()

const text = ref('')

const handleSubmit = () => {
  if (text.value.trim()) {
    emit('add', text.value.trim())
    text.value = ''
  }
}
</script>
