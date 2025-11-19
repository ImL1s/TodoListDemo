cmake_minimum_required(VERSION 3.16)

project(QtTodoList VERSION 1.0.0 LANGUAGES CXX)

# Qt Configuration
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Qt6 packages
find_package(Qt6 REQUIRED COMPONENTS Core Widgets)

# Optional: Find Qt6 Test for testing
find_package(Qt6 COMPONENTS Test QUIET)

# Project source files
set(PROJECT_SOURCES
    main.cpp
    src/TodoItem.h
    src/TodoItem.cpp
    src/TodoModel.h
    src/TodoModel.cpp
    src/StorageManager.h
    src/StorageManager.cpp
    src/MainWindow.h
    src/MainWindow.cpp
)

# Resource files
set(PROJECT_RESOURCES
    resources/resources.qrc
)

# Create executable
if(WIN32)
    # Windows: Create GUI application (no console window)
    add_executable(QtTodoList WIN32
        ${PROJECT_SOURCES}
        ${PROJECT_RESOURCES}
    )
elseif(APPLE)
    # macOS: Create app bundle
    add_executable(QtTodoList MACOSX_BUNDLE
        ${PROJECT_SOURCES}
        ${PROJECT_RESOURCES}
    )
    # Set macOS bundle properties
    set_target_properties(QtTodoList PROPERTIES
        MACOSX_BUNDLE_GUI_IDENTIFIER com.todolisdemo.QtTodoList
        MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
        MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
        MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/Info.plist
    )
else()
    # Linux: Standard executable
    add_executable(QtTodoList
        ${PROJECT_SOURCES}
        ${PROJECT_RESOURCES}
    )
endif()

# Link Qt libraries
target_link_libraries(QtTodoList PRIVATE
    Qt6::Core
    Qt6::Widgets
)

# Include directories
target_include_directories(QtTodoList PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/src
)

# Compiler warnings
if(MSVC)
    target_compile_options(QtTodoList PRIVATE /W4)
else()
    target_compile_options(QtTodoList PRIVATE -Wall -Wextra -Wpedantic)
endif()

# Installation rules
install(TARGETS QtTodoList
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)

# Windows: Deploy Qt DLLs
if(WIN32)
    # Use windeployqt to copy Qt DLLs
    get_target_property(_qmake_executable Qt6::qmake IMPORTED_LOCATION)
    get_filename_component(_qt_bin_dir "${_qmake_executable}" DIRECTORY)
    find_program(WINDEPLOYQT_EXECUTABLE windeployqt HINTS "${_qt_bin_dir}")

    if(WINDEPLOYQT_EXECUTABLE)
        add_custom_command(TARGET QtTodoList POST_BUILD
            COMMAND "${WINDEPLOYQT_EXECUTABLE}"
                    --no-compiler-runtime
                    --no-translations
                    "$<TARGET_FILE:QtTodoList>"
            COMMENT "Running windeployqt..."
        )
    endif()
endif()

# macOS: Deploy Qt frameworks
if(APPLE)
    get_target_property(_qmake_executable Qt6::qmake IMPORTED_LOCATION)
    get_filename_component(_qt_bin_dir "${_qmake_executable}" DIRECTORY)
    find_program(MACDEPLOYQT_EXECUTABLE macdeployqt HINTS "${_qt_bin_dir}")

    if(MACDEPLOYQT_EXECUTABLE)
        add_custom_command(TARGET QtTodoList POST_BUILD
            COMMAND "${MACDEPLOYQT_EXECUTABLE}"
                    "$<TARGET_BUNDLE_DIR:QtTodoList>"
            COMMENT "Running macdeployqt..."
        )
    endif()
endif()

# Testing
if(Qt6Test_FOUND AND BUILD_TESTING)
    enable_testing()
    add_subdirectory(tests)
endif()

# Print configuration summary
message(STATUS "=== Qt Todo List Configuration ===")
message(STATUS "Qt version: ${Qt6Core_VERSION}")
message(STATUS "Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "C++ standard: ${CMAKE_CXX_STANDARD}")
message(STATUS "Install prefix: ${CMAKE_INSTALL_PREFIX}")
message(STATUS "==================================")
