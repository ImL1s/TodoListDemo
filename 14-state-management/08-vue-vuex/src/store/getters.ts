// @ts-nocheck
import { GetterTree } from 'vuex'
import { RootState } from './index'
import { Todo } from '../types'

// Getters are like computed properties for stores
// They can be used to derive state based on store state
export const getters: GetterTree<RootState, RootState> = {
  // Get all todos
  allTodos: (state): Todo[] => state.todos,

  // Get active (incomplete) todos
  activeTodos: (state): Todo[] => state.todos.filter(todo => !todo.completed),

  // Get completed todos
  completedTodos: (state): Todo[] => state.todos.filter(todo => todo.completed),

  // Get filtered todos based on current filter
  filteredTodos: (state, getters): Todo[] => {
    switch (state.filter) {
      case 'active':
        return getters.activeTodos
      case 'completed':
        return getters.completedTodos
      default:
        return getters.allTodos
    }
  },

  // Get total count
  totalCount: (state): number => state.todos.length,

  // Get active count
  activeCount: (state, getters): number => getters.activeTodos.length,

  // Get completed count
  completedCount: (state, getters): number => getters.completedTodos.length,

  // Get current filter
  currentFilter: (state): string => state.filter,

  // Check if all todos are completed
  allCompleted: (state, getters): boolean =>
    getters.totalCount > 0 && getters.activeCount === 0,

  // Check if there are any completed todos
  hasCompleted: (state, getters): boolean => getters.completedCount > 0
}

export default getters
