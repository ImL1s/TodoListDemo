import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Todo, FilterType } from '../../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

// Entity Adapter Setup
export interface TodoEntityState extends EntityState<Todo> {
  filter: FilterType;
  loading: boolean;
  error: string | null;
}

export const todoAdapter: EntityAdapter<Todo> = createEntityAdapter<Todo>({
  selectId: (todo: Todo) => todo.id,
  sortComparer: (a: Todo, b: Todo) => b.createdAt - a.createdAt,
});

export const initialState: TodoEntityState = todoAdapter.getInitialState({
  filter: 'all' as FilterType,
  loading: false,
  error: null,
});

// Reducer
export const todoReducer = createReducer(
  initialState,

  // Add Todo
  on(TodoActions.addTodo, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.addTodoSuccess, (state, { todo }) =>
    todoAdapter.addOne(todo, {
      ...state,
      loading: false,
    })
  ),

  // Update Todo
  on(TodoActions.updateTodo, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.updateTodoSuccess, (state, { id, text }) =>
    todoAdapter.updateOne(
      { id, changes: { text } },
      {
        ...state,
        loading: false,
      }
    )
  ),

  // Delete Todo
  on(TodoActions.deleteTodo, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) =>
    todoAdapter.removeOne(id, {
      ...state,
      loading: false,
    })
  ),

  // Toggle Todo
  on(TodoActions.toggleTodo, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.toggleTodoSuccess, (state, { id }) => {
    const todo = state.entities[id];
    if (!todo) return state;

    return todoAdapter.updateOne(
      { id, changes: { completed: !todo.completed } },
      {
        ...state,
        loading: false,
      }
    );
  }),

  // Set Filter
  on(TodoActions.setFilter, (state, { filter }) => ({
    ...state,
    filter,
  })),

  // Clear Completed
  on(TodoActions.clearCompleted, (state) => ({
    ...state,
    loading: true,
  })),
  on(TodoActions.clearCompletedSuccess, (state) => {
    const completedIds = Object.values(state.entities)
      .filter((todo): todo is Todo => todo !== undefined && todo.completed)
      .map((todo) => todo.id);

    return todoAdapter.removeMany(completedIds, {
      ...state,
      loading: false,
    });
  }),

  // Load Todos
  on(TodoActions.loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) =>
    todoAdapter.setAll(todos, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

// Export Entity Selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = todoAdapter.getSelectors();
