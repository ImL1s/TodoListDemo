//! # Bevy Todo List Application
//!
//! A feature-complete Todo List application built with the Bevy game engine.
//! This application demonstrates the power and flexibility of Bevy's ECS architecture
//! for building interactive applications.
//!
//! ## Features
//! - Add, delete, and toggle todos
//! - Filter todos by status (All, Active, Completed)
//! - Persistent storage (JSON file)
//! - Keyboard shortcuts
//! - Clean, responsive UI
//!
//! ## Architecture
//! The application is built using Bevy's Entity Component System (ECS):
//! - **Entities**: UI elements and todo items
//! - **Components**: Data attached to entities (TodoItem, TodoItemUI, etc.)
//! - **Systems**: Functions that operate on entities with specific components
//! - **Resources**: Global state (TodoList, UIState, AppSettings)
//! - **Events**: Communication between systems
//!
//! ## Usage
//! - Type in the input field and press Enter or click "Add" to create a todo
//! - Click the checkbox to toggle completion status
//! - Click "Delete" to remove a todo
//! - Use filter buttons to view All/Active/Completed todos
//! - Press Ctrl+S to manually save todos
//! - Press Ctrl+O to manually load todos
//! - Press F1 to toggle debug mode
//! - Press F2 to print todo statistics
//! - Press F3 to print all todos

use bevy::prelude::*;
use bevy::window::WindowResolution;
use bevy::diagnostic::{FrameTimeDiagnosticsPlugin, LogDiagnosticsPlugin};

// Module declarations
mod components;
mod systems;
mod resources;
mod events;
mod plugins;
mod utils;

// Import plugins
use plugins::{TodoPlugin, UIPlugin, DebugPlugin};

fn main() {
    // Configure logging
    std::env::set_var("RUST_LOG", "info,wgpu=error,naga=warn");

    println!("===========================================");
    println!("  Bevy Todo List Application");
    println!("  Built with Bevy {} ", env!("CARGO_PKG_VERSION"));
    println!("===========================================");
    println!();
    println!("Controls:");
    println!("  - Type and press Enter to add a todo");
    println!("  - Click checkbox to toggle completion");
    println!("  - Click Delete to remove a todo");
    println!("  - Ctrl+S: Save todos");
    println!("  - Ctrl+O: Load todos");
    println!("  - F1: Toggle debug mode");
    println!("  - F2: Show statistics");
    println!("  - F3: List all todos");
    println!("  - ESC: Clear input");
    println!("===========================================");
    println!();

    App::new()
        // Add default Bevy plugins with custom window configuration
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "Bevy Todo List - ECS Demo".to_string(),
                resolution: WindowResolution::new(800.0, 900.0),
                resizable: true,
                ..default()
            }),
            ..default()
        }).set(ImagePlugin::default_nearest()))

        // Add diagnostic plugins for performance monitoring
        .add_plugins(FrameTimeDiagnosticsPlugin)
        .add_plugins(LogDiagnosticsPlugin::default())

        // Add our custom plugins
        .add_plugins(TodoPlugin)
        .add_plugins(UIPlugin)
        .add_plugins(DebugPlugin)

        // Run the app
        .run();
}

// This makes the app compatible with WASM
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(start)]
pub fn wasm_main() {
    main();
}
