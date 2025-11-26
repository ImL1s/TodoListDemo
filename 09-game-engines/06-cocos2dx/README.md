# Cocos2d-x TodoList Application

A cross-platform TodoList application built with **Cocos2d-x 4.0** game engine. This demo showcases how to build a functional productivity app using game engine UI components and cross-platform C++ code.

## 📋 Features

### Core Functionality
- **Add/Delete Todos**: Create and remove todo items
- **Toggle Completion**: Mark todos as completed/active with checkbox
- **Filter System**: View All, Active, or Completed todos
- **Statistics**: Real-time count of total, active, and completed items
- **Clear Completed**: Batch delete all completed todos
- **Data Persistence**: Automatic save/load using JSON format

### Technical Features
- Cross-platform (Android, iOS, Windows, macOS)
- Modern C++11 architecture
- MVC pattern (Model-View-Controller)
- JSON data persistence using RapidJSON
- Responsive UI layout
- Custom UI components (TodoItemNode)

## 🏗️ Architecture

```
Classes/
├── AppDelegate.h/cpp           # Application entry point
├── TodoScene.h/cpp             # Main UI scene (View + Controller)
├── TodoItem.h/cpp              # Todo item UI component
├── TodoManager.h/cpp           # Business logic (Model)
└── StorageManager.h/cpp        # Data persistence layer
```

### Design Pattern

**MVC Architecture**:
- **Model**: `TodoManager` - Manages todo data and business logic
- **View**: `TodoScene`, `TodoItemNode` - UI rendering and layout
- **Controller**: `TodoScene` event handlers - User interaction logic

**Singleton Pattern**:
- `TodoManager::getInstance()` - Single source of truth for todo data
- `StorageManager::getInstance()` - Centralized storage management

## 🛠️ Technology Stack

- **Engine**: Cocos2d-x 4.0+
- **Language**: C++11
- **UI**: Cocos2d-x UI extensions (EditBox, ListView, Button, CheckBox)
- **Data Format**: JSON (RapidJSON)
- **Build System**: CMake 3.10+
- **Platforms**: Android, iOS, Windows, macOS

## 📦 Prerequisites

### 1. Download Cocos2d-x Engine

The Cocos2d-x engine is **NOT included** in this repository due to its size (~500MB).

**Download Cocos2d-x 4.0**:
```bash
# Option 1: Download from official website
# Visit: https://www.cocos.com/cocos2dx
# Download: cocos2d-x-4.0.zip

# Option 2: Clone from GitHub
cd 09-game-engines/06-cocos2dx/
git clone https://github.com/cocos2d/cocos2d-x.git --branch v4 --depth 1

# Option 3: Use Cocos2d-x installer (recommended)
# Download and install from https://www.cocos.com/en/cocos2dx/download
```

**Install Dependencies**:
```bash
cd cocos2d-x
python download-deps.py
python setup.py
```

### 2. Platform-Specific Requirements

#### Android
- Android Studio 4.0+
- Android SDK (API 21+)
- Android NDK r21+
- Gradle 7.0+
- CMake 3.10+

#### iOS/macOS
- Xcode 11.0+
- iOS SDK 11.0+
- macOS 10.14+
- CocoaPods (optional)

#### Windows
- Visual Studio 2019 or later
- Windows SDK 10.0+
- CMake 3.10+

## 🚀 Building the Application

### Android

```bash
cd 09-game-engines/06-cocos2dx/proj.android

# Build using Gradle
./gradlew assembleDebug          # Debug build
./gradlew assembleRelease        # Release build

# Install to device
./gradlew installDebug
adb shell am start -n com.example.todolist/org.cocos2dx.lib.Cocos2dxActivity

# Or open in Android Studio
# File > Open > Select proj.android directory
# Click Run button
```

**APK Output**: `proj.android/app/build/outputs/apk/`

### iOS

```bash
cd 09-game-engines/06-cocos2dx/proj.ios_mac

# Generate Xcode project using CMake
mkdir build && cd build
cmake .. -GXcode -DPLATFORM=IOS

# Or use existing Xcode project
open ios/TodoList.xcodeproj

# Build and run:
# 1. Select target device or simulator
# 2. Click Run button (⌘R)
```

### Windows

```bash
cd 09-game-engines/06-cocos2dx/proj.win32

# Option 1: Open Visual Studio solution
# Double-click TodoList.sln
# Build > Build Solution (F7)
# Debug > Start Debugging (F5)

# Option 2: Build with MSBuild
msbuild TodoList.sln /p:Configuration=Debug /p:Platform=Win32
msbuild TodoList.sln /p:Configuration=Release /p:Platform=Win32

# Run executable
Debug.win32\TodoList.exe
```

### macOS

```bash
cd 09-game-engines/06-cocos2dx

# Generate Xcode project
mkdir build && cd build
cmake .. -GXcode

# Build
xcodebuild -project TodoList.xcodeproj -configuration Debug
xcodebuild -project TodoList.xcodeproj -configuration Release

# Run
open Debug/TodoList.app
```

### Linux (Experimental)

```bash
cd 09-game-engines/06-cocos2dx

# Install dependencies (Ubuntu/Debian)
sudo apt-get install g++ libgdk-pixbuf2.0-dev python-pip cmake \
    libx11-dev libxmu-dev libglu1-mesa-dev libgl2ps-dev libxi-dev \
    libzip-dev libpng-dev libcurl4-gnutls-dev libfontconfig1-dev \
    libsqlite3-dev libglew-dev libssl-dev libgtk-3-dev

# Build
mkdir build && cd build
cmake ..
make -j4

# Run
cd bin
./TodoList
```

## 📱 Usage Guide

### Basic Operations

1. **Add Todo**:
   - Type task in input field
   - Click "Add" button or press Enter
   - Todo appears in list

2. **Complete Todo**:
   - Click checkbox next to todo item
   - Text color changes to gray when completed

3. **Delete Todo**:
   - Click "Delete" button on todo item

4. **Filter Todos**:
   - **All**: Show all todos
   - **Active**: Show uncompleted todos only
   - **Completed**: Show completed todos only

5. **Clear Completed**:
   - Click "Clear Completed" button to remove all completed todos

### Data Persistence

- Todos are automatically saved to `todos.json`
- Saved on every change (add/delete/toggle)
- Loaded automatically on app start
- File location:
  - **Android**: `/data/data/com.example.todolist/files/todos.json`
  - **iOS**: `Documents/todos.json`
  - **Windows**: Same directory as executable
  - **macOS**: Application Support directory

## 📂 Project Structure

```
06-cocos2dx/
├── Classes/                    # C++ source files
│   ├── AppDelegate.h/cpp      # App lifecycle
│   ├── TodoScene.h/cpp        # Main UI scene
│   ├── TodoItem.h/cpp         # Todo item widget
│   ├── TodoManager.h/cpp      # Business logic
│   └── StorageManager.h/cpp   # JSON persistence
├── Resources/                  # Game resources
│   ├── fonts/                 # Font files
│   ├── images/                # UI images
│   └── data/                  # Data files
├── proj.android/              # Android project
│   ├── app/
│   │   ├── build.gradle       # App build config
│   │   ├── AndroidManifest.xml
│   │   └── src/
│   ├── build.gradle           # Project build config
│   ├── settings.gradle
│   └── gradle.properties
├── proj.ios_mac/              # iOS/macOS project
│   └── ios/
│       ├── Info.plist         # iOS app metadata
│       └── TodoList.xcodeproj
├── proj.win32/                # Windows project
│   ├── TodoList.sln          # Visual Studio solution
│   ├── TodoList.vcxproj      # Project file
│   ├── main.cpp
│   └── main.h
├── cocos2d/                   # Cocos2d-x engine (not included)
├── CMakeLists.txt            # CMake build config
├── .gitignore
└── README.md                 # This file
```

## 🎨 UI Layout

```
┌──────────────────────────────────┐
│         Todo List               │  ← Title
├──────────────────────────────────┤
│ [Input Field...      ] [Add]    │  ← Input + Add Button
├──────────────────────────────────┤
│  [All] [Active] [Completed]     │  ← Filter Buttons
├──────────────────────────────────┤
│ ☐ Buy groceries     [Delete]    │
│ ☑ Write report      [Delete]    │  ← Todo List
│ ☐ Call dentist      [Delete]    │    (Scrollable)
│                                  │
├──────────────────────────────────┤
│ 3 items | 2 active | 1 completed│  ← Stats
│                  [Clear Comp.]  │  ← Clear Button
└──────────────────────────────────┘
```

## 🎯 Code Highlights

### 1. TodoManager - Business Logic

```cpp
TodoItem TodoManager::addTodo(const std::string& text) {
    auto timestamp = std::chrono::system_clock::now();
    TodoItem item(m_nextId++, text, false, timestamp);
    m_todos.push_back(item);
    saveTodos();
    notifyChanges();
    return item;
}

std::vector<TodoItem> TodoManager::getTodos() const {
    switch (m_currentFilter) {
        case TodoFilter::ALL:
            return m_todos;
        case TodoFilter::ACTIVE:
            return filterByCompleted(false);
        case TodoFilter::COMPLETED:
            return filterByCompleted(true);
    }
}
```

### 2. StorageManager - JSON Persistence

```cpp
bool StorageManager::saveTodos(const std::vector<TodoItem>& todos) {
    std::string jsonStr = todosToJson(todos);
    std::string path = FileUtils::getInstance()->getWritablePath() + "todos.json";
    return FileUtils::getInstance()->writeStringToFile(jsonStr, path);
}

std::vector<TodoItem> StorageManager::loadTodos() {
    std::string path = FileUtils::getInstance()->getWritablePath() + "todos.json";
    if (!FileUtils::getInstance()->isFileExist(path))
        return {};

    std::string jsonStr = FileUtils::getInstance()->getStringFromFile(path);
    return jsonToTodos(jsonStr);
}
```

### 3. TodoItemNode - Custom UI Widget

```cpp
TodoItemNode* TodoItemNode::create(
    const TodoItem& item,
    float width,
    std::function<void(int)> onToggle,
    std::function<void(int)> onDelete)
{
    auto node = new TodoItemNode();
    if (node && node->init(item, width, onToggle, onDelete)) {
        node->autorelease();
        return node;
    }
    return nullptr;
}
```

## 🔍 Key Concepts

### 1. Cocos2d-x Scene Graph
- `Scene` contains all game objects
- `Node` is the base class for all visual elements
- Parent-child hierarchy for layout management

### 2. UI Components
- **EditBox**: Text input field
- **ListView**: Scrollable list container
- **Button**: Clickable button with callbacks
- **CheckBox**: Toggle checkbox with states
- **Label**: Text rendering

### 3. Event Handling
```cpp
m_addButton->addClickEventListener([this](Ref* sender) {
    onAddButtonClicked(sender);
});

m_checkbox->addEventListener([this](Ref* sender, CheckBox::EventType type) {
    if (type == CheckBox::EventType::SELECTED)
        onCheckboxClicked();
});
```

### 4. Resource Management
- Resources loaded from `Resources/` directory
- FileUtils for cross-platform file I/O
- Auto memory management with `autorelease()`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Add todo item
- [ ] Delete todo item
- [ ] Toggle todo completion
- [ ] Filter: All todos
- [ ] Filter: Active todos only
- [ ] Filter: Completed todos only
- [ ] Clear all completed todos
- [ ] App restart (persistence test)
- [ ] Add 50+ todos (scrolling test)
- [ ] Empty input validation
- [ ] Long text wrapping

### Platform Testing

- [ ] Android (Phone)
- [ ] Android (Tablet)
- [ ] iOS (iPhone)
- [ ] iOS (iPad)
- [ ] Windows Desktop
- [ ] macOS Desktop

## 🐛 Troubleshooting

### Build Errors

**Problem**: `cocos2d` not found
```
Solution: Download and place Cocos2d-x engine in cocos2d/ directory
```

**Problem**: CMake version too old
```
Solution: Update CMake to 3.10+
sudo apt-get install cmake  # Linux
brew install cmake          # macOS
```

**Problem**: NDK not found (Android)
```
Solution: Install NDK in Android Studio
Tools > SDK Manager > SDK Tools > NDK (Side by side)
```

### Runtime Issues

**Problem**: App crashes on startup
```
Solution: Check cocos2d-x dependencies are installed
Run: python download-deps.py in cocos2d-x directory
```

**Problem**: EditBox not showing
```
Solution: EditBox requires platform-specific implementation
- Android: Implemented in Java
- iOS: Implemented in Objective-C
- Ensure platform files are included in build
```

**Problem**: Data not persisting
```
Solution: Check file write permissions
- Android: Add WRITE_EXTERNAL_STORAGE permission
- iOS: Uses sandboxed Documents directory
```

## 📊 Performance

- **Memory**: ~50MB (includes engine runtime)
- **App Size**:
  - Android APK: ~15-25MB (per ABI)
  - iOS IPA: ~30-40MB
  - Windows EXE: ~10-20MB
- **Startup Time**: 1-2 seconds
- **FPS**: Locked at 60 FPS (configurable)

## 🔄 Future Enhancements

Potential improvements for learning:

1. **Animations**: Add transitions for add/delete operations
2. **Drag & Drop**: Reorder todos by dragging
3. **Categories**: Organize todos into categories
4. **Due Dates**: Add date picker and reminders
5. **Search**: Filter todos by text search
6. **Cloud Sync**: Sync across devices
7. **Themes**: Dark/light mode toggle
8. **Sounds**: UI feedback sounds
9. **Particles**: Celebration effects on completion
10. **Multi-language**: i18n support

## 📚 Learning Resources

### Cocos2d-x Documentation
- Official Docs: https://docs.cocos2d-x.org/
- API Reference: https://docs.cocos2d-x.org/api-ref/
- Programmer's Guide: https://docs.cocos2d-x.org/cocos2d-x/v4/en/

### Tutorials
- Getting Started: https://docs.cocos2d-x.org/cocos2d-x/v4/en/basic_concepts/
- UI Widgets: https://docs.cocos2d-x.org/cocos2d-x/v4/en/ui/
- File I/O: https://docs.cocos2d-x.org/cocos2d-x/v4/en/other_node_types/

### Community
- Forum: https://discuss.cocos2d-x.org/
- Discord: https://discord.gg/cocos
- GitHub: https://github.com/cocos2d/cocos2d-x

## 📄 License

This TodoList demo is provided as-is for educational purposes.

Cocos2d-x is licensed under the MIT License.
See: https://github.com/cocos2d/cocos2d-x/blob/v4/LICENSE

## 👨‍💻 Development Notes

### Why Cocos2d-x for TodoList?

While Cocos2d-x is primarily a game engine, this demo demonstrates:
- Cross-platform C++ development
- Game engine UI capabilities beyond games
- Performance of game engines for productivity apps
- Learning opportunity for game developers

### Comparison with Native Development

**Advantages**:
- Single C++ codebase for all platforms
- Rich UI components and effects
- High performance rendering
- Easy animations and transitions

**Disadvantages**:
- Larger app size than native
- Steeper learning curve
- Game engine overhead for simple apps
- Platform-specific features require native code

## 🙏 Acknowledgments

- Cocos2d-x team for the excellent game engine
- RapidJSON for fast JSON parsing
- Community contributors and tutorial creators

---

**Built with Cocos2d-x 4.0** | **C++11** | **Cross-Platform**

## 📊 日志和监控

本项目实现了自定义结构化日志系统。

### 日志级别

- **ERROR**: 错误和异常
- **WARN**: 警告
- **INFO**: 重要操作（游戏事件、UI交互）
- **DEBUG**: 调试信息

### 使用日志系统

```cpp
#include "Logger.h"

// 记录信息
Logger::info("Todo created", {
    {"todo_id", std::to_string(todo.id)},
    {"text", todo.text}
});

// 记录错误
Logger::error("Failed to create todo", {
    {"error", errorMsg}
});

// 记录警告
Logger::warn("Slow operation", {
    {"operation", "create_todo"},
    {"duration_ms", std::to_string(duration)}
});
```

### 日志格式

控制台输出格式：

```
[2024-01-01 12:00:00] [INFO] Todo created | todo_id=123, text=Learn Cocos2d-x
[2024-01-01 12:00:01] [ERROR] Failed to create todo | error=Database connection lost
```

### 性能监控

- 记录关键操作执行时间
- 检测慢操作（>100ms）
- FPS 监控
- 内存使用追踪

### 日志文件

日志文件位置：
- iOS: `Documents/logs/`
- Android: `/sdcard/Android/data/[package]/files/logs/`
- Windows/macOS: `./logs/`
