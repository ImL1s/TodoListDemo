import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from 'electron';
import { join } from 'node:path';
import Store from 'electron-store';

// Electron Store for persistent data
interface TodoStore {
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
  }>;
}

const store = new Store<TodoStore>({
  defaults: {
    todos: [],
  },
});

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST, '../public');

let win: BrowserWindow | null;
let tray: Tray | null = null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 400,
    icon: join(process.env.VITE_PUBLIC!, 'electron-vite.svg'),
    title: 'Electron React Todo',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/security
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Custom title bar styling
    titleBarStyle: 'default',
    backgroundColor: '#f5f5f5',
    show: false, // Don't show until ready
  });

  // Show window when ready
  win.once('ready-to-show', () => {
    win?.show();
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(process.env.DIST!, 'index.html'));
  }

  // Make all links open in external browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      require('electron').shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Create application menu
  createMenu();

  // Prevent window from closing, minimize to tray instead
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      win?.hide();
    }
    return false;
  });
}

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Todo',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            win?.webContents.send('menu-new-todo');
          },
        },
        { type: 'separator' },
        {
          label: 'Clear Completed',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => {
            win?.webContents.send('menu-clear-completed');
          },
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.isQuitting = true;
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        {
          label: 'Show App',
          click: () => {
            win?.show();
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://www.electronjs.org');
          },
        },
        {
          label: 'About',
          click: () => {
            require('electron').dialog.showMessageBox({
              type: 'info',
              title: 'About Electron React Todo',
              message: 'Electron React Todo',
              detail: 'Version 1.0.0\n\nA beautiful Todo List desktop application built with Electron and React.',
              buttons: ['OK'],
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createTray() {
  // Create a simple icon for the tray
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGQSURBVFhH7ZbBTcNAEEVnSQWUQAekg5AOSAekg9AB6YB0QDogHZAOoAPSAR1AB7wvzdqK5fU6Xp+QjvQkS/bs7H/ztlk7IYTw7/j8+ChLS0tqMBioq6srdXh4qJ6entTDw4N6eXlRt7e36v7+Xt3c3KiLiwt1dnamnp+f1enpqVpfX1eLi4tqaWlJra6uqo2NDbW5ual2dnbU7u6u2t/fV0dHR+rk5ESdnp6q4+NjdXR0pPb29tTBwYE6PDxUh4eHan9/X+3t7am9vT11cHCgDg4O1P7+vtrb21N7e3vq4OBAHRwcqP39fbW/v6/29vbU3t6e2t/fV/v7+2pvb0/t7e2pvb09tb+/r/b399Xe3p7a29tTe3t7am9vT+3v76v9/X21t7en9vb21N7entrf31f7+/tqb29P7e3tqb29PbW/v6/29/fV3t6e2tvbU3t7e2pvb0/t7++r/f19tbe3p/b29tTe3p7a399X+/v7am9vT+3t7am9vT21t7en9vb21P7+vtrb21N7e3tqb29P7e3tqb29PbW/v6/29vbU3t6e2tvbU3t7e2pvb09tbW2FEEKYir5+AJTfLFHW1+WyAAAAAElFTkSuQmCC'
  );

  tray = new Tray(icon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        win?.show();
      },
    },
    {
      label: 'Hide App',
      click: () => {
        win?.hide();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Electron React Todo');
  tray.setContextMenu(contextMenu);

  // Show window on tray icon click
  tray.on('click', () => {
    if (win?.isVisible()) {
      win?.hide();
    } else {
      win?.show();
    }
  });
}

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  createTray();
});

// IPC Handlers for Todo CRUD operations

// Get all todos
ipcMain.handle('get-todos', async () => {
  try {
    return store.get('todos', []);
  } catch (error) {
    console.error('Error getting todos:', error);
    return [];
  }
});

// Add a new todo
ipcMain.handle('add-todo', async (_, text: string) => {
  try {
    const todos = store.get('todos', []);
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    todos.push(newTodo);
    store.set('todos', todos);
    return newTodo;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
});

// Toggle todo completion
ipcMain.handle('toggle-todo', async (_, id: string) => {
  try {
    const todos = store.get('todos', []);
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      todos[todoIndex].completed = !todos[todoIndex].completed;
      store.set('todos', todos);
      return todos[todoIndex];
    }
    throw new Error('Todo not found');
  } catch (error) {
    console.error('Error toggling todo:', error);
    throw error;
  }
});

// Delete a todo
ipcMain.handle('delete-todo', async (_, id: string) => {
  try {
    const todos = store.get('todos', []);
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    store.set('todos', filteredTodos);
    return { success: true };
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
});

// Update todo text
ipcMain.handle('update-todo', async (_, id: string, text: string) => {
  try {
    const todos = store.get('todos', []);
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      todos[todoIndex].text = text;
      store.set('todos', todos);
      return todos[todoIndex];
    }
    throw new Error('Todo not found');
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
});

// Clear completed todos
ipcMain.handle('clear-completed', async () => {
  try {
    const todos = store.get('todos', []);
    const activeTodos = todos.filter((todo) => !todo.completed);
    store.set('todos', activeTodos);
    return { success: true };
  } catch (error) {
    console.error('Error clearing completed todos:', error);
    throw error;
  }
});

// Get stats
ipcMain.handle('get-stats', async () => {
  try {
    const todos = store.get('todos', []);
    return {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      active: todos.filter((todo) => !todo.completed).length,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return { total: 0, completed: 0, active: 0 };
  }
});

// Custom app.isQuitting flag
declare module 'electron' {
  interface App {
    isQuitting?: boolean;
  }
}
