import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoEntityState, selectAll } from '../reducers/todo.reducer';
import { Todo } from '../../models/todo.model';

// Feature Selector
export const selectTodoState = createFeatureSelector<TodoEntityState>('todos');

// Entity Selectors
export const selectAllTodos = createSelector(
  selectTodoState,
  selectAll
);

export const selectTodoEntities = createSelector(
  selectTodoState,
  (state) => state.entities
);

export const selectTodoById = (id: string) =>
  createSelector(
    selectTodoEntities,
    (entities) => entities[id]
  );

// Filter Selector
export const selectFilter = createSelector(
  selectTodoState,
  (state) => state.filter
);

// Filtered Todos
export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectFilter,
  (todos: Todo[], filter) => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }
);

// Statistics Selectors
export const selectTotalTodos = createSelector(
  selectAllTodos,
  (todos) => todos.length
);

export const selectActiveTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter((todo) => !todo.completed)
);

export const selectActiveTodosCount = createSelector(
  selectActiveTodos,
  (todos) => todos.length
);

export const selectCompletedTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter((todo) => todo.completed)
);

export const selectCompletedTodosCount = createSelector(
  selectCompletedTodos,
  (todos) => todos.length
);

export const selectHasCompletedTodos = createSelector(
  selectCompletedTodosCount,
  (count) => count > 0
);

// Loading and Error Selectors
export const selectLoading = createSelector(
  selectTodoState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectTodoState,
  (state) => state.error
);
