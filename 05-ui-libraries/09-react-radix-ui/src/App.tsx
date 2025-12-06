import { TodoProvider } from './context/TodoContext';
import { TodoInput } from './components/TodoInput';
import { TodoFilters } from './components/TodoFilters';
import { TodoList } from './components/TodoList';
import styles from './styles/App.module.css';

/**
 * Main App component
 *
 * Structure:
 * - TodoProvider wraps the entire app (Context API)
 * - Header with app title and description
 * - TodoInput for adding new todos
 * - TodoFilters for filtering and statistics (Radix DropdownMenu)
 * - TodoList for displaying todos (Radix Checkbox, Tooltip, Dialog)
 *
 * Radix UI Primitives Used:
 * - Checkbox: Todo completion toggle
 * - Dialog: Delete confirmation modal
 * - DropdownMenu: Filter selection and actions
 * - Tooltip: Action button hints
 */
function App() {
  return (
    <TodoProvider>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>✓</span>
            React + Radix UI Todo
          </h1>
          <p className={styles.subtitle}>
            Built with unstyled, accessible Radix UI primitives
          </p>
        </header>

        <main className={styles.main}>
          <div className={styles.container}>
            <TodoInput />
            <TodoFilters />
            <TodoList />
          </div>
        </main>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            Powered by{' '}
            <a
              href="https://www.radix-ui.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Radix UI
            </a>
            {' '}- Unstyled, accessible components for React
          </p>
        </footer>
      </div>
    </TodoProvider>
  );
}

export default App;
