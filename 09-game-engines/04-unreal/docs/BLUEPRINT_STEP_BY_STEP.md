# Blueprint Creation Step-by-Step Guide

A detailed, step-by-step guide for creating all the Blueprints in the Todo List UE5 project.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Creating BP_TodoGameMode](#creating-bp_todogamemode)
3. [Creating WBP_MainMenu](#creating-wbp_mainmenu)
4. [Creating WBP_TodoItem](#creating-wbp_todoitem)
5. [Setting Up Level Blueprint](#setting-up-level-blueprint)
6. [Testing the Application](#testing-the-application)
7. [Troubleshooting](#troubleshooting)

---

## Project Setup

### Prerequisites

Before creating Blueprints, ensure:

1. ✅ C++ code is compiled successfully
2. ✅ Unreal Editor is open with TodoListUE project
3. ✅ All C++ classes are available in Class Viewer

### Verify C++ Classes

1. **Open Class Viewer**:
   - Window → Developer Tools → Class Viewer
   - Filter: "Todo"
   - Verify these classes exist:
     - `TodoListUEGameMode`
     - `TodoManager`
     - `TodoMainWidget`
     - `TodoItemWidget`
     - `TodoSaveGame`

2. **If classes don't appear**:
   - Recompile C++ code
   - Restart Unreal Editor
   - Check Output Log for errors

---

## Creating BP_TodoGameMode

### Step 1: Create Blueprint Class

1. **Open Content Browser**:
   - Navigate to `Content/Blueprints/` folder
   - If folder doesn't exist, create it:
     - Right-click in Content → New Folder → Name: "Blueprints"

2. **Create Blueprint**:
   - Right-click in `Blueprints/` folder
   - Blueprint Class
   - **Pick Parent Class**:
     - Expand "All Classes"
     - Search: "TodoListUEGameMode"
     - Select: `TodoListUEGameMode`
     - Click "Select"
   - **Name**: `BP_TodoGameMode`

### Step 2: Configure Class Defaults

1. **Open BP_TodoGameMode**:
   - Double-click `BP_TodoGameMode`

2. **Set Class Defaults**:
   - Click "Class Defaults" button (top toolbar)
   - In Details panel, configure:
     - **Load Todos On Startup**: ✅ Checked
     - **Save Todos On Shutdown**: ✅ Checked
     - **Save Slot Name**: `TodoSaveSlot` (default)

3. **Optional: Add Debug Logging**:
   - Switch to Event Graph tab
   - Add Event BeginPlay:
     - Right-click → Add Event → Event BeginPlay
   - Add parent call:
     - Drag from BeginPlay exec → Add Call to Parent Function
   - Add debug log:
     - Drag from parent call → Print String
     - String: "Todo GameMode Started"
     - Duration: 5.0
     - Text Color: Green

### Step 3: Compile and Save

1. **Compile Blueprint**:
   - Click "Compile" button (top toolbar)
   - Verify no errors in Compiler Results

2. **Save Blueprint**:
   - Click "Save" button
   - Or: Ctrl+S

### Step 4: Set as Default Game Mode

1. **Project Settings Method**:
   - Edit → Project Settings
   - Maps & Modes
   - **Default GameMode**: `BP_TodoGameMode`
   - Close Project Settings

2. **Or World Settings Method** (per-level):
   - Window → World Settings
   - **GameMode Override**: `BP_TodoGameMode`

---

## Creating WBP_MainMenu

### Step 1: Create Widget Blueprint

1. **Navigate to UI Folder**:
   - Content Browser → `Content/UI/`
   - Create folder if needed

2. **Create Widget Blueprint**:
   - Right-click → User Interface → Widget Blueprint
   - **Pick Parent Class**:
     - Expand "All Classes"
     - Search: "TodoMainWidget"
     - Select: `TodoMainWidget` (C++ class)
   - **Name**: `WBP_MainMenu`

### Step 2: Design UI Layout

#### 2.1 Root Widget

1. **Open Designer**:
   - Double-click `WBP_MainMenu`
   - Ensure "Designer" tab is selected

2. **Add Canvas Panel (Root)**:
   - Palette → Panel → **Canvas Panel**
   - Drag to Hierarchy (should become root)

#### 2.2 Main Container

3. **Add Vertical Box**:
   - Palette → Panel → **Vertical Box**
   - Drag onto Canvas Panel in Hierarchy
   - **Rename**: "MainContainer" (F2 or right-click → Rename)

4. **Configure MainContainer**:
   - Select MainContainer in Hierarchy
   - Details → Slot (Canvas Panel Slot):
     - **Anchors**: Center (preset)
     - **Position X**: 0
     - **Position Y**: 0
     - **Size X**: 800
     - **Size Y**: 600
     - **Alignment**: X: 0.5, Y: 0.5

#### 2.3 Title Text

5. **Add Title**:
   - Palette → Common → **Text Block**
   - Drag onto MainContainer
   - **Rename**: "TitleText"

6. **Configure Title**:
   - Details → Content:
     - **Text**: "Todo List"
   - Details → Appearance:
     - **Font**: Roboto Bold
     - **Size**: 48
     - **Color**: White (R:1, G:1, B:1, A:1)
   - Details → Slot (Vertical Box Slot):
     - **Padding**: Top: 20, Bottom: 20

#### 2.4 Input Row

7. **Add Horizontal Box for Input**:
   - Drag Horizontal Box onto MainContainer
   - **Rename**: "InputContainer"

8. **Add Text Input Field**:
   - Palette → Common → **Editable Text Box**
   - Drag onto InputContainer
   - **Rename**: "TodoInputField"

9. **Configure Input Field**:
   - Details → Content:
     - **Hint Text**: "What needs to be done?"
   - Details → Style:
     - **Font Size**: 16
   - Details → Slot:
     - **Size**: Fill, 1.0
     - **Padding**: 5

10. **Add Add Button**:
    - Palette → Common → **Button**
    - Drag onto InputContainer (after input field)
    - **Rename**: "AddButton"

11. **Add Button Text**:
    - Drag **Text Block** onto AddButton
    - Details → Content:
      - **Text**: "Add"
    - Details → Appearance:
      - **Font Size**: 18

12. **Configure Add Button**:
    - Select AddButton
    - Details → Slot:
      - **Size**: Auto
      - **Padding**: 5

#### 2.5 Filter Row

13. **Add Horizontal Box for Filters**:
    - Drag Horizontal Box onto MainContainer
    - **Rename**: "FilterContainer"
    - Slot → Padding: Top: 10, Bottom: 10

14. **Add Filter Buttons** (repeat for All, Active, Completed):
    - Drag **Button** onto FilterContainer
    - **Rename**: "AllFilterButton"
    - Add **Text Block** as child
    - Text: "All"
    - Repeat for:
      - "ActiveFilterButton" (text: "Active")
      - "CompletedFilterButton" (text: "Completed")

#### 2.6 Todo List Container

15. **Add Scroll Box**:
    - Drag **Scroll Box** onto MainContainer
    - **Rename**: "TodoListScroll"
    - Details → Slot:
      - **Size**: Fill, 1.0 (takes remaining space)

16. **Add Vertical Box Inside Scroll Box**:
    - Drag **Vertical Box** onto TodoListScroll
    - **Rename**: "TodoItemsContainer"
    - **Important**: This is where todo items will be added dynamically

#### 2.7 Statistics Row

17. **Add Horizontal Box for Stats**:
    - Drag Horizontal Box onto MainContainer
    - **Rename**: "StatisticsContainer"

18. **Add Statistics Text**:
    - Drag Text Block onto StatisticsContainer
    - **Rename**: "StatsText"
    - Details → Slot:
      - **Size**: Fill, 1.0

19. **Add Clear Completed Button**:
    - Drag Button onto StatisticsContainer
    - **Rename**: "ClearCompletedButton"
    - Add Text Block child: "Clear Completed"

### Step 3: Create Bindings

#### Binding Statistics Text

1. **Select StatsText**:
   - In Hierarchy, click "StatsText"

2. **Create Text Binding**:
   - Details → Content → Text → **Bind** → Create Binding
   - This creates a function "GetText_0"
   - **Rename function**: "GetStatisticsText"

3. **Implement Function**:
   - In My Blueprint panel, find "GetStatisticsText"
   - Function graph opens
   - **Implementation**:
     ```blueprint
     GetStatisticsText (Return Node: Text)
       ├─> Get Todo Manager
       │   └─> Get Current Statistics
       │       └─> Format Text
       │           ├─ Format: "{0} active | {1} completed | {2} total"
       │           ├─ 0: Stats.ActiveTodos
       │           ├─ 1: Stats.CompletedTodos
       │           └─ 2: Stats.TotalTodos
       └─> Return Value
     ```

### Step 4: Implement Event Handlers

#### OnInputCommitted Event

1. **Select TodoInputField**:
   - Hierarchy → TodoInputField

2. **Add Event**:
   - Details → Events → On Text Committed → **[+]**

3. **Implement Event**:
   ```blueprint
   On Text Committed (Text, Commit Method)
     ├─> Branch (Commit Method == On Enter)
     │   └─ True:
     │       ├─> Get Text
     │       ├─> Is Empty? → Branch
     │       │   └─ False:
     │       │       ├─> Add New Todo (Text as String)
     │       │       └─> Set Text (Empty String)
     │       └─> Set Keyboard Focus (Self: TodoInputField)
   ```

#### OnAddButtonClicked Event

1. **Select AddButton**:
   - Hierarchy → AddButton

2. **Add Event**:
   - Details → Events → On Clicked → **[+]**

3. **Implement Event**:
   ```blueprint
   On Clicked
     ├─> Get Text (from TodoInputField)
     ├─> Branch (NOT Is Empty)
     │   └─ True:
     │       ├─> Add New Todo (Text as String)
     │       └─> Set Text (TodoInputField, Empty String)
   ```

#### Filter Button Events

1. **AllFilterButton → On Clicked**:
   ```blueprint
   On Clicked
     └─> Set Current Filter (All)
         └─> Update Filter Button States
   ```

2. **Repeat for ActiveFilterButton and CompletedFilterButton**

### Step 5: Implement UpdateTodoListDisplay

This function is called from C++ when todos change.

1. **Override Event**:
   - My Blueprint → Functions
   - Override → Update Todo List Display

2. **Implementation**:
   ```blueprint
   Event Update Todo List Display
     ├─> Clear Children (TodoItemsContainer)
     ├─> Get Displayed Todos → ForEachLoop
     │   ├─ Loop Body:
     │   │   ├─> Create Widget (Class: WBP_TodoItem)
     │   │   ├─> Set Todo Item (Array Element)
     │   │   ├─> Initialize Widget (Get Todo Manager)
     │   │   └─> Add Child to Vertical Box (TodoItemsContainer, Widget)
     │   └─ Completed: (end)
   ```

### Step 6: Initialize Widget

1. **Override Event Construct**:
   - My Blueprint → Functions → Override → Construct

2. **Implementation**:
   ```blueprint
   Event Construct
     ├─> Get Game Mode
     │   └─> Cast to TodoListUEGameMode
     │       └─> Get Todo Manager
     │           └─> Initialize Widget (Todo Manager)
     │               └─> Refresh Widget
   ```

### Step 7: Compile and Save

1. **Compile**: Click Compile button
2. **Check for Errors**: Review Compiler Results
3. **Save**: Ctrl+S

---

## Creating WBP_TodoItem

### Step 1: Create Widget Blueprint

1. **Content Browser** → `Content/UI/`
2. **Right-click** → User Interface → Widget Blueprint
3. **Parent Class**: `TodoItemWidget` (C++ class)
4. **Name**: `WBP_TodoItem`

### Step 2: Design Layout

#### Root and Background

1. **Add Border** (for background):
   - Palette → Panel → **Border**
   - Root widget
   - **Rename**: "ItemBackground"

2. **Configure Border**:
   - Details → Appearance:
     - **Brush Color**: R: 0.18, G: 0.18, B: 0.18 (dark gray)
   - Details → Padding: 12
   - Details → Desired Size Override: Width: 700, Height: 60

#### Content Layout

3. **Add Horizontal Box**:
   - Drag onto ItemBackground
   - **Rename**: "ContentContainer"

4. **Add Checkbox**:
   - Palette → Common → **Check Box**
   - Drag onto ContentContainer
   - **Rename**: "CompletionCheckbox"
   - Details → Slot:
     - **Size**: Auto
     - **Alignment**: Center Left
     - **Padding**: Right: 15

5. **Add Vertical Box for Text**:
   - Drag Vertical Box onto ContentContainer
   - **Rename**: "TextContainer"
   - Slot → Size: Fill, 1.0

6. **Add Title Text Box**:
   - Drag **Editable Text Box** onto TextContainer
   - **Rename**: "TitleTextBox"
   - Details → Content:
     - **Is Read Only**: Bind → Create Binding → "GetIsReadOnly"
   - Details → Appearance:
     - **Font Size**: 16

7. **Add Metadata Container**:
   - Drag Horizontal Box onto TextContainer
   - **Rename**: "MetadataContainer"

8. **Add Priority Text**:
   - Drag Text Block onto MetadataContainer
   - **Rename**: "PriorityText"
   - Details → Content → Text: Bind → "GetPriorityText"
   - Details → Appearance → Color and Opacity: Bind → "GetPriorityColor"

9. **Add Date Text**:
   - Drag Text Block onto MetadataContainer
   - **Rename**: "DateText"
   - Details → Content → Text: Bind → "GetDateText"

10. **Add Edit Button**:
    - Drag Button onto ContentContainer
    - **Rename**: "EditButton"
    - Add Text Block child: "✏️"

11. **Add Delete Button**:
    - Drag Button onto ContentContainer
    - **Rename**: "DeleteButton"
    - Add Text Block child: "🗑️"

### Step 3: Implement Binding Functions

#### GetIsReadOnly

```blueprint
Function: Get Is Read Only (Returns: Boolean)
  └─> Return Value: NOT IsEditMode
```

#### GetPriorityText

```blueprint
Function: Get Priority Text (Returns: FText)
  ├─> Get Todo Item
  │   └─> Get Priority
  │       └─> Switch on ETodoPriority
  │           ├─ Low: Return "Low Priority"
  │           ├─ Normal: Return "Normal"
  │           ├─ High: Return "High Priority"
  │           └─ Critical: Return "CRITICAL!"
```

#### GetPriorityColor

```blueprint
Function: Get Priority Color (Returns: FLinearColor)
  ├─> Get Todo Item → Get Priority
  │   └─> Switch on ETodoPriority
  │       ├─ Low: Make Color (R:0.7, G:0.7, B:0.7)
  │       ├─ Normal: Make Color (R:1, G:1, B:1)
  │       ├─ High: Make Color (R:1, G:0.65, B:0)
  │       └─ Critical: Make Color (R:1, G:0.23, B:0.19)
```

#### GetDateText

```blueprint
Function: Get Date Text (Returns: FText)
  ├─> Get Todo Item
  │   └─> Branch (bCompleted)
  │       ├─ True:
  │       │   └─> Format Text "Completed: {0}"
  │       │       └─> 0: CompletedAt (To Text)
  │       └─ False:
  │           └─> Format Text "Created: {0}"
  │               └─> 0: CreatedAt (To Text)
```

### Step 4: Event Handlers

#### OnCheckboxChanged

1. **Select CompletionCheckbox**
2. **Details → Events → On Check State Changed** → [+]
3. **Implementation**:
   ```blueprint
   On Check State Changed (Is Checked)
     └─> Toggle Completion
         └─> Play Animation (CheckAnimation)  // If created
   ```

#### OnEditButtonClicked

```blueprint
On Clicked (EditButton)
  ├─> Set IsEditMode = True
  ├─> Set Keyboard Focus (TitleTextBox)
  └─> Select All Text (TitleTextBox)
```

#### OnDeleteButtonClicked

```blueprint
On Clicked (DeleteButton)
  └─> Delete Todo
      └─> Play Animation (DeleteAnimation)  // If created
```

### Step 5: Animations (Optional)

#### Create CheckAnimation

1. **Animations Tab** (bottom)
2. **+ Animation** → Name: "CheckAnimation"
3. **Add Track**:
   - Select CompletionCheckbox
   - Track: Render Transform → Scale
   - Keyframe 0.0s: Scale (1.0, 1.0)
   - Keyframe 0.1s: Scale (1.3, 1.3)
   - Keyframe 0.2s: Scale (1.0, 1.0)

### Step 6: Variables

Create variables in My Blueprint panel:

1. **IsEditMode** (Boolean):
   - Type: Boolean
   - Default: False
   - Category: Todo

### Step 7: Compile and Save

1. **Compile**
2. **Save**

---

## Setting Up Level Blueprint

### Step 1: Create or Open Level

1. **File → New Level** → Empty Level
2. **Save**: `Content/Maps/MainMenu`

### Step 2: Configure Level Blueprint

1. **Blueprints → Open Level Blueprint**

2. **Event BeginPlay Implementation**:
   ```blueprint
   Event BeginPlay
     ├─> Get Player Controller (Index: 0)
     │   ├─> Set Show Mouse Cursor (True)
     │   └─> Set Input Mode UI Only
     │       ├─ Widget to Focus: (leave empty)
     │       └─ Lock Mouse to Viewport: False
     ├─> Create Widget (Class: WBP_MainMenu)
     │   └─> Add to Viewport
     │       └─ Z-Order: 0
   ```

3. **Compile and Save**

### Step 3: Set as Startup Map

1. **Edit → Project Settings**
2. **Maps & Modes**
3. **Editor Startup Map**: `/Game/Maps/MainMenu`
4. **Game Default Map**: `/Game/Maps/MainMenu`

---

## Testing the Application

### Step 1: Play in Editor

1. **Click Play (Alt+P)**
2. **Verify**:
   - ✅ Main menu appears
   - ✅ Mouse cursor is visible
   - ✅ Input field is functional

### Step 2: Test Basic Operations

1. **Add a Todo**:
   - Type in input field
   - Press Enter or click Add
   - Verify todo appears in list

2. **Complete a Todo**:
   - Click checkbox
   - Verify visual change (strike-through, opacity)

3. **Delete a Todo**:
   - Click delete button
   - Verify todo is removed

4. **Filter Todos**:
   - Add multiple todos (some completed, some not)
   - Click filter buttons
   - Verify filtering works

### Step 3: Test Persistence

1. **Add Several Todos**
2. **Stop Play (Esc)**
3. **Play Again (Alt+P)**
4. **Verify**: Todos are loaded from save file

---

## Troubleshooting

### Widget Not Appearing

**Issue**: Widget doesn't show when playing

**Solutions**:
1. Check Level Blueprint → Ensure AddToViewport is called
2. Verify widget has valid size (not 0x0)
3. Check Z-order (should be visible layer)
4. Ensure GameMode is set correctly

### Buttons Not Clickable

**Issue**: Buttons don't respond to clicks

**Solutions**:
1. Check Input Mode → Should be UI Only
2. Verify button visibility → Not Collapsed
3. Check Hit Test Visibility → Should be Visible
4. Ensure mouse cursor is enabled

### Todo Manager Not Found

**Issue**: GetTodoManager returns null

**Solutions**:
1. Verify GameMode is `BP_TodoGameMode`
2. Check GameMode is active in World Settings
3. Recompile C++ code
4. Restart Unreal Editor

### Compilation Errors

**Issue**: Blueprint won't compile

**Solutions**:
1. Check Compiler Results panel for specific errors
2. Verify C++ parent class is compiled
3. Ensure all nodes have required connections
4. Delete and recreate problematic nodes

### Save/Load Not Working

**Issue**: Todos don't persist

**Solutions**:
1. Check Output Log for save/load messages
2. Verify `Saved/SaveGames/` folder exists
3. Ensure auto-save is enabled in GameMode
4. Check save slot name matches

---

## Next Steps

Once Blueprints are created:

1. ✅ Customize styling (colors, fonts, spacing)
2. ✅ Add animations for polish
3. ✅ Implement additional features (search, sorting)
4. ✅ Create responsive layouts for different resolutions
5. ✅ Add sound effects and visual feedback

---

## Screenshots

*Note: Add screenshots here showing:*
- Blueprint hierarchy
- Completed UI layout
- Node graphs for key functions
- Final running application

---

**Created**: 2025-11-19
**For**: TodoListUE Project
**Engine**: Unreal Engine 5.3
