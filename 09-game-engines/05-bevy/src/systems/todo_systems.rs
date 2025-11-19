use bevy::prelude::*;
use crate::events::*;
use crate::resources::*;
use crate::utils;

/// System that handles adding new todos
pub fn handle_add_todo(
    mut todo_list: ResMut<TodoList>,
    mut events: EventReader<AddTodoEvent>,
    mut rebuild_events: EventWriter<RebuildUIEvent>,
    mut ui_state: ResMut<UIState>,
) {
    for event in events.read() {
        let title = event.title.trim().to_string();

        if !title.is_empty() {
            let id = todo_list.add_todo(title);
            if id > 0 {
                ui_state.mark_dirty();
                rebuild_events.send(RebuildUIEvent);
                info!("Todo added successfully with ID: {}", id);
            }
        } else {
            warn!("Attempted to add empty todo");
        }
    }
}

/// System that handles deleting todos
pub fn handle_delete_todo(
    mut todo_list: ResMut<TodoList>,
    mut events: EventReader<DeleteTodoEvent>,
    mut rebuild_events: EventWriter<RebuildUIEvent>,
    mut ui_state: ResMut<UIState>,
) {
    for event in events.read() {
        if todo_list.remove_todo(event.id) {
            ui_state.mark_dirty();
            rebuild_events.send(RebuildUIEvent);
            info!("Todo deleted successfully: {}", event.id);
        }
    }
}

/// System that handles toggling todo completion status
pub fn handle_toggle_todo(
    mut todo_list: ResMut<TodoList>,
    mut events: EventReader<ToggleTodoEvent>,
    mut rebuild_events: EventWriter<RebuildUIEvent>,
    mut ui_state: ResMut<UIState>,
) {
    for event in events.read() {
        if todo_list.toggle_todo(event.id) {
            ui_state.mark_dirty();
            rebuild_events.send(RebuildUIEvent);
            info!("Todo toggled successfully: {}", event.id);
        }
    }
}

/// System that handles editing todos
pub fn handle_edit_todo(
    mut todo_list: ResMut<TodoList>,
    mut events: EventReader<EditTodoEvent>,
    mut rebuild_events: EventWriter<RebuildUIEvent>,
    mut ui_state: ResMut<UIState>,
) {
    for event in events.read() {
        if todo_list.update_todo(event.id, event.new_title.clone()) {
            ui_state.mark_dirty();
            rebuild_events.send(RebuildUIEvent);
            info!("Todo edited successfully: {}", event.id);
        }
    }
}

/// System that handles filter changes
pub fn handle_filter_changed(
    mut todo_list: ResMut<TodoList>,
    mut events: EventReader<FilterChangedEvent>,
    mut rebuild_events: EventWriter<RebuildUIEvent>,
    mut ui_state: ResMut<UIState>,
) {
    for event in events.read() {
        todo_list.set_filter(event.filter);
        ui_state.mark_dirty();
        rebuild_events.send(RebuildUIEvent);
        info!("Filter changed to: {:?}", event.filter);
    }
}

/// System that handles clearing completed todos
pub fn handle_clear_completed(
    mut todo_list: ResMut<TodoList>,
    mut events: EventReader<ClearCompletedEvent>,
    mut rebuild_events: EventWriter<RebuildUIEvent>,
    mut ui_state: ResMut<UIState>,
) {
    for _event in events.read() {
        let count = todo_list.clear_completed();
        if count > 0 {
            ui_state.mark_dirty();
            rebuild_events.send(RebuildUIEvent);
            info!("Cleared {} completed todos", count);
        }
    }
}

/// System that handles saving todos to disk
pub fn handle_save_todos(
    todo_list: Res<TodoList>,
    mut events: EventReader<SaveTodosEvent>,
    mut success_events: EventWriter<TodoOperationSuccessEvent>,
    mut error_events: EventWriter<TodoOperationErrorEvent>,
) {
    for _event in events.read() {
        match utils::save_todos(&todo_list) {
            Ok(()) => {
                let msg = format!("Saved {} todos to disk", todo_list.total_count());
                info!("{}", msg);
                success_events.send(TodoOperationSuccessEvent::new(msg));
            }
            Err(e) => {
                let msg = format!("Failed to save todos: {}", e);
                error!("{}", msg);
                error_events.send(TodoOperationErrorEvent::new(msg));
            }
        }
    }
}

/// System that handles loading todos from disk
pub fn handle_load_todos(
    mut todo_list: ResMut<TodoList>,
    mut events: EventReader<LoadTodosEvent>,
    mut rebuild_events: EventWriter<RebuildUIEvent>,
    mut ui_state: ResMut<UIState>,
    mut success_events: EventWriter<TodoOperationSuccessEvent>,
    mut error_events: EventWriter<TodoOperationErrorEvent>,
) {
    for _event in events.read() {
        match utils::load_todos() {
            Ok(loaded_list) => {
                let count = loaded_list.total_count();
                *todo_list = loaded_list;
                ui_state.mark_dirty();
                rebuild_events.send(RebuildUIEvent);

                let msg = format!("Loaded {} todos from disk", count);
                info!("{}", msg);
                success_events.send(TodoOperationSuccessEvent::new(msg));
            }
            Err(e) => {
                let msg = format!("Failed to load todos: {}", e);
                error!("{}", msg);
                error_events.send(TodoOperationErrorEvent::new(msg));
            }
        }
    }
}

/// System that auto-saves todos periodically
pub fn auto_save_todos(
    time: Res<Time>,
    todo_list: Res<TodoList>,
    mut last_save: Local<f32>,
) {
    const SAVE_INTERVAL: f32 = 30.0; // Save every 30 seconds

    *last_save += time.delta_seconds();

    if *last_save >= SAVE_INTERVAL {
        *last_save = 0.0;

        if todo_list.has_todos() {
            if let Err(e) = utils::save_todos(&todo_list) {
                error!("Auto-save failed: {}", e);
            } else {
                info!("Auto-saved {} todos", todo_list.total_count());
            }
        }
    }
}

/// System that loads todos on startup
pub fn startup_load_todos(
    mut todo_list: ResMut<TodoList>,
    mut rebuild_events: EventWriter<RebuildUIEvent>,
    mut ui_state: ResMut<UIState>,
) {
    if utils::storage_exists() {
        match utils::load_todos() {
            Ok(loaded_list) => {
                let count = loaded_list.total_count();
                *todo_list = loaded_list;
                ui_state.mark_dirty();
                rebuild_events.send(RebuildUIEvent);
                info!("Loaded {} todos on startup", count);
            }
            Err(e) => {
                error!("Failed to load todos on startup: {}", e);
            }
        }
    } else {
        info!("No saved todos found, starting fresh");
    }
}
