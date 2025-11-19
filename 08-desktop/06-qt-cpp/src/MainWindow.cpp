/**
 * @file MainWindow.cpp
 * @brief Implementation of MainWindow class
 */

#include "MainWindow.h"
#include "StorageManager.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QGroupBox>
#include <QMessageBox>
#include <QInputDialog>
#include <QFileDialog>
#include <QCloseEvent>
#include <QSettings>
#include <QScreen>
#include <QApplication>
#include <QDebug>

/**
 * @brief Constructor implementation
 */
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , m_listView(nullptr)
    , m_inputEdit(nullptr)
    , m_addButton(nullptr)
    , m_removeButton(nullptr)
    , m_clearCompletedButton(nullptr)
    , m_filterAllRadio(nullptr)
    , m_filterActiveRadio(nullptr)
    , m_filterCompletedRadio(nullptr)
    , m_priorityCombo(nullptr)
    , m_statsLabel(nullptr)
    , m_model(std::make_unique<TodoModel>(this))
    , m_isDarkTheme(false)
{
    setWindowTitle(tr("Qt Todo List - MVVM Architecture"));
    setMinimumSize(600, 500);
    resize(800, 600);

    createActions();
    setupUI();
    createMenuBar();
    createToolBar();
    createStatusBar();
    connectSignals();

    // Load settings and apply theme
    loadSettings();
    applyTheme(m_isDarkTheme);

    // Initial statistics update
    updateStatistics();
}

/**
 * @brief Destructor implementation
 */
MainWindow::~MainWindow()
{
    saveSettings();
}

/**
 * @brief Setup UI components
 */
void MainWindow::setupUI()
{
    // Create central widget and main layout
    QWidget *centralWidget = new QWidget(this);
    QVBoxLayout *mainLayout = new QVBoxLayout(centralWidget);
    mainLayout->setSpacing(10);
    mainLayout->setContentsMargins(10, 10, 10, 10);

    // === Input Section ===
    QHBoxLayout *inputLayout = new QHBoxLayout();

    m_inputEdit = new QLineEdit(this);
    m_inputEdit->setPlaceholderText(tr("What needs to be done?"));
    m_inputEdit->setMinimumHeight(35);
    inputLayout->addWidget(m_inputEdit);

    m_priorityCombo = new QComboBox(this);
    m_priorityCombo->addItem(tr("Low"), static_cast<int>(TodoItem::Priority::Low));
    m_priorityCombo->addItem(tr("Normal"), static_cast<int>(TodoItem::Priority::Normal));
    m_priorityCombo->addItem(tr("High"), static_cast<int>(TodoItem::Priority::High));
    m_priorityCombo->addItem(tr("Urgent"), static_cast<int>(TodoItem::Priority::Urgent));
    m_priorityCombo->setCurrentIndex(1); // Default to Normal
    inputLayout->addWidget(m_priorityCombo);

    m_addButton = new QPushButton(tr("Add"), this);
    m_addButton->setMinimumWidth(80);
    inputLayout->addWidget(m_addButton);

    mainLayout->addLayout(inputLayout);

    // === Filter Section ===
    QGroupBox *filterGroup = new QGroupBox(tr("Filter"), this);
    QHBoxLayout *filterLayout = new QHBoxLayout(filterGroup);

    m_filterAllRadio = new QRadioButton(tr("All"), this);
    m_filterActiveRadio = new QRadioButton(tr("Active"), this);
    m_filterCompletedRadio = new QRadioButton(tr("Completed"), this);
    m_filterAllRadio->setChecked(true);

    filterLayout->addWidget(m_filterAllRadio);
    filterLayout->addWidget(m_filterActiveRadio);
    filterLayout->addWidget(m_filterCompletedRadio);
    filterLayout->addStretch();

    mainLayout->addWidget(filterGroup);

    // === Todo List View ===
    m_listView = new QListView(this);
    m_listView->setModel(m_model.get());
    m_listView->setSelectionMode(QAbstractItemView::SingleSelection);
    m_listView->setEditTriggers(QAbstractItemView::NoEditTriggers);
    m_listView->setAlternatingRowColors(true);
    m_listView->setContextMenuPolicy(Qt::CustomContextMenu);
    mainLayout->addWidget(m_listView, 1); // Give it stretch factor of 1

    // === Action Buttons ===
    QHBoxLayout *actionLayout = new QHBoxLayout();

    m_removeButton = new QPushButton(tr("Remove Selected"), this);
    actionLayout->addWidget(m_removeButton);

    m_clearCompletedButton = new QPushButton(tr("Clear Completed"), this);
    actionLayout->addWidget(m_clearCompletedButton);

    actionLayout->addStretch();

    mainLayout->addLayout(actionLayout);

    setCentralWidget(centralWidget);
}

/**
 * @brief Create actions
 */
void MainWindow::createActions()
{
    // File menu actions
    m_newTodoAction = new QAction(tr("&New Todo"), this);
    m_newTodoAction->setShortcut(QKeySequence::New);
    m_newTodoAction->setStatusTip(tr("Create a new todo item"));

    m_removeTodoAction = new QAction(tr("&Remove Todo"), this);
    m_removeTodoAction->setShortcut(QKeySequence::Delete);
    m_removeTodoAction->setStatusTip(tr("Remove selected todo item"));

    m_toggleTodoAction = new QAction(tr("&Toggle Completion"), this);
    m_toggleTodoAction->setShortcut(Qt::Key_Space);
    m_toggleTodoAction->setStatusTip(tr("Toggle completion status"));

    m_editTodoAction = new QAction(tr("&Edit Todo"), this);
    m_editTodoAction->setShortcut(Qt::Key_F2);
    m_editTodoAction->setStatusTip(tr("Edit selected todo item"));

    m_clearCompletedAction = new QAction(tr("&Clear Completed"), this);
    m_clearCompletedAction->setShortcut(QKeySequence(Qt::CTRL | Qt::Key_L));
    m_clearCompletedAction->setStatusTip(tr("Remove all completed todos"));

    m_exportAction = new QAction(tr("E&xport..."), this);
    m_exportAction->setShortcut(QKeySequence(Qt::CTRL | Qt::Key_E));
    m_exportAction->setStatusTip(tr("Export todos to JSON file"));

    m_importAction = new QAction(tr("&Import..."), this);
    m_importAction->setShortcut(QKeySequence(Qt::CTRL | Qt::Key_I));
    m_importAction->setStatusTip(tr("Import todos from JSON file"));

    m_quitAction = new QAction(tr("&Quit"), this);
    m_quitAction->setShortcut(QKeySequence::Quit);
    m_quitAction->setStatusTip(tr("Quit the application"));

    // View menu actions
    m_filterAllAction = new QAction(tr("Show &All"), this);
    m_filterAllAction->setShortcut(Qt::Key_F1);
    m_filterAllAction->setCheckable(true);
    m_filterAllAction->setChecked(true);

    m_filterActiveAction = new QAction(tr("Show &Active"), this);
    m_filterActiveAction->setShortcut(Qt::Key_F2);
    m_filterActiveAction->setCheckable(true);

    m_filterCompletedAction = new QAction(tr("Show &Completed"), this);
    m_filterCompletedAction->setShortcut(Qt::Key_F3);
    m_filterCompletedAction->setCheckable(true);

    m_toggleThemeAction = new QAction(tr("Toggle &Theme"), this);
    m_toggleThemeAction->setShortcut(QKeySequence(Qt::CTRL | Qt::Key_T));
    m_toggleThemeAction->setStatusTip(tr("Toggle between light and dark theme"));

    // Help menu actions
    m_aboutAction = new QAction(tr("&About"), this);
    m_aboutAction->setStatusTip(tr("About this application"));

    m_aboutQtAction = new QAction(tr("About &Qt"), this);
    m_aboutQtAction->setStatusTip(tr("About Qt framework"));
}

/**
 * @brief Create menu bar
 */
void MainWindow::createMenuBar()
{
    QMenuBar *menuBar = this->menuBar();

    // File menu
    QMenu *fileMenu = menuBar->addMenu(tr("&File"));
    fileMenu->addAction(m_newTodoAction);
    fileMenu->addAction(m_editTodoAction);
    fileMenu->addAction(m_removeTodoAction);
    fileMenu->addSeparator();
    fileMenu->addAction(m_clearCompletedAction);
    fileMenu->addSeparator();
    fileMenu->addAction(m_exportAction);
    fileMenu->addAction(m_importAction);
    fileMenu->addSeparator();
    fileMenu->addAction(m_quitAction);

    // View menu
    QMenu *viewMenu = menuBar->addMenu(tr("&View"));
    viewMenu->addAction(m_filterAllAction);
    viewMenu->addAction(m_filterActiveAction);
    viewMenu->addAction(m_filterCompletedAction);
    viewMenu->addSeparator();
    viewMenu->addAction(m_toggleThemeAction);

    // Help menu
    QMenu *helpMenu = menuBar->addMenu(tr("&Help"));
    helpMenu->addAction(m_aboutAction);
    helpMenu->addAction(m_aboutQtAction);
}

/**
 * @brief Create toolbar
 */
void MainWindow::createToolBar()
{
    QToolBar *toolBar = addToolBar(tr("Main Toolbar"));
    toolBar->setMovable(false);

    toolBar->addAction(m_newTodoAction);
    toolBar->addAction(m_editTodoAction);
    toolBar->addAction(m_removeTodoAction);
    toolBar->addSeparator();
    toolBar->addAction(m_toggleTodoAction);
    toolBar->addSeparator();
    toolBar->addAction(m_clearCompletedAction);
    toolBar->addSeparator();
    toolBar->addAction(m_toggleThemeAction);
}

/**
 * @brief Create status bar
 */
void MainWindow::createStatusBar()
{
    m_statsLabel = new QLabel(this);
    statusBar()->addPermanentWidget(m_statsLabel);
    statusBar()->showMessage(tr("Ready"));
}

/**
 * @brief Connect signals and slots
 */
void MainWindow::connectSignals()
{
    // Input signals
    connect(m_addButton, &QPushButton::clicked, this, &MainWindow::onAddTodo);
    connect(m_inputEdit, &QLineEdit::returnPressed, this, &MainWindow::onAddTodo);

    // Action buttons
    connect(m_removeButton, &QPushButton::clicked, this, &MainWindow::onRemoveTodo);
    connect(m_clearCompletedButton, &QPushButton::clicked, this, &MainWindow::onClearCompleted);

    // Filter radio buttons
    connect(m_filterAllRadio, &QRadioButton::clicked, this, &MainWindow::onFilterAll);
    connect(m_filterActiveRadio, &QRadioButton::clicked, this, &MainWindow::onFilterActive);
    connect(m_filterCompletedRadio, &QRadioButton::clicked, this, &MainWindow::onFilterCompleted);

    // Actions
    connect(m_newTodoAction, &QAction::triggered, this, &MainWindow::onAddTodo);
    connect(m_removeTodoAction, &QAction::triggered, this, &MainWindow::onRemoveTodo);
    connect(m_toggleTodoAction, &QAction::triggered, this, &MainWindow::onToggleTodo);
    connect(m_editTodoAction, &QAction::triggered, this, &MainWindow::onEditTodo);
    connect(m_clearCompletedAction, &QAction::triggered, this, &MainWindow::onClearCompleted);
    connect(m_exportAction, &QAction::triggered, this, &MainWindow::onExport);
    connect(m_importAction, &QAction::triggered, this, &MainWindow::onImport);
    connect(m_quitAction, &QAction::triggered, this, &QMainWindow::close);

    connect(m_filterAllAction, &QAction::triggered, this, &MainWindow::onFilterAll);
    connect(m_filterActiveAction, &QAction::triggered, this, &MainWindow::onFilterActive);
    connect(m_filterCompletedAction, &QAction::triggered, this, &MainWindow::onFilterCompleted);

    connect(m_toggleThemeAction, &QAction::triggered, this, &MainWindow::onToggleTheme);
    connect(m_aboutAction, &QAction::triggered, this, &MainWindow::onAbout);
    connect(m_aboutQtAction, &QAction::triggered, this, &MainWindow::onAboutQt);

    // List view signals
    connect(m_listView, &QListView::doubleClicked, this, &MainWindow::onListViewDoubleClicked);
    connect(m_listView, &QListView::customContextMenuRequested, this, &MainWindow::onListViewContextMenu);

    // Model signals
    connect(m_model.get(), &TodoModel::countsChanged, this, &MainWindow::onCountsChanged);
    connect(m_model.get(), &TodoModel::todoAdded, this, &MainWindow::onTodoAdded);
    connect(m_model.get(), &TodoModel::todoRemoved, this, &MainWindow::onTodoRemoved);
}

/**
 * @brief Handle add todo
 */
void MainWindow::onAddTodo()
{
    QString title = m_inputEdit->text().trimmed();
    if (title.isEmpty()) {
        showError(tr("Please enter a todo title"));
        m_inputEdit->setFocus();
        return;
    }

    int priorityIndex = m_priorityCombo->currentData().toInt();
    auto priority = static_cast<TodoItem::Priority>(priorityIndex);

    if (m_model->addTodo(title, priority)) {
        m_inputEdit->clear();
        m_inputEdit->setFocus();
        statusBar()->showMessage(tr("Todo added successfully"), 2000);
    } else {
        showError(tr("Failed to add todo"));
    }
}

/**
 * @brief Handle remove todo
 */
void MainWindow::onRemoveTodo()
{
    QModelIndex index = getSelectedIndex();
    if (!index.isValid()) {
        showError(tr("Please select a todo to remove"));
        return;
    }

    TodoItem item = m_model->getTodoItem(index);
    if (askConfirmation(tr("Are you sure you want to remove '%1'?").arg(item.getTitle()))) {
        if (m_model->removeTodo(index)) {
            statusBar()->showMessage(tr("Todo removed successfully"), 2000);
        } else {
            showError(tr("Failed to remove todo"));
        }
    }
}

/**
 * @brief Handle toggle todo
 */
void MainWindow::onToggleTodo()
{
    QModelIndex index = getSelectedIndex();
    if (!index.isValid()) {
        showError(tr("Please select a todo to toggle"));
        return;
    }

    if (m_model->toggleTodo(index)) {
        statusBar()->showMessage(tr("Todo toggled successfully"), 2000);
    } else {
        showError(tr("Failed to toggle todo"));
    }
}

/**
 * @brief Handle edit todo
 */
void MainWindow::onEditTodo()
{
    QModelIndex index = getSelectedIndex();
    if (!index.isValid()) {
        showError(tr("Please select a todo to edit"));
        return;
    }

    TodoItem item = m_model->getTodoItem(index);

    bool ok;
    QString newTitle = QInputDialog::getText(
        this,
        tr("Edit Todo"),
        tr("Todo title:"),
        QLineEdit::Normal,
        item.getTitle(),
        &ok
    );

    if (ok && !newTitle.trimmed().isEmpty()) {
        if (m_model->updateTodoTitle(index, newTitle.trimmed())) {
            statusBar()->showMessage(tr("Todo updated successfully"), 2000);
        } else {
            showError(tr("Failed to update todo"));
        }
    }
}

/**
 * @brief Handle clear completed
 */
void MainWindow::onClearCompleted()
{
    int completedCount = m_model->completedCount();
    if (completedCount == 0) {
        showInfo(tr("No completed todos to clear"));
        return;
    }

    if (askConfirmation(tr("Are you sure you want to remove %1 completed todo(s)?").arg(completedCount))) {
        int removed = m_model->clearCompleted();
        statusBar()->showMessage(tr("Removed %1 completed todo(s)").arg(removed), 3000);
    }
}

/**
 * @brief Handle filter all
 */
void MainWindow::onFilterAll()
{
    m_model->setFilterMode(TodoModel::FilterMode::All);
    m_filterAllRadio->setChecked(true);
    m_filterAllAction->setChecked(true);
    m_filterActiveAction->setChecked(false);
    m_filterCompletedAction->setChecked(false);
    statusBar()->showMessage(tr("Showing all todos"), 2000);
}

/**
 * @brief Handle filter active
 */
void MainWindow::onFilterActive()
{
    m_model->setFilterMode(TodoModel::FilterMode::Active);
    m_filterActiveRadio->setChecked(true);
    m_filterAllAction->setChecked(false);
    m_filterActiveAction->setChecked(true);
    m_filterCompletedAction->setChecked(false);
    statusBar()->showMessage(tr("Showing active todos"), 2000);
}

/**
 * @brief Handle filter completed
 */
void MainWindow::onFilterCompleted()
{
    m_model->setFilterMode(TodoModel::FilterMode::Completed);
    m_filterCompletedRadio->setChecked(true);
    m_filterAllAction->setChecked(false);
    m_filterActiveAction->setChecked(false);
    m_filterCompletedAction->setChecked(true);
    statusBar()->showMessage(tr("Showing completed todos"), 2000);
}

/**
 * @brief Handle toggle theme
 */
void MainWindow::onToggleTheme()
{
    m_isDarkTheme = !m_isDarkTheme;
    applyTheme(m_isDarkTheme);
    statusBar()->showMessage(
        m_isDarkTheme ? tr("Dark theme applied") : tr("Light theme applied"),
        2000
    );
}

/**
 * @brief Handle export
 */
void MainWindow::onExport()
{
    QString filePath = QFileDialog::getSaveFileName(
        this,
        tr("Export Todos"),
        QDir::homePath() + "/todos_export.json",
        tr("JSON Files (*.json)")
    );

    if (filePath.isEmpty())
        return;

    QVector<TodoItem> allTodos;
    for (int i = 0; i < m_model->totalCount(); ++i) {
        // Temporarily switch to All filter to get all todos
        auto oldFilter = m_model->getFilterMode();
        m_model->setFilterMode(TodoModel::FilterMode::All);
        allTodos.append(m_model->getTodoItem(i));
        m_model->setFilterMode(oldFilter);
    }

    if (StorageManager::exportToJson(filePath, allTodos)) {
        showInfo(tr("Successfully exported %1 todo(s) to:\n%2")
                 .arg(allTodos.size())
                 .arg(filePath));
    } else {
        showError(tr("Failed to export todos"));
    }
}

/**
 * @brief Handle import
 */
void MainWindow::onImport()
{
    QString filePath = QFileDialog::getOpenFileName(
        this,
        tr("Import Todos"),
        QDir::homePath(),
        tr("JSON Files (*.json)")
    );

    if (filePath.isEmpty())
        return;

    QVector<TodoItem> importedTodos = StorageManager::importFromJson(filePath);

    if (importedTodos.isEmpty()) {
        showError(tr("No todos found in the file or import failed"));
        return;
    }

    if (askConfirmation(tr("Import %1 todo(s)? This will add them to your existing todos.")
                        .arg(importedTodos.size()))) {
        int added = 0;
        for (const auto& todo : importedTodos) {
            if (m_model->addTodo(todo)) {
                added++;
            }
        }
        showInfo(tr("Successfully imported %1 todo(s)").arg(added));
    }
}

/**
 * @brief Handle about
 */
void MainWindow::onAbout()
{
    QMessageBox::about(
        this,
        tr("About Qt Todo List"),
        tr("<h2>Qt Todo List</h2>"
           "<p>Version 1.0.0</p>"
           "<p>A modern todo list application built with Qt 6 and C++17.</p>"
           "<p><b>Features:</b></p>"
           "<ul>"
           "<li>MVVM Architecture (Model-View-ViewModel)</li>"
           "<li>Persistent storage with QSettings</li>"
           "<li>Filtering (All/Active/Completed)</li>"
           "<li>Dark/Light theme support</li>"
           "<li>Import/Export JSON</li>"
           "<li>Keyboard shortcuts</li>"
           "</ul>"
           "<p>Built with ❤️ using Qt Framework</p>")
    );
}

/**
 * @brief Handle about Qt
 */
void MainWindow::onAboutQt()
{
    QMessageBox::aboutQt(this, tr("About Qt"));
}

/**
 * @brief Handle counts changed
 */
void MainWindow::onCountsChanged()
{
    updateStatistics();
}

/**
 * @brief Handle todo added
 */
void MainWindow::onTodoAdded(const TodoItem& item)
{
    Q_UNUSED(item);
    // Additional handling if needed
}

/**
 * @brief Handle todo removed
 */
void MainWindow::onTodoRemoved(const QString& id)
{
    Q_UNUSED(id);
    // Additional handling if needed
}

/**
 * @brief Handle list view double click
 */
void MainWindow::onListViewDoubleClicked(const QModelIndex& index)
{
    if (index.isValid()) {
        m_model->toggleTodo(index);
    }
}

/**
 * @brief Handle list view context menu
 */
void MainWindow::onListViewContextMenu(const QPoint& pos)
{
    QModelIndex index = m_listView->indexAt(pos);
    if (!index.isValid())
        return;

    QMenu contextMenu(this);
    contextMenu.addAction(m_toggleTodoAction);
    contextMenu.addAction(m_editTodoAction);
    contextMenu.addSeparator();
    contextMenu.addAction(m_removeTodoAction);

    contextMenu.exec(m_listView->viewport()->mapToGlobal(pos));
}

/**
 * @brief Apply theme
 */
void MainWindow::applyTheme(bool dark)
{
    if (dark) {
        qApp->setStyleSheet(getDarkThemeStyleSheet());
    } else {
        qApp->setStyleSheet(getLightThemeStyleSheet());
    }
}

/**
 * @brief Get light theme stylesheet
 */
QString MainWindow::getLightThemeStyleSheet() const
{
    return R"(
        QMainWindow {
            background-color: #f5f5f5;
        }
        QListView {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 5px;
            font-size: 14px;
        }
        QListView::item {
            padding: 8px;
            border-bottom: 1px solid #eee;
        }
        QListView::item:selected {
            background-color: #e3f2fd;
            color: #1976d2;
        }
        QListView::item:hover {
            background-color: #f5f5f5;
        }
        QLineEdit {
            padding: 8px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        QLineEdit:focus {
            border-color: #1976d2;
        }
        QPushButton {
            background-color: #1976d2;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
        }
        QPushButton:hover {
            background-color: #1565c0;
        }
        QPushButton:pressed {
            background-color: #0d47a1;
        }
        QPushButton:disabled {
            background-color: #ccc;
            color: #888;
        }
        QRadioButton {
            spacing: 5px;
            font-size: 13px;
        }
        QGroupBox {
            font-weight: bold;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-top: 10px;
            padding-top: 10px;
        }
        QGroupBox::title {
            subcontrol-origin: margin;
            left: 10px;
            padding: 0 5px;
        }
        QComboBox {
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
        }
        QMenuBar {
            background-color: white;
            border-bottom: 1px solid #ddd;
        }
        QMenuBar::item:selected {
            background-color: #e3f2fd;
        }
        QMenu {
            background-color: white;
            border: 1px solid #ddd;
        }
        QMenu::item:selected {
            background-color: #e3f2fd;
        }
        QToolBar {
            background-color: white;
            border-bottom: 1px solid #ddd;
            spacing: 3px;
            padding: 3px;
        }
        QStatusBar {
            background-color: white;
            border-top: 1px solid #ddd;
        }
    )";
}

/**
 * @brief Get dark theme stylesheet
 */
QString MainWindow::getDarkThemeStyleSheet() const
{
    return R"(
        QMainWindow {
            background-color: #1e1e1e;
            color: #e0e0e0;
        }
        QWidget {
            color: #e0e0e0;
        }
        QListView {
            background-color: #252525;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
            padding: 5px;
            font-size: 14px;
            color: #e0e0e0;
        }
        QListView::item {
            padding: 8px;
            border-bottom: 1px solid #3a3a3a;
        }
        QListView::item:selected {
            background-color: #0d47a1;
            color: white;
        }
        QListView::item:hover {
            background-color: #2a2a2a;
        }
        QLineEdit {
            padding: 8px;
            border: 2px solid #3a3a3a;
            border-radius: 4px;
            font-size: 14px;
            background-color: #252525;
            color: #e0e0e0;
        }
        QLineEdit:focus {
            border-color: #1976d2;
        }
        QPushButton {
            background-color: #1976d2;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
        }
        QPushButton:hover {
            background-color: #1565c0;
        }
        QPushButton:pressed {
            background-color: #0d47a1;
        }
        QPushButton:disabled {
            background-color: #444;
            color: #888;
        }
        QRadioButton {
            spacing: 5px;
            font-size: 13px;
            color: #e0e0e0;
        }
        QGroupBox {
            font-weight: bold;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
            margin-top: 10px;
            padding-top: 10px;
            color: #e0e0e0;
        }
        QGroupBox::title {
            subcontrol-origin: margin;
            left: 10px;
            padding: 0 5px;
        }
        QComboBox {
            padding: 6px;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
            font-size: 13px;
            background-color: #252525;
            color: #e0e0e0;
        }
        QComboBox::drop-down {
            border: none;
        }
        QComboBox QAbstractItemView {
            background-color: #252525;
            color: #e0e0e0;
            selection-background-color: #0d47a1;
        }
        QMenuBar {
            background-color: #252525;
            border-bottom: 1px solid #3a3a3a;
            color: #e0e0e0;
        }
        QMenuBar::item:selected {
            background-color: #0d47a1;
        }
        QMenu {
            background-color: #252525;
            border: 1px solid #3a3a3a;
            color: #e0e0e0;
        }
        QMenu::item:selected {
            background-color: #0d47a1;
        }
        QToolBar {
            background-color: #252525;
            border-bottom: 1px solid #3a3a3a;
            spacing: 3px;
            padding: 3px;
        }
        QStatusBar {
            background-color: #252525;
            border-top: 1px solid #3a3a3a;
            color: #e0e0e0;
        }
        QLabel {
            color: #e0e0e0;
        }
    )";
}

/**
 * @brief Update statistics
 */
void MainWindow::updateStatistics()
{
    int total = m_model->totalCount();
    int active = m_model->activeCount();
    int completed = m_model->completedCount();

    m_statsLabel->setText(
        tr("Total: %1 | Active: %2 | Completed: %3")
        .arg(total)
        .arg(active)
        .arg(completed)
    );
}

/**
 * @brief Load settings
 */
void MainWindow::loadSettings()
{
    QSettings settings;

    // Load window geometry
    if (settings.contains("MainWindow/geometry")) {
        restoreGeometry(settings.value("MainWindow/geometry").toByteArray());
    }

    // Load theme preference
    m_isDarkTheme = settings.value("MainWindow/darkTheme", false).toBool();
}

/**
 * @brief Save settings
 */
void MainWindow::saveSettings()
{
    QSettings settings;

    // Save window geometry
    settings.setValue("MainWindow/geometry", saveGeometry());

    // Save theme preference
    settings.setValue("MainWindow/darkTheme", m_isDarkTheme);

    settings.sync();
}

/**
 * @brief Handle close event
 */
void MainWindow::closeEvent(QCloseEvent *event)
{
    saveSettings();
    event->accept();
}

/**
 * @brief Get selected index
 */
QModelIndex MainWindow::getSelectedIndex() const
{
    QModelIndexList selected = m_listView->selectionModel()->selectedIndexes();
    if (selected.isEmpty())
        return QModelIndex();

    return selected.first();
}

/**
 * @brief Show error message
 */
void MainWindow::showError(const QString& message)
{
    QMessageBox::critical(this, tr("Error"), message);
}

/**
 * @brief Show info message
 */
void MainWindow::showInfo(const QString& message)
{
    QMessageBox::information(this, tr("Information"), message);
}

/**
 * @brief Ask for confirmation
 */
bool MainWindow::askConfirmation(const QString& message)
{
    return QMessageBox::question(
        this,
        tr("Confirmation"),
        message,
        QMessageBox::Yes | QMessageBox::No,
        QMessageBox::No
    ) == QMessageBox::Yes;
}
