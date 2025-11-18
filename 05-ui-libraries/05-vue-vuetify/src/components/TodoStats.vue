<template>
  <v-row>
    <v-col cols="12" sm="4">
      <v-card color="primary" variant="tonal" elevation="0">
        <v-card-text class="text-center">
          <v-icon size="32" class="mb-2">mdi-format-list-checks</v-icon>
          <div class="text-h4 font-weight-bold">{{ total }}</div>
          <div class="text-body-2 text-uppercase">Total Tasks</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="4">
      <v-card color="warning" variant="tonal" elevation="0">
        <v-card-text class="text-center">
          <v-icon size="32" class="mb-2">mdi-clock-outline</v-icon>
          <div class="text-h4 font-weight-bold">{{ active }}</div>
          <div class="text-body-2 text-uppercase">Active</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="4">
      <v-card color="success" variant="tonal" elevation="0">
        <v-card-text class="text-center">
          <v-icon size="32" class="mb-2">mdi-check-circle</v-icon>
          <div class="text-h4 font-weight-bold">{{ completed }}</div>
          <div class="text-body-2 text-uppercase">Completed</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- Progress Bar -->
  <v-card v-if="total > 0" class="mt-4" elevation="0">
    <v-card-text>
      <div class="d-flex justify-space-between mb-2">
        <span class="text-body-2 font-weight-medium">Progress</span>
        <span class="text-body-2 font-weight-bold">{{ percentage }}%</span>
      </div>
      <v-progress-linear
        :model-value="percentage"
        :color="progressColor"
        height="8"
        rounded
      ></v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  completed: number
  active: number
}>()

const percentage = computed(() => {
  return props.total === 0 ? 0 : Math.round((props.completed / props.total) * 100)
})

const progressColor = computed(() => {
  if (percentage.value === 100) return 'success'
  if (percentage.value >= 50) return 'info'
  return 'warning'
})
</script>
