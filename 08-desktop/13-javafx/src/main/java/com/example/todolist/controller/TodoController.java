package com.example.todolist.controller;

import com.example.todolist.model.Todo;
import com.example.todolist.util.StorageService;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.HBox;
import javafx.geometry.Pos;

import java.util.Optional;

/**
 * JavaFX FXML Controller for TodoList
 *
 * Handles all UI interactions and business logic for the todo application.
 */
public class TodoController {

    @FXML
    private TextField inputField;

    @FXML
    private Button addButton;

    @FXML
    private ListView<Todo> todoListView;

    @FXML
    private Label statusLabel;

    @FXML
    private Button clearCompletedButton;

    @FXML
    private ToggleGroup filterGroup;

    @FXML
    private RadioButton filterAll;

    @FXML
    private RadioButton filterActive;

    @FXML
    private RadioButton filterCompleted;

    private final ObservableList<Todo> allTodos = FXCollections.observableArrayList();
    private final ObservableList<Todo> filteredTodos = FXCollections.observableArrayList();
    private final StorageService storageService = new StorageService();

    /**
     * Initialize the controller
     * Called automatically by JavaFX after FXML loading
     */
    @FXML
    public void initialize() {
        System.out.println("TodoController initialized");

        // Set up ListView with custom cell factory
        setupListView();

        // Set up event handlers
        setupEventHandlers();

        // Load saved todos
        loadTodos();

        // Set initial filter
        filterAll.setSelected(true);
        applyFilter();

        // Update status
        updateStatus();

        // Focus on input field
        Platform.runLater(() -> inputField.requestFocus());
    }

    /**
     * Set up ListView with custom cell rendering
     */
    private void setupListView() {
        todoListView.setItems(filteredTodos);

        // Custom cell factory for todo items
        todoListView.setCellFactory(param -> new ListCell<>() {
            private final CheckBox checkBox = new CheckBox();
            private final Label label = new Label();
            private final Button deleteButton = new Button("Delete");
            private final HBox hbox = new HBox(10);

            {
                // Configure layout
                hbox.setAlignment(Pos.CENTER_LEFT);
                label.setMaxWidth(Double.MAX_VALUE);
                HBox.setHgrow(label, javafx.scene.layout.Priority.ALWAYS);

                // Style delete button
                deleteButton.getStyleClass().add("delete-button");

                // Add components to HBox
                hbox.getChildren().addAll(checkBox, label, deleteButton);

                // Set up event handlers
                checkBox.setOnAction(e -> {
                    Todo todo = getItem();
                    if (todo != null) {
                        toggleTodo(todo);
                    }
                });

                deleteButton.setOnAction(e -> {
                    Todo todo = getItem();
                    if (todo != null) {
                        deleteTodo(todo);
                    }
                });
            }

            @Override
            protected void updateItem(Todo todo, boolean empty) {
                super.updateItem(todo, empty);

                if (empty || todo == null) {
                    setText(null);
                    setGraphic(null);
                } else {
                    // Bind checkbox to todo's completed property
                    checkBox.setSelected(todo.isCompleted());

                    // Set label text
                    label.setText(todo.getText());

                    // Apply strikethrough style if completed
                    if (todo.isCompleted()) {
                        label.setStyle("-fx-text-fill: #888; -fx-strikethrough: true;");
                    } else {
                        label.setStyle("");
                    }

                    setGraphic(hbox);
                }
            }
        });

        // Handle empty list
        todoListView.setPlaceholder(new Label("No todos yet. Add one above!"));
    }

    /**
     * Set up event handlers for UI components
     */
    private void setupEventHandlers() {
        // Add button click
        addButton.setOnAction(e -> addTodo());

        // Enter key in input field
        inputField.setOnKeyPressed(e -> {
            if (e.getCode() == KeyCode.ENTER) {
                addTodo();
            }
        });

        // Clear completed button
        clearCompletedButton.setOnAction(e -> clearCompleted());

        // Filter radio buttons
        filterAll.setOnAction(e -> applyFilter());
        filterActive.setOnAction(e -> applyFilter());
        filterCompleted.setOnAction(e -> applyFilter());
    }

    /**
     * Add a new todo
     */
    @FXML
    private void addTodo() {
        String text = inputField.getText().trim();

        if (text.isEmpty()) {
            showAlert("Empty Todo", "Please enter a todo text.");
            return;
        }

        // Create new todo
        Todo todo = new Todo(text);
        allTodos.add(todo);

        // Clear input
        inputField.clear();

        // Apply filter and update status
        applyFilter();
        updateStatus();

        // Save to file
        saveTodos();

        System.out.println("Todo added: " + todo);
    }

    /**
     * Toggle todo completion status
     *
     * @param todo the todo to toggle
     */
    private void toggleTodo(Todo todo) {
        todo.toggle();
        todoListView.refresh();
        updateStatus();
        saveTodos();
        System.out.println("Todo toggled: " + todo);
    }

    /**
     * Delete a todo
     *
     * @param todo the todo to delete
     */
    private void deleteTodo(Todo todo) {
        // Confirm deletion
        Optional<ButtonType> result = showConfirmation(
                "Delete Todo",
                "Are you sure you want to delete this todo?",
                todo.getText()
        );

        if (result.isPresent() && result.get() == ButtonType.OK) {
            allTodos.remove(todo);
            applyFilter();
            updateStatus();
            saveTodos();
            System.out.println("Todo deleted: " + todo);
        }
    }

    /**
     * Clear all completed todos
     */
    @FXML
    private void clearCompleted() {
        long completedCount = allTodos.stream().filter(Todo::isCompleted).count();

        if (completedCount == 0) {
            showAlert("No Completed Todos", "There are no completed todos to clear.");
            return;
        }

        // Confirm deletion
        Optional<ButtonType> result = showConfirmation(
                "Clear Completed",
                "Are you sure you want to delete all completed todos?",
                completedCount + " todo(s) will be deleted."
        );

        if (result.isPresent() && result.get() == ButtonType.OK) {
            allTodos.removeIf(Todo::isCompleted);
            applyFilter();
            updateStatus();
            saveTodos();
            System.out.println("Cleared " + completedCount + " completed todos");
        }
    }

    /**
     * Apply the selected filter
     */
    private void applyFilter() {
        filteredTodos.clear();

        if (filterAll.isSelected()) {
            filteredTodos.addAll(allTodos);
        } else if (filterActive.isSelected()) {
            allTodos.stream()
                    .filter(todo -> !todo.isCompleted())
                    .forEach(filteredTodos::add);
        } else if (filterCompleted.isSelected()) {
            allTodos.stream()
                    .filter(Todo::isCompleted)
                    .forEach(filteredTodos::add);
        }
    }

    /**
     * Update status label
     */
    private void updateStatus() {
        long total = allTodos.size();
        long completed = allTodos.stream().filter(Todo::isCompleted).count();
        long active = total - completed;

        statusLabel.setText(String.format("Total: %d | Active: %d | Completed: %d",
                total, active, completed));
    }

    /**
     * Save todos to file
     */
    private void saveTodos() {
        storageService.saveTodos(allTodos);
    }

    /**
     * Load todos from file
     */
    private void loadTodos() {
        allTodos.clear();
        allTodos.addAll(storageService.loadTodos());
        System.out.println("Loaded " + allTodos.size() + " todos");
    }

    /**
     * Show alert dialog
     *
     * @param title   the dialog title
     * @param message the message
     */
    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    /**
     * Show confirmation dialog
     *
     * @param title   the dialog title
     * @param header  the header text
     * @param content the content text
     * @return the user's choice
     */
    private Optional<ButtonType> showConfirmation(String title, String header, String content) {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
        alert.setTitle(title);
        alert.setHeaderText(header);
        alert.setContentText(content);
        return alert.showAndWait();
    }

    /**
     * Handle application exit
     * Called when window is closing
     */
    public void handleExit() {
        System.out.println("Application closing, saving todos...");
        saveTodos();
    }
}
