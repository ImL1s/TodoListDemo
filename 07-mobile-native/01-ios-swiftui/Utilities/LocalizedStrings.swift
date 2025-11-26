//
//  LocalizedStrings.swift
//  TodoList
//
//  Centralized strings for localization support
//  iOS 15.0+
//

import Foundation

/// Centralized strings for easy localization
///
/// This enum provides a single source of truth for all user-facing strings.
/// To add localization:
/// 1. Create Localizable.strings files for each language
/// 2. Replace values with NSLocalizedString calls
/// 3. Use Strings.key throughout the app instead of hardcoded strings
enum Strings {
    // MARK: - App
    enum App {
        static let title = "Todo List"
        static let version = "Version"
        static let framework = "Framework"
        static let iosVersion = "iOS Version"
    }

    // MARK: - Actions
    enum Actions {
        static let add = "Add"
        static let delete = "Delete"
        static let edit = "Edit"
        static let cancel = "Cancel"
        static let done = "Done"
        static let save = "Save"
        static let deleteAll = "Delete All"
        static let clearCompleted = "Clear Completed"
        static let toggleCompletion = "Toggle Completion"
    }

    // MARK: - Input
    enum Input {
        static let placeholder = "Add a new todo..."
        static let priorityLabel = "Priority"
        static let selectPriority = "Select Priority"
    }

    // MARK: - Filter
    enum Filter {
        static let all = "All"
        static let active = "Active"
        static let completed = "Completed"
        static let overdue = "Overdue"
        static let filter = "Filter"
    }

    // MARK: - Sort
    enum Sort {
        static let sort = "Sort"
        static let newestFirst = "Newest First"
        static let oldestFirst = "Oldest First"
        static let priority = "Priority"
        static let title = "Title (A-Z)"
        static let completion = "Completion Status"
    }

    // MARK: - Priority
    enum Priority {
        static let low = "Low"
        static let medium = "Medium"
        static let high = "High"
        static let urgent = "Urgent"
    }

    // MARK: - Statistics
    enum Statistics {
        static let total = "Total"
        static let active = "Active"
        static let completed = "Completed"
    }

    // MARK: - Empty States
    enum EmptyState {
        static let noTodos = "No Todos Yet"
        static let noTodosSubtext = "Add a todo to get started"
        static let allDone = "All Done!"
        static let allDoneSubtext = "You've completed all your tasks. Great job!"
        static let noActiveTodos = "No Active Todos"
        static let toggleHint = "Toggle the eye icon to see completed todos"
    }

    // MARK: - Alerts
    enum Alerts {
        static let clearAllTitle = "Clear All Todos"
        static let clearAllMessage = "Are you sure you want to delete all todos? This action cannot be undone."
        static let clearCompletedTitle = "Clear Completed Todos"
        static let clearCompletedMessage = "Are you sure you want to delete all completed todos?"
    }

    // MARK: - Settings
    enum Settings {
        static let settings = "Settings"
        static let display = "Display"
        static let data = "Data"
        static let about = "About"
        static let showCompleted = "Show Completed Todos"
        static let clearAllTodos = "Clear All Todos"
        static let clearCompletedTodos = "Clear Completed Todos"
    }

    // MARK: - Accessibility
    enum Accessibility {
        // Labels
        static let completedLabel = "Completed"
        static let notCompletedLabel = "Not completed"
        static let hideCompletedLabel = "Hide completed todos"
        static let showCompletedLabel = "Show completed todos"
        static let todoTitleInput = "Todo title input"
        static let addTodoButton = "Add todo"
        static let settingsButton = "Settings"
        static let filterButton = "Filter todos"
        static let sortButton = "Sort todos"
        static let priorityButton = "priority"

        // Hints
        static let toggleCompletionHint = "Double tap to toggle"
        static let toggleVisibilityHint = "Double tap to toggle completed todos visibility"
        static let enterTodoHint = "Enter a new todo item and press done to add"
        static let addTodoHint = "Double tap to add todo"
        static let enterTitleFirstHint = "Enter a title to add todo"
        static let changePriorityHint = "Double tap to change priority"
        static let deleteHint = "Swipe left to delete"
        static let toggleAndDeleteHint = "Double tap to toggle completion. Swipe left to delete."
        static let markCompletedHint = "Double tap to mark as completed. Swipe left to delete."
        static let markNotCompletedHint = "Double tap to mark as not completed. Swipe left to delete."

        // Actions
        static let toggleCompletionAction = "Toggle Completion"
        static let deleteAction = "Delete"
    }

    // MARK: - Search
    enum Search {
        static let searchPlaceholder = "Search todos..."
    }

    // MARK: - Date
    enum DateFormat {
        static let overdue = "Overdue: %@"
        static let due = "Due: %@"
        static let tags = "Tags: %@"
    }
}

// MARK: - Localization Helper Extension

extension Strings {
    /// Helper function to get localized string
    /// - Parameters:
    ///   - key: The key for the localized string
    ///   - comment: A comment to help translators
    /// - Returns: Localized string
    static func localized(_ key: String, comment: String = "") -> String {
        return NSLocalizedString(key, comment: comment)
    }
}

// MARK: - Future Localization Support
/*
 To add full localization support:

 1. Add Localizable.strings file:
    - In Xcode: File > New > File > Strings File
    - Name it "Localizable.strings"
    - Enable localization for desired languages

 2. Add translations in Localizable.strings:
    "app.title" = "Todo List";
    "input.placeholder" = "Add a new todo...";
    // etc.

 3. Update enum to use NSLocalizedString:
    static let title = NSLocalizedString("app.title", comment: "App title")

 4. Or use String Catalogs (iOS 17+):
    - More modern approach with better Xcode integration
    - Automatically detects strings
    - Better for managing multiple languages
 */
