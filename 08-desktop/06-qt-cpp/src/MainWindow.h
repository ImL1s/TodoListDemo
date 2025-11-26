/**
 * @file MainWindow.h
 * @brief Main Window for Qt Todo List Application
 *
 * This file defines the MainWindow class which serves as the main UI
 * for the Todo List application using Qt Widgets.
 */

#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QListView>
#include <QLineEdit>
#include <QPushButton>
#include <QRadioButton>
#include <QLabel>
#include <QComboBox>
#include <QAction>
#include <QMenu>
#include <QMenuBar>
#include <QStatusBar>
#include <QToolBar>
#include <memory>
#include "TodoModel.h"

/**
 * @class MainWindow
 * @brief Main application window for the Todo List
 *
 * This class implements the main UI using Qt Widgets and follows the
 * Model-View-ViewModel (MVVM) architecture pattern. It provides:
 * - Todo list display (QListView)
 * - Add/Edit/Delete operations
 * - Filter controls (All/Active/Completed)
 * - Theme switching (Light/Dark)
 * - Keyboard shortcuts
 * - Menu bar and toolbar
 * - Status bar with statistics
 */
class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    /**
     * @brief Constructor
     * @param parent Parent widget
     */
    explicit MainWindow(QWidget *parent = nullptr);

    /**
     * @brief Destructor
     */
    ~MainWindow() override;

protected:
    /**
     * @brief Handle close event to save window state
     * @param event Close event
     */
    void closeEvent(QCloseEvent *event) override;

private slots:
    // Todo operations
    void onAddTodo();
    void onRemoveTodo();
    void onToggleTodo();
    void onEditTodo();
    void onClearCompleted();

    // Filter operations
    void onFilterAll();
    void onFilterActive();
    void onFilterCompleted();

    // Theme operations
    void onToggleTheme();

    // File operations
    void onExport();
    void onImport();

    // Help operations
    void onAbout();
    void onAboutQt();

    // Model signal handlers
    void onCountsChanged();
    void onTodoAdded(const TodoItem& item);
    void onTodoRemoved(const QString& id);

    // List view handlers
    void onListViewDoubleClicked(const QModelIndex& index);
    void onListViewContextMenu(const QPoint& pos);

private:
    // UI Components
    QListView *m_listView;
    QLineEdit *m_inputEdit;
    QPushButton *m_addButton;
    QPushButton *m_removeButton;
    QPushButton *m_clearCompletedButton;

    QRadioButton *m_filterAllRadio;
    QRadioButton *m_filterActiveRadio;
    QRadioButton *m_filterCompletedRadio;

    QComboBox *m_priorityCombo;
    QLabel *m_statsLabel;

    // Actions
    QAction *m_newTodoAction;
    QAction *m_removeTodoAction;
    QAction *m_toggleTodoAction;
    QAction *m_editTodoAction;
    QAction *m_clearCompletedAction;
    QAction *m_exportAction;
    QAction *m_importAction;
    QAction *m_quitAction;

    QAction *m_filterAllAction;
    QAction *m_filterActiveAction;
    QAction *m_filterCompletedAction;

    QAction *m_toggleThemeAction;
    QAction *m_aboutAction;
    QAction *m_aboutQtAction;

    // Model
    std::unique_ptr<TodoModel> m_model;

    // State
    bool m_isDarkTheme;

    /**
     * @brief Initialize UI components
     */
    void setupUI();

    /**
     * @brief Create menu bar
     */
    void createMenuBar();

    /**
     * @brief Create toolbar
     */
    void createToolBar();

    /**
     * @brief Create status bar
     */
    void createStatusBar();

    /**
     * @brief Create actions
     */
    void createActions();

    /**
     * @brief Connect signals and slots
     */
    void connectSignals();

    /**
     * @brief Apply theme (light or dark)
     * @param dark true for dark theme, false for light
     */
    void applyTheme(bool dark);

    /**
     * @brief Load light theme stylesheet
     * @return Stylesheet string
     */
    QString getLightThemeStyleSheet() const;

    /**
     * @brief Load dark theme stylesheet
     * @return Stylesheet string
     */
    QString getDarkThemeStyleSheet() const;

    /**
     * @brief Update statistics in status bar
     */
    void updateStatistics();

    /**
     * @brief Load window state from settings
     */
    void loadSettings();

    /**
     * @brief Save window state to settings
     */
    void saveSettings();

    /**
     * @brief Get selected model index
     * @return Selected index, or invalid index if none
     */
    QModelIndex getSelectedIndex() const;

    /**
     * @brief Show error message dialog
     * @param message Error message
     */
    void showError(const QString& message);

    /**
     * @brief Show information message dialog
     * @param message Info message
     */
    void showInfo(const QString& message);

    /**
     * @brief Ask for confirmation
     * @param message Confirmation message
     * @return true if confirmed, false otherwise
     */
    bool askConfirmation(const QString& message);
};

#endif // MAINWINDOW_H
