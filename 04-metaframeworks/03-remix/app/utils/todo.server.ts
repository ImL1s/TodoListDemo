/**
 * Server-side Todo utilities
 *
 * This file contains server-only code for managing todos.
 * The .server.ts extension ensures this code is never bundled for the client.
 */

import { promises as fs } from 'fs';
import { join } from 'path';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';

const TODOS_FILE = join(process.cwd(), 'todos.json');

/**
 * Ensure the todos file exists
 */
async function ensureTodosFile(): Promise<void> {
  try {
    await fs.access(TODOS_FILE);
  } catch {
    // File doesn't exist, create it with an empty array
    await fs.writeFile(TODOS_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Read all todos from the file system
 */
export async function getTodos(): Promise<Todo[]> {
  try {
    await ensureTodosFile();
    const data = await fs.readFile(TODOS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading todos:', error);
    return [];
  }
}

/**
 * Save todos to the file system
 */
async function saveTodos(todos: Todo[]): Promise<void> {
  try {
    await fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error('Error saving todos:', error);
    throw new Error('Failed to save todos');
  }
}

/**
 * Create a new todo
 */
export async function createTodo(text: string): Promise<Todo> {
  const todos = await getTodos();

  const newTodo: Todo = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  await saveTodos(todos);

  return newTodo;
}

/**
 * Toggle a todo's completed status
 */
export async function toggleTodo(id: string): Promise<Todo | null> {
  const todos = await getTodos();
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return null;
  }

  todo.completed = !todo.completed;
  await saveTodos(todos);

  return todo;
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string): Promise<boolean> {
  const todos = await getTodos();
  const initialLength = todos.length;
  const filteredTodos = todos.filter(t => t.id !== id);

  if (filteredTodos.length === initialLength) {
    return false; // Todo not found
  }

  await saveTodos(filteredTodos);
  return true;
}

/**
 * Delete all completed todos
 */
export async function clearCompleted(): Promise<number> {
  const todos = await getTodos();
  const completedCount = todos.filter(t => t.completed).length;
  const activeTodos = todos.filter(t => !t.completed);

  await saveTodos(activeTodos);
  return completedCount;
}

/**
 * Get filtered todos based on filter type
 */
export async function getFilteredTodos(filter: FilterType): Promise<Todo[]> {
  const todos = await getTodos();

  switch (filter) {
    case 'active':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    case 'all':
    default:
      return todos;
  }
}

/**
 * Get todo statistics
 */
export async function getTodoStats() {
  const todos = await getTodos();
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  return {
    total,
    active,
    completed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

/**
 * Validate todo text
 */
export function validateTodoText(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Todo text cannot be empty' };
  }

  if (text.trim().length > 500) {
    return { valid: false, error: 'Todo text must be less than 500 characters' };
  }

  return { valid: true };
}
