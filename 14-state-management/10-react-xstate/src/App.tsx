import React from 'react';
import { useMachine } from '@xstate/react';
import { todoMachine } from './machines/todoMachine';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import './styles/App.css';

function App() {
  // 使用 XState 的 useMachine hook
  const [state, send] = useMachine(todoMachine);

  const { todos, filter, editing } = state.context;

  // 計算統計數據
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  // 事件處理器
  const handleAddTodo = (text: string) => {
    send({ type: 'ADD_TODO', text });
  };

  const handleToggleTodo = (id: string) => {
    send({ type: 'TOGGLE_TODO', id });
  };

  const handleDeleteTodo = (id: string) => {
    send({ type: 'DELETE_TODO', id });
  };

  const handleStartEdit = (id: string, text: string) => {
    send({ type: 'START_EDIT', id, text });
  };

  const handleUpdateTodo = (id: string, text: string) => {
    send({ type: 'UPDATE_TODO', id, text });
  };

  const handleCancelEdit = () => {
    send({ type: 'CANCEL_EDIT' });
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    send({ type: 'SET_FILTER', filter: newFilter });
  };

  const handleClearCompleted = () => {
    send({ type: 'CLEAR_COMPLETED' });
  };

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>todos</h1>
          <div className="state-indicator">
            <span className="state-badge">{state.value.toString()}</span>
            <span className="xstate-logo">Powered by XState</span>
          </div>
        </header>

        <main className="app-main">
          {state.matches('loading') ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading todos...</p>
            </div>
          ) : (
            <>
              <AddTodo onAdd={handleAddTodo} />

              <TodoList
                todos={todos}
                filter={filter}
                editingId={editing?.id || null}
                editText={editing?.text || ''}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onStartEdit={handleStartEdit}
                onUpdate={handleUpdateTodo}
                onCancelEdit={handleCancelEdit}
              />

              {todos.length > 0 && (
                <TodoFilters
                  currentFilter={filter}
                  activeCount={activeCount}
                  completedCount={completedCount}
                  onFilterChange={handleFilterChange}
                  onClearCompleted={handleClearCompleted}
                />
              )}
            </>
          )}
        </main>

        <footer className="app-footer">
          <p>Double-click to edit a todo</p>
          <p className="machine-info">
            Current State Machine: <strong>{state.value.toString()}</strong>
          </p>
          <details className="context-debug">
            <summary>View State Context (Debug)</summary>
            <pre>{JSON.stringify(state.context, null, 2)}</pre>
          </details>
        </footer>
      </div>
    </div>
  );
}

export default App;
