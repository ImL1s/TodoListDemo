# Architecture Overview

A comprehensive guide to the system architecture of the Todo List UE5 application.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Core Components](#core-components)
4. [Data Flow](#data-flow)
5. [Event System](#event-system)
6. [Persistence Layer](#persistence-layer)
7. [UI Layer](#ui-layer)
8. [Design Patterns](#design-patterns)
9. [Module Dependencies](#module-dependencies)
10. [Scalability Considerations](#scalability-considerations)
11. [Testing Strategy](#testing-strategy)
12. [Future Enhancements](#future-enhancements)

---

## System Overview

### Philosophy

The Todo List application follows a **layered architecture** with clear separation of concerns:

- **Data Layer**: Pure data structures (FTodoItem, enums)
- **Business Logic Layer**: Manager classes (UTodoManager)
- **Persistence Layer**: SaveGame system (UTodoSaveGame)
- **Presentation Layer**: UMG Widgets (WBP_MainMenu, WBP_TodoItem)

### Technology Stack

| Layer | Technology | Language |
|-------|------------|----------|
| **Data Structures** | USTRUCT, UENUM | C++ |
| **Business Logic** | UCLASS (UObject) | C++ |
| **Persistence** | USaveGame | C++ |
| **UI Base Classes** | UUserWidget | C++ |
| **UI Implementation** | Widget Blueprints | Blueprint |
| **Game Framework** | GameMode | C++ + Blueprint |

### Key Design Principles

1. **Separation of Concerns**: Data, logic, and presentation are separate
2. **Event-Driven Architecture**: Reactive UI using delegates
3. **Single Responsibility**: Each class has one job
4. **Open/Closed Principle**: Open for extension, closed for modification
5. **Dependency Inversion**: Depend on abstractions, not concretions

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      GameMode Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ATodoListUEGameMode                                    │ │
│  │  - Manages application lifecycle                        │ │
│  │  - Creates and owns TodoManager singleton              │ │
│  │  - Handles load on startup, save on shutdown           │ │
│  └─────────────────┬────────────────────────────────────────┘ │
└────────────────────┼──────────────────────────────────────────┘
                     │
                     │ owns
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  UTodoManager (UObject)                                 │ │
│  │  - Core business logic                                  │ │
│  │  - CRUD operations for todos                           │ │
│  │  - Filtering and querying                              │ │
│  │  - Event broadcasting                                   │ │
│  │  - Auto-save coordination                              │ │
│  └───┬─────────────────┬──────────────────┬───────────────┘ │
└──────┼─────────────────┼──────────────────┼─────────────────┘
       │                 │                  │
       │ manages         │ broadcasts       │ uses
       │                 │                  │
       ▼                 ▼                  ▼
┌──────────────┐  ┌─────────────┐  ┌──────────────────┐
│  Data Layer  │  │ Event Layer │  │ Persistence Layer│
│ ┌──────────┐ │  │ ┌─────────┐ │  │ ┌──────────────┐ │
│ │FTodoItem │ │  │ │Delegates│ │  │ │UTodoSaveGame │ │
│ │          │ │  │ │         │ │  │ │              │ │
│ │-Id       │ │  │ │OnTodos  │ │  │ │-SavedTodos   │ │
│ │-Title    │ │  │ │Changed  │ │  │ │-SavedFilter  │ │
│ │-Completed│ │  │ │         │ │  │ │-Timestamp    │ │
│ │-Priority │ │  │ │OnTodo   │ │  │ │              │ │
│ │-Created  │ │  │ │Added    │ │  │ │Save/Load     │ │
│ │-Tags     │ │  │ │         │ │  │ │methods       │ │
│ └──────────┘ │  │ │OnFilter │ │  │ └──────────────┘ │
│              │  │ │Changed  │ │  │                  │
│ ┌──────────┐ │  │ └─────────┘ │  └──────────────────┘
│ │ETodo     │ │  └─────────────┘
│ │Filter    │ │         │
│ │          │ │         │ listened by
│ │-All      │ │         │
│ │-Active   │ │         ▼
│ │-Completed│ │  ┌──────────────────────────────┐
│ └──────────┘ │  │     Presentation Layer       │
│              │  │  ┌────────────────────────┐  │
│ ┌──────────┐ │  │  │  UTodoWidgetBase       │  │
│ │ETodo     │ │  │  │  (Abstract C++ Base)   │  │
│ │Priority  │ │  │  │                        │  │
│ │          │ │  │  │  -InitializeWidget()   │  │
│ │-Low      │ │  │  │  -RefreshWidget()      │  │
│ │-Normal   │ │  │  │  -OnTodosChanged()     │  │
│ │-High     │ │  │  └───────┬────────────────┘  │
│ │-Critical │ │  │          │                    │
│ └──────────┘ │  │          │ inherited by       │
└──────────────┘  │          │                    │
                  │  ┌───────▼──────────┐         │
                  │  │ UTodoMainWidget  │         │
                  │  │ (C++ Subclass)   │         │
                  │  │                  │         │
                  │  │ -AddNewTodo()    │         │
                  │  │ -SetCurrentFilter│         │
                  │  │ -GetDisplayedTodos│        │
                  │  └───────┬──────────┘         │
                  │          │                    │
                  │          │ Blueprint impl     │
                  │          │                    │
                  │  ┌───────▼──────────────────┐ │
                  │  │  WBP_MainMenu             │ │
                  │  │  (Widget Blueprint)       │ │
                  │  │                           │ │
                  │  │  Designer:                │ │
                  │  │  - Layout hierarchy       │ │
                  │  │  - Visual design          │ │
                  │  │                           │ │
                  │  │  Event Graph:             │ │
                  │  │  - Button handlers        │ │
                  │  │  - Input processing       │ │
                  │  │  - List population        │ │
                  │  │  - Animations             │ │
                  │  └───────────────────────────┘ │
                  │                                │
                  │  ┌───────────────────────────┐ │
                  │  │  WBP_TodoItem             │ │
                  │  │  (Widget Blueprint)       │ │
                  │  │                           │ │
                  │  │  - Checkbox               │ │
                  │  │  - Title text             │ │
                  │  │  - Priority indicator     │ │
                  │  │  - Edit/Delete buttons    │ │
                  │  └───────────────────────────┘ │
                  └────────────────────────────────┘
```

---

## Core Components

### 1. FTodoItem (Data Structure)

**Purpose**: Represents a single todo item.

**Type**: `USTRUCT(BlueprintType)`

**Key Fields**:
- `FGuid Id`: Unique identifier
- `FString Title`: Todo text
- `bool bCompleted`: Completion status
- `ETodoPriority Priority`: Importance level
- `FDateTime CreatedAt`: Creation timestamp
- `FDateTime CompletedAt`: Completion timestamp (if completed)
- `FString Notes`: Additional details
- `TArray<FString> Tags`: Categorization tags

**Responsibilities**:
- Holds todo data
- Provides helper methods (ToggleCompleted, MatchesFilter, ToString)
- No business logic

**Relationships**:
- Used by `UTodoManager` (stored in TArray)
- Used by `UTodoSaveGame` (serialized)
- Used by UI widgets (displayed)

---

### 2. UTodoManager (Business Logic)

**Purpose**: Manages all todo operations and state.

**Type**: `UCLASS(Blueprintable, BlueprintType)`

**Base Class**: `UObject`

**Key Members**:
- `TArray<FTodoItem> Todos`: In-memory todo list
- `ETodoFilter CurrentFilter`: Active filter mode
- `bool bAutoSaveEnabled`: Auto-save flag
- Delegates: `OnTodosChanged`, `OnTodoAdded`, `OnTodoRemoved`, etc.

**Responsibilities**:
- **CRUD Operations**: Add, remove, update, toggle todos
- **Querying**: Get todos by filter, priority, search text
- **Statistics**: Calculate counts and percentages
- **Filtering**: Apply All/Active/Completed filters
- **Event Broadcasting**: Notify UI of changes
- **Persistence Coordination**: Trigger auto-save after modifications

**Key Functions**:
```cpp
// Operations
FTodoItem AddTodo(const FString& Title);
bool RemoveTodo(const FGuid& TodoId);
bool UpdateTodo(const FGuid& TodoId, const FTodoItem& UpdatedTodo);
bool ToggleTodoCompletion(const FGuid& TodoId);

// Queries
TArray<FTodoItem> GetFilteredTodos() const;
int32 GetActiveTodoCount() const;
FTodoStatistics GetStatistics() const;

// Persistence
bool SaveTodos(const FString& SlotName);
bool LoadTodos(const FString& SlotName);
```

**Relationships**:
- Owned by `ATodoListUEGameMode`
- Referenced by all widgets
- Uses `UTodoSaveGame` for persistence

---

### 3. UTodoSaveGame (Persistence)

**Purpose**: Serializes and deserializes todo data to disk.

**Type**: `UCLASS()`

**Base Class**: `USaveGame`

**Key Members**:
- `TArray<FTodoItem> SavedTodos`: Serialized todo list
- `ETodoFilter SavedFilter`: Saved filter state
- `FDateTime SaveTimestamp`: When save occurred
- `int32 SaveVersion`: Format version for compatibility

**Responsibilities**:
- Serialize todos to binary format
- Deserialize todos from binary format
- Provide save metadata (description, date)

**Persistence Flow**:
1. `UTodoManager::SaveTodos()` creates `UTodoSaveGame` instance
2. Populates with current data
3. Calls `UGameplayStatics::SaveGameToSlot()`
4. Binary file written to `Saved/SaveGames/[SlotName].sav`

**Load Flow**:
1. `UTodoManager::LoadTodos()` calls `UGameplayStatics::LoadGameFromSlot()`
2. Binary file read from disk
3. Deserialized into `UTodoSaveGame` instance
4. Data copied to `UTodoManager::Todos`

**File Location**:
- Windows: `%LOCALAPPDATA%/[ProjectName]/Saved/SaveGames/`
- macOS: `~/Library/Application Support/[ProjectName]/Saved/SaveGames/`
- Linux: `~/.config/Epic/[ProjectName]/Saved/SaveGames/`

---

### 4. ATodoListUEGameMode (Application Entry Point)

**Purpose**: Manages application lifecycle.

**Type**: `UCLASS(minimalapi)`

**Base Class**: `AGameModeBase`

**Key Members**:
- `UTodoManager* TodoManager`: Singleton manager instance
- `bool bLoadTodosOnStartup`: Config flag
- `bool bSaveTodosOnShutdown`: Config flag
- `FString SaveSlotName`: Default save slot

**Responsibilities**:
- **Initialization**: Create `UTodoManager` on `BeginPlay()`
- **Startup Load**: Load saved todos if flag enabled
- **Shutdown Save**: Save todos on `EndPlay()`
- **Singleton Access**: Provide `GetTodoManager()` for widgets

**Lifecycle**:
```
BeginPlay()
  └─> InitializeTodoManager()
      ├─> Create UTodoManager
      └─> Load saved data (if enabled)

EndPlay()
  └─> Cleanup()
      └─> Save current data (if enabled)
```

**Blueprint Integration**:
- `BP_TodoGameMode` Blueprint inherits from this C++ class
- Can override BeginPlay for custom initialization
- Set as default GameMode in Project Settings

---

### 5. UTodoWidgetBase (UI Base Class)

**Purpose**: Abstract base class for all todo widgets.

**Type**: `UCLASS(Abstract, Blueprintable)`

**Base Class**: `UUserWidget`

**Key Members**:
- `UTodoManager* TodoManager`: Reference to manager

**Responsibilities**:
- Initialize with TodoManager
- Bind to TodoManager events
- Provide virtual RefreshWidget() for subclasses
- Manage lifecycle (NativeConstruct, NativeDestruct)

**Event Binding Pattern**:
```cpp
void UTodoWidgetBase::BindToTodoEvents()
{
    if (TodoManager)
    {
        TodoManager->OnTodosChanged.AddDynamic(this, &UTodoWidgetBase::OnTodosChanged);
    }
}

void UTodoWidgetBase::OnTodosChanged()
{
    RefreshWidget();  // Virtual, overridden by subclasses
}
```

**Subclasses**:
- `UTodoMainWidget`: Main UI widget
- `UTodoItemWidget`: Individual todo item widget

---

### 6. WBP_MainMenu (Main UI Widget)

**Purpose**: Primary user interface for todo management.

**Type**: Widget Blueprint

**Parent Class**: `UTodoMainWidget` (C++)

**UI Structure**:
- **Input Section**: Editable text box + Add button
- **Filter Section**: All/Active/Completed buttons
- **List Section**: Scrollable list of todo items
- **Statistics Section**: Todo counts and percentages
- **Actions Section**: Save/Load buttons

**Key Behaviors**:
```blueprint
Event Construct
  └─> Get Game Mode → Get Todo Manager
      └─> Initialize Widget (Todo Manager)
          └─> Bind to events
              └─> Refresh display

On Add Button Clicked
  └─> Get input text
      └─> Add Todo (text)
          └─> Clear input field

On Filter Button Clicked (All/Active/Completed)
  └─> Set Current Filter (selected filter)
      └─> Refresh todo list

Event Update Todo List Display (from C++)
  └─> Clear existing items
      └─> For each filtered todo
          └─> Create WBP_TodoItem widget
              └─> Add to scroll box
```

---

### 7. WBP_TodoItem (Todo Item Widget)

**Purpose**: Displays and manages a single todo item.

**Type**: Widget Blueprint

**Parent Class**: `UTodoItemWidget` (C++)

**UI Structure**:
- **Checkbox**: Toggle completion
- **Title**: Editable text (inline editing)
- **Priority**: Color-coded indicator
- **Actions**: Edit, Delete buttons

**Key Behaviors**:
```blueprint
On Checkbox Toggled
  └─> Toggle Todo Completion (Todo ID)

On Edit Button Clicked
  └─> Enter edit mode
      └─> Enable title editing
          └─> Focus text box

On Delete Button Clicked
  └─> Delete Todo (Todo ID)
      └─> Play delete animation

On Title Committed
  └─> Edit Todo Title (Todo ID, new text)
      └─> Exit edit mode
```

---

## Data Flow

### Adding a Todo

```
User Input (WBP_MainMenu)
  │
  │ 1. User types "Buy milk" and presses Enter
  │
  ▼
Blueprint Event (WBP_MainMenu)
  │
  │ 2. OnTextCommitted event fires
  │    Gets text from input field
  │
  ▼
C++ Function Call
  │
  │ 3. Calls TodoManager->AddTodo("Buy milk")
  │
  ▼
Business Logic (UTodoManager)
  │
  │ 4. Creates FTodoItem with unique ID
  │    Adds to Todos array
  │
  ▼
Event Broadcasting
  │
  │ 5. Broadcasts OnTodoAdded(NewTodo)
  │    Broadcasts OnTodosChanged()
  │
  ▼
Auto-Save
  │
  │ 6. Triggers TriggerAutoSave()
  │    Calls SaveTodos("TodoSaveSlot")
  │
  ▼
Persistence (UTodoSaveGame)
  │
  │ 7. Serializes Todos to binary
  │    Writes to Saved/SaveGames/TodoSaveSlot.sav
  │
  ▼
UI Update (WBP_MainMenu)
  │
  │ 8. OnTodosChanged event handler fires
  │    Calls UpdateTodoListDisplay()
  │
  ▼
Widget Creation
  │
  │ 9. Clears existing todo widgets
  │    For each todo:
  │      - Creates WBP_TodoItem
  │      - Initializes with todo data
  │      - Adds to scroll box
  │
  ▼
UI Rendered
  │
  │ 10. User sees new "Buy milk" todo in list
```

### Toggling Completion

```
User Action (WBP_TodoItem)
  │
  │ 1. User clicks checkbox on todo item
  │
  ▼
Blueprint Event (WBP_TodoItem)
  │
  │ 2. OnCheckStateChanged event fires
  │
  ▼
C++ Function Call
  │
  │ 3. Calls TodoManager->ToggleTodoCompletion(TodoId)
  │
  ▼
Business Logic (UTodoManager)
  │
  │ 4. Finds todo by ID
  │    Calls Todo.ToggleCompleted()
  │    Updates bCompleted and CompletedAt
  │
  ▼
Event Broadcasting
  │
  │ 5. Broadcasts OnTodoUpdated(UpdatedTodo)
  │    Broadcasts OnTodosChanged()
  │
  ▼
Auto-Save
  │
  │ 6. Saves updated state to disk
  │
  ▼
UI Update (WBP_TodoItem)
  │
  │ 7. RefreshWidget() called
  │    Updates checkbox state
  │    Applies strike-through styling (if completed)
  │    Plays check animation
  │
  ▼
Statistics Update (WBP_MainMenu)
  │
  │ 8. OnTodosChanged handler updates stats display
  │    Recalculates completed percentage
```

---

## Event System

### Event Architecture

The application uses **dynamic multicast delegates** for event-driven communication.

### Event Types

| Event | When Fired | Parameters | Listeners |
|-------|------------|------------|-----------|
| `OnTodosChanged` | Any modification | None | All widgets |
| `OnTodoAdded` | New todo created | `FTodoItem NewTodo` | Main widget |
| `OnTodoRemoved` | Todo deleted | `FGuid TodoId` | Main widget |
| `OnTodoUpdated` | Todo modified | `FTodoItem UpdatedTodo` | Item widgets |
| `OnFilterChanged` | Filter changed | `ETodoFilter NewFilter` | Main widget |

### Event Flow Diagram

```
                  UTodoManager (Event Source)
                        │
                        │ OnTodosChanged.Broadcast()
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
  WBP_MainMenu    WBP_TodoItem    WBP_TodoItem
   (Listener)      (Listener)      (Listener)
        │               │               │
        └───────────────┴───────────────┘
                        │
                        ▼
                 RefreshWidget()
```

### Event Binding Pattern

```cpp
// C++ Widget binds to events
void UTodoWidgetBase::BindToTodoEvents()
{
    if (TodoManager)
    {
        // Bind to generic change event
        TodoManager->OnTodosChanged.AddDynamic(this, &UTodoWidgetBase::OnTodosChanged);

        // Subclasses can bind to specific events
        // TodoManager->OnTodoAdded.AddDynamic(this, &UMyWidget::OnTodoAdded);
    }
}

// Unbind on destruction to prevent dangling references
void UTodoWidgetBase::NativeDestruct()
{
    if (TodoManager)
    {
        TodoManager->OnTodosChanged.RemoveDynamic(this, &UTodoWidgetBase::OnTodosChanged);
    }
    Super::NativeDestruct();
}
```

### Benefits of Event-Driven Architecture

1. **Decoupling**: Manager doesn't know about widgets
2. **Scalability**: Easy to add new listeners
3. **Reactivity**: UI auto-updates on data changes
4. **Performance**: Update only when data changes (no polling/tick)

---

## Persistence Layer

### Save/Load Architecture

```
Application State (UTodoManager)
         │
         │ SaveTodos()
         ▼
    Create UTodoSaveGame instance
         │
         │ Populate with data
         ▼
    UGameplayStatics::SaveGameToSlot()
         │
         │ Serialize to binary
         ▼
    Disk (.sav file in Saved/SaveGames/)


Disk (.sav file)
         │
         │ LoadTodos()
         ▼
    UGameplayStatics::LoadGameFromSlot()
         │
         │ Deserialize from binary
         ▼
    UTodoSaveGame instance
         │
         │ Extract data
         ▼
    Application State (UTodoManager)
```

### Auto-Save Mechanism

```cpp
void UTodoManager::AddTodo(const FString& Title)
{
    // Modify data
    Todos.Add(FTodoItem(Title));

    // Broadcast events
    OnTodoAdded.Broadcast(NewTodo);
    OnTodosChanged.Broadcast();

    // Auto-save (if enabled)
    TriggerAutoSave();  // → SaveTodos() if bAutoSaveEnabled
}
```

**Every modification triggers auto-save**, ensuring data is never lost.

### Save File Format

**Binary format** managed by Unreal's serialization system:
- Compact and efficient
- Platform-independent
- Versioned for compatibility

**Saved Data**:
```cpp
class UTodoSaveGame
{
    TArray<FTodoItem> SavedTodos;       // All todos
    ETodoFilter SavedFilter;            // Current filter
    FDateTime SaveTimestamp;            // When saved
    int32 SaveVersion;                  // Format version
    bool bAutoSaveEnabled;              // User preference
};
```

### Save Locations by Platform

| Platform | Path |
|----------|------|
| Windows | `%LOCALAPPDATA%/TodoListUE/Saved/SaveGames/TodoSaveSlot.sav` |
| macOS | `~/Library/Application Support/TodoListUE/Saved/SaveGames/TodoSaveSlot.sav` |
| Linux | `~/.config/Epic/TodoListUE/Saved/SaveGames/TodoSaveSlot.sav` |

---

## UI Layer

### Widget Hierarchy

```
ATodoListUEGameMode (owns)
         │
         ▼
    UTodoManager (singleton)
         │
         │ referenced by
         ▼
┌──────────────────────┐
│   UTodoWidgetBase    │ (Abstract C++ Base)
│   - TodoManager ref  │
│   - InitializeWidget │
│   - RefreshWidget    │
└──────────┬───────────┘
           │
           ├─────────────────────┐
           │                     │
           ▼                     ▼
    UTodoMainWidget      UTodoItemWidget
    (C++ Subclass)       (C++ Subclass)
           │                     │
           │                     │
           ▼                     ▼
    WBP_MainMenu         WBP_TodoItem
    (Blueprint)          (Blueprint)
```

### Responsibility Separation

| Layer | Responsibility | Technology |
|-------|----------------|------------|
| **C++ Base Class** | Event binding, lifecycle, data access | C++ |
| **Blueprint** | Layout, styling, animations, UI events | Blueprint |

**Example: WBP_MainMenu**

**C++ (UTodoMainWidget.h)**:
```cpp
// Provides data access and core functions
UFUNCTION(BlueprintCallable)
void AddNewTodo(const FString& Title);

UFUNCTION(BlueprintCallable)
TArray<FTodoItem> GetDisplayedTodos() const;

// Blueprint implements visual updates
UFUNCTION(BlueprintImplementableEvent)
void UpdateTodoListDisplay();
```

**Blueprint (WBP_MainMenu)**:
```blueprint
// Implements visual behavior
Event Update Todo List Display
  └─> Clear TodoItemsContainer children
      └─> For each GetDisplayedTodos()
          └─> Create WBP_TodoItem
              └─> Add to container
```

---

## Design Patterns

### 1. Singleton Pattern

**UTodoManager** is a singleton managed by GameMode:

```cpp
// Only one instance exists per game session
UCLASS()
class AMyGameMode : public AGameModeBase
{
    UPROPERTY()
    UTodoManager* TodoManager;  // Singleton instance

    UFUNCTION(BlueprintPure)
    UTodoManager* GetTodoManager() const { return TodoManager; }
};
```

**Access from anywhere**:
```blueprint
Get Game Mode
  └─> Cast to TodoListUEGameMode
      └─> Get Todo Manager
```

### 2. Observer Pattern (Events/Delegates)

**TodoManager broadcasts events**, **widgets listen**:

```cpp
// Subject (Observable)
class UTodoManager
{
    UPROPERTY(BlueprintAssignable)
    FOnTodosChanged OnTodosChanged;  // Multicast delegate

    void AddTodo(const FString& Title)
    {
        // ... modify data ...
        OnTodosChanged.Broadcast();  // Notify observers
    }
};

// Observer
class UMyWidget : public UUserWidget
{
    void BindToEvents()
    {
        TodoManager->OnTodosChanged.AddDynamic(this, &UMyWidget::OnTodosChanged);
    }

    void OnTodosChanged()
    {
        RefreshDisplay();  // React to change
    }
};
```

### 3. Model-View Pattern

**Model**: `UTodoManager` + `FTodoItem`
- Holds data
- Implements business logic
- Independent of UI

**View**: `WBP_MainMenu` + `WBP_TodoItem`
- Displays data
- Handles user input
- Observes model for changes

**Communication**:
- View → Model: Direct function calls (e.g., `AddTodo()`)
- Model → View: Events (e.g., `OnTodosChanged`)

### 4. Factory Pattern

**Widget creation** uses factory pattern:

```blueprint
// Factory method
Function CreateTodoItemWidget (Todo: FTodoItem) Returns UTodoItemWidget
  ├─> Create Widget (Class: WBP_TodoItem)
  ├─> Set Todo Item (Todo)
  ├─> Initialize Widget (TodoManager)
  └─> Return widget

// Usage
For Each Todo
  └─> Create Todo Item Widget (Todo)
      └─> Add to container
```

### 5. Template Method Pattern

**UTodoWidgetBase** defines template:

```cpp
class UTodoWidgetBase : public UUserWidget
{
public:
    void InitializeWidget(UTodoManager* Manager)
    {
        TodoManager = Manager;
        BindToTodoEvents();      // Step 1
        OnWidgetInitialized();   // Step 2 (hook for subclasses)
        RefreshWidget();         // Step 3 (virtual, overridden)
    }

protected:
    virtual void OnWidgetInitialized() {}
    virtual void RefreshWidget() = 0;  // Pure virtual
};
```

**Subclasses override specific steps**:
```cpp
class UTodoMainWidget : public UTodoWidgetBase
{
    virtual void RefreshWidget() override
    {
        // Custom refresh logic for main widget
    }
};
```

---

## Module Dependencies

### Dependency Graph

```
TodoListUE (Game Module)
    │
    ├─> Core (Unreal Core)
    │   └─ FString, TArray, FGuid, etc.
    │
    ├─> CoreUObject (Object System)
    │   └─ UObject, UCLASS, UPROPERTY, etc.
    │
    ├─> Engine (Game Framework)
    │   └─ GameMode, SaveGame, GameplayStatics
    │
    └─> UMG (UI Framework)
        └─ UUserWidget, UMG widgets
```

**TodoListUE.Build.cs**:
```csharp
PublicDependencyModuleNames.AddRange(new string[] {
    "Core",
    "CoreUObject",
    "Engine",
    "UMG",
    "Slate",
    "SlateCore"
});
```

### Class Dependencies

```
ATodoListUEGameMode
    └─> UTodoManager
        ├─> FTodoItem (owns)
        ├─> UTodoSaveGame (uses)
        └─> Delegates (broadcasts)

UTodoWidgetBase
    └─> UTodoManager (references)

WBP_MainMenu
    ├─> UTodoManager (uses)
    └─> WBP_TodoItem (creates)

WBP_TodoItem
    ├─> FTodoItem (displays)
    └─> UTodoManager (calls methods)
```

**No circular dependencies**: Clean, maintainable architecture.

---

## Scalability Considerations

### Current Scale

- **Target**: 100-1000 todos
- **Performance**: Sub-millisecond operations
- **Memory**: ~1 KB per todo (100 todos = ~100 KB)

### Scaling to 10,000+ Todos

**Challenges**:
1. Loading 10,000 widgets would be slow
2. Memory usage would increase
3. Save/load time would increase

**Solutions**:

#### 1. Virtual Scrolling (Widget Pooling)

Instead of creating 10,000 widgets, create only visible ones:

```cpp
// Scrolling TodoList with only 10 visible items at a time
class UVirtualTodoList : public UUserWidget
{
    TArray<UTodoItemWidget*> WidgetPool;  // Reusable widgets
    int32 VisibleItemCount = 10;

    void UpdateVisibleItems(int32 ScrollOffset)
    {
        for (int32 i = 0; i < VisibleItemCount; ++i)
        {
            int32 TodoIndex = ScrollOffset + i;
            if (Todos.IsValidIndex(TodoIndex))
            {
                WidgetPool[i]->SetTodoItem(Todos[TodoIndex]);
                WidgetPool[i]->SetVisibility(ESlateVisibility::Visible);
            }
            else
            {
                WidgetPool[i]->SetVisibility(ESlateVisibility::Collapsed);
            }
        }
    }
};
```

**Result**: Only 10 widgets in memory, regardless of todo count.

#### 2. Lazy Loading

Load todos in chunks:

```cpp
void LoadTodosInChunks(int32 ChunkSize = 100)
{
    // Load only first chunk initially
    // Load more chunks as user scrolls
}
```

#### 3. Database Backend

For very large datasets, replace SaveGame with SQLite:

```cpp
// Use SQLite plugin for UE5
class UTodoDatabaseManager
{
    void SaveTodoToDatabase(const FTodoItem& Todo);
    TArray<FTodoItem> QueryTodos(const FTodoQuery& Query);
};
```

### Multi-User Considerations

**Current**: Single-user, local storage

**Future**: Multi-user, cloud sync

**Architecture Changes**:
1. Add `FString UserId` to todos
2. Implement cloud save/load (REST API, Firebase, etc.)
3. Add conflict resolution (last-write-wins, operational transform, etc.)
4. Add authentication (Epic Online Services, Steam, custom)

---

## Testing Strategy

### Unit Testing (C++)

Test business logic in isolation:

```cpp
// TodoManagerTests.cpp
#include "CoreMinimal.h"
#include "Misc/AutomationTest.h"
#include "TodoManager.h"

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FTodoManagerAddTest, "TodoListUE.TodoManager.AddTodo", EAutomationTestFlags::ApplicationContextMask | EAutomationTestFlags::ProductFilter)

bool FTodoManagerAddTest::RunTest(const FString& Parameters)
{
    UTodoManager* Manager = NewObject<UTodoManager>();

    // Test adding a todo
    FTodoItem NewTodo = Manager->AddTodo(TEXT("Test Todo"));
    TestEqual("Todo count should be 1", Manager->GetTodoCount(), 1);
    TestEqual("Todo title should match", NewTodo.Title, TEXT("Test Todo"));

    return true;
}
```

### Blueprint Testing

Test UI behavior:

```blueprint
// Test_AddTodo Blueprint
Event BeginPlay
  ├─> Create Widget (WBP_MainMenu)
  ├─> Simulate Input ("Test Todo")
  ├─> Click Add Button
  ├─> Assert Todo Count == 1
  └─> Print "Test Passed"
```

### Integration Testing

Test full workflows:
1. Open app
2. Add todo
3. Toggle completion
4. Save and quit
5. Reopen app
6. Verify todo persists

### Performance Testing

```cpp
// Benchmark adding 1000 todos
double StartTime = FPlatformTime::Seconds();

for (int32 i = 0; i < 1000; ++i)
{
    TodoManager->AddTodo(FString::Printf(TEXT("Todo %d"), i));
}

double EndTime = FPlatformTime::Seconds();
UE_LOG(LogTemp, Log, TEXT("Added 1000 todos in %.3f seconds"), EndTime - StartTime);
```

---

## Future Enhancements

### 1. Undo/Redo

**Architecture**:
```cpp
class UTodoCommand
{
    virtual void Execute() = 0;
    virtual void Undo() = 0;
};

class UAddTodoCommand : public UTodoCommand
{
    FGuid AddedTodoId;

    void Execute() override { /* Add todo */ }
    void Undo() override { /* Remove todo by ID */ }
};

class UTodoCommandHistory
{
    TArray<UTodoCommand*> UndoStack;
    TArray<UTodoCommand*> RedoStack;

    void ExecuteCommand(UTodoCommand* Command);
    void Undo();
    void Redo();
};
```

### 2. Categories/Projects

**Data**:
```cpp
USTRUCT()
struct FTodoCategory
{
    FGuid Id;
    FString Name;
    FLinearColor Color;
};

// Add to FTodoItem
UPROPERTY()
FGuid CategoryId;
```

**UI**: Separate tabs or sections per category.

### 3. Recurring Todos

**Data**:
```cpp
UENUM()
enum class ERecurrencePattern : uint8
{
    None,
    Daily,
    Weekly,
    Monthly
};

UPROPERTY()
ERecurrencePattern Recurrence;

UPROPERTY()
FDateTime NextOccurrence;
```

**Logic**: When completed, create next occurrence.

### 4. Cloud Sync

**Architecture**:
```cpp
class UTodoCloudSyncManager
{
    void UploadTodos(const TArray<FTodoItem>& Todos);
    void DownloadTodos(TArray<FTodoItem>& OutTodos);
    void Sync();  // Merge local and remote changes
};
```

**Integration**: Use REST API (HTTP module) or Firebase plugin.

### 5. Collaborative Editing

**Architecture**: Operational Transformation or CRDT for conflict-free replicated data.

### 6. Mobile Support

**UI Changes**:
- Larger touch targets
- Swipe gestures (swipe to delete)
- Responsive layout for small screens

**Input**: Support touch events in addition to mouse/keyboard.

---

## Conclusion

The Todo List UE5 application demonstrates a **clean, scalable architecture** with:

- **Layered design**: Separation of data, logic, and presentation
- **Event-driven communication**: Reactive UI via delegates
- **Hybrid C++/Blueprint**: Best of both worlds
- **Persistent state**: Reliable save/load system
- **Extensibility**: Easy to add new features

**Key Takeaways**:
1. Use C++ for core logic and data structures
2. Use Blueprint for UI behavior and rapid iteration
3. Use events for decoupled communication
4. Design for scalability from the start
5. Follow Unreal best practices and coding standards

**Next Steps**:
- Explore the codebase
- Experiment with adding features
- Apply these patterns to your own projects

---

**Happy Building!** 🏗️
