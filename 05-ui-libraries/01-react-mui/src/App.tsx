import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { theme } from './theme';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoStats } from './components/TodoStats';
import { FilterButtons } from './components/FilterButtons';
import { Todo } from './types';

const STORAGE_KEY = 'mui-todo-list';

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const hasCompletedTodos = todos.some((todo) => todo.completed);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={4}>
          <Toolbar>
            <ChecklistIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Material-UI Todo List
            </Typography>
            {hasCompletedTodos && (
              <Button
                color="inherit"
                onClick={clearCompleted}
                startIcon={<DeleteSweepIcon />}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Clear Completed
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <TodoInput onAdd={addTodo} />

          {todos.length > 0 && <TodoStats todos={todos} />}

          <FilterButtons filter={filter} onFilterChange={setFilter} />

          <TodoList
            todos={todos}
            filter={filter}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />

          {todos.length > 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {todos.filter((t) => !t.completed).length} items left
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
