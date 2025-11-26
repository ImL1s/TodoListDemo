import { Tray, Menu, BrowserWindow, nativeImage, app } from 'electron'
import * as path from 'path'

export function createTray(mainWindow: BrowserWindow | null): Tray {
  // Create tray icon (you may need to adjust the path)
  const iconPath = path.join(__dirname, '../public/tray-icon.png')
  let trayIcon: nativeImage

  try {
    trayIcon = nativeImage.createFromPath(iconPath)
  } catch {
    // Fallback: create a simple tray icon programmatically
    trayIcon = nativeImage.createEmpty()
  }

  const tray = new Tray(trayIcon)

  // Build the context menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
      }
    },
    {
      label: 'New Todo',
      accelerator: 'CommandOrControl+N',
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
        mainWindow?.webContents.send('shortcut:new-todo')
      }
    },
    { type: 'separator' },
    {
      label: 'Quick Add',
      submenu: [
        {
          label: 'Add "Check emails"',
          click: () => {
            mainWindow?.webContents.send('tray:quick-add', 'Check emails')
          }
        },
        {
          label: 'Add "Team meeting"',
          click: () => {
            mainWindow?.webContents.send('tray:quick-add', 'Team meeting')
          }
        },
        {
          label: 'Add "Review code"',
          click: () => {
            mainWindow?.webContents.send('tray:quick-add', 'Review code')
          }
        }
      ]
    },
    { type: 'separator' },
    {
      label: 'Filters',
      submenu: [
        {
          label: 'All',
          click: () => {
            mainWindow?.show()
            mainWindow?.webContents.send('menu:filter', 'all')
          }
        },
        {
          label: 'Active',
          click: () => {
            mainWindow?.show()
            mainWindow?.webContents.send('menu:filter', 'active')
          }
        },
        {
          label: 'Completed',
          click: () => {
            mainWindow?.show()
            mainWindow?.webContents.send('menu:filter', 'completed')
          }
        }
      ]
    },
    { type: 'separator' },
    {
      label: `Version ${app.getVersion()}`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('Vue Todo List')
  tray.setContextMenu(contextMenu)

  // Double-click to show window
  tray.on('double-click', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  return tray
}
