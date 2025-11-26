# Qt Framework - Core Concepts and Patterns

This document provides an in-depth explanation of Qt's core concepts, mechanisms, and design patterns as demonstrated in the Qt Todo List application. It serves as both a learning resource and reference guide for understanding Qt development.

## Table of Contents

- [Introduction to Qt](#introduction-to-qt)
- [The Meta-Object System](#the-meta-object-system)
- [Signals and Slots](#signals-and-slots)
- [Qt Object Model](#qt-object-model)
- [Model/View Architecture](#modelview-architecture)
- [Event System](#event-system)
- [Resource System](#resource-system)
- [Memory Management](#memory-management)
- [Qt Widgets](#qt-widgets)
- [Settings and Persistence](#settings-and-persistence)
- [Best Practices](#best-practices)

---

## Introduction to Qt

### What is Qt?

Qt is a comprehensive C++ application framework for developing cross-platform applications. It provides:

- **Cross-platform abstraction** - Write once, compile anywhere
- **Rich widget library** - Native-looking UI components
- **Event-driven programming** - Signals and slots mechanism
- **Extensive modules** - Networking, databases, multimedia, etc.
- **Modern C++ integration** - Works seamlessly with C++11/14/17/20

### Qt Philosophy

Qt follows several key design principles:

1. **Ease of Use** - Intuitive APIs and consistent naming
2. **Extensibility** - Easy to extend and customize
3. **Cross-platform** - Platform-independent code
4. **Performance** - Optimized for speed and memory
5. **Documentation** - Comprehensive, well-documented APIs

### Qt in This Application

Our Todo List app demonstrates:
- Widgets for UI (QMainWindow, QListView, etc.)
- Model/View for data separation (QAbstractListModel)
- Signals/Slots for event handling
- QSettings for persistence
- QJsonDocument for serialization
- Resource system for assets

---

## The Meta-Object System

### Overview

The Meta-Object System is Qt's extension to C++ that provides:

- **Run-time type information** (RTTI)
- **Dynamic property system**
- **Signal and slot mechanism**
- **Event handling**
- **Introspection capabilities**

### Meta-Object Compiler (MOC)

MOC is a code generator that processes Qt-specific C++ extensions:

```cpp
class TodoModel : public QAbstractListModel
{
    Q_OBJECT  // This macro enables meta-object features

public:
    // Regular C++ code

signals:
    void todoAdded(const TodoItem& item);  // Signal declaration

public slots:
    void addTodo(const QString& title);    // Slot declaration
};
```

**What MOC Does**:
1. Parses C++ headers looking for `Q_OBJECT` macro
2. Generates `moc_todomodel.cpp` with meta-object code
3. Implements signal/slot machinery
4. Creates property introspection data
5. Enables dynamic invocation

**Build Process**:
```
TodoModel.h → MOC → moc_TodoModel.cpp → Compiler → Object files → Linker → Executable
```

### Q_OBJECT Macro

The `Q_OBJECT` macro must be present in classes that:
- Define signals or slots
- Use Qt's property system
- Need meta-object features
- Inherit from QObject

**Correct Usage**:
```cpp
class MyWidget : public QWidget
{
    Q_OBJECT  // Must be first in class body, private section

public:
    MyWidget(QWidget* parent = nullptr);
};
```

**Common Mistakes**:
```cpp
// ❌ WRONG: Q_OBJECT in .cpp file
// ❌ WRONG: Q_OBJECT after public/protected/private
// ❌ WRONG: Q_OBJECT in template classes (use Q_GADGET instead)
```

### Properties

Qt's property system provides introspection and data binding:

```cpp
class TodoItem : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString title READ getTitle WRITE setTitle NOTIFY titleChanged)
    Q_PROPERTY(bool completed READ isCompleted WRITE setCompleted NOTIFY completedChanged)

public:
    QString getTitle() const { return m_title; }
    void setTitle(const QString& title) {
        if (m_title != title) {
            m_title = title;
            emit titleChanged(m_title);
        }
    }

signals:
    void titleChanged(const QString& newTitle);
    void completedChanged(bool newStatus);

private:
    QString m_title;
};
```

**Benefits**:
- Dynamic property access
- Data binding in QML
- Serialization/deserialization
- Integration with designer tools

---

## Signals and Slots

### Concept

Signals and Slots implement the **Observer pattern** in a type-safe, flexible way.

- **Signal** - Emitted when an event occurs
- **Slot** - Function called in response to signal
- **Connection** - Links signal to slot(s)

### How It Works

```cpp
// Signal declaration (in header)
class TodoModel : public QAbstractListModel
{
    Q_OBJECT
signals:
    void todoAdded(const TodoItem& item);  // Declaration only, no implementation
};

// Emitting a signal (in source)
void TodoModel::addTodo(const TodoItem& item)
{
    m_todos.append(item);
    emit todoAdded(item);  // Notify all connected slots
}

// Slot declaration
class MainWindow : public QMainWindow
{
    Q_OBJECT
public slots:
    void onTodoAdded(const TodoItem& item);  // Regular member function
};

// Connecting signal to slot
MainWindow::MainWindow()
{
    connect(model, &TodoModel::todoAdded,
            this, &MainWindow::onTodoAdded);
}
```

### Connection Syntax

Qt supports multiple connection syntaxes:

#### Modern Syntax (Qt 5+, Recommended)

```cpp
// Connect signal to slot (type-safe, compile-time checked)
connect(sender, &Sender::signalName,
        receiver, &Receiver::slotName);

// Connect to lambda
connect(button, &QPushButton::clicked, this, [this]() {
    qDebug() << "Button clicked!";
});

// Connect to functor
connect(button, &QPushButton::clicked, this, &MyClass::myFunction);
```

**Advantages**:
- Compile-time type checking
- Refactoring-friendly (IDE support)
- Lambda support
- Better error messages

#### Old Syntax (Qt 4, Still Supported)

```cpp
// Using SIGNAL() and SLOT() macros
connect(sender, SIGNAL(signalName(QString)),
        receiver, SLOT(slotName(QString)));
```

**Disadvantages**:
- No compile-time checking
- Typos caught only at runtime
- String-based, fragile

### Connection Types

```cpp
// Direct connection (same thread, immediate call)
connect(sender, &Sender::signal, receiver, &Receiver::slot, Qt::DirectConnection);

// Queued connection (different threads, event loop)
connect(sender, &Sender::signal, receiver, &Receiver::slot, Qt::QueuedConnection);

// Auto connection (Qt decides based on thread affinity)
connect(sender, &Sender::signal, receiver, &Receiver::slot, Qt::AutoConnection);

// Blocking queued (cross-thread synchronous call)
connect(sender, &Sender::signal, receiver, &Receiver::slot, Qt::BlockingQueuedConnection);
```

### Signal/Slot Features

**One Signal, Multiple Slots**:
```cpp
connect(model, &TodoModel::todoAdded, view1, &View::refresh);
connect(model, &TodoModel::todoAdded, view2, &View::refresh);
connect(model, &TodoModel::todoAdded, logger, &Logger::log);
```

**Signal to Signal**:
```cpp
// Chain signals
connect(model, &TodoModel::todoAdded, this, &MainWindow::dataChanged);
```

**Disconnect**:
```cpp
// Disconnect specific connection
disconnect(model, &TodoModel::todoAdded, this, &MainWindow::onTodoAdded);

// Disconnect all from sender
disconnect(model, nullptr, nullptr, nullptr);

// Disconnect all from receiver
disconnect(nullptr, nullptr, this, nullptr);
```

**Return Values**:
```cpp
// Connections are identified by QMetaObject::Connection
QMetaObject::Connection conn = connect(sender, &Sender::signal,
                                       receiver, &Receiver::slot);

// Can be used to disconnect later
disconnect(conn);
```

### Practical Example from Todo App

```cpp
// In MainWindow constructor
void MainWindow::connectSignals()
{
    // Input signals
    connect(m_addButton, &QPushButton::clicked,
            this, &MainWindow::onAddTodo);

    connect(m_inputEdit, &QLineEdit::returnPressed,
            this, &MainWindow::onAddTodo);

    // Model signals
    connect(m_model.get(), &TodoModel::todoAdded,
            this, &MainWindow::onTodoAdded);

    connect(m_model.get(), &TodoModel::countsChanged,
            this, &MainWindow::updateStatistics);

    // Lambda for inline handling
    connect(m_filterAllRadio, &QRadioButton::clicked, this, [this]() {
        m_model->setFilterMode(TodoModel::FilterMode::All);
    });
}
```

---

## Qt Object Model

### QObject Base Class

`QObject` is the base of all Qt objects, providing:

- **Object tree and ownership**
- **Signals and slots**
- **Event handling**
- **Timers**
- **Thread affinity**
- **Object naming and finding**

### Parent-Child Relationship

Qt implements automatic memory management through parent-child relationships:

```cpp
// Child is automatically deleted when parent is deleted
MainWindow* window = new MainWindow();  // No parent
QListView* list = new QListView(window);  // window is parent
QPushButton* button = new QPushButton(list);  // list is parent

// When window is deleted:
// 1. list is automatically deleted
// 2. button is automatically deleted
// No memory leaks!

delete window;  // Deletes entire object tree
```

**Rules**:
1. Parent must outlive children
2. Children deleted in reverse order of creation
3. Removing child from parent doesn't delete it
4. Setting new parent removes from old parent

### Object Naming and Finding

```cpp
// Set object name
QPushButton* button = new QPushButton("Click Me");
button->setObjectName("myButton");

// Find child by name
QPushButton* found = window->findChild<QPushButton*>("myButton");

// Find all children of type
QList<QPushButton*> buttons = window->findChildren<QPushButton*>();
```

### Smart Pointers with Qt

While Qt's parent-child relationship handles memory, you can use smart pointers:

```cpp
// std::unique_ptr for ownership
class MainWindow {
private:
    std::unique_ptr<TodoModel> m_model;  // Owned by MainWindow
};

// QScopedPointer (Qt's equivalent)
class MainWindow {
private:
    QScopedPointer<TodoModel> m_model;
};

// QSharedPointer for shared ownership
QSharedPointer<TodoItem> item = QSharedPointer<TodoItem>::create();
```

**Important**: Don't use smart pointers with QObject-derived classes that have parents!

```cpp
// ❌ WRONG: Double deletion!
std::unique_ptr<QWidget> widget(new QWidget(parent));

// ✅ CORRECT: Use parent OR unique_ptr, not both
std::unique_ptr<QWidget> widget(new QWidget(nullptr));
```

---

## Model/View Architecture

### Overview

Qt's Model/View framework separates data (Model) from presentation (View):

```
┌─────────────┐      ┌─────────────┐
│    Model    │◄────►│    View     │
│  (Data)     │      │ (Display)   │
└─────────────┘      └─────────────┘
       ▲                    ▲
       │                    │
       └────────────────────┘
              Signals
```

**Benefits**:
- Multiple views of same data
- Easy to change data source
- Separation of concerns
- Automatic updates via signals

### Model Classes

**QAbstractItemModel** - Base for all models
- **QAbstractListModel** - For lists (used in TodoModel)
- **QAbstractTableModel** - For tables
- QStandardItemModel - Ready-to-use model
- QFileSystemModel - File system model

### Implementing a Custom Model

Our `TodoModel` demonstrates a custom list model:

```cpp
class TodoModel : public QAbstractListModel
{
    Q_OBJECT

public:
    // Required overrides
    int rowCount(const QModelIndex& parent = QModelIndex()) const override;
    QVariant data(const QModelIndex& index, int role = Qt::DisplayRole) const override;

    // Optional overrides for editing
    bool setData(const QModelIndex& index, const QVariant& value, int role) override;
    Qt::ItemFlags flags(const QModelIndex& index) const override;

    // Custom roles
    enum TodoRoles {
        TitleRole = Qt::UserRole + 1,
        CompletedRole,
        PriorityRole
    };
};
```

### Roles

Roles allow a single index to return different data:

```cpp
QVariant TodoModel::data(const QModelIndex& index, int role) const
{
    const TodoItem& item = m_todos.at(index.row());

    switch (role) {
        case Qt::DisplayRole:      // Main display text
            return item.getTitle();

        case Qt::CheckStateRole:   // Checkbox state
            return item.isCompleted() ? Qt::Checked : Qt::Unchecked;

        case TitleRole:            // Custom role
            return item.getTitle();

        case CompletedRole:        // Custom role
            return item.isCompleted();

        default:
            return QVariant();
    }
}
```

### Model Notifications

Models must notify views when data changes:

```cpp
// Adding rows
void TodoModel::addTodo(const TodoItem& item)
{
    int row = m_todos.size();
    beginInsertRows(QModelIndex(), row, row);  // BEFORE inserting
    m_todos.append(item);
    endInsertRows();  // AFTER inserting
}

// Removing rows
void TodoModel::removeTodo(int row)
{
    beginRemoveRows(QModelIndex(), row, row);  // BEFORE removing
    m_todos.removeAt(row);
    endRemoveRows();  // AFTER removing
}

// Changing data
void TodoModel::setData(const QModelIndex& index, const QVariant& value, int role)
{
    m_todos[index.row()].setTitle(value.toString());
    emit dataChanged(index, index, {role});  // Notify view
}

// Resetting entire model
void TodoModel::clearAll()
{
    beginResetModel();
    m_todos.clear();
    endResetModel();
}
```

### Views

Common view classes:

```cpp
// List view (used in our app)
QListView* listView = new QListView();
listView->setModel(model);

// Table view
QTableView* tableView = new QTableView();
tableView->setModel(model);

// Tree view
QTreeView* treeView = new QTreeView();
treeView->setModel(model);

// Combo box (also a view!)
QComboBox* combo = new QComboBox();
combo->setModel(model);
```

### Delegates

Delegates control how items are rendered and edited:

```cpp
// Custom delegate for todo items
class TodoDelegate : public QStyledItemDelegate
{
public:
    void paint(QPainter* painter, const QStyleOptionViewItem& option,
               const QModelIndex& index) const override
    {
        // Custom painting code
        bool completed = index.data(TodoModel::CompletedRole).toBool();

        if (completed) {
            // Draw strikethrough for completed items
        }

        QStyledItemDelegate::paint(painter, option, index);
    }

    QWidget* createEditor(QWidget* parent, const QStyleOptionViewItem& option,
                          const QModelIndex& index) const override
    {
        // Custom editor widget
        return new QLineEdit(parent);
    }
};

// Use custom delegate
listView->setItemDelegate(new TodoDelegate(listView));
```

---

## Event System

### Qt Event Loop

Qt applications are event-driven:

```cpp
int main(int argc, char* argv[])
{
    QApplication app(argc, argv);  // Creates application

    MainWindow window;
    window.show();

    return app.exec();  // Starts event loop (blocks here until app quits)
}
```

**Event Loop Responsibilities**:
- Process system events (mouse, keyboard, window)
- Execute queued slot calls
- Run timers
- Process network I/O
- Handle custom events

### Event Types

Common event types:

```cpp
// Mouse events
void mousePressEvent(QMouseEvent* event) override;
void mouseReleaseEvent(QMouseEvent* event) override;
void mouseMoveEvent(QMouseEvent* event) override;

// Keyboard events
void keyPressEvent(QKeyEvent* event) override;
void keyReleaseEvent(QKeyEvent* event) override;

// Widget events
void paintEvent(QPaintEvent* event) override;
void resizeEvent(QResizeEvent* event) override;
void closeEvent(QCloseEvent* event) override;

// Focus events
void focusInEvent(QFocusEvent* event) override;
void focusOutEvent(QFocusEvent* event) override;
```

### Event Handling Example

```cpp
void MainWindow::closeEvent(QCloseEvent* event)
{
    // Save settings before closing
    saveSettings();

    // Ask for confirmation
    if (hasUnsavedChanges()) {
        if (askConfirmation("Close without saving?")) {
            event->accept();  // Allow close
        } else {
            event->ignore();  // Cancel close
        }
    } else {
        event->accept();
    }
}
```

### Event Filters

Intercept events before they reach the target:

```cpp
class KeyPressEater : public QObject
{
protected:
    bool eventFilter(QObject* obj, QEvent* event) override
    {
        if (event->type() == QEvent::KeyPress) {
            QKeyEvent* keyEvent = static_cast<QKeyEvent*>(event);
            if (keyEvent->key() == Qt::Key_Escape) {
                // Handle Escape key
                return true;  // Event handled, don't propagate
            }
        }
        return QObject::eventFilter(obj, event);  // Pass to parent
    }
};

// Install event filter
KeyPressEater* filter = new KeyPressEater(this);
lineEdit->installEventFilter(filter);
```

### Timers

```cpp
// Single-shot timer
QTimer::singleShot(1000, this, [this]() {
    qDebug() << "1 second elapsed";
});

// Repeating timer
QTimer* timer = new QTimer(this);
connect(timer, &QTimer::timeout, this, &MyClass::updateData);
timer->start(1000);  // Fire every 1000ms
```

---

## Resource System

### Qt Resource Collection (.qrc)

The resource system embeds files into the executable:

```xml
<!-- resources/resources.qrc -->
<RCC>
    <qresource prefix="/">
        <file>styles/light.qss</file>
        <file>styles/dark.qss</file>
    </qresource>
    <qresource prefix="/icons">
        <file>icons/app.png</file>
        <file>icons/add.png</file>
    </qresource>
</RCC>
```

**Accessing Resources**:
```cpp
// Load stylesheet
QFile file(":/styles/dark.qss");
if (file.open(QFile::ReadOnly)) {
    QString styleSheet = file.readAll();
    qApp->setStyleSheet(styleSheet);
}

// Load icon
QIcon icon(":/icons/app.png");
button->setIcon(icon);

// Load image
QPixmap pixmap(":/images/logo.png");
label->setPixmap(pixmap);
```

**Benefits**:
- No external file dependencies
- Portable single-file executable
- Protected from user modification
- Faster loading (no disk I/O)

---

## Memory Management

### Parent-Child Ownership

```cpp
// Parent owns children
QWidget* parent = new QWidget();
QLabel* label = new QLabel("Text", parent);  // Owned by parent
QPushButton* button = new QPushButton("Click", parent);  // Owned by parent

delete parent;  // Automatically deletes label and button
```

### Smart Pointers

```cpp
// std::unique_ptr for exclusive ownership
std::unique_ptr<TodoModel> model = std::make_unique<TodoModel>();

// std::shared_ptr for shared ownership
std::shared_ptr<TodoItem> item = std::make_shared<TodoItem>("Task");

// Qt's QSharedPointer
QSharedPointer<TodoItem> item = QSharedPointer<TodoItem>::create("Task");
```

### RAII Pattern

Resource Acquisition Is Initialization:

```cpp
// File automatically closed when going out of scope
QFile file("data.json");
if (file.open(QIODevice::ReadOnly)) {
    QByteArray data = file.readAll();
    // file.close() called automatically
}

// Database transaction
QSqlDatabase db = QSqlDatabase::database();
db.transaction();
// ... database operations ...
if (success) {
    db.commit();
} else {
    db.rollback();
}
```

---

## Qt Widgets

### Common Widgets

**Display Widgets**:
- QLabel - Text or image display
- QLCDNumber - LCD-style numbers
- QProgressBar - Progress indicator

**Input Widgets**:
- QPushButton - Push button
- QLineEdit - Single-line text editor
- QTextEdit - Multi-line text editor
- QCheckBox - Checkbox
- QRadioButton - Radio button
- QComboBox - Drop-down list
- QSpinBox - Integer spinner
- QSlider - Slider control

**Container Widgets**:
- QGroupBox - Group of widgets with frame
- QTabWidget - Tabbed widget
- QScrollArea - Scrollable area
- QDockWidget - Dockable panel

**ItemViews**:
- QListView - List of items
- QTableView - Table of items
- QTreeView - Tree of items

### Layouts

Qt provides automatic layout management:

```cpp
// Vertical layout
QVBoxLayout* vLayout = new QVBoxLayout();
vLayout->addWidget(label);
vLayout->addWidget(lineEdit);
vLayout->addWidget(button);

// Horizontal layout
QHBoxLayout* hLayout = new QHBoxLayout();
hLayout->addWidget(filterLabel);
hLayout->addWidget(filterCombo);
hLayout->addStretch();  // Flexible space

// Grid layout
QGridLayout* grid = new QGridLayout();
grid->addWidget(nameLabel, 0, 0);
grid->addWidget(nameEdit, 0, 1);
grid->addWidget(ageLabel, 1, 0);
grid->addWidget(ageEdit, 1, 1);

// Set layout on widget
widget->setLayout(vLayout);
```

---

## Settings and Persistence

### QSettings

Cross-platform application settings:

```cpp
// Reading settings
QSettings settings("MyCompany", "MyApp");
int value = settings.value("key", defaultValue).toInt();
QString text = settings.value("text", "default").toString();

// Writing settings
settings.setValue("key", 42);
settings.setValue("text", "Hello");
settings.sync();  // Force write to disk

// Organize with groups
settings.beginGroup("MainWindow");
settings.setValue("geometry", saveGeometry());
settings.setValue("state", saveState());
settings.endGroup();

settings.beginGroup("Editor");
settings.setValue("font", font());
settings.endGroup();
```

**Storage Locations**:
- Windows: Registry or INI file
- macOS: Property list (.plist)
- Linux: INI file in ~/.config

---

## Best Practices

### 1. Use Modern Connection Syntax

```cpp
// ✅ GOOD
connect(button, &QPushButton::clicked, this, &MyClass::onButtonClicked);

// ❌ BAD
connect(button, SIGNAL(clicked()), this, SLOT(onButtonClicked()));
```

### 2. Prefer Smart Pointers

```cpp
// ✅ GOOD
std::unique_ptr<TodoModel> m_model;

// ⚠️ OK (if using parent-child ownership)
TodoModel* m_model = new TodoModel(this);
```

### 3. Use Const Correctness

```cpp
// ✅ GOOD
QString getTitle() const { return m_title; }
void setTitle(const QString& title);

// ❌ BAD
QString getTitle() { return m_title; }
void setTitle(QString title);
```

### 4. Emit Signals for State Changes

```cpp
void TodoModel::addTodo(const TodoItem& item)
{
    m_todos.append(item);
    emit todoAdded(item);  // Notify observers
    emit countsChanged();  // Update statistics
}
```

### 5. Use Appropriate Container Classes

```cpp
// Qt containers (implicit sharing, COW)
QVector<TodoItem> todos;    // Dynamic array
QList<QString> names;       // List (array in Qt6)
QMap<QString, int> counts;  // Sorted map
QHash<QString, int> hash;   // Hash table

// STL containers also work
std::vector<TodoItem> todos;
std::map<QString, int> counts;
```

---

## Conclusion

This document covered Qt's fundamental concepts:

- ✅ Meta-Object System and MOC
- ✅ Signals and Slots mechanism
- ✅ Object model and memory management
- ✅ Model/View architecture
- ✅ Event system and event loop
- ✅ Resource management
- ✅ Qt Widgets and layouts
- ✅ Settings and persistence

For practical application of these concepts, see the complete Todo List source code and [ARCHITECTURE.md](ARCHITECTURE.md) for design patterns.

**Further Reading**:
- [Qt Documentation](https://doc.qt.io/)
- [Qt Best Practices](https://wiki.qt.io/Qt_Best_Practices)
- [Effective Qt](https://www.kdab.com/~marc/effective_qt.pdf)
