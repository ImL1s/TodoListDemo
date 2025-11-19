use bevy::prelude::*;
use crate::components::*;
use crate::resources::*;
use crate::events::*;

/// System that rebuilds the todo list UI when needed
pub fn rebuild_todo_list_ui(
    mut commands: Commands,
    todo_list: Res<TodoList>,
    app_settings: Res<AppSettings>,
    mut ui_state: ResMut<UIState>,
    container_query: Query<Entity, With<TodoListContainer>>,
    todo_ui_query: Query<Entity, With<TodoItemUI>>,
    mut events: EventReader<RebuildUIEvent>,
) {
    // Only rebuild if there's a rebuild event
    if events.read().count() == 0 {
        return;
    }

    info!("Rebuilding todo list UI...");

    // Clear existing todo items
    for entity in todo_ui_query.iter() {
        commands.entity(entity).despawn_recursive();
    }

    // Get the container entity
    let Ok(container) = container_query.get_single() else {
        error!("Todo list container not found!");
        return;
    };

    // Get filtered todos
    let filtered_todos = todo_list.filtered_items();

    // Spawn new todo items
    commands.entity(container).with_children(|parent| {
        for todo in filtered_todos.iter() {
            spawn_todo_item(parent, todo, &app_settings);
        }
    });

    ui_state.mark_clean();
    info!("UI rebuild complete - {} todos displayed", filtered_todos.len());
}

/// Helper function to spawn a single todo item UI
fn spawn_todo_item(
    parent: &mut ChildBuilder,
    todo: &TodoItem,
    app_settings: &AppSettings,
) {
    parent
        .spawn(NodeBundle {
            style: Style {
                width: Val::Percent(100.0),
                height: Val::Px(50.0),
                flex_direction: FlexDirection::Row,
                align_items: AlignItems::Center,
                padding: UiRect::all(Val::Px(10.0)),
                margin: UiRect::bottom(Val::Px(5.0)),
                ..default()
            },
            background_color: Color::WHITE.into(),
            border_color: Color::rgb(0.8, 0.8, 0.8).into(),
            ..default()
        })
        .insert(TodoItemUI { todo_id: todo.id })
        .with_children(|parent| {
            // Checkbox
            parent
                .spawn(ButtonBundle {
                    style: Style {
                        width: Val::Px(30.0),
                        height: Val::Px(30.0),
                        margin: UiRect::right(Val::Px(10.0)),
                        justify_content: JustifyContent::Center,
                        align_items: AlignItems::Center,
                        ..default()
                    },
                    background_color: if todo.completed {
                        Color::rgb(0.3, 0.7, 0.3)
                    } else {
                        Color::rgb(0.9, 0.9, 0.9)
                    }
                    .into(),
                    ..default()
                })
                .insert(TodoCheckbox { todo_id: todo.id })
                .insert(InteractiveButton)
                .insert(ButtonColors::with_colors(
                    Color::rgb(0.9, 0.9, 0.9),
                    Color::rgb(0.7, 0.9, 0.7),
                    Color::rgb(0.3, 0.7, 0.3),
                ))
                .with_children(|parent| {
                    if todo.completed {
                        parent.spawn(TextBundle {
                            text: Text::from_section(
                                "✓",
                                TextStyle {
                                    font_size: 20.0,
                                    color: Color::WHITE,
                                    ..default()
                                },
                            ),
                            ..default()
                        });
                    }
                });

            // Todo title
            parent
                .spawn(NodeBundle {
                    style: Style {
                        flex_grow: 1.0,
                        padding: UiRect::all(Val::Px(5.0)),
                        ..default()
                    },
                    ..default()
                })
                .with_children(|parent| {
                    parent
                        .spawn(TextBundle {
                            text: Text::from_section(
                                &todo.title,
                                TextStyle {
                                    font_size: app_settings.normal_font_size,
                                    color: if todo.completed {
                                        app_settings.secondary_text_color
                                    } else {
                                        app_settings.text_color
                                    },
                                    ..default()
                                },
                            ),
                            ..default()
                        })
                        .insert(TodoTitleText { todo_id: todo.id });
                });

            // Delete button
            parent
                .spawn(ButtonBundle {
                    style: Style {
                        width: Val::Px(60.0),
                        height: Val::Px(30.0),
                        justify_content: JustifyContent::Center,
                        align_items: AlignItems::Center,
                        ..default()
                    },
                    background_color: Color::rgb(0.8, 0.2, 0.2).into(),
                    ..default()
                })
                .insert(TodoDeleteButton { todo_id: todo.id })
                .insert(InteractiveButton)
                .insert(ButtonColors::with_colors(
                    Color::rgb(0.8, 0.2, 0.2),
                    Color::rgb(0.9, 0.3, 0.3),
                    Color::rgb(0.7, 0.1, 0.1),
                ))
                .with_children(|parent| {
                    parent.spawn(TextBundle {
                        text: Text::from_section(
                            "Delete",
                            TextStyle {
                                font_size: app_settings.small_font_size,
                                color: Color::WHITE,
                                ..default()
                            },
                        ),
                        ..default()
                    });
                });
        });
}

/// System that updates the "items remaining" counter
pub fn update_items_remaining(
    todo_list: Res<TodoList>,
    app_settings: Res<AppSettings>,
    mut text_query: Query<&mut Text, With<ItemsRemainingText>>,
) {
    if !todo_list.is_changed() {
        return;
    }

    for mut text in text_query.iter_mut() {
        let count = todo_list.active_count();
        let item_word = if count == 1 { "item" } else { "items" };
        text.sections[0].value = format!("{} {} left", count, item_word);
        text.sections[0].style.color = app_settings.secondary_text_color;
    }
}

/// System that updates the input field text display
pub fn update_input_display(
    input_query: Query<(&InputText, &Children), (With<TodoInputField>, Changed<InputText>)>,
    mut text_query: Query<&mut Text>,
    app_settings: Res<AppSettings>,
) {
    for (input_text, children) in input_query.iter() {
        for &child in children.iter() {
            if let Ok(mut text) = text_query.get_mut(child) {
                if input_text.is_empty() {
                    text.sections[0].value = "Type here...".to_string();
                    text.sections[0].style.color = app_settings.secondary_text_color;
                } else {
                    text.sections[0].value = input_text.value.clone();
                    text.sections[0].style.color = app_settings.text_color;
                }
            }
        }
    }
}

/// System that handles button hover effects
pub fn button_hover_system(
    mut interaction_query: Query<
        (&Interaction, &ButtonColors, &mut BackgroundColor),
        (Changed<Interaction>, With<InteractiveButton>),
    >,
) {
    for (interaction, colors, mut bg_color) in interaction_query.iter_mut() {
        match *interaction {
            Interaction::Pressed => {
                *bg_color = colors.pressed.into();
            }
            Interaction::Hovered => {
                *bg_color = colors.hovered.into();
            }
            Interaction::None => {
                *bg_color = colors.normal.into();
            }
        }
    }
}

/// System that handles filter button highlighting
pub fn update_filter_buttons(
    todo_list: Res<TodoList>,
    mut button_query: Query<(&FilterButton, &mut BackgroundColor)>,
) {
    if !todo_list.is_changed() {
        return;
    }

    for (filter_button, mut bg_color) in button_query.iter_mut() {
        if filter_button.filter_type == todo_list.filter {
            *bg_color = Color::rgb(0.3, 0.6, 0.9).into(); // Active color
        } else {
            *bg_color = Color::rgb(0.15, 0.15, 0.15).into(); // Normal color
        }
    }
}
