import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * 使用類型化的 hooks 替代原生的 useDispatch 和 useSelector
 * 這樣可以獲得更好的 TypeScript 類型推斷
 */

// 使用整個應用程式中，而不是簡單的 `useDispatch` 和 `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
