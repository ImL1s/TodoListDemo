// @ts-nocheck
import { Store } from 'vuex'
import { RootState } from '../index'
import * as types from '../mutation-types'

const STORAGE_KEY = 'vuex-todo-app'

/**
 * Vuex plugin for localStorage persistence
 * This plugin saves the state to localStorage after each mutation
 * and restores it when the app loads
 */
export default function createPersistedState() {
  return (store: Store<RootState>) => {
    // Restore state from localStorage on initialization
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        store.commit(types.RESTORE_STATE, parsed)
      } catch (error) {
        console.error('Failed to parse saved state:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    // Subscribe to store mutations
    // Save state to localStorage after each mutation
    store.subscribe((mutation, state) => {
      try {
        const stateToSave = {
          todos: state.todos,
          filter: state.filter,
          nextId: state.nextId
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
      } catch (error) {
        console.error('Failed to save state:', error)
      }
    })
  }
}
