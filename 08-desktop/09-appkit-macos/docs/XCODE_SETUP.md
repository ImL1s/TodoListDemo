# Xcode Project Setup Guide

Complete guide to setting up, configuring, and managing an Xcode project for macOS development.

## Table of Contents

1. [Creating a New Project](#creating-a-new-project)
2. [Project Configuration](#project-configuration)
3. [Code Signing](#code-signing)
4. [App Sandbox](#app-sandbox)
5. [Build Settings](#build-settings)
6. [Debugging](#debugging)
7. [Distribution](#distribution)

## Creating a New Project

### Step-by-Step

1. **Launch Xcode**
   - Open Xcode (14.0 or later)
   - File → New → Project (⌘⇧N)

2. **Choose Template**
   - Select "macOS" tab
   - Choose "App" template
   - Click "Next"

3. **Configure Project**
   ```
   Product Name: TodoListMac
   Team: [Your Development Team]
   Organization Identifier: com.yourcompany
   Bundle Identifier: com.yourcompany.TodoListMac
   Interface: Storyboard
   Language: Swift
   Use Core Data: No (optional)
   Include Tests: Yes
   ```

4. **Choose Location**
   - Select a folder to save your project
   - Create Git repository (recommended)
   - Click "Create"

### Initial Project Structure

```
TodoListMac/
├── TodoListMac.xcodeproj/
│   ├── project.pbxproj
│   └── xcuserdata/
├── TodoListMac/
│   ├── AppDelegate.swift
│   ├── ViewController.swift
│   ├── Assets.xcassets/
│   ├── Main.storyboard
│   ├── TodoListMac.entitlements
│   └── Info.plist
└── TodoListMacTests/
    └── TodoListMacTests.swift
```

## Project Configuration

### General Settings

1. **Open Project Settings**
   - Click on project name in navigator
   - Select target "TodoListMac"
   - Go to "General" tab

2. **Identity**
   ```
   Display Name: Todo List
   Bundle Identifier: com.yourcompany.TodoListMac
   Version: 1.0
   Build: 1
   ```

3. **Deployment Info**
   ```
   Deployment Target: macOS 12.0
   ```

4. **App Category**
   ```
   Category: Productivity
   ```

### Info.plist Configuration

Key configurations in Info.plist:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Bundle Information -->
    <key>CFBundleDisplayName</key>
    <string>Todo List</string>

    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>

    <key>CFBundleVersion</key>
    <string>1.0</string>

    <!-- Minimum System Version -->
    <key>LSMinimumSystemVersion</key>
    <string>12.0</string>

    <!-- Main Storyboard -->
    <key>NSMainStoryboardFile</key>
    <string>Main</string>

    <!-- Principal Class -->
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>

    <!-- Supports Automatic Termination -->
    <key>NSSupportsAutomaticTermination</key>
    <true/>

    <!-- Supports Sudden Termination -->
    <key>NSSupportsSuddenTermination</key>
    <true/>

    <!-- Human Readable Copyright -->
    <key>NSHumanReadableCopyright</key>
    <string>Copyright © 2025 Your Company. All rights reserved.</string>

    <!-- Document Types -->
    <key>CFBundleDocumentTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeName</key>
            <string>JSON File</string>
            <key>LSItemContentTypes</key>
            <array>
                <string>public.json</string>
            </array>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
        </dict>
    </array>
</dict>
</plist>
```

### Build Phases

1. **Compile Sources**
   - All .swift files should be listed here
   - Ensure all source files are included

2. **Link Binary With Libraries**
   - Foundation.framework
   - AppKit.framework
   - Add additional frameworks as needed

3. **Copy Bundle Resources**
   - Assets.xcassets
   - Main.storyboard
   - Any XIB files
   - Other resource files

4. **Run Script (Optional)**
   ```bash
   # SwiftLint example
   if which swiftlint >/dev/null; then
     swiftlint
   else
     echo "warning: SwiftLint not installed"
   fi
   ```

## Code Signing

### Development Signing

1. **Select Team**
   - Go to "Signing & Capabilities" tab
   - Enable "Automatically manage signing"
   - Select your team from dropdown
   - Xcode will create necessary certificates

2. **Manual Signing** (Advanced)
   - Disable "Automatically manage signing"
   - Select provisioning profile manually
   - Choose signing certificate

### Signing Configuration

**Debug Configuration**
```
Code Signing Identity: Apple Development
Code Signing Style: Automatic
Development Team: [Your Team]
Provisioning Profile: Xcode Managed Profile
```

**Release Configuration**
```
Code Signing Identity: Developer ID Application
Code Signing Style: Manual (for distribution)
Development Team: [Your Team]
Provisioning Profile: [Your Distribution Profile]
```

### Creating Certificates

1. **Developer ID Application Certificate**
   - Open Xcode → Preferences → Accounts
   - Select your Apple ID
   - Click "Manage Certificates"
   - Click "+" and select "Developer ID Application"

2. **Keychain Access**
   - Certificates should appear in Keychain Access
   - Verify they're valid and not expired

## App Sandbox

### Enabling App Sandbox

1. **Go to Signing & Capabilities**
2. **Click "+ Capability"**
3. **Add "App Sandbox"**

### Entitlements Configuration

TodoListMac.entitlements:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Enable App Sandbox -->
    <key>com.apple.security.app-sandbox</key>
    <true/>

    <!-- File Access -->
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>

    <key>com.apple.security.files.downloads.read-write</key>
    <true/>

    <!-- Network (if needed) -->
    <key>com.apple.security.network.client</key>
    <false/>

    <key>com.apple.security.network.server</key>
    <false/>

    <!-- Hardware Access -->
    <key>com.apple.security.device.camera</key>
    <false/>

    <key>com.apple.security.device.microphone</key>
    <false/>

    <key>com.apple.security.device.usb</key>
    <false/>

    <!-- Printing -->
    <key>com.apple.security.print</key>
    <false/>

    <!-- Personal Information -->
    <key>com.apple.security.personal-information.addressbook</key>
    <false/>

    <key>com.apple.security.personal-information.calendars</key>
    <false/>

    <key>com.apple.security.personal-information.location</key>
    <false/>

    <key>com.apple.security.personal-information.photos-library</key>
    <false/>
</dict>
</plist>
```

### Common Entitlements

**User-Selected Files**
```xml
<key>com.apple.security.files.user-selected.read-write</key>
<true/>
```

**iCloud**
```xml
<key>com.apple.security.application-groups</key>
<array>
    <string>group.com.yourcompany.TodoListMac</string>
</array>

<key>com.apple.developer.icloud-container-identifiers</key>
<array>
    <string>iCloud.com.yourcompany.TodoListMac</string>
</array>

<key>com.apple.developer.icloud-services</key>
<array>
    <string>CloudKit</string>
    <string>CloudDocuments</string>
</array>
```

**Hardened Runtime** (for distribution)
```xml
<key>com.apple.security.cs.allow-jit</key>
<false/>

<key>com.apple.security.cs.allow-unsigned-executable-memory</key>
<false/>

<key>com.apple.security.cs.allow-dyld-environment-variables</key>
<false/>

<key>com.apple.security.cs.disable-library-validation</key>
<false/>

<key>com.apple.security.cs.disable-executable-page-protection</key>
<false/>
```

## Build Settings

### Key Build Settings

1. **Swift Language Version**
   ```
   SWIFT_VERSION = 5.9
   ```

2. **Optimization Level**
   ```
   Debug: -Onone (no optimization)
   Release: -O (optimize for speed)
   ```

3. **Swift Compilation Mode**
   ```
   Debug: Incremental
   Release: Whole Module
   ```

4. **Deployment Target**
   ```
   MACOSX_DEPLOYMENT_TARGET = 12.0
   ```

5. **Architectures**
   ```
   ARCHS = arm64 x86_64
   ```

6. **Code Signing**
   ```
   CODE_SIGN_IDENTITY = Developer ID Application
   CODE_SIGN_STYLE = Manual
   DEVELOPMENT_TEAM = XXXXXXXXXX
   ```

### Custom Build Settings

Create xcconfig files for different configurations:

**Debug.xcconfig**
```
SWIFT_OPTIMIZATION_LEVEL = -Onone
SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG
GCC_PREPROCESSOR_DEFINITIONS = DEBUG=1
```

**Release.xcconfig**
```
SWIFT_OPTIMIZATION_LEVEL = -O
SWIFT_COMPILATION_MODE = wholemodule
GCC_OPTIMIZATION_LEVEL = s
```

### Schemes

1. **Edit Scheme** (⌘<)
2. **Configure Build Configuration**
   - Run: Debug
   - Test: Debug
   - Profile: Release
   - Analyze: Debug
   - Archive: Release

## Debugging

### Breakpoints

1. **Line Breakpoints**
   - Click on line number gutter
   - Breakpoint appears as blue arrow

2. **Conditional Breakpoints**
   - Right-click breakpoint
   - Edit Breakpoint
   - Add condition (e.g., `count > 10`)

3. **Symbolic Breakpoints**
   - Debug → Breakpoints → Create Symbolic Breakpoint
   - Add symbol (e.g., `objc_exception_throw`)

### Debug Console

**LLDB Commands**
```
po variable              # Print object
p variable               # Print value
frame variable           # Show all variables
bt                       # Backtrace
continue                 # Continue execution
next                     # Step over
step                     # Step into
finish                   # Step out
```

### Instruments

1. **Profile** (⌘I)
2. **Choose Instrument**
   - Time Profiler: CPU usage
   - Allocations: Memory usage
   - Leaks: Memory leaks
   - System Trace: System calls

### View Debugging

1. **Debug View Hierarchy**
   - Debug → View Debugging → Capture View Hierarchy
   - Inspect view properties
   - See 3D view hierarchy

## Distribution

### Archive

1. **Product → Archive**
2. **Wait for archive to complete**
3. **Organizer window opens**

### Export Options

**1. Development**
```
Purpose: Testing on your own Mac
Requires: Development certificate
```

**2. Developer ID**
```
Purpose: Distribution outside Mac App Store
Requires: Developer ID certificate
Process: Notarization required
```

**3. Mac App Store**
```
Purpose: Mac App Store distribution
Requires: Mac App Store certificate
Process: App Store submission
```

### Notarization

For Developer ID distribution:

1. **Archive Your App**
2. **Export as Developer ID**
3. **Submit for Notarization**
   ```bash
   xcrun notarytool submit TodoListMac.zip \
     --apple-id your@email.com \
     --team-id TEAMID \
     --password app-specific-password \
     --wait
   ```

4. **Staple Notarization Ticket**
   ```bash
   xcrun stapler staple TodoListMac.app
   ```

5. **Verify Notarization**
   ```bash
   spctl -a -vvv -t install TodoListMac.app
   ```

### Creating DMG

1. **Use Disk Utility**
   - Open Disk Utility
   - File → New Image → Image from Folder
   - Select your app folder
   - Save as DMG

2. **Or use command line**
   ```bash
   hdiutil create -volname "Todo List" \
     -srcfolder TodoListMac.app \
     -ov -format UDZO \
     TodoListMac.dmg
   ```

### Mac App Store Submission

1. **Archive App**
2. **Validate**
   - Click "Validate App"
   - Fix any issues

3. **Upload**
   - Click "Distribute App"
   - Choose "Mac App Store"
   - Click "Upload"

4. **App Store Connect**
   - Create new app
   - Fill in metadata
   - Upload screenshots
   - Submit for review

## Troubleshooting

### Common Issues

**Code Signing Errors**
```
Solution:
1. Clean build folder (⌘⇧K)
2. Delete derived data
3. Re-download certificates
4. Check expiration dates
```

**Build Errors**
```
Solution:
1. Update Xcode
2. Clean build folder
3. Reset package caches
4. Check Swift version
```

**Sandbox Violations**
```
Solution:
1. Check entitlements
2. Review file access patterns
3. Use security-scoped bookmarks
4. Check Console.app for violations
```

**Notarization Failures**
```
Solution:
1. Check hardened runtime
2. Verify code signing
3. Review notarization log
4. Remove unsigned frameworks
```

### Best Practices

1. **Version Control**
   - Use Git
   - .gitignore for xcuserdata
   - Commit regularly

2. **Build Configuration**
   - Use xcconfig files
   - Separate debug/release settings
   - Document custom settings

3. **Code Organization**
   - Use groups in Xcode
   - Match folder structure
   - Keep files organized

4. **Testing**
   - Write unit tests
   - Use XCTest framework
   - Maintain test coverage

5. **Documentation**
   - Add code comments
   - Document complex logic
   - Keep README updated

---

This guide covers the essential aspects of Xcode project setup and management for macOS development. For more detailed information, consult Apple's Xcode documentation.
