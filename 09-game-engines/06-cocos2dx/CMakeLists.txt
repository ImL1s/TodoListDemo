cmake_minimum_required(VERSION 3.10)

set(APP_NAME TodoList)
project(${APP_NAME})

# Cocos2d-x root path
set(COCOS2DX_ROOT_PATH ${CMAKE_CURRENT_SOURCE_DIR}/cocos2d)

# CMake module path
set(CMAKE_MODULE_PATH ${COCOS2DX_ROOT_PATH}/cmake/Modules/)

# Include Cocos build settings
include(CocosBuildSet)

# Add Cocos2d-x engine
add_subdirectory(${COCOS2DX_ROOT_PATH}/cocos ${ENGINE_BINARY_PATH}/cocos/core)

# Set C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Application source files
set(APP_SRC
    Classes/AppDelegate.cpp
    Classes/TodoScene.cpp
    Classes/TodoItem.cpp
    Classes/TodoManager.cpp
    Classes/StorageManager.cpp
)

# Application header files
set(APP_HEADERS
    Classes/AppDelegate.h
    Classes/TodoScene.h
    Classes/TodoItem.h
    Classes/TodoManager.h
    Classes/StorageManager.h
)

# Platform-specific source files
if(ANDROID)
    list(APPEND APP_SRC
        proj.android/app/jni/hellocpp/main.cpp
    )
elseif(LINUX)
    list(APPEND APP_SRC
        proj.linux/main.cpp
    )
elseif(WINDOWS)
    list(APPEND APP_SRC
        proj.win32/main.cpp
    )
    list(APPEND APP_HEADERS
        proj.win32/main.h
        proj.win32/resource.h
    )
elseif(APPLE)
    if(IOS)
        list(APPEND APP_SRC
            proj.ios_mac/ios/main.m
            proj.ios_mac/ios/AppController.mm
        )
        list(APPEND APP_HEADERS
            proj.ios_mac/ios/AppController.h
        )
    else()
        list(APPEND APP_SRC
            proj.ios_mac/mac/main.cpp
        )
    endif()
endif()

# Include directories
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/Classes
    ${COCOS2DX_ROOT_PATH}/cocos
    ${COCOS2DX_ROOT_PATH}/cocos/platform
    ${COCOS2DX_ROOT_PATH}/cocos/audio/include
    ${COCOS2DX_ROOT_PATH}/external
)

# Create executable
if(ANDROID)
    add_library(${APP_NAME} SHARED ${APP_SRC} ${APP_HEADERS})
    IF(CMAKE_BUILD_TYPE MATCHES RELEASE)
        ADD_CUSTOM_COMMAND(TARGET ${APP_NAME} POST_BUILD COMMAND ${CMAKE_STRIP} lib${APP_NAME}.so)
    ENDIF()
else()
    add_executable(${APP_NAME} ${APP_SRC} ${APP_HEADERS})
endif()

# Link libraries
target_link_libraries(${APP_NAME} cocos2d)

# Copy resources
set(APP_RES_DIR "${CMAKE_CURRENT_SOURCE_DIR}/Resources")
if(APPLE)
    set_target_properties(${APP_NAME} PROPERTIES
        MACOSX_BUNDLE 1
        RESOURCE "${APP_RES_DIR}"
    )
elseif(WINDOWS)
    # Copy DLLs and resources to output directory
    add_custom_command(TARGET ${APP_NAME} POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_directory
        ${APP_RES_DIR} $<TARGET_FILE_DIR:${APP_NAME}>/Resources
    )
endif()

# Set output directories
set_target_properties(${APP_NAME} PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
    ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
)
