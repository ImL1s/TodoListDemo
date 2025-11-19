#!/bin/bash

# Flutter Desktop Todo - Quick Run Script

echo "Flutter Desktop Todo - Quick Run Script"
echo "========================================"

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "Error: Flutter is not installed or not in PATH"
    echo "Please install Flutter from https://flutter.dev/docs/get-started/install"
    exit 1
fi

# Check Flutter version
echo "Checking Flutter version..."
flutter --version

# Get dependencies
echo ""
echo "Getting dependencies..."
flutter pub get

# Detect platform and run
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo ""
    echo "Running on Linux..."
    flutter run -d linux
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo ""
    echo "Running on macOS..."
    flutter run -d macos
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo ""
    echo "Running on Windows..."
    flutter run -d windows
else
    echo ""
    echo "Unknown OS: $OSTYPE"
    echo "Please run manually: flutter run -d <platform>"
    exit 1
fi
