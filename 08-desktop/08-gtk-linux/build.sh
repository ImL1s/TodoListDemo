#!/bin/bash
# build.sh - One-click build script for GTK Todo List
# Usage: ./build.sh [clean|meson|make|test|run|install]

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_msg() {
    echo -e "${GREEN}==>${NC} $1"
}

print_error() {
    echo -e "${RED}Error:${NC} $1" >&2
}

print_warning() {
    echo -e "${YELLOW}Warning:${NC} $1"
}

# Check dependencies
check_deps() {
    print_msg "Checking dependencies..."

    local missing_deps=0

    if ! pkg-config --exists gtk4; then
        print_error "GTK4 not found. Install: sudo apt install libgtk-4-dev"
        missing_deps=1
    else
        print_msg "GTK4 found: $(pkg-config --modversion gtk4)"
    fi

    if ! pkg-config --exists json-glib-1.0; then
        print_error "json-glib not found. Install: sudo apt install libjson-glib-dev"
        missing_deps=1
    else
        print_msg "json-glib found: $(pkg-config --modversion json-glib-1.0)"
    fi

    if ! command -v gcc &> /dev/null; then
        print_error "GCC not found. Install: sudo apt install build-essential"
        missing_deps=1
    else
        print_msg "GCC found: $(gcc --version | head -n1)"
    fi

    if [ $missing_deps -eq 1 ]; then
        print_error "Missing dependencies. Please install them first."
        exit 1
    fi

    print_msg "All dependencies satisfied!"
}

# Clean build artifacts
clean() {
    print_msg "Cleaning build artifacts..."
    rm -rf build bin builddir
    print_msg "Clean complete!"
}

# Build with Meson
build_meson() {
    print_msg "Building with Meson..."

    if ! command -v meson &> /dev/null; then
        print_warning "Meson not found. Install: sudo apt install meson"
        print_msg "Falling back to Make..."
        build_make
        return
    fi

    if [ ! -d "builddir" ]; then
        meson setup builddir
    fi

    meson compile -C builddir
    print_msg "Meson build complete! Binary: builddir/todolist-gtk"
}

# Build with Make
build_make() {
    print_msg "Building with Make..."
    make
    print_msg "Make build complete! Binary: bin/todolist-gtk"
}

# Run tests
run_tests() {
    print_msg "Running tests..."

    if [ -d "builddir" ]; then
        if command -v meson &> /dev/null; then
            meson test -C builddir --verbose
        fi
    else
        print_warning "No meson build found. Build first with: ./build.sh meson"
    fi
}

# Run the application
run_app() {
    if [ -f "builddir/todolist-gtk" ]; then
        print_msg "Running application (Meson build)..."
        ./builddir/todolist-gtk
    elif [ -f "bin/todolist-gtk" ]; then
        print_msg "Running application (Make build)..."
        ./bin/todolist-gtk
    else
        print_error "No binary found. Build first with: ./build.sh"
        exit 1
    fi
}

# Install the application
install_app() {
    print_msg "Installing application..."

    if [ -d "builddir" ] && command -v meson &> /dev/null; then
        sudo meson install -C builddir
    else
        make install
    fi

    print_msg "Installation complete!"
}

# Valgrind memory check
check_memory() {
    if ! command -v valgrind &> /dev/null; then
        print_error "Valgrind not found. Install: sudo apt install valgrind"
        exit 1
    fi

    local binary=""
    if [ -f "builddir/todolist-gtk" ]; then
        binary="builddir/todolist-gtk"
    elif [ -f "bin/todolist-gtk" ]; then
        binary="bin/todolist-gtk"
    else
        print_error "No binary found. Build first."
        exit 1
    fi

    print_msg "Running Valgrind memory check..."
    print_warning "This will open the app. Close it to see results."

    valgrind --leak-check=full \
             --show-leak-kinds=all \
             --track-origins=yes \
             --verbose \
             --log-file=valgrind-out.txt \
             $binary

    print_msg "Valgrind log saved to: valgrind-out.txt"
}

# Show help
show_help() {
    cat << EOF
${BLUE}GTK Todo List Build Script${NC}

${GREEN}Usage:${NC}
    ./build.sh [COMMAND]

${GREEN}Commands:${NC}
    (none)      - Default: Check deps and build with Meson (or Make)
    clean       - Remove all build artifacts
    meson       - Build with Meson
    make        - Build with Make
    test        - Run unit tests
    run         - Build and run the application
    install     - Install to system
    valgrind    - Run Valgrind memory check
    help        - Show this help message

${GREEN}Examples:${NC}
    ./build.sh              # Quick build
    ./build.sh clean meson  # Clean and rebuild with Meson
    ./build.sh test         # Run tests
    ./build.sh run          # Build and run
    ./build.sh valgrind     # Memory check

${GREEN}Dependencies:${NC}
    - GTK4 (>= 4.0)
    - json-glib (>= 1.6)
    - GCC or Clang
    - Meson (optional, recommended)

${GREEN}Install Dependencies (Ubuntu/Debian):${NC}
    sudo apt install libgtk-4-dev libjson-glib-dev build-essential meson

EOF
}

# Main script logic
main() {
    cd "$(dirname "$0")"

    if [ $# -eq 0 ]; then
        # Default: check deps and build
        check_deps

        if command -v meson &> /dev/null; then
            build_meson
        else
            build_make
        fi

        print_msg "${GREEN}Build successful!${NC}"
        print_msg "Run with: ./build.sh run"
        exit 0
    fi

    # Process commands
    for cmd in "$@"; do
        case "$cmd" in
            clean)
                clean
                ;;
            meson)
                check_deps
                build_meson
                ;;
            make)
                check_deps
                build_make
                ;;
            test)
                run_tests
                ;;
            run)
                check_deps
                if [ ! -f "builddir/todolist-gtk" ] && [ ! -f "bin/todolist-gtk" ]; then
                    if command -v meson &> /dev/null; then
                        build_meson
                    else
                        build_make
                    fi
                fi
                run_app
                ;;
            install)
                install_app
                ;;
            valgrind)
                check_memory
                ;;
            help|--help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown command: $cmd"
                print_msg "Run './build.sh help' for usage information"
                exit 1
                ;;
        esac
    done
}

# Run main
main "$@"
