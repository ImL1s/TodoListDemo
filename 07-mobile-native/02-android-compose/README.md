# Android Jetpack Compose Todo List

A modern, feature-rich Todo List application built with **Jetpack Compose** - Android's cutting-edge declarative UI toolkit. This app demonstrates best practices for Android development in 2024, including Material Design 3, MVVM architecture, Kotlin Coroutines, and DataStore persistence.

![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)
![Jetpack Compose](https://img.shields.io/badge/Jetpack%20Compose-4285F4?style=for-the-badge&logo=jetpackcompose&logoColor=white)
![Material Design 3](https://img.shields.io/badge/Material%20Design%203-757575?style=for-the-badge&logo=material-design&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#overview)
- [What is Jetpack Compose?](#what-is-jetpack-compose)
- [Why Jetpack Compose?](#why-jetpack-compose)
- [Compose vs Traditional Views](#compose-vs-traditional-views)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Key Compose Concepts](#key-compose-concepts)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Building the App](#building-the-app)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Code Deep Dive](#code-deep-dive)
- [Performance Optimization](#performance-optimization)
- [Accessibility](#accessibility)
- [Publishing to Google Play](#publishing-to-google-play)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This Todo List application is a comprehensive example of modern Android development using Jetpack Compose. It's designed to:

- **Teach Compose fundamentals** through real-world implementation
- **Demonstrate MVVM architecture** with proper separation of concerns
- **Showcase Material Design 3** theming and components
- **Implement persistent storage** using DataStore
- **Follow Android best practices** for production-quality apps

### Key Highlights

✅ **100% Jetpack Compose** - No XML layouts
✅ **Material Design 3** - Modern, adaptive UI
✅ **MVVM Architecture** - Clean, testable code
✅ **State Management** - Unidirectional data flow
✅ **Persistent Storage** - DataStore integration
✅ **Dark Mode Support** - Automatic theme switching
✅ **Animations** - Smooth, delightful transitions
✅ **Accessibility** - Screen reader compatible

---

## 🚀 What is Jetpack Compose?

**Jetpack Compose** is Android's modern declarative UI toolkit for building native user interfaces. Introduced by Google in 2021 and reaching stable 1.0 in July 2021, Compose represents a paradigm shift in Android UI development.

### Core Philosophy

Compose is built on three fundamental principles:

1. **Declarative UI**
   - Describe *what* the UI should look like, not *how* to build it
   - UI is a function of state: `UI = f(state)`
   - When state changes, UI automatically updates

2. **Composable Functions**
   - UI elements are Kotlin functions marked with `@Composable`
   - Functions can be composed (nested) to build complex UIs
   - Reusable, testable, and easy to understand

3. **Reactive by Design**
   - UI reacts to state changes automatically
   - No manual view updates required
   - State flows drive UI updates

### Simple Example

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}

// Traditional View way (XML + Java/Kotlin)
// 1. Define TextView in XML
// 2. findViewById in Activity
// 3. setText manually
// vs
// Compose way: Just call Greeting("World")
```

---

## 🎨 Why Jetpack Compose?

### 1. **Less Code, More Productivity**

**Before (XML + View Binding):**
```xml
<!-- layout.xml -->
<LinearLayout>
    <TextView android:id="@+id/textView" />
</LinearLayout>
```
```kotlin
// Activity.kt
val textView = findViewById<TextView>(R.id.textView)
textView.text = "Hello"
```

**After (Compose):**
```kotlin
@Composable
fun MyScreen() {
    Text(text = "Hello")
}
```

### 2. **Type Safety**

- Compile-time checks prevent runtime crashes
- No more `findViewById()` casting errors
- IDE autocomplete for all UI elements

### 3. **Modern Kotlin Features**

- Leverage Kotlin's expressiveness
- Extension functions, lambdas, coroutines
- Null safety built-in

### 4. **Built-in Animation**

```kotlin
// Animating size changes is this simple:
AnimatedVisibility(visible = isVisible) {
    Text("I fade in and out!")
}
```

### 5. **Easier Testing**

```kotlin
@Test
fun testButton() {
    composeTestRule.setContent {
        MyButton(onClick = { /* test */ })
    }
    composeTestRule.onNodeWithText("Click Me").performClick()
}
```

### 6. **Live Previews**

```kotlin
@Preview
@Composable
fun PreviewMyScreen() {
    MyScreen()
}
```
Instant UI previews in Android Studio without running the app!

---

## ⚖️ Compose vs Traditional Views

| Aspect | Traditional Views (XML) | Jetpack Compose |
|--------|-------------------------|-----------------|
| **Syntax** | XML + Kotlin/Java | Pure Kotlin |
| **Paradigm** | Imperative | Declarative |
| **UI Updates** | Manual (setText, etc.) | Automatic (state-driven) |
| **Code Lines** | More boilerplate | 40% less code |
| **Learning Curve** | Steeper (2 languages) | Easier (just Kotlin) |
| **Preview** | Slow (build required) | Instant (@Preview) |
| **Animations** | Complex (XML animators) | Simple (built-in APIs) |
| **State Management** | Manual sync | Automatic recomposition |
| **Testing** | Complex (Espresso) | Simple (Compose Test) |
| **Interop** | N/A | Can use Views in Compose |
| **Performance** | Good | Excellent (skips unchanged) |
| **Future** | Maintenance mode | Active development |

### Migration Path

You don't have to rewrite everything at once:

```kotlin
// Use Compose in existing View-based app
class MyActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyComposeScreen() // New Compose UI
        }
    }
}

// Use Views in Compose
@Composable
fun ComposeWithView() {
    AndroidView(factory = { context ->
        TextView(context).apply { text = "Legacy View" }
    })
}
```

---

## ✨ Features

### Core Functionality

- ✅ **Add Todos** - Quick input with keyboard shortcuts
- ✅ **Toggle Completion** - Mark todos as done/undone
- ✅ **Delete Todos** - Remove completed or unwanted items
- ✅ **Filter View** - Show All/Active/Completed todos
- ✅ **Clear Completed** - Bulk delete finished tasks
- ✅ **Persistent Storage** - Todos saved locally with DataStore
- ✅ **Active Count** - Real-time count of pending tasks

### UI/UX Features

- 🎨 **Material Design 3** - Latest design system
- 🌓 **Dark/Light Theme** - Automatic system theme detection
- 🌈 **Dynamic Colors** - Material You support (Android 12+)
- ✨ **Smooth Animations** - Enter/exit/move animations
- 📱 **Responsive Layout** - Works on all screen sizes
- ♿ **Accessible** - Screen reader support
- 🚀 **High Performance** - LazyColumn for efficient rendering

### Technical Features

- 🏗️ **MVVM Architecture** - Clean separation of concerns
- 🔄 **Unidirectional Data Flow** - Predictable state management
- 🌊 **StateFlow** - Reactive state handling
- 💾 **DataStore** - Modern key-value storage
- 🧵 **Coroutines** - Async operations made easy
- 🔒 **Type Safety** - Compile-time error checking

---

## 📸 Screenshots

> Note: Add screenshots of your app here after building

### Light Mode
- Main screen with todos
- Empty state
- Filter options

### Dark Mode
- Main screen in dark theme
- Material You dynamic colors

---

## 🏗️ Architecture

This app follows the **MVVM (Model-View-ViewModel)** architecture pattern, recommended by Google for Android apps.

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   UI Layer                       │
│  ┌─────────────────────────────────────────┐   │
│  │   TodoListScreen (Composable)            │   │
│  │   - Stateless UI                         │   │
│  │   - Observes ViewModel                   │   │
│  │   - Emits user events                    │   │
│  └──────────────┬──────────────────────────┘   │
│                 │ Events ↑    State ↓           │
└─────────────────┼───────────────────────────────┘
                  │
┌─────────────────┼───────────────────────────────┐
│                 │  ViewModel Layer               │
│  ┌──────────────▼──────────────────────────┐   │
│  │   TodoViewModel                          │   │
│  │   - Holds UI state (StateFlow)           │   │
│  │   - Handles business logic               │   │
│  │   - Manages data operations              │   │
│  │   - Survives configuration changes       │   │
│  └──────────────┬──────────────────────────┘   │
│                 │                                │
└─────────────────┼────────────────────────────────┘
                  │
┌─────────────────┼────────────────────────────────┐
│                 │  Data Layer                    │
│  ┌──────────────▼──────────────────────────┐   │
│  │   DataStore                              │   │
│  │   - Persistent storage                   │   │
│  │   - Key-value pairs                      │   │
│  │   - Kotlin Coroutines                    │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │   Todo (Data Model)                      │   │
│  │   - Immutable data class                 │   │
│  │   - Serializable for storage             │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### MVVM Layers Explained

#### 1. **Model (Data Layer)**

**Purpose:** Represents app data and business logic

**Components:**
- `Todo.kt` - Data class representing a todo item
- `TodoFilter.kt` - Enum for filtering logic
- DataStore - Persistent storage mechanism

**Responsibilities:**
- Define data structures
- Handle data persistence (save/load)
- Provide data operations (CRUD)

**Example:**
```kotlin
@Serializable
data class Todo(
    val id: String,
    val text: String,
    val completed: Boolean = false,
    val timestamp: Long = System.currentTimeMillis()
)
```

#### 2. **View (UI Layer)**

**Purpose:** Displays data and captures user input

**Components:**
- `TodoListScreen.kt` - Main screen composable
- `TodoInput.kt` - Input field component
- `TodoItem.kt` - Individual todo display
- `TodoList.kt` - List container
- `Theme.kt` - Theming configuration

**Responsibilities:**
- Render UI based on state
- Capture user interactions
- Emit events to ViewModel
- No business logic

**Example:**
```kotlin
@Composable
fun TodoListScreen(viewModel: TodoViewModel) {
    val todos by viewModel.filteredTodos.collectAsStateWithLifecycle()

    TodoList(
        todos = todos,
        onToggle = { id -> viewModel.toggleTodo(id) }
    )
}
```

#### 3. **ViewModel (Presentation Layer)**

**Purpose:** Manages UI state and handles user actions

**Components:**
- `TodoViewModel.kt` - State holder and business logic

**Responsibilities:**
- Hold UI state (StateFlow)
- Process user events
- Communicate with data layer
- Survive configuration changes (rotation)

**Example:**
```kotlin
class TodoViewModel(context: Context) : ViewModel() {
    val todos: StateFlow<List<Todo>> = ...

    fun addTodo(text: String) {
        viewModelScope.launch {
            // Update state and persist
        }
    }
}
```

### Data Flow

#### Unidirectional Data Flow (UDF)

```
User Action → ViewModel → Update State → UI Recomposes
     ↑                                         │
     └─────────────────────────────────────────┘
```

**Step-by-step:**

1. **User Interaction**
   ```kotlin
   Button(onClick = { viewModel.addTodo("New task") })
   ```

2. **ViewModel Processes Event**
   ```kotlin
   fun addTodo(text: String) {
       viewModelScope.launch {
           val newTodos = todos.value + Todo.create(text)
           saveTodos(newTodos)
       }
   }
   ```

3. **State Updates**
   ```kotlin
   val todos: StateFlow<List<Todo>> = dataStore.data.map { ... }
   ```

4. **UI Automatically Recomposes**
   ```kotlin
   val todos by viewModel.todos.collectAsStateWithLifecycle()
   // UI automatically updates when todos change
   ```

### Benefits of MVVM

✅ **Separation of Concerns** - Each layer has a single responsibility
✅ **Testability** - Easy to unit test ViewModel logic
✅ **Maintainability** - Changes in one layer don't affect others
✅ **Scalability** - Easy to add features without breaking existing code
✅ **Configuration Changes** - ViewModel survives screen rotation

---

## 📁 Project Structure

```
02-android-compose/
│
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/todocompose/
│   │   │   │   │
│   │   │   │   ├── MainActivity.kt           # App entry point
│   │   │   │   ├── TodoApplication.kt        # Application class
│   │   │   │   │
│   │   │   │   ├── data/                     # Data layer
│   │   │   │   │   └── Todo.kt              # Data model & filter enum
│   │   │   │   │
│   │   │   │   ├── viewmodel/                # ViewModel layer
│   │   │   │   │   └── TodoViewModel.kt     # State & business logic
│   │   │   │   │
│   │   │   │   └── ui/                       # UI layer
│   │   │   │       ├── TodoListScreen.kt    # Main screen
│   │   │   │       │
│   │   │   │       ├── components/           # Reusable components
│   │   │   │       │   ├── TodoInput.kt     # Input field
│   │   │   │       │   ├── TodoItem.kt      # Single todo item
│   │   │   │       │   └── TodoList.kt      # Todo list container
│   │   │   │       │
│   │   │   │       └── theme/                # Theming
│   │   │   │           ├── Color.kt         # Color definitions
│   │   │   │           └── Theme.kt         # Material theme setup
│   │   │   │
│   │   │   ├── res/                          # Resources
│   │   │   │   └── values/
│   │   │   │       └── strings.xml          # String resources
│   │   │   │
│   │   │   └── AndroidManifest.xml          # App manifest
│   │   │
│   │   └── test/                             # Unit tests
│   │       └── ...
│   │
│   └── build.gradle.kts                      # Module build config
│
├── build.gradle.kts                          # Project build config
├── settings.gradle.kts                       # Gradle settings
├── gradle.properties                         # Gradle properties
└── README.md                                 # This file
```

### File Descriptions

#### Root Level

- **build.gradle.kts** - Project-level Gradle configuration, plugin versions
- **settings.gradle.kts** - Gradle project settings, module inclusion
- **gradle.properties** - Gradle JVM settings and properties

#### App Module

- **app/build.gradle.kts** - App module dependencies and build configuration

#### Source Files

##### Main Entry Points

- **MainActivity.kt**
  - Single activity hosting entire Compose UI
  - Enables edge-to-edge display
  - Initializes ViewModel
  - Sets up theme

- **TodoApplication.kt**
  - Custom Application class
  - App-wide initialization
  - Future DI setup location

##### Data Layer

- **data/Todo.kt**
  - `Todo` data class - Immutable todo item
  - `TodoFilter` enum - Filter types (All/Active/Completed)
  - Serializable for DataStore storage
  - Helper functions for todo creation

##### ViewModel Layer

- **viewmodel/TodoViewModel.kt**
  - Manages app state with StateFlow
  - Handles all business logic
  - DataStore integration for persistence
  - Coroutines for async operations
  - Factory for dependency injection

##### UI Layer

**Main Screen:**
- **ui/TodoListScreen.kt**
  - Primary screen composable
  - Combines all UI components
  - State observation with `collectAsStateWithLifecycle()`
  - Event handlers for user actions

**Components:**
- **ui/components/TodoInput.kt**
  - Text input field for new todos
  - Keyboard handling (Done action)
  - Input validation
  - Focus management

- **ui/components/TodoItem.kt**
  - Single todo item display
  - Checkbox for completion toggle
  - Delete button
  - Strike-through for completed items
  - Smooth animations

- **ui/components/TodoList.kt**
  - LazyColumn for efficient rendering
  - Empty state display
  - Scroll state management
  - Item animations

**Theming:**
- **ui/theme/Color.kt**
  - All color definitions
  - Light and dark theme colors
  - Material 3 color roles
  - Gradient colors for backgrounds

- **ui/theme/Theme.kt**
  - Material 3 theme setup
  - Dynamic color support (Material You)
  - Dark/light theme switching
  - System bar appearance

---

## 🛠️ Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Kotlin** | 1.9.20 | Programming language |
| **Jetpack Compose** | 2023.10.01 (BOM) | Declarative UI toolkit |
| **Material 3** | Latest | Design system |
| **Android SDK** | Min 24, Target 34 | Platform APIs |
| **Gradle** | 8.2.0 | Build system |

### Architecture Components

| Component | Purpose |
|-----------|---------|
| **ViewModel** | State holder, survives config changes |
| **StateFlow** | Reactive state management |
| **Lifecycle** | Lifecycle-aware state collection |
| **DataStore** | Key-value storage (SharedPreferences replacement) |

### Kotlin Libraries

| Library | Purpose |
|---------|---------|
| **Coroutines** | Asynchronous programming |
| **Serialization** | JSON encoding/decoding for storage |
| **Flow** | Reactive data streams |

### Testing

| Library | Purpose |
|---------|---------|
| **JUnit** | Unit testing framework |
| **Compose Test** | UI testing for Compose |
| **Espresso** | Android UI testing |

### Build Tools

| Tool | Purpose |
|------|---------|
| **Kotlin DSL** | Type-safe Gradle scripts |
| **AGP (Android Gradle Plugin)** | Android build automation |

---

## 🧩 Key Compose Concepts

Understanding these concepts is crucial for mastering Jetpack Compose:

### 1. Composable Functions

**What:** Functions that describe UI, marked with `@Composable`

**Example:**
```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

**Key Points:**
- Can call other composables
- Can be previewed with `@Preview`
- Lightweight (just describe, don't create)
- No return value needed

### 2. State and Recomposition

**State:** Data that can change over time

**Recomposition:** When state changes, Compose re-invokes affected composables

**Example:**
```kotlin
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}
```

**Key Points:**
- Use `remember` to preserve state across recompositions
- Use `mutableStateOf` to create observable state
- Only affected composables recompose (smart recomposition)

### 3. State Hoisting

**What:** Moving state up to a common ancestor

**Why:** Makes composables stateless and reusable

**Example:**
```kotlin
// Bad: Stateful composable (hard to test)
@Composable
fun TodoItemBad(todo: Todo) {
    var completed by remember { mutableStateOf(todo.completed) }
    Checkbox(checked = completed, onCheckedChange = { completed = it })
}

// Good: Stateless composable (easy to test)
@Composable
fun TodoItemGood(
    todo: Todo,
    onToggle: (String) -> Unit
) {
    Checkbox(
        checked = todo.completed,
        onCheckedChange = { onToggle(todo.id) }
    )
}
```

### 4. Side Effects

**What:** Operations that escape the composable's scope

**Types:**
- `LaunchedEffect` - Run suspend functions
- `DisposableEffect` - Cleanup when leaving composition
- `SideEffect` - Run on every recomposition
- `rememberCoroutineScope` - Launch coroutines

**Example:**
```kotlin
@Composable
fun AutoFocusInput() {
    val focusRequester = remember { FocusRequester() }

    LaunchedEffect(Unit) {
        // Runs once when entering composition
        focusRequester.requestFocus()
    }

    TextField(modifier = Modifier.focusRequester(focusRequester))
}
```

### 5. Lifecycle-Aware State Collection

**What:** Automatically start/stop collecting flows based on lifecycle

**Example:**
```kotlin
@Composable
fun TodoScreen(viewModel: TodoViewModel) {
    // Automatically stops collecting when app goes to background
    val todos by viewModel.todos.collectAsStateWithLifecycle()

    TodoList(todos = todos)
}
```

### 6. Remember vs RememberSaveable

| `remember` | `rememberSaveable` |
|------------|-------------------|
| Survives recomposition | Survives recomposition + config changes |
| Lost on rotation | Saved to Bundle |
| Any type | Parcelable/Serializable types |

**Example:**
```kotlin
@Composable
fun InputField() {
    // Lost on rotation
    var text by remember { mutableStateOf("") }

    // Survives rotation
    var savedText by rememberSaveable { mutableStateOf("") }
}
```

### 7. Modifier

**What:** Compose's way to customize composables

**Common modifiers:**
```kotlin
Text(
    text = "Hello",
    modifier = Modifier
        .fillMaxWidth()        // Take full width
        .padding(16.dp)        // Add padding
        .background(Color.Blue) // Set background
        .clickable { }         // Make clickable
        .height(48.dp)         // Set height
)
```

**Order matters:**
```kotlin
// Padding then background = background doesn't include padding
Modifier.padding(16.dp).background(Color.Blue)

// Background then padding = padding inside background
Modifier.background(Color.Blue).padding(16.dp)
```

### 8. Lists - LazyColumn

**Why not Column?**
- `Column` composes ALL items (bad for long lists)
- `LazyColumn` only composes visible items (good performance)

**Example:**
```kotlin
LazyColumn {
    items(todos) { todo ->
        TodoItem(todo = todo)
    }
}
```

### 9. Material Design 3

**Components used in this app:**
- `MaterialTheme` - Theming system
- `Surface` - Container with elevation
- `Card` - Content container
- `TextField` - Text input
- `Button` - Action button
- `Checkbox` - Toggle input
- `Icon` - Vector graphics
- `Text` - Text display

### 10. Animations

**Built-in animations:**
```kotlin
// Fade in/out
AnimatedVisibility(visible = isVisible) {
    Text("I animate!")
}

// Animate value changes
val size by animateFloatAsState(targetValue = if (big) 100f else 50f)

// Animate content changes
AnimatedContent(targetState = count) { value ->
    Text("Count: $value")
}
```

---

## 📋 Prerequisites

### Required Software

1. **Java Development Kit (JDK) 17**
   - Download: [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or [OpenJDK 17](https://adoptium.net/)
   - Verify: `java -version` (should show 17.x.x)

2. **Android Studio Hedgehog (2023.1.1) or later**
   - Download: [Android Studio](https://developer.android.com/studio)
   - Recommended: Latest stable version
   - Includes: Android SDK, Gradle, Emulator

3. **Android SDK**
   - API Level 24 (Android 7.0) - Minimum
   - API Level 34 (Android 14) - Target
   - Installed via Android Studio SDK Manager

### Optional but Recommended

4. **Git** - For version control
   - Download: [Git](https://git-scm.com/)

5. **Physical Android Device** - For testing
   - Android 7.0 (API 24) or higher
   - Developer options enabled
   - USB debugging enabled

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Windows 10, macOS 10.14, Linux | Latest stable |
| **RAM** | 8 GB | 16 GB+ |
| **Disk Space** | 8 GB | 20 GB+ (for SDK & emulator) |
| **CPU** | Intel i5 / AMD Ryzen 5 | Intel i7 / AMD Ryzen 7 |
| **Screen** | 1280x800 | 1920x1080+ |

---

## 📥 Installation

### Step 1: Install Android Studio

1. **Download Android Studio**
   - Visit: https://developer.android.com/studio
   - Download installer for your OS
   - Version: Hedgehog (2023.1.1) or later

2. **Install Android Studio**
   - **Windows:** Run `.exe` installer
   - **macOS:** Drag to Applications folder
   - **Linux:** Extract and run `studio.sh`

3. **First Launch Setup**
   - Choose "Standard" installation
   - Select UI theme (Darcula or Light)
   - Download required SDK components (~2 GB)
   - Wait for installation to complete

### Step 2: Configure Android SDK

1. **Open SDK Manager**
   - Android Studio > Settings (⚙️) > Appearance & Behavior > System Settings > Android SDK
   - Or: Tools > SDK Manager

2. **Install SDK Platforms**
   - ✅ Android 14.0 (API 34) - Target version
   - ✅ Android 7.0 (API 24) - Minimum version
   - Apply changes

3. **Install SDK Tools**
   - Switch to "SDK Tools" tab
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM) - Windows/macOS
   - Apply changes

### Step 3: Clone the Repository

```bash
# Option 1: HTTPS
git clone https://github.com/yourusername/todo-compose.git

# Option 2: SSH
git clone git@github.com:yourusername/todo-compose.git

# Navigate to project directory
cd todo-compose/07-mobile-native/02-android-compose
```

### Step 4: Open Project in Android Studio

1. **Launch Android Studio**

2. **Open Project**
   - File > Open
   - Navigate to `02-android-compose` folder
   - Click "OK"

3. **Gradle Sync**
   - Android Studio automatically syncs Gradle
   - Wait for sync to complete (~5 minutes first time)
   - Check "Build" tab for any errors

4. **Trust Gradle Scripts** (if prompted)
   - Click "Trust Project"

### Step 5: Setup Emulator (Optional)

1. **Open Device Manager**
   - Tools > Device Manager
   - Or: Click phone icon in toolbar

2. **Create Virtual Device**
   - Click "Create Device"
   - Choose: Pixel 5 (recommended)
   - System Image: Android 14 (API 34)
   - Download system image if needed
   - Configure:
     - Name: Pixel_5_API_34
     - Startup orientation: Portrait
     - Graphics: Automatic
   - Click "Finish"

3. **Test Emulator**
   - Click ▶️ button next to device name
   - Wait for emulator to boot (~1 minute)

### Step 6: Connect Physical Device (Alternative)

1. **Enable Developer Options**
   - Settings > About Phone
   - Tap "Build Number" 7 times
   - Enter PIN if prompted

2. **Enable USB Debugging**
   - Settings > System > Developer Options
   - Enable "USB Debugging"

3. **Connect Device**
   - Use USB cable to connect to computer
   - Allow USB debugging when prompted

4. **Verify Connection**
   - Run: `adb devices`
   - Should show your device

---

## 🔨 Building the App

### Understanding Gradle Build

Android uses **Gradle** as its build system. The build process:

1. Compiles Kotlin code to bytecode
2. Processes resources (strings, images, etc.)
3. Generates APK (Android Package)
4. Signs APK with debug/release key
5. Optimizes (for release builds)

### Build Variants

| Variant | Purpose | Optimizations | Debuggable |
|---------|---------|---------------|----------|
| **Debug** | Development & testing | None | Yes |
| **Release** | Production distribution | ProGuard, R8 | No |

### Build via Android Studio

#### Debug Build (Development)

1. **Build Project**
   - Build > Make Project
   - Or: `Ctrl+F9` (Windows/Linux) / `Cmd+F9` (macOS)
   - Checks for errors without creating APK

2. **Build APK**
   - Build > Build Bundle(s) / APK(s) > Build APK(s)
   - Generates debug APK
   - Location: `app/build/outputs/apk/debug/app-debug.apk`

#### Release Build (Production)

1. **Generate Signed Bundle**
   - Build > Generate Signed Bundle / APK
   - Choose: Android App Bundle (recommended)
   - Create or use existing keystore
   - Build variant: release
   - Click "Finish"

2. **Output Location**
   - Bundle: `app/build/outputs/bundle/release/app-release.aab`
   - APK: `app/build/outputs/apk/release/app-release.apk`

### Build via Command Line

#### Prerequisites

```bash
# Verify Java version
java -version  # Should show 17.x.x

# Make gradlew executable (Linux/macOS)
chmod +x gradlew
```

#### Build Commands

```bash
# Clean build
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing config)
./gradlew assembleRelease

# Build Android App Bundle (for Play Store)
./gradlew bundleRelease

# Run tests
./gradlew test

# Run lint checks
./gradlew lint

# Build and install on connected device
./gradlew installDebug
```

#### Common Build Tasks

```bash
# See all available tasks
./gradlew tasks

# Build with stacktrace (for debugging build issues)
./gradlew assembleDebug --stacktrace

# Build with info logging
./gradlew assembleDebug --info

# Refresh dependencies
./gradlew build --refresh-dependencies
```

### Build Output Locations

```
app/build/
├── outputs/
│   ├── apk/
│   │   ├── debug/
│   │   │   └── app-debug.apk          # Debug APK
│   │   └── release/
│   │       └── app-release.apk        # Release APK (unsigned)
│   │
│   ├── bundle/
│   │   └── release/
│   │       └── app-release.aab        # Android App Bundle
│   │
│   └── logs/
│       └── manifest-merger-*.txt      # Manifest merge logs
│
└── intermediates/                      # Temporary build files
```

### Build Configuration Files

#### build.gradle.kts (Module Level)

```kotlin
android {
    compileSdk = 34

    defaultConfig {
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true  // Enable code shrinking
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

### Troubleshooting Build Issues

#### Issue: "SDK location not found"

**Solution:**
```bash
# Create local.properties file
echo "sdk.dir=/path/to/Android/Sdk" > local.properties
```

#### Issue: "Gradle sync failed"

**Solution:**
1. File > Invalidate Caches > Invalidate and Restart
2. Delete `.gradle` folder in project root
3. Sync again

#### Issue: "Unsupported Java version"

**Solution:**
1. File > Settings > Build > Build Tools > Gradle
2. Set "Gradle JDK" to Java 17

#### Issue: "Out of memory"

**Solution:**
```properties
# In gradle.properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
```

---

## ▶️ Running the App

### Run on Emulator

1. **Start Emulator**
   - Click emulator dropdown in toolbar
   - Select emulator (e.g., "Pixel_5_API_34")
   - Wait for boot (~30 seconds)

2. **Run App**
   - Click ▶️ Run button (or `Shift+F10`)
   - Select emulator as deployment target
   - Wait for build and installation
   - App launches automatically

### Run on Physical Device

1. **Connect Device**
   - Enable USB debugging (see Installation)
   - Connect via USB

2. **Select Device**
   - Device appears in dropdown
   - Select your device

3. **Run App**
   - Click ▶️ Run button
   - App installs and launches

### Run via Command Line

```bash
# Install and run on connected device
./gradlew installDebug

# Launch app manually (after install)
adb shell am start -n com.example.todocompose/.MainActivity

# View logs in real-time
adb logcat | grep "TodoCompose"
```

### Hot Reload (Live Edit)

Jetpack Compose supports **Live Edit** for instant UI updates without restarting the app!

#### Enable Live Edit

1. **Requirements**
   - Android Studio Flamingo or later
   - Physical device or emulator running
   - App running in debug mode

2. **Activate Live Edit**
   - Run app normally
   - Look for Live Edit icon (⚡) in editor toolbar
   - Click to enable

3. **Make Changes**
   - Edit any `@Composable` function
   - Changes appear instantly in running app
   - No rebuild, no restart!

4. **Limitations**
   - Only works for UI changes (composables)
   - Doesn't work for logic changes (ViewModel)
   - Some changes require restart

### Debugging

#### Set Breakpoints

1. Click in gutter next to line number
2. Run app in debug mode (🐞 icon)
3. App pauses at breakpoint
4. Inspect variables, step through code

#### View Logs

```kotlin
// Add logging
import android.util.Log

Log.d("TodoViewModel", "Adding todo: $text")
Log.e("TodoViewModel", "Error saving: ${e.message}")
```

**View in Logcat:**
- View > Tool Windows > Logcat
- Filter by tag or text
- Choose log level (Verbose, Debug, Info, Warn, Error)

#### Inspect Compose Layout

1. **Layout Inspector**
   - Tools > Layout Inspector
   - Select running app
   - View 3D layout hierarchy
   - Inspect composable properties

2. **Recomposition Counts**
   - Enable in Layout Inspector
   - Shows how often each composable recomposes
   - Helps identify performance issues

### Performance Monitoring

```bash
# Monitor CPU usage
adb shell top | grep com.example.todocompose

# Monitor memory
adb shell dumpsys meminfo com.example.todocompose

# Monitor frame rate
adb shell dumpsys gfxinfo com.example.todocompose
```

---

## 🧪 Testing

### Types of Tests

| Type | Purpose | Speed | Tools |
|------|---------|-------|-------|
| **Unit Tests** | Test individual functions | Fast | JUnit |
| **Integration Tests** | Test component interactions | Medium | JUnit, Mockito |
| **UI Tests** | Test user interactions | Slow | Compose Test, Espresso |

### Unit Testing (ViewModel)

**Location:** `app/src/test/java/com/example/todocompose/`

**Example Test:**
```kotlin
class TodoViewModelTest {
    @Test
    fun `addTodo should add todo to list`() {
        // Arrange
        val context = mockContext()
        val viewModel = TodoViewModel(context)

        // Act
        viewModel.addTodo("New task")

        // Assert
        val todos = viewModel.todos.value
        assertEquals(1, todos.size)
        assertEquals("New task", todos[0].text)
    }

    @Test
    fun `toggleTodo should change completion state`() {
        val viewModel = TodoViewModel(mockContext())
        viewModel.addTodo("Task")
        val todoId = viewModel.todos.value[0].id

        viewModel.toggleTodo(todoId)

        assertTrue(viewModel.todos.value[0].completed)
    }
}
```

**Run Unit Tests:**
```bash
# Command line
./gradlew test

# Android Studio
Right-click test file > Run
```

### UI Testing (Composables)

**Location:** `app/src/androidTest/java/com/example/todocompose/`

**Example Test:**
```kotlin
class TodoListScreenTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun addTodo_shouldDisplayInList() {
        // Setup
        val viewModel = TodoViewModel(ApplicationProvider.getApplicationContext())
        composeTestRule.setContent {
            TodoListScreen(viewModel = viewModel)
        }

        // Action: Type and add todo
        composeTestRule
            .onNodeWithText("What needs to be done?")
            .performTextInput("Buy milk")

        composeTestRule
            .onNodeWithContentDescription("Add todo")
            .performClick()

        // Assertion: Todo appears in list
        composeTestRule
            .onNodeWithText("Buy milk")
            .assertIsDisplayed()
    }

    @Test
    fun toggleTodo_shouldStrikethrough() {
        val viewModel = TodoViewModel(ApplicationProvider.getApplicationContext())
        viewModel.addTodo("Task to complete")

        composeTestRule.setContent {
            TodoListScreen(viewModel = viewModel)
        }

        // Click checkbox
        composeTestRule
            .onNodeWithText("Task to complete")
            .performClick()

        // Check strike-through styling
        composeTestRule
            .onNodeWithText("Task to complete")
            .assertTextStyleEquals(textDecoration = TextDecoration.LineThrough)
    }
}
```

**Run UI Tests:**
```bash
# Command line (requires connected device/emulator)
./gradlew connectedAndroidTest

# Android Studio
Right-click test file > Run
```

### Test Coverage

**Generate Coverage Report:**
```bash
./gradlew createDebugCoverageReport

# View report at:
# app/build/reports/coverage/androidTest/debug/index.html
```

---

## 🔍 Code Deep Dive

Let's explore key parts of the codebase in detail.

### Data Layer: Todo.kt

```kotlin
@Serializable
data class Todo(
    val id: String,
    val text: String,
    val completed: Boolean = false,
    val timestamp: Long = System.currentTimeMillis()
)
```

**Key Features:**
- `@Serializable` - Enables JSON conversion via kotlinx.serialization
- `data class` - Auto-generates equals(), hashCode(), toString(), copy()
- Immutable (`val`) - Thread-safe, predictable state
- Default parameters - Convenient creation

**Usage:**
```kotlin
// Create with defaults
val todo = Todo(id = "1", text = "Learn Compose")

// Create complete todo
val todo2 = Todo(id = "2", text = "Master Compose", completed = true)

// Create modified copy
val completed = todo.copy(completed = true)
```

### ViewModel: TodoViewModel.kt

#### State Management

```kotlin
val todos: StateFlow<List<Todo>> = context.dataStore.data
    .map { preferences ->
        val todosJson = preferences[TODOS_KEY] ?: "[]"
        json.decodeFromString<List<Todo>>(todosJson)
    }
    .stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )
```

**Breakdown:**
1. `context.dataStore.data` - Flow of Preferences
2. `.map { }` - Transform to List<Todo>
3. `.stateIn()` - Convert Flow to StateFlow
   - `viewModelScope` - Coroutine scope tied to ViewModel lifecycle
   - `WhileSubscribed(5000)` - Keep active for 5s after last subscriber
   - `initialValue` - Emitted while loading

#### Business Logic

```kotlin
fun addTodo(text: String) {
    if (text.isBlank()) return  // Validation

    viewModelScope.launch {  // Async operation
        val currentTodos = todos.value.toMutableList()
        currentTodos.add(0, Todo.create(text))  // Add to top
        saveTodos(currentTodos)  // Persist
    }
}
```

**Best Practices:**
- ✅ Input validation
- ✅ Async operations in viewModelScope
- ✅ Single source of truth (StateFlow)
- ✅ Immutable data (toMutableList for copy)

### UI Layer: TodoListScreen.kt

#### State Observation

```kotlin
val filteredTodos by viewModel.filteredTodos.collectAsStateWithLifecycle()
```

**Why `collectAsStateWithLifecycle()`?**
- Automatically starts collecting when screen is visible
- Stops collecting when screen goes to background
- Resumes when screen comes back to foreground
- Prevents memory leaks

**Comparison:**
```kotlin
// ❌ Bad: Keeps collecting even when app is backgrounded
val todos by viewModel.todos.collectAsState()

// ✅ Good: Lifecycle-aware collection
val todos by viewModel.todos.collectAsStateWithLifecycle()
```

#### Event Handling

```kotlin
TodoList(
    todos = filteredTodos,
    onToggleTodo = { todoId -> viewModel.toggleTodo(todoId) },
    onDeleteTodo = { todoId -> viewModel.deleteTodo(todoId) }
)
```

**Unidirectional Data Flow:**
1. User taps checkbox in TodoItem
2. `onToggleTodo` lambda is invoked
3. Event bubbles up to TodoListScreen
4. Event forwarded to ViewModel
5. ViewModel updates state
6. State flows back down to UI
7. UI recomposes automatically

### Component: TodoItem.kt

#### Animations

```kotlin
AnimatedVisibility(
    visible = visible,
    enter = fadeIn(tween(300)) + scaleIn(initialScale = 0.8f),
    exit = fadeOut(tween(200)) + shrinkVertically(tween(200))
) {
    Card { /* content */ }
}
```

**Animation Specs:**
- `fadeIn` - Opacity 0 → 1
- `scaleIn` - Scale 0.8 → 1.0
- `tween` - Duration-based interpolation
- `spring` - Physics-based animation

**Combining Animations:**
```kotlin
enter = fadeIn() + scaleIn() + slideInVertically()
```

#### Conditional Styling

```kotlin
Text(
    text = todo.text,
    color = if (todo.completed)
        Color.Gray
    else
        Color.Black,
    textDecoration = if (todo.completed)
        TextDecoration.LineThrough
    else
        null
)
```

### Component: TodoList.kt

#### LazyColumn Optimization

```kotlin
LazyColumn(
    state = listState,
    contentPadding = PaddingValues(vertical = 8.dp)
) {
    items(
        items = todos,
        key = { todo -> todo.id }  // Crucial for animations!
    ) { todo ->
        TodoItem(
            todo = todo,
            modifier = Modifier.animateItemPlacement()
        )
    }
}
```

**Key Points:**
- `key = { todo.id }` - Stable keys for proper animations
- `animateItemPlacement()` - Automatic position animations
- Only visible items are composed
- Efficient for thousands of items

### Persistence: DataStore

```kotlin
private suspend fun saveTodos(todosList: List<Todo>) {
    context.dataStore.edit { preferences ->
        val todosJson = json.encodeToString(todosList)
        preferences[TODOS_KEY] = todosJson
    }
}
```

**DataStore Benefits:**
- ✅ Type-safe with Preferences API
- ✅ Asynchronous (Coroutines)
- ✅ Handles errors gracefully
- ✅ No blocking main thread
- ✅ Atomic updates with `edit {}`

**vs SharedPreferences:**
| Feature | SharedPreferences | DataStore |
|---------|------------------|-----------|
| API | Synchronous | Asynchronous |
| Thread-safe | No | Yes |
| Error handling | Crashes | Exceptions |
| Observability | No | Flow |

---

## ⚡ Performance Optimization

Compose is fast by default, but here are optimization techniques:

### 1. Smart Recomposition

**Problem:** Unnecessary recompositions waste CPU

**Solution:** Stable parameters

```kotlin
// ❌ Recomposes every time
@Composable
fun TodoItem(todos: List<Todo>) { }  // List is unstable

// ✅ Only recomposes when todo changes
@Composable
fun TodoItem(todo: Todo) { }  // Data class is stable
```

### 2. Remember Expensive Calculations

```kotlin
@Composable
fun ExpensiveComponent(data: List<Data>) {
    // ❌ Recalculated on every recomposition
    val processed = data.filter { it.isValid }.sortedBy { it.name }

    // ✅ Cached unless data changes
    val processed = remember(data) {
        data.filter { it.isValid }.sortedBy { it.name }
    }
}
```

### 3. Derived State

```kotlin
// ❌ Multiple state variables that depend on each other
var todos by remember { mutableStateOf(listOf<Todo>()) }
var activeCount by remember { mutableStateOf(0) }

// Update both manually
fun addTodo(todo: Todo) {
    todos = todos + todo
    activeCount = todos.count { !it.completed }  // Easy to forget!
}

// ✅ Single source of truth with derived state
var todos by remember { mutableStateOf(listOf<Todo>()) }
val activeCount by remember { derivedStateOf {
    todos.count { !it.completed }
}}
```

### 4. Keys in Lists

```kotlin
LazyColumn {
    // ❌ No key - Can cause incorrect updates
    items(todos) { todo -> TodoItem(todo) }

    // ✅ Stable key - Correct animations and updates
    items(todos, key = { it.id }) { todo -> TodoItem(todo) }
}
```

### 5. Immutable Collections

```kotlin
// Use kotlinx.collections.immutable for better performance
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-collections-immutable:0.3.5")
}

import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.toImmutableList

@Composable
fun OptimizedList(todos: ImmutableList<Todo>) {
    // Compose knows this list won't change internally
    // Skips unnecessary recompositions
}
```

### 6. Baseline Profiles

Add to `app/build.gradle.kts`:
```kotlin
dependencies {
    implementation("androidx.profileinstaller:profileinstaller:1.3.1")
}
```

Baseline profiles improve startup performance by ~30%.

---

## ♿ Accessibility

Making your app accessible is crucial. This app follows WCAG guidelines:

### 1. Content Descriptions

```kotlin
Icon(
    imageVector = Icons.Default.Delete,
    contentDescription = "Delete ${todo.text}"  // Screen reader reads this
)

IconButton(
    onClick = { /* ... */ },
    modifier = Modifier.semantics {
        contentDescription = "Add new todo"
    }
) { /* ... */ }
```

### 2. Minimum Touch Targets

```kotlin
// Ensure all interactive elements are at least 48dp
IconButton(
    onClick = { /* ... */ },
    modifier = Modifier.size(48.dp)  // Minimum recommended size
) { /* ... */ }
```

### 3. Color Contrast

- All text meets WCAG AA standards (4.5:1 ratio)
- Use Material Theme colors (automatically optimized)
- Test with:
  - Settings > Accessibility > Color correction (Android)
  - Color contrast analyzers

### 4. Semantic Properties

```kotlin
Text(
    text = "5 items left",
    modifier = Modifier.semantics {
        contentDescription = "5 tasks remaining to complete"
        role = Role.Status  // Announces changes
    }
)
```

### 5. Testing Accessibility

1. **TalkBack (Screen Reader)**
   - Settings > Accessibility > TalkBack > On
   - Navigate app using TalkBack
   - Ensure all content is readable

2. **Switch Access**
   - Settings > Accessibility > Switch Access
   - Test keyboard/switch navigation

3. **Automated Testing**
```kotlin
composeTestRule
    .onNodeWithText("Add todo")
    .assertHasClickAction()
    .assertIsEnabled()
```

---

## 📦 Publishing to Google Play

### 1. Prepare for Release

#### Update Version

In `app/build.gradle.kts`:
```kotlin
defaultConfig {
    versionCode = 2  // Increment for each release
    versionName = "1.1.0"  // User-facing version
}
```

#### Create Keystore

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Store keystore safely!** If lost, you can't update your app.

#### Configure Signing

Create `keystore.properties` (add to `.gitignore`):
```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=my-key-alias
storeFile=my-release-key.keystore
```

In `app/build.gradle.kts`:
```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("../my-release-key.keystore")
            storePassword = System.getenv("STORE_PASSWORD")
            keyAlias = "my-key-alias"
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

### 2. Build Release Bundle

```bash
# Clean build
./gradlew clean

# Build signed bundle
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

**Why AAB (Android App Bundle)?**
- Smaller download size (15% average)
- Dynamic delivery
- Required by Google Play (since 2021)

### 3. Optimize APK Size

#### Enable R8 (Code Shrinking)

In `app/build.gradle.kts`:
```kotlin
buildTypes {
    release {
        isMinifyEnabled = true
        isShrinkResources = true
        proguardFiles(
            getDefaultProguardFile("proguard-android-optimize.txt"),
            "proguard-rules.pro"
        )
    }
}
```

#### Analyze APK Size

1. Build > Analyze APK
2. Select `app-release.aab`
3. View size breakdown
4. Identify large dependencies

**Typical size:**
- Debug APK: ~10 MB
- Release APK: ~5 MB (after R8)
- Download size: ~3 MB (after Play Store optimization)

### 4. Create Play Store Listing

#### Required Assets

1. **App Icon** (512x512 PNG)
2. **Feature Graphic** (1024x500 PNG)
3. **Screenshots** (at least 2)
   - Phone: 16:9 or 9:16 ratio
   - Tablet: 16:10 or 10:16 ratio
4. **Short Description** (80 chars max)
5. **Full Description** (4000 chars max)

#### Example Description

```markdown
📝 Todo Compose - Modern Task Management

A beautiful, simple todo app built with Jetpack Compose.

✨ FEATURES
• Add, edit, and delete tasks
• Mark tasks as complete
• Filter by active/completed
• Dark mode support
• Material Design 3
• Fast and lightweight

🚀 WHY TODO COMPOSE?
Built with the latest Android technologies for a smooth,
delightful user experience. No ads, no tracking, no nonsense.

Made with ❤️ using Jetpack Compose
```

### 5. Submit to Play Console

1. **Create App**
   - Go to [Google Play Console](https://play.google.com/console)
   - Click "Create App"
   - Fill in app details

2. **Upload Bundle**
   - Production > Releases
   - Create new release
   - Upload `app-release.aab`
   - Fill in release notes

3. **Content Rating**
   - Complete questionnaire
   - Get rating (likely "Everyone")

4. **Pricing & Distribution**
   - Set free or paid
   - Select countries
   - Accept policies

5. **Review**
   - Submit for review
   - Wait 1-3 days for approval

### 6. Post-Launch

#### Monitor Crashes

- Play Console > Quality > Crashes
- Integrate Firebase Crashlytics:
```kotlin
dependencies {
    implementation("com.google.firebase:firebase-crashlytics:18.6.0")
}
```

#### Track Analytics

```kotlin
// Firebase Analytics
dependencies {
    implementation("com.google.firebase:firebase-analytics:21.5.0")
}

// Log events
firebaseAnalytics.logEvent("todo_added") {
    param("method", "user_input")
}
```

#### Respond to Reviews

- Reply to user reviews promptly
- Address bugs mentioned in reviews
- Thank users for positive feedback

---

## 🚀 Future Enhancements

### Features to Add

1. **Categories/Tags**
   ```kotlin
   data class Todo(
       // ...
       val tags: List<String> = emptyList(),
       val category: Category = Category.PERSONAL
   )
   ```

2. **Due Dates & Reminders**
   ```kotlin
   data class Todo(
       // ...
       val dueDate: LocalDateTime? = null,
       val reminder: Boolean = false
   )
   ```

3. **Search Functionality**
   ```kotlin
   @Composable
   fun SearchBar(
       query: String,
       onQueryChange: (String) -> Unit
   ) { /* ... */ }
   ```

4. **Swipe to Delete**
   ```kotlin
   @OptIn(ExperimentalMaterial3Api::class)
   @Composable
   fun SwipeableTodoItem() {
       val dismissState = rememberDismissState()
       SwipeToDismiss(
           state = dismissState,
           background = { /* Delete background */ },
           dismissContent = { TodoItem() }
       )
   }
   ```

5. **Cloud Sync**
   - Firebase Firestore
   - Room Database with sync
   - WorkManager for background sync

6. **Widgets**
   - Glance API for Compose widgets
   - Home screen todo list
   - Quick add widget

### Technical Improvements

1. **Dependency Injection**
   ```kotlin
   // Hilt
   @HiltViewModel
   class TodoViewModel @Inject constructor(
       private val repository: TodoRepository
   ) : ViewModel()
   ```

2. **Multi-module Architecture**
   ```
   app/
   feature/
     ├── todos/
     └── settings/
   core/
     ├── data/
     ├── domain/
     └── ui/
   ```

3. **Offline-First**
   - Room Database + Retrofit
   - Repository pattern
   - NetworkBoundResource

4. **Improved Testing**
   - 80%+ code coverage
   - Screenshot tests with Paparazzi
   - UI tests with Robot pattern

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: Build Failed - "SDK location not found"

**Error:**
```
SDK location not found. Define location with an ANDROID_SDK_ROOT environment
variable or by setting the sdk.dir path in your project's local properties file
```

**Solution:**
```bash
# Create local.properties
echo "sdk.dir=/Users/yourname/Library/Android/sdk" > local.properties

# Or set environment variable
export ANDROID_SDK_ROOT=/Users/yourname/Library/Android/sdk
```

#### Issue: "Cannot inline bytecode built with JVM target 17"

**Error:**
```
Cannot inline bytecode built with JVM target 17 into bytecode that is being
built with JVM target 1.8
```

**Solution:**
In `app/build.gradle.kts`:
```kotlin
compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}
kotlinOptions {
    jvmTarget = "17"
}
```

#### Issue: App Crashes on Launch

**Check Logcat:**
```bash
adb logcat | grep "AndroidRuntime"
```

**Common causes:**
1. Missing `@Parcelize` annotation
2. ViewModel without Factory
3. DataStore access on main thread
4. Unhandled exceptions

#### Issue: Compose Preview Not Showing

**Solutions:**
1. Build > Make Project
2. File > Invalidate Caches > Restart
3. Check `@Preview` is above `@Composable`
4. Ensure no parameters in preview function

#### Issue: "Unresolved reference: collectAsStateWithLifecycle"

**Solution:**
Add dependency in `app/build.gradle.kts`:
```kotlin
implementation("androidx.lifecycle:lifecycle-runtime-compose:2.6.2")
```

Then sync Gradle.

#### Issue: Slow Emulator

**Solutions:**
1. Enable Hardware Acceleration
   - Intel: Install HAXM
   - AMD: Enable Hyper-V (Windows) or KVM (Linux)
2. Allocate more RAM (4GB+)
3. Use x86_64 system image (not ARM)
4. Close other apps while running emulator

#### Issue: DataStore Not Persisting

**Check:**
1. Coroutine scope (use `viewModelScope`)
2. Serialization setup
3. File permissions in manifest
4. Catch exceptions:
```kotlin
try {
    dataStore.edit { ... }
} catch (e: IOException) {
    Log.e("TodoViewModel", "Failed to save", e)
}
```

#### Issue: Recomposition Performance

**Debug:**
```kotlin
// Add to Composable
LaunchedEffect(Unit) {
    Log.d("Recomposition", "TodoItem recomposed")
}
```

**Solutions:**
1. Use `key()` in lists
2. Avoid lambda recreation
3. Use `remember` for calculations
4. Check Layout Inspector for counts

---

## 📚 Resources

### Official Documentation

- [Jetpack Compose Docs](https://developer.android.com/jetpack/compose)
- [Compose Pathways](https://developer.android.com/courses/pathways/compose)
- [Material Design 3](https://m3.material.io/)
- [Android Developers](https://developer.android.com/)

### Tutorials & Courses

- [Compose Camp](https://developer.android.com/courses/compose-camp/course)
- [Compose by Example](https://compose-by-example.com/)
- [JetpackCompose.net](https://www.jetpackcompose.net/)
- [Philipp Lackner YouTube](https://www.youtube.com/@PhilippLackner)

### Sample Projects

- [Now in Android](https://github.com/android/nowinandroid)
- [Jetpack Compose Samples](https://github.com/android/compose-samples)
- [Compose Cookbook](https://github.com/Gurupreet/ComposeCookBook)

### Community

- [r/androiddev](https://www.reddit.com/r/androiddev/)
- [Kotlin Slack](https://kotlinlang.slack.com/) (#compose channel)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/jetpack-compose)

### Tools

- [Compose Material Theme Generator](https://m3.material.io/theme-builder)
- [Compose Icons](https://fonts.google.com/icons)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)

### Books

- "Jetpack Compose Essentials" by Neil Smyth
- "Jetpack Compose by Tutorials" by raywenderlich
- "Compose Internals" by Jorge Castillo

---

## 🤝 Contributing

Contributions are welcome! Here's how:

### 1. Fork & Clone

```bash
git clone https://github.com/yourusername/todo-compose.git
cd todo-compose
```

### 2. Create Branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes

- Follow existing code style
- Add tests for new features
- Update documentation

### 4. Test

```bash
./gradlew test
./gradlew connectedAndroidTest
```

### 5. Commit

```bash
git commit -m "Add amazing feature"
```

### 6. Push & PR

```bash
git push origin feature/amazing-feature
```

Then create a Pull Request on GitHub.

### Code Style

- Follow [Kotlin style guide](https://kotlinlang.org/docs/coding-conventions.html)
- Use meaningful variable names
- Add KDoc comments for public APIs
- Keep functions small and focused

---

## 📄 License

```
MIT License

Copyright (c) 2024 Your Name

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

## 🙏 Acknowledgments

- **Google Android Team** - For Jetpack Compose
- **Kotlin Team** - For an amazing language
- **Material Design** - For beautiful design guidelines
- **Open Source Community** - For inspiration and learning resources

---

## 📞 Contact

- **Author:** Your Name
- **Email:** your.email@example.com
- **GitHub:** [@yourusername](https://github.com/yourusername)
- **Twitter:** [@yourusername](https://twitter.com/yourusername)

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/todo-compose&type=Date)](https://star-history.com/#yourusername/todo-compose&Date)

---

**Made with ❤️ and Jetpack Compose**

*Happy Composing! 🎨✨*
