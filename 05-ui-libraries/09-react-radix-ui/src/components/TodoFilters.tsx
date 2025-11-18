import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTodos } from '../context/TodoContext';
import { FilterType } from '../types';
import styles from '../styles/App.module.css';

/**
 * TodoFilters component using Radix UI DropdownMenu primitive
 *
 * Demonstrates:
 * - Radix DropdownMenu primitive for accessible dropdowns
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Focus management
 * - Checkable items (radio group behavior)
 * - Portal rendering
 * - ARIA attributes for screen readers
 * - Custom styling of unstyled primitives
 */
export const TodoFilters: React.FC = () => {
  const { filter, setFilter, todos, clearCompleted } = useTodos();

  const filterLabels: Record<FilterType, string> = {
    all: 'All',
    active: 'Active',
    completed: 'Completed',
  };

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.todoStats}>
        <span className={styles.statItem}>
          <strong>{activeCount}</strong> active
        </span>
        <span className={styles.statItem}>
          <strong>{completedCount}</strong> completed
        </span>
      </div>

      <div className={styles.filterActions}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className={styles.filterButton} aria-label="Filter todos">
              <span className={styles.filterIcon}>⚙</span>
              Show: {filterLabels[filter]}
              <span className={styles.dropdownArrow}>▼</span>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={styles.dropdownContent}
              sideOffset={5}
              align="end"
            >
              <DropdownMenu.Label className={styles.dropdownLabel}>
                Filter Todos
              </DropdownMenu.Label>

              <DropdownMenu.Separator className={styles.dropdownSeparator} />

              <DropdownMenu.RadioGroup value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
                <DropdownMenu.RadioItem
                  className={styles.dropdownItem}
                  value="all"
                >
                  <DropdownMenu.ItemIndicator className={styles.itemIndicator}>
                    ✓
                  </DropdownMenu.ItemIndicator>
                  All Todos
                  <span className={styles.countBadge}>{todos.length}</span>
                </DropdownMenu.RadioItem>

                <DropdownMenu.RadioItem
                  className={styles.dropdownItem}
                  value="active"
                >
                  <DropdownMenu.ItemIndicator className={styles.itemIndicator}>
                    ✓
                  </DropdownMenu.ItemIndicator>
                  Active
                  <span className={styles.countBadge}>{activeCount}</span>
                </DropdownMenu.RadioItem>

                <DropdownMenu.RadioItem
                  className={styles.dropdownItem}
                  value="completed"
                >
                  <DropdownMenu.ItemIndicator className={styles.itemIndicator}>
                    ✓
                  </DropdownMenu.ItemIndicator>
                  Completed
                  <span className={styles.countBadge}>{completedCount}</span>
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>

              {completedCount > 0 && (
                <>
                  <DropdownMenu.Separator className={styles.dropdownSeparator} />
                  <DropdownMenu.Item
                    className={`${styles.dropdownItem} ${styles.dropdownDangerItem}`}
                    onSelect={clearCompleted}
                  >
                    Clear Completed ({completedCount})
                  </DropdownMenu.Item>
                </>
              )}

              <DropdownMenu.Arrow className={styles.dropdownArrowElement} />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};
