/**
 * @file main.cpp
 * @brief Qt Todo List Application Entry Point
 * @author TodoListDemo Project
 * @version 1.0.0
 *
 * This file serves as the entry point for the Qt-based Todo List application.
 * It initializes the Qt application, sets up high DPI support, and launches
 * the main window.
 */

#include <QApplication>
#include <QStyleFactory>
#include <QScreen>
#include <QDebug>
#include "src/MainWindow.h"

/**
 * @brief Application entry point
 *
 * Initializes the Qt application with proper high DPI settings,
 * applies native styling, and creates the main window.
 *
 * @param argc Number of command-line arguments
 * @param argv Array of command-line arguments
 * @return int Application exit code
 */
int main(int argc, char *argv[])
{
    // Enable High DPI support for modern displays
    QApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
    QApplication::setAttribute(Qt::AA_UseHighDpiPixmaps);

    // Create the application instance
    QApplication app(argc, argv);

    // Set application metadata for QSettings
    QApplication::setOrganizationName("TodoListDemo");
    QApplication::setOrganizationDomain("todolisdemo.example.com");
    QApplication::setApplicationName("Qt Todo List");
    QApplication::setApplicationVersion("1.0.0");

    // Log available styles for debugging
    qDebug() << "Available styles:" << QStyleFactory::keys();

    // Apply native style if available
#ifdef Q_OS_WIN
    QApplication::setStyle(QStyleFactory::create("windowsvista"));
#elif defined(Q_OS_MAC)
    QApplication::setStyle(QStyleFactory::create("macintosh"));
#elif defined(Q_OS_LINUX)
    // Try to use native GTK style, fallback to Fusion
    if (QStyleFactory::keys().contains("gtk2", Qt::CaseInsensitive)) {
        QApplication::setStyle(QStyleFactory::create("gtk2"));
    } else {
        QApplication::setStyle(QStyleFactory::create("Fusion"));
    }
#endif

    // Create and show the main window
    MainWindow mainWindow;

    // Center the window on screen
    const QRect screenGeometry = QApplication::primaryScreen()->geometry();
    int x = (screenGeometry.width() - mainWindow.width()) / 2;
    int y = (screenGeometry.height() - mainWindow.height()) / 2;
    mainWindow.move(x, y);

    mainWindow.show();

    // Start the event loop
    return app.exec();
}
