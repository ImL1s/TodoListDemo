# Build Guide for GTK Todo List

This comprehensive guide covers everything you need to know about building the GTK Todo List application from source.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Dependency Installation](#dependency-installation)
3. [Build Systems](#build-systems)
4. [Building with Meson](#building-with-meson)
5. [Building with Make](#building-with-make)
6. [Cross-Platform Builds](#cross-platform-builds)
7. [Build Options](#build-options)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Topics](#advanced-topics)

## Prerequisites

### Required Knowledge
- Basic command-line usage
- Understanding of Linux file system
- Familiarity with package managers

### Required Tools
- **C Compiler**: GCC 9.0+ or Clang 10+
- **Build System**: Meson 0.55+ (recommended) or Make
- **pkg-config**: For finding dependencies
- **git**: For version control (optional)

### Required Libraries
- **GTK4**: 4.0 or later
- **GLib**: 2.66 or later
- **json-glib**: 1.6 or later

## Dependency Installation

### Ubuntu/Debian (20.04+)

```bash
# Update package lists
sudo apt update

# Install all build dependencies
sudo apt install -y \
    build-essential \
    pkg-config \
    meson \
    ninja-build \
    libgtk-4-dev \
    libjson-glib-dev \
    gettext

# Verify installations
pkg-config --modversion gtk4
pkg-config --modversion json-glib-1.0
meson --version
gcc --version
```

Expected versions:
- GTK4: 4.0+
- json-glib: 1.6+
- Meson: 0.55+
- GCC: 9.0+

### Fedora/RHEL/CentOS (35+)

```bash
# Install dependencies
sudo dnf install -y \
    gcc \
    pkg-config \
    meson \
    gtk4-devel \
    json-glib-devel \
    gettext-devel

# Verify installations
pkg-config --modversion gtk4
pkg-config --modversion json-glib-1.0
```

### Arch Linux

```bash
# Install dependencies
sudo pacman -S --needed \
    base-devel \
    meson \
    gtk4 \
    json-glib \
    gettext

# Verify installations
pkg-config --modversion gtk4
pkg-config --modversion json-glib-1.0
```

### openSUSE

```bash
# Install dependencies
sudo zypper install -y \
    gcc \
    pkg-config \
    meson \
    gtk4-devel \
    json-glib-devel \
    gettext-tools

# Verify installations
pkg-config --modversion gtk4
```

### Gentoo

```bash
# Install dependencies
sudo emerge -av \
    dev-util/meson \
    x11-libs/gtk+:4 \
    dev-libs/json-glib

# Verify installations
pkg-config --modversion gtk4
```

## Build Systems

This project supports two build systems:

### Meson (Recommended)

**Advantages:**
- Modern, fast build system
- Better dependency management
- Integrated testing support
- GNOME standard
- Cross-platform
- Better error messages

**When to use:**
- Production builds
- Development with IDE
- Creating packages
- CI/CD pipelines

### Make

**Advantages:**
- Simpler, traditional approach
- No additional build tools needed
- Easier to understand for beginners
- Portable

**When to use:**
- Quick testing
- Simple environments
- Learning purposes
- Systems without Meson

## Building with Meson

### Basic Build

```bash
# Navigate to project directory
cd 08-desktop/08-gtk-linux

# Configure build directory
meson setup build

# Compile
meson compile -C build

# Run
./build/todolist-gtk
```

### Development Build

```bash
# Debug build with symbols
meson setup build \
    --buildtype=debug \
    --prefix=$HOME/.local

# Compile with verbose output
meson compile -C build --verbose

# Run with GDB
gdb ./build/todolist-gtk
```

### Release Build

```bash
# Optimized release build
meson setup build \
    --buildtype=release \
    --prefix=/usr/local \
    --strip

# Compile
meson compile -C build

# Install
sudo meson install -C build
```

### Reconfiguring

```bash
# Clean and reconfigure
rm -rf build
meson setup build --buildtype=debug

# Or reconfigure existing
meson configure build --buildtype=release
```

### Build Options

```bash
# List all options
meson configure build

# Set custom options
meson setup build \
    --prefix=/opt/todolist \
    --buildtype=debugoptimized \
    -Dwarning_level=3

# Common buildtypes:
#   - plain: no optimization, no debug
#   - debug: no optimization, with debug
#   - debugoptimized: some optimization, with debug
#   - release: full optimization, no debug
```

### Installation

```bash
# Install to configured prefix
sudo meson install -C build

# Install to custom directory
DESTDIR=/tmp/install meson install -C build

# Uninstall
sudo ninja -C build uninstall
```

### Testing

```bash
# Run all tests
meson test -C build

# Verbose output
meson test -C build --verbose

# Run specific test
meson test -C build test_todo

# Run tests with wrapper (valgrind)
meson test -C build --wrapper='valgrind --leak-check=full'
```

## Building with Make

### Basic Build

```bash
# Navigate to project directory
cd 08-desktop/08-gtk-linux

# Build
make

# Run
make run
```

### Debug Build

```bash
# Clean previous builds
make clean

# Build with debug symbols
make debug

# Run with debugger
gdb ./bin/todolist-gtk
```

### Release Build

```bash
# Clean previous builds
make clean

# Build optimized release
make release

# Install
sudo make install
```

### Makefile Targets

```bash
# Show all targets
make help

# Common targets:
make              # Build the application
make clean        # Remove build files
make install      # Install to system
make uninstall    # Remove from system
make run          # Build and run
make check-deps   # Verify dependencies
make debug        # Debug build
make release      # Release build
```

### Custom Compiler

```bash
# Use Clang instead of GCC
make CC=clang

# Custom flags
make CFLAGS="-O3 -march=native"

# Custom library paths
make LIBS="-L/opt/gtk4/lib $(pkg-config --libs gtk4)"
```

## Cross-Platform Builds

### Building for Different Architectures

```bash
# For ARM64
meson setup build-arm64 \
    --cross-file=cross/aarch64-linux.txt

# For 32-bit
meson setup build-i386 \
    --cross-file=cross/i686-linux.txt

# Compile
meson compile -C build-arm64
```

### Creating Cross-Compilation File

Create `cross/aarch64-linux.txt`:
```ini
[binaries]
c = 'aarch64-linux-gnu-gcc'
ar = 'aarch64-linux-gnu-ar'
strip = 'aarch64-linux-gnu-strip'
pkg-config = 'aarch64-linux-gnu-pkg-config'

[host_machine]
system = 'linux'
cpu_family = 'aarch64'
cpu = 'cortex-a53'
endian = 'little'
```

## Build Options

### Compiler Flags

The default build includes:
```bash
CFLAGS = -Wall -Wextra -std=c11
```

Additional useful flags:
```bash
# Extra warnings
-Wpedantic -Wshadow -Wformat=2

# Optimization
-O2 -O3 -Os

# Debug
-g -ggdb3

# Security
-D_FORTIFY_SOURCE=2 -fstack-protector-strong
```

### pkg-config Usage

```bash
# Check if GTK4 is installed
pkg-config --exists gtk4 && echo "Found"

# Get version
pkg-config --modversion gtk4

# Get compiler flags
pkg-config --cflags gtk4

# Get linker flags
pkg-config --libs gtk4

# Get both
pkg-config --cflags --libs gtk4

# Check minimum version
pkg-config --atleast-version=4.0 gtk4
```

### Environment Variables

```bash
# Custom PKG_CONFIG_PATH
export PKG_CONFIG_PATH=/opt/gtk4/lib/pkgconfig:$PKG_CONFIG_PATH

# Custom install prefix
export PREFIX=$HOME/.local

# Compiler selection
export CC=clang
export CXX=clang++

# Build with custom paths
meson setup build --prefix=$PREFIX
```

## Troubleshooting

### Common Errors

#### 1. GTK4 Not Found

**Error:**
```
Package gtk4 was not found in the pkg-config search path
```

**Solutions:**
```bash
# Install GTK4 development files
sudo apt install libgtk-4-dev  # Ubuntu/Debian
sudo dnf install gtk4-devel     # Fedora
sudo pacman -S gtk4             # Arch

# Or add to PKG_CONFIG_PATH if installed elsewhere
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH
```

#### 2. Meson Version Too Old

**Error:**
```
Meson version is 0.53.0 but project requires >= 0.55.0
```

**Solutions:**
```bash
# Install newer Meson via pip
pip3 install --user meson

# Or use Makefile instead
make
```

#### 3. Compiler Not Found

**Error:**
```
C compiler not found
```

**Solutions:**
```bash
# Install build tools
sudo apt install build-essential  # Ubuntu/Debian
sudo dnf groupinstall "Development Tools"  # Fedora
sudo pacman -S base-devel  # Arch
```

#### 4. Missing json-glib

**Error:**
```
Package json-glib-1.0 was not found
```

**Solutions:**
```bash
# Install json-glib development files
sudo apt install libjson-glib-dev  # Ubuntu/Debian
sudo dnf install json-glib-devel    # Fedora
sudo pacman -S json-glib            # Arch
```

#### 5. Permission Denied During Install

**Error:**
```
Permission denied when installing to /usr/local
```

**Solutions:**
```bash
# Use sudo for system install
sudo meson install -C build

# Or install to user directory
meson setup build --prefix=$HOME/.local
meson install -C build  # No sudo needed
```

### Build Verification

```bash
# Check build dependencies
make check-deps

# Verify compiled binary
file ./build/todolist-gtk
# Output: ELF 64-bit LSB executable, x86-64...

# Check library dependencies
ldd ./build/todolist-gtk
# Should show gtk4, glib, json-glib

# Verify symbols
nm ./build/todolist-gtk | grep todo_item_new

# Check for undefined symbols
nm -u ./build/todolist-gtk
```

### Performance Profiling

```bash
# Build with profiling
meson setup build --buildtype=debug
meson compile -C build

# Profile with gprof
CFLAGS="-pg" make
./bin/todolist-gtk
gprof ./bin/todolist-gtk gmon.out > analysis.txt

# Profile with perf
perf record ./build/todolist-gtk
perf report
```

## Advanced Topics

### Static Analysis

```bash
# Using cppcheck
cppcheck --enable=all src/

# Using scan-build
scan-build meson compile -C build

# Using clang-tidy
clang-tidy src/*.c -- $(pkg-config --cflags gtk4)
```

### Memory Leak Detection

```bash
# Build debug version
meson setup build --buildtype=debug
meson compile -C build

# Run with valgrind
valgrind \
    --leak-check=full \
    --show-leak-kinds=all \
    --track-origins=yes \
    --verbose \
    --log-file=valgrind-out.txt \
    ./build/todolist-gtk

# Check for memory errors
grep "definitely lost" valgrind-out.txt
```

### Code Coverage

```bash
# Build with coverage
meson setup build -Db_coverage=true
meson compile -C build

# Run tests
meson test -C build

# Generate coverage report
ninja -C build coverage-html

# View report
xdg-open build/meson-logs/coveragereport/index.html
```

### Sanitizers

```bash
# Address sanitizer
meson setup build -Db_sanitize=address
meson compile -C build
./build/todolist-gtk

# Undefined behavior sanitizer
meson setup build -Db_sanitize=undefined
meson compile -C build

# Thread sanitizer
meson setup build -Db_sanitize=thread
meson compile -C build
```

### Creating Distribution Package

```bash
# Create tarball
meson dist -C build

# Creates: build/meson-dist/todolist-gtk-1.0.0.tar.xz

# Test tarball build
cd /tmp
tar xf todolist-gtk-1.0.0.tar.xz
cd todolist-gtk-1.0.0
meson setup build
meson compile -C build
```

### IDE Integration

#### Visual Studio Code

Create `.vscode/tasks.json`:
```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build",
            "type": "shell",
            "command": "meson compile -C build",
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

#### GNOME Builder

1. Open GNOME Builder
2. Click "Clone Repository"
3. Enter project path
4. Builder auto-detects Meson build
5. Click "Build" button

## Build Performance

### Parallel Builds

```bash
# Meson (automatic parallel build)
meson compile -C build

# Make with parallel jobs
make -j$(nproc)

# Limit jobs
make -j4
```

### ccache Integration

```bash
# Install ccache
sudo apt install ccache

# Use with Meson
CC="ccache gcc" meson setup build
meson compile -C build

# Check stats
ccache -s
```

## Summary

This guide covered:
- Dependency installation for major distributions
- Building with Meson and Make
- Debug and release builds
- Cross-compilation
- Testing and profiling
- Advanced build options
- Troubleshooting common issues

For more information:
- [Meson Documentation](https://mesonbuild.com/Manual.html)
- [GTK Build Instructions](https://docs.gtk.org/gtk4/building.html)
- [GCC Manual](https://gcc.gnu.org/onlinedocs/)

Next steps:
- Read [GOBJECT_GUIDE.md](GOBJECT_GUIDE.md) to understand the code
- Read [GTK_CONCEPTS.md](GTK_CONCEPTS.md) to learn GTK patterns
- Explore the source code in `src/`
