package com.example.todocompose.viewmodel

import androidx.compose.runtime.Immutable

/**
 * UiState - Sealed interface representing different UI states
 *
 * This pattern is crucial for proper error handling and loading states.
 * Instead of having separate nullable error and loading fields, we use
 * a sealed interface to represent mutually exclusive states.
 *
 * Benefits:
 * 1. **Type Safety**: Compiler ensures all states are handled
 * 2. **Clarity**: Impossible states are impossible to represent
 * 3. **Immutability**: Each state is immutable and predictable
 * 4. **Compose Optimization**: @Immutable prevents unnecessary recompositions
 *
 * States:
 * - Loading: Initial loading or refresh
 * - Success: Data loaded successfully
 * - Error: Something went wrong
 *
 * @param T The type of data in the success state
 *
 * Example usage in ViewModel:
 * ```kotlin
 * private val _todos = MutableStateFlow<UiState<List<Todo>>>(UiState.Loading)
 * val todos: StateFlow<UiState<List<Todo>>> = _todos.asStateFlow()
 *
 * fun loadTodos() {
 *     viewModelScope.launch {
 *         try {
 *             _todos.value = UiState.Loading
 *             val data = repository.getTodos()
 *             _todos.value = UiState.Success(data)
 *         } catch (e: Exception) {
 *             _todos.value = UiState.Error(e.message ?: "Unknown error")
 *         }
 *     }
 * }
 * ```
 *
 * Example usage in Composable:
 * ```kotlin
 * when (val state = uiState) {
 *     is UiState.Loading -> LoadingIndicator()
 *     is UiState.Success -> TodoList(todos = state.data)
 *     is UiState.Error -> ErrorMessage(message = state.message)
 * }
 * ```
 */
sealed interface UiState<out T> {

    /**
     * Loading state - Data is being fetched
     *
     * Show a loading indicator when in this state.
     */
    @Immutable
    data object Loading : UiState<Nothing>

    /**
     * Success state - Data loaded successfully
     *
     * @param data The loaded data
     */
    @Immutable
    data class Success<T>(val data: T) : UiState<T>

    /**
     * Error state - Something went wrong
     *
     * @param message Human-readable error message
     * @param exception Optional exception for logging/debugging
     */
    @Immutable
    data class Error(
        val message: String,
        val exception: Throwable? = null
    ) : UiState<Nothing>
}

/**
 * Extension function to get data from UiState
 *
 * Returns the data if state is Success, null otherwise.
 */
fun <T> UiState<T>.dataOrNull(): T? {
    return when (this) {
        is UiState.Success -> data
        else -> null
    }
}

/**
 * Extension function to check if state is loading
 */
fun <T> UiState<T>.isLoading(): Boolean {
    return this is UiState.Loading
}

/**
 * Extension function to check if state is error
 */
fun <T> UiState<T>.isError(): Boolean {
    return this is UiState.Error
}

/**
 * Extension function to get error message
 */
fun <T> UiState<T>.errorMessage(): String? {
    return when (this) {
        is UiState.Error -> message
        else -> null
    }
}
