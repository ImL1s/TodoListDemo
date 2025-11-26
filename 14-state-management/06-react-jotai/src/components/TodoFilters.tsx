/**
 * TodoFilters Component
 *
 * Demonstrates:
 * - useAtom for both reading and writing
 * - Simple state updates
 * - TypeScript with Jotai
 */

import { useAtom } from 'jotai';
import { filterAtom } from '../atoms/todoAtoms';
import { FilterType } from '../types';

export function TodoFilters() {
  const [filter, setFilter] = useAtom(filterAtom);

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="todo-filters">
      <span className="filter-label">Show:</span>
      <div className="filter-buttons">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`filter-button ${filter === value ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/*
 * KEY JOTAI CONCEPTS DEMONSTRATED:
 *
 * 1. Simple State Updates:
 *    - setFilter(value) directly updates the atom
 *    - No action creators needed
 *    - No reducers needed
 *    - Just like useState, but global
 *
 * 2. Automatic Propagation:
 *    - When filter changes, filteredTodosAtom recalculates
 *    - TodoList component re-renders
 *    - All automatic - no manual dispatch or subscription
 *
 * 3. TypeScript Support:
 *    - FilterType ensures type safety
 *    - IDE autocomplete works perfectly
 *    - Compile-time error if wrong type
 *
 * COMPARISON WITH OTHER LIBRARIES:
 *
 * Recoil:
 *   const [filter, setFilter] = useRecoilState(filterState);
 *   - Identical API and usage
 *
 * Zustand:
 *   const { filter, setFilter } = useTodoStore();
 *   - Similar, but part of larger store
 *
 * Redux:
 *   const filter = useSelector(state => state.filter);
 *   const dispatch = useDispatch();
 *   const handleClick = (value) => dispatch(setFilter(value));
 *   - More verbose
 *   - Need action creators
 *
 * Context:
 *   const { filter, setFilter } = useTodoContext();
 *   - Similar, but all consuming components re-render
 *   - Jotai is more granular
 */
