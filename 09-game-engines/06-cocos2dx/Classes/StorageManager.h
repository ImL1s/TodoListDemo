#ifndef __STORAGE_MANAGER_H__
#define __STORAGE_MANAGER_H__

#include "cocos2d.h"
#include "TodoManager.h"
#include <vector>
#include <string>

/**
 * @brief Manages data persistence using JSON format
 *
 * Thread-safe singleton class that handles saving and loading todo items
 * to/from the local file system using Cocos2d-x FileUtils.
 *
 * Uses Meyer's Singleton pattern (C++11 static local variable),
 * which guarantees thread-safety and automatic lifetime management.
 * No manual destruction needed - instance is cleaned up automatically
 * at program termination.
 */
class StorageManager
{
public:
    /**
     * @brief Get the singleton instance (thread-safe, Meyer's Singleton)
     * @return Pointer to the singleton instance
     */
    static StorageManager* getInstance();

    /**
     * @brief Save todos to local storage
     * @param todos Vector of TodoItems to save
     * @return true if saved successfully, false otherwise
     */
    bool saveTodos(const std::vector<TodoItem>& todos);

    /**
     * @brief Load todos from local storage
     * @return Vector of TodoItems loaded from storage
     */
    std::vector<TodoItem> loadTodos();

    /**
     * @brief Clear all saved data
     * @return true if cleared successfully, false otherwise
     */
    bool clearStorage();

private:
    StorageManager();
    ~StorageManager();

    // Delete copy constructor and assignment operator
    StorageManager(const StorageManager&) = delete;
    StorageManager& operator=(const StorageManager&) = delete;

    std::string getStoragePath() const;
    std::string todosToJson(const std::vector<TodoItem>& todos) const;
    std::vector<TodoItem> jsonToTodos(const std::string& json) const;

    static const std::string STORAGE_FILENAME;
};

#endif // __STORAGE_MANAGER_H__
