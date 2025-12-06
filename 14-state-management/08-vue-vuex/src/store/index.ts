// @ts-nocheck
import { createStore, Store } from 'vuex'
import { Todo, FilterType } from '../types'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createPersistedState from './plugins/persistedState'

// State interface
export interface RootState {
  todos: Todo[]
  filter: FilterType
  nextId: number
}

// Initial state
const state: RootState = {
  todos: [],
  filter: 'all',
  nextId: 1
}

// Create and export store
const store = createStore<RootState>({
  strict: import.meta.env.DEV, // Enable strict mode in development
  state,
  mutations,
  actions,
  getters,
  plugins: [createPersistedState()]
})

export default store

// Define your own `useStore` composition function
export function useStore(): Store<RootState> {
  return store as Store<RootState>
}
