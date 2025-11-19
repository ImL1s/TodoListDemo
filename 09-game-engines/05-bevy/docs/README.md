# Bevy Todo List Application

A feature-complete, production-ready Todo List application built with the **Bevy Game Engine**, showcasing the power and flexibility of Bevy's Entity Component System (ECS) architecture for building interactive desktop applications.

![Bevy](https://img.shields.io/badge/Bevy-0.12-blue)
![Rust](https://img.shields.io/badge/Rust-1.75+-orange)
![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Web-lightgrey)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Building for Different Platforms](#building-for-different-platforms)
- [Performance](#performance)
- [Extending the Application](#extending-the-application)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Additional Resources](#additional-resources)

## Overview

This Todo List application demonstrates how to build a complete desktop application using Bevy, a data-driven game engine built in Rust. While Bevy is primarily designed for game development, this project showcases its versatility for building general-purpose GUI applications.

**Why Bevy for a Todo App?**
- **ECS Architecture**: Clean separation of data and logic
- **Performance**: Leverages Rust's speed and Bevy's optimizations
- **Cross-Platform**: Runs on Windows, macOS, Linux, and Web (WASM)
- **Scalability**: Easy to extend with new features
- **Modern**: Built with cutting-edge technology

## Features

### Core Functionality
- ✅ **Add Todos**: Create new todo items with custom text
- ✅ **Delete Todos**: Remove todos individually
- ✅ **Toggle Completion**: Mark todos as complete or incomplete
- ✅ **Filter by Status**: View All, Active, or Completed todos
- ✅ **Clear Completed**: Remove all completed todos at once
- ✅ **Item Counter**: Display count of remaining active todos

### Data Persistence
- 💾 **Auto-Save**: Automatically saves todos every 30 seconds
- 💾 **Manual Save**: Save on-demand with Ctrl+S
- 💾 **Auto-Load**: Loads saved todos on startup
- 💾 **JSON Storage**: Human-readable storage format

### User Experience
- 🎨 **Clean UI**: Modern, minimalist interface
- ⌨️ **Keyboard Support**: Full keyboard navigation and shortcuts
- 🖱️ **Mouse Support**: Click-based interaction
- 🎯 **Visual Feedback**: Button hover effects and state indicators
- 📊 **Debug Mode**: Built-in debugging tools

### Technical Features
- 🚀 **High Performance**: 60+ FPS rendering
- 🔧 **ECS Architecture**: Demonstrates proper ECS design patterns
- 📦 **Modular Design**: Well-organized, reusable code
- 🌐 **WASM Ready**: Can be compiled to WebAssembly
- 📝 **Comprehensive Logging**: Detailed activity logs
- 🧪 **Extensible**: Easy to add new features

## Screenshots

### Main Interface
```
┌─────────────────────────────────────────────┐
│           Bevy Todo List                    │
├─────────────────────────────────────────────┤
│  [Type here...           ] [Add]            │
│                                             │
│  [All] [Active] [Completed]                 │
│                                             │
│  ☐ Buy groceries              [Delete]      │
│  ☑ Complete Bevy project      [Delete]      │
│  ☐ Write documentation        [Delete]      │
│                                             │
│  2 items left        [Clear Completed]      │
└─────────────────────────────────────────────┘
```

*Note: This is a text representation. The actual application uses Bevy's UI system with styled buttons, colors, and layouts.*

## Architecture

This application follows Bevy's ECS (Entity Component System) architecture:

```
┌─────────────┐
│   Entities  │ ← Unique IDs for UI elements and todos
└─────────────┘
       │
       ↓
┌─────────────┐
│ Components  │ ← Data (TodoItem, UIState, etc.)
└─────────────┘
       │
       ↓
┌─────────────┐
│   Systems   │ ← Logic (handle input, update UI, etc.)
└─────────────┘
       │
       ↓
┌─────────────┐
│  Resources  │ ← Global state (TodoList, AppSettings)
└─────────────┘
       │
       ↓
┌─────────────┐
│   Events    │ ← Communication between systems
└─────────────┘
```

For detailed architecture information, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Prerequisites

### Required
- **Rust**: 1.75.0 or later
  - Install from [rustup.rs](https://rustup.rs/)
- **Cargo**: Comes with Rust installation

### Platform-Specific Dependencies

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get install g++ pkg-config libx11-dev libasound2-dev libudev-dev
```

**Linux (Fedora)**:
```bash
sudo dnf install gcc-c++ libX11-devel alsa-lib-devel
```

**macOS**:
No additional dependencies required. Xcode command-line tools recommended.

**Windows**:
Visual Studio 2019 or later with C++ support recommended.

## Installation

### 1. Clone the Repository

```bash
cd TodoListDemo/09-game-engines/05-bevy/
```

### 2. Build the Project

**Debug Build** (faster compilation):
```bash
cargo build
```

**Release Build** (optimized):
```bash
cargo build --release
```

### 3. Run the Application

**Debug Mode**:
```bash
cargo run
```

**Release Mode** (recommended for best performance):
```bash
cargo run --release
```

## Usage

### Basic Operations

1. **Adding a Todo**:
   - Type your todo text in the input field
   - Press `Enter` or click the `Add` button

2. **Completing a Todo**:
   - Click the checkbox next to the todo item
   - The checkbox will turn green and show a checkmark

3. **Deleting a Todo**:
   - Click the `Delete` button on the right side of the todo item

4. **Filtering Todos**:
   - Click `All` to see all todos
   - Click `Active` to see only incomplete todos
   - Click `Completed` to see only completed todos

5. **Clearing Completed**:
   - Click the `Clear Completed` button at the bottom
   - This removes all completed todos at once

### Data Persistence

- **Auto-Save**: The application automatically saves your todos every 30 seconds
- **Auto-Load**: Todos are automatically loaded when you start the application
- **Manual Save**: Press `Ctrl+S` to save immediately
- **Storage Location**:
  - Linux/macOS: `~/.bevy_todos/todos.json`
  - Windows: `%USERPROFILE%\.bevy_todos\todos.json`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Add the current todo |
| `Escape` | Clear the input field |
| `Ctrl+S` | Save todos to disk |
| `Ctrl+O` | Load todos from disk |
| `F1` | Toggle debug mode |
| `F2` | Print todo statistics to console |
| `F3` | Print all todos to console |

## Project Structure

```
05-bevy/
├── Cargo.toml              # Project configuration and dependencies
├── .gitignore              # Git ignore rules
├── src/
│   ├── main.rs             # Application entry point
│   ├── components/         # ECS Components (data structures)
│   │   ├── mod.rs
│   │   ├── todo_item.rs    # Todo item components
│   │   └── ui_components.rs # UI element components
│   ├── systems/            # ECS Systems (logic)
│   │   ├── mod.rs
│   │   ├── setup.rs        # UI initialization
│   │   ├── todo_systems.rs # Todo CRUD operations
│   │   ├── ui_systems.rs   # UI update logic
│   │   └── input_systems.rs # Input handling
│   ├── resources/          # ECS Resources (global state)
│   │   ├── mod.rs
│   │   ├── todo_list.rs    # Todo list management
│   │   └── ui_state.rs     # UI state management
│   ├── events/             # Custom events
│   │   ├── mod.rs
│   │   └── todo_events.rs  # Todo-related events
│   ├── plugins/            # Bevy plugins
│   │   ├── mod.rs
│   │   └── todo_plugin.rs  # Main application plugin
│   └── utils/              # Utility functions
│       ├── mod.rs
│       └── storage.rs      # File I/O operations
├── assets/                 # Asset files
│   ├── fonts/              # Font files (optional)
│   └── images/             # Image files (optional)
└── docs/                   # Documentation
    ├── README.md           # This file
    ├── ECS_GUIDE.md        # ECS architecture guide
    ├── BEVY_CONCEPTS.md    # Bevy concepts explained
    └── ARCHITECTURE.md     # Application architecture
```

## How It Works

### Entity Component System (ECS)

The application uses Bevy's ECS architecture:

1. **Entities**: Each UI element (button, text, container) is an entity
2. **Components**: Data attached to entities (TodoItem, TodoItemUI, etc.)
3. **Systems**: Functions that process entities with specific components
4. **Resources**: Global state shared across systems (TodoList, UIState)
5. **Events**: Communication mechanism between systems

### Data Flow

```
User Input → Input System → Events → Business Logic System →
Resources Updated → UI Rebuild Event → UI System → Rendered Output
```

Example: Adding a Todo
1. User types text and presses Enter
2. `handle_keyboard_input` system detects input
3. System sends `AddTodoEvent`
4. `handle_add_todo` system receives event
5. System updates `TodoList` resource
6. System sends `RebuildUIEvent`
7. `rebuild_todo_list_ui` system rebuilds the UI
8. New todo appears on screen

For more details, see [ECS_GUIDE.md](ECS_GUIDE.md).

## Building for Different Platforms

### Native Desktop

**Windows**:
```bash
cargo build --release
# Executable: target/release/todolist-bevy.exe
```

**macOS**:
```bash
cargo build --release
# Executable: target/release/todolist-bevy
```

**Linux**:
```bash
cargo build --release
# Executable: target/release/todolist-bevy
```

### WebAssembly (WASM)

1. Install the WASM target:
```bash
rustup target add wasm32-unknown-unknown
```

2. Install wasm-bindgen-cli:
```bash
cargo install wasm-bindgen-cli
```

3. Build for WASM:
```bash
cargo build --release --target wasm32-unknown-unknown
```

4. Generate bindings:
```bash
wasm-bindgen --out-dir ./wasm --target web \
  target/wasm32-unknown-unknown/release/todolist-bevy.wasm
```

5. Serve with a local web server:
```bash
# Install basic-http-server if needed
cargo install basic-http-server

# Serve the wasm directory
basic-http-server wasm/
```

## Performance

### Optimization Features

- **Fast Compilation in Dev**: Optimized dependencies even in debug builds
- **Release Optimizations**: LTO and single codegen unit for maximum performance
- **60+ FPS**: Smooth rendering at 60 frames per second or higher
- **Efficient ECS**: Leverages Bevy's optimized ECS implementation
- **Minimal Memory**: Low memory footprint
- **Fast Startup**: Quick application launch time

### Performance Tips

1. **Always use release mode for production**:
   ```bash
   cargo run --release
   ```

2. **Monitor performance** with F1 debug mode

3. **Check logs** for performance warnings

## Extending the Application

### Adding New Features

The modular architecture makes it easy to add features:

1. **New Component**: Add to `src/components/`
2. **New Event**: Add to `src/events/`
3. **New System**: Add to `src/systems/`
4. **Register**: Update `src/plugins/todo_plugin.rs`

### Example: Adding Todo Priority

1. **Component** (`components/todo_item.rs`):
```rust
pub enum Priority {
    Low,
    Medium,
    High,
}

// Add to TodoItem:
pub priority: Priority,
```

2. **Event** (`events/todo_events.rs`):
```rust
pub struct ChangePriorityEvent {
    pub id: u64,
    pub priority: Priority,
}
```

3. **System** (`systems/todo_systems.rs`):
```rust
pub fn handle_change_priority(
    mut todo_list: ResMut<TodoList>,
    mut events: EventReader<ChangePriorityEvent>,
) {
    // Implementation
}
```

4. **Register** (`plugins/todo_plugin.rs`):
```rust
.add_event::<ChangePriorityEvent>()
.add_systems(Update, handle_change_priority)
```

## Troubleshooting

### Build Issues

**Problem**: Compilation errors
**Solution**: Ensure you have Rust 1.75+ and all dependencies installed

**Problem**: Linking errors on Linux
**Solution**: Install required system libraries (see Prerequisites)

### Runtime Issues

**Problem**: Window doesn't open
**Solution**: Check graphics drivers are up to date

**Problem**: Todos not saving
**Solution**: Check file permissions for home directory

**Problem**: Low FPS
**Solution**: Run in release mode with `cargo run --release`

### Getting Help

1. Check the console output for error messages
2. Enable debug mode with F1
3. Review logs in the console
4. Check [Bevy documentation](https://bevyengine.org/)
5. Visit [Bevy Discord](https://discord.gg/bevy)

## Contributing

Contributions are welcome! This project is a learning resource and demonstration.

Areas for contribution:
- UI/UX improvements
- Additional features (tags, due dates, etc.)
- Performance optimizations
- Documentation improvements
- Bug fixes

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Additional Resources

### Learn More About Bevy
- [Official Bevy Book](https://bevyengine.org/learn/book/introduction/)
- [Bevy Examples](https://github.com/bevyengine/bevy/tree/main/examples)
- [Bevy Cheat Book](https://bevy-cheatbook.github.io/)
- [ECS_GUIDE.md](ECS_GUIDE.md) - Deep dive into ECS architecture
- [BEVY_CONCEPTS.md](BEVY_CONCEPTS.md) - Bevy-specific concepts
- [ARCHITECTURE.md](ARCHITECTURE.md) - This application's architecture

### Learn More About Rust
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings](https://github.com/rust-lang/rustlings) - Interactive exercises

### Community
- [Bevy Discord](https://discord.gg/bevy)
- [Rust Community](https://www.rust-lang.org/community)
- [r/bevy on Reddit](https://www.reddit.com/r/bevy/)

---

**Built with ❤️ using Bevy and Rust**

*This application demonstrates that Bevy isn't just for games – it's a powerful framework for any interactive application!*
