package com.example.todocompose.data

import androidx.compose.runtime.Immutable
import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

/**
 * Todo - Data class representing a single todo item
 *
 * This immutable data class follows Kotlin best practices and serves as the
 * core domain model for the application. It uses:
 * - Room annotations for database persistence
 * - kotlinx.serialization for JSON serialization
 * - @Immutable for Compose optimization
 *
 * Key Design Decisions:
 * 1. Immutable (val properties + @Immutable): Ensures thread safety and Compose optimization
 * 2. Data class: Automatically provides equals(), hashCode(), copy(), toString()
 * 3. Room Entity: Database table representation
 * 4. Serializable: Enables JSON conversion for DataStore/backup
 * 5. UUID for IDs: Ensures globally unique identifiers
 * 6. Timestamp: Tracks creation time for sorting/filtering
 *
 * @property id Unique identifier for the todo item (UUID string)
 * @property text The todo description/title
 * @property completed Whether the todo is marked as done
 * @property timestamp Creation time in milliseconds since epoch
 *
 * Example usage:
 * ```kotlin
 * val todo = Todo(
 *     id = UUID.randomUUID().toString(),
 *     text = "Learn Jetpack Compose",
 *     completed = false,
 *     timestamp = System.currentTimeMillis()
 * )
 *
 * // Create a completed version
 * val completedTodo = todo.copy(completed = true)
 * ```
 */
@Entity(tableName = "todos")
@Serializable
@Immutable
data class Todo(
    @PrimaryKey
    val id: String,
    val text: String,
    val completed: Boolean = false,
    val timestamp: Long = System.currentTimeMillis()
) {
    companion object {
        /**
         * Creates a new Todo with a generated ID and current timestamp
         *
         * @param text The todo description
         * @param completed Initial completion state (default: false)
         * @return A new Todo instance
         */
        fun create(text: String, completed: Boolean = false): Todo {
            return Todo(
                id = java.util.UUID.randomUUID().toString(),
                text = text,
                completed = completed,
                timestamp = System.currentTimeMillis()
            )
        }
    }
}

/**
 * TodoFilter - Enum for filtering todos by completion state
 *
 * This enum is used in the UI to toggle between different views of the todo list.
 * It follows the Filter pattern commonly used in todo applications.
 *
 * @property ALL Show all todos regardless of completion state
 * @property ACTIVE Show only incomplete todos
 * @property COMPLETED Show only completed todos
 */
enum class TodoFilter {
    ALL,
    ACTIVE,
    COMPLETED;

    /**
     * Applies this filter to a list of todos
     *
     * @param todos The list to filter
     * @return Filtered list based on the filter type
     */
    fun filter(todos: List<Todo>): List<Todo> {
        return when (this) {
            ALL -> todos
            ACTIVE -> todos.filter { !it.completed }
            COMPLETED -> todos.filter { it.completed }
        }
    }

    /**
     * Gets a human-readable label for this filter
     *
     * @return Display name for the filter
     */
    fun getLabel(): String {
        return when (this) {
            ALL -> "All"
            ACTIVE -> "Active"
            COMPLETED -> "Completed"
        }
    }
}
