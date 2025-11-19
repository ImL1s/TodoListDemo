#!/bin/bash
# Qt Todo List - Fedora/RHEL Dependencies Installation Script
# Supports Fedora 38+ and RHEL 9+

set -e

echo "=================================="
echo "Qt Todo List - Dependencies Setup"
echo "=================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "Please do not run this script as root."
    echo "It will prompt for sudo when needed."
    exit 1
fi

echo "Installing build essentials..."
sudo dnf install -y \
    gcc \
    gcc-c++ \
    cmake \
    make \
    git

echo ""
echo "Installing Qt 6 development packages..."
sudo dnf install -y \
    qt6-qtbase-devel \
    qt6-qttools-devel

echo ""
echo "Installing optional Qt modules..."
sudo dnf install -y \
    qt6-qtbase-private-devel || true

echo ""
echo "=================================="
echo "Installation completed successfully!"
echo "=================================="
echo ""
echo "Installed packages:"
echo "  - Build tools: gcc, g++, cmake"
echo "  - Qt 6 Base Development"
echo "  - Qt 6 Tools Development"
echo ""
echo "You can now build the project with:"
echo "  cd /path/to/qt-cpp"
echo "  mkdir build && cd build"
echo "  cmake .."
echo "  cmake --build ."
echo ""
echo "To check Qt version:"
qmake6 --version || qmake-qt6 --version || echo "  qmake not found in PATH"
echo ""
