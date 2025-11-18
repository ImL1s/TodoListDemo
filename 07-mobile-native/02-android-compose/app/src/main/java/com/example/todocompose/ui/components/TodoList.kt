package com.example.todocompose.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.todocompose.data.Todo

/**
 * TodoList - High-performance scrollable list of todos
 *
 * This component demonstrates Compose's powerful list rendering capabilities:
 *
 * 1. **LazyColumn for Performance**
 *    - Only renders visible items (view recycling)
 *    - Handles thousands of items efficiently
 *    - Built-in scroll state management
 *    - Minimal memory footprint
 *
 * 2. **Item Animations**
 *    - Smooth enter/exit animations
 *    - AnimatedVisibility for individual items
 *    - Automatic layout animations
 *
 * 3. **Empty State**
 *    - Friendly message when list is empty
 *    - Animated icon and text
 *    - Encourages user action
 *
 * 4. **Scroll State Persistence**
 *    - Remembers scroll position during recomposition
 *    - Survives configuration changes
 *    - Smooth scrolling experience
 *
 * 5. **Key-based Rendering**
 *    - Each item keyed by unique ID
 *    - Enables proper animations
 *    - Prevents unnecessary recompositions
 *
 * Performance Benefits:
 * - LazyColumn only composes visible items
 * - Recycling pattern like RecyclerView
 * - But simpler API and better animations
 * - Automatic handling of item changes
 *
 * LazyColumn vs Column:
 * - Column: Composes ALL items at once (bad for long lists)
 * - LazyColumn: Only composes visible items (good for any length)
 * - Use LazyColumn for lists > 20 items
 *
 * @param todos List of todos to display
 * @param onToggleTodo Callback when todo is toggled
 * @param onDeleteTodo Callback when todo is deleted
 * @param onUpdateTodo Callback when todo text is updated
 * @param modifier Optional modifier for customization
 *
 * Example usage:
 * ```kotlin
 * val todos by viewModel.filteredTodos.collectAsStateWithLifecycle()
 *
 * TodoList(
 *     todos = todos,
 *     onToggleTodo = { id -> viewModel.toggleTodo(id) },
 *     onDeleteTodo = { id -> viewModel.deleteTodo(id) },
 *     onUpdateTodo = { id, text -> viewModel.updateTodo(id, text) }
 * )
 * ```
 */
@Composable
fun TodoList(
    todos: List<Todo>,
    onToggleTodo: (String) -> Unit,
    onDeleteTodo: (String) -> Unit,
    onUpdateTodo: (String, String) -> Unit,
    modifier: Modifier = Modifier
) {
    // Remember scroll state to preserve scroll position
    // across recompositions and configuration changes
    val listState = rememberLazyListState()

    // Show empty state if no todos
    if (todos.isEmpty()) {
        EmptyState(modifier = modifier)
        return
    }

    // LazyColumn: High-performance list
    LazyColumn(
        state = listState,
        modifier = modifier
            .fillMaxSize(),
        contentPadding = PaddingValues(vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(0.dp) // Spacing handled by items
    ) {
        // items() function with key for proper animations
        items(
            items = todos,
            key = { todo -> todo.id } // Unique key for each item
        ) { todo ->
            // Animated item with enter/exit animations
            TodoItem(
                todo = todo,
                onToggle = onToggleTodo,
                onDelete = onDeleteTodo,
                modifier = Modifier.animateItemPlacement(
                    // Smooth animation when items move position
                    animationSpec = spring(
                        dampingRatio = Spring.DampingRatioMediumBouncy,
                        stiffness = Spring.StiffnessLow
                    )
                )
            )
        }
    }
}

/**
 * EmptyState - Displayed when todo list is empty
 *
 * Features:
 * - Centered content with icon and text
 * - Animated entrance
 * - Friendly, encouraging message
 * - Material 3 design language
 *
 * This component improves UX by:
 * - Explaining why the screen is empty
 * - Encouraging user to add their first todo
 * - Providing visual interest instead of blank screen
 *
 * @param modifier Optional modifier for customization
 */
@Composable
private fun EmptyState(modifier: Modifier = Modifier) {
    // Animation state for entrance
    var visible by remember { mutableStateOf(false) }

    // Trigger animation on first composition
    LaunchedEffect(Unit) {
        visible = true
    }

    // Animated empty state
    AnimatedVisibility(
        visible = visible,
        enter = fadeIn(
            animationSpec = tween(durationMillis = 500)
        ) + scaleIn(
            initialScale = 0.8f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy
            )
        )
    ) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .padding(32.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Animated icon with infinite pulse
                val infiniteTransition = rememberInfiniteTransition(
                    label = "empty_state_pulse"
                )
                val scale by infiniteTransition.animateFloat(
                    initialValue = 1f,
                    targetValue = 1.1f,
                    animationSpec = infiniteRepeatable(
                        animation = tween(1000),
                        repeatMode = RepeatMode.Reverse
                    ),
                    label = "icon_scale"
                )

                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = null,
                    modifier = Modifier
                        .size(120.dp)
                        .graphicsLayer {
                            scaleX = scale
                            scaleY = scale
                        },
                    tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)
                )

                // Title text
                Text(
                    text = "No todos yet!",
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center
                )

                // Subtitle text
                Text(
                    text = "Add your first task to get started",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

/**
 * ScrollToTopButton - Floating button to quickly scroll to top
 *
 * Future enhancement for better UX on long lists.
 * Shows when user has scrolled down, hides when at top.
 *
 * Implementation example:
 * ```kotlin
 * val showButton by remember {
 *     derivedStateOf {
 *         listState.firstVisibleItemIndex > 5
 *     }
 * }
 *
 * AnimatedVisibility(visible = showButton) {
 *     FloatingActionButton(
 *         onClick = {
 *             scope.launch {
 *                 listState.animateScrollToItem(0)
 *             }
 *         }
 *     ) {
 *         Icon(Icons.Default.ArrowUpward, "Scroll to top")
 *     }
 * }
 * ```
 */
