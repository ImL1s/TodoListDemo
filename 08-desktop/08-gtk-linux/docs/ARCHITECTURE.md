# Architecture Documentation

This document describes the architecture and design of the GTK Todo List application.

## Table of Contents

1. [Overview](#overview)
2. [Architecture Pattern](#architecture-pattern)
3. [Component Diagram](#component-diagram)
4. [Data Flow](#data-flow)
5. [Module Descriptions](#module-descriptions)
6. [Design Decisions](#design-decisions)
7. [Extension Points](#extension-points)

## Overview

The GTK Todo List application is a desktop application built using:
- **Language**: C (C11 standard)
- **UI Toolkit**: GTK4
- **Object System**: GObject
- **Persistence**: JSON (json-glib)
- **Build System**: Meson / Make

### Key Features
- CRUD operations for todo items
- Filter views (All/Active/Completed)
- Persistent storage
- Real-time UI updates
- Keyboard shortcuts
- i18n support

## Architecture Pattern

The application follows a **Model-View-Controller (MVC)** inspired architecture adapted for GTK:

```
┌─────────────────────────────────────────────┐
│            GtkApplication                    │
│          (Application Lifecycle)             │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────┼───────────────────────────┐
│                 ▼                            │
│  ┌──────────────────────────────┐          │
│  │      TodoWindow (View)       │          │
│  │  ┌────────────────────────┐  │          │
│  │  │  UI Widgets            │  │          │
│  │  │  - Header Bar          │  │          │
│  │  │  - Entry Field         │  │          │
│  │  │  - List Box            │  │          │
│  │  │  - Filter Buttons      │  │          │
│  │  │  - Status Label        │  │          │
│  │  └────────────────────────┘  │          │
│  │           │                   │          │
│  │           │ Signals           │          │
│  │           ▼                   │          │
│  │  ┌────────────────────────┐  │          │
│  │  │  TodoRow (View)        │  │          │
│  │  │  - Checkbox            │  │          │
│  │  │  - Label               │  │          │
│  │  │  - Delete Button       │  │          │
│  │  └────────────────────────┘  │          │
│  └──────────────┬────────────────┘          │
│                 │                            │
│                 │ Uses                       │
│                 ▼                            │
│  ┌──────────────────────────────┐          │
│  │      TodoModel (Model)       │          │
│  │  ┌────────────────────────┐  │          │
│  │  │  GListStore            │  │          │
│  │  │  - Add Item            │  │          │
│  │  │  - Remove Item         │  │          │
│  │  │  - Get Counts          │  │          │
│  │  └────────────────────────┘  │          │
│  │           │                   │          │
│  │           │ Contains          │          │
│  │           ▼                   │          │
│  │  ┌────────────────────────┐  │          │
│  │  │  TodoItem (Model)      │  │          │
│  │  │  - Title               │  │          │
│  │  │  - Completed           │  │          │
│  │  │  - ID                  │  │          │
│  │  └────────────────────────┘  │          │
│  └──────────────┬────────────────┘          │
│                 │                            │
│                 │ Persisted by               │
│                 ▼                            │
│  ┌──────────────────────────────┐          │
│  │   TodoStorage (Persistence)  │          │
│  │  - Save to JSON              │          │
│  │  - Load from JSON            │          │
│  │  - Autosave                  │          │
│  └──────────────────────────────┘          │
└─────────────────────────────────────────────┘
```

## Component Diagram

### Layer 1: Application

**main.c**
- Application entry point
- GtkApplication setup
- Lifecycle management
- Global actions and accelerators

### Layer 2: View (UI)

**todo_window.c/h**
- Main application window
- UI composition
- User input handling
- Filter management
- Status display

**todo_row.c/h**
- Custom list box row
- Individual item display
- Checkbox and delete button
- Visual state updates

### Layer 3: Model (Data)

**todo_model.c/h**
- Collection of todo items
- CRUD operations
- Filtering logic
- Count aggregation
- Change notifications

**todo_item.c/h**
- Individual todo item
- GObject with properties
- Title, completed status, ID
- Change notifications via signals

### Layer 4: Persistence

**storage.c/h**
- File I/O management
- JSON serialization/deserialization
- Autosave functionality
- Data directory management

## Data Flow

### Adding a Todo

```
User Types → Entry Widget
                │
                ▼
User Presses Enter → "activate" signal
                │
                ▼
on_entry_activate() callback
                │
                ▼
add_todo_item()
                │
                ▼
TodoModel::add_item()
                │
                ├─→ Create TodoItem
                ├─→ Add to GListStore
                └─→ Emit "items-changed" signal
                      │
                      ▼
                on_model_items_changed()
                      │
                      ▼
                update_list_view()
                      │
                      ├─→ Create TodoRow for new item
                      ├─→ Add to GtkListBox
                      └─→ update_status_label()
                            │
                            ▼
                      TodoStorage (autosave timer)
                            │
                            ▼
                      Save to JSON file
```

### Toggling Completion

```
User Clicks Checkbox → "toggled" signal
                │
                ▼
on_check_button_toggled()
                │
                ▼
TodoItem::set_completed()
                │
                ├─→ Update internal state
                ├─→ Emit "notify::completed" signal
                └─→ Emit "toggled" signal
                      │
                      ▼
                on_item_completed_changed()
                      │
                      ▼
                Update visual style (strikethrough)
                      │
                      ▼
                TodoModel emits "items-changed"
                      │
                      ▼
                update_status_label()
                      │
                      ▼
                TodoStorage (autosave)
```

### Filtering

```
User Clicks Filter Button → "toggled" signal
                │
                ▼
on_filter_toggled()
                │
                ├─→ Set current_filter
                └─→ update_list_view()
                      │
                      ▼
                Clear GtkListBox
                      │
                      ▼
                For each item in TodoModel:
                      │
                      ├─→ Check filter condition
                      ├─→ Create TodoRow if matches
                      └─→ Add to GtkListBox
```

## Module Descriptions

### TodoItem (Model)

**Purpose**: Represents a single todo item with GObject properties.

**Responsibilities**:
- Store item data (title, completed, id, timestamp)
- Provide property get/set methods
- Emit signals on changes
- Manage memory (finalize)

**Key Methods**:
```c
TodoItem *todo_item_new(const gchar *title);
void todo_item_set_title(TodoItem *self, const gchar *title);
void todo_item_set_completed(TodoItem *self, gboolean completed);
void todo_item_toggle_completed(TodoItem *self);
```

**Signals**:
- `changed`: Any property changed
- `toggled`: Completion status toggled

**Properties**:
- `title` (string): The item title
- `completed` (boolean): Whether completed
- `id` (uint): Unique identifier
- `created-at` (boxed): Creation timestamp

### TodoModel (Model Collection)

**Purpose**: Manages a collection of TodoItem objects.

**Responsibilities**:
- Add/remove items
- Provide filtered views
- Maintain unique IDs
- Calculate counts
- Load/save data

**Key Methods**:
```c
TodoModel *todo_model_new(void);
TodoItem *todo_model_add_item(TodoModel *self, const gchar *title);
void todo_model_remove_item(TodoModel *self, TodoItem *item);
guint todo_model_clear_completed(TodoModel *self);
guint todo_model_get_active_count(TodoModel *self);
```

**Signals**:
- `item-added`: New item added
- `item-removed`: Item removed
- `items-changed`: Collection changed

**Data Structure**:
- Uses `GListStore` to hold `TodoItem` objects
- Supports list model interface for GTK

### TodoRow (View)

**Purpose**: Custom widget to display a single todo item.

**Responsibilities**:
- Display item information
- Handle user interactions (checkbox, delete)
- Update visual state
- Bind to TodoItem properties

**Key Methods**:
```c
GtkWidget *todo_row_new(TodoItem *item);
void todo_row_set_item(TodoRow *self, TodoItem *item);
TodoItem *todo_row_get_item(TodoRow *self);
```

**Signals**:
- `delete-requested`: User clicked delete button

**UI Components**:
- `GtkCheckButton`: Toggle completion
- `GtkLabel`: Display title
- `GtkButton`: Delete item

### TodoWindow (View & Controller)

**Purpose**: Main application window and primary controller.

**Responsibilities**:
- Compose UI layout
- Handle user input
- Coordinate between model and view
- Manage filters
- Update status display

**Key Methods**:
```c
GtkWidget *todo_window_new(GtkApplication *app);
TodoModel *todo_window_get_model(TodoWindow *self);
```

**Internal Methods**:
```c
static void add_todo_item(TodoWindow *self, const gchar *title);
static void update_list_view(TodoWindow *self);
static void update_status_label(TodoWindow *self);
```

**UI Layout**:
```
┌─────────────────────────────────┐
│     Header Bar (Title)          │
├─────────────────────────────────┤
│ [Entry Field......] [Add Button]│
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │  Scrolled Window            │ │
│ │  ┌─────────────────────────┐│ │
│ │  │ [ ] Buy milk       [🗑] ││ │
│ │  │ [✓] Read book      [🗑] ││ │
│ │  │ [ ] Exercise       [🗑] ││ │
│ │  └─────────────────────────┘│ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Filter: (All)(Active)(Completed)│
│ [Clear Completed]    [2/3 items]│
└─────────────────────────────────┘
```

### TodoStorage (Persistence)

**Purpose**: Handle data persistence.

**Responsibilities**:
- Determine storage location
- Serialize/deserialize to JSON
- Autosave timer
- Import/export

**Key Methods**:
```c
TodoStorage *todo_storage_new(void);
gboolean todo_storage_load(TodoStorage *self, TodoModel *model, GError **error);
gboolean todo_storage_save(TodoStorage *self, TodoModel *model, GError **error);
void todo_storage_set_autosave(TodoStorage *self, TodoModel *model, gboolean enabled);
```

**File Format** (JSON):
```json
[
  {
    "id": 1,
    "title": "Buy milk",
    "completed": false
  },
  {
    "id": 2,
    "title": "Read book",
    "completed": true
  }
]
```

## Design Decisions

### 1. GObject for Model Layer

**Decision**: Use GObject for TodoItem instead of plain structs.

**Rationale**:
- Property system provides change notifications
- Signals enable loose coupling
- Reference counting simplifies memory management
- Introspection enables language bindings
- Consistent with GTK patterns

**Trade-offs**:
- More verbose code
- Slight performance overhead
- Steeper learning curve

### 2. GListStore for Collection

**Decision**: Use GListStore instead of GList or arrays.

**Rationale**:
- Implements GListModel interface
- Automatic change notifications
- Compatible with GTK list widgets
- Type-safe
- Efficient updates

**Alternatives Considered**:
- `GList`: No change notifications, manual memory management
- `GPtrArray`: Not a list model, no automatic updates
- Custom list: Reinventing the wheel

### 3. JSON for Persistence

**Decision**: Use JSON instead of SQLite or GSettings.

**Rationale**:
- Human-readable format
- Easy to backup/edit
- Lightweight
- No database schema
- Portable across systems

**Alternatives Considered**:
- `SQLite`: Overkill for simple data, requires libsqlite3
- `GSettings`: Designed for preferences, not data
- `GKeyFile`: Less flexible than JSON
- Binary format: Not human-readable

### 4. Manual UI Construction

**Decision**: Build UI in code instead of GtkBuilder XML.

**Rationale**:
- Simpler for small UIs
- Better for demonstration
- No separate .ui files
- Easier debugging

**When to Use GtkBuilder**:
- Large, complex UIs
- Designer collaboration
- Many similar widgets
- Need UI hot-reloading

### 5. Filter in View Layer

**Decision**: Implement filtering in TodoWindow instead of model.

**Rationale**:
- UI-specific concern
- Simpler model interface
- Better performance (don't recreate filtered models)
- Clearer separation of concerns

**Trade-offs**:
- Manual list update on filter change
- Could use GtkFilterListModel for automatic filtering

## Extension Points

### Adding New Features

**1. Tags/Categories**
```c
// In TodoItem
gchar **tags;  // Array of tag strings

// In TodoModel
GListModel *filter_by_tag(const gchar *tag);

// In TodoWindow
GtkComboBox for tag selection
```

**2. Due Dates**
```c
// In TodoItem
GDateTime *due_date;

// Property
properties[PROP_DUE_DATE] = g_param_spec_boxed(...);

// In TodoRow
GtkLabel for date display
```

**3. Priority Levels**
```c
// Define enum
typedef enum {
    TODO_PRIORITY_LOW,
    TODO_PRIORITY_NORMAL,
    TODO_PRIORITY_HIGH
} TodoPriority;

// In TodoItem
TodoPriority priority;

// Visual indicator in TodoRow
```

**4. Undo/Redo**
```c
// Command pattern
typedef struct {
    void (*execute)(Command *self);
    void (*undo)(Command *self);
} Command;

// Stack for commands
GQueue *undo_stack;
GQueue *redo_stack;
```

**5. Search Functionality**
```c
// In TodoModel
GListModel *search(const gchar *query);

// In TodoWindow
GtkSearchEntry *search_entry;
```

## Performance Considerations

### Memory

- TodoItem: ~100 bytes per item
- GListStore: O(n) memory
- JSON file: ~80 bytes per item (text)
- Expected capacity: 10,000+ items

### CPU

- Add/remove item: O(1) for GListStore
- Filter: O(n) iteration
- Save/load: O(n) JSON parsing
- UI update: O(visible items) for list rebuild

### Optimizations

1. **Lazy loading**: Load UI widgets on-demand
2. **Incremental updates**: Update only changed rows
3. **Batch operations**: Group multiple changes
4. **Debounce autosave**: Delay until user pauses

## Testing Strategy

### Unit Tests

See `tests/test_todo.c`:
- TodoItem creation and properties
- TodoItem signals
- TodoModel operations
- TodoModel persistence
- Count calculations

### Integration Tests

Manual testing checklist:
- [ ] Add new todo
- [ ] Mark as complete
- [ ] Delete todo
- [ ] Filter views
- [ ] Clear completed
- [ ] Data persistence
- [ ] Keyboard shortcuts

### Memory Leak Testing

```bash
valgrind --leak-check=full ./build/todolist-gtk
```

Expected result: No leaks possible

## Deployment

### Package Structure

```
/usr/local/bin/todolist-gtk           # Executable
/usr/local/share/applications/        # Desktop file
/usr/local/share/icons/               # Icon
/usr/local/share/locale/              # Translations
/usr/local/share/todolist-gtk/        # Resources
~/.local/share/todolist-gtk/          # User data
```

### Distribution

- **Flatpak**: Sandboxed, cross-distro
- **Snap**: Universal packages
- **AppImage**: Single-file application
- **Native packages**: .deb, .rpm, AUR

## Summary

This architecture provides:
- Clear separation of concerns (MVC)
- Extensible design
- Type-safe with GObject
- Efficient data management
- Persistent storage
- Modern GTK4 patterns

Key strengths:
- Well-structured codebase
- Easy to test
- Easy to extend
- Follows GNOME conventions

For more details, see:
- [GOBJECT_GUIDE.md](GOBJECT_GUIDE.md) - Object system
- [GTK_CONCEPTS.md](GTK_CONCEPTS.md) - Widget patterns
- Source code in `src/` directory
