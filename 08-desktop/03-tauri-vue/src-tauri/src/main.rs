// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager, State, Runtime};
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Todo {
    id: i64,
    text: String,
    completed: bool,
    #[serde(rename = "createdAt")]
    created_at: i64,
}

// State management with Mutex for thread safety
struct AppState {
    data_path: PathBuf,
}

impl AppState {
    fn new(app_handle: &AppHandle) -> Self {
        let data_dir = app_handle
            .path()
            .app_data_dir()
            .expect("Failed to get app data directory");

        // Create data directory if it doesn't exist
        fs::create_dir_all(&data_dir).expect("Failed to create data directory");

        let data_path = data_dir.join("todos.json");

        Self { data_path }
    }
}

// Tauri Commands - These are the IPC bridge between Rust and JavaScript

#[tauri::command]
fn get_todos(state: State<AppState>) -> Result<Vec<Todo>, String> {
    // Read todos from file system
    match fs::read_to_string(&state.data_path) {
        Ok(content) => {
            let todos: Vec<Todo> = serde_json::from_str(&content)
                .unwrap_or_else(|_| Vec::new());
            Ok(todos)
        }
        Err(_) => {
            // File doesn't exist yet, return empty list
            Ok(Vec::new())
        }
    }
}

#[tauri::command]
fn save_todos(todos: Vec<Todo>, state: State<AppState>) -> Result<(), String> {
    // Save todos to file system
    let json = serde_json::to_string_pretty(&todos)
        .map_err(|e| format!("Failed to serialize todos: {}", e))?;

    fs::write(&state.data_path, json)
        .map_err(|e| format!("Failed to write todos: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn show_about(app: AppHandle) -> Result<(), String> {
    use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

    let message = "Tauri Vue Todo v0.1.0\n\n\
                   Built with:\n\
                   • Tauri 2.0 (Rust backend)\n\
                   • Vue 3 (TypeScript frontend)\n\
                   • Vite (Build tool)\n\n\
                   Features:\n\
                   ✓ Lightweight (~3-5 MB)\n\
                   ✓ Fast startup time\n\
                   ✓ Native performance\n\
                   ✓ Cross-platform\n\
                   ✓ Secure by default\n\n\
                   Tauri is 10x smaller and faster than Electron!";

    app.dialog()
        .message(message)
        .kind(MessageDialogKind::Info)
        .title("About Tauri Vue Todo")
        .blocking_show();

    Ok(())
}

// Menu setup
fn create_menu<R: Runtime>(app: &AppHandle<R>) -> Result<Menu<R>, tauri::Error> {
    let menu = Menu::new(app)?;

    // File menu
    let file_menu = Submenu::with_items(
        app,
        "File",
        true,
        &[
            &MenuItem::with_id(app, "new", "New Todo", true, Some("CmdOrCtrl+N"))?,
            &MenuItem::with_id(app, "refresh", "Refresh", true, Some("CmdOrCtrl+R"))?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::quit(app, Some("Quit"))?,
        ],
    )?;

    // Edit menu
    let edit_menu = Submenu::with_items(
        app,
        "Edit",
        true,
        &[
            &PredefinedMenuItem::undo(app, None)?,
            &PredefinedMenuItem::redo(app, None)?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::cut(app, None)?,
            &PredefinedMenuItem::copy(app, None)?,
            &PredefinedMenuItem::paste(app, None)?,
            &PredefinedMenuItem::select_all(app, None)?,
        ],
    )?;

    // View menu
    let view_menu = Submenu::with_items(
        app,
        "View",
        true,
        &[
            &MenuItem::with_id(app, "filter-all", "Show All", true, None)?,
            &MenuItem::with_id(app, "filter-active", "Show Active", true, None)?,
            &MenuItem::with_id(app, "filter-completed", "Show Completed", true, None)?,
            &PredefinedMenuItem::separator(app)?,
            &PredefinedMenuItem::fullscreen(app, None)?,
        ],
    )?;

    // Help menu
    let help_menu = Submenu::with_items(
        app,
        "Help",
        true,
        &[
            &MenuItem::with_id(app, "about", "About", true, None)?,
        ],
    )?;

    menu.append(&file_menu)?;
    menu.append(&edit_menu)?;
    menu.append(&view_menu)?;
    menu.append(&help_menu)?;

    Ok(menu)
}

// System tray setup
fn create_tray<R: Runtime>(app: &AppHandle<R>) -> Result<(), tauri::Error> {
    let _ = TrayIconBuilder::with_id("main")
        .tooltip("Tauri Vue Todo")
        .icon(app.default_window_icon().unwrap().clone())
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
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

    Ok(())
}

fn main() {
    tauri::Builder::default()
        // Register plugins
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        // Setup app state
        .setup(|app| {
            let state = AppState::new(app.handle());
            app.manage(state);

            // Create menu
            let menu = create_menu(app.handle())?;
            app.set_menu(menu)?;

            // Handle menu events
            app.on_menu_event(|app, event| {
                match event.id().as_ref() {
                    "new" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.emit("menu-new-todo", ());
                        }
                    }
                    "refresh" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.emit("refresh-todos", ());
                        }
                    }
                    "about" => {
                        let app_handle = app.clone();
                        tauri::async_runtime::spawn(async move {
                            let _ = show_about(app_handle).await;
                        });
                    }
                    _ => {}
                }
            });

            // Create system tray
            create_tray(app.handle())?;

            Ok(())
        })
        // Register commands
        .invoke_handler(tauri::generate_handler![
            get_todos,
            save_todos,
            show_about
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
