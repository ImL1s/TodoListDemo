import { onMounted, onUnmounted, Ref } from 'vue'

export function useShortcuts(callbacks: {
  onNewTodo?: () => void
  onFocusSearch?: () => void
}) {
  let unsubscribeNewTodo: (() => void) | undefined
  let unsubscribeFocusSearch: (() => void) | undefined

  onMounted(() => {
    // Register shortcut listeners
    if (callbacks.onNewTodo) {
      unsubscribeNewTodo = window.electronAPI.onNewTodo(callbacks.onNewTodo)
    }

    if (callbacks.onFocusSearch) {
      unsubscribeFocusSearch = window.electronAPI.onFocusSearch(callbacks.onFocusSearch)
    }
  })

  onUnmounted(() => {
    // Clean up listeners
    if (unsubscribeNewTodo) {
      unsubscribeNewTodo()
    }
    if (unsubscribeFocusSearch) {
      unsubscribeFocusSearch()
    }
  })
}
