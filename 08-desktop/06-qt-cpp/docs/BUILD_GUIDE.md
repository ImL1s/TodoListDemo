# Qt Todo List - Comprehensive Build Guide

This guide provides detailed, step-by-step instructions for building the Qt Todo List application on Windows, macOS, and Linux platforms using various build tools and IDEs.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Windows Build Instructions](#windows-build-instructions)
- [macOS Build Instructions](#macos-build-instructions)
- [Linux Build Instructions](#linux-build-instructions)
- [Qt Creator Instructions](#qt-creator-instructions)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

## Prerequisites

### Common Requirements

Before building the application, ensure you have:

1. **Qt 6 Framework** (6.0 or higher, 6.5+ recommended)
2. **C++ Compiler** supporting C++17
3. **CMake** 3.16+ (if using CMake build)
4. **Git** (optional, for cloning repository)

### Checking Your Qt Installation

```bash
# Check Qt version
qmake --version

# Find Qt installation path
qmake -query QT_INSTALL_PREFIX

# List available Qt modules
qmake -query
```

---

## Windows Build Instructions

### Option 1: Visual Studio with CMake

#### Prerequisites
- Visual Studio 2019 or 2022
- Qt 6.x for MSVC (e.g., qt6-windows-desktop-win64-msvc2019)
- CMake 3.16+

#### Steps

1. **Install Qt**
   ```cmd
   REM Download from https://www.qt.io/download
   REM Install to C:\Qt (or custom location)
   REM Select MSVC 2019 64-bit component
   ```

2. **Set Environment Variables**
   ```cmd
   set Qt6_DIR=C:\Qt\6.5.0\msvc2019_64
   set PATH=%Qt6_DIR%\bin;%PATH%
   ```

3. **Open Project**
   - Launch Visual Studio
   - File → Open → CMake
   - Select `CMakeLists.txt`
   - Wait for CMake configuration to complete

4. **Build**
   ```cmd
   REM Or use Visual Studio GUI: Build → Build All
   cmake --build . --config Release
   ```

5. **Run**
   ```cmd
   .\build\Release\QtTodoList.exe
   ```

### Option 2: MinGW with CMake

#### Prerequisites
- MinGW-w64 (included with Qt installation)
- Qt 6.x for MinGW
- CMake

#### Steps

1. **Set Up Environment**
   ```cmd
   set Qt6_DIR=C:\Qt\6.5.0\mingw_64
   set PATH=C:\Qt\6.5.0\mingw_64\bin;C:\Qt\Tools\mingw1120_64\bin;%PATH%
   ```

2. **Create Build Directory**
   ```cmd
   mkdir build
   cd build
   ```

3. **Configure with CMake**
   ```cmd
   cmake .. -G "MinGW Makefiles" -DCMAKE_BUILD_TYPE=Release
   ```

4. **Build**
   ```cmd
   mingw32-make
   ```

5. **Run**
   ```cmd
   QtTodoList.exe
   ```

### Option 3: qmake (Traditional Qt Build)

#### Prerequisites
- Qt 6.x with qmake
- MSVC or MinGW compiler

#### Steps

1. **Open Qt Command Prompt**
   - Start Menu → Qt → Qt 6.5.0 (MSVC 2019 64-bit) → Developer Command Prompt

2. **Navigate to Project**
   ```cmd
   cd path\to\06-qt-cpp
   ```

3. **Generate Makefile**
   ```cmd
   qmake todo-list.pro
   ```

4. **Build**
   ```cmd
   REM For MSVC
   nmake

   REM For MinGW
   mingw32-make
   ```

5. **Run**
   ```cmd
   release\QtTodoList.exe
   ```

### Option 4: Visual Studio with Qt VS Tools

#### Prerequisites
- Visual Studio 2019/2022
- Qt VS Tools extension
- Qt 6.x for MSVC

#### Steps

1. **Install Qt VS Tools**
   - Extensions → Manage Extensions
   - Search for "Qt VS Tools"
   - Download and install

2. **Configure Qt Version**
   - Extensions → Qt VS Tools → Qt Versions
   - Add → Browse to Qt installation (e.g., C:\Qt\6.5.0\msvc2019_64)

3. **Open Project**
   - File → Open → File
   - Select `todo-list.pro`
   - Qt VS Tools will convert it to VS solution

4. **Build & Run**
   - F5 (Debug) or Ctrl+F5 (Release)

---

## macOS Build Instructions

### Option 1: Xcode with CMake

#### Prerequisites
- Xcode 13+ (from App Store)
- Xcode Command Line Tools
- Qt 6.x for macOS
- CMake

#### Install Prerequisites
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Qt and CMake
brew install qt@6 cmake

# Link Qt
brew link qt@6 --force
```

#### Build Steps

1. **Set Qt Path**
   ```bash
   export Qt6_DIR=/usr/local/opt/qt@6
   export PATH=$Qt6_DIR/bin:$PATH
   ```

2. **Create Build Directory**
   ```bash
   mkdir build && cd build
   ```

3. **Configure**
   ```bash
   cmake .. -DCMAKE_BUILD_TYPE=Release
   ```

4. **Build**
   ```bash
   cmake --build . --parallel
   ```

5. **Run**
   ```bash
   ./QtTodoList.app/Contents/MacOS/QtTodoList
   # or simply:
   open QtTodoList.app
   ```

### Option 2: Command Line with qmake

#### Prerequisites
- Qt 6.x installed via online installer or Homebrew

#### Steps

1. **Add Qt to PATH**
   ```bash
   export PATH="/Users/YOUR_USERNAME/Qt/6.5.0/macos/bin:$PATH"
   # or if using Homebrew:
   export PATH="/usr/local/opt/qt@6/bin:$PATH"
   ```

2. **Generate Makefile**
   ```bash
   qmake todo-list.pro
   ```

3. **Build**
   ```bash
   make
   ```

4. **Run**
   ```bash
   open QtTodoList.app
   ```

### Option 3: Xcode Project Generation

#### Steps

1. **Generate Xcode Project**
   ```bash
   mkdir build && cd build
   cmake .. -G Xcode
   ```

2. **Open in Xcode**
   ```bash
   open QtTodoList.xcodeproj
   ```

3. **Build & Run**
   - Select QtTodoList scheme
   - Product → Run (⌘R)

### Creating macOS App Bundle

After building, you may want to create a deployable .app bundle:

```bash
# Deploy Qt frameworks
macdeployqt QtTodoList.app -dmg

# This creates:
# - QtTodoList.app (complete with Qt frameworks)
# - QtTodoList.dmg (distributable disk image)
```

---

## Linux Build Instructions

### Ubuntu/Debian-based Systems

#### Install Prerequisites

```bash
# Update package lists
sudo apt update

# Install build essentials
sudo apt install build-essential cmake git

# Install Qt 6 development packages
sudo apt install qt6-base-dev qt6-tools-dev libqt6core6 libqt6widgets6

# Alternative: Install from Qt online installer
# Download from https://www.qt.io/download
```

#### Build with CMake

1. **Clone/Navigate to Project**
   ```bash
   cd 06-qt-cpp
   ```

2. **Create Build Directory**
   ```bash
   mkdir build && cd build
   ```

3. **Configure**
   ```bash
   cmake .. -DCMAKE_BUILD_TYPE=Release
   ```

4. **Build**
   ```bash
   cmake --build . -j$(nproc)
   ```

5. **Run**
   ```bash
   ./QtTodoList
   ```

#### Build with qmake

```bash
# Generate Makefile
qmake todo-list.pro

# Build
make -j$(nproc)

# Run
./QtTodoList
```

### Fedora/RHEL-based Systems

#### Install Prerequisites

```bash
# Install development tools
sudo dnf groupinstall "Development Tools"
sudo dnf install cmake git

# Install Qt 6 development packages
sudo dnf install qt6-qtbase-devel qt6-qttools-devel
```

#### Build Steps
Same as Ubuntu (above), using CMake or qmake.

### Arch Linux

#### Install Prerequisites

```bash
# Install base development tools
sudo pacman -S base-devel cmake git

# Install Qt 6
sudo pacman -S qt6-base qt6-tools
```

#### Build Steps
Same as Ubuntu, using CMake or qmake.

### Installing System-Wide (Optional)

```bash
# After building with CMake:
cd build
sudo cmake --install .

# Default install location: /usr/local/bin
# Run from anywhere:
QtTodoList
```

---

## Qt Creator Instructions

Qt Creator is the official IDE for Qt development and provides the best integration.

### Initial Setup

1. **Install Qt Creator**
   - Included with Qt Online Installer
   - Or download separately from qt.io

2. **Configure Kits**
   - Tools → Options → Kits
   - Verify that Qt 6.x kit is configured
   - Check compiler, Qt version, and CMake settings

### Opening the Project

1. **Open Project**
   - File → Open File or Project
   - Navigate to `06-qt-cpp`
   - Select either:
     - `CMakeLists.txt` (recommended)
     - `todo-list.pro`

2. **Configure Project**
   - Select your Qt 6.x kit(s)
   - Choose build directories:
     - Debug: `build/debug`
     - Release: `build/release`
   - Click "Configure Project"

### Building

1. **Select Build Configuration**
   - Bottom-left: Choose Debug or Release

2. **Build**
   - Build → Build Project "QtTodoList" (Ctrl+B / ⌘B)
   - Or click the hammer icon 🔨

3. **View Build Output**
   - Compile Output pane shows build progress
   - Issues pane shows warnings/errors

### Running

1. **Run Application**
   - Build → Run (Ctrl+R / ⌘R)
   - Or click the green play button ▶️

2. **Debug**
   - Build → Start Debugging (F5)
   - Set breakpoints by clicking line numbers

### Qt Creator Features

**Code Navigation**:
- F2: Follow symbol
- Ctrl+Click: Go to definition
- Ctrl+Shift+U: Find usages

**Refactoring**:
- Ctrl+Shift+R: Rename symbol
- Alt+Enter: Quick fixes

**Design Tools**:
- Double-click .ui files to open Qt Designer
- Edit .qss files with syntax highlighting

**Testing**:
- Tools → Tests → Run All Tests
- View test results in Test Results pane

---

## Troubleshooting

### Common Issues and Solutions

#### "Qt6 not found" Error

**Problem**: CMake can't find Qt installation

**Solution**:
```bash
# Set Qt6_DIR environment variable
export Qt6_DIR=/path/to/Qt/6.5.0/gcc_64  # Linux/macOS
set Qt6_DIR=C:\Qt\6.5.0\msvc2019_64      # Windows

# Or specify during CMake configuration
cmake .. -DQt6_DIR=/path/to/Qt/6.5.0/gcc_64
```

#### "moc not found" Error

**Problem**: Meta-Object Compiler not in PATH

**Solution**:
```bash
# Add Qt bin directory to PATH
export PATH=/path/to/Qt/6.5.0/gcc_64/bin:$PATH  # Linux/macOS
set PATH=C:\Qt\6.5.0\msvc2019_64\bin;%PATH%     # Windows
```

#### "undefined reference to vtable" Error

**Problem**: MOC not run on files with Q_OBJECT

**Solution**:
```bash
# Clean and rebuild
rm -rf build  # Linux/macOS
rmdir /s build  # Windows
mkdir build && cd build
cmake .. && cmake --build .
```

#### Missing Qt Libraries at Runtime (Linux)

**Problem**: `error while loading shared libraries: libQt6Core.so.6`

**Solution**:
```bash
# Add Qt lib directory to LD_LIBRARY_PATH
export LD_LIBRARY_PATH=/path/to/Qt/6.5.0/gcc_64/lib:$LD_LIBRARY_PATH

# Or install system Qt packages
sudo apt install libqt6core6 libqt6widgets6
```

#### High DPI Scaling Issues

**Problem**: UI appears too large or too small

**Solution**:
```bash
# Linux: Set Qt scaling
export QT_AUTO_SCREEN_SCALE_FACTOR=1
export QT_SCALE_FACTOR=1.5

# Windows: Set in application properties
# Right-click .exe → Properties → Compatibility → Change high DPI settings
```

#### Application Doesn't Start (Windows)

**Problem**: Missing DLL errors

**Solution**:
```cmd
REM Use windeployqt to copy required DLLs
cd build\Release
C:\Qt\6.5.0\msvc2019_64\bin\windeployqt.exe QtTodoList.exe
```

#### Compiler Version Mismatch (Windows)

**Problem**: Qt compiled with different MSVC version

**Solution**:
- Ensure Qt version matches Visual Studio version
- Download correct Qt variant (e.g., msvc2019_64 for VS 2019)
- Or rebuild Qt from source (advanced)

#### Build Fails on macOS with "Qt module not found"

**Problem**: Qt not properly linked

**Solution**:
```bash
# If installed via Homebrew
brew link qt@6 --force

# If using Qt online installer
export Qt6_DIR=/Users/$USER/Qt/6.5.0/macos
export CMAKE_PREFIX_PATH=$Qt6_DIR
```

### Getting Help

If you encounter issues not covered here:

1. **Check CMake Output**
   ```bash
   cmake .. --debug-output
   ```

2. **Verify Qt Installation**
   ```bash
   qmake -query QT_INSTALL_PREFIX
   qmake -query QT_VERSION
   ```

3. **Check Compiler**
   ```bash
   g++ --version      # Linux/macOS
   cl                 # Windows MSVC
   ```

4. **Enable Verbose Build**
   ```bash
   cmake --build . --verbose
   make VERBOSE=1
   ```

5. **Consult Resources**
   - Qt Documentation: https://doc.qt.io/
   - Qt Forum: https://forum.qt.io/
   - Stack Overflow: Tag `qt` or `qt6`

---

## Deployment

### Windows Deployment

#### Automatic (windeployqt)

```cmd
cd build\Release
C:\Qt\6.5.0\msvc2019_64\bin\windeployqt.exe ^
    --release ^
    --no-compiler-runtime ^
    QtTodoList.exe
```

This copies all required Qt DLLs and plugins.

#### Manual

Copy these DLLs to executable directory:
- Qt6Core.dll
- Qt6Gui.dll
- Qt6Widgets.dll
- platforms/qwindows.dll

#### Creating Installer

Use tools like:
- NSIS (Nullsoft Scriptable Install System)
- Inno Setup
- WiX Toolset
- Qt Installer Framework

### macOS Deployment

#### Automatic (macdeployqt)

```bash
macdeployqt QtTodoList.app -dmg
```

Creates:
- **QtTodoList.app** - Complete application bundle
- **QtTodoList.dmg** - Distributable disk image

#### Manual Code Signing (for distribution)

```bash
# Sign the app
codesign --force --deep --sign "Developer ID Application: Your Name" QtTodoList.app

# Verify
codesign --verify --deep --strict --verbose=2 QtTodoList.app

# Notarize (required for macOS 10.15+)
xcrun notarytool submit QtTodoList.dmg --wait
xcrun stapler staple QtTodoList.dmg
```

### Linux Deployment

#### AppImage (Recommended)

```bash
# Use linuxdeployqt
linuxdeployqt QtTodoList -appimage

# Creates QtTodoList-x86_64.AppImage
# Distributable single-file application
```

#### Flatpak

Create a Flatpak manifest and build:
```bash
flatpak-builder build-dir com.todolisdemo.QtTodoList.yml
```

#### Snap

Create a snapcraft.yaml and build:
```bash
snapcraft
```

#### Traditional Package

Create .deb or .rpm packages:
```bash
# Debian package
dpkg-buildpackage -us -uc

# RPM package
rpmbuild -ba QtTodoList.spec
```

---

## Build Configuration Options

### CMake Options

```bash
# Build type
-DCMAKE_BUILD_TYPE=Release      # Release build (optimized)
-DCMAKE_BUILD_TYPE=Debug        # Debug build (with symbols)

# Install prefix
-DCMAKE_INSTALL_PREFIX=/usr/local

# Enable testing
-DBUILD_TESTING=ON

# Specify Qt path
-DQt6_DIR=/path/to/Qt/6.5.0/gcc_64

# Generator
-G "Unix Makefiles"             # Linux/macOS
-G "Ninja"                      # Fast, cross-platform
-G "Visual Studio 17 2022"      # Windows MSVC
-G "MinGW Makefiles"            # Windows MinGW
```

### qmake Options

```bash
# Configuration
qmake CONFIG+=release           # Release build
qmake CONFIG+=debug             # Debug build
qmake CONFIG+=debug_and_release # Both

# Installation prefix
qmake PREFIX=/usr/local
```

---

## Performance Optimization

### Release Build Settings

**CMake**:
```bash
cmake .. -DCMAKE_BUILD_TYPE=Release
```

**qmake**:
```bash
qmake CONFIG+=release
```

### Link-Time Optimization (LTO)

**CMake**:
```cmake
set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)
```

**qmake**:
```qmake
CONFIG += ltcg
```

### Strip Debug Symbols (Linux)

```bash
strip --strip-unneeded QtTodoList
```

---

## Summary

This guide covered building the Qt Todo List application on all major platforms using various tools:

- ✅ Windows (MSVC, MinGW)
- ✅ macOS (Xcode, Command Line)
- ✅ Linux (GCC, Clang)
- ✅ Qt Creator (all platforms)
- ✅ CMake and qmake build systems
- ✅ Deployment strategies

For architecture and design details, see [ARCHITECTURE.md](ARCHITECTURE.md).

For Qt concepts and patterns, see [QT_CONCEPTS.md](QT_CONCEPTS.md).

**Happy Building! 🚀**
