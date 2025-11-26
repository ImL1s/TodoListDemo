//
//  TodoManager.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Foundation
import Cocoa

/// Main manager class for handling todo operations
/// Uses KVO-compliant properties for automatic UI updates
@objc class TodoManager: NSObject {

    // MARK: - Singleton

    static let shared = TodoManager()

    // MARK: - Properties

    /// Array of all todos (KVO-compliant for automatic updates)
    @objc dynamic var todos: [TodoItem] = []

    /// Currently selected filter
    @objc dynamic var currentFilter: String = TodoFilter.all.rawValue

    /// Currently selected sort option
    @objc dynamic var currentSort: String = TodoSort.dateCreated.rawValue

    /// Storage service for persistence
    private let storageService: StorageService

    /// Notification names
    static let todosDidChangeNotification = Notification.Name("TodosDidChange")
    static let todoDidAddNotification = Notification.Name("TodoDidAdd")
    static let todoDidRemoveNotification = Notification.Name("TodoDidRemove")
    static let todoDidUpdateNotification = Notification.Name("TodoDidUpdate")

    // MARK: - Initialization

    override init() {
        self.storageService = StorageService.shared
        super.init()
        loadTodos()
    }

    // MARK: - CRUD Operations

    /// Add a new todo
    /// - Parameters:
    ///   - title: The todo title
    ///   - priority: Priority level (default: 0)
    ///   - notes: Optional notes
    /// - Returns: The created TodoItem
    @discardableResult
    func addTodo(title: String, priority: Int = 0, notes: String? = nil) -> TodoItem {
        let todo = TodoItem(title: title, priority: priority, notes: notes)

        // Use KVO-compliant insertion
        willChangeValue(forKey: "todos")
        todos.append(todo)
        didChangeValue(forKey: "todos")

        saveTodos()

        // Post notification
        NotificationCenter.default.post(
            name: TodoManager.todoDidAddNotification,
            object: self,
            userInfo: ["todo": todo]
        )

        return todo
    }

    /// Remove a todo at the specified index
    /// - Parameter index: The index to remove
    func removeTodo(at index: Int) {
        guard index >= 0 && index < todos.count else { return }

        let removedTodo = todos[index]

        // Use KVO-compliant removal
        willChangeValue(forKey: "todos")
        todos.remove(at: index)
        didChangeValue(forKey: "todos")

        saveTodos()

        // Post notification
        NotificationCenter.default.post(
            name: TodoManager.todoDidRemoveNotification,
            object: self,
            userInfo: ["todo": removedTodo, "index": index]
        )
    }

    /// Remove a specific todo
    /// - Parameter todo: The todo to remove
    func removeTodo(_ todo: TodoItem) {
        if let index = todos.firstIndex(of: todo) {
            removeTodo(at: index)
        }
    }

    /// Remove multiple todos at the specified indices
    /// - Parameter indices: Set of indices to remove
    func removeTodos(at indices: IndexSet) {
        // Remove in reverse order to maintain correct indices
        for index in indices.sorted().reversed() {
            removeTodo(at: index)
        }
    }

    /// Update a todo's title
    /// - Parameters:
    ///   - todo: The todo to update
    ///   - newTitle: The new title
    func updateTodoTitle(_ todo: TodoItem, newTitle: String) {
        todo.updateTitle(newTitle)
        saveTodos()
        postUpdateNotification(for: todo)
    }

    /// Toggle a todo's completion status
    /// - Parameter todo: The todo to toggle
    func toggleTodoCompletion(_ todo: TodoItem) {
        todo.toggleCompletion()
        saveTodos()
        postUpdateNotification(for: todo)
    }

    /// Update a todo's priority
    /// - Parameters:
    ///   - todo: The todo to update
    ///   - priority: The new priority value
    func updateTodoPriority(_ todo: TodoItem, priority: Int) {
        todo.updatePriority(priority)
        saveTodos()
        postUpdateNotification(for: todo)
    }

    /// Update a todo's notes
    /// - Parameters:
    ///   - todo: The todo to update
    ///   - notes: The new notes text
    func updateTodoNotes(_ todo: TodoItem, notes: String?) {
        todo.updateNotes(notes)
        saveTodos()
        postUpdateNotification(for: todo)
    }

    // MARK: - Bulk Operations

    /// Remove all completed todos
    func clearCompleted() {
        let indicesToRemove = IndexSet(
            todos.enumerated().compactMap { $0.element.isCompleted ? $0.offset : nil }
        )
        removeTodos(at: indicesToRemove)
    }

    /// Mark all todos as completed
    func completeAll() {
        todos.forEach { todo in
            if !todo.isCompleted {
                todo.isCompleted = true
                todo.updatedAt = Date()
            }
        }
        saveTodos()
        NotificationCenter.default.post(name: TodoManager.todosDidChangeNotification, object: self)
    }

    /// Mark all todos as active (uncompleted)
    func uncompleteAll() {
        todos.forEach { todo in
            if todo.isCompleted {
                todo.isCompleted = false
                todo.updatedAt = Date()
            }
        }
        saveTodos()
        NotificationCenter.default.post(name: TodoManager.todosDidChangeNotification, object: self)
    }

    // MARK: - Filtering and Sorting

    /// Get filtered todos based on current filter
    /// - Returns: Filtered array of todos
    func filteredTodos() -> [TodoItem] {
        guard let filter = TodoFilter(rawValue: currentFilter) else {
            return todos
        }
        return todos.filter(filter.predicate())
    }

    /// Get filtered and sorted todos
    /// - Returns: Filtered and sorted array of todos
    func filteredAndSortedTodos() -> [TodoItem] {
        let filtered = filteredTodos()
        guard let sort = TodoSort(rawValue: currentSort) else {
            return filtered
        }
        return filtered.sorted(by: sort.comparator())
    }

    /// Set the current filter
    /// - Parameter filter: The filter to apply
    func setFilter(_ filter: TodoFilter) {
        currentFilter = filter.rawValue
        NotificationCenter.default.post(name: TodoManager.todosDidChangeNotification, object: self)
    }

    /// Set the current sort option
    /// - Parameter sort: The sort option to apply
    func setSort(_ sort: TodoSort) {
        currentSort = sort.rawValue
        NotificationCenter.default.post(name: TodoManager.todosDidChangeNotification, object: self)
    }

    // MARK: - Statistics

    /// Get the total number of todos
    var totalCount: Int {
        return todos.count
    }

    /// Get the number of active todos
    var activeCount: Int {
        return todos.filter { !$0.isCompleted }.count
    }

    /// Get the number of completed todos
    var completedCount: Int {
        return todos.filter { $0.isCompleted }.count
    }

    /// Get the completion percentage
    var completionPercentage: Double {
        guard totalCount > 0 else { return 0 }
        return Double(completedCount) / Double(totalCount) * 100
    }

    // MARK: - Persistence

    /// Save todos to storage
    private func saveTodos() {
        storageService.saveTodos(todos)
        NotificationCenter.default.post(name: TodoManager.todosDidChangeNotification, object: self)
    }

    /// Load todos from storage
    private func loadTodos() {
        todos = storageService.loadTodos()
    }

    /// Reload todos from storage (discarding unsaved changes)
    func reloadTodos() {
        loadTodos()
        NotificationCenter.default.post(name: TodoManager.todosDidChangeNotification, object: self)
    }

    // MARK: - Search

    /// Search todos by title or notes
    /// - Parameter query: The search query
    /// - Returns: Array of matching todos
    func searchTodos(query: String) -> [TodoItem] {
        guard !query.isEmpty else { return todos }

        let lowercasedQuery = query.lowercased()
        return todos.filter { todo in
            todo.title.lowercased().contains(lowercasedQuery) ||
            (todo.notes?.lowercased().contains(lowercasedQuery) ?? false)
        }
    }

    // MARK: - Helper Methods

    /// Post an update notification for a todo
    /// - Parameter todo: The updated todo
    private func postUpdateNotification(for todo: TodoItem) {
        NotificationCenter.default.post(
            name: TodoManager.todoDidUpdateNotification,
            object: self,
            userInfo: ["todo": todo]
        )
    }

    /// Get a todo by its ID
    /// - Parameter id: The todo's UUID
    /// - Returns: The matching TodoItem, if found
    func getTodo(byId id: UUID) -> TodoItem? {
        return todos.first { $0.id == id }
    }

    /// Get the index of a todo
    /// - Parameter todo: The todo to find
    /// - Returns: The index, if found
    func getIndex(of todo: TodoItem) -> Int? {
        return todos.firstIndex(of: todo)
    }

    // MARK: - Import/Export

    /// Export todos as JSON data
    /// - Returns: JSON data representation of all todos
    func exportTodos() -> Data? {
        return storageService.exportTodos(todos)
    }

    /// Import todos from JSON data
    /// - Parameter data: JSON data to import
    /// - Returns: Success status
    func importTodos(from data: Data) -> Bool {
        if let importedTodos = storageService.importTodos(from: data) {
            willChangeValue(forKey: "todos")
            todos = importedTodos
            didChangeValue(forKey: "todos")
            saveTodos()
            return true
        }
        return false
    }
}

// MARK: - Computed Properties Extension

extension TodoManager {
    /// Check if there are any todos
    var hasTodos: Bool {
        return !todos.isEmpty
    }

    /// Check if there are any active todos
    var hasActiveTodos: Bool {
        return activeCount > 0
    }

    /// Check if there are any completed todos
    var hasCompletedTodos: Bool {
        return completedCount > 0
    }

    /// Get todos grouped by priority
    var todosByPriority: [Int: [TodoItem]] {
        return Dictionary(grouping: todos) { $0.priority }
    }

    /// Get high priority todos
    var highPriorityTodos: [TodoItem] {
        return todos.filter { $0.isHighPriority }
    }
}
