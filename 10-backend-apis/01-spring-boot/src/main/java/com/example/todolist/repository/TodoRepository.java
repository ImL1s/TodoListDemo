package com.example.todolist.repository;

import com.example.todolist.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Todo Repository Interface
 *
 * Provides CRUD operations for Todo entities using Spring Data JPA.
 * Extends JpaRepository to inherit standard database operations.
 */
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    /**
     * Find all todos by completion status
     *
     * @param completed the completion status to filter by
     * @return list of todos matching the completion status
     */
    List<Todo> findByCompleted(Boolean completed);

    /**
     * Find all todos ordered by creation date descending
     *
     * @return list of todos ordered by newest first
     */
    List<Todo> findAllByOrderByCreatedAtDesc();

    /**
     * Find todos containing specific text (case-insensitive)
     *
     * @param text the text to search for
     * @return list of todos containing the search text
     */
    List<Todo> findByTextContainingIgnoreCase(String text);
}
