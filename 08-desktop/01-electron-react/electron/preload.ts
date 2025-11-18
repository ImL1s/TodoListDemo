import { contextBridge, ipcRenderer } from 'electron';

// Define the API interface
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

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  // Todo operations
  getTodos: () => ipcRenderer.invoke('get-todos'),
  addTodo: (text: string) => ipcRenderer.invoke('add-todo', text),
  toggleTodo: (id: string) => ipcRenderer.invoke('toggle-todo', id),
  deleteTodo: (id: string) => ipcRenderer.invoke('delete-todo', id),
  updateTodo: (id: string, text: string) =>
    ipcRenderer.invoke('update-todo', id, text),
  clearCompleted: () => ipcRenderer.invoke('clear-completed'),
  getStats: () => ipcRenderer.invoke('get-stats'),

  // Menu events
  onMenuNewTodo: (callback: () => void) => {
    ipcRenderer.on('menu-new-todo', callback);
  },
  onMenuClearCompleted: (callback: () => void) => {
    ipcRenderer.on('menu-clear-completed', callback);
  },

  // Remove listeners
  removeMenuListeners: () => {
    ipcRenderer.removeAllListeners('menu-new-todo');
    ipcRenderer.removeAllListeners('menu-clear-completed');
  },
} as ElectronAPI);

// --------- Preload scripts loading ---------
function domReady(
  condition: DocumentReadyState[] = ['complete', 'interactive']
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #4f46e5;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);
