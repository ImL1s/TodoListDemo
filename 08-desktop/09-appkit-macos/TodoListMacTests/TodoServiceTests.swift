//
//  TodoServiceTests.swift
//  TodoListMacTests
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import XCTest
@testable import TodoListMac

final class TodoServiceTests: XCTestCase {

    var todoService: TodoService!
    var todoManager: TodoManager!

    override func setUpWithError() throws {
        try super.setUpWithError()
        todoManager = TodoManager()
        todoManager.todos = []
        todoService = TodoService(todoManager: todoManager)
    }

    override func tearDownWithError() throws {
        todoService = nil
        todoManager = nil
        try super.tearDownWithError()
    }

    // MARK: - Validation Tests

    func testValidateTodoTitleValid() throws {
        // Given
        let title = "Valid Todo Title"

        // When
        let result = todoService.validateTodoTitle(title)

        // Then
        XCTAssertTrue(result.isValid)
        XCTAssertNil(result.message)
    }

    func testValidateTodoTitleEmpty() throws {
        // Given
        let title = ""

        // When
        let result = todoService.validateTodoTitle(title)

        // Then
        XCTAssertFalse(result.isValid)
        XCTAssertNotNil(result.message)
    }

    func testValidateTodoTitleTooLong() throws {
        // Given
        let title = String(repeating: "a", count: 501)

        // When
        let result = todoService.validateTodoTitle(title)

        // Then
        XCTAssertFalse(result.isValid)
        XCTAssertNotNil(result.message)
    }

    func testValidateTodoTitleDuplicate() throws {
        // Given
        todoManager.addTodo(title: "Existing Todo")
        let duplicateTitle = "Existing Todo"

        // When
        let result = todoService.validateTodoTitle(duplicateTitle)

        // Then
        // Should return warning, but still be valid
        XCTAssertTrue(result.isValid)
        XCTAssertNotNil(result.message)
    }

    func testValidateNotesValid() throws {
        // Given
        let notes = "Some valid notes"

        // When
        let result = todoService.validateNotes(notes)

        // Then
        XCTAssertTrue(result.isValid)
    }

    func testValidateNotesTooLong() throws {
        // Given
        let notes = String(repeating: "a", count: 5001)

        // When
        let result = todoService.validateNotes(notes)

        // Then
        XCTAssertFalse(result.isValid)
    }

    // MARK: - Priority Suggestion Tests

    func testSuggestPriorityHigh() throws {
        // Given
        let titles = ["URGENT task", "ASAP delivery", "CRITICAL bug", "Important meeting"]

        // When/Then
        for title in titles {
            let priority = todoService.suggestPriority(for: title)
            XCTAssertEqual(priority, 3, "Title '\(title)' should suggest high priority")
        }
    }

    func testSuggestPriorityMedium() throws {
        // Given
        let titles = ["Review code", "Update documentation", "Fix minor issue"]

        // When/Then
        for title in titles {
            let priority = todoService.suggestPriority(for: title)
            XCTAssertEqual(priority, 2, "Title '\(title)' should suggest medium priority")
        }
    }

    func testSuggestPriorityLow() throws {
        // Given
        let titles = ["Maybe do this", "Consider refactoring", "Think about new feature"]

        // When/Then
        for title in titles {
            let priority = todoService.suggestPriority(for: title)
            XCTAssertEqual(priority, 1, "Title '\(title)' should suggest low priority")
        }
    }

    func testSuggestPriorityDefault() throws {
        // Given
        let title = "Regular task without keywords"

        // When
        let priority = todoService.suggestPriority(for: title)

        // Then
        XCTAssertEqual(priority, 0)
    }

    // MARK: - Statistics Tests

    func testGetProductivityStats() throws {
        // Given
        todoManager.addTodo(title: "Active 1", priority: 3)
        todoManager.addTodo(title: "Active 2", priority: 2)
        let completed1 = todoManager.addTodo(title: "Completed 1", priority: 1)
        let completed2 = todoManager.addTodo(title: "Completed 2", priority: 0)
        completed1.isCompleted = true
        completed2.isCompleted = true

        // When
        let stats = todoService.getProductivityStats()

        // Then
        XCTAssertEqual(stats.totalTodos, 4)
        XCTAssertEqual(stats.activeTodos, 2)
        XCTAssertEqual(stats.completedTodos, 2)
        XCTAssertEqual(stats.highPriorityCount, 1)
        XCTAssertEqual(stats.mediumPriorityCount, 1)
        XCTAssertEqual(stats.lowPriorityCount, 1)
        XCTAssertEqual(stats.completionRate, 0.5, accuracy: 0.01)
    }

    func testGetProductivityStatsEmpty() throws {
        // When
        let stats = todoService.getProductivityStats()

        // Then
        XCTAssertEqual(stats.totalTodos, 0)
        XCTAssertEqual(stats.activeTodos, 0)
        XCTAssertEqual(stats.completedTodos, 0)
        XCTAssertEqual(stats.completionRate, 0)
    }

    // MARK: - Date Range Tests

    func testGetTodosCreatedBetween() throws {
        // Given
        let now = Date()
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: now)!
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: now)!

        todoManager.addTodo(title: "Today's todo")

        // When
        let todos = todoService.getTodos(createdBetween: yesterday, and: tomorrow)

        // Then
        XCTAssertEqual(todos.count, 1)
    }

    func testGetTodosCompletedBetween() throws {
        // Given
        let now = Date()
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: now)!
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: now)!

        let todo = todoManager.addTodo(title: "Test todo")
        todo.isCompleted = true
        todo.updatedAt = now

        // When
        let todos = todoService.getTodos(completedBetween: yesterday, and: tomorrow)

        // Then
        XCTAssertEqual(todos.count, 1)
    }

    // MARK: - Similar Todos Tests

    func testGetSimilarTodos() throws {
        // Given
        let todo1 = todoManager.addTodo(title: "Buy groceries from store")
        todoManager.addTodo(title: "Buy milk from store")
        todoManager.addTodo(title: "Clean the house")

        // When
        let similar = todoService.getSimilarTodos(to: todo1)

        // Then
        XCTAssertEqual(similar.count, 1)
        XCTAssertTrue(similar[0].title.contains("milk"))
    }

    func testGetSimilarTodosNoMatch() throws {
        // Given
        let todo1 = todoManager.addTodo(title: "Unique task")
        todoManager.addTodo(title: "Another different task")

        // When
        let similar = todoService.getSimilarTodos(to: todo1)

        // Then
        XCTAssertEqual(similar.count, 0)
    }

    // MARK: - CSV Export/Import Tests

    func testExportToCSV() throws {
        // Given
        todoManager.addTodo(title: "Test Todo", priority: 2)
        let completed = todoManager.addTodo(title: "Completed Todo", priority: 3)
        completed.isCompleted = true

        // When
        let csv = todoService.exportToCSV()

        // Then
        XCTAssertTrue(csv.contains("ID,Title,Completed,Priority,Created,Updated,Notes"))
        XCTAssertTrue(csv.contains("Test Todo"))
        XCTAssertTrue(csv.contains("Completed Todo"))
        XCTAssertTrue(csv.contains("Yes"))
        XCTAssertTrue(csv.contains("No"))
    }

    func testImportFromCSV() throws {
        // Given
        let csv = """
        ID,Title,Completed,Priority,Created,Updated,Notes
        uuid1,Buy milk,No,High,2025-01-01,2025-01-01,
        uuid2,Clean house,Yes,Low,2025-01-01,2025-01-01,Important notes
        """

        // When
        let importedCount = todoService.importFromCSV(csv)

        // Then
        XCTAssertEqual(importedCount, 2)
        XCTAssertEqual(todoManager.todos.count, 2)
        XCTAssertEqual(todoManager.todos[0].title, "Buy milk")
        XCTAssertEqual(todoManager.todos[1].title, "Clean house")
    }

    // MARK: - Performance Tests

    func testPerformanceGetProductivityStats() throws {
        // Given
        for i in 0..<1000 {
            let todo = todoManager.addTodo(title: "Todo \(i)", priority: i % 4)
            if i % 2 == 0 {
                todo.isCompleted = true
            }
        }

        // When/Then
        measure {
            _ = todoService.getProductivityStats()
        }
    }

    func testPerformanceSuggestPriority() throws {
        let titles = [
            "URGENT task needs attention",
            "Review the code carefully",
            "Maybe consider this later",
            "Regular task to complete"
        ]

        measure {
            for title in titles {
                _ = todoService.suggestPriority(for: title)
            }
        }
    }
}
