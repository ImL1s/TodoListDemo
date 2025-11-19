//
//  StorageServiceTests.swift
//  TodoListMacTests
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import XCTest
@testable import TodoListMac

final class StorageServiceTests: XCTestCase {

    var storageService: StorageService!
    var testTodos: [TodoItem]!

    override func setUpWithError() throws {
        try super.setUpWithError()
        storageService = StorageService(storageType: .userDefaults)

        // Create test todos
        testTodos = [
            TodoItem(title: "Test Todo 1", priority: 1),
            TodoItem(title: "Test Todo 2", priority: 2),
            TodoItem(title: "Test Todo 3", priority: 3)
        ]
    }

    override func tearDownWithError() throws {
        storageService.clearAll()
        storageService = nil
        testTodos = nil
        try super.tearDownWithError()
    }

    // MARK: - Save and Load Tests

    func testSaveAndLoadTodos() throws {
        // Given/When
        storageService.saveTodos(testTodos)
        let loadedTodos = storageService.loadTodos()

        // Then
        XCTAssertEqual(loadedTodos.count, testTodos.count)
        XCTAssertEqual(loadedTodos[0].title, testTodos[0].title)
        XCTAssertEqual(loadedTodos[1].title, testTodos[1].title)
        XCTAssertEqual(loadedTodos[2].title, testTodos[2].title)
    }

    func testLoadEmptyTodos() throws {
        // Given
        storageService.clearAll()

        // When
        let loadedTodos = storageService.loadTodos()

        // Then
        XCTAssertEqual(loadedTodos.count, 0)
    }

    // MARK: - Export and Import Tests

    func testExportTodos() throws {
        // When
        let data = storageService.exportTodos(testTodos)

        // Then
        XCTAssertNotNil(data)
        XCTAssertGreaterThan(data?.count ?? 0, 0)
    }

    func testImportTodos() throws {
        // Given
        let exportedData = storageService.exportTodos(testTodos)
        XCTAssertNotNil(exportedData)

        // When
        let importedTodos = storageService.importTodos(from: exportedData!)

        // Then
        XCTAssertNotNil(importedTodos)
        XCTAssertEqual(importedTodos?.count, testTodos.count)
    }

    func testImportInvalidData() throws {
        // Given
        let invalidData = "Invalid JSON".data(using: .utf8)!

        // When
        let importedTodos = storageService.importTodos(from: invalidData)

        // Then
        XCTAssertNil(importedTodos)
    }

    // MARK: - Storage Type Tests

    func testChangeStorageType() throws {
        // Given
        storageService.saveTodos(testTodos)

        // When
        storageService.changeStorageType(to: .jsonFile)

        // Then
        XCTAssertEqual(storageService.currentStorageType, .jsonFile)
        let loadedTodos = storageService.loadTodos()
        XCTAssertEqual(loadedTodos.count, testTodos.count)
    }

    // MARK: - Backup and Restore Tests

    func testCreateBackup() throws {
        // Given
        storageService.saveTodos(testTodos)

        // When
        let backupURL = storageService.createBackup()

        // Then
        XCTAssertNotNil(backupURL)
        XCTAssertTrue(FileManager.default.fileExists(atPath: backupURL!.path))

        // Cleanup
        if let url = backupURL {
            try? FileManager.default.removeItem(at: url)
        }
    }

    func testRestoreFromBackup() throws {
        // Given
        storageService.saveTodos(testTodos)
        let backupURL = storageService.createBackup()
        XCTAssertNotNil(backupURL)

        // Clear current data
        storageService.clearAll()
        XCTAssertEqual(storageService.loadTodos().count, 0)

        // When
        let restored = storageService.restoreFromBackup(url: backupURL!)

        // Then
        XCTAssertTrue(restored)
        let loadedTodos = storageService.loadTodos()
        XCTAssertEqual(loadedTodos.count, testTodos.count)

        // Cleanup
        try? FileManager.default.removeItem(at: backupURL!)
    }

    // MARK: - Clear Data Tests

    func testClearAll() throws {
        // Given
        storageService.saveTodos(testTodos)
        XCTAssertGreaterThan(storageService.loadTodos().count, 0)

        // When
        storageService.clearAll()

        // Then
        XCTAssertEqual(storageService.loadTodos().count, 0)
    }

    // MARK: - Storage Info Tests

    func testStorageSize() throws {
        // Given
        storageService.saveTodos(testTodos)

        // When
        let size = storageService.storageSize

        // Then
        XCTAssertGreaterThan(size, 0)
    }

    func testFormattedStorageSize() throws {
        // Given
        storageService.saveTodos(testTodos)

        // When
        let formattedSize = storageService.formattedStorageSize

        // Then
        XCTAssertFalse(formattedSize.isEmpty)
        XCTAssertTrue(formattedSize.contains("B") || formattedSize.contains("KB"))
    }

    func testLastSyncDate() throws {
        // Given
        let beforeSave = Date()
        storageService.saveTodos(testTodos)
        let afterSave = Date()

        // When
        let lastSync = storageService.lastSyncDate

        // Then
        XCTAssertNotNil(lastSync)
        XCTAssertGreaterThanOrEqual(lastSync!, beforeSave)
        XCTAssertLessThanOrEqual(lastSync!, afterSave)
    }

    // MARK: - Performance Tests

    func testPerformanceSaveTodos() throws {
        // Given
        var largeTodoList: [TodoItem] = []
        for i in 0..<1000 {
            largeTodoList.append(TodoItem(title: "Todo \(i)", priority: i % 4))
        }

        // When/Then
        measure {
            storageService.saveTodos(largeTodoList)
        }
    }

    func testPerformanceLoadTodos() throws {
        // Given
        var largeTodoList: [TodoItem] = []
        for i in 0..<1000 {
            largeTodoList.append(TodoItem(title: "Todo \(i)", priority: i % 4))
        }
        storageService.saveTodos(largeTodoList)

        // When/Then
        measure {
            _ = storageService.loadTodos()
        }
    }

    func testPerformanceExportImport() throws {
        // Given
        var largeTodoList: [TodoItem] = []
        for i in 0..<1000 {
            largeTodoList.append(TodoItem(title: "Todo \(i)", priority: i % 4))
        }

        // When/Then
        measure {
            if let data = storageService.exportTodos(largeTodoList) {
                _ = storageService.importTodos(from: data)
            }
        }
    }
}
