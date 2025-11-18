/**
 * TodoList Component
 *
 * Demonstrates:
 * - useAtomValue for read-only access
 * - Derived atoms (filteredTodosAtom)
 * - Automatic re-renders only when dependencies change
 */

import { useAtomValue, useSetAtom } from 'jotai';
import {
  filteredTodosAtom,
  todoStatsAtom,
  toggleAllAtom,
  clearCompletedAtom,
} from '../atoms/todoAtoms';
import { TodoItem } from './TodoItem';

export function TodoList() {
  // useAtomValue for read-only access (alternative: useAtom and ignore setter)
  const filteredTodos = useAtomValue(filteredTodosAtom);
  const stats = useAtomValue(todoStatsAtom);

  // Write-only atoms for actions
  const toggleAll = useSetAtom(toggleAllAtom);
  const clearCompleted = useSetAtom(clearCompletedAtom);

  if (stats.total === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one above to get started!</p>
      </div>
    );
  }

  const allCompleted = stats.active === 0;

  return (
    <div className="todo-list-container">
      <div className="todo-list-header">
        <button
          onClick={() => toggleAll()}
          className={`toggle-all-button ${allCompleted ? 'active' : ''}`}
          title={allCompleted ? 'Mark all as active' : 'Mark all as completed'}
        >
          {allCompleted ? '↻' : '✓'} Toggle All
        </button>
        <div className="stats">
          <span className="stat">Total: {stats.total}</span>
          <span className="stat">Active: {stats.active}</span>
          <span className="stat">Completed: {stats.completed}</span>
        </div>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>

      {stats.completed > 0 && (
        <div className="todo-list-footer">
          <button onClick={() => clearCompleted()} className="clear-completed-button">
            Clear Completed ({stats.completed})
          </button>
        </div>
      )}
    </div>
  );
}

/*
 * KEY JOTAI CONCEPTS DEMONSTRATED:
 *
 * 1. useAtomValue Hook:
 *    - Read-only access to atom value
 *    - Component re-renders when atom changes
 *    - Cleaner than: const [value] = useAtom(atom)
 *    - Explicitly shows read-only intent
 *
 * 2. Derived Atoms (Computed Values):
 *    - filteredTodosAtom automatically updates
 *    - todoStatsAtom recalculates when todos change
 *    - No manual subscription or memoization needed
 *    - Dependencies tracked automatically
 *
 * 3. Multiple Atom Dependencies:
 *    - Component subscribes to multiple atoms
 *    - Re-renders when ANY dependency changes
 *    - Jotai handles all subscription management
 *
 * DERIVED ATOMS DEEP DIVE:
 *
 * filteredTodosAtom = atom((get) => {
 *   const todos = get(todosAtom);      // Dependency 1
 *   const filter = get(filterAtom);    // Dependency 2
 *   return filterLogic(todos, filter);
 * });
 *
 * - Automatically tracks dependencies
 * - Caches result until dependencies change
 * - Only recalculates when needed
 * - Similar to useMemo, but global
 *
 * PERFORMANCE CHARACTERISTICS:
 *
 * When a single todo is toggled:
 * 1. todosAtom updates
 * 2. filteredTodosAtom recalculates (fast - just filtering)
 * 3. todoStatsAtom recalculates (fast - just counting)
 * 4. TodoList re-renders
 * 5. TodoItem for changed todo re-renders
 * 6. Other TodoItems don't re-render (React key optimization)
 *
 * This is very efficient:
 * - No unnecessary re-renders
 * - No manual optimization needed
 * - React + Jotai handle it automatically
 *
 * COMPARISON WITH OTHER LIBRARIES:
 *
 * Recoil:
 *   const filteredTodos = useRecoilValue(filteredTodosSelector);
 *   const stats = useRecoilValue(todoStatsSelector);
 *   - Nearly identical, but needs separate selector() function
 *
 * Zustand:
 *   const filteredTodos = useTodoStore(state => filterTodos(state.todos, state.filter));
 *   - Need manual memoization
 *   - Or create separate derived store
 *
 * Redux:
 *   const filteredTodos = useSelector(selectFilteredTodos);
 *   const stats = useSelector(selectTodoStats);
 *   - Need to create selector functions
 *   - Recommend using Reselect library for memoization
 *
 * Context + useReducer:
 *   const { todos, filter } = useTodoContext();
 *   const filteredTodos = useMemo(() => filterTodos(todos, filter), [todos, filter]);
 *   - Manual memoization required
 *   - More boilerplate
 *   - Re-renders all consuming components
 */
