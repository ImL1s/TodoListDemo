//
//  MainViewController.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Cocoa

class MainViewController: NSViewController {

    // MARK: - IBOutlets

    @IBOutlet weak var tableView: NSTableView!
    @IBOutlet weak var inputField: NSTextField!
    @IBOutlet weak var addButton: NSButton!
    @IBOutlet weak var filterSegmentedControl: NSSegmentedControl!
    @IBOutlet weak var sortPopUpButton: NSPopUpButton!
    @IBOutlet weak var statusLabel: NSTextField!
    @IBOutlet weak var clearCompletedButton: NSButton!
    @IBOutlet weak var searchField: NSSearchField!

    // MARK: - Properties

    private let todoManager = TodoManager.shared
    private let todoService = TodoService.shared

    /// Filtered and sorted todos for display
    private var displayedTodos: [TodoItem] = []

    /// Search query
    private var searchQuery: String = ""

    /// KVO observation token
    private var todosObservation: NSKeyValueObservation?

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()

        setupTableView()
        setupUI()
        setupObservers()
        setupKeyboardShortcuts()

        refreshDisplayedTodos()
        updateStatusLabel()
    }

    override func viewWillAppear() {
        super.viewWillAppear()

        // Center window on first launch
        if let window = view.window, window.frameAutosaveName.isEmpty {
            window.centerOnScreen()
        }
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
        todosObservation?.invalidate()
    }

    // MARK: - Setup

    private func setupTableView() {
        tableView.delegate = self
        tableView.dataSource = self

        // Register cell XIB
        let nib = NSNib(nibNamed: "TodoTableCellView", bundle: nil)
        tableView.register(nib, forIdentifier: NSUserInterfaceItemIdentifier("TodoCell"))

        // Configure table view
        tableView.rowHeight = 44
        tableView.usesAutomaticRowHeights = false
        tableView.selectionHighlightStyle = .regular
        tableView.allowsEmptySelection = true
        tableView.allowsMultipleSelection = true

        // Enable drag and drop (for reordering)
        tableView.registerForDraggedTypes([.string])
    }

    private func setupUI() {
        // Configure input field
        inputField.delegate = self
        inputField.placeholderString = "What needs to be done?"

        // Configure search field
        searchField.delegate = self
        searchField.placeholderString = "Search todos..."

        // Configure filter segmented control
        filterSegmentedControl.segmentCount = 3
        filterSegmentedControl.setLabel("All", forSegment: 0)
        filterSegmentedControl.setLabel("Active", forSegment: 1)
        filterSegmentedControl.setLabel("Completed", forSegment: 2)
        filterSegmentedControl.selectedSegment = 0

        // Configure sort popup button
        sortPopUpButton.removeAllItems()
        for sortOption in TodoSort.allCases {
            sortPopUpButton.addItem(withTitle: sortOption.rawValue)
        }

        // Style buttons
        addButton.bezelStyle = .rounded
        clearCompletedButton.bezelStyle = .rounded
    }

    private func setupObservers() {
        // Observe todos changes using KVO
        todosObservation = todoManager.observe(\.todos, options: [.new]) { [weak self] _, _ in
            DispatchQueue.main.async {
                self?.refreshDisplayedTodos()
                self?.updateStatusLabel()
            }
        }

        // Observe notifications
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(todosDidChange),
            name: TodoManager.todosDidChangeNotification,
            object: nil
        )
    }

    private func setupKeyboardShortcuts() {
        // Add keyboard shortcuts
        NSEvent.addLocalMonitorForEvents(matching: .keyDown) { [weak self] event in
            return self?.handleKeyDown(event) ?? event
        }
    }

    // MARK: - Actions

    @IBAction func addButtonClicked(_ sender: NSButton) {
        addNewTodo()
    }

    @IBAction func filterChanged(_ sender: NSSegmentedControl) {
        let filterIndex = sender.selectedSegment
        let filters: [TodoFilter] = [.all, .active, .completed]

        if filterIndex < filters.count {
            todoManager.setFilter(filters[filterIndex])
            refreshDisplayedTodos()
        }
    }

    @IBAction func sortChanged(_ sender: NSPopUpButton) {
        guard let selectedTitle = sender.selectedItem?.title,
              let sort = TodoSort(rawValue: selectedTitle) else { return }

        todoManager.setSort(sort)
        refreshDisplayedTodos()
    }

    @IBAction func clearCompletedClicked(_ sender: NSButton) {
        showConfirmationDialog(
            title: "Clear Completed",
            message: "Are you sure you want to remove all completed todos?",
            confirmButtonTitle: "Clear"
        ) { [weak self] confirmed in
            if confirmed {
                self?.todoManager.clearCompleted()
            }
        }
    }

    @IBAction func searchFieldChanged(_ sender: NSSearchField) {
        searchQuery = sender.stringValue
        refreshDisplayedTodos()
    }

    // MARK: - Todo Operations

    private func addNewTodo() {
        let title = inputField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)

        // Validate
        let validationResult = todoService.validateTodoTitle(title)
        guard validationResult.isValid else {
            showError(message: validationResult.message ?? "Invalid todo")
            inputField.shake()
            return
        }

        // Get suggested priority
        let suggestedPriority = todoService.suggestPriority(for: title)

        // Add todo
        let newTodo = todoManager.addTodo(title: title, priority: suggestedPriority)

        // Clear input
        inputField.stringValue = ""

        // Refresh and select new todo
        refreshDisplayedTodos()

        if let index = displayedTodos.firstIndex(of: newTodo) {
            tableView.selectRow(index, animated: true)
            tableView.scrollToRow(index, animated: true)
        }
    }

    private func deleteTodo(_ todo: TodoItem) {
        todoManager.removeTodo(todo)
        refreshDisplayedTodos()
    }

    private func toggleTodoCompletion(_ todo: TodoItem) {
        todoManager.toggleTodoCompletion(todo)
        refreshDisplayedTodos()
    }

    private func updateTodoTitle(_ todo: TodoItem, newTitle: String) {
        let validationResult = todoService.validateTodoTitle(newTitle)
        guard validationResult.isValid else {
            showError(message: validationResult.message ?? "Invalid title")
            return
        }

        todoManager.updateTodoTitle(todo, newTitle: newTitle)
        refreshDisplayedTodos()
    }

    // MARK: - Data Management

    private func refreshDisplayedTodos() {
        if searchQuery.isEmpty {
            displayedTodos = todoManager.filteredAndSortedTodos()
        } else {
            let searchResults = todoManager.searchTodos(query: searchQuery)
            displayedTodos = searchResults.sorted(by: TodoSort(rawValue: todoManager.currentSort)?.comparator() ?? { _, _ in false })
        }

        tableView.reloadData()
    }

    private func updateStatusLabel() {
        let stats = todoService.getProductivityStats()
        statusLabel.stringValue = "\(stats.activeTodos) active, \(stats.completedTodos) completed (\(stats.completionPercentage))"
        clearCompletedButton.isEnabled = stats.completedTodos > 0
    }

    // MARK: - Observers

    @objc private func todosDidChange(_ notification: Notification) {
        refreshDisplayedTodos()
        updateStatusLabel()
    }

    // MARK: - Keyboard Handling

    private func handleKeyDown(_ event: NSEvent) -> NSEvent? {
        let modifierFlags = event.modifierFlags.intersection(.deviceIndependentFlagsMask)

        // Cmd+N: New todo
        if modifierFlags == .command && event.charactersIgnoringModifiers == "n" {
            view.window?.makeFirstResponder(inputField)
            return nil
        }

        // Cmd+F: Focus search
        if modifierFlags == .command && event.charactersIgnoringModifiers == "f" {
            view.window?.makeFirstResponder(searchField)
            return nil
        }

        // Delete/Backspace: Delete selected todos
        if event.keyCode == 51 || event.keyCode == 117 { // Delete or Forward Delete
            deleteSelectedTodos()
            return nil
        }

        // Cmd+A: Select all
        if modifierFlags == .command && event.charactersIgnoringModifiers == "a" {
            tableView.selectRowIndexes(IndexSet(0..<displayedTodos.count), byExtendingSelection: false)
            return nil
        }

        return event
    }

    private func deleteSelectedTodos() {
        let selectedRows = tableView.selectedRowIndexes

        guard !selectedRows.isEmpty else { return }

        let todosToDelete = selectedRows.map { displayedTodos[$0] }

        showConfirmationDialog(
            title: "Delete Todos",
            message: "Are you sure you want to delete \(todosToDelete.count) todo(s)?",
            confirmButtonTitle: "Delete"
        ) { [weak self] confirmed in
            if confirmed {
                todosToDelete.forEach { self?.todoManager.removeTodo($0) }
            }
        }
    }

    // MARK: - Dialogs

    private func showError(message: String) {
        let alert = NSAlert()
        alert.messageText = "Error"
        alert.informativeText = message
        alert.alertStyle = .warning
        alert.addButton(withTitle: "OK")
        alert.beginSheetModal(for: view.window!) { _ in }
    }

    private func showConfirmationDialog(
        title: String,
        message: String,
        confirmButtonTitle: String = "OK",
        completion: @escaping (Bool) -> Void
    ) {
        let alert = NSAlert()
        alert.messageText = title
        alert.informativeText = message
        alert.alertStyle = .warning
        alert.addButton(withTitle: confirmButtonTitle)
        alert.addButton(withTitle: "Cancel")

        alert.beginSheetModal(for: view.window!) { response in
            completion(response == .alertFirstButtonReturn)
        }
    }

    // MARK: - Menu Actions

    @IBAction func exportTodos(_ sender: Any) {
        let savePanel = NSSavePanel()
        savePanel.allowedContentTypes = [.json]
        savePanel.nameFieldStringValue = "todos.json"

        savePanel.beginSheetModal(for: view.window!) { [weak self] response in
            guard response == .OK, let url = savePanel.url else { return }

            if let data = self?.todoManager.exportTodos() {
                try? data.write(to: url)
                self?.showSuccess(message: "Todos exported successfully!")
            }
        }
    }

    @IBAction func importTodos(_ sender: Any) {
        let openPanel = NSOpenPanel()
        openPanel.allowedContentTypes = [.json]
        openPanel.allowsMultipleSelection = false

        openPanel.beginSheetModal(for: view.window!) { [weak self] response in
            guard response == .OK, let url = openPanel.url else { return }

            do {
                let data = try Data(contentsOf: url)
                if self?.todoManager.importTodos(from: data) == true {
                    self?.showSuccess(message: "Todos imported successfully!")
                    self?.refreshDisplayedTodos()
                }
            } catch {
                self?.showError(message: "Failed to import todos: \(error.localizedDescription)")
            }
        }
    }

    private func showSuccess(message: String) {
        let alert = NSAlert()
        alert.messageText = "Success"
        alert.informativeText = message
        alert.alertStyle = .informational
        alert.addButton(withTitle: "OK")
        alert.beginSheetModal(for: view.window!) { _ in }
    }
}

// MARK: - NSTableViewDataSource

extension MainViewController: NSTableViewDataSource {

    func numberOfRows(in tableView: NSTableView) -> Int {
        return displayedTodos.count
    }

    func tableView(_ tableView: NSTableView, objectValueFor tableColumn: NSTableColumn?, row: Int) -> Any? {
        guard row < displayedTodos.count else { return nil }
        return displayedTodos[row]
    }
}

// MARK: - NSTableViewDelegate

extension MainViewController: NSTableViewDelegate {

    func tableView(_ tableView: NSTableView, viewFor tableColumn: NSTableColumn?, row: Int) -> NSView? {
        guard row < displayedTodos.count else { return nil }

        let identifier = NSUserInterfaceItemIdentifier("TodoCell")
        guard let cellView = tableView.makeView(withIdentifier: identifier, owner: self) as? TodoTableCellView else {
            return nil
        }

        let todo = displayedTodos[row]
        cellView.todoItem = todo

        // Set callbacks
        cellView.onToggleCompletion = { [weak self] todo in
            self?.toggleTodoCompletion(todo)
        }

        cellView.onDelete = { [weak self] todo in
            self?.deleteTodo(todo)
        }

        cellView.onTitleEdit = { [weak self] todo, newTitle in
            self?.updateTodoTitle(todo, newTitle: newTitle)
        }

        return cellView
    }

    func tableView(_ tableView: NSTableView, shouldSelectRow row: Int) -> Bool {
        return true
    }

    func tableViewSelectionDidChange(_ notification: Notification) {
        // Handle selection changes if needed
    }
}

// MARK: - NSTextFieldDelegate

extension MainViewController: NSTextFieldDelegate {

    func controlTextDidChange(_ obj: Notification) {
        // Handle text changes if needed
    }

    func control(_ control: NSControl, textView: NSTextView, doCommandBy commandSelector: Selector) -> Bool {
        if control == inputField && commandSelector == #selector(NSResponder.insertNewline(_:)) {
            // Enter key pressed in input field
            addNewTodo()
            return true
        }

        if control == searchField && commandSelector == #selector(NSResponder.cancelOperation(_:)) {
            // Escape key pressed in search field
            searchField.stringValue = ""
            searchQuery = ""
            refreshDisplayedTodos()
            return true
        }

        return false
    }
}

// MARK: - Drag and Drop (Optional)

extension MainViewController {

    func tableView(_ tableView: NSTableView, pasteboardWriterForRow row: Int) -> NSPasteboardWriting? {
        let pasteboardItem = NSPasteboardItem()
        pasteboardItem.setString(String(row), forType: .string)
        return pasteboardItem
    }

    func tableView(_ tableView: NSTableView, validateDrop info: NSDraggingInfo, proposedRow row: Int, proposedDropOperation dropOperation: NSTableView.DropOperation) -> NSDragOperation {
        if dropOperation == .above {
            return .move
        }
        return []
    }

    func tableView(_ tableView: NSTableView, acceptDrop info: NSDraggingInfo, row: Int, dropOperation: NSTableView.DropOperation) -> Bool {
        var success = false

        info.enumerateDraggingItems(options: [], for: tableView, classes: [NSPasteboardItem.self], searchOptions: [:]) { draggingItem, _, _ in
            if let pasteboardItem = draggingItem.item as? NSPasteboardItem,
               let rowString = pasteboardItem.string(forType: .string),
               let sourceRow = Int(rowString) {

                let sourceTodo = displayedTodos[sourceRow]
                displayedTodos.remove(at: sourceRow)
                let destinationRow = sourceRow < row ? row - 1 : row
                displayedTodos.insert(sourceTodo, at: destinationRow)

                tableView.reloadData()
                success = true
            }
        }

        return success
    }
}
