use bevy::prelude::*;
use bevy::input::keyboard::KeyboardInput;
use bevy::input::ButtonState;
use crate::components::*;
use crate::events::*;
use crate::resources::*;

/// System that handles keyboard input for the text field
pub fn handle_keyboard_input(
    mut char_events: EventReader<ReceivedCharacter>,
    mut key_events: EventReader<KeyboardInput>,
    mut input_query: Query<&mut InputText, With<TodoInputField>>,
    mut add_todo_events: EventWriter<AddTodoEvent>,
    mut save_events: EventWriter<SaveTodosEvent>,
    mut load_events: EventWriter<LoadTodosEvent>,
    ui_state: Res<UIState>,
    keys: Res<ButtonInput<KeyCode>>,
) {
    if !ui_state.input_active {
        return;
    }

    let Ok(mut input_text) = input_query.get_single_mut() else {
        return;
    };

    // Handle character input
    for event in char_events.read() {
        let c = event.char;

        // Ignore control characters
        if c.is_control() {
            continue;
        }

        input_text.push(c);
    }

    // Handle special keys
    for event in key_events.read() {
        if event.state != ButtonState::Pressed {
            continue;
        }

        match event.key_code {
            KeyCode::Backspace => {
                input_text.pop();
            }
            KeyCode::Enter => {
                // Add todo
                if !input_text.is_empty() {
                    add_todo_events.send(AddTodoEvent::new(input_text.value.clone()));
                    input_text.clear();
                }
            }
            KeyCode::Escape => {
                // Clear input
                input_text.clear();
            }
            _ => {}
        }
    }

    // Handle Ctrl+S to save
    if keys.pressed(KeyCode::ControlLeft) || keys.pressed(KeyCode::ControlRight) {
        if keys.just_pressed(KeyCode::KeyS) {
            save_events.send(SaveTodosEvent);
            info!("Manual save triggered");
        }

        // Handle Ctrl+O to load
        if keys.just_pressed(KeyCode::KeyO) {
            load_events.send(LoadTodosEvent);
            info!("Manual load triggered");
        }
    }
}

/// System that handles button click interactions
pub fn handle_button_clicks(
    interaction_query: Query<(&Interaction, Option<&AddTodoButton>, Option<&TodoCheckbox>,
                              Option<&TodoDeleteButton>, Option<&FilterButton>,
                              Option<&ClearCompletedButton>), Changed<Interaction>>,
    input_query: Query<&InputText, With<TodoInputField>>,
    mut add_events: EventWriter<AddTodoEvent>,
    mut toggle_events: EventWriter<ToggleTodoEvent>,
    mut delete_events: EventWriter<DeleteTodoEvent>,
    mut filter_events: EventWriter<FilterChangedEvent>,
    mut clear_events: EventWriter<ClearCompletedEvent>,
    mut input_text_query: Query<&mut InputText, With<TodoInputField>>,
) {
    for (interaction, add_btn, checkbox, delete_btn, filter_btn, clear_btn) in interaction_query.iter() {
        if *interaction != Interaction::Pressed {
            continue;
        }

        // Handle Add button
        if add_btn.is_some() {
            if let Ok(input_text) = input_query.get_single() {
                if !input_text.is_empty() {
                    add_events.send(AddTodoEvent::new(input_text.value.clone()));

                    // Clear input after adding
                    if let Ok(mut input) = input_text_query.get_single_mut() {
                        input.clear();
                    }
                }
            }
        }

        // Handle Checkbox (toggle)
        if let Some(checkbox) = checkbox {
            toggle_events.send(ToggleTodoEvent::new(checkbox.todo_id));
        }

        // Handle Delete button
        if let Some(delete_btn) = delete_btn {
            delete_events.send(DeleteTodoEvent::new(delete_btn.todo_id));
        }

        // Handle Filter button
        if let Some(filter_btn) = filter_btn {
            filter_events.send(FilterChangedEvent::new(filter_btn.filter_type));
        }

        // Handle Clear Completed button
        if clear_btn.is_some() {
            clear_events.send(ClearCompletedEvent);
        }
    }
}

/// System that handles mouse wheel scrolling in the todo list
pub fn handle_scroll_input(
    mut scroll_events: EventReader<MouseWheel>,
    mut container_query: Query<&mut Style, With<TodoListContainer>>,
) {
    for event in scroll_events.read() {
        for mut style in container_query.iter_mut() {
            // Adjust scroll position based on wheel movement
            // Note: This is a simplified implementation
            // In a real app, you'd want to track scroll position more carefully
            match event.unit {
                bevy::input::mouse::MouseScrollUnit::Line => {
                    // Handle line-based scrolling
                    info!("Scroll by lines: {}", event.y);
                }
                bevy::input::mouse::MouseScrollUnit::Pixel => {
                    // Handle pixel-based scrolling
                    info!("Scroll by pixels: {}", event.y);
                }
            }
        }
    }
}

/// System that handles debug key shortcuts
pub fn handle_debug_shortcuts(
    keys: Res<ButtonInput<KeyCode>>,
    mut app_settings: ResMut<AppSettings>,
    todo_list: Res<TodoList>,
) {
    // F1: Toggle debug mode
    if keys.just_pressed(KeyCode::F1) {
        app_settings.toggle_debug();
        info!("Debug mode: {}", app_settings.show_debug);
    }

    // F2: Print todo statistics
    if keys.just_pressed(KeyCode::F2) {
        info!("=== Todo Statistics ===");
        info!("Total: {}", todo_list.total_count());
        info!("Active: {}", todo_list.active_count());
        info!("Completed: {}", todo_list.completed_count());
        info!("Current filter: {:?}", todo_list.filter);
        info!("======================");
    }

    // F3: Print all todos
    if keys.just_pressed(KeyCode::F3) {
        info!("=== All Todos ===");
        for todo in todo_list.items.iter() {
            info!("{}: {} [{}]", todo.id, todo.title,
                  if todo.completed { "✓" } else { " " });
        }
        info!("=================");
    }
}

/// System that handles mouse input on todo items
pub fn handle_todo_item_clicks(
    interaction_query: Query<(&Interaction, Option<&TodoItemUI>), Changed<Interaction>>,
) {
    for (interaction, todo_item_ui) in interaction_query.iter() {
        if *interaction == Interaction::Pressed {
            if let Some(todo_ui) = todo_item_ui {
                info!("Clicked on todo item: {}", todo_ui.todo_id);
            }
        }
    }
}
