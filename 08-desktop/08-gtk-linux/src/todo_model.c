/* todo_model.c
 *
 * Copyright 2025 TodoList Demo
 *
 * Implementation of TodoModel.
 * Manages a collection of TodoItem objects using GListStore.
 */

#include "todo_model.h"
#include <gtk/gtk.h>
#include <json-glib/json-glib.h>

struct _TodoModel
{
    GObject parent_instance;

    /* Private data */
    GListStore *store;
    guint next_id;
};

G_DEFINE_TYPE(TodoModel, todo_model, G_TYPE_OBJECT)

enum {
    SIGNAL_ITEM_ADDED,
    SIGNAL_ITEM_REMOVED,
    SIGNAL_ITEMS_CHANGED,
    N_SIGNALS
};

static guint signals[N_SIGNALS] = { 0, };

/* Forward declarations */
static void todo_model_finalize(GObject *object);

/* Class initialization */
static void
todo_model_class_init(TodoModelClass *klass)
{
    GObjectClass *object_class = G_OBJECT_CLASS(klass);

    object_class->finalize = todo_model_finalize;

    /**
     * TodoModel::item-added:
     * @model: The #TodoModel
     * @item: The added #TodoItem
     *
     * Emitted when an item is added to the model.
     */
    signals[SIGNAL_ITEM_ADDED] = g_signal_new(
        "item-added",
        G_TYPE_FROM_CLASS(klass),
        G_SIGNAL_RUN_LAST,
        0,
        NULL, NULL,
        NULL,
        G_TYPE_NONE,
        1,
        TODO_TYPE_ITEM
    );

    /**
     * TodoModel::item-removed:
     * @model: The #TodoModel
     * @item: The removed #TodoItem
     *
     * Emitted when an item is removed from the model.
     */
    signals[SIGNAL_ITEM_REMOVED] = g_signal_new(
        "item-removed",
        G_TYPE_FROM_CLASS(klass),
        G_SIGNAL_RUN_LAST,
        0,
        NULL, NULL,
        NULL,
        G_TYPE_NONE,
        1,
        TODO_TYPE_ITEM
    );

    /**
     * TodoModel::items-changed:
     * @model: The #TodoModel
     *
     * Emitted when the list of items changes.
     */
    signals[SIGNAL_ITEMS_CHANGED] = g_signal_new(
        "items-changed",
        G_TYPE_FROM_CLASS(klass),
        G_SIGNAL_RUN_LAST,
        0,
        NULL, NULL,
        NULL,
        G_TYPE_NONE,
        0
    );
}

/* Instance initialization */
static void
todo_model_init(TodoModel *self)
{
    self->store = g_list_store_new(TODO_TYPE_ITEM);
    self->next_id = 1;
}

/* Finalize */
static void
todo_model_finalize(GObject *object)
{
    TodoModel *self = TODO_MODEL(object);

    g_clear_object(&self->store);

    G_OBJECT_CLASS(todo_model_parent_class)->finalize(object);
}

/* Public API */

/**
 * todo_model_new:
 *
 * Creates a new #TodoModel.
 *
 * Returns: (transfer full): A newly created #TodoModel
 */
TodoModel *
todo_model_new(void)
{
    return g_object_new(TODO_TYPE_MODEL, NULL);
}

/**
 * todo_model_add_item:
 * @self: A #TodoModel
 * @title: The title of the new item
 *
 * Adds a new todo item to the model.
 *
 * Returns: (transfer none): The newly created #TodoItem
 */
TodoItem *
todo_model_add_item(TodoModel *self, const gchar *title)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), NULL);
    g_return_val_if_fail(title != NULL, NULL);

    TodoItem *item = todo_item_new_full(title, FALSE, self->next_id++);
    g_list_store_append(self->store, item);

    g_signal_emit(self, signals[SIGNAL_ITEM_ADDED], 0, item);
    g_signal_emit(self, signals[SIGNAL_ITEMS_CHANGED], 0);

    return item;
}

/**
 * todo_model_remove_item:
 * @self: A #TodoModel
 * @item: The #TodoItem to remove
 *
 * Removes a todo item from the model.
 */
void
todo_model_remove_item(TodoModel *self, TodoItem *item)
{
    g_return_if_fail(TODO_IS_MODEL(self));
    g_return_if_fail(TODO_IS_ITEM(item));

    guint n_items = g_list_model_get_n_items(G_LIST_MODEL(self->store));

    for (guint i = 0; i < n_items; i++) {
        TodoItem *current = g_list_model_get_item(G_LIST_MODEL(self->store), i);

        if (current == item) {
            g_list_store_remove(self->store, i);
            g_signal_emit(self, signals[SIGNAL_ITEM_REMOVED], 0, item);
            g_signal_emit(self, signals[SIGNAL_ITEMS_CHANGED], 0);
            g_object_unref(current);
            return;
        }

        g_object_unref(current);
    }
}

/**
 * todo_model_remove_item_by_id:
 * @self: A #TodoModel
 * @id: The ID of the item to remove
 *
 * Removes a todo item from the model by its ID.
 *
 * Returns: %TRUE if the item was found and removed
 */
gboolean
todo_model_remove_item_by_id(TodoModel *self, guint id)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), FALSE);

    TodoItem *item = todo_model_get_item_by_id(self, id);

    if (item != NULL) {
        todo_model_remove_item(self, item);
        return TRUE;
    }

    return FALSE;
}

/**
 * todo_model_get_item_by_id:
 * @self: A #TodoModel
 * @id: The ID of the item to find
 *
 * Finds a todo item by its ID.
 *
 * Returns: (transfer none) (nullable): The found #TodoItem or %NULL
 */
TodoItem *
todo_model_get_item_by_id(TodoModel *self, guint id)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), NULL);

    guint n_items = g_list_model_get_n_items(G_LIST_MODEL(self->store));

    for (guint i = 0; i < n_items; i++) {
        g_autoptr(TodoItem) item = g_list_model_get_item(G_LIST_MODEL(self->store), i);

        if (todo_item_get_id(item) == id) {
            return item;
        }
    }

    return NULL;
}

/**
 * todo_model_clear_completed:
 * @self: A #TodoModel
 *
 * Removes all completed items from the model.
 *
 * Returns: The number of items removed
 */
guint
todo_model_clear_completed(TodoModel *self)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), 0);

    guint removed_count = 0;
    guint i = 0;

    while (i < g_list_model_get_n_items(G_LIST_MODEL(self->store))) {
        g_autoptr(TodoItem) item = g_list_model_get_item(G_LIST_MODEL(self->store), i);

        if (todo_item_get_completed(item)) {
            g_list_store_remove(self->store, i);
            g_signal_emit(self, signals[SIGNAL_ITEM_REMOVED], 0, item);
            removed_count++;
        } else {
            i++;
        }
    }

    if (removed_count > 0) {
        g_signal_emit(self, signals[SIGNAL_ITEMS_CHANGED], 0);
    }

    return removed_count;
}

/**
 * todo_model_get_store:
 * @self: A #TodoModel
 *
 * Gets the underlying GListStore.
 *
 * Returns: (transfer none): The #GListStore containing all items
 */
GListStore *
todo_model_get_store(TodoModel *self)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), NULL);

    return self->store;
}

/* Filter function for active items */
static gboolean
filter_active(gpointer item, gpointer user_data)
{
    TodoItem *todo_item = TODO_ITEM(item);
    return !todo_item_get_completed(todo_item);
}

/* Filter function for completed items */
static gboolean
filter_completed(gpointer item, gpointer user_data)
{
    TodoItem *todo_item = TODO_ITEM(item);
    return todo_item_get_completed(todo_item);
}

/**
 * todo_model_get_filtered_store:
 * @self: A #TodoModel
 * @filter: The filter to apply
 *
 * Gets a filtered view of the items.
 *
 * Returns: (transfer full): A new #GtkFilterListModel
 */
GListModel *
todo_model_get_filtered_store(TodoModel *self, TodoFilter filter)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), NULL);

    GtkFilter *gtk_filter = NULL;

    switch (filter) {
        case TODO_FILTER_ACTIVE:
            gtk_filter = GTK_FILTER(gtk_custom_filter_new(filter_active, NULL, NULL));
            break;
        case TODO_FILTER_COMPLETED:
            gtk_filter = GTK_FILTER(gtk_custom_filter_new(filter_completed, NULL, NULL));
            break;
        case TODO_FILTER_ALL:
        default:
            /* Return a reference to the original store for "all" filter */
            return g_object_ref(G_LIST_MODEL(self->store));
    }

    GtkFilterListModel *filtered = gtk_filter_list_model_new(
        g_object_ref(G_LIST_MODEL(self->store)),
        gtk_filter
    );

    return G_LIST_MODEL(filtered);
}

/**
 * todo_model_get_total_count:
 * @self: A #TodoModel
 *
 * Gets the total number of items.
 *
 * Returns: The total count
 */
guint
todo_model_get_total_count(TodoModel *self)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), 0);

    return g_list_model_get_n_items(G_LIST_MODEL(self->store));
}

/**
 * todo_model_get_active_count:
 * @self: A #TodoModel
 *
 * Gets the number of active (not completed) items.
 *
 * Returns: The active count
 */
guint
todo_model_get_active_count(TodoModel *self)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), 0);

    guint count = 0;
    guint n_items = g_list_model_get_n_items(G_LIST_MODEL(self->store));

    for (guint i = 0; i < n_items; i++) {
        g_autoptr(TodoItem) item = g_list_model_get_item(G_LIST_MODEL(self->store), i);

        if (!todo_item_get_completed(item)) {
            count++;
        }
    }

    return count;
}

/**
 * todo_model_get_completed_count:
 * @self: A #TodoModel
 *
 * Gets the number of completed items.
 *
 * Returns: The completed count
 */
guint
todo_model_get_completed_count(TodoModel *self)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), 0);

    guint count = 0;
    guint n_items = g_list_model_get_n_items(G_LIST_MODEL(self->store));

    for (guint i = 0; i < n_items; i++) {
        g_autoptr(TodoItem) item = g_list_model_get_item(G_LIST_MODEL(self->store), i);

        if (todo_item_get_completed(item)) {
            count++;
        }
    }

    return count;
}

/**
 * todo_model_load_from_file:
 * @self: A #TodoModel
 * @filename: The file to load from
 * @error: (nullable): Return location for error
 *
 * Loads todo items from a JSON file.
 *
 * Returns: %TRUE on success, %FALSE on error
 */
gboolean
todo_model_load_from_file(TodoModel *self,
                          const gchar *filename,
                          GError **error)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), FALSE);
    g_return_val_if_fail(filename != NULL, FALSE);

    g_autoptr(JsonParser) parser = json_parser_new();

    if (!json_parser_load_from_file(parser, filename, error)) {
        return FALSE;
    }

    JsonNode *root = json_parser_get_root(parser);
    if (!JSON_NODE_HOLDS_ARRAY(root)) {
        g_set_error(error, G_IO_ERROR, G_IO_ERROR_INVALID_DATA,
                   "Root element is not an array");
        return FALSE;
    }

    JsonArray *array = json_node_get_array(root);
    guint length = json_array_get_length(array);

    /* Clear existing items */
    g_list_store_remove_all(self->store);

    guint max_id = 0;

    for (guint i = 0; i < length; i++) {
        JsonObject *obj = json_array_get_object_element(array, i);

        const gchar *title = json_object_get_string_member(obj, "title");
        gboolean completed = json_object_get_boolean_member(obj, "completed");
        guint id = (guint)json_object_get_int_member(obj, "id");

        TodoItem *item = todo_item_new_full(title, completed, id);
        g_list_store_append(self->store, item);
        g_object_unref(item);

        if (id > max_id) {
            max_id = id;
        }
    }

    self->next_id = max_id + 1;
    g_signal_emit(self, signals[SIGNAL_ITEMS_CHANGED], 0);

    return TRUE;
}

/**
 * todo_model_save_to_file:
 * @self: A #TodoModel
 * @filename: The file to save to
 * @error: (nullable): Return location for error
 *
 * Saves todo items to a JSON file.
 *
 * Returns: %TRUE on success, %FALSE on error
 */
gboolean
todo_model_save_to_file(TodoModel *self,
                        const gchar *filename,
                        GError **error)
{
    g_return_val_if_fail(TODO_IS_MODEL(self), FALSE);
    g_return_val_if_fail(filename != NULL, FALSE);

    g_autoptr(JsonBuilder) builder = json_builder_new();

    json_builder_begin_array(builder);

    guint n_items = g_list_model_get_n_items(G_LIST_MODEL(self->store));

    for (guint i = 0; i < n_items; i++) {
        g_autoptr(TodoItem) item = g_list_model_get_item(G_LIST_MODEL(self->store), i);

        json_builder_begin_object(builder);

        json_builder_set_member_name(builder, "id");
        json_builder_add_int_value(builder, todo_item_get_id(item));

        json_builder_set_member_name(builder, "title");
        json_builder_add_string_value(builder, todo_item_get_title(item));

        json_builder_set_member_name(builder, "completed");
        json_builder_add_boolean_value(builder, todo_item_get_completed(item));

        json_builder_end_object(builder);
    }

    json_builder_end_array(builder);

    g_autoptr(JsonNode) root = json_builder_get_root(builder);
    g_autoptr(JsonGenerator) generator = json_generator_new();
    json_generator_set_root(generator, root);
    json_generator_set_pretty(generator, TRUE);

    return json_generator_to_file(generator, filename, error);
}
