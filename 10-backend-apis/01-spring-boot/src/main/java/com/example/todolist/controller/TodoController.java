package com.example.todolist.controller;

import com.example.todolist.model.Todo;
import com.example.todolist.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Todo REST Controller
 *
 * Provides RESTful API endpoints for managing todo items.
 * All endpoints are under /api/todos path.
 */
@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Allow CORS for frontend integration
public class TodoController {

    private final TodoService todoService;

    /**
     * GET /api/todos
     * Get all todos
     *
     * @return list of all todos
     */
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {
        log.info("GET /api/todos - Fetching all todos");
        List<Todo> todos = todoService.getAllTodos();
        return ResponseEntity.ok(todos);
    }

    /**
     * GET /api/todos/stats
     * Get statistics about todos
     *
     * @return statistics map with total and completed counts
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTodoStats() {
        log.info("GET /api/todos/stats - Fetching todo statistics");
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", todoService.getTodoCount());
        stats.put("completed", todoService.getCompletedTodoCount());
        stats.put("active", todoService.getTodoCount() - todoService.getCompletedTodoCount());
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/todos/filter?completed={true|false}
     * Get todos by completion status
     *
     * @param completed the completion status to filter by
     * @return list of todos matching the status
     */
    @GetMapping("/filter")
    public ResponseEntity<List<Todo>> getTodosByStatus(@RequestParam Boolean completed) {
        log.info("GET /api/todos/filter?completed={} - Filtering todos", completed);
        List<Todo> todos = todoService.getTodosByStatus(completed);
        return ResponseEntity.ok(todos);
    }

    /**
     * GET /api/todos/search?q={searchText}
     * Search todos by text
     *
     * @param q the search query
     * @return list of todos containing the search text
     */
    @GetMapping("/search")
    public ResponseEntity<List<Todo>> searchTodos(@RequestParam String q) {
        log.info("GET /api/todos/search?q={} - Searching todos", q);
        List<Todo> todos = todoService.searchTodos(q);
        return ResponseEntity.ok(todos);
    }

    /**
     * GET /api/todos/{id}
     * Get a specific todo by ID
     *
     * @param id the todo ID
     * @return the todo if found, 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        log.info("GET /api/todos/{} - Fetching todo by id", id);
        return todoService.getTodoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/todos
     * Create a new todo
     *
     * @param todo the todo to create
     * @return the created todo with 201 status
     */
    @PostMapping
    public ResponseEntity<Todo> createTodo(@Valid @RequestBody Todo todo) {
        log.info("POST /api/todos - Creating new todo");
        Todo createdTodo = todoService.createTodo(todo);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    /**
     * PUT /api/todos/{id}
     * Update an existing todo
     *
     * @param id   the todo ID
     * @param todo the updated todo data
     * @return the updated todo if found, 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @Valid @RequestBody Todo todo) {
        log.info("PUT /api/todos/{} - Updating todo", id);
        try {
            Todo updatedTodo = todoService.updateTodo(id, todo);
            return ResponseEntity.ok(updatedTodo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH /api/todos/{id}/toggle
     * Toggle the completion status of a todo
     *
     * @param id the todo ID
     * @return the updated todo if found, 404 if not found
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Todo> toggleTodo(@PathVariable Long id) {
        log.info("PATCH /api/todos/{}/toggle - Toggling todo", id);
        try {
            Todo updatedTodo = todoService.toggleTodo(id);
            return ResponseEntity.ok(updatedTodo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/todos/{id}
     * Delete a specific todo
     *
     * @param id the todo ID
     * @return 204 No Content if deleted, 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        log.info("DELETE /api/todos/{} - Deleting todo", id);
        try {
            todoService.deleteTodo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/todos
     * Delete all todos
     *
     * @return 204 No Content
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllTodos() {
        log.info("DELETE /api/todos - Deleting all todos");
        todoService.deleteAllTodos();
        return ResponseEntity.noContent().build();
    }

    /**
     * Exception handler for validation errors
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        log.error("Error occurred: {}", e.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
