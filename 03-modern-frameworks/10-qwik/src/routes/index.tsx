import { component$, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { TodoInput } from '../components/todo-input';
import { TodoList } from '../components/todo-list';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface TodoStore {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

export default component$(() => {
  // Use useStore for reactive object state
  const todoStore = useStore<TodoStore>({
    todos: [],
    filter: 'all',
  });

  // Use useSignal for simple reactive values
  const inputValue = useSignal('');

  // Load todos from localStorage on client-side
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const stored = localStorage.getItem('qwik-todos');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        todoStore.todos = parsed;
      } catch (e) {
        console.error('Failed to parse todos from localStorage', e);
      }
    }
  });

  // Save todos to localStorage whenever they change
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => todoStore.todos);
    if (todoStore.todos.length > 0 || localStorage.getItem('qwik-todos')) {
      localStorage.setItem('qwik-todos', JSON.stringify(todoStore.todos));
    }
  });

  // Add todo handler - using $ for lazy loading
  const addTodo$ = $(() => {
    const trimmedText = inputValue.value.trim();
    if (trimmedText) {
      todoStore.todos = [
        ...todoStore.todos,
        {
          id: Date.now(),
          text: trimmedText,
          completed: false,
        },
      ];
      inputValue.value = '';
    }
  });

  // Toggle todo completion
  const toggleTodo$ = $((id: number) => {
    todoStore.todos = todoStore.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  });

  // Delete todo
  const deleteTodo$ = $((id: number) => {
    todoStore.todos = todoStore.todos.filter((todo) => todo.id !== id);
  });

  // Edit todo
  const editTodo$ = $((id: number, newText: string) => {
    todoStore.todos = todoStore.todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
  });

  // Clear completed todos
  const clearCompleted$ = $(() => {
    todoStore.todos = todoStore.todos.filter((todo) => !todo.completed);
  });

  // Toggle all todos
  const toggleAll$ = $(() => {
    const allCompleted = todoStore.todos.every((todo) => todo.completed);
    todoStore.todos = todoStore.todos.map((todo) => ({
      ...todo,
      completed: !allCompleted,
    }));
  });

  // Filter todos based on current filter
  const filteredTodos = todoStore.todos.filter((todo) => {
    if (todoStore.filter === 'active') return !todo.completed;
    if (todoStore.filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodoCount = todoStore.todos.filter((todo) => !todo.completed).length;
  const completedTodoCount = todoStore.todos.filter((todo) => todo.completed).length;

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div class="max-w-2xl mx-auto">
        {/* Header */}
        <div class="text-center mb-8">
          <h1 class="text-5xl font-bold text-gray-800 mb-2">
            Todo List
          </h1>
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
            </svg>
            Qwik
          </div>
          <p class="text-gray-600 mt-4 text-sm">
            Resumable • O(1) Loading • Zero JS by Default
          </p>
        </div>

        {/* Main Card */}
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Input Section */}
          <div class="p-6 bg-gradient-to-r from-purple-600 to-blue-600">
            <TodoInput
              value={inputValue}
              onAdd$={addTodo$}
              onToggleAll$={toggleAll$}
              hasItems={todoStore.todos.length > 0}
              allCompleted={todoStore.todos.length > 0 && todoStore.todos.every((t) => t.completed)}
            />
          </div>

          {/* Todo List */}
          {todoStore.todos.length > 0 && (
            <>
              <TodoList
                todos={filteredTodos}
                onToggle$={toggleTodo$}
                onDelete$={deleteTodo$}
                onEdit$={editTodo$}
              />

              {/* Footer */}
              <div class="p-4 bg-gray-50 border-t border-gray-200">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Counter */}
                  <div class="text-sm text-gray-600">
                    <span class="font-semibold text-purple-600">{activeTodoCount}</span>
                    {' '}
                    {activeTodoCount === 1 ? 'item' : 'items'} left
                  </div>

                  {/* Filters */}
                  <div class="flex gap-2">
                    <button
                      class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        todoStore.filter === 'all'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick$={() => (todoStore.filter = 'all')}
                    >
                      All
                    </button>
                    <button
                      class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        todoStore.filter === 'active'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick$={() => (todoStore.filter = 'active')}
                    >
                      Active
                    </button>
                    <button
                      class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        todoStore.filter === 'completed'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick$={() => (todoStore.filter = 'completed')}
                    >
                      Completed
                    </button>
                  </div>

                  {/* Clear Completed */}
                  {completedTodoCount > 0 && (
                    <button
                      class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                      onClick$={clearCompleted$}
                    >
                      Clear completed
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {todoStore.todos.length === 0 && (
            <div class="p-12 text-center">
              <svg
                class="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">No todos yet</h3>
              <p class="text-gray-500">Add a task to get started!</p>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div class="mt-8 text-center text-sm text-gray-600">
          <p class="mb-2">Built with ⚡ Qwik - The Resumable Framework</p>
          <p class="text-xs text-gray-500">
            No hydration • Instant interactive • O(1) loading complexity
          </p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Qwik Todo App - Resumable Framework Demo',
  meta: [
    {
      name: 'description',
      content: 'A modern Todo List application built with Qwik, demonstrating resumability, lazy loading, and O(1) performance.',
    },
  ],
};
