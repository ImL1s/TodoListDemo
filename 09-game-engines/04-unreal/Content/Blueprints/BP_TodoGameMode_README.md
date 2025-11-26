# BP_TodoGameMode Blueprint

## Overview
This is the Blueprint implementation of the Todo List Game Mode, derived from `ATodoListUEGameMode`.

## Blueprint Setup

### Parent Class
- **Parent**: `TodoListUEGameMode` (C++ class)

### Default Values
Configure these in the Blueprint's Class Defaults:
- **Load Todos On Startup**: `true`
- **Save Todos On Shutdown**: `true`
- **Save Slot Name**: `"TodoSaveSlot"`

### Blueprint Graph

#### Event Graph

```
Event BeginPlay
  └─> Call Parent: BeginPlay
      └─> Get Todo Manager
          └─> Branch (Is Valid?)
              ├─> True: Print String "Todo Manager Initialized"
              └─> False: Print String "ERROR: Failed to initialize Todo Manager"
```

## Usage

1. Create a new Blueprint Class
2. Choose `TodoListUEGameMode` as parent class
3. Name it `BP_TodoGameMode`
4. Set as default game mode in Project Settings or World Settings
5. Configure default values as needed

## Notes

- The C++ base class handles all core logic
- This Blueprint is primarily for configuration and optional custom behavior
- Can override BeginPlay to add custom initialization
- Can add Blueprint-specific events and UI logic

## Related Classes
- C++ Parent: `ATodoListUEGameMode`
- Uses: `UTodoManager`
- Widgets: `WBP_MainMenu`, `WBP_TodoItem`
