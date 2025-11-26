package com.example.todolist.model;

import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.util.Objects;

/**
 * Todo Entity for Room Database
 *
 * Represents a todo item in the SQLite database.
 * Uses Room annotations for ORM mapping.
 */
@Entity(tableName = "todos")
public class Todo {

    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "id")
    private long id;

    @ColumnInfo(name = "text")
    private String text;

    @ColumnInfo(name = "completed")
    private boolean completed;

    @ColumnInfo(name = "created_at")
    private long createdAt;

    /**
     * Default constructor (required by Room)
     */
    public Todo() {
        this.completed = false;
        this.createdAt = System.currentTimeMillis();
    }

    /**
     * Constructor with text
     *
     * @param text the todo text
     */
    public Todo(String text) {
        this.text = text;
        this.completed = false;
        this.createdAt = System.currentTimeMillis();
    }

    /**
     * Full constructor
     *
     * @param id        the todo ID
     * @param text      the todo text
     * @param completed the completion status
     * @param createdAt the creation timestamp
     */
    public Todo(long id, String text, boolean completed, long createdAt) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt;
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

    public long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(long createdAt) {
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
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm", java.util.Locale.getDefault());
        return sdf.format(new java.util.Date(createdAt));
    }

    /**
     * Get status display text
     *
     * @return "Completed" or "Active"
     */
    public String getStatusText() {
        return completed ? "Completed" : "Active";
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
}
