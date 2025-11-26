package com.example.todolist.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

/**
 * Todo Model for Swing Application
 *
 * Simple POJO representing a todo item.
 * Immutable properties with getter/setter methods.
 */
public class Todo {

    private long id;
    private String text;
    private boolean completed;
    private LocalDateTime createdAt;

    private static long nextId = 1;

    /**
     * Default constructor
     */
    public Todo() {
        this("", false);
    }

    /**
     * Constructor with text
     *
     * @param text the todo text
     */
    public Todo(String text) {
        this(text, false);
    }

    /**
     * Constructor with text and completion status
     *
     * @param text      the todo text
     * @param completed the completion status
     */
    public Todo(String text, boolean completed) {
        this(nextId++, text, completed, LocalDateTime.now());
    }

    /**
     * Full constructor
     *
     * @param id        the todo ID
     * @param text      the todo text
     * @param completed the completion status
     * @param createdAt the creation timestamp
     */
    public Todo(long id, String text, boolean completed, LocalDateTime createdAt) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt;

        // Update nextId if needed
        if (id >= nextId) {
            nextId = id + 1;
        }
    }

    // ==================== Getters and Setters ====================

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // ==================== Helper Methods ====================

    /**
     * Toggle the completion status
     */
    public void toggle() {
        this.completed = !this.completed;
    }

    /**
     * Get formatted creation date/time
     *
     * @return formatted date string
     */
    public String getFormattedCreatedAt() {
        if (createdAt == null) {
            return "";
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return createdAt.format(formatter);
    }

    /**
     * Get status display text
     *
     * @return "Completed" or "Active"
     */
    public String getStatusText() {
        return completed ? "✓ Completed" : "○ Active";
    }

    // ==================== Object Methods ====================

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Todo todo = (Todo) o;
        return id == todo.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return String.format("Todo[id=%d, text='%s', completed=%s, createdAt=%s]",
                id, text, completed, getFormattedCreatedAt());
    }

    /**
     * Reset the ID counter (useful for testing)
     */
    public static void resetIdCounter() {
        nextId = 1;
    }
}
