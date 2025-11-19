#!/bin/bash
# Qt Todo List - Ubuntu/Debian Dependencies Installation Script
# Supports Ubuntu 20.04, 22.04, 24.04 and Debian 11+

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

echo "Updating package lists..."
sudo apt update

echo ""
echo "Installing build essentials..."
sudo apt install -y \
    build-essential \
    cmake \
    git

echo ""
echo "Installing Qt 6 development packages..."
sudo apt install -y \
    qt6-base-dev \
    qt6-base-dev-tools \
    libqt6core6 \
    libqt6gui6 \
    libqt6widgets6

echo ""
echo "Installing optional Qt modules..."
sudo apt install -y \
    qt6-tools-dev \
    qt6-tools-dev-tools \
    libqt6test6 || true

echo ""
echo "=================================="
echo "Installation completed successfully!"
echo "=================================="
echo ""
echo "Installed packages:"
echo "  - Build tools: gcc, g++, cmake"
echo "  - Qt 6 Core, Widgets, GUI"
echo "  - Qt 6 Test framework (optional)"
echo ""
echo "You can now build the project with:"
echo "  cd /path/to/qt-cpp"
echo "  mkdir build && cd build"
echo "  cmake .."
echo "  cmake --build ."
echo ""
echo "To check Qt version:"
qmake6 --version || qmake --version || echo "  qmake not found in PATH"
echo ""
