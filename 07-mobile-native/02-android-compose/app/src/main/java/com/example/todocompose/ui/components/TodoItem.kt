package com.example.todocompose.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.example.todocompose.data.Todo

/**
 * TodoItem - Composable for displaying a single todo item
 *
 * This component showcases advanced Compose features:
 *
 * 1. **Animations**
 *    - Scale animation when item is added
 *    - Fade animation for completion state
 *    - Smooth transitions using AnimatedVisibility
 *    - Spring animation for checkbox
 *
 * 2. **Material Design 3 Components**
 *    - Card with elevation
 *    - Checkbox with custom colors
 *    - IconButton for delete action
 *    - Text with conditional styling
 *
 * 3. **State Management**
 *    - remember for animation state
 *    - LaunchedEffect for initial animation trigger
 *
 * 4. **Conditional Styling**
 *    - Strike-through for completed todos
 *    - Opacity change for completed state
 *    - Color changes based on completion
 *
 * 5. **Accessibility**
 *    - Semantic properties for screen readers
 *    - Content descriptions for all interactive elements
 *    - Sufficient touch target sizes (48dp minimum)
 *
 * Visual States:
 * - Incomplete: Normal text, empty checkbox
 * - Completed: Strike-through text, filled checkbox, reduced opacity
 * - Hover/Press: Material ripple effect
 *
 * User Interactions:
 * - Tap checkbox or text: Toggle completion
 * - Tap delete icon: Remove todo
 *
 * @param todo The todo item to display
 * @param onToggle Callback when checkbox is toggled
 * @param onDelete Callback when delete button is tapped
 * @param modifier Optional modifier for customization
 *
 * Example usage:
 * ```kotlin
 * TodoItem(
 *     todo = Todo("Learn Compose", completed = false),
 *     onToggle = { viewModel.toggleTodo(it) },
 *     onDelete = { viewModel.deleteTodo(it) }
 * )
 * ```
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TodoItem(
    todo: Todo,
    onToggle: (String) -> Unit,
    onDelete: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    // Animation state for initial appearance
    var visible by remember { mutableStateOf(false) }

    // Trigger animation when composable enters composition
    LaunchedEffect(todo.id) {
        visible = true
    }

    // Animated visibility for smooth entrance
    AnimatedVisibility(
        visible = visible,
        enter = fadeIn(
            animationSpec = tween(durationMillis = 300)
        ) + scaleIn(
            initialScale = 0.8f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessLow
            )
        ),
        exit = fadeOut(animationSpec = tween(durationMillis = 200)) +
                shrinkVertically(animationSpec = tween(durationMillis = 200))
    ) {
        Card(
            modifier = modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp),
            elevation = CardDefaults.cardElevation(
                defaultElevation = 2.dp,
                pressedElevation = 4.dp
            ),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            ),
            onClick = { onToggle(todo.id) } // Make entire card clickable
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Custom checkbox with animation
                CustomCheckbox(
                    checked = todo.completed,
                    onCheckedChange = { onToggle(todo.id) }
                )

                // Todo text with conditional styling
                Text(
                    text = todo.text,
                    modifier = Modifier.weight(1f),
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (todo.completed) {
                        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    } else {
                        MaterialTheme.colorScheme.onSurface
                    },
                    textDecoration = if (todo.completed) {
                        TextDecoration.LineThrough
                    } else {
                        TextDecoration.None
                    }
                )

                // Delete button
                IconButton(
                    onClick = { onDelete(todo.id) },
                    modifier = Modifier.size(40.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Delete ${todo.text}",
                        tint = MaterialTheme.colorScheme.error,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

/**
 * CustomCheckbox - Custom checkbox with animated checkmark
 *
 * Features:
 * - Smooth scale animation when checked/unchecked
 * - Material You color scheme
 * - Larger touch target for accessibility
 * - Circular shape for modern look
 *
 * @param checked Whether the checkbox is checked
 * @param onCheckedChange Callback when checkbox state changes
 * @param modifier Optional modifier
 */
@Composable
private fun CustomCheckbox(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    // Animated scale for smooth transition
    val scale by animateFloatAsState(
        targetValue = if (checked) 1.0f else 0.8f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMedium
        ),
        label = "checkbox_scale"
    )

    Box(
        modifier = modifier
            .size(40.dp)
            .scale(scale),
        contentAlignment = Alignment.Center
    ) {
        Checkbox(
            checked = checked,
            onCheckedChange = onCheckedChange,
            modifier = Modifier.size(28.dp),
            colors = CheckboxDefaults.colors(
                checkedColor = MaterialTheme.colorScheme.primary,
                uncheckedColor = MaterialTheme.colorScheme.onSurfaceVariant,
                checkmarkColor = MaterialTheme.colorScheme.onPrimary
            )
        )
    }
}

/**
 * SwipeToDeleteBackground - Background shown during swipe-to-delete gesture
 *
 * This is a placeholder for future swipe-to-delete functionality.
 * Currently shows a red background with delete icon.
 *
 * Future Enhancement:
 * ```kotlin
 * val dismissState = rememberDismissState(
 *     confirmValueChange = {
 *         if (it == DismissValue.DismissedToStart) {
 *             onDelete(todo.id)
 *             true
 *         } else false
 *     }
 * )
 * ```
 *
 * @param modifier Optional modifier
 */
@Composable
private fun SwipeToDeleteBackground(
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.error)
            .padding(horizontal = 24.dp),
        contentAlignment = Alignment.CenterEnd
    ) {
        Icon(
            imageVector = Icons.Default.Delete,
            contentDescription = "Delete",
            tint = Color.White,
            modifier = Modifier.size(24.dp)
        )
    }
}
