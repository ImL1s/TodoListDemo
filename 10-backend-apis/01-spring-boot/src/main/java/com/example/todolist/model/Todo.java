package com.example.todolist.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Todo Entity
 *
 * Represents a single todo item in the database.
 * Uses JPA annotations for ORM mapping and Lombok for boilerplate code reduction.
 */
@Entity
@Table(name = "todos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Todo {

    /**
     * Unique identifier for the todo item
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Text description of the todo item
     * Must be between 1 and 500 characters
     */
    @NotBlank(message = "Todo text cannot be blank")
    @Size(min = 1, max = 500, message = "Todo text must be between 1 and 500 characters")
    @Column(nullable = false, length = 500)
    private String text;

    /**
     * Completion status of the todo item
     * Defaults to false (not completed)
     */
    @Column(nullable = false)
    private Boolean completed = false;

    /**
     * Timestamp when the todo was created
     * Automatically set by Hibernate
     */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Constructor for creating a new todo with text only
     *
     * @param text the todo text description
     */
    public Todo(String text) {
        this.text = text;
        this.completed = false;
    }

    /**
     * Constructor for creating a todo with text and completion status
     *
     * @param text      the todo text description
     * @param completed the completion status
     */
    public Todo(String text, Boolean completed) {
        this.text = text;
        this.completed = completed;
    }
}
