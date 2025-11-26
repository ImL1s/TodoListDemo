/// Systems module - contains all ECS systems for the Todo List application
///
/// Systems are functions that operate on entities with specific components.
/// They represent the logic and behavior of the application.

pub mod setup;
pub mod todo_systems;
pub mod ui_systems;
pub mod input_systems;

// Re-export commonly used systems
pub use setup::*;
pub use todo_systems::*;
pub use ui_systems::*;
pub use input_systems::*;
