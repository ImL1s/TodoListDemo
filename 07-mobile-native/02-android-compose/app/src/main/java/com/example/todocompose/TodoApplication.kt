package com.example.todocompose

import android.app.Application

/**
 * TodoApplication - Custom Application class for the Todo Compose app
 *
 * This class serves as the entry point for the entire application lifecycle.
 * It can be used for:
 * - Initializing libraries that need application context
 * - Setting up dependency injection (e.g., Hilt, Koin)
 * - Configuring crash reporting
 * - Initializing analytics
 *
 * Currently, this is a minimal implementation, but it's ready for future
 * enhancements like:
 * - Dependency injection setup
 * - WorkManager initialization
 * - Firebase configuration
 * - Custom font loading
 *
 * Note: This class must be declared in AndroidManifest.xml with:
 * android:name=".TodoApplication"
 */
class TodoApplication : Application() {

    /**
     * Called when the application is starting, before any activity, service,
     * or receiver objects have been created.
     *
     * This is the perfect place to initialize singletons and application-wide
     * resources.
     */
    override fun onCreate() {
        super.onCreate()

        // Future: Initialize dependency injection
        // Example: initKoin()

        // Future: Initialize analytics
        // Example: Firebase.initialize(this)

        // Future: Setup crash reporting
        // Example: Crashlytics.setup(this)
    }
}
