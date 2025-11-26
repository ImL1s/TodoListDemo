/// Utils module - contains utility functions for the Todo List application
///
/// This module provides helper functions that don't fit into the ECS architecture
/// directly, such as file I/O and data persistence.

pub mod storage;

// Re-export commonly used functions
pub use storage::{
    save_todos, load_todos, delete_storage, storage_exists,
    get_storage_size, get_storage_path,
};
