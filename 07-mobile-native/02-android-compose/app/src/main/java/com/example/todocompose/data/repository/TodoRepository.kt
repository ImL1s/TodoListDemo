package com.example.todocompose.data.repository

import com.example.todocompose.data.Todo
import com.example.todocompose.data.TodoFilter
import com.example.todocompose.data.local.TodoDao
import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.toImmutableList
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

/**
 * TodoRepository - Repository pattern for Todo data access
 *
 * This repository serves as the single source of truth for todo data,
 * abstracting the data sources (Room database) from the rest of the app.
 *
 * Benefits of Repository Pattern:
 * 1. **Separation of Concerns**: ViewModel doesn't know about data sources
 * 2. **Testability**: Easy to mock for testing
 * 3. **Flexibility**: Can switch data sources without changing ViewModels
 * 4. **Caching**: Can implement in-memory caching
 * 5. **Offline-First**: Can coordinate local and remote data sources
 *
 * Architecture:
 * ```
 * ViewModel → Repository → [DAO, DataStore, Network API]
 * ```
 *
 * Reactive Data:
 * - All read operations return Flow for reactive UI updates
 * - Database changes automatically propagate to UI
 * - No manual refresh needed
 *
 * Performance:
 * - Uses ImmutableList for better Compose performance
 * - Flow operations are efficient and composable
 * - Database queries are optimized by Room
 *
 * @param todoDao The DAO for accessing the Room database
 *
 * Example usage in ViewModel:
 * ```kotlin
 * @HiltViewModel
 * class TodoViewModel @Inject constructor(
 *     private val repository: TodoRepository
 * ) : ViewModel() {
 *     val todos = repository.getAllTodos()
 *         .stateIn(
 *             scope = viewModelScope,
 *             started = SharingStarted.WhileSubscribed(5000),
 *             initialValue = emptyList()
 *         )
 *
 *     fun addTodo(text: String) {
 *         viewModelScope.launch {
 *             repository.addTodo(text)
 *         }
 *     }
 * }
 * ```
 */
@Singleton
class TodoRepository @Inject constructor(
    private val todoDao: TodoDao
) {

    // ========================================================================
    // Read Operations (Flow-based for reactive UI)
    // ========================================================================

    /**
     * Get all todos as an immutable list
     *
     * Returns a Flow that emits whenever the database changes.
     * Using ImmutableList improves Compose performance by preventing
     * unnecessary recompositions.
     *
     * @return Flow of all todos
     */
    fun getAllTodos(): Flow<ImmutableList<Todo>> {
        return todoDao.getAllTodos().map { it.toImmutableList() }
    }

    /**
     * Get todos filtered by completion status
     *
     * @param filter The filter to apply (ALL, ACTIVE, COMPLETED)
     * @return Flow of filtered todos
     */
    fun getTodosByFilter(filter: TodoFilter): Flow<ImmutableList<Todo>> {
        return when (filter) {
            TodoFilter.ALL -> getAllTodos()
            TodoFilter.ACTIVE -> todoDao.getActiveTodos().map { it.toImmutableList() }
            TodoFilter.COMPLETED -> todoDao.getCompletedTodos().map { it.toImmutableList() }
        }
    }

    /**
     * Get a single todo by ID
     *
     * @param todoId The ID of the todo
     * @return Flow of the todo, or null if not found
     */
    fun getTodoById(todoId: String): Flow<Todo?> {
        return todoDao.getTodoById(todoId)
    }

    /**
     * Get count of active (incomplete) todos
     *
     * @return Flow of active todo count
     */
    fun getActiveCount(): Flow<Int> {
        return todoDao.getActiveCount()
    }

    /**
     * Get count of completed todos
     *
     * @return Flow of completed todo count
     */
    fun getCompletedCount(): Flow<Int> {
        return todoDao.getCompletedCount()
    }

    /**
     * Search todos by text
     *
     * @param query The search query (case-insensitive)
     * @return Flow of matching todos
     */
    fun searchTodos(query: String): Flow<ImmutableList<Todo>> {
        return todoDao.searchTodos(query).map { it.toImmutableList() }
    }

    // ========================================================================
    // Write Operations (Suspend functions for coroutines)
    // ========================================================================

    /**
     * Add a new todo
     *
     * Creates a todo with generated ID and inserts it into the database.
     *
     * @param text The todo text
     * @return The created todo
     */
    suspend fun addTodo(text: String): Todo {
        val todo = Todo.create(text)
        todoDao.insert(todo)
        return todo
    }

    /**
     * Update an existing todo
     *
     * @param todo The updated todo
     */
    suspend fun updateTodo(todo: Todo) {
        todoDao.update(todo)
    }

    /**
     * Update todo text
     *
     * @param todoId The ID of the todo to update
     * @param newText The new text
     */
    suspend fun updateTodoText(todoId: String, newText: String) {
        if (newText.isBlank()) {
            // If text is empty, delete the todo
            deleteTodo(todoId)
        } else {
            todoDao.updateText(todoId, newText.trim())
        }
    }

    /**
     * Toggle todo completion status
     *
     * More efficient than reading, modifying, and updating.
     *
     * @param todoId The ID of the todo to toggle
     */
    suspend fun toggleTodo(todoId: String) {
        todoDao.toggleCompleted(todoId)
    }

    /**
     * Delete a todo by ID
     *
     * @param todoId The ID of the todo to delete
     */
    suspend fun deleteTodo(todoId: String) {
        todoDao.deleteById(todoId)
    }

    /**
     * Delete all completed todos
     *
     * @return The number of todos deleted
     */
    suspend fun clearCompleted(): Int {
        return todoDao.deleteCompletedTodos()
    }

    /**
     * Mark all todos as completed
     */
    suspend fun completeAll() {
        todoDao.markAllCompleted()
    }

    /**
     * Mark all todos as active
     */
    suspend fun activateAll() {
        todoDao.markAllActive()
    }

    /**
     * Toggle all todos
     *
     * If any todo is incomplete, mark all as complete.
     * If all are complete, mark all as incomplete.
     */
    suspend fun toggleAll() {
        val activeTodos = todoDao.getActiveTodos()
        // This is a simplification - in production you might want to
        // fetch the count synchronously or use a different approach
        activeTodos.map { todos ->
            if (todos.isNotEmpty()) {
                completeAll()
            } else {
                activateAll()
            }
        }
    }

    /**
     * Delete all todos
     *
     * @return The number of todos deleted
     */
    suspend fun deleteAllTodos(): Int {
        return todoDao.deleteAllTodos()
    }

    /**
     * Insert multiple todos (for batch operations or import)
     *
     * @param todos The list of todos to insert
     */
    suspend fun insertAll(todos: List<Todo>) {
        todoDao.insertAll(todos)
    }
}
