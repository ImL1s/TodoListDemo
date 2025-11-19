//
//  AppDelegate.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {

    // MARK: - Properties

    var mainWindow: NSWindow?

    // MARK: - Application Lifecycle

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // Configure application appearance
        configureAppearance()

        // Setup menu bar
        setupMenuBar()

        // Register for system notifications
        registerNotifications()

        // Restore window state
        restoreWindowState()

        print("TodoListMac application launched successfully")
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Save any pending changes
        saveApplicationState()

        // Remove observers
        DistributedNotificationCenter.default.removeObserver(self)

        print("TodoListMac application terminating")
    }

    func applicationSupportsSecureRestorableState(_ app: NSApplication) -> Bool {
        return true
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }

    // MARK: - Setup

    private func configureAppearance() {
        // Allow automatic appearance changes (light/dark mode)
        NSApp.appearance = nil

        // Configure default font rendering
        NSFont.setUserFont(NSFont.systemFont(ofSize: NSFont.systemFontSize), for: .application)
    }

    private func setupMenuBar() {
        // Get the main menu
        guard let mainMenu = NSApp.mainMenu else { return }

        // Add custom menu items
        setupFileMenu(mainMenu)
        setupEditMenu(mainMenu)
        setupViewMenu(mainMenu)
        setupWindowMenu(mainMenu)
        setupHelpMenu(mainMenu)
    }

    private func setupFileMenu(_ mainMenu: NSMenu) {
        // File menu
        if let fileMenu = mainMenu.item(withTitle: "File")?.submenu {
            // Add custom file menu items
            let newTodoItem = NSMenuItem(
                title: "New Todo",
                action: #selector(newTodo(_:)),
                keyEquivalent: "n"
            )
            fileMenu.insertItem(newTodoItem, at: 0)

            fileMenu.insertItem(NSMenuItem.separator(), at: 1)

            let importItem = NSMenuItem(
                title: "Import Todos...",
                action: #selector(importTodos(_:)),
                keyEquivalent: "i"
            )
            importItem.keyEquivalentModifierMask = [.command, .shift]
            fileMenu.insertItem(importItem, at: 2)

            let exportItem = NSMenuItem(
                title: "Export Todos...",
                action: #selector(exportTodos(_:)),
                keyEquivalent: "e"
            )
            exportItem.keyEquivalentModifierMask = [.command, .shift]
            fileMenu.insertItem(exportItem, at: 3)

            fileMenu.insertItem(NSMenuItem.separator(), at: 4)
        }
    }

    private func setupEditMenu(_ mainMenu: NSMenu) {
        // Edit menu is automatically managed by AppKit
        // Add custom edit menu items if needed
        if let editMenu = mainMenu.item(withTitle: "Edit")?.submenu {
            let findItem = NSMenuItem(
                title: "Find...",
                action: #selector(showSearch(_:)),
                keyEquivalent: "f"
            )
            editMenu.addItem(NSMenuItem.separator())
            editMenu.addItem(findItem)
        }
    }

    private func setupViewMenu(_ mainMenu: NSMenu) {
        // Create View menu
        let viewMenu = NSMenu(title: "View")
        let viewMenuItem = NSMenuItem(title: "View", action: nil, keyEquivalent: "")
        viewMenuItem.submenu = viewMenu

        // Add filter options
        let showAllItem = NSMenuItem(
            title: "Show All",
            action: #selector(showAllTodos(_:)),
            keyEquivalent: "1"
        )
        showAllItem.keyEquivalentModifierMask = .command
        viewMenu.addItem(showAllItem)

        let showActiveItem = NSMenuItem(
            title: "Show Active",
            action: #selector(showActiveTodos(_:)),
            keyEquivalent: "2"
        )
        showActiveItem.keyEquivalentModifierMask = .command
        viewMenu.addItem(showActiveItem)

        let showCompletedItem = NSMenuItem(
            title: "Show Completed",
            action: #selector(showCompletedTodos(_:)),
            keyEquivalent: "3"
        )
        showCompletedItem.keyEquivalentModifierMask = .command
        viewMenu.addItem(showCompletedItem)

        viewMenu.addItem(NSMenuItem.separator())

        // Add appearance toggle
        let toggleDarkModeItem = NSMenuItem(
            title: "Toggle Dark Mode",
            action: #selector(toggleDarkMode(_:)),
            keyEquivalent: "d"
        )
        toggleDarkModeItem.keyEquivalentModifierMask = [.command, .option]
        viewMenu.addItem(toggleDarkModeItem)

        // Insert before Window menu
        if let windowIndex = mainMenu.indexOfItem(withTitle: "Window") {
            mainMenu.insertItem(viewMenuItem, at: windowIndex)
        } else {
            mainMenu.addItem(viewMenuItem)
        }
    }

    private func setupWindowMenu(_ mainMenu: NSMenu) {
        // Window menu is automatically managed by AppKit
    }

    private func setupHelpMenu(_ mainMenu: NSMenu) {
        // Help menu
        if let helpMenu = mainMenu.item(withTitle: "Help")?.submenu {
            let showStatsItem = NSMenuItem(
                title: "Show Statistics",
                action: #selector(showStatistics(_:)),
                keyEquivalent: ""
            )
            helpMenu.insertItem(showStatsItem, at: 0)
            helpMenu.insertItem(NSMenuItem.separator(), at: 1)
        }
    }

    private func registerNotifications() {
        // Register for system appearance changes
        DistributedNotificationCenter.default.addObserver(
            self,
            selector: #selector(systemAppearanceChanged(_:)),
            name: NSNotification.Name("AppleInterfaceThemeChangedNotification"),
            object: nil
        )
    }

    private func restoreWindowState() {
        // Window state restoration is handled by NSWindowRestoration
        // Additional custom restoration logic can be added here
    }

    private func saveApplicationState() {
        // Save any pending changes
        // The TodoManager automatically saves on changes
        UserDefaults.standard.synchronize()
    }

    // MARK: - Menu Actions

    @objc func newTodo(_ sender: Any) {
        // Forward to main view controller
        NotificationCenter.default.post(name: NSNotification.Name("NewTodoRequested"), object: nil)
    }

    @objc func importTodos(_ sender: Any) {
        NotificationCenter.default.post(name: NSNotification.Name("ImportTodosRequested"), object: nil)
    }

    @objc func exportTodos(_ sender: Any) {
        NotificationCenter.default.post(name: NSNotification.Name("ExportTodosRequested"), object: nil)
    }

    @objc func showSearch(_ sender: Any) {
        NotificationCenter.default.post(name: NSNotification.Name("ShowSearchRequested"), object: nil)
    }

    @objc func showAllTodos(_ sender: Any) {
        TodoManager.shared.setFilter(.all)
    }

    @objc func showActiveTodos(_ sender: Any) {
        TodoManager.shared.setFilter(.active)
    }

    @objc func showCompletedTodos(_ sender: Any) {
        TodoManager.shared.setFilter(.completed)
    }

    @objc func toggleDarkMode(_ sender: Any) {
        if NSApp.effectiveAppearance.name == .darkAqua {
            NSApp.appearance = NSAppearance(named: .aqua)
        } else {
            NSApp.appearance = NSAppearance(named: .darkAqua)
        }
    }

    @objc func showStatistics(_ sender: Any) {
        showStatisticsWindow()
    }

    @objc func systemAppearanceChanged(_ notification: Notification) {
        // Handle system appearance changes
        print("System appearance changed")
    }

    // MARK: - Statistics Window

    private func showStatisticsWindow() {
        let stats = TodoService.shared.getProductivityStats()

        let alert = NSAlert()
        alert.messageText = "Todo Statistics"
        alert.informativeText = """
        Total Todos: \(stats.totalTodos)
        Active: \(stats.activeTodos)
        Completed: \(stats.completedTodos)
        Completion Rate: \(stats.completionPercentage)

        High Priority: \(stats.highPriorityCount)
        Medium Priority: \(stats.mediumPriorityCount)
        Low Priority: \(stats.lowPriorityCount)

        Average Completion Time: \(stats.averageCompletionTimeFormatted)
        """
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")

        if let window = mainWindow {
            alert.beginSheetModal(for: window) { _ in }
        } else {
            alert.runModal()
        }
    }

    // MARK: - Application Menu Validation

    func validateMenuItem(_ menuItem: NSMenuItem) -> Bool {
        // Enable/disable menu items based on application state
        return true
    }
}

// MARK: - NSApplicationDelegate Extensions

extension AppDelegate {

    func application(_ sender: NSApplication, openFile filename: String) -> Bool {
        // Handle opening files (e.g., dragging a JSON file onto the app icon)
        let url = URL(fileURLWithPath: filename)

        if url.pathExtension == "json" {
            do {
                let data = try Data(contentsOf: url)
                if TodoManager.shared.importTodos(from: data) {
                    showAlert(title: "Success", message: "Todos imported successfully!")
                    return true
                }
            } catch {
                showAlert(title: "Error", message: "Failed to import todos: \(error.localizedDescription)")
            }
        }

        return false
    }

    private func showAlert(title: String, message: String) {
        let alert = NSAlert()
        alert.messageText = title
        alert.informativeText = message
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")

        if let window = mainWindow {
            alert.beginSheetModal(for: window) { _ in }
        } else {
            alert.runModal()
        }
    }
}
