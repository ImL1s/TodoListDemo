package com.example.todolist;

import com.example.todolist.ui.TodoListPanel;
import com.formdev.flatlaf.FlatLightLaf;

import javax.swing.*;
import java.awt.*;

/**
 * Swing TodoList Application
 *
 * Main entry point for the Swing desktop application.
 * Uses FlatLaf for modern Look and Feel.
 */
public class TodoApp extends JFrame {

    private TodoListPanel todoListPanel;

    /**
     * Constructor
     */
    public TodoApp() {
        initializeFrame();
        createComponents();
        setupEventHandlers();
        finalizeFrame();
    }

    /**
     * Initialize the main frame
     */
    private void initializeFrame() {
        setTitle("TodoList - Swing");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(750, 650);
        setMinimumSize(new Dimension(550, 450));
        setLocationRelativeTo(null); // Center on screen

        // Set application icon (optional)
        try {
            // You can add an icon if available
            // setIconImage(new ImageIcon(getClass().getResource("/icon.png")).getImage());
        } catch (Exception e) {
            // Ignore if icon not found
        }
    }

    /**
     * Create main components
     */
    private void createComponents() {
        // Create main panel
        todoListPanel = new TodoListPanel();

        // Add to frame
        setContentPane(todoListPanel);
    }

    /**
     * Set up event handlers
     */
    private void setupEventHandlers() {
        // Handle window closing
        addWindowListener(new java.awt.event.WindowAdapter() {
            @Override
            public void windowClosing(java.awt.event.WindowEvent e) {
                if (todoListPanel != null) {
                    todoListPanel.handleExit();
                }
            }
        });
    }

    /**
     * Finalize frame setup
     */
    private void finalizeFrame() {
        // Pack and display
        setVisible(true);

        System.out.println("========================================");
        System.out.println("TodoList Swing Application Started");
        System.out.println("Using FlatLaf Look and Feel");
        System.out.println("========================================");
    }

    /**
     * Main entry point
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        // Set Look and Feel to FlatLaf
        try {
            UIManager.setLookAndFeel(new FlatLightLaf());
            System.out.println("FlatLaf Look and Feel loaded successfully");
        } catch (Exception e) {
            System.err.println("Failed to initialize FlatLaf, using default Look and Feel");
            e.printStackTrace();

            // Fallback to system Look and Feel
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        // Set some UI properties
        UIManager.put("Button.arc", 8);
        UIManager.put("Component.arc", 8);
        UIManager.put("TextComponent.arc", 8);

        // Create and show GUI on Event Dispatch Thread
        SwingUtilities.invokeLater(() -> {
            try {
                new TodoApp();
            } catch (Exception e) {
                System.err.println("Error creating TodoApp: " + e.getMessage());
                e.printStackTrace();
                JOptionPane.showMessageDialog(null,
                        "Failed to start application: " + e.getMessage(),
                        "Error",
                        JOptionPane.ERROR_MESSAGE);
                System.exit(1);
            }
        });
    }
}
