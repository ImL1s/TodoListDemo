// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::Manager;
use uuid::Uuid;

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

/// Application state
/// Wrapped in Mutex for thread-safe access
struct AppState {
    todos: Mutex<Vec<Todo>>,
}

/// Get the path to the todos data file
/// Uses Tauri's app data directory for persistent storage
fn get_data_file_path(app_handle: tauri::AppHandle) -> PathBuf {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("Failed to get app data directory");

    // Ensure the directory exists
    fs::create_dir_all(&app_dir).expect("Failed to create app data directory");

    app_dir.join("todos.json")
}

/// Load todos from the data file
fn load_todos_from_file(app_handle: tauri::AppHandle) -> Vec<Todo> {
    let file_path = get_data_file_path(app_handle);

    if file_path.exists() {
        match fs::read_to_string(&file_path) {
            Ok(contents) => {
                match serde_json::from_str(&contents) {
                    Ok(todos) => todos,
                    Err(e) => {
                        eprintln!("Error parsing todos file: {}", e);
                        Vec::new()
                    }
                }
            }
            Err(e) => {
                eprintln!("Error reading todos file: {}", e);
                Vec::new()
            }
        }
    } else {
        Vec::new()
    }
}

/// Save todos to the data file
fn save_todos_to_file(app_handle: tauri::AppHandle, todos: &Vec<Todo>) -> Result<(), String> {
    let file_path = get_data_file_path(app_handle);

    let json = serde_json::to_string_pretty(todos)
        .map_err(|e| format!("Failed to serialize todos: {}", e))?;

    fs::write(&file_path, json)
        .map_err(|e| format!("Failed to write todos file: {}", e))?;

    Ok(())
}

/// Tauri command to get all todos
#[tauri::command]
fn get_todos(state: tauri::State<AppState>) -> Vec<Todo> {
    let todos = state.todos.lock().unwrap();
    todos.clone()
}

/// Tauri command to add a new todo
#[tauri::command]
fn add_todo(
    text: String,
    state: tauri::State<AppState>,
    app_handle: tauri::AppHandle,
) -> Result<Todo, String> {
    let mut todos = state.todos.lock().unwrap();

    let new_todo = Todo {
        id: Uuid::new_v4().to_string(),
        text,
        completed: false,
        created_at: chrono::Utc::now().timestamp_millis(),
    };

    todos.push(new_todo.clone());
    save_todos_to_file(app_handle, &todos)?;

    Ok(new_todo)
}

/// Tauri command to toggle a todo's completion status
#[tauri::command]
fn toggle_todo(
    id: String,
    state: tauri::State<AppState>,
    app_handle: tauri::AppHandle,
) -> Result<Todo, String> {
    let mut todos = state.todos.lock().unwrap();

    let todo = todos
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or_else(|| "Todo not found".to_string())?;

    todo.completed = !todo.completed;
    let updated_todo = todo.clone();

    save_todos_to_file(app_handle, &todos)?;

    Ok(updated_todo)
}

/// Tauri command to delete a todo
#[tauri::command]
fn delete_todo(
    id: String,
    state: tauri::State<AppState>,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let mut todos = state.todos.lock().unwrap();

    let initial_len = todos.len();
    todos.retain(|t| t.id != id);

    if todos.len() == initial_len {
        return Err("Todo not found".to_string());
    }

    save_todos_to_file(app_handle, &todos)?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Load todos from file on startup
            let todos = load_todos_from_file(app.handle());

            // Initialize application state
            app.manage(AppState {
                todos: Mutex::new(todos),
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_todos,
            add_todo,
            toggle_todo,
            delete_todo
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Note: chrono crate is used for timestamps
// Add this to Cargo.toml dependencies:
// chrono = "0.4"
