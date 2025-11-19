/**
 * @file TodoItem.cpp
 * @brief Implementation of TodoItem class
 */

#include "TodoItem.h"
#include <QJsonDocument>

/**
 * @brief Default constructor implementation
 */
TodoItem::TodoItem()
    : m_id(QUuid::createUuid().toString(QUuid::WithoutBraces))
    , m_title("")
    , m_completed(false)
    , m_priority(Priority::Normal)
    , m_createdAt(QDateTime::currentDateTime())
    , m_modifiedAt(QDateTime::currentDateTime())
    , m_category("")
{
}

/**
 * @brief Constructor with title implementation
 */
TodoItem::TodoItem(const QString& title)
    : m_id(QUuid::createUuid().toString(QUuid::WithoutBraces))
    , m_title(title)
    , m_completed(false)
    , m_priority(Priority::Normal)
    , m_createdAt(QDateTime::currentDateTime())
    , m_modifiedAt(QDateTime::currentDateTime())
    , m_category("")
{
}

/**
 * @brief Full constructor implementation
 */
TodoItem::TodoItem(const QString& title, bool completed, Priority priority)
    : m_id(QUuid::createUuid().toString(QUuid::WithoutBraces))
    , m_title(title)
    , m_completed(completed)
    , m_priority(priority)
    , m_createdAt(QDateTime::currentDateTime())
    , m_modifiedAt(QDateTime::currentDateTime())
    , m_category("")
{
}

/**
 * @brief Set title and update modification time
 */
void TodoItem::setTitle(const QString& title)
{
    if (m_title != title) {
        m_title = title;
        updateModifiedTime();
    }
}

/**
 * @brief Set completion status and update modification time
 */
void TodoItem::setCompleted(bool completed)
{
    if (m_completed != completed) {
        m_completed = completed;
        updateModifiedTime();
    }
}

/**
 * @brief Set priority and update modification time
 */
void TodoItem::setPriority(Priority priority)
{
    if (m_priority != priority) {
        m_priority = priority;
        updateModifiedTime();
    }
}

/**
 * @brief Set category
 */
void TodoItem::setCategory(const QString& category)
{
    if (m_category != category) {
        m_category = category;
        updateModifiedTime();
    }
}

/**
 * @brief Toggle completion status
 */
bool TodoItem::toggleCompleted()
{
    m_completed = !m_completed;
    updateModifiedTime();
    return m_completed;
}

/**
 * @brief Update modification timestamp to current time
 */
void TodoItem::updateModifiedTime()
{
    m_modifiedAt = QDateTime::currentDateTime();
}

/**
 * @brief Serialize to JSON
 */
QJsonObject TodoItem::toJson() const
{
    QJsonObject json;
    json["id"] = m_id;
    json["title"] = m_title;
    json["completed"] = m_completed;
    json["priority"] = static_cast<int>(m_priority);
    json["createdAt"] = m_createdAt.toString(Qt::ISODate);
    json["modifiedAt"] = m_modifiedAt.toString(Qt::ISODate);
    json["category"] = m_category;
    return json;
}

/**
 * @brief Deserialize from JSON
 */
TodoItem TodoItem::fromJson(const QJsonObject& json)
{
    TodoItem item;

    if (json.contains("id") && json["id"].isString()) {
        item.m_id = json["id"].toString();
    }

    if (json.contains("title") && json["title"].isString()) {
        item.m_title = json["title"].toString();
    }

    if (json.contains("completed") && json["completed"].isBool()) {
        item.m_completed = json["completed"].toBool();
    }

    if (json.contains("priority") && json["priority"].isDouble()) {
        int priorityValue = json["priority"].toInt();
        if (priorityValue >= 0 && priorityValue <= 3) {
            item.m_priority = static_cast<Priority>(priorityValue);
        }
    }

    if (json.contains("createdAt") && json["createdAt"].isString()) {
        item.m_createdAt = QDateTime::fromString(json["createdAt"].toString(), Qt::ISODate);
    }

    if (json.contains("modifiedAt") && json["modifiedAt"].isString()) {
        item.m_modifiedAt = QDateTime::fromString(json["modifiedAt"].toString(), Qt::ISODate);
    }

    if (json.contains("category") && json["category"].isString()) {
        item.m_category = json["category"].toString();
    }

    return item;
}

/**
 * @brief Get priority as string
 */
QString TodoItem::priorityString() const
{
    switch (m_priority) {
        case Priority::Low:    return "Low";
        case Priority::Normal: return "Normal";
        case Priority::High:   return "High";
        case Priority::Urgent: return "Urgent";
        default:               return "Unknown";
    }
}

/**
 * @brief Equality comparison
 */
bool TodoItem::operator==(const TodoItem& other) const
{
    return m_id == other.m_id;
}

/**
 * @brief Inequality comparison
 */
bool TodoItem::operator!=(const TodoItem& other) const
{
    return !(*this == other);
}
