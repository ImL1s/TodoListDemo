# GTK Concepts and Patterns

A comprehensive guide to GTK4 concepts, architecture, and design patterns as demonstrated in the Todo List application.

## Table of Contents

1. [GTK Architecture](#gtk-architecture)
2. [Widget System](#widget-system)
3. [Event Loop and Main Loop](#event-loop-and-main-loop)
4. [Signals and Callbacks](#signals-and-callbacks)
5. [Layout Management](#layout-management)
6. [CSS Theming](#css-theming)
7. [Application Structure](#application-structure)
8. [Best Practices](#best-practices)

## GTK Architecture

### Overview

GTK (GIMP Toolkit) is a multi-platform toolkit for creating graphical user interfaces.

```
Application Layer (Your Code)
    ↓
GTK4 (Widgets, Layout)
    ↓
GDK (Drawing, Events)
    ↓
Cairo (2D Graphics)
    ↓
Platform (X11, Wayland, Windows, macOS)
```

### Core Libraries

1. **GLib**: Basic data structures (lists, hash tables, etc.)
2. **GObject**: Object system (covered in GOBJECT_GUIDE.md)
3. **GIO**: I/O and networking
4. **GDK**: Low-level graphics and windowing
5. **GSK**: Scene graph for rendering
6. **GTK**: High-level widgets and application framework

### GTK4 vs GTK3

Major changes in GTK4:
- Removed deprecated widgets
- Better performance with GPU rendering
- Simplified event handling
- Improved CSS support
- Modern widget gallery
- Touch and gesture support

## Widget System

### Widget Hierarchy

All GTK widgets inherit from GtkWidget:

```
GObject
  ↓
GInitiallyUnowned
  ↓
GtkWidget
  ├── GtkWindow
  │   └── GtkApplicationWindow
  ├── GtkBox
  ├── GtkButton
  ├── GtkEntry
  ├── GtkLabel
  ├── GtkListBox
  │   └── GtkListBoxRow
  └── ...
```

### Widget Lifecycle

1. **Construction**: Create widget with `gtk_xxx_new()`
2. **Configuration**: Set properties and connect signals
3. **Addition**: Add to parent container
4. **Display**: Show with `gtk_widget_show()`
5. **Event Handling**: Process user interactions
6. **Destruction**: Automatic when parent is destroyed

### Common Widgets

#### GtkWindow

Main application window:

```c
GtkWidget *window = gtk_application_window_new(app);
gtk_window_set_title(GTK_WINDOW(window), "My App");
gtk_window_set_default_size(GTK_WINDOW(window), 600, 400);
gtk_window_present(GTK_WINDOW(window));
```

#### GtkBox

Container for arranging widgets:

```c
// Horizontal box
GtkWidget *box = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 6);
gtk_box_append(GTK_BOX(box), child1);
gtk_box_append(GTK_BOX(box), child2);

// Vertical box
GtkWidget *vbox = gtk_box_new(GTK_ORIENTATION_VERTICAL, 12);
```

#### GtkButton

Clickable button:

```c
GtkWidget *button = gtk_button_new_with_label("Click Me");
g_signal_connect(button, "clicked",
                G_CALLBACK(on_button_clicked),
                user_data);
```

#### GtkEntry

Text input field:

```c
GtkWidget *entry = gtk_entry_new();
gtk_entry_set_placeholder_text(GTK_ENTRY(entry), "Enter text...");

// Get/set text
const gchar *text = gtk_editable_get_text(GTK_EDITABLE(entry));
gtk_editable_set_text(GTK_EDITABLE(entry), "New text");
```

#### GtkLabel

Text display:

```c
GtkWidget *label = gtk_label_new("Hello World");
gtk_label_set_markup(GTK_LABEL(label), "<b>Bold Text</b>");
gtk_label_set_xalign(GTK_LABEL(label), 0.0);  // Left align
```

#### GtkListBox

Scrollable list of items:

```c
GtkWidget *list_box = gtk_list_box_new();
gtk_list_box_set_selection_mode(GTK_LIST_BOX(list_box),
                                GTK_SELECTION_NONE);

// Add rows
gtk_list_box_append(GTK_LIST_BOX(list_box), row_widget);
```

### Widget Properties

Widgets have properties that can be set:

```c
// Using g_object_set
g_object_set(widget,
            "margin-start", 12,
            "margin-end", 12,
            "sensitive", TRUE,
            NULL);

// Using specific functions
gtk_widget_set_margin_start(widget, 12);
gtk_widget_set_margin_end(widget, 12);
gtk_widget_set_sensitive(widget, TRUE);
```

### Widget States and CSS Classes

```c
// Add CSS class
gtk_widget_add_css_class(widget, "suggested-action");
gtk_widget_add_css_class(widget, "destructive-action");
gtk_widget_add_css_class(widget, "dim-label");

// Remove CSS class
gtk_widget_remove_css_class(widget, "suggested-action");

// Check if has class
gboolean has = gtk_widget_has_css_class(widget, "suggested-action");
```

## Event Loop and Main Loop

### The Main Loop

GTK is event-driven, running a main loop:

```c
int main(int argc, char *argv[])
{
    GtkApplication *app = gtk_application_new("com.example.App",
                                              G_APPLICATION_FLAGS_NONE);

    g_signal_connect(app, "activate", G_CALLBACK(on_activate), NULL);

    // Enters main loop, blocks until app quits
    int status = g_application_run(G_APPLICATION(app), argc, argv);

    g_object_unref(app);
    return status;
}
```

### Event Flow

```
User Action (mouse click, key press)
    ↓
GDK Event
    ↓
GTK Widget (event controllers)
    ↓
Signal Emission
    ↓
Signal Handlers (your callbacks)
    ↓
Widget Update
    ↓
Render Queue
    ↓
Screen Update
```

### Event Controllers

GTK4 uses event controllers instead of event signals:

```c
// Key events
GtkEventController *key_controller = gtk_event_controller_key_new();
g_signal_connect(key_controller, "key-pressed",
                G_CALLBACK(on_key_pressed), NULL);
gtk_widget_add_controller(widget, key_controller);

// Mouse clicks
GtkGesture *click = gtk_gesture_click_new();
g_signal_connect(click, "pressed",
                G_CALLBACK(on_button_press), NULL);
gtk_widget_add_controller(widget, GTK_EVENT_CONTROLLER(click));

// Motion events
GtkEventController *motion = gtk_event_controller_motion_new();
g_signal_connect(motion, "motion",
                G_CALLBACK(on_mouse_motion), NULL);
gtk_widget_add_controller(widget, motion);
```

## Signals and Callbacks

### Widget Signals

Common widget signals:

```c
// Button
"clicked"       // Button was clicked
"activate"      // Activated via keyboard

// Entry
"activate"      // Enter key pressed
"changed"       // Text changed

// Window
"close-request" // User wants to close window
"destroy"       // Window being destroyed

// List Box
"row-selected"  // Row was selected
"row-activated" // Row was double-clicked
```

### Signal Connection

```c
// Basic connection
gulong handler_id = g_signal_connect(
    widget,
    "signal-name",
    G_CALLBACK(callback_function),
    user_data
);

// Automatic disconnect when object destroyed
g_signal_connect_object(
    widget,
    "clicked",
    G_CALLBACK(on_clicked),
    object,  // Disconnect when object is destroyed
    0
);
```

### Callback Functions

```c
// Signal handler signature
static void
on_button_clicked(GtkButton *button, gpointer user_data)
{
    g_print("Button clicked!\n");
}

// With return value (to stop propagation)
static gboolean
on_key_pressed(GtkEventControllerKey *controller,
               guint keyval,
               guint keycode,
               GdkModifierType state,
               gpointer user_data)
{
    if (keyval == GDK_KEY_Escape) {
        g_print("Escape pressed!\n");
        return TRUE;  // Stop event propagation
    }
    return FALSE;  // Continue propagation
}
```

## Layout Management

### Box Layout

Most common layout container:

```c
// Create box
GtkWidget *box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 12);

// Add children
gtk_box_append(GTK_BOX(box), child1);
gtk_box_append(GTK_BOX(box), child2);
gtk_box_prepend(GTK_BOX(box), first_child);

// Set child properties
gtk_widget_set_hexpand(child1, TRUE);   // Expand horizontally
gtk_widget_set_vexpand(child2, TRUE);   // Expand vertically
gtk_widget_set_halign(child1, GTK_ALIGN_CENTER);
```

### Grid Layout

Table-like layout:

```c
GtkWidget *grid = gtk_grid_new();
gtk_grid_set_row_spacing(GTK_GRID(grid), 6);
gtk_grid_set_column_spacing(GTK_GRID(grid), 12);

// Attach widgets: (child, column, row, width, height)
gtk_grid_attach(GTK_GRID(grid), label1, 0, 0, 1, 1);
gtk_grid_attach(GTK_GRID(grid), entry1, 1, 0, 1, 1);
gtk_grid_attach(GTK_GRID(grid), label2, 0, 1, 1, 1);
gtk_grid_attach(GTK_GRID(grid), entry2, 1, 1, 1, 1);
```

### Scrolled Window

Add scrolling to content:

```c
GtkWidget *scrolled = gtk_scrolled_window_new();
gtk_scrolled_window_set_policy(GTK_SCROLLED_WINDOW(scrolled),
                              GTK_POLICY_NEVER,      // Horizontal
                              GTK_POLICY_AUTOMATIC); // Vertical
gtk_scrolled_window_set_child(GTK_SCROLLED_WINDOW(scrolled), content);
```

### Size and Alignment

```c
// Size requests
gtk_widget_set_size_request(widget, width, height);

// Expand properties
gtk_widget_set_hexpand(widget, TRUE);
gtk_widget_set_vexpand(widget, TRUE);

// Alignment
gtk_widget_set_halign(widget, GTK_ALIGN_START);   // Left
gtk_widget_set_halign(widget, GTK_ALIGN_CENTER);  // Center
gtk_widget_set_halign(widget, GTK_ALIGN_END);     // Right
gtk_widget_set_halign(widget, GTK_ALIGN_FILL);    // Stretch

// Margins
gtk_widget_set_margin_start(widget, 12);
gtk_widget_set_margin_end(widget, 12);
gtk_widget_set_margin_top(widget, 6);
gtk_widget_set_margin_bottom(widget, 6);
```

## CSS Theming

### Loading CSS

```c
GtkCssProvider *provider = gtk_css_provider_new();
gtk_css_provider_load_from_data(provider,
    ".my-class { color: red; }\n"
    "button { border-radius: 6px; }\n",
    -1);

gtk_style_context_add_provider_for_display(
    gdk_display_get_default(),
    GTK_STYLE_PROVIDER(provider),
    GTK_STYLE_PROVIDER_PRIORITY_APPLICATION
);

g_object_unref(provider);
```

### CSS Selectors

```css
/* Widget type */
button { }
label { }
entry { }

/* CSS classes */
.suggested-action { }
.destructive-action { }
.dim-label { }

/* Pseudo-classes */
button:hover { }
button:active { }
entry:focus { }
*:disabled { }

/* Combinations */
button.suggested-action:hover { }
box > button { }
```

### Common Properties

```css
/* Colors */
color: #333333;
background-color: rgba(255, 0, 0, 0.5);

/* Text */
font-size: 12pt;
font-weight: bold;
text-decoration: underline;

/* Spacing */
margin: 12px;
padding: 6px 12px;

/* Border */
border: 1px solid #cccccc;
border-radius: 6px;

/* Opacity */
opacity: 0.5;

/* Transitions */
transition: background-color 200ms ease;
```

### Dynamic Styling

```c
// Add/remove CSS classes
gtk_widget_add_css_class(button, "suggested-action");
gtk_widget_remove_css_class(button, "suggested-action");

// Custom CSS per widget
GtkStyleContext *context = gtk_widget_get_style_context(widget);
gtk_style_context_add_class(context, "my-class");
```

## Application Structure

### GtkApplication

Modern GTK apps use GtkApplication:

```c
static void
on_activate(GtkApplication *app, gpointer user_data)
{
    GtkWidget *window = gtk_application_window_new(app);
    // ... setup window ...
    gtk_window_present(GTK_WINDOW(window));
}

int main(int argc, char *argv[])
{
    GtkApplication *app = gtk_application_new(
        "com.example.MyApp",
        G_APPLICATION_FLAGS_NONE
    );

    g_signal_connect(app, "activate", G_CALLBACK(on_activate), NULL);

    int status = g_application_run(G_APPLICATION(app), argc, argv);

    g_object_unref(app);
    return status;
}
```

### Application Actions

```c
// Create action
GSimpleAction *quit_action = g_simple_action_new("quit", NULL);
g_signal_connect(quit_action, "activate",
                G_CALLBACK(on_quit_activate), app);
g_action_map_add_action(G_ACTION_MAP(app), G_ACTION(quit_action));

// Set keyboard accelerator
const gchar *quit_accels[] = { "<Ctrl>Q", NULL };
gtk_application_set_accels_for_action(
    GTK_APPLICATION(app),
    "app.quit",
    quit_accels
);
```

### Header Bar

Modern window decoration:

```c
GtkWidget *header_bar = gtk_header_bar_new();
gtk_header_bar_set_show_title_buttons(GTK_HEADER_BAR(header_bar), TRUE);

// Add widgets to header bar
gtk_header_bar_pack_start(GTK_HEADER_BAR(header_bar), left_button);
gtk_header_bar_pack_end(GTK_HEADER_BAR(header_bar), right_button);

// Set as window titlebar
gtk_window_set_titlebar(GTK_WINDOW(window), header_bar);
```

## Best Practices

### 1. Use Composite Templates (Not used in simple example)

For complex widgets, use UI files:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<interface>
  <template class="MyWidget" parent="GtkBox">
    <property name="orientation">vertical</property>
    <child>
      <object class="GtkLabel" id="title_label">
        <property name="label">Title</property>
      </object>
    </child>
  </template>
</interface>
```

### 2. Separate Concerns

```c
// Model: Data
typedef struct {
    GListStore *items;
} Model;

// View: UI
typedef struct {
    GtkWidget *window;
    GtkWidget *list_box;
} View;

// Controller: Logic (signals connect model and view)
```

### 3. Proper Widget Lifecycle

```c
// DON'T manually destroy children
gtk_widget_destroy(child);  // Wrong!

// DO remove from parent
gtk_box_remove(GTK_BOX(parent), child);  // Right!

// Or just destroy parent
gtk_window_destroy(GTK_WINDOW(window));  // Destroys all children
```

### 4. Signal Safety

```c
// Store handler IDs for cleanup
struct {
    GtkWidget *button;
    gulong handler_id;
} MyData;

// Connect
data->handler_id = g_signal_connect(...);

// Disconnect before destroying
g_signal_handler_disconnect(data->button, data->handler_id);
```

### 5. Use CSS for Styling

```c
// DON'T set colors directly in code
gtk_widget_set_color(widget, &color);  // Old GTK2 style

// DO use CSS classes
gtk_widget_add_css_class(widget, "error");
```

```css
.error {
    color: #e01b24;
    background-color: #f6d9d9;
}
```

### 6. Follow HIG

GNOME Human Interface Guidelines:
- Use 12px spacing between major elements
- Use 6px spacing between related elements
- Window minimum size: 360×294
- Use sentence case for labels
- Use title case for buttons
- Provide keyboard shortcuts

### 7. Accessibility

```c
// Set accessible names
gtk_accessible_update_property(
    GTK_ACCESSIBLE(widget),
    GTK_ACCESSIBLE_PROPERTY_LABEL, "Close button",
    -1
);

// Use proper labels
gtk_label_set_mnemonic_widget(label, entry);
```

## Summary

This guide covered:
- GTK architecture and widget hierarchy
- Common widgets and their usage
- Event loop and signal system
- Layout management
- CSS theming
- Application structure
- Best practices

For more information:
- [GTK4 Documentation](https://docs.gtk.org/gtk4/)
- [GNOME Developer Center](https://developer.gnome.org/)
- [GTK4 Widget Gallery](https://docs.gtk.org/gtk4/visual_index.html)

Next steps:
- Study the source code in `src/todo_window.c`
- Experiment with different widgets
- Read the GNOME HIG
- Build your own GTK application
