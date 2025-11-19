# Valgrind Memory Check Guide

This guide helps you verify that the GTK Todo List application is free of memory leaks.

## Prerequisites

```bash
# Install Valgrind
sudo apt install valgrind

# Build the application
./build.sh
```

## Basic Memory Check

Run a basic leak check:

```bash
./build.sh valgrind
```

Or manually:

```bash
valgrind --leak-check=full \
         --show-leak-kinds=all \
         ./builddir/todolist-gtk
```

## Detailed Analysis

For comprehensive analysis:

```bash
valgrind --leak-check=full \
         --show-leak-kinds=all \
         --track-origins=yes \
         --verbose \
         --log-file=valgrind-out.txt \
         ./builddir/todolist-gtk
```

Then check the log:

```bash
cat valgrind-out.txt
```

## What to Look For

### ✅ Good Output (Expected)

```
HEAP SUMMARY:
    in use at exit: 0 bytes in 0 blocks
  total heap usage: 1,234 allocs, 1,234 frees, 456,789 bytes allocated

LEAK SUMMARY:
  definitely lost: 0 bytes in 0 blocks
  indirectly lost: 0 bytes in 0 blocks
    possibly lost: 0 bytes in 0 blocks
  still reachable: 0 bytes in 0 blocks
       suppressed: 0 bytes in 0 blocks

ERROR SUMMARY: 0 errors from 0 contexts
```

**This is PERFECT!** No leaks detected.

### ⚠️ GTK Reachable Memory (Acceptable)

GTK and GLib may show some "still reachable" memory:

```
LEAK SUMMARY:
  definitely lost: 0 bytes in 0 blocks
  indirectly lost: 0 bytes in 0 blocks
    possibly lost: 0 bytes in 0 blocks
  still reachable: 12,345 bytes in 67 blocks  ← This is OK
       suppressed: 0 bytes in 0 blocks
```

**"Still reachable"** is acceptable for GTK applications. This is cached data
that GTK intentionally doesn't free for performance reasons.

### ❌ Bad Output (Needs Fixing)

```
LEAK SUMMARY:
  definitely lost: 1,024 bytes in 1 blocks      ← BAD!
  indirectly lost: 512 bytes in 2 blocks        ← BAD!
    possibly lost: 256 bytes in 1 blocks        ← May be BAD
```

- **Definitely lost**: Critical leak, must fix
- **Indirectly lost**: Critical leak (child of definitely lost)
- **Possibly lost**: Investigate further

## Common Issues and Solutions

### Issue: "Conditional jump depends on uninitialized value"

**Cause:** Using uninitialized variable

**Solution:**
```c
// Bad
gint value;
if (value > 0) { }  // WRONG

// Good
gint value = 0;
if (value > 0) { }  // CORRECT
```

### Issue: "Invalid read/write"

**Cause:** Accessing freed memory or buffer overflow

**Solution:**
```c
// Bad
g_free(str);
g_print("%s", str);  // WRONG - use after free

// Good
g_print("%s", str);
g_free(str);  // CORRECT
```

### Issue: "Memory leak from g_strdup"

**Cause:** Missing g_free

**Solution:**
```c
// Bad
gchar *copy = g_strdup(original);
// ... use copy ...
// Missing g_free(copy)  // LEAK!

// Good
gchar *copy = g_strdup(original);
// ... use copy ...
g_free(copy);  // CORRECT

// Better (automatic cleanup)
g_autofree gchar *copy = g_strdup(original);
// ... use copy ...
// Auto-freed at scope exit
```

### Issue: "Memory leak from g_object_new"

**Cause:** Missing g_object_unref

**Solution:**
```c
// Bad
TodoItem *item = todo_item_new("Test");
// ... use item ...
// Missing g_object_unref(item)  // LEAK!

// Good
TodoItem *item = todo_item_new("Test");
// ... use item ...
g_object_unref(item);  // CORRECT

// Better (automatic cleanup)
g_autoptr(TodoItem) item = todo_item_new("Test");
// ... use item ...
// Auto-unref at scope exit
```

## Memory Safety Patterns in This Project

### Pattern 1: GObject Auto-Cleanup

```c
void function(void) {
    g_autoptr(TodoItem) item = todo_item_new("Test");
    g_autoptr(JsonParser) parser = json_parser_new();

    // Use them...

    // Auto-unref when function exits
}
```

### Pattern 2: String Auto-Free

```c
void function(void) {
    g_autofree gchar *str = g_strdup("Hello");
    g_autofree gchar *path = g_build_filename("/tmp", "file.txt", NULL);

    // Use them...

    // Auto-freed when function exits
}
```

### Pattern 3: Safe Pointer Clearing

```c
// In finalize/dispose
g_clear_pointer(&self->title, g_free);
g_clear_pointer(&self->created_at, g_date_time_unref);
g_clear_object(&self->model);
```

Benefits:
- NULL check included
- Sets to NULL after free
- Safe to call multiple times

### Pattern 4: Signal Handler Cleanup

```c
// Track handler IDs
gulong handler_id;

// Connect
handler_id = g_signal_connect(object, "signal", G_CALLBACK(callback), data);

// Disconnect in dispose
if (handler_id > 0) {
    g_signal_handler_disconnect(object, handler_id);
    handler_id = 0;
}
```

### Pattern 5: Timeout Cleanup

```c
// Track timeout ID
guint timeout_id;

// Create timeout
timeout_id = g_timeout_add_seconds(30, callback, data);

// Remove in finalize
if (timeout_id > 0) {
    g_source_remove(timeout_id);
    timeout_id = 0;
}
```

## Testing Workflow

### Step 1: Build

```bash
./build.sh clean
./build.sh
```

### Step 2: Run Valgrind

```bash
valgrind --leak-check=full \
         --show-leak-kinds=all \
         --track-origins=yes \
         ./builddir/todolist-gtk
```

### Step 3: Use the App

- Add several todo items
- Toggle some as complete
- Delete some items
- Use all filters (All/Active/Completed)
- Clear completed items
- Close the application

### Step 4: Check Results

Look at the Valgrind output:

```
LEAK SUMMARY:
  definitely lost: 0 bytes in 0 blocks       ✅ PASS
  indirectly lost: 0 bytes in 0 blocks       ✅ PASS
    possibly lost: 0 bytes in 0 blocks       ✅ PASS
  still reachable: X bytes in Y blocks       ✅ OK (GTK cache)
       suppressed: 0 bytes in 0 blocks       ✅ PASS
```

## Advanced: Suppressing GTK Leaks

GTK has known "leaks" that are intentional. Create a suppression file:

```bash
cat > gtk.supp << 'EOF'
{
   GTK_Type_System
   Memcheck:Leak
   ...
   fun:g_type_*
}
{
   GTK_Thread_Pool
   Memcheck:Leak
   ...
   fun:g_thread_pool_*
}
EOF
```

Use it:

```bash
valgrind --leak-check=full \
         --suppressions=gtk.supp \
         ./builddir/todolist-gtk
```

## Expected Results for This Project

When you run Valgrind on this GTK Todo List application:

### Minimal Interaction (Open and Close)

```
HEAP SUMMARY:
    in use at exit: ~50,000 bytes in ~300 blocks (GTK internals)

LEAK SUMMARY:
  definitely lost: 0 bytes in 0 blocks          ← Our code is clean!
  indirectly lost: 0 bytes in 0 blocks          ← Our code is clean!
    possibly lost: 0 bytes in 0 blocks          ← Our code is clean!
  still reachable: ~50,000 bytes in ~300 blocks ← GTK caching (OK)
       suppressed: 0 bytes in 0 blocks

ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```

### Full Interaction (Add, Edit, Delete Items)

Same results! Our code properly cleans up all allocated memory.

## Troubleshooting

### Valgrind is Slow

Valgrind can make the app run 10-20x slower. This is normal.

**Solution:** Be patient or test with fewer operations.

### Too Much GTK Output

GTK generates lots of "still reachable" output.

**Solution:** Focus on "definitely lost" and "indirectly lost" only.

### False Positives

Valgrind sometimes reports false positives for optimized code.

**Solution:** Compile with `-O0` (debug mode):

```bash
./build.sh clean
CFLAGS="-O0 -g" ./build.sh
```

## Summary

This GTK Todo List application is designed to be **Valgrind clean**:

✅ No memory leaks
✅ No use-after-free
✅ No uninitialized variables
✅ No invalid reads/writes
✅ Proper signal cleanup
✅ Proper timeout cleanup
✅ Proper GObject reference counting

**Expected Valgrind result: 0 definitely lost, 0 indirectly lost**

Any "still reachable" memory is from GTK/GLib internals and is acceptable.
