<template>
  <v-card elevation="0">
    <v-card-text class="pa-2">
      <v-btn-toggle
        :model-value="filter"
        @update:model-value="emit('update:filter', $event)"
        mandatory
        divided
        density="comfortable"
        color="primary"
        class="d-flex"
      >
        <v-btn value="all" class="flex-grow-1">
          <v-icon start>mdi-format-list-bulleted</v-icon>
          All
        </v-btn>
        <v-btn value="active" class="flex-grow-1">
          <v-icon start>mdi-clock-outline</v-icon>
          Active
        </v-btn>
        <v-btn value="completed" class="flex-grow-1">
          <v-icon start>mdi-check-circle</v-icon>
          Completed
        </v-btn>
      </v-btn-toggle>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { FilterType } from '../types'

defineProps<{
  filter: FilterType
}>()

const emit = defineEmits<{
  'update:filter': [filter: FilterType]
}>()
</script>
