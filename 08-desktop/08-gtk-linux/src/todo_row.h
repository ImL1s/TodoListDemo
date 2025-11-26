/* todo_row.h
 *
 * Copyright 2025 TodoList Demo
 *
 * Custom GtkListBoxRow for displaying a single todo item.
 * Demonstrates widget subclassing and composite templates.
 */

#ifndef TODO_ROW_H
#define TODO_ROW_H

#include <gtk/gtk.h>
#include "todo_item.h"

G_BEGIN_DECLS

#define TODO_TYPE_ROW (todo_row_get_type())
G_DECLARE_FINAL_TYPE(TodoRow, todo_row, TODO, ROW, GtkListBoxRow)

/**
 * todo_row_new:
 * @item: The #TodoItem to display
 *
 * Creates a new #TodoRow for the given item.
 *
 * Returns: (transfer full): A newly created #TodoRow
 */
GtkWidget *todo_row_new(TodoItem *item);

/**
 * todo_row_get_item:
 * @self: A #TodoRow
 *
 * Gets the #TodoItem associated with this row.
 *
 * Returns: (transfer none): The associated #TodoItem
 */
TodoItem *todo_row_get_item(TodoRow *self);

/**
 * todo_row_set_item:
 * @self: A #TodoRow
 * @item: The #TodoItem to display
 *
 * Sets the #TodoItem to display in this row.
 */
void todo_row_set_item(TodoRow *self, TodoItem *item);

G_END_DECLS

#endif /* TODO_ROW_H */
