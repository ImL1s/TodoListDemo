/* todo_window.c
 *
 * Copyright 2025 TodoList Demo
 *
 * Implementation of TodoWindow.
 * Main application window with header bar, list view, and filter controls.
 */

#include "todo_window.h"
#include "todo_row.h"
#include <glib/gi18n.h>

struct _TodoWindow
{
    GtkApplicationWindow parent_instance;

    /* Template widgets */
    GtkHeaderBar *header_bar;
    GtkEntry *new_todo_entry;
    GtkButton *add_button;
    GtkListBox *todo_list;
    GtkScrolledWindow *scrolled_window;
    GtkBox *filter_box;
    GtkToggleButton *filter_all;
    GtkToggleButton *filter_active;
    GtkToggleButton *filter_completed;
    GtkButton *clear_completed_button;
    GtkLabel *status_label;

    /* Private data */
    TodoModel *model;
    TodoStorage *storage;
    TodoFilter current_filter;
};

G_DEFINE_TYPE(TodoWindow, todo_window, GTK_TYPE_APPLICATION_WINDOW)

/* Forward declarations */
static void todo_window_dispose(GObject *object);
static void on_add_button_clicked(GtkButton *button, gpointer user_data);
static void on_entry_activate(GtkEntry *entry, gpointer user_data);
static void on_filter_toggled(GtkToggleButton *button, gpointer user_data);
static void on_clear_completed_clicked(GtkButton *button, gpointer user_data);
static void on_model_items_changed(TodoModel *model, gpointer user_data);
static void on_row_delete_requested(TodoRow *row, gpointer user_data);
static void update_list_view(TodoWindow *self);
static void update_status_label(TodoWindow *self);
static void add_todo_item(TodoWindow *self, const gchar *title);
static GtkWidget *create_row_for_item(TodoWindow *self, TodoItem *item);

/* Class initialization */
static void
todo_window_class_init(TodoWindowClass *klass)
{
    GObjectClass *object_class = G_OBJECT_CLASS(klass);

    object_class->dispose = todo_window_dispose;
}

/* Instance initialization */
static void
todo_window_init(TodoWindow *self)
{
    GtkWidget *main_box;
    GtkWidget *entry_box;
    GtkWidget *content_box;
    GtkWidget *filter_label;
    GtkWidget *separator;

    /* Set window properties */
    gtk_window_set_title(GTK_WINDOW(self), _("Todo List"));
    gtk_window_set_default_size(GTK_WINDOW(self), 600, 500);

    /* Create header bar */
    self->header_bar = GTK_HEADER_BAR(gtk_header_bar_new());
    gtk_window_set_titlebar(GTK_WINDOW(self), GTK_WIDGET(self->header_bar));

    /* Create main container */
    main_box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 0);
    gtk_window_set_child(GTK_WINDOW(self), main_box);

    /* Create entry box */
    entry_box = gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 6);
    gtk_widget_set_margin_start(entry_box, 12);
    gtk_widget_set_margin_end(entry_box, 12);
    gtk_widget_set_margin_top(entry_box, 12);
    gtk_widget_set_margin_bottom(entry_box, 12);

    self->new_todo_entry = GTK_ENTRY(gtk_entry_new());
    gtk_entry_set_placeholder_text(self->new_todo_entry, _("What needs to be done?"));
    gtk_widget_set_hexpand(GTK_WIDGET(self->new_todo_entry), TRUE);
    g_signal_connect(self->new_todo_entry, "activate",
                    G_CALLBACK(on_entry_activate), self);

    self->add_button = GTK_BUTTON(gtk_button_new_with_label(_("Add")));
    gtk_widget_add_css_class(GTK_WIDGET(self->add_button), "suggested-action");
    g_signal_connect(self->add_button, "clicked",
                    G_CALLBACK(on_add_button_clicked), self);

    gtk_box_append(GTK_BOX(entry_box), GTK_WIDGET(self->new_todo_entry));
    gtk_box_append(GTK_BOX(entry_box), GTK_WIDGET(self->add_button));

    /* Create scrolled window with list */
    self->scrolled_window = GTK_SCROLLED_WINDOW(gtk_scrolled_window_new());
    gtk_widget_set_vexpand(GTK_WIDGET(self->scrolled_window), TRUE);
    gtk_scrolled_window_set_policy(self->scrolled_window,
                                   GTK_POLICY_NEVER,
                                   GTK_POLICY_AUTOMATIC);

    self->todo_list = GTK_LIST_BOX(gtk_list_box_new());
    gtk_list_box_set_selection_mode(self->todo_list, GTK_SELECTION_NONE);
    gtk_widget_add_css_class(GTK_WIDGET(self->todo_list), "boxed-list");
    gtk_scrolled_window_set_child(self->scrolled_window,
                                  GTK_WIDGET(self->todo_list));

    /* Create filter box */
    self->filter_box = GTK_BOX(gtk_box_new(GTK_ORIENTATION_HORIZONTAL, 12));
    gtk_widget_set_margin_start(GTK_WIDGET(self->filter_box), 12);
    gtk_widget_set_margin_end(GTK_WIDGET(self->filter_box), 12);
    gtk_widget_set_margin_top(GTK_WIDGET(self->filter_box), 12);
    gtk_widget_set_margin_bottom(GTK_WIDGET(self->filter_box), 12);

    filter_label = gtk_label_new(_("Filter:"));
    gtk_box_append(self->filter_box, filter_label);

    /* Create filter buttons */
    self->filter_all = GTK_TOGGLE_BUTTON(gtk_toggle_button_new_with_label(_("All")));
    gtk_toggle_button_set_active(self->filter_all, TRUE);
    g_object_set_data(G_OBJECT(self->filter_all), "filter",
                     GINT_TO_POINTER(TODO_FILTER_ALL));
    g_signal_connect(self->filter_all, "toggled",
                    G_CALLBACK(on_filter_toggled), self);

    self->filter_active = GTK_TOGGLE_BUTTON(gtk_toggle_button_new_with_label(_("Active")));
    g_object_set_data(G_OBJECT(self->filter_active), "filter",
                     GINT_TO_POINTER(TODO_FILTER_ACTIVE));
    g_signal_connect(self->filter_active, "toggled",
                    G_CALLBACK(on_filter_toggled), self);

    self->filter_completed = GTK_TOGGLE_BUTTON(gtk_toggle_button_new_with_label(_("Completed")));
    g_object_set_data(G_OBJECT(self->filter_completed), "filter",
                     GINT_TO_POINTER(TODO_FILTER_COMPLETED));
    g_signal_connect(self->filter_completed, "toggled",
                    G_CALLBACK(on_filter_toggled), self);

    /* Group filter buttons */
    gtk_toggle_button_set_group(self->filter_active, self->filter_all);
    gtk_toggle_button_set_group(self->filter_completed, self->filter_all);

    gtk_box_append(self->filter_box, GTK_WIDGET(self->filter_all));
    gtk_box_append(self->filter_box, GTK_WIDGET(self->filter_active));
    gtk_box_append(self->filter_box, GTK_WIDGET(self->filter_completed));

    /* Add separator */
    separator = gtk_separator_new(GTK_ORIENTATION_VERTICAL);
    gtk_box_append(self->filter_box, separator);

    /* Clear completed button */
    self->clear_completed_button = GTK_BUTTON(gtk_button_new_with_label(_("Clear Completed")));
    g_signal_connect(self->clear_completed_button, "clicked",
                    G_CALLBACK(on_clear_completed_clicked), self);
    gtk_box_append(self->filter_box, GTK_WIDGET(self->clear_completed_button));

    /* Status label */
    self->status_label = GTK_LABEL(gtk_label_new(""));
    gtk_widget_set_hexpand(GTK_WIDGET(self->status_label), TRUE);
    gtk_label_set_xalign(self->status_label, 1.0);
    gtk_widget_add_css_class(GTK_WIDGET(self->status_label), "dim-label");
    gtk_box_append(self->filter_box, GTK_WIDGET(self->status_label));

    /* Pack everything */
    gtk_box_append(GTK_BOX(main_box), entry_box);
    gtk_box_append(GTK_BOX(main_box), GTK_WIDGET(self->scrolled_window));
    gtk_box_append(GTK_BOX(main_box), GTK_WIDGET(self->filter_box));

    /* Initialize data */
    self->model = todo_model_new();
    self->storage = todo_storage_new();
    self->current_filter = TODO_FILTER_ALL;

    /* Connect model signals */
    g_signal_connect(self->model, "items-changed",
                    G_CALLBACK(on_model_items_changed), self);

    /* Load data */
    GError *error = NULL;
    if (!todo_storage_load(self->storage, self->model, &error)) {
        if (!g_error_matches(error, G_FILE_ERROR, G_FILE_ERROR_NOENT)) {
            g_warning("Failed to load todos: %s", error->message);
        }
        g_clear_error(&error);
    }

    /* Enable autosave */
    todo_storage_set_autosave(self->storage, self->model, TRUE);

    /* Initial update */
    update_list_view(self);
    update_status_label(self);

    /* Add keyboard shortcuts */
    GtkEventController *key_controller = gtk_event_controller_key_new();
    gtk_widget_add_controller(GTK_WIDGET(self), key_controller);
}

/* Dispose */
static void
todo_window_dispose(GObject *object)
{
    TodoWindow *self = TODO_WINDOW(object);

    /* Save before closing */
    if (self->storage != NULL && self->model != NULL) {
        GError *error = NULL;
        if (!todo_storage_save(self->storage, self->model, &error)) {
            g_warning("Failed to save todos: %s", error->message);
            g_clear_error(&error);
        }
    }

    g_clear_object(&self->model);
    g_clear_object(&self->storage);

    G_OBJECT_CLASS(todo_window_parent_class)->dispose(object);
}

/* Signal handlers */
static void
on_add_button_clicked(GtkButton *button, gpointer user_data)
{
    TodoWindow *self = TODO_WINDOW(user_data);
    const gchar *text = gtk_editable_get_text(GTK_EDITABLE(self->new_todo_entry));

    add_todo_item(self, text);
}

static void
on_entry_activate(GtkEntry *entry, gpointer user_data)
{
    TodoWindow *self = TODO_WINDOW(user_data);
    const gchar *text = gtk_editable_get_text(GTK_EDITABLE(entry));

    add_todo_item(self, text);
}

static void
on_filter_toggled(GtkToggleButton *button, gpointer user_data)
{
    TodoWindow *self = TODO_WINDOW(user_data);

    if (!gtk_toggle_button_get_active(button)) {
        return;
    }

    TodoFilter filter = GPOINTER_TO_INT(g_object_get_data(G_OBJECT(button), "filter"));
    self->current_filter = filter;

    update_list_view(self);
}

static void
on_clear_completed_clicked(GtkButton *button, gpointer user_data)
{
    TodoWindow *self = TODO_WINDOW(user_data);

    guint removed = todo_model_clear_completed(self->model);

    if (removed > 0) {
        update_list_view(self);
        update_status_label(self);
    }
}

static void
on_model_items_changed(TodoModel *model, gpointer user_data)
{
    TodoWindow *self = TODO_WINDOW(user_data);

    update_list_view(self);
    update_status_label(self);
}

static void
on_row_delete_requested(TodoRow *row, gpointer user_data)
{
    TodoWindow *self = TODO_WINDOW(user_data);
    TodoItem *item = todo_row_get_item(row);

    if (item != NULL) {
        todo_model_remove_item(self->model, item);
    }
}

/* Helper functions */
static void
add_todo_item(TodoWindow *self, const gchar *title)
{
    if (title == NULL || *title == '\0') {
        return;
    }

    /* Trim whitespace */
    g_autofree gchar *trimmed = g_strstrip(g_strdup(title));

    if (*trimmed == '\0') {
        return;
    }

    todo_model_add_item(self->model, trimmed);
    gtk_editable_set_text(GTK_EDITABLE(self->new_todo_entry), "");
}

static GtkWidget *
create_row_for_item(TodoWindow *self, TodoItem *item)
{
    GtkWidget *row = todo_row_new(item);

    g_signal_connect(row, "delete-requested",
                    G_CALLBACK(on_row_delete_requested), self);

    return row;
}

static void
update_list_view(TodoWindow *self)
{
    GtkWidget *child;

    /* Remove all existing rows */
    while ((child = gtk_widget_get_first_child(GTK_WIDGET(self->todo_list))) != NULL) {
        gtk_list_box_remove(self->todo_list, child);
    }

    /* Add rows based on current filter */
    guint n_items = g_list_model_get_n_items(
        G_LIST_MODEL(todo_model_get_store(self->model))
    );

    for (guint i = 0; i < n_items; i++) {
        g_autoptr(TodoItem) item = g_list_model_get_item(
            G_LIST_MODEL(todo_model_get_store(self->model)), i
        );

        gboolean should_show = FALSE;

        switch (self->current_filter) {
            case TODO_FILTER_ALL:
                should_show = TRUE;
                break;
            case TODO_FILTER_ACTIVE:
                should_show = !todo_item_get_completed(item);
                break;
            case TODO_FILTER_COMPLETED:
                should_show = todo_item_get_completed(item);
                break;
        }

        if (should_show) {
            GtkWidget *row = create_row_for_item(self, item);
            gtk_list_box_append(self->todo_list, row);
        }
    }
}

static void
update_status_label(TodoWindow *self)
{
    guint total = todo_model_get_total_count(self->model);
    guint active = todo_model_get_active_count(self->model);
    guint completed = todo_model_get_completed_count(self->model);

    g_autofree gchar *status_text = g_strdup_printf(
        _("%u total, %u active, %u completed"),
        total, active, completed
    );

    gtk_label_set_text(self->status_label, status_text);

    /* Update clear button sensitivity */
    gtk_widget_set_sensitive(GTK_WIDGET(self->clear_completed_button),
                            completed > 0);
}

/* Public API */

/**
 * todo_window_new:
 * @app: The #GtkApplication
 *
 * Creates a new #TodoWindow.
 *
 * Returns: (transfer full): A newly created #TodoWindow
 */
GtkWidget *
todo_window_new(GtkApplication *app)
{
    return g_object_new(TODO_TYPE_WINDOW,
                       "application", app,
                       NULL);
}

/**
 * todo_window_get_model:
 * @self: A #TodoWindow
 *
 * Gets the todo model.
 *
 * Returns: (transfer none): The #TodoModel
 */
TodoModel *
todo_window_get_model(TodoWindow *self)
{
    g_return_val_if_fail(TODO_IS_WINDOW(self), NULL);

    return self->model;
}
