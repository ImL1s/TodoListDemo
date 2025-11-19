# Qt Todo List - Quick Start Guide

## 5-Minute Quick Start

### Prerequisites
- Qt 6.0+ installed
- C++ compiler (MSVC/MinGW/GCC/Clang)
- CMake 3.16+ (optional but recommended)

### Easy Installation (NEW!)

Use our automated installation scripts:

**Ubuntu/Debian:**
```bash
cd scripts
./install-deps-ubuntu.sh
```

**Fedora/RHEL:**
```bash
cd scripts
./install-deps-fedora.sh
```

**macOS:**
```bash
cd scripts
./install-deps-macos.sh
```

These scripts install all required dependencies automatically. See [scripts/README.md](scripts/README.md) for details.

### Option 1: Qt Creator (Easiest)

1. **Open Project**
   ```
   Launch Qt Creator → Open File or Project → Select CMakeLists.txt
   ```

2. **Configure Kit**
   ```
   Select your Qt 6.x kit → Configure Project
   ```

3. **Build & Run**
   ```
   Press Ctrl+R (⌘R on macOS) or click the green "Run" button
   ```

### Option 2: Command Line (CMake)

```bash
# Navigate to project
cd 08-desktop/06-qt-cpp

# Create build directory
mkdir build && cd build

# Configure
cmake ..

# Build
cmake --build .

# Run
./QtTodoList          # Linux/macOS
QtTodoList.exe        # Windows
```

### Option 3: Command Line (qmake)

```bash
# Navigate to project
cd 08-desktop/06-qt-cpp

# Generate Makefile
qmake todo-list.pro

# Build
make                  # Linux/macOS
nmake                 # Windows (MSVC)
mingw32-make          # Windows (MinGW)

# Run
./QtTodoList          # Linux/macOS
release\QtTodoList.exe # Windows
```

## First Use

### Try Sample Data (NEW!)

Import pre-made sample todos to see the app in action:

1. Run the application
2. Go to File → Import
3. Navigate to `examples/sample_todos.json`
4. Click "Yes" to import 5 sample todos

This will load todos with different priorities and categories to demonstrate all features.

### Manual Usage

1. **Add a Todo**
   - Type in the input field
   - Select priority (optional)
   - Press Enter or click "Add"

2. **Mark as Complete**
   - Double-click on a todo
   - Or select and press Space

3. **Filter Todos**
   - Click "All" / "Active" / "Completed"
   - Or press F1 / F2 / F3

4. **Toggle Theme**
   - Press Ctrl+T
   - Or View → Toggle Theme

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+N   | New todo (focus input) |
| Enter    | Add todo |
| Delete   | Remove selected todo |
| Space    | Toggle completion |
| F2       | Edit todo |
| Ctrl+L   | Clear completed |
| Ctrl+T   | Toggle theme |
| F1/F2/F3 | Filter shortcuts |

## Troubleshooting

**Qt not found?**
```bash
# Set Qt path
export Qt6_DIR=/path/to/Qt/6.5.0/gcc_64  # Linux/macOS
set Qt6_DIR=C:\Qt\6.5.0\msvc2019_64      # Windows
```

**Build errors?**
```bash
# Clean rebuild
rm -rf build && mkdir build && cd build && cmake .. && cmake --build .
```

## Next Steps

- Read [README.md](docs/README.md) for complete features
- See [BUILD_GUIDE.md](docs/BUILD_GUIDE.md) for detailed build instructions
- Check [QT_CONCEPTS.md](docs/QT_CONCEPTS.md) to understand Qt concepts
- Review [ARCHITECTURE.md](docs/ARCHITECTURE.md) for design patterns

## Support

For detailed help, see the comprehensive documentation in the `docs/` directory.

**Enjoy your Qt Todo List! 🎉**
