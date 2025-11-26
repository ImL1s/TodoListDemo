//
//  TodoViewModel.swift
//  TodoList
//
//  View Model for managing Todo items (MVVM Pattern)
//  iOS 15.0+
//

import Foundation
import SwiftUI
import Combine

/// ViewModel for managing Todo items
///
/// This class implements the MVVM (Model-View-ViewModel) pattern.
/// It acts as an intermediary between the View (UI) and Model (data).
///
/// Key responsibilities:
/// - Managing todo items state
/// - Handling business logic (add, delete, toggle, etc.)
/// - Persisting data to UserDefaults
/// - Providing computed properties for the view
///
/// ObservableObject: Allows SwiftUI views to observe changes
/// @Published: Automatically notifies views when properties change
class TodoViewModel: ObservableObject {
    // MARK: - Published Properties

    /// Array of all todo items
    /// @Published automatically triggers view updates when this changes
    @Published var todos: [Todo] = [] {
        didSet {
            // Automatically save whenever todos change
            saveTodos()
        }
    }

    /// Current sort order
    @Published var sortOrder: SortOrder = .dateDescending

    /// Current filter
    @Published var currentFilter: FilterOption = .all

    /// Search text for filtering todos
    @Published var searchText: String = ""

    // MARK: - Private Properties

    /// UserDefaults manager for persistence
    private let storage = UserDefaultsManager.shared

    /// Cancellable set for Combine subscriptions
    private var cancellables = Set<AnyCancellable>()

    /// Debounce work item for saving
    private var saveWorkItem: DispatchWorkItem?

    // MARK: - Computed Properties

    /// Count of active (incomplete) todos
    var activeTodosCount: Int {
        todos.filter { !$0.isCompleted }.count
    }

    /// Count of completed todos
    var completedTodosCount: Int {
        todos.filter { $0.isCompleted }.count
    }

    /// Percentage of completed todos (0-100)
    var completionPercentage: Double {
        guard !todos.isEmpty else { return 0 }
        return Double(completedTodosCount) / Double(todos.count) * 100
    }

    /// Filtered todos based on current filter and search text
    var filteredTodos: [Todo] {
        var result = todos

        // Apply filter
        switch currentFilter {
        case .all:
            break
        case .active:
            result = result.active
        case .completed:
            result = result.completed
        case .overdue:
            result = result.overdue
        }

        // Apply search
        if !searchText.isEmpty {
            result = result.filter { todo in
                todo.title.localizedCaseInsensitiveContains(searchText) ||
                (todo.notes?.localizedCaseInsensitiveContains(searchText) ?? false) ||
                todo.tags.contains { $0.localizedCaseInsensitiveContains(searchText) }
            }
        }

        // Apply sort
        switch sortOrder {
        case .dateDescending:
            result = result.sortedByDateDescending
        case .dateAscending:
            result = result.sortedByDateAscending
        case .priority:
            result = result.sortedByPriority
        case .title:
            result = result.sortedByTitle
        case .completion:
            result = result.sortedByCompletion
        }

        return result
    }

    /// All unique tags from todos
    var allTags: [String] {
        todos.allTags
    }

    // MARK: - Initialization

    init() {
        loadTodos()
        setupSearchDebounce()
    }

    // MARK: - Public Methods

    /// Add a new todo
    /// - Parameters:
    ///   - title: Todo title
    ///   - priority: Priority level (default: .medium)
    ///   - notes: Additional notes (default: nil)
    ///   - dueDate: Due date (default: nil)
    ///   - tags: Tags array (default: empty)
    func addTodo(
        title: String,
        priority: Todo.Priority = .medium,
        notes: String? = nil,
        dueDate: Date? = nil,
        tags: [String] = []
    ) {
        guard !title.trimmingCharacters(in: .whitespaces).isEmpty else {
            return
        }

        let newTodo = Todo(
            title: title.trimmingCharacters(in: .whitespaces),
            priority: priority,
            notes: notes,
            dueDate: dueDate,
            tags: tags
        )

        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            todos.insert(newTodo, at: 0)
        }

        // Provide haptic feedback
        generateHapticFeedback(.success)
    }

    /// Delete a todo by ID
    /// - Parameter id: Todo identifier
    func deleteTodo(id: UUID) {
        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            todos.removeAll { $0.id == id }
        }

        generateHapticFeedback(.success)
    }

    /// Delete todos at specific offsets (for swipe-to-delete)
    /// - Parameter offsets: IndexSet of items to delete
    func deleteTodos(at offsets: IndexSet) {
        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            todos.remove(atOffsets: offsets)
        }

        generateHapticFeedback(.success)
    }

    /// Toggle todo completion status
    /// - Parameter id: Todo identifier
    func toggleTodo(id: UUID) {
        if let index = todos.firstIndex(where: { $0.id == id }) {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                todos[index].toggleCompletion()
            }

            // Different haptic based on completion state
            if todos[index].isCompleted {
                generateHapticFeedback(.success)
            } else {
                generateHapticFeedback(.selection)
            }
        }
    }

    /// Update todo title
    /// - Parameters:
    ///   - id: Todo identifier
    ///   - newTitle: New title
    func updateTodoTitle(id: UUID, newTitle: String) {
        guard !newTitle.trimmingCharacters(in: .whitespaces).isEmpty else {
            return
        }

        if let index = todos.firstIndex(where: { $0.id == id }) {
            todos[index].updateTitle(newTitle.trimmingCharacters(in: .whitespaces))
        }
    }

    /// Update todo priority
    /// - Parameters:
    ///   - id: Todo identifier
    ///   - priority: New priority
    func updateTodoPriority(id: UUID, priority: Todo.Priority) {
        if let index = todos.firstIndex(where: { $0.id == id }) {
            todos[index].priority = priority
            todos[index].updatedAt = Date()
        }
    }

    /// Clear all completed todos
    func clearCompleted() {
        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            todos.removeAll { $0.isCompleted }
        }

        generateHapticFeedback(.success)
    }

    /// Clear all todos
    func clearAll() {
        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            todos.removeAll()
        }

        generateHapticFeedback(.success)
    }

    /// Move todos (for reordering)
    /// - Parameters:
    ///   - source: Source indices
    ///   - destination: Destination index
    func moveTodos(from source: IndexSet, to destination: Int) {
        todos.move(fromOffsets: source, toOffset: destination)
    }

    // MARK: - Persistence Methods

    /// Load todos from UserDefaults
    func loadTodos() {
        todos = storage.loadTodos()
        print("Loaded \(todos.count) todos from storage")
    }

    /// Save todos to UserDefaults (with debouncing)
    func saveTodos() {
        // Cancel any pending save
        saveWorkItem?.cancel()

        // Create a new save work item
        let workItem = DispatchWorkItem { [weak self] in
            guard let self = self else { return }
            self.storage.saveTodos(self.todos)
            print("Saved \(self.todos.count) todos to storage")
        }

        saveWorkItem = workItem

        // Execute after a short delay to debounce rapid changes
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5, execute: workItem)
    }

    /// Save todos immediately (without debouncing)
    func saveImmediately() {
        saveWorkItem?.cancel()
        storage.saveTodos(todos)
        print("Immediately saved \(todos.count) todos to storage")
    }

    // MARK: - Private Methods

    /// Setup search text debouncing to avoid too frequent filtering
    private func setupSearchDebounce() {
        $searchText
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .sink { [weak self] _ in
                self?.objectWillChange.send()
            }
            .store(in: &cancellables)
    }

    /// Generate haptic feedback
    /// - Parameter type: Feedback type
    private func generateHapticFeedback(_ type: UINotificationFeedbackGenerator.FeedbackType) {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(type)
    }

    /// Generate selection haptic feedback
    private func generateHapticFeedback(_ type: UIImpactFeedbackGenerator.FeedbackStyle) {
        let generator = UIImpactFeedbackGenerator(style: type)
        generator.impactOccurred()
    }
}

// MARK: - Supporting Types

extension TodoViewModel {
    /// Sort order options
    enum SortOrder: String, CaseIterable, Identifiable {
        case dateDescending = "Newest First"
        case dateAscending = "Oldest First"
        case priority = "Priority"
        case title = "Title (A-Z)"
        case completion = "Completion Status"

        var id: String { rawValue }

        var icon: String {
            switch self {
            case .dateDescending:
                return "arrow.down"
            case .dateAscending:
                return "arrow.up"
            case .priority:
                return "exclamationmark.circle"
            case .title:
                return "textformat"
            case .completion:
                return "checkmark.circle"
            }
        }
    }

    /// Filter options
    enum FilterOption: String, CaseIterable, Identifiable {
        case all = "All"
        case active = "Active"
        case completed = "Completed"
        case overdue = "Overdue"

        var id: String { rawValue }

        var icon: String {
            switch self {
            case .all:
                return "list.bullet"
            case .active:
                return "circle"
            case .completed:
                return "checkmark.circle.fill"
            case .overdue:
                return "exclamationmark.triangle"
            }
        }
    }
}

// MARK: - Sample Data for Previews

extension TodoViewModel {
    /// Create a view model with sample data for previews
    static var sample: TodoViewModel {
        let viewModel = TodoViewModel()
        viewModel.todos = Todo.samples
        return viewModel
    }

    /// Create an empty view model for previews
    static var empty: TodoViewModel {
        let viewModel = TodoViewModel()
        viewModel.todos = []
        return viewModel
    }
}
