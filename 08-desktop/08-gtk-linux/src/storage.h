/* storage.h
 *
 * Copyright 2025 TodoList Demo
 *
 * Storage manager for persisting todo items.
 * Handles file paths, autosave, and data directory management.
 */

#ifndef STORAGE_H
#define STORAGE_H

#include <glib-object.h>
#include "todo_model.h"

G_BEGIN_DECLS

#define TODO_TYPE_STORAGE (todo_storage_get_type())
G_DECLARE_FINAL_TYPE(TodoStorage, todo_storage, TODO, STORAGE, GObject)

/**
 * todo_storage_new:
 *
 * Creates a new #TodoStorage.
 *
 * Returns: (transfer full): A newly created #TodoStorage
 */
TodoStorage *todo_storage_new(void);

/**
 * todo_storage_get_default_path:
 * @self: A #TodoStorage
 *
 * Gets the default path for storing todo data.
 *
 * Returns: (transfer full): The default file path
 */
gchar *todo_storage_get_default_path(TodoStorage *self);

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
gboolean todo_storage_load(TodoStorage *self,
                           TodoModel *model,
                           GError **error);

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
gboolean todo_storage_save(TodoStorage *self,
                           TodoModel *model,
                           GError **error);

/**
 * todo_storage_set_autosave:
 * @self: A #TodoStorage
 * @model: The #TodoModel to autosave
 * @enabled: Whether to enable autosave
 *
 * Enables or disables automatic saving.
 */
void todo_storage_set_autosave(TodoStorage *self,
                               TodoModel *model,
                               gboolean enabled);

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
gboolean todo_storage_export_to_file(TodoStorage *self,
                                     TodoModel *model,
                                     const gchar *filename,
                                     GError **error);

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
gboolean todo_storage_import_from_file(TodoStorage *self,
                                       TodoModel *model,
                                       const gchar *filename,
                                       GError **error);

G_END_DECLS

#endif /* STORAGE_H */
