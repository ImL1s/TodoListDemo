# WBP_MainMenu Widget Blueprint

## Overview
Main UI widget for the Todo List application. Displays the todo list, input field, filters, and statistics.

## Parent Class
- **Parent**: `TodoMainWidget` (C++ class)

## Widget Hierarchy

```
Canvas Panel (Root)
├─> Vertical Box (MainContainer)
│   ├─> Text Block (TitleText) "Todo List"
│   │   └─> Font Size: 48, Bold: True
│   │
│   ├─> Horizontal Box (InputContainer)
│   │   ├─> Editable Text Box (TodoInputField)
│   │   │   └─> Hint Text: "What needs to be done?"
│   │   │   └─> On Text Committed: OnInputCommitted
│   │   └─> Button (AddButton)
│   │       └─> Text: "Add"
│   │       └─> OnClicked: OnAddButtonClicked
│   │
│   ├─> Horizontal Box (FilterContainer)
│   │   ├─> Button (AllFilterButton)
│   │   │   └─> Text: "All"
│   │   │   └─> OnClicked: OnAllFilterClicked
│   │   ├─> Button (ActiveFilterButton)
│   │   │   └─> Text: "Active"
│   │   │   └─> OnClicked: OnActiveFilterClicked
│   │   └─> Button (CompletedFilterButton)
│   │       └─> Text: "Completed"
│   │       └─> OnClicked: OnCompletedFilterClicked
│   │
│   ├─> Scroll Box (TodoListContainer)
│   │   └─> Vertical Box (TodoItemsContainer)
│   │       └─> [Dynamically populated with WBP_TodoItem instances]
│   │
│   ├─> Horizontal Box (StatisticsContainer)
│   │   ├─> Text Block (StatsText)
│   │   │   └─> Text: Binding → GetStatisticsText()
│   │   └─> Button (ClearCompletedButton)
│   │       └─> Text: "Clear Completed"
│   │       └─> OnClicked: OnClearCompletedClicked
│   │
│   └─> Horizontal Box (ActionsContainer)
│       ├─> Button (SaveButton)
│       │   └─> Text: "Save"
│       │   └─> OnClicked: OnSaveClicked
│       └─> Button (LoadButton)
│           └─> Text: "Load"
│           └─> OnClicked: OnLoadClicked
```

## Blueprint Event Graph

### Construction Script
```
Event Construct
  └─> Get Game Mode
      └─> Cast to TodoListUEGameMode
          └─> Get Todo Manager
              └─> Initialize Widget (Pass Todo Manager)
                  └─> Refresh Widget
```

### Input Handling
```
Event OnInputCommitted
  ├─> Get Text from TodoInputField
  ├─> Branch (Is Text Empty?)
  │   └─> False: Add New Todo (Text)
  │       └─> Clear TodoInputField
  └─> Set Focus to TodoInputField

Event OnAddButtonClicked
  └─> Get Text from TodoInputField
      └─> Branch (Is Not Empty)
          └─> Add New Todo (Text)
              └─> Clear TodoInputField
```

### Filter Handling
```
Event OnAllFilterClicked
  └─> Set Current Filter (All)
      └─> Update Filter Button States

Event OnActiveFilterClicked
  └─> Set Current Filter (Active)
      └─> Update Filter Button States

Event OnCompletedFilterClicked
  └─> Set Current Filter (Completed)
      └─> Update Filter Button States
```

### List Management
```
Event UpdateTodoListDisplay (Blueprint Implementable Event from C++)
  ├─> Clear Children (TodoItemsContainer)
  ├─> Get Displayed Todos
  └─> For Each Todo
      ├─> Create Widget (WBP_TodoItem)
      ├─> Set Todo Item (Current Todo)
      ├─> Initialize Widget (Todo Manager)
      └─> Add Child to Panel (TodoItemsContainer)
```

### Statistics Display
```
Function GetStatisticsText (Returns FText)
  ├─> Get Current Statistics
  └─> Format Text
      └─> Return: "{ActiveCount} active, {CompletedCount} completed, {TotalCount} total"

Event UpdateStatisticsDisplay (From C++)
  └─> Update StatsText with formatted statistics
```

### Actions
```
Event OnClearCompletedClicked
  └─> Clear Completed
      └─> Play Animation (ClearAnimation)

Event OnSaveClicked
  ├─> Get Todo Manager
  ├─> Save Todos
  └─> Show Save Confirmation (Widget Animation or Text)

Event OnLoadClicked
  ├─> Get Todo Manager
  ├─> Load Todos
  └─> Refresh Widget
```

## Styling

### Colors
- **Primary**: #007AFF (Blue)
- **Background**: #1E1E1E (Dark Gray)
- **Surface**: #2D2D2D (Light Gray)
- **Text**: #FFFFFF (White)
- **Text Secondary**: #B0B0B0 (Light Gray)
- **Success**: #34C759 (Green)
- **Danger**: #FF3B30 (Red)

### Fonts
- **Title**: Roboto Bold, 48pt
- **Body**: Roboto Regular, 16pt
- **Small**: Roboto Regular, 12pt

### Spacing
- **Padding**: 16px
- **Gap**: 8px
- **Border Radius**: 8px

## Animations

### FadeIn
- **Duration**: 0.3s
- **Opacity**: 0 → 1
- **Auto Play**: True

### ClearAnimation
- **Duration**: 0.2s
- **Effect**: Scale pulse (1.0 → 1.1 → 1.0)

### AddAnimation
- **Duration**: 0.2s
- **Effect**: Slide in from right

## Usage

1. Create new Widget Blueprint
2. Set parent class to `TodoMainWidget`
3. Build UI hierarchy as shown above
4. Implement event graph functions
5. Configure styling and animations
6. Add to viewport in Level Blueprint or PlayerController

## Example Level Blueprint

```
Event BeginPlay
  ├─> Get Player Controller
  ├─> Set Input Mode UI Only
  ├─> Set Show Mouse Cursor (True)
  ├─> Create Widget (WBP_MainMenu)
  └─> Add to Viewport
```

## Related Files
- C++ Parent: `UTodoMainWidget`
- Item Widget: `WBP_TodoItem`
- Game Mode: `BP_TodoGameMode`
- Manager: `UTodoManager`
