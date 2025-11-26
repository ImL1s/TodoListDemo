# Godot Todo List - Quick Start Guide

## Installation

1. **Download Godot 4.2+**
   - Visit: https://godotengine.org/download
   - Get the Standard version (not .NET)

2. **Open Project**
   - Launch Godot
   - Click "Import"
   - Select `project.godot` from this directory
   - Click "Import & Edit"

## Running

**In Editor:**
- Press `F5` or click ▶️ Play button

**From Command Line:**
```bash
godot --path /home/user/TodoListDemo/09-game-engines/03-godot
```

## Building

**Export Setup:**
1. Project > Export
2. Add export preset (Windows/macOS/Linux)
3. Configure settings
4. Export project

**Command Line Export:**
```bash
# Windows
godot --headless --export-release "Windows Desktop" builds/todo-list.exe

# macOS
godot --headless --export-release "macOS" builds/TodoList.app

# Linux
godot --headless --export-release "Linux/X11" builds/todo-list
```

## Project Structure

```
03-godot/
├── project.godot       # Project configuration
├── Main.tscn          # Main application scene
├── Main.gd            # Main controller
├── TodoList.gd        # Todo list manager
├── TodoItem.tscn      # Todo item component
├── TodoItem.gd        # Todo item logic
├── TodoInput.gd       # Input component
├── DataManager.gd     # Persistence layer
└── default_theme.tres # Custom theme
```

## Key Features

- ✅ Full CRUD operations
- ✅ File-based persistence (user://todos.json)
- ✅ Scene-based component architecture
- ✅ Signal-driven event handling
- ✅ Custom theme styling
- ✅ Confirmation dialogs
- ✅ Real-time statistics

## Data Storage

Todos are saved to:
- **Windows**: `%APPDATA%/Godot/app_userdata/Todo List/todos.json`
- **macOS**: `~/Library/Application Support/Godot/app_userdata/Todo List/todos.json`
- **Linux**: `~/.local/share/godot/app_userdata/Todo List/todos.json`

## Architecture Highlights

### Scene Tree
```
Main (Control)
  └─ MarginContainer
      └─ VBoxContainer
          ├─ Header (TodoInput)
          ├─ TodoList (ScrollContainer)
          └─ Footer (Stats + Actions)
```

### Signal Flow
```
TodoInput.todo_submitted
  → Main._on_todo_submitted()
    → TodoList.add_todo()
      → Creates TodoItem instance
        → DataManager.save_todos()
          → TodoList.list_changed
            → Main.update_stats()
```

### Component Communication
- **Parent → Child**: Direct method calls
- **Child → Parent**: Signal emissions
- **Sibling**: Via parent coordinator

## Code Examples

### Adding a Todo
```gdscript
# TodoList.gd
func add_todo(text: String) -> void:
    var todo := {
        "id": next_id,
        "text": text,
        "completed": false
    }
    todos.append(todo)
    _create_todo_item(todo)
    DataManager.save_todos(todos)
```

### Signal Connection
```gdscript
# Main.gd
func _ready() -> void:
    todo_input.todo_submitted.connect(_on_todo_submitted)
    todo_list.list_changed.connect(_on_list_changed)
```

### Scene Instancing
```gdscript
# TodoList.gd
const TodoItem = preload("res://TodoItem.tscn")
var item = TodoItem.instantiate()
todo_container.add_child(item)
item.setup(id, text, completed)
```

## Customization

### Changing Theme Colors
Edit `default_theme.tres`:
```tres
Button/colors/font_color = Color(0.9, 0.9, 0.95, 1)
Label/colors/font_color = Color(0.9, 0.9, 0.95, 1)
```

### Modifying Window Size
Edit `project.godot`:
```ini
[display]
window/size/viewport_width=800
window/size/viewport_height=600
```

## Keyboard Shortcuts

- **Enter**: Submit new todo
- **ESC**: Quit application

## Troubleshooting

**Project won't open:**
- Ensure Godot 4.2+ is installed
- Check project.godot is present

**Todos not saving:**
- Check console for errors
- Verify write permissions
- Check DataManager.gd for error messages

**Scene errors:**
- Reimport project (Project > Reload Project)
- Check .tscn files are valid

## Resources

- Full Documentation: `README.md` (2057 lines)
- Implementation Details: `IMPLEMENTATION_SUMMARY.md`
- Godot Docs: https://docs.godotengine.org/
- GDScript Guide: https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/

## Statistics

- **Total Lines**: 3,194
- **GDScript**: 573 lines across 6 files
- **Scenes**: 131 lines (2 .tscn files)
- **Documentation**: 2,526 lines
- **Components**: 5 (Main, TodoList, TodoItem, TodoInput, DataManager)

## Next Steps

1. Open project in Godot Editor
2. Press F5 to run
3. Add some todos to test functionality
4. Explore the scene tree structure
5. Read code comments in .gd files
6. Experiment with theme customization
7. Try building for your platform

---

**Created with Godot 4.2 Engine**
**License**: MIT (see project root)
