@echo off
REM Flutter Desktop Todo - Quick Run Script for Windows

echo Flutter Desktop Todo - Quick Run Script
echo ========================================

REM Check if Flutter is installed
where flutter >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Flutter is not installed or not in PATH
    echo Please install Flutter from https://flutter.dev/docs/get-started/install
    exit /b 1
)

REM Check Flutter version
echo Checking Flutter version...
flutter --version

REM Get dependencies
echo.
echo Getting dependencies...
flutter pub get

REM Run on Windows
echo.
echo Running on Windows...
flutter run -d windows
