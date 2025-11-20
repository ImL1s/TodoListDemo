package com.example.todolist.database;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.sqlite.db.SupportSQLiteDatabase;

import com.example.todolist.model.Todo;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Todo Room Database
 *
 * Main database class for the application.
 * Provides access to the TodoDao and manages database creation/migration.
 */
@Database(entities = {Todo.class}, version = 1, exportSchema = false)
public abstract class TodoDatabase extends RoomDatabase {

    // Database name
    private static final String DATABASE_NAME = "todo_database";

    // Singleton instance
    private static volatile TodoDatabase INSTANCE;

    // Thread pool for database operations
    private static final int NUMBER_OF_THREADS = 4;
    public static final ExecutorService databaseWriteExecutor =
            Executors.newFixedThreadPool(NUMBER_OF_THREADS);

    /**
     * Get the TodoDao
     *
     * @return the TodoDao instance
     */
    public abstract TodoDao todoDao();

    /**
     * Get the database instance (Singleton pattern)
     *
     * @param context the application context
     * @return the database instance
     */
    public static TodoDatabase getInstance(final Context context) {
        if (INSTANCE == null) {
            synchronized (TodoDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                                    context.getApplicationContext(),
                                    TodoDatabase.class,
                                    DATABASE_NAME)
                            .addCallback(roomCallback)
                            .build();
                }
            }
        }
        return INSTANCE;
    }

    /**
     * Database callback for initialization
     */
    private static final RoomDatabase.Callback roomCallback = new RoomDatabase.Callback() {
        @Override
        public void onCreate(@NonNull SupportSQLiteDatabase db) {
            super.onCreate(db);

            // Optionally populate database with initial data
            databaseWriteExecutor.execute(() -> {
                TodoDao dao = INSTANCE.todoDao();

                // Add sample todos (optional)
                // dao.insert(new Todo("Welcome to TodoList!"));
                // dao.insert(new Todo("Tap the + button to add a task"));
                // dao.insert(new Todo("Check the box to mark as complete"));

                System.out.println("Database created successfully");
            });
        }

        @Override
        public void onOpen(@NonNull SupportSQLiteDatabase db) {
            super.onOpen(db);
            System.out.println("Database opened");
        }
    };

    /**
     * Close the database instance (for testing purposes)
     */
    public static void closeInstance() {
        if (INSTANCE != null) {
            INSTANCE.close();
            INSTANCE = null;
        }
    }

    /**
     * Destroy the database (for testing purposes)
     *
     * @param context the application context
     */
    public static void destroyInstance(Context context) {
        closeInstance();
        context.deleteDatabase(DATABASE_NAME);
    }
}
