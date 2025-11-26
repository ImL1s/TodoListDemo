import { ActionTree, ActionContext } from 'vuex'
import { RootState } from './index'
import { FilterType } from '../types'
import * as types from './mutation-types'

// Actions can contain asynchronous operations
// They commit mutations to change state
export const actions: ActionTree<RootState, RootState> = {
  // Add a new todo
  addTodo({ commit }: ActionContext<RootState, RootState>, text: string) {
    if (text.trim()) {
      commit(types.ADD_TODO, text.trim())
    }
  },

  // Remove a todo
  removeTodo({ commit }: ActionContext<RootState, RootState>, id: number) {
    commit(types.REMOVE_TODO, id)
  },

  // Toggle todo completion
  toggleTodo({ commit }: ActionContext<RootState, RootState>, id: number) {
    commit(types.TOGGLE_TODO, id)
  },

  // Update todo text
  updateTodo(
    { commit }: ActionContext<RootState, RootState>,
    payload: { id: number; text: string }
  ) {
    if (payload.text.trim()) {
      commit(types.UPDATE_TODO, { id: payload.id, text: payload.text.trim() })
    }
  },

  // Set filter
  setFilter({ commit }: ActionContext<RootState, RootState>, filter: FilterType) {
    commit(types.SET_FILTER, filter)
  },

  // Clear all completed todos
  clearCompleted({ commit }: ActionContext<RootState, RootState>) {
    commit(types.CLEAR_COMPLETED)
  },

  // Example of async action (for demonstration)
  // In a real app, this might save to a backend API
  async saveTodoAsync(
    { commit }: ActionContext<RootState, RootState>,
    text: string
  ): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100))

    if (text.trim()) {
      commit(types.ADD_TODO, text.trim())
    }
  }
}

export default actions
