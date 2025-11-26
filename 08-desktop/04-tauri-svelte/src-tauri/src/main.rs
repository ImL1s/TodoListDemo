// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{Manager, State, menu::{Menu, MenuItem, PredefinedMenuItem}, tray::{TrayIconBuilder, MouseButton, MouseButtonState}};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Todo {
    id: String,
    text: String,
    completed: bool,
    created_at: i64,
    updated_at: i64,
}

struct AppState {
    todos: Mutex<Vec<Todo>>,
    data_path: PathBuf,
}

impl AppState {
    fn new(data_path: PathBuf) -> Self {
        let todos = Self::load_from_file(&data_path).unwrap_or_default();
        Self {
            todos: Mutex::new(todos),
            data_path,
        }
    }

    fn load_from_file(path: &PathBuf) -> Result<Vec<Todo>, Box<dyn std::error::Error>> {
        if !path.exists() {
            return Ok(Vec::new());
        }
        let content = fs::read_to_string(path)?;
        let todos: Vec<Todo> = serde_json::from_str(&content)?;
        Ok(todos)
    }

    fn save_to_file(&self) -> Result<(), Box<dyn std::error::Error>> {
        let todos = self.todos.lock().unwrap();
        let json = serde_json::to_string_pretty(&*todos)?;

        // Ensure parent directory exists
        if let Some(parent) = self.data_path.parent() {
            fs::create_dir_all(parent)?;
        }

        fs::write(&self.data_path, json)?;
        Ok(())
    }
}

#[tauri::command]
fn get_todos(state: State<AppState>) -> Result<Vec<Todo>, String> {
    let todos = state.todos.lock().unwrap();
    Ok(todos.clone())
}

#[tauri::command]
fn add_todo(text: String, state: State<AppState>) -> Result<Todo, String> {
    let now = chrono::Utc::now().timestamp_millis();
    let todo = Todo {
        id: Uuid::new_v4().to_string(),
        text,
        completed: false,
        created_at: now,
        updated_at: now,
    };

    let mut todos = state.todos.lock().unwrap();
    todos.push(todo.clone());
    drop(todos);

    state.save_to_file().map_err(|e| e.to_string())?;
    Ok(todo)
}

#[tauri::command]
fn update_todo(id: String, text: String, state: State<AppState>) -> Result<Todo, String> {
    let mut todos = state.todos.lock().unwrap();

    let todo = todos
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or("Todo not found")?;

    todo.text = text;
    todo.updated_at = chrono::Utc::now().timestamp_millis();
    let updated_todo = todo.clone();
    drop(todos);

    state.save_to_file().map_err(|e| e.to_string())?;
    Ok(updated_todo)
}

#[tauri::command]
fn toggle_todo(id: String, state: State<AppState>) -> Result<Todo, String> {
    let mut todos = state.todos.lock().unwrap();

    let todo = todos
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or("Todo not found")?;

    todo.completed = !todo.completed;
    todo.updated_at = chrono::Utc::now().timestamp_millis();
    let updated_todo = todo.clone();
    drop(todos);

    state.save_to_file().map_err(|e| e.to_string())?;
    Ok(updated_todo)
}

#[tauri::command]
fn delete_todo(id: String, state: State<AppState>) -> Result<(), String> {
    let mut todos = state.todos.lock().unwrap();
    todos.retain(|t| t.id != id);
    drop(todos);

    state.save_to_file().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn clear_completed(state: State<AppState>) -> Result<(), String> {
    let mut todos = state.todos.lock().unwrap();
    todos.retain(|t| !t.completed);
    drop(todos);

    state.save_to_file().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_stats(state: State<AppState>) -> Result<serde_json::Value, String> {
    let todos = state.todos.lock().unwrap();
    let total = todos.len();
    let active = todos.iter().filter(|t| !t.completed).count();
    let completed = todos.iter().filter(|t| t.completed).count();

    Ok(serde_json::json!({
        "total": total,
        "active": active,
        "completed": completed,
    }))
}

fn create_menu(app: &tauri::AppHandle) -> Result<Menu<tauri::Wry>, tauri::Error> {
    let menu = Menu::new(app)?;

    // File menu
    let file_menu = Menu::with_items(app, &[
        &MenuItem::with_id(app, "new", "New Todo", true, Some("CmdOrCtrl+N"))?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "refresh", "Refresh", true, Some("CmdOrCtrl+R"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::close_window(app, Some("Close"))?,
        &PredefinedMenuItem::quit(app, Some("Quit"))?,
    ])?;

    // Edit menu
    let edit_menu = Menu::with_items(app, &[
        &PredefinedMenuItem::undo(app, Some("Undo"))?,
        &PredefinedMenuItem::redo(app, Some("Redo"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::cut(app, Some("Cut"))?,
        &PredefinedMenuItem::copy(app, Some("Copy"))?,
        &PredefinedMenuItem::paste(app, Some("Paste"))?,
        &PredefinedMenuItem::select_all(app, Some("Select All"))?,
    ])?;

    // View menu
    let view_menu = Menu::with_items(app, &[
        &MenuItem::with_id(app, "search", "Search", true, Some("CmdOrCtrl+F"))?,
        &PredefinedMenuItem::separator(app)?,
        &MenuItem::with_id(app, "filter_all", "Show All", true, None)?,
        &MenuItem::with_id(app, "filter_active", "Show Active", true, None)?,
        &MenuItem::with_id(app, "filter_completed", "Show Completed", true, None)?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::minimize(app, Some("Minimize"))?,
        &PredefinedMenuItem::maximize(app, Some("Maximize"))?,
    ])?;

    // Window menu
    let window_menu = Menu::with_items(app, &[
        &PredefinedMenuItem::minimize(app, Some("Minimize"))?,
        &MenuItem::with_id(app, "minimize_to_tray", "Minimize to Tray", true, Some("CmdOrCtrl+M"))?,
        &PredefinedMenuItem::separator(app)?,
        &PredefinedMenuItem::close_window(app, Some("Close Window"))?,
    ])?;

    // Add submenus to main menu
    menu.append(&MenuItem::with_id(app, "file", "File", true, None::<&str>)?)?;
    menu.append(&MenuItem::with_id(app, "edit", "Edit", true, None::<&str>)?)?;
    menu.append(&MenuItem::with_id(app, "view", "View", true, None::<&str>)?)?;
    menu.append(&MenuItem::with_id(app, "window", "Window", true, None::<&str>)?)?;

    Ok(menu)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Get app data directory
            let app_dir = app.path().app_data_dir().expect("Failed to get app data dir");
            let data_path = app_dir.join("todos.json");

            // Initialize app state
            let state = AppState::new(data_path);
            app.manage(state);

            // Create system tray
            let tray_menu = Menu::new(app.handle())?;
            tray_menu.append(&MenuItem::with_id(app, "show", "Show Window", true, None::<&str>)?)?;
            tray_menu.append(&MenuItem::with_id(app, "new_todo", "New Todo", true, None::<&str>)?)?;
            tray_menu.append(&PredefinedMenuItem::separator(app)?)?;
            tray_menu.append(&MenuItem::with_id(app, "quit_app", "Quit", true, None::<&str>)?)?;

            let _tray = TrayIconBuilder::new()
                .menu(&tray_menu)
                .tooltip("Tauri Svelte Todo")
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "new_todo" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                                let _ = window.eval("document.querySelector('input[placeholder^=\"What needs\"]')?.focus()");
                            }
                        }
                        "quit_app" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let tauri::tray::TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            // Setup menu event handlers
            app.on_menu_event(|app, event| {
                match event.id.as_ref() {
                    "new" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.eval("document.querySelector('input[placeholder^=\"What needs\"]')?.focus()");
                        }
                    }
                    "refresh" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.emit("refresh-todos", ());
                        }
                    }
                    "search" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.eval("document.querySelector('input[placeholder=\"Search todos...\"]')?.focus()");
                        }
                    }
                    "minimize_to_tray" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.hide();
                        }
                    }
                    _ => {}
                }
            });

            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_todos,
            add_todo,
            update_todo,
            toggle_todo,
            delete_todo,
            clear_completed,
            get_stats,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
