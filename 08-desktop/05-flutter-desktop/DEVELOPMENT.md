# Development Guide

## Development Environment Setup

### Quick Start

1. **Install Flutter SDK**
   - Download from [flutter.dev](https://flutter.dev/docs/get-started/install)
   - Add Flutter to your PATH
   - Verify installation: `flutter doctor`

2. **Enable Desktop Support**
   ```bash
   flutter config --enable-windows-desktop
   flutter config --enable-macos-desktop
   flutter config --enable-linux-desktop
   ```

3. **Install Dependencies**
   ```bash
   flutter pub get
   ```

4. **Run the App**
   ```bash
   # Using the convenience scripts
   ./run.sh           # Linux/macOS
   run.bat            # Windows

   # Or manually
   flutter run -d windows    # Windows
   flutter run -d macos      # macOS
   flutter run -d linux      # Linux
   ```

## Project Architecture

### State Management
- **Provider Pattern**: Used for global state management
- **ChangeNotifier**: TodoProvider extends ChangeNotifier
- **Consumer Widgets**: For selective rebuilding

### Data Flow
```
User Action → Widget → Provider → Service → Database
                 ↓        ↓
              UI Update ← Notify Listeners
```

### Folder Structure Explanation

```
lib/
├── main.dart                   # Entry point, window setup
├── models/                     # Data models
│   └── todo.dart              # Todo model with serialization
├── providers/                  # State management
│   └── todo_provider.dart     # Todo state + business logic
├── screens/                    # Full-screen pages
│   └── home_screen.dart       # Main app screen
├── services/                   # Business logic & data
│   └── storage_service.dart   # Database operations
├── utils/                      # Utilities & helpers
│   └── app_shortcuts.dart     # Keyboard shortcuts
└── widgets/                    # Reusable UI components
    ├── add_todo_dialog.dart   # Create todo
    ├── edit_todo_dialog.dart  # Edit todo
    ├── filter_sidebar.dart    # Filters & categories
    ├── search_bar.dart        # Search input
    ├── statistics_panel.dart  # Stats display
    ├── todo_item.dart         # Single todo card
    └── todo_list.dart         # List container
```

## Development Workflow

### Hot Reload
- **Hot Reload**: Press `r` in terminal (updates UI without losing state)
- **Hot Restart**: Press `R` in terminal (full restart)
- **Quit**: Press `q` in terminal

### Debugging

1. **Debug Mode**
   ```bash
   flutter run -d windows --debug
   ```

2. **DevTools**
   ```bash
   flutter pub global activate devtools
   flutter pub global run devtools
   ```
   - Widget Inspector
   - Performance profiler
   - Memory profiler
   - Network monitor

3. **Logging**
   ```dart
   import 'dart:developer' as developer;
   developer.log('Message', name: 'TodoApp');
   ```

### Testing

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# View coverage
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

## Code Style

### Dart Style Guide
- Follow [Effective Dart](https://dart.dev/guides/language/effective-dart)
- Use `flutter analyze` to check
- Format with `dart format .`

### Best Practices

1. **Use const constructors**
   ```dart
   const Text('Hello');  // Good
   Text('Hello');         // Avoid if possible
   ```

2. **Prefer final over var**
   ```dart
   final name = 'Flutter';  // Good
   var name = 'Flutter';    // Avoid
   ```

3. **Use named parameters**
   ```dart
   Widget buildButton({
     required String text,
     required VoidCallback onPressed,
   }) { }
   ```

4. **Dispose controllers**
   ```dart
   @override
   void dispose() {
     _controller.dispose();
     super.dispose();
   }
   ```

## Database Schema

### Todos Table
```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  completedAt TEXT,
  category TEXT,
  priority INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_completed ON todos(completed);
CREATE INDEX idx_priority ON todos(priority);
CREATE INDEX idx_category ON todos(category);
```

## Adding New Features

### Example: Adding Tags

1. **Update Model** (`lib/models/todo.dart`)
   ```dart
   class Todo {
     final List<String> tags;
     // ... rest of model
   }
   ```

2. **Update Database** (`lib/services/storage_service.dart`)
   ```dart
   // Add migration
   Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
     if (oldVersion < 2) {
       await db.execute('ALTER TABLE todos ADD COLUMN tags TEXT');
     }
   }
   ```

3. **Update Provider** (`lib/providers/todo_provider.dart`)
   ```dart
   // Add tag filtering methods
   void setTagFilter(String tag) { ... }
   ```

4. **Update UI** (widgets)
   ```dart
   // Add tag chips, tag selector, etc.
   ```

## Platform-Specific Code

### Method Channels
```dart
import 'package:flutter/services.dart';

const platform = MethodChannel('com.example.todo/native');

Future<void> callNativeMethod() async {
  try {
    final result = await platform.invokeMethod('methodName');
    print(result);
  } on PlatformException catch (e) {
    print("Failed: '${e.message}'.");
  }
}
```

### Platform Detection
```dart
import 'dart:io';

if (Platform.isWindows) {
  // Windows-specific code
} else if (Platform.isMacOS) {
  // macOS-specific code
} else if (Platform.isLinux) {
  // Linux-specific code
}
```

## Performance Optimization

### Build Method
- Keep build methods pure
- Extract widgets to separate classes
- Use const constructors

### ListView Performance
```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    final item = items[index];
    return TodoItem(
      key: ValueKey(item.id),  // Stable keys
      todo: item,
    );
  },
);
```

### Provider Optimization
```dart
// Bad: Rebuilds entire widget tree
Consumer<TodoProvider>(
  builder: (context, provider, child) {
    return ExpensiveWidget(todos: provider.todos);
  },
)

// Good: Only rebuilds necessary parts
Selector<TodoProvider, List<Todo>>(
  selector: (context, provider) => provider.todos,
  builder: (context, todos, child) {
    return EfficientWidget(todos: todos);
  },
)
```

## Common Issues & Solutions

### Issue: Build fails on Windows
**Solution**: Ensure Visual Studio 2022 with C++ workload is installed

### Issue: Hot reload doesn't work
**Solution**: Some changes require hot restart (R) or full rebuild:
- Changing app initialization
- Adding new packages
- Modifying platform-specific code

### Issue: Database locked
**Solution**: Ensure proper database closing and avoid multiple connections

### Issue: Performance issues with large lists
**Solution**:
- Use ListView.builder
- Implement pagination
- Add virtual scrolling

## Useful Commands

```bash
# Check Flutter setup
flutter doctor -v

# Clean build files
flutter clean

# Update dependencies
flutter pub upgrade

# Analyze code
flutter analyze

# Format code
dart format .

# Generate icons
flutter pub run flutter_launcher_icons:main

# Build release
flutter build windows --release
flutter build macos --release
flutter build linux --release
```

## Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Documentation](https://dart.dev/guides)
- [Provider Package](https://pub.dev/packages/provider)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Material Design 3](https://m3.material.io/)

## Contributing

When contributing, please:
1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Test on all target platforms
5. Create clear commit messages
