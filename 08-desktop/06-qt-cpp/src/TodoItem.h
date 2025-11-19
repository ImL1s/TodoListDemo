/**
 * @file TodoItem.h
 * @brief Todo Item Data Model
 *
 * This file defines the TodoItem class which represents a single todo item
 * in the application. It includes all properties like title, completion status,
 * creation date, etc.
 */

#ifndef TODOITEM_H
#define TODOITEM_H

#include <QString>
#include <QDateTime>
#include <QUuid>
#include <QJsonObject>
#include <QMetaType>

/**
 * @class TodoItem
 * @brief Represents a single todo item with all its properties
 *
 * This class encapsulates all data related to a todo item including:
 * - Unique identifier (UUID)
 * - Title/text content
 * - Completion status
 * - Creation and modification timestamps
 * - Priority level
 * - Tags/categories
 */
class TodoItem
{
public:
    /**
     * @enum Priority
     * @brief Priority levels for todo items
     */
    enum class Priority {
        Low = 0,
        Normal = 1,
        High = 2,
        Urgent = 3
    };

    /**
     * @brief Default constructor
     * Creates an empty todo item with auto-generated UUID
     */
    TodoItem();

    /**
     * @brief Constructor with title
     * @param title The todo item title
     */
    explicit TodoItem(const QString& title);

    /**
     * @brief Full constructor
     * @param title The todo item title
     * @param completed Completion status
     * @param priority Priority level
     */
    TodoItem(const QString& title, bool completed, Priority priority = Priority::Normal);

    /**
     * @brief Copy constructor
     */
    TodoItem(const TodoItem& other) = default;

    /**
     * @brief Move constructor
     */
    TodoItem(TodoItem&& other) noexcept = default;

    /**
     * @brief Copy assignment operator
     */
    TodoItem& operator=(const TodoItem& other) = default;

    /**
     * @brief Move assignment operator
     */
    TodoItem& operator=(TodoItem&& other) noexcept = default;

    /**
     * @brief Destructor
     */
    ~TodoItem() = default;

    // Getters
    QString getId() const { return m_id; }
    QString getTitle() const { return m_title; }
    bool isCompleted() const { return m_completed; }
    Priority getPriority() const { return m_priority; }
    QDateTime getCreatedAt() const { return m_createdAt; }
    QDateTime getModifiedAt() const { return m_modifiedAt; }
    QString getCategory() const { return m_category; }

    // Setters
    void setId(const QString& id) { m_id = id; }
    void setTitle(const QString& title);
    void setCompleted(bool completed);
    void setPriority(Priority priority);
    void setCategory(const QString& category);

    /**
     * @brief Toggle completion status
     * @return New completion status
     */
    bool toggleCompleted();

    /**
     * @brief Convert to JSON object for serialization
     * @return QJsonObject representation
     */
    QJsonObject toJson() const;

    /**
     * @brief Create TodoItem from JSON object
     * @param json JSON object to deserialize
     * @return TodoItem instance
     */
    static TodoItem fromJson(const QJsonObject& json);

    /**
     * @brief Get priority as string
     * @return Priority name
     */
    QString priorityString() const;

    /**
     * @brief Get priority as integer
     * @return Priority value (0-3)
     */
    int priorityValue() const { return static_cast<int>(m_priority); }

    /**
     * @brief Equality comparison operator
     */
    bool operator==(const TodoItem& other) const;

    /**
     * @brief Inequality comparison operator
     */
    bool operator!=(const TodoItem& other) const;

private:
    QString m_id;                  ///< Unique identifier (UUID)
    QString m_title;               ///< Todo item title/description
    bool m_completed;              ///< Completion status
    Priority m_priority;           ///< Priority level
    QDateTime m_createdAt;         ///< Creation timestamp
    QDateTime m_modifiedAt;        ///< Last modification timestamp
    QString m_category;            ///< Category/tag for organization

    /**
     * @brief Update modification timestamp
     */
    void updateModifiedTime();
};

// Register TodoItem with Qt's meta-type system for use in QVariant
Q_DECLARE_METATYPE(TodoItem)
Q_DECLARE_METATYPE(TodoItem::Priority)

#endif // TODOITEM_H
