//
//  StorageService.swift
//  TodoListMac
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import Foundation

/// Service responsible for persisting and loading todo data
/// Supports multiple storage backends: UserDefaults, JSON file, and iCloud
class StorageService {

    // MARK: - Singleton

    static let shared = StorageService()

    // MARK: - Storage Keys

    private enum StorageKey {
        static let todos = "com.todolistmac.todos"
        static let lastSyncDate = "com.todolistmac.lastSyncDate"
        static let storageType = "com.todolistmac.storageType"
    }

    // MARK: - Storage Types

    enum StorageType: String {
        case userDefaults = "UserDefaults"
        case jsonFile = "JSON File"
        case iCloud = "iCloud"
    }

    // MARK: - Properties

    /// Current storage type
    private(set) var currentStorageType: StorageType

    /// File URL for JSON storage
    private var jsonFileURL: URL {
        let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        return documentsDirectory.appendingPathComponent("todos.json")
    }

    /// iCloud container URL
    private var iCloudURL: URL? {
        FileManager.default.url(forUbiquityContainerIdentifier: nil)?
            .appendingPathComponent("Documents")
            .appendingPathComponent("todos.json")
    }

    // MARK: - Initialization

    init(storageType: StorageType = .jsonFile) {
        self.currentStorageType = storageType

        // Load saved storage type preference
        if let savedType = UserDefaults.standard.string(forKey: StorageKey.storageType),
           let type = StorageType(rawValue: savedType) {
            self.currentStorageType = type
        }

        // Create iCloud directory if needed
        if currentStorageType == .iCloud, let iCloudURL = iCloudURL {
            try? FileManager.default.createDirectory(
                at: iCloudURL.deletingLastPathComponent(),
                withIntermediateDirectories: true
            )
        }
    }

    // MARK: - Public Methods

    /// Save todos to storage
    /// - Parameter todos: Array of TodoItem to save
    func saveTodos(_ todos: [TodoItem]) {
        switch currentStorageType {
        case .userDefaults:
            saveToUserDefaults(todos)
        case .jsonFile:
            saveToJSONFile(todos)
        case .iCloud:
            saveToiCloud(todos)
        }

        // Update last sync date
        UserDefaults.standard.set(Date(), forKey: StorageKey.lastSyncDate)
    }

    /// Load todos from storage
    /// - Returns: Array of TodoItem
    func loadTodos() -> [TodoItem] {
        switch currentStorageType {
        case .userDefaults:
            return loadFromUserDefaults()
        case .jsonFile:
            return loadFromJSONFile()
        case .iCloud:
            return loadFromiCloud()
        }
    }

    /// Change the storage type
    /// - Parameter newType: The new storage type to use
    func changeStorageType(to newType: StorageType) {
        // Save current todos with new storage type
        let currentTodos = loadTodos()
        currentStorageType = newType
        saveTodos(currentTodos)

        // Save preference
        UserDefaults.standard.set(newType.rawValue, forKey: StorageKey.storageType)
    }

    /// Export todos as JSON data
    /// - Parameter todos: Todos to export
    /// - Returns: JSON data
    func exportTodos(_ todos: [TodoItem]) -> Data? {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        encoder.dateEncodingStrategy = .iso8601

        do {
            return try encoder.encode(todos)
        } catch {
            print("Failed to export todos: \(error)")
            return nil
        }
    }

    /// Import todos from JSON data
    /// - Parameter data: JSON data to import
    /// - Returns: Array of imported todos
    func importTodos(from data: Data) -> [TodoItem]? {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        do {
            return try decoder.decode([TodoItem].self, from: data)
        } catch {
            print("Failed to import todos: \(error)")
            return nil
        }
    }

    /// Clear all stored todos
    func clearAll() {
        // Clear UserDefaults
        UserDefaults.standard.removeObject(forKey: StorageKey.todos)

        // Delete JSON file
        try? FileManager.default.removeItem(at: jsonFileURL)

        // Delete iCloud file
        if let iCloudURL = iCloudURL {
            try? FileManager.default.removeItem(at: iCloudURL)
        }
    }

    // MARK: - UserDefaults Storage

    private func saveToUserDefaults(_ todos: [TodoItem]) {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601

        do {
            let data = try encoder.encode(todos)
            UserDefaults.standard.set(data, forKey: StorageKey.todos)
        } catch {
            print("Failed to save to UserDefaults: \(error)")
        }
    }

    private func loadFromUserDefaults() -> [TodoItem] {
        guard let data = UserDefaults.standard.data(forKey: StorageKey.todos) else {
            return []
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        do {
            return try decoder.decode([TodoItem].self, from: data)
        } catch {
            print("Failed to load from UserDefaults: \(error)")
            return []
        }
    }

    // MARK: - JSON File Storage

    private func saveToJSONFile(_ todos: [TodoItem]) {
        guard let data = exportTodos(todos) else { return }

        do {
            try data.write(to: jsonFileURL, options: .atomic)
        } catch {
            print("Failed to save to JSON file: \(error)")
        }
    }

    private func loadFromJSONFile() -> [TodoItem] {
        guard FileManager.default.fileExists(atPath: jsonFileURL.path) else {
            return []
        }

        do {
            let data = try Data(contentsOf: jsonFileURL)
            return importTodos(from: data) ?? []
        } catch {
            print("Failed to load from JSON file: \(error)")
            return []
        }
    }

    // MARK: - iCloud Storage

    private func saveToiCloud(_ todos: [TodoItem]) {
        guard let iCloudURL = iCloudURL else {
            print("iCloud not available")
            // Fallback to JSON file
            saveToJSONFile(todos)
            return
        }

        guard let data = exportTodos(todos) else { return }

        do {
            try data.write(to: iCloudURL, options: .atomic)
        } catch {
            print("Failed to save to iCloud: \(error)")
            // Fallback to JSON file
            saveToJSONFile(todos)
        }
    }

    private func loadFromiCloud() -> [TodoItem] {
        guard let iCloudURL = iCloudURL,
              FileManager.default.fileExists(atPath: iCloudURL.path) else {
            print("iCloud file not found, loading from local storage")
            return loadFromJSONFile()
        }

        do {
            let data = try Data(contentsOf: iCloudURL)
            return importTodos(from: data) ?? []
        } catch {
            print("Failed to load from iCloud: \(error)")
            return loadFromJSONFile()
        }
    }

    // MARK: - Utilities

    /// Get the last sync date
    var lastSyncDate: Date? {
        return UserDefaults.standard.object(forKey: StorageKey.lastSyncDate) as? Date
    }

    /// Check if iCloud is available
    var isiCloudAvailable: Bool {
        return FileManager.default.ubiquityIdentityToken != nil
    }

    /// Get the file size of stored data
    var storageSize: Int64 {
        switch currentStorageType {
        case .userDefaults:
            return Int64(UserDefaults.standard.data(forKey: StorageKey.todos)?.count ?? 0)
        case .jsonFile:
            return getFileSize(at: jsonFileURL)
        case .iCloud:
            if let iCloudURL = iCloudURL {
                return getFileSize(at: iCloudURL)
            }
            return 0
        }
    }

    private func getFileSize(at url: URL) -> Int64 {
        guard let attributes = try? FileManager.default.attributesOfItem(atPath: url.path),
              let size = attributes[.size] as? Int64 else {
            return 0
        }
        return size
    }

    /// Format storage size as human-readable string
    var formattedStorageSize: String {
        let size = storageSize
        let formatter = ByteCountFormatter()
        formatter.allowedUnits = [.useKB, .useMB]
        formatter.countStyle = .file
        return formatter.string(fromByteCount: size)
    }
}

// MARK: - Backup and Restore

extension StorageService {
    /// Create a backup of current todos
    /// - Returns: Backup file URL
    func createBackup() -> URL? {
        let todos = loadTodos()
        guard let data = exportTodos(todos) else { return nil }

        let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd_HHmmss"
        let timestamp = dateFormatter.string(from: Date())
        let backupURL = documentsDirectory.appendingPathComponent("todos_backup_\(timestamp).json")

        do {
            try data.write(to: backupURL, options: .atomic)
            return backupURL
        } catch {
            print("Failed to create backup: \(error)")
            return nil
        }
    }

    /// Restore from a backup file
    /// - Parameter url: URL of the backup file
    /// - Returns: Success status
    func restoreFromBackup(url: URL) -> Bool {
        do {
            let data = try Data(contentsOf: url)
            if let todos = importTodos(from: data) {
                saveTodos(todos)
                return true
            }
            return false
        } catch {
            print("Failed to restore from backup: \(error)")
            return false
        }
    }
}
