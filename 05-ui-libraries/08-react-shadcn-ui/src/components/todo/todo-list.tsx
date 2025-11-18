import { useTodoStore } from '@/store/useTodoStore';
import { TodoItem } from './todo-item';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterType } from '@/types';

export function TodoList() {
  const { todos, filter, setFilter, clearCompleted, filteredTodos } = useTodoStore();
  const displayTodos = filteredTodos();

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2">
          {filters.map(({ value, label }) => (
            <Button
              key={value}
              variant={filter === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="secondary">{activeCount} active</Badge>
          {completedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompleted}
              className="text-destructive"
            >
              Clear completed
            </Button>
          )}
        </div>
      </div>

      {/* Todo list */}
      <div className="space-y-2">
        {displayTodos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {filter === 'completed' && todos.length > 0
              ? 'No completed todos yet'
              : filter === 'active' && todos.length > 0
              ? 'No active todos'
              : 'No todos yet. Add one to get started!'}
          </div>
        ) : (
          displayTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="text-sm text-muted-foreground text-center pt-4 border-t">
          Total: {todos.length} {todos.length === 1 ? 'todo' : 'todos'} •{' '}
          {activeCount} active • {completedCount} completed
        </div>
      )}
    </div>
  );
}
