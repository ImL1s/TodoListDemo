# GTK Todo List Application

A complete, production-ready Todo List application built with GTK4, demonstrating modern Linux desktop development with the GObject type system.

## Quick Start

```bash
# Install dependencies (Ubuntu/Debian)
sudo apt install libgtk-4-dev libjson-glib-dev build-essential meson

# Build with Meson (recommended)
meson setup build
meson compile -C build
./build/todolist-gtk

# Or build with Make
make
make run
```

## Features

- Add, complete, and delete todo items
- Filter views (All/Active/Completed)
- Persistent storage with JSON
- Keyboard shortcuts
- Internationalization support (English, Chinese)
- Modern GTK4 UI with Adwaita theme

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[README.md](docs/README.md)** - Complete user guide and feature overview
- **[BUILD_GUIDE.md](docs/BUILD_GUIDE.md)** - Detailed build instructions for all platforms
- **[GOBJECT_GUIDE.md](docs/GOBJECT_GUIDE.md)** - GObject type system tutorial
- **[GTK_CONCEPTS.md](docs/GTK_CONCEPTS.md)** - GTK4 patterns and concepts
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Application architecture and design

## Project Structure

```
08-gtk-linux/
├── src/               # Source code
│   ├── main.c         # Application entry point
│   ├── todo_item.*    # TodoItem GObject
│   ├── todo_model.*   # Data model
│   ├── todo_row.*     # Custom list row widget
│   ├── todo_window.*  # Main window
│   └── storage.*      # JSON persistence
├── resources/         # CSS and icons
├── tests/             # Unit tests
├── po/                # Translations
├── docs/              # Documentation
├── meson.build        # Meson build system
└── Makefile           # Make build system
```

## Technologies Demonstrated

### Core Technologies
- **C11**: Modern C standard with type safety
- **GTK4**: Latest GNOME UI toolkit
- **GObject**: Object system with properties and signals
- **GLib**: Core utilities and data structures
- **json-glib**: JSON serialization
- **Meson**: Modern build system

### GObject Features
- Custom GObject classes
- Property system with notifications
- Signal emission and handling
- Reference counting memory management
- Type-safe casting

### GTK4 Features
- GtkApplication framework
- GtkListBox with custom rows
- Header bar
- CSS theming
- Event controllers
- Keyboard accelerators

## Building

### Dependencies

**Ubuntu/Debian:**
```bash
sudo apt install libgtk-4-dev libjson-glib-dev build-essential meson
```

**Fedora:**
```bash
sudo dnf install gtk4-devel json-glib-devel gcc meson
```

**Arch Linux:**
```bash
sudo pacman -S gtk4 json-glib base-devel meson
```

### Build Commands

**With Meson (recommended):**
```bash
meson setup build
meson compile -C build
meson test -C build
sudo meson install -C build
```

**With Make:**
```bash
make              # Build
make run          # Build and run
make clean        # Clean build files
make install      # Install to system
make check-deps   # Verify dependencies
```

## Running

```bash
# After installation
todolist-gtk

# Or from build directory
./build/todolist-gtk
```

## Testing

```bash
# Run unit tests
meson test -C build

# Run with verbose output
meson test -C build --verbose

# Memory leak check
valgrind --leak-check=full ./build/todolist-gtk
```

## Code Quality

This project demonstrates:
- Memory leak-free code (valgrind clean)
- Type-safe C programming
- GNOME coding standards
- Comprehensive error handling
- GTK best practices
- Proper resource management

## Learning Resources

This project is an excellent learning resource for:
- GObject type system
- GTK4 application development
- Modern C programming
- Linux desktop development
- Signal/slot patterns
- MVC architecture in C

## Requirements

- **GTK4**: 4.0 or later
- **GLib**: 2.66 or later
- **json-glib**: 1.6 or later
- **GCC**: 9.0+ or Clang 10+

## License

MIT License - See LICENSE file for details

## Authors

TodoList Demo Team

## Contributing

Contributions welcome! This project demonstrates production-quality GTK development.

Areas for enhancement:
- Drag-and-drop reordering
- Due dates and reminders
- Categories and tags
- Search functionality
- Export to different formats

## Screenshots Description

The application features a clean, modern interface:
- Header bar with application title
- Text entry for adding new todos
- Scrollable list of items with checkboxes
- Filter buttons for different views
- Status bar showing statistics
- Delete buttons for each item

## Support

For detailed information, see the documentation in `docs/`:
- Build issues → [BUILD_GUIDE.md](docs/BUILD_GUIDE.md)
- Understanding GObject → [GOBJECT_GUIDE.md](docs/GOBJECT_GUIDE.md)
- GTK concepts → [GTK_CONCEPTS.md](docs/GTK_CONCEPTS.md)
- Architecture → [ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Acknowledgments

- GNOME Project for GTK4 and GObject
- Adwaita theme team
- json-glib maintainers
