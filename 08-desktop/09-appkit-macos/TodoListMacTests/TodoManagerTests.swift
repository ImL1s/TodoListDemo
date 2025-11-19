//
//  TodoManagerTests.swift
//  TodoListMacTests
//
//  Created on 2025-11-19
//  AppKit macOS Todo List Application
//

import XCTest
@testable import TodoListMac

final class TodoManagerTests: XCTestCase {

    var todoManager: TodoManager!

    override func setUpWithError() throws {
        try super.setUpWithError()
        todoManager = TodoManager()
        todoManager.todos = [] // Clear todos for each test
    }

    override func tearDownWithError() throws {
        todoManager = nil
        try super.tearDownWithError()
    }

    // MARK: - Adding Todos

    func testAddTodo() throws {
        // Given
        let initialCount = todoManager.todos.count

        // When
        let todo = todoManager.addTodo(title: "Test Todo")

        // Then
        XCTAssertEqual(todoManager.todos.count, initialCount + 1)
        XCTAssertEqual(todo.title, "Test Todo")
        XCTAssertFalse(todo.isCompleted)
        XCTAssertEqual(todo.priority, 0)
    }

    func testAddTodoWithPriority() throws {
        // When
        let todo = todoManager.addTodo(title: "High Priority Task", priority: 3)

        // Then
        XCTAssertEqual(todo.priority, 3)
        XCTAssertEqual(todo.priorityDescription, "High")
    }

    // MARK: - Removing Todos

    func testRemoveTodo() throws {
        // Given
        let todo = todoManager.addTodo(title: "Test Todo")
        let initialCount = todoManager.todos.count

        // When
        todoManager.removeTodo(todo)

        // Then
        XCTAssertEqual(todoManager.todos.count, initialCount - 1)
        XCTAssertFalse(todoManager.todos.contains(todo))
    }

    func testRemoveTodoAtIndex() throws {
        // Given
        todoManager.addTodo(title: "First")
        todoManager.addTodo(title: "Second")
        todoManager.addTodo(title: "Third")

        // When
        todoManager.removeTodo(at: 1)

        // Then
        XCTAssertEqual(todoManager.todos.count, 2)
        XCTAssertEqual(todoManager.todos[0].title, "First")
        XCTAssertEqual(todoManager.todos[1].title, "Third")
    }

    // MARK: - Updating Todos

    func testToggleTodoCompletion() throws {
        // Given
        let todo = todoManager.addTodo(title: "Test Todo")
        let initialStatus = todo.isCompleted

        // When
        todoManager.toggleTodoCompletion(todo)

        // Then
        XCTAssertNotEqual(todo.isCompleted, initialStatus)
        XCTAssertTrue(todo.isCompleted)
    }

    func testUpdateTodoTitle() throws {
        // Given
        let todo = todoManager.addTodo(title: "Old Title")
        let newTitle = "New Title"

        // When
        todoManager.updateTodoTitle(todo, newTitle: newTitle)

        // Then
        XCTAssertEqual(todo.title, newTitle)
    }

    func testUpdateTodoPriority() throws {
        // Given
        let todo = todoManager.addTodo(title: "Test Todo", priority: 1)

        // When
        todoManager.updateTodoPriority(todo, priority: 3)

        // Then
        XCTAssertEqual(todo.priority, 3)
    }

    // MARK: - Filtering

    func testFilterAll() throws {
        // Given
        todoManager.addTodo(title: "Active Todo")
        let completedTodo = todoManager.addTodo(title: "Completed Todo")
        completedTodo.isCompleted = true

        // When
        todoManager.setFilter(.all)
        let filtered = todoManager.filteredTodos()

        // Then
        XCTAssertEqual(filtered.count, 2)
    }

    func testFilterActive() throws {
        // Given
        todoManager.addTodo(title: "Active Todo")
        let completedTodo = todoManager.addTodo(title: "Completed Todo")
        completedTodo.isCompleted = true

        // When
        todoManager.setFilter(.active)
        let filtered = todoManager.filteredTodos()

        // Then
        XCTAssertEqual(filtered.count, 1)
        XCTAssertFalse(filtered[0].isCompleted)
    }

    func testFilterCompleted() throws {
        // Given
        todoManager.addTodo(title: "Active Todo")
        let completedTodo = todoManager.addTodo(title: "Completed Todo")
        completedTodo.isCompleted = true

        // When
        todoManager.setFilter(.completed)
        let filtered = todoManager.filteredTodos()

        // Then
        XCTAssertEqual(filtered.count, 1)
        XCTAssertTrue(filtered[0].isCompleted)
    }

    // MARK: - Sorting

    func testSortByDateCreated() throws {
        // Given
        let first = todoManager.addTodo(title: "First")
        Thread.sleep(forTimeInterval: 0.01)
        let second = todoManager.addTodo(title: "Second")

        // When
        todoManager.setSort(.dateCreated)
        let sorted = todoManager.filteredAndSortedTodos()

        // Then
        XCTAssertEqual(sorted[0].id, second.id) // Newest first
        XCTAssertEqual(sorted[1].id, first.id)
    }

    func testSortByPriority() throws {
        // Given
        todoManager.addTodo(title: "Low", priority: 1)
        todoManager.addTodo(title: "High", priority: 3)
        todoManager.addTodo(title: "Medium", priority: 2)

        // When
        todoManager.setSort(.priority)
        let sorted = todoManager.filteredAndSortedTodos()

        // Then
        XCTAssertEqual(sorted[0].priority, 3)
        XCTAssertEqual(sorted[1].priority, 2)
        XCTAssertEqual(sorted[2].priority, 1)
    }

    // MARK: - Statistics

    func testTotalCount() throws {
        // Given
        todoManager.addTodo(title: "First")
        todoManager.addTodo(title: "Second")

        // Then
        XCTAssertEqual(todoManager.totalCount, 2)
    }

    func testActiveCount() throws {
        // Given
        todoManager.addTodo(title: "Active")
        let completed = todoManager.addTodo(title: "Completed")
        completed.isCompleted = true

        // Then
        XCTAssertEqual(todoManager.activeCount, 1)
    }

    func testCompletedCount() throws {
        // Given
        todoManager.addTodo(title: "Active")
        let completed = todoManager.addTodo(title: "Completed")
        completed.isCompleted = true

        // Then
        XCTAssertEqual(todoManager.completedCount, 1)
    }

    func testCompletionPercentage() throws {
        // Given
        todoManager.addTodo(title: "Active 1")
        todoManager.addTodo(title: "Active 2")
        let completed1 = todoManager.addTodo(title: "Completed 1")
        let completed2 = todoManager.addTodo(title: "Completed 2")
        completed1.isCompleted = true
        completed2.isCompleted = true

        // Then
        XCTAssertEqual(todoManager.completionPercentage, 50.0, accuracy: 0.01)
    }

    // MARK: - Bulk Operations

    func testClearCompleted() throws {
        // Given
        todoManager.addTodo(title: "Active")
        let completed1 = todoManager.addTodo(title: "Completed 1")
        let completed2 = todoManager.addTodo(title: "Completed 2")
        completed1.isCompleted = true
        completed2.isCompleted = true

        // When
        todoManager.clearCompleted()

        // Then
        XCTAssertEqual(todoManager.todos.count, 1)
        XCTAssertFalse(todoManager.todos[0].isCompleted)
    }

    func testCompleteAll() throws {
        // Given
        todoManager.addTodo(title: "First")
        todoManager.addTodo(title: "Second")

        // When
        todoManager.completeAll()

        // Then
        XCTAssertTrue(todoManager.todos.allSatisfy { $0.isCompleted })
    }

    // MARK: - Search

    func testSearchTodos() throws {
        // Given
        todoManager.addTodo(title: "Buy milk")
        todoManager.addTodo(title: "Buy bread")
        todoManager.addTodo(title: "Clean house")

        // When
        let results = todoManager.searchTodos(query: "buy")

        // Then
        XCTAssertEqual(results.count, 2)
        XCTAssertTrue(results.allSatisfy { $0.title.lowercased().contains("buy") })
    }

    func testSearchTodosWithEmptyQuery() throws {
        // Given
        todoManager.addTodo(title: "First")
        todoManager.addTodo(title: "Second")

        // When
        let results = todoManager.searchTodos(query: "")

        // Then
        XCTAssertEqual(results.count, todoManager.todos.count)
    }

    // MARK: - Performance

    func testPerformanceAddingManyTodos() throws {
        measure {
            for i in 0..<1000 {
                todoManager.addTodo(title: "Todo \(i)")
            }
        }
    }

    func testPerformanceFiltering() throws {
        // Given
        for i in 0..<1000 {
            let todo = todoManager.addTodo(title: "Todo \(i)")
            if i % 2 == 0 {
                todo.isCompleted = true
            }
        }

        // When/Then
        measure {
            todoManager.setFilter(.active)
            _ = todoManager.filteredTodos()
        }
    }
}
