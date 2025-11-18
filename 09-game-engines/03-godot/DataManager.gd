extends Node
## Manages data persistence for the Todo List application
##
## This singleton handles saving and loading todos from the filesystem.
## It uses Godot's user:// path for platform-independent data storage.

const SAVE_PATH := "user://todos.json"

## Save todos to file
## @param todos: Array of todo dictionaries to save
## @return bool: true if save successful, false otherwise
func save_todos(todos: Array) -> bool:
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		push_error("Failed to open save file: " + str(FileAccess.get_open_error()))
		return false

	var data := {
		"version": "1.0",
		"todos": todos
	}

	var json_string := JSON.stringify(data, "\t")
	file.store_string(json_string)
	file.close()

	print("Saved ", todos.size(), " todos to ", SAVE_PATH)
	return true


## Load todos from file
## @return Array: Array of todo dictionaries, or empty array if file doesn't exist
func load_todos() -> Array:
	if not FileAccess.file_exists(SAVE_PATH):
		print("Save file doesn't exist yet, returning empty array")
		return []

	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		push_error("Failed to open save file: " + str(FileAccess.get_open_error()))
		return []

	var json_string := file.get_as_text()
	file.close()

	var json := JSON.new()
	var error := json.parse(json_string)

	if error != OK:
		push_error("Failed to parse JSON: " + json.get_error_message())
		return []

	var data = json.data
	if typeof(data) != TYPE_DICTIONARY:
		push_error("Invalid save data format")
		return []

	if not data.has("todos"):
		push_error("Save data missing 'todos' field")
		return []

	var todos = data["todos"]
	if typeof(todos) != TYPE_ARRAY:
		push_error("'todos' field is not an array")
		return []

	print("Loaded ", todos.size(), " todos from ", SAVE_PATH)
	return todos


## Delete the save file
## @return bool: true if deletion successful or file doesn't exist, false otherwise
func delete_save_file() -> bool:
	if not FileAccess.file_exists(SAVE_PATH):
		return true

	var error := DirAccess.remove_absolute(SAVE_PATH)
	if error != OK:
		push_error("Failed to delete save file: " + str(error))
		return false

	print("Deleted save file")
	return true


## Get the absolute path to the save file
## @return String: Absolute filesystem path
func get_save_path_absolute() -> String:
	return ProjectSettings.globalize_path(SAVE_PATH)
