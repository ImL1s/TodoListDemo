# Build Instructions - Cocos2d-x TodoList

Quick reference guide for building the TodoList application on all supported platforms.

## Prerequisites

1. **Download Cocos2d-x 4.0** (see `cocos2d-setup.md`)
2. **Install platform-specific tools** (see below)

## Android Build

### Setup

```bash
# Install Android Studio from https://developer.android.com/studio
# Install SDK components:
# - Android SDK Platform 33
# - Android SDK Build-Tools 33.0.0
# - Android NDK r21+
# - CMake 3.10+
```

### Build APK

#### Option 1: Command Line (Gradle)

```bash
cd 09-game-engines/06-cocos2dx/proj.android

# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Output: app/build/outputs/apk/debug/app-debug.apk
```

#### Option 2: Android Studio

```bash
1. Open Android Studio
2. File > Open > Select proj.android directory
3. Wait for Gradle sync
4. Build > Build Bundle(s) / APK(s) > Build APK(s)
5. Or click Run button to install on device
```

### Install and Run

```bash
# Install on device
adb install app/build/outputs/apk/debug/app-debug.apk

# Launch app
adb shell am start -n com.example.todolist/org.cocos2dx.lib.Cocos2dxActivity

# View logs
adb logcat | grep cocos2d
```

### Troubleshooting

**Problem**: ANDROID_SDK_ROOT not set
```bash
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
# Or set in gradle.properties: sdk.dir=/path/to/android/sdk
```

**Problem**: NDK not found
```bash
# Install NDK in Android Studio
# Tools > SDK Manager > SDK Tools > NDK (Side by side)
# Or download from https://developer.android.com/ndk/downloads
```

---

## iOS Build

### Setup

```bash
# Install Xcode from App Store (Xcode 11+)
# Install Command Line Tools
xcode-select --install

# Accept license
sudo xcodebuild -license accept
```

### Build IPA

#### Option 1: Xcode (Recommended)

```bash
cd 09-game-engines/06-cocos2dx/proj.ios_mac

# Open Xcode project
open ios/TodoList.xcodeproj

# In Xcode:
1. Select target: TodoList
2. Select device or simulator
3. Product > Build (⌘B)
4. Product > Run (⌘R)
```

#### Option 2: Command Line (xcodebuild)

```bash
cd 09-game-engines/06-cocos2dx/proj.ios_mac/ios

# Build for simulator
xcodebuild -project TodoList.xcodeproj \
    -scheme TodoList \
    -configuration Debug \
    -sdk iphonesimulator \
    -arch x86_64

# Build for device
xcodebuild -project TodoList.xcodeproj \
    -scheme TodoList \
    -configuration Release \
    -sdk iphoneos \
    -arch arm64

# Output: build/Release-iphoneos/TodoList.app
```

### Create IPA

```bash
# Archive for distribution
xcodebuild -project TodoList.xcodeproj \
    -scheme TodoList \
    -configuration Release \
    -archivePath TodoList.xcarchive \
    archive

# Export IPA
xcodebuild -exportArchive \
    -archivePath TodoList.xcarchive \
    -exportPath . \
    -exportOptionsPlist ExportOptions.plist
```

### Troubleshooting

**Problem**: Code signing error
```bash
# In Xcode:
# Project Settings > Signing & Capabilities
# Team: Select your Apple Developer account
# Or disable automatic signing for testing
```

**Problem**: Provisioning profile issues
```bash
# Use Xcode to manage profiles automatically
# Or download from Apple Developer portal
```

---

## Windows Build

### Setup

```bash
# Install Visual Studio 2019 or 2022
# Required workloads:
# - Desktop development with C++
# - Windows 10 SDK (10.0.19041.0 or later)
# - CMake tools (optional)
```

### Build EXE

#### Option 1: Visual Studio (Recommended)

```bash
cd 09-game-engines/06-cocos2dx/proj.win32

# Open solution
# Double-click TodoList.sln

# In Visual Studio:
1. Select configuration: Debug or Release
2. Select platform: Win32 or x64
3. Build > Build Solution (F7)
4. Debug > Start Debugging (F5)

# Output: Debug.win32/TodoList.exe or Release.win32/TodoList.exe
```

#### Option 2: MSBuild Command Line

```bash
cd 09-game-engines/06-cocos2dx/proj.win32

# Open Visual Studio Developer Command Prompt

# Debug build
msbuild TodoList.sln /p:Configuration=Debug /p:Platform=Win32

# Release build
msbuild TodoList.sln /p:Configuration=Release /p:Platform=Win32

# Run
Debug.win32\TodoList.exe
```

#### Option 3: CMake

```bash
cd 09-game-engines/06-cocos2dx

# Generate Visual Studio project
mkdir build && cd build
cmake .. -G "Visual Studio 16 2019" -A Win32

# Build
cmake --build . --config Debug
cmake --build . --config Release

# Run
bin\Debug\TodoList.exe
```

### Troubleshooting

**Problem**: Missing DLLs
```bash
# Cocos2d-x DLLs should be in the same directory as the EXE
# Copy from cocos2d/cocos/2d/ if needed
```

**Problem**: Resource files not found
```bash
# Ensure Resources/ folder is in the same directory as EXE
# Or copy Resources/ to output directory
```

---

## macOS Build

### Setup

```bash
# Install Xcode from App Store
xcode-select --install

# Install Homebrew (optional)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install CMake
brew install cmake
```

### Build APP

#### Option 1: Xcode

```bash
cd 09-game-engines/06-cocos2dx

# Generate Xcode project
mkdir build && cd build
cmake .. -G Xcode

# Open and build
open TodoList.xcodeproj
# Product > Build (⌘B)
# Product > Run (⌘R)
```

#### Option 2: CMake + Make

```bash
cd 09-game-engines/06-cocos2dx

# Generate Makefile
mkdir build && cd build
cmake ..

# Build
make -j$(sysctl -n hw.ncpu)

# Run
open ./bin/TodoList.app
# Or
./bin/TodoList.app/Contents/MacOS/TodoList
```

#### Option 3: Command Line (xcodebuild)

```bash
cd 09-game-engines/06-cocos2dx/build

# Build
xcodebuild -project TodoList.xcodeproj \
    -configuration Debug \
    -target TodoList

# Run
open Debug/TodoList.app
```

### Create DMG

```bash
# Create disk image for distribution
hdiutil create -volname "TodoList" \
    -srcfolder build/Release/TodoList.app \
    -ov -format UDZO \
    TodoList.dmg
```

### Troubleshooting

**Problem**: Gatekeeper warning
```bash
# Allow app to run
xattr -cr TodoList.app
# Or in System Preferences > Security & Privacy
```

---

## Linux Build (Experimental)

### Setup (Ubuntu/Debian)

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    libgl1-mesa-dev \
    libglew-dev \
    libglfw3-dev \
    libglm-dev \
    libx11-dev \
    libxcursor-dev \
    libxrandr-dev \
    libxinerama-dev \
    libxi-dev \
    libxxf86vm-dev \
    libfontconfig1-dev \
    libcurl4-openssl-dev \
    libasound2-dev \
    libpulse-dev \
    libopenal-dev \
    libvorbis-dev \
    libflac-dev \
    cmake \
    pkg-config
```

### Build Binary

```bash
cd 09-game-engines/06-cocos2dx

# Generate Makefile
mkdir build && cd build
cmake ..

# Build
make -j$(nproc)

# Run
cd bin
./TodoList
```

### Troubleshooting

**Problem**: OpenGL errors
```bash
# Install latest graphics drivers
# NVIDIA: sudo apt-get install nvidia-driver-xxx
# AMD: sudo apt-get install mesa-vulkan-drivers
```

**Problem**: Missing libraries
```bash
# Check dependencies
ldd bin/TodoList

# Install missing libraries
sudo apt-get install <library-name>
```

---

## Build Configurations

### Debug vs Release

**Debug**:
- Includes debugging symbols
- No optimization
- Larger binary size
- Slower performance
- Useful for development

**Release**:
- Optimized for performance
- Smaller binary size
- No debugging symbols
- Faster execution
- For distribution

### Architecture Options

- **Android**: armeabi-v7a, arm64-v8a, x86, x86_64
- **iOS**: arm64 (device), x86_64 (simulator)
- **Windows**: Win32 (x86), x64
- **macOS**: x86_64, arm64 (Apple Silicon)

## Clean Build

Remove build artifacts:

```bash
# Android
cd proj.android
./gradlew clean
rm -rf app/build app/.cxx

# iOS/macOS
cd proj.ios_mac
rm -rf build DerivedData

# Windows
cd proj.win32
rmdir /s /q Debug.win32 Release.win32

# Linux/macOS (CMake)
rm -rf build
```

## Build Time Estimates

- **Android**: 2-5 minutes (first build), 30s-1min (incremental)
- **iOS**: 3-7 minutes (first build), 1-2min (incremental)
- **Windows**: 2-4 minutes (first build), 30s-1min (incremental)
- **macOS**: 2-5 minutes (first build), 1-2min (incremental)
- **Linux**: 3-6 minutes (first build), 1-2min (incremental)

*Times vary based on hardware and configuration*

## Output Sizes

Approximate binary sizes:

- **Android APK**: 15-25 MB per ABI (uncompressed: 40-60 MB)
- **iOS IPA**: 30-40 MB (uncompressed: 60-80 MB)
- **Windows EXE**: 10-20 MB + ~30MB DLLs
- **macOS APP**: 25-35 MB
- **Linux Binary**: 15-25 MB

## Next Steps

After successful build:

1. **Test the application**: Run on device/emulator
2. **Check logs**: Look for any runtime errors
3. **Test all features**: Add/delete/toggle todos
4. **Verify persistence**: Restart app and check data
5. **Performance test**: Add 100+ todos, check scrolling

## Need Help?

- Check `README.md` for detailed documentation
- See `cocos2d-setup.md` for engine installation
- Visit Cocos2d-x forum: https://discuss.cocos2d-x.org/
- Check GitHub issues: https://github.com/cocos2d/cocos2d-x/issues

---

**Last Updated**: 2025-11-21
**Tested with**: Cocos2d-x v4.0
