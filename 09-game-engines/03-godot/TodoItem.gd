extends HBoxContainer
## Represents a single todo item in the list
##
## This component displays a todo with a checkbox, label, and delete button.
## It emits signals when the todo is toggled or deleted.

## Emitted when the todo's completed status changes
## @param id: The todo's unique identifier
## @param completed: The new completed status
signal todo_toggled(id: int, completed: bool)

## Emitted when the delete button is pressed
## @param id: The todo's unique identifier
signal todo_deleted(id: int)

var todo_id: int = -1
var todo_text: String = ""
var is_completed: bool = false

@onready var checkbox: CheckBox = $CheckBox
@onready var label: Label = $Label
@onready var delete_button: Button = $DeleteButton


func _ready() -> void:
	# Connect signals
	checkbox.toggled.connect(_on_checkbox_toggled)
	delete_button.pressed.connect(_on_delete_button_pressed)

	# Update visual state
	_update_label_style()


## Initialize the todo item with data
## @param id: Unique identifier
## @param text: Todo text
## @param completed: Completion status
func setup(id: int, text: String, completed: bool) -> void:
	todo_id = id
	todo_text = text
	is_completed = completed

	if is_node_ready():
		_update_ui()


## Update UI elements to match current state
func _update_ui() -> void:
	checkbox.button_pressed = is_completed
	label.text = todo_text
	_update_label_style()


## Update label style based on completion status
func _update_label_style() -> void:
	if is_completed:
		label.add_theme_color_override("font_color", Color(0.6, 0.6, 0.6))
	else:
		label.remove_theme_color_override("font_color")


## Handle checkbox toggle
func _on_checkbox_toggled(toggled_on: bool) -> void:
	is_completed = toggled_on
	_update_label_style()
	todo_toggled.emit(todo_id, is_completed)


## Handle delete button press
func _on_delete_button_pressed() -> void:
	todo_deleted.emit(todo_id)
