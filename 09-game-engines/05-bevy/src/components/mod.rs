/// Components module - contains all ECS components for the Todo List application
///
/// This module defines the data structures that are attached to entities in the Bevy ECS world.
/// Components represent pure data without behavior - the behavior is defined in systems.

pub mod todo_item;
pub mod ui_components;

// Re-export commonly used components
pub use todo_item::{
    TodoItem, TodoItemUI, TodoCheckbox, TodoDeleteButton,
    TodoEditButton, TodoTitleText,
};

pub use ui_components::{
    RootUI, TodoListContainer, TodoInputField, AddTodoButton,
    FilterButton, FilterType, ClearCompletedButton, ItemsRemainingText,
    AppTitle, SaveButton, LoadButton, InputText, InteractiveButton,
    ButtonColors,
};
