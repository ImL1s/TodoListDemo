package com.example.todolist.ui;

import com.example.todolist.model.Todo;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionListener;

/**
 * Todo Item Panel
 *
 * Represents a single todo item in the list.
 * Contains a checkbox, label, and delete button.
 */
public class TodoItemPanel extends JPanel {

    private final Todo todo;
    private final JCheckBox checkBox;
    private final JLabel textLabel;
    private final JButton deleteButton;

    private ActionListener toggleListener;
    private ActionListener deleteListener;

    /**
     * Constructor
     *
     * @param todo the todo item to display
     */
    public TodoItemPanel(Todo todo) {
        this.todo = todo;

        // Set layout
        setLayout(new BorderLayout(10, 0));
        setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(230, 230, 230)),
                BorderFactory.createEmptyBorder(12, 15, 12, 15)
        ));
        setBackground(Color.WHITE);

        // Create checkbox
        checkBox = new JCheckBox();
        checkBox.setSelected(todo.isCompleted());
        checkBox.setFocusPainted(false);
        checkBox.setBackground(Color.WHITE);
        checkBox.setCursor(new Cursor(Cursor.HAND_CURSOR));

        // Create text label
        textLabel = new JLabel(todo.getText());
        textLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        updateTextStyle();

        // Create delete button
        deleteButton = new JButton("Delete");
        deleteButton.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        deleteButton.setFocusPainted(false);
        deleteButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        deleteButton.setBackground(new Color(254, 202, 202));
        deleteButton.setForeground(new Color(153, 27, 27));
        deleteButton.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(252, 165, 165), 1),
                BorderFactory.createEmptyBorder(5, 12, 5, 12)
        ));

        // Add hover effect for delete button
        deleteButton.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                deleteButton.setBackground(new Color(252, 165, 165));
            }

            public void mouseExited(java.awt.event.MouseEvent evt) {
                deleteButton.setBackground(new Color(254, 202, 202));
            }
        });

        // Add components
        add(checkBox, BorderLayout.WEST);
        add(textLabel, BorderLayout.CENTER);
        add(deleteButton, BorderLayout.EAST);

        // Set up event handlers
        checkBox.addActionListener(e -> {
            todo.toggle();
            updateTextStyle();
            if (toggleListener != null) {
                toggleListener.actionPerformed(e);
            }
        });

        deleteButton.addActionListener(e -> {
            if (deleteListener != null) {
                deleteListener.actionPerformed(e);
            }
        });

        // Add hover effect for the panel
        addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                if (!todo.isCompleted()) {
                    setBackground(new Color(249, 250, 251));
                    checkBox.setBackground(new Color(249, 250, 251));
                }
            }

            public void mouseExited(java.awt.event.MouseEvent evt) {
                setBackground(Color.WHITE);
                checkBox.setBackground(Color.WHITE);
            }
        });
    }

    /**
     * Update text style based on completion status
     */
    private void updateTextStyle() {
        if (todo.isCompleted()) {
            // Strikethrough and gray text for completed todos
            textLabel.setText("<html><strike>" + todo.getText() + "</strike></html>");
            textLabel.setForeground(new Color(136, 136, 136));
        } else {
            // Normal text for active todos
            textLabel.setText(todo.getText());
            textLabel.setForeground(new Color(31, 41, 55));
        }
    }

    /**
     * Get the associated todo
     *
     * @return the todo item
     */
    public Todo getTodo() {
        return todo;
    }

    /**
     * Set the toggle listener
     *
     * @param listener the action listener
     */
    public void setToggleListener(ActionListener listener) {
        this.toggleListener = listener;
    }

    /**
     * Set the delete listener
     *
     * @param listener the action listener
     */
    public void setDeleteListener(ActionListener listener) {
        this.deleteListener = listener;
    }

    /**
     * Refresh the display
     */
    public void refresh() {
        checkBox.setSelected(todo.isCompleted());
        updateTextStyle();
        revalidate();
        repaint();
    }
}
