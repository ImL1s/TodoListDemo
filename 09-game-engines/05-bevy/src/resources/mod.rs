/// Resources module - contains all global resources for the Todo List application
///
/// Resources in Bevy are global singletons that can be accessed from any system.
/// They represent shared state that doesn't belong to any specific entity.

pub mod todo_list;
pub mod ui_state;

// Re-export commonly used resources
pub use todo_list::TodoList;
pub use ui_state::{UIState, AppSettings, AnimationState};
