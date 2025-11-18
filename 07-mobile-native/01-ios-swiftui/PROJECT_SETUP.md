# Xcode Project Setup Guide

This guide will help you create a complete Xcode project from these source files.

## Quick Start

### Option 1: Create New Xcode Project (Recommended)

1. **Open Xcode** (version 13.0 or later)

2. **Create New Project**
   - File → New → Project (⇧⌘N)
   - Choose "iOS" → "App"
   - Click "Next"

3. **Configure Project**
   ```
   Product Name:         TodoList
   Team:                 [Your Team]
   Organization ID:      com.yourname
   Bundle Identifier:    com.yourname.TodoList
   Interface:            SwiftUI
   Language:             Swift
   Storage:              None (we'll use UserDefaults)
   ```
   - Click "Next"
   - Choose save location
   - Click "Create"

4. **Add Source Files**

   **Method A: Drag and Drop**
   - Open Finder and navigate to this directory
   - Select all `.swift` files
   - Drag into Xcode's Project Navigator
   - Check "Copy items if needed"
   - Ensure "TodoList" target is selected
   - Click "Finish"

   **Method B: Manual Add**
   - Right-click project in Navigator
   - New Group → "Models"
   - New Group → "ViewModels"
   - New Group → "Views"
   - New Group → "Utilities"
   - Add files to respective groups:
     ```
     TodoList/
     ├── TodoListApp.swift
     ├── ContentView.swift
     ├── Models/
     │   └── Todo.swift
     ├── ViewModels/
     │   └── TodoViewModel.swift
     ├── Views/
     │   ├── TodoInputView.swift
     │   ├── TodoListView.swift
     │   └── TodoItemRow.swift
     └── Utilities/
         └── UserDefaultsManager.swift
     ```

5. **Configure Project Settings**

   Select your project in Navigator → General tab:
   ```
   Display Name:         Todo List
   Bundle Identifier:    com.yourname.TodoList
   Version:              1.0.0
   Build:                1

   Deployment Info:
   - iOS:                15.0
   - iPhone:             ✓
   - iPad:               ✓
   - Supported Orientations: Portrait, Landscape

   Status Bar Style:     Default
   Appearance:           Automatic
   ```

6. **Replace ContentView.swift**
   - Delete the auto-generated `ContentView.swift`
   - Add our `ContentView.swift`

7. **Replace App File**
   - Delete auto-generated `TodoListApp.swift`
   - Add our `TodoListApp.swift`

8. **Add Info.plist Settings**
   - Select Info.plist or Info tab
   - Ensure these settings:
     ```xml
     UIApplicationSceneManifest
       - UIApplicationSupportsMultipleScenes: YES
     UIUserInterfaceStyle: Automatic
     ```

9. **Build and Run**
   - Select a simulator or device
   - Press ⌘R or click ▶️ Run button
   - App should launch successfully

### Option 2: Use This Directory Structure

If you prefer to work with the existing structure:

1. **Open Terminal** in this directory

2. **Generate Xcode Project** (using xcodegen if installed)
   ```bash
   # Install xcodegen if needed
   brew install xcodegen

   # Create project.yml
   cat > project.yml << 'EOF'
   name: TodoList
   options:
     bundleIdPrefix: com.yourname
   targets:
     TodoList:
       type: application
       platform: iOS
       deploymentTarget: "15.0"
       sources:
         - .
       settings:
         PRODUCT_BUNDLE_IDENTIFIER: com.yourname.TodoList
         INFOPLIST_FILE: Info.plist
         SWIFT_VERSION: 5.5
   EOF

   # Generate project
   xcodegen generate

   # Open project
   open TodoList.xcodeproj
   ```

3. **Or create manually** following Option 1 steps

## Detailed Configuration

### App Icon Setup

1. **Create Assets Catalog** (if not exists)
   - Right-click project
   - New File → Asset Catalog
   - Name: `Assets.xcassets`

2. **Add App Icon**
   - Select `Assets.xcassets`
   - Right-click → "App Icons & Launch Images" → "New iOS App Icon"
   - Drag images for each size:
     ```
     Required sizes:
     - 1024x1024 (App Store)
     - 180x180 (iPhone @3x)
     - 120x120 (iPhone @2x)
     - 167x167 (iPad Pro @2x)
     - 152x152 (iPad @2x)
     - 76x76 (iPad @1x)
     ```

   **Quick tip:** Use [AppIcon.co](https://appicon.co) to generate all sizes from one image.

3. **Verify**
   - Project Settings → General → App Icons and Launch Images
   - App Icon Source: AppIcon

### Launch Screen

**Option 1: Using Info.plist (iOS 14+)**

Add to Info.plist:
```xml
<key>UILaunchScreen</key>
<dict>
    <key>UIColorName</key>
    <string>LaunchBackgroundColor</string>
    <key>UIImageName</key>
    <string>LaunchIcon</string>
    <key>UIImageRespectsSafeAreaInsets</key>
    <true/>
</dict>
```

**Option 2: SwiftUI Launch Screen (iOS 17+)**

Create `LaunchScreen.swift`:
```swift
import SwiftUI

struct LaunchScreen: View {
    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [.blue, .purple]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack {
                Image(systemName: "checklist")
                    .font(.system(size: 80))
                    .foregroundColor(.white)

                Text("Todo List")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
            }
        }
        .ignoresSafeArea()
    }
}
```

### Build Settings

#### Debug Configuration

```
SWIFT_OPTIMIZATION_LEVEL: -Onone
SWIFT_ACTIVE_COMPILATION_CONDITIONS: DEBUG
GCC_OPTIMIZATION_LEVEL: 0
ENABLE_TESTABILITY: YES
```

#### Release Configuration

```
SWIFT_OPTIMIZATION_LEVEL: -O
SWIFT_COMPILATION_MODE: wholemodule
GCC_OPTIMIZATION_LEVEL: s (Optimize for Size)
ENABLE_TESTABILITY: NO
DEAD_CODE_STRIPPING: YES
```

### Capabilities

If adding future features:

1. **Push Notifications**
   - Signing & Capabilities → + Capability → Push Notifications

2. **iCloud**
   - + Capability → iCloud
   - Check: CloudKit, Key-value storage

3. **App Groups** (for widgets)
   - + Capability → App Groups
   - Add: group.com.yourname.todolist

### Swift Package Dependencies

To add third-party packages:

1. File → Add Packages...

2. **Useful packages for enhancement:**
   ```
   SwiftUI Introspect:
   https://github.com/siteline/SwiftUI-Introspect

   SnapKit (if mixing with UIKit):
   https://github.com/SnapKit/SnapKit

   Combine Extensions:
   https://github.com/CombineCommunity/CombineExt
   ```

## Project Structure Best Practices

### Recommended Groups

```
TodoList/
├── App/
│   ├── TodoListApp.swift
│   └── Info.plist
│
├── Features/
│   └── TodoList/
│       ├── Models/
│       │   └── Todo.swift
│       ├── ViewModels/
│       │   └── TodoViewModel.swift
│       └── Views/
│           ├── ContentView.swift
│           ├── TodoInputView.swift
│           ├── TodoListView.swift
│           └── TodoItemRow.swift
│
├── Shared/
│   ├── Utilities/
│   │   └── UserDefaultsManager.swift
│   ├── Extensions/
│   │   ├── Color+Extensions.swift
│   │   └── View+Extensions.swift
│   └── Components/
│       └── (Reusable components)
│
├── Resources/
│   ├── Assets.xcassets/
│   │   ├── AppIcon.appiconset/
│   │   ├── Colors/
│   │   └── Images/
│   └── Fonts/
│
└── Tests/
    ├── TodoListTests/
    │   ├── ViewModelTests/
    │   └── ModelTests/
    └── TodoListUITests/
```

## Common Issues & Solutions

### Issue: "No such module 'SwiftUI'"

**Solution:**
- Ensure deployment target is iOS 13.0+
- Clean build folder (⇧⌘K)
- Restart Xcode

### Issue: "Could not find or use auto-linked framework"

**Solution:**
- Remove derived data:
  ```bash
  rm -rf ~/Library/Developer/Xcode/DerivedData
  ```
- Clean and rebuild

### Issue: Preview not working

**Solutions:**
1. Ensure macOS 12.0+ and Xcode 13.0+
2. Restart preview: ⌥⌘P
3. Check preview target device matches deployment target
4. Verify all dependencies are provided:
   ```swift
   #Preview {
       ContentView()
           .environmentObject(TodoViewModel())
   }
   ```

### Issue: "Publishing changes from background threads"

**Solution:**
- Update UI on main thread:
  ```swift
  DispatchQueue.main.async {
      self.property = value
  }
  ```

### Issue: Build errors after adding files

**Solutions:**
1. Check file target membership:
   - Select file → File Inspector → Target Membership
   - Ensure "TodoList" is checked

2. Verify imports:
   ```swift
   import SwiftUI
   import Foundation
   ```

## Testing Setup

### Unit Tests

1. **Create Test Target** (if not exists)
   - File → New → Target
   - iOS → Unit Testing Bundle
   - Name: TodoListTests

2. **Add Test File**
   ```swift
   import XCTest
   @testable import TodoList

   class TodoViewModelTests: XCTestCase {
       var sut: TodoViewModel!

       override func setUp() {
           super.setUp()
           sut = TodoViewModel()
       }

       func testAddTodo() {
           sut.addTodo(title: "Test")
           XCTAssertEqual(sut.todos.count, 1)
       }
   }
   ```

3. **Run Tests**
   - ⌘U or Product → Test

### UI Tests

1. **Create UI Test Target**
   - File → New → Target
   - iOS → UI Testing Bundle

2. **Record Test**
   - Open test file
   - Click record button (red circle)
   - Interact with app
   - Stop recording

3. **Run UI Tests**
   - ⌘U or Product → Test

## Building for Device

### Development Build

1. **Connect iPhone/iPad** via USB

2. **Trust Computer** (on device)

3. **Select Device** in Xcode toolbar

4. **Configure Signing**
   - Project → Signing & Capabilities
   - Team: Select your team
   - Automatically manage signing: ✓

5. **Build and Run** (⌘R)

### App Store Build

1. **Archive**
   - Select "Any iOS Device"
   - Product → Archive
   - Wait for build to complete

2. **Distribute**
   - Window → Organizer
   - Select archive
   - Distribute App
   - App Store Connect
   - Upload

3. **Wait for Processing** (~30 minutes)

4. **Submit for Review** in App Store Connect

## Optimization Tips

### Build Time

1. **Whole Module Optimization**
   ```
   SWIFT_COMPILATION_MODE = wholemodule
   SWIFT_OPTIMIZATION_LEVEL = -O
   ```

2. **Parallel Builds**
   - Xcode → Preferences → Locations
   - Derived Data → Advanced
   - Build System: New Build System
   - ✓ Enable parallel builds

3. **Reduce Clean Builds**
   - Only clean when necessary
   - Use ⌘B (build) instead of ⇧⌘K then ⌘B

### App Size

1. **Enable Bitcode** (if targeting older iOS)
   ```
   ENABLE_BITCODE = YES
   ```

2. **Strip Symbols**
   ```
   STRIP_INSTALLED_PRODUCT = YES
   COPY_PHASE_STRIP = YES
   ```

3. **Optimize Assets**
   - Compress images
   - Use vector assets (PDF) when possible
   - Remove unused assets

### Runtime Performance

1. **Profile with Instruments**
   - Product → Profile (⌘I)
   - Choose template:
     - Time Profiler
     - Allocations
     - Leaks

2. **Memory Graph Debugger**
   - Debug → View Memory Graph
   - Find retain cycles

## Version Control

### Git Setup

```bash
# Initialize git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Xcode
*.xcodeproj/*
!*.xcodeproj/project.pbxproj
!*.xcodeproj/xcshareddata/
!*.xcworkspace/contents.xcworkspacedata
/*.gcno
**/xcshareddata/WorkspaceSettings.xcsettings

# Build
build/
DerivedData/

# CocoaPods
Pods/
*.podlock

# Swift Package Manager
.swiftpm/
*.xcworkspace/xcshareddata/swiftpm/

# Other
.DS_Store
*.swp
*~.nib
*.moved-aside
*.xcuserstate
*.xcscmblueprint
EOF

# First commit
git add .
git commit -m "Initial commit"
```

## Next Steps

After setup:

1. ✅ Run app on simulator
2. ✅ Test on physical device
3. ✅ Write unit tests
4. ✅ Configure CI/CD (optional)
5. ✅ Set up crash reporting (optional)
6. ✅ Add analytics (optional)
7. ✅ Submit to App Store

## Resources

- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)

## Support

If you encounter issues:

1. Check Xcode version (13.0+)
2. Check macOS version (12.0+)
3. Clean build folder (⇧⌘K)
4. Restart Xcode
5. Restart Mac
6. Check Apple Developer Forums
7. Stack Overflow

---

**Happy Coding! 🎉**
