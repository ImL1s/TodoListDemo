import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';

// Todo CRUD Actions
export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ text: string }>()
);

export const addTodoSuccess = createAction(
  '[Todo] Add Todo Success',
  props<{ todo: Todo }>()
);

export const updateTodo = createAction(
  '[Todo] Update Todo',
  props<{ id: string; text: string }>()
);

export const updateTodoSuccess = createAction(
  '[Todo] Update Todo Success',
  props<{ id: string; text: string }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: string }>()
);

export const deleteTodoSuccess = createAction(
  '[Todo] Delete Todo Success',
  props<{ id: string }>()
);

export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: string }>()
);

export const toggleTodoSuccess = createAction(
  '[Todo] Toggle Todo Success',
  props<{ id: string }>()
);

// Filter Actions
export const setFilter = createAction(
  '[Todo] Set Filter',
  props<{ filter: 'all' | 'active' | 'completed' }>()
);

// Bulk Actions
export const clearCompleted = createAction('[Todo] Clear Completed');

export const clearCompletedSuccess = createAction(
  '[Todo] Clear Completed Success'
);

// LocalStorage Actions
export const loadTodos = createAction('[Todo] Load Todos');

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const loadTodosFailure = createAction(
  '[Todo] Load Todos Failure',
  props<{ error: string }>()
);
