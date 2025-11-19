/* todo_row.c
 *
 * Copyright 2025 TodoList Demo
 *
 * Implementation of TodoRow.
 * A custom list box row that displays a todo item with a checkbox and label.
 */

#include "todo_row.h"

struct _TodoRow
{
    GtkListBoxRow parent_instance;

    /* Template widgets */
    GtkCheckButton *check_button;
    GtkLabel *title_label;
    GtkButton *delete_button;

    /* Private data */
    TodoItem *item;
    gulong completed_handler_id;
    gulong title_handler_id;
};

G_DEFINE_TYPE(TodoRow, todo_row, GTK_TYPE_LIST_BOX_ROW)

enum {
    SIGNAL_DELETE_REQUESTED,
    N_SIGNALS
};

static guint signals[N_SIGNALS] = { 0, };

/* Forward declarations */
static void todo_row_dispose(GObject *object);
static void on_check_button_toggled(GtkCheckButton *button, gpointer user_data);
static void on_delete_button_clicked(GtkButton *button, gpointer user_data);
static void on_item_completed_changed(TodoItem *item, GParamSpec *pspec, gpointer user_data);
static void on_item_title_changed(TodoItem *item, GParamSpec *pspec, gpointer user_data);

/* Class initialization */
static void
todo_row_class_init(TodoRowClass *klass)
{
    GObjectClass *object_class = G_OBJECT_CLASS(klass);

    object_class->dispose = todo_row_dispose;

    /**
     * TodoRow::delete-requested:
     * @row: The #TodoRow
     *
     * Emitted when the delete button is clicked.
     */
    signals[SIGNAL_DELETE_REQUESTED] = g_signal_new(
        "delete-requested",
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
todo_row_init(TodoRow *self)
{
    GtkWidget *box;
    GtkWidget *delete_icon;

    /* Create the row layout */
    box = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 12);
    gtk_widget_set_margin_start(box, 12);
    gtk_widget_set_margin_end(box, 12);
    gtk_widget_set_margin_top(box, 8);
    gtk_widget_set_margin_bottom(box, 8);

    /* Create checkbox */
    self->check_button = GTK_CHECK_BUTTON(gtk_check_button_new());
    gtk_widget_set_valign(GTK_WIDGET(self->check_button), GTK_ALIGN_CENTER);
    g_signal_connect(self->check_button, "toggled",
                    G_CALLBACK(on_check_button_toggled), self);

    /* Create title label */
    self->title_label = GTK_LABEL(gtk_label_new(""));
    gtk_label_set_xalign(self->title_label, 0.0);
    gtk_label_set_ellipsize(self->title_label, PANGO_ELLIPSIZE_END);
    gtk_widget_set_hexpand(GTK_WIDGET(self->title_label), TRUE);

    /* Create delete button */
    self->delete_button = GTK_BUTTON(gtk_button_new());
    gtk_widget_set_valign(GTK_WIDGET(self->delete_button), GTK_ALIGN_CENTER);
    gtk_button_set_has_frame(self->delete_button, FALSE);

    delete_icon = gtk_image_new_from_icon_name("user-trash-symbolic");
    gtk_button_set_child(self->delete_button, delete_icon);
    g_signal_connect(self->delete_button, "clicked",
                    G_CALLBACK(on_delete_button_clicked), self);

    /* Pack widgets */
    gtk_box_append(GTK_BOX(box), GTK_WIDGET(self->check_button));
    gtk_box_append(GTK_BOX(box), GTK_WIDGET(self->title_label));
    gtk_box_append(GTK_BOX(box), GTK_WIDGET(self->delete_button));

    gtk_list_box_row_set_child(GTK_LIST_BOX_ROW(self), box);

    self->item = NULL;
    self->completed_handler_id = 0;
    self->title_handler_id = 0;
}

/* Dispose */
static void
todo_row_dispose(GObject *object)
{
    TodoRow *self = TODO_ROW(object);

    if (self->item != NULL) {
        if (self->completed_handler_id > 0) {
            g_signal_handler_disconnect(self->item, self->completed_handler_id);
            self->completed_handler_id = 0;
        }
        if (self->title_handler_id > 0) {
            g_signal_handler_disconnect(self->item, self->title_handler_id);
            self->title_handler_id = 0;
        }
        g_clear_object(&self->item);
    }

    G_OBJECT_CLASS(todo_row_parent_class)->dispose(object);
}

/* Signal handlers */
static void
on_check_button_toggled(GtkCheckButton *button, gpointer user_data)
{
    TodoRow *self = TODO_ROW(user_data);

    if (self->item != NULL) {
        gboolean active = gtk_check_button_get_active(button);
        todo_item_set_completed(self->item, active);
    }
}

static void
on_delete_button_clicked(GtkButton *button, gpointer user_data)
{
    TodoRow *self = TODO_ROW(user_data);

    g_signal_emit(self, signals[SIGNAL_DELETE_REQUESTED], 0);
}

static void
on_item_completed_changed(TodoItem *item, GParamSpec *pspec, gpointer user_data)
{
    TodoRow *self = TODO_ROW(user_data);
    gboolean completed = todo_item_get_completed(item);

    /* Block our own signal to avoid recursion */
    g_signal_handlers_block_by_func(self->check_button,
                                   on_check_button_toggled,
                                   self);

    gtk_check_button_set_active(self->check_button, completed);

    /* Update label style */
    if (completed) {
        gtk_widget_add_css_class(GTK_WIDGET(self->title_label), "dim-label");
        gtk_widget_add_css_class(GTK_WIDGET(self->title_label), "strikethrough");
    } else {
        gtk_widget_remove_css_class(GTK_WIDGET(self->title_label), "dim-label");
        gtk_widget_remove_css_class(GTK_WIDGET(self->title_label), "strikethrough");
    }

    g_signal_handlers_unblock_by_func(self->check_button,
                                     on_check_button_toggled,
                                     self);
}

static void
on_item_title_changed(TodoItem *item, GParamSpec *pspec, gpointer user_data)
{
    TodoRow *self = TODO_ROW(user_data);
    const gchar *title = todo_item_get_title(item);

    gtk_label_set_text(self->title_label, title);
}

/* Public API */

/**
 * todo_row_new:
 * @item: The #TodoItem to display
 *
 * Creates a new #TodoRow for the given item.
 *
 * Returns: (transfer full): A newly created #TodoRow
 */
GtkWidget *
todo_row_new(TodoItem *item)
{
    TodoRow *row = g_object_new(TODO_TYPE_ROW, NULL);

    if (item != NULL) {
        todo_row_set_item(row, item);
    }

    return GTK_WIDGET(row);
}

/**
 * todo_row_get_item:
 * @self: A #TodoRow
 *
 * Gets the #TodoItem associated with this row.
 *
 * Returns: (transfer none): The associated #TodoItem
 */
TodoItem *
todo_row_get_item(TodoRow *self)
{
    g_return_val_if_fail(TODO_IS_ROW(self), NULL);

    return self->item;
}

/**
 * todo_row_set_item:
 * @self: A #TodoRow
 * @item: The #TodoItem to display
 *
 * Sets the #TodoItem to display in this row.
 */
void
todo_row_set_item(TodoRow *self, TodoItem *item)
{
    g_return_if_fail(TODO_IS_ROW(self));
    g_return_if_fail(item == NULL || TODO_IS_ITEM(item));

    /* Disconnect old item signals */
    if (self->item != NULL) {
        if (self->completed_handler_id > 0) {
            g_signal_handler_disconnect(self->item, self->completed_handler_id);
            self->completed_handler_id = 0;
        }
        if (self->title_handler_id > 0) {
            g_signal_handler_disconnect(self->item, self->title_handler_id);
            self->title_handler_id = 0;
        }
    }

    g_set_object(&self->item, item);

    if (self->item != NULL) {
        /* Update UI */
        gtk_label_set_text(self->title_label, todo_item_get_title(item));
        gtk_check_button_set_active(self->check_button,
                                    todo_item_get_completed(item));

        /* Update completed style */
        on_item_completed_changed(self->item, NULL, self);

        /* Connect to item signals */
        self->completed_handler_id = g_signal_connect(
            self->item,
            "notify::completed",
            G_CALLBACK(on_item_completed_changed),
            self
        );

        self->title_handler_id = g_signal_connect(
            self->item,
            "notify::title",
            G_CALLBACK(on_item_title_changed),
            self
        );
    }
}
