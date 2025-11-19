# Dependency Installation Scripts

This directory contains automated scripts to install all required dependencies for building the Qt Todo List application on different platforms.

## Available Scripts

### Linux

#### Ubuntu/Debian
```bash
./install-deps-ubuntu.sh
```
Supports: Ubuntu 20.04, 22.04, 24.04, Debian 11+

Installs:
- Build essentials (gcc, g++, cmake)
- Qt 6 base development packages
- Qt 6 widgets module
- Qt 6 test framework

#### Fedora/RHEL
```bash
./install-deps-fedora.sh
```
Supports: Fedora 38+, RHEL 9+

Installs:
- Build essentials (gcc, g++, cmake)
- Qt 6 base development
- Qt 6 tools development

### macOS
```bash
./install-deps-macos.sh
```
Requires: Homebrew package manager

Installs:
- CMake build system
- Qt 6 framework via Homebrew

**Important:** After installation, add Qt to your PATH by adding to `~/.zshrc`:
```bash
export PATH="/opt/homebrew/opt/qt@6/bin:$PATH"
export Qt6_DIR=/opt/homebrew/opt/qt@6
```

### Windows

For Windows, we recommend using one of these methods:

#### Method 1: Qt Online Installer (Recommended)
1. Download from: https://www.qt.io/download-qt-installer
2. Install Qt 6.5+ with these components:
   - Qt 6.x for MSVC 2019/2022 (64-bit)
   - Qt 6.x for MinGW (optional)
   - CMake
   - Ninja

#### Method 2: vcpkg
```powershell
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
.\bootstrap-vcpkg.bat
.\vcpkg install qt6-base:x64-windows
.\vcpkg install qt6-widgets:x64-windows
```

## Usage

### 1. Run the appropriate script for your platform
```bash
cd /path/to/qt-cpp/scripts
./install-deps-ubuntu.sh    # Ubuntu/Debian
# or
./install-deps-fedora.sh    # Fedora/RHEL
# or
./install-deps-macos.sh     # macOS
```

### 2. Verify installation
```bash
qmake --version  # or qmake6 --version
cmake --version
```

### 3. Build the project
```bash
cd /path/to/qt-cpp
mkdir build && cd build
cmake ..
cmake --build .
```

## Troubleshooting

### Qt not found after installation

**Linux (Ubuntu/Debian):**
```bash
# Try both qmake6 and qmake
qmake6 --version
# If not found, install qt6-qmake
sudo apt install qt6-qmake-bin
```

**Linux (Fedora):**
```bash
# Set Qt environment
export QT_SELECT=6
qmake-qt6 --version
```

**macOS:**
```bash
# Add Qt to PATH
export PATH="/opt/homebrew/opt/qt@6/bin:$PATH"
source ~/.zshrc
```

### CMake cannot find Qt

Set the Qt directory explicitly:
```bash
cmake -DQt6_DIR=/path/to/Qt/6.x/lib/cmake/Qt6 ..
```

Examples:
- **Ubuntu:** `/usr/lib/x86_64-linux-gnu/cmake/Qt6`
- **macOS (Homebrew):** `/opt/homebrew/opt/qt@6/lib/cmake/Qt6`
- **Windows:** `C:/Qt/6.5.0/msvc2019_64/lib/cmake/Qt6`

### Permission denied on Linux/macOS

Make the script executable:
```bash
chmod +x install-deps-*.sh
```

## Manual Installation

If the automated scripts don't work, refer to the [BUILD_GUIDE.md](../docs/BUILD_GUIDE.md) for detailed manual installation instructions.

## Platform-Specific Notes

### Ubuntu/Debian
- Qt 6 packages are available in Ubuntu 22.04+ repositories
- For Ubuntu 20.04, you may need to add a PPA or build from source

### Fedora/RHEL
- Qt 6 is available in Fedora 38+ and RHEL 9+
- Use `dnf` (not `yum`) on modern Fedora

### macOS
- Homebrew is required (https://brew.sh)
- Qt 6 is installed to `/opt/homebrew` (Apple Silicon) or `/usr/local` (Intel)
- Xcode Command Line Tools are required

### Windows
- Qt Creator IDE is recommended for Windows development
- MSVC 2019/2022 or MinGW compiler required
- Visual Studio Build Tools can be used instead of full Visual Studio

## Support

For more detailed build instructions and troubleshooting, see:
- [BUILD_GUIDE.md](../docs/BUILD_GUIDE.md) - Comprehensive build instructions
- [QUICK_START.md](../QUICK_START.md) - Quick start guide
- [README.md](../docs/README.md) - Project overview
