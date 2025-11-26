/* todo_item.h
 *
 * Copyright 2025 TodoList Demo
 *
 * This file represents a single Todo item using GObject type system.
 * It demonstrates GObject properties, signals, and memory management.
 */

#ifndef TODO_ITEM_H
#define TODO_ITEM_H

#include <glib-object.h>

G_BEGIN_DECLS

#define TODO_TYPE_ITEM (todo_item_get_type())
G_DECLARE_FINAL_TYPE(TodoItem, todo_item, TODO, ITEM, GObject)

/**
 * todo_item_new:
 * @title: The title of the todo item
 *
 * Creates a new #TodoItem with the given title.
 *
 * Returns: (transfer full): A newly created #TodoItem
 */
TodoItem *todo_item_new(const gchar *title);

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
TodoItem *todo_item_new_full(const gchar *title, gboolean completed, guint id);

/**
 * todo_item_get_title:
 * @self: A #TodoItem
 *
 * Gets the title of the todo item.
 *
 * Returns: (transfer none): The title string
 */
const gchar *todo_item_get_title(TodoItem *self);

/**
 * todo_item_set_title:
 * @self: A #TodoItem
 * @title: The new title
 *
 * Sets the title of the todo item.
 */
void todo_item_set_title(TodoItem *self, const gchar *title);

/**
 * todo_item_get_completed:
 * @self: A #TodoItem
 *
 * Gets whether the todo item is completed.
 *
 * Returns: %TRUE if completed, %FALSE otherwise
 */
gboolean todo_item_get_completed(TodoItem *self);

/**
 * todo_item_set_completed:
 * @self: A #TodoItem
 * @completed: Whether the item is completed
 *
 * Sets the completion status of the todo item.
 */
void todo_item_set_completed(TodoItem *self, gboolean completed);

/**
 * todo_item_get_id:
 * @self: A #TodoItem
 *
 * Gets the unique ID of the todo item.
 *
 * Returns: The item ID
 */
guint todo_item_get_id(TodoItem *self);

/**
 * todo_item_set_id:
 * @self: A #TodoItem
 * @id: The unique ID
 *
 * Sets the unique ID of the todo item.
 */
void todo_item_set_id(TodoItem *self, guint id);

/**
 * todo_item_get_created_at:
 * @self: A #TodoItem
 *
 * Gets the creation timestamp of the todo item.
 *
 * Returns: (transfer none): A #GDateTime representing creation time
 */
GDateTime *todo_item_get_created_at(TodoItem *self);

/**
 * todo_item_toggle_completed:
 * @self: A #TodoItem
 *
 * Toggles the completion status of the todo item.
 */
void todo_item_toggle_completed(TodoItem *self);

G_END_DECLS

#endif /* TODO_ITEM_H */
