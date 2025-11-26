package com.example.todocompose.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.todocompose.data.TodoFilter
import com.example.todocompose.ui.components.TodoInput
import com.example.todocompose.ui.components.TodoList
import com.example.todocompose.ui.theme.*
import com.example.todocompose.viewmodel.TodoViewModel

/**
 * TodoListScreen - Main screen composable for the Todo application
 *
 * This is the primary screen that users interact with. It demonstrates
 * several Jetpack Compose best practices:
 *
 * 1. **State Hoisting**: State is owned by ViewModel, not the UI
 * 2. **Unidirectional Data Flow**: Data flows down, events flow up
 * 3. **Composition**: Built from smaller, reusable components
 * 4. **Lifecycle-aware State**: Uses collectAsStateWithLifecycle()
 * 5. **Material Design 3**: Follows latest design guidelines
 *
 * Screen Structure:
 * ┌─────────────────────────────────┐
 * │ Gradient Header                  │
 * │ - Title                          │
 * │ - Tech badge                     │
 * │ - TodoInput                      │
 * ├─────────────────────────────────┤
 * │ Filter Chips (All/Active/Done)  │
 * ├─────────────────────────────────┤
 * │ TodoList                         │
 * │ - Scrollable LazyColumn          │
 * │ - Individual TodoItems           │
 * ├─────────────────────────────────┤
 * │ Footer                           │
 * │ - Item count                     │
 * │ - Clear completed button         │
 * └─────────────────────────────────┘
 *
 * State Management:
 * - filteredTodos: Reactive list that auto-updates
 * - currentFilter: Current filter selection
 * - activeCount: Number of incomplete todos
 *
 * @param viewModel The TodoViewModel that manages state and business logic
 * @param modifier Optional modifier for customization
 *
 * Example usage:
 * ```kotlin
 * val viewModel: TodoViewModel = viewModel()
 * TodoListScreen(viewModel = viewModel)
 * ```
 */
@Composable
fun TodoListScreen(
    viewModel: TodoViewModel,
    modifier: Modifier = Modifier
) {
    // Collect state as lifecycle-aware State
    // This automatically:
    // - Starts collecting when the composable enters composition
    // - Stops collecting when it leaves composition
    // - Survives configuration changes
    val filteredTodos by viewModel.filteredTodos.collectAsStateWithLifecycle()
    val currentFilter by viewModel.currentFilter.collectAsStateWithLifecycle()
    val activeCount by viewModel.activeCount.collectAsStateWithLifecycle()

    // Main layout: Column with gradient background
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Header section with gradient background
        HeaderSection(
            onAddTodo = { text -> viewModel.addTodo(text) }
        )

        // Filter chips section
        FilterSection(
            currentFilter = currentFilter,
            onFilterSelected = { filter -> viewModel.setFilter(filter) }
        )

        // Todo list (takes up remaining space)
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            TodoList(
                todos = filteredTodos,
                onToggleTodo = { todoId -> viewModel.toggleTodo(todoId) },
                onDeleteTodo = { todoId -> viewModel.deleteTodo(todoId) },
                onUpdateTodo = { todoId, text -> viewModel.updateTodo(todoId, text) }
            )
        }

        // Footer section with stats and actions
        FooterSection(
            activeCount = activeCount,
            hasCompletedTodos = filteredTodos.any { it.completed },
            onClearCompleted = { viewModel.clearCompleted() }
        )
    }
}

/**
 * HeaderSection - Top section with gradient background, title, and input
 *
 * This section creates a visually striking header with:
 * - Linear gradient background (purple to blue)
 * - App title "Todo List"
 * - Technology badge "Jetpack Compose"
 * - Input field for adding new todos
 *
 * Design Notes:
 * - Uses Material 3 color scheme
 * - Gradient provides visual hierarchy
 * - Badge identifies the technology used
 * - Padding ensures proper spacing on all devices
 *
 * @param onAddTodo Callback when user submits a new todo
 */
@Composable
private fun HeaderSection(
    onAddTodo: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(
                        GradientIndigo,
                        GradientPurpleEnd
                    )
                )
            )
            .padding(24.dp)
    ) {
        // Add spacing for status bar
        Spacer(modifier = Modifier.height(16.dp))

        // Title
        Text(
            text = "Todo List",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Technology badge
        Surface(
            color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f),
            shape = RoundedCornerShape(16.dp)
        ) {
            Text(
                text = "Jetpack Compose",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onPrimary,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Todo input field
        TodoInput(onAddTodo = onAddTodo)
    }
}

/**
 * FilterSection - Horizontal row of filter chips
 *
 * Allows users to filter todos by:
 * - ALL: Show all todos
 * - ACTIVE: Show only incomplete todos
 * - COMPLETED: Show only completed todos
 *
 * Design:
 * - Material 3 FilterChip components
 * - Selected state with different colors
 * - Horizontal scrollable on narrow screens
 * - Proper spacing between chips
 *
 * @param currentFilter The currently active filter
 * @param onFilterSelected Callback when user selects a filter
 */
@Composable
private fun FilterSection(
    currentFilter: TodoFilter,
    onFilterSelected: (TodoFilter) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        TodoFilter.values().forEach { filter ->
            FilterChip(
                selected = currentFilter == filter,
                onClick = { onFilterSelected(filter) },
                label = {
                    Text(
                        text = filter.getLabel(),
                        style = MaterialTheme.typography.labelLarge
                    )
                },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                    selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
    }
}

/**
 * FooterSection - Bottom section with statistics and actions
 *
 * Displays:
 * - Number of active (incomplete) todos
 * - "Clear Completed" button (only shown if completed todos exist)
 *
 * Design:
 * - Subtle background to separate from list
 * - Left-aligned count text
 * - Right-aligned clear button
 * - Material 3 TextButton for actions
 *
 * @param activeCount Number of incomplete todos
 * @param hasCompletedTodos Whether any completed todos exist
 * @param onClearCompleted Callback when user taps "Clear Completed"
 */
@Composable
private fun FooterSection(
    activeCount: Int,
    hasCompletedTodos: Boolean,
    onClearCompleted: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Active count text
            Text(
                text = "$activeCount ${if (activeCount == 1) "item" else "items"} left",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // Clear completed button (only show if completed todos exist)
            if (hasCompletedTodos) {
                TextButton(
                    onClick = onClearCompleted,
                    colors = ButtonDefaults.textButtonColors(
                        contentColor = MaterialTheme.colorScheme.error
                    )
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Clear completed",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Clear Completed",
                        style = MaterialTheme.typography.labelLarge
                    )
                }
            }
        }
    }
}
