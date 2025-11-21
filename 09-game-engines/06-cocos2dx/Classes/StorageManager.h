#ifndef __STORAGE_MANAGER_H__
#define __STORAGE_MANAGER_H__

#include "cocos2d.h"
#include "TodoManager.h"
#include <vector>
#include <string>

/**
 * @brief Manages data persistence using JSON format
 *
 * Singleton class that handles saving and loading todo items
 * to/from the local file system using Cocos2d-x FileUtils.
 */
class StorageManager
{
public:
    /**
     * @brief Get the singleton instance
     */
    static StorageManager* getInstance();

    /**
     * @brief Destroy the singleton instance
     */
    static void destroyInstance();

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

    StorageManager(const StorageManager&) = delete;
    StorageManager& operator=(const StorageManager&) = delete;

    std::string getStoragePath() const;
    std::string todosToJson(const std::vector<TodoItem>& todos) const;
    std::vector<TodoItem> jsonToTodos(const std::string& json) const;

    static StorageManager* s_instance;

    static const std::string STORAGE_FILENAME;
};

#endif // __STORAGE_MANAGER_H__
