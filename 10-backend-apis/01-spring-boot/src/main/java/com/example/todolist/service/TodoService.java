package com.example.todolist.service;

import com.example.todolist.model.Todo;
import com.example.todolist.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Todo Service
 *
 * Business logic layer for managing todo items.
 * Handles CRUD operations and additional business rules.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;

    /**
     * Get all todos
     *
     * @return list of all todos ordered by creation date (newest first)
     */
    public List<Todo> getAllTodos() {
        log.info("Fetching all todos");
        return todoRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Get a specific todo by ID
     *
     * @param id the todo ID
     * @return Optional containing the todo if found
     */
    public Optional<Todo> getTodoById(Long id) {
        log.info("Fetching todo with id: {}", id);
        return todoRepository.findById(id);
    }

    /**
     * Create a new todo
     *
     * @param todo the todo to create
     * @return the created todo with generated ID
     */
    public Todo createTodo(Todo todo) {
        log.info("Creating new todo: {}", todo.getText());

        // Ensure completed is set to false for new todos
        if (todo.getCompleted() == null) {
            todo.setCompleted(false);
        }

        Todo savedTodo = todoRepository.save(todo);
        log.info("Todo created with id: {}", savedTodo.getId());
        return savedTodo;
    }

    /**
     * Update an existing todo
     *
     * @param id   the ID of the todo to update
     * @param todo the updated todo data
     * @return the updated todo
     * @throws RuntimeException if todo not found
     */
    public Todo updateTodo(Long id, Todo todo) {
        log.info("Updating todo with id: {}", id);

        return todoRepository.findById(id)
                .map(existingTodo -> {
                    existingTodo.setText(todo.getText());
                    existingTodo.setCompleted(todo.getCompleted());
                    Todo updatedTodo = todoRepository.save(existingTodo);
                    log.info("Todo updated successfully: {}", id);
                    return updatedTodo;
                })
                .orElseThrow(() -> {
                    log.error("Todo not found with id: {}", id);
                    return new RuntimeException("Todo not found with id: " + id);
                });
    }

    /**
     * Toggle the completion status of a todo
     *
     * @param id the ID of the todo to toggle
     * @return the updated todo
     * @throws RuntimeException if todo not found
     */
    public Todo toggleTodo(Long id) {
        log.info("Toggling todo completion status with id: {}", id);

        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setCompleted(!todo.getCompleted());
                    Todo updatedTodo = todoRepository.save(todo);
                    log.info("Todo toggled successfully: {} - completed: {}", id, updatedTodo.getCompleted());
                    return updatedTodo;
                })
                .orElseThrow(() -> {
                    log.error("Todo not found with id: {}", id);
                    return new RuntimeException("Todo not found with id: " + id);
                });
    }

    /**
     * Delete a todo
     *
     * @param id the ID of the todo to delete
     * @throws RuntimeException if todo not found
     */
    public void deleteTodo(Long id) {
        log.info("Deleting todo with id: {}", id);

        if (!todoRepository.existsById(id)) {
            log.error("Todo not found with id: {}", id);
            throw new RuntimeException("Todo not found with id: " + id);
        }

        todoRepository.deleteById(id);
        log.info("Todo deleted successfully: {}", id);
    }

    /**
     * Delete all todos
     */
    public void deleteAllTodos() {
        log.info("Deleting all todos");
        todoRepository.deleteAll();
        log.info("All todos deleted successfully");
    }

    /**
     * Get todos by completion status
     *
     * @param completed the completion status to filter by
     * @return list of todos matching the status
     */
    public List<Todo> getTodosByStatus(Boolean completed) {
        log.info("Fetching todos with completed status: {}", completed);
        return todoRepository.findByCompleted(completed);
    }

    /**
     * Search todos by text
     *
     * @param searchText the text to search for
     * @return list of todos containing the search text
     */
    public List<Todo> searchTodos(String searchText) {
        log.info("Searching todos with text: {}", searchText);
        return todoRepository.findByTextContainingIgnoreCase(searchText);
    }

    /**
     * Get count of all todos
     *
     * @return total number of todos
     */
    public long getTodoCount() {
        long count = todoRepository.count();
        log.info("Total todo count: {}", count);
        return count;
    }

    /**
     * Get count of completed todos
     *
     * @return number of completed todos
     */
    public long getCompletedTodoCount() {
        long count = todoRepository.findByCompleted(true).size();
        log.info("Completed todo count: {}", count);
        return count;
    }
}
