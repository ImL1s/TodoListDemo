use bevy::prelude::*;
use crate::components::FilterType;

/// Event fired when a new todo should be added
#[derive(Event, Clone, Debug)]
pub struct AddTodoEvent {
    /// The title of the new todo
    pub title: String,
}

impl AddTodoEvent {
    /// Creates a new AddTodoEvent
    pub fn new(title: String) -> Self {
        Self { title }
    }
}

/// Event fired when a todo should be deleted
#[derive(Event, Clone, Copy, Debug)]
pub struct DeleteTodoEvent {
    /// The ID of the todo to delete
    pub id: u64,
}

impl DeleteTodoEvent {
    /// Creates a new DeleteTodoEvent
    pub fn new(id: u64) -> Self {
        Self { id }
    }
}

/// Event fired when a todo's completion status should be toggled
#[derive(Event, Clone, Copy, Debug)]
pub struct ToggleTodoEvent {
    /// The ID of the todo to toggle
    pub id: u64,
}

impl ToggleTodoEvent {
    /// Creates a new ToggleTodoEvent
    pub fn new(id: u64) -> Self {
        Self { id }
    }
}

/// Event fired when a todo should be edited
#[derive(Event, Clone, Debug)]
pub struct EditTodoEvent {
    /// The ID of the todo to edit
    pub id: u64,
    /// The new title for the todo
    pub new_title: String,
}

impl EditTodoEvent {
    /// Creates a new EditTodoEvent
    pub fn new(id: u64, new_title: String) -> Self {
        Self { id, new_title }
    }
}

/// Event fired when the filter should change
#[derive(Event, Clone, Copy, Debug)]
pub struct FilterChangedEvent {
    /// The new filter to apply
    pub filter: FilterType,
}

impl FilterChangedEvent {
    /// Creates a new FilterChangedEvent
    pub fn new(filter: FilterType) -> Self {
        Self { filter }
    }
}

/// Event fired when all completed todos should be cleared
#[derive(Event, Clone, Copy, Debug, Default)]
pub struct ClearCompletedEvent;

/// Event fired when todos should be saved to disk
#[derive(Event, Clone, Copy, Debug, Default)]
pub struct SaveTodosEvent;

/// Event fired when todos should be loaded from disk
#[derive(Event, Clone, Copy, Debug, Default)]
pub struct LoadTodosEvent;

/// Event fired when the UI needs to be rebuilt
#[derive(Event, Clone, Copy, Debug, Default)]
pub struct RebuildUIEvent;

/// Event fired when a todo operation was successful
#[derive(Event, Clone, Debug)]
pub struct TodoOperationSuccessEvent {
    /// Description of the successful operation
    pub message: String,
}

impl TodoOperationSuccessEvent {
    /// Creates a new TodoOperationSuccessEvent
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}

/// Event fired when a todo operation failed
#[derive(Event, Clone, Debug)]
pub struct TodoOperationErrorEvent {
    /// Description of the error
    pub message: String,
}

impl TodoOperationErrorEvent {
    /// Creates a new TodoOperationErrorEvent
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}
