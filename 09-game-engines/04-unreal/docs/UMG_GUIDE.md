# UMG (Unreal Motion Graphics) UI Guide

A comprehensive guide to building user interfaces with UMG in the Todo List UE5 project.

## Table of Contents

1. [Introduction to UMG](#introduction-to-umg)
2. [Widget Designer Overview](#widget-designer-overview)
3. [Widget Hierarchy](#widget-hierarchy)
4. [Layout Components](#layout-components)
5. [Common Widget Types](#common-widget-types)
6. [Anchors and Alignment](#anchors-and-alignment)
7. [Data Binding](#data-binding)
8. [Widget Animations](#widget-animations)
9. [Events and Input](#events-and-input)
10. [Styling and Appearance](#styling-and-appearance)
11. [C++ Widget Integration](#c-widget-integration)
12. [Performance Optimization](#performance-optimization)
13. [Todo List UI Implementation](#todo-list-ui-implementation)
14. [Best Practices](#best-practices)

---

## Introduction to UMG

### What is UMG?

**UMG (Unreal Motion Graphics)** is Unreal Engine's visual UI authoring tool. It combines:
- **Slate**: Low-level C++ UI framework
- **Widget Blueprints**: Visual designer for creating UI
- **UUserWidget**: C++ base class for custom widgets

### UMG vs Slate

| Feature | UMG | Slate |
|---------|-----|-------|
| **Language** | Blueprint + C++ | C++ only |
| **Editor** | Visual designer | Code-based |
| **Ease of Use** | High | Medium |
| **Performance** | Good | Excellent |
| **Flexibility** | Good | Maximum |
| **Best For** | UI design, rapid iteration | Engine UI, custom complex widgets |

**For most applications (including Todo List), UMG is the best choice.**

### UMG Architecture

```
UUserWidget (C++ Base Class)
  └─> Widget Blueprint (Designer + Event Graph)
      └─> Slate Widgets (Rendering)
```

---

## Widget Designer Overview

### Opening the Widget Designer

1. **Content Browser** → Right-click → User Interface → Widget Blueprint
2. Name it (e.g., `WBP_MainMenu`)
3. Double-click to open

### Designer Interface

```
┌─────────────────────────────────────────────────────────────┐
│ Toolbar: Compile, Save, Preview, Graph, Designer            │
├───────────┬──────────────────────────────┬──────────────────┤
│           │                              │                  │
│  Palette  │     Canvas Panel             │   Hierarchy      │
│           │     (Preview)                │                  │
│  Common   │                              │   ├─ Canvas Panel│
│  ├─Button │                              │   ├─ Text Block  │
│  ├─TextBlk│                              │   └─ Button      │
│  └─ ...   │                              │                  │
│           │                              │                  │
│  Panel    │                              │                  │
│  ├─Canvas │                              │                  │
│  ├─HorzBox│                              │                  │
│  └─ ...   │                              │                  │
├───────────┴──────────────────────────────┴──────────────────┤
│                                                              │
│  Details Panel                                               │
│  - Properties of selected widget                            │
│  - Appearance, Layout, Events, etc.                         │
└──────────────────────────────────────────────────────────────┘
```

### Tabs

#### Designer Tab
- Visual layout editor
- Drag-and-drop widget placement
- WYSIWYG preview
- Anchor/alignment manipulation

#### Graph Tab
- Blueprint event graph
- Bindings, functions, variables
- C++ and Blueprint integration

#### Animations Tab
- Create timeline-based animations
- Animate properties (opacity, position, scale, etc.)

---

## Widget Hierarchy

Widgets are organized in a tree structure.

### Root Widget

Every Widget Blueprint has **one root widget** (usually a panel).

```
Canvas Panel (Root)
├─ Text Block (Child)
├─ Button (Child)
└─ Vertical Box (Child)
    ├─ Text Block (Grandchild)
    └─ Image (Grandchild)
```

### Parent-Child Relationships

- **Parent**: Container widget (panels)
- **Child**: Content widget (buttons, text, images)
- **Slots**: Parents have "slots" that define how children are arranged

### Common Root Widgets

| Widget | Use Case |
|--------|----------|
| **Canvas Panel** | Free-form positioning, absolute coordinates |
| **Vertical/Horizontal Box** | Auto-layout in one direction |
| **Overlay** | Stack widgets on top of each other |
| **Grid Panel** | Grid-based layout |
| **Size Box** | Fixed size container |

---

## Layout Components

### Canvas Panel

**Free-form positioning** with absolute coordinates.

#### Properties
- **Position**: X, Y coordinates (pixels)
- **Size**: Width, Height (pixels)
- **Anchors**: Where widget is anchored to parent
- **Alignment**: Pivot point within widget

#### Use Cases
- Root widget for full-screen UI
- Complex layouts that don't fit auto-layout
- Pixel-perfect positioning

#### Example
```
Canvas Panel
├─ Button (Pos: 100,50, Size: 200,50)
└─ Text Block (Pos: 100,120, Size: 200,30)
```

### Vertical Box

**Auto-layout vertically** (top to bottom).

#### Properties per Child Slot
- **Size**: Fill, Auto
- **Padding**: Spacing around child
- **Alignment**: Left, Center, Right
- **Vertical Alignment**: Top, Center, Bottom

#### Use Cases
- Lists of items (todo items!)
- Forms with multiple fields
- Menus with stacked buttons

#### Example
```
Vertical Box
├─ Text Block "Title" (Auto size, padding 10)
├─ Horizontal Box "Input Row" (Fill, padding 5)
└─ Button "Submit" (Auto size, padding 10)
```

### Horizontal Box

**Auto-layout horizontally** (left to right).

#### Example
```
Horizontal Box
├─ Button "Cancel" (Auto size)
├─ Spacer (Fill)  ← Pushes next item to right
└─ Button "OK" (Auto size)
```

### Overlay

**Stack widgets** on top of each other (Z-order).

#### Use Cases
- Background + foreground content
- Overlays (tooltips, modals)
- Badges on buttons

#### Example
```
Overlay
├─ Image "Background" (Z: 0)
├─ Text Block "Label" (Z: 1)
└─ Image "Badge" (Z: 2)
```

### Grid Panel

**Grid-based layout** with rows and columns.

#### Properties per Child Slot
- **Column**: Which column (0-based)
- **Row**: Which row (0-based)
- **Column Span**: How many columns to span
- **Row Span**: How many rows to span

#### Example
```
Grid Panel (2 cols x 3 rows)
├─ Text "Name:" (Col 0, Row 0)
├─ EditableText (Col 1, Row 0)
├─ Text "Age:" (Col 0, Row 1)
├─ EditableText (Col 1, Row 1)
└─ Button "Submit" (Col 0-1, Row 2, ColSpan 2)
```

### Size Box

**Fixed or constrained size** container.

#### Properties
- **Width Override**: Fixed width
- **Height Override**: Fixed height
- **Min Desired Width/Height**
- **Max Desired Width/Height**

#### Use Cases
- Enforcing maximum button size
- Constraining image dimensions
- Creating fixed-size regions

### Scroll Box

**Scrollable container** for content larger than viewport.

#### Properties
- **Orientation**: Vertical or Horizontal
- **Scroll Bar Visibility**: Always, WhenNeeded, Never
- **Allow Overscroll**: Bounce effect

#### Use Cases
- Todo list (scrollable list of items)
- Long text content
- Settings panels

---

## Common Widget Types

### Text Block

**Non-editable text display**.

#### Properties
- **Text**: The text to display (FText)
- **Color and Opacity**: Text color
- **Font**: Font family, size, style
- **Justification**: Left, Center, Right
- **Auto Wrap Text**: Wrap to fit width

#### Example
```cpp
// C++ binding
UFUNCTION(BlueprintPure)
FText GetTodoCountText() const
{
    return FText::Format(LOCTEXT("TodoCount", "{0} todos"), GetTodoCount());
}
```

### Editable Text / Editable Text Box

**User input field**.

#### Properties
- **Text**: Current text value
- **Hint Text**: Placeholder text when empty
- **Is Read Only**: Prevent editing
- **Is Password**: Hide text with asterisks

#### Events
- **On Text Changed**: Fired as user types
- **On Text Committed**: Fired on Enter or focus loss

#### Example Blueprint
```blueprint
Editable Text Box → On Text Committed
  └─> Get Text
      └─> Add Todo (Text)
      └─> Clear Text
```

### Button

**Clickable button**.

#### Properties
- **Style**: Normal, Hovered, Pressed, Disabled states
- **Is Enabled**: Can be clicked
- **Click Method**: Mouse Down, Mouse Up, etc.

#### Events
- **On Clicked**: Fired when button is clicked
- **On Pressed**: Fired when mouse/touch down
- **On Released**: Fired when mouse/touch up
- **On Hovered**: Fired when mouse enters
- **On Unhovered**: Fired when mouse exits

#### Example
```
Button
└─ Horizontal Box (Content)
    ├─ Image "Icon"
    └─ Text Block "Add Todo"
```

### Checkbox

**Toggle on/off**.

#### Properties
- **Checked State**: Checked, Unchecked, Undetermined
- **Widget Style**: Checkbox appearance

#### Events
- **On Check State Changed**: Fired when toggled

#### Example
```blueprint
Checkbox → On Check State Changed (Is Checked)
  └─> Branch (Is Checked)
      ├─> True: Toggle Completion (True)
      └─> False: Toggle Completion (False)
```

### Image

**Displays a texture or material**.

#### Properties
- **Brush**: Image asset, color, tiling
- **Color and Opacity**: Tint color
- **Desired Size**: Override dimensions

#### Use Cases
- Icons
- Backgrounds
- Decorative elements

### Progress Bar

**Visual progress indicator**.

#### Properties
- **Percent**: 0.0 to 1.0 (0% to 100%)
- **Fill Color and Opacity**: Bar color
- **Background Color**: Track color

#### Example
```blueprint
Get Completed Todo Count → Divide by Get Total Todo Count → Set Percent
```

### Combo Box (String)

**Dropdown selection**.

#### Properties
- **Options**: TArray<FString> of choices
- **Selected Option**: Currently selected item

#### Events
- **On Selection Changed**: Fired when selection changes

#### Example
```blueprint
Event Construct
  └─> Clear Options
      └─> Add Option "Low"
      └─> Add Option "Normal"
      └─> Add Option "High"
      └─> Set Selected Option "Normal"

On Selection Changed
  └─> Switch on String
      ├─> "Low": Set Priority (Low)
      ├─> "Normal": Set Priority (Normal)
      └─> "High": Set Priority (High)
```

---

## Anchors and Alignment

### What Are Anchors?

**Anchors** define how a widget is attached to its parent during resizing.

### Anchor Presets

In the Designer, click the anchor icon in the Details panel to choose presets:

| Preset | Description | Use Case |
|--------|-------------|----------|
| **Top-Left** | Widget stays in top-left corner | Logo, menu button |
| **Top-Center** | Widget stays centered at top | Title text |
| **Top-Right** | Widget stays in top-right corner | Settings button |
| **Center** | Widget stays centered | Modal dialogs |
| **Bottom-Left** | Widget stays in bottom-left | Status text |
| **Bottom-Right** | Widget stays in bottom-right | Close button |
| **Fill** | Widget stretches to fill parent | Background images |
| **Horizontal Fill** | Widget stretches horizontally | Top bar, bottom bar |
| **Vertical Fill** | Widget stretches vertically | Sidebar |

### Anchor Points

Anchors are defined by four values (0.0 to 1.0):
- **Minimum**: (X, Y) of top-left anchor
- **Maximum**: (X, Y) of bottom-right anchor

```
Anchors: Min (0, 0), Max (0, 0) → Top-Left corner
Anchors: Min (1, 1), Max (1, 1) → Bottom-Right corner
Anchors: Min (0.5, 0.5), Max (0.5, 0.5) → Center
Anchors: Min (0, 0), Max (1, 1) → Fill entire parent
```

### Alignment

**Alignment** defines the pivot point within the widget (0.0 to 1.0).

- **Alignment X = 0.0**: Left edge is pivot
- **Alignment X = 0.5**: Center is pivot (default)
- **Alignment X = 1.0**: Right edge is pivot

**Example**: To position a button in the bottom-right:
1. Anchors: Min (1, 1), Max (1, 1) (bottom-right anchor)
2. Position: (-10, -10) (offset from bottom-right)
3. Alignment: (1, 1) (pivot is bottom-right of button)

### Responsive Design with Anchors

```
Example: Health Bar (should stretch horizontally at top)

Canvas Panel (Root)
└─ Progress Bar "Health"
    ├─ Anchors: Min (0, 0), Max (1, 0)  ← Horizontal fill at top
    ├─ Offsets: Left 10, Top 10, Right -10, Bottom 40
    └─ Alignment: (0.5, 0)
```

When window resizes, health bar stretches to match width.

---

## Data Binding

**Data Binding** connects widget properties to Blueprint variables or functions.

### Text Binding

#### Method 1: Direct Binding to Variable

1. Select Text Block in Designer
2. Details → Text → **Bind** → Create Binding
3. Select or create a variable
4. Widget auto-updates when variable changes

#### Method 2: Binding to Function

1. Bind → Create Binding
2. Implement function:

```blueprint
Function: GetTodoCountText (Returns FText)
  └─> Get Todo Manager
      └─> Get Todo Count
          └─> To Text
              └─> Format Text "{0} todos"
```

3. Return value is shown in text block
4. Function is called every frame (for pure functions)

### Visibility Binding

```blueprint
Function: GetEditButtonVisibility (Returns ESlateVisibility)
  └─> Branch (Is Edit Mode)
      ├─> True: Return Collapsed
      └─> False: Return Visible
```

### Color Binding

```blueprint
Function: GetPriorityColor (Returns FSlateColor)
  └─> Switch on Priority
      ├─> Low: Return Gray
      ├─> Normal: Return White
      ├─> High: Return Orange
      └─> Critical: Return Red
```

### Image Binding

```blueprint
Function: GetCheckboxImage (Returns FSlateBrush)
  └─> Branch (Is Completed)
      ├─> True: Return CheckedTexture
      └─> False: Return UncheckedTexture
```

### Performance Note

**Bound functions are called frequently (often every frame).**

- ✅ **GOOD**: Simple getters, pure functions
- ❌ **BAD**: Expensive calculations, non-pure functions

For expensive operations, cache the result and only update when data changes (via events).

---

## Widget Animations

### Creating an Animation

1. Open Widget Blueprint
2. **Animations Tab** (bottom)
3. Click **+ Animation** → Name it (e.g., "FadeIn")
4. **Timeline** appears

### Adding Tracks

1. Click **+ Track** → Select widget
2. Choose property to animate (Opacity, Position, Scale, Color, etc.)
3. Add keyframes:
   - Scrub timeline to time (e.g., 0.0s, 0.3s)
   - Set keyframe value (e.g., Opacity 0.0 → 1.0)

### Example: Fade In Animation

```
Animation: FadeIn (Duration: 0.3s)
  Track: Root Widget → Render Opacity
    ├─ Keyframe 0.0s: Opacity = 0.0
    └─ Keyframe 0.3s: Opacity = 1.0
```

### Playing Animations

#### In Blueprint Event Graph

```blueprint
Event Construct
  └─> Play Animation (FadeIn)
      ├─ Start Time: 0.0
      ├─ Num Loops: 1
      ├─ Play Mode: Forward
      └─ Speed: 1.0
```

#### With Callbacks

```blueprint
Play Animation (FadeIn)
  └─> Finished → [Do Something After Animation]
```

### Reversing Animations

```blueprint
Play Animation (FadeOut)
  └─ Play Mode: Reverse
```

### Looping Animations

```blueprint
Play Animation (Pulse)
  └─ Num Loops: 0  ← Infinite loop
```

### Common Animation Patterns

#### Fade In/Out
- **Track**: Render Opacity
- **Values**: 0.0 ↔ 1.0

#### Slide In/Out
- **Track**: Render Translation (X or Y)
- **Values**: -500, 0 ↔ 0, 0

#### Scale Pulse
- **Track**: Render Scale
- **Values**: 1.0, 1.0 → 1.1, 1.1 → 1.0, 1.0

#### Color Transition
- **Track**: Color and Opacity
- **Values**: Red → Yellow → Green

### Todo List Animation Examples

#### Add Todo Animation

```
Animation: AddTodoAnim (Duration: 0.3s)
  Track: NewTodoWidget → Render Translation Y
    ├─ Keyframe 0.0s: Y = -50
    └─ Keyframe 0.3s: Y = 0
  Track: NewTodoWidget → Render Opacity
    ├─ Keyframe 0.0s: Opacity = 0.0
    └─ Keyframe 0.3s: Opacity = 1.0
```

#### Delete Todo Animation

```
Animation: DeleteAnim (Duration: 0.2s)
  Track: TodoWidget → Render Translation X
    ├─ Keyframe 0.0s: X = 0
    └─ Keyframe 0.2s: X = 400  ← Slide out
  Track: TodoWidget → Render Opacity
    ├─ Keyframe 0.0s: Opacity = 1.0
    └─ Keyframe 0.2s: Opacity = 0.0
```

#### Completion Checkmark Animation

```
Animation: CheckAnim (Duration: 0.2s)
  Track: Checkbox → Render Scale
    ├─ Keyframe 0.0s: Scale = 1.0, 1.0
    ├─ Keyframe 0.1s: Scale = 1.3, 1.3
    └─ Keyframe 0.2s: Scale = 1.0, 1.0
```

---

## Events and Input

### Widget Events

#### On Clicked (Button)

```blueprint
Button → Details → Events → On Clicked [+]
  └─> [Event logic]
```

#### On Text Committed (Editable Text Box)

```blueprint
EditableTextBox → On Text Committed (Text, CommitMethod)
  └─> Branch (CommitMethod == OnEnter)
      └─> Add Todo (Text)
```

#### On Check State Changed (Checkbox)

```blueprint
Checkbox → On Check State Changed (bIsChecked)
  └─> Toggle Todo Completion (Todo ID, bIsChecked)
```

### Custom Events

Create reusable events:

```blueprint
Event Graph → Right-click → Add Custom Event "RefreshTodoList"
  └─> [Implementation]

// Call from anywhere
Call RefreshTodoList
```

### Input Actions

#### Keyboard Input

```blueprint
Event Construct
  └─> Set Is Focusable (True)
      └─> Set Keyboard Focus (Self)

Override OnKeyDown
  ├─> Switch on Key
  │   ├─ Enter: Submit Todo
  │   ├─ Escape: Cancel Edit
  │   └─ Delete: Delete Selected Todo
  └─> Return Handled
```

#### Mouse Input

```blueprint
Override OnMouseButtonDown
  └─> [Handle mouse click]
```

### Event Dispatchers from C++

```cpp
// C++: TodoManager.h
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FOnTodosChanged);

UPROPERTY(BlueprintAssignable)
FOnTodosChanged OnTodosChanged;
```

```blueprint
// Blueprint: Bind to event
Get Todo Manager
  └─> Assign On Todos Changed
      └─> Refresh Widget
```

---

## Styling and Appearance

### Widget Style Assets

UMG styles are defined in Style assets.

#### Creating a Button Style

1. Content Browser → Right-click → User Interface → Widget Style → Button Style
2. Name it `BS_TodoButton`
3. Open and edit:
   - **Normal**: Default appearance
   - **Hovered**: Mouse over
   - **Pressed**: Clicked
   - **Disabled**: Not interactable

#### Applying a Style

1. Select Button in Designer
2. Details → Appearance → Style
3. Choose `BS_TodoButton`

### Inline Styling

For quick iteration, style directly on widget:

#### Button
- **Normal**: Tint, Background image
- **Hovered**: Tint, Background image
- **Pressed**: Tint, Background image

#### Text Block
- **Font**: Font family, size, typeface
- **Color**: Text color
- **Shadow**: Text shadow offset, color

#### Image
- **Brush**: Texture, color, tiling
- **Color and Opacity**: Tint

### Common Styling Properties

#### Colors

```
Primary: #007AFF (Blue)
Background: #1E1E1E (Dark Gray)
Surface: #2D2D2D (Light Gray)
Text: #FFFFFF (White)
Success: #34C759 (Green)
Danger: #FF3B30 (Red)
Warning: #FFA500 (Orange)
```

#### Fonts

- **Roboto**: Clean, modern
- **Sizes**: Title 48pt, Body 16pt, Small 12pt

#### Spacing

- **Padding**: 8-16px
- **Margin**: 4-8px
- **Border Radius**: 8px (for rounded corners)

### Material-Based UI

For advanced effects, use **Materials**:

1. Create Material: `M_UIGlow`
2. Content → Material
3. Apply to Image widget → Brush → Image → [Your Material]

**Use Cases**:
- Glowing buttons
- Animated backgrounds
- Particle effects in UI

---

## C++ Widget Integration

### Creating a C++ Widget Base Class

```cpp
// TodoWidgetBase.h
UCLASS(Abstract, Blueprintable)
class TODOLISTUE_API UTodoWidgetBase : public UUserWidget
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable, Category="Widget")
    virtual void InitializeWidget(UTodoManager* InTodoManager);

    UFUNCTION(BlueprintNativeEvent, Category="Widget")
    void RefreshWidget();
    virtual void RefreshWidget_Implementation();

protected:
    UPROPERTY(BlueprintReadOnly, Category="Widget")
    UTodoManager* TodoManager;

    virtual void NativeConstruct() override;
    virtual void NativeDestruct() override;
};
```

### Inheriting in Blueprint

1. Content Browser → Right-click → User Interface → Widget Blueprint
2. **Pick Parent Class**: Choose `TodoWidgetBase` (not UUserWidget)
3. Name it `WBP_MainMenu`
4. Now it has access to all C++ functions and properties

### Binding C++ Properties

```cpp
// C++
UPROPERTY(BlueprintReadOnly, Category="Widget", meta=(BindWidget))
UTextBlock* TitleTextBlock;
```

**`meta=(BindWidget)`**: Blueprint widget MUST have a widget named `TitleTextBlock`, or compilation fails.

**In Blueprint Designer**:
- Add Text Block
- Name it exactly **"TitleTextBlock"**
- Now C++ can access it directly

### Calling C++ from Blueprint

```blueprint
Get Todo Manager → Add Todo (Title)
```

C++ function is exposed via `UFUNCTION(BlueprintCallable)`.

### Calling Blueprint from C++

```cpp
// C++ calls Blueprint-implemented event
UpdateTodoListDisplay();  // BlueprintImplementableEvent
```

---

## Performance Optimization

### 1. Avoid Tick in Widgets

```cpp
// ❌ BAD
virtual void NativeTick(const FGeometry& MyGeometry, float InDeltaTime) override
{
    Super::NativeTick(MyGeometry, InDeltaTime);
    UpdateDisplay();  // Called every frame!
}

// ✅ GOOD: Event-driven updates
void UTodoWidget::BindToEvents()
{
    TodoManager->OnTodosChanged.AddDynamic(this, &UTodoWidget::UpdateDisplay);
}
```

### 2. Widget Pooling

For dynamic lists (like todo items), reuse widgets instead of creating new ones.

```cpp
// Widget pool implementation
TArray<UTodoItemWidget*> WidgetPool;

UTodoItemWidget* GetPooledWidget()
{
    if (WidgetPool.Num() > 0)
    {
        return WidgetPool.Pop();  // Reuse
    }
    return CreateWidget<UTodoItemWidget>(this, WidgetClass);  // Create new
}

void ReturnWidgetToPool(UTodoItemWidget* Widget)
{
    Widget->SetVisibility(ESlateVisibility::Collapsed);
    WidgetPool.Add(Widget);
}
```

### 3. Invalidate Only When Needed

```cpp
// Only invalidate/repaint when data changes
if (NewData != OldData)
{
    Invalidate(EInvalidateWidget::Layout);
}
```

### 4. Collapse Hidden Widgets

```cpp
// Use Collapsed instead of Hidden for better performance
SetVisibility(ESlateVisibility::Collapsed);  // ✅ Not in layout
// vs
SetVisibility(ESlateVisibility::Hidden);     // ❌ Still in layout, just invisible
```

### 5. Limit Bindings

- Bindings are evaluated frequently (often every frame)
- Use event-driven updates instead

```cpp
// ❌ BAD: Binding that runs every frame
Function GetTodoCountText (Binding)
  └─> Expensive calculation

// ✅ GOOD: Update via event
OnTodosChanged
  └─> Set Text (Calculate once)
```

---

## Todo List UI Implementation

### Main Menu Widget (WBP_MainMenu)

```
Canvas Panel (Root)
└─ Vertical Box (MainContainer)
    ├─ Text Block "Todo List" (Title)
    ├─ Horizontal Box (InputRow)
    │   ├─ Editable Text Box (TodoInput)
    │   └─ Button "Add" (AddButton)
    ├─ Horizontal Box (FilterRow)
    │   ├─ Button "All" (AllFilterButton)
    │   ├─ Button "Active" (ActiveFilterButton)
    │   └─ Button "Completed" (CompletedFilterButton)
    ├─ Scroll Box (TodoListScroll)
    │   └─ Vertical Box (TodoItemsContainer)  ← Dynamic items added here
    ├─ Horizontal Box (StatsRow)
    │   ├─ Text Block (StatsText) [Binding: GetStatsText()]
    │   └─ Button "Clear Completed" (ClearButton)
    └─ Horizontal Box (ActionsRow)
        ├─ Button "Save" (SaveButton)
        └─ Button "Load" (LoadButton)
```

### Todo Item Widget (WBP_TodoItem)

```
Border (ItemBorder)
└─ Horizontal Box (ContentRow)
    ├─ Checkbox (CompletionCheck)
    ├─ Vertical Box (TextContainer)
    │   ├─ Editable Text Box (TitleText) [Binding: GetTodoTitle()]
    │   └─ Horizontal Box (MetaRow)
    │       ├─ Text Block (PriorityText) [Binding: GetPriorityText()]
    │       └─ Text Block (DateText) [Binding: GetDateText()]
    ├─ Combo Box (PriorityCombo) [Visibility: GetEditModeVisibility()]
    ├─ Button "Edit" (EditButton)
    └─ Button "Delete" (DeleteButton)
```

---

## Best Practices

### 1. Naming Conventions

- **Widget Blueprints**: `WBP_` prefix (e.g., `WBP_MainMenu`)
- **Widget variables**: Descriptive names (e.g., `TodoInputField`, not `EditableTextBox_1`)
- **Buttons**: Verb-based (e.g., `AddButton`, `DeleteButton`)

### 2. Organization

- **Group related widgets** in panels
- **Use folders** in Hierarchy panel
- **Name everything** clearly (no "Button_0", "TextBlock_23")

### 3. Responsive Design

- **Use anchors** for responsive layout
- **Test different resolutions**: 1920x1080, 1280x720, 3840x2160
- **Use DPI scaling** for high-resolution displays

### 4. Accessibility

- **Color contrast**: WCAG AA minimum (4.5:1 for text)
- **Font sizes**: Minimum 12pt for body text
- **Keyboard navigation**: Support Tab, Enter, Escape
- **Screen reader**: Add tooltips and ARIA labels

### 5. Modularity

- **Create reusable widgets** (e.g., `WBP_TodoItem` used multiple times)
- **Widget components**: Break complex UIs into smaller widgets
- **Styles**: Use style assets for consistency

### 6. Event-Driven Updates

- **Avoid Tick**: Use events and delegates instead
- **Bind to data changes**: Listen to C++ events
- **Update only when needed**: Don't refresh every frame

### 7. Animation Polish

- **Smooth transitions**: Use easing curves (not linear)
- **Feedback**: Visual/audio feedback for user actions
- **Performance**: Keep animations under 0.5s for UI responsiveness

---

## Conclusion

UMG is a powerful and flexible UI system that combines visual design with Blueprint logic and C++ integration. Key takeaways:

1. **Use the Designer** for layout and visual design
2. **Use Blueprint** for UI behavior and events
3. **Use C++** for core logic and data structures
4. **Leverage data binding** for dynamic content
5. **Animations** provide polish and feedback
6. **Anchors** enable responsive design
7. **Optimize** with event-driven updates and widget pooling

**Next Steps**:
- Explore the Todo List widgets in the project
- Experiment with different layouts and styles
- Create custom widgets for your own projects
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system-level design

---

**Happy UI Designing!** 🎨
