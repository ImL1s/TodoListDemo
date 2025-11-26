import { contextBridge, ipcRenderer } from 'electron';

// 定义 Todo 类型
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

// 定义应用信息类型
export interface AppInfo {
  version: string;
  name: string;
  electron: string;
  chrome: string;
  node: string;
  v8: string;
}

// 定义导出数据类型
export interface ExportData {
  todos: Todo[];
  exportDate: string;
  version: string;
}

// 定义 API 接口
export interface ElectronAPI {
  // Todo 操作
  getTodos: () => Promise<Todo[]>;
  saveTodos: (todos: Todo[]) => Promise<{ success: boolean }>;
  addTodo: (text: string) => Promise<Todo>;
  toggleTodo: (id: number) => Promise<Todo | null>;
  deleteTodo: (id: number) => Promise<{ success: boolean }>;
  editTodo: (id: number, text: string) => Promise<Todo | null>;
  clearCompleted: () => Promise<{ success: boolean }>;

  // 应用信息
  getAppInfo: () => Promise<AppInfo>;

  // 数据导入导出
  exportData: () => Promise<ExportData>;
  importData: (data: { todos: Todo[] }) => Promise<{ success: boolean }>;

  // 通知
  showNotification: (message: string) => void;

  // 事件监听
  onFocusInput: (callback: () => void) => void;
  onExportTodos: (callback: (todos: Todo[]) => void) => void;
  onImportTodos: (callback: () => void) => void;
  onShowAbout: (callback: () => void) => void;
  onNotification: (callback: (message: string) => void) => void;
}

// 暴露受保护的方法到渲染进程
const electronAPI: ElectronAPI = {
  // Todo 操作
  getTodos: () => ipcRenderer.invoke('get-todos'),
  saveTodos: (todos: Todo[]) => ipcRenderer.invoke('save-todos', todos),
  addTodo: (text: string) => ipcRenderer.invoke('add-todo', text),
  toggleTodo: (id: number) => ipcRenderer.invoke('toggle-todo', id),
  deleteTodo: (id: number) => ipcRenderer.invoke('delete-todo', id),
  editTodo: (id: number, text: string) => ipcRenderer.invoke('edit-todo', id, text),
  clearCompleted: () => ipcRenderer.invoke('clear-completed'),

  // 应用信息
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),

  // 数据导入导出
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: (data: { todos: Todo[] }) => ipcRenderer.invoke('import-data', data),

  // 通知
  showNotification: (message: string) => ipcRenderer.send('show-notification', message),

  // 事件监听
  onFocusInput: (callback: () => void) => {
    ipcRenderer.on('focus-input', () => callback());
  },
  onExportTodos: (callback: (todos: Todo[]) => void) => {
    ipcRenderer.on('export-todos', (_, todos) => callback(todos));
  },
  onImportTodos: (callback: () => void) => {
    ipcRenderer.on('import-todos', () => callback());
  },
  onShowAbout: (callback: () => void) => {
    ipcRenderer.on('show-about', () => callback());
  },
  onNotification: (callback: (message: string) => void) => {
    ipcRenderer.on('notification', (_, message) => callback(message));
  },
};

// 使用 contextBridge 暴露 API
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// 类型声明（用于 TypeScript）
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
