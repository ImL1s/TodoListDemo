package com.example.todocompose.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.todocompose.data.Todo

/**
 * TodoDatabase - Room database for the Todo application
 *
 * This class represents the database holder and serves as the main access point
 * for the underlying SQLite database.
 *
 * Room Database Features:
 * 1. **Compile-time Verification**: SQL queries checked at compile time
 * 2. **Type Safety**: Strong typing for all queries
 * 3. **Migration Support**: Automatic and manual migration strategies
 * 4. **Efficient**: Minimal overhead compared to raw SQLite
 * 5. **Coroutines Support**: First-class support for Kotlin Coroutines
 * 6. **Flow Support**: Reactive queries that emit updates automatically
 *
 * Database Design:
 * - Single table: `todos`
 * - Version: 1 (increment when schema changes)
 * - Export schema: Enabled for version control and migrations
 *
 * Threading:
 * - All database operations (except Flow queries) must be called from
 *   a background thread (using suspend functions or executors)
 * - Room enforces this at runtime
 *
 * Instance Creation:
 * - Singleton pattern recommended (use Hilt for DI)
 * - Builder pattern for configuration
 * - Fallback strategies for missing migrations
 *
 * @see TodoDao The DAO for accessing todo data
 * @see Todo The entity stored in the database
 *
 * Example usage with Hilt:
 * ```kotlin
 * @Module
 * @InstallIn(SingletonComponent::class)
 * object DatabaseModule {
 *     @Provides
 *     @Singleton
 *     fun provideTodoDatabase(
 *         @ApplicationContext context: Context
 *     ): TodoDatabase {
 *         return Room.databaseBuilder(
 *             context,
 *             TodoDatabase::class.java,
 *             "todo_database"
 *         )
 *         .fallbackToDestructiveMigration() // For development
 *         .build()
 *     }
 *
 *     @Provides
 *     fun provideTodoDao(database: TodoDatabase): TodoDao {
 *         return database.todoDao()
 *     }
 * }
 * ```
 *
 * Migration Example (when schema changes):
 * ```kotlin
 * val MIGRATION_1_2 = object : Migration(1, 2) {
 *     override fun migrate(database: SupportSQLiteDatabase) {
 *         database.execSQL("ALTER TABLE todos ADD COLUMN priority INTEGER NOT NULL DEFAULT 0")
 *     }
 * }
 *
 * Room.databaseBuilder(...)
 *     .addMigrations(MIGRATION_1_2)
 *     .build()
 * ```
 */
@Database(
    entities = [Todo::class],
    version = 1,
    exportSchema = true // Export schema to project directory for version control
)
abstract class TodoDatabase : RoomDatabase() {

    /**
     * Returns the DAO for Todo operations
     *
     * Room generates the implementation of this abstract method.
     *
     * @return The TodoDao instance
     */
    abstract fun todoDao(): TodoDao

    companion object {
        /**
         * Database name constant
         *
         * This is the file name for the SQLite database.
         * It will be created in the app's internal storage.
         */
        const val DATABASE_NAME = "todo_database"
    }
}
