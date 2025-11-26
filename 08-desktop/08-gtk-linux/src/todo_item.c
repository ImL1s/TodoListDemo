/* todo_item.c
 *
 * Copyright 2025 TodoList Demo
 *
 * Implementation of TodoItem GObject.
 * Demonstrates:
 * - GObject type registration
 * - Property system
 * - Signal emission
 * - Memory management with reference counting
 */

#include "todo_item.h"

struct _TodoItem
{
    GObject parent_instance;

    /* Private data */
    gchar *title;
    gboolean completed;
    guint id;
    GDateTime *created_at;
};

G_DEFINE_TYPE(TodoItem, todo_item, G_TYPE_OBJECT)

enum {
    PROP_0,
    PROP_TITLE,
    PROP_COMPLETED,
    PROP_ID,
    PROP_CREATED_AT,
    N_PROPERTIES
};

enum {
    SIGNAL_CHANGED,
    SIGNAL_TOGGLED,
    N_SIGNALS
};

static GParamSpec *properties[N_PROPERTIES] = { NULL, };
static guint signals[N_SIGNALS] = { 0, };

/* Forward declarations */
static void todo_item_finalize(GObject *object);
static void todo_item_get_property(GObject *object,
                                   guint prop_id,
                                   GValue *value,
                                   GParamSpec *pspec);
static void todo_item_set_property(GObject *object,
                                   guint prop_id,
                                   const GValue *value,
                                   GParamSpec *pspec);

/* Class initialization */
static void
todo_item_class_init(TodoItemClass *klass)
{
    GObjectClass *object_class = G_OBJECT_CLASS(klass);

    object_class->finalize = todo_item_finalize;
    object_class->get_property = todo_item_get_property;
    object_class->set_property = todo_item_set_property;

    /**
     * TodoItem:title:
     *
     * The title of the todo item.
     */
    properties[PROP_TITLE] = g_param_spec_string(
        "title",
        "Title",
        "The todo item title",
        NULL,
        G_PARAM_READWRITE | G_PARAM_CONSTRUCT | G_PARAM_STATIC_STRINGS
    );

    /**
     * TodoItem:completed:
     *
     * Whether the todo item is completed.
     */
    properties[PROP_COMPLETED] = g_param_spec_boolean(
        "completed",
        "Completed",
        "Whether the item is completed",
        FALSE,
        G_PARAM_READWRITE | G_PARAM_CONSTRUCT | G_PARAM_STATIC_STRINGS
    );

    /**
     * TodoItem:id:
     *
     * The unique ID of the todo item.
     */
    properties[PROP_ID] = g_param_spec_uint(
        "id",
        "ID",
        "Unique identifier for the todo item",
        0,
        G_MAXUINT,
        0,
        G_PARAM_READWRITE | G_PARAM_CONSTRUCT | G_PARAM_STATIC_STRINGS
    );

    /**
     * TodoItem:created-at:
     *
     * The creation timestamp of the todo item.
     */
    properties[PROP_CREATED_AT] = g_param_spec_boxed(
        "created-at",
        "Created At",
        "The creation timestamp",
        G_TYPE_DATE_TIME,
        G_PARAM_READABLE | G_PARAM_STATIC_STRINGS
    );

    g_object_class_install_properties(object_class, N_PROPERTIES, properties);

    /**
     * TodoItem::changed:
     * @item: The #TodoItem that changed
     *
     * Emitted when any property of the todo item changes.
     */
    signals[SIGNAL_CHANGED] = g_signal_new(
        "changed",
        G_TYPE_FROM_CLASS(klass),
        G_SIGNAL_RUN_LAST,
        0,
        NULL, NULL,
        NULL,
        G_TYPE_NONE,
        0
    );

    /**
     * TodoItem::toggled:
     * @item: The #TodoItem that was toggled
     * @completed: The new completion state
     *
     * Emitted when the completion state is toggled.
     */
    signals[SIGNAL_TOGGLED] = g_signal_new(
        "toggled",
        G_TYPE_FROM_CLASS(klass),
        G_SIGNAL_RUN_LAST,
        0,
        NULL, NULL,
        NULL,
        G_TYPE_NONE,
        1,
        G_TYPE_BOOLEAN
    );
}

/* Instance initialization */
static void
todo_item_init(TodoItem *self)
{
    /* Initialize with current time */
    self->created_at = g_date_time_new_now_local();
    self->title = NULL;
    self->completed = FALSE;
    self->id = 0;
}

/* Finalize (cleanup) */
static void
todo_item_finalize(GObject *object)
{
    TodoItem *self = TODO_ITEM(object);

    /* Free allocated memory */
    g_clear_pointer(&self->title, g_free);
    g_clear_pointer(&self->created_at, g_date_time_unref);

    /* Chain up to parent class */
    G_OBJECT_CLASS(todo_item_parent_class)->finalize(object);
}

/* Property getters */
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
        case PROP_CREATED_AT:
            g_value_set_boxed(value, self->created_at);
            break;
        default:
            G_OBJECT_WARN_INVALID_PROPERTY_ID(object, prop_id, pspec);
            break;
    }
}

/* Property setters */
static void
todo_item_set_property(GObject *object,
                       guint prop_id,
                       const GValue *value,
                       GParamSpec *pspec)
{
    TodoItem *self = TODO_ITEM(object);

    switch (prop_id) {
        case PROP_TITLE:
            todo_item_set_title(self, g_value_get_string(value));
            break;
        case PROP_COMPLETED:
            todo_item_set_completed(self, g_value_get_boolean(value));
            break;
        case PROP_ID:
            todo_item_set_id(self, g_value_get_uint(value));
            break;
        default:
            G_OBJECT_WARN_INVALID_PROPERTY_ID(object, prop_id, pspec);
            break;
    }
}

/* Public API */

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

/**
 * todo_item_new_full:
 * @title: The title of the todo item
 * @completed: Whether the item is completed
 * @id: The unique ID of the item
 *
 * Creates a new #TodoItem with all properties set.
 *
 * Returns: (transfer full): A newly created #TodoItem
 */
TodoItem *
todo_item_new_full(const gchar *title, gboolean completed, guint id)
{
    return g_object_new(TODO_TYPE_ITEM,
                       "title", title,
                       "completed", completed,
                       "id", id,
                       NULL);
}

/**
 * todo_item_get_title:
 * @self: A #TodoItem
 *
 * Gets the title of the todo item.
 *
 * Returns: (transfer none): The title string
 */
const gchar *
todo_item_get_title(TodoItem *self)
{
    g_return_val_if_fail(TODO_IS_ITEM(self), NULL);

    return self->title;
}

/**
 * todo_item_set_title:
 * @self: A #TodoItem
 * @title: The new title
 *
 * Sets the title of the todo item.
 */
void
todo_item_set_title(TodoItem *self, const gchar *title)
{
    g_return_if_fail(TODO_IS_ITEM(self));

    if (g_strcmp0(self->title, title) == 0)
        return;

    g_free(self->title);
    self->title = g_strdup(title);

    g_object_notify_by_pspec(G_OBJECT(self), properties[PROP_TITLE]);
    g_signal_emit(self, signals[SIGNAL_CHANGED], 0);
}

/**
 * todo_item_get_completed:
 * @self: A #TodoItem
 *
 * Gets whether the todo item is completed.
 *
 * Returns: %TRUE if completed, %FALSE otherwise
 */
gboolean
todo_item_get_completed(TodoItem *self)
{
    g_return_val_if_fail(TODO_IS_ITEM(self), FALSE);

    return self->completed;
}

/**
 * todo_item_set_completed:
 * @self: A #TodoItem
 * @completed: Whether the item is completed
 *
 * Sets the completion status of the todo item.
 */
void
todo_item_set_completed(TodoItem *self, gboolean completed)
{
    g_return_if_fail(TODO_IS_ITEM(self));

    if (self->completed == completed)
        return;

    self->completed = completed;

    g_object_notify_by_pspec(G_OBJECT(self), properties[PROP_COMPLETED]);
    g_signal_emit(self, signals[SIGNAL_CHANGED], 0);
    g_signal_emit(self, signals[SIGNAL_TOGGLED], 0, completed);
}

/**
 * todo_item_get_id:
 * @self: A #TodoItem
 *
 * Gets the unique ID of the todo item.
 *
 * Returns: The item ID
 */
guint
todo_item_get_id(TodoItem *self)
{
    g_return_val_if_fail(TODO_IS_ITEM(self), 0);

    return self->id;
}

/**
 * todo_item_set_id:
 * @self: A #TodoItem
 * @id: The unique ID
 *
 * Sets the unique ID of the todo item.
 */
void
todo_item_set_id(TodoItem *self, guint id)
{
    g_return_if_fail(TODO_IS_ITEM(self));

    if (self->id == id)
        return;

    self->id = id;

    g_object_notify_by_pspec(G_OBJECT(self), properties[PROP_ID]);
}

/**
 * todo_item_get_created_at:
 * @self: A #TodoItem
 *
 * Gets the creation timestamp of the todo item.
 *
 * Returns: (transfer none): A #GDateTime representing creation time
 */
GDateTime *
todo_item_get_created_at(TodoItem *self)
{
    g_return_val_if_fail(TODO_IS_ITEM(self), NULL);

    return self->created_at;
}

/**
 * todo_item_toggle_completed:
 * @self: A #TodoItem
 *
 * Toggles the completion status of the todo item.
 */
void
todo_item_toggle_completed(TodoItem *self)
{
    g_return_if_fail(TODO_IS_ITEM(self));

    todo_item_set_completed(self, !self->completed);
}
