<template>
  <v-app>
    <v-app-bar color="primary" elevation="4">
      <template v-slot:prepend>
        <v-icon size="large" class="ml-4">mdi-check-circle</v-icon>
      </template>
      <v-app-bar-title class="text-h5 font-weight-bold">
        Vuetify Todo List
      </v-app-bar-title>
      <template v-slot:append>
        <v-btn icon @click="toggleTheme">
          <v-icon>{{ theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container class="py-8">
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <!-- Statistics -->
            <TodoStats
              :total="todos.length"
              :completed="completedCount"
              :active="activeCount"
            />

            <!-- Input -->
            <TodoInput @add="addTodo" class="mt-6" />

            <!-- Filter Buttons -->
            <FilterButtons
              :filter="filter"
              @update:filter="filter = $event"
              class="mt-6"
            />

            <!-- Todo List -->
            <TodoList
              :todos="filteredTodos"
              @toggle="toggleTodo"
              @delete="deleteTodo"
              class="mt-6"
            />

            <!-- Clear Completed Button -->
            <v-card v-if="completedCount > 0" class="mt-4" elevation="0">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="error"
                  variant="outlined"
                  @click="clearCompleted"
                  prepend-icon="mdi-delete-sweep"
                >
                  Clear Completed ({{ completedCount }})
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import type { Todo, FilterType } from './types'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import TodoStats from './components/TodoStats.vue'
import FilterButtons from './components/FilterButtons.vue'

const theme = useTheme()
const todos = ref<Todo[]>([
  { id: 1, text: 'Learn Vue 3 Composition API', completed: true, createdAt: new Date() },
  { id: 2, text: 'Explore Vuetify components', completed: false, createdAt: new Date() },
  { id: 3, text: 'Build an awesome app', completed: false, createdAt: new Date() },
])
const filter = ref<FilterType>('all')

const completedCount = computed(() => todos.value.filter(todo => todo.completed).length)
const activeCount = computed(() => todos.value.filter(todo => !todo.completed).length)

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const addTodo = (text: string) => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date(),
  }
  todos.value.push(newTodo)
}

const toggleTodo = (id: number) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

const deleteTodo = (id: number) => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
  }
}

const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.completed)
}

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
