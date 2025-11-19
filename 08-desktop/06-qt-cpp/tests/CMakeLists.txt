cmake_minimum_required(VERSION 3.16)

# Find Qt Test module
find_package(Qt6 REQUIRED COMPONENTS Test)

# Test for TodoModel
add_executable(test_todomodel
    test_todomodel.cpp
    ../src/TodoItem.cpp
    ../src/TodoModel.cpp
    ../src/StorageManager.cpp
)

target_link_libraries(test_todomodel PRIVATE
    Qt6::Core
    Qt6::Test
)

target_include_directories(test_todomodel PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/..
    ${CMAKE_CURRENT_SOURCE_DIR}/../src
)

# Add test to CTest
add_test(NAME TodoModelTest COMMAND test_todomodel)

# Enable testing
enable_testing()
