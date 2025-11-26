extends VBoxContainer
## Manages the list of todo items
##
## This component maintains the todo data model and creates/destroys
## TodoItem nodes as needed. It handles CRUD operations and persistence.

const TodoItem := preload("res://TodoItem.tscn")

## Emitted when the todo list changes (for potential UI updates)
signal list_changed(todo_count: int, completed_count: int)

var todos: Array = []
var next_id: int = 1

@onready var scroll_container: ScrollContainer = $ScrollContainer
@onready var todo_container: VBoxContainer = $ScrollContainer/VBoxContainer
@onready var empty_label: Label = $EmptyLabel


func _ready() -> void:
	_update_empty_state()
	_load_todos()


## Add a new todo
## @param text: The todo text
func add_todo(text: String) -> void:
	var todo := {
		"id": next_id,
		"text": text,
		"completed": false
	}

	next_id += 1
	todos.append(todo)

	_create_todo_item(todo)
	_update_empty_state()
	_save_todos()
	_emit_list_changed()


## Toggle a todo's completion status
## @param id: The todo's unique identifier
## @param completed: The new completion status
func toggle_todo(id: int, completed: bool) -> void:
	for todo in todos:
		if todo["id"] == id:
			todo["completed"] = completed
			_save_todos()
			_emit_list_changed()
			return


## Delete a todo
## @param id: The todo's unique identifier
func delete_todo(id: int) -> void:
	for i in range(todos.size()):
		if todos[i]["id"] == id:
			todos.remove_at(i)

			# Find and remove the corresponding UI node
			for child in todo_container.get_children():
				if child.todo_id == id:
					child.queue_free()
					break

			_update_empty_state()
			_save_todos()
			_emit_list_changed()
			return


## Clear all completed todos
func clear_completed() -> void:
	var had_completed := false

	# Remove from data
	for i in range(todos.size() - 1, -1, -1):
		if todos[i]["completed"]:
			todos.remove_at(i)
			had_completed = true

	# Remove from UI
	for child in todo_container.get_children():
		if child.is_completed:
			child.queue_free()

	if had_completed:
		_update_empty_state()
		_save_todos()
		_emit_list_changed()


## Clear all todos
func clear_all() -> void:
	todos.clear()

	for child in todo_container.get_children():
		child.queue_free()

	_update_empty_state()
	_save_todos()
	_emit_list_changed()


## Get statistics about the todos
## @return Dictionary: Contains total, active, and completed counts
func get_stats() -> Dictionary:
	var total := todos.size()
	var completed := 0

	for todo in todos:
		if todo["completed"]:
			completed += 1

	return {
		"total": total,
		"active": total - completed,
		"completed": completed
	}


## Create a TodoItem node for a todo
func _create_todo_item(todo: Dictionary) -> void:
	var item := TodoItem.instantiate()
	todo_container.add_child(item)

	# Setup the item with data
	item.setup(todo["id"], todo["text"], todo["completed"])

	# Connect signals
	item.todo_toggled.connect(toggle_todo)
	item.todo_deleted.connect(delete_todo)


## Update visibility of empty state message
func _update_empty_state() -> void:
	var is_empty := todos.is_empty()
	empty_label.visible = is_empty
	scroll_container.visible = not is_empty


## Save todos to disk
func _save_todos() -> void:
	DataManager.save_todos(todos)


## Load todos from disk
func _load_todos() -> void:
	var loaded_todos := DataManager.load_todos()

	if loaded_todos.is_empty():
		return

	# Find the highest ID to set next_id correctly
	var max_id := 0
	for todo in loaded_todos:
		if not todo.has("id") or not todo.has("text") or not todo.has("completed"):
			continue

		todos.append(todo)
		if todo["id"] > max_id:
			max_id = todo["id"]

		_create_todo_item(todo)

	next_id = max_id + 1
	_update_empty_state()
	_emit_list_changed()


## Emit the list_changed signal with current stats
func _emit_list_changed() -> void:
	var stats := get_stats()
	list_changed.emit(stats["total"], stats["completed"])
