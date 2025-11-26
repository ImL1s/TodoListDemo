// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tauri::Manager;
use uuid::Uuid;

/// Maximum allowed length for todo text (to prevent memory/storage issues)
const MAX_TODO_TEXT_LENGTH: usize = 500;

/// Debounce duration for file saves (in milliseconds)
const SAVE_DEBOUNCE_MS: u64 = 1000;

/// Todo item struct
/// This matches the TypeScript interface for seamless communication
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Todo {
    id: String,
    text: String,
    completed: bool,
    #[serde(rename = "createdAt")]
    created_at: i64,
}

/// Application state with debounced file saving
/// Wrapped in Mutex for thread-safe access
struct AppState {
    todos: Mutex<Vec<Todo>>,
    last_save: Mutex<Option<Instant>>,
    pending_save: Mutex<bool>,
}

/// Custom error type for better error messages
#[derive(Debug)]
enum TodoError {
    InvalidInput(String),
    NotFound(String),
    FileSystem(String),
    LockError(String),
    Serialization(String),
}

impl std::fmt::Display for TodoError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            TodoError::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
            TodoError::NotFound(msg) => write!(f, "Not found: {}", msg),
            TodoError::FileSystem(msg) => write!(f, "File system error: {}", msg),
            TodoError::LockError(msg) => write!(f, "Lock error: {}", msg),
            TodoError::Serialization(msg) => write!(f, "Serialization error: {}", msg),
        }
    }
}

impl From<TodoError> for String {
    fn from(error: TodoError) -> Self {
        error.to_string()
    }
}

/// Validate todo text input
/// Returns an error if the text is invalid
fn validate_todo_text(text: &str) -> Result<(), TodoError> {
    let trimmed = text.trim();

    if trimmed.is_empty() {
        return Err(TodoError::InvalidInput(
            "Todo text cannot be empty".to_string()
        ));
    }

    if text.len() > MAX_TODO_TEXT_LENGTH {
        return Err(TodoError::InvalidInput(
            format!("Todo text cannot exceed {} characters", MAX_TODO_TEXT_LENGTH)
        ));
    }

    // Check for null bytes (security: prevent null byte injection)
    if text.contains('\0') {
        return Err(TodoError::InvalidInput(
            "Todo text contains invalid characters".to_string()
        ));
    }

    Ok(())
}

/// Sanitize todo text by trimming whitespace and normalizing line breaks
fn sanitize_todo_text(text: &str) -> String {
    text.trim()
        .lines()
        .map(|line| line.trim())
        .collect::<Vec<_>>()
        .join(" ")
}

/// Get the path to the todos data file
/// Uses Tauri's app data directory for persistent storage
fn get_data_file_path(app_handle: &tauri::AppHandle) -> Result<PathBuf, TodoError> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or_else(|| TodoError::FileSystem(
            "Failed to get app data directory".to_string()
        ))?;

    // Ensure the directory exists
    fs::create_dir_all(&app_dir)
        .map_err(|e| TodoError::FileSystem(
            format!("Failed to create app data directory: {}", e)
        ))?;

    Ok(app_dir.join("todos.json"))
}

/// Load todos from the data file
/// Returns an empty vector if the file doesn't exist or cannot be read
fn load_todos_from_file(app_handle: &tauri::AppHandle) -> Vec<Todo> {
    // Use ? operator with Result, return empty vec on any error
    let result = (|| -> Result<Vec<Todo>, TodoError> {
        let file_path = get_data_file_path(app_handle)?;

        if !file_path.exists() {
            return Ok(Vec::new());
        }

        let contents = fs::read_to_string(&file_path)
            .map_err(|e| TodoError::FileSystem(
                format!("Failed to read todos file: {}", e)
            ))?;

        let todos = serde_json::from_str(&contents)
            .map_err(|e| TodoError::Serialization(
                format!("Failed to parse todos file: {}", e)
            ))?;

        Ok(todos)
    })();

    match result {
        Ok(todos) => todos,
        Err(e) => {
            eprintln!("Error loading todos: {}", e);
            Vec::new()
        }
    }
}

/// Save todos to the data file immediately
/// This is the actual file write operation
fn save_todos_to_file_immediate(app_handle: &tauri::AppHandle, todos: &Vec<Todo>) -> Result<(), TodoError> {
    let file_path = get_data_file_path(app_handle)?;

    let json = serde_json::to_string_pretty(todos)
        .map_err(|e| TodoError::Serialization(
            format!("Failed to serialize todos: {}", e)
        ))?;

    fs::write(&file_path, json)
        .map_err(|e| TodoError::FileSystem(
            format!("Failed to write todos file: {}", e)
        ))?;

    Ok(())
}

/// Debounced save: only saves if enough time has passed since last save
/// This reduces disk I/O when many operations happen in quick succession
fn save_todos_debounced(
    app_handle: &tauri::AppHandle,
    state: &AppState,
) -> Result<(), TodoError> {
    let now = Instant::now();

    // Check if we should save now or mark as pending
    let should_save = {
        let last_save = state.last_save.lock()
            .map_err(|e| TodoError::LockError(format!("Failed to lock last_save: {}", e)))?;

        match *last_save {
            None => true,
            Some(instant) => now.duration_since(instant) >= Duration::from_millis(SAVE_DEBOUNCE_MS),
        }
    };

    if should_save {
        // Perform the save
        let todos = state.todos.lock()
            .map_err(|e| TodoError::LockError(format!("Failed to lock todos: {}", e)))?;

        save_todos_to_file_immediate(app_handle, &todos)?;

        // Update last save time
        let mut last_save = state.last_save.lock()
            .map_err(|e| TodoError::LockError(format!("Failed to lock last_save: {}", e)))?;
        *last_save = Some(now);

        // Clear pending flag
        let mut pending = state.pending_save.lock()
            .map_err(|e| TodoError::LockError(format!("Failed to lock pending_save: {}", e)))?;
        *pending = false;
    } else {
        // Mark save as pending
        let mut pending = state.pending_save.lock()
            .map_err(|e| TodoError::LockError(format!("Failed to lock pending_save: {}", e)))?;
        *pending = true;

        // Note: In a production app, you'd want to set up a timer to save pending changes
        // For simplicity, we'll save on the next operation or app shutdown
    }

    Ok(())
}

/// Tauri command to get all todos
/// Returns a clone of the current todos list
#[tauri::command]
fn get_todos(state: tauri::State<AppState>) -> Result<Vec<Todo>, String> {
    let todos = state.todos.lock()
        .map_err(|e| TodoError::LockError(format!("Failed to lock todos: {}", e)))?;

    Ok(todos.clone())
}

/// Tauri command to add a new todo
/// Validates input, sanitizes text, and saves with debouncing
#[tauri::command]
fn add_todo(
    text: String,
    state: tauri::State<AppState>,
    app_handle: tauri::AppHandle,
) -> Result<Todo, String> {
    // Validate input
    validate_todo_text(&text)?;

    // Sanitize input
    let sanitized_text = sanitize_todo_text(&text);

    // Create new todo
    let new_todo = Todo {
        id: Uuid::new_v4().to_string(),
        text: sanitized_text,
        completed: false,
        created_at: chrono::Utc::now().timestamp_millis(),
    };

    // Add to state
    {
        let mut todos = state.todos.lock()
            .map_err(|e| TodoError::LockError(format!("Failed to lock todos: {}", e)))?;
        todos.push(new_todo.clone());
    }

    // Save with debouncing
    save_todos_debounced(&app_handle, &state)?;

    Ok(new_todo)
}

/// Tauri command to toggle a todo's completion status
/// Uses debounced saving for better performance
#[tauri::command]
fn toggle_todo(
    id: String,
    state: tauri::State<AppState>,
    app_handle: tauri::AppHandle,
) -> Result<Todo, String> {
    // Validate ID is not empty
    if id.trim().is_empty() {
        return Err(TodoError::InvalidInput("Todo ID cannot be empty".to_string()).into());
    }

    let updated_todo = {
        let mut todos = state.todos.lock()
            .map_err(|e| TodoError::LockError(format!("Failed to lock todos: {}", e)))?;

        let todo = todos
            .iter_mut()
            .find(|t| t.id == id)
            .ok_or_else(|| TodoError::NotFound(
                format!("Todo with ID '{}' not found", id)
            ))?;

        todo.completed = !todo.completed;
        todo.clone()
    };

    // Save with debouncing
    save_todos_debounced(&app_handle, &state)?;

    Ok(updated_todo)
}

/// Tauri command to delete a todo
/// Returns an error if the todo doesn't exist
#[tauri::command]
fn delete_todo(
    id: String,
    state: tauri::State<AppState>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    // Validate ID is not empty
    if id.trim().is_empty() {
        return Err(TodoError::InvalidInput("Todo ID cannot be empty".to_string()).into());
    }

    {
        let mut todos = state.todos.lock()
            .map_err(|e| TodoError::LockError(format!("Failed to lock todos: {}", e)))?;

        let initial_len = todos.len();
        todos.retain(|t| t.id != id);

        if todos.len() == initial_len {
            return Err(TodoError::NotFound(
                format!("Todo with ID '{}' not found", id)
            ).into());
        }
    }

    // Save with debouncing
    save_todos_debounced(&app_handle, &state)?;

    Ok(())
}

/// Tauri command to force save all pending changes
/// Useful for ensuring data is persisted before app shutdown
#[tauri::command]
fn force_save(
    state: tauri::State<AppState>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let todos = state.todos.lock()
        .map_err(|e| TodoError::LockError(format!("Failed to lock todos: {}", e)))?;

    save_todos_to_file_immediate(&app_handle, &todos)?;

    // Update last save time
    let mut last_save = state.last_save.lock()
        .map_err(|e| TodoError::LockError(format!("Failed to lock last_save: {}", e)))?;
    *last_save = Some(Instant::now());

    Ok(())
}

fn main() {
    let result = tauri::Builder::default()
        .setup(|app| {
            // Load todos from file on startup
            let todos = load_todos_from_file(app.handle());

            // Initialize application state with debouncing fields
            app.manage(AppState {
                todos: Mutex::new(todos),
                last_save: Mutex::new(None),
                pending_save: Mutex::new(false),
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_todos,
            add_todo,
            toggle_todo,
            delete_todo,
            force_save
        ])
        .build(tauri::generate_context!());

    match result {
        Ok(app) => {
            app.run(|app_handle, event| {
                // Save any pending changes when the app is about to exit
                if let tauri::RunEvent::Exit = event {
                    if let Some(state) = app_handle.try_state::<AppState>() {
                        let pending = state.pending_save.lock().ok()
                            .map(|p| *p)
                            .unwrap_or(false);

                        if pending {
                            if let Ok(todos) = state.todos.lock() {
                                let _ = save_todos_to_file_immediate(app_handle, &todos);
                            }
                        }
                    }
                }
            });
        }
        Err(e) => {
            eprintln!("Error while building Tauri application: {}", e);
            std::process::exit(1);
        }
    }
}
