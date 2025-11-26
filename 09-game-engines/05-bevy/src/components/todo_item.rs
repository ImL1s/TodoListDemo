use bevy::prelude::*;
use serde::{Deserialize, Serialize};

/// Represents a single Todo item in the ECS world
/// This component is attached to entities that represent todos
#[derive(Component, Clone, Debug, Serialize, Deserialize)]
pub struct TodoItem {
    /// Unique identifier for this todo
    pub id: u64,
    /// The title/description of the todo
    pub title: String,
    /// Whether this todo has been completed
    pub completed: bool,
    /// Timestamp when this todo was created (Unix timestamp)
    pub created_at: i64,
}

impl TodoItem {
    /// Creates a new TodoItem with the given id and title
    pub fn new(id: u64, title: String) -> Self {
        Self {
            id,
            title,
            completed: false,
            created_at: chrono::Utc::now().timestamp(),
        }
    }

    /// Toggles the completion status of this todo
    pub fn toggle(&mut self) {
        self.completed = !self.completed;
    }
}

/// Marker component for the UI entity that represents a todo item
/// Links the UI element to its corresponding todo data
#[derive(Component, Clone, Copy, Debug)]
pub struct TodoItemUI {
    /// The ID of the todo this UI element represents
    pub todo_id: u64,
}

/// Marker component for checkbox entities
#[derive(Component, Clone, Copy, Debug)]
pub struct TodoCheckbox {
    /// The ID of the todo this checkbox controls
    pub todo_id: u64,
}

/// Marker component for delete button entities
#[derive(Component, Clone, Copy, Debug)]
pub struct TodoDeleteButton {
    /// The ID of the todo this button will delete
    pub todo_id: u64,
}

/// Marker component for edit button entities
#[derive(Component, Clone, Copy, Debug)]
pub struct TodoEditButton {
    /// The ID of the todo this button will edit
    pub todo_id: u64,
}

/// Marker component for the todo title text entity
#[derive(Component, Clone, Copy, Debug)]
pub struct TodoTitleText {
    /// The ID of the todo this text represents
    pub todo_id: u64,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_todo_item() {
        let todo = TodoItem::new(1, "Test Todo".to_string());

        assert_eq!(todo.id, 1);
        assert_eq!(todo.title, "Test Todo");
        assert!(!todo.completed);
        assert!(todo.created_at > 0);
    }

    #[test]
    fn test_toggle_todo_item() {
        let mut todo = TodoItem::new(1, "Test".to_string());

        assert!(!todo.completed);
        todo.toggle();
        assert!(todo.completed);
        todo.toggle();
        assert!(!todo.completed);
    }

    #[test]
    fn test_todo_serialization() {
        let todo = TodoItem::new(1, "Test".to_string());

        // Test that it can be serialized
        let json = serde_json::to_string(&todo).unwrap();
        assert!(json.contains("Test"));

        // Test that it can be deserialized
        let deserialized: TodoItem = serde_json::from_str(&json).unwrap();
        assert_eq!(deserialized.id, todo.id);
        assert_eq!(deserialized.title, todo.title);
        assert_eq!(deserialized.completed, todo.completed);
    }
}
