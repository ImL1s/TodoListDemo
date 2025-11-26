import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TodoInput } from '@/components/todo/todo-input';
import { TodoList } from '@/components/todo/todo-list';
import { useTheme } from '@/components/theme-provider';

function App() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background transition-colors">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Todo App</h1>
            <p className="text-muted-foreground mt-1">
              Built with React + Shadcn/ui
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Main content */}
        <Card>
          <CardHeader>
            <CardTitle>My Todos</CardTitle>
            <CardDescription>
              Manage your tasks with priority levels and filters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TodoInput />
            <TodoList />
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Built with{' '}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Shadcn/ui
            </a>
            {' • '}
            <a
              href="https://www.radix-ui.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Radix UI
            </a>
            {' • '}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Tailwind CSS
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
