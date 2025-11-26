package com.example.todolist.database;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.example.todolist.model.Todo;

import java.util.List;

/**
 * Todo Data Access Object (DAO)
 *
 * Defines database operations for Todo entities.
 * Room generates the implementation at compile time.
 */
@Dao
public interface TodoDao {

    /**
     * Insert a new todo
     *
     * @param todo the todo to insert
     * @return the ID of the inserted todo
     */
    @Insert
    long insert(Todo todo);

    /**
     * Update an existing todo
     *
     * @param todo the todo to update
     * @return the number of rows updated
     */
    @Update
    int update(Todo todo);

    /**
     * Delete a todo
     *
     * @param todo the todo to delete
     * @return the number of rows deleted
     */
    @Delete
    int delete(Todo todo);

    /**
     * Delete all todos
     */
    @Query("DELETE FROM todos")
    void deleteAll();

    /**
     * Get all todos ordered by creation date descending
     *
     * @return LiveData list of all todos
     */
    @Query("SELECT * FROM todos ORDER BY created_at DESC")
    LiveData<List<Todo>> getAllTodos();

    /**
     * Get all todos (non-LiveData version)
     *
     * @return list of all todos
     */
    @Query("SELECT * FROM todos ORDER BY created_at DESC")
    List<Todo> getAllTodosSync();

    /**
     * Get a specific todo by ID
     *
     * @param id the todo ID
     * @return the todo if found
     */
    @Query("SELECT * FROM todos WHERE id = :id LIMIT 1")
    Todo getTodoById(long id);

    /**
     * Get todos by completion status
     *
     * @param completed the completion status
     * @return LiveData list of todos
     */
    @Query("SELECT * FROM todos WHERE completed = :completed ORDER BY created_at DESC")
    LiveData<List<Todo>> getTodosByStatus(boolean completed);

    /**
     * Get active (not completed) todos
     *
     * @return LiveData list of active todos
     */
    @Query("SELECT * FROM todos WHERE completed = 0 ORDER BY created_at DESC")
    LiveData<List<Todo>> getActiveTodos();

    /**
     * Get completed todos
     *
     * @return LiveData list of completed todos
     */
    @Query("SELECT * FROM todos WHERE completed = 1 ORDER BY created_at DESC")
    LiveData<List<Todo>> getCompletedTodos();

    /**
     * Delete all completed todos
     *
     * @return the number of rows deleted
     */
    @Query("DELETE FROM todos WHERE completed = 1")
    int deleteCompletedTodos();

    /**
     * Get count of all todos
     *
     * @return total number of todos
     */
    @Query("SELECT COUNT(*) FROM todos")
    int getTodoCount();

    /**
     * Get count of completed todos
     *
     * @return number of completed todos
     */
    @Query("SELECT COUNT(*) FROM todos WHERE completed = 1")
    int getCompletedTodoCount();

    /**
     * Get count of active todos
     *
     * @return number of active todos
     */
    @Query("SELECT COUNT(*) FROM todos WHERE completed = 0")
    int getActiveTodoCount();

    /**
     * Search todos by text
     *
     * @param searchQuery the search query
     * @return LiveData list of matching todos
     */
    @Query("SELECT * FROM todos WHERE text LIKE '%' || :searchQuery || '%' ORDER BY created_at DESC")
    LiveData<List<Todo>> searchTodos(String searchQuery);
}
