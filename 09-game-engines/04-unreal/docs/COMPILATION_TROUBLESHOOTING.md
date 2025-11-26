# Unreal Engine 5 Compilation Troubleshooting Guide

A comprehensive guide to resolving common compilation errors in the Todo List UE5 project.

## Table of Contents

1. [Common C++ Compilation Errors](#common-c-compilation-errors)
2. [Linker Errors](#linker-errors)
3. [Reflection System Errors](#reflection-system-errors)
4. [Module Dependency Errors](#module-dependency-errors)
5. [Blueprint Compilation Errors](#blueprint-compilation-errors)
6. [Platform-Specific Issues](#platform-specific-issues)
7. [Best Practices](#best-practices)

---

## Common C++ Compilation Errors

### Error: "Cannot open include file"

**Full Error**:
```
fatal error C1083: Cannot open include file: 'TodoManager.h': No such file or directory
```

**Cause**: Missing or incorrect include path, or file doesn't exist.

**Solutions**:

1. **Verify file exists**:
   ```bash
   # Check if file exists in correct location
   ls Source/TodoListUE/TodoManager.h
   ```

2. **Check include statement**:
   ```cpp
   // ✅ CORRECT: Use quotes for project files
   #include "TodoManager.h"

   // ❌ WRONG: Don't use angle brackets for project files
   #include <TodoManager.h>
   ```

3. **Rebuild project files**:
   - Windows: Right-click `.uproject` → Generate Visual Studio project files
   - Delete `.sln`, `.vcxproj`, and `Intermediate/` folder, then regenerate

4. **Check module dependencies in Build.cs**:
   ```csharp
   // TodoListUE.Build.cs
   PublicDependencyModuleNames.AddRange(new string[] {
       "Core",
       "CoreUObject",
       "Engine",
       // Add any missing modules here
   });
   ```

---

### Error: "Identifier not found"

**Full Error**:
```
error C2065: 'FTodoItem': undeclared identifier
```

**Cause**: Missing forward declaration or include.

**Solutions**:

1. **Add missing include**:
   ```cpp
   // TodoManager.cpp
   #include "TodoManager.h"
   #include "TodoItem.h"  // Add this if FTodoItem is used
   ```

2. **Use forward declaration in header** (preferred for pointers/references):
   ```cpp
   // TodoManager.h
   class UTodoSaveGame;  // Forward declaration

   // Only include in .cpp file
   #include "TodoSaveGame.h"
   ```

3. **Check for circular dependencies**:
   - A.h includes B.h
   - B.h includes A.h
   - **Solution**: Use forward declarations in headers, includes in .cpp

---

### Error: ".generated.h must be last include"

**Full Error**:
```
error: TodoManager.generated.h must be the last include in header
```

**Cause**: `.generated.h` is not the last `#include` in the header file.

**Solution**:

```cpp
// TodoManager.h
#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "TodoItem.h"
#include "TodoManager.generated.h"  // ✅ ALWAYS LAST!
```

---

### Error: "GENERATED_BODY() not first in class"

**Cause**: `GENERATED_BODY()` macro is not the first line in the class body.

**Solution**:

```cpp
UCLASS()
class TODOLISTUE_API UTodoManager : public UObject
{
    GENERATED_BODY()  // ✅ MUST BE FIRST!

public:
    UTodoManager();
    // Rest of class...
};
```

---

### Error: "Undefined symbol / Unresolved external symbol"

**Full Error**:
```
error LNK2019: unresolved external symbol "public: __cdecl UTodoManager::UTodoManager(void)"
```

**Cause**: Function declared but not defined, or missing from compilation.

**Solutions**:

1. **Implement missing function**:
   ```cpp
   // TodoManager.h
   UTodoManager();  // Declaration

   // TodoManager.cpp
   UTodoManager::UTodoManager()  // ✅ Add implementation
       : CurrentFilter(ETodoFilter::All)
       , bAutoSaveEnabled(true)
   {
   }
   ```

2. **Ensure file is in project**:
   - Check that `.cpp` file is in `Source/TodoListUE/` directory
   - Regenerate project files

3. **Check module API macro**:
   ```cpp
   // ✅ CORRECT: API macro for public classes
   class TODOLISTUE_API UTodoManager : public UObject

   // ❌ WRONG: Missing API macro
   class UTodoManager : public UObject
   ```

---

## Linker Errors

### Error: "Multiple definition of..."

**Cause**: Implementation in header file instead of .cpp file.

**Solution**:

```cpp
// ❌ WRONG: Implementation in header
// TodoManager.h
class UTodoManager : public UObject
{
    void AddTodo(const FString& Title)  // Defined in header!
    {
        Todos.Add(FTodoItem(Title));
    }
};

// ✅ CORRECT: Declaration in header, implementation in .cpp
// TodoManager.h
class UTodoManager : public UObject
{
    void AddTodo(const FString& Title);  // Only declaration
};

// TodoManager.cpp
void UTodoManager::AddTodo(const FString& Title)
{
    Todos.Add(FTodoItem(Title));
}
```

**Exception**: Inline functions, templates, and functions in USTRUCT are OK in headers.

---

### Error: "PCH file was built with different compiler"

**Cause**: Precompiled headers out of sync with current compiler.

**Solution**:

1. **Clean build**:
   - Close Unreal Editor
   - Delete `Binaries/` and `Intermediate/` folders
   - Rebuild solution

2. **Disable PCH temporarily** (for debugging):
   ```csharp
   // TodoListUE.Build.cs
   PCHUsage = PCHUsageMode.NoPCHs;  // Temporary workaround
   ```

---

## Reflection System Errors

### Error: "Type uses undefined class"

**Full Error**:
```
error: Property uses undefined class 'FTodoItem'
```

**Cause**: UHT (Unreal Header Tool) cannot see the type definition.

**Solutions**:

1. **Ensure USTRUCT has GENERATED_BODY()**:
   ```cpp
   USTRUCT(BlueprintType)
   struct FTodoItem
   {
       GENERATED_BODY()  // Required!

       UPROPERTY()
       FString Title;
   };
   ```

2. **Include header before using in UPROPERTY**:
   ```cpp
   #include "TodoItem.h"  // Must be before usage

   UCLASS()
   class UTodoManager : public UObject
   {
       UPROPERTY()
       TArray<FTodoItem> Todos;  // Now FTodoItem is defined
   };
   ```

---

### Error: "Unrecognized type"

**Cause**: UHT doesn't support certain C++ types in UPROPERTY.

**Unsupported Types**:
- `std::vector` → Use `TArray`
- `std::map` → Use `TMap`
- `std::string` → Use `FString`, `FName`, or `FText`
- Raw pointers to UObject → Use `UPROPERTY()` pointers or TWeakObjectPtr

**Solution**:

```cpp
// ❌ WRONG: STL types
UPROPERTY()
std::vector<FTodoItem> Todos;

// ✅ CORRECT: Unreal types
UPROPERTY()
TArray<FTodoItem> Todos;
```

---

## Module Dependency Errors

### Error: "Could not find definition for module 'UMG'"

**Cause**: Missing module dependency in Build.cs.

**Solution**:

```csharp
// TodoListUE.Build.cs
PublicDependencyModuleNames.AddRange(new string[] {
    "Core",
    "CoreUObject",
    "Engine",
    "InputCore",
    "UMG",        // Add this for UUserWidget
    "Slate",      // Add for Slate UI
    "SlateCore"   // Add for Slate core
});
```

**Common Modules**:
| Module | Use Case |
|--------|----------|
| `Core` | Essential (FString, TArray, etc.) |
| `CoreUObject` | UObject, AActor, etc. |
| `Engine` | GameMode, PlayerController, etc. |
| `UMG` | UUserWidget, Widget Blueprints |
| `Slate`, `SlateCore` | Low-level UI (if using Slate directly) |
| `AIModule` | AI systems |
| `NavigationSystem` | Pathfinding |

---

### Error: "Module not found in target"

**Cause**: Module listed in `.uproject` doesn't match Build.cs or doesn't exist.

**Solution**:

1. **Check `.uproject` modules section**:
   ```json
   "Modules": [
       {
           "Name": "TodoListUE",  // Must match folder name
           "Type": "Runtime",
           "LoadingPhase": "Default"
       }
   ]
   ```

2. **Ensure Build.cs exists**:
   - File must be at `Source/TodoListUE/TodoListUE.Build.cs`
   - Class name must match module name

---

## Blueprint Compilation Errors

### Error: "Function 'X' does not exist in 'Y'"

**Cause**: C++ function not exposed to Blueprint, or signature changed.

**Solutions**:

1. **Add BlueprintCallable**:
   ```cpp
   // ❌ WRONG: Not exposed
   void AddTodo(const FString& Title);

   // ✅ CORRECT: Exposed to Blueprint
   UFUNCTION(BlueprintCallable, Category="Todo")
   void AddTodo(const FString& Title);
   ```

2. **Recompile C++ and Blueprint**:
   - File → Compile C++ Code
   - Open Blueprint → Compile (F7)
   - If error persists, delete Blueprint and recreate

---

### Error: "Type mismatch"

**Cause**: Blueprint variable type doesn't match C++ type.

**Solution**:

```cpp
// C++ changed from:
UPROPERTY()
int32 Count;

// To:
UPROPERTY()
float Count;

// Blueprint needs to update:
// - Delete variable
// - Recompile C++
// - Recreate variable with new type
```

---

### Error: "Blueprint could not be loaded"

**Cause**: Parent C++ class was deleted or renamed.

**Solutions**:

1. **Fix parent class**:
   - Check Blueprint's parent class setting
   - Re-select correct parent C++ class

2. **Recreate Blueprint** (last resort):
   - Copy event graph nodes to clipboard
   - Delete corrupted Blueprint
   - Create new Blueprint with correct parent
   - Paste nodes back

---

## Platform-Specific Issues

### Windows

**Error: "Windows SDK not found"**

**Solution**:
1. Visual Studio Installer → Modify
2. Individual Components → Install required Windows SDK
3. Restart Visual Studio

**Error: "MSVC compiler version mismatch"**

**Solution**:
- Ensure you have MSVC v143 (VS 2022) installed
- Project Properties → Platform Toolset → Select correct version

---

### macOS

**Error: "Xcode license not accepted"**

**Solution**:
```bash
sudo xcodebuild -license accept
```

**Error: "Metal shader compilation failed"**

**Solution**:
- Update Xcode to latest version
- Check macOS version compatibility (requires macOS 12+)

---

### Linux

**Error: "libUE5.so not found"**

**Solution**:
```bash
# Set LD_LIBRARY_PATH
export LD_LIBRARY_PATH=/path/to/UnrealEngine/Engine/Binaries/Linux:$LD_LIBRARY_PATH
```

**Error: "clang not found"**

**Solution**:
```bash
sudo apt-get install clang
```

---

## Best Practices

### 1. Include Order

Always follow this include order in .cpp files:

```cpp
// 1. Own header (include first for dependency checking)
#include "TodoManager.h"

// 2. Project headers
#include "TodoItem.h"
#include "TodoSaveGame.h"

// 3. Engine headers
#include "Kismet/GameplayStatics.h"

// 4. Standard library (avoid if possible)
#include <algorithm>
```

In header files:

```cpp
#pragma once

// 1. Core includes
#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"

// 2. Forward declarations (preferred over includes)
class UTodoSaveGame;

// 3. Only include what you need
#include "TodoItem.h"  // Only if FTodoItem is used directly

// 4. Generated header LAST
#include "TodoManager.generated.h"
```

---

### 2. Forward Declarations

**Use forward declarations in headers to reduce compile times**:

```cpp
// TodoManager.h

// ✅ GOOD: Forward declaration
class UTodoSaveGame;

UCLASS()
class UTodoManager : public UObject
{
    UPROPERTY()
    UTodoSaveGame* SaveGame;  // Pointer/reference: forward declaration OK
};

// TodoManager.cpp
#include "TodoSaveGame.h"  // Include in .cpp only
```

---

### 3. Avoid Circular Dependencies

```cpp
// ❌ BAD: Circular dependency
// A.h includes B.h
// B.h includes A.h

// ✅ GOOD: Break cycle with forward declarations
// A.h
class B;  // Forward declaration
class A {
    B* MyB;
};

// B.h
class A;  // Forward declaration
class B {
    A* MyA;
};

// A.cpp
#include "B.h"

// B.cpp
#include "A.h"
```

---

### 4. Clean Builds

**When to perform a clean build**:
- After changing module dependencies
- After renaming classes or files
- After updating Unreal Engine version
- When experiencing mysterious compilation errors

**How to clean build**:

1. **Close Unreal Editor**
2. **Delete folders**:
   - `Binaries/`
   - `Intermediate/`
   - `Saved/` (optional, loses editor settings)
   - `.vs/` (Windows only)
3. **Regenerate project files**
4. **Rebuild solution**

```bash
# Windows PowerShell script
Remove-Item -Recurse -Force Binaries, Intermediate, .vs, *.sln, *.vcxproj*
# Right-click .uproject → Generate VS project files
```

---

### 5. Use Correct String Types

```cpp
// FString: Mutable, for manipulation
FString Title = TEXT("My Todo");
Title.Append(TEXT(" Item"));

// FName: Immutable, for identifiers (fast comparison)
FName CategoryName = FName(TEXT("Work"));

// FText: Localizable, for UI display
FText DisplayText = LOCTEXT("TodoTitle", "My Todo");
```

**In UPROPERTY for UI**:
```cpp
// ✅ Use FText for text displayed to users
UPROPERTY(BlueprintReadWrite)
FText TitleText;

// ✅ Use FString for internal data
UPROPERTY()
FString InternalData;
```

---

### 6. UPROPERTY Specifiers

**Always use UPROPERTY for UObject pointers**:

```cpp
// ✅ CORRECT: Prevents garbage collection
UPROPERTY()
UTodoManager* TodoManager;

// ❌ WRONG: Can be garbage collected!
UTodoManager* TodoManager;
```

**Choose correct access specifier**:

```cpp
// Editable in editor and runtime
UPROPERTY(EditAnywhere, BlueprintReadWrite)
FString Title;

// Read-only in Blueprint, editable in editor
UPROPERTY(EditAnywhere, BlueprintReadOnly)
FString ReadOnlyTitle;

// Not editable, but saved (serialized)
UPROPERTY()
TArray<FTodoItem> Todos;

// Visible in editor but not editable
UPROPERTY(VisibleAnywhere)
int32 TodoCount;
```

---

### 7. Const Correctness

```cpp
// ✅ GOOD: Mark functions that don't modify state as const
int32 GetTodoCount() const { return Todos.Num(); }

// ✅ GOOD: Use const references for large parameters
void UpdateTodo(const FTodoItem& UpdatedTodo);

// ❌ BAD: Passing by value (expensive copy)
void UpdateTodo(FTodoItem UpdatedTodo);
```

---

### 8. Initialization

**Use constructor initializer lists**:

```cpp
// ✅ GOOD: Initializer list
UTodoManager::UTodoManager()
    : CurrentFilter(ETodoFilter::All)
    , bAutoSaveEnabled(true)
{
}

// ❌ BAD: Assignment in body (double initialization)
UTodoManager::UTodoManager()
{
    CurrentFilter = ETodoFilter::All;
    bAutoSaveEnabled = true;
}
```

---

## Debugging Compilation Issues

### Enable Verbose Output

**Visual Studio**:
- Tools → Options → Projects and Solutions → Build and Run
- MSBuild project build output verbosity: Detailed

**Unreal Build Tool**:
```bash
# Add -verbose flag
UnrealBuildTool.exe TodoListUEEditor Win64 Development -verbose
```

---

### Check Generated Files

If UHT errors occur, check generated files:

```bash
# Location of generated headers
Intermediate/Build/Win64/UnrealEditor/Inc/TodoListUE/UHT/

# Check for:
# - TodoManager.generated.h
# - TodoManager.gen.cpp
```

---

### Incremental vs Full Rebuild

**Incremental build** (faster):
- Build → Build Solution
- Only recompiles changed files

**Full rebuild** (slower, but catches more errors):
- Build → Rebuild Solution
- Recompiles everything

**When to use full rebuild**:
- After changing UPROPERTY/UFUNCTION macros
- After modifying .generated.h includes
- When incremental build produces strange errors

---

## Additional Resources

### Official Documentation
- [Unreal Engine C++ Programming](https://docs.unrealengine.com/5.3/en-US/programming-with-cplusplus-in-unreal-engine/)
- [Coding Standard](https://docs.unrealengine.com/5.3/en-US/epic-cplusplus-coding-standard-for-unreal-engine/)
- [Reflection System](https://docs.unrealengine.com/5.3/en-US/unreal-object-handling-in-unreal-engine/)

### Community Resources
- [Unreal Slackers Discord](https://discord.gg/unreal-slackers)
- [Unreal Engine Forums](https://forums.unrealengine.com/)
- [r/unrealengine](https://www.reddit.com/r/unrealengine/)

---

**Last Updated**: 2025-11-19

For project-specific issues, please open a GitHub issue with:
- Full error message
- Steps to reproduce
- UE version
- Platform (Windows/macOS/Linux)
- IDE and version
