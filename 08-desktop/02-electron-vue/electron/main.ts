import { app, BrowserWindow, ipcMain, Menu, Tray, globalShortcut, nativeImage } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { createMenu } from './menu'
import { createTray } from './tray'

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit()
}

const isDev = process.env.NODE_ENV === 'development'
const DATA_PATH = path.join(app.getPath('userData'), 'todos.json')

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    title: 'Vue Todo List',
    icon: path.join(__dirname, '../public/icon.png')
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Set up the application menu
  const menu = createMenu(mainWindow)
  Menu.setApplicationMenu(menu)

  // Handle window close
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
    return false
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Create system tray
function setupTray() {
  tray = createTray(mainWindow)
}

// Register global shortcuts
function registerShortcuts() {
  // Toggle window visibility
  globalShortcut.register('CommandOrControl+Shift+T', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })

  // Create new todo
  globalShortcut.register('CommandOrControl+N', () => {
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
      mainWindow.webContents.send('shortcut:new-todo')
    }
  })

  // Search/Filter
  globalShortcut.register('CommandOrControl+F', () => {
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.webContents.send('shortcut:focus-search')
    }
  })
}

// App lifecycle
app.whenReady().then(() => {
  createWindow()
  setupTray()
  registerShortcuts()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  app.isQuitting = true
})

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll()
})

// IPC Handlers for file operations
ipcMain.handle('todos:load', async () => {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const data = fs.readFileSync(DATA_PATH, 'utf-8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error loading todos:', error)
    return []
  }
})

ipcMain.handle('todos:save', async (_event, todos) => {
  try {
    const dir = path.dirname(DATA_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(todos, null, 2), 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('Error saving todos:', error)
    return { success: false, error: String(error) }
  }
})

// Window management IPC handlers
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.hide()
})

ipcMain.handle('window:show', () => {
  mainWindow?.show()
  mainWindow?.focus()
})

// Get app info
ipcMain.handle('app:getPath', (_event, name: string) => {
  return app.getPath(name as any)
})

ipcMain.handle('app:getVersion', () => {
  return app.getVersion()
})
