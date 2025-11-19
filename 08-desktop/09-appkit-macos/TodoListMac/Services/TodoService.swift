//
//  TodoService.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Foundation
import Cocoa

/// Service layer providing additional todo-related functionality
/// Handles analytics, validation, and business logic
class TodoService {

    // MARK: - Singleton

    static let shared = TodoService()

    // MARK: - Properties

    private let todoManager: TodoManager

    // MARK: - Initialization

    init(todoManager: TodoManager = .shared) {
        self.todoManager = todoManager
    }

    // MARK: - Validation

    /// Validate a todo title
    /// - Parameter title: The title to validate
    /// - Returns: Validation result with error message if invalid
    func validateTodoTitle(_ title: String) -> ValidationResult {
        let trimmedTitle = title.trimmingCharacters(in: .whitespacesAndNewlines)

        if trimmedTitle.isEmpty {
            return .invalid("Title cannot be empty")
        }

        if trimmedTitle.count > 500 {
            return .invalid("Title cannot exceed 500 characters")
        }

        // Check for duplicate titles (optional)
        if todoManager.todos.contains(where: { $0.title == trimmedTitle }) {
            return .warning("A todo with this title already exists")
        }

        return .valid
    }

    /// Validate notes
    /// - Parameter notes: The notes to validate
    /// - Returns: Validation result
    func validateNotes(_ notes: String?) -> ValidationResult {
        guard let notes = notes else { return .valid }

        if notes.count > 5000 {
            return .invalid("Notes cannot exceed 5000 characters")
        }

        return .valid
    }

    // MARK: - Analytics

    /// Get productivity statistics
    /// - Returns: ProductivityStats object
    func getProductivityStats() -> ProductivityStats {
        let todos = todoManager.todos

        let totalTodos = todos.count
        let completedTodos = todos.filter { $0.isCompleted }.count
        let activeTodos = todos.filter { !$0.isCompleted }.count

        let highPriorityCount = todos.filter { $0.priority == 3 }.count
        let mediumPriorityCount = todos.filter { $0.priority == 2 }.count
        let lowPriorityCount = todos.filter { $0.priority == 1 }.count

        let completionRate = totalTodos > 0 ? Double(completedTodos) / Double(totalTodos) : 0

        // Calculate average completion time (for completed todos)
        let completedWithDuration = todos.filter { $0.isCompleted }
        let averageCompletionTime: TimeInterval = {
            guard !completedWithDuration.isEmpty else { return 0 }
            let totalDuration = completedWithDuration.reduce(0.0) { sum, todo in
                sum + todo.updatedAt.timeIntervalSince(todo.createdAt)
            }
            return totalDuration / Double(completedWithDuration.count)
        }()

        return ProductivityStats(
            totalTodos: totalTodos,
            completedTodos: completedTodos,
            activeTodos: activeTodos,
            highPriorityCount: highPriorityCount,
            mediumPriorityCount: mediumPriorityCount,
            lowPriorityCount: lowPriorityCount,
            completionRate: completionRate,
            averageCompletionTime: averageCompletionTime
        )
    }

    /// Get todos created in a specific date range
    /// - Parameters:
    ///   - startDate: Start of the range
    ///   - endDate: End of the range
    /// - Returns: Todos created in the range
    func getTodos(createdBetween startDate: Date, and endDate: Date) -> [TodoItem] {
        return todoManager.todos.filter { todo in
            todo.createdAt >= startDate && todo.createdAt <= endDate
        }
    }

    /// Get todos completed in a specific date range
    /// - Parameters:
    ///   - startDate: Start of the range
    ///   - endDate: End of the range
    /// - Returns: Todos completed in the range
    func getTodos(completedBetween startDate: Date, and endDate: Date) -> [TodoItem] {
        return todoManager.todos.filter { todo in
            todo.isCompleted &&
            todo.updatedAt >= startDate &&
            todo.updatedAt <= endDate
        }
    }

    // MARK: - Smart Suggestions

    /// Get suggested priorities based on keywords in the title
    /// - Parameter title: The todo title
    /// - Returns: Suggested priority level
    func suggestPriority(for title: String) -> Int {
        let lowercaseTitle = title.lowercased()

        // High priority keywords
        let highPriorityKeywords = ["urgent", "asap", "important", "critical", "emergency", "deadline"]
        if highPriorityKeywords.contains(where: { lowercaseTitle.contains($0) }) {
            return 3
        }

        // Medium priority keywords
        let mediumPriorityKeywords = ["soon", "review", "check", "update", "fix"]
        if mediumPriorityKeywords.contains(where: { lowercaseTitle.contains($0) }) {
            return 2
        }

        // Low priority keywords
        let lowPriorityKeywords = ["maybe", "consider", "think about", "someday"]
        if lowPriorityKeywords.contains(where: { lowercaseTitle.contains($0) }) {
            return 1
        }

        return 0 // Default priority
    }

    /// Get suggestions for similar or related todos
    /// - Parameter todo: The reference todo
    /// - Returns: Array of similar todos
    func getSimilarTodos(to todo: TodoItem) -> [TodoItem] {
        let words = Set(todo.title.lowercased().split(separator: " ").map(String.init))

        return todoManager.todos.filter { otherTodo in
            guard otherTodo.id != todo.id else { return false }

            let otherWords = Set(otherTodo.title.lowercased().split(separator: " ").map(String.init))
            let commonWords = words.intersection(otherWords)

            // Consider similar if they share at least 2 words
            return commonWords.count >= 2
        }
    }

    // MARK: - Bulk Import/Export

    /// Export todos to CSV format
    /// - Returns: CSV data as String
    func exportToCSV() -> String {
        var csv = "ID,Title,Completed,Priority,Created,Updated,Notes\n"

        for todo in todoManager.todos {
            let id = todo.id.uuidString
            let title = escapedCSV(todo.title)
            let completed = todo.isCompleted ? "Yes" : "No"
            let priority = todo.priorityDescription
            let created = todo.formattedCreatedDate
            let updated = formatDate(todo.updatedAt)
            let notes = escapedCSV(todo.notes ?? "")

            csv += "\(id),\(title),\(completed),\(priority),\(created),\(updated),\(notes)\n"
        }

        return csv
    }

    /// Import todos from CSV data
    /// - Parameter csv: CSV data as String
    /// - Returns: Number of imported todos
    func importFromCSV(_ csv: String) -> Int {
        let lines = csv.components(separatedBy: .newlines)
        var importedCount = 0

        // Skip header row
        for line in lines.dropFirst() {
            guard !line.isEmpty else { continue }

            let components = parseCSVLine(line)
            guard components.count >= 4 else { continue }

            let title = components[1]
            let isCompleted = components[2].lowercased() == "yes"
            let priority = parsePriority(components[3])
            let notes = components.count > 6 ? components[6] : nil

            let todo = TodoItem(title: title, isCompleted: isCompleted, priority: priority, notes: notes)
            todoManager.todos.append(todo)
            importedCount += 1
        }

        if importedCount > 0 {
            StorageService.shared.saveTodos(todoManager.todos)
        }

        return importedCount
    }

    // MARK: - Helper Methods

    private func escapedCSV(_ string: String) -> String {
        if string.contains(",") || string.contains("\"") || string.contains("\n") {
            return "\"\(string.replacingOccurrences(of: "\"", with: "\"\""))\""
        }
        return string
    }

    private func parseCSVLine(_ line: String) -> [String] {
        var components: [String] = []
        var currentComponent = ""
        var insideQuotes = false

        for char in line {
            if char == "\"" {
                insideQuotes.toggle()
            } else if char == "," && !insideQuotes {
                components.append(currentComponent)
                currentComponent = ""
            } else {
                currentComponent.append(char)
            }
        }

        components.append(currentComponent)
        return components.map { $0.trimmingCharacters(in: .whitespaces) }
    }

    private func parsePriority(_ string: String) -> Int {
        switch string.lowercased() {
        case "high": return 3
        case "medium": return 2
        case "low": return 1
        default: return 0
        }
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }

    // MARK: - Notifications

    /// Schedule a reminder notification for a todo
    /// - Parameters:
    ///   - todo: The todo to remind about
    ///   - date: When to send the notification
    func scheduleReminder(for todo: TodoItem, at date: Date) {
        // Implementation would use UserNotifications framework
        // This is a placeholder for the actual implementation
        print("Reminder scheduled for '\(todo.title)' at \(date)")
    }
}

// MARK: - Supporting Types

/// Validation result enum
enum ValidationResult {
    case valid
    case warning(String)
    case invalid(String)

    var isValid: Bool {
        if case .valid = self { return true }
        if case .warning = self { return true }
        return false
    }

    var message: String? {
        switch self {
        case .valid: return nil
        case .warning(let msg), .invalid(let msg): return msg
        }
    }
}

/// Productivity statistics structure
struct ProductivityStats {
    let totalTodos: Int
    let completedTodos: Int
    let activeTodos: Int
    let highPriorityCount: Int
    let mediumPriorityCount: Int
    let lowPriorityCount: Int
    let completionRate: Double
    let averageCompletionTime: TimeInterval

    var completionPercentage: String {
        return String(format: "%.1f%%", completionRate * 100)
    }

    var averageCompletionTimeFormatted: String {
        let hours = Int(averageCompletionTime) / 3600
        let minutes = (Int(averageCompletionTime) % 3600) / 60

        if hours > 0 {
            return "\(hours)h \(minutes)m"
        } else {
            return "\(minutes)m"
        }
    }
}
