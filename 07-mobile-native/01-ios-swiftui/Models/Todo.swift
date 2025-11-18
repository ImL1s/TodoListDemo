//
//  Todo.swift
//  TodoList
//
//  Data model for Todo items
//  iOS 15.0+
//

import Foundation

/// Todo item model
///
/// This struct represents a single todo item with all its properties.
/// It conforms to:
/// - Identifiable: Allows SwiftUI to track items in lists
/// - Codable: Enables JSON encoding/decoding for persistence
/// - Equatable: Allows comparison between todos
/// - Hashable: Enables use in Sets and as Dictionary keys
struct Todo: Identifiable, Codable, Equatable, Hashable {
    // MARK: - Properties

    /// Unique identifier for the todo
    /// This is automatically generated and conforms to Identifiable protocol
    let id: UUID

    /// The title/description of the todo item
    var title: String

    /// Whether the todo is completed
    var isCompleted: Bool

    /// Creation timestamp
    let createdAt: Date

    /// Last modification timestamp (optional)
    var updatedAt: Date?

    /// Priority level of the todo (optional)
    var priority: Priority

    /// Optional notes or description
    var notes: String?

    /// Optional due date
    var dueDate: Date?

    /// Tags for categorization (optional)
    var tags: [String]

    // MARK: - Initialization

    /// Initialize a new Todo item
    /// - Parameters:
    ///   - id: Unique identifier (auto-generated if not provided)
    ///   - title: The todo item title
    ///   - isCompleted: Completion status (default: false)
    ///   - createdAt: Creation date (default: now)
    ///   - updatedAt: Last update date (default: nil)
    ///   - priority: Priority level (default: .medium)
    ///   - notes: Additional notes (default: nil)
    ///   - dueDate: Due date (default: nil)
    ///   - tags: Category tags (default: empty)
    init(
        id: UUID = UUID(),
        title: String,
        isCompleted: Bool = false,
        createdAt: Date = Date(),
        updatedAt: Date? = nil,
        priority: Priority = .medium,
        notes: String? = nil,
        dueDate: Date? = nil,
        tags: [String] = []
    ) {
        self.id = id
        self.title = title
        self.isCompleted = isCompleted
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.priority = priority
        self.notes = notes
        self.dueDate = dueDate
        self.tags = tags
    }

    // MARK: - Computed Properties

    /// Whether the todo is overdue
    var isOverdue: Bool {
        guard let dueDate = dueDate, !isCompleted else { return false }
        return dueDate < Date()
    }

    /// Days until due date (negative if overdue)
    var daysUntilDue: Int? {
        guard let dueDate = dueDate else { return nil }
        let calendar = Calendar.current
        let components = calendar.dateComponents([.day], from: Date(), to: dueDate)
        return components.day
    }

    /// Formatted creation date
    var formattedCreatedAt: String {
        createdAt.formatted(date: .abbreviated, time: .shortened)
    }

    /// Formatted due date
    var formattedDueDate: String? {
        guard let dueDate = dueDate else { return nil }
        return dueDate.formatted(date: .abbreviated, time: .omitted)
    }

    // MARK: - Methods

    /// Toggle the completion status
    /// - Returns: A new Todo with toggled completion status
    mutating func toggleCompletion() {
        isCompleted.toggle()
        updatedAt = Date()
    }

    /// Update the todo title
    /// - Parameter newTitle: The new title
    mutating func updateTitle(_ newTitle: String) {
        title = newTitle
        updatedAt = Date()
    }

    /// Add a tag
    /// - Parameter tag: Tag to add
    mutating func addTag(_ tag: String) {
        if !tags.contains(tag) {
            tags.append(tag)
            updatedAt = Date()
        }
    }

    /// Remove a tag
    /// - Parameter tag: Tag to remove
    mutating func removeTag(_ tag: String) {
        tags.removeAll { $0 == tag }
        updatedAt = Date()
    }
}

// MARK: - Priority Enum

extension Todo {
    /// Priority levels for todos
    enum Priority: String, Codable, CaseIterable {
        case low = "Low"
        case medium = "Medium"
        case high = "High"
        case urgent = "Urgent"

        /// Icon for the priority level
        var icon: String {
            switch self {
            case .low:
                return "arrow.down.circle"
            case .medium:
                return "minus.circle"
            case .high:
                return "arrow.up.circle"
            case .urgent:
                return "exclamationmark.circle"
            }
        }

        /// Color for the priority level
        var colorName: String {
            switch self {
            case .low:
                return "blue"
            case .medium:
                return "green"
            case .high:
                return "orange"
            case .urgent:
                return "red"
            }
        }

        /// Sort order (higher number = higher priority)
        var sortOrder: Int {
            switch self {
            case .low:
                return 0
            case .medium:
                return 1
            case .high:
                return 2
            case .urgent:
                return 3
            }
        }
    }
}

// MARK: - Sample Data

extension Todo {
    /// Sample todos for preview and testing
    static var samples: [Todo] {
        [
            Todo(
                title: "Learn SwiftUI Basics",
                isCompleted: true,
                priority: .medium,
                notes: "Cover views, state, and bindings",
                tags: ["Learning", "SwiftUI"]
            ),
            Todo(
                title: "Build Todo List App",
                isCompleted: false,
                priority: .high,
                notes: "Implement MVVM architecture with persistence",
                dueDate: Calendar.current.date(byAdding: .day, value: 3, to: Date()),
                tags: ["Project", "SwiftUI"]
            ),
            Todo(
                title: "Read SwiftUI Documentation",
                isCompleted: false,
                priority: .low,
                notes: "Official Apple documentation",
                tags: ["Learning", "Documentation"]
            ),
            Todo(
                title: "Implement Dark Mode",
                isCompleted: false,
                priority: .medium,
                dueDate: Calendar.current.date(byAdding: .day, value: 1, to: Date()),
                tags: ["Feature", "UI"]
            ),
            Todo(
                title: "Write Unit Tests",
                isCompleted: false,
                priority: .urgent,
                notes: "Test TodoViewModel and persistence",
                dueDate: Date(),
                tags: ["Testing", "Quality"]
            )
        ]
    }

    /// Empty sample for testing
    static var empty: Todo {
        Todo(title: "")
    }

    /// Completed sample
    static var completedSample: Todo {
        Todo(title: "Completed Task", isCompleted: true)
    }

    /// Overdue sample
    static var overdueSample: Todo {
        Todo(
            title: "Overdue Task",
            priority: .urgent,
            dueDate: Calendar.current.date(byAdding: .day, value: -2, to: Date())
        )
    }
}

// MARK: - Sorting and Filtering Extensions

extension Array where Element == Todo {
    /// Filter active (incomplete) todos
    var active: [Todo] {
        filter { !$0.isCompleted }
    }

    /// Filter completed todos
    var completed: [Todo] {
        filter { $0.isCompleted }
    }

    /// Filter overdue todos
    var overdue: [Todo] {
        filter { $0.isOverdue }
    }

    /// Sort by creation date (newest first)
    var sortedByDateDescending: [Todo] {
        sorted { $0.createdAt > $1.createdAt }
    }

    /// Sort by creation date (oldest first)
    var sortedByDateAscending: [Todo] {
        sorted { $0.createdAt < $1.createdAt }
    }

    /// Sort by priority (highest first)
    var sortedByPriority: [Todo] {
        sorted { $0.priority.sortOrder > $1.priority.sortOrder }
    }

    /// Sort by title (A-Z)
    var sortedByTitle: [Todo] {
        sorted { $0.title.lowercased() < $1.title.lowercased() }
    }

    /// Sort by completion status (incomplete first)
    var sortedByCompletion: [Todo] {
        sorted { !$0.isCompleted && $1.isCompleted }
    }

    /// Filter by tag
    /// - Parameter tag: Tag to filter by
    /// - Returns: Todos with the specified tag
    func filtered(by tag: String) -> [Todo] {
        filter { $0.tags.contains(tag) }
    }

    /// Get all unique tags
    var allTags: [String] {
        var tags = Set<String>()
        forEach { todo in
            tags.formUnion(todo.tags)
        }
        return Array(tags).sorted()
    }
}
