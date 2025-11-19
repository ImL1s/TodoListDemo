# C++ and Blueprint Integration Guide

A comprehensive guide to understanding and using the C++ and Blueprint interoperability features in the Todo List UE5 project.

## Table of Contents

1. [Introduction to C++/Blueprint Workflow](#introduction-to-cblueprint-workflow)
2. [Unreal Reflection System](#unreal-reflection-system)
3. [UCLASS Macro](#uclass-macro)
4. [UPROPERTY Macro](#uproperty-macro)
5. [UFUNCTION Macro](#ufunction-macro)
6. [USTRUCT and UENUM](#ustruct-and-uenum)
7. [Event Dispatchers (Delegates)](#event-dispatchers-delegates)
8. [Blueprint Function Libraries](#blueprint-function-libraries)
9. [Blueprint Implementable Events](#blueprint-implementable-events)
10. [Best Practices](#best-practices)
11. [Common Patterns](#common-patterns)
12. [Performance Considerations](#performance-considerations)
13. [Debugging C++ from Blueprint](#debugging-c-from-blueprint)
14. [Migration Strategies](#migration-strategies)

---

## Introduction to C++/Blueprint Workflow

### Philosophy

Unreal Engine 5 allows developers to use C++ and Blueprint together seamlessly:

- **C++ for Performance**: Core logic, data structures, algorithms
- **Blueprint for Flexibility**: UI behavior, level-specific logic, rapid iteration
- **Hybrid Approach**: Expose C++ to Blueprint for the best of both worlds

### When to Use C++ vs Blueprint

| Use Case | C++ | Blueprint | Hybrid |
|----------|-----|-----------|--------|
| Core data structures | ✅ | ❌ | - |
| Complex algorithms | ✅ | ❌ | - |
| UI layout | ❌ | ✅ | - |
| UI behavior | - | - | ✅ |
| Game logic | ✅ | - | ✅ |
| Prototyping | ❌ | ✅ | - |
| Performance-critical | ✅ | ❌ | - |
| Designer-friendly | ❌ | ✅ | - |

### Todo List Project Architecture

Our project demonstrates the hybrid approach:

```
C++ Layer (Core Logic)
├── TodoItem.h          - Data structures (USTRUCT)
├── TodoManager.h/cpp   - Business logic (UCLASS)
├── TodoSaveGame.h/cpp  - Persistence (UCLASS)
└── TodoWidgetBase.h/cpp - Widget base classes (UCLASS)

Blueprint Layer (UI & Behavior)
├── BP_TodoGameMode     - Game mode configuration
├── WBP_MainMenu        - Main UI widget
├── WBP_TodoItem        - Individual todo item widget
└── Level Blueprints    - Level-specific setup
```

**Data Flow**:
1. C++ defines data structures (`FTodoItem`)
2. C++ implements business logic (`UTodoManager`)
3. C++ exposes functions to Blueprint (`UFUNCTION`)
4. Blueprint implements UI (`WBP_MainMenu`)
5. Blueprint calls C++ functions (e.g., `AddTodo()`)
6. C++ broadcasts events (`OnTodosChanged`)
7. Blueprint responds to events (`RefreshWidget()`)

---

## Unreal Reflection System

Unreal's reflection system is the magic that enables C++/Blueprint interoperability.

### What is Reflection?

Reflection allows the engine to:
- Inspect classes, properties, and functions at runtime
- Serialize objects for saving/loading
- Expose C++ to the Blueprint VM
- Provide editor integration (Details panel, etc.)

### How It Works

1. **Unreal Header Tool (UHT)**: Parses your header files before compilation
2. **Generates Metadata**: Creates `.generated.h` files with reflection data
3. **Macros**: `UCLASS()`, `UPROPERTY()`, `UFUNCTION()`, etc. mark elements for reflection
4. **Engine Integration**: Metadata is used at runtime and in the editor

### Key Concepts

#### Generated Header Files

Every header with reflection macros needs:

```cpp
// TodoManager.h
#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "TodoManager.generated.h"  // ALWAYS last include!

UCLASS()
class TODOLISTUE_API UTodoManager : public UObject
{
    GENERATED_BODY()  // Inserts generated code

public:
    // Your code here
};
```

**Rules**:
1. `#include "ClassName.generated.h"` must be the **last include**
2. `GENERATED_BODY()` must be the **first line** in the class body
3. Header file must be parseable by UHT (no complex templates in reflection)

#### Module API Macro

`TODOLISTUE_API` is a DLL export macro:
- Required for classes/functions accessible from other modules
- Auto-generated based on module name (TodoListUE → TODOLISTUE_API)
- Omit for internal-only classes

---

## UCLASS Macro

`UCLASS()` marks a C++ class for reflection, making it visible to Blueprint.

### Basic Syntax

```cpp
UCLASS()
class TODOLISTUE_API UMyClass : public UObject
{
    GENERATED_BODY()
};
```

### Common Specifiers

#### Blueprintable

Allows Blueprint classes to inherit from this C++ class.

```cpp
UCLASS(Blueprintable)
class TODOLISTUE_API UTodoManager : public UObject
{
    GENERATED_BODY()
};
```

**Usage in Editor**:
1. Content Browser → Right-click → Blueprint Class
2. Select `UTodoManager` as parent
3. Create `BP_TodoManager`

#### BlueprintType

Allows this class to be used as a variable type in Blueprint.

```cpp
UCLASS(BlueprintType)
class TODOLISTUE_API UTodoWidget : public UUserWidget
{
    GENERATED_BODY()
};
```

**Blueprint Usage**:
```blueprint
// Variables tab
Variable Name: MyTodoWidget
Variable Type: TodoWidget (Object Reference)
```

#### Abstract

Prevents direct instantiation (must inherit first).

```cpp
UCLASS(Abstract)
class TODOLISTUE_API UTodoWidgetBase : public UUserWidget
{
    GENERATED_BODY()
};
```

#### Config

Allows properties to be saved to config files (`.ini`).

```cpp
UCLASS(Config=Game)
class TODOLISTUE_API UMyGameSettings : public UObject
{
    GENERATED_BODY()

    UPROPERTY(Config)
    bool bAutoSave;
};
```

**Saved to**: `Config/DefaultGame.ini`

#### Category and DisplayName

```cpp
UCLASS(BlueprintType, Category="Todo System", DisplayName="Todo Manager")
class TODOLISTUE_API UTodoManager : public UObject
{
    GENERATED_BODY()
};
```

### Todo List Project Examples

```cpp
// TodoManager.h - Blueprintable, can be referenced in BP
UCLASS(Blueprintable, BlueprintType)
class TODOLISTUE_API UTodoManager : public UObject
{
    GENERATED_BODY()
};

// TodoWidgetBase.h - Abstract base class
UCLASS(Abstract, Blueprintable)
class TODOLISTUE_API UTodoWidgetBase : public UUserWidget
{
    GENERATED_BODY()
};

// TodoMainWidget.h - Concrete widget class
UCLASS()
class TODOLISTUE_API UTodoMainWidget : public UTodoWidgetBase
{
    GENERATED_BODY()
};
```

---

## UPROPERTY Macro

`UPROPERTY()` exposes C++ variables to Blueprint and the editor.

### Basic Syntax

```cpp
UPROPERTY()
int32 MyNumber;
```

### Access Specifiers

#### EditAnywhere

Editable in Details panel and Blueprint defaults.

```cpp
UPROPERTY(EditAnywhere, Category="Todo")
FString Title;
```

**Use Case**: Public configuration that can be changed anywhere.

#### EditDefaultsOnly

Editable only in Blueprint defaults (not on instances).

```cpp
UPROPERTY(EditDefaultsOnly, Category="Config")
bool bAutoSave;
```

**Use Case**: Class-level defaults that shouldn't change per-instance.

#### EditInstanceOnly

Editable only on placed instances (not in Blueprint defaults).

```cpp
UPROPERTY(EditInstanceOnly, Category="Instance")
FVector SpawnLocation;
```

**Use Case**: Per-instance overrides (rare in UI applications).

#### VisibleAnywhere / VisibleDefaultsOnly / VisibleInstanceOnly

Same as Edit*, but read-only.

```cpp
UPROPERTY(VisibleAnywhere, Category="Stats")
int32 TotalTodos;
```

#### BlueprintReadWrite

Can be read AND written from Blueprint.

```cpp
UPROPERTY(BlueprintReadWrite, Category="Todo")
bool bCompleted;
```

**Blueprint Access**:
- Get node: Returns value
- Set node: Assigns value

#### BlueprintReadOnly

Can be read but not written from Blueprint.

```cpp
UPROPERTY(BlueprintReadOnly, Category="Todo")
FGuid Id;
```

**Blueprint Access**:
- Get node: Returns value
- Set node: Not available

### Combined Specifiers

```cpp
// Editable everywhere, accessible in Blueprint
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Todo")
FString Title;

// Visible in editor, read-only in Blueprint
UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Stats")
int32 CompletedCount;

// Blueprint-only (not shown in Details panel)
UPROPERTY(BlueprintReadWrite, Category="Runtime")
bool bIsEditMode;

// C++-only (not visible to Blueprint or editor)
UPROPERTY()
TArray<FTodoItem> InternalCache;
```

### Special Specifiers

#### Category

Organizes properties in Details panel.

```cpp
UPROPERTY(EditAnywhere, Category="Todo|Display")
FLinearColor PriorityColor;
```

#### Meta

Provides additional editor hints.

```cpp
// Clamp value between 0 and 100
UPROPERTY(EditAnywhere, meta=(ClampMin="0", ClampMax="100"))
float CompletionPercentage;

// Multi-line text box
UPROPERTY(EditAnywhere, meta=(MultiLine=true))
FString Notes;

// Requires specific conditions
UPROPERTY(EditAnywhere, meta=(EditCondition="bEnabled"))
int32 MaxItems;
```

#### Transient

Not saved to disk (runtime only).

```cpp
UPROPERTY(Transient)
bool bIsInitialized;
```

#### SaveGame

Saved when using SaveGame system.

```cpp
UCLASS()
class UTodoSaveGame : public USaveGame
{
    GENERATED_BODY()

    UPROPERTY(SaveGame)  // Will be serialized
    TArray<FTodoItem> SavedTodos;

    UPROPERTY()  // Will NOT be serialized
    FDateTime LoadTime;
};
```

### Todo List Project Examples

```cpp
// TodoItem.h
USTRUCT(BlueprintType)
struct FTodoItem
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Todo")
    FString Title;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Todo")
    bool bCompleted;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Todo")
    FGuid Id;
};

// TodoManager.h
UCLASS(Blueprintable, BlueprintType)
class UTodoManager : public UObject
{
    GENERATED_BODY()

private:
    // C++-only, not exposed to Blueprint
    UPROPERTY()
    TArray<FTodoItem> Todos;

    // Visible in editor, read-only in Blueprint
    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category="Settings", meta=(AllowPrivateAccess="true"))
    bool bAutoSaveEnabled;
};
```

**Note**: `meta=(AllowPrivateAccess="true")` allows Blueprint access to private properties.

---

## UFUNCTION Macro

`UFUNCTION()` exposes C++ functions to Blueprint.

### Basic Syntax

```cpp
UFUNCTION()
void MyFunction();
```

### Blueprint Callable

Function can be **called** from Blueprint.

```cpp
UFUNCTION(BlueprintCallable, Category="Todo")
void AddTodo(const FString& Title);
```

**Blueprint Usage**:
- Drag from node → "Add Todo"
- Execution pin (white triangle)
- Input pin for Title

#### Example with Return Value

```cpp
UFUNCTION(BlueprintCallable, Category="Todo")
int32 GetTodoCount() const;
```

**Blueprint**:
- Has execution pins AND return value pin

### Blueprint Pure

Function can be **called** from Blueprint, but has **no execution pins** (must be const or have no side effects).

```cpp
UFUNCTION(BlueprintPure, Category="Todo")
int32 GetActiveTodoCount() const;
```

**Blueprint Usage**:
- NO execution pins (white triangles)
- Can be called anywhere in expression
- More efficient (no execution cost)

**Rules for Pure**:
- Should be `const` in C++
- Should not modify state
- Should be fast (called frequently)

#### BlueprintPure vs BlueprintCallable

```cpp
// WRONG: Pure function modifying state
UFUNCTION(BlueprintPure)
void AddTodo(const FString& Title);  // ❌ Modifies state!

// CORRECT: Callable function modifying state
UFUNCTION(BlueprintCallable)
void AddTodo(const FString& Title);  // ✅ Has execution pins

// CORRECT: Pure function for query
UFUNCTION(BlueprintPure)
int32 GetTodoCount() const;  // ✅ No side effects
```

### Blueprint Implementable Event

Function **defined in C++**, **implemented in Blueprint**.

```cpp
// TodoWidgetBase.h
UFUNCTION(BlueprintImplementableEvent, Category="Todo")
void UpdateTodoListDisplay();
```

**C++ Calls**:
```cpp
// TodoWidgetBase.cpp
void UTodoWidgetBase::OnTodosChanged()
{
    UpdateTodoListDisplay();  // Calls Blueprint implementation
}
```

**Blueprint Implements**:
1. Open Widget Blueprint
2. Event Graph → Right-click → "Event Update Todo List Display"
3. Implement logic

**Note**: No C++ body needed (implementation is in Blueprint).

### Blueprint Native Event

Function **defined and implemented in C++**, **optionally overridden in Blueprint**.

```cpp
// Header
UFUNCTION(BlueprintNativeEvent, Category="Todo")
void RefreshWidget();
virtual void RefreshWidget_Implementation();

// CPP
void UTodoWidgetBase::RefreshWidget_Implementation()
{
    // C++ default implementation
    UE_LOG(LogTemp, Log, TEXT("Refreshing widget"));
}
```

**Blueprint Override**:
1. Event Graph → Right-click → "Event Refresh Widget"
2. Implement custom logic
3. Optionally call "Parent: Refresh Widget" to invoke C++ version

**Rules**:
- Function name in C++: `RefreshWidget_Implementation()`
- Function name in BP: `RefreshWidget`
- Always declare both the event and `_Implementation` function

### Meta Specifiers

#### AutoCreateRefTerm

Allows passing literals to reference parameters.

```cpp
UFUNCTION(BlueprintCallable, meta=(AutoCreateRefTerm="Tags"))
void AddTodoWithTags(const FString& Title, const TArray<FString>& Tags);
```

**Blueprint**: Can pass empty array directly without creating a variable.

#### DisplayName

Changes the node name in Blueprint.

```cpp
UFUNCTION(BlueprintCallable, meta=(DisplayName="Get Number of Todos"))
int32 GetTodoCount() const;
```

#### Keywords

Adds search keywords for finding the node.

```cpp
UFUNCTION(BlueprintCallable, meta=(Keywords="count total number"))
int32 GetTodoCount() const;
```

#### CompactNodeTitle

Shows a compact version of the node.

```cpp
UFUNCTION(BlueprintPure, meta=(CompactNodeTitle="+"))
int32 Add(int32 A, int32 B) const;
```

### Todo List Project Examples

```cpp
// TodoManager.h

// Callable: Modifies state, has execution pins
UFUNCTION(BlueprintCallable, Category="Todo|Operations")
FTodoItem AddTodo(const FString& Title);

// Pure: Query only, no execution pins
UFUNCTION(BlueprintPure, Category="Todo|Query")
int32 GetTodoCount() const { return Todos.Num(); }

// Callable with output parameter
UFUNCTION(BlueprintCallable, Category="Todo|Query")
bool GetTodoById(const FGuid& TodoId, FTodoItem& OutTodo) const;

// TodoWidgetBase.h

// Native Event: C++ implementation, Blueprint can override
UFUNCTION(BlueprintNativeEvent, Category="Todo|Widget")
void RefreshWidget();
virtual void RefreshWidget_Implementation();

// Implementable Event: Blueprint-only implementation
UFUNCTION(BlueprintImplementableEvent, Category="Todo|Widget")
void OnTodosChanged();
```

---

## USTRUCT and UENUM

### USTRUCT - Structures

`USTRUCT()` makes C++ structs visible to Blueprint.

#### Basic Struct

```cpp
USTRUCT(BlueprintType)
struct FTodoItem
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Title;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    bool bCompleted;
};
```

**Blueprint Usage**:
- Can be used as variable type
- Can access members via "Break" node
- Can construct via "Make" node

#### Constructors in Structs

```cpp
USTRUCT(BlueprintType)
struct FTodoItem
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Title;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    bool bCompleted;

    // Default constructor
    FTodoItem()
        : Title(TEXT(""))
        , bCompleted(false)
    {
    }

    // Parameterized constructor
    FTodoItem(const FString& InTitle)
        : Title(InTitle)
        , bCompleted(false)
    {
    }
};
```

**Note**: Constructors are not directly callable from Blueprint, but default values apply.

#### Member Functions in Structs

```cpp
USTRUCT(BlueprintType)
struct FTodoItem
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    bool bCompleted;

    // Member function (C++ only, not exposed to BP)
    void ToggleCompleted()
    {
        bCompleted = !bCompleted;
    }
};
```

**Blueprint Alternative**: Use a Blueprint Function Library or class method.

### UENUM - Enumerations

`UENUM()` makes C++ enums visible to Blueprint.

#### Basic Enum

```cpp
UENUM(BlueprintType)
enum class ETodoFilter : uint8
{
    All         UMETA(DisplayName="All Todos"),
    Active      UMETA(DisplayName="Active Only"),
    Completed   UMETA(DisplayName="Completed Only")
};
```

**Blueprint Usage**:
- Dropdown selection in Details panel
- Switch/Select nodes in Blueprint
- Comparison nodes (==, !=)

#### UMETA Specifiers

```cpp
UENUM(BlueprintType)
enum class ETodoPriority : uint8
{
    Low         UMETA(DisplayName="Low Priority", ToolTip="Not urgent"),
    Normal      UMETA(DisplayName="Normal", ToolTip="Standard priority"),
    High        UMETA(DisplayName="High Priority", ToolTip="Important!"),
    Critical    UMETA(DisplayName="CRITICAL", ToolTip="Do immediately!")
};
```

- **DisplayName**: Name shown in editor/Blueprint
- **ToolTip**: Hover tooltip
- **Hidden**: Hide from selection lists

#### Using Enums in Functions

```cpp
UFUNCTION(BlueprintCallable, Category="Todo")
void SetFilter(ETodoFilter NewFilter);

UFUNCTION(BlueprintPure, Category="Todo")
ETodoFilter GetCurrentFilter() const;
```

**Blueprint**: Enum shows as dropdown in node pins.

### Todo List Project Examples

```cpp
// TodoItem.h

// Enum for filters
UENUM(BlueprintType)
enum class ETodoFilter : uint8
{
    All,
    Active,
    Completed
};

// Enum for priority
UENUM(BlueprintType)
enum class ETodoPriority : uint8
{
    Low,
    Normal,
    High,
    Critical
};

// Struct for todo item
USTRUCT(BlueprintType)
struct FTodoItem
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Todo")
    FGuid Id;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Todo")
    FString Title;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Todo")
    bool bCompleted;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Todo")
    ETodoPriority Priority;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category="Todo")
    FDateTime CreatedAt;

    // Constructors (C++ only)
    FTodoItem();
    FTodoItem(const FString& InTitle);
    FTodoItem(const FString& InTitle, ETodoPriority InPriority);

    // Member functions (C++ only, can be exposed via UFUNCTION in a class)
    void ToggleCompleted();
    bool MatchesFilter(ETodoFilter Filter) const;
    FString ToString() const;
};

// Struct for statistics
USTRUCT(BlueprintType)
struct FTodoStatistics
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 TotalTodos;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 CompletedTodos;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 ActiveTodos;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    float CompletionPercentage;
};
```

---

## Event Dispatchers (Delegates)

Delegates are Unreal's event system, allowing C++ to notify Blueprint (and vice versa).

### Types of Delegates

| Type | Signature | Use Case |
|------|-----------|----------|
| **Single-cast** | `DECLARE_DELEGATE` | One listener, C++ only |
| **Multi-cast** | `DECLARE_MULTICAST_DELEGATE` | Multiple listeners, C++ only |
| **Dynamic Single-cast** | `DECLARE_DYNAMIC_DELEGATE` | One listener, BP-compatible |
| **Dynamic Multi-cast** | `DECLARE_DYNAMIC_MULTICAST_DELEGATE` | Multiple listeners, BP-compatible |

### Dynamic Multicast Delegates (Most Common)

Used for events that Blueprint can listen to.

#### Declaring

```cpp
// TodoManager.h

// Delegate with no parameters
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnTodosChanged);

// Delegate with parameters
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTodoAdded, const FTodoItem&, NewTodo);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTodoRemoved, const FGuid&, TodoId);

UCLASS()
class UTodoManager : public UObject
{
    GENERATED_BODY()

public:
    UPROPERTY(BlueprintAssignable, Category="Todo|Events")
    FOnTodosChanged OnTodosChanged;

    UPROPERTY(BlueprintAssignable, Category="Todo|Events")
    FOnTodoAdded OnTodoAdded;

    UPROPERTY(BlueprintAssignable, Category="Todo|Events")
    FOnTodoRemoved OnTodoRemoved;
};
```

#### Broadcasting (C++)

```cpp
// TodoManager.cpp
void UTodoManager::AddTodo(const FString& Title)
{
    FTodoItem NewTodo(Title);
    Todos.Add(NewTodo);

    // Broadcast events
    OnTodoAdded.Broadcast(NewTodo);
    OnTodosChanged.Broadcast();
}
```

#### Binding in C++

```cpp
// TodoWidgetBase.cpp
void UTodoWidgetBase::BindToTodoEvents()
{
    if (TodoManager)
    {
        TodoManager->OnTodosChanged.AddDynamic(this, &UTodoWidgetBase::OnTodosChangedHandler);
    }
}

void UTodoWidgetBase::OnTodosChangedHandler()
{
    RefreshWidget();
}
```

#### Binding in Blueprint

1. **Get TodoManager reference**
2. **Drag from TodoManager** → "Assign On Todos Changed"
3. **Connect to custom event** or directly to function

```blueprint
Event Construct
  └─> Get Todo Manager
      └─> Assign On Todos Changed
          └─> Create Event "Handle Todos Changed"
              └─> Refresh Widget
```

### Delegate Parameters

```cpp
// No parameters
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnEvent);

// One parameter
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnIntEvent, int32, Value);

// Two parameters
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnTodoEvent, const FTodoItem&, Todo, bool, bSuccess);

// Three parameters
DECLARE_DYNAMIC_MULTICAST_DELEGATE_ThreeParams(...);

// Four+ parameters (up to 9)
DECLARE_DYNAMIC_MULTICAST_DELEGATE_FourParams(...);
```

### BlueprintAssignable vs BlueprintCallable

```cpp
// BlueprintAssignable: Blueprint can bind to it
UPROPERTY(BlueprintAssignable)
FOnTodosChanged OnTodosChanged;

// BlueprintCallable: Blueprint can broadcast it (rare)
UPROPERTY(BlueprintCallable)
FOnCustomEvent OnCustomEvent;
```

**Typical Pattern**: Use `BlueprintAssignable` for events C++ broadcasts and Blueprint listens to.

### Todo List Project Examples

```cpp
// TodoManager.h

// Event delegates
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnTodosChanged);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTodoAdded, const FTodoItem&, NewTodo);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTodoRemoved, const FGuid&, TodoId);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnTodoUpdated, const FTodoItem&, UpdatedTodo);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnFilterChanged, ETodoFilter, NewFilter);

UCLASS(Blueprintable, BlueprintType)
class TODOLISTUE_API UTodoManager : public UObject
{
    GENERATED_BODY()

public:
    UPROPERTY(BlueprintAssignable, Category="Todo|Events")
    FOnTodosChanged OnTodosChanged;

    UPROPERTY(BlueprintAssignable, Category="Todo|Events")
    FOnTodoAdded OnTodoAdded;

    UPROPERTY(BlueprintAssignable, Category="Todo|Events")
    FOnTodoRemoved OnTodoRemoved;

    UPROPERTY(BlueprintAssignable, Category="Todo|Events")
    FOnTodoUpdated OnTodoUpdated;

    UPROPERTY(BlueprintAssignable, Category="Todo|Events")
    FOnFilterChanged OnFilterChanged;

    // Functions that broadcast events
    UFUNCTION(BlueprintCallable, Category="Todo")
    void AddTodo(const FString& Title);

    UFUNCTION(BlueprintCallable, Category="Todo")
    void SetFilter(ETodoFilter NewFilter);
};
```

**Usage in Blueprint**:
```blueprint
// WBP_MainMenu - Event Graph

Event Construct
  └─> Get Todo Manager
      ├─> Assign On Todos Changed
      │   └─> Refresh Todo List
      ├─> Assign On Filter Changed
      │   └─> Update Filter Buttons
      └─> Assign On Todo Added
          └─> Play Add Animation
```

---

## Blueprint Function Libraries

Static utility functions accessible from Blueprint without needing an object instance.

### Creating a Function Library

```cpp
// TodoBlueprintLibrary.h
#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "TodoItem.h"
#include "TodoBlueprintLibrary.generated.h"

UCLASS()
class TODOLISTUE_API UTodoBlueprintLibrary : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

public:
    /** Get formatted date string from FDateTime */
    UFUNCTION(BlueprintPure, Category="Todo|Utilities")
    static FString GetFormattedDate(const FDateTime& DateTime);

    /** Get color for priority level */
    UFUNCTION(BlueprintPure, Category="Todo|Utilities")
    static FLinearColor GetPriorityColor(ETodoPriority Priority);

    /** Check if todo matches search text */
    UFUNCTION(BlueprintPure, Category="Todo|Utilities")
    static bool TodoMatchesSearch(const FTodoItem& Todo, const FString& SearchText, bool bCaseSensitive);
};
```

```cpp
// TodoBlueprintLibrary.cpp
#include "TodoBlueprintLibrary.h"

FString UTodoBlueprintLibrary::GetFormattedDate(const FDateTime& DateTime)
{
    return DateTime.ToString(TEXT("%Y-%m-%d %H:%M"));
}

FLinearColor UTodoBlueprintLibrary::GetPriorityColor(ETodoPriority Priority)
{
    switch (Priority)
    {
    case ETodoPriority::Low:
        return FLinearColor(0.7f, 0.7f, 0.7f);  // Gray
    case ETodoPriority::Normal:
        return FLinearColor::White;
    case ETodoPriority::High:
        return FLinearColor(1.0f, 0.65f, 0.0f);  // Orange
    case ETodoPriority::Critical:
        return FLinearColor(1.0f, 0.23f, 0.19f);  // Red
    default:
        return FLinearColor::White;
    }
}

bool UTodoBlueprintLibrary::TodoMatchesSearch(const FTodoItem& Todo, const FString& SearchText, bool bCaseSensitive)
{
    if (bCaseSensitive)
    {
        return Todo.Title.Contains(SearchText);
    }
    else
    {
        return Todo.Title.ToLower().Contains(SearchText.ToLower());
    }
}
```

### Using in Blueprint

```blueprint
// Can be called anywhere without needing an object reference

Get Priority Color (Priority: High)
  └─> Set Brush Color
```

**Advantages**:
- No object reference needed
- Reusable across all Blueprints
- Cleaner Blueprint graphs

---

## Blueprint Implementable Events

Functions that C++ defines and Blueprint implements.

### When to Use

- UI behavior that varies per widget
- Level-specific logic
- Allowing designers to customize without C++ changes

### Pattern: C++ Calls, Blueprint Implements

```cpp
// TodoWidgetBase.h
UCLASS(Abstract, Blueprintable)
class UTodoWidgetBase : public UUserWidget
{
    GENERATED_BODY()

protected:
    /** Blueprint implements this to update the UI */
    UFUNCTION(BlueprintImplementableEvent, Category="Todo|Widget")
    void UpdateTodoListDisplay();

    /** C++ calls this when todos change */
    UFUNCTION()
    void OnTodosChanged();
};
```

```cpp
// TodoWidgetBase.cpp
void UTodoWidgetBase::OnTodosChanged()
{
    // C++ can do some processing
    UE_LOG(LogTemp, Log, TEXT("Todos changed, refreshing UI"));

    // Then call Blueprint implementation
    UpdateTodoListDisplay();
}
```

**Blueprint (WBP_MainMenu)**:
```blueprint
Event Update Todo List Display
  ├─> Clear Children (TodoItemsContainer)
  ├─> Get Filtered Todos
  └─> For Each Todo
      ├─> Create Widget (WBP_TodoItem)
      └─> Add Child to Panel
```

### Native Events (Hybrid Approach)

For functions where you want both C++ default implementation AND Blueprint override ability:

```cpp
// Header
UFUNCTION(BlueprintNativeEvent, Category="Todo")
void RefreshWidget();
virtual void RefreshWidget_Implementation();

// CPP
void UTodoWidgetBase::RefreshWidget_Implementation()
{
    // C++ default implementation
    UE_LOG(LogTemp, Verbose, TEXT("Base RefreshWidget"));
}
```

**Blueprint**:
- Can override "Event Refresh Widget"
- Can call "Parent: Refresh Widget" to invoke C++ version
- If not overridden, C++ version runs automatically

---

## Best Practices

### 1. Const Correctness

```cpp
// GOOD: Const reference for input, const method for queries
UFUNCTION(BlueprintPure, Category="Todo")
int32 GetActiveTodoCount() const;

UFUNCTION(BlueprintCallable, Category="Todo")
bool GetTodoById(const FGuid& TodoId, FTodoItem& OutTodo) const;

// BAD: Non-const query method
UFUNCTION(BlueprintPure, Category="Todo")
int32 GetActiveTodoCount();  // ❌ Should be const
```

### 2. Naming Conventions

```cpp
// Classes
UCLASS()
class UMyClass : public UObject {};  // U prefix for UObject-derived

USTRUCT()
struct FMyStruct {};  // F prefix for structs

UENUM()
enum class EMyEnum : uint8 {};  // E prefix for enums

// Variables
UPROPERTY()
bool bIsEnabled;  // b prefix for bool

UPROPERTY()
int32 NumItems;  // Num prefix for counts

UPROPERTY()
FString CurrentName;  // PascalCase
```

### 3. Category Organization

```cpp
// Hierarchical categories with |
UFUNCTION(BlueprintCallable, Category="Todo|Operations|Add")
void AddTodo(const FString& Title);

UFUNCTION(BlueprintCallable, Category="Todo|Operations|Remove")
void RemoveTodo(const FGuid& Id);

UFUNCTION(BlueprintPure, Category="Todo|Query|Counts")
int32 GetTodoCount() const;
```

### 4. Access Control

```cpp
UCLASS()
class UTodoManager : public UObject
{
    GENERATED_BODY()

public:
    // Public API for Blueprint
    UFUNCTION(BlueprintCallable, Category="Todo")
    void AddTodo(const FString& Title);

protected:
    // Protected: Only this class and children
    UPROPERTY(BlueprintReadOnly, Category="Todo", meta=(AllowPrivateAccess="true"))
    TArray<FTodoItem> Todos;

private:
    // Private: C++ only
    void InternalCleanup();
};
```

### 5. Blueprint vs Native Events

```cpp
// Use BlueprintImplementableEvent when:
// - No C++ implementation needed
// - Blueprint MUST provide implementation
UFUNCTION(BlueprintImplementableEvent)
void OnCustomUIEvent();

// Use BlueprintNativeEvent when:
// - C++ provides default behavior
// - Blueprint CAN override if needed
UFUNCTION(BlueprintNativeEvent)
void RefreshWidget();
virtual void RefreshWidget_Implementation();
```

### 6. Output Parameters

```cpp
// GOOD: Clear output parameter
UFUNCTION(BlueprintCallable, Category="Todo")
bool GetTodoById(const FGuid& Id, FTodoItem& OutTodo) const;

// ALSO GOOD: Return struct directly (small structs)
UFUNCTION(BlueprintPure, Category="Todo")
FTodoStatistics GetStatistics() const;

// BAD: Pointer parameters (avoid in Blueprint-exposed functions)
void GetTodoById(const FGuid& Id, FTodoItem* OutTodo);  // ❌
```

### 7. Default Parameter Values

```cpp
// C++ header
UFUNCTION(BlueprintCallable, Category="Todo")
bool SaveTodos(const FString& SlotName = TEXT("TodoSaveSlot"));

// Blueprint sees this as optional pin
```

### 8. Return Value Optimization

```cpp
// For small types: Return by value
UFUNCTION(BlueprintPure)
int32 GetCount() const { return Todos.Num(); }

// For large types: Return const reference (C++) or output param (Blueprint)
const TArray<FTodoItem>& GetAllTodos() const { return Todos; }  // C++ only

UFUNCTION(BlueprintCallable)
TArray<FTodoItem> GetFilteredTodos() const;  // Blueprint (copies array)
```

---

## Common Patterns

### Pattern 1: Manager Singleton

```cpp
// GameMode holds singleton manager
UCLASS()
class AMyGameMode : public AGameModeBase
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintPure, Category="Todo")
    UTodoManager* GetTodoManager() const { return TodoManager; }

private:
    UPROPERTY()
    UTodoManager* TodoManager;
};
```

**Blueprint Access**:
```blueprint
Get Game Mode
  └─> Cast to MyGameMode
      └─> Get Todo Manager
          └─> Add Todo
```

### Pattern 2: Event-Driven UI

```cpp
// C++ broadcasts events
void UTodoManager::AddTodo(const FString& Title)
{
    Todos.Add(FTodoItem(Title));
    OnTodosChanged.Broadcast();  // UI listens to this
}

// Widget binds to events
void UTodoWidget::InitializeWidget(UTodoManager* Manager)
{
    Manager->OnTodosChanged.AddDynamic(this, &UTodoWidget::RefreshDisplay);
}
```

### Pattern 3: Data Binding

```cpp
// C++ provides getter
UFUNCTION(BlueprintPure, Category="Stats")
int32 GetActiveTodoCount() const;

// Blueprint binds text to function
// TextBlock → Text → Bind → Create Binding → Get Active Todo Count
```

### Pattern 4: Factory Pattern

```cpp
// C++ factory method
UFUNCTION(BlueprintCallable, Category="Todo")
static UMyWidget* CreateTodoWidget(UObject* WorldContext, TSubclassOf<UMyWidget> WidgetClass);

// Blueprint calls factory instead of "Create Widget" directly
```

---

## Performance Considerations

### 1. Pure Functions Are Called Frequently

```cpp
// ❌ BAD: Expensive pure function
UFUNCTION(BlueprintPure)
TArray<FTodoItem> GetSortedTodos() const
{
    TArray<FTodoItem> Sorted = Todos;
    Sorted.Sort(...);  // Expensive!
    return Sorted;
}

// ✅ GOOD: Cache result, or make it Callable instead of Pure
TArray<FTodoItem> CachedSortedTodos;

UFUNCTION(BlueprintCallable)
const TArray<FTodoItem>& GetSortedTodos()
{
    if (bNeedsSort)
    {
        CachedSortedTodos = Todos;
        CachedSortedTodos.Sort(...);
        bNeedsSort = false;
    }
    return CachedSortedTodos;
}
```

### 2. Pass by Const Reference

```cpp
// ❌ BAD: Pass by value (copies string)
UFUNCTION(BlueprintCallable)
void AddTodo(FString Title);

// ✅ GOOD: Pass by const reference (no copy)
UFUNCTION(BlueprintCallable)
void AddTodo(const FString& Title);
```

**Note**: Blueprint doesn't care (it copies anyway), but C++ callers benefit.

### 3. Avoid Tick in Blueprint

```cpp
// ❌ BAD: Updating UI every tick
Event Tick
  └─> Get Todo Count
      └─> Set Text

// ✅ GOOD: Update only when data changes
Event Construct
  └─> Todo Manager → On Todos Changed
      └─> Update Display
```

### 4. TArray Reserve

```cpp
// ✅ GOOD: Reserve capacity if size is known
void PopulateTodos()
{
    TArray<FTodoItem> NewTodos;
    NewTodos.Reserve(ExpectedCount);  // Avoid reallocations

    for (int32 i = 0; i < ExpectedCount; ++i)
    {
        NewTodos.Add(FTodoItem(...));
    }
}
```

---

## Debugging C++ from Blueprint

### 1. Logging

```cpp
// In C++
UE_LOG(LogTemp, Log, TEXT("AddTodo called with: %s"), *Title);
UE_LOG(LogTemp, Warning, TEXT("Warning message"));
UE_LOG(LogTemp, Error, TEXT("Error message"));
```

**View Logs**:
- Editor: Window → Developer Tools → Output Log
- Packaged: `Saved/Logs/ProjectName.log`

### 2. Blueprint Breakpoints

1. Open Blueprint
2. Click on node → Set Breakpoint (F9)
3. Play in Editor
4. Execution pauses at breakpoint
5. Inspect variable values

### 3. C++ Breakpoints

1. Open Visual Studio
2. Set breakpoint in .cpp file (F9)
3. Debug → Attach to Process → UnrealEditor.exe
4. Play in Editor
5. Breakpoint hits

### 4. Print String

```blueprint
// Blueprint node
Print String (In String: "Debug message")
```

Shows text on screen and in output log.

---

## Migration Strategies

### Blueprint to C++

When prototyping in Blueprint, you may want to migrate to C++ for performance.

#### Step 1: Identify Logic to Migrate

- Performance-critical loops
- Complex calculations
- Data structures

#### Step 2: Create C++ Function

```cpp
// Before (Blueprint only)
Event Tick
  └─> For Each Todo
      └─> If Todo.bCompleted
          └─> Increment CompletedCount

// After (C++)
UFUNCTION(BlueprintPure, Category="Todo")
int32 GetCompletedTodoCount() const
{
    int32 Count = 0;
    for (const FTodoItem& Todo : Todos)
    {
        if (Todo.bCompleted)
        {
            Count++;
        }
    }
    return Count;
}
```

#### Step 3: Replace Blueprint Calls

```blueprint
// Old
For Each → If Completed → Increment

// New
Get Completed Todo Count
```

### C++ to Blueprint

Rare, but useful for allowing designers to customize.

#### Step 1: Expose via BlueprintNativeEvent

```cpp
// Before (C++ only)
void RefreshWidget()
{
    // Fixed implementation
}

// After (Exposable to BP)
UFUNCTION(BlueprintNativeEvent, Category="Widget")
void RefreshWidget();

void RefreshWidget_Implementation()
{
    // Default implementation (can be overridden in BP)
}
```

#### Step 2: Override in Blueprint

1. Create BP child class
2. Override "Event Refresh Widget"
3. Implement custom logic

---

## Conclusion

C++ and Blueprint integration in Unreal Engine 5 is powerful and flexible. Key takeaways:

1. **Use C++ for Core Logic**: Data structures, business logic, performance-critical code
2. **Use Blueprint for UI & Behavior**: Visual layout, animations, level-specific logic
3. **Expose Strategically**: Only expose what Blueprint needs via UFUNCTION/UPROPERTY
4. **Use Events for Reactivity**: Delegates enable clean event-driven architecture
5. **Follow Naming Conventions**: U/A/F/E prefixes, booleans start with 'b', etc.
6. **Optimize**: const correctness, pass by reference, avoid pure functions with side effects
7. **Debug Effectively**: Use UE_LOG, Blueprint breakpoints, and Visual Studio debugger

**Next Steps**:
- Read [UMG_GUIDE.md](./UMG_GUIDE.md) for UI development details
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design overview
- Experiment with the Todo List project to see these patterns in action

---

**Happy Coding!** 🚀
