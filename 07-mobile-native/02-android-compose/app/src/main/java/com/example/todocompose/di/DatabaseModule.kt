package com.example.todocompose.di

import android.content.Context
import androidx.room.Room
import com.example.todocompose.data.local.TodoDao
import com.example.todocompose.data.local.TodoDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * DatabaseModule - Hilt module for providing database dependencies
 *
 * This module tells Hilt how to create and provide database-related dependencies.
 *
 * Key Concepts:
 * 1. **@Module**: Marks this class as a Hilt module
 * 2. **@InstallIn**: Specifies the component where dependencies are available
 * 3. **@Provides**: Tells Hilt how to create an instance
 * 4. **@Singleton**: Ensures only one instance exists app-wide
 *
 * Component Scopes:
 * - SingletonComponent: Lives for the entire app lifecycle
 * - ActivityComponent: Lives as long as the activity
 * - ViewModelComponent: Lives as long as the ViewModel
 *
 * Dependencies Provided:
 * - TodoDatabase: The Room database instance
 * - TodoDao: The DAO for database operations
 *
 * Database Configuration:
 * - fallbackToDestructiveMigration(): Wipes data if migration fails (DEV only!)
 * - addMigrations(): Add migrations for production
 * - enableMultiInstanceInvalidation(): For multi-process apps
 *
 * Production Considerations:
 * ```kotlin
 * Room.databaseBuilder(...)
 *     .addMigrations(MIGRATION_1_2, MIGRATION_2_3)
 *     .build()
 * ```
 *
 * Testing:
 * ```kotlin
 * @Module
 * @TestInstallIn(
 *     components = [SingletonComponent::class],
 *     replaces = [DatabaseModule::class]
 * )
 * object TestDatabaseModule {
 *     @Provides
 *     @Singleton
 *     fun provideInMemoryDatabase(
 *         @ApplicationContext context: Context
 *     ): TodoDatabase {
 *         return Room.inMemoryDatabaseBuilder(
 *             context,
 *             TodoDatabase::class.java
 *         ).build()
 *     }
 * }
 * ```
 */
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    /**
     * Provides the TodoDatabase instance
     *
     * This is a singleton, so only one instance is created and shared
     * across the entire app. Room handles thread safety internally.
     *
     * Configuration:
     * - fallbackToDestructiveMigration(): For development. In production,
     *   replace this with proper migrations!
     *
     * @param context Application context provided by Hilt
     * @return Singleton TodoDatabase instance
     */
    @Provides
    @Singleton
    fun provideTodoDatabase(
        @ApplicationContext context: Context
    ): TodoDatabase {
        return Room.databaseBuilder(
            context,
            TodoDatabase::class.java,
            TodoDatabase.DATABASE_NAME
        )
            // For development: wipe database if schema changes
            // In production, use proper migrations!
            .fallbackToDestructiveMigration()
            .build()
    }

    /**
     * Provides the TodoDao instance
     *
     * Extracted from the database, this DAO is used by the repository
     * for all database operations.
     *
     * @param database The TodoDatabase instance
     * @return TodoDao instance
     */
    @Provides
    fun provideTodoDao(database: TodoDatabase): TodoDao {
        return database.todoDao()
    }
}
