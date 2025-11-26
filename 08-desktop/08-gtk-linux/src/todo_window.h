/* todo_window.h
 *
 * Copyright 2025 TodoList Demo
 *
 * Main application window.
 * Demonstrates GTK application window, header bar, and UI composition.
 */

#ifndef TODO_WINDOW_H
#define TODO_WINDOW_H

#include <gtk/gtk.h>
#include "todo_model.h"
#include "storage.h"

G_BEGIN_DECLS

#define TODO_TYPE_WINDOW (todo_window_get_type())
G_DECLARE_FINAL_TYPE(TodoWindow, todo_window, TODO, WINDOW, GtkApplicationWindow)

/**
 * todo_window_new:
 * @app: The #GtkApplication
 *
 * Creates a new #TodoWindow.
 *
 * Returns: (transfer full): A newly created #TodoWindow
 */
GtkWidget *todo_window_new(GtkApplication *app);

/**
 * todo_window_get_model:
 * @self: A #TodoWindow
 *
 * Gets the todo model.
 *
 * Returns: (transfer none): The #TodoModel
 */
TodoModel *todo_window_get_model(TodoWindow *self);

G_END_DECLS

#endif /* TODO_WINDOW_H */
