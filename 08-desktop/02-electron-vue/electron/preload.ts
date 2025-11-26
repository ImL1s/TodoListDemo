import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Todo operations
  loadTodos: () => ipcRenderer.invoke('todos:load'),
  saveTodos: (todos: any[]) => ipcRenderer.invoke('todos:save', todos),

  // Window management
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  showWindow: () => ipcRenderer.invoke('window:show'),

  // App info
  getAppPath: (name: string) => ipcRenderer.invoke('app:getPath', name),
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),

  // Shortcut listeners
  onNewTodo: (callback: () => void) => {
    ipcRenderer.on('shortcut:new-todo', callback)
    return () => ipcRenderer.removeListener('shortcut:new-todo', callback)
  },

  onFocusSearch: (callback: () => void) => {
    ipcRenderer.on('shortcut:focus-search', callback)
    return () => ipcRenderer.removeListener('shortcut:focus-search', callback)
  },

  // Platform info
  platform: process.platform
})

// TypeScript type definitions for the exposed API
export interface ElectronAPI {
  loadTodos: () => Promise<any[]>
  saveTodos: (todos: any[]) => Promise<{ success: boolean; error?: string }>
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  showWindow: () => Promise<void>
  getAppPath: (name: string) => Promise<string>
  getAppVersion: () => Promise<string>
  onNewTodo: (callback: () => void) => () => void
  onFocusSearch: (callback: () => void) => () => void
  platform: string
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
