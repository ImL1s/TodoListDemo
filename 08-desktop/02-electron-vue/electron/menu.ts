import { Menu, BrowserWindow, shell, app } from 'electron'

export function createMenu(mainWindow: BrowserWindow): Menu {
  const isMac = process.platform === 'darwin'

  const template: any[] = [
    // App menu (macOS only)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),

    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'New Todo',
          accelerator: 'CommandOrControl+N',
          click: () => {
            mainWindow.webContents.send('shortcut:new-todo')
          }
        },
        { type: 'separator' },
        {
          label: 'Clear Completed',
          click: () => {
            mainWindow.webContents.send('menu:clear-completed')
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },

    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },

    // View menu
    {
      label: 'View',
      submenu: [
        {
          label: 'Show All',
          click: () => {
            mainWindow.webContents.send('menu:filter', 'all')
          }
        },
        {
          label: 'Show Active',
          click: () => {
            mainWindow.webContents.send('menu:filter', 'active')
          }
        },
        {
          label: 'Show Completed',
          click: () => {
            mainWindow.webContents.send('menu:filter', 'completed')
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },

    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },

    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://vuejs.org/')
          }
        },
        {
          label: 'Electron Documentation',
          click: async () => {
            await shell.openExternal('https://www.electronjs.org/docs')
          }
        },
        { type: 'separator' },
        {
          label: 'Search Issues',
          click: async () => {
            await shell.openExternal('https://github.com/vuejs/core/issues')
          }
        }
      ]
    }
  ]

  return Menu.buildFromTemplate(template)
}
