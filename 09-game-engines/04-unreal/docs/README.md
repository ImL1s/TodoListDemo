# Unreal Engine 5 Todo List Application

A comprehensive, production-ready Todo List application built with Unreal Engine 5, demonstrating modern C++ programming, Blueprint visual scripting, UMG UI system, and game development best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Building the Project](#building-the-project)
- [Project Structure](#project-structure)
- [Core Technologies](#core-technologies)
- [Usage Guide](#usage-guide)
- [Packaging](#packaging)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project showcases a fully-functional Todo List application built entirely in Unreal Engine 5. It demonstrates:

- **Modern C++ Development**: Leveraging UE5's gameplay framework, reflection system, and container classes
- **Blueprint Integration**: Seamless C++ and Blueprint interoperability
- **UMG UI System**: Professional user interface with Slate styling
- **SaveGame System**: Persistent data storage using UE's built-in serialization
- **Event-Driven Architecture**: Delegates and events for reactive UI updates
- **Best Practices**: Clean code, proper memory management, and Unreal coding standards

This is not just a simple demo—it's a reference implementation that can serve as a foundation for larger UE5 UI applications or educational purposes.

## ✨ Features

### Core Functionality
- ✅ **Add Todos**: Create new tasks with titles and optional priorities
- ✅ **Edit Todos**: Modify task titles and properties inline
- ✅ **Delete Todos**: Remove individual tasks or clear all completed
- ✅ **Toggle Completion**: Mark tasks as done/undone with visual feedback
- ✅ **Priority Levels**: Assign Low, Normal, High, or Critical priorities
- ✅ **Filtering**: View All, Active, or Completed todos
- ✅ **Search**: Find todos by title (case-sensitive/insensitive)
- ✅ **Statistics**: Real-time completion percentage and counts

### Technical Features
- 🔧 **C++ Core Logic**: Business logic in optimized C++ classes
- 🎨 **Blueprint UI**: Visual scripting for UI behavior and animations
- 💾 **Auto-Save**: Automatic persistence after each change
- 📊 **Event System**: Reactive UI using delegates and events
- 🎭 **Animations**: Smooth transitions and visual feedback
- 🎯 **Type Safety**: Strongly-typed enums and structs
- 🔍 **Smart Pointers**: Proper memory management with TSharedPtr/TWeakPtr
- 📦 **Modular Design**: Loosely coupled components

### User Experience
- 🖱️ **Intuitive Interface**: Clean, modern design
- ⌨️ **Keyboard Support**: Enter to add, Escape to cancel
- 🎨 **Visual Feedback**: Hover states, animations, color coding
- 📱 **Responsive Layout**: Adapts to different resolutions
- ♿ **Accessibility**: WCAG-compliant contrast and focus indicators

## 📸 Screenshots

*Note: Add screenshots of your application here*

### Main Interface
- Todo list with multiple items
- Filter buttons (All/Active/Completed)
- Statistics display
- Add todo input field

### Todo Item
- Checkbox for completion
- Priority indicator
- Edit and delete buttons
- Inline editing mode

### Priority Levels
- Visual representation of different priorities
- Color-coded indicators

## 🔧 Requirements

### Software Requirements

#### Unreal Engine
- **Version**: Unreal Engine 5.3 or later
- **License**: Free (personal/educational) or commercial license
- **Download**: [Epic Games Launcher](https://www.epicgames.com/store/en-US/download)

#### IDE (Choose One)
- **Visual Studio 2022** (Windows, Recommended)
  - Workload: "Game Development with C++"
  - Individual Components:
    - MSVC v143 or later
    - Windows 10 SDK (latest)
    - C++ profiling tools
    - C++ CMake tools

- **Visual Studio Code** (Cross-platform)
  - Extensions: C/C++, Unreal Engine 4 Snippets

- **Rider** (Cross-platform, Commercial)
  - Built-in Unreal Engine support

#### Other Tools
- **Git**: For version control (optional but recommended)
- **Git LFS**: For large file storage (if using source control)

### Hardware Requirements

#### Minimum Specifications
- **OS**: Windows 10/11 64-bit, macOS 12+, or Ubuntu 20.04+
- **Processor**: Quad-core Intel or AMD, 2.5 GHz or faster
- **Memory**: 8 GB RAM
- **Graphics**: DirectX 11/12 compatible GPU
- **Storage**: 2 GB available space (project only)
- **Additional**: 100 GB for Unreal Engine installation

#### Recommended Specifications
- **OS**: Windows 11 64-bit
- **Processor**: 8-core Intel i7/i9 or AMD Ryzen 7/9, 3+ GHz
- **Memory**: 16 GB RAM or more
- **Graphics**: NVIDIA RTX 2060 or AMD RX 5700 or better
- **Storage**: SSD with 5 GB available space
- **Additional**: 150 GB for Unreal Engine + source code

### Platform Support
This project can be packaged for:
- ✅ Windows (x64)
- ✅ macOS (Intel and Apple Silicon)
- ✅ Linux (x64)
- ❌ Mobile (iOS/Android) - UI would need responsive redesign
- ❌ Consoles - Require platform-specific SDKs

## 🚀 Quick Start

### Option 1: Direct Download (Fastest)

1. **Download the Project**
   ```bash
   git clone https://github.com/your-repo/TodoListDemo.git
   cd TodoListDemo/09-game-engines/04-unreal
   ```

2. **Generate Project Files**
   - **Windows**: Right-click `TodoListUE.uproject` → "Generate Visual Studio project files"
   - **macOS**: Right-click `TodoListUE.uproject` → "Generate Xcode project files"
   - **Linux**:
     ```bash
     ~/UnrealEngine/Engine/Build/BatchFiles/Linux/GenerateProjectFiles.sh TodoListUE.uproject
     ```

3. **Open the Project**
   - Double-click `TodoListUE.uproject`
   - UE5 will open and compile shaders (first time: 5-15 minutes)

4. **Play in Editor**
   - Click the green "Play" button in the toolbar
   - Or press **Alt+P**

### Option 2: From Epic Games Launcher

1. Open Epic Games Launcher
2. Navigate to "Unreal Engine" → "Library"
3. Click "Add" → "Add Existing Project"
4. Browse to `TodoListUE.uproject`
5. Click "Open" to launch the project

### Option 3: From Command Line

```bash
# Windows
"C:\Program Files\Epic Games\UE_5.3\Engine\Binaries\Win64\UnrealEditor.exe" "C:\Path\To\TodoListUE.uproject"

# macOS
"/Users/Shared/Epic Games/UE_5.3/Engine/Binaries/Mac/UnrealEditor.app/Contents/MacOS/UnrealEditor" "/Path/To/TodoListUE.uproject"

# Linux
~/UnrealEngine/Engine/Binaries/Linux/UnrealEditor ~/Path/To/TodoListUE.uproject
```

## 🏗️ Building the Project

### Compiling C++ Code

#### From Visual Studio (Windows)

1. Open `TodoListUE.sln` (generated in project root)
2. Set build configuration to "Development Editor"
3. Set platform to "Win64"
4. Build → Build Solution (Ctrl+Shift+B)
5. Errors will appear in the Output window

#### From Xcode (macOS)

1. Open `TodoListUE.xcworkspace`
2. Select "TodoListUEEditor" scheme
3. Product → Build (Cmd+B)

#### From Visual Studio Code

1. Open project folder
2. Terminal → Run Build Task
3. Select "TodoListUEEditor Win64 Development Build"

#### From Unreal Editor

1. File → Refresh Visual Studio Project (if needed)
2. File → Compile C++ Code
3. Wait for compilation to complete
4. Check Output Log for errors

### Building Blueprints

Blueprints are compiled automatically when:
- Opening the Blueprint editor
- Playing in editor (PIE)
- Packaging the project

To manually compile:
1. Open Blueprint asset
2. Click "Compile" button (or F7)
3. Check for errors in Compiler Results

## 📁 Project Structure

```
09-game-engines/04-unreal/
│
├── TodoListUE.uproject          # Project file
├── .gitignore                   # Git ignore rules
│
├── Source/                      # C++ source code
│   └── TodoListUE/
│       ├── TodoListUE.Build.cs          # Build configuration
│       ├── TodoListUE.h/cpp             # Module definition
│       ├── TodoItem.h                   # Todo data structures
│       ├── TodoManager.h/cpp            # Business logic
│       ├── TodoSaveGame.h/cpp           # Persistence
│       ├── TodoWidgetBase.h/cpp         # Widget base classes
│       └── TodoListUEGameMode.h/cpp     # Game mode
│
├── Content/                     # Game content
│   ├── Blueprints/
│   │   ├── BP_TodoGameMode.uasset       # Game mode Blueprint
│   │   └── BP_TodoManager.uasset        # Manager Blueprint (optional)
│   │
│   ├── UI/
│   │   ├── WBP_MainMenu.uasset          # Main UI widget
│   │   ├── WBP_TodoItem.uasset          # Item widget
│   │   ├── WBP_TodoInput.uasset         # Input dialog
│   │   └── Styles/                      # UI styles and themes
│   │
│   ├── Materials/                       # UI materials
│   │   ├── M_UIBackground.uasset
│   │   └── M_UIButton.uasset
│   │
│   └── Textures/                        # UI textures
│       ├── T_Icon_Check.uasset
│       ├── T_Icon_Delete.uasset
│       └── T_Icon_Edit.uasset
│
├── Config/                      # Configuration files
│   ├── DefaultEngine.ini                # Engine settings
│   ├── DefaultGame.ini                  # Game settings
│   ├── DefaultInput.ini                 # Input bindings
│   └── DefaultEditor.ini                # Editor preferences
│
├── Binaries/                    # Compiled binaries (git ignored)
├── Intermediate/                # Build intermediates (git ignored)
├── Saved/                       # Saved data and logs (git ignored)
│
└── docs/                        # Documentation
    ├── README.md                        # This file
    ├── SETUP_GUIDE.md                   # Detailed setup instructions
    ├── CPP_BLUEPRINT_GUIDE.md           # C++/Blueprint integration
    ├── UMG_GUIDE.md                     # UI system guide
    └── ARCHITECTURE.md                  # Architecture overview
```

## 🛠️ Core Technologies

### Unreal Engine 5 Features Used

#### C++ Gameplay Framework
- **UObject System**: Base class for all UE objects with reflection
- **AActor**: Spawnable game objects (though not heavily used in UI app)
- **UActorComponent**: Modular components
- **GameMode**: Application entry point and lifecycle management
- **SaveGame**: Persistent data serialization

#### Reflection System
- **UCLASS()**: Class reflection macros
- **UPROPERTY()**: Property reflection for serialization and Blueprint access
- **UFUNCTION()**: Function reflection for Blueprint callable/implementable functions
- **USTRUCT()**: Structure reflection for data types
- **UENUM()**: Enumeration reflection

#### Container Classes
- **TArray<T>**: Dynamic array (like std::vector)
- **TMap<K, V>**: Hash map (like std::unordered_map)
- **TSet<T>**: Hash set
- **TSharedPtr<T>**: Reference-counted smart pointer
- **TWeakPtr<T>**: Weak reference to shared pointer
- **TUniquePtr<T>**: Unique ownership smart pointer

#### String Classes
- **FString**: Mutable string (like std::string)
- **FName**: Immutable hashed string for identifiers
- **FText**: Localizable display text

#### UMG (Unreal Motion Graphics)
- **UUserWidget**: Base class for UI widgets
- **Widget Components**: Button, TextBlock, EditableText, etc.
- **Layout Components**: Canvas, Horizontal/Vertical Box, Grid, etc.
- **Widget Animations**: Timeline-based animations
- **Slate**: Low-level UI framework (C++ only)

#### Blueprint Visual Scripting
- **Event Graph**: Main execution graph
- **Functions**: Reusable blueprint functions
- **Macros**: Inline function-like nodes
- **Interfaces**: Contract-based polymorphism
- **Event Dispatchers**: Multicast delegates for events

#### Save Game System
- **USaveGame**: Base class for save data
- **UGameplayStatics**: Utility functions for save/load
- **Serialization**: Automatic serialization of UPROPERTY marked fields

### Design Patterns Implemented

1. **Singleton Pattern**: TodoManager is created once per game session
2. **Observer Pattern**: Event delegates for UI updates
3. **Model-View Pattern**: TodoManager (Model) + Widgets (View)
4. **Factory Pattern**: Widget creation and initialization
5. **Strategy Pattern**: Different filter strategies (All/Active/Completed)

## 📖 Usage Guide

### Basic Operations

#### Adding a Todo
1. Type your task in the input field
2. Press Enter or click "Add" button
3. Todo appears in the list immediately
4. Auto-saves to disk

#### Editing a Todo
1. Click the edit button (pencil icon) on any todo
2. Text becomes editable
3. Modify the text
4. Press Enter or click outside to save
5. Press Escape to cancel

#### Completing a Todo
1. Click the checkbox next to a todo
2. Todo is marked as complete (strike-through)
3. Click again to uncheck

#### Deleting a Todo
1. Click the delete button (trash icon)
2. Optional: Confirmation dialog appears
3. Todo is removed from the list

#### Filtering Todos
- Click "All" to see all todos
- Click "Active" to see only incomplete todos
- Click "Completed" to see only completed todos

#### Clearing Completed
- Click "Clear Completed" button
- All completed todos are removed at once

### Advanced Features

#### Setting Priority
1. Enter edit mode on a todo
2. Select priority from dropdown: Low, Normal, High, Critical
3. Priority is color-coded in the display

#### Searching Todos
1. Use the search box (if implemented in Blueprint)
2. Type search text
3. List filters to matching items

#### Viewing Statistics
- Total todos count
- Active (incomplete) count
- Completed count
- Completion percentage

### Keyboard Shortcuts

- **Enter**: Submit new todo / Save edit
- **Escape**: Cancel edit mode
- **Tab**: Navigate between UI elements
- **Space**: Toggle checkbox when focused
- **Delete**: Delete focused todo (if implemented)

## 📦 Packaging

### Packaging for Windows

1. **Open Package Settings**
   - File → Package Project → Packaging Settings
   - Set "Build Configuration" to "Shipping"

2. **Configure Windows Settings**
   - Platforms → Windows → Windows Settings
   - Verify target platform is Win64

3. **Package the Project**
   - File → Package Project → Windows → Windows (64-bit)
   - Choose output directory
   - Wait for packaging to complete (5-30 minutes)

4. **Find Your Build**
   - Navigate to output directory
   - Find `TodoListUE.exe` in `WindowsNoEditor/TodoListUE/Binaries/Win64/`
   - Distribute the entire `WindowsNoEditor` folder

### Packaging for macOS

1. **Open Package Settings**
   - Same as Windows

2. **Configure macOS Settings**
   - Platforms → Mac → Mac Settings
   - Set minimum macOS version

3. **Package the Project**
   - File → Package Project → Mac
   - Choose output directory
   - Wait for packaging

4. **Find Your Build**
   - Navigate to output directory
   - Find `TodoListUE.app` in `MacNoEditor/`
   - Create DMG for distribution (optional)

### Packaging for Linux

1. **Cross-Compile from Windows** (Recommended)
   - Install Linux toolchain (see UE docs)
   - File → Package Project → Linux → Linux

2. **Native Linux Build**
   - Requires UE5 built from source on Linux
   - Use similar packaging steps as Windows

### Package Size Optimization

- **Exclude Starter Content**: Save ~500 MB
- **Compress Packages**: Enable pak file compression
- **Remove Debug Symbols**: Use Shipping configuration
- **Optimize Assets**: Compress textures, remove unused assets

Expected package sizes:
- Windows: ~100-300 MB (without Starter Content)
- macOS: ~120-350 MB
- Linux: ~100-300 MB

## ⚡ Performance

### Runtime Performance
- **Memory Usage**: ~50-100 MB (excluding engine overhead)
- **CPU Usage**: <5% idle, <10% during animations
- **Startup Time**: 2-5 seconds (after engine initialization)
- **Save/Load Time**: <100ms for typical datasets (100 todos)

### Editor Performance
- **Compile Time**: 10-30 seconds for full C++ rebuild
- **Blueprint Compile**: <1 second per blueprint
- **Play-in-Editor (PIE)**: 3-5 seconds to start

### Optimization Tips
1. Use const references for function parameters
2. Reserve array capacity when size is known
3. Use TWeakPtr for widget references to prevent circular references
4. Minimize Blueprint ticks (use event-driven updates)
5. Cache widget references instead of repeated searches

## 🔍 Troubleshooting

### Common Issues

#### "Failed to open descriptor file"
**Problem**: Project file is corrupted or wrong engine version
**Solution**:
- Verify UE5 version matches project (5.3+)
- Right-click .uproject → Switch Unreal Engine version

#### "Modules are missing or out of date"
**Problem**: C++ code needs recompilation
**Solution**:
- Click "Yes" to rebuild modules
- Or manually build from Visual Studio
- Delete Binaries and Intermediate folders, then rebuild

#### "Could not find definition for module"
**Problem**: .Build.cs file is incorrect or missing dependencies
**Solution**:
- Check TodoListUE.Build.cs for typos
- Ensure all dependencies are listed: Core, CoreUObject, Engine, UMG

#### Widgets Not Appearing
**Problem**: Widget not added to viewport or parent is nullptr
**Solution**:
- Check Level Blueprint adds widget to viewport
- Verify widget initialization in C++
- Check Widget visibility settings

#### Save Game Not Loading
**Problem**: Save file doesn't exist or version mismatch
**Solution**:
- Check Saved/SaveGames/ folder for .sav file
- Verify save slot name matches
- Implement version migration if format changed

#### Performance Issues
**Problem**: Slow UI or editor lag
**Solution**:
- Disable "Use Less CPU when in Background" in Editor Preferences
- Reduce widget tick frequency
- Optimize Blueprint graphs (reduce Tick events)
- Check for memory leaks (dangling references)

### Debug Tools

#### Output Log
- Window → Developer Tools → Output Log
- Shows UE_LOG messages from C++
- Filter by category (LogTemp, LogTodo, etc.)

#### Blueprint Debugger
- Open Blueprint
- Set breakpoints on nodes
- Play in Editor
- Debugger pauses at breakpoints

#### Visual Studio Debugger
- Attach Visual Studio debugger to UE editor
- Debug → Attach to Process → UE5Editor.exe
- Set C++ breakpoints
- Play in Editor

#### Memory Profiler
- Session Frontend → Profiler
- Capture memory snapshot
- Analyze object counts and sizes

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Code Style
- Follow [Unreal Engine Coding Standard](https://docs.unrealengine.com/5.3/en-US/epic-cplusplus-coding-standard-for-unreal-engine/)
- Use PascalCase for classes, variables, functions
- Prefix classes: U (UObject), A (AActor), F (struct), E (enum), I (interface)
- Add Doxygen-style comments to public functions

### Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Testing
- Test in PIE (Play-in-Editor)
- Test packaged build
- Verify save/load functionality
- Check for memory leaks

## 📄 License

This project is provided as-is for educational and reference purposes.

- **Unreal Engine**: Subject to Epic Games' Unreal Engine EULA
- **Project Code**: MIT License (or specify your license)

See LICENSE file for details.

## 🙏 Acknowledgments

- **Epic Games**: For Unreal Engine 5
- **UE Community**: For documentation and tutorials
- **Contributors**: Everyone who has contributed to this project

## 📚 Additional Resources

### Official Documentation
- [Unreal Engine 5 Documentation](https://docs.unrealengine.com/5.3/)
- [C++ API Reference](https://docs.unrealengine.com/5.3/en-US/API/)
- [UMG UI Designer](https://docs.unrealengine.com/5.3/en-US/umg-ui-designer-for-unreal-engine/)
- [Blueprint Visual Scripting](https://docs.unrealengine.com/5.3/en-US/blueprint-visual-scripting-in-unreal-engine/)

### Tutorials
- [Getting Started with UE5](https://dev.epicgames.com/community/learning/paths/Z4/getting-started-with-unreal-engine-5)
- [C++ Programming for UE5](https://dev.epicgames.com/community/learning/courses/KJ/unreal-engine-c-programming-tutorials)
- [UMG Fundamentals](https://dev.epicgames.com/community/learning/courses/1j/unreal-engine-umg-fundamentals)

### Community
- [Unreal Engine Forums](https://forums.unrealengine.com/)
- [UE Discord](https://discord.gg/unreal-slackers)
- [Reddit r/unrealengine](https://www.reddit.com/r/unrealengine/)

---

**Made with ❤️ using Unreal Engine 5**

For questions or support, please open an issue on GitHub.
