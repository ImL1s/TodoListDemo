package com.example.todocompose

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.todocompose.ui.TodoListScreen
import com.example.todocompose.ui.theme.TodoComposeTheme
import com.example.todocompose.viewmodel.TodoViewModel
import dagger.hilt.android.AndroidEntryPoint

/**
 * MainActivity - The entry point of the Todo Compose application
 *
 * The @AndroidEntryPoint annotation enables dependency injection in this Activity.
 * It generates a Hilt component attached to the Activity's lifecycle.
 *
 * This activity follows the modern Android development approach by:
 * 1. Using Jetpack Compose for UI (no XML layouts)
 * 2. Enabling edge-to-edge display for immersive experience
 * 3. Using Hilt for dependency injection
 * 4. Integrating with ViewModel for state management
 * 5. Applying Material Design 3 theming
 *
 * Key Features:
 * - Single Activity Architecture: All UI is rendered in Compose
 * - Edge-to-Edge Display: Content extends to system bars
 * - Dependency Injection: Hilt manages all dependencies
 * - Theme Support: Automatic dark/light mode based on system settings
 * - ViewModel Integration: State survives configuration changes
 *
 * Hilt Integration:
 * - @AndroidEntryPoint: Enables field injection in this Activity
 * - hiltViewModel(): Creates ViewModel with injected dependencies
 * - No manual Factory needed!
 *
 * @see TodoListScreen The main composable that renders the todo list
 * @see TodoViewModel The ViewModel managing todo state and business logic
 * @see TodoComposeTheme The Material Design 3 theme for the app
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    /**
     * Called when the activity is first created.
     * Sets up the Compose UI and enables modern Android features.
     *
     * @param savedInstanceState Bundle containing the activity's previously saved state
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Enable edge-to-edge display (Android 15+ style)
        // This allows content to draw behind system bars
        enableEdgeToEdge()

        // Set the Compose content tree
        // This replaces the traditional setContentView(R.layout.activity_main)
        setContent {
            // Apply the app theme (supports dark mode automatically)
            TodoComposeTheme {
                // Surface provides a background with theme colors
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    // Render the main todo list screen
                    // hiltViewModel() automatically injects dependencies
                    TodoListScreen(viewModel = hiltViewModel())
                }
            }
        }
    }
}

