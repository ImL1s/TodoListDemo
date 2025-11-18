package com.example.todocompose.viewmodel

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.todocompose.data.Todo
import com.example.todocompose.data.TodoFilter
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * DataStore extension for accessing todo preferences
 * This creates a singleton DataStore instance at the top level
 */
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "todos")

/**
 * TodoViewModel - Manages the state and business logic for the todo list
 *
 * This ViewModel follows the MVVM (Model-View-ViewModel) architecture pattern
 * and implements the following key concepts:
 *
 * 1. **Unidirectional Data Flow (UDF)**
 *    - State flows down from ViewModel to UI
 *    - Events flow up from UI to ViewModel
 *    - Single source of truth for app state
 *
 * 2. **State Management with StateFlow**
 *    - StateFlow provides reactive state updates
 *    - Survives configuration changes (rotation, etc.)
 *    - Lifecycle-aware (no memory leaks)
 *
 * 3. **Persistent Storage with DataStore**
 *    - Replaces SharedPreferences with modern, safe alternative
 *    - Uses Kotlin Coroutines for async operations
 *    - Type-safe with Preferences API
 *
 * 4. **Coroutines for Async Operations**
 *    - viewModelScope ensures proper cleanup
 *    - Non-blocking I/O operations
 *    - Structured concurrency
 *
 * State Properties:
 * @property todos All todos from DataStore (StateFlow)
 * @property currentFilter Active filter (ALL, ACTIVE, COMPLETED)
 * @property filteredTodos Todos filtered by current filter
 * @property activeCount Number of incomplete todos
 *
 * Example usage in Composable:
 * ```kotlin
 * val viewModel: TodoViewModel = viewModel()
 * val todos by viewModel.filteredTodos.collectAsStateWithLifecycle()
 * val activeCount by viewModel.activeCount.collectAsStateWithLifecycle()
 *
 * Button(onClick = { viewModel.addTodo("New task") }) {
 *     Text("Add")
 * }
 * ```
 */
class TodoViewModel(private val context: Context) : ViewModel() {

    // JSON serializer for converting todos to/from JSON strings
    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = true
    }

    // DataStore key for storing todos as JSON
    private val TODOS_KEY = stringPreferencesKey("todos_list")

    // Private mutable state for current filter
    private val _currentFilter = MutableStateFlow(TodoFilter.ALL)

    /**
     * Public read-only state for current filter
     * UI observes this to highlight the active filter button
     */
    val currentFilter: StateFlow<TodoFilter> = _currentFilter.asStateFlow()

    /**
     * All todos loaded from DataStore
     *
     * This StateFlow automatically loads todos from persistent storage
     * and updates whenever the DataStore changes. The stateIn operator
     * converts the Flow to StateFlow with:
     * - WhileSubscribed(5000): Keeps the flow active for 5 seconds after last subscriber
     * - initialValue: Empty list while loading
     */
    val todos: StateFlow<List<Todo>> = context.dataStore.data
        .map { preferences ->
            val todosJson = preferences[TODOS_KEY] ?: "[]"
            try {
                json.decodeFromString<List<Todo>>(todosJson)
            } catch (e: Exception) {
                emptyList()
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    /**
     * Filtered todos based on current filter
     *
     * This derived state combines todos and currentFilter, automatically
     * recomputing when either changes. This is more efficient than filtering
     * in the Composable.
     */
    val filteredTodos: StateFlow<List<Todo>> = combine(
        todos,
        currentFilter
    ) { todosList, filter ->
        filter.filter(todosList)
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    /**
     * Count of active (incomplete) todos
     *
     * This derived state is used for the "X items left" footer display
     */
    val activeCount: StateFlow<Int> = todos
        .map { todosList -> todosList.count { !it.completed } }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = 0
        )

    /**
     * Adds a new todo to the list
     *
     * This function:
     * 1. Creates a new Todo with generated ID
     * 2. Adds it to the current list
     * 3. Persists to DataStore
     *
     * @param text The todo description (must not be blank)
     */
    fun addTodo(text: String) {
        if (text.isBlank()) return

        viewModelScope.launch {
            val currentTodos = todos.value.toMutableList()
            currentTodos.add(0, Todo.create(text)) // Add to top
            saveTodos(currentTodos)
        }
    }

    /**
     * Toggles the completion state of a todo
     *
     * Uses the copy() function to create an immutable update
     *
     * @param todoId The ID of the todo to toggle
     */
    fun toggleTodo(todoId: String) {
        viewModelScope.launch {
            val currentTodos = todos.value.map { todo ->
                if (todo.id == todoId) {
                    todo.copy(completed = !todo.completed)
                } else {
                    todo
                }
            }
            saveTodos(currentTodos)
        }
    }

    /**
     * Deletes a todo from the list
     *
     * @param todoId The ID of the todo to delete
     */
    fun deleteTodo(todoId: String) {
        viewModelScope.launch {
            val currentTodos = todos.value.filter { it.id != todoId }
            saveTodos(currentTodos)
        }
    }

    /**
     * Updates the text of an existing todo
     *
     * @param todoId The ID of the todo to update
     * @param newText The new text content
     */
    fun updateTodo(todoId: String, newText: String) {
        if (newText.isBlank()) {
            deleteTodo(todoId)
            return
        }

        viewModelScope.launch {
            val currentTodos = todos.value.map { todo ->
                if (todo.id == todoId) {
                    todo.copy(text = newText)
                } else {
                    todo
                }
            }
            saveTodos(currentTodos)
        }
    }

    /**
     * Removes all completed todos from the list
     *
     * This is triggered by the "Clear Completed" button
     */
    fun clearCompleted() {
        viewModelScope.launch {
            val currentTodos = todos.value.filter { !it.completed }
            saveTodos(currentTodos)
        }
    }

    /**
     * Changes the current filter
     *
     * @param filter The new filter to apply (ALL, ACTIVE, or COMPLETED)
     */
    fun setFilter(filter: TodoFilter) {
        _currentFilter.value = filter
    }

    /**
     * Toggles all todos to completed or active
     *
     * If any todos are incomplete, mark all as complete.
     * If all are complete, mark all as incomplete.
     */
    fun toggleAll() {
        viewModelScope.launch {
            val hasIncomplete = todos.value.any { !it.completed }
            val currentTodos = todos.value.map { todo ->
                todo.copy(completed = hasIncomplete)
            }
            saveTodos(currentTodos)
        }
    }

    /**
     * Persists the todo list to DataStore
     *
     * This private helper function handles the actual storage operation
     * using DataStore's edit function for transactional updates.
     *
     * @param todosList The list of todos to save
     */
    private suspend fun saveTodos(todosList: List<Todo>) {
        context.dataStore.edit { preferences ->
            val todosJson = json.encodeToString(todosList)
            preferences[TODOS_KEY] = todosJson
        }
    }

    /**
     * Factory for creating TodoViewModel instances with Context dependency
     *
     * ViewModels cannot take constructor parameters directly when using
     * viewModel() composable function. This factory provides the necessary
     * Context parameter.
     *
     * Usage in Composable:
     * ```kotlin
     * val viewModel: TodoViewModel = viewModel(
     *     factory = TodoViewModel.Factory(LocalContext.current)
     * )
     * ```
     */
    class Factory(private val context: Context) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            if (modelClass.isAssignableFrom(TodoViewModel::class.java)) {
                return TodoViewModel(context) as T
            }
            throw IllegalArgumentException("Unknown ViewModel class")
        }
    }
}
