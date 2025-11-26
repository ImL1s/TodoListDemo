/// Events module - contains all custom events for the Todo List application
///
/// Events in Bevy are used for communication between systems without tight coupling.
/// Systems can send events and other systems can listen for them, enabling
/// a decoupled, event-driven architecture.

pub mod todo_events;

// Re-export all events
pub use todo_events::{
    AddTodoEvent, DeleteTodoEvent, ToggleTodoEvent, EditTodoEvent,
    FilterChangedEvent, ClearCompletedEvent, SaveTodosEvent, LoadTodosEvent,
    RebuildUIEvent, TodoOperationSuccessEvent, TodoOperationErrorEvent,
};
