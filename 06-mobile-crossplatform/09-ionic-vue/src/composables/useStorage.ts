import { Preferences } from '@capacitor/preferences'
import { ref } from 'vue'

/**
 * Composable for persistent storage using Capacitor Preferences
 */
export function useStorage<T = any>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Load data from storage
   */
  const load = async (): Promise<T> => {
    loading.value = true
    error.value = null

    try {
      const { value } = await Preferences.get({ key })

      if (value) {
        const parsed = JSON.parse(value) as T
        data.value = parsed
        return parsed
      }

      return defaultValue
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      error.value = errorMessage
      console.error(`Error loading data for key "${key}":`, err)
      return defaultValue
    } finally {
      loading.value = false
    }
  }

  /**
   * Save data to storage
   */
  const save = async (value: T): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await Preferences.set({
        key,
        value: JSON.stringify(value)
      })
      data.value = value
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save data'
      error.value = errorMessage
      console.error(`Error saving data for key "${key}":`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Remove data from storage
   */
  const remove = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await Preferences.remove({ key })
      data.value = defaultValue
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove data'
      error.value = errorMessage
      console.error(`Error removing data for key "${key}":`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear all storage
   */
  const clear = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await Preferences.clear()
      data.value = defaultValue
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear storage'
      error.value = errorMessage
      console.error('Error clearing storage:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Check if key exists in storage
   */
  const has = async (): Promise<boolean> => {
    try {
      const { value } = await Preferences.get({ key })
      return value !== null
    } catch (err) {
      console.error(`Error checking key "${key}":`, err)
      return false
    }
  }

  /**
   * Get all keys from storage
   */
  const keys = async (): Promise<string[]> => {
    try {
      const { keys: storageKeys } = await Preferences.keys()
      return storageKeys
    } catch (err) {
      console.error('Error getting keys:', err)
      return []
    }
  }

  return {
    data,
    loading,
    error,
    load,
    save,
    remove,
    clear,
    has,
    keys
  }
}
