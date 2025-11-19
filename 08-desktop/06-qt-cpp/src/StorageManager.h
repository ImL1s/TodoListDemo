/**
 * @file StorageManager.h
 * @brief Storage Manager for Persistent Data
 *
 * This file defines the StorageManager class which handles persistent
 * storage of todo items using QSettings (JSON format) or SQLite database.
 */

#ifndef STORAGEMANAGER_H
#define STORAGEMANAGER_H

#include <QString>
#include <QVector>
#include <QSettings>
#include <memory>
#include "TodoItem.h"

/**
 * @class StorageManager
 * @brief Manages persistent storage of todo items
 *
 * This class provides an abstraction layer for storing and retrieving
 * todo items. It supports two storage backends:
 * 1. QSettings (JSON format) - Default, simple, cross-platform
 * 2. SQLite (QtSql) - More robust, better for large datasets
 *
 * The storage backend can be configured at compile time or runtime.
 */
class StorageManager
{
public:
    /**
     * @enum StorageBackend
     * @brief Available storage backends
     */
    enum class StorageBackend {
        QSettingsJson,  ///< QSettings with JSON serialization
        SQLite          ///< SQLite database (requires QtSql)
    };

    /**
     * @brief Constructor
     * @param backend Storage backend to use (default: QSettingsJson)
     */
    explicit StorageManager(StorageBackend backend = StorageBackend::QSettingsJson);

    /**
     * @brief Destructor
     */
    ~StorageManager();

    /**
     * @brief Save todos to persistent storage
     * @param todos Vector of todo items to save
     * @return true if successful, false otherwise
     */
    bool saveTodos(const QVector<TodoItem>& todos);

    /**
     * @brief Load todos from persistent storage
     * @return Vector of loaded todo items (empty if none exist)
     */
    QVector<TodoItem> loadTodos();

    /**
     * @brief Clear all stored todos
     * @return true if successful, false otherwise
     */
    bool clearStorage();

    /**
     * @brief Get the current storage backend
     * @return Current storage backend type
     */
    StorageBackend getBackend() const { return m_backend; }

    /**
     * @brief Get the storage file path
     * @return Path to storage file (or database)
     */
    QString getStoragePath() const;

    /**
     * @brief Check if storage exists and is accessible
     * @return true if storage is accessible
     */
    bool isStorageAvailable() const;

    /**
     * @brief Get the number of stored todos without loading them
     * @return Number of todos in storage, or -1 on error
     */
    int getStoredCount() const;

    /**
     * @brief Export todos to JSON file
     * @param filePath Path to export file
     * @param todos Todos to export
     * @return true if successful
     */
    static bool exportToJson(const QString& filePath, const QVector<TodoItem>& todos);

    /**
     * @brief Import todos from JSON file
     * @param filePath Path to import file
     * @return Vector of imported todos (empty on error)
     */
    static QVector<TodoItem> importFromJson(const QString& filePath);

private:
    StorageBackend m_backend;                  ///< Current storage backend
    std::unique_ptr<QSettings> m_settings;     ///< QSettings instance (for QSettingsJson backend)

    /**
     * @brief Save using QSettings backend
     * @param todos Todos to save
     * @return true if successful
     */
    bool saveWithQSettings(const QVector<TodoItem>& todos);

    /**
     * @brief Load using QSettings backend
     * @return Loaded todos
     */
    QVector<TodoItem> loadWithQSettings();

    /**
     * @brief Save using SQLite backend
     * @param todos Todos to save
     * @return true if successful
     */
    bool saveWithSQLite(const QVector<TodoItem>& todos);

    /**
     * @brief Load using SQLite backend
     * @return Loaded todos
     */
    QVector<TodoItem> loadWithSQLite();

    /**
     * @brief Initialize SQLite database
     * @return true if successful
     */
    bool initializeSQLite();

    /**
     * @brief Get SQLite database path
     * @return Path to SQLite database file
     */
    QString getSQLitePath() const;
};

#endif // STORAGEMANAGER_H
