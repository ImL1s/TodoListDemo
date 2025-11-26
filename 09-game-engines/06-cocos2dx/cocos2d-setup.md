# Cocos2d-x Engine Setup Guide

## Why is Cocos2d-x not included?

The Cocos2d-x engine is **approximately 500MB** in size and includes:
- Core engine libraries
- Platform-specific implementations
- External dependencies
- Build tools and scripts
- Documentation and examples

To keep this repository lightweight, the engine is **not included**. You need to download it separately.

## Download Options

### Option 1: Official Release (Recommended)

**Download Cocos2d-x 4.0**:

1. Visit the official website:
   ```
   https://www.cocos.com/en/cocos2dx/download
   ```

2. Download **Cocos2d-x v4.0** (or latest v4.x)

3. Extract to this directory:
   ```bash
   cd 09-game-engines/06-cocos2dx/
   unzip cocos2d-x-4.0.zip
   mv cocos2d-x-4.0 cocos2d
   ```

4. Install dependencies:
   ```bash
   cd cocos2d
   python download-deps.py
   python setup.py
   ```

### Option 2: Clone from GitHub

```bash
cd 09-game-engines/06-cocos2dx/

# Clone Cocos2d-x v4 branch
git clone https://github.com/cocos2d/cocos2d-x.git --branch v4 --depth 1

# Rename to cocos2d
mv cocos2d-x cocos2d

# Install dependencies
cd cocos2d
git submodule update --init
python download-deps.py
python setup.py
```

### Option 3: Using Cocos Console (For Developers)

If you have Cocos Console installed:

```bash
cocos new TodoList -l cpp -d 09-game-engines/06-cocos2dx/
# Then replace Classes/ and Resources/ with this project's files
```

## Verify Installation

After downloading, your directory structure should look like:

```
06-cocos2dx/
├── Classes/
├── Resources/
├── proj.android/
├── proj.ios_mac/
├── proj.win32/
├── cocos2d/                 ← Engine directory
│   ├── cocos/               ← Core engine
│   ├── cmake/
│   ├── external/            ← Dependencies
│   ├── licenses/
│   ├── setup.py
│   └── download-deps.py
├── CMakeLists.txt
└── README.md
```

## Platform Dependencies

### Android

Install via Android Studio:
- Android SDK (API 21+)
- Android NDK r21+
- CMake 3.10+

Or via command line:
```bash
sdkmanager "platforms;android-33"
sdkmanager "ndk;21.4.7075529"
sdkmanager "cmake;3.10.2.4988404"
```

### iOS/macOS

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods (optional)
sudo gem install cocoapods
```

### Windows

1. Install Visual Studio 2019 or later
2. Include "Desktop development with C++"
3. Include "Windows 10 SDK"
4. CMake is usually included, or download from https://cmake.org/

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y \
    g++ \
    libgdk-pixbuf2.0-dev \
    python-pip \
    cmake \
    libx11-dev \
    libxmu-dev \
    libglu1-mesa-dev \
    libgl2ps-dev \
    libxi-dev \
    libzip-dev \
    libpng-dev \
    libcurl4-gnutls-dev \
    libfontconfig1-dev \
    libsqlite3-dev \
    libglew-dev \
    libssl-dev \
    libgtk-3-dev
```

## Post-Setup

After installing Cocos2d-x, you can build the TodoList application:

```bash
# Android
cd proj.android
./gradlew assembleDebug

# iOS
cd proj.ios_mac
open ios/TodoList.xcodeproj

# Windows
cd proj.win32
# Open TodoList.sln in Visual Studio

# macOS/Linux
mkdir build && cd build
cmake ..
make
```

## Troubleshooting

### Problem: Python not found

```bash
# Install Python 2.7 or 3.x
# Windows: Download from python.org
# Linux: sudo apt-get install python3
# macOS: brew install python3
```

### Problem: CMake version too old

```bash
# Update CMake to 3.10+
# Linux: sudo apt-get install cmake
# macOS: brew install cmake
# Windows: Download from https://cmake.org/download/
```

### Problem: download-deps.py fails

```bash
# Manually download dependencies
cd cocos2d/external
# Visit: https://github.com/cocos2d/cocos2d-x-3rd-party-libs-bin
# Download and extract to external/ directory
```

## Engine Size Breakdown

Approximate sizes after installation:

```
cocos2d/
├── cocos/              ~100 MB    (Core engine)
├── external/           ~200 MB    (Third-party libraries)
├── build/              ~150 MB    (Build artifacts)
├── cmake/              ~5 MB      (Build system)
└── Other files         ~45 MB     (Docs, tests, etc.)
────────────────────────────────
Total:                  ~500 MB
```

## Alternative: Use Prebuilt Libraries

For faster setup, you can use prebuilt Cocos2d-x libraries:

1. Download from: https://github.com/cocos2d/cocos2d-x/releases
2. Extract prebuilt libraries for your platform
3. Link against them in your build configuration

## Documentation

Official documentation:
- Getting Started: https://docs.cocos2d-x.org/cocos2d-x/v4/en/
- API Reference: https://docs.cocos2d-x.org/api-ref/
- Forum: https://discuss.cocos2d-x.org/

## Support

If you encounter issues:
1. Check Cocos2d-x GitHub Issues: https://github.com/cocos2d/cocos2d-x/issues
2. Ask on the forum: https://discuss.cocos2d-x.org/
3. Join Discord: https://discord.gg/cocos

---

**Note**: This TodoList application is tested with **Cocos2d-x v4.0** and may require minor adjustments for other versions.
