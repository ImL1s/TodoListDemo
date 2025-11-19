use bevy::prelude::*;
use crate::components::{TodoItem, FilterType};
use serde::{Deserialize, Serialize};

/// Global resource that manages the list of all todos
/// This is a Bevy Resource, meaning there's only one instance shared across the entire app
#[derive(Resource, Clone, Debug, Serialize, Deserialize)]
pub struct TodoList {
    /// Vector of all todo items
    pub items: Vec<TodoItem>,
    /// The next ID to assign to a new todo
    pub next_id: u64,
    /// Currently active filter
    #[serde(skip)]
    pub filter: FilterType,
}

impl Default for TodoList {
    fn default() -> Self {
        Self {
            items: Vec::new(),
            next_id: 1,
            filter: FilterType::All,
        }
    }
}

impl TodoList {
    /// Creates a new empty TodoList
    pub fn new() -> Self {
        Self::default()
    }

    /// Adds a new todo with the given title
    pub fn add_todo(&mut self, title: String) -> u64 {
        if title.trim().is_empty() {
            return 0; // Invalid ID indicating failure
        }

        let id = self.next_id;
        self.next_id += 1;

        let todo = TodoItem::new(id, title);
        self.items.push(todo);

        info!("Added todo #{} with title: {}", id, self.items.last().unwrap().title);
        id
    }

    /// Removes a todo by its ID
    pub fn remove_todo(&mut self, id: u64) -> bool {
        let initial_len = self.items.len();
        self.items.retain(|item| item.id != id);
        let removed = self.items.len() < initial_len;

        if removed {
            info!("Removed todo #{}", id);
        } else {
            warn!("Attempted to remove non-existent todo #{}", id);
        }

        removed
    }

    /// Toggles the completion status of a todo
    pub fn toggle_todo(&mut self, id: u64) -> bool {
        if let Some(item) = self.items.iter_mut().find(|item| item.id == id) {
            item.toggle();
            info!("Toggled todo #{} - now {}", id, if item.completed { "completed" } else { "active" });
            true
        } else {
            warn!("Attempted to toggle non-existent todo #{}", id);
            false
        }
    }

    /// Updates the title of a todo
    pub fn update_todo(&mut self, id: u64, new_title: String) -> bool {
        if new_title.trim().is_empty() {
            return false;
        }

        if let Some(item) = self.items.iter_mut().find(|item| item.id == id) {
            item.title = new_title.clone();
            info!("Updated todo #{} with new title: {}", id, new_title);
            true
        } else {
            warn!("Attempted to update non-existent todo #{}", id);
            false
        }
    }

    /// Removes all completed todos
    pub fn clear_completed(&mut self) -> usize {
        let initial_len = self.items.len();
        self.items.retain(|item| !item.completed);
        let removed = initial_len - self.items.len();

        if removed > 0 {
            info!("Cleared {} completed todo(s)", removed);
        }

        removed
    }

    /// Returns a filtered view of todos based on the current filter
    pub fn filtered_items(&self) -> Vec<&TodoItem> {
        match self.filter {
            FilterType::All => self.items.iter().collect(),
            FilterType::Active => self.items.iter()
                .filter(|item| !item.completed)
                .collect(),
            FilterType::Completed => self.items.iter()
                .filter(|item| item.completed)
                .collect(),
        }
    }

    /// Returns the number of active (not completed) todos
    pub fn active_count(&self) -> usize {
        self.items.iter().filter(|item| !item.completed).count()
    }

    /// Returns the number of completed todos
    pub fn completed_count(&self) -> usize {
        self.items.iter().filter(|item| item.completed).count()
    }

    /// Returns the total number of todos
    pub fn total_count(&self) -> usize {
        self.items.len()
    }

    /// Sets the current filter
    pub fn set_filter(&mut self, filter: FilterType) {
        if self.filter != filter {
            self.filter = filter;
            info!("Filter changed to: {:?}", filter);
        }
    }

    /// Gets a reference to a todo by ID
    pub fn get_todo(&self, id: u64) -> Option<&TodoItem> {
        self.items.iter().find(|item| item.id == id)
    }

    /// Gets a mutable reference to a todo by ID
    pub fn get_todo_mut(&mut self, id: u64) -> Option<&mut TodoItem> {
        self.items.iter_mut().find(|item| item.id == id)
    }

    /// Returns true if there are any todos
    pub fn has_todos(&self) -> bool {
        !self.items.is_empty()
    }

    /// Returns true if there are any completed todos
    pub fn has_completed(&self) -> bool {
        self.items.iter().any(|item| item.completed)
    }
}
