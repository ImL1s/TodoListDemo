# Quick Start Guide

Get the iOS SwiftUI Todo List app running in under 10 minutes!

## Prerequisites

- Mac with macOS 12.0+
- Xcode 13.0+ installed
- Basic Swift knowledge (helpful but not required)

## Step 1: Create Xcode Project (2 minutes)

1. Open Xcode
2. File → New → Project (⇧⌘N)
3. Select **iOS** → **App**
4. Configure:
   ```
   Product Name:    TodoList
   Interface:       SwiftUI
   Language:        Swift
   ```
5. Click **Next** → Choose location → **Create**

## Step 2: Add Source Files (3 minutes)

### Option A: Drag and Drop
1. Open Finder to this directory
2. Select all `.swift` files and folders
3. Drag into Xcode's Project Navigator
4. Check ✓ "Copy items if needed"
5. Click **Finish**

### Option B: Manual Copy
```bash
# In Terminal, navigate to your Xcode project directory
cd /path/to/your/TodoList

# Copy all source files
cp /path/to/01-ios-swiftui/*.swift .
cp -r /path/to/01-ios-swiftui/Models .
cp -r /path/to/01-ios-swiftui/ViewModels .
cp -r /path/to/01-ios-swiftui/Views .
cp -r /path/to/01-ios-swiftui/Utilities .

# Add them to Xcode (drag into navigator)
```

## Step 3: Delete Default Files (1 minute)

1. Delete auto-generated `ContentView.swift`
2. Delete auto-generated `TodoListApp.swift`
3. Use our versions instead (already copied)

## Step 4: Configure Project (2 minutes)

1. Select your project in Navigator
2. Go to **General** tab
3. Set:
   ```
   Display Name:        Todo List
   Bundle Identifier:   com.yourname.TodoList
   Version:             1.0.0
   Deployment Target:   iOS 15.0
   ```

## Step 5: Run! (1 minute)

1. Select a simulator (e.g., iPhone 15 Pro)
2. Press ⌘R or click ▶️ **Run**
3. App should launch in simulator

## Troubleshooting

### Build Fails?

**Error: "No such module 'SwiftUI'"**
- Solution: Ensure iOS deployment target is 15.0+

**Error: "Command failed"**
- Solution: Clean build (⇧⌘K) and try again

**Preview Not Working?**
- Solution: Press ⌥⌘P to restart preview

### Still Having Issues?

1. Clean build folder: Product → Clean Build Folder (⇧⌘K)
2. Restart Xcode
3. Check file target membership (File Inspector → Target Membership)

## What's Next?

- Read [README.md](README.md) for detailed documentation
- Check [PROJECT_SETUP.md](PROJECT_SETUP.md) for advanced setup
- Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the code

## Quick Tips

### Add a Todo
- Tap text field
- Type todo title
- Tap + button

### Complete a Todo
- Tap circle checkbox
- Todo moves to completed section

### Delete a Todo
- Swipe left on todo
- Tap red delete button

### Show/Hide Completed
- Tap eye icon in top-left

### Access Settings
- Tap gear icon in top-right

## File Structure Overview

```
TodoList/
├── TodoListApp.swift          ← App entry point
├── ContentView.swift          ← Main view
├── Models/
│   └── Todo.swift            ← Data model
├── ViewModels/
│   └── TodoViewModel.swift   ← Business logic
├── Views/
│   ├── TodoInputView.swift   ← Input field
│   ├── TodoListView.swift    ← List display
│   └── TodoItemRow.swift     ← Todo row
└── Utilities/
    └── UserDefaultsManager.swift  ← Persistence
```

## Common Customizations

### Change Gradient Colors

Edit `ContentView.swift`:
```swift
private var gradientColors: [Color] {
    return [
        Color(red: 0.4, green: 0.6, blue: 1.0),  // ← Change these
        Color(red: 0.6, green: 0.4, blue: 0.9),  // ← Change these
        Color(red: 0.5, green: 0.7, blue: 1.0)   // ← Change these
    ]
}
```

### Add App Icon

1. Create 1024x1024 PNG icon
2. Go to Assets.xcassets
3. Select AppIcon
4. Drag image into 1024x1024 slot
5. Xcode generates other sizes automatically

### Change App Name

1. Select project → General
2. Change "Display Name"
3. Appears on home screen

## Running on Physical Device

1. Connect iPhone/iPad via USB
2. Trust computer on device
3. Select device in Xcode toolbar
4. Xcode → Preferences → Accounts → Add Apple ID
5. Select project → Signing & Capabilities
6. Choose your team
7. Press ⌘R to run

## Test the App

### Manual Testing
- ✅ Add 5 todos
- ✅ Complete 2 todos
- ✅ Delete 1 todo
- ✅ Toggle show/hide completed
- ✅ Close and reopen app (tests persistence)
- ✅ Try dark mode (Settings → Display)

### Unit Testing
```bash
# Run tests
⌘U or Product → Test

# View results
Show Report Navigator (⌘9)
```

## Performance Check

### App should:
- ✅ Launch in < 1 second
- ✅ Smooth animations (60 fps)
- ✅ No lag when adding todos
- ✅ Instant toggle completion
- ✅ Quick swipe-to-delete

### If slow:
1. Check you're in Release mode
2. Profile with Instruments (⌘I)
3. Look for memory leaks

## Deploy to TestFlight (Optional)

1. Archive: Product → Archive
2. Distribute → App Store Connect
3. Upload build
4. Wait ~30 minutes for processing
5. Add testers in App Store Connect
6. They receive TestFlight invitation

## Need Help?

- 📖 Read full [README.md](README.md)
- 🏗️ Check [ARCHITECTURE.md](ARCHITECTURE.md)
- 🔧 See [PROJECT_SETUP.md](PROJECT_SETUP.md)
- 🌐 Visit [Apple Developer Forums](https://developer.apple.com/forums)
- 💬 Ask on [Stack Overflow](https://stackoverflow.com/questions/tagged/swiftui)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘R | Run app |
| ⌘. | Stop app |
| ⌘B | Build |
| ⇧⌘K | Clean build |
| ⌘U | Run tests |
| ⌥⌘P | Refresh preview |
| ⌘I | Profile with Instruments |
| ⌘0 | Hide/show navigator |

## Congratulations!

You now have a fully functional iOS Todo List app!

**Next Steps**:
1. Customize the UI
2. Add new features
3. Submit to App Store
4. Build more apps!

**Happy Coding! 🎉**
