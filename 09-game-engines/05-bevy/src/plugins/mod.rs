/// Plugins module - contains custom Bevy plugins for the Todo List application
///
/// Plugins in Bevy are a way to organize and modularize your application code.
/// They encapsulate related resources, systems, and events into reusable units.

pub mod todo_plugin;

// Re-export plugins
pub use todo_plugin::{TodoPlugin, UIPlugin, DebugPlugin};
