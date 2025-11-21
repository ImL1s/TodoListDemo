#ifndef __TODO_MANAGER_H__
#define __TODO_MANAGER_H__

#include "cocos2d.h"
#include <vector>
#include <string>
#include <functional>

/**
 * @brief Todo item data structure
 */
struct TodoItem
{
    int id;
    std::string text;
    bool completed;
    long long createdAt; // Unix timestamp

    TodoItem() : id(0), completed(false), createdAt(0) {}

    TodoItem(int _id, const std::string& _text, bool _completed, long long _createdAt)
        : id(_id), text(_text), completed(_completed), createdAt(_createdAt) {}
};

/**
 * @brief Filter types for todo list
 */
enum class TodoFilter
{
    ALL,
    ACTIVE,
    COMPLETED
};

/**
 * @brief Manages all todo items and business logic
 *
 * Singleton class that handles CRUD operations for todos,
 * filtering, and persistence through StorageManager.
 */
class TodoManager
{
public:
    /**
     * @brief Get the singleton instance
     */
    static TodoManager* getInstance();

    /**
     * @brief Destroy the singleton instance
     */
    static void destroyInstance();

    /**
     * @brief Add a new todo item
     * @param text The todo text content
     * @return The newly created TodoItem
     */
    TodoItem addTodo(const std::string& text);

    /**
     * @brief Delete a todo by ID
     * @param id The todo item ID
     * @return true if deleted successfully, false otherwise
     */
    bool deleteTodo(int id);

    /**
     * @brief Toggle the completion status of a todo
     * @param id The todo item ID
     * @return true if toggled successfully, false otherwise
     */
    bool toggleTodo(int id);

    /**
     * @brief Get all todos based on current filter
     * @return Vector of TodoItems
     */
    std::vector<TodoItem> getTodos() const;

    /**
     * @brief Get all todos regardless of filter
     * @return Vector of all TodoItems
     */
    std::vector<TodoItem> getAllTodos() const;

    /**
     * @brief Set the current filter
     * @param filter The filter type
     */
    void setFilter(TodoFilter filter);

    /**
     * @brief Get the current filter
     * @return Current filter type
     */
    TodoFilter getFilter() const;

    /**
     * @brief Get count of total todos
     */
    int getTotalCount() const;

    /**
     * @brief Get count of active todos
     */
    int getActiveCount() const;

    /**
     * @brief Get count of completed todos
     */
    int getCompletedCount() const;

    /**
     * @brief Clear all completed todos
     * @return Number of todos cleared
     */
    int clearCompleted();

    /**
     * @brief Load todos from storage
     */
    void loadTodos();

    /**
     * @brief Save todos to storage
     */
    void saveTodos();

    /**
     * @brief Register a callback for todo list changes
     */
    void setOnTodosChangedCallback(std::function<void()> callback);

private:
    TodoManager();
    ~TodoManager();

    TodoManager(const TodoManager&) = delete;
    TodoManager& operator=(const TodoManager&) = delete;

    void notifyChanges();

    static TodoManager* s_instance;

    std::vector<TodoItem> m_todos;
    TodoFilter m_currentFilter;
    int m_nextId;
    std::function<void()> m_onTodosChanged;
};

#endif // __TODO_MANAGER_H__
