import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

/**
 * 自訂 Hooks，提供類型安全的 dispatch 和 selector
 *
 * 使用這些 hooks 而不是直接使用 react-redux 的 useDispatch 和 useSelector
 * 可以避免在每次使用時都要手動指定類型
 */

// 在整個應用程式中使用，而不是簡單的 `useDispatch` 和 `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
