//
//  UserDefaultsManager.swift
//  TodoList
//
//  Manager for persisting todos using UserDefaults
//  iOS 15.0+
//

import Foundation

/// Manager class for handling todo persistence using UserDefaults
///
/// This class provides:
/// - Save todos to UserDefaults
/// - Load todos from UserDefaults
/// - Clear all todos
/// - Singleton pattern for global access
///
/// UserDefaults is a simple key-value storage system provided by iOS.
/// It's suitable for small amounts of data like user preferences and simple data.
/// For larger datasets, consider using CoreData or SwiftData.
class UserDefaultsManager {
    // MARK: - Singleton

    /// Shared instance for global access
    static let shared = UserDefaultsManager()

    // MARK: - Constants

    /// Key for storing todos in UserDefaults
    private let todosKey = "todos_key"

    /// UserDefaults instance
    private let defaults: UserDefaults

    /// JSON encoder for encoding todos
    private let encoder = JSONEncoder()

    /// JSON decoder for decoding todos
    private let decoder = JSONDecoder()

    // MARK: - Initialization

    /// Private initializer to enforce singleton pattern
    private init(defaults: UserDefaults = .standard) {
        self.defaults = defaults

        // Configure encoder/decoder
        encoder.dateEncodingStrategy = .iso8601
        decoder.dateDecodingStrategy = .iso8601
    }

    // MARK: - Public Methods

    /// Save todos to UserDefaults
    /// - Parameter todos: Array of todos to save
    func saveTodos(_ todos: [Todo]) {
        do {
            let data = try encoder.encode(todos)
            defaults.set(data, forKey: todosKey)
            defaults.synchronize() // Force immediate save

            print("✅ Successfully saved \(todos.count) todos to UserDefaults")
        } catch {
            print("❌ Error saving todos: \(error.localizedDescription)")
        }
    }

    /// Load todos from UserDefaults
    /// - Returns: Array of todos (empty if none found or error occurs)
    func loadTodos() -> [Todo] {
        guard let data = defaults.data(forKey: todosKey) else {
            print("ℹ️ No todos found in UserDefaults")
            return []
        }

        do {
            let todos = try decoder.decode([Todo].self, from: data)
            print("✅ Successfully loaded \(todos.count) todos from UserDefaults")
            return todos
        } catch {
            print("❌ Error loading todos: \(error.localizedDescription)")
            return []
        }
    }

    /// Clear all todos from UserDefaults
    func clearTodos() {
        defaults.removeObject(forKey: todosKey)
        defaults.synchronize()
        print("✅ Cleared all todos from UserDefaults")
    }

    /// Check if todos exist in UserDefaults
    /// - Returns: True if todos exist, false otherwise
    func todosExist() -> Bool {
        return defaults.data(forKey: todosKey) != nil
    }

    /// Get the number of saved todos without loading them all
    /// - Returns: Number of todos
    func getTodosCount() -> Int {
        guard let data = defaults.data(forKey: todosKey) else {
            return 0
        }

        do {
            let todos = try decoder.decode([Todo].self, from: data)
            return todos.count
        } catch {
            return 0
        }
    }
}

// MARK: - Backup and Restore

extension UserDefaultsManager {
    /// Export todos as JSON data
    /// - Returns: JSON data representation of todos
    func exportTodos() -> Data? {
        let todos = loadTodos()
        guard !todos.isEmpty else { return nil }

        do {
            let data = try encoder.encode(todos)
            print("✅ Exported \(todos.count) todos as JSON")
            return data
        } catch {
            print("❌ Error exporting todos: \(error.localizedDescription)")
            return nil
        }
    }

    /// Import todos from JSON data
    /// - Parameters:
    ///   - data: JSON data containing todos
    ///   - replaceExisting: Whether to replace existing todos (default: false)
    /// - Returns: True if import was successful
    func importTodos(from data: Data, replaceExisting: Bool = false) -> Bool {
        do {
            let importedTodos = try decoder.decode([Todo].self, from: data)

            if replaceExisting {
                saveTodos(importedTodos)
            } else {
                var existingTodos = loadTodos()
                // Filter out duplicates based on ID
                let newTodos = importedTodos.filter { importedTodo in
                    !existingTodos.contains { $0.id == importedTodo.id }
                }
                existingTodos.append(contentsOf: newTodos)
                saveTodos(existingTodos)
            }

            print("✅ Successfully imported \(importedTodos.count) todos")
            return true
        } catch {
            print("❌ Error importing todos: \(error.localizedDescription)")
            return false
        }
    }

    /// Export todos as JSON string
    /// - Returns: JSON string representation of todos
    func exportTodosAsString() -> String? {
        guard let data = exportTodos() else { return nil }
        return String(data: data, encoding: .utf8)
    }

    /// Import todos from JSON string
    /// - Parameters:
    ///   - jsonString: JSON string containing todos
    ///   - replaceExisting: Whether to replace existing todos
    /// - Returns: True if import was successful
    func importTodos(from jsonString: String, replaceExisting: Bool = false) -> Bool {
        guard let data = jsonString.data(using: .utf8) else {
            print("❌ Invalid JSON string")
            return false
        }
        return importTodos(from: data, replaceExisting: replaceExisting)
    }
}

// MARK: - Migration Support

extension UserDefaultsManager {
    /// Migrate from old storage format (if needed)
    /// This is useful when updating app versions with different data models
    func migrateIfNeeded() {
        let migrationKey = "todos_migration_v1_completed"

        guard !defaults.bool(forKey: migrationKey) else {
            print("ℹ️ Migration already completed")
            return
        }

        // Check if old data exists (example: different key)
        let oldKey = "old_todos_key"
        guard let oldData = defaults.data(forKey: oldKey) else {
            // No old data to migrate
            defaults.set(true, forKey: migrationKey)
            return
        }

        // Perform migration
        do {
            let oldTodos = try decoder.decode([Todo].self, from: oldData)
            saveTodos(oldTodos)
            defaults.removeObject(forKey: oldKey)
            defaults.set(true, forKey: migrationKey)
            print("✅ Successfully migrated \(oldTodos.count) todos")
        } catch {
            print("❌ Error during migration: \(error.localizedDescription)")
        }
    }
}

// MARK: - Statistics and Analytics

extension UserDefaultsManager {
    /// Get storage statistics
    /// - Returns: Dictionary with storage stats
    func getStorageStats() -> [String: Any] {
        let todos = loadTodos()

        return [
            "total_todos": todos.count,
            "active_todos": todos.filter { !$0.isCompleted }.count,
            "completed_todos": todos.filter { $0.isCompleted }.count,
            "overdue_todos": todos.filter { $0.isOverdue }.count,
            "has_due_date": todos.filter { $0.dueDate != nil }.count,
            "has_notes": todos.filter { $0.notes != nil }.count,
            "total_tags": todos.allTags.count,
            "storage_size_bytes": defaults.data(forKey: todosKey)?.count ?? 0
        ]
    }

    /// Print storage statistics
    func printStorageStats() {
        let stats = getStorageStats()
        print("📊 Storage Statistics:")
        for (key, value) in stats.sorted(by: { $0.key < $1.key }) {
            print("   \(key): \(value)")
        }
    }
}

// MARK: - Testing Support

#if DEBUG
extension UserDefaultsManager {
    /// Create a test instance with in-memory storage
    /// Useful for unit tests
    static func createTestInstance() -> UserDefaultsManager {
        let testDefaults = UserDefaults(suiteName: "test_suite")!
        return UserDefaultsManager(defaults: testDefaults)
    }

    /// Clear test data
    func clearTestData() {
        defaults.removePersistentDomain(forName: "test_suite")
    }

    /// Populate with sample data for testing
    func populateWithSampleData() {
        saveTodos(Todo.samples)
        print("✅ Populated storage with sample data")
    }
}
#endif
