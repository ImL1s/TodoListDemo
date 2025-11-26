/* todo_model.h
 *
 * Copyright 2025 TodoList Demo
 *
 * Data model for managing todo items.
 * Uses GListStore to hold TodoItem objects.
 */

#ifndef TODO_MODEL_H
#define TODO_MODEL_H

#include <gio/gio.h>
#include "todo_item.h"

G_BEGIN_DECLS

#define TODO_TYPE_MODEL (todo_model_get_type())
G_DECLARE_FINAL_TYPE(TodoModel, todo_model, TODO, MODEL, GObject)

typedef enum {
    TODO_FILTER_ALL,
    TODO_FILTER_ACTIVE,
    TODO_FILTER_COMPLETED
} TodoFilter;

/**
 * todo_model_new:
 *
 * Creates a new #TodoModel.
 *
 * Returns: (transfer full): A newly created #TodoModel
 */
TodoModel *todo_model_new(void);

/**
 * todo_model_add_item:
 * @self: A #TodoModel
 * @title: The title of the new item
 *
 * Adds a new todo item to the model.
 *
 * Returns: (transfer none): The newly created #TodoItem
 */
TodoItem *todo_model_add_item(TodoModel *self, const gchar *title);

/**
 * todo_model_remove_item:
 * @self: A #TodoModel
 * @item: The #TodoItem to remove
 *
 * Removes a todo item from the model.
 */
void todo_model_remove_item(TodoModel *self, TodoItem *item);

/**
 * todo_model_remove_item_by_id:
 * @self: A #TodoModel
 * @id: The ID of the item to remove
 *
 * Removes a todo item from the model by its ID.
 *
 * Returns: %TRUE if the item was found and removed
 */
gboolean todo_model_remove_item_by_id(TodoModel *self, guint id);

/**
 * todo_model_get_item_by_id:
 * @self: A #TodoModel
 * @id: The ID of the item to find
 *
 * Finds a todo item by its ID.
 *
 * Returns: (transfer none) (nullable): The found #TodoItem or %NULL
 */
TodoItem *todo_model_get_item_by_id(TodoModel *self, guint id);

/**
 * todo_model_clear_completed:
 * @self: A #TodoModel
 *
 * Removes all completed items from the model.
 *
 * Returns: The number of items removed
 */
guint todo_model_clear_completed(TodoModel *self);

/**
 * todo_model_get_store:
 * @self: A #TodoModel
 *
 * Gets the underlying GListStore.
 *
 * Returns: (transfer none): The #GListStore containing all items
 */
GListStore *todo_model_get_store(TodoModel *self);

/**
 * todo_model_get_filtered_store:
 * @self: A #TodoModel
 * @filter: The filter to apply
 *
 * Gets a filtered view of the items.
 *
 * Returns: (transfer full): A new #GtkFilterListModel
 */
GListModel *todo_model_get_filtered_store(TodoModel *self, TodoFilter filter);

/**
 * todo_model_get_total_count:
 * @self: A #TodoModel
 *
 * Gets the total number of items.
 *
 * Returns: The total count
 */
guint todo_model_get_total_count(TodoModel *self);

/**
 * todo_model_get_active_count:
 * @self: A #TodoModel
 *
 * Gets the number of active (not completed) items.
 *
 * Returns: The active count
 */
guint todo_model_get_active_count(TodoModel *self);

/**
 * todo_model_get_completed_count:
 * @self: A #TodoModel
 *
 * Gets the number of completed items.
 *
 * Returns: The completed count
 */
guint todo_model_get_completed_count(TodoModel *self);

/**
 * todo_model_load_from_file:
 * @self: A #TodoModel
 * @filename: The file to load from
 * @error: (nullable): Return location for error
 *
 * Loads todo items from a file.
 *
 * Returns: %TRUE on success, %FALSE on error
 */
gboolean todo_model_load_from_file(TodoModel *self,
                                   const gchar *filename,
                                   GError **error);

/**
 * todo_model_save_to_file:
 * @self: A #TodoModel
 * @filename: The file to save to
 * @error: (nullable): Return location for error
 *
 * Saves todo items to a file.
 *
 * Returns: %TRUE on success, %FALSE on error
 */
gboolean todo_model_save_to_file(TodoModel *self,
                                 const gchar *filename,
                                 GError **error);

G_END_DECLS

#endif /* TODO_MODEL_H */
