use bevy::prelude::*;
use crate::components::*;
use crate::resources::*;

/// System that sets up the initial UI when the app starts
pub fn setup_ui(
    mut commands: Commands,
    app_settings: Res<AppSettings>,
) {
    info!("Setting up UI...");

    // Spawn the camera
    commands.spawn(Camera2dBundle::default());

    // Create root UI container
    commands
        .spawn(NodeBundle {
            style: Style {
                width: Val::Percent(100.0),
                height: Val::Percent(100.0),
                flex_direction: FlexDirection::Column,
                align_items: AlignItems::Center,
                justify_content: JustifyContent::FlexStart,
                padding: UiRect::all(Val::Px(20.0)),
                ..default()
            },
            background_color: app_settings.background_color.into(),
            ..default()
        })
        .insert(RootUI)
        .with_children(|parent| {
            // Title
            parent
                .spawn(TextBundle {
                    text: Text::from_section(
                        "Bevy Todo List",
                        TextStyle {
                            font_size: app_settings.heading_font_size,
                            color: app_settings.text_color,
                            ..default()
                        },
                    ),
                    style: Style {
                        margin: UiRect::bottom(Val::Px(30.0)),
                        ..default()
                    },
                    ..default()
                })
                .insert(AppTitle);

            // Input container
            parent
                .spawn(NodeBundle {
                    style: Style {
                        width: Val::Px(600.0),
                        height: Val::Px(50.0),
                        flex_direction: FlexDirection::Row,
                        margin: UiRect::bottom(Val::Px(20.0)),
                        ..default()
                    },
                    ..default()
                })
                .with_children(|parent| {
                    // Input field (visual representation)
                    parent
                        .spawn(NodeBundle {
                            style: Style {
                                width: Val::Percent(75.0),
                                height: Val::Percent(100.0),
                                padding: UiRect::all(Val::Px(10.0)),
                                margin: UiRect::right(Val::Px(10.0)),
                                ..default()
                            },
                            background_color: Color::WHITE.into(),
                            border_color: Color::rgb(0.7, 0.7, 0.7).into(),
                            ..default()
                        })
                        .insert(TodoInputField)
                        .insert(InputText::new())
                        .with_children(|parent| {
                            parent.spawn(TextBundle {
                                text: Text::from_section(
                                    "Type here...",
                                    TextStyle {
                                        font_size: app_settings.normal_font_size,
                                        color: app_settings.secondary_text_color,
                                        ..default()
                                    },
                                ),
                                ..default()
                            });
                        });

                    // Add button
                    parent
                        .spawn(ButtonBundle {
                            style: Style {
                                width: Val::Percent(25.0),
                                height: Val::Percent(100.0),
                                justify_content: JustifyContent::Center,
                                align_items: AlignItems::Center,
                                ..default()
                            },
                            background_color: ButtonColors::new().normal.into(),
                            ..default()
                        })
                        .insert(AddTodoButton)
                        .insert(InteractiveButton)
                        .insert(ButtonColors::new())
                        .with_children(|parent| {
                            parent.spawn(TextBundle {
                                text: Text::from_section(
                                    "Add",
                                    TextStyle {
                                        font_size: app_settings.normal_font_size,
                                        color: Color::WHITE,
                                        ..default()
                                    },
                                ),
                                ..default()
                            });
                        });
                });

            // Filter buttons
            parent
                .spawn(NodeBundle {
                    style: Style {
                        width: Val::Px(600.0),
                        flex_direction: FlexDirection::Row,
                        justify_content: JustifyContent::SpaceEvenly,
                        margin: UiRect::bottom(Val::Px(20.0)),
                        ..default()
                    },
                    ..default()
                })
                .with_children(|parent| {
                    for filter in [FilterType::All, FilterType::Active, FilterType::Completed] {
                        parent
                            .spawn(ButtonBundle {
                                style: Style {
                                    width: Val::Px(180.0),
                                    height: Val::Px(40.0),
                                    justify_content: JustifyContent::Center,
                                    align_items: AlignItems::Center,
                                    ..default()
                                },
                                background_color: ButtonColors::new().normal.into(),
                                ..default()
                            })
                            .insert(FilterButton { filter_type: filter })
                            .insert(InteractiveButton)
                            .insert(ButtonColors::new())
                            .with_children(|parent| {
                                parent.spawn(TextBundle {
                                    text: Text::from_section(
                                        filter.display_name(),
                                        TextStyle {
                                            font_size: app_settings.normal_font_size,
                                            color: Color::WHITE,
                                            ..default()
                                        },
                                    ),
                                    ..default()
                                });
                            });
                    }
                });

            // Todo list container
            parent
                .spawn(NodeBundle {
                    style: Style {
                        width: Val::Px(600.0),
                        flex_direction: FlexDirection::Column,
                        margin: UiRect::bottom(Val::Px(20.0)),
                        max_height: Val::Px(400.0),
                        overflow: Overflow::clip_y(),
                        ..default()
                    },
                    ..default()
                })
                .insert(TodoListContainer);

            // Bottom actions
            parent
                .spawn(NodeBundle {
                    style: Style {
                        width: Val::Px(600.0),
                        flex_direction: FlexDirection::Row,
                        justify_content: JustifyContent::SpaceBetween,
                        align_items: AlignItems::Center,
                        ..default()
                    },
                    ..default()
                })
                .with_children(|parent| {
                    // Items remaining
                    parent
                        .spawn(TextBundle {
                            text: Text::from_section(
                                "0 items left",
                                TextStyle {
                                    font_size: app_settings.small_font_size,
                                    color: app_settings.secondary_text_color,
                                    ..default()
                                },
                            ),
                            ..default()
                        })
                        .insert(ItemsRemainingText);

                    // Clear completed button
                    parent
                        .spawn(ButtonBundle {
                            style: Style {
                                width: Val::Px(150.0),
                                height: Val::Px(30.0),
                                justify_content: JustifyContent::Center,
                                align_items: AlignItems::Center,
                                ..default()
                            },
                            background_color: ButtonColors::new().normal.into(),
                            ..default()
                        })
                        .insert(ClearCompletedButton)
                        .insert(InteractiveButton)
                        .insert(ButtonColors::new())
                        .with_children(|parent| {
                            parent.spawn(TextBundle {
                                text: Text::from_section(
                                    "Clear Completed",
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
        });

    info!("UI setup complete");
}
