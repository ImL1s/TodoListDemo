# WBP_TodoItem Widget Blueprint

## Overview
Individual todo item widget that represents a single todo in the list. Supports toggling completion, editing, and deletion.

## Parent Class
- **Parent**: `TodoItemWidget` (C++ class)

## Widget Hierarchy

```
Horizontal Box (Root)
├─> Border (ItemBackground)
│   └─> Horizontal Box (ContentContainer)
│       ├─> Check Box (CompletionCheckbox)
│       │   └─> On Check State Changed: OnCheckboxChanged
│       │   └─> Style: Custom todo checkbox style
│       │
│       ├─> Vertical Box (TextContainer)
│       │   ├─> Editable Text Box (TitleTextBox)
│       │   │   └─> Is ReadOnly: Binding → GetIsReadOnly()
│       │   │   └─> On Text Committed: OnTitleEdited
│       │   │   └─> Text: Binding → GetTodoTitle()
│       │   │
│       │   └─> Horizontal Box (MetadataContainer)
│       │       ├─> Text Block (PriorityText)
│       │       │   └─> Text: Binding → GetPriorityText()
│       │       │   └─> Color: Binding → GetPriorityColor()
│       │       │
│       │       └─> Text Block (DateText)
│       │           └─> Text: Binding → GetDateText()
│       │           └─> Font Size: 10
│       │
│       ├─> Combo Box (PriorityComboBox)
│       │   └─> Options: Low, Normal, High, Critical
│       │   └─> On Selection Changed: OnPriorityChanged
│       │   └─> Visibility: Binding → GetEditModeVisibility()
│       │
│       ├─> Button (EditButton)
│       │   └─> Text: "✏️" or Icon
│       │   └─> OnClicked: OnEditButtonClicked
│       │   └─> Visibility: Binding → GetViewModeVisibility()
│       │
│       └─> Button (DeleteButton)
│           └─> Text: "🗑️" or Icon
│           └─> OnClicked: OnDeleteButtonClicked
│           └─> Style: Danger button style
```

## Blueprint Event Graph

### Construction Script
```
Event Construct
  └─> Initialize default state
      └─> Set IsEditMode = False
```

### Data Binding Functions

```
Function GetTodoTitle (Returns FText)
  ├─> Get Todo Item
  └─> Return Todo Item.Title as FText

Function GetIsReadOnly (Returns Boolean)
  └─> Return NOT IsEditMode

Function GetPriorityText (Returns FText)
  ├─> Get Todo Item
  ├─> Switch on Priority
  │   ├─> Low: "Low Priority"
  │   ├─> Normal: "Normal"
  │   ├─> High: "High Priority"
  │   └─> Critical: "CRITICAL!"
  └─> Return as FText

Function GetPriorityColor (Returns FSlateColor)
  ├─> Get Todo Item
  ├─> Switch on Priority
  │   ├─> Low: #B0B0B0 (Gray)
  │   ├─> Normal: #FFFFFF (White)
  │   ├─> High: #FFA500 (Orange)
  │   └─> Critical: #FF3B30 (Red)
  └─> Return Color

Function GetDateText (Returns FText)
  ├─> Get Todo Item
  ├─> Branch (Is Completed?)
  │   ├─> True: Format "Completed: {CompletedAt}"
  │   └─> False: Format "Created: {CreatedAt}"
  └─> Return formatted date

Function GetEditModeVisibility (Returns ESlateVisibility)
  └─> Return IsEditMode ? Visible : Collapsed

Function GetViewModeVisibility (Returns ESlateVisibility)
  └─> Return IsEditMode ? Collapsed : Visible
```

### Event Handlers

```
Event OnCheckboxChanged (IsChecked: Boolean)
  └─> Toggle Completion
      └─> Play Animation (CheckAnimation)
          └─> Update Styling (Strike-through if completed)

Event OnEditButtonClicked
  ├─> Set IsEditMode = True
  ├─> Set Focus to TitleTextBox
  └─> Select All Text

Event OnTitleEdited (Text: FText, CommitMethod: ETextCommit)
  ├─> Branch (CommitMethod == OnEnter or OnUserMovedFocus)
  │   └─> Edit Title (Text as String)
  │       └─> Set IsEditMode = False
  └─> Set IsEditMode = False

Event OnDeleteButtonClicked
  └─> Show Confirmation Dialog
      └─> On Confirm: Delete Todo
          └─> Play Animation (DeleteAnimation)

Event OnPriorityChanged (SelectedItem: String, SelectionType: ESelectInfo)
  ├─> Convert String to ETodoPriority
  └─> Set Priority (Converted Priority)
```

### Refresh Implementation
```
Event UpdateItemDisplay (Blueprint Implementable Event from C++)
  ├─> Get Todo Item
  ├─> Update CompletionCheckbox.IsChecked
  ├─> Update TitleTextBox styling
  │   └─> If Completed: Apply strike-through
  ├─> Update PriorityComboBox selection
  └─> Force refresh all bindings
```

## Variables

### Instance Variables
- **IsEditMode** (Boolean): Whether the item is in edit mode
- **TodoItem** (FTodoItem): The todo data (inherited from C++)
- **HoverOpacity** (Float): Opacity during hover (0.8 → 1.0)

## Styling

### Item Background
- **Normal State**
  - Background: #2D2D2D
  - Border: 1px solid #404040
  - Padding: 12px
  - Border Radius: 8px

- **Hover State**
  - Background: #353535
  - Border: 1px solid #505050

- **Completed State**
  - Background: #252525
  - Opacity: 0.7

### Title Text
- **Normal**: #FFFFFF, 16pt
- **Completed**: #808080, 16pt, Strike-through
- **Edit Mode**: White background, #000000 text

### Buttons
- **Edit Button**: Icon size 20px, Hover tint #007AFF
- **Delete Button**: Icon size 20px, Hover tint #FF3B30
- **Padding**: 8px

## Animations

### CheckAnimation
- **Duration**: 0.2s
- **Effects**:
  - Scale checkbox: 1.0 → 1.3 → 1.0
  - Fade title opacity: 1.0 → 0.7 (if completed)
  - Add strike-through (if completed)

### DeleteAnimation
- **Duration**: 0.3s
- **Effects**:
  - Slide out to right: Offset X 0 → 400
  - Fade out: Opacity 1.0 → 0.0
  - Scale down: 1.0 → 0.8

### HoverAnimation
- **Duration**: 0.15s
- **Effects**:
  - Background brighten
  - Border color brighten

## Priority Colors

| Priority | Color | Hex Code |
|----------|-------|----------|
| Low | Gray | #B0B0B0 |
| Normal | White | #FFFFFF |
| High | Orange | #FFA500 |
| Critical | Red | #FF3B30 |

## Usage Example

```cpp
// C++ Usage
UTodoItemWidget* ItemWidget = CreateWidget<UTodoItemWidget>(this, WBP_TodoItemClass);
ItemWidget->SetTodoItem(MyTodoItem);
ItemWidget->InitializeWidget(TodoManager);
MyContainer->AddChild(ItemWidget);
```

```blueprint
// Blueprint Usage
Create Widget (WBP_TodoItem)
  └─> Set Todo Item (My Todo)
      └─> Initialize Widget (Todo Manager)
          └─> Add to Parent (Todo List Container)
```

## Accessibility

- **Keyboard Navigation**: Support Tab/Shift+Tab to navigate between items
- **Screen Reader**: Proper ARIA labels for checkbox and buttons
- **Contrast**: All text meets WCAG AA standards
- **Focus Indicators**: Clear visual feedback for keyboard focus

## Related Files
- C++ Parent: `UTodoItemWidget`
- Main Widget: `WBP_MainMenu`
- Data Structure: `FTodoItem`
- Manager: `UTodoManager`
