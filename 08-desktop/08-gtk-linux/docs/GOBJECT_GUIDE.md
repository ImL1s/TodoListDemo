# GObject System Guide

A comprehensive guide to understanding and using the GObject type system, as demonstrated in the GTK Todo List application.

## Table of Contents

1. [Introduction to GObject](#introduction-to-gobject)
2. [The Type System](#the-type-system)
3. [Creating GObject Classes](#creating-gobject-classes)
4. [Properties](#properties)
5. [Signals](#signals)
6. [Memory Management](#memory-management)
7. [Practical Examples](#practical-examples)
8. [Best Practices](#best-practices)

## Introduction to GObject

### What is GObject?

GObject is the object system used by GTK and GNOME. It provides:

- **Object-Oriented Programming in C**: Classes, inheritance, interfaces
- **Type System**: Runtime type information and dynamic type creation
- **Property System**: Named, typed properties with change notification
- **Signal System**: Type-safe callbacks for events
- **Reference Counting**: Automatic memory management

### Why GObject?

C doesn't have built-in OOP features. GObject provides:

1. **Polymorphism**: Virtual methods and interfaces
2. **Encapsulation**: Private data and public API
3. **Signal/Slot Pattern**: Flexible event handling
4. **Introspection**: Runtime type information
5. **Language Bindings**: Automatic bindings for Python, JavaScript, etc.

### Core Concepts

```
GObject (Base Class)
    ↓
TodoItem (Our Class)
    ├── Properties (title, completed, id)
    ├── Signals (changed, toggled)
    ├── Methods (get/set functions)
    └── Private Data (struct _TodoItem)
```

## The Type System

### Type Hierarchy

Every GObject type has a unique `GType` identifier:

```c
// Base types (fundamental)
G_TYPE_NONE      // void
G_TYPE_BOOLEAN   // gboolean
G_TYPE_INT       // gint
G_TYPE_STRING    // gchar*
G_TYPE_OBJECT    // GObject*

// Our custom type
TODO_TYPE_ITEM   // TodoItem*
```

### Type Registration

Types are registered at runtime:

```c
// Manual registration (old way)
GType type = g_type_register_static(
    G_TYPE_OBJECT,           // Parent type
    "TodoItem",              // Type name
    &type_info,             // Type information
    0                        // Flags
);

// Automatic registration (modern way)
G_DEFINE_TYPE(TodoItem, todo_item, G_TYPE_OBJECT)
```

### Type Macros

Common macros for type safety:

```c
// Define the type
#define TODO_TYPE_ITEM (todo_item_get_type())

// Declare the type (modern)
G_DECLARE_FINAL_TYPE(TodoItem, todo_item, TODO, ITEM, GObject)

// Cast with runtime check
TODO_ITEM(obj)

// Check type
TODO_IS_ITEM(obj)

// Cast without check (faster, use carefully)
((TodoItem*)(obj))
```

## Creating GObject Classes

### Step 1: Header File Declaration

**File: `todo_item.h`**

```c
#ifndef TODO_ITEM_H
#define TODO_ITEM_H

#include <glib-object.h>

G_BEGIN_DECLS

// 1. Define type macro
#define TODO_TYPE_ITEM (todo_item_get_type())

// 2. Declare the type
G_DECLARE_FINAL_TYPE(TodoItem, todo_item, TODO, ITEM, GObject)
//                   ^^^^^^^^  ^^^^^^^^^  ^^^^  ^^^^  ^^^^^^^
//                   TypeName  func_name  NS    Type  Parent

// 3. Declare public API
TodoItem *todo_item_new(const gchar *title);
const gchar *todo_item_get_title(TodoItem *self);
void todo_item_set_title(TodoItem *self, const gchar *title);

G_END_DECLS

#endif
```

### Step 2: Private Structure

**File: `todo_item.c`**

```c
#include "todo_item.h"

// Private instance structure
struct _TodoItem
{
    GObject parent_instance;  // MUST be first member

    // Private data members
    gchar *title;
    gboolean completed;
    guint id;
    GDateTime *created_at;
};

// Type registration
G_DEFINE_TYPE(TodoItem, todo_item, G_TYPE_OBJECT)
```

**Understanding `struct _TodoItem`:**

- Name starts with `_` (convention for private structs)
- First member MUST be parent instance
- All other members are private
- Only accessible within `todo_item.c`

### Step 3: Class Initialization

```c
static void
todo_item_class_init(TodoItemClass *klass)
{
    GObjectClass *object_class = G_OBJECT_CLASS(klass);

    // Override virtual methods
    object_class->finalize = todo_item_finalize;
    object_class->get_property = todo_item_get_property;
    object_class->set_property = todo_item_set_property;

    // Install properties (explained below)
    g_object_class_install_properties(object_class, N_PROPERTIES, properties);

    // Create signals (explained below)
    signals[SIGNAL_CHANGED] = g_signal_new(...);
}
```

**Purpose:**
- Called once per class (not per instance)
- Install properties
- Create signals
- Override virtual methods

### Step 4: Instance Initialization

```c
static void
todo_item_init(TodoItem *self)
{
    // Initialize instance data
    self->title = NULL;
    self->completed = FALSE;
    self->id = 0;
    self->created_at = g_date_time_new_now_local();
}
```

**Purpose:**
- Called for each new instance
- Initialize members to default values
- Allocate resources

### Step 5: Finalization (Cleanup)

```c
static void
todo_item_finalize(GObject *object)
{
    TodoItem *self = TODO_ITEM(object);

    // Free allocated memory
    g_clear_pointer(&self->title, g_free);
    g_clear_pointer(&self->created_at, g_date_time_unref);

    // Chain up to parent class
    G_OBJECT_CLASS(todo_item_parent_class)->finalize(object);
}
```

**Purpose:**
- Free resources
- Called when reference count reaches 0
- Always chain up to parent

## Properties

### Why Properties?

Properties provide:
- Type-safe value storage
- Change notification
- Introspection for language bindings
- Generic get/set interface

### Defining Properties

```c
enum {
    PROP_0,           // Always 0, reserved
    PROP_TITLE,       // Our properties start at 1
    PROP_COMPLETED,
    PROP_ID,
    N_PROPERTIES      // Total count
};

static GParamSpec *properties[N_PROPERTIES] = { NULL, };
```

### Installing Properties

```c
static void
todo_item_class_init(TodoItemClass *klass)
{
    // ...

    properties[PROP_TITLE] = g_param_spec_string(
        "title",                    // Property name
        "Title",                    // Nick (short description)
        "The todo item title",      // Blurb (long description)
        NULL,                       // Default value
        G_PARAM_READWRITE |         // Can read and write
        G_PARAM_CONSTRUCT |         // Set during construction
        G_PARAM_STATIC_STRINGS      // Don't copy strings
    );

    properties[PROP_COMPLETED] = g_param_spec_boolean(
        "completed",
        "Completed",
        "Whether the item is completed",
        FALSE,                      // Default: not completed
        G_PARAM_READWRITE | G_PARAM_CONSTRUCT
    );

    g_object_class_install_properties(object_class, N_PROPERTIES, properties);
}
```

### Property Types

Common property types:

```c
// String
g_param_spec_string("name", "Name", "Description", default, flags);

// Boolean
g_param_spec_boolean("active", "Active", "Is active?", FALSE, flags);

// Integer
g_param_spec_int("count", "Count", "Item count", 0, 100, 0, flags);

// Unsigned integer
g_param_spec_uint("id", "ID", "Unique ID", 0, G_MAXUINT, 0, flags);

// Float/Double
g_param_spec_double("value", "Value", "Float value", 0.0, 1.0, 0.5, flags);

// Object
g_param_spec_object("child", "Child", "Child object", CHILD_TYPE, flags);

// Boxed (GDateTime, etc.)
g_param_spec_boxed("datetime", "DateTime", "Timestamp", G_TYPE_DATE_TIME, flags);
```

### Property Flags

```c
G_PARAM_READABLE          // Can read (get)
G_PARAM_WRITABLE          // Can write (set)
G_PARAM_READWRITE         // Both read and write
G_PARAM_CONSTRUCT         // Set during construction
G_PARAM_CONSTRUCT_ONLY    // Only during construction
G_PARAM_STATIC_STRINGS    // Don't copy strings (optimization)
G_PARAM_EXPLICIT_NOTIFY   // Manual notify (optimization)
```

### Implementing Property Accessors

```c
static void
todo_item_get_property(GObject *object,
                       guint prop_id,
                       GValue *value,
                       GParamSpec *pspec)
{
    TodoItem *self = TODO_ITEM(object);

    switch (prop_id) {
        case PROP_TITLE:
            g_value_set_string(value, self->title);
            break;
        case PROP_COMPLETED:
            g_value_set_boolean(value, self->completed);
            break;
        case PROP_ID:
            g_value_set_uint(value, self->id);
            break;
        default:
            G_OBJECT_WARN_INVALID_PROPERTY_ID(object, prop_id, pspec);
            break;
    }
}

static void
todo_item_set_property(GObject *object,
                       guint prop_id,
                       const GValue *value,
                       GParamSpec *pspec)
{
    TodoItem *self = TODO_ITEM(object);

    switch (prop_id) {
        case PROP_TITLE:
            g_free(self->title);
            self->title = g_value_dup_string(value);
            break;
        case PROP_COMPLETED:
            self->completed = g_value_get_boolean(value);
            break;
        case PROP_ID:
            self->id = g_value_get_uint(value);
            break;
        default:
            G_OBJECT_WARN_INVALID_PROPERTY_ID(object, prop_id, pspec);
            break;
    }
}
```

### Using Properties

```c
// Using generic property API
g_object_get(item, "title", &title, NULL);
g_object_set(item, "completed", TRUE, NULL);

// Using custom accessors (preferred for performance)
const gchar *title = todo_item_get_title(item);
todo_item_set_completed(item, TRUE);

// Notification when property changes
g_signal_connect(item, "notify::title", G_CALLBACK(on_title_changed), NULL);
```

### Property Change Notification

```c
void
todo_item_set_title(TodoItem *self, const gchar *title)
{
    g_return_if_fail(TODO_IS_ITEM(self));

    if (g_strcmp0(self->title, title) == 0)
        return;  // No change, don't notify

    g_free(self->title);
    self->title = g_strdup(title);

    // Notify observers
    g_object_notify_by_pspec(G_OBJECT(self), properties[PROP_TITLE]);
}
```

## Signals

### What are Signals?

Signals are GObject's callback mechanism:
- Type-safe event system
- Multiple handlers per signal
- Automatic marshalling
- Emission hooks
- Accumulators for return values

### Defining Signals

```c
enum {
    SIGNAL_CHANGED,   // First signal
    SIGNAL_TOGGLED,   // Second signal
    N_SIGNALS         // Count
};

static guint signals[N_SIGNALS] = { 0, };
```

### Creating Signals

```c
static void
todo_item_class_init(TodoItemClass *klass)
{
    // ...

    signals[SIGNAL_CHANGED] = g_signal_new(
        "changed",                 // Signal name
        G_TYPE_FROM_CLASS(klass), // Type emitting signal
        G_SIGNAL_RUN_LAST,        // When to run handlers
        0,                        // Class closure offset
        NULL,                     // Accumulator
        NULL,                     // Accumulator data
        NULL,                     // C marshaller (auto)
        G_TYPE_NONE,             // Return type
        0                        // Number of parameters
    );

    signals[SIGNAL_TOGGLED] = g_signal_new(
        "toggled",
        G_TYPE_FROM_CLASS(klass),
        G_SIGNAL_RUN_LAST,
        0,
        NULL, NULL, NULL,
        G_TYPE_NONE,
        1,                       // One parameter
        G_TYPE_BOOLEAN          // Parameter type
    );
}
```

### Signal Flags

```c
G_SIGNAL_RUN_FIRST     // Run class handler first
G_SIGNAL_RUN_LAST      // Run class handler last (most common)
G_SIGNAL_RUN_CLEANUP   // Run class handler during cleanup
G_SIGNAL_NO_RECURSE    // Prevent recursive emission
G_SIGNAL_DETAILED      // Allow detail string ("signal::detail")
G_SIGNAL_ACTION        // Can be emitted by user actions
G_SIGNAL_NO_HOOKS      // Don't allow emission hooks
```

### Emitting Signals

```c
void
todo_item_set_completed(TodoItem *self, gboolean completed)
{
    // ... set the value ...

    // Emit signals
    g_signal_emit(self, signals[SIGNAL_CHANGED], 0);
    g_signal_emit(self, signals[SIGNAL_TOGGLED], 0, completed);
}
```

### Connecting to Signals

```c
// Basic connection
g_signal_connect(item, "changed",
                G_CALLBACK(on_item_changed),
                user_data);

// Connection with data destruction
g_signal_connect_data(item, "changed",
                     G_CALLBACK(on_item_changed),
                     user_data,
                     (GClosureNotify)g_free,  // Free user_data when disconnected
                     0);

// After connection (runs after other handlers)
g_signal_connect_after(item, "changed",
                       G_CALLBACK(on_item_changed),
                       user_data);

// Swapped connection (swaps object and user_data)
g_signal_connect_swapped(button, "clicked",
                         G_CALLBACK(gtk_widget_destroy),
                         window);  // window is first parameter
```

### Signal Handler

```c
static void
on_item_changed(TodoItem *item, gpointer user_data)
{
    // Handle the signal
    g_print("Item changed: %s\n", todo_item_get_title(item));
}

static void
on_item_toggled(TodoItem *item, gboolean completed, gpointer user_data)
{
    // Handle with parameter
    g_print("Item %s\n", completed ? "completed" : "activated");
}
```

### Disconnecting Signals

```c
// Disconnect by handler ID
gulong handler_id = g_signal_connect(...);
g_signal_handler_disconnect(item, handler_id);

// Disconnect all handlers for specific callback
g_signal_handlers_disconnect_by_func(item,
                                    G_CALLBACK(on_item_changed),
                                    user_data);

// Block/unblock signals temporarily
g_signal_handlers_block_by_func(item, G_CALLBACK(on_item_changed), user_data);
// ... do something ...
g_signal_handlers_unblock_by_func(item, G_CALLBACK(on_item_changed), user_data);
```

## Memory Management

### Reference Counting

GObject uses reference counting for memory management:

```c
// Create object (ref count = 1)
TodoItem *item = todo_item_new("Test");

// Increase ref count
g_object_ref(item);  // ref count = 2

// Decrease ref count
g_object_unref(item);  // ref count = 1
g_object_unref(item);  // ref count = 0, object destroyed
```

### Ownership Rules

1. **Functions returning objects**: Caller owns a reference
   ```c
   TodoItem *item = todo_item_new("Test");  // You own this
   g_object_unref(item);  // You must unref
   ```

2. **Functions taking objects**: Callee doesn't take ownership
   ```c
   todo_model_add_item(model, item);  // model adds its own ref
   g_object_unref(item);  // You still own your reference
   ```

3. **Storing objects**: Store with a reference
   ```c
   self->item = g_object_ref(item);  // Take a reference
   // Later:
   g_clear_object(&self->item);  // Unref and set to NULL
   ```

### Floating References

Widgets use floating references:

```c
// Widget is created with floating ref
GtkWidget *button = gtk_button_new();

// Container sinks the floating ref
gtk_box_append(box, button);  // box owns the button now

// DON'T unref! Container will handle it
```

### Weak References

Weak references don't prevent destruction:

```c
TodoItem *item = todo_item_new("Test");
gpointer weak_ref = item;

// Add weak reference
g_object_add_weak_pointer(G_OBJECT(item), &weak_ref);

// When item is destroyed, weak_ref automatically becomes NULL
g_object_unref(item);
g_assert_null(weak_ref);
```

### Auto-Cleanup (Modern C)

Using GCC/Clang extensions:

```c
// Automatically unrefs when going out of scope
void
my_function(void)
{
    g_autoptr(TodoItem) item = todo_item_new("Test");
    g_autofree gchar *text = g_strdup("Hello");

    // Use item and text...

    // Automatic cleanup, no need to unref/free
}
```

### Common Memory Functions

```c
// GObject reference counting
g_object_ref(obj)
g_object_unref(obj)
g_clear_object(&obj)        // Unref and set to NULL

// GLib memory
g_malloc(size)
g_free(ptr)
g_clear_pointer(&ptr, g_free)

// String functions
g_strdup(str)               // Allocate and copy
g_strdup_printf(fmt, ...)   // Format and allocate
g_free(str)

// Lists
g_list_free(list)
g_list_free_full(list, g_free)  // Free list and data
```

## Practical Examples

### Complete TodoItem Implementation

See `src/todo_item.c` for full implementation showing:
- Class and instance initialization
- Property system
- Signal emission
- Memory management
- Public API

### Creating an Instance

```c
// Using constructor
TodoItem *item = todo_item_new("Buy milk");

// Using g_object_new with properties
TodoItem *item = g_object_new(TODO_TYPE_ITEM,
                              "title", "Buy milk",
                              "completed", FALSE,
                              "id", 1,
                              NULL);

// Don't forget to unref when done
g_object_unref(item);
```

### Working with Properties

```c
// Get property
const gchar *title = todo_item_get_title(item);

// Set property
todo_item_set_title(item, "Buy bread");

// Multiple properties at once
g_object_set(item,
            "title", "Buy bread",
            "completed", TRUE,
            NULL);

// Get multiple properties
gchar *title;
gboolean completed;
g_object_get(item,
            "title", &title,
            "completed", &completed,
            NULL);
g_free(title);  // Don't forget to free!
```

### Connecting Signals

```c
// Connect to property change
g_signal_connect(item, "notify::title",
                G_CALLBACK(on_title_changed),
                NULL);

// Connect to custom signal
g_signal_connect(item, "changed",
                G_CALLBACK(on_item_changed),
                user_data);

// Handler implementation
static void
on_title_changed(GObject *object,
                GParamSpec *pspec,
                gpointer user_data)
{
    TodoItem *item = TODO_ITEM(object);
    g_print("New title: %s\n", todo_item_get_title(item));
}
```

## Best Practices

### 1. Always Use Type Checking

```c
// Good
void
todo_item_set_title(TodoItem *self, const gchar *title)
{
    g_return_if_fail(TODO_IS_ITEM(self));
    g_return_if_fail(title != NULL);
    // ...
}

// Bad
void
todo_item_set_title(TodoItem *self, const gchar *title)
{
    self->title = g_strdup(title);  // No validation!
}
```

### 2. Proper Memory Management

```c
// Good
void
todo_item_set_title(TodoItem *self, const gchar *title)
{
    g_free(self->title);              // Free old value
    self->title = g_strdup(title);    // Duplicate new value
}

// Bad
void
todo_item_set_title(TodoItem *self, const gchar *title)
{
    self->title = (gchar*)title;  // Memory leak + dangling pointer!
}
```

### 3. Signal Emission Optimization

```c
// Good - check if value changed
void
todo_item_set_completed(TodoItem *self, gboolean completed)
{
    if (self->completed == completed)
        return;  // No change, skip notification

    self->completed = completed;
    g_object_notify_by_pspec(G_OBJECT(self), properties[PROP_COMPLETED]);
}
```

### 4. Proper Cleanup

```c
// Good
static void
todo_item_finalize(GObject *object)
{
    TodoItem *self = TODO_ITEM(object);

    g_clear_pointer(&self->title, g_free);
    g_clear_pointer(&self->created_at, g_date_time_unref);

    G_OBJECT_CLASS(todo_item_parent_class)->finalize(object);
}
```

### 5. Documentation

```c
/**
 * todo_item_new:
 * @title: The title of the todo item
 *
 * Creates a new #TodoItem with the given title.
 *
 * Returns: (transfer full): A newly created #TodoItem
 */
TodoItem *
todo_item_new(const gchar *title)
{
    return g_object_new(TODO_TYPE_ITEM,
                       "title", title,
                       NULL);
}
```

## Further Reading

- [GObject Reference Manual](https://docs.gtk.org/gobject/)
- [GObject Tutorial](https://github.com/ToshioCP/Gobject-tutorial)
- [GNOME Developer Documentation](https://developer.gnome.org/)

## Summary

This guide covered:
- GObject type system basics
- Creating custom GObject classes
- Properties and signals
- Memory management with reference counting
- Best practices and examples

The TodoItem class in this project demonstrates all these concepts in a real-world application.
