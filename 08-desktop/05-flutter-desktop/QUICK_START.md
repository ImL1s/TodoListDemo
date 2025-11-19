# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Verify Flutter Installation

```bash
flutter --version
```

Expected output: Flutter 3.0.0 or higher

If not installed, visit: https://flutter.dev/docs/get-started/install

### Step 2: Enable Desktop Support

```bash
# Enable the desktop platform you're using
flutter config --enable-windows-desktop  # Windows
flutter config --enable-macos-desktop    # macOS
flutter config --enable-linux-desktop    # Linux
```

### Step 3: Install Dependencies

```bash
cd 08-desktop/05-flutter-desktop
flutter pub get
```

### Step 4: Run the App

**Option A: Use convenience scripts**

```bash
# Linux/macOS
./run.sh

# Windows
run.bat
```

**Option B: Run manually**

```bash
# Windows
flutter run -d windows

# macOS
flutter run -d macos

# Linux
flutter run -d linux
```

### Step 5: Try It Out!

The app should open in a new window. Try these features:

1. **Create a todo**: Press `Ctrl+N` (or `⌘+N` on Mac)
2. **Search**: Press `Ctrl+F` and type something
3. **Filter**: Click "Active" or "Completed" in the sidebar
4. **Edit**: Click on any todo to edit it
5. **Complete**: Check the checkbox next to a todo

## 🎯 Next Steps

- Read [README.md](README.md) for detailed features
- Check [FEATURES.md](FEATURES.md) for all capabilities
- See [DEVELOPMENT.md](DEVELOPMENT.md) for development guide
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details

## ⌨️ Essential Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New Todo |
| `Ctrl+F` | Search |
| `Ctrl+1/2/3` | Filter All/Active/Completed |
| `F5` | Refresh |
| `Enter` | Submit Form |
| `Escape` | Close Dialog |

## 🏗️ Building for Production

```bash
# Build release version
flutter build windows --release   # Windows
flutter build macos --release     # macOS
flutter build linux --release     # Linux

# Find your executable in:
# Windows: build/windows/runner/Release/
# macOS: build/macos/Build/Products/Release/
# Linux: build/linux/x64/release/bundle/
```

## 🐛 Troubleshooting

### "No devices found"
Run: `flutter config --enable-<platform>-desktop` for your platform

### "No suitable Visual Studio installation found" (Windows)
Install Visual Studio 2022 with "Desktop development with C++" workload

### Build errors
Run: `flutter clean && flutter pub get`

### Database errors
Delete the database file and restart:
- Windows: `%USERPROFILE%\Documents\flutter_desktop_todo.db`
- macOS/Linux: `~/Documents/flutter_desktop_todo.db`

## 💡 Tips

- Use hot reload (`r` in terminal) during development for instant updates
- Press `R` for full restart if hot reload doesn't work
- Use `flutter doctor` to check your setup
- Check the console for error messages

## 📱 Want Mobile Support Too?

This same codebase can run on iOS and Android with minimal changes! Just run:

```bash
flutter run -d ios        # iOS simulator
flutter run -d android    # Android emulator
```

---

**Need Help?** Check the full [README.md](README.md) or open an issue!
