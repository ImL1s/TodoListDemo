# Unreal Engine 5 Best Practices Guide

A comprehensive guide to following Unreal Engine 5 best practices in the Todo List project.

## Table of Contents

1. [C++ Coding Standards](#c-coding-standards)
2. [Memory Management](#memory-management)
3. [Performance Optimization](#performance-optimization)
4. [Blueprint Best Practices](#blueprint-best-practices)
5. [UMG Widget Optimization](#umg-widget-optimization)
6. [Naming Conventions](#naming-conventions)
7. [Code Organization](#code-organization)
8. [Testing and Debugging](#testing-and-debugging)
9. [Version Control](#version-control)
10. [Security Considerations](#security-considerations)

---

## C++ Coding Standards

### Follow Epic's Coding Standard

The Todo List project adheres to [Epic's C++ Coding Standard](https://docs.unrealengine.com/5.3/en-US/epic-cplusplus-coding-standard-for-unreal-engine/).

Key points:

#### Class Naming Prefixes

```cpp
// ✅ CORRECT: Proper prefixes
class UMyObject : public UObject {};          // U prefix for UObject-derived
class AMyActor : public AActor {};            // A prefix for AActor-derived
class FMyStruct {};                           // F prefix for structs
class IMyInterface {};                        // I prefix for interfaces
enum class EMyEnum : uint8 {};                // E prefix for enums
template<typename T> class TMyTemplate {};    // T prefix for templates

// ❌ WRONG: Missing or incorrect prefixes
class MyObject : public UObject {};
class Actor : public AActor {};
```

#### Booleans

```cpp
// ✅ CORRECT: b prefix for booleans
bool bIsCompleted;
bool bAutoSaveEnabled;
bool bHasUnsavedChanges;

// ❌ WRONG: No prefix
bool IsCompleted;
bool AutoSaveEnabled;
```

#### Member Variables

```cpp
class UTodoManager : public UObject
{
private:
    // ✅ CORRECT: Private members, descriptive names
    TArray<FTodoItem> Todos;
    ETodoFilter CurrentFilter;
    bool bAutoSaveEnabled;

    // ❌ WRONG: Hungarian notation, unclear names
    TArray<FTodoItem> m_Todos;
    ETodoFilter m_filter;
    bool m_bFlag;
};
```

---

### Const Correctness

**Mark functions const when they don't modify state**:

```cpp
class UTodoManager : public UObject
{
public:
    // ✅ GOOD: Const member functions
    int32 GetTodoCount() const { return Todos.Num(); }
    TArray<FTodoItem> GetAllTodos() const { return Todos; }
    bool DoesSaveGameExist(const FString& SlotName) const;

    // ✅ GOOD: Const parameters for input
    FTodoItem AddTodo(const FString& Title);
    bool UpdateTodo(const FGuid& TodoId, const FTodoItem& UpdatedTodo);
};
```

**Return const references when possible**:

```cpp
// ✅ GOOD: Return const reference (no copy)
const TArray<FTodoItem>& GetTodos() const { return Todos; }

// ❌ AVOID: Return by value (copies entire array)
TArray<FTodoItem> GetTodos() const { return Todos; }

// ⚠️ DANGEROUS: Return non-const reference (can be modified)
TArray<FTodoItem>& GetTodos() { return Todos; }
```

---

### Auto Keyword Usage

```cpp
// ✅ GOOD: Use auto for iterators and complex types
for (auto It = Todos.CreateIterator(); It; ++It)
{
    // ...
}

auto* GameMode = Cast<ATodoListUEGameMode>(GetWorld()->GetAuthGameMode());

// ✅ GOOD: Be explicit for simple types
int32 Count = Todos.Num();
FString Title = Todo.Title;

// ❌ BAD: Overuse makes code unclear
auto x = 5;  // What type is x?
```

---

### nullptr vs NULL

```cpp
// ✅ CORRECT: Always use nullptr in UE5
UTodoManager* Manager = nullptr;
if (Manager != nullptr) { }

// ❌ WRONG: Don't use NULL or 0
UTodoManager* Manager = NULL;
if (Manager != 0) { }
```

---

## Memory Management

### UObject Garbage Collection

**Always use UPROPERTY() for UObject pointers**:

```cpp
class UTodoWidget : public UUserWidget
{
    GENERATED_BODY()

    // ✅ CORRECT: Managed by GC
    UPROPERTY()
    UTodoManager* TodoManager;

    // ❌ WRONG: Can be garbage collected unexpectedly!
    UTodoManager* TodoManager;
};
```

### Smart Pointers

**Use TSharedPtr for non-UObject shared ownership**:

```cpp
// ✅ GOOD: Use smart pointers for non-UObjects
TSharedPtr<FMyData> SharedData = MakeShared<FMyData>();

// Pass to functions
void ProcessData(TSharedRef<FMyData> Data);  // Non-null guaranteed
void MaybeProcessData(TSharedPtr<FMyData> Data);  // Can be null
```

**Use TWeakPtr to avoid circular references**:

```cpp
class FMyClass
{
    TSharedPtr<FMyData> StrongRef;  // Keeps object alive
    TWeakPtr<FMyData> WeakRef;      // Doesn't keep object alive

    void UseWeakRef()
    {
        TSharedPtr<FMyData> PinnedRef = WeakRef.Pin();
        if (PinnedRef.IsValid())
        {
            // Safe to use
            PinnedRef->DoSomething();
        }
    }
};
```

**Use TUniquePtr for unique ownership**:

```cpp
// ✅ GOOD: Only one owner, auto-deletes
TUniquePtr<FMyData> UniqueData = MakeUnique<FMyData>();

// Cannot be copied, only moved
TUniquePtr<FMyData> MovedData = MoveTemp(UniqueData);
// UniqueData is now null
```

### Array Management

**Reserve capacity when size is known**:

```cpp
// ✅ GOOD: Reserve space to avoid reallocations
TArray<FTodoItem> Todos;
Todos.Reserve(100);
for (int32 i = 0; i < 100; ++i)
{
    Todos.Add(FTodoItem());  // No reallocation
}

// ❌ INEFFICIENT: Multiple reallocations
TArray<FTodoItem> Todos;
for (int32 i = 0; i < 100; ++i)
{
    Todos.Add(FTodoItem());  // May reallocate multiple times
}
```

**Use Emplace instead of Add when possible**:

```cpp
// ✅ BETTER: Construct in-place (no copy)
Todos.Emplace(FTodoItem(TEXT("New Todo")));

// ❌ LESS EFFICIENT: Construct then copy
Todos.Add(FTodoItem(TEXT("New Todo")));
```

---

## Performance Optimization

### Avoid Tick When Possible

```cpp
// ❌ BAD: Tick every frame
virtual void Tick(float DeltaTime) override
{
    UpdateTodoList();  // Called every frame!
}

// ✅ GOOD: Event-driven updates
void InitializeWidget()
{
    TodoManager->OnTodosChanged.AddDynamic(this, &UTodoWidget::UpdateTodoList);
}

void UpdateTodoList()
{
    // Only called when todos actually change
}
```

### Cache Frequently Accessed Data

```cpp
// ❌ BAD: Repeated expensive lookups
void UpdateUI()
{
    int32 Count1 = GetGameMode()->GetTodoManager()->GetTodoCount();
    int32 Count2 = GetGameMode()->GetTodoManager()->GetTodoCount();
    int32 Count3 = GetGameMode()->GetTodoManager()->GetTodoCount();
}

// ✅ GOOD: Cache the reference
void UpdateUI()
{
    UTodoManager* Manager = GetGameMode()->GetTodoManager();
    if (Manager)
    {
        int32 Count = Manager->GetTodoCount();
        // Use Count multiple times
    }
}
```

### Use Move Semantics

```cpp
// ✅ GOOD: Move large objects instead of copying
TArray<FTodoItem> LoadedTodos = LoadTodosFromFile();
Todos = MoveTemp(LoadedTodos);  // Move, not copy

// ✅ GOOD: Move-construct
FTodoItem NewTodo = CreateTodo();
Todos.Add(MoveTemp(NewTodo));  // Move into array
```

### Optimize String Operations

```cpp
// ❌ BAD: Multiple allocations
FString Result = TEXT("");
for (const FTodoItem& Todo : Todos)
{
    Result += Todo.Title;  // Reallocates each time
    Result += TEXT(", ");
}

// ✅ GOOD: StringBuilder pattern
TArray<FString> Titles;
Titles.Reserve(Todos.Num());
for (const FTodoItem& Todo : Todos)
{
    Titles.Add(Todo.Title);
}
FString Result = FString::Join(Titles, TEXT(", "));
```

### Use Fast Iteration

```cpp
// ✅ FASTEST: Range-based for loop (when you don't need index)
for (const FTodoItem& Todo : Todos)
{
    ProcessTodo(Todo);
}

// ✅ FAST: Indexed access
for (int32 i = 0; i < Todos.Num(); ++i)
{
    ProcessTodo(Todos[i]);
}

// ❌ SLOWER: Function calls in loop condition
for (int32 i = 0; i < Todos.Num(); ++i)  // Num() called each iteration
```

---

## Blueprint Best Practices

### Minimize Tick Usage

```blueprint
// ❌ BAD: Tick every frame
Event Tick
  └─> Update Todo Count Text

// ✅ GOOD: Event-driven
Event Construct
  └─> Bind Event to On Todos Changed
      └─> Update Todo Count Text
```

### Use Pure Functions for Getters

```cpp
// ✅ GOOD: BlueprintPure for read-only functions
UFUNCTION(BlueprintPure, Category="Todo")
int32 GetTodoCount() const { return Todos.Num(); }

// ❌ WRONG: BlueprintCallable for getters (creates exec pin)
UFUNCTION(BlueprintCallable, Category="Todo")
int32 GetTodoCount() const { return Todos.Num(); }
```

### Prefer C++ for Performance-Critical Code

| Operation | C++ | Blueprint | Reason |
|-----------|-----|-----------|--------|
| Complex math | ✅ | ❌ | C++ is 10-100x faster |
| Large loops | ✅ | ❌ | Blueprint very slow for iteration |
| UI layout | ❌ | ✅ | UMG Designer is visual |
| UI logic | ⚠️ | ✅ | Blueprint easier to iterate |
| Data structures | ✅ | ❌ | C++ has better data structures |

### Avoid Magic Numbers

```blueprint
// ❌ BAD: Magic numbers in Blueprint
Set Priority (2)  // What does 2 mean?

// ✅ GOOD: Use enums
Set Priority (ETodoPriority::High)
```

---

## UMG Widget Optimization

### Widget Pooling

**Reuse widgets instead of creating new ones**:

```cpp
// Widget pool implementation
class UTodoMainWidget : public UUserWidget
{
private:
    UPROPERTY()
    TArray<UTodoItemWidget*> WidgetPool;

    UTodoItemWidget* GetOrCreateWidget()
    {
        if (WidgetPool.Num() > 0)
        {
            return WidgetPool.Pop();  // Reuse
        }
        return CreateWidget<UTodoItemWidget>(this, WidgetClass);
    }

    void ReturnWidgetToPool(UTodoItemWidget* Widget)
    {
        Widget->SetVisibility(ESlateVisibility::Collapsed);
        WidgetPool.Add(Widget);
    }
};
```

### Minimize Bindings

```cpp
// ❌ BAD: Binding recalculates every frame
Function GetTodoCountText (Binding)
  └─> Expensive Calculation

// ✅ GOOD: Update only when data changes
On Todos Changed
  └─> Calculate Count
      └─> Set Text (Count)
```

### Use Collapsed Instead of Hidden

```cpp
// ✅ GOOD: Removed from layout
SetVisibility(ESlateVisibility::Collapsed);

// ❌ LESS EFFICIENT: Still in layout calculations
SetVisibility(ESlateVisibility::Hidden);
```

### Invalidation

```cpp
// Invalidate only what changed
Invalidate(EInvalidateWidgetReason::Layout);       // Layout changed
Invalidate(EInvalidateWidgetReason::Paint);        // Visual changed
Invalidate(EInvalidateWidgetReason::LayoutAndVolatility);  // Both
```

---

## Naming Conventions

### Files

| Type | Prefix | Example |
|------|--------|---------|
| Class Header | - | `TodoManager.h` |
| Class Source | - | `TodoManager.cpp` |
| Widget Blueprint | `WBP_` | `WBP_MainMenu.uasset` |
| Blueprint Class | `BP_` | `BP_TodoGameMode.uasset` |
| Material | `M_` | `M_UIBackground.uasset` |
| Texture | `T_` | `T_Icon_Check.uasset` |
| Data Table | `DT_` | `DT_TodoPriorities.uasset` |

### Variables

```cpp
// Member variables: PascalCase
FString Title;
int32 Count;
bool bIsCompleted;  // b prefix for booleans

// Local variables: PascalCase or camelCase
int32 LocalCount;
FString TempTitle;

// Constants: PascalCase with k prefix (optional)
const int32 MaxTodos = 1000;
const FString kDefaultSaveSlot = TEXT("TodoSaveSlot");
static const int32 CurrentSaveVersion = 1;
```

### Functions

```cpp
// Functions: PascalCase, verb-based
void AddTodo(const FString& Title);
void RemoveTodo(const FGuid& Id);
bool ToggleTodoCompletion(const FGuid& Id);

// Getters: Get prefix
int32 GetTodoCount() const;
FTodoItem GetTodoById(const FGuid& Id) const;

// Setters: Set prefix
void SetCurrentFilter(ETodoFilter Filter);
void SetAutoSave(bool bEnabled);

// Boolean queries: Is/Has/Can prefix
bool IsCompleted() const;
bool HasUnsavedChanges() const;
bool CanSaveTodos() const;
```

---

## Code Organization

### Header File Structure

```cpp
// TodoManager.h
#pragma once

// 1. Standard includes
#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"

// 2. Forward declarations
class UTodoSaveGame;

// 3. Project includes
#include "TodoItem.h"

// 4. Generated header (ALWAYS LAST)
#include "TodoManager.generated.h"

// 5. Delegates (before class)
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnTodosChanged);

// 6. Class declaration
UCLASS()
class TODOLISTUE_API UTodoManager : public UObject
{
    GENERATED_BODY()

public:
    // Public interface

protected:
    // Protected members

private:
    // Private implementation
};
```

### Source File Structure

```cpp
// TodoManager.cpp

// 1. Own header first (catches missing includes)
#include "TodoManager.h"

// 2. Project headers
#include "TodoSaveGame.h"

// 3. Engine headers
#include "Kismet/GameplayStatics.h"

// 4. Standard library (avoid if possible)
#include <algorithm>

// Static member initialization
const FString UTodoManager::DefaultSaveSlot = TEXT("TodoSaveSlot");

// Constructor
UTodoManager::UTodoManager()
{
}

// Public methods
void UTodoManager::AddTodo(const FString& Title)
{
}

// Protected methods
void UTodoManager::BroadcastChanges()
{
}

// Private methods
int32 UTodoManager::FindTodoIndexById(const FGuid& Id) const
{
}
```

---

## Testing and Debugging

### Logging

```cpp
// Use UE_LOG for debugging
UE_LOG(LogTemp, Log, TEXT("Added todo: %s"), *Title);
UE_LOG(LogTemp, Warning, TEXT("Failed to load save game"));
UE_LOG(LogTemp, Error, TEXT("Invalid todo ID: %s"), *Id.ToString());

// Create custom log categories
DECLARE_LOG_CATEGORY_EXTERN(LogTodoList, Log, All);

// In .cpp file
DEFINE_LOG_CATEGORY(LogTodoList);

// Use custom category
UE_LOG(LogTodoList, Log, TEXT("Todo count: %d"), Count);
```

### Assertions

```cpp
// Use check() for critical errors
check(TodoManager != nullptr);

// Use ensure() for recoverable errors (logs but continues)
if (!ensure(Todos.IsValidIndex(Index)))
{
    return false;
}

// Use checkf() and ensureMsgf() for formatted messages
checkf(bIsInitialized, TEXT("TodoManager not initialized!"));
ensureMsgf(SlotName.Len() > 0, TEXT("Empty save slot name"));
```

### Debugging Tools

**Visual Studio Debugger**:
```cpp
// Set breakpoints in C++
// Attach to UnrealEditor.exe
// Step through code (F10, F11)
```

**Blueprint Debugger**:
- Open Blueprint
- Set breakpoints on nodes
- Play in Editor
- Inspector shows variable values

**Console Commands**:
```cpp
// Register console commands for testing
static FAutoConsoleCommand CmdAddTestTodos(
    TEXT("Todo.AddTestTodos"),
    TEXT("Adds 10 test todos"),
    FConsoleCommandDelegate::CreateLambda([]()
    {
        // Add test todos
    })
);
```

---

## Version Control

### .gitignore

Essential entries for Unreal projects:

```gitignore
# Compiled binaries
Binaries/
DerivedDataCache/

# Build files
Build/
Intermediate/

# Visual Studio files
.vs/
*.sln
*.vcxproj
*.vcxproj.filters
*.vcxproj.user

# Saved data (configs OK, logs not)
Saved/Logs/
Saved/Crashes/
Saved/Autosaves/

# Keep these saved files
!Saved/Config/
!Saved/SaveGames/
```

### Commit Messages

Follow conventional commit format:

```
feat: Add priority filtering to todo list
fix: Correct save game serialization
docs: Update Blueprint creation guide
refactor: Simplify todo deletion logic
test: Add unit tests for TodoManager
chore: Update .gitignore
```

---

## Security Considerations

### Input Validation

```cpp
// ✅ GOOD: Validate input
FTodoItem UTodoManager::AddTodo(const FString& Title)
{
    // Validate title is not empty
    if (Title.IsEmpty())
    {
        UE_LOG(LogTemp, Warning, TEXT("Cannot add todo with empty title"));
        return FTodoItem();  // Return invalid item
    }

    // Validate title length
    if (Title.Len() > 500)
    {
        UE_LOG(LogTemp, Warning, TEXT("Title too long: %d chars"), Title.Len());
        return FTodoItem();
    }

    // Add the todo
    FTodoItem NewTodo(Title);
    Todos.Add(NewTodo);
    return NewTodo;
}
```

### Save File Versioning

```cpp
// Version your save data
UCLASS()
class UTodoSaveGame : public USaveGame
{
    GENERATED_BODY()

    UPROPERTY()
    int32 SaveVersion;

    static const int32 CurrentSaveVersion = 1;

    bool IsCompatible() const
    {
        return SaveVersion == CurrentSaveVersion;
    }
};

// Handle version migrations
bool UTodoManager::LoadTodos(const FString& SlotName)
{
    auto* SaveGame = Cast<UTodoSaveGame>(UGameplayStatics::LoadGameFromSlot(SlotName, 0));

    if (!SaveGame->IsCompatible())
    {
        UE_LOG(LogTemp, Warning, TEXT("Incompatible save version: %d"), SaveGame->SaveVersion);
        // Migrate or reject
        return false;
    }

    // Load data
}
```

---

## Performance Profiling

### Unreal Insights

```bash
# Enable tracing
UnrealEditor.exe -trace=default

# Open Unreal Insights
UnrealInsights.exe
```

### stat Commands

```
stat FPS         # Show frame rate
stat Unit        # Show frame time breakdown
stat Memory      # Show memory usage
stat SceneRendering  # Show rendering stats
```

### CPU Profiling

```cpp
// Add scoped timers
SCOPE_CYCLE_COUNTER(STAT_TodoManager_AddTodo);

void UTodoManager::AddTodo(const FString& Title)
{
    // Function automatically timed
}
```

---

## Checklist

Before committing code, verify:

- [ ] No compilation warnings
- [ ] Follows naming conventions
- [ ] All pointers checked for null
- [ ] UPROPERTY used for UObject pointers
- [ ] Const correctness applied
- [ ] No magic numbers
- [ ] Logging added for errors
- [ ] Comments for complex logic
- [ ] No performance regressions
- [ ] Tested in PIE (Play-in-Editor)
- [ ] Blueprint compiles without errors

---

## Additional Resources

- [Epic's Coding Standard](https://docs.unrealengine.com/5.3/en-US/epic-cplusplus-coding-standard-for-unreal-engine/)
- [Performance Guidelines](https://docs.unrealengine.com/5.3/en-US/performance-guidelines-for-unreal-engine/)
- [Garbage Collection](https://docs.unrealengine.com/5.3/en-US/unreal-object-handling-in-unreal-engine/)

---

**Last Updated**: 2025-11-19
