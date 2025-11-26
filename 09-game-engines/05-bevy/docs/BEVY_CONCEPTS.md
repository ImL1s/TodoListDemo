# Bevy Core Concepts

A comprehensive guide to understanding Bevy-specific concepts and how they're used in the Todo List application.

## Table of Contents

1. [Introduction to Bevy](#introduction-to-bevy)
2. [The Bevy App](#the-bevy-app)
3. [Plugins](#plugins)
4. [Schedules and Stages](#schedules-and-stages)
5. [System Sets](#system-sets)
6. [States](#states)
7. [Assets](#assets)
8. [Bevy UI](#bevy-ui)
9. [Commands](#commands)
10. [Change Detection](#change-detection)
11. [Time and Timing](#time-and-timing)
12. [Diagnostics](#diagnostics)
13. [Cross-Platform Support](#cross-platform-support)

## Introduction to Bevy

**Bevy** is a refreshingly simple data-driven game engine built in Rust. It's:
- **Fast**: Built on Rust's performance and safety
- **Modular**: Plugin-based architecture
- **Ergonomic**: Designed to be enjoyable to use
- **Data-Driven**: ECS at its core
- **Open Source**: MIT/Apache dual-licensed

### Bevy Philosophy

```
┌───────────────────────────────────────────┐
│         Bevy's Core Principles            │
├───────────────────────────────────────────┤
│                                           │
│  1. Data-Driven: ECS everywhere           │
│  2. Modular: Everything is a plugin       │
│  3. Fast: Leverages Rust's performance    │
│  4. Productive: Quick iterations          │
│  5. Accessible: Easy to learn and use     │
│                                           │
└───────────────────────────────────────────┘
```

## The Bevy App

### App Structure

The `App` is the root of every Bevy application:

```rust
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)  // Core functionality
        .add_plugins(MyPlugin)         // Custom plugins
        .add_systems(Startup, setup)   // Startup systems
        .add_systems(Update, update)   // Update systems
        .run();                        // Start the app
}
```

### App Lifecycle

```
Create App → Add Plugins → Register Resources/Events/Systems →
Run Loop → Shutdown

┌─────────┐    ┌──────────┐    ┌────────┐    ┌──────────┐
│ Create  │───→│ Configure│───→│  Run   │───→│ Shutdown │
│  App    │    │ (Plugins)│    │  Loop  │    │          │
└─────────┘    └──────────┘    └────────┘    └──────────┘
```

### Todo List App Structure

```rust
fn main() {
    App::new()
        // Default Bevy plugins (window, rendering, input, etc.)
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "Bevy Todo List".to_string(),
                resolution: (800.0, 900.0).into(),
                ..default()
            }),
            ..default()
        }))

        // Diagnostic plugins
        .add_plugins(FrameTimeDiagnosticsPlugin)
        .add_plugins(LogDiagnosticsPlugin::default())

        // Our custom plugins
        .add_plugins(TodoPlugin)
        .add_plugins(UIPlugin)
        .add_plugins(DebugPlugin)

        .run();
}
```

## Plugins

### What are Plugins?

Plugins are Bevy's way of organizing and encapsulating functionality. They implement the `Plugin` trait:

```rust
pub struct MyPlugin;

impl Plugin for MyPlugin {
    fn build(&self, app: &mut App) {
        app
            .init_resource::<MyResource>()
            .add_event::<MyEvent>()
            .add_systems(Startup, setup)
            .add_systems(Update, update_system);
    }
}
```

### Plugin Benefits

1. **Modularity**: Encapsulate related functionality
2. **Reusability**: Share plugins across projects
3. **Organization**: Keep code structured
4. **Composition**: Combine plugins to build features

### DefaultPlugins

Bevy provides `DefaultPlugins` which includes:

```rust
DefaultPlugins includes:
  - WindowPlugin        // Window management
  - RenderPlugin        // Rendering system
  - ImagePlugin         // Image loading
  - InputPlugin         // Keyboard/mouse input
  - AssetPlugin         // Asset management
  - ScenePlugin         // Scene management
  - DiagnosticsPlugin   // Performance diagnostics
  - And more...
```

### Todo List Plugins

#### TodoPlugin

```rust
pub struct TodoPlugin;

impl Plugin for TodoPlugin {
    fn build(&self, app: &mut App) {
        app
            // Resources
            .init_resource::<TodoList>()
            .init_resource::<UIState>()
            .init_resource::<AppSettings>()

            // Events
            .add_event::<AddTodoEvent>()
            .add_event::<DeleteTodoEvent>()
            .add_event::<ToggleTodoEvent>()
            // ... more events

            // Startup systems
            .add_systems(Startup, (
                setup_ui,
                startup_load_todos,
            ).chain())

            // Update systems
            .add_systems(Update, (
                handle_keyboard_input,
                handle_add_todo,
                rebuild_todo_list_ui,
                // ... more systems
            ));
    }
}
```

#### Custom Plugin Groups

You can group multiple plugins:

```rust
pub struct TodoPluginGroup;

impl PluginGroup for TodoPluginGroup {
    fn build(self) -> PluginGroupBuilder {
        PluginGroupBuilder::start::<Self>()
            .add(TodoPlugin)
            .add(UIPlugin)
            .add(DebugPlugin)
    }
}

// Usage
app.add_plugins(TodoPluginGroup);
```

## Schedules and Stages

### Schedules

Bevy organizes system execution using schedules:

```rust
// Main schedules
Startup      // Run once at app start
Update       // Run every frame
FixedUpdate  // Run at fixed intervals
```

### System Execution Order

```
Frame N:
  ┌─────────────────────────────────────┐
  │  First (built-in)                   │
  ├─────────────────────────────────────┤
  │  PreUpdate (input handling, etc.)   │
  ├─────────────────────────────────────┤
  │  Update (main game logic)           │
  ├─────────────────────────────────────┤
  │  PostUpdate (cleanup, etc.)         │
  ├─────────────────────────────────────┤
  │  Last (rendering)                   │
  └─────────────────────────────────────┘

Frame N+1: repeat...
```

### Fixed Timestep

For physics or game logic that needs consistent timing:

```rust
app.add_systems(FixedUpdate, physics_system);

// Runs at a fixed rate (default 64 Hz)
// Catches up if frame rate drops
```

## System Sets

### What are System Sets?

System sets allow you to group and order systems:

```rust
#[derive(SystemSet, Debug, Clone, PartialEq, Eq, Hash)]
enum GameSystems {
    Input,
    Logic,
    Render,
}

app.add_systems(Update, (
    handle_input.in_set(GameSystems::Input),

    update_game
        .in_set(GameSystems::Logic)
        .after(GameSystems::Input),

    render
        .in_set(GameSystems::Render)
        .after(GameSystems::Logic),
));
```

### System Ordering

```rust
// Chain systems (sequential execution)
app.add_systems(Update, (
    system_a,
    system_b,
    system_c,
).chain());

// Before/After constraints
app.add_systems(Update, (
    system_a.before(system_b),
    system_c.after(system_b),
));

// Run conditions
app.add_systems(Update,
    system_a.run_if(condition)
);
```

## States

### State Management

States allow you to control which systems run based on application state:

```rust
#[derive(States, Default, Debug, Clone, PartialEq, Eq, Hash)]
enum GameState {
    #[default]
    Menu,
    Playing,
    Paused,
}

app.init_state::<GameState>()
    .add_systems(OnEnter(GameState::Menu), setup_menu)
    .add_systems(OnExit(GameState::Menu), cleanup_menu)
    .add_systems(Update, menu_system.run_if(in_state(GameState::Menu)))
    .add_systems(Update, game_system.run_if(in_state(GameState::Playing)));
```

### State Transitions

```rust
fn transition_system(
    mut next_state: ResMut<NextState<GameState>>,
    keys: Res<ButtonInput<KeyCode>>,
) {
    if keys.just_pressed(KeyCode::Escape) {
        next_state.set(GameState::Paused);
    }
}
```

### State Lifecycle

```
State A → OnExit(A) → OnEnter(B) → State B

┌────────┐   ┌──────────┐   ┌──────────┐   ┌────────┐
│ Menu   │──→│ OnExit   │──→│ OnEnter  │──→│Playing │
│ State  │   │ (Menu)   │   │ (Playing)│   │ State  │
└────────┘   └──────────┘   └──────────┘   └────────┘
```

## Assets

### Asset System

Bevy's asset system handles loading and managing resources:

```rust
#[derive(Asset, TypePath)]
struct CustomAsset {
    data: Vec<u8>,
}

// In a system
fn load_assets(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
) {
    let texture: Handle<Image> = asset_server.load("texture.png");
    let font: Handle<Font> = asset_server.load("fonts/FiraSans.ttf");

    commands.spawn(SpriteBundle {
        texture,
        ..default()
    });
}
```

### Asset Loading

```rust
// Load an asset
let handle = asset_server.load("path/to/asset.png");

// Check if loaded
if asset_server.is_loaded(&handle) {
    // Asset is ready
}

// Get asset
if let Some(image) = images.get(&handle) {
    // Use the asset
}
```

### Hot Reloading

Bevy supports hot reloading of assets during development:
- Modify an asset file
- Bevy automatically detects and reloads it
- Changes appear immediately in the app

## Bevy UI

### UI System

Bevy has a built-in retained-mode UI system based on Flexbox:

```rust
commands.spawn(NodeBundle {
    style: Style {
        width: Val::Percent(100.0),
        height: Val::Percent(100.0),
        flex_direction: FlexDirection::Column,
        align_items: AlignItems::Center,
        justify_content: JustifyContent::Center,
        ..default()
    },
    background_color: Color::rgb(0.1, 0.1, 0.1).into(),
    ..default()
})
.with_children(|parent| {
    parent.spawn(TextBundle::from_section(
        "Hello, Bevy!",
        TextStyle {
            font_size: 40.0,
            color: Color::WHITE,
            ..default()
        },
    ));
});
```

### UI Bundles

Common UI bundles:

```rust
// Container
NodeBundle { /* styling */ }

// Text
TextBundle::from_section("Text", TextStyle { /* style */ })

// Button
ButtonBundle { /* styling */ }

// Image
ImageBundle {
    image: UiImage::new(handle),
    /* styling */
}
```

### Flexbox Layout

Bevy UI uses Flexbox for layout:

```rust
Style {
    // Size
    width: Val::Px(100.0),
    height: Val::Percent(50.0),

    // Flex container
    flex_direction: FlexDirection::Column,
    justify_content: JustifyContent::Center,
    align_items: AlignItems::Center,

    // Flex item
    flex_grow: 1.0,
    flex_shrink: 0.0,

    // Spacing
    padding: UiRect::all(Val::Px(10.0)),
    margin: UiRect::all(Val::Px(5.0)),

    // Positioning
    position_type: PositionType::Absolute,
    left: Val::Px(10.0),
    top: Val::Px(10.0),

    ..default()
}
```

### UI Interaction

```rust
fn button_system(
    query: Query<(&Interaction, &Children), Changed<Interaction>>,
    mut text_query: Query<&mut Text>,
) {
    for (interaction, children) in query.iter() {
        let mut text = text_query.get_mut(children[0]).unwrap();

        match *interaction {
            Interaction::Pressed => {
                text.sections[0].value = "Pressed!".to_string();
            }
            Interaction::Hovered => {
                text.sections[0].value = "Hovered".to_string();
            }
            Interaction::None => {
                text.sections[0].value = "Button".to_string();
            }
        }
    }
}
```

### Todo List UI Examples

```rust
// Input field container
NodeBundle {
    style: Style {
        width: Val::Px(600.0),
        height: Val::Px(50.0),
        flex_direction: FlexDirection::Row,
        ..default()
    },
    ..default()
}

// Button with hover effect
ButtonBundle {
    style: Style {
        width: Val::Px(100.0),
        height: Val::Px(40.0),
        justify_content: JustifyContent::Center,
        align_items: AlignItems::Center,
        ..default()
    },
    background_color: Color::rgb(0.15, 0.15, 0.15).into(),
    ..default()
}
```

## Commands

### What are Commands?

Commands allow deferred world modifications:

```rust
fn spawn_system(mut commands: Commands) {
    // Spawn entities
    commands.spawn(SpriteBundle::default());

    // Insert components
    let entity = commands.spawn_empty().id();
    commands.entity(entity).insert(MyComponent);

    // Remove components
    commands.entity(entity).remove::<MyComponent>();

    // Despawn entities
    commands.entity(entity).despawn();

    // Despawn recursively (including children)
    commands.entity(entity).despawn_recursive();
}
```

### Why Commands?

```
Commands are deferred because:
1. They don't execute immediately
2. They're applied at the end of the stage
3. This allows safe parallel system execution
4. No conflicts during system execution

System A → Commands → |
System B → Commands → | → Apply Commands → Next Stage
System C → Commands → |
```

### Commands in Todo List

```rust
// Spawning UI elements
commands.spawn(ButtonBundle::default())
    .insert(AddTodoButton)
    .with_children(|parent| {
        parent.spawn(TextBundle::from_section("Add", ...));
    });

// Despawning old UI
for entity in todo_ui_query.iter() {
    commands.entity(entity).despawn_recursive();
}

// Rebuilding UI
commands.entity(container).with_children(|parent| {
    for todo in todos {
        spawn_todo_item(parent, todo, &app_settings);
    }
});
```

## Change Detection

### Changed<T>

Bevy tracks component changes:

```rust
// Only process entities where Transform changed
fn system(query: Query<&Transform, Changed<Transform>>) {
    for transform in query.iter() {
        // Only runs for changed transforms
    }
}
```

### Resource Change Detection

```rust
fn system(todo_list: Res<TodoList>) {
    if todo_list.is_changed() {
        // TodoList was modified
        println!("Todo list updated!");
    }
}
```

### Added<T> and Removed<T>

```rust
// Newly added components
fn detect_new(query: Query<&Component, Added<Component>>) {
    for component in query.iter() {
        println!("New component added!");
    }
}

// Track removals with RemovedComponents
fn detect_removed(mut removed: RemovedComponents<Component>) {
    for entity in removed.read() {
        println!("Component removed from entity {:?}", entity);
    }
}
```

### Change Detection in Todo List

```rust
// Only update UI when todo list changes
pub fn update_items_remaining(
    todo_list: Res<TodoList>,
    mut text_query: Query<&mut Text, With<ItemsRemainingText>>,
) {
    if !todo_list.is_changed() {
        return;  // Skip if nothing changed
    }

    for mut text in text_query.iter_mut() {
        let count = todo_list.active_count();
        text.sections[0].value = format!("{} items left", count);
    }
}
```

## Time and Timing

### Time Resource

```rust
fn system(time: Res<Time>) {
    // Delta time (time since last frame)
    let dt = time.delta_seconds();

    // Total elapsed time
    let elapsed = time.elapsed_seconds();

    // Frame count
    let frame = time.elapsed_frames();
}
```

### Timers

```rust
#[derive(Resource)]
struct GameTimer {
    timer: Timer,
}

fn timer_system(time: Res<Time>, mut game_timer: ResMut<GameTimer>) {
    if game_timer.timer.tick(time.delta()).just_finished() {
        println!("Timer finished!");
    }
}
```

### Timing in Todo List

```rust
// Auto-save every 30 seconds
pub fn auto_save_todos(
    time: Res<Time>,
    todo_list: Res<TodoList>,
    mut last_save: Local<f32>,
) {
    const SAVE_INTERVAL: f32 = 30.0;

    *last_save += time.delta_seconds();

    if *last_save >= SAVE_INTERVAL {
        *last_save = 0.0;
        // Save todos
        utils::save_todos(&todo_list).ok();
    }
}
```

## Diagnostics

### Built-in Diagnostics

```rust
use bevy::diagnostic::{
    FrameTimeDiagnosticsPlugin,
    LogDiagnosticsPlugin,
};

App::new()
    .add_plugins(FrameTimeDiagnosticsPlugin)
    .add_plugins(LogDiagnosticsPlugin::default())
    .run();
```

### Accessing Diagnostics

```rust
fn performance_system(
    diagnostics: Res<DiagnosticsStore>,
) {
    if let Some(fps) = diagnostics
        .get(&FrameTimeDiagnosticsPlugin::FPS)
        .and_then(|fps| fps.smoothed())
    {
        println!("FPS: {:.2}", fps);
    }
}
```

### Custom Diagnostics

```rust
use bevy::diagnostic::Diagnostic;

// Register custom diagnostic
app.register_diagnostic(Diagnostic::new(
    "custom_metric",
    "entities_spawned",
    20,  // Max history length
));

// Update diagnostic
fn update_diagnostic(mut diagnostics: Diagnostics) {
    diagnostics.add_measurement("custom_metric", || 42.0);
}
```

## Cross-Platform Support

### Platform Support

Bevy runs on:
- **Windows** (7, 8, 10, 11)
- **macOS** (10.13+)
- **Linux** (various distributions)
- **Web** (WebAssembly)
- **Android** (experimental)
- **iOS** (experimental)

### Platform-Specific Code

```rust
#[cfg(target_arch = "wasm32")]
fn web_specific() {
    // Web-only code
}

#[cfg(not(target_arch = "wasm32"))]
fn native_specific() {
    // Native-only code
}

#[cfg(target_os = "windows")]
fn windows_specific() {
    // Windows-only code
}
```

### WebAssembly Support

```rust
// WASM entry point
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(start)]
pub fn wasm_main() {
    main();
}
```

### Building for WASM

```bash
# Add target
rustup target add wasm32-unknown-unknown

# Build
cargo build --release --target wasm32-unknown-unknown

# Generate bindings
wasm-bindgen --out-dir ./wasm --target web \
    target/wasm32-unknown-unknown/release/app.wasm
```

---

## Conclusion

Bevy provides a powerful, flexible foundation for building applications:

- **App**: Central coordination point
- **Plugins**: Modular functionality
- **Schedules**: Organized system execution
- **Assets**: Resource management
- **UI**: Built-in UI system
- **Commands**: Safe world modification
- **Change Detection**: Efficient updates
- **Diagnostics**: Performance monitoring
- **Cross-Platform**: Write once, run anywhere

These concepts work together to create a coherent, productive development experience.

## Further Reading

- [Official Bevy Book](https://bevyengine.org/learn/book/)
- [Bevy Examples](https://github.com/bevyengine/bevy/tree/main/examples)
- [Bevy Cheat Book](https://bevy-cheatbook.github.io/)
- [Bevy API Docs](https://docs.rs/bevy/)
