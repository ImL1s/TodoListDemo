package com.example.todocompose.data.local

import androidx.room.*
import com.example.todocompose.data.Todo
import kotlinx.coroutines.flow.Flow

/**
 * TodoDao - Data Access Object for Todo entities
 *
 * This interface defines all database operations for Todos using Room.
 * Room automatically generates implementations at compile time.
 *
 * Key Features:
 * 1. **Flow for Reactive Updates**: Queries return Flow for automatic UI updates
 * 2. **Suspend Functions**: All write operations are suspend for coroutines
 * 3. **Type Safety**: Compile-time SQL verification
 * 4. **Transaction Support**: Room handles transactions automatically
 *
 * Flow Benefits:
 * - Automatically emits new values when database changes
 * - No need to manually refresh queries
 * - Lifecycle-aware when collected properly
 * - Cancellable and composable
 *
 * @see Todo The entity this DAO operates on
 * @see TodoDatabase The database containing this DAO
 *
 * Example usage:
 * ```kotlin
 * @Inject constructor(private val todoDao: TodoDao) {
 *     val allTodos: Flow<List<Todo>> = todoDao.getAllTodos()
 *
 *     suspend fun addTodo(todo: Todo) {
 *         todoDao.insert(todo)
 *     }
 * }
 * ```
 */
@Dao
interface TodoDao {

    /**
     * Get all todos ordered by timestamp (newest first)
     *
     * Returns a Flow that emits a new list whenever the database changes.
     * This is perfect for observing todos in the UI.
     *
     * @return Flow emitting list of all todos
     */
    @Query("SELECT * FROM todos ORDER BY timestamp DESC")
    fun getAllTodos(): Flow<List<Todo>>

    /**
     * Get only active (incomplete) todos
     *
     * @return Flow emitting list of active todos
     */
    @Query("SELECT * FROM todos WHERE completed = 0 ORDER BY timestamp DESC")
    fun getActiveTodos(): Flow<List<Todo>>

    /**
     * Get only completed todos
     *
     * @return Flow emitting list of completed todos
     */
    @Query("SELECT * FROM todos WHERE completed = 1 ORDER BY timestamp DESC")
    fun getCompletedTodos(): Flow<List<Todo>>

    /**
     * Get a single todo by ID
     *
     * @param todoId The ID of the todo to retrieve
     * @return Flow emitting the todo, or null if not found
     */
    @Query("SELECT * FROM todos WHERE id = :todoId")
    fun getTodoById(todoId: String): Flow<Todo?>

    /**
     * Get count of active todos
     *
     * @return Flow emitting the count of incomplete todos
     */
    @Query("SELECT COUNT(*) FROM todos WHERE completed = 0")
    fun getActiveCount(): Flow<Int>

    /**
     * Get count of completed todos
     *
     * @return Flow emitting the count of completed todos
     */
    @Query("SELECT COUNT(*) FROM todos WHERE completed = 1")
    fun getCompletedCount(): Flow<Int>

    /**
     * Insert a new todo
     *
     * If a todo with the same ID already exists, it will be replaced.
     *
     * @param todo The todo to insert
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(todo: Todo)

    /**
     * Insert multiple todos
     *
     * @param todos The todos to insert
     */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(todos: List<Todo>)

    /**
     * Update an existing todo
     *
     * The todo must have the same ID as an existing todo in the database.
     *
     * @param todo The todo to update
     */
    @Update
    suspend fun update(todo: Todo)

    /**
     * Delete a specific todo
     *
     * @param todo The todo to delete
     */
    @Delete
    suspend fun delete(todo: Todo)

    /**
     * Delete a todo by ID
     *
     * @param todoId The ID of the todo to delete
     */
    @Query("DELETE FROM todos WHERE id = :todoId")
    suspend fun deleteById(todoId: String)

    /**
     * Delete all completed todos
     *
     * @return The number of todos deleted
     */
    @Query("DELETE FROM todos WHERE completed = 1")
    suspend fun deleteCompletedTodos(): Int

    /**
     * Delete all todos (clear database)
     *
     * @return The number of todos deleted
     */
    @Query("DELETE FROM todos")
    suspend fun deleteAllTodos(): Int

    /**
     * Toggle the completion status of a todo
     *
     * This is more efficient than reading, modifying, and updating.
     *
     * @param todoId The ID of the todo to toggle
     */
    @Query("UPDATE todos SET completed = NOT completed WHERE id = :todoId")
    suspend fun toggleCompleted(todoId: String)

    /**
     * Mark all todos as completed
     */
    @Query("UPDATE todos SET completed = 1")
    suspend fun markAllCompleted()

    /**
     * Mark all todos as active (not completed)
     */
    @Query("UPDATE todos SET completed = 0")
    suspend fun markAllActive()

    /**
     * Update todo text
     *
     * @param todoId The ID of the todo to update
     * @param newText The new text
     */
    @Query("UPDATE todos SET text = :newText WHERE id = :todoId")
    suspend fun updateText(todoId: String, newText: String)

    /**
     * Search todos by text (case-insensitive)
     *
     * @param query The search query
     * @return Flow emitting matching todos
     */
    @Query("SELECT * FROM todos WHERE text LIKE '%' || :query || '%' ORDER BY timestamp DESC")
    fun searchTodos(query: String): Flow<List<Todo>>
}
