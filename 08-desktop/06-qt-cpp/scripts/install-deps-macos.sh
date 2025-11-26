#!/bin/bash
# Qt Todo List - macOS Dependencies Installation Script
# Requires Homebrew package manager

set -e

echo "=================================="
echo "Qt Todo List - Dependencies Setup"
echo "=================================="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Error: Homebrew is not installed."
    echo "Please install Homebrew first:"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

echo "Updating Homebrew..."
brew update

echo ""
echo "Installing build tools..."
brew install cmake

echo ""
echo "Installing Qt 6..."
brew install qt@6

echo ""
echo "=================================="
echo "Installation completed successfully!"
echo "=================================="
echo ""
echo "Installed packages:"
echo "  - Build tools: cmake"
echo "  - Qt 6 Framework"
echo ""
echo "IMPORTANT: Add Qt to your PATH"
echo "Add this to your ~/.zshrc or ~/.bash_profile:"
echo "  export PATH=\"/opt/homebrew/opt/qt@6/bin:\$PATH\""
echo "  export Qt6_DIR=/opt/homebrew/opt/qt@6"
echo ""
echo "For Intel Macs, use:"
echo "  export PATH=\"/usr/local/opt/qt@6/bin:\$PATH\""
echo "  export Qt6_DIR=/usr/local/opt/qt@6"
echo ""
echo "Then reload your shell:"
echo "  source ~/.zshrc  # or source ~/.bash_profile"
echo ""
echo "You can now build the project with:"
echo "  cd /path/to/qt-cpp"
echo "  mkdir build && cd build"
echo "  cmake .."
echo "  cmake --build ."
echo ""
echo "To check Qt version:"
qmake --version 2>/dev/null || echo "  (Run 'source ~/.zshrc' first to add Qt to PATH)"
echo ""
