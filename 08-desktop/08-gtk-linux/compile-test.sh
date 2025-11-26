#!/bin/bash
# compile-test.sh - Test compilation without dependencies
# This script performs syntax check and static analysis

set -e

echo "==> Running C syntax and static analysis check..."

# Check if cppcheck is available
if command -v cppcheck &> /dev/null; then
    echo "==> Running cppcheck..."
    cppcheck --enable=all --suppress=missingIncludeSystem \
             --suppress=unusedFunction \
             --std=c11 \
             --language=c \
             src/*.c 2>&1 | grep -v "^Checking" | grep -v "^$" || true
    echo "==> Cppcheck complete"
fi

# Check for common issues
echo "==> Checking for common issues..."

# Check for missing includes
echo "Checking includes..."
for file in src/*.c; do
    echo "  Checking $file..."

    # Check for gtk functions without gtk.h
    if grep -q "gtk_\|GTK_" "$file" && ! grep -q "#include.*gtk/gtk.h" "$file"; then
        echo "    WARNING: $file uses GTK functions but doesn't include gtk/gtk.h"
    fi

    # Check for g_ functions without glib.h (usually via gtk.h)
    if grep -q "g_object_\|g_signal_\|g_list_" "$file" && ! grep -q "#include.*glib.*\|#include.*gtk" "$file"; then
        echo "    WARNING: $file uses GLib functions but doesn't include GLib headers"
    fi
done

# Check for memory leaks patterns
echo "Checking for potential memory issues..."
for file in src/*.c; do
    # Check for malloc/g_new without corresponding free
    if grep -q "g_new\|g_malloc" "$file"; then
        echo "  Found memory allocation in $file - verify g_free is called"
    fi

    # Check for strdup without free
    if grep -q "g_strdup\|strdup" "$file"; then
        echo "  Found string duplication in $file - verify g_free is called"
    fi
done

# Check for proper signal disconnection
echo "Checking signal handling..."
for file in src/*.c; do
    if grep -q "g_signal_connect" "$file"; then
        if ! grep -q "g_signal_handler_disconnect\|dispose\|finalize" "$file"; then
            echo "  WARNING: $file connects signals but may not disconnect them"
        fi
    fi
done

echo "==> Static analysis complete!"
echo ""
echo "To perform full compilation:"
echo "  1. Install dependencies: sudo apt install libgtk-4-dev libjson-glib-dev"
echo "  2. Run: ./build.sh"
echo ""
