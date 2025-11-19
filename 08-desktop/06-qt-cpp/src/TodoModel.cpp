/**
 * @file TodoModel.cpp
 * @brief Implementation of TodoModel class
 */

#include "TodoModel.h"
#include "StorageManager.h"
#include <QDebug>
#include <algorithm>

/**
 * @brief Constructor implementation
 */
TodoModel::TodoModel(QObject *parent)
    : QAbstractListModel(parent)
    , m_filterMode(FilterMode::All)
    , m_storage(std::make_unique<StorageManager>())
{
    // Load data from storage on initialization
    loadFromStorage();
}

/**
 * @brief Destructor implementation
 */
TodoModel::~TodoModel()
{
    // Auto-save on destruction
    saveToStorage();
}

/**
 * @brief Return the number of rows in the model
 */
int TodoModel::rowCount(const QModelIndex &parent) const
{
    if (parent.isValid())
        return 0;

    return m_filteredIndices.size();
}

/**
 * @brief Return data for a given role and index
 */
QVariant TodoModel::data(const QModelIndex &index, int role) const
{
    if (!index.isValid() || index.row() >= m_filteredIndices.size())
        return QVariant();

    int actualIndex = getActualIndex(index.row());
    if (actualIndex < 0 || actualIndex >= m_todos.size())
        return QVariant();

    const TodoItem& item = m_todos.at(actualIndex);

    switch (role) {
        case Qt::DisplayRole:
        case TitleRole:
            return item.getTitle();

        case CompletedRole:
            return item.isCompleted();

        case PriorityRole:
            return item.priorityValue();

        case PriorityStringRole:
            return item.priorityString();

        case CreatedAtRole:
            return item.getCreatedAt();

        case ModifiedAtRole:
            return item.getModifiedAt();

        case CategoryRole:
            return item.getCategory();

        case IdRole:
            return item.getId();

        case Qt::CheckStateRole:
            return item.isCompleted() ? Qt::Checked : Qt::Unchecked;

        default:
            return QVariant();
    }
}

/**
 * @brief Set data for a given role and index
 */
bool TodoModel::setData(const QModelIndex &index, const QVariant &value, int role)
{
    if (!index.isValid() || index.row() >= m_filteredIndices.size())
        return false;

    int actualIndex = getActualIndex(index.row());
    if (actualIndex < 0 || actualIndex >= m_todos.size())
        return false;

    TodoItem& item = m_todos[actualIndex];
    bool changed = false;

    switch (role) {
        case Qt::EditRole:
        case TitleRole:
            if (value.canConvert<QString>()) {
                item.setTitle(value.toString());
                changed = true;
            }
            break;

        case CompletedRole:
        case Qt::CheckStateRole:
            if (value.canConvert<bool>()) {
                item.setCompleted(value.toBool());
                changed = true;
            }
            break;

        case PriorityRole:
            if (value.canConvert<int>()) {
                int priorityValue = value.toInt();
                if (priorityValue >= 0 && priorityValue <= 3) {
                    item.setPriority(static_cast<TodoItem::Priority>(priorityValue));
                    changed = true;
                }
            }
            break;

        case CategoryRole:
            if (value.canConvert<QString>()) {
                item.setCategory(value.toString());
                changed = true;
            }
            break;

        default:
            return false;
    }

    if (changed) {
        emit dataChanged(index, index, {role});
        emit todoUpdated(item);
        emit countsChanged();
        saveToStorage();
        return true;
    }

    return false;
}

/**
 * @brief Return item flags
 */
Qt::ItemFlags TodoModel::flags(const QModelIndex &index) const
{
    if (!index.isValid())
        return Qt::NoItemFlags;

    return QAbstractListModel::flags(index) | Qt::ItemIsEditable | Qt::ItemIsUserCheckable;
}

/**
 * @brief Return role names for QML integration
 */
QHash<int, QByteArray> TodoModel::roleNames() const
{
    QHash<int, QByteArray> roles;
    roles[TitleRole] = "title";
    roles[CompletedRole] = "completed";
    roles[PriorityRole] = "priority";
    roles[PriorityStringRole] = "priorityString";
    roles[CreatedAtRole] = "createdAt";
    roles[ModifiedAtRole] = "modifiedAt";
    roles[CategoryRole] = "category";
    roles[IdRole] = "id";
    return roles;
}

/**
 * @brief Add a new todo with title and priority
 */
bool TodoModel::addTodo(const QString& title, TodoItem::Priority priority)
{
    if (title.trimmed().isEmpty())
        return false;

    TodoItem newItem(title.trimmed(), false, priority);
    return addTodo(newItem);
}

/**
 * @brief Add a todo item object
 */
bool TodoModel::addTodo(const TodoItem& item)
{
    // Add to the main list
    m_todos.append(item);

    // Check if the new item passes the current filter
    if (passesFilter(item)) {
        int filteredRow = m_filteredIndices.size();
        beginInsertRows(QModelIndex(), filteredRow, filteredRow);
        m_filteredIndices.append(m_todos.size() - 1);
        endInsertRows();
    }

    emit todoAdded(item);
    emit countsChanged();
    saveToStorage();
    return true;
}

/**
 * @brief Remove a todo by model index
 */
bool TodoModel::removeTodo(const QModelIndex& index)
{
    if (!index.isValid())
        return false;

    return removeTodo(index.row());
}

/**
 * @brief Remove a todo by row
 */
bool TodoModel::removeTodo(int row)
{
    if (row < 0 || row >= m_filteredIndices.size())
        return false;

    int actualIndex = getActualIndex(row);
    if (actualIndex < 0 || actualIndex >= m_todos.size())
        return false;

    QString removedId = m_todos[actualIndex].getId();

    // Remove from filtered view
    beginRemoveRows(QModelIndex(), row, row);
    m_filteredIndices.removeAt(row);

    // Remove from main list
    m_todos.removeAt(actualIndex);

    // Update filtered indices (all indices >= actualIndex need to be decremented)
    for (int i = 0; i < m_filteredIndices.size(); ++i) {
        if (m_filteredIndices[i] > actualIndex) {
            m_filteredIndices[i]--;
        }
    }

    endRemoveRows();

    emit todoRemoved(removedId);
    emit countsChanged();
    saveToStorage();
    return true;
}

/**
 * @brief Remove a todo by ID
 */
bool TodoModel::removeTodoById(const QString& id)
{
    for (int i = 0; i < m_filteredIndices.size(); ++i) {
        int actualIndex = getActualIndex(i);
        if (actualIndex >= 0 && m_todos[actualIndex].getId() == id) {
            return removeTodo(i);
        }
    }
    return false;
}

/**
 * @brief Toggle completion status by index
 */
bool TodoModel::toggleTodo(const QModelIndex& index)
{
    if (!index.isValid())
        return false;

    return toggleTodo(index.row());
}

/**
 * @brief Toggle completion status by row
 */
bool TodoModel::toggleTodo(int row)
{
    if (row < 0 || row >= m_filteredIndices.size())
        return false;

    int actualIndex = getActualIndex(row);
    if (actualIndex < 0 || actualIndex >= m_todos.size())
        return false;

    m_todos[actualIndex].toggleCompleted();

    // Check if item still passes filter after toggle
    if (!passesFilter(m_todos[actualIndex])) {
        // Item no longer passes filter, remove it from filtered view
        beginRemoveRows(QModelIndex(), row, row);
        m_filteredIndices.removeAt(row);
        endRemoveRows();
    } else {
        // Item still passes filter, just update the data
        QModelIndex idx = index(row, 0);
        emit dataChanged(idx, idx);
    }

    emit todoUpdated(m_todos[actualIndex]);
    emit countsChanged();
    saveToStorage();
    return true;
}

/**
 * @brief Update todo title
 */
bool TodoModel::updateTodoTitle(const QModelIndex& index, const QString& newTitle)
{
    if (newTitle.trimmed().isEmpty())
        return false;

    return setData(index, newTitle.trimmed(), TitleRole);
}

/**
 * @brief Update todo priority
 */
bool TodoModel::updateTodoPriority(const QModelIndex& index, TodoItem::Priority priority)
{
    return setData(index, static_cast<int>(priority), PriorityRole);
}

/**
 * @brief Get todo item by index
 */
TodoItem TodoModel::getTodoItem(const QModelIndex& index) const
{
    if (!index.isValid())
        return TodoItem();

    return getTodoItem(index.row());
}

/**
 * @brief Get todo item by row
 */
TodoItem TodoModel::getTodoItem(int row) const
{
    if (row < 0 || row >= m_filteredIndices.size())
        return TodoItem();

    int actualIndex = getActualIndex(row);
    if (actualIndex < 0 || actualIndex >= m_todos.size())
        return TodoItem();

    return m_todos.at(actualIndex);
}

/**
 * @brief Clear all completed todos
 */
int TodoModel::clearCompleted()
{
    int removedCount = 0;

    // Remove in reverse order to avoid index issues
    for (int i = m_filteredIndices.size() - 1; i >= 0; --i) {
        int actualIndex = getActualIndex(i);
        if (actualIndex >= 0 && actualIndex < m_todos.size()) {
            if (m_todos[actualIndex].isCompleted()) {
                removeTodo(i);
                removedCount++;
            }
        }
    }

    return removedCount;
}

/**
 * @brief Clear all todos
 */
void TodoModel::clearAll()
{
    beginResetModel();
    m_todos.clear();
    m_filteredIndices.clear();
    endResetModel();

    emit countsChanged();
    saveToStorage();
}

/**
 * @brief Set filter mode
 */
void TodoModel::setFilterMode(FilterMode mode)
{
    if (m_filterMode == mode)
        return;

    m_filterMode = mode;
    updateFilteredIndices();
    emit filterModeChanged(mode);
}

/**
 * @brief Get count of active todos
 */
int TodoModel::activeCount() const
{
    return std::count_if(m_todos.begin(), m_todos.end(),
                         [](const TodoItem& item) { return !item.isCompleted(); });
}

/**
 * @brief Get count of completed todos
 */
int TodoModel::completedCount() const
{
    return std::count_if(m_todos.begin(), m_todos.end(),
                         [](const TodoItem& item) { return item.isCompleted(); });
}

/**
 * @brief Load todos from storage
 */
bool TodoModel::loadFromStorage()
{
    QVector<TodoItem> loadedTodos = m_storage->loadTodos();

    beginResetModel();
    m_todos = loadedTodos;
    updateFilteredIndices();
    endResetModel();

    emit countsChanged();
    return true;
}

/**
 * @brief Save todos to storage
 */
bool TodoModel::saveToStorage()
{
    return m_storage->saveTodos(m_todos);
}

/**
 * @brief Update filtered indices based on current filter
 */
void TodoModel::updateFilteredIndices()
{
    beginResetModel();
    m_filteredIndices.clear();

    for (int i = 0; i < m_todos.size(); ++i) {
        if (passesFilter(m_todos[i])) {
            m_filteredIndices.append(i);
        }
    }

    endResetModel();
}

/**
 * @brief Check if a todo passes the current filter
 */
bool TodoModel::passesFilter(const TodoItem& item) const
{
    switch (m_filterMode) {
        case FilterMode::All:
            return true;
        case FilterMode::Active:
            return !item.isCompleted();
        case FilterMode::Completed:
            return item.isCompleted();
        default:
            return true;
    }
}

/**
 * @brief Get actual index from filtered row
 */
int TodoModel::getActualIndex(int filteredRow) const
{
    if (filteredRow < 0 || filteredRow >= m_filteredIndices.size())
        return -1;

    return m_filteredIndices[filteredRow];
}
