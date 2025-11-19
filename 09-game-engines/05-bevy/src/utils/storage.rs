use std::fs;
use std::path::PathBuf;
use bevy::prelude::*;
use crate::resources::TodoList;

/// Default file name for storing todos
const STORAGE_FILE: &str = "todos.json";

/// Gets the path to the storage file
pub fn get_storage_path() -> PathBuf {
    // Try to use the user's home directory, fall back to current directory
    if let Some(home_dir) = dirs::home_dir() {
        home_dir.join(".bevy_todos").join(STORAGE_FILE)
    } else {
        PathBuf::from(STORAGE_FILE)
    }
}

/// Saves the TodoList to a JSON file
pub fn save_todos(todo_list: &TodoList) -> Result<(), String> {
    let path = get_storage_path();

    // Create parent directory if it doesn't exist
    if let Some(parent) = path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        }
    }

    // Serialize the todo list to JSON
    let json = serde_json::to_string_pretty(todo_list)
        .map_err(|e| format!("Failed to serialize todos: {}", e))?;

    // Write to file
    fs::write(&path, json)
        .map_err(|e| format!("Failed to write to file: {}", e))?;

    info!("Saved {} todos to {:?}", todo_list.total_count(), path);
    Ok(())
}

/// Loads the TodoList from a JSON file
pub fn load_todos() -> Result<TodoList, String> {
    let path = get_storage_path();

    // Check if file exists
    if !path.exists() {
        info!("No saved todos found at {:?}, starting fresh", path);
        return Ok(TodoList::default());
    }

    // Read the file
    let json = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    // Deserialize the JSON
    let mut todo_list: TodoList = serde_json::from_str(&json)
        .map_err(|e| format!("Failed to deserialize todos: {}", e))?;

    // Update the filter to default (it's not saved)
    todo_list.filter = crate::components::FilterType::All;

    info!("Loaded {} todos from {:?}", todo_list.total_count(), path);
    Ok(todo_list)
}

/// Deletes the storage file
pub fn delete_storage() -> Result<(), String> {
    let path = get_storage_path();

    if path.exists() {
        fs::remove_file(&path)
            .map_err(|e| format!("Failed to delete file: {}", e))?;
        info!("Deleted storage file at {:?}", path);
    }

    Ok(())
}

/// Checks if a storage file exists
pub fn storage_exists() -> bool {
    get_storage_path().exists()
}

/// Gets the size of the storage file in bytes
pub fn get_storage_size() -> Option<u64> {
    let path = get_storage_path();
    if let Ok(metadata) = fs::metadata(path) {
        Some(metadata.len())
    } else {
        None
    }
}

// Note: The 'dirs' crate is not included in dependencies by default
// For now, we'll provide a fallback implementation
mod dirs {
    use std::path::PathBuf;
    use std::env;

    pub fn home_dir() -> Option<PathBuf> {
        env::var_os("HOME")
            .or_else(|| env::var_os("USERPROFILE"))
            .map(PathBuf::from)
    }
}
