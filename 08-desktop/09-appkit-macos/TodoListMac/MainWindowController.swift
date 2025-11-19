//
//  MainWindowController.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Cocoa

class MainWindowController: NSWindowController {

    // MARK: - Properties

    private var toolbar: NSToolbar?

    // MARK: - Lifecycle

    override func windowDidLoad() {
        super.windowDidLoad()

        configureWindow()
        setupToolbar()
        setupObservers()
    }

    // MARK: - Configuration

    private func configureWindow() {
        guard let window = window else { return }

        // Set window properties
        window.title = "Todo List"
        window.minSize = NSSize(width: 600, height: 400)
        window.setContentSize(NSSize(width: 800, height: 600))

        // Enable window state restoration
        window.isRestorable = true
        window.identifier = NSUserInterfaceItemIdentifier("MainWindow")
        window.frameAutosaveName = "MainWindowFrame"

        // Center on screen if first launch
        if window.frameAutosaveName.isEmpty {
            window.center()
        }

        // Configure title bar
        window.titlebarAppearsTransparent = false
        window.titleVisibility = .visible

        // Enable full screen
        window.collectionBehavior = [.fullScreenPrimary]

        // Set window appearance
        configureAppearance()
    }

    private func configureAppearance() {
        guard let window = window else { return }

        // Support vibrant appearance
        if let contentView = window.contentView {
            let visualEffectView = NSVisualEffectView(frame: contentView.bounds)
            visualEffectView.autoresizingMask = [.width, .height]
            visualEffectView.material = .contentBackground
            visualEffectView.state = .followsWindowActiveState
            visualEffectView.blendingMode = .behindWindow

            // Insert as background
            contentView.addSubview(visualEffectView, positioned: .below, relativeTo: contentView.subviews.first)
        }
    }

    private func setupToolbar() {
        toolbar = NSToolbar(identifier: "MainToolbar")
        toolbar?.delegate = self
        toolbar?.displayMode = .iconAndLabel
        toolbar?.allowsUserCustomization = true
        toolbar?.autosavesConfiguration = true

        window?.toolbar = toolbar
    }

    private func setupObservers() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(todosDidChange),
            name: TodoManager.todosDidChangeNotification,
            object: nil
        )
    }

    // MARK: - Observers

    @objc private func todosDidChange(_ notification: Notification) {
        updateWindowTitle()
    }

    private func updateWindowTitle() {
        let stats = TodoService.shared.getProductivityStats()
        window?.title = "Todo List - \(stats.activeTodos) active"
    }

    // MARK: - Window Delegate

    override func windowWillClose(_ notification: Notification) {
        // Cleanup if needed
        NotificationCenter.default.removeObserver(self)
    }
}

// MARK: - NSToolbarDelegate

extension MainWindowController: NSToolbarDelegate {

    func toolbar(_ toolbar: NSToolbar, itemForItemIdentifier itemIdentifier: NSToolbarItem.Identifier, willBeInsertedIntoToolbar flag: Bool) -> NSToolbarItem? {

        switch itemIdentifier {
        case .newTodo:
            let item = NSToolbarItem(itemIdentifier: itemIdentifier)
            item.label = "New Todo"
            item.paletteLabel = "New Todo"
            item.toolTip = "Create a new todo"
            item.image = NSImage(systemSymbolName: "plus", accessibilityDescription: "New Todo")
            item.action = #selector(newTodoAction)
            item.target = self
            return item

        case .clearCompleted:
            let item = NSToolbarItem(itemIdentifier: itemIdentifier)
            item.label = "Clear Completed"
            item.paletteLabel = "Clear Completed"
            item.toolTip = "Remove all completed todos"
            item.image = NSImage(systemSymbolName: "trash", accessibilityDescription: "Clear Completed")
            item.action = #selector(clearCompletedAction)
            item.target = self
            return item

        case .filter:
            let item = NSToolbarItem(itemIdentifier: itemIdentifier)
            item.label = "Filter"
            item.paletteLabel = "Filter"

            let segmentedControl = NSSegmentedControl(
                labels: ["All", "Active", "Completed"],
                trackingMode: .selectOne,
                target: self,
                action: #selector(filterAction)
            )
            segmentedControl.selectedSegment = 0
            segmentedControl.segmentStyle = .texturedRounded

            item.view = segmentedControl
            return item

        case .search:
            let item = NSSearchToolbarItem(itemIdentifier: itemIdentifier)
            item.searchField.placeholderString = "Search todos..."
            item.searchField.action = #selector(searchAction)
            item.searchField.target = self
            return item

        case .statistics:
            let item = NSToolbarItem(itemIdentifier: itemIdentifier)
            item.label = "Statistics"
            item.paletteLabel = "Statistics"
            item.toolTip = "View todo statistics"
            item.image = NSImage(systemSymbolName: "chart.bar", accessibilityDescription: "Statistics")
            item.action = #selector(statisticsAction)
            item.target = self
            return item

        default:
            return nil
        }
    }

    func toolbarDefaultItemIdentifiers(_ toolbar: NSToolbar) -> [NSToolbarItem.Identifier] {
        return [
            .newTodo,
            .space,
            .filter,
            .flexibleSpace,
            .search,
            .space,
            .clearCompleted
        ]
    }

    func toolbarAllowedItemIdentifiers(_ toolbar: NSToolbar) -> [NSToolbarItem.Identifier] {
        return [
            .newTodo,
            .clearCompleted,
            .filter,
            .search,
            .statistics,
            .space,
            .flexibleSpace
        ]
    }

    // MARK: - Toolbar Actions

    @objc private func newTodoAction(_ sender: Any) {
        NotificationCenter.default.post(name: NSNotification.Name("NewTodoRequested"), object: nil)
    }

    @objc private func clearCompletedAction(_ sender: Any) {
        TodoManager.shared.clearCompleted()
    }

    @objc private func filterAction(_ sender: NSSegmentedControl) {
        let filters: [TodoFilter] = [.all, .active, .completed]
        let selectedFilter = filters[sender.selectedSegment]
        TodoManager.shared.setFilter(selectedFilter)
    }

    @objc private func searchAction(_ sender: NSSearchField) {
        NotificationCenter.default.post(
            name: NSNotification.Name("SearchQueryChanged"),
            object: sender.stringValue
        )
    }

    @objc private func statisticsAction(_ sender: Any) {
        showStatistics()
    }

    private func showStatistics() {
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

        if let window = window {
            alert.beginSheetModal(for: window) { _ in }
        }
    }
}

// MARK: - NSToolbarItem Identifiers

extension NSToolbarItem.Identifier {
    static let newTodo = NSToolbarItem.Identifier("newTodo")
    static let clearCompleted = NSToolbarItem.Identifier("clearCompleted")
    static let filter = NSToolbarItem.Identifier("filter")
    static let search = NSToolbarItem.Identifier("search")
    static let statistics = NSToolbarItem.Identifier("statistics")
}
