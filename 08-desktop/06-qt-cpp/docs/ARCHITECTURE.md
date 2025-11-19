# Qt Todo List - Architecture Documentation

This document provides a comprehensive architectural overview of the Qt Todo List application, detailing design decisions, patterns, component interactions, and implementation strategies.

## Table of Contents

- [Architectural Overview](#architectural-overview)
- [MVVM Pattern Implementation](#mvvm-pattern-implementation)
- [Component Design](#component-design)
- [Data Flow](#data-flow)
- [Class Diagrams](#class-diagrams)
- [Sequence Diagrams](#sequence-diagrams)
- [Design Patterns](#design-patterns)
- [Threading Model](#threading-model)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)
- [Extensibility](#extensibility)

---

## Architectural Overview

### High-Level Architecture

The Qt Todo List application follows a **Model-View-ViewModel (MVVM)** architectural pattern, enhanced with Qt's Model/View framework:

```
┌──────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐         ┌──────────────────┐               │
│  │  main.cpp       │────────►│  QApplication    │               │
│  │  Entry Point    │         │  Event Loop      │               │
│  └─────────────────┘         └──────────────────┘               │
│           │                            │                         │
│           ▼                            ▼                         │
│  ┌──────────────────────────────────────────────────┐           │
│  │            PRESENTATION LAYER (View)             │           │
│  │  ┌────────────────────────────────────────────┐  │           │
│  │  │         MainWindow (QMainWindow)           │  │           │
│  │  │  - UI Components (widgets)                 │  │           │
│  │  │  - User interaction handling               │  │           │
│  │  │  - Theme management                        │  │           │
│  │  │  - Window state persistence                │  │           │
│  │  └────────────────────────────────────────────┘  │           │
│  └──────────────────────────────────────────────────┘           │
│                        │           ▲                             │
│                        │ Commands  │ Notifications               │
│                        ▼           │ (Signals)                   │
│  ┌──────────────────────────────────────────────────┐           │
│  │          VIEW-MODEL LAYER (ViewModel)            │           │
│  │  ┌────────────────────────────────────────────┐  │           │
│  │  │       TodoModel (QAbstractListModel)       │  │           │
│  │  │  - Data collection management              │  │           │
│  │  │  - Business logic (CRUD operations)        │  │           │
│  │  │  - Filtering logic                         │  │           │
│  │  │  - Model/View protocol implementation      │  │           │
│  │  │  - Signal emissions for state changes      │  │           │
│  │  └────────────────────────────────────────────┘  │           │
│  └──────────────────────────────────────────────────┘           │
│                        │           ▲                             │
│                        │ Operations│ Data                        │
│                        ▼           │                             │
│  ┌──────────────────────────────────────────────────┐           │
│  │              MODEL LAYER (Model)                 │           │
│  │  ┌────────────────────────────────────────────┐  │           │
│  │  │            TodoItem                        │  │           │
│  │  │  - Data structure                          │  │           │
│  │  │  - Business rules                          │  │           │
│  │  │  - Serialization/Deserialization           │  │           │
│  │  │  - Validation                              │  │           │
│  │  └────────────────────────────────────────────┘  │           │
│  └──────────────────────────────────────────────────┘           │
│                        │           ▲                             │
│                        │ Save/Load │                             │
│                        ▼           │                             │
│  ┌──────────────────────────────────────────────────┐           │
│  │          PERSISTENCE LAYER                       │           │
│  │  ┌────────────────────────────────────────────┐  │           │
│  │  │         StorageManager                     │  │           │
│  │  │  - QSettings (JSON format)                 │  │           │
│  │  │  - SQLite support (optional)               │  │           │
│  │  │  - Import/Export (JSON files)              │  │           │
│  │  │  - Data integrity                          │  │           │
│  │  └────────────────────────────────────────────┘  │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Layered Architecture

1. **Presentation Layer** (MainWindow)
   - Handles all UI rendering and user interactions
   - No business logic
   - Delegates operations to ViewModel
   - Responds to ViewModel notifications

2. **ViewModel Layer** (TodoModel)
   - Implements Qt's Model/View protocol
   - Contains presentation logic (filtering, sorting)
   - Manages data collection
   - Emits signals for state changes

3. **Model Layer** (TodoItem)
   - Pure data structures
   - Business logic (validation, toggles)
   - Serialization support
   - No UI dependencies

4. **Persistence Layer** (StorageManager)
   - Abstract storage interface
   - Multiple backend support
   - Data serialization/deserialization
   - Import/Export functionality

### Key Design Principles

1. **Separation of Concerns** - Each layer has a single, well-defined responsibility
2. **Dependency Injection** - Components receive dependencies via constructors
3. **Interface Segregation** - Small, focused interfaces (Qt's Model/View protocol)
4. **Single Responsibility** - Each class has one reason to change
5. **Open/Closed Principle** - Open for extension, closed for modification

---

## MVVM Pattern Implementation

### Model

**TodoItem** - Represents a single todo item:

```cpp
class TodoItem
{
public:
    // Data structure
    - QString m_id          // Unique identifier (UUID)
    - QString m_title       // Todo text
    - bool m_completed      // Completion status
    - Priority m_priority   // Priority level
    - QDateTime m_createdAt // Creation timestamp
    - QDateTime m_modifiedAt // Modification timestamp
    - QString m_category    // Category/tag

    // Business logic
    - toggleCompleted()     // Toggle completion
    - toJson()              // Serialize to JSON
    - fromJson()            // Deserialize from JSON
};
```

**Responsibilities**:
- Data encapsulation
- Business rules enforcement
- Serialization/deserialization
- Immutability guarantees (where applicable)

**Design Decisions**:
- UUID for unique identification (supports import/export)
- Timestamps for auditing
- Priority enum for type safety
- JSON serialization for portability

### ViewModel

**TodoModel** - Qt Model/View implementation:

```cpp
class TodoModel : public QAbstractListModel
{
    Q_OBJECT

public:
    // Qt Model/View protocol
    int rowCount(const QModelIndex& parent) const override;
    QVariant data(const QModelIndex& index, int role) const override;
    bool setData(const QModelIndex& index, const QVariant& value, int role) override;
    Qt::ItemFlags flags(const QModelIndex& index) const override;

    // Business operations
    bool addTodo(const QString& title, Priority priority);
    bool removeTodo(int row);
    bool toggleTodo(int row);
    int clearCompleted();

    // Filtering
    void setFilterMode(FilterMode mode);

    // Statistics
    int totalCount() const;
    int activeCount() const;
    int completedCount() const;

signals:
    void todoAdded(const TodoItem& item);
    void todoRemoved(const QString& id);
    void todoUpdated(const TodoItem& item);
    void countsChanged();

private:
    QVector<TodoItem> m_todos;              // All todos
    QVector<int> m_filteredIndices;         // Filtered view
    FilterMode m_filterMode;                // Current filter
    std::unique_ptr<StorageManager> m_storage;  // Persistence
};
```

**Responsibilities**:
- Manage todo collection
- Implement filtering logic
- Provide Qt Model/View interface
- Emit change notifications
- Coordinate with persistence layer

**Design Decisions**:
- Filtered indices separate from data (performance)
- Custom roles for rich data access
- Signal emissions for observer pattern
- Automatic persistence on changes
- QVector for performance and Qt integration

### View

**MainWindow** - Main application window:

```cpp
class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget* parent = nullptr);

private slots:
    // User actions
    void onAddTodo();
    void onRemoveTodo();
    void onToggleTodo();
    void onEditTodo();
    void onClearCompleted();

    // Filter actions
    void onFilterAll();
    void onFilterActive();
    void onFilterCompleted();

    // Model notifications
    void onCountsChanged();
    void onTodoAdded(const TodoItem& item);

private:
    // UI components
    QListView* m_listView;
    QLineEdit* m_inputEdit;
    QPushButton* m_addButton;
    // ... more widgets ...

    // ViewModel
    std::unique_ptr<TodoModel> m_model;

    // State
    bool m_isDarkTheme;
};
```

**Responsibilities**:
- Render UI components
- Handle user input
- Display model data
- Update statistics
- Manage application state (theme, window position)

**Design Decisions**:
- QListView for Model/View integration
- Signal/slot connections for loose coupling
- Smart pointer for model ownership
- Theme management via QSS
- Window state persistence via QSettings

---

## Component Design

### TodoItem Component

**Purpose**: Immutable-like data structure for todo items

**Key Features**:
```cpp
// Unique identification
QString m_id = QUuid::createUuid().toString();

// Modification tracking
void setTitle(const QString& title) {
    m_title = title;
    updateModifiedTime();  // Automatic timestamp update
}

// JSON serialization
QJsonObject toJson() const {
    QJsonObject json;
    json["id"] = m_id;
    json["title"] = m_title;
    json["completed"] = m_completed;
    json["priority"] = static_cast<int>(m_priority);
    json["createdAt"] = m_createdAt.toString(Qt::ISODate);
    return json;
}

// Type-safe priority
enum class Priority { Low, Normal, High, Urgent };
```

**Rationale**:
- UUID ensures uniqueness across imports
- Timestamps enable audit trails
- JSON format is human-readable and portable
- Enum provides type safety over integers

### TodoModel Component

**Purpose**: Bridge between data and view, implementing Qt's Model/View protocol

**Filtering Architecture**:
```cpp
// Dual storage strategy
QVector<TodoItem> m_todos;           // All todos (source of truth)
QVector<int> m_filteredIndices;     // Indices of visible todos

// Filtering algorithm
void updateFilteredIndices() {
    beginResetModel();
    m_filteredIndices.clear();

    for (int i = 0; i < m_todos.size(); ++i) {
        if (passesFilter(m_todos[i])) {
            m_filteredIndices.append(i);
        }
    }

    endResetModel();
}

// Access through filtered indices
QVariant data(const QModelIndex& index, int role) const override {
    int actualIndex = m_filteredIndices[index.row()];
    const TodoItem& item = m_todos.at(actualIndex);
    // ... return data based on role
}
```

**Rationale**:
- Filtered indices avoid data duplication
- O(1) access to visible items
- Easy to switch filters without data movement
- Clear separation between data and view

**Custom Roles**:
```cpp
enum TodoRoles {
    TitleRole = Qt::UserRole + 1,    // QString
    CompletedRole,                    // bool
    PriorityRole,                     // int
    PriorityStringRole,               // QString
    CreatedAtRole,                    // QDateTime
    ModifiedAtRole,                   // QDateTime
    CategoryRole,                     // QString
    IdRole                            // QString
};
```

**Rationale**:
- Rich data access for views
- Type-safe data retrieval
- Extensible for future roles
- QML integration support

### StorageManager Component

**Purpose**: Abstract persistence layer with multiple backend support

**Architecture**:
```cpp
class StorageManager
{
public:
    enum class StorageBackend {
        QSettingsJson,  // Default, cross-platform
        SQLite          // Optional, for large datasets
    };

    // Primary interface
    bool saveTodos(const QVector<TodoItem>& todos);
    QVector<TodoItem> loadTodos();

    // Import/Export
    static bool exportToJson(const QString& filePath, const QVector<TodoItem>& todos);
    static QVector<TodoItem> importFromJson(const QString& filePath);

private:
    // Backend-specific implementations
    bool saveWithQSettings(const QVector<TodoItem>& todos);
    QVector<TodoItem> loadWithQSettings();
    bool saveWithSQLite(const QVector<TodoItem>& todos);
    QVector<TodoItem> loadWithSQLite();
};
```

**Rationale**:
- Strategy pattern for storage backends
- QSettings for simplicity (default)
- SQLite for scalability (optional)
- Static methods for import/export (stateless)
- JSON format for human readability

**QSettings Implementation**:
```cpp
bool saveWithQSettings(const QVector<TodoItem>& todos) {
    QJsonArray todoArray;
    for (const auto& todo : todos) {
        todoArray.append(todo.toJson());
    }

    QJsonDocument doc(todoArray);
    QString jsonString = QString::fromUtf8(doc.toJson(QJsonDocument::Compact));

    m_settings->setValue("todos/data", jsonString);
    m_settings->setValue("todos/count", todos.size());
    m_settings->sync();

    return m_settings->status() == QSettings::NoError;
}
```

**Benefits**:
- Single storage key for all todos
- Compact JSON format
- Platform-specific locations
- Automatic backup on some platforms

---

## Data Flow

### Adding a Todo

```
User Input → MainWindow → TodoModel → TodoItem → StorageManager
    ↓            ↓            ↓           ↓            ↓
  Enter      onAddTodo()   addTodo()   create()   saveTodos()
             getText()     validate()  setProps()  toJson()
             clear()       append()               write()
                          signal()
                             ↓
                    todoAdded() signal
                             ↓
                    MainWindow::onTodoAdded()
                             ↓
                    updateStatistics()
```

**Detailed Flow**:

1. **User Input**
   - User types in QLineEdit
   - Presses Enter or clicks Add button

2. **MainWindow::onAddTodo()**
   ```cpp
   void MainWindow::onAddTodo() {
       QString title = m_inputEdit->text().trimmed();
       if (title.isEmpty()) {
           showError("Please enter a todo title");
           return;
       }

       Priority priority = getPriorityFromCombo();
       if (m_model->addTodo(title, priority)) {
           m_inputEdit->clear();
           statusBar()->showMessage("Todo added", 2000);
       }
   }
   ```

3. **TodoModel::addTodo()**
   ```cpp
   bool TodoModel::addTodo(const QString& title, Priority priority) {
       TodoItem newItem(title, false, priority);

       // Update model
       int row = m_todos.size();
       beginInsertRows(QModelIndex(), row, row);
       m_todos.append(newItem);
       endInsertRows();

       // Check filter
       if (passesFilter(newItem)) {
           int filteredRow = m_filteredIndices.size();
           beginInsertRows(QModelIndex(), filteredRow, filteredRow);
           m_filteredIndices.append(row);
           endInsertRows();
       }

       // Notify observers
       emit todoAdded(newItem);
       emit countsChanged();

       // Persist
       saveToStorage();

       return true;
   }
   ```

4. **StorageManager::saveTodos()**
   - Serializes all todos to JSON
   - Writes to QSettings or SQLite
   - Returns success status

5. **Signal Propagation**
   - `todoAdded()` signal emitted
   - MainWindow receives notification
   - Updates statistics in status bar

### Filtering Todos

```
User Action → MainWindow → TodoModel → View Update
     ↓            ↓            ↓            ↓
Click Filter  onFilterActive()  setFilterMode()  dataChanged()
              setChecked()      updateFiltered() repaint()
                               beginReset()
                               computeIndices()
                               endReset()
                                    ↓
                            filterModeChanged() signal
                                    ↓
                            MainWindow::updateUI()
```

**Detailed Flow**:

1. **User Action**
   - User clicks "Active" radio button

2. **MainWindow::onFilterActive()**
   ```cpp
   void MainWindow::onFilterActive() {
       m_model->setFilterMode(TodoModel::FilterMode::Active);
       m_filterActiveRadio->setChecked(true);
       statusBar()->showMessage("Showing active todos", 2000);
   }
   ```

3. **TodoModel::setFilterMode()**
   ```cpp
   void TodoModel::setFilterMode(FilterMode mode) {
       if (m_filterMode == mode)
           return;

       m_filterMode = mode;
       updateFilteredIndices();
       emit filterModeChanged(mode);
   }
   ```

4. **TodoModel::updateFilteredIndices()**
   ```cpp
   void TodoModel::updateFilteredIndices() {
       beginResetModel();  // Notify view: major change coming
       m_filteredIndices.clear();

       for (int i = 0; i < m_todos.size(); ++i) {
           if (passesFilter(m_todos[i])) {
               m_filteredIndices.append(i);
           }
       }

       endResetModel();  // Notify view: refresh everything
   }
   ```

5. **View Update**
   - QListView receives model reset notification
   - Queries new row count
   - Re-renders visible items
   - Updates scrollbars

### Toggling a Todo

```
User Action → MainWindow → TodoModel → TodoItem → StorageManager
     ↓            ↓            ↓           ↓            ↓
Double-Click  onToggle()   toggleTodo() toggle()   saveTodos()
Space Key     getIndex()   setData()    setModified()
                          dataChanged()
                          signal()
                             ↓
                      todoUpdated() signal
                             ↓
                      MainWindow::onTodoUpdated()
                             ↓
                      updateStatistics()
```

---

## Class Diagrams

### Core Classes

```
┌─────────────────────────┐
│      QMainWindow        │
└──────────▲──────────────┘
           │
           │ inherits
           │
┌──────────┴──────────────┐
│      MainWindow         │
├─────────────────────────┤
│ - m_listView: QListView*│
│ - m_model: unique_ptr   │
│ - m_isDarkTheme: bool   │
├─────────────────────────┤
│ + MainWindow()          │
│ + ~MainWindow()         │
│ - onAddTodo()           │
│ - onRemoveTodo()        │
│ - onToggleTodo()        │
│ - applyTheme()          │
└─────────────────────────┘
           │
           │ owns
           ▼
┌─────────────────────────┐
│ QAbstractListModel      │
└──────────▲──────────────┘
           │
           │ inherits
           │
┌──────────┴──────────────┐
│      TodoModel          │
├─────────────────────────┤
│ - m_todos: QVector      │
│ - m_filteredIndices     │
│ - m_filterMode: enum    │
│ - m_storage: unique_ptr │
├─────────────────────────┤
│ + rowCount(): int       │
│ + data(): QVariant      │
│ + addTodo(): bool       │
│ + removeTodo(): bool    │
│ + toggleTodo(): bool    │
│ + setFilterMode()       │
├─────────────────────────┤
│ signals:                │
│ + todoAdded()           │
│ + todoRemoved()         │
│ + countsChanged()       │
└─────────────────────────┘
           │
           │ contains
           ▼
┌─────────────────────────┐
│      TodoItem           │
├─────────────────────────┤
│ - m_id: QString         │
│ - m_title: QString      │
│ - m_completed: bool     │
│ - m_priority: Priority  │
│ - m_createdAt: QDateTime│
├─────────────────────────┤
│ + TodoItem()            │
│ + getTitle(): QString   │
│ + isCompleted(): bool   │
│ + toggleCompleted()     │
│ + toJson(): QJsonObject │
│ + fromJson(): TodoItem  │
└─────────────────────────┘
```

### Relationships

```
MainWindow ◆────────── TodoModel
           (composition)

TodoModel  ◇────────── TodoItem
           (aggregation)

TodoModel  ◆────────── StorageManager
           (composition)

MainWindow ─────uses──► StorageManager
           (for import/export)
```

---

## Sequence Diagrams

### Adding a Todo

```
User    MainWindow    TodoModel    TodoItem    StorageManager
 │           │            │            │              │
 │  Enter    │            │            │              │
 │──────────►│            │            │              │
 │           │ addTodo()  │            │              │
 │           │───────────►│            │              │
 │           │            │ create     │              │
 │           │            │───────────►│              │
 │           │            │            │              │
 │           │            │◄───────────│              │
 │           │            │  TodoItem  │              │
 │           │            │            │              │
 │           │            │ append()   │              │
 │           │            │────┐       │              │
 │           │            │    │       │              │
 │           │            │◄───┘       │              │
 │           │            │            │              │
 │           │            │ saveTodos()│              │
 │           │            │────────────────────────►  │
 │           │            │            │              │
 │           │            │            │ toJson()     │
 │           │            │            │◄─────────────│
 │           │            │            │              │
 │           │            │            │ write()      │
 │           │            │            │──────────────┤
 │           │            │            │              │
 │           │            │◄──────────────────────────│
 │           │            │     true                  │
 │           │            │                           │
 │           │  signal:   │                           │
 │           │ todoAdded()│                           │
 │           │◄───────────│                           │
 │           │            │                           │
 │  update   │            │                           │
 │◄──────────│            │                           │
 │  display  │            │                           │
```

---

## Design Patterns

### 1. Model-View-ViewModel (MVVM)

**Implementation**:
- **Model**: TodoItem
- **ViewModel**: TodoModel
- **View**: MainWindow

**Benefits**:
- Clear separation of concerns
- Testability (can test ViewModel without UI)
- Multiple views possible
- Business logic centralized

### 2. Observer (Signals & Slots)

**Implementation**:
```cpp
// Observable (TodoModel)
signals:
    void todoAdded(const TodoItem& item);
    void todoRemoved(const QString& id);

// Observer (MainWindow)
connect(model, &TodoModel::todoAdded,
        this, &MainWindow::onTodoAdded);
```

**Benefits**:
- Loose coupling
- Dynamic subscription
- Type-safe callbacks
- Automatic cleanup

### 3. Strategy (Storage Backends)

**Implementation**:
```cpp
enum class StorageBackend {
    QSettingsJson,
    SQLite
};

// Strategy selection
StorageManager(StorageBackend backend);

// Strategy execution
bool saveTodos(const QVector<TodoItem>& todos) {
    switch (m_backend) {
        case QSettingsJson:
            return saveWithQSettings(todos);
        case SQLite:
            return saveWithSQLite(todos);
    }
}
```

**Benefits**:
- Interchangeable algorithms
- Easy to add new backends
- Runtime selection
- Testability

### 4. Factory (TodoItem Creation)

**Implementation**:
```cpp
// Factory method for JSON deserialization
static TodoItem fromJson(const QJsonObject& json) {
    TodoItem item;
    item.m_id = json["id"].toString();
    item.m_title = json["title"].toString();
    item.m_completed = json["completed"].toBool();
    // ...
    return item;
}
```

**Benefits**:
- Encapsulated creation logic
- Consistent object construction
- Easy to modify creation process

### 5. Template Method (QAbstractListModel)

**Implementation**:
```cpp
// Template defined by Qt
class QAbstractListModel {
    // Template method
    void fetchMore(const QModelIndex& parent) final {
        if (canFetchMore(parent)) {
            doFetchMore(parent);
        }
    }

    // Hook methods (overridden by TodoModel)
    virtual int rowCount(const QModelIndex&) const = 0;
    virtual QVariant data(const QModelIndex&, int) const = 0;
};

// TodoModel overrides hooks
class TodoModel : public QAbstractListModel {
    int rowCount(const QModelIndex&) const override;
    QVariant data(const QModelIndex&, int) const override;
};
```

**Benefits**:
- Consistent behavior
- Extensibility through hooks
- Framework integration

---

## Threading Model

### Single-Threaded Design

This application uses a **single-threaded model** for simplicity:

```cpp
// Main thread (UI thread)
int main(int argc, char* argv[]) {
    QApplication app(argc, argv);
    MainWindow window;
    window.show();
    return app.exec();  // Event loop on main thread
}
```

**Rationale**:
- Simple, deterministic behavior
- No threading synchronization needed
- Suitable for small datasets
- UI operations must be on main thread anyway

### Potential Multi-Threading Extensions

For large datasets, consider:

**Background Storage**:
```cpp
// Save on worker thread
QFuture<bool> future = QtConcurrent::run([this, todos]() {
    return m_storage->saveTodos(todos);
});

// Notify when done
auto* watcher = new QFutureWatcher<bool>(this);
connect(watcher, &QFutureWatcher<bool>::finished, this, [watcher]() {
    bool success = watcher->result();
    // Update UI
});
watcher->setFuture(future);
```

**Background Filtering**:
```cpp
// Filter large datasets on worker thread
QFuture<QVector<int>> future = QtConcurrent::filtered(
    m_todos,
    [this](const TodoItem& item) { return passesFilter(item); }
);
```

---

## Error Handling

### Validation

**Input Validation**:
```cpp
bool TodoModel::addTodo(const QString& title, Priority priority) {
    // Validate input
    if (title.trimmed().isEmpty()) {
        qWarning() << "Cannot add todo with empty title";
        return false;
    }

    // ... add todo
    return true;
}
```

**Storage Error Handling**:
```cpp
bool StorageManager::saveTodos(const QVector<TodoItem>& todos) {
    try {
        // Attempt save
        m_settings->setValue("todos/data", jsonString);
        m_settings->sync();

        // Check for errors
        if (m_settings->status() != QSettings::NoError) {
            qCritical() << "Failed to save settings:" << m_settings->status();
            return false;
        }

        return true;
    } catch (const std::exception& e) {
        qCritical() << "Exception during save:" << e.what();
        return false;
    }
}
```

### User Feedback

**Error Dialogs**:
```cpp
void MainWindow::showError(const QString& message) {
    QMessageBox::critical(this, tr("Error"), message);
}

void MainWindow::showInfo(const QString& message) {
    QMessageBox::information(this, tr("Information"), message);
}
```

**Status Bar Messages**:
```cpp
statusBar()->showMessage("Operation failed", 3000);  // 3 seconds
```

---

## Performance Considerations

### Filtering Optimization

**Filtered Indices Strategy**:
```cpp
// ✅ GOOD: O(n) filter, O(1) access
QVector<int> m_filteredIndices;

void updateFilteredIndices() {
    m_filteredIndices.clear();
    for (int i = 0; i < m_todos.size(); ++i) {
        if (passesFilter(m_todos[i])) {
            m_filteredIndices.append(i);
        }
    }
}

QVariant data(const QModelIndex& index, int role) const {
    int actualIndex = m_filteredIndices[index.row()];  // O(1)
    return m_todos[actualIndex].getTitle();
}

// ❌ BAD: O(n) filter on every access
QVariant data(const QModelIndex& index, int role) const {
    int count = 0;
    for (const auto& todo : m_todos) {
        if (passesFilter(todo)) {
            if (count == index.row()) {
                return todo.getTitle();
            }
            count++;
        }
    }
}
```

### Model Update Notifications

**Granular Updates**:
```cpp
// ✅ GOOD: Update only changed item
QModelIndex idx = index(row, 0);
emit dataChanged(idx, idx, {role});

// ❌ BAD: Reset entire model
beginResetModel();
// ... small change ...
endResetModel();
```

### JSON Serialization

**Compact Format**:
```cpp
// Use compact JSON for storage
QJsonDocument doc(todoArray);
QString jsonString = doc.toJson(QJsonDocument::Compact);

// Use indented JSON for export (human-readable)
QFile file("export.json");
file.write(doc.toJson(QJsonDocument::Indented));
```

---

## Extensibility

### Adding New Features

**Undo/Redo**:
```cpp
class TodoModel : public QAbstractListModel {
private:
    QUndoStack* m_undoStack;

public:
    void addTodo(const QString& title) {
        auto* command = new AddTodoCommand(this, title);
        m_undoStack->push(command);
    }

    void undo() { m_undoStack->undo(); }
    void redo() { m_undoStack->redo(); }
};
```

**Tags/Categories**:
```cpp
// Add to TodoItem
QStringList m_tags;

// Add to TodoModel
QMap<QString, QVector<int>> m_tagIndex;

void filterByTag(const QString& tag) {
    if (m_tagIndex.contains(tag)) {
        m_filteredIndices = m_tagIndex[tag];
        // ... emit signals
    }
}
```

**Due Dates**:
```cpp
// Add to TodoItem
QDate m_dueDate;
bool m_hasDueDate;

// Add to TodoModel
QVector<int> getOverdueTodos() const {
    QVector<int> overdue;
    QDate today = QDate::currentDate();
    for (int i = 0; i < m_todos.size(); ++i) {
        if (m_todos[i].hasDueDate() && m_todos[i].dueDate() < today) {
            overdue.append(i);
        }
    }
    return overdue;
}
```

---

## Conclusion

This architecture provides:

- ✅ **Clear separation of concerns** through MVVM
- ✅ **Loose coupling** via signals/slots
- ✅ **Extensibility** through well-defined interfaces
- ✅ **Testability** with isolated components
- ✅ **Performance** with optimized filtering
- ✅ **Maintainability** through design patterns

The design is production-ready and serves as a solid foundation for Qt desktop applications.

**Related Documentation**:
- [README.md](README.md) - Project overview and features
- [BUILD_GUIDE.md](BUILD_GUIDE.md) - Build instructions
- [QT_CONCEPTS.md](QT_CONCEPTS.md) - Qt framework concepts
