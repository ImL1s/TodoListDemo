package com.example.todocompose.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp

/**
 * TodoInput - Composable for adding new todos
 *
 * This component demonstrates several Compose concepts:
 *
 * 1. **State Management with remember**
 *    - Local state for input text
 *    - State is reset after submission
 *
 * 2. **Side Effects**
 *    - LaunchedEffect for focus management
 *    - Runs when composable enters composition
 *
 * 3. **Keyboard Handling**
 *    - ImeAction.Done for "Done" button on keyboard
 *    - KeyboardActions for handling keyboard submit
 *
 * 4. **Material Design 3**
 *    - OutlinedTextField with custom colors
 *    - IconButton with Material icons
 *    - Proper spacing and sizing
 *
 * 5. **Validation**
 *    - Disables submission for blank text
 *    - Trims whitespace automatically
 *
 * User Flow:
 * 1. User types in the text field
 * 2. User presses "Done" on keyboard OR taps the "+" button
 * 3. Todo is added if text is not blank
 * 4. Input field is cleared
 * 5. Focus remains on input for quick entry of multiple todos
 *
 * Accessibility:
 * - Proper content descriptions for screen readers
 * - Keyboard navigation support
 * - Clear visual feedback for enabled/disabled states
 *
 * @param onAddTodo Callback invoked when user submits a new todo
 * @param modifier Optional modifier for customization
 *
 * Example usage:
 * ```kotlin
 * TodoInput(
 *     onAddTodo = { text -> viewModel.addTodo(text) }
 * )
 * ```
 */
@Composable
fun TodoInput(
    onAddTodo: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    // Local state for the input text
    // remember ensures the state survives recomposition
    var text by remember { mutableStateOf("") }

    // Focus requester for managing input focus
    val focusRequester = remember { FocusRequester() }

    // Request focus when the composable first appears
    // This provides a better UX by automatically focusing the input
    LaunchedEffect(Unit) {
        try {
            focusRequester.requestFocus()
        } catch (e: Exception) {
            // Focus request might fail in some scenarios, safely ignore
        }
    }

    /**
     * Helper function to handle todo submission
     * Validates input and triggers callback
     */
    fun submitTodo() {
        val trimmedText = text.trim()
        if (trimmedText.isNotEmpty()) {
            onAddTodo(trimmedText)
            text = "" // Clear input after submission
        }
    }

    // Input field row
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Text input field
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            modifier = Modifier
                .weight(1f)
                .focusRequester(focusRequester),
            placeholder = {
                Text(
                    text = "What needs to be done?",
                    style = MaterialTheme.typography.bodyLarge
                )
            },
            // Keyboard configuration
            keyboardOptions = KeyboardOptions(
                imeAction = ImeAction.Done // Show "Done" button on keyboard
            ),
            keyboardActions = KeyboardActions(
                onDone = {
                    submitTodo()
                }
            ),
            // Styling
            singleLine = true,
            shape = MaterialTheme.shapes.medium,
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Color.White.copy(alpha = 0.9f),
                unfocusedContainerColor = Color.White.copy(alpha = 0.7f),
                focusedBorderColor = Color.White,
                unfocusedBorderColor = Color.White.copy(alpha = 0.5f),
                focusedTextColor = Color.Black,
                unfocusedTextColor = Color.Black,
                cursorColor = MaterialTheme.colorScheme.primary,
                focusedPlaceholderColor = Color.Gray,
                unfocusedPlaceholderColor = Color.Gray
            )
        )

        // Add button
        IconButton(
            onClick = { submitTodo() },
            enabled = text.trim().isNotEmpty(),
            modifier = Modifier.size(56.dp),
            colors = IconButtonDefaults.iconButtonColors(
                containerColor = Color.White.copy(alpha = 0.9f),
                contentColor = MaterialTheme.colorScheme.primary,
                disabledContainerColor = Color.White.copy(alpha = 0.3f),
                disabledContentColor = Color.Gray
            )
        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "Add todo",
                modifier = Modifier.size(24.dp)
            )
        }
    }
}
