# GTK Todo List Application

A modern, feature-rich todo list application built with GTK4 and the GObject system, showcasing best practices in Linux desktop application development.

![Todo List Application](../data/todolist-gtk.svg)

## Overview

This is a complete implementation of a Todo List application using GTK4 (the latest version of the GNOME toolkit) and demonstrates professional C programming practices, the GObject type system, and modern Linux desktop development patterns.

## Features

### Core Functionality
- **Create Todos**: Add new todo items with a simple, intuitive interface
- **Mark as Complete**: Toggle completion status with checkbox controls
- **Delete Todos**: Remove individual items with a single click
- **Edit Todos**: Modify todo item titles (through the GObject property system)
- **Persistent Storage**: Automatically saves and loads todos using JSON format
- **Filter Views**: Display All, Active, or Completed items
- **Clear Completed**: Batch remove all completed items
- **Real-time Stats**: View counts of total, active, and completed items

### Technical Features
- **GTK4**: Latest GTK toolkit with modern UI components
- **GObject System**: Full implementation of GObject type system
- **Property System**: Proper use of GObject properties with notify signals
- **Signal System**: Custom signals for inter-component communication
- **Reference Counting**: Proper memory management with GObject refcounting
- **GListStore**: Modern list model for efficient data management
- **JSON Persistence**: Using json-glib for data serialization
- **Internationalization**: Full i18n support with gettext
- **Adwaita Theme**: Native integration with GNOME's Adwaita theme
- **Keyboard Shortcuts**: Ctrl+Q to quit, Ctrl+N for new item (future)
- **Autosave**: Automatic saving every 30 seconds

### UI/UX Features
- **Header Bar**: Modern GTK4 header bar design
- **Responsive Layout**: Adapts to different window sizes
- **Visual Feedback**: Strikethrough text for completed items
- **Hover Effects**: Button highlighting on mouse hover
- **Status Bar**: Real-time statistics display
- **Empty State**: Helpful messaging when list is empty
- **Smooth Animations**: CSS transitions for state changes

## Screenshots Description

The application features:
1. A clean header bar with the application title
2. An entry field with "What needs to be done?" placeholder
3. A scrollable list of todo items with checkboxes
4. Filter buttons (All/Active/Completed) for viewing subsets
5. A "Clear Completed" button for batch operations
6. A status label showing item counts

## Requirements

### System Requirements
- **Operating System**: Linux (tested on Ubuntu 20.04+, Fedora 35+, Arch Linux)
- **Desktop Environment**: Any (GNOME, KDE, XFCE, etc.)
- **Display**: X11 or Wayland
- **Memory**: 50MB RAM minimum
- **Disk Space**: 5MB installed

### Build Dependencies
- **GTK4**: Version 4.0 or later
- **GLib**: Version 2.66 or later
- **json-glib**: Version 1.6 or later
- **GCC**: Version 9.0 or later (or Clang 10+)
- **pkg-config**: For dependency detection
- **Meson** (optional): Version 0.55+ for modern builds
- **gettext**: For internationalization

### Runtime Dependencies
- GTK4 libraries
- GLib libraries
- json-glib library

## Installation

### Ubuntu/Debian
```bash
# Install dependencies
sudo apt update
sudo apt install libgtk-4-dev libjson-glib-dev build-essential pkg-config meson

# Clone or navigate to project directory
cd 08-desktop/08-gtk-linux

# Option 1: Build with Meson (recommended)
meson setup build
meson compile -C build
sudo meson install -C build

# Option 2: Build with Make
make
sudo make install
```

### Fedora/RHEL/CentOS
```bash
# Install dependencies
sudo dnf install gtk4-devel json-glib-devel gcc pkg-config meson gettext

# Build and install
cd 08-desktop/08-gtk-linux
meson setup build
meson compile -C build
sudo meson install -C build
```

### Arch Linux
```bash
# Install dependencies
sudo pacman -S gtk4 json-glib base-devel meson

# Build and install
cd 08-desktop/08-gtk-linux
meson setup build
meson compile -C build
sudo meson install -C build
```

## Building from Source

### Using Meson (Recommended)

Meson is the modern build system recommended by GNOME:

```bash
# Configure the build
meson setup build --prefix=/usr/local --buildtype=release

# Compile
meson compile -C build

# Run tests
meson test -C build

# Install
sudo meson install -C build
```

Build options:
```bash
# Debug build with symbols
meson setup build --buildtype=debug

# With custom prefix
meson setup build --prefix=$HOME/.local

# Clean build
rm -rf build
```

### Using Make

For simpler builds without Meson:

```bash
# Build
make

# Run without installing
make run

# Install to /usr/local/bin
sudo make install

# Uninstall
sudo make uninstall

# Clean build files
make clean

# Check dependencies
make check-deps

# Debug build
make debug

# Release build
make release
```

## Running

After installation:
```bash
# From application menu
# Look for "Todo List" in your application launcher

# From terminal
todolist-gtk

# Or if installed locally
~/.local/bin/todolist-gtk
```

Without installation:
```bash
# Using Meson
./build/todolist-gtk

# Using Make
./bin/todolist-gtk
```

## Usage

### Adding Todos
1. Type your task in the entry field at the top
2. Press Enter or click the "Add" button
3. The item appears in the list below

### Completing Todos
- Click the checkbox next to any item to mark it complete
- Completed items show strikethrough text and dimmed appearance
- Click again to mark as incomplete

### Deleting Todos
- Click the trash icon on the right side of any item
- The item is immediately removed from the list

### Filtering
- Click "All" to see all items (default)
- Click "Active" to see only incomplete items
- Click "Completed" to see only completed items

### Clearing Completed
- Click "Clear Completed" button at the bottom
- All completed items are removed at once
- Button is disabled when there are no completed items

### Data Persistence
- Todos are automatically saved to `~/.local/share/todolist-gtk/todos.json`
- Data loads automatically when you start the application
- Autosave occurs every 30 seconds
- Manual save happens when closing the application

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Q   | Quit application |
| Ctrl+N   | Focus new todo entry (planned) |
| Enter    | Add new todo (when entry is focused) |
| Escape   | Clear entry field (planned) |

## Configuration

### Data Location
Todos are stored in: `~/.local/share/todolist-gtk/todos.json`

### Customizing Styles
You can customize the appearance by:
1. Creating a custom CSS file
2. Modifying `resources/style.css`
3. Rebuilding the application

Example custom CSS:
```css
.todo-completed {
    color: #888888;
    text-decoration: line-through;
}
```

## Architecture

The application follows a clean MVC-inspired architecture:

- **Model**: `todo_item.c`, `todo_model.c` - Data layer with GObject
- **View**: `todo_window.c`, `todo_row.c` - UI components with GTK4
- **Controller**: Integrated within view components using signals
- **Storage**: `storage.c` - Persistence layer with JSON

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design documentation.

## Development

### Code Structure
```
src/
  ├── main.c         - Application entry point and GtkApplication setup
  ├── todo_item.*    - TodoItem GObject (represents a single todo)
  ├── todo_model.*   - TodoModel (manages collection of items)
  ├── todo_row.*     - TodoRow widget (displays single item in list)
  ├── todo_window.*  - TodoWindow (main application window)
  └── storage.*      - Storage manager (JSON persistence)
```

### Testing
```bash
# Run unit tests with Meson
meson test -C build

# Run with verbose output
meson test -C build --verbose

# Run specific test
meson test -C build test_todo
```

### Memory Leak Detection
```bash
# Build debug version
meson setup build --buildtype=debug

# Run with valgrind
valgrind --leak-check=full --show-leak-kinds=all ./build/todolist-gtk

# Expected result: no leaks possible
```

### Code Style
This project follows GNOME coding conventions:
- 4 spaces for indentation (no tabs)
- Function names in `snake_case`
- Type names in `PascalCase`
- Maximum line length: 120 characters
- Braces on same line for functions

## Troubleshooting

### GTK4 Not Found
```bash
# Error: Package 'gtk4' not found
# Solution: Install GTK4 development files
sudo apt install libgtk-4-dev  # Ubuntu/Debian
sudo dnf install gtk4-devel     # Fedora
sudo pacman -S gtk4             # Arch
```

### json-glib Not Found
```bash
# Error: Package 'json-glib-1.0' not found
# Solution: Install json-glib development files
sudo apt install libjson-glib-dev  # Ubuntu/Debian
sudo dnf install json-glib-devel    # Fedora
sudo pacman -S json-glib            # Arch
```

### Application Won't Start
```bash
# Check if libraries are installed
ldd ./build/todolist-gtk

# Check for error messages
./build/todolist-gtk 2>&1 | tee error.log

# Verify GTK4 installation
pkg-config --modversion gtk4
```

### Data File Issues
```bash
# Reset data file
rm ~/.local/share/todolist-gtk/todos.json

# Check permissions
ls -la ~/.local/share/todolist-gtk/
```

## Contributing

Contributions are welcome! This project demonstrates:
- GObject type system
- GTK4 widget development
- Modern C programming
- GNOME development practices

Areas for improvement:
- [ ] Drag-and-drop reordering
- [ ] Due dates and reminders
- [ ] Categories/tags
- [ ] Search functionality
- [ ] Export to different formats
- [ ] Undo/redo support
- [ ] Multi-window support
- [ ] D-Bus integration

## Resources

### Documentation
- [BUILD_GUIDE.md](BUILD_GUIDE.md) - Detailed build instructions
- [GOBJECT_GUIDE.md](GOBJECT_GUIDE.md) - GObject system explanation
- [GTK_CONCEPTS.md](GTK_CONCEPTS.md) - GTK concepts and patterns
- [ARCHITECTURE.md](ARCHITECTURE.md) - Application architecture

### External Resources
- [GTK4 Documentation](https://docs.gtk.org/gtk4/)
- [GObject Tutorial](https://docs.gtk.org/gobject/)
- [GNOME Developer Center](https://developer.gnome.org/)
- [GNOME Human Interface Guidelines](https://developer.gnome.org/hig/)

## License

MIT License - See LICENSE file for details

## Authors

TodoList Demo Team

## Acknowledgments

- GNOME Project for GTK and GObject
- Adwaita theme designers
- All contributors to GTK4 and related libraries

## Version History

### 1.0.0 (2025-01-01)
- Initial release
- Full GObject implementation
- GTK4 user interface
- JSON persistence
- Internationalization support
- Complete test suite
