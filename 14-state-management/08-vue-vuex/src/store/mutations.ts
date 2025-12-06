// @ts-nocheck
import { MutationTree } from 'vuex'
import { RootState } from './index'
import { Todo, FilterType } from '../types'
import * as types from './mutation-types'

// Mutations must be synchronous
// They are the only way to change state in Vuex
const mutations: MutationTree<RootState> = {
  // Add a new todo
  [types.ADD_TODO](state, text: string) {
    const newTodo: Todo = {
      id: state.nextId++,
      text,
      completed: false,
      createdAt: new Date()
    }
    state.todos.push(newTodo)
  },

  // Remove a todo by id
  [types.REMOVE_TODO](state, id: number) {
    const index = state.todos.findIndex(todo => todo.id === id)
    if (index !== -1) {
      state.todos.splice(index, 1)
    }
  },

  // Toggle todo completion status
  [types.TOGGLE_TODO](state, id: number) {
    const todo = state.todos.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  },

  // Update todo text
  [types.UPDATE_TODO](state, payload: { id: number; text: string }) {
    const todo = state.todos.find(todo => todo.id === payload.id)
    if (todo) {
      todo.text = payload.text
    }
  },

  // Set the current filter
  [types.SET_FILTER](state, filter: FilterType) {
    state.filter = filter
  },

  // Remove all completed todos
  [types.CLEAR_COMPLETED](state) {
    state.todos = state.todos.filter(todo => !todo.completed)
  },

  // Restore state from localStorage (used by persistence plugin)
  [types.RESTORE_STATE](state, savedState: Partial<RootState>) {
    if (savedState.todos) {
      // Convert date strings back to Date objects
      state.todos = savedState.todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }))
    }
    if (savedState.filter) {
      state.filter = savedState.filter
    }
    if (savedState.nextId) {
      state.nextId = savedState.nextId
    }
  }
}

export default mutations
