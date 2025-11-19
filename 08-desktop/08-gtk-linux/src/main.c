/* main.c
 *
 * Copyright 2025 TodoList Demo
 *
 * Main entry point for the GTK Todo List application.
 * Demonstrates GtkApplication setup and lifecycle.
 */

#include <gtk/gtk.h>
#include <glib/gi18n.h>
#include "todo_window.h"

/* Application ID */
#define APP_ID "com.example.TodoListGTK"

/* Callback for application activation */
static void
on_activate(GtkApplication *app, gpointer user_data)
{
    GtkWidget *window;

    /* Create a new window */
    window = todo_window_new(app);

    /* Present the window */
    gtk_window_present(GTK_WINDOW(window));
}

/* Callback for application startup */
static void
on_startup(GtkApplication *app, gpointer user_data)
{
    /* Set up actions and accelerators */
    const gchar *quit_accels[] = { "<Ctrl>Q", NULL };
    const gchar *new_accels[] = { "<Ctrl>N", NULL };

    /* Quit action */
    GSimpleAction *quit_action = g_simple_action_new("quit", NULL);
    g_signal_connect_swapped(quit_action, "activate",
                            G_CALLBACK(g_application_quit), app);
    g_action_map_add_action(G_ACTION_MAP(app), G_ACTION(quit_action));
    gtk_application_set_accels_for_action(GTK_APPLICATION(app),
                                         "app.quit",
                                         quit_accels);

    /* Load CSS */
    GtkCssProvider *css_provider = gtk_css_provider_new();
    gtk_css_provider_load_from_data(css_provider,
        ".strikethrough { text-decoration: line-through; }\n"
        ".boxed-list { border-radius: 6px; }\n",
        -1);
    gtk_style_context_add_provider_for_display(
        gdk_display_get_default(),
        GTK_STYLE_PROVIDER(css_provider),
        GTK_STYLE_PROVIDER_PRIORITY_APPLICATION
    );
    g_object_unref(css_provider);
}

/* Main function */
int
main(int argc, char *argv[])
{
    g_autoptr(GtkApplication) app = NULL;
    int status;

    /* Set up internationalization */
    bindtextdomain(GETTEXT_PACKAGE, LOCALEDIR);
    bind_textdomain_codeset(GETTEXT_PACKAGE, "UTF-8");
    textdomain(GETTEXT_PACKAGE);

    /* Create the application */
    app = gtk_application_new(APP_ID, G_APPLICATION_FLAGS_NONE);

    /* Connect signals */
    g_signal_connect(app, "activate", G_CALLBACK(on_activate), NULL);
    g_signal_connect(app, "startup", G_CALLBACK(on_startup), NULL);

    /* Run the application */
    status = g_application_run(G_APPLICATION(app), argc, argv);

    return status;
}
