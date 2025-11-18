# Godot Game Engine - Todo List Application

A complete Todo List application built with **Godot Engine**, demonstrating how this powerful open-source game engine can be used for traditional desktop applications, not just games.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Why Godot?](#why-godot)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Building for Distribution](#building-for-distribution)
- [Understanding Godot Engine](#understanding-godot-engine)
- [Scene Tree Architecture](#scene-tree-architecture)
- [GDScript Programming Language](#gdscript-programming-language)
- [UI System in Godot](#ui-system-in-godot)
- [Signals: Event-Driven Architecture](#signals-event-driven-architecture)
- [File I/O and Data Persistence](#file-io-and-data-persistence)
- [Theme System](#theme-system)
- [Project Structure](#project-structure)
- [Code Deep Dive](#code-deep-dive)
- [Godot vs Other Frameworks](#godot-vs-other-frameworks)
- [When to Use Godot](#when-to-use-godot)
- [Performance Considerations](#performance-considerations)
- [Debugging and Development](#debugging-and-development)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Resources](#resources)

## Overview

This Todo List application showcases Godot Engine's capabilities for building desktop applications. While Godot is primarily known as a game engine, its comprehensive UI system, scene architecture, and cross-platform support make it surprisingly effective for traditional applications.

**What makes this implementation unique:**
- Scene-based architecture with reusable components
- Signal-driven communication between nodes
- GDScript for clean, Python-like syntax
- Built-in theme system for consistent styling
- Native file I/O with platform-independent paths
- Visual scene editor for rapid UI development

## Features

### Core Functionality
- ✅ **Create** new todo items
- ✅ **Read** persisted todos from disk
- ✅ **Update** todo completion status
- ✅ **Delete** individual todos
- ✅ **Clear completed** todos in bulk
- ✅ **Clear all** todos with confirmation

### Technical Features
- **Scene Tree Architecture**: Hierarchical node-based structure
- **Signal System**: Decoupled component communication
- **GDScript**: Python-like scripting with static typing
- **Control Nodes**: VBoxContainer, HBoxContainer, ScrollContainer
- **Data Persistence**: JSON-based file storage using `user://` path
- **Custom Theme**: Consistent styling across all UI elements
- **Input Handling**: Keyboard shortcuts (Enter to submit, ESC to quit)
- **Statistics Display**: Real-time todo counts and status

## Why Godot?

Godot Engine offers unique advantages for application development:

### Advantages

1. **Visual Scene Editor**
   - Drag-and-drop UI composition
   - Real-time preview
   - Easy layout management

2. **Scene System**
   - Reusable components
   - Instancing for efficiency
   - Hierarchical organization

3. **Cross-Platform**
   - Windows, macOS, Linux support
   - Single codebase for all platforms
   - Native performance

4. **Free and Open Source**
   - MIT license
   - No royalties or subscription fees
   - Active community development

5. **Integrated Tools**
   - Built-in editor
   - Asset management
   - Debugging tools

6. **Rapid Prototyping**
   - Fast iteration cycles
   - Hot reload support
   - Visual feedback

### Disadvantages

1. **Learning Curve**
   - Game engine concepts (nodes, scenes)
   - Different from traditional GUI frameworks
   - Scene file format complexity

2. **Overhead**
   - Larger binary size than traditional frameworks
   - Game engine features you might not need
   - Resource usage higher than minimal frameworks

3. **Ecosystem**
   - Fewer application-specific libraries
   - Community focused on games
   - Limited third-party UI components

4. **Design Philosophy**
   - Optimized for games, not applications
   - Some UI patterns require adaptation
   - Platform integration less mature

## Architecture

### Component Breakdown

```
Main (Control)
├── TodoInput (HBoxContainer)
│   ├── LineEdit
│   └── Button
├── TodoList (VBoxContainer)
│   ├── ScrollContainer
│   │   └── VBoxContainer
│   │       ├── TodoItem (HBoxContainer)
│   │       ├── TodoItem
│   │       └── ...
│   └── EmptyLabel (Label)
└── Footer (VBoxContainer)
    ├── StatsLabel (Label)
    └── Actions (HBoxContainer)
        ├── ClearCompletedButton
        └── ClearAllButton

DataManager (Autoload Singleton)
```

### Data Flow

```
1. User Input
   └─> TodoInput.todo_submitted signal
       └─> Main._on_todo_submitted()
           └─> TodoList.add_todo()
               ├─> Create TodoItem instance
               ├─> Save to DataManager
               └─> Emit list_changed signal

2. Toggle Todo
   └─> TodoItem.todo_toggled signal
       └─> TodoList.toggle_todo()
           ├─> Update data model
           ├─> Save to DataManager
           └─> Emit list_changed signal

3. Delete Todo
   └─> TodoItem.todo_deleted signal
       └─> TodoList.delete_todo()
           ├─> Remove from data model
           ├─> Remove UI node
           ├─> Save to DataManager
           └─> Emit list_changed signal

4. Statistics Update
   └─> TodoList.list_changed signal
       └─> Main._on_list_changed()
           └─> Update stats label
```

## Installation & Setup

### Prerequisites

1. **Download Godot Engine**
   - Visit: https://godotengine.org/download
   - Get Godot 4.2 or later
   - Choose Standard version (not .NET)

2. **Extract and Run**
   ```bash
   # Linux
   chmod +x Godot_v4.2-stable_linux.x86_64
   ./Godot_v4.2-stable_linux.x86_64

   # macOS
   # Open the .app file

   # Windows
   # Run the .exe file
   ```

### Opening the Project

1. Launch Godot Engine
2. Click "Import"
3. Navigate to this directory
4. Select `project.godot`
5. Click "Import & Edit"

The project will open in the Godot Editor with all scenes and scripts ready to use.

## Running the Application

### In the Editor

1. **Press F5** or click the "Play" button in the top-right
2. The application window will open
3. Start adding todos!

### Quick Test

1. Press F6 to run the current scene (Main.tscn)
2. Use Ctrl+D for quick debug builds

### From Command Line

```bash
# Run the project
godot --path /path/to/project

# Run with specific scene
godot --path /path/to/project res://Main.tscn
```

## Building for Distribution

### Export Configuration

1. **Open Project > Export**
2. **Add Export Preset**:
   - Windows Desktop
   - macOS
   - Linux/X11

3. **Configure Each Preset**:
   - Set export path
   - Choose binary format (32/64-bit)
   - Configure embed PCK option

### Windows Build

```bash
# From Godot Editor: Project > Export > Windows Desktop
# Or via command line:
godot --headless --export-release "Windows Desktop" builds/todo-list-windows.exe
```

**Output**: Standalone .exe file (and optional .pck file)

### macOS Build

```bash
godot --headless --export-release "macOS" builds/TodoList.app
```

**Output**: .app bundle for macOS

### Linux Build

```bash
godot --headless --export-release "Linux/X11" builds/todo-list-linux
```

**Output**: Standalone executable binary

### Build Optimization

1. **Exclude Unused Resources**
   - Remove unused scenes/scripts
   - Clean up import cache

2. **Optimize Binary Size**
   - Enable export filters
   - Strip debug symbols
   - Use export templates

3. **Platform-Specific**
   - Code signing (macOS)
   - Icon resources (Windows)
   - Desktop file (Linux)

## Understanding Godot Engine

### What is Godot?

Godot is an open-source game engine with:
- **Node-based architecture**: Everything is a node
- **Scene system**: Reusable component trees
- **Visual editor**: Design UIs and layouts visually
- **Multi-language support**: GDScript, C#, C++
- **Cross-platform**: Desktop, mobile, web, console

### Core Philosophy

1. **Everything is a Node**
   - Nodes are the basic building blocks
   - Nodes have properties and methods
   - Nodes can be organized hierarchically

2. **Scenes are Trees of Nodes**
   - Scenes are saved collections of nodes
   - Scenes can be instanced into other scenes
   - Scene instancing creates reusable components

3. **Signals for Communication**
   - Nodes communicate via signals
   - Signals are type-safe event emitters
   - Loose coupling between components

4. **Resource System**
   - Resources are reusable data containers
   - Themes, textures, and configurations are resources
   - Resources can be shared across scenes

### Engine Architecture

```
Engine Core
├── Scene Tree
│   ├── Node Management
│   ├── Scene Loading
│   └── Instance Handling
├── Rendering System
│   ├── 2D Renderer
│   ├── 3D Renderer
│   └── UI Renderer
├── Physics
│   ├── 2D Physics
│   └── 3D Physics
├── Audio
│   ├── Sound Effects
│   └── Music Streaming
└── Input System
    ├── Keyboard
    ├── Mouse
    └── Gamepad
```

## Scene Tree Architecture

### The Scene Tree

The **Scene Tree** is Godot's fundamental structure:

```
SceneTree (root)
└── Main (Control) - Root node of current scene
    ├── MarginContainer (MarginContainer)
    │   └── VBoxContainer (VBoxContainer)
    │       ├── Header (VBoxContainer)
    │       ├── TodoList (VBoxContainer)
    │       └── Footer (VBoxContainer)
    └── ConfirmationDialog (dynamically added)
```

### Node Hierarchy

Nodes form parent-child relationships:

```gdscript
# Parent-child relationships
var parent = get_parent()
var children = get_children()

# Navigate the tree
var root = get_tree().root
var current_scene = get_tree().current_scene

# Add/remove children
add_child(new_node)
remove_child(existing_node)
```

### Scene Instancing

Scenes can be instanced as nodes:

```gdscript
# Load a scene
const TodoItem = preload("res://TodoItem.tscn")

# Create an instance
var item = TodoItem.instantiate()

# Add to tree
todo_container.add_child(item)

# Access the instance
item.setup(id, text, completed)
```

### Node Lifecycle

Nodes have a specific lifecycle:

1. **_init()**: Constructor (rarely used)
2. **_enter_tree()**: Node enters scene tree
3. **_ready()**: Node and children are ready
4. **_process(delta)**: Called every frame
5. **_physics_process(delta)**: Called every physics frame
6. **_exit_tree()**: Node leaves scene tree

```gdscript
func _ready() -> void:
    # Initialize node
    print("Node ready!")

func _process(delta: float) -> void:
    # Called every frame
    pass

func _physics_process(delta: float) -> void:
    # Called at fixed intervals
    pass
```

### The @onready Annotation

Access child nodes after _ready():

```gdscript
# Wait for node to be ready before accessing
@onready var line_edit: LineEdit = $LineEdit
@onready var add_button: Button = $AddButton

# Equivalent to:
var line_edit: LineEdit
func _ready():
    line_edit = $LineEdit
```

## GDScript Programming Language

### Language Overview

GDScript is Godot's built-in scripting language:

- **Python-like syntax**: Indentation-based
- **Dynamically typed**: With optional static typing
- **Integrated**: Deep engine integration
- **Fast**: Optimized for Godot
- **Easy to learn**: Simple and readable

### Basic Syntax

```gdscript
# Variables
var dynamic_var = "Hello"
var typed_var: String = "World"
const CONSTANT: int = 42

# Functions
func my_function(param: String) -> int:
    return param.length()

# Control flow
if condition:
    pass
elif other_condition:
    pass
else:
    pass

# Loops
for i in range(10):
    print(i)

for item in array:
    print(item)

while condition:
    pass

# Match statement (like switch)
match value:
    1:
        print("One")
    2:
        print("Two")
    _:
        print("Other")
```

### Type System

GDScript supports optional static typing:

```gdscript
# Dynamic typing
var my_var = 42
my_var = "Now a string"  # OK

# Static typing
var my_int: int = 42
my_int = "String"  # ERROR

# Type inference
var inferred := 42  # Inferred as int

# Function types
func add(a: int, b: int) -> int:
    return a + b

# Array types
var numbers: Array[int] = [1, 2, 3]
var strings: Array[String] = ["a", "b", "c"]
```

### Built-in Types

```gdscript
# Primitives
var bool_val: bool = true
var int_val: int = 42
var float_val: float = 3.14
var string_val: String = "Hello"

# Vectors
var vec2: Vector2 = Vector2(10, 20)
var vec3: Vector3 = Vector3(1, 2, 3)

# Collections
var array: Array = [1, 2, 3]
var dict: Dictionary = {"key": "value"}

# Colors
var color: Color = Color(1.0, 0.5, 0.0, 1.0)
var color_name: Color = Color.RED

# Node paths
var path: NodePath = "Parent/Child/Node"
```

### Classes and Inheritance

```gdscript
# Extend a class
extends Control

# Class name (optional)
class_name MyCustomControl

# Member variables
var public_var: int = 0
var _private_var: int = 0  # Convention, not enforced

# Exported variables (appear in editor)
@export var speed: float = 100.0
@export_range(0, 100) var health: int = 100
@export_file var config_path: String

# Constructor
func _init() -> void:
    print("Initialized")

# Virtual methods (override parent)
func _ready() -> void:
    super._ready()  # Call parent
    print("Ready")

# Custom methods
func my_method() -> void:
    _private_method()

func _private_method() -> void:
    pass
```

### Properties and Setters/Getters

```gdscript
# Property with backing field
var _health: int = 100

# Getter/setter using properties
var health: int:
    get:
        return _health
    set(value):
        _health = clamp(value, 0, 100)
        _on_health_changed()

# Short syntax for simple getters/setters
var speed: float = 100.0:
    set(value):
        speed = max(0, value)
```

### Enumerations

```gdscript
# Enum definition
enum State {
    IDLE,
    RUNNING,
    JUMPING
}

# Usage
var current_state: State = State.IDLE

func change_state(new_state: State) -> void:
    current_state = new_state
    match current_state:
        State.IDLE:
            print("Idle")
        State.RUNNING:
            print("Running")
        State.JUMPING:
            print("Jumping")
```

### Signals in GDScript

```gdscript
# Define signals
signal health_changed(new_health: int)
signal died()
signal item_collected(item_type: String, amount: int)

# Emit signals
func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health)

    if health <= 0:
        died.emit()

# Connect signals
func _ready() -> void:
    # Method 1: Using connect()
    health_changed.connect(_on_health_changed)

    # Method 2: Using lambda
    died.connect(func(): print("Player died"))

    # Method 3: Connecting to other nodes
    $Button.pressed.connect(_on_button_pressed)
```

### String Formatting

```gdscript
# String interpolation
var name = "Alice"
var age = 30
print("Name: %s, Age: %d" % [name, age])

# Format strings
var formatted = "%.2f" % 3.14159  # "3.14"

# String methods
var text = "Hello World"
text.to_upper()  # "HELLO WORLD"
text.to_lower()  # "hello world"
text.split(" ")  # ["Hello", "World"]
text.strip_edges()  # Remove whitespace
text.begins_with("Hello")  # true
text.ends_with("World")  # true
```

### Array Operations

```gdscript
var todos: Array = []

# Add items
todos.append("Task 1")
todos.push_back("Task 2")  # Same as append
todos.insert(0, "First Task")

# Remove items
todos.remove_at(0)
todos.erase("Task 1")
todos.clear()

# Iteration
for todo in todos:
    print(todo)

for i in range(todos.size()):
    print(i, ": ", todos[i])

# Array methods
todos.size()  # Length
todos.is_empty()  # Check if empty
todos.has("Task 1")  # Check if contains
todos.find("Task 1")  # Find index (-1 if not found)
```

### Dictionary Operations

```gdscript
var todo: Dictionary = {
    "id": 1,
    "text": "Learn GDScript",
    "completed": false
}

# Access values
var text = todo["text"]
var id = todo.get("id", -1)  # With default value

# Modify
todo["completed"] = true
todo.erase("completed")

# Check keys
if todo.has("id"):
    print(todo["id"])

# Iteration
for key in todo.keys():
    print(key, ": ", todo[key])

for value in todo.values():
    print(value)
```

### Lambda Functions

```gdscript
# Lambda syntax
var add = func(a, b): return a + b
print(add.call(5, 3))  # 8

# Lambda with signals
button.pressed.connect(func():
    print("Button pressed")
)

# Lambda with captured variables
var multiplier = 2
var multiply = func(x): return x * multiplier
print(multiply.call(5))  # 10
```

### Coroutines and Await

```gdscript
# Async function
func load_data() -> void:
    print("Loading...")
    await get_tree().create_timer(2.0).timeout
    print("Loaded!")

# Await signal
func wait_for_button() -> void:
    await $Button.pressed
    print("Button was pressed!")

# Chaining awaits
func sequence() -> void:
    await load_data()
    await wait_for_button()
    print("All done!")
```

## UI System in Godot

### Control Nodes

Godot's UI system is based on **Control** nodes:

```
Control (Base class for all UI elements)
├── Container (Layout management)
│   ├── BoxContainer
│   │   ├── VBoxContainer (vertical)
│   │   └── HBoxContainer (horizontal)
│   ├── GridContainer
│   ├── ScrollContainer
│   ├── MarginContainer
│   └── PanelContainer
├── Button
├── Label
├── LineEdit
├── TextEdit
├── CheckBox
├── OptionButton
└── ... many more
```

### Layout Containers

**VBoxContainer** - Vertical layout:
```gdscript
# Arranges children vertically
var vbox = VBoxContainer.new()
vbox.add_child(Label.new())
vbox.add_child(Button.new())
# Children stack top to bottom
```

**HBoxContainer** - Horizontal layout:
```gdscript
# Arranges children horizontally
var hbox = HBoxContainer.new()
hbox.add_child(LineEdit.new())
hbox.add_child(Button.new())
# Children line up left to right
```

**MarginContainer** - Adds margins:
```gdscript
var margin = MarginContainer.new()
margin.add_theme_constant_override("margin_left", 20)
margin.add_theme_constant_override("margin_top", 20)
margin.add_theme_constant_override("margin_right", 20)
margin.add_theme_constant_override("margin_bottom", 20)
```

**ScrollContainer** - Scrollable area:
```gdscript
var scroll = ScrollContainer.new()
scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO
```

### Size Flags

Control how nodes expand and shrink:

```gdscript
# Expand to fill available space
control.size_flags_horizontal = Control.SIZE_EXPAND_FILL
control.size_flags_vertical = Control.SIZE_EXPAND_FILL

# Shrink to minimum size
control.size_flags_horizontal = Control.SIZE_SHRINK_CENTER

# Expand but don't fill
control.size_flags_horizontal = Control.SIZE_EXPAND
```

In the scene editor:
```
Layout > Container Sizing > Fill
Layout > Container Sizing > Expand
```

### Anchors and Margins

Position controls relative to parent:

```gdscript
# Anchor to top-left (default)
control.anchor_left = 0.0
control.anchor_top = 0.0
control.anchor_right = 0.0
control.anchor_bottom = 0.0

# Anchor to full parent (fill)
control.anchor_left = 0.0
control.anchor_top = 0.0
control.anchor_right = 1.0
control.anchor_bottom = 1.0

# Center
control.anchor_left = 0.5
control.anchor_top = 0.5
control.anchor_right = 0.5
control.anchor_bottom = 0.5
```

Preset layouts in editor:
- Full Rect: Fills entire parent
- Top Wide: Anchored to top, full width
- Bottom Wide: Anchored to bottom, full width
- Center: Centered in parent

### Common UI Nodes

**Label** - Display text:
```gdscript
var label = Label.new()
label.text = "Hello World"
label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
```

**Button** - Clickable button:
```gdscript
var button = Button.new()
button.text = "Click Me"
button.pressed.connect(_on_button_pressed)

func _on_button_pressed() -> void:
    print("Button clicked!")
```

**LineEdit** - Single-line text input:
```gdscript
var line_edit = LineEdit.new()
line_edit.placeholder_text = "Enter text..."
line_edit.text_changed.connect(_on_text_changed)
line_edit.text_submitted.connect(_on_text_submitted)

func _on_text_changed(new_text: String) -> void:
    print("Text: ", new_text)

func _on_text_submitted(text: String) -> void:
    print("Submitted: ", text)
```

**CheckBox** - Toggle checkbox:
```gdscript
var checkbox = CheckBox.new()
checkbox.text = "Enable feature"
checkbox.toggled.connect(_on_checkbox_toggled)

func _on_checkbox_toggled(toggled_on: bool) -> void:
    print("Checked: ", toggled_on)
```

### Dialogs

**ConfirmationDialog** - Yes/No dialog:
```gdscript
func show_confirmation() -> void:
    var dialog = ConfirmationDialog.new()
    dialog.dialog_text = "Are you sure?"
    dialog.ok_button_text = "Yes"
    dialog.cancel_button_text = "No"

    dialog.confirmed.connect(func():
        print("Confirmed")
        dialog.queue_free()
    )

    dialog.canceled.connect(func():
        print("Canceled")
        dialog.queue_free()
    )

    add_child(dialog)
    dialog.popup_centered()
```

**AcceptDialog** - Simple alert:
```gdscript
var dialog = AcceptDialog.new()
dialog.dialog_text = "Task completed!"
dialog.confirmed.connect(func(): dialog.queue_free())
add_child(dialog)
dialog.popup_centered()
```

## Signals: Event-Driven Architecture

### What are Signals?

Signals are Godot's implementation of the **Observer pattern**:

- **Type-safe events**: Signals carry typed parameters
- **Decoupled communication**: Emitters don't need to know receivers
- **Many-to-many**: One signal, multiple connections
- **Built-in**: Many nodes have pre-defined signals

### Defining Signals

```gdscript
# Simple signal
signal button_clicked()

# Signal with parameters
signal health_changed(new_health: int)
signal todo_created(id: int, text: String, completed: bool)

# In our TodoItem
signal todo_toggled(id: int, completed: bool)
signal todo_deleted(id: int)
```

### Emitting Signals

```gdscript
# Emit without parameters
button_clicked.emit()

# Emit with parameters
health_changed.emit(75)
todo_toggled.emit(todo_id, is_completed)
```

### Connecting to Signals

**Method 1: Direct connection**
```gdscript
func _ready() -> void:
    # Connect signal to method
    todo_item.todo_toggled.connect(_on_todo_toggled)
    todo_item.todo_deleted.connect(_on_todo_deleted)

func _on_todo_toggled(id: int, completed: bool) -> void:
    print("Todo ", id, " toggled: ", completed)

func _on_todo_deleted(id: int) -> void:
    print("Todo ", id, " deleted")
```

**Method 2: Lambda functions**
```gdscript
func _ready() -> void:
    button.pressed.connect(func():
        print("Button pressed!")
    )

    # Lambda with parameters
    todo_item.todo_toggled.connect(func(id, completed):
        print("Todo toggled")
    )
```

**Method 3: Editor connections**
- Select a node
- Go to "Node" panel
- Double-click a signal
- Choose target node and method
- Connection is saved in .tscn file

### Signal Flow in Todo App

```
TodoInput
    ├─ LineEdit.text_submitted
    │  └─> _on_line_edit_text_submitted()
    │      └─> emit todo_submitted(text)
    └─ Button.pressed
       └─> _on_add_button_pressed()
           └─> emit todo_submitted(text)

Main
    └─ TodoInput.todo_submitted
       └─> _on_todo_submitted(text)
           └─> TodoList.add_todo(text)

TodoList
    ├─ Creates TodoItem instance
    └─ Connects TodoItem signals
       ├─ todo_toggled -> toggle_todo()
       └─ todo_deleted -> delete_todo()
```

### Built-in Signals

Common Control node signals:
```gdscript
# Button signals
pressed  # Button clicked
button_down  # Mouse/touch down
button_up  # Mouse/touch up

# LineEdit signals
text_changed(new_text: String)  # Text modified
text_submitted(text: String)  # Enter pressed

# CheckBox signals
toggled(toggled_on: bool)  # State changed

# Control signals (all Control nodes)
mouse_entered()  # Mouse over
mouse_exited()  # Mouse left
focus_entered()  # Got keyboard focus
focus_exited()  # Lost keyboard focus
```

### Signal Best Practices

1. **Use signals for upward communication**
   ```gdscript
   # Child emits, parent receives
   # TodoItem emits -> TodoList receives
   ```

2. **Use direct calls for downward communication**
   ```gdscript
   # Parent calls child methods
   todo_item.setup(id, text, completed)
   ```

3. **Avoid long signal chains**
   ```gdscript
   # Bad: A -> B -> C -> D
   # Good: A -> D (or use a singleton)
   ```

4. **Disconnect when appropriate**
   ```gdscript
   func _exit_tree() -> void:
       signal_name.disconnect(method)
   ```

## File I/O and Data Persistence

### File Paths in Godot

Godot uses special path prefixes:

- **res://** - Resource path (project files, read-only in exports)
- **user://** - User data path (writable, platform-specific)

```gdscript
# Resource path (read-only in exports)
"res://assets/icon.png"
"res://scenes/Main.tscn"

# User data path (writable)
"user://save_data.json"
"user://config.ini"
"user://screenshots/image.png"
```

### User Data Location

The `user://` path resolves to different locations per platform:

**Windows:**
```
%APPDATA%/Godot/app_userdata/[project_name]/
C:/Users/Username/AppData/Roaming/Godot/app_userdata/Todo List/
```

**macOS:**
```
~/Library/Application Support/Godot/app_userdata/[project_name]/
```

**Linux:**
```
~/.local/share/godot/app_userdata/[project_name]/
```

Get absolute path:
```gdscript
var absolute = ProjectSettings.globalize_path("user://todos.json")
print(absolute)  # Shows actual filesystem path
```

### FileAccess Class

Read and write files:

```gdscript
# Write file
func save_data(data: Dictionary) -> bool:
    var file = FileAccess.open("user://save.json", FileAccess.WRITE)
    if file == null:
        print("Error: ", FileAccess.get_open_error())
        return false

    file.store_string(JSON.stringify(data))
    file.close()
    return true

# Read file
func load_data() -> Dictionary:
    if not FileAccess.file_exists("user://save.json"):
        return {}

    var file = FileAccess.open("user://save.json", FileAccess.READ)
    if file == null:
        print("Error: ", FileAccess.get_open_error())
        return {}

    var json_string = file.get_as_text()
    file.close()

    var json = JSON.new()
    var error = json.parse(json_string)
    if error != OK:
        print("JSON Parse Error: ", json.get_error_message())
        return {}

    return json.data
```

### JSON Serialization

```gdscript
# Object to JSON
var data = {
    "todos": [
        {"id": 1, "text": "Task 1", "completed": false},
        {"id": 2, "text": "Task 2", "completed": true}
    ],
    "version": "1.0"
}

var json_string = JSON.stringify(data, "\t")  # Pretty print
print(json_string)

# JSON to Object
var json = JSON.new()
var error = json.parse(json_string)
if error == OK:
    var parsed_data = json.data
    print(parsed_data["todos"])
else:
    print("Parse error: ", json.get_error_message())
    print("Error line: ", json.get_error_line())
```

### Our DataManager Implementation

```gdscript
extends Node

const SAVE_PATH := "user://todos.json"

func save_todos(todos: Array) -> bool:
    var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file == null:
        push_error("Failed to open save file")
        return false

    var data := {
        "version": "1.0",
        "todos": todos
    }

    var json_string := JSON.stringify(data, "\t")
    file.store_string(json_string)
    file.close()
    return true

func load_todos() -> Array:
    if not FileAccess.file_exists(SAVE_PATH):
        return []

    var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
    if file == null:
        return []

    var json_string := file.get_as_text()
    file.close()

    var json := JSON.new()
    if json.parse(json_string) != OK:
        return []

    var data = json.data
    if typeof(data) == TYPE_DICTIONARY and data.has("todos"):
        return data["todos"]

    return []
```

### Directory Operations

```gdscript
# Create directory
DirAccess.make_dir_absolute("user://screenshots")

# Check if directory exists
if DirAccess.dir_exists_absolute("user://saves"):
    print("Saves directory exists")

# List files in directory
var dir = DirAccess.open("user://")
if dir:
    dir.list_dir_begin()
    var file_name = dir.get_next()
    while file_name != "":
        if not dir.current_is_dir():
            print("Found file: ", file_name)
        file_name = dir.get_next()
    dir.list_dir_end()

# Delete file
DirAccess.remove_absolute("user://old_save.json")
```

## Theme System

### What are Themes?

Themes provide consistent styling across UI elements:

- **Centralized styling**: Define once, apply everywhere
- **Resource-based**: Themes are .tres files
- **Inheritable**: Themes can override specific properties
- **Type-specific**: Style different Control types separately

### Theme Structure

```
Theme Resource (.tres)
├── Colors
│   ├── font_color
│   ├── font_hover_color
│   └── ...
├── Fonts
│   └── font
├── Font Sizes
│   └── font_size
├── Icons
│   └── icon
└── Styles
    ├── normal (StyleBox)
    ├── hover (StyleBox)
    └── pressed (StyleBox)
```

### Creating a Theme

**In the Editor:**
1. Create new resource: Resource > New Resource > Theme
2. Save as `default_theme.tres`
3. Edit properties in Inspector
4. Assign to project or specific nodes

**In Code:**
```gdscript
var theme = Theme.new()

# Set colors
theme.set_color("font_color", "Label", Color(0.9, 0.9, 0.95))
theme.set_color("font_color", "Button", Color(0.9, 0.9, 0.95))

# Set font sizes
theme.set_font_size("font_size", "Label", 16)
theme.set_font_size("font_size", "Button", 16)

# Apply to node
control.theme = theme

# Apply to project
ProjectSettings.set_setting("gui/theme/custom", theme)
```

### StyleBox Resources

StyleBoxes define visual appearance:

```gdscript
# StyleBoxFlat - Solid color with borders
var style = StyleBoxFlat.new()
style.bg_color = Color(0.15, 0.15, 0.18)
style.border_width_left = 1
style.border_width_top = 1
style.border_width_right = 1
style.border_width_bottom = 1
style.border_color = Color(0.3, 0.3, 0.35)
style.corner_radius_top_left = 4
style.corner_radius_top_right = 4
style.corner_radius_bottom_right = 4
style.corner_radius_bottom_left = 4

# Apply to theme
theme.set_stylebox("panel", "Panel", style)
```

### Our Theme Implementation

File: `default_theme.tres`
```tres
[gd_resource type="Theme" load_steps=2 format=3]

[sub_resource type="StyleBoxFlat" id="StyleBoxFlat_panel"]
bg_color = Color(0.15, 0.15, 0.18, 1)
border_width_left = 1
border_width_top = 1
border_width_right = 1
border_width_bottom = 1
border_color = Color(0.3, 0.3, 0.35, 1)
corner_radius_top_left = 4
corner_radius_top_right = 4
corner_radius_bottom_right = 4
corner_radius_bottom_left = 4

[resource]
Button/colors/font_color = Color(0.9, 0.9, 0.95, 1)
Button/font_sizes/font_size = 16
Label/colors/font_color = Color(0.9, 0.9, 0.95, 1)
Label/font_sizes/font_size = 16
Panel/styles/panel = SubResource("StyleBoxFlat_panel")
```

### Overriding Theme Properties

Per-node overrides:
```gdscript
# Override specific property
label.add_theme_color_override("font_color", Color.RED)
button.add_theme_font_size_override("font_size", 20)

# Remove override
label.remove_theme_color_override("font_color")
```

In our TodoItem:
```gdscript
func _update_label_style() -> void:
    if is_completed:
        # Override font color for completed todos
        label.add_theme_color_override("font_color", Color(0.6, 0.6, 0.6))
    else:
        # Remove override to use theme default
        label.remove_theme_color_override("font_color")
```

## Project Structure

```
09-game-engines/03-godot/
├── project.godot          # Project configuration
├── icon.svg               # Application icon
├── default_theme.tres     # Custom theme resource
├── Main.tscn              # Main scene file
├── Main.gd                # Main script
├── TodoInput.gd           # Input component script
├── TodoItem.tscn          # Todo item scene
├── TodoItem.gd            # Todo item script
├── TodoList.gd            # Todo list manager script
├── DataManager.gd         # Data persistence singleton
└── README.md              # This file

Generated at runtime:
~/.local/share/godot/app_userdata/Todo List/
└── todos.json             # Saved todos
```

### File Descriptions

**project.godot**
- Project configuration file
- Defines application name, main scene, window size
- Sets custom theme
- Configures rendering and display settings

**Main.tscn / Main.gd**
- Root scene and controller
- Coordinates all components
- Handles user actions (Clear All, Clear Completed)
- Updates statistics display

**TodoInput.gd**
- Input component for new todos
- Manages LineEdit and Add button
- Emits `todo_submitted` signal

**TodoItem.tscn / TodoItem.gd**
- Reusable todo item scene
- Displays checkbox, label, delete button
- Emits `todo_toggled` and `todo_deleted` signals

**TodoList.gd**
- Manages todo data model
- Creates/destroys TodoItem instances
- Handles CRUD operations
- Interfaces with DataManager for persistence

**DataManager.gd**
- Singleton (autoload) for data persistence
- Saves/loads todos to/from JSON
- Provides file path utilities

**default_theme.tres**
- Custom theme resource
- Defines colors, fonts, styles
- Applied globally to project

## Code Deep Dive

### Autoload Singleton Pattern

DataManager is configured as an autoload singleton:

**In project.godot:**
```ini
[autoload]
DataManager="*res://DataManager.gd"
```

**Usage:**
```gdscript
# Access from anywhere
DataManager.save_todos(todos)
var loaded = DataManager.load_todos()
```

Benefits:
- Global access
- Single instance
- Survives scene changes
- Perfect for managers (data, audio, input)

### Component Communication

**Parent → Child (Direct Calls)**
```gdscript
# TodoList creates TodoItem and calls setup()
var item := TodoItem.instantiate()
todo_container.add_child(item)
item.setup(todo["id"], todo["text"], todo["completed"])
```

**Child → Parent (Signals)**
```gdscript
# TodoItem emits signal
todo_toggled.emit(todo_id, is_completed)

# TodoList receives signal
item.todo_toggled.connect(toggle_todo)
```

**Sibling Communication (Via Parent)**
```gdscript
# TodoInput emits
todo_submitted.emit(text)

# Main receives and forwards to TodoList
func _on_todo_submitted(text: String) -> void:
    todo_list.add_todo(text)
```

### Dynamic Node Creation

Creating nodes at runtime:

```gdscript
# Load scene as PackedScene
const TodoItem = preload("res://TodoItem.tscn")

# Create instance
var item = TodoItem.instantiate()

# Configure instance
item.setup(id, text, completed)
item.todo_toggled.connect(toggle_todo)
item.todo_deleted.connect(delete_todo)

# Add to tree
todo_container.add_child(item)
```

Destroying nodes:
```gdscript
# Queue for deletion (safe)
node.queue_free()

# Immediate removal
remove_child(node)
node.free()
```

### Error Handling

Godot error handling patterns:

```gdscript
# Check file existence
if not FileAccess.file_exists(path):
    print("File doesn't exist")
    return default_value

# Check file open errors
var file = FileAccess.open(path, FileAccess.READ)
if file == null:
    push_error("Failed to open: " + str(FileAccess.get_open_error()))
    return default_value

# Type checking
if typeof(data) != TYPE_DICTIONARY:
    push_error("Invalid data type")
    return default_value

# JSON parsing errors
var error = json.parse(json_string)
if error != OK:
    push_error("Parse error: " + json.get_error_message())
    return default_value
```

### Input Handling

Handling keyboard input:

```gdscript
# Override _input() for global input
func _input(event: InputEvent) -> void:
    if event is InputEventKey:
        if event.pressed and event.keycode == KEY_ESCAPE:
            get_tree().quit()

# Use Control signals for UI-specific input
line_edit.text_submitted.connect(_on_text_submitted)
button.pressed.connect(_on_button_pressed)
```

Common key codes:
- `KEY_ENTER`, `KEY_ESCAPE`
- `KEY_A` through `KEY_Z`
- `KEY_SPACE`, `KEY_TAB`
- `KEY_CTRL`, `KEY_SHIFT`, `KEY_ALT`

## Godot vs Other Frameworks

### Godot vs Electron

| Aspect | Godot | Electron |
|--------|-------|----------|
| Bundle Size | ~40 MB | ~100-200 MB |
| Memory Usage | Low | High |
| Startup Time | Fast | Moderate |
| UI Framework | Custom nodes | HTML/CSS |
| Language | GDScript/C# | JavaScript/TypeScript |
| Learning Curve | Moderate (game engine concepts) | Low (web technologies) |
| Ecosystem | Game-focused | Web-focused |
| Best For | Games, graphical apps | Web-like applications |

### Godot vs Qt

| Aspect | Godot | Qt |
|--------|-------|-----|
| License | MIT (fully free) | GPL/Commercial |
| UI Design | Visual scene editor | Qt Designer |
| Language | GDScript/C# | C++/Python/QML |
| Complexity | Moderate | High |
| Platform Support | Excellent | Excellent |
| Best For | Games, creative tools | Enterprise applications |

### Godot vs Unity

| Aspect | Godot | Unity |
|--------|-------|-------|
| Cost | Free | Free (with revenue cap) |
| License | MIT | Proprietary |
| 2D Tools | Excellent | Good |
| 3D Tools | Good | Excellent |
| Scripting | GDScript/C# | C# |
| Asset Store | Growing | Massive |
| Best For | 2D games, indie | 3D games, professional |

## When to Use Godot

### Good Use Cases

1. **Games (Obviously)**
   - 2D platformers, RPGs, puzzlers
   - 3D games (especially indie)
   - Mobile games

2. **Visual Applications**
   - Image editors
   - Animation tools
   - Data visualizations
   - Interactive presentations

3. **Graphical Tools**
   - Level editors
   - Map makers
   - Chart/graph applications
   - Educational software

4. **Cross-Platform Apps**
   - Desktop tools (Windows, macOS, Linux)
   - Mobile utilities
   - Kiosk applications

### Poor Use Cases

1. **Web Applications**
   - Better served by web frameworks
   - Godot's web export is experimental

2. **Enterprise Software**
   - Traditional frameworks (Qt, WPF) more mature
   - Better native OS integration

3. **Simple CLI Tools**
   - Overhead too high
   - Use Python, Go, Rust instead

4. **Mobile-First Apps**
   - Native frameworks (Swift, Kotlin) better
   - Better OS integration

### Decision Criteria

**Choose Godot if:**
- You need rich graphics/animations
- You want rapid visual prototyping
- You're comfortable with game engine paradigms
- You need cross-platform support
- You value free and open-source

**Choose something else if:**
- You need deep OS integration
- You're building a web app
- You need extensive third-party libraries
- Your team knows other frameworks well
- You need enterprise support

## Performance Considerations

### Godot Performance

**Strengths:**
- Efficient 2D renderer
- Good memory management
- Fast scene instancing
- Optimized for games (60 FPS+)

**Weaknesses:**
- Overhead from game engine
- GDScript slower than compiled languages
- Large initial binary size

### Optimization Tips

1. **Node Management**
   ```gdscript
   # Bad: Creating many small nodes
   for i in 1000:
       var label = Label.new()
       add_child(label)

   # Good: Reuse nodes, use instancing
   const ItemScene = preload("res://Item.tscn")
   var item = ItemScene.instantiate()
   ```

2. **Use Typed Variables**
   ```gdscript
   # Slower
   var my_var = 42

   # Faster (type known at compile time)
   var my_var: int = 42
   ```

3. **Avoid Frequent Updates**
   ```gdscript
   # Bad: Update every frame
   func _process(delta):
       update_ui()

   # Good: Update only when data changes
   func _on_data_changed():
       update_ui()
   ```

4. **Pool Objects**
   ```gdscript
   # Reuse nodes instead of creating/destroying
   var object_pool: Array[Node] = []

   func get_pooled_object() -> Node:
       if object_pool.is_empty():
           return create_new_object()
       else:
           return object_pool.pop_back()

   func return_to_pool(obj: Node) -> void:
       object_pool.append(obj)
   ```

## Debugging and Development

### Godot Debugger

Built-in debugging tools:

1. **Breakpoints**
   - Click in gutter to set
   - Execution pauses at breakpoint
   - Inspect variables in debugger

2. **Remote Scene Tree**
   - View live scene tree while running
   - Inspect node properties
   - Modify values in real-time

3. **Performance Monitor**
   - FPS, memory usage
   - Node count
   - Draw calls (for 2D/3D)

4. **Errors and Warnings**
   - Bottom panel shows errors
   - Stack traces for crashes
   - Print debugging with `print()`

### Print Debugging

```gdscript
# Basic print
print("Debug message")

# Print with variables
print("Value: ", my_var)

# Print warnings
push_warning("This might be a problem")

# Print errors
push_error("Something went wrong!")

# Print and return value (for inline debugging)
var result = some_function()
print("Result: ", result)
return result
```

### Live Editing

Edit scripts while game is running:
1. Enable "Live Edit" in debugger
2. Save script changes
3. Changes apply without restart

### Profiler

Analyze performance:
- CPU profiler: Function call times
- Memory profiler: Allocation tracking
- Network profiler: For networked games

## Common Patterns

### Singleton Pattern (Autoload)

```gdscript
# In project.godot:
# [autoload]
# GameManager="*res://GameManager.gd"

# GameManager.gd
extends Node

var score: int = 0

func add_score(amount: int) -> void:
    score += amount

# Usage from any script:
GameManager.add_score(10)
```

### Observer Pattern (Signals)

```gdscript
# Subject
signal state_changed(new_state: String)

func change_state(new_state: String) -> void:
    state_changed.emit(new_state)

# Observers
state_changed.connect(_on_state_changed)
```

### Component Pattern

```gdscript
# Create reusable scenes (components)
# Compose complex objects from simple parts

# Example: Character = Sprite + Collision + Script
Character (Node2D)
├── Sprite2D
├── CollisionShape2D
└── Script (movement logic)
```

### Factory Pattern

```gdscript
# Scene factory
class_name EntityFactory

const Player = preload("res://Player.tscn")
const Enemy = preload("res://Enemy.tscn")

static func create_player() -> Node:
    return Player.instantiate()

static func create_enemy() -> Node:
    return Enemy.instantiate()
```

### State Machine

```gdscript
enum State {
    IDLE,
    RUNNING,
    JUMPING
}

var current_state: State = State.IDLE

func change_state(new_state: State) -> void:
    _exit_state(current_state)
    current_state = new_state
    _enter_state(current_state)

func _enter_state(state: State) -> void:
    match state:
        State.IDLE:
            animation.play("idle")
        State.RUNNING:
            animation.play("run")
        State.JUMPING:
            animation.play("jump")

func _exit_state(state: State) -> void:
    # Cleanup for previous state
    pass
```

## Best Practices

### Code Organization

1. **One script per scene**
   - Each scene has a corresponding script
   - Script controls that scene's logic

2. **Group related scenes**
   ```
   components/
   ├── TodoItem.tscn
   ├── TodoItem.gd
   ├── TodoInput.tscn
   └── TodoInput.gd
   ```

3. **Use class_name for reusability**
   ```gdscript
   class_name TodoData
   extends Resource
   ```

### Naming Conventions

```gdscript
# PascalCase for class names
class_name TodoManager

# snake_case for variables and functions
var todo_count: int = 0
func add_todo(text: String) -> void

# UPPER_CASE for constants
const MAX_TODOS: int = 1000
const SAVE_PATH: String = "user://todos.json"

# _prefix for private/internal
var _internal_var: int = 0
func _internal_method() -> void
```

### Scene Design

1. **Keep scenes focused**
   - One responsibility per scene
   - TodoItem handles one item, not the list

2. **Use signals for communication**
   - Loose coupling between components
   - Parent-child via signals (upward)

3. **Prefer composition over inheritance**
   - Build complex scenes from simple ones
   - Instance scenes as building blocks

### GDScript Style

```gdscript
# Use static typing
var speed: float = 100.0
func move(direction: Vector2) -> void

# Document with comments
## Adds a new todo item
## @param text: The todo text
## @return bool: true if added successfully
func add_todo(text: String) -> bool:
    pass

# Use type inference when obvious
var items := []  # Inferred as Array
var name := "Bob"  # Inferred as String

# Prefer early returns
func process_item(item):
    if item == null:
        return

    if not item.is_valid():
        return

    # Main logic here
```

## Resources

### Official Documentation

- **Godot Docs**: https://docs.godotengine.org/
- **GDScript Reference**: https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/
- **Class Reference**: https://docs.godotengine.org/en/stable/classes/

### Learning Resources

- **Godot Tutorials**: https://docs.godotengine.org/en/stable/community/tutorials.html
- **GDQuest**: https://www.gdquest.com/ (Free and paid courses)
- **Brackeys Godot Series**: YouTube tutorials
- **Godot Discord**: Active community support

### Tools and Extensions

- **VS Code Extension**: Godot Tools
- **Asset Library**: https://godotengine.org/asset-library/asset
- **Export Templates**: Required for building releases

### Community

- **Reddit**: r/godot
- **Discord**: Official Godot Discord server
- **Forum**: https://forum.godotengine.org/
- **GitHub**: https://github.com/godotengine/godot

## Conclusion

This Todo List implementation demonstrates that Godot Engine is more than just a game engine. Its scene system, signal architecture, and comprehensive UI tools make it a viable option for desktop applications, especially those requiring:

- Rich visual interfaces
- Cross-platform support
- Rapid prototyping
- Component-based architecture
- Free and open-source licensing

While it may not be the first choice for traditional enterprise applications, Godot excels at creating visually engaging, interactive applications with a unique development workflow that emphasizes visual design and component reusability.

The combination of GDScript's simplicity, the visual scene editor, and powerful built-in systems creates a productive development environment that's worth considering for your next desktop application project.

**Key Takeaways:**
- Scene tree architecture promotes reusable components
- Signals provide clean, decoupled communication
- GDScript offers Python-like syntax with optional static typing
- File I/O with `user://` path ensures cross-platform compatibility
- Theme system enables consistent styling
- Visual editor accelerates UI development

Happy coding with Godot!
