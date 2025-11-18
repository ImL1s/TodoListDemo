extends HBoxContainer
## Handles user input for creating new todos
##
## This component provides a text input field and an "Add" button.
## When the user submits (clicks button or presses Enter), it emits
## a signal with the todo text and clears the input field.

## Emitted when user wants to add a new todo
## @param text: The todo text to add
signal todo_submitted(text: String)

@onready var line_edit: LineEdit = $LineEdit
@onready var add_button: Button = $AddButton


func _ready() -> void:
	# Connect signals
	add_button.pressed.connect(_on_add_button_pressed)
	line_edit.text_submitted.connect(_on_line_edit_text_submitted)

	# Set focus to input field on start
	line_edit.grab_focus()


## Handle Add button press
func _on_add_button_pressed() -> void:
	_submit_todo()


## Handle Enter key in line edit
func _on_line_edit_text_submitted(_text: String) -> void:
	_submit_todo()


## Submit the current todo text
func _submit_todo() -> void:
	var text := line_edit.text.strip_edges()

	if text.is_empty():
		return

	todo_submitted.emit(text)
	line_edit.clear()
	line_edit.grab_focus()


## Programmatically set focus to the input field
func focus_input() -> void:
	line_edit.grab_focus()
