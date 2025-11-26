import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import * as TodoActions from '../actions/todo.actions';
import { selectAllTodos } from '../selectors/todo.selectors';
import { Todo } from '../../models/todo.model';

const STORAGE_KEY = 'ngrx-todos';

@Injectable()
export class TodoEffects {
  // Load todos from localStorage on app init
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      map(() => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          const todos: Todo[] = stored ? JSON.parse(stored) : [];
          return TodoActions.loadTodosSuccess({ todos });
        } catch (error) {
          return TodoActions.loadTodosFailure({
            error: 'Failed to load todos from localStorage',
          });
        }
      })
    )
  );

  // Save todos to localStorage after any change
  saveTodos$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.addTodoSuccess,
          TodoActions.updateTodoSuccess,
          TodoActions.deleteTodoSuccess,
          TodoActions.toggleTodoSuccess,
          TodoActions.clearCompletedSuccess
        ),
        withLatestFrom(this.store.select(selectAllTodos)),
        tap(([, todos]) => {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
          } catch (error) {
            console.error('Failed to save todos to localStorage:', error);
          }
        })
      ),
    { dispatch: false }
  );

  // Add Todo Effect
  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      map(({ text }) => {
        const todo: Todo = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          text,
          completed: false,
          createdAt: Date.now(),
        };
        return TodoActions.addTodoSuccess({ todo });
      })
    )
  );

  // Update Todo Effect
  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      map(({ id, text }) => TodoActions.updateTodoSuccess({ id, text }))
    )
  );

  // Delete Todo Effect
  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      map(({ id }) => TodoActions.deleteTodoSuccess({ id }))
    )
  );

  // Toggle Todo Effect
  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      map(({ id }) => TodoActions.toggleTodoSuccess({ id }))
    )
  );

  // Clear Completed Effect
  clearCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.clearCompleted),
      map(() => TodoActions.clearCompletedSuccess())
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store
  ) {}
}
