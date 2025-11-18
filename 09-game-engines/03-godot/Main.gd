extends Control
## Main application controller
##
## This is the root scene that coordinates all components:
## - TodoInput for adding new todos
## - TodoList for managing the todo list
## - Statistics display
## - Action buttons (Clear Completed, Clear All)

@onready var todo_input: HBoxContainer = $MarginContainer/VBoxContainer/Header/TodoInput
@onready var todo_list: VBoxContainer = $MarginContainer/VBoxContainer/TodoList
@onready var stats_label: Label = $MarginContainer/VBoxContainer/Footer/StatsLabel
@onready var clear_completed_button: Button = $MarginContainer/VBoxContainer/Footer/Actions/ClearCompletedButton
@onready var clear_all_button: Button = $MarginContainer/VBoxContainer/Footer/Actions/ClearAllButton


func _ready() -> void:
	# Connect signals
	todo_input.todo_submitted.connect(_on_todo_submitted)
	todo_list.list_changed.connect(_on_list_changed)
	clear_completed_button.pressed.connect(_on_clear_completed_pressed)
	clear_all_button.pressed.connect(_on_clear_all_pressed)

	# Initial stats update
	_update_stats()


## Handle new todo submission from input
func _on_todo_submitted(text: String) -> void:
	todo_list.add_todo(text)


## Handle list changes to update stats
func _on_list_changed(_total: int, _completed: int) -> void:
	_update_stats()


## Handle Clear Completed button press
func _on_clear_completed_pressed() -> void:
	todo_list.clear_completed()


## Handle Clear All button press
func _on_clear_all_pressed() -> void:
	# Show confirmation dialog
	var dialog := ConfirmationDialog.new()
	dialog.dialog_text = "Are you sure you want to delete all todos?"
	dialog.ok_button_text = "Delete All"
	dialog.cancel_button_text = "Cancel"

	dialog.confirmed.connect(func():
		todo_list.clear_all()
		dialog.queue_free()
	)
	dialog.canceled.connect(func():
		dialog.queue_free()
	)

	add_child(dialog)
	dialog.popup_centered()


## Update the statistics label
func _update_stats() -> void:
	var stats := todo_list.get_stats()
	var total := stats["total"]
	var active := stats["active"]
	var completed := stats["completed"]

	if total == 0:
		stats_label.text = "No todos yet"
	else:
		var parts := []
		parts.append("%d total" % total)
		parts.append("%d active" % active)
		parts.append("%d completed" % completed)
		stats_label.text = ", ".join(parts)

	# Enable/disable Clear Completed button
	clear_completed_button.disabled = (completed == 0)
	clear_all_button.disabled = (total == 0)


## Handle ESC key to quit application
func _input(event: InputEvent) -> void:
	if event is InputEventKey:
		if event.pressed and event.keycode == KEY_ESCAPE:
			get_tree().quit()
