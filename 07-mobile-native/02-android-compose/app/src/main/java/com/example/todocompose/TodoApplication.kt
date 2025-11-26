package com.example.todocompose

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/**
 * TodoApplication - Application class for the Todo app
 *
 * The @HiltAndroidApp annotation triggers Hilt's code generation,
 * including a base class for the application that serves as the
 * application-level dependency container.
 *
 * This annotation must be placed on the Application class, and it:
 * 1. Generates a Hilt component attached to the Application lifecycle
 * 2. Provides dependencies that live as long as the application
 * 3. Enables dependency injection throughout the app
 *
 * AndroidManifest.xml must reference this class:
 * ```xml
 * <application
 *     android:name=".TodoApplication"
 *     ...
 * ```
 *
 * Hilt Component Hierarchy:
 * ```
 * ApplicationComponent (Singleton)
 *     ↓
 * ActivityComponent
 *     ↓
 * FragmentComponent / ViewModelComponent
 * ```
 *
 * Example DI usage:
 * ```kotlin
 * @AndroidEntryPoint
 * class MainActivity : ComponentActivity() {
 *     @Inject lateinit var repository: TodoRepository
 * }
 * ```
 */
@HiltAndroidApp
class TodoApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        // Hilt initialization happens automatically
        // Add any additional app-level initialization here
    }
}
