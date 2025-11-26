/**
 * @file StorageManager.cpp
 * @brief Implementation of StorageManager class
 */

#include "StorageManager.h"
#include <QJsonDocument>
#include <QJsonArray>
#include <QJsonObject>
#include <QFile>
#include <QDir>
#include <QStandardPaths>
#include <QDebug>

/**
 * @brief Constructor implementation
 */
StorageManager::StorageManager(StorageBackend backend)
    : m_backend(backend)
{
    if (m_backend == StorageBackend::QSettingsJson) {
        // Initialize QSettings with custom format
        m_settings = std::make_unique<QSettings>(
            QSettings::IniFormat,
            QSettings::UserScope,
            "TodoListDemo",
            "QtTodoList"
        );
    } else if (m_backend == StorageBackend::SQLite) {
        // Initialize SQLite database
        initializeSQLite();
    }
}

/**
 * @brief Destructor implementation
 */
StorageManager::~StorageManager()
{
    // Cleanup handled by smart pointers
}

/**
 * @brief Save todos to storage
 */
bool StorageManager::saveTodos(const QVector<TodoItem>& todos)
{
    switch (m_backend) {
        case StorageBackend::QSettingsJson:
            return saveWithQSettings(todos);
        case StorageBackend::SQLite:
            return saveWithSQLite(todos);
        default:
            qWarning() << "Unknown storage backend";
            return false;
    }
}

/**
 * @brief Load todos from storage
 */
QVector<TodoItem> StorageManager::loadTodos()
{
    switch (m_backend) {
        case StorageBackend::QSettingsJson:
            return loadWithQSettings();
        case StorageBackend::SQLite:
            return loadWithSQLite();
        default:
            qWarning() << "Unknown storage backend";
            return QVector<TodoItem>();
    }
}

/**
 * @brief Clear all stored data
 */
bool StorageManager::clearStorage()
{
    if (m_backend == StorageBackend::QSettingsJson && m_settings) {
        m_settings->clear();
        m_settings->sync();
        return true;
    } else if (m_backend == StorageBackend::SQLite) {
        // For SQLite, just save an empty list
        return saveTodos(QVector<TodoItem>());
    }
    return false;
}

/**
 * @brief Get storage file path
 */
QString StorageManager::getStoragePath() const
{
    if (m_backend == StorageBackend::QSettingsJson && m_settings) {
        return m_settings->fileName();
    } else if (m_backend == StorageBackend::SQLite) {
        return getSQLitePath();
    }
    return QString();
}

/**
 * @brief Check if storage is available
 */
bool StorageManager::isStorageAvailable() const
{
    if (m_backend == StorageBackend::QSettingsJson && m_settings) {
        return m_settings->isWritable();
    } else if (m_backend == StorageBackend::SQLite) {
        return QFile::exists(getSQLitePath());
    }
    return false;
}

/**
 * @brief Get stored todo count
 */
int StorageManager::getStoredCount() const
{
    if (m_backend == StorageBackend::QSettingsJson && m_settings) {
        return m_settings->value("todos/count", 0).toInt();
    }
    // For other backends, would need to query the storage
    return -1;
}

/**
 * @brief Export todos to JSON file
 */
bool StorageManager::exportToJson(const QString& filePath, const QVector<TodoItem>& todos)
{
    QJsonArray todoArray;
    for (const auto& todo : todos) {
        todoArray.append(todo.toJson());
    }

    QJsonObject root;
    root["version"] = "1.0";
    root["count"] = todos.size();
    root["exportDate"] = QDateTime::currentDateTime().toString(Qt::ISODate);
    root["todos"] = todoArray;

    QJsonDocument doc(root);

    QFile file(filePath);
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
        qWarning() << "Failed to open file for export:" << filePath;
        return false;
    }

    file.write(doc.toJson(QJsonDocument::Indented));
    file.close();

    qDebug() << "Exported" << todos.size() << "todos to" << filePath;
    return true;
}

/**
 * @brief Import todos from JSON file
 */
QVector<TodoItem> StorageManager::importFromJson(const QString& filePath)
{
    QVector<TodoItem> todos;

    QFile file(filePath);
    if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        qWarning() << "Failed to open file for import:" << filePath;
        return todos;
    }

    QByteArray data = file.readAll();
    file.close();

    QJsonParseError parseError;
    QJsonDocument doc = QJsonDocument::fromJson(data, &parseError);

    if (parseError.error != QJsonParseError::NoError) {
        qWarning() << "JSON parse error:" << parseError.errorString();
        return todos;
    }

    if (!doc.isObject()) {
        qWarning() << "Invalid JSON format: root is not an object";
        return todos;
    }

    QJsonObject root = doc.object();
    if (!root.contains("todos") || !root["todos"].isArray()) {
        qWarning() << "Invalid JSON format: missing 'todos' array";
        return todos;
    }

    QJsonArray todoArray = root["todos"].toArray();
    for (const QJsonValue& value : todoArray) {
        if (value.isObject()) {
            TodoItem item = TodoItem::fromJson(value.toObject());
            todos.append(item);
        }
    }

    qDebug() << "Imported" << todos.size() << "todos from" << filePath;
    return todos;
}

/**
 * @brief Save using QSettings backend
 */
bool StorageManager::saveWithQSettings(const QVector<TodoItem>& todos)
{
    if (!m_settings) {
        qWarning() << "QSettings not initialized";
        return false;
    }

    // Convert todos to JSON
    QJsonArray todoArray;
    for (const auto& todo : todos) {
        todoArray.append(todo.toJson());
    }

    QJsonDocument doc(todoArray);
    QString jsonString = QString::fromUtf8(doc.toJson(QJsonDocument::Compact));

    // Save to QSettings
    m_settings->setValue("todos/data", jsonString);
    m_settings->setValue("todos/count", todos.size());
    m_settings->setValue("todos/lastModified", QDateTime::currentDateTime().toString(Qt::ISODate));
    m_settings->sync();

    qDebug() << "Saved" << todos.size() << "todos to" << m_settings->fileName();
    return m_settings->status() == QSettings::NoError;
}

/**
 * @brief Load using QSettings backend
 */
QVector<TodoItem> StorageManager::loadWithQSettings()
{
    QVector<TodoItem> todos;

    if (!m_settings) {
        qWarning() << "QSettings not initialized";
        return todos;
    }

    QString jsonString = m_settings->value("todos/data", "").toString();
    if (jsonString.isEmpty()) {
        qDebug() << "No stored todos found";
        return todos;
    }

    QJsonParseError parseError;
    QJsonDocument doc = QJsonDocument::fromJson(jsonString.toUtf8(), &parseError);

    if (parseError.error != QJsonParseError::NoError) {
        qWarning() << "Failed to parse stored JSON:" << parseError.errorString();
        return todos;
    }

    if (!doc.isArray()) {
        qWarning() << "Invalid stored data format";
        return todos;
    }

    QJsonArray todoArray = doc.array();
    for (const QJsonValue& value : todoArray) {
        if (value.isObject()) {
            TodoItem item = TodoItem::fromJson(value.toObject());
            todos.append(item);
        }
    }

    qDebug() << "Loaded" << todos.size() << "todos from" << m_settings->fileName();
    return todos;
}

/**
 * @brief Save using SQLite backend
 * @note This is a placeholder implementation. Full SQLite support requires QtSql module.
 */
bool StorageManager::saveWithSQLite(const QVector<TodoItem>& todos)
{
    // Placeholder: Full SQLite implementation would require:
    // 1. QtSql module linked
    // 2. Database connection management
    // 3. SQL queries for CRUD operations
    // 4. Transaction handling

    qWarning() << "SQLite backend not fully implemented. Falling back to JSON file.";

    // Fallback: Save as JSON file
    QString dataPath = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation);
    QDir().mkpath(dataPath);
    QString filePath = dataPath + "/todos.json";

    return exportToJson(filePath, todos);
}

/**
 * @brief Load using SQLite backend
 * @note This is a placeholder implementation.
 */
QVector<TodoItem> StorageManager::loadWithSQLite()
{
    qWarning() << "SQLite backend not fully implemented. Falling back to JSON file.";

    // Fallback: Load from JSON file
    QString dataPath = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation);
    QString filePath = dataPath + "/todos.json";

    if (QFile::exists(filePath)) {
        return importFromJson(filePath);
    }

    return QVector<TodoItem>();
}

/**
 * @brief Initialize SQLite database
 */
bool StorageManager::initializeSQLite()
{
    // Placeholder implementation
    // Full implementation would:
    // 1. Create database file if it doesn't exist
    // 2. Create tables with proper schema
    // 3. Create indices for performance
    // 4. Set up foreign keys and constraints

    QString dbPath = getSQLitePath();
    QDir().mkpath(QFileInfo(dbPath).absolutePath());

    qDebug() << "SQLite database path:" << dbPath;
    return true;
}

/**
 * @brief Get SQLite database path
 */
QString StorageManager::getSQLitePath() const
{
    QString dataPath = QStandardPaths::writableLocation(QStandardPaths::AppDataLocation);
    return dataPath + "/todos.db";
}
