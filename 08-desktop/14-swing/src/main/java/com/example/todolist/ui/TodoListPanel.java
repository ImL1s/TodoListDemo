package com.example.todolist.ui;

import com.example.todolist.model.Todo;
import com.example.todolist.service.StorageService;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Todo List Panel
 *
 * Main panel containing all UI components for the todo list application.
 */
public class TodoListPanel extends JPanel {

    private final List<Todo> allTodos = new ArrayList<>();
    private final StorageService storageService = new StorageService();

    private JTextField inputField;
    private JButton addButton;
    private JPanel todoListContainer;
    private JScrollPane scrollPane;
    private JLabel statusLabel;
    private JButton clearCompletedButton;
    private ButtonGroup filterGroup;
    private JRadioButton filterAll;
    private JRadioButton filterActive;
    private JRadioButton filterCompleted;

    private String currentFilter = "all";

    /**
     * Constructor
     */
    public TodoListPanel() {
        initializeComponents();
        layoutComponents();
        loadTodos();
        updateDisplay();
    }

    /**
     * Initialize all UI components
     */
    private void initializeComponents() {
        setLayout(new BorderLayout(0, 15));
        setBackground(new Color(245, 247, 250));
        setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        // Input field
        inputField = new JTextField();
        inputField.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        inputField.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(209, 213, 219), 1),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));
        inputField.addActionListener(e -> addTodo());

        // Add button
        addButton = new JButton("Add");
        addButton.setFont(new Font("Segoe UI", Font.BOLD, 14));
        addButton.setBackground(new Color(59, 130, 246));
        addButton.setForeground(Color.WHITE);
        addButton.setFocusPainted(false);
        addButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        addButton.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));
        addButton.addActionListener(e -> addTodo());

        // Add hover effect for add button
        addButton.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                addButton.setBackground(new Color(37, 99, 235));
            }

            public void mouseExited(java.awt.event.MouseEvent evt) {
                addButton.setBackground(new Color(59, 130, 246));
            }
        });

        // Todo list container
        todoListContainer = new JPanel();
        todoListContainer.setLayout(new BoxLayout(todoListContainer, BoxLayout.Y_AXIS));
        todoListContainer.setBackground(Color.WHITE);
        todoListContainer.setBorder(BorderFactory.createLineBorder(new Color(229, 231, 235), 1));

        // Scroll pane
        scrollPane = new JScrollPane(todoListContainer);
        scrollPane.setBorder(null);
        scrollPane.getVerticalScrollBar().setUnitIncrement(16);

        // Status label
        statusLabel = new JLabel("Total: 0 | Active: 0 | Completed: 0");
        statusLabel.setFont(new Font("Segoe UI", Font.BOLD, 12));
        statusLabel.setForeground(new Color(107, 114, 128));

        // Clear completed button
        clearCompletedButton = new JButton("Clear Completed");
        clearCompletedButton.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        clearCompletedButton.setBackground(new Color(239, 68, 68));
        clearCompletedButton.setForeground(Color.WHITE);
        clearCompletedButton.setFocusPainted(false);
        clearCompletedButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        clearCompletedButton.setBorder(BorderFactory.createEmptyBorder(6, 12, 6, 12));
        clearCompletedButton.addActionListener(e -> clearCompleted());

        // Add hover effect for clear button
        clearCompletedButton.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                clearCompletedButton.setBackground(new Color(220, 38, 38));
            }

            public void mouseExited(java.awt.event.MouseEvent evt) {
                clearCompletedButton.setBackground(new Color(239, 68, 68));
            }
        });

        // Filter radio buttons
        filterAll = new JRadioButton("All", true);
        filterActive = new JRadioButton("Active");
        filterCompleted = new JRadioButton("Completed");

        filterGroup = new ButtonGroup();
        filterGroup.add(filterAll);
        filterGroup.add(filterActive);
        filterGroup.add(filterCompleted);

        // Style radio buttons
        for (JRadioButton radio : new JRadioButton[]{filterAll, filterActive, filterCompleted}) {
            radio.setFont(new Font("Segoe UI", Font.PLAIN, 13));
            radio.setBackground(Color.WHITE);
            radio.setFocusPainted(false);
            radio.setCursor(new Cursor(Cursor.HAND_CURSOR));
            radio.addActionListener(e -> {
                currentFilter = radio == filterAll ? "all" : radio == filterActive ? "active" : "completed";
                updateDisplay();
            });
        }
    }

    /**
     * Layout all components
     */
    private void layoutComponents() {
        // Header panel
        JPanel headerPanel = new JPanel(new BorderLayout(0, 5));
        headerPanel.setBackground(new Color(245, 247, 250));

        JLabel titleLabel = new JLabel("TodoList");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 32));
        titleLabel.setForeground(new Color(44, 62, 80));

        JLabel subtitleLabel = new JLabel("Organize your tasks efficiently");
        subtitleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        subtitleLabel.setForeground(new Color(127, 140, 141));

        headerPanel.add(titleLabel, BorderLayout.NORTH);
        headerPanel.add(subtitleLabel, BorderLayout.CENTER);

        // Input panel
        JPanel inputPanel = new JPanel(new BorderLayout(10, 0));
        inputPanel.setBackground(new Color(245, 247, 250));
        inputPanel.add(inputField, BorderLayout.CENTER);
        inputPanel.add(addButton, BorderLayout.EAST);

        // Filter panel
        JPanel filterPanel = new JPanel(new BorderLayout());
        filterPanel.setBackground(Color.WHITE);
        filterPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(229, 231, 235), 1),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));

        JPanel filterLeftPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 0));
        filterLeftPanel.setBackground(Color.WHITE);

        JLabel filterLabel = new JLabel("Filter:");
        filterLabel.setFont(new Font("Segoe UI", Font.BOLD, 13));
        filterLabel.setForeground(new Color(107, 114, 128));

        filterLeftPanel.add(filterLabel);
        filterLeftPanel.add(filterAll);
        filterLeftPanel.add(filterActive);
        filterLeftPanel.add(filterCompleted);

        JPanel filterRightPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        filterRightPanel.setBackground(Color.WHITE);
        filterRightPanel.add(clearCompletedButton);

        filterPanel.add(filterLeftPanel, BorderLayout.WEST);
        filterPanel.add(filterRightPanel, BorderLayout.EAST);

        // Status panel
        JPanel statusPanel = new JPanel(new BorderLayout());
        statusPanel.setBackground(Color.WHITE);
        statusPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(229, 231, 235), 1),
                BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));
        statusPanel.add(statusLabel, BorderLayout.WEST);

        // Top panel (header + input)
        JPanel topPanel = new JPanel(new BorderLayout(0, 15));
        topPanel.setBackground(new Color(245, 247, 250));
        topPanel.add(headerPanel, BorderLayout.NORTH);
        topPanel.add(inputPanel, BorderLayout.CENTER);
        topPanel.add(filterPanel, BorderLayout.SOUTH);

        // Main layout
        add(topPanel, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);
        add(statusPanel, BorderLayout.SOUTH);
    }

    /**
     * Add a new todo
     */
    private void addTodo() {
        String text = inputField.getText().trim();

        if (text.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Please enter a todo text.",
                    "Empty Todo",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        // Create new todo
        Todo todo = new Todo(text);
        allTodos.add(todo);

        // Clear input
        inputField.setText("");

        // Update display and save
        updateDisplay();
        saveTodos();

        System.out.println("Todo added: " + todo);
    }

    /**
     * Delete a todo
     *
     * @param todo the todo to delete
     */
    private void deleteTodo(Todo todo) {
        int result = JOptionPane.showConfirmDialog(this,
                "Are you sure you want to delete this todo?\n\"" + todo.getText() + "\"",
                "Delete Todo",
                JOptionPane.YES_NO_OPTION,
                JOptionPane.QUESTION_MESSAGE);

        if (result == JOptionPane.YES_OPTION) {
            allTodos.remove(todo);
            updateDisplay();
            saveTodos();
            System.out.println("Todo deleted: " + todo);
        }
    }

    /**
     * Clear all completed todos
     */
    private void clearCompleted() {
        long completedCount = allTodos.stream().filter(Todo::isCompleted).count();

        if (completedCount == 0) {
            JOptionPane.showMessageDialog(this,
                    "There are no completed todos to clear.",
                    "No Completed Todos",
                    JOptionPane.INFORMATION_MESSAGE);
            return;
        }

        int result = JOptionPane.showConfirmDialog(this,
                "Are you sure you want to delete all completed todos?\n" +
                        completedCount + " todo(s) will be deleted.",
                "Clear Completed",
                JOptionPane.YES_NO_OPTION,
                JOptionPane.QUESTION_MESSAGE);

        if (result == JOptionPane.YES_OPTION) {
            allTodos.removeIf(Todo::isCompleted);
            updateDisplay();
            saveTodos();
            System.out.println("Cleared " + completedCount + " completed todos");
        }
    }

    /**
     * Update the display based on current filter
     */
    private void updateDisplay() {
        // Clear container
        todoListContainer.removeAll();

        // Get filtered todos
        List<Todo> filteredTodos = getFilteredTodos();

        // Add todo items
        if (filteredTodos.isEmpty()) {
            JLabel emptyLabel = new JLabel("No todos yet. Add one above!");
            emptyLabel.setFont(new Font("Segoe UI", Font.ITALIC, 14));
            emptyLabel.setForeground(new Color(156, 163, 175));
            emptyLabel.setHorizontalAlignment(SwingConstants.CENTER);
            emptyLabel.setBorder(BorderFactory.createEmptyBorder(40, 20, 40, 20));
            todoListContainer.add(emptyLabel);
        } else {
            for (Todo todo : filteredTodos) {
                TodoItemPanel itemPanel = new TodoItemPanel(todo);
                itemPanel.setToggleListener(e -> {
                    updateStatus();
                    saveTodos();
                });
                itemPanel.setDeleteListener(e -> deleteTodo(todo));
                todoListContainer.add(itemPanel);
            }
        }

        // Update status
        updateStatus();

        // Refresh UI
        todoListContainer.revalidate();
        todoListContainer.repaint();
    }

    /**
     * Get filtered todos based on current filter
     *
     * @return list of filtered todos
     */
    private List<Todo> getFilteredTodos() {
        return switch (currentFilter) {
            case "active" -> allTodos.stream().filter(t -> !t.isCompleted()).toList();
            case "completed" -> allTodos.stream().filter(Todo::isCompleted).toList();
            default -> new ArrayList<>(allTodos);
        };
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
     * Handle application exit
     */
    public void handleExit() {
        System.out.println("Application closing, saving todos...");
        saveTodos();
    }
}
