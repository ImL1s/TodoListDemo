/* test_todo.c
 *
 * Copyright 2025 TodoList Demo
 *
 * Unit tests for Todo List application.
 * Demonstrates GLib testing framework.
 */

#include <gtk/gtk.h>
#include "../src/todo_item.h"
#include "../src/todo_model.h"

/* Test TodoItem creation and properties */
static void
test_todo_item_new(void)
{
    TodoItem *item = todo_item_new("Test Item");

    g_assert_nonnull(item);
    g_assert_cmpstr(todo_item_get_title(item), ==, "Test Item");
    g_assert_false(todo_item_get_completed(item));
    g_assert_cmpuint(todo_item_get_id(item), ==, 0);

    g_object_unref(item);
}

/* Test TodoItem property setters */
static void
test_todo_item_properties(void)
{
    TodoItem *item = todo_item_new("Test Item");

    /* Test title */
    todo_item_set_title(item, "Updated Title");
    g_assert_cmpstr(todo_item_get_title(item), ==, "Updated Title");

    /* Test completed */
    todo_item_set_completed(item, TRUE);
    g_assert_true(todo_item_get_completed(item));

    /* Test toggle */
    todo_item_toggle_completed(item);
    g_assert_false(todo_item_get_completed(item));

    /* Test ID */
    todo_item_set_id(item, 42);
    g_assert_cmpuint(todo_item_get_id(item), ==, 42);

    g_object_unref(item);
}

/* Test TodoItem signals */
static gboolean changed_signal_received = FALSE;
static gboolean toggled_signal_received = FALSE;

static void
on_item_changed(TodoItem *item, gpointer user_data)
{
    changed_signal_received = TRUE;
}

static void
on_item_toggled(TodoItem *item, gboolean completed, gpointer user_data)
{
    toggled_signal_received = TRUE;
}

static void
test_todo_item_signals(void)
{
    TodoItem *item = todo_item_new("Test Item");

    changed_signal_received = FALSE;
    toggled_signal_received = FALSE;

    g_signal_connect(item, "changed", G_CALLBACK(on_item_changed), NULL);
    g_signal_connect(item, "toggled", G_CALLBACK(on_item_toggled), NULL);

    /* Changing title should emit changed signal */
    todo_item_set_title(item, "New Title");
    g_assert_true(changed_signal_received);

    /* Toggling should emit both signals */
    changed_signal_received = FALSE;
    todo_item_toggle_completed(item);
    g_assert_true(changed_signal_received);
    g_assert_true(toggled_signal_received);

    g_object_unref(item);
}

/* Test TodoModel creation */
static void
test_todo_model_new(void)
{
    TodoModel *model = todo_model_new();

    g_assert_nonnull(model);
    g_assert_cmpuint(todo_model_get_total_count(model), ==, 0);
    g_assert_cmpuint(todo_model_get_active_count(model), ==, 0);
    g_assert_cmpuint(todo_model_get_completed_count(model), ==, 0);

    g_object_unref(model);
}

/* Test TodoModel adding items */
static void
test_todo_model_add_item(void)
{
    TodoModel *model = todo_model_new();

    TodoItem *item1 = todo_model_add_item(model, "First Item");
    g_assert_nonnull(item1);
    g_assert_cmpuint(todo_model_get_total_count(model), ==, 1);

    TodoItem *item2 = todo_model_add_item(model, "Second Item");
    g_assert_nonnull(item2);
    g_assert_cmpuint(todo_model_get_total_count(model), ==, 2);

    /* IDs should be sequential */
    g_assert_cmpuint(todo_item_get_id(item1), ==, 1);
    g_assert_cmpuint(todo_item_get_id(item2), ==, 2);

    g_object_unref(model);
}

/* Test TodoModel removing items */
static void
test_todo_model_remove_item(void)
{
    TodoModel *model = todo_model_new();

    TodoItem *item1 = todo_model_add_item(model, "First Item");
    TodoItem *item2 = todo_model_add_item(model, "Second Item");

    g_assert_cmpuint(todo_model_get_total_count(model), ==, 2);

    todo_model_remove_item(model, item1);
    g_assert_cmpuint(todo_model_get_total_count(model), ==, 1);

    /* Remove by ID */
    gboolean removed = todo_model_remove_item_by_id(model, todo_item_get_id(item2));
    g_assert_true(removed);
    g_assert_cmpuint(todo_model_get_total_count(model), ==, 0);

    g_object_unref(model);
}

/* Test TodoModel counts */
static void
test_todo_model_counts(void)
{
    TodoModel *model = todo_model_new();

    TodoItem *item1 = todo_model_add_item(model, "First Item");
    TodoItem *item2 = todo_model_add_item(model, "Second Item");
    TodoItem *item3 = todo_model_add_item(model, "Third Item");

    g_assert_cmpuint(todo_model_get_total_count(model), ==, 3);
    g_assert_cmpuint(todo_model_get_active_count(model), ==, 3);
    g_assert_cmpuint(todo_model_get_completed_count(model), ==, 0);

    /* Complete one item */
    todo_item_set_completed(item1, TRUE);
    g_assert_cmpuint(todo_model_get_active_count(model), ==, 2);
    g_assert_cmpuint(todo_model_get_completed_count(model), ==, 1);

    /* Complete another */
    todo_item_set_completed(item2, TRUE);
    g_assert_cmpuint(todo_model_get_active_count(model), ==, 1);
    g_assert_cmpuint(todo_model_get_completed_count(model), ==, 2);

    g_object_unref(model);
}

/* Test TodoModel clear completed */
static void
test_todo_model_clear_completed(void)
{
    TodoModel *model = todo_model_new();

    TodoItem *item1 = todo_model_add_item(model, "First Item");
    TodoItem *item2 = todo_model_add_item(model, "Second Item");
    TodoItem *item3 = todo_model_add_item(model, "Third Item");

    todo_item_set_completed(item1, TRUE);
    todo_item_set_completed(item3, TRUE);

    g_assert_cmpuint(todo_model_get_total_count(model), ==, 3);
    g_assert_cmpuint(todo_model_get_completed_count(model), ==, 2);

    guint removed = todo_model_clear_completed(model);
    g_assert_cmpuint(removed, ==, 2);
    g_assert_cmpuint(todo_model_get_total_count(model), ==, 1);
    g_assert_cmpuint(todo_model_get_completed_count(model), ==, 0);

    g_object_unref(model);
}

/* Test TodoModel persistence */
static void
test_todo_model_save_load(void)
{
    TodoModel *model1 = todo_model_new();

    /* Add some items */
    TodoItem *item1 = todo_model_add_item(model1, "First Item");
    TodoItem *item2 = todo_model_add_item(model1, "Second Item");
    todo_item_set_completed(item1, TRUE);

    /* Save to file */
    const gchar *filename = "/tmp/test_todos.json";
    GError *error = NULL;
    gboolean success = todo_model_save_to_file(model1, filename, &error);
    g_assert_true(success);
    g_assert_no_error(error);

    /* Load into new model */
    TodoModel *model2 = todo_model_new();
    success = todo_model_load_from_file(model2, filename, &error);
    g_assert_true(success);
    g_assert_no_error(error);

    /* Verify loaded data */
    g_assert_cmpuint(todo_model_get_total_count(model2), ==, 2);
    g_assert_cmpuint(todo_model_get_completed_count(model2), ==, 1);

    /* Clean up */
    g_unlink(filename);
    g_object_unref(model1);
    g_object_unref(model2);
}

/* Main test runner */
int
main(int argc, char *argv[])
{
    gtk_test_init(&argc, &argv, NULL);

    /* TodoItem tests */
    g_test_add_func("/todo/item/new", test_todo_item_new);
    g_test_add_func("/todo/item/properties", test_todo_item_properties);
    g_test_add_func("/todo/item/signals", test_todo_item_signals);

    /* TodoModel tests */
    g_test_add_func("/todo/model/new", test_todo_model_new);
    g_test_add_func("/todo/model/add", test_todo_model_add_item);
    g_test_add_func("/todo/model/remove", test_todo_model_remove_item);
    g_test_add_func("/todo/model/counts", test_todo_model_counts);
    g_test_add_func("/todo/model/clear_completed", test_todo_model_clear_completed);
    g_test_add_func("/todo/model/save_load", test_todo_model_save_load);

    return g_test_run();
}
