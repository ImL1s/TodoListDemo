package com.example.todolist.model;

import javafx.beans.property.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

/**
 * Todo Model with JavaFX Properties
 *
 * Uses JavaFX observable properties for automatic UI updates.
 * Provides data binding capabilities for TableView and ListView.
 */
public class Todo {

    private final LongProperty id;
    private final StringProperty text;
    private final BooleanProperty completed;
    private final ObjectProperty<LocalDateTime> createdAt;

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
        this.id = new SimpleLongProperty(id);
        this.text = new SimpleStringProperty(text);
        this.completed = new SimpleBooleanProperty(completed);
        this.createdAt = new SimpleObjectProperty<>(createdAt);

        // Update nextId if needed
        if (id >= nextId) {
            nextId = id + 1;
        }
    }

    // ==================== ID Property ====================

    public long getId() {
        return id.get();
    }

    public void setId(long id) {
        this.id.set(id);
    }

    public LongProperty idProperty() {
        return id;
    }

    // ==================== Text Property ====================

    public String getText() {
        return text.get();
    }

    public void setText(String text) {
        this.text.set(text);
    }

    public StringProperty textProperty() {
        return text;
    }

    // ==================== Completed Property ====================

    public boolean isCompleted() {
        return completed.get();
    }

    public void setCompleted(boolean completed) {
        this.completed.set(completed);
    }

    public BooleanProperty completedProperty() {
        return completed;
    }

    // ==================== CreatedAt Property ====================

    public LocalDateTime getCreatedAt() {
        return createdAt.get();
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt.set(createdAt);
    }

    public ObjectProperty<LocalDateTime> createdAtProperty() {
        return createdAt;
    }

    // ==================== Helper Methods ====================

    /**
     * Toggle the completion status
     */
    public void toggle() {
        setCompleted(!isCompleted());
    }

    /**
     * Get formatted creation date/time
     *
     * @return formatted date string
     */
    public String getFormattedCreatedAt() {
        if (createdAt.get() == null) {
            return "";
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return createdAt.get().format(formatter);
    }

    /**
     * Get status display text
     *
     * @return "Completed" or "Active"
     */
    public String getStatusText() {
        return isCompleted() ? "✓ Completed" : "○ Active";
    }

    // ==================== Object Methods ====================

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Todo todo = (Todo) o;
        return getId() == todo.getId();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    @Override
    public String toString() {
        return String.format("Todo[id=%d, text='%s', completed=%s, createdAt=%s]",
                getId(), getText(), isCompleted(), getFormattedCreatedAt());
    }

    /**
     * Reset the ID counter (useful for testing)
     */
    public static void resetIdCounter() {
        nextId = 1;
    }
}
