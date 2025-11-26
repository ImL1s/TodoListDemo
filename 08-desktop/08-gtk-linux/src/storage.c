/* storage.c
 *
 * Copyright 2025 TodoList Demo
 *
 * Implementation of TodoStorage.
 * Manages file I/O and autosave functionality.
 */

#include "storage.h"
#include <gio/gio.h>

struct _TodoStorage
{
    GObject parent_instance;

    /* Private data */
    gchar *data_path;
    guint autosave_timeout_id;
};

G_DEFINE_TYPE(TodoStorage, todo_storage, G_TYPE_OBJECT)

/* Forward declarations */
static void todo_storage_finalize(GObject *object);
static gboolean autosave_timeout(gpointer user_data);

/* Class initialization */
static void
todo_storage_class_init(TodoStorageClass *klass)
{
    GObjectClass *object_class = G_OBJECT_CLASS(klass);

    object_class->finalize = todo_storage_finalize;
}

/* Instance initialization */
static void
todo_storage_init(TodoStorage *self)
{
    self->data_path = NULL;
    self->autosave_timeout_id = 0;
}

/* Finalize */
static void
todo_storage_finalize(GObject *object)
{
    TodoStorage *self = TODO_STORAGE(object);

    g_clear_pointer(&self->data_path, g_free);

    if (self->autosave_timeout_id > 0) {
        g_source_remove(self->autosave_timeout_id);
        self->autosave_timeout_id = 0;
    }

    G_OBJECT_CLASS(todo_storage_parent_class)->finalize(object);
}

/* Autosave timeout callback */
typedef struct {
    TodoStorage *storage;
    TodoModel *model;
} AutosaveData;

static void
autosave_data_free(AutosaveData *data)
{
    g_clear_object(&data->storage);
    g_clear_object(&data->model);
    g_free(data);
}

static gboolean
autosave_timeout(gpointer user_data)
{
    AutosaveData *data = user_data;
    GError *error = NULL;

    if (!todo_storage_save(data->storage, data->model, &error)) {
        g_warning("Autosave failed: %s", error->message);
        g_clear_error(&error);
    }

    return G_SOURCE_CONTINUE;
}

/* Public API */

/**
 * todo_storage_new:
 *
 * Creates a new #TodoStorage.
 *
 * Returns: (transfer full): A newly created #TodoStorage
 */
TodoStorage *
todo_storage_new(void)
{
    return g_object_new(TODO_TYPE_STORAGE, NULL);
}

/**
 * todo_storage_get_default_path:
 * @self: A #TodoStorage
 *
 * Gets the default path for storing todo data.
 *
 * Returns: (transfer full): The default file path
 */
gchar *
todo_storage_get_default_path(TodoStorage *self)
{
    g_return_val_if_fail(TODO_IS_STORAGE(self), NULL);

    if (self->data_path != NULL) {
        return g_strdup(self->data_path);
    }

    /* Use XDG data directory */
    const gchar *data_dir = g_get_user_data_dir();
    gchar *app_dir = g_build_filename(data_dir, "todolist-gtk", NULL);

    /* Create directory if it doesn't exist */
    g_mkdir_with_parents(app_dir, 0755);

    gchar *path = g_build_filename(app_dir, "todos.json", NULL);
    g_free(app_dir);

    /* Cache the path */
    self->data_path = g_strdup(path);

    return path;
}

/**
 * todo_storage_load:
 * @self: A #TodoStorage
 * @model: The #TodoModel to load into
 * @error: (nullable): Return location for error
 *
 * Loads todo items from the default storage location.
 *
 * Returns: %TRUE on success, %FALSE on error
 */
gboolean
todo_storage_load(TodoStorage *self,
                  TodoModel *model,
                  GError **error)
{
    g_return_val_if_fail(TODO_IS_STORAGE(self), FALSE);
    g_return_val_if_fail(TODO_IS_MODEL(model), FALSE);

    g_autofree gchar *path = todo_storage_get_default_path(self);

    /* If file doesn't exist, that's OK - start with empty list */
    if (!g_file_test(path, G_FILE_TEST_EXISTS)) {
        return TRUE;
    }

    return todo_model_load_from_file(model, path, error);
}

/**
 * todo_storage_save:
 * @self: A #TodoStorage
 * @model: The #TodoModel to save
 * @error: (nullable): Return location for error
 *
 * Saves todo items to the default storage location.
 *
 * Returns: %TRUE on success, %FALSE on error
 */
gboolean
todo_storage_save(TodoStorage *self,
                  TodoModel *model,
                  GError **error)
{
    g_return_val_if_fail(TODO_IS_STORAGE(self), FALSE);
    g_return_val_if_fail(TODO_IS_MODEL(model), FALSE);

    g_autofree gchar *path = todo_storage_get_default_path(self);

    return todo_model_save_to_file(model, path, error);
}

/**
 * todo_storage_set_autosave:
 * @self: A #TodoStorage
 * @model: The #TodoModel to autosave
 * @enabled: Whether to enable autosave
 *
 * Enables or disables automatic saving.
 */
void
todo_storage_set_autosave(TodoStorage *self,
                          TodoModel *model,
                          gboolean enabled)
{
    g_return_if_fail(TODO_IS_STORAGE(self));
    g_return_if_fail(TODO_IS_MODEL(model));

    /* Remove existing timeout if any */
    if (self->autosave_timeout_id > 0) {
        g_source_remove(self->autosave_timeout_id);
        self->autosave_timeout_id = 0;
    }

    if (enabled) {
        AutosaveData *data = g_new0(AutosaveData, 1);
        data->storage = g_object_ref(self);
        data->model = g_object_ref(model);

        /* Autosave every 30 seconds */
        self->autosave_timeout_id = g_timeout_add_seconds_full(
            G_PRIORITY_DEFAULT,
            30,
            autosave_timeout,
            data,
            (GDestroyNotify)autosave_data_free
        );
    }
}

/**
 * todo_storage_export_to_file:
 * @self: A #TodoStorage
 * @model: The #TodoModel to export
 * @filename: The file to export to
 * @error: (nullable): Return location for error
 *
 * Exports todo items to a specific file.
 *
 * Returns: %TRUE on success, %FALSE on error
 */
gboolean
todo_storage_export_to_file(TodoStorage *self,
                            TodoModel *model,
                            const gchar *filename,
                            GError **error)
{
    g_return_val_if_fail(TODO_IS_STORAGE(self), FALSE);
    g_return_val_if_fail(TODO_IS_MODEL(model), FALSE);
    g_return_val_if_fail(filename != NULL, FALSE);

    return todo_model_save_to_file(model, filename, error);
}

/**
 * todo_storage_import_from_file:
 * @self: A #TodoStorage
 * @model: The #TodoModel to import into
 * @filename: The file to import from
 * @error: (nullable): Return location for error
 *
 * Imports todo items from a specific file.
 *
 * Returns: %TRUE on success, %FALSE on error
 */
gboolean
todo_storage_import_from_file(TodoStorage *self,
                              TodoModel *model,
                              const gchar *filename,
                              GError **error)
{
    g_return_val_if_fail(TODO_IS_STORAGE(self), FALSE);
    g_return_val_if_fail(TODO_IS_MODEL(model), FALSE);
    g_return_val_if_fail(filename != NULL, FALSE);

    return todo_model_load_from_file(model, filename, error);
}
