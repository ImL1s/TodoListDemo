/// <reference types="vite/client" />

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
}

export interface ElectronAPI {
  // Todo operations
  getTodos: () => Promise<Todo[]>;
  addTodo: (text: string) => Promise<Todo>;
  toggleTodo: (id: string) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<{ success: boolean }>;
  updateTodo: (id: string, text: string) => Promise<Todo>;
  clearCompleted: () => Promise<{ success: boolean }>;
  getStats: () => Promise<TodoStats>;

  // Menu events
  onMenuNewTodo: (callback: () => void) => void;
  onMenuClearCompleted: (callback: () => void) => void;

  // Remove listeners
  removeMenuListeners: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
