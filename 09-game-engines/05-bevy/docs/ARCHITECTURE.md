# Application Architecture

Detailed architectural design and implementation of the Bevy Todo List application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Module Structure](#module-structure)
3. [Data Flow](#data-flow)
4. [Component Architecture](#component-architecture)
5. [System Architecture](#system-architecture)
6. [Event-Driven Design](#event-driven-design)
7. [UI Architecture](#ui-architecture)
8. [Data Persistence](#data-persistence)
9. [Execution Flow](#execution-flow)
10. [Scalability Considerations](#scalability-considerations)

## Architecture Overview

The Todo List application follows Bevy's ECS architecture with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYERS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Presentation Layer (UI)                            │   │
│  │  - Bevy UI Components                               │   │
│  │  - Visual Rendering                                 │   │
│  │  - User Interaction                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                         ↕                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Application Layer (Systems)                        │   │
│  │  - Input Handling                                   │   │
│  │  - Business Logic                                   │   │
│  │  - UI Updates                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                         ↕                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Domain Layer (Resources & Components)              │   │
│  │  - TodoList (data model)                            │   │
│  │  - TodoItem (entities)                              │   │
│  │  - UIState (state management)                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                         ↕                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Infrastructure Layer (Utilities)                   │   │
│  │  - File I/O (storage.rs)                            │   │
│  │  - JSON Serialization                               │   │
│  │  - Cross-platform APIs                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**: UI, logic, and data are clearly separated
2. **Event-Driven**: Systems communicate via events, not direct calls
3. **Unidirectional Data Flow**: Changes flow from user input → events → state → UI
4. **Immutability Where Possible**: Components are immutable data containers
5. **Composability**: Small, focused systems that can be combined

## Module Structure

```
src/
├── main.rs                 # Application entry point
│                           # - App configuration
│                           # - Plugin registration
│
├── components/             # ECS Components (data)
│   ├── mod.rs              # Module exports
│   ├── todo_item.rs        # Todo data structures
│   │                       # - TodoItem
│   │                       # - TodoItemUI
│   │                       # - TodoCheckbox, etc.
│   └── ui_components.rs    # UI markers and state
│                           # - FilterButton
│                           # - InputText
│                           # - ButtonColors, etc.
│
├── resources/              # Global Resources
│   ├── mod.rs              # Module exports
│   ├── todo_list.rs        # Todo management
│   │                       # - TodoList resource
│   │                       # - CRUD operations
│   │                       # - Filtering logic
│   └── ui_state.rs         # UI state management
│                           # - UIState
│                           # - AppSettings
│                           # - AnimationState
│
├── events/                 # Custom Events
│   ├── mod.rs              # Module exports
│   └── todo_events.rs      # Todo-related events
│                           # - AddTodoEvent
│                           # - DeleteTodoEvent
│                           # - ToggleTodoEvent, etc.
│
├── systems/                # ECS Systems (logic)
│   ├── mod.rs              # Module exports
│   ├── setup.rs            # UI initialization
│   │                       # - setup_ui (Startup)
│   ├── todo_systems.rs     # Business logic
│   │                       # - handle_add_todo
│   │                       # - handle_delete_todo
│   │                       # - handle_toggle_todo
│   │                       # - handle_save_todos
│   │                       # - handle_load_todos
│   ├── ui_systems.rs       # UI update logic
│   │                       # - rebuild_todo_list_ui
│   │                       # - update_items_remaining
│   │                       # - button_hover_system
│   └── input_systems.rs    # Input handling
│                           # - handle_keyboard_input
│                           # - handle_button_clicks
│
├── plugins/                # Bevy Plugins
│   ├── mod.rs              # Module exports
│   └── todo_plugin.rs      # Main plugin
│                           # - TodoPlugin
│                           # - UIPlugin
│                           # - DebugPlugin
│
└── utils/                  # Utility functions
    ├── mod.rs              # Module exports
    └── storage.rs          # File I/O
                            # - save_todos
                            # - load_todos
```

### Dependency Graph

```
main.rs
  └── plugins/
        ├── todo_plugin.rs
        │     ├── systems/
        │     ├── resources/
        │     ├── events/
        │     └── components/
        └── ui_plugin.rs
              └── systems/

utils/ (standalone, no dependencies)
```

## Data Flow

### Unidirectional Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   DATA FLOW DIAGRAM                         │
└─────────────────────────────────────────────────────────────┘

User Action
    ↓
Input System
    ↓
Event (AddTodoEvent, DeleteTodoEvent, etc.)
    ↓
Business Logic System
    ↓
Resource Update (TodoList)
    ↓
Rebuild Event (RebuildUIEvent)
    ↓
UI System
    ↓
Entity Spawning/Despawning
    ↓
Visual Update (Rendered Frame)
```

### Example: Adding a Todo

```
1. User types "Buy groceries" and presses Enter
   ↓
2. handle_keyboard_input system detects input
   ↓
3. System sends AddTodoEvent { title: "Buy groceries" }
   ↓
4. handle_add_todo system receives event
   ↓
5. System calls todo_list.add_todo("Buy groceries")
   ↓
6. TodoList resource is updated (new item added)
   ↓
7. System sends RebuildUIEvent
   ↓
8. rebuild_todo_list_ui system receives event
   ↓
9. System despawns old todo UI entities
   ↓
10. System spawns new todo UI entities (including new item)
   ↓
11. Bevy renders updated UI
```

### State Transitions

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Initial    │─────→│   Modified   │─────→│   Updated    │
│    State     │      │    State     │      │      UI      │
└──────────────┘      └──────────────┘      └──────────────┘
      ↑                                            │
      └────────────────────────────────────────────┘
                   (Cycle continues)
```

## Component Architecture

### Component Hierarchy

```
Components
├── Data Components (hold actual data)
│   ├── TodoItem
│   │     ├── id: u64
│   │     ├── title: String
│   │     ├── completed: bool
│   │     └── created_at: i64
│   │
│   ├── InputText
│   │     └── value: String
│   │
│   └── ButtonColors
│         ├── normal: Color
│         ├── hovered: Color
│         └── pressed: Color
│
├── Marker Components (identify entities)
│   ├── TodoItemUI { todo_id: u64 }
│   ├── TodoCheckbox { todo_id: u64 }
│   ├── TodoDeleteButton { todo_id: u64 }
│   ├── AddTodoButton
│   ├── FilterButton { filter_type: FilterType }
│   └── TodoListContainer
│
└── Tag Components (zero-sized markers)
    ├── InteractiveButton
    ├── RootUI
    └── AppTitle
```

### Component Relationships

```
Entity: Todo Item Container
  ├── NodeBundle (Bevy UI)
  ├── TodoItemUI { todo_id: 1 }  ← Links to TodoList data
  └── Children:
        ├── Entity: Checkbox
        │     ├── ButtonBundle
        │     ├── TodoCheckbox { todo_id: 1 }
        │     └── InteractiveButton
        │
        ├── Entity: Title Text
        │     ├── TextBundle
        │     └── TodoTitleText { todo_id: 1 }
        │
        └── Entity: Delete Button
              ├── ButtonBundle
              ├── TodoDeleteButton { todo_id: 1 }
              └── InteractiveButton
```

## System Architecture

### System Categories

```
┌─────────────────────────────────────────────────────────┐
│                    SYSTEM CATEGORIES                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────┐  ┌────────────────┐               │
│  │  Startup       │  │  Update        │               │
│  │  Systems       │  │  Systems       │               │
│  │                │  │                │               │
│  │ - setup_ui     │  │ Input Systems  │               │
│  │ - load_todos   │  │ Logic Systems  │               │
│  │                │  │ UI Systems     │               │
│  │                │  │ BG Systems     │               │
│  └────────────────┘  └────────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### System Execution Order

```
Every Frame:
  ┌──────────────────────────────────────────────┐
  │ INPUT SYSTEMS (Parallel)                     │
  │ - handle_keyboard_input                      │
  │ - handle_button_clicks                       │
  │ - handle_scroll_input                        │
  │ - handle_debug_shortcuts                     │
  └──────────────────────────────────────────────┘
                    ↓
  ┌──────────────────────────────────────────────┐
  │ BUSINESS LOGIC SYSTEMS (Event-Driven)        │
  │ - handle_add_todo                            │
  │ - handle_delete_todo                         │
  │ - handle_toggle_todo                         │
  │ - handle_filter_changed                      │
  │ - handle_clear_completed                     │
  │ - handle_save_todos                          │
  │ - handle_load_todos                          │
  └──────────────────────────────────────────────┘
                    ↓
  ┌──────────────────────────────────────────────┐
  │ UI SYSTEMS (Event-Driven)                    │
  │ - rebuild_todo_list_ui                       │
  │ - update_items_remaining                     │
  │ - update_input_display                       │
  │ - button_hover_system                        │
  │ - update_filter_buttons                      │
  └──────────────────────────────────────────────┘
                    ↓
  ┌──────────────────────────────────────────────┐
  │ BACKGROUND SYSTEMS (Time-Based)              │
  │ - auto_save_todos (every 30 seconds)         │
  │ - update_animations                          │
  └──────────────────────────────────────────────┘
```

### System Responsibilities

```
Input Systems:
  - Capture user input (keyboard, mouse)
  - Convert input to events
  - No business logic
  - No state modification

Business Logic Systems:
  - Listen for events
  - Update resources
  - Validate operations
  - Emit result events

UI Systems:
  - Listen for state changes
  - Rebuild UI when needed
  - Update visual appearance
  - No business logic

Background Systems:
  - Periodic operations
  - Auto-save
  - Animations
  - Performance monitoring
```

## Event-Driven Design

### Event Architecture

```
┌────────────────────────────────────────────────────────┐
│                   EVENT FLOW                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  User Input → Input Events → Business Events →        │
│  UI Events → Visual Updates                            │
│                                                        │
└────────────────────────────────────────────────────────┘

Concrete Example:

ReceivedCharacter (Bevy)
         ↓
   handle_keyboard_input
         ↓
   AddTodoEvent (Custom)
         ↓
   handle_add_todo
         ↓
   RebuildUIEvent (Custom)
         ↓
   rebuild_todo_list_ui
         ↓
   Visual Update
```

### Event Catalog

```
User Action Events:
  - AddTodoEvent { title: String }
  - DeleteTodoEvent { id: u64 }
  - ToggleTodoEvent { id: u64 }
  - EditTodoEvent { id: u64, new_title: String }
  - FilterChangedEvent { filter: FilterType }
  - ClearCompletedEvent

Storage Events:
  - SaveTodosEvent
  - LoadTodosEvent

UI Events:
  - RebuildUIEvent

Status Events:
  - TodoOperationSuccessEvent { message: String }
  - TodoOperationErrorEvent { message: String }
```

### Event Processing Pattern

```rust
// 1. Define Event
#[derive(Event)]
pub struct MyEvent {
    pub data: String,
}

// 2. Producer System
fn producer_system(mut events: EventWriter<MyEvent>) {
    events.send(MyEvent {
        data: "Hello".to_string(),
    });
}

// 3. Consumer System
fn consumer_system(mut events: EventReader<MyEvent>) {
    for event in events.read() {
        println!("Received: {}", event.data);
    }
}

// 4. Register in Plugin
app.add_event::<MyEvent>()
   .add_systems(Update, (producer_system, consumer_system));
```

## UI Architecture

### UI Component Tree

```
Root UI Container (NodeBundle)
  └─ Column Layout
       ├─ Title (TextBundle)
       │    "Bevy Todo List"
       │
       ├─ Input Container (NodeBundle)
       │    └─ Row Layout
       │         ├─ Input Field (NodeBundle + InputText)
       │         │    └─ Placeholder Text
       │         └─ Add Button (ButtonBundle)
       │              └─ "Add" Text
       │
       ├─ Filter Container (NodeBundle)
       │    └─ Row Layout
       │         ├─ All Button
       │         ├─ Active Button
       │         └─ Completed Button
       │
       ├─ Todo List Container (NodeBundle)
       │    └─ Column Layout
       │         ├─ Todo Item 1 (NodeBundle + TodoItemUI)
       │         │    └─ Row Layout
       │         │         ├─ Checkbox
       │         │         ├─ Title Text
       │         │         └─ Delete Button
       │         │
       │         ├─ Todo Item 2
       │         └─ ...
       │
       └─ Bottom Actions (NodeBundle)
            └─ Row Layout
                 ├─ Items Remaining Text
                 └─ Clear Completed Button
```

### UI Update Strategy

```
Reactive UI Pattern:

1. State Change Detection
   if todo_list.is_changed() { ... }

2. Incremental Updates
   - Only rebuild what changed
   - Use change detection
   - Minimize entity spawning/despawning

3. Full Rebuilds
   - On filter change
   - On todo add/delete
   - Keep it efficient with small todo counts

4. Visual Updates Only
   - Text color changes
   - Button states
   - Counters
   - No entity changes
```

### Layout System

```
Flexbox-Based Layout:

┌─────────────────────────────────────────────┐
│  Root Container (Flex Column)               │
│  ┌─────────────────────────────────────┐   │
│  │  Title                              │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │  Input Row (Flex Row)               │   │
│  │  ┌────────────┐  ┌──────────┐      │   │
│  │  │ Input 75%  │  │ Button   │      │   │
│  │  │            │  │ 25%      │      │   │
│  │  └────────────┘  └──────────┘      │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │  Todo List (Scrollable)             │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ Todo 1                        │  │   │
│  │  ├───────────────────────────────┤  │   │
│  │  │ Todo 2                        │  │   │
│  │  ├───────────────────────────────┤  │   │
│  │  │ ...                           │  │   │
│  │  └───────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Data Persistence

### Storage Architecture

```
┌────────────────────────────────────────────────┐
│           PERSISTENCE LAYER                    │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────┐        ┌──────────────┐     │
│  │  TodoList    │───────→│   serde      │     │
│  │  (Resource)  │        │ Serialization│     │
│  └──────────────┘        └──────────────┘     │
│                                 │              │
│                                 ↓              │
│                          ┌──────────────┐     │
│                          │ JSON String  │     │
│                          └──────────────┘     │
│                                 │              │
│                                 ↓              │
│                          ┌──────────────┐     │
│                          │   File I/O   │     │
│                          └──────────────┘     │
│                                 │              │
│                                 ↓              │
│                    ~/.bevy_todos/todos.json    │
│                                                │
└────────────────────────────────────────────────┘
```

### Save/Load Flow

```
Save Flow:
  TodoList (Memory)
    → serde::serialize
    → JSON String
    → fs::write
    → File System

Load Flow:
  File System
    → fs::read_to_string
    → JSON String
    → serde::deserialize
    → TodoList (Memory)
```

### Storage Implementation

```rust
// Data structure
#[derive(Resource, Serialize, Deserialize)]
pub struct TodoList {
    pub items: Vec<TodoItem>,
    pub next_id: u64,
    #[serde(skip)]  // Don't save the filter
    pub filter: FilterType,
}

#[derive(Component, Serialize, Deserialize)]
pub struct TodoItem {
    pub id: u64,
    pub title: String,
    pub completed: bool,
    pub created_at: i64,
}

// Save function
pub fn save_todos(todo_list: &TodoList) -> Result<(), String> {
    let json = serde_json::to_string_pretty(todo_list)?;
    let path = get_storage_path();
    fs::write(path, json)?;
    Ok(())
}

// Load function
pub fn load_todos() -> Result<TodoList, String> {
    let path = get_storage_path();
    let json = fs::read_to_string(path)?;
    let todo_list = serde_json::from_str(&json)?;
    Ok(todo_list)
}
```

## Execution Flow

### Application Lifecycle

```
┌───────────────────────────────────────────────────┐
│            APPLICATION LIFECYCLE                  │
├───────────────────────────────────────────────────┤
│                                                   │
│  1. main() Entry Point                            │
│     - Initialize logging                          │
│     - Create App                                  │
│     - Add plugins                                 │
│                                                   │
│  2. Plugin Build Phase                            │
│     - Register resources                          │
│     - Register events                             │
│     - Register systems                            │
│                                                   │
│  3. Startup Schedule (Once)                       │
│     - setup_ui                                    │
│     - startup_load_todos                          │
│                                                   │
│  4. Main Loop (Every Frame)                       │
│     ┌─────────────────────────────────┐          │
│     │  Update Schedule                │          │
│     │  - Input systems                │          │
│     │  - Logic systems                │          │
│     │  - UI systems                   │          │
│     │  - Background systems           │          │
│     └─────────────────────────────────┘          │
│           ↓ (Repeat)                              │
│                                                   │
│  5. Shutdown (On Close)                           │
│     - Cleanup resources                           │
│     - (Auto-save handled by drop)                 │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Frame Execution

```
Frame N:
  ┌─────────────────────────────────────────┐
  │ 1. Process Input                        │
  │    - Keyboard events                    │
  │    - Mouse events                       │
  │    - Generate custom events             │
  ├─────────────────────────────────────────┤
  │ 2. Update State                         │
  │    - Process events                     │
  │    - Update resources                   │
  │    - Modify components                  │
  ├─────────────────────────────────────────┤
  │ 3. Rebuild UI (if needed)               │
  │    - Despawn old entities               │
  │    - Spawn new entities                 │
  │    - Update visual properties           │
  ├─────────────────────────────────────────┤
  │ 4. Render                               │
  │    - Bevy's rendering pipeline          │
  │    - Draw to screen                     │
  └─────────────────────────────────────────┘

Frame N+1: Repeat
```

## Scalability Considerations

### Current Design Limits

```
Comfortable Performance:
  - Up to 1,000 todos
  - 60+ FPS on modern hardware
  - Quick UI rebuilds

Potential Bottlenecks:
  - Full UI rebuild on every change
  - No virtualization for long lists
  - Synchronous file I/O
```

### Scaling Strategies

#### 1. Virtual Scrolling
```rust
// Instead of rendering all todos
for todo in todos.iter() {
    spawn_todo(todo);
}

// Render only visible todos
let visible_range = calculate_visible_range(scroll_position);
for todo in todos[visible_range].iter() {
    spawn_todo(todo);
}
```

#### 2. Incremental Updates
```rust
// Instead of full rebuild
rebuild_entire_ui();

// Update only changed items
for todo_id in changed_todos {
    update_todo_ui(todo_id);
}
```

#### 3. Async I/O
```rust
// Instead of blocking save
fs::write(path, json)?;

// Use async I/O
tokio::fs::write(path, json).await?;
```

#### 4. State Caching
```rust
// Cache derived state
#[derive(Resource)]
struct CachedState {
    filtered_todos: Vec<TodoItem>,
    filter_hash: u64,  // Invalidation key
}
```

### Performance Monitoring

```
Bevy Diagnostics:
  - FPS tracking
  - Frame time
  - System execution time
  - Entity count
  - Memory usage

Custom Metrics:
  - Todo count
  - UI rebuild frequency
  - Save/load duration
```

---

## Conclusion

The Bevy Todo List architecture demonstrates:

✅ **Clear Separation**: UI, logic, and data are well-separated
✅ **Event-Driven**: Loosely coupled systems communicate via events
✅ **Reactive UI**: UI updates in response to state changes
✅ **Modular Design**: Easy to extend and maintain
✅ **Type Safety**: Rust's type system prevents many bugs
✅ **Performance**: Efficient ECS and parallel execution

This architecture serves as a solid foundation for building larger, more complex applications with Bevy.

## Further Reading

- [ECS_GUIDE.md](ECS_GUIDE.md) - Deep dive into ECS architecture
- [BEVY_CONCEPTS.md](BEVY_CONCEPTS.md) - Bevy-specific concepts
- [README.md](README.md) - Project overview and usage
