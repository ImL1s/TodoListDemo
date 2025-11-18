import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useSearchParams, useNavigation } from '@remix-run/react';
import {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
  getTodoStats,
  validateTodoText,
  type FilterType,
} from '~/utils/todo.server';
import TodoInput from '~/components/TodoInput';
import TodoList from '~/components/TodoList';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Todo App - Modern Task Management' },
    {
      name: 'description',
      content: 'A full-stack todo application built with Remix, showcasing progressive enhancement and web standards.',
    },
  ];
};

/**
 * Loader: Server-side data fetching
 * Runs on the server for both initial page load and client-side navigations
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filter = (url.searchParams.get('filter') || 'all') as FilterType;

  // Validate filter
  const validFilters: FilterType[] = ['all', 'active', 'completed'];
  const currentFilter = validFilters.includes(filter) ? filter : 'all';

  // Fetch all data in parallel for better performance
  const [todos, stats] = await Promise.all([
    getTodos(),
    getTodoStats(),
  ]);

  // Filter todos based on the current filter
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  return json({
    todos: filteredTodos,
    allTodos: todos,
    stats,
    filter: currentFilter,
  });
}

/**
 * Action: Server-side form handling
 * Processes POST requests from forms (create, toggle, delete, clear)
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('_action');

  try {
    switch (action) {
      case 'create': {
        const text = formData.get('text');

        if (typeof text !== 'string') {
          return json({ error: 'Invalid todo text' }, { status: 400 });
        }

        // Validate todo text
        const validation = validateTodoText(text);
        if (!validation.valid) {
          return json({ error: validation.error }, { status: 400 });
        }

        await createTodo(text);
        return redirect('/?filter=all');
      }

      case 'toggle': {
        const id = formData.get('id');

        if (typeof id !== 'string') {
          return json({ error: 'Invalid todo ID' }, { status: 400 });
        }

        const todo = await toggleTodo(id);
        if (!todo) {
          return json({ error: 'Todo not found' }, { status: 404 });
        }

        // Return to the same page with the current filter
        const url = new URL(request.url);
        const filter = url.searchParams.get('filter') || 'all';
        return redirect(`/?filter=${filter}`);
      }

      case 'delete': {
        const id = formData.get('id');

        if (typeof id !== 'string') {
          return json({ error: 'Invalid todo ID' }, { status: 400 });
        }

        const success = await deleteTodo(id);
        if (!success) {
          return json({ error: 'Todo not found' }, { status: 404 });
        }

        // Return to the same page with the current filter
        const url = new URL(request.url);
        const filter = url.searchParams.get('filter') || 'all';
        return redirect(`/?filter=${filter}`);
      }

      case 'clearCompleted': {
        await clearCompleted();
        return redirect('/?filter=all');
      }

      default:
        return json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Action error:', error);
    return json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export default function Index() {
  const { todos, allTodos, stats, filter } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const isClearingCompleted = navigation.state === 'submitting' &&
    navigation.formData?.get('_action') === 'clearCompleted';

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1>Remix Todo App</h1>
        <p>Progressive Enhancement with Web Standards</p>
        <span className="tech-badge">Remix 2.x + TypeScript</span>
      </header>

      {/* Todo Input */}
      <TodoInput error={searchParams.get('error') || undefined} />

      {/* Statistics */}
      <div className="card">
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--color-warning)' }}>
              {stats.active}
            </span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--color-success)' }}>
              {stats.completed}
            </span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.completionRate}%</span>
            <span className="stat-label">Completion</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="filter-tabs" role="tablist" aria-label="Filter todos">
          <a
            href="/?filter=all"
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            role="tab"
            aria-selected={filter === 'all'}
            aria-label="Show all todos"
          >
            All ({allTodos.length})
          </a>
          <a
            href="/?filter=active"
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            role="tab"
            aria-selected={filter === 'active'}
            aria-label="Show active todos"
          >
            Active ({stats.active})
          </a>
          <a
            href="/?filter=completed"
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            role="tab"
            aria-selected={filter === 'completed'}
            aria-label="Show completed todos"
          >
            Completed ({stats.completed})
          </a>
        </div>

        {/* Clear Completed Button */}
        {stats.completed > 0 && (
          <Form method="post" style={{ marginTop: '1rem' }}>
            <input type="hidden" name="_action" value="clearCompleted" />
            <button
              type="submit"
              className="btn btn-danger"
              disabled={isClearingCompleted}
              style={{ width: '100%' }}
            >
              {isClearingCompleted
                ? 'Clearing...'
                : `Clear ${stats.completed} Completed ${stats.completed === 1 ? 'Todo' : 'Todos'}`}
            </button>
          </Form>
        )}
      </div>

      {/* Todo List */}
      <TodoList todos={todos} filter={filter} />

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with{' '}
          <a
            href="https://remix.run"
            target="_blank"
            rel="noopener noreferrer"
          >
            Remix
          </a>
          {' '}- Embracing Web Standards
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          Features: Progressive Enhancement, File-based Routing, Server-side Mutations, Optimistic UI
        </p>
      </footer>
    </div>
  );
}

/**
 * Error Boundary for this route
 */
export function ErrorBoundary() {
  return (
    <div className="container">
      <div className="card">
        <div className="error-message">
          <strong>Something went wrong!</strong>
          <p>There was an error loading the todos. Please try again.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Reload
          </a>
        </div>
      </div>
    </div>
  );
}
