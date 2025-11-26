# Qt C++ Todo List Application

A professional, production-ready todo list application built with **Qt 6** and **C++17**, showcasing modern C++ development practices and the Qt framework's powerful features.

![Qt Todo List](https://img.shields.io/badge/Qt-6.x-green.svg)
![C++](https://img.shields.io/badge/C++-17-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Building](#building)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

This Qt Todo List application is a comprehensive demonstration of professional desktop application development using Qt and modern C++. It implements a clean, maintainable architecture following the **Model-View-ViewModel (MVVM)** pattern and showcases Qt's most important features including:

- **Signals & Slots** - Qt's elegant event handling mechanism
- **Model/View Architecture** - Separation of data and presentation
- **Persistent Storage** - Data preservation using QSettings
- **Resource System** - Embedded resources for deployment
- **Cross-Platform Support** - Single codebase for Windows, macOS, and Linux
- **Modern C++** - Smart pointers, RAII, const correctness

The application provides a complete todo list management system with features like filtering, priority management, theme switching, and import/export capabilities.

## ✨ Features

### Core Functionality

- ✅ **Create Todos** - Add new todo items with custom titles and priority levels
- ✏️ **Edit Todos** - Modify existing todo items inline or via dialog
- ❌ **Delete Todos** - Remove individual todos or bulk delete completed items
- ☑️ **Toggle Completion** - Mark todos as complete/incomplete with visual feedback
- 🎯 **Priority Management** - Assign priority levels (Low, Normal, High, Urgent)
- 📁 **Categories/Tags** - Organize todos with custom categories

### Filtering & Views

- 🔍 **Smart Filters** - View All, Active, or Completed todos
- 📊 **Real-time Statistics** - Live count of total, active, and completed items
- 🎨 **Visual Feedback** - Alternating row colors and hover effects
- 🔄 **Dynamic Updates** - Automatic UI refresh on data changes

### User Interface

- 🎨 **Theme Support** - Light and Dark themes with smooth transitions
- ⌨️ **Keyboard Shortcuts** - Efficient workflow with keyboard navigation
  - `Ctrl+N` - New todo
  - `Delete` - Remove selected todo
  - `Space` - Toggle completion
  - `F2` - Edit selected todo
  - `Ctrl+L` - Clear completed
  - `Ctrl+T` - Toggle theme
  - `F1/F2/F3` - Filter shortcuts
- 🖱️ **Context Menus** - Right-click for quick actions
- 📱 **Responsive Layout** - Adapts to different window sizes
- 🎯 **Native Look & Feel** - Platform-specific styling (Windows, macOS, Linux)

### Data Management

- 💾 **Persistent Storage** - Auto-save using QSettings (JSON format)
- 📤 **Export** - Export all todos to JSON file for backup
- 📥 **Import** - Import todos from JSON file
- 🔒 **Data Integrity** - Automatic validation and error handling
- 🆔 **UUID Tracking** - Unique identifiers for each todo item
- 📅 **Timestamps** - Track creation and modification dates

### Advanced Features

- 🪟 **Window State Persistence** - Remembers size, position, and theme preference
- 📊 **Status Bar** - Real-time statistics and operation feedback
- 🛠️ **Toolbar** - Quick access to common operations
- 📋 **Menu Bar** - Complete application menu with shortcuts
- 🎨 **Custom Styling** - Qt Style Sheets (QSS) for theming
- 🧪 **Unit Tests** - Qt Test Framework integration

## 📸 Screenshots

### Light Theme
```
┌─────────────────────────────────────────────────────────────┐
│ File   View   Help                                    🔲 ⬜ ✖️ │
├─────────────────────────────────────────────────────────────┤
│ 🆕 ✏️ ❌  │  ☑️  │  🧹  │  🎨                              │
├─────────────────────────────────────────────────────────────┤
│ What needs to be done?             [Normal ▼]  [Add]        │
├─────────────────────────────────────────────────────────────┤
│ Filter: ⚪ All  ⚪ Active  ⚪ Completed                      │
├─────────────────────────────────────────────────────────────┤
│ ☐ Buy groceries                               [Normal]      │
│ ☑ Complete Qt project                         [High]        │
│ ☐ Write documentation                         [Urgent]      │
│ ☐ Review pull requests                        [Low]         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ [Remove Selected]  [Clear Completed]                        │
├─────────────────────────────────────────────────────────────┤
│ Ready                     Total: 4 | Active: 3 | Completed: 1│
└─────────────────────────────────────────────────────────────┘
```

### Dark Theme
The application features a modern dark theme with carefully chosen colors to reduce eye strain during extended use.

## 🏗️ Architecture

This application follows the **Model-View-ViewModel (MVVM)** architectural pattern:

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        View Layer                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │         MainWindow (QMainWindow)                │   │
│  │  - QListView (displays todos)                   │   │
│  │  - QLineEdit (input field)                      │   │
│  │  - QPushButton (action buttons)                 │   │
│  │  - QRadioButton (filter controls)               │   │
│  │  - Menus, Toolbars, Status Bar                  │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↕                              │
│                   Signals & Slots                       │
│                          ↕                              │
│                    ViewModel Layer                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │        TodoModel (QAbstractListModel)           │   │
│  │  - Manages todo item collection                 │   │
│  │  - Implements filtering logic                   │   │
│  │  - Provides Qt Model/View interface             │   │
│  │  - Emits change notifications                   │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↕                              │
│                      Model Layer                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │             TodoItem (Data Model)               │   │
│  │  - Encapsulates todo properties                 │   │
│  │  - JSON serialization/deserialization           │   │
│  │  - Business logic (toggle, validation)          │   │
│  └─────────────────────────────────────────────────┘   │
│                          ↕                              │
│                   Persistence Layer                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │          StorageManager                         │   │
│  │  - QSettings (JSON format)                      │   │
│  │  - SQLite support (optional)                    │   │
│  │  - Import/Export functionality                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**MainWindow (View)**
- Handles all UI components and user interactions
- Connects to model signals for data updates
- Manages application state (theme, window position)
- Provides user feedback (messages, dialogs)

**TodoModel (ViewModel)**
- Implements `QAbstractListModel` interface
- Manages the collection of `TodoItem` objects
- Provides filtering capabilities (All/Active/Completed)
- Emits signals when data changes
- Coordinates with `StorageManager` for persistence

**TodoItem (Model)**
- Represents a single todo item
- Contains properties: id, title, completed, priority, timestamps
- Provides JSON serialization
- Implements business logic (validation, toggle)

**StorageManager (Persistence)**
- Abstracts storage implementation details
- Supports multiple backends (QSettings, SQLite)
- Handles data serialization/deserialization
- Provides import/export functionality

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 📋 Requirements

### Minimum Requirements

- **Qt Version**: Qt 6.0 or higher (Qt 6.5+ recommended)
- **C++ Compiler**:
  - Windows: MSVC 2019+ or MinGW 11+
  - macOS: Clang 13+ (Xcode 13+)
  - Linux: GCC 9+ or Clang 10+
- **CMake**: 3.16 or higher (for CMake build)
- **Operating System**:
  - Windows 10/11
  - macOS 10.15 (Catalina) or higher
  - Linux (Ubuntu 20.04+, Fedora 34+, or equivalent)

### Recommended Development Tools

- **Qt Creator** 9.0+ (official IDE with excellent Qt integration)
- **Visual Studio 2022** (Windows, with Qt VS Tools)
- **CLion** 2023+ (cross-platform, CMake-based)
- **VS Code** (with C++ and CMake extensions)

### Qt Modules Used

- Qt Core (required)
- Qt Widgets (required)
- Qt Test (optional, for testing)

## 🚀 Installation

### Installing Qt

#### Option 1: Qt Online Installer (Recommended)

1. Download the Qt Online Installer from [qt.io/download](https://www.qt.io/download)
2. Run the installer and create a Qt account (free for open-source)
3. Select Qt 6.5+ for your platform
4. Choose components:
   - ✅ Desktop (gcc/clang/msvc)
   - ✅ Qt Creator
   - ✅ CMake
   - ✅ Ninja

#### Option 2: Package Manager

**macOS (Homebrew)**:
```bash
brew install qt@6
brew install cmake
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install qt6-base-dev qt6-tools-dev cmake build-essential
```

**Linux (Fedora)**:
```bash
sudo dnf install qt6-qtbase-devel qt6-qttools-devel cmake gcc-c++
```

#### Option 3: vcpkg (Cross-platform)
```bash
vcpkg install qt6-base qt6-widgets
```

### Cloning the Repository

```bash
cd TodoListDemo/08-desktop/06-qt-cpp
```

## 🔨 Building

Comprehensive build instructions for all platforms are available in [BUILD_GUIDE.md](BUILD_GUIDE.md).

### Quick Start with CMake

```bash
# Create build directory
mkdir build && cd build

# Configure
cmake ..

# Build
cmake --build .

# Run
./QtTodoList  # Linux/macOS
# or
QtTodoList.exe  # Windows
```

### Quick Start with qmake

```bash
# Generate Makefile
qmake todo-list.pro

# Build
make  # Linux/macOS
# or
nmake  # Windows with MSVC
# or
mingw32-make  # Windows with MinGW

# Run
./QtTodoList  # Linux/macOS
# or
release\QtTodoList.exe  # Windows
```

### Quick Start with Qt Creator

1. Open Qt Creator
2. File → Open File or Project
3. Select `CMakeLists.txt` or `todo-list.pro`
4. Configure project with your Qt kit
5. Click the green "Run" button (Ctrl+R)

## 📖 Usage

### Basic Operations

1. **Adding a Todo**
   - Type your todo text in the input field
   - Select priority level (optional)
   - Press Enter or click "Add" button

2. **Completing a Todo**
   - Double-click on a todo item
   - OR select the item and press Space
   - OR right-click and select "Toggle Completion"

3. **Editing a Todo**
   - Select a todo and press F2
   - OR right-click and select "Edit Todo"
   - Modify the text in the dialog and click OK

4. **Deleting a Todo**
   - Select a todo and press Delete
   - OR click "Remove Selected" button
   - OR right-click and select "Remove Todo"

5. **Filtering Todos**
   - Click "All" to see all todos
   - Click "Active" to see incomplete todos
   - Click "Completed" to see finished todos
   - OR use F1/F2/F3 shortcuts

6. **Clearing Completed**
   - Click "Clear Completed" button (Ctrl+L)
   - Confirm the action in the dialog

7. **Changing Theme**
   - Press Ctrl+T to toggle between light and dark themes
   - OR use View → Toggle Theme menu

### Import/Export

**Exporting Todos**:
1. File → Export... (Ctrl+E)
2. Choose location and filename
3. Click Save

**Importing Todos**:
1. File → Import... (Ctrl+I)
2. Select a JSON file
3. Confirm import
4. Imported todos are added to existing ones

### Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New todo (focus input field) |
| `Enter` | Add todo (when input has focus) |
| `Delete` | Remove selected todo |
| `Space` | Toggle completion |
| `F2` | Edit selected todo |
| `Ctrl+L` | Clear completed todos |
| `Ctrl+E` | Export todos |
| `Ctrl+I` | Import todos |
| `Ctrl+T` | Toggle theme |
| `F1` | Show all todos |
| `F2` | Show active todos |
| `F3` | Show completed todos |
| `Ctrl+Q` | Quit application |

## 📁 Project Structure

```
06-qt-cpp/
├── CMakeLists.txt           # CMake build configuration
├── todo-list.pro            # qmake project file
├── main.cpp                 # Application entry point
├── .gitignore              # Git ignore rules
│
├── src/                    # Source files
│   ├── TodoItem.h          # Todo item data model (header)
│   ├── TodoItem.cpp        # Todo item implementation
│   ├── TodoModel.h         # Todo list model (header)
│   ├── TodoModel.cpp       # Todo list model implementation
│   ├── StorageManager.h    # Persistence layer (header)
│   ├── StorageManager.cpp  # Persistence implementation
│   ├── MainWindow.h        # Main window (header)
│   └── MainWindow.cpp      # Main window implementation
│
├── ui/                     # Qt Designer UI files (optional)
│   └── mainwindow.ui       # Main window UI definition
│
├── resources/              # Application resources
│   ├── resources.qrc       # Qt Resource Collection
│   ├── styles/            # Style sheets
│   │   ├── light.qss      # Light theme
│   │   └── dark.qss       # Dark theme
│   └── icons/             # Application icons
│       ├── app.png        # Application icon
│       └── ...            # Other icons
│
├── tests/                  # Unit tests
│   ├── CMakeLists.txt     # Test build configuration
│   └── test_todomodel.cpp # TodoModel unit tests
│
└── docs/                   # Documentation
    ├── README.md          # This file
    ├── BUILD_GUIDE.md     # Comprehensive build instructions
    ├── QT_CONCEPTS.md     # Qt concepts and patterns
    └── ARCHITECTURE.md    # Architecture deep dive
```

## 🛠️ Technologies

### Core Technologies

- **Qt 6** - Cross-platform application framework
  - Qt Core - Core non-GUI functionality
  - Qt Widgets - Desktop UI components
  - Qt Test - Unit testing framework

- **C++17** - Modern C++ standard
  - Smart pointers (`std::unique_ptr`, `QScopedPointer`)
  - RAII (Resource Acquisition Is Initialization)
  - Lambda expressions
  - Range-based for loops
  - Structured bindings

### Qt Features Demonstrated

1. **Signals & Slots**
   - Type-safe callback mechanism
   - Automatic connection management
   - Cross-thread communication support

2. **Model/View Architecture**
   - `QAbstractListModel` implementation
   - Custom data roles
   - Filtered views

3. **Meta-Object System**
   - Run-time type information
   - Property system
   - Signal/slot introspection

4. **Resource System**
   - Embedded resources (`.qrc`)
   - Platform-independent resource access
   - Stylesheet resources

5. **Settings Management**
   - `QSettings` for persistent configuration
   - Platform-specific storage locations
   - Automatic serialization

6. **JSON Serialization**
   - `QJsonDocument`, `QJsonObject`, `QJsonArray`
   - Import/export functionality
   - Data interchange format

### Build Systems

- **CMake** - Modern, cross-platform build system
- **qmake** - Qt's traditional build system

### Design Patterns

- **MVVM** (Model-View-ViewModel)
- **Observer** (via Signals & Slots)
- **Factory** (for object creation)
- **Singleton** (for application-wide settings)

## 📚 Learning Resources

To better understand the concepts used in this application, see:

- [QT_CONCEPTS.md](QT_CONCEPTS.md) - Deep dive into Qt concepts
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture patterns and decisions
- [BUILD_GUIDE.md](BUILD_GUIDE.md) - Platform-specific build instructions

### Official Qt Documentation

- [Qt Documentation](https://doc.qt.io/)
- [Qt Widgets](https://doc.qt.io/qt-6/qtwidgets-index.html)
- [Model/View Programming](https://doc.qt.io/qt-6/model-view-programming.html)
- [Signals & Slots](https://doc.qt.io/qt-6/signalsandslots.html)

## 🧪 Testing

The project includes unit tests using Qt Test Framework.

### Running Tests

**With CMake**:
```bash
cd build
cmake .. -DBUILD_TESTING=ON
cmake --build .
ctest --verbose
```

**Manual Test Execution**:
```bash
./test_todomodel  # Linux/macOS
test_todomodel.exe  # Windows
```

### Test Coverage

The test suite covers:
- TodoItem creation, modification, and serialization
- TodoModel CRUD operations
- Filtering logic (All/Active/Completed)
- Signal emissions
- Data persistence

## 🤝 Contributing

Contributions are welcome! This project serves as an educational resource and production template.

### Areas for Contribution

1. **Additional Features**
   - Due dates and reminders
   - Tags/categories with color coding
   - Search functionality
   - Sorting options
   - Multiple todo lists

2. **Enhancements**
   - Drag-and-drop reordering
   - Undo/redo functionality
   - Accessibility improvements
   - Internationalization (i18n)
   - Custom delegates for rich rendering

3. **Documentation**
   - More code examples
   - Video tutorials
   - Translation to other languages

4. **Testing**
   - Integration tests
   - UI tests
   - Performance benchmarks

## 📄 License

This project is part of the TodoListDemo collection and is provided as an educational resource.

MIT License - See LICENSE file for details.

## 🙏 Acknowledgments

- **Qt Project** - For the excellent Qt framework
- **C++ Community** - For modern C++ best practices
- **TodoMVC** - For inspiration on todo app features

## 📞 Support

For questions or issues:

1. Check the [BUILD_GUIDE.md](BUILD_GUIDE.md) for build problems
2. Review [QT_CONCEPTS.md](QT_CONCEPTS.md) for understanding Qt features
3. Consult [Qt Documentation](https://doc.qt.io/) for Qt-specific questions
4. Open an issue in the repository

## 🔄 Version History

- **1.0.0** (Current)
  - Initial release
  - Complete MVVM implementation
  - Light/Dark themes
  - Import/Export functionality
  - Comprehensive documentation
  - Unit tests

## 🎯 Future Roadmap

- [ ] Qt Quick (QML) alternative implementation
- [ ] SQLite persistence backend
- [ ] Cloud synchronization
- [ ] Mobile versions (Qt for Android/iOS)
- [ ] Collaborative features
- [ ] Plugin system
- [ ] Advanced theming engine

---

**Built with ❤️ using Qt Framework and Modern C++**
