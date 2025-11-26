// Todo 类型定义
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

// 过滤器类型
export type FilterType = 'all' | 'active' | 'completed';

// 应用信息类型
export interface AppInfo {
  version: string;
  name: string;
  electron: string;
  chrome: string;
  node: string;
  v8: string;
}

// 导出数据类型
export interface ExportData {
  todos: Todo[];
  exportDate: string;
  version: string;
}

// Electron API 类型（从 preload.ts 导入）
export interface ElectronAPI {
  getTodos: () => Promise<Todo[]>;
  saveTodos: (todos: Todo[]) => Promise<{ success: boolean }>;
  addTodo: (text: string) => Promise<Todo>;
  toggleTodo: (id: number) => Promise<Todo | null>;
  deleteTodo: (id: number) => Promise<{ success: boolean }>;
  editTodo: (id: number, text: string) => Promise<Todo | null>;
  clearCompleted: () => Promise<{ success: boolean }>;
  getAppInfo: () => Promise<AppInfo>;
  exportData: () => Promise<ExportData>;
  importData: (data: { todos: Todo[] }) => Promise<{ success: boolean }>;
  showNotification: (message: string) => void;
  onFocusInput: (callback: () => void) => void;
  onExportTodos: (callback: (todos: Todo[]) => void) => void;
  onImportTodos: (callback: () => void) => void;
  onShowAbout: (callback: () => void) => void;
  onNotification: (callback: (message: string) => void) => void;
}

// 扩展 Window 接口
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
