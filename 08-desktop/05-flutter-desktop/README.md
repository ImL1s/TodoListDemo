# Flutter Desktop Todo List

A modern, cross-platform desktop Todo List application built with Flutter 3.0+ that runs natively on Windows, macOS, and Linux.

## Features

### Core Functionality
- **Full CRUD Operations**: Create, Read, Update, and Delete todos
- **Smart Filtering**: Filter by All, Active, or Completed todos
- **Category Management**: Organize todos with custom categories
- **Priority Levels**: Three priority levels (Low, Medium, High)
- **Search**: Real-time search across todo titles and descriptions
- **Statistics**: Comprehensive statistics and progress tracking

### Desktop-Optimized Features
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Responsive Layout**: Adaptive UI that responds to window resizing
- **Mouse Interactions**: Hover effects and right-click context menus
- **Window Management**: Customizable window size with minimum constraints
- **Native Look & Feel**: Platform-appropriate UI styling
- **Persistent Storage**: Local SQLite database for data persistence

### UI/UX Highlights
- **Three-Panel Layout** (on wide screens):
  - Left: Filter sidebar with categories
  - Center: Todo list
  - Right: Statistics panel
- **Responsive Design**: Adapts to different screen sizes
- **Material Design 3**: Modern, clean interface
- **Dark Mode Support**: Automatic theme switching

## Screenshots

```
┌─────────────────────────────────────────────────────────────────┐
│  Flutter Desktop Todo                    [12 Active] [5 Done]  │
├─────────────┬───────────────────────────────┬───────────────────┤
│             │  Search... (Ctrl+F)           │                   │
│  New Todo   ├───────────────────────────────┤  Statistics      │
│             │                               │                   │
│  FILTER     │  ☐ Buy groceries             │  Total: 17       │
│  ● All  17  │  ☐ Finish project proposal   │  Active: 12      │
│  ○ Active12 │  ☑ Morning workout           │  Completed: 5    │
│  ○ Done  5  │  ☐ Call dentist              │                   │
│             │                               │  Progress        │
│  CATEGORIES │  ☐ Review pull requests      │  ████░░░ 29%     │
│  Work    8  │  ☑ Team standup meeting      │                   │
│  Personal 6 │                               │  By Priority     │
│  Shopping 3 │                               │  ● High: 3       │
│             │                               │  ● Medium: 6     │
│  ACTIONS    │                               │  ● Low: 3        │
│  Clear Done │                               │                   │
│  Refresh    │                               │                   │
└─────────────┴───────────────────────────────┴───────────────────┘
```

## Technology Stack

- **Flutter**: 3.0+
- **State Management**: Provider
- **Database**: SQLite (via sqflite_common_ffi)
- **Storage**: path_provider
- **Window Management**: window_manager
- **Keyboard Shortcuts**: hotkey_manager

## Installation

### Prerequisites

1. **Flutter SDK 3.0+**
   ```bash
   flutter --version
   # Should show Flutter 3.0.0 or higher
   ```

2. **Platform-specific requirements**:

   **Windows:**
   - Visual Studio 2022 with "Desktop development with C++" workload
   - Windows 10 or higher

   **macOS:**
   - Xcode 13 or higher
   - macOS 10.14 or higher
   - CocoaPods

   **Linux:**
   - Clang, CMake, GTK development headers, Ninja build
   ```bash
   sudo apt-get install clang cmake ninja-build pkg-config libgtk-3-dev liblzma-dev
   ```

### Setup

1. **Clone the repository**:
   ```bash
   cd 08-desktop/05-flutter-desktop
   ```

2. **Enable desktop support** (if not already enabled):
   ```bash
   # Enable all desktop platforms
   flutter config --enable-windows-desktop
   flutter config --enable-macos-desktop
   flutter config --enable-linux-desktop
   ```

3. **Install dependencies**:
   ```bash
   flutter pub get
   ```

4. **Run the application**:
   ```bash
   # Windows
   flutter run -d windows

   # macOS
   flutter run -d macos

   # Linux
   flutter run -d linux
   ```

## Building for Production

### Windows

```bash
# Build release version
flutter build windows --release

# Output location:
# build/windows/runner/Release/

# The executable will be:
# build/windows/runner/Release/flutter_desktop_todo.exe
```

**Creating an installer:**
- Use [Inno Setup](https://jrsoftware.org/isinfo.php) or [NSIS](https://nsis.sourceforge.io/)
- Package the entire `Release` folder
- Include Visual C++ Redistributables

### macOS

```bash
# Build release version
flutter build macos --release

# Output location:
# build/macos/Build/Products/Release/

# The app bundle will be:
# build/macos/Build/Products/Release/flutter_desktop_todo.app
```

**Creating a DMG:**
```bash
# Install create-dmg
brew install create-dmg

# Create DMG
create-dmg \
  --volname "Flutter Desktop Todo" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --app-drop-link 600 185 \
  "flutter_desktop_todo.dmg" \
  "build/macos/Build/Products/Release/flutter_desktop_todo.app"
```

### Linux

```bash
# Build release version
flutter build linux --release

# Output location:
# build/linux/x64/release/bundle/

# The executable will be:
# build/linux/x64/release/bundle/flutter_desktop_todo
```

**Creating a package:**
- Use `dpkg-deb` for Debian/Ubuntu packages
- Use `rpmbuild` for Fedora/RHEL packages
- Use AppImage for universal distribution

**Example: Creating an AppImage:**
```bash
# Download appimagetool
wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
chmod +x appimagetool-x86_64.AppImage

# Create AppDir structure
mkdir -p FlutterDesktopTodo.AppDir/usr/bin
cp -r build/linux/x64/release/bundle/* FlutterDesktopTodo.AppDir/usr/bin/

# Create AppImage
./appimagetool-x86_64.AppImage FlutterDesktopTodo.AppDir
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` (Win/Linux) / `⌘+N` (Mac) | New Todo |
| `Ctrl+F` (Win/Linux) / `⌘+F` (Mac) | Focus Search |
| `Ctrl+1` (Win/Linux) / `⌘+1` (Mac) | Show All Todos |
| `Ctrl+2` (Win/Linux) / `⌘+2` (Mac) | Show Active Todos |
| `Ctrl+3` (Win/Linux) / `⌘+3` (Mac) | Show Completed Todos |
| `Ctrl+Shift+C` (Win/Linux) / `⌘+⇧+C` (Mac) | Clear Completed |
| `F5` or `Ctrl+R` (Win/Linux) / `⌘+R` (Mac) | Refresh |
| `Enter` | Submit form / Edit todo |
| `Escape` | Close dialog |

## Project Structure

```
lib/
├── main.dart                      # App entry point, window configuration
├── models/
│   └── todo.dart                  # Todo model, filters, enums
├── providers/
│   └── todo_provider.dart         # State management with Provider
├── screens/
│   └── home_screen.dart           # Main screen with responsive layout
├── services/
│   └── storage_service.dart       # SQLite database operations
├── utils/
│   └── app_shortcuts.dart         # Keyboard shortcuts configuration
└── widgets/
    ├── add_todo_dialog.dart       # Add new todo dialog
    ├── edit_todo_dialog.dart      # Edit todo dialog
    ├── filter_sidebar.dart        # Left sidebar with filters
    ├── search_bar.dart            # Search input widget
    ├── statistics_panel.dart      # Right panel with stats
    ├── todo_item.dart             # Individual todo card
    └── todo_list.dart             # Todo list view
```

## Desktop vs Mobile Differences

### Desktop Advantages Implemented

1. **Larger Screen Real Estate**
   - Three-panel layout on wide screens
   - More information visible at once
   - Side-by-side editing and viewing

2. **Keyboard-First Interaction**
   - Comprehensive keyboard shortcuts
   - Tab navigation through forms
   - Focus management

3. **Mouse Interactions**
   - Hover states for better feedback
   - Right-click context menus (can be added)
   - Drag and drop (can be extended)

4. **Window Management**
   - Resizable window with constraints
   - Custom title bar options
   - Multi-window support (can be extended)

5. **Performance**
   - Optimized for desktop rendering
   - Efficient list rendering with ListView.builder
   - Lazy loading for large datasets

### Responsive Breakpoints

- **Narrow** (< 800px): Mobile-like layout with bottom sheet
- **Medium** (800px - 1200px): Two-panel with sidebar
- **Wide** (> 1200px): Three-panel with statistics

## Performance Optimizations

1. **Efficient Rendering**
   - Use `const` constructors where possible
   - ListView.builder for lazy loading
   - ValueKey for stable widget identity

2. **State Management**
   - Selective rebuilding with Consumer widgets
   - Minimal provider scopes
   - Immutable data models

3. **Database**
   - Indexed queries for fast filtering
   - Batch operations for multiple updates
   - Connection pooling

4. **Memory Management**
   - Proper disposal of controllers
   - Weak references for large objects
   - Image caching (if images are added)

## Advanced Features (Extension Ideas)

### Currently Implemented
- ✅ Local SQLite persistence
- ✅ Keyboard shortcuts
- ✅ Responsive layout
- ✅ Search and filtering
- ✅ Category management
- ✅ Priority levels
- ✅ Statistics panel

### Future Enhancements
- ⬜ Cloud sync (Firebase, Supabase)
- ⬜ Multiple windows support
- ⬜ System tray integration
- ⬜ Global hotkeys
- ⬜ Export/Import (JSON, CSV)
- ⬜ Markdown support in descriptions
- ⬜ File attachments
- ⬜ Recurring todos
- ⬜ Reminders and notifications
- ⬜ Themes customization
- ⬜ Plugins system

## Platform-Specific Considerations

### Windows
- Uses Windows FFI for native features
- Respects Windows design guidelines
- Integrates with Windows notification system (extensible)

### macOS
- Follows Apple Human Interface Guidelines
- Uses native macOS widgets where applicable
- Can integrate with macOS services (Spotlight, etc.)

### Linux
- Compatible with various desktop environments (GNOME, KDE, etc.)
- Uses GTK for native rendering
- Respects system themes

## Debugging

```bash
# Run in debug mode
flutter run -d windows --debug

# Enable verbose logging
flutter run -d windows --verbose

# Hot reload (during development)
# Press 'r' in terminal or use IDE shortcuts

# DevTools
flutter pub global activate devtools
flutter pub global run devtools
```

## Common Issues

### Issue: "No suitable Visual Studio installation found" (Windows)

**Solution**: Install Visual Studio 2022 with C++ desktop development workload.

### Issue: SQLite initialization error

**Solution**: Ensure sqflite_common_ffi is properly initialized in main():
```dart
sqfliteFfiInit();
databaseFactory = databaseFactoryFfi;
```

### Issue: Window doesn't appear

**Solution**: Check window_manager initialization and ensure waitUntilReadyToShow is called.

## Learning Resources

### Flutter Desktop Official Docs
- [Flutter Desktop Support](https://docs.flutter.dev/desktop)
- [Building Desktop Apps](https://docs.flutter.dev/development/platform-integration/desktop)
- [Desktop Plugins](https://docs.flutter.dev/development/packages-and-plugins/developing-packages#plugin-platforms)

### Packages Documentation
- [window_manager](https://pub.dev/packages/window_manager)
- [sqflite_common_ffi](https://pub.dev/packages/sqflite_common_ffi)
- [provider](https://pub.dev/packages/provider)
- [hotkey_manager](https://pub.dev/packages/hotkey_manager)

### Best Practices
- [Flutter Performance Best Practices](https://docs.flutter.dev/perf/best-practices)
- [Material Design 3](https://m3.material.io/)
- [Responsive Design in Flutter](https://docs.flutter.dev/development/ui/layout/adaptive-responsive)

### Community Resources
- [Flutter Desktop Channel](https://discord.gg/flutter) on Discord
- [r/FlutterDev](https://reddit.com/r/FlutterDev) on Reddit
- [Flutter Community](https://flutter.dev/community)

## Contributing

Contributions are welcome! This is a demonstration project showing Flutter Desktop best practices.

### Areas for Contribution
1. Additional features (see Future Enhancements)
2. Platform-specific optimizations
3. UI/UX improvements
4. Performance optimizations
5. Documentation improvements
6. Bug fixes

## License

MIT License - Feel free to use this project as a learning resource or starting point for your own applications.

## Acknowledgments

- Flutter team for excellent desktop support
- Community packages that make desktop development easier
- Material Design team for comprehensive design guidelines

---

**Note**: This is a demonstration project showcasing Flutter Desktop capabilities. For production use, consider adding:
- Comprehensive error handling
- Logging system
- Analytics
- Crash reporting
- Auto-update mechanism
- Comprehensive testing suite
- CI/CD pipeline
