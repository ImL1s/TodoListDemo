//
//  TodoItem.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Foundation

/// Represents a single todo item in the application
/// Conforms to NSObject for KVO support and Codable for persistence
@objc class TodoItem: NSObject, Codable {

    // MARK: - Properties

    /// Unique identifier for the todo item
    let id: UUID

    /// The title/description of the todo task
    @objc dynamic var title: String

    /// Indicates whether the task is completed
    @objc dynamic var isCompleted: Bool

    /// Timestamp when the todo was created
    let createdAt: Date

    /// Timestamp when the todo was last updated
    @objc dynamic var updatedAt: Date

    /// Priority level (0 = none, 1 = low, 2 = medium, 3 = high)
    @objc dynamic var priority: Int

    /// Optional notes or additional details
    @objc dynamic var notes: String?

    // MARK: - Coding Keys

    private enum CodingKeys: String, CodingKey {
        case id
        case title
        case isCompleted
        case createdAt
        case updatedAt
        case priority
        case notes
    }

    // MARK: - Initialization

    /// Initialize a new todo item
    /// - Parameters:
    ///   - title: The task description
    ///   - isCompleted: Completion status (default: false)
    ///   - priority: Priority level (default: 0)
    ///   - notes: Optional notes
    init(title: String, isCompleted: Bool = false, priority: Int = 0, notes: String? = nil) {
        self.id = UUID()
        self.title = title
        self.isCompleted = isCompleted
        self.createdAt = Date()
        self.updatedAt = Date()
        self.priority = priority
        self.notes = notes
        super.init()
    }

    /// Initialize from decoder (for Codable)
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(UUID.self, forKey: .id)
        title = try container.decode(String.self, forKey: .title)
        isCompleted = try container.decode(Bool.self, forKey: .isCompleted)
        createdAt = try container.decode(Date.self, forKey: .createdAt)
        updatedAt = try container.decode(Date.self, forKey: .updatedAt)
        priority = try container.decode(Int.self, forKey: .priority)
        notes = try container.decodeIfPresent(String.self, forKey: .notes)
        super.init()
    }

    // MARK: - Methods

    /// Toggle the completion status
    func toggleCompletion() {
        isCompleted.toggle()
        updatedAt = Date()
    }

    /// Update the title
    /// - Parameter newTitle: The new title text
    func updateTitle(_ newTitle: String) {
        guard !newTitle.isEmpty else { return }
        title = newTitle
        updatedAt = Date()
    }

    /// Update the priority
    /// - Parameter newPriority: The new priority value (0-3)
    func updatePriority(_ newPriority: Int) {
        guard (0...3).contains(newPriority) else { return }
        priority = newPriority
        updatedAt = Date()
    }

    /// Update the notes
    /// - Parameter newNotes: The new notes text
    func updateNotes(_ newNotes: String?) {
        notes = newNotes
        updatedAt = Date()
    }

    // MARK: - Computed Properties

    /// Returns the priority as a descriptive string
    var priorityDescription: String {
        switch priority {
        case 1: return "Low"
        case 2: return "Medium"
        case 3: return "High"
        default: return "None"
        }
    }

    /// Returns a formatted creation date string
    var formattedCreatedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: createdAt)
    }

    // MARK: - NSObject Overrides

    override var description: String {
        return "TodoItem(id: \(id), title: \"\(title)\", isCompleted: \(isCompleted), priority: \(priorityDescription))"
    }

    override func isEqual(_ object: Any?) -> Bool {
        guard let other = object as? TodoItem else { return false }
        return id == other.id
    }

    override var hash: Int {
        return id.hashValue
    }
}

// MARK: - TodoItem Extensions

extension TodoItem {
    /// Convenience property to check if the todo is active (not completed)
    var isActive: Bool {
        return !isCompleted
    }

    /// Check if the todo was created today
    var isCreatedToday: Bool {
        return Calendar.current.isDateInToday(createdAt)
    }

    /// Check if the todo is high priority
    var isHighPriority: Bool {
        return priority == 3
    }
}

// MARK: - Filter Options

/// Enum representing filter options for todos
enum TodoFilter: String, CaseIterable {
    case all = "All"
    case active = "Active"
    case completed = "Completed"

    /// Filter function to apply to an array of todos
    func predicate() -> (TodoItem) -> Bool {
        switch self {
        case .all:
            return { _ in true }
        case .active:
            return { !$0.isCompleted }
        case .completed:
            return { $0.isCompleted }
        }
    }
}

// MARK: - Sort Options

/// Enum representing sort options for todos
enum TodoSort: String, CaseIterable {
    case dateCreated = "Date Created"
    case dateUpdated = "Date Updated"
    case priority = "Priority"
    case title = "Title"

    /// Returns a comparator for sorting
    func comparator() -> (TodoItem, TodoItem) -> Bool {
        switch self {
        case .dateCreated:
            return { $0.createdAt > $1.createdAt }
        case .dateUpdated:
            return { $0.updatedAt > $1.updatedAt }
        case .priority:
            return { $0.priority > $1.priority }
        case .title:
            return { $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending }
        }
    }
}
