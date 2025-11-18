# iOS SwiftUI Todo List Application

A complete, production-ready Todo List application built with SwiftUI for iOS 15+, demonstrating modern iOS development practices, MVVM architecture, and declarative UI programming.

![SwiftUI](https://img.shields.io/badge/SwiftUI-iOS%2015+-blue)
![Swift](https://img.shields.io/badge/Swift-5.5+-orange)
![Xcode](https://img.shields.io/badge/Xcode-13.0+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📱 Table of Contents

- [Overview](#overview)
- [SwiftUI Introduction](#swiftui-introduction)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Code Walkthrough](#code-walkthrough)
- [SwiftUI Concepts](#swiftui-concepts)
- [MVVM Pattern](#mvvm-pattern)
- [Data Persistence](#data-persistence)
- [UI Components](#ui-components)
- [Animations](#animations)
- [Testing](#testing)
- [Performance](#performance)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [App Store Deployment](#app-store-deployment)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This Todo List application is a comprehensive example of modern iOS development using SwiftUI. It showcases:

- **SwiftUI Framework**: Apple's declarative UI framework
- **MVVM Architecture**: Model-View-ViewModel design pattern
- **Data Persistence**: UserDefaults for local storage
- **Modern iOS Design**: Following Apple's Human Interface Guidelines
- **Reactive Programming**: Using Combine framework
- **Accessibility**: VoiceOver and Dynamic Type support
- **Dark Mode**: Full support for light and dark color schemes

### What Makes This App Special

1. **Production-Ready Code**: Well-structured, documented, and maintainable
2. **SwiftUI Best Practices**: Following Apple's recommended patterns
3. **Beautiful UI**: Gradient backgrounds, smooth animations, SF Symbols
4. **Full Feature Set**: Add, complete, delete, filter, and sort todos
5. **Educational**: Extensively commented for learning purposes

---

## 🚀 SwiftUI Introduction

### What is SwiftUI?

SwiftUI is Apple's modern framework for building user interfaces across all Apple platforms. Introduced in 2019, it represents a paradigm shift from UIKit's imperative approach to a declarative programming model.

#### Key Characteristics

**Declarative Syntax**
```swift
// SwiftUI (Declarative)
Text("Hello, World!")
    .font(.title)
    .foregroundColor(.blue)

// vs UIKit (Imperative)
let label = UILabel()
label.text = "Hello, World!"
label.font = UIFont.preferredFont(forTextStyle: .title1)
label.textColor = .blue
```

**State-Driven UI**
```swift
@State private var count = 0

var body: some View {
    Button("Count: \(count)") {
        count += 1  // UI automatically updates
    }
}
```

**Composition**
```swift
struct ContentView: View {
    var body: some View {
        VStack {
            HeaderView()
            TodoListView()
            FooterView()
        }
    }
}
```

### SwiftUI vs UIKit Comparison

| Feature | SwiftUI | UIKit |
|---------|---------|-------|
| **Paradigm** | Declarative | Imperative |
| **Syntax** | Swift DSL | Object-oriented |
| **State Management** | @State, @Binding | Delegates, KVO |
| **Layout** | HStack, VStack, ZStack | Auto Layout, Constraints |
| **Preview** | Live previews in Xcode | Simulator/Device only |
| **Learning Curve** | Moderate | Steep |
| **Code Volume** | Less code | More boilerplate |
| **Platform Support** | iOS 13+ | iOS 2+ |
| **Maturity** | Evolving (since 2019) | Mature (since 2008) |
| **Animation** | Built-in, simple | More manual setup |
| **Data Flow** | Unidirectional | Complex delegates |

### Why Choose SwiftUI?

**Advantages:**
- ✅ Less code, faster development
- ✅ Live previews for rapid iteration
- ✅ Cross-platform (iOS, macOS, watchOS, tvOS)
- ✅ Built-in accessibility
- ✅ Modern, clean syntax
- ✅ Reactive by design
- ✅ Future of iOS development

**Considerations:**
- ⚠️ Limited to iOS 13+
- ⚠️ Some advanced features require newer iOS versions
- ⚠️ Smaller community compared to UIKit
- ⚠️ Still evolving, breaking changes possible

### When to Use SwiftUI

**Use SwiftUI for:**
- New projects targeting iOS 15+
- Prototypes and MVPs
- Apps with simple to moderate complexity
- Multi-platform apps
- Teams comfortable with modern Swift

**Consider UIKit for:**
- Apps supporting iOS 12 or earlier
- Complex custom UI components
- Apps requiring specific UIKit features
- Large existing UIKit codebases

---

## ✨ Features

### Core Functionality

- ✅ **Add Todos**: Create new todo items with title and priority
- ✅ **Complete Todos**: Toggle completion status with animated checkbox
- ✅ **Delete Todos**: Swipe-to-delete gesture with visual feedback
- ✅ **Priority Levels**: Low, Medium, High, and Urgent priorities
- ✅ **Due Dates**: Optional due dates with overdue indicators
- ✅ **Tags**: Categorize todos with custom tags
- ✅ **Notes**: Additional details for each todo

### UI/UX Features

- 🎨 **Beautiful Gradient Background**: Dynamic colors based on theme
- 🌓 **Dark Mode Support**: Automatic adaptation to system theme
- ✨ **Smooth Animations**: Spring animations for all interactions
- 📱 **Haptic Feedback**: Touch feedback for user actions
- 🎯 **SF Symbols**: Native iOS icons throughout
- 📊 **Statistics Dashboard**: Real-time todo counts and progress
- 👁️ **Show/Hide Completed**: Toggle visibility of completed todos
- ⚙️ **Settings Panel**: App configuration and information

### Technical Features

- 💾 **Data Persistence**: Automatic saving to UserDefaults
- 🔄 **MVVM Architecture**: Clean separation of concerns
- 🧪 **Preview Support**: SwiftUI previews for all components
- ♿ **Accessibility**: VoiceOver and Dynamic Type support
- 📱 **iPad Support**: Responsive design for all screen sizes
- 🎭 **State Management**: Reactive state with Combine
- 🔍 **Search and Filter**: Find todos quickly (extensible)
- 📈 **Sorting Options**: Multiple sort criteria (extensible)

---

## 📸 Screenshots

### Light Mode
```
┌─────────────────────────────┐
│   📋 Todo List    [SwiftUI] │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🚀 Add a new todo...    │ │
│ └─────────────────────────┘ │
│                             │
│ Active                    3 │
│ ○ Learn SwiftUI  [High]    │
│ ○ Build iOS App  [Medium]  │
│ ○ Master MVVM    [Low]     │
│                             │
│ Completed                 2 │
│ ● Finish tutorial [Done]   │
│ ● Setup Xcode    [Done]    │
│                             │
│ ─────────────────────────── │
│ Total: 5  Active: 3  Done:2│
└─────────────────────────────┘
```

### Dark Mode
```
┌─────────────────────────────┐
│   📋 Todo List    [SwiftUI] │
│   (Dark gradient background)│
│                             │
│ Higher contrast UI elements │
│ Adapted SF Symbols          │
│ Dimmed completed items      │
└─────────────────────────────┘
```

---

## 🏗️ Architecture

This application follows the **MVVM (Model-View-ViewModel)** architectural pattern, which is the recommended approach for SwiftUI applications.

### MVVM Overview

```
┌─────────────────────────────────────────┐
│                  View                   │
│  (SwiftUI Views - ContentView, etc.)    │
│                                         │
│  - Displays UI                          │
│  - Captures user input                  │
│  - Observes ViewModel                   │
└────────────┬────────────────────────────┘
             │ @ObservedObject
             │ @StateObject
             ▼
┌─────────────────────────────────────────┐
│              ViewModel                  │
│         (TodoViewModel)                 │
│                                         │
│  - Business logic                       │
│  - Presentation logic                   │
│  - Published properties                 │
│  - Commands (add, delete, etc.)         │
└────────────┬────────────────────────────┘
             │
             │ Reads/Writes
             ▼
┌─────────────────────────────────────────┐
│               Model                     │
│         (Todo struct)                   │
│                                         │
│  - Data structures                      │
│  - Business entities                    │
│  - Codable for persistence              │
└────────────┬────────────────────────────┘
             │
             │ Persists via
             ▼
┌─────────────────────────────────────────┐
│          UserDefaultsManager            │
│                                         │
│  - Data persistence                     │
│  - CRUD operations                      │
└─────────────────────────────────────────┘
```

### Component Responsibilities

#### Model (`Todo.swift`)
- Defines data structure for todo items
- Conforms to `Codable` for JSON serialization
- Conforms to `Identifiable` for SwiftUI lists
- Contains computed properties and methods
- Pure data, no business logic

#### ViewModel (`TodoViewModel.swift`)
- Manages array of todos
- Implements business logic (add, delete, toggle)
- Provides computed properties for the view
- Handles data persistence
- Conforms to `ObservableObject`
- Uses `@Published` for reactive updates

#### View (`ContentView.swift`, `TodoListView.swift`, etc.)
- Purely presentational
- Observes ViewModel changes
- Captures user interactions
- No business logic
- Declarative UI definitions

#### Utilities (`UserDefaultsManager.swift`)
- Handles data persistence
- Encodes/decodes todos
- Provides backup/restore functionality
- Singleton pattern for global access

### Data Flow

1. **User Interaction** → View captures event
2. **View** → Calls ViewModel method
3. **ViewModel** → Updates model/state
4. **Model** → Persisted via UserDefaultsManager
5. **ViewModel** → Publishes changes (@Published)
6. **View** → Automatically re-renders

### Benefits of MVVM in SwiftUI

1. **Separation of Concerns**: Each layer has a clear responsibility
2. **Testability**: ViewModel can be tested independently
3. **Reusability**: ViewModels can be shared across views
4. **Maintainability**: Changes are localized to appropriate layers
5. **SwiftUI Integration**: Works naturally with @ObservedObject

---

## 📁 Project Structure

```
01-ios-swiftui/
│
├── TodoListApp.swift                 # App entry point (@main)
├── ContentView.swift                 # Main view container
│
├── Models/
│   └── Todo.swift                    # Todo data model
│
├── ViewModels/
│   └── TodoViewModel.swift           # Business logic & state
│
├── Views/
│   ├── TodoInputView.swift           # Input field component
│   ├── TodoListView.swift            # List display component
│   └── TodoItemRow.swift             # Individual todo row
│
├── Utilities/
│   └── UserDefaultsManager.swift     # Persistence layer
│
├── Assets.xcassets/                  # Images and colors
│   ├── AppIcon.appiconset/
│   └── Colors/
│
├── Info.plist                        # App configuration
├── TodoList.xcodeproj/               # Xcode project file
└── README.md                         # This file
```

### File Descriptions

#### Core Files

**TodoListApp.swift**
- Entry point of the application
- Creates and injects TodoViewModel
- Handles app lifecycle
- Configures app-wide settings

**ContentView.swift**
- Main view of the app
- Combines all child views
- Manages navigation and layout
- Handles settings sheet

#### Models

**Todo.swift**
- Defines Todo struct
- Priority enum
- Computed properties (isOverdue, etc.)
- Array extensions for filtering/sorting
- Sample data for previews

#### ViewModels

**TodoViewModel.swift**
- ObservableObject for state management
- Published properties for reactive UI
- CRUD methods for todos
- Integration with UserDefaultsManager
- Haptic feedback generation

#### Views

**TodoInputView.swift**
- Text field for new todos
- Priority selector
- Submit button
- Character counter
- Input validation

**TodoListView.swift**
- Displays list of todos
- Section headers
- Empty state view
- Organizes todos by status

**TodoItemRow.swift**
- Individual todo display
- Checkbox for completion
- Priority indicator
- Swipe-to-delete gesture
- Metadata display (due date, tags)

#### Utilities

**UserDefaultsManager.swift**
- Singleton for persistence
- Save/load todos
- Import/export functionality
- Migration support
- Storage statistics

---

## 🔧 Installation

### Prerequisites

- **macOS**: 12.0 (Monterey) or later
- **Xcode**: 13.0 or later
- **Swift**: 5.5 or later
- **iOS**: 15.0+ (deployment target)
- **Apple Developer Account**: For device testing (optional)

### Method 1: Xcode Project Setup (Recommended)

1. **Create New Xcode Project**
   ```bash
   # Open Xcode
   # File → New → Project
   # Choose "iOS" → "App"
   # Product Name: TodoList
   # Interface: SwiftUI
   # Language: Swift
   # Minimum Deployment: iOS 15.0
   ```

2. **Copy Source Files**
   ```bash
   # Copy all .swift files to your Xcode project
   cp TodoListApp.swift /path/to/YourProject/
   cp ContentView.swift /path/to/YourProject/
   cp -r Models /path/to/YourProject/
   cp -r ViewModels /path/to/YourProject/
   cp -r Views /path/to/YourProject/
   cp -r Utilities /path/to/YourProject/
   ```

3. **Add Files to Xcode**
   - Drag and drop folders into Xcode navigator
   - Check "Copy items if needed"
   - Ensure files are added to target

4. **Configure Project Settings**
   - Set minimum deployment target to iOS 15.0
   - Configure app icon (optional)
   - Update bundle identifier

5. **Build and Run**
   ```
   ⌘R or click the "Run" button
   ```

### Method 2: Swift Package Manager

For modular components (advanced):

```swift
// Package.swift
// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "TodoList",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "TodoList",
            targets: ["TodoList"]),
    ],
    targets: [
        .target(
            name: "TodoList",
            dependencies: []),
    ]
)
```

### Method 3: Manual Setup

1. **Create Directory Structure**
   ```bash
   mkdir -p TodoList/{Models,ViewModels,Views,Utilities}
   ```

2. **Copy Files**
   ```bash
   cp *.swift TodoList/
   cp Models/*.swift TodoList/Models/
   # ... etc
   ```

3. **Open in Xcode**
   ```bash
   open TodoList.xcodeproj
   ```

### Troubleshooting Installation

**Issue: "Could not find Swift in path"**
- Solution: Install Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```

**Issue: "Minimum deployment target not met"**
- Solution: Update minimum deployment in Xcode
  - Project Settings → Deployment Info → iOS 15.0

**Issue: "Module not found"**
- Solution: Ensure all files are added to the correct target
  - File Inspector → Target Membership → Check TodoList

---

## 📖 Usage Guide

### Basic Operations

#### Adding a Todo

1. Tap the text field at the top
2. Type your todo title
3. (Optional) Tap the priority icon to select priority
4. Press the + button or keyboard "Done"

**Example:**
```
Input: "Buy groceries"
Priority: Medium (default)
Result: New todo added to "Active" section
```

#### Completing a Todo

1. Tap the circle checkbox next to a todo
2. Todo moves to "Completed" section
3. Text appears with strikethrough
4. Haptic feedback confirms action

#### Deleting a Todo

**Method 1: Swipe Gesture**
1. Swipe left on a todo item
2. Red "Delete" button appears
3. Tap to confirm deletion

**Method 2: Full Swipe**
1. Swipe left completely
2. Todo auto-deletes

#### Viewing Completed Todos

1. Tap the eye icon in the top-left
2. Toggles between showing/hiding completed todos
3. Icon changes to reflect current state:
   - Eye (open): Showing completed
   - Eye (slashed): Hiding completed

#### Accessing Settings

1. Tap gear icon in top-right
2. Settings sheet appears
3. Options:
   - Toggle completed visibility
   - Clear all todos
   - View app information

### Advanced Features

#### Priority Management

**Setting Priority:**
1. When adding todo, tap flag button
2. Select from: Low, Medium, High, Urgent
3. Each has distinct color and icon:
   - Low: Blue arrow down
   - Medium: Green minus
   - High: Orange arrow up
   - Urgent: Red exclamation

**Priority Indicators:**
- Color-coded badges on each todo
- Affects visual hierarchy
- Can be used for sorting (future enhancement)

#### Understanding the UI

**Header Section:**
```
┌─────────────────────────────┐
│ 📋 Todo List                │
│    [SwiftUI badge]          │
└─────────────────────────────┘
```
- App title with icon
- Technology badge
- Always visible

**Input Section:**
```
┌─────────────────────────────┐
│ [🚀] Add a new todo... [+]  │
│ 0/200           Priority ▼  │
└─────────────────────────────┘
```
- Priority button (left)
- Text field (center)
- Submit button (right)
- Character counter (when focused)
- Priority picker (when opened)

**List Section:**
```
Active                      3
○ Todo item 1     [High] 📅
○ Todo item 2     [Medium]
○ Todo item 3     [Low] 🏷️

Completed                   2
● Completed item  [Done]
```
- Section headers with counts
- Active todos first
- Completed todos below (if visible)
- Metadata badges (priority, date, tags)

**Footer Section:**
```
─────────────────────────────
Total: 5  Active: 3  Done: 2
```
- Overall statistics
- Real-time updates
- Visual summary

### Keyboard Shortcuts (iOS with External Keyboard)

- **⌘N**: Focus input field (custom, requires implementation)
- **⌘W**: Close settings (system)
- **ESC**: Dismiss keyboard (system)
- **Return**: Submit todo (in text field)

### Gestures

- **Tap**: Toggle completion, focus field, open settings
- **Long Press**: (Future: Edit mode, reorder)
- **Swipe Left**: Delete todo
- **Pull to Refresh**: (Future: Sync with cloud)

---

## 💻 Code Walkthrough

### Understanding Key Concepts

#### 1. App Entry Point

```swift
@main
struct TodoListApp: App {
    @StateObject private var todoViewModel = TodoViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(todoViewModel)
        }
    }
}
```

**Explanation:**
- `@main`: Marks the app's entry point
- `App` protocol: Defines app structure
- `@StateObject`: Creates and owns the view model
- `.environmentObject()`: Injects view model into view hierarchy
- `WindowGroup`: Manages app's window (supports multiple windows on iPad)

#### 2. State Management

```swift
class TodoViewModel: ObservableObject {
    @Published var todos: [Todo] = []

    func addTodo(title: String) {
        let newTodo = Todo(title: title)
        todos.append(newTodo)  // Triggers UI update
    }
}
```

**Explanation:**
- `ObservableObject`: Makes class observable
- `@Published`: Publishes changes to observers
- Auto-saves when `todos` changes (via `didSet`)

**In Views:**
```swift
struct ContentView: View {
    @EnvironmentObject var todoViewModel: TodoViewModel

    var body: some View {
        // View automatically updates when todos changes
        Text("Total: \(todoViewModel.todos.count)")
    }
}
```

#### 3. Data Model

```swift
struct Todo: Identifiable, Codable {
    let id: UUID
    var title: String
    var isCompleted: Bool

    enum Priority: String, Codable {
        case low, medium, high, urgent
    }
}
```

**Explanation:**
- `Identifiable`: Required for ForEach in SwiftUI
- `Codable`: Enables JSON encoding/decoding
- `UUID`: Unique identifier for each todo
- `enum`: Type-safe priority levels

#### 4. SwiftUI Views

**Composition:**
```swift
struct ContentView: View {
    var body: some View {
        VStack {              // Vertical stack
            HeaderView()
            TodoInputView()
            TodoListView()
            FooterView()
        }
    }
}
```

**Layout:**
```swift
HStack(spacing: 12) {       // Horizontal stack
    Image(systemName: "circle")
    Text("Todo item")
    Spacer()                // Pushes content apart
    Button("Delete") { }
}
.padding()                  // Adds padding
.background(Color.white)    // Background color
.cornerRadius(12)           // Rounded corners
```

#### 5. Property Wrappers

**@State**: Local view state
```swift
@State private var inputText = ""

TextField("Enter text", text: $inputText)  // $ creates binding
```

**@Binding**: Two-way connection
```swift
struct ChildView: View {
    @Binding var isEnabled: Bool

    Toggle("Enable", isOn: $isEnabled)  // Updates parent
}
```

**@StateObject**: View owns object
```swift
@StateObject var viewModel = TodoViewModel()  // Created once
```

**@ObservedObject**: View observes object
```swift
@ObservedObject var viewModel: TodoViewModel  // Passed from parent
```

**@EnvironmentObject**: Shared across views
```swift
@EnvironmentObject var viewModel: TodoViewModel  // From environment
```

#### 6. Animations

**Implicit Animations:**
```swift
Text("Hello")
    .scaleEffect(isActive ? 1.2 : 1.0)
    .animation(.spring(), value: isActive)  // Animates scale changes
```

**Explicit Animations:**
```swift
Button("Toggle") {
    withAnimation(.spring(response: 0.3)) {
        isActive.toggle()
    }
}
```

**Custom Spring:**
```swift
.animation(
    .spring(
        response: 0.3,        // Duration
        dampingFraction: 0.7   // Bounciness
    ),
    value: someValue
)
```

#### 7. Lists and ForEach

```swift
List {
    ForEach(todos) { todo in
        TodoItemRow(todo: todo)
    }
    .onDelete { indexSet in
        todos.remove(atOffsets: indexSet)
    }
}
```

**With Sections:**
```swift
List {
    Section(header: Text("Active")) {
        ForEach(activeTodos) { todo in
            TodoItemRow(todo: todo)
        }
    }

    Section(header: Text("Completed")) {
        ForEach(completedTodos) { todo in
            TodoItemRow(todo: todo)
        }
    }
}
```

#### 8. Gestures

```swift
Text("Swipe me")
    .gesture(
        DragGesture()
            .onChanged { value in
                // Handle drag
            }
            .onEnded { value in
                // Handle release
            }
    )
```

#### 9. Custom Modifiers

```swift
struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.white)
            .cornerRadius(12)
            .shadow(radius: 5)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardModifier())
    }
}

// Usage:
Text("Hello").cardStyle()
```

#### 10. Persistence

```swift
// Save
func saveTodos() {
    let encoder = JSONEncoder()
    if let data = try? encoder.encode(todos) {
        UserDefaults.standard.set(data, forKey: "todos")
    }
}

// Load
func loadTodos() {
    let decoder = JSONDecoder()
    if let data = UserDefaults.standard.data(forKey: "todos"),
       let todos = try? decoder.decode([Todo].self, from: data) {
        self.todos = todos
    }
}
```

---

## 🎓 SwiftUI Concepts

### Declarative vs Imperative

**Imperative (UIKit):**
```swift
// Tell the system HOW to do it
let label = UILabel()
label.text = "Hello"
label.textColor = .blue
view.addSubview(label)

// Later, update manually
label.text = "World"
```

**Declarative (SwiftUI):**
```swift
// Tell the system WHAT you want
@State var message = "Hello"

var body: some View {
    Text(message)
        .foregroundColor(.blue)
}

// Update automatically
message = "World"  // UI updates itself
```

### State and Data Flow

#### Single Source of Truth

```swift
// ❌ Don't duplicate state
struct BadView: View {
    @State var count1 = 0
    @State var count2 = 0  // Same as count1!
}

// ✅ Single source
struct GoodView: View {
    @State var count = 0

    var doubleCount: Int {
        count * 2  // Derived, not duplicated
    }
}
```

#### Unidirectional Data Flow

```
User Action → State Change → UI Update
     ↑                            ↓
     └────────────────────────────┘
```

```swift
struct CounterView: View {
    @State private var count = 0  // Source of truth

    var body: some View {
        VStack {
            Text("\(count)")       // Reads state
            Button("+1") {
                count += 1         // Updates state
            }                      // UI auto-updates
        }
    }
}
```

### View Lifecycle

SwiftUI views have a different lifecycle than UIKit:

```swift
struct MyView: View {
    var body: some View {
        Text("Hello")
            .onAppear {
                // Called when view appears
                print("View appeared")
            }
            .onDisappear {
                // Called when view disappears
                print("View disappeared")
            }
            .task {
                // Async work when view appears
                await fetchData()
            }
    }
}
```

**Important**: SwiftUI views are ephemeral (temporary). The `body` can be called many times. Don't put side effects directly in `body`.

### View Identity

SwiftUI tracks views by their identity:

**Structural Identity:**
```swift
if condition {
    Text("A")  // Different view based on condition
} else {
    Text("B")
}
```

**Explicit Identity:**
```swift
Text("Hello")
    .id(uniqueID)  // Explicit identity
```

**ForEach Identity:**
```swift
ForEach(items) { item in  // Identifiable
    Text(item.name)
}

ForEach(items, id: \.self) { item in  // Hashable
    Text(item)
}
```

### Performance Considerations

**View Updates:**
- SwiftUI only re-renders changed views
- Use `@Published` wisely
- Avoid massive view structs
- Break into smaller components

**Example:**
```swift
// ❌ Entire view rerenders when count changes
struct SlowView: View {
    @State var count = 0

    var body: some View {
        VStack {
            ExpensiveView()     // Rerenders unnecessarily
            Text("\(count)")
            Button("+") { count += 1 }
        }
    }
}

// ✅ Only counter rerenders
struct FastView: View {
    var body: some View {
        VStack {
            ExpensiveView()     // Doesn't rerender
            CounterView()       // Only this rerenders
        }
    }
}
```

---

## 🏛️ MVVM Pattern

### Deep Dive

#### Why MVVM for SwiftUI?

1. **Separation of Concerns**: UI and logic are separate
2. **Testability**: ViewModels can be unit tested
3. **Reusability**: ViewModels can be shared
4. **SwiftUI Integration**: Works naturally with ObservableObject
5. **Scalability**: Easier to maintain as app grows

#### Model Layer

**Responsibilities:**
- Define data structures
- Business entities
- Data validation
- Computed properties

**Example:**
```swift
struct Todo: Identifiable, Codable {
    let id: UUID
    var title: String
    var isCompleted: Bool
    let createdAt: Date

    // Computed property
    var isOverdue: Bool {
        guard let dueDate = dueDate else { return false }
        return dueDate < Date() && !isCompleted
    }

    // Business logic
    mutating func toggleCompletion() {
        isCompleted.toggle()
    }
}
```

#### ViewModel Layer

**Responsibilities:**
- Manage model data
- Handle user actions
- Provide data for views
- Business logic
- Persistence

**Example:**
```swift
class TodoViewModel: ObservableObject {
    @Published var todos: [Todo] = []

    // Computed properties for view
    var activeTodosCount: Int {
        todos.filter { !$0.isCompleted }.count
    }

    // Commands
    func addTodo(title: String) {
        let todo = Todo(title: title)
        todos.append(todo)
        saveTodos()
    }

    func toggleTodo(id: UUID) {
        if let index = todos.firstIndex(where: { $0.id == id }) {
            todos[index].toggleCompletion()
            saveTodos()
        }
    }

    // Persistence
    private func saveTodos() {
        UserDefaultsManager.shared.saveTodos(todos)
    }
}
```

#### View Layer

**Responsibilities:**
- Display UI
- Capture user input
- Observe ViewModel
- Layout and styling

**Example:**
```swift
struct ContentView: View {
    @StateObject var viewModel = TodoViewModel()

    var body: some View {
        VStack {
            // Display data from ViewModel
            Text("Active: \(viewModel.activeTodosCount)")

            // List data from ViewModel
            ForEach(viewModel.todos) { todo in
                TodoRow(todo: todo)
            }

            // Send commands to ViewModel
            Button("Add Todo") {
                viewModel.addTodo(title: "New Todo")
            }
        }
    }
}
```

### Best Practices

**✅ Do:**
- Keep views simple and declarative
- Put all business logic in ViewModel
- Use @Published for observable properties
- Make ViewModels testable (no UI dependencies)
- Use dependency injection

**❌ Don't:**
- Put business logic in views
- Make views access UserDefaults directly
- Create tight coupling between View and ViewModel
- Use ViewModels for simple, static views

### Testing MVVM

```swift
import XCTest

class TodoViewModelTests: XCTestCase {
    var viewModel: TodoViewModel!

    override func setUp() {
        super.setUp()
        viewModel = TodoViewModel()
    }

    func testAddTodo() {
        // Given
        let initialCount = viewModel.todos.count

        // When
        viewModel.addTodo(title: "Test Todo")

        // Then
        XCTAssertEqual(viewModel.todos.count, initialCount + 1)
        XCTAssertEqual(viewModel.todos.last?.title, "Test Todo")
    }

    func testToggleTodo() {
        // Given
        viewModel.addTodo(title: "Test")
        let todoId = viewModel.todos.first!.id
        let initialState = viewModel.todos.first!.isCompleted

        // When
        viewModel.toggleTodo(id: todoId)

        // Then
        XCTAssertEqual(
            viewModel.todos.first!.isCompleted,
            !initialState
        )
    }
}
```

---

## 💾 Data Persistence

### UserDefaults Overview

**What is UserDefaults?**
- Key-value storage system
- Automatically persisted to disk
- Suitable for small amounts of data
- Simple API
- Synchronizes automatically

**When to Use:**
- ✅ User preferences
- ✅ App settings
- ✅ Small data sets (<1MB)
- ✅ Simple data structures

**When NOT to Use:**
- ❌ Large datasets
- ❌ Complex relationships
- ❌ Sensitive data (use Keychain)
- ❌ Files/images

### Implementation

**Save Data:**
```swift
func saveTodos(_ todos: [Todo]) {
    let encoder = JSONEncoder()
    encoder.dateEncodingStrategy = .iso8601

    do {
        let data = try encoder.encode(todos)
        UserDefaults.standard.set(data, forKey: "todos")
        UserDefaults.standard.synchronize()  // Force save
    } catch {
        print("Error saving: \(error)")
    }
}
```

**Load Data:**
```swift
func loadTodos() -> [Todo] {
    guard let data = UserDefaults.standard.data(forKey: "todos") else {
        return []
    }

    let decoder = JSONDecoder()
    decoder.dateDecodingStrategy = .iso8601

    do {
        return try decoder.decode([Todo].self, from: data)
    } catch {
        print("Error loading: \(error)")
        return []
    }
}
```

**Delete Data:**
```swift
func clearTodos() {
    UserDefaults.standard.removeObject(forKey: "todos")
}
```

### Alternative Storage Options

#### 1. CoreData

**Best for:**
- Large datasets
- Complex object graphs
- Relationships between entities
- Advanced querying

**Example:**
```swift
// Define entity
@objc(TodoEntity)
class TodoEntity: NSManagedObject {
    @NSManaged var id: UUID
    @NSManaged var title: String
    @NSManaged var isCompleted: Bool
}

// Save
let context = persistentContainer.viewContext
let todo = TodoEntity(context: context)
todo.title = "New Todo"
try? context.save()

// Fetch
let request: NSFetchRequest<TodoEntity> = TodoEntity.fetchRequest()
let todos = try? context.fetch(request)
```

#### 2. SwiftData (iOS 17+)

**Modern replacement for CoreData:**
```swift
@Model
class Todo {
    var id: UUID
    var title: String
    var isCompleted: Bool

    init(title: String) {
        self.id = UUID()
        self.title = title
        self.isCompleted = false
    }
}

// Usage in View
@Query var todos: [Todo]
```

#### 3. File System

**For documents/files:**
```swift
func saveTodos(_ todos: [Todo]) throws {
    let encoder = JSONEncoder()
    let data = try encoder.encode(todos)

    let url = FileManager.default
        .urls(for: .documentDirectory, in: .userDomainMask)[0]
        .appendingPathComponent("todos.json")

    try data.write(to: url)
}
```

#### 4. Keychain

**For sensitive data:**
```swift
// Use Security framework
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrAccount as String: "userToken",
    kSecValueData as String: tokenData
]
SecItemAdd(query as CFDictionary, nil)
```

#### 5. Cloud Storage (iCloud)

**For sync across devices:**
```swift
// NSUbiquitousKeyValueStore
let store = NSUbiquitousKeyValueStore.default
store.set(data, forKey: "todos")
store.synchronize()
```

### Migration Strategy

```swift
class UserDefaultsManager {
    func migrateIfNeeded() {
        let migrationKey = "migration_v2_completed"

        guard !defaults.bool(forKey: migrationKey) else {
            return
        }

        // Perform migration
        if let oldData = defaults.data(forKey: "old_todos_key") {
            // Convert old format to new format
            migrateTodos(from: oldData)
            defaults.removeObject(forKey: "old_todos_key")
        }

        defaults.set(true, forKey: migrationKey)
    }
}
```

---

## 🎨 UI Components

### Layout Containers

#### VStack (Vertical Stack)
```swift
VStack(alignment: .leading, spacing: 12) {
    Text("Title")
    Text("Subtitle")
    Text("Description")
}
```

#### HStack (Horizontal Stack)
```swift
HStack(alignment: .center, spacing: 8) {
    Image(systemName: "star")
    Text("Favorite")
    Spacer()
    Button("Action") { }
}
```

#### ZStack (Depth Stack)
```swift
ZStack(alignment: .topLeading) {
    Color.blue              // Background
    VStack {                // Foreground
        Text("Content")
    }
}
```

### Common Components

#### Text
```swift
Text("Hello, World!")
    .font(.title)
    .fontWeight(.bold)
    .foregroundColor(.blue)
    .multilineTextAlignment(.center)
    .lineLimit(2)
```

#### TextField
```swift
@State var text = ""

TextField("Placeholder", text: $text)
    .textFieldStyle(.roundedBorder)
    .submitLabel(.done)
    .onSubmit {
        print("Submitted: \(text)")
    }
```

#### Button
```swift
Button("Tap Me") {
    print("Tapped")
}
.buttonStyle(.borderedProminent)
.tint(.blue)

// Custom style
Button(action: { }) {
    HStack {
        Image(systemName: "plus")
        Text("Add")
    }
    .padding()
    .background(Color.blue)
    .foregroundColor(.white)
    .cornerRadius(12)
}
```

#### Toggle
```swift
@State var isOn = false

Toggle("Enable Feature", isOn: $isOn)
    .toggleStyle(.switch)
```

#### List
```swift
List {
    ForEach(items) { item in
        Text(item.name)
    }
    .onDelete { indexSet in
        items.remove(atOffsets: indexSet)
    }
}
.listStyle(.insetGrouped)
```

### SF Symbols

**Using System Icons:**
```swift
Image(systemName: "star.fill")
    .font(.system(size: 24))
    .foregroundColor(.yellow)
```

**Common Icons:**
- `checkmark.circle.fill`: Completion
- `plus.circle.fill`: Add
- `trash.fill`: Delete
- `gearshape.fill`: Settings
- `eye.fill` / `eye.slash.fill`: Show/hide
- `arrow.up/down`: Sort
- `calendar`: Date
- `tag.fill`: Tags
- `exclamationmark.triangle`: Warning

**Browse All:**
- Download "SF Symbols" app from Apple
- 4000+ icons available
- Automatically adapt to text size
- Support for color and multicolor variants

### Gradients

**Linear Gradient:**
```swift
LinearGradient(
    gradient: Gradient(colors: [.blue, .purple]),
    startPoint: .topLeading,
    endPoint: .bottomTrailing
)
```

**Radial Gradient:**
```swift
RadialGradient(
    gradient: Gradient(colors: [.white, .blue]),
    center: .center,
    startRadius: 0,
    endRadius: 200
)
```

**Angular Gradient:**
```swift
AngularGradient(
    gradient: Gradient(colors: [.red, .yellow, .green, .blue, .purple, .red]),
    center: .center
)
```

### Modifiers

**Common Modifiers:**
```swift
View()
    .frame(width: 200, height: 100)
    .padding()
    .padding(.horizontal, 20)
    .background(Color.white)
    .foregroundColor(.black)
    .cornerRadius(12)
    .shadow(radius: 5)
    .opacity(0.8)
    .scaleEffect(1.2)
    .rotationEffect(.degrees(45))
    .blur(radius: 2)
```

**Order Matters:**
```swift
// Different results!
Text("Hello")
    .padding()      // 1. Add padding
    .background(.blue)  // 2. Blue behind padding

Text("Hello")
    .background(.blue)  // 1. Blue behind text only
    .padding()      // 2. Transparent padding
```

---

## ✨ Animations

### Types of Animations

#### 1. Implicit Animations
```swift
@State var scale: CGFloat = 1.0

Circle()
    .scaleEffect(scale)
    .animation(.spring(), value: scale)  // Animates scale changes

Button("Toggle") {
    scale = scale == 1.0 ? 1.5 : 1.0
}
```

#### 2. Explicit Animations
```swift
Button("Animate") {
    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
        scale = 1.5
        rotation = 45
        opacity = 0.5
    }
}
```

#### 3. Transitions
```swift
if isVisible {
    Text("Hello")
        .transition(.scale.combined(with: .opacity))
}

Button("Toggle") {
    withAnimation {
        isVisible.toggle()
    }
}
```

### Animation Curves

**Linear:**
```swift
.animation(.linear(duration: 0.3), value: someValue)
```

**Ease In/Out:**
```swift
.animation(.easeIn(duration: 0.3), value: someValue)
.animation(.easeOut(duration: 0.3), value: someValue)
.animation(.easeInOut(duration: 0.3), value: someValue)
```

**Spring (Most Common):**
```swift
.animation(
    .spring(
        response: 0.3,        // Duration
        dampingFraction: 0.7,  // Bounciness (0-1)
        blendDuration: 0      // Blend with other animations
    ),
    value: someValue
)
```

**Custom:**
```swift
.animation(
    .timingCurve(0.2, 0.8, 0.2, 1.0, duration: 0.3),
    value: someValue
)
```

### Advanced Animations

**Delayed Animation:**
```swift
withAnimation(.spring().delay(0.5)) {
    isVisible = true
}
```

**Repeated Animation:**
```swift
.animation(
    .linear(duration: 1.0)
    .repeatForever(autoreverses: true),
    value: someValue
)
```

**Matched Geometry Effect:**
```swift
@Namespace var namespace

if isExpanded {
    Rectangle()
        .matchedGeometryEffect(id: "shape", in: namespace)
        .frame(width: 200, height: 200)
} else {
    Rectangle()
        .matchedGeometryEffect(id: "shape", in: namespace)
        .frame(width: 100, height: 100)
}
```

### Haptic Feedback

**Impact Feedback:**
```swift
let generator = UIImpactFeedbackGenerator(style: .medium)
generator.impactOccurred()

// Styles: .light, .medium, .heavy, .soft, .rigid
```

**Notification Feedback:**
```swift
let generator = UINotificationFeedbackGenerator()
generator.notificationOccurred(.success)

// Types: .success, .warning, .error
```

**Selection Feedback:**
```swift
let generator = UISelectionFeedbackGenerator()
generator.selectionChanged()
```

**In This App:**
```swift
// TodoViewModel.swift
private func generateHapticFeedback(_ type: UINotificationFeedbackGenerator.FeedbackType) {
    let generator = UINotificationFeedbackGenerator()
    generator.notificationOccurred(type)
}

// Usage
todoViewModel.addTodo(title: "New Todo")
generateHapticFeedback(.success)
```

---

## 🧪 Testing

### Unit Testing ViewModels

**Setup:**
```swift
import XCTest
@testable import TodoList

class TodoViewModelTests: XCTestCase {
    var sut: TodoViewModel!  // System Under Test

    override func setUp() {
        super.setUp()
        sut = TodoViewModel()
    }

    override func tearDown() {
        sut = nil
        super.tearDown()
    }

    func testAddTodo() {
        // Given
        let title = "Test Todo"
        let initialCount = sut.todos.count

        // When
        sut.addTodo(title: title)

        // Then
        XCTAssertEqual(sut.todos.count, initialCount + 1)
        XCTAssertEqual(sut.todos.last?.title, title)
        XCTAssertFalse(sut.todos.last?.isCompleted ?? true)
    }

    func testToggleTodo() {
        // Given
        sut.addTodo(title: "Test")
        let todoId = sut.todos.first!.id

        // When
        sut.toggleTodo(id: todoId)

        // Then
        XCTAssertTrue(sut.todos.first!.isCompleted)

        // When (toggle again)
        sut.toggleTodo(id: todoId)

        // Then
        XCTAssertFalse(sut.todos.first!.isCompleted)
    }

    func testDeleteTodo() {
        // Given
        sut.addTodo(title: "Test 1")
        sut.addTodo(title: "Test 2")
        let todoId = sut.todos.first!.id

        // When
        sut.deleteTodo(id: todoId)

        // Then
        XCTAssertEqual(sut.todos.count, 1)
        XCTAssertFalse(sut.todos.contains { $0.id == todoId })
    }

    func testCompletionPercentage() {
        // Given
        sut.addTodo(title: "Todo 1")
        sut.addTodo(title: "Todo 2")
        sut.addTodo(title: "Todo 3")
        sut.addTodo(title: "Todo 4")

        // When
        sut.toggleTodo(id: sut.todos[0].id)
        sut.toggleTodo(id: sut.todos[1].id)

        // Then
        XCTAssertEqual(sut.completionPercentage, 50.0)
    }
}
```

### UI Testing (SwiftUI)

**Setup:**
```swift
import XCTest

class TodoListUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        app = XCUIApplication()
        app.launch()
    }

    func testAddTodo() {
        // Given
        let textField = app.textFields["Add a new todo..."]
        let addButton = app.buttons["Add"]

        // When
        textField.tap()
        textField.typeText("New Todo")
        addButton.tap()

        // Then
        XCTAssertTrue(app.staticTexts["New Todo"].exists)
    }

    func testToggleTodo() {
        // Given
        addTodoHelper("Test Todo")
        let checkbox = app.buttons["TodoCheckbox_0"]

        // When
        checkbox.tap()

        // Then
        // Verify todo is in completed section
        XCTAssertTrue(app.staticTexts["Completed"].exists)
    }

    func testDeleteTodo() {
        // Given
        addTodoHelper("Test Todo")
        let todoCell = app.cells.firstMatch

        // When
        todoCell.swipeLeft()
        app.buttons["Delete"].tap()

        // Then
        XCTAssertFalse(app.staticTexts["Test Todo"].exists)
    }

    private func addTodoHelper(_ title: String) {
        let textField = app.textFields.firstMatch
        textField.tap()
        textField.typeText(title)
        app.buttons["Add"].tap()
    }
}
```

### Snapshot Testing

**Using SnapshotTesting library:**
```swift
import SnapshotTesting
import XCTest

class TodoListSnapshotTests: XCTestCase {
    func testContentViewSnapshot() {
        let view = ContentView()
            .environmentObject(TodoViewModel.sample)

        assertSnapshot(matching: view, as: .image(layout: .device(config: .iPhone13)))
    }

    func testDarkModeSnapshot() {
        let view = ContentView()
            .environmentObject(TodoViewModel.sample)
            .preferredColorScheme(.dark)

        assertSnapshot(matching: view, as: .image(layout: .device(config: .iPhone13)))
    }
}
```

### Test Coverage

**Enable Code Coverage:**
1. Xcode → Product → Scheme → Edit Scheme
2. Test → Options → Code Coverage ✓
3. Run tests (⌘U)
4. View Report Navigator → Coverage

**Target:**
- ViewModels: 80%+ coverage
- Models: 100% coverage
- Views: Test critical user flows

---

## ⚡ Performance

### Optimization Tips

#### 1. Avoid Expensive Computations in Body
```swift
// ❌ Bad: Computed every time body is called
var body: some View {
    let expensiveValue = calculateExpensiveValue()
    Text("\(expensiveValue)")
}

// ✅ Good: Computed only when dependencies change
@State private var cachedValue = 0

var body: some View {
    Text("\(cachedValue)")
        .onAppear {
            cachedValue = calculateExpensiveValue()
        }
}
```

#### 2. Use LazyVStack/LazyHStack
```swift
// ❌ Bad: All views created immediately
ScrollView {
    VStack {
        ForEach(1...1000) { i in
            ExpensiveView(number: i)
        }
    }
}

// ✅ Good: Views created on demand
ScrollView {
    LazyVStack {
        ForEach(1...1000) { i in
            ExpensiveView(number: i)
        }
    }
}
```

#### 3. Minimize @Published Properties
```swift
// ❌ Bad: Many published properties
class ViewModel: ObservableObject {
    @Published var property1 = 0
    @Published var property2 = ""
    @Published var property3 = false
    // ... triggers many updates
}

// ✅ Good: Group related properties
class ViewModel: ObservableObject {
    @Published var state = State()

    struct State {
        var property1 = 0
        var property2 = ""
        var property3 = false
    }
}
```

#### 4. Use Equatable for Complex Types
```swift
struct Todo: Equatable {
    let id: UUID
    var title: String
    var isCompleted: Bool
}

// SwiftUI can efficiently compare and avoid unnecessary updates
```

#### 5. Profile with Instruments

**Time Profiler:**
- Identify slow functions
- Optimize hot paths

**Allocations:**
- Find memory leaks
- Reduce allocations

**SwiftUI Profiler (Xcode 15+):**
- View update frequency
- Body evaluation counts

### Memory Management

**Avoid Retain Cycles:**
```swift
// ❌ Bad: Retain cycle
class ViewModel: ObservableObject {
    var closure: (() -> Void)?

    func setup() {
        closure = {
            self.doSomething()  // Captures self
        }
    }
}

// ✅ Good: Weak reference
class ViewModel: ObservableObject {
    var closure: (() -> Void)?

    func setup() {
        closure = { [weak self] in
            self?.doSomething()
        }
    }
}
```

**Release Resources:**
```swift
class ViewModel: ObservableObject {
    private var timer: Timer?

    deinit {
        timer?.invalidate()
    }
}
```

---

## 📋 Best Practices

### Code Organization

**1. File Structure**
```
TodoList/
├── App/
│   └── TodoListApp.swift
├── Features/
│   ├── TodoList/
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   └── Models/
├── Shared/
│   ├── Components/
│   ├── Utilities/
│   └── Extensions/
└── Resources/
    └── Assets.xcassets
```

**2. Naming Conventions**
- Views: `ContentView`, `TodoListView`
- ViewModels: `TodoViewModel`, `SettingsViewModel`
- Models: `Todo`, `User`
- Extensions: `String+Extensions.swift`

**3. Comments**
```swift
// MARK: - Properties
// MARK: - Initialization
// MARK: - Public Methods
// MARK: - Private Methods
// MARK: - Preview Provider
```

### SwiftUI Best Practices

**1. Extract Complex Views**
```swift
// ❌ Bad: 200 line body
var body: some View {
    VStack {
        // ... 200 lines
    }
}

// ✅ Good: Extracted views
var body: some View {
    VStack {
        HeaderView()
        ContentView()
        FooterView()
    }
}
```

**2. Use View Builders**
```swift
@ViewBuilder
func makeContent() -> some View {
    if condition {
        ViewA()
    } else {
        ViewB()
    }
}
```

**3. Prefer Computed Properties**
```swift
var activeTodos: [Todo] {
    todos.filter { !$0.isCompleted }
}
```

**4. Use Extensions**
```swift
extension View {
    func cardStyle() -> some View {
        self
            .padding()
            .background(Color.white)
            .cornerRadius(12)
            .shadow(radius: 5)
    }
}
```

### Accessibility

**1. Labels**
```swift
Button(action: { }) {
    Image(systemName: "plus")
}
.accessibilityLabel("Add Todo")
```

**2. Hints**
```swift
TextField("Title", text: $title)
    .accessibilityHint("Enter todo title")
```

**3. Dynamic Type**
```swift
Text("Hello")
    .font(.body)  // Scales with user preference
```

**4. VoiceOver Testing**
- Enable VoiceOver: Settings → Accessibility → VoiceOver
- Test all user flows
- Ensure all buttons have labels

### Security

**1. Don't Store Sensitive Data in UserDefaults**
```swift
// ❌ Bad
UserDefaults.standard.set(password, forKey: "password")

// ✅ Good: Use Keychain
Keychain.save(password, forKey: "password")
```

**2. Validate Input**
```swift
func addTodo(title: String) {
    guard !title.isEmpty,
          title.count <= 200,
          !title.contains("<script>") else {
        return
    }
    // Proceed
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "View not updating"

**Problem:** View doesn't update when data changes

**Solutions:**
```swift
// ✅ Use @Published in ViewModel
class ViewModel: ObservableObject {
    @Published var data = []
}

// ✅ Use @StateObject or @ObservedObject in View
struct MyView: View {
    @StateObject var viewModel = ViewModel()
}

// ✅ Ensure model is Identifiable
struct Item: Identifiable {
    let id = UUID()
}
```

#### 2. "Purple warnings in console"

**Problem:** "Publishing changes from background threads is not allowed"

**Solution:**
```swift
// ❌ Bad
DispatchQueue.global().async {
    self.data = newData  // Background thread!
}

// ✅ Good
DispatchQueue.global().async {
    let newData = fetchData()
    DispatchQueue.main.async {
        self.data = newData
    }
}

// ✅ Better: Use Task
Task {
    let newData = await fetchData()
    await MainActor.run {
        self.data = newData
    }
}
```

#### 3. "ForEach crash"

**Problem:** "Fatal error: Index out of range"

**Solutions:**
```swift
// ✅ Ensure items are Identifiable
struct Item: Identifiable {
    let id: UUID
}

// ✅ Use safe deletion
.onDelete { indexSet in
    withAnimation {
        items.remove(atOffsets: indexSet)
    }
}
```

#### 4. "Preview not working"

**Solutions:**
```swift
// ✅ Provide all dependencies
#Preview {
    ContentView()
        .environmentObject(TodoViewModel())
}

// ✅ Use sample data
#Preview {
    let viewModel = TodoViewModel()
    viewModel.todos = Todo.samples
    return ContentView()
        .environmentObject(viewModel)
}
```

#### 5. "App crashes on launch"

**Check:**
- UserDefaults data corruption
- Missing required environment objects
- Force unwraps (!)

**Debug:**
```swift
// Add debugging
init() {
    print("🔍 Initializing ViewModel")
    loadTodos()
    print("✅ Loaded \(todos.count) todos")
}
```

### Debug Tools

**1. Print Debugging**
```swift
let _ = print("Debug: \(value)")
```

**2. View Debugging**
```swift
.overlay(
    Text("Debug Info")
        .background(.red)
)
```

**3. Breakpoints**
- Click line number in Xcode
- Set conditional breakpoints
- Add actions (log message, sound)

**4. LLDB Commands**
```
po viewModel.todos
expr viewModel.addTodo(title: "Test")
```

---

## 📦 App Store Deployment

### Pre-Launch Checklist

#### 1. App Information
- [ ] App name (unique, memorable)
- [ ] Bundle identifier (com.yourcompany.todolist)
- [ ] Version number (1.0.0)
- [ ] Build number (1)

#### 2. Assets
- [ ] App icon (all sizes)
- [ ] Launch screen
- [ ] Screenshots (all device sizes)
- [ ] App previews (videos, optional)

#### 3. Code
- [ ] Remove debug code
- [ ] Update version numbers
- [ ] Set production API keys
- [ ] Enable optimization

#### 4. Testing
- [ ] Test on physical devices
- [ ] Test all iOS versions (15+)
- [ ] Test on all screen sizes
- [ ] Test dark mode
- [ ] Test VoiceOver
- [ ] Test low power mode
- [ ] Test airplane mode

### App Icon Setup

**Sizes Required:**
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad Pro)
- 152x152 (iPad)
- 120x120 (iPhone small)
- 87x87 (Settings)
- 80x80 (Spotlight)
- 60x60 (Notification)

**Tool:** Use [App Icon Generator](https://appicon.co/)

### Screenshots

**Required Sizes:**
- 6.7" (iPhone 14 Pro Max): 1290 x 2796
- 6.5" (iPhone 11 Pro Max): 1242 x 2688
- 5.5" (iPhone 8 Plus): 1242 x 2208
- 12.9" (iPad Pro): 2048 x 2732

**Tips:**
- Show key features
- Use device frames
- Add descriptive text
- Localize for markets

### Build Configuration

**1. Update Build Settings**
```swift
// Info.plist
Bundle name: Todo List
Bundle identifier: com.yourname.todolist
Version: 1.0.0
Build: 1

// Deployment
Minimum iOS: 15.0
Target devices: iPhone, iPad
```

**2. Enable Optimizations**
- Build Settings → Optimization Level → Fastest, Smallest [-Os]
- Strip Debug Symbols: Yes
- Enable Bitcode: Yes (if applicable)

**3. Archive App**
```
1. Select "Any iOS Device" as target
2. Product → Archive
3. Wait for build to complete
4. Organizer window appears
```

**4. Upload to App Store Connect**
```
1. Click "Distribute App"
2. Choose "App Store Connect"
3. Select "Upload"
4. Wait for processing (~30 min)
```

### App Store Connect

**1. Create App**
- Log in to [App Store Connect](https://appstoreconnect.apple.com)
- My Apps → + → New App
- Fill in app information

**2. App Information**
```
Name: Todo List
Subtitle: Simple task management
Category: Productivity
```

**3. Pricing**
```
Price: Free (or set price)
Availability: All countries
```

**4. App Privacy**
- Fill out privacy questionnaire
- Create privacy policy (if collecting data)

**5. Version Information**
```
What's New: First release of Todo List app
Description: [Compelling description]
Keywords: todo, tasks, productivity, checklist
Support URL: https://yourwebsite.com/support
Marketing URL: https://yourwebsite.com
```

**6. Build**
- Select uploaded build
- Wait for processing

**7. Submit for Review**
- Review all information
- Submit for review
- Wait 1-3 days for approval

### Post-Launch

**1. Monitor**
- Crash reports (Xcode → Organizer)
- User reviews
- Analytics

**2. Updates**
- Bug fixes
- New features
- Version updates

**3. Marketing**
- Social media
- Website
- Product Hunt
- YouTube tutorials

---

## 🚀 Future Enhancements

### Features to Add

#### 1. Search and Filter
```swift
@Published var searchText = ""

var filteredTodos: [Todo] {
    if searchText.isEmpty {
        return todos
    } else {
        return todos.filter {
            $0.title.localizedCaseInsensitiveContains(searchText)
        }
    }
}
```

#### 2. Sorting
```swift
enum SortOrder {
    case dateCreated
    case priority
    case title
    case dueDate
}

@Published var sortOrder = SortOrder.dateCreated

var sortedTodos: [Todo] {
    switch sortOrder {
    case .dateCreated:
        return todos.sorted { $0.createdAt > $1.createdAt }
    case .priority:
        return todos.sorted { $0.priority.sortOrder > $1.priority.sortOrder }
    case .title:
        return todos.sorted { $0.title < $1.title }
    case .dueDate:
        return todos.sorted { ($0.dueDate ?? .distantFuture) < ($1.dueDate ?? .distantFuture) }
    }
}
```

#### 3. Categories/Tags
```swift
struct Todo {
    var tags: [String] = []
}

// Filter by tag
var todosByTag: [String: [Todo]] {
    Dictionary(grouping: todos) { todo in
        todo.tags.first ?? "Uncategorized"
    }
}
```

#### 4. Reminders/Notifications
```swift
import UserNotifications

func scheduleReminder(for todo: Todo) {
    let content = UNMutableNotificationContent()
    content.title = "Todo Reminder"
    content.body = todo.title
    content.sound = .default

    if let dueDate = todo.dueDate {
        let trigger = UNCalendarNotificationTrigger(
            dateMatching: Calendar.current.dateComponents(
                [.year, .month, .day, .hour, .minute],
                from: dueDate
            ),
            repeats: false
        )

        let request = UNNotificationRequest(
            identifier: todo.id.uuidString,
            content: content,
            trigger: trigger
        )

        UNUserNotificationCenter.current().add(request)
    }
}
```

#### 5. Cloud Sync (CloudKit)
```swift
import CloudKit

class CloudKitManager {
    let container = CKContainer.default()

    func saveTodo(_ todo: Todo) async throws {
        let record = CKRecord(recordType: "Todo")
        record["title"] = todo.title
        record["isCompleted"] = todo.isCompleted

        try await container.publicCloudDatabase.save(record)
    }

    func fetchTodos() async throws -> [Todo] {
        let query = CKQuery(recordType: "Todo", predicate: NSPredicate(value: true))
        let results = try await container.publicCloudDatabase.records(matching: query)

        return results.matchResults.compactMap { try? $0.1.get() }.map { record in
            Todo(
                title: record["title"] as? String ?? "",
                isCompleted: record["isCompleted"] as? Bool ?? false
            )
        }
    }
}
```

#### 6. Widgets (WidgetKit)
```swift
import WidgetKit
import SwiftUI

struct TodoWidget: Widget {
    let kind = "TodoWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            TodoWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Todo List")
        .description("See your active todos")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

struct TodoWidgetEntryView: View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading) {
            Text("Active Todos")
                .font(.headline)

            ForEach(entry.todos.prefix(3)) { todo in
                HStack {
                    Image(systemName: "circle")
                    Text(todo.title)
                        .lineLimit(1)
                }
                .font(.caption)
            }
        }
        .padding()
    }
}
```

#### 7. Siri Shortcuts
```swift
import Intents

class AddTodoIntent: NSObject {
    @available(iOS 13.0, *)
    func handle(intent: AddTodoIntentProtocol, completion: @escaping (AddTodoIntentResponse) -> Void) {
        guard let title = intent.title else {
            completion(AddTodoIntentResponse(code: .failure, userActivity: nil))
            return
        }

        // Add todo
        let todo = Todo(title: title)
        TodoViewModel.shared.addTodo(todo)

        completion(AddTodoIntentResponse(code: .success, userActivity: nil))
    }
}
```

#### 8. Collaboration/Sharing
```swift
import LinkPresentation

func shareList() -> some View {
    ShareLink(
        item: URL(string: "todolist://share/\(listId)")!,
        subject: Text("Check out my todo list"),
        message: Text("I want to share this list with you")
    )
}
```

#### 9. Analytics
```swift
import FirebaseAnalytics

func logEvent(_ name: String, parameters: [String: Any]? = nil) {
    Analytics.logEvent(name, parameters: parameters)
}

// Usage
logEvent("todo_added", parameters: ["priority": todo.priority.rawValue])
```

#### 10. In-App Purchases
```swift
import StoreKit

class StoreManager: ObservableObject {
    @Published var products: [Product] = []

    func loadProducts() async {
        do {
            products = try await Product.products(for: ["premium_features"])
        } catch {
            print("Failed to load products: \(error)")
        }
    }

    func purchase(_ product: Product) async throws {
        let result = try await product.purchase()
        // Handle result
    }
}
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Follow Swift API Design Guidelines
- Use SwiftLint for consistent formatting
- Add comments for complex logic
- Include documentation comments for public APIs

### Pull Request Process

1. Update README if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update version numbers
5. Request review from maintainers

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📚 Resources

### Official Documentation

- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [Swift Documentation](https://swift.org/documentation/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Books

- "SwiftUI by Example" by Paul Hudson
- "Thinking in SwiftUI" by Chris Eidhof
- "iOS Programming: The Big Nerd Ranch Guide"

### Websites

- [Hacking with Swift](https://www.hackingwithswift.com/)
- [Swift by Sundell](https://www.swiftbysundell.com/)
- [NSHipster](https://nshipster.com/)
- [objc.io](https://www.objc.io/)

### YouTube Channels

- CodeWithChris
- Sean Allen
- Kavsoft
- Swiftful Thinking

### Communities

- [Swift Forums](https://forums.swift.org/)
- [r/iOSProgramming](https://www.reddit.com/r/iOSProgramming/)
- [r/SwiftUI](https://www.reddit.com/r/SwiftUI/)
- [iOS Developers Slack](https://ios-developers.io/)

---

## 🙏 Acknowledgments

- Apple for SwiftUI and excellent documentation
- Swift community for tutorials and resources
- Open source contributors

---

## 📧 Contact

For questions or support:
- Email: your.email@example.com
- Twitter: @yourhandle
- Website: https://yourwebsite.com

---

**Made with ❤️ using SwiftUI**

**Last Updated:** November 17, 2025
**Version:** 1.0.0
