import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, shell } from 'electron';
import path from 'path';
import fs from 'fs';

// 定义 Todo 类型
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

// 全局变量
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
const isDevelopment = process.env.NODE_ENV !== 'production';
const userDataPath = app.getPath('userData');
const todosFilePath = path.join(userDataPath, 'todos.json');

// 创建主窗口
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    title: 'Electron Vue Todo',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
    backgroundColor: '#ffffff',
  });

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // 加载应用
  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 创建应用菜单
  createMenu();

  // 窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 阻止外部链接在应用内打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 创建系统托盘
function createTray(): void {
  // 创建托盘图标（使用简单的方式创建图标）
  const iconPath = path.join(__dirname, '../public/icon.png');
  let trayIcon: nativeImage;

  if (fs.existsSync(iconPath)) {
    trayIcon = nativeImage.createFromPath(iconPath);
  } else {
    // 如果图标文件不存在，创建一个简单的图标
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示应用',
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: '隐藏应用',
      click: () => {
        mainWindow?.hide();
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Electron Vue Todo');
  tray.setContextMenu(contextMenu);

  // 点击托盘图标显示窗口
  tray.on('click', () => {
    mainWindow?.isVisible() ? mainWindow.hide() : mainWindow?.show();
  });
}

// 创建应用菜单
function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建待办',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('focus-input');
          },
        },
        { type: 'separator' },
        {
          label: '导出数据',
          click: async () => {
            const todos = await loadTodos();
            mainWindow?.webContents.send('export-todos', todos);
          },
        },
        {
          label: '导入数据',
          click: () => {
            mainWindow?.webContents.send('import-todos');
          },
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' },
      ],
    },
    {
      label: '查看',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '切换开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' },
      ],
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'close', label: '关闭' },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            mainWindow?.webContents.send('show-about');
          },
        },
        {
          label: '学习更多',
          click: async () => {
            await shell.openExternal('https://electronjs.org');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 文件系统操作 - 加载 Todos
async function loadTodos(): Promise<Todo[]> {
  try {
    if (fs.existsSync(todosFilePath)) {
      const data = fs.readFileSync(todosFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
}

// 文件系统操作 - 保存 Todos
async function saveTodos(todos: Todo[]): Promise<void> {
  try {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving todos:', error);
    throw error;
  }
}

// IPC 处理器设置
function setupIpcHandlers(): void {
  // 获取所有待办事项
  ipcMain.handle('get-todos', async () => {
    return await loadTodos();
  });

  // 保存所有待办事项
  ipcMain.handle('save-todos', async (_, todos: Todo[]) => {
    await saveTodos(todos);
    return { success: true };
  });

  // 添加待办事项
  ipcMain.handle('add-todo', async (_, text: string) => {
    const todos = await loadTodos();
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    todos.push(newTodo);
    await saveTodos(todos);
    return newTodo;
  });

  // 切换待办事项完成状态
  ipcMain.handle('toggle-todo', async (_, id: number) => {
    const todos = await loadTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      await saveTodos(todos);
      return todo;
    }
    return null;
  });

  // 删除待办事项
  ipcMain.handle('delete-todo', async (_, id: number) => {
    let todos = await loadTodos();
    todos = todos.filter(t => t.id !== id);
    await saveTodos(todos);
    return { success: true };
  });

  // 编辑待办事项
  ipcMain.handle('edit-todo', async (_, id: number, text: string) => {
    const todos = await loadTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.text = text;
      await saveTodos(todos);
      return todo;
    }
    return null;
  });

  // 清除已完成的待办事项
  ipcMain.handle('clear-completed', async () => {
    let todos = await loadTodos();
    todos = todos.filter(t => !t.completed);
    await saveTodos(todos);
    return { success: true };
  });

  // 获取应用信息
  ipcMain.handle('get-app-info', () => {
    return {
      version: app.getVersion(),
      name: app.getName(),
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      node: process.versions.node,
      v8: process.versions.v8,
    };
  });

  // 导出数据
  ipcMain.handle('export-data', async () => {
    const todos = await loadTodos();
    return {
      todos,
      exportDate: new Date().toISOString(),
      version: app.getVersion(),
    };
  });

  // 导入数据
  ipcMain.handle('import-data', async (_, data: { todos: Todo[] }) => {
    if (data.todos && Array.isArray(data.todos)) {
      await saveTodos(data.todos);
      return { success: true };
    }
    throw new Error('Invalid data format');
  });

  // 显示通知
  ipcMain.on('show-notification', (_, message: string) => {
    if (mainWindow) {
      mainWindow.webContents.send('notification', message);
    }
  });
}

// 应用准备就绪
app.whenReady().then(() => {
  createWindow();
  createTray();
  setupIpcHandlers();

  // macOS 特定行为
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用退出前清理
app.on('will-quit', () => {
  // 清理资源
  tray?.destroy();
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
