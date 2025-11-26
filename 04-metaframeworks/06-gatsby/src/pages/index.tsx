import React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { TodoInput } from '../components/TodoInput';
import { TodoList } from '../components/TodoList';
import { useTodos } from '../hooks/useTodos';
import type { FilterType } from '../types';

/**
 * Main Todo App Page
 *
 * This is a Gatsby page component that gets statically generated at build time.
 * All todo functionality is client-side using React hooks and localStorage.
 */
const IndexPage: React.FC<PageProps> = () => {
  const {
    filteredTodos,
    filter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
    clearCompleted,
  } = useTodos();

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <span className="gatsby-badge">Gatsby</span>
          Todo App
        </h1>
        <p className="app-subtitle">
          Built with Gatsby 5, React 18, and TypeScript
        </p>
      </header>

      <main className="app-main">
        <div className="todo-container">
          <TodoInput onAdd={addTodo} />

          <div className="filters">
            {filters.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`filter-button ${filter === value ? 'active' : ''}`}
                aria-label={`Show ${label.toLowerCase()} todos`}
              >
                {label}
              </button>
            ))}
          </div>

          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />

          {stats.total > 0 && (
            <footer className="todo-footer">
              <div className="stats">
                <span className="stat-item">
                  <strong>{stats.total}</strong> total
                </span>
                <span className="stat-divider">•</span>
                <span className="stat-item">
                  <strong>{stats.active}</strong> active
                </span>
                <span className="stat-divider">•</span>
                <span className="stat-item">
                  <strong>{stats.completed}</strong> completed
                </span>
              </div>

              {stats.completed > 0 && (
                <button
                  onClick={clearCompleted}
                  className="clear-button"
                  aria-label="Clear completed todos"
                >
                  Clear Completed
                </button>
              )}
            </footer>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          ⚡ Powered by{' '}
          <a
            href="https://www.gatsbyjs.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gatsby
          </a>
          {' '}- The fastest framework for the modern web
        </p>
        <p className="hint">💡 Tip: Double-click a todo to edit it</p>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }

        .app-container {
          max-width: 720px;
          margin: 0 auto;
        }

        .app-header {
          text-align: center;
          margin-bottom: 40px;
          color: white;
        }

        .app-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .gatsby-badge {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 24px;
          font-weight: 700;
          backdrop-filter: blur(10px);
        }

        .app-subtitle {
          font-size: 16px;
          opacity: 0.9;
          font-weight: 400;
        }

        .app-main {
          margin-bottom: 32px;
        }

        .todo-container {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          padding: 4px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .filter-button {
          flex: 1;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-button:hover {
          color: #4f46e5;
          background: #eef2ff;
        }

        .filter-button.active {
          color: white;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .todo-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 2px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .stats {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #6b7280;
        }

        .stat-item strong {
          color: #4f46e5;
          font-weight: 700;
        }

        .stat-divider {
          color: #d1d5db;
        }

        .clear-button {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #dc2626;
          background: #fee2e2;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-button:hover {
          background: #fecaca;
          transform: translateY(-1px);
        }

        .app-footer {
          text-align: center;
          color: white;
          font-size: 14px;
          opacity: 0.9;
        }

        .app-footer p {
          margin-bottom: 8px;
        }

        .app-footer a {
          color: white;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 2px solid rgba(255, 255, 255, 0.5);
          transition: border-color 0.2s;
        }

        .app-footer a:hover {
          border-bottom-color: white;
        }

        .hint {
          font-size: 13px;
          opacity: 0.7;
          font-style: italic;
        }

        @media (max-width: 640px) {
          .app-title {
            font-size: 36px;
          }

          .gatsby-badge {
            font-size: 20px;
            padding: 6px 12px;
          }

          .todo-container {
            padding: 24px 20px;
          }

          .filters {
            flex-direction: column;
          }

          .todo-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .stats {
            justify-content: center;
          }

          .clear-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default IndexPage;

/**
 * Head export for SEO optimization
 *
 * Gatsby automatically uses this for the page's <head> element
 */
export const Head: HeadFC = () => (
  <>
    <title>Gatsby Todo App - Modern Todo List with SSG</title>
    <meta
      name="description"
      content="A modern, fast todo list application built with Gatsby 5, React 18, and TypeScript. Experience blazing-fast performance with Static Site Generation."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:title" content="Gatsby Todo App" />
    <meta
      property="og:description"
      content="Modern todo list with Gatsby SSG and React"
    />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Gatsby Todo App" />
    <meta
      name="twitter:description"
      content="Modern todo list with Gatsby SSG and React"
    />
  </>
);
