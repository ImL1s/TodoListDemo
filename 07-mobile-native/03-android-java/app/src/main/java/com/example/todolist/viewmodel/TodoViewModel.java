package com.example.todolist.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;

import com.example.todolist.database.TodoDao;
import com.example.todolist.database.TodoDatabase;
import com.example.todolist.model.Todo;

import java.util.List;

/**
 * Todo ViewModel
 *
 * Manages UI-related data in a lifecycle-conscious way.
 * Survives configuration changes (e.g., screen rotation).
 */
public class TodoViewModel extends AndroidViewModel {

    private final TodoDao todoDao;
    private final LiveData<List<Todo>> allTodos;

    /**
     * Constructor
     *
     * @param application the application instance
     */
    public TodoViewModel(@NonNull Application application) {
        super(application);

        // Get database instance
        TodoDatabase database = TodoDatabase.getInstance(application);
        todoDao = database.todoDao();

        // Load all todos
        allTodos = todoDao.getAllTodos();
    }

    // ==================== LiveData Getters ====================

    /**
     * Get all todos as LiveData
     *
     * @return LiveData list of all todos
     */
    public LiveData<List<Todo>> getAllTodos() {
        return allTodos;
    }

    /**
     * Get active todos as LiveData
     *
     * @return LiveData list of active todos
     */
    public LiveData<List<Todo>> getActiveTodos() {
        return todoDao.getActiveTodos();
    }

    /**
     * Get completed todos as LiveData
     *
     * @return LiveData list of completed todos
     */
    public LiveData<List<Todo>> getCompletedTodos() {
        return todoDao.getCompletedTodos();
    }

    /**
     * Search todos by text
     *
     * @param query the search query
     * @return LiveData list of matching todos
     */
    public LiveData<List<Todo>> searchTodos(String query) {
        return todoDao.searchTodos(query);
    }

    // ==================== Database Operations ====================

    /**
     * Insert a new todo
     *
     * @param todo the todo to insert
     */
    public void insert(Todo todo) {
        TodoDatabase.databaseWriteExecutor.execute(() -> {
            long id = todoDao.insert(todo);
            System.out.println("Todo inserted with id: " + id);
        });
    }

    /**
     * Update an existing todo
     *
     * @param todo the todo to update
     */
    public void update(Todo todo) {
        TodoDatabase.databaseWriteExecutor.execute(() -> {
            int rows = todoDao.update(todo);
            System.out.println("Todo updated, rows affected: " + rows);
        });
    }

    /**
     * Delete a todo
     *
     * @param todo the todo to delete
     */
    public void delete(Todo todo) {
        TodoDatabase.databaseWriteExecutor.execute(() -> {
            int rows = todoDao.delete(todo);
            System.out.println("Todo deleted, rows affected: " + rows);
        });
    }

    /**
     * Delete all todos
     */
    public void deleteAll() {
        TodoDatabase.databaseWriteExecutor.execute(() -> {
            todoDao.deleteAll();
            System.out.println("All todos deleted");
        });
    }

    /**
     * Delete all completed todos
     */
    public void deleteCompleted() {
        TodoDatabase.databaseWriteExecutor.execute(() -> {
            int rows = todoDao.deleteCompletedTodos();
            System.out.println("Deleted " + rows + " completed todos");
        });
    }

    /**
     * Toggle todo completion status
     *
     * @param todo the todo to toggle
     */
    public void toggleTodo(Todo todo) {
        TodoDatabase.databaseWriteExecutor.execute(() -> {
            todo.toggle();
            todoDao.update(todo);
            System.out.println("Todo toggled: " + todo);
        });
    }

    // ==================== Statistics ====================

    /**
     * Get total todo count
     * Note: This runs on background thread
     *
     * @param callback callback to receive the count
     */
    public void getTodoCount(CountCallback callback) {
        TodoDatabase.databaseWriteExecutor.execute(() -> {
            int count = todoDao.getTodoCount();
            callback.onCountReceived(count);
        });
    }

    /**
     * Get completed todo count
     *
     * @param callback callback to receive the count
     */
    public void getCompletedCount(CountCallback callback) {
        TodoDatabase.databaseWriteExecutor.execute(() -> {
            int count = todoDao.getCompletedTodoCount();
            callback.onCountReceived(count);
        });
    }

    /**
     * Get active todo count
     *
     * @param callback callback to receive the count
     */
    public void getActiveCount(CountCallback callback) {
        TodoDatabase.databaseWriteExecutor.execute(() -> {
            int count = todoDao.getActiveTodoCount();
            callback.onCountReceived(count);
        });
    }

    /**
     * Callback interface for count operations
     */
    public interface CountCallback {
        void onCountReceived(int count);
    }

    // ==================== Cleanup ====================

    @Override
    protected void onCleared() {
        super.onCleared();
        System.out.println("TodoViewModel cleared");
    }
}
