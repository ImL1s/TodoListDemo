import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTodoStore } from '@/store/useTodoStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Todo } from '@/types';

export function TodoInput() {
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim(), priority);
      setInputValue('');
      setPriority('medium');
      setIsDialogOpen(false);
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick add form */}
      <form onSubmit={handleQuickAdd} className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new todo..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {/* Advanced add dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Add with Priority
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Todo</DialogTitle>
              <DialogDescription>
                Create a new todo item with priority level.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="todo-text" className="text-sm font-medium">
                  Todo Description
                </label>
                <Input
                  id="todo-text"
                  placeholder="Enter todo description..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Priority</label>
                <div className="flex gap-2">
                  <Badge
                    variant={priority === 'low' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setPriority('low')}
                  >
                    Low
                  </Badge>
                  <Badge
                    variant={priority === 'medium' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setPriority('medium')}
                  >
                    Medium
                  </Badge>
                  <Badge
                    variant={priority === 'high' ? 'destructive' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setPriority('high')}
                  >
                    High
                  </Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!inputValue.trim()}>
                Add Todo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
