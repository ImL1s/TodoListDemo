/**
 * @file TodoModel.h
 * @brief Qt Model for Todo Items
 *
 * This file defines the TodoModel class which extends QAbstractListModel
 * to provide a model for managing todo items in Qt's Model/View architecture.
 */

#ifndef TODOMODEL_H
#define TODOMODEL_H

#include <QAbstractListModel>
#include <QVector>
#include <memory>
#include "TodoItem.h"

class StorageManager;

/**
 * @class TodoModel
 * @brief Model class for managing todo items in Qt's Model/View architecture
 *
 * This class provides the data model for todo items, implementing the
 * QAbstractListModel interface. It supports:
 * - CRUD operations on todo items
 * - Filtering (All/Active/Completed)
 * - Custom roles for data access
 * - Signals for data changes
 * - Persistence through StorageManager
 *
 * The model follows Qt's Model/View programming paradigm and emits
 * appropriate signals when data changes.
 */
class TodoModel : public QAbstractListModel
{
    Q_OBJECT

public:
    /**
     * @enum TodoRoles
     * @brief Custom roles for accessing todo item data
     */
    enum TodoRoles {
        TitleRole = Qt::UserRole + 1,  ///< Todo title/text
        CompletedRole,                 ///< Completion status
        PriorityRole,                  ///< Priority level
        PriorityStringRole,            ///< Priority as string
        CreatedAtRole,                 ///< Creation timestamp
        ModifiedAtRole,                ///< Modification timestamp
        CategoryRole,                  ///< Category/tag
        IdRole                         ///< Unique identifier
    };

    /**
     * @enum FilterMode
     * @brief Filter modes for displaying todos
     */
    enum class FilterMode {
        All,        ///< Show all todos
        Active,     ///< Show only incomplete todos
        Completed   ///< Show only completed todos
    };
    Q_ENUM(FilterMode)

    /**
     * @brief Constructor
     * @param parent Parent QObject
     */
    explicit TodoModel(QObject *parent = nullptr);

    /**
     * @brief Destructor
     */
    ~TodoModel() override;

    // QAbstractListModel interface implementation
    int rowCount(const QModelIndex &parent = QModelIndex()) const override;
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const override;
    bool setData(const QModelIndex &index, const QVariant &value, int role = Qt::EditRole) override;
    Qt::ItemFlags flags(const QModelIndex &index) const override;
    QHash<int, QByteArray> roleNames() const override;

    /**
     * @brief Add a new todo item
     * @param title Todo title
     * @param priority Priority level (default: Normal)
     * @return true if successful
     */
    bool addTodo(const QString& title, TodoItem::Priority priority = TodoItem::Priority::Normal);

    /**
     * @brief Add a todo item object
     * @param item TodoItem to add
     * @return true if successful
     */
    bool addTodo(const TodoItem& item);

    /**
     * @brief Remove a todo item by index
     * @param index Model index of the item to remove
     * @return true if successful
     */
    bool removeTodo(const QModelIndex& index);

    /**
     * @brief Remove a todo item by row
     * @param row Row number of the item to remove
     * @return true if successful
     */
    bool removeTodo(int row);

    /**
     * @brief Remove a todo item by ID
     * @param id Unique identifier of the item to remove
     * @return true if successful
     */
    bool removeTodoById(const QString& id);

    /**
     * @brief Toggle completion status of a todo item
     * @param index Model index of the item
     * @return true if successful
     */
    bool toggleTodo(const QModelIndex& index);

    /**
     * @brief Toggle completion status by row
     * @param row Row number of the item
     * @return true if successful
     */
    bool toggleTodo(int row);

    /**
     * @brief Update todo title
     * @param index Model index of the item
     * @param newTitle New title
     * @return true if successful
     */
    bool updateTodoTitle(const QModelIndex& index, const QString& newTitle);

    /**
     * @brief Update todo priority
     * @param index Model index of the item
     * @param priority New priority
     * @return true if successful
     */
    bool updateTodoPriority(const QModelIndex& index, TodoItem::Priority priority);

    /**
     * @brief Get a todo item by index
     * @param index Model index
     * @return TodoItem if found, default TodoItem otherwise
     */
    TodoItem getTodoItem(const QModelIndex& index) const;

    /**
     * @brief Get a todo item by row
     * @param row Row number
     * @return TodoItem if found, default TodoItem otherwise
     */
    TodoItem getTodoItem(int row) const;

    /**
     * @brief Clear all completed todos
     * @return Number of items removed
     */
    int clearCompleted();

    /**
     * @brief Remove all todos
     */
    void clearAll();

    /**
     * @brief Set filter mode
     * @param mode Filter mode to apply
     */
    void setFilterMode(FilterMode mode);

    /**
     * @brief Get current filter mode
     * @return Current filter mode
     */
    FilterMode getFilterMode() const { return m_filterMode; }

    /**
     * @brief Get total count of all todos (ignoring filter)
     * @return Total todo count
     */
    int totalCount() const { return m_todos.size(); }

    /**
     * @brief Get count of active todos
     * @return Active todo count
     */
    int activeCount() const;

    /**
     * @brief Get count of completed todos
     * @return Completed todo count
     */
    int completedCount() const;

    /**
     * @brief Load todos from storage
     * @return true if successful
     */
    bool loadFromStorage();

    /**
     * @brief Save todos to storage
     * @return true if successful
     */
    bool saveToStorage();

signals:
    /**
     * @brief Emitted when a todo is added
     * @param item The added todo item
     */
    void todoAdded(const TodoItem& item);

    /**
     * @brief Emitted when a todo is removed
     * @param id ID of the removed todo
     */
    void todoRemoved(const QString& id);

    /**
     * @brief Emitted when a todo is updated
     * @param item The updated todo item
     */
    void todoUpdated(const TodoItem& item);

    /**
     * @brief Emitted when filter mode changes
     * @param mode New filter mode
     */
    void filterModeChanged(FilterMode mode);

    /**
     * @brief Emitted when todo counts change
     */
    void countsChanged();

private:
    QVector<TodoItem> m_todos;              ///< All todo items
    QVector<int> m_filteredIndices;         ///< Indices of filtered items
    FilterMode m_filterMode;                ///< Current filter mode
    std::unique_ptr<StorageManager> m_storage; ///< Storage manager

    /**
     * @brief Update filtered indices based on current filter mode
     */
    void updateFilteredIndices();

    /**
     * @brief Check if a todo item passes the current filter
     * @param item Todo item to check
     * @return true if item passes filter
     */
    bool passesFilter(const TodoItem& item) const;

    /**
     * @brief Get the actual index in m_todos from filtered row
     * @param filteredRow Row in filtered view
     * @return Actual index in m_todos vector, or -1 if invalid
     */
    int getActualIndex(int filteredRow) const;
};

#endif // TODOMODEL_H
