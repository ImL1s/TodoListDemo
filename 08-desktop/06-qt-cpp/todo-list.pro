#-------------------------------------------------
# Qt Todo List - qmake Project File
#-------------------------------------------------

QT       += core gui widgets

greaterThan(QT_MAJOR_VERSION, 5): QT += widgets

TARGET = QtTodoList
TEMPLATE = app

# C++ Configuration
CONFIG += c++17
CONFIG += sdk_no_version_check

# Disable deprecated APIs
DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000

# Source Files
SOURCES += \
    main.cpp \
    src/TodoItem.cpp \
    src/TodoModel.cpp \
    src/StorageManager.cpp \
    src/MainWindow.cpp

# Header Files
HEADERS += \
    src/TodoItem.h \
    src/TodoModel.h \
    src/StorageManager.h \
    src/MainWindow.h

# Resource Files
RESOURCES += \
    resources/resources.qrc

# Platform-specific Configuration
win32 {
    # Windows specific settings
    RC_ICONS = resources/icons/app.ico

    # MSVC specific flags
    QMAKE_CXXFLAGS += /W4

    # Deployment
    CONFIG(release, debug|release) {
        # Release build optimizations
        QMAKE_CXXFLAGS += /O2
    }
}

macx {
    # macOS specific settings
    ICON = resources/icons/app.icns
    QMAKE_INFO_PLIST = Info.plist

    # macOS deployment target
    QMAKE_MACOSX_DEPLOYMENT_TARGET = 10.15

    # Clang warnings
    QMAKE_CXXFLAGS += -Wall -Wextra -Wpedantic
}

unix:!macx {
    # Linux specific settings

    # GCC/Clang warnings
    QMAKE_CXXFLAGS += -Wall -Wextra -Wpedantic

    # Installation paths
    target.path = /usr/local/bin
    INSTALLS += target
}

# Include paths
INCLUDEPATH += $$PWD/src

# Output directories
CONFIG(debug, debug|release) {
    DESTDIR = $$PWD/build/debug
    OBJECTS_DIR = $$PWD/build/debug/obj
    MOC_DIR = $$PWD/build/debug/moc
    RCC_DIR = $$PWD/build/debug/rcc
    UI_DIR = $$PWD/build/debug/ui
}

CONFIG(release, debug|release) {
    DESTDIR = $$PWD/build/release
    OBJECTS_DIR = $$PWD/build/release/obj
    MOC_DIR = $$PWD/build/release/moc
    RCC_DIR = $$PWD/build/release/rcc
    UI_DIR = $$PWD/build/release/ui
}

# Messages
message("Qt version: $$[QT_VERSION]")
message("Project: $$TARGET")
message("Template: $$TEMPLATE")
message("C++ standard: $$QMAKE_CXXFLAGS")
