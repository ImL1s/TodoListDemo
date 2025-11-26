use bevy::prelude::*;
use crate::systems::*;
use crate::resources::*;
use crate::events::*;

/// Main plugin for the Todo List application
///
/// This plugin encapsulates all the todo-related functionality:
/// - Resources initialization
/// - Event registration
/// - System scheduling
pub struct TodoPlugin;

impl Plugin for TodoPlugin {
    fn build(&self, app: &mut App) {
        info!("Initializing TodoPlugin...");

        app
            // Initialize resources
            .init_resource::<TodoList>()
            .init_resource::<UIState>()
            .init_resource::<AppSettings>()
            .init_resource::<AnimationState>()

            // Register events
            .add_event::<AddTodoEvent>()
            .add_event::<DeleteTodoEvent>()
            .add_event::<ToggleTodoEvent>()
            .add_event::<EditTodoEvent>()
            .add_event::<FilterChangedEvent>()
            .add_event::<ClearCompletedEvent>()
            .add_event::<SaveTodosEvent>()
            .add_event::<LoadTodosEvent>()
            .add_event::<RebuildUIEvent>()
            .add_event::<TodoOperationSuccessEvent>()
            .add_event::<TodoOperationErrorEvent>()

            // Startup systems - run once at the beginning
            .add_systems(Startup, (
                setup_ui,
                startup_load_todos,
            ).chain())

            // Update systems - run every frame
            .add_systems(Update, (
                // Input handling systems
                handle_keyboard_input,
                handle_button_clicks,
                handle_scroll_input,
                handle_debug_shortcuts,
                handle_todo_item_clicks,

                // Todo operation systems
                handle_add_todo,
                handle_delete_todo,
                handle_toggle_todo,
                handle_edit_todo,
                handle_filter_changed,
                handle_clear_completed,
                handle_save_todos,
                handle_load_todos,

                // UI update systems
                rebuild_todo_list_ui,
                update_items_remaining,
                update_input_display,
                button_hover_system,
                update_filter_buttons,

                // Background systems
                auto_save_todos,
            ));

        info!("TodoPlugin initialized successfully");
    }
}

/// Plugin for managing UI state and animations
pub struct UIPlugin;

impl Plugin for UIPlugin {
    fn build(&self, app: &mut App) {
        info!("Initializing UIPlugin...");

        app.add_systems(Update, update_animations);

        info!("UIPlugin initialized successfully");
    }
}

/// System that updates animations
fn update_animations(
    time: Res<Time>,
    mut animation_state: ResMut<AnimationState>,
) {
    animation_state.update(time.delta_seconds());
}

/// Plugin for debug features
pub struct DebugPlugin;

impl Plugin for DebugPlugin {
    fn build(&self, app: &mut App) {
        info!("Initializing DebugPlugin...");

        app.add_systems(Update, (
            debug_display_system,
            debug_performance_system,
        ));

        info!("DebugPlugin initialized successfully");
    }
}

/// System that displays debug information
fn debug_display_system(
    app_settings: Res<AppSettings>,
    todo_list: Res<TodoList>,
    diagnostics: Res<bevy::diagnostic::DiagnosticsStore>,
) {
    if !app_settings.show_debug {
        return;
    }

    // This would render debug info to screen
    // For now, we just log it occasionally
}

/// System that monitors performance
fn debug_performance_system(
    diagnostics: Res<bevy::diagnostic::DiagnosticsStore>,
    app_settings: Res<AppSettings>,
) {
    if !app_settings.show_debug {
        return;
    }

    // Monitor FPS and other performance metrics
    if let Some(fps_diagnostic) = diagnostics.get(&bevy::diagnostic::FrameTimeDiagnosticsPlugin::FPS) {
        if let Some(fps) = fps_diagnostic.smoothed() {
            if fps < 30.0 {
                warn!("Low FPS detected: {:.2}", fps);
            }
        }
    }
}
