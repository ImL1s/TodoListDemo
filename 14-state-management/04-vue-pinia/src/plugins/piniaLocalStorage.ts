import { PiniaPluginContext } from 'pinia'
import { watch } from 'vue'

/**
 * Pinia Plugin for localStorage persistence
 *
 * 這個 plugin 展示了 Pinia 的擴展能力：
 * 1. 自動從 localStorage 載入數據
 * 2. 監聽 state 變化並自動保存
 * 3. 支持自定義存儲 key
 * 4. 處理序列化/反序列化
 *
 * 使用方式：
 * const pinia = createPinia()
 * pinia.use(piniaLocalStoragePlugin)
 */

interface LocalStorageOptions {
  /**
   * 存儲的 key，默認使用 store 的 id
   */
  key?: string

  /**
   * 需要持久化的 state 屬性列表，不指定則持久化所有 state
   */
  paths?: string[]

  /**
   * 自定義序列化函數
   */
  serializer?: {
    serialize: (value: any) => string
    deserialize: (value: string) => any
  }
}

/**
 * 默認的序列化器，支持 Date 對象
 */
const defaultSerializer = {
  serialize: (value: any): string => {
    return JSON.stringify(value, (_key, val) => {
      // 特殊處理 Date 對象
      if (val instanceof Date) {
        return { __type: 'Date', value: val.toISOString() }
      }
      return val
    })
  },

  deserialize: (value: string): any => {
    return JSON.parse(value, (_key, val) => {
      // 還原 Date 對象
      if (val && val.__type === 'Date') {
        return new Date(val.value)
      }
      return val
    })
  }
}

/**
 * 從 localStorage 載入數據
 */
function loadState(key: string, serializer: typeof defaultSerializer): any {
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return serializer.deserialize(stored)
    }
  } catch (error) {
    console.error(`Failed to load state from localStorage (key: ${key}):`, error)
  }
  return null
}

/**
 * 保存數據到 localStorage
 */
function saveState(key: string, state: any, serializer: typeof defaultSerializer): void {
  try {
    const serialized = serializer.serialize(state)
    localStorage.setItem(key, serialized)
  } catch (error) {
    console.error(`Failed to save state to localStorage (key: ${key}):`, error)
  }
}

/**
 * 獲取需要持久化的 state 子集
 */
function getPersistedState(state: any, paths?: string[]): any {
  if (!paths || paths.length === 0) {
    return state
  }

  const result: any = {}
  for (const path of paths) {
    if (path in state) {
      result[path] = state[path]
    }
  }
  return result
}

/**
 * Pinia localStorage 持久化插件
 */
export function piniaLocalStoragePlugin(context: PiniaPluginContext) {
  const { store, options } = context

  // 獲取插件配置
  const persistOptions = (options as any).persist as LocalStorageOptions | boolean | undefined

  // 如果沒有配置 persist 選項，則不啟用持久化
  if (!persistOptions) {
    return
  }

  // 解析配置
  const config: LocalStorageOptions =
    typeof persistOptions === 'boolean'
      ? {}
      : persistOptions

  const key = config.key || `pinia-${store.$id}`
  const serializer = config.serializer || defaultSerializer
  const paths = config.paths

  // 1. 從 localStorage 載入初始狀態
  const savedState = loadState(key, serializer)
  if (savedState) {
    store.$patch(savedState)
  }

  // 2. 監聽 state 變化，自動保存到 localStorage
  watch(
    () => store.$state,
    (state) => {
      const persistedState = getPersistedState(state, paths)
      saveState(key, persistedState, serializer)
    },
    { deep: true }
  )
}

/**
 * 使用示例：
 *
 * // 在 main.ts 中註冊插件
 * import { createPinia } from 'pinia'
 * import { piniaLocalStoragePlugin } from '@/plugins/piniaLocalStorage'
 *
 * const pinia = createPinia()
 * pinia.use(piniaLocalStoragePlugin)
 *
 * // 在 store 中啟用持久化
 * export const useTodoStore = defineStore('todo', {
 *   // ... state, getters, actions
 * }, {
 *   persist: true  // 或者 { key: 'custom-key', paths: ['todos'] }
 * })
 */
